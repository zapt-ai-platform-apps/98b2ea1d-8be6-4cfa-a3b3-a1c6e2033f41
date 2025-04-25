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
  const loadUserProfile = async () => {
    if (!session) return;
    
    try {
      const response = await fetch('/api/getUserData', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.status}`);
      }
      
      const profile = await response.json();
      console.log('Loaded user profile:', profile);
      
      setUserProfile(profile);
      setUser({
        ...session.user,
        role: profile.role,
        orgId: profile.orgId,
        name: profile.name
      });
      
      eventBus.publish(events.USER_PROFILE_LOADED, { profile });
    } catch (error) {
      console.error('Error loading user profile:', error);
      Sentry.captureException(error, {
        extra: { sessionExists: !!session }
      });
    }
  };
  
  useEffect(() => {
    // Check active session on initial mount
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        // Set initial session
        updateSession(data.session);
        if (data.session) {
          hasSessionRef.current = true;
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
        updateSession(newSession);
      }
      // For SIGNED_OUT, clear the session
      else if (event === 'SIGNED_OUT') {
        updateSession(null);
        setUserProfile(null);
        setUser(null);
        eventBus.publish(events.USER_SIGNED_OUT, {});
        setHasRecordedLogin(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // No dependencies to prevent re-creating the listener
  
  // Record login in ZAPT
  useEffect(() => {
    if (session?.user?.email && !hasRecordedLogin) {
      try {
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
      loadUserProfile();
    }
  }, [session]);
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  return {
    session,
    user,
    userProfile,
    loading,
    signOut,
    refreshProfile: loadUserProfile
  };
}

export default useAuth;