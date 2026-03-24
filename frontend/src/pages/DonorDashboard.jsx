import { Plus, Package } from 'lucide-react';

const DonorDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900">Donor Workspace</h1>
          <p className="text-gray-500 mt-1">Manage your active food donations and check status.</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all active:scale-95 w-full sm:w-auto justify-center">
          <Plus size={20} className="stroke-2" />
          Add Donation Listing
        </button>
      </div>

      <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center py-32">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package size={40} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Donations</h2>
        <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
          You currently don't have any surplus food listed. When you list a donation through ML validation, you can track volunteer pickup status here.
        </p>
      </div>
    </div>
  );
};

export default DonorDashboard;
