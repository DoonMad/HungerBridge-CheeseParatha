import { useState, useEffect } from 'react';
import ListingCard from '../components/features/listings/ListingCard';
import ClaimModal from '../components/features/claim/ClaimModal';
import { SlidersHorizontal, Search, CheckCircle, Plus } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/listings';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedListing, setSelectedListing] = useState(null);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newListing, setNewListing] = useState({
    food_name: '',
    food_qty: 1,
    food_type: 'general',
    food_is_veg: true
  });

  const fetchListings = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const mapped = data.map(l => ({
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
        expiresAt: l.expires_at,
      }));
      setListings(mapped);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleClaimClick = (listing) => {
    setSelectedListing(listing);
  };
  
  const handleConfirmClaim = async (id) => {
    try {
      await fetch(`${API_URL}/${id}/claim?volunteer_id=dummy-vol-id123`, { method: 'POST' });
      setListings(prev => prev.filter(l => l.id !== id));
      setShowClaimSuccess(true);
      setTimeout(() => setShowClaimSuccess(false), 4000);
    } catch(err) {
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        donor_id: "dummy-donor-123",
        food_name: newListing.food_name,
        food_qty: parseInt(newListing.food_qty),
        food_type: newListing.food_type,
        food_is_veg: newListing.food_is_veg,
        refrigeration: false,
        latitude: 12.9716,
        longitude: 77.5946,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString()
      };
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setShowAddForm(false);
      fetchListings();
    } catch(err) {
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
          <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-bold transition-colors shadow-sm text-sm whitespace-nowrap">
            <Plus size={18} />
            Add Listing
          </button>
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

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 grid sm:grid-cols-2 gap-4">
          <input required type="text" placeholder="Food Name" value={newListing.food_name} onChange={e => setNewListing({...newListing, food_name: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input required type="number" placeholder="Quantity (kg)" value={newListing.food_qty} onChange={e => setNewListing({...newListing, food_qty: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <input required type="text" placeholder="Food Type" value={newListing.food_type} onChange={e => setNewListing({...newListing, food_type: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700">
            <input type="checkbox" checked={newListing.food_is_veg} onChange={e => setNewListing({...newListing, food_is_veg: e.target.checked})} className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
            Vegetarian
          </label>
          <button type="submit" className="col-span-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">Submit</button>
        </form>
      )}
      
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
