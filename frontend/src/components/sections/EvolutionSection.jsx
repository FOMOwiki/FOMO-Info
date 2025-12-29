import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from '../../hooks';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;


const EvolutionSection = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('levels');
  const [flippedBadges, setFlippedBadges] = useState(new Set());
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const [levels, setLevels] = useState([]);
  const [badges, setBadges] = useState([]);

  const content = {
    en: {
      badge: 'NFT Journey',
      title: 'User',
      titleHighlight: 'Evolution',
      subtitle: 'Progress through levels and unlock exclusive benefits'
    },
    ru: {
      badge: 'NFT Путешествие',
      title: 'Эволюция',
      titleHighlight: 'Пользователя',
      subtitle: 'Проходите уровни и открывайте эксклюзивные преимущества'
    }
  };

  const t = content[language];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [levelsRes, badgesRes] = await Promise.all([
          axios.get(`${API}/evolution-levels`),
          axios.get(`${API}/evolution-badges`)
        ]);
        setLevels(levelsRes.data);
        setBadges(badgesRes.data);
      } catch (err) {
        console.error('Error fetching evolution data:', err);
      }
    };
    fetchData();
  }, []);

  // SVG Icons for Levels - based on animation_type
  const LevelIcons = {
    stellar: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="32" cy="32" r="28" fill="currentColor" opacity="0.2">
          <animate attributeName="r" values="28;30;28" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M32 8L38 24H54L41 34L47 50L32 40L17 50L23 34L10 24H26L32 8Z" fill="currentColor">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="20s" repeatCount="indefinite" />
        </path>
      </svg>
    ),
    cosmic: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <ellipse cx="32" cy="48" rx="16" ry="4" fill="currentColor" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1s" repeatCount="indefinite" />
        </ellipse>
        <path d="M32 10L38 28H28L32 10Z" fill="currentColor">
          <animate attributeName="d" values="M32 10L38 28H28L32 10Z;M32 8L40 30H26L32 8Z;M32 10L38 28H28L32 10Z" dur="0.5s" repeatCount="indefinite" />
        </path>
        <rect x="26" y="28" width="12" height="16" rx="2" fill="currentColor" />
        <path d="M24 44L20 52H26L24 44Z" fill="#f97316" />
        <path d="M40 44L44 52H38L40 44Z" fill="#f97316" />
        <circle cx="32" cy="22" r="4" fill="#fff" opacity="0.8" />
      </svg>
    ),
    galactic: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="10s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="32" r="16" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
        <circle cx="32" cy="32" r="6" fill="currentColor" />
        <circle cx="32" cy="8" r="4" fill="currentColor">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    celestial: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="32" cy="32" r="20" fill="currentColor">
          <animate attributeName="r" values="20;22;20" dur="2s" repeatCount="indefinite" />
        </circle>
        <line x1="32" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="2" opacity="0.6"><animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" /></line>
        <line x1="32" y1="32" x2="4" y2="32" stroke="currentColor" strokeWidth="2" opacity="0.6"><animate attributeName="opacity" values="0.6;1;0.6" dur="1.7s" repeatCount="indefinite" /></line>
        <line x1="32" y1="32" x2="32" y2="4" stroke="currentColor" strokeWidth="2" opacity="0.6"><animate attributeName="opacity" values="0.6;1;0.6" dur="1.9s" repeatCount="indefinite" /></line>
        <line x1="32" y1="32" x2="32" y2="60" stroke="currentColor" strokeWidth="2" opacity="0.6"><animate attributeName="opacity" values="0.6;1;0.6" dur="2.1s" repeatCount="indefinite" /></line>
      </svg>
    ),
    astral: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="32" cy="32" r="22" fill="currentColor" opacity="0.2">
          <animate attributeName="r" values="22;26;22" dur="3s" repeatCount="indefinite" />
        </circle>
        <ellipse cx="32" cy="32" rx="22" ry="8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="8s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="32" cy="32" r="10" fill="currentColor" />
        <circle cx="32" cy="32" r="4" fill="#fff" opacity="0.8" />
        <circle cx="52" cy="32" r="3" fill="#fff">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="4s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    universal: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="32" cy="32" r="24" fill="currentColor" opacity="0.15">
          <animate attributeName="r" values="24;28;24" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M32 12L36 22H46L38 28L42 38L32 32L22 38L26 28L18 22H28L32 12Z" fill="currentColor">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="15s" repeatCount="indefinite" />
        </path>
        <path d="M24 8L32 4L40 8L32 6L24 8Z" fill="#fbbf24" />
        <path d="M22 10L32 6L42 10" stroke="#fbbf24" strokeWidth="2" fill="none" />
      </svg>
    ),
    pulse: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="32" cy="32" r="8" fill="currentColor" />
        <circle cx="32" cy="32" r="16" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6">
          <animate attributeName="r" values="16;24;16" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3">
          <animate attributeName="r" values="24;30;24" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    nebula: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <ellipse cx="32" cy="32" rx="28" ry="16" fill="currentColor" opacity="0.2">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="20s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="32" cy="32" rx="20" ry="10" fill="currentColor" opacity="0.4">
          <animateTransform attributeName="transform" type="rotate" from="60 32 32" to="420 32 32" dur="15s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="32" cy="32" r="8" fill="currentColor">
          <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="20" cy="28" r="2" fill="#fff" opacity="0.6"><animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" /></circle>
        <circle cx="44" cy="36" r="2" fill="#fff" opacity="0.6"><animate attributeName="opacity" values="0.6;1;0.6" dur="1.3s" repeatCount="indefinite" /></circle>
      </svg>
    ),
    supernova: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="32" cy="32" r="12" fill="currentColor">
          <animate attributeName="r" values="12;16;12" dur="0.8s" repeatCount="indefinite" />
        </circle>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line key={i} x1="32" y1="32" x2={32 + 24 * Math.cos(angle * Math.PI / 180)} y2={32 + 24 * Math.sin(angle * Math.PI / 180)} stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <animate attributeName="opacity" values="1;0.3;1" dur={`${0.5 + i * 0.1}s`} repeatCount="indefinite" />
          </line>
        ))}
      </svg>
    ),
    blackhole: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="32" cy="32" r="10" fill="#0f172a" />
        <ellipse cx="32" cy="32" rx="24" ry="8" stroke="currentColor" strokeWidth="3" fill="none">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.15">
          <animate attributeName="r" values="28;26;28" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    aurora: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M8 40Q20 20 32 35Q44 50 56 30" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.8">
          <animate attributeName="d" values="M8 40Q20 20 32 35Q44 50 56 30;M8 35Q20 50 32 30Q44 20 56 40;M8 40Q20 20 32 35Q44 50 56 30" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M8 45Q20 30 32 40Q44 55 56 35" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.5">
          <animate attributeName="d" values="M8 45Q20 30 32 40Q44 55 56 35;M8 40Q20 55 32 35Q44 25 56 45;M8 45Q20 30 32 40Q44 55 56 35" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M8 50Q20 40 32 45Q44 60 56 40" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3">
          <animate attributeName="d" values="M8 50Q20 40 32 45Q44 60 56 40;M8 45Q20 60 32 40Q44 30 56 50;M8 50Q20 40 32 45Q44 60 56 40" dur="2s" repeatCount="indefinite" />
        </path>
      </svg>
    ),
    meteor: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="44" cy="20" r="8" fill="currentColor">
          <animate attributeName="cx" values="44;20;44" dur="2s" repeatCount="indefinite" />
          <animate attributeName="cy" values="20;44;20" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M44 20L56 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M44 20L60 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="48" cy="16" r="2" fill="#fff" opacity="0.6" />
      </svg>
    ),
    constellation: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="16" cy="20" r="3" fill="currentColor"><animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" /></circle>
        <circle cx="32" cy="12" r="3" fill="currentColor"><animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" /></circle>
        <circle cx="48" cy="24" r="3" fill="currentColor"><animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" /></circle>
        <circle cx="40" cy="40" r="3" fill="currentColor"><animate attributeName="opacity" values="1;0.5;1" dur="1.3s" repeatCount="indefinite" /></circle>
        <circle cx="24" cy="48" r="3" fill="currentColor"><animate attributeName="opacity" values="1;0.5;1" dur="1.6s" repeatCount="indefinite" /></circle>
        <line x1="16" y1="20" x2="32" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="32" y1="12" x2="48" y2="24" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="48" y1="24" x2="40" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="40" y1="40" x2="24" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <line x1="24" y1="48" x2="16" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
    vortex: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M32 32Q32 16 48 16Q56 16 56 32Q56 48 40 48Q32 48 32 32" stroke="currentColor" strokeWidth="3" fill="none">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="4s" repeatCount="indefinite" />
        </path>
        <path d="M32 32Q32 22 42 22Q48 22 48 32Q48 42 38 42Q32 42 32 32" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="-360 32 32" dur="3s" repeatCount="indefinite" />
        </path>
        <circle cx="32" cy="32" r="4" fill="currentColor" />
      </svg>
    ),
    crystal: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M32 8L48 24L48 40L32 56L16 40L16 24L32 8Z" fill="currentColor" opacity="0.3" />
        <path d="M32 8L48 24L32 32L16 24L32 8Z" fill="currentColor" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.9;0.6" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M32 32L48 24L48 40L32 56L32 32Z" fill="currentColor" opacity="0.4" />
        <path d="M32 32L32 56L16 40L16 24L32 32Z" fill="currentColor" opacity="0.5" />
        <circle cx="32" cy="24" r="4" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" /></circle>
      </svg>
    )
  };

  // SVG Icons for Badges
  const BadgeIcons = {
    pioneer: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M32 4L40 16H52L44 28L48 44L32 36L16 44L20 28L12 16H24L32 4Z" fill="currentColor">
          <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="32" cy="26" r="8" fill="#fff" opacity="0.3" />
        <path d="M26 52H38V58H26V52Z" fill="currentColor" />
        <path d="M22 58H42V62H22V58Z" fill="currentColor" opacity="0.7" />
      </svg>
    ),
    onboarding: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="32" cy="26" r="18" fill="currentColor" opacity="0.2">
          <animate attributeName="r" values="18;20;18" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <path d="M32 8C20 8 14 18 14 26C14 34 20 44 32 56C44 44 50 34 50 26C50 18 44 8 32 8Z" fill="currentColor" />
        <circle cx="32" cy="26" r="8" fill="#fff" />
        <circle cx="32" cy="26" r="4" fill="currentColor" />
      </svg>
    ),
    reviewer: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="28" cy="28" r="16" stroke="currentColor" strokeWidth="4" fill="none" />
        <circle cx="28" cy="28" r="8" fill="currentColor" opacity="0.3">
          <animate attributeName="r" values="8;10;8" dur="1s" repeatCount="indefinite" />
        </circle>
        <line x1="40" y1="40" x2="54" y2="54" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
    predictor: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
        <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" />
        <circle cx="32" cy="32" r="4" fill="currentColor">
          <animate attributeName="r" values="4;6;4" dur="0.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    streak: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M32 4C32 4 24 20 24 32C24 44 28 56 32 60C36 56 40 44 40 32C40 20 32 4 32 4Z" fill="currentColor">
          <animate attributeName="d" values="M32 4C32 4 24 20 24 32C24 44 28 56 32 60C36 56 40 44 40 32C40 20 32 4 32 4Z;M32 2C32 2 22 18 22 32C22 46 27 58 32 62C37 58 42 46 42 32C42 18 32 2 32 2Z;M32 4C32 4 24 20 24 32C24 44 28 56 32 60C36 56 40 44 40 32C40 20 32 4 32 4Z" dur="0.8s" repeatCount="indefinite" />
        </path>
        <ellipse cx="32" cy="28" rx="6" ry="8" fill="#fbbf24" opacity="0.6" />
        <ellipse cx="32" cy="24" rx="3" ry="4" fill="#fff" opacity="0.4" />
      </svg>
    ),
    maker: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M32 8L58 32L32 56L6 32L32 8Z" fill="currentColor" opacity="0.2" />
        <path d="M32 16L50 32L32 48L14 32L32 16Z" fill="currentColor">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="8s" repeatCount="indefinite" />
        </path>
        <circle cx="32" cy="32" r="8" fill="#fff" opacity="0.5" />
        <path d="M28 30L32 26L36 30L32 34L28 30Z" fill="currentColor" />
      </svg>
    ),
    p2p: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="20" cy="32" r="12" fill="currentColor" />
        <circle cx="44" cy="32" r="12" fill="currentColor" />
        <path d="M28 32H36" stroke="#fff" strokeWidth="3" strokeLinecap="round">
          <animate attributeName="stroke-dasharray" values="0 8;8 0;0 8" dur="1s" repeatCount="indefinite" />
        </path>
        <circle cx="20" cy="32" r="4" fill="#fff" opacity="0.5" />
        <circle cx="44" cy="32" r="4" fill="#fff" opacity="0.5" />
      </svg>
    ),
    community: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M32 8L38 20H50L40 28L44 40L32 32L20 40L24 28L14 20H26L32 8Z" fill="currentColor">
          <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="2s" repeatCount="indefinite" additive="sum" />
        </path>
        <circle cx="32" cy="24" r="4" fill="#fff" opacity="0.5" />
        <path d="M24 48H40V52H24V48Z" fill="currentColor" opacity="0.6" />
        <path d="M20 52H44V56H20V52Z" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    singularity: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="32" cy="32" r="24" fill="currentColor" opacity="0.1">
          <animate attributeName="r" values="24;28;24" dur="3s" repeatCount="indefinite" />
        </circle>
        <ellipse cx="32" cy="32" rx="20" ry="8" stroke="currentColor" strokeWidth="2" fill="none">
          <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="32" cy="32" rx="20" ry="8" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(60 32 32)">
          <animateTransform attributeName="transform" type="rotate" from="60 32 32" to="420 32 32" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="32" cy="32" rx="20" ry="8" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(120 32 32)">
          <animateTransform attributeName="transform" type="rotate" from="120 32 32" to="480 32 32" dur="6s" repeatCount="indefinite" />
        </ellipse>
        <circle cx="32" cy="32" r="6" fill="currentColor" />
      </svg>
    ),
    trophy: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M20 12H44V28C44 36 38 44 32 44C26 44 20 36 20 28V12Z" fill="currentColor">
          <animate attributeName="opacity" values="1;0.85;1" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M20 16H12V24C12 28 16 32 20 32V16Z" fill="currentColor" opacity="0.7" />
        <path d="M44 16H52V24C52 28 48 32 44 32V16Z" fill="currentColor" opacity="0.7" />
        <rect x="28" y="44" width="8" height="8" fill="currentColor" />
        <rect x="24" y="52" width="16" height="4" fill="currentColor" />
        <circle cx="32" cy="24" r="4" fill="#fff" opacity="0.3" />
      </svg>
    ),
    medal: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M24 4H40L36 20H28L24 4Z" fill="currentColor" opacity="0.6" />
        <circle cx="32" cy="36" r="18" fill="currentColor">
          <animate attributeName="r" values="18;20;18" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="32" cy="36" r="12" stroke="#fff" strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M32 28L34 32H38L35 35L36 40L32 37L28 40L29 35L26 32H30L32 28Z" fill="#fff" opacity="0.5" />
      </svg>
    ),
    crown: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M8 44L16 20L28 32L32 16L36 32L48 20L56 44H8Z" fill="currentColor">
          <animate attributeName="d" values="M8 44L16 20L28 32L32 16L36 32L48 20L56 44H8Z;M8 42L16 18L28 30L32 14L36 30L48 18L56 42H8Z;M8 44L16 20L28 32L32 16L36 32L48 20L56 44H8Z" dur="2s" repeatCount="indefinite" />
        </path>
        <rect x="8" y="44" width="48" height="8" fill="currentColor" opacity="0.8" />
        <circle cx="16" cy="20" r="4" fill="#fff" opacity="0.5" />
        <circle cx="32" cy="16" r="4" fill="#fff" opacity="0.5" />
        <circle cx="48" cy="20" r="4" fill="#fff" opacity="0.5" />
      </svg>
    ),
    diamond: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M32 8L56 28L32 56L8 28L32 8Z" fill="currentColor" opacity="0.3" />
        <path d="M32 8L56 28L32 36L8 28L32 8Z" fill="currentColor" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M32 36L56 28L32 56L8 28L32 36Z" fill="currentColor" opacity="0.5" />
        <line x1="32" y1="8" x2="32" y2="56" stroke="#fff" strokeWidth="1" opacity="0.3" />
        <circle cx="32" cy="24" r="4" fill="#fff" opacity="0.4"><animate attributeName="opacity" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite" /></circle>
      </svg>
    ),
    lightning: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M36 4L16 32H28L24 60L48 28H36L40 4H36Z" fill="currentColor">
          <animate attributeName="opacity" values="1;0.7;1" dur="0.5s" repeatCount="indefinite" />
        </path>
        <path d="M36 4L32 20H40L36 4Z" fill="#fff" opacity="0.4" />
      </svg>
    ),
    rocket: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <ellipse cx="32" cy="56" rx="12" ry="4" fill="currentColor" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.5s" repeatCount="indefinite" />
        </ellipse>
        <path d="M32 8C26 16 24 28 24 36L32 44L40 36C40 28 38 16 32 8Z" fill="currentColor">
          <animate attributeName="d" values="M32 8C26 16 24 28 24 36L32 44L40 36C40 28 38 16 32 8Z;M32 6C26 14 24 26 24 34L32 42L40 34C40 26 38 14 32 6Z;M32 8C26 16 24 28 24 36L32 44L40 36C40 28 38 16 32 8Z" dur="0.8s" repeatCount="indefinite" />
        </path>
        <circle cx="32" cy="24" r="4" fill="#fff" opacity="0.5" />
        <path d="M24 36L18 40L22 44" fill="currentColor" opacity="0.7" />
        <path d="M40 36L46 40L42 44" fill="currentColor" opacity="0.7" />
        <path d="M28 44L32 56L36 44" fill="#f97316" opacity="0.8"><animate attributeName="opacity" values="0.8;0.4;0.8" dur="0.3s" repeatCount="indefinite" /></path>
      </svg>
    ),
    heart: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M32 56L12 36C4 28 4 16 14 12C20 10 26 12 32 20C38 12 44 10 50 12C60 16 60 28 52 36L32 56Z" fill="currentColor">
          <animate attributeName="d" values="M32 56L12 36C4 28 4 16 14 12C20 10 26 12 32 20C38 12 44 10 50 12C60 16 60 28 52 36L32 56Z;M32 54L14 36C6 28 6 18 15 14C21 12 26 14 32 22C38 14 43 12 49 14C58 18 58 28 50 36L32 54Z;M32 56L12 36C4 28 4 16 14 12C20 10 26 12 32 20C38 12 44 10 50 12C60 16 60 28 52 36L32 56Z" dur="1s" repeatCount="indefinite" />
        </path>
        <circle cx="22" cy="24" r="4" fill="#fff" opacity="0.3" />
      </svg>
    ),
    gem: () => (
      <svg viewBox="0 0 64 64" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M16 20L32 8L48 20L32 56L16 20Z" fill="currentColor" opacity="0.4" />
        <path d="M16 20L32 8L48 20H16Z" fill="currentColor" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M16 20L32 32L48 20" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M32 32V56" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <circle cx="32" cy="18" r="4" fill="#fff" opacity="0.5"><animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" /></circle>
      </svg>
    )
  };

  const getIconComponent = (type, isLevel = true) => {
    const icons = isLevel ? LevelIcons : BadgeIcons;
    return icons[type] || icons[isLevel ? 'stellar' : 'pioneer'];
  };

  const toggleBadgeFlip = (badgeId) => {
    setFlippedBadges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(badgeId)) newSet.delete(badgeId);
      else newSet.add(badgeId);
      return newSet;
    });
  };

  const calculateProgress = (level) => {
    const max = level.fomo_score_max || 1000;
    return Math.min(100, ((level.fomo_score_max - level.fomo_score_min) / max) * 100 + 15);
  };

  return (
    <section id="evolution" data-testid="evolution-section" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '100px 0',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ display: 'inline-block', padding: '10px 24px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '50px', color: '#10b981', fontSize: '14px', fontWeight: '600', marginBottom: '24px' }}>
            {t.badge}
          </span>
          <h2 style={{ fontSize: '52px', fontWeight: '800', color: 'white', margin: '0 0 16px 0', lineHeight: '1.1' }}>
            {t.title} <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.titleHighlight}</span>
          </h2>
          <p style={{ fontSize: '18px', color: '#94a3b8', margin: 0 }}>{t.subtitle}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '50px' }}>
          {['levels', 'badges'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 36px',
              background: activeTab === tab ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)',
              border: activeTab === tab ? 'none' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50px', color: activeTab === tab ? 'white' : '#94a3b8',
              fontSize: '16px', fontWeight: '600', cursor: 'pointer',
              boxShadow: activeTab === tab ? '0 4px 24px rgba(16, 185, 129, 0.35)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              <span style={{ width: '24px', height: '24px' }}>
                {tab === 'levels' ? (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3v-8zm4-6h2v14H7V7zm4-4h2v18h-2V3zm4 6h2v12h-2V9zm4 4h2v8h-2v-8z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z"/></svg>
                )}
              </span>
              {tab === 'levels' ? 'FOMO Score Levels' : 'Badges'}
            </button>
          ))}
        </div>

        {/* Levels Content */}
        {activeTab === 'levels' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {levels.map((level, idx) => {
              const IconComponent = getIconComponent(level.animation_type, true);
              const gradient = `linear-gradient(135deg, ${level.gradient_from}, ${level.gradient_to})`;
              const glowColor = `${level.gradient_from}66`;
              return (
                <div key={level.id || idx} 
                  onMouseEnter={() => setHoveredLevel(idx)} 
                  onMouseLeave={() => setHoveredLevel(null)}
                  style={{
                    background: hoveredLevel === idx ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid', borderColor: hoveredLevel === idx ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.08)',
                    borderRadius: '24px', padding: '28px', cursor: 'pointer',
                    transform: hoveredLevel === idx ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: hoveredLevel === idx ? `0 20px 50px ${glowColor}` : 'none',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '20px', padding: '12px', background: gradient, boxShadow: `0 8px 24px ${glowColor}`, color: 'white' }}>
                      <IconComponent />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: '0 0 6px 0' }}>{getLangField(level, 'rank')}</h3>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 12px', borderRadius: '20px' }}>
                        FOMO: {level.fomo_score_min}–{level.fomo_score_max}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
                    <div style={{ height: '100%', width: `${calculateProgress(level)}%`, background: gradient, borderRadius: '10px', transition: 'width 1s ease' }} />
                  </div>
                  <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 20px 0' }}>{getLangField(level, 'description')}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Next:</span>
                    <span style={{ fontSize: '14px', color: '#10b981', fontWeight: '600' }}>{getLangField(level, 'next_level')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Badges Content */}
        {activeTab === 'badges' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {badges.map((badge) => {
              const IconComponent = getIconComponent(badge.animation_type, false);
              const gradient = `linear-gradient(135deg, ${badge.gradient_from}, ${badge.gradient_to})`;
              const glowColor = `${badge.gradient_from}80`;
              return (
                <div key={badge.id}
                  onClick={() => toggleBadgeFlip(badge.id)}
                  style={{ perspective: '1000px', height: '280px', cursor: 'pointer' }}>
                  <div style={{
                    position: 'relative', width: '100%', height: '100%',
                    transformStyle: 'preserve-3d',
                    transform: flippedBadges.has(badge.id) ? 'rotateY(180deg)' : 'rotateY(0)',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                    {/* Front Side */}
                    <div style={{
                      position: 'absolute', width: '100%', height: '100%',
                      backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '24px', padding: '16px', background: gradient, boxShadow: `0 12px 40px ${glowColor}`, marginBottom: '24px', color: 'white' }}>
                        <IconComponent />
                      </div>
                      <h4 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: '0 0 8px 0', textAlign: 'center' }}>{getLangField(badge, 'name')}</h4>
                      <span style={{ fontSize: '14px', fontWeight: '600', padding: '6px 16px', borderRadius: '20px', background: gradient, color: 'white' }}>
                        Earn {badge.xp_requirement?.toLocaleString()} XP
                      </span>
                      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '16px', textAlign: 'center' }}>Click to see conditions</p>
                    </div>
                    
                    {/* Back Side */}
                    <div style={{
                      position: 'absolute', width: '100%', height: '100%',
                      backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: gradient, borderRadius: '24px', padding: '32px',
                      display: 'flex', flexDirection: 'column', justifyContent: 'center'
                    }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: '0 0 16px 0' }}>How to earn:</h4>
                      <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', margin: '0 0 20px 0' }}>{getLangField(badge, 'condition')}</p>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '16px' }}>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5', margin: 0, fontStyle: 'italic' }}>"{getLangField(badge, 'description')}"</p>
                      </div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: 'auto', textAlign: 'center' }}>Click to flip back</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};



export default EvolutionSection;
