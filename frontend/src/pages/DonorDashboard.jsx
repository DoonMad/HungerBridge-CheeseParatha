import { Plus, Package, Navigation, Clock } from 'lucide-react';
import { useState } from 'react';
import AddListingModal from '../components/features/listings/AddListingModal';

const DonorDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDonations, setActiveDonations] = useState([]);

  const handlePostDonation = (data) => {
    // Generate mock expiry and ML simulation results locally for demo
    const newDonation = {
      id: `DON-${Math.floor(Math.random() * 9000) + 1000}`,
      food_name: data.food_name,
      food_type: data.food_type.replace(/_/g, ' '),
      quantity_kg: parseFloat(data.quantity_kg).toFixed(1),
      safe_minutes_remaining: Math.floor(Math.random() * 60) + 120, // predicts 2-3 hours
      status: 'waiting_for_ngo', // flow: waiting_for_ngo -> claimed -> in_transit -> delivered
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setActiveDonations([newDonation, ...activeDonations]);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900">Donor Workspace</h1>
          <p className="text-gray-500 mt-1">Manage your active food donations and check dispatch status.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all hover:-translate-y-1 active:scale-95 w-full sm:w-auto justify-center"
        >
          <Plus size={20} className="stroke-2" />
          Add Donation Listing
        </button>
      </div>

      {activeDonations.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center py-32">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Package size={40} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Donations</h2>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed mb-6 font-medium">
            You currently have no surplus food listed. When you list a donation through ML validation, you can track NGO claims and volunteer pickup status directly here.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="text-orange-600 font-bold hover:text-orange-700 underline underline-offset-4">Post a donation now</button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="font-extrabold text-lg text-gray-900 px-2 flex items-center gap-2">
            Your Active Postings
            <span className="bg-gray-900 text-white text-xs px-2.5 py-1 rounded-full">{activeDonations.length}</span>
          </h2>
          {activeDonations.map(don => (
            <div key={don.id} className="bg-white p-6 md:p-8 rounded-3xl border-2 border-orange-100 shadow-sm hover:shadow-orange-100/50 transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-extrabold text-gray-900 text-xl md:text-2xl">{don.food_name}</h3>
                  <span className="bg-orange-50 text-orange-700 text-xs font-bold px-2 py-1 rounded-md border border-orange-100 uppercase tracking-wider">{don.id}</span>
                </div>
                <p className="text-sm font-bold text-gray-500 capitalize">{don.food_type} • {don.quantity_kg} kg available</p>
              </div>
              
              <div className="flex gap-4 items-center bg-gray-50 px-5 py-4 rounded-2xl border border-gray-100 w-full md:w-auto shrink-0 shadow-inner">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                  <Clock size={22} className="stroke-2" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-0.5">ML Safe Window</p>
                  <p className="font-extrabold text-gray-900">{don.safe_minutes_remaining} mins predicted</p>
                </div>
              </div>
              
              <div className="w-full md:w-auto text-left md:text-right shrink-0">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 md:mb-1">Live Status</p>
                <div className="inline-flex items-center gap-2 flex-row-reverse md:flex-row bg-blue-50 text-blue-700 font-black px-4 py-2.5 rounded-xl border-2 border-blue-100 uppercase text-xs tracking-wider">
                  <Navigation size={16} className="stroke-3" /> Waiting for NGO
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handlePostDonation} 
      />
    </div>
  );
};

export default DonorDashboard;
