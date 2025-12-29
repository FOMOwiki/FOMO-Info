/**
 * API Client Configuration
 * 
 * Centralized API client for making HTTP requests to the backend.
 */

import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

/**
 * Axios instance with default configuration
 */
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API endpoints grouped by feature
 */
export const endpoints = {
  // Drawer Cards
  drawerCards: {
    list: () => api.get('/drawer-cards'),
    create: (data) => api.post('/drawer-cards', data),
    update: (id, data) => api.put(`/drawer-cards/${id}`, data),
    delete: (id) => api.delete(`/drawer-cards/${id}`),
    reorder: (data) => api.post('/drawer-cards/reorder', data),
  },
  
  // Team Members
  team: {
    list: () => api.get('/team-members'),
    create: (data) => api.post('/team-members', data),
    update: (id, data) => api.put(`/team-members/${id}`, data),
    delete: (id) => api.delete(`/team-members/${id}`),
    reorder: (data) => api.post('/team-members/reorder', data),
  },
  
  // Partners
  partners: {
    list: () => api.get('/partners'),
    create: (data) => api.post('/partners', data),
    update: (id, data) => api.put(`/partners/${id}`, data),
    delete: (id) => api.delete(`/partners/${id}`),
    reorder: (data) => api.post('/partners/reorder', data),
    seedDefaults: () => api.post('/partners/seed-defaults'),
  },
  
  // Roadmap
  roadmap: {
    get: () => api.get('/roadmap'),
    update: (data) => api.put('/roadmap', data),
    addTask: (data) => api.post('/roadmap/task', data),
    updateTask: (taskId, data) => api.put(`/roadmap/task/${taskId}`, data),
    deleteTask: (taskId) => api.delete(`/roadmap/task/${taskId}`),
    reorderTasks: (data) => api.post('/roadmap/reorder', data),
  },
  
  // FAQ
  faq: {
    list: () => api.get('/faq'),
    create: (data) => api.post('/faq', data),
    update: (id, data) => api.put(`/faq/${id}`, data),
    delete: (id) => api.delete(`/faq/${id}`),
  },
  
  // Settings
  settings: {
    hero: () => api.get('/hero-settings'),
    updateHero: (data) => api.put('/hero-settings', data),
    about: () => api.get('/about-settings'),
    updateAbout: (data) => api.put('/about-settings', data),
    platform: () => api.get('/platform-settings'),
    updatePlatform: (data) => api.put('/platform-settings', data),
    footer: () => api.get('/footer-settings'),
    updateFooter: (data) => api.put('/footer-settings', data),
    community: () => api.get('/community-settings'),
    updateCommunity: (data) => api.put('/community-settings', data),
  },
  
  // Utilities
  utilities: {
    list: () => api.get('/utilities'),
  },
  
  // Analytics
  analytics: {
    stats: (period = 30) => api.get(`/analytics/stats?period=${period}`),
    track: (data) => api.post('/analytics/track', data),
  },
  
  // Admin
  admin: {
    login: (password) => api.post('/admin/login', { password }),
    verify: (token) => api.post('/admin/verify', { token }),
  },
  
  // Upload
  upload: {
    image: (formData) => api.post('/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  },
};

export default api;
