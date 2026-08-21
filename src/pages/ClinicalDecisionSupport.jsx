import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import {
  Brain,
  AlertTriangle,
  Pill,
  Calculator,
  BookOpen,
  Activity,
  Search,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Heart,
  Droplet,
  Baby,
  Users,
  TrendingUp,
  Shield,
  Stethoscope,
  Thermometer,
  Weight,
  Calendar,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Edit,
  Loader2
} from 'lucide-react';
import {
  checkDrugInteractions,
  checkAllergies,
  calculateDose,
  getClinicalGuidelines,
  calculateRisk,
  addPatientAlert,
  dismissAlert,
  searchGuidelines,
  updatePatientProfile,
  setRiskCalculations,
  clearError
} from '../features/cdsSlice';
import { selectCurrentPatient } from '../features/patientSlice';
import Pagination from '../components/Pagination';
import { ErrorModal } from '../components/ErrorModal';

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
  const sizeClasses = { sm: 'p-1', md: 'p-1.5', lg: 'p-2' };
  const iconSizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
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
            {subValue && <p className="text-xs text-[#5A5A5A] mt-0.5">{subValue}</p>}
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

// ==================== STATUS BADGE (reused) ====================
const StatusBadge = ({ status, type = 'default' }) => {
  const statusMap = {
    'active': { label: 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'inactive': { label: 'Inactive', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
    'completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'resolved': { label: 'Resolved', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
  };
  const config = statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== MAIN COMPONENT ====================
const ClinicalDecisionSupport = () => {
  const dispatch = useDispatch();
  const currentPatient = useSelector(selectCurrentPatient);
  const {
    drugInteractions,
    allergyAlerts,
    dosingRecommendations,
    clinicalGuidelines,
    riskCalculations,
    patientAlerts,
    searchResults,
    loading,
    error
  } = useSelector(state => state.cds);
  const currentTenantId = useSelector(state => state.tenant?.currentTenant?.id);

  const [activeTab, setActiveTab] = useState('interactions');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drug Interaction Checker State
  const [drugCheckForm, setDrugCheckForm] = useState({
    drugs: [''],
    patientProfile: {
      age: '',
      weight: '',
      gender: '',
      renalFunction: '',
      hepaticFunction: '',
      allergies: [],
      pregnancyStatus: '',
      comorbidities: []
    }
  });

  // Allergy Checker State
  const [allergyCheckForm, setAllergyCheckForm] = useState({
    medication: '',
    patientAllergies: [],
    crossReactivity: true
  });

  // Dosing Calculator State
  const [dosingForm, setDosingForm] = useState({
    drug: '',
    indication: '',
    patientWeight: '',
    age: '',
    renalFunction: 'normal',
    hepaticFunction: 'normal',
    pregnancyCategory: '',
    dosingFrequency: 'daily'
  });

  // Risk Calculator State
  const [riskForm, setRiskForm] = useState({
    calculator: 'cardiovascular',
    patientData: {
      age: '',
      gender: '',
      bloodPressure: '',
      cholesterol: '',
      smoker: false,
      diabetic: false,
      familyHistory: false
    }
  });

  const [isCalculatingRisk, setIsCalculatingRisk] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '', details: null });

  // Nigerian-specific data (keep as before)
  const nigerianDrugInteractions = { /* ... same as original ... */ };
  const herbalInteractions = { /* ... same as original ... */ };
  const nigerianGuidelines = [ /* ... same as original ... */ ];

  // Risk calculation functions (keep as before)
  const calculateCardiovascularRisk = (data) => { /* ... */ };
  const calculateDiabetesRisk = (data) => { /* ... */ };

  const handleDrugInteractionCheck = () => {
    const interactions = [];
    const checkedDrugs = drugCheckForm.drugs.filter(drug => drug.trim() !== '');
    checkedDrugs.forEach((drug, index) => {
      const drugKey = drug.toLowerCase().replace(/\s+/g, '-');
      if (nigerianDrugInteractions[drugKey]) {
        nigerianDrugInteractions[drugKey].interactions.forEach(interaction => {
          if (checkedDrugs.includes(interaction.drug)) {
            interactions.push({
              drug1: drug,
              drug2: interaction.drug,
              severity: interaction.severity,
              description: interaction.description
            });
          }
        });
      }
    });
    dispatch(checkDrugInteractions(interactions));
    setSuccessMessage('Interaction check completed.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAllergyCheck = () => {
    const alerts = [];
    const medication = allergyCheckForm.medication.toLowerCase();
    allergyCheckForm.patientAllergies.forEach(allergy => {
      if (medication.includes(allergy.toLowerCase())) {
        alerts.push({
          type: 'allergy',
          severity: 'severe',
          message: `Patient allergic to ${allergy} - contained in ${allergyCheckForm.medication}`,
          recommendation: 'Do not administer. Seek alternative medication.'
        });
      }
    });
    if (allergyCheckForm.crossReactivity) {
      if (medication.includes('penicillin') && allergyCheckForm.patientAllergies.includes('cephalosporins')) {
        alerts.push({
          type: 'cross-reactivity',
          severity: 'moderate',
          message: 'Potential cross-reactivity between penicillin and cephalosporins',
          recommendation: 'Use with caution or seek alternative.'
        });
      }
    }
    dispatch(checkAllergies(alerts));
    setSuccessMessage('Allergy check completed.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDoseCalculation = () => {
    const { drug, patientWeight, age, renalFunction, hepaticFunction, dosingFrequency } = dosingForm;
    let dose = 0;
    let frequency = '';
    let adjustments = [];
    if (age < 12) {
      const adultDose = 100;
      dose = (parseFloat(patientWeight) / 70) * adultDose;
      adjustments.push('Pediatric dose calculated using weight-based formula');
    } else {
      dose = 100;
    }
    if (renalFunction === 'severe') { dose *= 0.5; adjustments.push('Dose reduced by 50% due to severe renal impairment'); }
    if (hepaticFunction === 'severe') { dose *= 0.5; adjustments.push('Dose reduced by 50% due to severe hepatic impairment'); }
    switch (dosingFrequency) {
      case 'daily': frequency = 'Once daily'; break;
      case 'bd': frequency = 'Twice daily'; break;
      case 'tds': frequency = 'Three times daily'; break;
      case 'qds': frequency = 'Four times daily'; break;
      default: frequency = 'As directed';
    }
    dispatch(calculateDose({
      drug,
      calculatedDose: dose,
      frequency,
      adjustments,
      monitoring: 'Monitor for adverse effects and therapeutic response'
    }));
    setSuccessMessage('Dose calculated.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRiskCalculation = async () => {
    let result;
    try {
      switch (riskForm.calculator) {
        case 'cardiovascular':
          result = calculateCardiovascularRisk(riskForm.patientData);
          break;
        case 'diabetes':
          result = calculateDiabetesRisk(riskForm.patientData);
          break;
        default:
          result = { score: 0, riskPercentage: 0, riskCategory: 'Unknown', recommendations: [] };
      }
    } catch (calcError) {
      setErrorModal({
        isOpen: true,
        title: 'Calculation Error',
        message: calcError.message || 'Failed to calculate risk. Please check your input values.',
        details: null,
      });
      return;
    }
    dispatch(setRiskCalculations(result));
    setIsCalculatingRisk(true);
    try {
      await dispatch(calculateRisk({
        ...result,
        calculator: riskForm.calculator,
        patient: currentPatient?.id,
        tenant: currentTenantId,
      })).unwrap();
      setSuccessMessage('Risk calculation saved.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const details = err?.data && typeof err.data === 'object' ? err.data : null;
      const message = err?.message || 'Failed to save calculation. Your result is still displayed locally.';
      setErrorModal({
        isOpen: true,
        title: 'Save Error',
        message,
        details,
      });
    } finally {
      setIsCalculatingRisk(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'major': return 'text-[#C8553D] bg-[#F5EDEA] border-[#E8D6D0]';
      case 'moderate': return 'text-[#C87D3D] bg-[#F5F0EA] border-[#F0E8DC]';
      case 'minor': return 'text-[#008751] bg-[#E8F5EF] border-[#C8E0D5]';
      default: return 'text-[#5A5A5A] bg-[#F0EDE8] border-[#E8E3DC]';
    }
  };

  const getRiskColor = (category) => {
    switch (category) {
      case 'High': return 'text-[#C8553D] bg-[#F5EDEA]';
      case 'Moderate': return 'text-[#C87D3D] bg-[#F5F0EA]';
      case 'Low': return 'text-[#2D7D46] bg-[#EAF3EE]';
      default: return 'text-[#5A5A5A] bg-[#F0EDE8]';
    }
  };

  const filteredGuidelines = (clinicalGuidelines || []).filter(guideline =>
    guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guideline.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedGuidelines = filteredGuidelines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (activeTab === 'guidelines') {
      dispatch(getClinicalGuidelines());
    }
  }, [activeTab, dispatch]);

  // Tabs configuration
  const tabs = [
    { id: 'interactions', label: 'Drug Interactions', icon: Pill },
    { id: 'allergies', label: 'Allergy Alerts', icon: AlertTriangle },
    { id: 'dosing', label: 'Dosing Calculator', icon: Calculator },
    { id: 'guidelines', label: 'Clinical Guidelines', icon: BookOpen },
    { id: 'risk', label: 'Risk Calculators', icon: Activity },
    { id: 'alerts', label: 'Patient Alerts', icon: AlertCircle }
  ];

  // Compute stats
  const totalInteractions = drugInteractions.length;
  const totalAllergies = allergyAlerts.length;
  const totalAlerts = patientAlerts.length;
  const totalGuidelines = (clinicalGuidelines || []).length;

  return (
    <div className="clinical-decision-support min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Clinical Decision Support
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Intelligent healthcare decision-making system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => {
                // Refresh all data actions
                dispatch(getClinicalGuidelines());
                setSuccessMessage('Data refreshed.');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
              tooltip="Refresh data"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
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
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
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
          title="Drug Interactions"
          value={totalInteractions}
          icon={Pill}
          color="blue"
          tooltip="Total identified drug-drug interactions"
        />
        <StatsCard
          title="Allergy Alerts"
          value={totalAllergies}
          icon={AlertTriangle}
          color="red"
          tooltip="Total allergy alerts for current patient"
        />
        <StatsCard
          title="Patient Alerts"
          value={totalAlerts}
          icon={AlertCircle}
          color="warm"
          tooltip="Total active patient alerts"
        />
        <StatsCard
          title="Clinical Guidelines"
          value={totalGuidelines}
          icon={BookOpen}
          color="green"
          tooltip="Available clinical guidelines"
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

        {/* Controls - Search for guidelines only */}
        {activeTab === 'guidelines' && (
          <div className="mb-4">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
              <input
                type="text"
                placeholder="Search guidelines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* ==================== TAB CONTENT ==================== */}

        {/* Interactions Tab */}
        {activeTab === 'interactions' && (
          <div>
            <div className="bg-white border border-[#E8E3DC] p-5">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Drug-Drug Interaction Checker</h3>
              <div className="space-y-3">
                {drugCheckForm.drugs.map((drug, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={drug}
                      onChange={(e) => {
                        const newDrugs = [...drugCheckForm.drugs];
                        newDrugs[index] = e.target.value;
                        setDrugCheckForm({...drugCheckForm, drugs: newDrugs});
                      }}
                      placeholder={`Medication ${index + 1}`}
                      className="flex-1 px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    />
                    {drugCheckForm.drugs.length > 1 && (
                      <IconButton
                        icon={X}
                        onClick={() => {
                          const newDrugs = drugCheckForm.drugs.filter((_, i) => i !== index);
                          setDrugCheckForm({...drugCheckForm, drugs: newDrugs});
                        }}
                        tooltip="Remove medication"
                        variant="danger"
                        size="sm"
                      />
                    )}
                  </div>
                ))}
                <ButtonWithTooltip
                  onClick={() => setDrugCheckForm({...drugCheckForm, drugs: [...drugCheckForm.drugs, '']})}
                  tooltip="Add another medication"
                  variant="secondary"
                  size="sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Medication
                </ButtonWithTooltip>
              </div>
              <div className="mt-4">
                <ButtonWithTooltip
                  onClick={handleDrugInteractionCheck}
                  tooltip="Check for interactions"
                  variant="primary"
                  className="w-full justify-center"
                >
                  <Search className="w-3.5 h-3.5" />
                  Check Interactions
                </ButtonWithTooltip>
              </div>
            </div>

            {/* Interaction Results */}
            {drugInteractions.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Results</h4>
                {drugInteractions.map((interaction, index) => (
                  <div key={index} className={`p-4 border ${getSeverityColor(interaction.severity)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#1A1A1A]">{interaction.drug1} + {interaction.drug2}</span>
                      <StatusBadge status={interaction.severity} />
                    </div>
                    <p className="text-sm text-[#5A5A5A]">{interaction.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Allergies Tab */}
        {activeTab === 'allergies' && (
          <div>
            <div className="bg-white border border-[#E8E3DC] p-5">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Allergy Alert System</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Medication
                  </label>
                  <input
                    type="text"
                    value={allergyCheckForm.medication}
                    onChange={(e) => setAllergyCheckForm({...allergyCheckForm, medication: e.target.value})}
                    placeholder="Enter medication name"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Patient Allergies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={allergyCheckForm.patientAllergies.join(', ')}
                    onChange={(e) => setAllergyCheckForm({
                      ...allergyCheckForm,
                      patientAllergies: e.target.value.split(',').map(a => a.trim())
                    })}
                    placeholder="penicillin, sulfa, etc."
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="crossReactivity"
                  checked={allergyCheckForm.crossReactivity}
                  onChange={(e) => setAllergyCheckForm({...allergyCheckForm, crossReactivity: e.target.checked})}
                  className="mr-2 accent-[#008751]"
                />
                <label htmlFor="crossReactivity" className="text-xs text-[#5A5A5A]">Check for cross-reactivity</label>
              </div>
              <div className="mt-4">
                <ButtonWithTooltip
                  onClick={handleAllergyCheck}
                  tooltip="Check allergies"
                  variant="danger"
                  className="w-full justify-center"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Check Allergies
                </ButtonWithTooltip>
              </div>
            </div>

            {/* Allergy Alerts */}
            {allergyAlerts.length > 0 && (
              <div className="mt-4 space-y-3">
                <h4 className="text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Alerts</h4>
                {allergyAlerts.map((alert, index) => (
                  <div key={index} className="p-4 bg-[#F5EDEA] border border-[#E8D6D0]">
                    <div className="flex items-center mb-1">
                      <AlertTriangle className="w-4 h-4 text-[#C8553D] mr-2" />
                      <span className="text-sm font-medium text-[#C8553D]">{alert.type.toUpperCase()}</span>
                    </div>
                    <p className="text-sm text-[#1A1A1A] mb-1">{alert.message}</p>
                    <p className="text-xs text-[#5A5A5A]">{alert.recommendation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dosing Tab */}
        {activeTab === 'dosing' && (
          <div>
            <div className="bg-white border border-[#E8E3DC] p-5">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Dosing Calculator</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Drug</label>
                  <select
                    value={dosingForm.drug}
                    onChange={(e) => setDosingForm({...dosingForm, drug: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  >
                    <option value="">Select drug</option>
                    <option value="paracetamol">Paracetamol</option>
                    <option value="amoxicillin">Amoxicillin</option>
                    <option value="metformin">Metformin</option>
                    <option value="amlodipine">Amlodipine</option>
                    <option value="artemether-lumefantrine">Artemether-Lumefantrine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={dosingForm.patientWeight}
                    onChange={(e) => setDosingForm({...dosingForm, patientWeight: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Age (years)</label>
                  <input
                    type="number"
                    value={dosingForm.age}
                    onChange={(e) => setDosingForm({...dosingForm, age: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Renal Function</label>
                  <select
                    value={dosingForm.renalFunction}
                    onChange={(e) => setDosingForm({...dosingForm, renalFunction: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  >
                    <option value="normal">Normal</option>
                    <option value="mild">Mild impairment</option>
                    <option value="moderate">Moderate impairment</option>
                    <option value="severe">Severe impairment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Hepatic Function</label>
                  <select
                    value={dosingForm.hepaticFunction}
                    onChange={(e) => setDosingForm({...dosingForm, hepaticFunction: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  >
                    <option value="normal">Normal</option>
                    <option value="mild">Mild impairment</option>
                    <option value="moderate">Moderate impairment</option>
                    <option value="severe">Severe impairment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Frequency</label>
                  <select
                    value={dosingForm.dosingFrequency}
                    onChange={(e) => setDosingForm({...dosingForm, dosingFrequency: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  >
                    <option value="daily">Once daily</option>
                    <option value="bd">Twice daily</option>
                    <option value="tds">Three times daily</option>
                    <option value="qds">Four times daily</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <ButtonWithTooltip
                  onClick={handleDoseCalculation}
                  tooltip="Calculate dose"
                  variant="success"
                  className="w-full justify-center"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Calculate Dose
                </ButtonWithTooltip>
              </div>
            </div>

            {/* Dosing Results */}
            {dosingRecommendations && (
              <div className="mt-4 bg-[#EAF3EE] border border-[#D0E3D8] p-5">
                <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4 flex items-center">
                  <Calculator className="w-4 h-4 mr-2 text-[#008751]" />
                  Dosing Recommendation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Calculated Dose</p>
                    <p className="text-2xl font-bold text-[#2D7D46]">{dosingRecommendations.calculatedDose} mg</p>
                    <p className="text-sm text-[#5A5A5A]">{dosingRecommendations.frequency}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Adjustments</p>
                    <ul className="text-sm space-y-1">
                      {(dosingRecommendations.adjustments || []).map((adj, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-3.5 h-3.5 text-[#2D7D46] mr-1.5" />
                          {adj}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white border border-[#D8D4CD]">
                  <p className="text-xs text-[#5A5A5A] flex items-center">
                    <Info className="w-3.5 h-3.5 mr-1.5 text-[#008751]" />
                    {dosingRecommendations.monitoring || 'Monitor for adverse effects and therapeutic response.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Guidelines Tab */}
        {activeTab === 'guidelines' && (
          <div>
            <div className="space-y-4">
              {loading && paginatedGuidelines.length === 0 ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-[#008751] animate-spin mx-auto mb-3" />
                  <p className="text-[#5A5A5A] text-sm">Loading guidelines...</p>
                </div>
              ) : paginatedGuidelines.length === 0 ? (
                <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                  <BookOpen className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                  <p className="text-[#5A5A5A] font-medium">No guidelines found</p>
                  <p className="text-sm text-[#B0A89E] mt-1">Try adjusting your search</p>
                </div>
              ) : (
                paginatedGuidelines.map(guideline => (
                  <div key={guideline.id} className="bg-white border border-[#E8E3DC] p-5 hover:border-[#008751] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-display font-semibold text-[#1A1A1A]">{guideline.title}</h4>
                        <p className="text-xs text-[#5A5A5A]">{guideline.category}</p>
                      </div>
                      <div className="text-right text-xs text-[#5A5A5A]">
                        <p>Updated: {new Date(guideline.lastUpdated).toLocaleDateString('en-NG')}</p>
                        <p className="text-[#B0A89E]">{guideline.authority}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#5A5A5A] mt-2">{guideline.description}</p>
                    <div className="mt-3">
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Key Recommendations</p>
                      <ul className="mt-1 space-y-1">
                        {(guideline.recommendations || []).map((rec, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-[#2D7D46] mr-1.5 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
              {/* Pagination for guidelines */}
              {filteredGuidelines.length > itemsPerPage && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-[10px] text-[#5A5A5A]">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredGuidelines.length)} of {filteredGuidelines.length}
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
                    <span className="text-xs text-[#5A5A5A]">Page {currentPage} of {Math.ceil(filteredGuidelines.length / itemsPerPage)}</span>
                    <IconButton
                      icon={ChevronRight}
                      onClick={() => setCurrentPage(Math.min(Math.ceil(filteredGuidelines.length / itemsPerPage), currentPage + 1))}
                      tooltip="Next page"
                      variant="default"
                      disabled={currentPage === Math.ceil(filteredGuidelines.length / itemsPerPage)}
                      size="sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Risk Tab */}
        {activeTab === 'risk' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calculator Selection */}
              <div className="bg-white border border-[#E8E3DC] p-5">
                <h4 className="text-xs font-medium text-[#5A5A5A] uppercase tracking-wider mb-4">Select Calculator</h4>
                <div className="space-y-3">
                  {[
                    { id: 'cardiovascular', label: 'Cardiovascular Risk', icon: Heart, desc: '10-year CVD risk assessment' },
                    { id: 'diabetes', label: 'Diabetes Risk', icon: Droplet, desc: 'Type 2 diabetes risk score' },
                    { id: 'pregnancy', label: 'Pregnancy Risk', icon: Baby, desc: 'Maternal risk stratification' }
                  ].map(calc => (
                    <button
                      key={calc.id}
                      onClick={() => setRiskForm({...riskForm, calculator: calc.id})}
                      className={`w-full p-4 border text-left transition-colors ${
                        riskForm.calculator === calc.id
                          ? 'border-[#008751] bg-[#E8F5EF]'
                          : 'border-[#E8E3DC] hover:border-[#D8D4CD]'
                      }`}
                    >
                      <div className="flex items-center">
                        <calc.icon className="w-5 h-5 mr-3 text-[#008751]" />
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">{calc.label}</p>
                          <p className="text-xs text-[#5A5A5A]">{calc.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculator Form */}
              <div className="bg-white border border-[#E8E3DC] p-5">
                {riskForm.calculator === 'cardiovascular' && (
                  <div>
                    <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Cardiovascular Risk Assessment</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Age</label>
                          <input
                            type="number"
                            value={riskForm.patientData.age}
                            onChange={(e) => setRiskForm({
                              ...riskForm,
                              patientData: {...riskForm.patientData, age: e.target.value}
                            })}
                            className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Gender</label>
                          <select
                            value={riskForm.patientData.gender}
                            onChange={(e) => setRiskForm({
                              ...riskForm,
                              patientData: {...riskForm.patientData, gender: e.target.value}
                            })}
                            className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Blood Pressure (sys/dia)</label>
                        <input
                          type="text"
                          placeholder="120/80"
                          value={riskForm.patientData.bloodPressure}
                          onChange={(e) => setRiskForm({
                            ...riskForm,
                            patientData: {...riskForm.patientData, bloodPressure: e.target.value}
                          })}
                          className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Total Cholesterol (mg/dL)</label>
                        <input
                          type="number"
                          value={riskForm.patientData.cholesterol}
                          onChange={(e) => setRiskForm({
                            ...riskForm,
                            patientData: {...riskForm.patientData, cholesterol: e.target.value}
                          })}
                          className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center text-sm text-[#5A5A5A]">
                          <input
                            type="checkbox"
                            checked={riskForm.patientData.smoker}
                            onChange={(e) => setRiskForm({
                              ...riskForm,
                              patientData: {...riskForm.patientData, smoker: e.target.checked}
                            })}
                            className="mr-2 accent-[#008751]"
                          />
                          Current smoker
                        </label>
                        <label className="flex items-center text-sm text-[#5A5A5A]">
                          <input
                            type="checkbox"
                            checked={riskForm.patientData.diabetic}
                            onChange={(e) => setRiskForm({
                              ...riskForm,
                              patientData: {...riskForm.patientData, diabetic: e.target.checked}
                            })}
                            className="mr-2 accent-[#008751]"
                          />
                          Diabetic
                        </label>
                        <label className="flex items-center text-sm text-[#5A5A5A]">
                          <input
                            type="checkbox"
                            checked={riskForm.patientData.familyHistory}
                            onChange={(e) => setRiskForm({
                              ...riskForm,
                              patientData: {...riskForm.patientData, familyHistory: e.target.checked}
                            })}
                            className="mr-2 accent-[#008751]"
                          />
                          Family history of CVD
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <ButtonWithTooltip
                    onClick={handleRiskCalculation}
                    tooltip="Calculate risk"
                    variant="primary"
                    className="w-full justify-center"
                    disabled={isCalculatingRisk}
                  >
                    {isCalculatingRisk ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Activity className="w-3.5 h-3.5" />
                        Calculate Risk
                      </>
                    )}
                  </ButtonWithTooltip>
                </div>
              </div>
            </div>

            {/* Risk Results */}
            {riskCalculations && (
              <div className="mt-6 bg-white border border-[#E8E3DC] p-5">
                <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Risk Assessment Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#008751]">{riskCalculations.score}</p>
                    <p className="text-xs text-[#5A5A5A]">Risk Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#C8553D]">{riskCalculations.riskPercentage}%</p>
                    <p className="text-xs text-[#5A5A5A]">Risk Percentage</p>
                  </div>
                  <div className="text-center">
                    <span className={`inline-block px-4 py-2 text-sm font-medium rounded ${getRiskColor(riskCalculations.riskCategory)}`}>
                      {riskCalculations.riskCategory} Risk
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-2">Recommendations</p>
                  <ul className="space-y-1">
                    {(riskCalculations.recommendations || []).map((rec, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <Shield className="w-3.5 h-3.5 text-[#008751] mr-1.5 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div>
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Patient Alerts & Notifications</h3>
            {patientAlerts.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <AlertCircle className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No active alerts</p>
                <p className="text-sm text-[#B0A89E] mt-1">All clear</p>
              </div>
            ) : (
              <div className="space-y-3">
                {patientAlerts.map(alert => (
                  <div key={alert.id} className={`p-4 border ${
                    alert.priority === 'high' ? 'bg-[#F5EDEA] border-[#E8D6D0]' :
                    alert.priority === 'medium' ? 'bg-[#F5F0EA] border-[#F0E8DC]' :
                    'bg-[#E8F5EF] border-[#C8E0D5]'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <AlertCircle className={`w-4 h-4 mr-2 ${
                          alert.priority === 'high' ? 'text-[#C8553D]' :
                          alert.priority === 'medium' ? 'text-[#C87D3D]' :
                          'text-[#008751]'
                        }`} />
                        <span className="text-sm font-medium text-[#1A1A1A]">{alert.title}</span>
                      </div>
                      <IconButton
                        icon={X}
                        onClick={() => dispatch(dismissAlert(alert.id))}
                        tooltip="Dismiss alert"
                        variant="default"
                        size="sm"
                      />
                    </div>
                    <p className="text-sm text-[#5A5A5A] mb-2">{alert.message}</p>
                    <div className="flex items-center justify-between text-xs text-[#B0A89E]">
                      <span>Patient: {alert.patientName}</span>
                      <span>{new Date(alert.timestamp).toLocaleString('en-NG')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />
    </div>
  );
};

export default ClinicalDecisionSupport;