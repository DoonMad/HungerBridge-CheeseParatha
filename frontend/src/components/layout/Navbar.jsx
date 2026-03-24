import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Utensils, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, activeRole, user, logout, switchRole } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleRoleSwitch = (role) => {
    switchRole(role);
    setIsDropdownOpen(false);
    setIsOpen(false);
    
    if (role === 'ngo') navigate('/ngo/listings');
    else if (role === 'donor') navigate('/donor/workspace');
    else if (role === 'volunteer') navigate('/volunteer/dispatch');
  };

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
            {!isAuthenticated ? (
              <>
                <NavLink to="/" className="text-sm font-bold text-gray-600 hover:text-orange-500 transition-colors duration-200">
                  Platform
                </NavLink>
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                <button onClick={() => navigate('/login')} className="bg-gray-900 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold transition-all shadow-md active:scale-95">
                  Get Started / Login
                </button>
              </>
            ) : (
              <>
                {activeRole === 'ngo' && (
                  <>
                    <NavLink to="/ngo/listings" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}>Live Feed</NavLink>
                    <NavLink to="/ngo/dashboard" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}>My Claims</NavLink>
                  </>
                )}
                {activeRole === 'donor' && (
                  <NavLink to="/donor/workspace" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}>Donor Workspace</NavLink>
                )}
                {activeRole === 'volunteer' && (
                  <NavLink to="/volunteer/dispatch" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}>Dispatch Radar</NavLink>
                )}
                
                <NavLink to="/profile" className={({isActive}) => `text-sm font-bold transition-colors ${isActive ? 'text-orange-600' : 'text-gray-600 hover:text-orange-500'}`}>My Profile</NavLink>
                
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                
                {/* Role Switcher Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-full transition-all"
                  >
                    <div className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                      {activeRole?.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-700 capitalize">Role: {activeRole}</span>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Switch Role</p>
                      </div>
                      {user?.roles.map(r => (
                        <button
                          key={r}
                          onClick={() => handleRoleSwitch(r)}
                          className={`w-full text-left px-4 py-3 text-sm font-bold capitalize transition-colors flex items-center gap-2 ${activeRole === r ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                          {r}
                          {activeRole === r && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-auto"></div>}
                        </button>
                      ))}
                      <div className="border-t border-gray-100">
                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2">
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden transition-all duration-300 ease-in-out border-b border-gray-100 ${isOpen ? 'max-h-96 opacity-100 shadow-lg' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-4 pb-6 space-y-3 bg-white">
          {!isAuthenticated ? (
            <>
              <NavLink to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-xl text-base font-bold bg-gray-50 text-gray-900">Platform Info</NavLink>
              <button onClick={() => { setIsOpen(false); navigate('/login'); }} className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl font-bold shadow-sm">Get Started / Login</button>
            </>
          ) : (
            <>
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Switch Roles</p>
              {user?.roles.map(r => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm capitalize ${activeRole === r ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-700'}`}
                >
                  Switch to {r} Dashboard
                </button>
              ))}
              <div className="pt-2 border-t border-gray-100">
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl font-bold text-rose-500 bg-rose-50">Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
