import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Dashboard from './pages/Dashboard';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import PublicProfile from './pages/PublicProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="listings" element={<Listings />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="donor" element={<DonorDashboard />} />
          <Route path="ngo" element={<NGODashboard />} />
          <Route path="profile" element={<PublicProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
