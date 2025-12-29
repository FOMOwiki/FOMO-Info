import React, { useEffect } from 'react';

/**
 * Custom cursor trail component
 * Creates a glowing yellow trail effect that follows the cursor
 * Features:
 * - Shows default system cursor
 * - Creates yellow glowing dots trail
 * - Automatically hidden on mobile/touch devices
 */
const CustomCursor = () => {
  useEffect(() => {
    // Check if device supports hover (not mobile/touch)
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (!supportsHover) {
      return; // Don't initialize trail on touch devices
    }

    let mouseX = 0;
    let mouseY = 0;
    let lastTrailTime = 0;
    const trailInterval = 8; // Create new trail dot every 8ms for continuous effect

    const createTrailDot = (x, y) => {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail-dot';
      dot.style.left = `${x - 10}px`; // Center the dot (20px width / 2)
      dot.style.top = `${y - 10}px`;  // Center the dot (20px height / 2)
      
      document.body.appendChild(dot);
      
      // Remove dot after animation completes
      setTimeout(() => {
        dot.remove();
      }, 600); // Match animation duration
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      const now = Date.now();
      if (now - lastTrailTime > trailInterval) {
        createTrailDot(mouseX, mouseY);
        lastTrailTime = now;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      // Clean up any remaining trail dots
      const dots = document.querySelectorAll('.cursor-trail-dot');
      dots.forEach(dot => dot.remove());
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default CustomCursor;
