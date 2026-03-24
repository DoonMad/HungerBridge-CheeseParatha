import { useState, useEffect } from 'react';
import { Bike, Power, MapPin, Package, CheckCircle, Navigation } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon not showing in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [availRes, activeRes] = await Promise.all([
          fetch('http://localhost:8000/api/listings/volunteer/available'),
          user?.id ? fetch(`http://localhost:8000/api/listings/volunteer/${user.id}`) : Promise.resolve(null)
        ]);
        
        if (availRes.ok) {
          const availData = await availRes.json();
          setJobs(availData.map(l => {
            const exp = l.expires_at.endsWith('Z') ? l.expires_at : l.expires_at + 'Z';
            return {
              id: l.id,
              food: l.food_name,
              pickup: l.pickup_location || 'Donor Location',
              dropoff: l.dropoff_location || 'NGO Location',
              totalPay: 'Impact Points: 150',
              status: l.status,
              lat: l.latitude,
              lng: l.longitude,
              expiresIn: Math.max(0, Math.floor((new Date(exp) - new Date()) / 60000)) + ' mins'
            };
          }));
        }
        
        if (activeRes && activeRes.ok) {
          const activeData = await activeRes.json();
          const current = activeData.find(l => l.status === 'volunteer_assigned');
          if (current) {
            const exp = current.expires_at.endsWith('Z') ? current.expires_at : current.expires_at + 'Z';
            setActiveJob({
              id: current.id,
              food: current.food_name,
              pickup: current.pickup_location || 'Donor Location',
              dropoff: current.dropoff_location || 'NGO Location',
              totalPay: 'Impact Points: 150',
              status: current.status,
              lat: current.latitude,
              lng: current.longitude,
              dropoff_lat: current.dropoff_lat,
              dropoff_lng: current.dropoff_lng,
              expiresIn: Math.max(0, Math.floor((new Date(exp) - new Date()) / 60000)) + ' mins'
            });
          } else {
             setActiveJob(null);
          }
        }
      } catch (e) {
        console.error("Failed to fetch jobs", e);
      }
    };
    if (isActive) {
      fetchJobs();
      // Polling for live updates
      const interval = setInterval(fetchJobs, 10000);
      return () => clearInterval(interval);
    }
  }, [isActive, user?.id]);

  const handleAcceptJob = async (job) => {
    try {
      if (!user?.id) { alert("Please log in as a volunteer first."); return; }
      const res = await fetch(`http://localhost:8000/api/listings/${job.id}/volunteer-accept?volunteer_id=${user.id}`, { method: 'POST' });
      if (res.ok) {
        setActiveJob(job);
        setJobs(jobs.filter(j => j.id !== job.id));
      } else {
        alert("Failed to accept job. It may have been taken by someone else.");
      }
    } catch(e) {
      console.error(e);
    }
  };

  const handleCompleteJob = async () => {
    setIsCompleting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/listings/${activeJob.id}/complete`, { method: 'POST' });
      if (res.ok) {
        alert('Delivery marked as complete! The NGO will verify receipt.');
        setActiveJob(null);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setIsCompleting(false);
    }
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
              
              <div className="relative h-64 w-full bg-gray-100 z-0 border-b border-gray-100">
                {activeJob.lat && activeJob.lng && (
                  <MapContainer 
                    bounds={
                      activeJob.dropoff_lat 
                        ? [[activeJob.lat, activeJob.lng], [activeJob.dropoff_lat, activeJob.dropoff_lng]] 
                        : [[activeJob.lat, activeJob.lng], [activeJob.lat, activeJob.lng]]
                    } 
                    scrollWheelZoom={false} 
                    style={{ height: "100%", width: "100%" }}
                  >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[activeJob.lat, activeJob.lng]}>
                    <Popup>
                      <b>Donor Pickup Point</b><br/>{activeJob.pickup}
                    </Popup>
                  </Marker>
                  {activeJob.dropoff_lat && activeJob.dropoff_lng && (
                    <Marker position={[activeJob.dropoff_lat, activeJob.dropoff_lng]}>
                      <Popup>
                        <b>NGO Drop-off Point</b><br/>{activeJob.dropoff}
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              )}
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
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600 mt-1 shrink-0"><MapPin size={24} /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Pick up from Donor</p>
                      <p className="font-bold text-gray-900 text-lg leading-tight">{activeJob.pickup}</p>
                      <p className="text-sm text-gray-500 mt-0.5">Nearby • Ready now</p>
                    </div>
                  </div>
              
                  {/* Dropoff */}
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mt-1 shrink-0"><Navigation size={24} /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Deliver to NGO</p>
                      <p className="font-bold text-gray-900 text-lg leading-tight">{activeJob.dropoff}</p>
                      <p className="text-sm text-gray-500 mt-0.5">Nearby • Signature Required</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCompleteJob}
                  disabled={isCompleting}
                  className="w-full bg-gray-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                >
                  <CheckCircle size={20} />
                  {isCompleting ? 'Completing...' : 'Mark Delivery Complete'}
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
