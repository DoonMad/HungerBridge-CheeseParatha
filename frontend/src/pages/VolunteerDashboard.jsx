import { useState } from 'react';
import { Bike, Power, MapPin, Package, CheckCircle, Navigation } from 'lucide-react';

const MOCK_JOBS = [
  {
    id: 'JOB-9481',
    food: 'Chicken Curry & Rice Combo',
    pickup: 'Mughal Darbar, Central Avenue',
    pickupDistance: 1.2,
    dropoff: 'Hope Shelter, North Block',
    dropoffDistance: 3.4,
    totalPay: 'Impact Points: 150',
    status: 'available',
    expiresIn: '25 mins'
  },
  {
    id: 'JOB-9482',
    food: 'Fresh Garden Salad',
    pickup: 'GreenLife Catering, Westside',
    pickupDistance: 0.8,
    dropoff: 'Community Center, Eastside',
    dropoffDistance: 2.1,
    totalPay: 'Impact Points: 120',
    status: 'available',
    expiresIn: '1 hr 15 mins'
  }
];

const VolunteerDashboard = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [jobs, setJobs] = useState(MOCK_JOBS);

  const handleAcceptJob = (job) => {
    setActiveJob(job);
    setJobs(jobs.filter(j => j.id !== job.id));
  };

  const handleCompleteJob = () => {
    alert('Delivery completed successfully! (Step 5: Ratings & Gamification coming next)');
    setActiveJob(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header & Status Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Volunteer Portal</h1>
          <p className="text-gray-500 mt-1">Deliver food and earn impact points.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-200">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</span>
            <span className={`font-bold transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
              {isActive ? 'Online & Ready' : 'Offline'}
            </span>
          </div>
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-10 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 ${isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-7 shadow-sm' : 'translate-x-1 shadow-sm'}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Map / Active Job */}
        <div className="lg:col-span-2 space-y-6">
          {activeJob ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4">
              <div className="bg-gray-900 px-6 py-4 flex justify-between items-center text-white">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Navigation className="animate-pulse text-orange-500" size={20} />
                  Active Delivery
                </h2>
                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest text-orange-400">
                  {activeJob.id}
                </span>
              </div>
              <div className="p-6 md:p-8 space-y-8">
                <div className="flex gap-5 items-start">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shrink-0 mt-1">
                    <Package size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{activeJob.food}</h3>
                    <p className="text-rose-500 font-bold text-sm bg-rose-50 inline-block px-3 py-1 rounded-full">
                      Deliver urgently before {activeJob.expiresIn}
                    </p>
                  </div>
                </div>

                <div className="relative pl-6 space-y-8 py-2 before:absolute before:inset-y-0 before:left-[23px] before:w-0.5 before:bg-gray-200">
                  <div className="relative">
                    <div className="absolute -left-[32px] bg-white p-1 rounded-full border-2 border-orange-500 z-10 shadow-sm">
                      <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                    </div>
                    <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-1">Pickup (Donor)</h4>
                    <p className="text-gray-900 font-bold text-lg mb-1">{activeJob.pickup}</p>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{activeJob.pickupDistance} km</span>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[32px] bg-white p-1 rounded-full border-2 border-emerald-500 z-10 shadow-sm">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                    </div>
                    <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-1">Dropoff (NGO)</h4>
                    <p className="text-gray-900 font-bold text-lg mb-1">{activeJob.dropoff}</p>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{activeJob.dropoffDistance} km</span>
                  </div>
                </div>

                <button 
                  onClick={handleCompleteJob}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle size={22} className="stroke-2" />
                  Mark Delivery Complete
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center h-[500px] flex flex-col items-center justify-center transition-all">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-colors duration-500 ${isActive ? 'bg-orange-50' : 'bg-gray-50'}`}>
                <Bike size={40} className={`transition-colors duration-500 ${isActive ? 'text-orange-500 animate-bounce' : 'text-gray-300'}`} />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">No Active Delivery</h2>
              <p className="text-gray-500 text-lg max-w-sm mx-auto leading-relaxed">
                {isActive 
                  ? "You are online! Accept a job from the list on the right to start your delivery." 
                  : "Toggle your status to online to start receiving dispatch requests."}
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Available Jobs */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-xl flex items-center justify-between px-1">
            Available Jobs
            <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">{isActive ? jobs.length : 0}</span>
          </h3>

          {!isActive ? (
            <div className="bg-gray-50 rounded-3xl border border-dashed border-gray-300 p-8 text-center mt-2">
              <Power size={32} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Go online to see available jobs nearby.</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-8 text-center border border-gray-100 mt-2">
              <p className="text-gray-500 font-medium">No jobs available right now. Waiting for new donations.</p>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              {jobs.map(job => (
                <div key={job.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-gray-900 line-clamp-2 pr-4">{job.food}</h4>
                    <span className="shrink-0 bg-blue-50 text-blue-700 text-[10px] uppercase tracking-wider font-extrabold px-2 py-1 rounded-md border border-blue-100">{job.totalPay}</span>
                  </div>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3 bg-gray-50/50 p-2 rounded-lg">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-orange-500" />
                      <span className="text-sm font-medium text-gray-600">{job.pickup}</span>
                    </div>
                    <div className="flex items-start gap-3 bg-gray-50/50 p-2 rounded-lg">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                      <span className="text-sm font-medium text-gray-600">{job.dropoff}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAcceptJob(job)}
                    disabled={!!activeJob}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-orange-600 shadow-md hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-[1.02] active:scale-95"
                  >
                    Accept Job
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
