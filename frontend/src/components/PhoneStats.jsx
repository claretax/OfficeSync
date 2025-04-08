import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../constants';

function PhoneStats({ dateRange }) {
  const [phoneStats, setPhoneStats] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState(0);

  useEffect(() => {
    axios.get(API_URL+'/messages/mobile-stats', {
      params: dateRange,
    }).then((res) => setPhoneStats(res.data));
  }, [dateRange]);

  if (!phoneStats.length) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Per-Phone Stats</h2>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {phoneStats.map((phone, index) => (
          <button
            key={phone._id}
            onClick={() => setSelectedPhone(index)}
            className={`px-4 py-2 rounded-md ${selectedPhone === index ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-blue-400 hover:text-white`}
          >
            {phone._id}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Sent</h3>
          <p className="text-3xl font-bold text-green-600">{phoneStats[selectedPhone].sent}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Failed</h3>
          <p className="text-3xl font-bold text-red-600">{phoneStats[selectedPhone].failed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{phoneStats[selectedPhone].pending}</p>
        </div>
      </div>
    </div>
  );
}

export default PhoneStats;