import { Link } from 'react-router-dom';
import "./EventCard.css";
import React, { useState, useCallback, memo } from 'react';

const EventCard = memo(({ event }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Memoize the click handler
  const handleCardClick = useCallback(() => {
    localStorage.setItem('lastScrollPosition', window.scrollY.toString());
  }, []);

  // Memoize image handlers
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Memoize the date formatting
  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(event.eventDate);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return event.eventDate;
    }
  }, [event.eventDate]);

  return (
    <Link 
      to={`/event/${event.id}`} 
      className="eventCardLink" 
      onClick={handleCardClick}
      aria-label={`View details for ${event.eventName}`}
    >
      <article className="eventCard">
        <div className="eventImageContainer">
          {!imageLoaded && (
            <div className="imageSkeleton" aria-hidden="true" />
          )}
          <img
            src={imageError ? "/placeholder.svg" : event.images[0] || "/placeholder.svg"}
            alt={event.eventName}
            className={`eventImage ${imageLoaded ? 'loaded' : 'loading'}`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            width="300"
            height="300"
          />
        </div>

        <div className="eventInfo">
          <header className="eventName">
            <h3>{event.eventName}</h3>
          </header>
          
          <div className="eventMetadata">
            <address className="location">
              <svg 
                className="locationIcon" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>{event.location}</span>
            </address>
            <time className="dates" dateTime={event.eventDate}>
              {formattedDate}
            </time>
          </div>
        </div>
      </article>
    </Link>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;
