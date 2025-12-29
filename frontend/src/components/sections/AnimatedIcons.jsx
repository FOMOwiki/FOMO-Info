/**
 * AnimatedIcons Component
 * 
 * Collection of animated SVG icons used throughout the application
 */

export const AnimatedIcon = ({ type }) => {
  const icons = {
    diamond: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path 
          d="M12 2L2 9l10 13 10-13-10-7z" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-draw"
        />
        <path 
          d="M2 9h20M12 2v20" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          className="animate-draw-delayed"
        />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <circle 
          cx="12" 
          cy="12" 
          r="9" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="animate-draw"
        />
        <path 
          d="M12 6v6l4 2" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          className="animate-clock-hands"
        />
      </svg>
    ),
    lightning: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path 
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-lightning"
        />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path 
          d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-draw"
        />
        <path 
          d="M9 12l2 2 4-4" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-check"
        />
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path 
          d="M3 3v18h18" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          className="animate-draw"
        />
        <path 
          d="M7 14l4-4 4 4 5-5" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="animate-line"
        />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" className="animate-draw" />
        <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" className="animate-draw-delayed" />
        <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" className="animate-draw" />
        <path d="M17 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.5" className="animate-draw-delayed" />
      </svg>
    ),
    rocket: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path 
          d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="animate-draw"
        />
        <path 
          d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="animate-rocket"
        />
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" className="animate-draw" />
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" className="animate-draw-delayed" />
        <circle cx="12" cy="16" r="1" fill="currentColor" className="animate-pulse" />
      </svg>
    )
  };
  
  return icons[type] || icons.diamond;
};

export default AnimatedIcon;
