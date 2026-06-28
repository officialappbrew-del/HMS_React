import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useState, useEffect } from 'react';
import store from './store';
import ErrorBoundary from './components/ErrorBoundary';
import PageErrorBoundary from './components/PageErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { getUserPreferences } from './utils/cookies';
import Dashboard from './pages/Dashboard';
import PatientManagement from './pages/PatientManagement';
import Billing from './pages/Billing';
import Pharmacy from './pages/Pharmacy';
import Consultation from './pages/Consultation';
import ConsultationV2 from './pages/ConsultationV2';
import Laboratory from './pages/Laboratory';
import StaffManagement from './pages/StaffManagement';
import Appointments from './pages/Appointments';
import Inventory from './pages/Inventory';
import NotFound from './pages/NotFound';
import ActivityLog from './pages/ActivityLog';
import BedAllocation from './pages/BedAllocation';
import AdmissionManagement from './pages/AdmissionManagement';
import WardRoundManagement from './pages/WardRoundManagement';
import StaffDirectory from './pages/StaffDirectory';
import LicenseTracking from './pages/LicenseTracking';
import DutyRoster from './pages/DutyRoster';
import PerformanceManagement from './pages/PerformanceManagement';
import PayrollManagement from './pages/PayrollManagement';
import EquipmentManagement from './pages/EquipmentManagement';
import MaintenanceManagement from './pages/MaintenanceManagement';
import GeneratorManagement from './pages/GeneratorManagement';
import OxygenManagement from './pages/OxygenManagement';
import TheaterScheduling from './pages/TheaterScheduling';
import PreOperativeAssessment from './pages/PreOperativeAssessment';
import IntraOperativeDocumentation from './pages/IntraOperativeDocumentation';
import PostOperativeCare from './pages/PostOperativeCare';
import TheaterAnalytics from './pages/TheaterAnalytics';
import AmbulanceTracking from './pages/AmbulanceTracking';
// import AmbulanceTracking from './pages/AmbulanceTracking';
import FleetOperations from './pages/FleetOperations';
import EmergencyResponse from './pages/EmergencyResponse';
import ReferralTransport from './pages/ReferralTransport';
import PharmacyInventory from './pages/PharmacyInventory';
import MedicalSupplies from './pages/MedicalSupplies';
import CentralStore from './pages/CentralStore';
import Procurement from './pages/Procurement';
import VitalSignsMonitoring from './pages/VitalSignsMonitoring';
import ElectronicMedicalRecords from './pages/ElectronicMedicalRecords';
import USSDSystem from './pages/USSDSystem';
import ClinicalDecisionSupport from './pages/ClinicalDecisionSupport';
import OrderEntrySystem from './pages/OrderEntrySystem';
import EmergencyDepartmentManagement from './pages/EmergencyDepartmentManagement';
import NHISManagement from './pages/NHISManagement';
import PatientPortal from './pages/PatientPortal';
import MobileMoneyIntegration from './pages/MobileMoneyIntegration';
import AppointmentReminders from './pages/AppointmentReminders';
import NCDCDiseaseSurveillance from './pages/NCDCDiseaseSurveillance';
import ExternalIntegrations from './pages/ExternalIntegrations';
import FinancialAnalytics from './pages/FinancialAnalytics';
import ClinicalAudit from './pages/ClinicalAudit';
import PatientFeedback from './pages/PatientFeedback';
import CreditManagement from './pages/CreditManagement';
import NDPRCompliance from './pages/NDPRCompliance';
import BudgetingForecasting from './pages/BudgetingForecasting';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
// import ClinicalDecisionSupport from './pages/ClinicalDecisionSupport';

const getStoredRole = () => {
  if (typeof window === 'undefined') return 'admin';
  return localStorage.getItem('userRole') || 'admin';
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
  const [isDark, setIsDark] = useState(() => getUserPreferences().theme === 'dark');

  useEffect(() => {
    const syncRole = () => {
      setUserRole(getStoredRole());
    };

    const syncTheme = () => {
      setIsDark(getUserPreferences().theme === 'dark');
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpenOnMobile(false);
      }
    };

    syncRole();
    syncTheme();
    handleResize();
    window.addEventListener('authChanged', syncRole);
    window.addEventListener('storage', syncRole);
    window.addEventListener('storage', syncTheme);
    window.addEventListener('themeChanged', syncTheme);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('authChanged', syncRole);
      window.removeEventListener('storage', syncRole);
      window.removeEventListener('storage', syncTheme);
      window.removeEventListener('themeChanged', syncTheme);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [isDark]);

  return (
    <div className={`app-shell relative flex min-h-screen overflow-x-hidden transition-colors duration-300 ${isDark ? 'dark-theme' : ''}`}>
      {!isPublicPage && (
        <div className="print:hidden">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            userRole={userRole}
            isMobileOpen={isSidebarOpenOnMobile}
            onMobileClose={() => setIsSidebarOpenOnMobile(false)}
          />
        </div>
      )}
      <div className={`relative flex min-h-screen w-full min-w-0 flex-1 flex-col transition-all duration-300 print:block ${!isPublicPage ? (isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72') : ''}`}>
        {!isPublicPage && (
          <div className="print:hidden">
            <Header
              userRole={userRole}
              onToggleSidebar={() => setIsSidebarOpenOnMobile(!isSidebarOpenOnMobile)}
            />
          </div>
        )}
        <main className={`flex-1 overflow-x-hidden transition-colors duration-300 ${!isPublicPage ? (isDark ? 'bg-slate-950' : 'bg-slate-50') : ''} print:bg-white`}>
          <PageErrorBoundary>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/patients" element={<ProtectedRoute><PatientManagement /></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
              <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
              <Route path="/consultation" element={<ProtectedRoute><ConsultationV2 /></ProtectedRoute>} />
              <Route path="/consultation-legacy" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
              <Route path="/laboratory" element={<ProtectedRoute><Laboratory /></ProtectedRoute>} />
              <Route path="/staff" element={<ProtectedRoute><StaffManagement /></ProtectedRoute>} />
              <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/activities" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
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
<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
               <Route path="/404" element={<NotFoundLayout><NotFound /></NotFoundLayout>} />
              </Routes>
          </PageErrorBoundary>
        </main>
        {!isPublicPage && (
          <div className="print:hidden">
            <Footer />
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