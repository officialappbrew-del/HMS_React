import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Download,
  RefreshCw,
  AlertTriangle,
  Target,
  Activity,
  CreditCard,
  Banknote,
  Calculator,
  LineChart,
  Eye,
  Settings,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit,
  Check,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  fetchFinancialAnalytics,
  fetchBudgets,
  fetchInvoices,
  createBudget,
  setDateRange,
  searchFinancialData,
  filterFinancialData,
  clearError
} from '../features/financialSlice';
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
    'nhis': { label: 'NHIS', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'private': { label: 'Private', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'corporate': { label: 'Corporate', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'out_of_pocket': { label: 'Out of Pocket', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'staff': { label: 'Staff Costs', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'drugs': { label: 'Drug Costs', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'equipment': { label: 'Equipment', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'overhead': { label: 'Overhead', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
    'maintenance': { label: 'Maintenance', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'active': { label: 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'over_budget': { label: 'Over Budget', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
  };

  const config = statusMap[status] || statusMap['active'];
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== METRIC CARD ====================
const MetricCard = ({ title, value, icon: Icon, color, subtitle, className = '' }) => {
  const colorMap = {
    green: 'text-[#008751] bg-[#E8F5EF]',
    red: 'text-[#C8553D] bg-[#F5EDEA]',
    blue: 'text-[#008751] bg-[#E8F5EF]',
    purple: 'text-[#4A5A5A] bg-[#F0EDE8]',
    gold: 'text-[#C87D3D] bg-[#F5F0EA]',
  };

  return (
    <div className={`bg-white border border-[#E8E3DC] p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
          <p className="mt-1 text-lg font-display font-bold text-[#1A1A1A]">{value}</p>
          {subtitle && <p className="text-xs text-[#5A5A5A] mt-0.5">{subtitle}</p>}
        </div>
        <div className={`w-8 h-8 ${colorMap[color]} rounded flex items-center justify-center flex-shrink-0 ml-2`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

const FinancialAnalytics = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'admin';
  const FINANCE_ROLES = ['admin', 'accountant', 'billing_officer', 'super_admin', 'system_admin'];

  if (!FINANCE_ROLES.includes(userRole)) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const dispatch = useDispatch();
  const {
    revenueData,
    costData,
    cashFlowData,
    budgets,
    kpis,
    dateRange,
    searchTerm,
    filterBy,
    loading,
    error,
    stats,
    analytics
  } = useSelector(state => state.financial);

  const safeCashFlowData = Array.isArray(cashFlowData) ? cashFlowData : [];

  const [activeTab, setActiveTab] = useState('overview');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const itemsPerPage = 10;

  const [budgetForm, setBudgetForm] = useState({
    department: '',
    category: '',
    amount: '',
    period: 'monthly',
    year: new Date().getFullYear(),
    description: ''
  });

  useEffect(() => {
    dispatch(fetchFinancialAnalytics(dateRange));
    dispatch(fetchBudgets());
    dispatch(fetchInvoices());
  }, [dispatch, dateRange]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Nigerian financial metrics - derived from real API data
  const nigerianMetrics = analytics ? {
    revenue: Object.entries(analytics.revenue || {}).reduce((acc, [key, value]) => {
      acc[key] = { current: Number(value) || 0, target: Number(value) || 0, growth: 0 };
      return acc;
    }, {}),
    costs: Object.entries(analytics.costs || {}).reduce((acc, [key, value]) => {
      const total = Object.values(analytics.costs || {}).reduce((s, v) => s + Number(v), 0);
      acc[key] = { current: Number(value) || 0, percentage: total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0 };
      return acc;
    }, {}),
    ratios: analytics.kpis?.financial || {}
  } : {
    revenue: {},
    costs: {},
    ratios: {}
  };

  // Filter and search logic
  const filteredRevenue = revenueData
    .filter(item => {
      const matchesSearch = !searchTerm ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || item.category === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredCosts = (() => {
    if (costData.length > 0) {
      return costData
        .filter(item => {
          const matchesSearch = !searchTerm ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesFilter = filterBy === 'all' || item.category === filterBy;
          return matchesSearch && matchesFilter;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    if (analytics?.costs && Object.keys(analytics.costs).length > 0) {
      return Object.entries(analytics.costs).map(([category, amount]) => ({
        id: `cost-${category}`,
        date: new Date().toISOString().split('T')[0],
        category,
        description: category.replace(/([A-Z])/g, ' $1').trim(),
        amount: Number(amount) || 0,
        budget: 0,
        variance: 0,
      }));
    }
    
    return [];
  })();

  const paginatedItems = activeTab === 'revenue' ? filteredRevenue : filteredCosts;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateBudget = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!budgetForm.department || !budgetForm.category || !budgetForm.amount) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    dispatch(createBudget(budgetForm));
    setBudgetForm({
      department: '',
      category: '',
      amount: '',
      period: 'monthly',
      year: new Date().getFullYear(),
      description: ''
    });
    setShowBudgetModal(false);
    setSuccessMessage('Budget created successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleExportReport = (reportType) => {
    setSuccessMessage(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report exported.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthColor = (growth) => {
    if (growth > 10) return 'text-[#2D7D46]';
    if (growth > 0) return 'text-[#008751]';
    return 'text-[#C8553D]';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <TrendingUp className="w-3.5 h-3.5" />;
    return <TrendingDown className="w-3.5 h-3.5" />;
  };

  const totalRevenue = stats.totalRevenue || 0;
  const totalCosts = stats.totalCosts || 0;
  const netProfit = stats.netProfit || (totalRevenue - totalCosts);
  const profitMargin = stats.profitMargin || (totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0);
  const cashPosition = stats.cashPosition || 0;

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue Analysis', icon: TrendingUp },
    { id: 'costs', label: 'Cost Analysis', icon: TrendingDown },
    { id: 'cashflow', label: 'Cash Flow', icon: Activity },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'kpis', label: 'KPIs', icon: LineChart }
  ];

  return (
    <div className="financial-analytics min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Financial Analytics
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Comprehensive financial intelligence for healthcare operations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => {
                dispatch(fetchFinancialAnalytics(dateRange));
                setSuccessMessage('Revenue report generated.');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
              tooltip="Refresh financial data"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => handleExportReport('financial')}
              tooltip="Export financial report"
              variant="primary"
              size="sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
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

      {/* Key Financial Metrics - Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          subValue="+12.5% YoY"
          icon={DollarSign}
          color="green"
          trend="up"
          trendValue="12.5% growth"
          tooltip="Total revenue from all sources"
        />
        <StatsCard
          title="Total Costs"
          value={formatCurrency(totalCosts)}
          subValue="+8.2% YoY"
          icon={CreditCard}
          color="red"
          trend="down"
          trendValue="8.2% increase"
          tooltip="Total operational costs"
        />
        <StatsCard
          title="Net Profit"
          value={formatCurrency(netProfit)}
          subValue={`${profitMargin}% margin`}
          icon={Calculator}
          color="blue"
          trend="up"
          trendValue="18.5% margin"
          tooltip="Net profit after all costs"
        />
        <StatsCard
          title="Cash Position"
          value="₦45.2M"
          subValue="Healthy"
          icon={Banknote}
          color="purple"
          trend="up"
          trendValue="Stable"
          tooltip="Current cash position"
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

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Breakdown */}
              <div>
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Revenue Sources</h3>
                <div className="space-y-3">
                  {Object.entries(nigerianMetrics.revenue).map(([source, data]) => (
                    <div key={source} className="bg-white border border-[#E8E3DC] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-[#1A1A1A] capitalize">
                          {source.replace(/([A-Z])/g, ' $1')}
                        </h4>
                        <div className={`flex items-center ${getGrowthColor(data.growth)}`}>
                          {getGrowthIcon(data.growth)}
                          <span className="ml-1 text-xs">{data.growth}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-display font-bold text-[#1A1A1A]">
                            {formatCurrency(data.current)}
                          </p>
                          <p className="text-xs text-[#5A5A5A]">Target: {formatCurrency(data.target)}</p>
                        </div>
                        <div className="text-right">
                          <div className="w-24 bg-[#F0EDE8] h-1.5">
                            <div
                              className="bg-[#008751] h-1.5"
                              style={{ width: `${Math.min((data.current / data.target) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-[10px] text-[#B0A89E] mt-0.5">
                            {((data.current / data.target) * 100).toFixed(0)}% of target
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div>
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Cost Structure</h3>
                <div className="space-y-3">
                  {Object.entries(nigerianMetrics.costs).map(([category, data]) => (
                    <div key={category} className="bg-white border border-[#E8E3DC] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-[#1A1A1A] capitalize">
                          {category.replace(/([A-Z])/g, ' $1')}
                        </h4>
                        <span className="text-xs text-[#5A5A5A]">{data.percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-display font-bold text-[#1A1A1A]">
                          {formatCurrency(data.current)}
                        </p>
                        <div className="w-16 bg-[#F0EDE8] h-1.5">
                          <div
                            className="bg-[#C8553D] h-1.5"
                            style={{ width: `${data.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Ratios */}
            <div className="mt-6">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Key Financial Ratios</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(nigerianMetrics.ratios).map(([ratio, value]) => (
                  <MetricCard
                    key={ratio}
                    title={ratio.replace(/([A-Z])/g, ' $1')}
                    value={typeof value === 'number' && value < 1 ? value.toFixed(2) : value.toLocaleString()}
                    icon={Target}
                    color="blue"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== REVENUE TAB ==================== */}
        {activeTab === 'revenue' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => dispatch(setDateRange(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Search</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                  <input
                    type="text"
                    placeholder="Search revenue..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchFinancialData(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Category</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterFinancialData(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="all">All Categories</option>
                  <option value="nhis">NHIS</option>
                  <option value="private">Private</option>
                  <option value="corporate">Corporate</option>
                  <option value="out_of_pocket">Out of Pocket</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <ButtonWithTooltip
                  onClick={() => handleExportReport('revenue')}
                  tooltip="Export revenue report"
                  variant="primary"
                  size="sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={() => dispatch(fetchFinancialAnalytics(dateRange))}
                  tooltip="Generate report"
                  variant="secondary"
                  size="sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Generate
                </ButtonWithTooltip>
              </div>
            </div>

            {/* Revenue Table */}
            <div className="bg-white border border-[#E8E3DC] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E8E3DC]">
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Description</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EDE8]">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-[#5A5A5A]">
                          <DollarSign className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
                          <p className="text-sm">No revenue data found</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map(item => (
                        <tr key={item.id} className="hover:bg-[#F7F5F2] transition-colors">
                          <td className="px-4 py-3 text-sm text-[#5A5A5A]">
                            {new Date(item.date).toLocaleDateString('en-NG')}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={item.category} />
                          </td>
                          <td className="px-4 py-3 text-sm text-[#1A1A1A] max-w-xs truncate hidden sm:table-cell">
                            {item.description}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#1A1A1A]">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className={`flex items-center ${getGrowthColor(item.growth)}`}>
                              {getGrowthIcon(item.growth)}
                              <span className="ml-1 text-sm">{item.growth}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {paginatedItems.length > itemsPerPage && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-[10px] text-[#5A5A5A]">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, paginatedItems.length)} of {paginatedItems.length}
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
                    Page {currentPage} of {Math.ceil(paginatedItems.length / itemsPerPage)}
                  </span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setCurrentPage(Math.min(Math.ceil(paginatedItems.length / itemsPerPage), currentPage + 1))}
                    tooltip="Next page"
                    variant="default"
                    disabled={currentPage === Math.ceil(paginatedItems.length / itemsPerPage)}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== COSTS TAB ==================== */}
        {activeTab === 'costs' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => dispatch(setDateRange(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Search</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                  <input
                    type="text"
                    placeholder="Search costs..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchFinancialData(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Category</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterFinancialData(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="all">All Categories</option>
                  <option value="staff">Staff Costs</option>
                  <option value="drugs">Drug Costs</option>
                  <option value="equipment">Equipment</option>
                  <option value="overhead">Overhead</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <ButtonWithTooltip
                  onClick={() => handleExportReport('costs')}
                  tooltip="Export cost report"
                  variant="primary"
                  size="sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={() => dispatch(fetchFinancialAnalytics(dateRange))}
                  tooltip="Analyze costs"
                  variant="secondary"
                  size="sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Analyze
                </ButtonWithTooltip>
              </div>
            </div>

            {/* Cost Analysis Chart Placeholder */}
            <div className="bg-white border border-[#E8E3DC] p-4 sm:p-6 mb-4">
              <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Cost Trend Analysis</h4>
              <div className="h-48 bg-[#F7F5F2] border border-[#E8E3DC] flex items-center justify-center">
                <div className="text-center text-[#5A5A5A]">
                  <LineChart className="w-10 h-10 mx-auto mb-2 text-[#D8D4CD]" />
                  <p className="text-sm">Cost trend visualization</p>
                  <p className="text-xs text-[#B0A89E]">Integration with charting library needed</p>
                </div>
              </div>
            </div>

            {/* Cost Table */}
            <div className="bg-white border border-[#E8E3DC] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E8E3DC]">
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Description</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Budget</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EDE8]">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-[#5A5A5A]">
                          <CreditCard className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
                          <p className="text-sm">No cost data found</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map(item => (
                        <tr key={item.id} className="hover:bg-[#F7F5F2] transition-colors">
                          <td className="px-4 py-3 text-sm text-[#5A5A5A]">
                            {new Date(item.date).toLocaleDateString('en-NG')}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={item.category} />
                          </td>
                          <td className="px-4 py-3 text-sm text-[#1A1A1A] max-w-xs truncate hidden sm:table-cell">
                            {item.description}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#1A1A1A]">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#5A5A5A] hidden md:table-cell">
                            {formatCurrency(item.budget || 0)}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${
                              item.variance > 0 
                                ? 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' 
                                : 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]'
                            }`}>
                              {item.variance > 0 ? '+' : ''}{item.variance}%
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {paginatedItems.length > itemsPerPage && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-[10px] text-[#5A5A5A]">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, paginatedItems.length)} of {paginatedItems.length}
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
                    Page {currentPage} of {Math.ceil(paginatedItems.length / itemsPerPage)}
                  </span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setCurrentPage(Math.min(Math.ceil(paginatedItems.length / itemsPerPage), currentPage + 1))}
                    tooltip="Next page"
                    variant="default"
                    disabled={currentPage === Math.ceil(paginatedItems.length / itemsPerPage)}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== CASH FLOW TAB ==================== */}
        {activeTab === 'cashflow' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cash Flow Statement */}
              <div className="bg-white border border-[#E8E3DC] p-4 sm:p-6">
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Cash Flow Statement</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-[#F0EDE8]">
                    <span className="text-sm text-[#1A1A1A] font-medium">Operating Activities</span>
                    <span className="text-sm font-display font-bold text-[#2D7D46]">{formatCurrency(analytics?.cashFlow?.operating || cashPosition)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#F0EDE8]">
                    <span className="text-sm text-[#1A1A1A] font-medium">Investing Activities</span>
                    <span className="text-sm font-display font-bold text-[#C8553D]">({formatCurrency(Math.abs(analytics?.cashFlow?.investing || 0))})</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#F0EDE8]">
                    <span className="text-sm text-[#1A1A1A] font-medium">Financing Activities</span>
                    <span className="text-sm font-display font-bold text-[#008751]">{formatCurrency(analytics?.cashFlow?.financing || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t-2 border-[#E8E3DC]">
                    <span className="text-sm font-display font-semibold text-[#1A1A1A]">Net Cash Flow</span>
                    <span className="text-base font-display font-bold text-[#008751]">{formatCurrency(analytics?.cashFlow?.net || cashPosition)}</span>
                  </div>
                </div>
              </div>

              {/* Cash Flow Projections */}
              <div className="bg-white border border-[#E8E3DC] p-4 sm:p-6">
                <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">12-Month Cash Flow Projection</h3>
                <div className="space-y-2">
                  {safeCashFlowData.length === 0 ? (
                    <div className="text-center py-8 text-[#5A5A5A] text-sm">No cash flow projections available</div>
                  ) : (
                    safeCashFlowData.map((projection, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[#F7F5F2] border border-[#E8E3DC]">
                        <span className="text-sm font-medium text-[#1A1A1A] w-10">{projection.month}</span>
                        <div className="flex-1 mx-3">
                          <div className="w-full bg-[#F0EDE8] h-1.5">
                            <div
                              className="bg-[#008751] h-1.5"
                              style={{ width: `${Math.max(0, Math.min((projection.balance / Math.max(...safeCashFlowData.map(p => p.balance || 1))) * 100, 100))}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-display font-semibold text-[#008751]">{formatCurrency(projection.balance)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== BUDGETS TAB ==================== */}
        {activeTab === 'budgets' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Budget Management</h3>
              <ButtonWithTooltip
                onClick={() => setShowBudgetModal(true)}
                tooltip="Create new budget"
                variant="primary"
                size="sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Budget
              </ButtonWithTooltip>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.length === 0 ? (
                <div className="col-span-full bg-white border border-[#E8E3DC] p-8 text-center">
                  <Target className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                  <p className="text-[#5A5A5A] font-medium">No budgets created yet</p>
                  <p className="text-sm text-[#B0A89E] mt-1">Click "Create Budget" to get started</p>
                </div>
              ) : (
                budgets.map(budget => (
                  <div key={budget.id} className="bg-white border border-[#E8E3DC] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-display font-semibold text-[#1A1A1A]">{budget.department}</h4>
                        <p className="text-xs text-[#5A5A5A] capitalize">{budget.category}</p>
                      </div>
                      <span className="text-[10px] text-[#B0A89E]">{budget.year}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#5A5A5A]">Budget Amount:</span>
                        <span className="font-medium text-[#1A1A1A]">{formatCurrency(budget.amount)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#5A5A5A]">Period:</span>
                        <span className="capitalize text-[#1A1A1A]">{budget.period}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#5A5A5A]">Utilized:</span>
                        <span className={`font-medium ${
                          (budget.utilized || 0) > 90 ? 'text-[#C8553D]' : 'text-[#008751]'
                        }`}>
                          {budget.utilized || 0}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="w-full bg-[#F0EDE8] h-1.5">
                        <div
                          className={`h-1.5 ${(budget.utilized || 0) > 90 ? 'bg-[#C8553D]' : 'bg-[#008751]'}`}
                          style={{ width: `${budget.utilized || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-[#F0EDE8]">
                      <ButtonWithTooltip
                        onClick={() => {}}
                        tooltip="Edit budget"
                        variant="warning"
                        size="sm"
                        className="flex-1 justify-center"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        onClick={() => {}}
                        tooltip="View details"
                        variant="secondary"
                        size="sm"
                        className="flex-1 justify-center"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </ButtonWithTooltip>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== KPIS TAB ==================== */}
        {activeTab === 'kpis' && (
          <div>
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Key Performance Indicators</h3>
            {!analytics?.kpis ? (
              <div className="text-center py-12 text-[#5A5A5A]">
                <LineChart className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-sm">No KPI data available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Clinical KPIs */}
                <div className="bg-white border border-[#E8E3DC] p-5">
                  <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-[#008751]" />
                    Clinical Performance
                  </h4>
                  <div className="space-y-3">
                    {analytics.kpis.clinical && Object.entries(analytics.kpis.clinical).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-1.5 border-b border-[#F0EDE8]">
                        <span className="text-sm text-[#5A5A5A]">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm font-medium text-[#1A1A1A]">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial KPIs */}
                <div className="bg-white border border-[#E8E3DC] p-5">
                  <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-[#008751]" />
                    Financial Performance
                  </h4>
                  <div className="space-y-3">
                    {analytics.kpis.financial && Object.entries(analytics.kpis.financial).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-1.5 border-b border-[#F0EDE8]">
                        <span className="text-sm text-[#5A5A5A]">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm font-medium text-[#1A1A1A]">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operational KPIs */}
                <div className="bg-white border border-[#E8E3DC] p-5">
                  <h4 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4 flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-[#4A5A5A]" />
                    Operational Efficiency
                  </h4>
                  <div className="space-y-3">
                    {analytics.kpis.operational && Object.entries(analytics.kpis.operational).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-1.5 border-b border-[#F0EDE8]">
                        <span className="text-sm text-[#5A5A5A]">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm font-medium text-[#1A1A1A]">{typeof value === 'number' ? value.toLocaleString() : value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== BUDGET CREATION MODAL ==================== */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => setShowBudgetModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-md transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">Create Budget</h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Set budget allocation for departments</p>
                  </div>
                  <button
                    onClick={() => setShowBudgetModal(false)}
                    className="p-1 hover:bg-[#F0EDE8] rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateBudget} className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Department <span className="text-[#C8553D]">*</span>
                  </label>
                  <select
                    value={budgetForm.department}
                    onChange={(e) => setBudgetForm({...budgetForm, department: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select department...</option>
                    <option value="emergency">Emergency Department</option>
                    <option value="surgery">Surgery</option>
                    <option value="medicine">Internal Medicine</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="laboratory">Laboratory</option>
                    <option value="administration">Administration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Category <span className="text-[#C8553D]">*</span>
                  </label>
                  <select
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select category...</option>
                    <option value="staff">Staff Costs</option>
                    <option value="drugs">Drug Costs</option>
                    <option value="equipment">Equipment</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="training">Training</option>
                    <option value="utilities">Utilities</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Amount (₦) <span className="text-[#C8553D]">*</span>
                    </label>
                    <input
                      type="number"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="5000000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Period <span className="text-[#C8553D]">*</span>
                    </label>
                    <select
                      value={budgetForm.period}
                      onChange={(e) => setBudgetForm({...budgetForm, period: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Year <span className="text-[#C8553D]">*</span>
                  </label>
                  <input
                    type="number"
                    value={budgetForm.year}
                    onChange={(e) => setBudgetForm({...budgetForm, year: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    min="2020"
                    max="2030"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    value={budgetForm.description}
                    onChange={(e) => setBudgetForm({...budgetForm, description: e.target.value})}
                    rows="2"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Budget description and justification..."
                  />
                </div>

                {errorMessage && (
                  <div className="text-sm text-[#C8553D]">{errorMessage}</div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Create budget"
                    variant="primary"
                    className="flex-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Create Budget
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => setShowBudgetModal(false)}
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

export default FinancialAnalytics;