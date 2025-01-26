import Logo from "./Logo";
import Search from "./Search";
import SignInOptions from "./SignInOptions";

const Navbar = () => {

  return (
    <>
    <div className="px-20 flex flex-row items-center justify-between fixed w-full z-20 border-b-[0.5px] border-[#2b300e] py-3">
      <Logo></Logo>
      <Search></Search>
      <SignInOptions></SignInOptions>
    </div>
    </>
  );
};

export default Navbar;
