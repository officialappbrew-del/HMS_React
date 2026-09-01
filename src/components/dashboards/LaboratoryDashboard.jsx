import { useEffect, useMemo, useState } from 'react';
import { apiRequest, parseListResponse } from '../../utils/api';
import { Activity, AlertTriangle, Beaker, Bell, CheckCircle2, ClipboardList,
  Clock3, Download, FileCheck2, FlaskConical, ArrowDown,
  Gauge, HeartPulse, Loader2, PackageSearch, ArrowUp,
  Play, Plus, RefreshCw, Search, ShieldCheck, FileText,
  Truck, Wrench, XCircle, DollarSign, PieChart,
  ChevronLeft, ChevronRight, Eye, Clock, Check,inventoryItems,
  LineChart, X, Award, ListChecks } from 'lucide-react';

const displayName = (item) => item.patient_name || item.patient?.name || item.patient || 'Unknown patient';

// ==================== TOOLTIP COMPONENT ====================
const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);
  const [touchShow, setTouchShow] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  const handleTouchStart = () => {
    setTouchShow(true);
    setTimeout(() => setTouchShow(false), 3000);
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={handleTouchStart}
      onClick={(e) => {
        if (window.innerWidth < 768) {
          e.stopPropagation();
          setTouchShow(!touchShow);
          setTimeout(() => setTouchShow(false), 3000);
        }
      }}
    >
      {children}
      {(show || touchShow) && (
        <div className={`absolute z-50 ${positionClasses[position]} whitespace-nowrap pointer-events-none`}>
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
    sm: 'p-1 min-h-[28px] min-w-[28px]',
    md: 'p-1.5 min-h-[32px] min-w-[32px]',
    lg: 'p-2 min-h-[36px] min-w-[36px]',
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
    sm: 'px-2.5 py-1.5 text-xs min-h-[32px]',
    md: 'px-3.5 py-2 text-sm min-h-[36px]',
    lg: 'px-5 py-2.5 text-sm min-h-[40px]',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`max-w-full rounded transition-all duration-200 flex min-w-0 items-center justify-center gap-1.5 font-medium whitespace-normal text-center ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
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
    purple: 'bg-[#6B4C9A]',
    blue: 'bg-[#2C6B8A]',
  };

  return (
    <Tooltip text={tooltip}>
      <div
        onClick={onClick}
        className={`w-full min-w-0 overflow-hidden bg-white border border-[#E8E3DC] p-3 sm:p-4 lg:p-5 ${onClick ? 'cursor-pointer hover:border-[#008751] transition-colors' : ''} ${className}`}
      >
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] sm:text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
            <p className="mt-1 text-lg sm:text-xl lg:text-2xl xl:text-3xl font-display font-bold text-[#1A1A1A] tracking-tight truncate">{value}</p>
            {subValue && (
              <p className="text-[10px] sm:text-xs text-[#5A5A5A] mt-0.5 truncate">{subValue}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-1 text-xs ${trendColors[trend]} font-medium`}>
                {trend === 'up' && <ArrowUp className="w-3 h-3 mr-0.5 flex-shrink-0" />}
                {trend === 'down' && <ArrowDown className="w-3 h-3 mr-0.5 flex-shrink-0" />}
                <span className="truncate">{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${colorMap[color]} rounded flex items-center justify-center flex-shrink-0 self-start sm:ml-3`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

// ==================== EMPTY STATE ====================
const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-8 sm:py-12">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#F7F5F2] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#D8D4CD]" />
      </div>
      <h3 className="text-sm font-medium text-[#1A1A1A]">{title}</h3>
      <p className="text-sm text-[#5A5A5A] mt-1">{description}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}; // <-- FIXED: Added missing closing bracket

// ==================== STATUS BADGE ====================
const StatusBadge = ({ status }) => {
  const statusStyles = {
    ordered: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]',
    collected: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]',
    in_progress: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]',
    completed: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
    cancelled: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
    verified: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
    rejected: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
  };

  const labels = {
    ordered: 'Ordered',
    collected: 'Collected',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    verified: 'Verified',
    rejected: 'Rejected',
  };

  return (
    <span className={`inline-flex px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-xs font-medium border ${statusStyles[status] || statusStyles.ordered}`}>
      {labels[status] || status}
    </span>
  );
};

// ==================== PRIORITY BADGE ====================
const PriorityBadge = ({ priority }) => {
  const priorityStyles = {
    stat: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
    priority: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]',
    routine: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
  };

  return (
    <span className={`inline-flex px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-xs font-medium uppercase border ${priorityStyles[priority] || priorityStyles.routine}`}>
      {priority || 'routine'}
    </span>
  );
};

// ==================== PAGINATION ====================
const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, onItemsPerPageChange }) => {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= halfVisible + 1) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - halfVisible) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - halfVisible; i <= currentPage + halfVisible; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-[#E8E3DC]">
      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A5A5A]">
        <span>Showing</span>
        <select
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
          className="border border-[#D8D4CD] rounded px-2 py-1 text-xs bg-white focus:border-[#008751] focus:outline-none"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>per page</span>
        <span className="hidden sm:inline text-[#B0A89E]">({totalItems} total)</span>
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        <IconButton
          icon={ChevronLeft}
          onClick={() => onPageChange(currentPage - 1)}
          tooltip="Previous"
          variant="default"
          disabled={currentPage === 1}
          size="sm"
        />
        {generatePages().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-[#5A5A5A]">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-2 sm:px-3 py-1 rounded text-xs font-medium transition-colors min-h-[28px] min-w-[28px] ${
                currentPage === page
                  ? 'bg-[#008751] text-white'
                  : 'text-[#5A5A5A] hover:bg-[#F0EDE8]'
              }`}
            >
              {page}
            </button>
          )
        ))}
        <IconButton
          icon={ChevronRight}
          onClick={() => onPageChange(currentPage + 1)}
          tooltip="Next"
          variant="default"
          disabled={currentPage === totalPages}
          size="sm"
        />
      </div>
    </div>
  );
};

// ==================== RESULT MODAL ====================
const ResultModal = ({ isOpen, onClose, order, value, setValue, notes, setNotes, onSubmit }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1A1A1A] bg-opacity-60 p-0 sm:p-4">
      <div className="bg-white w-full sm:w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-t-lg sm:rounded-lg">
        <div className="border-b border-[#E8E3DC] px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-display font-semibold text-[#1A1A1A]">Enter Result</h3>
            <p className="text-xs sm:text-sm text-[#5A5A5A] truncate">{displayName(order)} · {order.test_name || 'Laboratory test'}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#F0EDE8] rounded transition-colors flex-shrink-0 ml-2">
            <X className="w-5 h-5 text-[#5A5A5A]" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Result Value *</label>
            <input
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
              placeholder="Enter value and units"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Result Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
              placeholder="Interpretation, instrument notes, or comments"
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              type="button"
              onClick={onClose}
              tooltip="Cancel"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Cancel
            </ButtonWithTooltip>
            <ButtonWithTooltip
              type="submit"
              tooltip="Save result"
              variant="primary"
              className="w-full sm:w-auto"
            >
              <Check className="w-4 h-4" />
              Save Result
            </ButtonWithTooltip>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== MAIN LABORATORY DASHBOARD ====================
const LaboratoryDashboard = () => {
  // ==================== STATE ====================
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_samples: 0,
    collected_samples: 0,
    in_progress: 0,
    completed_tests: 0,
  });
  const [orders, setOrders] = useState([]);
  const [workInProgress, setWorkInProgress] = useState([]);
  const [criticalResults, setCriticalResults] = useState([]);
  const [unverifiedResults, setUnverifiedResults] = useState([]);
  const [tests, setTests] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [createOrderSubmitting, setCreateOrderSubmitting] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  const [processingAction, setProcessingAction] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [resultValue, setResultValue] = useState('');
  const [resultNotes, setResultNotes] = useState('');
  const [newOrder, setNewOrder] = useState({ patient: '', test: '', priority: 'routine', clinical_notes: '' });
  const [patientSearch, setPatientSearch] = useState('');
  const [patientSuggestions, setPatientSuggestions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearchLoading, setPatientSearchLoading] = useState(false);

  // Enhanced state for additional features
  const qualityControlData = {
    in_control: null,
    total_materials: 0,
    expiring_soon: 0,
    pass_rate: 0,
    mean: null,
    sd: null,
    cv: null,
    n: 0,
    materials: [],
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [showEnterResultModal, setShowEnterResultModal] = useState(false);
  const [returnToCreateOrder, setReturnToCreateOrder] = useState(false);
  const [createOrderFormData, setCreateOrderFormData] = useState({ patient: '', test: '', priority: 'routine', clinical_notes: '' });
  const [createOrderPatientSearch, setCreateOrderPatientSearch] = useState('');
  const [createOrderPatientSuggestions, setCreateOrderPatientSuggestions] = useState([]);
  const [createOrderSelectedPatient, setCreateOrderSelectedPatient] = useState(null);
  const [createOrderPatientSearchLoading, setCreateOrderPatientSearchLoading] = useState(false);
  const [enterResultFormData, setEnterResultFormData] = useState({ order: '', value: '', result_notes: '' });
  const [sampleOrdersForResult, setSampleOrdersForResult] = useState([]);
  const [enterResultSubmitting, setEnterResultSubmitting] = useState(false);
  const [enterResultLoading, setEnterResultLoading] = useState(false);
  const [showCreateTestModal, setShowCreateTestModal] = useState(false);
  const [createTestFormData, setCreateTestFormData] = useState({
    name: '',
    code: '',
    category: 'other',
    sample_type: 'Blood',
    turnaround_time: 24,
    price: 0,
    reference_range: '',
    units: '',
  });
  const [editingTest, setEditingTest] = useState(null);
  const [editTestFormData, setEditTestFormData] = useState({
    name: '',
    code: '',
    category: 'other',
    sample_type: 'Blood',
    turnaround_time: 24,
    price: 0,
    reference_range: '',
    units: '',
  });
  const [editTestSubmitting, setEditTestSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // ==================== LOADING FUNCTIONS ====================
  const loadDashboard = async (quiet = false) => {
    if (quiet) setRefreshing(true); else setLoading(true);
    setError('');

    try {
      const requests = await Promise.allSettled([
        apiRequest('/api/v1/lab/orders/stats/'),
        apiRequest('/api/v1/lab/orders/?ordering=-ordered_date&page_size=100'),
        apiRequest('/api/v1/lab/orders/work_in_progress/'),
        apiRequest('/api/v1/lab/orders/critical_results/'),
      ]);

      const [statsResult, ordersResult, progressResult, criticalResult] = requests;

      if (statsResult.status === 'fulfilled') setStats((currentStats) => ({ ...currentStats, ...statsResult.value }));
      if (ordersResult.status === 'fulfilled') setOrders(parseListResponse(ordersResult.value));
      if (progressResult.status === 'fulfilled') setWorkInProgress(parseListResponse(progressResult.value));
      if (criticalResult.status === 'fulfilled') setCriticalResults(parseListResponse(criticalResult.value));
      if (quiet) await loadTabData(activeTab, true);

      if (requests.every((req) => req.status === 'rejected')) {
        setError('Laboratory data could not be loaded. Check your connection and permissions.');
      }
    } catch (err) {
      setError('Failed to load laboratory dashboard.');
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadActiveQueue = async () => {
    try {
      setRefreshing(true);
      const data = await apiRequest('/api/v1/lab/orders/work_in_progress/');
      setWorkInProgress(parseListResponse(data));
    } catch (err) {
      setError(err.message || 'Unable to refresh the active laboratory queue.');
    } finally {
      setRefreshing(false);
    }
  };

  const loadTabData = async (tab, force = false) => {
    try {
      if ((tab === 'samples' || tab === 'tests') && (force || tests.length === 0)) {
        const testsPath = `/api/v1/lab/tests/?page_size=100${force ? `&refresh=${Date.now()}` : ''}`;
        const data = await apiRequest(testsPath, { cacheTtl: force ? 0 : 300000 });
        setTests(parseListResponse(data));
      }

      if (tab === 'results' && (force || unverifiedResults.length === 0)) {
        const data = await apiRequest('/api/v1/lab/results/?verified=false&page_size=100');
        setUnverifiedResults(parseListResponse(data));
      }

      if (tab === 'qc' && (force || maintenance.length === 0)) {
        const maintenancePath = `/api/v1/lab/instrument-maintenance/pending_maintenance/${force ? `?refresh=${Date.now()}` : ''}`;
        const data = await apiRequest(maintenancePath, { cacheTtl: force ? 0 : 60000 });
        setMaintenance(parseListResponse(data));
      }
    } catch (err) {
      setError(err.message || `Unable to load ${tab} data.`);
    }
  };

  // Load in-progress samples for result entry
  useEffect(() => {
    if (showEnterResultModal) {
      setSampleOrdersForResult(workInProgress.filter(o => o.status === 'in_progress'));
    }
  }, [showEnterResultModal, workInProgress]);

  const openEnterResultModal = async () => {
    setActionError('');
    setEnterResultLoading(true);
    setShowEnterResultModal(true);
    try {
      const data = await apiRequest('/api/v1/lab/orders/work_in_progress/?refresh=' + Date.now(), { cacheTtl: 0 });
      const currentSamples = parseListResponse(data).filter((order) => order.status === 'in_progress');
      setWorkInProgress((ordersInProgress) => {
        const activeOrders = ordersInProgress.filter((order) => order.status !== 'in_progress');
        return [...activeOrders, ...currentSamples];
      });
      setSampleOrdersForResult(currentSamples);
    } catch (err) {
      setActionError(err.message || 'Unable to load samples in progress.');
    } finally {
      setEnterResultLoading(false);
    }
  };

  // Search for patients when creating order
  useEffect(() => {
    const query = createOrderPatientSearch.trim();
    if (!query || createOrderSelectedPatient?.mrn === query) {
      setCreateOrderPatientSuggestions([]);
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      setCreateOrderPatientSearchLoading(true);
      try {
        const data = await apiRequest(`/api/v1/patients/patients/?search=${encodeURIComponent(query)}&status=all&page_size=8`);
        setCreateOrderPatientSuggestions(parseListResponse(data));
      } catch {
        setCreateOrderPatientSuggestions([]);
      } finally {
        setCreateOrderPatientSearchLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [createOrderPatientSearch, createOrderSelectedPatient]);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') loadActiveQueue();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const query = patientSearch.trim();
    if (!query || selectedPatient?.mrn === query) {
      setPatientSuggestions([]);
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      setPatientSearchLoading(true);
      try {
        const data = await apiRequest(`/api/v1/patients/patients/?search=${encodeURIComponent(query)}&status=all&page_size=8`);
        setPatientSuggestions(parseListResponse(data));
      } catch {
        setPatientSuggestions([]);
      } finally {
        setPatientSearchLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [patientSearch, selectedPatient]);

  // ==================== FILTERED ORDERS ====================
  const filteredOrders = useMemo(() => orders.filter((order) => {
    const haystack = `${displayName(order)} ${order.order_number || ''} ${order.sample_accession_number || ''} ${order.test_name || ''}`.toLowerCase();
    return (!search || haystack.includes(search.toLowerCase())) &&
      (statusFilter === 'all' || order.status === statusFilter) &&
      (priorityFilter === 'all' || order.priority === priorityFilter);
  }), [orders, search, statusFilter, priorityFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // ==================== ACTION FUNCTIONS ====================
  const runOrderAction = async (order, action) => {
    setActionError('');
    setProcessingOrderId(order.id);
    setProcessingAction(action);
    try {
      await apiRequest(`/api/v1/lab/orders/${order.id}/${action}/`, { method: 'POST', body: JSON.stringify({}) });
      await loadDashboard(true);
    } catch (err) {
      setActionError(err.message || `Unable to ${action.replace('_', ' ')} this specimen.`);
    } finally {
      setProcessingOrderId(null);
      setProcessingAction('');
    }
  };

  const submitOrder = async (event) => {
    event.preventDefault();
    if (!selectedPatient?.id) {
      setActionError('Select a patient from the MRN search results before creating the order.');
      return;
    }
    setActionError('');
    try {
      await apiRequest('/api/v1/lab/orders/', {
        method: 'POST',
        body: JSON.stringify({
          ...newOrder,
          patient: selectedPatient.id,
          test: Number(newOrder.test)
        })
      });
      setNewOrder({ patient: '', test: '', priority: 'routine', clinical_notes: '' });
      setPatientSearch('');
      setSelectedPatient(null);
      setPatientSuggestions([]);
      await loadDashboard(true);
      setActiveTab('samples');
    } catch (err) {
      setActionError(err.message || 'Unable to create the laboratory order.');
    }
  };

  const submitResult = async (event) => {
    event.preventDefault();
    if (!selectedOrder || !resultValue.trim()) return;
    setActionError('');
    try {
      await apiRequest('/api/v1/lab/results/', {
        method: 'POST',
        body: JSON.stringify({
          order: selectedOrder.id,
          value: resultValue,
          result_notes: resultNotes
        }),
      });
      setSelectedOrder(null);
      setResultValue('');
      setResultNotes('');
      setShowResultModal(false);
      await loadDashboard(true);
    } catch (err) {
      setActionError(err.message || 'Unable to save the result.');
    }
  };

  const submitCreateOrder = async (event) => {
    event.preventDefault();
    if (!createOrderSelectedPatient?.id) {
      setActionError('Select a patient from the search results before creating the order.');
      return;
    }
    setActionError('');
    setCreateOrderSubmitting(true);
    try {
      await apiRequest('/api/v1/lab/orders/', {
        method: 'POST',
        body: JSON.stringify({
          ...createOrderFormData,
          patient: createOrderSelectedPatient.id,
          test: Number(createOrderFormData.test)
        })
      });
      setCreateOrderFormData({ patient: '', test: '', priority: 'routine', clinical_notes: '' });
      setCreateOrderPatientSearch('');
      setCreateOrderSelectedPatient(null);
      setCreateOrderPatientSuggestions([]);
      setShowCreateOrderModal(false);
      await loadDashboard(true);
    } catch (err) {
      setActionError(err.message || 'Unable to create the laboratory order.');
    } finally {
      setCreateOrderSubmitting(false);
    }
  };

  const submitEnterResult = async (event) => {
    event.preventDefault();
    if (!enterResultFormData.order || !enterResultFormData.value.trim()) {
      setActionError('Select a sample and enter a result value.');
      return;
    }
    setActionError('');
    setEnterResultSubmitting(true);
    try {
      await apiRequest('/api/v1/lab/results/', {
        method: 'POST',
        body: JSON.stringify({
          order: Number(enterResultFormData.order),
          value: enterResultFormData.value,
          result_notes: enterResultFormData.result_notes
        }),
      });
      setEnterResultFormData({ order: '', value: '', result_notes: '' });
      setShowEnterResultModal(false);
      await loadDashboard(true);
    } catch (err) {
      setActionError(err.message || 'Unable to enter the result.');
    } finally {
      setEnterResultSubmitting(false);
    }
  };

  const submitCreateTest = async (event) => {
    event.preventDefault();
    if (!createTestFormData.name.trim()) {
      setActionError('Test name is required.');
      return;
    }

    const normalizedCode = (createTestFormData.code || '').trim() || `LAB-${Date.now().toString().slice(-6)}`;
    const normalizedPayload = {
      ...createTestFormData,
      code: normalizedCode,
      sample_type: (createTestFormData.sample_type || 'Blood').trim() || 'Blood',
      turnaround_time: Number(createTestFormData.turnaround_time || 24),
      price: Number(createTestFormData.price || 0),
      reference_range: createTestFormData.reference_range || '',
      units: createTestFormData.units || '',
    };

    setActionError('');
    try {
      const createdTest = await apiRequest('/api/v1/lab/tests/', {
        method: 'POST',
        body: JSON.stringify(normalizedPayload)
      });
      setCreateTestFormData({ name: '', code: '', category: 'other', sample_type: 'Blood', turnaround_time: 24, price: 0, reference_range: '', units: '' });
      setShowCreateTestModal(false);
      await loadTabData('tests', true);
      setTests((currentTests) => {
        const refreshedTest = parseListResponse(createdTest)[0] || createdTest;
        if (!refreshedTest?.id || currentTests.some((test) => test.id === refreshedTest.id)) return currentTests;
        return [...currentTests, refreshedTest].sort((first, second) => first.name.localeCompare(second.name));
      });
      const createdTestData = parseListResponse(createdTest)[0] || createdTest;
      if (returnToCreateOrder && createdTestData?.id) {
        setCreateOrderFormData((currentFormData) => ({ ...currentFormData, test: createdTestData.id }));
        setReturnToCreateOrder(false);
        setShowCreateOrderModal(true);
      } else {
        setActiveTab('tests');
      }
    } catch (err) {
      setActionError(err.message || 'Unable to create the test.');
    }
  };

  const submitEditTest = async (event) => {
    event.preventDefault();
    if (!editingTest?.id || !editTestFormData.name.trim()) {
      setActionError('Test name is required.');
      return;
    }
    setActionError('');
    setEditTestSubmitting(true);
    try {
      const normalizedPayload = {
        ...editTestFormData,
        turnaround_time: Number(editTestFormData.turnaround_time || 24),
        price: Number(editTestFormData.price || 0),
      };
      const updatedTest = await apiRequest(`/api/v1/lab/tests/${editingTest.id}/`, {
        method: 'PATCH',
        body: JSON.stringify(normalizedPayload)
      });
      setEditingTest(null);
      setEditTestFormData({ name: '', code: '', category: 'other', sample_type: 'Blood', turnaround_time: 24, price: 0, reference_range: '', units: '' });
      await loadTabData('tests', true);
      setTests((currentTests) => {
        const refreshed = parseListResponse(updatedTest)[0] || updatedTest;
        if (!refreshed?.id) return currentTests;
        return currentTests.map((test) => test.id === refreshed.id ? refreshed : test);
      });
    } catch (err) {
      setActionError(err.message || 'Unable to update the test.');
    } finally {
      setEditTestSubmitting(false);
    }
  };

  const confirmDeleteTest = async () => {
    if (!deleteConfirmId) return;
    setActionError('');
    setDeleteSubmitting(true);
    try {
      await apiRequest(`/api/v1/lab/tests/${deleteConfirmId}/`, { method: 'DELETE' });
      setDeleteConfirmId(null);
      await loadTabData('tests', true);
      setTests((currentTests) => currentTests.filter((test) => test.id !== deleteConfirmId));
    } catch (err) {
      setActionError(err.message || 'Unable to delete the test.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const verifyResult = async (result) => {
    setActionError('');
    try {
      await apiRequest(`/api/v1/lab/results/${result.id}/verify/`, { method: 'POST', body: JSON.stringify({}) });
      await loadDashboard(true);
    } catch (err) {
      setActionError(err.message || 'Unable to verify the result.');
    }
  };

  const completeMaintenance = async (item) => {
    setActionError('');
    try {
      await apiRequest(`/api/v1/lab/instrument-maintenance/${item.id}/complete/`, { method: 'POST', body: JSON.stringify({}) });
      await loadDashboard(true);
    } catch (err) {
      setActionError(err.message || 'Unable to complete maintenance.');
    }
  };

  const exportReport = (reportId) => {
    const headers = ['Order number', 'Patient', 'Test', 'Priority', 'Status', 'Ordered date', 'Accession'];
    const rows = orders.map((order) => [
      order.order_number || order.id,
      displayName(order),
      order.test_name || '',
      order.priority || '',
      order.status || '',
      order.ordered_date || '',
      order.sample_accession_number || '',
    ]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `laboratory-${reportId}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // ==================== KPIS ====================
  const kpis = [
    {
      label: 'Samples Today',
      value: stats.total_orders,
      icon: FlaskConical,
      color: 'green',
      subValue: 'Total orders today'
    },
    {
      label: 'Awaiting Collection',
      value: stats.pending_samples,
      icon: Truck,
      color: 'gold',
      subValue: 'Ready for phlebotomy'
    },
    {
      label: 'In Analysis',
      value: stats.in_progress,
      icon: Gauge,
      color: 'blue',
      subValue: 'Currently processing'
    },
    {
      label: 'Completed Today',
      value: stats.completed_tests,
      icon: CheckCircle2,
      color: 'green',
      subValue: 'Results available'
    },
    {
      label: 'Critical Results',
      value: criticalResults.length,
      icon: AlertTriangle,
      color: 'terracotta',
      subValue: 'Requires immediate review'
    },
  ];

  // ==================== TABS ====================
  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'samples', label: 'Samples', icon: FlaskConical },
    { id: 'results', label: 'Results', icon: FileCheck2 },
    { id: 'qc', label: 'Quality Control', icon: ShieldCheck },
    { id: 'inventory', label: 'Inventory', icon: PackageSearch },
    { id: 'tests', label: 'Test Catalog', icon: Beaker },
    { id: 'reports', label: 'Reports', icon: Download },
  ];

  // ==================== RENDER FUNCTIONS (INSIDE COMPONENT) ====================
  const renderOverview = () => (
    <div className="space-y-4 lg:space-y-6">
      {/* KPIs */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {kpis.map((kpi, index) => (
          <StatsCard
            key={index}
            title={kpi.label}
            value={kpi.value}
            subValue={kpi.subValue}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Specimen Pipeline & Critical Results */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2">
        <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC] p-3 sm:p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h3 className="min-w-0 flex-1 text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#008751] flex-shrink-0" />
              Specimen Pipeline
            </h3>
            <ButtonWithTooltip
              onClick={() => setActiveTab('samples')}
              tooltip="View all specimens"
              variant="secondary"
              size="sm"
            >
              View All
            </ButtonWithTooltip>
          </div>
          {workInProgress.length === 0 ? (
            <EmptyState
              icon={FlaskConical}
              title="No active specimens"
              description="All specimens have been processed."
            />
          ) : (
            <div className="space-y-3">
              {workInProgress.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 border-b border-[#F0EDE8] pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[#1A1A1A]">{displayName(item)}</div>
                    <div className="truncate text-xs text-[#5A5A5A]">
                      {item.accession || item.order_number || 'Awaiting accession'} · {item.test_name || item.tests?.join(', ')}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <PriorityBadge priority={item.priority} />
                    <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-[#5A5A5A]">
                      <Clock3 className="w-3 h-3" />
                      {item.tat || 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC] p-3 sm:p-4 lg:p-5">
          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <h3 className="min-w-0 flex-1 text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#C8553D] flex-shrink-0" />
              Critical Results
            </h3>
            <ButtonWithTooltip
              onClick={() => setActiveTab('results')}
              tooltip="Review all critical results"
              variant="danger"
              size="sm"
            >
              Review All
            </ButtonWithTooltip>
          </div>
          {criticalResults.length === 0 ? (
            <EmptyState
              icon={AlertTriangle}
              title="No critical results"
              description="All results are within normal range."
            />
          ) : (
            <div className="space-y-3">
              {criticalResults.slice(0, 5).map((result) => (
                <div key={result.id} className="bg-[#F5EDEA] border border-[#E8D6D0] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[#1A1A1A] truncate">{result.patient_name || result.patientName}</div>
                      <div className="text-xs text-[#5A5A5A] truncate">
                        {result.test_name || result.testName}: <strong className="text-[#C8553D]">{result.value}</strong>
                      </div>
                    </div>
                    <AlertTriangle className="w-4 h-4 text-[#C8553D] flex-shrink-0" />
                  </div>
                  <div className="mt-2 text-[11px] text-[#5A5A5A] truncate">
                    Reference: {result.reference_range || 'Not provided'} · {result.status || 'awaiting'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC] p-3 sm:p-4 lg:p-5 hover:border-[#008751] transition-colors cursor-pointer" onClick={() => setActiveTab('qc')}>
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Quality Control</p>
              <p className="mt-1 text-base sm:text-lg font-display font-bold text-[#2D7D46]">Operational</p>
            </div>
            <ShieldCheck className="w-5 h-5 text-[#5A5A5A] flex-shrink-0" />
          </div>
          <p className="mt-2 text-xs text-[#5A5A5A]">Track verification, audit trails, and result release</p>
        </div>

        <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC] p-3 sm:p-4 lg:p-5 hover:border-[#008751] transition-colors cursor-pointer" onClick={() => setActiveTab('inventory')}>
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Inventory Status</p>
              <p className="mt-1 text-base sm:text-lg font-display font-bold text-[#C87D3D]">
                {inventoryItems.filter(i => i.stock < i.reorder_level).length} low stock
              </p>
            </div>
            <PackageSearch className="w-5 h-5 text-[#5A5A5A] flex-shrink-0" />
          </div>
          <p className="mt-2 text-xs text-[#5A5A5A]">Monitor inventory levels and reorder alerts</p>
        </div>

        <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC] p-3 sm:p-4 lg:p-5 hover:border-[#008751] transition-colors cursor-pointer" onClick={() => setActiveTab('reports')}>
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Reports</p>
              <p className="mt-1 text-base sm:text-lg font-display font-bold text-[#008751]">Ready</p>
            </div>
            <Download className="w-5 h-5 text-[#5A5A5A] flex-shrink-0" />
          </div>
          <p className="mt-2 text-xs text-[#5A5A5A]">Generate operational and compliance reports</p>
        </div>
      </div>
    </div>
  );

  const renderSamples = () => (
    <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-3">
      {/* Sample List */}
      <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC] xl:col-span-2">
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-[#E8E3DC] bg-[#F7F5F2]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="min-w-0 flex-1 text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#008751] flex-shrink-0" />
              Sample Queue
              <span className="text-xs font-normal text-[#5A5A5A]">({filteredOrders.length})</span>
            </h3>
            <ButtonWithTooltip
              onClick={() => {
                setActionError('');
                loadTabData('samples');
                setShowCreateOrderModal(true);
              }}
              tooltip="Create a new test order"
              variant="primary"
              size="sm"
              className="flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              New Order
            </ButtonWithTooltip>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[120px] sm:min-w-[140px]">
                <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-[#5A5A5A]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search samples..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1.5 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white flex-1 sm:flex-none"
              >
                <option value="all">All Status</option>
                <option value="ordered">Ordered</option>
                <option value="collected">Collected</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2 py-1.5 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white flex-1 sm:flex-none"
              >
                <option value="all">All Priority</option>
                <option value="stat">STAT</option>
                <option value="priority">Priority</option>
                <option value="routine">Routine</option>
              </select>
            </div>
          </div>
        </div>

        {/* Responsive Table - Cards on mobile, Table on desktop */}
        <div className="block md:hidden">
          {paginatedOrders.length === 0 ? (
            <div className="py-8 text-center text-[#5A5A5A]">
              <EmptyState
                icon={FlaskConical}
                title="No samples found"
                description="No samples match the current filters."
              />
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {paginatedOrders.map((order) => (
                <div key={order.id} className="border border-[#E8E3DC] p-3 hover:bg-[#F7F5F2] transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#1A1A1A] truncate">{displayName(order)}</div>
                      <div className="text-xs text-[#5A5A5A] truncate">{order.sample_accession_number || order.order_number || `Order ${order.id}`}</div>
                      <div className="text-sm text-[#1A1A1A] mt-1 truncate">{order.test_name || 'Laboratory test'}</div>
                    </div>
                    <PriorityBadge priority={order.priority} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                    <StatusBadge status={order.status} />
                    <div className="flex max-w-full flex-wrap justify-end gap-1">
                      {order.status === 'ordered' && (
                        <button
                          onClick={() => runOrderAction(order, 'collect_sample')}
                          className="px-2 py-1 text-xs bg-[#008751] text-white rounded hover:bg-[#006B40] transition-colors"
                        >
                          Collect
                        </button>
                      )}
                      {order.status === 'collected' && (
                        <button
                          onClick={() => runOrderAction(order, 'start_analysis')}
                          className="px-2 py-1 text-xs bg-[#008751] text-white rounded hover:bg-[#006B40] transition-colors"
                        >
                          Start
                        </button>
                      )}
                      {order.status === 'in_progress' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowResultModal(true);
                            }}
                            className="px-2 py-1 text-xs bg-[#008751] text-white rounded hover:bg-[#006B40] transition-colors"
                          >
                            Result
                          </button>
                          <button
                            onClick={() => runOrderAction(order, 'complete')}
                            className="px-2 py-1 text-xs bg-[#2D7D46] text-white rounded hover:bg-[#1E5F33] transition-colors"
                          >
                            Complete
                          </button>
                        </>
                      )}
                      <button className="p-1 hover:bg-[#F0EDE8] rounded transition-colors">
                        <Eye className="w-4 h-4 text-[#5A5A5A]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-[#E8E3DC] bg-[#FAFAFA]">
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patient / Accession</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Test</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Priority</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-right text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8]">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[#5A5A5A]">
                    <EmptyState
                      icon={FlaskConical}
                      title="No samples found"
                      description="No samples match the current filters."
                    />
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#1A1A1A] truncate max-w-[120px]">{displayName(order)}</div>
                      <div className="text-xs text-[#5A5A5A] truncate max-w-[120px]">{order.sample_accession_number || order.order_number || `Order ${order.id}`}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[#1A1A1A] truncate max-w-[140px]">{order.test_name || 'Laboratory test'}</div>
                      {order.clinical_notes && (
                        <div className="text-xs text-[#5A5A5A] truncate max-w-[140px]">{order.clinical_notes}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={order.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1 flex-wrap">
                        {order.status === 'ordered' && (
                          <ButtonWithTooltip
                            onClick={() => runOrderAction(order, 'collect_sample')}
                            tooltip="Collect sample"
                            variant="primary"
                            size="sm"
                            disabled={processingOrderId === order.id}
                          >
                            {processingOrderId === order.id && processingAction === 'collect_sample' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{processingOrderId === order.id && processingAction === 'collect_sample' ? 'Collecting...' : 'Collect'}</span>
                          </ButtonWithTooltip>
                        )}
                        {order.status === 'collected' && (
                          <ButtonWithTooltip
                            onClick={() => runOrderAction(order, 'start_analysis')}
                            tooltip="Start analysis"
                            variant="primary"
                            size="sm"
                            disabled={processingOrderId === order.id}
                          >
                            {processingOrderId === order.id && processingAction === 'start_analysis' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{processingOrderId === order.id && processingAction === 'start_analysis' ? 'Starting...' : 'Start'}</span>
                          </ButtonWithTooltip>
                        )}
                        {order.status === 'in_progress' && (
                          <>
                            <ButtonWithTooltip
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowResultModal(true);
                              }}
                              tooltip="Enter result"
                              variant="primary"
                              size="sm"
                            >
                              <FileCheck2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Result</span>
                            </ButtonWithTooltip>
                            <ButtonWithTooltip
                              onClick={() => runOrderAction(order, 'complete')}
                              tooltip="Complete test"
                              variant="success"
                              size="sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Complete</span>
                            </ButtonWithTooltip>
                          </>
                        )}
                        <IconButton
                          icon={Eye}
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetailModal(true);
                          }}
                          tooltip="View details"
                          variant="default"
                          size="sm"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredOrders.length}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* New Order Form */}
      <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC] p-4 lg:p-5 h-fit">
        <h3 className="text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2 mb-4">
          <Plus className="w-4 h-4 text-[#008751] flex-shrink-0" />
          Create Test Order
        </h3>
        <form onSubmit={submitOrder} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Patient MRN *</label>
            <div className="relative">
              <input
                required
                type="text"
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setSelectedPatient(null);
                  setNewOrder({ ...newOrder, patient: '' });
                }}
                placeholder="e.g. NET8966-2026-100081"
                autoComplete="off"
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
              />
              {patientSearchLoading && <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-[#008751]" />}
              {patientSuggestions.length > 0 && !selectedPatient && (
                <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto border border-[#D8D4CD] bg-white shadow-lg">
                  {patientSuggestions.map((patient) => {
                    const patientName = patient.full_name || patient.name || [patient.first_name, patient.last_name].filter(Boolean).join(' ') || 'Unknown patient';
                    const patientMrn = patient.mrn || patient.mrn_number || 'MRN unavailable';
                    return (
                      <button
                        type="button"
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatient(patient);
                          setPatientSearch(patientMrn);
                          setNewOrder({ ...newOrder, patient: patient.id });
                          setPatientSuggestions([]);
                        }}
                        className="block w-full border-b border-[#F0EDE8] px-3 py-2 text-left last:border-0 hover:bg-[#F7F5F2]"
                      >
                        <span className="block text-sm font-medium text-[#1A1A1A]">{patientName}</span>
                        <span className="block text-xs text-[#5A5A5A]">MRN: {patientMrn}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {selectedPatient && (
              <div className="mt-1 flex items-center justify-between gap-2 bg-[#E8F5EF] px-2 py-1.5 text-xs text-[#2D7D46]">
                <span>Selected: {selectedPatient.full_name || selectedPatient.name || [selectedPatient.first_name, selectedPatient.last_name].filter(Boolean).join(' ')}</span>
                <button type="button" onClick={() => { setSelectedPatient(null); setPatientSearch(''); setNewOrder({ ...newOrder, patient: '' }); }} className="font-semibold hover:underline">Change</button>
              </div>
            )}
            {!patientSearchLoading && patientSearch.trim() && !selectedPatient && patientSuggestions.length === 0 && (
              <p className="mt-1 text-xs text-[#C8553D]">No patient found for this MRN or identifier.</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Test *</label>
            <select
              required
              value={newOrder.test}
              onChange={(e) => setNewOrder({ ...newOrder, test: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
            >
              <option value="">Select test</option>
              {tests.map((test) => (
                <option key={test.id} value={test.id}>{test.name} ({test.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Priority</label>
            <select
              value={newOrder.priority}
              onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
            >
              <option value="routine">Routine</option>
              <option value="priority">Priority</option>
              <option value="stat">STAT</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Clinical Notes</label>
            <textarea
              value={newOrder.clinical_notes}
              onChange={(e) => setNewOrder({ ...newOrder, clinical_notes: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
              placeholder="Indication, preparation, or collection notes"
            />
          </div>
          <ButtonWithTooltip
            type="submit"
            tooltip="Create laboratory order"
            variant="primary"
            className="w-full"
          >
            <Plus className="w-4 h-4" />
            Create Order
          </ButtonWithTooltip>
        </form>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2">
      <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC]">
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-[#E8E3DC] bg-[#F7F5F2] flex items-center justify-between">
          <h3 className="min-w-0 flex-1 text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#C8553D] flex-shrink-0" />
            Critical Results
            <span className="text-xs font-normal text-[#5A5A5A]">({criticalResults.length})</span>
          </h3>
        </div>
        <div className="p-3 sm:p-4 space-y-3">
          {criticalResults.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No critical results"
              description="All critical results have been reviewed."
            />
          ) : (
            criticalResults.map((result) => (
              <div key={result.id} className="bg-[#F5EDEA] border border-[#E8D6D0] p-3 sm:p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[#1A1A1A] truncate">{result.patient_name || result.patientName || 'Patient'}</div>
                    <div className="text-sm mt-1 truncate">
                      {result.test_name || result.testName || 'Test'}: <strong className="text-[#C8553D]">{result.value}</strong> {result.units || ''}
                    </div>
                    <div className="text-xs text-[#5A5A5A] truncate">Reference: {result.reference_range || 'Not provided'} · Order {result.order_number || result.order_id || 'N/A'}</div>
                  </div>
                  <AlertTriangle className="w-5 h-5 text-[#C8553D] flex-shrink-0" />
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <ButtonWithTooltip
                    onClick={() => verifyResult(result)}
                    tooltip="Verify and release result"
                    variant="success"
                    size="sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify & Release
                  </ButtonWithTooltip>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC]">
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-[#E8E3DC] bg-[#F7F5F2] flex items-center justify-between">
          <h3 className="min-w-0 flex-1 text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#008751] flex-shrink-0" />
            Awaiting Verification
            <span className="text-xs font-normal text-[#5A5A5A]">({unverifiedResults.length})</span>
          </h3>
          <ButtonWithTooltip
            onClick={openEnterResultModal}
            tooltip="Enter a test result"
            variant="primary"
            size="sm"
            className="flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Enter Result
          </ButtonWithTooltip>
        </div>
        <div className="p-3 sm:p-4 space-y-3">
          {unverifiedResults.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No unverified results"
              description="All results have been verified."
            />
          ) : (
            unverifiedResults.map((result) => (
              <div key={result.id} className="bg-[#F7F5F2] border border-[#E8E3DC] p-3 sm:p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[#1A1A1A] truncate">{result.patient_name || result.patientName || 'Patient'}</div>
                    <div className="text-sm mt-1 truncate">
                      {result.test_name || result.testName || 'Test'}: <strong>{result.value}</strong> {result.units || ''}
                    </div>
                    <div className="text-xs text-[#5A5A5A] truncate">Reference: {result.reference_range || 'Not provided'}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <ButtonWithTooltip
                    onClick={() => verifyResult(result)}
                    tooltip="Verify and release result"
                    variant="success"
                    size="sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify & Release
                  </ButtonWithTooltip>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderQC = () => (
    <div className="space-y-4">
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        <StatsCard
          title="QC Status"
          value={qualityControlData.in_control === null ? "Not configured" : qualityControlData.in_control ? "In Control" : "Out of Control"}
          subValue="QC endpoint unavailable"
          icon={ShieldCheck}
          color={qualityControlData.in_control ? "green" : "terracotta"}
        />
        <StatsCard
          title="QC Materials"
          value={qualityControlData.total_materials || 0}
          subValue={`${qualityControlData.expiring_soon || 0} expiring soon`}
          icon={Beaker}
          color="slate"
        />
        <StatsCard
          title="Proficiency Testing"
          value="Not configured"
          subValue="PT records unavailable"
          icon={Award}
          color="green"
        />
      </div>

      <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC]">
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-[#E8E3DC] bg-[#F7F5F2] flex flex-wrap justify-between items-center gap-2">
          <h3 className="min-w-0 flex-1 text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
            <LineChart className="w-4 h-4 text-[#008751] flex-shrink-0" />
            QC Results - Levey-Jennings Chart
          </h3>
          <span className="text-xs text-[#5A5A5A]">QC integration pending</span>
        </div>
        <div className="p-4 bg-[#F7F5F2] border-b border-[#E8E3DC]">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A5A5A]">
            <span>Mean: {qualityControlData.mean || 'N/A'}</span>
            <span>SD: {qualityControlData.sd || 'N/A'}</span>
            <span>CV: {qualityControlData.cv || 'N/A'}%</span>
            <span>n: {qualityControlData.n || 0}</span>
          </div>
        </div>
        <div className="p-4 min-h-[200px] flex items-center justify-center text-[#5A5A5A]">
          <div className="text-center">
            <LineChart className="w-12 h-12 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-sm">QC chart unavailable</p>
            <p className="text-xs text-[#B0A89E]">Connect QC results to view trends and Westgard rules.</p>
          </div>
        </div>
      </div>

      <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC]">
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-[#E8E3DC] bg-[#F7F5F2]">
          <h3 className="min-w-0 flex-1 text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-[#008751] flex-shrink-0" />
            QC Material Inventory
          </h3>
        </div>
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {qualityControlData.materials?.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={Beaker}
                title="No QC materials"
                description="QC material inventory is empty."
              />
            </div>
          ) : (
            qualityControlData.materials?.map((material, idx) => (
              <div key={idx} className="min-w-0 overflow-hidden border border-[#E8E3DC] p-3 text-center">
                <p className="text-xs font-medium text-[#1A1A1A] truncate">{material.name}</p>
                <p className="text-lg font-display font-bold text-[#008751]">{material.quantity}</p>
                <p className="text-[10px] text-[#5A5A5A]">Lot: {material.lot_number}</p>
                <p className="text-[10px] text-[#B0A89E]">Exp: {material.expiry_date}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC]">
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-[#E8E3DC] bg-[#F7F5F2]">
          <h3 className="min-w-0 flex-1 text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#008751] flex-shrink-0" />
            Equipment Maintenance
          </h3>
        </div>
        <div className="p-3 sm:p-4 space-y-3">
          {maintenance.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No maintenance due"
              description="All equipment is up to date."
            />
          ) : (
            maintenance.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EDE8] pb-3 last:border-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-[#1A1A1A]">{item.instrument_name}</div>
                  <div className="text-xs text-[#5A5A5A]">{item.maintenance_type} · {item.scheduled_date || 'Date not set'}</div>
                  <p className="mt-1 text-xs text-[#5A5A5A] truncate">{item.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                  <StatusBadge status={item.status} />
                  <IconButton icon={CheckCircle2} onClick={() => completeMaintenance(item)} tooltip="Complete maintenance" variant="success" size="sm" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderInventory = () => {
    const lowStockItems = inventoryItems.filter(i => i.stock < i.reorder_level);

    return (
      <div className="space-y-4">
        {lowStockItems.length > 0 && (
          <div className="bg-[#F5F0EA] border border-[#F0E8DC] p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#C87D3D] flex-shrink-0" />
              <h4 className="text-sm font-medium text-[#1A1A1A]">Low Stock Alerts ({lowStockItems.length})</h4>
            </div>
            <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {lowStockItems.slice(0, 6).map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white border border-[#E8E3DC] p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#1A1A1A] truncate">{item.name}</p>
                    <p className="text-[10px] text-[#5A5A5A]">Stock: {item.stock} / Reorder: {item.reorder_level}</p>
                  </div>
                  <span className="text-[10px] text-[#5A5A5A]">Reorder in Supplies</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC]">
          <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-[#E8E3DC] bg-[#F7F5F2] flex flex-wrap justify-between items-center gap-2">
            <h3 className="min-w-0 flex-1 text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
              <PackageSearch className="w-4 h-4 text-[#008751] flex-shrink-0" />
              Reagent & Consumable Inventory
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5A5A5A]">Managed in Medical Supplies</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="border-b border-[#E8E3DC] bg-[#FAFAFA]">
                <tr>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Item</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Category</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Reorder Level</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Expiry</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {inventoryItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-[#5A5A5A]">
                      <EmptyState
                        icon={PackageSearch}
                        title="Lab inventory is not connected"
                        description="Manage reagents and consumables in Medical Supplies until a lab inventory service is enabled."
                      />
                    </td>
                  </tr>
                ) : (
                  inventoryItems.map((item) => {
                    const isLow = item.stock < item.reorder_level;
                    const isExpiring = item.expiry_date && new Date(item.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                    return (
                      <tr key={item.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#1A1A1A] truncate max-w-[120px]">{item.name}</div>
                          <div className="text-xs text-[#5A5A5A] truncate max-w-[120px]">{item.code}</div>
                        </td>
                        <td className="px-4 py-3 text-[#5A5A5A] truncate max-w-[100px]">{item.category}</td>
                        <td className="px-4 py-3">
                          <span className={isLow ? 'text-[#C8553D] font-bold' : 'text-[#1A1A1A]'}>
                            {item.stock} {item.unit}
                          </span>
                          {isLow && (
                            <span className="ml-2 text-[10px] text-[#C8553D]">(Low)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#5A5A5A]">{item.reorder_level}</td>
                        <td className="px-4 py-3">
                          <span className={isExpiring ? 'text-[#C8553D]' : 'text-[#5A5A5A]'}>
                            {item.expiry_date || 'N/A'}
                          </span>
                          {isExpiring && (
                            <span className="ml-2 text-[10px] text-[#C8553D]">(Expiring soon)</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <span className="text-[10px] text-[#5A5A5A]">Managed in Medical Supplies</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTestCatalog = () => (
    <div className="space-y-4">
      <div className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC]">
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-b border-[#E8E3DC] bg-[#F7F5F2] flex items-center justify-between">
          <h3 className="min-w-0 flex-1 text-sm font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
            <Beaker className="w-4 h-4 text-[#008751] flex-shrink-0" />
            Laboratory Test Catalog
            <span className="text-xs font-normal text-[#5A5A5A]">({tests.length})</span>
          </h3>
          <ButtonWithTooltip
            onClick={() => setShowCreateTestModal(true)}
            tooltip="Add a new test to the catalog"
            variant="primary"
            size="sm"
            className="flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Test
          </ButtonWithTooltip>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-b border-[#E8E3DC] bg-[#FAFAFA]">
              <tr>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Test Name</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Code</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Category</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Sample Type</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Turnaround</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Price</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Reference Range</th>
                <th className="px-4 py-2 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8]">
              {tests.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-[#5A5A5A]">
                    <EmptyState
                      icon={Beaker}
                      title="No tests available"
                      description="Click 'Add Test' to create your first test in the catalog."
                    />
                  </td>
                </tr>
              ) : (
                tests.map((test) => (
                  <tr key={test.id} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#1A1A1A]">{test.name}</div>
                      <div className="text-xs text-[#5A5A5A]">ID: {test.id}</div>
                    </td>
                    <td className="px-4 py-3 text-[#5A5A5A]">{test.code || '—'}</td>
                    <td className="px-4 py-3 text-[#5A5A5A] capitalize">{test.category || 'Other'}</td>
                    <td className="px-4 py-3 text-[#5A5A5A]">{test.sample_type || '—'}</td>
                    <td className="px-4 py-3 text-[#5A5A5A]">{test.turnaround_time ? `${test.turnaround_time}h` : '—'}</td>
                    <td className="px-4 py-3 text-[#5A5A5A]">{test.price ? `₦${Number(test.price).toLocaleString()}` : '₦0'}</td>
                    <td className="px-4 py-3 text-[#5A5A5A]">{test.reference_range || '—'}</td>
                    <td className="px-4 py-3 text-[#5A5A5A]">{test.units || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderReports = () => {
    const reportTypes = [
      { id: 'daily_workload', label: 'Daily Workload Report', description: 'Sample volume, status, and completion metrics', icon: ClipboardList },
      { id: 'turnaround', label: 'Turnaround Time Report', description: 'Performance metrics by test and department', icon: Clock },
      { id: 'revenue', label: 'Revenue Report', description: 'Financial performance with insurance breakdown', icon: DollarSign },
      { id: 'quality', label: 'Quality Control Report', description: 'QC results, PT scores, and compliance', icon: ShieldCheck },
      { id: 'inventory', label: 'Inventory Report', description: 'Stock levels, usage, and reorder recommendations', icon: PackageSearch },
      { id: 'utilization', label: 'Test Utilization Report', description: 'Test volume trends and utilization analysis', icon: PieChart },
    ];

    return (
      <div className="space-y-4">
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="min-w-0 overflow-hidden bg-white border border-[#E8E3DC] p-4 hover:border-[#008751] transition-colors">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="w-10 h-10 bg-[#E8F5EF] rounded flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#008751]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[#1A1A1A]">{report.label}</h4>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">{report.description}</p>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <ButtonWithTooltip
                        onClick={() => exportReport(report.id)}
                        tooltip="Generate report"
                        variant="primary"
                        size="sm"
                      >
                        <FileText className="w-3 h-3" />
                        Generate
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        onClick={() => exportReport(report.id)}
                        tooltip="Export PDF"
                        variant="secondary"
                        size="sm"
                      >
                        <Download className="w-3 h-3" />
                        Export
                      </ButtonWithTooltip>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border border-[#E8E3DC] bg-[#F7F5F2] p-4 text-sm text-[#5A5A5A]">
          Reports are generated from the laboratory orders currently loaded for this tenant. Scheduled reporting requires a backend reporting job.
        </div>
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-[#5A5A5A]">
          <Loader2 className="w-6 h-6 animate-spin text-[#008751]" />
          <span>Loading laboratory workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard min-h-screen w-full min-w-0 overflow-x-hidden bg-[#F7F5F2] p-2 sm:p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <header className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-[#008751] uppercase tracking-[0.18em]">
              <Beaker className="w-4 h-4 flex-shrink-0" />
              Laboratory Operations
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-[#1A1A1A]">Laboratory Dashboard</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#5A5A5A]">
              Coordinate patient specimens, testing, result release, quality control, and compliance from one clinical workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            <ButtonWithTooltip
              onClick={() => setActiveTab('samples')}
              tooltip="Create a new test order"
              variant="primary"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Test Order</span>
              <span className="sm:hidden">New</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => loadDashboard(true)}
              tooltip="Refresh dashboard data"
              variant="secondary"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </header>

      {/* Error Messages */}
      {error && (
        <div className="mb-4 flex items-center gap-2 border border-[#E8D6D0] bg-[#F5EDEA] px-4 py-3 text-sm text-[#C8553D]">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {actionError && (
        <div className="mb-4 flex items-center justify-between gap-2 border border-[#E8D6D0] bg-[#F5EDEA] px-4 py-3 text-sm text-[#C8553D]">
          <span className="flex items-center gap-2">
            <XCircle className="w-4 h-4 flex-shrink-0" />
            {actionError}
          </span>
          <button onClick={() => setActionError('')} className="text-[#C8553D] hover:text-[#A8442E]">×</button>
        </div>
      )}

      {/* Tabs */}
      <nav className="mb-4 sm:mb-6 border-b border-[#E8E3DC] overflow-x-auto bg-white" aria-label="Laboratory sections">
        <div className="flex gap-1 min-w-max px-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'border-[#008751] text-[#008751]'
                  : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      <div className="w-full min-w-0 overflow-hidden bg-white border border-[#E8E3DC] p-2 sm:p-4 lg:p-5 xl:p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'samples' && renderSamples()}
        {activeTab === 'results' && renderResults()}
        {activeTab === 'qc' && renderQC()}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'tests' && renderTestCatalog()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          setSelectedOrder(null);
          setResultValue('');
          setResultNotes('');
        }}
        order={selectedOrder}
        value={resultValue}
        setValue={setResultValue}
        notes={resultNotes}
        setNotes={setResultNotes}
        onSubmit={submitResult}
      />

      {showOrderDetailModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1A1A1A] bg-opacity-60 p-0 sm:p-4">
          <div className="bg-white w-full sm:w-full sm:max-w-lg max-h-[95vh] overflow-hidden rounded-t-lg sm:rounded-lg">
            <div className="border-b border-[#E8E3DC] px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-display font-semibold text-[#1A1A1A]">Sample Details</h3>
                <p className="text-xs sm:text-sm text-[#5A5A5A] truncate">{selectedOrder.order_number || `Order ${selectedOrder.id}`}</p>
              </div>
              <button onClick={() => { setShowOrderDetailModal(false); setSelectedOrder(null); }} className="p-1 hover:bg-[#F0EDE8] rounded transition-colors flex-shrink-0 ml-2">
                <X className="w-5 h-5 text-[#5A5A5A]" />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-[#F7F5F2] p-3 rounded">
                  <div className="text-[10px] uppercase tracking-wider text-[#5A5A5A]">Patient</div>
                  <div className="mt-1 font-medium text-[#1A1A1A]">{displayName(selectedOrder)}</div>
                </div>
                <div className="bg-[#F7F5F2] p-3 rounded">
                  <div className="text-[10px] uppercase tracking-wider text-[#5A5A5A]">Test</div>
                  <div className="mt-1 font-medium text-[#1A1A1A]">{selectedOrder.test_name || 'Laboratory test'}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm text-[#1A1A1A]">
                <div className="flex justify-between gap-3 border-b border-[#F0EDE8] pb-2"><span className="text-[#5A5A5A]">Accession</span><span className="font-medium">{selectedOrder.sample_accession_number || 'Not assigned'}</span></div>
                <div className="flex justify-between gap-3 border-b border-[#F0EDE8] pb-2"><span className="text-[#5A5A5A]">Priority</span><span className="font-medium">{selectedOrder.priority || 'routine'}</span></div>
                <div className="flex justify-between gap-3 border-b border-[#F0EDE8] pb-2"><span className="text-[#5A5A5A]">Status</span><span className="font-medium"><StatusBadge status={selectedOrder.status} /></span></div>
                <div className="flex justify-between gap-3 border-b border-[#F0EDE8] pb-2"><span className="text-[#5A5A5A]">Clinical Notes</span><span className="font-medium text-right max-w-[200px]">{selectedOrder.clinical_notes || 'No notes provided'}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Test Order Modal */}
      <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-opacity ${showCreateOrderModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ backgroundColor: showCreateOrderModal ? 'rgba(26, 26, 26, 0.6)' : 'rgba(26, 26, 26, 0)' }}>
        <div className={`bg-white w-full sm:w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-t-lg sm:rounded-lg transform transition-transform ${showCreateOrderModal ? 'translate-y-0' : 'translate-y-full sm:scale-95'}`}>
          <div className="border-b border-[#E8E3DC] px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="text-base sm:text-lg font-display font-semibold text-[#1A1A1A]">Create Test Order</h3>
            <button onClick={() => setShowCreateOrderModal(false)} className="p-1 hover:bg-[#F0EDE8] rounded transition-colors flex-shrink-0 ml-2">
              <X className="w-5 h-5 text-[#5A5A5A]" />
            </button>
          </div>
          <form onSubmit={submitCreateOrder} className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {actionError && (
              <div className="bg-[#F5EDEA] border border-[#E8D6D0] text-[#C8553D] text-sm px-3 py-2 rounded">
                {actionError}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Patient *</label>
              <input
                type="text"
                value={createOrderPatientSearch}
                onChange={(e) => setCreateOrderPatientSearch(e.target.value)}
                placeholder="Search by name or MRN..."
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
              />
              {createOrderPatientSuggestions.length > 0 && !createOrderSelectedPatient && (
                <div className="mt-2 border border-[#E8E3DC] rounded bg-white max-h-40 overflow-y-auto">
                  {createOrderPatientSuggestions.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => {
                        setCreateOrderSelectedPatient(patient);
                        setCreateOrderPatientSearch(patient.mrn || '');
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-[#F7F5F2] border-b border-[#F0EDE8] last:border-0 text-sm"
                    >
                      <div className="font-medium text-[#1A1A1A]">{patient.full_name || patient.name || [patient.first_name, patient.last_name].filter(Boolean).join(' ')}</div>
                      <div className="text-xs text-[#5A5A5A]">MRN: {patient.mrn}</div>
                    </button>
                  ))}
                </div>
              )}
              {createOrderSelectedPatient && (
                <div className="mt-2 bg-[#E8F5EF] border border-[#D0E8E0] p-2 rounded flex items-center justify-between">
                  <span className="text-sm text-[#1A1A1A]">Selected: {createOrderSelectedPatient.full_name || createOrderSelectedPatient.name || [createOrderSelectedPatient.first_name, createOrderSelectedPatient.last_name].filter(Boolean).join(' ')}</span>
                  <button type="button" onClick={() => { setCreateOrderSelectedPatient(null); setCreateOrderPatientSearch(''); setCreateOrderFormData({ ...createOrderFormData, patient: '' }); }} className="text-sm font-semibold text-[#008751] hover:underline">Change</button>
                </div>
              )}
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between gap-2">
                <label className="block text-xs font-medium text-[#5A5A5A]">Test *</label>
                <button
                  type="button"
                  onClick={() => {
                    setReturnToCreateOrder(true);
                    setShowCreateOrderModal(false);
                    setShowCreateTestModal(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#008751] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add test
                </button>
              </div>
              <select
                required
                value={createOrderFormData.test}
                onChange={(e) => setCreateOrderFormData({ ...createOrderFormData, test: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
              >
                <option value="">Select a test...</option>
                {tests.map((test) => (
                  <option key={test.id} value={test.id}>{test.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Priority</label>
              <select
                value={createOrderFormData.priority}
                onChange={(e) => setCreateOrderFormData({ ...createOrderFormData, priority: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
              >
                <option value="routine">Routine</option>
                <option value="priority">Priority</option>
                <option value="stat">STAT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Clinical Notes</label>
              <textarea
                value={createOrderFormData.clinical_notes}
                onChange={(e) => setCreateOrderFormData({ ...createOrderFormData, clinical_notes: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
                placeholder="Clinical indication or special instructions"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-[#E8E3DC]">
              <ButtonWithTooltip
                type="button"
                onClick={() => setShowCreateOrderModal(false)}
                tooltip="Cancel"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Cancel
              </ButtonWithTooltip>
              <ButtonWithTooltip
                type="submit"
                tooltip="Create order"
                variant="primary"
                className="w-full sm:w-auto"
                disabled={createOrderSubmitting}
              >
                {createOrderSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {createOrderSubmitting ? 'Creating...' : 'Create Order'}
              </ButtonWithTooltip>
            </div>
          </form>
        </div>
      </div>

      {/* Enter Result Modal */}
      <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-opacity ${showEnterResultModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ backgroundColor: showEnterResultModal ? 'rgba(26, 26, 26, 0.6)' : 'rgba(26, 26, 26, 0)' }}>
        <div className={`bg-white w-full sm:w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-t-lg sm:rounded-lg transform transition-transform ${showEnterResultModal ? 'translate-y-0' : 'translate-y-full sm:scale-95'}`}>
          <div className="border-b border-[#E8E3DC] px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="text-base sm:text-lg font-display font-semibold text-[#1A1A1A]">Enter Test Result</h3>
            <button onClick={() => setShowEnterResultModal(false)} className="p-1 hover:bg-[#F0EDE8] rounded transition-colors flex-shrink-0 ml-2">
              <X className="w-5 h-5 text-[#5A5A5A]" />
            </button>
          </div>
          <form onSubmit={submitEnterResult} className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {actionError && (
              <div className="bg-[#F5EDEA] border border-[#E8D6D0] text-[#C8553D] text-sm px-3 py-2 rounded">
                {actionError}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Sample in Progress *</label>
              {enterResultLoading ? (
                <div className="flex items-center gap-2 border border-[#D8D4CD] px-3 py-2 text-sm text-[#5A5A5A]">
                  <Loader2 className="h-4 w-4 animate-spin text-[#008751]" />
                  Loading samples...
                </div>
              ) : (
                <select
                  required
                  value={enterResultFormData.order}
                  onChange={(e) => setEnterResultFormData({ ...enterResultFormData, order: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
                >
                  <option value="">{sampleOrdersForResult.length ? 'Select a sample...' : 'No samples in progress'}</option>
                  {sampleOrdersForResult.map((order) => (
                    <option key={order.id} value={order.id}>
                      {displayName(order)} · {order.test_name || 'Test'} ({order.sample_accession_number || `Order ${order.id}`})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Result Value *</label>
              <input
                required
                type="text"
                value={enterResultFormData.value}
                onChange={(e) => setEnterResultFormData({ ...enterResultFormData, value: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
                placeholder="Enter value and units (e.g., 7.2 mg/dL)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Result Notes</label>
              <textarea
                value={enterResultFormData.result_notes}
                onChange={(e) => setEnterResultFormData({ ...enterResultFormData, result_notes: e.target.value })}
                rows="4"
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
                placeholder="Interpretation, instrument notes, or comments"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-[#E8E3DC]">
              <ButtonWithTooltip
                type="button"
                onClick={() => setShowEnterResultModal(false)}
                tooltip="Cancel"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Cancel
              </ButtonWithTooltip>
              <ButtonWithTooltip
                type="submit"
                tooltip="Save result"
                variant="primary"
                className="w-full sm:w-auto"
                disabled={enterResultSubmitting || enterResultLoading}
              >
                {enterResultSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {enterResultSubmitting ? 'Saving...' : 'Save Result'}
              </ButtonWithTooltip>
            </div>
          </form>
        </div>
      </div>

      {/* Create Test Modal */}
      <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-opacity ${showCreateTestModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ backgroundColor: showCreateTestModal ? 'rgba(26, 26, 26, 0.6)' : 'rgba(26, 26, 26, 0)' }}>
        <div className={`bg-white w-full sm:w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-t-lg sm:rounded-lg transform transition-transform ${showCreateTestModal ? 'translate-y-0' : 'translate-y-full sm:scale-95'}`}>
          <div className="border-b border-[#E8E3DC] px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="text-base sm:text-lg font-display font-semibold text-[#1A1A1A]">Add Test to Catalog</h3>
            <button onClick={() => { setShowCreateTestModal(false); setReturnToCreateOrder(false); }} className="p-1 hover:bg-[#F0EDE8] rounded transition-colors flex-shrink-0 ml-2">
              <X className="w-5 h-5 text-[#5A5A5A]" />
            </button>
          </div>
          <form onSubmit={submitCreateTest} className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {actionError && (
              <div className="bg-[#F5EDEA] border border-[#E8D6D0] text-[#C8553D] text-sm px-3 py-2 rounded">
                {actionError}
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Test Name *</label>
              <input
                required
                type="text"
                value={createTestFormData.name}
                onChange={(e) => setCreateTestFormData({ ...createTestFormData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
                placeholder="e.g., Full Blood Count"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Code</label>
              <input
                type="text"
                value={createTestFormData.code}
                onChange={(e) => setCreateTestFormData({ ...createTestFormData, code: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
                placeholder="e.g., FBC or leave blank to auto-generate"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Category</label>
              <select
                value={createTestFormData.category}
                onChange={(e) => setCreateTestFormData({ ...createTestFormData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
              >
                <option value="hematology">Hematology</option>
                <option value="biochemistry">Biochemistry</option>
                <option value="microbiology">Microbiology</option>
                <option value="urinalysis">Urinalysis</option>
                <option value="hormonal">Hormonal</option>
                <option value="immunology">Immunology</option>
                <option value="molecular">Molecular</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Sample Type</label>
                <input
                  type="text"
                  value={createTestFormData.sample_type}
                  onChange={(e) => setCreateTestFormData({ ...createTestFormData, sample_type: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
                  placeholder="Blood"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Turnaround (hours)</label>
                <input
                  type="number"
                  min="1"
                  value={createTestFormData.turnaround_time}
                  onChange={(e) => setCreateTestFormData({ ...createTestFormData, turnaround_time: Number(e.target.value || 24) })}
                  className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Price (₦)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={createTestFormData.price}
                onChange={(e) => setCreateTestFormData({ ...createTestFormData, price: Number(e.target.value || 0) })}
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Reference Range</label>
              <input
                type="text"
                value={createTestFormData.reference_range}
                onChange={(e) => setCreateTestFormData({ ...createTestFormData, reference_range: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
                placeholder="e.g., 4.5-11.0 (x10^9/L)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Units</label>
              <input
                type="text"
                value={createTestFormData.units}
                onChange={(e) => setCreateTestFormData({ ...createTestFormData, units: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white"
                placeholder="e.g., g/dL, mmol/L, cells/µL"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t border-[#E8E3DC]">
              <ButtonWithTooltip
                type="button"
                onClick={() => { setShowCreateTestModal(false); setReturnToCreateOrder(false); }}
                tooltip="Cancel"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Cancel
              </ButtonWithTooltip>
              <ButtonWithTooltip
                type="submit"
                tooltip="Add test to catalog"
                variant="primary"
                className="w-full sm:w-auto"
              >
                <Check className="w-4 h-4" />
                Add Test
              </ButtonWithTooltip>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryDashboard;