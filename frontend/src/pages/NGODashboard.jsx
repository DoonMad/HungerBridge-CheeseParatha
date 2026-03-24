import { Star, CheckCircle, Navigation } from 'lucide-react';
import { useState } from 'react';

const NGODashboard = () => {
  const [ratingTarget, setRatingTarget] = useState(null);

  const mockPastClaims = [
    { 
      id: 'DON-4921', 
      food: 'Veg Biryani & Mix Raita', 
      donor: 'Spice Route Hotel', 
      volunteer: 'Alex Johnson', 
      date: 'Today, 2:30 PM', 
      needsReview: true 
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-extrabold text-gray-900">NGO Operations Center</h1>
        <p className="text-gray-500 mt-1">Manage claims, rate deliveries, and track impact.</p>
      </div>

      <div className="space-y-5">
        <h2 className="text-xl font-bold flex items-center gap-2 px-2">
          <CheckCircle className="text-emerald-500" />
          Action Required: Pending Reviews
        </h2>
        
        {mockPastClaims.map(claim => (
          <div key={claim.id} className="p-6 sm:p-8 rounded-3xl border-2 border-orange-100 shadow-sm bg-orange-50/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-xl">{claim.food}</h3>
              <p className="text-sm text-gray-600 font-medium">
                Donated by <span className="font-bold text-gray-800">{claim.donor}</span> • Delivered by <span className="font-bold text-gray-800">{claim.volunteer}</span>
              </p>
              <span className="inline-block bg-white border border-gray-200 text-gray-500 text-xs font-bold px-2 py-1 rounded-md mt-2">
                {claim.date} • {claim.id}
              </span>
            </div>
            
            <button 
              onClick={() => alert('Review Modal will open here. You will rate the quality/quantity of the Food, and the punctuality/behavior of the Volunteer separately.')}
              className="bg-gray-900 hover:bg-orange-600 text-white w-full md:w-auto px-6 py-4 rounded-xl font-bold shadow-md hover:shadow-orange-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Star size={18} className="fill-white" />
              Rate Delivery & Food
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NGODashboard;
