import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  FileText,
  Pill,
  Beaker,
  Scan,
  Stethoscope,
  Utensils,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  Shield,
  Zap,
  Eye,
  Edit,
  Trash2,
  Send,
  Printer,
  Download,
  Upload,
  Filter,
  RefreshCw,
  X,
  Loader2,
  Check,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Briefcase,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  HeartPulse,
  Brain,
  Bone,
  EyeOff,
  Star,
  Award,
  Info,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  CreditCard,
  Banknote,
  Calculator,
  Settings,
  MapPin,
  Globe,
  Mail,
  Phone,
  UserPlus,
  Smartphone,
  Droplets,
  Baby,
  Activity,
  Heart,
  Clock as ClockIcon,
  User as UserIcon,
  Building2,
  Clipboard,
  Ambulance,
} from 'lucide-react';
import {
  createMedicationOrder,
  createLabOrder,
  createRadiologyOrder,
  createProcedureOrder,
  createDietaryOrder,
  updateOrderStatus,
  cancelOrder,
  searchOrders,
  filterOrders,
  checkOrderInteractions,
  generateOrderSummary,
  printOrder
} from '../features/orderEntrySlice';
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
    yellow: 'bg-[#C87D3D]',
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
    'pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'verified': { label: 'Verified', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'cancelled': { label: 'Cancelled', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'stat': { label: 'STAT', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'urgent': { label: 'Urgent', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'routine': { label: 'Routine', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'active': { label: 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
  };

  const config = statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== ORDER TYPE BADGE ====================
const OrderTypeBadge = ({ type }) => {
  const typeMap = {
    'medication': { label: 'Medication', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'laboratory': { label: 'Laboratory', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'radiology': { label: 'Radiology', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'procedure': { label: 'Procedure', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'dietary': { label: 'Dietary', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
  };

  const config = typeMap[type] || { label: type || 'Order', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== ORDER CARD ====================
const OrderCard = ({ order, onView, onPrint, onStatusUpdate }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-4 hover:bg-[#F7F5F2] transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#F7F5F2] border border-[#E8E3DC] flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#5A5A5A]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-[#1A1A1A]">#{order.id}</span>
              <OrderTypeBadge type={order.type} />
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-[#5A5A5A]">{order.patientName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StatusBadge status={order.priority} />
          <IconButton
            icon={Eye}
            onClick={() => onView(order.id)}
            tooltip="View order"
            variant="primary"
            size="sm"
          />
          <IconButton
            icon={Printer}
            onClick={() => onPrint(order.id)}
            tooltip="Print order"
            variant="default"
            size="sm"
          />
          <IconButton
            icon={Edit}
            onClick={() => onStatusUpdate(order.id)}
            tooltip="Update status"
            variant="warning"
            size="sm"
          />
        </div>
      </div>
      <div className="mt-2 text-xs text-[#5A5A5A] truncate">
        {order.details}
      </div>
    </div>
  );
};

// ==================== FORM SECTION ====================
const FormSection = ({ title, icon: Icon, children, onCancel, onSubmit, submitText, isSubmitting = false }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#E8F5EF] flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#008751]" />
          </div>
          <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">{title}</h3>
        </div>
        {onCancel && (
          <ButtonWithTooltip
            onClick={onCancel}
            tooltip="Close form"
            variant="secondary"
            size="sm"
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </ButtonWithTooltip>
        )}
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
          <ButtonWithTooltip
            type="submit"
            tooltip={submitText}
            variant="primary"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                {submitText}
              </>
            )}
          </ButtonWithTooltip>
          {onCancel && (
            <ButtonWithTooltip
              type="button"
              onClick={onCancel}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          )}
        </div>
      </form>
    </div>
  );
};

// ==================== FORM FIELD ====================
const FormField = ({ label, name, value, onChange, type = 'text', options = null, required = false, placeholder = '', rows = 3 }) => {
  const baseClass = "w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors";
  
  if (type === 'select' && options) {
    return (
      <div>
        <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
          {label} {required && <span className="text-[#C8553D]">*</span>}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={baseClass}
          required={required}
        >
          <option value="">Select {label.toLowerCase()}...</option>
          {options.map(opt => (
            <option key={typeof opt === 'string' ? opt : opt.name || opt.value} value={typeof opt === 'string' ? opt : opt.name || opt.value}>
              {typeof opt === 'string' ? opt : opt.name || opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div>
        <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
          {label} {required && <span className="text-[#C8553D]">*</span>}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          rows={rows}
          className={baseClass}
          placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
          required={required}
        />
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className="flex items-center mt-6">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(name, e.target.checked)}
          className="mr-2 h-4 w-4 rounded border-[#D8D4CD] text-[#008751] focus:ring-0"
        />
        <span className="text-sm text-[#1A1A1A]">{label}</span>
      </div>
    );
  }

  if (type === 'date') {
    return (
      <div>
        <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
          {label} {required && <span className="text-[#C8553D]">*</span>}
        </label>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={baseClass}
          required={required}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
        {label} {required && <span className="text-[#C8553D]">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={baseClass}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        required={required}
      />
    </div>
  );
};

const OrderEntrySystem = () => {
  const dispatch = useDispatch();
  const {
    orders,
    pendingOrders,
    completedOrders,
    searchTerm,
    filterBy,
    loading,
    interactions
  } = useSelector(state => state.orderEntry);

  const [activeTab, setActiveTab] = useState('medications');
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;

  // Medication Order State
  const [medicationForm, setMedicationForm] = useState({
    patientId: '',
    patientName: '',
    medication: '',
    dose: '',
    frequency: '',
    duration: '',
    route: 'oral',
    indication: '',
    instructions: '',
    isPRN: false,
    controlled: false,
    verbalOrder: false,
    orderingPhysician: '',
    nurseVerifier: ''
  });

  // Lab Order State
  const [labForm, setLabForm] = useState({
    patientId: '',
    patientName: '',
    testPanel: '',
    individualTests: [],
    priority: 'routine',
    clinicalIndication: '',
    orderingPhysician: '',
    fasting: false,
    specialInstructions: ''
  });

  // Radiology Order State
  const [radiologyForm, setRadiologyForm] = useState({
    patientId: '',
    patientName: '',
    modality: '',
    bodyPart: '',
    clinicalIndication: '',
    contrast: false,
    pregnancyStatus: 'unknown',
    orderingPhysician: '',
    priority: 'routine',
    specialInstructions: ''
  });

  // Procedure Order State
  const [procedureForm, setProcedureForm] = useState({
    patientId: '',
    patientName: '',
    procedure: '',
    bodySite: '',
    clinicalIndication: '',
    anesthesia: '',
    consentRequired: true,
    preProcedureRequirements: [],
    orderingPhysician: '',
    estimatedDuration: '',
    specialInstructions: ''
  });

  // Dietary Order State
  const [dietaryForm, setDietaryForm] = useState({
    patientId: '',
    patientName: '',
    dietType: '',
    mealPlan: '',
    culturalRestrictions: [],
    therapeuticGoals: [],
    allergies: [],
    orderingPhysician: '',
    dietitianNotes: '',
    startDate: '',
    duration: ''
  });

  // Nigerian-specific data
  const nigerianMedications = [
    { name: 'Artemether-Lumefantrine (Coartem)', category: 'Antimalarial', controlled: false },
    { name: 'Artesunate Injection', category: 'Antimalarial', controlled: false },
    { name: 'Quinine Injection', category: 'Antimalarial', controlled: false },
    { name: 'Amoxicillin', category: 'Antibiotic', controlled: false },
    { name: 'Ciprofloxacin', category: 'Antibiotic', controlled: false },
    { name: 'Metronidazole', category: 'Antibiotic', controlled: false },
    { name: 'Paracetamol', category: 'Analgesic', controlled: false },
    { name: 'Ibuprofen', category: 'NSAID', controlled: false },
    { name: 'Amlodipine', category: 'Antihypertensive', controlled: false },
    { name: 'Lisinopril', category: 'ACE Inhibitor', controlled: false },
    { name: 'Metformin', category: 'Antidiabetic', controlled: false },
    { name: 'Glibenclamide', category: 'Antidiabetic', controlled: false },
    { name: 'Furosemide', category: 'Diuretic', controlled: false },
    { name: 'Warfarin', category: 'Anticoagulant', controlled: true },
    { name: 'Heparin Injection', category: 'Anticoagulant', controlled: true },
    { name: 'Morphine Injection', category: 'Opioid', controlled: true }
  ];

  const nigerianLabTests = {
    panels: [
      { name: 'Full Blood Count (FBC)', tests: ['WBC', 'RBC', 'Hb', 'Hct', 'Platelets'] },
      { name: 'Malaria Parasite', tests: ['Thick Film', 'Thin Film'] },
      { name: 'Liver Function Test', tests: ['ALT', 'AST', 'ALP', 'Total Bilirubin', 'Albumin'] },
      { name: 'Renal Function Test', tests: ['Creatinine', 'Urea', 'Electrolytes'] },
      { name: 'Lipid Profile', tests: ['Total Cholesterol', 'HDL', 'LDL', 'Triglycerides'] },
      { name: 'Thyroid Function', tests: ['TSH', 'T3', 'T4'] },
      { name: 'HIV Screening', tests: ['HIV Antibody', 'CD4 Count'] }
    ],
    individual: [
      'Blood Glucose', 'Urinalysis', 'Stool Analysis', 'Pregnancy Test',
      'VDRL', 'Widal Test', 'Blood Group', 'Genotype', 'Electrolyte Urea Creatinine (EUC)',
      'C-Reactive Protein (CRP)', 'Erythrocyte Sedimentation Rate (ESR)'
    ]
  };

  const radiologyModalities = [
    { name: 'X-Ray', bodyParts: ['Chest', 'Abdomen', 'Pelvis', 'Extremities', 'Skull', 'Spine'] },
    { name: 'Ultrasound', bodyParts: ['Abdomen', 'Pelvis', 'Obstetric', 'Thyroid', 'Breast', 'Scrotal'] },
    { name: 'CT Scan', bodyParts: ['Head', 'Chest', 'Abdomen', 'Pelvis', 'Spine'] },
    { name: 'MRI', bodyParts: ['Brain', 'Spine', 'Joints', 'Abdomen', 'Pelvis'] },
    { name: 'Mammography', bodyParts: ['Breast'] },
    { name: 'Dental X-Ray', bodyParts: ['Teeth', 'Jaw'] }
  ];

  const procedures = [
    { name: 'Venipuncture', category: 'Diagnostic', anesthesia: 'Local/None' },
    { name: 'Lumbar Puncture', category: 'Diagnostic', anesthesia: 'Local' },
    { name: 'Ascitic Tap', category: 'Therapeutic', anesthesia: 'Local' },
    { name: 'Pleural Tap', category: 'Therapeutic', anesthesia: 'Local' },
    { name: 'Wound Dressing', category: 'Therapeutic', anesthesia: 'None' },
    { name: 'Catheter Insertion', category: 'Therapeutic', anesthesia: 'Local' },
    { name: 'NG Tube Insertion', category: 'Therapeutic', anesthesia: 'Local' },
    { name: 'Incision & Drainage', category: 'Surgical', anesthesia: 'Local' }
  ];

  const nigerianMealPlans = [
    { name: 'Regular Diet', description: 'Standard Nigerian meals with local staples' },
    { name: 'Diabetic Diet', description: 'Low glycemic index, portion controlled' },
    { name: 'Hypertensive Diet', description: 'Low salt, DASH diet adapted for Nigeria' },
    { name: 'Renal Diet', description: 'Low protein, low potassium, fluid restricted' },
    { name: 'Peptic Ulcer Diet', description: 'Bland diet, frequent small meals' },
    { name: 'High Protein Diet', description: 'For malnutrition, wound healing' },
    { name: 'Muslim Diet', description: 'Halal meals, no pork' },
    { name: 'Vegetarian Diet', description: 'Plant-based meals' }
  ];

  const handleCreateMedicationOrder = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!medicationForm.patientId || !medicationForm.patientName || !medicationForm.medication || 
        !medicationForm.dose || !medicationForm.frequency || !medicationForm.orderingPhysician || 
        !medicationForm.indication) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      dispatch(createMedicationOrder(medicationForm));
      setSuccessMessage('Medication order created successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setMedicationForm({
        patientId: '',
        patientName: '',
        medication: '',
        dose: '',
        frequency: '',
        duration: '',
        route: 'oral',
        indication: '',
        instructions: '',
        isPRN: false,
        controlled: false,
        verbalOrder: false,
        orderingPhysician: '',
        nurseVerifier: ''
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create medication order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateLabOrder = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!labForm.patientId || !labForm.patientName || !labForm.clinicalIndication || !labForm.orderingPhysician) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      dispatch(createLabOrder(labForm));
      setSuccessMessage('Laboratory order created successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLabForm({
        patientId: '',
        patientName: '',
        testPanel: '',
        individualTests: [],
        priority: 'routine',
        clinicalIndication: '',
        orderingPhysician: '',
        fasting: false,
        specialInstructions: ''
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create laboratory order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRadiologyOrder = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!radiologyForm.patientId || !radiologyForm.patientName || !radiologyForm.modality || 
        !radiologyForm.bodyPart || !radiologyForm.clinicalIndication || !radiologyForm.orderingPhysician) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      dispatch(createRadiologyOrder(radiologyForm));
      setSuccessMessage('Radiology order created successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setRadiologyForm({
        patientId: '',
        patientName: '',
        modality: '',
        bodyPart: '',
        clinicalIndication: '',
        contrast: false,
        pregnancyStatus: 'unknown',
        orderingPhysician: '',
        priority: 'routine',
        specialInstructions: ''
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create radiology order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProcedureOrder = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!procedureForm.patientId || !procedureForm.patientName || !procedureForm.procedure || 
        !procedureForm.clinicalIndication || !procedureForm.orderingPhysician) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      dispatch(createProcedureOrder(procedureForm));
      setSuccessMessage('Procedure order created successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setProcedureForm({
        patientId: '',
        patientName: '',
        procedure: '',
        bodySite: '',
        clinicalIndication: '',
        anesthesia: '',
        consentRequired: true,
        preProcedureRequirements: [],
        orderingPhysician: '',
        estimatedDuration: '',
        specialInstructions: ''
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create procedure order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateDietaryOrder = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    if (!dietaryForm.patientId || !dietaryForm.patientName || !dietaryForm.dietType || 
        !dietaryForm.startDate || !dietaryForm.orderingPhysician) {
      setErrorMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      dispatch(createDietaryOrder(dietaryForm));
      setSuccessMessage('Dietary order created successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setDietaryForm({
        patientId: '',
        patientName: '',
        dietType: '',
        mealPlan: '',
        culturalRestrictions: [],
        therapeuticGoals: [],
        allergies: [],
        orderingPhysician: '',
        dietitianNotes: '',
        startDate: '',
        duration: ''
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create dietary order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = !searchTerm ||
        order.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderingPhysician?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || order.type === filterBy || order.status === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Tabs configuration
  const tabs = [
    { id: 'medications', label: 'Medication Orders', icon: Pill },
    { id: 'laboratory', label: 'Laboratory Orders', icon: Beaker },
    { id: 'radiology', label: 'Radiology Orders', icon: Scan },
    { id: 'procedures', label: 'Procedure Orders', icon: Stethoscope },
    { id: 'dietary', label: 'Dietary Orders', icon: Utensils },
    { id: 'orders', label: 'All Orders', icon: FileText }
  ];

  const resetForm = () => {
    setMedicationForm({
      patientId: '',
      patientName: '',
      medication: '',
      dose: '',
      frequency: '',
      duration: '',
      route: 'oral',
      indication: '',
      instructions: '',
      isPRN: false,
      controlled: false,
      verbalOrder: false,
      orderingPhysician: '',
      nurseVerifier: ''
    });
    setLabForm({
      patientId: '',
      patientName: '',
      testPanel: '',
      individualTests: [],
      priority: 'routine',
      clinicalIndication: '',
      orderingPhysician: '',
      fasting: false,
      specialInstructions: ''
    });
    setRadiologyForm({
      patientId: '',
      patientName: '',
      modality: '',
      bodyPart: '',
      clinicalIndication: '',
      contrast: false,
      pregnancyStatus: 'unknown',
      orderingPhysician: '',
      priority: 'routine',
      specialInstructions: ''
    });
    setProcedureForm({
      patientId: '',
      patientName: '',
      procedure: '',
      bodySite: '',
      clinicalIndication: '',
      anesthesia: '',
      consentRequired: true,
      preProcedureRequirements: [],
      orderingPhysician: '',
      estimatedDuration: '',
      specialInstructions: ''
    });
    setDietaryForm({
      patientId: '',
      patientName: '',
      dietType: '',
      mealPlan: '',
      culturalRestrictions: [],
      therapeuticGoals: [],
      allergies: [],
      orderingPhysician: '',
      dietitianNotes: '',
      startDate: '',
      duration: ''
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Handle form field changes
  const handleMedicationChange = (name, value) => {
    setMedicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLabChange = (name, value) => {
    setLabForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRadiologyChange = (name, value) => {
    setRadiologyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProcedureChange = (name, value) => {
    setProcedureForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDietaryChange = (name, value) => {
    setDietaryForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="order-entry-system min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Order Entry System (CPOE)
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Computerized Physician Order Entry with integrated safety checks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => {
                dispatch(checkOrderInteractions());
                setSuccessMessage('Safety check completed.');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
              tooltip="Check for drug interactions"
              variant="warning"
              size="sm"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Safety Check</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                dispatch(generateOrderSummary());
                setSuccessMessage('Order summary generated.');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
              tooltip="Generate order summary"
              variant="secondary"
              size="sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Summary</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Error & Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {errorMessage}
          </span>
          <button onClick={() => setErrorMessage('')} className="text-[#C8553D] hover:text-[#A8442E]">
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
          title="Pending Orders"
          value={pendingOrders.length}
          icon={Clock}
          color="yellow"
          tooltip="Orders awaiting completion"
        />
        <StatsCard
          title="Completed Today"
          value={completedOrders.length}
          icon={CheckCircle}
          color="green"
          tooltip="Orders completed today"
        />
        <StatsCard
          title="Safety Alerts"
          value={interactions.length}
          icon={AlertTriangle}
          color="red"
          trend={interactions.length > 0 ? 'down' : 'up'}
          trendValue={interactions.length > 0 ? `${interactions.length} alerts` : 'All clear'}
          tooltip="Drug interaction alerts"
        />
        <StatsCard
          title="Total Orders"
          value={orders.length}
          icon={FileText}
          color="blue"
          tooltip="Total orders in system"
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

        {/* ==================== MEDICATION ORDERS TAB ==================== */}
        {activeTab === 'medications' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Medication Orders (E-Prescribing)</h3>
            </div>

            <FormSection
              title="New Medication Order"
              icon={Pill}
              onSubmit={handleCreateMedicationOrder}
              onCancel={resetForm}
              submitText="Create Medication Order"
              isSubmitting={isSubmitting}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Patient ID"
                  name="patientId"
                  value={medicationForm.patientId}
                  onChange={handleMedicationChange}
                  required
                  placeholder="e.g., P-2025-001"
                />
                <FormField
                  label="Patient Name"
                  name="patientName"
                  value={medicationForm.patientName}
                  onChange={handleMedicationChange}
                  required
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  label="Medication"
                  name="medication"
                  value={medicationForm.medication}
                  onChange={handleMedicationChange}
                  type="select"
                  options={nigerianMedications.map(m => m.name)}
                  required
                />
                <FormField
                  label="Dose"
                  name="dose"
                  value={medicationForm.dose}
                  onChange={handleMedicationChange}
                  required
                  placeholder="e.g., 500mg, 10ml"
                />
                <FormField
                  label="Frequency"
                  name="frequency"
                  value={medicationForm.frequency}
                  onChange={handleMedicationChange}
                  type="select"
                  options={['Once daily (OD)', 'Twice daily (BD)', 'Three times daily (TDS)', 'Four times daily (QDS)', 'As needed (PRN)', 'Immediately (STAT)']}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  label="Route"
                  name="route"
                  value={medicationForm.route}
                  onChange={handleMedicationChange}
                  type="select"
                  options={['Oral', 'IV Injection', 'IM Injection', 'Subcutaneous', 'Topical', 'Rectal', 'Inhaled']}
                />
                <FormField
                  label="Duration (days)"
                  name="duration"
                  value={medicationForm.duration}
                  onChange={handleMedicationChange}
                  type="number"
                  placeholder="e.g., 7"
                />
                <FormField
                  label="Ordering Physician"
                  name="orderingPhysician"
                  value={medicationForm.orderingPhysician}
                  onChange={handleMedicationChange}
                  required
                  placeholder="Dr. Name"
                />
                <FormField
                  label="Indication"
                  name="indication"
                  value={medicationForm.indication}
                  onChange={handleMedicationChange}
                  required
                  placeholder="e.g., Malaria, Hypertension"
                />
              </div>

              <FormField
                label="Special Instructions"
                name="instructions"
                value={medicationForm.instructions}
                onChange={handleMedicationChange}
                type="textarea"
                placeholder="Additional instructions for administration..."
                rows={2}
              />

              <div className="flex flex-wrap gap-4">
                <FormField
                  label="PRN (As needed)"
                  name="isPRN"
                  value={medicationForm.isPRN}
                  onChange={handleMedicationChange}
                  type="checkbox"
                />
                <FormField
                  label="Controlled substance"
                  name="controlled"
                  value={medicationForm.controlled}
                  onChange={handleMedicationChange}
                  type="checkbox"
                />
                <FormField
                  label="Verbal order"
                  name="verbalOrder"
                  value={medicationForm.verbalOrder}
                  onChange={handleMedicationChange}
                  type="checkbox"
                />
              </div>
            </FormSection>
          </div>
        )}

        {/* ==================== LABORATORY ORDERS TAB ==================== */}
        {activeTab === 'laboratory' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Laboratory Orders</h3>
            </div>

            <FormSection
              title="New Laboratory Order"
              icon={Beaker}
              onSubmit={handleCreateLabOrder}
              onCancel={resetForm}
              submitText="Create Laboratory Order"
              isSubmitting={isSubmitting}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Patient ID"
                  name="patientId"
                  value={labForm.patientId}
                  onChange={handleLabChange}
                  required
                  placeholder="e.g., P-2025-001"
                />
                <FormField
                  label="Patient Name"
                  name="patientName"
                  value={labForm.patientName}
                  onChange={handleLabChange}
                  required
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Test Panel"
                  name="testPanel"
                  value={labForm.testPanel}
                  onChange={handleLabChange}
                  type="select"
                  options={nigerianLabTests.panels.map(p => p.name)}
                />
                <FormField
                  label="Priority"
                  name="priority"
                  value={labForm.priority}
                  onChange={handleLabChange}
                  type="select"
                  options={['Routine', 'Urgent', 'STAT']}
                  required
                />
              </div>

              <FormField
                label="Clinical Indication"
                name="clinicalIndication"
                value={labForm.clinicalIndication}
                onChange={handleLabChange}
                required
                placeholder="Reason for test"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Ordering Physician"
                  name="orderingPhysician"
                  value={labForm.orderingPhysician}
                  onChange={handleLabChange}
                  required
                  placeholder="Dr. Name"
                />
                <FormField
                  label="Fasting Required"
                  name="fasting"
                  value={labForm.fasting}
                  onChange={handleLabChange}
                  type="checkbox"
                />
              </div>

              <FormField
                label="Special Instructions"
                name="specialInstructions"
                value={labForm.specialInstructions}
                onChange={handleLabChange}
                type="textarea"
                placeholder="Sample collection instructions, special handling..."
                rows={2}
              />
            </FormSection>
          </div>
        )}

        {/* ==================== RADIOLOGY ORDERS TAB ==================== */}
        {activeTab === 'radiology' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Radiology Orders</h3>
            </div>

            <FormSection
              title="New Radiology Order"
              icon={Scan}
              onSubmit={handleCreateRadiologyOrder}
              onCancel={resetForm}
              submitText="Create Radiology Order"
              isSubmitting={isSubmitting}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Patient ID"
                  name="patientId"
                  value={radiologyForm.patientId}
                  onChange={handleRadiologyChange}
                  required
                  placeholder="e.g., P-2025-001"
                />
                <FormField
                  label="Patient Name"
                  name="patientName"
                  value={radiologyForm.patientName}
                  onChange={handleRadiologyChange}
                  required
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Modality"
                  name="modality"
                  value={radiologyForm.modality}
                  onChange={handleRadiologyChange}
                  type="select"
                  options={radiologyModalities.map(m => m.name)}
                  required
                />
                <FormField
                  label="Body Part/Region"
                  name="bodyPart"
                  value={radiologyForm.bodyPart}
                  onChange={handleRadiologyChange}
                  type="select"
                  options={radiologyForm.modality ? radiologyModalities.find(m => m.name === radiologyForm.modality)?.bodyParts || [] : []}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Priority"
                  name="priority"
                  value={radiologyForm.priority}
                  onChange={handleRadiologyChange}
                  type="select"
                  options={['Routine', 'Urgent', 'STAT']}
                  required
                />
                <FormField
                  label="Pregnancy Status"
                  name="pregnancyStatus"
                  value={radiologyForm.pregnancyStatus}
                  onChange={handleRadiologyChange}
                  type="select"
                  options={['Unknown', 'Not Pregnant', 'Pregnant', 'Possibly Pregnant']}
                />
              </div>

              <FormField
                label="Clinical Indication"
                name="clinicalIndication"
                value={radiologyForm.clinicalIndication}
                onChange={handleRadiologyChange}
                required
                placeholder="Reason for imaging"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Ordering Physician"
                  name="orderingPhysician"
                  value={radiologyForm.orderingPhysician}
                  onChange={handleRadiologyChange}
                  required
                  placeholder="Dr. Name"
                />
                <FormField
                  label="Contrast Required"
                  name="contrast"
                  value={radiologyForm.contrast}
                  onChange={handleRadiologyChange}
                  type="checkbox"
                />
              </div>

              <FormField
                label="Special Instructions"
                name="specialInstructions"
                value={radiologyForm.specialInstructions}
                onChange={handleRadiologyChange}
                type="textarea"
                placeholder="Positioning requirements, special protocols..."
                rows={2}
              />
            </FormSection>
          </div>
        )}

        {/* ==================== PROCEDURE ORDERS TAB ==================== */}
        {activeTab === 'procedures' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Procedure Orders</h3>
            </div>

            <FormSection
              title="New Procedure Order"
              icon={Stethoscope}
              onSubmit={handleCreateProcedureOrder}
              onCancel={resetForm}
              submitText="Create Procedure Order"
              isSubmitting={isSubmitting}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Patient ID"
                  name="patientId"
                  value={procedureForm.patientId}
                  onChange={handleProcedureChange}
                  required
                  placeholder="e.g., P-2025-001"
                />
                <FormField
                  label="Patient Name"
                  name="patientName"
                  value={procedureForm.patientName}
                  onChange={handleProcedureChange}
                  required
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Procedure"
                  name="procedure"
                  value={procedureForm.procedure}
                  onChange={handleProcedureChange}
                  type="select"
                  options={procedures.map(p => p.name)}
                  required
                />
                <FormField
                  label="Body Site"
                  name="bodySite"
                  value={procedureForm.bodySite}
                  onChange={handleProcedureChange}
                  placeholder="e.g., Right arm, Left thigh"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Anesthesia"
                  name="anesthesia"
                  value={procedureForm.anesthesia}
                  onChange={handleProcedureChange}
                  type="select"
                  options={['None/Local', 'Local', 'Regional', 'General', 'Conscious Sedation']}
                />
                <FormField
                  label="Estimated Duration"
                  name="estimatedDuration"
                  value={procedureForm.estimatedDuration}
                  onChange={handleProcedureChange}
                  placeholder="e.g., 30 minutes, 2 hours"
                />
              </div>

              <FormField
                label="Clinical Indication"
                name="clinicalIndication"
                value={procedureForm.clinicalIndication}
                onChange={handleProcedureChange}
                required
                placeholder="Reason for procedure"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Ordering Physician"
                  name="orderingPhysician"
                  value={procedureForm.orderingPhysician}
                  onChange={handleProcedureChange}
                  required
                  placeholder="Dr. Name"
                />
                <FormField
                  label="Consent Form Required"
                  name="consentRequired"
                  value={procedureForm.consentRequired}
                  onChange={handleProcedureChange}
                  type="checkbox"
                />
              </div>

              <FormField
                label="Special Instructions"
                name="specialInstructions"
                value={procedureForm.specialInstructions}
                onChange={handleProcedureChange}
                type="textarea"
                placeholder="Pre-procedure requirements, positioning, equipment needed..."
                rows={2}
              />
            </FormSection>
          </div>
        )}

        {/* ==================== DIETARY ORDERS TAB ==================== */}
        {activeTab === 'dietary' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Dietary Orders</h3>
            </div>

            <FormSection
              title="New Dietary Order"
              icon={Utensils}
              onSubmit={handleCreateDietaryOrder}
              onCancel={resetForm}
              submitText="Create Dietary Order"
              isSubmitting={isSubmitting}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Patient ID"
                  name="patientId"
                  value={dietaryForm.patientId}
                  onChange={handleDietaryChange}
                  required
                  placeholder="e.g., P-2025-001"
                />
                <FormField
                  label="Patient Name"
                  name="patientName"
                  value={dietaryForm.patientName}
                  onChange={handleDietaryChange}
                  required
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Diet Type"
                  name="dietType"
                  value={dietaryForm.dietType}
                  onChange={handleDietaryChange}
                  type="select"
                  options={nigerianMealPlans.map(p => p.name)}
                  required
                />
                <FormField
                  label="Start Date"
                  name="startDate"
                  value={dietaryForm.startDate}
                  onChange={handleDietaryChange}
                  type="date"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Duration (days)"
                  name="duration"
                  value={dietaryForm.duration}
                  onChange={handleDietaryChange}
                  type="number"
                  placeholder="e.g., 7"
                />
                <FormField
                  label="Ordering Physician"
                  name="orderingPhysician"
                  value={dietaryForm.orderingPhysician}
                  onChange={handleDietaryChange}
                  required
                  placeholder="Dr. Name"
                />
              </div>

              <FormField
                label="Therapeutic Goals"
                name="therapeuticGoals"
                value={dietaryForm.therapeuticGoals.join(', ')}
                onChange={(name, value) => handleDietaryChange(name, value.split(',').map(g => g.trim()))}
                type="textarea"
                placeholder="Weight loss, blood sugar control, etc."
                rows={2}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Cultural Restrictions"
                  name="culturalRestrictions"
                  value={dietaryForm.culturalRestrictions.join(', ')}
                  onChange={(name, value) => handleDietaryChange(name, value.split(',').map(r => r.trim()))}
                  placeholder="Halal, Vegetarian, No pork, etc."
                />
                <FormField
                  label="Known Allergies"
                  name="allergies"
                  value={dietaryForm.allergies.join(', ')}
                  onChange={(name, value) => handleDietaryChange(name, value.split(',').map(a => a.trim()))}
                  placeholder="Peanuts, Shellfish, etc."
                />
              </div>

              <FormField
                label="Dietitian Notes"
                name="dietitianNotes"
                value={dietaryForm.dietitianNotes}
                onChange={handleDietaryChange}
                type="textarea"
                placeholder="Additional nutritional recommendations..."
                rows={2}
              />
            </FormSection>
          </div>
        )}

        {/* ==================== ALL ORDERS TAB ==================== */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">All Orders</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchOrders(e.target.value))}
                    className="pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors w-full sm:w-48"
                  />
                </div>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterOrders(e.target.value))}
                  className="px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="all">All Orders</option>
                  <option value="medication">Medications</option>
                  <option value="laboratory">Laboratory</option>
                  <option value="radiology">Radiology</option>
                  <option value="procedure">Procedures</option>
                  <option value="dietary">Dietary</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-[#008751] animate-spin mx-auto mb-3" />
                <p className="text-[#5A5A5A] text-sm">Loading orders...</p>
              </div>
            ) : paginatedOrders.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <FileText className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No orders found</p>
                <p className="text-sm text-[#B0A89E] mt-1">
                  {searchTerm ? 'Try adjusting your search or filters' : 'Create your first order using the tabs above'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onView={() => {}}
                    onPrint={() => {}}
                    onStatusUpdate={() => {}}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > itemsPerPage && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-[10px] text-[#5A5A5A]">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
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
                    Page {currentPage} of {Math.ceil(filteredOrders.length / itemsPerPage)}
                  </span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setCurrentPage(Math.min(Math.ceil(filteredOrders.length / itemsPerPage), currentPage + 1))}
                    tooltip="Next page"
                    variant="default"
                    disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderEntrySystem;