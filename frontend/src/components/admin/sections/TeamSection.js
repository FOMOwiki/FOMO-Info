import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import ImageUpload from '../ui/ImageUpload';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const TeamSection = ({ showNotification }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingMember, setEditingMember] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    fetchMembers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${API}/api/team-members`);
      setMembers(response.data);
    } catch (error) {
      showNotification('Failed to load team members', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    try {
      await axios.delete(`${API}/api/team-members/${id}`);
      showNotification('Team member deleted!');
      fetchMembers();
    } catch (error) {
      showNotification('Failed to delete member', 'error');
    }
  };

  const filteredMembers = members.filter(m => 
    filter === 'all' ? true : m.member_type === filter
  );

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Team Management</h2>
        <div className="flex space-x-2">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Members' },
              { value: 'main', label: 'Core Team' },
              { value: 'team_member', label: 'Team' }
            ]}
          />
          <Button onClick={() => setShowForm(true)}>Add Member</Button>
        </div>
      </div>

      {showForm && (
        <TeamMemberForm
          member={editingMember}
          onSave={() => {
            fetchMembers();
            setShowForm(false);
            setEditingMember(null);
            showNotification(editingMember ? 'Member updated!' : 'Member created!');
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
          showNotification={showNotification}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id}>
            <div className="flex space-x-4">
              <img
                src={member.image_url || 'https://via.placeholder.com/80'}
                alt={member.name_en}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{member.name_en}</h3>
                <p className="text-sm text-gray-600">{member.position_en}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{member.bio_en}</p>
                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                  member.member_type === 'main' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {member.member_type === 'main' ? 'Core Team' : 'Team'}
                </span>
              </div>
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingMember(member);
                    setShowForm(true);
                  }}
                  className="text-sm px-3 py-1"
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(member.id)}
                  className="text-sm px-3 py-1"
                >
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

const TeamMemberForm = ({ member, onSave, onCancel, showNotification }) => {
  const [formData, setFormData] = useState(member || {
    name_en: '',
    position_en: '',
    bio_en: '',
    image_url: '',
    member_type: 'team_member',
    order: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (member) {
        await axios.put(`${API}/api/team-members/${member.id}`, formData);
      } else {
        await axios.post(`${API}/api/team-members`, formData);
      }
      onSave();
    } catch (error) {
      showNotification('Failed to save member', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card title={member ? 'Edit Team Member' : 'Create Team Member'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Name"
            value={formData.name_en}
            onChange={(e) => setFormData({...formData, name_en: e.target.value})}
            required
          />
          <Input
            label="Position"
            value={formData.position_en}
            onChange={(e) => setFormData({...formData, position_en: e.target.value})}
            required
          />
        </div>

        <Textarea
          label="Bio"
          value={formData.bio_en}
          onChange={(e) => setFormData({...formData, bio_en: e.target.value})}
          rows={3}
        />

        <div>
          <ImageUpload
            label="Profile Photo"
            value={formData.image_url}
            onChange={(url) => setFormData({...formData, image_url: url})}
          />
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-1">📋 Image Requirements:</p>
            {formData.member_type === 'main' ? (
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>Size:</strong> 300×300px (Core Team - larger card)</li>
                <li>• <strong>Format:</strong> PNG, JPG, or WebP</li>
                <li>• <strong>Aspect ratio:</strong> 1:1 (square)</li>
                <li>• <strong>Background:</strong> Transparent or solid color recommended</li>
              </ul>
            ) : (
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>Size:</strong> 200×200px (Team Member - smaller card)</li>
                <li>• <strong>Format:</strong> PNG, JPG, or WebP</li>
                <li>• <strong>Aspect ratio:</strong> 1:1 (square)</li>
                <li>• <strong>Background:</strong> Transparent or solid color recommended</li>
              </ul>
            )}
          </div>
        </div>

        <Select
          label="Member Type"
          value={formData.member_type}
          onChange={(e) => setFormData({...formData, member_type: e.target.value})}
          options={[
            { value: 'main', label: 'Core Team' },
            { value: 'team_member', label: 'Team Member' }
          ]}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Member'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TeamSection;
