import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import './TableStyles.css';

const CreatorsTable = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCreator, setEditingCreator] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_creators')
        .select('*');

      if (error) throw error;
      setCreators(data || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      alert('Failed to fetch creators');
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
      const { error } = await supabase
        .from('event_creators')
        .update(formData)
        .eq('id', editingCreator);

      if (error) throw error;
      setEditingCreator(null);
      fetchCreators();
    } catch (error) {
      console.error('Error updating creator:', error);
      alert('Failed to update creator');
    }
  };

  const handleCancel = () => {
    setEditingCreator(null);
  };

  if (loading) return <div className="loading">Loading creators...</div>;

  return (
    <div className="table-container">
      <h2>Event Creators</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Personal Email</th>
            <th>Professional Email</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {creators.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">No creators found</td>
            </tr>
          ) : (
            creators.map(creator => (
              <tr key={creator.id}>
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
                    creator.name
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
                    creator.phone
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
                    creator.personal_email
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
                    creator.professional_email
                  )}
                </td>
                <td>{new Date(creator.created_at).toLocaleString()}</td>
                <td>
                  {editingCreator === creator.id ? (
                    <div className="action-buttons">
                      <button onClick={handleSave} className="save-button">Save</button>
                      <button onClick={handleCancel} className="cancel-button">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => handleEdit(creator)} className="edit-button">Edit</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CreatorsTable;