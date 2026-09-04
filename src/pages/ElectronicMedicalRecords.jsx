import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Clipboard,
  RefreshCw ,
  Activity,
  Edit,
  Eye,
  X,
  Loader2,
  AlertTriangle,
  Shield,
  User,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Thermometer,
  HeartPulse,
  Brain,
  Check ,
  Droplets,
  Baby
} from 'lucide-react';
import {
  fetchMedicalRecords,
  createMedicalRecord,
  createProgressNote,
  fetchProgressNotes,
  createProblem,
  createAllergy,
  clearError,
  setCurrentRecord,
} from '../features/emrSlice';
import { setPatients } from '../features/patientSlice';
import { apiRequest, emrApi } from '../utils/api';
import Pagination from '../components/Pagination';

// Disease-specific template components
import MalariaCaseDocumentation from './../pages/Order/MalariaCaseDocumentation';
import TyphoidFeverManagement from './../pages/Order/TyphoidFeverManagement';
import SickleCellDiseaseTracking from './../pages/Order/SickleCellDiseaseTracking';
import TuberculosisTreatmentCards from './../pages/Order/TuberculosisTreatmentCards';
import HivAidsCarePlans from './../pages/Order/HivAidsCarePlans';
import HypertensionDiabetesManagement from './../pages/Order/HypertensionDiabetesManagement';
import MaternalHealthRecords from './../pages/Order/MaternalHealthRecords';

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
    'active': { label: 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'inactive': { label: 'Inactive', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
    'completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'resolved': { label: 'Resolved', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'outpatient': { label: 'Outpatient', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'emergency': { label: 'Emergency', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'inpatient': { label: 'Inpatient', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
  };

  const config = statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== EMR CARD ====================
const EMRCard = ({ item, type, patientName, onView, onEdit }) => {
  const getContentPreview = () => {
    if (type === 'encounter') {
      return item.chief_complaint || item.history_of_present_illness || 'No details';
    }
    if (item.template_type) {
      return item.template_data?.notes || item.template_type;
    }
    return item.subjective || item.objective || item.assessment || item.plan || 'No content';
  };

  return (
    <div className="bg-white border border-[#E8E3DC] p-4 hover:bg-[#F7F5F2] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#F7F5F2] border border-[#E8E3DC] flex items-center justify-center">
            {type === 'encounter' ? (
              <Clipboard className="w-4 h-4 text-[#5A5A5A]" />
            ) : (
              <FileText className="w-4 h-4 text-[#5A5A5A]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-[#1A1A1A]">{patientName}</span>
              <StatusBadge status={type === 'encounter' ? item.record_type : item.note_type} />
            </div>
            <p className="text-xs text-[#5A5A5A] truncate max-w-xs">{getContentPreview()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#B0A89E]">
            {new Date(item.created_at).toLocaleDateString('en-NG')}
          </span>
          <IconButton
            icon={Eye}
            onClick={() => onView(item)}
            tooltip="View record"
            variant="primary"
            size="sm"
          />
          <IconButton
            icon={Edit}
            onClick={() => onEdit(item)}
            tooltip="Edit record"
            variant="warning"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};

// ==================== TEMPLATE CARD ====================
const TemplateCard = ({ template, onClick }) => {
  const icons = {
    malaria: Activity,
    typhoid: Thermometer,
    sickle_cell: Droplets,
    tb: Shield,
    hiv: HeartPulse,
    ncd: Brain,
    maternal: Baby,
  };

  const Icon = icons[template.id] || FileText;

  return (
    <div
      onClick={() => onClick(template.id)}
      className="bg-white border border-[#E8E3DC] p-6 hover:border-[#008751] hover:bg-[#F7F5F2] cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#008751] transition-colors">
          <Icon className="w-5 h-5 text-[#008751] group-hover:text-white transition-colors" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-display font-semibold text-[#1A1A1A] group-hover:text-[#008751] transition-colors">
            {template.title}
          </h3>
          <p className="text-xs text-[#5A5A5A] mt-1">{template.desc}</p>
          <div className="mt-3">
            <span className="text-[10px] font-medium text-[#008751] group-hover:underline">
              Open Template →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const ElectronicMedicalRecords = () => {
  const dispatch = useDispatch();
  const { medicalRecords, progressNotes, currentRecord, loading, error } = useSelector(state => state.emr);
  const { patients } = useSelector(state => state.patient || { patients: [] });

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await apiRequest('/api/v1/patients/patients/?page_size=100');
        const list = Array.isArray(data) ? data : (data.results || []);
        dispatch(setPatients(list));
      } catch (err) {
        console.error('Failed to load patients for EMR:', err);
      }
    };
    loadPatients();
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState('encounters');
  const [showEncounterForm, setShowEncounterForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [templatePatientId, setTemplatePatientId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;

  const allCache = useMemo(() => {
    const list = Array.isArray(patients) ? patients : [];
    if (filterBy !== 'all') {
      return list.filter(p => String(p.id) === String(filterBy));
    }
    if (!searchTerm.trim()) return list;
    const term = searchTerm.trim().toLowerCase();
    return list.filter(p => {
      const name = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase();
      return (
        name.includes(term) ||
        String(p.id).includes(term) ||
        (p.hospital_number && p.hospital_number.toLowerCase().includes(term)) ||
        (p.phone && p.phone.toLowerCase().includes(term))
      );
    });
  }, [patients, filterBy, searchTerm]);

  const [encounterForm, setEncounterForm] = useState({
    patientId: '',
    recordType: 'outpatient',
    chiefComplaint: '',
    history_of_present_illness: '',
    past_medical_history: '',
    family_history: '',
    social_history: '',
  });

  const [noteForm, setNoteForm] = useState({
    patientId: '',
    medical_record: '',
    note_type: 'progress',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });

  const [problemForm, setProblemForm] = useState({
    patientId: '',
    problem: '',
    icd10_code: '',
    onset_date: '',
    status: 'active',
    notes: '',
  });

  const [allergyForm, setAllergyForm] = useState({
    patientId: '',
    allergen: '',
    allergy_type: 'drug',
    reaction: '',
    severity: 'moderate',
  });

  useEffect(() => {
    dispatch(fetchMedicalRecords());
    dispatch(fetchProgressNotes());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilter = (value) => {
    setFilterBy(value);
    setCurrentPage(1);
  };

  const filteredEncounters = medicalRecords
    .filter(record => {
      const patient = allCache.find(p => String(p.id) === String(record.patient));
      const matchesSearch = !searchTerm.trim() ||
        (patient && `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        String(record.patient).includes(searchTerm);
      const matchesFilter = filterBy === 'all' || String(record.patient) === String(filterBy);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      return 0;
    });

  const filteredNotes = progressNotes
    .filter(note => {
      const patient = allCache.find(p => String(p.id) === String(note.patient));
      const matchesSearch = !searchTerm.trim() ||
        (patient && `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        String(note.patient).includes(searchTerm);
      const matchesFilter = filterBy === 'all' || String(note.patient) === String(filterBy);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      return 0;
    });

  const paginatedEncounters = filteredEncounters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedNotes = filteredNotes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const currentData = activeTab === 'encounters' ? paginatedEncounters : activeTab === 'notes' ? paginatedNotes : [];
  const totalPages = Math.ceil((activeTab === 'encounters' ? filteredEncounters.length : filteredNotes.length) / itemsPerPage);

  const getPatientName = (patientId) => {
    const patient = patients.find(p => String(p.id) === String(patientId));
    if (!patient) return `Patient ${patientId}`;
    return patient.full_name || patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || `Patient ${patientId}`;
  };

  const resetEncounterForm = () => {
    setEncounterForm({
      patientId: '',
      recordType: 'outpatient',
      chiefComplaint: '',
      history_of_present_illness: '',
      past_medical_history: '',
      family_history: '',
      social_history: '',
    });
    setFormError('');
  };

  const resetNoteForm = () => {
    setNoteForm({
      patientId: '',
      medical_record: '',
      note_type: 'progress',
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
    });
    setFormError('');
  };

  const handleEncounterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!encounterForm.patientId) {
      setFormError('Please select a patient.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      patient: encounterForm.patientId,
      record_type: encounterForm.recordType,
      chief_complaint: encounterForm.chiefComplaint,
      history_of_present_illness: encounterForm.history_of_present_illness,
      past_medical_history: encounterForm.past_medical_history,
      family_history: encounterForm.family_history,
      social_history: encounterForm.social_history,
    };

    try {
      const result = await dispatch(createMedicalRecord(payload));
      if (createMedicalRecord.fulfilled.match(result)) {
        setSuccessMessage('Encounter note created successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowEncounterForm(false);
        resetEncounterForm();
      } else {
        setFormError(result.payload || 'Failed to create encounter note.');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create encounter note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!noteForm.patientId) {
      setFormError('Please select a patient.');
      setIsSubmitting(false);
      return;
    }

    try {
      let medicalRecordId = noteForm.medical_record;
      if (!medicalRecordId) {
        const recordResult = await dispatch(createMedicalRecord({
          patient: noteForm.patientId,
          record_type: 'outpatient',
          chief_complaint: noteForm.subjective || noteForm.assessment || 'Clinical note',
        }));
        if (!createMedicalRecord.fulfilled.match(recordResult)) {
          setFormError(recordResult.payload || 'Failed to create the medical record for this note.');
          return;
        }
        medicalRecordId = recordResult.payload.id;
      }

      const result = await dispatch(createProgressNote({
        medical_record: medicalRecordId,
        note_type: noteForm.note_type,
        subjective: noteForm.subjective,
        objective: noteForm.objective,
        assessment: noteForm.assessment,
        plan: noteForm.plan,
      }));
      if (createProgressNote.fulfilled.match(result)) {
        setSuccessMessage('Clinical note created successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowNoteForm(false);
        resetNoteForm();
      } else {
        setFormError(result.payload || 'Failed to save clinical note.');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to save clinical note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!problemForm.patientId || !problemForm.problem) {
      setFormError('Patient and problem description are required.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      patient: problemForm.patientId,
      medical_record: currentRecord?.id || undefined,
      problem: problemForm.problem,
      icd10_code: problemForm.icd10_code,
      onset_date: problemForm.onset_date || undefined,
      status: problemForm.status,
      notes: problemForm.notes,
    };

    try {
      const result = await dispatch(createProblem(payload));
      if (createProblem.fulfilled.match(result)) {
        setSuccessMessage('Problem added successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowProblemForm(false);
        setProblemForm({ patientId: '', problem: '', icd10_code: '', onset_date: '', status: 'active', notes: '' });
      } else {
        setFormError(result.payload || 'Failed to add problem.');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to add problem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAllergySubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!allergyForm.patientId || !allergyForm.allergen || !allergyForm.reaction) {
      setFormError('Patient, allergen, and reaction are required.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      patient: allergyForm.patientId,
      medical_record: currentRecord?.id || undefined,
      allergen: allergyForm.allergen,
      allergy_type: allergyForm.allergy_type,
      reaction: allergyForm.reaction,
      severity: allergyForm.severity,
    };

    try {
      const result = await dispatch(createAllergy(payload));
      if (createAllergy.fulfilled.match(result)) {
        setSuccessMessage('Allergy added successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowAllergyForm(false);
        setAllergyForm({ patientId: '', allergen: '', allergy_type: 'drug', reaction: '', severity: 'moderate' });
      } else {
        setFormError(result.payload || 'Failed to add allergy.');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to add allergy.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiseaseTemplateSave = async ({ templateType, data }) => {
    if (!templatePatientId) {
      throw new Error('Select a patient before saving a disease template.');
    }

    const recordResult = await dispatch(createMedicalRecord({
      patient: templatePatientId,
      record_type: 'outpatient',
      chief_complaint: templateType,
    }));
    if (!createMedicalRecord.fulfilled.match(recordResult)) {
      throw new Error(recordResult.payload || 'Failed to create the medical record.');
    }

    const noteResult = await dispatch(createProgressNote({
      medical_record: recordResult.payload.id,
      note_type: 'progress',
      template_type: templateType,
      template_data: data,
      subjective: data.notes || '',
    }));
    if (!createProgressNote.fulfilled.match(noteResult)) {
      throw new Error(noteResult.payload || 'Failed to save the disease template.');
    }

    setSuccessMessage(`${templateType} saved successfully.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Tabs configuration
  const tabs = [
    { id: 'encounters', label: 'Encounter Notes', icon: Clipboard },
    { id: 'notes', label: 'Clinical Notes', icon: FileText },
    { id: 'templates', label: 'Disease Templates', icon: Activity },
  ];

  // Templates configuration
  const templates = [
    { id: 'malaria', title: 'Malaria Case', desc: 'Documentation for Malaria cases' },
    { id: 'typhoid', title: 'Typhoid Fever', desc: 'Management of Typhoid Fever' },
    { id: 'sickle_cell', title: 'Sickle Cell', desc: 'Tracking for Sickle Cell Disease' },
    { id: 'tb', title: 'Tuberculosis', desc: 'TB Treatment Cards (DOTS)' },
    { id: 'hiv', title: 'HIV/AIDS Care', desc: 'ART and Care Plans' },
    { id: 'ncd', title: 'Hypertension & Diabetes', desc: 'Chronic Disease Management' },
    { id: 'maternal', title: 'Maternal Health', desc: 'Antenatal Care Records' },
  ];

  const totalRecords = medicalRecords.length + progressNotes.length;

  return (
    <div className="electronic-medical-records min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Electronic Medical Records (EMR) 
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Comprehensive patient clinical documentation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => {
                dispatch(fetchMedicalRecords());
                dispatch(fetchProgressNotes());
                setSuccessMessage('Records refreshed.');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
              tooltip="Refresh records"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                if (activeTab === 'encounters') {
                  setShowEncounterForm(true);
                } else if (activeTab === 'notes') {
                  setShowNoteForm(true);
                }
              }}
              tooltip={activeTab === 'encounters' ? 'Add encounter' : 'Add note'}
              variant="primary"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {activeTab === 'encounters' ? 'Add Encounter' : 'Add Note'}
              </span>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Total Records"
          value={totalRecords}
          icon={FileText}
          color="blue"
          tooltip="Total medical records and clinical notes"
        />
        <StatsCard
          title="Encounter Notes"
          value={medicalRecords.length}
          icon={Clipboard}
          color="green"
          tooltip="Total encounter notes"
        />
        <StatsCard
          title="Clinical Notes"
          value={progressNotes.length}
          icon={FileText}
          color="purple"
          tooltip="Total clinical progress notes"
        />
        <StatsCard
          title="Active Patients"
          value={allCache.length}
          icon={User}
          color="gold"
          tooltip="Active patients in the system"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-1 border-b border-[#E8E3DC] mb-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tooltip key={tab.id} text={`View ${tab.label}`}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-1 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#008751] text-[#008751]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Controls - only for non-template tabs */}
        {activeTab !== 'templates' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Filter by Patient</label>
              <select
                value={filterBy}
                onChange={(e) => handleFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              >
                <option value="all">All Patients</option>
                {allCache.map(patient => (
                  <option key={patient.id} value={patient.id}>{getPatientName(patient.id)}</option>
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
              </select>
            </div>

            <div className="flex items-end">
              <ButtonWithTooltip
                onClick={() => {
                  if (activeTab === 'encounters') {
                    setShowEncounterForm(true);
                  } else if (activeTab === 'notes') {
                    setShowNoteForm(true);
                  }
                }}
                tooltip={activeTab === 'encounters' ? 'Add encounter' : 'Add note'}
                variant="primary"
                className="w-full justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
                Add {activeTab === 'encounters' ? 'Encounter' : 'Note'}
              </ButtonWithTooltip>
            </div>
          </div>
        )}

        {/* ==================== ENCOUNTERS & NOTES TABS ==================== */}
        {activeTab !== 'templates' && (
          <div className="mt-4 space-y-3">
            {loading && currentData.length === 0 ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-[#008751] animate-spin mx-auto mb-3" />
                <p className="text-[#5A5A5A] text-sm">Loading records...</p>
              </div>
            ) : currentData.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <FileText className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">
                  No {activeTab === 'encounters' ? 'encounters' : 'clinical notes'} found
                </p>
                <p className="text-sm text-[#B0A89E] mt-1">
                  {searchTerm ? 'Try adjusting your search or filters' : 'Click "Add" to create one'}
                </p>
              </div>
            ) : (
              currentData.map(item => {
                const patientName = getPatientName(item.patient);
                return (
                  <EMRCard
                    key={item.id}
                    item={item}
                    type={activeTab === 'encounters' ? 'encounter' : 'note'}
                    patientName={patientName}
                    onView={(record) => {
                      dispatch(setCurrentRecord(record));
                      setShowViewModal(true);
                    }}
                    onEdit={(item) => {
                      setEditingItem(item);
                      setShowEditModal(true);
                    }}
                  />
                );
              })
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-[10px] text-[#5A5A5A]">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, activeTab === 'encounters' ? filteredEncounters.length : filteredNotes.length)} of {activeTab === 'encounters' ? filteredEncounters.length : filteredNotes.length}
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
                    Page {currentPage} of {totalPages}
                  </span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    tooltip="Next page"
                    variant="default"
                    disabled={currentPage === totalPages}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TEMPLATES TAB ==================== */}
        {activeTab === 'templates' && (
          <div className="mt-4">
            {!selectedTemplate ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onClick={setSelectedTemplate}
                  />
                ))}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <ButtonWithTooltip
                    onClick={() => setSelectedTemplate(null)}
                    tooltip="Back to templates"
                    variant="secondary"
                    size="sm"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back to Templates
                  </ButtonWithTooltip>
                  <span className="text-sm font-medium text-[#5A5A5A]">
                    {templates.find(t => t.id === selectedTemplate)?.title}
                  </span>
                </div>
                <div className="mb-4 bg-white border border-[#E8E3DC] p-4">
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Patient
                  </label>
                  <select
                    value={templatePatientId}
                    onChange={(e) => setTemplatePatientId(e.target.value)}
                    className="w-full max-w-md px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select patient before saving...</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>{getPatientName(patient.id)}</option>
                    ))}
                  </select>
                </div>
                <div className="bg-white border border-[#E8E3DC] p-5">
                  {selectedTemplate === 'malaria' && <MalariaCaseDocumentation patientId={templatePatientId} onSave={handleDiseaseTemplateSave} />}
                  {selectedTemplate === 'typhoid' && <TyphoidFeverManagement patientId={templatePatientId} onSave={handleDiseaseTemplateSave} />}
                  {selectedTemplate === 'sickle_cell' && <SickleCellDiseaseTracking patientId={templatePatientId} onSave={handleDiseaseTemplateSave} />}
                  {selectedTemplate === 'tb' && <TuberculosisTreatmentCards patientId={templatePatientId} onSave={handleDiseaseTemplateSave} />}
                  {selectedTemplate === 'hiv' && <HivAidsCarePlans patientId={templatePatientId} onSave={handleDiseaseTemplateSave} />}
                  {selectedTemplate === 'ncd' && <HypertensionDiabetesManagement patientId={templatePatientId} onSave={handleDiseaseTemplateSave} />}
                  {selectedTemplate === 'maternal' && <MaternalHealthRecords patientId={templatePatientId} onSave={handleDiseaseTemplateSave} />}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== ENCOUNTER FORM MODAL ==================== */}
      {showEncounterForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => { setShowEncounterForm(false); resetEncounterForm(); }}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">New Encounter Note</h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Document a patient encounter</p>
                  </div>
                  <button
                    onClick={() => { setShowEncounterForm(false); resetEncounterForm(); }}
                    className="p-1 hover:bg-[#F0EDE8] rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleEncounterSubmit} className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Patient <span className="text-[#C8553D]">*</span>
                    </label>
                    <select
                      value={encounterForm.patientId}
                      onChange={(e) => setEncounterForm({...encounterForm, patientId: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select patient...</option>
                      {allCache.map(patient => (
                        <option key={patient.id} value={patient.id}>{getPatientName(patient.id)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Encounter Type
                    </label>
                    <select
                      value={encounterForm.recordType}
                      onChange={(e) => setEncounterForm({...encounterForm, recordType: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    >
                      <option value="outpatient">Outpatient</option>
                      <option value="emergency">Emergency</option>
                      <option value="inpatient">Inpatient Admission</option>
                      <option value="day_care">Day Care</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Chief Complaint <span className="text-[#C8553D]">*</span>
                  </label>
                  <textarea
                    value={encounterForm.chiefComplaint}
                    onChange={(e) => setEncounterForm({...encounterForm, chiefComplaint: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                    placeholder="e.g., Fever, headache, cough..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      History of Present Illness
                    </label>
                    <textarea
                      value={encounterForm.history_of_present_illness}
                      onChange={(e) => setEncounterForm({...encounterForm, history_of_present_illness: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Detailed description of the illness..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Past Medical History
                    </label>
                    <textarea
                      value={encounterForm.past_medical_history}
                      onChange={(e) => setEncounterForm({...encounterForm, past_medical_history: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Previous medical conditions, surgeries..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Family History
                    </label>
                    <textarea
                      value={encounterForm.family_history}
                      onChange={(e) => setEncounterForm({...encounterForm, family_history: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Family medical history..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Social History
                    </label>
                    <textarea
                      value={encounterForm.social_history}
                      onChange={(e) => setEncounterForm({...encounterForm, social_history: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Lifestyle, occupation, habits..."
                    />
                  </div>
                </div>

                {formError && <div className="text-sm text-[#C8553D]">{formError}</div>}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Save encounter"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Save Encounter Note
                      </>
                    )}
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => { setShowEncounterForm(false); resetEncounterForm(); }}
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

      {/* ==================== CLINICAL NOTE FORM MODAL ==================== */}
      {showNoteForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => { setShowNoteForm(false); resetNoteForm(); }}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-3xl max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">New Clinical Note</h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Document a clinical note (SOAP format)</p>
                  </div>
                  <button
                    onClick={() => { setShowNoteForm(false); resetNoteForm(); }}
                    className="p-1 hover:bg-[#F0EDE8] rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleNoteSubmit} className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Patient <span className="text-[#C8553D]">*</span>
                    </label>
                    <select
                      value={noteForm.patientId}
                      onChange={(e) => setNoteForm({...noteForm, patientId: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select patient...</option>
                      {allCache.map(patient => (
                        <option key={patient.id} value={patient.id}>{getPatientName(patient.id)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Note Type
                    </label>
                    <select
                      value={noteForm.note_type}
                      onChange={(e) => setNoteForm({...noteForm, note_type: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    >
                      <option value="progress">Progress Note</option>
                      <option value="consultation">Consultation Note</option>
                      <option value="procedure">Procedure Note</option>
                      <option value="discharge">Discharge Summary</option>
                      <option value="admission">Admission Note</option>
                      <option value="nursing">Nursing Note</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Subjective
                  </label>
                  <textarea
                    value={noteForm.subjective}
                    onChange={(e) => setNoteForm({...noteForm, subjective: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Chief complaint, HPI, ROS..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Objective
                  </label>
                  <textarea
                    value={noteForm.objective}
                    onChange={(e) => setNoteForm({...noteForm, objective: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Physical exam, vital signs, observations..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Assessment
                    </label>
                    <textarea
                      value={noteForm.assessment}
                      onChange={(e) => setNoteForm({...noteForm, assessment: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Diagnosis, impression..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Plan
                    </label>
                    <textarea
                      value={noteForm.plan}
                      onChange={(e) => setNoteForm({...noteForm, plan: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Treatment plan, medications, follow-up..."
                    />
                  </div>
                </div>

                {formError && <div className="text-sm text-[#C8553D]">{formError}</div>}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Save clinical note"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Save Clinical Note
                      </>
                    )}
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => { setShowNoteForm(false); resetNoteForm(); }}
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

      {/* ==================== VIEW RECORD MODAL ==================== */}
      {showViewModal && currentRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => setShowViewModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">
                      {currentRecord.note_type ? 'Clinical Note' : 'Encounter Note'}
                    </h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">
                      {getPatientName(currentRecord.patient)} • {new Date(currentRecord.created_at).toLocaleString('en-NG')}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-1 hover:bg-[#F0EDE8] rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <div className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Type</p>
                    <p className="text-sm text-[#1A1A1A]">{currentRecord.record_type || currentRecord.note_type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date</p>
                    <p className="text-sm text-[#1A1A1A]">{new Date(currentRecord.created_at).toLocaleString('en-NG')}</p>
                  </div>
                </div>

                {currentRecord.chief_complaint && (
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Chief Complaint</p>
                    <p className="text-sm text-[#1A1A1A] mt-1">{currentRecord.chief_complaint}</p>
                  </div>
                )}

                {currentRecord.history_of_present_illness && (
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">History of Present Illness</p>
                    <p className="text-sm text-[#1A1A1A] mt-1 whitespace-pre-wrap">{currentRecord.history_of_present_illness}</p>
                  </div>
                )}

                {currentRecord.past_medical_history && (
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Past Medical History</p>
                    <p className="text-sm text-[#1A1A1A] mt-1 whitespace-pre-wrap">{currentRecord.past_medical_history}</p>
                  </div>
                )}

                {currentRecord.family_history && (
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Family History</p>
                    <p className="text-sm text-[#1A1A1A] mt-1 whitespace-pre-wrap">{currentRecord.family_history}</p>
                  </div>
                )}

                {currentRecord.social_history && (
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Social History</p>
                    <p className="text-sm text-[#1A1A1A] mt-1 whitespace-pre-wrap">{currentRecord.social_history}</p>
                  </div>
                )}

                {currentRecord.subjective && (
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Subjective</p>
                    <p className="text-sm text-[#1A1A1A] mt-1 whitespace-pre-wrap">{currentRecord.subjective}</p>
                  </div>
                )}

                {currentRecord.objective && (
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Objective</p>
                    <p className="text-sm text-[#1A1A1A] mt-1 whitespace-pre-wrap">{currentRecord.objective}</p>
                  </div>
                )}

                {currentRecord.assessment && (
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Assessment</p>
                    <p className="text-sm text-[#1A1A1A] mt-1 whitespace-pre-wrap">{currentRecord.assessment}</p>
                  </div>
                )}

                {currentRecord.plan && (
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Plan</p>
                    <p className="text-sm text-[#1A1A1A] mt-1 whitespace-pre-wrap">{currentRecord.plan}</p>
                  </div>
                )}

                {currentRecord.template_type && (
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Disease Template Data</p>
                    <p className="text-sm font-medium text-[#1A1A1A] mt-1">{currentRecord.template_type}</p>
                    <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap break-words bg-white border border-[#E8E3DC] p-3 text-xs text-[#5A5A5A]">
                      {JSON.stringify(currentRecord.template_data || {}, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="border-t border-[#E8E3DC] p-4 flex justify-end">
                <ButtonWithTooltip
                  onClick={() => setShowViewModal(false)}
                  tooltip="Close"
                  variant="secondary"
                >
                  Close
                </ButtonWithTooltip>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT RECORD MODAL ==================== */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => { setShowEditModal(false); setEditingItem(null); }}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">
                      Edit {editingItem.note_type ? 'Clinical Note' : 'Encounter Note'}
                    </h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">
                      {getPatientName(editingItem.patient)}
                    </p>
                  </div>
                  <button
                    onClick={() => { setShowEditModal(false); setEditingItem(null); }}
                    className="p-1 hover:bg-[#F0EDE8] rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                const isNote = !!editingItem.note_type;
                const payload = isNote
                  ? { note_type: editingItem.note_type, subjective: editingItem.subjective || '', objective: editingItem.objective || '', assessment: editingItem.assessment || '', plan: editingItem.plan || '' }
                  : { record_type: editingItem.record_type || 'outpatient', chief_complaint: editingItem.chief_complaint || '', history_of_present_illness: editingItem.history_of_present_illness || '', past_medical_history: editingItem.past_medical_history || '', family_history: editingItem.family_history || '', social_history: editingItem.social_history || '' };
                const endpoint = isNote ? `/api/v1/emr/progress-notes/${editingItem.id}/` : `/api/v1/emr/medical-records/${editingItem.id}/`;
                try {
                  const result = await apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(payload) });
                  if (result) {
                    setSuccessMessage('Record updated successfully.');
                    setTimeout(() => setSuccessMessage(''), 3000);
                    setShowEditModal(false);
                    setEditingItem(null);
                    dispatch(fetchMedicalRecords());
                    dispatch(fetchProgressNotes());
                  }
                } catch (err) {
                  setFormError(err.message || 'Failed to update record.');
                } finally {
                  setIsSubmitting(false);
                }
              }} className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Patient</label>
                    <input
                      type="text"
                      value={getPatientName(editingItem.patient)}
                      disabled
                      className="w-full px-3 py-2 text-sm bg-[#F0EDE8] border border-[#E8E3DC] text-[#5A5A5A] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Type</label>
                    <select
                      value={editingItem.record_type || editingItem.note_type || 'outpatient'}
                      onChange={(e) => setEditingItem({...editingItem, record_type: e.target.value, note_type: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    >
                      <option value="outpatient">Outpatient</option>
                      <option value="emergency">Emergency</option>
                      <option value="inpatient">Inpatient</option>
                      <option value="day_care">Day Care</option>
                    </select>
                  </div>
                </div>

                {editingItem.chief_complaint !== undefined && (
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Chief Complaint</label>
                    <textarea
                      value={editingItem.chief_complaint || ''}
                      onChange={(e) => setEditingItem({...editingItem, chief_complaint: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {editingItem.history_of_present_illness !== undefined && (
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">History of Present Illness</label>
                    <textarea
                      value={editingItem.history_of_present_illness || ''}
                      onChange={(e) => setEditingItem({...editingItem, history_of_present_illness: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {editingItem.past_medical_history !== undefined && (
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Past Medical History</label>
                    <textarea
                      value={editingItem.past_medical_history || ''}
                      onChange={(e) => setEditingItem({...editingItem, past_medical_history: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {editingItem.family_history !== undefined && (
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Family History</label>
                    <textarea
                      value={editingItem.family_history || ''}
                      onChange={(e) => setEditingItem({...editingItem, family_history: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {editingItem.social_history !== undefined && (
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Social History</label>
                    <textarea
                      value={editingItem.social_history || ''}
                      onChange={(e) => setEditingItem({...editingItem, social_history: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {editingItem.subjective !== undefined && (
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Subjective</label>
                    <textarea
                      value={editingItem.subjective || ''}
                      onChange={(e) => setEditingItem({...editingItem, subjective: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {editingItem.objective !== undefined && (
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Objective</label>
                    <textarea
                      value={editingItem.objective || ''}
                      onChange={(e) => setEditingItem({...editingItem, objective: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {editingItem.assessment !== undefined && (
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Assessment</label>
                    <textarea
                      value={editingItem.assessment || ''}
                      onChange={(e) => setEditingItem({...editingItem, assessment: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {editingItem.plan !== undefined && (
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Plan</label>
                    <textarea
                      value={editingItem.plan || ''}
                      onChange={(e) => setEditingItem({...editingItem, plan: e.target.value})}
                      rows="2"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                  </div>
                )}

                {formError && <div className="text-sm text-[#C8553D]">{formError}</div>}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Save changes"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Save Changes
                      </>
                    )}
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => { setShowEditModal(false); setEditingItem(null); }}
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

export default ElectronicMedicalRecords;