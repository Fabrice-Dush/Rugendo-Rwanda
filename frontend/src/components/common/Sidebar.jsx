import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

const NAV_LINK_KEYS = {
  passenger: [
    { to: '/passenger',          key: 'sidebarDashboard', end: true },
    { to: '/passenger/book',     key: 'sidebarBookABus' },
    { to: '/passenger/bookings', key: 'sidebarMyBookings' },
    { to: '/passenger/profile',  key: 'profile' },
  ],
  admin: [
    { to: '/admin',           key: 'sidebarDashboard', end: true },
    { to: '/admin/schedules', key: 'sidebarSchedules' },
    { to: '/admin/buses',     key: 'sidebarBuses' },
    { to: '/admin/drivers',   key: 'sidebarDrivers' },
    { to: '/admin/routes',    key: 'sidebarRoutes' },
    { to: '/admin/bookings',  key: 'sidebarBookings' },
    { to: '/profile',         key: 'profile' },
  ],
  super_admin: [
    { to: '/super-admin',             key: 'sidebarDashboard', end: true },
    { to: '/super-admin/operators',   key: 'sidebarOperators' },
    { to: '/super-admin/users',       key: 'sidebarUsers' },
    { to: '/super-admin/settings',    key: 'sidebarPlatformSettings' },
    { to: '/admin',                   key: 'sidebarAdminPanel' },
    { to: '/profile',                 key: 'profile' },
  ],
  operator: [
    { to: '/operator',          key: 'sidebarDashboard', end: true },
    { to: '/operator/boarding', key: 'sidebarBoardingValidation' },
    { to: '/operator/bookings', key: 'sidebarCompanyBookings' },
    { to: '/operator/profile',  key: 'profile' },
  ],
};

export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const links = NAV_LINK_KEYS[role] || [];
  const roleName = role.replace('_', '-');

  return (
    <aside className="w-60 min-h-screen bg-white dark:bg-slate-800 border-r border-gray-100 dark:border-slate-700 flex flex-col">
      <div className="p-4 border-b border-gray-100 dark:border-slate-700">
        <span className="font-bold text-brand-600 text-lg">Rugendo Rwanda</span>
        <p className="text-xs text-gray-400 capitalize mt-0.5">{roleName} {t('sidebarPanel')}</p>
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
            {t(link.key)}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100 dark:border-slate-700 space-y-1">
        <Link
          to="/"
          className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          {t('sidebarHomepage')}
        </Link>
        <button
          onClick={logout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          {t('logout')}
        </button>
      </div>
    </aside>
  );
}
