import { Lock, User } from 'lucide-react';

const Login = () => {
  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Login to HungerBridge</h1>
      <p className="text-sm text-gray-500 mb-6">Access donor, NGO, or volunteer dashboards after authentication.</p>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring focus:ring-orange-200"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring focus:ring-orange-200"
        />
      </div>
      <button className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-2xl font-bold shadow-sm flex items-center justify-center gap-2">
        <Lock size={16} />
        Login
      </button>
      <p className="mt-4 text-xs text-gray-500 flex items-center gap-2"><User size={12} /> Demo mode only, no backend auth configured yet.</p>
    </div>
  );
};

export default Login;
