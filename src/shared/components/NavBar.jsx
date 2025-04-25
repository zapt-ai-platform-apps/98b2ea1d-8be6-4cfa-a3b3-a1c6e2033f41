import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';

const NavBar = () => {
  const { user, signOut } = useAuthContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=32&height=32"
                alt="Apprentice 360"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">Apprentice 360</span>
            </Link>
          </div>
          
          {user && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                Dashboard
              </Link>
              
              {/* Conditionally show links based on user role */}
              {user.role === 'assessor' && (
                <Link to="/assessor" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  Evidence Inbox
                </Link>
              )}
              
              {user.role === 'iqa' && (
                <Link to="/iqa" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  Sampling
                </Link>
              )}
              
              {user.role === 'employer' && (
                <Link to="/employer" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  Employer View
                </Link>
              )}
              
              {user.role === 'admin' && (
                <Link to="/admin" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary">
                  Admin
                </Link>
              )}
              
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-dark flex items-center justify-center text-white font-medium">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </div>
                  </button>
                </div>
                
                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user.name || user.email}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Mobile menu button */}
          {user && (
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {user && isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            
            {/* Conditionally show links based on user role */}
            {user.role === 'assessor' && (
              <Link
                to="/assessor"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Evidence Inbox
              </Link>
            )}
            
            {user.role === 'iqa' && (
              <Link
                to="/iqa"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Sampling
              </Link>
            )}
            
            {user.role === 'employer' && (
              <Link
                to="/employer"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Employer View
              </Link>
            )}
            
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-dark flex items-center justify-center text-white font-medium">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user.name || user.email}</div>
                <div className="text-sm font-medium text-gray-500">{user.role}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Your Profile
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleSignOut();
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;