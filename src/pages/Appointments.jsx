import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiRequest } from '../utils/api';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Download,
  Printer,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Grid,
  List,
  RefreshCw,
  Ban,
  Activity
} from 'lucide-react';

// Tooltip Component
const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
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
          <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg">
            {text}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
              position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
              'left-[-4px] top-1/2 -translate-y-1/2'
            }`} />
          </div>
        </div>
      )}
    </div>
  );
};

// Icon Button with Tooltip
const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false }) => {
  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-600',
    primary: 'text-blue-600 hover:text-blue-700',
    success: 'text-green-600 hover:text-green-700',
    danger: 'text-red-600 hover:text-red-700',
    warning: 'text-yellow-600 hover:text-yellow-700',
    info: 'text-blue-600 hover:text-blue-700',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded-lg transition-all duration-200 ${variantClasses[variant]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:scale-95'
        }`}
      >
        <Icon className="w-4 h-4" />
      </button>
    </Tooltip>
  );
};

// Button with Tooltip
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '' }) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, appointment }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Delete Appointment
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="mb-4">
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg mb-4">
              <p className="text-sm text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>This action cannot be undone. This will permanently delete the appointment.</span>
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Patient:</span> {appointment?.patientName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Date:</span> {appointment?.date} at {appointment?.time}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Doctor:</span> {appointment?.doctor}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Reason:</span> {appointment?.reason}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  appointment?.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  appointment?.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appointment?.status?.charAt(0).toUpperCase() + appointment?.status?.slice(1)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Appointments = () => {
  const dispatch = useDispatch();
  const { patients, loading, error } = useSelector(state => state.patient || { patients: [], loading: false, error: null });
  
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [doctorsList, setDoctorsList] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const itemsPerPage = 5;
  const [showStatusMenu, setShowStatusMenu] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
    reason: ''
  });
  const [cancelReason, setCancelReason] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [showActivityLog, setShowActivityLog] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    date: '',
    time: '',
    reason: '',
    doctor: '',
    doctorId: '',
    status: 'scheduled',
    notes: '',
    appointment_type: 'consultation'
  });

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatTimeToBackend = (displayTime) => {
    if (!displayTime) return '';
    if (displayTime.includes('AM') || displayTime.includes('PM')) {
      const match = displayTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return displayTime;
      let hours = parseInt(match[1], 10);
      const minutes = match[2];
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return `${String(hours).padStart(2, '0')}:${minutes}:00`;
    }
    if (displayTime.length === 5) return displayTime + ':00';
    return displayTime;
  };

  const normalizeAppointment = (apt) => ({
    id: apt.id,
    patientName: apt.patient_name || 'Unknown Patient',
    patientId: apt.patient || '',
    date: apt.scheduled_date || '',
    time: formatTime(apt.scheduled_time),
    timeRaw: apt.scheduled_time ? apt.scheduled_time.substring(0, 5) : '',
    reason: apt.reason || '',
    doctor: apt.doctor_name || '',
    doctorId: apt.doctor || '',
    status: normalizeAppointmentStatus(apt.status),
    notes: apt.notes || '',
    phone: apt.patient_phone || '',
    email: apt.patient_email || '',
    appointment_type: apt.appointment_type || 'consultation',
  });

  const normalizeAppointmentStatus = (status) => {
    const statusMap = {
      'scheduled': 'scheduled',
      'confirmed': 'scheduled',
      'checked_in': 'in-progress',
      'in_progress': 'in-progress',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'no_show': 'cancelled',
      'rescheduled': 'scheduled',
    };
    return statusMap[status] || status || 'scheduled';
  };

  const loadAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      setAppointmentsError(null);
      const data = await apiRequest('/api/v1/patients/appointments/');
      const results = Array.isArray(data) ? data : (data.results || []);
      const normalized = results.map(normalizeAppointment);
      setAppointments(normalized);
    } catch (err) {
      setAppointmentsError(err.message || 'Failed to load appointments');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [dispatch]);

  const fetchDoctors = async () => {
    try {
      setDoctorsLoading(true);
      const data = await apiRequest('/api/v1/tenants/users/?role=doctor');
      const results = Array.isArray(data) ? data : (data.results || []);
      setDoctorsList(results);
    } catch {
      setDoctorsList([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const handleDoctorSearch = (e) => {
    const value = e.target.value;
    setDoctorSearchQuery(value);
    if (!value) {
      setFormData(prev => ({ ...prev, doctor: '', doctorId: '' }));
    } else {
      setFormData(prev => ({ ...prev, doctor: '', doctorId: '' }));
    }
  };

  const doctors = ['all', ...new Set(appointments.map(a => a.doctor).filter(Boolean))];

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesDoctor = filterDoctor === 'all' || apt.doctor === filterDoctor;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const totalItems = filteredAppointments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedAppointments = filteredAppointments.slice(startIndex, endIndex);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.date || !formData.time || !formData.patientId) {
      alert('Please select a patient, date, and time');
      return;
    }

    const payload = {
      appointment_type: formData.appointment_type || 'consultation',
      scheduled_date: formData.date,
      scheduled_time: formatTimeToBackend(formData.time),
      reason: formData.reason,
      notes: formData.notes,
      status: formData.status,
      doctor: formData.doctorId ? parseInt(formData.doctorId, 10) : null,
    };

    if (formData.patientId) {
      payload.patient = parseInt(formData.patientId, 10);
    }

    try {
      if (editingId) {
        const updated = await apiRequest(`/api/v1/patients/appointments/${editingId}/`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setAppointments(appointments.map(apt => apt.id === editingId ? normalizeAppointment(updated) : apt));
        setEditingId(null);
      } else {
        const created = await apiRequest('/api/v1/patients/appointments/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setAppointments([normalizeAppointment(created), ...appointments]);
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      alert(err.message || 'Failed to save appointment');
    }
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientId: '',
      date: '',
      time: '',
      reason: '',
      doctor: '',
      doctorId: '',
      status: 'scheduled',
      notes: '',
      appointment_type: 'consultation'
    });
    setPatientSearchQuery('');
    setDoctorSearchQuery('');
  };

  const handleEdit = (appointment) => {
    setFormData({
      ...appointment,
      time: appointment.timeRaw || formatTimeToBackend(appointment.time),
    });
    setDoctorSearchQuery(appointment.doctor || '');
    setEditingId(appointment.id);
    setPatientSearchQuery('');
    setShowForm(true);
  };

  const handleDelete = (appointment) => {
    setShowDeleteModal(appointment);
  };

  const confirmDelete = async () => {
    if (showDeleteModal) {
      try {
        await apiRequest(`/api/v1/patients/appointments/${showDeleteModal.id}/`, {
          method: 'DELETE',
        });
        setAppointments(appointments.filter(apt => apt.id !== showDeleteModal.id));
        addActivityLog(
          showDeleteModal.patientName,
          'deleted',
          `Appointment deleted: ${showDeleteModal.date} at ${showDeleteModal.time}`
        );
      } catch (err) {
        alert(err.message || 'Failed to delete appointment');
      }
      setShowDeleteModal(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await apiRequest(`/api/v1/patients/appointments/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setAppointments(appointments.map(apt => apt.id === id ? normalizeAppointment(updated) : apt));
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
    setShowStatusMenu(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 flex items-center gap-1"><Clock className="w-3 h-3" />Scheduled</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3 h-3" />Cancelled</span>;
      default:
        return status;
    }
  };

  const handleReschedule = (appointment) => {
    setShowRescheduleModal(appointment);
    setRescheduleData({
      date: appointment.date,
      time: appointment.timeRaw || formatTimeToBackend(appointment.time),
      reason: ''
    });
  };

  const confirmReschedule = async (e) => {
    e.preventDefault();
    if (!rescheduleData.reason.trim()) {
      alert('Please provide a reason for rescheduling');
      return;
    }

    const appointment = showRescheduleModal;
    const oldDate = appointment.date;
    const oldTime = appointment.time;

    try {
      const updated = await apiRequest(`/api/v1/patients/appointments/${appointment.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          scheduled_date: rescheduleData.date,
          scheduled_time: formatTimeToBackend(rescheduleData.time),
          status: 'scheduled',
          notes: (appointment.notes || '') + `\nRescheduled from ${oldDate} ${oldTime} to ${rescheduleData.date} ${rescheduleData.time}. Reason: ${rescheduleData.reason}`
        }),
      });
      setAppointments(appointments.map(apt => 
        apt.id === appointment.id ? normalizeAppointment(updated) : apt
      ));

      addActivityLog(
        appointment.patientName,
        'rescheduled',
        `Rescheduled from ${oldDate} ${oldTime} to ${rescheduleData.date} ${rescheduleData.time}. Reason: ${rescheduleData.reason}`
      );
    } catch (err) {
      alert(err.message || 'Failed to reschedule appointment');
    }

    setShowRescheduleModal(null);
    setRescheduleData({ date: '', time: '', reason: '' });
  };

  const handleCancel = (appointment) => {
    setShowCancelModal(appointment);
    setCancelReason('');
  };

  const confirmCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    const appointment = showCancelModal;

    try {
      const updated = await apiRequest(`/api/v1/patients/appointments/${appointment.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'cancelled',
          notes: (appointment.notes || '') + `\nCancelled. Reason: ${cancelReason}`
        }),
      });
      setAppointments(appointments.map(apt => 
        apt.id === appointment.id ? normalizeAppointment(updated) : apt
      ));

      addActivityLog(
        appointment.patientName,
        'cancelled',
        `Cancelled. Reason: ${cancelReason}`
      );
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment');
    }

    setShowCancelModal(null);
    setCancelReason('');
  };

  const addActivityLog = (patientName, action, details) => {
    const newLog = {
      id: activityLog.length + 1,
      patientName,
      action,
      details,
      timestamp: new Date().toLocaleString('en-NG', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
    setActivityLog([newLog, ...activityLog]);
  };

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    today: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
              <span className="truncate">Appointments</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Schedule and manage patient appointments
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {activityLog.length > 0 && (
              <ButtonWithTooltip
                tooltip="View activity log"
                variant="secondary"
                onClick={() => setShowActivityLog(!showActivityLog)}
                className="!px-2 sm:!px-3"
              >
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline ml-1">Activity</span>
                {activityLog.length > 0 && (
                  <span className="ml-1 bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                    {activityLog.length}
                  </span>
                )}
              </ButtonWithTooltip>
            )}
            <ButtonWithTooltip
              tooltip="Export appointments data"
              variant="secondary"
              className="!px-2 sm:!px-3"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline ml-1">Export</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                resetForm();
                setEditingId(null);
                setShowForm(!showForm);
              }}
              tooltip={showForm ? "Close form" : "Schedule new appointment"}
              variant="primary"
              className="!px-2 sm:!px-3"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline ml-1">New</span>
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Stats Grid - Tooltips removed */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase truncate">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stats.total}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase truncate">Today</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">{stats.today}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase truncate">Scheduled</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600 mt-0.5 sm:mt-1">{stats.scheduled}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase truncate">Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">{stats.completed}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase truncate">Cancelled</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600 mt-0.5 sm:mt-1">{stats.cancelled}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Activity Log Panel */}
        {showActivityLog && activityLog.length > 0 && (
          <div className="mb-4 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Recent Activity Log
              </h3>
              <button
                onClick={() => setShowActivityLog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {activityLog.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                    log.action === 'rescheduled' ? 'bg-yellow-500' : 
                    log.action === 'cancelled' ? 'bg-red-500' : 
                    log.action === 'deleted' ? 'bg-gray-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm text-gray-900 truncate">{log.patientName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${
                        log.action === 'rescheduled' ? 'bg-yellow-100 text-yellow-700' : 
                        log.action === 'cancelled' ? 'bg-red-100 text-red-700' :
                        log.action === 'deleted' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 break-words">{log.details}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <IconButton
                  icon={Filter}
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  tooltip={showMobileFilters ? "Hide filters" : "Show filters"}
                  variant="default"
                  className="sm:hidden"
                />
                <IconButton
                  icon={viewMode === 'table' ? Grid : List}
                  onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                  tooltip={viewMode === 'table' ? "Switch to grid view" : "Switch to table view"}
                  variant="default"
                />
                <IconButton
                  icon={Printer}
                  onClick={() => window.print()}
                  tooltip="Print appointment list"
                  variant="default"
                />
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="p-3 sm:p-4 border-b border-gray-200 sm:hidden">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Doctor</label>
                  <select
                    value={filterDoctor}
                    onChange={(e) => setFilterDoctor(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Doctors</option>
                    {doctors.filter(d => d !== 'all').map(doc => (
                      <option key={doc} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Filters */}
          <div className="hidden sm:flex items-center gap-4 p-3 sm:p-4 border-b border-gray-200 bg-gray-50 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Doctor:</span>
              <select
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Doctors</option>
                {doctors.filter(d => d !== 'all').map(doc => (
                  <option key={doc} value={doc}>{doc}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[50px]" />
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {filteredAppointments.length} appointment(s)
            </span>
          </div>

          {/* Add Appointment Form - Improved responsiveness */}
          {showForm && (
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {editingId ? 'Edit Appointment' : 'Schedule New Appointment'}
                </h3>
                <IconButton
                  icon={X}
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                    setEditingId(null);
                  }}
                  tooltip="Close form"
                  variant="default"
                />
              </div>
              <form onSubmit={handleAddAppointment} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="relative sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Patient *</label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => {
                      setFormData({ ...formData, patientName: e.target.value });
                      setPatientSearchQuery(e.target.value);
                    }}
                    placeholder="Search patient by name..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {patientSearchQuery && !formData.patientId && patients && patients.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                      {patients.filter(p => {
                        const name = (p.name || p.full_name || '').toLowerCase();
                        return name.includes(patientSearchQuery.toLowerCase()) ||
                               (p.hospital_number || '').toLowerCase().includes(patientSearchQuery.toLowerCase());
                      }).slice(0, 8).map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, patientName: p.name || p.full_name, patientId: p.id }));
                            setPatientSearchQuery('');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
                        >
                          <span className="font-medium text-gray-900">{p.name || p.full_name}</span>
                          {p.hospital_number && (
                            <span className="text-xs text-gray-500 ml-2">HN: {p.hospital_number}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Doctor</label>
                  <input
                    type="text"
                    value={formData.doctor || doctorSearchQuery}
                    onChange={handleDoctorSearch}
                    onFocus={() => {
                      if (doctorsList.length === 0 && !doctorsLoading) {
                        fetchDoctors();
                      }
                    }}
                    placeholder="Search doctor..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {doctorSearchQuery && !formData.doctorId ? (
                    doctorsList.length > 0 ? (
                      <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                        {doctorsList.filter(d => {
                          const name = ((d.first_name || '') + ' ' + (d.last_name || '')).toLowerCase();
                          const fullName = (d.full_name || '').toLowerCase();
                          const email = (d.email || '').toLowerCase();
                          const query = doctorSearchQuery.toLowerCase();
                          return name.includes(query) || fullName.includes(query) || email.includes(query);
                        }).slice(0, 8).map(d => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => {
                              const fullName = [d.first_name, d.last_name].filter(Boolean).join(' ');
                              setFormData(prev => ({ ...prev, doctor: fullName || d.full_name || '', doctorId: d.id }));
                              setDoctorSearchQuery('');
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
                          >
                            <span className="font-medium text-gray-900">{d.first_name} {d.last_name}</span>
                            {d.department_name && (
                              <div className="text-[10px] text-gray-400">{d.department_name}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                        <p className="px-3 py-2 text-xs text-gray-500">
                          {doctorsLoading ? 'Searching...' : 'No doctors available'}
                        </p>
                      </div>
                    )
                  ) : null}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Appointment Type</label>
                  <select
                    value={formData.appointment_type}
                    onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="consultation">Consultation</option>
                    <option value="followup">Follow-up</option>
                    <option value="procedure">Procedure</option>
                    <option value="test">Test/Investigation</option>
                    <option value="review">Review</option>
                    <option value="immunization">Immunization</option>
                    <option value="antenatal">Antenatal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    disabled
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Reason for Visit</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="e.g., General Checkup, Follow-up, etc."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    {editingId ? 'Update Appointment' : 'Schedule Appointment'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                      setEditingId(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Appointments List - Improved responsiveness */}
          <div className="p-3 sm:p-4">
            {appointmentsLoading ? (
              <div className="text-center py-8 sm:py-12">
                <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3 animate-pulse" />
                <p className="text-gray-500 text-sm">Loading appointments...</p>
              </div>
            ) : appointmentsError ? (
              <div className="text-center py-8 sm:py-12">
                <AlertCircle className="w-10 h-10 text-red-300 mx-auto mb-3" />
                <p className="text-red-600 text-sm font-medium">{appointmentsError}</p>
                <button
                  onClick={loadAppointments}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Retry
                </button>
              </div>
            ) : displayedAppointments.length > 0 ? (
              <>
                {/* Mobile Card View - Shows on small screens */}
                <div className="sm:hidden space-y-3">
                  {displayedAppointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm text-gray-900 truncate">{appointment.patientName}</div>
                            <div className="text-xs text-gray-500 truncate">{appointment.reason}</div>
                          </div>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span>{new Date(appointment.date).toLocaleDateString('en-NG')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-1 truncate">
                          <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{appointment.doctor}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-1 pt-2 border-t border-gray-100">
                        <IconButton
                          icon={Edit2}
                          onClick={() => handleEdit(appointment)}
                          tooltip="Edit appointment"
                          variant="primary"
                          className="!p-2"
                        />
                        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                          <>
                            <IconButton
                              icon={RefreshCw}
                              onClick={() => handleReschedule(appointment)}
                              tooltip="Reschedule appointment"
                              variant="warning"
                              className="!p-2"
                            />
                            <IconButton
                              icon={Ban}
                              onClick={() => handleCancel(appointment)}
                              tooltip="Cancel appointment"
                              variant="danger"
                              className="!p-2"
                            />
                          </>
                        )}
                        <div className="relative">
                          <IconButton
                            icon={MoreVertical}
                            onClick={() => setShowStatusMenu(showStatusMenu === appointment.id ? null : appointment.id)}
                            tooltip="Change status"
                            variant="default"
                            className="!p-2"
                          />
                          {showStatusMenu === appointment.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'scheduled')}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Clock className="w-3 h-3 text-blue-500" />
                                Scheduled
                              </button>
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'completed')}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
                              >
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                Completed
                              </button>
                              <button
                                onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
                              >
                                <XCircle className="w-3 h-3 text-red-500" />
                                Cancelled
                              </button>
                            </div>
                          )}
                        </div>
                        <IconButton
                          icon={Trash2}
                          onClick={() => handleDelete(appointment)}
                          tooltip="Delete appointment"
                          variant="danger"
                          className="!p-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Table View - Shows on larger screens */}
                <div className="hidden sm:block overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full min-w-[640px] lg:min-w-0">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date & Time</th>
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Doctor</th>
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Reason</th>
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {displayedAppointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2 sm:py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px]">{appointment.patientName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 hidden sm:table-cell">
                            <div className="text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="whitespace-nowrap">{new Date(appointment.date).toLocaleDateString('en-NG')}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-500">
                                <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                <span className="whitespace-nowrap">{appointment.time}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 hidden md:table-cell">
                            <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[120px] block">{appointment.doctor}</span>
                          </td>
                          <td className="py-2 sm:py-3 hidden lg:table-cell">
                            <span className="text-xs sm:text-sm text-gray-600 truncate max-w-[150px] block">{appointment.reason}</span>
                          </td>
                          <td className="py-2 sm:py-3">
                            <div className="relative">
                              {getStatusBadge(appointment.status)}
                            </div>
                          </td>
                          <td className="py-2 sm:py-3">
                            <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
                              <IconButton
                                icon={Edit2}
                                onClick={() => handleEdit(appointment)}
                                tooltip="Edit appointment"
                                variant="primary"
                              />
                              {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                <>
                                  <IconButton
                                    icon={RefreshCw}
                                    onClick={() => handleReschedule(appointment)}
                                    tooltip="Reschedule appointment"
                                    variant="warning"
                                  />
                                  <IconButton
                                    icon={Ban}
                                    onClick={() => handleCancel(appointment)}
                                    tooltip="Cancel appointment"
                                    variant="danger"
                                  />
                                </>
                              )}
                              <div className="relative">
                                <IconButton
                                  icon={MoreVertical}
                                  onClick={() => setShowStatusMenu(showStatusMenu === appointment.id ? null : appointment.id)}
                                  tooltip="Change status"
                                  variant="default"
                                />
                                {showStatusMenu === appointment.id && (
                                  <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                                    <button
                                      onClick={() => handleStatusChange(appointment.id, 'scheduled')}
                                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Clock className="w-3 h-3 text-blue-500" />
                                      Scheduled
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(appointment.id, 'completed')}
                                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      Completed
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <XCircle className="w-3 h-3 text-red-500" />
                                      Cancelled
                                    </button>
                                  </div>
                                )}
                              </div>
                              <IconButton
                                icon={Trash2}
                                onClick={() => handleDelete(appointment)}
                                tooltip="Delete appointment"
                                variant="danger"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 gap-2 sm:gap-0">
                  <div className="text-[10px] sm:text-xs text-gray-500 text-center sm:text-left">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <IconButton
                      icon={ChevronLeft}
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      tooltip="Previous page"
                      variant="default"
                      disabled={currentPage === 1}
                    />
                    <span className="text-[10px] sm:text-xs text-gray-600">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <IconButton
                      icon={ChevronRight}
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      tooltip="Next page"
                      variant="default"
                      disabled={currentPage === totalPages}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 font-medium text-sm sm:text-base">No appointments found</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {searchTerm ? 'Try adjusting your search or filters' : 'Schedule your first appointment'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <ButtonWithTooltip
                    onClick={() => {
                      resetForm();
                      setEditingId(null);
                      setShowForm(true);
                    }}
                    tooltip="Schedule new appointment"
                    variant="primary"
                    className="mt-3 sm:mt-4"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    New Appointment
                  </ButtonWithTooltip>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={confirmDelete}
        appointment={showDeleteModal}
      />

      {/* Reschedule Modal - Improved responsiveness */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h3>
                <button
                  onClick={() => {
                    setShowRescheduleModal(null);
                    setRescheduleData({ date: '', time: '', reason: '' });
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Patient: <span className="font-medium">{showRescheduleModal.patientName}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Current: <span className="font-medium">{showRescheduleModal.date} at {showRescheduleModal.time}</span>
                </p>
              </div>
              <form onSubmit={confirmReschedule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date *</label>
                  <input
                    type="date"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time *</label>
                  <input
                    type="time"
                    value={rescheduleData.time}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Rescheduling *
                  </label>
                  <textarea
                    value={rescheduleData.reason}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                    placeholder="Please provide a reason for rescheduling..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRescheduleModal(null);
                      setRescheduleData({ date: '', time: '', reason: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-2"
                  >
                    Reschedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal - Improved responsiveness */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Cancel Appointment</h3>
                <button
                  onClick={() => {
                    setShowCancelModal(null);
                    setCancelReason('');
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Patient: <span className="font-medium">{showCancelModal.patientName}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Date & Time: <span className="font-medium">{showCancelModal.date} at {showCancelModal.time}</span>
                </p>
              </div>
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>This action will cancel the appointment and notify the patient.</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows="3"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(null);
                    setCancelReason('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  onClick={confirmCancel}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors order-1 sm:order-2"
                >
                  Cancel Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;