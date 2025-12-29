import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import UtilitiesSection from './sections/UtilitiesSection';
import PlatformSection from './sections/PlatformSection';
import EcosystemSection from './sections/EcosystemSection';
import RoadmapSection from './sections/RoadmapSection';
import TeamSection from './sections/TeamSection';
import PartnersSection from './sections/PartnersSection';
import CommunitySection from './sections/CommunitySection';
import FooterSection from './sections/FooterSection';
import FAQSection from './sections/FAQSection';
import AnalyticsSection from './sections/AnalyticsSection';
import EvolutionSection from './sections/EvolutionSection';
import UtilityNavButtonsSection from './sections/UtilityNavButtonsSection';
import CookieConsentSection from './sections/CookieConsentSection';

const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      await axios.post(`${API}/api/admin/verify`, { token });
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem('admin_token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setCurrentSection('hero');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const sections = [
    { id: 'hero', name: 'Hero Section', icon: '🎯' },
    { id: 'about', name: 'About', icon: '📖' },
    { id: 'utilities', name: 'Utilities', icon: '🔧' },
    { id: 'utility-nav', name: 'Utility Nav Buttons', icon: '🔗' },
    { id: 'platform', name: 'Platform', icon: '📊' },
    { id: 'evolution', name: 'User Evolution', icon: '🚀' },
    { id: 'ecosystem', name: 'Ecosystem', icon: '🌐' },
    { id: 'roadmap', name: 'Roadmap', icon: '🗺️' },
    { id: 'team', name: 'Team', icon: '👥' },
    { id: 'partners', name: 'Partners', icon: '🤝' },
    { id: 'community', name: 'Community', icon: '💬' },
    { id: 'footer', name: 'Footer', icon: '📄' },
    { id: 'faq', name: 'FAQ', icon: '❓' },
    { id: 'analytics', name: 'Analytics', icon: '📈' }
  ];

  const renderSection = () => {
    const props = { showNotification };
    
    switch (currentSection) {
      case 'hero':
        return <HeroSection {...props} />;
      case 'about':
        return <AboutSection {...props} />;
      case 'utilities':
        return <UtilitiesSection {...props} />;
      case 'utility-nav':
        return <UtilityNavButtonsSection {...props} />;
      case 'platform':
        return <PlatformSection {...props} />;
      case 'evolution':
        return <EvolutionSection {...props} />;
      case 'ecosystem':
        return <EcosystemSection {...props} />;
      case 'roadmap':
        return <RoadmapSection {...props} />;
      case 'team':
        return <TeamSection {...props} />;
      case 'partners':
        return <PartnersSection {...props} />;
      case 'community':
        return <CommunitySection {...props} />;
      case 'footer':
        return <FooterSection {...props} />;
      case 'faq':
        return <FAQSection {...props} />;
      case 'analytics':
        return <AnalyticsSection {...props} />;
      default:
        return <HeroSection {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-red-500 text-white'
        } animate-fade-in`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-emerald-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              FOMO Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          sections={sections}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
