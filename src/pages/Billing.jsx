import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  CreditCard,
  Shield,
  Calendar,
  Users,
  X,
  Printer,
  MoreHorizontal
} from 'lucide-react';
import {
  fetchInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  issueInvoice,
  cancelInvoice,
  fetchPayments,
  createPayment,
  fetchInsuranceClaims,
  createInsuranceClaim,
  submitInsuranceClaim,
  approveClaim,
  rejectClaim,
  fetchAuditLogs,
  fetchInvoiceSummary,
  setError,
  clearError
} from '../features/billingSlice';
import Pagination from '../components/Pagination';
import GenericModal from '../components/GenericModal';
import ConfirmModal from '../components/ConfirmModal';

const Billing = () => {
  const dispatch = useDispatch();
  const { invoices, payments, claims, auditLogs, summary, loading, error } = useSelector(state => state.billing);
  
  const [activeTab, setActiveTab] = useState('invoices');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showInvoiceDetailModal, setShowInvoiceDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveClaimModal, setShowApproveClaimModal] = useState(false);
  const [showRejectClaimModal, setShowRejectClaimModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const [claimSearchQuery, setClaimSearchQuery] = useState('');
  const [claimStatusFilter, setClaimStatusFilter] = useState('all');
  const [claimCurrentPage, setClaimCurrentPage] = useState(1);

  const [invoiceForm, setInvoiceForm] = useState({
    patientId: '',
    visitId: '',
    dueDate: '',
    discountAmount: 0,
    taxAmount: 0,
    notes: '',
    items: []
  });

  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    amount: '',
    paymentMethod: 'cash',
    transactionReference: '',
    notes: ''
  });

  const [claimForm, setClaimForm] = useState({
    invoiceId: '',
    insuranceProvider: '',
    policyNumber: '',
    claimedAmount: '',
    notes: ''
  });

  const [itemForm, setItemForm] = useState({
    itemType: 'consultation',
    description: '',
    quantity: 1,
    unitPrice: '',
    taxRate: 0,
    discountAmount: 0
  });

  const [rejectionReason, setRejectionReason] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchPayments());
    dispatch(fetchInsuranceClaims());
    dispatch(fetchInvoiceSummary());
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const buildInvoicePayload = () => {
    const mappedItems = invoiceForm.items.map(item => ({
      item_type: item.itemType,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      tax_rate: item.taxRate,
      discount_amount: item.discountAmount,
      line_total: item.lineTotal
    }));

    return {
      patient: parseInt(invoiceForm.patientId),
      visit: invoiceForm.visitId ? parseInt(invoiceForm.visitId) : null,
      due_date: invoiceForm.dueDate,
      discount_amount: parseFloat(invoiceForm.discountAmount || 0),
      tax_amount: parseFloat(invoiceForm.taxAmount || 0),
      notes: invoiceForm.notes,
      items: mappedItems
    };
  };

  const filteredInvoices = invoices.filter(invoice => {
    const patientName = invoice.patient_name || '';
    const invoiceNumber = invoice.invoice_number || '';
    const matchesSearch = !searchQuery ||
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const filteredPayments = payments.filter(payment => {
    const patientName = payment.patient_name || '';
    const paymentNumber = payment.payment_number || '';
    const matchesSearch = !paymentSearchQuery ||
      patientName.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
      paymentNumber.toLowerCase().includes(paymentSearchQuery.toLowerCase());
    const matchesStatus = paymentStatusFilter === 'all' || payment.status === paymentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedPayments = filteredPayments.slice(
    (paymentCurrentPage - 1) * itemsPerPage,
    paymentCurrentPage * itemsPerPage
  );

  const totalPaymentPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const filteredClaims = claims.filter(claim => {
    const patientName = claim.patient_name || '';
    const claimNumber = claim.claim_number || '';
    const provider = claim.insurance_provider || '';
    const matchesSearch = !claimSearchQuery ||
      patientName.toLowerCase().includes(claimSearchQuery.toLowerCase()) ||
      claimNumber.toLowerCase().includes(claimSearchQuery.toLowerCase()) ||
      provider.toLowerCase().includes(claimSearchQuery.toLowerCase());
    const matchesStatus = claimStatusFilter === 'all' || claim.status === claimStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedClaims = filteredClaims.slice(
    (claimCurrentPage - 1) * itemsPerPage,
    claimCurrentPage * itemsPerPage
  );

  const totalClaimPages = Math.ceil(filteredClaims.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'issued': return 'bg-blue-100 text-blue-800';
      case 'partially_paid': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getClaimStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const payload = buildInvoicePayload();
      await dispatch(createInvoice(payload)).unwrap();
      setInvoiceForm({
        patientId: '',
        visitId: '',
        dueDate: '',
        discountAmount: 0,
        taxAmount: 0,
        notes: '',
        items: []
      });
      setShowInvoiceModal(false);
    } catch (err) {
      dispatch(setError(err.message || 'Failed to create invoice.'));
    }
  };

  const handleAddInvoiceItem = () => {
    if (itemForm.description && itemForm.unitPrice) {
      const lineTotal = (parseFloat(itemForm.quantity) * parseFloat(itemForm.unitPrice)) - 
                       parseFloat(itemForm.discountAmount || 0);
      setInvoiceForm(prev => ({
        ...prev,
        items: [...prev.items, {
          ...itemForm,
          lineTotal,
          quantity: parseInt(itemForm.quantity),
          unitPrice: parseFloat(itemForm.unitPrice)
        }]
      }));
      setItemForm({
        itemType: 'consultation',
        description: '',
        quantity: 1,
        unitPrice: '',
        taxRate: 0,
        discountAmount: 0
      });
    }
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...paymentForm,
        invoice: parseInt(paymentForm.invoiceId),
        amount: parseFloat(paymentForm.amount),
        patient: paymentForm.patientId ? parseInt(paymentForm.patientId) : null,
      };
      await dispatch(createPayment(payload)).unwrap();
      setPaymentForm({
        invoiceId: '',
        amount: '',
        paymentMethod: 'cash',
        transactionReference: '',
        notes: ''
      });
      setShowPaymentModal(false);
      dispatch(fetchInvoices());
    } catch (err) {
      dispatch(setError(err.message || 'Failed to record payment.'));
    }
  };

  const handleCreateClaim = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...claimForm,
        invoice: parseInt(claimForm.invoiceId),
        claimed_amount: parseFloat(claimForm.claimedAmount)
      };
      await dispatch(createInsuranceClaim(payload)).unwrap();
      setClaimForm({
        invoiceId: '',
        insuranceProvider: '',
        policyNumber: '',
        claimedAmount: '',
        notes: ''
      });
      setShowClaimModal(false);
    } catch (err) {
      dispatch(setError(err.message || 'Failed to create insurance claim.'));
    }
  };

  const handleIssueInvoice = async (invoiceId) => {
    try {
      await dispatch(issueInvoice(invoiceId)).unwrap();
      dispatch(fetchInvoices());
    } catch (err) {
      dispatch(setError(err.message || 'Failed to issue invoice.'));
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetailModal(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedInvoice) {
      try {
        await dispatch(cancelInvoice(selectedInvoice.id)).unwrap();
        setShowCancelModal(false);
        setSelectedInvoice(null);
        dispatch(fetchInvoices());
      } catch (err) {
        dispatch(setError(err.message || 'Failed to cancel invoice.'));
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedInvoice) {
      try {
        await dispatch(deleteInvoice(selectedInvoice.id)).unwrap();
        setShowDeleteModal(false);
        setSelectedInvoice(null);
        dispatch(fetchInvoices());
      } catch (err) {
        dispatch(setError(err.message || 'Failed to delete invoice.'));
      }
    }
  };

  const handleApproveClaim = async (e) => {
    e.preventDefault();
    if (selectedClaim) {
      try {
        await dispatch(approveClaim({ id: selectedClaim.id, approved_amount: parseFloat(approvedAmount) || selectedClaim.claimed_amount })).unwrap();
        setShowApproveClaimModal(false);
        setSelectedClaim(null);
        setApprovedAmount('');
        dispatch(fetchInsuranceClaims());
      } catch (err) {
        dispatch(setError(err.message || 'Failed to approve claim.'));
      }
    }
  };

  const handleRejectClaim = async (e) => {
    e.preventDefault();
    if (selectedClaim) {
      try {
        await dispatch(rejectClaim({ id: selectedClaim.id, rejection_reason: rejectionReason })).unwrap();
        setShowRejectClaimModal(false);
        setSelectedClaim(null);
        setRejectionReason('');
        dispatch(fetchInsuranceClaims());
      } catch (err) {
        dispatch(setError(err.message || 'Failed to reject claim.'));
      }
    }
  };

  const totalInvoiceAmount = invoiceForm.items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  const totalTax = invoiceForm.items.reduce((sum, item) => sum + ((item.lineTotal || 0) * (item.taxRate || 0) / 100), 0);
  const grandTotal = totalInvoiceAmount + totalTax - (invoiceForm.discountAmount || 0);

  return (
    <div className="billing p-4 sm:p-6 bg-gray-50 min-h-screen">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button onClick={() => dispatch(clearError())} className="ml-2 text-red-800 font-medium">Dismiss</button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-500" />
          Billing & Payments
        </h1>
        <p className="text-gray-600 mt-2">Invoice management, payments, and insurance claims</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Invoices</p>
              <p className="text-3xl font-bold mt-2">{summary.total_invoices || 0}</p>
              <div className="flex items-center mt-1">
                <FileText className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-sm text-blue-600">{formatCurrency(summary.total_revenue)} revenue</span>
              </div>
            </div>
            <FileText className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Paid</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(summary.total_paid)}</p>
              <div className="flex items-center mt-1">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">{summary.collection_rate}% collection rate</span>
              </div>
            </div>
            <CreditCard className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Payments</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(summary.total_pending)}</p>
              <div className="flex items-center mt-1">
                <Clock className="w-4 h-4 text-yellow-600 mr-1" />
                <span className="text-sm text-yellow-600">Outstanding balance</span>
              </div>
            </div>
            <AlertTriangle className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Insurance Claims</p>
              <p className="text-3xl font-bold mt-2">{claims.length}</p>
              <div className="flex items-center mt-1">
                <Shield className="w-4 h-4 text-purple-600 mr-1" />
                <span className="text-sm text-purple-600">Active claims</span>
              </div>
            </div>
            <Shield className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'invoices', label: 'Invoices', icon: FileText },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'claims', label: 'Insurance Claims', icon: Shield },
            { id: 'audit', label: 'Audit Logs', icon: Shield }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
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

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="issued">Issued</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedInvoices.map(invoice => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.patient_name || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.invoice_date).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.total_amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(invoice.amount_paid)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {invoice.status === 'draft' && (
                            <button
                              onClick={() => handleIssueInvoice(invoice.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Issue Invoice"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleViewInvoice(invoice)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {invoice.status !== 'cancelled' && invoice.status !== 'paid' && (
                            <button
                              onClick={() => { setSelectedInvoice(invoice); setShowCancelModal(true); }}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Cancel Invoice"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => { setSelectedInvoice(invoice); setShowDeleteModal(true); }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Invoice"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Payment History</h3>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Record Payment
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.payment_number}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.invoice?.invoice_number || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.patient_name || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {payment.payment_method?.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.payment_date).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Insurance Claims Tab */}
        {activeTab === 'claims' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Insurance Claims</h3>
              <button
                onClick={() => setShowClaimModal(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Claim
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claimed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {claims.map(claim => (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {claim.claim_number}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {claim.patient_name || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {claim.insurance_provider}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(claim.claimed_amount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getClaimStatusColor(claim.status)}`}>
                          {claim.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {claim.status === 'draft' && (
                            <button
                              onClick={() => dispatch(submitInsuranceClaim(claim.id))}
                              className="text-blue-600 hover:text-blue-900"
                              title="Submit Claim"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {claim.status === 'submitted' && (
                            <>
                              <button
                                onClick={() => { setSelectedClaim(claim); setApprovedAmount(claim.claimed_amount); setShowApproveClaimModal(true); }}
                                className="text-green-600 hover:text-green-900"
                                title="Approve Claim"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setSelectedClaim(claim); setShowRejectClaimModal(true); }}
                                className="text-red-600 hover:text-red-900"
                                title="Reject Claim"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button className="text-gray-600 hover:text-gray-900" title="View Details">
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

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div>
            <div className="mb-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.slice(0, 50).map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {log.action?.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.user || 'System'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.created_at).toLocaleString('en-NG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {activeTab === 'invoices' && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      {activeTab === 'payments' && totalPaymentPages > 1 && (
        <Pagination
          currentPage={paymentCurrentPage}
          totalPages={totalPaymentPages}
          onPageChange={setPaymentCurrentPage}
          totalItems={filteredPayments.length}
          itemsPerPage={itemsPerPage}
        />
      )}
      {activeTab === 'claims' && totalClaimPages > 1 && (
        <Pagination
          currentPage={claimCurrentPage}
          totalPages={totalClaimPages}
          onPageChange={setClaimCurrentPage}
          totalItems={filteredClaims.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Create Invoice Modal */}
      <GenericModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        title="Create Invoice"
        size="2xl"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
              <input
                type="text"
                value={invoiceForm.patientId}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, patientId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visit ID (Optional)</label>
              <input
                type="text"
                value={invoiceForm.visitId}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, visitId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
              <input
                type="date"
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          {/* Invoice Items */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Invoice Items</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={itemForm.itemType}
                  onChange={(e) => setItemForm({ ...itemForm, itemType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="consultation">Consultation</option>
                  <option value="drug">Drug/Medication</option>
                  <option value="service">Medical Service</option>
                  <option value="test">Lab Test</option>
                  <option value="procedure">Procedure</option>
                  <option value="admission">Admission</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price *</label>
                <input
                  type="number"
                  value={itemForm.unitPrice}
                  onChange={(e) => setItemForm({ ...itemForm, unitPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Discount</label>
                <input
                  type="number"
                  value={itemForm.discountAmount}
                  onChange={(e) => setItemForm({ ...itemForm, discountAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  step="0.01"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddInvoiceItem}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium text-sm"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          {invoiceForm.items.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Items ({invoiceForm.items.length})</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {invoiceForm.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                    <span>{item.description} x{item.quantity} @ {formatCurrency(item.unitPrice)}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatCurrency(item.lineTotal)}</span>
                      <button
                        type="button"
                        onClick={() => setInvoiceForm(prev => ({
                          ...prev,
                          items: prev.items.filter((_, i) => i !== index)
                        }))}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Subtotal: {formatCurrency(totalInvoiceAmount)}</p>
                <p>Tax: {formatCurrency(totalTax)}</p>
                <p>Discount: {formatCurrency(invoiceForm.discountAmount)}</p>
                <p className="font-bold text-gray-900">Grand Total: {formatCurrency(grandTotal)}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
            >
              Create Invoice
            </button>
            <button
              type="button"
              onClick={() => setShowInvoiceModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </GenericModal>

      {/* Record Payment Modal */}
      <GenericModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Payment"
        size="md"
      >
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice *</label>
            <select
              value={paymentForm.invoiceId}
              onChange={(e) => setPaymentForm({ ...paymentForm, invoiceId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Invoice</option>
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} - {inv.patient_name || 'Unknown'} ({formatCurrency(inv.balance_due)} due)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
            <input
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
            <select
              value={paymentForm.paymentMethod}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Bank Transfer</option>
              <option value="pos">POS</option>
              <option value="paystack">Paystack</option>
              <option value="flutterwave">Flutterwave</option>
              <option value="insurance">Insurance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Reference</label>
            <input
              type="text"
              value={paymentForm.transactionReference}
              onChange={(e) => setPaymentForm({ ...paymentForm, transactionReference: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="2"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
            >
              Record Payment
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
      </GenericModal>

      {/* Insurance Claim Modal */}
      <GenericModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        title="Create Insurance Claim"
        size="md"
      >
        <form onSubmit={handleCreateClaim} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice *</label>
            <select
              value={claimForm.invoiceId}
              onChange={(e) => setClaimForm({ ...claimForm, invoiceId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Invoice</option>
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} - {inv.patient_name || 'Unknown'} ({formatCurrency(inv.total_amount)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider *</label>
            <input
              type="text"
              value={claimForm.insuranceProvider}
              onChange={(e) => setClaimForm({ ...claimForm, insuranceProvider: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
            <input
              type="text"
              value={claimForm.policyNumber}
              onChange={(e) => setClaimForm({ ...claimForm, policyNumber: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Claimed Amount *</label>
            <input
              type="number"
              value={claimForm.claimedAmount}
              onChange={(e) => setClaimForm({ ...claimForm, claimedAmount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={claimForm.notes}
              onChange={(e) => setClaimForm({ ...claimForm, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              rows="2"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 font-medium"
            >
              Create Claim
            </button>
            <button
              type="button"
              onClick={() => setShowClaimModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </GenericModal>

      {/* Invoice Detail Modal */}
      <GenericModal
        isOpen={showInvoiceDetailModal}
        onClose={() => setShowInvoiceDetailModal(false)}
        title="Invoice Details"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Invoice Number</p>
                <p className="font-medium">{selectedInvoice.invoice_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-medium">{selectedInvoice.patient_name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(selectedInvoice.invoice_date).toLocaleDateString('en-NG')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium">{new Date(selectedInvoice.due_date).toLocaleDateString('en-NG')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">{formatCurrency(selectedInvoice.total_amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount Paid</p>
                <p className="font-medium">{formatCurrency(selectedInvoice.amount_paid)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Balance Due</p>
                <p className="font-medium">{formatCurrency(selectedInvoice.balance_due)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedInvoice.status)}`}>
                  {selectedInvoice.status?.replace('_', ' ')}
                </span>
              </div>
            </div>
            {selectedInvoice.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="text-sm">{selectedInvoice.notes}</p>
              </div>
            )}
          </div>
        )}
      </GenericModal>

      {/* Cancel Invoice Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Invoice"
        message={`Are you sure you want to cancel invoice ${selectedInvoice?.invoice_number}?`}
        confirmText="Yes, Cancel"
        cancelText="No"
        type="archive"
      />

      {/* Delete Invoice Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${selectedInvoice?.invoice_number}?`}
        confirmText="Yes, Delete"
        cancelText="No"
        type="delete"
      />

      {/* Approve Claim Modal */}
      <GenericModal
        isOpen={showApproveClaimModal}
        onClose={() => setShowApproveClaimModal(false)}
        title="Approve Insurance Claim"
        size="md"
      >
        <form onSubmit={handleApproveClaim} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approved Amount *</label>
            <input
              type="number"
              value={approvedAmount}
              onChange={(e) => setApprovedAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              step="0.01"
              required
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
            >
              Approve Claim
            </button>
            <button
              type="button"
              onClick={() => setShowApproveClaimModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </GenericModal>

      {/* Reject Claim Modal */}
      <GenericModal
        isOpen={showRejectClaimModal}
        onClose={() => setShowRejectClaimModal(false)}
        title="Reject Insurance Claim"
        size="md"
      >
        <form onSubmit={handleRejectClaim} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason *</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              rows="3"
              required
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
            >
              Reject Claim
            </button>
            <button
              type="button"
              onClick={() => setShowRejectClaimModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </GenericModal>
    </div>
  );
};

export default Billing;
