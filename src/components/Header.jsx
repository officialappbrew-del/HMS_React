import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Bell, Search, UserCircle } from 'lucide-react';
import { getUserPreferences, setUserPreferences } from '../utils/cookies';

const Header = ({ userRole: propUserRole }) => {
  const { branding = { logo: '' }, subdomain = 'hospital' } = useSelector(state => state.tenant || {});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hospitalOpsMenuOpen, setHospitalOpsMenuOpen] = useState(false);
  const [workforceMenuOpen, setWorkforceMenuOpen] = useState(false);
  const [emergencyMenuOpen, setEmergencyMenuOpen] = useState(false);
  const [stockManagementMenuOpen, setStockManagementMenuOpen] = useState(false);
  const [analyticsMenuOpen, setAnalyticsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'admin');
  const [userPreferences, setUserPreferencesState] = useState({
    theme: 'light',
    language: 'en',
    sidebarCollapsed: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    const preferences = getUserPreferences();
    setUserPreferencesState(preferences);
  }, []);

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

  const activeRole = propUserRole || userRole;

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/patients', label: 'Patients' },
    { to: '/appointments', label: 'Appointments' },
  ];

  const hospitalOpsLinks = [
    { to: '/bed-allocation', label: 'Bed Allocation' },
    { to: '/admissions', label: 'Admissions' },
    { to: '/ward-rounds', label: 'Ward Rounds' },
    { to: '/vital-signs', label: 'Vital Signs' },
    { to: '/emr', label: 'EMR' },
    { to: '/orders', label: 'Order Entry' },
    { to: '/clinical-audit', label: 'Clinical Audit' },
  ];

  const workforceLinks = [
    { to: '/staff-directory', label: 'Staff Directory' },
    { to: '/duty-roster', label: 'Duty Roster' },
    { to: '/performance-management', label: 'Performance Management' },
  ];

  const emergencyTransportLinks = [
    { to: '/ambulance-tracking', label: 'Ambulance Tracking' },
    { to: '/emergency-response', label: 'Emergency Response' },
    { to: '/referral-transport', label: 'Referral Transport' },
  ];

  const stockManagementLinks = [
    { to: '/pharmacy-inventory', label: 'Pharmacy Inventory' },
    { to: '/medical-supplies', label: 'Medical Supplies' },
    { to: '/procurement', label: 'Procurement' },
  ];

  const analyticsLinks = [
    { to: '/financial-analytics', label: 'Financial Analytics' },
    { to: '/external-integrations', label: 'External Integrations' },
  ];

  const updatePreferences = (newPreferences) => {
    setUserPreferencesState(newPreferences);
    setUserPreferences(newPreferences);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate(localStorage.getItem('authToken') ? '/dashboard' : '/');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event('authChanged'));
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div onClick={handleLogoClick} className="flex min-w-0 cursor-pointer items-center gap-3">
            {branding.logo && (
              <img
                src={branding.logo}
                alt="Logo"
                className="h-10 w-10 rounded-xl bg-slate-100 object-contain p-1"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">SmartCare HMS</h1>
              <p className="hidden text-xs text-slate-500 sm:block">{subdomain || 'Hospital'} Operations</p>
            </div>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <Search className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">Search</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1.5 md:flex">
              <UserCircle className="h-5 w-5 text-slate-500" />
              <span className="text-sm font-medium capitalize text-slate-700">{activeRole}</span>
            </div>
            <button
              onClick={() => updatePreferences({ ...userPreferences, theme: userPreferences.theme === 'light' ? 'dark' : 'light' })}
              className="hidden rounded-full p-2 text-slate-500 hover:bg-slate-100 md:block"
              aria-label="Toggle theme"
            >
              {userPreferences.theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={handleLogout}
              className="hidden rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 md:block"
            >
              Logout
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="mt-3 hidden items-center gap-1 lg:flex">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}

          <div className="relative" onMouseEnter={() => setHospitalOpsMenuOpen(true)} onMouseLeave={() => setHospitalOpsMenuOpen(false)}>
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Hospital Ops
              <ChevronDown className="h-4 w-4" />
            </button>
            {hospitalOpsMenuOpen && (
              <div className="absolute left-0 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                {hospitalOpsLinks.map(link => (
                  <Link key={link.to} to={link.to} className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative" onMouseEnter={() => setWorkforceMenuOpen(true)} onMouseLeave={() => setWorkforceMenuOpen(false)}>
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Workforce
              <ChevronDown className="h-4 w-4" />
            </button>
            {workforceMenuOpen && (
              <div className="absolute left-0 mt-1 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                {workforceLinks.map(link => (
                  <Link key={link.to} to={link.to} className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative" onMouseEnter={() => setEmergencyMenuOpen(true)} onMouseLeave={() => setEmergencyMenuOpen(false)}>
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Emergency
              <ChevronDown className="h-4 w-4" />
            </button>
            {emergencyMenuOpen && (
              <div className="absolute left-0 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                {emergencyTransportLinks.map(link => (
                  <Link key={link.to} to={link.to} className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative" onMouseEnter={() => setStockManagementMenuOpen(true)} onMouseLeave={() => setStockManagementMenuOpen(false)}>
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Stock Mgmt
              <ChevronDown className="h-4 w-4" />
            </button>
            {stockManagementMenuOpen && (
              <div className="absolute left-0 mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                {stockManagementLinks.map(link => (
                  <Link key={link.to} to={link.to} className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative" onMouseEnter={() => setAnalyticsMenuOpen(true)} onMouseLeave={() => setAnalyticsMenuOpen(false)}>
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Analytics
              <ChevronDown className="h-4 w-4" />
            </button>
            {analyticsMenuOpen && (
              <div className="absolute left-0 mt-1 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                {analyticsLinks.map(link => (
                  <Link key={link.to} to={link.to} className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="mt-3 space-y-1 rounded-2xl border border-slate-200 bg-slate-50 p-2 lg:hidden">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-white" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-white"
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
