import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import RentalSections from '../components/RentalSections';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      <RentalSections />
      <Footer />
    </div>
  );
}
