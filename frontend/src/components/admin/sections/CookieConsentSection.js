import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const CookieConsentSection = ({ showNotification }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    privacy_policy_url: '/privacy',
    terms_url: '/terms',
    cookie_policy_url: '/cookies',
    title_en: 'Cookie & Privacy Settings',
    title_ru: 'Настройки Cookie и Конфиденциальности',
    description_en: 'We value your privacy. Please accept our cookies and privacy policy to continue exploring the FOMO platform.',
    description_ru: 'Мы ценим вашу конфиденциальность. Пожалуйста, примите наши cookies и политику конфиденциальности, чтобы продолжить использование платформы FOMO.'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/cookie-consent-settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching cookie consent settings:', error);
      showNotification('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      
      await axios.put(
        `${API}/api/admin/cookie-consent-settings`,
        settings,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      showNotification('✅ Cookie consent settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('❌ Failed to save settings', 'error');
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">🍪 Cookie Consent Settings</h2>
        <p className="text-emerald-50">
          Manage cookie consent banner, privacy policy links, and messages displayed to users.
        </p>
      </div>

      {/* Enable/Disable */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Enable Cookie Consent</h3>
            <p className="text-sm text-gray-600">
              Show cookie consent banner to first-time visitors
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      {/* URLs Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🔗 Policy Links</h3>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Privacy Policy URL
          </label>
          <input
            type="text"
            value={settings.privacy_policy_url}
            onChange={(e) => handleChange('privacy_policy_url', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="/privacy"
          />
          <p className="mt-1 text-xs text-gray-500">Link to your privacy policy page</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Terms & Conditions URL
          </label>
          <input
            type="text"
            value={settings.terms_url}
            onChange={(e) => handleChange('terms_url', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="/terms"
          />
          <p className="mt-1 text-xs text-gray-500">Link to your terms and conditions</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cookie Policy URL
          </label>
          <input
            type="text"
            value={settings.cookie_policy_url}
            onChange={(e) => handleChange('cookie_policy_url', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="/cookies"
          />
          <p className="mt-1 text-xs text-gray-500">Link to your cookie policy</p>
        </div>
      </div>

      {/* English Content */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🇬🇧 English Content</h3>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title (English)
          </label>
          <input
            type="text"
            value={settings.title_en}
            onChange={(e) => handleChange('title_en', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Cookie & Privacy Settings"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description (English)
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

      {/* Russian Content */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🇷🇺 Russian Content</h3>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Заголовок (Russian)
          </label>
          <input
            type="text"
            value={settings.title_ru}
            onChange={(e) => handleChange('title_ru', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Настройки Cookie и Конфиденциальности"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Описание (Russian)
          </label>
          <textarea
            value={settings.description_ru}
            onChange={(e) => handleChange('description_ru', e.target.value)}
            rows="3"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
            placeholder="Мы ценим вашу конфиденциальность..."
          />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          👁️ Preview
        </h3>
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🍪</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{settings.title_en}</p>
              <p className="text-sm text-gray-600 mt-1">{settings.description_en}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Links: {settings.privacy_policy_url}, {settings.terms_url}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={fetchSettings}
          disabled={saving}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
        >
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            '💾 Save Settings'
          )}
        </button>
      </div>
    </div>
  );
};

export default CookieConsentSection;
