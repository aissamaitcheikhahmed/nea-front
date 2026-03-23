import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanelPage from './pages/AdminPanelPage';

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <LanguageProvider>
          <ProductProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/producten" element={<ProductListPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminPanelPage />} />
              </Routes>
              <CartDrawer />
            </CartProvider>
          </ProductProvider>
        </LanguageProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
