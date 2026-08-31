import React, { lazy, Suspense, useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import ErrorBoundary from './components/ErrorBoundary';
import PageErrorBoundary from './components/PageErrorBoundary';
import { getUserPreferences } from './utils/cookies';
import Loader from './components/Loader';
import { apiRequest, parseListResponse, checkAuthStatus } from './utils/api';
import { isAdminSubdomain } from './utils/subdomain';


const RoleInsightPanel = lazy(() => import('./components/dashboards/RoleInsightPanel'));

const SuperAdminDashboard = lazy(() => import('./pages/SuperAdmin/SuperAdminDashboard'));
const AdminLogin = lazy(() => import('./pages/SuperAdmin/AdminLogin'));

// Lazy-load pages and heavier layout parts to enable code-splitting and faster initial loads

const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));
const Sidebar = lazy(() => import('./components/Sidebar'));

const Dashboard = lazy(() => import('./pages/Dashboard'));
const PatientManagement = lazy(() => import('./pages/PatientManagement'));
const PatientJourney = lazy(() => import('./pages/PatientJourney'));
const PatientMPI = lazy(() => import('./pages/PatientMPI'));
const Billing = lazy(() => import('./pages/Billing'));
const Pharmacy = lazy(() => import('./pages/Pharmacy'));
const Consultation = lazy(() => import('./pages/Consultation'));
const ConsultationV2 = lazy(() => import('./pages/ConsultationV2'));
const LaboratoryDashboard = lazy(() => import('./components/dashboards/LaboratoryDashboard'));
const LaboratoryPage = lazy(() => import('./pages/Laboratory'));
const StaffManagement = lazy(() => import('./pages/StaffManagement'));
const Appointments = lazy(() => import('./pages/Appointments'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ActivityLog = lazy(() => import('./pages/ActivityLog'));
const BedAllocation = lazy(() => import('./pages/BedAllocation'));
const AdmissionManagement = lazy(() => import('./pages/AdmissionManagement'));
const IPDManagement = lazy(() => import('./pages/IPDManagement'));
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
const MirthConnect = lazy(() => import('./pages/MirthConnect'));
const FinancialAnalytics = lazy(() => import('./pages/FinancialAnalytics'));
const ClinicalAudit = lazy(() => import('./pages/ClinicalAudit'));
const PatientFeedback = lazy(() => import('./pages/PatientFeedback'));
const CreditManagement = lazy(() => import('./pages/CreditManagement'));
const NDPRCompliance = lazy(() => import('./pages/NDPRCompliance'));
const BudgetingForecasting = lazy(() => import('./pages/BudgetingForecasting'));
const Settings = lazy(() => import('./pages/Settings'));
const TenantSubscription = lazy(() => import('./pages/TenantSubscription'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const InvitationSignup = lazy(() => import('./pages/InvitationSignup'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

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
  return sessionStorage.getItem('isAuthenticated') === 'true';
};

const isPatientSession = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(
    localStorage.getItem('patientAccessToken') ||
    localStorage.getItem('isPatientAuthenticated') === 'true' ||
    localStorage.getItem('userRole') === 'patient'
  );
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
   const location = useLocation();
   const role = (localStorage.getItem('userRole') || 'admin').toLowerCase();

   if (isPatientSession()) {
     return <Navigate to="/patient-portal" replace state={{ from: location }} />;
   }

   if (!isAuthenticated()) {
     return <Navigate to="/login" replace state={{ from: location }} />;
   }

   if (allowedRoles.length && !allowedRoles.includes(role)) {
     return <Navigate to="/dashboard" replace state={{ from: location }} />;
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

  const prefetchRouteModules = () => {
    const modules = [
      () => import('./pages/Dashboard'),
      () => import('./pages/PatientManagement'),
      () => import('./pages/Billing'),
      () => import('./pages/Pharmacy'),
      () => import('./pages/ConsultationV2'),
      () => import('./components/dashboards/LaboratoryDashboard'),
      () => import('./pages/Laboratory'),
      () => import('./pages/StaffManagement'),
      () => import('./pages/Appointments'),
      () => import('./pages/Settings'),
      () => import('./pages/Login'),
      () => import('./pages/Signup'),
      () => import('./pages/VerifyEmail'),
      () => import('./pages/AboutPage'),
      () => import('./pages/PrivacyPage'),
      () => import('./pages/TermsPage'),
      () => import('./pages/ContactPage'),
    ];

    void Promise.allSettled(modules.map((load) => load())).catch(() => {});
  };

  const PublicRoute = ({ children, allowAuthenticated = false }) => {
  if (isAuthenticated() && !allowAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppLayout() {
   const location = useLocation();
   const publicPaths = ['/', '/login', '/signup', '/verify-email', '/invitation-signup', '/about', '/privacy', '/terms', '/contact'];
   const isLandingPage = location.pathname === '/';
   const isLoginPage = location.pathname === '/login';
   const isSignupPage = location.pathname === '/signup';
   const isInvitationSignupPage = location.pathname === '/invitation-signup' || location.pathname.startsWith('/invitation-signup/');
   const isPatientPortalPage = location.pathname === '/patient-portal';
   const isInfoPage = publicPaths.includes(location.pathname);
   const isPublicPage = isLandingPage || isLoginPage || isSignupPage || isInvitationSignupPage || isPatientPortalPage || isInfoPage;
   const adminSubdomain = isAdminSubdomain();
   const isAdminAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState(false);
   const [userRole, setUserRole] = useState(getStoredRole);
   const [isRootAdmin, setIsRootAdmin] = useState(getStoredIsRootAdmin);
   const [isDark, setIsDark] = useState(() => getUserPreferences().theme === 'dark');
   const [refreshInterval, setRefreshInterval] = useState(() => getUserPreferences().refreshInterval || 60);
   const [rightSidebarData, setRightSidebarData] = useState(null);
   const [rightSidebarLoading, setRightSidebarLoading] = useState(false);
   const [rightSidebarError, setRightSidebarError] = useState(null);
   const navigate = useNavigate();

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
    if (adminSubdomain) return;
    let cancelled = false;
    const verify = async () => {
      if (sessionStorage.getItem('isAuthenticated') === 'true') return;
      const result = await checkAuthStatus();
      if (!cancelled && result.authenticated) {
        sessionStorage.setItem('isAuthenticated', 'true');
        if (result.user) {
          if (result.user.role) localStorage.setItem('userRole', result.user.role);
          if (result.user.is_root_admin) localStorage.setItem('userIsRootAdmin', 'true');
        }
      }
    };
    verify();
    return () => { cancelled = true; };
  }, [adminSubdomain]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;
    const runPrefetch = () => {
      if (!cancelled) {
        prefetchRouteModules();
      }
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(runPrefetch, { timeout: 1500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = window.setTimeout(runPrefetch, 800);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

   useEffect(() => {
    if (adminSubdomain || ['doctor', 'nurse', 'pharmacist', 'receptionist', 'lab_tech', 'lab_manager'].includes(userRole)) {
       setRightSidebarData(null);
       setRightSidebarError(null);
       return;
     }
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
       const intervalMs = Math.max(60000, (refreshInterval || 300) * 1000);
       refreshIntervalId = window.setInterval(loadInsights, intervalMs);
     }

     return () => {
       if (refreshIntervalId) {
         window.clearInterval(refreshIntervalId);
       }
     };
   }, [isPublicPage, userRole, refreshInterval, adminSubdomain]);

   useEffect(() => {
     if (adminSubdomain || isPublicPage || !auditAccess.canView) {
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
   }, [isPublicPage, auditAccess.canView, adminSubdomain]);

   if (adminSubdomain) {
     return (
       <div className="app-shell relative flex min-h-screen overflow-x-hidden transition-colors duration-300">
         <PageErrorBoundary>
           <Suspense fallback={<Loader />}>
             {isAdminAuthenticated ? <SuperAdminDashboard /> : <AdminLogin />}
           </Suspense>
         </PageErrorBoundary>
       </div>
     );
   }

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
                <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                 <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                 <Route path="/verify-email" element={<PublicRoute><VerifyEmail /></PublicRoute>} />
                <Route path="/invitation-signup" element={<PublicRoute allowAuthenticated={true}><InvitationSignup /></PublicRoute>} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/activity-log" element={<ProtectedRoute><ActivityLog onBack={() => navigate(-1)} /></ProtectedRoute>} />
                <Route path="/patients" element={<ProtectedRoute><PatientManagement /></ProtectedRoute>} />
                <Route path="/patients/mpi" element={<ProtectedRoute allowedRoles={['admin', 'tenant_admin', 'super_admin', 'system_admin']}><PatientMPI /></ProtectedRoute>} />
                <Route path="/patients/add" element={<ProtectedRoute><PatientManagement /></ProtectedRoute>} />
                <Route path="/patients/:patientId/journey" element={<ProtectedRoute><PatientJourney /></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute allowedRoles={['admin', 'accountant', 'billing_officer', 'super_admin', 'system_admin']}><Billing /></ProtectedRoute>} />
                <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
                <Route path="/consultation" element={<ProtectedRoute allowedRoles={['doctor', 'nurse', 'admin', 'super_admin', 'system_admin']}><ConsultationV2 /></ProtectedRoute>} />
                <Route path="/consultation-legacy" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
                <Route path="/laboratory" element={<ProtectedRoute allowedRoles={['lab_tech', 'lab_manager', 'admin', 'super_admin', 'system_admin']}><LaboratoryPage /></ProtectedRoute>} />
                <Route path="/staff" element={<ProtectedRoute><StaffManagement /></ProtectedRoute>} />
                <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><Navigate to="/pharmacy" replace /></ProtectedRoute>} />
                <Route path="/bed-allocation" element={<ProtectedRoute><Navigate to="/admissions" replace /></ProtectedRoute>} />
                <Route path="/admissions" element={<ProtectedRoute><AdmissionManagement /></ProtectedRoute>} />
                <Route path="/ipd" element={<ProtectedRoute allowedRoles={['doctor', 'nurse', 'admin', 'tenant_admin', 'super_admin', 'system_admin']}><Navigate to="/admissions" replace /></ProtectedRoute>} />
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
                <Route path="/medical-supplies" element={<ProtectedRoute><MedicalSupplies /></ProtectedRoute>} />
                <Route path="/central-store" element={<ProtectedRoute><CentralStore /></ProtectedRoute>} />
                <Route path="/procurement" element={<ProtectedRoute><Procurement /></ProtectedRoute>} />
                <Route path="/vital-signs" element={<ProtectedRoute><VitalSignsMonitoring /></ProtectedRoute>} />
                <Route path="/emr" element={<ProtectedRoute allowedRoles={['doctor', 'nurse', 'pharmacist', 'admin', 'super_admin', 'system_admin']}><ElectronicMedicalRecords /></ProtectedRoute>} />
                <Route path="/ussd" element={<ProtectedRoute><USSDSystem /></ProtectedRoute>} />
                <Route path="/cds" element={<ProtectedRoute><ClinicalDecisionSupport /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderEntrySystem /></ProtectedRoute>} />
                <Route path="/emergency-dept" element={<ProtectedRoute><EmergencyDepartmentManagement /></ProtectedRoute>} />
                <Route path="/nhis" element={<ProtectedRoute><NHISManagement /></ProtectedRoute>} />
                <Route path="/patient-portal" element={<PublicRoute allowAuthenticated={true}><PatientPortal /></PublicRoute>} />
                <Route path="/mobile-money" element={<ProtectedRoute><MobileMoneyIntegration /></ProtectedRoute>} />
                <Route path="/theater-scheduling" element={<ProtectedRoute><TheaterScheduling /></ProtectedRoute>} />
                <Route path="/pre-operative" element={<ProtectedRoute><PreOperativeAssessment /></ProtectedRoute>} />
                <Route path="/intra-operative" element={<ProtectedRoute><IntraOperativeDocumentation /></ProtectedRoute>} />
                <Route path="/post-operative" element={<ProtectedRoute><PostOperativeCare /></ProtectedRoute>} />
                <Route path="/theater-analytics" element={<ProtectedRoute><TheaterAnalytics /></ProtectedRoute>} />
                <Route path="/appointment-reminders" element={<ProtectedRoute><AppointmentReminders /></ProtectedRoute>} />
                <Route path="/ncdc-surveillance" element={<ProtectedRoute><NCDCDiseaseSurveillance /></ProtectedRoute>} />
                <Route path="/external-integrations" element={<ProtectedRoute allowedRoles={['admin', 'super_admin', 'system_admin']}><ExternalIntegrations /></ProtectedRoute>} />
                <Route path="/mirth-connect" element={<ProtectedRoute allowedRoles={['admin', 'tenant_admin', 'super_admin', 'system_admin']}><MirthConnect /></ProtectedRoute>} />
                <Route path="/financial-analytics" element={<ProtectedRoute allowedRoles={['admin', 'accountant', 'billing_officer', 'super_admin', 'system_admin']}><FinancialAnalytics /></ProtectedRoute>} />
                <Route path="/clinical-audit" element={<ProtectedRoute><ClinicalAudit /></ProtectedRoute>} />
                <Route path="/patient-feedback" element={<ProtectedRoute><PatientFeedback /></ProtectedRoute>} />
                <Route path="/credit-management" element={<ProtectedRoute><CreditManagement /></ProtectedRoute>} />
                <Route path="/ndpr-compliance" element={<ProtectedRoute><NDPRCompliance /></ProtectedRoute>} />
                <Route path="/budgeting-forecasting" element={<ProtectedRoute><BudgetingForecasting /></ProtectedRoute>} />
                <Route path="/settings" element={<SettingsRoute><Settings /></SettingsRoute>} />
                <Route path="/subscription" element={<SettingsRoute><TenantSubscription /></SettingsRoute>} />
                 <Route path="/404" element={<NotFoundLayout><NotFound /></NotFoundLayout>} />
                <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
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
                onOpenActivityLog={() => navigate('/activity-log')}
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