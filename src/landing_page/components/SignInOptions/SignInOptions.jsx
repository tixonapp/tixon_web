import React from 'react';
import './SignInOptions.css';

const SignInOptions = () => {
    return (
        <div className="siginOptions">
            <a href="/signin" className="signin font-bold text-sm rounded-lg 
            bg-[#2b300e]
            border-1
            border-[#2b300e] p-2 px-3 cursor-pointer box-border shadow-lg">
                Sign In
            </a>
            <a href="/signup" className="signup font-bold text-sm rounded-lg border-[#2b300e] border-1 p-2 px-3 cursor-pointer box-border shadow-lg">
                Sign Up
            </a>
        </div>
    );
};
  
export default SignInOptions;