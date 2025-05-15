import React from 'react';
import AdminNav from '../components/admin/AdminNav';
import OrganizersTable from '../components/admin/OrganizersTable';
import './AdminPanel.css';

export default function AdminOrganizers() {
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <AdminNav />
      
      <div className="admin-content">
        <OrganizersTable />
      </div>
    </div>
  );
}