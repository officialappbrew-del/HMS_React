import { useState, useEffect, useMemo, useCallback } from 'react';
import { apiRequest } from '../../utils/api';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Filter,
  Search,
  X,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  List,
  Grid,
  Users,
  Building2,
  ArrowUpDown,
  CheckCircle,
  Circle,
  Clock as ClockIcon,
  Zap,
  Sun,
  Moon,
  Coffee,
  Calendar as CalendarIcon,
  Eye
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

// ==================== COMPACT CALENDAR DAY CELL ====================
const CompactCalendarDayCell = ({ date, assignments, isToday, isCurrentMonth, onDayClick }) => {
  const dutyTypeColor = (dutyType) => {
    switch (dutyType) {
      case 'Night Duty': return 'bg-[#2C6B8A] text-white';
      case 'Emergency': return 'bg-[#C8553D] text-white';
      case 'Weekend': return 'bg-[#C87D3D] text-white';
      case 'Clinic': return 'bg-[#2D7D46] text-white';
      default: return 'bg-[#008751] text-white';
    }
  };

  const dutyTypeIcon = (dutyType) => {
    switch (dutyType) {
      case 'Night Duty': return <Moon className="w-2.5 h-2.5" />;
      case 'Emergency': return <Zap className="w-2.5 h-2.5" />;
      case 'Weekend': return <Coffee className="w-2.5 h-2.5" />;
      case 'Clinic': return <Users className="w-2.5 h-2.5" />;
      default: return <ClockIcon className="w-2.5 h-2.5" />;
    }
  };

  const dayAssignments = assignments.filter(a => {
    if (!a.date) return false;
    const d = new Date(a.date);
    return d.getDate() === date.getDate() && 
           d.getMonth() === date.getMonth() && 
           d.getFullYear() === date.getFullYear();
  });

  const hasAssignment = dayAssignments.length > 0;

  // Format time - REMOVE SECONDS and show only HH:MM
  const formatTimeDisplay = (time) => {
    if (!time) return '';
    // Convert to string if it's not already
    const timeStr = String(time);
    // If time has seconds (HH:MM:SS), remove the seconds
    if (timeStr.includes(':')) {
      const parts = timeStr.split(':');
      // Return HH:MM (first two parts)
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  };

  return (
    <div 
      className={`relative min-h-[76px] max-h-[88px] border border-[#E8E3DC] p-1 transition-all ${
        !isCurrentMonth ? 'bg-[#F7F5F2] opacity-40' : ''
      } ${isToday ? 'bg-[#E8F5EF] border-[#008751] border-2' : 'bg-white'} ${
        hasAssignment ? 'cursor-pointer hover:shadow-md hover:z-10 hover:border-[#008751]' : ''
      }`}
      onClick={() => hasAssignment && onDayClick(date, dayAssignments)}
      title={hasAssignment ? `${dayAssignments.length} assignment(s)` : 'No assignments'}
    >
      {/* Day number */}
      <div className="flex items-start justify-between">
        <span className={`text-xs font-bold leading-none ${
          isToday ? 'text-[#008751]' : 'text-[#1A1A1A]'
        }`}>
          {date.getDate()}
        </span>
        {isToday && (
          <span className="text-[6px] bg-[#008751] text-white px-1 rounded-full">●</span>
        )}
      </div>
      
      {/* Assignment indicators - Larger and more visible */}
      {hasAssignment && (
        <div className="absolute bottom-0.5 left-0.5 right-0.5 flex flex-col gap-0.5">
          {dayAssignments.slice(0, 2).map((assignment, idx) => {
            const startTime = formatTimeDisplay(assignment.startTime);
            const endTime = formatTimeDisplay(assignment.endTime);
            const timeDisplay = startTime && endTime ? `${startTime}–${endTime}` : startTime || '';
            
            return (
              <div 
                key={idx}
                className={`flex items-center justify-between text-[8px] font-bold px-1 py-0.5 rounded-sm truncate ${dutyTypeColor(assignment.dutyType)}`}
                title={`${assignment.dutyType || 'Duty'} - ${startTime} to ${endTime}`}
              >
                <span className="flex items-center gap-0.5 truncate">
                  {dutyTypeIcon(assignment.dutyType)}
                  <span className="truncate max-w-[28px]">
                    {assignment.dutyType === 'Emergency' ? 'Emerg' : 
                     assignment.dutyType === 'Night Duty' ? 'Night' :
                     assignment.dutyType === 'Weekend' ? 'Wknd' :
                     assignment.dutyType === 'Clinic' ? 'Clinic' : 
                     (assignment.dutyType || 'Duty').substring(0, 4)}
                  </span>
                </span>
                <span className="flex-shrink-0 text-[7px] font-mono">
                  {timeDisplay}
                </span>
              </div>
            );
          })}
          {dayAssignments.length > 2 && (
            <div className="text-[7px] text-[#5A5A5A] text-center font-semibold bg-white/80 rounded-sm">
              +{dayAssignments.length - 2} more
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== DAY DETAILS MODAL ====================
const DayDetailsModal = ({ isOpen, onClose, date, assignments }) => {
  if (!isOpen || !date) return null;

  const dutyTypeColor = (dutyType) => {
    switch (dutyType) {
      case 'Night Duty': return 'bg-[#2C6B8A] text-white border-[#2C6B8A]';
      case 'Emergency': return 'bg-[#C8553D] text-white border-[#C8553D]';
      case 'Weekend': return 'bg-[#C87D3D] text-white border-[#C87D3D]';
      case 'Clinic': return 'bg-[#2D7D46] text-white border-[#2D7D46]';
      default: return 'bg-[#008751] text-white border-[#008751]';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Published' 
      ? 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]'
      : 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
  };

  // Format time - REMOVE SECONDS
  const formatTimeDisplay = (time) => {
    if (!time) return '--:--';
    const timeStr = String(time);
    if (timeStr.includes(':')) {
      const parts = timeStr.split(':');
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative bg-[#F7F5F2] w-full max-w-sm max-h-[80vh] overflow-hidden transform transition-all duration-300">
          <div className="border-b border-[#E8E3DC] p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-display font-bold text-[#1A1A1A]">
                  {date.toLocaleDateString('en-NG', { 
                    weekday: 'short',
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </h3>
                <p className="text-xs text-[#5A5A5A]">{assignments.length} assignment(s)</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[#E8E3DC] rounded transition-colors"
              >
                <X className="w-4 h-4 text-[#5A5A5A]" />
              </button>
            </div>
          </div>

          <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
            <div className="space-y-2">
              {assignments.map((assignment, idx) => {
                const startTime = formatTimeDisplay(assignment.startTime);
                const endTime = formatTimeDisplay(assignment.endTime);
                return (
                  <div key={idx} className="bg-white border border-[#E8E3DC] p-3 rounded">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className={`inline-block px-2 py-0.5 text-xs font-bold border rounded ${dutyTypeColor(assignment.dutyType)}`}>
                            {assignment.dutyType || 'Duty'}
                          </span>
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-medium border rounded ${getStatusColor(assignment.rosterStatus)}`}>
                            {assignment.rosterStatus || 'Draft'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-[#5A5A5A]">
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{assignment.rosterDepartment || 'General'}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-[#5A5A5A] mt-0.5 font-medium">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="font-mono">
                            {startTime} – {endTime}
                          </span>
                        </div>
                        
                        {assignment.notes && (
                          <p className="text-[10px] text-[#5A5A5A] mt-1 pt-1 border-t border-[#F0EDE8]">
                            {assignment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#E8E3DC] p-3 flex justify-end">
            <ButtonWithTooltip
              onClick={onClose}
              tooltip="Close"
              variant="secondary"
              size="sm"
            >
              Close
            </ButtonWithTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN ROSTER TAB COMPONENT ====================
const MyRosterTab = () => {
  const [rosters, setRosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDayAssignments, setSelectedDayAssignments] = useState([]);
  const [showDayDetails, setShowDayDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDutyType, setFilterDutyType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  const loadMyRosters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('/api/v1/ward-rounds/duty-rosters/my-rosters/');
      const results = Array.isArray(response?.results) ? response.results : (Array.isArray(response) ? response : []);
      setRosters(results);
    } catch (err) {
      setError(err.message || 'Unable to load your roster.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyRosters();
  }, [loadMyRosters]);

  // Flatten and process assignments
  const assignments = useMemo(() => {
    const flat = rosters.flatMap(roster =>
      (roster.assignments || []).map(a => ({
        ...a,
        rosterMonth: roster.month,
        rosterYear: roster.year,
        rosterDepartment: roster.department,
        rosterStatus: roster.status,
        rosterId: roster.id,
        id: `${roster.id}-${a.date || ''}-${a.dutyType || ''}-${Math.random().toString(36).substr(2, 6)}`,
      }))
    );
    return flat;
  }, [rosters]);

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    let filtered = [...assignments];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.dutyType?.toLowerCase().includes(term) ||
        a.rosterDepartment?.toLowerCase().includes(term) ||
        a.notes?.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.rosterStatus === filterStatus);
    }

    if (filterDutyType !== 'all') {
      filtered = filtered.filter(a => a.dutyType === filterDutyType);
    }

    return filtered;
  }, [assignments, searchTerm, filterStatus, filterDutyType]);

  // Stats
  const stats = useMemo(() => {
    const total = assignments.length;
    const published = assignments.filter(a => a.rosterStatus === 'Published').length;
    const draft = assignments.filter(a => a.rosterStatus !== 'Published').length;
    return { total, published, draft };
  }, [assignments]);

  // Get unique duty types for filter
  const dutyTypes = useMemo(() => {
    const types = new Set();
    assignments.forEach(a => {
      if (a.dutyType) types.add(a.dutyType);
    });
    return Array.from(types);
  }, [assignments]);

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    const statusSet = new Set();
    assignments.forEach(a => {
      if (a.rosterStatus) statusSet.add(a.rosterStatus);
    });
    return Array.from(statusSet);
  }, [assignments]);

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const generateCalendarDays = useCallback((date) => {
    const { daysInMonth, firstDayOfMonth } = getDaysInMonth(date);
    const days = [];
    
    const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1);
    const prevMonthDays = getDaysInMonth(prevMonthDate).daysInMonth;
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), prevMonthDays - i);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(date.getFullYear(), date.getMonth(), i);
      days.push({ date: d, isCurrentMonth: true });
    }
    
    const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1);
    const remainingDays = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), i);
      days.push({ date: d, isCurrentMonth: false });
    }
    
    return days;
  }, []);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date, dayAssignments) => {
    setSelectedDate(date);
    setSelectedDayAssignments(dayAssignments);
    setShowDayDetails(true);
  };

  const handleExportCSV = useCallback(async () => {
    setExporting(true);
    try {
      const headers = ['Date', 'Department', 'Duty Type', 'Start Time', 'End Time', 'Status', 'Notes'];
      const rows = filteredAssignments.map(a => [
        a.date ? new Date(a.date).toLocaleDateString('en-NG') : 'N/A',
        a.rosterDepartment || 'General',
        a.dutyType || 'Duty',
        a.startTime || '--:--',
        a.endTime || '--:--',
        a.rosterStatus || 'Draft',
        a.notes || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `roster_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [filteredAssignments]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterDutyType('all');
  }, []);

  const dutyTypeColor = (dutyType) => {
    switch (dutyType) {
      case 'Night Duty': return 'bg-[#2C6B8A] text-white border-[#2C6B8A]';
      case 'Emergency': return 'bg-[#C8553D] text-white border-[#C8553D]';
      case 'Weekend': return 'bg-[#C87D3D] text-white border-[#C87D3D]';
      case 'Clinic': return 'bg-[#2D7D46] text-white border-[#2D7D46]';
      default: return 'bg-[#008751] text-white border-[#008751]';
    }
  };

  // ============================================================
  // CONDITIONAL RETURNS
  // ============================================================

  if (loading) {
    return (
      <div className="bg-white border border-[#E8E3DC] rounded-lg p-6">
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <Loader2 className="w-6 h-6 text-[#008751] animate-spin" />
          <p className="text-sm text-[#5A5A5A]">Loading your roster...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-[#E8E3DC] rounded-lg p-6">
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <AlertCircle className="w-8 h-8 text-[#C8553D]" />
          <p className="text-sm text-[#C8553D] font-medium">Unable to load roster</p>
          <p className="text-xs text-[#5A5A5A]">{error}</p>
          <ButtonWithTooltip
            onClick={loadMyRosters}
            tooltip="Retry loading"
            variant="primary"
            size="sm"
            className="mt-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </ButtonWithTooltip>
        </div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
        <div className="px-3 sm:px-4 py-2 border-b border-[#E8E3DC]">
          <h3 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#008751]" />
            My Duty Roster
          </h3>
        </div>
        <div className="px-3 sm:px-4 py-8 text-center">
          <CalendarDays className="w-12 h-12 text-[#D8D4CD] mx-auto mb-2" />
          <p className="text-sm text-[#5A5A5A]">No roster assignments yet</p>
          <p className="text-xs text-[#B0A89E] mt-1">Check back later or contact your roster coordinator</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN RENDER
  // ============================================================

  const calendarDays = generateCalendarDays(currentDate);
  const today = new Date();

  return (
    <div className="space-y-3">
      {/* Stats Summary - Compact */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] rounded p-2 text-center">
          <p className="text-sm font-display font-bold text-[#1A1A1A]">{stats.total}</p>
          <p className="text-[8px] text-[#5A5A5A] uppercase tracking-wider font-medium">Total</p>
        </div>
        <div className="bg-[#EAF3EE] border border-[#D0E3D8] rounded p-2 text-center">
          <p className="text-sm font-display font-bold text-[#2D7D46]">{stats.published}</p>
          <p className="text-[8px] text-[#5A5A5A] uppercase tracking-wider font-medium">Published</p>
        </div>
        <div className="bg-[#F5F0EA] border border-[#F0E8DC] rounded p-2 text-center">
          <p className="text-sm font-display font-bold text-[#C87D3D]">{stats.draft}</p>
          <p className="text-[8px] text-[#5A5A5A] uppercase tracking-wider font-medium">Draft</p>
        </div>
      </div>

      {/* Main Roster Card */}
      <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-3 py-2 border-b border-[#E8E3DC] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#008751]" />
            <h3 className="text-sm font-semibold text-[#1A1A1A]">
              Duty Roster
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <ButtonWithTooltip
              onClick={() => setShowFilters(!showFilters)}
              tooltip="Filters"
              variant="secondary"
              size="sm"
            >
              <Filter className="w-3.5 h-3.5" />
            </ButtonWithTooltip>

            <ButtonWithTooltip
              onClick={handleExportCSV}
              tooltip="Export"
              variant="secondary"
              size="sm"
              disabled={exporting || filteredAssignments.length === 0}
            >
              {exporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
            </ButtonWithTooltip>

            <ButtonWithTooltip
              onClick={loadMyRosters}
              tooltip="Refresh"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Filters - Compact */}
        {showFilters && (
          <div className="px-3 py-2 border-b border-[#E8E3DC] bg-[#F7F5F2]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2 top-1.5 text-[#B0A89E]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-6 pr-2 py-1 text-xs bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-1 text-xs bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              >
                <option value="all">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <div className="flex gap-1">
                <select
                  value={filterDutyType}
                  onChange={(e) => setFilterDutyType(e.target.value)}
                  className="flex-1 px-2 py-1 text-xs bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="all">All Types</option>
                  {dutyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {(searchTerm || filterStatus !== 'all' || filterDutyType !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="px-2 py-1 text-xs bg-[#F0EDE8] hover:bg-[#E8E3DC] transition-colors text-[#5A5A5A]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Calendar - Compact with Time Display */}
        <div className="p-2">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-0.5 rounded hover:bg-[#F0EDE8] transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#5A5A5A]" />
              </button>
              <span className="text-xs font-semibold text-[#1A1A1A]">
                {currentDate.toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}
              </span>
              <button
                onClick={() => navigateMonth(1)}
                className="p-0.5 rounded hover:bg-[#F0EDE8] transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#5A5A5A]" />
              </button>
            </div>
            <ButtonWithTooltip
              onClick={goToToday}
              tooltip="Today"
              variant="secondary"
              size="sm"
            >
              <span className="text-[10px]">Today</span>
            </ButtonWithTooltip>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0">
            {/* Weekday headers */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-[8px] font-bold text-[#5A5A5A] py-1 bg-[#F7F5F2] border border-[#E8E3DC]">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map(({ date, isCurrentMonth }, index) => (
              <CompactCalendarDayCell
                key={index}
                date={date}
                assignments={filteredAssignments}
                isToday={date.getDate() === today.getDate() && 
                         date.getMonth() === today.getMonth() && 
                         date.getFullYear() === today.getFullYear()}
                isCurrentMonth={isCurrentMonth}
                onDayClick={handleDayClick}
              />
            ))}
          </div>

          {/* Legend - Compact with Colors */}
          <div className="mt-2 flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E3DC]">
            <span className="text-[8px] text-[#5A5A5A] font-medium">Legend:</span>
            {[
              { type: 'Emergency', color: 'bg-[#C8553D]' },
              { type: 'Night Duty', color: 'bg-[#2C6B8A]' },
              { type: 'Weekend', color: 'bg-[#C87D3D]' },
              { type: 'Clinic', color: 'bg-[#2D7D46]' }
            ].map(({ type, color }) => (
              <span key={type} className="flex items-center gap-0.5 text-[8px]">
                <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                <span className="text-[#5A5A5A] font-medium">
                  {type === 'Emergency' ? 'Emerg' : 
                   type === 'Night Duty' ? 'Night' : 
                   type === 'Weekend' ? 'Wknd' : 'Clinic'}
                </span>
              </span>
            ))}
            <span className="text-[8px] text-[#B0A89E]">•</span>
            <span className="text-[8px] text-[#5A5A5A]">
              {filteredAssignments.filter(a => a.date && new Date(a.date).getMonth() === currentDate.getMonth() && new Date(a.date).getFullYear() === currentDate.getFullYear()).length} this month
            </span>
          </div>

          {/* Summary of current month assignments */}
          <div className="mt-1.5 text-[8px] text-[#B0A89E] text-center">
            Click on a day with assignments to view details
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      <DayDetailsModal
        isOpen={showDayDetails}
        onClose={() => {
          setShowDayDetails(false);
          setSelectedDate(null);
          setSelectedDayAssignments([]);
        }}
        date={selectedDate}
        assignments={selectedDayAssignments}
      />
    </div>
  );
};

export default MyRosterTab;