// filepath: /home/anshsingh/tixon_web/src/pages/TicketDownload.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase/supabaseClient';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import EventTicket from '../components/EventTicket';
import './TicketPurchase.css';

const TicketDownload = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const ticketsContainerRef = useRef(null);

  useEffect(() => {
    const fetchTicketAndEvent = async () => {
      try {
        // Fetch ticket data
        const { data: ticketData, error: ticketError } = await supabase
          .from('user_tickets')
          .select('*')
          .eq('id', id)
          .single();

        if (ticketError) throw ticketError;
        setTicket(ticketData);

        // Fetch event data including poster_url
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id, name, start_datetime, location, poster_url')
          .eq('id', ticketData.event_id)
          .single();

        if (eventError) throw eventError;
        setEventData(eventData);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError('Failed to load ticket details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketAndEvent();
  }, [id]);

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
      pdf.save(`Tickets_${ticket.event_name}_${ticket.id}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div>Loading ticket details...</div>;
  if (error) return <div>{error}</div>;
  if (!ticket || !eventData) return <div>No ticket data found</div>;

  return (
    <div className="ticket-purchase-container payment-confirmation">
      <div className="confirmation-header">
        <h1>Your Tickets</h1>
        <p className="payment-id">Ticket ID: {ticket.id}</p>
      </div>

      <div className="confirmation-content">
        <div className="summary-section">
          <h2>Ticket Summary</h2>
          <div className="purchase-details">
            <p><strong>Event:</strong> {ticket.event_name}</p>
            <p><strong>Date:</strong> {new Date(ticket.event_datetime).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {ticket.event_location}</p>
            <p><strong>Total Amount:</strong> ₹{ticket.total_amount}</p>
            <p><strong>Purchase Time:</strong> {new Date(ticket.purchase_time).toLocaleString()}</p>
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
          {Object.entries(ticket.ticket_counts).map(([ticketType, count]) => {
            // Generate a ticket for each quantity of this ticket type
            return Array.from({ length: count }, (_, i) => (
              <EventTicket 
                key={`${ticketType}-${i}`}
                event={eventData}
                purchaseData={ticket}
                ticketType={ticketType}
                index={i}
              />
            ));
          })}
        </div>
      </div>
    </div>
  );
};

export default TicketDownload;