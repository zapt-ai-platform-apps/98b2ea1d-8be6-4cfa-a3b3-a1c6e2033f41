import { useState, useEffect, useRef } from 'react';
import { supabase, recordLogin } from '@/supabaseClient';
import { eventBus } from '@/modules/core/events';
import { events } from '../events';
import * as Sentry from '@sentry/browser';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRecordedLogin, setHasRecordedLogin] = useState(false);
  const hasSessionRef = useRef(false);
  
  // Use this function to update session so we also update our ref
  const updateSession = (newSession) => {
    setSession(newSession);
    hasSessionRef.current = newSession !== null;
  };
  
  // Load user profile from our database (includes role, organization, etc.)
  const loadUserProfile = async (forceRefresh = false) => {
    if (!session) return;
    
    try {
      // Check if token needs to be refreshed (force refresh or token is about to expire)
      let currentSession = session;
      const tokenExpiryThreshold = 60; // Refresh if less than 60 seconds until expiry
      
      if (forceRefresh || isTokenExpiringSoon(session, tokenExpiryThreshold)) {
        console.log('Token needs refreshing, getting a fresh session');
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (data.session) {
          console.log('Session refreshed successfully');
          updateSession(data.session);
          currentSession = data.session;
        } else {
          console.error('Failed to refresh session - no session returned');
          throw new Error('Failed to refresh session');
        }
      }
      
      console.log('Making API request to /api/getUserData with token');
      const response = await fetch('/api/getUserData', {
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`
        }
      });
      
      if (!response.ok) {
        const statusText = await response.text().catch(() => 'No response text');
        console.error(`API error: ${response.status} - ${statusText}`);
        throw new Error(`Error fetching user data: ${response.status} - ${statusText}`);
      }
      
      const profile = await response.json();
      console.log('Loaded user profile:', profile);
      
      setUserProfile(profile);
      setUser({
        ...currentSession.user,
        role: profile.role,
        orgId: profile.orgId,
        name: profile.name
      });
      
      eventBus.publish(events.USER_PROFILE_LOADED, { profile });
    } catch (error) {
      console.error('Error loading user profile:', error);
      Sentry.captureException(error, {
        extra: { 
          sessionExists: !!session,
          sessionExpiry: session?.expires_at,
          currentTimestamp: Math.floor(Date.now() / 1000)
        }
      });
      
      // If token is likely invalid or expired, try one more refresh
      if (error.message.includes('401') && !forceRefresh) {
        console.log('401 error detected, attempting token refresh and retry');
        return loadUserProfile(true);
      }
    }
  };
  
  // Helper function to check if token is close to expiring
  const isTokenExpiringSoon = (session, thresholdSeconds = 60) => {
    if (!session?.expires_at) return false;
    
    const expiryTime = session.expires_at;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = expiryTime - currentTime;
    
    console.log(`Token expires in ${timeUntilExpiry} seconds`);
    return timeUntilExpiry < thresholdSeconds;
  };
  
  useEffect(() => {
    // Check active session on initial mount
    const checkSession = async () => {
      try {
        console.log('Checking initial auth session');
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        // Set initial session
        if (data.session) {
          console.log('Initial session found');
          updateSession(data.session);
          hasSessionRef.current = true;
        } else {
          console.log('No initial session found');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        Sentry.captureException(error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth event:', event, 'Has session:', hasSessionRef.current);
      
      // For SIGNED_IN, only update session if we don't have one
      if (event === 'SIGNED_IN') {
        if (!hasSessionRef.current) {
          console.log('Sign in detected, updating session');
          updateSession(newSession);
          if (newSession?.user?.email) {
            eventBus.publish(events.USER_SIGNED_IN, { user: newSession.user });
            setHasRecordedLogin(false);
          }
        } else {
          console.log('Already have session, ignoring SIGNED_IN event');
        }
      }
      // For TOKEN_REFRESHED, always update the session
      else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed event detected, updating session');
        updateSession(newSession);
      }
      // For SIGNED_OUT, clear the session
      else if (event === 'SIGNED_OUT') {
        console.log('Sign out detected, clearing session and user data');
        updateSession(null);
        setUserProfile(null);
        setUser(null);
        eventBus.publish(events.USER_SIGNED_OUT, {});
        setHasRecordedLogin(false);
      }
    });
    
    return () => {
      console.log('Cleaning up auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, []); // No dependencies to prevent re-creating the listener
  
  // Record login in ZAPT
  useEffect(() => {
    if (session?.user?.email && !hasRecordedLogin) {
      try {
        console.log('Recording login for', session.user.email);
        recordLogin(session.user.email, import.meta.env.VITE_PUBLIC_APP_ENV);
        setHasRecordedLogin(true);
      } catch (error) {
        console.error('Failed to record login:', error);
        Sentry.captureException(error);
      }
    }
  }, [session, hasRecordedLogin]);
  
  // Load user profile when session changes
  useEffect(() => {
    if (session) {
      console.log('Session updated, loading user profile');
      loadUserProfile();
    }
  }, [session]);
  
  const signOut = async () => {
    try {
      console.log('Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  // Function to manually refresh the token and profile
  const refreshAuth = async () => {
    try {
      console.log('Manually refreshing auth token');
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (data.session) {
        updateSession(data.session);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing auth:', error);
      Sentry.captureException(error);
      return false;
    }
  };
  
  return {
    session,
    user,
    userProfile,
    loading,
    signOut,
    refreshProfile: loadUserProfile,
    refreshAuth
  };
}

export default useAuth;