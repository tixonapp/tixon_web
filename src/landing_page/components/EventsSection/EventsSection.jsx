import { useState, useEffect } from 'react';
import EventCard from "../EventCard/EventCard";
import data from "../../../Data/data.json";
import { useFilters } from '../../../Context/FilterContext';
import "./EventsSection.css";

const EventSections = () => {
  const { filters } = useFilters();
  // Initialize with default 8 items
  const [visibleEvents, setVisibleEvents] = useState(8);
  
  // cleanup
  

  
  // Keep the scroll position related code as is
  const storeScrollPosition = () => {
    if (window.location.pathname === '/') {
      localStorage.setItem('lastScrollPosition', window.scrollY.toString());
    }
  };

  useEffect(() => {
    const lastScrollPosition = localStorage.getItem('lastScrollPosition');
    if (lastScrollPosition) {
      window.scrollTo(0, parseInt(lastScrollPosition));
      localStorage.removeItem('lastScrollPosition');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('click', storeScrollPosition);
    return () => {
      window.removeEventListener('click', storeScrollPosition);
    };
  }, []);

  const filteredEvents = data.filter(event => {
    const matchesLocation = !filters.location || 
      event.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesEventType = !filters.eventType || 
      event.eventType.toLowerCase() === filters.eventType.toLowerCase();
    
    const matchesDate = !filters.date || 
      new Date(event.eventDate).toDateString() === filters.date.toDateString();

    return matchesLocation && matchesEventType && matchesDate;
  });

  const eventsToDisplay = filteredEvents.slice(0, visibleEvents);

  const handleLoadMore = () => {
    setVisibleEvents(prevVisible => prevVisible + 8);
  };


  return (
    <div className="eventsSectionContainer">
      <div className="eventsSection">
        {eventsToDisplay.map((event) => (
          <EventCard 
            key={event.id} 
            event={event}
          />
        ))}
      </div>
      {visibleEvents < filteredEvents.length && (
        <div className="loadMoreContainer">
          <button className="loadMoreButton" onClick={handleLoadMore}>
            Show More Events
          </button>
        </div>
      )}
    </div>
  );
};

export default EventSections;
