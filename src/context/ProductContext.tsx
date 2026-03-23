import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { dummyProducts, type Product } from '../data/products';

const STORAGE_KEY = 'nea_events_custom_products';

interface ProductContextValue {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
}

const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [customProducts, setCustomProducts] = useState<Product[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Product[];
      if (Array.isArray(parsed)) setCustomProducts(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customProducts));
  }, [customProducts]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setCustomProducts((prev) => [{ ...product, id }, ...prev]);
  };

  const products = useMemo(() => [...customProducts, ...dummyProducts], [customProducts]);

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
