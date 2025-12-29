/**
 * WalletConnectModal Component
 * 
 * @description
 * Modal for connecting cryptocurrency wallets (MetaMask, WalletConnect, etc.)
 * using Dynamic.xyz SDK for multi-wallet support.
 * 
 * @features
 * - Multi-step registration flow (Wallet → Invite Code → Twitter → Complete)
 * - Support for MetaMask, WalletConnect, Coinbase Wallet and more
 * - Animated confetti celebration on successful registration
 * - Responsive design for mobile and desktop
 * - Error handling and validation
 * 
 * @dependencies
 * - @dynamic-labs/sdk-react-core
 * - @dynamic-labs/ethereum
 * 
 * @usage
 * ```jsx
 * import WalletConnectModal from '@/components/modals/WalletConnectModal';
 * 
 * <WalletConnectModal 
 *   isOpen={showModal} 
 *   onClose={() => setShowModal(false)}
 *   inviteCodeFromUrl={urlParams.get('ref')}
 *   redirectUrl="/platform"
 * />
 * ```
 * 
 * @props
 * - isOpen: boolean - Controls modal visibility
 * - onClose: function - Callback when modal is closed
 * - inviteCodeFromUrl: string - Pre-filled invite code from URL params
 * - redirectUrl: string - URL to redirect after successful registration
 * 
 * @environment
 * Requires DYNAMIC_ENVIRONMENT_ID to be configured in constants.js
 * Get your environment ID from https://app.dynamic.xyz
 * 
 * @author FOMO Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { DynamicContextProvider, DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DYNAMIC_ENVIRONMENT_ID } from '@/config/constants';

// ==================== SUB-COMPONENTS ====================

/**
 * Confetti Animation Component
 * Displays celebratory particles on successful registration
 */
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
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
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

/**
 * Lightning Icon with Glow Effect
 * Used as the main branding icon in the modal header
 */
const LightningIcon = () => (
  <div className="relative inline-flex items-center justify-center mb-4">
    {/* Outer glow */}
    <div className="absolute w-[120px] h-[120px] bg-gradient-radial from-emerald-500/25 via-teal-500/15 to-transparent rounded-full blur-[20px]" />
    
    {/* Middle glow */}
    <div className="absolute w-[90px] h-[90px] bg-gradient-radial from-emerald-500/35 to-transparent rounded-full blur-[12px]" />
    
    {/* Main icon container */}
    <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/40">
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

/**
 * Success Celebration Component
 * Displayed after successful wallet connection and registration
 */
const SuccessCelebration = ({ show }) => {
  if (!show) return null;
  
  return (
    <div className="text-center">
      {/* Animated checkmark */}
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[30px] opacity-30" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        {/* Sparkles */}
        <span className="absolute -top-2 -right-2 text-xl">✨</span>
        <span className="absolute -bottom-1 -left-3 text-lg">⭐</span>
        <span className="absolute top-0 -left-4 text-base">✨</span>
        <span className="absolute -bottom-2 right-0 text-xl">🎉</span>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to FOMO! 🚀
      </h3>
      <p className="text-gray-500">
        Your account has been created successfully
      </p>
      
      {/* Stats preview */}
      <div className="grid grid-cols-3 gap-4 py-6">
        <div className="text-center p-3 bg-emerald-50 rounded-xl">
          <div className="text-2xl font-bold text-emerald-600">0</div>
          <div className="text-xs text-gray-500">Points</div>
        </div>
        <div className="text-center p-3 bg-teal-50 rounded-xl">
          <div className="text-2xl font-bold text-teal-600">1</div>
          <div className="text-xs text-gray-500">Rank</div>
        </div>
        <div className="text-center p-3 bg-cyan-50 rounded-xl">
          <div className="text-2xl font-bold text-cyan-600">🆕</div>
          <div className="text-xs text-gray-500">Status</div>
        </div>
      </div>
    </div>
  );
};

// ==================== STEP COMPONENTS ====================

/**
 * Step 1: Connect Wallet
 */
const StepConnectWallet = ({ onConnect }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-4">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M22 10H2M7 15h4" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
    <p className="text-gray-500 mb-6">Choose your preferred wallet to continue</p>
    
    <button
      onClick={onConnect}
      className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl flex items-center justify-center gap-3 hover:shadow-lg transition-all"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Connect Wallet
    </button>
    
    <p className="text-sm text-gray-400 mt-4">
      Supports MetaMask, WalletConnect, Coinbase & more
    </p>
  </div>
);

/**
 * Step 2: Enter Invite Code
 */
const StepInviteCode = ({ inviteCode, setInviteCode, walletAddress, isLoading, onVerify }) => (
  <div>
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-2xl mb-4">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Invite Code</h3>
      <p className="text-gray-500 mb-4">Enter your invite code to claim bonus points</p>
    </div>

    {/* Connected Wallet Badge */}
    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg text-emerald-700 text-sm mb-5">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 13l4 4L19 7" />
      </svg>
      Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
    </div>
    
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">Invite Code</label>
      <input
        type="text"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
        placeholder="Enter your invite code"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg text-center font-mono tracking-wider uppercase focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        maxLength={12}
      />
    </div>
    
    <button
      onClick={onVerify}
      disabled={isLoading || !inviteCode.trim()}
      className={`w-full py-4 px-6 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
        inviteCode.trim() 
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg' 
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
      }`}
    >
      {isLoading ? 'Verifying...' : 'Continue'}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </button>
  </div>
);

/**
 * Step 3: Connect Twitter
 */
const StepConnectTwitter = ({ inviteCode, isLoading, onConnect, onSkip }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-2xl mb-4">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Twitter</h3>
    <p className="text-gray-500 mb-4">Follow us on Twitter to earn extra points</p>

    {/* Invite Code Badge */}
    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg text-emerald-700 text-sm mb-5">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 13l4 4L19 7" />
      </svg>
      Invite Code: {inviteCode}
    </div>
    
    <button
      onClick={onConnect}
      disabled={isLoading}
      className="w-full py-4 px-6 bg-gray-900 text-white font-semibold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-all mb-3"
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
      onClick={onSkip}
      className="w-full py-3 px-6 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-all"
    >
      Skip for now
    </button>
  </div>
);

/**
 * Step 4: Complete Registration
 */
const StepComplete = ({ walletAddress, inviteCode, isTwitterConnected, twitterUsername, acceptedTerms, setAcceptedTerms, isLoading, onComplete }) => (
  <div>
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Almost Done!</h3>
      <p className="text-gray-500 mb-5">Review and complete your registration</p>
    </div>

    {/* Summary */}
    <div className="bg-gray-50 rounded-xl p-4 mb-5">
      <div className="flex justify-between py-2 border-b border-gray-200">
        <span className="text-gray-500">Wallet</span>
        <span className="font-mono text-sm">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
      </div>
      <div className="flex justify-between py-2 border-b border-gray-200">
        <span className="text-gray-500">Invite Code</span>
        <span className="font-mono">{inviteCode}</span>
      </div>
      <div className="flex justify-between py-2">
        <span className="text-gray-500">Twitter</span>
        <span className={isTwitterConnected ? 'text-emerald-600' : 'text-gray-400'}>
          {isTwitterConnected ? twitterUsername : 'Not connected'}
        </span>
      </div>
    </div>
    
    {/* Terms Checkbox */}
    <label className="flex items-start gap-3 cursor-pointer mb-5">
      <div 
        onClick={() => setAcceptedTerms(!acceptedTerms)}
        className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
          acceptedTerms ? 'bg-emerald-500' : 'border-2 border-gray-300'
        }`}
      >
        {acceptedTerms && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-600">
        I have read and accept the{' '}
        <a href="#" className="text-emerald-500 hover:underline">Privacy Policy</a>
        {' '}and{' '}
        <a href="#" className="text-emerald-500 hover:underline">Terms and Conditions</a>
      </span>
    </label>
    
    <button
      onClick={onComplete}
      disabled={isLoading || !acceptedTerms}
      className={`w-full py-4 px-6 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
        acceptedTerms 
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg' 
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
      }`}
    >
      {isLoading ? 'Processing...' : 'Dive into FOMO 🚀'}
    </button>
  </div>
);

// ==================== MAIN MODAL CONTENT ====================

/**
 * Inner Modal Content Component
 * Uses Dynamic.xyz context for wallet operations
 */
const ModalContent = ({ onClose, inviteCodeFromUrl, redirectUrl }) => {
  const { user, primaryWallet, setShowAuthFlow } = useDynamicContext();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [inviteCode, setInviteCode] = useState(inviteCodeFromUrl || '');
  const [isTwitterConnected, setIsTwitterConnected] = useState(false);
  const [twitterUsername, setTwitterUsername] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  // Move to step 2 when wallet is connected
  useEffect(() => {
    if (isWalletConnected && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [isWalletConnected, currentStep]);

  // Handler functions
  const connectWallet = () => setShowAuthFlow(true);

  const verifyInviteCode = async () => {
    if (!inviteCode.trim()) {
      setError('Please enter an invite code');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // TODO: Verify invite code with backend
      setCurrentStep(3);
    } catch (err) {
      setError('Failed to verify invite code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const connectTwitter = async () => {
    setIsLoading(true);
    setError('');
    try {
      // TODO: Implement Twitter OAuth flow
      setTwitterUsername('@demo_user');
      setIsTwitterConnected(true);
      setCurrentStep(4);
    } catch (err) {
      setError('Failed to connect Twitter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const skipTwitter = () => setCurrentStep(4);

  const completeRegistration = async () => {
    if (!acceptedTerms) {
      setError('Please accept the Terms and Privacy Policy');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      // TODO: Complete registration with backend
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

  const steps = [
    { number: 1, title: 'Wallet', completed: isWalletConnected },
    { number: 2, title: 'Invite', completed: currentStep > 2 },
    { number: 3, title: 'Twitter', completed: isTwitterConnected || currentStep > 3 },
    { number: 4, title: 'Done', completed: showSuccess }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Confetti overlay */}
        <Confetti active={showConfetti} />
        
        {/* Close Button */}
        {!showSuccess && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-5 right-5 w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors z-[100]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M2 14L14 2" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* Success Screen */}
        {showSuccess ? (
          <div className="p-8">
            <SuccessCelebration show={showSuccess} />
            <p className="text-center text-sm text-gray-400 mt-6">
              Redirecting to platform...
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-8 pt-8">
              <div className="text-center mb-8">
                <LightningIcon />
                <h2 className="text-2xl font-bold text-gray-900">Welcome to FOMO</h2>
                <p className="text-gray-500 mt-2">Complete these steps to get started</p>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-between mb-8 relative">
                {/* Progress line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                  />
                </div>
                {steps.map((step) => (
                  <div key={step.number} className="relative flex flex-col items-center z-10">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        step.completed 
                          ? 'bg-emerald-500 text-white' 
                          : currentStep === step.number
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white ring-4 ring-emerald-500/20'
                            : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step.completed ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      ) : step.number}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${
                      currentStep === step.number ? 'text-emerald-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Step Content */}
              {currentStep === 1 && <StepConnectWallet onConnect={connectWallet} />}
              {currentStep === 2 && (
                <StepInviteCode 
                  inviteCode={inviteCode}
                  setInviteCode={setInviteCode}
                  walletAddress={walletAddress}
                  isLoading={isLoading}
                  onVerify={verifyInviteCode}
                />
              )}
              {currentStep === 3 && (
                <StepConnectTwitter 
                  inviteCode={inviteCode}
                  isLoading={isLoading}
                  onConnect={connectTwitter}
                  onSkip={skipTwitter}
                />
              )}
              {currentStep === 4 && !showSuccess && (
                <StepComplete 
                  walletAddress={walletAddress}
                  inviteCode={inviteCode}
                  isTwitterConnected={isTwitterConnected}
                  twitterUsername={twitterUsername}
                  acceptedTerms={acceptedTerms}
                  setAcceptedTerms={setAcceptedTerms}
                  isLoading={isLoading}
                  onComplete={completeRegistration}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ==================== MAIN EXPORT ====================

/**
 * WalletConnectModal Component
 * Main exported component with Dynamic.xyz provider wrapper
 */
const WalletConnectModal = ({ isOpen, onClose, inviteCodeFromUrl, redirectUrl = '/platform' }) => {
  if (!isOpen) return null;

  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <ModalContent 
        onClose={onClose} 
        inviteCodeFromUrl={inviteCodeFromUrl}
        redirectUrl={redirectUrl}
      />
    </DynamicContextProvider>
  );
};

export default WalletConnectModal;
