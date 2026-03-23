export default function AboutSection() {
  return (
    <div id="about" className="bg-[#F4F0E4] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
              alt="Event booths"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#537D96] mb-6">
              About Nea Events
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Nea Events is the premier marketplace connecting event organizers with companies
                offering table and booth rentals. Whether you're hosting a conference, trade show,
                farmers market, or craft fair, we make it easy to find and rent the perfect space.
              </p>
              <p>
                Our platform brings together verified vendors offering high-quality setups at
                competitive prices. From small single tables to large exhibition stands, we have
                options for events of all sizes.
              </p>
              <p>
                With transparent pricing, instant availability, and detailed reviews, you can make
                informed decisions and book with confidence. Join thousands of successful vendors
                who have found their perfect event space through Nea Events.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#EC8F8D] mb-1">500+</div>
                <div className="text-sm text-gray-600">Verified Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#44A194] mb-1">5000+</div>
                <div className="text-sm text-gray-600">Events Hosted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#537D96] mb-1">50+</div>
                <div className="text-sm text-gray-600">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
