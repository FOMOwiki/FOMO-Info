import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const SOCIAL_PLATFORMS = [
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'discord', label: 'Discord' },
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'medium', label: 'Medium' },
  { value: 'reddit', label: 'Reddit' },
];

const CommunitySection = ({ showNotification }) => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/api/community-settings`);
      setSettings(response.data);
    } catch (error) {
      showNotification('Failed to load community settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`${API}/api/community-settings`, settings);
      showNotification('Community settings saved!');
    } catch (error) {
      showNotification('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Social links handlers
  const addSocialLink = () => {
    const newLink = { platform: 'twitter', url: '', enabled: true };
    setSettings(prev => ({
      ...prev,
      socials: [...(prev.socials || []), newLink]
    }));
  };

  const updateSocialLink = (index, field, value) => {
    setSettings(prev => {
      const newLinks = [...(prev.socials || [])];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, socials: newLinks };
    });
  };

  const removeSocialLink = (index) => {
    setSettings(prev => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index)
    }));
  };

  const moveSocialLink = (index, direction) => {
    const newLinks = [...(settings.socials || [])];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newLinks.length) return;
    [newLinks[index], newLinks[newIndex]] = [newLinks[newIndex], newLinks[index]];
    setSettings(prev => ({ ...prev, socials: newLinks }));
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Community Settings</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Section Content */}
      <Card title="Section Content">
        <div className="space-y-4">
          <Input
            label="Title"
            value={settings?.title_en || ''}
            onChange={(e) => updateField('title_en', e.target.value)}
            placeholder="Join the Community"
          />
          <Textarea
            label="Description"
            value={settings?.description_en || ''}
            onChange={(e) => updateField('description_en', e.target.value)}
            rows={3}
            placeholder="Connect with web3 founders, developers, and crypto enthusiasts from around the world."
          />
        </div>
      </Card>

      {/* Social Links */}
      <Card title="Social Media Links">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Manage social media links displayed in the community section. Toggle to enable/disable visibility.
          </p>
          
          {settings?.socials?.map((social, index) => (
            <div key={index} className="flex items-end space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => moveSocialLink(index, -1)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveSocialLink(index, 1)}
                  disabled={index === settings.socials.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Move down"
                >
                  ↓
                </button>
              </div>
              
              <div className="flex-shrink-0 w-36">
                <Select
                  label="Platform"
                  value={social.platform}
                  onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  options={SOCIAL_PLATFORMS}
                />
              </div>
              
              <div className="flex-grow">
                <Input
                  label="URL"
                  value={social.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  placeholder={`https://${social.platform}.com/...`}
                />
              </div>
              
              <div className="flex flex-col items-center px-3">
                <label className="text-xs text-gray-500 mb-1">Enabled</label>
                <input
                  type="checkbox"
                  checked={social.enabled !== false}
                  onChange={(e) => updateSocialLink(index, 'enabled', e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>
              
              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
          
          <Button variant="secondary" onClick={addSocialLink} className="w-full">
            + Add Social Link
          </Button>
        </div>
      </Card>

      {/* Subscribe Section */}
      <Card title="Newsletter Subscription">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="subscribe-enabled"
              checked={settings?.subscribe_enabled !== false}
              onChange={(e) => updateField('subscribe_enabled', e.target.checked)}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="subscribe-enabled" className="text-sm font-medium text-gray-700">
              Enable subscription form
            </label>
          </div>
          
          <Input
            label="Subscribe Title"
            value={settings?.subscribe_title_en || ''}
            onChange={(e) => updateField('subscribe_title_en', e.target.value)}
            placeholder="Stay Updated"
            disabled={!settings?.subscribe_enabled}
          />
        </div>
      </Card>

      {/* Preview */}
      <Card title="Preview">
        <div className="bg-gray-900 rounded-lg p-6 text-center">
          <h3 className="text-white text-xl font-bold mb-2">
            {settings?.title_en || 'Join the Community'}
          </h3>
          <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">
            {settings?.description_en || 'Connect with web3 founders, developers, and crypto enthusiasts.'}
          </p>
          <div className="flex justify-center space-x-4">
            {settings?.socials?.filter(s => s.enabled !== false).map((social, index) => (
              <div 
                key={index}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
                title={social.platform}
              >
                {getSocialIcon(social.platform)}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

// Helper function to get social icons
const getSocialIcon = (platform) => {
  const icons = {
    twitter: '𝕏',
    telegram: '✈',
    discord: '💬',
    github: '⌨',
    linkedin: 'in',
    youtube: '▶',
    instagram: '📷',
    medium: 'M',
    reddit: '®',
  };
  return icons[platform] || '🔗';
};

export default CommunitySection;
