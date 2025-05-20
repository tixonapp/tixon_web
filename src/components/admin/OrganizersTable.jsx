import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../supabase/supabaseClient';
import './TableStyles.css';

const OrganizersTable = ({ userId }) => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrganizer, setEditingOrganizer] = useState(null);
  const [formData, setFormData] = useState({});
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchOrganizers();
      fetchUserEvents();
    }
  }, [userId]);

  const fetchUserEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, name')
        .eq('creator_id', userId);

      if (error) throw error;
      setUserEvents(data || []);
    } catch (error) {
      console.error('Error fetching user events:', error);
    }
  };

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      
      // First get all events created by this user
      const { data: userEvents, error: eventsError } = await supabase
        .from('events')
        .select('id')
        .eq('creator_id', userId);
        
      if (eventsError) throw eventsError;
      
      if (!userEvents || userEvents.length === 0) {
        setOrganizers([]);
        return;
      }
      
      // Then get all organizers for these events
      const eventIds = userEvents.map(event => event.id);
      const { data, error } = await supabase
        .from('event_organizers')
        .select('*, events(name)')
        .in('event_id', eventIds);

      if (error) throw error;
      setOrganizers(data || []);
    } catch (error) {
      console.error('Error fetching organizers:', error);
      alert('Failed to fetch organizers');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (organizer) => {
    setEditingOrganizer(organizer.id);
    setFormData({ ...organizer });
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
        .from('event_organizers')
        .update(formData)
        .eq('id', editingOrganizer);

      if (error) throw error;
      setEditingOrganizer(null);
      fetchOrganizers();
    } catch (error) {
      console.error('Error updating organizer:', error);
      alert('Failed to update organizer');
    }
  };

  const handleCancel = () => {
    setEditingOrganizer(null);
  };

  if (loading) return <div className="loading">Loading organizers...</div>;

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Event Organizers</h2>
      </div>
      
      {userEvents.length === 0 ? (
        <div className="no-events-message">
          <p>You need to create events before viewing organizers.</p>
        </div>
      ) : organizers.length === 0 ? (
        <div className="no-data-message">
          <p>No organizers found for your events.</p>
          <p>Organizers can only be added through the event creation process.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Event</th>
              <th>Phone</th>
              <th>Personal Email</th>
              <th>College Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizers.map(organizer => (
              <tr key={organizer.id}>
                <td>
                  {editingOrganizer === organizer.id ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  ) : (
                    organizer.name
                  )}
                </td>
                <td>{organizer.events?.name || 'N/A'}</td>
                <td>
                  {editingOrganizer === organizer.id ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  ) : (
                    organizer.phone
                  )}
                </td>
                <td>
                  {editingOrganizer === organizer.id ? (
                    <input
                      type="email"
                      name="personal_email"
                      value={formData.personal_email || ''}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  ) : (
                    organizer.personal_email
                  )}
                </td>
                <td>
                  {editingOrganizer === organizer.id ? (
                    <input
                      type="email"
                      name="college_email"
                      value={formData.college_email || ''}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  ) : (
                    organizer.college_email
                  )}
                </td>
                <td>
                  {editingOrganizer === organizer.id ? (
                    <div className="action-buttons">
                      <button onClick={handleSave} className="save-button">Save</button>
                      <button onClick={handleCancel} className="cancel-button">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => handleEdit(organizer)} className="edit-button">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

OrganizersTable.propTypes = {
  userId: PropTypes.string.isRequired
};

export default OrganizersTable;