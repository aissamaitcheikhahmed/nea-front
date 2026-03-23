import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#112a3d] text-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-2xl font-bold mb-4">Nea Events</h3>
            <p className="text-white/80 text-sm">
              Verhuur van feestmateriaal voor elke gelegenheid. Kwaliteit, service en correcte levering.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Informatie</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-white/80">Home</li>
              <li className="text-white/80">Aanbod</li>
              <li className="text-white/80">Nieuw</li>
              <li className="text-white/80">Inspiratie</li>
              <li className="text-white/80">Transport</li>
              <li className="text-white/80">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Mijn account</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Login</li>
              <li>Winkelwagen</li>
              <li>Verlanglijst</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>info@neaevents.be</li>
              <li>+32 (0)3 830 23 79</li>
              <li>Ma-vrij: 8u00-12u30 en 13u00-17u30</li>
              <li>Afhalen en retour vanaf 9u</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Mail"><Mail size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Nea Events - Algemene voorwaarden - Disclaimer & Privacy - Cookies beheren</p>
        </div>
      </div>
    </footer>
  );
}
