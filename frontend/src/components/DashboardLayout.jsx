import { useState } from 'react';
import StatsOverview from './StatsOverview';
import PhoneStats from './PhoneStats';
import MessageTable from './MessageTable';

function DashboardLayout() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">SMS Sending Stats</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <StatsOverview dateRange={dateRange} />
      <PhoneStats dateRange={dateRange} />
      <MessageTable dateRange={dateRange} />
    </div>
  );
}

export default DashboardLayout;