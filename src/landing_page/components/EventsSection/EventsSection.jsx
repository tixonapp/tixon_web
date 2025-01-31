import EventCard from "/home/vkalyanram/tixon/src/landing_page/components/EventCard/EventCard.jsx";
import './EventsSection.css';
const EventSections = () => {
  const items = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    title: `Item ${index + 1}`
  }));

  return (
    <div className="min-h-screen w-full bg-gray-100 
    px-5 sm:px-5 md:px-10  lg:px-10 top-[80px] absolute">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((e) => (
            <EventCard
            key={e.id}
            name={e.id}
            ></EventCard>
        ))}
      </div>
    </div>
  );
};

export default EventSections;
