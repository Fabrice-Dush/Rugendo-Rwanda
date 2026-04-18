import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function AuthLayout() {
  const { t } = useLanguage();

  const FEATURES = [
    t('authPanelFeature1'),
    t('authPanelFeature2'),
    t('authPanelFeature3'),
    t('authPanelFeature4'),
  ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0e0a1f]">
      {/* Left brand panel — hidden on small screens */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0845 0%, #2d1080 50%, #1a0845 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-600 opacity-20 blur-3xl" aria-hidden />
        <div className="absolute bottom-10 -left-20 w-64 h-64 rounded-full bg-accent-500 opacity-15 blur-3xl" aria-hidden />

        <div className="relative">
          <Link to="/" className="flex items-center gap-2">
            <span
              className="text-xl font-extrabold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #9b72ff 0%, #fa26ae 100%)' }}
            >
              Rugendo Rwanda
            </span>
          </Link>
        </div>

        <div className="relative">
          <p className="text-3xl font-bold leading-snug mb-4">
            {t('authPanelTagline')}
          </p>
          <p className="text-slate-300 text-base leading-relaxed">
            {t('authPanelSubtitle')}
          </p>
          <div className="mt-8 flex flex-col gap-3 text-sm text-slate-300">
            {FEATURES.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-500">{t('authPanelCopyright')}</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <Link to="/">
            <span
              className="text-2xl font-extrabold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #6e26ff 0%, #fa26ae 100%)' }}
            >
              Rugendo Rwanda
            </span>
          </Link>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{t('authMobileSubtitle')}</p>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
