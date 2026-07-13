import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';
import LoadingSpinner from '../LoadingSpinner';
import { apiRequest, API_BASE_URL } from '../../utils/api';
import ConfirmModal from '../ConfirmModal';
import ChangePasswordModal from '../ChangePasswordModal';
import { setPatients } from '../../features/patientSlice';
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
  RotateCcw,
  Hospital,
  Ambulance as AmbulanceIcon,
  Stethoscope as StethoscopeIcon,
  Loader2,
  Upload,
  UserCircle,
  IdCard,
  Droplets,
  Baby,
  Activity as ActivityIcon,
  Heart as HeartIcon,
  Clock as ClockIcon,
  User as UserIcon,
  Home as HomeIcon,
  Briefcase as BriefcaseIcon,
  Shield as ShieldIcon,
  HeartPulse as HeartPulseIcon,
  Brain as BrainIcon,
  Bone as BoneIcon,
  Droplets as DropletsIcon,
  Pill as PillIcon,
  Syringe as SyringeIcon,
  MapPin,
  Globe,
  BookOpen,
  Award as AwardIcon,
  Building2 as BuildingIcon,
  Phone as PhoneIcon,
  Mail,
  UserPlus as UserPlusIcon,
  Stethoscope as StethoscopeIcon2,
} from 'lucide-react';

// ==================== TOOLTIP COMPONENT ====================
const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
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
          <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg">
            {text}
            <div className={`absolute w-1.5 h-1.5 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'bottom-[-3px] left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-[-3px] left-1/2 -translate-x-1/2' :
              position === 'left' ? 'right-[-3px] top-1/2 -translate-y-1/2' :
              'left-[-3px] top-1/2 -translate-y-1/2'
            }`} />
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== ICON BUTTON ====================
const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false, size = 'sm' }) => {
  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    primary: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    success: 'text-green-600 hover:text-green-700 hover:bg-green-50',
    danger: 'text-red-600 hover:text-red-700 hover:bg-red-50',
    warning: 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50',
    info: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
  };

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`rounded-lg transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
        }`}
      >
        <Icon className={iconSizes[size]} />
      </button>
    </Tooltip>
  );
};

// ==================== BUTTON WITH TOOLTIP ====================
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '', disabled = false, size = 'sm', type = 'button' }) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow',
    secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm hover:shadow',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`rounded-lg transition-all duration-200 flex items-center gap-1.5 font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

// ==================== STATS CARD ====================
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

// ==================== PROFILE MODAL ====================
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

// ==================== COMPACT PATIENT DETAIL MODAL ====================
const PatientDetailModal = ({ patient, onClose, onEdit, onAdmit, onConsult, onViewEMR }) => {
  const [activeTab, setActiveTab] = useState('personal');
  
  if (!patient) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'inactive': 'bg-gray-100 text-gray-800 border-gray-200',
      'archived': 'bg-gray-100 text-gray-800 border-gray-200',
      'critical': 'bg-red-100 text-red-800 border-red-200',
      'stable': 'bg-green-100 text-green-800 border-green-200',
      'monitoring': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                {getInitials(patient.name)}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{patient.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {patient.hospital_number && <span>HN: {patient.hospital_number}</span>}
                  {patient.age && <span>• {patient.age}y</span>}
                  {patient.gender && <span>• {patient.gender}</span>}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="px-4 py-2 border-b border-gray-100 flex-shrink-0 flex items-center gap-2 flex-wrap">
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(patient.status)}`}>
              {patient.status || 'Active'}
            </span>
            {patient.bloodType && (
              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                <Droplets className="w-3 h-3 mr-0.5" />
                {patient.bloodType}
              </span>
            )}
            {patient.has_insurance && (
              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                <Shield className="w-3 h-3 mr-0.5" />
                Insured
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-4 flex-shrink-0">
            {['personal', 'contact', 'medical'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'personal' && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Full Name</p>
                  <p className="font-medium text-gray-900">{patient.name}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Gender</p>
                  <p className="font-medium text-gray-900 capitalize">{patient.gender || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Date of Birth</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(patient.dateOfBirth)}
                    {patient.age && ` (${patient.age}y)`}
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">NIN</p>
                  <p className="font-medium text-gray-900">{patient.nin || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Marital Status</p>
                  <p className="font-medium text-gray-900 capitalize">{patient.maritalStatus || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Religion</p>
                  <p className="font-medium text-gray-900">{patient.religion || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Ethnicity</p>
                  <p className="font-medium text-gray-900">{patient.tribe || patient.ethnicity || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Occupation</p>
                  <p className="font-medium text-gray-900">{patient.occupation || 'N/A'}</p>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Phone</p>
                  <p className="font-medium text-gray-900">{patient.phone || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Email</p>
                  <p className="font-medium text-gray-900">{patient.email || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Address</p>
                  <p className="font-medium text-gray-900">{patient.address || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">State</p>
                  <p className="font-medium text-gray-900">{patient.state || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">LGA</p>
                  <p className="font-medium text-gray-900">{patient.lga || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">City</p>
                  <p className="font-medium text-gray-900">{patient.city || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Emergency Contact</p>
                  <p className="font-medium text-gray-900">
                    {patient.emergencyContact || patient.next_of_kin_name || 'N/A'}
                    {patient.emergencyPhone && ` (${patient.emergencyPhone})`}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Blood Type</p>
                  <p className="font-medium text-gray-900">{patient.bloodType || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Genotype</p>
                  <p className="font-medium text-gray-900">{patient.genotype || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Known Allergies</p>
                  <p className="font-medium text-gray-900">{patient.known_allergies || 'None'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Chronic Conditions</p>
                  <p className="font-medium text-gray-900">{patient.chronic_conditions || 'None'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Current Medications</p>
                  <p className="font-medium text-gray-900">{patient.current_medications || 'None'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Surgical History</p>
                  <p className="font-medium text-gray-900">{patient.surgical_history || 'None'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Family History</p>
                  <p className="font-medium text-gray-900">{patient.family_history || 'None'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Notes</p>
                  <p className="font-medium text-gray-900 whitespace-pre-line">{patient.notes || 'None'}</p>
                </div>
                {patient.has_insurance && (
                  <div className="bg-gray-50 rounded p-2 col-span-2">
                    <p className="text-[10px] text-gray-500 uppercase font-medium">Insurance</p>
                    <p className="font-medium text-gray-900">
                      {patient.insurance_company || 'N/A'}
                      {patient.insurance_policy_number && ` (${patient.insurance_policy_number})`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0 flex-wrap">
            <ButtonWithTooltip
              onClick={onClose}
              tooltip="Close"
              variant="secondary"
              size="sm"
            >
              <X className="w-3.5 h-3.5" />
              Close
            </ButtonWithTooltip>
            {onEdit && (
              <ButtonWithTooltip
                onClick={() => onEdit(patient)}
                tooltip="Edit patient"
                variant="warning"
                size="sm"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </ButtonWithTooltip>
            )}
            {onAdmit && (
              <ButtonWithTooltip
                onClick={() => onAdmit(patient)}
                tooltip="Admit patient"
                variant="success"
                size="sm"
              >
                <Bed className="w-3.5 h-3.5" />
                Admit
              </ButtonWithTooltip>
            )}
            {onConsult && (
              <ButtonWithTooltip
                onClick={() => onConsult(patient)}
                tooltip="Start consultation"
                variant="primary"
                size="sm"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Consult
              </ButtonWithTooltip>
            )}
            {onViewEMR && (
              <ButtonWithTooltip
                onClick={() => onViewEMR(patient)}
                tooltip="View medical records"
                variant="primary"
                size="sm"
              >
                <FileText className="w-3.5 h-3.5" />
                EMR
              </ButtonWithTooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPACT EDIT PATIENT MODAL ====================
const EditPatientModal = ({ 
  isOpen, 
  onClose, 
  patient, 
  onSave,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || patient.full_name || '',
        nin: patient.nin || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        tribe: patient.tribe || patient.ethnicity || '',
        country: patient.country || 'Nigeria',
        lga: patient.lga || '',
        state: patient.state || '',
        city: patient.city || '',
        dateOfBirth: patient.dateOfBirth || '',
        bloodType: patient.bloodType || patient.blood_group || '',
        gender: (patient.gender || '').toLowerCase(),
        maritalStatus: (patient.maritalStatus || patient.marital_status || '').toLowerCase(),
        occupation: patient.occupation || '',
        emergencyContact: patient.emergencyContact || patient.next_of_kin_name || '',
        emergencyPhone: patient.emergencyPhone || patient.next_of_kin_phone || '',
        religion: patient.religion || '',
        patient_status: patient.patient_status || 'active',
        genotype: patient.genotype || '',
        has_insurance: patient.has_insurance || false,
        insurance_company: patient.insurance_company || '',
        insurance_policy_number: patient.insurance_policy_number || '',
        nhis_number: patient.nhis_number || '',
        known_allergies: patient.known_allergies || '',
        chronic_conditions: patient.chronic_conditions || '',
        current_medications: patient.current_medications || '',
        surgical_history: patient.surgical_history || '',
        family_history: patient.family_history || '',
        notes: patient.notes || '',
      });
    }
  }, [patient]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center">
                <Edit className="w-3.5 h-3.5 text-yellow-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Edit Patient</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">NIN</label>
                  <input
                    type="text"
                    name="nin"
                    value={formData.nin}
                    onChange={handleChange}
                    placeholder="National Identity Number"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">LGA</label>
                  <input
                    type="text"
                    name="lga"
                    value={formData.lga}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Blood Type</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Genotype</label>
                  <select
                    name="genotype"
                    value={formData.genotype}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select</option>
                    <option value="AA">AA</option>
                    <option value="AS">AS</option>
                    <option value="SS">SS</option>
                    <option value="AC">AC</option>
                    <option value="SC">SC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="separated">Separated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Religion</label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Ethnicity / Tribe</label>
                  <input
                    type="text"
                    name="tribe"
                    value={formData.tribe}
                    onChange={handleChange}
                    placeholder="e.g. Hausa, Igbo, Yoruba"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Emergency Contact</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1"
                    disabled={isSubmitting}
                  />
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Known Allergies</label>
                  <input
                    type="text"
                    name="known_allergies"
                    value={formData.known_allergies}
                    onChange={handleChange}
                    placeholder="e.g. Penicillin, Latex"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Chronic Conditions</label>
                  <input
                    type="text"
                    name="chronic_conditions"
                    value={formData.chronic_conditions}
                    onChange={handleChange}
                    placeholder="e.g. Diabetes, Hypertension"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Current Medications</label>
                  <input
                    type="text"
                    name="current_medications"
                    value={formData.current_medications}
                    onChange={handleChange}
                    placeholder="e.g. Metformin 500mg"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Surgical History</label>
                  <input
                    type="text"
                    name="surgical_history"
                    value={formData.surgical_history}
                    onChange={handleChange}
                    placeholder="e.g. Appendectomy 2020"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Family History</label>
                  <input
                    type="text"
                    name="family_history"
                    value={formData.family_history}
                    onChange={handleChange}
                    placeholder="e.g. Diabetes (Mother)"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Insurance */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    id="has_insurance"
                    type="checkbox"
                    name="has_insurance"
                    checked={formData.has_insurance}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="has_insurance" className="text-xs font-medium text-gray-700">
                    Has Insurance
                  </label>
                </div>
                {formData.has_insurance && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Insurance Company</label>
                      <input
                        type="text"
                        name="insurance_company"
                        value={formData.insurance_company}
                        onChange={handleChange}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Policy Number</label>
                      <input
                        type="text"
                        name="insurance_policy_number"
                        value={formData.insurance_policy_number}
                        onChange={handleChange}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-700 mb-0.5">NHIS Number</label>
                      <input
                        type="text"
                        name="nhis_number"
                        value={formData.nhis_number}
                        onChange={handleChange}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.patient_status === 'active'}
                    onChange={(e) => setFormData({ ...formData, patient_status: e.target.checked ? 'active' : 'inactive' })}
                    className="sr-only peer"
                    disabled={isSubmitting}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-xs text-gray-700">
                  {formData.patient_status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Update Patient
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN ADMIN DASHBOARD COMPONENT ====================
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
  const displayUserName = authUser?.full_name || [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.username || authUser?.email || 'User';
  const displayRole = authUser?.role || 'admin';

  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const itemsPerPage = 10;

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

  const [departments, setDepartments] = useState([]);
  const [showAddDeptForm, setShowAddDeptForm] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', code: '', description: '', is_clinical: false });
  
  // Edit/Delete state
  const [editingDept, setEditingDept] = useState(null);
  const [showEditDeptForm, setShowEditDeptForm] = useState(false);
  const [editDeptForm, setEditDeptForm] = useState({ 
    id: null,
    name: '', 
    code: '', 
    description: '', 
    is_clinical: false 
  });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Delete Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);

  // Patient Management State
  const [patientsList, setPatientsList] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [patientsNextPage, setPatientsNextPage] = useState(null);
  const [patientsPreviousPage, setPatientsPreviousPage] = useState(null);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  
  // Edit Patient Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(null);
  const [bulkUploadResult, setBulkUploadResult] = useState(null);
  const bulkUploadPollsRef = useRef({});

  const recentPatients = patients
    .filter(patient => patient.name && patient.name !== 'Unnamed Patient')
    .map(patient => ({
      ...patient,
      department: patient.department || patient.ward || patient.current_department || 'N/A',
      admissionDate: patient.registration_date || patient.createdAt || patient.created_at || 'N/A',
      status: patient.patient_status || patient.status || 'active',
      gender: patient.gender || 'N/A',
      age: patient.age != null ? patient.age : 'N/A',
    }))
    .sort((a, b) => {
      const dateA = new Date(a.admissionDate || 0);
      const dateB = new Date(b.admissionDate || 0);
      return dateB - dateA;
    })
    .slice(0, 10);

  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const lowStockItems = drugs.filter(drug => drug.quantityInStock <= drug.reorderLevel).length;
    const totalRevenue = (patientsCount || patientsList.length || patients.length || 0) * 500000;
    const occupancyRate = wardStats.occupiedBeds ? Math.round((wardStats.occupiedBeds / wardStats.totalBeds) * 100) : 0;

    setStats({
      totalPatients: patientsCount || patientsList.length || patients.length || 0,
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
  }, [patients, patientsList, patientsCount, drugs, staff, wardStats, alerts]);

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

  // Department CRUD Operations
  const loadDepartments = async () => {
    try {
      const data = await apiRequest('/api/v1/tenants/departments/');
      const results = Array.isArray(data) ? data : (data.results || []);
      setDepartments(results);
    } catch (error) {
      console.error('Failed to load departments:', error);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: deptForm.name,
        code: deptForm.code || deptForm.name.slice(0, 4).toUpperCase(),
        description: deptForm.description || '',
        is_clinical: deptForm.is_clinical,
      };
      const created = await apiRequest('/api/v1/tenants/departments/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setDepartments(prev => [...prev, created]);
      setDeptForm({ name: '', code: '', description: '', is_clinical: false });
      setShowAddDeptForm(false);
    } catch (error) {
      console.error('Failed to create department:', error);
      alert(error.message || 'Unable to create department');
    }
  };

  const handleEditDepartment = (dept) => {
    setEditingDept(dept);
    setEditDeptForm({
      id: dept.id,
      name: dept.name || '',
      code: dept.code || '',
      description: dept.description || '',
      is_clinical: dept.is_clinical || false,
    });
    setShowEditDeptForm(true);
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editDeptForm.name,
        code: editDeptForm.code || editDeptForm.name.slice(0, 4).toUpperCase(),
        description: editDeptForm.description || '',
        is_clinical: editDeptForm.is_clinical,
      };
      
      const updated = await apiRequest(`/api/v1/tenants/departments/${editDeptForm.id}/`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      
      setDepartments(prev => prev.map(dept => 
        dept.id === updated.id ? updated : dept
      ));
      
      setShowEditDeptForm(false);
      setEditingDept(null);
      setEditDeptForm({ id: null, name: '', code: '', description: '', is_clinical: false });
    } catch (error) {
      console.error('Failed to update department:', error);
      alert(error.message || 'Unable to update department');
    }
  };

  const handleDeleteDepartment = (id) => {
    const dept = departments.find(d => d.id === id);
    setDeptToDelete(dept);
    setShowDeleteModal(true);
  };

  const confirmDeleteDepartment = async () => {
    if (!deptToDelete) return;
    
    setIsDeleting(true);
    try {
      await apiRequest(`/api/v1/tenants/departments/${deptToDelete.id}/`, {
        method: 'DELETE',
      });
      
      setDepartments(prev => prev.filter(dept => dept.id !== deptToDelete.id));
      setShowDeleteModal(false);
      setDeptToDelete(null);
    } catch (error) {
      console.error('Failed to delete department:', error);
      alert(error.message || 'Unable to delete department');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { label: 'Active', color: 'bg-green-100 text-green-800' },
      'inactive': { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
      'archived': { label: 'Archived', color: 'bg-gray-100 text-gray-800' },
      'critical': { label: 'Critical', color: 'bg-red-100 text-red-800' },
      'stable': { label: 'Stable', color: 'bg-green-100 text-green-800' },
      'monitoring': { label: 'Monitoring', color: 'bg-blue-100 text-blue-800' },
      'admitted': { label: 'Admitted', color: 'bg-blue-100 text-blue-800' },
      'discharged': { label: 'Discharged', color: 'bg-green-100 text-green-800' },
    };
    return statusMap[status] || { label: status || 'Active', color: 'bg-green-100 text-green-800' };
  };

  // Patient Management Functions
  const normalizePatientForDisplay = (patient) => {
    return {
      id: patient.id,
      name: patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unnamed Patient',
      first_name: patient.first_name || '',
      last_name: patient.last_name || '',
      nin: patient.nin || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      tribe: patient.ethnicity || patient.tribe || '',
      country: patient.country || 'Nigeria',
      lga: patient.lga || '',
      state: patient.state || '',
      city: patient.city || '',
      dateOfBirth: patient.date_of_birth || '',
      bloodType: patient.blood_group || patient.bloodType || '',
      gender: patient.gender || '',
      maritalStatus: patient.marital_status || patient.maritalStatus || '',
      occupation: patient.occupation || '',
      emergencyContact: patient.next_of_kin_name || '',
      emergencyPhone: patient.next_of_kin_phone || '',
      religion: patient.religion || '',
      status: patient.patient_status || patient.status || 'active',
      createdAt: patient.registration_date || patient.createdAt || new Date().toISOString(),
      updatedAt: patient.updated_at || patient.updatedAt || new Date().toISOString(),
      hospital_number: patient.hospital_number || '',
      login_id: patient.login_id || '',
      age: patient.age || '',
      full_name: patient.full_name || '',
      age_display: patient.age_display || '',
      tenant_name: patient.tenant_name || '',
      nhis_number: patient.nhis_number || '',
      middle_name: patient.middle_name || '',
      phone2: patient.phone2 || '',
      next_of_kin_relationship: patient.next_of_kin_relationship || '',
      next_of_kin_address: patient.next_of_kin_address || '',
      known_allergies: patient.known_allergies || '',
      chronic_conditions: patient.chronic_conditions || '',
      current_medications: patient.current_medications || '',
      surgical_history: patient.surgical_history || '',
      family_history: patient.family_history || '',
      has_insurance: patient.has_insurance || false,
      insurance_company: patient.insurance_company || '',
      insurance_policy_number: patient.insurance_policy_number || '',
      insurance_expiry: patient.insurance_expiry || null,
      ethnicity: patient.ethnicity || '',
      language_spoken: patient.language_spoken || '',
      patient_status: patient.patient_status || 'active',
      photo: patient.photo || null,
      notes: patient.notes || '',
      registration_date: patient.registration_date || '',
      last_visit: patient.last_visit || null,
      registered_by: patient.registered_by || null,
      is_active: patient.is_active !== undefined ? patient.is_active : true,
      tenant: patient.tenant || null,
      genotype: patient.genotype || '',
    };
  };

  const loadPatients = async (url = '/api/v1/patients/patients/') => {
    try {
      setPatientsLoading(true);
      let data;
      let apiUrl = url;
      
      if (url.startsWith('http')) {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();
        apiUrl = url;
      } else {
        data = await apiRequest(url);
        apiUrl = url;
      }
      
      const results = Array.isArray(data) ? data : (data.results || []);
      const normalized = results.map(normalizePatientForDisplay);
      
      dispatch(setPatients(normalized));
      setPatientsList(normalized);
      setPatientsCount(data.count || normalized.length);
      setPatientsNextPage(data.next || null);
      setPatientsPreviousPage(data.previous || null);
    } catch (err) {
      console.error('Failed to load patients:', err);
      setPatientsList([]);
      setPatientsCount(0);
    } finally {
      setPatientsLoading(false);
    }
  };

  // Load patients when component mounts
  useEffect(() => {
    loadPatients('/api/v1/patients/patients/?status=all');
  }, []);

  // Refresh handler - refreshes current tab data
  const handleRefresh = () => {
    switch(activeTab) {
      case 'patients':
        loadPatients('/api/v1/patients/patients/?status=all');
        break;
      case 'departments':
        loadDepartments();
        break;
      case 'overview':
        loadPatients('/api/v1/patients/patients/?status=all');
        break;
      default:
        loadPatients('/api/v1/patients/patients/?status=all');
    }
  };

  const totalItems = patientsCount || patientsList.length;
  const totalPages = Math.ceil(totalItems / 20);
  const startIndex = patientsList.length > 0 ? (totalItems - patientsList.length + 1) : 0;
  const endIndex = startIndex + patientsList.length - 1;

  const getPatientCondition = (patient) => {
    if (patient.chronic_conditions) {
      const conditions = patient.chronic_conditions.split(',').map(c => c.trim());
      return conditions[0] || 'Under observation';
    }
    if (patient.notes) {
      const noteLines = patient.notes.split('\n').filter(line => line.trim());
      if (noteLines.length > 0) {
        return noteLines[0].substring(0, 30) + (noteLines[0].length > 30 ? '...' : '');
      }
    }
    if (patient.known_allergies) {
      return 'Allergy: ' + patient.known_allergies.split(',')[0].trim();
    }
    return 'Active patient';
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (formData) => {
    setEditSubmitting(true);
    try {
      const fullName = formData.name.trim().split(/\s+/);
      const firstName = fullName.shift() || '';
      const lastName = fullName.join(' ') || 'Unknown';

      const payload = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: formData.dateOfBirth || '1990-01-01',
        gender: formData.gender?.toLowerCase() || 'unknown',
        phone: formData.phone,
        email: formData.email || '',
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || 'Rivers',
        lga: formData.lga || '',
        country: formData.country || 'Nigeria',
        blood_group: formData.bloodType || 'unknown',
        marital_status: formData.maritalStatus?.toLowerCase() || 'single',
        religion: formData.religion || '',
        ethnicity: formData.tribe || '',
        occupation: formData.occupation || '',
        next_of_kin_name: formData.emergencyContact || '',
        next_of_kin_phone: formData.emergencyPhone || '',
        nin: formData.nin || '',
        patient_status: formData.patient_status || 'active',
        is_active: formData.patient_status === 'active',
        genotype: formData.genotype || '',
        has_insurance: formData.has_insurance || false,
        insurance_company: formData.insurance_company || '',
        insurance_policy_number: formData.insurance_policy_number || '',
        nhis_number: formData.nhis_number || '',
        known_allergies: formData.known_allergies || '',
        chronic_conditions: formData.chronic_conditions || '',
        current_medications: formData.current_medications || '',
        surgical_history: formData.surgical_history || '',
        family_history: formData.family_history || '',
        notes: formData.notes || '',
      };

      await apiRequest(`/api/v1/patients/patients/${editingPatient.id}/`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      
      // Refresh patient list
      await loadPatients('/api/v1/patients/patients/');
      
      setShowEditModal(false);
      setEditingPatient(null);
    } catch (err) {
      console.error('Failed to update patient:', err);
      alert(err.message || 'Failed to update patient');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleCreateAdmissionForPatient = (patient) => {
    const preselectedPatient = {
      patientId: patient.hospital_number || patient.hospitalNumber || patient.patient_id || patient.id,
      patientName: patient.name || patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
      name: patient.name || patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
      phone: patient.phone || patient.phone_number,
      email: patient.email,
      id: patient.id,
    };

    sessionStorage.setItem('admissionPrefillPatient', JSON.stringify(preselectedPatient));
    navigate('/admissions', {
      state: { preselectedPatient },
    });
  };

  const handleRestorePatient = async (patient) => {
    try {
      await apiRequest(`/api/v1/patients/patients/${patient.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ patient_status: 'active', is_active: true }),
      });
      await loadPatients('/api/v1/patients/patients/');
    } catch (err) {
      console.error('Failed to restore patient:', err);
      alert(err.message || 'Failed to restore patient');
    }
  };

  const handleClosePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

  const handleBulkUpload = async () => {
    if (!bulkUploadFile) return;
    setBulkUploading(true);
    setBulkUploadProgress({ status: 'uploading', message: 'Uploading file...' });
    setBulkUploadResult(null);
    try {
      const formData = new FormData();
      formData.append('file', bulkUploadFile);
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/patients/bulk-uploads/upload/`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });
      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');
        const data = isJson ? await response.json().catch(() => ({})) : await response.text();
        const message = (data && (data.detail || data.error || data.message || data.non_field_errors?.[0])) || `Upload failed with status ${response.status}`;
        throw new Error(message);
      }
      const upload = await response.json();
      setBulkUploadProgress({ status: 'processing', uploadId: upload.id, message: 'Processing in background...' });
      pollBulkUploadStatus(upload.id);
    } catch (err) {
      setBulkUploadProgress(null);
      setBulkUploadResult({ status: 'failed', message: err.message || 'Upload failed.' });
      setBulkUploading(false);
    }
  };

  const pollBulkUploadStatus = async (uploadId) => {
    const maxAttempts = 120;
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const data = await apiRequest(`/api/v1/patients/bulk-uploads/${uploadId}/`);
        const status = data.status;
        setBulkUploadProgress(prev => prev ? { ...prev, status, message: status === 'completed' ? 'Completed' : status === 'failed' ? 'Failed' : `Processing... ${data.processed_records || 0}/${data.total_records || 0}` } : null);
        if (status === 'completed' || status === 'failed') {
          clearInterval(interval);
          setBulkUploading(false);
          setBulkUploadResult({
            status,
            message: data.result_message || (status === 'completed' ? 'Bulk upload completed.' : 'Bulk upload failed.'),
            success_count: data.success_count,
            failure_count: data.failure_count,
            total_records: data.total_records,
            errors: data.errors,
          });
          if (status === 'completed') {
            loadPatients('/api/v1/patients/patients/');
          }
        }
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setBulkUploading(false);
          setBulkUploadProgress(null);
        }
      } catch {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setBulkUploading(false);
          setBulkUploadProgress(null);
        }
      }
    }, 2000);
    bulkUploadPollsRef.current[uploadId] = interval;
  };

  const resetBulkUpload = () => {
    setBulkUploadFile(null);
    setBulkUploading(false);
    setBulkUploadProgress(null);
    setBulkUploadResult(null);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
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
        {/* {alerts.filter(a => a.type === 'critical' && !a.read).length > 0 && (
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
        )} */}

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Patient Management</h2>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonWithTooltip
              tooltip="Add new patient"
              variant="primary"
              onClick={() => navigate('/patients/add')}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register Patient
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="Download CSV template with example data for bulk upload"
              variant="secondary"
              onClick={() => {
                const csvContent = `first_name,last_name,date_of_birth,gender,marital_status,phone,email,address,city,state,lga,country,blood_group,genotype,next_of_kin_name,next_of_kin_phone,next_of_kin_address
John,Smith,1985-03-12,male,single,08012345678,john@example.com,12 Main Street,Lagos,Lagos,Ikeja,Nigeria,O+,AA,Mary Smith,08087654321,45 Church Road
Jane,Doe,1990-07-25,female,married,09098765432,jane@example.com,34 Park Avenue,Abuja,FCT,Maitama,Nigeria,A-,AS,Richard Doe,08123456789,18 London Street
Chiwa,Okafor,1978-11-03,male,married,07034567890,chiwa@example.com,56 School Road,Enugu,Enugu,Enugu North,Nigeria,AB+,SS,Ngozi Okafor,09065432109,30 Market Square`;
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'patient_upload_template.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              Template
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="Bulk upload patients from CSV"
              variant="secondary"
              onClick={() => document.getElementById('admin-bulk-upload-input')?.click()}
            >
              {bulkUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              Bulk Upload
            </ButtonWithTooltip>
            <input
              id="admin-bulk-upload-input"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setBulkUploadFile(file);
                  handleBulkUpload();
                }
                e.target.value = '';
              }}
            />
            <ButtonWithTooltip
              tooltip="View all patients"
              variant="secondary"
              onClick={() => navigate('/patients')}
            >
              <Users className="w-3.5 h-3.5" />
              View All
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Bulk Upload Progress/Result */}
        {(bulkUploadProgress || bulkUploadResult) && (
          <div className={`mb-4 p-3 sm:p-4 rounded-lg border ${bulkUploadResult?.status === 'failed' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {bulkUploading ? (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                ) : bulkUploadResult?.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : bulkUploadResult?.status === 'failed' ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                )}
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {bulkUploadProgress?.message || bulkUploadResult?.message}
                </span>
              </div>
              {!bulkUploading && (
                <button
                  onClick={resetBulkUpload}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            {bulkUploadResult && (
              <div className="mt-2 text-xs sm:text-sm text-gray-700">
                <p>Total: {bulkUploadResult.total_records} | Success: {bulkUploadResult.success_count} | Failed: {bulkUploadResult.failure_count}</p>
                {bulkUploadResult.errors && bulkUploadResult.errors.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-700 font-medium">View errors ({bulkUploadResult.errors.length})</summary>
                    <div className="mt-1 max-h-40 overflow-y-auto bg-white rounded border border-red-100 p-2">
                      {bulkUploadResult.errors.map((err, idx) => (
                        <div key={idx} className="text-xs text-red-800 py-1 border-b border-red-50 last:border-0">
                          Row {err.row}: {err.error}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        )}

        {patientsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 text-sm mt-2">Loading patients...</p>
          </div>
        ) : patientsList.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No patients found</p>
            <p className="text-xs text-gray-400 mt-1">Start by registering your first patient</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Condition</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Visit</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patientsList.map((patient) => {
                  const status = getStatusBadge(patient.status);
                  return (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm flex-shrink-0">
                            {patient.name && patient.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">{patient.name || 'Unnamed Patient'}</span>
                            {patient.age && (
                              <span className="text-xs text-gray-500 ml-1">({patient.age}y)</span>
                            )}
                            {patient.hospital_number && (
                              <div className="text-[10px] text-gray-400">HN: {patient.hospital_number}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 hidden sm:table-cell">
                        <div className="text-xs text-gray-600">{patient.phone || 'No phone'}</div>
                        <div className="text-[10px] text-gray-400">{patient.email || 'No email'}</div>
                      </td>
                      <td className="py-3 hidden md:table-cell">
                        <span className="text-xs text-gray-600">{getPatientCondition(patient)}</span>
                        {patient.bloodType && (
                          <div className="text-[10px] text-gray-400">Blood: {patient.bloodType}</div>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-600">
                          {formatDate(patient.last_visit || patient.lastVisit || patient.registration_date)}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          <IconButton
                            icon={Eye}
                            onClick={() => handleViewPatient(patient)}
                            tooltip="View patient details"
                            variant="primary"
                            size="sm"
                          />
                          <IconButton
                            icon={Edit}
                            onClick={() => handleEditPatient(patient)}
                            tooltip="Edit patient"
                            variant="warning"
                            size="sm"
                          />
                          {patient.status !== 'active' && patient.patient_status !== 'active' ? (
                            <IconButton
                              icon={RotateCcw}
                              onClick={() => handleRestorePatient(patient)}
                              tooltip="Restore patient"
                              variant="success"
                              size="sm"
                            />
                          ) : null}
                          <button
                            type="button"
                            onClick={() => handleCreateAdmissionForPatient(patient)}
                            className="inline-flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700 hover:bg-green-100"
                          >
                            <Plus className="w-3 h-3" />
                            Admit
                          </button>
                          <IconButton
                            icon={FileText}
                            onClick={() => navigate(`/patients/${patient.id}/emr`)}
                            tooltip="View EMR"
                            variant="info"
                            size="sm"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 gap-2 sm:gap-0">
              <div className="text-[10px] sm:text-xs text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems}
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <IconButton
                  icon={ChevronLeft}
                  onClick={() => patientsPreviousPage && loadPatients(patientsPreviousPage)}
                  tooltip="Previous page"
                  variant="default"
                  disabled={!patientsPreviousPage || patientsLoading}
                  size="sm"
                />
                <span className="text-[10px] sm:text-xs text-gray-600">
                  Page {patientsList.length > 0 ? Math.ceil((totalItems - patientsList.length + 1) / 20) : 0} of {totalPages || 1}
                </span>
                <IconButton
                  icon={ChevronRight}
                  onClick={() => patientsNextPage && loadPatients(patientsNextPage)}
                  tooltip="Next page"
                  variant="default"
                  disabled={!patientsNextPage || patientsLoading}
                  size="sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Patient Detail Modal */}
        {showPatientModal && selectedPatient && (
          <PatientDetailModal 
            patient={selectedPatient} 
            onClose={handleClosePatientModal}
            onEdit={handleEditPatient}
            onAdmit={handleCreateAdmissionForPatient}
            onConsult={(patient) => window.open(`/patients/${patient.id}/consult`, '_blank')}
            onViewEMR={(patient) => window.open(`/patients/${patient.id}/emr`, '_blank')}
          />
        )}

        {/* Edit Patient Modal */}
        {showEditModal && editingPatient && (
          <EditPatientModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingPatient(null);
            }}
            patient={editingPatient}
            onSave={handleSaveEdit}
            isSubmitting={editSubmitting}
          />
        )}
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
                    <IconButton icon={Eye} tooltip="View bill" variant="primary" size="sm" />
                    <IconButton icon={Printer} tooltip="Print bill" variant="default" size="sm" />
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
                    <IconButton icon={Eye} tooltip="View bill" variant="primary" size="sm" />
                    <IconButton icon={Edit} tooltip="Edit bill" variant="primary" size="sm" />
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
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              onClick={() => setShowAddDeptForm(prev => !prev)}
              tooltip={showAddDeptForm ? 'Cancel' : 'Add new department'}
              variant="primary"
            >
              <Plus className="w-3.5 h-3.5" />
              {showAddDeptForm ? 'Cancel' : 'Add Department'}
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Add Department Form */}
        {showAddDeptForm && (
          <form onSubmit={handleAddDepartment} className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">New Department</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g. Cardiology"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Code</label>
                <input
                  type="text"
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. CARD"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  placeholder="Optional description"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  id="is_clinical"
                  type="checkbox"
                  checked={deptForm.is_clinical}
                  onChange={(e) => setDeptForm({ ...deptForm, is_clinical: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_clinical" className="text-xs font-medium text-gray-700">Clinical department</label>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <ButtonWithTooltip
                onClick={() => setShowAddDeptForm(false)}
                tooltip="Cancel"
                variant="secondary"
              >
                Cancel
              </ButtonWithTooltip>
              <ButtonWithTooltip
                type="submit"
                tooltip="Save department"
                variant="primary"
              >
                <Check className="w-3.5 h-3.5" />
                Save Department
              </ButtonWithTooltip>
            </div>
          </form>
        )}

        {/* Edit Department Form */}
        {showEditDeptForm && (
          <form onSubmit={handleUpdateDepartment} className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Edit Department</h3>
              <IconButton
                icon={X}
                onClick={() => {
                  setShowEditDeptForm(false);
                  setEditingDept(null);
                  setEditDeptForm({ id: null, name: '', code: '', description: '', is_clinical: false });
                }}
                tooltip="Close"
                variant="default"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  required
                  value={editDeptForm.name}
                  onChange={(e) => setEditDeptForm({ ...editDeptForm, name: e.target.value })}
                  placeholder="e.g. Cardiology"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Code</label>
                <input
                  type="text"
                  value={editDeptForm.code}
                  onChange={(e) => setEditDeptForm({ ...editDeptForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. CARD"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={editDeptForm.description}
                  onChange={(e) => setEditDeptForm({ ...editDeptForm, description: e.target.value })}
                  placeholder="Optional description"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  id="edit_is_clinical"
                  type="checkbox"
                  checked={editDeptForm.is_clinical}
                  onChange={(e) => setEditDeptForm({ ...editDeptForm, is_clinical: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="edit_is_clinical" className="text-xs font-medium text-gray-700">Clinical department</label>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <ButtonWithTooltip
                onClick={() => {
                  setShowEditDeptForm(false);
                  setEditingDept(null);
                  setEditDeptForm({ id: null, name: '', code: '', description: '', is_clinical: false });
                }}
                tooltip="Cancel"
                variant="secondary"
              >
                Cancel
              </ButtonWithTooltip>
              <ButtonWithTooltip
                type="submit"
                tooltip="Update department"
                variant="primary"
              >
                <Check className="w-3.5 h-3.5" />
                Update Department
              </ButtonWithTooltip>
            </div>
          </form>
        )}

        {/* Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{dept.name}</h4>
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${dept.is_clinical ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {dept.is_clinical ? 'Clinical' : 'Support'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Code</span>
                  <span className="font-medium">{dept.code || '—'}</span>
                </div>
                {dept.description && (
                  <p className="text-xs text-gray-500">{dept.description}</p>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end gap-1">
                <IconButton
                  icon={Edit}
                  onClick={() => handleEditDepartment(dept)}
                  tooltip="Edit department"
                  variant="primary"
                  size="sm"
                />
                <IconButton
                  icon={Trash2}
                  onClick={() => handleDeleteDepartment(dept.id)}
                  tooltip="Delete department"
                  variant="danger"
                  disabled={isDeleting}
                  size="sm"
                />
              </div>
            </div>
          ))}
          {departments.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 text-sm">
              No departments found. Add your first department above.
            </div>
          )}
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
                      size="sm"
                    />
                    <IconButton
                      icon={X}
                      onClick={() => handleDismissAlert(alert.id)}
                      tooltip="Dismiss alert"
                      variant="danger"
                      size="sm"
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
                        size="sm"
                      />
                    )}
                    <IconButton
                      icon={X}
                      onClick={() => handleDismissAlert(alert.id)}
                      tooltip="Dismiss alert"
                      variant="default"
                      size="sm"
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Welcome back, {displayUserName}
              </h1>
              <p className="text-sm text-gray-500">
                {displayTenantName} · {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              onClick={handleRefresh}
              tooltip="Refresh dashboard"
              variant="secondary"
            >
              <RefreshCw className={`w-4 h-4 ${patientsLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleOpenProfile}
              tooltip="My Profile"
              variant="secondary"
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

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        saving={passwordLoading}
        error={passwordError}
        success={passwordSuccess}
        onChange={handlePasswordChange}
        onSave={handleChangePassword}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeptToDelete(null);
        }}
        onConfirm={confirmDeleteDepartment}
        title="Delete Department"
        message={`Are you sure you want to delete the department "${deptToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Department"
        cancelText="Cancel"
        type="delete"
        patientData={deptToDelete ? {
          name: deptToDelete.name,
          role: deptToDelete.is_clinical ? 'Clinical Department' : 'Support Department',
          phone: deptToDelete.code || 'No code'
        } : null}
      />
    </div>
  );
};

export default AdminDashboard;