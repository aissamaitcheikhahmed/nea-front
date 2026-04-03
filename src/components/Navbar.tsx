import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import type { Locale } from '../i18n/translations';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { t, locale, setLocale } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollToSection = (id: string) => {
    if (!isHome) return;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navLink = (label: string, to: string, sectionId?: string) => {
    if (sectionId && isHome) {
      return (
        <button
          onClick={() => scrollToSection(sectionId)}
          className="text-gray-700 hover:text-[#EC8F8D] transition-colors"
        >
          {label}
        </button>
      );
    }
    return (
      <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className="text-gray-700 hover:text-[#EC8F8D] transition-colors"
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
            <h1 className="text-2xl font-bold text-[#1f3d54]">Nea Events</h1>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLink(t.nav.home, '/', 'home')}
            {navLink(t.nav.aanbod, '/', 'aanbod')}
            {navLink(t.nav.nieuw, '/', 'nieuw')}
            {navLink(t.nav.inspiratie, '/', 'inspiratie')}
            <Link
              to="/"
              state={{ weddingPage: 'winkel' }}
              className="text-gray-700 hover:text-[#1f3d54] transition-colors"
            >
              {t.nav.products}
            </Link>
            <div className="flex items-center rounded-full border border-gray-200 p-0.5 text-sm font-semibold">
              {(['nl', 'fr'] as const satisfies readonly Locale[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`rounded-full px-2.5 py-1 transition-colors ${
                    locale === code ? 'bg-[#1f3d54] text-white' : 'text-gray-600 hover:text-[#1f3d54]'
                  }`}
                  aria-pressed={locale === code}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-[#1f3d54] transition-colors"
              aria-label={t.nav.cartAria}
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1f3d54] text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            {isHome ? (
              <button
                onClick={() => scrollToSection('aanbod')}
                className="bg-[#1f3d54] text-white px-6 py-2 rounded-full hover:bg-[#173042] transition-colors"
              >
                {t.nav.quoteRequest}
              </button>
            ) : (
              <Link
                to="/"
                className="bg-[#1f3d54] text-white px-6 py-2 rounded-full hover:bg-[#173042] transition-colors"
              >
                {t.nav.quoteRequest}
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-[#1f3d54]"
              aria-label={t.nav.cartAria}
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#1f3d54] text-white text-xs font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#EC8F8D] transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLink(t.nav.home, '/', 'home')}
            <div className="block w-full text-left py-2">
              {navLink(t.nav.aanbod, '/', 'aanbod')}
            </div>
            <div className="block w-full text-left py-2">
              {navLink(t.nav.nieuw, '/', 'nieuw')}
            </div>
            <div className="block w-full text-left py-2">{navLink(t.nav.inspiratie, '/', 'inspiratie')}</div>
            <Link
              to="/"
              state={{ weddingPage: 'winkel' }}
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-gray-700 hover:text-[#1f3d54]"
            >
              {t.nav.products}
            </Link>
            <div className="flex gap-2 py-2">
              {(['nl', 'fr'] as const satisfies readonly Locale[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`rounded-full px-3 py-1 text-sm font-semibold border ${
                    locale === code
                      ? 'border-[#1f3d54] bg-[#1f3d54] text-white'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="w-full mt-2 inline-block text-center bg-[#1f3d54] text-white px-6 py-2 rounded-full hover:bg-[#173042] transition-colors"
            >
              {t.nav.quoteRequest}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
