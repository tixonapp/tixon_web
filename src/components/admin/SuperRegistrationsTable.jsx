import { useState, useEffect, Fragment } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import TicketTypesEditor from './TicketTypesEditor';
import './TableStyles.css';

const SuperRegistrationsTable = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedRegistration, setExpandedRegistration] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegistrationsAndEvents();
  }, []);

  const fetchRegistrationsAndEvents = async () => {
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
      
      // Fetch all registrations
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setError('Failed to fetch registrations data');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationUpdate = () => {
    fetchRegistrationsAndEvents();
  };

  const toggleExpand = (id) => {
    setExpandedRegistration(expandedRegistration === id ? null : id);
  };

  if (loading) return <div className="loading">Loading registrations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="table-container">
      <h2>All Registrations (Super Admin)</h2>
      
      {registrations.length === 0 ? (
        <div className="no-data-message">
          <p>No registrations found in the system.</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Event</th>
              <th>Type</th>
              <th>Total Tickets</th>
              <th>Price</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(registration => (
              <Fragment key={registration.id}>
                <tr>
                  <td>{registration.id}</td>
                  <td>{events[registration.event_id] || 'Unknown Event'}</td>
                  <td>{registration.event_type}</td>
                  <td>{registration.total_tickets}</td>
                  <td>₹{registration.price || 0}</td>
                  <td>{new Date(registration.created_at).toLocaleString()}</td>
                  <td>
                    <button 
                      onClick={() => toggleExpand(registration.id)} 
                      className="edit-button"
                    >
                      {expandedRegistration === registration.id ? 'Hide Tickets' : 'View Tickets'}
                    </button>
                  </td>
                </tr>
                {expandedRegistration === registration.id && (
                  <tr>
                    <td colSpan="7" className="expanded-content">
                      <TicketTypesEditor 
                        registration={registration} 
                        onUpdate={handleRegistrationUpdate}
                        readOnly={true}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SuperRegistrationsTable; 