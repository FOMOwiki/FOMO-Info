import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';
import { AnimatedIcon } from './AnimatedIcons';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const AboutSection = ({ whitepaperUrl }) => {
  const [aboutSettings, setAboutSettings] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchAboutSettings = async () => {
      try {
        const response = await axios.get(`${API}/about-settings`);
        setAboutSettings(response.data);
      } catch (error) {
        console.error('Error fetching about settings:', error);
      }
    };
    fetchAboutSettings();
  }, []);

  // Use settings from API or fallback to hardcoded
  const badge = aboutSettings?.badge || "About Us";
  const title = aboutSettings?.title || "What is";
  const titleHighlight = aboutSettings?.title_highlight || "FOMO";
  const subtitle = aboutSettings?.subtitle || "A cutting-edge platform reshaping how users interact with the crypto world";
  const description = aboutSettings?.description || "FOMO is a cutting-edge platform built to reshape the way users interact with the cryptoworld. Our goal is to create a single, comprehensive ecosystem that combines";
  const socialEngagement = aboutSettings?.social_engagement || "social engagement";
  const dataAnalytics = aboutSettings?.data_analytics || "data analytics";
  const seamlessAccess = aboutSettings?.seamless_access || "seamless access";
  const descriptionEnd = aboutSettings?.description_end || "to crypto projects, NFTs, funds, and more.";
  const features = aboutSettings?.features || [
    { icon: "diamond", title: "Community-Driven", description: "Every user influences the project through voting and social engagement.", color: "emerald" },
    { icon: "clock", title: "24/7 Support", description: "Our support never stops. We are here offering guidance every step.", color: "teal" },
    { icon: "lightning", title: "Fast & Efficient", description: "Launch your project quickly with FOMO tools and support.", color: "cyan" },
    { icon: "shield", title: "Secure & Reliable", description: "All transactions via secure smart contracts for max protection.", color: "violet" },
  ];
  const whitepaperButtonText = aboutSettings?.whitepaper_button_text || "Whitepaper";
  
  const content = {
    en: {
      badge: 'About Us',
      title: 'What is',
      titleHighlight: 'FOMO',
      subtitle: 'A cutting-edge platform reshaping how users interact with the crypto world',
      description: 'FOMO is a cutting-edge platform built to reshape the way users interact with the cryptoworld. Our goal is to create a single, comprehensive ecosystem that combines',
      socialEngagement: 'social engagement',
      dataAnalytics: 'data analytics',
      seamlessAccess: 'seamless access',
      descriptionEnd: 'to crypto projects, NFTs, funds, and more.',
      features: [
        { icon: 'diamond', title: 'Community-Driven', description: 'Every user influences the project through voting and social engagement.', color: 'emerald' },
        { icon: 'clock', title: '24/7 Support', description: 'Our support never stops. We are here offering guidance every step.', color: 'teal' },
        { icon: 'lightning', title: 'Fast & Efficient', description: 'Launch your project quickly with FOMO tools and support.', color: 'cyan' },
        { icon: 'shield', title: 'Secure & Reliable', description: 'All transactions via secure smart contracts for max protection.', color: 'violet' },
      ]
    },
    ru: {
      badge: 'About Us',
      title: 'What is',
      titleHighlight: 'FOMO',
      subtitle: 'A cutting-edge platform reshaping how users interact with the crypto world',
      description: 'FOMO is a cutting-edge platform built to reshape the way users interact with the cryptoworld. Our goal is to create a single, comprehensive ecosystem that combines',
      socialEngagement: 'social engagement',
      dataAnalytics: 'data analytics',
      seamlessAccess: 'seamless access',
      descriptionEnd: 'to crypto projects, NFTs, funds, and more.',
      features: [
        { icon: 'diamond', title: 'Community-Driven', description: 'Every user influences the project through voting and social engagement.', color: 'emerald' },
        { icon: 'clock', title: '24/7 Support', description: 'Our support never stops. We are here offering guidance every step.', color: 'teal' },
        { icon: 'lightning', title: 'Fast & Efficient', description: 'Launch your project quickly with FOMO tools and support.', color: 'cyan' },
        { icon: 'shield', title: 'Secure & Reliable', description: 'All transactions via secure smart contracts for max protection.', color: 'violet' },
      ]
    }
  };

  const t = content[language];
  
  return (
    <section id="about" className="py-16 bg-white" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm font-medium mb-4">{badge}</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{title} <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{titleHighlight}</span>?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {description} <strong className="text-gray-900">{socialEngagement}</strong>, 
              <strong className="text-gray-900"> {dataAnalytics}</strong>, and <strong className="text-gray-900">{seamlessAccess}</strong> {descriptionEnd}
            </p>
            <a 
              href={whitepaperUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="whitepaper-link inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="whitepaper-icon w-6 h-6" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2">
                  <animate attributeName="stroke-dasharray" values="0,100;100,0" dur="1.5s" repeatCount="1" fill="freeze" />
                </rect>
                <path d="M8 6h8M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <animate attributeName="opacity" values="0;1" dur="0.8s" begin="0.5s" fill="freeze" />
                </path>
                <circle cx="16" cy="18" r="3" fill="#10b981">
                  <animate attributeName="r" values="0;3" dur="0.3s" begin="1s" fill="freeze" />
                </circle>
                <path d="M15 18l1 1 2-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <animate attributeName="opacity" values="0;1" dur="0.2s" begin="1.2s" fill="freeze" />
                </path>
              </svg>
              <span>{whitepaperButtonText}</span>
              <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="feature-card-animated" data-testid={`feature-card-${index}`}>
                <div className={`feature-icon-animated ${feature.color}`}>
                  <AnimatedIcon type={feature.icon} />
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};



export default AboutSection;
