import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiRequest } from '../../utils/api';
import ConsultationV2 from '../../pages/ConsultationV2';
import ChangePasswordModal from '../ChangePasswordModal';
import MyRosterTab from './MyRosterTab';
import { setPatients } from '../../features/patientSlice';
import {  Users,  Stethoscope,  Activity,  AlertCircle,  RotateCcw,  Calendar,
FileText,  Heart,  Clock,  Eye,  ChevronLeft,  Edit,  Trash2,  X, 
Clipboard, Stethoscope as StethoscopeIcon,
CheckCircle, UserPlus, Plus,  Phone,   MapPin,  Map, Building2, UserCircle,  IdCard, 
Calendar as CalendarIcon2, User as UserIcon, HeartPulse as HeartPulseIcon,  Brain as BrainIcon,  
Droplets as DropletsIcon, MoreVertical,  Upload,  Loader2,} from 'lucide-react';

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
          <div className="bg-[#1A1A1A] text-white text-[10px] px-2 py-1 shadow-lg rounded">
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
const IconButton = ({ icon: Icon, onClick, variant = 'default', className = '', disabled = false }) => {
  const variantClasses = {
    default: 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]',
    primary: 'text-[#008751] hover:text-[#006B40] hover:bg-[#E8F5EF]',
    success: 'text-[#2D7D46] hover:text-[#1E5F33] hover:bg-[#EAF3EE]',
    danger: 'text-[#C8553D] hover:text-[#A8442E] hover:bg-[#F5EDEA]',
    warning: 'text-[#C87D3D] hover:text-[#A8662E] hover:bg-[#F5F0EA]',
    info: 'text-[#008751] hover:text-[#006B40] hover:bg-[#E8F5EF]',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1 sm:p-1.5 rounded transition-all duration-200 ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </button>
  );
};

// ==================== ICON BUTTON WITH TOOLTIP ====================
const IconButtonWithTooltip = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false }) => {
  return (
    <Tooltip text={tooltip}>
      <IconButton
        icon={Icon}
        onClick={onClick}
        variant={variant}
        className={className}
        disabled={disabled}
      />
    </Tooltip>
  );
};

// ==================== BUTTON ====================
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variantClasses = {
    primary: 'bg-[#008751] hover:bg-[#006B40] text-white',
    secondary: 'bg-white border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
    success: 'bg-[#2D7D46] hover:bg-[#1E5F33] text-white',
    danger: 'bg-[#C8553D] hover:bg-[#A8442E] text-white',
    warning: 'bg-[#C87D3D] hover:bg-[#A8662E] text-white',
    outline: 'border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-2 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 text-[10px] xs:text-xs sm:text-sm rounded transition-all duration-200 flex items-center gap-1 xs:gap-1.5 sm:gap-2 font-medium ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
};

// ==================== BUTTON WITH TOOLTIP ====================
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '', disabled = false }) => {
  return (
    <Tooltip text={tooltip}>
      <Button
        onClick={onClick}
        variant={variant}
        className={className}
        disabled={disabled}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

// ==================== STATS CARD ====================
const StatsCard = ({ title, value, subValue, icon: Icon, color, onClick }) => {
  const colorMap = {
    green: 'bg-[#008751]',
    gold: 'bg-[#FFC107]',
    terracotta: 'bg-[#C8553D]',
    warm: 'bg-[#C87D3D]',
    slate: 'bg-[#4A5A5A]',
    teal: 'bg-[#0D6B6B]',
  };

  const iconColorMap = {
    green: 'text-[#008751] bg-[#E8F5EF]',
    gold: 'text-[#FFC107] bg-[#FFF8E1]',
    terracotta: 'text-[#C8553D] bg-[#F5EDEA]',
    warm: 'text-[#C87D3D] bg-[#F5F0EA]',
    slate: 'text-[#4A5A5A] bg-[#F0EDE8]',
    teal: 'text-[#0D6B6B] bg-[#E8F5EF]',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-[#E8E3DC] p-3 sm:p-4 lg:p-5 ${onClick ? 'cursor-pointer hover:border-[#008751] transition-colors' : ''} rounded-lg`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[8px] xs:text-[9px] sm:text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
          <p className="mt-0.5 sm:mt-1 text-base sm:text-xl lg:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight truncate">{value}</p>
          {subValue && (
            <p className="text-[8px] xs:text-[9px] sm:text-xs text-[#5A5A5A] mt-0.5 truncate">{subValue}</p>
          )}
        </div>
        <div className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 ${iconColorMap[color]} rounded flex items-center justify-center flex-shrink-0 ml-1 sm:ml-2 lg:ml-3`}>
          <Icon className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5" />
        </div>
      </div>
    </div>
  );
};

// ==================== PATIENT DETAIL MODAL ====================
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
      'active': 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      'inactive': 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      'archived': 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      'critical': 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
      'stable': 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      'monitoring': 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]',
    };
    return statusMap[status?.toLowerCase()] || 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
  };

  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === 'male') return <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#008751]" />;
    if (gender?.toLowerCase() === 'female') return <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8553D]" />;
    return <UserCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5A5A5A]" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-2 xs:p-3 sm:p-4">
        <div className="relative bg-[#F7F5F2] w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden transform transition-all duration-300 rounded-lg">
          {/* Header */}
          <div className="border-b border-[#E8E3DC] p-3 xs:p-4 sm:p-6 bg-white">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
                <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#E8F5EF] border-2 border-[#008751] flex items-center justify-center text-lg xs:text-xl sm:text-2xl font-display font-bold text-[#008751] flex-shrink-0">
                  {getInitials(patient.name)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-display font-bold text-[#1A1A1A] truncate">{patient.name}</h2>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 mt-0.5 sm:mt-1 text-[10px] xs:text-xs sm:text-sm text-[#5A5A5A]">
                    <span className="flex items-center gap-0.5 sm:gap-1">
                      {getGenderIcon(patient.gender)}
                      <span className="hidden xs:inline">{patient.gender || 'Not specified'}</span>
                    </span>
                    {patient.age && (
                      <span className="flex items-center gap-0.5 sm:gap-1">
                        <CalendarIcon2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden xs:inline">{patient.age} years</span>
                        <span className="xs:hidden">{patient.age}y</span>
                      </span>
                    )}
                    {patient.mrn && (
                      <span className="flex items-center gap-0.5 sm:gap-1 hidden sm:flex">
                        <IdCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        MRN: {patient.mrn}
                      </span>
                    )}
                    {patient.hospital_number && (
                      <span className="flex items-center gap-0.5 sm:gap-1 hidden md:flex">
                        <IdCard className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        HN: {patient.hospital_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-[#F0EDE8] rounded transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A5A5A]" />
              </button>
            </div>
            <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1 sm:gap-2">
              <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 text-[8px] xs:text-[10px] sm:text-xs font-medium border ${getStatusColor(patient.status)} rounded`}>
                {patient.status || 'Active'}
              </span>
              {patient.bloodType && (
                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 text-[8px] xs:text-[10px] sm:text-xs font-medium border border-[#E8D6D0] bg-[#F5EDEA] text-[#C8553D] rounded">
                  <DropletsIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" />
                  {patient.bloodType}
                </span>
              )}
              {patient.genotype && (
                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 text-[8px] xs:text-[10px] sm:text-xs font-medium border border-[#C8DDDB] bg-[#E8F5EF] text-[#0D6B6B] rounded">
                  <BrainIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" />
                  Genotype: {patient.genotype}
                </span>
              )}
              {patient.has_insurance && (
                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 text-[8px] xs:text-[10px] sm:text-xs font-medium border border-[#D0E3D8] bg-[#EAF3EE] text-[#2D7D46] rounded">
                  <ShieldIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5" />
                  Insured
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-3 xs:p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="bg-white border border-[#E8E3DC] p-3 sm:p-4 rounded">
                <h3 className="text-xs sm:text-sm font-display font-semibold text-[#1A1A1A] mb-2 sm:mb-3 flex items-center gap-2">
                  <UserCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#008751]" />
                  Personal Information
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Full Name</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.name}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Date of Birth</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{formatDate(patient.dateOfBirth)}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Age</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.age || 'N/A'} years</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Gender</span>
                    <span className="font-medium text-[#1A1A1A] capitalize truncate">{patient.gender || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">NIN</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.nin || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Marital Status</span>
                    <span className="font-medium text-[#1A1A1A] capitalize truncate">{patient.maritalStatus || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Religion</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.religion || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Ethnicity</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.tribe || patient.ethnicity || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Occupation</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.occupation || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E3DC] p-3 sm:p-4 rounded">
                <h3 className="text-xs sm:text-sm font-display font-semibold text-[#1A1A1A] mb-2 sm:mb-3 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2D7D46]" />
                  Contact Information
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Phone</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.phone || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Email</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.email || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Address</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.address || 'N/A'}</span>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#E8E3DC]">
                  <h4 className="text-[10px] xs:text-xs font-semibold text-[#5A5A5A] mb-1.5 sm:mb-2 flex items-center gap-2">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C87D3D]" />
                    Location
                  </h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                      <span className="text-[#5A5A5A]">Country</span>
                      <span className="font-medium text-[#1A1A1A] truncate">{patient.country || 'Nigeria'}</span>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                      <span className="text-[#5A5A5A]">State</span>
                      <span className="font-medium text-[#1A1A1A] truncate">{patient.state || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                      <span className="text-[#5A5A5A]">LGA</span>
                      <span className="font-medium text-[#1A1A1A] truncate">{patient.lga || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                      <span className="text-[#5A5A5A]">City</span>
                      <span className="font-medium text-[#1A1A1A] truncate">{patient.city || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E3DC] p-3 sm:p-4 rounded">
                <h3 className="text-xs sm:text-sm font-display font-semibold text-[#1A1A1A] mb-2 sm:mb-3 flex items-center gap-2">
                  <HeartPulseIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C8553D]" />
                  Medical Information
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Blood Group</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.bloodType || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Genotype</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.genotype || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Known Allergies</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.known_allergies || 'None'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Chronic Conditions</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.chronic_conditions || 'None'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Current Medications</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.current_medications || 'None'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Surgical History</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.surgical_history || 'None'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Family History</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.family_history || 'None'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E3DC] p-3 sm:p-4 rounded">
                <h3 className="text-xs sm:text-sm font-display font-semibold text-[#1A1A1A] mb-2 sm:mb-3 flex items-center gap-2">
                  <ShieldIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFC107]" />
                  Emergency Contact
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Contact Name</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.emergencyContact || patient.next_of_kin_name || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Contact Phone</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.emergencyPhone || patient.next_of_kin_phone || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Relationship</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.next_of_kin_relationship || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Address</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.next_of_kin_address || 'N/A'}</span>
                  </div>
                </div>
                {patient.has_insurance && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#E8E3DC]">
                    <h4 className="text-[10px] xs:text-xs font-semibold text-[#5A5A5A] mb-1.5 sm:mb-2 flex items-center gap-2">
                      <IdCard className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#008751]" />
                      Insurance Information
                    </h4>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                        <span className="text-[#5A5A5A]">Insurance Company</span>
                        <span className="font-medium text-[#1A1A1A] truncate">{patient.insurance_company || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                        <span className="text-[#5A5A5A]">Policy Number</span>
                        <span className="font-medium text-[#1A1A1A] truncate">{patient.insurance_policy_number || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                        <span className="text-[#5A5A5A]">NHIS Number</span>
                        <span className="font-medium text-[#1A1A1A] truncate">{patient.nhis_number || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-[#E8E3DC] p-3 sm:p-4 rounded md:col-span-2">
                <h3 className="text-xs sm:text-sm font-display font-semibold text-[#1A1A1A] mb-2 sm:mb-3 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#008751]" />
                  Hospital Information
                </h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2">
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Hospital Number</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.hospital_number || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Login ID</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.login_id || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Tenant/Hospital</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.tenant_name || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Registration Date</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{formatDate(patient.registration_date || patient.created_at)}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Last Visit</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{formatDate(patient.lastVisit)}</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                    <span className="text-[#5A5A5A]">Language Spoken</span>
                    <span className="font-medium text-[#1A1A1A] truncate">{patient.language_spoken || 'N/A'}</span>
                  </div>
                </div>
                {patient.notes && (
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#E8E3DC]">
                    <div className="flex flex-col xs:flex-row xs:justify-between text-xs sm:text-sm gap-0.5 xs:gap-0">
                      <span className="text-[#5A5A5A]">Notes</span>
                      <span className="font-medium text-[#1A1A1A] text-right max-w-[60%] truncate">{patient.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#E8E3DC] p-3 xs:p-4 flex flex-wrap justify-end gap-1 xs:gap-2 bg-white">
            <Button
              onClick={onClose}
              variant="secondary"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Close</span>
            </Button>
            <Button
              onClick={() => window.open(`/patients/${patient.id}/consult`, '_blank')}
              variant="primary"
            >
              <StethoscopeIcon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Consult</span>
              <span className="xs:hidden">Consult</span>
            </Button>
            <Button
              onClick={() => window.open(`/patients/${patient.id}/emr`, '_blank')}
              variant="success"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">View EMR</span>
              <span className="xs:hidden">EMR</span>
            </Button>
            <Button
              onClick={() => window.open(`/patients/edit/${patient.id}`, '_blank')}
              variant="warning"
            >
              <Edit className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Edit</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
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
      <div className="flex min-h-full items-center justify-center p-2 xs:p-3 sm:p-4">
        <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden transform transition-all duration-300 rounded-lg">
          <div className="border-b border-[#E8E3DC] p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg md:text-xl font-display font-bold text-[#1A1A1A] truncate">My Profile</h2>
                <p className="text-xs sm:text-sm text-[#5A5A5A] mt-0.5 truncate">View and update your personal information</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-[#E8E3DC] rounded transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#5A5A5A]" />
              </button>
            </div>
          </div>

          <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-180px)]">
            {(error || success) && (
              <div className={`mb-3 sm:mb-4 p-2 sm:p-3 text-xs sm:text-sm whitespace-pre-line ${error ? 'bg-[#F5EDEA] text-[#C8553D] border border-[#E8D6D0]' : 'bg-[#EAF3EE] text-[#2D7D46] border border-[#D0E3D8]'} rounded`}>
                {error || success}
              </div>
            )}

            {!loading && (
              <div className="flex flex-col items-center mb-4 sm:mb-6 md:mb-8">
                <div className="relative">
                  <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full bg-[#E8E3DC] border-2 border-[#D8D4CD] flex items-center justify-center overflow-hidden">
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
                      <UserIcon className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 text-[#5A5A5A]" />
                    </div>
                  </div>
                </div>
                <label className="mt-2 sm:mt-3 cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-white border border-[#D8D4CD] text-[10px] xs:text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F5F2] transition-colors rounded">
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{profilePicturePreview ? 'Change Photo' : 'Upload Photo'}</span>
                  <span className="xs:hidden">{profilePicturePreview ? 'Change' : 'Upload'}</span>
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
                    className="mt-1 text-[10px] xs:text-xs text-[#C8553D] hover:text-[#A8442E]"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#008751] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-[#5A5A5A] text-xs sm:text-sm mt-2">Loading profile...</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div>
                    <label className="block text-[10px] xs:text-xs font-medium text-[#5A5A5A] mb-0.5 sm:mb-1">First Name *</label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => onChange('first_name', e.target.value)}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] xs:text-xs font-medium text-[#5A5A5A] mb-0.5 sm:mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => onChange('last_name', e.target.value)}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div>
                    <label className="block text-[10px] xs:text-xs font-medium text-[#5A5A5A] mb-0.5 sm:mb-1">Email *</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => onChange('email', e.target.value)}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] xs:text-xs font-medium text-[#5A5A5A] mb-0.5 sm:mb-1">Phone</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => onChange('phone', e.target.value)}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div>
                    <label className="block text-[10px] xs:text-xs font-medium text-[#5A5A5A] mb-0.5 sm:mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={profileData.employee_id}
                      disabled
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#F0EDE8] border border-[#E8E3DC] text-[#5A5A5A] cursor-not-allowed rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] xs:text-xs font-medium text-[#5A5A5A] mb-0.5 sm:mb-1">Role</label>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#F0EDE8] border border-[#E8E3DC] text-[#5A5A5A] cursor-not-allowed rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div>
                    <label className="block text-[10px] xs:text-xs font-medium text-[#5A5A5A] mb-0.5 sm:mb-1">Department</label>
                    <input
                      type="text"
                      value={profileData.department_name}
                      disabled
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#F0EDE8] border border-[#E8E3DC] text-[#5A5A5A] cursor-not-allowed rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] xs:text-xs font-medium text-[#5A5A5A] mb-0.5 sm:mb-1">Designation</label>
                    <input
                      type="text"
                      value={profileData.designation}
                      onChange={(e) => onChange('designation', e.target.value)}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div>
                    <label className="block text-[10px] xs:text-xs font-medium text-[#5A5A5A] mb-0.5 sm:mb-1">License Number</label>
                    <input
                      type="text"
                      value={profileData.license_number}
                      onChange={(e) => onChange('license_number', e.target.value)}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] xs:text-xs font-medium text-[#5A5A5A] mb-0.5 sm:mb-1">Specialization</label>
                    <select
                      value={profileData.specialization}
                      onChange={(e) => onChange('specialization', e.target.value)}
                      disabled={specializationsLoading}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded disabled:bg-[#F0EDE8] disabled:text-[#5A5A5A]"
                    >
                      <option value="">-- Select specialization --</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] xs:text-xs font-medium text-[#5A5A5A] mb-0.5 sm:mb-1">Qualification</label>
                  <textarea
                    value={profileData.qualification}
                    onChange={(e) => onChange('qualification', e.target.value)}
                    rows="2"
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#E8E3DC] p-3 sm:p-4 flex flex-wrap justify-end gap-2 bg-white">
            <Button
              onClick={onClose}
              variant="secondary"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Close</span>
              <span className="xs:hidden">Close</span>
            </Button>
            <Button
              onClick={onSave}
              variant="primary"
              disabled={saving}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN DOCTOR DASHBOARD COMPONENT ====================
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
  const [errorMessage, setErrorMessage] = useState(null);
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

  const [alerts, setAlerts] = useState([]);

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
      if (!authUser?.id) return;
      try {
        setScheduleLoading(true);
        setScheduleError(null);
        const today = new Date().toISOString().split('T')[0];
        const params = new URLSearchParams({
          doctor_id: String(authUser.id),
          start_date: today,
          end_date: today,
        });
        const data = await apiRequest(`/api/v1/patients/appointments/?${params.toString()}`);
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
  }, [authUser?.id]);

  const [consultations, setConsultations] = useState([]);

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
      await loadDashboardPatients('/api/v1/patients/patients/');
    } catch (err) {
      console.error('Failed to restore patient:', err);
      setErrorMessage(err.message || 'Failed to restore patient');
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
      lastVisit: patient.last_visit || patient.lastVisit || null,
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
      
      data = await apiRequest(url);
      apiUrl = url;
      
      const results = Array.isArray(data) ? data : (data.results || []);
      const normalized = results.map(normalizePatientForDisplay);
      
      dispatch(setPatients(normalized));
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
      }
    } catch (err) {
      console.error('Failed to load dashboard insights:', err);
    }
  };

  useEffect(() => {
    loadDashboardPatients('/api/v1/patients/patients/?status=all&page_size=20');
    loadDashboardInsights();
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
      setErrorMessage('Please fill in patient name and presenting complaints');
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
      setErrorMessage(err.message || 'Failed to update status');
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
    }, 10000);
    bulkUploadPollsRef.current[uploadId] = interval;
  };

  // Quick Actions with Nigerian brand colors
  const quickActions = [
    { icon: Users, label: 'My Patients', action: '/patients', color: 'bg-[#008751]' },
    { icon: Stethoscope, label: 'Ward Rounds', action: '/ward-rounds', color: 'bg-[#006B40]' },
    { icon: Activity, label: 'Vital Signs', action: '/vital-signs', color: 'bg-[#0D6B6B]' },
    { icon: FileText, label: 'EMR', action: '/emr', color: 'bg-[#C87D3D]' },
    { icon: Calendar, label: 'Schedule', action: '/appointments', color: 'bg-[#C8553D]' },
    { icon: Heart, label: 'Admissions', action: '/admissions', color: 'bg-[#4A6B6B]' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'consultations', label: 'Consultations', icon: Clipboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'my-roster', label: 'My Roster', icon: Calendar },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
      'pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
      'in-progress': { label: 'In Progress', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
      'scheduled': { label: 'Scheduled', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
      'critical': { label: 'Critical', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
      'stable': { label: 'Stable', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
      'monitoring': { label: 'Monitoring', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
      'active': { label: 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
      'inactive': { label: 'Inactive', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
      'archived': { label: 'Archived', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
    };
    return statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };
  };

  // ==================== RENDER OVERVIEW CONTENT ====================
  const renderOverviewContent = () => {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <StatsCard
            title="My Patients"
            value={stats.myPatients}
            subValue="Active cases"
            icon={Users}
            color="green"
            onClick={() => setActiveTab('patients')}
          />
          <StatsCard
            title="Today's Rounds"
            value={stats.todaysRounds}
            subValue="Scheduled"
            icon={Stethoscope}
            color="teal"
            onClick={() => navigate('/ward-rounds')}
          />
          <StatsCard
            title="Pending Reviews"
            value={stats.pendingReviews}
            subValue="Requires attention"
            icon={FileText}
            color="warm"
            onClick={() => setActiveTab('consultations')}
          />
          <StatsCard
            title="Critical Patients"
            value={stats.criticalPatients}
            subValue="Monitor closely"
            icon={AlertCircle}
            color="terracotta"
            onClick={() => setActiveTab('patients')}
          />
        </div>

        {/* Waveform divider — signature motif */}
        <div className="flex items-center gap-2 sm:gap-3 py-1">
          <div className="h-px flex-1 bg-[#D8D4CD]"></div>
          <svg width="40" height="12" viewBox="0 0 40 12" className="text-[#008751] flex-shrink-0">
            <path d="M2 6 L8 6 L10 2 L14 10 L18 4 L22 10 L26 4 L30 8 L32 6 L38 6" 
                  stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="h-px flex-1 bg-[#D8D4CD]"></div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs sm:text-sm font-display font-semibold text-[#1A1A1A] mb-2 sm:mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2 lg:gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.action)}
                  className={`${action.color} text-white p-2 sm:p-3 lg:p-4 text-left transition-opacity hover:opacity-85 flex flex-col items-start rounded`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mb-0.5 sm:mb-1" />
                  <span className="text-[8px] xs:text-[10px] sm:text-xs lg:text-sm font-medium leading-tight">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clinical Alerts */}
        <div className="bg-white border border-[#E8E3DC] p-3 sm:p-4 lg:p-5 rounded-lg">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-3 sm:mb-4">
            <h2 className="text-xs sm:text-sm font-display font-semibold text-[#1A1A1A]">Clinical Alerts</h2>
            <Button
              onClick={() => setAlerts(prev => prev.map(a => ({ ...a, read: true })))}
              variant="secondary"
              className="text-[8px] xs:text-[10px] sm:text-xs"
            >
              <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">Mark All Read</span>
              <span className="xs:hidden">Mark Read</span>
            </Button>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Bell className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#D8D4CD] mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-[#5A5A5A]">No alerts</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className={`flex flex-col xs:flex-row xs:items-center justify-between border p-2 sm:p-3 gap-2 rounded ${
                  alert.type === 'critical' ? 'border-[#E8D6D0] bg-[#F5EDEA]' :
                  alert.type === 'warning' ? 'border-[#F0E8DC] bg-[#F5F0EA]' :
                  'border-[#C8E0D5] bg-[#E8F5EF]'
                } ${alert.read ? 'opacity-60' : ''}`}>
                  <div className="flex items-center flex-1 min-w-0">
                    <AlertCircle className={`mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 ${
                      alert.type === 'critical' ? 'text-[#C8553D]' :
                      alert.type === 'warning' ? 'text-[#C87D3D]' :
                      'text-[#008751]'
                    }`} />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-[#1A1A1A] truncate">{alert.message}</p>
                      <p className="text-[10px] xs:text-xs text-[#5A5A5A] truncate">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
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
      </div>
    );
  };

  // ==================== RENDER CONSULTATIONS CONTENT ====================
  const renderConsultationsContent = () => {
    return <ConsultationV2 />;
  };

  // ==================== RENDER PATIENTS CONTENT ====================
  const renderPatientsContent = () => {
    if (patientsLoading) {
      return (
        <div className="text-center py-6 sm:py-8">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#008751] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[#5A5A5A] text-xs sm:text-sm mt-2">Loading patients...</p>
        </div>
      );
    }

    return (
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
          <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">My Patients</h2>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Button
              variant="primary"
              onClick={() => navigate('/patients/add')}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Add Patient</span>
              <span className="xs:hidden">Add</span>
            </Button>
            <Button
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
              <span className="hidden xs:inline">Template</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => document.getElementById('dashboard-bulk-upload-input')?.click()}
            >
              {bulkUploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span className="hidden xs:inline">Bulk Upload</span>
            </Button>
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
              <span className="hidden xs:inline">View All</span>
            </Button>
          </div>
        </div>

        {/* Bulk Upload Progress/Result */}
        {(bulkUploadProgress || bulkUploadResult) && (
          <div className={`mb-4 p-3 sm:p-4 border rounded ${bulkUploadResult?.status === 'failed' ? 'bg-[#F5EDEA] border-[#E8D6D0]' : 'bg-[#E8F5EF] border-[#C8E0D5]'}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {bulkUploading ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#008751] animate-spin flex-shrink-0" />
                ) : bulkUploadResult?.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#2D7D46] flex-shrink-0" />
                ) : bulkUploadResult?.status === 'failed' ? (
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8553D] flex-shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#008751] animate-spin flex-shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] truncate">
                  {bulkUploadProgress?.message || bulkUploadResult?.message}
                </span>
              </div>
              {!bulkUploading && (
                <button
                  onClick={resetBulkUpload}
                  className="p-1 hover:bg-[#E8E3DC] rounded flex-shrink-0"
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
                    <div className="mt-1 max-h-40 overflow-y-auto bg-white border border-[#E8D6D0] p-2 rounded">
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

        {dashboardPatients.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-[#5A5A5A]">No patients found</p>
            <p className="text-[10px] xs:text-xs text-[#B0A89E] mt-1">Start by adding your first patient</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-[640px] sm:min-w-0">
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
                  {dashboardPatients.map((patient) => {
                    const status = getStatusBadge(patient.status);
                    const isInactive = patient?.status === 'inactive' || patient?.status === 'archived';
                    return (
                      <tr key={patient.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="py-2 sm:py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#E8F5EF] flex items-center justify-center text-[#008751] font-display font-medium text-xs sm:text-sm flex-shrink-0">
                              {patient.name && patient.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] truncate block">{patient.name || 'Unnamed Patient'}</span>
                              {patient.age && (
                                <span className="text-[10px] text-[#5A5A5A] hidden xs:inline">({patient.age}y)</span>
                              )}
                              {(patient.mrn || patient.hospital_number) && (
                                <div className="text-[8px] xs:text-[10px] text-[#B0A89E] truncate">
                                  {patient.mrn ? `MRN: ${patient.mrn}` : ''}
                                  {patient.mrn && patient.hospital_number ? ' • ' : ''}
                                  {patient.hospital_number ? `HN: ${patient.hospital_number}` : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 hidden sm:table-cell">
                          <div className="text-xs text-[#5A5A5A] truncate">{patient.phone || 'No phone'}</div>
                          <div className="text-[10px] text-[#B0A89E] truncate">{patient.email || 'No email'}</div>
                        </td>
                        <td className="py-2 sm:py-3 hidden md:table-cell">
                          <span className="text-xs text-[#5A5A5A] truncate block">{getPatientCondition(patient)}</span>
                          {patient.bloodType && (
                            <div className="text-[10px] text-[#B0A89E]">Blood: {patient.bloodType}</div>
                          )}
                        </td>
                        <td className="py-2 sm:py-3">
                          <span className={`inline-flex px-1.5 sm:px-2 py-0.5 text-[8px] xs:text-[10px] sm:text-xs font-medium border ${status.color} rounded`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 hidden lg:table-cell">
                          <span className="text-xs text-[#5A5A5A]">
                            {patient.last_visit || patient.lastVisit ? new Date(patient.last_visit || patient.lastVisit).toLocaleDateString() : 'N/A'}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3">
                          <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
                            <IconButton
                              icon={Eye}
                              onClick={() => handleViewPatient(patient)}
                              variant="primary"
                            />
                            <button
                              type="button"
                              onClick={() => handleCreateAdmissionForPatient(patient)}
                              className="inline-flex items-center gap-0.5 sm:gap-1 border border-[#D0E3D8] bg-[#EAF3EE] px-1.5 sm:px-2 py-0.5 sm:py-1 text-[8px] xs:text-[10px] sm:text-xs font-medium text-[#2D7D46] hover:bg-[#D0E3D8] rounded"
                            >
                              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="hidden xs:inline">Admit</span>
                            </button>
                            <IconButton
                              icon={Stethoscope}
                              onClick={() => {
                                handleSelectPatientForConsultation(patient);
                                setActiveTab('consultations');
                              }}
                              variant="success"
                            />
                            <IconButton
                              icon={FileText}
                              onClick={() => navigate(`/patients/${patient.id}/emr`)}
                              variant="info"
                            />
                            <IconButton
                              icon={Map}
                              onClick={() => navigate(`/patients/${patient.id}/journey`)}
                              tooltip="View patient journey and bill"
                              variant="info"
                            />
                            {isInactive && (
                              <IconButton
                                icon={RotateCcw}
                                onClick={() => handleRestorePatient(patient)}
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
            </div>
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#E8E3DC] gap-2 sm:gap-0">
              <div className="text-[10px] sm:text-xs text-[#5A5A5A]">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems}
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <IconButton
                  icon={ChevronLeft}
                  onClick={() => patientsPreviousPage && loadDashboardPatients(patientsPreviousPage)}
                  variant="default"
                  disabled={!patientsPreviousPage || patientsLoading}
                />
                <span className="text-[10px] sm:text-xs text-[#5A5A5A]">
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

  // ==================== RENDER SCHEDULE CONTENT ====================
  const renderScheduleContent = () => {
    return (
      <div>
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-3 sm:mb-4">
          <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Appointments</h2>
          <Button
            variant="secondary"
            onClick={() => navigate('/appointments')}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Full Schedule</span>
            <span className="xs:hidden">Schedule</span>
          </Button>
        </div>

        {scheduleLoading ? (
          <div className="text-center py-6 sm:py-8">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-[#5A5A5A]">Loading schedule...</p>
          </div>
        ) : scheduleError ? (
          <div className="text-center py-6 sm:py-8">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-[#C8553D] mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-[#C8553D] font-medium">{scheduleError}</p>
            <button
              onClick={() => {
                if (!authUser?.id) return;
                const today = new Date().toISOString().split('T')[0];
                const params = new URLSearchParams({
                  doctor_id: String(authUser.id),
                  start_date: today,
                  end_date: today,
                });
                apiRequest(`/api/v1/patients/appointments/?${params.toString()}`).then(data => {
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
              className="mt-2 text-xs sm:text-sm text-[#008751] hover:text-[#006B40] font-medium"
            >
              Retry
            </button>
          </div>
        ) : todaysSchedule.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-[#5A5A5A]">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-[640px] sm:min-w-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8E3DC]">
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Date & Time</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Doctor</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Reason</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {todaysSchedule.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-[#F7F5F2] transition-colors">
                      <td className="py-2 sm:py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-[#E8F5EF] flex items-center justify-center flex-shrink-0 text-[#008751] font-display font-medium text-xs sm:text-sm">
                            {(appointment.patientName || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-[#1A1A1A] text-xs sm:text-sm truncate max-w-[100px] xs:max-w-[150px] sm:max-w-[200px]">{appointment.patientName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 hidden sm:table-cell">
                        <div className="text-xs sm:text-sm text-[#5A5A5A]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#B0A89E] flex-shrink-0" />
                            <span className="whitespace-nowrap text-[10px] sm:text-xs">{new Date(appointment.date).toLocaleDateString('en-NG')}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#5A5A5A]">
                            <Clock className="w-3 h-3 text-[#B0A89E] flex-shrink-0" />
                            <span className="whitespace-nowrap text-[10px] sm:text-xs">{appointment.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 hidden md:table-cell">
                        <span className="text-xs sm:text-sm text-[#5A5A5A] truncate max-w-[100px] block">{appointment.doctor || 'N/A'}</span>
                      </td>
                      <td className="py-2 sm:py-3 hidden lg:table-cell">
                        <span className="text-xs sm:text-sm text-[#5A5A5A] truncate max-w-[120px] block">{appointment.reason || 'N/A'}</span>
                      </td>
                      <td className="py-2 sm:py-3">
                        <span className={`inline-flex px-1.5 sm:px-2 py-0.5 text-[8px] xs:text-[10px] sm:text-xs font-medium border rounded ${
                          appointment.status === 'completed' ? 'border-[#D0E3D8] bg-[#EAF3EE] text-[#2D7D46]' :
                          appointment.status === 'in-progress' ? 'border-[#C8E0D5] bg-[#E8F5EF] text-[#008751]' :
                          appointment.status === 'cancelled' ? 'border-[#E8D6D0] bg-[#F5EDEA] text-[#C8553D]' :
                          'border-[#E8E3DC] bg-[#F0EDE8] text-[#5A5A5A]'
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
                              <div className="absolute right-0 mt-1 w-32 sm:w-36 bg-white border border-[#E8E3DC] z-10 py-1 rounded shadow-lg">
                                <button
                                  onClick={() => handleStatusChange(appointment.id, 'scheduled')}
                                  className="w-full text-left px-3 py-1.5 text-[10px] sm:text-xs hover:bg-[#F7F5F2] flex items-center gap-2"
                                >
                                  <Clock className="w-3 h-3 text-[#008751]" />
                                  Scheduled
                                </button>
                                <button
                                  onClick={() => handleStatusChange(appointment.id, 'completed')}
                                  className="w-full text-left px-3 py-1.5 text-[10px] sm:text-xs hover:bg-[#F7F5F2] flex items-center gap-2"
                                >
                                  <CheckCircle className="w-3 h-3 text-[#2D7D46]" />
                                  Completed
                                </button>
                                <button
                                  onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                  className="w-full text-left px-3 py-1.5 text-[10px] sm:text-xs hover:bg-[#F7F5F2] flex items-center gap-2"
                                >
                                  <X className="w-3 h-3 text-[#C8553D]" />
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
          </div>
        )}
      </div>
    );
  };

  // ==================== RENDER TAB CONTENT ====================
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'consultations':
        return renderConsultationsContent();
      case 'patients':
        return renderPatientsContent();
      case 'schedule':
        return renderScheduleContent();
      case 'my-roster':
        return <MyRosterTab />;
      default:
        return renderOverviewContent();
    }
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="dashboard min-h-screen bg-[#F7F5F2] font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-2 xs:py-3 sm:py-4 md:py-6 lg:py-8">
        
        {/* Header */}
        <div className="mb-3 sm:mb-6 lg:mb-8">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#E8E3DC] border-2 border-[#D8D4CD] flex items-center justify-center overflow-hidden flex-shrink-0">
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
                  <UserIcon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#5A5A5A]" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm xs:text-base sm:text-lg lg:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight truncate">
                  Welcome back, {displayUserName}
                </h1>
                <p className="text-[10px] xs:text-xs sm:text-sm text-[#5A5A5A] truncate">
                  {displayTenantName} · {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 flex-wrap flex-shrink-0">
              <Button
                variant="secondary"
                className="relative text-[8px] xs:text-[10px] sm:text-xs"
              >
                <Bell className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                {alerts.filter(a => !a.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 xs:w-4.5 xs:h-4.5 bg-[#C8553D] text-white text-[8px] xs:text-[9px] sm:text-[10px] flex items-center justify-center rounded-full">
                    {alerts.filter(a => !a.read).length}
                  </span>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={handleOpenProfile}
                className="text-[8px] xs:text-[10px] sm:text-xs"
              >
                <UserIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline text-[8px] xs:text-[10px] sm:text-xs">Profile</span>
              </Button>
              <Button
                onClick={handleOpenChangePassword}
                variant="secondary"
                className="text-[8px] xs:text-[10px] sm:text-xs"
              >
                <Settings className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline text-[8px] xs:text-[10px] sm:text-xs">Password</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs with Nigerian green active state */}
        <div className="border-b border-[#E8E3DC] mb-3 sm:mb-6 lg:mb-8 overflow-x-auto -mx-2 xs:mx-0 px-2 xs:px-0">
          <nav className="flex gap-1 xs:gap-1.5 sm:gap-2 lg:gap-6 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 lg:gap-2 px-1 xs:px-1.5 sm:px-2 py-1.5 xs:py-2 sm:py-2.5 lg:py-3 text-[8px] xs:text-[10px] sm:text-xs lg:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#008751] text-[#008751]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
                  }`}
                >
                  <Icon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
          {renderTabContent()}
        </div>

        {/* Patient Detail Modal */}
        {showPatientModal && (
          <PatientDetailModal 
            patient={selectedPatient} 
            onClose={handleClosePatientModal} 
          />
        )}

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
      </div>
    </div>
  );
};

export default DoctorDashboard;