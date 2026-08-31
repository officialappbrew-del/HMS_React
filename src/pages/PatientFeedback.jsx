import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
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
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Smile,
  Meh,
  Frown,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Loader2,
  ArrowUp,
  ArrowDown,
  Info
} from 'lucide-react';
import {
  createSurvey,
  sendSurvey,
  submitFeedback,
  createComplaint,
  updateComplaint,
  resolveComplaint,
  escalateComplaint,
  createImprovementPlan,
  updateQualityMetrics,
  generateFeedbackReport,
  searchFeedback,
  filterFeedback
} from '../features/feedbackSlice';

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
    purple: 'bg-[#6B4C9A]',
    blue: 'bg-[#2C6B8A]',
  };

  return (
    <Tooltip text={tooltip}>
      <div 
        onClick={onClick}
        className={`bg-white border border-[#E8E3DC] p-4 sm:p-5 ${onClick ? 'cursor-pointer hover:border-[#008751] transition-colors' : ''} ${className}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
            <p className="mt-1 text-xl sm:text-2xl lg:text-3xl font-display font-bold text-[#1A1A1A] tracking-tight truncate">{value}</p>
            {subValue && (
              <p className="text-xs text-[#5A5A5A] mt-0.5 truncate">{subValue}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-1 text-xs ${trendColors[trend]} font-medium`}>
                {trend === 'up' && <ArrowUp className="w-3 h-3 mr-0.5 flex-shrink-0" />}
                {trend === 'down' && <ArrowDown className="w-3 h-3 mr-0.5 flex-shrink-0" />}
                <span className="truncate">{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-10 h-10 lg:w-12 lg:h-12 ${colorMap[color]} rounded flex items-center justify-center flex-shrink-0 ml-3`}>
            <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

// ==================== SURVEY MODAL ====================
const SurveyModal = ({ isOpen, onClose, surveyForm, setSurveyForm, onSubmit, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300">
          <div className="border-b border-[#E8E3DC] p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-[#1A1A1A] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#008751]" />
                  Create Patient Survey
                </h2>
                <p className="text-sm text-[#5A5A5A] mt-0.5">Design and send patient satisfaction surveys</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#E8E3DC] rounded transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-[#5A5A5A]" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Survey Title *</label>
                  <input
                    type="text"
                    value={surveyForm.title}
                    onChange={(e) => setSurveyForm({...surveyForm, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="e.g. Patient Satisfaction Survey"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Survey Type *</label>
                  <select
                    value={surveyForm.type}
                    onChange={(e) => setSurveyForm({...surveyForm, type: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="post_visit">Post-Visit Survey</option>
                    <option value="admission">Admission Experience</option>
                    <option value="discharge">Discharge Survey</option>
                    <option value="follow_up">Follow-up Survey</option>
                    <option value="general">General Satisfaction</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Target Audience *</label>
                  <select
                    value={surveyForm.targetAudience}
                    onChange={(e) => setSurveyForm({...surveyForm, targetAudience: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="all_patients">All Patients</option>
                    <option value="recent_visits">Recent Visits (7 days)</option>
                    <option value="inpatients">Current Inpatients</option>
                    <option value="outpatients">Outpatients</option>
                    <option value="specific_department">Specific Department</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Distribution Method *</label>
                  <select
                    value={surveyForm.distributionMethod}
                    onChange={(e) => setSurveyForm({...surveyForm, distributionMethod: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="portal">Patient Portal </option>
                    <option value="kiosk">In-hospital Kiosk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Scheduled Date</label>
                <input
                  type="datetime-local"
                  value={surveyForm.scheduledDate}
                  onChange={(e) => setSurveyForm({...surveyForm, scheduledDate: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Description</label>
                <textarea
                  value={surveyForm.description}
                  onChange={(e) => setSurveyForm({...surveyForm, description: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  placeholder="Survey objectives and instructions..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="border-t border-[#E8E3DC] pt-4 flex flex-wrap justify-end gap-2">
                <ButtonWithTooltip
                  type="button"
                  onClick={onClose}
                  tooltip="Cancel survey creation"
                  variant="secondary"
                  disabled={isSubmitting}
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  type="submit"
                  tooltip="Create and send survey"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Create & Send
                    </>
                  )}
                </ButtonWithTooltip>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPLAINT MODAL ====================
const ComplaintModal = ({ isOpen, onClose, complaintForm, setComplaintForm, onSubmit, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[#F7F5F2] w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-300">
          <div className="border-b border-[#E8E3DC] p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-display font-bold text-[#1A1A1A] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#C8553D]" />
                  Submit Complaint
                </h2>
                <p className="text-sm text-[#5A5A5A] mt-0.5">Log and track patient complaints</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#E8E3DC] rounded transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-[#5A5A5A]" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Patient Name *</label>
                <input
                  type="text"
                  value={complaintForm.patientName}
                  onChange={(e) => setComplaintForm({...complaintForm, patientName: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  placeholder="Enter patient name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Patient ID</label>
                <input
                  type="text"
                  value={complaintForm.patientId}
                  onChange={(e) => setComplaintForm({...complaintForm, patientId: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  placeholder="Enter patient ID (optional)"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Category *</label>
                <select
                  value={complaintForm.category}
                  onChange={(e) => setComplaintForm({...complaintForm, category: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select category...</option>
                  <option value="waiting_time">Waiting Time</option>
                  <option value="staff_behavior">Staff Behavior</option>
                  <option value="facility_cleanliness">Facility Cleanliness</option>
                  <option value="medical_care">Medical Care Quality</option>
                  <option value="billing">Billing Issues</option>
                  <option value="communication">Communication</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Priority *</label>
                  <select
                    value={complaintForm.priority}
                    onChange={(e) => setComplaintForm({...complaintForm, priority: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Department</label>
                  <select
                    value={complaintForm.department}
                    onChange={(e) => setComplaintForm({...complaintForm, department: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  >
                    <option value="">Select department...</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Outpatient">Outpatient</option>
                    <option value="Inpatient">Inpatient</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Description *</label>
                <textarea
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                  rows="4"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  placeholder="Please describe the issue in detail..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Preferred Contact Method</label>
                <select
                  value={complaintForm.contactMethod}
                  onChange={(e) => setComplaintForm({...complaintForm, contactMethod: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  disabled={isSubmitting}
                >
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>

              <div className="border-t border-[#E8E3DC] pt-4 flex flex-wrap justify-end gap-2">
                <ButtonWithTooltip
                  type="button"
                  onClick={onClose}
                  tooltip="Cancel complaint submission"
                  variant="secondary"
                  disabled={isSubmitting}
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  type="submit"
                  tooltip="Submit complaint"
                  variant="danger"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Submit Complaint
                    </>
                  )}
                </ButtonWithTooltip>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN PATIENT FEEDBACK COMPONENT ====================
const PatientFeedback = () => {
  const dispatch = useDispatch();
  const {
    surveys,
    feedback,
    complaints,
    improvementPlans,
    metrics,
    searchTerm,
    filterBy,
    loading
  } = useSelector(state => state.feedback);

  const [activeTab, setActiveTab] = useState('overview');
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [surveySubmitting, setSurveySubmitting] = useState(false);
  const [complaintSubmitting, setComplaintSubmitting] = useState(false);
  const itemsPerPage = 10;

  const [surveyForm, setSurveyForm] = useState({
    title: '',
    type: 'post_visit',
    questions: [],
    targetAudience: 'all_patients',
    distributionMethod: 'sms',
    scheduledDate: '',
    description: ''
  });

  const [complaintForm, setComplaintForm] = useState({
    patientId: '',
    patientName: '',
    category: '',
    priority: 'medium',
    description: '',
    department: '',
    contactMethod: 'phone'
  });

  // Nigerian healthcare satisfaction metrics
  const satisfactionMetrics = {
    overall: {
      nps: 45,
      pss: 4.2,
      responseRate: 68,
      trend: 'improving'
    },
    categories: {
      waitingTime: { score: 3.8, target: 4.0, responses: 1250 },
      staffCourtesy: { score: 4.5, target: 4.2, responses: 1180 },
      facilityCleanliness: { score: 4.1, target: 4.0, responses: 1150 },
      medicalCare: { score: 4.3, target: 4.5, responses: 1220 },
      billingTransparency: { score: 3.6, target: 4.0, responses: 980 },
      overallExperience: { score: 4.2, target: 4.3, responses: 1300 }
    },
    demographics: {
      ageGroups: {
        '18-30': { count: 450, satisfaction: 4.1 },
        '31-50': { count: 680, satisfaction: 4.3 },
        '51-70': { count: 520, satisfaction: 4.0 },
        '70+': { count: 280, satisfaction: 3.9 }
      },
      departments: {
        'Emergency': { count: 380, satisfaction: 3.8 },
        'Outpatient': { count: 650, satisfaction: 4.2 },
        'Inpatient': { count: 420, satisfaction: 4.1 },
        'Laboratory': { count: 290, satisfaction: 4.4 },
        'Pharmacy': { count: 190, satisfaction: 4.0 }
      }
    }
  };

  // Filter and search logic
  const filteredFeedback = feedback
    .filter(item => {
      const matchesSearch = !searchTerm ||
        item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.comments?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || item.satisfactionLevel === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const filteredComplaints = complaints
    .filter(item => {
      const matchesSearch = !searchTerm ||
        item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || item.status === filterBy || item.priority === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const paginatedItems = activeTab === 'feedback' ? filteredFeedback : filteredComplaints;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(paginatedItems.length / itemsPerPage);

  const handleCreateSurvey = async (e) => {
    e.preventDefault();
    setSurveySubmitting(true);
    try {
      await dispatch(createSurvey(surveyForm));
      setSurveyForm({
        title: '',
        type: 'post_visit',
        questions: [],
        targetAudience: 'all_patients',
        distributionMethod: 'sms',
        scheduledDate: '',
        description: ''
      });
      setShowSurveyModal(false);
    } finally {
      setSurveySubmitting(false);
    }
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    setComplaintSubmitting(true);
    try {
      await dispatch(createComplaint(complaintForm));
      setComplaintForm({
        patientId: '',
        patientName: '',
        category: '',
        priority: 'medium',
        description: '',
        department: '',
        contactMethod: 'phone'
      });
      setShowComplaintModal(false);
    } finally {
      setComplaintSubmitting(false);
    }
  };

  const handleResolveComplaint = (complaintId) => {
    dispatch(resolveComplaint({ complaintId }));
  };

  const handleEscalateComplaint = (complaintId) => {
    dispatch(escalateComplaint({ complaintId }));
  };

  const handleRefresh = () => {
    // Refresh data logic
  };

  const getSatisfactionColor = (score, scale = 5) => {
    const percentage = (score / scale) * 100;
    if (percentage >= 80) return 'text-[#2D7D46]';
    if (percentage >= 60) return 'text-[#008751]';
    if (percentage >= 40) return 'text-[#C87D3D]';
    return 'text-[#C8553D]';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      case 'high': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      case 'medium': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      case 'low': return 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]';
      default: return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]';
      case 'in_progress': return 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]';
      case 'escalated': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      case 'pending': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      case 'closed': return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
      default: return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-[#2D7D46]" />;
      case 'neutral': return <Meh className="w-4 h-4 text-[#C87D3D]" />;
      case 'negative': return <ThumbsDown className="w-4 h-4 text-[#C8553D]" />;
      default: return <MessageCircle className="w-4 h-4 text-[#5A5A5A]" />;
    }
  };

  const totalFeedback = feedback.length;
  const positiveFeedback = feedback.filter(f => f.sentiment === 'positive').length;
  const negativeFeedback = feedback.filter(f => f.sentiment === 'negative').length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending' || c.status === 'in_progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'surveys', label: 'Surveys', icon: FileText },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
    { id: 'improvement', label: 'Quality Plans', icon: Target }
  ];

  return (
    <div className="dashboard min-h-screen bg-[#F7F5F2] p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E8F5EF] rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight truncate">
                Patient Feedback & Quality
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A] truncate">
                Monitor patient experience and drive quality improvement
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap flex-shrink-0">
            <ButtonWithTooltip
              onClick={handleRefresh}
              tooltip="Refresh data"
              variant="secondary"
              className="text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowSurveyModal(true)}
              tooltip="Create new survey"
              variant="primary"
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New Survey</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <StatsCard
          title="Net Promoter Score"
          value={satisfactionMetrics.overall.nps}
          subValue="+5.2 pts improvement"
          icon={Award}
          color="green"
          trend="up"
          trendValue="+5.2 pts this month"
          tooltip="Patient loyalty and satisfaction score"
        />
        <StatsCard
          title="Patient Satisfaction"
          value={`${satisfactionMetrics.overall.pss}/5`}
          subValue="Above target"
          icon={Star}
          color="gold"
          trend="up"
          trendValue="0.3 pts above target"
          tooltip="Average patient satisfaction rating"
        />
        <StatsCard
          title="Pending Complaints"
          value={pendingComplaints}
          subValue={`${resolvedComplaints} resolved`}
          icon={AlertTriangle}
          color="terracotta"
          trend={pendingComplaints > 0 ? 'up' : 'neutral'}
          trendValue={pendingComplaints > 0 ? 'Requires attention' : 'All resolved'}
          tooltip="Complaints awaiting resolution"
        />
        <StatsCard
          title="Response Rate"
          value={`${satisfactionMetrics.overall.responseRate}%`}
          subValue="+8.3% growth"
          icon={BarChart3}
          color="purple"
          trend="up"
          trendValue="+8.3% this month"
          tooltip="Survey response rate"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E8E3DC] mb-3 sm:mb-6 lg:mb-8 overflow-x-auto bg-white">
        <nav className="flex gap-2 sm:gap-4 lg:gap-6 min-w-max px-4" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const counts = {
              feedback: feedback.length,
              complaints: complaints.filter(c => c.status === 'pending' || c.status === 'in_progress').length
            };
            return (
              <Tooltip key={tab.id} text={`View ${tab.label}`}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 sm:gap-2 px-1 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#008751] text-[#008751]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {tab.label}
                  {tab.id === 'complaints' && counts.complaints > 0 && (
                    <span className="w-4 h-4 sm:w-5 sm:h-5 bg-[#C8553D] text-white text-[10px] flex items-center justify-center rounded-full">
                      {counts.complaints}
                    </span>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-[#E8E3DC] p-3 sm:p-4 lg:p-6 xl:p-8">
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Satisfaction Scores by Category */}
              <div>
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Satisfaction by Category</h3>
                <div className="space-y-3">
                  {Object.entries(satisfactionMetrics.categories).map(([category, data]) => (
                    <div key={category} className="bg-[#F7F5F2] border border-[#E8E3DC] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-[#1A1A1A] capitalize">
                          {category.replace(/([A-Z])/g, ' $1')}
                        </h4>
                        <div className={`flex items-center ${getSatisfactionColor(data.score)}`}>
                          <Star className="w-4 h-4 mr-1 fill-current" />
                          <span className="font-display font-bold">{data.score}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[#5A5A5A]">
                        <span>Target: {data.target}/5</span>
                        <span>{data.responses} responses</span>
                      </div>
                      <div className="w-full bg-[#E8E3DC] rounded-full h-1.5 mt-2">
                        <div
                          className="bg-[#008751] h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(data.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demographic Analysis */}
              <div>
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Demographic Analysis</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-medium text-[#5A5A5A] uppercase tracking-wider mb-3">By Age Group</h4>
                    <div className="space-y-2">
                      {Object.entries(satisfactionMetrics.demographics.ageGroups).map(([ageGroup, data]) => (
                        <div key={ageGroup} className="flex items-center justify-between py-2 border-b border-[#F0EDE8]">
                          <span className="text-sm text-[#1A1A1A]">{ageGroup} years</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#5A5A5A]">({data.count})</span>
                            <div className={`flex items-center ${getSatisfactionColor(data.satisfaction)}`}>
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              <span className="text-sm font-medium">{data.satisfaction}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-[#5A5A5A] uppercase tracking-wider mb-3">By Department</h4>
                    <div className="space-y-2">
                      {Object.entries(satisfactionMetrics.demographics.departments).map(([department, data]) => (
                        <div key={department} className="flex items-center justify-between py-2 border-b border-[#F0EDE8]">
                          <span className="text-sm text-[#1A1A1A]">{department}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#5A5A5A]">({data.count})</span>
                            <div className={`flex items-center ${getSatisfactionColor(data.satisfaction)}`}>
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              <span className="text-sm font-medium">{data.satisfaction}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Sentiment Overview */}
            <div className="mt-6 lg:mt-8">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Feedback Sentiment Overview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                <div className="bg-[#EAF3EE] border border-[#D0E3D8] p-4 text-center">
                  <ThumbsUp className="w-8 h-8 text-[#2D7D46] mx-auto mb-2" />
                  <h4 className="text-sm font-medium text-[#2D7D46] mb-1">Positive Feedback</h4>
                  <p className="text-2xl font-display font-bold text-[#2D7D46]">{positiveFeedback}</p>
                  <p className="text-xs text-[#5A5A5A] mt-1">
                    {totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 0}% of total
                  </p>
                </div>

                <div className="bg-[#F5F0EA] border border-[#F0E8DC] p-4 text-center">
                  <Meh className="w-8 h-8 text-[#C87D3D] mx-auto mb-2" />
                  <h4 className="text-sm font-medium text-[#C87D3D] mb-1">Neutral Feedback</h4>
                  <p className="text-2xl font-display font-bold text-[#C87D3D]">
                    {totalFeedback - positiveFeedback - negativeFeedback}
                  </p>
                  <p className="text-xs text-[#5A5A5A] mt-1">
                    {totalFeedback > 0 ? Math.round(((totalFeedback - positiveFeedback - negativeFeedback) / totalFeedback) * 100) : 0}% of total
                  </p>
                </div>

                <div className="bg-[#F5EDEA] border border-[#E8D6D0] p-4 text-center">
                  <ThumbsDown className="w-8 h-8 text-[#C8553D] mx-auto mb-2" />
                  <h4 className="text-sm font-medium text-[#C8553D] mb-1">Negative Feedback</h4>
                  <p className="text-2xl font-display font-bold text-[#C8553D]">{negativeFeedback}</p>
                  <p className="text-xs text-[#5A5A5A] mt-1">
                    {totalFeedback > 0 ? Math.round((negativeFeedback / totalFeedback) * 100) : 0}% of total
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'surveys' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 lg:mb-5">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Survey Management</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <ButtonWithTooltip
                  onClick={() => setShowSurveyModal(true)}
                  tooltip="Create new survey"
                  variant="primary"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Survey
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={() => {}}
                  tooltip="Export survey results"
                  variant="secondary"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </ButtonWithTooltip>
              </div>
            </div>

            <div className="space-y-3">
              {surveys.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                  <p className="text-[#5A5A5A]">No surveys created yet</p>
                  <p className="text-sm text-[#B0A89E]">Create your first survey to gather patient feedback</p>
                </div>
              ) : (
                surveys.map(survey => (
                  <div key={survey.id} className="bg-[#F7F5F2] border border-[#E8E3DC] p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-[#1A1A1A]">{survey.title}</h4>
                        <p className="text-xs text-[#5A5A5A] capitalize">{survey.type.replace('_', ' ')} Survey</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getStatusColor(survey.status)}`}>
                          {survey.status}
                        </span>
                        <span className="text-xs text-[#5A5A5A]">
                          {survey.responses || 0} responses
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      <div>
                        <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Target Audience</p>
                        <p className="text-sm capitalize text-[#1A1A1A]">{survey.targetAudience.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Distribution</p>
                        <p className="text-sm capitalize text-[#1A1A1A]">{survey.distributionMethod}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Questions</p>
                        <p className="text-sm text-[#1A1A1A]">{survey.questions?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Created</p>
                        <p className="text-sm text-[#1A1A1A]">{new Date(survey.createdAt).toLocaleDateString('en-NG')}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E8E3DC]">
                      <ButtonWithTooltip
                        onClick={() => {}}
                        tooltip="View survey results"
                        variant="secondary"
                        size="sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Results
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        onClick={() => {}}
                        tooltip="Send survey to patients"
                        variant="primary"
                        size="sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send Survey
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        onClick={() => {}}
                        tooltip="Edit survey"
                        variant="warning"
                        size="sm"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </ButtonWithTooltip>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5A5A5A]" />
                  <input
                    type="text"
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchFeedback(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Filter by Sentiment</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterFeedback(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="all">All Feedback</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>

              <div className="flex items-end">
                <ButtonWithTooltip
                  onClick={() => {}}
                  tooltip="Export feedback report"
                  variant="secondary"
                  className="w-full"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Report
                </ButtonWithTooltip>
              </div>
            </div>

            {/* Feedback Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#E8E3DC]">
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Rating</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Sentiment</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Comments</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Department</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-[#5A5A5A]">
                        No feedback found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map(item => (
                      <tr key={item.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="py-3">
                          <span className="text-sm font-medium text-[#1A1A1A]">{item.patientName}</span>
                        </td>
                        <td className="py-3 hidden sm:table-cell">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < item.rating ? 'text-[#FFC107] fill-current' : 'text-[#D8D4CD]'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-xs text-[#5A5A5A]">({item.rating}/5)</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            {getSentimentIcon(item.sentiment)}
                            <span className="text-sm capitalize text-[#1A1A1A]">{item.sentiment}</span>
                          </div>
                        </td>
                        <td className="py-3 hidden md:table-cell">
                          <span className="text-sm text-[#5A5A5A] truncate block max-w-[200px]">{item.comments}</span>
                        </td>
                        <td className="py-3 hidden lg:table-cell">
                          <span className="text-sm text-[#5A5A5A]">{item.department}</span>
                        </td>
                        <td className="py-3">
                          <span className="text-sm text-[#5A5A5A] whitespace-nowrap">
                            {new Date(item.submittedAt).toLocaleDateString('en-NG')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5A5A5A]" />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchFeedback(e.target.value))}
                    className="w-full sm:w-48 pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterFeedback(e.target.value))}
                  className="px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>
              <ButtonWithTooltip
                onClick={() => setShowComplaintModal(true)}
                tooltip="Submit new complaint"
                variant="danger"
              >
                <Plus className="w-3.5 h-3.5" />
                New Complaint
              </ButtonWithTooltip>
            </div>

            {/* Complaints Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#E8E3DC]">
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Category</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Priority</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Description</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-[#5A5A5A]">
                        No complaints found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map(complaint => (
                      <tr key={complaint.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="py-3">
                          <span className="text-sm font-medium text-[#1A1A1A]">{complaint.patientName}</span>
                        </td>
                        <td className="py-3 hidden sm:table-cell">
                          <span className="text-sm text-[#5A5A5A] capitalize">{complaint.category.replace('_', ' ')}</span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                            {complaint.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 hidden md:table-cell">
                          <span className="text-sm text-[#5A5A5A] truncate block max-w-[180px]">{complaint.description}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            {complaint.status !== 'resolved' && (
                              <>
                                <ButtonWithTooltip
                                  onClick={() => handleResolveComplaint(complaint.id)}
                                  tooltip="Mark as resolved"
                                  variant="success"
                                  size="sm"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </ButtonWithTooltip>
                                <ButtonWithTooltip
                                  onClick={() => handleEscalateComplaint(complaint.id)}
                                  tooltip="Escalate complaint"
                                  variant="danger"
                                  size="sm"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                </ButtonWithTooltip>
                              </>
                            )}
                            <IconButton
                              icon={Eye}
                              onClick={() => {}}
                              tooltip="View details"
                              variant="default"
                              size="sm"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'improvement' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Quality Improvement Plans</h3>
              <ButtonWithTooltip
                onClick={() => {}}
                tooltip="Create new improvement plan"
                variant="primary"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Plan
              </ButtonWithTooltip>
            </div>

            {improvementPlans.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A]">No quality improvement plans created yet</p>
                <p className="text-sm text-[#B0A89E]">Create a plan to address feedback and improve patient care</p>
              </div>
            ) : (
              <div className="space-y-3">
                {improvementPlans.map(plan => (
                  <div key={plan.id} className="bg-[#F7F5F2] border border-[#E8E3DC] p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-[#1A1A1A]">{plan.title}</h4>
                        <p className="text-xs text-[#5A5A5A]">Based on: {plan.source}</p>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      <div>
                        <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Target Completion</p>
                        <p className="text-sm text-[#1A1A1A]">{new Date(plan.targetDate).toLocaleDateString('en-NG')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Responsible</p>
                        <p className="text-sm text-[#1A1A1A]">{plan.responsiblePerson}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Actions</p>
                        <p className="text-sm text-[#1A1A1A]">{plan.actions?.length || 0} defined</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider">Progress</p>
                        <p className="text-sm text-[#1A1A1A]">{plan.progress || 0}% complete</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-[10px] text-[#5A5A5A] uppercase font-medium tracking-wider mb-1">Objectives</p>
                      <p className="text-sm text-[#1A1A1A]">{plan.objectives}</p>
                    </div>

                    <div className="w-full bg-[#E8E3DC] rounded-full h-1.5 mb-3">
                      <div
                        className="bg-[#008751] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${plan.progress || 0}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E8E3DC]">
                      <ButtonWithTooltip
                        onClick={() => {}}
                        tooltip="Update progress"
                        variant="primary"
                        size="sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Update Progress
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        onClick={() => {}}
                        tooltip="View details"
                        variant="secondary"
                        size="sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        onClick={() => {}}
                        tooltip="Generate report"
                        variant="secondary"
                        size="sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Generate Report
                      </ButtonWithTooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'feedback' || activeTab === 'complaints') && paginatedItems.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#E8E3DC] gap-2 sm:gap-0">
          <div className="text-[10px] sm:text-xs text-[#5A5A5A] text-center sm:text-left">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, paginatedItems.length)} of {paginatedItems.length}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <IconButton
              icon={ChevronLeft}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              tooltip="Previous page"
              variant="default"
              disabled={currentPage === 1 || loading}
              size="sm"
            />
            <span className="text-[10px] sm:text-xs text-[#5A5A5A]">
              Page {currentPage} of {totalPages}
            </span>
            <IconButton
              icon={ChevronRight}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              tooltip="Next page"
              variant="default"
              disabled={currentPage === totalPages || loading}
              size="sm"
            />
          </div>
        </div>
      )}

      {/* Survey Modal */}
      <SurveyModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        surveyForm={surveyForm}
        setSurveyForm={setSurveyForm}
        onSubmit={handleCreateSurvey}
        isSubmitting={surveySubmitting}
      />

      {/* Complaint Modal */}
      <ComplaintModal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        complaintForm={complaintForm}
        setComplaintForm={setComplaintForm}
        onSubmit={handleCreateComplaint}
        isSubmitting={complaintSubmitting}
      />
    </div>
  );
};

export default PatientFeedback;