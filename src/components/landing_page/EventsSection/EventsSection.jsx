import { useState, useEffect } from 'react';
import EventCard from "../EventCard/EventCard";
import { useFilters } from '../../../Context/FilterContext';
import { supabase } from '../../../supabase/supabaseClient';
import EventCarousel from '../EventCarousel/EventCarousel';
import LoadingSpinner from '../../common/LoadingSpinner';
import { 
  FaStar, 
  FaTools, 
  FaMicrophone, 
  FaFileAlt, 
  FaLaptopCode, 
  FaTheaterMasks, 
  FaBriefcase,
  FaFire,
  FaCalendarAlt
} from 'react-icons/fa';
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
    { id: 'All', name: 'All Events', icon: <FaStar /> },
    { id: 'Workshops', name: 'Workshops', icon: <FaTools /> },
    { id: 'Symposium', name: 'Symposium', icon: <FaMicrophone /> },
    { id: 'Paper Presentation', name: 'Paper Presentation', icon: <FaFileAlt /> },
    { id: 'Hackathons', name: 'Hackathons', icon: <FaLaptopCode /> },
    { id: 'Cultural Fests', name: 'Cultural Fests', icon: <FaTheaterMasks /> },
    { id: 'Entrepreneurship Events', name: 'Entrepreneurship', icon: <FaBriefcase /> }
  ];

  // Fetch events from Supabase with related data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
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
    setVisibleEvents(8);
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

  // Separate events by classification
  const upcomingEvents = filteredEvents.filter(event => event.classification === 'upcoming');
  const popularEvents = filteredEvents.filter(event => event.classification === 'popular');

  const eventsToDisplay = filteredEvents.slice(0, visibleEvents);

  const handleLoadMore = () => {
    setVisibleEvents(prevVisible => prevVisible + 8);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">Error loading events</div>;

  return (
    <div className="eventsSectionContainer">
      {/* Event Carousel */}
      <EventCarousel events={events} />
      
      {/* Category Filters */}
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

      {/* Popular Events Section */}
      {popularEvents.length > 0 && (
        <div className="eventsClassificationSection">
          <h2 className="sectionTitle">
            <span className="titleIcon"><FaFire /></span>
            Popular Events
          </h2>
          <div className="eventsGrid">
            {popularEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <div className="eventsClassificationSection">
          <h2 className="sectionTitle">
            <span className="titleIcon"><FaCalendarAlt /></span>
            Upcoming Events
          </h2>
          <div className="eventsGrid">
            {upcomingEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Events Section */}
      <div className="eventsClassificationSection">
        <h2 className="sectionTitle">
          <span className="titleIcon"><FaStar /></span>
          All Events
        </h2>
        <div className="eventsGrid">
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
    </div>
  );
};

export default EventSections;
