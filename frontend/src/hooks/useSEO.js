/**
 * useSEO Hook
 * 
 * React hook for managing SEO meta tags and tracking
 * 
 * @usage
 * import { useSEO } from '@/hooks/useSEO';
 * 
 * useSEO({
 *   title: 'About Us',
 *   description: 'Learn about FOMO platform',
 *   section: 'about'
 * });
 */

import { useEffect } from 'react';
import { 
  updatePageTitle, 
  updateMetaDescription, 
  updateOGTags,
  trackPageView,
  trackConversion 
} from '@/lib/seo';

const useSEO = ({ title, description, image, section, trackView = true }) => {
  useEffect(() => {
    // Update page title
    if (title) {
      updatePageTitle(title);
    }
    
    // Update meta description
    if (description) {
      updateMetaDescription(description);
    }
    
    // Update OG tags
    updateOGTags({
      title: title ? `${title} | FOMO` : undefined,
      description,
      image,
      url: section ? `${window.location.origin}/#${section}` : undefined
    });
    
    // Track page view
    if (trackView && section) {
      trackPageView(section, { section_name: section });
    }
    
    // Cleanup - reset to defaults when unmounting
    return () => {
      updatePageTitle(null);
      updateMetaDescription(null);
    };
  }, [title, description, image, section, trackView]);
  
  return {
    trackEvent: trackConversion.viewContent,
    trackLead: trackConversion.lead,
    trackRegistration: trackConversion.registration,
    trackWalletConnect: trackConversion.walletConnect
  };
};

export default useSEO;
