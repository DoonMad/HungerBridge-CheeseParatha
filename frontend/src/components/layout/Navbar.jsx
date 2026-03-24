import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Utensils } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <NavLink to="/" className="shrink-0 flex items-center gap-3">
            <div className="bg-orange-500 text-white p-2.5 rounded-xl shadow-sm shadow-orange-500/20">
              <Utensils size={24} className="animate-pulse" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-orange-600 to-amber-500">
              HungerBridge
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/ngo/listings" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}>NGO Feed</NavLink>
            <NavLink to="/donor/workspace" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}>Donor Hub</NavLink>
            <NavLink to="/volunteer/dispatch" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}>Volunteer Dash</NavLink>
            <NavLink to="/profile" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}>Public Profile</NavLink>
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            <button 
              onClick={() => navigate('/login')}
              className="text-gray-900 hover:text-orange-600 font-bold transition-colors text-sm"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="bg-gray-900 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold transition-all shadow-md active:scale-95"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out border-b border-gray-100 ${
          isOpen ? 'max-h-64 opacity-100 shadow-lg' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-3 bg-white">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 rounded-xl text-base font-bold bg-gray-50 text-gray-900"
          >
            Platform Info
          </NavLink>
          <button 
            onClick={() => { setIsOpen(false); navigate('/ngo/listings'); }}
            className="w-full text-left px-4 py-3 rounded-xl font-bold text-gray-600 hover:text-gray-900"
          >
            NGO Feed
          </button>
          <button 
            onClick={() => { setIsOpen(false); navigate('/donor/workspace'); }}
            className="w-full text-left px-4 py-3 rounded-xl font-bold text-gray-600 hover:text-gray-900"
          >
            Donor Hub
          </button>
          <button 
            onClick={() => { setIsOpen(false); navigate('/volunteer/dispatch'); }}
            className="w-full text-left px-4 py-3 rounded-xl font-bold text-gray-600 hover:text-gray-900"
          >
            Volunteer Dash
          </button>
          <button 
            onClick={() => { setIsOpen(false); navigate('/login'); }}
            className="w-full bg-gray-900 text-white px-4 py-3 border border-transparent rounded-xl font-bold shadow-sm"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
