import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ImageUpload from '../ui/ImageUpload';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const EcosystemSection = ({ showNotification }) => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCard, setEditingCard] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title_en: '',
    link: '',
    image_url: '',
    order: 0
  });

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await axios.get(`${API}/api/drawer-cards`);
      setCards(response.data);
    } catch (error) {
      showNotification('Failed to load cards', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingCard) {
        await axios.put(`${API}/api/drawer-cards/${editingCard.id}`, formData);
        showNotification('Card updated!');
      } else {
        await axios.post(`${API}/api/drawer-cards`, formData);
        showNotification('Card created!');
      }
      fetchCards();
      handleCancel();
    } catch (error) {
      showNotification('Failed to save card', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this card?')) return;
    try {
      await axios.delete(`${API}/api/drawer-cards/${id}`);
      showNotification('Card deleted!');
      fetchCards();
    } catch (error) {
      showNotification('Failed to delete card', 'error');
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({
      title_en: card.title_en,
      link: card.link,
      image_url: card.image_url,
      order: card.order
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingCard(null);
    setFormData({ title_en: '', link: '', image_url: '', order: 0 });
    setShowForm(false);
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Ecosystem Cards</h2>
        <Button onClick={() => setShowForm(true)}>Add Card</Button>
      </div>

      {showForm && (
        <Card title={editingCard ? 'Edit Card' : 'Create Card'}>
          <div className="space-y-4">
            <Input
              label="Title"
              value={formData.title_en}
              onChange={(e) => setFormData({...formData, title_en: e.target.value})}
              required
            />
            <Input
              label="Link"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
              placeholder="https://example.com"
            />
            <div>
              <ImageUpload
                label="Card Image"
                value={formData.image_url}
                onChange={(url) => setFormData({...formData, image_url: url})}
              />
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-1">📋 Image Requirements:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• <strong>Size:</strong> 400×300px (recommended)</li>
                  <li>• <strong>Format:</strong> PNG, JPG, or WebP</li>
                  <li>• <strong>Aspect ratio:</strong> 4:3</li>
                  <li>• <strong>Max file size:</strong> 2MB</li>
                </ul>
              </div>
            </div>
            <Input
              label="Display Order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.id}>
            {card.image_url && (
              <img src={card.image_url} alt={card.title_en} className="w-full h-40 object-cover rounded-lg mb-3" />
            )}
            <h3 className="font-semibold mb-2">{card.title_en}</h3>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => handleEdit(card)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDelete(card.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EcosystemSection;
