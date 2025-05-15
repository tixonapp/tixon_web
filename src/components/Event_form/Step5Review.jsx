export default function Step5Review({ formData }) {
    return (
      <section className="form-section">
        <h3>Review your data and click Submit</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </section>
    )
  }
  