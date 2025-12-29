import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = ({ onLoadingComplete, minDuration = 2000 }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing');

  const loadingTexts = [
    'Initializing',
    'Connecting to blockchain',
    'Loading crypto data',
    'Preparing dashboard',
    'Almost ready'
  ];

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const elapsed = Date.now() - startTime;
        const targetProgress = Math.min(95, (elapsed / minDuration) * 100);
        
        const textIndex = Math.floor(prev / 25);
        if (textIndex < loadingTexts.length) {
          setLoadingText(loadingTexts[textIndex]);
        }
        
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        return Math.min(prev + Math.random() * 8 + 2, targetProgress);
      });
    }, 100);

    const timeout = setTimeout(() => {
      setProgress(100);
      setLoadingText('Welcome to FOMO');
      
      setTimeout(() => {
        setIsVisible(false);
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      }, 500);
    }, minDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [minDuration, onLoadingComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            overflow: 'hidden'
          }}
        >
          {/* Subtle floating particles - light green (reduced) */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 100 }}
                animate={{ 
                  opacity: [0.2, 0.4, 0.2],
                  y: [-20, -80, -20]
                }}
                transition={{
                  duration: Math.random() * 5 + 4,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
                style={{
                  position: 'absolute',
                  left: `${15 + (i * 10)}%`,
                  top: `${65 + (i % 3) * 10}%`,
                  width: `${Math.random() * 6 + 3}px`,
                  height: `${Math.random() * 6 + 3}px`,
                  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                  borderRadius: '50%',
                  filter: 'blur(1px)'
                }}
              />
            ))}
          </div>

          {/* Decorative circles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: '500px',
              height: '500px',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              borderRadius: '50%'
            }}
          />
          
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              border: '1px dashed rgba(16, 185, 129, 0.2)',
              borderRadius: '50%'
            }}
          />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              border: '1px solid rgba(16, 185, 129, 0.1)',
              borderRadius: '50%'
            }}
          />

          {/* Floating rocket - top right */}
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              rotate: [-10, 10, -10]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              top: '15%',
              right: '20%',
              fontSize: '2.5rem',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
            }}
          >
            🚀
          </motion.div>

          {/* Floating coin - left */}
          <motion.div
            animate={{ 
              y: [5, -5, 5],
              rotate: [0, 360]
            }}
            transition={{ 
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' }
            }}
            style={{
              position: 'absolute',
              bottom: '30%',
              left: '15%',
              fontSize: '2rem',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
            }}
          >
            💎
          </motion.div>

          {/* Floating chart - bottom right */}
          <motion.div
            animate={{ 
              y: [-8, 8, -8],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              bottom: '25%',
              right: '15%',
              fontSize: '1.8rem',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
            }}
          >
            📈
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 10
            }}
          >
            {/* Logo with glow */}
            <motion.div
              animate={{ 
                y: [-3, 3, -3],
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                width: '100px',
                height: '100px',
                marginBottom: '20px',
                position: 'relative'
              }}
            >
              {/* Glow ring */}
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  position: 'absolute',
                  inset: '-15px',
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                  borderRadius: '50%'
                }}
              />
              
              <img 
                src="/logo.svg" 
                alt="FOMO" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.3))'
                }}
              />
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: '2.2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '6px',
                letterSpacing: '0.15em'
              }}
            >
              FOMO
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                color: '#6b7280',
                fontSize: '0.75rem',
                marginBottom: '35px',
                letterSpacing: '0.25em',
                fontWeight: '500'
              }}
            >
              CRYPTO ANALYTICS PLATFORM
            </motion.p>

            {/* Progress Container */}
            <div style={{
              width: '260px',
              padding: '16px 20px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1), 0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid rgba(16, 185, 129, 0.1)'
            }}>
              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '6px',
                background: '#f3f4f6',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '12px'
              }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                    borderRadius: '3px',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
                  }}
                />
              </div>

              {/* Progress Text */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <motion.span
                  key={loadingText}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}
                >
                  {loadingText}
                </motion.span>
                <span style={{
                  color: '#10b981',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}>
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bottom dots indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{
                width: '8px',
                height: '8px',
                background: '#10b981',
                borderRadius: '50%'
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              style={{
                width: '8px',
                height: '8px',
                background: '#34d399',
                borderRadius: '50%'
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              style={{
                width: '8px',
                height: '8px',
                background: '#6ee7b7',
                borderRadius: '50%'
              }}
            />
          </motion.div>

          {/* Secure badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              position: 'absolute',
              bottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#9ca3af',
              fontSize: '0.7rem'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Secured by FOMO Platform</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
