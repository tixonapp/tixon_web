export default function NavButtons({ step, prev, next, handleSubmit }) {
    return (
      <div className="nav-buttons">
        {step > 1 && <button type="button" onClick={prev}>Back</button>}
        {step < 5 ? (
          <button type="button" onClick={next}>Next</button>
        ) : (
          <button type="button" onClick={handleSubmit}>Submit</button>
        )}
      </div>
    )
  }
  