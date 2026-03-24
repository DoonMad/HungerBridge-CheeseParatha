import { Star, Award, MapPin, Heart, Bike } from 'lucide-react';

const PublicProfile = ({ type = 'volunteer' }) => {
  // Mock Volunteer Profile data (in full app, fetched by ID/Type via Auth)
  const profile = {
    name: "Alex Johnson",
    type: "Volunteer",
    location: "Downtown District",
    joined: "March 2026",
    impactScore: 1250,
    metrics: [
      { label: "Deliveries", value: 45, icon: <Bike className="text-orange-500" /> },
      { label: "On-Time Rate", value: "98%", icon: <Star className="text-yellow-500" /> },
      { label: "People Fed", value: 1200, icon: <Heart className="text-rose-500" /> }
    ],
    reviews: [
      { author: "GreenLife NGO", rating: 5, text: "Alex was incredibly fast and handled the food with great care. Perfect delivery! Highly recommended to all donors." },
      { author: "Hope Shelter", rating: 5, text: "Always on time, very polite. The thermal bag kept the food perfectly warm." }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 lg:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-br from-orange-400/20 to-rose-400/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          <div className="w-28 h-28 bg-linear-to-br from-orange-500 to-rose-500 rounded-full flex items-center justify-center shadow-xl text-white text-4xl font-extrabold uppercase shrink-0 ring-4 ring-orange-50">
            {profile.name.charAt(0)}
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="inline-block bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              {profile.type}
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{profile.name}</h1>
            <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-1 mb-4">
              <MapPin size={16} className="text-gray-400" /> {profile.location} • Joined {profile.joined}
            </p>
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 px-4 py-2 rounded-full text-rose-700 font-bold text-sm shadow-sm transition-transform hover:scale-105">
              <Award size={18} className="text-rose-500" />
              Impact Score: {profile.impactScore}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Array */}
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {profile.metrics.map((m, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm text-center transform hover:-translate-y-1 transition-all duration-300 hover:shadow-md">
            <div className="w-14 h-14 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              {m.icon}
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">{m.value}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Gamified Reviews Section */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Star className="text-yellow-500 fill-yellow-500" size={24} />
          Public Reviews
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {profile.reviews.map((r, i) => (
            <div key={i} className="p-6 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col h-full hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-900">{r.author}</span>
                <div className="flex text-yellow-500">
                  {[...Array(r.rating)].map((_, idx) => <Star key={idx} size={14} className="fill-yellow-500" />)}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
