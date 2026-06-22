import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';
import LoadingSpinner from '../LoadingSpinner';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  Calendar,
  FileText,
  Pill,
  Bed,
  Heart,
  Stethoscope,
  Building2,
  Clipboard,
  Shield,
  Ambulance,
  Smartphone,
  Phone,
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Printer,
  Download,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  UserPlus,
  Bell,
  MessageSquare,
  LogOut,
  Menu,
  Home,
  Briefcase,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  HeartPulse,
  Brain,
  Bone,
  EyeOff,
  Star,
  Award,
  CheckCircle,
  CheckCircle2,
  Info,
  Plus,
  Clock,
  Zap,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  RefreshCw,
  AlertTriangle,
  Check,
  CreditCard,
  Hospital,
  Ambulance as AmbulanceIcon,
  Stethoscope as StethoscopeIcon
} from 'lucide-react';

// Tooltip Component
const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow(!show)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 ${positionClasses[position]} whitespace-nowrap`}>
          <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg">
            {text}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
              position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
              'left-[-4px] top-1/2 -translate-y-1/2'
            }`} />
          </div>
        </div>
      )}
    </div>
  );
};

// Icon Button with Tooltip
const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false }) => {
  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-600',
    primary: 'text-blue-600 hover:text-blue-700',
    success: 'text-green-600 hover:text-green-700',
    danger: 'text-red-600 hover:text-red-700',
    warning: 'text-yellow-600 hover:text-yellow-700',
    info: 'text-blue-600 hover:text-blue-700',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded-lg transition-all duration-200 ${variantClasses[variant]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:scale-95'
        }`}
      >
        <Icon className="w-4 h-4" />
      </button>
    </Tooltip>
  );
};

// Button with Tooltip
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '' }) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, subValue, icon: Icon, color, trend, trendValue, tooltip, onClick }) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500'
  };

  return (
    <Tooltip text={tooltip}>
      <div 
        onClick={onClick}
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase truncate">{title}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
            {subValue && (
              <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-1 text-xs ${trendColors[trend]}`}>
                {trend === 'up' && <ArrowUp className="w-3 h-3 mr-0.5" />}
                {trend === 'down' && <ArrowDown className="w-3 h-3 mr-0.5" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center flex-shrink-0 ml-3`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

const AdminDashboard = () => {
  const { user: authUser, tenant: authTenant } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { withLoading } = useLoading();
  const { subdomain, name: hospitalName } = useSelector(state => state.tenant || {});
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { drugs } = useSelector(state => state.pharmacy || { drugs: [] });
  const { staff } = useSelector(state => state.staff || { staff: [] });
  const { wards, stats: wardStats } = useSelector(state => state.ward || { wards: [], stats: {} });
  const { admissions } = useSelector(state => state.admission || { admissions: [] });

  const displayTenantName = authTenant?.name || hospitalName || subdomain || 'Hospital';
  const displayUserName = [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.username || authUser?.email || 'User';
  const displayRole = authUser?.role || 'admin';

  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const itemsPerPage = 10;

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    criticalAlerts: 0,
    staffCount: 0,
    lowStockItems: 0,
    totalBeds: 120,
    occupiedBeds: 0,
    todayAppointments: 0,
    pendingBills: 0
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', message: 'Oxygen concentrator #3 needs maintenance', time: '2 min ago', read: false },
    { id: 2, type: 'warning', message: 'Low stock: Paracetamol (50 tablets remaining)', time: '15 min ago', read: false },
    { id: 3, type: 'info', message: 'Monthly revenue target achieved', time: '1 hour ago', read: false }
  ]);

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'patient', message: 'New patient registered', details: 'John Doe - 2 minutes ago', icon: Users, color: 'blue' },
    { id: 2, type: 'billing', message: 'Bill generated', details: '₦45,000 - 15 minutes ago', icon: FileText, color: 'green' },
    { id: 3, type: 'bed', message: 'Bed allocated', details: 'Ward A, Room 203 - 1 hour ago', icon: Bed, color: 'purple' },
    { id: 4, type: 'pharmacy', message: 'Stock alert', details: 'Paracetamol running low - 2 hours ago', icon: Pill, color: 'orange' }
  ]);

  const [departments] = useState([
    { id: 1, name: 'Emergency', patients: 12, doctors: 4, occupancy: 85 },
    { id: 2, name: 'Cardiology', patients: 8, doctors: 3, occupancy: 70 },
    { id: 3, name: 'Pediatrics', patients: 15, doctors: 5, occupancy: 90 },
    { id: 4, name: 'Orthopedics', patients: 6, doctors: 2, occupancy: 55 },
    { id: 5, name: 'Neurology', patients: 4, doctors: 2, occupancy: 40 },
    { id: 6, name: 'Maternity', patients: 10, doctors: 4, occupancy: 80 }
  ]);

  const [recentPatients] = useState([
    { id: 1, name: 'John Doe', age: 45, gender: 'Male', admissionDate: '2024-01-15', status: 'admitted', department: 'Emergency' },
    { id: 2, name: 'Jane Smith', age: 32, gender: 'Female', admissionDate: '2024-01-14', status: 'discharged', department: 'Maternity' },
    { id: 3, name: 'Bob Johnson', age: 67, gender: 'Male', admissionDate: '2024-01-13', status: 'admitted', department: 'Cardiology' }
  ]);

  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const lowStockItems = drugs.filter(drug => drug.quantityInStock <= drug.reorderLevel).length;
    const totalRevenue = patients.length * 500000;
    const occupancyRate = wardStats.occupiedBeds ? Math.round((wardStats.occupiedBeds / wardStats.totalBeds) * 100) : 0;

    setStats({
      totalPatients: patients.length || 156,
      totalRevenue: totalRevenue || 7800000,
      occupancyRate: occupancyRate || 75,
      criticalAlerts: alerts.filter(a => a.type === 'critical' && !a.read).length,
      staffCount: staff.length || 48,
      lowStockItems: lowStockItems || 5,
      totalBeds: wardStats.totalBeds || 120,
      occupiedBeds: wardStats.occupiedBeds || 90,
      todayAppointments: 24,
      pendingBills: 18
    });
  }, [patients, drugs, staff, wardStats, alerts]);

  // Tab data
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  // Quick Actions
  const quickActions = [
    { icon: Users, label: 'Register Patient', action: '/patients', color: 'bg-blue-500' },
    { icon: Calendar, label: 'Schedule Appointment', action: '/appointments', color: 'bg-green-500' },
    { icon: FileText, label: 'Create Bill', action: '/billing', color: 'bg-purple-500' },
    { icon: Pill, label: 'Check Inventory', action: '/inventory', color: 'bg-orange-500' },
    { icon: Bed, label: 'Bed Status', action: '/bed-allocation', color: 'bg-red-500' },
    { icon: Heart, label: 'Admissions', action: '/admissions', color: 'bg-pink-500' },
    { icon: Building2, label: 'Staff Directory', action: '/staff', color: 'bg-indigo-500' },
    { icon: Settings, label: 'System Settings', action: '/settings', color: 'bg-gray-500' },
  ];

  // Handlers
  const handleRefresh = () => {
    // Dispatch refresh action
    alert('Dashboard refreshed!');
  };

  const handleExportReport = () => {
    alert('Report exported successfully!');
  };

  const handleMarkAlertRead = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'admitted': { label: 'Admitted', color: 'bg-blue-100 text-blue-800' },
      'discharged': { label: 'Discharged', color: 'bg-green-100 text-green-800' },
      'critical': { label: 'Critical', color: 'bg-red-100 text-red-800' },
      'stable': { label: 'Stable', color: 'bg-green-100 text-green-800' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  // Render tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'patients':
        return renderPatientsContent();
      case 'billing':
        return renderBillingContent();
      case 'departments':
        return renderDepartmentsContent();
      case 'alerts':
        return renderAlertsContent();
      default:
        return renderOverviewContent();
    }
  };

  const renderOverviewContent = () => {
    return (
      <>
        {/* Critical Alerts Banner */}
        {alerts.filter(a => a.type === 'critical' && !a.read).length > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center flex-1 min-w-0">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-red-800">Critical Alerts</h3>
                  <p className="text-sm text-red-700 truncate">
                    {alerts.filter(a => a.type === 'critical' && !a.read)[0]?.message || 'No critical alerts'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-medium text-red-700">
                  {alerts.filter(a => a.type === 'critical' && !a.read).length} alert(s)
                </span>
                <ButtonWithTooltip
                  onClick={() => navigate('/alerts')}
                  tooltip="View all alerts"
                  variant="secondary"
                  className="text-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View All
                </ButtonWithTooltip>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Patients"
            value={stats.totalPatients}
            subValue={`${stats.todayAppointments} today`}
            icon={Users}
            color="bg-blue-500"
            trend="up"
            trendValue="12% from last month"
            tooltip="Total registered patients in the system"
            onClick={() => navigate('/patients')}
          />
          <StatsCard
            title="Revenue"
            value={`₦${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            subValue={`₦${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-green-500"
            trend="up"
            trendValue="8% from last month"
            tooltip="Total revenue generated"
            onClick={() => navigate('/billing')}
          />
          <StatsCard
            title="Bed Occupancy"
            value={`${stats.occupancyRate}%`}
            subValue={`${stats.occupiedBeds}/${stats.totalBeds} beds`}
            icon={Bed}
            color="bg-purple-500"
            trend={stats.occupancyRate > 80 ? 'up' : 'neutral'}
            trendValue={stats.occupancyRate > 80 ? 'High occupancy' : 'Normal'}
            tooltip="Current bed occupancy rate"
            onClick={() => navigate('/bed-allocation')}
          />
          <StatsCard
            title="Critical Alerts"
            value={stats.criticalAlerts}
            subValue={`${stats.lowStockItems} low stock items`}
            icon={AlertCircle}
            color="bg-red-500"
            trend={stats.criticalAlerts > 0 ? 'up' : 'neutral'}
            trendValue={stats.criticalAlerts > 0 ? 'Requires attention' : 'All clear'}
            tooltip="Alerts requiring immediate attention"
            onClick={() => setActiveTab('alerts')}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-8 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Tooltip key={index} text={`Go to ${action.label}`}>
                  <button
                    onClick={() => navigate(action.action)}
                    className={`${action.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center justify-center h-16 sm:h-20`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                    <span className="text-[10px] sm:text-xs font-medium text-center">{action.label}</span>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Revenue Trend</h3>
              <div className="flex items-center gap-2">
                <ButtonWithTooltip
                  onClick={() => setShowDateRangePicker(!showDateRangePicker)}
                  tooltip="Change date range"
                  variant="secondary"
                  className="text-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {dateRange.start} - {dateRange.end}
                </ButtonWithTooltip>
                <IconButton
                  icon={RefreshCw}
                  onClick={handleRefresh}
                  tooltip="Refresh data"
                  variant="default"
                />
              </div>
            </div>
            <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm">Revenue chart placeholder</p>
                <p className="text-xs text-gray-400">Daily revenue data visualization</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Key Performance Indicators</h3>
              <ButtonWithTooltip
                onClick={handleExportReport}
                tooltip="Export KPI report"
                variant="secondary"
                className="text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </ButtonWithTooltip>
            </div>
            <div className="h-48 sm:h-64 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm">KPI chart placeholder</p>
                <p className="text-xs text-gray-400">Department performance metrics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
            <ButtonWithTooltip
              onClick={() => navigate('/activity')}
              tooltip="View all activity"
              variant="secondary"
              className="text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              View All
            </ButtonWithTooltip>
          </div>
          <div className="space-y-2">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              const colorMap = {
                blue: 'text-blue-500 bg-blue-50',
                green: 'text-green-500 bg-green-50',
                purple: 'text-purple-500 bg-purple-50',
                orange: 'text-orange-500 bg-orange-50'
              };
              return (
                <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-8 h-8 ${colorMap[activity.color]} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const renderPatientsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Patient Management</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              onClick={() => navigate('/patients/add')}
              tooltip="Register new patient"
              variant="primary"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register Patient
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Age/Gender</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Department</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Admission Date</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentPatients.map((patient) => {
                const status = getStatusBadge(patient.status);
                return (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                    </td>
                    <td className="py-3 text-sm text-gray-600 hidden sm:table-cell">{patient.age} yrs • {patient.gender}</td>
                    <td className="py-3 text-sm text-gray-600 hidden md:table-cell">{patient.department}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600 hidden lg:table-cell">{patient.admissionDate}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <IconButton
                          icon={Eye}
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          tooltip="View patient"
                          variant="primary"
                        />
                        <IconButton
                          icon={Edit}
                          onClick={() => navigate(`/patients/${patient.id}/edit`)}
                          tooltip="Edit patient"
                          variant="primary"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBillingContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Billing Overview</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              onClick={() => navigate('/billing/create')}
              tooltip="Create new bill"
              variant="primary"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Bill
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleExportReport}
              tooltip="Export billing report"
              variant="secondary"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-xl font-bold text-gray-900">₦{stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Pending Bills</p>
            <p className="text-xl font-bold text-orange-600">{stats.pendingBills}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Today's Transactions</p>
            <p className="text-xl font-bold text-green-600">₦245,000</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Amount</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-3 text-sm font-medium text-gray-900">John Doe</td>
                <td className="py-3 text-sm text-gray-600 hidden sm:table-cell">₦45,000</td>
                <td className="py-3 text-sm text-gray-600 hidden md:table-cell">2024-01-15</td>
                <td className="py-3">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Paid</span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <IconButton icon={Eye} tooltip="View bill" variant="primary" />
                    <IconButton icon={Printer} tooltip="Print bill" variant="default" />
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="py-3 text-sm font-medium text-gray-900">Jane Smith</td>
                <td className="py-3 text-sm text-gray-600 hidden sm:table-cell">₦78,500</td>
                <td className="py-3 text-sm text-gray-600 hidden md:table-cell">2024-01-14</td>
                <td className="py-3">
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1">
                    <IconButton icon={Eye} tooltip="View bill" variant="primary" />
                    <IconButton icon={Edit} tooltip="Edit bill" variant="primary" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDepartmentsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Department Overview</h2>
          <ButtonWithTooltip
            onClick={() => navigate('/departments/add')}
            tooltip="Add new department"
            variant="primary"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Department
          </ButtonWithTooltip>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{dept.name}</h4>
                <span className="text-xs text-gray-500">{dept.patients} patients</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Doctors</span>
                  <span className="font-medium">{dept.doctors}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Occupancy</span>
                  <span className="font-medium">{dept.occupancy}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${dept.occupancy > 80 ? 'bg-red-500' : dept.occupancy > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${dept.occupancy}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <IconButton
                  icon={Eye}
                  onClick={() => navigate(`/departments/${dept.id}`)}
                  tooltip="View department"
                  variant="primary"
                />
                <IconButton
                  icon={Edit}
                  onClick={() => navigate(`/departments/${dept.id}/edit`)}
                  tooltip="Edit department"
                  variant="primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAlertsContent = () => {
    const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.read);
    const otherAlerts = alerts.filter(a => a.type !== 'critical' || a.read);

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Alert Management</h2>
          <div className="flex items-center gap-2">
            {alerts.filter(a => !a.read).length > 0 && (
              <ButtonWithTooltip
                onClick={handleMarkAllAlertsRead}
                tooltip="Mark all as read"
                variant="secondary"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Mark All Read
              </ButtonWithTooltip>
            )}
            <ButtonWithTooltip
              onClick={() => navigate('/settings/alerts')}
              tooltip="Configure alerts"
              variant="secondary"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xs font-medium text-red-600 uppercase tracking-wider mb-2">Critical Alerts</h3>
            <div className="space-y-2">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center flex-1 min-w-0">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-red-800">{alert.message}</p>
                      <p className="text-xs text-red-600">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <IconButton
                      icon={CheckCircle}
                      onClick={() => handleMarkAlertRead(alert.id)}
                      tooltip="Mark as read"
                      variant="success"
                    />
                    <IconButton
                      icon={X}
                      onClick={() => handleDismissAlert(alert.id)}
                      tooltip="Dismiss alert"
                      variant="danger"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Alerts */}
        {otherAlerts.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Other Alerts</h3>
            <div className="space-y-2">
              {otherAlerts.map((alert) => (
                <div key={alert.id} className={`flex items-center justify-between border rounded-lg p-3 ${
                  alert.read ? 'bg-gray-50 border-gray-200 opacity-60' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center flex-1 min-w-0">
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    {!alert.read && (
                      <IconButton
                        icon={CheckCircle}
                        onClick={() => handleMarkAlertRead(alert.id)}
                        tooltip="Mark as read"
                        variant="success"
                      />
                    )}
                    <IconButton
                      icon={X}
                      onClick={() => handleDismissAlert(alert.id)}
                      tooltip="Dismiss alert"
                      variant="default"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No alerts</p>
            <p className="text-sm text-gray-400">All clear!</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Welcome back, {displayUserName}
            </h1>
            <p className="text-sm text-gray-500">
              {displayTenantName} · {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} Dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              onClick={handleRefresh}
              tooltip="Refresh dashboard"
              variant="secondary"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowSettingsModal(true)}
              tooltip="Dashboard settings"
              variant="secondary"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <nav className="flex gap-4 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tooltip key={tab.id} text={`View ${tab.label}`}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-1 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'alerts' && alerts.filter(a => !a.read).length > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {alerts.filter(a => !a.read).length}
                    </span>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        {renderTabContent()}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowSettingsModal(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Dashboard Settings</h3>
                <IconButton
                  icon={X}
                  onClick={() => setShowSettingsModal(false)}
                  tooltip="Close settings"
                  variant="default"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default View</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>Overview</option>
                    <option>Patients</option>
                    <option>Billing</option>
                    <option>Departments</option>
                    <option>Alerts</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <ButtonWithTooltip
                    onClick={() => setShowSettingsModal(false)}
                    tooltip="Cancel changes"
                    variant="secondary"
                  >
                    Cancel
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    onClick={() => {
                      setShowSettingsModal(false);
                      alert('Settings saved!');
                    }}
                    tooltip="Save settings"
                    variant="primary"
                  >
                    Save Settings
                  </ButtonWithTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;