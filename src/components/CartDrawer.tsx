import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={closeCart}
        aria-hidden="true"
      />
      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-[#F4F0E4] shadow-xl z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#537D96]">{t.cart.title}</h2>
          <button
            onClick={closeCart}
            className="p-2 text-gray-600 hover:text-[#EC8F8D] transition-colors"
            aria-label={t.cart.close}
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-gray-600 text-center py-8">{t.cart.empty}</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 bg-white rounded-xl p-4 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[#44A194] font-medium">
                      €{item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                        aria-label={t.cart.remove}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                        aria-label="Add"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm self-start"
                  >
                    {t.cart.remove}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex justify-between text-lg font-bold text-[#537D96]">
              <span>{t.cart.total}</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-[#44A194] text-white py-3 rounded-full font-semibold hover:bg-[#3a8a7d] transition-colors">
              {t.cart.checkout}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
