import smallCar1 from '../../assets/small car/small car (1).webp';
import smallCar2 from '../../assets/small car/small car (2).webp';
import smallCar3 from '../../assets/small car/small car (3).webp';
import smallCar4 from '../../assets/small car/small car (4).webp';
import smallCar5 from '../../assets/small car/small car (5).webp';
import smallCar6 from '../../assets/small car/small car (6).webp';
import smallCar7 from '../../assets/small car/small car (7).webp';
import smallCar8 from '../../assets/small car/small car (8).webp';
import smallCar9 from '../../assets/small car/small car (9).webp';
import smallCar10 from '../../assets/small car/small car (10).webp';

const galleryImages = [
  smallCar1,
  smallCar2,
  smallCar3,
  smallCar4,
  smallCar5,
  smallCar6,
  smallCar7,
  smallCar8,
  smallCar9,
  smallCar10
];

export default function ScrollingGallery() {
  const doubledImages = [...galleryImages, ...galleryImages];

  return (
    <div id="tables" className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#537D96] mb-2">
          Featured Spaces
        </h2>
        <p className="text-center text-gray-600">
          Explore our collection of event tables and booths
        </p>
      </div>

      <div className="relative">
        <div className="flex animate-scroll hover:pause-animation">
          {doubledImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-80 mx-3"
            >
              <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <img
                  src={image}
                  alt={`Event space ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
