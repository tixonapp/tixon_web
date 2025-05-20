import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';
import './EventsTable.css';
import './TableStyles.css';

const SuperEventsTable = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [creators, setCreators] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Fetch all events without filtering by creator
      const { data, error } = await supabase
        .from('events')
        .select('*, event_creators(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map creator IDs to names for display
      const creatorMap = {};
      data.forEach(event => {
        if (event.event_creators) {
          creatorMap[event.creator_id] = event.event_creators.name;
        }
      });
      
      setCreators(creatorMap);
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/super-admin/events/${eventId}`);
  };

  const toggleEventProperty = async (id, property, currentValue) => {
    try {
      setUpdating(true);
      
      // Update without checking creator_id since we're a super admin
      const { error } = await supabase
        .from('events')
        .update({ 
          [property]: !currentValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state for immediate UI update
      setEvents(events.map(event => 
        event.id === id 
          ? { ...event, [property]: !currentValue, updated_at: new Date().toISOString() } 
          : event
      ));
    } catch (error) {
      console.error(`Error updating ${property}:`, error);
      alert(`Failed to update ${property}: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="events-table-container super-table">
      {updating && <div className="loading-overlay">Updating...</div>}
      
      <div className="table-header">
        <h2>All Events (Super Admin)</h2>
        <button onClick={() => navigate('/create-event')} className="create-event-button">
          Create New Event
        </button>
      </div>
      
      <div className="responsive-table-wrapper">
      <table className="events-table">
        <thead>
          <tr>
            <th>Banner</th>
            <th>Name</th>
            <th>Creator</th>
            <th>Date</th>
            <th>Location</th>
            <th>Available</th>
            <th>Visible</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-events">
                No events found in the system.
              </td>
            </tr>
          ) : (
            events.map(event => (
              <tr key={event.id}>
                <td>
                  {event.poster_url ? (
                    <img 
                      src={event.poster_url} 
                      alt={event.name} 
                      className="event-thumbnail" 
                    />
                  ) : (
                    <div className="no-thumbnail">No Image</div>
                  )}
                </td>
                  <td className="event-name">{event.name}</td>
                <td>{creators[event.creator_id] || 'Unknown'}</td>
                  <td>
                    <div className="event-date">
                      {formatDate(event.start_datetime)}
                      {event.end_datetime && (
                        <div className="event-end-date">
                          to {formatDate(event.end_datetime)}
                        </div>
                      )}
                    </div>
                  </td>
                <td>{event.location || 'Online'}</td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={event.isAvailable}
                      onChange={() => toggleEventProperty(event.id, 'isAvailable', event.isAvailable)}
                      disabled={updating}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={event.isVisible}
                      onChange={() => toggleEventProperty(event.id, 'isVisible', event.isVisible)}
                      disabled={updating}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <button 
                    onClick={() => handleEdit(event.id)} 
                    className="edit-button"
                    disabled={updating}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default SuperEventsTable; 