import { useState, useEffect } from 'react';
import ListingCard from '../components/features/listings/ListingCard';
import ClaimModal from '../components/features/claim/ClaimModal';
import { SlidersHorizontal, Search, CheckCircle, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:8000/api/listings';

const Listings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedListing, setSelectedListing] = useState(null);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);

  const fetchListings = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error();
      const data = await response.json();
      
      const mapped = data
        .filter(l => l.status === 'available')
        .map(l => {
          const expiresStr = l.expires_at.endsWith('Z') ? l.expires_at : l.expires_at + 'Z';
          return {
            id: l.id,
            title: l.food_name,
            restaurant: "Donor",
            food_type: l.food_type,
            isVeg: l.food_is_veg,
            quantity_kg: l.food_qty,
            servings: l.food_qty * 4,
            packaging_type: 'sealed',
            requiresRefrigeration: l.refrigeration || false,
            time_since_cooked_min: 0,
            distance: 1.5,
            location: 'Local Center',
            expiresAt: expiresStr,
          };
      });
      setListings(mapped);
    } catch (error) {
      // Fallback Mock Data for NGO Live Feed MVP
      const MOCK_LISTINGS = [
        {
          id: 'MN-9481', title: 'Chicken Curry & Rice Combo', restaurant: 'Spice Route Hotel',
          food_type: 'chicken_curry', isVeg: false, quantity_kg: 5.5, servings: 22,
          packaging_type: 'sealed', requiresRefrigeration: false, time_since_cooked_min: 45,
          distance: 1.2, location: 'Central Avenue', expiresAt: new Date(Date.now() + 1000 * 60 * 120).toISOString()
        },
        {
          id: 'MN-9482', title: 'Fresh Garden Salad Bowls', restaurant: 'GreenLife Catering',
          food_type: 'raw_vegetable_salad', isVeg: true, quantity_kg: 2.0, servings: 10,
          packaging_type: 'sealed', requiresRefrigeration: true, time_since_cooked_min: 20,
          distance: 2.8, location: 'Westside Business Park', expiresAt: new Date(Date.now() + 1000 * 60 * 180).toISOString()
        },
        {
          id: 'MN-9483', title: 'Assorted Bakery Cakes', restaurant: 'Sweet Tooth Bakery',
          food_type: 'bakery_cake', isVeg: true, quantity_kg: 4.0, servings: 16,
          packaging_type: 'semi_covered', requiresRefrigeration: true, time_since_cooked_min: 120,
          distance: 0.8, location: 'Downtown Square', expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString()
        }
      ];
      setListings(MOCK_LISTINGS);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleClaimClick = (listing) => {
    setSelectedListing(listing);
  };
  
  const handleConfirmClaim = async (id, deliveryMethod) => {
    try {
      const ngoId = user?.id || 'demo-ngo';
      const isSelfPickup = deliveryMethod === 'self';
      
      await fetch(`${API_URL}/${id}/ngo-claim?ngo_id=${ngoId}&self_pickup=${isSelfPickup}`, { method: 'POST' });
      setListings(prev => prev.filter(l => l.id !== id));
      setShowClaimSuccess(true);
      setTimeout(() => setShowClaimSuccess(false), 4000);
    } catch(err) {
      // Allow mock flow for UI testing
      setListings(prev => prev.filter(l => l.id !== id));
      setShowClaimSuccess(true);
      setTimeout(() => setShowClaimSuccess(false), 4000);
    }
  };

  const categories = ['All', 'Veg', 'Non-Veg', 'Need Refrigeration', 'Sealed Packaging'];

  const getFilteredListings = () => {
    return listings.filter(l => {
      let matchesFilter = true;
      if (filter === 'Veg') matchesFilter = l.isVeg;
      else if (filter === 'Non-Veg') matchesFilter = !l.isVeg;
      else if (filter === 'Need Refrigeration') matchesFilter = l.requiresRefrigeration;
      else if (filter === 'Sealed Packaging') matchesFilter = l.packaging_type === 'sealed';
      else if (filter !== 'All') matchesFilter = false;

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

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mt-6">
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

      <ClaimModal 
        isOpen={!!selectedListing}
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onConfirm={handleConfirmClaim}
      />

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
