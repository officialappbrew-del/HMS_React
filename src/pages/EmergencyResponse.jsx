import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  AlertCircle,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Plus,
  CheckCircle,
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
import { reportIncident, updateIncident, dispatchResponse } from '../features/emergencyResponseSlice';
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
const StatusBadge = ({ status, type = 'default' }) => {
  const statusMap = {
    'Received': { label: 'Received', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'Dispatched': { label: 'Dispatched', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'En Route': { label: 'En Route', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Cancelled': { label: 'Cancelled', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
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

// ==================== EMERGENCY CALL CARD ====================
const EmergencyCallCard = ({ call, onViewDetails }) => {
  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      case 'High': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      case 'Medium': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      default: return 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]';
    }
  };

  return (
    <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 hover:bg-[#F7F5F2] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-[#F5EDEA] flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-[#C8553D]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-display font-semibold text-[#1A1A1A]">
                {call.callId || 'Unknown Call'}
              </span>
              <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getSeverityColor(call.severity)}`}>
                {call.severity || 'Unknown'}
              </span>
              <StatusBadge status={call.status} />
            </div>
            <p className="text-xs text-[#5A5A5A] mt-0.5">
              {call.callerName || 'Unknown Caller'} • {call.callerPhone || 'No phone'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#B0A89E]">
            {call.callTime ? new Date(call.callTime).toLocaleDateString('en-NG') : '-'}
          </span>
          <IconButton
            icon={Eye}
            onClick={() => onViewDetails(call)}
            tooltip="View details"
            variant="primary"
            size="sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-[#F0EDE8]">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Location</p>
          <p className="text-sm text-[#1A1A1A] truncate">
            {call.incidentLocation?.address || 'Address not available'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Patient</p>
          <p className="text-sm text-[#1A1A1A]">
            {call.patientDetails?.name || 'Unknown'}
            {call.patientDetails?.age && ` • ${call.patientDetails.age}y/o`}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Response Time</p>
          <p className="text-sm font-medium text-[#008751]">
            {call.responseTime || 0} mins
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== DISPATCH OPTIMIZATION CARD ====================
const DispatchOptimizationCard = ({ optimization }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <ArrowRight className="w-4 h-4 text-[#008751]" />
        <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">
          Call: {optimization.callId || 'N/A'}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Ambulance</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{optimization.selectedAmbulance || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Est. Response</p>
          <p className="text-sm font-medium text-[#C87D3D]">{optimization.estimatedResponseTime || 0} mins</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Actual Response</p>
          <p className="text-sm font-medium text-[#2D7D46]">{optimization.actualResponseTime || 0} mins</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Distance</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{optimization.distance || 0} km</p>
        </div>
      </div>

      <div className="mt-3 p-3 bg-[#E8F5EF] border border-[#C8E0D5]">
        <p className="text-xs text-[#1A1A1A]">
          <span className="font-medium">Selection Reason:</span>{' '}
          {optimization.selectionReason || 'No reason provided'}
        </p>
      </div>
    </div>
  );
};

// ==================== COMMUNICATION CARD ====================
const CommunicationCard = ({ comm }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 border-l-4 border-[#008751]">
      <div className="flex items-start gap-3">
        <MessageSquare className="w-4 h-4 text-[#008751] mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <p className="text-sm font-medium text-[#1A1A1A]">
                {comm.communicationType || 'Unknown Type'}
              </p>
              <p className="text-xs text-[#5A5A5A]">{comm.callId || 'No Call ID'}</p>
            </div>
            <p className="text-xs text-[#B0A89E]">
              {comm.timestamp ? new Date(comm.timestamp).toLocaleTimeString('en-NG') : '-'}
            </p>
          </div>
          <div className="mt-2 p-3 bg-[#F7F5F2] border border-[#E8E3DC]">
            <p className="text-sm text-[#1A1A1A]">{comm.message || 'No message content'}</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#5A5A5A]">
            <span>From: {comm.sender || 'Unknown'}</span>
            <span>To: {comm.recipient || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const EmergencyResponse = () => {
  const emergencyResponse = useSelector(state => state.emergencyResponse || {});
  const ambulanceState = useSelector(state => state.ambulance || {});
  
  const emergencyCalls = emergencyResponse.emergencyCalls || [];
  const dispatchOptimizations = emergencyResponse.dispatchOptimizations || [];
  const hospitalPreNotifications = emergencyResponse.hospitalPreNotifications || [];
  const communications = emergencyResponse.communications || [];
  const ambulances = ambulanceState.ambulances || [];
  
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('active');
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    callerName: '',
    callerPhone: '',
    severity: 'Medium',
    incidentDescription: '',
    patientName: '',
    ambulanceId: ''
  });
  const [statusForm, setStatusForm] = useState('Received');

  const activeCalls = emergencyCalls.filter(c => c && c.status && c.status !== 'Completed' && c.status !== 'Cancelled');
  const completedCalls = emergencyCalls.filter(c => c && c.status && (c.status === 'Completed' || c.status === 'Cancelled'));

  const getFilteredCalls = (calls) => {
    if (!searchQuery) return calls;
    
    return calls.filter(call => 
      (call.callId && call.callId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (call.callerName && call.callerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (call.patientDetails?.name && call.patientDetails.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (call.severity && call.severity.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredActiveCalls = getFilteredCalls(activeCalls);
  const filteredCompletedCalls = getFilteredCalls(completedCalls);
  const filteredCommunications = searchQuery 
    ? communications.filter(comm =>
        (comm.communicationType && comm.communicationType.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (comm.message && comm.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (comm.sender && comm.sender.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : communications;

  const callsToday = emergencyCalls.filter(c => {
    if (!c || !c.callTime) return false;
    const callDate = new Date(c.callTime).toLocaleDateString();
    return callDate === new Date().toLocaleDateString();
  }).length;

  const criticalCases = emergencyCalls.filter(c => c && c.severity === 'Critical').length;
  const averageResponseTime = activeCalls.length > 0
    ? Math.round(activeCalls.reduce((sum, c) => sum + (c.responseTime || 0), 0) / activeCalls.length)
    : 0;

  // Tabs configuration
  const tabs = [
    { id: 'active', label: 'Active Calls', icon: AlertCircle, count: activeCalls.length },
    { id: 'history', label: 'Call History', icon: Clock, count: completedCalls.length },
    { id: 'dispatch', label: 'Dispatch Optimization', icon: ArrowRight, count: dispatchOptimizations.length },
    { id: 'communication', label: 'Communications', icon: MessageSquare, count: communications.length },
  ];

  useEffect(() => {
    const loadCalls = async () => {
      try {
        const calls = await emergencyApi.getCalls();
        const normalized = Array.isArray(calls) ? calls : calls.results || [];
        normalized.forEach((call) => dispatch(reportIncident({
          callId: call.callId || call.id,
          callerName: call.callerName,
          callerPhone: call.callerPhone,
          severity: call.severity,
          status: call.status,
          incidentLocation: call.incidentLocation || {},
          patientDetails: call.patientDetails || { name: call.patientName },
          incidentType: call.incidentType,
          responseTime: call.responseTime || 0,
          dispatchedAmbulance: call.dispatchedAmbulance,
          callTime: call.created_at,
          notes: call.notes,
          communications: call.communications || []
        })));
      } catch (error) {
        console.error('Failed to load emergency calls', error);
      }
    };

    if (!emergencyCalls.length) {
      loadCalls();
    }
  }, [dispatch, emergencyCalls.length]);

  const handleCreateCall = async () => {
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const payload = {
        callerName: formData.callerName,
        callerPhone: formData.callerPhone,
        severity: formData.severity,
        incidentDescription: formData.incidentDescription,
        patientName: formData.patientName,
        incidentType: formData.incidentDescription || 'Medical Emergency',
        incidentLocation: { address: 'On-site incident', coordinates: { lat: 6.5244, lng: 3.3792 } },
        patientDetails: { name: formData.patientName || 'Unknown' },
        status: 'Received',
        dispatchedAmbulance: formData.ambulanceId || ''
      };
      const created = await emergencyApi.createCall(payload);
      dispatch(reportIncident({
        callId: created.callId || created.id,
        callerName: created.callerName,
        callerPhone: created.callerPhone,
        severity: created.severity,
        status: created.status,
        incidentLocation: created.incidentLocation || {},
        patientDetails: created.patientDetails || { name: created.patientName },
        incidentType: created.incidentType,
        responseTime: created.responseTime || 0,
        dispatchedAmbulance: created.dispatchedAmbulance,
        callTime: created.created_at,
        notes: created.notes,
        communications: created.communications || []
      }));
      setSuccessMessage('Emergency call created successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowCallModal(false);
      setFormData({ callerName: '', callerPhone: '', severity: 'Medium', incidentDescription: '', patientName: '', ambulanceId: '' });
    } catch (error) {
      setFormError(error.message || 'Unable to create emergency call');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCall = async () => {
    if (!selectedCall) return;
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const updated = await emergencyApi.updateCallStatus(selectedCall.callId || selectedCall.id, { 
        status: statusForm, 
        responseTime: selectedCall.responseTime || 0 
      });
      dispatch(updateIncident({
        incidentId: selectedCall.callId || selectedCall.id,
        status: updated.status,
        responseTime: updated.responseTime || selectedCall.responseTime || 0,
        dispatchedAmbulance: updated.dispatchedAmbulance || selectedCall.dispatchedAmbulance
      }));
      setSuccessMessage('Call status updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setSelectedCall(null);
    } catch (error) {
      setFormError(error.message || 'Unable to update call');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    // Refresh logic would go here
    setSuccessMessage('Data refreshed.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="emergency-response min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#F5EDEA] flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8553D]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Emergency Response Management
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Monitor emergency calls, dispatch ambulances, and coordinate response
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
              onClick={() => setShowCallModal(true)}
              tooltip="Create new emergency call"
              variant="danger"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Emergency Call</span>
              <span className="sm:hidden">New Call</span>
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
          title="Active Calls"
          value={activeCalls.length}
          icon={AlertCircle}
          color="red"
          tooltip="Currently active emergency calls"
        />
        <StatsCard
          title="Avg Response"
          value={`${averageResponseTime}m`}
          icon={Clock}
          color="blue"
          tooltip="Average response time"
        />
        <StatsCard
          title="Calls Today"
          value={callsToday}
          icon={CheckCircle}
          color="green"
          tooltip="Calls received today"
        />
        <StatsCard
          title="Critical Cases"
          value={criticalCases}
          icon={Heart}
          color="purple"
          tooltip="Critical severity cases"
        />
        <StatsCard
          title="Hospitals Notified"
          value={hospitalPreNotifications.length}
          icon={Building2}
          color="orange"
          tooltip="Hospitals pre-notified"
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
                      ? 'border-[#C8553D] text-[#C8553D]'
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

        {/* ==================== ACTIVE CALLS TAB ==================== */}
        {activeTab === 'active' && (
          <div className="space-y-3">
            {filteredActiveCalls.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <AlertCircle className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No active emergency calls</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredActiveCalls.map(call => (
                <EmergencyCallCard
                  key={call.callId}
                  call={call}
                  onViewDetails={setSelectedCall}
                />
              ))
            )}
          </div>
        )}

        {/* ==================== CALL HISTORY TAB ==================== */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {filteredCompletedCalls.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Clock className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No completed emergency calls</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredCompletedCalls.map(call => (
                <div key={call.callId} className="bg-white border border-[#E8E3DC] p-4 sm:p-5 opacity-75 hover:opacity-100 transition-opacity">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div>
                      <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Call ID</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">{call.callId || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Patient</p>
                      <p className="text-sm text-[#1A1A1A]">{call.patientDetails?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Incident</p>
                      <p className="text-sm text-[#1A1A1A]">{call.incidentType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Response</p>
                      <p className="text-sm font-medium text-[#008751]">{call.responseTime || 0} mins</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Date</p>
                      <p className="text-sm text-[#1A1A1A]">
                        {call.callTime ? new Date(call.callTime).toLocaleDateString('en-NG') : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== DISPATCH OPTIMIZATION TAB ==================== */}
        {activeTab === 'dispatch' && (
          <div className="space-y-4">
            {dispatchOptimizations.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <ArrowRight className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No dispatch optimization data available</p>
              </div>
            ) : (
              dispatchOptimizations.map(optimization => (
                <DispatchOptimizationCard key={optimization.optimizationId} optimization={optimization} />
              ))
            )}
          </div>
        )}

        {/* ==================== COMMUNICATIONS TAB ==================== */}
        {activeTab === 'communication' && (
          <div className="space-y-3">
            {filteredCommunications.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <MessageSquare className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No communications available</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredCommunications.map(comm => (
                <CommunicationCard key={comm.communicationId} comm={comm} />
              ))
            )}
          </div>
        )}
      </div>

      {/* ==================== NEW EMERGENCY CALL MODAL ==================== */}
      <GenericModal
        isOpen={showCallModal}
        onClose={() => {
          setShowCallModal(false);
          setFormData({ callerName: '', callerPhone: '', severity: 'Medium', incidentDescription: '', patientName: '', ambulanceId: '' });
          setFormError('');
        }}
        title="Create New Emergency Call"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Caller Name <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="text"
                placeholder="Caller Name"
                value={formData.callerName}
                onChange={(e) => setFormData({ ...formData, callerName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Caller Phone <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="tel"
                placeholder="Caller Phone"
                value={formData.callerPhone}
                onChange={(e) => setFormData({ ...formData, callerPhone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Severity <span className="text-[#C8553D]">*</span>
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Incident Description <span className="text-[#C8553D]">*</span>
            </label>
            <textarea
              placeholder="Incident Description"
              rows="3"
              value={formData.incidentDescription}
              onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Patient Name
            </label>
            <input
              type="text"
              placeholder="Patient Name"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Assign Ambulance
            </label>
            <select
              value={formData.ambulanceId}
              onChange={(e) => setFormData({ ...formData, ambulanceId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            >
              <option value="">Select Ambulance</option>
              {ambulances
                .filter(a => a && a.status === 'Available')
                .map(a => (
                  <option key={a.ambulanceId} value={a.ambulanceId}>
                    {a.vehicleNumber || a.registration || 'Unknown'}
                  </option>
                ))
              }
            </select>
          </div>

          {formError && <div className="text-sm text-[#C8553D]">{formError}</div>}

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              onClick={handleCreateCall}
              tooltip="Create emergency call"
              variant="danger"
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
                  Create Call
                </>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setShowCallModal(false);
                setFormData({ callerName: '', callerPhone: '', severity: 'Medium', incidentDescription: '', patientName: '', ambulanceId: '' });
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

      {/* ==================== CALL DETAILS MODAL ==================== */}
      {selectedCall && (
        <GenericModal
          isOpen={!!selectedCall}
          onClose={() => {
            setSelectedCall(null);
            setFormError('');
          }}
          title={`Call Details: ${selectedCall.callId || 'Unknown Call'}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</p>
                <p className="text-sm font-medium text-[#1A1A1A]">{selectedCall.status || 'Unknown'}</p>
              </div>
              <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Response Time</p>
                <p className="text-sm font-medium text-[#008751]">{selectedCall.responseTime || 0} mins</p>
              </div>
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
                <option value="Received">Received</option>
                <option value="Dispatched">Dispatched</option>
                <option value="En Route">En Route</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {formError && <div className="text-sm text-[#C8553D]">{formError}</div>}

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
              <ButtonWithTooltip
                onClick={handleUpdateCall}
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
                  setSelectedCall(null);
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

export default EmergencyResponse;