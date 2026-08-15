import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Award,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  X,
  Loader2,
  Check,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
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
  Info,
  Clock,
  Zap,
  DollarSign,
  CreditCard,
  Banknote,
  Calculator,
  LineChart,
  Settings,
  MapPin,
  Globe,
  Mail,
  Phone,
  UserPlus,
  Smartphone,
  Droplets,
  Baby,
  Activity,
  Heart,
  Clock as ClockIcon,
  User as UserIcon,
  Building2,
  Shield,
  Ambulance,
} from 'lucide-react';
import {
  createAudit,
  updateAudit,
  scheduleAudit,
  completeAudit,
  createQualityIndicator,
  updateQualityIndicator,
  generateAuditReport,
  schedulePeerReview,
  createMortalityReview,
  updateComplianceScore,
  searchAudits,
  filterAudits,
  fetchAudits,
  fetchQualityIndicators,
  fetchPeerReviews,
  fetchMortalityReviews,
  fetchComplianceScores,
} from '../features/auditSlice';
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
    'completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'in_progress': { label: 'In Progress', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'scheduled': { label: 'Scheduled', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'overdue': { label: 'Overdue', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'cancelled': { label: 'Cancelled', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
    'excellent': { label: 'Excellent', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'good': { label: 'Good', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'warning': { label: 'Warning', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'critical': { label: 'Critical', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
  };

  const config = statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== AUDIT CARD ====================
const AuditCard = ({ audit, onComplete, onPeerReview, onView }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-4 hover:bg-[#F7F5F2] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#F7F5F2] border border-[#E8E3DC] flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4 text-[#5A5A5A]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-[#1A1A1A]">{audit.title}</span>
              <StatusBadge status={audit.status} />
            </div>
            <p className="text-xs text-[#5A5A5A]">{audit.department} • {audit.auditor}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#B0A89E]">
            {new Date(audit.scheduledDate).toLocaleDateString('en-NG')}
          </span>
          <IconButton
            icon={Eye}
            onClick={() => onView(audit.id)}
            tooltip="View audit"
            variant="primary"
            size="sm"
          />
          {audit.status === 'scheduled' && (
            <IconButton
              icon={Check}
              onClick={() => onComplete(audit.id)}
              tooltip="Complete audit"
              variant="success"
              size="sm"
            />
          )}
          <IconButton
            icon={Users}
            onClick={() => onPeerReview(audit.id)}
            tooltip="Peer review"
            variant="info"
            size="sm"
          />
        </div>
      </div>
      {audit.description && (
        <div className="mt-2 text-xs text-[#5A5A5A] truncate">{audit.description}</div>
      )}
    </div>
  );
};

// ==================== INDICATOR CARD ====================
const IndicatorCard = ({ indicator }) => {
  const getIndicatorStatus = (current, target) => {
    const currentNum = parseFloat(current.replace(/[^\d.]/g, ''));
    const targetNum = parseFloat(target.replace(/[^\d.]/g, ''));
    if (currentNum <= targetNum) return 'excellent';
    if (currentNum <= targetNum * 1.1) return 'good';
    if (currentNum <= targetNum * 1.25) return 'warning';
    return 'critical';
  };

  const status = indicator.status || getIndicatorStatus(indicator.current, indicator.target);
  const progress = Math.min((parseFloat(indicator.current.replace(/[^\d.]/g, '')) / parseFloat(indicator.target.replace(/[^\d.]/g, ''))) * 100, 100);

  return (
    <div className="bg-white border border-[#E8E3DC] p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h5 className="text-sm font-medium text-[#1A1A1A]">{indicator.name}</h5>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-[#5A5A5A] mt-1">{indicator.description}</p>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-[#5A5A5A]">Target: <span className="font-medium text-[#1A1A1A]">{indicator.target} {indicator.unit}</span></span>
            <span className="text-[#5A5A5A]">Current: <span className="font-medium text-[#008751]">{indicator.current} {indicator.unit}</span></span>
            <span className="text-[#5A5A5A]">Department: <span className="font-medium text-[#1A1A1A]">{indicator.department}</span></span>
          </div>
        </div>
        <div className="text-right ml-4">
          <div className="w-24 bg-[#F0EDE8] h-1.5 mb-1">
            <div
              className={`h-1.5 ${progress <= 100 ? 'bg-[#008751]' : 'bg-[#C8553D]'}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <span className="text-xs text-[#5A5A5A]">
            {progress.toFixed(0)}% achieved
          </span>
        </div>
      </div>
    </div>
  );
};

// ==================== PEER REVIEW CARD ====================
const PeerReviewCard = ({ review }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-medium text-[#1A1A1A]">{review.title}</h4>
          <p className="text-xs text-[#5A5A5A]">Audit: {review.auditTitle}</p>
        </div>
        <StatusBadge status={review.status} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Scheduled</p>
          <p className="text-sm text-[#1A1A1A]">{new Date(review.scheduledDate).toLocaleDateString('en-NG')}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Reviewers</p>
          <p className="text-sm text-[#1A1A1A]">{review.reviewers?.length || 0} assigned</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Cases</p>
          <p className="text-sm text-[#1A1A1A]">{review.casesCount || 0} to review</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Recommendations</p>
          <p className="text-sm text-[#1A1A1A]">{review.recommendationsCount || 0} made</p>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-[#F0EDE8]">
        <ButtonWithTooltip
          onClick={() => {}}
          tooltip="View details"
          variant="primary"
          size="sm"
        >
          <Eye className="w-3.5 h-3.5" />
          View Details
        </ButtonWithTooltip>
        <ButtonWithTooltip
          onClick={() => {}}
          tooltip="Start review"
          variant="success"
          size="sm"
        >
          <Check className="w-3.5 h-3.5" />
          Start Review
        </ButtonWithTooltip>
        <ButtonWithTooltip
          onClick={() => {}}
          tooltip="Generate report"
          variant="secondary"
          size="sm"
        >
          <FileText className="w-3.5 h-3.5" />
          Report
        </ButtonWithTooltip>
      </div>
    </div>
  );
};

// ==================== MORTALITY REVIEW CARD ====================
const MortalityReviewCard = ({ review }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-4 border-l-4 border-[#C8553D]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-medium text-[#1A1A1A]">{review.patientName}</h4>
          <p className="text-xs text-[#5A5A5A]">{review.caseType} • {review.department}</p>
        </div>
        <StatusBadge status={review.status} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Incident Date</p>
          <p className="text-sm text-[#1A1A1A]">{new Date(review.incidentDate).toLocaleDateString('en-NG')}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Review Date</p>
          <p className="text-sm text-[#1A1A1A]">{new Date(review.reviewDate).toLocaleDateString('en-NG')}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Attendees</p>
          <p className="text-sm text-[#1A1A1A]">{review.attendees?.length || 0}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Lessons</p>
          <p className="text-sm text-[#1A1A1A]">{review.lessonsLearned?.length || 0}</p>
        </div>
      </div>

      <div className="mt-3 p-3 bg-[#F5EDEA] border border-[#E8D6D0]">
        <p className="text-[10px] font-medium text-[#C8553D] uppercase tracking-wider">Summary</p>
        <p className="text-sm text-[#1A1A1A] mt-1">{review.summary}</p>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-[#F0EDE8]">
        <ButtonWithTooltip
          onClick={() => {}}
          tooltip="View full review"
          variant="primary"
          size="sm"
        >
          <Eye className="w-3.5 h-3.5" />
          View Review
        </ButtonWithTooltip>
        <ButtonWithTooltip
          onClick={() => {}}
          tooltip="Edit review"
          variant="warning"
          size="sm"
        >
          <Edit className="w-3.5 h-3.5" />
          Edit
        </ButtonWithTooltip>
        <ButtonWithTooltip
          onClick={() => {}}
          tooltip="Download report"
          variant="secondary"
          size="sm"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </ButtonWithTooltip>
      </div>
    </div>
  );
};

// ==================== COMPLIANCE PROTOCOL ====================
const ComplianceProtocol = ({ protocol, score, target }) => {
  const getScoreColor = (score) => {
    if (score >= 95) return 'text-[#2D7D46]';
    if (score >= 85) return 'text-[#008751]';
    if (score >= 75) return 'text-[#C87D3D]';
    return 'text-[#C8553D]';
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-[#1A1A1A]">{protocol}</p>
        <div className="w-full bg-[#F0EDE8] h-1.5 mt-1">
          <div
            className="bg-[#008751] h-1.5"
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
      <div className="text-right ml-4">
        <p className={`text-sm font-medium ${getScoreColor(score)}`}>
          {score}%
        </p>
        <p className="text-[10px] text-[#B0A89E]">Target: {target}%</p>
      </div>
    </div>
  );
};

const ClinicalAudit = () => {
  const dispatch = useDispatch();
  const {
    audits,
    qualityIndicators,
    peerReviews,
    mortalityReviews,
    complianceScores,
    auditReports,
    searchTerm,
    filterBy,
    loading
  } = useSelector(state => state.audit);

  const [activeTab, setActiveTab] = useState('audits');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showIndicatorModal, setShowIndicatorModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;

  const [auditForm, setAuditForm] = useState({
    title: '',
    type: 'clinical',
    department: '',
    auditor: '',
    scheduledDate: '',
    checklist: [],
    description: ''
  });

  const [indicatorForm, setIndicatorForm] = useState({
    name: '',
    category: '',
    target: '',
    current: '',
    unit: '',
    department: '',
    frequency: 'monthly',
    description: ''
  });

  // Nigerian healthcare quality standards
  const qualityStandards = {
    clinical: {
      title: 'Clinical Quality Indicators',
      indicators: [
        { name: 'Hospital-acquired infection rate', target: '<2.5%', current: '1.8%', status: 'good' },
        { name: 'Medication error rate', target: '<1%', current: '0.6%', status: 'good' },
        { name: 'Readmission rate (28-day)', target: '<5%', current: '3.2%', status: 'good' },
        { name: 'Patient satisfaction score', target: '>85%', current: '92%', status: 'excellent' },
        { name: 'Average length of stay', target: '<4.5 days', current: '3.8 days', status: 'good' },
        { name: 'Mortality rate', target: '<2%', current: '1.4%', status: 'good' }
      ]
    },
    safety: {
      title: 'Patient Safety Indicators',
      indicators: [
        { name: 'Pressure ulcer incidence', target: '<2%', current: '1.1%', status: 'good' },
        { name: 'Patient fall incidents', target: '<1%', current: '0.8%', status: 'good' },
        { name: 'Surgical site infections', target: '<1.5%', current: '0.9%', status: 'good' },
        { name: 'Blood transfusion reactions', target: '<0.1%', current: '0.05%', status: 'excellent' },
        { name: 'Ventilator-associated pneumonia', target: '<5%', current: '2.3%', status: 'good' }
      ]
    },
    efficiency: {
      title: 'Operational Efficiency',
      indicators: [
        { name: 'Bed occupancy rate', target: '75-85%', current: '82%', status: 'good' },
        { name: 'Average wait time', target: '<30 min', current: '23 min', status: 'good' },
        { name: 'Staff productivity', target: '>90%', current: '94%', status: 'excellent' },
        { name: 'Equipment utilization', target: '>80%', current: '87%', status: 'good' },
        { name: 'Cost per patient day', target: '<₦25,000', current: '₦18,500', status: 'excellent' }
      ]
    }
  };

  // Filter and search logic
  const filteredAudits = audits
    .filter(audit => {
      const matchesSearch = !searchTerm ||
        audit.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.department?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || audit.status === filterBy || audit.type === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

  const filteredIndicators = qualityIndicators
    .filter(indicator => {
      const matchesSearch = !searchTerm ||
        indicator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicator.category?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const paginatedItems = activeTab === 'audits' ? filteredAudits : filteredIndicators;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateAudit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!auditForm.title || !auditForm.department || !auditForm.scheduledDate) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      dispatch(createAudit(auditForm));
      setSuccessMessage('Audit scheduled successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setAuditForm({
        title: '',
        type: 'clinical',
        department: '',
        auditor: '',
        scheduledDate: '',
        checklist: [],
        description: ''
      });
      setShowAuditModal(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to schedule audit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateIndicator = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!indicatorForm.name || !indicatorForm.category || !indicatorForm.target) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      dispatch(createQualityIndicator(indicatorForm));
      setSuccessMessage('Quality indicator added successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setIndicatorForm({
        name: '',
        category: '',
        target: '',
        current: '',
        unit: '',
        department: '',
        frequency: 'monthly',
        description: ''
      });
      setShowIndicatorModal(false);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add quality indicator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteAudit = (auditId) => {
    dispatch(completeAudit({ auditId }));
    setSuccessMessage('Audit completed successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSchedulePeerReview = (auditId) => {
    dispatch(schedulePeerReview({ auditId }));
    setSuccessMessage('Peer review scheduled.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const overallCompliance = complianceScores.overall || 0;
  const pendingAudits = audits.filter(a => a.status === 'scheduled').length;
  const completedAudits = audits.filter(a => a.status === 'completed').length;
  const criticalIndicators = qualityIndicators.filter(i => i.status === 'critical').length;

  // Tabs configuration
  const tabs = [
    { id: 'audits', label: 'Clinical Audits', icon: ClipboardCheck },
    { id: 'indicators', label: 'Quality Indicators', icon: BarChart3 },
    { id: 'peer_review', label: 'Peer Review', icon: Users },
    { id: 'mortality', label: 'M&M Review', icon: FileText },
    { id: 'compliance', label: 'Compliance', icon: Target }
  ];

  useEffect(() => {
    dispatch(fetchAudits());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchQualityIndicators());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPeerReviews());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMortalityReviews());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchComplianceScores());
  }, [dispatch]);

  return (
    <div className="clinical-audit min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <ClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Clinical Audit & Quality Assurance
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Healthcare quality improvement and clinical governance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => {
                dispatch(fetchAudits());
                dispatch(fetchQualityIndicators());
                dispatch(fetchPeerReviews());
                dispatch(fetchMortalityReviews());
                dispatch(fetchComplianceScores());
                setSuccessMessage('Data refreshed.');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
              tooltip="Refresh data"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => dispatch(generateAuditReport())}
              tooltip="Generate audit report"
              variant="primary"
              size="sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Report</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Error & Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
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
      {loading && (
        <div className="mb-4 p-3 bg-[#F7F5F2] border border-[#E8E3DC] text-sm text-[#5A5A5A] flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-[#008751] animate-spin" />
          Loading audit data...
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Overall Compliance"
          value={`${overallCompliance}%`}
          subValue="+2.3% from last month"
          icon={Award}
          color="green"
          trend="up"
          trendValue="Improving"
          tooltip="Overall compliance score"
        />
        <StatsCard
          title="Completed Audits"
          value={completedAudits}
          subValue="This month"
          icon={CheckCircle}
          color="blue"
          tooltip="Completed clinical audits"
        />
        <StatsCard
          title="Pending Audits"
          value={pendingAudits}
          subValue="Scheduled"
          icon={Calendar}
          color="yellow"
          trend={pendingAudits > 0 ? 'down' : 'up'}
          trendValue={pendingAudits > 0 ? `${pendingAudits} pending` : 'All complete'}
          tooltip="Audits awaiting completion"
        />
        <StatsCard
          title="Critical Indicators"
          value={criticalIndicators}
          subValue="Require attention"
          icon={AlertCircle}
          color="red"
          trend={criticalIndicators > 0 ? 'down' : 'up'}
          trendValue={criticalIndicators > 0 ? `${criticalIndicators} need attention` : 'All good'}
          tooltip="Quality indicators below target"
        />
      </div>

      {/* Tab Navigation */}
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
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* ==================== AUDITS TAB ==================== */}
        {activeTab === 'audits' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Clinical Audits</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                  <input
                    type="text"
                    placeholder="Search audits..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchAudits(e.target.value))}
                    className="pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors w-full sm:w-48"
                  />
                </div>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterAudits(e.target.value))}
                  className="px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="all">All Audits</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                  <option value="clinical">Clinical</option>
                  <option value="administrative">Administrative</option>
                </select>
                <ButtonWithTooltip
                  onClick={() => setShowAuditModal(true)}
                  tooltip="Schedule new audit"
                  variant="primary"
                  size="sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Schedule Audit
                </ButtonWithTooltip>
              </div>
            </div>

            <div className="space-y-3">
              {paginatedData.length === 0 ? (
                <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                  <ClipboardCheck className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                  <p className="text-[#5A5A5A] font-medium">No audits found</p>
                  <p className="text-sm text-[#B0A89E] mt-1">
                    {searchTerm ? 'Try adjusting your search or filters' : 'Click "Schedule Audit" to create one'}
                  </p>
                </div>
              ) : (
                paginatedData.map(audit => (
                  <AuditCard
                    key={audit.id}
                    audit={audit}
                    onComplete={handleCompleteAudit}
                    onPeerReview={handleSchedulePeerReview}
                    onView={() => {}}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {filteredAudits.length > itemsPerPage && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-[10px] text-[#5A5A5A]">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAudits.length)} of {filteredAudits.length}
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
                    Page {currentPage} of {Math.ceil(filteredAudits.length / itemsPerPage)}
                  </span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setCurrentPage(Math.min(Math.ceil(filteredAudits.length / itemsPerPage), currentPage + 1))}
                    tooltip="Next page"
                    variant="default"
                    disabled={currentPage === Math.ceil(filteredAudits.length / itemsPerPage)}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== INDICATORS TAB ==================== */}
        {activeTab === 'indicators' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Quality Indicators Dashboard</h3>
              <ButtonWithTooltip
                onClick={() => setShowIndicatorModal(true)}
                tooltip="Add quality indicator"
                variant="primary"
                size="sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Indicator
              </ButtonWithTooltip>
            </div>

            {/* Quality Standards Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(qualityStandards).map(([categoryKey, category]) => {
                const categoryIndicators = category.indicators;
                const excellentCount = categoryIndicators.filter(i => i.status === 'excellent').length;
                const goodCount = categoryIndicators.filter(i => i.status === 'good').length;

                return (
                  <div key={categoryKey} className="bg-white border border-[#E8E3DC] p-5">
                    <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">{category.title}</h4>
                    <div className="space-y-2">
                      {categoryIndicators.map((indicator, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-[#F7F5F2] border border-[#F0EDE8]">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#1A1A1A]">{indicator.name}</p>
                            <p className="text-[10px] text-[#5A5A5A]">Target: {indicator.target}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-[#1A1A1A]">{indicator.current}</p>
                            <StatusBadge status={indicator.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E8E3DC] flex justify-between text-xs">
                      <span className="text-[#2D7D46]">Excellent: {excellentCount}</span>
                      <span className="text-[#008751]">Good: {goodCount}</span>
                      <span className="text-[#5A5A5A]">Total: {categoryIndicators.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Indicators */}
            <div className="bg-white border border-[#E8E3DC] p-5">
              <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Custom Quality Indicators</h4>
              <div className="space-y-3">
                {filteredIndicators.length === 0 ? (
                  <p className="text-center text-[#5A5A5A] py-4">No custom indicators added yet</p>
                ) : (
                  filteredIndicators.map(indicator => (
                    <IndicatorCard key={indicator.id} indicator={indicator} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== PEER REVIEW TAB ==================== */}
        {activeTab === 'peer_review' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Peer Review Sessions</h3>
              <ButtonWithTooltip
                onClick={() => {}}
                tooltip="Schedule peer review"
                variant="primary"
                size="sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Review
              </ButtonWithTooltip>
            </div>

            <div className="space-y-4">
              {peerReviews.length === 0 ? (
                <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                  <Users className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                  <p className="text-[#5A5A5A] font-medium">No peer review sessions scheduled</p>
                </div>
              ) : (
                peerReviews.map(review => (
                  <PeerReviewCard key={review.id} review={review} />
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== MORTALITY REVIEW TAB ==================== */}
        {activeTab === 'mortality' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Mortality & Morbidity Reviews</h3>
              <ButtonWithTooltip
                onClick={() => {}}
                tooltip="New M&M review"
                variant="danger"
                size="sm"
              >
                <Plus className="w-3.5 h-3.5" />
                New M&M Review
              </ButtonWithTooltip>
            </div>

            <div className="space-y-4">
              {mortalityReviews.length === 0 ? (
                <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                  <FileText className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                  <p className="text-[#5A5A5A] font-medium">No M&M reviews recorded</p>
                </div>
              ) : (
                mortalityReviews.map(review => (
                  <MortalityReviewCard key={review.id} review={review} />
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== COMPLIANCE TAB ==================== */}
        {activeTab === 'compliance' && (
          <div>
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Clinical Protocols Compliance</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Compliance Overview */}
              <div className="bg-white border border-[#E8E3DC] p-5">
                <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Protocol Compliance Scores</h4>
                <div className="space-y-4">
                  {[
                    { protocol: 'Antibiotic Stewardship', score: 94, target: 95 },
                    { protocol: 'Surgical Safety Checklist', score: 98, target: 100 },
                    { protocol: 'Blood Transfusion Protocol', score: 96, target: 95 },
                    { protocol: 'Infection Control Measures', score: 92, target: 95 },
                    { protocol: 'Medication Reconciliation', score: 89, target: 90 },
                    { protocol: 'Pain Management Protocol', score: 91, target: 90 }
                  ].map(protocol => (
                    <ComplianceProtocol
                      key={protocol.protocol}
                      protocol={protocol.protocol}
                      score={protocol.score}
                      target={protocol.target}
                    />
                  ))}
                </div>
              </div>

              {/* Compliance Trends */}
              <div className="bg-white border border-[#E8E3DC] p-5">
                <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Compliance Trends</h4>
                <div className="space-y-3">
                  {[
                    { month: 'Jan', score: 87 },
                    { month: 'Feb', score: 89 },
                    { month: 'Mar', score: 91 },
                    { month: 'Apr', score: 88 },
                    { month: 'May', score: 92 },
                    { month: 'Jun', score: 94 }
                  ].map(trend => (
                    <div key={trend.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1A1A1A] w-12">{trend.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-[#F0EDE8] h-1.5">
                          <div
                            className={`h-1.5 ${trend.score >= 90 ? 'bg-[#008751]' : trend.score >= 80 ? 'bg-[#C87D3D]' : 'bg-[#C8553D]'}`}
                            style={{ width: `${trend.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${trend.score >= 90 ? 'text-[#2D7D46]' : trend.score >= 80 ? 'text-[#C87D3D]' : 'text-[#C8553D]'}`}>
                        {trend.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== AUDIT CREATION MODAL ==================== */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => setShowAuditModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">Schedule Clinical Audit</h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Plan and organize a clinical audit</p>
                  </div>
                  <button
                    onClick={() => setShowAuditModal(false)}
                    className="p-1 hover:bg-[#F0EDE8] rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateAudit} className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Audit Title <span className="text-[#C8553D]">*</span>
                    </label>
                    <input
                      type="text"
                      value={auditForm.title}
                      onChange={(e) => setAuditForm({...auditForm, title: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Audit Type <span className="text-[#C8553D]">*</span>
                    </label>
                    <select
                      value={auditForm.type}
                      onChange={(e) => setAuditForm({...auditForm, type: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    >
                      <option value="clinical">Clinical Audit</option>
                      <option value="administrative">Administrative Audit</option>
                      <option value="quality">Quality Assurance</option>
                      <option value="compliance">Compliance Audit</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Department <span className="text-[#C8553D]">*</span>
                    </label>
                    <select
                      value={auditForm.department}
                      onChange={(e) => setAuditForm({...auditForm, department: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select department...</option>
                      <option value="Emergency">Emergency Department</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Medicine">Internal Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Obstetrics">Obstetrics & Gynecology</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Laboratory">Laboratory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Lead Auditor
                    </label>
                    <input
                      type="text"
                      value={auditForm.auditor}
                      onChange={(e) => setAuditForm({...auditForm, auditor: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Scheduled Date <span className="text-[#C8553D]">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={auditForm.scheduledDate}
                    onChange={(e) => setAuditForm({...auditForm, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    value={auditForm.description}
                    onChange={(e) => setAuditForm({...auditForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Audit objectives and scope..."
                  />
                </div>

                {errorMessage && (
                  <div className="text-sm text-[#C8553D]">{errorMessage}</div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Schedule audit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Schedule Audit
                      </>
                    )}
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => setShowAuditModal(false)}
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

      {/* ==================== QUALITY INDICATOR MODAL ==================== */}
      {showIndicatorModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => setShowIndicatorModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-md transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">Add Quality Indicator</h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Track a new quality metric</p>
                  </div>
                  <button
                    onClick={() => setShowIndicatorModal(false)}
                    className="p-1 hover:bg-[#F0EDE8] rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateIndicator} className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Indicator Name <span className="text-[#C8553D]">*</span>
                  </label>
                  <input
                    type="text"
                    value={indicatorForm.name}
                    onChange={(e) => setIndicatorForm({...indicatorForm, name: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Category <span className="text-[#C8553D]">*</span>
                  </label>
                  <select
                    value={indicatorForm.category}
                    onChange={(e) => setIndicatorForm({...indicatorForm, category: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select category...</option>
                    <option value="clinical">Clinical Quality</option>
                    <option value="safety">Patient Safety</option>
                    <option value="efficiency">Operational Efficiency</option>
                    <option value="satisfaction">Patient Satisfaction</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Target Value <span className="text-[#C8553D]">*</span>
                    </label>
                    <input
                      type="text"
                      value={indicatorForm.target}
                      onChange={(e) => setIndicatorForm({...indicatorForm, target: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="< 2.5%"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={indicatorForm.unit}
                      onChange={(e) => setIndicatorForm({...indicatorForm, unit: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="%"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={indicatorForm.department}
                    onChange={(e) => setIndicatorForm({...indicatorForm, department: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  >
                    <option value="">All Departments</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Medicine">Internal Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Hospital-wide">Hospital-wide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    value={indicatorForm.description}
                    onChange={(e) => setIndicatorForm({...indicatorForm, description: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Brief description of the indicator..."
                  />
                </div>

                {errorMessage && (
                  <div className="text-sm text-[#C8553D]">{errorMessage}</div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Add indicator"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        Add Indicator
                      </>
                    )}
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => setShowIndicatorModal(false)}
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

export default ClinicalAudit;