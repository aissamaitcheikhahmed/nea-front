import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import car1 from '../../assets/car1.webp';
import car2 from '../../assets/car2.webp';
import car3 from '../../assets/car3.webp';
import car4 from '../../assets/car4.webp';

const slides = [
  {
    image: car1,
    title: 'Rent Event Tables & Booth Spaces Easily',
    subtitle: 'Connect with companies offering premium table and booth rentals for your next event'
  },
  {
    image: car2,
    title: 'Find Perfect Spaces for Markets & Expos',
    subtitle: 'Browse hundreds of verified table and booth options across the country'
  },
  {
    image: car3,
    title: 'Book Your Booth in Minutes',
    subtitle: 'Simple, transparent pricing with instant availability'
  },
  {
    image: car4,
    title: 'Professional Event Spaces Await',
    subtitle: 'From conferences to craft fairs, find the perfect setup for your business'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToTables = () => {
    const element = document.getElementById('tables');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="relative h-screen w-full overflow-hidden pt-16">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                {slide.subtitle}
              </p>
              <button
                onClick={scrollToTables}
                className="bg-[#EC8F8D] text-white px-8 py-3 rounded-full text-lg hover:bg-[#d67775] transition-all transform hover:scale-105"
              >
                Browse Tables
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
      >
        <ChevronLeft className="text-white" size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
      >
        <ChevronRight className="text-white" size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
