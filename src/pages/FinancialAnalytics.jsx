import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Target,
  Users,
  Activity,
  CreditCard,
  Banknote,
  Calculator,
  LineChart,
  Eye,
  Settings
} from 'lucide-react';
import {
  generateRevenueReport,
  generateCostAnalysis,
  updateCashFlowProjection,
  createBudget,
  updateBudget,
  generateFinancialKPIs,
  exportFinancialReport,
  setDateRange,
  searchFinancialData,
  filterFinancialData
} from '../features/financialSlice';
import Pagination from '../components/Pagination';

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
    stats
  } = useSelector(state => state.financial);

  const [activeTab, setActiveTab] = useState('overview');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [budgetForm, setBudgetForm] = useState({
    department: '',
    category: '',
    amount: '',
    period: 'monthly',
    year: new Date().getFullYear(),
    description: ''
  });

  // Nigerian financial metrics
  const nigerianMetrics = {
    revenue: {
      nhis: { current: 45000000, target: 50000000, growth: 12.5 },
      private: { current: 28000000, target: 35000000, growth: 8.3 },
      corporate: { current: 15000000, target: 18000000, growth: 15.2 },
      outOfPocket: { current: 12000000, target: 10000000, growth: -5.1 }
    },
    costs: {
      staff: { current: 35000000, percentage: 45 },
      drugs: { current: 18000000, percentage: 23 },
      equipment: { current: 12000000, percentage: 15 },
      overhead: { current: 10000000, percentage: 13 },
      maintenance: { current: 3500000, percentage: 4 }
    },
    ratios: {
      operatingMargin: 18.5,
      currentRatio: 2.1,
      debtToEquity: 0.3,
      revenuePerBed: 850000,
      averageRevenuePerPatient: 25000
    }
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

  const filteredCosts = costData
    .filter(item => {
      const matchesSearch = !searchTerm ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || item.category === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedItems = activeTab === 'revenue' ? filteredRevenue : filteredCosts;
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
      amount: '',
      period: 'monthly',
      year: new Date().getFullYear(),
      description: ''
    });
    setShowBudgetModal(false);
  };

  const handleExportReport = (reportType) => {
    dispatch(exportFinancialReport({ reportType, dateRange }));
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
    if (growth > 10) return 'text-green-600';
    if (growth > 0) return 'text-blue-600';
    return 'text-red-600';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const totalRevenue = Object.values(nigerianMetrics.revenue).reduce((sum, item) => sum + item.current, 0);
  const totalCosts = Object.values(nigerianMetrics.costs).reduce((sum, item) => sum + item.current, 0);
  const netProfit = totalRevenue - totalCosts;
  const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="financial-analytics p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-500" />
          Financial Analytics & Dashboards
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive financial intelligence for healthcare operations</p>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalRevenue)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+12.5% YoY</span>
              </div>
            </div>
            <DollarSign className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Costs</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalCosts)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">+8.2% YoY</span>
              </div>
            </div>
            <CreditCard className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Net Profit</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(netProfit)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-sm text-blue-600">+18.5% margin</span>
              </div>
            </div>
            <Calculator className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Cash Position</p>
              <p className="text-3xl font-bold mt-2">₦45.2M</p>
              <div className="flex items-center mt-1">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">Healthy</span>
              </div>
            </div>
            <Banknote className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'revenue', label: 'Revenue Analysis', icon: TrendingUp },
            { id: 'costs', label: 'Cost Analysis', icon: TrendingDown },
            { id: 'cashflow', label: 'Cash Flow', icon: Activity },
            { id: 'budgets', label: 'Budgets', icon: Target },
            { id: 'kpis', label: 'KPIs', icon: LineChart }
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
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Breakdown */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Revenue Sources</h3>
                <div className="space-y-4">
                  {Object.entries(nigerianMetrics.revenue).map(([source, data]) => (
                    <div key={source} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{source.replace(/([A-Z])/g, ' $1')}</h4>
                        <div className={`flex items-center ${getGrowthColor(data.growth)}`}>
                          {getGrowthIcon(data.growth)}
                          <span className="ml-1 text-sm">{data.growth}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">{formatCurrency(data.current)}</p>
                          <p className="text-sm text-gray-600">Target: {formatCurrency(data.target)}</p>
                        </div>
                        <div className="text-right">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min((data.current / data.target) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
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
                <h3 className="text-lg font-semibold mb-4">Cost Structure</h3>
                <div className="space-y-4">
                  {Object.entries(nigerianMetrics.costs).map(([category, data]) => (
                    <div key={category} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1')}</h4>
                        <span className="text-sm text-gray-600">{data.percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">{formatCurrency(data.current)}</p>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
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
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Key Financial Ratios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(nigerianMetrics.ratios).map(([ratio, value]) => (
                  <div key={ratio} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <h4 className="font-medium text-sm text-gray-600 mb-2 capitalize">
                      {ratio.replace(/([A-Z])/g, ' $1')}
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {typeof value === 'number' && value < 1 ? value.toFixed(2) : value.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => dispatch(setDateRange(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search revenue..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchFinancialData(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterFinancialData(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Categories</option>
                  <option value="nhis">NHIS</option>
                  <option value="private">Private</option>
                  <option value="corporate">Corporate</option>
                  <option value="out_of_pocket">Out of Pocket</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={() => handleExportReport('revenue')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={() => dispatch(generateRevenueReport())}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate
                </button>
              </div>
            </div>

            {/* Revenue Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`flex items-center ${getGrowthColor(item.growth)}`}>
                          {getGrowthIcon(item.growth)}
                          <span className="ml-1 text-sm">{item.growth}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'costs' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => dispatch(setDateRange(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search costs..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchFinancialData(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterFinancialData(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
                <button
                  onClick={() => handleExportReport('costs')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={() => dispatch(generateCostAnalysis())}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Analyze
                </button>
              </div>
            </div>

            {/* Cost Analysis Chart Placeholder */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h4 className="font-medium mb-4">Cost Trend Analysis</h4>
              <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <LineChart className="w-12 h-12 mx-auto mb-2" />
                  <p>Cost trend visualization would appear here</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </div>

            {/* Cost Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(item.budget || 0)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.variance > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {item.variance > 0 ? '+' : ''}{item.variance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cashflow' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cash Flow Statement */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Cash Flow Statement</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Operating Activities</span>
                    <span className="font-bold text-green-600">{formatCurrency(52000000)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Investing Activities</span>
                    <span className="font-bold text-red-600">({formatCurrency(15000000)})</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Financing Activities</span>
                    <span className="font-bold text-blue-600">{formatCurrency(8000000)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t-2 pt-2">
                    <span className="font-bold">Net Cash Flow</span>
                    <span className="font-bold text-green-600">{formatCurrency(45000000)}</span>
                  </div>
                </div>
              </div>

              {/* Cash Flow Projections */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">12-Month Cash Flow Projection</h3>
                <div className="space-y-3">
                  {[
                    { month: 'Jan', inflow: 52000000, outflow: 48000000, balance: 4000000 },
                    { month: 'Feb', inflow: 55000000, outflow: 49000000, balance: 4600000 },
                    { month: 'Mar', inflow: 58000000, outflow: 51000000, balance: 5300000 },
                    { month: 'Apr', inflow: 60000000, outflow: 52000000, balance: 6100000 },
                    { month: 'May', inflow: 62000000, outflow: 53000000, balance: 7000000 },
                    { month: 'Jun', inflow: 65000000, outflow: 54000000, balance: 8100000 }
                  ].map(projection => (
                    <div key={projection.month} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium w-12">{projection.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(projection.balance / 10000000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="font-medium text-green-600">{formatCurrency(projection.balance)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Budget Management</h3>
              <button
                onClick={() => setShowBudgetModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
              >
                <Target className="w-4 h-4 mr-2" />
                Create Budget
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map(budget => (
                <div key={budget.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{budget.department}</h4>
                      <p className="text-sm text-gray-600 capitalize">{budget.category}</p>
                    </div>
                    <span className="text-sm text-gray-500">{budget.year}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Budget Amount:</span>
                      <span className="font-medium">{formatCurrency(budget.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Period:</span>
                      <span className="capitalize">{budget.period}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Utilized:</span>
                      <span className="font-medium">{budget.utilized || 0}%</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${budget.utilized || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600">
                      Edit
                    </button>
                    <button className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kpis' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Clinical KPIs */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-500" />
                  Clinical Performance
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bed Occupancy Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Length of Stay</span>
                    <span className="font-medium">4.2 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Patient Satisfaction</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Readmission Rate</span>
                    <span className="font-medium">3.1%</span>
                  </div>
                </div>
              </div>

              {/* Financial KPIs */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Financial Performance
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue per Bed</span>
                    <span className="font-medium">₦850K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cost per Patient</span>
                    <span className="font-medium">₦18.5K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Operating Margin</span>
                    <span className="font-medium">18.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ROI</span>
                    <span className="font-medium">24.3%</span>
                  </div>
                </div>
              </div>

              {/* Operational KPIs */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-500" />
                  Operational Efficiency
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Wait Time</span>
                    <span className="font-medium">23 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Staff Productivity</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Equipment Utilization</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Error Rate</span>
                    <span className="font-medium">0.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'revenue' || activeTab === 'costs') && paginatedItems.length > itemsPerPage && (
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
                <Target className="w-5 h-5 mr-2" />
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period *</label>
                    <select
                      value={budgetForm.period}
                      onChange={(e) => setBudgetForm({...budgetForm, period: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={budgetForm.description}
                    onChange={(e) => setBudgetForm({...budgetForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Budget description and justification..."
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
    </div>
  );
};

export default FinancialAnalytics;