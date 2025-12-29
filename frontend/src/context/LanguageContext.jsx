/**
 * Language Context Provider
 * 
 * Provides language switching functionality across the application.
 * Currently configured for English-only mode.
 * 
 * Usage:
 * import { useLanguage, LanguageProvider } from '@/context/LanguageContext';
 * 
 * const { language, setLanguage, toggleLanguage } = useLanguage();
 */

import { createContext, useContext, useState } from 'react';

export const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('en');

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'en' ? 'ru' : 'en');
  };

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'ru') {
      setLanguageState(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
