import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package, Search, Filter, Plus,
  Edit, Trash2, AlertTriangle,
  Download, Upload, BarChart3, Pill,
  Shield, Clock, TrendingUp, AlertCircle,
  CheckCircle, XCircle, ShoppingCart, History,
  Eye, FileText, Calculator, Printer, Calendar, Tag,
  X, ChevronLeft, ChevronRight, MoreVertical,
  Layers, Box, Truck, DollarSign, Users,
  Clipboard, BookOpen, Award, ShieldCheck,
  Menu, Grid, List, Receipt, User, Building2
} from 'lucide-react';
import { 
  addDrug, updateDrug, deleteDrug, dispenseDrug,
  restockDrug, searchDrugs, filterDrugs, sortDrugs,
  setCurrentDrug, archiveDrug, exportPharmacyReport,
  checkDrugInteraction, generatePrescription,
  addToCart, removeFromCart, clearCart, processSale
} from '../features/pharmacySlice';
import ConfirmModal from '../components/ConfirmModal';
import { 
  validateDrug, formatNafdacNumber,
  calculateExpiryStatus, calculateReorderLevel
} from '../pages/src/utils/pharmacyUtils';
import { apiRequest } from '../utils/api';

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

// Error Modal Component
const ErrorModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 whitespace-pre-line">{message}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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

const Pharmacy = () => {
  const dispatch = useDispatch();
  const {
    drugs, filteredDrugs, currentDrug,
    loading, error, searchTerm,
    filterBy, sortBy, cart,
    salesHistory, lowStockItems,
    expiredDrugs, prescriptions,
    inventoryValue
  } = useSelector(state => state.pharmacy);
  const [tenantId, setTenantId] = useState(null);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const data = await apiRequest('/api/v1/tenants/active-tenants/');
        const tenantList = Array.isArray(data) ? data : (data.results || []);
        if (tenantList.length > 0) {
          setTenantId(tenantList[0].id || tenantList[0].public_id || tenantList[0]);
        }
      } catch (err) {
        console.error('Failed to fetch tenant:', err);
      }
    };
    fetchTenant();
  }, []);

  // State
  const [activeTab, setActiveTab] = useState('inventory');
  const [showDrugForm, setShowDrugForm] = useState(false);
  const [editingDrugId, setEditingDrugId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [viewMode, setViewMode] = useState('table');
  const [showCart, setShowCart] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showDispenseForm, setShowDispenseForm] = useState(false);
  const [showRestockForm, setShowRestockForm] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  // Modal state
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'delete',
    drugData: null,
    action: null,
  });

  // Error modal state
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: 'Error',
    message: '',
  });

  // Form data with Nigerian context - MATCHING DJANGO MODEL EXACTLY
  const [drugForm, setDrugForm] = useState({
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
    countryOfOrigin: 'Nigeria',
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

  // Constants - MATCHING DJANGO MODEL CHOICES EXACTLY
  const drugCategories = [
    { value: 'antibiotic', label: 'Antibiotic' },
    { value: 'analgesic', label: 'Analgesic' },
    { value: 'antihypertensive', label: 'Antihypertensive' },
    { value: 'antidiabetic', label: 'Antidiabetic' },
    { value: 'antimalarial', label: 'Antimalarial' },
    { value: 'vaccine', label: 'Vaccine' },
    { value: 'supplement', label: 'Supplement' },
    { value: 'other', label: 'Other' }
  ];

  const dosageForms = [
    { value: 'tablet', label: 'Tablet' },
    { value: 'capsule', label: 'Capsule' },
    { value: 'syrup', label: 'Syrup' },
    { value: 'injection', label: 'Injection' },
    { value: 'ointment', label: 'Ointment' },
    { value: 'cream', label: 'Cream' },
    { value: 'drops', label: 'Drops' },
    { value: 'inhaler', label: 'Inhaler' },
    { value: 'suppository', label: 'Suppository' }
  ];

  const nemlCategories = [
    'Essential-Core',
    'Essential-Complementary',
    'Specialist',
    'Supplementary',
    'Not-in-NEML'
  ];

  const controlledSchedules = [
    'C1 - Most Restricted',
    'C2 - Restricted',
    'C3 - Less Restricted',
    'C4 - Least Restricted',
    'Non-controlled'
  ];

  const nigerianManufacturers = [
    'Emzor Pharmaceuticals',
    'Fidson Healthcare',
    'May & Baker Nigeria',
    'Swiss Pharma Nigeria',
    'Chi Pharmaceuticals',
    'Greenlife Pharmaceuticals',
    'Mopson Pharmaceuticals',
    'Biotech Pharmaceuticals',
    'GSK Nigeria',
    'Sanofi Nigeria',
    'Pfizer Nigeria',
    'Other'
  ];

  // Mock data for different tabs
  const mockPrescriptions = [
    { id: 1, patient: 'John Doe', drug: 'Artemether/Lumefantrine', date: '2024-01-15', status: 'dispensed', doctor: 'Dr. Adebayo' },
    { id: 2, patient: 'Jane Smith', drug: 'Amoxicillin', date: '2024-01-14', status: 'pending', doctor: 'Dr. Ogunlesi' },
    { id: 3, patient: 'Samuel Johnson', drug: 'Morphine Injection', date: '2024-01-13', status: 'approved', doctor: 'Dr. Okonkwo' },
  ];

  const mockSales = [
    { id: 1, patient: 'Mary Williams', amount: 2500, date: '2024-01-15', paymentMethod: 'cash' },
    { id: 2, patient: 'Peter Obi', amount: 1800, date: '2024-01-14', paymentMethod: 'nhis' },
    { id: 3, patient: 'Grace Adeyemi', amount: 3200, date: '2024-01-13', paymentMethod: 'hmo' },
  ];

  const mockSuppliers = [
    { id: 1, name: 'Emzor Pharmaceuticals', contact: '080-1234-5678', products: 45, status: 'active' },
    { id: 2, name: 'Fidson Healthcare', contact: '080-2345-6789', products: 38, status: 'active' },
    { id: 3, name: 'May & Baker Nigeria', contact: '080-3456-7890', products: 52, status: 'active' },
  ];

  // Stats
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
    const activeCount = drugs.filter(drug => drug.status === 'active').length;

    return {
      totalDrugs,
      totalValue,
      lowStockCount,
      expiredCount,
      controlledCount,
      activeCount,
      averageStockValue: totalValue / totalDrugs || 0,
    };
  }, [drugs]);

  // Pagination
  const totalItems = filteredDrugs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedDrugs = filteredDrugs.slice(startIndex, endIndex);

  // Handlers
  const handleDrugFormSubmit = async (e) => {
    e.preventDefault();
    const validation = validateDrug(drugForm);
    if (!validation.isValid) {
      setErrorModal({
        isOpen: true,
        title: 'Validation Error',
        message: validation.errors.join('\n'),
      });
      return;
    }

    // Ensure tenant ID is available
    if (!tenantId) {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Tenant information is required. Please refresh the page and try again.',
      });
      return;
    }

    try {
      const toSnakeCase = (str) => str ? str.toLowerCase().replace(/[\s&]+/g, '_') : '';
      
      // Build payload matching Django model exactly
      const payload = {
        tenant: tenantId, // CRITICAL: Include tenant field
        name: drugForm.name.trim(),
        generic_name: drugForm.genericName.trim(),
        brand_name: drugForm.brandName.trim(),
        drug_code: drugForm.drugCode.trim(),
        nafdac_number: formatNafdacNumber(drugForm.nafdacNumber),
        strength: drugForm.strength.trim(),
        form: toSnakeCase(drugForm.dosageForm), // Must match model choices
        category: toSnakeCase(drugForm.category), // Must match model choices
        stock_quantity: parseInt(drugForm.quantityInStock) || 0,
        reorder_level: parseInt(drugForm.reorderLevel) || 10,
        unit_price: parseFloat(drugForm.unitPrice) || 0,
        is_controlled: drugForm.controlledSubstance,
      };

      if (editingDrugId) {
        await apiRequest(`/api/v1/pharmacy/drugs/${editingDrugId}/`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        dispatch(updateDrug({ ...drugForm, id: editingDrugId }));
      } else {
        const response = await apiRequest('/api/v1/pharmacy/drugs/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        dispatch(addDrug({ ...drugForm, id: response.id || Date.now() }));
      }

      setErrorModal({
        isOpen: true,
        title: 'Success',
        message: editingDrugId ? 'Drug updated successfully' : 'Drug added successfully',
      });
      resetDrugForm();
      setShowDrugForm(false);
    } catch (err) {
      let errorMessage = err.message || 'Failed to save drug. Please try again.';
      if (err.data && typeof err.data === 'object') {
        errorMessage = Object.entries(err.data)
          .map(([field, errors]) => {
            const fieldLabel = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const msg = Array.isArray(errors) ? errors.join(', ') : errors;
            return `${fieldLabel}: ${msg}`;
          })
          .join('\n');
      }
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: errorMessage,
      });
    }
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
      countryOfOrigin: 'Nigeria',
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
    setDrugForm({
      ...drug,
      dosageForm: drug.form, // Map form to dosageForm for display
      category: drug.category,
      quantityInStock: drug.stock_quantity,
      unitPrice: drug.unit_price,
      reorderLevel: drug.reorder_level,
    });
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

  const handleModalConfirm = () => {
    if (modalConfig.action) modalConfig.action();
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    dispatch(searchDrugs(value));
  };

  const handleFilter = (e) => {
    dispatch(filterDrugs(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    dispatch(sortDrugs(e.target.value));
  };

  const handleExportReport = () => {
    dispatch(exportPharmacyReport());
    setErrorModal({
      isOpen: true,
      title: 'Success',
      message: 'Report exported successfully',
    });
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
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Cart is empty',
      });
      return;
    }
    dispatch(processSale(cart));
    setShowCart(false);
    dispatch(clearCart());
  };

  const getStatusBadge = (drug) => {
    const isExpired = new Date(drug.expiryDate) < new Date();
    const isLowStock = drug.quantityInStock <= drug.reorderLevel;
    
    if (isExpired) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800' };
    }
    if (isLowStock) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    }
    if (drug.controlledSubstance) {
      return { label: 'Controlled', color: 'bg-purple-100 text-purple-800' };
    }
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'inventory':
        return renderInventoryContent();
      case 'prescriptions':
        return renderPrescriptionsContent();
      case 'sales':
        return renderSalesContent();
      case 'suppliers':
        return renderSuppliersContent();
      default:
        return renderInventoryContent();
    }
  };

  // Inventory Tab Content
  const renderInventoryContent = () => {
    return (
      <>
        {/* Alerts */}
        {(lowStockItems.length > 0 || expiredDrugs.length > 0) && (
          <div className="px-3 sm:px-4 pt-3 sm:pt-4 space-y-1.5 sm:space-y-2">
            {lowStockItems.length > 0 && (
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-yellow-800">
                  <span className="font-medium">{lowStockItems.length}</span> drug(s) below reorder level
                </span>
              </div>
            )}
            {expiredDrugs.length > 0 && (
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-red-800">
                  <span className="font-medium">{expiredDrugs.length}</span> drug(s) have expired
                </span>
              </div>
            )}
          </div>
        )}

        {/* Drug List */}
        <div className="p-3 sm:p-4">
          {filteredDrugs.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 font-medium text-sm sm:text-base">No drugs found</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {searchQuery ? 'Try adjusting your search or filters' : 'Start by adding your first drug'}
              </p>
              {!searchQuery && (
                <ButtonWithTooltip
                  onClick={() => setShowDrugForm(true)}
                  tooltip="Add a new drug to inventory"
                  variant="primary"
                  className="mt-3 sm:mt-4"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Add Drug
                </ButtonWithTooltip>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-3 sm:mx-0">
                <table className="w-full min-w-[640px] sm:min-w-0">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <Tooltip text="Select all drugs">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDrugs(displayedDrugs.map(d => d.id));
                              } else {
                                setSelectedDrugs([]);
                              }
                            }}
                          />
                        </Tooltip>
                      </th>
                      <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Drug</th>
                      <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                      <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                      <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayedDrugs.map((drug) => {
                      const status = getStatusBadge(drug);
                      const expiryDays = calculateExpiryStatus(drug.expiryDate);
                      
                      return (
                        <tr key={drug.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-2 sm:py-3">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer"
                              checked={selectedDrugs.includes(drug.id)}
                              onChange={() => {
                                setSelectedDrugs(prev =>
                                  prev.includes(drug.id)
                                    ? prev.filter(id => id !== drug.id)
                                    : [...prev, drug.id]
                                );
                              }}
                            />
                          </td>
                          <td className="py-2 sm:py-3">
                            <div className="font-medium text-gray-900 text-xs sm:text-sm">{drug.name}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500">{drug.genericName}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 sm:mt-1">
                              {drug.strength} • {drug.dosageForm}
                            </div>
                            {drug.nemlCategory && (
                              <span className="inline-block mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                                {drug.nemlCategory}
                              </span>
                            )}
                          </td>
                          <td className="py-2 sm:py-3 hidden sm:table-cell">
                            <div className="font-medium text-xs sm:text-sm">{drug.quantityInStock}</div>
                            <div className="text-[10px] text-gray-500">
                              Reorder: {drug.reorderLevel}
                            </div>
                            {drug.batchNumber && (
                              <div className="text-[10px] text-gray-400">
                                Batch: {drug.batchNumber}
                              </div>
                            )}
                          </td>
                          <td className="py-2 sm:py-3">
                            <div className="font-medium text-xs sm:text-sm">₦{drug.sellingPrice}</div>
                            <div className="text-[10px] text-gray-500 hidden sm:block">
                              Cost: ₦{drug.unitPrice}
                            </div>
                          </td>
                          <td className="py-2 sm:py-3 hidden md:table-cell">
                            <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-medium rounded-full ${status.color}`}>
                              {status.label}
                            </span>
                            {!new Date(drug.expiryDate) < new Date() && (
                              <div className={`text-[10px] mt-0.5 sm:mt-1 ${expiryDays.days <= 30 ? 'text-yellow-600' : 'text-gray-500'}`}>
                                {expiryDays.days <= 30 ? (
                                  <span className="flex items-center gap-0.5 sm:gap-1">
                                    <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    {expiryDays.days}d
                                  </span>
                                ) : (
                                  <span className="hidden sm:inline">{new Date(drug.expiryDate).toLocaleDateString()}</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="py-2 sm:py-3">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <IconButton
                                icon={Edit}
                                onClick={() => handleEditDrug(drug)}
                                tooltip="Edit drug details"
                                variant="primary"
                              />
                              <IconButton
                                icon={ShoppingCart}
                                onClick={() => handleAddToCart(drug)}
                                tooltip="Add to dispensing cart"
                                variant="success"
                              />
                              <IconButton
                                icon={Trash2}
                                onClick={() => handleDeleteClick(drug)}
                                tooltip="Delete drug from inventory"
                                variant="danger"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 gap-2 sm:gap-0">
                <div className="text-[10px] sm:text-xs text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <IconButton
                    icon={ChevronLeft}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    tooltip="Previous page"
                    variant="default"
                    disabled={currentPage === 1}
                  />
                  <span className="text-[10px] sm:text-xs text-gray-600">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    tooltip="Next page"
                    variant="default"
                    disabled={currentPage === totalPages}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  // Prescriptions Tab Content
  const renderPrescriptionsContent = () => {
    return (
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Prescriptions</h3>
          <ButtonWithTooltip
            tooltip="Create new prescription"
            variant="primary"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            New Prescription
          </ButtonWithTooltip>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{prescription.patient}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm">{prescription.drug}</td>
                  <td className="py-3 text-sm">{prescription.doctor}</td>
                  <td className="py-3 text-sm">{prescription.date}</td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      prescription.status === 'dispensed' ? 'bg-green-100 text-green-800' :
                      prescription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <IconButton icon={Eye} tooltip="View prescription" variant="primary" />
                      <IconButton icon={Printer} tooltip="Print prescription" variant="default" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Sales Tab Content
  const renderSalesContent = () => {
    return (
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Sales History</h3>
          <div className="flex items-center gap-2">
            <ButtonWithTooltip
              tooltip="Export sales report"
              variant="secondary"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Export
            </ButtonWithTooltip>
            <ButtonWithTooltip
              tooltip="View sales analytics"
              variant="primary"
            >
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Analytics
            </ButtonWithTooltip>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{sale.patient}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm font-medium">₦{sale.amount.toLocaleString()}</td>
                  <td className="py-3 text-sm">{sale.date}</td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      sale.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                      sale.paymentMethod === 'nhis' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {sale.paymentMethod.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <IconButton icon={Receipt} tooltip="View receipt" variant="primary" />
                      <IconButton icon={Printer} tooltip="Print receipt" variant="default" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Suppliers Tab Content
  const renderSuppliersContent = () => {
    return (
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Suppliers</h3>
          <ButtonWithTooltip
            tooltip="Add new supplier"
            variant="primary"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Add Supplier
          </ButtonWithTooltip>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{supplier.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm">{supplier.contact}</td>
                  <td className="py-3 text-sm">{supplier.products}</td>
                  <td className="py-3">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <IconButton icon={Edit} tooltip="Edit supplier" variant="primary" />
                      <IconButton icon={Eye} tooltip="View products" variant="default" />
                      <IconButton icon={Truck} tooltip="View orders" variant="info" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Pharmacy Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              NEML • NAFDAC & PCN Compliant
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonWithTooltip
              onClick={() => setShowReports(true)}
              tooltip="View pharmacy reports and analytics"
              variant="secondary"
            >
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Reports</span>
            </ButtonWithTooltip>
            
            <ButtonWithTooltip
              onClick={() => setShowCart(true)}
              tooltip={`View cart (${cart.length} items)`}
              variant="secondary"
              className="relative"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </ButtonWithTooltip>
            
            <ButtonWithTooltip
              onClick={() => setShowDrugForm(true)}
              tooltip="Add a new drug to inventory"
              variant="primary"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Add Drug</span>
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          <Tooltip text="Total number of drugs in inventory">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stats.totalDrugs}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Total value of all inventory">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Value</p>
                  <p className="text-sm sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">₦{stats.totalValue.toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Drugs below reorder level - needs restocking">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Low Stock</p>
                  <p className="text-lg sm:text-2xl font-bold text-yellow-600 mt-0.5 sm:mt-1">{stats.lowStockCount}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Drugs that have passed expiry date">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Expired</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-600 mt-0.5 sm:mt-1">{stats.expiredCount}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Controlled substances requiring special handling">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Controlled</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600 mt-0.5 sm:mt-1">{stats.controlledCount}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Currently active drugs in inventory">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Active</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stats.activeCount}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                </div>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
          <nav className="flex gap-4 sm:gap-6 min-w-max" aria-label="Tabs">
            <Tooltip text="View and manage drug inventory">
              <button
                onClick={() => {
                  setActiveTab('inventory');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-1 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'inventory'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Inventory
              </button>
            </Tooltip>
            
            <Tooltip text="View and manage prescriptions">
              <button
                onClick={() => {
                  setActiveTab('prescriptions');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-1 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'prescriptions'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clipboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Prescriptions
              </button>
            </Tooltip>
            
            <Tooltip text="View sales history and analytics">
              <button
                onClick={() => {
                  setActiveTab('sales');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-1 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'sales'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Sales
              </button>
            </Tooltip>
            
            <Tooltip text="Manage suppliers and vendor relationships">
              <button
                onClick={() => {
                  setActiveTab('suppliers');
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-1 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'suppliers'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Suppliers
              </button>
            </Tooltip>
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Column - Filters (Only for Inventory tab) */}
          {activeTab === 'inventory' && (
            <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 sticky top-6">
                <div className="flex items-center justify-between lg:hidden mb-3">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="hidden lg:block font-semibold text-gray-900 mb-4">Filters</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={filterBy}
                      onChange={handleFilter}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Categories</option>
                      {drugCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="low">Low Stock</option>
                      <option value="expired">Expired</option>
                      <option value="controlled">Controlled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">NEML Category</label>
                    <select className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="all">All</option>
                      {nemlCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1">Manufacturer</label>
                    <select className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="all">All</option>
                      {nigerianManufacturers.map(man => (
                        <option key={man} value={man}>{man}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-gray-200">
                    <h4 className="text-[10px] sm:text-xs font-medium text-gray-700 mb-2">Quick Actions</h4>
                    <div className="space-y-1.5 sm:space-y-2">
                      <ButtonWithTooltip
                        onClick={() => setShowDispenseForm(true)}
                        tooltip="Dispense medication to patient"
                        variant="secondary"
                        className="w-full justify-start"
                      >
                        <Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Dispense Drug
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        onClick={() => setShowRestockForm(true)}
                        tooltip="Restock inventory items"
                        variant="secondary"
                        className="w-full justify-start"
                      >
                        <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Restock Inventory
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        tooltip="Import data from spreadsheet"
                        variant="secondary"
                        className="w-full justify-start"
                      >
                        <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Import Data
                      </ButtonWithTooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Column - Content */}
          <div className={activeTab === 'inventory' ? 'lg:col-span-3' : 'lg:col-span-4'}>
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Toolbar - Only for inventory tab */}
              {activeTab === 'inventory' && (
                <div className="p-3 sm:p-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="relative flex-1 max-w-full sm:max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search drugs..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <IconButton
                        icon={Filter}
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        tooltip={showMobileFilters ? "Hide filters" : "Show filters"}
                        variant="default"
                        className="lg:hidden"
                      />
                      <IconButton
                        icon={viewMode === 'table' ? Grid : List}
                        onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                        tooltip={viewMode === 'table' ? "Switch to grid view" : "Switch to table view"}
                        variant="default"
                      />
                      <IconButton
                        icon={Printer}
                        onClick={() => window.print()}
                        tooltip="Print inventory list"
                        variant="default"
                      />
                      <IconButton
                        icon={Download}
                        onClick={handleExportReport}
                        tooltip="Export report to file"
                        variant="default"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content */}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Drug Form Modal */}
      {showDrugForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-8">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowDrugForm(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  {editingDrugId ? 'Edit Drug' : 'Add New Drug'}
                </h2>
                <IconButton
                  icon={X}
                  onClick={() => {
                    setShowDrugForm(false);
                    resetDrugForm();
                  }}
                  tooltip="Close form"
                  variant="default"
                />
              </div>
              
              <form onSubmit={handleDrugFormSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Drug Name *</label>
                      <input
                        type="text"
                        value={drugForm.name}
                        onChange={(e) => setDrugForm({...drugForm, name: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Generic Name</label>
                      <input
                        type="text"
                        value={drugForm.genericName}
                        onChange={(e) => setDrugForm({...drugForm, genericName: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={drugForm.brandName}
                        onChange={(e) => setDrugForm({...drugForm, brandName: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Drug Code</label>
                      <input
                        type="text"
                        value={drugForm.drugCode}
                        onChange={(e) => setDrugForm({...drugForm, drugCode: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., ANT-MAL-001"
                      />
                    </div>
                  </div>
                </div>

                {/* Regulatory Information */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Regulatory Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">NAFDAC Number</label>
                      <input
                        type="text"
                        value={drugForm.nafdacNumber}
                        onChange={(e) => setDrugForm({...drugForm, nafdacNumber: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="NAFDAC-04-1234"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">PCN Approval Number</label>
                      <input
                        type="text"
                        value={drugForm.pcnApprovalNumber}
                        onChange={(e) => setDrugForm({...drugForm, pcnApprovalNumber: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">NEML Category</label>
                      <select
                        value={drugForm.nemlCategory}
                        onChange={(e) => setDrugForm({...drugForm, nemlCategory: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Category</option>
                        {nemlCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Manufacturer</label>
                      <select
                        value={drugForm.manufacturer}
                        onChange={(e) => setDrugForm({...drugForm, manufacturer: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Manufacturer</option>
                        {nigerianManufacturers.map(man => (
                          <option key={man} value={man}>{man}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Drug Specifications - MATCHING DJANGO MODEL */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Strength</label>
                      <input
                        type="text"
                        value={drugForm.strength}
                        onChange={(e) => setDrugForm({...drugForm, strength: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Dosage Form *</label>
                      <select
                        value={drugForm.dosageForm}
                        onChange={(e) => setDrugForm({...drugForm, dosageForm: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Form</option>
                        {dosageForms.map(form => (
                          <option key={form.value} value={form.value}>{form.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        value={drugForm.category}
                        onChange={(e) => setDrugForm({...drugForm, category: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {drugCategories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Therapeutic Class</label>
                      <input
                        type="text"
                        value={drugForm.therapeuticClass}
                        onChange={(e) => setDrugForm({...drugForm, therapeuticClass: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory Information */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Inventory</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price (₦)</label>
                      <input
                        type="number"
                        value={drugForm.unitPrice}
                        onChange={(e) => setDrugForm({...drugForm, unitPrice: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Selling Price (₦)</label>
                      <input
                        type="number"
                        value={drugForm.sellingPrice}
                        onChange={(e) => setDrugForm({...drugForm, sellingPrice: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quantity in Stock</label>
                      <input
                        type="number"
                        value={drugForm.quantityInStock}
                        onChange={(e) => setDrugForm({...drugForm, quantityInStock: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Reorder Level</label>
                      <input
                        type="number"
                        value={drugForm.reorderLevel}
                        onChange={(e) => setDrugForm({...drugForm, reorderLevel: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Batch Number</label>
                      <input
                        type="text"
                        value={drugForm.batchNumber}
                        onChange={(e) => setDrugForm({...drugForm, batchNumber: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={drugForm.expiryDate}
                        onChange={(e) => setDrugForm({...drugForm, expiryDate: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Storage Conditions</label>
                      <input
                        type="text"
                        value={drugForm.storageConditions}
                        onChange={(e) => setDrugForm({...drugForm, storageConditions: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Room temperature, Refrigerated"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Unit of Measure</label>
                      <input
                        type="text"
                        value={drugForm.unitOfMeasure}
                        onChange={(e) => setDrugForm({...drugForm, unitOfMeasure: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="tablet, capsule, ml, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Controlled Substance */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Controlled Substance</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={drugForm.controlledSubstance}
                        onChange={(e) => setDrugForm({...drugForm, controlledSubstance: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm text-gray-700">Controlled Substance</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={drugForm.narcotic}
                        onChange={(e) => setDrugForm({...drugForm, narcotic: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm text-gray-700">Narcotic</label>
                    </div>
                    {drugForm.controlledSubstance && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Schedule</label>
                        <select
                          value={drugForm.schedule}
                          onChange={(e) => setDrugForm({...drugForm, schedule: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">NHIS Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={drugForm.nhisCovered}
                        onChange={(e) => setDrugForm({...drugForm, nhisCovered: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm text-gray-700">NHIS Covered</label>
                    </div>
                    {drugForm.nhisCovered && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">NHIS Code</label>
                          <input
                            type="text"
                            value={drugForm.nhisCode}
                            onChange={(e) => setDrugForm({...drugForm, nhisCode: e.target.value})}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">NHIS Price (₦)</label>
                          <input
                            type="number"
                            value={drugForm.nhisPrice}
                            onChange={(e) => setDrugForm({...drugForm, nhisPrice: e.target.value})}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Clinical Information */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Clinical Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Dosage Instructions</label>
                      <textarea
                        value={drugForm.dosageInstructions}
                        onChange={(e) => setDrugForm({...drugForm, dosageInstructions: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="2"
                        placeholder="e.g., Take 1 tablet twice daily after meals"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Side Effects</label>
                      <textarea
                        value={drugForm.sideEffects}
                        onChange={(e) => setDrugForm({...drugForm, sideEffects: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="2"
                        placeholder="List common side effects"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Contraindications</label>
                      <textarea
                        value={drugForm.contraindications}
                        onChange={(e) => setDrugForm({...drugForm, contraindications: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="2"
                        placeholder="List contraindications"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Interactions</label>
                      <textarea
                        value={drugForm.interactions}
                        onChange={(e) => setDrugForm({...drugForm, interactions: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="2"
                        placeholder="List drug interactions"
                      />
                    </div>
                  </div>
                </div>

                {/* Prescription Requirement */}
                <div className="border-b border-gray-200 pb-3 sm:pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Prescription Settings</h4>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={drugForm.prescriptionRequired}
                      onChange={(e) => setDrugForm({...drugForm, prescriptionRequired: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">Prescription Required</label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    {editingDrugId ? 'Update Drug' : 'Add Drug'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDrugForm(false);
                      resetDrugForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 sm:py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        type={modalConfig.type}
        drugData={modalConfig.drugData}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        title={errorModal.title}
        message={errorModal.message}
      />
    </div>
  );
};

export default Pharmacy;