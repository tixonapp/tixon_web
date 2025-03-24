import { Link } from 'react-router-dom';
import "./EventCard.css";
const EventCard = ({ event }) => {
  return (
    <Link to={`/event/${event.id}`} className="eventCardLink">
      <div className="eventCard">
        <div className="eventImageContainer">
          <img
            src={event.images[0] || "/placeholder.svg"}
            alt={event.eventName}
            className="eventImage"
          />
        </div>

        <div className="eventInfo">
          <div className="eventName">
            <h3>{event.eventName}</h3>
            
          </div>
          <div className="location">
          <h4>{event.location}</h4>

          </div>
          <p className="dates">{event.eventDate}</p>
        </div>
      </div>
    </Link>
  );
};
export default EventCard;