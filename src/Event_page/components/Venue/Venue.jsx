import React from 'react';
import './Venue.css';

const Venue = ({ event }) => {
  if (!event || !event.location) return null;

  const encodedLocation = encodeURIComponent(event.location).replace(/%20/g, '+');

  return (
    <div className="venue">
      <div className="venue-content">
  
        <div className="venue-left">
          <div className="address-card">
            <h2 className="university-name">
              {event.organizer || 'Venue Name TBA'}
            </h2>
            <div className="address-details">
              <p>{event.location}</p>
            </div>
            <hr className="divider" />
            <div className="directions-section">
              
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-button"
              >
                GET DIRECTIONS
              </a>
            </div>
          </div>
        </div>

    
        <iframe
          className="map"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodedLocation}`}
        ></iframe>
      </div>
    </div>
  );
};

export default Venue;
