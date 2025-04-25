import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const UnauthorizedPage = () => {
  const { user, signOut } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Unauthorized Access</h1>
          <p className="mt-2 text-sm text-gray-600">
            {user ? (
              <>
                Your account ({user.email}) doesn't have permission to access this page.
              </>
            ) : (
              <>
                You need to be logged in to access this page.
              </>
            )}
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-primary cursor-pointer">
                Go to Dashboard
              </Link>
              <button 
                onClick={signOut}
                className="btn-secondary cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary cursor-pointer">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;