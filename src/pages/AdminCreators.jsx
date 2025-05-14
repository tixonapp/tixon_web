import React from 'react';
import AdminNav from '../components/admin/AdminNav';
import CreatorsTable from '../components/admin/CreatorsTable';
import './AdminPanel.css';

export default function AdminCreators() {
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <AdminNav />
      
      <div className="admin-content">
        <CreatorsTable />
      </div>
    </div>
  );
}