import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
  {/* Sidebar */}
  <aside className="">
  </aside>
  <Sidebar/>
  {/* Main Content Area */}
  <main className='ml-64 p-0 flex-1 overflow-auto'>
    <Outlet />
  </main>
</div>

  );
};

export default DashboardLayout;