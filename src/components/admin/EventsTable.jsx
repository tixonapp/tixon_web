import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';
import './EventsTable.css';

const EventsTable = ({ events, onRefresh }) => {
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);

  const handleEdit = (eventId) => {
    navigate(`/admin/events/${eventId}`);
  };

  const toggleEventProperty = async (id, property, currentValue) => {
    try {
      setUpdating(true);
      
      // Get current user to ensure security
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to update events');
      }
      
      // Update with security check
      const { error } = await supabase
        .from('events')
        .update({ [property]: !currentValue })
        .eq('id', id)
        .eq('creator_id', user.id); // Ensure only the creator can update

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error(`Error updating ${property}:`, error);
      alert(`Failed to update ${property}: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="events-table-container">
      {updating && <div className="loading-overlay">Updating...</div>}
      
      <table className="events-table">
        <thead>
          <tr>
            <th>Banner</th>
            <th>Name</th>
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
              <td colSpan="7" className="no-events">
                No events found. 
                <button 
                  onClick={() => navigate('/create-event')}
                  className="create-event-button"
                >
                  Create your first event
                </button>
              </td>
            </tr>
          ) : (
            events.map(event => (
              <tr key={event.id}>
                <td className="event-poster-cell">
                  {event.poster_url ? (
                    <img 
                      src={event.poster_url} 
                      alt={`${event.name} poster`} 
                      className="event-poster-thumbnail"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100x60?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="no-poster">No Image</div>
                  )}
                </td>
                <td>{event.name}</td>
                <td>
                  {new Date(event.start_datetime).toLocaleDateString()} 
                  <br/>
                  <span className="event-time">{new Date(event.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </td>
                <td>{event.location}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={event.isAvailable || false}
                      // onChange={() => toggleEventProperty(event.id, 'isAvailable', event.isAvailable)}
                      // disabled={updating}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={event.isVisible || false}
                      // onChange={() => toggleEventProperty(event.id, 'isVisible', event.isVisible)}
                      // disabled={updating} 
                    />
                    <span className="slider round"></span>
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
  );
};

export default EventsTable;