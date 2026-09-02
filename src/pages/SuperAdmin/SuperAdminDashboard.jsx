import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, Settings, CreditCard,
  ShieldCheck, LogOut, ChevronLeft, ChevronRight, Menu, Ticket, UserPlus, Activity, Globe, TrendingUp
} from 'lucide-react';
import { logout } from '../../utils/api';
import ConfirmModal from '../../components/ConfirmModal';
import AuditLogsPanel from './AuditLogsPanel';
import { SuperAdminDataProvider, useSuperAdminData } from '../../contexts/SuperAdminDataContext';

const PlatformAnalytics = lazy(() => import('./PlatformAnalytics'));
const TenantAnalytics = lazy(() => import('./TenantAnalytics'));
const TenantManagement = lazy(() => import('./TenantManagement'));
const PatientManagement = lazy(() => import('./PatientManagement'));
const UserManagement = lazy(() => import('./UserManagement'));
const SystemSettings = lazy(() => import('./SystemSettings'));
const SubscriptionManagement = lazy(() => import('./SubscriptionManagement'));
const SupportTickets = lazy(() => import('./SupportTickets'));
const GlobalAdmins = lazy(() => import('./GlobalAdmins'));
const ReferenceData = lazy(() => import('./ReferenceData'));

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'Growth & Usage', path: '/tenant-analytics' },
  { icon: Building2, label: 'Tenants', path: '/tenants' },
  { icon: Globe, label: 'Reference Data', path: '/reference-data' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: CreditCard, label: 'Subscriptions', path: '/subscriptions' },
  { icon: Ticket, label: 'Support', path: '/support' },
  { icon: UserPlus, label: 'Admins', path: '/admins' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const isActivePath = (path) => window.location.pathname === path || window.location.pathname.startsWith(`${path}/`);

const SuperAdminRoutes = () => {
  const { prefetchAll } = useSuperAdminData();

  useEffect(() => {
    prefetchAll();
  }, [prefetchAll]);

  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C79A3D] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<PlatformAnalytics />} />
        <Route path="/tenant-analytics" element={<TenantAnalytics />} />
        <Route path="/tenants" element={<TenantManagement />} />
        <Route path="/reference-data" element={<ReferenceData />} />
        <Route path="/patients" element={<PatientManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/subscriptions" element={<SubscriptionManagement />} />
        <Route path="/support" element={<SupportTickets />} />
        <Route path="/admins" element={<GlobalAdmins />} />
        <Route path="/settings" element={<SystemSettings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(true);
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
      sessionStorage.removeItem('adminAuthenticated');
      window.dispatchEvent(new Event('authChanged'));
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const sidebarClasses = `fixed left-0 top-0 z-50 flex h-screen w-48 max-w-[85vw] flex-col border-r border-[#C79A3D]/20 bg-[#0D1917] transition-all duration-300 lg:shadow-none ${isCollapsed ? 'lg:w-12' : 'lg:w-48'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-xl lg:shadow-none`;

  return (
    <SuperAdminDataProvider>
      <div className="flex w-full min-h-screen bg-[#F6F2E7] font-['Inter',system-ui,sans-serif] antialiased">
        <aside className={sidebarClasses}>
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-center justify-between border-b border-[#C79A3D]/20 px-4 py-3.5">
              {!isCollapsed && (
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center justify-center rounded-lg border border-[#C79A3D]/30 bg-[#C79A3D]/10 p-1.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-[#C79A3D]" />
                  </span>
                  <h2 className="font-['Lora'] text-base font-semibold text-[#F6F2E7]">
                    Super<span className="text-[#C79A3D]">Admin</span>
                  </h2>
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="rounded-lg p-1.5 text-[#A9C0B6] hover:bg-[#1C2B27] hover:text-[#F6F2E7]"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight className="h-4.5 w-4.5" /> : <ChevronLeft className="h-4.5 w-4.5" />}
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setIsMobileOpen(false); }}
                    className={`relative flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${active ? 'bg-[#C79A3D]/15 text-[#F6F2E7] shadow-sm' : 'text-[#A9C0B6] hover:bg-[#1C2B27] hover:text-[#F6F2E7]'}`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-[#C79A3D]/20 p-3">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={`flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium text-[#A9C0B6] transition-all duration-200 hover:bg-red-900/20 hover:text-red-400 ${isCollapsed ? 'justify-center' : ''}`}
                title="Logout"
              >
                <LogOut className={`h-5 w-5 shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        <div className={`flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:ml-12 lg:mr-0' : 'lg:ml-48 lg:mr-0'} ${showAuditLogs ? 'lg:mr-80' : ''}`}>
          <header className="sticky top-0 z-30 border-b border-[#E8E3DC] bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileOpen(true)}
                  className="rounded-lg p-2 text-[#5A5A5A] hover:bg-[#F0EDE8] lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden rounded-lg p-2 text-[#5A5A5A] hover:bg-[#F0EDE8] lg:block"
                >
                  {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
                <div>
                  <h1 className="text-base font-semibold text-[#1A1A1A]">SmartCare HMS</h1>
                  <p className="text-xs text-[#5A5A5A]">Super Admin Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAuditLogs(!showAuditLogs)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${showAuditLogs ? 'border-[#C79A3D] bg-[#C79A3D]/20 text-[#B8860B]' : 'border-[#C79A3D]/30 bg-[#C79A3D]/10 text-[#B8860B] hover:bg-[#C79A3D]/20'}`}
                >
                  <Activity className="h-3.5 w-3.5" />
                  Activity
                </button>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C79A3D]/30 bg-[#C79A3D]/10 px-3 py-1.5 text-xs font-medium text-[#B8860B]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin
                </span>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6">
            <SuperAdminRoutes />
          </main>
        </div>

        {showAuditLogs && (
          <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => { setShowAuditLogs(false); setSelectedAuditLog(null); }} />
            <div className={`fixed right-0 top-0 h-screen w-80 max-w-[85vw] bg-white border-l border-slate-200 shadow-2xl z-40 transition-transform duration-300 ${showAuditLogs ? 'translate-x-0' : 'translate-x-full'}`}>
              <AuditLogsPanel
                isOpen={showAuditLogs}
                onClose={() => { setShowAuditLogs(false); setSelectedAuditLog(null); }}
                onSelectLog={(log) => setSelectedAuditLog(log)}
                selectedLog={selectedAuditLog}
              />
            </div>
          </>
        )}

        <ConfirmModal
          isOpen={showLogoutConfirm}
          onClose={() => !isLoggingOut && setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
          title="Confirm Logout"
          message="Are you sure you want to sign out of the admin dashboard?"
          confirmText="Yes, Logout"
          cancelText="Cancel"
          type="logout"
          isLoading={isLoggingOut}
          loadingText="Signing out..."
        />
      </div>
    </SuperAdminDataProvider>
  );
};

export default SuperAdminDashboard;
