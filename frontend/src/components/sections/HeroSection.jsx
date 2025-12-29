import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';
import InviteModal from '../InviteModal';
import InteractiveChart from './InteractiveChart';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HeroSection = ({ heroSettings }) => {
  const [cryptoIndices, setCryptoIndices] = useState({
    fearGreed: 65,
    altcoinSeason: 42
  });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const t = useTranslation();
  const { language } = useLanguage();
  
  // Fetch crypto indices
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(`${API}/crypto-market-data`);
        if (response.data.indices) {
          setCryptoIndices({
            fearGreed: response.data.indices[0].value,
            altcoinSeason: response.data.indices[1].value
          });
        }
      } catch (error) {
        console.error('Error fetching crypto indices:', error);
      }
    };
    
    fetchCryptoData();
    // Update every 60 seconds
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Get hero buttons from settings or use defaults
  const heroButtons = heroSettings?.action_buttons?.map((btn, index) => ({
    id: String(index + 1),
    label: btn.text,
    url: btn.link,
    style: btn.primary ? 'primary' : 'secondary',
    useInviteModal: btn.use_invite_modal || false  // New flag for invite modal
  })) || [
    { id: '1', label: 'Explore Platform', url: '#', style: 'primary', useInviteModal: false },
    { id: '2', label: 'Buy NFT', url: '#', style: 'secondary', useInviteModal: false }
  ];
  
  // Get stats from settings or use defaults
  const stats = heroSettings?.stats || [
    { value: '10K+', label: 'Active Users' },
    { value: '$50M+', label: 'Trading Volume' },
    { value: '666', label: 'NFT Collection' },
  ];
  
  // Get text content from heroSettings or fallback to translations
  const badge = heroSettings?.badge || t('hero.badge');
  const titleLine1 = heroSettings?.title_line1 || t('hero.titleLine1');
  const titleLine2 = heroSettings?.title_line2 || t('hero.titleLine2');
  const subtitle = heroSettings?.subtitle || t('hero.subtitle');
  
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden" data-testid="hero-section">
      <div className="hero-background">
        <div className="hero-blob blob-1"></div>
        <div className="hero-blob blob-2"></div>
        <div className="hero-blob blob-3"></div>
        <div className="hero-grid"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              {badge}
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6" data-testid="hero-title">
              {titleLine1}
              <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">{titleLine2}</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-xl">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              {heroButtons.map((button) => {
                const label = button.label;
                const isPrimary = button.style === 'primary';
                
                // If button uses invite modal, render as button instead of link
                if (button.useInviteModal) {
                  return (
                    <button 
                      key={button.id}
                      onClick={() => setShowInviteModal(true)}
                      className={isPrimary 
                        ? "group px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 transition-all flex items-center gap-2"
                        : "px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all inline-flex items-center gap-2"
                      }
                    >
                      {label}
                      {isPrimary && (
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      )}
                    </button>
                  );
                }
                
                return (
                  <a 
                    key={button.id}
                    href={button.url}
                    target={button.url.startsWith('http') ? '_blank' : '_self'}
                    rel={button.url.startsWith('http') ? 'noopener noreferrer' : ''}
                    className={isPrimary 
                      ? "group px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-gray-800 transition-all flex items-center gap-2"
                      : "px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all inline-flex items-center gap-2"
                    }
                  >
                    {label}
                    {isPrimary && (
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Invite Modal */}
            <InviteModal 
              isOpen={showInviteModal} 
              onClose={() => setShowInviteModal(false)}
              redirectUrl={heroSettings?.invite_redirect_url || '/platform'}
            />

            <div className="flex flex-wrap gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div>
                    <span className="block text-3xl font-bold text-gray-900">{stat.value}</span>
                    <span className="text-gray-500 text-sm">{stat.label || stat.label_en}</span>
                  </div>
                  {i < stats.length - 1 && <div className="w-px h-12 bg-gray-200 ml-4"></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <InteractiveChart />
            <div className="floating-card top-card">
              <div className="card-icon positive">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <div><span className="text-gray-500 text-xs">Fear & Greed</span><span className="block text-gray-900 font-bold">{cryptoIndices.fearGreed}</span></div>
            </div>
            <div className="floating-card bottom-card">
              <div className="card-icon purple">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div><span className="text-gray-500 text-xs">Altcoin Season</span><span className="block text-gray-900 font-bold">{cryptoIndices.altcoinSeason}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



export default HeroSection;
