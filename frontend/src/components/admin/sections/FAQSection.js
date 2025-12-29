import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const FAQSection = ({ showNotification }) => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${API}/api/faq`);
      setFaqs(response.data);
    } catch (error) {
      showNotification('Failed to load FAQs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await axios.delete(`${API}/api/faq/${id}`);
      showNotification('FAQ deleted!');
      fetchFaqs();
    } catch (error) {
      showNotification('Failed to delete FAQ', 'error');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">FAQ Management</h2>
        <Button onClick={() => setShowForm(true)}>Add FAQ</Button>
      </div>

      {showForm && (
        <FaqForm
          faq={editingFaq}
          onSave={() => {
            fetchFaqs();
            setShowForm(false);
            setEditingFaq(null);
            showNotification(editingFaq ? 'FAQ updated!' : 'FAQ created!');
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingFaq(null);
          }}
          showNotification={showNotification}
        />
      )}

      <div className="space-y-3">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{faq.question}</h3>
              <p className="text-gray-600 text-sm">{faq.answer}</p>
              <div className="flex justify-end space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingFaq(faq);
                    setShowForm(true);
                  }}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(faq.id)}>
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

const FaqForm = ({ faq, onSave, onCancel, showNotification }) => {
  const [formData, setFormData] = useState(faq || {
    question: '',
    answer: '',
    order: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (faq) {
        await axios.put(`${API}/api/faq/${faq.id}`, formData);
      } else {
        await axios.post(`${API}/api/faq`, formData);
      }
      onSave();
    } catch (error) {
      showNotification('Failed to save FAQ', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card title={faq ? 'Edit FAQ' : 'Create FAQ'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Question"
          value={formData.question}
          onChange={(e) => setFormData({...formData, question: e.target.value})}
          required
        />

        <Textarea
          label="Answer"
          value={formData.answer}
          onChange={(e) => setFormData({...formData, answer: e.target.value})}
          rows={4}
          required
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save FAQ'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FAQSection;
