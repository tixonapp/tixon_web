import { useState, useEffect } from 'react';
import EventCard from "../EventCard/EventCard";
import { useFilters } from '../../../Context/FilterContext';
import { supabase } from '../../../supabase/supabaseClient';
import "./EventsSection.css";

const EventSections = () => {
  const { filters } = useFilters();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleEvents, setVisibleEvents] = useState(8);

  // Fetch events from Supabase with related data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch events with event_registrations data
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            event_registrations (
              id, event_type, total_tickets, price, ticket_types
            )
          `)
          .eq('isVisible', true)
         
          .order('start_datetime', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Keep the scroll position related code
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

  const filteredEvents = events.filter(event => {
    const matchesLocation = !filters.location || 
      event.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesEventType = !filters.eventType || 
      event.mode?.toLowerCase() === filters.eventType.toLowerCase();
    
    const matchesDate = !filters.date || 
      (event.start_datetime && new Date(event.start_datetime).toDateString() === filters.date.toDateString());

    return matchesLocation && matchesEventType && matchesDate;
  });

  const eventsToDisplay = filteredEvents.slice(0, visibleEvents);

  const handleLoadMore = () => {
    setVisibleEvents(prevVisible => prevVisible + 8);
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">Error loading events</div>;

  return (
    <div className="eventsSectionContainer">
      <div className="eventsSection">
        {eventsToDisplay.length > 0 ? (
          eventsToDisplay.map((event) => (
            <EventCard 
              key={event.id} 
              event={event}
            />
          ))
        ) : (
          <div className="no-events">No events found</div>
        )}
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
