import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import './TicketPurchase.css';

const TicketPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCounts, setTicketCounts] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Fetch event data from the parent component or API
    const fetchEvent = async () => {
      try {
        // Fetch event registration data directly
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            event_registrations(*)
          `)
          .eq('id', id)
          .single();
          
        console.log(data);

        if (error) throw error;
        
        if (!data) {
          navigate('/');
          return;
        }

        setEvent(data);
        
        // Initialize ticket counts - access ticket_types directly from event_registrations
        if (data.event_registrations?.ticket_types) {
          const initialCounts = {};
          data.event_registrations.ticket_types.forEach(ticket => {
            initialCounts[ticket.name] = 0;
          });
          setTicketCounts(initialCounts);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  useEffect(() => {
    if (event?.event_registrations?.ticket_types) {
      let total = 0;
      event.event_registrations.ticket_types.forEach(ticket => {
        total += ticket.price * (ticketCounts[ticket.name] || 0);
      });
      setTotalAmount(total);
    }
  }, [ticketCounts, event]);

  const handleTicketChange = (ticketName, change) => {
    if (!event?.event_registrations?.ticket_types) return;
    
    const ticketType = event.event_registrations.ticket_types.find(t => t.name === ticketName);
    if (!ticketType) return;
    
    const currentCount = ticketCounts[ticketName] || 0;
    const newCount = currentCount + change;
    
    // Don't allow negative counts or counts exceeding available quantity
    if (newCount < 0 || newCount > ticketType.quantity) return;
    
    setTicketCounts(prev => ({
      ...prev,
      [ticketName]: newCount
    }));
  };

  const handleCheckout = () => {
    // Check if any tickets are selected
    const hasTickets = Object.values(ticketCounts).some(count => count > 0);
    if (!hasTickets) {
      alert('Please select at least one ticket');
      return;
    }
    
  
    alert('Proceeding to checkout with selected tickets');
    // navigate('/checkout', { state: { event, ticketCounts, totalAmount } });
  };

  if (loading) {
    return (
      <div className="ticket-purchase-container">
        <div className="loading">Loading ticket information...</div>
      </div>
    );
  }

  // Check if event_registrations exists and has ticket_types
  if (!event) {
    return (
      <div className="ticket-purchase-container">
        <div className="error">No event information available</div>
        <button className="back-button" onClick={() => navigate(`/event/${id}`)}>
          Back to Event
        </button>
      </div>
    );
  }
  
  // Access event_registrations directly from the console.log data structure
  const eventRegistration = event.event_registrations;
  
  if (!eventRegistration || !eventRegistration.ticket_types) {
    return (
      <div className="ticket-purchase-container">
        <div className="error">No ticket information available</div>
        <button className="back-button" onClick={() => navigate(`/event/${id}`)}>
          Back to Event
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-purchase-container">
      <div className="ticket-header">
        <h1>{event.name}</h1>
        <p className="event-date">
          {new Date(event.start_datetime).toLocaleDateString()} at {new Date(event.start_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
      </div>

      <div className="ticket-types-container">
        <h2>Select Tickets</h2>
        
        {event.event_registrations.ticket_types.map((ticket, index) => (
          <div key={index} className="ticket-type-card">
            <div className="ticket-info">
              <h3>{ticket.name}</h3>
              <p className="ticket-price">₹{ticket.price}</p>
              <p className="ticket-availability">
                {ticket.quantity} tickets available
              </p>
            </div>
            
            <div className="ticket-quantity">
              <button 
                className="quantity-btn"
                onClick={() => handleTicketChange(ticket.name, -1)}
                disabled={ticketCounts[ticket.name] <= 0}
              >
                -
              </button>
              <span className="quantity-display">{ticketCounts[ticket.name] || 0}</span>
              <button 
                className="quantity-btn"
                onClick={() => handleTicketChange(ticket.name, 1)}
                disabled={ticketCounts[ticket.name] >= ticket.quantity}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-section">
        <div className="total-amount">
          <span>Total Amount:</span>
          <span className="amount">₹{totalAmount}</span>
        </div>
        
        <div className="action-buttons">
          <button className="back-button" onClick={() => navigate(`/event/${id}`)}>
            Back
          </button>
          <button 
            className="checkout-button"
            onClick={handleCheckout}
            disabled={totalAmount <= 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPurchase;