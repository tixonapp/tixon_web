export default function OrganizerFields({ index, org, handleOrganizerChange }) {
    return (
      <div className="organizer-group">
        <h4>Organizer {index + 1}</h4>
        <div className="form-group">
          <input
            name="name"
            placeholder="Name*"
            value={org.name}
            onChange={e => handleOrganizerChange(index, e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            name="personal_email"
            placeholder="Personal Email*"
            type="email"
            value={org.personal_email}
            onChange={e => handleOrganizerChange(index, e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            name="college_email"
            placeholder="College Email"
            value={org.college_email}
            onChange={e => handleOrganizerChange(index, e)}
          />
        </div>
        <div className="form-group">
          <input
            name="phone"
            placeholder="Phone*"
            value={org.phone}
            onChange={e => handleOrganizerChange(index, e)}
            required
          />
        </div>
      </div>
    )
  }
  