import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Search.css";

const locations = ["Chennai", "Pondicherry", "Goa", "Manali", "Ooty"];
const events = ["Concert", "Conference", "Workshop", "Festival", "Meetup"];

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = () => {
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
  };

  const handleLocationBlur = () => {
    setTimeout(() => setShowLocationDropdown(false), 300);
  };

  const handleEventBlur = () => {
    setTimeout(() => setShowEventDropdown(false), 300);
  };

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
        <input
          type="text"
          className="searchInput"
          placeholder="Location"
          value={location}
          onFocus={() => setShowLocationDropdown(true)}
          onBlur={handleLocationBlur}
          onChange={(e) => setLocation(e.target.value)}
        />
        {showLocationDropdown && (
          <ul className="dropdownMenu">
            {locations.map((loc, index) => (
              <li 
                key={index} 
                onMouseDown={() => setLocation(loc)}
              >
                {loc}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="dropdown">
        <input
          type="text"
          className="searchInput"
          placeholder="Event Type"
          value={event}
          onFocus={() => setShowEventDropdown(true)}
          onBlur={handleEventBlur}
          onChange={(e) => setEvent(e.target.value)}
        />
        {showEventDropdown && (
          <ul className="dropdownMenu">
            {events.map((ev, index) => (
              <li 
                key={index} 
                onMouseDown={() => setEvent(ev)}
              >
                {ev}
              </li>
            ))}
          </ul>
        )}
      </div>

      <DatePicker
        selected={date}
        onChange={(selectedDate) => setDate(selectedDate)}
        className="searchInput datePicker"
        placeholderText="Select Date"
      />

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

export default Search;