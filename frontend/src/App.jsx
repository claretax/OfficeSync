import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-6 bg-gray-100">
          <Routes>
            <Route path="/stats" element={<DashboardLayout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<div className="text-2xl">Welcome to SMS Dashboard</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;