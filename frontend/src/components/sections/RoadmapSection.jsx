import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const RoadmapSection = ({ roadmapData }) => {
  const { language } = useLanguage();
  
  const content = {
    en: {
      badge: 'Our Progress',
      title: 'Project Roadmap',
      subtitle: 'Track our development progress in real-time',
      completed: 'Completed',
      inProgress: 'In Progress',
      completeLabel: 'Complete',
      all: 'All',
      done: 'Done',
      progress: 'Progress'
    },
    ru: {
      badge: 'Наш прогресс',
      title: 'Дорожная карта проекта',
      subtitle: 'Отслеживайте прогресс разработки в реальном времени',
      completed: 'Завершено',
      inProgress: 'В процессе',
      completeLabel: 'Завершено',
      all: 'Все',
      done: 'Готово',
      progress: 'В процессе'
    }
  };

  const t = content[language];
  
  const defaultTasks = [
    { id: '1', name: 'Platform Architecture', status: 'done', category: 'Development' },
    { id: '2', name: 'Core Team Formation', status: 'done', category: 'Team' },
    { id: '3', name: 'Alpha Version Launch', status: 'done', category: 'Development' },
    { id: '4', name: 'Community Building', status: 'done', category: 'Marketing' },
    { id: '5', name: 'Beta Version v1.0', status: 'done', category: 'Development' },
    { id: '6', name: 'NFT Box 666 Mint', status: 'done', category: 'NFT' },
    { id: '7', name: 'Wallet Integration', status: 'done', category: 'Development' },
    { id: '8', name: 'Analytics Dashboard', status: 'done', category: 'Development' },
    { id: '9', name: 'Beta Version v1.1', status: 'progress', category: 'Development' },
    { id: '10', name: 'OTC Marketplace', status: 'progress', category: 'Development' },
    { id: '11', name: 'Mobile App Development', status: 'progress', category: 'Development' },
    { id: '12', name: 'Partnership Programs', status: 'progress', category: 'Business' },
  ];

  const tasks = roadmapData?.tasks?.length > 0 
    ? roadmapData.tasks.sort((a, b) => (a.order || 0) - (b.order || 0))
    : defaultTasks;
    
  const sectionBadge = roadmapData?.section_badge || t.badge;
  const sectionTitle = roadmapData?.section_title || t.title;
  const sectionSubtitle = roadmapData?.section_subtitle || t.subtitle;

  const [filter, setFilter] = useState('all');
  const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => task.status === filter);

  const statusConfig = {
    done: { label: t.completed, color: 'bg-emerald-500', textColor: 'text-emerald-600', bgLight: 'bg-emerald-50' },
    progress: { label: t.inProgress, color: 'bg-amber-500', textColor: 'text-amber-600', bgLight: 'bg-amber-50' },
  };

  const stats = {
    done: tasks.filter(task => task.status === 'done').length,
    progress: tasks.filter(task => task.status === 'progress').length,
  };
  
  const progressPercent = tasks.length > 0 ? Math.round((stats.done / tasks.length) * 100) : 0;

  return (
    <section id="roadmap" className="py-16 bg-white" data-testid="roadmap-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm font-medium mb-4">{sectionBadge}</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {sectionTitle.split(' ').map((word, i) => 
              i === sectionTitle.split(' ').length - 1 
                ? <span key={i} className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{word}</span>
                : <span key={i}>{word} </span>
            )}
          </h2>
          <p className="text-xl text-gray-600">{sectionSubtitle}</p>
        </div>

        <div className="roadmap-progress-bar mb-8">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          <span className="progress-label">{progressPercent}% {t.completeLabel}</span>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[{ key: 'all', label: 'All Tasks' }, { key: 'done', label: `Completed (${stats.done})` }, { key: 'progress', label: `In Progress (${stats.progress})` }].map((f) => (
            <button 
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.key ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="roadmap-tasks-grid">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`roadmap-task-card ${task.status}`}>
              <div className="task-status-dot">
                <span className={`dot ${statusConfig[task.status]?.color || 'bg-gray-400'}`}></span>
              </div>
              <div className="task-content">
                <span className={`task-category ${statusConfig[task.status]?.bgLight || 'bg-gray-50'} ${statusConfig[task.status]?.textColor || 'text-gray-600'}`}>{task.category}</span>
                <h4 className="task-name">{getLangField(task, 'name')}</h4>
              </div>
              <span className={`task-status-badge ${statusConfig[task.status]?.bgLight || 'bg-gray-50'} ${statusConfig[task.status]?.textColor || 'text-gray-600'}`}>
                {statusConfig[task.status]?.label || task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



export default RoadmapSection;
