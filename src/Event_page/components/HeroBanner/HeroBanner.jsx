import React, { useEffect, useState } from 'react';
import { FaXTwitter, FaFacebook, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa6';
import './HeroBanner.css';

const HeroBanner = ({ event }) => {
  const calculateTimeLeft = () => {
    const difference = new Date(event.eventDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [event.eventDate]);

  return (
    <div className="hero-banner">
      <div className='banner-content'>
        <div className='banner-text'>
          <h1 className='heading'>{event.eventName}</h1>
          <p className='event-details'>{event.eventDate} | {event.eventAgenda[0].time}</p>
          <p className='event-location'>{event.location}</p>
          <button className='sales-button' disabled>Sales haven't started yet</button>
          <div className='countdown-timer'>
            <div className='timer-box'><span className='time-value'>{timeLeft.days}</span><span className='time-label'>DAYS</span></div>
            <div className='timer-box'><span className='time-value'>{timeLeft.hours}</span><span className='time-label'>HOURS</span></div>
            <div className='timer-box'><span className='time-value'>{timeLeft.minutes}</span><span className='time-label'>MINUTES</span></div>
            <div className='timer-box'><span className='time-value'>{timeLeft.seconds}</span><span className='time-label'>SECONDS</span></div>
          </div>
          <div className='social-icons'>
          <a href={event.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
            <FaXTwitter className='icon' />
            </a>
            <a href={event.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
            <FaFacebook className='icon' />
            </a>
            <FaLinkedin className='icon' />
            <a href={event.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
            <FaInstagram className='icon' />
            </a>
            <FaYoutube className='icon' />
          </div>
        </div>
        <div className='banner-image'>
          <img src={event.images[0]} alt={event.eventName} className='event-image' />
        </div>
      </div>
    </div>
  );
};
export default HeroBanner;