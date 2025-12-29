/**
 * Application Constants
 * 
 * Centralized configuration values used across the application.
 */

// Backend URL from environment
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

// API base URL
export const API_URL = `${BACKEND_URL}/api`;

// Dynamic.xyz Environment ID for wallet connections
export const DYNAMIC_ENVIRONMENT_ID = '3f47c17e-3c08-48a7-b78d-050cfde66c62';

// Default language
export const DEFAULT_LANGUAGE = 'en';

// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'ru'];

// Social media platforms
export const SOCIAL_PLATFORMS = [
  { key: 'twitter', label: 'Twitter', icon: '𝕏' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { key: 'telegram', label: 'Telegram', icon: '✈️' },
  { key: 'instagram', label: 'Instagram', icon: '📷' },
  { key: 'tiktok', label: 'TikTok', icon: '🎵' },
  { key: 'website', label: 'Website', icon: '🌐' },
  { key: 'discord', label: 'Discord', icon: '💬' },
  { key: 'github', label: 'GitHub', icon: '🔗' },
  { key: 'youtube', label: 'YouTube', icon: '▶️' },
];

// Team member types
export const MEMBER_TYPES = [
  { value: 'main', label: 'Main Team (large cards with bio)' },
  { value: 'team_member', label: 'Team Members (small cards)' },
];

// Partner categories
export const PARTNER_CATEGORIES = [
  { value: 'partners', label: 'Partners' },
  { value: 'media', label: 'Media' },
  { value: 'portfolio', label: 'Portfolio' },
];

// Roadmap task statuses
export const TASK_STATUSES = [
  { value: 'done', label: 'Completed', color: 'green' },
  { value: 'progress', label: 'In Progress', color: 'blue' },
  { value: 'planned', label: 'Planned', color: 'gray' },
];

// Image upload settings
export const IMAGE_SETTINGS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedFormats: ['image/png', 'image/jpeg', 'image/webp'],
  teamMemberSize: '400x400',
  partnerSize: '200x200',
  projectSize: '1200x800',
};

// Navigation items for main menu
export const NAV_ITEMS = [
  { key: 'home', href: '#home' },
  { key: 'about', href: '#about' },
  { key: 'platform', href: '#platform' },
  { key: 'roadmap', href: '#roadmap' },
  { key: 'team', href: '#team' },
  { key: 'partners', href: '#partners' },
  { key: 'faq', href: '#faq' },
];

export default {
  BACKEND_URL,
  API_URL,
  DYNAMIC_ENVIRONMENT_ID,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  SOCIAL_PLATFORMS,
  MEMBER_TYPES,
  PARTNER_CATEGORIES,
  TASK_STATUSES,
  IMAGE_SETTINGS,
  NAV_ITEMS,
};
