import React, { createContext, useContext, useState } from 'react';
import { translations } from '../utils/translations.js';

const LanguageContext = createContext(null);

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'fr', label: 'Français' },
];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('rugendo-lang') || 'en'
  );

  const changeLanguage = (code) => {
    if (SUPPORTED_LANGUAGES.find((l) => l.code === code)) {
      setLanguage(code);
      localStorage.setItem('rugendo-lang', code);
    }
  };

  // t(key) — look up translation key, fall back to English, then the key itself
  const t = (key) => {
    return translations[language]?.[key] ?? translations['en']?.[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
