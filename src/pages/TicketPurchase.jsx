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

  const ZOHO_CONFIG = {
    accountId: import.meta.env.VITE_APP_ZOHO_ACCOUNT_ID,
    apiKey: import.meta.env.VITE_APP_ZOHO_API_KEY,
    domain: 'IN'
  };

  useEffect(() => {
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
    const script = document.createElement('script');
    script.src = 'https://static.zohocdn.com/zpay/zpay-js/v1/zpayments.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const sendTicketEmail = async (email, ticketDetails) => {
    try {
      // Format ticket details into HTML
      const formattedTicketDetails = `
        <h2>Event: ${ticketDetails.event_name}</h2>
        <p><strong>Date:</strong> ${new Date(ticketDetails.event_datetime).toLocaleDateString()}</p>
        <p><strong>Location:</strong> ${ticketDetails.event_location}</p>
        <p><strong>Total Amount Paid:</strong> ₹${ticketDetails.total_amount}</p>
        <h3>Tickets:</h3>
        <ul>
          ${Object.entries(ticketDetails.ticket_counts)
            .map(
              ([ticketType, count]) =>
                `<li>${ticketType}: ${count} ticket(s)</li>`
            )
            .join('')}
        </ul>
        <h4>You can download your tickets as a PDF using the link below:</h4>
        <a href="${import.meta.env.VITE_APP_DOMAIN}/tickets/${ticketDetails.id}" target="_blank">Download PDF</a>
      `;

      // Add retry logic for failed requests
      const maxRetries = 3;
      let retryCount = 0;
      let lastError = null;

      while (retryCount < maxRetries) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_APP_SUPABASE_FUNCTION_URL}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_APP_SUPABASE_SERVICE_ROLE_KEY}`,
              },
              body: JSON.stringify({
                email,
                subject: `Your Tickets for ${ticketDetails.event_name}`,
                html: `
                  <h1>Thank you for your purchase!</h1>
                  ${formattedTicketDetails}
                `,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }

          // If successful, break the retry loop
          console.log('Ticket email sent successfully');
          return true;
        } catch (error) {
          lastError = error;
          retryCount++;
          
          // If we haven't reached max retries, wait before retrying
          if (retryCount < maxRetries) {
            // Exponential backoff: wait longer between each retry
            const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }

      // If we've exhausted all retries, throw the last error
      throw lastError;
    } catch (error) {
      console.error('Error sending ticket email:', error);
      
      // Log the error to your error tracking service
      try {
        await fetch(`${import.meta.env.VITE_APP_SUPABASE_FUNCTION_URL}/log-error`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_APP_SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            error: error.message,
            ticketId: ticketDetails.id,
            email,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (logError) {
        console.error('Failed to log error:', logError);
      }

      // Don't throw the error to prevent the purchase flow from breaking
      // Instead, we'll handle it gracefully and let the user know
      alert('There was an issue sending your ticket email. You can still access your tickets from the confirmation page.');
      return false;
    }
  };

  const handleCheckout = async () => {
    const hasTickets = Object.values(ticketCounts).some(count => count > 0);
    if (!hasTickets) return alert('Please select at least one ticket');

    const validation = validateCustomerInfo();
    if (!validation.valid) return alert(validation.message);

    setSubmitting(true);

    try {
      const paymentSession = await createPaymentSession();
      console.log('Payment session created:', paymentSession);

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

      const zpayments = new window.ZPayments({
        account_id: ZOHO_CONFIG.accountId,
        domain: ZOHO_CONFIG.domain,
        otherOptions: {
          api_key: ZOHO_CONFIG.apiKey
        }
      });

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

      try {
        const result = await zpayments.requestPaymentMethod(options);
        console.log('Payment result:', result);

        if (result && result.payment_id) {
          const ticketData = await saveTickets(result.payment_id);
          console.log('Ticket data saved successfully:', ticketData);

          // Send ticket details via email
          await sendTicketEmail(customer.email, ticketData);

          navigate(`/confirmation/${result.payment_id}`);
        } else {
          throw new Error('Payment failed: No payment ID returned');
        }
      } catch (err) {
        console.error('Widget error details:', err);
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

    const response = await fetch(`https://outhserver.onrender.com/api/create-payment-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok || data.error) {
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
    const userId = currentUser?.id || uuidv4();

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
      ticket_counts: ticketCounts,
      purchase_status: 'completed',
      event_name: event.name,
      event_datetime: event.start_datetime,
      event_location: event.location
    };

    const { error: ticketInsertError } = await supabase.from('user_tickets').insert([ticketEntry]);

    if (ticketInsertError) {
      throw new Error('Failed to save tickets: ' + ticketInsertError.message);
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