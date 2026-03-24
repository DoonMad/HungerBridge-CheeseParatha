import { Link, useNavigate } from 'react-router-dom';
import { Clock, Heart, ShieldCheck, Package, Store, Bike } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Rescue Surplus Food, <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-rose-500">
            Feed the Hungry.
          </span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          A real-time platform connecting restaurants and canteens with NGOs to redistribute surplus food before it expires. Select your role below to get started.
        </p>
      </section>

      {/* Role Selection Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div onClick={() => navigate('/login')} className="cursor-pointer group bg-white border border-gray-200 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/10 rounded-3xl p-8 lg:p-10 transition-all duration-300 transform hover:-translate-y-2 text-center h-full flex flex-col">
            <div className="w-24 h-24 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Package size={40} className="stroke-2" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Donate Food</h3>
            <p className="text-gray-500 font-medium flex-1 text-lg">I am a restaurant or canteen with surplus safe food that needs to be rescued.</p>
            <div className="mt-8 bg-orange-50 text-orange-600 font-extrabold uppercase tracking-widest text-sm py-4 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">Donor Portal →</div>
          </div>

          <div onClick={() => navigate('/login')} className="cursor-pointer group bg-white border border-gray-200 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10 rounded-3xl p-8 lg:p-10 transition-all duration-300 transform hover:-translate-y-2 text-center h-full flex flex-col">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Store size={40} className="stroke-2" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Claim Food</h3>
            <p className="text-gray-500 font-medium flex-1 text-lg">I am an NGO looking for verified live surplus food listings in my area.</p>
            <div className="mt-8 bg-emerald-50 text-emerald-600 font-extrabold uppercase tracking-widest text-sm py-4 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">NGO Portal →</div>
          </div>

          <div onClick={() => navigate('/login')} className="cursor-pointer group bg-white border border-gray-200 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 rounded-3xl p-8 lg:p-10 transition-all duration-300 transform hover:-translate-y-2 text-center h-full flex flex-col">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Bike size={40} className="stroke-2" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Deliver Food</h3>
            <p className="text-gray-500 font-medium flex-1 text-lg">I am a volunteer willing to pick up and securely transport claimed food.</p>
            <div className="mt-8 bg-blue-50 text-blue-600 font-extrabold uppercase tracking-widest text-sm py-4 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">Volunteer Portal →</div>
          </div>

        </div>
      </section>

      {/* Features Showcase */}
      <section className="grid md:grid-cols-3 gap-8 pt-12 border-t border-gray-200 max-w-7xl mx-auto px-4 pb-12">
        {[
          {
            icon: <Clock className="w-8 h-8 text-rose-500" />,
            title: 'Strict Time Windows',
            desc: 'Real-time ML countdowns ensure food reaches those in need safely and quickly before it expires.'
          },
          {
            icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
            title: 'Verified Partners',
            desc: 'Only trusted NGOs and authenticated volunteers to maintain food safety and operational quality.'
          },
          {
            icon: <Heart className="w-8 h-8 text-orange-500" />,
            title: 'Gamified Impact',
            desc: 'Public profiles track reputation and show the real human impact of your ecosystem contributions.'
          }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
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
