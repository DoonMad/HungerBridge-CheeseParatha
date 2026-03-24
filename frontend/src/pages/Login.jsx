import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);
    
    try {
      const role = await login(email, password);

      
      if (role === 'ngo') navigate('/ngo/listings');
      else if (role === 'volunteer') navigate('/volunteer/dispatch');
      else navigate('/donor/workspace');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white border border-gray-100 shadow-xl rounded-4xl text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-28 h-28 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <ShieldCheck size={48} className="text-gray-900" />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
      <p className="text-gray-500 mb-8 font-medium">Log in to manage your HungerBridge portals.</p>
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 mb-8">
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email Address" 
          className="w-full bg-white border-2 border-gray-200 px-4 py-4 rounded-2xl focus:outline-none focus:border-gray-900 font-medium text-gray-900 transition-colors" 
        />
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password" 
          className="w-full bg-white border-2 border-gray-200 px-4 py-4 rounded-2xl focus:outline-none focus:border-gray-900 font-medium text-gray-900 transition-colors" 
        />
        
        <button 
          type="submit"
          disabled={isAuthenticating}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 shadow-xl shadow-gray-900/20 hover:shadow-orange-600/30 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center gap-3 text-lg mt-4"
        >
          {isAuthenticating ? (
            <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div> Authenticating...</>
          ) : (
            'Log In'
          )}
        </button>
      </form>

      <p className="mt-6 text-gray-500 font-medium">
        Don't have an account? <Link to="/signup" className="text-gray-900 hover:text-orange-600 font-bold transition-colors">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
