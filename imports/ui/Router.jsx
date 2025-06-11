import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Login } from './Login.jsx';
import { HomePage } from './HomePage.jsx';
import { Profile } from './Profile.jsx';
import { ToastContainer } from './Toast.jsx';

// Loading component
const LoadingScreen = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        width: '50px', 
        height: '50px', 
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      <p>Loading...</p>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children, ...rest }) => {
  const { user, isLoading } = useTracker(() => {
    const isLoading = Meteor.loggingIn();
    const user = Meteor.user();
    return { user, isLoading };
  });

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (isLoading) {
          return <LoadingScreen />;
        }
        
        return user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        );
      }}
    />
  );
};

// Public Route component (redirects to home if already logged in)
const PublicRoute = ({ children, ...rest }) => {
  const { user, isLoading } = useTracker(() => {
    const isLoading = Meteor.loggingIn();
    const user = Meteor.user();
    return { user, isLoading };
  });

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (isLoading) {
          return <LoadingScreen />;
        }
        
        return user ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        ) : (
          children
        );
      }}
    />
  );
};

export const AppRouter = () => {
  return (
    <Router>
      <div>
        <Switch>
          {/* Public routes */}
          <PublicRoute path="/login">
            <Login />
          </PublicRoute>
          
          {/* Protected routes */}
          <ProtectedRoute exact path="/">
            <HomePage />
          </ProtectedRoute>
          
          <ProtectedRoute path="/profile">
            <Profile />
          </ProtectedRoute>
          
          {/* Default redirect */}
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
        
        {/* Toast container - always visible */}
        <ToastContainer />
      </div>
    </Router>
  );
};
