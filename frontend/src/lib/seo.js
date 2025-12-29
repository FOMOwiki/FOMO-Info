/**
 * SEO Meta Tags Management
 * 
 * Utility functions for dynamic SEO tag updates
 */

// Update page title
export const updatePageTitle = (title) => {
  document.title = title ? `${title} | FOMO` : 'FOMO - Advanced Crypto Analytics Platform';
};

// Update meta description
export const updateMetaDescription = (description) => {
  const defaultDesc = 'FOMO is the leading crypto analytics platform combining AI-powered insights, real-time market data, and NFT tools.';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.setAttribute('content', description || defaultDesc);
  }
};

// Update OG tags
export const updateOGTags = ({ title, description, image, url }) => {
  const updates = {
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url
  };
  
  Object.entries(updates).forEach(([property, content]) => {
    if (content) {
      const meta = document.querySelector(`meta[property="${property}"]`);
      if (meta) meta.setAttribute('content', content);
    }
  });
};

// Update Twitter tags
export const updateTwitterTags = ({ title, description, image }) => {
  const updates = {
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image
  };
  
  Object.entries(updates).forEach(([name, content]) => {
    if (content) {
      const meta = document.querySelector(`meta[name="${name}"]`);
      if (meta) meta.setAttribute('content', content);
    }
  });
};

// Update canonical URL
export const updateCanonical = (url) => {
  const link = document.querySelector('link[rel="canonical"]');
  if (link && url) {
    link.setAttribute('href', url);
  }
};

// Track page view for analytics
export const trackPageView = (pageName, pageData = {}) => {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      ...pageData
    });
  }
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
  
  // TikTok Pixel
  if (window.ttq) {
    window.ttq.page();
  }
  
  // PostHog
  if (window.posthog) {
    window.posthog.capture('$pageview', { page: pageName, ...pageData });
  }
};

// Track custom event
export const trackEvent = (eventName, eventData = {}) => {
  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }
  
  // Facebook Pixel
  if (window.fbq) {
    window.fbq('trackCustom', eventName, eventData);
  }
  
  // TikTok Pixel
  if (window.ttq) {
    window.ttq.track(eventName, eventData);
  }
  
  // PostHog
  if (window.posthog) {
    window.posthog.capture(eventName, eventData);
  }
};

// Standard conversion events
export const trackConversion = {
  lead: (data = {}) => {
    if (window.fbq) window.fbq('track', 'Lead', data);
    if (window.ttq) window.ttq.track('SubmitForm', data);
    if (window.gtag) window.gtag('event', 'generate_lead', data);
  },
  
  registration: (data = {}) => {
    if (window.fbq) window.fbq('track', 'CompleteRegistration', data);
    if (window.ttq) window.ttq.track('CompleteRegistration', data);
    if (window.gtag) window.gtag('event', 'sign_up', data);
  },
  
  walletConnect: (data = {}) => {
    trackEvent('wallet_connected', data);
    if (window.fbq) window.fbq('track', 'CompleteRegistration', { ...data, content_name: 'wallet_connect' });
  },
  
  viewContent: (contentName, data = {}) => {
    if (window.fbq) window.fbq('track', 'ViewContent', { content_name: contentName, ...data });
    if (window.ttq) window.ttq.track('ViewContent', { content_name: contentName, ...data });
  }
};

export default {
  updatePageTitle,
  updateMetaDescription,
  updateOGTags,
  updateTwitterTags,
  updateCanonical,
  trackPageView,
  trackEvent,
  trackConversion
};
