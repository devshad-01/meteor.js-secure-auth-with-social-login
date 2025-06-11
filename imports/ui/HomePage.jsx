import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { showInfoToast } from './Toast.jsx';

export const HomePage = () => {
  const user = useTracker(() => Meteor.user());

  const handleLogout = () => {
    showInfoToast('👋 Logging out...', 2000);
    Meteor.logout(() => {
      showInfoToast('✅ You have been logged out successfully', 3000);
    });
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: '#007bff',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Welcome to Your Dashboard</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
            Hello, {user?.username || user?.emails?.[0]?.address || 'User'}!
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main>
        <div style={{
          background: '#f8f9fa',
          padding: '30px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>Dashboard Overview</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#666' }}>
            This is your secure dashboard. You have successfully logged in using Meteor.js 
            authentication system with email/password security.
          </p>
        </div>

        {/* User Info Card */}
        <div style={{
          background: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Your Account Information</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div>
              <strong>User ID:</strong> {user?._id}
            </div>
            {user?.username && (
              <div>
                <strong>Username:</strong> {user.username}
              </div>
            )}
            {user?.emails && (
              <div>
                <strong>Email:</strong> {user.emails[0]?.address}
                <span style={{ 
                  marginLeft: '10px', 
                  color: user.emails[0]?.verified ? 'green' : 'orange',
                  fontSize: '12px'
                }}>
                  ({user.emails[0]?.verified ? 'Verified' : 'Unverified'})
                </span>
              </div>
            )}
            <div>
              <strong>Account Created:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#007bff', marginBottom: '10px' }}>🔐 Secure Sessions</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Your session is secured with Meteor's built-in authentication system
            </p>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#28a745', marginBottom: '10px' }}>⚡ Real-time Data</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Enjoy real-time updates with Meteor's reactive data layer
            </p>
          </div>

          <div style={{
            background: 'white',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#ffc107', marginBottom: '10px' }}>🚀 Modern Stack</h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Built with React, Meteor.js 3, and modern JavaScript
            </p>
          </div>
        </div>

        {/* Security Features */}
        <div style={{
          background: '#e8f5e8',
          border: '1px solid #c3e6c3',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h3 style={{ color: '#155724', marginBottom: '15px' }}>🛡️ Security Features</h3>
          <ul style={{ color: '#155724', lineHeight: '1.8' }}>
            <li>Password hashing with bcrypt</li>
            <li>Secure session management</li>
            <li>CSRF protection</li>
            <li>Rate limiting on login attempts</li>
            <li>Secure HTTP headers</li>
            <li>Input validation and sanitization</li>
          </ul>
        </div>
      </main>
    </div>
  );
};
