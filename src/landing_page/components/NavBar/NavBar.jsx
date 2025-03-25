import './NavBar.css';
import Logo from "../Logo/Logo";
import Search from "../Search/Search";
import SignInOptions from "../SignInOptions/SignInOptions";
import { useFilters } from '../../../Context/FilterContext';

const Navbar = () => {
  const { setFilters } = useFilters();

  const handleSearch = (newFilters) => {
    setFilters({
      location: newFilters.location || '',
      eventType: newFilters.eventType || '',
      date: newFilters.date ? new Date(newFilters.date) : null
    });
  };

  return (
    <div className="navBar">
      <Logo/>
      <Search onSearch={handleSearch} />
      <SignInOptions/>
    </div>
  );
};

export default Navbar;
