export default function Step4Registration({ formRef, formData, handleChange }) {
    return (
      <form ref={formRef} className="form-section">
        <div className="form-group">
          <label>Event Type*</label>
          <select name="event_type" value={formData.event_type} onChange={handleChange} required>
            <option>Free</option>
            <option>Paid</option>
          </select>
        </div>
        {formData.event_type === 'Paid' && (
          <div className="form-group">
            <label>Price*</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Total Tickets*</label>
          <input
            name="total_tickets"
            type="number"
            value={formData.total_tickets}
            onChange={handleChange}
            required
          />
        </div>
      </form>
    )
  }
  