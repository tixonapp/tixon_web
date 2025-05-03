import React from 'react';
import './Description.css';

const Description = ({ event }) => {
  if (!event) return null;

  return (
    <div>
      <div className="description-container">
        <h1 className="title">Why attend?</h1>
        <p className="description">
          {event.eventDescription || 'Event description coming soon...'}
        </p>
      </div>
    </div>
  );
};

export default Description;
