import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import './TableStyles.css';

const SuperOrganizersTable = () => {
  const [organizers, setOrganizers] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrganizer, setEditingOrganizer] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchOrganizersAndEvents();
  }, []);

  const fetchOrganizersAndEvents = async () => {
    try {
      setLoading(true);
      
      // Fetch all events first (for display purposes)
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, name');
      
      if (eventsError) throw eventsError;
      
      // Create a map of event IDs to names
      const eventMap = {};
      eventsData.forEach(event => {
        eventMap[event.id] = event.name;
      });
      
      setEvents(eventMap);
      
      // Fetch all organizers without filtering by event
      const { data, error } = await supabase
        .from('event_organizers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setOrganizers(data || []);
    } catch (error) {
      console.error('Error fetching organizers:', error);
      setError('Failed to fetch organizers data');
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
      fetchOrganizersAndEvents();
    } catch (error) {
      console.error('Error updating organizer:', error);
      alert('Failed to update organizer');
    }
  };

  const handleCancel = () => {
    setEditingOrganizer(null);
  };

  if (loading) return <div className="loading">Loading organizers...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="table-container">
      <h2>All Organizers (Super Admin)</h2>
      
      {organizers.length === 0 ? (
        <div className="no-data-message">
          <p>No organizers found in the system.</p>
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
              <th>Created At</th>
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
                    organizer.name || 'N/A'
                  )}
                </td>
                <td>{events[organizer.event_id] || 'Unknown Event'}</td>
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
                    organizer.phone || 'N/A'
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
                    organizer.personal_email || 'N/A'
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
                    organizer.college_email || 'N/A'
                  )}
                </td>
                <td>{organizer.created_at ? new Date(organizer.created_at).toLocaleString() : 'N/A'}</td>
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

export default SuperOrganizersTable; 