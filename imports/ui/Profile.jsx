import React from 'react';
import { useHistory } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { showInfoToast } from './Toast.jsx';

export const Profile = () => {
  const history = useHistory();
  const user = useTracker(() => Meteor.user());

  const handleLogout = () => {
    showInfoToast('👋 Logging out...', 2000);
    Meteor.logout(() => {
      showInfoToast('✅ You have been logged out successfully', 3000);
      history.push('/login');
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
        background: '#28a745',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>👤 User Profile</h1>
          <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>
            Manage your account settings
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => history.push('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🏠 Home
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Profile Content */}
      <div style={{
        background: '#f8f9fa',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>📋 Profile Information</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '6px',
            border: '1px solid #dee2e6',
            marginBottom: '15px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>👤 User Details</h3>
            <p><strong>User ID:</strong> {user?._id || 'N/A'}</p>
            <p><strong>Email:</strong> {user?.emails?.[0]?.address || 'N/A'}</p>
            <p><strong>Username:</strong> {user?.username || 'Not set'}</p>
            <p><strong>Account Created:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '6px',
            border: '1px solid #dee2e6'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>⚙️ Account Settings</h3>
            <p style={{ color: '#6c757d', marginBottom: '15px' }}>
              Profile management features coming soon...
            </p>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                📧 Change Email
              </button>
              <button style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                🔒 Change Password
              </button>
              <button style={{
                background: '#fd7e14',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                👤 Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
