import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import { logout } from '../utils/api';
import { Home, Users, Calendar, FileText, Pill, Bed, Heart, Stethoscope, Building2, Activity, Clipboard, Shield, Ambulance, Phone, ChevronLeft, ChevronRight, Settings, LogOut, BarChart3, Share2 } from 'lucide-react';

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
      { icon: BarChart3, label: 'Reports', path: '/financial-analytics' },
      { icon: Share2, label: 'External Integrations', path: '/external-integrations' },
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
    if (item.path === '/external-integrations' && !['admin', 'super_admin', 'system_admin'].includes(userRole)) {
      return false;
    }
    return true;
  });

  const roleLabel = (userRole === 'system_admin' || userRole === 'super_admin')
    ? 'Administrator'
    : (userRole || 'admin').replace(/_/g, ' ');

  const handleNavigate = (path) => {
    navigate(path);
    if (onMobileClose) onMobileClose();
  };

  const confirmLogout = async () => {
    await logout();
    navigate('/login');
    if (onMobileClose) onMobileClose();
    setShowLogoutConfirm(false);
  };

  const sidebarClasses = `fixed left-0 top-0 z-50 flex h-screen w-80 max-w-[85vw] flex-col border-r border-slate-200/60 bg-white transition-all duration-300 lg:shadow-none ${isCollapsed ? 'lg:w-20' : 'lg:w-80'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-xl lg:shadow-none`;

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside className={sidebarClasses}>
        <div className="flex h-full min-h-0 flex-col">
          {/* Brand + collapse */}
          <div className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3.5">
            {!isCollapsed && (
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center rounded-lg border border-[#C79A3D]/30 bg-[#C79A3D]/10 p-1.5">
                  <Shield className="h-4.5 w-4.5 text-[#C79A3D]" />
                </span>
                <h2 className="font-['Lora'] text-base font-semibold text-[#1C2B27]">
                  SmartCare<span className="text-[#C79A3D]">HMS</span>
                </h2>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="h-4.5 w-4.5" /> : <ChevronLeft className="h-4.5 w-4.5" />}
            </button>
          </div>

          {/* Role indicator */}
          {!isCollapsed && (
            <div className="border-b border-slate-200/60 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center rounded-md bg-slate-100 p-1">
                  <Activity className="h-3.5 w-3.5 text-slate-500" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  Signed in as:
                </span>
                <span className="font-mono text-xs font-medium text-slate-700">
                  {roleLabel}
                </span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-3">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`relative flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#F6F2E7] text-[#B8860B]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                  title={item.label}
                >
                  {isActive && (
                    <span className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-[#C79A3D]" />
                  )}
                  <Icon
                    className={`h-5 w-5 shrink-0 ${isCollapsed ? '' : 'mr-3'} ${
                      isActive ? 'text-[#B8860B]' : 'text-slate-500'
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Footer / Logout */}
          <div className="border-t border-slate-200/60 p-3">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 ${isCollapsed ? 'justify-center' : ''}`}
              title="Logout"
            >
              <LogOut className={`h-5 w-5 shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
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
