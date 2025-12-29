import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const ImageUpload = ({ value, onChange, label }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload PNG, JPEG, or WebP image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API}/api/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImageError(false);
      onChange(response.data.url);
    } catch (err) {
      setError('Failed to upload image');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="flex items-center space-x-4">
        {value && !imageError && (
          <img 
            src={value} 
            alt="Preview" 
            className="w-20 h-20 object-cover rounded-lg border border-gray-300"
            onError={() => setImageError(true)}
          />
        )}
        {value && imageError && (
          <div className="w-20 h-20 rounded-lg border border-red-300 bg-red-50 flex items-center justify-center">
            <span className="text-red-500 text-xs text-center">Invalid URL</span>
          </div>
        )}
        
        <label className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
          {uploading ? 'Uploading...' : 'Choose Image'}
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {value && (
          <button
            onClick={() => { onChange(''); setImageError(false); }}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {value && (
        <input
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setImageError(false); }}
          placeholder="Or paste image URL"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
        />
      )}
    </div>
  );
};

export default ImageUpload;
