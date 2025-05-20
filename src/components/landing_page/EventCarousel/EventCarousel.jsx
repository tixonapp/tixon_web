import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './EventCarousel.css';

const EventCarousel = ({ events }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const trackRef = useRef(null);

  // Filter events that have poster_url
  const carouselEvents = events.filter(event => event.poster_url);

  // Handle infinite scroll logic
  useEffect(() => {
    if (carouselEvents.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => {
        if (prevIndex >= carouselEvents.length - 1) {
          // When we reach the last clone, quickly reset to the real first item without animation
          setTimeout(() => {
            if (trackRef.current) {
              setIsTransitioning(false);
              setActiveIndex(0);
              setTimeout(() => setIsTransitioning(true), 50);
            }
          }, 500); // Wait for transition to complete
        }
        return prevIndex + 1;
      });
    }, 4000); // Change slide every 4 seconds
    
    return () => clearInterval(interval);
  }, [carouselEvents.length]);

  // Initialize transition state
  useEffect(() => {
    setIsTransitioning(true);
  }, []);
  
  // Manual navigation  
  const nextSlide = () => {
    setActiveIndex(prevIndex => {
      if (prevIndex >= carouselEvents.length - 1) {
        // Reset to beginning for manual navigation
        return 0;
      }
      return prevIndex + 1;
    });
  };
  
  const prevSlide = () => {
    setActiveIndex(prevIndex => {
      if (prevIndex <= 0) {
        // Go to the end for manual navigation
        return carouselEvents.length - 1;
      }
      return prevIndex - 1;
    });
  };

  if (carouselEvents.length === 0) return null;

  // Add clones for infinite effect
  const displayEvents = [
    ...carouselEvents,
    // Add the first item again at the end
    ...carouselEvents.slice(0, 1)
  ];

  return (
    <div className="event-carousel-container">
      <div className="event-carousel">
        <button className="carousel-control prev" onClick={prevSlide}>
          &lt;
        </button>
        
        <div className="carousel-track-container">
          <div 
            ref={trackRef}
            className="carousel-track" 
            style={{ 
              transform: `translateX(-${activeIndex * 100}%)`,
              transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
            }}
          >
            {displayEvents.map((event, index) => (
              <div className="carousel-slide" key={`${event.id}-${index}`}>
                <Link to={`/event/${event.id}`}>
                  <div className="event-banner">
                    <img src={event.poster_url} alt={event.name} />
                    <div className="event-banner-info">
                      <h3>{event.name}</h3>
                      <p>
                        {new Date(event.start_datetime).toLocaleDateString()} • {event.location}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <button className="carousel-control next" onClick={nextSlide}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default EventCarousel; 