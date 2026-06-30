import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
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
  Clock
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
  setRiskCalculations
} from '../features/cdsSlice';
import { selectCurrentPatient } from '../features/patientSlice';
import Pagination from '../components/Pagination';
import { ErrorModal } from '../components/ErrorModal';

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
    loading
  } = useSelector(state => state.cds);
  const currentTenantId = useSelector(state => state.tenant?.currentTenant?.id);

  const [activeTab, setActiveTab] = useState('interactions');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Clinical Guidelines Search
  const [guidelineSearch, setGuidelineSearch] = useState('');
  const [isCalculatingRisk, setIsCalculatingRisk] = useState(false);

  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '', details: null });

  // Nigerian-specific drug interactions database
  const nigerianDrugInteractions = {
    'artemether-lumefantrine': {
      interactions: [
        { drug: 'metoclopramide', severity: 'moderate', description: 'May reduce antimalarial efficacy' },
        { drug: 'cimetidine', severity: 'moderate', description: 'May increase lumefantrine levels' },
        { drug: 'erythromycin', severity: 'major', description: 'Risk of QT prolongation' },
        { drug: 'amiodarone', severity: 'major', description: 'Risk of QT prolongation and reduced efficacy.' },
        { drug: 'grapefruit juice', severity: 'moderate', description: 'Risk of QT prolongation and reduced efficacy.' },
        { drug: 'st. john\'s wort', severity: 'moderate', description: 'Risk of QT prolongation and reduced efficacy.' },
      ]
    },
    'amodiaquine': {
      interactions: [
        { drug: 'artemether-lumefantrine', severity: 'major', description: 'Increased risk of QT prolongation' },
        { drug: 'halofantrine', severity: 'major', description: 'Risk of fatal arrhythmias' },
        { drug: 'mefloquine', severity: 'moderate', description: 'Increased CNS toxicity' }
      ]
    },
    'ciprofloxacin': {
      interactions: [
        { drug: 'theophylline', severity: 'major', description: 'Increased theophylline levels' },
        { drug: 'warfarin', severity: 'moderate', description: 'Enhanced anticoagulant effect' },
        { drug: 'nsaids', severity: 'moderate', description: 'Increased seizure risk' },
        { drug: 'dairy products', severity: 'minor', description: 'Reduced absorption with dairy/antacids.' },
        { drug: 'antacids', severity: 'minor', description: 'Reduced absorption with dairy/antacids.' },
      ]
    },
    'metronidazole': {
      interactions: [
        { drug: 'alcohol', severity: 'major', description: 'Disulfiram-like reaction with alcohol.' },
        { drug: 'warfarin', severity: 'major', description: 'Increased bleeding risk with Warfarin.' },
      ]
    }
  };

  // Nigerian herbs and drug interactions
  const herbalInteractions = {
    'agbo': {
      interactions: [
        { drug: 'warfarin', severity: 'major', description: 'May increase bleeding risk' },
        { drug: 'digoxin', severity: 'moderate', description: 'May alter digoxin levels' },
        { drug: 'paracetamol', severity: 'moderate', description: 'Potential for liver toxicity when combined with Paracetamol.' },
        { drug: 'antihypertensives', severity: 'moderate', description: 'May interfere with blood pressure control.' },
      ]
    },
    'dogoyaro': {
      interactions: [
        { drug: 'antidiabetics', severity: 'moderate', description: 'May enhance hypoglycemic effect' },
        { drug: 'antihypertensives', severity: 'moderate', description: 'May potentiate blood pressure reduction' }
      ]
    },
    'bitter_leaf': {
      interactions: [
        { drug: 'oral contraceptives', severity: 'moderate', description: 'May reduce contraceptive efficacy' }
      ]
    }
  };

  // Clinical guidelines database
  const nigerianGuidelines = [
    {
      id: 1,
      title: 'NHIS Malaria Treatment Guidelines',
      category: 'Infectious Diseases',
      description: 'Standard treatment protocols for malaria in Nigeria',
      recommendations: [
        'First-line: Artemether-Lumefantrine (AL) for uncomplicated malaria',
        'Alternative: Artesunate-Amodiaquine (ASAQ)',
        'Severe malaria: IV Artesunate or Quinine',
        'Pregnancy: Quinine + Clindamycin (avoid AL in first trimester)'
      ],
      lastUpdated: '2024-01-15',
      authority: 'NHIS/FMOH'
    },
    {
      id: 2,
      title: 'Hypertension Management Protocol',
      category: 'Cardiovascular',
      description: 'Evidence-based management of hypertension in Nigerian population',
      recommendations: [
        'Target BP: <140/90 mmHg (general), <130/80 mmHg (diabetics)',
        'First-line: Thiazide diuretics or ACE inhibitors',
        'Combination therapy for resistant hypertension',
        'Lifestyle modification essential'
      ],
      lastUpdated: '2024-02-01',
      authority: 'Nigerian Cardiac Society'
    },
    {
      id: 3,
      title: 'Diabetes Management Guidelines',
      category: 'Endocrinology',
      description: 'Comprehensive diabetes care in resource-limited settings',
      recommendations: [
        'Target HbA1c: <7% for most patients',
        'Metformin as first-line therapy',
        'Regular monitoring of complications',
        'Patient education and lifestyle counseling'
      ],
      lastUpdated: '2024-01-20',
      authority: 'Society for Endocrinology & Metabolism'
    },
    {
      id: 4,
      title: 'Antibiotic Stewardship Program',
      category: 'Infectious Diseases',
      description: 'Rational antibiotic use to combat antimicrobial resistance',
      recommendations: [
        'Empirical therapy based on local resistance patterns',
        'De-escalation when culture results available',
        'Duration: Shortest effective course',
        'Avoid unnecessary prophylaxis'
      ],
      lastUpdated: '2024-02-10',
      authority: 'Nigerian Centre for Disease Control'
    }
  ];

  // Risk calculation functions
  const calculateCardiovascularRisk = (data) => {
    const { age, gender, bloodPressure, cholesterol, smoker, diabetic, familyHistory } = data;

    // Simplified Framingham Risk Score adapted for Nigerian population
    let score = 0;

    // Age factor
    if (age >= 60) score += 4;
    else if (age >= 50) score += 3;
    else if (age >= 40) score += 2;

    // Gender factor (higher risk for males in Nigerian context)
    if (gender === 'male') score += 2;

    // Blood pressure
    const [systolic] = bloodPressure.split('/').map(Number);
    if (systolic >= 160) score += 3;
    else if (systolic >= 140) score += 2;

    // Cholesterol (simplified)
    if (cholesterol > 240) score += 2;
    else if (cholesterol > 200) score += 1;

    // Risk factors
    if (smoker) score += 2;
    if (diabetic) score += 2;
    if (familyHistory) score += 1;

    // Calculate 10-year risk percentage
    const riskPercentage = Math.min(score * 3, 30); // Simplified calculation

    return {
      score,
      riskPercentage,
      riskCategory: riskPercentage < 10 ? 'Low' : riskPercentage < 20 ? 'Moderate' : 'High',
      recommendations: riskPercentage >= 20 ?
        ['Immediate lifestyle modification', 'Consider pharmacological intervention', 'Regular monitoring'] :
        ['Lifestyle counseling', 'Regular follow-up', 'Risk factor control']
    };
  };

  const calculateDiabetesRisk = (data) => {
    // Simplified Finnish Diabetes Risk Score adapted for Nigeria
    const { age, bmi, waistCircumference, physicalActivity, familyHistory, diet } = data;

    let score = 0;

    if (age >= 65) score += 4;
    else if (age >= 55) score += 3;
    else if (age >= 45) score += 2;

    // BMI scoring (Nigerian context)
    if (bmi >= 30) score += 3;
    else if (bmi >= 25) score += 1;

    // Physical activity
    if (physicalActivity === 'low') score += 2;
    else if (physicalActivity === 'moderate') score += 1;

    // Family history
    if (familyHistory) score += 3;

    // Diet (simplified)
    if (diet === 'unhealthy') score += 1;

    const riskPercentage = Math.min(score * 2.5, 50);

    return {
      score,
      riskPercentage,
      riskCategory: riskPercentage < 10 ? 'Low' : riskPercentage < 20 ? 'Slightly Elevated' : riskPercentage < 35 ? 'Moderate' : 'High',
      recommendations: riskPercentage >= 20 ?
        ['Lifestyle intervention', 'Regular screening', 'Weight management'] :
        ['Healthy lifestyle promotion', 'Regular check-ups']
    };
  };

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
  };

  const handleAllergyCheck = () => {
    const alerts = [];
    const medication = allergyCheckForm.medication.toLowerCase();

    // Check for common allergies
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

    // Cross-reactivity warnings
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
  };

  const handleDoseCalculation = () => {
    const { drug, patientWeight, age, renalFunction, hepaticFunction, dosingFrequency } = dosingForm;

    // Simplified dosing calculations (in real app, would use comprehensive pharmacokinetic data)
    let dose = 0;
    let frequency = '';
    let adjustments = [];

    // Pediatric dosing (Clark's rule approximation)
    if (age < 12) {
      const adultDose = 100; // mg - placeholder
      dose = (parseFloat(patientWeight) / 70) * adultDose;
      adjustments.push('Pediatric dose calculated using weight-based formula');
    } else {
      dose = 100; // Standard adult dose - placeholder
    }

    // Renal adjustment
    if (renalFunction === 'severe') {
      dose *= 0.5;
      adjustments.push('Dose reduced by 50% due to severe renal impairment');
    }

    // Hepatic adjustment
    if (hepaticFunction === 'severe') {
      dose *= 0.5;
      adjustments.push('Dose reduced by 50% due to severe hepatic impairment');
    }

    // Frequency
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
      case 'major': return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'minor': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (category) => {
    switch (category) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Moderate': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredGuidelines = (clinicalGuidelines || []).filter(guideline =>
    guideline.title.toLowerCase().includes(guidelineSearch.toLowerCase()) ||
    guideline.category.toLowerCase().includes(guidelineSearch.toLowerCase())
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

  useEffect(() => {
    if (activeTab === 'alerts') {
      dispatch(getClinicalGuidelines({}));
    }
  }, [activeTab, dispatch]);

  return (
    <div className="clinical-decision-support p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Brain className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-500" />
          Clinical Decision Support
        </h1>
        <p className="text-gray-600 mt-2">Intelligent healthcare decision-making system</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'interactions', label: 'Drug Interactions', icon: Pill },
            { id: 'allergies', label: 'Allergy Alerts', icon: AlertTriangle },
            { id: 'dosing', label: 'Dosing Calculator', icon: Calculator },
            { id: 'guidelines', label: 'Clinical Guidelines', icon: BookOpen },
            { id: 'risk', label: 'Risk Calculators', icon: Activity },
            { id: 'alerts', label: 'Patient Alerts', icon: AlertCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'interactions' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Drug-Drug Interaction Checker</h3>

            {/* Drug Input Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="font-medium mb-4">Enter Medications</h4>
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
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {drugCheckForm.drugs.length > 1 && (
                      <button
                        onClick={() => {
                          const newDrugs = drugCheckForm.drugs.filter((_, i) => i !== index);
                          setDrugCheckForm({...drugCheckForm, drugs: newDrugs});
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setDrugCheckForm({...drugCheckForm, drugs: [...drugCheckForm.drugs, '']})}
                  className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medication
                </button>
              </div>

              <button
                onClick={handleDrugInteractionCheck}
                className="mt-4 w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
              >
                Check for Interactions
              </button>
            </div>

            {/* Interaction Results */}
            {drugInteractions.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Interaction Results</h4>
                {drugInteractions.map((interaction, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(interaction.severity)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{interaction.drug1} + {interaction.drug2}</h5>
                      <span className="px-2 py-1 rounded text-xs font-medium uppercase">
                        {interaction.severity}
                      </span>
                    </div>
                    <p className="text-sm">{interaction.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'allergies' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Allergy Alert System</h3>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medication</label>
                  <input
                    type="text"
                    value={allergyCheckForm.medication}
                    onChange={(e) => setAllergyCheckForm({...allergyCheckForm, medication: e.target.value})}
                    placeholder="Enter medication name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Allergies</label>
                  <input
                    type="text"
                    value={allergyCheckForm.patientAllergies.join(', ')}
                    onChange={(e) => setAllergyCheckForm({
                      ...allergyCheckForm,
                      patientAllergies: e.target.value.split(',').map(a => a.trim())
                    })}
                    placeholder="penicillin, sulfa, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="crossReactivity"
                  checked={allergyCheckForm.crossReactivity}
                  onChange={(e) => setAllergyCheckForm({...allergyCheckForm, crossReactivity: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="crossReactivity" className="text-sm">Check for cross-reactivity</label>
              </div>

              <button
                onClick={handleAllergyCheck}
                className="mt-4 w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-medium"
              >
                Check Allergies
              </button>
            </div>

            {/* Allergy Alerts */}
            {allergyAlerts.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Allergy Alerts</h4>
                {allergyAlerts.map((alert, index) => (
                  <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                      <span className="font-medium text-red-800">{alert.type.toUpperCase()}</span>
                    </div>
                    <p className="text-red-700 mb-2">{alert.message}</p>
                    <p className="text-sm text-red-600">{alert.recommendation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'dosing' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Dosing Calculator</h3>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Drug</label>
                  <select
                    value={dosingForm.drug}
                    onChange={(e) => setDosingForm({...dosingForm, drug: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Weight (kg)</label>
                  <input
                    type="number"
                    value={dosingForm.patientWeight}
                    onChange={(e) => setDosingForm({...dosingForm, patientWeight: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
                  <input
                    type="number"
                    value={dosingForm.age}
                    onChange={(e) => setDosingForm({...dosingForm, age: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Renal Function</label>
                  <select
                    value={dosingForm.renalFunction}
                    onChange={(e) => setDosingForm({...dosingForm, renalFunction: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="mild">Mild impairment</option>
                    <option value="moderate">Moderate impairment</option>
                    <option value="severe">Severe impairment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hepatic Function</label>
                  <select
                    value={dosingForm.hepaticFunction}
                    onChange={(e) => setDosingForm({...dosingForm, hepaticFunction: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="mild">Mild impairment</option>
                    <option value="moderate">Moderate impairment</option>
                    <option value="severe">Severe impairment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                  <select
                    value={dosingForm.dosingFrequency}
                    onChange={(e) => setDosingForm({...dosingForm, dosingFrequency: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="daily">Once daily</option>
                    <option value="bd">Twice daily</option>
                    <option value="tds">Three times daily</option>
                    <option value="qds">Four times daily</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleDoseCalculation}
                className="mt-6 w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium"
              >
                Calculate Dose
              </button>
            </div>

            {/* Dosing Results */}
            {dosingRecommendations && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-green-600" />
                  Dosing Recommendation
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2">Calculated Dose</h5>
                    <p className="text-2xl font-bold text-green-600">{dosingRecommendations.calculatedDose} mg</p>
                    <p className="text-sm text-gray-600">{dosingRecommendations.frequency}</p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Adjustments Made</h5>
                    <ul className="text-sm space-y-1">
                       {(dosingRecommendations.adjustments || []).map((adjustment, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          {adjustment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <Info className="w-4 h-4 inline mr-1" />
                     {dosingRecommendations.monitoring || ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'guidelines' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Clinical Guidelines</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search guidelines..."
                  value={guidelineSearch}
                  onChange={(e) => setGuidelineSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-6">
              {paginatedGuidelines.map(guideline => (
                <div key={guideline.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-lg">{guideline.title}</h4>
                      <p className="text-sm text-gray-600">{guideline.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Updated: {new Date(guideline.lastUpdated).toLocaleDateString('en-NG')}</p>
                      <p className="text-xs text-gray-400">{guideline.authority}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{guideline.description}</p>

                  <div>
                    <h5 className="font-medium mb-2">Key Recommendations:</h5>
                    <ul className="space-y-2">
                       {(guideline.recommendations || []).map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredGuidelines.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredGuidelines.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}

        {activeTab === 'risk' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Risk Calculators</h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calculator Selection */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-4">Select Calculator</h4>

                <div className="space-y-3">
                  {[
                    { id: 'cardiovascular', label: 'Cardiovascular Risk', icon: Heart, desc: '10-year CVD risk assessment' },
                    { id: 'diabetes', label: 'Diabetes Risk', icon: Droplet, desc: 'Type 2 diabetes risk score' },
                    { id: 'pregnancy', label: 'Pregnancy Risk', icon: Baby, desc: 'Maternal risk stratification' }
                  ].map(calc => (
                    <button
                      key={calc.id}
                      onClick={() => setRiskForm({...riskForm, calculator: calc.id})}
                      className={`w-full p-4 rounded-lg border text-left ${
                        riskForm.calculator === calc.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <calc.icon className="w-5 h-5 mr-3 text-blue-600" />
                        <div>
                          <p className="font-medium">{calc.label}</p>
                          <p className="text-sm text-gray-600">{calc.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculator Form */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                {riskForm.calculator === 'cardiovascular' && (
                  <div>
                    <h4 className="font-medium mb-4">Cardiovascular Risk Assessment</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                          <input
                            type="number"
                            value={riskForm.patientData.age}
                            onChange={(e) => setRiskForm({
                              ...riskForm,
                              patientData: {...riskForm.patientData, age: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <select
                            value={riskForm.patientData.gender}
                            onChange={(e) => setRiskForm({
                              ...riskForm,
                              patientData: {...riskForm.patientData, gender: e.target.value}
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (sys/dia)</label>
                        <input
                          type="text"
                          placeholder="120/80"
                          value={riskForm.patientData.bloodPressure}
                          onChange={(e) => setRiskForm({
                            ...riskForm,
                            patientData: {...riskForm.patientData, bloodPressure: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Cholesterol (mg/dL)</label>
                        <input
                          type="number"
                          value={riskForm.patientData.cholesterol}
                          onChange={(e) => setRiskForm({
                            ...riskForm,
                            patientData: {...riskForm.patientData, cholesterol: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={riskForm.patientData.smoker}
                            onChange={(e) => setRiskForm({
                              ...riskForm,
                              patientData: {...riskForm.patientData, smoker: e.target.checked}
                            })}
                            className="mr-2"
                          />
                          Current smoker
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={riskForm.patientData.diabetic}
                            onChange={(e) => setRiskForm({
                              ...riskForm,
                              patientData: {...riskForm.patientData, diabetic: e.target.checked}
                            })}
                            className="mr-2"
                          />
                          Diabetic
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={riskForm.patientData.familyHistory}
                            onChange={(e) => setRiskForm({
                              ...riskForm,
                              patientData: {...riskForm.patientData, familyHistory: e.target.checked}
                            })}
                            className="mr-2"
                          />
                          Family history of CVD
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleRiskCalculation}
                  disabled={isCalculatingRisk}
                  className="mt-6 w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculatingRisk ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </>
                  ) : (
                    'Calculate Risk'
                  )}
                </button>
              </div>
            </div>

            {/* Risk Results */}
            {riskCalculations && (
              <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4">Risk Assessment Results</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{riskCalculations.score}</p>
                    <p className="text-sm text-gray-600">Risk Score</p>
                  </div>

                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-600">{riskCalculations.riskPercentage}%</p>
                    <p className="text-sm text-gray-600">Risk Percentage</p>
                  </div>

                  <div className="text-center">
                    <span className={`px-4 py-2 rounded-lg font-medium ${getRiskColor(riskCalculations.riskCategory)}`}>
                      {riskCalculations.riskCategory} Risk
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-3">Recommendations:</h5>
                  <ul className="space-y-2">
                     {(riskCalculations.recommendations || []).map((rec, index) => (
                      <li key={index} className="flex items-center">
                        <Shield className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Patient Alerts & Notifications</h3>

            <div className="space-y-4">
              {patientAlerts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No active alerts</p>
              ) : (
                patientAlerts.map(alert => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${
                    alert.priority === 'high' ? 'bg-red-50 border-red-200' :
                    alert.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <AlertCircle className={`w-5 h-5 mr-2 ${
                          alert.priority === 'high' ? 'text-red-600' :
                          alert.priority === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                        <span className="font-medium">{alert.title}</span>
                      </div>
                      <button
                        onClick={() => dispatch(dismissAlert(alert.id))}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Patient: {alert.patientName}</span>
                      <span>{new Date(alert.timestamp).toLocaleString('en-NG')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
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