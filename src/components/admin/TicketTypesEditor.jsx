import React, { useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import './TicketTypesEditor.css';

const TicketTypesEditor = ({ registration, onUpdate }) => {
  const [ticketTypes, setTicketTypes] = useState(registration.ticket_types || []);
  const [isEditing, setIsEditing] = useState(false);

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[index][field] = field === 'name' ? value : parseInt(value, 10);
    setTicketTypes(updatedTickets);
    
    // Update total tickets when quantity changes
    if (field === 'quantity') {
      updateTotalTickets(updatedTickets);
    }
  };
  
  const updateTotalTickets = (tickets) => {
    const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    return totalTickets;
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: `Ticket ${ticketTypes.length + 1}`, price: 0, quantity: 0 }]);
  };

  const removeTicketType = (index) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const saveChanges = async () => {
    try {
      // Calculate total tickets from all ticket types
      const totalTickets = updateTotalTickets(ticketTypes);
      
      const { error } = await supabase
        .from('event_registrations')
        .update({ 
          ticket_types: ticketTypes,
          total_tickets: totalTickets
        })
        .eq('id', registration.id);

      if (error) throw error;
      
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error('Error updating ticket types:', err);
      alert('Failed to update ticket types');
    }
  };

  if (!isEditing) {
    return (
      <div className="ticket-types-viewer">
        <div className="ticket-types-header">
          <h3>Ticket Types</h3>
          <button className="edit-button" onClick={() => setIsEditing(true)}>Edit Tickets</button>
        </div>
        
        <div className="ticket-types-list">
          {ticketTypes.length === 0 ? (
            <p className="no-tickets">No ticket types defined</p>
          ) : (
            ticketTypes.map((ticket, index) => (
              <div key={index} className="ticket-type-item">
                <div className="ticket-info">
                  <h4>{ticket.name}</h4>
                  <p className="ticket-price">₹{ticket.price}</p>
                  <p className="ticket-quantity">{ticket.quantity} tickets available</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-types-editor">
      <div className="ticket-types-header">
        <h3>Edit Ticket Types</h3>
      </div>
      
      {ticketTypes.map((ticket, index) => (
        <div key={index} className="ticket-type-form">
          <div className="ticket-field">
            <label>Name</label>
            <input
              type="text"
              value={ticket.name}
              onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
            />
          </div>
          
          <div className="ticket-field">
            <label>Price (₹)</label>
            <input
              type="number"
              min="0"
              value={ticket.price}
              onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
            />
          </div>
          
          <div className="ticket-field">
            <label>Quantity</label>
            <input
              type="number"
              min="0"
              value={ticket.quantity}
              onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
            />
          </div>
          
          <button 
            className="remove-ticket-btn"
            onClick={() => removeTicketType(index)}
          >
            Remove
          </button>
        </div>
      ))}
      
      <div className="ticket-actions">
        <button className="add-ticket-btn" onClick={addTicketType}>
          Add Ticket Type
        </button>
      </div>
      
      <div className="editor-actions">
        <button className="cancel-button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
        <button className="save-button" onClick={saveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default TicketTypesEditor;