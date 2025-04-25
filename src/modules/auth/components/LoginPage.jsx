import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/supabaseClient';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function isInAppBrowser() {
  const userAgent = navigator.userAgent || window.opera;
  
  // Focus only on problematic social media in-app browsers
  if (/LinkedIn/i.test(userAgent)) return true;
  if (/FBAN|FBAV/i.test(userAgent)) return true; // Facebook
  if (/Twitter/i.test(userAgent)) return true;
  if (/Instagram/i.test(userAgent)) return true;
  
  // Return false for all other cases
  return false;
}

const LoginPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [inAppBrowser, setInAppBrowser] = useState(false);
  
  useEffect(() => {
    setInAppBrowser(isInAppBrowser());
  }, []);
  
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);
  
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          <img 
            className="mx-auto h-20 w-auto" 
            src="https://supabase.zapt.ai/storage/v1/render/image/public/icons/c7bd5333-787f-461f-ae9b-22acbc0ed4b0/55145115-0624-472f-96b9-d5d88aae355f.png?width=100&height=100" 
            alt="Apprentice 360 Logo" 
          />
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Apprentice 360</h1>
          <p className="mt-2 text-sm text-gray-600">
            UK Apprenticeship Compliance Platform
          </p>
        </div>
        
        <div>
          <div className="text-center mb-4">
            <p className="text-sm font-medium text-gray-700">
              Sign in with 
              <a 
                href="https://www.zapt.ai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
              > ZAPT
              </a>
            </p>
          </div>
          
          {inAppBrowser ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div>
                  <p className="text-sm text-yellow-700">
                    You're using an in-app browser which doesn't support Google Sign In.
                    Please open this app in your device's default browser.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
          
          <div className="bg-white shadow rounded-lg p-6">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={inAppBrowser ? [] : ['google', 'facebook']}
              magicLink={true}
              view="magic_link"
              showLinks={true}
              theme="light"
            />
          </div>
        </div>
        
        <div className="text-center mt-8">
          <div className="text-xs text-gray-500">
            <p>
              <a 
                href="https://apprentice360.co.uk/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Terms of Service
              </a> · 
              <a 
                href="https://apprentice360.co.uk/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline ml-1"
              >
                Privacy Policy
              </a> ·
              <a 
                href="https://apprentice360.co.uk/dpa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline ml-1"
              >
                GDPR Data Processing Agreement
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;