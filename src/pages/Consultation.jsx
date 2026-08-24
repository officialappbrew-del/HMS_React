import React, { useMemo, useState, useEffect, useRef, useReducer, lazy, Suspense } from 'react';
import {
  Activity,
  CalendarDays,
  Clock3,
  FileText,
  HeartPulse,
  Pill,
  ShieldCheck,
  Stethoscope,
  UserCircle2,
  Printer,
  FileDown,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  History,
  FilePlus,
  User,
  Calendar,
  Hospital,
  Phone,
  MapPin,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

// ============================================
// 1. UTILITY FUNCTIONS & CONSTANTS
// ============================================

const MEDICATION_DATABASE = {
  'Neurovite Forte': { 
    category: 'Vitamin', 
    interactions: ['Warfarin'],
    sideEffects: ['Nausea', 'Headache'],
    maxDosage: '3 tablets/day'
  },
  'Prednisolone': { 
    category: 'Steroid', 
    interactions: ['Aspirin', 'Warfarin'],
    sideEffects: ['Weight gain', 'Mood changes'],
    maxDosage: '60 mg/day'
  },
  'Amoxicillin': {
    category: 'Antibiotic',
    interactions: ['Probenecid'],
    sideEffects: ['Diarrhea', 'Nausea'],
    maxDosage: '3000 mg/day'
  },
  'Lisinopril': {
    category: 'ACE Inhibitor',
    interactions: ['Diuretics', 'NSAIDs'],
    sideEffects: ['Cough', 'Dizziness'],
    maxDosage: '40 mg/day'
  }
};

const CLINICAL_ALERTS = [
  { 
    id: 'hypertension',
    condition: (vitals) => {
      const bp = vitals.bloodPressure.split('/');
      return parseInt(bp[0]) > 140 || parseInt(bp[1]) > 90;
    },
    message: 'Elevated blood pressure detected',
    severity: 'warning'
  },
  {
    id: 'fever',
    condition: (vitals) => {
      const temp = parseFloat(vitals.temperature);
      return temp > 38 || temp < 36;
    },
    message: 'Abnormal temperature detected',
    severity: 'warning'
  },
  {
    id: 'tachycardia',
    condition: (vitals) => {
      const hr = parseInt(vitals.heartRate);
      return hr > 100 || hr < 60;
    },
    message: 'Abnormal heart rate detected',
    severity: 'info'
  }
];

// ============================================
// 2. INITIAL DATA
// ============================================

const PATIENT_DIRECTORY = [
  {
    patientId: '132920',
    name: 'RASHEEDAT SANNI-IDRIS',
    gender: 'Female',
    age: '48 yrs',
    phone: '+234 803 456 7890',
    healthPlan: 'NHIS Platinum',
    consultant: 'Dr. Famba Famba',
    clinic: 'Family Medicine',
    email: 'rasheedat.s@email.com',
    address: '12, Adeola Street, Lagos'
  },
  {
    patientId: '128451',
    name: 'EMMANUEL OKAFOR',
    gender: 'Male',
    age: '36 yrs',
    phone: '+234 815 123 4444',
    healthPlan: 'Private',
    consultant: 'Dr. Amina Yusuf',
    clinic: 'Cardiology',
    email: 'emmanuel.okafor@email.com',
    address: '8, Jakande Road, Abuja'
  },
  {
    patientId: '141032',
    name: 'BOLANLE ADEWALE',
    gender: 'Female',
    age: '61 yrs',
    phone: '+234 806 555 1212',
    healthPlan: 'NHIS Gold',
    consultant: 'Dr. Tunde Salami',
    clinic: 'General Medicine',
    email: 'bolanle.adewale@email.com',
    address: '21, Ikorodu Road, Lagos'
  }
];

const consultationData = {
  patient: {
    name: 'RASHEEDAT SANNI-IDRIS',
    patientId: '132920',
    gender: 'Female',
    age: '48 yrs',
    phone: '+234 803 456 7890',
    healthPlan: 'NHIS Platinum',
    consultant: 'Dr. Famba Famba',
    clinic: 'Family Medicine',
    email: 'rasheedat.s@email.com',
    address: '12, Adeola Street, Lagos'
  },
  encounter: {
    date: '19/06/2026',
    time: '11:24 AM',
    status: 'In Review',
    type: 'Follow-up',
    visitNumber: 'V-2026-0342'
  },
  vitals: {
    temperature: '36.7°C',
    weight: '77 kg',
    bloodPressure: '136/100 mmHg',
    heartRate: '69 BPM',
    spo2: '99%',
    bpPosition: 'Sitting',
    allergies: 'Penicillin',
    height: '1.61 m',
    bmi: '29.7',
    respiratoryRate: '16/min',
    painScore: '3/10'
  },
  vitalsHistory: [
    { date: '12/06/2026', bloodPressure: '132/95', heartRate: '72', temperature: '36.5' },
    { date: '05/06/2026', bloodPressure: '128/88', heartRate: '70', temperature: '36.8' },
    { date: '29/05/2026', bloodPressure: '140/98', heartRate: '68', temperature: '37.0' }
  ],
  complaint: 'Mild deviation of the mouth to the right × 6/12',
  history: 'Hypertension, previous stroke screening done, no recent fever.',
  prescriptions: [
    {
      id: 1,
      name: 'Neurovite Forte',
      dosage: '1 tablet in the morning, 1 in the afternoon, 1 at night',
      quantity: '28',
      instruction: '14 days',
      status: 'active',
      refills: 2
    },
    {
      id: 2,
      name: 'Prednisolone 5 mg',
      dosage: '10 mg in the morning',
      quantity: '70 mg',
      instruction: '7 days',
      status: 'active',
      refills: 0
    },
    {
      id: 3,
      name: 'Prednisolone 5 mg',
      dosage: '5 mg in the morning',
      quantity: '35 mg',
      instruction: '7 days',
      status: 'active',
      refills: 0
    }
  ],
  admitPatient: 'No',
  labRequests: [
    { id: 1, test: 'Complete Blood Count', status: 'pending', priority: 'normal' },
    { id: 2, test: 'Lipid Profile', status: 'pending', priority: 'urgent' }
  ],
  diagnosis: '',
  followUp: '',
  notes: '',
  activityLog: []
};

// ============================================
// 3. REDUCER FOR STATE MANAGEMENT
// ============================================

const createConsultationPayload = (patientOverride = null) => {
  const basePatient = patientOverride || consultationData.patient;
  return {
    ...consultationData,
    patient: {
      ...consultationData.patient,
      ...basePatient,
      patientId: basePatient.patientId || consultationData.patient.patientId
    },
    encounter: {
      ...consultationData.encounter,
      visitNumber: `V-${Math.floor(Math.random() * 9000) + 1000}`
    }
  };
};

const consultationReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'UPDATE_VITALS':
      return {
        ...state,
        vitals: { ...state.vitals, ...action.payload }
      };
    case 'ADD_PRESCRIPTION':
      return {
        ...state,
        prescriptions: [...state.prescriptions, { ...action.payload, id: Date.now(), status: 'active' }]
      };
    case 'REMOVE_PRESCRIPTION':
      return {
        ...state,
        prescriptions: state.prescriptions.filter(p => p.id !== action.id)
      };
    case 'UPDATE_PRESCRIPTION':
      return {
        ...state,
        prescriptions: state.prescriptions.map(p => 
          p.id === action.id ? { ...p, ...action.payload } : p
        )
      };
    case 'ADD_LAB_REQUEST':
      return {
        ...state,
        labRequests: [...state.labRequests, { 
          ...action.payload, 
          id: Date.now(), 
          status: 'pending' 
        }]
      };
    case 'UPDATE_LAB_REQUEST':
      return {
        ...state,
        labRequests: state.labRequests.map(lab =>
          lab.id === action.id ? { ...lab, ...action.payload } : lab
        )
      };
    case 'SET_STATUS':
      return {
        ...state,
        encounter: { ...state.encounter, status: action.payload }
      };
    case 'ADD_ACTIVITY_LOG':
      return {
        ...state,
        activityLog: [
          { 
            timestamp: new Date().toISOString(), 
            action: action.payload,
            user: state.patient.consultant 
          },
          ...state.activityLog
        ]
      };
    case 'RESET_STATE':
      return consultationData;
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// ============================================
// 4. CUSTOM HOOKS
// ============================================

const useConsultation = () => {
  const [state, dispatch] = useReducer(consultationReducer, consultationData);
  const [selectedPatientId, setSelectedPatientId] = useState(consultationData.patient.patientId);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVitalsEditing, setIsVitalsEditing] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showLabRequest, setShowLabRequest] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    vitals: true,
    prescriptions: true,
    history: true,
    labs: true
  });
  const [newPrescription, setNewPrescription] = useState({
    name: '',
    dosage: '',
    quantity: '',
    instruction: '',
    refills: 0
  });
  const [newLabRequest, setNewLabRequest] = useState({
    test: '',
    priority: 'normal'
  });
  const [alerts, setAlerts] = useState([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('consultationData');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('consultationData', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [state]);

  // Check clinical alerts
  useEffect(() => {
    const activeAlerts = CLINICAL_ALERTS
      .filter(alert => alert.condition(state.vitals))
      .map(alert => ({
        ...alert,
        timestamp: new Date().toISOString()
      }));
    setAlerts(activeAlerts);
  }, [state.vitals]);

  const validateConsultation = () => {
    const errors = [];
    if (!state.diagnosis.trim()) errors.push('Diagnosis is required');
    if (!state.notes.trim()) errors.push('Doctor notes are required');
    if (state.prescriptions.length === 0) errors.push('At least one prescription is required');
    if (!state.vitals.temperature) errors.push('Temperature is required');
    if (!state.vitals.bloodPressure) errors.push('Blood pressure is required');
    return errors;
  };

  const handlePatientChange = (patientId) => {
    const chosenPatient = PATIENT_DIRECTORY.find(patient => patient.patientId === patientId);
    if (!chosenPatient) return;

    setSelectedPatientId(patientId);
    dispatch({
      type: 'LOAD_STATE',
      payload: createConsultationPayload(chosenPatient)
    });
  };

  const handleSaveDraft = () => {
    setIsLoading(true);
    try {
      dispatch({ type: 'SET_STATUS', payload: 'Draft' });
      dispatch({ type: 'ADD_ACTIVITY_LOG', payload: 'Saved draft' });
      setStatusMessage({ type: 'success', text: 'Draft saved successfully.' });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Failed to save draft.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConsultation = () => {
    const errors = validateConsultation();
    if (errors.length > 0) {
      setStatusMessage({ type: 'error', text: errors.join(', ') });
      return;
    }

    setIsLoading(true);
    try {
      dispatch({ type: 'SET_STATUS', payload: 'Completed' });
      dispatch({ type: 'ADD_ACTIVITY_LOG', payload: 'Completed consultation' });
      setStatusMessage({ type: 'success', text: 'Consultation saved successfully.' });
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Failed to save consultation.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPrescription = () => {
    if (!newPrescription.name || !newPrescription.dosage) {
      setStatusMessage({ type: 'error', text: 'Please add at least a drug name and dosage.' });
      return;
    }

    const medInfo = MEDICATION_DATABASE[newPrescription.name];
    if (medInfo) {
      const interactions = medInfo.interactions || [];
      if (interactions.length > 0) {
        setStatusMessage({ 
          type: 'warning', 
          text: `Note: ${newPrescription.name} may interact with: ${interactions.join(', ')}` 
        });
      }
    }

    dispatch({ type: 'ADD_PRESCRIPTION', payload: newPrescription });
    dispatch({ type: 'ADD_ACTIVITY_LOG', payload: `Added prescription: ${newPrescription.name}` });
    setNewPrescription({ name: '', dosage: '', quantity: '', instruction: '', refills: 0 });
    setShowPrescriptionForm(false);
    setStatusMessage({ type: 'success', text: 'Prescription added successfully.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleAddLabRequest = () => {
    if (!newLabRequest.test) {
      setStatusMessage({ type: 'error', text: 'Please enter a lab test name.' });
      return;
    }
    dispatch({ type: 'ADD_LAB_REQUEST', payload: newLabRequest });
    dispatch({ type: 'ADD_ACTIVITY_LOG', payload: `Added lab request: ${newLabRequest.test}` });
    setNewLabRequest({ test: '', priority: 'normal' });
    setShowLabRequest(false);
    setStatusMessage({ type: 'success', text: 'Lab request added successfully.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return {
    state,
    dispatch,
    selectedPatientId,
    setSelectedPatientId,
    statusMessage,
    setStatusMessage,
    isLoading,
    setIsLoading,
    isVitalsEditing,
    setIsVitalsEditing,
    showPrescriptionForm,
    setShowPrescriptionForm,
    showLabRequest,
    setShowLabRequest,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    expandedSections,
    toggleSection,
    newPrescription,
    setNewPrescription,
    newLabRequest,
    setNewLabRequest,
    alerts,
    validateConsultation,
    handlePatientChange,
    handleSaveDraft,
    handleSaveConsultation,
    handleAddPrescription,
    handleAddLabRequest
  };
};

// ============================================
// 5. PRESENTATIONAL COMPONENTS
// ============================================

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  };
  const Icon = icons[type] || Info;
  const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`rounded-xl border p-4 ${colors[type]}`}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <p className="text-sm flex-1">{message}</p>
        <button onClick={onClose} className="flex-shrink-0 hover:opacity-70">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Clinical Alert Component
const ClinicalAlerts = ({ alerts }) => {
  if (alerts.length === 0) return null;
  
  const severityColors = {
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <div key={index} className={`rounded-xl border p-3 ${severityColors[alert.severity]}`}>
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">{alert.message}</p>
              <p className="text-xs opacity-75">
                Detected at {new Date(alert.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Vitals Trend Component
const VitalsTrend = ({ history, current }) => {
  const getTrend = (key) => {
    if (!history || history.length < 2) return null;
    const oldValue = parseFloat(history[0][key]);
    const newValue = parseFloat(current[key]);
    if (isNaN(oldValue) || isNaN(newValue)) return null;
    const diff = ((newValue - oldValue) / oldValue) * 100;
    if (diff > 5) return { direction: 'up', value: diff.toFixed(1), icon: TrendingUp };
    if (diff < -5) return { direction: 'down', value: Math.abs(diff).toFixed(1), icon: TrendingDown };
    return { direction: 'stable', value: diff.toFixed(1), icon: Minus };
  };

  if (!history || history.length === 0) return null;

  const trend = getTrend('bloodPressure') || getTrend('heartRate') || getTrend('temperature');
  if (!trend) return null;

  const colors = {
    up: 'text-red-500',
    down: 'text-emerald-500',
    stable: 'text-blue-500'
  };

  const TrendIcon = trend.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${colors[trend.direction]}`}>
      <TrendIcon className="h-3 w-3" />
      {trend.value}%
    </span>
  );
};

// Prescription Card Component
const PrescriptionCard = ({ prescription, onRemove, onUpdate }) => {
  const medInfo = MEDICATION_DATABASE[prescription.name];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-[#e5e7eb] bg-white p-4 hover:bg-[#f9fafb] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-[#1a5c7a]" />
            <p className="text-sm font-medium font-sans text-[#1a1f2e]">{prescription.name}</p>
            {medInfo && (
              <span className="bg-[#dbeafe] px-2 py-0.5 text-xs text-[#1a5c7a]">
                {medInfo.category}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs font-sans text-[#6b7280]">{prescription.dosage} · {prescription.instruction || 'Instructions not recorded'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#f3f5f7] px-2 py-0.5 text-xs font-medium text-[#6b7280]">
            Qty: {prescription.quantity}
          </span>
          <button
            onClick={() => onRemove(prescription.id)}
            className="p-1 text-[#6b7280] hover:bg-[#fcd9d9] hover:text-[#b13e3e] transition-colors"
            aria-label="Remove prescription"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {prescription.instruction}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FileText className="h-4 w-4" />
          {prescription.refills} refills left
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
        >
          {isExpanded ? 'Less info' : 'More info'}
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {isExpanded && medInfo && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
          <p><strong>Max Dosage:</strong> {medInfo.maxDosage}</p>
          <p><strong>Side Effects:</strong> {medInfo.sideEffects?.join(', ') || 'None reported'}</p>
          {medInfo.interactions?.length > 0 && (
            <p className="text-yellow-600"><strong>Interactions:</strong> {medInfo.interactions.join(', ')}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Lab Request Card Component
const LabRequestCard = ({ lab, onUpdate }) => {
  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200'
  };

  const priorityColors = {
    urgent: 'text-red-600',
    high: 'text-orange-600',
    normal: 'text-blue-600',
    low: 'text-slate-600'
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FilePlus className="h-4 w-4 text-blue-600" />
          <p className="font-medium text-slate-900">{lab.test}</p>
          <span className={`text-xs font-medium ${priorityColors[lab.priority]}`}>
            {lab.priority.toUpperCase()}
          </span>
        </div>
        <select
          value={lab.status}
          onChange={(e) => onUpdate(lab.id, { status: e.target.value })}
          className={`rounded-full px-3 py-1 text-xs border ${statusColors[lab.status] || ''}`}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};

// Activity Log Component
const ActivityLog = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No activities recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {logs.map((log, index) => (
        <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50">
          <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-600" />
          <div className="flex-1">
            <p className="text-sm text-slate-700">{log.action}</p>
            <p className="text-xs text-slate-500">
              {new Date(log.timestamp).toLocaleString()} • {log.user}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// 6. MAIN CONSULTATION COMPONENT
// ============================================

const Consultation = () => {
  const {
    state,
    dispatch,
    selectedPatientId,
    statusMessage,
    setStatusMessage,
    isLoading,
    isVitalsEditing,
    setIsVitalsEditing,
    showPrescriptionForm,
    setShowPrescriptionForm,
    showLabRequest,
    setShowLabRequest,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    expandedSections,
    toggleSection,
    newPrescription,
    setNewPrescription,
    newLabRequest,
    setNewLabRequest,
    alerts,
    handlePatientChange,
    handleSaveDraft,
    handleSaveConsultation,
    handleAddPrescription,
    handleAddLabRequest
  } = useConsultation();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveConsultation();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        handleSaveDraft();
      }
      if (e.key === 'Escape') {
        setIsVitalsEditing(false);
        setShowPrescriptionForm(false);
        setShowLabRequest(false);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleSaveConsultation, handleSaveDraft]);

  // Filter prescriptions
  const filteredPrescriptions = state.prescriptions.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dosage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Summary stats
  const summaryStats = useMemo(
    () => [
      { label: 'BP', value: state.vitals.bloodPressure, icon: HeartPulse, trend: state.vitalsHistory },
      { label: 'HR', value: state.vitals.heartRate, icon: Activity, trend: state.vitalsHistory },
      { label: 'Temp', value: state.vitals.temperature, icon: Stethoscope, trend: state.vitalsHistory },
      { label: 'SpO₂', value: state.vitals.spo2, icon: ShieldCheck, trend: state.vitalsHistory }
    ],
    [state.vitals]
  );

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle export (simplified)
  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `consultation_${state.patient.patientId}_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Mobile navigation tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'vitals', label: 'Vitals', icon: HeartPulse },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'notes', label: 'Notes', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 print:bg-white print:p-0">
      <div className="mx-auto max-w-7xl space-y-6 print:max-w-none print:space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between print:shadow-none print:border-slate-300">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-blue-600">Doctor Consultation</p>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                state.encounter.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                state.encounter.status === 'Draft' ? 'bg-yellow-50 text-yellow-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                {state.encounter.status}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">Clinical Encounter</h1>
              <span className="text-sm text-slate-500">
                Visit #{state.encounter.visitNumber}
              </span>
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                {state.encounter.date}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="patientSelect" className="text-sm text-slate-600">Patient</label>
              <select
                id="patientSelect"
                value={selectedPatientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                {PATIENT_DIRECTORY.map((patient) => (
                  <option key={patient.patientId} value={patient.patientId}>
                    {patient.name} ({patient.patientId})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                aria-label="Print consultation"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                aria-label="Export data"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Draft'}
                <span className="ml-1 text-xs text-slate-400">(Ctrl+D)</span>
              </button>
              <button
                type="button"
                onClick={handleSaveConsultation}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Consultation'}
                <span className="ml-1 text-xs text-blue-200">(Ctrl+S)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {statusMessage && (
          <div className="print:hidden">
            <Toast
              message={statusMessage.text}
              type={statusMessage.type}
              onClose={() => setStatusMessage(null)}
            />
          </div>
        )}

        {/* Clinical Alerts */}
        {alerts.length > 0 && (
          <div className="print:hidden">
            <ClinicalAlerts alerts={alerts} />
          </div>
        )}

        {/* Mobile Tabs */}
        <div className="lg:hidden print:hidden">
          <div className="flex gap-2 overflow-x-auto p-1 bg-white rounded-xl border border-slate-200">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 print:gap-4">
          <div className="space-y-6 xl:col-span-2">
            {/* Summary Stats */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 ${activeTab !== 'overview' && 'lg:hidden'}`}>
              {summaryStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
                      <div className="rounded-lg bg-slate-50 p-2">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                    {item.trend && item.trend.length > 0 && (
                      <VitalsTrend history={item.trend} current={{ [item.label]: item.value }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Patient Profile */}
            <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none print:border-slate-300 ${activeTab !== 'overview' && 'lg:hidden'}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Patient profile</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">{state.patient.name}</h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  <UserCircle2 className="h-4 w-4" />
                  {state.patient.patientId}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Gender</p>
                  <p className="mt-1 font-medium text-slate-900">{state.patient.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Age</p>
                  <p className="mt-1 font-medium text-slate-900">{state.patient.age}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone Number</p>
                  <p className="mt-1 font-medium text-slate-900">{state.patient.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Health Plan</p>
                  <p className="mt-1 font-medium text-slate-900">{state.patient.healthPlan}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Consultant</p>
                  <p className="mt-1 font-medium text-slate-900">{state.patient.consultant}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Clinic</p>
                  <p className="mt-1 font-medium text-slate-900">{state.patient.clinic}</p>
                </div>
                <div className="md:col-span-2 rounded-xl bg-slate-50 p-3">
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />
                      {state.encounter.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-4 w-4" />
                      {state.encounter.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Hospital className="h-4 w-4" />
                      {state.encounter.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals Section */}
            <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none print:border-slate-300 ${activeTab !== 'vitals' && 'lg:hidden'}`}>
              <button
                onClick={() => toggleSection('vitals')}
                className="w-full flex items-center justify-between"
              >
                <h2 className="text-lg font-semibold text-slate-900">Vital Signs</h2>
                <div className="flex items-center gap-3">
                  {state.vitalsHistory && state.vitalsHistory.length > 0 && (
                    <span className="text-xs text-slate-500">
                      <History className="h-4 w-4 inline mr-1" />
                      {state.vitalsHistory.length} records
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVitalsEditing(!isVitalsEditing);
                    }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {isVitalsEditing ? 'Close editor' : 'Update vitals'}
                  </button>
                  {expandedSections.vitals ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {expandedSections.vitals && (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                      ['Temperature', state.vitals.temperature],
                      ['Weight', state.vitals.weight],
                      ['Blood Pressure', state.vitals.bloodPressure],
                      ['Heart Rate', state.vitals.heartRate],
                      ['SpO₂', state.vitals.spo2],
                      ['BP Position', state.vitals.bpPosition],
                      ['Allergies', state.vitals.allergies],
                      ['Height', state.vitals.height],
                      ['BMI', state.vitals.bmi],
                      ['Respiratory Rate', state.vitals.respiratoryRate],
                      ['Pain Score', state.vitals.painScore]
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">{label}</p>
                        <p className="mt-1 font-medium text-slate-900">{value || 'N/A'}</p>
                      </div>
                    ))}
                  </div>

                  {isVitalsEditing && (
                    <div className="mt-4 grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                      <input
                        value={state.vitals.temperature}
                        onChange={(e) => dispatch({ 
                          type: 'UPDATE_VITALS', 
                          payload: { temperature: e.target.value } 
                        })}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        placeholder="Temperature"
                      />
                      <input
                        value={state.vitals.bloodPressure}
                        onChange={(e) => dispatch({ 
                          type: 'UPDATE_VITALS', 
                          payload: { bloodPressure: e.target.value } 
                        })}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        placeholder="Blood Pressure"
                      />
                      <input
                        value={state.vitals.heartRate}
                        onChange={(e) => dispatch({ 
                          type: 'UPDATE_VITALS', 
                          payload: { heartRate: e.target.value } 
                        })}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        placeholder="Heart Rate"
                      />
                      <input
                        value={state.vitals.spo2}
                        onChange={(e) => dispatch({ 
                          type: 'UPDATE_VITALS', 
                          payload: { spo2: e.target.value } 
                        })}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        placeholder="SpO₂"
                      />
                      <input
                        value={state.vitals.weight}
                        onChange={(e) => dispatch({ 
                          type: 'UPDATE_VITALS', 
                          payload: { weight: e.target.value } 
                        })}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        placeholder="Weight"
                      />
                      <input
                        value={state.vitals.height}
                        onChange={(e) => dispatch({ 
                          type: 'UPDATE_VITALS', 
                          payload: { height: e.target.value } 
                        })}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        placeholder="Height"
                      />
                      <button
                        type="button"
                        onClick={() => setIsVitalsEditing(false)}
                        className="col-span-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Done editing
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Complaint & History */}
            <div className={`space-y-4 ${activeTab !== 'overview' && 'lg:hidden'}`}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Chief Complaint</h2>
                <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-slate-700">{state.complaint}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <button
                  onClick={() => toggleSection('history')}
                  className="w-full flex items-center justify-between"
                >
                  <h2 className="text-lg font-semibold text-slate-900">Medical History</h2>
                  {expandedSections.history ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {expandedSections.history && (
                  <p className="mt-3 text-sm text-slate-700">{state.history}</p>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none print:border-slate-300 ${activeTab !== 'notes' && 'lg:hidden'}`}>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Doctor Notes</h2>
                <span className="ml-auto text-xs text-slate-400">Rich text supported</span>
              </div>
              <textarea
                value={state.notes}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'notes', value: e.target.value })}
                rows={8}
                className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 resize-y"
                placeholder="Add key findings, differential diagnoses, and management plan...
Use Ctrl+S to save, Ctrl+D to save as draft"
                aria-label="Doctor notes"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>{state.notes.split(/\s+/).filter(Boolean).length} words</span>
                <span>{state.notes.length} characters</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Prescriptions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <button
                onClick={() => toggleSection('prescriptions')}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Prescriptions</h2>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                    {state.prescriptions.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPrescriptionForm(!showPrescriptionForm);
                    }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {showPrescriptionForm ? 'Cancel' : 'Add drug'}
                  </button>
                  {expandedSections.prescriptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {expandedSections.prescriptions && (
                <>
                  {/* Search */}
                  <div className="mt-3 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search prescriptions..."
                      className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  {showPrescriptionForm && (
                    <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="relative">
                        <input
                          value={newPrescription.name}
                          onChange={(e) => setNewPrescription(prev => ({ 
                            ...prev, 
                            name: e.target.value,
                            ...(MEDICATION_DATABASE[e.target.value] && {
                              category: MEDICATION_DATABASE[e.target.value].category
                            })
                          }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          placeholder="Drug name (start typing for suggestions)"
                          list="medications"
                        />
                        <datalist id="medications">
                          {Object.keys(MEDICATION_DATABASE).map(med => (
                            <option key={med} value={med} />
                          ))}
                        </datalist>
                      </div>
                      <input
                        value={newPrescription.dosage}
                        onChange={(e) => setNewPrescription(prev => ({ ...prev, dosage: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        placeholder="Dosage"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={newPrescription.quantity}
                          onChange={(e) => setNewPrescription(prev => ({ ...prev, quantity: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          placeholder="Quantity"
                        />
                        <input
                          value={newPrescription.instruction}
                          onChange={(e) => setNewPrescription(prev => ({ ...prev, instruction: e.target.value }))}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          placeholder="Instruction (e.g., 14 days)"
                        />
                      </div>
                      <input
                        value={newPrescription.refills}
                        onChange={(e) => setNewPrescription(prev => ({ 
                          ...prev, 
                          refills: parseInt(e.target.value) || 0 
                        }))}
                        type="number"
                        min="0"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        placeholder="Number of refills"
                      />
                      <button
                        type="button"
                        onClick={handleAddPrescription}
                        className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        Add Prescription
                      </button>
                    </div>
                  )}

                  <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                    {filteredPrescriptions.length === 0 ? (
                      <div className="text-center py-6 text-slate-500">
                        <p className="text-sm">No prescriptions found</p>
                      </div>
                    ) : (
                      filteredPrescriptions.map((item) => (
                        <PrescriptionCard
                          key={item.id}
                          prescription={item}
                          onRemove={(id) => {
                            dispatch({ type: 'REMOVE_PRESCRIPTION', id });
                            dispatch({ type: 'ADD_ACTIVITY_LOG', payload: `Removed prescription: ${item.name}` });
                          }}
                          onUpdate={(id, data) => {
                            dispatch({ type: 'UPDATE_PRESCRIPTION', payload: { id, ...data } });
                          }}
                        />
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Assessment */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none print:border-slate-300">
              <h2 className="text-lg font-semibold text-slate-900">Assessment</h2>
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Diagnosis *
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    value={state.diagnosis}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'diagnosis', value: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                    placeholder="Enter primary diagnosis"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Follow-up Plan</label>
                  <input
                    value={state.followUp}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'followUp', value: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                    placeholder="Next visit / review plan"
                  />
                </div>
              </div>
            </div>

            {/* Lab Requests */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <button
                onClick={() => toggleSection('labs')}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FilePlus className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Lab Requests</h2>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                    {state.labRequests.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLabRequest(!showLabRequest);
                    }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {showLabRequest ? 'Cancel' : 'Add request'}
                  </button>
                  {expandedSections.labs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {expandedSections.labs && (
                <>
                  {showLabRequest && (
                    <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <input
                        value={newLabRequest.test}
                        onChange={(e) => setNewLabRequest(prev => ({ ...prev, test: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                        placeholder="Lab test name"
                      />
                      <select
                        value={newLabRequest.priority}
                        onChange={(e) => setNewLabRequest(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                      >
                        <option value="low">Low Priority</option>
                        <option value="normal">Normal Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddLabRequest}
                        className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        Add Lab Request
                      </button>
                    </div>
                  )}

                  <div className="mt-4 space-y-2">
                    {state.labRequests.length === 0 ? (
                      <div className="text-center py-4 text-sm text-slate-500">
                        No lab requests
                      </div>
                    ) : (
                      state.labRequests.map(lab => (
                        <LabRequestCard
                          key={lab.id}
                          lab={lab}
                          onUpdate={(id, data) => {
                            dispatch({ type: 'UPDATE_LAB_REQUEST', payload: { id, ...data } });
                            dispatch({ type: 'ADD_ACTIVITY_LOG', payload: `Updated lab request: ${lab.test} - ${data.status}` });
                          }}
                        />
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Other Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none print:border-slate-300">
              <h2 className="text-lg font-semibold text-slate-900">Other Actions</h2>
              <div className="mt-3 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span>Admit patient</span>
                  <select
                    value={state.admitPatient}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'admitPatient', value: e.target.value })}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <span>Referral</span>
                  <span className="font-medium text-blue-600">Not required</span>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden print:shadow-none print:border-slate-300">
              <h2 className="text-lg font-semibold text-slate-900">Activity Log</h2>
              <ActivityLog logs={state.activityLog} />
            </div>

            {/* Keyboard Shortcuts */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm print:hidden">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>Ctrl+S</div>
                <div>Save Consultation</div>
                <div>Ctrl+D</div>
                <div>Save Draft</div>
                <div>Esc</div>
                <div>Close forms</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 border-t border-slate-200 pt-4 print:hidden">
          <p>
            Consultation data is automatically saved locally. 
            Last updated: {new Date().toLocaleString()}
          </p>
          <p className="mt-1">
            Patient ID: {state.patient.patientId} | Visit: {state.encounter.visitNumber}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Consultation;