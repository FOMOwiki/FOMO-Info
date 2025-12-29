import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const PartnersSection = ({ partnersData }) => {
  const [activeCategory, setActiveCategory] = useState('partners');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8; // 2 ряда по 4 карточки
  const { language } = useLanguage();
  const t = useTranslation();

  const partners = partnersData || [];

  const categories = [
    { key: 'partners', label: t('partners.tabs.partners') },
    { key: 'media', label: t('partners.tabs.media') },
    { key: 'portfolio', label: t('partners.tabs.portfolio') },
  ];

  const filteredPartners = partners
    .filter(p => p.category === activeCategory)
    .filter(p => 
      searchQuery === '' || 
      getLangFieldWithContext(p, 'name', language).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getLangFieldWithContext(p, 'description', language).toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Pagination logic
  const totalPages = Math.ceil(filteredPartners.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPartners = filteredPartners.slice(startIndex, endIndex);

  const categoryCount = (cat) => partners.filter(p => p.category === cat).length;
  const totalCount = partners.length;

  // Reset to page 1 when category or search changes
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Marquee text
  const marqueeText = "Ecosystem · Partners · Media · Portfolio · Integrations · Network · ";

  return (
    <section id="partners" className="partners-section-dark" data-testid="partners-section">
      {/* Marquee Header */}
      <div className="partners-marquee-wrapper">
        <div className="partners-marquee">
          <div className="marquee-track">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="marquee-text">{marqueeText}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="partners-content">
        {/* Category Tabs */}
        <div className="partners-tabs-row">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`partner-tab-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.key)}
            >
              {cat.label}
              <span className="tab-count-badge">{categoryCount(cat.key)}</span>
            </button>
          ))}
        </div>

        {/* Full Width Search */}
        <div className="partners-search-full">
          <svg className="search-icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t('partners.search')}
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input-full"
          />
        </div>

        {/* Partners Grid */}
        <div className="partners-grid-new">
          {paginatedPartners.length === 0 ? (
            <div className="no-partners-msg">
              <p>{t('partners.noResults')}</p>
            </div>
          ) : (
            paginatedPartners.map((partner) => (
              <a
                key={partner.id}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card-new"
              >
                <div className="partner-card-content">
                  <div className="partner-logo-wrapper">
                    <div className="partner-logo-box">
                      {partner.image_url ? (
                        <img src={partner.image_url} alt={getLangFieldWithContext(partner, 'name', language)} className="partner-logo-img" />
                      ) : (
                        <span className="partner-initial">{getLangFieldWithContext(partner, 'name', language).charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  <div className="partner-info-wrapper">
                    <div className="partner-title-row">
                      <h3 className="partner-name-new">{getLangFieldWithContext(partner, 'name', language)}</h3>
                      <svg className="partner-arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                    <p className="partner-desc-new">{getLangFieldWithContext(partner, 'description', language)}</p>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredPartners.length > ITEMS_PER_PAGE && (
          <div className="partners-pagination">
            <button 
              className="pagination-arrow"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button 
              className="pagination-arrow"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};



export default PartnersSection;
