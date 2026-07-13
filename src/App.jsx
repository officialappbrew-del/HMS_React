import React, { lazy, Suspense, useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import ErrorBoundary from './components/ErrorBoundary';
import PageErrorBoundary from './components/PageErrorBoundary';
import { getUserPreferences } from './utils/cookies';
import Loader from './components/Loader';
import { apiRequest, parseListResponse } from './utils/api';
import RoleInsightPanel from './components/dashboards/RoleInsightPanel';

// Lazy-load pages and heavier layout parts to enable code-splitting and faster initial loads
const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));
const Sidebar = lazy(() => import('./components/Sidebar'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const PatientManagement = lazy(() => import('./pages/PatientManagement'));
const Billing = lazy(() => import('./pages/Billing'));
const Pharmacy = lazy(() => import('./pages/Pharmacy'));
const Consultation = lazy(() => import('./pages/Consultation'));
const ConsultationV2 = lazy(() => import('./pages/ConsultationV2'));
const Laboratory = lazy(() => import('./pages/Laboratory'));
const StaffManagement = lazy(() => import('./pages/StaffManagement'));
const Appointments = lazy(() => import('./pages/Appointments'));
const Inventory = lazy(() => import('./pages/Inventory'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ActivityLog = lazy(() => import('./pages/ActivityLog'));
const BedAllocation = lazy(() => import('./pages/BedAllocation'));
const AdmissionManagement = lazy(() => import('./pages/AdmissionManagement'));
const WardRoundManagement = lazy(() => import('./pages/WardRoundManagement'));
const StaffDirectory = lazy(() => import('./pages/StaffDirectory'));
const LicenseTracking = lazy(() => import('./pages/LicenseTracking'));
const DutyRoster = lazy(() => import('./pages/DutyRoster'));
const PerformanceManagement = lazy(() => import('./pages/PerformanceManagement'));
const PayrollManagement = lazy(() => import('./pages/PayrollManagement'));
const EquipmentManagement = lazy(() => import('./pages/EquipmentManagement'));
const MaintenanceManagement = lazy(() => import('./pages/MaintenanceManagement'));
const GeneratorManagement = lazy(() => import('./pages/GeneratorManagement'));
const OxygenManagement = lazy(() => import('./pages/OxygenManagement'));
const TheaterScheduling = lazy(() => import('./pages/TheaterScheduling'));
const PreOperativeAssessment = lazy(() => import('./pages/PreOperativeAssessment'));
const IntraOperativeDocumentation = lazy(() => import('./pages/IntraOperativeDocumentation'));
const PostOperativeCare = lazy(() => import('./pages/PostOperativeCare'));
const TheaterAnalytics = lazy(() => import('./pages/TheaterAnalytics'));
const AmbulanceTracking = lazy(() => import('./pages/AmbulanceTracking'));
const FleetOperations = lazy(() => import('./pages/FleetOperations'));
const EmergencyResponse = lazy(() => import('./pages/EmergencyResponse'));
const ReferralTransport = lazy(() => import('./pages/ReferralTransport'));
const PharmacyInventory = lazy(() => import('./pages/PharmacyInventory'));
const MedicalSupplies = lazy(() => import('./pages/MedicalSupplies'));
const CentralStore = lazy(() => import('./pages/CentralStore'));
const Procurement = lazy(() => import('./pages/Procurement'));
const VitalSignsMonitoring = lazy(() => import('./pages/VitalSignsMonitoring'));
const ElectronicMedicalRecords = lazy(() => import('./pages/ElectronicMedicalRecords'));
const USSDSystem = lazy(() => import('./pages/USSDSystem'));
const ClinicalDecisionSupport = lazy(() => import('./pages/ClinicalDecisionSupport'));
const OrderEntrySystem = lazy(() => import('./pages/OrderEntrySystem'));
const EmergencyDepartmentManagement = lazy(() => import('./pages/EmergencyDepartmentManagement'));
const NHISManagement = lazy(() => import('./pages/NHISManagement'));
const PatientPortal = lazy(() => import('./pages/PatientPortal'));
const MobileMoneyIntegration = lazy(() => import('./pages/MobileMoneyIntegration'));
const AppointmentReminders = lazy(() => import('./pages/AppointmentReminders'));
const NCDCDiseaseSurveillance = lazy(() => import('./pages/NCDCDiseaseSurveillance'));
const ExternalIntegrations = lazy(() => import('./pages/ExternalIntegrations'));
const FinancialAnalytics = lazy(() => import('./pages/FinancialAnalytics'));
const ClinicalAudit = lazy(() => import('./pages/ClinicalAudit'));
const PatientFeedback = lazy(() => import('./pages/PatientFeedback'));
const CreditManagement = lazy(() => import('./pages/CreditManagement'));
const NDPRCompliance = lazy(() => import('./pages/NDPRCompliance'));
const BudgetingForecasting = lazy(() => import('./pages/BudgetingForecasting'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const LandingPage = lazy(() => import('./pages/LandingPage'));

const getStoredRole = () => {
  if (typeof window === 'undefined') return 'admin';
  return localStorage.getItem('userRole') || 'admin';
};

const getStoredIsRootAdmin = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('userIsRootAdmin') === 'true';
};

const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem('authToken'));
};

const ProtectedRoute = ({ children }) => {
   const location = useLocation();

   if (!isAuthenticated()) {
     return <Navigate to="/login" replace state={{ from: location }} />;
   }

   return children;
 };
 
 const SettingsRoute = ({ children }) => {
   const location = useLocation();

   if (!isAuthenticated()) {
     return <Navigate to="/login" replace state={{ from: location }} />;
   }

   if (localStorage.getItem('userIsRootAdmin') !== 'true') {
     return <Navigate to="/dashboard" replace state={{ from: location }} />;
   }

   return children;
 };

const NotFoundLayout = ({ children }) => {
    return <>{children}</>;
  };

  const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppLayout() {
   const location = useLocation();
   const isLandingPage = location.pathname === '/';
   const isLoginPage = location.pathname === '/login';
   const isSignupPage = location.pathname === '/signup';
   const isPublicPage = isLandingPage || isLoginPage || isSignupPage;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState(false);
  const [userRole, setUserRole] = useState(getStoredRole);
  const [isRootAdmin, setIsRootAdmin] = useState(getStoredIsRootAdmin);
  const [isDark, setIsDark] = useState(() => getUserPreferences().theme === 'dark');
  const [refreshInterval, setRefreshInterval] = useState(() => getUserPreferences().refreshInterval || 60);
  const [rightSidebarData, setRightSidebarData] = useState(null);
  const [rightSidebarLoading, setRightSidebarLoading] = useState(false);
  const [rightSidebarError, setRightSidebarError] = useState(null);
  const [activeCenterView, setActiveCenterView] = useState(null);

  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);
  const [auditLogsError, setAuditLogsError] = useState(null);

  // Audit visibility + detail level are derived from the user's access level.
  // Only admin-tier users (global system admins or tenant admins/root admins)
  // may preview audit logs in the sidebar; lower roles see no audit card.
  const auditAccess = useMemo(() => {
    const isGlobalAdmin = ['system_admin', 'super_admin'].includes(userRole);
    const isTenantAdmin = userRole === 'admin' || isRootAdmin;
    return {
      canView: isGlobalAdmin || isTenantAdmin,
      detail: isGlobalAdmin || isRootAdmin,
    };
  }, [userRole, isRootAdmin]);

  useEffect(() => {
    const syncRole = () => {
      setUserRole(getStoredRole());
    };

    const syncIsRootAdmin = () => {
      setIsRootAdmin(getStoredIsRootAdmin());
    };

    const syncTheme = () => {
      setIsDark(getUserPreferences().theme === 'dark');
    };

    const syncPreferences = () => {
      setRefreshInterval(getUserPreferences().refreshInterval || 60);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpenOnMobile(false);
      }
    };

    syncRole();
    syncIsRootAdmin();
    syncTheme();
    handleResize();
    window.addEventListener('authChanged', syncRole);
    window.addEventListener('authChanged', syncIsRootAdmin);
    window.addEventListener('storage', syncRole);
    window.addEventListener('storage', syncIsRootAdmin);
    window.addEventListener('storage', syncTheme);
    window.addEventListener('themeChanged', syncTheme);
    window.addEventListener('preferencesChanged', syncPreferences);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('authChanged', syncRole);
      window.removeEventListener('authChanged', syncIsRootAdmin);
      window.removeEventListener('storage', syncRole);
      window.removeEventListener('storage', syncIsRootAdmin);
      window.removeEventListener('storage', syncTheme);
      window.removeEventListener('themeChanged', syncTheme);
      window.removeEventListener('preferencesChanged', syncPreferences);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [isDark]);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setRightSidebarLoading(true);
        setRightSidebarError(null);
        const data = await apiRequest('/api/v1/core/dashboard-insights/');
        setRightSidebarData(data);
      } catch (err) {
        setRightSidebarError(err.message || 'Unable to load role insights');
      } finally {
        setRightSidebarLoading(false);
      }
    };

    let refreshIntervalId;
    if (!isPublicPage && userRole) {
      loadInsights();
      const intervalMs = Math.max(15000, (refreshInterval || 60) * 1000);
      refreshIntervalId = window.setInterval(loadInsights, intervalMs);
    }

    return () => {
      if (refreshIntervalId) {
        window.clearInterval(refreshIntervalId);
      }
    };
  }, [isPublicPage, userRole, refreshInterval]);

  useEffect(() => {
    if (isPublicPage || !auditAccess.canView) {
      setAuditLogs([]);
      return;
    }

    let cancelled = false;
    const loadAuditLogs = async () => {
      try {
        setAuditLogsLoading(true);
        setAuditLogsError(null);
        const data = await apiRequest('/api/v1/core/audit-logs/?page_size=2');
        if (!cancelled) setAuditLogs(parseListResponse(data).slice(0, 2));
      } catch (err) {
        if (!cancelled) setAuditLogsError(err.message || 'Unable to load audit logs');
      } finally {
        if (!cancelled) setAuditLogsLoading(false);
      }
    };

    loadAuditLogs();
    return () => {
      cancelled = true;
    };
  }, [isPublicPage, auditAccess.canView]);

  return (
    <div className={`app-shell relative flex min-h-screen overflow-x-hidden transition-colors duration-300 ${isDark ? 'dark-theme' : ''}`}>
      {!isPublicPage && (
        <div className="print:hidden">
          <Suspense fallback={null}>
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
              userRole={userRole}
              isRootAdmin={isRootAdmin}
              isMobileOpen={isSidebarOpenOnMobile}
              onMobileClose={() => setIsSidebarOpenOnMobile(false)}
            />
          </Suspense>
        </div>
      )}
      <div className={`relative flex min-h-screen w-full min-w-0 flex-1 flex-col transition-all duration-300 print:block ${!isPublicPage ? (isSidebarCollapsed ? 'lg:pl-24' : 'lg:pl-80') : ''}`}>
        {!isPublicPage && (
          <div className="print:hidden">
            <Suspense fallback={null}>
              <Header
                userRole={userRole}
                onToggleSidebar={() => setIsSidebarOpenOnMobile(!isSidebarOpenOnMobile)}
              />
            </Suspense>
          </div>
         )}
         <div className={`flex-1 flex flex-col lg:flex-row`}>
          <main className={`flex-1 overflow-x-hidden transition-colors duration-300 ${!isPublicPage ? (isDark ? 'bg-slate-950' : 'bg-slate-50') : ''} print:bg-white`}>
            <PageErrorBoundary>
              <Suspense fallback={<Loader />}>
                {activeCenterView === 'activityLog' ? (
                  <ActivityLog onBack={() => setActiveCenterView(null)} />
                ) : (
                  <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/patients" element={<ProtectedRoute><PatientManagement /></ProtectedRoute>} />
                <Route path="/patients/add" element={<ProtectedRoute><PatientManagement /></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
                <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
                <Route path="/consultation" element={<ProtectedRoute><ConsultationV2 /></ProtectedRoute>} />
                <Route path="/consultation-legacy" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
                <Route path="/laboratory" element={<ProtectedRoute><Laboratory /></ProtectedRoute>} />
                <Route path="/staff" element={<ProtectedRoute><StaffManagement /></ProtectedRoute>} />
                <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                <Route path="/bed-allocation" element={<ProtectedRoute><BedAllocation /></ProtectedRoute>} />
                <Route path="/admissions" element={<ProtectedRoute><AdmissionManagement /></ProtectedRoute>} />
                <Route path="/ward-rounds" element={<ProtectedRoute><WardRoundManagement /></ProtectedRoute>} />
                <Route path="/staff-directory" element={<ProtectedRoute><StaffDirectory /></ProtectedRoute>} />
                <Route path="/license-tracking" element={<ProtectedRoute><LicenseTracking /></ProtectedRoute>} />
                <Route path="/duty-roster" element={<ProtectedRoute><DutyRoster /></ProtectedRoute>} />
                <Route path="/performance-management" element={<ProtectedRoute><PerformanceManagement /></ProtectedRoute>} />
                <Route path="/payroll-management" element={<ProtectedRoute><PayrollManagement /></ProtectedRoute>} />
                <Route path="/equipment" element={<ProtectedRoute><EquipmentManagement /></ProtectedRoute>} />
                <Route path="/maintenance" element={<ProtectedRoute><MaintenanceManagement /></ProtectedRoute>} />
                <Route path="/generators" element={<ProtectedRoute><GeneratorManagement /></ProtectedRoute>} />
                <Route path="/oxygen" element={<ProtectedRoute><OxygenManagement /></ProtectedRoute>} />
                <Route path="/ambulance-tracking" element={<ProtectedRoute><AmbulanceTracking /></ProtectedRoute>} />
                <Route path="/fleet-operations" element={<ProtectedRoute><FleetOperations /></ProtectedRoute>} />
                <Route path="/emergency-response" element={<ProtectedRoute><EmergencyResponse /></ProtectedRoute>} />
                <Route path="/referral-transport" element={<ProtectedRoute><ReferralTransport /></ProtectedRoute>} />
                <Route path="/pharmacy-inventory" element={<ProtectedRoute><PharmacyInventory /></ProtectedRoute>} />
                <Route path="/medical-supplies" element={<ProtectedRoute><MedicalSupplies /></ProtectedRoute>} />
                <Route path="/central-store" element={<ProtectedRoute><CentralStore /></ProtectedRoute>} />
                <Route path="/procurement" element={<ProtectedRoute><Procurement /></ProtectedRoute>} />
                <Route path="/vital-signs" element={<ProtectedRoute><VitalSignsMonitoring /></ProtectedRoute>} />
                <Route path="/emr" element={<ProtectedRoute><ElectronicMedicalRecords /></ProtectedRoute>} />
                <Route path="/ussd" element={<ProtectedRoute><USSDSystem /></ProtectedRoute>} />
                <Route path="/cds" element={<ProtectedRoute><ClinicalDecisionSupport /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderEntrySystem /></ProtectedRoute>} />
                <Route path="/emergency-dept" element={<ProtectedRoute><EmergencyDepartmentManagement /></ProtectedRoute>} />
                <Route path="/nhis" element={<ProtectedRoute><NHISManagement /></ProtectedRoute>} />
                <Route path="/patient-portal" element={<ProtectedRoute><PatientPortal /></ProtectedRoute>} />
                <Route path="/mobile-money" element={<ProtectedRoute><MobileMoneyIntegration /></ProtectedRoute>} />
                <Route path="/theater-scheduling" element={<ProtectedRoute><TheaterScheduling /></ProtectedRoute>} />
                <Route path="/pre-operative" element={<ProtectedRoute><PreOperativeAssessment /></ProtectedRoute>} />
                <Route path="/intra-operative" element={<ProtectedRoute><IntraOperativeDocumentation /></ProtectedRoute>} />
                <Route path="/post-operative" element={<ProtectedRoute><PostOperativeCare /></ProtectedRoute>} />
                <Route path="/theater-analytics" element={<ProtectedRoute><TheaterAnalytics /></ProtectedRoute>} />
                <Route path="/appointment-reminders" element={<ProtectedRoute><AppointmentReminders /></ProtectedRoute>} />
                <Route path="/ncdc-surveillance" element={<ProtectedRoute><NCDCDiseaseSurveillance /></ProtectedRoute>} />
                <Route path="/external-integrations" element={<ProtectedRoute><ExternalIntegrations /></ProtectedRoute>} />
                <Route path="/financial-analytics" element={<ProtectedRoute><FinancialAnalytics /></ProtectedRoute>} />
                <Route path="/clinical-audit" element={<ProtectedRoute><ClinicalAudit /></ProtectedRoute>} />
                <Route path="/patient-feedback" element={<ProtectedRoute><PatientFeedback /></ProtectedRoute>} />
                <Route path="/credit-management" element={<ProtectedRoute><CreditManagement /></ProtectedRoute>} />
                <Route path="/ndpr-compliance" element={<ProtectedRoute><NDPRCompliance /></ProtectedRoute>} />
                <Route path="/budgeting-forecasting" element={<ProtectedRoute><BudgetingForecasting /></ProtectedRoute>} />
                <Route path="/settings" element={<SettingsRoute><Settings /></SettingsRoute>} />
                 <Route path="/404" element={<NotFoundLayout><NotFound /></NotFoundLayout>} />
                </Routes>
                )}
              </Suspense>
            </PageErrorBoundary>
          </main>
          {!isPublicPage && (
            <div className="print:hidden hidden lg:block w-96 border-l border-slate-200 bg-slate-50 overflow-y-auto">
              <RoleInsightPanel
                role={userRole}
                loading={rightSidebarLoading}
                error={rightSidebarError}
                data={rightSidebarData}
                canViewAuditLogs={auditAccess.canView}
                auditDetail={auditAccess.detail}
                auditLogs={auditLogs}
                auditLogsLoading={auditLogsLoading}
                auditLogsError={auditLogsError}
                onOpenActivityLog={() => setActiveCenterView('activityLog')}
              />
            </div>
          )}
        </div>
        {!isPublicPage && (
          <div className="print:hidden">
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
   return (
     <Provider store={store}>
       <ErrorBoundary>
         <Router>
           <Routes>
             <Route path="/404" element={<NotFoundLayout><NotFound /></NotFoundLayout>} />
             <Route path="*" element={<AppLayout />} />
           </Routes>
         </Router>
       </ErrorBoundary>
     </Provider>
   );
  }

export default App;