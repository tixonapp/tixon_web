import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiSearch, BiCalendar, BiMusic, BiBriefcase, BiBookOpen, BiParty, BiGroup } from "react-icons/bi";
import { MdLocationOn } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Search.css";

// Moved outside component to prevent recreation on each render
const locations = [
  { name: "Puducherry, Puducherry", description: "Great for a weekend getaway", color: "#FFF5F5", iconColor: "#FF6B6B" },
  { name: "New Delhi, Delhi", description: "For sights like India Gate", color: "#F0FFF4", iconColor: "#38A169" },  
  { name: "Bengaluru, Karnataka", description: "For its top-notch dining", color: "#FFF5F5", iconColor: "#DD6B20" },
  { name: "Chennai", description: "Cultural hub of South India", color: "#F0F4FF", iconColor: "#4C51BF" },
  { name: "Manali", description: "Mountain getaway", color: "#F0FFF4", iconColor: "#38A169" },
  { name: "Ooty", description: "Hill station with tea gardens", color: "#F0FFF4", iconColor: "#38A169" },
];

const events = [
  {
    name: "Concert",
    icon: BiMusic,
    iconColor: "#FF6B6B",
    color: "#FFF5F5",
  },
  {
    name: "Conference",
    icon: BiBriefcase,
    iconColor: "#38A169",
    color: "#F0FFF4",
  },
  {
    name: "Workshop",
    icon: BiBookOpen,
    iconColor: "#DD6B20",
    color: "#FFF5F5",
  },
  {
    name: "Festival",
    icon: BiParty,
    iconColor: "#4C51BF",
    color: "#F0F4FF",
  },
  {
    name: "Meetup",
    icon: BiGroup,
    iconColor: "#38A169",
    color: "#F0FFF4",
  },
];

const Search = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [event, setEvent] = useState("");
  const [date, setDate] = useState(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Memoize resize handler to prevent recreation on each render
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const handleSearch = useCallback(() => {
    const searchParams = {
      location,
      eventType: event,
      date: date ? date.toISOString() : null
    };

    if (pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        onSearch?.(searchParams);
      }, 100);
    } else {
      onSearch?.(searchParams);
    }
    
    if (isMobile) setExpandSearch(false);
  }, [location, event, date, pathname, navigate, onSearch, isMobile]);

  const handleLocationBlur = useCallback(() => {
    setTimeout(() => setShowLocationDropdown(false), 300);
  }, []);

  const handleEventBlur = useCallback(() => {
    setTimeout(() => setShowEventDropdown(false), 300);
  }, []);

  if (isMobile && !expandSearch) {
    return (
      <div className="mobileSearchBar" onClick={() => setExpandSearch(true)}>
        <div className="mobileSearchPlaceholder">
          <BiSearch size={18} />
          <span><strong>Search to start...</strong></span>
        </div>
      </div>
    );
  }

  return (
    <div className={isMobile ? "mobileSearchExpanded" : "searchBar"}>
      <div className="dropdown">
        <div className="inputWrapper">
          <MdLocationOn className="inputIcon" />
          <input
            type="text"
            className="searchInput"
            placeholder="Location"
            value={location}
            onFocus={() => setShowLocationDropdown(true)}
            onBlur={handleLocationBlur}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        {showLocationDropdown && (
          <ul className="dropdownMenu locationDropdown">
            {locations.map((loc, index) => (
              <li 
                key={index} 
                onMouseDown={() => setLocation(loc.name)}
                style={{ backgroundColor: loc.color }}
                className="locationItem"
              >
                <div className="locationIcon" style={{ color: loc.iconColor }}>
                  <MdLocationOn size={20} />
                </div>
                <div className="locationInfo">
                  <div className="locationName">{loc.name}</div>
                  <div className="locationDescription">{loc.description}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dropdown">
        <div className="inputWrapper">
          <BiMusic className="inputIcon" />
          <input
            type="text"
            className="searchInput"
            placeholder="Event Type"
            value={event}
            onFocus={() => setShowEventDropdown(true)}
            onBlur={handleEventBlur}
            onChange={(e) => setEvent(e.target.value)}
          />
        </div>
        {showEventDropdown && (
          <ul className="dropdownMenu">
            {events.map((eventObj, index) => (
              <li 
                key={index} 
                onMouseDown={() => setEvent(eventObj.name)}
                style={{ backgroundColor: eventObj.color }}
                className="eventItem"
              >
                <div className="eventIcon" style={{ color: eventObj.iconColor }}>
                  <eventObj.icon size={20} />
                </div>
                <div className="eventName">{eventObj.name}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="datePickerWrapper">
        <div className="inputWrapper">
          <BiCalendar className="inputIcon" />
          <DatePicker
            selected={date}
            onChange={(selectedDate) => setDate(selectedDate)}
            className="searchInput datePicker"
            placeholderText="Select Date"
            calendarClassName="customCalendar"
            dayClassName={date => "customDay"}
            monthClassName={date => "customMonth"}
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="customHeader">
                <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="monthNavButton">
                  &lt;
                </button>
                <div className="monthYearLabel">
                  {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                </div>
                <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="monthNavButton">
                  &gt;
                </button>
              </div>
            )}
          />
        </div>
      </div>

      <div className={isMobile ? "mobileButtonsContainer" : "buttonsContainer"}>
        <button className="searchIcon" onClick={handleSearch}>
          <BiSearch size={18} />
        </button>
      </div>

      {isMobile && (
        <button 
          className="closeButton" 
          onClick={() => setExpandSearch(false)}
        >
          CLOSE
        </button>
      )}
    </div>
  );
};

export default React.memo(Search);