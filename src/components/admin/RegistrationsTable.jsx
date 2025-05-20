import { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../supabase/supabaseClient';
import TicketTypesEditor from './TicketTypesEditor';
import './TableStyles.css';

const RegistrationsTable = ({ userId }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRegistration, setExpandedRegistration] = useState(null);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchUserEvents();
    }
  }, [userId]);

  const fetchUserEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id')
        .eq('creator_id', userId);

      if (error) throw error;
      setUserEvents(data || []);
      
      if (data && data.length > 0) {
        fetchRegistrations(data.map(event => event.id));
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user events:', error);
      setLoading(false);
    }
  };

  const fetchRegistrations = async (eventIds) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*, events(name)')
        .in('event_id', eventIds);

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      alert('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationUpdate = () => {
    if (userEvents && userEvents.length > 0) {
      fetchRegistrations(userEvents.map(event => event.id));
    }
  };

  const toggleExpand = (id) => {
    setExpandedRegistration(expandedRegistration === id ? null : id);
  };

  if (loading) return <div className="loading">Loading registrations...</div>;

  return (
    <div className="table-container">
      <h2>Event Registrations</h2>
      
      {userEvents.length === 0 ? (
        <div className="no-events-message">
          <p>You need to create events before viewing registrations.</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="no-data-message">
          <p>No registrations found for your events.</p>
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
                  <td>{registration.events?.name || 'N/A'}</td>
                  <td>{registration.event_type}</td>
                  <td>{registration.total_tickets}</td>
                  <td>₹{registration.price}</td>
                  <td>{new Date(registration.created_at).toLocaleString()}</td>
                  <td>
                    <button 
                      onClick={() => toggleExpand(registration.id)} 
                      className="edit-button"
                    >
                      {expandedRegistration === registration.id ? 'Hide Tickets' : 'Edit Tickets'}
                    </button>
                  </td>
                </tr>
                {expandedRegistration === registration.id && (
                  <tr>
                    <td colSpan="7" className="expanded-content">
                      <TicketTypesEditor 
                        registration={registration} 
                        onUpdate={handleRegistrationUpdate}
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

RegistrationsTable.propTypes = {
  userId: PropTypes.string.isRequired
};

export default RegistrationsTable;