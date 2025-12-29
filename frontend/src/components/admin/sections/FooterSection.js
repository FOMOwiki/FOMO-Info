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
  { value: 'facebook', label: 'Facebook' },
  { value: 'medium', label: 'Medium' },
  { value: 'reddit', label: 'Reddit' },
];

const FooterSection = ({ showNotification }) => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/api/footer-settings`);
      setSettings(response.data);
    } catch (error) {
      showNotification('Failed to load footer settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`${API}/api/footer-settings`, settings);
      showNotification('Footer settings saved!');
    } catch (error) {
      showNotification('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Social Media handlers
  const addSocialLink = () => {
    const newLink = { platform: 'twitter', url: '' };
    setSettings(prev => ({
      ...prev,
      social_media: [...(prev.social_media || []), newLink]
    }));
  };

  const updateSocialLink = (index, field, value) => {
    setSettings(prev => {
      const newLinks = [...(prev.social_media || [])];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, social_media: newLinks };
    });
  };

  const removeSocialLink = (index) => {
    setSettings(prev => ({
      ...prev,
      social_media: prev.social_media.filter((_, i) => i !== index)
    }));
  };

  // Navigation Section handlers
  const addNavSection = () => {
    const newSection = { title: 'New Section', links: [], order: settings.navigation_sections?.length || 0 };
    setSettings(prev => ({
      ...prev,
      navigation_sections: [...(prev.navigation_sections || []), newSection]
    }));
  };

  const updateNavSection = (index, field, value) => {
    setSettings(prev => {
      const newSections = [...(prev.navigation_sections || [])];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, navigation_sections: newSections };
    });
  };

  const removeNavSection = (index) => {
    setSettings(prev => ({
      ...prev,
      navigation_sections: prev.navigation_sections.filter((_, i) => i !== index)
    }));
  };

  // Navigation Links handlers
  const addNavLink = (sectionIndex) => {
    setSettings(prev => {
      const newSections = [...prev.navigation_sections];
      newSections[sectionIndex].links = [
        ...(newSections[sectionIndex].links || []),
        { name: 'New Link', url: '#', order: newSections[sectionIndex].links?.length || 0 }
      ];
      return { ...prev, navigation_sections: newSections };
    });
  };

  const updateNavLink = (sectionIndex, linkIndex, field, value) => {
    setSettings(prev => {
      const newSections = [...prev.navigation_sections];
      newSections[sectionIndex].links[linkIndex] = {
        ...newSections[sectionIndex].links[linkIndex],
        [field]: value
      };
      return { ...prev, navigation_sections: newSections };
    });
  };

  const removeNavLink = (sectionIndex, linkIndex) => {
    setSettings(prev => {
      const newSections = [...prev.navigation_sections];
      newSections[sectionIndex].links = newSections[sectionIndex].links.filter((_, i) => i !== linkIndex);
      return { ...prev, navigation_sections: newSections };
    });
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const tabs = [
    { id: 'company', label: 'Company Info' },
    { id: 'social', label: 'Social Media' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'cta', label: 'CTA Button' },
    { id: 'legal', label: 'Legal & Copyright' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Footer Settings</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Company Info Tab */}
      {activeTab === 'company' && (
        <Card title="Company Information">
          <div className="space-y-4">
            <Input
              label="Company Name"
              value={settings?.company_name || ''}
              onChange={(e) => updateField('company_name', e.target.value)}
              placeholder="FOMO"
            />
            <Textarea
              label="Company Description"
              value={settings?.company_description || ''}
              onChange={(e) => updateField('company_description', e.target.value)}
              rows={2}
              placeholder="Leading cryptocurrency analytics platform"
            />
            <Textarea
              label="Company Address"
              value={settings?.company_address || ''}
              onChange={(e) => updateField('company_address', e.target.value)}
              rows={3}
              placeholder="4 World Trade Center..."
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone"
                value={settings?.company_phone || ''}
                onChange={(e) => updateField('company_phone', e.target.value)}
                placeholder="(646) 845-0036"
              />
              <Input
                label="Email"
                value={settings?.company_email || ''}
                onChange={(e) => updateField('company_email', e.target.value)}
                placeholder="info@fomo.io"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <Card title="Social Media Links">
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Manage social media links displayed in the footer.
            </p>
            
            {settings?.social_media?.map((social, index) => (
              <div key={index} className="flex items-end space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-32">
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
                    placeholder="https://..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
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
      )}

      {/* Navigation Tab */}
      {activeTab === 'navigation' && (
        <Card title="Footer Navigation">
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Manage navigation sections and links in the footer.
            </p>
            
            {settings?.navigation_sections?.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Input
                    label="Section Title"
                    value={section.title}
                    onChange={(e) => updateNavSection(sectionIndex, 'title', e.target.value)}
                    className="flex-grow"
                  />
                  <button
                    type="button"
                    onClick={() => removeNavSection(sectionIndex)}
                    className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    title="Remove section"
                  >
                    Remove Section
                  </button>
                </div>
                
                <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                  <span className="text-sm font-medium text-gray-600">Links:</span>
                  {section.links?.map((link, linkIndex) => (
                    <div key={linkIndex} className="flex items-end space-x-2 bg-gray-50 p-2 rounded">
                      <Input
                        label="Name"
                        value={link.name}
                        onChange={(e) => updateNavLink(sectionIndex, linkIndex, 'name', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        label="URL"
                        value={link.url}
                        onChange={(e) => updateNavLink(sectionIndex, linkIndex, 'url', e.target.value)}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeNavLink(sectionIndex, linkIndex)}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <Button 
                    variant="secondary" 
                    onClick={() => addNavLink(sectionIndex)}
                    className="text-sm"
                  >
                    + Add Link
                  </Button>
                </div>
              </div>
            ))}
            
            <Button variant="secondary" onClick={addNavSection} className="w-full">
              + Add Navigation Section
            </Button>
          </div>
        </Card>
      )}

      {/* CTA Button Tab */}
      {activeTab === 'cta' && (
        <Card title="Call-to-Action Button">
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Configure the main action button displayed in the footer (e.g., "Launch Platform").
            </p>
            <Input
              label="Button Text"
              value={settings?.cta_button_text || ''}
              onChange={(e) => updateField('cta_button_text', e.target.value)}
              placeholder="Launch Platform →"
            />
            <Input
              label="Button URL"
              value={settings?.cta_button_url || ''}
              onChange={(e) => updateField('cta_button_url', e.target.value)}
              placeholder="https://app.fomo.io"
            />
            
            {/* Preview */}
            <div className="pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500 block mb-2">Preview:</span>
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium">
                {settings?.cta_button_text || 'Launch Platform →'}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Legal & Copyright Tab */}
      {activeTab === 'legal' && (
        <Card title="Legal Pages & Copyright">
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Manage legal page content that will be displayed in modal windows when visitors click on legal links.
            </p>
            
            {/* Legal Pages */}
            {(settings?.legal_pages || [
              { id: 'privacy', title: 'Privacy Policy', content: '' },
              { id: 'terms', title: 'Terms of Service', content: '' },
              { id: 'disclaimer', title: 'Disclaimer', content: '' }
            ]).map((page, index) => (
              <div key={page.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    {page.id === 'privacy' && '🔒'}
                    {page.id === 'terms' && '📄'}
                    {page.id === 'disclaimer' && '⚠️'}
                    {page.title}
                  </span>
                </div>
                <Input
                  label="Title (displayed in modal header)"
                  value={page.title || ''}
                  onChange={(e) => {
                    const newPages = [...(settings?.legal_pages || [
                      { id: 'privacy', title: 'Privacy Policy', content: '' },
                      { id: 'terms', title: 'Terms of Service', content: '' },
                      { id: 'disclaimer', title: 'Disclaimer', content: '' }
                    ])];
                    newPages[index] = { ...newPages[index], title: e.target.value };
                    updateField('legal_pages', newPages);
                  }}
                  placeholder="Page title"
                />
                <Textarea
                  label="Content"
                  value={page.content || ''}
                  onChange={(e) => {
                    const newPages = [...(settings?.legal_pages || [
                      { id: 'privacy', title: 'Privacy Policy', content: '' },
                      { id: 'terms', title: 'Terms of Service', content: '' },
                      { id: 'disclaimer', title: 'Disclaimer', content: '' }
                    ])];
                    newPages[index] = { ...newPages[index], content: e.target.value };
                    updateField('legal_pages', newPages);
                  }}
                  rows={8}
                  placeholder="Enter the full text content for this legal page..."
                  className="font-mono text-sm"
                />
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              <Input
                label="Copyright Text"
                value={settings?.copyright_text || ''}
                onChange={(e) => updateField('copyright_text', e.target.value)}
                placeholder="Copyright © 2025 FOMO. All rights reserved."
              />
            </div>
            
            <Textarea
              label="Footer Disclaimer (shown at bottom of footer)"
              value={settings?.legal_disclaimer || ''}
              onChange={(e) => updateField('legal_disclaimer', e.target.value)}
              rows={3}
              placeholder="Products and services are offered by FOMO..."
            />
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <Input
                label="Made By Text"
                value={settings?.made_by_text || ''}
                onChange={(e) => updateField('made_by_text', e.target.value)}
                placeholder="Made by Emergent"
              />
              <Input
                label="Made By URL"
                value={settings?.made_by_url || ''}
                onChange={(e) => updateField('made_by_url', e.target.value)}
                placeholder="https://emergent.sh"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FooterSection;
