import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Lock,
  Unlock,
  Globe,
  Clock,
  UserCheck,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  Database,
  BarChart3,
  X,
  Check,
  Loader2,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Package,
  Box,
  Activity,
  Stethoscope,
  Building2,
  Clipboard,
  Ambulance,
  Smartphone,
  Phone as PhoneIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Printer,
  User,
  Menu,
  CreditCard,
  RotateCcw,
  Hospital,
  Upload as UploadIcon,
  UserCircle,
  IdCard,
  Droplets,
  Baby,
  HeartPulse,
  Brain,
  Bone,
  MapPin,
  Globe as GlobeIcon,
  BookOpen,
  Award,
  Mail as MailIcon,
  UserPlus,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  EyeOff,
  Star,
  Info,
  Zap,
  Target,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  MoreVertical,
} from 'lucide-react';
import {
  createConsentRecord,
  updateConsentRecord,
  withdrawConsent,
  submitDataRequest,
  processDataRequest,
  reportDataBreach,
  updateBreachStatus,
  generateComplianceReport,
  fetchConsentRecords,
  fetchDataRequests,
  fetchDataBreaches,
  fetchAuditLogs,
  fetchComplianceMetrics,
  fetchComplianceReports,
  auditDataAccess,
  searchComplianceData,
  filterComplianceData
} from '../features/ndprSlice';
import Pagination from '../components/Pagination';

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
    yellow: 'bg-[#C87D3D]',
  };

  return (
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
  );
};

// ==================== STATUS BADGE COMPONENT ====================
const StatusBadge = ({ status, type = 'default' }) => {
  const consentStatusMap = {
    'active': { label: 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'expired': { label: 'Expired', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'withdrawn': { label: 'Withdrawn', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
  };

  const requestStatusMap = {
    'completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'approved': { label: 'Approved', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'rejected': { label: 'Rejected', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'under_review': { label: 'Under Review', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
  };

  const breachStatusMap = {
    'resolved': { label: 'Resolved', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'contained': { label: 'Contained', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'under_investigation': { label: 'Under Investigation', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'reported': { label: 'Reported', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
  };

  let statusConfig;
  if (type === 'consent') {
    statusConfig = consentStatusMap[status] || consentStatusMap['pending'];
  } else if (type === 'request') {
    statusConfig = requestStatusMap[status] || requestStatusMap['pending'];
  } else if (type === 'breach') {
    statusConfig = breachStatusMap[status] || breachStatusMap['under_investigation'];
  } else {
    statusConfig = { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border ${statusConfig.color}`}>
      {status === 'active' && <Check className="w-3 h-3" />}
      {status === 'pending' && <Clock className="w-3 h-3" />}
      {status === 'withdrawn' && <X className="w-3 h-3" />}
      {status === 'expired' && <AlertCircle className="w-3 h-3" />}
      {status === 'completed' && <CheckCircle className="w-3 h-3" />}
      {status === 'rejected' && <XCircle className="w-3 h-3" />}
      {statusConfig.label}
    </span>
  );
};

// ==================== BREACH SEVERITY BADGE ====================
const BreachSeverityBadge = ({ severity }) => {
  const severityMap = {
    'low': { label: 'Low', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'medium': { label: 'Medium', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'high': { label: 'High', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'critical': { label: 'Critical', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
  };

  const config = severityMap[severity] || severityMap['low'];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {severity === 'critical' && <AlertCircle className="w-3 h-3" />}
      {severity === 'high' && <AlertTriangle className="w-3 h-3" />}
      {config.label}
    </span>
  );
};

const NDPRCompliance = () => {
  const dispatch = useDispatch();
  const {
    consentRecords,
    dataRequests,
    dataBreaches,
    auditLogs,
    complianceMetrics,
    searchTerm,
    filterBy,
    loading,
    error,
    complianceReports
  } = useSelector(state => state.ndpr);

  const [activeTab, setActiveTab] = useState('overview');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showBreachModal, setShowBreachModal] = useState(false);
  const [showDataRequestModal, setShowDataRequestModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const itemsPerPage = 10;

  const [consentForm, setConsentForm] = useState({
    patientId: '',
    patientName: '',
    consentType: '',
    purpose: '',
    dataCategories: [],
    retentionPeriod: '',
    thirdParties: [],
    consentMethod: 'digital',
    witnessName: ''
  });

  const [breachForm, setBreachForm] = useState({
    breachType: '',
    affectedData: [],
    affectedIndividuals: '',
    breachDate: '',
    discoveryDate: '',
    description: '',
    containmentActions: '',
    impactAssessment: '',
    reportedToNITDA: false,
    notificationSent: false
  });

  const [dataRequestForm, setDataRequestForm] = useState({
    requesterType: 'data_subject',
    requesterName: '',
    requesterContact: '',
    requestType: '',
    dataCategories: [],
    reason: '',
    urgency: 'normal',
    identityVerification: ''
  });

  const ndprMetrics = {
    overview: {
      consentCompliance: complianceMetrics.consentCompliance || 0,
      dataRequestsProcessed: complianceMetrics.dataRequestsProcessed || 0,
      breachResponseTime: complianceMetrics.breachResponseTime || 0,
      auditCompliance: complianceMetrics.auditCompliance || 0,
      trainingCompletion: complianceMetrics.trainingCompletion || 0,
    },
    dataRequests: {
      totalRequests: complianceMetrics.totalRequests || 0,
      completedRequests: Math.max((complianceMetrics.totalRequests || 0) - (complianceMetrics.pendingRequests || 0), 0),
      pendingRequests: complianceMetrics.pendingRequests || 0,
      averageProcessingTime: 0,
      accessRequests: dataRequests.filter((request) => request.requestType === 'access').length,
      rectificationRequests: dataRequests.filter((request) => request.requestType === 'rectification').length,
      erasureRequests: dataRequests.filter((request) => request.requestType === 'erasure').length,
    },
    breaches: {
      totalBreaches: complianceMetrics.totalBreaches || 0,
      containedBreaches: dataBreaches.filter((breach) => ['contained', 'resolved', 'reported'].includes(breach.status)).length,
      averageResponseTime: complianceMetrics.breachResponseTime || 0,
      reportedToNITDA: dataBreaches.filter((breach) => breach.reportedToNITDA).length,
      affectedIndividuals: dataBreaches.reduce((total, breach) => total + Number(breach.affectedIndividuals || 0), 0),
    },
  };

  useEffect(() => {
    const loadComplianceData = async () => {
      setErrorMessage('');
      try {
        await Promise.all([
          dispatch(fetchConsentRecords()),
          dispatch(fetchDataRequests()),
          dispatch(fetchDataBreaches()),
          dispatch(fetchAuditLogs()),
          dispatch(fetchComplianceMetrics()),
          dispatch(fetchComplianceReports()),
        ]);
      } catch (loadError) {
        setErrorMessage(loadError.message || 'Unable to load NDPR compliance data.');
      }
    };
    loadComplianceData();
  }, [dispatch]);

  useEffect(() => {
    if (error) setErrorMessage(error);
  }, [error]);

  // Filter and search logic
  const filteredConsents = consentRecords
    .filter(consent => {
      const matchesSearch = !searchTerm ||
        consent.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consent.patientId?.includes(searchTerm);
      const matchesFilter = filterBy === 'all' || consent.status === filterBy || consent.consentType === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredRequests = dataRequests
    .filter(request => {
      const matchesSearch = !searchTerm ||
        request.requesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || request.status === filterBy || request.requestType === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginatedItems = activeTab === 'consents' ? filteredConsents : filteredRequests;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateConsent = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!consentForm.patientId || !consentForm.patientName || !consentForm.consentType || !consentForm.purpose) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    try {
      await dispatch(createConsentRecord(consentForm)).unwrap();
      setSuccessMessage('Consent record created successfully.');
    } catch (createError) {
      setErrorMessage(createError.message || 'Unable to create consent record.');
      return;
    }
    setConsentForm({
      patientId: '',
      patientName: '',
      consentType: '',
      purpose: '',
      dataCategories: [],
      retentionPeriod: '',
      thirdParties: [],
      consentMethod: 'digital',
      witnessName: ''
    });
    setTimeout(() => setShowConsentModal(false), 500);
  };

  const handleReportBreach = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!breachForm.breachType || !breachForm.affectedIndividuals || !breachForm.breachDate || !breachForm.description) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    try {
      await dispatch(reportDataBreach(breachForm)).unwrap();
      setSuccessMessage('Data breach reported successfully.');
    } catch (reportError) {
      setErrorMessage(reportError.message || 'Unable to report data breach.');
      return;
    }
    setBreachForm({
      breachType: '',
      affectedData: [],
      affectedIndividuals: '',
      breachDate: '',
      discoveryDate: '',
      description: '',
      containmentActions: '',
      impactAssessment: '',
      reportedToNITDA: false,
      notificationSent: false
    });
    setTimeout(() => setShowBreachModal(false), 500);
  };

  const handleSubmitDataRequest = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!dataRequestForm.requesterName || !dataRequestForm.requesterContact || !dataRequestForm.requestType) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    try {
      await dispatch(submitDataRequest(dataRequestForm)).unwrap();
      setSuccessMessage('Data subject request submitted successfully.');
    } catch (requestError) {
      setErrorMessage(requestError.message || 'Unable to submit data subject request.');
      return;
    }
    setDataRequestForm({
      requesterType: 'data_subject',
      requesterName: '',
      requesterContact: '',
      requestType: '',
      dataCategories: [],
      reason: '',
      urgency: 'normal',
      identityVerification: ''
    });
    setTimeout(() => setShowDataRequestModal(false), 500);
  };

  const handleProcessRequest = async (requestId, action) => {
    try {
      await dispatch(processDataRequest({ requestId, action })).unwrap();
      setSuccessMessage(`Request ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
    } catch (processError) {
      setErrorMessage(processError.message || 'Unable to process data request.');
    }
  };

  const getConsentStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]';
      case 'expired': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      case 'withdrawn': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      case 'pending': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      default: return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    }
  };

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]';
      case 'approved': return 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]';
      case 'rejected': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      case 'pending': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      case 'under_review': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      default: return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    }
  };

  const getBreachSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]';
      case 'medium': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      case 'high': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      case 'critical': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      default: return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    }
  };

  const activeConsents = consentRecords.filter(c => c.status === 'active').length;
  const pendingRequests = dataRequests.filter(r => r.status === 'pending').length;
  const openBreaches = dataBreaches.filter(b => b.status !== 'resolved').length;
  const complianceScore = ndprMetrics.overview.consentCompliance;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'consents', label: 'Consent Management', icon: FileText },
    { id: 'data_requests', label: 'Data Subject Rights', icon: Users },
    { id: 'breaches', label: 'Data Breaches', icon: AlertTriangle },
    { id: 'audit', label: 'Audit Logs', icon: Eye },
    { id: 'reports', label: 'Compliance Reports', icon: Download }
  ];

  return (
    <div className="ndpr-compliance min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                NDPR Compliance Automation 
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Nigeria Data Protection Regulation compliance management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => {
                dispatch(fetchConsentRecords());
                dispatch(fetchDataRequests());
                dispatch(fetchDataBreaches());
                dispatch(fetchAuditLogs());
                dispatch(fetchComplianceMetrics());
                dispatch(fetchComplianceReports());
              }}
              tooltip="Refresh compliance data"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Compliance Score"
          value={`${complianceScore}%`}
          subValue="Above target"
          icon={Shield}
          color="green"
          tooltip="Overall NDPR compliance score"
          trend="up"
          trendValue="+2.3% this month"
        />
        <StatsCard
          title="Active Consents"
          value={activeConsents}
          subValue={`${consentRecords.length > 0 ? Math.round((activeConsents / consentRecords.length) * 100) : 0}% of total`}
          icon={FileText}
          color="blue"
          tooltip="Currently active patient consents"
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests}
          subValue={`Avg. processing: ${ndprMetrics.dataRequests.averageProcessingTime} days`}
          icon={Clock}
          color="warm"
          tooltip="Data subject requests awaiting processing"
          trend={pendingRequests > 0 ? 'down' : 'up'}
          trendValue={pendingRequests > 0 ? `${pendingRequests} requests pending` : 'All requests processed'}
        />
        <StatsCard
          title="Open Breaches"
          value={openBreaches}
          subValue="All contained"
          icon={AlertTriangle}
          color="red"
          tooltip="Data breaches under investigation"
          trend={openBreaches > 0 ? 'down' : 'up'}
          trendValue={openBreaches > 0 ? `${openBreaches} active breaches` : 'No open breaches'}
        />
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

      {/* Tab Navigation */}
      <div className="bg-white border border-[#E8E3DC] p-4 sm:p-6 mb-4 sm:mb-8">
        <div className="flex flex-wrap gap-1 border-b border-[#E8E3DC] mb-4 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <Tooltip key={tab.id} text={`View ${tab.label}`}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#008751] text-[#008751]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Metrics */}
              <div>
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">NDPR Compliance Metrics</h3>
                <div className="space-y-3">
                  {[
                    { metric: 'Consent Compliance', value: ndprMetrics.overview.consentCompliance, target: 95 },
                    { metric: 'Data Request Processing', value: ndprMetrics.overview.dataRequestsProcessed, target: 95 },
                    { metric: 'Breach Response Time', value: ndprMetrics.overview.breachResponseTime, target: 72, unit: 'hrs' },
                    { metric: 'Audit Compliance', value: ndprMetrics.overview.auditCompliance, target: 95 },
                    { metric: 'Staff Training', value: ndprMetrics.overview.trainingCompletion, target: 90 }
                  ].map(metric => (
                    <div key={metric.metric} className="bg-white border border-[#E8E3DC] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-[#1A1A1A]">{metric.metric}</h4>
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium border ${
                          metric.value >= metric.target 
                            ? 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' 
                            : 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]'
                        }`}>
                          {metric.value >= metric.target ? 'On Target' : 'Below Target'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-display font-bold text-[#1A1A1A]">
                            {metric.value}{metric.unit || '%'}
                          </p>
                          <p className="text-xs text-[#5A5A5A]">Target: {metric.target}{metric.unit || '%'}</p>
                        </div>
                        <div className="w-32 bg-[#F0EDE8] h-1.5">
                          <div
                            className={`h-1.5 transition-all duration-500 ${metric.value >= metric.target ? 'bg-[#008751]' : 'bg-[#C87D3D]'}`}
                            style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Subject Rights Overview */}
              <div>
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Data Subject Rights Processing</h3>
                <div className="space-y-3">
                  {[
                    { right: 'Right to Access', requests: ndprMetrics.dataRequests.accessRequests },
                    { right: 'Right to Rectification', requests: ndprMetrics.dataRequests.rectificationRequests },
                    { right: 'Right to Erasure', requests: ndprMetrics.dataRequests.erasureRequests },
                    { right: 'Right to Object', requests: dataRequests.filter((request) => request.requestType === 'object').length },
                    { right: 'Data Portability', requests: dataRequests.filter((request) => request.requestType === 'portability').length }
                  ].map(right => (
                    <div key={right.right} className="bg-white border border-[#E8E3DC] p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-[#1A1A1A]">{right.right}</h4>
                        <span className="text-xs text-[#5A5A5A]">{right.requests} requests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#5A5A5A]">Recorded requests: {right.requests}</span>
                        <span className="inline-flex items-center gap-1 text-xs text-[#2D7D46]">
                          <CheckCircle className="w-3 h-3" />
                          Compliant
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Recent Compliance Activity</h3>
              <div className="bg-white border border-[#E8E3DC]">
                <div className="divide-y divide-[#F0EDE8]">
                  {auditLogs.slice(0, 5).map((log) => {
                    const activity = {
                      action: log.actionType || 'Compliance activity',
                      subject: log.description || log.resourceType || 'System',
                      time: formatDate(log.created_at),
                      type: log.actionType?.includes('breach') ? 'breach' : log.actionType?.includes('request') ? 'request' : log.actionType?.includes('consent') ? 'consent' : 'audit',
                    };
                    return (
                    <div key={log.id} className="p-4 flex items-center justify-between hover:bg-[#F7F5F2] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${
                          activity.type === 'consent' ? 'bg-[#E8F5EF]' :
                          activity.type === 'request' ? 'bg-[#EAF3EE]' :
                          activity.type === 'audit' ? 'bg-[#F5F0EA]' :
                          'bg-[#F5EDEA]'
                        }`}>
                          {activity.type === 'consent' && <FileText className="w-4 h-4 text-[#008751]" />}
                          {activity.type === 'request' && <Users className="w-4 h-4 text-[#2D7D46]" />}
                          {activity.type === 'audit' && <Eye className="w-4 h-4 text-[#C87D3D]" />}
                          {activity.type === 'breach' && <AlertTriangle className="w-4 h-4 text-[#C8553D]" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">{activity.action}</p>
                          <p className="text-xs text-[#5A5A5A]">{activity.subject}</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#B0A89E]">{activity.time}</span>
                    </div>
                    );
                  })}
                  {auditLogs.length === 0 && <p className="p-4 text-sm text-[#5A5A5A]">No compliance activity recorded.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consents' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                  <input
                    type="text"
                    placeholder="Search consents..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchComplianceData(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterComplianceData(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="all">All Consents</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="withdrawn">Withdrawn</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex items-end">
                <ButtonWithTooltip
                  onClick={() => setShowConsentModal(true)}
                  tooltip="Record new patient consent"
                  variant="primary"
                  className="w-full"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Consent
                </ButtonWithTooltip>
              </div>
            </div>

            {/* Consents Table */}
            <div className="bg-white border border-[#E8E3DC]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E8E3DC]">
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Consent Type</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Purpose</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Expires</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EDE8]">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[#5A5A5A]">
                          <FileText className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
                          <p className="font-medium">No consent records found</p>
                          {searchTerm && <p className="text-xs text-[#B0A89E] mt-1">Try adjusting your search</p>}
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map(consent => (
                        <tr key={consent.id} className="hover:bg-[#F7F5F2] transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-sm text-[#1A1A1A]">{consent.patientName}</p>
                              <p className="text-xs text-[#5A5A5A]">ID: {consent.patientId}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#5A5A5A] capitalize hidden sm:table-cell">
                            {consent.consentType?.replace('_', ' ')}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#5A5A5A] truncate max-w-[150px] hidden md:table-cell">
                            {consent.purpose}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getConsentStatusColor(consent.status)}`}>
                              {consent.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#5A5A5A] hidden lg:table-cell">
                            {formatDate(consent.expiryDate)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {consent.status === 'active' && (
                                <IconButton
                                  icon={XCircle}
                                  onClick={async () => {
                                    const reason = window.prompt('Reason for withdrawing this consent:');
                                    if (reason === null) return;
                                    try {
                                      await dispatch(withdrawConsent({ consentId: consent.id, reason })).unwrap();
                                      setSuccessMessage('Consent withdrawn successfully.');
                                    } catch (withdrawError) {
                                      setErrorMessage(withdrawError.message || 'Unable to withdraw consent.');
                                    }
                                  }}
                                  tooltip="Withdraw Consent"
                                  variant="danger"
                                  size="sm"
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data_requests' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchComplianceData(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterComplianceData(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-end">
                <ButtonWithTooltip
                  onClick={() => setShowDataRequestModal(true)}
                  tooltip="Submit new data subject request"
                  variant="primary"
                  className="w-full"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Request
                </ButtonWithTooltip>
              </div>
            </div>

            {/* Data Requests Table */}
            <div className="bg-white border border-[#E8E3DC]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E8E3DC]">
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Requester</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Request Type</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Submitted</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Processing Time</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EDE8]">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[#5A5A5A]">
                          <Users className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
                          <p className="font-medium">No data requests found</p>
                          {searchTerm && <p className="text-xs text-[#B0A89E] mt-1">Try adjusting your search</p>}
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map(request => (
                        <tr key={request.id} className="hover:bg-[#F7F5F2] transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-sm text-[#1A1A1A]">{request.requesterName}</p>
                              <p className="text-xs text-[#5A5A5A] capitalize">{request.requesterType?.replace('_', ' ')}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#5A5A5A] capitalize hidden sm:table-cell">
                            {request.requestType?.replace('_', ' ')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getRequestStatusColor(request.status)}`}>
                              {request.status?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#5A5A5A] hidden md:table-cell">
                            {formatDate(request.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#5A5A5A] hidden lg:table-cell">
                            {request.processingTime || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {request.status === 'pending' && (
                                <>
                                  <IconButton
                                    icon={Check}
                                    onClick={() => handleProcessRequest(request.id, 'approve')}
                                    tooltip="Approve Request"
                                    variant="success"
                                    size="sm"
                                  />
                                  <IconButton
                                    icon={X}
                                    onClick={() => handleProcessRequest(request.id, 'reject')}
                                    tooltip="Reject Request"
                                    variant="danger"
                                    size="sm"
                                  />
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'breaches' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Data Breach Management</h3>
              <ButtonWithTooltip
                onClick={() => setShowBreachModal(true)}
                tooltip="Report a new data breach"
                variant="danger"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Report Breach
              </ButtonWithTooltip>
            </div>

            <div className="space-y-4">
              {dataBreaches.length === 0 ? (
                <div className="bg-white border border-[#E8E3DC] p-8 text-center">
                  <Shield className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                  <p className="text-[#5A5A5A] font-medium">No data breaches reported</p>
                  <p className="text-sm text-[#B0A89E] mt-1">All clear</p>
                </div>
              ) : (
                dataBreaches.map(breach => (
                  <div key={breach.id} className="bg-white border border-[#E8E3DC] p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-medium text-[#1A1A1A]">{breach.breachType} Breach</h4>
                        <p className="text-sm text-[#5A5A5A]">Reported: {formatDate(breach.discoveryDate)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <BreachSeverityBadge severity={breach.severity} />
                        <StatusBadge status={breach.status} type="breach" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      <div>
                        <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Affected Individuals</p>
                        <p className="text-sm font-medium text-[#1A1A1A]">{breach.affectedIndividuals}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Response Time</p>
                        <p className="text-sm font-medium text-[#1A1A1A]">{breach.responseTimeHours || 0} hours</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">NITDA Notified</p>
                        <p className="text-sm font-medium text-[#1A1A1A]">{breach.reportedToNITDA ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Notifications Sent</p>
                        <p className="text-sm font-medium text-[#1A1A1A]">{breach.notificationsSent || 0}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Containment Actions</p>
                      <p className="text-sm text-[#5A5A5A]">{breach.containmentActions}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-[#F0EDE8]">
                      <ButtonWithTooltip
                        onClick={async () => {
                          const nextStatus = window.prompt('Enter status: investigating, contained, resolved, or reported', breach.status);
                          if (!nextStatus || !['investigating', 'contained', 'resolved', 'reported'].includes(nextStatus)) return;
                          try {
                            await dispatch(updateBreachStatus({ breachId: breach.id, status: nextStatus })).unwrap();
                            setSuccessMessage('Breach status updated.');
                          } catch (statusError) {
                            setErrorMessage(statusError.message || 'Unable to update breach status.');
                          }
                        }}
                        tooltip="Update breach status"
                        variant="primary"
                        size="sm"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Update Status
                      </ButtonWithTooltip>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Data Access Audit Logs</h3>
            <div className="bg-white border border-[#E8E3DC]">
              {auditLogs.length === 0 ? (
                <div className="p-8 text-center">
                  <Database className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                  <p className="text-[#5A5A5A] font-medium">No audit logs available</p>
                </div>
              ) : (
                <div className="divide-y divide-[#F0EDE8]">
                  {auditLogs.map(log => (
                    <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#F7F5F2] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-[#E8F5EF] flex items-center justify-center">
                          <Database className="w-4 h-4 text-[#008751]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">{log.action}</p>
                            <p className="text-xs text-[#5A5A5A]">
                            {log.description || log.resourceType || 'Compliance event'}{log.patientId ? ` · Patient: ${log.patientId}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right sm:text-left">
                        <p className="text-sm text-[#5A5A5A]">{log.created_at ? new Date(log.created_at).toLocaleString('en-NG') : 'N/A'}</p>
                        <p className="text-xs text-[#B0A89E]">{log.ipAddress || 'IP not recorded'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Compliance Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report Types */}
              <div className="bg-white border border-[#E8E3DC] p-5">
                <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Generate Reports</h4>
                <div className="space-y-2">
                  {['consent_audit', 'data_subject_rights', 'breach_incident', 'annual_compliance'].map((reportType) => (
                    <button
                      key={reportType}
                      type="button"
                      onClick={async () => {
                        try {
                          const end = new Date();
                          const start = new Date(end.getFullYear(), 0, 1);
                          await dispatch(generateComplianceReport({
                            reportType,
                            title: reportType.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
                            periodStart: start.toISOString().slice(0, 10),
                            periodEnd: end.toISOString().slice(0, 10),
                            status: 'generated',
                          })).unwrap();
                          await dispatch(fetchComplianceReports());
                          setSuccessMessage('Compliance report generated.');
                        } catch (reportError) {
                          setErrorMessage(reportError.message || 'Unable to generate compliance report.');
                        }
                      }}
                      className="w-full p-3 bg-[#F7F5F2] border border-[#E8E3DC] hover:border-[#008751] hover:bg-[#F7F5F2] transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[#1A1A1A] text-sm">{reportType.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())}</p>
                          <p className="text-xs text-[#5A5A5A]">Generate from persisted tenant compliance records</p>
                        </div>
                        <Download className="w-4 h-4 text-[#5A5A5A]" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Persisted report history */}
              <div className="bg-white border border-[#E8E3DC] p-5">
                <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Generated Report History</h4>
                <div className="space-y-2">
                  {complianceReports.length === 0 ? <p className="text-sm text-[#5A5A5A]">No compliance reports have been generated.</p> : complianceReports.slice(0, 8).map((report) => (
                    <div key={report.id} className="flex items-center justify-between py-2 border-b border-[#F0EDE8] last:border-0">
                      <div><p className="text-sm text-[#1A1A1A]">{report.title}</p><p className="text-xs text-[#5A5A5A]">{formatDate(report.periodStart)} - {formatDate(report.periodEnd)}</p></div>
                      <StatusBadge status={report.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'consents' || activeTab === 'data_requests') && paginatedItems.length > itemsPerPage && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(paginatedItems.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => setShowConsentModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#008751]" />
                      Record Patient Consent
                    </h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Record a new patient consent record</p>
                  </div>
                  <button onClick={() => setShowConsentModal(false)} className="p-1 hover:bg-[#F0EDE8] rounded transition-colors">
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateConsent} className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Patient ID <span className="text-[#C8553D]">*</span>
                    </label>
                    <input
                      type="text"
                      value={consentForm.patientId}
                      onChange={(e) => setConsentForm({...consentForm, patientId: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Patient Name <span className="text-[#C8553D]">*</span>
                    </label>
                    <input
                      type="text"
                      value={consentForm.patientName}
                      onChange={(e) => setConsentForm({...consentForm, patientName: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Consent Type <span className="text-[#C8553D]">*</span>
                    </label>
                    <select
                      value={consentForm.consentType}
                      onChange={(e) => setConsentForm({...consentForm, consentType: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select type...</option>
                      <option value="treatment">Treatment & Care</option>
                      <option value="data_processing">Data Processing</option>
                      <option value="research">Research Participation</option>
                      <option value="marketing">Marketing Communications</option>
                      <option value="third_party">Third Party Sharing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Consent Method <span className="text-[#C8553D]">*</span>
                    </label>
                    <select
                      value={consentForm.consentMethod}
                      onChange={(e) => setConsentForm({...consentForm, consentMethod: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    >
                      <option value="digital">Digital Signature</option>
                      <option value="paper">Paper Form</option>
                      <option value="verbal">Verbal Consent</option>
                      <option value="implied">Implied Consent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Purpose & Scope <span className="text-[#C8553D]">*</span>
                  </label>
                  <textarea
                    value={consentForm.purpose}
                    onChange={(e) => setConsentForm({...consentForm, purpose: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Describe the purpose and scope of data processing..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Retention Period</label>
                    <select
                      value={consentForm.retentionPeriod}
                      onChange={(e) => setConsentForm({...consentForm, retentionPeriod: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    >
                      <option value="">Select period...</option>
                      <option value="treatment_period">During Treatment</option>
                      <option value="5_years">5 Years</option>
                      <option value="10_years">10 Years</option>
                      <option value="indefinite">Indefinite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Witness Name</label>
                    <input
                      type="text"
                      value={consentForm.witnessName}
                      onChange={(e) => setConsentForm({...consentForm, witnessName: e.target.value})}
                      placeholder="For paper consents"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Record consent"
                    variant="primary"
                    className="flex-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Record Consent
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => setShowConsentModal(false)}
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

      {/* Data Breach Modal */}
      {showBreachModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => setShowBreachModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-[#C8553D]" />
                      Report Data Breach
                    </h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Report a data breach incident</p>
                  </div>
                  <button onClick={() => setShowBreachModal(false)} className="p-1 hover:bg-[#F0EDE8] rounded transition-colors">
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleReportBreach} className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Breach Type <span className="text-[#C8553D]">*</span>
                    </label>
                    <select
                      value={breachForm.breachType}
                      onChange={(e) => setBreachForm({...breachForm, breachType: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select type...</option>
                      <option value="unauthorized_access">Unauthorized Access</option>
                      <option value="data_loss">Data Loss/Theft</option>
                      <option value="hacking">Hacking/Cyber Attack</option>
                      <option value="physical_theft">Physical Theft</option>
                      <option value="accidental_disclosure">Accidental Disclosure</option>
                      <option value="system_failure">System Failure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Affected Individuals <span className="text-[#C8553D]">*</span>
                    </label>
                    <input
                      type="number"
                      value={breachForm.affectedIndividuals}
                      onChange={(e) => setBreachForm({...breachForm, affectedIndividuals: e.target.value})}
                      placeholder="Number of people affected"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Breach Date <span className="text-[#C8553D]">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={breachForm.breachDate}
                      onChange={(e) => setBreachForm({...breachForm, breachDate: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Discovery Date <span className="text-[#C8553D]">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={breachForm.discoveryDate}
                      onChange={(e) => setBreachForm({...breachForm, discoveryDate: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Affected Data Categories
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Personal Information', 'Medical Records', 'Financial Data', 'Contact Details', 'Identification', 'Biometric Data'].map(category => (
                      <label key={category} className="flex items-center gap-1.5 text-sm text-[#1A1A1A]">
                        <input
                          type="checkbox"
                          checked={breachForm.affectedData?.includes(category)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...(breachForm.affectedData || []), category]
                              : (breachForm.affectedData || []).filter(c => c !== category);
                            setBreachForm({...breachForm, affectedData: updated});
                          }}
                          className="rounded border-[#D8D4CD] text-[#008751] focus:ring-0 focus:ring-offset-0"
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Description of Breach <span className="text-[#C8553D]">*</span>
                  </label>
                  <textarea
                    value={breachForm.description}
                    onChange={(e) => setBreachForm({...breachForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Detailed description of what happened..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Containment Actions <span className="text-[#C8553D]">*</span>
                  </label>
                  <textarea
                    value={breachForm.containmentActions}
                    onChange={(e) => setBreachForm({...breachForm, containmentActions: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Steps taken to contain the breach..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Impact Assessment</label>
                  <textarea
                    value={breachForm.impactAssessment}
                    onChange={(e) => setBreachForm({...breachForm, impactAssessment: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Assessment of potential harm to individuals..."
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                    <input
                      type="checkbox"
                      checked={breachForm.reportedToNITDA}
                      onChange={(e) => setBreachForm({...breachForm, reportedToNITDA: e.target.checked})}
                      className="rounded border-[#D8D4CD] text-[#008751] focus:ring-0 focus:ring-offset-0"
                    />
                    Reported to NITDA within 72 hours
                  </label>

                  <label className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                    <input
                      type="checkbox"
                      checked={breachForm.notificationSent}
                      onChange={(e) => setBreachForm({...breachForm, notificationSent: e.target.checked})}
                      className="rounded border-[#D8D4CD] text-[#008751] focus:ring-0 focus:ring-offset-0"
                    />
                    Affected individuals notified
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Report breach"
                    variant="danger"
                    className="flex-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Report Breach
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => setShowBreachModal(false)}
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

      {/* Data Request Modal */}
      {showDataRequestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => setShowDataRequestModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#008751]" />
                      Submit Data Subject Request
                    </h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Submit a data subject rights request</p>
                  </div>
                  <button onClick={() => setShowDataRequestModal(false)} className="p-1 hover:bg-[#F0EDE8] rounded transition-colors">
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmitDataRequest} className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Requester Type <span className="text-[#C8553D]">*</span>
                  </label>
                  <select
                    value={dataRequestForm.requesterType}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, requesterType: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  >
                    <option value="data_subject">Data Subject</option>
                    <option value="legal_representative">Legal Representative</option>
                    <option value="authorized_person">Authorized Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Requester Name <span className="text-[#C8553D]">*</span>
                  </label>
                  <input
                    type="text"
                    value={dataRequestForm.requesterName}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, requesterName: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Contact Information <span className="text-[#C8553D]">*</span>
                  </label>
                  <input
                    type="text"
                    value={dataRequestForm.requesterContact}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, requesterContact: e.target.value})}
                    placeholder="Email or phone number"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Request Type <span className="text-[#C8553D]">*</span>
                  </label>
                  <select
                    value={dataRequestForm.requestType}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, requestType: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select request type...</option>
                    <option value="access">Right to Access</option>
                    <option value="rectification">Right to Rectification</option>
                    <option value="erasure">Right to Erasure</option>
                    <option value="restriction">Right to Restriction</option>
                    <option value="portability">Right to Data Portability</option>
                    <option value="objection">Right to Object</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Reason for Request <span className="text-[#C8553D]">*</span>
                  </label>
                  <textarea
                    value={dataRequestForm.reason}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, reason: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Please explain why you are making this request..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Urgency Level</label>
                  <select
                    value={dataRequestForm.urgency}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, urgency: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  >
                    <option value="normal">Normal (30 days)</option>
                    <option value="urgent">Urgent (15 days)</option>
                    <option value="critical">Critical (3 days)</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Submit request"
                    variant="primary"
                    className="flex-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Submit Request
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => setShowDataRequestModal(false)}
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

export default NDPRCompliance;