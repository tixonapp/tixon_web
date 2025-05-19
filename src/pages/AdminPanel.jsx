import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import AdminNav from '../components/admin/AdminNav';
import EventsTable from '../components/admin/EventsTable';
import './AdminPanel.css';

export default function AdminPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Check for authenticated user
  useEffect(() => {
    const getUserSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error);
        setError('You must be logged in to access this page');
      } else if (data && data.user) {
        setUser(data.user);
      } else {
        setError('You must be logged in to access this page');
      }
    };

    getUserSession();
  }, []);

  // Fetch user's events when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('creator_id', user.id);

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
  if (!user) return <div className="admin-error">Please log in to access the admin panel</div>;

  return (
    <div className="admin-panel">
      <h1>My Events Dashboard</h1>
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