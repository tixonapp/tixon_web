import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import SuperAdminNav from '../components/admin/SuperAdminNav';
import SuperCreatorsTable from '../components/admin/SuperCreatorsTable';
import { isSuperAdmin } from '../supabase/superAdminHelpers';
import './SuperAdmin.css';

export default function SuperAdminCreators() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check for authenticated user and verify super admin status
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (!userData || !userData.user) {
          setError('You must be logged in to access this page');
          setLoading(false);
          return;
        }
        
        setUser(userData.user);
        
        // Check if user is a super admin using our helper
        const superAdminStatus = await isSuperAdmin();
        setIsAdmin(superAdminStatus);
        
        if (!superAdminStatus) {
          setError('You do not have permission to access this page');
        }
      } catch (error) {
        console.error('Error checking super admin status:', error);
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    checkSuperAdmin();
  }, []);
  
  if (loading) return <div className="super-admin-loading">Loading...</div>;
  if (error) return <div className="super-admin-error">{error}</div>;
  if (!user || !isAdmin) return <div className="super-admin-error">Access denied. You need super admin privileges.</div>;
  
  return (
    <div className="super-admin-panel">
      <h1>All Creators</h1>
      <SuperAdminNav />
      <div className="super-admin-content">
        <SuperCreatorsTable />
      </div>
    </div>
  );
} 