import React, { useState, useEffect } from 'react';

export default function Step4Registration({ formRef, formData, handleChange }) {
  const [ticketTypes, setTicketTypes] = useState(formData.ticketTypes || [
    { name: 'Silver', price: 0, quantity: 0 },
    { name: 'Gold', price: 0, quantity: 0 }
  ]);

  // Initialize ticket types if not already in formData
  useEffect(() => {
    if (!formData.ticketTypes) {
      const event = {
        target: {
          name: 'ticketTypes',
          value: ticketTypes
        }
      };
      handleChange(event);
    }
  }, []);

  // Handle changes to ticket type fields
  const handleTicketTypeChange = (index, field, value) => {
    const updatedTicketTypes = [...ticketTypes];
    updatedTicketTypes[index][field] = field === 'name' ? value : Number(value);
    setTicketTypes(updatedTicketTypes);
    
    const event = {
      target: {
        name: 'ticketTypes',
        value: updatedTicketTypes
      }
    };
    handleChange(event);
    
    // Update total tickets based on sum of all ticket quantities
    if (field === 'quantity') {
      const totalTickets = updatedTicketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0);
      const totalTicketsEvent = {
        target: {
          name: 'total_tickets',
          value: totalTickets
        }
      };
      handleChange(totalTicketsEvent);
    }
  };

  // Add a new ticket type
  const addTicketType = () => {
    const newTicketTypes = [...ticketTypes, { name: `Ticket ${ticketTypes.length + 1}`, price: 0, quantity: 0 }];
    setTicketTypes(newTicketTypes);
    
    const event = {
      target: {
        name: 'ticketTypes',
        value: newTicketTypes
      }
    };
    handleChange(event);
  };

  // Remove a ticket type
  const removeTicketType = (index) => {
    if (ticketTypes.length <= 1) return; // Keep at least one ticket type
    
    const updatedTicketTypes = ticketTypes.filter((_, i) => i !== index);
    setTicketTypes(updatedTicketTypes);
    
    const event = {
      target: {
        name: 'ticketTypes',
        value: updatedTicketTypes
      }
    };
    handleChange(event);
    
    // Update total tickets after removing a ticket type
    const totalTickets = updatedTicketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const totalTicketsEvent = {
      target: {
        name: 'total_tickets',
        value: totalTickets
      }
    };
    handleChange(totalTicketsEvent);
  };

  return (
    <form ref={formRef} className="form-section">
      <div className="form-group">
        <label>Event Type*</label>
        <select name="event_type" value={formData.event_type} onChange={handleChange} required>
          <option>Free</option>
          <option>Paid</option>
        </select>
      </div>
      
      {formData.event_type === 'Paid' && (
        <>
          <div className="ticket-types-container">
            <h3>Ticket Types</h3>
            {ticketTypes.map((ticket, index) => (
              <div key={index} className="ticket-type-row">
                <div className="form-group">
                  <label>Ticket Name*</label>
                  <input
                    name={`ticket-name-${index}`}
                    value={ticket.name}
                    onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price*</label>
                  <input
                    name={`ticket-price-${index}`}
                    type="number"
                    min="0"
                    value={ticket.price}
                    onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantity*</label>
                  <input
                    name={`ticket-quantity-${index}`}
                    type="number"
                    min="0"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketTypeChange(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="button" 
                  className="remove-ticket-btn"
                  onClick={() => removeTicketType(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button 
              type="button" 
              className="add-ticket-btn"
              onClick={addTicketType}
            >
              Add Ticket Type
            </button>
          </div>
          
          <div className="form-group">
            <label>Total Tickets*</label>
            <input
              name="total_tickets"
              type="number"
              value={formData.total_tickets}
              onChange={handleChange}
              disabled
              required
            />
            <small className="form-text">Total is calculated from the sum of all ticket quantities</small>
          </div>
        </>
      )}
      
      {formData.event_type === 'Free' && (
        <div className="form-group">
          <label>Total Tickets*</label>
          <input
            name="total_tickets"
            type="number"
            value={formData.total_tickets}
            onChange={handleChange}
            required
          />
        </div>
      )}
    </form>
  );
}
