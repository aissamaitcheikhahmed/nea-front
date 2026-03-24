import { Truck, MessageCircle, Sparkles, ShoppingCart, FileText, CreditCard, Package } from 'lucide-react';
import assortimentMain from '../../assets/assortiment/main.webp';
import assortiment1 from '../../assets/assortiment/1.webp';
import assortiment2 from '../../assets/assortiment/2.webp';
import assortiment3 from '../../assets/assortiment/3.webp';
import inspiratie1 from '../../assets/Inspiratie/ins (1).webp';
import inspiratie2 from '../../assets/Inspiratie/ins (2).webp';
import inspiratie3 from '../../assets/Inspiratie/ins (3).webp';
import inspiratie4 from '../../assets/Inspiratie/ins (4).webp';
import { useLanguage } from '../context/LanguageContext';

const hoverCard =
  'group relative overflow-hidden rounded-2xl bg-[#f2f7fa] shadow-sm ring-1 ring-[#1f3d54]/10 transition-shadow duration-500 ease-out hover:shadow-xl hover:ring-[#1f3d54]/20';
const hoverHero =
  'group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#1f3d54]/10 transition-shadow duration-500 ease-out hover:shadow-xl hover:ring-[#1f3d54]/20';
const hoverProductImg =
  'group relative overflow-hidden bg-white transition-shadow duration-500 ease-out hover:shadow-xl';
const hoverImg =
  'w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-110';

const featureIcons = [Truck, Sparkles, MessageCircle] as const;
const orderIcons = [ShoppingCart, FileText, CreditCard, Package] as const;

const productImages = [assortiment1, assortiment2, assortiment3] as const;
const inspirationImages = [inspiratie1, inspiratie2, inspiratie3, inspiratie4] as const;

export default function RentalSections() {
  const { t } = useLanguage();

  return (
    <>
      <section id="aanbod" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1f3d54] text-center mb-8">
            {t.rental.searchTitle}
          </h2>
          <div className="max-w-3xl mx-auto mb-10">
            <input
              className="w-full rounded-full border border-gray-300 px-6 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1f3d54]/30"
              placeholder={t.rental.searchPlaceholder}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {t.rental.categories.map((item) => (
              <button
                key={item}
                className="rounded-xl border border-gray-200 bg-[#f7f7f7] px-4 py-4 text-sm font-semibold text-[#1f3d54] hover:bg-[#e9f0f4] transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="nieuw" className="bg-[#f8f8f8] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1f3d54] mb-10">
            {t.rental.newAssortmentTitle}
          </h2>
          <div className={`mb-8 ${hoverHero}`}>
            <img
              src={assortimentMain}
              alt={t.rental.newAssortmentHeroAlt}
              className={`h-[320px] w-full md:h-[420px] ${hoverImg}`}
            />
          </div>

          <div className="grid grid-flow-col auto-cols-[85%] md:auto-cols-[48%] lg:grid-flow-row lg:grid-cols-3 gap-5 overflow-x-auto lg:overflow-visible pb-2 no-scrollbar snap-x snap-mandatory">
            {productImages.map((image, idx) => {
              const name = t.rental.productNames[idx];
              return (
                <article
                  key={name}
                  className="bg-white rounded-2xl shadow-sm snap-start overflow-hidden ring-1 ring-[#1f3d54]/10"
                >
                  <div className={hoverProductImg}>
                    <img src={image} alt={name} className={`h-72 ${hoverImg}`} />
                  </div>
                  <div className="p-4 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-gray-800">{name}</h3>
                    <button
                      className="h-9 w-9 rounded-full bg-[#1f3d54] text-white text-2xl leading-none flex items-center justify-center hover:bg-[#173042] transition-colors shrink-0"
                      aria-label={t.rental.addProductAria.replace('{name}', name)}
                    >
                      +
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="inspiratie" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureIcons.map((Icon, idx) => (
            <div key={`feature-${idx}`} className="rounded-2xl bg-[#f2f7fa] p-8 text-center">
              <Icon className="mx-auto mb-3 text-[#1f3d54]" size={30} />
              <h3 className="text-lg font-bold text-[#1f3d54]">{t.rental.features[idx]}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#1f3d54] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">{t.rental.orderOnlineTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.rental.orderSteps.map((step, idx) => {
              const Icon = orderIcons[idx];
              return (
                <div key={step.title} className="rounded-2xl bg-white/10 p-6">
                  <Icon size={28} className="mb-3" />
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-white/80 text-sm">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1f3d54] mb-8">
            {t.rental.inspirationTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inspirationImages.map((src, idx) => (
              <div key={src} className={hoverCard}>
                <img
                  src={src}
                  alt={`${t.rental.inspirationTitle} ${idx + 1}`}
                  className={`h-64 ${hoverImg}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
