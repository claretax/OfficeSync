import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [inactivePhones, setInactivePhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMobileStats = async () => {
      try {
        // Get today's date range
        const today = new Date();
        const startDate = new Date(today.setHours(0, 0, 0, 0));
        const endDate = new Date(today.setHours(23, 59, 59, 999));

        const response = await axios.get('http://localhost:5000/api/messages/mobile-stats', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        });

        // Find phones that haven't sent any messages today
        const inactive = response.data.filter(stat => 
          stat.sent === 0 && stat.failed === 0 && stat.pending === 0
        );

        setInactivePhones(inactive);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch mobile stats');
        setLoading(false);
      }
    };

    fetchMobileStats();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchMobileStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <>
          {inactivePhones.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-4">
                <p className="font-bold text-lg">
                  Alert: {inactivePhones.length} phone{inactivePhones.length > 1 ? 's' : ''} haven't sent any messages today
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactivePhones.map((phone, index) => (
                  <div key={index} className="bg-amber-50 border border-amber-200 rounded p-4">
                    <h3 className="font-semibold text-gray-800">
                      Phone ID: {phone._id || 'Unknown'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      No messages sent today
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {inactivePhones.length === 0 && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              All phones are active and sending messages today!
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;