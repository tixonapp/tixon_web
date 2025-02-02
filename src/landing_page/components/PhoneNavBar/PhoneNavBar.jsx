import './PhoneNavBar.css'
import Logo from "../Logo/Logo";
import SearchIcon from '../SearchIcon/SearchIcon';
import ProfileIcon from '../ProfileIcon/ProfileIcon';
import FilterIcon from '../FilterIcon/FilterIcon';
const PhoneNavbar = () => {

  return (
    <>
    <div className="phoneNavBar">
      <Logo/>
      <div className='flex items-center'>
      <SearchIcon/>
      <FilterIcon/>
      <ProfileIcon/>
      </div>
    </div>
    </>
  );
};

export default PhoneNavbar;