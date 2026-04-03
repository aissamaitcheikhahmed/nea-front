import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { WeddingPage } from '../wedding/types';
import WeddingFooter from './WeddingFooter';
import weddingLogo from '../assets/logo.png';
import '../styles/neaevents-wedding-scoped.css';

export type WeddingChromeNav = 'home' | WeddingPage;

type Props = {
  children: ReactNode;
  /** Which nav item shows the gold underline */
  activeNav: WeddingChromeNav;
  showFooter?: boolean;
  /** Show cart icon in the nav */
  showCart?: boolean;
};

function NavLinkRouter({
  page,
  children,
  active,
}: {
  page: WeddingPage;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <li>
      <Link to="/" state={{ weddingPage: page }} className={active ? 'active-link' : undefined}>
        {children}
      </Link>
    </li>
  );
}

export default function WeddingChrome({ children, activeNav, showFooter = true, showCart = false }: Props) {
  const { totalItems, toggleCart } = useCart();

  return (
    <div className="nea-wedding-root">
      <nav>
        <Link to="/" className="nav-logo" aria-label="neaevents — home">
          <img src={weddingLogo} alt="" className="nav-logo-img" width={260} height={93} decoding="async" />
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={activeNav === 'home' ? 'active-link' : undefined}>
              Home
            </Link>
          </li>
          <NavLinkRouter page="collecties" active={activeNav === 'collecties'}>
            Collecties
          </NavLinkRouter>
          <NavLinkRouter page="galerie" active={activeNav === 'galerie'}>
            Galerij
          </NavLinkRouter>
          <NavLinkRouter page="winkel" active={activeNav === 'winkel'}>
            Winkel
          </NavLinkRouter>
          <NavLinkRouter page="about" active={activeNav === 'about'}>
            Over Ons
          </NavLinkRouter>
          <NavLinkRouter page="contact" active={activeNav === 'contact'}>
            Contact
          </NavLinkRouter>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {showCart ? (
            <button
              type="button"
              className="nav-cta"
              style={{ padding: '10px 14px' }}
              onClick={toggleCart}
              aria-label="Winkelwagen"
            >
              <ShoppingCart size={18} strokeWidth={1.5} />
              {totalItems > 0 ? (
                <span style={{ marginLeft: 6, fontSize: 10, letterSpacing: '0.12em' }}>{totalItems}</span>
              ) : null}
            </button>
          ) : null}
          <Link to="/" state={{ weddingPage: 'contact' }} className="nav-cta" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Offerte Aanvragen
          </Link>
        </div>
      </nav>

      {children}

      {showFooter ? <WeddingFooter mode="router" /> : null}
    </div>
  );
}
