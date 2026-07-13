import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest, API_BASE_URL } from '../../utils/api';
import ConfirmModal from '../../components/ConfirmModal';
import ChangePasswordModal from '../ChangePasswordModal';
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
  RefreshCw,
  UserCircle,
  IdCard,
  Droplets,
  Baby,
  Phone,
  MapPin,
  User as UserIcon,
  Upload,
  Loader2,
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

// Profile Modal Component
const ProfileModal = ({ isOpen, onClose, profileData, onChange, onSave, loading, saving, error, success, specializations, specializationsLoading, profilePicturePreview, onProfilePictureChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">My Profile</h2>
                <p className="text-sm text-blue-100 mt-1">View and update your personal information</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {(error || success) && (
              <div className={`mb-4 p-3 rounded-lg text-sm whitespace-pre-line ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                {error || success}
              </div>
            )}

            {!loading && (
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                    {profilePicturePreview ? (
                      <img
                        key={profilePicturePreview}
                        src={profilePicturePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement?.querySelector('.profile-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full items-center justify-center profile-fallback" style={{ display: profilePicturePreview ? 'none' : 'flex' }}>
                      <UserIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                </div>
                <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  {profilePicturePreview ? 'Change Photo' : 'Upload Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          onProfilePictureChange('profile_picture_file', null);
                          // Use modal instead of alert
                          onProfilePictureChange('profile_error', 'Image must be less than 5MB');
                          return;
                        }
                        onProfilePictureChange('profile_picture_file', file);
                      }
                    }}
                  />
                </label>
                {profilePicturePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      onProfilePictureChange('profile_picture_file', null);
                    }}
                    className="mt-1 text-xs text-red-600 hover:text-red-700"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">Loading profile...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => onChange('first_name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => onChange('last_name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => onChange('email', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => onChange('phone', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={profileData.employee_id}
                      disabled
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={profileData.department_name}
                      disabled
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={profileData.designation}
                      onChange={(e) => onChange('designation', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">License Number</label>
                    <input
                      type="text"
                      value={profileData.license_number}
                      onChange={(e) => onChange('license_number', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Specialization</label>
                    <select
                      value={profileData.specialization}
                      onChange={(e) => onChange('specialization', e.target.value)}
                      disabled={specializationsLoading}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                    >
                      <option value="">-- Select specialization --</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Qualification</label>
                  <textarea
                    value={profileData.qualification}
                    onChange={(e) => onChange('qualification', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex flex-wrap justify-end gap-2">
            <ButtonWithTooltip
              onClick={onClose}
              tooltip="Close profile editor"
              variant="secondary"
            >
              <X className="w-3.5 h-3.5" />
              Close
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={onSave}
              tooltip="Save profile changes"
              variant="primary"
              disabled={saving}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </ButtonWithTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error Modal Component
const ErrorModal = ({ isOpen, onClose, title, message, details }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
          <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <h2 className="text-xl font-bold">{title || 'Validation Error'}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <p className="text-gray-700 text-sm">{message}</p>
            </div>
            {details && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 font-medium mb-1">Details:</p>
                <p className="text-sm text-gray-700">{details}</p>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <ButtonWithTooltip
                onClick={onClose}
                tooltip="Close"
                variant="primary"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Got it
              </ButtonWithTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PharmacistDashboard = () => {
  const { user: authUser, tenant: authTenant } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { drugs } = useSelector(state => state.pharmacy || { drugs: [] });
  const [apiDrugs, setApiDrugs] = useState([]);
  const [apiPrescriptions, setApiPrescriptions] = useState([]);
  const [loadingDrugs, setLoadingDrugs] = useState(false);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [errorDrugs, setErrorDrugs] = useState(null);
  const [errorPrescriptions, setErrorPrescriptions] = useState(null);

  // Error Modal State
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    details: '',
  });

  const drugCategories = [
    { value: 'antibiotic', label: 'Antibiotic' },
    { value: 'analgesic', label: 'Analgesic' },
    { value: 'antihypertensive', label: 'Antihypertensive' },
    { value: 'antidiabetic', label: 'Antidiabetic' },
    { value: 'antimalarial', label: 'Antimalarial' },
    { value: 'vaccine', label: 'Vaccine' },
    { value: 'supplement', label: 'Supplement' },
    { value: 'other', label: 'Other' }
  ];

  const dosageForms = [
    { value: 'tablet', label: 'Tablet' },
    { value: 'capsule', label: 'Capsule' },
    { value: 'syrup', label: 'Syrup' },
    { value: 'injection', label: 'Injection' },
    { value: 'ointment', label: 'Ointment' },
    { value: 'cream', label: 'Cream' },
    { value: 'drops', label: 'Drops' },
    { value: 'inhaler', label: 'Inhaler' },
    { value: 'suppository', label: 'Suppository' }
  ];

  const nemlCategories = [
    'Essential-Core', 'Essential-Complementary', 'Specialist', 'Supplementary', 'Not-in-NEML'
  ];

  const controlledSchedules = [
    'C1 - Most Restricted', 'C2 - Restricted', 'C3 - Less Restricted', 'C4 - Least Restricted', 'Non-controlled'
  ];

  const nigerianManufacturers = [
    'Emzor Pharmaceuticals', 'Fidson Healthcare', 'May & Baker Nigeria', 'Swiss Pharma Nigeria',
    'Chi Pharmaceuticals', 'Greenlife Pharmaceuticals', 'Mopson Pharmaceuticals', 'Biotech Pharmaceuticals',
    'GSK Nigeria', 'Sanofi Nigeria', 'Pfizer Nigeria', 'Other'
  ];

const displayTenantName = authTenant?.name || 'Hospital';
   const displayUserName = authUser?.full_name || [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.username || authUser?.email || 'User';
   const displayRole = authUser?.role || 'pharmacist';

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    employee_id: '',
    department_name: '',
    designation: '',
    license_number: '',
    specialization: '',
    qualification: '',
  });
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [specializationsLoading, setSpecializationsLoading] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [dashboardProfilePicture, setDashboardProfilePicture] = useState(authUser?.profile_picture || '');

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

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

  const [apiSuppliers, setApiSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    supplierId: null,
    supplierName: '',
  });
  const [deleting, setDeleting] = useState(false);

  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [editingInventoryId, setEditingInventoryId] = useState(null);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [inventoryForm, setInventoryForm] = useState({
    name: '', genericName: '', brandName: '', drugCode: '',
    nafdacNumber: '', pcnApprovalNumber: '', strength: '', dosageForm: '',
    unitOfMeasure: '', category: '', therapeuticClass: '', manufacturer: '',
    supplier: '', countryOfOrigin: 'Nigeria', unitPrice: '', sellingPrice: '',
    quantity: '', reorderLevel: '', reorderQuantity: '', expiryDate: '',
    batchNumber: '', storageConditions: '', prescriptionRequired: false,
    controlledSubstance: false, narcotic: false, schedule: '', nhisCovered: false,
    nhisCode: '', nhisPrice: '', nemlCategory: '', sideEffects: '',
    contraindications: '', interactions: '', dosageInstructions: '', barcode: '',
    lastRestocked: new Date().toISOString().split('T')[0],
  });
  const [supplierForm, setSupplierForm] = useState({
    name: '', contactPerson: '', phone: '', email: '', address: '',
    licenseNumber: '', rating: 0, notes: ''
  });

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
    const fetchSuppliers = async () => {
      setLoadingSuppliers(true);
      try {
        const data = await apiRequest('/api/v1/pharmacy/suppliers/');
        const list = Array.isArray(data) ? data : (data.results || []);
        setApiSuppliers(list);
      } catch (err) {
        console.error('Failed to load suppliers:', err);
      } finally {
        setLoadingSuppliers(false);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const allDrugs = apiDrugs.length > 0 ? apiDrugs : [];
    const lowStockItems = allDrugs.filter(drug => drug.quantityInStock <= drug.reorderLevel).length;
    const totalValue = allDrugs.reduce((sum, drug) => sum + (drug.quantityInStock * parseFloat(drug.unitPrice || drug.unit_price || 0)), 0);
    const pendingRx = apiPrescriptions.filter(p => p.status === 'prescribed').length;

    setStats({
      prescriptionsPending: pendingRx > 0 ? pendingRx : pendingPrescriptions.length,
      lowStockItems: lowStockItems > 0 ? lowStockItems : 0,
      expiringSoon: 0,
      dispensedToday: 0,
      totalInventory: allDrugs.length,
      inventoryValue: totalValue,
      totalSuppliers: apiSuppliers.length,
    });
  }, [apiDrugs, apiPrescriptions, pendingPrescriptions, apiSuppliers]);

  // Profile Handlers
  const handleOpenProfile = async () => {
    setShowProfileModal(true);
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);
    setSpecializationsLoading(true);
    setProfilePictureFile(null);
    setProfilePicturePreview('');
    setDashboardProfilePicture(authUser?.profile_picture || '');
    try {
      const [profileRes, specsRes] = await Promise.all([
        apiRequest('/api/v1/tenants/users/me/'),
        apiRequest('/api/v1/core/specializations/'),
      ]);
      const specList = Array.isArray(specsRes) ? specsRes : (specsRes.results || []);
      setSpecializations(specList.map(s => s.name));
      setProfileData({
        first_name: profileRes.first_name || '',
        last_name: profileRes.last_name || '',
        email: profileRes.email || '',
        phone: profileRes.phone || '',
        role: profileRes.role || '',
        employee_id: profileRes.employee_id || '',
        department_name: profileRes.department_name || '',
        designation: profileRes.designation || '',
        license_number: profileRes.license_number || '',
        specialization: profileRes.specialization || '',
        qualification: profileRes.qualification || '',
      });
      const pic = profileRes.profile_picture || '';
      const cached = localStorage.getItem('userProfilePicture') || '';
      const effectivePic = pic || cached;
      if (effectivePic) {
        const cacheBusted = effectivePic.includes('?') ? `${effectivePic}&t=${Date.now()}` : `${effectivePic}?t=${Date.now()}`;
        setProfilePicturePreview(cacheBusted);
        setDashboardProfilePicture(cacheBusted);
        localStorage.setItem('userProfilePicture', effectivePic);
      }
    } catch (err) {
      if (err.data && typeof err.data === 'object') {
        const friendlyMessages = Object.entries(err.data)
          .map(([field, errors]) => {
            const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const msg = Array.isArray(errors) ? errors[0] : errors;
            return `${fieldLabel}: ${msg}`;
          })
          .join('\n');
        setProfileError(friendlyMessages);
      } else {
        setProfileError(err.message || 'Failed to load profile. Please try again.');
      }
    } finally {
      setProfileLoading(false);
      setSpecializationsLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    if (field === 'profile_picture_file') {
      setProfilePictureFile(value);
      if (value) {
        const reader = new FileReader();
        reader.onload = (e) => setProfilePicturePreview(e.target.result);
        reader.readAsDataURL(value);
      } else {
        setProfilePicturePreview('');
      }
    } else if (field === 'profile_error') {
      showErrorModal('Upload Error', value, 'Please select an image smaller than 5MB');
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);

    if (!profileData.first_name.trim() || !profileData.last_name.trim()) {
      showErrorModal('Validation Error', 'First name and last name are required.', 'Please fill in all required fields.');
      setProfileSaving(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      showErrorModal('Validation Error', 'Please enter a valid email address.', 'Example: name@domain.com');
      setProfileSaving(false);
      return;
    }

    const trimmedSpecialization = profileData.specialization.trim();

    try {
      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('first_name', profileData.first_name.trim());
        formData.append('last_name', profileData.last_name.trim());
        formData.append('email', profileData.email.trim());
        formData.append('phone', profileData.phone.trim());
        formData.append('designation', profileData.designation.trim());
        formData.append('license_number', profileData.license_number.trim());
        formData.append('specialization', trimmedSpecialization);
        formData.append('qualification', profileData.qualification.trim());
        formData.append('profile_picture', profilePictureFile);

        const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/tenants/users/me/`, {
          method: 'PATCH',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formData,
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type') || '';
          const isJson = contentType.includes('application/json');
          const data = isJson ? await response.json().catch(() => ({})) : await response.text();
          const message = (data && (data.detail || data.error || data.message || data.non_field_errors?.[0])) || `Request failed with status ${response.status}`;
          const error = new Error(message);
          error.data = data;
          error.status = response.status;
          throw error;
        }
      } else {
        const payload = {
          first_name: profileData.first_name.trim(),
          last_name: profileData.last_name.trim(),
          email: profileData.email.trim(),
          phone: profileData.phone.trim(),
          designation: profileData.designation.trim(),
          license_number: profileData.license_number.trim(),
          specialization: trimmedSpecialization,
          qualification: profileData.qualification.trim(),
        };
        await apiRequest('/api/v1/tenants/users/me/', {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      }
      setProfileSuccess('Profile updated successfully');
      setProfilePictureFile(null);
      const refreshed = await apiRequest('/api/v1/tenants/users/me/');
      const pic = refreshed?.profile_picture || '';
      if (pic) {
        const cacheBusted = pic.includes('?') ? `${pic}&t=${Date.now()}` : `${pic}?t=${Date.now()}`;
        localStorage.setItem('userProfilePicture', pic);
        setDashboardProfilePicture(cacheBusted);
        setProfilePicturePreview(cacheBusted);
      } else {
        localStorage.removeItem('userProfilePicture');
        setDashboardProfilePicture('');
        setProfilePicturePreview('');
      }
    } catch (err) {
      if (err.data && typeof err.data === 'object') {
        const friendlyMessages = Object.entries(err.data)
          .map(([field, errors]) => {
            const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const msg = Array.isArray(errors) ? errors[0] : errors;
            if (field === 'email' && msg.includes('already exists')) {
              return `${fieldLabel}: This email address is already in use. Please choose a different one.`;
            }
            if (field === 'specialization' && msg.includes('not found')) {
              return `${fieldLabel}: "${trimmedSpecialization}" is not a recognized specialization.`;
            }
            return `${fieldLabel}: ${msg}`;
          })
          .join('\n');
        showErrorModal('Update Failed', friendlyMessages, 'Please correct the errors and try again.');
      } else {
        showErrorModal('Update Failed', err.message || 'Failed to update profile. Please try again.', '');
      }
    } finally {
      setProfileSaving(false);
    }
  };

  // Password Change Handlers
  const handleOpenChangePassword = () => {
    setShowChangePasswordModal(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
      setPasswordError('Please fill in all password fields.');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New password and confirm password do not match.');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      setPasswordLoading(false);
      return;
    }

    try {
      await apiRequest('/api/v1/tenants/users/change_password/', {
        method: 'POST',
        body: JSON.stringify({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
          confirm_password: passwordData.confirm_password,
        }),
      });
      setPasswordSuccess('Password changed successfully');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setPasswordSuccess(null);
      }, 1500);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Error Modal Helpers
  const showErrorModal = (title, message, details) => {
    setErrorModal({
      isOpen: true,
      title,
      message,
      details,
    });
  };

  const closeErrorModal = () => {
    setErrorModal({
      isOpen: false,
      title: '',
      message: '',
      details: '',
    });
  };

  const handleDispensePrescription = async (id) => {
    try {
      const prescription = apiPrescriptions.find(p => p.prescriptionId === id);
      if (!prescription) return;

      const drug = apiDrugs.length > 0 ? apiDrugs.find(d => d.name === prescription.medication) : null;
      if (!drug) {
        showErrorModal(
          'Dispense Error',
          'Drug not found in inventory for dispensing',
          `Medication: ${prescription.medication}`
        );
        return;
      }

      await apiRequest('/api/v1/pharmacy/dispenses/', {
        method: 'POST',
        body: JSON.stringify({
          prescription: prescription.prescriptionId,
          patient: prescription.patientId,
          drug: drug.id,
          quantity: 1,
          unit_price: parseFloat(drug.unit_price || drug.unitPrice || 0),
          instructions: '',
        }),
      });

      setApiPrescriptions(prev => prev.filter(p => p.prescriptionId !== id));
      setPendingPrescriptions(prev => prev.filter(p => p.id !== id));
      setStats(prev => ({
        ...prev,
        prescriptionsPending: Math.max(0, prev.prescriptionsPending - 1),
        dispensedToday: prev.dispensedToday + 1
      }));
    } catch (err) {
      showErrorModal(
        'Dispense Failed',
        err.message || 'Failed to dispense prescription',
        'Please check the prescription details and try again.'
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDrugs(true);
      setErrorDrugs(null);
      try {
        const data = await apiRequest('/api/v1/pharmacy/drugs/');
        const list = Array.isArray(data) ? data : (data.results || []);
        const normalized = list.map(drug => ({
          ...drug,
          quantityInStock: drug.stock_quantity,
          reorderLevel: drug.reorder_level,
          unitPrice: drug.unit_price,
          sellingPrice: drug.unit_price,
          drugCode: drug.drug_code,
          genericName: drug.generic_name,
          brandName: drug.brand_name,
          nafdacNumber: drug.nafdac_number,
          isControlled: drug.is_controlled,
          id: drug.id,
          name: drug.name,
          category: drug.category,
          form: drug.form,
          strength: drug.strength,
          tenant: drug.tenant,
          created_at: drug.created_at,
          updated_at: drug.updated_at,
          is_active: drug.is_active,
        }));
        setApiDrugs(normalized);
      } catch (err) {
        setErrorDrugs(err.message || 'Failed to load drugs');
        showErrorModal(
          'Load Error',
          'Failed to load drugs inventory',
          err.message || 'Please try refreshing the page.'
        );
      } finally {
        setLoadingDrugs(false);
      }
    };

    const fetchPrescriptions = async () => {
      setLoadingPrescriptions(true);
      setErrorPrescriptions(null);
      try {
        const data = await apiRequest('/api/v1/clinical/prescriptions/?status=prescribed');
        const list = Array.isArray(data) ? data : (data.results || []);
        const normalized = list.map(rx => ({
          ...rx,
          patient: rx.patient_name || 'Unknown',
          medication: rx.drug_name || 'Unknown',
          date: rx.prescribed_date ? new Date(rx.prescribed_date).toISOString().split('T')[0] : '',
          priority: 'Normal',
          prescriptionId: rx.id,
          patientId: rx.patient,
        }));
        setApiPrescriptions(normalized);
      } catch (err) {
        setErrorPrescriptions(err.message || 'Failed to load prescriptions');
        showErrorModal(
          'Load Error',
          'Failed to load prescriptions',
          err.message || 'Please try refreshing the page.'
        );
      } finally {
        setLoadingPrescriptions(false);
      }
    };

    fetchData();
    fetchPrescriptions();
  }, []);

  const handleReorderDrug = async (id) => {
    try {
      await apiRequest(`/api/v1/pharmacy/drugs/${id}/reorder/`, { method: 'POST' });
      setLowStockAlerts(prev => prev.filter(item => item.id !== id));
      setStats(prev => ({
        ...prev,
        lowStockItems: Math.max(0, prev.lowStockItems - 1)
      }));
    } catch (err) {
      showErrorModal(
        'Reorder Failed',
        err.message || 'Failed to process reorder',
        'Please check the drug details and try again.'
      );
    }
  };

  // NAFDAC validation helper
  const isValidNafdac = (number) => {
    if (!number) return true; // Allow empty
    const pattern = /^NAFDAC-\d{2}-\d{4}$/;
    return pattern.test(number);
  };

  const displayPendingPrescriptions = apiPrescriptions.length > 0
    ? apiPrescriptions
    : pendingPrescriptions;

  const displayLowStockAlerts = apiDrugs.length > 0
    ? apiDrugs.filter(d => d.quantityInStock <= d.reorderLevel).map(d => ({
        id: d.id,
        drug: d.name,
        current: d.quantityInStock,
        reorder: d.reorderLevel,
        supplier: '',
        status: d.quantityInStock === 0 ? 'critical' : 'warning'
      }))
    : lowStockAlerts;

  const allPrescriptions = [
    ...apiPrescriptions.map(p => ({
      id: p.prescriptionId,
      patient: p.patient,
      medication: p.medication,
      date: p.date,
      status: p.status,
    })),
    ...prescriptionHistory,
  ];

  const displayInventoryItems = apiDrugs.map(d => ({
    id: d.id,
    name: d.name,
    genericName: d.genericName || '',
    brandName: d.brandName || '',
    drugCode: d.drugCode || '',
    nafdacNumber: d.nafdacNumber || '',
    pcnApprovalNumber: d.pcnApprovalNumber || '',
    strength: d.strength || '',
    dosageForm: d.dosageForm || d.form || '',
    unitOfMeasure: d.unitOfMeasure || d.unit_of_measure || '',
    category: d.category,
    therapeuticClass: d.therapeuticClass || '',
    manufacturer: d.manufacturer || '',
    supplier: d.supplier || '',
    countryOfOrigin: d.countryOfOrigin || 'Nigeria',
    unitPrice: d.unitPrice || d.unit_price || 0,
    sellingPrice: d.sellingPrice || d.selling_price || 0,
    stock: d.quantityInStock || d.stock_quantity || 0,
    reorderLevel: d.reorderLevel || d.reorder_level || 10,
    reorderQuantity: d.reorderQuantity || d.reorder_quantity || 0,
    expiryDate: d.expiryDate || d.expiry_date || '',
    batchNumber: d.batchNumber || d.batch_number || '',
    storageConditions: d.storageConditions || '',
    prescriptionRequired: d.prescriptionRequired || false,
    controlledSubstance: d.controlledSubstance || d.is_controlled || false,
    narcotic: d.narcotic || false,
    schedule: d.schedule || '',
    nhisCovered: d.nhisCovered || false,
    nhisCode: d.nhisCode || '',
    nhisPrice: d.nhisPrice || '',
    nemlCategory: d.nemlCategory || '',
    sideEffects: d.sideEffects || '',
    contraindications: d.contraindications || '',
    interactions: d.interactions || '',
    dosageInstructions: d.dosageInstructions || '',
    barcode: d.barcode || '',
    lastRestocked: d.lastRestocked || '',
    status: d.quantityInStock <= d.reorderLevel ? (d.quantityInStock === 0 ? 'critical' : 'low') : 'ok',
    price: parseFloat(d.unitPrice || d.unit_price || 0),
  }));

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
      'ok': { label: 'OK', color: 'bg-green-100 text-green-800' },
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
              {displayPendingPrescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No pending prescriptions</p>
                </div>
              ) : (
                displayPendingPrescriptions.map((prescription) => {
                  const status = getStatusBadge(prescription.priority);
                  return (
                    <div key={prescription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{prescription.patient}</p>
                        <p className="text-xs text-gray-500">{prescription.medication} • {prescription.time || prescription.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                        <ButtonWithTooltip
                          onClick={() => handleDispensePrescription(prescription.prescriptionId || prescription.id)}
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
              {displayLowStockAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">All items well stocked</p>
                </div>
              ) : (
                displayLowStockAlerts.map((item) => {
                  const status = getStatusBadge(item.status);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.drug}</p>
                        <p className="text-xs text-gray-500">
                          Current: {item.current} • Reorder: {item.reorder} • {item.supplier || 'N/A'}
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
              {allPrescriptions.map((prescription) => {
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
              onClick={() => {
                setEditingInventoryId(null);
                setInventoryForm({ name: '', batchNumber: '', quantity: '', reorderLevel: '', unit: 'tablets', supplier: '', expiryDate: '', unitCost: '' });
                setShowInventoryModal(true);
              }}
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
              {displayInventoryItems.map((item) => {
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
                          onClick={() => handleEditInventory(item)}
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
              onClick={() => {
                setEditingSupplierId(null);
                setSupplierForm({ name: '', contactPerson: '', phone: '', email: '', address: '', licenseNumber: '', rating: 0, notes: '' });
                setShowSupplierModal(true);
              }}
              tooltip="Add new supplier"
              variant="primary"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Supplier
            </ButtonWithTooltip>
          </div>
        </div>

        {loadingSuppliers ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span>Loading suppliers...</span>
          </div>
        ) : apiSuppliers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No suppliers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {apiSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{supplier.contact_person || '-'}</td>
                    <td className="py-3 text-sm text-gray-600">{supplier.phone || '-'}</td>
                    <td className="py-3 text-sm text-gray-600">{supplier.email || '-'}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${supplier.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {supplier.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <IconButton
                          icon={Edit}
                          tooltip="Edit supplier"
                          variant="primary"
                          onClick={() => handleEditSupplier(supplier)}
                        />
                        <IconButton
                          icon={Eye}
                          tooltip="View details"
                          variant="default"
                        />
                        <IconButton
                          icon={Trash2}
                          tooltip="Delete supplier"
                          variant="danger"
                          onClick={() => handleDeleteSupplier(supplier)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

  const handleDeleteSupplier = (supplier) => {
    setDeleteConfirm({
      isOpen: true,
      supplierId: supplier.id,
      supplierName: supplier.name,
    });
  };

  const confirmDeleteSupplier = async () => {
    if (!deleteConfirm.supplierId) return;
    setDeleting(true);
    try {
      await apiRequest(`/api/v1/pharmacy/suppliers/${deleteConfirm.supplierId}/`, { method: 'DELETE' });
      setApiSuppliers(prev => prev.filter(s => s.id !== deleteConfirm.supplierId));
      setStats(prev => ({ ...prev, totalSuppliers: Math.max(0, prev.totalSuppliers - 1) }));
    } catch (err) {
      setErrorModal({
        isOpen: true,
        title: 'Delete Failed',
        message: err.message || 'Failed to delete supplier',
      });
    } finally {
      setDeleting(false);
      setDeleteConfirm({ isOpen: false, supplierId: null, supplierName: '' });
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: inventoryForm.name.trim(),
        generic_name: inventoryForm.genericName.trim() || null,
        brand_name: inventoryForm.brandName.trim() || null,
        drug_code: inventoryForm.drugCode.trim() || null,
        nafdac_number: inventoryForm.nafdacNumber.trim() || null,
        pcn_approval_number: inventoryForm.pcnApprovalNumber.trim() || null,
        strength: inventoryForm.strength.trim() || null,
        form: inventoryForm.dosageForm,
        category: inventoryForm.category,
        therapeutic_class: inventoryForm.therapeuticClass.trim() || null,
        stock_quantity: parseInt(inventoryForm.quantity) || 0,
        reorder_level: parseInt(inventoryForm.reorderLevel) || 10,
        reorder_quantity: parseInt(inventoryForm.reorderQuantity) || 0,
        unit_price: parseFloat(inventoryForm.unitPrice) || 0,
        selling_price: parseFloat(inventoryForm.sellingPrice) || 0,
        unit_of_measure: inventoryForm.unitOfMeasure.trim() || null,
        batch_number: inventoryForm.batchNumber.trim() || null,
        expiry_date: inventoryForm.expiryDate || null,
        storage_conditions: inventoryForm.storageConditions.trim() || null,
        last_restocked: inventoryForm.lastRestocked || null,
        manufacturer: inventoryForm.manufacturer || null,
        supplier: inventoryForm.supplier.trim() || null,
        country_of_origin: inventoryForm.countryOfOrigin || 'Nigeria',
        is_controlled: inventoryForm.controlledSubstance,
        narcotic: inventoryForm.narcotic,
        schedule: inventoryForm.schedule.trim() || null,
        nhis_covered: inventoryForm.nhisCovered,
        nhis_code: inventoryForm.nhisCode.trim() || null,
        nhis_price: inventoryForm.nhisPrice ? parseFloat(inventoryForm.nhisPrice) : null,
        neml_category: inventoryForm.nemlCategory || null,
        side_effects: inventoryForm.sideEffects.trim() || null,
        contraindications: inventoryForm.contraindications.trim() || null,
        interactions: inventoryForm.interactions.trim() || null,
        dosage_instructions: inventoryForm.dosageInstructions.trim() || null,
        prescription_required: inventoryForm.prescriptionRequired,
        barcode: inventoryForm.barcode.trim() || null,
      };
      if (editingInventoryId) {
        await apiRequest(`/api/v1/pharmacy/drugs/${editingInventoryId}/`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiRequest('/api/v1/pharmacy/drugs/', { method: 'POST', body: JSON.stringify(payload) });
      }
      setShowInventoryModal(false);
      setEditingInventoryId(null);
      setInventoryForm({
        name: '', genericName: '', brandName: '', drugCode: '',
        nafdacNumber: '', pcnApprovalNumber: '', strength: '', dosageForm: '',
        unitOfMeasure: '', category: '', therapeuticClass: '', manufacturer: '',
        supplier: '', countryOfOrigin: 'Nigeria', unitPrice: '', sellingPrice: '',
        quantity: '', reorderLevel: '', reorderQuantity: '', expiryDate: '',
        batchNumber: '', storageConditions: '', prescriptionRequired: false,
        controlledSubstance: false, narcotic: false, schedule: '', nhisCovered: false,
        nhisCode: '', nhisPrice: '', nemlCategory: '', sideEffects: '',
        contraindications: '', interactions: '', dosageInstructions: '', barcode: '',
        lastRestocked: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setErrorModal({ isOpen: true, title: 'Error', message: err.message || 'Failed to save inventory' });
    }
  };

  const handleEditInventory = (item) => {
    setEditingInventoryId(item.id);
    setInventoryForm({
      name: item.name,
      genericName: item.genericName || '',
      brandName: item.brandName || '',
      drugCode: item.drugCode || '',
      nafdacNumber: item.nafdacNumber || '',
      pcnApprovalNumber: item.pcnApprovalNumber || '',
      strength: item.strength || '',
      dosageForm: item.dosageForm || '',
      unitOfMeasure: item.unitOfMeasure || item.unit || '',
      category: item.category || '',
      therapeuticClass: item.therapeuticClass || '',
      manufacturer: item.manufacturer || '',
      supplier: item.supplier || '',
      countryOfOrigin: item.countryOfOrigin || 'Nigeria',
      unitPrice: item.unitPrice ? String(item.unitPrice) : '',
      sellingPrice: item.sellingPrice ? String(item.sellingPrice) : '',
      quantity: String(item.stock || 0),
      reorderLevel: String(item.reorderLevel || 10),
      reorderQuantity: String(item.reorderQuantity || 0),
      expiryDate: item.expiryDate || '',
      batchNumber: item.batchNumber || '',
      storageConditions: item.storageConditions || '',
      prescriptionRequired: item.prescriptionRequired || false,
      controlledSubstance: item.controlledSubstance || false,
      narcotic: item.narcotic || false,
      schedule: item.schedule || '',
      nhisCovered: item.nhisCovered || false,
      nhisCode: item.nhisCode || '',
      nhisPrice: item.nhisPrice ? String(item.nhisPrice) : '',
      nemlCategory: item.nemlCategory || '',
      sideEffects: item.sideEffects || '',
      contraindications: item.contraindications || '',
      interactions: item.interactions || '',
      dosageInstructions: item.dosageInstructions || '',
      barcode: item.barcode || '',
      lastRestocked: item.lastRestocked || new Date().toISOString().split('T')[0],
    });
    setShowInventoryModal(true);
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: supplierForm.name.trim(),
        contact_person: supplierForm.contactPerson.trim() || null,
        phone: supplierForm.phone.trim() || null,
        email: supplierForm.email.trim() || null,
        address: supplierForm.address.trim() || null,
        license_number: supplierForm.licenseNumber.trim() || null,
        rating: parseInt(supplierForm.rating) || 0,
        notes: supplierForm.notes.trim() || null,
      };
      if (editingSupplierId) {
        await apiRequest(`/api/v1/pharmacy/suppliers/${editingSupplierId}/`, { method: 'PATCH', body: JSON.stringify(payload) });
        setApiSuppliers(prev => prev.map(s => s.id === editingSupplierId ? { ...s, ...payload } : s));
      } else {
        const res = await apiRequest('/api/v1/pharmacy/suppliers/', { method: 'POST', body: JSON.stringify(payload) });
        setApiSuppliers(prev => [...prev, res]);
      }
      setShowSupplierModal(false);
      setEditingSupplierId(null);
      setSupplierForm({ name: '', contactPerson: '', phone: '', email: '', address: '', licenseNumber: '', rating: 0, notes: '' });
    } catch (err) {
      setErrorModal({ isOpen: true, title: 'Error', message: err.message || 'Failed to save supplier' });
    }
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplierId(supplier.id);
    setSupplierForm({
      name: supplier.name || '',
      contactPerson: supplier.contact_person || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      licenseNumber: supplier.license_number || '',
      rating: supplier.rating || 0,
      notes: supplier.notes || '',
    });
    setShowSupplierModal(true);
  };

  return (
    <div className="dashboard min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {dashboardProfilePicture ? (
                <img
                  key={dashboardProfilePicture}
                  src={dashboardProfilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = e.target.parentElement?.querySelector('.profile-fallback');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full items-center justify-center profile-fallback" style={{ display: dashboardProfilePicture ? 'none' : 'flex' }}>
                <UserIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {displayUserName}
              </h1>
              <p className="text-sm text-gray-500">
                {displayTenantName} · {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} Dashboard
              </p>
            </div>
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
              tooltip="My Profile"
              variant="secondary"
              onClick={handleOpenProfile}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleOpenChangePassword}
              tooltip="Change Password"
              variant="secondary"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Change Password</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Additional Stats - Extended metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <p className="text-xs text-gray-500">Total Inventory</p>
          <p className="text-lg font-bold text-gray-900">{stats.totalInventory}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <p className="text-xs text-gray-500">Inventory Value</p>
          <p className="text-lg font-bold text-green-600">₦{stats.inventoryValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <p className="text-xs text-gray-500">Suppliers</p>
          <p className="text-lg font-bold text-gray-900">{stats.totalSuppliers}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
          <p className="text-xs text-gray-500">Active Prescriptions</p>
          <p className="text-lg font-bold text-blue-600">{stats.prescriptionsPending}</p>
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
                </button>
              </Tooltip>
            );
          })}
        </nav>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        {renderTabContent()}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profileData={profileData}
          onChange={handleProfileChange}
          onSave={handleSaveProfile}
          loading={profileLoading}
          saving={profileSaving}
          error={profileError}
          success={profileSuccess}
          specializations={specializations}
          specializationsLoading={specializationsLoading}
          profilePicturePreview={profilePicturePreview}
          onProfilePictureChange={handleProfileChange}
        />
      )}

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        saving={passwordLoading}
        error={passwordError}
        success={passwordSuccess}
        onChange={handlePasswordChange}
        onSave={handleChangePassword}
      />

      {/* Delete Supplier Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, supplierId: null, supplierName: '' })}
        onConfirm={confirmDeleteSupplier}
        type="delete"
        title="Delete Supplier"
        message={`Are you sure you want to delete "${deleteConfirm.supplierName}"? This action cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
      />

      {/* Inventory Modal */}
      {showInventoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-8">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowInventoryModal(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  {editingInventoryId ? 'Edit Drug / Inventory Item' : 'Add Drug / Inventory Item'}
                </h2>
                <button onClick={() => setShowInventoryModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddInventory} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Drug Name *</label>
                      <input type="text" value={inventoryForm.name} onChange={(e) => setInventoryForm({...inventoryForm, name: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Generic Name</label>
                      <input type="text" value={inventoryForm.genericName} onChange={(e) => setInventoryForm({...inventoryForm, genericName: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Brand Name</label>
                      <input type="text" value={inventoryForm.brandName} onChange={(e) => setInventoryForm({...inventoryForm, brandName: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Drug Code</label>
                      <input type="text" value={inventoryForm.drugCode} onChange={(e) => setInventoryForm({...inventoryForm, drugCode: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., ANT-MAL-001" />
                    </div>
                  </div>
                </div>

                {/* Regulatory Information */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Regulatory Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">NAFDAC Number</label>
                      <input type="text" value={inventoryForm.nafdacNumber} onChange={(e) => setInventoryForm({...inventoryForm, nafdacNumber: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="NAFDAC-04-1234" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">PCN Approval Number</label>
                      <input type="text" value={inventoryForm.pcnApprovalNumber} onChange={(e) => setInventoryForm({...inventoryForm, pcnApprovalNumber: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">NEML Category</label>
                      <select value={inventoryForm.nemlCategory} onChange={(e) => setInventoryForm({...inventoryForm, nemlCategory: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select Category</option>
                        {nemlCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Manufacturer</label>
                      <select value={inventoryForm.manufacturer} onChange={(e) => setInventoryForm({...inventoryForm, manufacturer: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select Manufacturer</option>
                        {nigerianManufacturers.map(man => <option key={man} value={man}>{man}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Strength</label>
                      <input type="text" value={inventoryForm.strength} onChange={(e) => setInventoryForm({...inventoryForm, strength: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 500mg" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Dosage Form *</label>
                      <select value={inventoryForm.dosageForm} onChange={(e) => setInventoryForm({...inventoryForm, dosageForm: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                        <option value="">Select Form</option>
                        {dosageForms.map(form => <option key={form.value} value={form.value}>{form.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                      <select value={inventoryForm.category} onChange={(e) => setInventoryForm({...inventoryForm, category: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                        <option value="">Select Category</option>
                        {drugCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Therapeutic Class</label>
                      <input type="text" value={inventoryForm.therapeuticClass} onChange={(e) => setInventoryForm({...inventoryForm, therapeuticClass: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Inventory Information */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Inventory</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price (₦)</label>
                      <input type="number" value={inventoryForm.unitPrice} onChange={(e) => setInventoryForm({...inventoryForm, unitPrice: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0" step="0.01" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Selling Price (₦)</label>
                      <input type="number" value={inventoryForm.sellingPrice} onChange={(e) => setInventoryForm({...inventoryForm, sellingPrice: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0" step="0.01" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quantity in Stock</label>
                      <input type="number" value={inventoryForm.quantity} onChange={(e) => setInventoryForm({...inventoryForm, quantity: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Reorder Level</label>
                      <input type="number" value={inventoryForm.reorderLevel} onChange={(e) => setInventoryForm({...inventoryForm, reorderLevel: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Reorder Quantity</label>
                      <input type="number" value={inventoryForm.reorderQuantity} onChange={(e) => setInventoryForm({...inventoryForm, reorderQuantity: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Batch Number</label>
                      <input type="text" value={inventoryForm.batchNumber} onChange={(e) => setInventoryForm({...inventoryForm, batchNumber: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input type="date" value={inventoryForm.expiryDate} onChange={(e) => setInventoryForm({...inventoryForm, expiryDate: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Storage Conditions</label>
                      <input type="text" value={inventoryForm.storageConditions} onChange={(e) => setInventoryForm({...inventoryForm, storageConditions: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Room temperature, Refrigerated" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Unit of Measure</label>
                      <input type="text" value={inventoryForm.unitOfMeasure} onChange={(e) => setInventoryForm({...inventoryForm, unitOfMeasure: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="tablet, capsule, ml, etc." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Supplier</label>
                      <input type="text" value={inventoryForm.supplier} onChange={(e) => setInventoryForm({...inventoryForm, supplier: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Country of Origin</label>
                      <input type="text" value={inventoryForm.countryOfOrigin} onChange={(e) => setInventoryForm({...inventoryForm, countryOfOrigin: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Controlled Substance */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Controlled Substance</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={inventoryForm.controlledSubstance} onChange={(e) => setInventoryForm({...inventoryForm, controlledSubstance: e.target.checked})} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <label className="text-sm text-gray-700">Controlled Substance</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={inventoryForm.narcotic} onChange={(e) => setInventoryForm({...inventoryForm, narcotic: e.target.checked})} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <label className="text-sm text-gray-700">Narcotic</label>
                    </div>
                    {inventoryForm.controlledSubstance && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Schedule</label>
                        <select value={inventoryForm.schedule} onChange={(e) => setInventoryForm({...inventoryForm, schedule: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <option value="">Select Schedule</option>
                          {controlledSchedules.map(schedule => <option key={schedule} value={schedule}>{schedule}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* NHIS Information */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">NHIS Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={inventoryForm.nhisCovered} onChange={(e) => setInventoryForm({...inventoryForm, nhisCovered: e.target.checked})} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      <label className="text-sm text-gray-700">NHIS Covered</label>
                    </div>
                    {inventoryForm.nhisCovered && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">NHIS Code</label>
                          <input type="text" value={inventoryForm.nhisCode} onChange={(e) => setInventoryForm({...inventoryForm, nhisCode: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">NHIS Price (₦)</label>
                          <input type="number" value={inventoryForm.nhisPrice} onChange={(e) => setInventoryForm({...inventoryForm, nhisPrice: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0" step="0.01" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Clinical Information */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Clinical Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Dosage Instructions</label>
                      <textarea value={inventoryForm.dosageInstructions} onChange={(e) => setInventoryForm({...inventoryForm, dosageInstructions: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2" placeholder="e.g., Take 1 tablet twice daily after meals" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Side Effects</label>
                      <textarea value={inventoryForm.sideEffects} onChange={(e) => setInventoryForm({...inventoryForm, sideEffects: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2" placeholder="List common side effects" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Contraindications</label>
                      <textarea value={inventoryForm.contraindications} onChange={(e) => setInventoryForm({...inventoryForm, contraindications: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2" placeholder="List contraindications" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Interactions</label>
                      <textarea value={inventoryForm.interactions} onChange={(e) => setInventoryForm({...inventoryForm, interactions: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2" placeholder="List drug interactions" />
                    </div>
                  </div>
                </div>

                {/* Prescription Requirement */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Prescription Settings</h4>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={inventoryForm.prescriptionRequired} onChange={(e) => setInventoryForm({...inventoryForm, prescriptionRequired: e.target.checked})} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label className="text-sm text-gray-700">Prescription Required</label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    {editingInventoryId ? 'Update Drug' : 'Add Drug'}
                  </button>
                  <button type="button" onClick={() => setShowInventoryModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-2.5 sm:py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-8">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowSupplierModal(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  {editingSupplierId ? 'Edit Supplier' : 'Add New Supplier'}
                </h2>
                <button onClick={() => setShowSupplierModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddSupplier} className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Supplier Name *</label>
                    <input type="text" value={supplierForm.name} onChange={(e) => setSupplierForm({...supplierForm, name: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Contact Person</label>
                    <input type="text" value={supplierForm.contactPerson} onChange={(e) => setSupplierForm({...supplierForm, contactPerson: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    <input type="text" value={supplierForm.phone} onChange={(e) => setSupplierForm({...supplierForm, phone: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={supplierForm.email} onChange={(e) => setSupplierForm({...supplierForm, email: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                    <textarea value={supplierForm.address} onChange={(e) => setSupplierForm({...supplierForm, address: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">License Number</label>
                    <input type="text" value={supplierForm.licenseNumber} onChange={(e) => setSupplierForm({...supplierForm, licenseNumber: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
                    <input type="number" value={supplierForm.rating} onChange={(e) => setSupplierForm({...supplierForm, rating: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" min="0" max="5" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                    <textarea value={supplierForm.notes} onChange={(e) => setSupplierForm({...supplierForm, notes: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="2" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    {editingSupplierId ? 'Update Supplier' : 'Add Supplier'}
                  </button>
                  <button type="button" onClick={() => setShowSupplierModal(false)} className="flex-1 bg-gray-200 text-gray-800 py-2.5 sm:py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacistDashboard;