import React from 'react';
import Layout from '../components/Layout';

const Dashboard = () => {
  const stats = [
    { label: 'Active Projects', value: '12', icon: '📋', color: 'bg-blue-500' },
    { label: 'Pending Tasks', value: '24', icon: '✅', color: 'bg-yellow-500' },
    { label: 'Upcoming Deadlines', value: '5', icon: '⏰', color: 'bg-red-500' },
    { label: 'Open Pendencies', value: '3', icon: '⚠️', color: 'bg-orange-500' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow p-6 flex items-center"
            >
              <div className={`${stat.color} p-3 rounded-lg text-white mr-4`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Progress Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Project Progress
            </h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart will be displayed here</p>
            </div>
          </div>

          {/* Task Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Task Distribution
            </h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">Chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center p-4 border-b border-gray-100"
              >
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <span className="text-blue-500">📝</span>
                </div>
                <div>
                  <p className="text-gray-800">
                    Task "Complete Documentation" was updated
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;