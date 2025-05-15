import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase/supabaseClient';
import EventCard from './EventCard';

const EventCardList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('isVisible', true)
          .eq('isAvailable', true)
          .order('start_datetime', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events: {error}</div>;
  if (events.length === 0) return <div>No events available</div>;

  return (
    <div className="eventCardGrid">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventCardList;
