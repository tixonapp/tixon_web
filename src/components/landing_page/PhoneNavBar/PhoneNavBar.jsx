import './PhoneNavBar.css'
import Logo from "../Logo/Logo";
import Search from '../Search/Search'
import ProfileIcon from '../ProfileIcon/ProfileIcon';
import { useFilters } from '../../../Context/FilterContext';
import { useNavigate } from 'react-router-dom';

const PhoneNavbar = () => {
  const { setFilters } = useFilters();
  const navigate = useNavigate();

  const handleSearch = (newFilters) => {
    setFilters({
      location: newFilters.location || '',
      eventType: newFilters.eventType || '',
      date: newFilters.date ? new Date(newFilters.date) : null
    });
  };

  const handleCreateEvent = () => {
    navigate('/create-event'); // Assuming this is the route for your form
  };

  return (
    <div className="phoneNavBar">
      <Logo/>
      <div className='nav-actions-mobile'>
        <button 
          className="create-event-btn-mobile"
          onClick={handleCreateEvent}
        >
          Create Event
        </button>
        <Search onSearch={handleSearch} />
        <ProfileIcon/>
      </div>
    </div>
  );
};

export default PhoneNavbar;
