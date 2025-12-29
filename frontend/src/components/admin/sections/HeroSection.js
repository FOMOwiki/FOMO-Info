import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const HeroSection = ({ showNotification }) => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/api/hero-settings`);
      // Ensure action_buttons exists
      const data = response.data;
      if (!data.action_buttons) {
        data.action_buttons = [];
      }
      setSettings(data);
    } catch (error) {
      showNotification('Failed to load hero settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`${API}/api/hero-settings`, settings);
      showNotification('Hero settings saved successfully!');
    } catch (error) {
      showNotification('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Action Buttons handlers
  const addActionButton = () => {
    const newButton = { text: 'New Button', link: '#', primary: false };
    setSettings(prev => ({
      ...prev,
      action_buttons: [...(prev.action_buttons || []), newButton]
    }));
  };

  const updateActionButton = (index, field, value) => {
    setSettings(prev => {
      const newButtons = [...(prev.action_buttons || [])];
      newButtons[index] = { ...newButtons[index], [field]: value };
      return { ...prev, action_buttons: newButtons };
    });
  };

  const removeActionButton = (index) => {
    setSettings(prev => ({
      ...prev,
      action_buttons: prev.action_buttons.filter((_, i) => i !== index)
    }));
  };

  const moveButton = (index, direction) => {
    const newButtons = [...(settings.action_buttons || [])];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newButtons.length) return;
    [newButtons[index], newButtons[newIndex]] = [newButtons[newIndex], newButtons[index]];
    setSettings(prev => ({ ...prev, action_buttons: newButtons }));
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Hero Section</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Badge */}
      <Card title="Badge">
        <Input
          label="Badge Text"
          value={settings?.badge || ''}
          onChange={(e) => updateField('badge', e.target.value)}
          placeholder="Now in Beta v1.1"
        />
      </Card>

      {/* Titles */}
      <Card title="Titles">
        <div className="space-y-4">
          <Input
            label="Title Line 1"
            value={settings?.title_line1 || ''}
            onChange={(e) => updateField('title_line1', e.target.value)}
            placeholder="The Future of"
          />
          <Input
            label="Title Line 2"
            value={settings?.title_line2 || ''}
            onChange={(e) => updateField('title_line2', e.target.value)}
            placeholder="Crypto Analytics"
          />
          <Textarea
            label="Subtitle"
            value={settings?.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Join the revolution..."
            rows={3}
          />
        </div>
      </Card>

      {/* Action Buttons */}
      <Card title="Action Buttons">
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Manage the call-to-action buttons displayed in the hero section. Primary buttons have a filled style.
          </p>
          
          {settings?.action_buttons?.map((button, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Button {index + 1}</span>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => moveButton(index, -1)}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveButton(index, 1)}
                    disabled={index === settings.action_buttons.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeActionButton(index)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Remove button"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Button Text"
                  value={button.text || ''}
                  onChange={(e) => updateActionButton(index, 'text', e.target.value)}
                  placeholder="Launch App"
                />
                <Input
                  label="Link URL"
                  value={button.link || ''}
                  onChange={(e) => updateActionButton(index, 'link', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id={`primary-${index}`}
                  checked={button.primary || false}
                  onChange={(e) => updateActionButton(index, 'primary', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor={`primary-${index}`} className="text-sm text-gray-700">
                  Primary Button (filled style)
                </label>
              </div>
              
              {/* Use Invite Modal Option */}
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id={`invite-modal-${index}`}
                  checked={button.use_invite_modal || false}
                  onChange={(e) => updateActionButton(index, 'use_invite_modal', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor={`invite-modal-${index}`} className="text-sm text-gray-700">
                  Use Invite Modal (opens registration flow instead of link)
                </label>
              </div>
              
              {button.use_invite_modal && (
                <div className="mt-2 p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">
                  <strong>ℹ️ Invite Modal enabled:</strong> When clicked, this button will open the invite/registration modal with Connect Wallet → Invite Code → Twitter flow.
                </div>
              )}
              
              {/* Preview */}
              <div className="pt-2 border-t border-gray-200 mt-2">
                <span className="text-xs text-gray-500 block mb-2">Preview:</span>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    button.primary
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      : 'border border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {button.text || 'Button'}
                </button>
              </div>
            </div>
          ))}
          
          <Button variant="secondary" onClick={addActionButton} className="w-full">
            + Add Button
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <Card title="Statistics">
        <div className="space-y-4">
          {settings?.stats?.map((stat, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
              <h4 className="font-medium text-gray-700">Stat {index + 1}</h4>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Value"
                  value={stat.value || ''}
                  onChange={(e) => {
                    const newStats = [...settings.stats];
                    newStats[index].value = e.target.value;
                    updateField('stats', newStats);
                  }}
                  placeholder="10K+"
                />
                <Input
                  label="Label"
                  value={stat.label_en || ''}
                  onChange={(e) => {
                    const newStats = [...settings.stats];
                    newStats[index].label_en = e.target.value;
                    updateField('stats', newStats);
                  }}
                  placeholder="Active Users"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HeroSection;
