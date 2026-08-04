import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest, API_BASE_URL } from '../../utils/api';
import ChangePasswordModal from '../ChangePasswordModal';
import {
  Users,
  Calendar,
  FileText,
  Phone,
  RotateCcw,
  Ambulance,
  Clipboard,
  AlertCircle,
  Clock,
  TrendingUp,
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  CheckCircle,
  UserPlus,
  Bell,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Printer,
  Download,
  MessageSquare,
  UserCheck,
  FileCheck,
  Activity,
  Heart,
  Stethoscope,
  Pill,
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
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  AlertTriangle,
  Info,
  Menu,
  LogOut,
  UserCircle,
  IdCard,
  Droplets,
  Baby,
  MapPin,
  Building2,
  User as UserIcon,
  Upload,
  Loader2,
  MoreVertical,
  RefreshCw,
  Stethoscope as StethoscopeIcon,
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

// Patient Detail Modal Component
const PatientDetailModal = ({ patient, onClose }) => {
  if (!patient) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
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

  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === 'male') return <UserIcon className="w-4 h-4 text-blue-500" />;
    if (gender?.toLowerCase() === 'female') return <UserIcon className="w-4 h-4 text-pink-500" />;
    return <UserCircle className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold text-white border-2 border-white/30">
                  {getInitials(patient.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{patient.name}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-blue-100">
                    <span className="flex items-center gap-1">
                      {getGenderIcon(patient.gender)}
                      {patient.gender || 'Not specified'}
                    </span>
                    {patient.age && (
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {patient.age} years
                      </span>
                    )}
                    {patient.mrn && (
                      <span className="flex items-center gap-1">
                        <IdCard className="w-3.5 h-3.5" />
                        MRN: {patient.mrn}
                      </span>
                    )}
                    {patient.hospital_number && (
                      <span className="flex items-center gap-1">
                        <IdCard className="w-3.5 h-3.5" />
                        HN: {patient.hospital_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
                {patient.status || 'Active'}
              </span>
              {patient.bloodType && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  <Droplets className="w-3 h-3 mr-1" />
                  {patient.bloodType}
                </span>
              )}
              {patient.genotype && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  <Brain className="w-3 h-3 mr-1" />
                  Genotype: {patient.genotype}
                </span>
              )}
              {patient.has_insurance && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Insured
                </span>
              )}
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-blue-600" />
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Full Name</span>
                    <span className="font-medium text-gray-900">{patient.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date of Birth</span>
                    <span className="font-medium text-gray-900">{formatDate(patient.dateOfBirth)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Age</span>
                    <span className="font-medium text-gray-900">{patient.age || 'N/A'} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Gender</span>
                    <span className="font-medium text-gray-900">{patient.gender || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">NIN</span>
                    <span className="font-medium text-gray-900">{patient.nin || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Marital Status</span>
                    <span className="font-medium text-gray-900">{patient.maritalStatus || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Religion</span>
                    <span className="font-medium text-gray-900">{patient.religion || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ethnicity</span>
                    <span className="font-medium text-gray-900">{patient.tribe || patient.ethnicity || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Occupation</span>
                    <span className="font-medium text-gray-900">{patient.occupation || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-900">{patient.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-900">{patient.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium text-gray-900">{patient.address || 'N/A'}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                    Location
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Country</span>
                      <span className="font-medium text-gray-900">{patient.country || 'Nigeria'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">State</span>
                      <span className="font-medium text-gray-900">{patient.state || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">LGA</span>
                      <span className="font-medium text-gray-900">{patient.lga || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">City</span>
                      <span className="font-medium text-gray-900">{patient.city || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-red-600" />
                  Medical Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Blood Group</span>
                    <span className="font-medium text-gray-900">{patient.bloodType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Genotype</span>
                    <span className="font-medium text-gray-900">{patient.genotype || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Known Allergies</span>
                    <span className="font-medium text-gray-900">{patient.known_allergies || 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Chronic Conditions</span>
                    <span className="font-medium text-gray-900">{patient.chronic_conditions || 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Current Medications</span>
                    <span className="font-medium text-gray-900">{patient.current_medications || 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Surgical History</span>
                    <span className="font-medium text-gray-900">{patient.surgical_history || 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Family History</span>
                    <span className="font-medium text-gray-900">{patient.family_history || 'None'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-yellow-600" />
                  Emergency Contact
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Contact Name</span>
                    <span className="font-medium text-gray-900">{patient.emergencyContact || patient.next_of_kin_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Contact Phone</span>
                    <span className="font-medium text-gray-900">{patient.emergencyPhone || patient.next_of_kin_phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Relationship</span>
                    <span className="font-medium text-gray-900">{patient.next_of_kin_relationship || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium text-gray-900">{patient.next_of_kin_address || 'N/A'}</span>
                  </div>
                </div>
                {patient.has_insurance && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2">
                      <IdCard className="w-3.5 h-3.5 text-blue-600" />
                      Insurance Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Insurance Company</span>
                        <span className="font-medium text-gray-900">{patient.insurance_company || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Policy Number</span>
                        <span className="font-medium text-gray-900">{patient.insurance_policy_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">NHIS Number</span>
                        <span className="font-medium text-gray-900">{patient.nhis_number || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Hospital Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Hospital Number</span>
                    <span className="font-medium text-gray-900">{patient.hospital_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Login ID</span>
                    <span className="font-medium text-gray-900">{patient.login_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tenant/Hospital</span>
                    <span className="font-medium text-gray-900">{patient.tenant_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Registration Date</span>
                    <span className="font-medium text-gray-900">{formatDate(patient.registration_date || patient.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Visit</span>
                    <span className="font-medium text-gray-900">{formatDate(patient.last_visit)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Language Spoken</span>
                    <span className="font-medium text-gray-900">{patient.language_spoken || 'N/A'}</span>
                  </div>
                </div>
                {patient.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Notes</span>
                      <span className="font-medium text-gray-900 text-right max-w-[60%]">{patient.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex flex-wrap justify-end gap-2">
            <ButtonWithTooltip
              onClick={onClose}
              tooltip="Close patient details"
              variant="secondary"
            >
              <X className="w-3.5 h-3.5" />
              Close
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => window.open(`/patients/${patient.id}/consult`, '_blank')}
              tooltip="Start consultation"
              variant="primary"
            >
              <StethoscopeIcon className="w-3.5 h-3.5" />
              Consult
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => window.open(`/patients/${patient.id}/emr`, '_blank')}
              tooltip="View medical records"
              variant="success"
            >
              <FileText className="w-3.5 h-3.5" />
              View EMR
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => window.open(`/patients/edit/${patient.id}`, '_blank')}
              tooltip="Edit patient"
              variant="warning"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </ButtonWithTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReceptionistDashboard = () => {
  const { user: authUser, tenant: authTenant } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { appointments } = useSelector(state => state.appointment || { appointments: [] });

const displayTenantName = authTenant?.name || 'Hospital';
   const displayUserName = authUser?.full_name || [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.username || authUser?.email || 'User';
   const displayRole = authUser?.role || 'receptionist';

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

  // Patient Management State
  const [patientsList, setPatientsList] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [patientsNextPage, setPatientsNextPage] = useState(null);
  const [patientsPreviousPage, setPatientsPreviousPage] = useState(null);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);

  // Appointment State
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const itemsPerPage = 10;

  const [stats, setStats] = useState({
    todaysAppointments: 0,
    waitingPatients: 0,
    checkIns: 0,
    referrals: 0,
  });

  const [queue, setQueue] = useState([
    { id: 1, name: 'John Doe', type: 'Consultation', waitTime: '15 min', status: 'Waiting', priority: 'normal' },
    { id: 2, name: 'Jane Smith', type: 'Follow-up', waitTime: '8 min', status: 'In Room', priority: 'normal' },
    { id: 3, name: 'Bob Johnson', type: 'Emergency', waitTime: '2 min', status: 'Waiting', priority: 'high' }
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { id: 1, time: '14:00', patient: 'Alice Brown', type: 'Consultation', doctor: 'Dr. Smith', status: 'confirmed' },
    { id: 2, time: '14:30', patient: 'Charlie Wilson', type: 'Follow-up', doctor: 'Dr. Johnson', status: 'confirmed' },
    { id: 3, time: '15:00', patient: 'Diana Davis', type: 'New Patient', doctor: 'Dr. Smith', status: 'pending' }
  ]);

  const [communications, setCommunications] = useState([
    { id: 1, type: 'phone', message: 'Incoming call from Dr. Smith', time: '2 minutes ago', read: false },
    { id: 2, type: 'referral', message: 'Referral request received from General Hospital', time: '15 minutes ago', read: false },
    { id: 3, type: 'alert', message: 'Appointment reminder sent to 5 patients', time: '30 minutes ago', read: true }
  ]);

  const [recentCheckIns] = useState([
    { id: 1, patient: 'John Doe', time: '09:30', doctor: 'Dr. Smith', status: 'checked-in' },
    { id: 2, patient: 'Jane Smith', time: '09:45', doctor: 'Dr. Johnson', status: 'in-room' },
    { id: 3, patient: 'Bob Johnson', time: '10:00', doctor: 'Dr. Williams', status: 'completed' }
  ]);

  // Format time helper
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const normalizeAppointmentStatus = (status) => {
    const statusMap = {
      'scheduled': 'scheduled',
      'confirmed': 'scheduled',
      'checked_in': 'in-progress',
      'in_progress': 'in-progress',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'no_show': 'cancelled',
      'rescheduled': 'scheduled'
    };
    return statusMap[status] || status || 'scheduled';
  };

  // Load today's schedule
  useEffect(() => {
    const fetchTodaysSchedule = async () => {
      try {
        setScheduleLoading(true);
        setScheduleError(null);
        const data = await apiRequest('/api/v1/patients/appointments/');
        const results = Array.isArray(data) ? data : (data.results || []);
        const mapped = results.map(apt => ({
          id: apt.id,
          patientName: apt.patient_name || 'Unknown Patient',
          patientId: apt.patient || '',
          date: apt.scheduled_date || '',
          time: formatTime(apt.scheduled_time),
          timeRaw: apt.scheduled_time ? apt.scheduled_time.substring(0, 5) : '',
          reason: apt.reason || '',
          doctor: apt.doctor_name || '',
          doctorId: apt.doctor || '',
          status: normalizeAppointmentStatus(apt.status),
          notes: apt.notes || '',
          phone: apt.patient_phone || '',
          email: apt.patient_email || '',
          appointment_type: apt.appointment_type || 'consultation',
        }));
        setTodaysSchedule(mapped);
        // Update upcoming appointments with API data
        if (mapped.length > 0) {
          const formatted = mapped.map(apt => ({
            id: apt.id,
            time: apt.time,
            patient: apt.patientName,
            type: apt.appointment_type || 'Consultation',
            doctor: apt.doctor || 'Dr. Unknown',
            status: apt.status === 'scheduled' ? 'confirmed' : apt.status
          }));
          setUpcomingAppointments(formatted);
        }
      } catch (err) {
        setScheduleError(err.message || 'Failed to load schedule');
      } finally {
        setScheduleLoading(false);
      }
    };
    fetchTodaysSchedule();
  }, []);

  // Normalize patient for display
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
      mrn: patient.mrn || patient.mrn_number || patient.medical_record_number || '',
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

  // Load patients from API
  const loadPatients = async (url = '/api/v1/patients/patients/') => {
    try {
      setPatientsLoading(true);
      const data = await apiRequest(url);
      const results = Array.isArray(data) ? data : (data.results || []);
      const normalized = results.map(normalizePatientForDisplay);
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

  // Update stats when data changes
  useEffect(() => {
    setStats({
      todaysAppointments: upcomingAppointments.length,
      waitingPatients: queue.filter(q => q.status === 'Waiting').length,
      checkIns: recentCheckIns.length,
      referrals: communications.filter(c => c.type === 'referral').length,
    });
  }, [upcomingAppointments, queue, recentCheckIns, communications]);

  // Refresh handler
  const handleRefresh = () => {
    switch(activeTab) {
      case 'overview':
        loadPatients('/api/v1/patients/patients/');
        break;
      case 'queue':
        // Refresh queue logic
        break;
      case 'appointments':
        // Refresh appointments
        break;
      case 'checkins':
        // Refresh check-ins
        break;
      default:
        loadPatients('/api/v1/patients/patients/');
    }
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

        await apiRequest('/api/v1/tenants/users/me/', {
          method: 'PATCH',
          body: formData,
        });
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

  const handleQueueStatusChange = (id, newStatus) => {
    setQueue(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const handleRemoveFromQueue = (id) => {
    if (window.confirm('Remove this patient from the queue?')) {
      setQueue(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAppointmentStatusChange = (id, newStatus) => {
    setUpcomingAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  };

  const handleMarkCommunicationRead = (id) => {
    setCommunications(prev => prev.map(comm => 
      comm.id === id ? { ...comm, read: true } : comm
    ));
  };

  const handleDismissCommunication = (id) => {
    setCommunications(prev => prev.filter(comm => comm.id !== id));
  };

  const handleCheckInPatient = (patientId) => {
    alert(`Patient ${patientId} checked in successfully`);
  };

  const handleScheduleAppointment = () => {
    navigate('/appointments/new');
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
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

  const quickActions = [
    { icon: Users, label: 'Register Patient', action: '/patients', color: 'bg-blue-500' },
    { icon: Calendar, label: 'Schedule Appointment', action: '/appointments', color: 'bg-green-500' },
    { icon: FileText, label: 'Billing', action: '/billing', color: 'bg-purple-500' },
    { icon: Phone, label: 'Communications', action: '/communications', color: 'bg-orange-500' },
    { icon: Ambulance, label: 'Referrals', action: '/referrals', color: 'bg-red-500' },
    { icon: Clipboard, label: 'Queue Management', action: '/queue', color: 'bg-pink-500' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'queue', label: 'Queue', icon: Clipboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'checkins', label: 'Check-ins', icon: UserCheck },
    { id: 'patients', label: 'Patients', icon: Users },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'Waiting': { label: 'Waiting', color: 'bg-yellow-100 text-yellow-800' },
      'In Room': { label: 'In Room', color: 'bg-green-100 text-green-800' },
      'Completed': { label: 'Completed', color: 'bg-blue-100 text-blue-800' },
      'confirmed': { label: 'Confirmed', color: 'bg-green-100 text-green-800' },
      'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
      'checked-in': { label: 'Checked In', color: 'bg-blue-100 text-blue-800' },
      'in-room': { label: 'In Room', color: 'bg-green-100 text-green-800' },
      'scheduled': { label: 'Scheduled', color: 'bg-gray-100 text-gray-800' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
      'active': { label: 'Active', color: 'bg-green-100 text-green-800' },
      'inactive': { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
      'archived': { label: 'Archived', color: 'bg-gray-100 text-gray-800' },
      'critical': { label: 'Critical', color: 'bg-red-100 text-red-800' },
      'stable': { label: 'Stable', color: 'bg-green-100 text-green-800' },
      'monitoring': { label: 'Monitoring', color: 'bg-blue-100 text-blue-800' },
    };
    return statusMap[status] || { label: status || 'Active', color: 'bg-green-100 text-green-800' };
  };

  const totalItems = patientsCount || patientsList.length;
  const totalPages = Math.ceil(totalItems / 20);
  const startIndex = patientsList.length > 0 ? (totalItems - patientsList.length + 1) : 0;
  const endIndex = startIndex + patientsList.length - 1;

  // Render tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'queue':
        return renderQueueContent();
      case 'appointments':
        return renderAppointmentsContent();
      case 'checkins':
        return renderCheckInsContent();
      case 'patients':
        return renderPatientsContent();
      default:
        return renderOverviewContent();
    }
  };

  const renderOverviewContent = () => {
    return (
      <>
        {/* Key Metrics - Tooltips REMOVED */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Today's Appointments</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.todaysAppointments}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Waiting Patients</p>
                <p className="mt-1 text-2xl font-bold text-orange-600">{stats.waitingPatients}</p>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Check-ins Today</p>
                <p className="mt-1 text-2xl font-bold text-green-600">{stats.checkIns}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Referrals</p>
                <p className="mt-1 text-2xl font-bold text-purple-600">{stats.referrals}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Ambulance className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Tooltips REMOVED */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.action)}
                  className={`${action.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center justify-center h-16 sm:h-20`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                  <span className="text-[10px] sm:text-xs font-medium text-center">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Communications */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Communications</h2>
            <div className="flex items-center gap-2">
              <ButtonWithTooltip
                onClick={() => setCommunications(prev => prev.map(c => ({ ...c, read: true })))}
                tooltip="Mark all as read"
                variant="secondary"
                className="text-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Mark All Read
              </ButtonWithTooltip>
              <ButtonWithTooltip
                onClick={() => navigate('/communications')}
                tooltip="View all communications"
                variant="primary"
                className="text-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                View All
              </ButtonWithTooltip>
            </div>
          </div>
          <div className="space-y-2">
            {communications.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No communications</p>
              </div>
            ) : (
              communications.map((comm) => (
                <div key={comm.id} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${comm.read ? 'opacity-60' : ''}`}>
                  <div className="flex items-center flex-1">
                    {comm.type === 'phone' && <Phone className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />}
                    {comm.type === 'referral' && <Ambulance className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />}
                    {comm.type === 'alert' && <AlertCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{comm.message}</p>
                      <p className="text-xs text-gray-500">{comm.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!comm.read && (
                      <IconButton
                        icon={CheckCircle}
                        onClick={() => handleMarkCommunicationRead(comm.id)}
                        tooltip="Mark as read"
                        variant="success"
                      />
                    )}
                    <IconButton
                      icon={X}
                      onClick={() => handleDismissCommunication(comm.id)}
                      tooltip="Dismiss"
                      variant="default"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </>
    );
  };

  const renderQueueContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Current Queue</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Refresh queue"
              variant="secondary"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wait Time</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    <Clipboard className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    Queue is empty
                  </td>
                </tr>
              ) : (
                queue.map((item) => {
                  const status = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </td>
                      <td className="py-3 text-sm text-gray-600">{item.type}</td>
                      <td className="py-3 text-sm text-gray-600">{item.waitTime}</td>
                      <td className="py-3">
                        {item.priority === 'high' ? (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            High
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {item.status === 'Waiting' && (
                            <IconButton
                              icon={UserCheck}
                              onClick={() => handleQueueStatusChange(item.id, 'In Room')}
                              tooltip="Move to room"
                              variant="success"
                            />
                          )}
                          {item.status === 'In Room' && (
                            <IconButton
                              icon={CheckCircle}
                              onClick={() => handleQueueStatusChange(item.id, 'Completed')}
                              tooltip="Mark completed"
                              variant="primary"
                            />
                          )}
                          <IconButton
                            icon={Trash2}
                            onClick={() => handleRemoveFromQueue(item.id)}
                            tooltip="Remove from queue"
                            variant="danger"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAppointmentsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Upcoming Appointments</h2>
          <ButtonWithTooltip
            onClick={handleScheduleAppointment}
            tooltip="Schedule new appointment"
            variant="primary"
          >
            <Plus className="w-3.5 h-3.5" />
            New Appointment
          </ButtonWithTooltip>
        </div>

        {scheduleLoading ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2 animate-pulse" />
            <p className="text-gray-500 text-sm">Loading appointments...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcomingAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      No appointments scheduled
                    </td>
                  </tr>
                ) : (
                  upcomingAppointments.map((apt) => {
                    const status = getStatusBadge(apt.status);
                    return (
                      <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 text-sm font-medium text-gray-900">{apt.time}</td>
                        <td className="py-3 text-sm text-gray-600">{apt.patient}</td>
                        <td className="py-3 text-sm text-gray-600">{apt.type}</td>
                        <td className="py-3 text-sm text-gray-600">{apt.doctor}</td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <IconButton
                              icon={CheckCircle}
                              onClick={() => handleAppointmentStatusChange(apt.id, 'confirmed')}
                              tooltip="Confirm appointment"
                              variant="success"
                            />
                            <IconButton
                              icon={Edit}
                              onClick={() => navigate(`/appointments/${apt.id}/edit`)}
                              tooltip="Edit appointment"
                              variant="primary"
                            />
                            <IconButton
                              icon={Trash2}
                              onClick={() => {
                                if (window.confirm('Cancel this appointment?')) {
                                  handleAppointmentStatusChange(apt.id, 'cancelled');
                                }
                              }}
                              tooltip="Cancel appointment"
                              variant="danger"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderCheckInsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Recent Check-ins</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Export check-in data"
              variant="secondary"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="Check in new patient"
              variant="primary"
              onClick={() => navigate('/patients/check-in')}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Check In
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentCheckIns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    No check-ins today
                  </td>
                </tr>
              ) : (
                recentCheckIns.map((checkin) => {
                  const status = getStatusBadge(checkin.status);
                  return (
                    <tr key={checkin.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <span className="text-sm font-medium text-gray-900">{checkin.patient}</span>
                      </td>
                      <td className="py-3 text-sm text-gray-600">{checkin.time}</td>
                      <td className="py-3 text-sm text-gray-600">{checkin.doctor}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <IconButton
                            icon={Eye}
                            onClick={() => navigate(`/patients/${checkin.id}`)}
                            tooltip="View patient"
                            variant="primary"
                          />
                          <IconButton
                            icon={Stethoscope}
                            onClick={() => navigate(`/patients/${checkin.id}/consult`)}
                            tooltip="Start consultation"
                            variant="success"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPatientsContent = () => {
    if (patientsLoading) {
      return (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 text-sm mt-2">Loading patients...</p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Patient Management</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Register new patient"
              variant="primary"
              onClick={() => navigate('/patients/add')}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Register Patient
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="Refresh patient list"
              variant="secondary"
              onClick={handleRefresh}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${patientsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </ButtonWithTooltip>
          </div>
        </div>

        {patientsList.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No patients found</p>
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
                  const isInactive = (patient.patient_status || patient.status) !== 'active';
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
                            {(patient.mrn || patient.hospital_number) && (
                              <div className="text-[10px] text-gray-400">
                                {patient.mrn ? `MRN: ${patient.mrn}` : ''}
                                {patient.mrn && patient.hospital_number ? ' • ' : ''}
                                {patient.hospital_number ? `HN: ${patient.hospital_number}` : ''}
                              </div>
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
                          />
                          <button
                            type="button"
                            onClick={() => handleCreateAdmissionForPatient(patient)}
                            className="inline-flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-700 hover:bg-green-100"
                          >
                            <Plus className="w-3 h-3" />
                            Admit
                          </button>
                          <IconButton
                            icon={Edit}
                            onClick={() => navigate(`/patients/edit/${patient.id}`)}
                            tooltip="Edit patient"
                            variant="primary"
                          />
                          <IconButton
                            icon={FileText}
                            onClick={() => navigate(`/patients/${patient.id}/emr`)}
                            tooltip="View EMR"
                            variant="info"
                          />
                          {isInactive && (
                            <IconButton
                              icon={RotateCcw}
                              onClick={() => handleRestorePatient(patient)}
                              tooltip="Restore patient"
                              variant="success"
                            />
                          )}
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
          />
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
              onClick={handleRefresh}
              tooltip="Refresh dashboard"
              variant="secondary"
            >
              <RefreshCw className={`w-4 h-4 ${patientsLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="View notifications"
              variant="secondary"
              className="relative"
            >
              <Bell className="w-4 h-4" />
              {communications.filter(c => !c.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {communications.filter(c => !c.read).length}
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

      {/* Tabs - Tooltips KEPT */}
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

      {/* Patient Detail Modal */}
      {showPatientModal && selectedPatient && (
        <PatientDetailModal 
          patient={selectedPatient} 
          onClose={handleClosePatientModal} 
        />
      )}

      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        saving={passwordLoading}
        error={passwordError}
        success={passwordSuccess}
        onChange={handlePasswordChange}
        onSave={handleChangePassword}
      />
    </div>
  );
};

export default ReceptionistDashboard;