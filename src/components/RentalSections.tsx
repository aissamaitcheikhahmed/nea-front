import { Truck, MessageCircle, Sparkles, ShoppingCart, FileText, CreditCard, Package } from 'lucide-react';
import assortimentMain from '../../assets/assortiment/main.webp';
import assortiment1 from '../../assets/assortiment/1.webp';
import assortiment2 from '../../assets/assortiment/2.webp';
import assortiment3 from '../../assets/assortiment/3.webp';

const categories = [
  'Keuken',
  'Koelen',
  'Tafels',
  'Zitten',
  'Porselein',
  'Bestek',
  'Glaswerk',
  'Buffet',
  'Linnen',
  'Decoratie',
  'Opdienen',
  'Tuinfeest',
];

const products = [
  {
    name: 'Glass',
    image: assortiment1,
  },
  {
    name: 'Plate',
    image: assortiment2,
  },
  {
    name: 'Flower',
    image: assortiment3,
  },
];

export default function RentalSections() {
  return (
    <>
      <section id="aanbod" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1f3d54] text-center mb-8">
            Waar ben je naar op zoek?
          </h2>
          <div className="max-w-3xl mx-auto mb-10">
            <input
              className="w-full rounded-full border border-gray-300 px-6 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1f3d54]/30"
              placeholder="Zoek op product of categorie..."
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((item) => (
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
            Ontdek ons nieuw assortiment
          </h2>
          <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
            <img src={assortimentMain} alt="Nieuw assortiment" className="w-full h-[320px] md:h-[420px] object-cover" />
          </div>

          <div className="grid grid-flow-col auto-cols-[85%] md:auto-cols-[48%] lg:grid-flow-row lg:grid-cols-3 gap-5 overflow-x-auto lg:overflow-visible pb-2 no-scrollbar snap-x snap-mandatory">
            {products.map((product) => (
              <article
                key={product.name}
                className="bg-white rounded-2xl shadow-sm overflow-hidden snap-start"
              >
                <img src={product.image} alt={product.name} className="w-full h-72 object-cover" />
                <div className="p-4 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <button
                    className="h-9 w-9 rounded-full bg-[#1f3d54] text-white text-2xl leading-none flex items-center justify-center hover:bg-[#173042] transition-colors shrink-0"
                    aria-label={`Add ${product.name}`}
                  >
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="inspiratie" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: 'Eigen transportservice' },
            { icon: Sparkles, title: 'Professionele afwasservice' },
            { icon: MessageCircle, title: 'Persoonlijk contact' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-2xl bg-[#f2f7fa] p-8 text-center">
              <feature.icon className="mx-auto mb-3 text-[#1f3d54]" size={30} />
              <h3 className="text-lg font-bold text-[#1f3d54]">{feature.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#1f3d54] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Online bestellen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShoppingCart, title: 'Selecteer je producten', text: 'Kies je artikelen en voeg ze toe aan de winkelwagen.' },
              { icon: FileText, title: 'Offerte of bestellen', text: 'Kies directe huur of vraag een vrijblijvende offerte.' },
              { icon: CreditCard, title: 'Bevestiging & betaling', text: 'Ontvang een bevestigingsmail met verdere instructies.' },
              { icon: Package, title: 'Levering of afhaling', text: 'Kies levering op locatie of afhaling in ons magazijn.' },
            ].map((step) => (
              <div key={step.title} className="rounded-2xl bg-white/10 p-6">
                <step.icon size={28} className="mb-3" />
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-white/80 text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1f3d54] mb-8">
            Inspiratie voor jouw evenement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              'https://images.unsplash.com/photo-1519167758481-83f29c4d39f0?w=900&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=900&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop',
            ].map((src, idx) => (
              <img key={src} src={src} alt={`Inspiratie ${idx + 1}`} className="w-full h-64 object-cover rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
