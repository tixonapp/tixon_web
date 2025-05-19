import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import EventTicket from '../components/EventTicket';
import './TicketPurchase.css';
import './PaymentConfirmation.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PaymentConfirmation = () => {
  const { paymentId } = useParams();
  const [purchaseData, setPurchaseData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const ticketsContainerRef = useRef(null);

  useEffect(() => {
    const fetchPurchaseData = async () => {
      try {
        // First, get the user_tickets entry
        const { data: ticketData, error: ticketsError } = await supabase
          .from('user_tickets')
          .select('*')
          .eq('payment_id', paymentId)
          .single();

        if (ticketsError) throw ticketsError;
        
        if (!ticketData) {
          setError('No purchase data found for this payment ID');
          return;
        }
        
        setPurchaseData(ticketData);
        
        // Fetch event details
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', ticketData.event_id)
          .single();
          
        if (eventError) throw eventError;
        setEventData(eventData);
      } catch (err) {
        console.error('Error fetching purchase details:', err);
        setError('Failed to load purchase details. Please check your email for confirmation.');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseData();
  }, [paymentId]);

  // Send email with ticket information
  useEffect(() => {
    const sendTicketEmail = async () => {
      if (!purchaseData || !eventData) return;
      
      try {
        // Send email notification with ticket details
        // This is a placeholder - replace with your actual email sending logic
        console.log('Sending ticket email to:', purchaseData.customer_email);
        
        // Example of what you might send to a backend email service
        /*
        await fetch('https://outhserver.onrender.com/api/send-ticket-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: purchaseData.customer_email,
            name: purchaseData.customer_name,
            eventName: eventData.name,
            paymentId: paymentId,
            ticketCounts: purchaseData.ticket_counts,
            event: eventData
          })
        });
        */
      } catch (err) {
        console.error('Error sending email:', err);
        // Don't show error to user, this is a background process
      }
    };
    
    // Only run once we have both purchase and event data
    if (purchaseData && eventData) {
      sendTicketEmail();
    }
  }, [purchaseData, eventData, paymentId]);

  if (loading) {
    return (
      <div className="ticket-purchase-container">
        <div className="loading">Loading payment confirmation...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-purchase-container">
        <div className="error">{error}</div>
        <p>Your payment with ID {paymentId} has been processed.</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    );
  }

  if (!purchaseData) {
    return (
      <div className="ticket-purchase-container">
        <div className="confirmation-header">
          <h1>Payment Successful!</h1>
          <p>Your payment ID is: {paymentId}</p>
          <p>No purchase details found. Please check your email for confirmation.</p>
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      </div>
    );
  }

  const ticketCounts = purchaseData.ticket_counts || {};
  const ticketTypes = Object.keys(ticketCounts);

  // Function to download all tickets as a single PDF
  const downloadAllTickets = async () => {
    if (!ticketsContainerRef.current) return;
    
    try {
      setDownloading(true);
      
      const ticketsElement = ticketsContainerRef.current;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const ticketElements = ticketsElement.querySelectorAll('.event-ticket');
      
      for (let i = 0; i < ticketElements.length; i++) {
        // For each ticket element, create a canvas and add to PDF
        const canvas = await html2canvas(ticketElements[i], {
          scale: 2,
          logging: false,
          useCORS: true,
        });
        
        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png');
        
        // Add new page for each ticket except the first one
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate dimensions to fit ticket on page
        const imgWidth = 210 - 30; // A4 width (210mm) - margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 15, 15, imgWidth, imgHeight);
      }
      
      // Save the PDF
      pdf.save(`Tickets_${eventData.name}_${paymentId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="ticket-purchase-container payment-confirmation">
      <div className="confirmation-header">
        <h1>Your Tickets are Ready!</h1>
        <p className="payment-id">Payment ID: {paymentId}</p>
      </div>

      <div className="confirmation-content">
        <div className="summary-section">
          <h2>Purchase Summary</h2>
          <div className="purchase-details">
            <p><strong>Event:</strong> {eventData?.name}</p>
            <p><strong>Date:</strong> {new Date(eventData?.start_datetime).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹{purchaseData.total_amount}</p>
              <p><strong>Purchase Time:</strong> {new Date(purchaseData.purchase_time).toLocaleString()}</p>
            </div>
          
          <button 
            className="download-all-btn" 
            onClick={downloadAllTickets}
            disabled={downloading}
          >
            {downloading ? 'Generating PDF...' : 'Download All Tickets (PDF)'}
          </button>
          </div>

        <div className="tickets-section" ref={ticketsContainerRef}>
          <h2>Your Tickets</h2>
          
          {ticketTypes.map((ticketType) => {
            const quantity = ticketCounts[ticketType].quantity;
            // Generate a ticket for each quantity of this ticket type
            return Array.from({ length: quantity }, (_, i) => (
              <EventTicket 
                key={`${ticketType}-${i}`}
                event={eventData}
                purchaseData={purchaseData}
                ticketType={ticketType}
                index={i}
              />
            ));
          })}
        </div>
      </div>

      <div className="confirmation-footer">
        <p>A confirmation email with your tickets has been sent to {purchaseData.customer_email}.</p>
        <p>You can save or print your tickets from this page.</p>
        <Link to="/" className="home-button">Return to Home</Link>
      </div>
    </div>
  );
};

export default PaymentConfirmation; 