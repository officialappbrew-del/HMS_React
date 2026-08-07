import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit,
  Menu,
  X,
  Search,
  Filter,
  User,
  Loader2,
  Check,
  X as XIcon,
  Info
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { apiRequest, parseListResponse } from '../utils/api';
import { addLeaveRequest, approveLeave, rejectLeave, addOvertimeRecord, approveOvertime, rejectOvertime, addDutyRoster, addDutyAssignment, removeDutyRoster, removeLeaveRequest, removeOvertimeRecord } from '../features/rosterSlice';
import { setStaffList, setLoading } from '../features/staffSlice.jsx';

// Tooltip component
const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);
  
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="inline-flex"
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2">
          {text}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', confirmColor = 'bg-red-500' }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const StaffSelector = ({ staff, value, onChange, placeholder = 'Search staff...', showLeaveBalance = false, getLeaveBalance }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

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
    if (c.includes('doctor')) return 'bg-blue-100 text-blue-800';
    if (c.includes('nurse')) return 'bg-green-100 text-green-800';
    if (c.includes('pharmacist')) return 'bg-purple-100 text-purple-800';
    if (c.includes('laboratory') || c.includes('lab')) return 'bg-orange-100 text-orange-800';
    if (c.includes('radi')) return 'bg-teal-100 text-teal-800';
    if (c.includes('admin')) return 'bg-indigo-100 text-indigo-800';
    return 'bg-gray-100 text-gray-800';
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
          className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent text-sm md:text-base bg-white cursor-text"
        />
        <Search className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl">
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
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-nigerian-green bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-nigerian-green" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{getStaffName(member)}</p>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${categoryColor(getStaffRole(member))}`}>
                          {getStaffRole(member)}
                        </span>
                        {getStaffDept(member) && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500 truncate">{getStaffDept(member)}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {showLeaveBalance && getLeaveBalance && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {getLeaveBalance(sid)}d
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <p className="px-3 py-2 text-xs text-gray-500">No staff found</p>
          )}
        </div>
      )}
    </div>
  );
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingRoster, setIsCreatingRoster] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [onCallDate, setOnCallDate] = useState(new Date().toISOString().split('T')[0]);
  const [onCallData, setOnCallData] = useState(null);
  const [onCallLoading, setOnCallLoading] = useState(false);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmColor: 'bg-red-500',
    onConfirm: null
  });
  
  // Loading states for buttons
  const [approvingLeaveId, setApprovingLeaveId] = useState(null);
  const [rejectingLeaveId, setRejectingLeaveId] = useState(null);
  const [deletingLeaveId, setDeletingLeaveId] = useState(null);
  const [deletingOvertimeId, setDeletingOvertimeId] = useState(null);
  const [submittingLeave, setSubmittingLeave] = useState(false);
  const [submittingOvertime, setSubmittingOvertime] = useState(false);

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
    startTime: '',
    endTime: '',
    notes: ''
  });

  const [draggedStaff, setDraggedStaff] = useState(null);
  const [quickAssignDate, setQuickAssignDate] = useState(null);
  const [quickAssignData, setQuickAssignData] = useState({
    dutyType: 'Call Duty',
    startTime: '',
    endTime: '',
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
      startTime: '',
      endTime: '',
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
    overtimeHours: overtime.reduce((sum, r) => sum + (parseFloat(r.hoursWorked || r.hours || 0)), 0)
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

  useEffect(() => {
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
      confirmColor: 'bg-red-500',
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

  const handleDeleteLeave = (leave) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Leave Request',
      message: `Are you sure you want to delete the leave request for ${getStaffName(leave.staffId)}? This action cannot be undone.`,
      confirmText: 'Delete Request',
      confirmColor: 'bg-red-500',
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
      confirmColor: 'bg-red-500',
      onConfirm: async () => {
        const overtimeId = overtimeRecord.overtimeId || overtimeRecord.id;
        setDeletingOvertimeId(overtimeId);
        try {
          await apiRequest(`/api/v1/ward-rounds/overtime-records/${overtimeId}/`, {
            method: 'DELETE'
          });
          dispatch(removeOvertimeRecord(overtimeId));
          setSuccessMessage('Overtime record deleted.');
        } catch (error) {
          setErrorMessage(error.message || 'Unable to delete overtime record.');
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
      setQuickAssignData({ dutyType: 'Call Duty', startTime: '', endTime: '', notes: '' });
      setAssignmentFormData({ staffId: '', staffName: '', date: '', dutyType: '', startTime: '', endTime: '', notes: '' });
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

  return (
    <div className="duty-roster px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-gray-50 min-h-screen">
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

      {/* Mobile Menu Button */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-lg bg-white shadow-md"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="text-lg font-bold text-gray-800">Duty Roster</div>
        <div className="w-10"></div>
      </div>

      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mr-2 sm:mr-3 text-nigerian-green flex-shrink-0" />
            <span className="truncate">Duty Roster Management</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Create and manage staff duty schedules, leave, and overtime
          </p>
        </div>
        
        {/* Search Bar - Mobile */}
        <div className="md:hidden w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leave requests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          {activeTab === 'roster' && (
            <button
              onClick={() => { setSuccessMessage(''); setShowCreateRosterModal(true); }}
              className="flex-1 md:flex-none px-4 py-2.5 md:px-6 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium inline-flex items-center justify-center text-sm md:text-base transition-colors duration-200"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">Create Roster</span>
                <span className="sm:hidden">Roster</span>
              </span>
            </button>
          )}
          {activeTab === 'leaves' && (
            <button
              onClick={() => { setSuccessMessage(''); setShowAddLeaveModal(true); }}
              className="flex-1 md:flex-none px-4 py-2.5 md:px-6 md:py-3 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center text-sm md:text-base transition-colors duration-200"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">Request Leave</span>
                <span className="sm:hidden">Leave</span>
              </span>
            </button>
          )}
          {activeTab === 'overtime' && (
            <button
              onClick={() => { setSuccessMessage(''); setShowAddOvertimeModal(true); }}
              className="flex-1 md:flex-none px-4 py-2.5 md:px-6 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium inline-flex items-center justify-center text-sm md:text-base transition-colors duration-200"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">Record Overtime</span>
                <span className="sm:hidden">Overtime</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar - Desktop */}
      {activeTab === 'leaves' && (
        <div className="hidden md:block mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leave requests by staff name, type, or status..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-nigerian-green">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-nigerian-green mr-2 md:mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-600 text-xs sm:text-sm truncate">Published Rosters</p>
              <p className="text-nigerian-green font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                {rosterSummary.published}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-500 mr-2 md:mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-600 text-xs sm:text-sm truncate">Pending Leaves</p>
              <p className="text-blue-500 font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                {rosterSummary.pendingLeaves}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-orange-500 mr-2 md:mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-600 text-xs sm:text-sm truncate">Overtime Hours</p>
              <p className="text-orange-500 font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                {rosterSummary.overtimeHours.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-green-500 mr-2 md:mr-3 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-600 text-xs sm:text-sm truncate">Approved Leaves</p>
              <p className="text-green-500 font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                {leaves.filter(l => l.status === 'Approved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { setActiveTab('roster'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'roster' ? 'bg-nigerian-green/10 text-nigerian-green' : 'text-gray-700'
                }`}
              >
                Rosters
              </button>
              <button
                onClick={() => { setActiveTab('leaves'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'leaves' ? 'bg-nigerian-green/10 text-nigerian-green' : 'text-gray-700'
                }`}
              >
                Leave Requests ({leaves.length})
              </button>
              <button
                onClick={() => { setActiveTab('overtime'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'overtime' ? 'bg-nigerian-green/10 text-nigerian-green' : 'text-gray-700'
                }`}
              >
                Overtime ({overtime.length})
              </button>
              <button
                onClick={() => { setActiveTab('oncall'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'oncall' ? 'bg-nigerian-green/10 text-nigerian-green' : 'text-gray-700'
                }`}
              >
                On-Call Coverage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs - Desktop */}
      <div className="hidden md:flex gap-2 lg:gap-4 mb-4 lg:mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'roster'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Rosters
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'leaves'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Leave Requests ({leaves.length})
        </button>
        <button
          onClick={() => setActiveTab('overtime')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'overtime'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Overtime ({overtime.length})
        </button>
        <button
          onClick={() => setActiveTab('oncall')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'oncall'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          On-Call Coverage
        </button>
      </div>

      {/* Mobile Tab Indicator */}
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
          <span className="font-medium text-gray-700 text-sm">
            {activeTab === 'roster' && 'Rosters'}
            {activeTab === 'leaves' && `Leave Requests (${filteredLeaves.length})`}
            {activeTab === 'overtime' && `Overtime (${overtime.length})`}
          </span>
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="p-1 rounded-md bg-gray-100"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Error, Success and Loading Messages */}
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            {successMessage}
          </span>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-green-700 hover:text-green-900 p-0.5 rounded hover:bg-green-100 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isLoading && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          Loading roster data…
        </div>
      )}

      {/* Rosters Tab - Table View */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roster</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dutyRosters.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="font-medium">No rosters published yet</p>
                    </td>
                  </tr>
                ) : (
                  dutyRosters.map(roster => (
                    <tr key={roster.rosterId} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{roster.month || 'Unnamed'}</p>
                          <p className="text-sm text-gray-500">Year: {roster.year || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{roster.department || 'No Department'}</td>
                      <td className="px-4 py-4">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {roster.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{roster.assignments?.length || 0}</td>
                      <td className="px-4 py-4">
                        <Tooltip text="Delete Roster">
                          <button
                            onClick={() => handleDeleteRoster(roster)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leaves Tab - Table View */}
      {activeTab === 'leaves' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="font-medium">No leave requests</p>
                      {searchQuery && <p className="text-sm mt-1">No results for "{searchQuery}"</p>}
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map(leave => {
                    const leaveId = leave.leaveId || leave.id;
                    const isPending = leave.status === 'Pending';
                    const days = leave.startDate && leave.endDate 
                      ? Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1
                      : 'N/A';
                    
                    return (
                      <tr key={leaveId} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <p className="font-medium text-sm text-gray-900">{getStaffName(leave.staffId)}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{leave.leaveType || 'Unknown'}</td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {leave.startDate ? new Date(leave.startDate).toLocaleDateString('en-NG') : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {leave.endDate ? new Date(leave.endDate).toLocaleDateString('en-NG') : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700">{days}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {leave.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {isPending ? (
                              <>
                                <Tooltip text="Approve Leave">
                                  <button
                                    onClick={() => handleApproveLeave(leaveId)}
                                    disabled={approvingLeaveId === leaveId}
                                    className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {approvingLeaveId === leaveId ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <Check className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </Tooltip>
                                <Tooltip text="Reject Leave">
                                  <button
                                    onClick={() => handleRejectLeave(leaveId)}
                                    disabled={rejectingLeaveId === leaveId}
                                    className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    {rejectingLeaveId === leaveId ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <XIcon className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </Tooltip>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400 italic mr-1">Processed</span>
                            )}
                            <Tooltip text="Delete Request">
                              <button
                                onClick={() => handleDeleteLeave(leave)}
                                disabled={deletingLeaveId === leaveId}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deletingLeaveId === leaveId ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </Tooltip>
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

      {/* Overtime Tab - Table View */}
      {activeTab === 'overtime' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {overtime.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      <Clock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="font-medium">No overtime records</p>
                    </td>
                  </tr>
                ) : (
                  overtime.map(record => {
                    const overtimeId = record.overtimeId || record.id;
                    
                    return (
                      <tr key={overtimeId} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <p className="font-medium text-sm text-gray-900">{getStaffName(record.staffId)}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {record.date ? new Date(record.date).toLocaleDateString('en-NG') : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700">
                          {record.hoursWorked || record.hours || 0} hrs
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">1.5x</td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            record.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.approvalStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Tooltip text="Delete Record">
                            <button
                              onClick={() => handleDeleteOvertime(record)}
                              disabled={deletingOvertimeId === overtimeId}
                              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingOvertimeId === overtimeId ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </Tooltip>
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

      {/* On-Call Coverage Tab */}
      {activeTab === 'oncall' && (
        <div className="space-y-4 md:space-y-6">
          {/* Date Picker */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="w-full sm:w-auto">
              <label className="block text-xs md:text-sm text-gray-600 mb-1">Select Date</label>
              <input
                type="date"
                value={onCallDate}
                onChange={(e) => setOnCallDate(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent text-sm"
              />
            </div>
            <button
              onClick={() => loadOnCallData(onCallDate)}
              disabled={onCallLoading}
              className="w-full sm:w-auto px-4 py-2 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {onCallLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {onCallLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {onCallLoading && (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md border border-gray-200 p-4 md:p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading on-call coverage...
              </div>
            </div>
          )}

          {!onCallLoading && onCallData && (
            <>
              {/* On-Call Staff - Table View */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-red-500" />
                    Who Is Covering the ER Tonight
                    <span className="text-sm font-normal text-gray-500 ml-2">({onCallData.date})</span>
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duty Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {onCallData.on_call_staff.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                            <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="font-medium">No on-call staff scheduled for this date</p>
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
                            <tr key={staff.id || idx} className={`hover:bg-gray-50 ${isEmergency ? 'bg-red-50' : ''}`}>
                              <td className="px-4 py-4">
                                <p className="font-medium text-sm text-gray-900">{displayName}</p>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600">{role || '-'}</td>
                              <td className="px-4 py-4">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                                  isEmergency ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {staff.dutyType || 'On Call'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600">
                                {staff.startTime || '--:--'} – {staff.endTime || '--:--'}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600">{staff.department || '-'}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* All Shifts - Table View */}
              {onCallData.all_shifts.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">All Shifts for {onCallData.date}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duty Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {onCallData.all_shifts.map((shift, idx) => (
                          <tr key={shift.id || idx} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <p className="font-medium text-sm text-gray-900">
                                {shift.staffName || getStaffName(shift.staffId) || 'Unknown Staff'}
                              </p>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">{shift.department || '-'}</td>
                            <td className="px-4 py-4">
                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                {shift.dutyType || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {shift.startTime || '--'} – {shift.endTime || '--'}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-xs">
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
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">Select a date and click Refresh to view on-call coverage.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Leave Modal */}
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
        <div className="space-y-3 md:space-y-4">
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
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={leaveFormData.startDate}
                onChange={(e) => setLeaveFormData({ ...leaveFormData, startDate: e.target.value })}
                className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={leaveFormData.endDate}
                onChange={(e) => setLeaveFormData({ ...leaveFormData, endDate: e.target.value })}
                className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs md:text-sm text-gray-600 mb-1">Reason for leave</label>
            <textarea
              placeholder="Enter reason for leave"
              value={leaveFormData.reason}
              onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
            />
          </div>
          
          {errorMessage && (
            <div className="text-red-600 text-sm">{errorMessage}</div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleAddLeave}
              disabled={submittingLeave}
              className="w-full sm:flex-1 bg-nigerian-green text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-green-700 font-medium text-sm md:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submittingLeave && <Loader2 className="w-4 h-4 animate-spin" />}
              {submittingLeave ? 'Submitting...' : 'Request Leave'}
            </button>
            <button
              onClick={() => {
                setShowAddLeaveModal(false);
                setLeaveFormData({ staffId: '', leaveType: '', startDate: '', endDate: '', reason: '' });
                setErrorMessage('');
              }}
              className="w-full sm:flex-1 bg-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-400 font-medium text-sm md:text-base transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      {/* Add Overtime Modal */}
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
        <div className="space-y-3 md:space-y-4">
          <StaffSelector
            staff={staff}
            value={overtimeFormData.staffId}
            onChange={(sid) => setOvertimeFormData({ ...overtimeFormData, staffId: sid })}
            placeholder="Select staff member"
          />

          <div>
            <label className="block text-xs md:text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={overtimeFormData.date}
              onChange={(e) => setOvertimeFormData({ ...overtimeFormData, date: e.target.value })}
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
            />
          </div>
          
          <div>
            <label className="block text-xs md:text-sm text-gray-600 mb-1">Hours worked</label>
            <input
              type="number"
              placeholder="Enter hours"
              value={overtimeFormData.hours}
              onChange={(e) => setOvertimeFormData({ ...overtimeFormData, hours: e.target.value })}
              min="0.5"
              step="0.5"
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
            />
          </div>
          
          <div>
            <label className="block text-xs md:text-sm text-gray-600 mb-1">Reason for overtime</label>
            <textarea
              placeholder="Enter reason for overtime"
              value={overtimeFormData.reason}
              onChange={(e) => setOvertimeFormData({ ...overtimeFormData, reason: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
            />
          </div>
          
          {errorMessage && (
            <div className="text-red-600 text-sm">{errorMessage}</div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleAddOvertime}
              disabled={submittingOvertime}
              className="w-full sm:flex-1 bg-blue-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-600 font-medium text-sm md:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submittingOvertime && <Loader2 className="w-4 h-4 animate-spin" />}
              {submittingOvertime ? 'Submitting...' : 'Record Overtime'}
            </button>
            <button
              onClick={() => {
                setShowAddOvertimeModal(false);
                setOvertimeFormData({ staffId: '', date: '', hours: '', reason: '' });
                setErrorMessage('');
              }}
              className="w-full sm:flex-1 bg-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-400 font-medium text-sm md:text-base transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      {/* Create Roster Modal */}
      <GenericModal
        isOpen={showCreateRosterModal}
        onClose={() => {
          setShowCreateRosterModal(false);
          setRosterFormData({ month: '', year: '', department: '', assignments: [] });
          setDraggedStaff(null);
          setQuickAssignDate(null);
          setQuickAssignData({ dutyType: 'Call Duty', startTime: '', endTime: '', notes: '' });
          setAssignmentFormData({ staffId: '', staffName: '', date: '', dutyType: '', startTime: '', endTime: '', notes: '' });
          setErrorMessage('');
        }}
        title="Create Duty Roster"
        size="2xl"
      >
        <div className="space-y-6">
          {/* Roster Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={rosterFormData.month}
                onChange={(e) => setRosterFormData(prev => ({ ...prev, month: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
              >
                <option value="">Select Month</option>
                {monthNames.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                value={rosterFormData.year}
                onChange={(e) => setRosterFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                value={rosterFormData.department}
                onChange={(e) => setRosterFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="e.g., Internal Medicine"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
              />
            </div>
          </div>

          {/* Drag & Drop Calendar */}
          {rosterFormData.month && rosterFormData.year && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Drag &amp; Drop Assignments</h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Staff List (Draggable) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Staff Members</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {staff.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        {staffLoading ? 'Loading staff...' : 'No staff available'}
                      </div>
                    ) : (
                      staff.map(member => {
                        const displayName = member.name || member.full_name || 'Unknown';
                        const role = member.role || member.category || 'Staff';
                        const roleClass = role.toLowerCase();
                        const categoryColor =
                          roleClass.includes('doctor') ? 'bg-blue-100 text-blue-800' :
                          roleClass.includes('nurse') ? 'bg-green-100 text-green-800' :
                          roleClass.includes('pharmacist') ? 'bg-purple-100 text-purple-800' :
                          roleClass.includes('lab') || roleClass.includes('laboratory') ? 'bg-orange-100 text-orange-800' :
                          roleClass.includes('radi') ? 'bg-teal-100 text-teal-800' :
                          roleClass.includes('admin') ? 'bg-indigo-100 text-indigo-800' :
                          'bg-gray-100 text-gray-800';
                        return (
                          <div
                            key={member.staffId || member.id}
                            draggable
                            onDragStart={() => handleStaffDragStart(member)}
                            className="p-3 bg-white border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-nigerian-green bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-nigerian-green" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{displayName}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor}`}>
                                  {role}
                                </span>
                                {member.department && (
                                  <p className="text-xs text-gray-500 truncate">{member.department}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Calendar Grid (Drop Targets) */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {rosterFormData.month} {rosterFormData.year} Calendar
                  </label>
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="grid grid-cols-7 gap-px bg-gray-200 text-xs font-medium text-gray-500 uppercase">
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                        <div key={d} className="bg-gray-50 px-2 py-1.5 text-center">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-gray-200">
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
                                ? (dayAssignments.length > 0 ? 'bg-green-50 hover:bg-green-100' : 'bg-white hover:bg-blue-50')
                                : 'bg-gray-50'
                            }`}
                          >
                            {day.day && (
                              <span className={`text-xs font-medium ${
                                day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                                {day.day}
                              </span>
                            )}
                            {dayAssignments.length > 0 && (
                              <div className="mt-1 space-y-0.5">
                                {dayAssignments.slice(0, 2).map((a, i) => (
                                  <div key={i} className="text-xs bg-nigerian-green text-white px-1 py-0.5 rounded truncate">
                                    {(a.staffName || 'Unknown').split(' ').slice(-1)[0]}
                                  </div>
                                ))}
                                {dayAssignments.length > 2 && (
                                  <div className="text-xs text-gray-500">+{dayAssignments.length - 2} more</div>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Assign {draggedStaff.name || 'Unknown'} to {quickAssignDate}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duty Type</label>
                        <select
                          value={quickAssignData.dutyType}
                          onChange={(e) => setQuickAssignData(prev => ({ ...prev, dutyType: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                        >
                          {dutyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={quickAssignData.startTime}
                            onChange={(e) => setQuickAssignData(prev => ({ ...prev, startTime: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                          <input
                            type="time"
                            value={quickAssignData.endTime}
                            onChange={(e) => setQuickAssignData(prev => ({ ...prev, endTime: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                          value={quickAssignData.notes}
                          onChange={(e) => setQuickAssignData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Additional notes..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                      <button
                        onClick={() => { setDraggedStaff(null); setQuickAssignDate(null); }}
                        className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleQuickAssign}
                        className="flex-1 px-4 py-2 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Traditional Form (fallback when month/year not set) */}
          {(!rosterFormData.month || !rosterFormData.year) && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Duty Assignments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Staff Member</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={assignmentFormData.date}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duty Type</label>
                  <select
                    value={assignmentFormData.dutyType}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, dutyType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                  >
                    <option value="">Select Duty Type</option>
                    {dutyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={assignmentFormData.startTime}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={assignmentFormData.endTime}
                    onChange={(e) => setAssignmentFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleAddAssignment}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Add Assignment
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={assignmentFormData.notes}
                  onChange={(e) => setAssignmentFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes for this assignment"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Assignments List */}
          {rosterFormData.assignments.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Current Assignments ({rosterFormData.assignments.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {rosterFormData.assignments.map((assignment, index) => {
                  const dutyTypeColor =
                    assignment.dutyType === 'Night Duty' ? 'bg-purple-100 text-purple-800' :
                    assignment.dutyType === 'Emergency' ? 'bg-red-100 text-red-800' :
                    assignment.dutyType === 'Weekend' ? 'bg-orange-100 text-orange-800' :
                    assignment.dutyType === 'Clinic' ? 'bg-teal-100 text-teal-800' :
                    'bg-blue-100 text-blue-800';
                  return (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{assignment.staffName || 'Unknown Staff'}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 flex-wrap">
                          <span className="inline-block px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                            {assignment.date}
                          </span>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${dutyTypeColor}`}>
                            {assignment.dutyType}
                          </span>
                          <span className="text-xs">
                            {assignment.startTime || '--:--'} – {assignment.endTime || '--:--'}
                          </span>
                        </div>
                        {assignment.notes && (
                          <p className="text-xs text-gray-500 mt-1 truncate">{assignment.notes}</p>
                        )}
                      </div>
                      <Tooltip text="Remove Assignment">
                        <button
                          onClick={() => removeAssignment(index)}
                          className="ml-2 text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="text-red-600 text-sm">{errorMessage}</div>
          )}

          {/* Modal Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t">
            <button
              onClick={() => {
                setShowCreateRosterModal(false);
                setRosterFormData({ month: '', year: '', department: '', assignments: [] });
                setDraggedStaff(null);
                setQuickAssignDate(null);
                setQuickAssignData({ dutyType: 'Call Duty', startTime: '', endTime: '', notes: '' });
                setAssignmentFormData({ staffId: '', staffName: '', date: '', dutyType: '', startTime: '', endTime: '', notes: '' });
                setErrorMessage('');
              }}
              className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateRoster}
              disabled={!canCreateRoster || isCreatingRoster}
              className="w-full sm:w-auto px-6 py-2 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isCreatingRoster && <Loader2 className="w-4 h-4 animate-spin" />}
              {isCreatingRoster ? 'Creating...' : 'Create Roster'}
            </button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default DutyRoster;