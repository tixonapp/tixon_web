import OrganizerFields from './OrganizerFields'

export default function Step3Organizers({ formRef, organizers, handleOrganizerChange, addOrganizer }) {
  return (
    <form ref={formRef} className="form-section">
      {organizers.map((org, i) => (
        <OrganizerFields
          key={i}
          index={i}
          org={org}
          handleOrganizerChange={handleOrganizerChange}
        />
      ))}
      <button
        type="button"
        className="add-organizer"
        onClick={addOrganizer}
      >
        Add Organizer
      </button>
    </form>
  )
}
