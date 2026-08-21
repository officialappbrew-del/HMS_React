import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  TrendingDown,
  Barcode,
  Box,
  X,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  Calendar,
  Clock,
  FileText,
  Pill,
  Bed,
  Heart,
  Stethoscope,
  Building2,
  Clipboard,
  Shield,
  Ambulance,
  Smartphone,
  Phone,
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Printer,
  Download,
  Filter,
  User,
  Edit,
  Menu,
  CreditCard,
  RotateCcw,
  Hospital,
  Upload,
  UserCircle,
  IdCard,
  Droplets,
  Baby,
  HeartPulse,
  Brain,
  Bone,
  MapPin,
  Globe,
  BookOpen,
  Award,
  Mail,
  UserPlus,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  EyeOff,
  Star,
  Info,
  Zap,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  MoreVertical,
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import { apiRequest } from '../utils/api';
import { fetchDrugs } from '../features/pharmacySlice';

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
  // Helper to format large numbers for display
  const formatDisplayValue = (val) => {
    // If value is already a string with currency symbol, extract the number
    let num = val;
    if (typeof val === 'string') {
      // Remove currency symbols, commas, and convert to number
      const cleaned = val.replace(/[₦,]/g, '');
      num = parseFloat(cleaned);
      if (isNaN(num)) return val; // Return original if not a number
    }
    
    // If it's not a number, return as is
    if (typeof num !== 'number' || isNaN(num)) return val;
    
    // Format based on size
    if (num >= 1000000000) {
      return `₦${(num / 1000000000).toFixed(1)}B`;
    }
    if (num >= 1000000) {
      return `₦${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `₦${(num / 1000).toFixed(1)}K`;
    }
    return `₦${num.toLocaleString()}`;
  };

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
            <p className="mt-1 text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight truncate">
              {formatDisplayValue(value)}
            </p>
            {subValue && (
              <p className="text-xs text-[#5A5A5A] mt-0.5 truncate">{subValue}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-1 text-xs ${trendColors[trend]} font-medium`}>
                {trend === 'up' && <ArrowUp className="w-3 h-3 mr-0.5 flex-shrink-0" />}
                {trend === 'down' && <ArrowDown className="w-3 h-3 mr-0.5 flex-shrink-0" />}
                <span className="truncate">{trendValue}</span>
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

// ==================== STATUS BADGE COMPONENT ====================
const StatusBadge = ({ status }) => {
  const statusMap = {
    'in-stock': { label: 'In Stock', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'low-stock': { label: 'Low Stock', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'out-of-stock': { label: 'Out of Stock', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
  };

  const statusConfig = statusMap[status] || statusMap['in-stock'];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border ${statusConfig.color}`}>
      {status === 'low-stock' && <AlertCircle className="w-3 h-3" />}
      {status === 'out-of-stock' && <X className="w-3 h-3" />}
      {status === 'in-stock' && <Check className="w-3 h-3" />}
      {statusConfig.label}
    </span>
  );
};

const Inventory = () => {
  const dispatch = useDispatch();
  const { drugs, loading } = useSelector(state => state.pharmacy || { drugs: [], loading: false });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'delete',
    title: '',
    message: '',
    onConfirm: null,
  });

  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    quantity: '',
    reorderLevel: '',
    unit: 'tablet',
    supplier: '',
    expiryDate: '',
    unitCost: ''
  });

  useEffect(() => {
    dispatch(fetchDrugs());
  }, [dispatch]);

  const getStatus = (drug) => {
    const qty = parseInt(drug.stock_quantity) || 0;
    const reorder = parseInt(drug.reorder_level) || 0;
    if (qty === 0) return 'out-of-stock';
    if (qty <= reorder) return 'low-stock';
    return 'in-stock';
  };

  const filteredInventory = drugs.map(drug => ({
    id: drug.id,
    name: drug.name,
    batchNumber: drug.batch_number || '-',
    quantity: drug.stock_quantity,
    reorderLevel: drug.reorder_level,
    unit: drug.unit_of_measure || drug.form || 'tablets',
    supplier: drug.supplier || '-',
    expiryDate: drug.expiry_date || '',
    unitCost: drug.unit_price,
    status: getStatus(drug),
  })).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddInventory = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name || !formData.quantity || !formData.reorderLevel) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const tenantPublicId = localStorage.getItem('tenantId');
      const status = parseInt(formData.quantity) === 0 ? 'out-of-stock' :
                     parseInt(formData.quantity) <= parseInt(formData.reorderLevel) ? 'low-stock' : 'in-stock';

      const payload = {
        name: formData.name.trim(),
        drug_code: `INV-${Date.now()}`,
        category: 'other',
        form: formData.unit,
        stock_quantity: parseInt(formData.quantity),
        reorder_level: parseInt(formData.reorderLevel),
        unit_price: parseFloat(formData.unitCost) || 0,
        selling_price: parseFloat(formData.unitCost) || 0,
        batch_number: formData.batchNumber.trim(),
        expiry_date: formData.expiryDate || null,
        supplier: formData.supplier.trim(),
        unit_of_measure: formData.unit,
        tenant: tenantPublicId,
      };

      if (editingId) {
        await apiRequest(`/api/v1/pharmacy/drugs/${editingId}/`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setSuccessMessage('Inventory item updated successfully.');
      } else {
        await apiRequest('/api/v1/pharmacy/drugs/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSuccessMessage('Inventory item added successfully.');
      }

      dispatch(fetchDrugs());
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        batchNumber: '',
        quantity: '',
        reorderLevel: '',
        unit: 'tablet',
        supplier: '',
        expiryDate: '',
        unitCost: ''
      });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save inventory item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (item) => {
    setModalConfig({
      isOpen: true,
      type: 'delete',
      title: 'Delete Inventory Item',
      message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await apiRequest(`/api/v1/pharmacy/drugs/${item.id}/`, { method: 'DELETE' });
          dispatch(fetchDrugs());
          setSuccessMessage('Inventory item deleted successfully.');
        } catch (err) {
          setErrorMessage(err.message || 'Failed to delete item');
          return;
        }
        setModalConfig({ ...modalConfig, isOpen: false });
      },
    });
  };

  const handleEditInventory = (item) => {
    setFormData({
      name: item.name,
      batchNumber: item.batchNumber === '-' ? '' : item.batchNumber,
      quantity: String(item.quantity),
      reorderLevel: String(item.reorderLevel),
      unit: item.unit,
      supplier: item.supplier === '-' ? '' : item.supplier,
      expiryDate: item.expiryDate || '',
      unitCost: String(item.unitCost || 0)
    });
    setEditingId(item.id);
    setShowForm(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleModalConfirm = () => {
    if (modalConfig.onConfirm) modalConfig.onConfirm();
  };

  const getStatusBadge = (status) => {
    return <StatusBadge status={status} />;
  };

  const totalValue = filteredInventory.reduce((sum, item) => sum + (item.quantity * (parseFloat(item.unitCost) || 0)), 0);
  const lowStockCount = filteredInventory.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock').length;
  const inStockCount = filteredInventory.filter(item => item.status === 'in-stock').length;

  const formatDate = (date) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  return (
    <div className="inventory min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Inventory Management 
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Manage pharmaceutical stock and inventory
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => {
                dispatch(fetchDrugs());
                setSuccessMessage('Inventory refreshed.');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
              tooltip="Refresh inventory"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setShowForm(!showForm);
                if (editingId) setEditingId(null);
                setFormData({
                  name: '',
                  batchNumber: '',
                  quantity: '',
                  reorderLevel: '',
                  unit: 'tablet',
                  supplier: '',
                  expiryDate: '',
                  unitCost: ''
                });
                setErrorMessage('');
                setSuccessMessage('');
              }}
              tooltip={showForm ? 'Close form' : 'Add new inventory item'}
              variant="primary"
              size="sm"
            >
              {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {showForm ? 'Close' : 'Add Item'}
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Total Items"
          value={drugs.length}
          icon={Box}
          color="green"
          tooltip="Total number of inventory items"
        />
        <StatsCard
          title="In Stock"
          value={inStockCount}
          subValue={`${drugs.length > 0 ? Math.round((inStockCount / drugs.length) * 100) : 0}% of total`}
          icon={Package}
          color="blue"
          tooltip="Items currently in stock"
        />
        <StatsCard
          title="Low Stock"
          value={lowStockCount}
          subValue="Requires attention"
          icon={AlertCircle}
          color="warm"
          tooltip="Items below reorder level"
          trend={lowStockCount > 0 ? 'down' : 'up'}
          trendValue={lowStockCount > 0 ? `${lowStockCount} items need restocking` : 'All items well stocked'}
        />
        <StatsCard
          title="Total Value"
          value={totalValue}
          subValue={`₦${totalValue.toLocaleString()} total`}
          icon={DollarSign}
          color="gold"
          tooltip="Total value of all inventory"
        />
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

      {/* Controls */}
      <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B0A89E]" />
            <input
              type="text"
              placeholder="Search inventory by name, batch, or supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
            <ButtonWithTooltip
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              tooltip="Clear filters"
              variant="secondary"
              size="sm"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-[#E8E3DC] p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">
              {editingId ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h3>
            <ButtonWithTooltip
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({
                  name: '',
                  batchNumber: '',
                  quantity: '',
                  reorderLevel: '',
                  unit: 'tablet',
                  supplier: '',
                  expiryDate: '',
                  unitCost: ''
                });
                setErrorMessage('');
                setSuccessMessage('');
              }}
              tooltip="Close form"
              variant="secondary"
              size="sm"
            >
              <X className="w-3.5 h-3.5" />
            </ButtonWithTooltip>
          </div>

          <form onSubmit={handleAddInventory} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Drug Name <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Paracetamol"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Batch Number
              </label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                placeholder="BTH-2025-001"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Current Quantity <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Reorder Level <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                placeholder="100"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              >
                <option value="tablet">Tablets</option>
                <option value="capsule">Capsules</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
                <option value="ointment">Ointment</option>
                <option value="cream">Cream</option>
                <option value="drops">Drops</option>
                <option value="inhaler">Inhaler</option>
                <option value="suppository">Suppository</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Unit Cost (₦)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Supplier
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Supplier name"
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
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
              <ButtonWithTooltip
                type="submit"
                tooltip={editingId ? 'Update inventory item' : 'Add inventory item'}
                variant="primary"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    {editingId ? 'Update Item' : 'Add Item'}
                  </>
                )}
              </ButtonWithTooltip>
              <ButtonWithTooltip
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    name: '',
                    batchNumber: '',
                    quantity: '',
                    reorderLevel: '',
                    unit: 'tablet',
                    supplier: '',
                    expiryDate: '',
                    unitCost: ''
                  });
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                tooltip="Cancel"
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </ButtonWithTooltip>
            </div>
          </form>
        </div>
      )}

      {/* Inventory List */}
      <div className="bg-white border border-[#E8E3DC]">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-[#008751] animate-spin mx-auto mb-3" />
            <p className="text-[#5A5A5A] text-sm">Loading inventory...</p>
          </div>
        ) : filteredInventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E3DC]">
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Drug Name</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Batch</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Qty</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Reorder</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Supplier</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden xl:table-cell">Expiry</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {filteredInventory.map((item, index) => (
                  <tr key={item.id} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm text-[#1A1A1A]">{item.name}</p>
                        <p className="text-[10px] text-[#B0A89E] sm:hidden">
                          Batch: {item.batchNumber}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5A5A5A] hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Barcode className="w-3.5 h-3.5 text-[#B0A89E]" />
                        {item.batchNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#1A1A1A] font-medium">
                      {item.quantity} <span className="text-[10px] text-[#5A5A5A] font-normal">{item.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5A5A5A] hidden md:table-cell">{item.reorderLevel}</td>
                    <td className="px-4 py-3 text-sm text-[#5A5A5A] hidden lg:table-cell">{item.supplier}</td>
                    <td className="px-4 py-3 text-sm text-[#5A5A5A] hidden xl:table-cell">{formatDate(item.expiryDate)}</td>
                    <td className="px-4 py-3">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <IconButton
                          icon={Edit2}
                          onClick={() => handleEditInventory(item)}
                          tooltip="Edit item"
                          variant="warning"
                          size="sm"
                        />
                        <IconButton
                          icon={Trash2}
                          onClick={() => handleDeleteClick(item)}
                          tooltip="Delete item"
                          variant="danger"
                          size="sm"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-[#D8D4CD] mx-auto mb-3" />
            <p className="text-[#5A5A5A] font-medium">No inventory items found</p>
            <p className="text-sm text-[#B0A89E] mt-1">
              {searchTerm ? 'Try adjusting your search or filters' : 'Click "Add Item" to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.type === 'delete' ? 'Delete' : 'OK'}
      />
    </div>
  );
};

export default Inventory;