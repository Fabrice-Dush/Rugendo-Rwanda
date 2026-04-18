import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext.jsx';

export default function OperatorDashboard() {
  const { t } = useLanguage();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('operatorDashboardTitle')}</h1>
      {/* TODO: Today's schedules assigned to this operator */}
    </div>
  );
}
