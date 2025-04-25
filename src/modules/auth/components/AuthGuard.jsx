import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

const AuthGuard = ({ requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  
  // Show loading indicator while checking authentication status
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified and user doesn't have required role, show unauthorized
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and authorized, render the protected route
  return <Outlet />;
};

export default AuthGuard;