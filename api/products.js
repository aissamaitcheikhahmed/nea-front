/**
 * Vercel Serverless: GET /api/products | POST /api/products
 *
 * POST: multipart/form-data (use FormData in the browser — never JSON for file uploads)
 *   Fields: name, description, price, category, image (file)
 *   Header: Authorization: Bearer <ADMIN_API_SECRET>
 *
 * Env (Vercel Project Settings):
 *   MONGODB_URI
 *   MONGODB_DB (optional, default neaevents)
 *   MONGODB_PRODUCTS_COLLECTION (optional, default products)
 *   BLOB_READ_WRITE_TOKEN — from Vercel Blob store
 *   ADMIN_API_SECRET — same value as VITE_ADMIN_API_SECRET in the frontend build
 */

import { readFile, unlink } from 'fs/promises';
import path from 'path';
import { MongoClient } from 'mongodb';
import formidable from 'formidable';
import { put } from '@vercel/blob';

const SHOP_CATEGORY_SLUGS = [
  'borden',
  'glazen',
  'bestek',
  'bloemen',
  'linnen',
  'accessoires',
];

const CATEGORY_LABELS = {
  borden: 'Borden',
  glazen: 'Glazen',
  bestek: 'Bestek',
  bloemen: 'Bloemen & Vazen',
  linnen: 'Linnen',
  accessoires: 'Accessoires',
};

const categories = SHOP_CATEGORY_SLUGS.map((slug) => ({
  slug,
  label: CATEGORY_LABELS[slug] ?? slug,
}));

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

let cachedClient;

async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  return cachedClient;
}

function mapDoc(doc) {
  const id = doc._id != null ? String(doc._id) : doc.id;
  return {
    id,
    name: doc.name ?? '',
    description: doc.description ?? '',
    image: doc.image ?? '',
    price: typeof doc.price === 'number' ? doc.price : Number(doc.price) || 0,
    category: doc.category ?? '',
  };
}

function first(val) {
  if (val == null) return '';
  return Array.isArray(val) ? val[0] : val;
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function unauthorized(res) {
  res.statusCode = 401;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Unauthorized' }));
}

async function handleGet(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const dbName = process.env.MONGODB_DB || 'neaevents';
  const collectionName = process.env.MONGODB_PRODUCTS_COLLECTION || 'products';

  const client = await getMongoClient();

  if (!client) {
    return res.end(
      JSON.stringify({
        products: [],
        categories,
        meta: {
          source: 'unconfigured',
          message:
            'Set MONGODB_URI in Vercel env. POST also needs BLOB_READ_WRITE_TOKEN and ADMIN_API_SECRET.',
        },
      })
    );
  }

  const db = client.db(dbName);
  const coll = db.collection(collectionName);

  const url = new URL(req.url || '/', 'http://local');
  const categoryFilter = url.searchParams.get('category');
  const query =
    categoryFilter && SHOP_CATEGORY_SLUGS.includes(categoryFilter)
      ? { category: categoryFilter }
      : {};

  const docs = await coll.find(query).sort({ createdAt: -1, name: 1 }).toArray();
  const products = docs.map(mapDoc);

  return res.end(
    JSON.stringify({
      products,
      categories,
      meta: { source: 'mongodb', count: products.length },
    })
  );
}

async function handlePost(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const secret = process.env.ADMIN_API_SECRET;
  const auth = req.headers.authorization;
  if (!secret || auth !== `Bearer ${secret}`) {
    return unauthorized(res);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'BLOB_READ_WRITE_TOKEN is not set' }));
  }

  const mongoClient = await getMongoClient();
  if (!mongoClient) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'MONGODB_URI is not set' }));
  }

  // Stay under Vercel serverless request body limit (~4.5 MB on Hobby).
  const form = formidable({
    maxFileSize: Math.floor(4.5 * 1024 * 1024),
    allowEmptyFiles: false,
  });

  let fields;
  let files;
  try {
    [fields, files] = await form.parse(req);
  } catch (e) {
    console.error('[api/products] parse', e);
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Invalid multipart form', message: String(e.message) }));
  }

  const name = String(first(fields.name) ?? '').trim();
  const description = String(first(fields.description) ?? '').trim();
  const priceRaw = first(fields.price);
  const category = String(first(fields.category) ?? '').trim();

  const price = typeof priceRaw === 'string' || typeof priceRaw === 'number' ? Number(priceRaw) : NaN;

  if (!name || !description || !Number.isFinite(price) || price < 0) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Invalid name, description, or price' }));
  }

  if (!SHOP_CATEGORY_SLUGS.includes(category)) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Invalid category', allowed: SHOP_CATEGORY_SLUGS }));
  }

  const imageField = files.image;
  const file = Array.isArray(imageField) ? imageField[0] : imageField;
  if (!file || !file.filepath) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Image file is required (field name: image)' }));
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.mimetype || '')) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Only JPEG, PNG, WebP, or GIF images are allowed' }));
  }

  const ext = path.extname(file.originalFilename || '') || '.jpg';
  const safeExt = ext.length <= 8 ? ext : '.jpg';
  const pathname = `products/${Date.now()}${safeExt}`;

  let buffer;
  try {
    buffer = await readFile(file.filepath);
  } finally {
    try {
      await unlink(file.filepath);
    } catch {
      /* temp file may already be removed */
    }
  }

  let imageUrl;
  try {
    const blob = await put(pathname, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.mimetype || 'image/jpeg',
      addRandomSuffix: true,
    });
    imageUrl = blob.url;
  } catch (e) {
    console.error('[api/products] blob put', e);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Blob upload failed', message: String(e.message) }));
  }

  const dbName = process.env.MONGODB_DB || 'neaevents';
  const collectionName = process.env.MONGODB_PRODUCTS_COLLECTION || 'products';
  const coll = mongoClient.db(dbName).collection(collectionName);

  const doc = {
    name,
    description,
    image: imageUrl,
    price,
    category,
    createdAt: new Date(),
  };

  let result;
  try {
    result = await coll.insertOne(doc);
  } catch (e) {
    console.error('[api/products] insert', e);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to save product', message: String(e.message) }));
  }

  const saved = await coll.findOne({ _id: result.insertedId });
  res.statusCode = 201;
  return res.end(
    JSON.stringify({
      ok: true,
      product: saved ? mapDoc(saved) : mapDoc({ ...doc, _id: result.insertedId }),
    })
  );
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  try {
    if (req.method === 'GET') {
      return await handleGet(req, res);
    }
    if (req.method === 'POST') {
      return await handlePost(req, res);
    }
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  } catch (err) {
    console.error('[api/products]', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? String(err.message) : undefined,
      })
    );
  }
}
