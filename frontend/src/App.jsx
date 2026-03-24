import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Listings from './pages/Listings';
import VolunteerDashboard from './pages/VolunteerDashboard';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import PublicProfile from './pages/PublicProfile';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<PublicProfile />} />
          
          {/* Protected Area Routes (Simulated) */}
          <Route path="ngo/listings" element={<Listings />} />
          <Route path="ngo/dashboard" element={<NGODashboard />} />
          <Route path="donor/workspace" element={<DonorDashboard />} />
          <Route path="volunteer/dispatch" element={<VolunteerDashboard />} />
        </Route>
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
