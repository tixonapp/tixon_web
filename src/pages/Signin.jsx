import React, { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import './Signin.css';

const SigninPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Successful login
      navigate('/'); // Redirect to home page
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-header">
          <h2>Welcome Back</h2>
          <p>Please sign in to continue</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="forgot-password-container">
            <a href="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </a>
          </div>

          <button 
            type="submit" 
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            className="google-signin-btn"
          >
            <img 
              src="/google-icon.png" 
              alt="Google" 
              className="google-icon"
            />
            Sign in with Google
          </button>
        </form>

        <div className="signup-link-container">
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="signup-link">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
