import { supabase } from '@/supabaseClient';

export const api = {
  /**
   * Check if the user is authenticated
   * @returns {Promise<{isAuthenticated: boolean, session: object|null}>}
   */
  async checkAuth() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return {
      isAuthenticated: !!data.session,
      session: data.session
    };
  },
  
  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};