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
          <div className="bg-[#1A1A1A] text-white text-[10px] px-2 py-1 shadow-lg">
            {text}
            <div className={`absolute w-1.5 h-1.5 bg-[#1A1A1A] transform rotate-45 ${
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
    default: 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]',
    primary: 'text-[#008751] hover:text-[#006B40] hover:bg-[#E8F5EF]',
    success: 'text-[#2D7D46] hover:text-[#1E5F33] hover:bg-[#EAF3EE]',
    danger: 'text-[#C8553D] hover:text-[#A8442E] hover:bg-[#F5EDEA]',
    warning: 'text-[#C87D3D] hover:text-[#A8662E] hover:bg-[#F5F0EA]',
    info: 'text-[#008751] hover:text-[#006B40] hover:bg-[#E8F5EF]',
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
        className={`rounded transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
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
    primary: 'bg-[#008751] hover:bg-[#006B40] text-white',
    secondary: 'bg-white border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
    success: 'bg-[#2D7D46] hover:bg-[#1E5F33] text-white',
    danger: 'bg-[#C8553D] hover:bg-[#A8442E] text-white',
    warning: 'bg-[#C87D3D] hover:bg-[#A8662E] text-white',
    outline: 'border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
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
        className={`rounded transition-all duration-200 flex items-center gap-1.5 font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

// ==================== STATS CARD ====================
const StatsCard = ({ title, value, subValue, icon: Icon, color, trend, trendValue, tooltip, onClick, className = '' }) => {
  const trendColors = {
    up: 'text-[#2D7D46]',
    down: 'text-[#C8553D]',
    neutral: 'text-[#5A5A5A]'
  };

  const colorMap = {
    green: 'bg-[#008751]',
    gold: 'bg-[#FFC107]',
    terracotta: 'bg-[#C8553D]',
    warm: 'bg-[#C87D3D]',
    slate: 'bg-[#4A5A5A]',
  };

  return (
    <Tooltip text={tooltip}>
      <div 
        onClick={onClick}
        className={`bg-white border border-[#E8E3DC] p-5 ${onClick ? 'cursor-pointer hover:border-[#008751] transition-colors' : ''} ${className}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
            <p className="mt-1 text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">{value}</p>
            {subValue && (
              <p className="text-xs text-[#5A5A5A] mt-0.5">{subValue}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-1 text-xs ${trendColors[trend]} font-medium`}>
                {trend === 'up' && <ArrowUp className="w-3 h-3 mr-0.5" />}
                {trend === 'down' && <ArrowDown className="w-3 h-3 mr-0.5" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-10 h-10 ${colorMap[color]} rounded flex items-center justify-center flex-shrink-0 ml-3`}>
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
        className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300">
          <div className="border-b border-[#E8E3DC] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-[#1A1A1A]">My Profile</h2>
                <p className="text-sm text-[#5A5A5A] mt-0.5">View and update your personal information</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#E8E3DC] rounded transition-colors"
              >
                <X className="w-5 h-5 text-[#5A5A5A]" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {(error || success) && (
              <div className={`mb-4 p-3 text-sm whitespace-pre-line ${error ? 'bg-[#F5EDEA] text-[#C8553D] border border-[#E8D6D0]' : 'bg-[#EAF3EE] text-[#2D7D46] border border-[#D0E3D8]'}`}>
                {error || success}
              </div>
            )}

            {!loading && (
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#E8E3DC] border-2 border-[#D8D4CD] flex items-center justify-center overflow-hidden">
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
                      <UserIcon className="w-12 h-12 text-[#5A5A5A]" />
                    </div>
                  </div>
                </div>
                <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#D8D4CD] text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F5F2] transition-colors">
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
                    className="mt-1 text-xs text-[#C8553D] hover:text-[#A8442E]"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-[#008751] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-[#5A5A5A] text-sm mt-2">Loading profile...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">First Name *</label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => onChange('first_name', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => onChange('last_name', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Email *</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => onChange('email', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => onChange('phone', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={profileData.employee_id}
                      disabled
                      className="w-full px-3 py-2 text-sm bg-[#F0EDE8] border border-[#E8E3DC] text-[#5A5A5A] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Role</label>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="w-full px-3 py-2 text-sm bg-[#F0EDE8] border border-[#E8E3DC] text-[#5A5A5A] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Department</label>
                    <input
                      type="text"
                      value={profileData.department_name}
                      disabled
                      className="w-full px-3 py-2 text-sm bg-[#F0EDE8] border border-[#E8E3DC] text-[#5A5A5A] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Designation</label>
                    <input
                      type="text"
                      value={profileData.designation}
                      onChange={(e) => onChange('designation', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">License Number</label>
                    <input
                      type="text"
                      value={profileData.license_number}
                      onChange={(e) => onChange('license_number', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Specialization</label>
                    <select
                      value={profileData.specialization}
                      onChange={(e) => onChange('specialization', e.target.value)}
                      disabled={specializationsLoading}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors disabled:bg-[#F0EDE8] disabled:text-[#5A5A5A]"
                    >
                      <option value="">-- Select specialization --</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Qualification</label>
                  <textarea
                    value={profileData.qualification}
                    onChange={(e) => onChange('qualification', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#E8E3DC] p-4 flex flex-wrap justify-end gap-2 bg-white">
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
      'active': 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      'inactive': 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      'archived': 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      'critical': 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
      'stable': 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      'monitoring': 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]',
    };
    return statusMap[status?.toLowerCase()] || 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E3DC] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8F5EF] flex items-center justify-center text-[#008751] font-display font-semibold text-sm flex-shrink-0">
                {getInitials(patient.name)}
              </div>
              <div>
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">{patient.name}</h3>
                <div className="flex items-center gap-2 text-xs text-[#5A5A5A] flex-wrap">
                  {patient.mrn && <span>MRN: {patient.mrn}</span>}
                  {patient.hospital_number && <span>HN: {patient.hospital_number}</span>}
                  {patient.age && <span>• {patient.age}y</span>}
                  {patient.gender && <span>• {patient.gender}</span>}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-[#E8E3DC] transition-colors"
            >
              <X className="w-4 h-4 text-[#5A5A5A]" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="px-5 py-2.5 border-b border-[#E8E3DC] flex-shrink-0 flex items-center gap-2 flex-wrap">
            <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(patient.status)}`}>
              {patient.status || 'Active'}
            </span>
            {patient.bloodType && (
              <span className="inline-flex px-2.5 py-0.5 text-xs font-medium border border-[#E8D6D0] bg-[#F5EDEA] text-[#C8553D]">
                <Droplets className="w-3 h-3 mr-0.5" />
                {patient.bloodType}
              </span>
            )}
            {patient.has_insurance && (
              <span className="inline-flex px-2.5 py-0.5 text-xs font-medium border border-[#D0E3D8] bg-[#EAF3EE] text-[#2D7D46]">
                <Shield className="w-3 h-3 mr-0.5" />
                Insured
              </span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#E8E3DC] px-5 flex-shrink-0">
            {['personal', 'contact', 'medical'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#008751] text-[#008751]'
                    : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A]'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'personal' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 border border-[#E8E3DC]">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Full Name</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.name}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC]">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Gender</p>
                  <p className="font-medium text-[#1A1A1A] capitalize">{patient.gender || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC]">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Date of Birth</p>
                  <p className="font-medium text-[#1A1A1A]">
                    {formatDate(patient.dateOfBirth)}
                    {patient.age && ` (${patient.age}y)`}
                  </p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC]">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">NIN</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.nin || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC]">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Marital Status</p>
                  <p className="font-medium text-[#1A1A1A] capitalize">{patient.maritalStatus || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC]">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Religion</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.religion || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Ethnicity</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.tribe || patient.ethnicity || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Occupation</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.occupation || 'N/A'}</p>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Phone</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.phone || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Email</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.email || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Address</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.address || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC]">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">State</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.state || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC]">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">LGA</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.lga || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">City</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.city || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Emergency Contact</p>
                  <p className="font-medium text-[#1A1A1A]">
                    {patient.emergencyContact || patient.next_of_kin_name || 'N/A'}
                    {patient.emergencyPhone && ` (${patient.emergencyPhone})`}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 border border-[#E8E3DC]">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Blood Type</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.bloodType || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC]">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Genotype</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.genotype || 'N/A'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Known Allergies</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.known_allergies || 'None'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Chronic Conditions</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.chronic_conditions || 'None'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Current Medications</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.current_medications || 'None'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Surgical History</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.surgical_history || 'None'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Family History</p>
                  <p className="font-medium text-[#1A1A1A]">{patient.family_history || 'None'}</p>
                </div>
                <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                  <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Notes</p>
                  <p className="font-medium text-[#1A1A1A] whitespace-pre-line">{patient.notes || 'None'}</p>
                </div>
                {patient.has_insurance && (
                  <div className="bg-white p-3 border border-[#E8E3DC] col-span-2">
                    <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Insurance</p>
                    <p className="font-medium text-[#1A1A1A]">
                      {patient.insurance_company || 'N/A'}
                      {patient.insurance_policy_number && ` (${patient.insurance_policy_number})`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[#E8E3DC] flex-shrink-0 flex-wrap bg-white">
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
        className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-[#F7F5F2] w-full max-w-md transform transition-all duration-200 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E3DC] flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#F5F0EA] flex items-center justify-center">
                <Edit className="w-3.5 h-3.5 text-[#C87D3D]" />
              </div>
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Edit Patient</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[#E8E3DC] transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 text-[#5A5A5A]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">NIN</label>
                  <input
                    type="text"
                    name="nin"
                    value={formData.nin}
                    onChange={handleChange}
                    placeholder="National Identity Number"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">LGA</label>
                  <input
                    type="text"
                    name="lga"
                    value={formData.lga}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Blood Type</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
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
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Genotype</label>
                  <select
                    name="genotype"
                    value={formData.genotype}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
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
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
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
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Religion</label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Ethnicity / Tribe</label>
                  <input
                    type="text"
                    name="tribe"
                    value={formData.tribe}
                    onChange={handleChange}
                    placeholder="e.g. Hausa, Igbo, Yoruba"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Emergency Contact</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors mb-1"
                    disabled={isSubmitting}
                  />
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Known Allergies</label>
                  <input
                    type="text"
                    name="known_allergies"
                    value={formData.known_allergies}
                    onChange={handleChange}
                    placeholder="e.g. Penicillin, Latex"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Chronic Conditions</label>
                  <input
                    type="text"
                    name="chronic_conditions"
                    value={formData.chronic_conditions}
                    onChange={handleChange}
                    placeholder="e.g. Diabetes, Hypertension"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Current Medications</label>
                  <input
                    type="text"
                    name="current_medications"
                    value={formData.current_medications}
                    onChange={handleChange}
                    placeholder="e.g. Metformin 500mg"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Surgical History</label>
                  <input
                    type="text"
                    name="surgical_history"
                    value={formData.surgical_history}
                    onChange={handleChange}
                    placeholder="e.g. Appendectomy 2020"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Family History</label>
                  <input
                    type="text"
                    name="family_history"
                    value={formData.family_history}
                    onChange={handleChange}
                    placeholder="e.g. Diabetes (Mother)"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Insurance */}
              <div className="border-t border-[#E8E3DC] pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    id="has_insurance"
                    type="checkbox"
                    name="has_insurance"
                    checked={formData.has_insurance}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-[#D8D4CD] text-[#008751] focus:ring-0 focus:ring-offset-0"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="has_insurance" className="text-xs font-medium text-[#1A1A1A]">
                    Has Insurance
                  </label>
                </div>
                {formData.has_insurance && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Insurance Company</label>
                      <input
                        type="text"
                        name="insurance_company"
                        value={formData.insurance_company}
                        onChange={handleChange}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Policy Number</label>
                      <input
                        type="text"
                        name="insurance_policy_number"
                        value={formData.insurance_policy_number}
                        onChange={handleChange}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">NHIS Number</label>
                      <input
                        type="text"
                        name="nhis_number"
                        value={formData.nhis_number}
                        onChange={handleChange}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#E8E3DC]">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.patient_status === 'active'}
                    onChange={(e) => setFormData({ ...formData, patient_status: e.target.checked ? 'active' : 'inactive' })}
                    className="sr-only peer"
                    disabled={isSubmitting}
                  />
                  <div className="w-9 h-5 bg-[#E8E3DC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D8D4CD] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#008751]"></div>
                </label>
                <span className="text-xs text-[#1A1A1A]">
                  {formData.patient_status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-[#E8E3DC]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#008751] text-white py-1.5 px-3 hover:bg-[#006B40] transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
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
                  className="flex-1 bg-[#F0EDE8] text-[#1A1A1A] py-1.5 px-3 hover:bg-[#E8E3DC] transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
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
    totalBeds: 0,
    occupiedBeds: 0,
    todayAppointments: 0,
    pendingBills: 0
  });

  const [alerts, setAlerts] = useState([]);
  const [dashboardInsights, setDashboardInsights] = useState(null);
  const [dashboardInsightsLoading, setDashboardInsightsLoading] = useState(false);
  const [billingInvoices, setBillingInvoices] = useState([]);
  const [billingSummary, setBillingSummary] = useState(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [revenueTrendData, setRevenueTrendData] = useState([]);
  const [revenueTrendLoading, setRevenueTrendLoading] = useState(false);

  const [bedStats, setBedStats] = useState({ totalBeds: 0, occupiedBeds: 0, availableBeds: 0 });
  const [lowStockItems, setLowStockItems] = useState(0);
  const [revenueGrowthText, setRevenueGrowthText] = useState('No revenue yet');
  const [revenueGrowthTrend, setRevenueGrowthTrend] = useState('neutral');

  const [recentActivities, setRecentActivities] = useState([]);
  const [activityLogsLoading, setActivityLogsLoading] = useState(false);

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
    const totalRevenue = billingSummary?.total_revenue || billingSummary?.total_paid || 0;
    const total = bedStats.totalBeds || 0;
    const occupied = bedStats.occupiedBeds || 0;
    const occupancyRate = total ? Math.round((occupied / total) * 100) : 0;

    setStats({
      totalPatients: patientsCount || patientsList.length || patients.length || 0,
      totalRevenue: totalRevenue || 0,
      occupancyRate: occupancyRate || 0,
      criticalAlerts: alerts.filter(a => a.type === 'critical' && !a.read).length,
      staffCount: staff.length || 0,
      lowStockItems: lowStockItems,
      totalBeds: total,
      occupiedBeds: occupied,
      availableBeds: (bedStats.availableBeds || (total - occupied)) || 0,
      todayAppointments: dashboardInsights?.summary?.waiting_visits || dashboardInsights?.summary?.today_appointments || 0,
      pendingBills: billingSummary?.total_pending || 0
    });
  }, [patients, patientsList, patientsCount, drugs, staff, bedStats, alerts, billingSummary, lowStockItems, revenueGrowthText]);

  // Tab data
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  // Quick Actions with Nigerian brand colors
  const quickActions = [
    { icon: Users, label: 'Register Patient', action: '/patients', color: 'bg-[#008751]' },
    { icon: Calendar, label: 'Schedule Appointment', action: '/appointments', color: 'bg-[#006B40]' },
    { icon: FileText, label: 'Create Bill', action: '/billing', color: 'bg-[#004D2E]' },
    { icon: Pill, label: 'Check Inventory', action: '/inventory', color: 'bg-[#FFC107]' },
    { icon: Bed, label: 'Bed Status', action: '/bed-allocation', color: 'bg-[#C87D3D]' },
    { icon: Heart, label: 'Admissions', action: '/admissions', color: 'bg-[#C8553D]' },
    { icon: Building2, label: 'Staff Directory', action: '/staff', color: 'bg-[#008751]' },
    { icon: Settings, label: 'System Settings', action: '/settings', color: 'bg-[#5A5A5A]' },
  ];

  // Handlers
  const handleExportReport = () => {
    const csvRows = [
      'Metric,Value',
      `Total Patients,${stats.totalPatients}`,
      `Total Revenue,₦${stats.totalRevenue.toLocaleString()}`,
      `Bed Occupancy,${stats.occupancyRate}%`,
      `Staff Count,${stats.staffCount}`,
      `Low Stock Items,${stats.lowStockItems}`,
      `Total Beds,${stats.totalBeds}`,
      `Occupied Beds,${stats.occupiedBeds}`,
      `Today's Appointments,${stats.todayAppointments}`,
      `Pending Bills,₦${(stats.pendingBills || 0).toLocaleString()}`,
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  // Dashboard insights, alerts, and activity loading from API
  const loadDashboardInsights = async () => {
    setDashboardInsightsLoading(true);
    try {
      const data = await apiRequest('/api/v1/core/dashboard-insights/');
      setDashboardInsights(data || null);

      if (data?.alerts) {
        const normalizedAlerts = (Array.isArray(data.alerts) ? data.alerts : []).map(alert => ({
          id: alert.id || Math.random(),
          type: alert.type || (alert.priority === 'high' ? 'critical' : 'info'),
          message: alert.title || alert.message || '',
          time: alert.time || alert.priority || '',
          read: false,
        }));
        setAlerts(normalizedAlerts);
      }
    } catch (err) {
      console.error('Failed to load dashboard insights:', err);
    } finally {
      setDashboardInsightsLoading(false);
    }
  };

 const loadActivityLogs = async () => {
  setActivityLogsLoading(true);
  try {
    const data = await apiRequest('/api/v1/core/audit-logs/?limit=10');
    const results = Array.isArray(data) ? data : (data.results || []);
    const normalized = results.map(log => {
      const actionLabel = log.title || log.action || 'Activity';
      const actor = log.actor || 'Unknown user';
      const details = `${actor} ${log.action || 'performed an action'} — ${new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      return {
        id: log.id,
        type: log.severity === 'error' ? 'pharmacy' : log.severity === 'warning' ? 'bed' : log.severity === 'critical' ? 'pharmacy' : 'patient',
        message: actionLabel,
        details: details,
        icon: getActivityIcon(log.action || ''),
        color: getActivityColor(log.severity || 'info'),
      };
    });
    // 👇 Only keep the last 3 activities
    setRecentActivities(normalized.slice(0, 3));
  } catch (err) {
    console.error('Failed to load activity logs:', err);
  } finally {
    setActivityLogsLoading(false);
  }
};
  const getActivityIcon = (action) => {
    if (action.includes('patient')) return Users;
    if (action.includes('invoice') || action.includes('bill')) return FileText;
    if (action.includes('bed')) return Bed;
    if (action.includes('drug') || action.includes('prescription')) return Pill;
    return Activity;
  };

  const getActivityColor = (severity) => {
    if (severity === 'error') return 'terracotta';
    if (severity === 'warning') return 'warm';
    if (severity === 'critical') return 'terracotta';
    return 'green';
  };

  const loadBillingData = async () => {
    setBillingLoading(true);
    try {
      const [invoicesData, summaryData] = await Promise.all([
        apiRequest('/api/v1/billing/invoices/').catch(() => ({ results: [] })),
        apiRequest('/api/v1/billing/invoices/summary/').catch(() => null),
      ]);

      const invoices = Array.isArray(invoicesData) ? invoicesData : (invoicesData?.results || []);
      setBillingInvoices(invoices);
      setBillingSummary(summaryData || null);
    } catch (err) {
      console.error('Failed to load billing data:', err);
    } finally {
      setBillingLoading(false);
    }
  };

  const loadRevenueTrend = async () => {
    setRevenueTrendLoading(true);
    try {
      const data = await apiRequest('/api/v1/billing/invoices/?limit=100');
      const invoices = Array.isArray(data) ? data : (data.results || []);

      // Daily trend (last 7 days) for the chart
      const dailyMap = {};
      invoices.forEach(inv => {
        const date = (inv.invoice_date || inv.created_at || '').split('T')[0];
        if (date) {
          dailyMap[date] = (dailyMap[date] || 0) + (parseFloat(inv.total_amount || inv.amount || 0) || 0);
        }
      });
      const trend = Object.entries(dailyMap)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 7);
      setRevenueTrendData(trend);

      // Month-over-month growth for the Revenue stat card
      const now = new Date();
      const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      const prevMonthKey = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`;
      let currentMonthRevenue = 0;
      let previousMonthRevenue = 0;
      invoices.forEach(inv => {
        const key = (inv.invoice_date || inv.created_at || '').slice(0, 7);
        const amt = parseFloat(inv.total_amount || inv.amount || 0) || 0;
        if (key === currentMonthKey) currentMonthRevenue += amt;
        if (key === prevMonthKey) previousMonthRevenue += amt;
      });
      if (previousMonthRevenue > 0) {
        const growth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
        setRevenueGrowthText(`${growth >= 0 ? '+' : ''}${Math.round(growth)}% this month`);
        setRevenueGrowthTrend(growth >= 0 ? 'up' : 'down');
      } else if (currentMonthRevenue > 0) {
        setRevenueGrowthText('New this month');
        setRevenueGrowthTrend('up');
      } else {
        setRevenueGrowthText('No revenue yet');
        setRevenueGrowthTrend('neutral');
      }
    } catch (err) {
      console.error('Failed to load revenue trend:', err);
    } finally {
      setRevenueTrendLoading(false);
    }
  };

  const loadBedStats = async () => {
    try {
      const data = await apiRequest('/api/v1/ward-rounds/beds/');
      const beds = Array.isArray(data) ? data : (data.results || []);
      const totalBeds = beds.length;
      const occupiedBeds = beds.filter(b => String(b.status || '').toUpperCase() === 'OCCUPIED').length;
      const availableBeds = beds.filter(b => String(b.status || '').toUpperCase() === 'AVAILABLE').length;
      setBedStats({
        totalBeds,
        occupiedBeds,
        availableBeds: availableBeds || (totalBeds - occupiedBeds),
      });
    } catch (err) {
      console.error('Failed to load bed stats:', err);
    }
  };

  const loadLowStockAlerts = async () => {
    try {
      const data = await apiRequest('/api/v1/pharmacy/drugs/reorder_alerts/');
      const items = Array.isArray(data) ? data : (data.results || []);
      setLowStockItems(items.length);
    } catch (err) {
      console.error('Failed to load low stock alerts:', err);
      const low = (drugs || []).filter(drug => (drug.quantityInStock || 0) <= (drug.reorderLevel || 0)).length;
      setLowStockItems(low);
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
    loadDashboardInsights();
    loadActivityLogs();
    loadBillingData();
    loadRevenueTrend();
    loadBedStats();
    loadLowStockAlerts();
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
      'active': { label: 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
      'inactive': { label: 'Inactive', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
      'archived': { label: 'Archived', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
      'critical': { label: 'Critical', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
      'stable': { label: 'Stable', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
      'monitoring': { label: 'Monitoring', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
      'admitted': { label: 'Admitted', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
      'discharged': { label: 'Discharged', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    };
    return statusMap[status] || { label: status || 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' };
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

  const loadPatients = async (url = '/api/v1/patients/patients/') => {
    try {
      setPatientsLoading(true);
      let data;
      let apiUrl = url;
      
      data = await apiRequest(url);
      apiUrl = url;
      
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

  // Refresh handler - refreshes current tab data and dashboard API data
  const handleRefresh = () => {
    loadDashboardInsights();
    loadActivityLogs();
    loadBillingData();
    loadRevenueTrend();
    loadDepartments();
    loadBedStats();
    loadLowStockAlerts();
    switch(activeTab) {
      case 'patients':
        loadPatients('/api/v1/patients/patients/?status=all');
        break;
      case 'departments':
        loadDepartments();
        break;
      case 'overview':
      case 'billing':
      case 'alerts':
      default:
        loadPatients('/api/v1/patients/patients/?status=all');
        break;
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
      const upload = await apiRequest('/api/v1/patients/bulk-uploads/upload/', {
        method: 'POST',
        body: formData,
      });
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
    }, 10000);
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

  // ==================== RENDER OVERVIEW CONTENT ====================
  const renderOverviewContent = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Stats Grid — 2+2 layout with size variation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <StatsCard
              title="Registered Patients"
              value={stats.totalPatients.toLocaleString()}
              subValue={`${stats.todayAppointments} seen today`}
              icon={Users}
              color="green"
              trend="up"
              trendValue="+12% this month"
              tooltip="Total registered patients in the system"
              onClick={() => navigate('/patients')}
            />
            <StatsCard
              title="Bed Occupancy"
              value={`${stats.occupancyRate}%`}
              subValue={`${stats.occupiedBeds} of ${stats.totalBeds} occupied`}
              icon={Bed}
              color="gold"
              trend={stats.occupancyRate > 80 ? 'up' : 'neutral'}
              trendValue={stats.occupancyRate > 80 ? 'Nearing capacity' : 'Capacity available'}
              tooltip="Current bed occupancy rate"
              onClick={() => navigate('/bed-allocation')}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <StatsCard
              title="Revenue"
              value={stats.totalRevenue > 999999 ? `₦${(stats.totalRevenue / 1000000).toFixed(1)}M` : `₦${stats.totalRevenue.toLocaleString()}`}
              subValue={`₦${stats.totalRevenue.toLocaleString()} total`}
              icon={DollarSign}
              color="green"
              trend={revenueGrowthTrend}
              trendValue={revenueGrowthText}
              tooltip="Total revenue generated"
              onClick={() => navigate('/billing')}
            />
            <StatsCard
              title="Critical Alerts"
              value={stats.criticalAlerts}
              subValue={`${stats.lowStockItems} low stock items`}
              icon={AlertCircle}
              color="terracotta"
              trend={stats.criticalAlerts > 0 ? 'up' : 'neutral'}
              trendValue={stats.criticalAlerts > 0 ? 'Requires attention' : 'All clear'}
              tooltip="Alerts requiring immediate attention"
              onClick={() => setActiveTab('alerts')}
            />
          </div>
        </div>

        {/* Waveform divider — signature motif (Nigerian green) */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-[#D8D4CD]"></div>
          <svg width="40" height="12" viewBox="0 0 40 12" className="text-[#008751]">
            <path d="M2 6 L8 6 L10 2 L14 10 L18 4 L22 10 L26 4 L30 8 L32 6 L38 6" 
                  stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="h-px flex-1 bg-[#D8D4CD]"></div>
        </div>

        {/* Quick Actions — using Nigerian brand colors */}
        <div>
          <h2 className="text-sm font-display font-semibold text-[#1A1A1A] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {quickActions.slice(0, 4).map((action, index) => {
              const Icon = action.icon;
              return (
                <Tooltip key={index} text={`Go to ${action.label}`}>
                  <button
                    onClick={() => navigate(action.action)}
                    className={`${action.color} text-white p-3 sm:p-4 text-left transition-opacity hover:opacity-85 flex flex-col items-start`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                </Tooltip>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-2 sm:mt-3">
            {quickActions.slice(4).map((action, index) => {
              const Icon = action.icon;
              return (
                <Tooltip key={index} text={`Go to ${action.label}`}>
                  <button
                    onClick={() => navigate(action.action)}
                    className={`${action.color} text-white p-3 sm:p-4 text-left transition-opacity hover:opacity-85 flex flex-col items-start`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Charts & Activity — asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#E8E3DC] p-3 sm:p-5">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Revenue Trend</h3>
                <div className="flex items-center gap-1 sm:gap-2">
                  <ButtonWithTooltip
                    onClick={() => setShowDateRangePicker(!showDateRangePicker)}
                    tooltip="Change date range"
                    variant="secondary"
                    className="text-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{dateRange.start} — {dateRange.end}</span>
                  </ButtonWithTooltip>
                  <IconButton
                    icon={RefreshCw}
                    onClick={loadRevenueTrend}
                    tooltip="Refresh data"
                    variant="default"
                  />
                </div>
              </div>
              {revenueTrendLoading ? (
                <div className="h-40 sm:h-48 flex items-center justify-center text-[#5A5A5A] bg-[#F7F5F2] border border-[#E8E3DC]">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-[#008751] animate-spin mx-auto mb-2" />
                    <p className="text-xs">Loading revenue data...</p>
                  </div>
                </div>
              ) : revenueTrendData.length > 0 ? (
                <div className="h-40 sm:h-48 flex items-end justify-between gap-1 border-b border-[#E8E3DC] pb-1 overflow-x-auto">
                  {revenueTrendData.map((item, idx) => {
                    const maxAmount = Math.max(...revenueTrendData.map(d => d.amount), 1);
                    const barHeight = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                    return (
                      <div key={idx} className="flex flex-col items-center flex-shrink-0">
                        <span className="text-[8px] text-[#5A5A5A] mb-1">
                          ₦{(item.amount / 1000000).toFixed(1)}M
                        </span>
                        <div
                          className="w-8 sm:w-10 bg-[#008751] hover:bg-[#006B40] transition-colors min-h-[2px]"
                          style={{ height: `${Math.max(barHeight, 4)}%` }}
                          title={`${new Date(item.date).toLocaleDateString('en-GB')} - ₦${item.amount.toLocaleString()}`}
                        />
                        <span className="text-[8px] text-[#B0A89E] mt-1">
                          {new Date(item.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-40 sm:h-48 flex items-center justify-center text-[#5A5A5A] bg-[#F7F5F2] border border-[#E8E3DC]">
                  <div className="text-center">
                    <BarChart3 className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
                    <p className="text-sm">No revenue data available</p>
                    <p className="text-xs text-[#B0A89E]">Data will appear once invoices are generated</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E8E3DC] p-3 sm:p-5 h-full">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Key Metrics</h3>
                <ButtonWithTooltip
                  onClick={handleExportReport}
                  tooltip="Export report"
                  variant="secondary"
                  className="text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </ButtonWithTooltip>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-[#F0EDE8]">
                  <span className="text-xs text-[#5A5A5A]">Staff on duty</span>
                  <span className="text-sm font-display font-semibold text-[#1A1A1A]">{stats.staffCount}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F0EDE8]">
                  <span className="text-xs text-[#5A5A5A]">Pending bills</span>
                  <span className="text-sm font-display font-semibold text-[#C87D3D]">{stats.pendingBills}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#F0EDE8]">
                  <span className="text-xs text-[#5A5A5A]">Low stock items</span>
                  <span className="text-sm font-display font-semibold text-[#C8553D]">{stats.lowStockItems}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-[#5A5A5A]">Departments</span>
                  <span className="text-sm font-display font-semibold text-[#1A1A1A]">{departments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-[#E8E3DC] p-3 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Recent Activity</h2>
            <ButtonWithTooltip
              onClick={() => navigate('/activity-log')}
              tooltip="View all activity"
              variant="secondary"
              className="text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View All</span>
            </ButtonWithTooltip>
          </div>
          {activityLogsLoading ? (
            <div className="text-center py-6">
              <Loader2 className="w-6 h-6 text-[#008751] animate-spin mx-auto mb-2" />
              <p className="text-xs text-[#5A5A5A]">Loading activity...</p>
            </div>
          ) : (
          <div className="space-y-2">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              const colorMap = {
                green: 'text-[#008751] bg-[#E8F5EF]',
                gold: 'text-[#FFC107] bg-[#FFF8E1]',
                warm: 'text-[#C87D3D] bg-[#F5F0EA]',
                terracotta: 'text-[#C8553D] bg-[#F5EDEA]'
              };
              return (
                <div key={activity.id} className="flex items-center p-3 bg-[#F7F5F2] hover:bg-[#F0EDE8] transition-colors border border-[#F0EDE8] gap-3">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 ${colorMap[activity.color] || colorMap.green} flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A]">{activity.message}</p>
                    <p className="text-xs text-[#5A5A5A] truncate">{activity.details}</p>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>
    );
  };

  // ==================== RENDER PATIENTS CONTENT ====================
  const renderPatientsContent = () => {
    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
          <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Patient Management</h2>
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
            {/* <ButtonWithTooltip
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
            </ButtonWithTooltip> */}
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

        {/* Bulk Upload Progress/Result — using Nigerian green accent */}
        {(bulkUploadProgress || bulkUploadResult) && (
          <div className={`mb-4 p-4 border ${bulkUploadResult?.status === 'failed' ? 'bg-[#F5EDEA] border-[#E8D6D0]' : 'bg-[#E8F5EF] border-[#C8E0D5]'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {bulkUploading ? (
                  <Loader2 className="w-5 h-5 text-[#008751] animate-spin" />
                ) : bulkUploadResult?.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-[#2D7D46]" />
                ) : bulkUploadResult?.status === 'failed' ? (
                  <AlertTriangle className="w-5 h-5 text-[#C8553D]" />
                ) : (
                  <Loader2 className="w-5 h-5 text-[#008751] animate-spin" />
                )}
                <span className="text-xs sm:text-sm font-medium text-[#1A1A1A]">
                  {bulkUploadProgress?.message || bulkUploadResult?.message}
                </span>
              </div>
              {!bulkUploading && (
                <button
                  onClick={resetBulkUpload}
                  className="p-1 hover:bg-[#E8E3DC] rounded"
                >
                  <X className="w-4 h-4 text-[#5A5A5A]" />
                </button>
              )}
            </div>
            {bulkUploadResult && (
              <div className="mt-2 text-xs sm:text-sm text-[#1A1A1A]">
                <p>Total: {bulkUploadResult.total_records} | Success: {bulkUploadResult.success_count} | Failed: {bulkUploadResult.failure_count}</p>
                {bulkUploadResult.errors && bulkUploadResult.errors.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-[#C8553D] font-medium">View errors ({bulkUploadResult.errors.length})</summary>
                    <div className="mt-1 max-h-40 overflow-y-auto bg-white border border-[#E8D6D0] p-2">
                      {bulkUploadResult.errors.map((err, idx) => (
                        <div key={idx} className="text-xs text-[#C8553D] py-1 border-b border-[#F0EDE8] last:border-0">
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
            <div className="w-8 h-8 border-2 border-[#008751] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#5A5A5A] text-sm mt-2">Loading patients...</p>
          </div>
        ) : patientsList.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-[#5A5A5A] text-sm">No patients found</p>
            <p className="text-xs text-[#B0A89E] mt-1">Start by registering your first patient</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E3DC]">
                  <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Name</th>
                  <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Condition</th>
                  <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                  <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Last Visit</th>
                  <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {patientsList.map((patient) => {
                  const status = getStatusBadge(patient.status);
                  return (
                    <tr key={patient.id} className="hover:bg-[#F7F5F2] transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#E8F5EF] flex items-center justify-center text-[#008751] font-display font-medium text-sm flex-shrink-0">
                            {patient.name && patient.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-[#1A1A1A]">{patient.name || 'Unnamed Patient'}</span>
                            {patient.age && (
                              <span className="text-xs text-[#5A5A5A] ml-1">({patient.age}y)</span>
                            )}
                            {(patient.mrn || patient.hospital_number) && (
                              <div className="text-[10px] text-[#B0A89E]">
                                {patient.mrn ? `MRN: ${patient.mrn}` : ''}
                                {patient.mrn && patient.hospital_number ? ' • ' : ''}
                                {patient.hospital_number ? `HN: ${patient.hospital_number}` : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 hidden sm:table-cell">
                        <div className="text-xs text-[#5A5A5A]">{patient.phone || 'No phone'}</div>
                        <div className="text-[10px] text-[#B0A89E]">{patient.email || 'No email'}</div>
                      </td>
                      <td className="py-3 hidden md:table-cell">
                        <span className="text-xs text-[#5A5A5A]">{getPatientCondition(patient)}</span>
                        {patient.bloodType && (
                          <div className="text-[10px] text-[#B0A89E]">Blood: {patient.bloodType}</div>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 hidden lg:table-cell">
                        <span className="text-xs text-[#5A5A5A]">
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
                            className="inline-flex items-center gap-1 border border-[#D0E3D8] bg-[#EAF3EE] px-2 py-1 text-[10px] font-medium text-[#2D7D46] hover:bg-[#D0E3D8]"
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
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#E8E3DC] gap-2 sm:gap-0">
              <div className="text-[10px] sm:text-xs text-[#5A5A5A]">
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
                <span className="text-[10px] sm:text-xs text-[#5A5A5A]">
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

   // ==================== RENDER BILLING CONTENT ====================
  const renderBillingContent = () => {
    const getInvoiceStatusBadge = (status) => {
      const statusMap = {
        'paid': { label: 'Paid', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
        'partially_paid': { label: 'Partial', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
        'pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
        'overdue': { label: 'Overdue', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
        'cancelled': { label: 'Cancelled', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
        'issued': { label: 'Issued', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
      };
      return statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };
    };

    const todayTransactions = billingInvoices
      .filter(inv => {
        const invDate = (inv.invoice_date || inv.created_at || '').split('T')[0];
        return invDate === new Date().toISOString().split('T')[0];
      })
      .reduce((sum, inv) => sum + parseFloat(inv.total_amount || inv.amount || 0), 0);

    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Billing Overview</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => navigate('/billing/create')}
              tooltip="Create new bill"
              variant="primary"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create Bill</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleExportReport}
              tooltip="Export billing report"
              variant="secondary"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3 sm:p-4">
            <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">Total Revenue</p>
            <p className="text-lg sm:text-xl font-display font-bold text-[#1A1A1A]">
              ₦{(billingSummary?.total_revenue || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3 sm:p-4">
            <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">Pending Bills</p>
            <p className="text-lg sm:text-xl font-display font-bold text-[#C87D3D]">
              {billingSummary?.total_invoices || 0}
            </p>
            <p className="text-xs text-[#5A5A5A] mt-0.5">₦{(billingSummary?.total_pending || 0).toLocaleString()} due</p>
          </div>
          <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3 sm:p-4">
            <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">Today's Transactions</p>
            <p className="text-lg sm:text-xl font-display font-bold text-[#2D7D46]">
              ₦{todayTransactions.toLocaleString()}
            </p>
            <p className="text-xs text-[#5A5A5A] mt-0.5">{billingSummary?.collection_rate || 0}% collection rate</p>
          </div>
        </div>

        {billingLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-[#008751] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#5A5A5A] text-sm mt-2">Loading billing data...</p>
          </div>
        ) : billingInvoices.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-[#5A5A5A] text-sm">No billing records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E3DC]">
                  <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                  <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Amount</th>
                  <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                  <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {billingInvoices.map((invoice) => {
                  const status = getInvoiceStatusBadge(invoice.status);
                  const patientName = invoice.patient_name || invoice.patient?.full_name || invoice.patient_name || 'Unknown';
                  return (
                    <tr key={invoice.id} className="hover:bg-[#F7F5F2] transition-colors">
                      <td className="py-3">
                        <div className="flex flex-col min-[480px]:flex-row 480px:items-center gap-1">
                          <span className="text-sm font-medium text-[#1A1A1A]">{patientName}</span>
                          <span className="text-xs text-[#5A5A5A] min-[480px]:ml-1 min-[480px]:hidden sm:table-cell">
                            {invoice.invoice_number || ''}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-[#5A5A5A] hidden sm:table-cell">
                        ₦{parseFloat(invoice.total_amount || invoice.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 text-sm text-[#5A5A5A] hidden md:table-cell">
                        {formatDate(invoice.invoice_date || invoice.created_at || '')}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          <IconButton icon={Eye} onClick={() => navigate('/billing')} tooltip="View bill" variant="primary" size="sm" />
                          <IconButton icon={Printer} tooltip="Print bill" variant="default" size="sm" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // ==================== RENDER DEPARTMENTS CONTENT ====================
const renderDepartmentsContent = () => {
  return (
    <div>
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-display font-semibold text-[#1A1A1A]">Department Management</h2>
          <p className="text-xs text-[#5A5A5A] mt-0.5">Organize and manage your hospital departments</p>
        </div>
        <div className="flex items-center gap-2">
          <ButtonWithTooltip
            onClick={() => setShowAddDeptForm(prev => !prev)}
            tooltip={showAddDeptForm ? 'Cancel' : 'Add new department'}
            variant="primary"
          >
            {showAddDeptForm ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            {showAddDeptForm ? 'Cancel' : 'Add Department'}
          </ButtonWithTooltip>
        </div>
      </div>

      {/* Add Department Form - Professional Card Style */}
      {showAddDeptForm && (
        <div className="mb-6 bg-gradient-to-br from-white to-[#F7F5F2] border border-[#E8E3DC] rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-[#008751] bg-opacity-5 border-b border-[#E8E3DC]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#008751] rounded">
                <Plus className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Create New Department</h3>
            </div>
          </div>
          
          <form onSubmit={handleAddDepartment} className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#5A5A5A]">
                  Department Name <span className="text-[#C8553D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  placeholder="e.g. Cardiology, Pediatrics, Surgery"
                  className="w-full border border-[#D8D4CD] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0A89E] focus:border-[#008751] focus:outline-none focus:ring-2 focus:ring-[#008751]/20 transition-all duration-200"
                />
                <p className="mt-1 text-[10px] text-[#B0A89E]">Choose a clear, descriptive name for the department</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#5A5A5A]">Department Code</label>
                <input
                  type="text"
                  value={deptForm.code}
                  onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. CARD, PED, SURG"
                  className="w-full border border-[#D8D4CD] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0A89E] uppercase focus:border-[#008751] focus:outline-none focus:ring-2 focus:ring-[#008751]/20 transition-all duration-200"
                />
                <p className="mt-1 text-[10px] text-[#B0A89E]">Short, unique identifier (auto-generated if left blank)</p>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-[#5A5A5A]">Description</label>
                <input
                  type="text"
                  value={deptForm.description}
                  onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                  placeholder="Brief description of the department's role and responsibilities"
                  className="w-full border border-[#D8D4CD] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0A89E] focus:border-[#008751] focus:outline-none focus:ring-2 focus:ring-[#008751]/20 transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-3 pt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="is_clinical"
                    type="checkbox"
                    checked={deptForm.is_clinical}
                    onChange={(e) => setDeptForm({ ...deptForm, is_clinical: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#E8E3DC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D8D4CD] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#008751]"></div>
                  <span className="ml-3 text-xs font-medium text-[#1A1A1A]">
                    {deptForm.is_clinical ? 'Clinical Department' : 'Non-Clinical / Support Department'}
                  </span>
                </label>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-[#F0EDE8] flex flex-wrap justify-end gap-2">
              <ButtonWithTooltip
                type="button"
                onClick={() => setShowAddDeptForm(false)}
                tooltip="Cancel department creation"
                variant="secondary"
                size="sm"
              >
                Cancel
              </ButtonWithTooltip>
              <ButtonWithTooltip
                type="submit"
                tooltip="Create new department"
                variant="primary"
                size="sm"
              >
                <Check className="w-3.5 h-3.5" />
                Create Department
              </ButtonWithTooltip>
            </div>
          </form>
        </div>
      )}

      {/* Edit Department Form - Professional Card Style */}
      {showEditDeptForm && (
        <div className="mb-6 bg-gradient-to-br from-white to-[#E8F5EF] border border-[#C8E0D5] rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-[#008751] bg-opacity-10 border-b border-[#C8E0D5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#008751] rounded">
                  <Edit className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Edit Department</h3>
              </div>
              <IconButton
                icon={X}
                onClick={() => {
                  setShowEditDeptForm(false);
                  setEditingDept(null);
                  setEditDeptForm({ id: null, name: '', code: '', description: '', is_clinical: false });
                }}
                tooltip="Close"
                variant="default"
                size="sm"
              />
            </div>
          </div>
          
          <form onSubmit={handleUpdateDepartment} className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#5A5A5A]">
                  Department Name <span className="text-[#C8553D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editDeptForm.name}
                  onChange={(e) => setEditDeptForm({ ...editDeptForm, name: e.target.value })}
                  placeholder="e.g. Cardiology, Pediatrics, Surgery"
                  className="w-full border border-[#D8D4CD] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0A89E] focus:border-[#008751] focus:outline-none focus:ring-2 focus:ring-[#008751]/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#5A5A5A]">Department Code</label>
                <input
                  type="text"
                  value={editDeptForm.code}
                  onChange={(e) => setEditDeptForm({ ...editDeptForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. CARD, PED, SURG"
                  className="w-full border border-[#D8D4CD] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0A89E] uppercase focus:border-[#008751] focus:outline-none focus:ring-2 focus:ring-[#008751]/20 transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-[#5A5A5A]">Description</label>
                <input
                  type="text"
                  value={editDeptForm.description}
                  onChange={(e) => setEditDeptForm({ ...editDeptForm, description: e.target.value })}
                  placeholder="Brief description of the department's role and responsibilities"
                  className="w-full border border-[#D8D4CD] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#B0A89E] focus:border-[#008751] focus:outline-none focus:ring-2 focus:ring-[#008751]/20 transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-3 pt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="edit_is_clinical"
                    type="checkbox"
                    checked={editDeptForm.is_clinical}
                    onChange={(e) => setEditDeptForm({ ...editDeptForm, is_clinical: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#E8E3DC] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D8D4CD] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#008751]"></div>
                  <span className="ml-3 text-xs font-medium text-[#1A1A1A]">
                    {editDeptForm.is_clinical ? 'Clinical Department' : 'Non-Clinical / Support Department'}
                  </span>
                </label>
              </div>
            </div>
            
            <div className="mt-5 pt-4 border-t border-[#F0EDE8] flex flex-wrap justify-end gap-2">
              <ButtonWithTooltip
                type="button"
                onClick={() => {
                  setShowEditDeptForm(false);
                  setEditingDept(null);
                  setEditDeptForm({ id: null, name: '', code: '', description: '', is_clinical: false });
                }}
                tooltip="Cancel changes"
                variant="secondary"
                size="sm"
              >
                Cancel
              </ButtonWithTooltip>
              <ButtonWithTooltip
                type="submit"
                tooltip="Update department"
                variant="primary"
                size="sm"
              >
                <Check className="w-3.5 h-3.5" />
                Update Department
              </ButtonWithTooltip>
            </div>
          </form>
        </div>
      )}

      {/* Department Stats Bar */}
      {departments.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-[#F7F5F2] border border-[#E8E3DC] rounded-lg p-3 text-center">
            <p className="text-xl font-display font-bold text-[#1A1A1A]">{departments.length}</p>
            <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">Total</p>
          </div>
          <div className="bg-[#E8F5EF] border border-[#C8E0D5] rounded-lg p-3 text-center">
            <p className="text-xl font-display font-bold text-[#008751]">
              {departments.filter(d => d.is_clinical).length}
            </p>
            <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">Clinical</p>
          </div>
          <div className="bg-[#F5F0EA] border border-[#F0E8DC] rounded-lg p-3 text-center">
            <p className="text-xl font-display font-bold text-[#C87D3D]">
              {departments.filter(d => !d.is_clinical).length}
            </p>
            <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">Support</p>
          </div>
          <div className="bg-[#F0EDE8] border border-[#E8E3DC] rounded-lg p-3 text-center">
            <p className="text-xl font-display font-bold text-[#5A5A5A]">
              {departments.filter(d => d.head).length}
            </p>
            <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">With Heads</p>
          </div>
        </div>
      )}

      {/* Department Cards - Professional Grid */}
      {departments.length === 0 ? (
        <div className="text-center py-16 bg-[#F7F5F2] border border-[#E8E3DC] rounded-lg">
          <Building2 className="w-16 h-16 text-[#D8D4CD] mx-auto mb-3" />
          <p className="text-[#5A5A5A] font-medium">No departments found</p>
          <p className="text-sm text-[#B0A89E] mt-1">Click "Add Department" to create your first one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div 
              key={dept.id} 
              className="group bg-white border border-[#E8E3DC] rounded-lg hover:border-[#008751] hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Department Header */}
              <div className={`px-4 py-3 border-b ${dept.is_clinical ? 'bg-[#008751]/5 border-[#C8E0D5]' : 'bg-[#F7F5F2] border-[#E8E3DC]'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${dept.is_clinical ? 'bg-[#008751]' : 'bg-[#5A5A5A]'}`}>
                        <Building2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <h4 className="font-display font-semibold text-[#1A1A1A] text-sm truncate">
                        {dept.name}
                      </h4>
                    </div>
                    {dept.code && (
                      <p className="text-[10px] text-[#B0A89E] mt-0.5 ml-7">Code: {dept.code}</p>
                    )}
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 ${
                    dept.is_clinical 
                      ? 'bg-[#E8F5EF] text-[#008751] border border-[#C8E0D5]' 
                      : 'bg-[#F0EDE8] text-[#5A5A5A] border border-[#E8E3DC]'
                  }`}>
                    {dept.is_clinical ? 'Clinical' : 'Support'}
                  </span>
                </div>
              </div>

              {/* Department Body */}
              <div className="px-4 py-3 space-y-2">
                {dept.description && (
                  <p className="text-xs text-[#5A5A5A] leading-relaxed">{dept.description}</p>
                )}
                
                {dept.head && (
                  <div className="flex items-center gap-2 text-xs">
                    <UserIcon className="w-3.5 h-3.5 text-[#B0A89E]" />
                    <span className="text-[#5A5A5A]">Head: <span className="font-medium text-[#1A1A1A]">{dept.head}</span></span>
                  </div>
                )}
                
                {dept.location && (
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#B0A89E]" />
                    <span className="text-[#5A5A5A]">{dept.location}</span>
                  </div>
                )}
              </div>

              {/* Department Footer */}
              <div className="px-4 py-2.5 border-t border-[#F0EDE8] bg-[#F7F5F2] flex justify-end gap-1">
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
        </div>
      )}
    </div>
  );
};

  // ==================== RENDER ALERTS CONTENT ====================
  const renderAlertsContent = () => {
    const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.read);
    const otherAlerts = alerts.filter(a => a.type !== 'critical' || a.read);

    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
          <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Alert Management</h2>
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
            <h3 className="text-[10px] font-medium text-[#C8553D] uppercase tracking-wider mb-2">Critical Alerts</h3>
            <div className="space-y-2">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#F5EDEA] border border-[#E8D6D0] p-3 gap-2">
                  <div className="flex items-center flex-1 min-w-0">
                    <AlertCircle className="w-5 h-5 text-[#C8553D] mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A]">{alert.message}</p>
                      <p className="text-xs text-[#5A5A5A]">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
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
            <h3 className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-2">Other Alerts</h3>
            <div className="space-y-2">
              {otherAlerts.map((alert) => (
                <div key={alert.id} className={`flex flex-col sm:flex-row sm:items-center justify-between border p-3 gap-2 ${
                  alert.read ? 'bg-[#F7F5F2] border-[#E8E3DC] opacity-60' :
                  alert.type === 'warning' ? 'bg-[#F5F0EA] border-[#F0E8DC]' :
                  'bg-[#E8F5EF] border-[#C8E0D5]'
                }`}>
                  <div className="flex items-center flex-1 min-w-0">
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-[#C87D3D] mr-3 flex-shrink-0" />
                    ) : (
                      <Info className="w-5 h-5 text-[#008751] mr-3 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A]">{alert.message}</p>
                      <p className="text-xs text-[#5A5A5A]">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
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
            <Bell className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
            <p className="text-[#5A5A5A]">No alerts</p>
            <p className="text-sm text-[#B0A89E]">All clear!</p>
          </div>
        )}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="dashboard min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E8E3DC] border-2 border-[#D8D4CD] flex items-center justify-center overflow-hidden flex-shrink-0">
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
                <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#5A5A5A]" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Welcome back, {displayUserName}
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                {displayTenantName} · {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={handleRefresh}
              tooltip="Refresh dashboard"
              variant="secondary"
              className="text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${patientsLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleOpenProfile}
              tooltip="My Profile"
              variant="secondary"
              className="text-xs"
            >
              <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Profile</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleOpenChangePassword}
              tooltip="Change Password"
              variant="secondary"
              className="text-xs"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Change Password</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Tabs with Nigerian green active state */}
      <div className="border-b border-[#E8E3DC] mb-3 sm:mb-8 overflow-x-auto">
        <nav className="flex gap-3 sm:gap-6 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tooltip key={tab.id} text={`View ${tab.label}`}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#008751] text-[#008751]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {tab.label}
                  {tab.id === 'alerts' && alerts.filter(a => !a.read).length > 0 && (
                    <span className="w-4 h-4 sm:w-5 sm:h-5 bg-[#C8553D] text-white text-[10px] flex items-center justify-center">
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
      <div className="bg-white border border-[#E8E3DC] p-3 sm:p-5 md:p-8">
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