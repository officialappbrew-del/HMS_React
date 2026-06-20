import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  Eye,
  FileText,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Users,
  TrendingUp,
  BarChart3,
  Activity,
  UserPlus,
  Settings,
  ChevronDown,
  ChevronUp
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

const Appointments = () => {
  const dispatch = useDispatch();
  const { patients } = useSelector(state => state.patient || { patients: [] });
  
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Chioma Okonkwo',
      patientId: 1,
      date: '2026-01-27',
      time: '10:00 AM',
      reason: 'General Checkup',
      doctor: 'Dr. Emeka',
      status: 'scheduled',
      notes: 'Regular health checkup',
      phone: '080-1234-5678',
      email: 'chioma@email.com'
    },
    {
      id: 2,
      patientName: 'John Adebayo',
      patientId: 2,
      date: '2026-01-28',
      time: '2:30 PM',
      reason: 'Follow-up Consultation',
      doctor: 'Dr. Ngozi',
      status: 'scheduled',
      notes: 'Follow-up on previous treatment',
      phone: '080-2345-6789',
      email: 'john@email.com'
    },
    {
      id: 3,
      patientName: 'Amara Ikechukwu',
      patientId: 3,
      date: '2026-01-26',
      time: '11:00 AM',
      reason: 'Vaccination',
      doctor: 'Dr. Emeka',
      status: 'completed',
      notes: 'Routine vaccination',
      phone: '080-3456-7890',
      email: 'amara@email.com'
    },
    {
      id: 4,
      patientName: 'Oluwaseun Adeyemi',
      patientId: 4,
      date: '2026-01-29',
      time: '9:00 AM',
      reason: 'Dental Checkup',
      doctor: 'Dr. Femi',
      status: 'scheduled',
      notes: 'Routine dental cleaning',
      phone: '080-4567-8901',
      email: 'oluwaseun@email.com'
    },
    {
      id: 5,
      patientName: 'Fatima Mohammed',
      patientId: 5,
      date: '2026-01-25',
      time: '4:00 PM',
      reason: 'Eye Examination',
      doctor: 'Dr. Zainab',
      status: 'cancelled',
      notes: 'Patient cancelled due to emergency',
      phone: '080-5678-9012',
      email: 'fatima@email.com'
    }
  ]);

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

  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    date: '',
    time: '',
    reason: '',
    doctor: '',
    status: 'scheduled',
    notes: '',
    phone: '',
    email: ''
  });

  // Get unique doctors for filter
  const doctors = ['all', ...new Set(appointments.map(a => a.doctor))];

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesDoctor = filterDoctor === 'all' || apt.doctor === filterDoctor;
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  // Pagination
  const totalItems = filteredAppointments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedAppointments = filteredAppointments.slice(startIndex, endIndex);

  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (formData.patientName && formData.date && formData.time) {
      if (editingId) {
        setAppointments(appointments.map(apt => 
          apt.id === editingId ? { ...apt, ...formData } : apt
        ));
        setEditingId(null);
      } else {
        const newAppointment = {
          id: appointments.length + 1,
          ...formData
        };
        setAppointments([...appointments, newAppointment]);
      }
      resetForm();
      setShowForm(false);
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
      status: 'scheduled',
      notes: '',
      phone: '',
      email: ''
    });
  };

  const handleEdit = (appointment) => {
    setFormData(appointment);
    setEditingId(appointment.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(apt => apt.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
    setShowStatusMenu(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 flex items-center gap-1"><ClockIcon className="w-3 h-3" />Scheduled</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3 h-3" />Cancelled</span>;
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'border-blue-500';
      case 'completed': return 'border-green-500';
      case 'cancelled': return 'border-red-500';
      default: return 'border-gray-500';
    }
  };

  // Stats
  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    today: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Appointments
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Schedule and manage patient appointments
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonWithTooltip
              tooltip="Export appointments data"
              variant="secondary"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Export</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="View appointment analytics"
              variant="secondary"
            >
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Analytics</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                resetForm();
                setEditingId(null);
                setShowForm(!showForm);
              }}
              tooltip={showForm ? "Close form" : "Schedule new appointment"}
              variant="primary"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">New Appointment</span>
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          <Tooltip text="Total appointments scheduled">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stats.total}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Appointments scheduled for today">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Today</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">{stats.today}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Scheduled appointments waiting">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Scheduled</p>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600 mt-0.5 sm:mt-1">{stats.scheduled}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Completed appointments">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Completed</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">{stats.completed}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Cancelled appointments">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Cancelled</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-600 mt-0.5 sm:mt-1">{stats.cancelled}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
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
              <div className="flex items-center gap-1.5 sm:gap-2">
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
          <div className="hidden sm:flex items-center gap-4 p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Status:</span>
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
              <span className="text-xs font-medium text-gray-500">Doctor:</span>
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
            <div className="flex-1" />
            <span className="text-xs text-gray-500">
              {filteredAppointments.length} appointment(s)
            </span>
          </div>

          {/* Add Appointment Form */}
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
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="Enter patient name"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Doctor</label>
                  <input
                    type="text"
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    placeholder="Doctor name"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Appointments List */}
          <div className="p-3 sm:p-4">
            {displayedAppointments.length > 0 ? (
              <>
                <div className="overflow-x-auto -mx-3 sm:mx-0">
                  <table className="w-full min-w-[640px] sm:min-w-0">
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
                              <div>
                                <div className="font-medium text-gray-900 text-xs sm:text-sm">{appointment.patientName}</div>
                                <div className="text-[10px] text-gray-500 sm:hidden">
                                  {new Date(appointment.date).toLocaleDateString('en-NG')} {appointment.time}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 hidden sm:table-cell">
                            <div className="text-xs sm:text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3 text-gray-400" />
                                {new Date(appointment.date).toLocaleDateString('en-NG')}
                              </div>
                              <div className="flex items-center gap-1 text-gray-500">
                                <ClockIcon className="w-3 h-3 text-gray-400" />
                                {appointment.time}
                              </div>
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 hidden md:table-cell">
                            <span className="text-xs sm:text-sm text-gray-600">{appointment.doctor}</span>
                          </td>
                          <td className="py-2 sm:py-3 hidden lg:table-cell">
                            <span className="text-xs sm:text-sm text-gray-600">{appointment.reason}</span>
                          </td>
                          <td className="py-2 sm:py-3">
                            <div className="relative">
                              {getStatusBadge(appointment.status)}
                            </div>
                          </td>
                          <td className="py-2 sm:py-3">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <IconButton
                                icon={Edit2}
                                onClick={() => handleEdit(appointment)}
                                tooltip="Edit appointment"
                                variant="primary"
                              />
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
                                      <ClockIcon className="w-3 h-3 text-blue-500" />
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
                                onClick={() => handleDelete(appointment.id)}
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
                  <div className="text-[10px] sm:text-xs text-gray-500">
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
    </div>
  );
};

export default Appointments;