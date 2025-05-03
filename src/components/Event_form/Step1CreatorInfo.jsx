export default function Step1CreatorInfo({ formRef, formData, handleChange }) {
    return (
      <form ref={formRef} className="form-section">
        <div className="form-group">
          <label>Name*</label>
          <input name="creator_name" value={formData.creator_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone*</label>
          <input name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Personal Email*</label>
          <input name="personal_email" type="email" value={formData.personal_email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Professional Email</label>
          <input name="professional_email" type="email" value={formData.professional_email} onChange={handleChange} />
        </div>
      </form>
    )
  }
  