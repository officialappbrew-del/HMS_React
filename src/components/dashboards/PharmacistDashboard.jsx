import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest, API_BASE_URL } from '../../utils/api';
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
                          alert('Image must be less than 5MB');
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

const PharmacistDashboard = () => {
  const { user: authUser, tenant: authTenant } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { drugs } = useSelector(state => state.pharmacy || { drugs: [] });

  const displayTenantName = authTenant?.name || 'Hospital';
  const displayUserName = [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.username || authUser?.email || 'User';
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
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileError(null);
    setProfileSuccess(null);

    if (!profileData.first_name.trim() || !profileData.last_name.trim()) {
      setProfileError('First name and last name are required.');
      setProfileSaving(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      setProfileError('Please enter a valid email address.');
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
        setProfileError(friendlyMessages);
      } else {
        setProfileError(err.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDispensePrescription = (id) => {
    setPendingPrescriptions(prev => prev.filter(p => p.id !== id));
    setStats(prev => ({
      ...prev,
      prescriptionsPending: prev.prescriptionsPending - 1,
      dispensedToday: prev.dispensedToday + 1
    }));
  };

  const handleReorderDrug = (id) => {
    setLowStockAlerts(prev => prev.filter(item => item.id !== id));
    setStats(prev => ({
      ...prev,
      lowStockItems: prev.lowStockItems - 1
    }));
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

      {/* Tab Content */}
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
    </div>
  );
};

export default PharmacistDashboard;