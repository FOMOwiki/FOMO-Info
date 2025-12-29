import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const FAQSection = ({ faqData }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = faqData || [];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (faqs.length === 0) return null;

  return (
    <section className="faq-section" data-testid="faq-section" style={{ background: 'white', padding: '120px 0 100px' }}>
      <div className="faq-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <h2 className="faq-title" style={{ fontSize: '96px', fontWeight: '700', textAlign: 'center', color: '#047857', margin: '0 0 80px 0', letterSpacing: '-0.03em', lineHeight: '1' }}>FAQ</h2>
        <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {faqs.map((faq, index) => (
            <div 
              key={faq.id || index} 
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
              style={{
                background: openIndex === index ? '#a7f3d0' : '#d1fae5',
                borderRadius: '24px',
                padding: '32px 36px',
                cursor: 'pointer',
                border: openIndex === index ? '2px solid #047857' : '2px solid transparent',
                minHeight: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="faq-question-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                <h3 className="faq-question" style={{ fontSize: '20px', fontWeight: '600', color: '#047857', margin: '0', lineHeight: '1.4', flex: '1' }}>{faq.question}</h3>
                <span className="faq-icon" style={{ fontSize: '32px', fontWeight: '300', color: '#047857', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: '1' }}>{openIndex === index ? '−' : '+'}</span>
              </div>
              {openIndex === index && (
                <div className="faq-answer" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid rgba(4, 120, 87, 0.2)', fontSize: '16px', lineHeight: '1.7', color: '#065f46' }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};




export default FAQSection;
