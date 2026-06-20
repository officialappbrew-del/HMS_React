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
  RefreshCw
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
    dispatch(createMedicationOrder(medicationForm));
    // Reset form
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
  };

  const handleCreateLabOrder = (e) => {
    e.preventDefault();
    dispatch(createLabOrder(labForm));
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
  };

  const handleCreateRadiologyOrder = (e) => {
    e.preventDefault();
    dispatch(createRadiologyOrder(radiologyForm));
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
  };

  const handleCreateProcedureOrder = (e) => {
    e.preventDefault();
    dispatch(createProcedureOrder(procedureForm));
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
  };

  const handleCreateDietaryOrder = (e) => {
    e.preventDefault();
    dispatch(createDietaryOrder(dietaryForm));
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
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'stat': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'routine': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="order-entry-system p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-500" />
          Order Entry System (CPOE)
        </h1>
        <p className="text-gray-600 mt-2">Computerized Physician Order Entry with integrated safety checks</p>
      </div>

      {/* Order Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Orders</p>
              <p className="text-3xl font-bold mt-2">{pendingOrders.length}</p>
            </div>
            <Clock className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed Today</p>
              <p className="text-3xl font-bold mt-2">{completedOrders.length}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Safety Alerts</p>
              <p className="text-3xl font-bold mt-2">{interactions.length}</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold mt-2">{orders.length}</p>
            </div>
            <FileText className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'medications', label: 'Medication Orders', icon: Pill },
            { id: 'laboratory', label: 'Laboratory Orders', icon: Beaker },
            { id: 'radiology', label: 'Radiology Orders', icon: Scan },
            { id: 'procedures', label: 'Procedure Orders', icon: Stethoscope },
            { id: 'dietary', label: 'Dietary Orders', icon: Utensils },
            { id: 'orders', label: 'All Orders', icon: FileText }
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
        {activeTab === 'medications' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Medication Orders (E-Prescribing)</h3>
              <button
                onClick={() => {/* Open modal */}}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Medication Order
              </button>
            </div>

            {/* Medication Order Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <form onSubmit={handleCreateMedicationOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
                    <input
                      type="text"
                      value={medicationForm.patientId}
                      onChange={(e) => setMedicationForm({...medicationForm, patientId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                    <input
                      type="text"
                      value={medicationForm.patientName}
                      onChange={(e) => setMedicationForm({...medicationForm, patientName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medication *</label>
                    <select
                      value={medicationForm.medication}
                      onChange={(e) => setMedicationForm({...medicationForm, medication: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select medication</option>
                      {nigerianMedications.map(med => (
                        <option key={med.name} value={med.name}>
                          {med.name} ({med.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dose *</label>
                    <input
                      type="text"
                      value={medicationForm.dose}
                      onChange={(e) => setMedicationForm({...medicationForm, dose: e.target.value})}
                      placeholder="e.g., 500mg, 10ml"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                    <select
                      value={medicationForm.frequency}
                      onChange={(e) => setMedicationForm({...medicationForm, frequency: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select frequency</option>
                      <option value="od">Once daily (OD)</option>
                      <option value="bd">Twice daily (BD)</option>
                      <option value="tds">Three times daily (TDS)</option>
                      <option value="qds">Four times daily (QDS)</option>
                      <option value="prn">As needed (PRN)</option>
                      <option value="stat">Immediately (STAT)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
                    <select
                      value={medicationForm.route}
                      onChange={(e) => setMedicationForm({...medicationForm, route: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="oral">Oral</option>
                      <option value="iv">IV Injection</option>
                      <option value="im">IM Injection</option>
                      <option value="sc">Subcutaneous</option>
                      <option value="topical">Topical</option>
                      <option value="rectal">Rectal</option>
                      <option value="inhaled">Inhaled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                    <input
                      type="number"
                      value={medicationForm.duration}
                      onChange={(e) => setMedicationForm({...medicationForm, duration: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordering Physician *</label>
                    <input
                      type="text"
                      value={medicationForm.orderingPhysician}
                      onChange={(e) => setMedicationForm({...medicationForm, orderingPhysician: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Indication *</label>
                    <input
                      type="text"
                      value={medicationForm.indication}
                      onChange={(e) => setMedicationForm({...medicationForm, indication: e.target.value})}
                      placeholder="e.g., Malaria, Hypertension"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                  <textarea
                    value={medicationForm.instructions}
                    onChange={(e) => setMedicationForm({...medicationForm, instructions: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional instructions for administration..."
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={medicationForm.isPRN}
                      onChange={(e) => setMedicationForm({...medicationForm, isPRN: e.target.checked})}
                      className="mr-2"
                    />
                    PRN (As needed)
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={medicationForm.controlled}
                      onChange={(e) => setMedicationForm({...medicationForm, controlled: e.target.checked})}
                      className="mr-2"
                    />
                    Controlled substance
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={medicationForm.verbalOrder}
                      onChange={(e) => setMedicationForm({...medicationForm, verbalOrder: e.target.checked})}
                      className="mr-2"
                    />
                    Verbal order
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Create Medication Order
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(checkOrderInteractions())}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium flex items-center"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Check Safety
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'laboratory' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Laboratory Orders</h3>
              <button
                onClick={() => {/* Open modal */}}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Lab Order
              </button>
            </div>

            {/* Lab Order Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <form onSubmit={handleCreateLabOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
                    <input
                      type="text"
                      value={labForm.patientId}
                      onChange={(e) => setLabForm({...labForm, patientId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                    <input
                      type="text"
                      value={labForm.patientName}
                      onChange={(e) => setLabForm({...labForm, patientName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Test Panel</label>
                    <select
                      value={labForm.testPanel}
                      onChange={(e) => setLabForm({...labForm, testPanel: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select panel (optional)</option>
                      {nigerianLabTests.panels.map(panel => (
                        <option key={panel.name} value={panel.name}>
                          {panel.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                    <select
                      value={labForm.priority}
                      onChange={(e) => setLabForm({...labForm, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="routine">Routine</option>
                      <option value="urgent">Urgent</option>
                      <option value="stat">STAT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Indication *</label>
                  <input
                    type="text"
                    value={labForm.clinicalIndication}
                    onChange={(e) => setLabForm({...labForm, clinicalIndication: e.target.value})}
                    placeholder="Reason for test"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordering Physician *</label>
                    <input
                      type="text"
                      value={labForm.orderingPhysician}
                      onChange={(e) => setLabForm({...labForm, orderingPhysician: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fasting Required</label>
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={labForm.fasting}
                        onChange={(e) => setLabForm({...labForm, fasting: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm">Patient must fast before test</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                  <textarea
                    value={labForm.specialInstructions}
                    onChange={(e) => setLabForm({...labForm, specialInstructions: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Sample collection instructions, special handling..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center"
                >
                  <Beaker className="w-4 h-4 mr-2" />
                  Create Laboratory Order
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'radiology' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Radiology Orders</h3>
              <button
                onClick={() => {/* Open modal */}}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Radiology Order
              </button>
            </div>

            {/* Radiology Order Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <form onSubmit={handleCreateRadiologyOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
                    <input
                      type="text"
                      value={radiologyForm.patientId}
                      onChange={(e) => setRadiologyForm({...radiologyForm, patientId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                    <input
                      type="text"
                      value={radiologyForm.patientName}
                      onChange={(e) => setRadiologyForm({...radiologyForm, patientName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Modality *</label>
                    <select
                      value={radiologyForm.modality}
                      onChange={(e) => setRadiologyForm({...radiologyForm, modality: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select modality</option>
                      {radiologyModalities.map(modality => (
                        <option key={modality.name} value={modality.name}>
                          {modality.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Body Part/Region *</label>
                    <select
                      value={radiologyForm.bodyPart}
                      onChange={(e) => setRadiologyForm({...radiologyForm, bodyPart: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select body part</option>
                      {radiologyForm.modality && radiologyModalities
                        .find(m => m.name === radiologyForm.modality)?.bodyParts
                        .map(part => (
                          <option key={part} value={part}>{part}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                    <select
                      value={radiologyForm.priority}
                      onChange={(e) => setRadiologyForm({...radiologyForm, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="routine">Routine</option>
                      <option value="urgent">Urgent</option>
                      <option value="stat">STAT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pregnancy Status</label>
                    <select
                      value={radiologyForm.pregnancyStatus}
                      onChange={(e) => setRadiologyForm({...radiologyForm, pregnancyStatus: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="unknown">Unknown</option>
                      <option value="not_pregnant">Not Pregnant</option>
                      <option value="pregnant">Pregnant</option>
                      <option value="possibly_pregnant">Possibly Pregnant</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Indication *</label>
                  <input
                    type="text"
                    value={radiologyForm.clinicalIndication}
                    onChange={(e) => setRadiologyForm({...radiologyForm, clinicalIndication: e.target.value})}
                    placeholder="Reason for imaging"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordering Physician *</label>
                    <input
                      type="text"
                      value={radiologyForm.orderingPhysician}
                      onChange={(e) => setRadiologyForm({...radiologyForm, orderingPhysician: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center mt-8">
                      <input
                        type="checkbox"
                        checked={radiologyForm.contrast}
                        onChange={(e) => setRadiologyForm({...radiologyForm, contrast: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm">Contrast required</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                  <textarea
                    value={radiologyForm.specialInstructions}
                    onChange={(e) => setRadiologyForm({...radiologyForm, specialInstructions: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Positioning requirements, special protocols..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 font-medium flex items-center justify-center"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Create Radiology Order
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'procedures' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Procedure Orders</h3>
              <button
                onClick={() => {/* Open modal */}}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Procedure Order
              </button>
            </div>

            {/* Procedure Order Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <form onSubmit={handleCreateProcedureOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
                    <input
                      type="text"
                      value={procedureForm.patientId}
                      onChange={(e) => setProcedureForm({...procedureForm, patientId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                    <input
                      type="text"
                      value={procedureForm.patientName}
                      onChange={(e) => setProcedureForm({...procedureForm, patientName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Procedure *</label>
                    <select
                      value={procedureForm.procedure}
                      onChange={(e) => setProcedureForm({...procedureForm, procedure: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select procedure</option>
                      {procedures.map(proc => (
                        <option key={proc.name} value={proc.name}>
                          {proc.name} ({proc.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Body Site</label>
                    <input
                      type="text"
                      value={procedureForm.bodySite}
                      onChange={(e) => setProcedureForm({...procedureForm, bodySite: e.target.value})}
                      placeholder="e.g., Right arm, Left thigh"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Anesthesia</label>
                    <select
                      value={procedureForm.anesthesia}
                      onChange={(e) => setProcedureForm({...procedureForm, anesthesia: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select anesthesia</option>
                      <option value="none">None/Local</option>
                      <option value="local">Local</option>
                      <option value="regional">Regional</option>
                      <option value="general">General</option>
                      <option value="sedation">Conscious Sedation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Duration</label>
                    <input
                      type="text"
                      value={procedureForm.estimatedDuration}
                      onChange={(e) => setProcedureForm({...procedureForm, estimatedDuration: e.target.value})}
                      placeholder="e.g., 30 minutes, 2 hours"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Indication *</label>
                  <input
                    type="text"
                    value={procedureForm.clinicalIndication}
                    onChange={(e) => setProcedureForm({...procedureForm, clinicalIndication: e.target.value})}
                    placeholder="Reason for procedure"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordering Physician *</label>
                    <input
                      type="text"
                      value={procedureForm.orderingPhysician}
                      onChange={(e) => setProcedureForm({...procedureForm, orderingPhysician: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center mt-8">
                      <input
                        type="checkbox"
                        checked={procedureForm.consentRequired}
                        onChange={(e) => setProcedureForm({...procedureForm, consentRequired: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm">Consent form required</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                  <textarea
                    value={procedureForm.specialInstructions}
                    onChange={(e) => setProcedureForm({...procedureForm, specialInstructions: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Pre-procedure requirements, positioning, equipment needed..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center"
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Create Procedure Order
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'dietary' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Dietary Orders</h3>
              <button
                onClick={() => {/* Open modal */}}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Dietary Order
              </button>
            </div>

            {/* Dietary Order Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <form onSubmit={handleCreateDietaryOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
                    <input
                      type="text"
                      value={dietaryForm.patientId}
                      onChange={(e) => setDietaryForm({...dietaryForm, patientId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                    <input
                      type="text"
                      value={dietaryForm.patientName}
                      onChange={(e) => setDietaryForm({...dietaryForm, patientName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type *</label>
                    <select
                      value={dietaryForm.dietType}
                      onChange={(e) => setDietaryForm({...dietaryForm, dietType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="">Select diet type</option>
                      {nigerianMealPlans.map(plan => (
                        <option key={plan.name} value={plan.name}>
                          {plan.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={dietaryForm.startDate}
                      onChange={(e) => setDietaryForm({...dietaryForm, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                    <input
                      type="number"
                      value={dietaryForm.duration}
                      onChange={(e) => setDietaryForm({...dietaryForm, duration: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordering Physician *</label>
                    <input
                      type="text"
                      value={dietaryForm.orderingPhysician}
                      onChange={(e) => setDietaryForm({...dietaryForm, orderingPhysician: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Therapeutic Goals</label>
                  <textarea
                    value={dietaryForm.therapeuticGoals.join(', ')}
                    onChange={(e) => setDietaryForm({
                      ...dietaryForm,
                      therapeuticGoals: e.target.value.split(',').map(g => g.trim())
                    })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="Weight loss, blood sugar control, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cultural/Restrictions</label>
                  <input
                    type="text"
                    value={dietaryForm.culturalRestrictions.join(', ')}
                    onChange={(e) => setDietaryForm({
                      ...dietaryForm,
                      culturalRestrictions: e.target.value.split(',').map(r => r.trim())
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="Halal, Vegetarian, No pork, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Known Allergies</label>
                  <input
                    type="text"
                    value={dietaryForm.allergies.join(', ')}
                    onChange={(e) => setDietaryForm({
                      ...dietaryForm,
                      allergies: e.target.value.split(',').map(a => a.trim())
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="Peanuts, Shellfish, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dietitian Notes</label>
                  <textarea
                    value={dietaryForm.dietitianNotes}
                    onChange={(e) => setDietaryForm({...dietaryForm, dietitianNotes: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="Additional nutritional recommendations..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 font-medium flex items-center justify-center"
                >
                  <Utensils className="w-4 h-4 mr-2" />
                  Create Dietary Order
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">All Orders</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchOrders(e.target.value))}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterOrders(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {order.type}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.patientName}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {order.details}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900" title="View">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900" title="Print">
                            <Printer className="w-4 h-4" />
                          </button>
                          <button className="text-yellow-600 hover:text-yellow-900" title="Update Status">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredOrders.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderEntrySystem;