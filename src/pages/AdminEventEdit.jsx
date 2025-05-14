import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";
import "./AdminPanel.css";

const AdminEventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
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

        setEvent(data);
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
          agenda: data.agenda || ''
        });
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('events')
        .update(formData)
        .eq('id', id);

      if (error) throw error;
      
      alert('Event updated successfully!');
      navigate('/admin');
    } catch (err) {
      console.error("Error updating event:", err);
      alert(`Error updating event: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading-content">
          <h2>Loading event details...</h2>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="admin-panel">
        <div className="error-content">
          <h2><strong>Event Not Found</strong></h2>
          <p>The requested event does not exist or has been removed.</p>
          <button onClick={() => navigate('/admin')} className="back-button">
            Back to Admin Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h1>Edit Event</h1>
      <div className="admin-edit-form">
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
            <button type="button" onClick={() => navigate('/admin')} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEventEdit;