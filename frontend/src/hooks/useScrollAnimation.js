import { useEffect } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * Adds fade-in-up animation to elements when they enter viewport
 */
export const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          entry.target.style.opacity = '1';
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all sections and cards
    const elements = document.querySelectorAll('section, .card, .feature-card, .team-member-card, .partner-card');
    elements.forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);
};
