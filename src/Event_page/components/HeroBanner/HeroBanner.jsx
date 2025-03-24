import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaXTwitter, FaFacebook, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa6';
import './HeroBanner.css';
const HeroBanner = ({ event }) => {
  // State to store the countdown time
  const [timeLeft, setTimeLeft] = useState({});

  // Memoized function to calculate time left
  const calculateTimeLeft = useCallback(() => {
    if (!event?.eventDate) return {}; // If no event date, return empty object

    const difference = new Date(event.eventDate) - Date.now(); // Calculate difference in milliseconds

    if (difference <= 0) return {}; // If event date has passed, return empty object

    // Calculate days, hours, minutes, and seconds
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [event?.eventDate]); // Recalculate only if eventDate changes

  // Effect to update the timer every second
  useEffect(() => {
    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Set up a timer to update every second
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = calculateTimeLeft();

        // Only update state if the time values have changed
        return JSON.stringify(newTime) !== JSON.stringify(prev) ? newTime : prev;
      });
    }, 1000);

    // Cleanup: Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Memoized countdown timer JSX to avoid re-rendering unless time changes
  const countdownTimer = useMemo(() => (
    <div className='countdown-timer'>
      <div className='timer-box'><span className='time-value'>{timeLeft.days || 0}</span><span className='time-label'>DAYS</span></div>
      <div className='timer-box'><span className='time-value'>{timeLeft.hours || 0}</span><span className='time-label'>HOURS</span></div>
      <div className='timer-box'><span className='time-value'>{timeLeft.minutes || 0}</span><span className='time-label'>MINUTES</span></div>
      <div className='timer-box'><span className='time-value'>{timeLeft.seconds || 0}</span><span className='time-label'>SECONDS</span></div>
    </div>
  ), [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]);

  // Memoized social icons JSX to avoid re-rendering unless event.socialMedia changes
  const socialIcons = useMemo(() => (
    console.log(event.socialMedia),
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

  // If no event data, return null (or a loading/error state)
  if (!event) return null;

  return (
    <div className="hero-banner">
      <div className='banner-content'>
        <div className='banner-text'>
          <h1 className='heading'>{event.eventName}</h1>
          <p className='event-details'>{event.eventDate} | {event.eventAgenda[0]?.time}</p>
          <p className='event-location'>{event.location}</p>
          <button className='sales-button' disabled>Sales haven't started yet</button>
          {countdownTimer}
          {socialIcons}
        </div>
        <div className='banner-image'>
          <img src={event.images?.[0]} alt={event.eventName} className='event-image' />
        </div>
      </div>
    </div>
  );
};

export default React.memo(HeroBanner);