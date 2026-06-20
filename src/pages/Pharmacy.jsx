import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,  Search,  Filter,  Plus,
  Edit,  Trash2,  AlertTriangle,
  Download,  Upload,  BarChart3,  Pill,
  Shield,  Clock,  TrendingUp,  AlertCircle,
  CheckCircle,  XCircle,  ShoppingCart,  History,
  Eye,  FileText,  Calculator,  Printer,  Calendar,  Tag
} from 'lucide-react';
import { 
  addDrug,   updateDrug,   deleteDrug,   dispenseDrug,
  restockDrug,  searchDrugs,  filterDrugs,  sortDrugs,
  setCurrentDrug,  archiveDrug,  exportPharmacyReport,  checkDrugInteraction,
  generatePrescription,  addToCart,  removeFromCart,  clearCart,  processSale
} from '../features/pharmacySlice';


import ConfirmModal from '../components/ConfirmModal';
import { 
  validateDrug,   formatNafdacNumber,
  calculateExpiryStatus,  calculateReorderLevel
} from '../pages/src/utils/pharmacyUtils';

const Pharmacy = () => {
  const dispatch = useDispatch();
  const {
    drugs,    filteredDrugs,   currentDrug,
    loading, error, searchTerm,
    filterBy,  sortBy, cart,
    salesHistory, lowStockItems,
    expiredDrugs, prescriptions,
    inventoryValue  } = useSelector(state => state.pharmacy);

  // Form states
  const [showDrugForm, setShowDrugForm] = useState(false);
  const [editingDrugId, setEditingDrugId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showDispenseForm, setShowDispenseForm] = useState(false);
  const [showRestockForm, setShowRestockForm] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showReports, setShowReports] = useState(false);

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'delete',
    drugData: null,
    action: null,
  });

  // Form data
  const [drugForm, setDrugForm] = useState({
    name: '',
    genericName: '',
    brandName: '',
    drugCode: '',
    nafdacNumber: '',
    pcnApprovalNumber: '',
    strength: '',
    dosageForm: '', // Tablet, Capsule, Syrup, Injection, Ointment
    unitOfMeasure: '', // tablet, capsule, ml, mg, etc.
    category: '', // Antibiotic, Analgesic, Antimalarial, etc.
    therapeuticClass: '',
    manufacturer: '',
    supplier: '',
    countryOfOrigin: '',
    unitPrice: '',
    sellingPrice: '',
    quantityInStock: '',
    reorderLevel: '',
    reorderQuantity: '',
    expiryDate: '',
    batchNumber: '',
    storageConditions: '',
    prescriptionRequired: false,
    controlledSubstance: false,
    narcotic: false,
    schedule: '', // C1, C2, C3, C4 for controlled substances
    nhisCovered: false,
    nhisCode: '',
    nhisPrice: '',
    nemlCategory: '', // Essential, Supplementary, Specialist
    sideEffects: '',
    contraindications: '',
    interactions: '',
    dosageInstructions: '',
    barcode: '',
    lastRestocked: new Date().toISOString().split('T')[0],
  });

  const [dispenseForm, setDispenseForm] = useState({
    patientId: '',
    patientName: '',
    prescriptionId: '',
    drugId: '',
    quantity: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    prescriber: '',
    nhisCovered: false,
    paymentMethod: 'cash', // cash, nhis, hmo, corporate
    notes: '',
  });

  const [restockForm, setRestockForm] = useState({
    drugId: '',
    quantity: '',
    batchNumber: '',
    expiryDate: '',
    supplier: '',
    unitCost: '',
    totalCost: '',
    invoiceNumber: '',
    receivedBy: '',
    notes: '',
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    patientName: '',
    diagnosis: '',
    drugs: [],
    instructions: '',
    refillAllowed: false,
    refillCount: 0,
    validUntil: '',
    prescriberId: '',
    prescriberName: '',
    nhisApproved: false,
  });

  // Nigerian Essential Medicines List categories
  const nemlCategories = [
    'Essential - Core',
    'Essential - Complementary',
    'Specialist',
    'Supplementary',
    'Not in NEML'
  ];

  // Drug categories (Nigerian context)
  const drugCategories = [
    'Antimalarial',
    'Antibiotic',
    'Analgesic',
    'Antihypertensive',
    'Antidiabetic',
    'Antiretroviral',
    'Antitubercular',
    'Antifungal',
    'Antiemetic',
    'Antacid',
    'Cough & Cold',
    'Vitamin & Supplement',
    'IV Fluid',
    'Vaccine',
    'Surgical',
    'Diagnostic',
    'Other'
  ];

  // Dosage forms
  const dosageForms = [
    'Tablet',
    'Capsule',
    'Syrup',
    'Suspension',
    'Injection',
    'IV Infusion',
    'Ointment',
    'Cream',
    'Lotion',
    'Suppository',
    'Inhaler',
    'Drops',
    'Spray',
    'Powder',
    'Other'
  ];

  // Controlled substance schedules (Nigeria)
  const controlledSchedules = [
    'C1 - Most Restricted',
    'C2 - Restricted',
    'C3 - Less Restricted',
    'C4 - Least Restricted',
    'Non-controlled'
  ];

  // Nigerian manufacturers
  const nigerianManufacturers = [
    'Emzor Pharmaceuticals',
    'Fidson Healthcare',
    'May & Baker Nigeria',
    'Swiss Pharma Nigeria',
    'Chi Pharmaceuticals',
    'Greenlife Pharmaceuticals',
    'Mopson Pharmaceuticals',
    'Biotech Pharmaceuticals',
    'Gsk Nigeria',
    'Sanofi Nigeria',
    'Pfizer Nigeria',
    'Other'
  ];

  // Stats calculation
  const stats = useMemo(() => {
    const totalDrugs = drugs.length;
    const totalValue = drugs.reduce((sum, drug) => 
      sum + (drug.quantityInStock * drug.unitPrice), 0);
    const lowStockCount = drugs.filter(drug => 
      drug.quantityInStock <= drug.reorderLevel).length;
    const expiredCount = drugs.filter(drug => 
      new Date(drug.expiryDate) < new Date()).length;
    const controlledCount = drugs.filter(drug => 
      drug.controlledSubstance).length;

    return {
      totalDrugs,
      totalValue,
      lowStockCount,
      expiredCount,
      controlledCount,
      averageStockValue: totalValue / totalDrugs || 0,
    };
  }, [drugs]);

  // Initialize with sample data if empty
  useEffect(() => {
    if (drugs.length === 0 && !localStorage.getItem('pharmacyInitialized')) {
      localStorage.setItem('pharmacyInitialized', 'true');
      // You can initialize with sample data or load from API
      const sampleDrugs = [
        {
          id: 1,
          name: 'Artemether/Lumefantrine',
          genericName: 'Artemether + Lumefantrine',
          brandName: 'Coartem',
          drugCode: 'ANT-MAL-001',
          nafdacNumber: 'NAFDAC-04-1234',
          strength: '20/120mg',
          dosageForm: 'Tablet',
          unitOfMeasure: 'tablet',
          category: 'Antimalarial',
          manufacturer: 'Novartis',
          unitPrice: 150,
          sellingPrice: 200,
          quantityInStock: 500,
          reorderLevel: 100,
          expiryDate: '2025-12-31',
          batchNumber: 'BATCH-AL-2024-001',
          prescriptionRequired: true,
          controlledSubstance: false,
          nhisCovered: true,
          nhisCode: 'NHIS-MAL-001',
          nemlCategory: 'Essential - Core',
          status: 'active',
          lastRestocked: '2024-01-15'
        },
        {
          id: 2,
          name: 'Amoxicillin Capsules',
          genericName: 'Amoxicillin',
          brandName: 'Amoxil',
          drugCode: 'ANT-AB-001',
          nafdacNumber: 'NAFDAC-05-5678',
          strength: '500mg',
          dosageForm: 'Capsule',
          unitOfMeasure: 'capsule',
          category: 'Antibiotic',
          manufacturer: 'GSK',
          unitPrice: 50,
          sellingPrice: 80,
          quantityInStock: 200,
          reorderLevel: 50,
          expiryDate: '2024-06-30',
          batchNumber: 'BATCH-AMX-2023-002',
          prescriptionRequired: true,
          controlledSubstance: false,
          nhisCovered: true,
          nemlCategory: 'Essential - Core',
          status: 'active',
          lastRestocked: '2024-01-10'
        },
        {
          id: 3,
          name: 'Morphine Injection',
          genericName: 'Morphine Sulfate',
          brandName: 'Morphine',
          drugCode: 'ANL-CS-001',
          nafdacNumber: 'NAFDAC-03-9012',
          strength: '10mg/ml',
          dosageForm: 'Injection',
          unitOfMeasure: 'ampoule',
          category: 'Analgesic',
          manufacturer: 'Emzor',
          unitPrice: 800,
          sellingPrice: 1200,
          quantityInStock: 20,
          reorderLevel: 10,
          expiryDate: '2025-03-31',
          batchNumber: 'BATCH-MOR-2024-001',
          prescriptionRequired: true,
          controlledSubstance: true,
          narcotic: true,
          schedule: 'C1',
          nhisCovered: false,
          nemlCategory: 'Essential - Complementary',
          status: 'active',
          lastRestocked: '2024-01-05'
        }
      ];
      // Dispatch action to set sample drugs
      sampleDrugs.forEach(drug => dispatch(addDrug(drug)));
    }
  }, [dispatch]);

  // Event handlers
  const handleDrugFormSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateDrug(drugForm);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    if (editingDrugId) {
      dispatch(updateDrug({ ...drugForm, id: editingDrugId }));
    } else {
      const newDrug = {
        ...drugForm,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      dispatch(addDrug(newDrug));
    }

    resetDrugForm();
    setShowDrugForm(false);
  };

  const resetDrugForm = () => {
    setDrugForm({
      name: '',
      genericName: '',
      brandName: '',
      drugCode: '',
      nafdacNumber: '',
      pcnApprovalNumber: '',
      strength: '',
      dosageForm: '',
      unitOfMeasure: '',
      category: '',
      therapeuticClass: '',
      manufacturer: '',
      supplier: '',
      countryOfOrigin: '',
      unitPrice: '',
      sellingPrice: '',
      quantityInStock: '',
      reorderLevel: '',
      reorderQuantity: '',
      expiryDate: '',
      batchNumber: '',
      storageConditions: '',
      prescriptionRequired: false,
      controlledSubstance: false,
      narcotic: false,
      schedule: '',
      nhisCovered: false,
      nhisCode: '',
      nhisPrice: '',
      nemlCategory: '',
      sideEffects: '',
      contraindications: '',
      interactions: '',
      dosageInstructions: '',
      barcode: '',
      lastRestocked: new Date().toISOString().split('T')[0],
    });
    setEditingDrugId(null);
  };

  const handleEditDrug = (drug) => {
    setDrugForm(drug);
    setEditingDrugId(drug.id);
    setShowDrugForm(true);
  };

  const handleDeleteClick = (drug) => {
    setModalConfig({
      isOpen: true,
      type: 'delete',
      drugData: drug,
      action: () => dispatch(deleteDrug(drug.id)),
    });
  };

  const handleArchiveClick = (drug) => {
    setModalConfig({
      isOpen: true,
      type: 'archive',
      drugData: drug,
      action: () => dispatch(archiveDrug(drug.id)),
    });
  };

  const handleModalConfirm = () => {
    if (modalConfig.action) {
      modalConfig.action();
    }
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleAddToCart = (drug) => {
    dispatch(addToCart({
      ...drug,
      quantity: 1,
      totalPrice: drug.sellingPrice
    }));
  };

  const handleProcessSale = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    dispatch(processSale(cart));
    setShowCart(false);
    dispatch(clearCart());
  };

  const handleSearch = (e) => {
    dispatch(searchDrugs(e.target.value));
  };

  const handleFilter = (e) => {
    dispatch(filterDrugs(e.target.value));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate pagination
  const totalItems = filteredDrugs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedDrugs = filteredDrugs.slice(startIndex, endIndex);

  const handleSort = (e) => {
    dispatch(sortDrugs(e.target.value));
  };

  const handleExportReport = () => {
    dispatch(exportPharmacyReport());
    // In real implementation, this would trigger a download
    alert('Report exported successfully');
  };

  // Get modal configuration
  const getModalConfig = () => {
    const configs = {
      delete: {
        title: 'Delete Drug Record',
        message: 'Are you sure you want to permanently delete this drug from the inventory? This action cannot be undone.',
        confirmText: 'Delete Permanently',
        showSoftDeleteOption: true,
      },
      archive: {
        title: 'Archive Drug',
        message: 'This will remove the drug from active inventory but keep the record for historical purposes.',
        confirmText: 'Archive Drug',
        showSoftDeleteOption: false,
      },
    };
    return configs[modalConfig.type] || configs.delete;
  };

  return (
    <div className="pharmacy p-6">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Pharmacy Management</h2>
            <p className="text-gray-600">Nigerian Essential Medicines List (NEML) Integration with NAFDAC & PCN Compliance</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setShowReports(true)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md flex items-center"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </button>
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-md flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md flex items-center relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Total Drugs</p>
                <p className="text-2xl font-bold">{stats.totalDrugs}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Tag className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Inventory Value</p>
                <p className="text-2xl font-bold naira">{stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold">{stats.lowStockCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Expired</p>
                <p className="text-2xl font-bold">{stats.expiredCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Controlled</p>
                <p className="text-2xl font-bold">{stats.controlledCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-indigo-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Avg. Value</p>
                <p className="text-2xl font-bold naira">{Math.round(stats.averageStockValue).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Add/Edit Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingDrugId ? 'Edit Drug' : 'Add New Drug'}
              </h3>
              {showDrugForm && (
                <button
                  onClick={() => {
                    setShowDrugForm(false);
                    resetDrugForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            {!showDrugForm ? (
              <div className="space-y-3">
                <button
                  onClick={() => setShowDrugForm(true)}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Drug
                </button>
                <button
                  onClick={() => setShowRestockForm(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium flex items-center justify-center"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Restock Inventory
                </button>
                <button
                  onClick={() => setShowDispenseForm(true)}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 font-medium flex items-center justify-center"
                >
                  <Pill className="w-5 h-5 mr-2" />
                  Dispense Drug
                </button>
              </div>
            ) : (
              <form onSubmit={handleDrugFormSubmit} className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {/* Basic Information */}
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700 mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Drug Name *</label>
                      <input
                        type="text"
                        value={drugForm.name}
                        onChange={(e) => setDrugForm({...drugForm, name: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Generic Name</label>
                        <input
                          type="text"
                          value={drugForm.genericName}
                          onChange={(e) => setDrugForm({...drugForm, genericName: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Brand Name</label>
                        <input
                          type="text"
                          value={drugForm.brandName}
                          onChange={(e) => setDrugForm({...drugForm, brandName: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Drug Code</label>
                      <input
                        type="text"
                        value={drugForm.drugCode}
                        onChange={(e) => setDrugForm({...drugForm, drugCode: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g., ANT-MAL-001"
                      />
                    </div>
                  </div>
                </div>

                {/* Regulatory Information */}
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700 mb-2">Regulatory Information</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NAFDAC Number *</label>
                      <input
                        type="text"
                        value={drugForm.nafdacNumber}
                        onChange={(e) => setDrugForm({...drugForm, nafdacNumber: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="NAFDAC-04-1234"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">PCN Approval Number</label>
                      <input
                        type="text"
                        value={drugForm.pcnApprovalNumber}
                        onChange={(e) => setDrugForm({...drugForm, pcnApprovalNumber: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NEML Category</label>
                      <select
                        value={drugForm.nemlCategory}
                        onChange={(e) => setDrugForm({...drugForm, nemlCategory: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select Category</option>
                        {nemlCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Drug Specifications */}
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700 mb-2">Specifications</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Strength</label>
                        <input
                          type="text"
                          value={drugForm.strength}
                          onChange={(e) => setDrugForm({...drugForm, strength: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dosage Form</label>
                        <select
                          value={drugForm.dosageForm}
                          onChange={(e) => setDrugForm({...drugForm, dosageForm: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select Form</option>
                          {dosageForms.map(form => (
                            <option key={form} value={form}>{form}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={drugForm.category}
                        onChange={(e) => setDrugForm({...drugForm, category: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select Category</option>
                        {drugCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                      <select
                        value={drugForm.manufacturer}
                        onChange={(e) => setDrugForm({...drugForm, manufacturer: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select Manufacturer</option>
                        {nigerianManufacturers.map(man => (
                          <option key={man} value={man}>{man}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Inventory Information */}
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700 mb-2">Inventory</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Unit Price (₦)</label>
                        <input
                          type="number"
                          value={drugForm.unitPrice}
                          onChange={(e) => setDrugForm({...drugForm, unitPrice: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Selling Price (₦)</label>
                        <input
                          type="number"
                          value={drugForm.sellingPrice}
                          onChange={(e) => setDrugForm({...drugForm, sellingPrice: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity in Stock</label>
                        <input
                          type="number"
                          value={drugForm.quantityInStock}
                          onChange={(e) => setDrugForm({...drugForm, quantityInStock: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reorder Level</label>
                        <input
                          type="number"
                          value={drugForm.reorderLevel}
                          onChange={(e) => setDrugForm({...drugForm, reorderLevel: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                        <input
                          type="text"
                          value={drugForm.batchNumber}
                          onChange={(e) => setDrugForm({...drugForm, batchNumber: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                          type="date"
                          value={drugForm.expiryDate}
                          onChange={(e) => setDrugForm({...drugForm, expiryDate: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controlled Substance Information */}
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700 mb-2">Controlled Substance</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={drugForm.controlledSubstance}
                        onChange={(e) => setDrugForm({...drugForm, controlledSubstance: e.target.checked})}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Controlled Substance
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={drugForm.narcotic}
                        onChange={(e) => setDrugForm({...drugForm, narcotic: e.target.checked})}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Narcotic
                      </label>
                    </div>
                    {drugForm.controlledSubstance && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Schedule</label>
                        <select
                          value={drugForm.schedule}
                          onChange={(e) => setDrugForm({...drugForm, schedule: e.target.value})}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select Schedule</option>
                          {controlledSchedules.map(schedule => (
                            <option key={schedule} value={schedule}>{schedule}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* NHIS Information */}
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700 mb-2">NHIS Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={drugForm.nhisCovered}
                        onChange={(e) => setDrugForm({...drugForm, nhisCovered: e.target.checked})}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        NHIS Covered
                      </label>
                    </div>
                    {drugForm.nhisCovered && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">NHIS Code</label>
                          <input
                            type="text"
                            value={drugForm.nhisCode}
                            onChange={(e) => setDrugForm({...drugForm, nhisCode: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">NHIS Price (₦)</label>
                          <input
                            type="number"
                            value={drugForm.nhisPrice}
                            onChange={(e) => setDrugForm({...drugForm, nhisPrice: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium"
                  >
                    {editingDrugId ? 'Update' : 'Add'} Drug
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDrugForm(false);
                      resetDrugForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column - Drug List */}
        <div className="lg:col-span-3">
          <div className="bg-white px-3 sm:px-4 lg:px-6 py-4 sm:py-6 rounded-lg shadow-md">
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold">Drug Inventory</h3>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                <div className="relative flex-1 sm:flex-none sm:min-w-0 sm:flex-shrink">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <select
                  value={filterBy}
                  onChange={handleFilter}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-0"
                >
                  <option value="all">All Categories</option>
                  {drugCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={handleSort}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-0"
                >
                  <option value="name">Name A-Z</option>
                  <option value="quantity">Qty (High-Low)</option>
                  <option value="expiry">Expiry</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>

            {/* Alerts */}
            {lowStockItems.length > 0 && (
              <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                  <span className="font-medium text-orange-700">
                    {lowStockItems.length} drug(s) below reorder level
                  </span>
                </div>
              </div>
            )}

            {expiredDrugs.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="font-medium text-red-700">
                    {expiredDrugs.length} drug(s) have expired
                  </span>
                </div>
              </div>
            )}

            {/* Drug Table */}
            <div className="overflow-x-auto">
              {filteredDrugs.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-2">No drugs found</p>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try a different search term' : 'Add your first drug using the form'}
                  </p>
                </div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug Information</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regulatory</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedDrugs.map(drug => {
                      const isLowStock = drug.quantityInStock <= drug.reorderLevel;
                      const isExpired = new Date(drug.expiryDate) < new Date();
                      const expiryStatus = calculateExpiryStatus(drug.expiryDate);
                      
                      return (
                        <tr key={drug.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900">{drug.name}</div>
                            <div className="text-sm text-gray-500">{drug.genericName}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {drug.strength} • {drug.dosageForm}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm">
                              <span className="font-medium">Stock:</span> {drug.quantityInStock}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Price:</span> ₦{drug.sellingPrice}
                            </div>
                            <div className="text-xs text-gray-500">
                              Reorder: {drug.reorderLevel}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm">
                              <span className="font-medium">NAFDAC:</span> {drug.nafdacNumber}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">NEML:</span> {drug.nemlCategory}
                            </div>
                            {drug.controlledSubstance && (
                              <div className="text-xs text-red-600 font-medium">
                                Controlled: {drug.schedule}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                drug.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {drug.status}
                              </span>
                              {isLowStock && (
                                <div className="text-xs text-orange-600 flex items-center">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Low Stock
                                </div>
                              )}
                              {isExpired && (
                                <div className="text-xs text-red-600 flex items-center">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Expired
                                </div>
                              )}
                              {!isExpired && expiryStatus.days <= 30 && (
                                <div className="text-xs text-yellow-600 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Expires in {expiryStatus.days} days
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium">
                            <div className="flex flex-col space-y-2">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditDrug(drug)}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleArchiveClick(drug)}
                                  className="text-orange-600 hover:text-orange-900 text-sm"
                                >
                                  Archive
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(drug)}
                                  className="text-red-600 hover:text-red-900 text-sm"
                                >
                                  Delete
                                </button>
                              </div>
                              <button
                                onClick={() => handleAddToCart(drug)}
                                className="text-green-600 hover:text-green-900 text-sm flex items-center"
                              >
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                Add to Cart
                              </button>
                              <button
                                onClick={() => setShowDispenseForm(true)}
                                className="text-purple-600 hover:text-purple-900 text-sm flex items-center"
                              >
                                <Pill className="w-3 h-3 mr-1" />
                                Dispense
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                Showing {displayedDrugs.length} of {totalItems} drugs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Dispensing Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="max-h-96 overflow-y-auto mb-6">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Drug</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-4 py-3">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.strength}</div>
                            </td>
                            <td className="px-4 py-3 naira">₦{item.sellingPrice}</td>
                            <td className="px-4 py-3">{item.quantity || 1}</td>
                            <td className="px-4 py-3 naira">₦{(item.sellingPrice * (item.quantity || 1))}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => dispatch(removeFromCart(item.id))}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Total: <span className="naira">₦{cart.reduce((sum, item) => sum + (item.sellingPrice * (item.quantity || 1)), 0)}</span></p>
                    </div>
                    <div className="space-x-3">
                      <button
                        onClick={() => dispatch(clearCart())}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        Clear Cart
                      </button>
                      <button
                        onClick={handleProcessSale}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Process Sale
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Pharmacy Reports</h3>
                <button
                  onClick={() => setShowReports(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Inventory Reports</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Stock Level Report
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Expiry Report
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Low Stock Alert
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Fast Moving Items
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Sales Reports</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Daily Sales Summary
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Prescription Analysis
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      NHIS Claims Report
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Revenue by Drug Category
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Compliance Reports</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      NAFDAC Compliance
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Controlled Substances Register
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      PCN Inspection Report
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      NEML Compliance Report
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Financial Reports</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Profit & Loss Statement
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Inventory Valuation
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Supplier Payment Report
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                      Tax Report
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleExportReport}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        type={modalConfig.type}
        drugData={modalConfig.drugData}
        title={getModalConfig().title}
        message={getModalConfig().message}
        confirmText={getModalConfig().confirmText}
        showSoftDeleteOption={getModalConfig().showSoftDeleteOption}
      />
    </div>
  );
};

export default Pharmacy;