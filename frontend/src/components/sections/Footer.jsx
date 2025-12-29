import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const Footer = ({ footerSettings }) => {
  const { language } = useLanguage();
  const settings = footerSettings || {};
  
  // State for legal modal
  const [legalModal, setLegalModal] = useState({ isOpen: false, title: '', content: '' });
  
  // Get legal pages from settings or use defaults
  const legalPages = settings.legal_pages || [
    { id: 'privacy', title: 'Privacy Policy', content: '' },
    { id: 'terms', title: 'Terms of Service', content: '' },
    { id: 'disclaimer', title: 'Disclaimer', content: '' }
  ];
  
  // Open legal modal
  const openLegalModal = (pageId) => {
    const page = legalPages.find(p => p.id === pageId);
    if (page && page.content) {
      setLegalModal({ isOpen: true, title: page.title, content: page.content });
    }
  };
  
  // Translations for footer
  const translations = {
    en: {
      getStarted: "GET STARTED",
      launchPlatform: "Launch Platform",
      company: "COMPANY",
      about: "About",
      careers: "Careers",
      platform: "PLATFORM",
      dashboard: "Dashboard",
      analytics: "Analytics",
      portfolio: "Portfolio",
      trading: "Trading",
      resources: "RESOURCES",
      documentation: "Documentation",
      apiReference: "API Reference",
      support: "Support",
      other: "OTHER",
      insights: "Insights",
      news: "News",
      address: "ADDRESS",
      allRightsReserved: "All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      disclaimer: "Disclaimer"
    },
    ru: {
      getStarted: "НАЧАТЬ",
      launchPlatform: "Запустить платформу",
      company: "КОМПАНИЯ",
      about: "О нас",
      careers: "Карьера",
      platform: "ПЛАТФОРМА",
      dashboard: "Панель",
      analytics: "Аналитика",
      portfolio: "Портфель",
      trading: "Трейдинг",
      resources: "РЕСУРСЫ",
      documentation: "Документация",
      apiReference: "API",
      support: "Поддержка",
      other: "ДРУГОЕ",
      insights: "Инсайты",
      news: "Новости",
      address: "АДРЕС",
      allRightsReserved: "Все права защищены.",
      privacyPolicy: "Политика конфиденциальности",
      termsOfService: "Условия использования",
      disclaimer: "Отказ от ответственности"
    }
  };

  const t = translations[language];
  
  // Use navigation sections from settings or defaults with translations
  const navSections = settings.navigation_sections || [
    {
      title: t.company,
      links: [
        { name: t.about, url: "#about" },
        { name: t.careers, url: "#careers" }
      ]
    },
    {
      title: t.platform,
      links: [
        { name: t.dashboard, url: "#platform" },
        { name: t.analytics, url: "#analytics" },
        { name: t.portfolio, url: "#portfolio" },
        { name: t.trading, url: "#trading" }
      ]
    },
    {
      title: t.resources,
      links: [
        { name: t.documentation, url: "#docs" },
        { name: t.apiReference, url: "#api" },
        { name: t.support, url: "#support" }
      ]
    },
    {
      title: t.other,
      links: [
        { name: t.insights, url: "#insights" },
        { name: t.news, url: "#news" }
      ]
    }
  ];

  // Social media icons map
  const socialIcons = {
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    telegram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    )
  };

  return (
    <footer className="footer-clearstreet" data-testid="footer">
      {/* Main Footer Content */}
      <div className="footer-container">
        <div className="footer-grid">
          {/* GET STARTED Section */}
          <div className="footer-column">
            <h3 className="footer-column-title">{t.getStarted}</h3>
            <a 
              href={settings.cta_button_url || '#'} 
              className="footer-login-btn"
              target={settings.cta_button_url && settings.cta_button_url !== '#' ? '_blank' : '_self'}
              rel={settings.cta_button_url && settings.cta_button_url !== '#' ? 'noopener noreferrer' : undefined}
            >
              {settings.cta_button_text || t.launchPlatform + ' →'}
            </a>
          </div>

          {/* Navigation Sections from Settings */}
          {navSections.map((section, idx) => (
            <div key={idx} className="footer-column">
              <h3 className="footer-column-title">{section.title}</h3>
              <ul className="footer-links">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.url} className="footer-link">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ADDRESS Section */}
          <div className="footer-column">
            <h3 className="footer-column-title">{t.address}</h3>
            <address className="footer-address">
              <p>{settings.company_name || 'FOMO'}</p>
              {settings.company_address ? (
                settings.company_address.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))
              ) : (
                <>
                  <p>4 World Trade Center</p>
                  <p>150 Greenwich St Floor 45</p>
                  <p>New York, NY 10007</p>
                </>
              )}
              <p className="footer-phone">{settings.company_phone || '(000) 000-0000'}</p>
              {settings.company_email && (
                <p className="footer-email">
                  <a href={`mailto:${settings.company_email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {settings.company_email}
                  </a>
                </p>
              )}
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          {/* Social Media Icons */}
          <div className="footer-social">
            {(settings.social_media || []).map((social, idx) => (
              <a 
                key={idx} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label={social.platform}
              >
                {socialIcons[social.platform.toLowerCase()] || (
                  <span className="w-5 h-5 flex items-center justify-center">
                    {social.platform.charAt(0).toUpperCase()}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="footer-legal-links">
            <button 
              onClick={() => openLegalModal('privacy')} 
              className="footer-legal-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {t.privacyPolicy}
            </button>
            <button 
              onClick={() => openLegalModal('terms')} 
              className="footer-legal-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {t.termsOfService}
            </button>
            <button 
              onClick={() => openLegalModal('disclaimer')} 
              className="footer-legal-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {t.disclaimer}
            </button>
          </div>

          {/* Made By */}
          {settings.made_by_text && (
            <div className="footer-made-by">
              {settings.made_by_url ? (
                <a href={settings.made_by_url} target="_blank" rel="noopener noreferrer">
                  {settings.made_by_text}
                </a>
              ) : (
                <span>{settings.made_by_text}</span>
              )}
            </div>
          )}
        </div>

        {/* Copyright and Disclaimer */}
        <div className="footer-copyright">
          <p className="footer-copyright-text">
            {settings.copyright_text || `© 2025 FOMO. ${t.allRightsReserved}`}
          </p>
          {settings.legal_disclaimer && (
            <p className="footer-disclaimer">{settings.legal_disclaimer}</p>
          )}
        </div>
      </div>
      
      {/* Legal Page Modal - Light Theme */}
      {legalModal.isOpen && (
        <div 
          className="legal-modal-overlay"
          onClick={() => setLegalModal({ isOpen: false, title: '', content: '' })}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            className="legal-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #e5e7eb',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Modal Header */}
            <div 
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(to right, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.08))'
              }}
            >
              <h2 style={{ 
                margin: 0, 
                color: '#059669', 
                fontSize: '1.5rem', 
                fontWeight: '600' 
              }}>
                {legalModal.title}
              </h2>
              <button
                onClick={() => setLegalModal({ isOpen: false, title: '', content: '' })}
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  color: '#374151',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#e5e7eb'; e.currentTarget.style.color = '#111827'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#374151'; }}
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div 
              style={{
                padding: '24px',
                overflowY: 'auto',
                color: '#374151',
                fontSize: '0.95rem',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                backgroundColor: '#ffffff'
              }}
            >
              {legalModal.content || 'Content not available.'}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};



export default Footer;
