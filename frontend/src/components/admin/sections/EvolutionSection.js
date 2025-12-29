import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Animation options for levels
const ANIMATION_TYPES_LEVELS = [
  { value: 'stellar', label: '⭐ Stellar' },
  { value: 'cosmic', label: '🚀 Cosmic' },
  { value: 'galactic', label: '🌀 Galactic' },
  { value: 'celestial', label: '☀️ Celestial' },
  { value: 'astral', label: '🪐 Astral' },
  { value: 'universal', label: '👑 Universal' },
  { value: 'pulse', label: '💫 Pulse' },
  { value: 'nebula', label: '🌌 Nebula' },
  { value: 'supernova', label: '💥 Supernova' },
  { value: 'blackhole', label: '⚫ Black Hole' },
  { value: 'aurora', label: '🌈 Aurora' },
  { value: 'meteor', label: '☄️ Meteor' },
  { value: 'constellation', label: '✨ Constellation' },
  { value: 'vortex', label: '🌊 Vortex' },
  { value: 'crystal', label: '💎 Crystal' },
];

// Animation options for badges
const ANIMATION_TYPES_BADGES = [
  { value: 'pioneer', label: '🛡️ Pioneer' },
  { value: 'onboarding', label: '📍 Onboarding' },
  { value: 'reviewer', label: '🔍 Reviewer' },
  { value: 'predictor', label: '🎯 Predictor' },
  { value: 'streak', label: '🔥 Streak' },
  { value: 'maker', label: '💠 Maker' },
  { value: 'p2p', label: '🔗 P2P' },
  { value: 'community', label: '⭐ Community' },
  { value: 'singularity', label: '⚛️ Singularity' },
  { value: 'trophy', label: '🏆 Trophy' },
  { value: 'medal', label: '🥇 Medal' },
  { value: 'crown', label: '👑 Crown' },
  { value: 'diamond', label: '💎 Diamond' },
  { value: 'lightning', label: '⚡ Lightning' },
  { value: 'rocket', label: '🚀 Rocket' },
  { value: 'heart', label: '❤️ Heart' },
  { value: 'gem', label: '💠 Gem' },
];

const EvolutionSection = ({ onUpdate }) => {
  const [activeSubTab, setActiveSubTab] = useState('levels');
  const [levels, setLevels] = useState([]);
  const [badges, setBadges] = useState([]);
  const [editingLevel, setEditingLevel] = useState(null);
  const [editingBadge, setEditingBadge] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [levelsRes, badgesRes] = await Promise.all([
        axios.get(`${API}/api/evolution-levels`),
        axios.get(`${API}/api/evolution-badges`)
      ]);
      setLevels(levelsRes.data.sort((a, b) => a.order - b.order));
      setBadges(badgesRes.data.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Error fetching evolution data:', err);
    }
  };

  const saveLevel = async (level) => {
    setSaving(true);
    try {
      if (level.id) {
        await axios.put(`${API}/api/evolution-levels/${level.id}`, level);
      } else {
        await axios.post(`${API}/api/evolution-levels`, level);
      }
      setMessage('✅ Level saved!');
      setEditingLevel(null);
      await fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error saving level');
    } finally {
      setSaving(false);
    }
  };

  const deleteLevel = async (id) => {
    if (!window.confirm('Delete this level?')) return;
    try {
      await axios.delete(`${API}/api/evolution-levels/${id}`);
      await fetchData();
    } catch (err) {
      console.error('Error deleting level:', err);
    }
  };

  const saveBadge = async (badge) => {
    setSaving(true);
    try {
      if (badge.id) {
        await axios.put(`${API}/api/evolution-badges/${badge.id}`, badge);
      } else {
        await axios.post(`${API}/api/evolution-badges`, badge);
      }
      setMessage('✅ Badge saved!');
      setEditingBadge(null);
      await fetchData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error saving badge');
    } finally {
      setSaving(false);
    }
  };

  const deleteBadge = async (id) => {
    if (!window.confirm('Delete this badge?')) return;
    try {
      await axios.delete(`${API}/api/evolution-badges/${id}`);
      await fetchData();
    } catch (err) {
      console.error('Error deleting badge:', err);
    }
  };

  return (
    <div className="admin-content">
      <h2 className="text-2xl font-bold mb-4">User Evolution Management</h2>
      <p className="text-gray-600 mb-6">Manage FOMO Score levels and achievement badges</p>

      {message && (
        <div className={`p-3 rounded-lg mb-4 ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b-2">
        <button
          onClick={() => setActiveSubTab('levels')}
          className={`px-6 py-3 font-semibold ${activeSubTab === 'levels' ? 'text-blue-600 border-b-3 border-blue-600' : 'text-gray-600'}`}>
          Levels ({levels.length})
        </button>
        <button
          onClick={() => setActiveSubTab('badges')}
          className={`px-6 py-3 font-semibold ${activeSubTab === 'badges' ? 'text-blue-600 border-b-3 border-blue-600' : 'text-gray-600'}`}>
          Badges ({badges.length})
        </button>
      </div>

      {/* LEVELS TAB */}
      {activeSubTab === 'levels' && (
        <div>
          <button
            onClick={() => setEditingLevel({})}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Add New Level
          </button>

          {editingLevel && (
            <LevelForm
              level={editingLevel}
              onSave={saveLevel}
              onCancel={() => setEditingLevel(null)}
              saving={saving}
            />
          )}

          <div className="space-y-3">
            {levels.map((level) => (
              <div key={level.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{level.rank_en || 'Untitled'}</h4>
                  <p className="text-sm text-gray-600">
                    FOMO: {level.fomo_score_min}–{level.fomo_score_max} | {level.animation_type}
                  </p>
                </div>
                <button
                  onClick={() => setEditingLevel(level)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteLevel(level.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BADGES TAB */}
      {activeSubTab === 'badges' && (
        <div>
          <button
            onClick={() => setEditingBadge({})}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Add New Badge
          </button>

          {editingBadge && (
            <BadgeForm
              badge={editingBadge}
              onSave={saveBadge}
              onCancel={() => setEditingBadge(null)}
              saving={saving}
            />
          )}

          <div className="space-y-3">
            {badges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{badge.name_en || badge.name || 'Untitled'}</h4>
                  <p className="text-sm text-gray-600">
                    XP: {badge.xp_requirement?.toLocaleString()} | {badge.animation_type}
                  </p>
                </div>
                <button
                  onClick={() => setEditingBadge(badge)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteBadge(badge.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// LEVEL FORM
const LevelForm = ({ level, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(level || {
    rank_en: '', fomo_score_min: 0, fomo_score_max: 100,
    next_level_en: '', description_en: '',
    back_title_en: 'How to Reach This Level',
    back_description_en: '',
    animation_type: 'stellar', gradient_from: '#64748b', gradient_to: '#475569', order: 0
  });

  return (
    <div className="bg-white p-6 rounded-lg border-2 mb-6">
      <h4 className="text-lg font-bold mb-4">{level?.id ? 'Edit Level' : 'New Level'}</h4>

      <div className="mb-6 p-4 bg-white rounded-lg border-2 border-green-500">
        <h5 className="font-semibold text-green-600 mb-4">📄 Main Info</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Level Name</label>
            <input
              type="text"
              value={form.rank_en || ''}
              onChange={e => setForm({...form, rank_en: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Stellar Awakening"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Next Level</label>
            <input
              type="text"
              value={form.next_level_en || ''}
              onChange={e => setForm({...form, next_level_en: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">FOMO Score Min</label>
            <input
              type="number"
              value={form.fomo_score_min}
              onChange={e => setForm({...form, fomo_score_min: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">FOMO Score Max</label>
            <input
              type="number"
              value={form.fomo_score_max}
              onChange={e => setForm({...form, fomo_score_max: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description_en || ''}
              onChange={e => setForm({...form, description_en: e.target.value})}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg border-2 border-blue-500">
        <h5 className="font-semibold text-blue-600 mb-4">🔄 Back Side</h5>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Back Title</label>
            <input
              type="text"
              value={form.back_title_en || ''}
              onChange={e => setForm({...form, back_title_en: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Back Description</label>
            <textarea
              value={form.back_description_en || ''}
              onChange={e => setForm({...form, back_description_en: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg border-2">
        <h5 className="font-semibold text-gray-600 mb-4">🎨 Style</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Animation Type</label>
            <select
              value={form.animation_type}
              onChange={e => setForm({...form, animation_type: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg">
              {ANIMATION_TYPES_LEVELS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              type="number"
              value={form.order}
              onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gradient From</label>
            <input
              type="color"
              value={form.gradient_from}
              onChange={e => setForm({...form, gradient_from: e.target.value})}
              className="w-full h-10 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gradient To</label>
            <input
              type="color"
              value={form.gradient_to}
              onChange={e => setForm({...form, gradient_to: e.target.value})}
              className="w-full h-10 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Level'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );
};

// BADGE FORM
const BadgeForm = ({ badge, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(badge || {
    name_en: '', xp_requirement: 1000,
    condition_en: '', description_en: '',
    back_title_en: 'How to Unlock This Badge',
    back_description_en: '',
    animation_type: 'pioneer', gradient_from: '#3b82f6', gradient_to: '#06b6d4', order: 0
  });

  return (
    <div className="bg-white p-6 rounded-lg border-2 mb-6">
      <h4 className="text-lg font-bold mb-4">{badge?.id ? 'Edit Badge' : 'New Badge'}</h4>

      <div className="mb-6 p-4 bg-white rounded-lg border-2 border-green-500">
        <h5 className="font-semibold text-green-600 mb-4">📄 Main Info</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Badge Name</label>
            <input
              type="text"
              value={form.name_en || ''}
              onChange={e => setForm({...form, name_en: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="XP Pioneer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">XP Requirement</label>
            <input
              type="number"
              value={form.xp_requirement}
              onChange={e => setForm({...form, xp_requirement: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Condition (How to earn)</label>
            <textarea
              value={form.condition_en || ''}
              onChange={e => setForm({...form, condition_en: e.target.value})}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description_en || ''}
              onChange={e => setForm({...form, description_en: e.target.value})}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg border-2 border-blue-500">
        <h5 className="font-semibold text-blue-600 mb-4">🔄 Back Side</h5>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Back Title</label>
            <input
              type="text"
              value={form.back_title_en || ''}
              onChange={e => setForm({...form, back_title_en: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Back Description</label>
            <textarea
              value={form.back_description_en || ''}
              onChange={e => setForm({...form, back_description_en: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg border-2">
        <h5 className="font-semibold text-gray-600 mb-4">🎨 Style</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Animation Type</label>
            <select
              value={form.animation_type}
              onChange={e => setForm({...form, animation_type: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg">
              {ANIMATION_TYPES_BADGES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              type="number"
              value={form.order}
              onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gradient From</label>
            <input
              type="color"
              value={form.gradient_from}
              onChange={e => setForm({...form, gradient_from: e.target.value})}
              className="w-full h-10 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gradient To</label>
            <input
              type="color"
              value={form.gradient_to}
              onChange={e => setForm({...form, gradient_to: e.target.value})}
              className="w-full h-10 border rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Badge'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EvolutionSection;
