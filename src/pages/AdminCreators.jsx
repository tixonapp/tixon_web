import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import AdminNav from '../components/admin/AdminNav';
import CreatorsTable from '../components/admin/CreatorsTable';
import './AdminPanel.css';

export default function AdminCreators() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      <h1>My Profile</h1>
      <AdminNav />
      
      <div className="admin-content">
        <CreatorsTable userId={user.id} />
      </div>
    </div>
  );
}