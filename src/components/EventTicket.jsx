import React from 'react';
import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/EventTicket.css';

const EventTicket = ({ event, purchaseData, ticketType, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
  
  const handleDownloadTicket = () => {
    // A simple implementation for download functionality
    alert('Download functionality would be implemented here');
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

export default EventTicket; 