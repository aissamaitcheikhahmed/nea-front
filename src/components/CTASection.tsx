export default function CTASection() {
  return (
    <div id="cta" className="bg-gradient-to-r from-[#537D96] to-[#44A194] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Have Tables to Rent?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join our platform and connect with thousands of event organizers looking for
          the perfect booth or table space. Start earning today.
        </p>
        <button className="bg-[#EC8F8D] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-[#d67775] transition-all transform hover:scale-105 shadow-lg">
          List Your Space
        </button>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div>
            <div className="text-4xl font-bold mb-2">Free</div>
            <div className="text-white/80">to list your tables</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-white/80">Customer support</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">Fast</div>
            <div className="text-white/80">Instant bookings</div>
          </div>
        </div>
      </div>
    </div>
  );
}
