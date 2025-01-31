import './NavBar.css'
import Logo from "../Logo/Logo";
import Search from "../Search/Search";
import SignInOptions from "../SignInOptions/SignInOptions";

const Navbar = () => {

  return (
    <>
    <div className=".navBar">
      <Logo/>
      <Search/>
      <SignInOptions/>
    </div>
    </>
  );
};

export default Navbar;
