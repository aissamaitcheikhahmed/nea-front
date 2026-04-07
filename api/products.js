/**
 * Vercel Serverless: GET /api/products | POST /api/products
 *
 * POST (JSON): { name, description, price, category, image } — image is HTTPS URL from client Blob upload.
 *   Header: Authorization: Bearer <ADMIN_API_SECRET>
 *   (Large files use /api/blob-upload + @vercel/blob/client upload() first — see AdminPanel.)
 */

import { MongoClient } from 'mongodb';

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

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function isAllowedImageUrl(url) {
  if (typeof url !== 'string' || url.length > 2048) return false;
  if (!url.startsWith('https://')) return false;
  try {
    const u = new URL(url);
    return u.hostname.endsWith('.blob.vercel-storage.com') || u.hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
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
            'Set MONGODB_URI in Vercel env. POST needs ADMIN_API_SECRET; images use client upload to Blob.',
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

  const mongoClient = await getMongoClient();
  if (!mongoClient) {
    res.statusCode = 500;
    return res.end(
      JSON.stringify({
        error: 'MONGODB_URI is not set',
        hint:
          'Add MONGODB_URI in Vercel → Project → Settings → Environment Variables (Production + Preview), then Redeploy.',
      })
    );
  }

  let data;
  try {
    const raw = await readBody(req);
    data = JSON.parse(raw);
  } catch (e) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Invalid JSON body', message: String(e.message) }));
  }

  const name = String(data.name ?? '').trim();
  const description = String(data.description ?? '').trim();
  const price = Number(data.price);
  const category = String(data.category ?? '').trim();
  const imageUrl = String(data.image ?? '').trim();

  if (!name || !description || !Number.isFinite(price) || price < 0) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Invalid name, description, or price' }));
  }

  if (!SHOP_CATEGORY_SLUGS.includes(category)) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'Invalid category', allowed: SHOP_CATEGORY_SLUGS }));
  }

  if (!isAllowedImageUrl(imageUrl)) {
    res.statusCode = 400;
    return res.end(
      JSON.stringify({
        error: 'Invalid image URL',
        hint: 'Must be an https:// URL on *.blob.vercel-storage.com (from client Blob upload).',
      })
    );
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
