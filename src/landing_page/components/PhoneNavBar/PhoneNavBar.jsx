import './PhoneNavBar.css'
import Logo from "../Logo/Logo";
import Search from '../Search/Search'
import ProfileIcon from '../ProfileIcon/ProfileIcon';
import { useFilters } from '../../../Context/FilterContext';

const PhoneNavbar = () => {
  const { setFilters } = useFilters();

  const handleSearch = (newFilters) => {
    setFilters({
      location: newFilters.location || '',
      eventType: newFilters.eventType || '',
      date: newFilters.date ? new Date(newFilters.date) : null
    });
  };

  return (
    <div className="phoneNavBar">
      <Logo/>
      <div className='flex items-center'>
        <Search onSearch={handleSearch} />
        <ProfileIcon/>
      </div>
    </div>
  );
};

export default PhoneNavbar;
//TODO: merge this with the NavBar component and use css to handle mobile devices