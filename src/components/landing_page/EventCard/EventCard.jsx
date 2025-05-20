import { motion } from 'framer-motion';
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

  // Format the start date
  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(event.start_datetime);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date not available';
    }
  }, [event.start_datetime]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="event-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link 
        to={`/event/${event.id}`} 
        className="event-link" 
        onClick={handleCardClick}
        aria-label={`View details for ${event.name}`}
      >
        <motion.div 
          className="event-image-container"
          variants={imageVariants}
        >
          {!imageLoaded && (
            <div className="imageSkeleton" aria-hidden="true" />
          )}
          <img
            src={imageError ? "/placeholder.svg" : event.poster_url || "/placeholder.svg"}
            alt={event.name}
            className={`event-image ${imageLoaded ? 'loaded' : 'loading'}`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            width="300"
            height="300"
          />
        </motion.div>

        <div className="event-content">
          <header className="event-title">
            <h3>{event.name}</h3>
          </header>
          
          <div className="event-metadata">
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
            <time className="dates" dateTime={event.start_datetime}>
              {formattedDate}
            </time>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;
