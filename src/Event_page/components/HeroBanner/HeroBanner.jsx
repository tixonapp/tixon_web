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

const HeroBanner = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState({});

  const calculateTimeLeft = useCallback(() => {
    if (!event?.eventDate) return {};
    const difference = new Date(event.eventDate) - Date.now();
    if (difference <= 0) return {};
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [event?.eventDate]);

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
    const timeParts = [
      { value: timeLeft.days, label: 'DAYS' },
      { value: timeLeft.hours, label: 'HOURS' },
      { value: timeLeft.minutes, label: 'MINUTES' },
      { value: timeLeft.seconds, label: 'SECONDS' },
    ];

    return (
      <div className='countdown-timer'>
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
        />
      </div>

      <div className='content-section'>
        <div className='content-wrapper'>
          <div className='content-grid'>
            <div className='event-content'>
              <h1 className='event-title'>{event.eventName}</h1>
              <div className='event-details'>
                <p className='detail-item'>
                  <FaCalendar className='detail-icon' />
                  {event.eventDate}
                </p>
                <p className='detail-item'>
                  <FaClock className='detail-icon' />
                  {event.eventAgenda[0]?.time}
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
              <h2 className='price-title'>Price: {event.ticketPrice}</h2>
              <button 
                className='ticket-button' 
                disabled={!event.isAvailable}
                onClick={() => {
                  if (event.isAvailable) {
                    // Handle registration in future...........
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