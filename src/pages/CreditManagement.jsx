import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  CreditCard,
  AlertTriangle,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  UserCheck,
  FileText,
  Shield,
  BarChart3,
  AlertCircle
} from 'lucide-react';





import {
  createCreditPolicy,
  updateCreditPolicy,
  createGuarantor,
  updateGuarantor,
  createPaymentPlan,
  updatePaymentPlan,
  sendPaymentReminder,
  escalateDebt,
  writeOffDebt,
  generateCreditReport,
  searchCreditData,
  filterCreditData
} from '../features/creditSlice';
import Pagination from '../components/Pagination';

const CreditManagement = () => {
  const dispatch = useDispatch();
  const {
    creditPolicies,
    guarantors,
    paymentPlans,
    outstandingDebts,
    paymentReminders,
    debtAging,
    searchTerm,
    filterBy,
    loading
  } = useSelector(state => state.credit);

  const [activeTab, setActiveTab] = useState('overview');
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showGuarantorModal, setShowGuarantorModal] = useState(false);
  const [showPaymentPlanModal, setShowPaymentPlanModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [policyForm, setPolicyForm] = useState({
    patientCategory: '',
    creditLimit: '',
    paymentTerms: '',
    interestRate: '',
    gracePeriod: '',
    description: ''
  });

  const [guarantorForm, setGuarantorForm] = useState({
    patientId: '',
    patientName: '',
    name: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    monthlyIncome: '',
    creditHistory: '',
    idType: '',
    idNumber: ''
  });

  const [paymentPlanForm, setPaymentPlanForm] = useState({
    patientId: '',
    patientName: '',
    totalAmount: '',
    numberOfInstallments: '',
    installmentAmount: '',
    startDate: '',
    frequency: 'monthly',
    description: ''
  });

  // Nigerian credit management metrics
  const creditMetrics = {
    overview: {
      totalOutstanding: 12500000, // ₦12.5M
      totalOverdue: 3200000,   // ₦3.2M
      averageCollectionPeriod: 45, // days
      badDebtRatio: 2.3, // %
      recoveryRate: 78.5 // %
    },
    aging: {
      current: 8500000,    // 0-30 days
      thirtyDays: 2500000, // 31-60 days
      sixtyDays: 1200000,  // 61-90 days
      ninetyDays: 300000   // 90+ days
    },
    categories: {
      nhis: { outstanding: 4500000, overdue: 800000 },
      private: { outstanding: 3800000, overdue: 1200000 },
      corporate: { outstanding: 3200000, overdue: 600000 },
      cash: { outstanding: 1000000, overdue: 400000 }
    }
  };

  // Filter and search logic
  const filteredDebts = outstandingDebts
    .filter(debt => {
      const matchesSearch = !searchTerm ||
        debt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debt.patientId?.includes(searchTerm);
      const matchesFilter = filterBy === 'all' || debt.status === filterBy || debt.category === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by overdue amount first, then by days overdue
      const aOverdue = a.daysOverdue > 0 ? a.amount : 0;
      const bOverdue = b.daysOverdue > 0 ? b.amount : 0;
      if (aOverdue !== bOverdue) return bOverdue - aOverdue;
      return b.daysOverdue - a.daysOverdue;
    });

  const filteredGuarantors = guarantors
    .filter(guarantor => {
      const matchesSearch = !searchTerm ||
        guarantor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guarantor.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const paginatedItems = activeTab === 'debts' ? filteredDebts : filteredGuarantors;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreatePolicy = (e) => {
    e.preventDefault();
    dispatch(createCreditPolicy(policyForm));
    setPolicyForm({
      patientCategory: '',
      creditLimit: '',
      paymentTerms: '',
      interestRate: '',
      gracePeriod: '',
      description: ''
    });
    setShowPolicyModal(false);
  };

  const handleCreateGuarantor = (e) => {
    e.preventDefault();
    dispatch(createGuarantor(guarantorForm));
    setGuarantorForm({
      patientId: '',
      patientName: '',
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: '',
      occupation: '',
      monthlyIncome: '',
      creditHistory: '',
      idType: '',
      idNumber: ''
    });
    setShowGuarantorModal(false);
  };

  const handleCreatePaymentPlan = (e) => {
    e.preventDefault();
    dispatch(createPaymentPlan(paymentPlanForm));
    setPaymentPlanForm({
      patientId: '',
      patientName: '',
      totalAmount: '',
      numberOfInstallments: '',
      installmentAmount: '',
      startDate: '',
      frequency: 'monthly',
      description: ''
    });
    setShowPaymentPlanModal(false);
  };

  const handleSendReminder = (debtId) => {
    dispatch(sendPaymentReminder({ debtId }));
  };

  const handleEscalateDebt = (debtId) => {
    dispatch(escalateDebt({ debtId }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAgingColor = (days) => {
    if (days <= 30) return 'text-green-600';
    if (days <= 60) return 'text-yellow-600';
    if (days <= 90) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-yellow-100 text-yellow-800';
      case 'delinquent': return 'bg-orange-100 text-orange-800';
      case 'legal': return 'bg-red-100 text-red-800';
      case 'written_off': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalOutstanding = creditMetrics.overview.totalOutstanding;
  const totalOverdue = creditMetrics.overview.totalOverdue;
  const overduePercentage = ((totalOverdue / totalOutstanding) * 100).toFixed(1);
  const criticalDebts = outstandingDebts.filter(d => d.daysOverdue > 90).length;
  const activePaymentPlans = paymentPlans.filter(p => p.status === 'active').length;

  return (
    <div className="credit-management p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-500" />
          Advanced Credit Management
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive credit risk management and debt collection</p>
      </div>

      {/* Key Credit Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Outstanding</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalOutstanding)}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-sm text-blue-600">+5.2% from last month</span>
              </div>
            </div>
            <DollarSign className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overdue Amount</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(totalOverdue)}</p>
              <div className="flex items-center mt-1">
                <AlertTriangle className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">{overduePercentage}% of total</span>
              </div>
            </div>
            <AlertCircle className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Critical Debts</p>
              <p className="text-3xl font-bold mt-2">{criticalDebts}</p>
              <div className="flex items-center mt-1">
                <XCircle className="w-4 h-4 text-yellow-600 mr-1" />
                <span className="text-sm text-yellow-600">90+ days overdue</span>
              </div>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Recovery Rate</p>
              <p className="text-3xl font-bold mt-2">{creditMetrics.overview.recoveryRate}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">Above target</span>
              </div>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'policies', label: 'Credit Policies', icon: FileText },
            { id: 'debts', label: 'Outstanding Debts', icon: AlertTriangle },
            { id: 'guarantors', label: 'Guarantors', icon: Users },
            { id: 'payment_plans', label: 'Payment Plans', icon: Calendar },
            { id: 'collection', label: 'Collection Actions', icon: Phone }
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
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Debt Aging Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Debt Aging Analysis</h3>
                <div className="space-y-4">
                  {[
                    { period: 'Current (0-30 days)', amount: creditMetrics.aging.current, color: 'bg-green-500' },
                    { period: '31-60 days', amount: creditMetrics.aging.thirtyDays, color: 'bg-yellow-500' },
                    { period: '61-90 days', amount: creditMetrics.aging.sixtyDays, color: 'bg-orange-500' },
                    { period: '90+ days', amount: creditMetrics.aging.ninetyDays, color: 'bg-red-500' }
                  ].map((aging, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{aging.period}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${aging.color}`}
                            style={{ width: `${(aging.amount / totalOutstanding) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-bold">{formatCurrency(aging.amount)}</p>
                        <p className="text-sm text-gray-600">
                          {((aging.amount / totalOutstanding) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credit by Category */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Outstanding by Category</h3>
                <div className="space-y-4">
                  {Object.entries(creditMetrics.categories).map(([category, data]) => (
                    <div key={category} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{category}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          data.overdue > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {data.overdue > 0 ? 'Has Overdue' : 'Current'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Outstanding</p>
                          <p className="font-bold">{formatCurrency(data.outstanding)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Overdue</p>
                          <p className="font-bold text-red-600">{formatCurrency(data.overdue)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nigerian Credit Context */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Nigerian Healthcare Credit Context</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-800 mb-3">NHIS Considerations</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Capitation payment cycles</li>
                    <li>• Primary healthcare funding</li>
                    <li>• State ministry coordination</li>
                    <li>• Fraud prevention measures</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-medium text-green-800 mb-3">Local Payment Practices</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• "I'll pay tomorrow" tracking</li>
                    <li>• Community leader guarantees</li>
                    <li>• Installment payment plans</li>
                    <li>• Barter/trade-in arrangements</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-medium text-purple-800 mb-3">Risk Management</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Corporate credit terms</li>
                    <li>• HMO payment guarantees</li>
                    <li>• Government facility credits</li>
                    <li>• Charity care classification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Credit Policies</h3>
              <button
                onClick={() => setShowPolicyModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Policy
              </button>
            </div>

            <div className="space-y-4">
              {creditPolicies.map(policy => (
                <div key={policy.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{policy.patientCategory} Credit Policy</h4>
                      <p className="text-sm text-gray-600">{policy.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      policy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {policy.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Credit Limit</p>
                      <p className="text-sm font-medium">{formatCurrency(policy.creditLimit)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Payment Terms</p>
                      <p className="text-sm">{policy.paymentTerms} days</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Interest Rate</p>
                      <p className="text-sm">{policy.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Grace Period</p>
                      <p className="text-sm">{policy.gracePeriod} days</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      Edit Policy
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {creditPolicies.length === 0 && (
                <p className="text-gray-500 text-center py-8">No credit policies configured yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'debts' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search debts..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchCreditData(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterCreditData(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Debts</option>
                  <option value="current">Current</option>
                  <option value="overdue">Overdue</option>
                  <option value="delinquent">Delinquent</option>
                  <option value="legal">Legal Action</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </button>
                <button
                  onClick={() => setShowPaymentPlanModal(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Payment Plan
                </button>
              </div>
            </div>

            {/* Debts Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days Overdue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(debt => (
                    <tr key={debt.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div>
                          <p className="font-medium">{debt.patientName}</p>
                          <p className="text-gray-500">ID: {debt.patientId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(debt.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getAgingColor(debt.daysOverdue)}`}>
                          {debt.daysOverdue} days
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(debt.status)}`}>
                          {debt.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {debt.lastContact ? new Date(debt.lastContact).toLocaleDateString('en-NG') : 'Never'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSendReminder(debt.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Send Reminder"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEscalateDebt(debt.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Escalate"
                          >
                            <AlertTriangle className="w-4 h-4" />
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

        {activeTab === 'guarantors' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Guarantor Management</h3>
              <button
                onClick={() => setShowGuarantorModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Guarantor
              </button>
            </div>

            <div className="space-y-4">
              {filteredGuarantors.map(guarantor => (
                <div key={guarantor.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{guarantor.name}</h4>
                      <p className="text-sm text-gray-600">Guarantor for: {guarantor.patientName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        guarantor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {guarantor.status}
                      </span>
                      <span className="text-sm text-gray-600 capitalize">
                        {guarantor.relationship}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm">{guarantor.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Monthly Income</p>
                      <p className="text-sm">{formatCurrency(guarantor.monthlyIncome)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Credit History</p>
                      <p className="text-sm capitalize">{guarantor.creditHistory}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ID Type</p>
                      <p className="text-sm">{guarantor.idType}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      Edit Details
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                      Contact History
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                      View Documents
                    </button>
                  </div>
                </div>
              ))}

              {filteredGuarantors.length === 0 && (
                <p className="text-gray-500 text-center py-8">No guarantors registered yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payment_plans' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Payment Plans</h3>
              <span className="text-sm text-gray-600">
                {activePaymentPlans} active plans
              </span>
            </div>

            <div className="space-y-4">
              {paymentPlans.map(plan => (
                <div key={plan.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Payment Plan for {plan.patientName}</h4>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(plan.status)}`}>
                      {plan.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="text-sm font-medium">{formatCurrency(plan.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Installments</p>
                      <p className="text-sm">{plan.completedInstallments || 0} of {plan.numberOfInstallments}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Installment Amount</p>
                      <p className="text-sm">{formatCurrency(plan.installmentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Next Payment</p>
                      <p className="text-sm">{plan.nextPaymentDate ? new Date(plan.nextPaymentDate).toLocaleDateString('en-NG') : 'N/A'}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${((plan.completedInstallments || 0) / plan.numberOfInstallments) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {Math.round(((plan.completedInstallments || 0) / plan.numberOfInstallments) * 100)}% completed
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      Record Payment
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                      View Schedule
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                      Edit Plan
                    </button>
                  </div>
                </div>
              ))}

              {paymentPlans.length === 0 && (
                <p className="text-gray-500 text-center py-8">No payment plans created yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'collection' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Collection Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Automated Reminders */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                  Automated Reminders
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">SMS Reminders</span>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Email Notifications</span>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Phone Calls</span>
                    <span className="text-sm font-medium text-yellow-600">Scheduled</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-medium">
                  Configure Reminders
                </button>
              </div>

              {/* Escalation Procedures */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Escalation Procedures
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">30 Days: Friendly Reminder</p>
                    <p className="text-xs text-gray-600">SMS + Email notification</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">60 Days: Formal Notice</p>
                    <p className="text-xs text-gray-600">Registered letter + Phone call</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">90 Days: Legal Action</p>
                    <p className="text-xs text-gray-600">Attorney engagement</p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm font-medium">
                  Manage Procedures
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'debts' || activeTab === 'guarantors') && paginatedItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(paginatedItems.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Credit Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Create Credit Policy
              </h3>
              <form onSubmit={handleCreatePolicy} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Category *</label>
                  <select
                    value={policyForm.patientCategory}
                    onChange={(e) => setPolicyForm({...policyForm, patientCategory: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select category...</option>
                    <option value="NHIS">NHIS Patients</option>
                    <option value="Private">Private Patients</option>
                    <option value="Corporate">Corporate Clients</option>
                    <option value="Government">Government Employees</option>
                    <option value="Charity">Charity Cases</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credit Limit (₦) *</label>
                  <input
                    type="number"
                    value={policyForm.creditLimit}
                    onChange={(e) => setPolicyForm({...policyForm, creditLimit: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="500000"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms (days)</label>
                    <input
                      type="number"
                      value={policyForm.paymentTerms}
                      onChange={(e) => setPolicyForm({...policyForm, paymentTerms: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (days)</label>
                    <input
                      type="number"
                      value={policyForm.gracePeriod}
                      onChange={(e) => setPolicyForm({...policyForm, gracePeriod: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="7"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={policyForm.interestRate}
                    onChange={(e) => setPolicyForm({...policyForm, interestRate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="2.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={policyForm.description}
                    onChange={(e) => setPolicyForm({...policyForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Policy description and guidelines..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Create Policy
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPolicyModal(false)}
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

      {/* Guarantor Modal */}
      {showGuarantorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Add Guarantor
              </h3>
              <form onSubmit={handleCreateGuarantor} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
                    <input
                      type="text"
                      value={guarantorForm.patientId}
                      onChange={(e) => setGuarantorForm({...guarantorForm, patientId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                    <input
                      type="text"
                      value={guarantorForm.patientName}
                      onChange={(e) => setGuarantorForm({...guarantorForm, patientName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guarantor Name *</label>
                    <input
                      type="text"
                      value={guarantorForm.name}
                      onChange={(e) => setGuarantorForm({...guarantorForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                    <select
                      value={guarantorForm.relationship}
                      onChange={(e) => setGuarantorForm({...guarantorForm, relationship: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    >
                      <option value="">Select relationship...</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="child">Child</option>
                      <option value="sibling">Sibling</option>
                      <option value="employer">Employer</option>
                      <option value="friend">Friend</option>
                      <option value="community_leader">Community Leader</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={guarantorForm.phone}
                      onChange={(e) => setGuarantorForm({...guarantorForm, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={guarantorForm.email}
                      onChange={(e) => setGuarantorForm({...guarantorForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    value={guarantorForm.address}
                    onChange={(e) => setGuarantorForm({...guarantorForm, address: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                    <input
                      type="text"
                      value={guarantorForm.occupation}
                      onChange={(e) => setGuarantorForm({...guarantorForm, occupation: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income (₦)</label>
                    <input
                      type="number"
                      value={guarantorForm.monthlyIncome}
                      onChange={(e) => setGuarantorForm({...guarantorForm, monthlyIncome: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="150000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit History</label>
                    <select
                      value={guarantorForm.creditHistory}
                      onChange={(e) => setGuarantorForm({...guarantorForm, creditHistory: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select credit history...</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ID Type</label>
                    <select
                      value={guarantorForm.idType}
                      onChange={(e) => setGuarantorForm({...guarantorForm, idType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select ID type...</option>
                      <option value="nin">National Identity Number (NIN)</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="passport">International Passport</option>
                      <option value="voters_card">Voter's Card</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
                  <input
                    type="text"
                    value={guarantorForm.idNumber}
                    onChange={(e) => setGuarantorForm({...guarantorForm, idNumber: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
                  >
                    Add Guarantor
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGuarantorModal(false)}
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

      {/* Payment Plan Modal */}
      {showPaymentPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Create Payment Plan
              </h3>
              <form onSubmit={handleCreatePaymentPlan} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
                    <input
                      type="text"
                      value={paymentPlanForm.patientId}
                      onChange={(e) => setPaymentPlanForm({...paymentPlanForm, patientId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                    <input
                      type="text"
                      value={paymentPlanForm.patientName}
                      onChange={(e) => setPaymentPlanForm({...paymentPlanForm, patientName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (₦) *</label>
                  <input
                    type="number"
                    value={paymentPlanForm.totalAmount}
                    onChange={(e) => setPaymentPlanForm({...paymentPlanForm, totalAmount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="500000"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Installments *</label>
                    <input
                      type="number"
                      value={paymentPlanForm.numberOfInstallments}
                      onChange={(e) => setPaymentPlanForm({...paymentPlanForm, numberOfInstallments: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="12"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency *</label>
                    <select
                      value={paymentPlanForm.frequency}
                      onChange={(e) => setPaymentPlanForm({...paymentPlanForm, frequency: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={paymentPlanForm.startDate}
                    onChange={(e) => setPaymentPlanForm({...paymentPlanForm, startDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={paymentPlanForm.description}
                    onChange={(e) => setPaymentPlanForm({...paymentPlanForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Payment plan details and terms..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Create Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentPlanModal(false)}
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

export default CreditManagement;