import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../supabase/supabaseClient';
import './TableStyles.css';
import '../Event_form/StepIndicator';
import '../../pages/EventForm.css';

const CreatorsTable = ({ userId }) => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCreator, setEditingCreator] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (userId) {
      fetchCreators();
    }
  }, [userId]);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      
      // Get the current user's events first
      const { data: userEvents, error: eventsError } = await supabase
        .from('events')
        .select('id, creator_id')
        .eq('creator_id', userId);
        
      if (eventsError) throw eventsError;
      
      if (!userEvents || userEvents.length === 0) {
        setCreators([]);
        setLoading(false);
        return;
      }
      
      // Get unique creator IDs from the events
      const creatorIds = [...new Set(userEvents.map(event => event.creator_id))];
      
      // Now fetch the creators based on these IDs
      const { data, error } = await supabase
        .from('event_creators')
        .select('*')
        .in('id', creatorIds)
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
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="form-container">
      <h2>My Event Creators</h2>
      
      {creators.length === 0 ? (
        <div className="form-section">
          <p>You haven&apos;t created any events yet.</p>
          <p>Creator profiles are automatically added when you create events.</p>
        </div>
      ) : (
        <div className="form-section">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Personal Email</th>
                <th>Professional Email</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {creators.map(creator => (
                <tr key={creator.id} className="organizer-group">
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
                  <td>{creator.created_at ? new Date(creator.created_at).toLocaleString() : 'N/A'}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

CreatorsTable.propTypes = {
  userId: PropTypes.string.isRequired
};

export default CreatorsTable;