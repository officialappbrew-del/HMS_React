import { useState, useEffect } from 'react';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import DoctorDashboard from '../components/dashboards/DoctorDashboard';
import NurseDashboard from '../components/dashboards/NurseDashboard';
import ReceptionistDashboard from '../components/dashboards/ReceptionistDashboard';
import PharmacistDashboard from '../components/dashboards/PharmacistDashboard';
import LaboratoryDashboard from '../components/dashboards/LaboratoryDashboard';

const Dashboard = () => {
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'admin');

  useEffect(() => {
    const updateRole = () => {
      setUserRole(localStorage.getItem('userRole') || 'admin');
    };

    updateRole();
    window.addEventListener('authChanged', updateRole);
    window.addEventListener('storage', updateRole);

    return () => {
      window.removeEventListener('authChanged', updateRole);
      window.removeEventListener('storage', updateRole);
    };
  }, []);

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      case 'receptionist':
        return <ReceptionistDashboard />;
      case 'pharmacist':
        return <PharmacistDashboard />;
      case 'lab_tech':
      case 'lab_manager':
        return <LaboratoryDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Logged in as <span className="font-semibold capitalize">{userRole}</span>
          </div>
          <div className="text-xs text-gray-500">
            {localStorage.getItem('userEmail') || 'Current user'}
          </div>
        </div>
      </div>
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;