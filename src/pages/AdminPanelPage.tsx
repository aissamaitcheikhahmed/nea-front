import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { upload } from '@vercel/blob/client';
import { useAdminAuth } from '../context/AdminAuthContext';

const SHOP_CATEGORIES: { slug: string; label: string }[] = [
  { slug: 'borden', label: 'Borden' },
  { slug: 'glazen', label: 'Glazen' },
  { slug: 'bestek', label: 'Bestek' },
  { slug: 'bloemen', label: 'Bloemen & Vazen' },
  { slug: 'linnen', label: 'Linnen' },
  { slug: 'accessoires', label: 'Accessoires' },
];

type AdminProduct = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
};

export default function AdminPanelPage() {
  const { isAuthenticated, logout } = useAdminAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('borden');
  const [file, setFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const apiOrigin = import.meta.env.VITE_API_ORIGIN?.trim().replace(/\/$/, '') ?? '';
  const blobUploadUrl = apiOrigin ? `${apiOrigin}/api/blob-upload` : '/api/blob-upload';
  const productsUrl = apiOrigin ? `${apiOrigin}/api/products` : '/api/products';

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setCategory('borden');
    setFile(null);
    setExistingImageUrl('');
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(productsUrl);
      const data = (await res.json()) as { products?: AdminProduct[] };
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch {
      // Keep this non-blocking; form still works even if list fetch fails.
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const startEdit = (p: AdminProduct) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description);
    setPrice(String(p.price));
    setCategory(p.category);
    setExistingImageUrl(p.image);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const secret = import.meta.env.VITE_ADMIN_API_SECRET;
    if (!secret) {
      setError('Missing VITE_ADMIN_API_SECRET — add it to .env and Vercel.');
      return;
    }
    setError('');
    setMessage('');
    setDeletingId(id);
    try {
      const res = await fetch(`${productsUrl}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || `Delete failed (${res.status})`);
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
      setMessage('Product deleted.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const secret = import.meta.env.VITE_ADMIN_API_SECRET;
    if (!secret) {
      setError('Missing VITE_ADMIN_API_SECRET — add it to .env and Vercel (must match ADMIN_API_SECRET).');
      return;
    }

    if (!file && !editingId) {
      setError('Choose an image file.');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = existingImageUrl;
      if (file) {
        const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '.jpg';
        const pathname = `products/${Date.now()}${ext}`;
        const blob = await upload(pathname, file, {
          access: 'public',
          handleUploadUrl: blobUploadUrl,
          headers: {
            Authorization: `Bearer ${secret}`,
          },
          multipart: true,
        });
        imageUrl = blob.url;
      }

      const res = await fetch(productsUrl, {
        method: editingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          category,
          image: imageUrl,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        ok?: boolean;
        hint?: string;
        product?: AdminProduct;
      };

      if (!res.ok) {
        setError([data.error, data.hint].filter(Boolean).join(' — ') || `Request failed (${res.status})`);
        return;
      }

      if (data.product) {
        setProducts((prev) => {
          if (editingId) {
            return prev.map((p) => (p.id === data.product!.id ? data.product! : p));
          }
          return [data.product!, ...prev];
        });
      } else {
        await loadProducts();
      }

      resetForm();
      setMessage(editingId ? 'Product updated.' : 'Image uploaded to Blob and product saved in MongoDB.');
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} — Local: run \`npx vercel dev\` and set VITE_API_ORIGIN=http://localhost:3000 if needed.`
          : 'Network error.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1f3d54]">Admin Panel</h1>
          <button
            onClick={logout}
            className="text-sm bg-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add product</h2>
        {editingId ? (
          <p className="text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4">
            Editing existing product. Update fields and save, or cancel to switch back to add mode.
          </p>
        ) : null}
        <p className="text-sm text-gray-600 mb-4">
          Large images upload <strong>directly to Vercel Blob</strong> from your browser (no 4.5 MB server limit), then we save the image URL in MongoDB. Same{' '}
          <code className="bg-gray-100 px-1 rounded">ADMIN_API_SECRET</code> /{' '}
          <code className="bg-gray-100 px-1 rounded">VITE_ADMIN_API_SECRET</code>.
        </p>
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          <strong>Local dev:</strong> <code className="bg-white px-1 rounded">npx vercel dev</code> on :3000 + optional{' '}
          <code className="bg-white px-1 rounded">VITE_API_ORIGIN=http://localhost:3000</code>. Restart Vite after .env changes.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5"
            placeholder="Product name"
            required
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            className="border border-gray-300 rounded-lg px-4 py-2.5"
            placeholder="Price (EUR)"
            required
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#1f3d54] file:text-white"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
              <span>Preview:</span>
              {previewUrl ? (
                <img src={previewUrl} alt="new upload preview" className="h-14 w-14 object-cover rounded border" />
              ) : existingImageUrl ? (
                <img src={existingImageUrl} alt="current product" className="h-14 w-14 object-cover rounded border" />
              ) : (
                <span>no image selected</span>
              )}
            </div>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-2.5"
          >
            {SHOP_CATEGORIES.map(({ slug, label }) => (
              <option key={slug} value={slug}>
                {label}
              </option>
            ))}
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-2.5 min-h-28"
            placeholder="Description"
            required
          />
          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#1f3d54] text-white rounded-lg py-2.5 hover:bg-[#173042] transition-colors disabled:opacity-60"
            >
              {submitting ? 'Uploading…' : editingId ? 'Save changes' : 'Add product'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        {error && <p className="mt-4 text-red-700 text-sm">{error}</p>}
        {message && <p className="mt-4 text-green-700 text-sm">{message}</p>}

        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Current products</h3>
          {loadingProducts ? <p className="text-sm text-gray-500">Loading products…</p> : null}
          {!loadingProducts && products.length === 0 ? (
            <p className="text-sm text-gray-500">No products found in MongoDB yet.</p>
          ) : null}
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="border border-gray-200 rounded-xl p-3 flex items-start gap-3 bg-gray-50">
                <img src={p.image} alt={p.name} className="h-16 w-16 object-cover rounded-lg border bg-white" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{p.category} · €{p.price.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm disabled:opacity-60"
                      >
                        {deletingId === p.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
