import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Activity,
  AlertTriangle,
  Plus,
  Search,
  RefreshCw,
  Bell,
  Check,
  Loader2,
  X,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  User,
  Eye
} from 'lucide-react';
import {
  fetchVitalSigns,
  createVitalSign,
  fetchActiveAlerts,
  acknowledgeAlertApi,
  calculateEWS,
  clearError,
} from '../features/vitalSignsSlice';
import { apiRequest, vitalsApi } from '../utils/api';
import Pagination from '../components/Pagination';

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
    blue: 'bg-[#008751]',
    purple: 'bg-[#4A5A5A]',
    red: 'bg-[#C8553D]',
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

// ==================== STATUS BADGE ====================
const StatusBadge = ({ status, type = 'default' }) => {
  const statusMap = {
    'Alert': { label: 'Alert', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Voice': { label: 'Voice', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Pain': { label: 'Pain', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'Unresponsive': { label: 'Unresponsive', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'active': { label: 'Active', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'acknowledged': { label: 'Acknowledged', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'high': { label: 'High', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'medium': { label: 'Medium', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'low': { label: 'Low', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
  };

  const config = statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== VITAL SIGN CARD ====================
const VitalSignCard = ({ row, onView }) => {
  const vs = row.vitalSign;
  const ews = vs?.early_warning_scores?.[0] || null;
  
  const getStatusClass = (value, normalRange) => {
    if (value === undefined || value === null) return 'text-[#5A5A5A]';
    const [min, max] = normalRange;
    return value < min || value > max ? 'text-[#C8553D] font-medium' : 'text-[#1A1A1A]';
  };

  const getPainDisplay = () => {
    if (!vs) return '-';
    const pain = vs.pain_score;
    if (pain === undefined || pain === null) return '-';
    return `${pain}/10`;
  };

  const getEwsRiskColor = (level) => {
    if (!level) return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    if (level === 'high') return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
    if (level === 'medium') return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
    return 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]';
  };

  return (
    <div className="bg-white border border-[#E8E3DC] p-4 hover:bg-[#F7F5F2] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#F5EDEA] border border-[#E8D6D0] flex items-center justify-center">
            <Heart className="w-4 h-4 text-[#C8553D]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-[#1A1A1A]">{row.patientName}</span>
              <span className="text-[10px] text-[#B0A89E]">ID: {row.patientId}</span>
            </div>
            {ews && (
              <span className={`inline-block px-2 py-0.5 text-[10px] font-medium border ${getEwsRiskColor(ews.risk_level)}`}>
                EWS: {ews.total_score ?? '?'} ({ews.risk_level || 'UNKNOWN'})
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#B0A89E]">
            {vs ? new Date(vs.recorded_at).toLocaleString('en-NG') : (row.recorded_at ? new Date(row.recorded_at).toLocaleString('en-NG') : '-')}
          </span>
          <IconButton
            icon={Eye}
            onClick={() => onView(row)}
            tooltip="View details"
            variant="primary"
            size="sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">BP</p>
          <p className={`text-sm font-medium ${getStatusClass(vs?.blood_pressure_systolic, [90, 140])}`}>
            {vs ? `${vs.blood_pressure_systolic || '-'}/${vs.blood_pressure_diastolic || '-'}` : '-'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">HR</p>
          <p className={`text-sm font-medium ${getStatusClass(vs?.pulse, [60, 100])}`}>
            {vs?.pulse ? `${vs.pulse} bpm` : '-'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Temp</p>
          <p className={`text-sm font-medium ${getStatusClass(vs?.temperature, [36.1, 37.5])}`}>
            {vs?.temperature ? `${vs.temperature}°C` : '-'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">SpO2</p>
          <p className={`text-sm font-medium ${getStatusClass(vs?.oxygen_saturation, [95, 100])}`}>
            {vs?.oxygen_saturation ? `${vs.oxygen_saturation}%` : '-'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">RR</p>
          <p className={`text-sm font-medium ${getStatusClass(vs?.respiratory_rate, [12, 20])}`}>
            {vs?.respiratory_rate ? `${vs.respiratory_rate}/min` : '-'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Pain</p>
          <p className={`text-sm font-medium ${getStatusClass(vs?.pain_score, [0, 3])}`}>
            {getPainDisplay()}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==================== ALERT CARD ====================
const AlertCard = ({ alert, onAcknowledge, isAcknowledging }) => {
  const severityColors = {
    critical: 'bg-[#F5EDEA] border-[#E8D6D0] text-[#C8553D]',
    high: 'bg-[#F5F0EA] border-[#F0E8DC] text-[#C87D3D]',
    medium: 'bg-[#F5F0EA] border-[#F0E8DC] text-[#C87D3D]',
    low: 'bg-[#EAF3EE] border-[#D0E3D8] text-[#2D7D46]',
  };

  const severityIcon = {
    critical: <AlertTriangle className="w-4 h-4 text-[#C8553D]" />,
    high: <AlertTriangle className="w-4 h-4 text-[#C87D3D]" />,
    medium: <AlertTriangle className="w-4 h-4 text-[#C87D3D]" />,
    low: <AlertTriangle className="w-4 h-4 text-[#2D7D46]" />,
  };

  const colorClass = severityColors[alert.severity] || severityColors.medium;

  return (
    <div className={`bg-white border p-4 ${colorClass}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{severityIcon[alert.severity]}</div>
          <div>
            <p className="text-sm font-medium text-[#1A1A1A]">{alert.title}</p>
            <p className="text-xs text-[#5A5A5A]">{alert.message}</p>
            <p className="text-[10px] text-[#B0A89E] mt-0.5">
              {new Date(alert.created_at).toLocaleString('en-NG')}
            </p>
          </div>
        </div>
        <ButtonWithTooltip
          onClick={() => onAcknowledge(alert.id)}
          tooltip="Acknowledge alert"
          variant="danger"
          size="sm"
          disabled={isAcknowledging}
        >
          <Check className="w-3.5 h-3.5" />
          Acknowledge
        </ButtonWithTooltip>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const VitalSignsMonitoring = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vitalSigns, alerts, loading, error } = useSelector(state => state.vitalSigns);
  const { patients } = useSelector(state => state.patient || { patients: [] });

  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedPatient, setSelectedPatient] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    respirationRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    bloodGlucose: '',
    painScore: '',
    consciousness: 'Alert',
    notes: '',
    visitId: '',
    chargeAmount: '',
    consultationFee: '',
  });
  const [ewsResult, setEwsResult] = useState(null);
  const [acknowledgingId, setAcknowledgingId] = useState(null);

  const [patientOptions, setPatientOptions] = useState(patients || []);
  const [patientSearchLoading, setPatientSearchLoading] = useState(false);
  const [allPatientsCache, setAllPatientsCache] = useState([]);
  const [globalPatientSearch, setGlobalPatientSearch] = useState('');

  const [medicines, setMedicines] = useState([]);
  const [medicineSearch, setMedicineSearch] = useState('');
  const [medicineSearchLoading, setMedicineSearchLoading] = useState(false);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicineQuantity, setMedicineQuantity] = useState('');
  const [dispensedMedicines, setDispensedMedicines] = useState([]);

  const loadAllPatients = async () => {
    try {
      const data = await apiRequest('/api/v1/patients/patients/?page_size=100');
      const list = Array.isArray(data) ? data : (data.results || []);
      setAllPatientsCache(list);
      setPatientOptions(list);
    } catch {
      setAllPatientsCache(patients || []);
      setPatientOptions(patients || []);
    }
  };

  const searchMedicines = async (query) => {
    if (!query || query.length < 2) {
      setMedicineOptions([]);
      return;
    }
    setMedicineSearchLoading(true);
    try {
      const data = await apiRequest(`/api/v1/pharmacy/drugs/?search=${encodeURIComponent(query)}`);
      const list = Array.isArray(data) ? data : (data.results || []);
      setMedicineOptions(list);
    } catch {
      setMedicineOptions([]);
    } finally {
      setMedicineSearchLoading(false);
    }
  };

  const addMedicine = () => {
    if (!selectedMedicine || !medicineQuantity || Number(medicineQuantity) <= 0) return;
    setDispensedMedicines(prev => [...prev, {
      drug: selectedMedicine,
      quantity: Number(medicineQuantity),
      unit_price: Number(selectedMedicine.unit_price || selectedMedicine.price || 0),
    }]);
    setSelectedMedicine(null);
    setMedicineQuantity('');
    setMedicineSearch('');
    setMedicineOptions([]);
  };

  const removeMedicine = (index) => {
    setDispensedMedicines(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    dispatch(fetchVitalSigns());
    dispatch(fetchActiveAlerts());
    loadAllPatients();
  }, [dispatch]);

  useEffect(() => {
    setPatientOptions(patients);
  }, [patients]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchActiveAlerts());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const getVitalSignForPatient = (patientId) => {
    if (!vitalSigns || !Array.isArray(vitalSigns)) return null;
    return vitalSigns.find(v => String(v.patient) === String(patientId)) || null;
  };

  const getVitalValue = (vs, key, fallback = '-') => {
    if (!vs) return fallback;
    const value = vs[key];
    return value !== undefined && value !== null ? value : fallback;
  };

  const getVitalDisplay = (vs, key, unit = '', fallback = '-') => {
    const value = getVitalValue(vs, key, fallback);
    if (value === fallback) return fallback;
    return `${value}${unit}`;
  };

  const displayRows = useMemo(() => {
    try {
      const searchLower = typeof globalPatientSearch === 'string' ? globalPatientSearch.toLowerCase().trim() : '';
      const filterByVal = typeof filterBy === 'string' ? filterBy : 'all';

      let baseList = Array.isArray(allPatientsCache) ? allPatientsCache : [];
      if (filterByVal !== 'all') {
        baseList = baseList.filter(p => String(p?.id) === String(filterByVal));
      }
      if (searchLower) {
        baseList = baseList.filter(p => {
          const name = (p?.name || `${p?.first_name || ''} ${p?.last_name || ''}`).toLowerCase();
          return (
            name.includes(searchLower) ||
            String(p?.id).includes(searchLower) ||
            (p?.hospital_number && p.hospital_number.toLowerCase().includes(searchLower)) ||
            (p?.phone && p.phone.toLowerCase().includes(searchLower))
          );
        });
      }

      return baseList.map(patient => {
        const vs = getVitalSignForPatient(patient?.id);
        return {
          patient,
          vitalSign: vs,
          patientId: patient?.id,
          patientName: patient?.name || `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim() || `Patient ${patient?.id || '?'}`,
          recorded_at: vs?.recorded_at || patient?.created_at,
        };
      }).sort((a, b) => {
        if (sortBy === 'date') return new Date(b.recorded_at || 0) - new Date(a.recorded_at || 0);
        if (sortBy === 'patient') return String(a.patientId || '').localeCompare(String(b.patientId || ''));
        return 0;
      });
    } catch (err) {
      console.error('Error computing displayRows:', err);
      return [];
    }
  }, [globalPatientSearch, filterBy, sortBy, allPatientsCache, vitalSigns]);

  const paginatedVitalSigns = displayRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeAlerts = Array.isArray(alerts) ? alerts.filter(alert => !alert.acknowledged) : [];

  const handleSearchPatients = async (term) => {
    setGlobalPatientSearch(term);
    if (!term.trim()) {
      setPatientOptions(allPatientsCache.length > 0 ? allPatientsCache : (patients || []));
      return;
    }
    setPatientSearchLoading(true);
    try {
      const data = await apiRequest(`/api/v1/patients/patients/?search=${encodeURIComponent(term)}&page_size=50`);
      const list = Array.isArray(data) ? data : (data.results || []);
      setPatientOptions(list);
    } catch {
      setPatientOptions(allPatientsCache.length > 0 ? allPatientsCache : (patients || []));
    } finally {
      setPatientSearchLoading(false);
    }
  };

  const handleSelectPatient = (patient) => {
    const name = patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
    const mrn = patient.hospital_number || patient.phone || '';
    const display = mrn ? `${name} (${mrn})` : name;
    setSelectedPatient(display);
    setGlobalPatientSearch(name);
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      visitId: patient.current_visit_id || '',
    }));
    setShowForm(true);
    setPatientOptions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setEwsResult(null);
    setIsSubmitting(true);

    if (!formData.patientId) {
      setFormError('Please select a patient.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      patient: formData.patientId,
      visit: formData.visitId || undefined,
      blood_pressure_systolic: formData.bloodPressureSystolic ? parseInt(formData.bloodPressureSystolic) : null,
      blood_pressure_diastolic: formData.bloodPressureDiastolic ? parseInt(formData.bloodPressureDiastolic) : null,
      pulse: formData.heartRate ? parseInt(formData.heartRate) : null,
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      respiratory_rate: formData.respirationRate ? parseInt(formData.respirationRate) : null,
      oxygen_saturation: formData.oxygenSaturation ? parseFloat(formData.oxygenSaturation) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      blood_glucose: formData.bloodGlucose ? parseFloat(formData.bloodGlucose) : null,
      pain_score: formData.painScore ? parseInt(formData.painScore) : null,
      consciousness: formData.consciousness,
      notes: formData.notes,
    };

    let vs;
    try {
      const result = await dispatch(createVitalSign(payload));
      if (createVitalSign.rejected.match(result)) {
        setFormError(result.payload || 'Failed to save vital signs.');
        setIsSubmitting(false);
        return;
      }
      vs = result.payload;
    } catch (err) {
      setFormError(err.message || 'Failed to save vital signs.');
      setIsSubmitting(false);
      return;
    }

    let billingError = '';
    const chargePromises = [];

    if (formData.consultationFee && Number(formData.consultationFee) >= 0) {
      chargePromises.push(
        apiRequest('/api/v1/billing/patient-charges/', {
          method: 'POST',
          body: JSON.stringify({
            patient: formData.patientId,
            visit: formData.visitId || undefined,
            item_type: 'service',
            description: 'Consultation fee',
            quantity: 1,
            unit_price: Number(formData.consultationFee),
            source_id: `consultation-${vs.id}`,
          }),
        }).catch(err => ({ error: err.message || 'Consultation billing failed' }))
      );
    }

    if (formData.chargeAmount && Number(formData.chargeAmount) >= 0) {
      chargePromises.push(
        apiRequest('/api/v1/billing/patient-charges/', {
          method: 'POST',
          body: JSON.stringify({
            patient: formData.patientId,
            visit: formData.visitId || undefined,
            item_type: 'service',
            description: 'Vital signs monitoring',
            quantity: 1,
            unit_price: Number(formData.chargeAmount),
            source_id: `vital-${vs.id}`,
          }),
        }).catch(err => ({ error: err.message || 'Vital signs billing failed' }))
      );
    }

    if (dispensedMedicines.length > 0) {
      for (const med of dispensedMedicines) {
        chargePromises.push(
          apiRequest('/api/v1/billing/patient-charges/', {
            method: 'POST',
            body: JSON.stringify({
              patient: formData.patientId,
              visit: formData.visitId || undefined,
              item_type: 'drug',
              description: med.drug.name || med.drug.drug_name || 'Medication',
              quantity: med.quantity,
              unit_price: med.unit_price,
              source_id: `dispense-${vs.id}-${med.drug.id}`,
            }),
          }).catch(err => ({ error: err.message || 'Medicine billing failed' }))
        );
      }
    }

    try {
      const results = await Promise.allSettled(chargePromises);
      const failures = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && r.value?.error));
      if (failures.length > 0) {
        billingError = ` Vital signs recorded, but ${failures.length} billing item(s) failed.`;
      }
    } catch (err) {
      billingError = ` Billing error: ${err.message || 'Unable to process charges.'}`;
    }

    let ewsText = '';
    if (vs && vs.temperature && vs.oxygen_saturation && vs.blood_pressure_systolic &&
      vs.pulse && vs.respiratory_rate) {
      const ewsPayload = {
        vital_sign: vs.id,
        patient: vs.patient,
        visit: vs.visit || undefined,
        respiration_rate: vs.respiratory_rate,
        oxygen_saturation: parseFloat(vs.oxygen_saturation),
        temperature: parseFloat(vs.temperature),
        systolic_bp: vs.blood_pressure_systolic,
        heart_rate: vs.pulse,
        consciousness: vs.consciousness || 'Alert',
      };
      const ewsResultAction = await dispatch(calculateEWS(ewsPayload));
      if (calculateEWS.fulfilled.match(ewsResultAction)) {
        setEwsResult(ewsResultAction.payload);
        const ews = ewsResultAction.payload || {};
        const score = ews.score ?? ews.risk_score ?? null;
        const level = ews.risk_level ?? ews.level ?? null;
        if (score != null || level) {
          ewsText = ` Early warning score: ${score != null ? score : '—'}, risk: ${level || '—'}.`;
        }
      }
    }

    setSuccessMessage(`Vital signs recorded successfully for ${selectedPatient || 'patient'}.${ewsText}${billingError}`);
    dispatch(fetchVitalSigns());

    setFormData({
      patientId: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      temperature: '',
      respirationRate: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      bloodGlucose: '',
      painScore: '',
      consciousness: 'Alert',
      notes: '',
      visitId: '',
      chargeAmount: '',
      consultationFee: '',
    });
    setSelectedPatient('');
    setDispensedMedicines([]);

    setTimeout(() => {
      setShowForm(false);
      setSuccessMessage('');
      setFormError('');
      setEwsResult(null);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleAcknowledge = async (alertId) => {
    setAcknowledgingId(alertId);
    const result = await dispatch(acknowledgeAlertApi(alertId));
    if (!acknowledgeAlertApi.fulfilled.match(result)) {
      setFormError(result.payload || 'Failed to acknowledge alert.');
    } else {
      setSuccessMessage('Alert acknowledged successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setAcknowledgingId(null);
  };

  const handleRefresh = () => {
    dispatch(fetchVitalSigns());
    dispatch(fetchActiveAlerts());
    setSuccessMessage('Data refreshed.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormError('');
    setSuccessMessage('');
    setEwsResult(null);
    setSelectedPatient('');
    setFormData({
      patientId: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      temperature: '',
      respirationRate: '',
      oxygenSaturation: '',
      weight: '',
      height: '',
      bloodGlucose: '',
      painScore: '',
      consciousness: 'Alert',
      notes: '',
      visitId: '',
    });
  };

  const isAbnormal = (vs, key, normalRange) => {
    if (!vs) return false;
    const value = vs[key];
    if (value === undefined || value === null) return false;
    const [min, max] = normalRange;
    return value < min || value > max;
  };

  const getStatusClass = (vs, key, normalRange) => {
    return isAbnormal(vs, key, normalRange) ? 'text-[#C8553D] font-medium' : 'text-[#1A1A1A]';
  };

  const getEwsRiskColor = (level) => {
    if (!level) return 'text-[#5A5A5A] bg-[#F7F5F2] border-[#E8E3DC]';
    if (level === 'high') return 'text-[#C8553D] bg-[#F5EDEA] border-[#E8D6D0]';
    if (level === 'medium') return 'text-[#C87D3D] bg-[#F5F0EA] border-[#F0E8DC]';
    return 'text-[#2D7D46] bg-[#EAF3EE] border-[#D0E3D8]';
  };

  const getEws = (vs) => {
    if (!vs) return null;
    if (vs.early_warning_scores && Array.isArray(vs.early_warning_scores) && vs.early_warning_scores.length > 0) {
      return vs.early_warning_scores[0];
    }
    return null;
  };

  const getPainDisplay = (vs) => {
    if (!vs) return '-';
    const pain = vs.pain_score;
    if (pain === undefined || pain === null) return '-';
    return `${pain}/10`;
  };

  const totalPatients = allPatientsCache.length;
  const totalVitals = vitalSigns?.length || 0;
  const activeAlertCount = activeAlerts.length;

  return (
    <div className="vital-signs-monitoring min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#F5EDEA] flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8553D]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Vital Signs Monitoring
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Real-time monitoring with early warning systems
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={handleRefresh}
              tooltip="Refresh data"
              variant="secondary"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowForm(true)}
              tooltip="Add new vital signs"
              variant="danger"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Vitals</span>
              <span className="sm:hidden">Add</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Error & Success Messages */}
      {formError && (
        <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {formError}
          </span>
          <button onClick={() => setFormError('')} className="text-[#C8553D] hover:text-[#A8442E]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {error}
          </span>
          <button onClick={() => dispatch(clearError())} className="text-[#C8553D] hover:text-[#A8442E]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-[#EAF3EE] border border-[#D0E3D8] text-sm text-[#2D7D46] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            {successMessage}
          </span>
          <button onClick={() => setSuccessMessage('')} className="text-[#2D7D46] hover:text-[#1E5F33]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* EWS Result */}
      {ewsResult && (
        <div className={`mb-4 p-4 border ${getEwsRiskColor(ewsResult.risk_level)}`}>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#1A1A1A]" />
            <span className="text-sm font-semibold text-[#1A1A1A]">
              Early Warning Score: {ewsResult.total} ({ewsResult.risk_level?.toUpperCase() || 'UNKNOWN'} Risk)
            </span>
          </div>
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
            <div>Respiration: {ewsResult.respiration_score ?? '-'}</div>
            <div>SpO₂: {ewsResult.oxygen_score ?? '-'}</div>
            <div>Temp: {ewsResult.temperature_score ?? '-'}</div>
            <div>BP: {ewsResult.systolic_bp_score ?? '-'}</div>
            <div>HR: {ewsResult.heart_rate_score ?? '-'}</div>
            <div>Consciousness: {ewsResult.consciousness_score ?? '-'}</div>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="mb-6 bg-[#F5EDEA] border border-[#E8D6D0] p-4">
          <h2 className="text-sm font-display font-semibold text-[#C8553D] mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Active Alerts ({activeAlerts.length})
          </h2>
          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAcknowledge={handleAcknowledge}
                isAcknowledging={acknowledgingId === alert.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Total Patients"
          value={totalPatients}
          icon={User}
          color="blue"
          tooltip="Total patients in the system"
        />
        <StatsCard
          title="Vital Signs Recorded"
          value={totalVitals}
          icon={Heart}
          color="red"
          tooltip="Total vital sign records"
        />
        <StatsCard
          title="Active Alerts"
          value={activeAlertCount}
          icon={AlertTriangle}
          color="terracotta"
          trend={activeAlertCount > 0 ? 'down' : 'up'}
          trendValue={activeAlertCount > 0 ? `${activeAlertCount} need attention` : 'All clear'}
          tooltip="Alerts requiring acknowledgement"
        />
        <StatsCard
          title="Patients Monitored"
          value={displayRows.filter(row => row.vitalSign).length}
          icon={Activity}
          color="green"
          tooltip="Patients with recent vital signs"
        />
      </div>

      {/* Controls */}
      <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Search Patient</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={globalPatientSearch}
                onChange={(e) => handleSearchPatients(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Filter by Patient</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            >
              <option value="all">All Patients</option>
              {allPatientsCache.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()} {patient.hospital_number ? `(${patient.hospital_number})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            >
              <option value="date">Date (Newest First)</option>
              <option value="patient">Patient ID</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <ButtonWithTooltip
              onClick={handleRefresh}
              tooltip="Refresh data"
              variant="secondary"
              disabled={loading}
              className="flex-1 justify-center"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowForm(true)}
              tooltip="Add vital signs"
              variant="danger"
              className="flex-1 justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Vitals</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border border-[#E8E3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E3DC]">
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">BP</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">HR</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Temp</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">SpO2</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">RR</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Pain</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">EWS</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Recorded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8]">
              {loading && paginatedVitalSigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[#5A5A5A]">
                    <Loader2 className="w-8 h-8 text-[#008751] animate-spin mx-auto mb-3" />
                    Loading vital signs...
                  </td>
                </tr>
              ) : paginatedVitalSigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[#5A5A5A]">
                    <Heart className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
                    <p className="text-sm">No patients found</p>
                    {globalPatientSearch && <p className="text-xs text-[#B0A89E]">Try adjusting your search</p>}
                  </td>
                </tr>
              ) : (
                paginatedVitalSigns.map((row) => {
                  const vs = row.vitalSign;
                  const ews = getEws(vs);
                  
                  return (
                    <tr key={row.patientId} className="hover:bg-[#F7F5F2] transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-[#1A1A1A]">{row.patientName}</div>
                          <div className="text-xs text-[#5A5A5A]">ID: {row.patientId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${getStatusClass(vs, 'blood_pressure_systolic', [90, 140])}`}>
                          {vs ? `${vs.blood_pressure_systolic || '-'}/${vs.blood_pressure_diastolic || '-'}` : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${getStatusClass(vs, 'pulse', [60, 100])}`}>
                          {getVitalDisplay(vs, 'pulse', ' bpm')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${getStatusClass(vs, 'temperature', [36.1, 37.5])}`}>
                          {getVitalDisplay(vs, 'temperature', '°C')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${getStatusClass(vs, 'oxygen_saturation', [95, 100])}`}>
                          {getVitalDisplay(vs, 'oxygen_saturation', '%')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${getStatusClass(vs, 'respiratory_rate', [12, 20])}`}>
                          {getVitalDisplay(vs, 'respiratory_rate', '/min')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${isAbnormal(vs, 'pain_score', [0, 3]) ? 'text-[#C8553D] font-medium' : 'text-[#1A1A1A]'}`}>
                          {getPainDisplay(vs)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {ews ? (
                          <span className={`inline-block px-2 py-0.5 text-xs font-medium border ${getEwsRiskColor(ews.risk_level)}`}>
                            {ews.total_score ?? '?'} ({ews.risk_level || 'UNKNOWN'})
                          </span>
                        ) : vs ? (
                          <span className="text-xs text-[#B0A89E]">No EWS</span>
                        ) : (
                          <span className="text-xs text-[#B0A89E]">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#5A5A5A]">
                        {vs ? new Date(vs.recorded_at).toLocaleString('en-NG') : (row.recorded_at ? new Date(row.recorded_at).toLocaleString('en-NG') : '-')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {loading && paginatedVitalSigns.length === 0 ? (
          <div className="bg-white border border-[#E8E3DC] p-8 text-center">
            <Loader2 className="w-8 h-8 text-[#008751] animate-spin mx-auto mb-3" />
            <p className="text-[#5A5A5A] text-sm">Loading vital signs...</p>
          </div>
        ) : paginatedVitalSigns.length === 0 ? (
          <div className="bg-white border border-[#E8E3DC] p-8 text-center">
            <Heart className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-[#5A5A5A] text-sm">No patients found</p>
          </div>
        ) : (
          paginatedVitalSigns.map((row) => (
            <VitalSignCard key={row.patientId} row={row} onView={() => {}} />
          ))
        )}
      </div>

      {/* Pagination */}
      {displayRows.length > itemsPerPage && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-[10px] text-[#5A5A5A]">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, displayRows.length)} of {displayRows.length}
          </div>
          <div className="flex items-center gap-1">
            <IconButton
              icon={ChevronLeft}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              tooltip="Previous page"
              variant="default"
              disabled={currentPage === 1}
              size="sm"
            />
            <span className="text-xs text-[#5A5A5A]">
              Page {currentPage} of {Math.ceil(displayRows.length / itemsPerPage)}
            </span>
            <IconButton
              icon={ChevronRight}
              onClick={() => setCurrentPage(Math.min(Math.ceil(displayRows.length / itemsPerPage), currentPage + 1))}
              tooltip="Next page"
              variant="default"
              disabled={currentPage === Math.ceil(displayRows.length / itemsPerPage)}
              size="sm"
            />
          </div>
        </div>
      )}

      {/* ==================== ADD VITAL SIGNS MODAL ==================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={closeForm}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">Record Vital Signs</h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Enter patient vital sign measurements</p>
                  </div>
                  <button
                    onClick={closeForm}
                    className="p-1 hover:bg-[#F0EDE8] rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                {/* Patient Selection */}
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Select Patient <span className="text-[#C8553D]">*</span>
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                    <input
                      type="text"
                      placeholder={patientSearchLoading ? 'Searching...' : 'Search by name or ID...'}
                      value={globalPatientSearch}
                      onChange={(e) => handleSearchPatients(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                  {patientOptions.length > 0 && (
                    <div className="mt-1 max-h-48 overflow-y-auto border border-[#E8E3DC] bg-white">
                      {patientOptions.map(patient => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => handleSelectPatient(patient)}
                          className={`w-full text-left px-3 py-2 hover:bg-[#F7F5F2] border-b border-[#F0EDE8] last:border-0 ${formData.patientId === patient.id ? 'bg-[#F5EDEA]' : ''}`}
                        >
                          <div>
                            <span className="text-sm font-medium text-[#1A1A1A]">
                              {patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()}
                            </span>
                            <div className="text-xs text-[#5A5A5A]">{patient.hospital_number || patient.phone || ''}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {formData.patientId && (
                    <div className="mt-2 p-2 bg-[#EAF3EE] border border-[#D0E3D8] text-xs text-[#2D7D46]">
                      Selected: {selectedPatient}
                    </div>
                  )}
                </div>

                {/* Vital Signs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Blood Pressure (mmHg) <span className="text-[#C8553D]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Systolic" 
                        value={formData.bloodPressureSystolic} 
                        onChange={(e) => setFormData({...formData, bloodPressureSystolic: e.target.value})} 
                        className="flex-1 px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" 
                        required 
                      />
                      <span className="flex items-center text-sm text-[#5A5A5A]">/</span>
                      <input 
                        type="number" 
                        placeholder="Diastolic" 
                        value={formData.bloodPressureDiastolic} 
                        onChange={(e) => setFormData({...formData, bloodPressureDiastolic: e.target.value})} 
                        className="flex-1 px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" 
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Heart Rate (bpm) <span className="text-[#C8553D]">*</span>
                    </label>
                    <input 
                      type="number" 
                      value={formData.heartRate} 
                      onChange={(e) => setFormData({...formData, heartRate: e.target.value})} 
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Temperature (°C) <span className="text-[#C8553D]">*</span>
                    </label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={formData.temperature} 
                      onChange={(e) => setFormData({...formData, temperature: e.target.value})} 
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Respiration Rate (/min) <span className="text-[#C8553D]">*</span>
                    </label>
                    <input 
                      type="number" 
                      value={formData.respirationRate} 
                      onChange={(e) => setFormData({...formData, respirationRate: e.target.value})} 
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Oxygen Saturation (%) <span className="text-[#C8553D]">*</span>
                    </label>
                    <input 
                      type="number" 
                      value={formData.oxygenSaturation} 
                      onChange={(e) => setFormData({...formData, oxygenSaturation: e.target.value})} 
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Pain Score (0-10) <span className="text-[#C8553D]">*</span>
                    </label>
                    <input 
                      type="number" 
                      min="0" 
                      max="10" 
                      value={formData.painScore} 
                      onChange={(e) => setFormData({...formData, painScore: e.target.value})} 
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Blood Glucose (mg/dL)
                    </label>
                    <input 
                      type="number" 
                      value={formData.bloodGlucose} 
                      onChange={(e) => setFormData({...formData, bloodGlucose: e.target.value})} 
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Height (m)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Consciousness
                    </label>
                    <select 
                      value={formData.consciousness} 
                      onChange={(e) => setFormData({...formData, consciousness: e.target.value})} 
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    >
                      <option value="Alert">Alert</option>
                      <option value="Voice">Responds to Voice</option>
                      <option value="Pain">Responds to Pain</option>
                      <option value="Unresponsive">Unresponsive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Notes</label>
                  <textarea 
                    value={formData.notes} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                    rows="2" 
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors" 
                    placeholder="Additional observations..." 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Vital Signs Charge (₦)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.chargeAmount}
                      onChange={(e) => setFormData({ ...formData, chargeAmount: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Consultation Fee (₦)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="border border-[#E8E3DC] bg-white p-3">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-2">Dispensed Medicines / Drugs</label>
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                      <input
                        type="text"
                        placeholder="Search drug by name..."
                        value={medicineSearch}
                        onChange={(e) => {
                          setMedicineSearch(e.target.value);
                          searchMedicines(e.target.value);
                        }}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-[#F7F5F2] border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      />
                    </div>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={medicineQuantity}
                      onChange={(e) => setMedicineQuantity(e.target.value)}
                      className="w-20 px-3 py-2 text-sm bg-[#F7F5F2] border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                    <ButtonWithTooltip
                      type="button"
                      onClick={addMedicine}
                      tooltip="Add medicine"
                      variant="primary"
                      disabled={!selectedMedicine || !medicineQuantity}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </ButtonWithTooltip>
                  </div>
                  {medicineSearchLoading && <div className="text-xs text-[#5A5A5A] mb-2">Searching...</div>}
                  {medicineOptions.length > 0 && medicineSearch && (
                    <div className="mb-2 max-h-32 overflow-y-auto border border-[#E8E3DC] bg-white">
                      {medicineOptions.map(drug => (
                        <button
                          key={drug.id}
                          type="button"
                          onClick={() => {
                            setSelectedMedicine(drug);
                            setMedicineSearch(drug.name || drug.drug_name);
                            setMedicineOptions([]);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-[#F7F5F2] border-b border-[#F0EDE8] last:border-0 ${selectedMedicine?.id === drug.id ? 'bg-[#E8F5EF]' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#1A1A1A]">{drug.name || drug.drug_name}</span>
                            <span className="text-xs text-[#5A5A5A]">₦{drug.unit_price || drug.price || 0}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {dispensedMedicines.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {dispensedMedicines.map((med, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-[#F7F5F2] border border-[#E8E3DC]">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-[#1A1A1A] truncate">{med.drug.name || med.drug.drug_name}</span>
                            <span className="text-xs text-[#5A5A5A] ml-2">x{med.quantity} @ ₦{med.unit_price}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMedicine(index)}
                            className="p-1 text-[#C8553D] hover:text-[#A8442E]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {formError && <div className="text-sm text-[#C8553D]">{formError}</div>}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Record vital signs"
                    variant="danger"
                    disabled={isSubmitting || !formData.patientId}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Heart className="w-3.5 h-3.5" />
                        Record Vital Signs
                      </>
                    )}
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={closeForm}
                    tooltip="Cancel"
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </ButtonWithTooltip>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalSignsMonitoring;