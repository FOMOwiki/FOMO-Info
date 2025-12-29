import React, { useState, useEffect } from 'react';

const CookieConsentSection = ({ showNotification }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    title_en: 'Cookie & Privacy Settings',
    description_en: 'We value your privacy. Please accept our cookies and privacy policy to continue exploring the FOMO platform.',
    cookie_policy_content: '',
    privacy_policy_content: '',
    terms_content: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const API = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API}/api/cookie-consent-settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({
          ...prev,
          ...data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch cookie consent settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API}/api/admin/cookie-consent-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        showNotification('Cookie consent settings saved successfully!', 'success');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: '⚙️ General Settings', icon: '⚙️' },
    { id: 'cookie', label: '🍪 Cookie Policy', icon: '🍪' },
    { id: 'privacy', label: '🔒 Privacy Policy', icon: '🔒' },
    { id: 'terms', label: '📄 Terms of Use', icon: '📄' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🍪</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Cookie Consent Settings</h2>
            <p className="text-emerald-100 text-sm mt-1">
              Manage the cookie consent banner and legal policy content
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⚙️ General Settings</h3>
          
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Enable Cookie Consent Banner</h4>
              <p className="text-sm text-gray-500">Show the consent banner to new visitors</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Banner Title
            </label>
            <input
              type="text"
              value={settings.title_en}
              onChange={(e) => handleChange('title_en', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Cookie & Privacy Settings"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Banner Description
            </label>
            <textarea
              value={settings.description_en}
              onChange={(e) => handleChange('description_en', e.target.value)}
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              placeholder="We value your privacy..."
            />
          </div>
        </div>
      )}

      {/* Cookie Policy Tab */}
      {activeTab === 'cookie' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🍪</span>
            <h3 className="text-lg font-bold text-gray-900">Cookie Policy Content</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            This content will be displayed when users click on "Cookie Policy" link in the consent banner.
          </p>
          <textarea
            value={settings.cookie_policy_content}
            onChange={(e) => handleChange('cookie_policy_content', e.target.value)}
            rows="20"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono text-sm"
            placeholder="Enter your Cookie Policy content here...

COOKIE POLICY

1. WHAT ARE COOKIES?
Cookies are small text files placed on your device...

2. TYPES OF COOKIES WE USE
- Essential Cookies
- Analytics Cookies
- Advertising Cookies

3. MANAGING COOKIES
..."
          />
        </div>
      )}

      {/* Privacy Policy Tab */}
      {activeTab === 'privacy' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🔒</span>
            <h3 className="text-lg font-bold text-gray-900">Privacy Policy Content</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            This content will be displayed when users click on "Privacy Policy" link in the consent banner.
          </p>
          <textarea
            value={settings.privacy_policy_content}
            onChange={(e) => handleChange('privacy_policy_content', e.target.value)}
            rows="20"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono text-sm"
            placeholder="Enter your Privacy Policy content here...

PRIVACY POLICY

1. INTRODUCTION
Welcome to FOMO. We respect your privacy...

2. WHAT INFORMATION WE COLLECT
- Personal information you provide
- Automatically collected data

3. HOW WE USE YOUR INFORMATION
..."
          />
        </div>
      )}

      {/* Terms of Use Tab */}
      {activeTab === 'terms' && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📄</span>
            <h3 className="text-lg font-bold text-gray-900">Terms of Use Content</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            This content will be displayed when users click on "Terms of Use" link in the consent banner.
          </p>
          <textarea
            value={settings.terms_content}
            onChange={(e) => handleChange('terms_content', e.target.value)}
            rows="20"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono text-sm"
            placeholder="Enter your Terms of Use content here...

TERMS OF USE

1. INTRODUCTION
Welcome to FOMO. These Terms of Use constitute...

2. ACCEPTANCE OF TERMS
By using FOMO, you confirm...

3. USE OF THE SITE
..."
          />
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentSection;
