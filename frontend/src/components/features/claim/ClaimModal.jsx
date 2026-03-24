import { X, CheckCircle, MapPin, AlertCircle, Truck, Store, Bike, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const ClaimModal = ({ isOpen, onClose, listing, onConfirm }) => {
  const [deliveryMethod, setDeliveryMethod] = useState('self');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [dropoffLat, setDropoffLat] = useState(null);
  const [dropoffLng, setDropoffLng] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  
  // Mock check for active volunteers in the area
  const hasActiveVolunteers = true;

  // Auto-detect NGO location when volunteer delivery is selected
  useEffect(() => {
    if (deliveryMethod === 'volunteer' && !dropoffAddress) {
      setIsDetectingLocation(true);
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setDropoffLat(lat);
            setDropoffLng(lon);
            let address = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
              if (res.ok) {
                const data = await res.json();
                const a = data.address;
                address = [a.road, a.neighbourhood, a.suburb, a.city || a.town || a.village].filter(Boolean).join(', ') || data.display_name;
              }
            } catch (e) { console.warn('Reverse geocode failed', e); }
            setDropoffAddress(address);
            setIsDetectingLocation(false);
          },
          () => {
            setDropoffAddress('Location unavailable');
            setIsDetectingLocation(false);
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
      } else {
        setDropoffAddress('Geolocation not supported');
        setIsDetectingLocation(false);
      }
    }
  }, [deliveryMethod]);

  if (!isOpen || !listing) return null;

  const handleConfirm = () => {
    if (deliveryMethod === 'volunteer' && !dropoffAddress.trim()) {
      alert("Waiting for location detection...");
      return;
    }
    setIsConfirming(true);
    
    // Simulate backend processing
    setTimeout(() => {
      onConfirm(listing.id, deliveryMethod, dropoffAddress, dropoffLat, dropoffLng);
      setIsConfirming(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-orange-50 px-6 py-5 border-b border-orange-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Confirm Claim</h2>
            <p className="text-sm text-gray-500 mt-1">Reserve this food for immediate pickup.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-4 mb-6">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${listing.isVeg ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
              <CheckCircle size={28} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{listing.title}</h3>
              <p className="text-sm text-gray-600 font-medium">{listing.restaurant}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                <MapPin size={12} />
                <span>{listing.distance} km away • {listing.location}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Truck size={18} className="text-orange-500" />
              Delivery Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeliveryMethod('self')}
                className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl text-sm font-bold transition-all border ${
                  deliveryMethod === 'self' 
                    ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm ring-2 ring-orange-500/20' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <Store size={26} className={deliveryMethod === 'self' ? 'text-orange-500' : 'text-gray-400'} />
                Self Pickup
              </button>
              
              {hasActiveVolunteers ? (
                <button
                  onClick={() => setDeliveryMethod('volunteer')}
                  className={`flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl text-sm font-bold transition-all border ${
                    deliveryMethod === 'volunteer' 
                      ? 'bg-orange-50 border-orange-200 text-orange-700 shadow-sm ring-2 ring-orange-500/20' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <Bike size={26} className={deliveryMethod === 'volunteer' ? 'text-orange-500' : 'text-gray-400'} />
                  Request Volunteer
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-2xl text-sm font-bold border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed">
                  <Bike size={26} className="text-gray-300" />
                  No Volunteers Nearby
                </div>
              )}
            </div>
            
            {deliveryMethod === 'volunteer' && (
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
                  <AlertCircle size={20} className="shrink-0 mt-0.5 text-blue-500" />
                  <p>
                    A nearby volunteer will be automatically dispatched to pick up the food from the donor and deliver it to your detected location.
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Your Detected Location</p>
                  {isDetectingLocation ? (
                    <div className="flex items-center gap-2 text-orange-600 font-bold">
                      <Loader2 size={16} className="animate-spin" />
                      Detecting your location...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-emerald-600 shrink-0" />
                      <p className="font-bold text-gray-900">{dropoffAddress}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {deliveryMethod === 'self' && (
              <div className="mt-4 flex items-start gap-3 bg-amber-50 text-amber-800 p-4 rounded-xl text-sm leading-relaxed border border-amber-100">
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-500" />
                <p>
                  You are taking responsibility to pick up this food. Please arrive at the donor's location before the expiry time to ensure food safety.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              disabled={isConfirming}
              className="flex-1 px-5 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm}
              disabled={isConfirming}
              className="flex-2 items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-orange-600 shadow-lg shadow-gray-900/20 hover:shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait"
            >
              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  Confirming...
                </div>
              ) : (
                'Confirm & Reserve Food'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
