import { supabase } from './supabaseClient';

/**
 * Check if the current authenticated user is a super admin
 * @returns {Promise<boolean>} True if the user is a super admin, false otherwise
 */
export const isSuperAdmin = async () => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return false;
    
    // Call the is_super_admin function to check if user is a super admin
    const { data, error } = await supabase.rpc('is_super_admin');
    
    if (error) {
      console.error('Error calling is_super_admin function:', error);
      return false;
    }
    
    return data;
  } catch (error) {
    console.error('Error checking super admin status:', error);
    return false;
  }
};

/**
 * Add a user as a super admin
 * @param {string} userId - The ID of the user to make a super admin
 * @returns {Promise<{success: boolean, error: any}>} Operation result
 */
export const addSuperAdmin = async (userId) => {
  try {
    // Verify current user is a super admin
    const isAdmin = await isSuperAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Only existing super admins can add new super admins' };
    }
    
    // Add the user to super_admins
    const { data, error } = await supabase
      .from('super_admins')
      .insert({ user_id: userId })
      .select();
      
    return { success: !error, error, data };
  } catch (error) {
    console.error('Error adding super admin:', error);
    return { success: false, error };
  }
};

/**
 * Remove a user from super admin role
 * @param {string} userId - The ID of the user to remove from super admin role
 * @returns {Promise<{success: boolean, error: any}>} Operation result
 */
export const removeSuperAdmin = async (userId) => {
  try {
    // Verify current user is a super admin
    const isAdmin = await isSuperAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Only existing super admins can remove super admins' };
    }
    
    // Remove the user from super_admins
    const { error } = await supabase
      .from('super_admins')
      .delete()
      .eq('user_id', userId);
      
    return { success: !error, error };
  } catch (error) {
    console.error('Error removing super admin:', error);
    return { success: false, error };
  }
};

/**
 * Get a list of all super admin users
 * @returns {Promise<{success: boolean, data: Array, error: any}>} List of super admin users
 */
export const getSuperAdmins = async () => {
  try {
    // Verify current user is a super admin
    const isAdmin = await isSuperAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Only super admins can view the list of super admins', data: [] };
    }
    
    // Get all super admins
    const { data, error } = await supabase
      .from('super_admins')
      .select('*');
      
    if (error) throw error;
      
    // Get user details for each admin
    if (data && data.length > 0) {
      // Get unique user IDs
      const userIds = data.map(admin => admin.user_id);
      
      // Get user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);
        
      if (profilesError) throw profilesError;
      
      // Combine data
      const adminsWithDetails = data.map(admin => {
        const userProfile = profiles.find(p => p.id === admin.user_id);
        return {
          ...admin,
          email: userProfile?.email || null
        };
      });
      
      return { success: true, data: adminsWithDetails, error: null };
    }
    
    return { success: true, data: data || [], error: null };
  } catch (error) {
    console.error('Error getting super admins:', error);
    return { success: false, data: [], error };
  }
}; 