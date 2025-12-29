import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import ImageUpload from '../ui/ImageUpload';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Component to handle partner logo with error fallback
const PartnerLogo = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
        <span className="text-gray-400 text-sm">{src ? 'Invalid image URL' : 'No image'}</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-32 object-contain mb-3 bg-gray-50 rounded-lg p-2"
      onError={() => setHasError(true)}
    />
  );
};

const PartnersSection = ({ showNotification }) => {
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingPartner, setEditingPartner] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${API}/api/partners`);
      setPartners(response.data);
    } catch (error) {
      showNotification('Failed to load partners', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this partner?')) return;
    try {
      await axios.delete(`${API}/api/partners/${id}`);
      showNotification('Partner deleted!');
      fetchPartners();
    } catch (error) {
      showNotification('Failed to delete partner', 'error');
    }
  };

  const seedDefaultPartners = async () => {
    setIsSeeding(true);
    try {
      await axios.post(`${API}/api/partners/seed-defaults`);
      showNotification('Default partners created!');
      fetchPartners();
    } catch (error) {
      showNotification('Failed to seed partners', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredPartners = partners.filter(p => 
    filter === 'all' ? true : p.category === filter
  );

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Partners Management</h2>
        <div className="flex space-x-2">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Partners' },
              { value: 'partners', label: 'Partners' },
              { value: 'media', label: 'Media' },
              { value: 'portfolio', label: 'Portfolio' }
            ]}
          />
          <Button variant="secondary" onClick={seedDefaultPartners} disabled={isSeeding}>
            {isSeeding ? 'Seeding...' : 'Seed Defaults'}
          </Button>
          <Button onClick={() => setShowForm(true)}>Add Partner</Button>
        </div>
      </div>

      {/* Info about logo images */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Partner Logo Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Logo:</strong> Single logo image (hover effect is CSS-based, no second image needed)</li>
          <li>• Recommended size: 200×200px PNG/SVG with transparent background</li>
          <li>• Best results: Grayscale or white logo on transparent background</li>
        </ul>
      </div>

      {showForm && (
        <PartnerForm
          partner={editingPartner}
          onSave={() => {
            fetchPartners();
            setShowForm(false);
            setEditingPartner(null);
            showNotification(editingPartner ? 'Partner updated!' : 'Partner created!');
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingPartner(null);
          }}
          showNotification={showNotification}
        />
      )}

      {filteredPartners.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No partners found. Add some or seed defaults.</p>
          <Button variant="secondary" onClick={seedDefaultPartners} disabled={isSeeding}>
            {isSeeding ? 'Seeding...' : 'Seed Default Partners'}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <Card key={partner.id}>
              <div className="relative group">
                {/* Partner Logo */}
                <PartnerLogo src={partner.image_url} alt={partner.name_en} />
              </div>
              <h3 className="font-semibold text-lg mb-1">{partner.name_en}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{partner.description_en}</p>
              <div className="flex items-center space-x-2 mb-3">
                <span className={`inline-block px-2 py-1 text-xs rounded ${
                  partner.category === 'partners' ? 'bg-emerald-100 text-emerald-700' :
                  partner.category === 'media' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {partner.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingPartner(partner);
                    setShowForm(true);
                  }}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(partner.id)}
                  className="flex-1"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const PartnerForm = ({ partner, onSave, onCancel, showNotification }) => {
  const [formData, setFormData] = useState(partner || {
    name_en: '',
    name_ru: '',
    description_en: '',
    description_ru: '',
    image_url: '',
    image_url_hover: '',
    link: '',
    category: 'partners',
    order: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Clean up data - remove empty hover URL if not provided
      const dataToSend = { ...formData };
      if (!dataToSend.image_url_hover) {
        dataToSend.image_url_hover = null;
      }
      
      if (partner) {
        await axios.put(`${API}/api/partners/${partner.id}`, dataToSend);
      } else {
        await axios.post(`${API}/api/partners`, dataToSend);
      }
      onSave();
    } catch (error) {
      showNotification('Failed to save partner', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card title={partner ? 'Edit Partner' : 'Create Partner'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Partner Name"
          value={formData.name_en}
          onChange={(e) => setFormData({...formData, name_en: e.target.value, name_ru: e.target.value})}
          required
        />

        <Textarea
          label="Description"
          value={formData.description_en}
          onChange={(e) => setFormData({...formData, description_en: e.target.value, description_ru: e.target.value})}
          rows={2}
          placeholder="Brief description of the partner/company"
        />

        {/* Logo Upload - Single field (hover effect is CSS-based) */}
        <div>
          <ImageUpload
            label="Partner Logo"
            value={formData.image_url}
            onChange={(url) => setFormData({...formData, image_url: url, image_url_hover: url})}
          />
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-medium">Size: 200×200px</span> — PNG/SVG with transparent background preferred
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Website Link"
            value={formData.link}
            onChange={(e) => setFormData({...formData, link: e.target.value})}
            placeholder="https://example.com"
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            options={[
              { value: 'partners', label: 'Partners' },
              { value: 'media', label: 'Media' },
              { value: 'portfolio', label: 'Portfolio' }
            ]}
          />

          <Input
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Partner'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PartnersSection;
