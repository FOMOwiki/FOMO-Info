import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const UtilityNavButtonsAdmin = () => {
  const [buttons, setButtons] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchButtons();
  }, []);

  const fetchButtons = async () => {
    try {
      const res = await axios.get(`${API}/api/utility-nav-buttons`);
      setButtons(res.data.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Error fetching buttons:', err);
    }
  };

  const saveButton = async (button) => {
    setSaving(true);
    try {
      if (button.id) {
        await axios.put(`${API}/api/utility-nav-buttons/${button.id}`, button);
      } else {
        await axios.post(`${API}/api/utility-nav-buttons`, button);
      }
      setMessage('✅ Button saved!');
      setEditing(null);
      await fetchButtons();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Error saving button');
    } finally {
      setSaving(false);
    }
  };

  const deleteButton = async (id) => {
    if (!window.confirm('Delete this button?')) return;
    try {
      await axios.delete(`${API}/api/utility-nav-buttons/${id}`);
      await fetchButtons();
    } catch (err) {
      console.error('Error deleting button:', err);
    }
  };

  return (
    <div className="admin-content">
      <h2 className="text-2xl font-bold mb-4">Utility Navigation Buttons</h2>
      <p className="text-gray-600 mb-6">Manage Crypto/Core/Utility navigation buttons</p>

      {message && (
        <div className={`p-3 rounded-lg mb-4 ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <button
        onClick={() => setEditing({})}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        + Add New Button
      </button>

      {editing && (
        <ButtonForm
          button={editing}
          onSave={saveButton}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      <div className="space-y-3">
        {buttons.map((button) => (
          <div key={button.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold">{button.label}</h4>
              <p className="text-sm text-gray-600">URL: {button.url} | Order: {button.order}</p>
            </div>
            <button
              onClick={() => setEditing(button)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              ✏️ Edit
            </button>
            <button
              onClick={() => deleteButton(button.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ButtonForm = ({ button, onSave, onCancel, saving }) => {
  const [form, setForm] = useState(button || {
    label: '',
    url: '',
    order: 0
  });

  return (
    <div className="bg-white p-6 rounded-lg border-2 mb-6">
      <h4 className="text-lg font-bold mb-4">{button?.id ? 'Edit Button' : 'New Button'}</h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Button Label</label>
          <input
            type="text"
            value={form.label}
            onChange={e => setForm({...form, label: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Crypto"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">URL</label>
          <input
            type="text"
            value={form.url}
            onChange={e => setForm({...form, url: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="#crypto"
          />
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
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Button'}
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

export default UtilityNavButtonsAdmin;
