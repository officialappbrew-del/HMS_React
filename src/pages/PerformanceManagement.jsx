import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Plus,
  BarChart3,
  Award,
  FileText,
  Users,
  TrendingUp,
  AlertTriangle,
  X,
  Check,
  Loader2,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Building2,
  Clipboard,
  Shield,
  Activity,
  HeartPulse,
  Brain,
  Stethoscope,
  BookOpen,
  Star,
  Info,
  Target,
  CheckCircle,
  AlertCircle,
  DollarSign,
  CreditCard,
  Banknote,
  Calculator,
  LineChart,
  PieChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Briefcase,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  EyeOff,
  Zap,
  MapPin,
  Globe,
  Mail,
  Phone,
  UserPlus,
  Smartphone,
  Droplets,
  Baby,
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { apiRequest, parseListResponse } from '../utils/api';
import { addAppraisal, addResearchOutput, addTeachingHours, addSatisfactionScore, addIncidentRecord } from '../features/performanceSlice';

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
    'Excellent': { label: 'Excellent', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Very Good': { label: 'Very Good', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'Good': { label: 'Good', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Fair': { label: 'Fair', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'Poor': { label: 'Poor', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'High': { label: 'High', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'Medium': { label: 'Medium', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Low': { label: 'Low', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Closed': { label: 'Closed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'In Progress': { label: 'In Progress', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'Open': { label: 'Open', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
  };

  const config = statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== SCORE CARD ====================
const ScoreCard = ({ label, score, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-[#E8F5EF] text-[#008751]',
    green: 'bg-[#EAF3EE] text-[#2D7D46]',
    purple: 'bg-[#F0EDE8] text-[#4A5A5A]',
    orange: 'bg-[#F5F0EA] text-[#C87D3D]',
    red: 'bg-[#F5EDEA] text-[#C8553D]',
  };

  return (
    <div className={`p-4 border border-[#E8E3DC] ${colorMap[color]}`}>
      <p className="text-[10px] font-medium uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-2xl font-display font-bold">{score}</p>
      <p className="text-[10px] mt-0.5">out of 5</p>
    </div>
  );
};

// ==================== APPRAISAL CARD ====================
const AppraisalCard = ({ appraisal, staff, dimensions }) => {
  const getStaffName = (staffId) => {
    const member = staff.find(s => (s.staffId || s.employeeId || s.id) === staffId);
    return member?.name || member?.full_name || 'Unknown Staff';
  };

  const getRatingColor = (rating) => {
    const num = parseFloat(rating);
    if (num >= 4.5) return 'text-[#2D7D46]';
    if (num >= 4) return 'text-[#008751]';
    if (num >= 3) return 'text-[#C87D3D]';
    return 'text-[#C8553D]';
  };

  const getRatingLabel = (rating) => {
    const num = parseFloat(rating);
    if (num >= 4.5) return 'Excellent';
    if (num >= 4) return 'Very Good';
    if (num >= 3) return 'Good';
    if (num >= 2) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="bg-white border border-[#E8E3DC] p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E8F5EF] flex items-center justify-center">
              <User className="w-4 h-4 text-[#008751]" />
            </div>
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">
              {getStaffName(appraisal.staffId)}
            </h3>
          </div>
          <p className="text-xs text-[#5A5A5A] mt-0.5">Period: {appraisal.appraisalPeriod}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-2xl font-display font-bold ${getRatingColor(appraisal.overallRating)}`}>
            {appraisal.overallRating}/5
          </span>
          <StatusBadge status={getRatingLabel(appraisal.overallRating)} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
        {dimensions.map(dimension => (
          <div key={dimension.key} className="bg-[#F7F5F2] border border-[#F0EDE8] p-3 text-center">
            <p className="text-[10px] text-[#5A5A5A] font-medium uppercase tracking-wider">
              {dimension.name}
            </p>
            <p className={`text-xl font-display font-bold mt-1 ${getRatingColor(appraisal[dimension.key])}`}>
              {appraisal[dimension.key]}
            </p>
            <p className="text-[10px] text-[#B0A89E]">{getRatingLabel(appraisal[dimension.key])}</p>
          </div>
        ))}
      </div>

      {appraisal.comments && (
        <div className="p-3 bg-[#F7F5F2] border border-[#E8E3DC]">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Comments</p>
          <p className="text-sm text-[#1A1A1A] mt-1">{appraisal.comments}</p>
        </div>
      )}
    </div>
  );
};

// ==================== INCIDENT CARD ====================
const IncidentCard = ({ incident, staff }) => {
  const getStaffName = (staffId) => {
    const member = staff.find(s => (s.staffId || s.employeeId || s.id) === staffId);
    return member?.name || member?.full_name || 'Unknown Staff';
  };

  return (
    <div className="bg-white border border-[#E8E3DC] p-5 border-l-4 border-[#C87D3D]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-start">
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Type</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{incident.incidentType}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Reported</p>
          <p className="text-sm text-[#1A1A1A]">{new Date(incident.reportedDate).toLocaleDateString('en-NG')}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Staff</p>
          <p className="text-sm text-[#1A1A1A]">{getStaffName(incident.staffId)}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Severity</p>
          <StatusBadge status={incident.severity} />
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Investigation</p>
          <StatusBadge status={incident.investigationStatus} />
        </div>
      </div>

      <div className="mt-3 p-3 bg-[#F5F0EA] border border-[#F0E8DC]">
        <p className="text-[10px] font-medium text-[#C87D3D] uppercase tracking-wider">Description</p>
        <p className="text-sm text-[#1A1A1A] mt-1">{incident.description}</p>
      </div>

      {incident.rootCauseAnalysis && (
        <div className="mt-2 p-3 bg-[#F7F5F2] border border-[#E8E3DC]">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Root Cause Analysis</p>
          <p className="text-sm text-[#1A1A1A] mt-1">{incident.rootCauseAnalysis}</p>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const PerformanceManagement = () => {
  const performanceState = useSelector(state => state.performance) || {};
  const appraisals = performanceState.appraisals || [];
  const auditRecords = performanceState.auditRecords || [];
  const researchOutput = performanceState.researchOutput || [];
  const teachingHours = performanceState.teachingHours || [];
  const satisfactionScores = performanceState.satisfactionScores || [];
  const incidentRecords = performanceState.incidentRecords || [];
  const dispatch = useDispatch();
  const { staff } = useSelector(state => state.staff);

  const [activeTab, setActiveTab] = useState('appraisals');
  const [showAppraisalForm, setShowAppraisalForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [appraisalData, setAppraisalData] = useState({
    staffId: '',
    appraisalPeriod: '',
    clinicalExcellence: '4',
    patientCare: '4',
    teamwork: '4',
    leadership: '4',
    continuousLearning: '4',
    comments: ''
  });

  const performanceDimensions = [
    { name: 'Clinical Excellence', key: 'clinicalExcellence' },
    { name: 'Patient Care', key: 'patientCare' },
    { name: 'Teamwork', key: 'teamwork' },
    { name: 'Leadership', key: 'leadership' },
    { name: 'Continuous Learning', key: 'continuousLearning' }
  ];

  // Tabs configuration
  const tabs = [
    { id: 'appraisals', label: 'Appraisals', icon: Award, count: appraisals.length },
    { id: 'audits', label: 'Clinical Audits', icon: Clipboard, count: auditRecords.length },
    { id: 'research', label: 'Research', icon: TrendingUp, count: researchOutput.length },
    { id: 'teaching', label: 'Teaching', icon: Users, count: teachingHours.length },
    { id: 'satisfaction', label: 'Satisfaction', icon: Star, count: satisfactionScores.length },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, count: incidentRecords.length },
  ];

  useEffect(() => {
    const loadPerformanceData = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const [appraisalResponse, auditResponse, researchResponse, teachingResponse, satisfactionResponse, incidentResponse] = await Promise.all([
          apiRequest('/api/v1/ward-rounds/performance-appraisals/'),
          apiRequest('/api/v1/ward-rounds/performance-audits/'),
          apiRequest('/api/v1/ward-rounds/research-outputs/'),
          apiRequest('/api/v1/ward-rounds/teaching-activities/'),
          apiRequest('/api/v1/ward-rounds/satisfaction-surveys/'),
          apiRequest('/api/v1/ward-rounds/performance-incidents/')
        ]);

        parseListResponse(appraisalResponse).forEach(item => {
          dispatch(addAppraisal({ ...item, appraisalId: item.appraisalId || item.id, comments: item.comments || item.overallComments }));
        });

        parseListResponse(researchResponse).forEach(item => {
          dispatch(addResearchOutput({ ...item, researchId: item.researchId || item.id }));
        });

        parseListResponse(teachingResponse).forEach(item => {
          dispatch(addTeachingHours({ ...item, teachingId: item.teachingId || item.id }));
        });

        parseListResponse(satisfactionResponse).forEach(item => {
          dispatch(addSatisfactionScore({ ...item, satisfactionId: item.satisfactionId || item.id }));
        });

        parseListResponse(incidentResponse).forEach(item => {
          dispatch(addIncidentRecord({ ...item, incidentId: item.incidentId || item.id, investigationStatus: item.investigationStatus || item.status || 'Open' }));
        });
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load performance data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadPerformanceData();
  }, [dispatch]);

  const handleAddAppraisal = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!appraisalData.staffId || !appraisalData.appraisalPeriod) {
      setErrorMessage('Please select a staff member and enter the appraisal period.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        staffId: appraisalData.staffId,
        staffName: staff.find(s => (s.staffId || s.employeeId || s.id) === appraisalData.staffId)?.name || '',
        appraisalYear: new Date().getFullYear(),
        period: appraisalData.appraisalPeriod,
        rater: 'Performance Manager',
        rating: Math.max(...performanceDimensions.map(d => parseFloat(appraisalData[d.key] || 0))),
        clinicalExcellence: parseFloat(appraisalData.clinicalExcellence),
        patientCare: parseFloat(appraisalData.patientCare),
        teamwork: parseFloat(appraisalData.teamwork),
        leadership: parseFloat(appraisalData.leadership),
        continuousLearning: parseFloat(appraisalData.continuousLearning),
        overallComments: appraisalData.comments,
        status: 'Completed',
        date: new Date().toISOString().split('T')[0]
      };

      const response = await apiRequest('/api/v1/ward-rounds/performance-appraisals/', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      dispatch(addAppraisal({
        ...response,
        appraisalId: response.appraisalId || response.id,
        comments: response.comments || response.overallComments,
        overallRating: response.overallRating || response.rating
      }));

      setShowAppraisalForm(false);
      setSuccessMessage('Appraisal added successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setAppraisalData({
        staffId: '',
        appraisalPeriod: '',
        clinicalExcellence: '4',
        patientCare: '4',
        teamwork: '4',
        leadership: '4',
        continuousLearning: '4',
        comments: ''
      });
    } catch (err) {
      setErrorMessage(err.message || 'Unable to save appraisal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStaffName = (staffId) => {
    if (!staffId) return 'Unknown Staff';
    const member = staff.find(s => (s.staffId || s.employeeId || s.id) === staffId);
    return member?.name || member?.full_name || 'Unknown Staff';
  };

  const getRatingColor = (rating) => {
    const num = parseFloat(rating);
    if (num >= 4.5) return 'text-[#2D7D46]';
    if (num >= 4) return 'text-[#008751]';
    if (num >= 3) return 'text-[#C87D3D]';
    return 'text-[#C8553D]';
  };

  const getRatingLabel = (rating) => {
    const num = parseFloat(rating);
    if (num >= 4.5) return 'Excellent';
    if (num >= 4) return 'Very Good';
    if (num >= 3) return 'Good';
    if (num >= 2) return 'Fair';
    return 'Poor';
  };

  const openIncidents = incidentRecords.filter(i => i.investigationStatus !== 'Closed').length;

  return (
    <div className="performance-management min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Performance Management
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Track staff appraisals, audits, research, and satisfaction
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => {
                window.location.reload();
              }}
              tooltip="Refresh data"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowAppraisalForm(true)}
              tooltip="Add new appraisal"
              variant="primary"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Appraisal</span>
              <span className="sm:hidden">Add</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Error & Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMessage}
          </span>
          <button onClick={() => setErrorMessage('')} className="text-[#C8553D] hover:text-[#A8442E]">
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

      {/* Loading State */}
      {isLoading && (
        <div className="mb-4 p-3 bg-[#F7F5F2] border border-[#E8E3DC] text-sm text-[#5A5A5A] flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-[#008751] animate-spin" />
          Loading performance data...
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Completed Appraisals"
          value={appraisals.length}
          icon={Award}
          color="blue"
          tooltip="Total completed performance appraisals"
        />
        <StatsCard
          title="Clinical Audits"
          value={auditRecords.length}
          icon={FileText}
          color="green"
          tooltip="Total clinical audit records"
        />
        <StatsCard
          title="Research Publications"
          value={researchOutput.length}
          icon={TrendingUp}
          color="purple"
          tooltip="Total research publications"
        />
        <StatsCard
          title="Open Incidents"
          value={openIncidents}
          subValue={`${incidentRecords.length} total incidents`}
          icon={AlertTriangle}
          color="orange"
          trend={openIncidents > 0 ? 'down' : 'up'}
          trendValue={openIncidents > 0 ? `${openIncidents} need attention` : 'All clear'}
          tooltip="Incidents requiring investigation"
        />
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

        {/* ==================== APPRAISALS TAB ==================== */}
        {activeTab === 'appraisals' && (
          <div className="space-y-4">
            {appraisals.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Award className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No appraisals completed yet</p>
                <p className="text-sm text-[#B0A89E] mt-1">Click "Add Appraisal" to get started</p>
              </div>
            ) : (
              appraisals.map(appraisal => (
                <AppraisalCard
                  key={appraisal.appraisalId}
                  appraisal={appraisal}
                  staff={staff}
                  dimensions={performanceDimensions}
                />
              ))
            )}
          </div>
        )}

        {/* ==================== AUDITS TAB ==================== */}
        {activeTab === 'audits' && (
          <div className="space-y-4">
            {auditRecords.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <FileText className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No audit records found</p>
              </div>
            ) : (
              auditRecords.map(audit => (
                <div key={audit.auditId} className="bg-white border border-[#E8E3DC] p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-start">
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Department</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">{audit.department}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Audit Type</p>
                      <p className="text-sm text-[#1A1A1A]">{audit.auditType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date</p>
                      <p className="text-sm text-[#1A1A1A]">{new Date(audit.auditDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Cases Reviewed</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">{audit.casesReviewed}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Compliance</p>
                      <p className="text-sm font-medium text-[#2D7D46]">{audit.complianceRate}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Auditor</p>
                      <p className="text-sm text-[#1A1A1A]">{audit.auditor}</p>
                    </div>
                  </div>
                  {audit.findings && (
                    <div className="mt-3 p-3 bg-[#F5F0EA] border border-[#F0E8DC]">
                      <p className="text-[10px] font-medium text-[#C87D3D] uppercase tracking-wider">Key Findings</p>
                      <p className="text-sm text-[#1A1A1A] mt-1">{audit.findings}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== RESEARCH TAB ==================== */}
        {activeTab === 'research' && (
          <div className="space-y-4">
            {researchOutput.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <TrendingUp className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No research publications found</p>
              </div>
            ) : (
              researchOutput.map(research => (
                <div key={research.researchId} className="bg-white border border-[#E8E3DC] p-5">
                  <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">{research.publicationTitle}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Authors</p>
                      <p className="text-sm text-[#1A1A1A]">{research.authors}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Journal</p>
                      <p className="text-sm text-[#1A1A1A]">{research.journal}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Published</p>
                      <p className="text-sm text-[#1A1A1A]">{new Date(research.publicationDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Citations</p>
                      <p className="text-sm font-medium text-[#008751]">{research.citationCount}</p>
                    </div>
                  </div>
                  {research.abstract && (
                    <div className="mt-3 p-3 bg-[#F7F5F2] border border-[#E8E3DC]">
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Abstract</p>
                      <p className="text-sm text-[#1A1A1A] mt-1">{research.abstract}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== TEACHING TAB ==================== */}
        {activeTab === 'teaching' && (
          <div className="space-y-4">
            {teachingHours.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Users className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No teaching records found</p>
              </div>
            ) : (
              teachingHours.map(teaching => (
                <div key={teaching.teachingId} className="bg-white border border-[#E8E3DC] p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Staff</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">{getStaffName(teaching.staffId)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Topic</p>
                      <p className="text-sm text-[#1A1A1A]">{teaching.topic}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Hours</p>
                      <p className="text-sm font-medium text-[#008751]">{teaching.hoursDelivered}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Students</p>
                      <p className="text-sm text-[#1A1A1A]">{teaching.studentsCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Feedback</p>
                      <p className="text-sm font-medium text-[#2D7D46]">{teaching.feedbackScore}/5</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== SATISFACTION TAB ==================== */}
        {activeTab === 'satisfaction' && (
          <div className="space-y-4">
            {satisfactionScores.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Star className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No satisfaction data found</p>
              </div>
            ) : (
              satisfactionScores.map(satisfaction => (
                <div key={satisfaction.satisfactionId} className="bg-white border border-[#E8E3DC] p-5">
                  <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">
                    Survey Period: {new Date(satisfaction.surveyDate).toLocaleDateString('en-NG')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <ScoreCard label="Clinical Care" score={satisfaction.clinicalCareScore} color="blue" />
                    <ScoreCard label="Communication" score={satisfaction.communicationScore} color="green" />
                    <ScoreCard label="Responsiveness" score={satisfaction.responsivenessScore} color="purple" />
                    <ScoreCard label="Professionalism" score={satisfaction.professionalismScore} color="orange" />
                    <ScoreCard label="Overall" score={satisfaction.overallScore} color="red" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==================== INCIDENTS TAB ==================== */}
        {activeTab === 'incidents' && (
          <div className="space-y-4">
            {incidentRecords.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No incidents reported</p>
              </div>
            ) : (
              incidentRecords.map(incident => (
                <IncidentCard
                  key={incident.incidentId}
                  incident={incident}
                  staff={staff}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* ==================== ADD APPRAISAL MODAL ==================== */}
      <GenericModal
        isOpen={showAppraisalForm}
        onClose={() => {
          setShowAppraisalForm(false);
          setAppraisalData({
            staffId: '',
            appraisalPeriod: '',
            clinicalExcellence: '4',
            patientCare: '4',
            teamwork: '4',
            leadership: '4',
            continuousLearning: '4',
            comments: ''
          });
          setErrorMessage('');
        }}
        title="Add Performance Appraisal"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Staff Member <span className="text-[#C8553D]">*</span>
            </label>
            <select
              value={appraisalData.staffId}
              onChange={(e) => setAppraisalData({ ...appraisalData, staffId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            >
              <option value="">Select Staff Member</option>
              {staff.map(s => (
                <option key={s.staffId || s.id} value={s.staffId || s.id}>
                  {s.name || s.full_name || 'Unknown Staff'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Appraisal Period <span className="text-[#C8553D]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Jan 2025 - Dec 2025"
              value={appraisalData.appraisalPeriod}
              onChange={(e) => setAppraisalData({ ...appraisalData, appraisalPeriod: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {performanceDimensions.map(dimension => (
              <div key={dimension.key}>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                  {dimension.name}
                </label>
                <select
                  value={appraisalData[dimension.key]}
                  onChange={(e) => setAppraisalData({ ...appraisalData, [dimension.key]: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Comments
            </label>
            <textarea
              placeholder="Comments and observations"
              value={appraisalData.comments}
              onChange={(e) => setAppraisalData({ ...appraisalData, comments: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          {errorMessage && (
            <div className="text-sm text-[#C8553D]">{errorMessage}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              onClick={handleAddAppraisal}
              tooltip="Save appraisal"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save Appraisal
                </>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setShowAppraisalForm(false);
                setAppraisalData({
                  staffId: '',
                  appraisalPeriod: '',
                  clinicalExcellence: '4',
                  patientCare: '4',
                  teamwork: '4',
                  leadership: '4',
                  continuousLearning: '4',
                  comments: ''
                });
                setErrorMessage('');
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
    </div>
  );
};

export default PerformanceManagement;