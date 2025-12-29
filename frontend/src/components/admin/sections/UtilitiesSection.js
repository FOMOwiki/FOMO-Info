import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const UtilitiesSection = ({ showNotification }) => {
  const [utilities, setUtilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUtil, setEditingUtil] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    fetchUtilities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUtilities = async () => {
    try {
      const response = await axios.get(`${API}/api/utilities`);
      setUtilities(response.data);
    } catch (error) {
      showNotification('Failed to load utilities', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this utility?')) return;
    
    try {
      await axios.delete(`${API}/api/utilities/${id}`);
      showNotification('Utility deleted successfully!');
      fetchUtilities();
    } catch (error) {
      showNotification('Failed to delete utility', 'error');
    }
  };

  const handleEdit = (util) => {
    setEditingUtil(util);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingUtil(null);
    setShowForm(false);
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading utilities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Utilities Management</h2>
        <Button onClick={() => setShowForm(true)}>
          Add New Utility
        </Button>
      </div>

      {showForm && (
        <UtilityForm
          utility={editingUtil}
          onSave={() => {
            fetchUtilities();
            handleCancel();
            showNotification(editingUtil ? 'Utility updated!' : 'Utility created!');
          }}
          onCancel={handleCancel}
          showNotification={showNotification}
        />
      )}

      <div className="grid gap-4">
        {utilities.map((util) => (
          <Card key={util.id}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {util.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{util.subtitle}</p>
                <p className="text-sm text-gray-500">{util.short_description_en}</p>
                <div className="flex space-x-4 mt-3">
                  {util.stats.map((stat, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-bold">{stat.value}</span> - {stat.label_en}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleEdit(util)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(util.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const UtilityForm = ({ utility, onSave, onCancel, showNotification }) => {
  const [formData, setFormData] = useState(utility || {
    title: '',
    subtitle: '',
    icon_type: 'chart',
    custom_icon_url: '',
    short_description_en: '',
    full_description_en: '',
    features: [],
    stats: [{ value: '', label_en: '' }],
    gradient: 'from-emerald-500 to-teal-500',
    bg_gradient: 'from-emerald-50 to-teal-50',
    button_gradient: 'from-emerald-500 to-teal-500',
    button_text_en: 'Learn More',
    button_link: '#',
    order: 0,
    is_active: true
  });

  const [isSaving, setIsSaving] = useState(false);

  // Icon options for selection
  const iconOptions = [
    { value: 'chart', label: '📈 Chart' },
    { value: 'arena', label: '🎯 Arena' },
    { value: 'exchange', label: '🔄 Exchange' },
    { value: 'lightning', label: '⚡ Lightning' },
    { value: 'users', label: '👥 Users' },
    { value: 'rocket', label: '🚀 Rocket' },
    { value: 'shield', label: '🛡️ Shield' },
    { value: 'globe', label: '🌐 Globe' },
    { value: 'star', label: '⭐ Star' },
    { value: 'custom', label: '🖼️ Custom URL' }
  ];

  // Color gradient options
  const gradientOptions = [
    { value: 'from-emerald-500 to-teal-500', label: '🟢 Green/Teal', bg: 'from-emerald-50 to-teal-50' },
    { value: 'from-violet-500 to-purple-500', label: '💜 Violet/Purple', bg: 'from-violet-50 to-purple-50' },
    { value: 'from-blue-500 to-cyan-500', label: '🔵 Blue/Cyan', bg: 'from-blue-50 to-cyan-50' },
    { value: 'from-amber-500 to-orange-500', label: '🟠 Amber/Orange', bg: 'from-amber-50 to-orange-50' },
    { value: 'from-pink-500 to-rose-500', label: '🩷 Pink/Rose', bg: 'from-pink-50 to-rose-50' },
    { value: 'from-indigo-500 to-blue-500', label: '🔷 Indigo/Blue', bg: 'from-indigo-50 to-blue-50' },
    { value: 'from-red-500 to-orange-500', label: '🔴 Red/Orange', bg: 'from-red-50 to-orange-50' },
    { value: 'from-yellow-500 to-orange-500', label: '🟡 Yellow/Orange', bg: 'from-yellow-50 to-orange-50' },
    { value: 'from-gray-700 to-gray-900', label: '⚫ Dark Gray', bg: 'from-gray-100 to-gray-200' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (utility) {
        await axios.put(`${API}/api/utilities/${utility.id}`, formData);
      } else {
        await axios.post(`${API}/api/utilities`, formData);
      }
      onSave();
    } catch (error) {
      showNotification('Failed to save utility', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateStat = (index, field, value) => {
    const newStats = [...formData.stats];
    newStats[index][field] = value;
    updateField('stats', newStats);
  };

  const addStat = () => {
    updateField('stats', [...formData.stats, { value: '', label_en: '' }]);
  };

  const removeStat = (index) => {
    const newStats = formData.stats.filter((_, i) => i !== index);
    updateField('stats', newStats);
  };

  return (
    <Card title={utility ? 'Edit Utility' : 'Create New Utility'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
          <Input
            label="Subtitle"
            value={formData.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
          />
        </div>

        {/* Icon and Color Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
            <select
              value={formData.icon_type || 'chart'}
              onChange={(e) => updateField('icon_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {iconOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Color</label>
            <select
              value={formData.gradient || 'from-emerald-500 to-teal-500'}
              onChange={(e) => {
                const selected = gradientOptions.find(g => g.value === e.target.value);
                setFormData(prev => ({
                  ...prev,
                  gradient: e.target.value,
                  bg_gradient: selected?.bg || prev.bg_gradient,
                  button_gradient: e.target.value
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {gradientOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Icon URL (if custom selected) */}
        {formData.icon_type === 'custom' && (
          <Input
            label="Custom Icon URL"
            value={formData.custom_icon_url || ''}
            onChange={(e) => updateField('custom_icon_url', e.target.value)}
            placeholder="https://example.com/icon.png"
          />
        )}

        <Textarea
          label="Short Description"
          value={formData.short_description_en}
          onChange={(e) => updateField('short_description_en', e.target.value)}
          rows={2}
        />

        <Textarea
          label="Full Description"
          value={formData.full_description_en}
          onChange={(e) => updateField('full_description_en', e.target.value)}
          rows={4}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stats
          </label>
          {formData.stats.map((stat, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <Input
                placeholder="Value (e.g., 8%)"
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
              />
              <Input
                placeholder="Label"
                value={stat.label_en}
                onChange={(e) => updateStat(index, 'label_en', e.target.value)}
              />
              <Button
                variant="danger"
                onClick={() => removeStat(index)}
                disabled={formData.stats.length === 1}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addStat} className="mt-2">
            Add Stat
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Button Text"
            value={formData.button_text_en}
            onChange={(e) => updateField('button_text_en', e.target.value)}
          />
          <Input
            label="Button Link"
            value={formData.button_link}
            onChange={(e) => updateField('button_link', e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Utility'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default UtilitiesSection;
