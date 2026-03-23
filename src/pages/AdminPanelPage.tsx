import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useProducts } from '../context/ProductContext';

export default function AdminPanelPage() {
  const { isAuthenticated, logout } = useAdminAuth();
  const { addProduct } = useProducts();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('conference');
  const [message, setMessage] = useState('');

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addProduct({
      name: name.trim(),
      description: description.trim(),
      image: image.trim(),
      price: Number(price),
      category,
    });
    setName('');
    setDescription('');
    setImage('');
    setPrice('');
    setCategory('conference');
    setMessage('Product added and linked to product list.');
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#1f3d54]">Admin Panel</h1>
          <button onClick={logout} className="text-sm bg-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors">
            Logout
          </button>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5"
            placeholder="Product name"
            required
          />
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5"
            placeholder="Image URL"
            required
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            className="border border-gray-300 rounded-lg px-4 py-2.5"
            placeholder="Price"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2.5"
          >
            <option value="conference">Conference</option>
            <option value="market">Market</option>
            <option value="expo">Expo</option>
            <option value="outdoor">Outdoor</option>
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="md:col-span-2 border border-gray-300 rounded-lg px-4 py-2.5 min-h-28"
            placeholder="Description"
            required
          />
          <button type="submit" className="md:col-span-2 bg-[#1f3d54] text-white rounded-lg py-2.5 hover:bg-[#173042] transition-colors">
            Add Product
          </button>
        </form>

        {message && <p className="mt-4 text-green-700 text-sm">{message}</p>}
      </div>
    </div>
  );
}
