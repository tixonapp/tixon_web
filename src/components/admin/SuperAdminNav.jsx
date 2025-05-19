import { Link, useLocation } from 'react-router-dom';
import './AdminNav.css';

const SuperAdminNav = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="admin-nav super-admin-nav">
      <Link to="/super-admin" className={`nav-item ${isActive('/super-admin')}`}>
        <span className="nav-icon">📊</span>
        All Events
      </Link>
      <Link to="/super-admin/creators" className={`nav-item ${isActive('/super-admin/creators')}`}>
        <span className="nav-icon">👥</span>
        All Creators
      </Link>
      <Link to="/super-admin/organizers" className={`nav-item ${isActive('/super-admin/organizers')}`}>
        <span className="nav-icon">🏢</span>
        All Organizers
      </Link>
      <Link to="/super-admin/registrations" className={`nav-item ${isActive('/super-admin/registrations')}`}>
        <span className="nav-icon">📝</span>
        All Registrations
      </Link>
      <Link to="/super-admin/users" className={`nav-item ${isActive('/super-admin/users')}`}>
        <span className="nav-icon">👤</span>
        Manage Users
      </Link>
      <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>
        <span className="nav-icon">⚙️</span>
        Regular Admin
      </Link>
    </nav>
  );
};

export default SuperAdminNav; 