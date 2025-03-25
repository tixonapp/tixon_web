import React, { useState } from 'react';
import './ForgotPassword.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }

    // Reset password logic
    console.log('Reset password for', email);
    setMessage('Password reset link sent to your email');
    // Add your actual password reset logic here
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-header">
          <h2>Forgot Password</h2>
          <p>Enter your email to reset your password</p>
        </div>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {error && <span className="error">{error}</span>}
            {message && <span className="success-message">{message}</span>}
          </div>

          <button type="submit" className="submit-btn">
            Send Reset Link
          </button>

          <div className="signin-link-container">
            <p>
              Remember your password? <a href="/signin" className="signin-link">Sign In</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;