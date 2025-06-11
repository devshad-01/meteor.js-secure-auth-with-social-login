import React, { useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { ReactiveVar } from 'meteor/reactive-var';

// Create reactive variables for toast management
const toastsVar = new ReactiveVar([]);

let toastIdCounter = 0;

// Toast management functions
export const showToast = (message, type = 'info', duration = 4000) => {
  const toastId = ++toastIdCounter;
  const toast = {
    id: toastId,
    message,
    type, // 'success', 'error', 'warning', 'info'
    timestamp: Date.now(),
    duration
  };

  // Add toast to the list
  const currentToasts = toastsVar.get();
  toastsVar.set([...currentToasts, toast]);

  // Auto-remove toast after duration
  if (duration > 0) {
    Meteor.setTimeout(() => {
      removeToast(toastId);
    }, duration);
  }

  return toastId;
};

export const removeToast = (toastId) => {
  const currentToasts = toastsVar.get();
  toastsVar.set(currentToasts.filter(toast => toast.id !== toastId));
};

export const clearAllToasts = () => {
  toastsVar.set([]);
};

// Toast component
export const Toast = ({ toast, onRemove }) => {
  const getToastStyles = (type) => {
    const baseStyles = {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideInRight 0.3s ease-out',
      minWidth: '300px',
      maxWidth: '500px'
    };

    const typeStyles = {
      success: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        border: '1px solid #065f46'
      },
      error: {
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        color: 'white',
        border: '1px solid #991b1b'
      },
      warning: {
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: 'white',
        border: '1px solid #92400e'
      },
      info: {
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: 'white',
        border: '1px solid #1d4ed8'
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  };

  return (
    <div style={getToastStyles(toast.type)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>{getIcon(toast.type)}</span>
        <span>{toast.message}</span>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'currentColor',
          cursor: 'pointer',
          fontSize: '18px',
          opacity: 0.7,
          padding: '0 4px',
          marginLeft: '12px'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        ×
      </button>
    </div>
  );
};

// Toast container component
export const ToastContainer = () => {
  const toasts = useTracker(() => toastsVar.get(), []);

  useEffect(() => {
    // Add CSS animations to document head
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      .toast-exit {
        animation: slideOutRight 0.3s ease-in forwards;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto'
      }}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

// Utility functions for common toast types
export const showSuccessToast = (message, duration = 4000) => 
  showToast(message, 'success', duration);

export const showErrorToast = (message, duration = 6000) => 
  showToast(message, 'error', duration);

export const showWarningToast = (message, duration = 5000) => 
  showToast(message, 'warning', duration);

export const showInfoToast = (message, duration = 4000) => 
  showToast(message, 'info', duration);
