import { useRef, useState } from 'react';
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

export default function AdminPanelPage() {
  const { isAuthenticated, logout } = useAdminAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('borden');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const secret = import.meta.env.VITE_ADMIN_API_SECRET;
    if (!secret) {
      setError('Missing VITE_ADMIN_API_SECRET — add it to .env and Vercel (must match ADMIN_API_SECRET).');
      return;
    }

    if (!file) {
      setError('Choose an image file.');
      return;
    }

    const apiOrigin = import.meta.env.VITE_API_ORIGIN?.trim().replace(/\/$/, '') ?? '';
    const blobUploadUrl = apiOrigin ? `${apiOrigin}/api/blob-upload` : '/api/blob-upload';
    const productsUrl = apiOrigin ? `${apiOrigin}/api/products` : '/api/products';

    const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '.jpg';
    const pathname = `products/${Date.now()}${ext}`;

    setSubmitting(true);
    try {
      const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: blobUploadUrl,
        headers: {
          Authorization: `Bearer ${secret}`,
        },
        multipart: true,
      });

      const res = await fetch(productsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          category,
          image: blob.url,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean; hint?: string };

      if (!res.ok) {
        setError([data.error, data.hint].filter(Boolean).join(' — ') || `Request failed (${res.status})`);
        return;
      }

      setName('');
      setDescription('');
      setPrice('');
      setCategory('borden');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage('Image uploaded to Blob and product saved in MongoDB.');
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
          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 bg-[#1f3d54] text-white rounded-lg py-2.5 hover:bg-[#173042] transition-colors disabled:opacity-60"
          >
            {submitting ? 'Uploading…' : 'Add product'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-700 text-sm">{error}</p>}
        {message && <p className="mt-4 text-green-700 text-sm">{message}</p>}
      </div>
    </div>
  );
}
