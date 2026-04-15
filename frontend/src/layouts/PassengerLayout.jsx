import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar.jsx';

export default function PassengerLayout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar role="passenger" />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-slate-900">
        <Outlet />
      </main>
    </div>
  );
}
