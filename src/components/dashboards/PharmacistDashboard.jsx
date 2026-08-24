import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest, API_BASE_URL } from '../../utils/api';
import ConfirmModal from '../../components/ConfirmModal';
import ChangePasswordModal from '../ChangePasswordModal';
import UpcomingRosterWidget from './UpcomingRosterWidget';
import MyRosterTab from './MyRosterTab';
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
  ChevronDown,
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
          <div className="bg-[#1a1f2e] text-white text-xs px-3 py-1.5 shadow-lg font-sans">
            {text}
            <div className={`absolute w-2 h-2 bg-[#1a1f2e] transform rotate-45 ${
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
    default: 'text-[#6b7280] hover:text-[#1a1f2e]',
    primary: 'text-[#1a5c7a] hover:text-[#0e3d52]',
    success: 'text-[#1d7a5e] hover:text-[#135a45]',
    danger: 'text-[#b13e3e] hover:text-[#8a2e2e]',
    warning: 'text-[#b8860b] hover:text-[#8a6608]',
    info: 'text-[#1a5c7a] hover:text-[#0e3d52]',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded transition-colors ${variantClasses[variant]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f3f5f7]'
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
    primary: 'bg-[#1a5c7a] hover:bg-[#0e3d52] text-white',
    secondary: 'bg-white border border-[#d1d5db] hover:bg-[#f3f5f7] text-[#1a1f2e]',
    success: 'bg-[#1d7a5e] hover:bg-[#135a45] text-white',
    danger: 'bg-[#b13e3e] hover:bg-[#8a2e2e] text-white',
    warning: 'bg-[#b8860b] hover:bg-[#8a6608] text-white',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 sm:gap-2 ${variantClasses[variant]} ${className} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

// Badge Component
const Badge = ({ status, children }) => {
  const colors = {
    'prescribed': 'bg-amber-100 text-amber-700',
    'pending': 'bg-amber-100 text-amber-700',
    'dispensed': 'bg-emerald-100 text-emerald-700',
    'completed': 'bg-emerald-100 text-emerald-700',
    'active': 'bg-emerald-100 text-emerald-700',
    'inactive': 'bg-gray-100 text-gray-600',
    'critical': 'bg-rose-100 text-rose-700',
    'warning': 'bg-amber-100 text-amber-700',
    'low': 'bg-amber-100 text-amber-700',
    'ok': 'bg-emerald-100 text-emerald-700',
    'High': 'bg-rose-100 text-rose-700',
    'Normal': 'bg-blue-100 text-blue-700',
    'info': 'bg-blue-100 text-blue-700',
    'success': 'bg-emerald-100 text-emerald-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors['active']}`}>
      {children}
    </span>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, trend, trendValue, onClick }) => {
  const colorClasses = {
    green: 'bg-emerald-500',
    gold: 'bg-amber-500',
    red: 'bg-rose-500',
    warm: 'bg-amber-500',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500',
    blue: 'bg-blue-500',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-emerald-200' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend === 'up' ? <ChevronRight className="w-3 h-3 mr-0.5 rotate-[-90deg]" /> : <ChevronRight className="w-3 h-3 mr-0.5 rotate-90" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`w-10 h-10 ${colorClasses[color]} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

// Profile Modal Component
const ProfileModal = ({ isOpen, onClose, profileData, onChange, onSave, loading, saving, error, success, specializations, specializationsLoading, profilePicturePreview, onProfilePictureChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="sticky top-0 bg-[#1a5c7a] text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display tracking-tight">My Profile</h2>
                <p className="text-sm text-[#b8d4e3] mt-1 font-sans">View and update your personal information</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {(error || success) && (
              <div className={`mb-4 p-3 text-sm whitespace-pre-line font-sans ${error ? 'bg-[#fdf2f2] text-[#b13e3e] border border-[#f5c6c6]' : 'bg-[#f0f7f4] text-[#1d7a5e] border border-[#b8d9cc]'}`}>
                {error || success}
              </div>
            )}

            {!loading && (
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#f3f5f7] border-2 border-[#d1d5db] flex items-center justify-center overflow-hidden">
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
                      <UserIcon className="w-12 h-12 text-[#9ca3af]" />
                    </div>
                  </div>
                </div>
                <label className="mt-3 cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d1d5db] text-xs font-sans text-[#1a1f2e] hover:bg-[#f3f5f7] transition-colors">
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
                    className="mt-1 text-xs text-[#b13e3e] hover:text-[#8a2e2e] font-sans"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-[#1a5c7a] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-[#6b7280] text-sm mt-2 font-sans">Loading profile...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">First Name *</label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => onChange('first_name', e.target.value)}
                      className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => onChange('last_name', e.target.value)}
                      className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Email *</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => onChange('email', e.target.value)}
                      className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => onChange('phone', e.target.value)}
                      className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={profileData.employee_id}
                      disabled
                      className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] bg-[#f3f5f7] text-[#6b7280] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Role</label>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] bg-[#f3f5f7] text-[#6b7280] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Department</label>
                    <input
                      type="text"
                      value={profileData.department_name}
                      disabled
                      className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] bg-[#f3f5f7] text-[#6b7280] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Designation</label>
                    <input
                      type="text"
                      value={profileData.designation}
                      onChange={(e) => onChange('designation', e.target.value)}
                      className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">License Number</label>
                    <input
                      type="text"
                      value={profileData.license_number}
                      onChange={(e) => onChange('license_number', e.target.value)}
                      className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Specialization</label>
                    <select
                      value={profileData.specialization}
                      onChange={(e) => onChange('specialization', e.target.value)}
                      disabled={specializationsLoading}
                      className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a] disabled:bg-[#f3f5f7] disabled:text-[#6b7280]"
                    >
                      <option value="">-- Select specialization --</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Qualification</label>
                  <textarea
                    value={profileData.qualification}
                    onChange={(e) => onChange('qualification', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-[#f9fafb] border-t border-[#e5e7eb] p-4 flex flex-wrap justify-end gap-2">
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
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
          <div className="sticky top-0 bg-[#b13e3e] text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <h2 className="text-xl font-display tracking-tight">{title || 'Validation Error'}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <p className="text-[#1a1f2e] text-sm font-sans">{message}</p>
            </div>
            {details && (
              <div className="bg-[#f3f5f7] p-3 border border-[#e5e7eb]">
                <p className="text-xs font-sans text-[#6b7280] font-medium mb-1">Details:</p>
                <p className="text-sm font-sans text-[#1a1f2e]">{details}</p>
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

// Prescription Patient Modal - Enhanced version
const PrescriptionPatientModal = ({ patient, drugs, onClose, onDispense }) => {
  const [dispensingPrescription, setDispensingPrescription] = useState(null);
  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [dispenseQuantity, setDispenseQuantity] = useState(1);
  const [isDispensing, setIsDispensing] = useState(false);

  if (!patient) return null;

  const getDrugNames = (drug) => [
    drug.name,
    drug.generic_name,
    drug.genericName,
    drug.brand_name,
    drug.brandName,
  ].filter(Boolean);

  const matchingDrugs = dispensingPrescription
    ? drugs.filter((drug) => getDrugNames(drug).some((name) => (
        name.toLowerCase() === dispensingPrescription.medication.toLowerCase()
      )))
    : [];

  const startDispense = (prescription) => {
    const matchingDrug = drugs.find((drug) => getDrugNames(drug).some((name) => (
      name.toLowerCase() === prescription.medication.toLowerCase()
    )));
    setDispensingPrescription(prescription);
    setSelectedDrugId(matchingDrug ? String(matchingDrug.id) : '');
    setDispenseQuantity(prescription.quantity || 1);
  };

  const cancelDispense = () => {
    setDispensingPrescription(null);
    setSelectedDrugId('');
    setDispenseQuantity(1);
  };

  const submitDispense = async () => {
    if (!selectedDrugId || !dispenseQuantity) return;
    setIsDispensing(true);
    try {
      await onDispense(dispensingPrescription, selectedDrugId, dispenseQuantity);
      cancelDispense();
    } catch (error) {
    } finally {
      setIsDispensing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#e5e7eb] bg-white px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-display font-bold text-[#1a1f2e]">{patient.name}</h2>
            <p className="mt-1 text-xs font-sans text-[#6b7280]">MRN: {patient.mrn || 'N/A'} · {patient.prescriptions.length} prescription item(s)</p>
          </div>
          <button onClick={onClose} className="p-1 text-[#6b7280] hover:bg-[#f3f5f7]" aria-label="Close prescription details">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 sm:px-6">
          {dispensingPrescription && (
            <div className="my-4 border border-[#b8d9cc] bg-[#f0f7f4] p-4">
              <h4 className="mb-3 text-sm font-medium text-[#1a1f2e]">Dispensing: {dispensingPrescription.medication}</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#4b5563]">Select Drug</label>
                  <select value={selectedDrugId} onChange={(e) => setSelectedDrugId(e.target.value)} className="w-full border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#1a5c7a] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a]">
                    <option value="">Select inventory drug</option>
                    {matchingDrugs.map((drug) => (
                      <option key={drug.id} value={drug.id}>
                        {drug.name} ({drug.quantityInStock ?? drug.stock_quantity ?? 0} in stock)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#4b5563]">Quantity</label>
                  <input type="number" min="1" value={dispenseQuantity} onChange={(e) => setDispenseQuantity(Number(e.target.value))} className="w-full border border-[#d1d5db] px-3 py-2 text-sm focus:border-[#1a5c7a] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a]" />
                </div>
                <div className="flex items-end gap-2">
                  <ButtonWithTooltip onClick={submitDispense} disabled={isDispensing || !selectedDrugId || !dispenseQuantity} tooltip="Confirm dispensing" variant="success" className="text-xs">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {isDispensing ? 'Dispensing...' : 'Dispense'}
                  </ButtonWithTooltip>
                  <ButtonWithTooltip onClick={cancelDispense} tooltip="Cancel dispensing" variant="secondary" className="text-xs">
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </ButtonWithTooltip>
                </div>
              </div>
            </div>
          )}

          <div className="divide-y divide-[#f3f5f7]">
            {patient.prescriptions.map((prescription) => {
              const isDispensed = prescription.status === 'dispensed' || prescription.status === 'completed';
              return (
                <div key={prescription.prescriptionId} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1a1f2e]">{prescription.medication}</p>
                    <p className="mt-1 text-xs text-[#4b5563]">{prescription.dosage || 'Dose not recorded'} · {prescription.frequency || 'Frequency not recorded'} · Qty: {prescription.quantity || 1}</p>
                    <p className="mt-1 text-xs text-[#6b7280]">Batch: {prescription.batch || 'Visit batch'} · {prescription.date || 'Date unavailable'}</p>
                    <p className="mt-1 text-xs text-[#6b7280]">Prescribed by: {prescription.prescriber || 'Doctor not recorded'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={prescription.status || 'pending'}>
                      {prescription.status || 'Pending'}
                    </Badge>
                    {!isDispensed && (
                      <ButtonWithTooltip onClick={() => startDispense(prescription)} tooltip="Dispense prescription" variant="success" className="text-xs px-2 py-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Dispense
                      </ButtonWithTooltip>
                    )}
                    {isDispensed && (
                      <Badge status="dispensed">✓ Dispensed</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Prescriptions Table Component
const PrescriptionsTable = ({ patients, onViewPatient, onDispense, drugs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredPatients = useMemo(() => {
    let filtered = patients;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(patient => 
        patient.name.toLowerCase().includes(query) ||
        (patient.mrn && patient.mrn.toLowerCase().includes(query)) ||
        patient.prescriptions.some(p => 
          p.medication.toLowerCase().includes(query)
        )
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient =>
        patient.prescriptions.some(p => p.status === statusFilter)
      );
    }
    
    return filtered;
  }, [patients, searchQuery, statusFilter]);

  const statusFilterOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'prescribed', label: 'Prescribed' },
    { value: 'pending', label: 'Pending' },
    { value: 'dispensed', label: 'Dispensed' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="relative flex-1 max-w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients or drugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2 text-sm rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all cursor-pointer bg-white"
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          <IconButton icon={Printer} onClick={() => window.print()} tooltip="Print" size="sm" />
          <IconButton icon={Download} onClick={() => {}} tooltip="Export" size="sm" />
        </div>
      </div>

      {/* Table */}
      {filteredPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No prescriptions found</p>
          <p className="text-sm text-gray-400 mt-1">
            {searchQuery ? 'Try adjusting your search' : 'No pending prescriptions available'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latest Batch</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Prescribed By</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3">
                    <span className="font-medium text-gray-900">{patient.name}</span>
                    <span className="block text-xs text-gray-400">MRN: {patient.mrn || 'N/A'}</span>
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600">
                    {patient.latest?.batch || 'Visit batch'}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 hidden md:table-cell">
                    {patient.latest?.date || 'N/A'}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600 hidden lg:table-cell">
                    {patient.latest?.prescriber || 'Doctor not recorded'}
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {patient.prescriptions.length}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-0.5">
                      <IconButton 
                        icon={Eye} 
                        tooltip="View Details" 
                        variant="primary" 
                        size="sm" 
                        onClick={() => onViewPatient(patient)}
                      />
                      <IconButton icon={Printer} tooltip="Print" variant="default" size="sm" />
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
  const [selectedPrescriptionPatient, setSelectedPrescriptionPatient] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dispensingPrescriptionId, setDispensingPrescriptionId] = useState(null);
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

  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  const [pendingPrescriptions, setPendingPrescriptions] = useState([]);

  const [prescriptionHistory, setPrescriptionHistory] = useState([]);

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

  const [alerts, setAlerts] = useState([]);

  const [notifications, setNotifications] = useState([]);

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
    loadDashboardInsights();
  }, []);

  const loadDashboardInsights = async () => {
    try {
      const data = await apiRequest('/api/v1/core/dashboard-insights/');
      if (data?.alerts) {
        const normalizedAlerts = (Array.isArray(data.alerts) ? data.alerts : []).map(alert => ({
          id: alert.id || Math.random(),
          type: alert.type || (alert.priority === 'high' ? 'critical' : 'info'),
          message: alert.title || alert.message || '',
          time: alert.time || '',
          read: false,
        }));
        setAlerts(normalizedAlerts);
        setNotifications(normalizedAlerts.slice(0, 3));
      }
      if (data?.tasks) {
        const normalizedPrescriptions = (Array.isArray(data.tasks) ? data.tasks : []).map(task => ({
          id: task.id || Math.random(),
          patient: '',
          medication: task.title || '',
          priority: task.priority || 'Normal',
          time: task.time || '',
          status: 'pending',
        }));
        setPendingPrescriptions(normalizedPrescriptions.slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to load dashboard insights:', err);
    }
  };

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

  const handleDispensePrescription = async (prescription, drugId, quantity) => {
    const id = prescription.prescriptionId;
    if (dispensingPrescriptionId === id) return;
    setDispensingPrescriptionId(id);
    try {
      const drug = apiDrugs.find(d => String(d.id) === String(drugId));
      if (!drug) {
        showErrorModal(
          'Dispense Error',
          'Select an inventory drug that matches this prescription',
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
          quantity: quantity || prescription.quantity || 1,
          unit_price: parseFloat(drug.selling_price || drug.sellingPrice || drug.unit_price || drug.unitPrice || 0),
          instructions: prescription.instructions || '',
        }),
      });

      setApiPrescriptions(prev => prev.filter(p => p.prescriptionId !== id));
      setPendingPrescriptions(prev => prev.filter(p => p.id !== id));
      setSelectedPrescriptionPatient(prev => {
        if (!prev) return prev;
        const prescriptions = prev.prescriptions.filter(item => item.prescriptionId !== id);
        return prescriptions.length ? { ...prev, prescriptions, latest: prescriptions[0] } : null;
      });
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
    } finally {
      setDispensingPrescriptionId(null);
    }
  };

  const fetchPendingPrescriptions = async () => {
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
        patientMrn: rx.patient_mrn || '',
        batch: rx.visit_number || `Visit ${rx.visit || ''}`,
        prescriber: rx.prescribed_by_name || 'Doctor not recorded',
        status: rx.status || 'prescribed',
        dosage: rx.dosage || '',
        frequency: rx.frequency || '',
        quantity: rx.quantity || 1,
      }));
      setApiPrescriptions(normalized.sort((a, b) => new Date(b.prescribed_date || 0) - new Date(a.prescribed_date || 0)));
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

    fetchData();
    fetchPendingPrescriptions();
  }, []);

  useEffect(() => {
    const refreshOnFocus = () => fetchPendingPrescriptions();
    const refreshAfterPrescriptionCreated = () => fetchPendingPrescriptions();
    window.addEventListener('focus', refreshOnFocus);
    window.addEventListener('prescriptionCreated', refreshAfterPrescriptionCreated);
    return () => {
      window.removeEventListener('focus', refreshOnFocus);
      window.removeEventListener('prescriptionCreated', refreshAfterPrescriptionCreated);
    };
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

  const prescriptionPatients = useMemo(() => {
    const grouped = new Map();
    apiPrescriptions.forEach((prescription) => {
      const patientId = prescription.patientId || prescription.patient || prescription.patient_name;
      if (!grouped.has(patientId)) {
        grouped.set(patientId, {
          id: patientId,
          name: prescription.patient,
          mrn: prescription.patientMrn,
          prescriptions: [],
        });
      }
      grouped.get(patientId).prescriptions.push(prescription);
    });

    return Array.from(grouped.values()).map((patient) => {
      const sorted = patient.prescriptions.sort((a, b) => new Date(b.prescribed_date || b.date || 0) - new Date(a.prescribed_date || a.date || 0));
      const batches = Array.from(new Map(sorted.map((item) => [item.batch || item.visit || item.date, item])).values());
      return { ...patient, prescriptions: sorted, latest: sorted[0], batchCount: batches.length };
    }).sort((a, b) => new Date(b.latest?.prescribed_date || b.latest?.date || 0) - new Date(a.latest?.prescribed_date || a.latest?.date || 0));
  }, [apiPrescriptions]);

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
    { icon: Pill, label: 'Inventory', action: '/pharmacy', color: 'bg-[#1a5c7a]' },
    { icon: FileText, label: 'Prescriptions', action: '/prescriptions', color: 'bg-[#1d7a5e]' },
    { icon: Users, label: 'Patient Profiles', action: '/patients', color: 'bg-[#5a4a7a]' },
    { icon: AlertCircle, label: 'Drug Interactions', action: '/drug-interactions', color: 'bg-[#b8860b]' },
    { icon: Clipboard, label: 'Reports', action: '/reports', color: 'bg-[#b13e3e]' },
    { icon: Building2, label: 'Suppliers', action: '/suppliers', color: 'bg-[#7a5a4a]' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'suppliers', label: 'Suppliers', icon: Building2 },
    { id: 'my-roster', label: 'My Roster', icon: Calendar },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
      'prescribed': { label: 'Prescribed', color: 'bg-amber-100 text-amber-700' },
      'dispensed': { label: 'Dispensed', color: 'bg-emerald-100 text-emerald-700' },
      'completed': { label: 'Completed', color: 'bg-emerald-100 text-emerald-700' },
      'critical': { label: 'Critical', color: 'bg-rose-100 text-rose-700' },
      'warning': { label: 'Warning', color: 'bg-amber-100 text-amber-700' },
      'low': { label: 'Low Stock', color: 'bg-amber-100 text-amber-700' },
      'active': { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
      'High': { label: 'High', color: 'bg-rose-100 text-rose-700' },
      'Normal': { label: 'Normal', color: 'bg-blue-100 text-blue-700' },
      'info': { label: 'Info', color: 'bg-blue-100 text-blue-700' },
      'success': { label: 'Success', color: 'bg-emerald-100 text-emerald-700' },
      'ok': { label: 'OK', color: 'bg-emerald-100 text-emerald-700' },
      'inactive': { label: 'Inactive', color: 'bg-gray-100 text-gray-600' },
    };
    return statusMap[status] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-600' };
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
      case 'my-roster':
        return <MyRosterTab />;
      case 'alerts':
        return renderAlertsContent();
      default:
        return renderOverviewContent();
    }
  };

  const renderOverviewContent = () => {
    return (
      <>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Pending Prescriptions"
            value={stats.prescriptionsPending}
            icon={FileText}
            color="blue"
          />
          <StatsCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            icon={AlertCircle}
            color="red"
          />
          <StatsCard
            title="Expiring Soon"
            value={stats.expiringSoon}
            icon={Clock}
            color="warm"
          />
          <StatsCard
            title="Dispensed Today"
            value={stats.dispensedToday}
            icon={Pill}
            color="green"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-sm font-medium font-sans text-[#4b5563] mb-3 uppercase tracking-wider">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Tooltip key={index} text={`Go to ${action.label}`}>
                  <button
                    onClick={() => navigate(action.action)}
                    className={`${action.color} text-white p-4 transition-opacity hover:opacity-80 flex flex-col items-center justify-center h-16 sm:h-20 rounded-lg`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                    <span className="text-[10px] sm:text-xs font-medium font-sans text-center">{action.label}</span>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Upcoming Duty Roster */}
        <UpcomingRosterWidget />

        {/* Prescriptions & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#e5e7eb] p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium font-sans text-[#1a1f2e] uppercase tracking-wider">Pending Prescriptions</h3>
              <ButtonWithTooltip
                onClick={() => setActiveTab('prescriptions')}
                tooltip="View all prescriptions"
                variant="secondary"
                className="text-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                View All
              </ButtonWithTooltip>
            </div>
            <div className="space-y-3">
              {prescriptionPatients.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-[#d1d5db] mx-auto mb-2" />
                  <p className="text-[#6b7280] text-sm font-sans">No pending prescriptions</p>
                </div>
              ) : (
                prescriptionPatients.slice(0, 5).map((patient) => {
                  const pendingCount = patient.prescriptions.filter(p => p.status === 'prescribed' || p.status === 'pending').length;
                  return (
                    <div key={patient.id} className="flex items-center justify-between p-3 bg-[#f9fafb] border-l-2 border-[#1a5c7a] rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium font-sans text-[#1a1f2e]">{patient.name}</p>
                        <p className="text-xs font-sans text-[#6b7280]">
                          {patient.prescriptions.length} prescription(s) · {pendingCount} pending
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge status={pendingCount > 0 ? 'pending' : 'dispensed'}>
                          {pendingCount > 0 ? `${pendingCount} Pending` : 'All Dispensed'}
                        </Badge>
                        <ButtonWithTooltip
                          onClick={() => setSelectedPrescriptionPatient(patient)}
                          tooltip="View patient prescriptions"
                          variant="primary"
                          className="text-xs px-2 py-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </ButtonWithTooltip>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white border border-[#e5e7eb] p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium font-sans text-[#1a1f2e] uppercase tracking-wider">Low Stock Alerts</h3>
              <ButtonWithTooltip
                onClick={() => navigate('/pharmacy')}
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
                  <Package className="w-12 h-12 text-[#d1d5db] mx-auto mb-2" />
                  <p className="text-[#6b7280] text-sm font-sans">All items well stocked</p>
                </div>
              ) : (
                displayLowStockAlerts.slice(0, 5).map((item) => {
                  const status = getStatusBadge(item.status);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-[#fdf2f2] border-l-2 border-[#b13e3e] rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium font-sans text-[#1a1f2e]">{item.drug}</p>
                        <p className="text-xs font-sans text-[#6b7280]">
                          Current: {item.current} • Reorder: {item.reorder}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge status={status.label.toLowerCase()}>{status.label}</Badge>
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
          <h2 className="text-sm font-medium font-sans text-[#1a1f2e] uppercase tracking-wider">Prescriptions</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Refresh prescriptions"
              variant="secondary"
              onClick={() => {
                const fetchPrescriptions = async () => {
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
                      patientMrn: rx.patient_mrn || '',
                      batch: rx.visit_number || `Visit ${rx.visit || ''}`,
                      prescriber: rx.prescribed_by_name || 'Doctor not recorded',
                      status: rx.status || 'prescribed',
                      dosage: rx.dosage || '',
                      frequency: rx.frequency || '',
                      quantity: rx.quantity || 1,
                    }));
                    setApiPrescriptions(normalized.sort((a, b) => new Date(b.prescribed_date || 0) - new Date(a.prescribed_date || 0)));
                  } catch (err) {
                    showErrorModal('Refresh Error', 'Failed to refresh prescriptions', err.message);
                  }
                };
                fetchPrescriptions();
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </ButtonWithTooltip>
          </div>
        </div>

        {loadingPrescriptions ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#1a5c7a] animate-spin mb-3" />
            <p className="text-gray-500">Loading prescriptions...</p>
          </div>
        ) : (
          <PrescriptionsTable
            patients={prescriptionPatients}
            onViewPatient={setSelectedPrescriptionPatient}
            onDispense={handleDispensePrescription}
            drugs={apiDrugs}
          />
        )}
      </div>
    );
  };

  const renderInventoryContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium font-sans text-[#1a1f2e] uppercase tracking-wider">Inventory</h2>
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

        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider">Item</th>
                <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider hidden sm:table-cell">Stock</th>
                <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider hidden md:table-cell">Price (₦)</th>
                <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f5f7]">
              {displayInventoryItems.map((item) => {
                const status = getStatusBadge(item.status);
                return (
                  <tr key={item.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="py-3">
                      <span className="text-sm font-sans text-[#1a1f2e]">{item.name}</span>
                    </td>
                    <td className="py-3 text-sm font-sans text-[#4b5563]">{item.category}</td>
                    <td className="py-3 text-sm font-sans text-[#4b5563]">{item.stock}</td>
                    <td className="py-3 text-sm font-sans text-[#4b5563]">₦{item.price}</td>
                    <td className="py-3">
                      <Badge status={item.status}>{status.label}</Badge>
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
          <h2 className="text-sm font-medium font-sans text-[#1a1f2e] uppercase tracking-wider">Suppliers</h2>
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
          <div className="flex flex-col items-center justify-center py-8 text-[#6b7280]">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <span className="font-sans">Loading suppliers...</span>
          </div>
        ) : apiSuppliers.length === 0 ? (
          <div className="text-center py-8 text-[#6b7280] font-sans">No suppliers found</div>
        ) : (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider">Supplier</th>
                  <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider hidden sm:table-cell">Phone</th>
                  <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider hidden md:table-cell">Email</th>
                  <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="pb-2 text-left text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f5f7]">
                {apiSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#6b7280]" />
                        <span className="text-sm font-sans text-[#1a1f2e]">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm font-sans text-[#4b5563]">{supplier.contact_person || '-'}</td>
                    <td className="py-3 text-sm font-sans text-[#4b5563]">{supplier.phone || '-'}</td>
                    <td className="py-3 text-sm font-sans text-[#4b5563]">{supplier.email || '-'}</td>
                    <td className="py-3">
                      <Badge status={supplier.is_active ? 'active' : 'inactive'}>
                        {supplier.is_active ? 'Active' : 'Inactive'}
                      </Badge>
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
          <h2 className="text-sm font-medium font-sans text-[#1a1f2e] uppercase tracking-wider">Alerts & Notifications</h2>
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
            <h4 className="text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider mb-2">Critical Alerts</h4>
            {alerts.filter(a => a.type === 'critical').length === 0 ? (
              <p className="text-sm font-sans text-[#6b7280]">No critical alerts</p>
            ) : (
              alerts.filter(a => a.type === 'critical').map((alert) => (
                <div key={alert.id} className={`flex items-center justify-between p-3 bg-[#fdf2f2] border-l-2 border-[#b13e3e] mb-2 ${alert.read ? 'opacity-60' : ''}`}>
                  <div className="flex items-center flex-1">
                    <AlertCircle className="w-5 h-5 text-[#b13e3e] mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium font-sans text-[#1a1f2e]">{alert.message}</p>
                      <p className="text-xs font-sans text-[#6b7280]">{alert.time}</p>
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
            <h4 className="text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider mb-2">All Alerts</h4>
            {alerts.filter(a => a.type !== 'critical').length === 0 ? (
              <p className="text-sm font-sans text-[#6b7280]">No alerts</p>
            ) : (
              alerts.filter(a => a.type !== 'critical').map((alert) => {
                const status = getStatusBadge(alert.type);
                return (
                  <div key={alert.id} className={`flex items-center justify-between p-3 bg-[#f9fafb] border-l-2 border-[#d1d5db] mb-2 ${alert.read ? 'opacity-60' : ''}`}>
                    <div className="flex items-center flex-1">
                      <AlertCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${
                        alert.type === 'warning' ? 'text-[#b8860b]' : 'text-[#1a5c7a]'
                      }`} />
                      <div>
                        <p className="text-sm font-medium font-sans text-[#1a1f2e]">{alert.message}</p>
                        <p className="text-xs font-sans text-[#6b7280]">{alert.time}</p>
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
            <h4 className="text-xs font-medium font-sans text-[#6b7280] uppercase tracking-wider mb-2">Notifications</h4>
            {notifications.length === 0 ? (
              <p className="text-sm font-sans text-[#6b7280]">No notifications</p>
            ) : (
              notifications.map((notif) => {
                const status = getStatusBadge(notif.type);
                return (
                  <div key={notif.id} className={`flex items-center justify-between p-3 bg-[#f0f7f9] border-l-2 border-[#1a5c7a] mb-2 ${notif.read ? 'opacity-60' : ''}`}>
                    <div className="flex items-center flex-1">
                      <Info className="w-5 h-5 text-[#1a5c7a] mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium font-sans text-[#1a1f2e]">{notif.message}</p>
                        <p className="text-xs font-sans text-[#6b7280]">{notif.time}</p>
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
    <div className="min-h-screen bg-[#f3f5f7] font-sans antialiased p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-[#1a1f2e]">
              Welcome back, {displayUserName}
            </h1>
            <p className="text-sm font-sans text-[#6b7280] mt-1">
              {displayTenantName} · {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ButtonWithTooltip
              tooltip="View notifications"
              variant="secondary"
              className="relative"
            >
              <Bell className="w-4 h-4" />
              {alerts.filter(a => !a.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b13e3e] text-white text-[10px] font-sans flex items-center justify-center rounded-full">
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
              <span className="hidden sm:inline text-sm font-sans">Profile</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleOpenChangePassword}
              tooltip="Change Password"
              variant="secondary"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-sans">Change Password</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Additional Stats - Extended metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-[#e5e7eb] p-3 rounded-lg">
          <p className="text-xs font-sans text-[#6b7280]">Total Inventory</p>
          <p className="text-lg font-display font-bold text-[#1a1f2e]">{stats.totalInventory}</p>
        </div>
        <div className="bg-white border border-[#e5e7eb] p-3 rounded-lg">
          <p className="text-xs font-sans text-[#6b7280]">Inventory Value</p>
          <p className="text-lg font-display font-bold text-[#1d7a5e]">₦{stats.inventoryValue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-[#e5e7eb] p-3 rounded-lg">
          <p className="text-xs font-sans text-[#6b7280]">Suppliers</p>
          <p className="text-lg font-display font-bold text-[#1a1f2e]">{stats.totalSuppliers}</p>
        </div>
        <div className="bg-white border border-[#e5e7eb] p-3 rounded-lg">
          <p className="text-xs font-sans text-[#6b7280]">Active Prescriptions</p>
          <p className="text-lg font-display font-bold text-[#1a5c7a]">{stats.prescriptionsPending}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e5e7eb] mb-6 overflow-x-auto">
        <nav className="flex gap-6 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tooltip key={tab.id} text={`View ${tab.label}`}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-0 py-3 text-sm font-medium font-sans border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#1a5c7a] text-[#1a5c7a]'
                      : 'border-transparent text-[#6b7280] hover:text-[#1a1f2e] hover:border-[#d1d5db]'
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

      <div className="bg-white border border-[#e5e7eb] p-4 sm:p-6 rounded-xl">
        {renderTabContent()}
      </div>

      <PrescriptionPatientModal
        patient={selectedPrescriptionPatient}
        drugs={apiDrugs}
        onClose={() => setSelectedPrescriptionPatient(null)}
        onDispense={handleDispensePrescription}
      />

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
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowInventoryModal(false)} />
            <div className="relative bg-white shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-[#e5e7eb] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-display font-bold text-[#1a1f2e]">
                  {editingInventoryId ? 'Edit Drug / Inventory Item' : 'Add Drug / Inventory Item'}
                </h2>
                <button onClick={() => setShowInventoryModal(false)} className="p-2 hover:bg-[#f3f5f7] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddInventory} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="border-b border-[#e5e7eb] pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium font-sans text-[#1a1f2e] mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Drug Name *</label>
                      <input type="text" value={inventoryForm.name} onChange={(e) => setInventoryForm({...inventoryForm, name: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Generic Name</label>
                      <input type="text" value={inventoryForm.genericName} onChange={(e) => setInventoryForm({...inventoryForm, genericName: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Brand Name</label>
                      <input type="text" value={inventoryForm.brandName} onChange={(e) => setInventoryForm({...inventoryForm, brandName: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Drug Code</label>
                      <input type="text" value={inventoryForm.drugCode} onChange={(e) => setInventoryForm({...inventoryForm, drugCode: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" placeholder="e.g., ANT-MAL-001" />
                    </div>
                  </div>
                </div>

                {/* Regulatory Information */}
                <div className="border-b border-[#e5e7eb] pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium font-sans text-[#1a1f2e] mb-3">Regulatory Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">NAFDAC Number</label>
                      <input type="text" value={inventoryForm.nafdacNumber} onChange={(e) => setInventoryForm({...inventoryForm, nafdacNumber: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" placeholder="NAFDAC-04-1234" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">PCN Approval Number</label>
                      <input type="text" value={inventoryForm.pcnApprovalNumber} onChange={(e) => setInventoryForm({...inventoryForm, pcnApprovalNumber: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">NEML Category</label>
                      <select value={inventoryForm.nemlCategory} onChange={(e) => setInventoryForm({...inventoryForm, nemlCategory: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]">
                        <option value="">Select Category</option>
                        {nemlCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Manufacturer</label>
                      <select value={inventoryForm.manufacturer} onChange={(e) => setInventoryForm({...inventoryForm, manufacturer: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]">
                        <option value="">Select Manufacturer</option>
                        {nigerianManufacturers.map(man => <option key={man} value={man}>{man}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Specifications */}
                <div className="border-b border-[#e5e7eb] pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium font-sans text-[#1a1f2e] mb-3">Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Strength</label>
                      <input type="text" value={inventoryForm.strength} onChange={(e) => setInventoryForm({...inventoryForm, strength: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" placeholder="e.g., 500mg" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Dosage Form *</label>
                      <select value={inventoryForm.dosageForm} onChange={(e) => setInventoryForm({...inventoryForm, dosageForm: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" required>
                        <option value="">Select Form</option>
                        {dosageForms.map(form => <option key={form.value} value={form.value}>{form.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Category *</label>
                      <select value={inventoryForm.category} onChange={(e) => setInventoryForm({...inventoryForm, category: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" required>
                        <option value="">Select Category</option>
                        {drugCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Therapeutic Class</label>
                      <input type="text" value={inventoryForm.therapeuticClass} onChange={(e) => setInventoryForm({...inventoryForm, therapeuticClass: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                    </div>
                  </div>
                </div>

                {/* Inventory Information */}
                <div className="border-b border-[#e5e7eb] pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium font-sans text-[#1a1f2e] mb-3">Inventory</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Unit Price (₦)</label>
                      <input type="number" value={inventoryForm.unitPrice} onChange={(e) => setInventoryForm({...inventoryForm, unitPrice: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" min="0" step="0.01" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Selling Price (₦)</label>
                      <input type="number" value={inventoryForm.sellingPrice} onChange={(e) => setInventoryForm({...inventoryForm, sellingPrice: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" min="0" step="0.01" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Quantity in Stock</label>
                      <input type="number" value={inventoryForm.quantity} onChange={(e) => setInventoryForm({...inventoryForm, quantity: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Reorder Level</label>
                      <input type="number" value={inventoryForm.reorderLevel} onChange={(e) => setInventoryForm({...inventoryForm, reorderLevel: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Reorder Quantity</label>
                      <input type="number" value={inventoryForm.reorderQuantity} onChange={(e) => setInventoryForm({...inventoryForm, reorderQuantity: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" min="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Batch Number</label>
                      <input type="text" value={inventoryForm.batchNumber} onChange={(e) => setInventoryForm({...inventoryForm, batchNumber: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Expiry Date</label>
                      <input type="date" value={inventoryForm.expiryDate} onChange={(e) => setInventoryForm({...inventoryForm, expiryDate: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Storage Conditions</label>
                      <input type="text" value={inventoryForm.storageConditions} onChange={(e) => setInventoryForm({...inventoryForm, storageConditions: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" placeholder="e.g., Room temperature, Refrigerated" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Unit of Measure</label>
                      <input type="text" value={inventoryForm.unitOfMeasure} onChange={(e) => setInventoryForm({...inventoryForm, unitOfMeasure: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" placeholder="tablet, capsule, ml, etc." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Supplier</label>
                      <input type="text" value={inventoryForm.supplier} onChange={(e) => setInventoryForm({...inventoryForm, supplier: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Country of Origin</label>
                      <input type="text" value={inventoryForm.countryOfOrigin} onChange={(e) => setInventoryForm({...inventoryForm, countryOfOrigin: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                    </div>
                  </div>
                </div>

                {/* Controlled Substance */}
                <div className="border-b border-[#e5e7eb] pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium font-sans text-[#1a1f2e] mb-3">Controlled Substance</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={inventoryForm.controlledSubstance} onChange={(e) => setInventoryForm({...inventoryForm, controlledSubstance: e.target.checked})} className="h-4 w-4 text-[#1a5c7a] focus:ring-[#1a5c7a] border-[#d1d5db]" />
                      <label className="text-sm font-sans text-[#1a1f2e]">Controlled Substance</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={inventoryForm.narcotic} onChange={(e) => setInventoryForm({...inventoryForm, narcotic: e.target.checked})} className="h-4 w-4 text-[#1a5c7a] focus:ring-[#1a5c7a] border-[#d1d5db]" />
                      <label className="text-sm font-sans text-[#1a1f2e]">Narcotic</label>
                    </div>
                    {inventoryForm.controlledSubstance && (
                      <div>
                        <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Schedule</label>
                        <select value={inventoryForm.schedule} onChange={(e) => setInventoryForm({...inventoryForm, schedule: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]">
                          <option value="">Select Schedule</option>
                          {controlledSchedules.map(schedule => <option key={schedule} value={schedule}>{schedule}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* NHIS Information */}
                <div className="border-b border-[#e5e7eb] pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium font-sans text-[#1a1f2e] mb-3">NHIS Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={inventoryForm.nhisCovered} onChange={(e) => setInventoryForm({...inventoryForm, nhisCovered: e.target.checked})} className="h-4 w-4 text-[#1a5c7a] focus:ring-[#1a5c7a] border-[#d1d5db]" />
                      <label className="text-sm font-sans text-[#1a1f2e]">NHIS Covered</label>
                    </div>
                    {inventoryForm.nhisCovered && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">NHIS Code</label>
                          <input type="text" value={inventoryForm.nhisCode} onChange={(e) => setInventoryForm({...inventoryForm, nhisCode: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">NHIS Price (₦)</label>
                          <input type="number" value={inventoryForm.nhisPrice} onChange={(e) => setInventoryForm({...inventoryForm, nhisPrice: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" min="0" step="0.01" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Clinical Information */}
                <div className="border-b border-[#e5e7eb] pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium font-sans text-[#1a1f2e] mb-3">Clinical Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Dosage Instructions</label>
                      <textarea value={inventoryForm.dosageInstructions} onChange={(e) => setInventoryForm({...inventoryForm, dosageInstructions: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" rows="2" placeholder="e.g., Take 1 tablet twice daily after meals" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Side Effects</label>
                      <textarea value={inventoryForm.sideEffects} onChange={(e) => setInventoryForm({...inventoryForm, sideEffects: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" rows="2" placeholder="List common side effects" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Contraindications</label>
                      <textarea value={inventoryForm.contraindications} onChange={(e) => setInventoryForm({...inventoryForm, contraindications: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" rows="2" placeholder="List contraindications" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Interactions</label>
                      <textarea value={inventoryForm.interactions} onChange={(e) => setInventoryForm({...inventoryForm, interactions: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" rows="2" placeholder="List drug interactions" />
                    </div>
                  </div>
                </div>

                {/* Prescription Requirement */}
                <div className="border-b border-[#e5e7eb] pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium font-sans text-[#1a1f2e] mb-3">Prescription Settings</h4>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={inventoryForm.prescriptionRequired} onChange={(e) => setInventoryForm({...inventoryForm, prescriptionRequired: e.target.checked})} className="h-4 w-4 text-[#1a5c7a] focus:ring-[#1a5c7a] border-[#d1d5db]" />
                    <label className="text-sm font-sans text-[#1a1f2e]">Prescription Required</label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-[#1a5c7a] text-white py-2.5 sm:py-3 px-4 hover:bg-[#0e3d52] transition-colors font-medium font-sans text-sm rounded-lg">
                    {editingInventoryId ? 'Update Drug' : 'Add Drug'}
                  </button>
                  <button type="button" onClick={() => setShowInventoryModal(false)} className="flex-1 bg-[#e5e7eb] text-[#1a1f2e] py-2.5 sm:py-3 px-4 hover:bg-[#d1d5db] transition-colors font-medium font-sans text-sm rounded-lg">
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
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowSupplierModal(false)} />
            <div className="relative bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-[#e5e7eb] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-display font-bold text-[#1a1f2e]">
                  {editingSupplierId ? 'Edit Supplier' : 'Add New Supplier'}
                </h2>
                <button onClick={() => setShowSupplierModal(false)} className="p-2 hover:bg-[#f3f5f7] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddSupplier} className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Supplier Name *</label>
                    <input type="text" value={supplierForm.name} onChange={(e) => setSupplierForm({...supplierForm, name: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Contact Person</label>
                    <input type="text" value={supplierForm.contactPerson} onChange={(e) => setSupplierForm({...supplierForm, contactPerson: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Phone</label>
                    <input type="text" value={supplierForm.phone} onChange={(e) => setSupplierForm({...supplierForm, phone: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Email</label>
                    <input type="email" value={supplierForm.email} onChange={(e) => setSupplierForm({...supplierForm, email: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Address</label>
                    <textarea value={supplierForm.address} onChange={(e) => setSupplierForm({...supplierForm, address: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" rows="2" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">License Number</label>
                    <input type="text" value={supplierForm.licenseNumber} onChange={(e) => setSupplierForm({...supplierForm, licenseNumber: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Rating</label>
                    <input type="number" value={supplierForm.rating} onChange={(e) => setSupplierForm({...supplierForm, rating: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" min="0" max="5" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium font-sans text-[#4b5563] mb-1">Notes</label>
                    <textarea value={supplierForm.notes} onChange={(e) => setSupplierForm({...supplierForm, notes: e.target.value})} className="w-full px-3 py-2 text-sm font-sans border border-[#d1d5db] focus:outline-none focus:ring-1 focus:ring-[#1a5c7a] focus:border-[#1a5c7a]" rows="2" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-[#1a5c7a] text-white py-2.5 sm:py-3 px-4 hover:bg-[#0e3d52] transition-colors font-medium font-sans text-sm rounded-lg">
                    {editingSupplierId ? 'Update Supplier' : 'Add Supplier'}
                  </button>
                  <button type="button" onClick={() => setShowSupplierModal(false)} className="flex-1 bg-[#e5e7eb] text-[#1a1f2e] py-2.5 sm:py-3 px-4 hover:bg-[#d1d5db] transition-colors font-medium font-sans text-sm rounded-lg">
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