import { X, Activity, Package } from 'lucide-react';
import { useState } from 'react';

const ML_FOOD_TYPES = [
  'salad_cut_fruits', 'fried_rice', 'fried_snacks', 'paneer_dish',
  'noodles', 'milk_based_dessert', 'chicken_curry', 'samosa_kachori',
  'bakery_cake', 'dairy_sweets', 'dry_food_roti', 'pasta', 'biryani',
  'raw_vegetable_salad', 'curry_gravy', 'rice_meal', 'pizza',
  'fish_curry', 'bread_items', 'dal'
];

const AddListingModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    food_name: '',
    food_type: 'fried_rice',
    quantity_kg: '',
    time_since_cooked_min: 0,
    packaging_type: 'sealed',
    refrigerated: false,
    veg_nonveg: 'veg',
  });
  
  const [isClassifying, setIsClassifying] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setFormData({
      food_name: '',
      food_type: 'fried_rice',
      quantity_kg: '',
      time_since_cooked_min: 0,
      packaging_type: 'sealed',
      refrigerated: false,
      veg_nonveg: 'veg',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsClassifying(true);
    
    // Request permission and capture real-time geodata
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          onSubmit({ ...formData, latitude: lat, longitude: lon });
          setIsClassifying(false);
          resetForm();
        },
        (error) => {
          console.error("Location error:", error);
          const reasons = {
            1: "Location permission denied. Please allow location access in your browser settings.",
            2: "Location unavailable. Your device couldn't determine its position.",
            3: "Location request timed out. Please try again.",
          };
          alert(reasons[error.code] || "Location error. Please try again.");
          setIsClassifying(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000, // Accept cached location up to 1 min old
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsClassifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl rounded-4xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-orange-600 p-6 md:px-8 flex justify-between items-start text-white shrink-0 shadow-sm relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-1 flex items-center gap-3">
              <Package size={26} className="text-orange-200" /> New Surplus Listing
            </h2>
            <p className="text-orange-100 font-medium text-sm">Input real-time conditions for the ML Expiry Prediction Model.</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-black/10 hover:bg-black/30 rounded-full transition-colors relative z-10">
            <X size={20} className="stroke-2" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-6 md:p-8 border-b border-gray-100 bg-gray-50/30">
          <form id="add-listing-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <label className="block text-sm font-extrabold text-gray-900 mb-2 uppercase tracking-wide">Listing Title / Description</label>
              <input 
                required 
                type="text" 
                placeholder="e.g. Leftover Chicken Curry from afternoon catering" 
                value={formData.food_name} 
                onChange={e => setFormData({...formData, food_name: e.target.value})} 
                className="w-full bg-gray-50 border border-gray-200 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium text-gray-900 placeholder-gray-400 transition-all shadow-inner" 
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <label className="block text-[11px] font-extrabold text-gray-400 mb-2 uppercase tracking-widest">Exact Food Category (ML)</label>
                <select 
                  value={formData.food_type} 
                  onChange={e => setFormData({...formData, food_type: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-2xl focus:outline-none focus:border-orange-500 font-bold text-gray-700 capitalize cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  {ML_FOOD_TYPES.map(type => (
                    <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <label className="block text-[11px] font-extrabold text-gray-400 mb-2 uppercase tracking-widest">Quantity (kg)</label>
                <input 
                  required 
                  type="number" 
                  step="0.1" 
                  min="0.1" 
                  placeholder="e.g. 5.5" 
                  value={formData.quantity_kg} 
                  onChange={e => setFormData({...formData, quantity_kg: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-2xl focus:outline-none focus:border-orange-500 font-bold text-gray-700 shadow-inner" 
                />
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                <label className="block text-[11px] font-extrabold text-gray-400 mb-2 uppercase tracking-widest whitespace-nowrap">Mins Since Cooked</label>
                <input 
                  required 
                  type="number" 
                  min="0" 
                  placeholder="0" 
                  value={formData.time_since_cooked_min} 
                  onChange={e => setFormData({...formData, time_since_cooked_min: parseInt(e.target.value) || 0})} 
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-2xl focus:outline-none focus:border-orange-500 font-bold text-gray-700 shadow-inner" 
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
               <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                  <label className="block text-[11px] font-extrabold text-gray-400 mb-2 uppercase tracking-widest">Packaging Type</label>
                  <select value={formData.packaging_type} onChange={e => setFormData({...formData, packaging_type: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-2xl focus:outline-none focus:border-orange-500 font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
                    <option value="sealed">Sealed Container</option>
                    <option value="semi_covered">Semi-Covered (Foil/Wrap)</option>
                    <option value="open">Open Container</option>
                  </select>
               </div>
               <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                  <label className="block text-[11px] font-extrabold text-gray-400 mb-2 uppercase tracking-widest">Dietary</label>
                  <select value={formData.veg_nonveg} onChange={e => setFormData({...formData, veg_nonveg: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 rounded-2xl focus:outline-none focus:border-orange-500 font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
                    <option value="veg">Vegetarian</option>
                    <option value="nonveg">Non-Vegetarian</option>
                  </select>
               </div>
            </div>

            <div className="bg-white p-2 rounded-3xl border border-gray-100 shadow-sm">
              <label className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-orange-50/50 transition-colors group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={formData.refrigerated} onChange={e => setFormData({...formData, refrigerated: e.target.checked})} className="w-7 h-7 text-orange-500 focus:ring-orange-500 focus:ring-offset-orange-50 rounded-lg border-2 border-gray-300 cursor-pointer transition-all peer" />
                </div>
                <div>
                  <div className="font-extrabold text-gray-900 group-hover:text-orange-900 transition-colors">Stored in Refrigeration</div>
                  <div className="text-gray-500 text-sm mt-0.5 font-medium">Check this if the food has been kept continuously cold since initial cooking.</div>
                </div>
              </label>
            </div>
            
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 md:px-8 bg-white shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-6 py-4 font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-colors w-full sm:w-auto">Cancel</button>
          <button form="add-listing-form" type="submit" disabled={isClassifying} className="bg-gray-900 hover:bg-orange-600 focus:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-gray-900/20 active:scale-95 flex items-center justify-center gap-3 w-full sm:w-auto disabled:opacity-70 disabled:hover:bg-gray-900">
            {isClassifying ? (
              <><Activity className="animate-pulse text-orange-500" size={20} /> Calculating Safe Window...</>
            ) : "Calculate Expiry & Post"}
          </button>
        </div>

      </div>
    </div>
  );
};
export default AddListingModal;
