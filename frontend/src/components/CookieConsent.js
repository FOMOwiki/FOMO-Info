import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [acceptedCookies, setAcceptedCookies] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [settings, setSettings] = useState(null);
  const [legalModal, setLegalModal] = useState({ isOpen: false, title: '', content: '' });

  const API = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('fomo_consent');
    if (!consent) {
      // Load settings from API
      fetch(`${API}/api/cookie-consent-settings`)
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

  const openLegalModal = (type) => {
    let title = '';
    let content = '';
    
    if (type === 'cookies') {
      title = 'Cookie Policy';
      content = settings?.cookie_policy_content || getDefaultCookiePolicy();
    } else if (type === 'privacy') {
      title = 'Privacy Policy';
      content = settings?.privacy_policy_content || getDefaultPrivacyPolicy();
    } else if (type === 'terms') {
      title = 'Terms of Use';
      content = settings?.terms_content || getDefaultTerms();
    }
    
    setLegalModal({ isOpen: true, title, content });
  };

  const allAccepted = acceptedCookies && acceptedPrivacy;

  const title = settings?.title_en || 'Cookie & Privacy Settings';
  const description = settings?.description_en || 'We value your privacy. Please accept our cookies and privacy policy to continue exploring the FOMO platform.';

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
                                  Essential Cookies
                                </span>
                                <p className="text-gray-500 text-xs mt-0.5 leading-snug">
                                  Required for platform functionality, authentication, and security.{' '}
                                  <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); openLegalModal('cookies'); }}
                                    className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2 transition-colors"
                                  >
                                    Cookie Policy
                                  </button>
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
                                  Privacy Policy & Terms
                                </span>
                                <p className="text-gray-500 text-xs mt-0.5 leading-snug">
                                  I agree to the{' '}
                                  <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); openLegalModal('privacy'); }}
                                    className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2 transition-colors"
                                  >
                                    Privacy Policy
                                  </button>
                                  {' '}and{' '}
                                  <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); openLegalModal('terms'); }}
                                    className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2 transition-colors"
                                  >
                                    Terms of Use
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
                                <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-xl p-3 border border-gray-200 shadow-sm">
                                  <h4 className="text-emerald-700 font-semibold text-xs mb-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    What we collect:
                                  </h4>
                                  <ul className="text-gray-700 text-xs space-y-1.5 list-disc list-inside ml-1">
                                    <li>Essential cookies for authentication & security</li>
                                    <li>Analytics to improve platform performance</li>
                                    <li>User preferences and settings</li>
                                    <li>Wallet connection data (encrypted)</li>
                                  </ul>
                                  <div className="mt-2 flex items-start gap-1.5 text-gray-600 text-xs bg-white/50 rounded-lg p-2 border border-gray-200">
                                    <svg className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <p className="flex-1">
                                      Your data is encrypted and never sold to third parties.{' '}
                                      <button 
                                        onClick={(e) => { e.preventDefault(); openLegalModal('privacy'); }}
                                        className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
                                      >
                                        Full Privacy Policy
                                      </button>
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
                            Accept All
                          </span>
                        ) : (
                          'Select All'
                        )}
                      </button>
                      
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-5 py-2 text-gray-500 hover:text-emerald-600 text-xs font-medium transition-colors hover:bg-gray-50 rounded-lg"
                      >
                        {showDetails ? 'Hide Details' : 'View Details'}
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
                    <span>Secured by FOMO Platform • GDPR Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal Modal */}
      <AnimatePresence>
        {legalModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => setLegalModal({ isOpen: false, title: '', content: '' })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-emerald-700">{legalModal.title}</h2>
                <button
                  onClick={() => setLegalModal({ isOpen: false, title: '', content: '' })}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div 
                  className="prose prose-sm max-w-none text-gray-700"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {legalModal.content || 'No content available. Please configure this policy in the admin panel.'}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Default policy content
const getDefaultCookiePolicy = () => `COOKIE POLICY

Effective Date: December 2025

1. WHAT ARE COOKIES?

Cookies are small text files placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain features.

2. TYPES OF COOKIES WE USE

Essential Cookies
These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.

• Authentication cookies (keeping you logged in)
• Security cookies (protecting against fraud)
• Session cookies (maintaining your browsing session)

Analytics Cookies
These cookies collect data about your interactions with the site (e.g., number of visitors, behavior on specific pages). We use this information to improve the interface, identify and fix bugs, and determine the popularity of different FOMO sections.

Advertising Cookies
These are used to display advertisements that are more relevant to you and to measure their effectiveness. They may track whether you have viewed a particular ad and how you interacted with it.

3. MANAGING COOKIES

Browser Settings
Most browsers are set to automatically accept cookies. However, you can adjust your browser settings to block or delete cookies. Keep in mind that some features of FOMO may not function properly if you disable cookies entirely.

Third-Party Services
We may integrate third-party tools (such as Google Analytics), which also use their own cookies to analyze traffic.

4. DO NOT TRACK (DNT) SIGNALS

FOMO currently does not support the DNT protocol. If you wish to minimize tracking, you may disable cookies in your browser settings or use browser extensions that block tracking scripts.

5. CONTACT US

If you have questions about our cookie practices, please contact us at the information provided on our website.`;

const getDefaultPrivacyPolicy = () => `PRIVACY POLICY

Effective Date: December 2025

1. INTRODUCTION

Welcome to FOMO. We respect and value your privacy and are committed to protecting any personal information you provide to us.

2. WHAT INFORMATION WE COLLECT

Personal Information You Provide Directly
• Basic account information (name, email, password)
• Profile information and preferences
• Communication records with our support team

Automatically Collected Data
• Device information and system logs
• Usage information and browsing patterns
• Approximate geolocation data

3. HOW WE USE YOUR INFORMATION

• To provide and maintain our services
• To improve user experience
• To communicate with you about updates
• To ensure security and prevent fraud

4. DATA STORAGE AND SECURITY

We take all necessary measures to ensure that your personal data remains secure. We use encryption, access controls, and regular security audits.

5. YOUR RIGHTS

• Access and correct your personal data
• Request deletion of your data
• Opt-out of marketing communications
• Data portability

6. COOKIES

We use cookies and similar technologies. Please see our Cookie Policy for more details.

7. CHANGES TO THIS POLICY

We may update this Privacy Policy from time to time. We will notify you of significant changes.

8. CONTACT US

If you have questions about this Privacy Policy, please contact us through the information provided on our website.`;

const getDefaultTerms = () => `TERMS OF USE

Effective Date: December 2025

1. INTRODUCTION

Welcome to FOMO. These Terms of Use constitute a legal agreement between you and FOMO. Please read these Terms carefully.

2. ACCEPTANCE OF TERMS

By using FOMO and its services, you confirm that you have read these Terms and agree to comply with them.

3. USE OF THE SITE

• Browsing and searching for crypto projects
• Adding your own projects (if eligible)
• Rating or commenting on existing projects
• Viewing fund and person profiles

4. USER RESPONSIBILITIES

• Provide accurate and up-to-date information
• Respect intellectual property rights
• Comply with legal standards
• Avoid fraudulent activities

5. DISCLAIMER

The content published on FOMO is for informational purposes only and does not constitute investment advice. Cryptocurrencies are high-risk assets. FOMO shall not be liable for any losses arising from the use of information provided on the site.

6. LIMITATION OF LIABILITY

FOMO is not responsible for:
• Losses from cryptocurrency investments
• Technical errors or downtime
• Content accuracy of third-party submissions
• Links to external websites

7. INTELLECTUAL PROPERTY

All content on FOMO (excluding user-generated content) is owned by FOMO and protected by applicable laws.

8. CHANGES TO TERMS

FOMO reserves the right to modify these Terms at any time. Continued use constitutes acceptance of updated Terms.

9. GOVERNING LAW

These Terms are governed by the laws of the European Union.

10. CONTACT US

If you have questions about these Terms, please contact us through the information provided on our website.`;

export default CookieConsent;
