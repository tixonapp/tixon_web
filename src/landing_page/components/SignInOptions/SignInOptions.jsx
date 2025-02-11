import './SignInOptions.css';
const SignInOptions = () => {
    return (
        <div className="siginOptions">
        <div className="signin font-bold text-sm rounded-lg 
        bg-[#2b300e]
        border-1
        border-[#2b300e] p-2 px-3 cursor-pointer box-border shadow-lg">
            Sign In
        </div>
        <div className="signup font-bold text-sm rounded-lg border-[#2b300e] border-1 p-2 px-3 cursor-pointer box-border shadow-lg">
            Sign Up
        </div>
        </div>

    );
  };
  
  export default SignInOptions;