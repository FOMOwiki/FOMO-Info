import React, { useState, useEffect, useCallback } from 'react';
import { DynamicContextProvider, DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

/**
 * InviteModal - Registration/Invite flow modal with Dynamic.xyz wallet connection
 * 
 * Flow:
 * 1. Connect Wallet (via Dynamic.xyz - supports multiple wallets)
 *    - If already registered (wallet + invite code) → skip to welcome screen
 *    - If new user → show invite code step
 * 2. Enter Invite Code (if new user)
 * 3. Connect Twitter (optional)
 * 4. Accept Terms → Complete registration with celebration!
 * 
 * Features:
 * - Disconnect wallet button
 * - One wallet = one invite code (fixed association)
 * - Modal positioned below header to avoid overlap
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Dynamic.xyz Environment ID
const DYNAMIC_ENVIRONMENT_ID = '3f47c17e-3c08-48a7-b78d-050cfde66c62';

// Confetti particle component
const Confetti = ({ active }) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (active) {
      const colors = ['#10B981', '#14B8A6', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];
      const newParticles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360,
        speedY: 2 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 4,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.5 ? 'circle' : 'square'
      }));
      setParticles(newParticles);
      
      const interval = setInterval(() => {
        setParticles(prev => prev.map(p => ({
          ...p,
          y: p.y + p.speedY,
          x: p.x + p.speedX,
          rotation: p.rotation + p.rotationSpeed
        })).filter(p => p.y < 120));
      }, 30);
      
      return () => clearInterval(interval);
    }
  }, [active]);
  
  if (!active || particles.length === 0) return null;
  
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 50 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            opacity: p.y > 80 ? (100 - p.y) / 20 : 1
          }}
        />
      ))}
    </div>
  );
};

// Lightning Icon with glow effect
const LightningIcon = () => (
  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
    {/* Outer glow - large soft */}
    <div 
      style={{
        position: 'absolute',
        width: '120px',
        height: '120px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(20,184,166,0.15) 40%, rgba(16,185,129,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(20px)'
      }}
    />
    
    {/* Middle glow */}
    <div 
      style={{
        position: 'absolute',
        width: '90px',
        height: '90px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(16,185,129,0) 60%)',
        borderRadius: '50%',
        filter: 'blur(12px)'
      }}
    />
    
    {/* Main icon container */}
    <div 
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
      }}
    >
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="white" 
        strokeWidth="2.5"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  </div>
);

// Success celebration component
const SuccessCelebration = ({ show }) => {
  if (!show) return null;
  
  return (
    <div style={{ textAlign: 'center' }}>
      {/* Animated checkmark */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#10b981',
          borderRadius: '50%',
          filter: 'blur(30px)',
          opacity: 0.3
        }} />
        <div style={{
          position: 'relative',
          width: '96px',
          height: '96px',
          background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Sparkles */}
        <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '20px' }}>✨</span>
        <span style={{ position: 'absolute', bottom: '-4px', left: '-12px', fontSize: '18px' }}>⭐</span>
        <span style={{ position: 'absolute', top: '0', left: '-16px', fontSize: '16px' }}>✨</span>
        <span style={{ position: 'absolute', bottom: '-8px', right: '0', fontSize: '22px' }}>🎉</span>
      </div>
      
      <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
        Welcome to FOMO! 🚀
      </h3>
      <p style={{ color: '#6b7280', margin: 0 }}>
        Your account has been created successfully
      </p>
      
      {/* XP Reward */}
      <div style={{ padding: '24px 0' }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '20px 40px', 
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
          borderRadius: '16px',
          border: '2px solid #10b981'
        }}>
          <div style={{ fontSize: '14px', color: '#059669', fontWeight: '600', marginBottom: '8px' }}>
            🎁 Registration Reward
          </div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#059669' }}>+30 XP</div>
        </div>
      </div>
    </div>
  );
};

// Inner modal content that uses Dynamic context
const InviteModalContent = ({ onClose, inviteCodeFromUrl, redirectUrl }) => {
  const { user, primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext();
  
  // Steps: 1=connect wallet, 2=invite code, 3=twitter, 4=complete, 5=welcome (already registered)
  const [currentStep, setCurrentStep] = useState(1);
  const [inviteCode, setInviteCode] = useState(inviteCodeFromUrl || '');
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingWallet, setIsCheckingWallet] = useState(false);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingRegistration, setExistingRegistration] = useState(null);

  const isWalletConnected = !!primaryWallet;
  const walletAddress = primaryWallet?.address || '';

  // Check for invite code in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref') || urlParams.get('invite');
    if (refCode && !inviteCode) {
      setInviteCode(refCode);
    }
  }, [inviteCode]);

  // Check wallet registration when wallet connects
  const checkWalletRegistration = useCallback(async (address) => {
    if (!address) return;
    
    setIsCheckingWallet(true);
    setError('');
    
    try {
      const response = await fetch(`${API}/wallet/check/${address}`);
      const data = await response.json();
      
      if (data.is_registered) {
        // Wallet is already registered - skip to welcome
        setExistingRegistration(data);
        setInviteCode(data.invite_code || '');
        setTwitterUsername(data.twitter_username || '');
        setIsTwitterConnected(!!data.twitter_username);
        setCurrentStep(5); // Welcome step
      } else {
        // New wallet - proceed to invite code step
        setCurrentStep(2);
      }
    } catch (err) {
      console.error('Error checking wallet:', err);
      // On error, proceed normally to invite code step
      setCurrentStep(2);
    } finally {
      setIsCheckingWallet(false);
    }
  }, []);

  // Handle wallet connection changes
  useEffect(() => {
    if (isWalletConnected && walletAddress && currentStep === 1) {
      checkWalletRegistration(walletAddress);
    }
  }, [isWalletConnected, walletAddress, currentStep, checkWalletRegistration]);

  // Handle disconnect - reset to step 1
  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await handleLogOut();
      // Reset all state
      setCurrentStep(1);
      setInviteCode(inviteCodeFromUrl || '');
      setIsTwitterConnected(false);
      setTwitterUsername('');
      setAcceptedTerms(false);
      setShowConfetti(false);
      setShowSuccess(false);
      setExistingRegistration(null);
      setError('');
    } catch (err) {
      console.error('Error disconnecting:', err);
      setError('Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Connect Wallet via Dynamic.xyz
  const connectWallet = () => {
    setShowAuthFlow(true);
  };

  // Step 2: Verify and register invite code
  const verifyInviteCode = async () => {
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Register wallet with invite code
      const response = await fetch(`${API}/wallet/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: walletAddress,
          invite_code: inviteCode.trim().toUpperCase()
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to verify invite code');
      }
      
      setCurrentStep(3);
    } catch (err) {
      setError(err.message || 'Failed to verify invite code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Connect Twitter
  const connectTwitter = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // TODO: Implement real Twitter OAuth flow
      const demoUsername = '@demo_user';
      setTwitterUsername(demoUsername);
      setIsTwitterConnected(true);
      
      // Update registration with Twitter
      await fetch(`${API}/wallet/update/${walletAddress}?twitter_username=${encodeURIComponent(demoUsername)}`, {
        method: 'PUT'
      });
      
      setCurrentStep(4);
    } catch (err) {
      setError('Failed to connect Twitter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Skip Twitter step
  const skipTwitter = () => {
    setCurrentStep(4);
  };

  // Step 4: Complete Registration
  const completeRegistration = async () => {
    if (!acceptedTerms) {
      setError('Please accept the Terms and Privacy Policy');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      setShowConfetti(true);
      setShowSuccess(true);
      
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3500);
    } catch (err) {
      setError('Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Continue to platform (for already registered users)
  const continueToplatform = () => {
    window.location.href = redirectUrl;
  };

  const steps = [
    { number: 1, title: 'Wallet', completed: isWalletConnected },
    { number: 2, title: 'Invite', completed: currentStep > 2 || existingRegistration },
    { number: 3, title: 'Twitter', completed: isTwitterConnected || currentStep > 3 },
    { number: 4, title: 'Done', completed: showSuccess || currentStep === 5 }
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start', // Changed from 'center' to 'flex-start'
        justifyContent: 'center',
        padding: '16px',
        paddingTop: '100px' // Add top padding to avoid header overlap
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)'
      }} />
      
      {/* Modal */}
      <div 
        style={{
          position: 'relative',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '480px',
          width: '100%',
          maxHeight: 'calc(100vh - 140px)', // Adjust for top padding
          overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Confetti overlay */}
        <Confetti active={showConfetti} />
        
        {/* Close Button */}
        {!showSuccess && currentStep !== 5 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              zIndex: 100,
              padding: 0
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M2 14L14 2" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* Loading state while checking wallet */}
        {isCheckingWallet && (
          <div style={{ padding: '48px 32px', textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ color: '#6b7280' }}>Checking wallet status...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Welcome back screen (already registered) */}
        {!isCheckingWallet && currentStep === 5 && (
          <div style={{ padding: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <LightningIcon />
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px' }}>
                Welcome Back! 👋
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Your wallet is already registered with FOMO
              </p>
              
              {/* Registration info */}
              <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Wallet</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>Invite Code</span>
                  <span style={{ fontFamily: 'monospace', color: '#10b981' }}>{existingRegistration?.invite_code || inviteCode}</span>
                </div>
                {existingRegistration?.twitter_username && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ color: '#6b7280' }}>Twitter</span>
                    <span style={{ color: '#059669' }}>{existingRegistration.twitter_username}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={continueToplatform}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  background: 'linear-gradient(to right, #10b981, #14b8a6)',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  marginBottom: '12px'
                }}
              >
                Continue to Platform 🚀
              </button>
              
              {/* Disconnect button */}
              <button
                onClick={handleDisconnect}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: 'transparent',
                  color: '#ef4444',
                  fontWeight: '500',
                  borderRadius: '12px',
                  border: '1px solid #fecaca',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                {isLoading ? 'Disconnecting...' : 'Disconnect Wallet'}
              </button>
            </div>
          </div>
        )}

        {/* Success Celebration Screen */}
        {!isCheckingWallet && showSuccess && currentStep !== 5 && (
          <div style={{ padding: '32px' }}>
            <SuccessCelebration show={showSuccess} />
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af', marginTop: '24px' }}>
              Redirecting to platform...
            </p>
          </div>
        )}
        
        {/* Main registration flow */}
        {!isCheckingWallet && !showSuccess && currentStep !== 5 && (
          <>
            {/* Header */}
            <div style={{ padding: '32px 32px 0' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <LightningIcon />
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>Welcome to FOMO</h2>
                <p style={{ color: '#6b7280', marginTop: '8px' }}>Complete these steps to get started</p>
              </div>

              {/* Progress Steps */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
                {/* Progress line */}
                <div style={{ position: 'absolute', top: '16px', left: '0', right: '0', height: '2px', background: '#e5e7eb' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      background: 'linear-gradient(to right, #10b981, #14b8a6)', 
                      transition: 'width 0.5s',
                      width: `${((currentStep - 1) / 3) * 100}%`
                    }}
                  />
                </div>
                {steps.map((step) => (
                  <div key={step.number} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                    <div 
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        background: step.completed 
                          ? '#10b981' 
                          : currentStep === step.number
                            ? 'linear-gradient(135deg, #10b981, #14b8a6)'
                            : '#f3f4f6',
                        color: step.completed || currentStep === step.number ? 'white' : '#9ca3af',
                        boxShadow: currentStep === step.number ? '0 0 0 4px rgba(16, 185, 129, 0.2)' : 'none'
                      }}
                    >
                      {step.completed ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <span style={{
                      fontSize: '12px',
                      marginTop: '8px',
                      fontWeight: '500',
                      color: currentStep === step.number ? '#059669' : '#9ca3af'
                    }}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '0 32px 32px' }}>
              {/* Error Message */}
              {error && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  color: '#dc2626',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Step 1: Connect Wallet */}
              {currentStep === 1 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    background: '#f3f4f6',
                    borderRadius: '16px',
                    marginBottom: '16px'
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="6" width="20" height="12" rx="2" />
                      <path d="M22 10H2M7 15h4" />
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Connect Your Wallet</h3>
                  <p style={{ color: '#6b7280', marginBottom: '24px' }}>Choose your preferred wallet to continue</p>
                  
                  <button
                    onClick={connectWallet}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      background: 'linear-gradient(to right, #10b981, #14b8a6)',
                      color: 'white',
                      fontWeight: '600',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      fontSize: '16px'
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Connect Wallet
                  </button>
                  
                  <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '16px' }}>
                    Supports MetaMask, WalletConnect, Coinbase & more
                  </p>
                </div>
              )}

              {/* Step 2: Enter Invite Code */}
              {currentStep === 2 && (
                <div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '80px',
                      height: '80px',
                      background: '#ecfdf5',
                      borderRadius: '16px',
                      marginBottom: '16px'
                    }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Enter Invite Code</h3>
                    <p style={{ color: '#6b7280', marginBottom: '16px' }}>Enter your invite code to claim bonus points</p>
                  </div>

                  {/* Connected Wallet Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    background: '#ecfdf5',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#047857', fontSize: '14px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </div>
                    <button
                      onClick={handleDisconnect}
                      disabled={isLoading}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '12px',
                        cursor: 'pointer',
                        padding: '4px 8px'
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Invite Code</label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      placeholder="Enter your invite code"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '12px',
                        fontSize: '18px',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        boxSizing: 'border-box'
                      }}
                      maxLength={12}
                    />
                  </div>
                  
                  <button
                    onClick={verifyInviteCode}
                    disabled={isLoading || !inviteCode.trim()}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      background: inviteCode.trim() ? 'linear-gradient(to right, #10b981, #14b8a6)' : '#e5e7eb',
                      color: inviteCode.trim() ? 'white' : '#9ca3af',
                      fontWeight: '600',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: inviteCode.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '16px'
                    }}
                  >
                    {isLoading ? 'Verifying...' : 'Continue'}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Step 3: Connect Twitter */}
              {currentStep === 3 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    background: '#111827',
                    borderRadius: '16px',
                    marginBottom: '16px'
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Connect Twitter</h3>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>Follow us on Twitter to earn extra points</p>

                  {/* Info badges */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      background: '#ecfdf5',
                      borderRadius: '8px',
                      color: '#047857',
                      fontSize: '13px'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Invite: {inviteCode}
                    </div>
                  </div>
                  
                  <button
                    onClick={connectTwitter}
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      background: '#111827',
                      color: 'white',
                      fontWeight: '600',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      fontSize: '16px',
                      marginBottom: '12px'
                    }}
                  >
                    {isLoading ? 'Connecting...' : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Connect Twitter
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={skipTwitter}
                    style={{
                      width: '100%',
                      padding: '12px 24px',
                      background: 'transparent',
                      color: '#6b7280',
                      fontWeight: '500',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '15px'
                    }}
                  >
                    Skip for now
                  </button>
                </div>
              )}

              {/* Step 4: Complete Registration */}
              {currentStep === 4 && !showSuccess && (
                <div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                      borderRadius: '16px',
                      marginBottom: '16px'
                    }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <path d="M22 4L12 14.01l-3-3" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Almost Done!</h3>
                    <p style={{ color: '#6b7280', marginBottom: '20px' }}>Review and complete your registration</p>
                  </div>

                  {/* Summary */}
                  <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#6b7280' }}>Wallet</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#6b7280' }}>Invite Code</span>
                      <span style={{ fontFamily: 'monospace' }}>{inviteCode}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                      <span style={{ color: '#6b7280' }}>Twitter</span>
                      <span style={{ color: isTwitterConnected ? '#059669' : '#9ca3af' }}>
                        {isTwitterConnected ? twitterUsername : 'Not connected'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Terms Checkbox */}
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '20px' }}>
                    <div 
                      onClick={() => setAcceptedTerms(!acceptedTerms)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: acceptedTerms ? 'none' : '2px solid #d1d5db',
                        background: acceptedTerms ? '#10b981' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      {acceptedTerms && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: '14px', color: '#4b5563' }}>
                      I have read and accept the{' '}
                      <a href="#" style={{ color: '#10b981', textDecoration: 'none' }}>Privacy Policy</a>
                      {' '}and{' '}
                      <a href="#" style={{ color: '#10b981', textDecoration: 'none' }}>Terms and Conditions</a>
                    </span>
                  </label>
                  
                  <button
                    onClick={completeRegistration}
                    disabled={isLoading || !acceptedTerms}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      background: acceptedTerms ? 'linear-gradient(to right, #10b981, #14b8a6)' : '#e5e7eb',
                      color: acceptedTerms ? 'white' : '#9ca3af',
                      fontWeight: '600',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: acceptedTerms ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '16px'
                    }}
                  >
                    {isLoading ? 'Processing...' : 'Dive into FOMO 🚀'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Main wrapper component with Dynamic Provider
const InviteModal = ({ isOpen, onClose, inviteCodeFromUrl, redirectUrl = '/platform' }) => {
  if (!isOpen) return null;

  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <InviteModalContent 
        onClose={onClose} 
        inviteCodeFromUrl={inviteCodeFromUrl}
        redirectUrl={redirectUrl}
      />
    </DynamicContextProvider>
  );
};

export default InviteModal;
