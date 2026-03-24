import { Star, CheckCircle, Navigation, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const NGODashboard = () => {
  const { user } = useAuth();
  const [ratingTarget, setRatingTarget] = useState(null);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        if (!user?.id) return;
        const res = await fetch(`http://localhost:8000/api/listings/ngo/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setClaims(data.map(l => ({
            id: l.id,
            food: l.food_name,
            donor: l.pickup_location || 'Donor Location',
            volunteer: l.volunteer_id ? `Volunteer Active` : 'Awaiting Assignment',
            status: l.status,
            date: new Date(l.created_at.endsWith('Z') ? l.created_at : l.created_at + 'Z').toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            needsReview: l.status === 'completed'
          })));
        }
      } catch (err) {
        console.error("Failed to fetch NGO claims", err);
      }
    };
    fetchClaims();
    // Poll for updates (e.g. volunteer assignments or completions)
    const interval = setInterval(fetchClaims, 10000);
    return () => clearInterval(interval);
  }, [user?.id]);

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
        
        {claims.length === 0 && (
          <div className="text-center py-12 text-gray-500 font-medium">No claims history found. Head to the Live Feed to claim food!</div>
        )}

        {claims.map(claim => (
          <div key={claim.id} className="p-6 sm:p-8 rounded-3xl border-2 border-orange-100 shadow-sm bg-orange-50/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-gray-900 text-xl">{claim.food}</h3>
                {claim.status === 'completed' ? (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded border border-emerald-200 uppercase tracking-wider">Delivered</span>
                ) : claim.status === 'volunteer_assigned' ? (
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded border border-blue-200 uppercase tracking-wider">In Transit</span>
                ) : (
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded border border-orange-200 uppercase tracking-wider">Needs Volunteer</span>
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium">
                From <span className="font-bold text-gray-800">{claim.donor}</span> • Logistics: <span className="font-bold text-gray-800">{claim.volunteer}</span>
              </p>
              <span className="inline-block bg-white border border-gray-200 text-gray-500 text-xs font-bold px-2 py-1 rounded-md mt-2">
                {claim.date} • {claim.id}
              </span>
            </div>
            
            <button 
              disabled={!claim.needsReview}
              onClick={() => alert('Review Modal will open here. You will rate the quality/quantity of the Food, and the punctuality/behavior of the Volunteer separately.')}
              className={`w-full md:w-auto px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
                claim.needsReview 
                  ? 'bg-gray-900 hover:bg-orange-600 text-white shadow-md hover:shadow-orange-600/30' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Star size={18} className={claim.needsReview ? "fill-white" : "fill-gray-400"} />
              {claim.needsReview ? 'Rate Delivery & Food' : 'Awaiting Delivery'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NGODashboard;
