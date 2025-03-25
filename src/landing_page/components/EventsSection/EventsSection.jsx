import EventCard from "../EventCard/EventCard";
import data from "../../../Data/data.json";
import { useFilters } from '../../../Context/FilterContext';
import "./EventsSection.css";

const EventSections = () => {
  const { filters } = useFilters();

  // filtering the events based on the filters
  const filteredEvents = data.filter(event => {
    console.log(event.eventDate);
    const matchesLocation = !filters.location || 
      event.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesEventType = !filters.eventType || 
      event.eventType.toLowerCase() === filters.eventType.toLowerCase();
    
    const matchesDate = !filters.date || 
      new Date(event.eventDate).toDateString() === filters.date.toDateString();

    return matchesLocation && matchesEventType && matchesDate;
  });

  return (
    <div className="eventsSection">
      {filteredEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventSections;
