import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';
import './EventsTable.css';

const EventsTable = ({ events, onRefresh }) => {
  const navigate = useNavigate();

  const handleEdit = (eventId) => {
    navigate(`/admin/events/${eventId}`);
  };

  const toggleEventProperty = async (id, property, currentValue) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ [property]: !currentValue })
        .eq('id', id);

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error(`Error updating ${property}:`, error);
      alert(`Failed to update ${property}`);
    }
  };

  return (
    <div className="events-table-container">
      <table className="events-table">
        <thead>
          <tr>
            <th>Banner</th>
            <th>ID</th>
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
              <td colSpan="8" className="no-events">No events found</td>
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
                <td>{event.id}</td>
                <td>{event.name}</td>
                <td>{new Date(event.start_datetime).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={event.isAvailable || false}
                      onChange={() => toggleEventProperty(event.id, 'isAvailable', event.isAvailable)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={event.isVisible || false}
                      onChange={() => toggleEventProperty(event.id, 'isVisible', event.isVisible)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <button onClick={() => handleEdit(event.id)} className="edit-button">Edit</button>
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