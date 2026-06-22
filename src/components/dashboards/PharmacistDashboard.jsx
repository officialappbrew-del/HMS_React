import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Pill,
  FileText,
  Users,
  AlertCircle,
  Clipboard,
  Building2,
  TrendingUp,
  Eye,
  Clock,
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
  Plus,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Home,
  Briefcase,
  Activity,
  Heart,
  Stethoscope,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  HeartPulse,
  Brain,
  Bone,
  EyeOff,
  Shield,
  Star,
  Award,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Package,
  Truck,
  Calendar,
  DollarSign,
  ShoppingCart,
  BarChart3,
  RefreshCw
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

const PharmacistDashboard = () => {
  const { user: authUser, tenant: authTenant } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { drugs } = useSelector(state => state.pharmacy || { drugs: [] });

  const displayTenantName = authTenant?.name || 'Hospital';
  const displayUserName = [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.username || authUser?.email || 'User';
  const displayRole = authUser?.role || 'pharmacist';

  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const itemsPerPage = 10;

  const [stats, setStats] = useState({
    prescriptionsPending: 0,
    lowStockItems: 0,
    expiringSoon: 0,
    dispensedToday: 0,
    totalInventory: 0,
    inventoryValue: 0,
    totalSuppliers: 0,
  });

  const [lowStockAlerts, setLowStockAlerts] = useState([
    { id: 1, drug: 'Paracetamol', current: 45, reorder: 50, supplier: 'MediCorp', status: 'critical' },
    { id: 2, drug: 'Amoxicillin', current: 12, reorder: 20, supplier: 'PharmaPlus', status: 'warning' },
    { id: 3, drug: 'Insulin', current: 8, reorder: 15, supplier: 'MediCorp', status: 'critical' },
    { id: 4, drug: 'Metformin', current: 18, reorder: 25, supplier: 'HealthCare Ltd', status: 'warning' }
  ]);

  const [pendingPrescriptions, setPendingPrescriptions] = useState([
    { id: 1, patient: 'John Doe', medication: 'Amoxicillin 500mg', priority: 'High', time: '2 hours ago', status: 'pending' },
    { id: 2, patient: 'Jane Smith', medication: 'Paracetamol', priority: 'Normal', time: '4 hours ago', status: 'pending' },
    { id: 3, patient: 'Bob Johnson', medication: 'Insulin', priority: 'High', time: '1 hour ago', status: 'pending' },
    { id: 4, patient: 'Alice Brown', medication: 'Metformin', priority: 'Normal', time: '3 hours ago', status: 'pending' }
  ]);

  const [prescriptionHistory] = useState([
    { id: 1, patient: 'Mary Williams', medication: 'Amoxicillin', date: '2024-01-15', status: 'dispensed' },
    { id: 2, patient: 'Peter Obi', medication: 'Paracetamol', date: '2024-01-14', status: 'dispensed' },
    { id: 3, patient: 'Grace Adeyemi', medication: 'Insulin', date: '2024-01-13', status: 'dispensed' }
  ]);

  const [inventoryItems] = useState([
    { id: 1, name: 'Paracetamol', stock: 45, price: 50, category: 'Analgesic', status: 'low' },
    { id: 2, name: 'Amoxicillin', stock: 12, price: 80, category: 'Antibiotic', status: 'critical' },
    { id: 3, name: 'Insulin', stock: 8, price: 1200, category: 'Hormone', status: 'critical' },
    { id: 4, name: 'Metformin', stock: 18, price: 150, category: 'Antidiabetic', status: 'low' }
  ]);

  const [suppliers] = useState([
    { id: 1, name: 'MediCorp', contact: '080-1234-5678', products: 45, status: 'active' },
    { id: 2, name: 'PharmaPlus', contact: '080-2345-6789', products: 38, status: 'active' },
    { id: 3, name: 'HealthCare Ltd', contact: '080-3456-7890', products: 52, status: 'active' }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', message: 'Amoxicillin stock critically low - 12 units remaining', time: '30 min ago', read: false },
    { id: 2, type: 'warning', message: '5 drugs expiring in 30 days', time: '1 hour ago', read: false },
    { id: 3, type: 'info', message: 'New prescription for John Doe ready for dispensing', time: '2 hours ago', read: false }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Inventory updated successfully', time: '1 hour ago', read: false },
    { id: 2, type: 'info', message: 'Supplier order #1234 delivered', time: '2 hours ago', read: false },
    { id: 3, type: 'warning', message: 'Scheduled maintenance tonight at 2 AM', time: '4 hours ago', read: false }
  ]);

  useEffect(() => {
    const lowStockItems = drugs.filter(drug => drug.quantityInStock <= drug.reorderLevel).length;
    const totalValue = drugs.reduce((sum, drug) => sum + (drug.quantityInStock * drug.unitPrice), 0);
    
    setStats({
      prescriptionsPending: pendingPrescriptions.length,
      lowStockItems: lowStockItems || 4,
      expiringSoon: 5,
      dispensedToday: 23,
      totalInventory: drugs.length || 45,
      inventoryValue: totalValue || 125000,
      totalSuppliers: suppliers.length,
    });
  }, [drugs, pendingPrescriptions, suppliers]);

  const handleDispensePrescription = (id) => {
    setPendingPrescriptions(prev => prev.filter(p => p.id !== id));
    setStats(prev => ({
      ...prev,
      prescriptionsPending: prev.prescriptionsPending - 1,
      dispensedToday: prev.dispensedToday + 1
    }));
    // Add to dispensed history
    const prescription = pendingPrescriptions.find(p => p.id === id);
    if (prescription) {
      // Would dispatch action to add to history
    }
  };

  const handleReorderDrug = (id) => {
    setLowStockAlerts(prev => prev.filter(item => item.id !== id));
    setStats(prev => ({
      ...prev,
      lowStockItems: prev.lowStockItems - 1
    }));
    // Would dispatch action to create purchase order
  };

  const handleMarkAlertRead = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleMarkNotificationRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const quickActions = [
    { icon: Pill, label: 'Inventory', action: '/inventory', color: 'bg-blue-500' },
    { icon: FileText, label: 'Prescriptions', action: '/prescriptions', color: 'bg-green-500' },
    { icon: Users, label: 'Patient Profiles', action: '/patients', color: 'bg-purple-500' },
    { icon: AlertCircle, label: 'Drug Interactions', action: '/drug-interactions', color: 'bg-orange-500' },
    { icon: Clipboard, label: 'Reports', action: '/reports', color: 'bg-red-500' },
    { icon: Building2, label: 'Suppliers', action: '/suppliers', color: 'bg-pink-500' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'suppliers', label: 'Suppliers', icon: Building2 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      'dispensed': { label: 'Dispensed', color: 'bg-green-100 text-green-800' },
      'critical': { label: 'Critical', color: 'bg-red-100 text-red-800' },
      'warning': { label: 'Warning', color: 'bg-orange-100 text-orange-800' },
      'low': { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' },
      'active': { label: 'Active', color: 'bg-green-100 text-green-800' },
      'High': { label: 'High', color: 'bg-red-100 text-red-800' },
      'Normal': { label: 'Normal', color: 'bg-blue-100 text-blue-800' },
      'info': { label: 'Info', color: 'bg-blue-100 text-blue-800' },
      'success': { label: 'Success', color: 'bg-green-100 text-green-800' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  // Render tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'prescriptions':
        return renderPrescriptionsContent();
      case 'inventory':
        return renderInventoryContent();
      case 'suppliers':
        return renderSuppliersContent();
      case 'alerts':
        return renderAlertsContent();
      default:
        return renderOverviewContent();
    }
  };

  const renderOverviewContent = () => {
    return (
      <>
        {/* Critical Alerts */}
        {alerts.filter(a => a.type === 'critical' && !a.read).length > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Critical Stock Alerts</h3>
                  <p className="text-sm text-red-700">
                    {alerts.filter(a => a.type === 'critical' && !a.read).length} item(s) critically low on stock
                  </p>
                </div>
              </div>
              <ButtonWithTooltip
                onClick={() => alerts.filter(a => a.type === 'critical').forEach(a => handleMarkAlertRead(a.id))}
                tooltip="Mark all alerts as read"
                variant="secondary"
              >
                Mark All Read
              </ButtonWithTooltip>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Tooltip text="Prescriptions awaiting dispensing">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Pending Prescriptions</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.prescriptionsPending}</p>
                  <div className="mt-1 flex items-center text-xs text-yellow-600">
                    <FileText className="mr-1 h-3 w-3" />
                    <span>Awaiting dispensing</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Items below reorder level">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Low Stock Items</p>
                  <p className="mt-1 text-2xl font-bold text-red-600">{stats.lowStockItems}</p>
                  <div className="mt-1 flex items-center text-xs text-red-600">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    <span>Need restocking</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Drugs expiring within 30 days">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Expiring Soon</p>
                  <p className="mt-1 text-2xl font-bold text-orange-600">{stats.expiringSoon}</p>
                  <div className="mt-1 flex items-center text-xs text-orange-600">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>Within 30 days</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Prescriptions dispensed today">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Dispensed Today</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">{stats.dispensedToday}</p>
                  <div className="mt-1 flex items-center text-xs text-green-600">
                    <Pill className="mr-1 h-3 w-3" />
                    <span>Completed</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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

        {/* Prescriptions & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Pending Prescriptions</h3>
              <ButtonWithTooltip
                onClick={() => navigate('/prescriptions')}
                tooltip="View all prescriptions"
                variant="secondary"
                className="text-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                View All
              </ButtonWithTooltip>
            </div>
            <div className="space-y-3">
              {pendingPrescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No pending prescriptions</p>
                </div>
              ) : (
                pendingPrescriptions.map((prescription) => {
                  const status = getStatusBadge(prescription.priority);
                  return (
                    <div key={prescription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{prescription.patient}</p>
                        <p className="text-xs text-gray-500">{prescription.medication} • {prescription.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                        <ButtonWithTooltip
                          onClick={() => handleDispensePrescription(prescription.id)}
                          tooltip="Dispense prescription"
                          variant="success"
                          className="text-xs px-2 py-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Dispense
                        </ButtonWithTooltip>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Low Stock Alerts</h3>
              <ButtonWithTooltip
                onClick={() => navigate('/inventory')}
                tooltip="View inventory"
                variant="secondary"
                className="text-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                View All
              </ButtonWithTooltip>
            </div>
            <div className="space-y-3">
              {lowStockAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">All items well stocked</p>
                </div>
              ) : (
                lowStockAlerts.map((item) => {
                  const status = getStatusBadge(item.status);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.drug}</p>
                        <p className="text-xs text-gray-500">
                          Current: {item.current} • Reorder: {item.reorder} • {item.supplier}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                        <ButtonWithTooltip
                          onClick={() => handleReorderDrug(item.id)}
                          tooltip="Reorder now"
                          variant="primary"
                          className="text-xs px-2 py-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Reorder
                        </ButtonWithTooltip>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderPrescriptionsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Prescriptions</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Filter prescriptions"
              variant="secondary"
            >
              <Filter className="w-3.5 h-3.5" />
              Filter
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="Export prescriptions"
              variant="secondary"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prescriptionHistory.map((prescription) => {
                const status = getStatusBadge(prescription.status);
                return (
                  <tr key={prescription.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <span className="text-sm font-medium text-gray-900">{prescription.patient}</span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{prescription.medication}</td>
                    <td className="py-3 text-sm text-gray-600">{prescription.date}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <IconButton
                          icon={Eye}
                          tooltip="View prescription"
                          variant="primary"
                        />
                        <IconButton
                          icon={Printer}
                          tooltip="Print prescription"
                          variant="default"
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

  const renderInventoryContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Inventory</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Add new item"
              variant="primary"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₦)</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventoryItems.map((item) => {
                const status = getStatusBadge(item.status);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{item.category}</td>
                    <td className="py-3 text-sm text-gray-600">{item.stock}</td>
                    <td className="py-3 text-sm text-gray-600">₦{item.price}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <IconButton
                          icon={Edit}
                          tooltip="Edit item"
                          variant="primary"
                        />
                        <IconButton
                          icon={Eye}
                          tooltip="View details"
                          variant="default"
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

  const renderSuppliersContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Suppliers</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Add new supplier"
              variant="primary"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Supplier
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.map((supplier) => {
                const status = getStatusBadge(supplier.status);
                return (
                  <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{supplier.contact}</td>
                    <td className="py-3 text-sm text-gray-600">{supplier.products}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <IconButton
                          icon={Edit}
                          tooltip="Edit supplier"
                          variant="primary"
                        />
                        <IconButton
                          icon={Eye}
                          tooltip="View details"
                          variant="default"
                        />
                        <IconButton
                          icon={Truck}
                          tooltip="View orders"
                          variant="info"
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

  const renderAlertsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Alerts & Notifications</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              onClick={() => setAlerts(prev => prev.map(a => ({ ...a, read: true })))}
              tooltip="Mark all as read"
              variant="secondary"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Mark All Read
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Critical Alerts</h4>
            {alerts.filter(a => a.type === 'critical').length === 0 ? (
              <p className="text-sm text-gray-500">No critical alerts</p>
            ) : (
              alerts.filter(a => a.type === 'critical').map((alert) => (
                <div key={alert.id} className={`flex items-center justify-between p-3 bg-red-50 rounded-lg mb-2 ${alert.read ? 'opacity-60' : ''}`}>
                  <div className="flex items-center flex-1">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{alert.message}</p>
                      <p className="text-xs text-red-600">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
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
                      tooltip="Dismiss"
                      variant="default"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">All Alerts</h4>
            {alerts.filter(a => a.type !== 'critical').length === 0 ? (
              <p className="text-sm text-gray-500">No alerts</p>
            ) : (
              alerts.filter(a => a.type !== 'critical').map((alert) => {
                const status = getStatusBadge(alert.type);
                return (
                  <div key={alert.id} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2 ${alert.read ? 'opacity-60' : ''}`}>
                    <div className="flex items-center flex-1">
                      <AlertCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
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
                        tooltip="Dismiss"
                        variant="default"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Notifications</h4>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No notifications</p>
            ) : (
              notifications.map((notif) => {
                const status = getStatusBadge(notif.type);
                return (
                  <div key={notif.id} className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-2 ${notif.read ? 'opacity-60' : ''}`}>
                    <div className="flex items-center flex-1">
                      <Info className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">{notif.message}</p>
                        <p className="text-xs text-blue-600">{notif.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notif.read && (
                        <IconButton
                          icon={CheckCircle}
                          onClick={() => handleMarkNotificationRead(notif.id)}
                          tooltip="Mark as read"
                          variant="success"
                        />
                      )}
                      <IconButton
                        icon={X}
                        onClick={() => handleDismissNotification(notif.id)}
                        tooltip="Dismiss"
                        variant="default"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {displayUserName}
            </h1>
            <p className="text-sm text-gray-500">
              {displayTenantName} · {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} Dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="View notifications"
              variant="secondary"
              className="relative"
            >
              <Bell className="w-4 h-4" />
              {alerts.filter(a => !a.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {alerts.filter(a => !a.read).length}
                </span>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="Settings"
              variant="secondary"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4" />
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Additional Stats - Extended metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Tooltip text="Total inventory items">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <p className="text-xs text-gray-500">Total Inventory</p>
            <p className="text-lg font-bold text-gray-900">{stats.totalInventory}</p>
          </div>
        </Tooltip>
        <Tooltip text="Total inventory value">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <p className="text-xs text-gray-500">Inventory Value</p>
            <p className="text-lg font-bold text-green-600">₦{stats.inventoryValue.toLocaleString()}</p>
          </div>
        </Tooltip>
        <Tooltip text="Total suppliers">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <p className="text-xs text-gray-500">Suppliers</p>
            <p className="text-lg font-bold text-gray-900">{stats.totalSuppliers}</p>
          </div>
        </Tooltip>
        <Tooltip text="Active prescriptions">
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <p className="text-xs text-gray-500">Active Prescriptions</p>
            <p className="text-lg font-bold text-blue-600">{stats.prescriptionsPending}</p>
          </div>
        </Tooltip>
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
    </div>
  );
};

export default PharmacistDashboard;