import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import AdminNav from '../components/admin/AdminNav';
import EventsTable from '../components/admin/EventsTable';
import './AdminPanel.css';

export default function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*');

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading events...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <AdminNav />
      
      <div className="admin-content">
        <div className="admin-controls">
          <button onClick={fetchEvents} className="refresh-button">
            Refresh Events
          </button>
        </div>
        
        <EventsTable events={events} onRefresh={fetchEvents} />
      </div>
    </div>
  );
}