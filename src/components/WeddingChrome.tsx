import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { WeddingPage } from '../wedding/types';
import WeddingFooter from './WeddingFooter';
import weddingLogo from '../assets/nea-events-horizontal-transparent.svg';
import '../styles/neaevents-wedding-scoped.css';

export type WeddingChromeNav = 'home' | 'catalog' | WeddingPage;

type Props = {
  children: ReactNode;
  /** Which nav item shows the gold underline */
  activeNav: WeddingChromeNav;
  showFooter?: boolean;
  /** Show cart icon (e.g. on /producten) */
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
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mx = useRef(0);
  const my = useRef(0);
  const rx = useRef(0);
  const ry = useRef(0);
  const { totalItems, toggleCart } = useCart();

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      dot.style.left = `${mx.current}px`;
      dot.style.top = `${my.current}px`;
    };

    let frame = 0;
    const loop = () => {
      rx.current += (mx.current - rx.current) * 0.12;
      ry.current += (my.current - ry.current) * 0.12;
      ring.style.left = `${rx.current}px`;
      ring.style.top = `${ry.current}px`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove);
    frame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onEnter = () => document.body.classList.add('hov');
    const onLeave = () => document.body.classList.remove('hov');
    const sel =
      'a,button,.nav-card,.col-card,.masonry-item,.shop-card,.about-img-item,.strip-item,.filter-btn,.form-submit,.shop-btn';
    const nodes = root.querySelectorAll(sel);
    nodes.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
    return () => {
      nodes.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      document.body.classList.remove('hov');
    };
  }, []);

  return (
    <div className="nea-wedding-root" ref={rootRef}>
      <div id="cur">
        <div id="cur-dot" ref={dotRef} />
        <div id="cur-ring" ref={ringRef} />
      </div>

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
          <li>
            <Link to="/producten" className={activeNav === 'catalog' ? 'active-link' : undefined}>
              Catalogus
            </Link>
          </li>
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
