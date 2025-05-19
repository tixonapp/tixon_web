import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import "./SuperAdmin.css";
import { isSuperAdmin } from '../supabase/superAdminHelpers';
import SuperAdminNav from '../components/admin/SuperAdminNav';

const SuperAdminEventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState(false);
  const [creator, setCreator] = useState(null);

  // Get authenticated user and check super admin status
  useEffect(() => {
    const checkSuperAdmin = async () => {
      try {
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (!userData || !userData.user) {
          setError('You must be logged in to access this page');
          setLoading(false);
          return;
        }
        
        setUser(userData.user);
        
        // Check if user is a super admin using our helper
        const superAdminStatus = await isSuperAdmin();
        setIsAdmin(superAdminStatus);
        
        if (!superAdminStatus) {
          setError('You do not have permission to access this page');
        }
      } catch (error) {
        console.error('Error checking super admin status:', error);
        setError('An error occurred. Please try again.');
      }
    };

    checkSuperAdmin();
  }, []);

  useEffect(() => {
    if (!user || !isAdmin) return;
    
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            event_creators(name, personal_email, professional_email),
            event_registrations(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (!data) {
          setError("Event not found");
          return;
        }

        // No creator_id restriction for super admin
        setEvent(data);
        setCreator(data.event_creators);
        
        setFormData({
          name: data.name || '',
          description: data.description || '',
          location: data.location || '',
          poster_url: data.poster_url || '',
          start_datetime: data.start_datetime ? new Date(data.start_datetime).toISOString().slice(0, 16) : '',
          end_datetime: data.end_datetime ? new Date(data.end_datetime).toISOString().slice(0, 16) : '',
          category: data.category || '',
          mode: data.mode || 'In-person',
          isVisible: data.isVisible || false,
          isAvailable: data.isAvailable || false,
          agenda: data.agenda || '',
          classification: data.classification || 'upcoming'
        });
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, isAdmin]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !isAdmin) {
      alert('You do not have permission to edit this event');
      return;
    }
    
    try {
      setSaving(true);
      
      // Update without creator_id restriction because we're super admin
      const { error } = await supabase
        .from('events')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      alert('Event updated successfully!');
      navigate('/super-admin');
    } catch (err) {
      console.error("Error updating event:", err);
      alert(`Error updating event: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="super-admin-panel">
        <h1>Edit Event</h1>
        <SuperAdminNav />
        <div className="super-admin-loading">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="super-admin-panel">
        <h1>Edit Event</h1>
        <SuperAdminNav />
        <div className="super-admin-error">
          <p><strong>Event Not Found</strong></p>
          <p>The requested event does not exist or has been removed.</p>
          <button onClick={() => navigate('/super-admin')} className="back-button">
            Back to Super Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="super-admin-panel">
      <h1>Edit Event</h1>
      <SuperAdminNav />
      <div className="super-admin-content">
        <div className="super-admin-edit-form">
          {creator && (
            <div className="creator-info">
              <h3>Creator Information</h3>
              <p><strong>Name:</strong> {creator.name}</p>
              <p><strong>Email:</strong> {creator.personal_email || creator.professional_email}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-preview">
              {formData.poster_url && (
                <img 
                  src={formData.poster_url} 
                  alt="Event poster" 
                  className="poster-preview"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              )}
            </div>

            <div className="form-group">
              <label>Event Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date-Time</label>
                <input
                  type="datetime-local"
                  name="start_datetime"
                  value={formData.start_datetime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date-Time</label>
                <input
                  type="datetime-local"
                  name="end_datetime"
                  value={formData.end_datetime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Poster URL</label>
              <input
                type="text"
                name="poster_url"
                value={formData.poster_url}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Mode</label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                >
                  <option value="In-person">In-person</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Classification</label>
                <select
                  name="classification"
                  value={formData.classification}
                  onChange={handleChange}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="popular">Popular</option>
                </select>
              </div>
            </div>

            <div className="form-row checkbox-row">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isVisible"
                    checked={formData.isVisible}
                    onChange={handleChange}
                  />
                  Visible
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                  />
                  Available
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>

            <div className="form-group">
              <label>Agenda</label>
              <textarea
                name="agenda"
                value={formData.agenda}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/super-admin')} className="cancel-button">
                Cancel
              </button>
              <button type="submit" className="save-button" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminEventEdit; 