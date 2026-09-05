import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import DoctorDashboard from '../components/dashboards/DoctorDashboard';
import NurseDashboard from '../components/dashboards/NurseDashboard';
import ReceptionistDashboard from '../components/dashboards/ReceptionistDashboard';
import PharmacistDashboard from '../components/dashboards/PharmacistDashboard';
import HRDashboard from '../components/dashboards/HRDashboard';
import AccountsDashboard from '../components/dashboards/AccountsDashboard';
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

  if (['lab_tech', 'lab_manager'].includes(userRole.toLowerCase())) {
    return <Navigate to="/laboratory" replace />;
  }

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
      case 'hr_manager':
        return <HRDashboard />;
      case 'accountant':
      case 'billing_officer':
        return <AccountsDashboard />;
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