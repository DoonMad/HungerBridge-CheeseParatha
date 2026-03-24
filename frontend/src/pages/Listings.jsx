import { useState, useEffect } from 'react';
import ListingCard from '../components/features/listings/ListingCard';
import ClaimModal from '../components/features/claim/ClaimModal';
import { SlidersHorizontal, Search, CheckCircle } from 'lucide-react';

const MOCK_WEATHER = {
  temperature_c: 32,
  humidity_percent: 65,
  description: "Sunny",
  feels_like: 34
};

const generateMockListings = () => [
  {
    id: 'DON-4921',
    title: 'Veg Biryani & Mix Raita',
    restaurant: 'Spice Route Hotel',
    food_type: 'biryani',
    isVeg: true,
    quantity_kg: 5.5,
    servings: 20,
    packaging_type: 'sealed',
    requiresRefrigeration: false,
    time_since_cooked_min: 120, // 2 hours
    distance: 2.1,
    location: 'Airport Road',
    // Assume ML calculated safe_minutes_remaining as 45
    expiresAt: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'DON-4923',
    title: 'Chicken Curry & Rice Combo',
    restaurant: 'Mughal Darbar',
    food_type: 'chicken_curry',
    isVeg: false,
    quantity_kg: 10.0,
    servings: 45,
    packaging_type: 'semi_covered',
    requiresRefrigeration: true,
    time_since_cooked_min: 60, // 1 hour
    distance: 3.4,
    location: 'Central Avenue',
    // Urgent due to non-veg & semi-covered
    expiresAt: new Date(Date.now() + 1000 * 60 * 25).toISOString(), 
  },
  {
    id: 'DON-4922',
    title: 'Fresh Garden Salad',
    restaurant: 'GreenLife Catering',
    food_type: 'raw_vegetable_salad',
    isVeg: true,
    quantity_kg: 3.5,
    servings: 15,
    packaging_type: 'open',
    requiresRefrigeration: true,
    time_since_cooked_min: 0, // Freshly cut
    distance: 1.5,
    location: 'Westside Business Park',
    expiresAt: new Date(Date.now() + 1000 * 60 * 95).toISOString(), 
  },
  {
    id: 'DON-4924',
    title: 'Assorted Bakery Cakes',
    restaurant: 'Morning Bakers',
    food_type: 'bakery_cake',
    isVeg: true,
    quantity_kg: 4.0,
    servings: 35,
    packaging_type: 'sealed',
    requiresRefrigeration: false,
    time_since_cooked_min: 300, // Baked 5 hours ago
    distance: 0.8,
    location: 'University Campus',
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2.5).toISOString(),
  }
];

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Claim Flow State
  const [selectedListing, setSelectedListing] = useState(null);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);

  // Simulate fetching live data from backend
  useEffect(() => {
    setListings(generateMockListings());
  }, []);

  const handleClaimClick = (listing) => {
    setSelectedListing(listing);
  };
  
  const handleConfirmClaim = (id) => {
    // Remove listing from feed to simulate it being claimed
    setListings(prev => prev.filter(l => l.id !== id));
    
    // Show success toast
    setShowClaimSuccess(true);
    setTimeout(() => setShowClaimSuccess(false), 4000);
  };

  const categories = ['All', 'Veg', 'Non-Veg', 'Need Refrigeration', 'Sealed Packaging'];

  const getFilteredListings = () => {
    return listings.filter(l => {
      // 1. Filter by category pill
      let matchesFilter = true;
      if (filter === 'Veg') matchesFilter = l.isVeg;
      else if (filter === 'Non-Veg') matchesFilter = !l.isVeg;
      else if (filter === 'Need Refrigeration') matchesFilter = l.requiresRefrigeration;
      else if (filter === 'Sealed Packaging') matchesFilter = l.packaging_type === 'sealed';
      else if (filter !== 'All') matchesFilter = false;

      // 2. Filter by search text
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || (
        l.title.toLowerCase().includes(q) ||
        l.restaurant.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.food_type.toLowerCase().includes(q)
      );

      return matchesFilter && matchesSearch;
    }).sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Live Donations</h1>
            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              {listings.length} Active
            </span>
          </div>
          <p className="text-gray-500 text-lg">Claim surplus food from local partners in real-time.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64 xl:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food types, locations..." 
                className="pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 w-full shadow-sm transition-all text-sm font-medium"
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 px-5 py-3 rounded-2xl font-bold text-gray-700 transition-colors shadow-sm text-sm whitespace-nowrap">
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">More Filters</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Category Pills */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
              filter === cat 
                ? 'bg-gray-900 text-white shadow-md transform scale-105' 
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {getFilteredListings().map(listing => (
          <ListingCard 
            key={listing.id} 
            listing={listing} 
            onClaim={() => handleClaimClick(listing)} 
          />
        ))}
      </div>
      
      {getFilteredListings().length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No food donations match your current filters.</p>
        </div>
      )}

      {/* Claim Flow Modal */}
      <ClaimModal 
        isOpen={!!selectedListing}
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onConfirm={handleConfirmClaim}
      />

      {/* Success Toast */}
      {showClaimSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-gray-900 border border-gray-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-medium">
            <CheckCircle className="text-emerald-400" size={20} />
            Food claimed successfully! Check dashboard for volunteer dispatch.
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;
