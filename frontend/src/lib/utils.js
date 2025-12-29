/**
 * Utility Functions
 * 
 * Common helper functions used across the application.
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 * @param {...any} inputs - Class names to merge
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get localized field value from an object
 * @param {Object} obj - Object containing localized fields
 * @param {string} fieldName - Base field name (without _ru/_en suffix)
 * @param {string} lang - Language code ('ru' or 'en')
 * @returns {string} Localized value or empty string
 */
export const getLangField = (obj, fieldName, lang = 'en') => {
  if (!obj) return '';
  
  // Try language-specific field first
  const langField = obj[`${fieldName}_${lang}`];
  if (langField) return langField;
  
  // Fallback to opposite language
  const fallbackLang = lang === 'ru' ? 'en' : 'ru';
  const fallbackField = obj[`${fieldName}_${fallbackLang}`];
  if (fallbackField) return fallbackField;
  
  // Last resort - return old field if exists
  return obj[fieldName] || '';
};

/**
 * Format number with K/M/B suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
export const formatNumber = (num) => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

/**
 * Format duration in seconds to human readable
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

/**
 * Truncate wallet address for display
 * @param {string} address - Full wallet address
 * @param {number} start - Characters to show at start
 * @param {number} end - Characters to show at end
 * @returns {string} Truncated address
 */
export const truncateAddress = (address, start = 6, end = 4) => {
  if (!address) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

/**
 * Get backend URL with proper path
 * @param {string} path - Path to append
 * @returns {string} Full URL
 */
export const getBackendUrl = (path = '') => {
  const baseUrl = process.env.REACT_APP_BACKEND_URL || '';
  return `${baseUrl}${path}`;
};

/**
 * Get API URL
 * @param {string} endpoint - API endpoint
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint = '') => {
  return getBackendUrl(`/api${endpoint}`);
};
