import React, { useState, useRef, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { useTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';
import { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } from './Toast.jsx';

// Create reactive variables for persistent state (keeping for loading state)
const isLoadingVar = new ReactiveVar(false);

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  
  // Use timeout refs to manage loading display timing
  const loadingTimeoutRef = useRef(null);
  
  // Use Tracker for reactive state management
  const { loading, currentUser, isLoggingIn } = useTracker(() => {
    return {
      loading: isLoadingVar.get(),
      currentUser: Meteor.user(),
      isLoggingIn: Meteor.loggingIn()
    };
  }, []);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to set loading state with minimum duration
  const setLoadingState = (isLoading, minDuration = 500) => {
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    isLoadingVar.set(isLoading);
    
    if (isLoading && minDuration > 0) {
      // Ensure loading state persists for minimum duration
      loadingTimeoutRef.current = setTimeout(() => {
        if (!isLoadingVar.get()) return; // Don't clear if already cleared
        // This timeout ensures loading state visibility
      }, minDuration);
    }
  };

  // Debug helper (can be removed in production)
  const debugReactiveState = () => {
    if (Meteor.isDevelopment) {
      console.log('🔍 Reactive State Debug:', {
        loading: isLoadingVar.get(),
        currentUser: !!Meteor.user(),
        isLoggingIn: Meteor.loggingIn()
      });
    }
  };

  // Call debug helper when reactive values change
  useEffect(() => {
    debugReactiveState();
  }, [loading, currentUser, isLoggingIn]);

  // Helper function to handle input changes
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Set loading state
    setLoadingState(true);

    if (isLogin) {
      // Show info toast for login attempt
      showInfoToast('🔐 Signing in...', 2000);
      
      // Login with enhanced error handling
      Meteor.loginWithPassword(email, password, (err) => {
        // Use Meteor.setTimeout for better reactivity
        Meteor.setTimeout(() => {
          setLoadingState(false);
          if (err) {
            console.error('Login error:', err);
            showErrorToast(`Login failed: ${err.message || 'Unknown error'}`, 6000);
          } else {
            // Clear form on successful login
            setEmail('');
            setPassword('');
            showSuccessToast('🎉 Welcome back! Successfully logged in.', 3000);
          }
        }, 100); // Small delay to ensure state updates are processed
      });
    } else {
      // Sign up validation
      if (password !== confirmPassword) {
        setLoadingState(false);
        showWarningToast('⚠️ Passwords do not match', 4000);
        return;
      }

      if (password.length < 6) {
        setLoadingState(false);
        showWarningToast('⚠️ Password must be at least 6 characters', 4000);
        return;
      }

      // Show info toast for signup attempt
      showInfoToast('📝 Creating your account...', 2000);

      const options = {
        email: email.trim(),
        password,
      };

      if (username.trim()) {
        options.username = username.trim();
      }

      // Create user account
      Accounts.createUser(options, (err) => {
        // Use Meteor.setTimeout for better reactivity
        Meteor.setTimeout(() => {
          setLoadingState(false);
          if (err) {
            console.error('Account creation error:', err);
            let errorMessage = 'Account creation failed';
            
            // Handle specific error types for Meteor.Error
            if (err && typeof err === 'object') {
              if ('reason' in err && err.reason) {
                errorMessage = err.reason;
              } else if ('message' in err && err.message) {
                errorMessage = err.message;
              }
            }
            
            showErrorToast(`Account creation failed: ${errorMessage}`, 6000);
          } else {
            // Clear form on successful account creation
            resetForm();
            showSuccessToast('🎉 Account created successfully! Welcome!', 4000);
          }
        }, 100); // Small delay to ensure state updates are processed
      });
    }
  };

  const handleLogout = () => {
    Meteor.logout(() => {
      showInfoToast('👋 You have been logged out', 3000);
    });
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
    // Clear reactive variables as well
    isLoadingVar.set(false);
    
    // Clear any pending timeouts
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  // Show loading state during Meteor's login process or our custom loading
  const isCurrentlyLoading = loading || isLoggingIn;

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      {/* Add CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .error-shake {
            animation: shake 0.5s ease-in-out;
          }
        `
      }} />
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          {isLogin ? '🔐 Login' : '📝 Sign Up'}
        </h2>

        {/* Loading indicator */}
        {isCurrentlyLoading && (
          <div style={{
            background: '#d1ecf1',
            color: '#0c5460',
            padding: '12px 15px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #bee5eb',
            fontSize: '14px',
            textAlign: 'center',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            <span>🔄 </span>
            {isLogin ? 'Signing in...' : 'Creating account...'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Username (optional):
              </label>
              <input
                type="text"
                value={username}
                onChange={handleInputChange(setUsername)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                placeholder="Enter username"
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={handleInputChange(setPassword)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Confirm Password:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isCurrentlyLoading}
            style={{
              width: '100%',
              padding: '12px',
              background: isCurrentlyLoading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isCurrentlyLoading ? 'not-allowed' : 'pointer',
              marginBottom: '15px',
              transition: 'background-color 0.2s ease',
              opacity: isCurrentlyLoading ? 0.7 : 1
            }}
          >
            {isCurrentlyLoading ? 
              (isLogin ? '🔐 Signing in...' : '📝 Creating account...') : 
              (isLogin ? '🔐 Login' : '📝 Sign Up')
            }
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={toggleMode}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Login"
            }
          </button>
        </div>
      </div>
    </div>
  );
};
