import { Truck, MapPin } from 'lucide-react';

const VolunteerDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-extrabold text-gray-900">Volunteer Dispatch Center</h1>
        <p className="text-gray-500 mt-1">View assigned pickups and drop-off targets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Truck size={20} /> Current Dispatch
          </h2>
          <p className="text-gray-600 mt-2">No active collections right now. Check back soon for assignment alerts.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin size={20} /> Nearby Pickup Locations
          </h2>
          <p className="text-gray-600 mt-2">You will see nearby donors and urgent deliveries once available.</p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
