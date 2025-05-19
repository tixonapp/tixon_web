import { useState, useEffect } from 'react';
import EventCard from "../EventCard/EventCard";
import { useFilters } from '../../../Context/FilterContext';
import { supabase } from '../../../supabase/supabaseClient';
import EventCarousel from '../EventCarousel/EventCarousel';
import "./EventsSection.css";

const EventSections = () => {
  const { filters } = useFilters();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleEvents, setVisibleEvents] = useState(8);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Category definitions with icons
  const categories = [
    { id: 'All', name: 'All Events', icon: '🌟' },
    { id: 'Workshops', name: 'Workshops', icon: '🔧' },
    { id: 'Symposium', name: 'Symposium', icon: '🎤' },
    { id: 'Paper Presentation', name: 'Paper Presentation', icon: '📝' },
    { id: 'Hackathons', name: 'Hackathons', icon: '💻' },
    { id: 'Cultural Fests', name: 'Cultural Fests', icon: '🎭' },
    { id: 'Entrepreneurship Events', name: 'Entrepreneurship', icon: '💼' }
  ];

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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setVisibleEvents(8); // Reset visible events when changing category
  };

  const filteredEvents = events.filter(event => {
    const matchesLocation = !filters.location || 
      event.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesEventType = !filters.eventType || 
      event.mode?.toLowerCase() === filters.eventType.toLowerCase();
    
    const matchesDate = !filters.date || 
      (event.start_datetime && new Date(event.start_datetime).toDateString() === filters.date.toDateString());

    const matchesCategory = selectedCategory === 'All' || 
      event.category === selectedCategory;

    return matchesLocation && matchesEventType && matchesDate && matchesCategory;
  });

  const eventsToDisplay = filteredEvents.slice(0, visibleEvents);

  const handleLoadMore = () => {
    setVisibleEvents(prevVisible => prevVisible + 8);
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">Error loading events</div>;

  return (
    <div className="eventsSectionContainer">
      {/* Event Carousel */}
      <EventCarousel events={events} />
      
      <div className="categoryFilters">
        {categories.map(category => (
          <button 
            key={category.id}
            className={`categoryButton ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.id)}
          >
            <span className="categoryIcon">{category.icon}</span>
            <span className="categoryName">{category.name}</span>
          </button>
        ))}
      </div>
      
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
