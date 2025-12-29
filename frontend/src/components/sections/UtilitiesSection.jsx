import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const UtilitiesSection = () => {
  const { language } = useLanguage();
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [utilities, setUtilities] = useState([]);
  const [sectionSettings, setSectionSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);

  // Convert Tailwind gradient class to CSS gradient
  const tailwindToCss = (gradientClass) => {
    if (!gradientClass) return 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
    
    const colorMap = {
      'emerald-50': '#ecfdf5', 'emerald-100': '#d1fae5', 'emerald-500': '#10b981',
      'teal-50': '#f0fdfa', 'teal-100': '#ccfbf1', 'teal-500': '#14b8a6',
      'cyan-50': '#ecfeff', 'cyan-100': '#cffafe', 'cyan-500': '#06b6d4',
      'blue-50': '#eff6ff', 'blue-100': '#dbeafe', 'blue-500': '#3b82f6',
      'indigo-50': '#eef2ff', 'indigo-100': '#e0e7ff', 'indigo-500': '#6366f1',
      'violet-50': '#f5f3ff', 'violet-100': '#ede9fe', 'violet-500': '#8b5cf6',
      'purple-50': '#faf5ff', 'purple-100': '#f3e8ff', 'purple-500': '#a855f7',
      'pink-50': '#fdf2f8', 'pink-100': '#fce7f3', 'pink-500': '#ec4899',
      'rose-50': '#fff1f2', 'rose-100': '#ffe4e6', 'rose-500': '#f43f5e',
      'amber-50': '#fffbeb', 'amber-100': '#fef3c7', 'amber-500': '#f59e0b',
      'orange-50': '#fff7ed', 'orange-100': '#ffedd5', 'orange-500': '#f97316',
      'yellow-50': '#fefce8', 'yellow-100': '#fef9c3', 'yellow-500': '#eab308',
      'green-50': '#f0fdf4', 'green-100': '#dcfce7', 'green-500': '#22c55e',
      'red-50': '#fef2f2', 'red-100': '#fee2e2', 'red-500': '#ef4444',
      'gray-50': '#f9fafb', 'gray-100': '#f3f4f6', 'gray-200': '#e5e7eb', 
      'gray-500': '#6b7280', 'gray-700': '#374151', 'gray-900': '#111827'
    };
    
    // Parse "from-color-shade to-color-shade" format
    const fromMatch = gradientClass.match(/from-([a-z]+-\d+)/);
    const toMatch = gradientClass.match(/to-([a-z]+-\d+)/);
    
    const fromColor = fromMatch ? colorMap[fromMatch[1]] || '#f3f4f6' : '#f3f4f6';
    const toColor = toMatch ? colorMap[toMatch[1]] || '#e5e7eb' : '#e5e7eb';
    
    return `linear-gradient(135deg, ${fromColor} 0%, ${toColor} 100%)`;
  };

  // Icon mapping based on icon_type from API
  const getIcon = (iconType, customIconUrl) => {
    if (iconType === 'custom' && customIconUrl) {
      return <img src={customIconUrl} alt="" className="w-8 h-8 object-contain" />;
    }
    
    const icons = {
      chart: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      arena: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      exchange: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      lightning: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      users: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      rocket: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      ),
      shield: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      globe: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      star: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    };
    return icons[iconType] || icons.chart;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [utilitiesRes, settingsRes] = await Promise.all([
          axios.get(`${API}/utilities`),
          axios.get(`${API}/utilities-settings`)
        ]);
        
        const activeUtilities = utilitiesRes.data
          .filter(u => u.is_active)
          .map(u => ({
            ...u,
            icon: getIcon(u.icon_type, u.custom_icon_url),
            shortDescription: u.short_description_en || u.short_description,
            fullDescription: u.full_description_en || u.full_description,
            stats: u.stats.map(s => ({
              value: s.value,
              label: s.label_en || s.label
            })),
            bgGradient: u.bg_gradient,
            bgGradientStyle: tailwindToCss(u.bg_gradient),
            gradientStyle: tailwindToCss(u.gradient),
            buttonGradient: u.button_gradient || u.gradient,
            buttonGradientStyle: tailwindToCss(u.button_gradient || u.gradient),
            buttonText: u.button_text_en || 'Participate',
            buttonLink: u.button_link || '#'
          }));
        
        setUtilities(activeUtilities);
        setSectionSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching utilities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFlip = (id) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Default settings if not loaded
  const settings = sectionSettings || {
    badge: 'Our Utilities',
    title: 'Powerful',
    title_highlight: 'Crypto Trading Tools',
    subtitle: 'Comprehensive ecosystem of tools for earning in crypto industry',
    click_hint: 'Click for details',
    click_back_hint: 'Click to go back',
    features_title: 'Features:',
    details_label: 'Details'
  };

  if (loading) {
    return (
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (utilities.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
      {/* Section header with animation */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-purple-50 border border-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            {settings.badge || settings.badge_en}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {settings.title || settings.title_en} 
            <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-500 bg-clip-text text-transparent">
              {settings.title_highlight || settings.title_highlight_en}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {settings.subtitle || settings.subtitle_en}
          </p>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div className="utilities-slider-container">
        <button 
          onClick={() => scroll('left')} 
          className="utilities-nav-button utilities-nav-left"
          aria-label="Scroll left"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="utilities-slider-scroll" ref={scrollContainerRef}>
          <div className="utilities-slider-track">
            {utilities.map((utility, index) => {
              const isFlipped = flippedCards.has(utility.id);
              
              return (
                <div 
                  key={utility.id}
                  className={`utility-card ${isFlipped ? 'flipped' : ''}`}
                  onClick={() => toggleFlip(utility.id)}
                >
                  <div className="utility-card-inner">
                    {/* Front Side */}
                    <div className="utility-card-front" style={{ background: utility.bgGradientStyle }}>
                      <div className="p-6 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-2xl text-white" style={{ background: utility.gradientStyle }}>
                            {utility.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{utility.title}</h3>
                            <p className="text-sm text-gray-500">{utility.subtitle}</p>
                          </div>
                        </div>

                        {/* Short description */}
                        <p className="text-gray-700 leading-relaxed mb-4 text-sm flex-grow">
                          {utility.shortDescription}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white/80 rounded-xl">
                          {utility.stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                              <div className="text-base md:text-lg font-bold mb-1.5" style={{ backgroundImage: utility.gradientStyle, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                                {stat.value}
                              </div>
                              <div className="text-[0.7rem] md:text-xs text-gray-500 leading-snug">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <a 
                          href={utility.buttonLink || `#${utility.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="block w-full py-3 rounded-xl text-white text-center font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm"
                          style={{ background: utility.buttonGradientStyle }}
                        >
                          {utility.buttonText}
                        </a>

                        {/* Click hint */}
                        <p className="text-xs text-gray-400 text-center mt-3">
                          {settings.click_hint || settings.click_hint_en}
                        </p>
                      </div>
                    </div>

                    {/* Back Side */}
                    <div className="utility-card-back" style={{ background: utility.bgGradientStyle }}>
                      <div className="p-6 h-full flex flex-col">
                        {/* Back header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl text-white" style={{ background: utility.gradientStyle }}>
                            {utility.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{utility.title}</h3>
                            <p className="text-xs text-gray-500">{settings.details_label || settings.details_label_en}</p>
                          </div>
                        </div>

                        {/* Full description */}
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                          <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                            {utility.fullDescription}
                          </p>

                          {/* Features */}
                          <h4 className="font-semibold text-gray-900 mb-2 text-sm">{settings.features_title || settings.features_title_en}</h4>
                          <div className="space-y-2">
                            {utility.features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="w-4 h-4 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: utility.gradientStyle }}>
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-xs text-gray-700">
                                  {feature.en || feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <a 
                          href={utility.buttonLink || `#${utility.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="block w-full py-3 rounded-xl text-white text-center font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm mt-4"
                          style={{ background: utility.buttonGradientStyle }}
                        >
                          {utility.buttonText}
                        </a>

                        {/* Click hint */}
                        <p className="text-xs text-gray-400 text-center mt-2">
                          {settings.click_back_hint || settings.click_back_hint_en}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={() => scroll('right')} 
          className="utilities-nav-button utilities-nav-right"
          aria-label="Scroll right"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};






export default UtilitiesSection;
