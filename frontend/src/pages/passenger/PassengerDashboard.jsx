import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function PassengerDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome back, {user?.name}
      </h1>
      <p className="text-gray-500 dark:text-slate-400 mb-8">What would you like to do today?</p>
      {/* TODO: Quick stats, upcoming bookings, quick search */}
    </div>
  );
}
