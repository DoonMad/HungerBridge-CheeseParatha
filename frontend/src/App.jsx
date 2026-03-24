import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Listings from './pages/Listings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="listings" element={<Listings />} />
          <Route path="dashboard" element={
            <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Dashboard Coming Soon</h2>
              <p className="text-gray-500">Volunteer and NGO gamified dashboards will appear here.</p>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
