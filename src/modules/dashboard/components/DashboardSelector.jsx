import React from 'react';
import { useAuthContext } from '@/modules/auth/components/AuthProvider';
import ApprenticeHome from './ApprenticeHome';
import AssessorBoard from './AssessorBoard';
import IQAQueue from './IQAQueue';
import EmployerDashboard from './EmployerDashboard';
import AdminArea from './AdminArea';

const DashboardSelector = () => {
  const { user } = useAuthContext();
  
  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
        Please log in to view your dashboard.
      </div>
    );
  }
  
  // Return the appropriate dashboard based on user role
  switch (user.role) {
    case 'apprentice':
      return <ApprenticeHome />;
      
    case 'assessor':
      return <AssessorBoard />;
      
    case 'iqa':
      return <IQAQueue />;
      
    case 'employer':
      return <EmployerDashboard />;
      
    case 'admin':
      return <AdminArea />;
      
    default:
      return (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
          Unknown user role: {user.role}. Please contact an administrator to fix your account.
        </div>
      );
  }
};

export default DashboardSelector;