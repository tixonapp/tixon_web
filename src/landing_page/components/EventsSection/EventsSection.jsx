import EventCard from "../EventCard/EventCard"
import data from "../../../Data/data.json"
import "./EventsSection.css"

const EventSections = () => {
  return (
    <div className="eventsSection">
      {data.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
export default EventSections

