import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import {  DollarSign,Search,  TrendingUp,Download,

  TrendingDown,  Target,  AlertTriangle,  CheckCircle,
  AlertCircle,  Eye,  ChevronLeft,  ChevronRight,
  X,  ArrowUp,  ArrowDown,  BarChart3,  FileText,  Award,
  RefreshCw,  Plus, Edit, Check} from 'lucide-react';
import {  fetchBudgets,  fetchForecasts,
  fetchGrants,  fetchVariances,  fetchBudgetSummary,  createBudget,
  createForecast,  createGrant,  clearError, fetchReports} from '../features/budgetSlice';

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
    blue: 'bg-[#2563EB]',
    purple: 'bg-[#7C3AED]',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-[#E8E3DC] p-2.5 sm:p-3 lg:p-4 min-h-[118px] sm:min-h-[136px] lg:min-h-[150px] ${onClick ? 'cursor-pointer hover:border-[#008751] transition-colors' : ''} ${className}`}
    >
      <div className="flex items-start justify-between gap-2 min-w-0 h-full">
        <div className="flex-1 min-w-0 overflow-hidden">
          <p className="text-[7.5px] sm:text-[9px] lg:text-[10px] font-medium text-[#5A5A5A] uppercase tracking-[0.12em]">{title}</p>
          <p className="mt-1 text-sm sm:text-base lg:text-xl xl:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight leading-none break-words">
            {value}
          </p>
          {subValue && (
            <p className="text-[9px] sm:text-[10px] lg:text-xs text-[#5A5A5A] mt-1 break-words leading-tight">{subValue}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-1 text-[8px] sm:text-[9px] lg:text-[10px] ${trendColors[trend]} font-medium min-w-0`}>
              {trend === 'up' && <ArrowUp className="w-2.5 h-2.5 mr-0.5 flex-shrink-0" />}
              {trend === 'down' && <ArrowDown className="w-2.5 h-2.5 mr-0.5 flex-shrink-0" />}
              <span className="break-words leading-tight">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${colorMap[color]} rounded flex items-center justify-center flex-shrink-0 self-start`}>
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

// ==================== STATUS BADGE ====================
const StatusBadge = ({ status }) => {
  const statusMap = {
    'approved': { label: 'Approved', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'rejected': { label: 'Rejected', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'draft': { label: 'Draft', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
    'active': { label: 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'on_track': { label: 'On Track', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
  };
  const statusConfig = statusMap[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };
  
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${statusConfig.color}`}>
      {statusConfig.label}
    </span>
  );
};

// ==================== VARIANCE INDICATOR ====================
const VarianceIndicator = ({ variance }) => {
  const getVariantColor = (v) => {
    if (v > 5) return 'text-[#C8553D]';
    if (v > 0) return 'text-[#C87D3D]';
    if (v > -5) return 'text-[#2D7D46]';
    return 'text-[#008751]';
  };

  return (
    <span className={`text-xs font-medium ${getVariantColor(variance)}`}>
      {variance > 0 ? '+' : ''}{variance}%
    </span>
  );
};

// ==================== BUDGET PROGRESS BAR ====================
const BudgetProgressBar = ({ utilized, total, label }) => {
  const percentage = total > 0 ? Math.min((utilized / total) * 100, 100) : 0;
  
  const getBarColor = () => {
    if (percentage > 90) return 'bg-[#C8553D]';
    if (percentage > 75) return 'bg-[#C87D3D]';
    return 'bg-[#008751]';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-[#5A5A5A] mb-1">
        <span>{label || 'Utilization'}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-[#F0EDE8] rounded-full h-1.5">
        <div
          className={`${getBarColor()} h-1.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const BudgetingForecasting = () => {
  const dispatch = useDispatch();
  const {
    budgets = [],
    forecasts = [],
    grants = [],
    variances = [],
    reports = [],
    budgetSummary = null,
    loading = false
  } = useSelector(state => state.budget || {});

  useEffect(() => {
    dispatch(fetchBudgetSummary());
    dispatch(fetchBudgets());
    dispatch(fetchForecasts());
    dispatch(fetchGrants());
    dispatch(fetchVariances());
    dispatch(fetchReports());
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState('budgets');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const itemsPerPage = 10;

  const [budgetForm, setBudgetForm] = useState({
    department: '',
    category: '',
    year: new Date().getFullYear(),
    period: 'annual',
    amount: '',
    description: '',
    approvalRequired: false,
    approvedBy: ''
  });

  const [forecastForm, setForecastForm] = useState({
    category: '',
    period: 'quarterly',
    year: new Date().getFullYear(),
    predictedAmount: '',
    confidenceLevel: '',
    assumptions: '',
    methodology: ''
  });

  const [grantForm, setGrantForm] = useState({
    name: '',
    donor: '',
    amount: '',
    startDate: '',
    endDate: '',
    purpose: '',
    conditions: '',
    contactPerson: '',
    reportingFrequency: 'quarterly'
  });

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'medicine', label: 'Internal Medicine' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'administration', label: 'Administration' },
  ];

  const categoryOptions = [
    { value: '', label: 'Select category...' },
    { value: 'staff', label: 'Staff Costs' },
    { value: 'drugs', label: 'Drug Costs' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'training', label: 'Training' },
    { value: 'utilities', label: 'Utilities' },
  ];

  const forecastCategoryOptions = [
    { value: '', label: 'Select category...' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'expenses', label: 'Expenses' },
    { value: 'patient_volume', label: 'Patient Volume' },
    { value: 'staff_costs', label: 'Staff Costs' },
    { value: 'drug_costs', label: 'Drug Costs' },
  ];

  // Tabs configuration
  const tabs = [
    { id: 'budgets', label: 'Budget Management', icon: DollarSign },
    { id: 'forecasting', label: 'Financial Forecasting', icon: TrendingUp },
    { id: 'grants', label: 'Grants & Donors', icon: Award },
    { id: 'monitoring', label: 'Budget Monitoring', icon: BarChart3 },
    { id: 'reports', label: 'Reports & Analytics', icon: FileText }
  ];

  // Filter and search logic
  const filteredBudgets = budgets
    .filter(budget => {
      const matchesSearch = !searchQuery ||
        budget.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        budget.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        budget.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedDepartment === 'all' || budget.department?.toLowerCase() === selectedDepartment;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => (b.year || 0) - (a.year || 0) || (a.department || '').localeCompare(b.department || ''));

  const filteredForecasts = forecasts
    .filter(forecast => {
      const matchesSearch = !searchQuery ||
        forecast.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        forecast.assumptions?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => (b.year || 0) - (a.year || 0) || (a.category || '').localeCompare(b.category || ''));

  const paginatedItems = activeTab === 'budgets' ? filteredBudgets : 
                         activeTab === 'forecasting' ? filteredForecasts : [];
  const totalPages = Math.ceil(paginatedItems.length / itemsPerPage);
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const departmentOverview = useMemo(() => {
    const grouped = budgets.reduce((acc, budget) => {
      const departmentName = budget.department || 'Unassigned';
      if (!acc[departmentName]) {
        acc[departmentName] = { budget: 0, utilized: 0 };
      }
      acc[departmentName].budget += Number(budget.amount || 0);
      acc[departmentName].utilized += Number(budget.utilized || 0);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, data]) => ({
        name,
        budget: Number(data.budget || 0),
        utilized: Number(data.utilized || 0),
        variance: data.budget > 0 ? (((data.utilized - data.budget) / data.budget) * 100) : 0,
      }))
      .sort((a, b) => b.budget - a.budget);
  }, [budgets]);

  const categoryOverview = useMemo(() => {
    const grouped = budgets.reduce((acc, budget) => {
      const categoryName = budget.category || 'General';
      if (!acc[categoryName]) {
        acc[categoryName] = { budget: 0, utilized: 0 };
      }
      acc[categoryName].budget += Number(budget.amount || 0);
      acc[categoryName].utilized += Number(budget.utilized || 0);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, data]) => ({
        name,
        budget: Number(data.budget || 0),
        utilized: Number(data.utilized || 0),
        variance: data.budget > 0 ? (((data.utilized - data.budget) / data.budget) * 100) : 0,
      }))
      .sort((a, b) => b.budget - a.budget);
  }, [budgets]);

  const forecastOverview = useMemo(() => {
    const grouped = forecasts.reduce((acc, forecast) => {
      const key = forecast.category || 'General';
      if (!acc[key]) {
        acc[key] = { total: 0, confidence: 0, count: 0 };
      }
      acc[key].total += Number(forecast.predictedAmount || forecast.actualAmount || 0);
      acc[key].confidence += Number(forecast.confidenceLevel || forecast.accuracy || 0);
      acc[key].count += 1;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, data]) => ({
        label: name.replace(/_/g, ' '),
        value: Number(data.total || 0),
        confidence: data.count ? Math.round(data.confidence / data.count) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [forecasts]);

  const varianceAlerts = useMemo(() => {
    const alerts = variances
      .filter((item) => Number(item.variancePercentage || 0) !== 0)
      .sort((a, b) => Math.abs(Number(b.variancePercentage || 0)) - Math.abs(Number(a.variancePercentage || 0)))
      .slice(0, 3)
      .map((item) => ({
        message: `${item.budgetName || 'Budget'} ${Number(item.variancePercentage || 0) >= 0 ? 'is ahead of' : 'is behind'} plan by ${Math.abs(Number(item.variancePercentage || 0)).toFixed(1)}%`,
        priority: Math.abs(Number(item.variancePercentage || 0)) > 10 ? 'High Priority' : Math.abs(Number(item.variancePercentage || 0)) > 5 ? 'Medium Priority' : 'On Track',
      }));

    if (alerts.length === 0) {
      return [{ message: 'No active variance alerts. All tracked budgets are within tolerance.', priority: 'On Track' }];
    }

    return alerts;
  }, [variances]);

  const totalBudget = Number(budgetSummary?.total_budget ?? budgets.reduce((sum, item) => sum + Number(item.amount || 0), 0));
  const totalUtilized = Number(budgetSummary?.total_utilized ?? budgets.reduce((sum, item) => sum + Number(item.utilized || 0), 0));
  const utilizationRate = Number(budgetSummary?.utilization_rate ?? (totalBudget > 0 ? (totalUtilized / totalBudget) * 100 : 0));
  const remainingBudget = Math.max(totalBudget - totalUtilized, 0);
  const criticalBudgets = departmentOverview.filter((dept) => dept.variance > 5 || dept.variance < -5).length;

  const reportOptions = useMemo(() => {
    const base = [
      { label: 'Annual Budget Report', desc: 'Budget allocation and utilization summary', color: 'blue' },
      { label: 'Variance Analysis Report', desc: 'Budget variance and exceptions', color: 'green' },
      { label: 'Forecast Accuracy Report', desc: 'Forecast vs. actual performance', color: 'purple' },
      { label: 'Grant Utilization Report', desc: 'Donor funding and spend tracking', color: 'orange' },
    ];

    if (!reports.length) return base;

    return reports.slice(0, 4).map((report, index) => ({
      label: report.title || report.reportType || base[index]?.label || 'Report',
      desc: report.summary || base[index]?.desc || 'Generated from the latest budget records',
      color: base[index]?.color || 'blue',
    }));
  }, [reports]);

  const kpiMetrics = useMemo(() => [
    { label: 'Budget Utilization Rate', value: `${Math.round(utilizationRate)}%`, color: 'text-[#2D7D46]' },
    { label: 'Variance Threshold', value: '±5%', color: 'text-[#008751]' },
    { label: 'Forecast Accuracy', value: forecastOverview.length ? `${Math.round(forecastOverview.reduce((sum, item) => sum + item.confidence, 0) / forecastOverview.length)}%` : '0%', color: 'text-[#7C3AED]' },
    { label: 'Grant Utilization', value: grants.length ? `${Math.round((grants.reduce((sum, grant) => sum + Number(grant.utilized || 0), 0) / Math.max(grants.reduce((sum, grant) => sum + Number(grant.amount || 0), 0), 1)) * 100)}%` : '0%', color: 'text-[#C87D3D]' },
    { label: 'Cost Control Index', value: `${Math.max(0, 100 - Math.abs(criticalBudgets) * 4)}%`, color: 'text-[#C8553D]' },
  ], [utilizationRate, forecastOverview, grants, criticalBudgets]);

  const handleCreateBudget = (e) => {
    e.preventDefault();
    dispatch(createBudget(budgetForm));
    setBudgetForm({
      department: '',
      category: '',
      year: new Date().getFullYear(),
      period: 'annual',
      amount: '',
      description: '',
      approvalRequired: false,
      approvedBy: ''
    });
    setShowBudgetModal(false);
  };

  const handleCreateForecast = (e) => {
    e.preventDefault();
    dispatch(createForecast(forecastForm));
    setForecastForm({
      category: '',
      period: 'quarterly',
      year: new Date().getFullYear(),
      predictedAmount: '',
      confidenceLevel: '',
      assumptions: '',
      methodology: ''
    });
    setShowForecastModal(false);
  };

  const handleCreateGrant = (e) => {
    e.preventDefault();
    dispatch(createGrant(grantForm));
    setGrantForm({
      name: '',
      donor: '',
      amount: '',
      startDate: '',
      endDate: '',
      purpose: '',
      conditions: '',
      contactPerson: '',
      reportingFrequency: 'quarterly'
    });
    setShowGrantModal(false);
  };

  const formatCurrency = (amount) => {
    if (amount == null) return '₦0';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactCurrency = (amount) => {
    if (amount == null) return '₦0';
    const abs = Math.abs(amount);

    if (abs >= 1_000_000) {
      return `₦${(amount / 1_000_000).toFixed(abs >= 10_000_000 ? 1 : 2).replace(/\.0+$|(?<=\.\d)0+$/g, '')}M`;
    }

    if (abs >= 1_000) {
      return `₦${(amount / 1_000).toFixed(abs >= 10_000 ? 1 : 2).replace(/\.0+$|(?<=\.\d)0+$/g, '')}K`;
    }

    return `₦${Number(amount).toLocaleString('en-NG')}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // ==================== RENDER BUDGETS TAB ====================
  const renderBudgetsTab = () => (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 lg:mb-5">
        <div className="flex-1 min-w-[180px]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A89E]" />
            <input
              type="text"
              placeholder="Search budgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
          >
            {departmentOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <ButtonWithTooltip
            onClick={() => setShowBudgetModal(true)}
            tooltip="Create new budget"
            variant="primary"
            size="sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Budget
          </ButtonWithTooltip>
          <ButtonWithTooltip
            onClick={() => {
              setSearchQuery('');
              setSelectedDepartment('all');
            }}
            tooltip="Reset filters"
            variant="secondary"
            size="sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </ButtonWithTooltip>
        </div>
      </div>

      {/* Department Budget Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6">
        {departmentOverview.map((dept) => {
          return (
            <div key={dept.name} className="bg-white border border-[#E8E3DC] p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-[#1A1A1A]">{dept.name}</h4>
                <VarianceIndicator variance={Number(dept.variance || 0)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5A5A5A]">Budget:</span>
                  <span className="font-medium text-[#1A1A1A]">{formatCurrency(dept.budget)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#5A5A5A]">Utilized:</span>
                  <span className="font-medium text-[#1A1A1A]">{formatCurrency(dept.utilized)}</span>
                </div>
              </div>
              <BudgetProgressBar 
                utilized={dept.utilized} 
                total={dept.budget} 
                label={`${dept.budget > 0 ? Math.round((dept.utilized / dept.budget) * 100) : 0}% utilized`}
              />
            </div>
          );
        })}
      </div>

      {/* Budget Table */}
      <div className="overflow-x-auto border border-[#E8E3DC]">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-[#008751] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#5A5A5A] text-sm mt-2">Loading budgets...</p>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-[#D8D4CD] mx-auto mb-2" />
            <p className="text-[#5A5A5A] text-sm">No budgets found</p>
            <p className="text-xs text-[#B0A89E] mt-1">Create your first budget to get started</p>
          </div>
        ) : (
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#E8E3DC] bg-[#F7F5F2]">
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Year</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EDE8]">
              {paginatedData.map((budget, index) => (
                <tr key={budget.id || index} className="hover:bg-[#F7F5F2] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[#1A1A1A]">{budget.department || 'N/A'}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#5A5A5A] hidden sm:table-cell capitalize">
                    {budget.category?.replace(/_/g, ' ') || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#5A5A5A] hidden md:table-cell">
                    {budget.year || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-[#1A1A1A] whitespace-nowrap">
                    {formatCurrency(budget.amount)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <StatusBadge status={budget.status || 'draft'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <IconButton
                        icon={Eye}
                        onClick={() => {}}
                        tooltip="View details"
                        variant="primary"
                        size="sm"
                      />
                      <IconButton
                        icon={Edit}
                        onClick={() => {}}
                        tooltip="Edit budget"
                        variant="warning"
                        size="sm"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {paginatedItems.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#E8E3DC] gap-2 sm:gap-0">
          <div className="text-[10px] sm:text-xs text-[#5A5A5A] text-center sm:text-left">
            Showing {paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, paginatedItems.length)} of {paginatedItems.length}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <IconButton
              icon={ChevronLeft}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              tooltip="Previous page"
              variant="default"
              disabled={currentPage === 1}
              size="sm"
            />
            <span className="text-[10px] sm:text-xs text-[#5A5A5A]">
              Page {currentPage} of {totalPages || 1}
            </span>
            <IconButton
              icon={ChevronRight}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              tooltip="Next page"
              variant="default"
              disabled={currentPage === totalPages}
              size="sm"
            />
          </div>
        </div>
      )}
    </div>
  );

  // ==================== RENDER FORECASTING TAB ====================
  const renderForecastingTab = () => (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 lg:mb-5">
        <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Financial Forecasting</h3>
        <ButtonWithTooltip
          onClick={() => setShowForecastModal(true)}
          tooltip="Create new forecast"
          variant="primary"
          size="sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Forecast
        </ButtonWithTooltip>
      </div>

      {/* Forecast Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {forecastOverview.length === 0 ? (
          <div className="lg:col-span-2 bg-white border border-[#E8E3DC] p-6 text-center text-sm text-[#5A5A5A]">
            No forecast data has been entered yet.
          </div>
        ) : (
          forecastOverview.slice(0, 2).map((item, index) => (
            <div key={`${item.label}-${index}`} className="bg-white border border-[#E8E3DC] p-4 lg:p-5">
              <h4 className="text-sm font-medium text-[#1A1A1A] mb-4 flex items-center">
                {index % 2 === 0 ? <TrendingUp className="w-4 h-4 mr-2 text-[#2D7D46]" /> : <TrendingDown className="w-4 h-4 mr-2 text-[#C8553D]" />}
                {item.label.charAt(0).toUpperCase() + item.label.slice(1)} forecast {new Date().getFullYear()}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-[#F7F5F2] border border-[#F0EDE8]">
                  <span className="text-xs text-[#5A5A5A]">Projected amount</span>
                  <span className="text-sm font-medium text-[#1A1A1A]">{formatCurrency(item.value)}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-[#EAF3EE] border border-[#D0E3D8]">
                  <span className="text-xs font-medium text-[#2D7D46]">Annual total</span>
                  <span className="text-sm font-bold text-[#1A1A1A]">{formatCurrency(item.value)}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span>Confidence: <span className="text-[#008751] font-medium">{item.confidence}%</span></span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Forecast Assumptions */}
      <div className="bg-white border border-[#E8E3DC] p-4 lg:p-5">
        <h4 className="text-sm font-medium text-[#1A1A1A] mb-3">Forecast Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs font-medium text-[#5A5A5A] mb-2">Live forecast categories</h5>
            <ul className="text-xs text-[#5A5A5A] space-y-1.5">
              {forecastOverview.length > 0 ? forecastOverview.slice(0, 4).map((item) => (
                <li key={item.label} className="flex items-start gap-2">
                  <span className="text-[#008751] mt-0.5">•</span>
                  <span>{item.label}: {formatCurrency(item.value)}</span>
                </li>
              )) : <li className="text-[#5A5A5A]">No forecast entries available yet.</li>}
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-medium text-[#5A5A5A] mb-2">Data quality</h5>
            <ul className="text-xs text-[#5A5A5A] space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#008751] mt-0.5">•</span>
                <span>Forecast entries: {forecasts.length}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#008751] mt-0.5">•</span>
                <span>Budget entries: {budgets.length}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#008751] mt-0.5">•</span>
                <span>Variance checks: {variances.length}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#008751] mt-0.5">•</span>
                <span>Grant records: {grants.length}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== RENDER GRANTS TAB ====================
  const renderGrantsTab = () => (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 lg:mb-5">
        <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Grants & Donor Management</h3>
        <ButtonWithTooltip
          onClick={() => setShowGrantModal(true)}
          tooltip="Add new grant"
          variant="primary"
          size="sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Grant
        </ButtonWithTooltip>
      </div>

      {grants.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#E8E3DC]">
          <Award className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
          <p className="text-[#5A5A5A] text-sm">No grants registered</p>
          <p className="text-xs text-[#B0A89E] mt-1">Add your first grant to start tracking donor funds</p>
        </div>
      ) : (
        <div className="space-y-3">
          {grants.map((grant, index) => (
            <div key={grant.id || index} className="bg-white border border-[#E8E3DC] p-4 lg:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-sm font-medium text-[#1A1A1A]">{grant.name || 'Unnamed Grant'}</h4>
                  <p className="text-xs text-[#5A5A5A]">Donor: {grant.donor || 'Unknown'}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={grant.status || 'active'} />
                  <span className="text-sm font-medium text-[#1A1A1A]">{formatCurrency(grant.amount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">Amount</p>
                  <p className="text-sm font-medium text-[#1A1A1A]">{formatCurrency(grant.amount)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">Start</p>
                  <p className="text-sm text-[#1A1A1A]">{formatDate(grant.startDate)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">End</p>
                  <p className="text-sm text-[#1A1A1A]">{formatDate(grant.endDate)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">Utilized</p>
                  <p className="text-sm font-medium text-[#1A1A1A]">{grant.utilized || 0}%</p>
                </div>
              </div>

              {grant.purpose && (
                <div className="mb-3">
                  <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider font-medium">Purpose</p>
                  <p className="text-sm text-[#5A5A5A]">{grant.purpose}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-3 border-t border-[#F0EDE8]">
                <ButtonWithTooltip
                  onClick={() => {}}
                  tooltip="Update progress"
                  variant="primary"
                  size="sm"
                >
                  Update Progress
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={() => {}}
                  tooltip="Generate report"
                  variant="secondary"
                  size="sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Report
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={() => {}}
                  tooltip="View details"
                  variant="secondary"
                  size="sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </ButtonWithTooltip>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ==================== RENDER MONITORING TAB ====================
  const renderMonitoringTab = () => (
    <div>
      <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Budget Variance Monitoring</h3>

      {/* Variance Alerts */}
      <div className="bg-[#F5F0EA] border border-[#F0E8DC] p-4 mb-6">
        <h4 className="text-sm font-medium text-[#C87D3D] mb-3 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Budget Variance Alerts
        </h4>
        <div className="space-y-2">
          {varianceAlerts.map((alert, index) => (
            <div key={`${alert.message}-${index}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-[#E8E3DC] gap-2">
              <span className="text-sm text-[#1A1A1A]">{alert.message}</span>
              <span className={`px-2 py-0.5 text-xs font-medium border whitespace-nowrap ${
                alert.priority === 'High Priority'
                  ? 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]'
                  : alert.priority === 'Medium Priority'
                    ? 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]'
                    : 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]'
              }`}>{alert.priority}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category-wise Budget Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryOverview.map((category) => {
          return (
            <div key={category.name} className="bg-white border border-[#E8E3DC] p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-[#1A1A1A] capitalize">{category.name}</h4>
                <VarianceIndicator variance={Number(category.variance || 0)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5A5A5A]">Budget:</span>
                  <span className="font-medium text-[#1A1A1A]">{formatCurrency(category.budget)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#5A5A5A]">Utilized:</span>
                  <span className="font-medium text-[#1A1A1A]">{formatCurrency(category.utilized)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#5A5A5A]">Variance:</span>
                  <span className="font-medium">{formatCurrency(category.utilized - category.budget)}</span>
                </div>
              </div>
              <BudgetProgressBar 
                utilized={category.utilized} 
                total={category.budget} 
                label={`${category.budget > 0 ? Math.round((category.utilized / category.budget) * 100) : 0}% utilized`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  // ==================== RENDER REPORTS TAB ====================
  const renderReportsTab = () => (
    <div>
      <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Budget Reports & Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Report Generation */}
        <div className="bg-white border border-[#E8E3DC] p-4 lg:p-5">
          <h4 className="text-sm font-medium text-[#1A1A1A] mb-4">Generate Reports</h4>
          <div className="space-y-2">
            {reportOptions.map((report, idx) => {
              const colorClasses = {
                blue: 'hover:bg-[#E8F5EF] border-[#D0E3D8]',
                green: 'hover:bg-[#EAF3EE] border-[#D0E3D8]',
                purple: 'hover:bg-[#F0EDF8] border-[#E0D8E8]',
                orange: 'hover:bg-[#F5F0EA] border-[#F0E8DC]',
              };
              return (
                <button
                  key={idx}
                  className={`w-full p-3 bg-white border border-[#E8E3DC] text-left transition-colors ${colorClasses[report.color] || 'hover:bg-[#F7F5F2]'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{report.label}</p>
                      <p className="text-xs text-[#5A5A5A]">{report.desc}</p>
                    </div>
                    <Download className="w-4 h-4 text-[#5A5A5A] flex-shrink-0 ml-2" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget KPIs */}
        <div className="bg-white border border-[#E8E3DC] p-4 lg:p-5">
          <h4 className="text-sm font-medium text-[#1A1A1A] mb-4">Budget Performance KPIs</h4>
          <div className="space-y-3">
            {kpiMetrics.map((kpi, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-[#F0EDE8] last:border-0">
                <span className="text-xs text-[#5A5A5A]">{kpi.label}</span>
                <span className={`text-sm font-medium ${kpi.color}`}>{kpi.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className="budgeting-forecasting min-h-screen bg-[#F7F5F2] p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#008751] rounded flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight truncate">
                Budgeting & Forecasting
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A] truncate">
                Financial planning and budget management system
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap flex-shrink-0">
            <ButtonWithTooltip
              onClick={() => {
                setSearchQuery('');
                setSelectedDepartment('all');
                setCurrentPage(1);
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 lg:mb-6">
        <StatsCard
          title="Total Budget"
          value={formatCompactCurrency(totalBudget)}
          subValue={`${new Date().getFullYear()} Allocation`}
          icon={DollarSign}
          color="blue"
          trend="up"
          trendValue="+8.5% YoY"
          tooltip="Total annual budget allocation"
        />
        <StatsCard
          title="Utilized"
          value={formatCompactCurrency(totalUtilized)}
          subValue={`${utilizationRate}% utilized`}
          icon={CheckCircle}
          color="green"
          trend="up"
          trendValue={`${utilizationRate}% of budget`}
          tooltip="Total budget utilized"
        />
        <StatsCard
          title="Remaining"
          value={formatCompactCurrency(remainingBudget)}
          subValue={`${100 - utilizationRate}% remaining`}
          icon={Target}
          color="gold"
          trend="neutral"
          trendValue="On track"
          tooltip="Remaining budget"
        />
        <StatsCard
          title="Critical Variances"
          value={criticalBudgets}
          subValue={`${criticalBudgets} departments need attention`}
          icon={AlertCircle}
          color="terracotta"
          trend={criticalBudgets > 0 ? 'down' : 'neutral'}
          trendValue={criticalBudgets > 0 ? 'Requires attention' : 'All departments on track'}
          tooltip="Departments with significant budget variances"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#E8E3DC]">
        {/* Tab Navigation */}
        <div className="border-b border-[#E8E3DC] overflow-x-auto">
          <nav className="flex gap-1 sm:gap-2 p-1 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#008751] text-white'
                      : 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#F7F5F2]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-3 sm:p-4 lg:p-5">
          {activeTab === 'budgets' && renderBudgetsTab()}
          {activeTab === 'forecasting' && renderForecastingTab()}
          {activeTab === 'grants' && renderGrantsTab()}
          {activeTab === 'monitoring' && renderMonitoringTab()}
          {activeTab === 'reports' && renderReportsTab()}
        </div>
      </div>

      {/* ==================== BUDGET MODAL ==================== */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity" onClick={() => setShowBudgetModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-md transform transition-all duration-200 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E3DC] flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E8F5EF] flex items-center justify-center">
                    <DollarSign className="w-3.5 h-3.5 text-[#008751]" />
                  </div>
                  <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Create Budget</h3>
                </div>
                <button onClick={() => setShowBudgetModal(false)} className="p-1 rounded hover:bg-[#E8E3DC] transition-colors">
                  <X className="w-4 h-4 text-[#5A5A5A]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <form onSubmit={handleCreateBudget} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Department *</label>
                    <select
                      value={budgetForm.department}
                      onChange={(e) => setBudgetForm({...budgetForm, department: e.target.value})}
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select department...</option>
                      <option value="Emergency">Emergency Department</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Medicine">Internal Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Category *</label>
                    <select
                      value={budgetForm.category}
                      onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value})}
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    >
                      {categoryOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Year *</label>
                      <input
                        type="number"
                        value={budgetForm.year}
                        onChange={(e) => setBudgetForm({...budgetForm, year: parseInt(e.target.value)})}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        min="2020"
                        max="2030"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Period *</label>
                      <select
                        value={budgetForm.period}
                        onChange={(e) => setBudgetForm({...budgetForm, period: e.target.value})}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        required
                      >
                        <option value="annual">Annual</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Amount (₦) *</label>
                    <input
                      type="number"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="5000000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Description</label>
                    <textarea
                      value={budgetForm.description}
                      onChange={(e) => setBudgetForm({...budgetForm, description: e.target.value})}
                      rows="2"
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Budget purpose and justification..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#E8E3DC]">
                    <button
                      type="submit"
                      className="flex-1 bg-[#008751] text-white py-1.5 px-3 hover:bg-[#006B40] transition-colors font-medium text-xs flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Create Budget
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBudgetModal(false)}
                      className="flex-1 bg-[#F0EDE8] text-[#1A1A1A] py-1.5 px-3 hover:bg-[#E8E3DC] transition-colors font-medium text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== FORECAST MODAL ==================== */}
      {showForecastModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity" onClick={() => setShowForecastModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-md transform transition-all duration-200 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E3DC] flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E8F5EF] flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-[#008751]" />
                  </div>
                  <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Create Forecast</h3>
                </div>
                <button onClick={() => setShowForecastModal(false)} className="p-1 rounded hover:bg-[#E8E3DC] transition-colors">
                  <X className="w-4 h-4 text-[#5A5A5A]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <form onSubmit={handleCreateForecast} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Category *</label>
                    <select
                      value={forecastForm.category}
                      onChange={(e) => setForecastForm({...forecastForm, category: e.target.value})}
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      required
                    >
                      {forecastCategoryOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Period *</label>
                      <select
                        value={forecastForm.period}
                        onChange={(e) => setForecastForm({...forecastForm, period: e.target.value})}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        required
                      >
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Year *</label>
                      <input
                        type="number"
                        value={forecastForm.year}
                        onChange={(e) => setForecastForm({...forecastForm, year: parseInt(e.target.value)})}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        min="2024"
                        max="2030"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Predicted Amount (₦) *</label>
                    <input
                      type="number"
                      value={forecastForm.predictedAmount}
                      onChange={(e) => setForecastForm({...forecastForm, predictedAmount: e.target.value})}
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="10000000"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Confidence Level (%)</label>
                    <input
                      type="number"
                      value={forecastForm.confidenceLevel}
                      onChange={(e) => setForecastForm({...forecastForm, confidenceLevel: e.target.value})}
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      min="0"
                      max="100"
                      placeholder="85"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Assumptions</label>
                    <textarea
                      value={forecastForm.assumptions}
                      onChange={(e) => setForecastForm({...forecastForm, assumptions: e.target.value})}
                      rows="2"
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Key assumptions for this forecast..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Methodology</label>
                    <textarea
                      value={forecastForm.methodology}
                      onChange={(e) => setForecastForm({...forecastForm, methodology: e.target.value})}
                      rows="2"
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Forecasting method used..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#E8E3DC]">
                    <button
                      type="submit"
                      className="flex-1 bg-[#008751] text-white py-1.5 px-3 hover:bg-[#006B40] transition-colors font-medium text-xs flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Create Forecast
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForecastModal(false)}
                      className="flex-1 bg-[#F0EDE8] text-[#1A1A1A] py-1.5 px-3 hover:bg-[#E8E3DC] transition-colors font-medium text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GRANT MODAL ==================== */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity" onClick={() => setShowGrantModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-lg transform transition-all duration-200 max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E8E3DC] flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#F0EDF8] flex items-center justify-center">
                    <Award className="w-3.5 h-3.5 text-[#7C3AED]" />
                  </div>
                  <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Add Grant/Donation</h3>
                </div>
                <button onClick={() => setShowGrantModal(false)} className="p-1 rounded hover:bg-[#E8E3DC] transition-colors">
                  <X className="w-4 h-4 text-[#5A5A5A]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <form onSubmit={handleCreateGrant} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Grant Name *</label>
                      <input
                        type="text"
                        value={grantForm.name}
                        onChange={(e) => setGrantForm({...grantForm, name: e.target.value})}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Donor/Organization *</label>
                      <input
                        type="text"
                        value={grantForm.donor}
                        onChange={(e) => setGrantForm({...grantForm, donor: e.target.value})}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Amount (₦) *</label>
                    <input
                      type="number"
                      value={grantForm.amount}
                      onChange={(e) => setGrantForm({...grantForm, amount: e.target.value})}
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="5000000"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Start Date *</label>
                      <input
                        type="date"
                        value={grantForm.startDate}
                        onChange={(e) => setGrantForm({...grantForm, startDate: e.target.value})}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">End Date *</label>
                      <input
                        type="date"
                        value={grantForm.endDate}
                        onChange={(e) => setGrantForm({...grantForm, endDate: e.target.value})}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Purpose *</label>
                    <textarea
                      value={grantForm.purpose}
                      onChange={(e) => setGrantForm({...grantForm, purpose: e.target.value})}
                      rows="2"
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Purpose and objectives of the grant..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Conditions & Requirements</label>
                    <textarea
                      value={grantForm.conditions}
                      onChange={(e) => setGrantForm({...grantForm, conditions: e.target.value})}
                      rows="2"
                      className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Specific conditions and reporting requirements..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Contact Person</label>
                      <input
                        type="text"
                        value={grantForm.contactPerson}
                        onChange={(e) => setGrantForm({...grantForm, contactPerson: e.target.value})}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#5A5A5A] mb-0.5">Reporting Frequency</label>
                      <select
                        value={grantForm.reportingFrequency}
                        onChange={(e) => setGrantForm({...grantForm, reportingFrequency: e.target.value})}
                        className="w-full px-2.5 py-1.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-[#E8E3DC]">
                    <button
                      type="submit"
                      className="flex-1 bg-[#7C3AED] text-white py-1.5 px-3 hover:bg-[#6D28D9] transition-colors font-medium text-xs flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Add Grant
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGrantModal(false)}
                      className="flex-1 bg-[#F0EDE8] text-[#1A1A1A] py-1.5 px-3 hover:bg-[#E8E3DC] transition-colors font-medium text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetingForecasting;