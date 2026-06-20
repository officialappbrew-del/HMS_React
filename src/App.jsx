import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { useState, useEffect } from 'react';
import store from './store';
import ErrorBoundary from './components/ErrorBoundary';
import PageErrorBoundary from './components/PageErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PatientManagement from './pages/PatientManagement';
import Billing from './pages/Billing';
import Pharmacy from './pages/Pharmacy';
import Consultation from './pages/Consultation';
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
// import ClinicalDecisionSupport from './pages/ClinicalDecisionSupport';

const getStoredRole = () => {
  if (typeof window === 'undefined') return 'admin';
  return localStorage.getItem('userRole') || 'admin';
};

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(getStoredRole);

  useEffect(() => {
    const syncRole = () => {
      setUserRole(getStoredRole());
    };

    syncRole();
    window.addEventListener('authChanged', syncRole);
    window.addEventListener('storage', syncRole);

    return () => {
      window.removeEventListener('authChanged', syncRole);
      window.removeEventListener('storage', syncRole);
    };
  }, []);

  return (
    <div className="app-shell flex">
      {!isLoginPage && (
        <div className="print:hidden">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            userRole={userRole}
          />
        </div>
      )}
      <div className={`flex min-h-screen flex-1 flex-col transition-all duration-300 print:block ${isLoginPage ? '' : (isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72')}`}>
        {!isLoginPage && (
          <div className="print:hidden">
            <Header userRole={userRole} />
          </div>
        )}
        <main className={`flex-1 ${isLoginPage ? '' : 'bg-slate-50'} print:bg-white`}>
          <PageErrorBoundary>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientManagement />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/laboratory" element={<Laboratory />} />
              <Route path="/staff" element={<StaffManagement />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/activities" element={<ActivityLog />} />
              <Route path="/bed-allocation" element={<BedAllocation />} />
              <Route path="/admissions" element={<AdmissionManagement />} />
              <Route path="/ward-rounds" element={<WardRoundManagement />} />
              <Route path="/staff-directory" element={<StaffDirectory />} />
              <Route path="/license-tracking" element={<LicenseTracking />} />
              <Route path="/duty-roster" element={<DutyRoster />} />
              <Route path="/performance-management" element={<PerformanceManagement />} />
              <Route path="/payroll-management" element={<PayrollManagement />} />
              <Route path="/equipment" element={<EquipmentManagement />} />
              <Route path="/maintenance" element={<MaintenanceManagement />} />
              <Route path="/generators" element={<GeneratorManagement />} />
              <Route path="/oxygen" element={<OxygenManagement />} />
              <Route path="/ambulance-tracking" element={<AmbulanceTracking />} />
              <Route path="/fleet-operations" element={<FleetOperations />} />
              <Route path="/emergency-response" element={<EmergencyResponse />} />
              <Route path="/referral-transport" element={<ReferralTransport />} />
              <Route path="/pharmacy-inventory" element={<PharmacyInventory />} />
              <Route path="/medical-supplies" element={<MedicalSupplies />} />
              <Route path="/central-store" element={<CentralStore />} />
              <Route path="/procurement" element={<Procurement />} />
              <Route path="/vital-signs" element={<VitalSignsMonitoring />} />
              <Route path="/emr" element={<ElectronicMedicalRecords />} />
              <Route path="/ussd" element={<USSDSystem />} />
              <Route path="/cds" element={<ClinicalDecisionSupport />} />
              <Route path="/orders" element={<OrderEntrySystem />} />
              <Route path="/emergency-dept" element={<EmergencyDepartmentManagement />} />
              <Route path="/nhis" element={<NHISManagement />} />
              <Route path="/patient-portal" element={<PatientPortal />} />
              <Route path="/mobile-money" element={<MobileMoneyIntegration />} />
              <Route path="/theater-scheduling" element={<TheaterScheduling />} />
              <Route path="/pre-operative" element={<PreOperativeAssessment />} />
              <Route path="/intra-operative" element={<IntraOperativeDocumentation />} />
              <Route path="/post-operative" element={<PostOperativeCare />} />
              <Route path="/theater-analytics" element={<TheaterAnalytics />} />
              <Route path="/ambulance-tracking" element={<AmbulanceTracking />} />
              <Route path="/appointment-reminders" element={<AppointmentReminders />} />
              <Route path="/ncdc-surveillance" element={<NCDCDiseaseSurveillance />} />
              <Route path="/external-integrations" element={<ExternalIntegrations />} />
              <Route path="/financial-analytics" element={<FinancialAnalytics />} />
              <Route path="/clinical-audit" element={<ClinicalAudit />} />
              <Route path="/patient-feedback" element={<PatientFeedback />} />
              <Route path="/credit-management" element={<CreditManagement />} />
              <Route path="/ndpr-compliance" element={<NDPRCompliance />} />
              <Route path="/budgeting-forecasting" element={<BudgetingForecasting />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageErrorBoundary>
        </main>
        {!isLoginPage && (
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
          <AppLayout />
        </Router>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;