import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const MyProductsSection = ({ cards }) => {
  const { language } = useLanguage();
  
  const content = {
    ru: {
      badge: 'Наша экосистема',
      title1: 'Экосистема',
      title2: 'FOMO',
      subtitle: 'Комплексная платформа для работы с криптовалютами',
      description: 'Мы создаем единую платформу, объединяющую OTC-рынок, P2P-биржу, NFT-маркетплейс, аналитику крипторынка и onchain анализ. Все инструменты для успешной работы в одном месте.'
    },
    en: {
      badge: 'Our Ecosystem',
      title1: 'FOMO',
      title2: 'Ecosystem',
      subtitle: 'Comprehensive platform for cryptocurrency operations',
      description: 'We are building a unified platform combining OTC market, P2P exchange, NFT marketplace, crypto analytics and onchain analysis. All tools for successful work in one place.'
    }
  };
  
  const t = content[language] || content.ru;
  
  return (
    <section id="projects" className="py-16 bg-gray-50" data-testid="projects-section">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-white rounded-full text-gray-600 text-sm font-medium mb-4 shadow-sm">{t.badge}</span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t.title1} <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">{t.title2}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-3">
            {t.subtitle}
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t.description}
          </p>
        </div>

        <div className="mt-10">
          <ProjectDrawer cards={cards} />
        </div>
      </div>
    </section>
  );
};



export default MyProductsSection;
