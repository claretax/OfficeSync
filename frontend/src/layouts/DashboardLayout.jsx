import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const DashboardLayout = () => {
  return (
    <div>
      {/* Sidebar */}
      <aside className="">
      </aside>
      <Sidebar/>
      {/* Main Content Area */}
      <main className='ml-64 p-4'>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;