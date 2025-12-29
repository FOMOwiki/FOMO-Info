import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const RoadmapSection = ({ showNotification }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { // eslint-disable-line react-hooks/exhaustive-deps
    fetchTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API}/api/roadmap`);
      setTasks(response.data.tasks || []);
    } catch (error) {
      showNotification('Failed to load roadmap', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axios.delete(`${API}/api/roadmap/tasks/${id}`);
      showNotification('Task deleted!');
      fetchTasks();
    } catch (error) {
      showNotification('Failed to delete task', 'error');
    }
  };

  const filteredTasks = tasks.filter(t => 
    filter === 'all' ? true : t.status === filter
  );

  const completedCount = tasks.filter(t => t.status === 'done').length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Roadmap Management</h2>
        <div className="flex space-x-2">
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Tasks' },
              { value: 'done', label: 'Completed' },
              { value: 'progress', label: 'In Progress' }
            ]}
          />
          <Button onClick={() => setShowForm(true)}>Add Task</Button>
        </div>
      </div>

      <Card title="Progress Overview">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-semibold text-emerald-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{completedCount} completed</span>
            <span>{tasks.length - completedCount} in progress</span>
          </div>
        </div>
      </Card>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSave={() => {
            fetchTasks();
            setShowForm(false);
            setEditingTask(null);
            showNotification(editingTask ? 'Task updated!' : 'Task created!');
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          showNotification={showNotification}
        />
      )}

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${task.status === 'done' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <div>
                  <h3 className="font-semibold">{task.name_en}</h3>
                  <div className="flex space-x-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {task.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.status === 'done' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {task.status === 'done' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingTask(task);
                    setShowForm(true);
                  }}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(task.id)}>
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

const TaskForm = ({ task, onSave, onCancel, showNotification }) => {
  const [formData, setFormData] = useState(task || {
    name_en: '',
    name_ru: '',
    status: 'progress',
    category: 'Development',
    order: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Copy name_en to name_ru for consistency (English-only app)
    const dataToSend = {
      ...formData,
      name_ru: formData.name_en // Auto-copy English to Russian
    };

    try {
      if (task) {
        await axios.put(`${API}/api/roadmap/tasks/${task.id}`, dataToSend);
      } else {
        await axios.post(`${API}/api/roadmap/tasks`, dataToSend);
      }
      onSave();
    } catch (error) {
      showNotification('Failed to save task', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card title={task ? 'Edit Task' : 'Create Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Name"
          value={formData.name_en}
          onChange={(e) => setFormData({...formData, name_en: e.target.value})}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            options={[
              { value: 'progress', label: 'In Progress' },
              { value: 'done', label: 'Completed' }
            ]}
          />

          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="e.g., Development, Design"
          />
        </div>

        <Input
          label="Display Order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Task'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default RoadmapSection;
