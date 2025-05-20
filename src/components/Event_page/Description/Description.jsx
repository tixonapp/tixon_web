import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import './Description.css';

const Description = ({ event }) => {
  if (!event) return null;

  return (
    <div>
      <div className="description-container">
        <h1 className="title">About this event</h1>
        <div className="description">
          <ReactMarkdown>
            {event.eventDescription || 'Event description coming soon...'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

Description.propTypes = {
  event: PropTypes.shape({
    eventDescription: PropTypes.string
  })
};

export default Description;
