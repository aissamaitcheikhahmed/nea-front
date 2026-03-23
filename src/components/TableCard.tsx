interface TableCardProps {
  image: string;
  name: string;
}

export default function TableCard({ image, name }: TableCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
        <button className="mt-2 bg-[#44A194] text-white px-4 py-2 rounded-full text-sm hover:bg-[#3a8a7d] transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}
