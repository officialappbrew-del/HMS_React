import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Activity,
  AlertCircle,
  Calendar,
  FileText,
  Heart,
  Clock,
  Eye,
  PlusCircle,
  CheckCircle2,
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
  TrendingUp,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus
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

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { wardRounds } = useSelector(state => state.wardRound || { wardRounds: [] });
  const { admissions } = useSelector(state => state.admission || { admissions: [] });

  const [activeTab, setActiveTab] = useState('overview');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const itemsPerPage = 10;

  const [stats, setStats] = useState({
    myPatients: 0,
    todaysRounds: 0,
    pendingReviews: 0,
    criticalPatients: 0,
  });

  const [consultationForm, setConsultationForm] = useState({
    patientId: '',
    patientName: '',
    temperature: '',
    weight: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    presentingComplaints: '',
    medicalHistory: '',
    drugPrescription: ''
  });

  const [savedConsultation, setSavedConsultation] = useState(null);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [editingConsultationId, setEditingConsultationId] = useState(null);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', message: 'Patient John Doe - Critical vitals', time: '5 min ago', read: false },
    { id: 2, type: 'warning', message: 'Ward round overdue - Room 203', time: '15 min ago', read: false },
    { id: 3, type: 'info', message: 'New lab results available', time: '1 hour ago', read: false }
  ]);

  const [todaysSchedule] = useState([
    { id: 1, time: '09:00', patient: 'John Doe', type: 'Consultation', status: 'completed' },
    { id: 2, time: '10:30', patient: 'Jane Smith', type: 'Follow-up', status: 'in-progress' },
    { id: 3, time: '14:00', patient: 'Bob Johnson', type: 'Ward Round', status: 'scheduled' },
    { id: 4, time: '15:30', patient: 'Alice Brown', type: 'Surgery Review', status: 'scheduled' }
  ]);

  const [consultations, setConsultations] = useState([
    { id: 1, patient: 'John Doe', date: '2024-01-15', diagnosis: 'Malaria', status: 'completed' },
    { id: 2, patient: 'Jane Smith', date: '2024-01-14', diagnosis: 'Hypertension', status: 'pending' },
    { id: 3, patient: 'Bob Johnson', date: '2024-01-13', diagnosis: 'Diabetes Type 2', status: 'in-progress' }
  ]);

  const [recentPatients] = useState([
    { id: 1, name: 'John Doe', condition: 'Malaria', status: 'critical', lastVisit: '2024-01-15' },
    { id: 2, name: 'Jane Smith', condition: 'Hypertension', status: 'stable', lastVisit: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', condition: 'Diabetes Type 2', status: 'monitoring', lastVisit: '2024-01-13' }
  ]);

  useEffect(() => {
    setStats({
      myPatients: patients.length || 12,
      todaysRounds: wardRounds.filter(r => r.status === 'Scheduled').length || 4,
      pendingReviews: 5,
      criticalPatients: alerts.filter(a => a.type === 'critical').length,
    });
  }, [patients, wardRounds, alerts]);

  useEffect(() => {
    if (patients.length > 0 && !consultationForm.patientId) {
      const firstPatient = patients[0];
      setConsultationForm(prev => ({
        ...prev,
        patientId: firstPatient.patientId || firstPatient.id || '',
        patientName: firstPatient.name || 'Selected Patient'
      }));
    }
  }, [patients, consultationForm.patientId]);

  const handleConsultationChange = (field, value) => {
    setConsultationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveConsultation = () => {
    if (!consultationForm.patientName || !consultationForm.presentingComplaints) {
      alert('Please fill in patient name and presenting complaints');
      return;
    }

    const newConsultation = {
      ...consultationForm,
      id: Date.now(),
      savedAt: new Date().toLocaleString(),
      status: 'completed'
    };

    setSavedConsultation(newConsultation);
    setConsultations(prev => [newConsultation, ...prev]);
    setShowConsultationForm(false);
    resetConsultationForm();
  };

  const resetConsultationForm = () => {
    setConsultationForm({
      patientId: '',
      patientName: '',
      temperature: '',
      weight: '',
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      presentingComplaints: '',
      medicalHistory: '',
      drugPrescription: ''
    });
    setEditingConsultationId(null);
  };

  const handleEditConsultation = (consultation) => {
    setConsultationForm({
      patientId: consultation.patientId || '',
      patientName: consultation.patient,
      temperature: consultation.temperature || '',
      weight: consultation.weight || '',
      bloodPressure: consultation.bloodPressure || '',
      heartRate: consultation.heartRate || '',
      respiratoryRate: consultation.respiratoryRate || '',
      oxygenSaturation: consultation.oxygenSaturation || '',
      presentingComplaints: consultation.presentingComplaints || '',
      medicalHistory: consultation.medicalHistory || '',
      drugPrescription: consultation.drugPrescription || ''
    });
    setEditingConsultationId(consultation.id);
    setShowConsultationForm(true);
  };

  const handleDeleteConsultation = (id) => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      setConsultations(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleMarkAlertRead = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleDismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const quickActions = [
    { icon: Users, label: 'My Patients', action: '/patients', color: 'bg-blue-500' },
    { icon: Stethoscope, label: 'Ward Rounds', action: '/ward-rounds', color: 'bg-green-500' },
    { icon: Activity, label: 'Vital Signs', action: '/vital-signs', color: 'bg-purple-500' },
    { icon: FileText, label: 'EMR', action: '/emr', color: 'bg-orange-500' },
    { icon: Calendar, label: 'Schedule', action: '/appointments', color: 'bg-red-500' },
    { icon: Heart, label: 'Admissions', action: '/admissions', color: 'bg-pink-500' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'consultations', label: 'Consultations', icon: Clipboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      'completed': { label: 'Completed', color: 'bg-green-100 text-green-800' },
      'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
      'scheduled': { label: 'Scheduled', color: 'bg-gray-100 text-gray-800' },
      'critical': { label: 'Critical', color: 'bg-red-100 text-red-800' },
      'stable': { label: 'Stable', color: 'bg-green-100 text-green-800' },
      'monitoring': { label: 'Monitoring', color: 'bg-blue-100 text-blue-800' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  // Render tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'consultations':
        return renderConsultationsContent();
      case 'patients':
        return renderPatientsContent();
      case 'schedule':
        return renderScheduleContent();
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
                  <h3 className="text-sm font-semibold text-red-800">Critical Patient Alerts</h3>
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
          <Tooltip text="Total patients under your care">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">My Patients</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.myPatients}</p>
                  <div className="mt-1 flex items-center text-xs text-blue-600">
                    <Users className="mr-1 h-3 w-3" />
                    <span>Active cases</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Today's scheduled ward rounds">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Today's Rounds</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stats.todaysRounds}</p>
                  <div className="mt-1 flex items-center text-xs text-green-600">
                    <Stethoscope className="mr-1 h-3 w-3" />
                    <span>Scheduled</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Consultations awaiting your review">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Pending Reviews</p>
                  <p className="mt-1 text-2xl font-bold text-orange-600">{stats.pendingReviews}</p>
                  <div className="mt-1 flex items-center text-xs text-orange-600">
                    <FileText className="mr-1 h-3 w-3" />
                    <span>Requires attention</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
          </Tooltip>

          <Tooltip text="Patients in critical condition">
            <div className="cursor-help rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Critical Patients</p>
                  <p className="mt-1 text-2xl font-bold text-red-600">{stats.criticalPatients}</p>
                  <div className="mt-1 flex items-center text-xs text-red-600">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    <span>Monitor closely</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
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

        {/* Clinical Alerts */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Clinical Alerts</h2>
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

  const renderConsultationsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Consultations</h2>
          <ButtonWithTooltip
            onClick={() => setShowConsultationForm(true)}
            tooltip="Start new consultation"
            variant="primary"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            New Consultation
          </ButtonWithTooltip>
        </div>

        {/* Consultation Form */}
        {showConsultationForm && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                {editingConsultationId ? 'Edit Consultation' : 'New Consultation'}
              </h3>
              <IconButton
                icon={X}
                onClick={() => {
                  setShowConsultationForm(false);
                  resetConsultationForm();
                }}
                tooltip="Close form"
                variant="default"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Patient</label>
                <select
                  value={consultationForm.patientId}
                  onChange={(e) => {
                    const selectedPatient = patients.find(patient =>
                      (patient.patientId || patient.id) === e.target.value
                    );
                    handleConsultationChange('patientId', e.target.value);
                    handleConsultationChange('patientName', selectedPatient?.name || '');
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                >
                  {patients.length === 0 ? (
                    <option value="">No patients available</option>
                  ) : (
                    patients.map((patient) => (
                      <option key={patient.patientId || patient.id} value={patient.patientId || patient.id}>
                        {patient.name || 'Unnamed Patient'}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Doctor</label>
                <input
                  value="Dr. James Okafor"
                  readOnly
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Temp (°C)', field: 'temperature', placeholder: '36.8' },
                { label: 'Weight (kg)', field: 'weight', placeholder: '72' },
                { label: 'BP (mmHg)', field: 'bloodPressure', placeholder: '120/80' },
                { label: 'HR (bpm)', field: 'heartRate', placeholder: '76' },
                { label: 'RR (bpm)', field: 'respiratoryRate', placeholder: '18' },
                { label: 'SpO₂ (%)', field: 'oxygenSaturation', placeholder: '98' }
              ].map((item) => (
                <div key={item.field}>
                  <label className="mb-1 block text-xs font-medium text-gray-700">{item.label}</label>
                  <input
                    value={consultationForm[item.field]}
                    onChange={(e) => handleConsultationChange(item.field, e.target.value)}
                    placeholder={item.placeholder}
                    className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Presenting Complaints</label>
                <textarea
                  rows="2"
                  value={consultationForm.presentingComplaints}
                  onChange={(e) => handleConsultationChange('presentingComplaints', e.target.value)}
                  placeholder="Describe the patient's complaints..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Medical History</label>
                <textarea
                  rows="2"
                  value={consultationForm.medicalHistory}
                  onChange={(e) => handleConsultationChange('medicalHistory', e.target.value)}
                  placeholder="Past illnesses, surgeries, allergies, medications..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Drug Prescription</label>
                <textarea
                  rows="2"
                  value={consultationForm.drugPrescription}
                  onChange={(e) => handleConsultationChange('drugPrescription', e.target.value)}
                  placeholder="Medication name, dosage, route, duration..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <ButtonWithTooltip
                onClick={() => {
                  setShowConsultationForm(false);
                  resetConsultationForm();
                }}
                tooltip="Cancel and close form"
                variant="secondary"
              >
                Cancel
              </ButtonWithTooltip>
              <ButtonWithTooltip
                onClick={handleSaveConsultation}
                tooltip="Save consultation record"
                variant="primary"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Save Consultation
              </ButtonWithTooltip>
            </div>
          </div>
        )}

        {/* Consultations List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {consultations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    <Clipboard className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    No consultations yet
                  </td>
                </tr>
              ) : (
                consultations.map((consultation) => {
                  const status = getStatusBadge(consultation.status);
                  return (
                    <tr key={consultation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <span className="text-sm font-medium text-gray-900">{consultation.patient}</span>
                      </td>
                      <td className="py-3 text-sm text-gray-600">{consultation.date}</td>
                      <td className="py-3 text-sm text-gray-600">{consultation.diagnosis}</td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <IconButton
                            icon={Eye}
                            onClick={() => handleEditConsultation(consultation)}
                            tooltip="View consultation"
                            variant="primary"
                          />
                          <IconButton
                            icon={Edit}
                            onClick={() => handleEditConsultation(consultation)}
                            tooltip="Edit consultation"
                            variant="primary"
                          />
                          <IconButton
                            icon={Trash2}
                            onClick={() => handleDeleteConsultation(consultation.id)}
                            tooltip="Delete consultation"
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

  const renderPatientsContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">My Patients</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Add new patient"
              variant="primary"
              onClick={() => navigate('/patients/add')}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add Patient
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentPatients.map((patient) => {
                const status = getStatusBadge(patient.status);
                return (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <span className="text-sm font-medium text-gray-900">{patient.name}</span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{patient.condition}</td>
                    <td className="py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{patient.lastVisit}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <IconButton
                          icon={Eye}
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          tooltip="View patient"
                          variant="primary"
                        />
                        <IconButton
                          icon={Stethoscope}
                          onClick={() => navigate(`/patients/${patient.id}/consult`)}
                          tooltip="Consult patient"
                          variant="success"
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

  const renderScheduleContent = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Today's Schedule</h2>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="View full schedule"
              variant="secondary"
              onClick={() => navigate('/appointments')}
            >
              <Calendar className="w-3.5 h-3.5" />
              Full Schedule
            </ButtonWithTooltip>
          </div>
        </div>

        <div className="space-y-3">
          {todaysSchedule.map((item) => (
            <div key={item.id} className="flex items-center rounded-lg bg-gray-50 p-3 hover:bg-gray-100 transition-colors">
              <Clock className="mr-3 h-5 w-5 text-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.time} - {item.patient}</p>
                <p className="text-xs text-gray-500">{item.type}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-xs ${
                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status === 'in-progress' ? 'In Progress' : 
                 item.status === 'completed' ? 'Completed' : 'Scheduled'}
              </span>
            </div>
          ))}
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
            <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
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

export default DoctorDashboard;