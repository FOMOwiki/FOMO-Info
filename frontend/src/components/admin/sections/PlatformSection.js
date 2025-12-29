import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ICON_OPTIONS = [
  { value: '📊', label: '📊 Dashboard' },
  { value: '💱', label: '💱 Exchange' },
  { value: '🔄', label: '🔄 Swap' },
  { value: '🎯', label: '🎯 Target' },
  { value: '🔍', label: '🔍 Search' },
  { value: '📈', label: '📈 Chart Up' },
  { value: '🚀', label: '🚀 Rocket' },
  { value: '🖼️', label: '🖼️ NFT' },
  { value: '💎', label: '💎 Diamond' },
  { value: '🔐', label: '🔐 Security' },
  { value: '⚡', label: '⚡ Lightning' },
  { value: '🌐', label: '🌐 Global' },
];

const COLOR_OPTIONS = [
  { value: 'emerald', label: 'Emerald' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
  { value: 'pink', label: 'Pink' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'green', label: 'Green' },
  { value: 'violet', label: 'Violet' },
  { value: 'red', label: 'Red' },
  { value: 'amber', label: 'Amber' },
];

const PlatformSection = ({ showNotification }) => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/api/platform-settings`);
      setSettings(response.data);
    } catch (error) {
      showNotification('Failed to load platform settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`${API}/api/platform-settings`, settings);
      showNotification('Platform settings saved!');
    } catch (error) {
      showNotification('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateStat = (field, key, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: { ...prev[field], [key]: value }
    }));
  };

  const updateField = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Service modules handlers
  const updateServiceModule = (index, field, value) => {
    setSettings(prev => {
      const newModules = [...(prev.service_modules || [])];
      newModules[index] = { ...newModules[index], [field]: value };
      return { ...prev, service_modules: newModules };
    });
  };

  const addServiceModule = () => {
    const newModule = {
      icon: '📊',
      name_en: 'New Service',
      count: '0',
      label_en: 'description',
      color: 'emerald'
    };
    setSettings(prev => ({
      ...prev,
      service_modules: [...(prev.service_modules || []), newModule]
    }));
  };

  const removeServiceModule = (index) => {
    setSettings(prev => ({
      ...prev,
      service_modules: prev.service_modules.filter((_, i) => i !== index)
    }));
  };

  // Services list handlers
  const updateServiceItem = (index, field, value) => {
    setSettings(prev => {
      const newList = [...(prev.services_list || [])];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, services_list: newList };
    });
  };

  const addServiceItem = () => {
    const num = String((settings?.services_list?.length || 0) + 1).padStart(2, '0');
    const newItem = {
      num,
      title_en: 'NEW FEATURE',
      description_en: 'Description of this feature.'
    };
    setSettings(prev => ({
      ...prev,
      services_list: [...(prev.services_list || []), newItem]
    }));
  };

  const removeServiceItem = (index) => {
    setSettings(prev => ({
      ...prev,
      services_list: prev.services_list.filter((_, i) => i !== index)
    }));
  };

  // Bottom stats handlers
  const updateBottomStat = (index, field, value) => {
    setSettings(prev => {
      const newStats = [...(prev.bottom_stats || [])];
      newStats[index] = { ...newStats[index], [field]: value };
      return { ...prev, bottom_stats: newStats };
    });
  };

  const addBottomStat = () => {
    const newStat = {
      value: '0',
      label_en: 'NEW STAT',
      description_en: 'Description'
    };
    setSettings(prev => ({
      ...prev,
      bottom_stats: [...(prev.bottom_stats || []), newStat]
    }));
  };

  const removeBottomStat = (index) => {
    setSettings(prev => ({
      ...prev,
      bottom_stats: prev.bottom_stats.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const tabs = [
    { id: 'stats', label: 'Main Stats' },
    { id: 'services', label: 'Our Services' },
    { id: 'features', label: 'Features List' },
    { id: 'bottom', label: 'Bottom Stats' },
    { id: 'section', label: 'Section Titles' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Platform Settings</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Configure the main statistics cards displayed on the platform dashboard.
          </p>
          
          {/* Community Members */}
          <Card title="👥 Community Members">
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Value"
                value={settings?.community?.value || ''}
                onChange={(e) => updateStat('community', 'value', e.target.value)}
                placeholder="45,658"
              />
              <Input
                label="Label"
                value={settings?.community?.label_en || ''}
                onChange={(e) => updateStat('community', 'label_en', e.target.value)}
                placeholder="Community Members"
              />
              <Input
                label="Change %"
                value={settings?.community?.change || ''}
                onChange={(e) => updateStat('community', 'change', e.target.value)}
                placeholder="+12%"
              />
            </div>
          </Card>

          {/* Monthly Visits */}
          <Card title="📊 Monthly Visits">
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Value"
                value={settings?.visits?.value || ''}
                onChange={(e) => updateStat('visits', 'value', e.target.value)}
                placeholder="1.2M"
              />
              <Input
                label="Label"
                value={settings?.visits?.label_en || ''}
                onChange={(e) => updateStat('visits', 'label_en', e.target.value)}
                placeholder="Monthly Visits"
              />
              <Input
                label="Change %"
                value={settings?.visits?.change || ''}
                onChange={(e) => updateStat('visits', 'change', e.target.value)}
                placeholder="+18%"
              />
            </div>
          </Card>

          {/* Tracked Projects */}
          <Card title="🎯 Tracked Projects">
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Value"
                value={settings?.projects?.value || ''}
                onChange={(e) => updateStat('projects', 'value', e.target.value)}
                placeholder="16,670"
              />
              <Input
                label="Label"
                value={settings?.projects?.label_en || ''}
                onChange={(e) => updateStat('projects', 'label_en', e.target.value)}
                placeholder="Tracked Projects"
              />
              <Input
                label="Change %"
                value={settings?.projects?.change || ''}
                onChange={(e) => updateStat('projects', 'change', e.target.value)}
                placeholder="+8%"
              />
            </div>
          </Card>

          {/* Red Flag Alerts */}
          <Card title="🚨 Red Flag Alerts">
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Value"
                value={settings?.alerts?.value || ''}
                onChange={(e) => updateStat('alerts', 'value', e.target.value)}
                placeholder="892"
              />
              <Input
                label="Label"
                value={settings?.alerts?.label_en || ''}
                onChange={(e) => updateStat('alerts', 'label_en', e.target.value)}
                placeholder="Red Flag Alerts"
              />
              <Input
                label="Change %"
                value={settings?.alerts?.change || ''}
                onChange={(e) => updateStat('alerts', 'change', e.target.value)}
                placeholder="-15%"
              />
            </div>
          </Card>
        </div>
      )}

      {/* Our Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Configure the service modules grid (Dashboard, OTC Market, etc.)
            </p>
            <Button variant="secondary" onClick={addServiceModule}>
              + Add Service
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings?.service_modules?.map((module, index) => (
              <Card key={index} className="relative">
                <button
                  type="button"
                  onClick={() => removeServiceModule(index)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xl"
                >
                  ×
                </button>
                
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Select
                    label="Icon"
                    value={module.icon || '📊'}
                    onChange={(e) => updateServiceModule(index, 'icon', e.target.value)}
                    options={ICON_OPTIONS}
                  />
                  <Select
                    label="Color"
                    value={module.color || 'emerald'}
                    onChange={(e) => updateServiceModule(index, 'color', e.target.value)}
                    options={COLOR_OPTIONS}
                  />
                  <Input
                    label="Name"
                    value={module.name_en || ''}
                    onChange={(e) => updateServiceModule(index, 'name_en', e.target.value)}
                    placeholder="Dashboard"
                  />
                  <Input
                    label="Count/Value"
                    value={module.count || ''}
                    onChange={(e) => updateServiceModule(index, 'count', e.target.value)}
                    placeholder="2,847"
                  />
                  <Input
                    label="Label"
                    value={module.label_en || ''}
                    onChange={(e) => updateServiceModule(index, 'label_en', e.target.value)}
                    placeholder="active users"
                    className="col-span-2"
                  />
                </div>

                {/* Preview */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-400 block mb-2">Preview:</span>
                  <div className={`flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border-l-4 border-${module.color || 'emerald'}-500`}>
                    <span className="text-2xl">{module.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{module.name_en || 'Service'}</div>
                      <div className="text-sm">
                        <span className={`text-${module.color || 'emerald'}-600 font-bold`}>{module.count || '0'}</span>
                        <span className="text-gray-500 ml-1">{module.label_en || ''}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Features List Tab */}
      {activeTab === 'features' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Configure the numbered feature list (OTC & P2P Markets, Early Land Access, etc.)
            </p>
            <Button variant="secondary" onClick={addServiceItem}>
              + Add Feature
            </Button>
          </div>

          {settings?.services_list?.map((item, index) => (
            <Card key={index} className="relative">
              <button
                type="button"
                onClick={() => removeServiceItem(index)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xl"
              >
                ×
              </button>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold">
                    {item.num || String(index + 1).padStart(2, '0')}
                  </div>
                  <Input
                    label="Number"
                    value={item.num || ''}
                    onChange={(e) => updateServiceItem(index, 'num', e.target.value)}
                    placeholder="01"
                    className="w-20"
                  />
                  <Input
                    label="Title"
                    value={item.title_en || ''}
                    onChange={(e) => updateServiceItem(index, 'title_en', e.target.value)}
                    placeholder="OTC & P2P MARKETS"
                    className="flex-1"
                  />
                </div>
                <Textarea
                  label="Description"
                  value={item.description_en || ''}
                  onChange={(e) => updateServiceItem(index, 'description_en', e.target.value)}
                  placeholder="Secure over-the-counter trading and peer-to-peer exchange..."
                  rows={2}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Bottom Stats Tab */}
      {activeTab === 'bottom' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Configure the bottom statistics (70% Analysis Automated, 24/7 Market Coverage, etc.)
            </p>
            <Button variant="secondary" onClick={addBottomStat}>
              + Add Stat
            </Button>
          </div>

          {settings?.bottom_stats?.map((stat, index) => (
            <Card key={index} className="relative">
              <button
                type="button"
                onClick={() => removeBottomStat(index)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-xl"
              >
                ×
              </button>
              
              <div className="grid grid-cols-3 gap-4 pt-2">
                <Input
                  label="Value"
                  value={stat.value || ''}
                  onChange={(e) => updateBottomStat(index, 'value', e.target.value)}
                  placeholder="70%"
                />
                <Input
                  label="Label"
                  value={stat.label_en || ''}
                  onChange={(e) => updateBottomStat(index, 'label_en', e.target.value)}
                  placeholder="ANALYSIS AUTOMATED"
                />
                <Input
                  label="Description"
                  value={stat.description_en || ''}
                  onChange={(e) => updateBottomStat(index, 'description_en', e.target.value)}
                  placeholder="AI-powered insights in seconds"
                />
              </div>

              {/* Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-500">{stat.value || '0'}</div>
                  <div className="text-sm font-semibold text-gray-700 mt-1">{stat.label_en || 'LABEL'}</div>
                  <div className="text-xs text-gray-500">{stat.description_en || 'Description'}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Section Titles Tab */}
      {activeTab === 'section' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Configure the main section headings and introduction text.
          </p>
          
          <Card title="Section Header">
            <div className="space-y-4">
              <Input
                label="Badge Text"
                value={settings?.section_badge_en || ''}
                onChange={(e) => updateField('section_badge_en', e.target.value)}
                placeholder="INSIDE THE PLATFORM"
              />
              <Input
                label="Main Title"
                value={settings?.section_title_en || ''}
                onChange={(e) => updateField('section_title_en', e.target.value)}
                placeholder="A command center for your crypto journey"
              />
              <Textarea
                label="Introduction Text"
                value={settings?.section_intro_en || ''}
                onChange={(e) => updateField('section_intro_en', e.target.value)}
                placeholder="See every market move, track projects, manage your portfolio..."
                rows={3}
              />
            </div>
          </Card>

          {/* Preview */}
          <Card title="Preview">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                {settings?.section_badge_en || 'INSIDE THE PLATFORM'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {settings?.section_title_en || 'A command center for your crypto journey'}
              </h2>
              <p className="text-gray-600 text-sm">
                {settings?.section_intro_en || 'See every market move, track projects, manage your portfolio...'}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PlatformSection;
