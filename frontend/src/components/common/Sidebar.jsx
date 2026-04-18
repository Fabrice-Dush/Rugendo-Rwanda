import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const PROFILE_PATH = {
  passenger:  '/passenger/profile',
  admin:      '/profile',
  super_admin:'/profile',
  operator:   '/operator/profile',
};

const NAV_LINKS = {
  passenger: [
    { to: '/passenger', label: 'Dashboard', end: true },
    { to: '/passenger/book', label: 'Book a Bus' },
    { to: '/passenger/bookings', label: 'My Bookings' },
    { to: '/passenger/profile', label: 'Profile' },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/schedules', label: 'Schedules' },
    { to: '/admin/buses', label: 'Buses' },
    { to: '/admin/drivers', label: 'Drivers' },
    { to: '/admin/routes', label: 'Routes' },
    { to: '/admin/bookings', label: 'Bookings' },
    { to: '/profile', label: 'Profile' },
  ],
  super_admin: [
    { to: '/super-admin', label: 'Dashboard', end: true },
    { to: '/super-admin/operators', label: 'Operators' },
    { to: '/super-admin/users', label: 'Users' },
    { to: '/super-admin/settings', label: 'Platform Settings' },
    { to: '/admin', label: 'Admin Panel' },
    { to: '/profile', label: 'Profile' },
  ],
  operator: [
    { to: '/operator', label: 'Dashboard', end: true },
    { to: '/operator/boarding', label: 'Boarding Validation' },
    { to: '/operator/bookings', label: 'Company Bookings' },
    { to: '/operator/profile', label: 'Profile' },
  ],
};

export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const links = NAV_LINKS[role] || [];

  const roleName = role.replace('_', '-');

  return (
    <aside className="w-60 min-h-screen bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-slate-700">
        <span className="font-bold text-brand-600 text-lg">Rugendo Rwanda</span>
        <p className="text-xs text-gray-400 capitalize mt-0.5">{roleName} panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                  : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100 dark:border-slate-700 space-y-1">
        <Link
          to="/"
          className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          ← Homepage
        </Link>
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
