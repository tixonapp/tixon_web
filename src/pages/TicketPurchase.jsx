import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import './TicketPurchase.css';

const TicketPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCounts, setTicketCounts] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Zoho configuration from environment variables
  const ZOHO_CONFIG = {
    accountId: import.meta.env.VITE_APP_ZOHO_ACCOUNT_ID,
    apiKey: import.meta.env.VITE_APP_ZOHO_API_KEY,
    domain: 'IN'
  };

  useEffect(() => {
    // Check for authenticated user
    const getAuthUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUser(data.user);
    };
    
    getAuthUser();
    
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`*, event_registrations(*)`)
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) navigate('/');

        setEvent(data);
        initializeTicketCounts(data);
      } catch (err) {
        console.error("Error fetching event:", err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    const initializeTicketCounts = (eventData) => {
      if (eventData?.event_registrations?.ticket_types) {
        const initialCounts = {};
        eventData.event_registrations.ticket_types.forEach(ticket => {
          initialCounts[ticket.name] = 0;
        });
        setTicketCounts(initialCounts);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  useEffect(() => {
    if (event?.event_registrations?.ticket_types) {
      const newTotal = event.event_registrations.ticket_types.reduce((acc, ticket) => {
        return acc + (ticket.price * (ticketCounts[ticket.name] || 0));
      }, 0);
      setTotalAmount(newTotal);
    }
  }, [ticketCounts, event]);

  const handleTicketChange = (ticketName, change) => {
    const ticketType = event.event_registrations.ticket_types.find(t => t.name === ticketName);
    if (!ticketType) return;

    setTicketCounts(prev => {
      const currentCount = prev[ticketName] || 0;
      const newCount = Math.max(0, Math.min(currentCount + change, ticketType.quantity));
      return { ...prev, [ticketName]: newCount };
    });
  };

  const validateCustomerInfo = () => {
    const { name, email, phone } = customer;
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!name.trim()) return { valid: false, message: 'Please enter your name' };
    if (!emailRegex.test(email)) return { valid: false, message: 'Invalid email address' };
    if (!phoneRegex.test(phone)) return { valid: false, message: 'Invalid phone number (10 digits required)' };

    return { valid: true };
  };

  useEffect(() => {
    // Add the zpayments.js script to the page when component mounts
    const script = document.createElement('script');
    script.src = 'https://static.zohocdn.com/zpay/zpay-js/v1/zpayments.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove the script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    const hasTickets = Object.values(ticketCounts).some(count => count > 0);
    if (!hasTickets) return alert('Please select at least one ticket');

    const validation = validateCustomerInfo();
    if (!validation.valid) return alert(validation.message);

    setSubmitting(true);

    try {
      // Create payment session
      const paymentSession = await createPaymentSession();
      console.log('Payment session created:', paymentSession);
      
      // Make sure the script is loaded
      if (!window.ZPayments) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Timed out waiting for ZPayments to load"));
          }, 5000);
          
          const checkScript = setInterval(() => {
            if (window.ZPayments) {
              clearInterval(checkScript);
              clearTimeout(timeout);
              resolve();
            }
          }, 100);
        });
      }
      
      // Initialize Zoho Payments with proper configuration
      const zpayments = new window.ZPayments({
        account_id: ZOHO_CONFIG.accountId,
        domain: ZOHO_CONFIG.domain,
        otherOptions: {
          api_key: ZOHO_CONFIG.apiKey
        }
      });
      
      console.log('Zoho payments initialized');
      
      // Set up payment options according to Zoho documentation
      const options = {
        payments_session_id: paymentSession.id,
        amount: totalAmount.toString(),
        currency_code: "INR",
        currency_symbol: "₹",
        show_remarks: false,
        business_name: "Event Booking System",
        description: `Tickets for ${event.name}`,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        }
      };
      
      console.log('Payment options:', options);
      
      try {
        // Initiate payment with the checkout widget
        const result = await zpayments.requestPaymentMethod(options);
        console.log('Payment result:', result);
        
        // Handle successful payment
        if (result && result.payment_id) {
          // Save tickets and get the ticket data
          const ticketData = await saveTickets(result.payment_id);
          console.log('Ticket data saved successfully:', ticketData);
          
          // Redirect to payment confirmation page that shows the tickets
          navigate(`/confirmation/${result.payment_id}`);
        } else {
          throw new Error('Payment failed: No payment ID returned');
        }
      } catch (err) {
        console.error('Widget error details:', {
          message: err.message,
          code: err.code,
          name: err.name,
          stack: err.stack,
          error: JSON.stringify(err)
        });
        
        if (err.code !== 'widget_closed') {
          handlePaymentError(err);
        }
      }
    } catch (err) {
      handlePaymentError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const createPaymentSession = async () => {
    // Create request exactly as expected by the backend/Zoho API
    const requestBody = {
      amount: totalAmount,
      currency: 'INR',
      description: `Tickets for ${event.name}`,
      invoice_number: generateId('INV'),
      reference_number: generateId('REF'),
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone
    };
    
    console.log('Sending to backend:', requestBody);
    
    const response = await fetch(`https://outhserver.onrender.com/api/create-payment-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    
    // Check for errors in the response
    if (!response.ok || data.error) {
      console.error('Payment session error:', data);
      throw new Error(data.error || `HTTP Error: ${response.status}`);
    }
    
    if (!data.payments_session_id) {
      throw new Error('Payment session creation failed: No session ID returned');
    }
    
    return { id: data.payments_session_id };
  };

  const generateId = (prefix) => {
    const random = Math.random().toString(36).substr(2, 6);
    const timestamp = Date.now().toString(36);
    return `${prefix}-${random}-${timestamp}`.substring(0, 50);
  };

  const saveTickets = async (paymentId) => {
    // Get user ID if logged in, otherwise generate a UUID
    const userId = currentUser?.id || uuidv4();
    
    // Debug: log event registration data
    console.log('Full event registration:', event.event_registrations);
    console.log('Ticket counts:', ticketCounts);
    
    // Get ticket types data
    let ticketTypes = [];
    try {
      if (typeof event.event_registrations.ticket_types === 'string') {
        ticketTypes = JSON.parse(event.event_registrations.ticket_types);
      } else if (Array.isArray(event.event_registrations.ticket_types)) {
        ticketTypes = event.event_registrations.ticket_types;
      } else {
        const typesObj = event.event_registrations.ticket_types;
        ticketTypes = Object.keys(typesObj).map(key => typesObj[key]);
      }
    } catch (e) {
      console.error('Error parsing ticket types:', e);
    }
    
    console.log('Processed ticket types:', ticketTypes);
    
    // Create a single ticket entry with all ticket types
    const ticketEntry = {
      id: uuidv4(),
      event_id: event.id,
      user_id: userId,
      purchase_time: new Date().toISOString(),
      payment_id: paymentId,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      total_amount: totalAmount,
      ticket_counts: {},
      // Add these additional fields to enhance the ticket display
      purchase_status: 'completed',
      event_name: event.name,
      event_datetime: event.start_datetime,
      event_location: event.location
    };
    
    // Add ticket details to the ticket_counts JSON
    Object.keys(ticketCounts)
      .filter(ticketName => ticketCounts[ticketName] > 0)
      .forEach(ticketName => {
        const matchingTicket = ticketTypes.find(t => t.name === ticketName);
        ticketEntry.ticket_counts[ticketName] = {
          quantity: ticketCounts[ticketName],
          price: matchingTicket?.price || 0,
          ticket_type_id: matchingTicket?.id || null,
          // Add these fields for each ticket type for better display in the ticket
          ticket_name: ticketName,
          ticket_description: matchingTicket?.description || ''
        };
      });
      
    console.log('Ticket entry to insert:', ticketEntry);
    
    // Insert the consolidated ticket entry into user_tickets table
    const { error: ticketInsertError } = await supabase.from('user_tickets').insert([ticketEntry]);
    
    if (ticketInsertError) {
      console.error('Insert error details:', ticketInsertError);
      throw new Error('Failed to save tickets: ' + ticketInsertError.message);
    }
    
    // Update the ticket quantities in the event_registrations table
    // First get the current event registration data
    const { data: registrationData, error: fetchError } = await supabase
      .from('event_registrations')
      .select('ticket_types')
      .eq('event_id', event.id)
      .single();
      
    if (fetchError) {
      console.error('Error fetching current ticket data:', fetchError);
      throw new Error('Failed to update ticket quantities: ' + fetchError.message);
    }
    
    // Update the ticket quantities
    let updatedTicketTypes = [...registrationData.ticket_types];
    
    Object.keys(ticketCounts)
      .filter(ticketName => ticketCounts[ticketName] > 0)
      .forEach(ticketName => {
        const ticketIndex = updatedTicketTypes.findIndex(t => t.name === ticketName);
        if (ticketIndex !== -1) {
          // Deduct the purchased quantity from available quantity
          updatedTicketTypes[ticketIndex].quantity -= ticketCounts[ticketName];
          // Ensure quantity doesn't go below zero
          if (updatedTicketTypes[ticketIndex].quantity < 0) {
            updatedTicketTypes[ticketIndex].quantity = 0;
          }
        }
      });
    
    // Update the event_registrations table with the new ticket quantities
    const { error: updateError } = await supabase
      .from('event_registrations')
      .update({ ticket_types: updatedTicketTypes })
      .eq('event_id', event.id);
      
    if (updateError) {
      console.error('Error updating ticket quantities:', updateError);
      console.warn('Tickets were sold but quantities were not updated properly');
      // We don't throw here because the tickets were already created successfully
    } else {
      console.log('Successfully updated ticket quantities');
    }
    
    return ticketEntry;
  };

  const handlePaymentError = (error) => {
    console.error('Payment Error:', error);
    const message = error.code === 'payment_declined' 
      ? 'Payment declined. Please try another method.' 
      : 'Payment failed. Please try again.';
    alert(message);
  };

  if (loading) {
    return (
      <div className="ticket-purchase-container">
        <div className="loading">Loading event details...</div>
      </div>
    );
  }

  if (!event?.event_registrations?.ticket_types) {
    return (
      <div className="ticket-purchase-container">
        <div className="error">No tickets available for this event</div>
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
          {new Date(event.start_datetime).toLocaleDateString()} • 
          {new Date(event.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                {ticket.quantity} tickets remaining
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

      <div className="customer-info-section">
        <h2>Your Details</h2>
        <div className="customer-info-fields">
          <input
            type="text"
            placeholder="Full Name"
            value={customer.name}
            onChange={e => setCustomer({ ...customer, name: e.target.value })}
            disabled={submitting}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={customer.email}
            onChange={e => setCustomer({ ...customer, email: e.target.value })}
            disabled={submitting}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={e => setCustomer({ ...customer, phone: e.target.value })}
            maxLength="10"
            disabled={submitting}
          />
        </div>
      </div>

      <div className="checkout-section">
        <div className="total-amount">
          <span>Total Amount:</span>
          <span className="amount">₹{totalAmount}</span>
        </div>
        <div className="action-buttons">
          <button 
            className="back-button" 
            onClick={() => navigate(`/event/${id}`)}
            disabled={submitting}
          >
            Back
          </button>
          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={totalAmount <= 0 || submitting}
          >
            {submitting ? 'Processing Payment...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPurchase;