import './EventCard.css';
// eslint-disable-next-line react/prop-types
const EventCard = ({name}) => {
    return (
      <div className="eventCard ">
      <div className="eventImage">
        <img src={name} alt=""/>
      </div>
      <div className="eventDescription">
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
    );
  };
  
  export default EventCard;