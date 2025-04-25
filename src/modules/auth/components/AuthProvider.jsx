import React, { createContext, useContext, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuth();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Wait a short time to ensure auth state is properly loaded
  // This prevents flashing of login screen when session exists
  useEffect(() => {
    if (!auth.loading) {
      const timer = setTimeout(() => {
        setInitialLoadComplete(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [auth.loading]);
  
  if (!initialLoadComplete) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;