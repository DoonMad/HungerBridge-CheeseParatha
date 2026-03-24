import { Link } from 'react-router-dom';
import { Clock, Heart, ShieldCheck } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-medium text-sm mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          Live in 3 cities
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Rescue Surplus Food, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-rose-500">
            Feed the Hungry.
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A real-time platform connecting restaurants and canteens with NGOs to redistribute surplus food before it expires.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/listings"
            className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Check Live Listings
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-full font-medium transition-all shadow-sm"
          >
            I'm a Volunteer
          </Link>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="grid md:grid-cols-3 gap-8 pt-12 border-t border-gray-200">
        {[
          {
            icon: <Clock className="w-8 h-8 text-rose-500" />,
            title: 'Strict 2-Hour Window',
            desc: 'Real-time countdowns ensure food reaches those in need safely and quickly.'
          },
          {
            icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
            title: 'Verified Partners',
            desc: 'Only trusted NGOs and volunteers to maintain food safety and quality.'
          },
          {
            icon: <Heart className="w-8 h-8 text-orange-500" />,
            title: 'Gamified Impact',
            desc: 'Track your reputation and see the real human impact of your contributions.'
          }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
