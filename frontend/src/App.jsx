import { AuthProvider, useAuth } from './contexts/AuthContext';
import React, { useState } from 'react';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center">
      <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-2 text-sm text-gray-600">Loading...</p>
    </div>
  </div>
);

// Main App Content
const AppContent = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <>
      {authMode === 'login' ? (
        <Login onSwitchToSignup={() => setAuthMode('signup')} />
      ) : (
        <Signup onSwitchToLogin={() => setAuthMode('login')} />
      )}
    </>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;