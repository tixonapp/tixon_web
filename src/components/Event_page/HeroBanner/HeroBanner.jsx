import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  FaXTwitter, 
  FaFacebook, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube,
  FaCalendar,
  FaClock,
  FaMap
} from 'react-icons/fa6';
import './HeroBanner.css';
// import { LazyLoadImage } from 'react-lazy-load-image-component';

const HeroBanner = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState({});

  const calculateTimeLeft = useCallback(() => {
    if (!event?.start_datetime) return {};
    const difference = new Date(event.start_datetime) - Date.now();
    if (difference <= 0) {
      // If event has started but not ended, show countdown to end
      if (event?.end_datetime) {
        const endDifference = new Date(event.end_datetime) - Date.now();
        if (endDifference > 0) {
          return {
            days: Math.floor(endDifference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((endDifference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((endDifference / 1000 / 60) % 60),
            seconds: Math.floor((endDifference / 1000) % 60),
            isEnding: true
          };
        }
      }
      return {};
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isEnding: false
    };
  }, [event?.start_datetime, event?.end_datetime]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = calculateTimeLeft();
        return JSON.stringify(newTime) !== JSON.stringify(prev) ? newTime : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const countdownTimer = useMemo(() => {
    if (Object.keys(timeLeft).length === 0) return null;
    
    const timeParts = [
      { value: timeLeft.days, label: 'DAYS' },
      { value: timeLeft.hours, label: 'HOURS' },
      { value: timeLeft.minutes, label: 'MINUTES' },
      { value: timeLeft.seconds, label: 'SECONDS' },
    ];

    return (
      <div className='countdown-timer'>
        <div className="countdown-label">
          {timeLeft.isEnding ? 'Event ends in:' : 'Event starts in:'}
        </div>
        {timeParts.map((part, index) => (
          <React.Fragment key={part.label}>
            <div className='timer-box'>
              <span className='time-value'>{part.value ?? 0}</span>
              <span className='time-label'>{part.label}</span>
            </div>
            {index !== timeParts.length - 1 && <span className='separator'>:</span>}
          </React.Fragment>
        ))}
      </div>
    );
  }, [timeLeft]);

  const socialIcons = useMemo(() => (
    <div className='social-icons'>
      <a href={event.socialMedia?.twitter} target="_blank" rel="noopener noreferrer">
        <FaXTwitter className='icon' />
      </a>
      <a href={event.socialMedia?.facebook} target="_blank" rel="noopener noreferrer">
        <FaFacebook className='icon' />
      </a>
      <a href={event.socialMedia?.linkedin} target="_blank" rel="noopener noreferrer">
        <FaLinkedin className='icon' />
      </a>
      <a href={event.socialMedia?.instagram} target="_blank" rel="noopener noreferrer">
        <FaInstagram className='icon' />
      </a>
      <a href={event.socialMedia?.youtube} target="_blank" rel="noopener noreferrer">
        <FaYoutube className='icon' />
      </a>
    </div>
  ), [event.socialMedia]);

  if (!event) return null;

  return (
    <div className="hero-container">
      <div className='banner-image-container'>
        <img 
          src={event.images?.[0]} 
          alt={event.eventName} 
          className='banner-image' 
          loading='lazy'
        />
      </div>

      <div className='content-section'>
        <div className='content-wrapper'>
          <div className='content-grid'>
            <div className='event-content'>
              <h1 className='event-title'>{event.name || event.eventName}</h1>
              <div className='event-details'>
                <p className='detail-item'>
                  <FaCalendar className='detail-icon' />
                  <span>
                    {event.start_datetime ? new Date(event.start_datetime).toLocaleDateString() : 'TBA'}
                    {event.end_datetime && event.start_datetime && 
                     new Date(event.end_datetime).toLocaleDateString() !== new Date(event.start_datetime).toLocaleDateString() ? 
                     ` - ${new Date(event.end_datetime).toLocaleDateString()}` : ''}
                  </span>
                </p>
                <p className='detail-item'>
                  <FaClock className='detail-icon' />
                  <span>
                    {event.start_datetime ? new Date(event.start_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBA'}
                    {event.end_datetime ? ` - ${new Date(event.end_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : ''}
                  </span>
                </p>
                <p className='detail-item location'>
                  <FaMap className='detail-icon' />
                  {event.location}
                </p>
              </div>

              {countdownTimer}
              {socialIcons}
            </div>

            <div className='price-card'>
              <h2 className='price-title'>Type: {event.ticketType}</h2>
              <button 
                className='ticket-button' 
                disabled={!event.isAvailable}
                onClick={() => {
                  if (event.isAvailable) {
                    // Navigate to ticket purchase page using relative URL
                    window.location.href = `${window.location.pathname}/tickets`;
                  }
                }}
              >
                {event.isAvailable ? 'Register Now' : 'Registration Not Started'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HeroBanner);