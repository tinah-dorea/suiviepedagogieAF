import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';

const DashboardProfesseur = () => {
  return (
    <DashboardLayout 
      userType="professeur" 
      title="Tableau de Bord Professeur" 
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default DashboardProfesseur;