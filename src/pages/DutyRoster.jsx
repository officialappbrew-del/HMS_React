import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Menu,
  X,
  Search,
  Filter,
  User,
  Loader2,
  Check,
  X as XIcon,
  Edit,
  FileText,  // <-- Add this
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Bed,
  Heart,
  Stethoscope,
  Building2,
  Clipboard,
  Shield,
  Ambulance,
  Smartphone,
  Phone,
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Printer,
  Download,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  RotateCcw,
  Hospital,
  Upload,
  UserCircle,
  IdCard,
  Droplets,
  Baby,
  HeartPulse,
  Brain,
  Bone,
  MapPin,
  Globe,
  BookOpen,
  Award,
  Mail,
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
  BarChart3,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  MoreVertical,
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { apiRequest, parseListResponse } from '../utils/api';
import { addLeaveRequest, approveLeave, rejectLeave, addOvertimeRecord, addDutyRoster, removeDutyRoster, removeLeaveRequest, removeOvertimeRecord } from '../features/rosterSlice';
import { setStaffList, setLoading } from '../features/staffSlice.jsx';

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

// ==================== CONFIRMATION MODAL ====================
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', confirmColor = 'bg-[#C8553D]' }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[#F7F5F2] w-full max-w-md transform transition-all duration-200">
          <div className="border-b border-[#E8E3DC] p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-[#F5EDEA] flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#C8553D]" />
              </div>
              <div>
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">{title}</h3>
                <p className="text-xs text-[#5A5A5A] mt-0.5">{message}</p>
              </div>
            </div>
          </div>
          <div className="p-5 flex flex-wrap justify-end gap-2">
            <ButtonWithTooltip
              onClick={onClose}
              tooltip={cancelText}
              variant="secondary"
              size="sm"
            >
              {cancelText}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={onConfirm}
              tooltip={confirmText}
              variant="danger"
              size="sm"
            >
              {confirmText}
            </ButtonWithTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== STAFF SELECTOR ====================
const StaffSelector = ({ staff, value, onChange, placeholder = 'Search staff...', showLeaveBalance = false, getLeaveBalance }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!value) {
      setSearchQuery('');
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStaffName = (s) => s.name || s.full_name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Unknown';
  const getStaffId = (s) => s.staffId || s.employee_id || s.employeeId || String(s.id);
  const getStaffRole = (s) => s.role || s.category || 'Staff';
  const getStaffDept = (s) => s.department || s.department_name || '';

  const selectedName = value
    ? (staff.find(s => getStaffId(s) === String(value)) ? getStaffName(staff.find(s => getStaffId(s) === String(value))) : 'Unknown')
    : '';

  const displayValue = searchQuery || selectedName;

  const filteredStaff = staff.filter(member => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    const name = getStaffName(member).toLowerCase();
    const role = getStaffRole(member).toLowerCase();
    const id = getStaffId(member).toLowerCase();
    const dept = getStaffDept(member).toLowerCase();
    const email = (member.email || '').toLowerCase();
    return (
      name.includes(query) ||
      role.includes(query) ||
      id.includes(query) ||
      dept.includes(query) ||
      email.includes(query)
    );
  });

  const categoryColor = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes('doctor')) return 'bg-[#E8F5EF] text-[#008751]';
    if (c.includes('nurse')) return 'bg-[#EAF3EE] text-[#2D7D46]';
    if (c.includes('pharmacist')) return 'bg-[#F5F0EA] text-[#C87D3D]';
    if (c.includes('laboratory') || c.includes('lab')) return 'bg-[#F5EDEA] text-[#C8553D]';
    if (c.includes('radi')) return 'bg-[#E8F5EF] text-[#008751]';
    if (c.includes('admin')) return 'bg-[#F0EDE8] text-[#5A5A5A]';
    return 'bg-[#F0EDE8] text-[#5A5A5A]';
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
        />
        <Search className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B0A89E] pointer-events-none" />
      </div>
      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-[#E8E3DC]">
          {filteredStaff.length > 0 ? (
            filteredStaff.map(member => {
              const sid = getStaffId(member);
              return (
                <button
                  key={sid}
                  type="button"
                  onClick={() => {
                    onChange(sid, getStaffName(member));
                    setSearchQuery('');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-[#F7F5F2] border-b border-[#F0EDE8] last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-[#008751]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1A1A1A] text-sm truncate">{getStaffName(member)}</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className={`text-[10px] px-1.5 py-0.5 border ${categoryColor(getStaffRole(member))}`}>
                          {getStaffRole(member)}
                        </span>
                        {getStaffDept(member) && (
                          <>
                            <span className="text-[#D8D4CD]">•</span>
                            <span className="text-[10px] text-[#5A5A5A] truncate">{getStaffDept(member)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {showLeaveBalance && getLeaveBalance && (
                      <span className="text-[10px] text-[#5A5A5A] bg-[#F0EDE8] px-1.5 py-0.5 border border-[#E8E3DC]">
                        {getLeaveBalance(sid)}d
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <p className="px-3 py-2 text-xs text-[#B0A89E]">No staff found</p>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== MAIN DUTY ROSTER COMPONENT ====================
const DutyRoster = () => {
  const rosterState = useSelector(state => state.roster) || {};
  const dutyRosters = rosterState.dutyRosters || [];
  const leaves = rosterState.leaves || [];
  const overtime = rosterState.overtime || [];
  const staffState = useSelector(state => state.staff || {});
  const staff = staffState.staff || [];
  const staffLoading = staffState.loading || false;
  const dispatch = useDispatch();

  const getCurrentUserName = () => {
    if (typeof window === 'undefined') return '';
    return (
      localStorage.getItem('userFullName') ||
      localStorage.getItem('userName') ||
      `${localStorage.getItem('userFirstName') || ''} ${localStorage.getItem('userLastName') || ''}`.trim() ||
      ''
    );
  };

  const currentUserName = getCurrentUserName();

  const loadStaff = async () => {
    if (staff.length > 0) return;
    try {
      dispatch(setLoading(true));
      const data = await apiRequest('/api/v1/tenants/users/?page_size=200');
      const results = Array.isArray(data) ? data : (data.results || []);
      const normalized = results.map(member => ({
        id: member.id,
        employeeId: member.employee_id || '',
        name: member.full_name || `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unknown',
        email: member.email || '',
        phone: member.phone || '',
        role: member.role || member.role_name || 'Staff',
        department: member.department_name || member.department || '',
        designation: member.designation || '',
        status: member.employment_status || (member.is_active === false ? 'inactive' : 'active'),
        lastLogin: member.last_login || '',
      }));
      dispatch(setStaffList(normalized));
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadStaff();
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState('roster');
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);
  const [showAddOvertimeModal, setShowAddOvertimeModal] = useState(false);
  const [showCreateRosterModal, setShowCreateRosterModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingRoster, setIsCreatingRoster] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [onCallDate, setOnCallDate] = useState(new Date().toISOString().split('T')[0]);
  const [onCallData, setOnCallData] = useState(null);
  const [onCallLoading, setOnCallLoading] = useState(false);
  const [myRosters, setMyRosters] = useState([]);
  const [myRostersLoading, setMyRostersLoading] = useState(false);
  
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmColor: 'bg-[#C8553D]',
    onConfirm: null
  });
  
  const [approvingLeaveId, setApprovingLeaveId] = useState(null);
  const [rejectingLeaveId, setRejectingLeaveId] = useState(null);
  const [deletingLeaveId, setDeletingLeaveId] = useState(null);
  const [deletingOvertimeId, setDeletingOvertimeId] = useState(null);
  const [submittingLeave, setSubmittingLeave] = useState(false);
  const [submittingOvertime, setSubmittingOvertime] = useState(false);
  const [publishingRosterId, setPublishingRosterId] = useState(null);
  const [showRosterDetailModal, setShowRosterDetailModal] = useState(false);
  const [selectedRoster, setSelectedRoster] = useState(null);
  const [editingRoster, setEditingRoster] = useState({
    month: '',
    year: '',
    department: '',
    status: 'Draft',
    assignments: []
  });
  const [isUpdatingRoster, setIsUpdatingRoster] = useState(false);
  const [addingAssignment, setAddingAssignment] = useState(false);
  const [pendingAssignmentIds, setPendingAssignmentIds] = useState(new Set());
  const assignmentsTableRef = useRef(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [editingAssignmentForm, setEditingAssignmentForm] = useState({
    staffId: '',
    staffName: '',
    date: '',
    dutyType: '',
    startTime: '07:00',
    endTime: '19:00',
    notes: ''
  });

  const [leaveFormData, setLeaveFormData] = useState({
    staffId: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [overtimeFormData, setOvertimeFormData] = useState({
    staffId: '',
    date: '',
    hours: '',
    reason: ''
  });

  const [rosterFormData, setRosterFormData] = useState({
    month: '',
    year: '',
    department: '',
    assignments: []
  });

  const [assignmentFormData, setAssignmentFormData] = useState({
    staffId: '',
    staffName: '',
    date: '',
    dutyType: '',
    startTime: '07:00',
    endTime: '19:00',
    notes: ''
  });

  const [draggedStaff, setDraggedStaff] = useState(null);
  const [quickAssignDate, setQuickAssignDate] = useState(null);
  const [quickAssignData, setQuickAssignData] = useState({
    dutyType: 'Call Duty',
    startTime: '07:00',
    endTime: '19:00',
    notes: ''
  });

  const leaveTypes = ['Annual', 'Sick', 'Maternity', 'Paternity', 'Study', 'Compassionate', 'Conference'];
  const dutyTypes = ['Call Duty', 'Night Duty', 'Weekend', 'Emergency', 'Clinic'];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNumber = (name) => {
    const idx = monthNames.indexOf(name);
    return idx >= 0 ? idx + 1 : null;
  };

  const generateCalendarDays = (year, monthName) => {
    const month = monthNumber(monthName);
    if (!month || !year) return [];

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: '', day: '', isCurrentMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month - 1, d);
      days.push({
        date: `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        day: d,
        dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        isCurrentMonth: true
      });
    }
    while (days.length % 7 !== 0) {
      days.push({ date: '', day: '', isCurrentMonth: false });
    }
    return days;
  };

  const calendarDays = useMemo(() => {
    return generateCalendarDays(rosterFormData.year, rosterFormData.month);
  }, [rosterFormData.year, rosterFormData.month]);

  const handleStaffDragStart = (member) => {
    setDraggedStaff(member);
  };

  const handleDateDragOver = (e) => {
    e.preventDefault();
  };

  const handleDateDrop = (dateStr) => {
    if (!draggedStaff) return;
    setQuickAssignDate(dateStr);
    setQuickAssignData({
      dutyType: 'Call Duty',
      startTime: '07:00',
      endTime: '19:00',
      notes: ''
    });
  };

  const handleQuickAssign = () => {
    if (!draggedStaff || !quickAssignDate || !quickAssignData.dutyType) return;

    const staffMember = draggedStaff;
    const displayName = staffMember?.name ||
      staffMember?.full_name ||
      `${staffMember?.first_name || ''} ${staffMember?.last_name || ''}`.trim() || 'Unknown Staff';

    const newAssignment = {
      assignmentId: `ASSIGN${Date.now()}`,
      staffId: staffMember.staffId || staffMember.employeeId || staffMember.employee_id || String(staffMember.id),
      staffName: displayName,
      date: quickAssignDate,
      dutyType: quickAssignData.dutyType,
      startTime: quickAssignData.startTime || '',
      endTime: quickAssignData.endTime || '',
      notes: quickAssignData.notes || ''
    };

    setRosterFormData(prev => ({
      ...prev,
      assignments: [...prev.assignments, newAssignment]
    }));

    setDraggedStaff(null);
    setQuickAssignDate(null);
  };

  const rosterSummary = useMemo(() => ({
    published: dutyRosters.length,
    pendingLeaves: leaves.filter(l => l.status === 'Pending').length,
    overtimeHours: overtime.reduce((sum, r) => sum + (parseFloat(r.hoursWorked || r.hours || 0)), 0),
    approvedLeaves: leaves.filter(l => l.status === 'Approved').length
  }), [dutyRosters, leaves, overtime]);

  const loadRosterData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [rostersResponse, leavesResponse, overtimeResponse] = await Promise.all([
        apiRequest('/api/v1/ward-rounds/duty-rosters/'),
        apiRequest('/api/v1/ward-rounds/leave-requests/'),
        apiRequest('/api/v1/ward-rounds/overtime-records/')
      ]);

      const rosterItems = parseListResponse(rostersResponse).map(item => ({
        ...item,
        rosterId: item.rosterId || item.id,
        assignments: item.assignments || []
      }));
      
      const leaveItems = parseListResponse(leavesResponse).map(item => ({
        ...item,
        leaveId: item.leaveId || item.id,
        status: item.status || 'Pending'
      }));
      
      const overtimeItems = parseListResponse(overtimeResponse).map(item => ({
        ...item,
        overtimeId: item.overtimeId || item.id,
        status: item.approvalStatus || item.status || 'Pending'
      }));

      rosterItems.forEach(roster => dispatch(addDutyRoster(roster)));
      leaveItems.forEach(leave => dispatch(addLeaveRequest(leave)));
      overtimeItems.forEach(record => dispatch(addOvertimeRecord(record)));
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load roster data.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await apiRequest('/api/v1/tenants/departments/');
      const results = Array.isArray(data) ? data : (data.results || []);
      const normalized = results.map(dept => ({
        id: dept.id,
        name: dept.name || dept.department_name || 'Unnamed Department',
      }));
      setDepartments(normalized);
    } catch (error) {
      console.error('Failed to load departments:', error);
      setDepartments([]);
    }
  };

  useEffect(() => {
    loadDepartments();
    loadRosterData();
  }, [dispatch]);

  const loadOnCallData = async (date = onCallDate, department = null) => {
    setOnCallLoading(true);
    setErrorMessage('');
    try {
      const qs = new URLSearchParams();
      if (date) qs.append('date', date);
      if (department) qs.append('department', department);
      const response = await apiRequest(`/api/v1/ward-rounds/duty-rosters/on-call/?${qs.toString()}`);
      setOnCallData(response);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load on-call data.');
      setOnCallData(null);
    } finally {
      setOnCallLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'oncall') {
      loadOnCallData(onCallDate);
    }
  }, [activeTab, onCallDate]);

  const loadMyRosters = async () => {
    setMyRostersLoading(true);
    setErrorMessage('');
    try {
      const response = await apiRequest('/api/v1/ward-rounds/duty-rosters/my-rosters/');
      const results = Array.isArray(response?.results) ? response.results : (Array.isArray(response) ? response : []);
      setMyRosters(results);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load your rosters.');
      setMyRosters([]);
    } finally {
      setMyRostersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-rosters') {
      loadMyRosters();
    }
  }, [activeTab]);

  const getStaffName = (sid) => {
    if (!sid) return 'Unknown Staff';
    const member = staff.find(s => (s.staffId || s.employeeId || s.employee_id || String(s.id)) === String(sid));
    return member?.name || member?.full_name || `${member?.first_name || ''} ${member?.last_name || ''}`.trim() || 'Unknown Staff';
  };

  const getStaffById = (sid) => {
    if (!sid) return null;
    return staff.find(s => (s.staffId || s.employeeId || s.employee_id || String(s.id)) === String(sid));
  };

  const filteredLeaves = searchQuery 
    ? leaves.filter(leave => {
        const staffName = getStaffName(leave.staffId);
        return (
          staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (leave.leaveType && leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (leave.status && leave.status.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      })
    : leaves;

  const handleApproveLeave = async (leaveId) => {
    setApprovingLeaveId(leaveId);
    try {
      await apiRequest(`/api/v1/ward-rounds/leave-requests/${leaveId}/approve/`, { 
        method: 'POST', 
        body: JSON.stringify({ approvedBy: currentUserName || 'System' }) 
      });
      dispatch(approveLeave({ leaveId, approvedBy: currentUserName || 'System' }));
      setSuccessMessage('Leave request approved successfully.');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to approve leave.');
    } finally {
      setApprovingLeaveId(null);
    }
  };

  const handleRejectLeave = async (leaveId) => {
    setRejectingLeaveId(leaveId);
    try {
      await apiRequest(`/api/v1/ward-rounds/leave-requests/${leaveId}/reject/`, { 
        method: 'POST', 
        body: JSON.stringify({ approvedBy: currentUserName || 'System' }) 
      });
      dispatch(rejectLeave({ leaveId, approvedBy: currentUserName || 'System' }));
      setSuccessMessage('Leave request rejected.');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to reject leave.');
    } finally {
      setRejectingLeaveId(null);
    }
  };

  const getLeaveBalance = (staffId) => {
    const usedDays = leaves
      .filter(l => l.staffId === staffId && l.status === 'Approved' && l.leaveType === 'Annual')
      .reduce((sum, l) => {
        if (!l.startDate || !l.endDate) return sum;
        const start = new Date(l.startDate);
        const end = new Date(l.endDate);
        return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      }, 0);
    return Math.max(0, 21 - usedDays);
  };

  const isDuplicateLeave = (staffId, leaveType, startDate, endDate) => {
    return leaves.some(l => 
      l.staffId === staffId && 
      l.leaveType === leaveType && 
      l.startDate === startDate && 
      l.endDate === endDate
    );
  };

  const isDuplicateOvertime = (staffId, date) => {
    return overtime.some(o => o.staffId === staffId && o.date === date);
  };

  const isDuplicateAssignment = (assignments, staffId, date, dutyType) => {
    return assignments.some(a => 
      a.staffId === staffId && 
      a.date === date && 
      a.dutyType === dutyType
    );
  };

  const isDuplicateRoster = (month, year, department) => {
    return dutyRosters.some(r => 
      r.month === month && 
      r.year === parseInt(year) && 
      r.department === department
    );
  };

  const handleAddLeave = async () => {
    if (!leaveFormData.staffId || !leaveFormData.leaveType || !leaveFormData.startDate || !leaveFormData.endDate) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (isDuplicateLeave(leaveFormData.staffId, leaveFormData.leaveType, leaveFormData.startDate, leaveFormData.endDate)) {
      setErrorMessage('A leave request with the same type and dates already exists for this staff member.');
      return;
    }

    setSubmittingLeave(true);
    try {
      const matchedStaff = getStaffById(leaveFormData.staffId);
      const displayName = matchedStaff?.name ||
        matchedStaff?.full_name ||
        `${matchedStaff?.first_name || ''} ${matchedStaff?.last_name || ''}`.trim() || '';
      
      const payload = {
        staffId: leaveFormData.staffId,
        staffName: displayName,
        leaveType: leaveFormData.leaveType,
        startDate: (leaveFormData.startDate || '').trim() || null,
        endDate: (leaveFormData.endDate || '').trim() || null,
        reason: (leaveFormData.reason || '').trim() || null,
        status: 'Pending'
      };
      
      const response = await apiRequest('/api/v1/ward-rounds/leave-requests/', { 
        method: 'POST', 
        body: JSON.stringify(payload) 
      });
      
      dispatch(addLeaveRequest({ 
        ...response, 
        leaveId: response.leaveId || response.id 
      }));
      
      setShowAddLeaveModal(false);
      setLeaveFormData({ staffId: '', leaveType: '', startDate: '', endDate: '', reason: '' });
      setErrorMessage('');
      setSuccessMessage('Leave request submitted successfully.');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save leave request.');
    } finally {
      setSubmittingLeave(false);
    }
  };

  const handleAddOvertime = async () => {
    if (!overtimeFormData.staffId || !overtimeFormData.date || !overtimeFormData.hours) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (isDuplicateOvertime(overtimeFormData.staffId, overtimeFormData.date)) {
      setErrorMessage('An overtime record for this staff member on this date already exists.');
      return;
    }

    setSubmittingOvertime(true);
    try {
      const matchedStaff = getStaffById(overtimeFormData.staffId);
      const displayName = matchedStaff?.name ||
        matchedStaff?.full_name ||
        `${matchedStaff?.first_name || ''} ${matchedStaff?.last_name || ''}`.trim() || '';
      
      const payload = {
        staffId: overtimeFormData.staffId,
        staffName: displayName,
        date: (overtimeFormData.date || '').trim() || null,
        hoursWorked: overtimeFormData.hours,
        reason: (overtimeFormData.reason || '').trim() || null,
        status: 'Pending',
        rate: '1.5x'
      };
      
      const response = await apiRequest('/api/v1/ward-rounds/overtime-records/', { 
        method: 'POST', 
        body: JSON.stringify(payload) 
      });
      
      dispatch(addOvertimeRecord({ 
        ...response, 
        overtimeId: response.overtimeId || response.id, 
        status: response.approvalStatus || response.status || 'Pending' 
      }));
      
      setShowAddOvertimeModal(false);
      setOvertimeFormData({ staffId: '', date: '', hours: '', reason: '' });
      setErrorMessage('');
      setSuccessMessage('Overtime record added successfully.');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save overtime record.');
    } finally {
      setSubmittingOvertime(false);
    }
  };

  const handleDeleteRoster = (roster) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Roster',
      message: `Are you sure you want to delete the roster for ${roster.month} ${roster.year} - ${roster.department}? This action cannot be undone.`,
      confirmText: 'Delete Roster',
      confirmColor: 'bg-[#C8553D]',
      onConfirm: async () => {
        const rosterId = roster.rosterId || roster.id;
        try {
          await apiRequest(`/api/v1/ward-rounds/duty-rosters/${rosterId}/`, {
            method: 'DELETE'
          });
          dispatch(removeDutyRoster(rosterId));
          setSuccessMessage('Roster deleted successfully.');
        } catch (error) {
          setErrorMessage(error.message || 'Unable to delete roster.');
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  const handlePublishRoster = async (roster) => {
    const rosterId = roster.rosterId || roster.id;
    setPublishingRosterId(rosterId);
    try {
      await apiRequest(`/api/v1/ward-rounds/duty-rosters/${rosterId}/publish/`, { method: 'POST' });
      dispatch(addDutyRoster({ ...roster, status: 'Published' }));
      setSuccessMessage(`Roster for ${roster.month} ${roster.year} (${roster.department}) published successfully.`);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to publish roster.');
    } finally {
      setPublishingRosterId(null);
    }
  };

  const openRosterDetail = async (roster) => {
    setSelectedRoster(roster);
    setEditingRoster({
      month: roster.month || '',
      year: roster.year || '',
      department: roster.department || '',
      status: roster.status || 'Draft',
      assignments: roster.assignments || []
    });
    setEditingAssignmentId(null);
    setShowRosterDetailModal(true);
  };

  const closeRosterDetail = () => {
    setShowRosterDetailModal(false);
    setSelectedRoster(null);
    setEditingRoster({ month: '', year: '', department: '', status: 'Draft', assignments: [] });
    setEditingAssignmentId(null);
    setEditingAssignmentForm({
      staffId: '',
      staffName: '',
      date: '',
      dutyType: '',
      startTime: '07:00',
      endTime: '19:00',
      notes: ''
    });
  };

  const handleUpdateRoster = async () => {
    if (!selectedRoster) return;
    setIsUpdatingRoster(true);
    try {
      const rosterId = selectedRoster.rosterId || selectedRoster.id;
      const payload = {
        month: editingRoster.month,
        year: parseInt(editingRoster.year, 10),
        department: editingRoster.department,
        status: editingRoster.status,
        assignments: editingRoster.assignments.map(a => ({
          id: a.id || a.assignmentId,
          staffId: a.staffId,
          staffName: a.staffName,
          date: a.date,
          dutyType: a.dutyType,
          startTime: a.startTime || null,
          endTime: a.endTime || null,
          notes: a.notes || ''
        }))
      };
      const updated = await apiRequest(`/api/v1/ward-rounds/duty-rosters/${rosterId}/`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      dispatch(addDutyRoster(updated));
      setSuccessMessage('Roster updated successfully.');
      setSelectedRoster(updated);
      setEditingRoster({
        month: updated.month || '',
        year: updated.year || '',
        department: updated.department || '',
        status: updated.status || 'Draft',
        assignments: updated.assignments || []
      });
      setPendingAssignmentIds(new Set());
      setEditingAssignmentId(null);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to update roster.');
    } finally {
      setIsUpdatingRoster(false);
    }
  };

  const handleRemoveAssignment = (index) => {
    setEditingRoster(prev => ({
      ...prev,
      assignments: prev.assignments.filter((_, i) => i !== index)
    }));
  };

  const startEditAssignment = (assignment, index) => {
    setEditingAssignmentId(index);
    setEditingAssignmentForm({
      staffId: assignment.staffId || '',
      staffName: assignment.staffName || '',
      date: assignment.date || '',
      dutyType: assignment.dutyType || '',
      startTime: assignment.startTime || '07:00',
      endTime: assignment.endTime || '19:00',
      notes: assignment.notes || ''
    });
  };

  const saveEditAssignment = (index) => {
    setEditingRoster(prev => ({
      ...prev,
      assignments: prev.assignments.map((a, i) => i === index ? { ...a, ...editingAssignmentForm } : a)
    }));
    setEditingAssignmentId(null);
    setEditingAssignmentForm({
      staffId: '',
      staffName: '',
      date: '',
      dutyType: '',
      startTime: '07:00',
      endTime: '19:00',
      notes: ''
    });
  };

  const cancelEditAssignment = () => {
    setEditingAssignmentId(null);
    setEditingAssignmentForm({
      staffId: '',
      staffName: '',
      date: '',
      dutyType: '',
      startTime: '07:00',
      endTime: '19:00',
      notes: ''
    });
  };

  const handleAddAssignmentToRoster = () => {
    setAddingAssignment(true);
    try {
      if (!assignmentFormData.staffId || !assignmentFormData.date || !assignmentFormData.dutyType) {
        setErrorMessage('Please fill in staff, date, and duty type.');
        return;
      }
      const staffMember = getStaffById(assignmentFormData.staffId);
      const displayName = staffMember?.name ||
        staffMember?.full_name ||
        `${staffMember?.first_name || ''} ${staffMember?.last_name || ''}`.trim() || 'Unknown Staff';
      const newAssignmentId = `ASSIGN${Date.now()}`;
      const newAssignment = {
        assignmentId: newAssignmentId,
        staffId: assignmentFormData.staffId,
        staffName: displayName || assignmentFormData.staffName,
        date: assignmentFormData.date,
        dutyType: assignmentFormData.dutyType,
        startTime: assignmentFormData.startTime || '',
        endTime: assignmentFormData.endTime || '',
        notes: assignmentFormData.notes || ''
      };
      setPendingAssignmentIds(prev => new Set(prev).add(newAssignmentId));
      setEditingRoster(prev => ({
        ...prev,
        assignments: [...prev.assignments, newAssignment]
      }));
      if (selectedRoster) {
        setSelectedRoster(prev => ({
          ...prev,
          assignments: [...(prev.assignments || []), newAssignment]
        }));
      }
      setAssignmentFormData({
        staffId: '',
        staffName: '',
        date: '',
        dutyType: '',
        startTime: '',
        endTime: '',
        notes: ''
      });
      setErrorMessage('');
      setTimeout(() => {
        assignmentsTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    } finally {
      setAddingAssignment(false);
    }
  };

  const handleDeleteLeave = (leave) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Leave Request',
      message: `Are you sure you want to delete the leave request for ${getStaffName(leave.staffId)}? This action cannot be undone.`,
      confirmText: 'Delete Request',
      confirmColor: 'bg-[#C8553D]',
      onConfirm: async () => {
        const leaveId = leave.leaveId || leave.id;
        setDeletingLeaveId(leaveId);
        try {
          await apiRequest(`/api/v1/ward-rounds/leave-requests/${leaveId}/`, {
            method: 'DELETE'
          });
          dispatch(removeLeaveRequest(leaveId));
          setSuccessMessage('Leave request deleted.');
        } catch (error) {
          setErrorMessage(error.message || 'Unable to delete leave request.');
        } finally {
          setDeletingLeaveId(null);
          setConfirmModal({ ...confirmModal, isOpen: false });
        }
      }
    });
  };

  const handleDeleteOvertime = (overtimeRecord) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Overtime Record',
      message: `Are you sure you want to delete the overtime record for ${getStaffName(overtimeRecord.staffId)}? This action cannot be undone.`,
      confirmText: 'Delete Record',
      confirmColor: 'bg-[#C8553D]',
      onConfirm: async () => {
        const overtimeId = overtimeRecord.overtimeId || overtimeRecord.id;
        setDeletingOvertimeId(overtimeId);
        try {
          await apiRequest(`/api/v1/ward-rounds/overtime-records/${overtimeId}/`, {
            method: 'DELETE'
          });
          dispatch(removeOvertimeRecord(overtimeId));
          setSuccessMessage('Overtime record deleted.');
        } finally {
          setDeletingOvertimeId(null);
          setConfirmModal({ ...confirmModal, isOpen: false });
        }
      }
    });
  };

  const handleAddAssignment = () => {
    if (!assignmentFormData.staffId || !assignmentFormData.date || !assignmentFormData.dutyType) {
      setErrorMessage('Please fill in staff, date, and duty type.');
      return;
    }

    if (isDuplicateAssignment(
      rosterFormData.assignments, 
      assignmentFormData.staffId, 
      assignmentFormData.date, 
      assignmentFormData.dutyType
    )) {
      setErrorMessage('This assignment already exists for the staff member on this date with the same duty type.');
      return;
    }

    const staffMember = getStaffById(assignmentFormData.staffId);
    const displayName = staffMember?.name ||
      staffMember?.full_name ||
      `${staffMember?.first_name || ''} ${staffMember?.last_name || ''}`.trim() || 'Unknown Staff';
    
    const newAssignment = {
      assignmentId: `ASSIGN${Date.now()}`,
      staffId: assignmentFormData.staffId,
      staffName: displayName,
      date: assignmentFormData.date,
      dutyType: assignmentFormData.dutyType,
      startTime: assignmentFormData.startTime || '',
      endTime: assignmentFormData.endTime || '',
      notes: assignmentFormData.notes || ''
    };
    
    setRosterFormData(prev => ({
      ...prev,
      assignments: [...prev.assignments, newAssignment]
    }));
    
    setAssignmentFormData({
      staffId: '',
      staffName: '',
      date: '',
      dutyType: '',
      startTime: '',
      endTime: '',
      notes: ''
    });
    setErrorMessage('');
  };

  const removeAssignment = (index) => {
    setRosterFormData(prev => ({
      ...prev,
      assignments: prev.assignments.filter((_, i) => i !== index)
    }));
  };

  const handleCreateRoster = async () => {
    if (!rosterFormData.month || !rosterFormData.year || !rosterFormData.department) {
      setErrorMessage('Please fill in month, year, and department.');
      return;
    }

    if (isDuplicateRoster(rosterFormData.month, rosterFormData.year, rosterFormData.department)) {
      setErrorMessage('A roster for this month, year, and department already exists.');
      return;
    }

    try {
      setIsCreatingRoster(true);
      setErrorMessage('');
      const payload = {
        month: rosterFormData.month,
        year: parseInt(rosterFormData.year, 10),
        department: rosterFormData.department,
        status: 'Draft',
        assignments: rosterFormData.assignments.map(assignment => ({
          staffId: assignment.staffId,
          staffName: assignment.staffName,
          date: assignment.date,
          dutyType: assignment.dutyType,
          startTime: assignment.startTime || null,
          endTime: assignment.endTime || null,
          notes: assignment.notes || ''
        }))
      };
      
      const response = await apiRequest('/api/v1/ward-rounds/duty-rosters/', { 
        method: 'POST', 
        body: JSON.stringify(payload) 
      });
      
      dispatch(addDutyRoster({ 
        ...response, 
        rosterId: response.rosterId || response.id, 
        assignments: response.assignments || [] 
      }));
      
      setShowCreateRosterModal(false);
      setRosterFormData({ month: '', year: '', department: '', assignments: [] });
      setDraggedStaff(null);
      setQuickAssignDate(null);
      setQuickAssignData({ dutyType: 'Call Duty', startTime: '07:00', endTime: '19:00', notes: '' });
      setAssignmentFormData({ staffId: '', staffName: '', date: '', dutyType: '', startTime: '07:00', endTime: '19:00', notes: '' });
      setErrorMessage('');
      setSuccessMessage(`Duty roster for ${payload.month} ${payload.year} (${payload.department}) created successfully.`);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to create roster.');
    } finally {
      setIsCreatingRoster(false);
    }
  };

  const canCreateRoster =
    Boolean(rosterFormData.month) &&
    Boolean(rosterFormData.year) &&
    Boolean(rosterFormData.department);

  // Tabs configuration
  const tabs = [
    { id: 'roster', label: 'Rosters', icon: Calendar },
    { id: 'leaves', label: `Leave Requests (${leaves.length})`, icon: FileText },
    { id: 'overtime', label: `Overtime (${overtime.length})`, icon: Clock },
    { id: 'oncall', label: 'On-Call Coverage', icon: User },
    { id: 'my-rosters', label: 'My Rosters', icon: Users },
  ];

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusMap = {
      'Published': { label: 'Published', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
      'Draft': { label: 'Draft', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
      'Pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
      'Approved': { label: 'Approved', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
      'Rejected': { label: 'Rejected', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    };
    return statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };
  };

  const getDutyTypeBadge = (dutyType) => {
    const typeMap = {
      'Night Duty': 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]',
      'Emergency': 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
      'Weekend': 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]',
      'Clinic': 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      'Call Duty': 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]',
    };
    return typeMap[dutyType] || 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
  };

  return (
    <div className="duty-roster min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmColor={confirmModal.confirmColor}
      />

      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Duty Roster Management
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Create and manage staff duty schedules, leave, and overtime
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {activeTab === 'roster' && (
              <ButtonWithTooltip
                onClick={() => { setSuccessMessage(''); setShowCreateRosterModal(true); }}
                tooltip="Create a new duty roster"
                variant="primary"
                size="sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Create Roster</span>
                <span className="sm:hidden">Roster</span>
              </ButtonWithTooltip>
            )}
            {activeTab === 'leaves' && (
              <ButtonWithTooltip
                onClick={() => { setSuccessMessage(''); setShowAddLeaveModal(true); }}
                tooltip="Request leave"
                variant="primary"
                size="sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Request Leave</span>
                <span className="sm:hidden">Leave</span>
              </ButtonWithTooltip>
            )}
            {activeTab === 'overtime' && (
              <ButtonWithTooltip
                onClick={() => { setSuccessMessage(''); setShowAddOvertimeModal(true); }}
                tooltip="Record overtime"
                variant="primary"
                size="sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Record Overtime</span>
                <span className="sm:hidden">Overtime</span>
              </ButtonWithTooltip>
            )}
            <ButtonWithTooltip
              onClick={() => {
                loadRosterData();
                if (activeTab === 'my-rosters') loadMyRosters();
                if (activeTab === 'oncall') loadOnCallData(onCallDate);
              }}
              tooltip="Refresh data"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Published Rosters"
          value={rosterSummary.published}
          icon={Calendar}
          color="green"
          tooltip="Total published duty rosters"
        />
        <StatsCard
          title="Pending Leave Requests"
          value={rosterSummary.pendingLeaves}
          icon={AlertCircle}
          color="warm"
          tooltip="Leave requests awaiting approval"
        />
        <StatsCard
          title="Overtime Hours"
          value={rosterSummary.overtimeHours.toFixed(1)}
          icon={Clock}
          color="gold"
          tooltip="Total overtime hours recorded"
        />
        <StatsCard
          title="Approved Leaves"
          value={rosterSummary.approvedLeaves}
          icon={CheckCircle}
          color="green"
          tooltip="Approved leave requests"
        />
      </div>

      {/* Search Bar */}
      {activeTab === 'leaves' && (
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B0A89E]" />
            <input
              type="text"
              placeholder="Search leave requests by staff name, type, or status..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Error & Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D]">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-[#EAF3EE] border border-[#D0E3D8] text-sm text-[#2D7D46] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#2D7D46] flex-shrink-0" />
            {successMessage}
          </span>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-[#2D7D46] hover:text-[#1E5F33] p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="mb-4 p-3 bg-[#F7F5F2] border border-[#E8E3DC] text-sm text-[#5A5A5A] flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-[#008751] animate-spin" />
          Loading roster data...
        </div>
      )}

      {/* Mobile Menu Button */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 border border-[#D8D4CD] hover:bg-[#F7F5F2] transition-colors"
        >
          {showMobileMenu ? <X className="w-5 h-5 text-[#5A5A5A]" /> : <Menu className="w-5 h-5 text-[#5A5A5A]" />}
        </button>
        <span className="text-sm font-medium text-[#1A1A1A]">
          {tabs.find(t => t.id === activeTab)?.label || 'Rosters'}
        </span>
        <div className="w-10"></div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-[#1A1A1A] bg-opacity-60 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-[#F7F5F2] border-l border-[#E8E3DC] p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Menu</h2>
              <button onClick={() => setShowMobileMenu(false)} className="p-1 hover:bg-[#F0EDE8] rounded">
                <X className="w-5 h-5 text-[#5A5A5A]" />
              </button>
            </div>
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setShowMobileMenu(false); }}
                    className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-[#E8F5EF] text-[#008751] border-l-2 border-[#008751]'
                        : 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tabs - Desktop */}
      <div className="hidden md:flex border-b border-[#E8E3DC] mb-6 overflow-x-auto">
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

      {/* ==================== ROSTERS TAB ==================== */}
      {activeTab === 'roster' && (
        <div className="bg-white border border-[#E8E3DC]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E3DC]">
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Roster</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Assignments</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {dutyRosters.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <Calendar className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                      <p className="text-[#5A5A5A] font-medium">No rosters published yet</p>
                      <p className="text-xs text-[#B0A89E] mt-1">Create a new roster to get started</p>
                    </td>
                  </tr>
                ) : (
                  dutyRosters.map(roster => {
                    const status = getStatusBadge(roster.status);
                    return (
                      <tr key={roster.rosterId} className="hover:bg-[#F7F5F2] transition-colors cursor-pointer" onClick={() => openRosterDetail(roster)}>
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-[#1A1A1A] text-sm">{roster.month || 'Unnamed'}</p>
                            <p className="text-xs text-[#5A5A5A]">Year: {roster.year || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">{roster.department || 'No Department'}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">{roster.assignments?.length || 0}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {roster.status !== 'Published' && (
                              <IconButton
                                icon={CheckCircle}
                                onClick={() => handlePublishRoster(roster)}
                                tooltip="Publish Roster"
                                variant="success"
                                size="sm"
                                disabled={publishingRosterId === (roster.rosterId || roster.id)}
                              />
                            )}
                            <IconButton
                              icon={Trash2}
                              onClick={() => handleDeleteRoster(roster)}
                              tooltip="Delete Roster"
                              variant="danger"
                              size="sm"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== ROSTER DETAIL MODAL ==================== */}
      {showRosterDetailModal && selectedRoster && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={closeRosterDetail}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-3xl max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">Roster Details</h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">{selectedRoster.month} {selectedRoster.year} · {selectedRoster.department}</p>
                  </div>
                  <button onClick={closeRosterDetail} className="p-1 hover:bg-[#F0EDE8] rounded transition-colors">
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Month</label>
                    <select
                      value={editingRoster.month}
                      onChange={(e) => setEditingRoster(prev => ({ ...prev, month: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    >
                      {monthNames.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Year</label>
                    <input
                      type="number"
                      value={editingRoster.year}
                      onChange={(e) => setEditingRoster(prev => ({ ...prev, year: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Department</label>
                    <select
                      value={editingRoster.department}
                      onChange={(e) => setEditingRoster(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id ?? dept.name} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Status</label>
                    <select
                      value={editingRoster.status}
                      onChange={(e) => setEditingRoster(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-[#E8E3DC] pt-4">
                  <h4 className="text-xs font-medium text-[#5A5A5A] uppercase tracking-wider mb-3">
                    Assignments ({editingRoster.assignments.length})
                  </h4>
                  {editingRoster.assignments.length === 0 ? (
                    <p className="text-sm text-[#B0A89E] text-center py-4">No assignments yet.</p>
                  ) : (
                    <div className="overflow-x-auto" ref={assignmentsTableRef}>
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#E8E3DC]">
                            <th className="px-2 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Staff</th>
                            <th className="px-2 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date</th>
                            <th className="px-2 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Duty</th>
                            <th className="px-2 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Time</th>
                            <th className="px-2 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Notes</th>
                            <th className="px-2 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0EDE8]">
                          {editingRoster.assignments.map((assignment, idx) => {
                            const isPending = pendingAssignmentIds.has(assignment.assignmentId);
                            const isEditing = editingAssignmentId === idx;
                            return (
                              <tr key={assignment.assignmentId || idx} className={`${isPending ? 'bg-[#F5F0EA]' : ''} ${isEditing ? 'bg-[#E8F5EF]' : ''}`}>
                                <td className="px-2 py-2 text-sm text-[#1A1A1A]">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={editingAssignmentForm.staffName}
                                      onChange={(e) => setEditingAssignmentForm(prev => ({ ...prev, staffName: e.target.value }))}
                                      className="w-full px-2 py-1 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none"
                                      placeholder="Staff name"
                                    />
                                  ) : (
                                    <>
                                      {assignment.staffName || 'Unknown'}
                                      {isPending && <span className="ml-1 inline-block px-1 py-0.5 bg-[#C87D3D] text-white text-[10px] font-medium">New</span>}
                                    </>
                                  )}
                                </td>
                                <td className="px-2 py-2 text-sm text-[#5A5A5A] whitespace-nowrap">
                                  {isEditing ? (
                                    <input
                                      type="date"
                                      value={editingAssignmentForm.date}
                                      onChange={(e) => setEditingAssignmentForm(prev => ({ ...prev, date: e.target.value }))}
                                      className="w-full px-2 py-1 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none"
                                    />
                                  ) : (
                                    assignment.date ? new Date(assignment.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) : 'N/A'
                                  )}
                                </td>
                                <td className="px-2 py-2">
                                  {isEditing ? (
                                    <select
                                      value={editingAssignmentForm.dutyType}
                                      onChange={(e) => setEditingAssignmentForm(prev => ({ ...prev, dutyType: e.target.value }))}
                                      className="w-full px-2 py-1 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none"
                                    >
                                      <option value="">Select</option>
                                      {dutyTypes.map(dt => (
                                        <option key={dt} value={dt}>{dt}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium border ${getDutyTypeBadge(assignment.dutyType)}`}>
                                      {assignment.dutyType || 'N/A'}
                                    </span>
                                  )}
                                </td>
                                <td className="px-2 py-2 text-sm text-[#5A5A5A] whitespace-nowrap">
                                  {isEditing ? (
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="time"
                                        value={editingAssignmentForm.startTime}
                                        onChange={(e) => setEditingAssignmentForm(prev => ({ ...prev, startTime: e.target.value }))}
                                        className="w-full px-1.5 py-1 text-xs border border-[#D8D4CD] focus:border-[#008751] focus:outline-none"
                                      />
                                      <span className="text-[#5A5A5A]">–</span>
                                      <input
                                        type="time"
                                        value={editingAssignmentForm.endTime}
                                        onChange={(e) => setEditingAssignmentForm(prev => ({ ...prev, endTime: e.target.value }))}
                                        className="w-full px-1.5 py-1 text-xs border border-[#D8D4CD] focus:border-[#008751] focus:outline-none"
                                      />
                                    </div>
                                  ) : (
                                    `${assignment.startTime || '--:--'} – ${assignment.endTime || '--:--'}`
                                  )}
                                </td>
                                <td className="px-2 py-2 text-sm text-[#B0A89E]">
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      value={editingAssignmentForm.notes}
                                      onChange={(e) => setEditingAssignmentForm(prev => ({ ...prev, notes: e.target.value }))}
                                      className="w-full px-2 py-1 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none"
                                      placeholder="Notes"
                                    />
                                  ) : (
                                    <span className="truncate max-w-[100px]">{assignment.notes || '-'}</span>
                                  )}
                                </td>
                                <td className="px-2 py-2">
                                  <div className="flex items-center gap-1">
                                    {isEditing ? (
                                      <>
                                        <IconButton
                                          icon={Check}
                                          onClick={() => saveEditAssignment(idx)}
                                          tooltip="Save"
                                          variant="success"
                                          size="sm"
                                        />
                                        <IconButton
                                          icon={XIcon}
                                          onClick={cancelEditAssignment}
                                          tooltip="Cancel"
                                          variant="secondary"
                                          size="sm"
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <IconButton
                                          icon={Edit}
                                          onClick={() => startEditAssignment(assignment, idx)}
                                          tooltip="Edit assignment"
                                          variant="info"
                                          size="sm"
                                        />
                                        <IconButton
                                          icon={Trash2}
                                          onClick={() => handleRemoveAssignment(idx)}
                                          tooltip="Remove assignment"
                                          variant="danger"
                                          size="sm"
                                        />
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#E8E3DC] pt-4 mt-4">
                  <h4 className="text-xs font-medium text-[#5A5A5A] uppercase tracking-wider mb-3">Add Assignment</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-1">Staff</label>
                      <StaffSelector
                        staff={staff}
                        value={assignmentFormData.staffId}
                        onChange={(sid, sname) => setAssignmentFormData(prev => ({ ...prev, staffId: sid, staffName: sname }))}
                        placeholder="Search staff..."
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-1">Date</label>
                      <input
                        type="date"
                        value={assignmentFormData.date}
                        onChange={(e) => setAssignmentFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-1">Duty Type</label>
                      <select
                        value={assignmentFormData.dutyType}
                        onChange={(e) => setAssignmentFormData(prev => ({ ...prev, dutyType: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      >
                        <option value="">Select duty type</option>
                        {dutyTypes.map(dt => (
                          <option key={dt} value={dt}>{dt}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-1">Start Time</label>
                      <input
                        type="time"
                        value={assignmentFormData.startTime}
                        onChange={(e) => setAssignmentFormData(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-1">End Time</label>
                      <input
                        type="time"
                        value={assignmentFormData.endTime}
                        onChange={(e) => setAssignmentFormData(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-1">Notes</label>
                      <input
                        type="text"
                        value={assignmentFormData.notes}
                        onChange={(e) => setAssignmentFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Optional notes"
                        className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <ButtonWithTooltip
                      onClick={handleAddAssignmentToRoster}
                      tooltip="Add assignment"
                      variant="primary"
                      size="sm"
                      disabled={addingAssignment}
                    >
                      {addingAssignment ? 'Adding...' : 'Add Assignment'}
                    </ButtonWithTooltip>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E8E3DC] p-4 flex flex-wrap justify-end gap-2 bg-white">
                <ButtonWithTooltip
                  onClick={closeRosterDetail}
                  tooltip="Close"
                  variant="secondary"
                  size="sm"
                >
                  <X className="w-3.5 h-3.5" />
                  Close
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={handleUpdateRoster}
                  tooltip="Save changes"
                  variant="primary"
                  size="sm"
                  disabled={isUpdatingRoster}
                >
                  <Check className="w-3.5 h-3.5" />
                  {isUpdatingRoster ? 'Saving...' : 'Save Changes'}
                </ButtonWithTooltip>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== LEAVES TAB ==================== */}
      {activeTab === 'leaves' && (
        <div className="bg-white border border-[#E8E3DC]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E3DC]">
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Staff</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Leave Type</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Start Date</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">End Date</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Days</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <FileText className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                      <p className="text-[#5A5A5A] font-medium">No leave requests</p>
                      {searchQuery && <p className="text-xs text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map(leave => {
                    const leaveId = leave.leaveId || leave.id;
                    const isPending = leave.status === 'Pending';
                    const days = leave.startDate && leave.endDate 
                      ? Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1
                      : 'N/A';
                    const status = getStatusBadge(leave.status);
                    
                    return (
                      <tr key={leaveId} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-medium text-sm text-[#1A1A1A]">{getStaffName(leave.staffId)}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">{leave.leaveType || 'Unknown'}</td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">
                          {leave.startDate ? new Date(leave.startDate).toLocaleDateString('en-NG') : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">
                          {leave.endDate ? new Date(leave.endDate).toLocaleDateString('en-NG') : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-[#1A1A1A]">{days}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {isPending ? (
                              <>
                                <IconButton
                                  icon={Check}
                                  onClick={() => handleApproveLeave(leaveId)}
                                  tooltip="Approve Leave"
                                  variant="success"
                                  size="sm"
                                  disabled={approvingLeaveId === leaveId}
                                />
                                <IconButton
                                  icon={XIcon}
                                  onClick={() => handleRejectLeave(leaveId)}
                                  tooltip="Reject Leave"
                                  variant="danger"
                                  size="sm"
                                  disabled={rejectingLeaveId === leaveId}
                                />
                              </>
                            ) : (
                              <span className="text-xs text-[#B0A89E] px-2">Processed</span>
                            )}
                            <IconButton
                              icon={Trash2}
                              onClick={() => handleDeleteLeave(leave)}
                              tooltip="Delete Request"
                              variant="danger"
                              size="sm"
                              disabled={deletingLeaveId === leaveId}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== OVERTIME TAB ==================== */}
      {activeTab === 'overtime' && (
        <div className="bg-white border border-[#E8E3DC]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E3DC]">
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Staff</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Hours</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Pay Rate</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {overtime.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <Clock className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                      <p className="text-[#5A5A5A] font-medium">No overtime records</p>
                    </td>
                  </tr>
                ) : (
                  overtime.map(record => {
                    const overtimeId = record.overtimeId || record.id;
                    const status = getStatusBadge(record.approvalStatus || record.status || 'Pending');
                    
                    return (
                      <tr key={overtimeId} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-medium text-sm text-[#1A1A1A]">{getStaffName(record.staffId)}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">
                          {record.date ? new Date(record.date).toLocaleDateString('en-NG') : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-[#1A1A1A]">
                          {record.hoursWorked || record.hours || 0} hrs
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">1.5x</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <IconButton
                            icon={Trash2}
                            onClick={() => handleDeleteOvertime(record)}
                            tooltip="Delete Record"
                            variant="danger"
                            size="sm"
                            disabled={deletingOvertimeId === overtimeId}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== ON-CALL TAB ==================== */}
      {activeTab === 'oncall' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Select Date</label>
              <input
                type="date"
                value={onCallDate}
                onChange={(e) => setOnCallDate(e.target.value)}
                className="px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <ButtonWithTooltip
              onClick={() => loadOnCallData(onCallDate)}
              tooltip="Refresh on-call data"
              variant="primary"
              size="sm"
              disabled={onCallLoading}
            >
              {onCallLoading ? 'Loading...' : 'Refresh'}
            </ButtonWithTooltip>
          </div>

          {onCallLoading && (
            <div className="bg-white border border-[#E8E3DC] p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-[#5A5A5A]">
                <Loader2 className="w-4 h-4 text-[#008751] animate-spin" />
                Loading on-call coverage...
              </div>
            </div>
          )}

          {!onCallLoading && onCallData && (
            <>
              <div className="bg-white border border-[#E8E3DC]">
                <div className="border-b border-[#E8E3DC] px-5 py-3">
                  <h3 className="text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#008751]" />
                    Who Is Covering the ER Tonight
                    <span className="text-xs font-normal text-[#5A5A5A] ml-2">({onCallData.date})</span>
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E8E3DC]">
                        <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Staff</th>
                        <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Duty Type</th>
                        <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Time</th>
                        <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EDE8]">
                      {onCallData.on_call_staff.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-[#5A5A5A]">
                            <User className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
                            <p className="text-sm">No on-call staff scheduled for this date</p>
                          </td>
                        </tr>
                      ) : (
                        onCallData.on_call_staff.map((staff, idx) => {
                          const staffDetails = getStaffById(staff.staffId);
                          const displayName = staff.staffName ||
                            (staffDetails?.name || staffDetails?.full_name ||
                              `${staffDetails?.first_name || ''} ${staffDetails?.last_name || ''}`.trim() ||
                              'Unknown Staff');
                          const role = staff.role || staffDetails?.category || staffDetails?.role || staffDetails?.staff_category || '';
                          const isEmergency = staff.dutyType &&
                            ['Emergency', 'Emergency Cover', 'er', 'ER'].includes(staff.dutyType);
                          
                          return (
                            <tr key={staff.id || idx} className={`hover:bg-[#F7F5F2] ${isEmergency ? 'bg-[#F5EDEA]' : ''}`}>
                              <td className="px-4 py-4">
                                <p className="font-medium text-sm text-[#1A1A1A]">{displayName}</p>
                              </td>
                              <td className="px-4 py-4 text-sm text-[#5A5A5A]">{role || '-'}</td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${isEmergency ? 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' : 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]'}`}>
                                  {staff.dutyType || 'On Call'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-[#5A5A5A]">
                                {staff.startTime || '--:--'} – {staff.endTime || '--:--'}
                              </td>
                              <td className="px-4 py-4 text-sm text-[#5A5A5A]">{staff.department || '-'}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {onCallData.all_shifts.length > 0 && (
                <div className="bg-white border border-[#E8E3DC]">
                  <div className="border-b border-[#E8E3DC] px-5 py-3">
                    <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">All Shifts for {onCallData.date}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#E8E3DC]">
                          <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Staff</th>
                          <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Department</th>
                          <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Duty Type</th>
                          <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Time</th>
                          <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EDE8]">
                        {onCallData.all_shifts.map((shift, idx) => (
                          <tr key={shift.id || idx} className="hover:bg-[#F7F5F2] transition-colors">
                            <td className="px-4 py-4">
                              <p className="font-medium text-sm text-[#1A1A1A]">
                                {shift.staffName || getStaffName(shift.staffId) || 'Unknown Staff'}
                              </p>
                            </td>
                            <td className="px-4 py-4 text-sm text-[#5A5A5A]">{shift.department || '-'}</td>
                            <td className="px-4 py-4">
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getDutyTypeBadge(shift.dutyType)}`}>
                                {shift.dutyType || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-[#5A5A5A]">
                              {shift.startTime || '--'} – {shift.endTime || '--'}
                            </td>
                            <td className="px-4 py-4 text-sm text-[#B0A89E] truncate max-w-xs">
                              {shift.notes || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

          {!onCallLoading && !onCallData && !errorMessage && (
            <div className="bg-white border border-[#E8E3DC] p-8 text-center">
              <p className="text-[#5A5A5A]">Select a date and click Refresh to view on-call coverage.</p>
            </div>
          )}
        </div>
      )}

      {/* ==================== MY ROSTERS TAB ==================== */}
      {activeTab === 'my-rosters' && (
        <div className="bg-white border border-[#E8E3DC]">
          <div className="border-b border-[#E8E3DC] px-5 py-3 flex items-center justify-between">
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">My Duty Rosters</h3>
            <ButtonWithTooltip
              onClick={loadMyRosters}
              tooltip="Refresh my rosters"
              variant="secondary"
              size="sm"
              disabled={myRostersLoading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${myRostersLoading ? 'animate-spin' : ''}`} />
              Refresh
            </ButtonWithTooltip>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E3DC]">
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Roster</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Duty Type</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {myRosters.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <Calendar className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                      <p className="text-[#5A5A5A] font-medium">No rosters assigned to you yet</p>
                      <p className="text-xs text-[#B0A89E] mt-1">You will see your duty roster assignments here when a roster is published.</p>
                    </td>
                  </tr>
                ) : (
                  myRosters.flatMap(roster => 
                    (roster.assignments || []).map((assignment, idx) => ({
                      ...assignment,
                      rosterMonth: roster.month,
                      rosterYear: roster.year,
                      rosterDepartment: roster.department,
                      rosterStatus: roster.status,
                      rosterId: roster.rosterId,
                      uniqueKey: `${roster.rosterId || roster.id}-${assignment.assignmentId || assignment.id}-${idx}`,
                    }))
                  ).map((item) => {
                    const status = getStatusBadge(item.rosterStatus);
                    return (
                      <tr key={item.uniqueKey} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-sm text-[#1A1A1A]">{item.rosterMonth || 'Unnamed'}</p>
                            <p className="text-xs text-[#5A5A5A]">Year: {item.rosterYear || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">{item.rosterDepartment || 'No Department'}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">
                          {item.date ? new Date(item.date).toLocaleDateString('en-NG') : 'N/A'}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getDutyTypeBadge(item.dutyType)}`}>
                            {item.dutyType || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">
                          {item.startTime || '--:--'} – {item.endTime || '--:--'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#B0A89E] truncate max-w-xs">
                          {item.notes || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== ADD LEAVE MODAL ==================== */}
      <GenericModal
        isOpen={showAddLeaveModal}
        onClose={() => {
          setShowAddLeaveModal(false);
          setLeaveFormData({ staffId: '', leaveType: '', startDate: '', endDate: '', reason: '' });
          setErrorMessage('');
        }}
        title="Request Leave"
        size="lg"
      >
        <div className="space-y-4">
          <StaffSelector
            staff={staff}
            value={leaveFormData.staffId}
            onChange={(sid) => setLeaveFormData({ ...leaveFormData, staffId: sid })}
            placeholder="Select staff member"
            showLeaveBalance={true}
            getLeaveBalance={getLeaveBalance}
          />

          <select
            value={leaveFormData.leaveType}
            onChange={(e) => setLeaveFormData({ ...leaveFormData, leaveType: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Start Date</label>
              <input
                type="date"
                value={leaveFormData.startDate}
                onChange={(e) => setLeaveFormData({ ...leaveFormData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">End Date</label>
              <input
                type="date"
                value={leaveFormData.endDate}
                onChange={(e) => setLeaveFormData({ ...leaveFormData, endDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Reason for leave</label>
            <textarea
              placeholder="Enter reason for leave"
              value={leaveFormData.reason}
              onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>
          
          {errorMessage && (
            <div className="text-sm text-[#C8553D]">{errorMessage}</div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              onClick={handleAddLeave}
              tooltip="Submit leave request"
              variant="primary"
              disabled={submittingLeave}
              className="flex-1"
            >
              {submittingLeave ? 'Submitting...' : 'Request Leave'}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setShowAddLeaveModal(false);
                setLeaveFormData({ staffId: '', leaveType: '', startDate: '', endDate: '', reason: '' });
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

      {/* ==================== ADD OVERTIME MODAL ==================== */}
      <GenericModal
        isOpen={showAddOvertimeModal}
        onClose={() => {
          setShowAddOvertimeModal(false);
          setOvertimeFormData({ staffId: '', date: '', hours: '', reason: '' });
          setErrorMessage('');
        }}
        title="Record Overtime"
        size="lg"
      >
        <div className="space-y-4">
          <StaffSelector
            staff={staff}
            value={overtimeFormData.staffId}
            onChange={(sid) => setOvertimeFormData({ ...overtimeFormData, staffId: sid })}
            placeholder="Select staff member"
          />

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Date</label>
            <input
              type="date"
              value={overtimeFormData.date}
              onChange={(e) => setOvertimeFormData({ ...overtimeFormData, date: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Hours worked</label>
            <input
              type="number"
              placeholder="Enter hours"
              value={overtimeFormData.hours}
              onChange={(e) => setOvertimeFormData({ ...overtimeFormData, hours: e.target.value })}
              min="0.5"
              step="0.5"
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Reason for overtime</label>
            <textarea
              placeholder="Enter reason for overtime"
              value={overtimeFormData.reason}
              onChange={(e) => setOvertimeFormData({ ...overtimeFormData, reason: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>
          
          {errorMessage && (
            <div className="text-sm text-[#C8553D]">{errorMessage}</div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              onClick={handleAddOvertime}
              tooltip="Record overtime"
              variant="primary"
              disabled={submittingOvertime}
              className="flex-1"
            >
              {submittingOvertime ? 'Submitting...' : 'Record Overtime'}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setShowAddOvertimeModal(false);
                setOvertimeFormData({ staffId: '', date: '', hours: '', reason: '' });
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

      {/* ==================== CREATE ROSTER MODAL ==================== */}
      <GenericModal
        isOpen={showCreateRosterModal}
        onClose={() => {
          setShowCreateRosterModal(false);
          setRosterFormData({ month: '', year: '', department: '', assignments: [] });
          setDraggedStaff(null);
          setQuickAssignDate(null);
          setQuickAssignData({ dutyType: 'Call Duty', startTime: '07:00', endTime: '19:00', notes: '' });
          setAssignmentFormData({ staffId: '', staffName: '', date: '', dutyType: '', startTime: '07:00', endTime: '19:00', notes: '' });
          setErrorMessage('');
        }}
        title="Create Duty Roster"
        size="2xl"
      >
        <div className="space-y-6">
          {/* Roster Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Month</label>
              <select
                value={rosterFormData.month}
                onChange={(e) => setRosterFormData(prev => ({ ...prev, month: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              >
                <option value="">Select Month</option>
                {monthNames.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Year</label>
              <input
                type="number"
                value={rosterFormData.year}
                onChange={(e) => setRosterFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="2026"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Department</label>
              <select
                value={rosterFormData.department}
                onChange={(e) => setRosterFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id ?? dept.name} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Drag & Drop Calendar */}
          {rosterFormData.month && rosterFormData.year && (
            <div className="border-t border-[#E8E3DC] pt-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-3">Drag & Drop Assignments</h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Staff List */}
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-2">Staff Members</label>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {staff.length === 0 ? (
                      <div className="text-center py-4 text-[#5A5A5A] text-sm">
                        {staffLoading ? 'Loading staff...' : 'No staff available'}
                      </div>
                    ) : (
                      staff.map(member => {
                        const displayName = member.name || member.full_name || 'Unknown';
                        const role = member.role || member.category || 'Staff';
                        const categoryColor = 
                          role.toLowerCase().includes('doctor') ? 'bg-[#E8F5EF] text-[#008751]' :
                          role.toLowerCase().includes('nurse') ? 'bg-[#EAF3EE] text-[#2D7D46]' :
                          role.toLowerCase().includes('pharmacist') ? 'bg-[#F5F0EA] text-[#C87D3D]' :
                          role.toLowerCase().includes('lab') || role.toLowerCase().includes('laboratory') ? 'bg-[#F5EDEA] text-[#C8553D]' :
                          'bg-[#F0EDE8] text-[#5A5A5A]';
                        return (
                          <div
                            key={member.staffId || member.id}
                            draggable
                            onDragStart={() => handleStaffDragStart(member)}
                            className="p-3 bg-white border border-[#E8E3DC] cursor-grab active:cursor-grabbing hover:border-[#008751] hover:bg-[#F7F5F2] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-[#008751]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-[#1A1A1A] text-sm truncate">{displayName}</p>
                                <span className={`inline-block text-[10px] px-1.5 py-0.5 border ${categoryColor}`}>
                                  {role}
                                </span>
                                {member.department && (
                                  <p className="text-[10px] text-[#B0A89E] truncate">{member.department}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="lg:col-span-2">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-2">
                    {rosterFormData.month} {rosterFormData.year} Calendar
                  </label>
                  <div className="bg-white border border-[#E8E3DC] overflow-hidden">
                    <div className="grid grid-cols-7 gap-px bg-[#E8E3DC] text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                        <div key={d} className="bg-[#F7F5F2] px-2 py-1.5 text-center">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-[#E8E3DC]">
                      {calendarDays.map((day, idx) => {
                        const dayAssignments = day.isCurrentMonth
                          ? rosterFormData.assignments.filter(a => a.date === day.date)
                          : [];
                        return (
                          <div
                            key={idx}
                            onDragOver={day.isCurrentMonth ? handleDateDragOver : undefined}
                            onDrop={day.isCurrentMonth ? () => handleDateDrop(day.date) : undefined}
                            className={`min-h-[60px] p-1 transition-colors ${
                              day.isCurrentMonth
                                ? (dayAssignments.length > 0 ? 'bg-[#E8F5EF]' : 'bg-white hover:bg-[#F7F5F2]')
                                : 'bg-[#F7F5F2]'
                            }`}
                          >
                            {day.day && (
                              <span className={`text-xs font-medium ${
                                day.isCurrentMonth ? 'text-[#1A1A1A]' : 'text-[#B0A89E]'
                              }`}>
                                {day.day}
                              </span>
                            )}
                            {dayAssignments.length > 0 && (
                              <div className="mt-1 space-y-0.5">
                                {dayAssignments.slice(0, 2).map((a, i) => (
                                  <div key={i} className="text-[10px] bg-[#008751] text-white px-1 py-0.5 truncate">
                                    {(a.staffName || 'Unknown').split(' ').slice(-1)[0]}
                                  </div>
                                ))}
                                {dayAssignments.length > 2 && (
                                  <div className="text-[10px] text-[#5A5A5A]">+{dayAssignments.length - 2} more</div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Assignment Modal */}
              {draggedStaff && quickAssignDate && (
                <div className="fixed inset-0 z-50 bg-[#1A1A1A] bg-opacity-60 flex items-center justify-center">
                  <div className="bg-[#F7F5F2] w-full max-w-md p-5">
                    <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">
                      Assign {draggedStaff.name || 'Unknown'} to {quickAssignDate}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Duty Type</label>
                        <select
                          value={quickAssignData.dutyType}
                          onChange={(e) => setQuickAssignData(prev => ({ ...prev, dutyType: e.target.value }))}
                          className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        >
                          {dutyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Start Time</label>
                          <input
                            type="time"
                            value={quickAssignData.startTime}
                            onChange={(e) => setQuickAssignData(prev => ({ ...prev, startTime: e.target.value }))}
                            className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">End Time</label>
                          <input
                            type="time"
                            value={quickAssignData.endTime}
                            onChange={(e) => setQuickAssignData(prev => ({ ...prev, endTime: e.target.value }))}
                            className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Notes</label>
                        <textarea
                          value={quickAssignData.notes}
                          onChange={(e) => setQuickAssignData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Additional notes..."
                          rows={2}
                          className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-[#E8E3DC]">
                      <ButtonWithTooltip
                        onClick={() => { setDraggedStaff(null); setQuickAssignDate(null); }}
                        tooltip="Cancel"
                        variant="secondary"
                        className="flex-1"
                      >
                        Cancel
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        onClick={handleQuickAssign}
                        tooltip="Assign staff"
                        variant="primary"
                        className="flex-1"
                      >
                        Assign
                      </ButtonWithTooltip>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Traditional Form */}
          {(!rosterFormData.month || !rosterFormData.year) && (
            <div className="border-t border-[#E8E3DC] pt-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-3">Add Duty Assignments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Staff Member</label>
                  <StaffSelector
                    staff={staff}
                    value={assignmentFormData.staffId}
                    onChange={(sid, sname) => {
                      const member = staff.find(s => (s.staffId || s.employeeId || s.employee_id || String(s.id)) === String(sid));
                      setAssignmentFormData(prev => ({
                        ...prev,
                        staffId: sid,
                        staffName: sname || member?.name || member?.full_name || 'Unknown Staff'
                      }));
                    }}
                    placeholder="Search staff by name, role, department..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="date"
                    value={assignmentFormData.date}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Duty Type</label>
                  <select
                    value={assignmentFormData.dutyType}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, dutyType: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  >
                    <option value="">Select Duty Type</option>
                    {dutyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Start Time</label>
                  <input
                    type="time"
                    value={assignmentFormData.startTime}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">End Time</label>
                  <input
                    type="time"
                    value={assignmentFormData.endTime}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <ButtonWithTooltip
                    onClick={handleAddAssignment}
                    tooltip="Add assignment"
                    variant="primary"
                    className="w-full"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Assignment
                  </ButtonWithTooltip>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Notes</label>
                <textarea
                  value={assignmentFormData.notes}
                  onChange={(e) => setAssignmentFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes for this assignment"
                  rows={2}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Assignments List */}
          {rosterFormData.assignments.length > 0 && (
            <div className="border-t border-[#E8E3DC] pt-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-3">
                Current Assignments ({rosterFormData.assignments.length})
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {rosterFormData.assignments.map((assignment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-[#F7F5F2] border border-[#E8E3DC]">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#1A1A1A]">{assignment.staffName || 'Unknown Staff'}</p>
                      <div className="flex items-center gap-2 text-xs text-[#5A5A5A] mt-0.5 flex-wrap">
                        <span className="inline-block px-1.5 py-0.5 bg-[#F0EDE8] text-[#5A5A5A] border border-[#E8E3DC] text-[10px]">
                          {assignment.date}
                        </span>
                        <span className={`inline-block px-1.5 py-0.5 text-[10px] font-medium border ${getDutyTypeBadge(assignment.dutyType)}`}>
                          {assignment.dutyType}
                        </span>
                        <span className="text-[10px]">
                          {assignment.startTime || '--:--'} – {assignment.endTime || '--:--'}
                        </span>
                      </div>
                      {assignment.notes && (
                        <p className="text-[10px] text-[#B0A89E] mt-0.5 truncate">{assignment.notes}</p>
                      )}
                    </div>
                    <IconButton
                      icon={Trash2}
                      onClick={() => removeAssignment(index)}
                      tooltip="Remove Assignment"
                      variant="danger"
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="text-sm text-[#C8553D]">{errorMessage}</div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              onClick={() => {
                setShowCreateRosterModal(false);
                setRosterFormData({ month: '', year: '', department: '', assignments: [] });
                setDraggedStaff(null);
                setQuickAssignDate(null);
                setQuickAssignData({ dutyType: 'Call Duty', startTime: '', endTime: '', notes: '' });
                setAssignmentFormData({ staffId: '', staffName: '', date: '', dutyType: '', startTime: '', endTime: '', notes: '' });
                setErrorMessage('');
              }}
              tooltip="Cancel"
              variant="secondary"
            >
              Cancel
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleCreateRoster}
              tooltip="Create roster"
              variant="primary"
              disabled={!canCreateRoster || isCreatingRoster}
            >
              {isCreatingRoster ? 'Creating...' : 'Create Roster'}
            </ButtonWithTooltip>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default DutyRoster;