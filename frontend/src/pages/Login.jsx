import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleMockLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      // Create a superuser object that has access to all 3 roles
      const superUser = {
        id: "demo-superuser-001",
        name: "SuperAdmin Tester",
        email: "demo@hungerbridge.com",
        roles: ['ngo', 'donor', 'volunteer'],
      };
      
      // Pass the user and default to 'ngo' role
      login(superUser, 'ngo');
      navigate('/ngo/listings');
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white border border-gray-100 shadow-xl rounded-4xl text-center animate-in fade-in zoom-in-95 duration-500">
      <div className={`w-28 h-28 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner`}>
        <ShieldCheck size={48} className="text-gray-900" />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
      <p className="text-gray-500 mb-8 font-medium">Log in to manage your HungerBridge portals.</p>
      
      <div className="space-y-4 mb-8">
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full bg-white border-2 border-gray-200 px-4 py-4 rounded-2xl focus:outline-none focus:border-gray-900 font-medium text-gray-900 transition-colors" 
          defaultValue={`demo_superuser@hungerbridge.com`} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full bg-white border-2 border-gray-200 px-4 py-4 rounded-2xl focus:outline-none focus:border-gray-900 font-medium text-gray-900 transition-colors" 
          defaultValue="password123" 
        />
      </div>

      <button 
        onClick={handleMockLogin} 
        disabled={isAuthenticating}
        className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 shadow-xl shadow-gray-900/20 hover:shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center gap-3 text-lg"
      >
        {isAuthenticating ? (
          <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div> Authenticating...</>
        ) : (
          'Login (Test Superuser)'
        )}
      </button>
    </div>
  );
};

export default Login;
