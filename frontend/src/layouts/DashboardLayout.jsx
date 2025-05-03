import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './DashboardLayout.module.css';
import Sidebar from '../components/layout/Sidebar';

const DashboardLayout = () => {
  return (
    <div>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
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