import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export default function AdminLayout() {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!localStorage.getItem('rugendo-theme')) {
      setTheme('dark');
    }
  }, []);

  return (
    <div className="min-h-screen flex">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-slate-900">
        <Outlet />
      </main>
    </div>
  );
}
