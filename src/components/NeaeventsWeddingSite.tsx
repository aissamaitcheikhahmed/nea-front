import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Cake,
  Church,
  Heart,
  MapPin,
  Palette,
  PartyPopper,
  Phone,
  Mail,
  Clock,
  CircleDot,
  Sparkles,
  ShoppingCart,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import car2 from '../../assets/car2.webp';
import car3 from '../../assets/car3.webp';
import car4 from '../../assets/car4.webp';
import assort1 from '../../assets/assortiment/1.webp';
import assort2 from '../../assets/assortiment/2.webp';
import assort3 from '../../assets/assortiment/3.webp';
import ins1 from '../../assets/Inspiratie/ins (1).webp';
import ins2 from '../../assets/Inspiratie/ins (2).webp';
import ins3 from '../../assets/Inspiratie/ins (3).webp';
import ins4 from '../../assets/Inspiratie/ins (4).webp';
import '../styles/neaevents-wedding-scoped.css';
import weddingLogo from '../assets/logo.png';
import WeddingFooter from './WeddingFooter';
import WeddingPageHeader from './WeddingPageHeader';
import type { WeddingPage } from '../wedding/types';

type ShopCat = 'all' | 'borden' | 'glazen' | 'bestek' | 'bloemen' | 'linnen' | 'accessoires';
type ShopItem = {
  id: string;
  cat: Exclude<ShopCat, 'all'>;
  img: string;
  badge?: string;
  shopCat: string;
  name: string;
  desc: string;
  price: string;
  priceEur: number;
};
type ApiProduct = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: Exclude<ShopCat, 'all'>;
};

const STRIP = [
  { icon: CircleDot, name: 'Verlovingen' },
  { icon: Heart, name: 'Bruiloften' },
  { icon: Cake, name: 'Verjaardagen' },
  { icon: Church, name: 'Communies' },
  { icon: Sparkles, name: "Gala's" },
  { icon: PartyPopper, name: 'Jubilea' },
  { icon: Palette, name: 'Maatwerk' },
] as const;

const COLLECTIES = [
  { img: ins1, cat: 'Collectie 01', name: 'Blush Romantisch', sub: 'Roze bloemen · Amber glazen · Koperen bestek' },
  { img: ins2, cat: 'Collectie 02', name: 'Wit & Goud Klassiek', sub: 'Witte rozen · Gouden vaas · Gouden bestek' },
  { img: ins3, cat: 'Collectie 03', name: 'Marokkaans Goud', sub: 'Gouden arabesque · Witte rozen · Kristal' },
  { img: ins4, cat: 'Collectie 04', name: 'Mauve Bohemien', sub: 'Marokkaans servies · Paars kristal · Pioenen' },
  { img: assort1, cat: 'Collectie 05', name: 'Smaragd & Zilver', sub: 'Donkergroen linnen · Zilveren kandelaar · Kristal' },
  { img: assort2, cat: 'Collectie 06', name: 'Roze Minimalisme', sub: 'Vierkante borden · Roze runner · Kersenbloesem' },
] as const;

const GAL_IMGS = [ins1, ins2, ins3, ins4, car2, car3, assort1, assort2, assort3, car4, ins1, ins3];

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'wit-goud-diner-bord',
    cat: 'borden',
    img: assort1,
    badge: 'Populair',
    shopCat: 'Borden',
    name: 'Wit & Goud Diner Bord',
    desc: 'Wit porseleinen bord met gouden rand. Ø 27cm. Per 6 stuks.',
    price: '€3,50',
    priceEur: 3.5,
  },
  {
    id: 'marokkaans-keramisch-bord',
    cat: 'borden',
    img: assort2,
    shopCat: 'Borden',
    name: 'Marokkaans Keramisch Bord',
    desc: 'Handbeschilderd keramisch bord in mauve. Ø 28cm. Per 6 stuks.',
    price: '€4,50',
    priceEur: 4.5,
  },
  {
    id: 'klassiek-relief-bord',
    cat: 'borden',
    img: assort3,
    shopCat: 'Borden',
    name: 'Klassiek Reliëf Bord',
    desc: 'Wit porseleinen bord met fijn reliëfpatroon. Ø 26cm. Per 6 stuks.',
    price: '€3,00',
    priceEur: 3,
  },
  {
    id: 'amber-kristal-wijnglas',
    cat: 'glazen',
    img: ins1,
    badge: 'Nieuw',
    shopCat: 'Glazen',
    name: 'Amber Kristal Wijnglas',
    desc: 'Facetgeslepen kristalglas in amber. H 18cm. Per 6 stuks.',
    price: '€2,50',
    priceEur: 2.5,
  },
  {
    id: 'mauve-kristal-wijnglas',
    cat: 'glazen',
    img: ins2,
    shopCat: 'Glazen',
    name: 'Mauve Kristal Wijnglas',
    desc: 'Facetgeslepen kristalglas in mauve-paars. H 18cm. Per 6 stuks.',
    price: '€2,50',
    priceEur: 2.5,
  },
  {
    id: 'kristal-longdrinkglas',
    cat: 'glazen',
    img: ins3,
    shopCat: 'Glazen',
    name: 'Kristal Longdrinkglas',
    desc: 'Helder facetgeslepen longdrinkglas. H 15cm. Per 6 stuks.',
    price: '€2,00',
    priceEur: 2,
  },
  {
    id: 'rozenarrangement-klein',
    cat: 'bloemen',
    img: ins4,
    shopCat: 'Bloemen & Vazen',
    name: 'Rozenarrangement klein',
    desc: 'Seizoensrozen met groen, vaas inbegrepen.',
    price: '€45',
    priceEur: 45,
  },
  {
    id: 'linnen-servet-set',
    cat: 'linnen',
    img: car3,
    shopCat: 'Linnen',
    name: 'Linnen servet set',
    desc: 'Zacht linnen, per 12 stuks, diverse tinten.',
    price: '€1,20',
    priceEur: 1.2,
  },
];

const CATEGORY_LABEL: Record<Exclude<ShopCat, 'all'>, string> = {
  borden: 'Borden',
  glazen: 'Glazen',
  bestek: 'Bestek',
  bloemen: 'Bloemen & Vazen',
  linnen: 'Linnen',
  accessoires: 'Accessoires',
};

function formatEuro(value: number) {
  return new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(value);
}

export default function NeaeventsWeddingSite() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem, toggleCart, totalItems, openCart } = useCart();
  const [page, setPage] = useState<WeddingPage>('home');
  const [shopFilter, setShopFilter] = useState<ShopCat>('all');
  const [remoteShopItems, setRemoteShopItems] = useState<ShopItem[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  const showPage = useCallback((id: WeddingPage) => {
    setPage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const st = (location.state as { weddingPage?: WeddingPage } | null)?.weddingPage;
    if (st) {
      setPage(st);
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    root.querySelectorAll('.reveal:not(.visible)').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [page]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      document.getElementById('hero-bg')?.classList.add('loaded');
    }, 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let active = true;
    const apiOrigin = import.meta.env.VITE_API_ORIGIN?.trim().replace(/\/$/, '') ?? '';
    const productsUrl = apiOrigin ? `${apiOrigin}/api/products` : '/api/products';
    const run = async () => {
      try {
        const res = await fetch(productsUrl);
        if (!res.ok) return;
        const data = (await res.json()) as { products?: ApiProduct[] };
        const apiProducts = Array.isArray(data.products) ? data.products : [];
        if (!active) return;
        const mapped = apiProducts
          .filter((p) => p && typeof p.id === 'string' && p.name && p.description && p.image && typeof p.price === 'number')
          .filter((p) => ['borden', 'glazen', 'bestek', 'bloemen', 'linnen', 'accessoires'].includes(p.category))
          .map((p) => ({
            id: `db-${p.id}`,
            cat: p.category,
            img: p.image,
            badge: 'Nieuw',
            shopCat: CATEGORY_LABEL[p.category],
            name: p.name,
            desc: p.description,
            price: formatEuro(p.price),
            priceEur: p.price,
          }));
        setRemoteShopItems(mapped);
      } catch {
        // Keep hardcoded shop available even if API fails.
      }
    };
    run();
    return () => {
      active = false;
    };
  }, []);

  const displayedShopItems = [...remoteShopItems, ...SHOP_ITEMS];

  const navLink = (id: WeddingPage, label: string) => (
    <li>
      <a
        href="#"
        className={page === id ? 'active-link' : undefined}
        onClick={(e) => {
          e.preventDefault();
          showPage(id);
        }}
      >
        {label}
      </a>
    </li>
  );

  const heroBgStyle = {
    ['--hero-bg-url' as string]: `url(${car3})`,
  } as React.CSSProperties;

  return (
    <div className="nea-wedding-root" ref={rootRef}>
      <nav>
        <a
          href="#"
          className="nav-logo"
          aria-label="neaevents — home"
          onClick={(e) => {
            e.preventDefault();
            showPage('home');
          }}
        >
          <img src={weddingLogo} alt="" className="nav-logo-img" width={260} height={93} decoding="async" />
        </a>
        <ul className="nav-links">
          {navLink('home', 'Home')}
          {navLink('collecties', 'Collecties')}
          {navLink('galerie', 'Galerij')}
          {navLink('winkel', 'Winkel')}
          {navLink('about', 'Over Ons')}
          {navLink('contact', 'Contact')}
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {page === 'winkel' || totalItems > 0 ? (
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
          <button type="button" className="nav-cta" onClick={() => showPage('contact')}>
            Offerte Aanvragen
          </button>
        </div>
      </nav>

      <div className={`page${page === 'home' ? ' active' : ''}`} id="page-home">
        <section className="hero">
          <div className="hero-bg" id="hero-bg" style={heroBgStyle} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-tag">
              <div className="hero-tag-line" />
              <span className="hero-tag-text">Uw Droommoment — Wij Realiseren Het</span>
            </div>
            <h1 className="hero-h1">
              Elk Moment
              <br />
              Verdient <em>Schoonheid</em>
            </h1>
            <p className="hero-desc">
              Van romantische bruiloften tot stijlvolle verlovingsfeesten — wij kleden uw tafel aan met zorg, smaak en
              het mooiste materiaal.
            </p>
            <div className="hero-btns">
              <button type="button" className="btn-hero-solid" onClick={() => showPage('collecties')}>
                Bekijk Onze Collecties
              </button>
              <button type="button" className="btn-hero-outline" onClick={() => showPage('galerie')}>
                Zie Ons Werk
              </button>
            </div>
          </div>
          <div className="hero-scroll">
            <span>Scroll</span>
            <div className="scroll-bar" />
          </div>
        </section>

        <div className="strip">
          {STRIP.map(({ icon: Icon, name }) => (
            <div key={name} className="strip-item">
              <span className="strip-icon">
                <Icon size={18} strokeWidth={1.25} color="rgba(226,201,138,.75)" />
              </span>
              <div className="strip-name">{name}</div>
            </div>
          ))}
        </div>

        <section className="home-cards">
          <div className="sec-tag reveal">
            <div className="sec-tag-line" />
            <span className="sec-tag-text">Ontdek neaevents</span>
          </div>
          <h2 className="sec-h reveal d1">
            Alles voor uw <em>Perfecte Dag</em>
          </h2>
          <div className="home-cards-inner">
            <div className="nav-card reveal d1" onClick={() => showPage('collecties')} role="presentation">
              <img className="nav-card-img" src={ins1} alt="" />
              <div className="nav-card-body">
                <div className="nav-card-tag">Stijlen & Thema&apos;s</div>
                <div className="nav-card-title">Onze Collecties</div>
                <p className="nav-card-desc">
                  Blush romantisch, wit & goud klassiek, mauve bohemien en meer. Kies de stijl die bij uw dag past.
                </p>
                <button type="button" className="nav-card-btn">
                  Bekijk Collecties
                </button>
              </div>
            </div>
            <div className="nav-card reveal d2" onClick={() => showPage('galerie')} role="presentation">
              <img className="nav-card-img" src={ins2} alt="" />
              <div className="nav-card-body">
                <div className="nav-card-tag">Inspiratie & Realisaties</div>
                <div className="nav-card-title">Onze Galerij</div>
                <p className="nav-card-desc">
                  Bekijk echte opstellingen die wij hebben verzorgd voor bruiloften, verlovingen en bijzondere feesten.
                </p>
                <button type="button" className="nav-card-btn">
                  Naar de Galerij
                </button>
              </div>
            </div>
            <div className="nav-card reveal d3" onClick={() => showPage('winkel')} role="presentation">
              <img className="nav-card-img" src={ins3} alt="" />
              <div className="nav-card-body">
                <div className="nav-card-tag">Huur of Koop</div>
                <div className="nav-card-title">Onze Winkel</div>
                <p className="nav-card-desc">
                  Bestel individuele stukken: borden, glazen, bestek, bloemen en accessoires voor uw eigen opstelling.
                </p>
                <button type="button" className="nav-card-btn">
                  Naar de Winkel
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonial">
          <div className="gt-inner">
            <div className="gt-orn reveal">
              <div className="gt-line" />
              <div className="gt-diamond" />
              <div className="gt-line" />
            </div>
            <blockquote className="gt-quote reveal d1">
              &ldquo;Onze trouwdag was precies zoals wij het gedroomd hadden. De tafels waren adembenemend mooi — elk
              detail klopte. neaevents heeft ons een dag gegeven die we nooit zullen vergeten.&rdquo;
            </blockquote>
            <div className="gt-author reveal d2">— Sara & Youssef El Idrissi</div>
            <div className="gt-role reveal d3">Bruiloft, Antwerpen 2024</div>
          </div>
        </section>

        <section className="cta-band">
          <div>
            <h2 className="cta-h reveal">
              Uw mooiste dag verdient
              <br />
              <em>perfecte</em> decoratie
            </h2>
            <p className="cta-sub reveal d1">
              Vertel ons over uw evenement — wij maken een voorstel dat uw verwachtingen overtreft.
            </p>
          </div>
          <div className="cta-btns reveal d2">
            <button type="button" className="btn-cta-s" onClick={() => showPage('contact')}>
              Offerte Aanvragen
            </button>
            <button type="button" className="btn-cta-o" onClick={() => showPage('winkel')}>
              Onze Winkel Bekijken
            </button>
          </div>
        </section>

        <WeddingFooter mode="spa" onNavigate={showPage} />
      </div>

      <div className={`page${page === 'collecties' ? ' active' : ''}`}>
        <WeddingPageHeader bg={car2} tag="Stijlen & Thema's" title="Onze" titleEm="Collecties" />
        <section className="collecties-sec">
          <div className="sec-tag reveal">
            <div className="sec-tag-line" />
            <span className="sec-tag-text">Kies Uw Stijl</span>
          </div>
          <h2 className="sec-h reveal d1">
            Elke Tafeldecoratie
            <br />
            Vertelt een <em>Verhaal</em>
          </h2>
          <div className="col-grid">
            {COLLECTIES.map((c, i) => (
              <div key={c.name} className={`col-card reveal d${((i % 3) + 1) as 1 | 2 | 3}`}>
                <img className="col-card-img" src={c.img} alt="" />
                <div className="col-card-overlay" />
                <div className="col-card-info">
                  <div className="col-cat">{c.cat}</div>
                  <div className="col-name">{c.name}</div>
                  <div className="col-sub">{c.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="cta-band">
          <div>
            <h2 className="cta-h">
              Wilt u een <em>maatwerkcollectie?</em>
            </h2>
            <p className="cta-sub">
              Samen stellen wij een unieke tafelopstelling samen die perfect aansluit op uw thema en budget.
            </p>
          </div>
          <div className="cta-btns">
            <button type="button" className="btn-cta-s" onClick={() => showPage('contact')}>
              Offerte Aanvragen
            </button>
          </div>
        </section>
      </div>

      <div className={`page${page === 'galerie' ? ' active' : ''}`}>
        <WeddingPageHeader bg={car3} tag="Inspiratie & Realisaties" title="Onze" titleEm="Galerij" />
        <section className="gal-sec">
          <div className="gal-header-area">
            <div className="sec-tag">
              <div className="sec-tag-line" />
              <span className="sec-tag-text">Ons Werk</span>
            </div>
            <h2 className="sec-h">
              Momenten die <em>Blijven</em>
            </h2>
          </div>
          <div className="masonry">
            {GAL_IMGS.map((src, i) => (
              <div key={i} className="masonry-item">
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className={`page${page === 'winkel' ? ' active' : ''}`}>
        <WeddingPageHeader bg={car4} tag="Huur of Koop" title="Onze" titleEm="Winkel" />
        <section className="shop-sec">
          <div className="sec-tag reveal">
            <div className="sec-tag-line" />
            <span className="sec-tag-text">Bestel Per Stuk</span>
          </div>
          <h2 className="sec-h reveal d1">
            Tafeldecoratie
            <br />
            <em>Op Bestelling</em>
          </h2>
          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 14,
              fontWeight: 300,
              color: 'var(--muted)',
              lineHeight: 1.75,
              maxWidth: 580,
              marginTop: 16,
            }}
            className="reveal d2"
          >
            Stel uw eigen tafelopstelling samen. Huur of koop individuele stukken — borden, glazen, bestek, bloemen en
            meer. Minimumbestelling: 6 stuks per artikel.
          </p>
          <div className="shop-filter">
            {(
              [
                ['all', 'Alles'],
                ['borden', 'Borden'],
                ['glazen', 'Glazen'],
                ['bestek', 'Bestek'],
                ['bloemen', 'Bloemen & Vazen'],
                ['linnen', 'Linnen'],
                ['accessoires', 'Accessoires'],
              ] as const
            ).map(([cat, label]) => (
              <button
                key={cat}
                type="button"
                className={`filter-btn${shopFilter === cat ? ' active' : ''}`}
                onClick={() => setShopFilter(cat)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="shop-grid">
            {displayedShopItems.filter((p) => shopFilter === 'all' || p.cat === shopFilter).map((p) => (
              <div key={p.id} className="shop-card" data-cat={p.cat}>
                <div className="shop-img-wrap">
                  <img className="shop-img" src={p.img} alt="" />
                  {p.badge ? <div className="shop-badge">{p.badge}</div> : null}
                </div>
                <div className="shop-body">
                  <div className="shop-cat">{p.shopCat}</div>
                  <div className="shop-name">{p.name}</div>
                  <p className="shop-desc">{p.desc}</p>
                  <div className="shop-footer">
                    <div className="shop-price">
                      {p.price} <span>/ stuk / dag</span>
                    </div>
                    <button
                      type="button"
                      className="shop-btn"
                      onClick={() => {
                        addItem({
                          id: p.id,
                          name: p.name,
                          image: p.img,
                          price: p.priceEur,
                        });
                        openCart();
                      }}
                    >
                      <ShoppingCart size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                      In winkelwagen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="shop-info-band">
            <div className="sib-item">
              <div className="sib-icon">✦</div>
              <div className="sib-title">Minimum 6 stuks</div>
              <div className="sib-text">Per artikel, flexibel te combineren met andere items.</div>
            </div>
            <div className="sib-item">
              <div className="sib-icon">◇</div>
              <div className="sib-title">Huur & koop</div>
              <div className="sib-text">Vraag naar voorwaarden en beschikbaarheid op uw datum.</div>
            </div>
            <div className="sib-item">
              <div className="sib-icon">◎</div>
              <div className="sib-title">Levering mogelijk</div>
              <div className="sib-text">Op locatie in België — wij denken graag mee.</div>
            </div>
          </div>
        </section>
      </div>

      <div className={`page${page === 'about' ? ' active' : ''}`}>
        <WeddingPageHeader bg={ins4} tag="Ons Verhaal" title="Over" titleEm="neaevents" />
        <section className="about-split">
          <div className="about-imgs-grid">
            <div className="about-img-item">
              <img src={ins1} alt="" />
            </div>
            <div className="about-img-item">
              <img src={ins2} alt="" />
            </div>
            <div className="about-img-item">
              <img src={ins3} alt="" />
            </div>
          </div>
          <div className="about-text-side">
            <div className="sec-tag reveal">
              <div className="sec-tag-line" />
              <span className="sec-tag-text">Onze Filosofie</span>
            </div>
            <h2 className="sec-h reveal d1">
              Iedere Tafel
              <br />
              Vertelt een <em>Verhaal</em>
            </h2>
            <p className="about-body reveal d2">
              Wij zijn gespecialiseerd in de complete tafeldecoratie voor bruiloften, verlovingen en speciale vieringen.
              Met elk arrangement streven wij naar één ding: dat uw gasten een avond beleven die ze nooit vergeten.
            </p>
            <blockquote className="about-pull reveal d3">
              &ldquo;Niet de zaal maakt een feest bijzonder — het zijn de details op de tafel die een moment onvergetelijk
              maken.&rdquo;
            </blockquote>
            <div className="stats-row">
              <div className="stat-item reveal d1">
                <div className="stat-n">
                  500<span className="stat-u">+</span>
                </div>
                <div className="stat-l">Evenementen</div>
              </div>
              <div className="stat-item reveal d2">
                <div className="stat-n">
                  5<span className="stat-u">★</span>
                </div>
                <div className="stat-l">Beoordeling</div>
              </div>
              <div className="stat-item reveal d3">
                <div className="stat-n">
                  12<span className="stat-u">+</span>
                </div>
                <div className="stat-l">Collecties</div>
              </div>
            </div>
          </div>
        </section>
        <section className="diensten-sec">
          <div className="sec-tag reveal">
            <div className="sec-tag-line" />
            <span className="sec-tag-text">Hoe Wij Werken</span>
          </div>
          <h2 className="sec-h reveal d1">
            Van Droom
            <br />
            tot <em>Werkelijkheid</em>
          </h2>
          <div className="diensten-grid">
            {[
              {
                n: '01',
                t: 'Gratis Kennismaking',
                b: 'Wij luisteren naar uw wensen, stijl en budget. Samen bepalen we de sfeer die bij u past — zonder verplichtingen.',
              },
              {
                n: '02',
                t: 'Stijladvies op Maat',
                b: 'Onze stylisten selecteren de perfecte combinatie van servies, glazen, bloemen en accessoires afgestemd op uw thema.',
              },
              {
                n: '03',
                t: 'Volledige Opbouw',
                b: 'Op de dag zelf zorgen wij voor transport, opbouw en styling van elke tafel. U geniet — wij zorgen voor de rest.',
              },
              {
                n: '04',
                t: 'Afbraak & Retour',
                b: 'Na afloop halen wij alles netjes op. U hoeft nergens aan te denken — behalve aan de mooie herinneringen.',
              },
            ].map((d, i) => (
              <div key={d.n} className={`dienst reveal d${i + 1}`}>
                <div className="dienst-num">{d.n}</div>
                <div className="dienst-title">{d.t}</div>
                <p className="dienst-body">{d.b}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className={`page${page === 'contact' ? ' active' : ''}`}>
        <WeddingPageHeader bg={car2} tag="Laten We Praten" title="Neem" titleEm="Contact Op" />
        <section className="contact-sec">
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="sec-tag reveal">
              <div className="sec-tag-line" />
              <span className="sec-tag-text">Offerte Aanvragen</span>
            </div>
            <h2 className="sec-h reveal d1" style={{ marginBottom: 28 }}>
              Vertel ons over
              <br />
              uw <em>Evenement</em>
            </h2>
            <div className="form-row">
              <div>
                <label>Voornaam</label>
                <input type="text" placeholder="Sara" />
              </div>
              <div>
                <label>Achternaam</label>
                <input type="text" placeholder="El Idrissi" />
              </div>
            </div>
            <label>E-mailadres</label>
            <input type="email" placeholder="sara@email.com" />
            <label>Telefoonnummer</label>
            <input type="tel" placeholder="+32 470 00 00 00" />
            <label>Type evenement</label>
            <select defaultValue="Bruiloft">
              <option>Bruiloft</option>
              <option>Verloving</option>
              <option>Verjaardag</option>
              <option>Communie / Lentefeest</option>
              <option>Gala / Corporate</option>
              <option>Huwelijksjubileum</option>
              <option>Ander</option>
            </select>
            <div className="form-row">
              <div>
                <label>Datum van het evenement</label>
                <input type="date" />
              </div>
              <div>
                <label>Aantal gasten</label>
                <input type="number" placeholder="80" />
              </div>
            </div>
            <label>Gewenste stijl / collectie</label>
            <select defaultValue="Blush Romantisch">
              <option>Blush Romantisch</option>
              <option>Wit & Goud Klassiek</option>
              <option>Marokkaans Goud</option>
              <option>Mauve Bohemien</option>
              <option>Smaragd & Zilver</option>
              <option>Roze Minimalisme</option>
              <option>Maatwerk / Weet ik nog niet</option>
            </select>
            <label>Extra wensen of opmerkingen</label>
            <textarea placeholder="Vertel ons meer over uw dag..." />
            <button type="submit" className="form-submit">
              Offerte Versturen →
            </button>
          </form>
          <div className="contact-info reveal d2">
            <h2 className="contact-info-title">
              Wij helpen u
              <br />
              graag <em>verder</em>
            </h2>
            <p className="contact-info-text">
              Heeft u een vraag of wilt u graag een vrijblijvend gesprek? Neem contact op — wij reageren binnen 24 uur.
            </p>
            <div className="contact-detail">
              <span className="contact-detail-icon">
                <MapPin size={18} />
              </span>
              <div>
                <div className="contact-detail-label">Adres</div>
                <div className="contact-detail-text">Brussel, België</div>
              </div>
            </div>
            <div className="contact-detail">
              <span className="contact-detail-icon">
                <Phone size={18} />
              </span>
              <div>
                <div className="contact-detail-label">Telefoon</div>
                <div className="contact-detail-text">+32 470 00 00 00</div>
              </div>
            </div>
            <div className="contact-detail">
              <span className="contact-detail-icon">
                <Mail size={18} />
              </span>
              <div>
                <div className="contact-detail-label">E-mail</div>
                <div className="contact-detail-text">
                  <a href="mailto:info@neaevents.be">info@neaevents.be</a>
                </div>
              </div>
            </div>
            <div className="contact-detail">
              <span className="contact-detail-icon">
                <Clock size={18} />
              </span>
              <div>
                <div className="contact-detail-label">Openingsuren</div>
                <div className="contact-detail-text">
                  Ma-Za: 9u-18u
                  <br />
                  Zo: op afspraak
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: 36,
                padding: 28,
                background: 'var(--blush)',
                borderLeft: '3px solid var(--rose)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 17,
                  fontStyle: 'italic',
                  color: 'var(--ink)',
                  marginBottom: 8,
                }}
              >
                &ldquo;Elk groot feest begint met één gesprek.&rdquo;
              </div>
              <div
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 11,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--rose-dk)',
                }}
              >
                — Team neaevents
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
