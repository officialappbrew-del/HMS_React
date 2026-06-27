import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Plus,
  Users,
  Search,
  Edit,
  Trash2,
  FileText,
  Award,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Loader2,
  Clipboard,
  CheckCircle,
  UserPlus,
  User,
  X,
  AlertTriangle,
  Heart,
  Building2,
  BadgeCheck,
  Hash,
  Calendar,
  GraduationCap,
  UsersIcon,
  Shield,
  CreditCard,
  CalendarDays,
  Briefcase,
  Filter,
  Printer,
  Eye,
  EyeOff,
  Camera,
  Download,
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { apiRequest, API_BASE_URL } from '../utils/api';

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
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '', disabled = false }) => {
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
        disabled={disabled}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${variantClasses[variant]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

const ErrorModal = ({ isOpen, onClose, title, message, details = null, onUsePassword = null }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSuggestion, setPasswordSuggestion] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  const generatePasswordSuggestion = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  useEffect(() => {
    if (isOpen && details?.password) {
      setPasswordSuggestion(generatePasswordSuggestion());
    }
  }, [isOpen, details]);

  if (!isOpen) return null;

  const hasPasswordErrors = details?.password;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>

          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">{title || 'Error'}</h3>
            </div>

            <div className="bg-red-50 rounded-lg border border-red-200 p-3 mb-4">
              <p className="text-sm text-red-800 whitespace-pre-line">{message}</p>
              {hasPasswordErrors && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <p className="text-xs font-medium text-red-700 mb-2">Suggested password:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white px-2 py-1.5 rounded border border-gray-200 text-sm font-mono">
                      {showPassword ? passwordSuggestion : '••••••••••••'}
                    </code>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(passwordSuggestion);
                        setCopyStatus('Password suggestion copied!');
                        setTimeout(() => setCopyStatus(''), 2000);
                      }}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Copy suggestion"
                    >
                      <Clipboard className="w-4 h-4" />
                    </button>
                  </div>
                  {copyStatus && (
                    <p className="text-xs text-green-600 font-medium">{copyStatus}</p>
                  )}
                  {onUsePassword && (
                    <button
                      type="button"
                      onClick={() => {
                        onUsePassword(passwordSuggestion);
                        onClose();
                      }}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Use this password
                    </button>
                  )}
                </div>
              )}
              {details && !hasPasswordErrors && (
                <details className="mt-2">
                  <summary className="text-xs text-red-600 cursor-pointer font-medium">View details</summary>
                  <pre className="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded overflow-x-auto">
                    {typeof details === 'object' ? JSON.stringify(details, null, 2) : details}
                  </pre>
                </details>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirm Modal
const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Delete',
  cancelText = 'Cancel',
  itemData = null,
  isDeleting = false,
}) => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm transform transition-all duration-200">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isDeleting}
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>

          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">{message}</p>

            {itemData && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{itemData.name}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      {itemData.email && (
                        <span className="flex items-center gap-1 truncate max-w-[120px]">
                          <Mail className="w-3 h-3 flex-shrink-0" /> {itemData.email}
                        </span>
                      )}
                      {itemData.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {itemData.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-700">This action cannot be undone</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    {confirmText}
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Staff Details Modal Component
const StaffDetailsModal = ({ isOpen, onClose, staff, onEdit, onDelete }) => {
  if (!isOpen || !staff) return null;

  const getCategoryColor = (category) => {
    const colors = {
      'Doctor': 'bg-blue-100 text-blue-800',
      'Nurse': 'bg-green-100 text-green-800',
      'Pharmacist': 'bg-purple-100 text-purple-800',
      'Laboratory Technician': 'bg-orange-100 text-orange-800',
      'Radiographer': 'bg-pink-100 text-pink-800',
      'Administrative': 'bg-gray-100 text-gray-800',
      'Support Staff': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Doctor': <Award className="w-4 h-4" />,
      'Nurse': <Heart className="w-4 h-4" />,
      'Pharmacist': <BookOpen className="w-4 h-4" />,
      'Laboratory Technician': <FileText className="w-4 h-4" />,
      'Radiographer': <FileText className="w-4 h-4" />,
      'Administrative': <Building2 className="w-4 h-4" />,
      'Support Staff': <Users className="w-4 h-4" />,
    };
    return icons[category] || <Users className="w-4 h-4" />;
  };

  // Get profile picture URL
  const getProfilePictureUrl = () => {
    if (staff.profile_picture) {
      if (staff.profile_picture.startsWith('http')) {
        return staff.profile_picture;
      }
      return `${API_BASE_URL}${staff.profile_picture}`;
    }
    return null;
  };

  const profilePicture = getProfilePictureUrl();

  const InfoRow = ({ icon: Icon, label, value, className = '' }) => (
    <div className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${className}`}>
      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-900 mt-0.5 break-words">{value || 'N/A'}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Staff Profile</h2>
              <p className="text-sm text-blue-100">Complete staff information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-shrink-0">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={staff.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      const fallback = document.createElement('div');
                      fallback.className = 'w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg';
                      fallback.textContent = staff.name.charAt(0);
                      parent.appendChild(fallback);
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    {staff.name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <BadgeCheck className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{staff.name}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(staff.category)}`}>
                    {getCategoryIcon(staff.category)}
                    {staff.category}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(staff.status)}`}>
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {staff.status}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                    <Hash className="w-3.5 h-3.5" />
                    {staff.staffId}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    onClose();
                    onEdit(staff);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onDelete(staff);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                </div>
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow icon={User} label="Full Name" value={staff.name} />
                <InfoRow icon={Hash} label="Staff ID" value={staff.staffId} />
                <InfoRow icon={Calendar} label="Date of Birth" value={staff.dateOfBirth ? new Date(staff.dateOfBirth).toLocaleDateString('en-NG') : 'N/A'} />
                <InfoRow icon={MapPin} label="Address" value={staff.address} />
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-green-600" />
                </div>
                Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow icon={Mail} label="Email Address" value={staff.email} />
                <InfoRow icon={Phone} label="Phone Number" value={staff.phone || 'N/A'} />
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                </div>
                Employment Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow icon={Briefcase} label="Department" value={staff.department || 'N/A'} />
                <InfoRow icon={GraduationCap} label="Designation" value={staff.designation || 'N/A'} />
                <InfoRow icon={Award} label="Category" value={staff.category} />
                <InfoRow icon={UsersIcon} label="Role" value={staff.role || 'N/A'} />
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-yellow-600" />
                </div>
                License Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow icon={CreditCard} label="Registration Number" value={staff.registrationNumber || 'N/A'} />
                <InfoRow icon={CalendarDays} label="License Expiry Date" value={staff.licenseExpiryDate ? new Date(staff.licenseExpiryDate).toLocaleDateString('en-NG') : 'N/A'} />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(staff);
              }}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffDirectory = () => {
  const { staffCategories } = useSelector(state => state.staff || {});
  const dispatch = useDispatch();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  // File input ref
  const fileInputRef = useRef(null);

  const generatePasswordSuggestion = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

const [credentialsModal, setCredentialsModal] = useState({
    isOpen: false,
    employeeId: '',
    email: '',
    password: '',
    showPassword: false,
  });

  // Error modal state
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    details: null,
  });

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    staffData: null,
    action: null,
    title: '',
    message: '',
    confirmText: '',
  });

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: '',
    designation: '',
    employee_id: '',
    license_number: '',
    license_expiry: '',
    department: '',
    address: '',
    password: '',
  });

  // Stats
  const stats = {
    total: staff.length,
    doctors: staff.filter(s => s.category === 'Doctor').length,
    nurses: staff.filter(s => s.category === 'Nurse').length,
    other: staff.filter(s => s.category !== 'Doctor' && s.category !== 'Nurse').length,
  };

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRequest('/api/v1/tenants/users/');
        const list = Array.isArray(data) ? data : (data.results || []);
        const normalized = list.map(user => ({
          id: user.id,
          staffId: user.employee_id || `STAFF-${user.id}`,
          name: user.full_name || `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone || '',
          category: mapRoleToCategory(user.role),
          specialty: user.specialization || '',
          registrationNumber: user.mdcn_number || user.employee_id || '',
          licenseExpiryDate: user.license_expiry || '',
          department: user.department || user.tenant_name || '',
          designation: user.designation || '',
          status: user.employment_status === 'active' ? 'Active' : 'Inactive',
          dateOfBirth: user.date_of_birth || '',
          address: user.address || '',
          employee_id: user.employee_id,
          role: user.role,
          is_active: user.is_active,
          profile_picture: user.profile_picture || null,
        }));
        setStaff(normalized);
      } catch (err) {
        setError(err.message || 'Failed to load staff');
        showErrorModal('Failed to Load Staff', err.message || 'Unable to load staff members. Please try again.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const showErrorModal = (title, message, details = null) => {
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
      details: null,
    });
  };

  const mapRoleToCategory = (role) => {
    const roleMap = {
      doctor: 'Doctor',
      nurse: 'Nurse',
      pharmacist: 'Pharmacist',
      lab_tech: 'Laboratory Technician',
      admin: 'Administrative',
      receptionist: 'Administrative',
      accountant: 'Administrative',
      hr_manager: 'Administrative',
      inventory_manager: 'Administrative',
      support: 'Support Staff',
    };
    return roleMap[role] || 'Support Staff';
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (s.registrationNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (s.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || s.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddStaff = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.role) {
      showErrorModal('Validation Error', 'Please fill in all required fields: First Name, Last Name, Email, and Role.');
      return;
    }
    
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.first_name.trim());
      formDataToSend.append('last_name', formData.last_name.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('phone', formData.phone.trim());
      formDataToSend.append('role', formData.role);
      formDataToSend.append('designation', formData.designation.trim());
      formDataToSend.append('employee_id', formData.employee_id.trim());
      formDataToSend.append('license_number', formData.license_number.trim());
      if (formData.license_expiry) {
        formDataToSend.append('license_expiry', formData.license_expiry);
      }
      formDataToSend.append('department', formData.department.trim());
      formDataToSend.append('address', formData.address.trim());
      formDataToSend.append('password', formData.password);
      
      if (profilePictureFile) {
        formDataToSend.append('profile_picture', profilePictureFile);
      }

      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/v1/tenants/users/`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || 'Failed to add staff';
        const errorDetails = errorData;
        throw { message: errorMessage, details: errorDetails };
      }

      const user = await response.json();
      
      setStaff(prev => [...prev, {
        id: user.id,
        staffId: user.employee_id || `STAFF-${user.id}`,
        name: user.full_name || `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone || '',
        category: mapRoleToCategory(user.role),
        specialty: user.specialization || '',
        registrationNumber: user.mdcn_number || user.employee_id || '',
        licenseExpiryDate: user.license_expiry || '',
        department: user.department || user.tenant_name || '',
        designation: user.designation || '',
        status: user.employment_status === 'active' ? 'Active' : 'Inactive',
        dateOfBirth: user.date_of_birth || '',
        address: user.address || '',
        employee_id: user.employee_id,
        role: user.role,
        is_active: user.is_active,
        profile_picture: user.profile_picture || null,
      }]);

      setCredentialsModal({
        isOpen: true,
        employeeId: user.employee_id || `STAFF-${user.id}`,
        email: user.email,
        password: formData.password,
        showPassword: false,
      });

      setShowAddStaffForm(false);
      resetForm();
} catch (err) {
      const errorDetails = err.details || err;
      const hasPasswordError = errorDetails?.password;
      
      if (hasPasswordError) {
        const suggestion = generatePasswordSuggestion();
        setFormData(prev => ({ ...prev, password: suggestion }));
        showErrorModal(
          'Password Error',
          Array.isArray(errorDetails.password) ? errorDetails.password.join(', ') : errorDetails.password,
          errorDetails,
          (pwd) => setFormData(prev => ({ ...prev, password: pwd }))
        );
      } else {
        showErrorModal(
          'Failed to Add Staff',
          err.message || 'Unable to add staff member. Please check the form and try again.',
          errorDetails
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: '',
      designation: '',
      employee_id: '',
      license_number: '',
      license_expiry: '',
      department: '',
      address: '',
      password: '',
    });
    setSelectedStaff(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setProfilePictureFile(null);
    setProfilePicturePreview('');
  };

  const handleDeleteClick = (staffMember) => {
    setConfirmModal({
      isOpen: true,
      staffData: {
        name: staffMember.name,
        email: staffMember.email,
        phone: staffMember.phone,
      },
      action: async () => {
        setIsDeleting(true);
        try {
          await apiRequest(`/api/v1/tenants/users/${staffMember.id}/`, {
            method: 'DELETE',
          });
          setStaff(prev => prev.filter(s => s.id !== staffMember.id));
          setConfirmModal({ ...confirmModal, isOpen: false });
        } catch (error) {
          console.error('Delete failed:', error);
          showErrorModal(
            'Failed to Delete Staff',
            error.message || 'Unable to delete staff member. Please try again.',
            error
          );
          setConfirmModal({ ...confirmModal, isOpen: false });
        } finally {
          setIsDeleting(false);
        }
      },
      title: 'Delete Staff Member?',
      message: 'This will permanently delete the staff record and all associated data.',
      confirmText: 'Delete',
    });
  };

  const handleViewDetails = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDetailsModal(true);
  };

  const handleEdit = (staffMember) => {
    setFormData({
      first_name: staffMember.name.split(' ')[0] || '',
      last_name: staffMember.name.split(' ').slice(1).join(' ') || '',
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      role: staffMember.role || '',
      designation: staffMember.designation || '',
      employee_id: staffMember.employee_id || '',
      license_number: staffMember.registrationNumber || '',
      license_expiry: staffMember.licenseExpiryDate || '',
      department: staffMember.department || '',
      address: staffMember.address || '',
      profile_picture: staffMember.profile_picture || null,
    });
    
    if (staffMember.profile_picture) {
      const url = staffMember.profile_picture.startsWith('http') 
        ? staffMember.profile_picture 
        : `${API_BASE_URL}${staffMember.profile_picture}`;
      setProfilePicturePreview(url);
    } else {
      setProfilePicturePreview(null);
    }
    setProfilePictureFile(null);
    setShowAddStaffForm(true);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Doctor': 'bg-blue-100 text-blue-800',
      'Nurse': 'bg-green-100 text-green-800',
      'Pharmacist': 'bg-purple-100 text-purple-800',
      'Laboratory Technician': 'bg-orange-100 text-orange-800',
      'Radiographer': 'bg-pink-100 text-pink-800',
      'Administrative': 'bg-gray-100 text-gray-800',
      'Support Staff': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Doctor': <Award className="w-3.5 h-3.5" />,
      'Nurse': <Heart className="w-3.5 h-3.5" />,
      'Pharmacist': <BookOpen className="w-3.5 h-3.5" />,
      'Laboratory Technician': <FileText className="w-3.5 h-3.5" />,
      'Radiographer': <FileText className="w-3.5 h-3.5" />,
      'Administrative': <Building2 className="w-3.5 h-3.5" />,
      'Support Staff': <Users className="w-3.5 h-3.5" />,
    };
    return icons[category] || <Users className="w-3.5 h-3.5" />;
  };

  const categories = staffCategories || {
    DOCTOR: 'Doctor',
    NURSE: 'Nurse',
    PHARMACIST: 'Pharmacist',
    LAB_TECH: 'Laboratory Technician',
    RADIOGRAPHER: 'Radiographer',
    ADMIN: 'Administrative',
    SUPPORT: 'Support Staff'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Staff Directory
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Manage hospital staff profiles and registrations
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonWithTooltip
              onClick={() => setShowAddStaffForm(true)}
              tooltip="Add a new staff member"
              variant="primary"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Add Staff</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="Export staff data"
              variant="secondary"
              disabled={true}
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Export</span>
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Total Staff</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stats.total}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Doctors</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600 mt-0.5 sm:mt-1">{stats.doctors}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Nurses</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">{stats.nurses}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Other Staff</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600 mt-0.5 sm:mt-1">{stats.other}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <IconButton
                  icon={Filter}
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  tooltip={showMobileFilters ? "Hide filters" : "Show filters"}
                  variant="default"
                  className="lg:hidden"
                />
                <div className="hidden sm:flex items-center gap-1.5">
                  <Tooltip text="Filter by category">
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All Categories</option>
                      {Object.values(categories).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </Tooltip>
                </div>
                <IconButton
                  icon={Printer}
                  onClick={() => window.print()}
                  tooltip="Print staff list"
                  variant="default"
                />
                <span className="text-xs text-gray-500 ml-1">
                  {filteredStaff.length} found
                </span>
              </div>
            </div>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <div className="mt-3 pt-3 border-t border-gray-200 lg:hidden">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">Filter by Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All Categories</option>
                    {Object.values(categories).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Staff List */}
          <div className="p-3 sm:p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-500">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mb-2" />
                <span className="text-sm sm:text-base">Loading staff...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 rounded-lg p-4 text-center text-red-600 text-sm">{error}</div>
            ) : filteredStaff.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 font-medium text-sm sm:text-base">No staff members found</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Start by adding your first staff member'}
                </p>
                {!searchQuery && (
                  <ButtonWithTooltip
                    onClick={() => setShowAddStaffForm(true)}
                    tooltip="Add a new staff member"
                    variant="primary"
                    className="mt-3 sm:mt-4"
                  >
                    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Add Staff Member
                  </ButtonWithTooltip>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full min-w-[640px] sm:min-w-0">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Department</th>
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStaff.map((staffMember) => (
                        <tr key={staffMember.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2 sm:py-3">
                            <div className="flex items-center gap-2">
                              {staffMember.profile_picture ? (
                                <img
                                  src={staffMember.profile_picture.startsWith('http') 
                                    ? staffMember.profile_picture 
                                    : `${API_BASE_URL}${staffMember.profile_picture}`}
                                  alt={staffMember.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    const parent = e.target.parentElement;
                                    const fallback = document.createElement('div');
                                    fallback.className = 'w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm';
                                    fallback.textContent = staffMember.name.charAt(0);
                                    parent.appendChild(fallback);
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm flex-shrink-0">
                                  {staffMember.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900 text-xs sm:text-sm">{staffMember.name}</div>
                                <div className="text-[10px] text-gray-500">
                                  {staffMember.staffId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 hidden sm:table-cell">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(staffMember.category)}`}>
                              {getCategoryIcon(staffMember.category)}
                              {staffMember.category}
                            </span>
                          </td>
                          <td className="py-2 sm:py-3 hidden md:table-cell">
                            <div className="text-xs sm:text-sm text-gray-600">{staffMember.email}</div>
                            <div className="text-[10px] text-gray-400">{staffMember.phone}</div>
                          </td>
                          <td className="py-2 sm:py-3 hidden lg:table-cell">
                            <span className="text-xs text-gray-600">{staffMember.department || '-'}</span>
                          </td>
                          <td className="py-2 sm:py-3">
                            <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-medium rounded-full ${getStatusColor(staffMember.status)}`}>
                              {staffMember.status}
                            </span>
                          </td>
                          <td className="py-2 sm:py-3">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <IconButton
                                icon={Eye}
                                onClick={() => handleViewDetails(staffMember)}
                                tooltip="View profile"
                                variant="primary"
                              />
                              <IconButton
                                icon={Edit}
                                onClick={() => handleEdit(staffMember)}
                                tooltip="Edit staff"
                                variant="primary"
                              />
                              <IconButton
                                icon={Trash2}
                                onClick={() => handleDeleteClick(staffMember)}
                                tooltip="Delete staff"
                                variant="danger"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 gap-2 sm:gap-0">
                  <div className="text-[10px] sm:text-xs text-gray-500">
                    Showing {filteredStaff.length} of {staff.length} staff members
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showAddStaffForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                {formData.first_name || formData.last_name ? 'Edit Staff' : 'Add Staff Member'}
              </h2>
              <button
                onClick={() => {
                  setShowAddStaffForm(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); handleAddStaff(); }} className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    Profile Picture
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {profilePicturePreview ? (
                        <img
                          src={profilePicturePreview}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <label
                        htmlFor="profile-picture-upload"
                        className="absolute -bottom-1 -right-1 p-1 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </label>
                      <input
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Upload a profile picture</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      {profilePicturePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfilePictureFile(null);
                            setProfilePicturePreview(null);
                          }}
                          className="text-xs text-red-600 hover:text-red-700 mt-1"
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    Employment Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={submitting}
                      >
                        <option value="">Select Role</option>
                        <option value="doctor">Doctor</option>
                        <option value="nurse">Nurse</option>
                        <option value="pharmacist">Pharmacist</option>
                        <option value="lab_tech">Lab Technician</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="accountant">Accountant</option>
                        <option value="hr_manager">HR Manager</option>
                        <option value="admin">Admin</option>
                        <option value="support">Support Staff</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                      <input
                        type="text"
                        placeholder="Employee ID"
                        value={formData.employee_id}
                        onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                      <input
                        type="text"
                        placeholder="Designation"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input
                        type="text"
                        placeholder="Department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-yellow-600" />
                    License Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                      <input
                        type="text"
                        placeholder="License Number"
                        value={formData.license_number}
                        onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry Date</label>
                      <input
                        type="date"
                        placeholder="License Expiry Date"
                        value={formData.license_expiry}
                        onChange={(e) => setFormData({ ...formData, license_expiry: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

<div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password for login"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full px-3 py-2 pr-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                          disabled={submitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const suggestion = generatePasswordSuggestion();
                          setFormData(prev => ({ ...prev, password: suggestion }));
                        }}
                        className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Generate secure password"
                      >
                        Suggest
                      </button>
                    </div>
                  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows="2"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={submitting}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {formData.first_name || formData.last_name ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        {formData.first_name || formData.last_name ? 'Update' : 'Add'} Staff
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddStaffForm(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Staff Details Modal */}
      <StaffDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedStaff(null);
        }}
        staff={selectedStaff}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.action}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        itemData={confirmModal.staffData}
        isDeleting={isDeleting}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={closeErrorModal}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />

{/* Credentials Modal */}
      {credentialsModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setCredentialsModal({ ...credentialsModal, isOpen: false })} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Login Credentials Created</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Staff member has been created successfully. Please save the login credentials:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white px-3 py-2 rounded border border-gray-200 text-sm font-mono">
                        {credentialsModal.showPassword ? credentialsModal.password : '••••••••••••'}
                      </code>
                      <button
                        type="button"
                        onClick={() => setCredentialsModal(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={credentialsModal.showPassword ? 'Hide password' : 'Show password'}
                      >
                        {credentialsModal.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(credentialsModal.password);
                          setCopyStatus('Password copied!');
                          setTimeout(() => setCopyStatus(''), 2000);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy"
                      >
                        <Clipboard className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {copyStatus && (
                    <p className="text-xs text-green-600 font-medium">{copyStatus}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setCredentialsModal({ ...credentialsModal, isOpen: false })}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDirectory;