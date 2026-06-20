import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Smartphone,
  CreditCard,
  TrendingUp,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Send,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Phone,
  Plus
} from 'lucide-react';
import {
  initiatePayment,
  processPayment,
  createSettlement,
  processSettlement,
  generateUSSDPayment,
  getProviderStats,
  searchMobileMoney,
  sortMobileMoney,
  filterMobileMoney
} from '../features/mobileMoneySlice';
import Pagination from '../components/Pagination';

const MobileMoneyIntegration = () => {
  const dispatch = useDispatch();
  const {
    transactions,
    providers,
    paymentRequests,
    settlements,
    stats,
    searchTerm,
    sortBy,
    filterBy
  } = useSelector(state => state.mobileMoney);

  const [activeTab, setActiveTab] = useState('payments');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    provider: 'mtn',
    phoneNumber: '',
    reference: '',
    description: '',
    patientId: ''
  });

  const [settlementForm, setSettlementForm] = useState({
    provider: 'mtn',
    transactions: [],
    settlementDate: new Date().toISOString().split('T')[0]
  });

  // Filter and search logic
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = !searchTerm ||
        transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.phoneNumber?.includes(searchTerm) ||
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || transaction.status === filterBy || transaction.provider === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'amount') return b.amount - a.amount;
      if (sortBy === 'provider') return a.provider.localeCompare(b.provider);
      return 0;
    });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleInitiatePayment = (e) => {
    e.preventDefault();

    const reference = paymentForm.reference || `TXN${Date.now()}`;
    dispatch(initiatePayment({
      ...paymentForm,
      reference
    }));

    // Generate USSD string for display
    const ussdResult = dispatch(generateUSSDPayment({
      provider: paymentForm.provider,
      amount: paymentForm.amount,
      reference
    }));

    setPaymentForm({
      amount: '',
      provider: 'mtn',
      phoneNumber: '',
      reference: '',
      description: '',
      patientId: ''
    });
    setShowPaymentModal(false);
  };

  const handleProcessPayment = (paymentRequestId, status) => {
    dispatch(processPayment({
      paymentRequestId,
      status,
      transactionId: `TXN${Date.now()}`,
      responseData: { processedBy: 'system', timestamp: new Date().toISOString() }
    }));
  };

  const handleCreateSettlement = (e) => {
    e.preventDefault();

    // Get pending transactions for the provider
    const pendingTxns = transactions.filter(t =>
      t.provider === settlementForm.provider &&
      t.status === 'completed' &&
      !settlements.some(s => s.transactions.includes(t.id))
    );

    if (pendingTxns.length === 0) {
      alert('No pending transactions to settle');
      return;
    }

    const totalAmount = pendingTxns.reduce((sum, t) => sum + t.amount, 0);

    dispatch(createSettlement({
      transactions: pendingTxns,
      totalAmount,
      provider: settlementForm.provider,
      settlementDate: settlementForm.settlementDate
    }));

    setSettlementForm({
      provider: 'mtn',
      transactions: [],
      settlementDate: new Date().toISOString().split('T')[0]
    });
    setShowSettlementModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderColor = (provider) => {
    switch (provider.toLowerCase()) {
      case 'mtn': return 'bg-yellow-100 text-yellow-800';
      case 'airtel': return 'bg-red-100 text-red-800';
      case '9mobile': return 'bg-green-100 text-green-800';
      case 'glo': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingPayments = paymentRequests.filter(p => p.status === 'pending');
  const pendingSettlements = settlements.filter(s => s.status === 'pending');

  return (
    <div className="mobile-money-integration p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-500" />
          Mobile Money Integration
        </h1>
        <p className="text-gray-600 mt-2">MTN MoMo, Airtel Money, and other mobile payment processing</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Transactions</p>
              <p className="text-3xl font-bold mt-2">{stats.totalTransactions}</p>
            </div>
            <Activity className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Successful</p>
              <p className="text-3xl font-bold mt-2">{stats.successfulTransactions}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Volume</p>
              <p className="text-3xl font-bold mt-2">₦{stats.totalVolume.toLocaleString()}</p>
            </div>
            <DollarSign className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Settlements</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingSettlements}</p>
            </div>
            <Clock className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'payments', label: 'Payment Processing', icon: CreditCard },
            { id: 'providers', label: 'Providers', icon: Smartphone },
            { id: 'settlements', label: 'Settlements', icon: DollarSign },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
        {activeTab === 'payments' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchMobileMoney(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterMobileMoney(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Transactions</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="mtn">MTN</option>
                  <option value="airtel">Airtel</option>
                  <option value="9mobile">9Mobile</option>
                  <option value="glo">Glo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(sortMobileMoney(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="provider">Provider</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Payment
                </button>
              </div>
            </div>

            {/* Pending Payments Alert */}
            {pendingPayments.length > 0 && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-yellow-800">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Pending Payment Requests ({pendingPayments.length})
                </h3>
                <div className="space-y-2">
                  {pendingPayments.slice(0, 3).map(payment => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-gray-600">
                          {payment.provider.toUpperCase()} • {payment.phoneNumber} • ₦{payment.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Expires: {new Date(payment.expiresAt).toLocaleTimeString('en-NG')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleProcessPayment(payment.id, 'completed')}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => handleProcessPayment(payment.id, 'failed')}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Fail
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTransactions.map(transaction => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.reference}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getProviderColor(transaction.provider)}`}>
                          {transaction.provider.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.phoneNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₦{transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View Details
                        </button>
                        {transaction.status === 'pending' && (
                          <button className="text-green-600 hover:text-green-900">
                            Process
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'providers' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Mobile Money Providers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(providers).map(provider => (
                <div key={provider.code} className="p-6 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{provider.logo}</span>
                      <div>
                        <h4 className="font-medium">{provider.name}</h4>
                        <p className="text-sm text-gray-600">USSD: {provider.ussdCode}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      provider.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {provider.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Min Transaction</p>
                      <p className="text-sm font-medium">₦{provider.transactionLimits.min.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Max Transaction</p>
                      <p className="text-sm font-medium">₦{provider.transactionLimits.max.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Daily Limit</p>
                      <p className="text-sm font-medium">₦{provider.transactionLimits.daily.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Currencies</p>
                      <p className="text-sm font-medium">{provider.supportedCurrencies.join(', ')}</p>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium">
                    Configure Provider
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settlements' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Settlement Management</h3>
              <button
                onClick={() => setShowSettlementModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Create Settlement
              </button>
            </div>

            {/* Pending Settlements */}
            {pendingSettlements.length > 0 && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">Pending Settlements</h4>
                <div className="space-y-2">
                  {pendingSettlements.map(settlement => (
                    <div key={settlement.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium">{settlement.provider.toUpperCase()} Settlement</p>
                        <p className="text-sm text-gray-600">
                          {settlement.transactions.length} transactions • ₦{settlement.totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => dispatch(processSettlement({
                          settlementId: settlement.id,
                          status: 'completed',
                          bankReference: `REF${Date.now()}`
                        }))}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Process
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settlements History */}
            <div className="space-y-4">
              {settlements.map(settlement => (
                <div key={settlement.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{settlement.provider.toUpperCase()} Settlement</h4>
                      <p className="text-sm text-gray-600">
                        {settlement.transactions.length} transactions • ₦{settlement.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(settlement.status)}`}>
                      {settlement.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Settlement Date</p>
                      <p className="text-sm">{new Date(settlement.settlementDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm">{new Date(settlement.createdAt).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Bank Reference</p>
                      <p className="text-sm">{settlement.bankReference || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Actions</p>
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {settlements.length === 0 && (
                <p className="text-gray-500 text-center py-8">No settlements found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Provider Performance */}
              <div>
                <h4 className="font-medium mb-3">Provider Performance</h4>
                <div className="space-y-3">
                  {Object.values(providers).map(provider => {
                    const providerTxns = transactions.filter(t => t.provider === provider.code.toLowerCase());
                    const successRate = providerTxns.length > 0 ?
                      (providerTxns.filter(t => t.status === 'completed').length / providerTxns.length * 100).toFixed(1) : 0;

                    return (
                      <div key={provider.code} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{provider.name}</span>
                          <span className="text-sm text-gray-600">{successRate}% success</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${successRate}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {providerTxns.filter(t => t.status === 'completed').length} of {providerTxns.length} transactions
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Volume Trends */}
              <div>
                <h4 className="font-medium mb-3">Volume Trends</h4>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">₦{stats.todayVolume.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Today's Volume</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Target: ₦500,000</span>
                      <span>{((stats.todayVolume / 500000) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${Math.min((stats.todayVolume / 500000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {activeTab === 'payments' && filteredTransactions.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTransactions.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Initiate Mobile Money Payment
              </h3>
              <form onSubmit={handleInitiatePayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <select
                    value={paymentForm.provider}
                    onChange={(e) => setPaymentForm({...paymentForm, provider: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="9mobile">9Mobile Payments</option>
                    <option value="glo">Glo QuickCharge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={paymentForm.phoneNumber}
                    onChange={(e) => setPaymentForm({...paymentForm, phoneNumber: e.target.value})}
                    placeholder="+234XXXXXXXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                    placeholder="1000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={paymentForm.description}
                    onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                    placeholder="Hospital bill payment"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID (Optional)</label>
                  <input
                    type="text"
                    value={paymentForm.patientId}
                    onChange={(e) => setPaymentForm({...paymentForm, patientId: e.target.value})}
                    placeholder="Patient identifier"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
                  >
                    Initiate Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
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

      {/* Settlement Modal */}
      {showSettlementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Create Settlement
              </h3>
              <form onSubmit={handleCreateSettlement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                  <select
                    value={settlementForm.provider}
                    onChange={(e) => setSettlementForm({...settlementForm, provider: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="9mobile">9Mobile Payments</option>
                    <option value="glo">Glo QuickCharge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Settlement Date</label>
                  <input
                    type="date"
                    value={settlementForm.settlementDate}
                    onChange={(e) => setSettlementForm({...settlementForm, settlementDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Create Settlement
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettlementModal(false)}
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

export default MobileMoneyIntegration;