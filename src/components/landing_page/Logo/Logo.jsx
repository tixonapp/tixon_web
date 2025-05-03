import { memo } from 'react';
import './Logo.css';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className="logo">
      <Link to="/">
      <img
        src="/assets/logo.png"
        alt="Logo"
        width="auto"
        height="auto"
        loading="lazy"
      />
      </Link> 
    </div>
  );
};

export default memo(Logo);
