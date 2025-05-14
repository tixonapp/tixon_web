import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminNav.css';

const AdminNav = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="admin-nav">
      <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>
        Events
      </Link>
      <Link to="/admin/creators" className={`nav-item ${isActive('/admin/creators')}`}>
        Creators
      </Link>
      <Link to="/admin/organizers" className={`nav-item ${isActive('/admin/organizers')}`}>
        Organizers
      </Link>
      <Link to="/admin/registrations" className={`nav-item ${isActive('/admin/registrations')}`}>
        Registrations
      </Link>
    </nav>
  );
};

export default AdminNav;