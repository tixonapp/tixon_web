import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import HeroBanner from "../components/Event_page/HeroBanner/HeroBanner";
import Description from "../components/Event_page/Description/Description";
import Venue from "../components/Event_page/Venue/Venue";
import Contact from "../components/Event_page//Contact/Contact";
import LoadingSpinner from '../components/common/LoadingSpinner';
import "./EventPage.css";

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Fetch the event data from Supabase
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            event_registrations(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (!data) {
          setError("Event not found");
          return;
        }

        // Format the event data to match the expected structure
        const formattedEvent = {
          ...data,
          eventName: data.name,
          eventDate: new Date(data.start_datetime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          // Ensure start_datetime and end_datetime are explicitly included
          start_datetime: data.start_datetime,
          end_datetime: data.end_datetime,
          eventDescription: data.description,
          location: data.location,
          images: data.poster_url ? [data.poster_url] : [],
          isAvailable: data.isAvailable,
          ticketType: data.event_registrations.event_type,
          ticketPrice: data.event_registrations?.length > 0 ? 
            `₹${data.event_registrations[0].price}` : 'Free',
          eventAgenda: data.agenda ? 
            [{ time: `${new Date(data.start_datetime).toLocaleTimeString()} - ${new Date(data.end_datetime).toLocaleTimeString()}` }] : 
            [{ time: "Time TBA" }],
          socialMedia: {} // Add social media links if available in your database
        };

        setEvent(formattedEvent);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">Error loading event</div>;
  if (!event) return <div className="error">Event not found</div>;

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
