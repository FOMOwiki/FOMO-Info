import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [acceptedCookies, setAcceptedCookies] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState(null);
  const [language, setLanguage] = useState('en');

  const API = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    // Detect language from localStorage or browser
    const savedLang = localStorage.getItem('language') || 
                      (navigator.language.startsWith('ru') ? 'ru' : 'en');
    setLanguage(savedLang);

    // Check if user has already consented
    const consent = localStorage.getItem('fomo_consent');
    if (!consent) {
      // Load settings from API
      fetch(`${API}/cookie-consent-settings`)
        .then(res => res.json())
        .then(data => {
          setSettings(data);
          if (data.enabled) {
            // Small delay before showing
            setTimeout(() => setIsVisible(true), 1000);
          }
        })
        .catch(err => {
          console.error('Failed to load cookie consent settings:', err);
          // Show with default settings on error
          setTimeout(() => setIsVisible(true), 1000);
        });
    }
  }, [API]);

  const handleAccept = () => {
    if (acceptedCookies && acceptedPrivacy) {
      localStorage.setItem('fomo_consent', JSON.stringify({
        cookies: true,
        privacy: true,
        timestamp: new Date().toISOString()
      }));
      setIsVisible(false);
    }
  };

  const allAccepted = acceptedCookies && acceptedPrivacy;

  const title = settings ? (language === 'ru' ? settings.title_ru : settings.title_en) : 'Cookie & Privacy Settings';
  const description = settings ? (language === 'ru' ? settings.description_ru : settings.description_en) : 'We value your privacy. Please accept our cookies and privacy policy to continue.';

  return (
    <>
      {/* Overlay to block interaction */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[9998]"
            style={{ pointerEvents: 'auto' }}
          />
        )}
      </AnimatePresence>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-3 pb-4 md:p-4 md:pb-6"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200/80">
                {/* Light gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-emerald-50/30" />
                
                {/* Subtle animated accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 animate-pulse opacity-50" />
                </div>
                
                <div className="relative bg-white/95 backdrop-blur-xl p-4 md:p-5">
                  {/* Content */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
                    {/* Icon & Text */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        {/* Cookie Icon */}
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 font-bold text-base md:text-lg mb-1 flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              🍪 {title}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-semibold border border-emerald-200">
                              Required
                            </span>
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {description}
                          </p>

                          {/* Checkboxes */}
                          <div className="space-y-2">
                            {/* Cookies */}
                            <label className="flex items-start gap-2.5 cursor-pointer group">
                              <div className="relative flex-shrink-0 mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={acceptedCookies}
                                  onChange={(e) => setAcceptedCookies(e.target.checked)}
                                  className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-emerald-500 peer-checked:bg-gradient-to-br peer-checked:from-emerald-400 peer-checked:to-teal-500 transition-all duration-200 group-hover:border-emerald-400 shadow-sm">
                                  <svg className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-gray-900 text-sm font-semibold">
                                  {language === 'ru' ? 'Основные Cookies' : 'Essential Cookies'}
                                </span>
                                <p className="text-gray-500 text-xs mt-0.5 leading-snug">
                                  {language === 'ru' 
                                    ? 'Необходимы для работы платформы, аутентификации и безопасности.'
                                    : 'Required for platform functionality, authentication, and security.'
                                  }
                                </p>
                              </div>
                            </label>

                            {/* Privacy Policy */}
                            <label className="flex items-start gap-2.5 cursor-pointer group">
                              <div className="relative flex-shrink-0 mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={acceptedPrivacy}
                                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                                  className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-emerald-500 peer-checked:bg-gradient-to-br peer-checked:from-emerald-400 peer-checked:to-teal-500 transition-all duration-200 group-hover:border-emerald-400 shadow-sm">
                                  <svg className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-gray-900 text-sm font-semibold">
                                  {language === 'ru' ? 'Политика Конфиденциальности' : 'Privacy Policy'}
                                </span>
                                <p className="text-gray-500 text-xs mt-0.5 leading-snug">
                                  {language === 'ru' ? 'Я согласен с ' : 'I agree to the '}
                                  <a
                                    href={settings?.privacy_policy_url || '/privacy'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {language === 'ru' ? 'Условиями и Политикой' : 'Terms & Privacy Policy'}
                                  </a>
                                </p>
                              </div>
                            </label>
                          </div>

                          {/* Details Section */}
                          <AnimatePresence>
                            {showDetails && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-3 overflow-hidden"
                              >
                                <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-xl p-3 border border-gray-200 shadow-sm">
                                  <h4 className="text-emerald-700 font-semibold text-xs mb-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {language === 'ru' ? 'Что мы собираем:' : 'What we collect:'}
                                  </h4>
                                  <ul className="text-gray-700 text-xs space-y-1.5 list-disc list-inside ml-1">
                                    <li>{language === 'ru' ? 'Основные cookies для аутентификации и безопасности' : 'Essential cookies for authentication & security'}</li>
                                    <li>{language === 'ru' ? 'Аналитика для улучшения производительности' : 'Analytics to improve platform performance'}</li>
                                    <li>{language === 'ru' ? 'Пользовательские настройки' : 'User preferences and settings'}</li>
                                    <li>{language === 'ru' ? 'Данные подключения кошелька (зашифрованы)' : 'Wallet connection data (encrypted)'}</li>
                                  </ul>
                                  <div className="mt-2 flex items-start gap-1.5 text-gray-600 text-xs bg-white/50 rounded-lg p-2 border border-gray-200">
                                    <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <p className="flex-1">
                                      {language === 'ru' 
                                        ? 'Ваши данные зашифрованы и никогда не продаются третьим лицам. '
                                        : 'Your data is encrypted and never sold to third parties. '
                                      }
                                      <a 
                                        href={settings?.privacy_policy_url || '/privacy'} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
                                      >
                                        {language === 'ru' ? 'Полная Политика' : 'Full Privacy Policy'}
                                      </a>
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[150px]">
                      <button
                        onClick={handleAccept}
                        disabled={!allAccepted}
                        className={`
                          px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg
                          ${allAccepted
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-emerald-500/30 hover:scale-[1.02] cursor-pointer hover:from-emerald-600 hover:to-teal-600'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                          }
                        `}
                      >
                        {allAccepted ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {language === 'ru' ? 'Принять' : 'Accept'}
                          </span>
                        ) : (
                          language === 'ru' ? 'Выберите все' : 'Accept All'
                        )}
                      </button>
                      
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-5 py-2 text-gray-500 hover:text-emerald-600 text-xs font-medium transition-colors hover:bg-gray-50 rounded-lg"
                      >
                        {showDetails 
                          ? (language === 'ru' ? 'Скрыть детали' : 'Hide Details')
                          : (language === 'ru' ? 'Показать детали' : 'View Details')
                        }
                      </button>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: acceptedCookies && acceptedPrivacy ? '100%' : 
                                 acceptedCookies || acceptedPrivacy ? '50%' : '0%' 
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm"
                      />
                    </div>
                    <span className="text-gray-500 text-xs font-semibold whitespace-nowrap">
                      {acceptedCookies && acceptedPrivacy ? '2/2' : 
                       acceptedCookies || acceptedPrivacy ? '1/2' : '0/2'}
                    </span>
                  </div>

                  {/* Secure Badge */}
                  <div className="mt-2.5 flex items-center justify-center gap-1.5 text-gray-400 text-xs">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>
                      {language === 'ru' 
                        ? 'Защищено FOMO Platform • Соответствие GDPR'
                        : 'Secured by FOMO Platform • GDPR Compliant'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CookieConsent;
