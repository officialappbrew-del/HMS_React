import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Users,
  Activity,
  Pill,
  Bed,
  Heart,
  Stethoscope,
  AlertCircle,
  Clock,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Printer,
  Download,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  UserPlus,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Home,
  Briefcase,
  Clipboard,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  HeartPulse,
  Brain,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus,
  Calendar,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  RefreshCw,
  Play,
  Pause,
  Square,
  Zap,
  Shield,
  Star,
  Award
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

const NurseDashboard = () => {
  const { user: authUser, tenant: authTenant } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { admissions } = useSelector(state => state.admission || { admissions: [] });

  const displayTenantName = authTenant?.name || 'Hospital';
  const displayUserName = [authUser?.first_name, authUser?.last_name].filter(Boolean).join(' ') || authUser?.username || authUser?.email || 'User';
  const displayRole = authUser?.role || 'nurse';

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const itemsPerPage = 10;

  const [stats, setStats] = useState({
    assignedPatients: 0,
    vitalsDue: 0,
    medicationsDue: 0,
    bedChecks: 0,
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Medication due - Room 203, 2pm', time: '10 min ago', read: false },
    { id: 2, type: 'info', message: 'Vital signs check completed - Room 105', time: '30 min ago', read: false },
    { id: 3, type: 'critical', message: 'Patient alert - Room 301', time: '5 min ago', read: false }
  ]);

  const [assignedPatients, setAssignedPatients] = useState([
    { id: 1, name: 'John Doe', room: '203', status: 'Stable', nextCheck: '14:00', vitals: 'Normal' },
    { id: 2, name: 'Jane Smith', room: '105', status: 'Critical', nextCheck: '13:30', vitals: 'Abnormal' },
    { id: 3, name: 'Bob Johnson', room: '301', status: 'Improving', nextCheck: '15:00', vitals: 'Stable' },
    { id: 4, name: 'Alice Brown', room: '204', status: 'Stable', nextCheck: '16:00', vitals: 'Normal' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, patient: 'John Doe', room: '203', task: 'Administer medication', due: '14:00', status: 'pending', priority: 'high' },
    { id: 2, patient: 'Jane Smith', room: '105', task: 'Vital signs check', due: '13:30', status: 'in-progress', priority: 'critical' },
    { id: 3, patient: 'Bob Johnson', room: '301', task: 'Bed check', due: '15:00', status: 'completed', priority: 'medium' },
    { id: 4, patient: 'Alice Brown', room: '204', task: 'Medication administration', due: '16:00', status: 'pending', priority: 'medium' }
  ]);

  const [taskForm, setTaskForm] = useState({
    patient: '',
    room: '',
    task: '',
    due: '',
    priority: 'medium'
  });

  const [vitalSigns, setVitalSigns] = useState([
    { id: 1, patient: 'John Doe', room: '203', bp: '120/80', hr: '72', temp: '36.8', spO2: '98', recorded: '2024-01-15 10:30' },
    { id: 2, patient: 'Jane Smith', room: '105', bp: '140/90', hr: '95', temp: '38.2', spO2: '92', recorded: '2024-01-15 09:45' },
    { id: 3, patient: 'Bob Johnson', room: '301', bp: '110/70', hr: '68', temp: '36.5', spO2: '99', recorded: '2024-01-15 08:15' }
  ]);

  useEffect(() => {
    setStats({
      assignedPatients: assignedPatients.length,
      vitalsDue: tasks.filter(t => t.task.includes('Vital') && t.status === 'pending').length,
      medicationsDue: tasks.filter(t => t.task.includes('Medication') && t.status === 'pending').length,
      bedChecks: tasks.filter(t => t.task.includes('Bed') && t.status === 'pending').length,
    });
  }, [assignedPatients, tasks]);

  const handleMarkAlertRead = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleTaskStatusChange = (id, status) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const handleSaveTask = () => {
    if (!taskForm.patient || !taskForm.task) {
      alert('Please fill in patient and task fields');
      return;
    }

    const newTask = {
      id: editingTaskId || Date.now(),
      ...taskForm,
      status: 'pending'
    };

    if (editingTaskId) {
      setTasks(prev => prev.map(task => 
        task.id === editingTaskId ? newTask : task
      ));
    } else {
      setTasks(prev => [newTask, ...prev]);
    }

    resetTaskForm();
    setShowTaskForm(false);
  };

  const resetTaskForm = () => {
    setTaskForm({
      patient: '',
      room: '',
      task: '',
      due: '',
      priority: 'medium'
    });
    setEditingTaskId(null);
  };

  const handleEditTask = (task) => {
    setTaskForm({
      patient: task.patient,
      room: task.room,
      task: task.task,
      due: task.due,
      priority: task.priority
    });
    setEditingTaskId(task.id);
    setShowTaskForm(true);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Stable': { label: 'Stable', color: 'bg-green-100 text-green-800' },
      'Critical': { label: 'Critical', color: 'bg-red-100 text-red-800' },
      'Improving': { label: 'Improving', color: 'bg-blue-100 text-blue-800' },
      'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
      'completed': { label: 'Completed', color: 'bg-green-100 text-green-800' },
      'Normal': { label: 'Normal', color: 'bg-green-100 text-green-800' },
      'Abnormal': { label: 'Abnormal', color: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'critical': { label: 'Critical', color: 'bg-red-100 text-red-800' },
      'high': { label: 'High', color: 'bg-orange-100 text-orange-800' },
      'medium': { label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
      'low': { label: 'Low', color: 'bg-blue-100 text-blue-800' }
    };
    return priorityMap[priority] || { label: priority, color: 'bg-gray-100 text-gray-800' };
  };

  const quickActions = [
    { icon: Users, label: 'My Patients', action: '/patients', color: 'bg-blue-500' },
    { icon: Activity, label: 'Vital Signs', action: '/vital-signs', color: 'bg-green-500' },
    { icon: Pill, label: 'Medications', action: '/pharmacy', color: 'bg-purple-500' },
    { icon: Bed, label: 'Bed Status', action: '/bed-allocation', color: 'bg-orange-500' },
    { icon: Heart, label: 'Admissions', action: '/admissions', color: 'bg-red-500' },
    { icon: Stethoscope, label: 'Ward Rounds', action: '/ward-rounds', color: 'bg-pink-500' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: Clipboard },
    { id: 'vitals', label: 'Vital Signs', icon: Activity },
  ];

  // Render tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'patients':
        return renderPatientsContent();
      case 'tasks':
        return renderTasksContent();
      case 'vitals':
        return renderVitalsContent();
      default:
        return renderOverviewContent();
    }
  };

  const renderOverviewContent = () => {
    return (
      <>
        {/* Critical Alerts */}
        {alerts.filter(a => a.type === 'critical' && !a.read).length > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Critical Patient Alert</h3>
                  <p className="text-sm text-red-700">
                    {alerts.filter(a => a.type === 'critical' && !a.read).length} critical alert(s) require your attention
                  </p>
                </div>
              </div>
              <ButtonWithTooltip
                onClick={() => alerts.filter(a => a.type === 'critical').forEach(a => handleMarkAlertRead(a.id))}
                tooltip="Mark all alerts as read"
                variant="secondary"
              >
                Mark All Read
              </ButtonWithTooltip>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Tooltip text="Total patients assigned to you">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Assigned Patients</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.assignedPatients}</p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Vital signs checks due">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Vitals Due</p>
                  <p className="mt-1 text-2xl font-bold text-green-600">{stats.vitalsDue}</p>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Medication administration due">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Medications Due</p>
                  <p className="mt-1 text-2xl font-bold text-purple-600">{stats.medicationsDue}</p>
                </div>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Bed checks due">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Bed Checks</p>
                  <p className="mt-1 text-2xl font-bold text-orange-600">{stats.bedChecks}</p>
                </div>
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Bed className="w-5 h-5 text-orange-600" />
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

        {/* Recent Alerts */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Alerts</h2>
            <div className="flex items-center gap-2">
              <ButtonWithTooltip
                onClick={() => setAlerts(prev => prev.map(a => ({ ...a, read: true })))}
                tooltip="Mark all alerts as read"
                variant="secondary"
                className="text-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Mark All Read
              </ButtonWithTooltip>
            </div>
          </div>
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No alerts</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className={`flex items-center justify-between rounded-lg p-3 ${
                  alert.type === 'critical' ? 'border-l-4 border-red-500 bg-red-50' :
                  alert.type === 'warning' ? 'border-l-4 border-yellow-500 bg-yellow-50' :
                  'border-l-4 border-blue-500 bg-blue-50'
                } ${alert.read ? 'opacity-60' : ''}`}>
                  <div className="flex items-center flex-1">
                    <AlertCircle className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      alert.type === 'critical' ? 'text-red-500' :
                      alert.type === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!alert.read && (
                      <IconButton
                        icon={CheckCircle}
                        onClick={() => handleMarkAlertRead(alert.id)}
                        tooltip="Mark as read"
                        variant="success"
                      />
                    )}
                    <IconButton
                      icon={X}
                      onClick={() => handleDismissAlert(alert.id)}
                      tooltip="Dismiss alert"
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

  const renderPatientsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Assigned Patients</h2>
          <ButtonWithTooltip
            tooltip="Refresh patient list"
            variant="secondary"
            onClick={() => setAssignedPatients([...assignedPatients])}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </ButtonWithTooltip>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Check</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vitals</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assignedPatients.map((patient) => {
                const status = getStatusBadge(patient.status);
                const vitalsStatus = getStatusBadge(patient.vitals);
                return (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">Room {patient.room}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{patient.nextCheck}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${vitalsStatus.color}`}>
                        {vitalsStatus.label}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <IconButton
                          icon={Eye}
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          tooltip="View patient"
                          variant="primary"
                        />
                        <IconButton
                          icon={Activity}
                          onClick={() => navigate(`/vital-signs/${patient.id}`)}
                          tooltip="Record vitals"
                          variant="success"
                        />
                        <IconButton
                          icon={Pill}
                          onClick={() => navigate(`/pharmacy/${patient.id}`)}
                          tooltip="View medications"
                          variant="info"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTasksContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Today's Tasks</h2>
          <ButtonWithTooltip
            onClick={() => setShowTaskForm(true)}
            tooltip="Add new task"
            variant="primary"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </ButtonWithTooltip>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                {editingTaskId ? 'Edit Task' : 'New Task'}
              </h3>
              <IconButton
                icon={X}
                onClick={() => {
                  setShowTaskForm(false);
                  resetTaskForm();
                }}
                tooltip="Close form"
                variant="default"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Patient</label>
                <input
                  type="text"
                  value={taskForm.patient}
                  onChange={(e) => setTaskForm({...taskForm, patient: e.target.value})}
                  placeholder="Patient name"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Room</label>
                <input
                  type="text"
                  value={taskForm.room}
                  onChange={(e) => setTaskForm({...taskForm, room: e.target.value})}
                  placeholder="Room number"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Task</label>
                <input
                  type="text"
                  value={taskForm.task}
                  onChange={(e) => setTaskForm({...taskForm, task: e.target.value})}
                  placeholder="Task description"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Due Time</label>
                <input
                  type="time"
                  value={taskForm.due}
                  onChange={(e) => setTaskForm({...taskForm, due: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Priority</label>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <ButtonWithTooltip
                onClick={() => {
                  setShowTaskForm(false);
                  resetTaskForm();
                }}
                tooltip="Cancel and close"
                variant="secondary"
              >
                Cancel
              </ButtonWithTooltip>
              <ButtonWithTooltip
                onClick={handleSaveTask}
                tooltip="Save task"
                variant="primary"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Save Task
              </ButtonWithTooltip>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => {
                const status = getStatusBadge(task.status);
                const priority = getPriorityBadge(task.priority);
                return (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <span className="text-sm font-medium text-gray-900">{task.patient}</span>
                      <span className="text-xs text-gray-500 ml-2">Room {task.room}</span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{task.task}</td>
                    <td className="py-3 text-sm text-gray-600">{task.due}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${priority.color}`}>
                        {priority.label}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        {task.status === 'pending' && (
                          <IconButton
                            icon={Play}
                            onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                            tooltip="Start task"
                            variant="success"
                          />
                        )}
                        {task.status === 'in-progress' && (
                          <IconButton
                            icon={CheckCircle}
                            onClick={() => handleTaskStatusChange(task.id, 'completed')}
                            tooltip="Complete task"
                            variant="success"
                          />
                        )}
                        <IconButton
                          icon={Edit}
                          onClick={() => handleEditTask(task)}
                          tooltip="Edit task"
                          variant="primary"
                        />
                        <IconButton
                          icon={Trash2}
                          onClick={() => handleDeleteTask(task.id)}
                          tooltip="Delete task"
                          variant="danger"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderVitalsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Vital Signs Records</h2>
          <ButtonWithTooltip
            tooltip="Record new vitals"
            variant="primary"
            onClick={() => navigate('/vital-signs/new')}
          >
            <Plus className="w-3.5 h-3.5" />
            Record Vitals
          </ButtonWithTooltip>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HR</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SpO₂</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recorded</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vitalSigns.map((vital) => (
                <tr key={vital.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <span className="text-sm font-medium text-gray-900">{vital.patient}</span>
                    <span className="text-xs text-gray-500 ml-2">Room {vital.room}</span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{vital.bp}</td>
                  <td className="py-3 text-sm text-gray-600">{vital.hr}</td>
                  <td className="py-3 text-sm text-gray-600">{vital.temp}°C</td>
                  <td className="py-3 text-sm text-gray-600">{vital.spO2}%</td>
                  <td className="py-3 text-sm text-gray-600">{vital.recorded}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <IconButton
                        icon={Eye}
                        onClick={() => navigate(`/vital-signs/${vital.id}`)}
                        tooltip="View details"
                        variant="primary"
                      />
                      <IconButton
                        icon={Edit}
                        onClick={() => navigate(`/vital-signs/${vital.id}/edit`)}
                        tooltip="Edit vitals"
                        variant="primary"
                      />
                    </div>
                  </td>
                </tr>
              ))}
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
              {alerts.filter(a => !a.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {alerts.filter(a => !a.read).length}
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

export default NurseDashboard;