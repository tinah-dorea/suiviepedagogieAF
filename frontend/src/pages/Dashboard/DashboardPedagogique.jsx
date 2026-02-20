import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';

export default function DashboardPedagogique() {
  // Removed unused navigate hook

  return (
    <DashboardLayout 
      userType="pedagogie" 
      title="Service Pédagogique"
    >
      <Outlet />
    </DashboardLayout>
  );
}