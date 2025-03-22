import './PhoneNavBar.css'
import Logo from "../Logo/Logo";
// import SearchIcon from '../SearchIcon/SearchIcon';
import Search from '../Search/Search'
import ProfileIcon from '../ProfileIcon/ProfileIcon';
// import FilterIcon from '../FilterIcon/FilterIcon';
const PhoneNavbar = () => {

  return (
    <>
    <div className="phoneNavBar">
      <Logo/>
      <div className='flex items-center'>
        <Search/>
      {/* <SearchIcon/> */}
      {/* <FilterIcon/> */}
      <ProfileIcon/>
      </div>
    </div>
    </>
  );
};

export default PhoneNavbar;