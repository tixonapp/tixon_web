import React from 'react';
import AdminNav from '../components/admin/AdminNav';
import RegistrationsTable from '../components/admin/RegistrationsTable';
import './AdminPanel.css';

export default function AdminRegistrations() {
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <AdminNav />
      
      <div className="admin-content">
        <RegistrationsTable />
      </div>
    </div>
  );
}