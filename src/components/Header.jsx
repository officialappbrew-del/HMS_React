import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Menu, X, ChevronDown, Bell, Search, UserCircle } from 'lucide-react';
import { getUserPreferences, setUserPreferences } from '../utils/cookies';

const Header = ({ userRole: propUserRole, onToggleSidebar }) => {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

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

  const searchableRoutes = useMemo(() => [
    { path: '/dashboard', label: 'Dashboard', aliases: ['home', 'overview'] },
    { path: '/patients', label: 'Patient Management', aliases: ['patients', 'patient records', 'registrations'] },
    { path: '/appointments', label: 'Appointments', aliases: ['schedule', 'booking', 'visits'] },
    { path: '/billing', label: 'Billing', aliases: ['payments', 'invoices', 'charges'] },
    { path: '/pharmacy', label: 'Pharmacy', aliases: ['medication', 'drugs', 'dispensary'] },
    { path: '/consultation', label: 'Consultation', aliases: ['doctor notes', 'visits', 'clinical'] },
    { path: '/laboratory', label: 'Laboratory', aliases: ['lab', 'tests', 'results'] },
    { path: '/staff', label: 'Staff Management', aliases: ['employees', 'staff directory', 'personnel'] },
    { path: '/inventory', label: 'Inventory', aliases: ['stock', 'supplies'] },
    { path: '/activities', label: 'Activity Log', aliases: ['audit trail', 'recent activity'] },
    { path: '/bed-allocation', label: 'Bed Allocation', aliases: ['beds', 'ward beds'] },
    { path: '/admissions', label: 'Admissions', aliases: ['admit', 'inpatients'] },
    { path: '/ward-rounds', label: 'Ward Rounds', aliases: ['rounds'] },
    { path: '/vital-signs', label: 'Vital Signs', aliases: ['vitals'] },
    { path: '/emr', label: 'EMR', aliases: ['electronic medical records'] },
    { path: '/orders', label: 'Order Entry', aliases: ['orders', 'prescriptions'] },
    { path: '/clinical-audit', label: 'Clinical Audit', aliases: ['quality audit'] },
    { path: '/staff-directory', label: 'Staff Directory', aliases: ['employees', 'workforce'] },
    { path: '/license-tracking', label: 'License Tracking', aliases: ['licenses'] },
    { path: '/duty-roster', label: 'Duty Roster', aliases: ['roster', 'schedule'] },
    { path: '/performance-management', label: 'Performance Management', aliases: ['performance'] },
    { path: '/payroll-management', label: 'Payroll Management', aliases: ['payroll'] },
    { path: '/equipment', label: 'Equipment Management', aliases: ['devices', 'medical equipment'] },
    { path: '/maintenance', label: 'Maintenance Management', aliases: ['repairs'] },
    { path: '/generators', label: 'Generator Management', aliases: ['power backup'] },
    { path: '/oxygen', label: 'Oxygen Management', aliases: ['oxygen supply'] },
    { path: '/ambulance-tracking', label: 'Ambulance Tracking', aliases: ['ambulance'] },
    { path: '/fleet-operations', label: 'Fleet Operations', aliases: ['vehicles'] },
    { path: '/emergency-response', label: 'Emergency Response', aliases: ['emergency'] },
    { path: '/referral-transport', label: 'Referral Transport', aliases: ['referrals'] },
    { path: '/pharmacy-inventory', label: 'Pharmacy Inventory', aliases: ['drug inventory'] },
    { path: '/medical-supplies', label: 'Medical Supplies', aliases: ['supplies'] },
    { path: '/central-store', label: 'Central Store', aliases: ['store'] },
    { path: '/procurement', label: 'Procurement', aliases: ['procurement'] },
    { path: '/financial-analytics', label: 'Financial Analytics', aliases: ['finance', 'revenue', 'analytics'] },
    { path: '/external-integrations', label: 'External Integrations', aliases: ['integrations'] },
    { path: '/credit-management', label: 'Credit Management', aliases: ['credit', 'debts'] },
    { path: '/ndpr-compliance', label: 'NDPR Compliance', aliases: ['compliance', 'privacy'] },
    { path: '/settings', label: 'Settings', aliases: ['preferences', 'configuration'] },
    { path: '/patient-portal', label: 'Patient Portal', aliases: ['portal'] },
    { path: '/mobile-money', label: 'Mobile Money Integration', aliases: ['mobile money'] },
  ], []);

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

  const filteredSearchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return searchableRoutes.filter((item) => {
      const searchText = `${item.label} ${item.path} ${item.aliases.join(' ')}`.toLowerCase();
      return searchText.includes(query);
    }).slice(0, 6);
  }, [searchQuery, searchableRoutes]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredSearchResults.length > 0) {
      navigate(filteredSearchResults[0].path);
      setSearchQuery('');
      setShowSearchResults(false);
    }
  };

  const handleSelectSearchResult = (path) => {
    navigate(path);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSearchQuery('');
    setShowSearchResults(false);
  }, [location.pathname]);

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

          <div ref={searchRef} className="hidden flex-1 justify-center px-2 md:flex">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-blue-500 focus-within:bg-white">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  placeholder="Search features, pages, or modules"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
              {showSearchResults && (
                <div className="absolute left-0 right-0 top-12 z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                  {filteredSearchResults.length > 0 ? (
                    filteredSearchResults.map((item) => (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => handleSelectSearchResult(item.path)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
                      >
                        <span className="text-sm font-medium text-slate-700">{item.label}</span>
                        <span className="text-xs text-slate-500">{item.path.replace('/', '')}</span>
                      </button>
                    ))
                  ) : (
                    searchQuery.trim() && (
                      <div className="px-4 py-3 text-sm text-slate-500">No matching features found</div>
                    )
                  )}
                </div>
              )}
            </form>
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
              onClick={() => onToggleSidebar?.()}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
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
