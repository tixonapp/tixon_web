import { useLocation } from "react-router-dom";
import events from "../Data/data.json";
import HeroBanner from "../Event_page/components/HeroBanner/HeroBanner";
import Description from "../Event_page/components/Description/Description";
import Venue from "../Event_page/components/Venue/Venue";
import Contact from "../Event_page/components/Contact/Contact";

import "./EventPage.css";

const useQuery = () => new URLSearchParams(useLocation().search);

const EventPage = () => {
  const query = useQuery();
  const id = query.get("id");
  const event = events[id ? parseInt(id, 10) : -1];

  if (!event) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h2><strong>Event Not Found</strong></h2>
          <p>The requested event does not exist.</p>
          {/* <BackButton /> */}
        </div>
      </div>
    );
  }

  return (
    <div className="event-page">
      <HeroBanner event={event} />
      <Description event={event} />
       <Venue event={event} />
       <Contact />
      

    </div>
  );
};

export default EventPage;