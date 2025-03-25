import './NavBar.css';
import Logo from "../Logo/Logo";
import Search from "../Search/Search";
import SignInOptions from "../SignInOptions/SignInOptions";

const Navbar = ({ onSearch }) => {
  return (
    <>
      <div className="navBar">
        <Logo/>
        <Search onSearch={onSearch} />
        <SignInOptions/>
      </div>
    </>
  );
};

export default Navbar;