import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import TicketTypesEditor from './TicketTypesEditor';
import './TableStyles.css';

const RegistrationsTable = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRegistration, setExpandedRegistration] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*, events(name)');

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
    fetchRegistrations();
  };

  const toggleExpand = (id) => {
    setExpandedRegistration(expandedRegistration === id ? null : id);
  };

  if (loading) return <div className="loading">Loading registrations...</div>;

  return (
    <div className="table-container">
      <h2>Event Registrations</h2>
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
          {registrations.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">No registrations found</td>
            </tr>
          ) : (
            registrations.map(registration => (
              <React.Fragment key={registration.id}>
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
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RegistrationsTable;