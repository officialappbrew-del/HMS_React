import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest, API_BASE_URL } from '../../utils/api';
import ConsultationV2 from '../../pages/ConsultationV2';
import ChangePasswordModal from '../ChangePasswordModal';
import { setPatients } from '../../features/patientSlice';
import {
  Users,
  Stethoscope,
  Activity,
  AlertCircle,
  Calendar,
  FileText,
  Heart,
  Clock,
  Eye,
  PlusCircle,
  CheckCircle2,
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
  Settings,
  LogOut,
  Menu,
  Home,
  Briefcase,
  Clipboard,
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
  TrendingUp,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus,
  Phone,
  Mail,
  MapPin,
  Building2,
  Globe,
  BookOpen,
  Award as AwardIcon,
  UserCircle,
  IdCard,
  Droplets,
  Baby,
  Activity as ActivityIcon,
  Heart as HeartIcon,
  Stethoscope as StethoscopeIcon,
  Calendar as CalendarIcon2,
  Clock as ClockIcon2,
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
  MoreVertical,
  Upload,
  Loader2,
} from 'lucide-react';

// Tooltip Component (keep for other items)
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

// Icon Button with Tooltip (for items that should have tooltips)
const IconButtonWithTooltip = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false }) => {
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

// Icon Button WITHOUT Tooltip (for items that should NOT have tooltips)
const IconButton = ({ icon: Icon, onClick, variant = 'default', className = '', disabled = false }) => {
  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-600',
    primary: 'text-blue-600 hover:text-blue-700',
    success: 'text-green-600 hover:text-green-700',
    danger: 'text-red-600 hover:text-red-700',
    warning: 'text-yellow-600 hover:text-yellow-700',
    info: 'text-blue-600 hover:text-blue-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg transition-all duration-200 ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:scale-95'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};

// Button with Tooltip (for items that should have tooltips)
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

// Button WITHOUT Tooltip (for items that should NOT have tooltips)
const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
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
                        <CalendarIcon2 className="w-3.5 h-3.5" />
                        {patient.age} years
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
                  <DropletsIcon className="w-3 h-3 mr-1" />
                  {patient.bloodType}
                </span>
              )}
              {patient.genotype && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  <BrainIcon className="w-3 h-3 mr-1" />
                  Genotype: {patient.genotype}
                </span>
              )}
              {patient.has_insurance && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  <ShieldIcon className="w-3 h-3 mr-1" />
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
                  <HeartPulseIcon className="w-4 h-4 text-red-600" />
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
                  <ShieldIcon className="w-4 h-4 text-yellow-600" />
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
                    <span className="font-medium text-gray-900">{formatDate(patient.registration_date || patient.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Visit</span>
                    <span className="font-medium text-gray-900">{formatDate(patient.lastVisit)}</span>
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
            <Button
              onClick={onClose}
              variant="secondary"
            >
              <X className="w-3.5 h-3.5" />
              Close
            </Button>
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
            <Button
              onClick={onClose}
              variant="secondary"
            >
              <X className="w-3.5 h-3.5" />
              Close
            </Button>
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

const DoctorDashboard = () => {
  const { user: authUser, tenant: authTenant } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { wardRounds } = useSelector(state => state.wardRound || { wardRounds: [] });
  const { admissions } = useSelector(state => state.admission || { admissions: [] });

  const displayTenantName = authTenant?.name || 'Hospital';
  const displayUserName = authUser?.full_name || [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.username || authUser?.email || 'User';
  const displayRole = authUser?.role || 'doctor';

  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const itemsPerPage = 10;

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);

  const [stats, setStats] = useState({
    myPatients: 0,
    todaysRounds: 0,
    pendingReviews: 0,
    criticalPatients: 0,
  });
  const [patientsCount, setPatientsCount] = useState(0);
  const [patientsNextPage, setPatientsNextPage] = useState(null);
  const [patientsPreviousPage, setPatientsPreviousPage] = useState(null);
  const [dashboardPatients, setDashboardPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  const [consultationForm, setConsultationForm] = useState({
    patientId: '',
    patientName: '',
    patientAge: '',
    patientGender: '',
    patientBloodType: '',
    patientPhone: '',
    patientEmail: '',
    patientAddress: '',
    temperature: '',
    weight: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    presentingComplaints: '',
    medicalHistory: '',
    drugPrescription: '',
    diagnosis: '',
    notes: ''
  });

  const [savedConsultation, setSavedConsultation] = useState(null);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [editingConsultationId, setEditingConsultationId] = useState(null);
  const [consultationPatientSearch, setConsultationPatientSearch] = useState('');

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', message: 'Critical patient alert - Immediate attention needed', time: '5 min ago', read: false },
    { id: 2, type: 'warning', message: 'Ward round overdue - Room 203', time: '15 min ago', read: false },
    { id: 3, type: 'info', message: 'New lab results available', time: '1 hour ago', read: false }
  ]);

  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(null);

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

  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(null);
  const [bulkUploadResult, setBulkUploadResult] = useState(null);
  const bulkUploadPollsRef = useRef({});

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
      } catch (err) {
        setScheduleError(err.message || 'Failed to load schedule');
      } finally {
        setScheduleLoading(false);
      }
    };
    fetchTodaysSchedule();
  }, []);

  const [consultations, setConsultations] = useState([]);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
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

  const loadDashboardPatients = async (url = '/api/v1/patients/patients/') => {
    try {
      setPatientsLoading(true);
      let data;
      let apiUrl = url;
      
      // If the URL is a full URL (starts with http), use it directly with fetch
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
        // Use the apiRequest for relative URLs
        data = await apiRequest(url);
        apiUrl = url;
      }
      
      const results = Array.isArray(data) ? data : (data.results || []);
      const normalized = results.map(normalizePatientForDisplay);
      
      // Update Redux store
      dispatch(setPatients(normalized));
      
      // Update local state
      setDashboardPatients(normalized);
      setPatientsCount(data.count || normalized.length);
      setPatientsNextPage(data.next || null);
      setPatientsPreviousPage(data.previous || null);
    } catch (err) {
      console.error('Failed to load dashboard patients:', err);
      setDashboardPatients([]);
      setPatientsCount(0);
    } finally {
      setPatientsLoading(false);
    }
  };

  // Load patients when component mounts
  useEffect(() => {
    loadDashboardPatients('/api/v1/patients/patients/');
  }, []);

  const totalItems = patientsCount || dashboardPatients.length;
  const totalPages = Math.ceil(totalItems / 20);
  const startIndex = dashboardPatients.length > 0 ? (totalItems - dashboardPatients.length + 1) : 0;
  const endIndex = startIndex + dashboardPatients.length - 1;

  const recentPatients = dashboardPatients
    .filter(p => p.name && p.name !== 'Unnamed Patient')
    .sort((a, b) => {
      const dateA = new Date(a.registration_date || a.last_visit || a.createdAt || 0);
      const dateB = new Date(b.registration_date || b.last_visit || b.createdAt || 0);
      return dateB - dateA;
    })
    .slice(0, 10);

  // Filter patients for consultation dropdown
  const filteredConsultationPatients = dashboardPatients
    .filter(p => {
      if (!consultationPatientSearch) return true;
      const searchLower = consultationPatientSearch.toLowerCase();
      return (p.name || '').toLowerCase().includes(searchLower) || 
             (p.phone || '').includes(searchLower) ||
             (p.hospital_number || '').toLowerCase().includes(searchLower);
    })
    .slice(0, 20);

  useEffect(() => {
    const activePatients = dashboardPatients.filter(p => 
      p.patient_status === 'active' || p.status === 'active'
    );
    
    setStats({
      myPatients: patientsCount || dashboardPatients.length || 0,
      todaysRounds: wardRounds.filter(r => r.status === 'Scheduled').length || 0,
      pendingReviews: consultations.filter(c => c.status === 'pending').length || 0,
      criticalPatients: alerts.filter(a => a.type === 'critical').length || 0,
    });
  }, [dashboardPatients, patientsCount, wardRounds, alerts, consultations]);

  // Reset consultation form
  const resetConsultationForm = () => {
    setConsultationForm({
      patientId: '',
      patientName: '',
      patientAge: '',
      patientGender: '',
      patientBloodType: '',
      patientPhone: '',
      patientEmail: '',
      patientAddress: '',
      temperature: '',
      weight: '',
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      presentingComplaints: '',
      medicalHistory: '',
      drugPrescription: '',
      diagnosis: '',
      notes: ''
    });
    setConsultationPatientSearch('');
    setEditingConsultationId(null);
  };

  // Handle selecting a patient for consultation
  const handleSelectPatientForConsultation = (patient) => {
    setConsultationForm(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age ? `${patient.age} years` : '',
      patientGender: patient.gender || '',
      patientBloodType: patient.bloodType || '',
      patientPhone: patient.phone || '',
      patientEmail: patient.email || '',
      patientAddress: patient.address || '',
      medicalHistory: patient.chronic_conditions || patient.notes || ''
    }));
    setConsultationPatientSearch(patient.name || '');
  };

  const handleConsultationChange = (field, value) => {
    setConsultationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveConsultation = () => {
    if (!consultationForm.patientName || !consultationForm.presentingComplaints) {
      alert('Please fill in patient name and presenting complaints');
      return;
    }

    const newConsultation = {
      id: Date.now(),
      patient: consultationForm.patientName,
      patientId: consultationForm.patientId,
      date: new Date().toISOString().split('T')[0],
      diagnosis: consultationForm.diagnosis || 'Under review',
      status: 'completed',
      temperature: consultationForm.temperature,
      weight: consultationForm.weight,
      bloodPressure: consultationForm.bloodPressure,
      heartRate: consultationForm.heartRate,
      respiratoryRate: consultationForm.respiratoryRate,
      oxygenSaturation: consultationForm.oxygenSaturation,
      presentingComplaints: consultationForm.presentingComplaints,
      medicalHistory: consultationForm.medicalHistory,
      drugPrescription: consultationForm.drugPrescription,
      notes: consultationForm.notes,
      savedAt: new Date().toLocaleString()
    };

    if (editingConsultationId) {
      setConsultations(prev => prev.map(c => 
        c.id === editingConsultationId ? { ...newConsultation, id: editingConsultationId } : c
      ));
    } else {
      setConsultations(prev => [newConsultation, ...prev]);
    }
    
    setShowConsultationForm(false);
    resetConsultationForm();
  };

  const handleEditConsultation = (consultation) => {
    setConsultationForm({
      patientId: consultation.patientId || '',
      patientName: consultation.patient,
      patientAge: '',
      patientGender: '',
      patientBloodType: '',
      patientPhone: '',
      patientEmail: '',
      patientAddress: '',
      temperature: consultation.temperature || '',
      weight: consultation.weight || '',
      bloodPressure: consultation.bloodPressure || '',
      heartRate: consultation.heartRate || '',
      respiratoryRate: consultation.respiratoryRate || '',
      oxygenSaturation: consultation.oxygenSaturation || '',
      presentingComplaints: consultation.presentingComplaints || '',
      medicalHistory: consultation.medicalHistory || '',
      drugPrescription: consultation.drugPrescription || '',
      diagnosis: consultation.diagnosis || '',
      notes: consultation.notes || ''
    });
    setConsultationPatientSearch(consultation.patient);
    setEditingConsultationId(consultation.id);
    setShowConsultationForm(true);
  };

  const handleDeleteConsultation = (id) => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      setConsultations(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleMarkAlertRead = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await apiRequest(`/api/v1/patients/appointments/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
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
      const normalized = { ...updated, status: statusMap[updated.status] || updated.status || 'scheduled' };
      setTodaysSchedule(prev => prev.map(apt => apt.id === id ? normalized : apt));
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
    setShowStatusMenu(null);
  };

  const resetBulkUpload = () => {
    setBulkUploadFile(null);
    setBulkUploading(false);
    setBulkUploadProgress(null);
    setBulkUploadResult(null);
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
            loadDashboardPatients('/api/v1/patients/patients/');
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

  const quickActions = [
    { icon: Users, label: 'My Patients', action: '/patients', color: 'bg-blue-500' },
    { icon: Stethoscope, label: 'Ward Rounds', action: '/ward-rounds', color: 'bg-green-500' },
    { icon: Activity, label: 'Vital Signs', action: '/vital-signs', color: 'bg-purple-500' },
    { icon: FileText, label: 'EMR', action: '/emr', color: 'bg-orange-500' },
    { icon: Calendar, label: 'Schedule', action: '/appointments', color: 'bg-red-500' },
    { icon: Heart, label: 'Admissions', action: '/admissions', color: 'bg-pink-500' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'consultations', label: 'Consultations', icon: Clipboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'completed': { label: 'Completed', color: 'bg-green-100 text-green-800' },
      'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
      'scheduled': { label: 'Scheduled', color: 'bg-gray-100 text-gray-800' },
      'critical': { label: 'Critical', color: 'bg-red-100 text-red-800' },
      'stable': { label: 'Stable', color: 'bg-green-100 text-green-800' },
      'monitoring': { label: 'Monitoring', color: 'bg-blue-100 text-blue-800' },
      'active': { label: 'Active', color: 'bg-green-100 text-green-800' },
      'inactive': { label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
      'archived': { label: 'Archived', color: 'bg-gray-100 text-gray-800' },
    };
    return statusMap[status] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-800' };
  };

  // Render tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'consultations':
        return renderConsultationsContent();
      case 'patients':
        return renderPatientsContent();
      case 'schedule':
        return renderScheduleContent();
      default:
        return renderOverviewContent();
    }
  };

  const renderOverviewContent = () => {
    return (
      <>
        {alerts.filter(a => a.type === 'critical' && !a.read).length > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Critical Patient Alerts</h3>
                  <p className="text-sm text-red-700">
                    {alerts.filter(a => a.type === 'critical' && !a.read).length} critical alert(s) require your attention
                  </p>
                </div>
              </div>
              <Button
                onClick={() => alerts.filter(a => a.type === 'critical').forEach(a => handleMarkAlertRead(a.id))}
                variant="secondary"
              >
                Mark All Read
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">My Patients</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.myPatients}</p>
                <div className="mt-1 flex items-center text-xs text-blue-600">
                  <Users className="mr-1 h-3 w-3" />
                  <span>Active cases</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Today's Rounds</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.todaysRounds}</p>
                <div className="mt-1 flex items-center text-xs text-green-600">
                  <Stethoscope className="mr-1 h-3 w-3" />
                  <span>Scheduled</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Pending Reviews</p>
                <p className="mt-1 text-2xl font-bold text-orange-600">{stats.pendingReviews}</p>
                <div className="mt-1 flex items-center text-xs text-orange-600">
                  <FileText className="mr-1 h-3 w-3" />
                  <span>Requires attention</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Critical Patients</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{stats.criticalPatients}</p>
                <div className="mt-1 flex items-center text-xs text-red-600">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  <span>Monitor closely</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

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

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Clinical Alerts</h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setAlerts(prev => prev.map(a => ({ ...a, read: true })))}
                variant="secondary"
                className="text-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Mark All Read
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No alerts</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className={`flex items-center justify-between rounded-lg p-3 ${
                  alert.type === 'critical' ? 'border-l-4 border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-l-4 border-yellow-500 bg-yellow-50' :
                  'border-l-4 border-blue-500 bg-blue-50'
                } ${alert.read ? 'opacity-60' : ''}`}>
                  <div className="flex items-center flex-1">
                    <AlertCircle className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      alert.type === 'critical' ? 'text-red-500' :
                      alert.type === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
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
                        variant="success"
                      />
                    )}
                    <IconButton
                      icon={X}
                      onClick={() => handleDismissAlert(alert.id)}
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

  const renderConsultationsContent = () => {
    return <ConsultationV2 />;
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-gray-900">My Patients</h2>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonWithTooltip
              tooltip="Add new patient"
              variant="primary"
              onClick={() => navigate('/patients/add')}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Patient
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
              onClick={() => document.getElementById('dashboard-bulk-upload-input')?.click()}
            >
              {bulkUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              Bulk Upload
            </ButtonWithTooltip>
            <input
              id="dashboard-bulk-upload-input"
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
            <Button
              variant="secondary"
              onClick={() => navigate('/patients')}
            >
              <Users className="w-3.5 h-3.5" />
              View All
            </Button>
          </div>
        </div>

        {(bulkUploadProgress || bulkUploadResult) && (
          <div className={`mb-4 p-3 sm:p-4 rounded-lg border ${bulkUploadResult?.status === 'failed' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {bulkUploading ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : bulkUploadResult?.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : bulkUploadResult?.status === 'failed' ? (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                ) : (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
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

        {dashboardPatients.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No patients found</p>
            <p className="text-xs text-gray-400 mt-1">Start by adding your first patient</p>
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
                {dashboardPatients.map((patient) => {
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
                          {patient.last_visit || patient.lastVisit ? new Date(patient.last_visit || patient.lastVisit).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <IconButton
                            icon={Eye}
                            onClick={() => handleViewPatient(patient)}
                            variant="primary"
                          />
                          <IconButton
                            icon={Stethoscope}
                            onClick={() => {
                              handleSelectPatientForConsultation(patient);
                              setActiveTab('consultations');
                              setShowConsultationForm(true);
                            }}
                            variant="success"
                          />
                          <IconButton
                            icon={FileText}
                            onClick={() => navigate(`/patients/${patient.id}/emr`)}
                            variant="info"
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
                  onClick={() => patientsPreviousPage && loadDashboardPatients(patientsPreviousPage)}
                  variant="default"
                  disabled={!patientsPreviousPage || patientsLoading}
                />
                <span className="text-[10px] sm:text-xs text-gray-600">
                  Page {dashboardPatients.length > 0 ? Math.ceil((totalItems - dashboardPatients.length + 1) / 20) : 0} of {totalPages || 1}
                </span>
                <IconButton
                  icon={ChevronRight}
                  onClick={() => patientsNextPage && loadDashboardPatients(patientsNextPage)}
                  variant="default"
                  disabled={!patientsNextPage || patientsLoading}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderScheduleContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Appointments</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/appointments')}
            >
              <Calendar className="w-3.5 h-3.5" />
              Full Schedule
            </Button>
          </div>
        </div>

        {scheduleLoading ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2 animate-pulse" />
            <p className="text-gray-500 text-sm">Loading schedule...</p>
          </div>
        ) : scheduleError ? (
          <div className="text-center py-8">
            <AlertCircle className="w-10 h-10 text-red-300 mx-auto mb-2" />
            <p className="text-red-600 text-sm font-medium">{scheduleError}</p>
            <button
              onClick={() => {
                apiRequest('/api/v1/patients/appointments/').then(data => {
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
                  setScheduleError(null);
                }).catch(err => setScheduleError(err.message));
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Retry
            </button>
          </div>
        ) : todaysSchedule.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[640px] lg:min-w-0">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date & Time</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Doctor</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Reason</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {todaysSchedule.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2 sm:py-3">
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-medium text-sm">
                           {(appointment.patientName || '?').charAt(0).toUpperCase()}
                         </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px]">{appointment.patientName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 hidden sm:table-cell">
                      <div className="text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="whitespace-nowrap">{new Date(appointment.date).toLocaleDateString('en-NG')}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="whitespace-nowrap">{appointment.time}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 hidden md:table-cell">
                      <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px] block">{appointment.doctor || 'N/A'}</span>
                    </td>
                    <td className="py-2 sm:py-3 hidden lg:table-cell">
                      <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[150px] block">{appointment.reason || 'N/A'}</span>
                    </td>
                    <td className="py-2 sm:py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status === 'in-progress' ? 'In Progress' : 
                         appointment.status === 'completed' ? 'Completed' : 
                         appointment.status === 'cancelled' ? 'Cancelled' : 'Scheduled'}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3">
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
                        <IconButton
                          icon={Eye}
                          onClick={() => navigate('/appointments')}
                          variant="primary"
                        />
                        <IconButton
                          icon={Edit}
                          onClick={() => navigate('/appointments')}
                          variant="primary"
                        />
                        <div className="relative">
                          <IconButton
                            icon={MoreVertical}
                            onClick={() => setShowStatusMenu(showStatusMenu === appointment.id ? null : appointment.id)}
                            variant="default"
                          />
                          {showStatusMenu === appointment.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'scheduled')}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Clock className="w-3 h-3 text-blue-500" />
                                Scheduled
                              </button>
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'completed')}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                Completed
                              </button>
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
                              >
                                <X className="w-3 h-3 text-red-500" />
                                Cancelled
                              </button>
                            </div>
                          )}
                        </div>
                        <IconButton
                          icon={Trash2}
                          onClick={() => navigate('/appointments')}
                          variant="danger"
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

  return (
    <div className="dashboard min-h-screen bg-gray-50 p-4 sm:p-6">
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
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleOpenChangePassword}
              tooltip="Change Password"
              variant="secondary"
            >
              <Settings className="w-4 h-4" />
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <nav className="flex gap-4 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
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
            );
          })}
        </nav>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        {renderTabContent()}
      </div>

      {showPatientModal && (
        <PatientDetailModal 
          patient={selectedPatient} 
          onClose={handleClosePatientModal} 
        />
      )}

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

export default DoctorDashboard;