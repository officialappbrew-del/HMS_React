import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  FileText,
  Users,
  Award,
  AlertCircle
} from 'lucide-react';
import {
  createBudget,
  updateBudget,
  createForecast,
  updateForecast,
  createGrant,
  updateGrant,
  generateBudgetReport,
  monitorBudgetVariance,
  searchBudgets,
  filterBudgets
} from '../features/budgetSlice';
import Pagination from '../components/Pagination';

const BudgetingForecasting = () => {
  const dispatch = useDispatch();
  const {
    budgets,
    forecasts,
    grants,
    budgetVariance,
    searchTerm,
    filterBy,
    loading
  } = useSelector(state => state.budget);

  const [activeTab, setActiveTab] = useState('budgets');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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

  // Nigerian healthcare budget metrics
  const budgetMetrics = {
    overview: {
      totalBudget: 250000000, // ₦250M
      utilized: 187500000,   // ₦187.5M
      remaining: 62500000,   // ₦62.5M
      utilizationRate: 75,
      variance: 2.3 // %
    },
    departments: {
      emergency: { budget: 45000000, utilized: 38000000, variance: -2.1 },
      surgery: { budget: 65000000, utilized: 52000000, variance: 1.8 },
      medicine: { budget: 55000000, utilized: 48000000, variance: -3.2 },
      pediatrics: { budget: 35000000, utilized: 29000000, variance: 4.1 },
      pharmacy: { budget: 25000000, utilized: 21000000, variance: 2.7 },
      laboratory: { budget: 25000000, utilized: 24000000, variance: -1.5 }
    },
    categories: {
      staff: { budget: 125000000, utilized: 118000000, variance: -2.8 },
      drugs: { budget: 50000000, utilized: 48000000, variance: 1.2 },
      equipment: { budget: 35000000, utilized: 32000000, variance: -3.1 },
      maintenance: { budget: 25000000, utilized: 22000000, variance: 2.4 },
      training: { budget: 15000000, utilized: 12000000, variance: 5.2 },
      utilities: { budget: 20000000, utilized: 19500000, variance: -1.8 }
    }
  };

  // Forecast data
  const forecastData = {
    revenue: {
      current: 200000000,
      q1: 48000000,
      q2: 52000000,
      q3: 55000000,
      q4: 58000000,
      growth: 12.5,
      confidence: 85
    },
    expenses: {
      current: 180000000,
      q1: 43000000,
      q2: 46000000,
      q3: 48000000,
      q4: 49000000,
      growth: 8.2,
      confidence: 78
    }
  };

  // Filter and search logic
  const filteredBudgets = budgets
    .filter(budget => {
      const matchesSearch = !searchTerm ||
        budget.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || budget.status === filterBy || budget.department === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.year - a.year || a.department.localeCompare(b.department));

  const filteredForecasts = forecasts
    .filter(forecast => {
      const matchesSearch = !searchTerm ||
        forecast.category?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => b.year - a.year || a.category.localeCompare(b.category));

  const paginatedItems = activeTab === 'budgets' ? filteredBudgets : filteredForecasts;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getVarianceColor = (variance) => {
    if (variance > 5) return 'text-red-600';
    if (variance > 0) return 'text-yellow-600';
    if (variance > -5) return 'text-green-600';
    return 'text-blue-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBudget = budgetMetrics.overview.totalBudget;
  const totalUtilized = budgetMetrics.overview.utilized;
  const utilizationRate = budgetMetrics.overview.utilizationRate;
  const criticalBudgets = Object.values(budgetMetrics.departments).filter(d => d.variance > 5 || d.variance < -5).length;

  return (
    <div className="budgeting-forecasting p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Target className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-500" />
          Budgeting & Forecasting
        </h1>
        <p className="text-gray-600 mt-2">Financial planning and budget management system</p>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Budget</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalBudget)}</p>
              <div className="flex items-center mt-1">
                <Calendar className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-sm text-blue-600">2024 Allocation</span>
              </div>
            </div>
            <DollarSign className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Utilized</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalUtilized)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">{utilizationRate}% utilized</span>
              </div>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Remaining</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(budgetMetrics.overview.remaining)}</p>
              <div className="flex items-center mt-1">
                <Target className="w-4 h-4 text-yellow-600 mr-1" />
                <span className="text-sm text-yellow-600">25% remaining</span>
              </div>
            </div>
            <AlertTriangle className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Critical Variances</p>
              <p className="text-3xl font-bold mt-2">{criticalBudgets}</p>
              <div className="flex items-center mt-1">
                <AlertCircle className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">Need attention</span>
              </div>
            </div>
            <XCircle className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'budgets', label: 'Budget Management', icon: DollarSign },
            { id: 'forecasting', label: 'Financial Forecasting', icon: TrendingUp },
            { id: 'grants', label: 'Grants & Donors', icon: Award },
            { id: 'monitoring', label: 'Budget Monitoring', icon: BarChart3 },
            { id: 'reports', label: 'Reports & Analytics', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'budgets' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search budgets..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchBudgets(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterBudgets(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Departments</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Medicine">Internal Medicine</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowBudgetModal(true)}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Budget
                </button>
              </div>
            </div>

            {/* Department Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Object.entries(budgetMetrics.departments).map(([dept, data]) => (
                <div key={dept} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium capitalize">{dept.replace(/([A-Z])/g, ' $1')}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getVarianceColor(data.variance)}`}>
                      {data.variance > 0 ? '+' : ''}{data.variance}%
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">{formatCurrency(data.budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Utilized:</span>
                      <span className="font-medium">{formatCurrency(data.utilized)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining:</span>
                      <span className="font-medium">{formatCurrency(data.budget - data.utilized)}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(data.utilized / data.budget) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {Math.round((data.utilized / data.budget) * 100)}% utilized
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Budget Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(budget => (
                    <tr key={budget.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {budget.department}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {budget.category.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {budget.year}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(budget.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(budget.status)}`}>
                          {budget.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'forecasting' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Financial Forecasting</h3>
              <button
                onClick={() => setShowForecastModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Forecast
              </button>
            </div>

            {/* Forecast Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Revenue Forecast */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Revenue Forecast (2024)
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Q1 (Jan-Mar)</span>
                    <span className="font-medium">{formatCurrency(forecastData.revenue.q1)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Q2 (Apr-Jun)</span>
                    <span className="font-medium">{formatCurrency(forecastData.revenue.q2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Q3 (Jul-Sep)</span>
                    <span className="font-medium">{formatCurrency(forecastData.revenue.q3)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Q4 (Oct-Dec)</span>
                    <span className="font-medium">{formatCurrency(forecastData.revenue.q4)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                    <span className="text-sm font-medium">Annual Total</span>
                    <span className="font-bold">{formatCurrency(forecastData.revenue.current)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>Growth Rate: <span className="text-green-600 font-medium">{forecastData.revenue.growth}%</span></span>
                  <span>Confidence: <span className="text-blue-600 font-medium">{forecastData.revenue.confidence}%</span></span>
                </div>
              </div>

              {/* Expense Forecast */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
                  Expense Forecast (2024)
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Q1 (Jan-Mar)</span>
                    <span className="font-medium">{formatCurrency(forecastData.expenses.q1)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Q2 (Apr-Jun)</span>
                    <span className="font-medium">{formatCurrency(forecastData.expenses.q2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Q3 (Jul-Sep)</span>
                    <span className="font-medium">{formatCurrency(forecastData.expenses.q3)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Q4 (Oct-Dec)</span>
                    <span className="font-medium">{formatCurrency(forecastData.expenses.q4)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                    <span className="text-sm font-medium">Annual Total</span>
                    <span className="font-bold">{formatCurrency(forecastData.expenses.current)}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>Growth Rate: <span className="text-red-600 font-medium">{forecastData.expenses.growth}%</span></span>
                  <span>Confidence: <span className="text-blue-600 font-medium">{forecastData.expenses.confidence}%</span></span>
                </div>
              </div>
            </div>

            {/* Forecast Assumptions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium mb-4">Forecast Assumptions & Methodology</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium mb-3">Key Assumptions</h5>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Patient volume growth: 8-12% annually</li>
                    <li>• Inflation rate: 15-18% for medical supplies</li>
                    <li>• Staff cost increase: 10-15% annually</li>
                    <li>• Equipment maintenance: 5-8% of asset value</li>
                    <li>• Seasonal variations (Dec/Jan peak)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-3">Forecasting Methods</h5>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Historical trend analysis</li>
                    <li>• Regression modeling</li>
                    <li>• Seasonal adjustment factors</li>
                    <li>• Expert opinion integration</li>
                    <li>• Monte Carlo simulation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grants' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Grants & Donor Management</h3>
              <button
                onClick={() => setShowGrantModal(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Grant
              </button>
            </div>

            <div className="space-y-4">
              {grants.map(grant => (
                <div key={grant.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{grant.name}</h4>
                      <p className="text-sm text-gray-600">Donor: {grant.donor}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(grant.status)}`}>
                        {grant.status}
                      </span>
                      <span className="text-sm text-gray-600">{grant.amount}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="text-sm font-medium">{formatCurrency(grant.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="text-sm">{new Date(grant.startDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">End Date</p>
                      <p className="text-sm">{new Date(grant.endDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Utilized</p>
                      <p className="text-sm">{grant.utilized || 0}%</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Purpose</p>
                    <p className="text-sm">{grant.purpose}</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      Update Progress
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                      Generate Report
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {grants.length === 0 && (
                <p className="text-gray-500 text-center py-8">No grants registered yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Budget Variance Monitoring</h3>

            {/* Variance Alerts */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h4 className="font-medium mb-3 flex items-center text-yellow-800">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Budget Variance Alerts
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <span className="text-sm">Surgery department over budget by 4.1%</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">High Priority</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <span className="text-sm">Training budget underutilized by 5.2%</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Medium Priority</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <span className="text-sm">Equipment maintenance on track</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">On Track</span>
                </div>
              </div>
            </div>

            {/* Category-wise Budget Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(budgetMetrics.categories).map(([category, data]) => (
                <div key={category} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1')}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getVarianceColor(data.variance)}`}>
                      {data.variance > 0 ? '+' : ''}{data.variance}%
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">{formatCurrency(data.budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Utilized:</span>
                      <span className="font-medium">{formatCurrency(data.utilized)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Variance:</span>
                      <span className={`font-medium ${getVarianceColor(data.variance)}`}>
                        {formatCurrency(data.utilized - data.budget)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min((data.utilized / data.budget) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Budget Reports & Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report Generation */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4">Generate Reports</h4>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-800">Annual Budget Report</p>
                        <p className="text-sm text-blue-600">Complete budget analysis</p>
                      </div>
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                  </button>

                  <button className="w-full p-3 bg-green-50 border border-green-200 rounded hover:bg-green-100 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">Variance Analysis Report</p>
                        <p className="text-sm text-green-600">Budget vs actual comparison</p>
                      </div>
                      <Download className="w-5 h-5 text-green-600" />
                    </div>
                  </button>

                  <button className="w-full p-3 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-purple-800">Forecast Accuracy Report</p>
                        <p className="text-sm text-purple-600">Forecast vs actual performance</p>
                      </div>
                      <Download className="w-5 h-5 text-purple-600" />
                    </div>
                  </button>

                  <button className="w-full p-3 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-orange-800">Grant Utilization Report</p>
                        <p className="text-sm text-orange-600">Donor fund management</p>
                      </div>
                      <Download className="w-5 h-5 text-orange-600" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Budget KPIs */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4">Budget Performance KPIs</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Budget Utilization Rate</span>
                    <span className="font-medium text-green-600">75%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Variance Threshold</span>
                    <span className="font-medium text-blue-600">±5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Forecast Accuracy</span>
                    <span className="font-medium text-purple-600">82%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Grant Utilization</span>
                    <span className="font-medium text-orange-600">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost Control Index</span>
                    <span className="font-medium text-red-600">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'budgets' || activeTab === 'forecasting') && paginatedItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(paginatedItems.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Budget Creation Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Create Budget
              </h3>
              <form onSubmit={handleCreateBudget} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                  <select
                    value={budgetForm.department}
                    onChange={(e) => setBudgetForm({...budgetForm, department: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm({...budgetForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <input
                      type="number"
                      value={budgetForm.year}
                      onChange={(e) => setBudgetForm({...budgetForm, year: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      min="2020"
                      max="2030"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period *</label>
                    <select
                      value={budgetForm.period}
                      onChange={(e) => setBudgetForm({...budgetForm, period: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="annual">Annual</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦) *</label>
                  <input
                    type="number"
                    value={budgetForm.amount}
                    onChange={(e) => setBudgetForm({...budgetForm, amount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="5000000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={budgetForm.description}
                    onChange={(e) => setBudgetForm({...budgetForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Budget purpose and justification..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
                  >
                    Create Budget
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBudgetModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Forecast Creation Modal */}
      {showForecastModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Create Forecast
              </h3>
              <form onSubmit={handleCreateForecast} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={forecastForm.category}
                    onChange={(e) => setForecastForm({...forecastForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select category...</option>
                    <option value="revenue">Revenue</option>
                    <option value="expenses">Expenses</option>
                    <option value="patient_volume">Patient Volume</option>
                    <option value="staff_costs">Staff Costs</option>
                    <option value="drug_costs">Drug Costs</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period *</label>
                    <select
                      value={forecastForm.period}
                      onChange={(e) => setForecastForm({...forecastForm, period: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="quarterly">Quarterly</option>
                      <option value="monthly">Monthly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <input
                      type="number"
                      value={forecastForm.year}
                      onChange={(e) => setForecastForm({...forecastForm, year: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="2024"
                      max="2030"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Predicted Amount (₦) *</label>
                  <input
                    type="number"
                    value={forecastForm.predictedAmount}
                    onChange={(e) => setForecastForm({...forecastForm, predictedAmount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="10000000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Level (%)</label>
                  <input
                    type="number"
                    value={forecastForm.confidenceLevel}
                    onChange={(e) => setForecastForm({...forecastForm, confidenceLevel: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    placeholder="85"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assumptions</label>
                  <textarea
                    value={forecastForm.assumptions}
                    onChange={(e) => setForecastForm({...forecastForm, assumptions: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Key assumptions for this forecast..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Methodology</label>
                  <textarea
                    value={forecastForm.methodology}
                    onChange={(e) => setForecastForm({...forecastForm, methodology: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Forecasting method used..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Create Forecast
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForecastModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Grant Creation Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Add Grant/Donation
              </h3>
              <form onSubmit={handleCreateGrant} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grant Name *</label>
                    <input
                      type="text"
                      value={grantForm.name}
                      onChange={(e) => setGrantForm({...grantForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Donor/Organization *</label>
                    <input
                      type="text"
                      value={grantForm.donor}
                      onChange={(e) => setGrantForm({...grantForm, donor: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦) *</label>
                  <input
                    type="number"
                    value={grantForm.amount}
                    onChange={(e) => setGrantForm({...grantForm, amount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="5000000"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={grantForm.startDate}
                      onChange={(e) => setGrantForm({...grantForm, startDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                    <input
                      type="date"
                      value={grantForm.endDate}
                      onChange={(e) => setGrantForm({...grantForm, endDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose *</label>
                  <textarea
                    value={grantForm.purpose}
                    onChange={(e) => setGrantForm({...grantForm, purpose: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Purpose and objectives of the grant..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conditions & Requirements</label>
                  <textarea
                    value={grantForm.conditions}
                    onChange={(e) => setGrantForm({...grantForm, conditions: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Specific conditions and reporting requirements..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                    <input
                      type="text"
                      value={grantForm.contactPerson}
                      onChange={(e) => setGrantForm({...grantForm, contactPerson: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Frequency</label>
                    <select
                      value={grantForm.reportingFrequency}
                      onChange={(e) => setGrantForm({...grantForm, reportingFrequency: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 font-medium"
                  >
                    Add Grant
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGrantModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetingForecasting;