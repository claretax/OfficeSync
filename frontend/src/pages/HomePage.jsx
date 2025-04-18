import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

  const navigate = useNavigate();
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">CRM Dashboard</h1>
        <button onClick={()=>navigate('/login')}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Leads Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">Manage Leads</h2>
            <p className="text-gray-600">View and manage your leads effectively.</p>
            <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
              View Leads
            </button>
          </div>

          {/* Projects Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">Manage Projects</h2>
            <p className="text-gray-600">Track your projects and their progress.</p>
            <button className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
              View Projects
            </button>
          </div>

          {/* SMS Dashboard Section */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">SMS Dashboard</h2>
            <p className="text-gray-600">Manage your SMS communications.</p>
            <button className="mt-4 bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition">
              View SMS Dashboard
            </button>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="bg-white p-4 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Integrations</h2>
          <p className="text-gray-600">Connect with other tools and services.</p>
          <button className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition">
            Manage Integrations
          </button>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-white shadow-md p-4 text-center">
        <p className="text-gray-600">© 2023 CRM Application. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
