import { useEffect, useState } from 'react';
import {API_URL} from '../constants';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatsOverview({ dateRange }) {
  const [stats, setStats] = useState({ totalSent: 0, totalFailed: 0, totalPending: 0 });

  useEffect(() => {
    axios.get(API_URL+'/messages/stats', {
      params: dateRange,
    }).then((res) => setStats(res.data));
  }, [dateRange]);

  const chartData = {
    labels: ['Sent', 'Failed', 'Pending'],
    datasets: [{
      data: [stats.totalSent, stats.totalFailed, stats.totalPending],
      backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
    }],
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Aggregated Stats</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Sent</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalSent}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Failed</h3>
          <p className="text-3xl font-bold text-red-600">{stats.totalFailed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.totalPending}</p>
        </div>
      </div>
      <div className="max-w-md mx-auto">
        <Pie data={chartData} />
      </div>
    </div>
  );
}

export default StatsOverview;