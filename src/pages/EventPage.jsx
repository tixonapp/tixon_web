import { useParams } from "react-router-dom";
import events from "../Data/data.json";
import HeroBanner from "../components/Event_page/HeroBanner/HeroBanner";
import Description from "../components/Event_page/Description/Description";
import Venue from "../components/Event_page/Venue/Venue";
import Contact from "../components/Event_page//Contact/Contact";
import "./EventPage.css";

const EventPage = () => {
  const { id } = useParams();
  const event = events.find(event => event.id === parseInt(id, 10));

  if (!event) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h2><strong>Event Not Found</strong></h2>
          <p>The requested event does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="event-page">
      <HeroBanner event={event} />
      <Description event={event} />
      <Venue event={event} />
      <Contact event={event} />
    </div>
  );
};

export default EventPage;