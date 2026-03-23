import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { ShoppingCart } from 'lucide-react';

export default function ProductListPage() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { products } = useProducts();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#537D96] mb-4">
              {t.products.title}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t.products.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-[#44A194] font-semibold mb-4">
                    {t.products.from} €{product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() =>
                      addItem({
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                      })
                    }
                    className="w-full flex items-center justify-center gap-2 bg-[#44A194] text-white px-4 py-2.5 rounded-full text-sm hover:bg-[#3a8a7d] transition-colors"
                  >
                    <ShoppingCart size={18} />
                    {t.products.addToCart}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
