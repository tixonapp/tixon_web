import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import './TableStyles.css';

const SuperCreatorsTable = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCreator, setEditingCreator] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      
      // Fetch all creators without filtering by user ID
      const { data, error } = await supabase
        .from('event_creators')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCreators(data || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      setError('Failed to fetch creators');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (creator) => {
    setEditingCreator(creator.id);
    setFormData({ ...creator });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Add updated_at timestamp
      const updatedData = {
        ...formData,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('event_creators')
        .update(updatedData)
        .eq('id', editingCreator);

      if (error) throw error;
      
      // Update local state for immediate UI update
      setCreators(creators.map(creator => 
        creator.id === editingCreator ? { ...creator, ...updatedData } : creator
      ));
      
      setEditingCreator(null);
    } catch (error) {
      console.error('Error updating creator:', error);
      alert('Failed to update creator: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingCreator(null);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) return <div className="loading">Loading creators...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="table-container super-table">
      <div className="table-header">
      <h2>All Creators (Super Admin)</h2>
      </div>
      
      {creators.length === 0 ? (
        <div className="no-data-message">
          <p>No creators found in the system.</p>
        </div>
      ) : (
        <div className="responsive-table-wrapper">
          <table className="data-table super-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Personal Email</th>
              <th>Professional Email</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {creators.map(creator => (
                <tr key={creator.id} className={editingCreator === creator.id ? 'editing-row' : ''}>
                <td>{creator.id}</td>
                <td>
                  {editingCreator === creator.id ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  ) : (
                    creator.name || 'N/A'
                  )}
                </td>
                <td>
                  {editingCreator === creator.id ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  ) : (
                    creator.phone || 'N/A'
                  )}
                </td>
                <td>
                  {editingCreator === creator.id ? (
                    <input
                      type="email"
                      name="personal_email"
                      value={formData.personal_email || ''}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  ) : (
                    creator.personal_email || 'N/A'
                  )}
                </td>
                <td>
                  {editingCreator === creator.id ? (
                    <input
                      type="email"
                      name="professional_email"
                      value={formData.professional_email || ''}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  ) : (
                    creator.professional_email || 'N/A'
                  )}
                </td>
                  <td>{formatTimestamp(creator.created_at)}</td>
                  <td>{formatTimestamp(creator.updated_at)}</td>
                <td>
                  {editingCreator === creator.id ? (
                    <div className="action-buttons">
                        <button 
                          onClick={handleSave} 
                          className="save-button" 
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button 
                          onClick={handleCancel} 
                          className="cancel-button"
                          disabled={saving}
                        >
                          Cancel
                        </button>
                    </div>
                  ) : (
                    <button onClick={() => handleEdit(creator)} className="edit-button">Edit</button>
                  )}
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

export default SuperCreatorsTable; 