import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { emergencyApi } from '../utils/api';
import {
  setFleetData,
  updateAmbulanceLocation,
  dispatchAmbulance,
  updateMissionStatus,
  completeMission
} from '../features/ambulanceSlice';
import { createAdmissionRequest } from '../features/admissionSlice';
import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";
import {
  MapPin,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  Navigation,
  Car,
  Plus,
  Menu,
  X,
  Filter,
  Search,
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
    orange: 'bg-[#C87D3D]',
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
    'Available': { label: 'Available', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'En Route': { label: 'En Route', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'On Scene': { label: 'On Scene', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Transporting': { label: 'Transporting', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Out of Service': { label: 'Out of Service', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
    'Dispatched': { label: 'Dispatched', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'Completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Returning': { label: 'Returning', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'Critical': { label: 'Critical', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'High': { label: 'High', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'Medium': { label: 'Medium', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Low': { label: 'Low', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
  };

  const config = statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== AMBULANCE MARKER ====================
const AmbulanceMarker = ({ ambulance, onClick }) => {
  const getStatusDotColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-[#2D7D46]';
      case 'En Route': return 'bg-[#008751]';
      case 'On Scene': return 'bg-[#C87D3D]';
      case 'Transporting': return 'bg-[#C87D3D]';
      default: return 'bg-[#5A5A5A]';
    }
  };

  return (
    <div 
      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group`}
      style={{
        left: `${((ambulance.location?.lng || 3.3792) - 3.3) / 0.2 * 100}%`,
        top: `${(6.6 - (ambulance.location?.lat || 6.5244)) / 0.2 * 100}%`
      }}
      onClick={() => onClick(ambulance)}
    >
      <div className="relative">
        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${getStatusDotColor(ambulance.status)}`}>
          <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-inherit"></div>
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1A1A1A] text-white text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {ambulance.vehicleNumber || 'Unknown'}
        </div>
      </div>
    </div>
  );
};

// ==================== MISSION CARD ====================
const MissionCard = ({ mission, ambulances, onStatusUpdate, onComplete }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      case 'High': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      case 'Medium': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      case 'Low': return 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]';
      default: return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    }
  };

  const ambulance = ambulances.find(a => a.ambulanceId === (mission.ambulanceId || mission.ambulance));

  return (
    <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 hover:bg-[#F7F5F2] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-[#F5EDEA] flex items-center justify-center flex-shrink-0">
            <Car className="w-4 h-4 text-[#C8553D]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-display font-semibold text-[#1A1A1A]">
                Mission {mission.missionId || 'Unknown'}
              </span>
              <StatusBadge status={mission.status} />
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getPriorityColor(mission.priority)}`}>
                {mission.priority || 'Medium'}
              </span>
            </div>
            <p className="text-xs text-[#5A5A5A] mt-0.5">
              {mission.patientInfo?.name || 'Unknown Patient'} • {mission.incidentType || 'Medical Emergency'}
            </p>
          </div>
        </div>
        <div className="text-xs text-[#B0A89E]">
          {mission.dispatchedAt ? new Date(mission.dispatchedAt).toLocaleString() : 'Unknown'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#F0EDE8]">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Ambulance</p>
          <p className="text-sm font-medium text-[#1A1A1A]">
            {ambulance?.vehicleNumber || 'Unknown'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Location</p>
          <p className="text-sm text-[#1A1A1A] truncate">
            {mission.pickupLocation?.address || 'Unknown'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#F0EDE8]">
        {mission.status === 'En Route' && (
          <ButtonWithTooltip
            onClick={() => onStatusUpdate(mission.missionId, 'On Scene')}
            tooltip="Mark as arrived"
            variant="warning"
            size="sm"
          >
            Arrived
          </ButtonWithTooltip>
        )}
        {mission.status === 'On Scene' && (
          <ButtonWithTooltip
            onClick={() => onStatusUpdate(mission.missionId, 'Transporting')}
            tooltip="Start transport"
            variant="primary"
            size="sm"
          >
            Transport
          </ButtonWithTooltip>
        )}
        {mission.status !== 'Completed' && (
          <ButtonWithTooltip
            onClick={() => onComplete(mission.missionId)}
            tooltip="Complete mission"
            variant="success"
            size="sm"
          >
            Complete
          </ButtonWithTooltip>
        )}
      </div>
    </div>
  );
};

// ==================== ANALYTICS CARD ====================
const AnalyticsCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorMap = {
    blue: 'bg-[#E8F5EF] text-[#008751]',
    green: 'bg-[#EAF3EE] text-[#2D7D46]',
    orange: 'bg-[#F5F0EA] text-[#C87D3D]',
    red: 'bg-[#F5EDEA] text-[#C8553D]',
  };

  return (
    <div className="bg-white border border-[#E8E3DC] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
          <p className="mt-1 text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-[#5A5A5A] mt-0.5">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 ${colorMap[color]} rounded flex items-center justify-center flex-shrink-0 ml-3`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const AmbulanceTracking = () => {
  const dispatch = useDispatch();
  
  const ambulanceState = useSelector(state => state.ambulance || {});
  const patientState = useSelector(state => state.patient || {});
  
  const ambulances = ambulanceState.ambulances || [];
  const activeMissions = ambulanceState.activeMissions || [];
  const missionHistory = ambulanceState.missionHistory || [];
  const gpsTracking = ambulanceState.gpsTracking || {};
  const utilizationAnalytics = ambulanceState.utilizationAnalytics || {
    monthlyStats: [],
    responseTime: 0,
    utilizationRate: 0
  };
  
  const patients = patientState.patients || [];

  const [activeTab, setActiveTab] = useState('tracking');
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;

  const [dispatchData, setDispatchData] = useState({
    ambulanceId: '',
    patientId: '',
    incidentType: '',
    priority: 'Medium',
    location: '',
    notes: ''
  });

  const filteredActiveMissions = activeMissions.filter(mission => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      mission.missionId?.toLowerCase().includes(query) ||
      mission.patientInfo?.name?.toLowerCase().includes(query) ||
      mission.incidentType?.toLowerCase().includes(query) ||
      mission.priority?.toLowerCase().includes(query)
    );
  });

  const filteredMissionHistory = missionHistory.filter(mission => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      mission.missionId?.toLowerCase().includes(query) ||
      mission.patientInfo?.name?.toLowerCase().includes(query) ||
      mission.outcome?.toLowerCase().includes(query)
    );
  });

  // Tabs configuration
  const tabs = [
    { id: 'tracking', label: 'Live Tracking', icon: Navigation, count: ambulances.filter(a => a.status !== 'Out of Service').length },
    { id: 'missions', label: 'Active Missions', icon: AlertCircle, count: activeMissions.length },
    { id: 'history', label: 'Mission History', icon: Clock, count: missionHistory.length },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, count: null },
  ];

  const loadFleet = async () => {
      const [fleetResponse, activeResponse, historyResponse] = await Promise.all([
        emergencyApi.getAmbulances(), emergencyApi.getMissions(), emergencyApi.getMissions({ status: 'Completed' }),
      ]);
      const list = (response) => Array.isArray(response) ? response : response?.results || [];
      const allMissions = list(activeResponse);
      dispatch(setFleetData({
        ambulances: list(fleetResponse),
        activeMissions: allMissions.filter((mission) => !['Completed', 'Cancelled'].includes(mission.status)),
        missionHistory: list(historyResponse),
      }));
  };

  useEffect(() => {
    loadFleet().catch((error) => setFormError(error.message || 'Unable to load ambulance data.'));
  }, [dispatch]);

  const handleDispatch = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!dispatchData.ambulanceId || !dispatchData.patientId) {
      setFormError('Ambulance and patient are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const patient = patients.find(p => p.patientId === dispatchData.patientId);
      const ambulance = ambulances.find(a => a.ambulanceId === dispatchData.ambulanceId);

      const missionData = {
        ambulanceId: dispatchData.ambulanceId,
        patientId: patient?.id || null,
        incidentType: dispatchData.incidentType || 'Medical Emergency',
        priority: dispatchData.priority || 'Medium',
        patientInfo: {
          name: patient?.name || 'Unknown',
          age: patient?.age || 0,
          condition: 'Emergency transport required'
        },
        pickupLocation: {
          address: dispatchData.location || 'Unknown location',
          coordinates: ambulance?.location || { lat: 6.5244, lng: 3.3792 }
        },
        destination: {
          name: 'General Hospital',
          address: 'Hospital Road, Lagos',
          coordinates: { lat: 6.5244, lng: 3.3792 }
        },
        crew: [
          { name: 'Paramedic', role: 'Medical Officer' },
          { name: 'Driver', role: 'Driver' }
        ],
        notes: dispatchData.notes || '',
        status: 'Dispatched'
      };

      const createdMission = await emergencyApi.createMission(missionData);
      dispatch(dispatchAmbulance({
        ambulanceId: dispatchData.ambulanceId,
        missionData: {
          ...missionData,
          missionId: createdMission.missionId || createdMission.id,
          dispatchedAt: createdMission.dispatchedAt || new Date().toISOString(),
          status: createdMission.status || 'Dispatched'
        }
      }));

      if (patient?.patientId || dispatchData.patientId) {
        dispatch(createAdmissionRequest({
          patientId: patient?.patientId || dispatchData.patientId,
          patientName: patient?.name || 'Unknown',
          source: 'Emergency Department',
          diagnosis: dispatchData.incidentType || 'Emergency transport',
          preferredWardType: 'General Ward',
          priority: dispatchData.priority || 'Medium',
          notes: `Auto-created from ambulance mission ${createdMission.missionId || createdMission.id}`
        }));
      }

      setSuccessMessage('Ambulance dispatched successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDispatchForm(false);
      resetDispatchForm();
    } catch (error) {
      setFormError(error.message || 'Unable to dispatch ambulance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDispatchForm = () => {
    setDispatchData({
      ambulanceId: '',
      patientId: '',
      incidentType: '',
      priority: 'Medium',
      location: '',
      notes: ''
    });
  };

  const handleStatusUpdate = async (missionId, status) => {
    try {
      const updated = await emergencyApi.updateMissionStatus(missionId, { status });
      dispatch(updateMissionStatus({
        missionId,
        status: updated.status || status,
        timestamp: new Date().toISOString(),
        notes: `Status updated to ${status}`
      }));
      setSuccessMessage(`Mission status updated to ${status}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setFormError(error.message || 'Unable to update mission');
    }
  };

  const handleCompleteMission = async (missionId) => {
    try {
      const completed = await emergencyApi.updateMissionStatus(missionId, { status: 'Completed', outcome: 'Patient transported successfully' });
      dispatch(completeMission({
        missionId,
        outcome: completed.outcome || 'Patient transported successfully',
        completedAt: completed.completedAt || new Date().toISOString()
      }));
      setSuccessMessage('Mission completed successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setFormError(error.message || 'Unable to complete mission');
    }
  };

  const handleRefresh = () => {
    loadFleet()
      .then(() => {
        setSuccessMessage('Data refreshed.');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch((error) => setFormError(error.message || 'Unable to refresh ambulance data.'));
  };

  const availableAmbulances = ambulances.filter(a => a.status === 'Available').length;

  return (
    <div className="ambulance-tracking min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#F5EDEA] flex items-center justify-center flex-shrink-0">
              <Car className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8553D]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Ambulance Tracking & Monitoring
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Real-time GPS tracking, status monitoring, and response coordination
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
              onClick={() => setShowDispatchForm(true)}
              tooltip="Dispatch ambulance"
              variant="danger"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dispatch</span>
              <span className="sm:hidden">Dispatch</span>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Available Ambulances"
          value={availableAmbulances}
          subValue={`Out of ${ambulances.length}`}
          icon={Car}
          color="green"
          tooltip="Ambulances ready for dispatch"
        />
        <StatsCard
          title="Active Missions"
          value={activeMissions.length}
          icon={AlertCircle}
          color="red"
          tooltip="Currently active missions"
        />
        <StatsCard
          title="Avg Response Time"
          value={`${utilizationAnalytics.responseTime || 0}m`}
          icon={Clock}
          color="blue"
          tooltip="Average response time"
          trend={utilizationAnalytics.responseTime < 10 ? 'up' : 'down'}
          trendValue={utilizationAnalytics.responseTime < 10 ? 'Meeting target' : 'Above target'}
        />
        <StatsCard
          title="Utilization Rate"
          value={`${utilizationAnalytics.utilizationRate || 0}%`}
          icon={TrendingUp}
          color="orange"
          tooltip="Fleet utilization rate"
        />
      </div>

      {/* Search Bar */}
      {(activeTab === 'missions' || activeTab === 'history') && (
        <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 mb-4 sm:mb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'missions' ? 'active missions' : 'mission history'}...`}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

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
                      ? 'border-[#C8553D] text-[#C8553D]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.count !== null && (
                    <span className="text-[10px] text-[#B0A89E] ml-0.5">({tab.count})</span>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* ==================== TRACKING TAB ==================== */}
        {activeTab === 'tracking' && (
          <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#008751]" />
                Real-time Ambulance Tracking
              </h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2D7D46]"></div>
                  <span className="text-xs text-[#5A5A5A]">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#008751]"></div>
                  <span className="text-xs text-[#5A5A5A]">En Route</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C87D3D]"></div>
                  <span className="text-xs text-[#5A5A5A]">On Scene</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-[#F7F5F2] border border-[#E8E3DC] h-64 sm:h-80 md:h-96 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">🗺️</div>
                  <p className="text-[#5A5A5A] text-sm sm:text-base">Interactive Map View</p>
                  <p className="text-xs sm:text-sm text-[#B0A89E]">GPS coordinates and real-time tracking</p>
                </div>
              </div>

              {/* Ambulance markers */}
              {ambulances.map((ambulance) => (
                <AmbulanceMarker
                  key={ambulance.ambulanceId}
                  ambulance={ambulance}
                  onClick={setSelectedAmbulance}
                />
              ))}
            </div>

            {/* Selected Ambulance Details */}
            {selectedAmbulance && (
              <div className="mt-4 p-4 bg-[#F7F5F2] border border-[#E8E3DC]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-display font-semibold text-[#1A1A1A]">
                    {selectedAmbulance.vehicleNumber || 'Unknown Ambulance'}
                  </h4>
                  <ButtonWithTooltip
                    onClick={() => setSelectedAmbulance(null)}
                    tooltip="Close"
                    variant="secondary"
                    size="sm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </ButtonWithTooltip>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Status</p>
                    <StatusBadge status={selectedAmbulance.status} />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Location</p>
                    <p className="text-sm text-[#1A1A1A]">
                      {selectedAmbulance.location 
                        ? `${selectedAmbulance.location.lat?.toFixed(4) || '0.0000'}, ${selectedAmbulance.location.lng?.toFixed(4) || '0.0000'}`
                        : 'Unknown'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Fuel</p>
                    <p className="text-sm font-medium text-[#1A1A1A]">{selectedAmbulance.fuelLevel || 0}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Mileage</p>
                    <p className="text-sm text-[#1A1A1A]">{(selectedAmbulance.mileage || 0).toLocaleString()} km</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== MISSIONS TAB ==================== */}
        {activeTab === 'missions' && (
          <div className="space-y-3">
            {filteredActiveMissions.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Car className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">
                  {searchQuery ? 'No missions match your search' : 'No active missions'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-sm text-[#008751] hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              filteredActiveMissions.map(mission => (
                <MissionCard
                  key={mission.missionId}
                  mission={mission}
                  ambulances={ambulances}
                  onStatusUpdate={handleStatusUpdate}
                  onComplete={handleCompleteMission}
                />
              ))
            )}
          </div>
        )}

        {/* ==================== HISTORY TAB ==================== */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {filteredMissionHistory.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Clock className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">
                  {searchQuery ? 'No missions match your search' : 'No mission history'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-sm text-[#008751] hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              filteredMissionHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(mission => (
                <div key={mission.missionId} className="bg-white border border-[#E8E3DC] p-4 sm:p-5 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{mission.missionId || 'Unknown Mission'}</p>
                      <p className="text-xs text-[#5A5A5A]">{mission.patientInfo?.name || 'Unknown Patient'}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status="Completed" />
                      <span className="text-xs text-[#B0A89E]">
                        {mission.responseTime || 'N/A'} min
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-[#5A5A5A]">Ambulance:</span>
                      <span className="font-medium text-[#1A1A1A] ml-1">
                        {ambulances.find(a => a.ambulanceId === mission.ambulance)?.vehicleNumber || 'Unknown'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#5A5A5A]">Outcome:</span>
                      <span className="font-medium text-[#1A1A1A] ml-1 truncate">
                        {mission.outcome || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            {filteredMissionHistory.length > itemsPerPage && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-[10px] text-[#5A5A5A]">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredMissionHistory.length)} of {filteredMissionHistory.length}
                </div>
                <div className="flex items-center gap-1">
                  <IconButton
                    icon={ChevronLeft}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    tooltip="Previous page"
                    variant="default"
                    disabled={currentPage === 1}
                    size="sm"
                  />
                  <span className="text-xs text-[#5A5A5A]">
                    Page {currentPage} of {Math.ceil(filteredMissionHistory.length / itemsPerPage)}
                  </span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setCurrentPage(Math.min(Math.ceil(filteredMissionHistory.length / itemsPerPage), currentPage + 1))}
                    tooltip="Next page"
                    variant="default"
                    disabled={currentPage === Math.ceil(filteredMissionHistory.length / itemsPerPage)}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== ANALYTICS TAB ==================== */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsCard
              title="Total Missions"
              value={utilizationAnalytics.monthlyStats?.[3]?.totalMissions || 0}
              icon={Car}
              color="blue"
              subtitle="This month"
            />
            <AnalyticsCard
              title="Avg Response Time"
              value={`${utilizationAnalytics.responseTime || 0}min`}
              icon={Clock}
              color="green"
              subtitle="Target: 10min"
            />
            <AnalyticsCard
              title="Utilization Rate"
              value={`${utilizationAnalytics.utilizationRate || 0}%`}
              icon={TrendingUp}
              color="orange"
              subtitle="Fleet utilization"
            />
            <AnalyticsCard
              title="Available"
              value={availableAmbulances}
              icon={Users}
              color="red"
              subtitle={`Out of ${ambulances.length}`}
            />
          </div>
        )}
      </div>

      {/* ==================== DISPATCH FORM MODAL ==================== */}
      {showDispatchForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => {
              setShowDispatchForm(false);
              resetDispatchForm();
              setFormError('');
            }}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">Dispatch Ambulance</h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Assign an ambulance to a patient</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDispatchForm(false);
                      resetDispatchForm();
                      setFormError('');
                    }}
                    className="p-1 hover:bg-[#F0EDE8] rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleDispatch} className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Available Ambulance <span className="text-[#C8553D]">*</span>
                  </label>
                  <select
                    value={dispatchData.ambulanceId}
                    onChange={(e) => setDispatchData({...dispatchData, ambulanceId: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select Ambulance</option>
                    {ambulances.filter(a => a.status === 'Available').map(ambulance => (
                      <option key={ambulance.ambulanceId} value={ambulance.ambulanceId}>
                        {ambulance.vehicleNumber || 'Unknown'} ({ambulance.type || 'Type'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Patient <span className="text-[#C8553D]">*</span>
                  </label>
                  <select
                    value={dispatchData.patientId}
                    onChange={(e) => setDispatchData({...dispatchData, patientId: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.patientId} value={patient.patientId}>
                        {patient.name || 'Unknown'} (ID: {patient.patientId || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Incident Type
                    </label>
                    <select
                      value={dispatchData.incidentType}
                      onChange={(e) => setDispatchData({...dispatchData, incidentType: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    >
                      <option value="">Select Type</option>
                      <option value="Medical Emergency">Medical Emergency</option>
                      <option value="Trauma">Trauma</option>
                      <option value="Cardiac">Cardiac</option>
                      <option value="Respiratory">Respiratory</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Priority
                    </label>
                    <select
                      value={dispatchData.priority}
                      onChange={(e) => setDispatchData({...dispatchData, priority: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={dispatchData.location}
                    onChange={(e) => setDispatchData({...dispatchData, location: e.target.value})}
                    placeholder="Address or landmark"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Notes
                  </label>
                  <textarea
                    value={dispatchData.notes}
                    onChange={(e) => setDispatchData({...dispatchData, notes: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Additional instructions..."
                  />
                </div>

                {formError && <div className="text-sm text-[#C8553D]">{formError}</div>}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Dispatch ambulance"
                    variant="danger"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Dispatching...
                      </>
                    ) : (
                      <>
                        <Car className="w-3.5 h-3.5" />
                        Dispatch Ambulance
                      </>
                    )}
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => {
                      setShowDispatchForm(false);
                      resetDispatchForm();
                      setFormError('');
                    }}
                    tooltip="Cancel"
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </ButtonWithTooltip>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbulanceTracking;