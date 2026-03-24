import { MapPin, Box, Users, ThermometerSnowflake, Package, ChefHat } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

const formatFoodType = (typeStr) => {
  return typeStr.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const formatPackaging = (pkgStr) => {
  if (pkgStr === 'semi_covered') return 'Semi Covered';
  return pkgStr.charAt(0).toUpperCase() + pkgStr.slice(1);
};

const ListingCard = ({ listing, onClaim }) => {
  return (
    <div className="group bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col transform hover:-translate-y-1">
      {/* Header Image or Gradient */}
      <div className={`h-32 relative ${listing.isVeg ? 'bg-linear-to-r from-emerald-100 to-green-50' : 'bg-linear-to-r from-orange-100 to-rose-50'}`}>
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm flex items-center gap-1.5 backdrop-blur-md ${
            listing.isVeg ? 'bg-green-100/90 text-green-700' : 'bg-rose-100/90 text-rose-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${listing.isVeg ? 'bg-green-500' : 'bg-rose-500'}`}></span>
            {listing.isVeg ? 'Veg' : 'Non-Veg'}
          </div>
          
          {listing.requiresRefrigeration && (
            <div className="bg-blue-100/90 text-blue-700 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm flex items-center gap-1.5">
              <ThermometerSnowflake size={14} />
              Cold
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 text-xs font-bold text-white bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          #{listing.id}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-1.5">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-500 font-medium flex items-center justify-between">
            {listing.restaurant}
            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-md text-gray-600 font-bold border border-gray-200 uppercase tracking-wider">
              {formatFoodType(listing.food_type)}
            </span>
          </p>
        </div>

        <div className="space-y-4 mb-6 flex-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
          <div className="grid grid-cols-2 gap-y-3 gap-x-2">
            <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-indigo-500 shrink-0">
                <Box size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold truncate">Amount</span>
                <span className="leading-tight truncate">{listing.quantity_kg} kg</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-orange-500 shrink-0">
                <Users size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold truncate">Serves</span>
                <span className="leading-tight truncate">~{listing.servings} px</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium col-span-2 pt-1">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-emerald-500 shrink-0">
                <Package size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold truncate">Packaging</span>
                <span className="leading-tight truncate">{formatPackaging(listing.packaging_type)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 font-medium pt-3 border-t border-gray-100/80">
            <MapPin size={16} className="text-gray-400" />
            <span className="truncate">{listing.distance} km away • {listing.location}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between mt-auto gap-3">
          <CountdownTimer expiresAt={listing.expiresAt} />
          <button
            onClick={() => onClaim(listing.id)}
            className="flex-1 bg-gray-900 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-orange-500/30 text-sm whitespace-nowrap active:scale-95"
          >
            Claim Food
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
