import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { ShoppingCart } from 'lucide-react';
import WeddingChrome from '../components/WeddingChrome';
import WeddingPageHeader from '../components/WeddingPageHeader';
import car3 from '../../assets/car3.webp';

export default function ProductListPage() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const { products } = useProducts();

  return (
    <WeddingChrome activeNav="catalog" showCart>
      <WeddingPageHeader bg={car3} tag="Catalogus" title="Onze" titleEm="Producten" />
      <section className="shop-sec">
        <div className="sec-tag reveal visible">
          <div className="sec-tag-line" />
          <span className="sec-tag-text">Webshop</span>
        </div>
        <h2 className="sec-h reveal visible d1">{t.products.title}</h2>
        <p
          className="reveal visible d2"
          style={{
            fontFamily: 'var(--sans)',
            fontSize: 14,
            fontWeight: 300,
            color: 'var(--muted)',
            lineHeight: 1.75,
            maxWidth: 640,
            marginTop: 16,
          }}
        >
          {t.products.subtitle}
        </p>

        <div className="shop-grid" style={{ marginTop: 48 }}>
          {products.map((product) => (
            <div key={product.id} className="shop-card">
              <div className="shop-img-wrap">
                <img className="shop-img" src={product.image} alt={product.name} />
              </div>
              <div className="shop-body">
                <div className="shop-cat">Product</div>
                <div className="shop-name">{product.name}</div>
                <p className="shop-desc">{product.description}</p>
                <div className="shop-footer">
                  <div className="shop-price">
                    €{product.price.toFixed(2)} <span>({t.products.from})</span>
                  </div>
                  <button
                    type="button"
                    className="shop-btn"
                    onClick={() =>
                      addItem({
                        id: product.id,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                      })
                    }
                  >
                    <ShoppingCart size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                    {t.products.addToCart}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </WeddingChrome>
  );
}
