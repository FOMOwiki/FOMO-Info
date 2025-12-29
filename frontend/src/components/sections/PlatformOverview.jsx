import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const PlatformOverview = ({ platformSettings }) => {
  const { language } = useLanguage();
  
  // Default values if no settings from API - English only
  const defaults = {
    community: { value: '45,658', label: 'Community Members', change: '+12%', trend: [30, 45, 38, 52, 48, 65, 58, 72, 68, 85, 78, 92] },
    visits: { value: '1.2M', label: 'Monthly Visits', change: '+18%', trend: [40, 55, 48, 62, 58, 75, 68, 82, 78, 95, 88, 98] },
    projects: { value: '16,670', label: 'Tracked Projects', change: '+8%', trend: [50, 45, 55, 50, 60, 55, 65, 60, 70, 65, 75, 80] },
    alerts: { value: '892', label: 'Red Flag Alerts', change: '-15%', trend: [80, 75, 70, 72, 65, 68, 60, 62, 55, 58, 50, 45] },
    service_modules: [
      { icon: '📊', name: 'Dashboard', count: '2,847', label: 'active', color: 'emerald' },
      { icon: '💱', name: 'OTC Market', count: '$50M+', label: 'volume', color: 'blue' },
      { icon: '🔄', name: 'P2P Exchange', count: '1,245', label: 'trades/day', color: 'purple' },
      { icon: '🎯', name: 'Predictions', count: '78%', label: 'accuracy', color: 'orange' },
      { icon: '🔍', name: 'Parsing', count: '16K+', label: 'tokens', color: 'pink' },
      { icon: '📈', name: 'Sentiment', count: '24/7', label: 'monitoring', color: 'cyan' },
      { icon: '🚀', name: 'EarlyLand', count: '340+', label: 'projects', color: 'green' },
      { icon: '🖼️', name: 'NFT Strategy', count: '89', label: 'collections', color: 'violet' },
    ],
    services_list: [
      { num: '01', title: 'OTC & P2P MARKETS', description: 'Secure over-the-counter trading and peer-to-peer exchange with escrow protection.' },
      { num: '02', title: 'EARLY LAND ACCESS', description: 'Get early access to promising projects and airdrops.' },
      { num: '03', title: 'ANALYTICS', description: 'Advanced parsing, sentiment analysis, and red flag detection.' },
    ],
    bottom_stats: [
      { value: '70%', label: 'AUTOMATED', description: 'AI insights' },
      { value: '24/7', label: 'COVERAGE', description: 'Monitoring' },
      { value: '$50M+', label: 'VOLUME', description: 'Markets' },
    ],
    section_badge: 'INSIDE THE PLATFORM',
    section_title: 'A command center for your crypto journey',
    section_intro: 'See every market move, track projects, manage your portfolio, and access exclusive opportunities in one place.'
  };

  // Merge settings with defaults
  const settings = platformSettings || defaults;
  
  // Helper to get language-specific value - now defaults to English
  const getLang = (obj, key) => {
    if (!obj) return '';
    return obj[`${key}_en`] || obj[key] || '';
  };
  
  const platformStats = {
    community: settings.community || defaults.community,
    visits: settings.visits || defaults.visits,
    projects: settings.projects || defaults.projects,
    alerts: settings.alerts || defaults.alerts
  };
  const serviceModules = settings.service_modules || defaults.service_modules;
  const services = settings.services_list || defaults.services_list;
  const bottomStats = settings.bottom_stats || defaults.bottom_stats;

  // SVG Icons for Service Modules
  const ServiceIcons = {
    dashboard: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <rect x="4" y="4" width="16" height="12" rx="2" fill={color} opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="4" y="20" width="16" height="24" rx="2" fill={color} opacity="0.6" />
        <rect x="24" y="4" width="20" height="18" rx="2" fill={color} opacity="0.5" />
        <rect x="24" y="26" width="20" height="18" rx="2" fill={color} opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.8s" repeatCount="indefinite" />
        </rect>
        <path d="M8 32L12 28L16 30" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round">
          <animate attributeName="d" values="M8 32L12 28L16 30;M8 30L12 26L16 32;M8 32L12 28L16 30" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>
    ),
    otc: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <circle cx="16" cy="24" r="10" fill={color} opacity="0.3" />
        <circle cx="32" cy="24" r="10" fill={color} opacity="0.3" />
        <path d="M14 20L14 28M18 24L10 24" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <text x="30" y="28" fill={color} fontSize="14" fontWeight="bold" textAnchor="middle">¥</text>
        <path d="M22 18L26 18M22 30L26 30" stroke={color} strokeWidth="2" strokeLinecap="round">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </path>
        <animateTransform attributeName="transform" type="translate" values="0,0;2,0;0,0" dur="2s" repeatCount="indefinite" />
      </svg>
    ),
    p2p: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <circle cx="12" cy="24" r="8" fill={color} opacity="0.4" />
        <circle cx="36" cy="24" r="8" fill={color} opacity="0.4" />
        <path d="M20 20L28 20M20 24L28 24M20 28L28 28" stroke={color} strokeWidth="2" strokeLinecap="round">
          <animate attributeName="stroke-dasharray" values="0,100;100,0;0,100" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="12" cy="24" r="4" fill={color}>
          <animate attributeName="r" values="4;5;4" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="36" cy="24" r="4" fill={color}>
          <animate attributeName="r" values="4;5;4" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    predictions: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2" fill="none" opacity="0.3" />
        <circle cx="24" cy="24" r="12" stroke={color} strokeWidth="2" fill="none" opacity="0.5" />
        <circle cx="24" cy="24" r="6" fill={color} opacity="0.6" />
        <circle cx="24" cy="24" r="2" fill={color}>
          <animate attributeName="r" values="2;3;2" dur="0.8s" repeatCount="indefinite" />
        </circle>
        <path d="M24 6V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M24 36V42" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M6 24H12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M36 24H42" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    parsing: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <circle cx="20" cy="20" r="12" stroke={color} strokeWidth="3" fill="none" opacity="0.6">
          <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M30 30L42 42" stroke={color} strokeWidth="4" strokeLinecap="round">
          <animate attributeName="stroke-width" values="4;5;4" dur="1s" repeatCount="indefinite" />
        </path>
        <path d="M14 20H26M20 14V26" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    sentiment: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <path d="M4 36L12 24L20 28L28 16L36 22L44 12" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="d" values="M4 36L12 24L20 28L28 16L36 22L44 12;M4 32L12 28L20 20L28 24L36 16L44 18;M4 36L12 24L20 28L28 16L36 22L44 12" dur="3s" repeatCount="indefinite" />
        </path>
        <circle cx="44" cy="12" r="4" fill={color}>
          <animate attributeName="cy" values="12;18;12" dur="3s" repeatCount="indefinite" />
        </circle>
        <path d="M4 40L44 40" stroke={color} strokeWidth="2" opacity="0.3" />
      </svg>
    ),
    earlyland: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <ellipse cx="24" cy="40" rx="12" ry="4" fill={color} opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.8s" repeatCount="indefinite" />
        </ellipse>
        <path d="M24 8L30 24H18L24 8Z" fill={color} opacity="0.8">
          <animate attributeName="d" values="M24 8L30 24H18L24 8Z;M24 4L32 26H16L24 4Z;M24 8L30 24H18L24 8Z" dur="1s" repeatCount="indefinite" />
        </path>
        <rect x="18" y="24" width="12" height="14" rx="2" fill={color} />
        <path d="M16 38L12 44H20L16 38Z" fill="#f97316" />
        <path d="M32 38L36 44H28L32 38Z" fill="#f97316" />
        <circle cx="24" cy="18" r="3" fill="#fff" opacity="0.8" />
      </svg>
    ),
    nft: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <rect x="6" y="6" width="36" height="36" rx="4" stroke={color} strokeWidth="2" fill="none" opacity="0.3" />
        <rect x="10" y="10" width="28" height="28" rx="2" fill={color} opacity="0.2" />
        <path d="M16 26L22 20L28 24L34 18" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round">
          <animate attributeName="d" values="M16 26L22 20L28 24L34 18;M16 22L22 28L28 20L34 26;M16 26L22 20L28 24L34 18" dur="4s" repeatCount="indefinite" />
        </path>
        <circle cx="34" cy="18" r="3" fill={color}>
          <animate attributeName="cy" values="18;26;18" dur="4s" repeatCount="indefinite" />
        </circle>
        <rect x="14" y="30" width="20" height="4" rx="1" fill={color} opacity="0.4" />
      </svg>
    ),
    analytics: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <rect x="8" y="28" width="6" height="14" rx="1" fill={color} opacity="0.6">
          <animate attributeName="height" values="14;18;14" dur="1.5s" repeatCount="indefinite" />
        </rect>
        <rect x="18" y="20" width="6" height="22" rx="1" fill={color} opacity="0.7">
          <animate attributeName="height" values="22;26;22" dur="1.8s" repeatCount="indefinite" />
        </rect>
        <rect x="28" y="12" width="6" height="30" rx="1" fill={color} opacity="0.8" />
        <rect x="38" y="18" width="6" height="24" rx="1" fill={color} opacity="0.7">
          <animate attributeName="height" values="24;28;24" dur="2s" repeatCount="indefinite" />
        </rect>
      </svg>
    ),
    wallet: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <rect x="6" y="12" width="36" height="26" rx="3" fill={color} opacity="0.2" />
        <rect x="6" y="12" width="36" height="26" rx="3" stroke={color} strokeWidth="2" fill="none" />
        <rect x="32" y="20" width="10" height="10" rx="2" fill={color} opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
        </rect>
        <circle cx="37" cy="25" r="2" fill="#fff" opacity="0.8" />
        <path d="M12 18H28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
    trading: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <path d="M8 30L16 20L24 26L32 14L40 22" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="d" values="M8 30L16 20L24 26L32 14L40 22;M8 28L16 24L24 18L32 26L40 16;M8 30L16 20L24 26L32 14L40 22" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M32 14L40 22L32 22L32 14Z" fill={color} opacity="0.6" />
        <circle cx="40" cy="22" r="3" fill={color}>
          <animate attributeName="cy" values="22;16;22" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    staking: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="2" fill="none" opacity="0.3" />
        <circle cx="24" cy="24" r="10" fill={color} opacity="0.2">
          <animate attributeName="r" values="10;12;10" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M24 14V24L30 20" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="24" cy="24" r="3" fill={color} />
      </svg>
    ),
    security: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <path d="M24 6L8 14V24C8 32 16 40 24 42C32 40 40 32 40 24V14L24 6Z" fill={color} opacity="0.2" />
        <path d="M24 6L8 14V24C8 32 16 40 24 42C32 40 40 32 40 24V14L24 6Z" stroke={color} strokeWidth="2" fill="none" />
        <path d="M18 24L22 28L30 20" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <animate attributeName="stroke-dasharray" values="0,100;100,0" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    ),
    defi: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <circle cx="14" cy="24" r="8" fill={color} opacity="0.3" />
        <circle cx="34" cy="24" r="8" fill={color} opacity="0.3" />
        <circle cx="24" cy="14" r="8" fill={color} opacity="0.3" />
        <path d="M20 18L14 22M28 18L34 22M24 22V28" stroke={color} strokeWidth="2.5" strokeLinecap="round">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="14" cy="24" r="4" fill={color} />
        <circle cx="34" cy="24" r="4" fill={color} />
        <circle cx="24" cy="14" r="4" fill={color} />
      </svg>
    ),
    community: ({ color = 'currentColor' }) => (
      <svg viewBox="0 0 48 48" fill="none" className="service-svg-icon">
        <circle cx="24" cy="18" r="6" fill={color} opacity="0.6" />
        <circle cx="12" cy="30" r="5" fill={color} opacity="0.4" />
        <circle cx="36" cy="30" r="5" fill={color} opacity="0.4" />
        <path d="M24 24C24 24 18 28 12 35M24 24C24 24 30 28 36 35" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    )
  };

  // Map module names to icons
  const getServiceIcon = (module) => {
    const icon = module.icon || '';
    
    // Map emoji to SVG icons (only these emojis will show animated SVG)
    const emojiToSvg = {
      '📊': 'dashboard',
      '💱': 'otc',
      '🔄': 'p2p',
      '🎯': 'predictions',
      '🔍': 'parsing',
      '📈': 'sentiment',
      '🚀': 'earlyland',
      '🖼️': 'nft',
      '🖼': 'nft',
    };
    
    // If emoji has corresponding SVG, use it
    if (icon && emojiToSvg[icon] && ServiceIcons[emojiToSvg[icon]]) {
      return { type: 'svg', component: ServiceIcons[emojiToSvg[icon]] };
    }
    
    // If emoji is custom (💎, 🔐, ⚡, 🌐, etc.), show emoji directly
    if (icon && icon.length > 0) {
      return { type: 'emoji', icon: icon };
    }
    
    // Fallback: try to determine by service name
    const name = (module.name_en || module.name || '').toLowerCase();
    if (name.includes('dashboard')) return { type: 'svg', component: ServiceIcons.dashboard };
    if (name.includes('otc')) return { type: 'svg', component: ServiceIcons.otc };
    if (name.includes('p2p')) return { type: 'svg', component: ServiceIcons.p2p };
    if (name.includes('prediction')) return { type: 'svg', component: ServiceIcons.predictions };
    if (name.includes('parsing')) return { type: 'svg', component: ServiceIcons.parsing };
    if (name.includes('sentiment')) return { type: 'svg', component: ServiceIcons.sentiment };
    if (name.includes('early') || name.includes('land')) return { type: 'svg', component: ServiceIcons.earlyland };
    if (name.includes('nft')) return { type: 'svg', component: ServiceIcons.nft };
    
    // Default
    return { type: 'svg', component: ServiceIcons.dashboard };
  };

  const MiniChart = ({ data, color = '#10b981' }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <svg viewBox="0 0 100 40" className="mini-chart-svg">
          <line x1="0" y1="20" x2="100" y2="20" stroke={color} strokeWidth="1" opacity="0.3" />
        </svg>
      );
    }
    
    return (
      <svg viewBox="0 0 100 40" className="mini-chart-svg">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${40 - data[0] * 0.4} ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100} ${40 - d * 0.4}`).join(' ')} L 100 40 L 0 40 Z`}
          fill={`url(#gradient-${color})`}
        />
        <path
          d={`M 0 ${40 - data[0] * 0.4} ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100} ${40 - d * 0.4}`).join(' ')}`}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <section id="platform" className="py-20 bg-gradient-to-b from-gray-50 to-white" data-testid="platform-overview">
      <div className="max-w-7xl mx-auto px-6">
        {/* Two Column Layout */}
        <div className="platform-layout">
          
          {/* LEFT COLUMN - Description */}
          <div className="platform-description">
            <span className="platform-badge">{settings.section_badge_en || settings.section_badge || defaults.section_badge}</span>
            <h2 className="platform-title">
              {settings.section_title_en || settings.section_title || defaults.section_title}
            </h2>
            <p className="platform-intro">
              {settings.section_intro_en || settings.section_intro || defaults.section_intro}
            </p>

            {/* Numbered Services List */}
            <div className="services-list">
              {services.map((service, i) => (
                <div key={i} className="service-item">
                  <span className="service-num">{service.num}</span>
                  <div className="service-content">
                    <h3 className="service-title">{service.title_en || service.title}</h3>
                    <p className="service-desc">{service.description_en || service.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - Dashboard Analytics */}
          <div className="platform-dashboard">
            {/* Practice/Platform Info Header */}
            <div className="dashboard-header">
              <div className="dashboard-brand">
                <img 
                  src="/logo.svg" 
                  alt="FOMO" 
                  className="h-12 w-auto"
                  style={{ maxHeight: '48px' }}
                />
              </div>
              <div className="dashboard-meta">
                <span className="meta-item">👥 {settings.community?.value || '45.6K'}</span>
                <span className="meta-item">📊 {settings.visits?.value || '25'}</span>
              </div>
            </div>

            {/* Navigation Sidebar Mini */}
            <div className="dashboard-nav-mini">
              <button 
                className="nav-mini-item active"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </button>
              <button 
                className="nav-mini-item"
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                OTC
              </button>
              <button 
                className="nav-mini-item"
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Arena
              </button>
              <button 
                className="nav-mini-item"
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Influence
              </button>
              <button 
                className="nav-mini-item"
                disabled
                style={{ opacity: 0.5, cursor: 'not-allowed' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                EarlyLand
              </button>
            </div>

            {/* Stats Cards Grid */}
            <div className="stats-cards-grid">
              {/* Community Card */}
              <div className="stat-card">
                <span className="stat-label">{platformStats.community.label_en || platformStats.community.label}</span>
                <div className="stat-value-row">
                  <span className="stat-value">{platformStats.community.value}</span>
                  <span className="stat-change positive">{platformStats.community.change}</span>
                </div>
                <div className="stat-chart">
                  <MiniChart data={platformStats.community.trend} color="#10b981" />
                </div>
                <span className="stat-period">vs last month</span>
              </div>

              {/* Visits Card */}
              <div className="stat-card">
                <span className="stat-label">{platformStats.visits.label_en || platformStats.visits.label}</span>
                <div className="stat-value-row">
                  <span className="stat-value">{platformStats.visits.value}</span>
                  <span className="stat-change positive">{platformStats.visits.change}</span>
                </div>
                <div className="stat-chart">
                  <MiniChart data={platformStats.visits.trend} color="#3b82f6" />
                </div>
                <span className="stat-period">vs last month</span>
              </div>

              {/* Projects Card */}
              <div className="stat-card">
                <span className="stat-label">{platformStats.projects.label_en || platformStats.projects.label}</span>
                <div className="stat-value-row">
                  <span className="stat-value">{platformStats.projects.value}</span>
                  <span className="stat-change positive">{platformStats.projects.change}</span>
                </div>
                <div className="stat-chart">
                  <MiniChart data={platformStats.projects.trend} color="#8b5cf6" />
                </div>
                <span className="stat-period">tracked tokens</span>
              </div>

              {/* Red Flags Card */}
              <div className="stat-card">
                <span className="stat-label">{platformStats.alerts.label_en || platformStats.alerts.label}</span>
                <div className="stat-value-row">
                  <span className="stat-value">{platformStats.alerts.value}</span>
                  <span className="stat-change negative">{platformStats.alerts.change}</span>
                </div>
                <div className="stat-chart">
                  <MiniChart data={platformStats.alerts.trend} color="#ef4444" />
                </div>
                <span className="stat-period">detected</span>
              </div>
            </div>

            {/* Service Modules Grid */}
            <div className="modules-section">
              <span className="modules-title">{language === 'ru' ? 'Наши сервисы' : 'Our Services'}</span>
              <div className="modules-grid">
                {serviceModules.map((module, i) => {
                  const iconResult = getServiceIcon(module);
                  const moduleColor = {
                    emerald: '#10b981',
                    blue: '#3b82f6',
                    purple: '#8b5cf6',
                    orange: '#f97316',
                    pink: '#ec4899',
                    cyan: '#06b6d4',
                    green: '#22c55e',
                    violet: '#7c3aed'
                  }[module.color] || '#10b981';
                  
                  return (
                    <div key={i} className={`module-card module-${module.color}`}>
                      <div className="module-icon-svg">
                        {iconResult.type === 'svg' && iconResult.component ? (
                          <iconResult.component color={moduleColor} />
                        ) : (
                          <span style={{ fontSize: '32px', lineHeight: '1' }}>{iconResult.icon || module.icon || '📊'}</span>
                        )}
                      </div>
                      <div className="module-info">
                        <span className="module-name">{module.name_en || module.name}</span>
                        <span className="module-count">{module.count}</span>
                        <span className="module-label">{module.label_en || module.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Stats Row */}
            <div className="bottom-stats">
              {bottomStats.map((stat, index) => (
                <div key={index} className="bottom-stat">
                  <span className="bottom-stat-value">{stat.value}</span>
                  <span className="bottom-stat-label">{stat.label_en || stat.label}</span>
                  <span className="bottom-stat-desc">{stat.description_en || stat.description}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};



export default PlatformOverview;
