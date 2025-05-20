import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../styles/EventTicket.css';

const EventTicket = ({ event, purchaseData, ticketType, index }) => {
  const [isExpanded] = useState(false);
  const ticketRef = useRef(null);
  
  if (!event || !purchaseData || !ticketType) return null;
  
  const ticketInfo = purchaseData.ticket_counts[ticketType];
  if (!ticketInfo) return null;
  
  const ticketId = `${purchaseData.payment_id}-${index}`;
  const ticketQrValue = JSON.stringify({
    event_id: event.id,
    payment_id: purchaseData.payment_id,
    ticket_type: ticketType,
    customer_name: purchaseData.customer_name,
    index: index
  });
  
  const formattedDate = new Date(event.start_datetime).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const handlePrintTicket = () => {
    const printContent = document.getElementById(`print-ticket-${ticketId}`);
    const WinPrint = window.open('', '', 'width=900,height=650');
    WinPrint.document.write('<html><head><title>Print Ticket</title>');
    WinPrint.document.write('<link rel="stylesheet" href="/src/styles/EventTicket.css">');
    WinPrint.document.write('</head><body>');
    WinPrint.document.write(printContent.innerHTML);
    WinPrint.document.write('</body></html>');
    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 500);
  };
  
  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;
    
    try {
      // Create a canvas from the ticket element
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit ticket on page
      const imgWidth = 210 - 30; // A4 width (210mm) - margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 15, 15, imgWidth, imgHeight);
      
      // Save the PDF
      pdf.save(`Ticket_${event.name}_${ticketId}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  return (
    <div className={`event-ticket ${isExpanded ? 'expanded' : ''}`} ref={ticketRef}>
      <div className="ticket-inner" id={`print-ticket-${ticketId}`}>
        {event.poster_url && (
          <div className="ticket-banner">
            <img src={event.poster_url} alt={event.name} className="event-banner-image" />
          </div>
        )}
        
        <div className="ticket-header">
          <h3 className="ticket-title">{event.name}</h3>
          <span className="ticket-type-badge">{ticketType}</span>
        </div>
        
        <div className="ticket-body">
          <div className="ticket-info">
            <div className="info-row">
              <span className="info-label">Date & Time</span>
              <span className="info-value">{formattedDate}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Location</span>
              <span className="info-value">{event.location}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Attendee</span>
              <span className="info-value">{purchaseData.customer_name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{purchaseData.customer_email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone</span>
              <span className="info-value">{purchaseData.customer_phone}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ticket ID</span>
              <span className="info-value">{ticketId}</span>
            </div>
          </div>
          
          <div className="ticket-qr">
            <QRCodeSVG 
              value={ticketQrValue} 
              size={120}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>
        
        <div className="ticket-footer">
          <div className="ticket-actions">
            <button className="ticket-action-btn" onClick={handlePrintTicket}>
              Print
            </button>
            <button className="ticket-action-btn" onClick={handleDownloadTicket}>
              Download
            </button>
          </div>
          <div className="ticket-note">
            <p>This ticket must be presented at the event entrance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

EventTicket.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    start_datetime: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    poster_url: PropTypes.string
  }).isRequired,
  purchaseData: PropTypes.shape({
    payment_id: PropTypes.string.isRequired,
    customer_name: PropTypes.string.isRequired,
    customer_email: PropTypes.string.isRequired,
    customer_phone: PropTypes.string.isRequired,
    ticket_counts: PropTypes.object.isRequired
  }).isRequired,
  ticketType: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

export default EventTicket; 