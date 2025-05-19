import React, { useState } from 'react';
import './SignInOptions.css';
import { useAuth } from '../../../supabase/AuthContext';
import { supabase } from '../../../supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';

const SignInOptions = () => {
    const { user } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            setIsDropdownOpen(false); // Close the dropdown
            navigate('/'); // Redirect to home page
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (user) {
        return (
            <div className="relative">
                <div 
                    className="cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onKeyPress={(e) => e.key === 'Enter' && setIsDropdownOpen(!isDropdownOpen)}
                    tabIndex={0}
                    role="button"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                    aria-label="User menu"
                >
                    <div className="w-10 h-10 rounded-full bg-[#2b300e] text-white flex items-center justify-center">
                        {user.email?.[0].toUpperCase() || 'U'}
                    </div>
                </div>

                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10">
                        <a 
                            href="/profile" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            View Profile
                        </a>
                        <a href="/create-event" className="create-event font-bold    p-2 px-3 cursor-pointer ">
                Create Event
            </a>
                        <button 
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                       
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="siginOptions">
            <a href="/signin" className="signin font-bold text-sm rounded-lg 
            bg-[#2b300e]
            border-1
            border-[#2b300e] p-2 px-3 cursor-pointer box-border shadow-lg">
                Sign In
            </a>
            <a href="/signin" className="create-event font-bold text-sm rounded-lg border-[#2b300e] border-1 p-2 px-3 cursor-pointer box-border shadow-lg">
                Create Event
            </a>
        </div>
        
    );
};

export default SignInOptions;