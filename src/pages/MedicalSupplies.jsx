import { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  AlertCircle,
  Droplet,
  Wrench,
  Menu,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Loader2,
  Check,
  ArrowUp,
  ArrowDown,
  Heart,
  Ambulance,
  Shield,
  Award,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  CreditCard,
  Banknote,
  Calculator,
  Settings,
  Globe,
  Mail,
  Smartphone,
  Baby,
  Brain,
  Bone,
  EyeOff,
  Star,
  Info,
  Zap,
  Home,
  Briefcase,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  HeartPulse,
  Stethoscope,
  Building2,
  Clipboard,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Navigation,
  Car,
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { apiRequest, parseListResponse } from '../utils/api';

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
    orange: 'bg-[#C87D3D]',
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
    'Available': { label: 'Available', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Low Stock': { label: 'Low Stock', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Out of Stock': { label: 'Out of Stock', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'Pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Approved': { label: 'Approved', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Good': { label: 'Good', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Fair': { label: 'Fair', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Poor': { label: 'Poor', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'Sterilized': { label: 'Sterilized', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Need Sterilization': { label: 'Need Sterilization', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Contaminated': { label: 'Contaminated', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
  };

  const config = statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== SUPPLY CARD ====================
const SupplyCard = ({ item, type }) => {
  const getStatusColor = (status) => {
    if (status === 'Low Stock') return 'text-[#C87D3D]';
    if (status === 'Out of Stock') return 'text-[#C8553D]';
    return 'text-[#2D7D46]';
  };

  const getSectionColor = (section) => {
    switch(section) {
      case 'consumables': return 'border-l-4 border-[#008751]';
      case 'reagents': return 'border-l-4 border-[#008751]';
      case 'radiology': return 'border-l-4 border-[#008751]';
      case 'surgical': return 'border-l-4 border-[#4A5A5A]';
      case 'linen': return 'border-l-4 border-[#008751]';
      default: return '';
    }
  };

  return (
    <div className={`bg-white border border-[#E8E3DC] p-4 sm:p-5 hover:bg-[#F7F5F2] transition-colors ${getSectionColor(item.section)}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Item</p>
          <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.name || 'Unnamed Item'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Category</p>
          <p className="text-sm text-[#1A1A1A] truncate">{item.category || 'Uncategorized'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Quantity</p>
          <p className={`text-sm font-medium ${getStatusColor(item.status)}`}>
            {item.quantityInStock || item.quantity || 0}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Unit Cost</p>
          <p className="text-sm text-[#1A1A1A]">₦{(item.unitCost || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Expiry</p>
          <p className="text-sm text-[#1A1A1A]">
            {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-NG') : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Status</p>
          <StatusBadge status={item.status} />
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const MedicalSupplies = () => {
  const getArray = (value) => Array.isArray(value) ? value : [];

  const [inventoryItems, setInventoryItems] = useState([]);
  const [activeTab, setActiveTab] = useState('consumables');
  const [showModal, setShowModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    quantity: '',
    expiryDate: '',
    supplier: '',
    unitCost: '',
    batchNumber: ''
  });

  const sectionFromItem = (item = {}) => {
    const haystack = `${item.name || ''} ${item.category || ''} ${item.generic_name || ''} ${item.form || ''}`.toLowerCase();

    if (/reagent|lab|test|diagnostic|culture|kit/.test(haystack)) return 'reagents';
    if (/radiology|x-ray|imaging|scan|film|contrast/.test(haystack)) return 'radiology';
    if (/surgical|instrument|scalpel|forceps|needle|drill/.test(haystack)) return 'surgical';
    if (/linen|laundry|sheet|drape|gown/.test(haystack)) return 'linen';
    return 'consumables';
  };

  const normalizeInventoryItem = (item = {}) => {
    const currentStock = Number(item.stock_quantity ?? item.currentStock ?? item.quantityInStock ?? 0);
    const reorderPoint = Number(item.reorder_level ?? item.reorderPoint ?? 0);
    const unitCost = Number(item.unit_price ?? item.unitCost ?? 0);
    const section = item.section || sectionFromItem(item);

    return {
      id: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      consumableId: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      reagentId: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      radiologyId: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      instrumentId: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      linenId: item.id || item.itemId || item.drug_code || `${section}-${Math.random()}`,
      name: item.name || item.drug_name || 'Unnamed Item',
      category: item.category || item.form || 'General',
      type: item.type || item.form || 'General',
      quantityInStock: currentStock,
      quantity: currentStock,
      currentStock,
      reorderPoint,
      unitCost,
      expiryDate: item.expiry_date || item.expiryDate || null,
      status: currentStock <= reorderPoint ? 'Low Stock' : 'Available',
      testType: item.testType || item.category || 'General',
      storageTemp: item.storage_conditions || item.storageTemp || 'Room Temp',
      sterilizationStatus: item.sterilizationStatus || 'Pending',
      condition: item.condition || 'Good',
      section,
      source: 'api'
    };
  };

  const loadSupplies = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiRequest('/api/v1/pharmacy/drugs/?page_size=100');
      const list = parseListResponse(response);
      const normalized = getArray(list).map(normalizeInventoryItem);
      setInventoryItems(normalized);
    } catch (error) {
      setInventoryItems([]);
      setErrorMessage(error.message || 'Unable to load medical supplies from the API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSupplies();
  }, []);

  const consumables = getArray(inventoryItems.filter(item => item.section === 'consumables'));
  const laboratoryReagents = getArray(inventoryItems.filter(item => item.section === 'reagents'));
  const radiologySupplies = getArray(inventoryItems.filter(item => item.section === 'radiology'));
  const surgicalInstruments = getArray(inventoryItems.filter(item => item.section === 'surgical'));
  const linenAndLaundry = getArray(inventoryItems.filter(item => item.section === 'linen'));
  const wasteManagement = getArray([]);
  const donations = getArray([]);

  const lowStockConsumables = consumables.filter(c => {
    if (!c || !c.currentStock || !c.reorderPoint) return false;
    return c.currentStock <= c.reorderPoint;
  });

  const pendingWaste = wasteManagement.filter(w => {
    if (!w || !w.status) return false;
    return w.status === 'Pending';
  });

  const getFilteredItems = () => {
    if (!searchQuery) {
      switch(activeTab) {
        case 'consumables': return consumables;
        case 'reagents': return laboratoryReagents;
        case 'radiology': return radiologySupplies;
        case 'surgical': return surgicalInstruments;
        case 'linen': return linenAndLaundry;
        case 'waste': return wasteManagement;
        default: return [];
      }
    }

    const query = searchQuery.toLowerCase();
    switch(activeTab) {
      case 'consumables':
        return consumables.filter(item => 
          item.name?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          item.status?.toLowerCase().includes(query)
        );
      case 'reagents':
        return laboratoryReagents.filter(item =>
          item.name?.toLowerCase().includes(query) ||
          item.testType?.toLowerCase().includes(query)
        );
      case 'radiology':
        return radiologySupplies.filter(item =>
          item.name?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
        );
      case 'surgical':
        return surgicalInstruments.filter(item =>
          item.name?.toLowerCase().includes(query) ||
          item.type?.toLowerCase().includes(query)
        );
      case 'linen':
        return linenAndLaundry.filter(item =>
          item.name?.toLowerCase().includes(query) ||
          item.type?.toLowerCase().includes(query)
        );
      case 'waste':
        return wasteManagement.filter(item =>
          item.wasteType?.toLowerCase().includes(query) ||
          item.source?.toLowerCase().includes(query)
        );
      default: return [];
    }
  };

  const filteredItems = getFilteredItems();

  const handleAddSupply = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.type || !formData.name || !formData.quantity) {
      setErrorMessage('Please select a supply type, enter a name, and set a quantity.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        generic_name: formData.name,
        brand_name: formData.name,
        drug_code: `SUP-${Date.now()}`,
        category: 'other',
        form: 'tablet',
        strength: '',
        stock_quantity: Number(formData.quantity),
        reorder_level: 5,
        reorder_quantity: Number(formData.quantity),
        unit_price: Number(formData.unitCost || 0),
        unit_of_measure: 'piece',
        batch_number: formData.batchNumber || '',
        expiry_date: formData.expiryDate || null,
        supplier: formData.supplier || '',
        storage_conditions: 'Room temperature',
        last_restocked: new Date().toISOString().split('T')[0],
      };

      await apiRequest('/api/v1/pharmacy/drugs/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccessMessage('Supply added successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);

      setFormData({
        type: '',
        name: '',
        quantity: '',
        expiryDate: '',
        supplier: '',
        unitCost: '',
        batchNumber: ''
      });
      setShowModal(false);
      await loadSupplies();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to create the supply record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    loadSupplies();
    setSuccessMessage('Data refreshed.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Tabs configuration
  const tabs = [
    { id: 'consumables', label: 'Consumables', icon: Package, count: consumables.length },
    { id: 'reagents', label: 'Reagents', icon: Droplet, count: laboratoryReagents.length },
    { id: 'radiology', label: 'Radiology', icon: Eye, count: radiologySupplies.length },
    { id: 'surgical', label: 'Surgical', icon: Wrench, count: surgicalInstruments.length },
    { id: 'linen', label: 'Linen', icon: Home, count: linenAndLaundry.length },
    { id: 'waste', label: 'Waste', icon: AlertCircle, count: wasteManagement.length },
  ];

  const totalItems = consumables.length + laboratoryReagents.length + radiologySupplies.length + surgicalInstruments.length + linenAndLaundry.length;

  return (
    <div className="medical-supplies min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Medical Supplies Management
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Consumables, reagents, equipment, and waste tracking
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={handleRefresh}
              tooltip="Refresh data"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowModal(true)}
              tooltip="Add new supply"
              variant="primary"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Supply</span>
              <span className="sm:hidden">Add</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Error & Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
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

      {/* Loading State */}
      {isLoading && (
        <div className="mb-4 p-3 bg-[#F7F5F2] border border-[#E8E3DC] text-sm text-[#5A5A5A] flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-[#008751] animate-spin" />
          Loading medical supplies...
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Total Items"
          value={totalItems}
          icon={Package}
          color="blue"
          tooltip="Total medical supplies"
        />
        <StatsCard
          title="Consumables"
          value={consumables.length}
          icon={Package}
          color="green"
          tooltip="Consumable items"
        />
        <StatsCard
          title="Reagents"
          value={laboratoryReagents.length}
          icon={Droplet}
          color="green"
          tooltip="Laboratory reagents"
        />
        <StatsCard
          title="Low Stock"
          value={lowStockConsumables.length}
          icon={AlertCircle}
          color="red"
          trend={lowStockConsumables.length > 0 ? 'down' : 'up'}
          trendValue={lowStockConsumables.length > 0 ? `${lowStockConsumables.length} need restocking` : 'All stocked'}
          tooltip="Items below reorder level"
        />
        <StatsCard
          title="Donations"
          value={donations.length}
          icon={Heart}
          color="orange"
          tooltip="Donated supplies"
        />
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
          <input
            type="text"
            placeholder={`Search in ${tabs.find(t => t.id === activeTab)?.label || 'consumables'}...`}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
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
                  <span className="text-[10px] text-[#B0A89E] ml-0.5">({tab.count})</span>
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* ==================== CONSUMABLES TAB ==================== */}
        {activeTab === 'consumables' && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Package className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No consumables found</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredItems.map(item => (
                <SupplyCard key={item.id} item={item} type="consumable" />
              ))
            )}
          </div>
        )}

        {/* ==================== REAGENTS TAB ==================== */}
        {activeTab === 'reagents' && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Droplet className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No laboratory reagents found</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredItems.map(item => (
                <SupplyCard key={item.id} item={item} type="reagent" />
              ))
            )}
          </div>
        )}

        {/* ==================== RADIOLOGY TAB ==================== */}
        {activeTab === 'radiology' && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Eye className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No radiology supplies found</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredItems.map(item => (
                <SupplyCard key={item.id} item={item} type="radiology" />
              ))
            )}
          </div>
        )}

        {/* ==================== SURGICAL TAB ==================== */}
        {activeTab === 'surgical' && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Wrench className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No surgical instruments found</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredItems.map(item => (
                <SupplyCard key={item.id} item={item} type="surgical" />
              ))
            )}
          </div>
        )}

        {/* ==================== LINEN TAB ==================== */}
        {activeTab === 'linen' && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Home className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No linen items found</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredItems.map(item => (
                <SupplyCard key={item.id} item={item} type="linen" />
              ))
            )}
          </div>
        )}

        {/* ==================== WASTE TAB ==================== */}
        {activeTab === 'waste' && (
          <div className="space-y-3">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <AlertCircle className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No waste management records found</p>
                {searchQuery && <p className="text-sm text-[#B0A89E] mt-1">No results for "{searchQuery}"</p>}
              </div>
            ) : (
              filteredItems.map(item => (
                <div key={item.wasteId} className={`bg-white border border-[#E8E3DC] p-4 sm:p-5 ${item.status === 'Pending' ? 'border-l-4 border-[#C87D3D]' : 'border-l-4 border-[#2D7D46]'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="sm:col-span-2 lg:col-span-1">
                      <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Type</p>
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.wasteType || 'General Waste'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Date</p>
                      <p className="text-sm text-[#1A1A1A]">
                        {item.date ? new Date(item.date).toLocaleDateString('en-NG') : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Quantity</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">{item.quantity || 0} {item.unit || 'units'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Source</p>
                      <p className="text-sm text-[#1A1A1A] truncate">{item.source || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Status</p>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ==================== ADD SUPPLY MODAL ==================== */}
      <GenericModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setFormData({
            type: '',
            name: '',
            quantity: '',
            expiryDate: '',
            supplier: '',
            unitCost: '',
            batchNumber: ''
          });
          setErrorMessage('');
        }}
        title="Add New Supply"
        size="lg"
      >
        <form onSubmit={handleAddSupply} className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Supply Type <span className="text-[#C8553D]">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(event) => setFormData({ ...formData, type: event.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            >
              <option value="">Select Supply Type</option>
              <option value="consumables">Consumable</option>
              <option value="reagents">Reagent</option>
              <option value="radiology">Radiology Supply</option>
              <option value="surgical">Surgical Instrument</option>
              <option value="linen">Linen</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Item Name <span className="text-[#C8553D]">*</span>
            </label>
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Quantity <span className="text-[#C8553D]">*</span>
            </label>
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(event) => setFormData({ ...formData, quantity: event.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Unit Cost
              </label>
              <input
                type="number"
                placeholder="Unit Cost"
                value={formData.unitCost}
                onChange={(event) => setFormData({ ...formData, unitCost: event.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Batch Number
              </label>
              <input
                type="text"
                placeholder="Batch Number"
                value={formData.batchNumber}
                onChange={(event) => setFormData({ ...formData, batchNumber: event.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Supplier
              </label>
              <input
                type="text"
                placeholder="Supplier"
                value={formData.supplier}
                onChange={(event) => setFormData({ ...formData, supplier: event.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(event) => setFormData({ ...formData, expiryDate: event.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {errorMessage && <div className="text-sm text-[#C8553D]">{errorMessage}</div>}

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              type="submit"
              tooltip="Add supply"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Add Supply
                </>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              type="button"
              onClick={() => {
                setShowModal(false);
                setFormData({
                  type: '',
                  name: '',
                  quantity: '',
                  expiryDate: '',
                  supplier: '',
                  unitCost: '',
                  batchNumber: ''
                });
                setErrorMessage('');
              }}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </form>
      </GenericModal>
    </div>
  );
};

export default MedicalSupplies;