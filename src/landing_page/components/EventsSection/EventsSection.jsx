import EventCard from "../EventCard/EventCard";
import data from "../../../Data/data.json";
import "./EventsSection.css";

const EventSections = ({ filters }) => {
  const { location, eventType, date } = filters || {};

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(dateString);
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate().toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
  };

  const filteredData = data.filter(eventItem => {
    const eventDateFormatted = formatDate(eventItem.eventDate);
    const filterDateFormatted = date ? formatDate(date) : '';

    const matchesLocation = !location || 
      (eventItem.location || '').toLowerCase().includes(location.toLowerCase());
    const matchesEventType = !eventType || 
      (eventItem.eventType || '').toLowerCase().includes(eventType.toLowerCase());
    const matchesDate = !date || 
      eventDateFormatted === filterDateFormatted;

    return matchesLocation && matchesEventType && matchesDate;
  });

  return (
    <div className="eventsSection">
      {filteredData.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventSections;