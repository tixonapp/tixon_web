import './NavBar.css';
import Logo from "../Logo/Logo";
import Search from "../Search/Search";
import SignInOptions from "../SignInOptions/SigninOptions";
import { useFilters } from '../../../Context/FilterContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
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
    <div className="navBar">
      <Logo/>
      <Search onSearch={handleSearch} />
      <div className="nav-actions">
   
        <SignInOptions/>
      </div>
    </div>
  );
};

export default Navbar;
