import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Plane,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  Plus,
  TrendingUp,
  Clock,
  ArrowRight,
  Menu,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Loader2,
  Check,
  ArrowUp,
  ArrowDown,
  Heart,
  Ambulance,
  Shield,
  Award,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  CreditCard,
  Banknote,
  Calculator,
  Settings,
  Globe,
  Mail,
  Smartphone,
  Droplets,
  Baby,
  Brain,
  Bone,
  EyeOff,
  Star,
  Info,
  Zap,
  Home,
  Briefcase,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  HeartPulse,
  Stethoscope,
  Building2,
  Clipboard,
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { createReferral, updateReferral, completeTransport } from '../features/referralSlice';
import { emergencyApi } from '../utils/api';

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
    blue: 'bg-[#008751]',
    purple: 'bg-[#4A5A5A]',
    red: 'bg-[#C8553D]',
    pink: 'bg-[#C8553D]',
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

// ==================== STATUS BADGE ====================
const StatusBadge = ({ status }) => {
  const statusMap = {
    'Pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Approved': { label: 'Approved', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'In Transit': { label: 'In Transit', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'Arrived': { label: 'Arrived', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Cancelled': { label: 'Cancelled', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
    'In Progress': { label: 'In Progress', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
  };

  const config = statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== REFERRAL CARD ====================
const ReferralCard = ({ referral, onViewDetails }) => {
  const getReferralTypeColor = (type) => {
    switch(type) {
      case 'Maternal Referral': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      case 'Neonatal Transfer': return 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]';
      case 'Critical Care Transfer': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      case 'Inter-facility Transfer': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      default: return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    }
  };

  return (
    <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 hover:bg-[#F7F5F2] transition-colors border-l-4 border-[#008751]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-[#008751]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-display font-semibold text-[#1A1A1A]">
                {referral.patientName || 'Unknown Patient'}
              </span>
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getReferralTypeColor(referral.referralType)}`}>
                {referral.referralType || 'Unknown Type'}
              </span>
              <StatusBadge status={referral.status} />
            </div>
            <p className="text-xs text-[#5A5A5A] mt-0.5 truncate max-w-md">
              {referral.referralReason || 'No reason provided'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#B0A89E]">
            {referral.referralDate ? new Date(referral.referralDate).toLocaleDateString('en-NG') : '-'}
          </span>
          <IconButton
            icon={Eye}
            onClick={() => onViewDetails(referral)}
            tooltip="View details"
            variant="primary"
            size="sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#F0EDE8]">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">From</p>
          <p className="text-sm text-[#1A1A1A] truncate">{referral.referringFacility?.name || 'Unknown Facility'}</p>
        </div>
        <div className="flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-[#B0A89E]" />
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">To</p>
          <p className="text-sm text-[#1A1A1A] truncate">{referral.receivingFacility?.name || 'Unknown Facility'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Age</p>
          <p className="text-sm text-[#1A1A1A]">{referral.age || 'N/A'} years</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Gender</p>
          <p className="text-sm text-[#1A1A1A]">{referral.gender || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Ambulance</p>
          <p className="text-sm text-[#1A1A1A]">{referral.ambulanceId || 'Not assigned'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Response Time</p>
          <p className="text-sm font-medium text-[#008751]">{referral.responseTime || 0} mins</p>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPLETED REFERRAL CARD ====================
const CompletedReferralCard = ({ referral }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A]">{referral.patientName || 'Unknown Patient'}</p>
          <p className="text-xs text-[#5A5A5A]">{referral.referralType || 'Unknown Type'}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-[#2D7D46] flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            {referral.outcome || 'Completed'}
          </p>
          <p className="text-xs text-[#B0A89E]">
            {referral.arrivalTime ? new Date(referral.arrivalTime).toLocaleDateString('en-NG') : '-'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== EVACUATION CARD ====================
const EvacuationCard = ({ evacuation }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 border-l-4 border-[#4A5A5A]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-[#F0EDE8] flex items-center justify-center flex-shrink-0">
            <Plane className="w-4 h-4 text-[#4A5A5A]" />
          </div>
          <div>
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
              {evacuation.patientName || 'Unknown Patient'}
              <StatusBadge status={evacuation.status} />
            </h3>
            <p className="text-xs text-[#5A5A5A]">{evacuation.evacuationType || 'Unknown Type'}</p>
          </div>
        </div>
        <span className="text-xs text-[#B0A89E]">
          {evacuation.evacuationDate ? new Date(evacuation.evacuationDate).toLocaleDateString('en-NG') : '-'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-[#F0EDE8]">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">From</p>
          <p className="text-sm text-[#1A1A1A]">{evacuation.originCountry || 'Unknown'}</p>
        </div>
        <div className="flex items-center justify-center">
          <ArrowRight className="w-4 h-4 text-[#B0A89E]" />
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">To</p>
          <p className="text-sm text-[#1A1A1A]">{evacuation.destinationCountry || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Cost</p>
          <p className="text-sm font-medium text-[#008751]">₦{(evacuation.cost || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-3 p-3 bg-[#F7F5F2] border border-[#E8E3DC]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div><span className="text-[#5A5A5A]">Destination:</span> {evacuation.destinationFacility || 'Unknown'}</div>
          <div><span className="text-[#5A5A5A]">Funding:</span> {evacuation.fundingSource || 'Unknown'}</div>
          <div><span className="text-[#5A5A5A]">Transport:</span> {evacuation.transportMode || 'Unknown'}</div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPLIANCE CARD ====================
const ComplianceCard = ({ compliance, referral }) => {
  const isFullyCompliant = compliance.referralProtocolFollowed && compliance.documentationComplete && compliance.patientConsentObtained;

  return (
    <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A]">{referral?.patientName || 'Unknown Patient'}</p>
          <p className="text-xs text-[#5A5A5A]">{referral?.referralType || 'Unknown Type'}</p>
        </div>
        <div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border ${
            isFullyCompliant
              ? 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]'
              : 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]'
          }`}>
            {isFullyCompliant ? (
              <><CheckCircle className="w-3 h-3" /> Fully Compliant</>
            ) : (
              <><AlertCircle className="w-3 h-3" /> Partial</>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-[#F0EDE8]">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Protocol</p>
          <p className="text-sm font-medium flex items-center gap-1">
            {compliance.referralProtocolFollowed ? (
              <><CheckCircle className="w-4 h-4 text-[#2D7D46]" /> Yes</>
            ) : (
              <><AlertCircle className="w-4 h-4 text-[#C87D3D]" /> No</>
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Documentation</p>
          <p className="text-sm font-medium flex items-center gap-1">
            {compliance.documentationComplete ? (
              <><CheckCircle className="w-4 h-4 text-[#2D7D46]" /> Complete</>
            ) : (
              <><AlertCircle className="w-4 h-4 text-[#C87D3D]" /> Incomplete</>
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Consent</p>
          <p className="text-sm font-medium flex items-center gap-1">
            {compliance.patientConsentObtained ? (
              <><CheckCircle className="w-4 h-4 text-[#2D7D46]" /> Yes</>
            ) : (
              <><AlertCircle className="w-4 h-4 text-[#C87D3D]" /> No</>
            )}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Follow-up</p>
          <p className="text-sm font-medium flex items-center gap-1">
            {compliance.followUpArrangement ? (
              <><CheckCircle className="w-4 h-4 text-[#2D7D46]" /> Arranged</>
            ) : (
              <><AlertCircle className="w-4 h-4 text-[#C87D3D]" /> Pending</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const ReferralTransport = () => {
  const referralState = useSelector(state => state.referral || {});
  const patients = useSelector(state => state.patient?.patients || []);
  const referrals = referralState.referrals || [];
  const medicalEvacuations = referralState.medicalEvacuations || [];
  const transferCompliance = referralState.transferCompliance || [];
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('active');
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showEvacuationModal, setShowEvacuationModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralForm, setReferralForm] = useState({
    referralType: '',
    patientId: '',
    patientName: '',
    referralReason: '',
    receivingFacility: '',
    ambulanceId: ''
  });
  const [evacuationForm, setEvacuationForm] = useState({
    patientName: '',
    originCountry: '',
    destinationCountry: '',
    fundingSource: '',
    transportMode: 'Air Ambulance'
  });
  const [statusForm, setStatusForm] = useState('Pending');

  const activeReferrals = referrals.filter(r => {
    if (!r || !r.status) return false;
    return r.status !== 'Completed';
  });
  
  const completedReferrals = referrals.filter(r => {
    if (!r || !r.status) return false;
    return r.status === 'Completed';
  });

  const getFilteredItems = () => {
    if (!searchQuery) {
      switch(activeTab) {
        case 'active': return activeReferrals;
        case 'history': return completedReferrals;
        case 'evacuation': return medicalEvacuations;
        case 'compliance': return transferCompliance;
        default: return [];
      }
    }

    const query = searchQuery.toLowerCase();
    switch(activeTab) {
      case 'active':
        return activeReferrals.filter(item => 
          item.patientName?.toLowerCase().includes(query) ||
          item.referralType?.toLowerCase().includes(query) ||
          item.status?.toLowerCase().includes(query)
        );
      case 'history':
        return completedReferrals.filter(item =>
          item.patientName?.toLowerCase().includes(query) ||
          item.referralType?.toLowerCase().includes(query) ||
          item.outcome?.toLowerCase().includes(query)
        );
      case 'evacuation':
        return medicalEvacuations.filter(item =>
          item.patientName?.toLowerCase().includes(query) ||
          item.evacuationType?.toLowerCase().includes(query) ||
          item.status?.toLowerCase().includes(query)
        );
      case 'compliance':
        return transferCompliance.filter(item => {
          const referral = referrals.find(r => r.referralId === item.referralId);
          return (
            referral?.patientName?.toLowerCase().includes(query) ||
            referral?.referralType?.toLowerCase().includes(query)
          );
        });
      default: return [];
    }
  };

  const filteredItems = getFilteredItems();

  const getComplianceStatus = (referralId) => {
    return transferCompliance.filter(c => c.referralId === referralId);
  };

  const maternalReferrals = referrals.filter(r => r.referralType === 'Maternal Referral').length;
  const neonatalReferrals = referrals.filter(r => r.referralType === 'Neonatal Transfer').length;
  const criticalCareReferrals = referrals.filter(r => r.referralType === 'Critical Care Transfer').length;

  // Tabs configuration
  const tabs = [
    { id: 'active', label: 'Active Referrals', icon: MapPin, count: activeReferrals.length },
    { id: 'history', label: 'History', icon: Clock, count: completedReferrals.length },
    { id: 'evacuation', label: 'Medical Evacuations', icon: Plane, count: medicalEvacuations.length },
    { id: 'compliance', label: 'Compliance Tracking', icon: Shield, count: transferCompliance.length },
  ];

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        const records = await emergencyApi.getReferrals();
        const normalized = Array.isArray(records) ? records : records.results || [];
        normalized.forEach((ref) => dispatch(createReferral({
          referralId: ref.referralId || ref.id,
          patientName: ref.patientName,
          referralType: ref.referralType,
          referralReason: ref.referralReason,
          referringFacility: ref.referringFacility || {},
          receivingFacility: ref.receivingFacility || {},
          status: ref.status,
          ambulanceId: ref.ambulanceId,
          referralDate: ref.referralDate,
          arrivalTime: ref.arrivalTime,
          outcome: ref.outcome,
          notes: ref.notes,
          isMedicalEvacuation: ref.isMedicalEvacuation,
          fundingSource: ref.fundingSource,
          originCountry: ref.originCountry,
          destinationCountry: ref.destinationCountry,
          transportMode: ref.transportMode,
          cost: ref.cost || 0,
          transferCompliance: ref.transferCompliance || {}
        })));
      } catch (error) {
        console.error('Failed to load referrals', error);
      }
    };

    if (!referrals.length) {
      loadReferrals();
    }
  }, [dispatch, referrals.length]);

  const handleCreateReferral = async () => {
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        patientId: referralForm.patientId || null,
        patientName: referralForm.patientName,
        referralType: referralForm.referralType,
        referralReason: referralForm.referralReason,
        receivingFacility: { name: referralForm.receivingFacility, address: '' },
        ambulanceId: referralForm.ambulanceId,
        status: 'Pending',
        isMedicalEvacuation: false
      };
      const created = await emergencyApi.createReferral(payload);
      dispatch(createReferral({
        referralId: created.referralId || created.id,
        patientName: created.patientName,
        referralType: created.referralType,
        referralReason: created.referralReason,
        referringFacility: created.referringFacility || {},
        receivingFacility: created.receivingFacility || {},
        status: created.status || 'Pending',
        ambulanceId: created.ambulanceId,
        referralDate: created.referralDate,
        arrivalTime: created.arrivalTime,
        outcome: created.outcome,
        notes: created.notes,
        isMedicalEvacuation: created.isMedicalEvacuation,
        fundingSource: created.fundingSource,
        originCountry: created.originCountry,
        destinationCountry: created.destinationCountry,
        transportMode: created.transportMode,
        cost: created.cost || 0,
        transferCompliance: created.transferCompliance || {}
      }));
      setSuccessMessage('Referral created successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowReferralModal(false);
      setReferralForm({ referralType: '', patientId: '', patientName: '', referralReason: '', receivingFacility: '', ambulanceId: '' });
    } catch (error) {
      setFormError(error.message || 'Unable to create referral');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateEvacuation = async () => {
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        patientName: evacuationForm.patientName,
        referralType: 'Medical Evacuation',
        referralReason: 'Medical evacuation request',
        originCountry: evacuationForm.originCountry,
        destinationCountry: evacuationForm.destinationCountry,
        fundingSource: evacuationForm.fundingSource,
        transportMode: evacuationForm.transportMode,
        status: 'Pending',
        isMedicalEvacuation: true,
        cost: 0
      };
      const created = await emergencyApi.createReferral(payload);
      dispatch(createReferral({
        referralId: created.referralId || created.id,
        patientName: created.patientName,
        referralType: created.referralType,
        referralReason: created.referralReason,
        referringFacility: created.referringFacility || {},
        receivingFacility: created.receivingFacility || {},
        status: created.status || 'Pending',
        ambulanceId: created.ambulanceId,
        referralDate: created.referralDate,
        arrivalTime: created.arrivalTime,
        outcome: created.outcome,
        notes: created.notes,
        isMedicalEvacuation: created.isMedicalEvacuation,
        fundingSource: created.fundingSource,
        originCountry: created.originCountry,
        destinationCountry: created.destinationCountry,
        transportMode: created.transportMode,
        cost: created.cost || 0,
        transferCompliance: created.transferCompliance || {}
      }));
      setSuccessMessage('Medical evacuation created successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowEvacuationModal(false);
      setEvacuationForm({ patientName: '', originCountry: '', destinationCountry: '', fundingSource: '', transportMode: 'Air Ambulance' });
    } catch (error) {
      setFormError(error.message || 'Unable to create evacuation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReferral = async () => {
    if (!selectedReferral) return;
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const updated = await emergencyApi.completeReferral(selectedReferral.referralId || selectedReferral.id, { 
        outcome: 'Updated via transport workflow',
        status: statusForm
      });
      dispatch(updateReferral({
        referralId: selectedReferral.referralId || selectedReferral.id,
        status: updated.status || statusForm,
        outcome: updated.outcome || 'Updated via transport workflow',
        arrivalTime: updated.arrivalTime
      }));
      setSuccessMessage('Referral status updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setSelectedReferral(null);
    } catch (error) {
      setFormError(error.message || 'Unable to update referral');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    setSuccessMessage('Data refreshed.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="referral-transport min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Referral & Transport Management
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Coordinate inter-facility transfers and medical evacuations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={handleRefresh}
              tooltip="Refresh data"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowEvacuationModal(true)}
              tooltip="Create medical evacuation"
              variant="warning"
              size="sm"
            >
              <Plane className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Evacuation</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowReferralModal(true)}
              tooltip="Create new referral"
              variant="primary"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Referral</span>
              <span className="sm:hidden">Referral</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Error & Success Messages */}
      {formError && (
        <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {formError}
          </span>
          <button onClick={() => setFormError('')} className="text-[#C8553D] hover:text-[#A8442E]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-[#EAF3EE] border border-[#D0E3D8] text-sm text-[#2D7D46] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            {successMessage}
          </span>
          <button onClick={() => setSuccessMessage('')} className="text-[#2D7D46] hover:text-[#1E5F33]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Active Referrals"
          value={activeReferrals.length}
          icon={MapPin}
          color="green"
          tooltip="Currently active referrals"
        />
        <StatsCard
          title="Maternal"
          value={maternalReferrals}
          icon={Baby}
          color="pink"
          tooltip="Maternal referrals"
        />
        <StatsCard
          title="Neonatal"
          value={neonatalReferrals}
          icon={Baby}
          color="blue"
          tooltip="Neonatal transfers"
        />
        <StatsCard
          title="Critical Care"
          value={criticalCareReferrals}
          icon={Heart}
          color="red"
          tooltip="Critical care transfers"
        />
        <StatsCard
          title="Evacuations"
          value={medicalEvacuations.length}
          icon={Plane}
          color="purple"
          tooltip="Medical evacuations"
        />
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
          <input
            type="text"
            placeholder={`Search in ${tabs.find(t => t.id === activeTab)?.label || 'active'}...`}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-1 border-b border-[#E8E3DC] mb-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tooltip key={tab.id} text={`View ${tab.label}`}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-1 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#008751] text-[#008751]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  <span className="text-[10px] text-[#B0A89E] ml-0.5">({tab.count})</span>
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* ==================== ACTIVE REFERRALS TAB ==================== */}
        {activeTab === 'active' && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <MapPin className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No active referrals</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredItems.map(referral => (
                <ReferralCard
                  key={referral.referralId}
                  referral={referral}
                  onViewDetails={setSelectedReferral}
                />
              ))
            )}
          </div>
        )}

        {/* ==================== HISTORY TAB ==================== */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Clock className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No completed referrals</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredItems.map(referral => (
                <CompletedReferralCard key={referral.referralId} referral={referral} />
              ))
            )}
          </div>
        )}

        {/* ==================== MEDICAL EVACUATIONS TAB ==================== */}
        {activeTab === 'evacuation' && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Plane className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No medical evacuations</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredItems.map(evacuation => (
                <EvacuationCard key={evacuation.evacuationId} evacuation={evacuation} />
              ))
            )}
          </div>
        )}

        {/* ==================== COMPLIANCE TAB ==================== */}
        {activeTab === 'compliance' && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Shield className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No compliance records</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredItems.map(compliance => {
                const referral = referrals.find(r => r.referralId === compliance.referralId);
                return (
                  <ComplianceCard
                    key={compliance.complianceId}
                    compliance={compliance}
                    referral={referral}
                  />
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ==================== NEW REFERRAL MODAL ==================== */}
      <GenericModal
        isOpen={showReferralModal}
        onClose={() => {
          setShowReferralModal(false);
          setReferralForm({ referralType: '', patientId: '', patientName: '', referralReason: '', receivingFacility: '', ambulanceId: '' });
          setFormError('');
        }}
        title="Create New Referral"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Referral Type <span className="text-[#C8553D]">*</span>
            </label>
            <select
              value={referralForm.referralType}
              onChange={(e) => setReferralForm({ ...referralForm, referralType: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            >
              <option value="">Select Referral Type</option>
              <option value="Maternal Referral">Maternal Referral</option>
              <option value="Neonatal Transfer">Neonatal Transfer</option>
              <option value="Critical Care Transfer">Critical Care Transfer</option>
              <option value="Inter-facility Transfer">Inter-facility Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Patient <span className="text-[#C8553D]">*</span>
            </label>
            <select
              value={referralForm.patientId}
              onChange={(e) => {
                const patient = patients.find((item) => String(item.id) === e.target.value);
                setReferralForm({ ...referralForm, patientId: e.target.value, patientName: patient?.name || patient?.full_name || '' });
              }}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            >
              <option value="">Select patient from Patient Management</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name || patient.full_name || 'Unnamed patient'}{patient.mrn ? ` (${patient.mrn})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Referral Reason <span className="text-[#C8553D]">*</span>
            </label>
            <textarea
              placeholder="Referral Reason"
              rows="3"
              value={referralForm.referralReason}
              onChange={(e) => setReferralForm({ ...referralForm, referralReason: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Receiving Facility <span className="text-[#C8553D]">*</span>
            </label>
            <select
              value={referralForm.receivingFacility}
              onChange={(e) => setReferralForm({ ...referralForm, receivingFacility: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            >
              <option value="">Select Receiving Facility</option>
              <option value="Lagos Central Hospital">Lagos Central Hospital</option>
              <option value="Tertiary Hospital">Tertiary Hospital</option>
              <option value="Specialized Center">Specialized Center</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Ambulance ID
            </label>
            <input
              type="text"
              placeholder="Ambulance ID"
              value={referralForm.ambulanceId}
              onChange={(e) => setReferralForm({ ...referralForm, ambulanceId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          {formError && <div className="text-sm text-[#C8553D]">{formError}</div>}

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              onClick={handleCreateReferral}
              tooltip="Create referral"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Create Referral
                </>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setShowReferralModal(false);
                setReferralForm({ referralType: '', patientId: '', patientName: '', referralReason: '', receivingFacility: '', ambulanceId: '' });
                setFormError('');
              }}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </div>
      </GenericModal>

      {/* ==================== MEDICAL EVACUATION MODAL ==================== */}
      <GenericModal
        isOpen={showEvacuationModal}
        onClose={() => {
          setShowEvacuationModal(false);
          setEvacuationForm({ patientName: '', originCountry: '', destinationCountry: '', fundingSource: '', transportMode: 'Air Ambulance' });
          setFormError('');
        }}
        title="Create Medical Evacuation"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Patient Name <span className="text-[#C8553D]">*</span>
            </label>
            <input
              type="text"
              placeholder="Patient Name"
              value={evacuationForm.patientName}
              onChange={(e) => setEvacuationForm({ ...evacuationForm, patientName: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Origin Country <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="text"
                placeholder="Origin Country"
                value={evacuationForm.originCountry}
                onChange={(e) => setEvacuationForm({ ...evacuationForm, originCountry: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Destination Country <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="text"
                placeholder="Destination Country"
                value={evacuationForm.destinationCountry}
                onChange={(e) => setEvacuationForm({ ...evacuationForm, destinationCountry: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Funding Source <span className="text-[#C8553D]">*</span>
            </label>
            <select
              value={evacuationForm.fundingSource}
              onChange={(e) => setEvacuationForm({ ...evacuationForm, fundingSource: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            >
              <option value="">Select Funding Source</option>
              <option value="Insurance">Insurance</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Transport Mode <span className="text-[#C8553D]">*</span>
            </label>
            <select
              value={evacuationForm.transportMode}
              onChange={(e) => setEvacuationForm({ ...evacuationForm, transportMode: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            >
              <option value="Air Ambulance">Air Ambulance</option>
              <option value="Ground Ambulance">Ground Ambulance</option>
            </select>
          </div>

          {formError && <div className="text-sm text-[#C8553D]">{formError}</div>}

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              onClick={handleCreateEvacuation}
              tooltip="Create evacuation"
              variant="warning"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plane className="w-3.5 h-3.5" />
                  Create Evacuation
                </>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setShowEvacuationModal(false);
                setEvacuationForm({ patientName: '', originCountry: '', destinationCountry: '', fundingSource: '', transportMode: 'Air Ambulance' });
                setFormError('');
              }}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </div>
      </GenericModal>

      {/* ==================== REFERRAL DETAILS MODAL ==================== */}
      {selectedReferral && (
        <GenericModal
          isOpen={!!selectedReferral}
          onClose={() => {
            setSelectedReferral(null);
            setFormError('');
          }}
          title={`Referral: ${selectedReferral.referralId || 'Unknown'}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
              <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Current Status</p>
              <p className="text-sm font-medium text-[#1A1A1A]">{selectedReferral.status || 'Unknown'}</p>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Update Status
              </label>
              <select
                value={statusForm}
                onChange={(e) => setStatusForm(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="In Transit">In Transit</option>
                <option value="Arrived">Arrived</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Notes</label>
              <textarea
                placeholder="Notes"
                rows="3"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>

            {formError && <div className="text-sm text-[#C8553D]">{formError}</div>}

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
              <ButtonWithTooltip
                onClick={handleUpdateReferral}
                tooltip="Update status"
                variant="primary"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Update Status
                  </>
                )}
              </ButtonWithTooltip>
              <ButtonWithTooltip
                onClick={() => {
                  setSelectedReferral(null);
                  setFormError('');
                }}
                tooltip="Close"
                variant="secondary"
                className="flex-1"
              >
                Close
              </ButtonWithTooltip>
            </div>
          </div>
        </GenericModal>
      )}
    </div>
  );
};

export default ReferralTransport;