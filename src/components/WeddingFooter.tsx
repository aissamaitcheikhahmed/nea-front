import { Link } from 'react-router-dom';
import type { WeddingPage } from '../wedding/types';
import footerLogo from '../assets/logo2.png';

type Props =
  | { mode: 'spa'; onNavigate: (page: WeddingPage) => void }
  | { mode: 'router' };

export default function WeddingFooter(props: Props) {
  const pageHref = (page: WeddingPage, label: string) =>
    props.mode === 'router' ? (
      <Link to="/" state={{ weddingPage: page }}>
        {label}
      </Link>
    ) : (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          props.onNavigate(page);
        }}
      >
        {label}
      </a>
    );

  return (
    <footer>
      <div className="ft-top">
        <div>
          <img src={footerLogo} alt="neaevents" className="ft-logo-img" width={200} height={72} decoding="async" />
          <div className="ft-sub">Bruiloft & Evenement Decoratie</div>
          <div className="ft-contact">
            Brussel, België
            <br />
            +32 470 00 00 00
            <br />
            <a href="mailto:info@neaevents.be">info@neaevents.be</a>
          </div>
        </div>
        <div>
          <div className="ft-col-title">Evenementen</div>
          <ul className="ft-links">
            <li>
              <a href="#">Bruiloften</a>
            </li>
            <li>
              <a href="#">Verlovingen</a>
            </li>
            <li>
              <a href="#">Verjaardagen</a>
            </li>
            <li>
              <a href="#">Communies</a>
            </li>
            <li>
              <a href="#">Gala & Corporate</a>
            </li>
          </ul>
        </div>
        <div>
          <div className="ft-col-title">Pagina&apos;s</div>
          <ul className="ft-links">
            <li>{pageHref('collecties', 'Collecties')}</li>
            <li>{pageHref('galerie', 'Galerij')}</li>
            <li>{pageHref('winkel', 'Winkel')}</li>
            <li>{pageHref('about', 'Over Ons')}</li>
            <li>{pageHref('contact', 'Contact')}</li>
          </ul>
        </div>
        <div>
          <div className="ft-col-title">Volg Ons</div>
          <ul className="ft-links">
            <li>
              <a href="#">Instagram</a>
            </li>
            <li>
              <a href="#">Pinterest</a>
            </li>
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">TikTok</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="ft-bottom">
        <span className="ft-copy">© 2026 neaevents. Alle rechten voorbehouden.</span>
        <div className="ft-social">
          <a href="#">Privacy</a>
          <a href="#">Juridisch</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
