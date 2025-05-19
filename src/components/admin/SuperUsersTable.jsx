import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import { addSuperAdmin, removeSuperAdmin, getSuperAdmins } from '../../supabase/superAdminHelpers';
import './TableStyles.css';

const SuperUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [superAdmins, setSuperAdmins] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchUsersAndAdmins();
  }, [refreshKey]);

  const fetchUsersAndAdmins = async () => {
    try {
      setLoading(true);
      
      // Get all super admins
      const { success, data: admins, error: adminError } = await getSuperAdmins();
      
      if (!success) {
        throw new Error(adminError || 'Failed to fetch super admins');
      }
      
      // Create a map of user IDs to admin status
      const adminMap = {};
      admins.forEach(admin => {
        adminMap[admin.user_id] = true;
      });
      
      setSuperAdmins(adminMap);
      
      // Get all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*, auth_users:auth.users!id(email)')
        .order('created_at', { ascending: false });
      
      if (usersError) throw usersError;
      
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching users and admins:', error);
      setError('Failed to fetch users and admin information');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSuperAdmin = async (userId, isCurrentlySuperAdmin) => {
    try {
      // Set loading state for this specific button
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      
      let result;
      if (isCurrentlySuperAdmin) {
        result = await removeSuperAdmin(userId);
      } else {
        result = await addSuperAdmin(userId);
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update super admin status');
      }
      
      // Update local state
      setSuperAdmins(prev => ({
        ...prev,
        [userId]: !isCurrentlySuperAdmin
      }));
      
    } catch (error) {
      console.error('Error updating super admin status:', error);
      alert('Failed to update super admin status: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="table-container super-table">
      <div className="table-header">
      <h2>Users & Super Admins</h2>
        <button onClick={handleRefresh} className="refresh-button">
          Refresh Users
        </button>
      </div>
      
      {users.length === 0 ? (
        <div className="no-data-message">
          <p>No users found in the system.</p>
        </div>
      ) : (
        <div className="responsive-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
                <tr key={user.id} className={superAdmins[user.id] ? 'super-admin-row' : ''}>
                <td>{user.id}</td>
                <td>{user.auth_users?.email || 'N/A'}</td>
                <td>
                  <span className={`status-badge ${superAdmins[user.id] ? 'status-super-admin' : 'status-regular'}`}>
                    {superAdmins[user.id] ? 'Super Admin' : 'Regular User'}
                  </span>
                </td>
                  <td>{formatTimestamp(user.created_at)}</td>
                <td>
                  <button 
                    onClick={() => handleToggleSuperAdmin(user.id, superAdmins[user.id])}
                    className={superAdmins[user.id] ? 'revoke-button' : 'grant-button'}
                      disabled={actionLoading[user.id]}
                  >
                      {actionLoading[user.id] ? 
                        'Processing...' : 
                        (superAdmins[user.id] ? 'Revoke Super Admin' : 'Make Super Admin')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default SuperUsersTable; 