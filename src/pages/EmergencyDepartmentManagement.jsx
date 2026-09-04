import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Clock,
  Users,
  Activity,
  Plus,
  Search,
  Filter,
  User,
  Stethoscope,
  Bed,
  CheckCircle,
  XCircle,
  Timer,
  Zap,
  Heart,
  Brain,
  Ambulance,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUp,
  ArrowDown,
  Info,
  Building2,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Download,
  UserPlus,
  Calendar
} from 'lucide-react';
import {
  fetchEmergencyData,
  registerEmergencyCase,
  triageEmergencyCase,
  assignEmergencyBay,
  updateEmergencyCaseStatus,
  searchED,
  sortED,
  filterED
} from '../features/edSlice';

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
    red: 'bg-[#C8553D]',
    blue: 'bg-[#2C6B8A]',
    purple: 'bg-[#6B4C9A]',
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

// ==================== REGISTER PATIENT MODAL ====================
const RegisterPatientModal = ({ isOpen, onClose, patientForm, setPatientForm, onSubmit, isSubmitting }) => {
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
                  <Ambulance className="w-5 h-5 text-[#C8553D]" />
                  Register Emergency Patient
                </h2>
                <p className="text-sm text-[#5A5A5A] mt-0.5">Add new patient to emergency department</p>
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
                  value={patientForm.name}
                  onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  placeholder="Enter patient name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Age *</label>
                  <input
                    type="number"
                    value={patientForm.age}
                    onChange={(e) => setPatientForm({...patientForm, age: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Age"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Gender *</label>
                  <select
                    value={patientForm.gender}
                    onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Presenting Complaint *</label>
                <textarea
                  value={patientForm.presentingComplaint}
                  onChange={(e) => setPatientForm({...patientForm, presentingComplaint: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  placeholder="Brief description of symptoms or injury"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Mode of Arrival</label>
                <select
                  value={patientForm.modeOfArrival}
                  onChange={(e) => setPatientForm({...patientForm, modeOfArrival: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  disabled={isSubmitting}
                >
                  <option value="Walk-in">Walk-in</option>
                  <option value="Ambulance">Ambulance</option>
                  <option value="Police">Police</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>

              <div className="border-t border-[#E8E3DC] pt-4 flex flex-wrap justify-end gap-2">
                <ButtonWithTooltip
                  type="button"
                  onClick={onClose}
                  tooltip="Cancel registration"
                  variant="secondary"
                  disabled={isSubmitting}
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  type="submit"
                  tooltip="Register patient"
                  variant="danger"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      Register Patient
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

// ==================== TRIAGE MODAL ====================
const TriageModal = ({ isOpen, onClose, triageForm, setTriageForm, onSubmit, patient, isSubmitting }) => {
  if (!isOpen || !patient) return null;

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
                  <AlertTriangle className="w-5 h-5 text-[#C8553D]" />
                  Triage Assessment
                </h2>
                <p className="text-sm text-[#5A5A5A] mt-0.5">
                  {patient.name} · {patient.presentingComplaint}
                </p>
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
            <div className="mb-4 p-3 bg-[#E8F5EF] border border-[#C8E0D5] rounded">
              <h4 className="text-xs font-medium text-[#008751] uppercase tracking-wider mb-1">South African Triage Scale (SATS)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 text-xs">
                <span className="bg-[#F5EDEA] text-[#C8553D] px-2 py-0.5 text-center rounded">Red</span>
                <span className="bg-[#F5F0EA] text-[#C87D3D] px-2 py-0.5 text-center rounded">Orange</span>
                <span className="bg-[#F5F0EA] text-[#C87D3D] px-2 py-0.5 text-center rounded">Yellow</span>
                <span className="bg-[#EAF3EE] text-[#2D7D46] px-2 py-0.5 text-center rounded">Green</span>
                <span className="bg-[#F0EDE8] text-[#5A5A5A] px-2 py-0.5 text-center rounded">Blue</span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Respiratory Rate (/min) *</label>
                  <input
                    type="number"
                    value={triageForm.respiratoryRate}
                    onChange={(e) => setTriageForm({...triageForm, respiratoryRate: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="e.g. 16"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Oxygen Saturation (%) *</label>
                  <input
                    type="number"
                    value={triageForm.oxygenSaturation}
                    onChange={(e) => setTriageForm({...triageForm, oxygenSaturation: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="e.g. 98"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Temperature (°C) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={triageForm.temperature}
                    onChange={(e) => setTriageForm({...triageForm, temperature: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="e.g. 37.0"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Heart Rate (bpm) *</label>
                  <input
                    type="number"
                    value={triageForm.heartRate}
                    onChange={(e) => setTriageForm({...triageForm, heartRate: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="e.g. 72"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Blood Pressure (mmHg) *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Systolic"
                      value={triageForm.bloodPressureSystolic}
                      onChange={(e) => setTriageForm({...triageForm, bloodPressureSystolic: e.target.value})}
                      className="flex-1 px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                      disabled={isSubmitting}
                    />
                    <span className="flex items-center text-[#5A5A5A] font-medium">/</span>
                    <input
                      type="number"
                      placeholder="Diastolic"
                      value={triageForm.bloodPressureDiastolic}
                      onChange={(e) => setTriageForm({...triageForm, bloodPressureDiastolic: e.target.value})}
                      className="flex-1 px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Level of Consciousness</label>
                  <select
                    value={triageForm.consciousness}
                    onChange={(e) => setTriageForm({...triageForm, consciousness: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  >
                    <option value="Alert">Alert</option>
                    <option value="Voice">Responds to Voice</option>
                    <option value="Pain">Responds to Pain</option>
                    <option value="Unresponsive">Unresponsive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Pain Score (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={triageForm.painScore}
                    onChange={(e) => setTriageForm({...triageForm, painScore: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="e.g. 4"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Mobility</label>
                  <select
                    value={triageForm.mobility}
                    onChange={(e) => setTriageForm({...triageForm, mobility: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    disabled={isSubmitting}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Limping">Limping</option>
                    <option value="Unable to walk">Unable to walk</option>
                    <option value="Carried">Carried</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[#E8E3DC] pt-4 flex flex-wrap justify-end gap-2">
                <ButtonWithTooltip
                  type="button"
                  onClick={onClose}
                  tooltip="Cancel triage"
                  variant="secondary"
                  disabled={isSubmitting}
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  type="submit"
                  tooltip="Complete triage assessment"
                  variant="danger"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Complete Triage
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

// ==================== MAIN EMERGENCY DEPARTMENT COMPONENT ====================
const EmergencyDepartmentManagement = () => {
  const dispatch = useDispatch();
  const {
    patients,
    triageQueue,
    treatmentBays,
    waitingRoom,
    dischargeLounge,
    stats,
    searchTerm,
    sortBy,
    filterBy,
    loading
  } = useSelector(state => state.ed);

  const [activeTab, setActiveTab] = useState('overview');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;

  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: '',
    presentingComplaint: '',
    modeOfArrival: 'Walk-in',
    triageScore: 0
  });

  const [triageForm, setTriageForm] = useState({
    respiratoryRate: '',
    oxygenSaturation: '',
    temperature: '',
    heartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    consciousness: 'Alert',
    painScore: '',
    mobility: 'Normal'
  });

  // Calculate wait times periodically
  useEffect(() => {
    dispatch(fetchEmergencyData());
  }, [dispatch]);

  // Filter and search logic
  const filteredPatients = patients
    .filter(patient => {
      const matchesSearch = !searchTerm ||
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.presentingComplaint?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || patient.status === filterBy || patient.triageColor === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'arrival_time') return new Date(b.arrivalTime) - new Date(a.arrivalTime);
      if (sortBy === 'triage_priority') {
        const colorPriority = { red: 5, orange: 4, yellow: 3, green: 2, blue: 1 };
        return (colorPriority[b.triageColor] || 0) - (colorPriority[a.triageColor] || 0);
      }
      if (sortBy === 'name') return a.name?.localeCompare(b.name || '') || 0;
      return 0;
    });

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(registerEmergencyCase({
        name: patientForm.name,
        age: Number(patientForm.age) || 0,
        gender: patientForm.gender,
        presentingComplaint: patientForm.presentingComplaint,
        modeOfArrival: patientForm.modeOfArrival,
      })).unwrap();
      setPatientForm({
        name: '',
        age: '',
        gender: '',
        presentingComplaint: '',
        modeOfArrival: 'Walk-in',
        triageScore: 0
      });
      setShowPatientModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTriageScore = (formData) => {
    let score = 0;
    let color = 'green';

    const rr = parseInt(formData.respiratoryRate);
    if (rr <= 8 || rr >= 25) { score += 3; color = 'red'; }
    else if (rr >= 21 && rr <= 24) { score += 2; if (color === 'green') color = 'orange'; }
    else if (rr >= 9 && rr <= 11) { score += 1; if (color === 'green') color = 'yellow'; }

    const spo2 = parseInt(formData.oxygenSaturation);
    if (spo2 <= 91) { score += 3; color = 'red'; }
    else if (spo2 >= 92 && spo2 <= 93) { score += 2; if (color === 'green') color = 'orange'; }
    else if (spo2 >= 94 && spo2 <= 95) { score += 1; if (color === 'green') color = 'yellow'; }

    const temp = parseFloat(formData.temperature);
    if (temp <= 35.0) { score += 3; color = 'red'; }
    else if (temp >= 39.1) { score += 2; if (color === 'green') color = 'orange'; }
    else if (temp >= 38.1 && temp <= 39.0) { score += 1; if (color === 'green') color = 'yellow'; }

    const systolic = parseInt(formData.bloodPressureSystolic);
    if (systolic <= 90 || systolic >= 220) { score += 3; color = 'red'; }
    else if (systolic >= 101 && systolic <= 110) { score += 2; if (color === 'green') color = 'orange'; }
    else if (systolic >= 111 && systolic <= 219) { score += 1; if (color === 'green') color = 'yellow'; }

    const hr = parseInt(formData.heartRate);
    if (hr <= 40 || hr >= 131) { score += 3; color = 'red'; }
    else if (hr >= 111 && hr <= 130) { score += 2; if (color === 'green') color = 'orange'; }
    else if ((hr >= 41 && hr <= 50) || (hr >= 91 && hr <= 110)) { score += 1; if (color === 'green') color = 'yellow'; }

    if (formData.consciousness !== 'Alert') { score += 3; color = 'red'; }

    return { score, color };
  };

  const handleTriage = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setIsSubmitting(true);
    try {
      const triageResult = calculateTriageScore(triageForm);
      await dispatch(triageEmergencyCase({
        patientId: selectedPatient.id,
        triageData: triageResult
      })).unwrap();
      setTriageForm({
        respiratoryRate: '',
        oxygenSaturation: '',
        temperature: '',
        heartRate: '',
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        consciousness: 'Alert',
        painScore: '',
        mobility: 'Normal'
      });
      setShowTriageModal(false);
      setSelectedPatient(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignToBay = (patientId, bayId) => {
    dispatch(assignEmergencyBay({
      patientId,
      bayId,
    })).unwrap();
  };

  const handleRefresh = () => {
    dispatch(fetchEmergencyData());
  };

  const getTriageColorClass = (color) => {
    switch (color) {
      case 'red': return 'bg-[#F5EDEA] border-[#E8D6D0] text-[#C8553D]';
      case 'orange': return 'bg-[#F5F0EA] border-[#F0E8DC] text-[#C87D3D]';
      case 'yellow': return 'bg-[#F5F0EA] border-[#F0E8DC] text-[#C87D3D]';
      case 'green': return 'bg-[#EAF3EE] border-[#D0E3D8] text-[#2D7D46]';
      case 'blue': return 'bg-[#E8F5EF] border-[#C8E0D5] text-[#008751]';
      default: return 'bg-[#F0EDE8] border-[#E8E3DC] text-[#5A5A5A]';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting_triage': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      case 'triaged': return 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]';
      case 'in_treatment': return 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]';
      case 'discharged': return 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]';
      case 'admitted': return 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]';
      default: return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'triage', label: 'Triage Queue', icon: AlertTriangle },
    { id: 'treatment', label: 'Treatment Bays', icon: Bed },
    { id: 'patients', label: 'All Patients', icon: Users }
  ];

  return (
    <div className="dashboard min-h-screen bg-[#F7F5F2] p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F5EDEA] rounded-full flex items-center justify-center flex-shrink-0">
              <Ambulance className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8553D]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight truncate">
                Emergency Department
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A] truncate">
                Triage, treatment, and patient flow management
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
              onClick={() => setShowPatientModal(true)}
              tooltip="Register new patient"
              variant="danger"
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Register</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
        <StatsCard
          title="Total Patients"
          value={stats.totalPatients || 0}
          subValue="Today's census"
          icon={Users}
          color="red"
          trend="up"
          trendValue="+12% from yesterday"
          tooltip="Total patients currently in ED"
        />
        <StatsCard
          title="Waiting"
          value={stats.waitingPatients || 0}
          subValue="Awaiting triage"
          icon={Clock}
          color="warm"
          trend={stats.waitingPatients > 5 ? 'up' : 'neutral'}
          trendValue={stats.waitingPatients > 5 ? 'High volume' : 'Normal flow'}
          tooltip="Patients waiting for triage"
        />
        <StatsCard
          title="In Treatment"
          value={stats.inTreatment || 0}
          subValue="Active cases"
          icon={Stethoscope}
          color="blue"
          trend="up"
          trendValue="80% bay occupancy"
          tooltip="Patients currently being treated"
        />
        <StatsCard
          title="Avg Wait Time"
          value={`${Math.round(stats.averageWaitTime || 0)}min`}
          subValue="From arrival to triage"
          icon={Timer}
          color="green"
          trend={stats.averageWaitTime > 30 ? 'down' : 'up'}
          trendValue={stats.averageWaitTime > 30 ? 'Above target' : 'On track'}
          tooltip="Average waiting time"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-[#E8E3DC] mb-3 sm:mb-6 lg:mb-8 overflow-x-auto bg-white">
        <nav className="flex gap-2 sm:gap-4 lg:gap-6 min-w-max px-4" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const counts = {
              triage: triageQueue.length
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
                  {tab.id === 'triage' && counts.triage > 0 && (
                    <span className="w-4 h-4 sm:w-5 sm:h-5 bg-[#C8553D] text-white text-[10px] flex items-center justify-center rounded-full">
                      {counts.triage}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Triage Queue */}
            <div>
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#C87D3D]" />
                Triage Queue
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {triageQueue.slice(0, 5).map(patient => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-[#F7F5F2] border border-[#E8E3DC] hover:border-[#008751] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">{patient.name}</p>
                      <p className="text-xs text-[#5A5A5A] truncate">{patient.presentingComplaint}</p>
                    </div>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border flex-shrink-0 ml-2 ${getTriageColorClass(patient.triageColor)}`}>
                      {patient.triageColor?.toUpperCase() || 'Pending'}
                    </span>
                  </div>
                ))}
                {triageQueue.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-8 h-8 text-[#2D7D46] mx-auto mb-2" />
                    <p className="text-[#5A5A5A] text-sm">No patients in triage queue</p>
                    <p className="text-xs text-[#B0A89E]">All patients have been triaged</p>
                  </div>
                )}
              </div>
            </div>

            {/* Treatment Bays */}
            <div>
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                <Bed className="w-4 h-4 text-[#008751]" />
                Treatment Bays
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {treatmentBays.map(bay => {
                  const patient = patients.find(p => p.assignedBay === bay.id);
                  return (
                    <div key={bay.id} className={`p-3 border-2 ${
                      patient 
                        ? 'bg-[#F5EDEA] border-[#E8D6D0]' 
                        : 'bg-[#EAF3EE] border-[#D0E3D8]'
                    } rounded transition-colors`}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-[#1A1A1A]">{bay.name}</p>
                        <span className={`w-2 h-2 rounded-full ${patient ? 'bg-[#C8553D]' : 'bg-[#2D7D46]'}`} />
                      </div>
                      {patient ? (
                        <p className="text-xs text-[#C8553D] truncate mt-0.5">{patient.name}</p>
                      ) : (
                        <p className="text-xs text-[#2D7D46] mt-0.5">Available</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'triage' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Triage Queue</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <ButtonWithTooltip
                  onClick={() => setShowPatientModal(true)}
                  tooltip="Register new patient"
                  variant="danger"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Register Patient
                </ButtonWithTooltip>
              </div>
            </div>

            <div className="space-y-3">
              {/* Waiting Room - Not Yet Triaged */}
              {waitingRoom.length > 0 && (
                <div className="bg-[#F5F0EA] border border-[#F0E8DC] p-3">
                  <h4 className="text-xs font-medium text-[#C87D3D] uppercase tracking-wider mb-2">Waiting for Triage</h4>
                  {waitingRoom.map(patient => (
                    <div key={patient.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-[#F0E8DC] hover:border-[#C87D3D] transition-colors gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A]">{patient.name}</p>
                        <p className="text-xs text-[#5A5A5A]">{patient.presentingComplaint}</p>
                        <p className="text-[10px] text-[#B0A89E]">
                          Arrived: {new Date(patient.arrivalTime).toLocaleTimeString('en-NG')}
                        </p>
                      </div>
                      <ButtonWithTooltip
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowTriageModal(true);
                        }}
                        tooltip="Begin triage assessment"
                        variant="primary"
                        size="sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Triage
                      </ButtonWithTooltip>
                    </div>
                  ))}
                </div>
              )}

              {/* Triage Queue - Already Triaged */}
              {triageQueue.length > 0 && (
                <div className="bg-[#E8F5EF] border border-[#C8E0D5] p-3">
                  <h4 className="text-xs font-medium text-[#008751] uppercase tracking-wider mb-2">Triaged - Awaiting Treatment</h4>
                  {triageQueue.map(patient => (
                    <div key={patient.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-[#C8E0D5] hover:border-[#008751] transition-colors gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A]">{patient.name}</p>
                        <p className="text-xs text-[#5A5A5A]">{patient.presentingComplaint}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getTriageColorClass(patient.triageColor)}`}>
                            {patient.triageColor?.toUpperCase()}
                          </span>
                          <span className="text-xs text-[#5A5A5A]">Score: {patient.triageScore}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          onChange={(e) => handleAssignToBay(patient.id, e.target.value)}
                          className="px-2 py-1 text-xs bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        >
                          <option value="">Assign Bay</option>
                          {treatmentBays.map(bay => (
                            <option key={bay.id} value={bay.id}>{bay.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {waitingRoom.length === 0 && triageQueue.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-[#2D7D46] mx-auto mb-3" />
                  <p className="text-[#5A5A5A]">No patients waiting for triage</p>
                  <p className="text-sm text-[#B0A89E]">All patients have been triaged</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'treatment' && (
          <div>
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Treatment Bays</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {treatmentBays.map(bay => {
                const patient = patients.find(p => p.assignedBay === bay.id);
                return (
                  <div key={bay.id} className={`p-4 border-2 ${
                    patient 
                      ? 'bg-[#F5EDEA] border-[#E8D6D0]' 
                      : 'bg-[#EAF3EE] border-[#D0E3D8]'
                  } rounded transition-colors`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-display font-semibold text-[#1A1A1A]">{bay.name}</h4>
                        <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">{bay.type}</p>
                      </div>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${
                        patient 
                          ? 'bg-[#F5EDEA] border-[#E8D6D0] text-[#C8553D]' 
                          : 'bg-[#EAF3EE] border-[#D0E3D8] text-[#2D7D46]'
                      }`}>
                        {patient ? 'Occupied' : 'Available'}
                      </span>
                    </div>

                    {patient ? (
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">{patient.name}</p>
                        <p className="text-xs text-[#5A5A5A] mb-2">{patient.presentingComplaint}</p>
                        <div className="flex flex-wrap gap-1">
                          <ButtonWithTooltip
                            onClick={() => dispatch(updateEmergencyCaseStatus({ patientId: patient.id, status: 'discharged' }))}
                            tooltip="Discharge patient"
                            variant="success"
                            size="sm"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Discharge
                          </ButtonWithTooltip>
                          <ButtonWithTooltip
                            onClick={() => dispatch(updateEmergencyCaseStatus({ patientId: patient.id, status: 'admitted' }))}
                            tooltip="Admit patient"
                            variant="primary"
                            size="sm"
                          >
                            <User className="w-3 h-3" />
                            Admit
                          </ButtonWithTooltip>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-[#5A5A5A]">No patient assigned</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5A5A5A]" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchED(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterED(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="all">All Patients</option>
                  <option value="waiting_triage">Waiting Triage</option>
                  <option value="triaged">Triaged</option>
                  <option value="in_treatment">In Treatment</option>
                  <option value="discharged">Discharged</option>
                  <option value="admitted">Admitted</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(sortED(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="arrival_time">Arrival Time</option>
                  <option value="triage_priority">Triage Priority</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div className="flex items-end">
                <ButtonWithTooltip
                  onClick={() => setShowPatientModal(true)}
                  tooltip="Register new patient"
                  variant="danger"
                  className="w-full"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Register Patient
                </ButtonWithTooltip>
              </div>
            </div>

            {/* Patients Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#E8E3DC]">
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Triage</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Arrival</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Wait Time</th>
                    <th className="pb-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {paginatedPatients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-[#5A5A5A]">
                        No patients found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    paginatedPatients.map(patient => {
                      const waitTime = patient.arrivalTime 
                        ? Math.round((new Date() - new Date(patient.arrivalTime)) / (1000 * 60))
                        : 0;
                      return (
                        <tr key={patient.id} className="hover:bg-[#F7F5F2] transition-colors">
                          <td className="py-3">
                            <div>
                              <div className="text-sm font-medium text-[#1A1A1A]">{patient.name}</div>
                              <div className="text-xs text-[#5A5A5A] truncate max-w-[150px]">{patient.presentingComplaint}</div>
                            </div>
                          </td>
                          <td className="py-3 hidden sm:table-cell">
                            {patient.triageColor ? (
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getTriageColorClass(patient.triageColor)}`}>
                                {patient.triageColor.toUpperCase()} ({patient.triageScore})
                              </span>
                            ) : (
                              <span className="text-xs text-[#B0A89E]">Not triaged</span>
                            )}
                          </td>
                          <td className="py-3">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${getStatusColor(patient.status)}`}>
                              {patient.status?.replace('_', ' ').toUpperCase() || 'Unknown'}
                            </span>
                          </td>
                          <td className="py-3 hidden md:table-cell">
                            <span className="text-sm text-[#5A5A5A] whitespace-nowrap">
                              {patient.arrivalTime ? new Date(patient.arrivalTime).toLocaleTimeString('en-NG') : 'N/A'}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="text-sm text-[#5A5A5A]">{waitTime} min</span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1 flex-wrap">
                              {patient.status === 'waiting_triage' && (
                                <ButtonWithTooltip
                                  onClick={() => {
                                    setSelectedPatient(patient);
                                    setShowTriageModal(true);
                                  }}
                                  tooltip="Begin triage"
                                  variant="primary"
                                  size="sm"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Triage
                                </ButtonWithTooltip>
                              )}
                              {patient.status === 'triaged' && (
                                <ButtonWithTooltip
                                  onClick={() => dispatch(triageEmergencyCase({ patientId: patient.id, triageData: { score: patient.triageScore, color: patient.triageColor } }))}
                                  tooltip="Activate trauma protocol"
                                  variant="danger"
                                  size="sm"
                                >
                                  <Zap className="w-3.5 h-3.5" />
                                  ATLS
                                </ButtonWithTooltip>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredPatients.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#E8E3DC] gap-2 sm:gap-0">
                <div className="text-[10px] sm:text-xs text-[#5A5A5A] text-center sm:text-left">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length}
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
          </div>
        )}
      </div>

      {/* Register Patient Modal */}
      <RegisterPatientModal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        patientForm={patientForm}
        setPatientForm={setPatientForm}
        onSubmit={handleRegisterPatient}
        isSubmitting={isSubmitting}
      />

      {/* Triage Modal */}
      <TriageModal
        isOpen={showTriageModal}
        onClose={() => {
          setShowTriageModal(false);
          setSelectedPatient(null);
        }}
        triageForm={triageForm}
        setTriageForm={setTriageForm}
        onSubmit={handleTriage}
        patient={selectedPatient}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EmergencyDepartmentManagement;