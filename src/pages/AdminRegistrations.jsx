import { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import AdminNav from '../components/admin/AdminNav';
import RegistrationsTable from '../components/admin/RegistrationsTable';
import './AdminPanel.css';

export default function AdminRegistrations() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for authenticated user
  useEffect(() => {
    const getUserSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
        setError('You must be logged in to access this page');
      } else if (data && data.user) {
        setUser(data.user);
      } else {
        setError('You must be logged in to access this page');
      }
      setLoading(false);
    };

    getUserSession();
  }, []);

  if (loading) return <div className="admin-loading">Loading...</div>;
  if (error) return <div className="admin-error">{error}</div>;
  if (!user) return <div className="admin-error">Please log in to access this page</div>;

  return (
    <div className="admin-panel">
      <h1>Event Registrations</h1>
      <AdminNav />
      
      <div className="admin-content">
        <RegistrationsTable userId={user.id} />
      </div>
    </div>
  );
}