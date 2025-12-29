import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const CommunitySection = ({ communitySettings }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const settings = communitySettings || {
    title_en: "Join the Community",
    description_en: "Connect with web3 founders, developers, and crypto enthusiasts from around the world.",
    socials: [
      { platform: "twitter", url: "https://twitter.com", enabled: true },
      { platform: "telegram", url: "https://t.me", enabled: true },
      { platform: "discord", url: "https://discord.com", enabled: true }
    ],
    subscribe_enabled: true,
    subscribe_title_en: "Stay Updated"
  };

  // Get title with fallback - English only
  const title = settings.title_en || settings.title || "Join the Community";
  const description = settings.description_en || settings.description || "Connect with web3 founders, developers, and crypto enthusiasts from around the world.";
  const subscribeTitle = settings.subscribe_title_en || settings.subscribe_title || "Stay Updated";

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    // TODO: Add actual subscribe logic
    setMessage('✅ Thanks for subscribing!');
    setEmail('');
    setTimeout(() => setMessage(''), 3000);
  };

  const socialIcons = {
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    telegram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    discord: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    )
  };

  // Split title into parts - English only
  const titleParts = title.split('Community');
  const titleBefore = titleParts[0] || 'Join the ';
  const communityWord = 'Community';

  const enabledSocials = (settings.socials || []).filter(s => s.enabled);

  return (
    <section 
      className="community-section" 
      data-testid="community-section"
      style={{
        background: '#f9fafb',
        padding: '80px 0'
      }}
    >
      <div 
        className="community-container"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 40px',
          textAlign: 'center'
        }}
      >
        <h2 
          className="community-title"
          style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 20px 0',
            lineHeight: '1.2'
          }}
        >
          {titleBefore}
          <span 
            className="community-highlight"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {communityWord}
          </span>
        </h2>
        <p 
          className="community-description"
          style={{
            fontSize: '20px',
            color: '#6b7280',
            margin: '0 0 48px 0',
            lineHeight: '1.6'
          }}
        >
          {description}
        </p>

        {/* Social Media Buttons */}
        {enabledSocials.length > 0 && (
          <div 
            className="community-socials" 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '16px', 
              marginBottom: '48px', 
              flexWrap: 'wrap' 
            }}
          >
            {enabledSocials.map((social, idx) => {
              const colors = {
                twitter: { bg: '#1d4ed8', hover: '#1e40af' },
                telegram: { bg: '#0088cc', hover: '#006699' },
                discord: { bg: '#5865f2', hover: '#4752c4' },
                github: { bg: '#24292e', hover: '#1b1f23' }
              };
              const color = colors[social.platform] || { bg: '#6b7280', hover: '#4b5563' };
              
              return (
                <a 
                  key={idx}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`community-social-btn ${social.platform}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 28px',
                    borderRadius: '50px',
                    fontSize: '16px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    background: color.bg,
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {socialIcons[social.platform] || null}
                  {social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                </a>
              );
            })}
          </div>
        )}

        {/* Subscribe Card */}
        {settings.subscribe_enabled && (
          <div 
            className="community-subscribe-card"
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}
          >
            <h3 
              className="community-subscribe-title"
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 24px 0'
              }}
            >
              {subscribeTitle}
            </h3>
            <form 
              onSubmit={handleSubscribe} 
              className="community-subscribe-form"
              style={{
                display: 'flex',
                gap: '12px',
                maxWidth: '500px',
                margin: '0 auto'
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="community-email-input"
                style={{
                  flex: '1',
                  padding: '14px 20px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '50px',
                  outline: 'none'
                }}
                required
              />
              <button 
                type="submit" 
                className="community-subscribe-btn"
                style={{
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                Subscribe
              </button>
            </form>
            {message && (
              <p 
                className="community-message"
                style={{
                  marginTop: '16px',
                  fontSize: '14px',
                  color: '#10b981',
                  fontWeight: '500'
                }}
              >
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};





export default CommunitySection;
