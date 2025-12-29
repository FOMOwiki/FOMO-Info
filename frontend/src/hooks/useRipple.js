import { useEffect } from 'react';

/**
 * Custom hook for ripple effect on click
 * Adds material design ripple effect to buttons
 */
export const useRipple = () => {
  useEffect(() => {
    const addRipple = (e) => {
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    const buttons = document.querySelectorAll('button:not(.no-ripple), a.button');
    buttons.forEach(button => {
      button.addEventListener('click', addRipple);
    });

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', addRipple);
      });
    };
  }, []);
};
