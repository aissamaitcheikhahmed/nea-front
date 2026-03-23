import TableCard from './TableCard';

import rated1 from '../../assets/rated/rated (1).webp';
import rated2 from '../../assets/rated/rated (2).webp';
import rated3 from '../../assets/rated/rated (3).webp';
import rated4 from '../../assets/rated/rated (4).webp';
import rated5 from '../../assets/rated/rated (5).webp';
import rated6 from '../../assets/rated/rated (6).webp';

const topRatedTables = [
  {
    image: rated1,
    name: 'Luxury Event Table Set'
  },
  {
    image: rated2,
    name: 'Outdoor Display Booth'
  },
  {
    image: rated3,
    name: 'Premium Product Stand'
  },
  {
    image: rated4,
    name: 'Modern Exhibition Space'
  },
  {
    image: rated5,
    name: 'Pop-Up Market Display'
  },
  {
    image: rated6,
    name: 'Showcase Table Setup'
  }
];

export default function TopRatedSection() {
  return (
    <div id="top-rated" className="bg-[#F4F0E4] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#537D96] mb-4">
            Top Rated Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular table and booth setups that customers love to book.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topRatedTables.map((table, index) => (
            <TableCard key={index} {...table} />
          ))}
        </div>
      </div>
    </div>
  );
}
