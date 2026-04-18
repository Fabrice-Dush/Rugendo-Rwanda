import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export default function PassengerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {t('passengerWelcome', { name: user?.name })}
      </h1>
      <p className="text-gray-500 dark:text-slate-400 mb-8">{t('passengerWelcomeSubtitle')}</p>
      {/* TODO: Quick stats, upcoming bookings, quick search */}
    </div>
  );
}
