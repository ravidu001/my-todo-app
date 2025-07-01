import { AuthProvider, useAuth } from './contexts/AuthContext';
import React, { useState } from 'react';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import { TodoProvider } from './contexts/TodoContext';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-secondary-50">
    <div className="flex flex-col items-center">
      <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-2 text-sm text-secondary-600">Loading...</p>
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
    return (
      <TodoProvider>
        <Dashboard />
      </TodoProvider>
    );
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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h1>
            <p className="text-red-500 mb-4">{this.state.error?.message}</p>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;