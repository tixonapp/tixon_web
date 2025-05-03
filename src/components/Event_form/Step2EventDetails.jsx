export default function Step2EventDetails({ formRef, formData, handleChange }) {
    return (
      <form ref={formRef} className="form-section">
        <div className="form-group">
          <label>Event Name*</label>
          <input name="event_name" value={formData.event_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Mode*</label>
          <select name="mode" value={formData.mode} onChange={handleChange} required>
            <option>In-person</option>
            <option>Virtual</option>
            <option>Hybrid</option>
          </select>
        </div>
        <div className="form-group">
          <label>Start Date-Time*</label>
          <input name="start_datetime" type="datetime-local" value={formData.start_datetime} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>End Date-Time*</label>
          <input name="end_datetime" type="datetime-local" value={formData.end_datetime} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Poster URL*</label>
          <input name="poster_url" value={formData.poster_url} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Location*</label>
          <input name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description*</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Category*</label>
          <input name="category" value={formData.category} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Agenda</label>
          <textarea name="agenda" value={formData.agenda} onChange={handleChange} />
        </div>
      </form>
    )
  }
  