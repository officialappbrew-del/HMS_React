import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Users,
  Calendar,
  FileText,
  Phone,
  Ambulance,
  Clipboard,
  AlertCircle,
  Clock,
  TrendingUp,
  Eye,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  CheckCircle,
  UserPlus,
  Bell,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Printer,
  Download,
  MessageSquare,
  UserCheck,
  FileCheck,
  Activity,
  Heart,
  Stethoscope,
  Pill,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  HeartPulse,
  Brain,
  Bone,
  EyeOff,
  Shield,
  Star,
  Award,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  AlertTriangle,
  Info,
  Menu,
  LogOut
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

const ReceptionistDashboard = () => {
  const { user: authUser, tenant: authTenant } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { appointments } = useSelector(state => state.appointment || { appointments: [] });

  const displayTenantName = authTenant?.name || 'Hospital';
  const displayUserName = [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.username || authUser?.email || 'User';
  const displayRole = authUser?.role || 'receptionist';

  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const itemsPerPage = 10;

  const [stats, setStats] = useState({
    todaysAppointments: 0,
    waitingPatients: 0,
    checkIns: 0,
    referrals: 0,
  });

  const [queue, setQueue] = useState([
    { id: 1, name: 'John Doe', type: 'Consultation', waitTime: '15 min', status: 'Waiting', priority: 'normal' },
    { id: 2, name: 'Jane Smith', type: 'Follow-up', waitTime: '8 min', status: 'In Room', priority: 'normal' },
    { id: 3, name: 'Bob Johnson', type: 'Emergency', waitTime: '2 min', status: 'Waiting', priority: 'high' }
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    { id: 1, time: '14:00', patient: 'Alice Brown', type: 'Consultation', doctor: 'Dr. Smith', status: 'confirmed' },
    { id: 2, time: '14:30', patient: 'Charlie Wilson', type: 'Follow-up', doctor: 'Dr. Johnson', status: 'confirmed' },
    { id: 3, time: '15:00', patient: 'Diana Davis', type: 'New Patient', doctor: 'Dr. Smith', status: 'pending' }
  ]);

  const [communications, setCommunications] = useState([
    { id: 1, type: 'phone', message: 'Incoming call from Dr. Smith', time: '2 minutes ago', read: false },
    { id: 2, type: 'referral', message: 'Referral request received from General Hospital', time: '15 minutes ago', read: false },
    { id: 3, type: 'alert', message: 'Appointment reminder sent to 5 patients', time: '30 minutes ago', read: true }
  ]);

  const [recentCheckIns] = useState([
    { id: 1, patient: 'John Doe', time: '09:30', doctor: 'Dr. Smith', status: 'checked-in' },
    { id: 2, patient: 'Jane Smith', time: '09:45', doctor: 'Dr. Johnson', status: 'in-room' },
    { id: 3, patient: 'Bob Johnson', time: '10:00', doctor: 'Dr. Williams', status: 'completed' }
  ]);

  useEffect(() => {
    setStats({
      todaysAppointments: upcomingAppointments.length,
      waitingPatients: queue.filter(q => q.status === 'Waiting').length,
      checkIns: recentCheckIns.length,
      referrals: communications.filter(c => c.type === 'referral').length,
    });
  }, [upcomingAppointments, queue, recentCheckIns, communications]);

  const handleQueueStatusChange = (id, newStatus) => {
    setQueue(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  const handleRemoveFromQueue = (id) => {
    if (window.confirm('Remove this patient from the queue?')) {
      setQueue(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAppointmentStatusChange = (id, newStatus) => {
    setUpcomingAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  };

  const handleMarkCommunicationRead = (id) => {
    setCommunications(prev => prev.map(comm => 
      comm.id === id ? { ...comm, read: true } : comm
    ));
  };

  const handleDismissCommunication = (id) => {
    setCommunications(prev => prev.filter(comm => comm.id !== id));
  };

  const handleCheckInPatient = (patientId) => {
    // In real app, this would dispatch an action
    alert(`Patient ${patientId} checked in successfully`);
  };

  const handleScheduleAppointment = () => {
    navigate('/appointments/new');
  };

  const quickActions = [
    { icon: Users, label: 'Register Patient', action: '/patients', color: 'bg-blue-500' },
    { icon: Calendar, label: 'Schedule Appointment', action: '/appointments', color: 'bg-green-500' },
    { icon: FileText, label: 'Billing', action: '/billing', color: 'bg-purple-500' },
    { icon: Phone, label: 'Communications', action: '/communications', color: 'bg-orange-500' },
    { icon: Ambulance, label: 'Referrals', action: '/referrals', color: 'bg-red-500' },
    { icon: Clipboard, label: 'Queue Management', action: '/queue', color: 'bg-pink-500' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'queue', label: 'Queue', icon: Clipboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'checkins', label: 'Check-ins', icon: UserCheck },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'Waiting': { label: 'Waiting', color: 'bg-yellow-100 text-yellow-800' },
      'In Room': { label: 'In Room', color: 'bg-green-100 text-green-800' },
      'Completed': { label: 'Completed', color: 'bg-blue-100 text-blue-800' },
      'confirmed': { label: 'Confirmed', color: 'bg-green-100 text-green-800' },
      'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
      'checked-in': { label: 'Checked In', color: 'bg-blue-100 text-blue-800' },
      'in-room': { label: 'In Room', color: 'bg-green-100 text-green-800' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  // Render tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'queue':
        return renderQueueContent();
      case 'appointments':
        return renderAppointmentsContent();
      case 'checkins':
        return renderCheckInsContent();
      default:
        return renderOverviewContent();
    }
  };

  const renderOverviewContent = () => {
    return (
      <>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Tooltip text="Total appointments scheduled for today">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Today's Appointments</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.todaysAppointments}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Patients currently waiting in queue">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Waiting Patients</p>
                  <p className="mt-1 text-2xl font-bold text-orange-600">{stats.waitingPatients}</p>
                </div>
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Patients checked in today">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Check-ins Today</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">{stats.checkIns}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Referrals received today">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Referrals</p>
                  <p className="mt-1 text-2xl font-bold text-purple-600">{stats.referrals}</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Ambulance className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Tooltip key={index} text={`Go to ${action.label}`}>
                  <button
                    onClick={() => navigate(action.action)}
                    className={`${action.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center justify-center h-16 sm:h-20`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                    <span className="text-[10px] sm:text-xs font-medium text-center">{action.label}</span>
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Communications */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Communications</h2>
            <div className="flex items-center gap-2">
              <ButtonWithTooltip
                onClick={() => setCommunications(prev => prev.map(c => ({ ...c, read: true })))}
                tooltip="Mark all as read"
                variant="secondary"
                className="text-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Mark All Read
              </ButtonWithTooltip>
              <ButtonWithTooltip
                onClick={() => navigate('/communications')}
                tooltip="View all communications"
                variant="primary"
                className="text-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                View All
              </ButtonWithTooltip>
            </div>
          </div>
          <div className="space-y-2">
            {communications.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No communications</p>
              </div>
            ) : (
              communications.map((comm) => (
                <div key={comm.id} className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${comm.read ? 'opacity-60' : ''}`}>
                  <div className="flex items-center flex-1">
                    {comm.type === 'phone' && <Phone className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />}
                    {comm.type === 'referral' && <Ambulance className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />}
                    {comm.type === 'alert' && <AlertCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{comm.message}</p>
                      <p className="text-xs text-gray-500">{comm.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!comm.read && (
                      <IconButton
                        icon={CheckCircle}
                        onClick={() => handleMarkCommunicationRead(comm.id)}
                        tooltip="Mark as read"
                        variant="success"
                      />
                    )}
                    <IconButton
                      icon={X}
                      onClick={() => handleDismissCommunication(comm.id)}
                      tooltip="Dismiss"
                      variant="default"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </>
    );
  };

  const renderQueueContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Current Queue</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Refresh queue"
              variant="secondary"
              onClick={() => alert('Queue refreshed')}
            >
              <Clock className="w-3.5 h-3.5" />
              Refresh
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wait Time</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queue.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    <Clipboard className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    Queue is empty
                  </td>
                </tr>
              ) : (
                queue.map((item) => {
                  const status = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </td>
                      <td className="py-3 text-sm text-gray-600">{item.type}</td>
                      <td className="py-3 text-sm text-gray-600">{item.waitTime}</td>
                      <td className="py-3">
                        {item.priority === 'high' ? (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            High
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          {item.status === 'Waiting' && (
                            <IconButton
                              icon={UserCheck}
                              onClick={() => handleQueueStatusChange(item.id, 'In Room')}
                              tooltip="Move to room"
                              variant="success"
                            />
                          )}
                          {item.status === 'In Room' && (
                            <IconButton
                              icon={CheckCircle}
                              onClick={() => handleQueueStatusChange(item.id, 'Completed')}
                              tooltip="Mark completed"
                              variant="primary"
                            />
                          )}
                          <IconButton
                            icon={Trash2}
                            onClick={() => handleRemoveFromQueue(item.id)}
                            tooltip="Remove from queue"
                            variant="danger"
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
    );
  };

  const renderAppointmentsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Upcoming Appointments</h2>
          <ButtonWithTooltip
            onClick={handleScheduleAppointment}
            tooltip="Schedule new appointment"
            variant="primary"
          >
            <Plus className="w-3.5 h-3.5" />
            New Appointment
          </ButtonWithTooltip>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {upcomingAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    No appointments scheduled
                  </td>
                </tr>
              ) : (
                upcomingAppointments.map((apt) => {
                  const status = getStatusBadge(apt.status);
                  return (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 text-sm font-medium text-gray-900">{apt.time}</td>
                      <td className="py-3 text-sm text-gray-600">{apt.patient}</td>
                      <td className="py-3 text-sm text-gray-600">{apt.type}</td>
                      <td className="py-3 text-sm text-gray-600">{apt.doctor}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <IconButton
                            icon={CheckCircle}
                            onClick={() => handleAppointmentStatusChange(apt.id, 'confirmed')}
                            tooltip="Confirm appointment"
                            variant="success"
                          />
                          <IconButton
                            icon={Edit}
                            onClick={() => navigate(`/appointments/${apt.id}/edit`)}
                            tooltip="Edit appointment"
                            variant="primary"
                          />
                          <IconButton
                            icon={Trash2}
                            onClick={() => {
                              if (window.confirm('Cancel this appointment?')) {
                                handleAppointmentStatusChange(apt.id, 'cancelled');
                              }
                            }}
                            tooltip="Cancel appointment"
                            variant="danger"
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
    );
  };

  const renderCheckInsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Recent Check-ins</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Export check-in data"
              variant="secondary"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="Check in new patient"
              variant="primary"
              onClick={() => navigate('/patients/check-in')}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Check In
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentCheckIns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    No check-ins today
                  </td>
                </tr>
              ) : (
                recentCheckIns.map((checkin) => {
                  const status = getStatusBadge(checkin.status);
                  return (
                    <tr key={checkin.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <span className="text-sm font-medium text-gray-900">{checkin.patient}</span>
                      </td>
                      <td className="py-3 text-sm text-gray-600">{checkin.time}</td>
                      <td className="py-3 text-sm text-gray-600">{checkin.doctor}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <IconButton
                            icon={Eye}
                            onClick={() => navigate(`/patients/${checkin.id}`)}
                            tooltip="View patient"
                            variant="primary"
                          />
                          <IconButton
                            icon={Stethoscope}
                            onClick={() => navigate(`/patients/${checkin.id}/consult`)}
                            tooltip="Start consultation"
                            variant="success"
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
    );
  };

  return (
    <div className="dashboard min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {displayUserName}
            </h1>
            <p className="text-sm text-gray-500">
              {displayTenantName} · {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)} Dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="View notifications"
              variant="secondary"
              className="relative"
            >
              <Bell className="w-4 h-4" />
              {communications.filter(c => !c.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {communications.filter(c => !c.read).length}
                </span>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="Settings"
              variant="secondary"
              onClick={() => navigate('/settings')}
            >
              <Settings className="w-4 h-4" />
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <nav className="flex gap-4 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tooltip key={tab.id} text={`View ${tab.label}`}>
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-1 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              </Tooltip>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;