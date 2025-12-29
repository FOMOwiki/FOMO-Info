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
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const elapsed = Date.now() - startTime;
        const targetProgress = Math.min(95, (elapsed / minDuration) * 100);
        
        // Update loading text based on progress
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

    // Complete loading after minDuration
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
          className="loading-screen"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f3460 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            overflow: 'hidden'
          }}
        >
          {/* Animated Stars Background */}
          <div className="stars-container" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  background: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                }}
              />
            ))}
          </div>

          {/* Orbital Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              border: '1px dashed rgba(16, 185, 129, 0.3)',
              borderRadius: '50%'
            }}
          />

          {/* Second Orbital Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              border: '1px dashed rgba(59, 130, 246, 0.3)',
              borderRadius: '50%'
            }}
          />

          {/* Floating Rocket */}
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              top: '20%',
              right: '20%',
              fontSize: '2rem',
              filter: 'drop-shadow(0 0 10px rgba(255,165,0,0.5))'
            }}
          >
            🚀
          </motion.div>

          {/* Floating Planet */}
          <motion.div
            animate={{ 
              y: [5, -5, 5],
              rotate: [0, -3, 3, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            style={{
              position: 'absolute',
              bottom: '25%',
              left: '15%',
              fontSize: '1.5rem',
              filter: 'drop-shadow(0 0 10px rgba(138,43,226,0.5))'
            }}
          >
            🪐
          </motion.div>

          {/* Main Content Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 10
            }}
          >
            {/* Animated Logo/Astronaut */}
            <motion.div
              animate={{ 
                y: [-5, 5, -5],
                rotate: [-2, 2, -2]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                width: '120px',
                height: '120px',
                marginBottom: '24px',
                position: 'relative'
              }}
            >
              {/* Glow Effect */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  position: 'absolute',
                  inset: '-20px',
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
                  borderRadius: '50%'
                }}
              />
              
              {/* Logo */}
              <img 
                src="/logo.svg" 
                alt="FOMO" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))'
                }}
              />
            </motion.div>

            {/* Brand Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '8px',
                letterSpacing: '0.1em'
              }}
            >
              FOMO
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.9rem',
                marginBottom: '40px',
                letterSpacing: '0.2em'
              }}
            >
              CRYPTO ANALYTICS PLATFORM
            </motion.p>

            {/* Progress Bar */}
            <div style={{
              width: '280px',
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '16px'
            }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                  borderRadius: '2px',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                }}
              />
            </div>

            {/* Progress Text */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '280px',
              alignItems: 'center'
            }}>
              <motion.span
                key={loadingText}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.8rem'
                }}
              >
                {loadingText}
              </motion.span>
              <span style={{
                color: '#10b981',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                {Math.round(progress)}%
              </span>
            </div>
          </motion.div>

          {/* Bottom Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{
              position: 'absolute',
              bottom: '30px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: '6px',
                height: '6px',
                background: '#10b981',
                borderRadius: '50%'
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              style={{
                width: '6px',
                height: '6px',
                background: '#3b82f6',
                borderRadius: '50%'
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              style={{
                width: '6px',
                height: '6px',
                background: '#8b5cf6',
                borderRadius: '50%'
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
