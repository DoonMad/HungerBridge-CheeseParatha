import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Utensils, Heart, Clock } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Live Listings', path: '/listings' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2">
            <div className="bg-orange-500 text-white p-2 rounded-xl">
              <Utensils size={24} className="animate-pulse" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-orange-600 to-amber-500">
              HungerBridge
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-orange-600'
                      : 'text-gray-600 hover:text-orange-500'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-md shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-0.5">
              Donate Food
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-b border-gray-100 shadow-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <button className="w-full mt-4 bg-orange-600 text-white px-5 py-3 rounded-xl font-medium shadow-md">
            Donate Food
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
