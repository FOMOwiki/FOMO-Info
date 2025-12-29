import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [acceptedCookies, setAcceptedCookies] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('fomo_consent');
    if (!consent) {
      // Small delay before showing
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

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

  return (
    <>
      {/* Overlay to block interaction */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
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
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 pb-6"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] shadow-2xl">
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 animate-pulse" />
                
                <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-[14px] p-4 md:p-6">
                  {/* Content */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    {/* Icon & Text */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        {/* Cookie Icon */}
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                            🍪 Cookie & Privacy Settings
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded-full font-medium">
                              Required
                            </span>
                          </h3>
                          <p className="text-gray-300 text-sm leading-relaxed mb-3">
                            We value your privacy. Please accept our cookies and privacy policy to continue exploring the FOMO platform.
                          </p>

                          {/* Checkboxes */}
                          <div className="space-y-2">
                            {/* Cookies */}
                            <label className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative flex-shrink-0 mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={acceptedCookies}
                                  onChange={(e) => setAcceptedCookies(e.target.checked)}
                                  className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 border-gray-600 rounded-md peer-checked:border-emerald-400 peer-checked:bg-gradient-to-br peer-checked:from-emerald-400 peer-checked:to-teal-500 transition-all duration-200 group-hover:border-emerald-500">
                                  <svg className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1">
                                <span className="text-white text-sm font-medium">Essential Cookies</span>
                                <p className="text-gray-400 text-xs mt-0.5">
                                  Required for platform functionality, authentication, and security.
                                </p>
                              </div>
                            </label>

                            {/* Privacy Policy */}
                            <label className="flex items-start gap-3 cursor-pointer group">
                              <div className="relative flex-shrink-0 mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={acceptedPrivacy}
                                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                                  className="peer sr-only"
                                />
                                <div className="w-5 h-5 border-2 border-gray-600 rounded-md peer-checked:border-emerald-400 peer-checked:bg-gradient-to-br peer-checked:from-emerald-400 peer-checked:to-teal-500 transition-all duration-200 group-hover:border-emerald-500">
                                  <svg className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1">
                                <span className="text-white text-sm font-medium">Privacy Policy</span>
                                <p className="text-gray-400 text-xs mt-0.5">
                                  I agree to the{' '}
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setShowDetails(!showDetails);
                                    }}
                                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
                                  >
                                    Terms & Privacy Policy
                                  </button>
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
                                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                                  <h4 className="text-emerald-400 font-semibold text-xs mb-2">📜 What we collect:</h4>
                                  <ul className="text-gray-300 text-xs space-y-1.5 list-disc list-inside">
                                    <li>Essential cookies for authentication & security</li>
                                    <li>Analytics to improve platform performance</li>
                                    <li>User preferences and settings</li>
                                    <li>Wallet connection data (encrypted)</li>
                                  </ul>
                                  <p className="text-gray-400 text-xs mt-2">
                                    🔒 Your data is encrypted and never sold to third parties. 
                                    Read our full{' '}
                                    <a href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline">
                                      Privacy Policy
                                    </a>
                                    .
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[160px]">
                      <button
                        onClick={handleAccept}
                        disabled={!allAccepted}
                        className={`
                          px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg
                          ${allAccepted
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-emerald-500/50 hover:scale-105 cursor-pointer'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                          }
                        `}
                      >
                        {allAccepted ? '✓ Accept & Continue' : 'Accept All'}
                      </button>
                      
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-6 py-2 text-gray-400 hover:text-emerald-400 text-xs font-medium transition-colors"
                      >
                        {showDetails ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: acceptedCookies && acceptedPrivacy ? '100%' : 
                                 acceptedCookies || acceptedPrivacy ? '50%' : '0%' 
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                      />
                    </div>
                    <span className="text-gray-400 text-xs font-medium whitespace-nowrap">
                      {acceptedCookies && acceptedPrivacy ? '2/2' : 
                       acceptedCookies || acceptedPrivacy ? '1/2' : '0/2'}
                    </span>
                  </div>

                  {/* Secure Badge */}
                  <div className="mt-3 flex items-center justify-center gap-2 text-gray-500 text-xs">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secured by FOMO Platform • GDPR Compliant</span>
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
