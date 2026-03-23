import { Users, Store, Presentation, Sun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const categoryConfig = [
  { icon: Users, color: '#EC8F8D', titleKey: 'conferenceTables' as const, descKey: 'conferenceDesc' as const },
  { icon: Store, color: '#537D96', titleKey: 'marketBooths' as const, descKey: 'marketDesc' as const },
  { icon: Presentation, color: '#44A194', titleKey: 'expoStands' as const, descKey: 'expoDesc' as const },
  { icon: Sun, color: '#EC8F8D', titleKey: 'outdoorTables' as const, descKey: 'outdoorDesc' as const },
];

export default function Categories() {
  const { t } = useLanguage();

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#537D96] mb-4">
            {t.home.browseByCategory}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.home.findPerfectSpace}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoryConfig.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="bg-[#F4F0E4] rounded-2xl p-8 text-center hover:shadow-lg transition-all transform hover:-translate-y-2 cursor-pointer"
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: category.color }}
                >
                  <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {t.home[category.titleKey]}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t.home[category.descKey]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
