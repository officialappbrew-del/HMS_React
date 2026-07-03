import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import {
  Home,
  Users,
  Calendar,
  FileText,
  Pill,
  Bed,
  Heart,
  Stethoscope,
  Building2,
  Activity,
  Clipboard,
  Shield,
  Ambulance,
  Phone,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, userRole, isRootAdmin, isMobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = {
    admin: [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'Patient Management', path: '/patients' },
      { icon: Calendar, label: 'Appointments', path: '/appointments' },
      { icon: FileText, label: 'Billing', path: '/billing' },
      { icon: Building2, label: 'Staff Management', path: '/staff' },
      { icon: Bed, label: 'Bed Allocation', path: '/bed-allocation' },
      { icon: Heart, label: 'Admissions', path: '/admissions' },
      { icon: Pill, label: 'Pharmacy', path: '/pharmacy' },
      { icon: Activity, label: 'Inventory', path: '/inventory' },
      { icon: Shield, label: 'Compliance', path: '/ndpr-compliance' },
      { icon: Settings, label: 'Settings', path: '/settings' }
    ],
    doctor: [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Stethoscope, label: 'Consultation', path: '/consultation' },
      { icon: Users, label: 'My Patients', path: '/patients' },
      { icon: Calendar, label: 'Appointments', path: '/appointments' },
      { icon: Activity, label: 'Vital Signs', path: '/vital-signs' },
      { icon: FileText, label: 'EMR', path: '/emr' },
      { icon: Shield, label: 'Clinical Decision', path: '/cds' },
      { icon: Heart, label: 'Ward Rounds', path: '/ward-rounds' }
    ],
    nurse: [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'Assigned Patients', path: '/patients' },
      { icon: Activity, label: 'Vital Signs', path: '/vital-signs' },
      { icon: Pill, label: 'Medications', path: '/pharmacy' },
      { icon: Bed, label: 'Bed Status', path: '/bed-allocation' },
      { icon: Heart, label: 'Admissions', path: '/admissions' },
      { icon: Stethoscope, label: 'Ward Rounds', path: '/ward-rounds' },
      { icon: Calendar, label: 'Schedule', path: '/appointments' }
    ],
    receptionist: [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Users, label: 'Patient Registration', path: '/patients' },
      { icon: Calendar, label: 'Appointments', path: '/appointments' },
      { icon: FileText, label: 'Billing', path: '/billing' },
      { icon: Phone, label: 'Communications', path: '/patient-feedback' },
      { icon: Ambulance, label: 'Referrals', path: '/emergency-dept' }
    ],
    pharmacist: [
      { icon: Home, label: 'Dashboard', path: '/dashboard' },
      { icon: Pill, label: 'Pharmacy', path: '/pharmacy' },
      { icon: Activity, label: 'Inventory', path: '/inventory' },
      { icon: Users, label: 'Patient Profiles', path: '/patients' },
      { icon: FileText, label: 'Billing', path: '/billing' },
      { icon: Clipboard, label: 'Reports', path: '/financial-analytics' }
    ]
  };

  const currentMenu = menuItems[userRole] || menuItems.admin;
  const filteredMenu = currentMenu.filter(item => {
    if (item.path === '/settings' && userRole === 'admin' && !isRootAdmin) {
      return false;
    }
    return true;
  });

  const handleNavigate = (path) => {
    navigate(path);
    if (onMobileClose) onMobileClose();
  };

  const confirmLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userIsRootAdmin');
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event('authChanged'));
    navigate('/login');
    if (onMobileClose) onMobileClose();
    setShowLogoutConfirm(false);
  };

  const sidebarClasses = `fixed left-0 top-0 z-50 h-screen w-72 max-w-[85vw] border-r border-slate-200 bg-white shadow-xl transition-all duration-300 lg:shadow-none ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`;

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside className={sidebarClasses}>
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          {!isCollapsed && <h2 className="text-base font-semibold text-slate-900">SmartCare HMS</h2>}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className={`flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to sign out of your account?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        type="edit"
      />
    </>
  );
};

export default Sidebar;