import EventCard from "/home/vkalyanram/tixon/src/landing_page/components/EventCard/EventCard.jsx";
import './EventsSection.css';
const EventSections = () => {
  const items = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    title: `https://picsum.photos/200/300?random=${index}`
  }));

  return (
    <div className="eventsSection">
        {items.map((e) => (
            <EventCard
            key={e.id}
            name={e.title}
            ></EventCard>
        ))}
      </div>
  );
};

export default EventSections;
