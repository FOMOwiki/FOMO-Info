import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import Select from '../ui/Select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AboutSection = ({ showNotification }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const iconOptions = [
    { value: 'diamond', label: '💎 Diamond' },
    { value: 'clock', label: '🕐 Clock' },
    { value: 'lightning', label: '⚡ Lightning' },
    { value: 'shield', label: '🛡️ Shield' },
    { value: 'star', label: '⭐ Star' },
    { value: 'rocket', label: '🚀 Rocket' },
    { value: 'chart', label: '📈 Chart' },
    { value: 'users', label: '👥 Users' }
  ];

  const colorOptions = [
    { value: 'emerald', label: '🟢 Emerald' },
    { value: 'teal', label: '🔵 Teal' },
    { value: 'cyan', label: '🩵 Cyan' },
    { value: 'violet', label: '💜 Violet' },
    { value: 'blue', label: '🔷 Blue' },
    { value: 'purple', label: '🟣 Purple' },
    { value: 'pink', label: '🩷 Pink' },
    { value: 'amber', label: '🟠 Amber' }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/about-settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching about settings:', error);
      showNotification?.('Error loading settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/about-settings`, settings);
      showNotification?.('About section settings saved!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification?.('Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...settings.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setSettings({ ...settings, features: newFeatures });
  };

  const addFeature = () => {
    setSettings({
      ...settings,
      features: [
        ...settings.features,
        { icon: 'star', title: 'New Feature', description: 'Description here', color: 'emerald' }
      ]
    });
  };

  const removeFeature = (index) => {
    const newFeatures = settings.features.filter((_, i) => i !== index);
    setSettings({ ...settings, features: newFeatures });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!settings) {
    return <div className="text-center py-8 text-red-500">Error loading settings</div>;
  }

  return (
    <div className="space-y-6">
      {/* Main Settings */}
      <Card title="About Section Settings">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Badge Text"
              value={settings.badge}
              onChange={(e) => setSettings({ ...settings, badge: e.target.value })}
              placeholder="About Us"
            />
            <Input
              label="Title"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              placeholder="What is"
            />
            <Input
              label="Title Highlight"
              value={settings.title_highlight}
              onChange={(e) => setSettings({ ...settings, title_highlight: e.target.value })}
              placeholder="FOMO"
            />
          </div>

          <Input
            label="Subtitle"
            value={settings.subtitle}
            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
            placeholder="A cutting-edge platform reshaping how users interact with the crypto world"
          />

          <Textarea
            label="Description"
            value={settings.description}
            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
            rows={3}
            placeholder="Main description text..."
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Highlight: Social Engagement"
              value={settings.social_engagement}
              onChange={(e) => setSettings({ ...settings, social_engagement: e.target.value })}
            />
            <Input
              label="Highlight: Data Analytics"
              value={settings.data_analytics}
              onChange={(e) => setSettings({ ...settings, data_analytics: e.target.value })}
            />
            <Input
              label="Highlight: Seamless Access"
              value={settings.seamless_access}
              onChange={(e) => setSettings({ ...settings, seamless_access: e.target.value })}
            />
          </div>

          <Input
            label="Description Ending"
            value={settings.description_end}
            onChange={(e) => setSettings({ ...settings, description_end: e.target.value })}
            placeholder="to crypto projects, NFTs, funds, and more."
          />

          {/* Whitepaper Button Settings */}
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <h4 className="font-medium text-emerald-800 mb-3">📄 Whitepaper Button</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Button Text"
                value={settings.whitepaper_button_text}
                onChange={(e) => setSettings({ ...settings, whitepaper_button_text: e.target.value })}
                placeholder="Whitepaper"
              />
              <Input
                label="Button Link (URL)"
                value={settings.whitepaper_button_link || ''}
                onChange={(e) => setSettings({ ...settings, whitepaper_button_link: e.target.value })}
                placeholder="https://example.com/whitepaper.pdf"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Features Cards */}
      <Card title="Feature Cards">
        <div className="space-y-4">
          {settings.features.map((feature, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-700">Feature {index + 1}</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <Select
                  label="Icon"
                  value={feature.icon}
                  onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                  options={iconOptions}
                />
                <Select
                  label="Color"
                  value={feature.color}
                  onChange={(e) => updateFeature(index, 'color', e.target.value)}
                  options={colorOptions}
                />
              </div>
              <Input
                label="Title"
                value={feature.title}
                onChange={(e) => updateFeature(index, 'title', e.target.value)}
                className="mb-3"
              />
              <Textarea
                label="Description"
                value={feature.description}
                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                rows={2}
              />
            </div>
          ))}

          <Button variant="secondary" onClick={addFeature}>
            + Add Feature Card
          </Button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save About Section'}
        </Button>
      </div>
    </div>
  );
};

export default AboutSection;
