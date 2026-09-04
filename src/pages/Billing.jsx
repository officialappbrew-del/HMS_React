import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
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
  MoreHorizontal,
  User,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Info,
  Check,
  AlertCircle,
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
import { apiRequest } from '../utils/api';

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

// ==================== BADGE COMPONENT ====================
const StatusBadge = ({ status, type = 'invoice' }) => {
  const getStatusColor = () => {
    const colorMap = {
      'paid': 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      'issued': 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]',
      'partially_paid': 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]',
      'overdue': 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
      'draft': 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      'cancelled': 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      'completed': 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      'pending': 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]',
      'failed': 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
      'refunded': 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      'approved': 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      'submitted': 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]',
      'under_review': 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]',
      'rejected': 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
    };
    const color = colorMap[status] || 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    const label = status?.replace(/_/g, ' ') || 'Unknown';
    return { color, label };
  };

  const { color, label } = getStatusColor();

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${color}`}>
      {label}
    </span>
  );
};

// ==================== MAIN BILLING COMPONENT ====================
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
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditCurrentPage, setAuditCurrentPage] = useState(1);

  const [patients, setPatients] = useState([]);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount) => {
    return new globalThis.Intl.NumberFormat('en-NG', {
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

  const fetchPatients = async (query = '') => {
    setIsLoadingPatients(true);
    try {
      let url = '/api/v1/patients/patients/';
      if (query) {
        url = `/api/v1/patients/patients/?search=${encodeURIComponent(query)}`;
      }
      const data = await apiRequest(url);
      const results = Array.isArray(data) ? data : (data.results || []);
      setPatients(results);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    } finally {
      setIsLoadingPatients(false);
    }
  };

  const handlePatientSearch = (e) => {
    const value = e.target.value;
    setPatientSearchQuery(value);
    setShowPatientDropdown(true);
    if (value.trim().length > 0) {
      fetchPatients(value.trim());
    } else {
      setPatients([]);
    }
  };

  const handleSelectPatient = (patient) => {
    setInvoiceForm({ ...invoiceForm, patientId: patient.id.toString() });
    setSelectedPatientName(patient.name || patient.full_name || '');
    setPatientSearchQuery('');
    setShowPatientDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPatientDropdown && !event.target.closest('.patient-search-dropdown')) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPatientDropdown]);

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

  const filteredAuditLogs = auditLogs.filter((log) => {
    const search = auditSearchQuery.toLowerCase();
    return !search ||
      log.action?.toLowerCase().includes(search) ||
      log.description?.toLowerCase().includes(search) ||
      log.user?.toLowerCase().includes(search);
  });
  const paginatedAuditLogs = filteredAuditLogs.slice(
    (auditCurrentPage - 1) * itemsPerPage,
    auditCurrentPage * itemsPerPage
  );
  const totalAuditPages = Math.ceil(filteredAuditLogs.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    setPaymentCurrentPage(1);
  }, [paymentSearchQuery, paymentStatusFilter]);

  useEffect(() => {
    setClaimCurrentPage(1);
  }, [claimSearchQuery, claimStatusFilter]);

  useEffect(() => {
    setAuditCurrentPage(1);
  }, [auditSearchQuery]);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = buildInvoicePayload();
      await dispatch(createInvoice(payload)).unwrap();
      resetInvoiceForm();
      setShowInvoiceModal(false);
    } catch (err) {
      dispatch(setError(err.message || 'Failed to create invoice.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetInvoiceForm = () => {
    setInvoiceForm({
      patientId: '',
      visitId: '',
      dueDate: '',
      discountAmount: 0,
      taxAmount: 0,
      notes: '',
      items: []
    });
    setPatientSearchQuery('');
    setSelectedPatientName('');
    setShowPatientDropdown(false);
    setPatients([]);
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
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateClaim = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
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
    setIsSubmitting(true);
    if (selectedClaim) {
      try {
        await dispatch(approveClaim({ id: selectedClaim.id, approved_amount: parseFloat(approvedAmount) || selectedClaim.claimed_amount })).unwrap();
        setShowApproveClaimModal(false);
        setSelectedClaim(null);
        setApprovedAmount('');
        dispatch(fetchInsuranceClaims());
      } catch (err) {
        dispatch(setError(err.message || 'Failed to approve claim.'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRejectClaim = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (selectedClaim) {
      try {
        await dispatch(rejectClaim({ id: selectedClaim.id, rejection_reason: rejectionReason })).unwrap();
        setShowRejectClaimModal(false);
        setSelectedClaim(null);
        setRejectionReason('');
        dispatch(fetchInsuranceClaims());
      } catch (err) {
        dispatch(setError(err.message || 'Failed to reject claim.'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const totalInvoiceAmount = invoiceForm.items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  const totalTax = invoiceForm.items.reduce((sum, item) => sum + ((item.lineTotal || 0) * (item.taxRate || 0) / 100), 0);
  const grandTotal = totalInvoiceAmount + totalTax - (invoiceForm.discountAmount || 0);

  // Tabs configuration
  const tabs = [
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'claims', label: 'Insurance Claims', icon: Shield },
    { id: 'audit', label: 'Audit Logs', icon: Shield }
  ];

  return (
    <div className="billing min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D] flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={() => dispatch(clearError())} 
            className="text-[#C8553D] hover:text-[#A8442E] p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Billing & Payments
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Invoice management, payments, and insurance claims
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => {
                dispatch(fetchInvoices());
                dispatch(fetchPayments());
                dispatch(fetchInsuranceClaims());
                dispatch(fetchInvoiceSummary());
                dispatch(fetchAuditLogs());
              }}
              tooltip="Refresh data"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Total Invoices"
          value={summary.total_invoices || 0}
          subValue={`${formatCurrency(summary.invoiced_total || summary.total_invoiced || 0)} invoiced · ${formatCurrency(summary.collected_total || summary.total_paid || 0)} collected`}
          icon={FileText}
          color="blue"
          tooltip="Total number of invoices and revenue generated"
        />
        <StatsCard
          title="Total Paid"
          value={formatCurrency(summary.total_paid)}
          subValue={`${summary.collection_rate || 0}% collection rate`}
          icon={CreditCard}
          color="green"
          tooltip="Total amount collected from payments"
          trend={summary.collection_rate > 70 ? 'up' : 'neutral'}
          trendValue={summary.collection_rate > 70 ? 'Good collection rate' : 'Needs improvement'}
        />
        <StatsCard
          title="Pending Payments"
          value={formatCurrency(summary.total_pending)}
          subValue="Outstanding balance"
          icon={AlertTriangle}
          color="warm"
          tooltip="Total amount pending collection"
          trend={summary.total_pending > 0 ? 'down' : 'neutral'}
          trendValue={summary.total_pending > 0 ? 'Requires attention' : 'All cleared'}
        />
        <StatsCard
          title="Insurance Claims"
          value={claims.length}
          subValue={`${claims.filter(c => c.status === 'approved').length} approved`}
          icon={Shield}
          color="purple"
          tooltip="Total insurance claims submitted"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border border-[#E8E3DC] p-3 sm:p-5 md:p-8 mb-4 sm:mb-8">
        <div className="border-b border-[#E8E3DC] mb-4 sm:mb-6 overflow-x-auto">
          <nav className="flex gap-3 sm:gap-6 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Tooltip key={tab.id} text={`View ${tab.label}`}>
                  <button
                    onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
                    className={`flex items-center gap-1.5 px-1 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#008751] text-[#008751]'
                        : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                    {tab.id === 'claims' && (
                      <span className="w-4 h-4 bg-[#E8F5EF] text-[#008751] text-[10px] flex items-center justify-center border border-[#C8E0D5] ml-0.5">
                        {claims.filter(c => c.status === 'submitted' || c.status === 'under_review').length}
                      </span>
                    )}
                  </button>
                </Tooltip>
              );
            })}
          </nav>
        </div>

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B0A89E]" />
                  <input
                    type="text"
                    placeholder="Search invoices by patient or invoice number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
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
              <ButtonWithTooltip
                onClick={() => setShowInvoiceModal(true)}
                tooltip="Create a new invoice"
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Invoice
              </ButtonWithTooltip>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8E3DC]">
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Invoice #</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Patient</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Date</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Paid</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <Loader2 className="w-8 h-8 text-[#008751] animate-spin mx-auto mb-2" />
                        <p className="text-sm text-[#5A5A5A]">Loading invoices...</p>
                      </td>
                    </tr>
                  ) : paginatedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <FileText className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                        <p className="text-[#5A5A5A] font-medium">No invoices found</p>
                        <p className="text-xs text-[#B0A89E] mt-1">Create your first invoice to get started</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedInvoices.map(invoice => (
                      <tr key={invoice.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-[#1A1A1A]">{invoice.invoice_number}</span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A] hidden sm:table-cell">
                          {invoice.patient_name || 'Unknown'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A] hidden md:table-cell">
                          {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString('en-NG') : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-[#1A1A1A]">
                          {formatCurrency(invoice.total_amount)}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A] hidden lg:table-cell">
                          {formatCurrency(invoice.amount_paid)}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={invoice.status} type="invoice" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {invoice.status === 'draft' && (
                              <IconButton
                                icon={CheckCircle}
                                onClick={() => handleIssueInvoice(invoice.id)}
                                tooltip="Issue Invoice"
                                variant="success"
                                size="sm"
                              />
                            )}
                            <IconButton
                              icon={Eye}
                              onClick={() => handleViewInvoice(invoice)}
                              tooltip="View Details"
                              variant="primary"
                              size="sm"
                            />
                            {invoice.status !== 'cancelled' && invoice.status !== 'paid' && (
                              <IconButton
                                icon={XCircle}
                                onClick={() => { setSelectedInvoice(invoice); setShowCancelModal(true); }}
                                tooltip="Cancel Invoice"
                                variant="warning"
                                size="sm"
                              />
                            )}
                            <IconButton
                              icon={Trash2}
                              onClick={() => { setSelectedInvoice(invoice); setShowDeleteModal(true); }}
                              tooltip="Delete Invoice"
                              variant="danger"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#E8E3DC] gap-2 sm:gap-0">
                <div className="text-[10px] text-[#5A5A5A]">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length}
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
                  <span className="text-xs text-[#5A5A5A]">Page {currentPage} of {totalPages}</span>
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
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B0A89E]" />
                  <input
                    type="text"
                    placeholder="Search payments by patient or payment number..."
                    value={paymentSearchQuery}
                    onChange={(e) => setPaymentSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <ButtonWithTooltip
                onClick={() => setShowPaymentModal(true)}
                tooltip="Record a new payment"
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                Record Payment
              </ButtonWithTooltip>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8E3DC]">
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Payment #</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Invoice</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Method</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Date</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <Loader2 className="w-8 h-8 text-[#008751] animate-spin mx-auto mb-2" />
                        <p className="text-sm text-[#5A5A5A]">Loading payments...</p>
                      </td>
                    </tr>
                  ) : paginatedPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <CreditCard className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                        <p className="text-[#5A5A5A] font-medium">No payments recorded</p>
                        <p className="text-xs text-[#B0A89E] mt-1">Record a payment to get started</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedPayments.map(payment => (
                      <tr key={payment.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-[#1A1A1A]">{payment.payment_number}</span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A] hidden sm:table-cell">
                          {payment.invoice?.invoice_number || 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">
                          {payment.patient_name || 'Unknown'}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-[#2D7D46]">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A] capitalize hidden md:table-cell">
                          {payment.payment_method?.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A] hidden lg:table-cell">
                          {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('en-NG') : 'N/A'}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={payment.status} type="payment" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPaymentPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#E8E3DC] gap-2 sm:gap-0">
                <div className="text-[10px] text-[#5A5A5A]">
                  Showing {(paymentCurrentPage - 1) * itemsPerPage + 1} to {Math.min(paymentCurrentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <IconButton
                    icon={ChevronLeft}
                    onClick={() => setPaymentCurrentPage(prev => Math.max(prev - 1, 1))}
                    tooltip="Previous page"
                    variant="default"
                    disabled={paymentCurrentPage === 1}
                    size="sm"
                  />
                  <span className="text-xs text-[#5A5A5A]">Page {paymentCurrentPage} of {totalPaymentPages}</span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setPaymentCurrentPage(prev => Math.min(prev + 1, totalPaymentPages))}
                    tooltip="Next page"
                    variant="default"
                    disabled={paymentCurrentPage === totalPaymentPages}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Insurance Claims Tab */}
        {activeTab === 'claims' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B0A89E]" />
                  <input
                    type="text"
                    placeholder="Search claims by patient, claim number, or provider..."
                    value={claimSearchQuery}
                    onChange={(e) => setClaimSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <ButtonWithTooltip
                onClick={() => setShowClaimModal(true)}
                tooltip="Create a new insurance claim"
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                New Claim
              </ButtonWithTooltip>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8E3DC]">
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Claim #</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Patient</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Provider</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Claimed</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <Loader2 className="w-8 h-8 text-[#008751] animate-spin mx-auto mb-2" />
                        <p className="text-sm text-[#5A5A5A]">Loading claims...</p>
                      </td>
                    </tr>
                  ) : paginatedClaims.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center">
                        <Shield className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                        <p className="text-[#5A5A5A] font-medium">No insurance claims</p>
                        <p className="text-xs text-[#B0A89E] mt-1">Create your first insurance claim to get started</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedClaims.map(claim => (
                      <tr key={claim.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-[#1A1A1A]">{claim.claim_number}</span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A] hidden sm:table-cell">
                          {claim.patient_name || 'Unknown'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A] hidden md:table-cell">
                          {claim.insurance_provider}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-[#1A1A1A]">
                          {formatCurrency(claim.claimed_amount)}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={claim.status} type="claim" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            {claim.status === 'draft' && (
                              <IconButton
                                icon={CheckCircle}
                                onClick={() => dispatch(submitInsuranceClaim(claim.id))}
                                tooltip="Submit Claim"
                                variant="success"
                                size="sm"
                              />
                            )}
                            {claim.status === 'submitted' && (
                              <>
                                <IconButton
                                  icon={CheckCircle}
                                  onClick={() => { setSelectedClaim(claim); setApprovedAmount(claim.claimed_amount); setShowApproveClaimModal(true); }}
                                  tooltip="Approve Claim"
                                  variant="success"
                                  size="sm"
                                />
                                <IconButton
                                  icon={XCircle}
                                  onClick={() => { setSelectedClaim(claim); setShowRejectClaimModal(true); }}
                                  tooltip="Reject Claim"
                                  variant="danger"
                                  size="sm"
                                />
                              </>
                            )}
                            <IconButton
                              icon={Eye}
                              onClick={() => { setSelectedClaim(claim); setShowInvoiceDetailModal(true); }}
                              tooltip="View Details"
                              variant="primary"
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

            {totalClaimPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#E8E3DC] gap-2 sm:gap-0">
                <div className="text-[10px] text-[#5A5A5A]">
                  Showing {(claimCurrentPage - 1) * itemsPerPage + 1} to {Math.min(claimCurrentPage * itemsPerPage, filteredClaims.length)} of {filteredClaims.length}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <IconButton
                    icon={ChevronLeft}
                    onClick={() => setClaimCurrentPage(prev => Math.max(prev - 1, 1))}
                    tooltip="Previous page"
                    variant="default"
                    disabled={claimCurrentPage === 1}
                    size="sm"
                  />
                  <span className="text-xs text-[#5A5A5A]">Page {claimCurrentPage} of {totalClaimPages}</span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setClaimCurrentPage(prev => Math.min(prev + 1, totalClaimPages))}
                    tooltip="Next page"
                    variant="default"
                    disabled={claimCurrentPage === totalClaimPages}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div>
            <div className="mb-4 sm:mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B0A89E]" />
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E8E3DC]">
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Action</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Description</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">User</th>
                    <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDE8]">
                  {paginatedAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center">
                        <Shield className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                        <p className="text-[#5A5A5A] font-medium">No audit logs available</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedAuditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-[#F7F5F2] transition-colors">
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-[#1A1A1A] capitalize">
                            {log.action?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A] hidden sm:table-cell">
                          {log.description}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A] hidden md:table-cell">
                          {log.user || 'System'}
                        </td>
                        <td className="px-4 py-4 text-sm text-[#5A5A5A]">
                          {log.created_at ? new Date(log.created_at).toLocaleString('en-NG') : 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalAuditPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-[#E8E3DC] gap-2 sm:gap-0">
                <div className="text-[10px] text-[#5A5A5A]">
                  Showing {(auditCurrentPage - 1) * itemsPerPage + 1} to {Math.min(auditCurrentPage * itemsPerPage, filteredAuditLogs.length)} of {filteredAuditLogs.length}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <IconButton
                    icon={ChevronLeft}
                    onClick={() => setAuditCurrentPage((page) => Math.max(page - 1, 1))}
                    tooltip="Previous page"
                    variant="default"
                    disabled={auditCurrentPage === 1}
                    size="sm"
                  />
                  <span className="text-xs text-[#5A5A5A]">Page {auditCurrentPage} of {totalAuditPages}</span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setAuditCurrentPage((page) => Math.min(page + 1, totalAuditPages))}
                    tooltip="Next page"
                    variant="default"
                    disabled={auditCurrentPage === totalAuditPages}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== CREATE INVOICE MODAL ==================== */}
      <GenericModal
        isOpen={showInvoiceModal}
        onClose={() => { resetInvoiceForm(); setShowInvoiceModal(false); }}
        title="Create Invoice"
        size="2xl"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Patient *</label>
              <div className="relative patient-search-dropdown">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                <input
                  type="text"
                  value={selectedPatientName || patientSearchQuery}
                  onChange={handlePatientSearch}
                  onFocus={() => setShowPatientDropdown(true)}
                  placeholder="Search patient by name or hospital number..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  required
                />
                {showPatientDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#E8E3DC] max-h-60 overflow-y-auto">
                    {isLoadingPatients ? (
                      <div className="px-4 py-3 text-sm text-[#5A5A5A] flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-[#008751] animate-spin" />
                        Loading patients...
                      </div>
                    ) : patients.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-[#B0A89E]">No patients found</div>
                    ) : (
                      patients.map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => handleSelectPatient(patient)}
                          className="w-full text-left px-4 py-2 hover:bg-[#F7F5F2] border-b border-[#F0EDE8] last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-[#E8F5EF] flex items-center justify-center text-[#008751] font-medium text-xs flex-shrink-0">
                              {(patient.name || patient.full_name || '?').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#1A1A1A] truncate">
                                {patient.name || patient.full_name}
                              </p>
                              <p className="text-xs text-[#B0A89E] truncate">
                                {patient.hospital_number ? `HN: ${patient.hospital_number}` : patient.email || ''}
                                {patient.phone ? ` • ${patient.phone}` : ''}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {selectedPatientName && (
                <p className="mt-1 text-xs text-[#2D7D46]">Selected: {selectedPatientName}</p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Visit ID (Optional)</label>
              <input
                type="text"
                value={invoiceForm.visitId}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, visitId: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Due Date *</label>
              <input
                type="date"
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Invoice Items */}
          <div className="border-t border-[#E8E3DC] pt-4">
            <h4 className="text-xs font-medium text-[#5A5A5A] uppercase tracking-wider mb-3">Invoice Items</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] mb-1">Type</label>
                <select
                  value={itemForm.itemType}
                  onChange={(e) => setItemForm({ ...itemForm, itemType: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
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
                <label className="block text-[10px] font-medium text-[#5A5A5A] mb-1">Description *</label>
                <input
                  type="text"
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] mb-1">Unit Price *</label>
                <input
                  type="number"
                  value={itemForm.unitPrice}
                  onChange={(e) => setItemForm({ ...itemForm, unitPrice: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] mb-1">Quantity</label>
                <input
                  type="number"
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] mb-1">Discount</label>
                <input
                  type="number"
                  value={itemForm.discountAmount}
                  onChange={(e) => setItemForm({ ...itemForm, discountAmount: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  step="0.01"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddInvoiceItem}
                  className="w-full px-4 py-2 bg-[#5A5A5A] text-white hover:bg-[#4A4A4A] transition-colors font-medium text-sm"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          {invoiceForm.items.length > 0 && (
            <div className="border-t border-[#E8E3DC] pt-4">
              <h4 className="text-xs font-medium text-[#5A5A5A] uppercase tracking-wider mb-2">
                Current Items ({invoiceForm.items.length})
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {invoiceForm.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-[#F7F5F2] border border-[#E8E3DC] text-sm">
                    <span className="text-[#1A1A1A]">{item.description} x{item.quantity} @ {formatCurrency(item.unitPrice)}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#1A1A1A]">{formatCurrency(item.lineTotal)}</span>
                      <button
                        type="button"
                        onClick={() => setInvoiceForm(prev => ({
                          ...prev,
                          items: prev.items.filter((_, i) => i !== index)
                        }))}
                        className="text-[#C8553D] hover:text-[#A8442E]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm">
                <p className="text-[#5A5A5A]">Subtotal: <span className="font-medium text-[#1A1A1A]">{formatCurrency(totalInvoiceAmount)}</span></p>
                <p className="text-[#5A5A5A]">Tax: <span className="font-medium text-[#1A1A1A]">{formatCurrency(totalTax)}</span></p>
                <p className="text-[#5A5A5A]">Discount: <span className="font-medium text-[#1A1A1A]">{formatCurrency(invoiceForm.discountAmount)}</span></p>
                <p className="font-bold text-[#1A1A1A]">Grand Total: {formatCurrency(grandTotal)}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              type="submit"
              tooltip="Create invoice"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              type="button"
              onClick={resetInvoiceForm}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </form>
      </GenericModal>

      {/* ==================== RECORD PAYMENT MODAL ==================== */}
      <GenericModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Payment"
        size="md"
      >
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Invoice *</label>
            <select
              value={paymentForm.invoiceId}
              onChange={(e) => setPaymentForm({ ...paymentForm, invoiceId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
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
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Amount *</label>
            <input
              type="number"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Payment Method *</label>
            <select
              value={paymentForm.paymentMethod}
              onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
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
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Transaction Reference</label>
            <input
              type="text"
              value={paymentForm.transactionReference}
              onChange={(e) => setPaymentForm({ ...paymentForm, transactionReference: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Notes</label>
            <textarea
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              rows={2}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              type="submit"
              tooltip="Record payment"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              type="button"
              onClick={() => setShowPaymentModal(false)}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </form>
      </GenericModal>

      {/* ==================== INSURANCE CLAIM MODAL ==================== */}
      <GenericModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        title="Create Insurance Claim"
        size="md"
      >
        <form onSubmit={handleCreateClaim} className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Invoice *</label>
            <select
              value={claimForm.invoiceId}
              onChange={(e) => setClaimForm({ ...claimForm, invoiceId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
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
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Insurance Provider *</label>
            <input
              type="text"
              value={claimForm.insuranceProvider}
              onChange={(e) => setClaimForm({ ...claimForm, insuranceProvider: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Policy Number</label>
            <input
              type="text"
              value={claimForm.policyNumber}
              onChange={(e) => setClaimForm({ ...claimForm, policyNumber: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Claimed Amount *</label>
            <input
              type="number"
              value={claimForm.claimedAmount}
              onChange={(e) => setClaimForm({ ...claimForm, claimedAmount: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Notes</label>
            <textarea
              value={claimForm.notes}
              onChange={(e) => setClaimForm({ ...claimForm, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              rows={2}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              type="submit"
              tooltip="Create insurance claim"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Claim'}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              type="button"
              onClick={() => setShowClaimModal(false)}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </form>
      </GenericModal>

      {/* ==================== INVOICE DETAIL MODAL ==================== */}
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
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Invoice Number</p>
                <p className="font-medium text-[#1A1A1A]">{selectedInvoice.invoice_number}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patient</p>
                <p className="font-medium text-[#1A1A1A]">{selectedInvoice.patient_name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date</p>
                <p className="text-sm text-[#5A5A5A]">{selectedInvoice.invoice_date ? new Date(selectedInvoice.invoice_date).toLocaleDateString('en-NG') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Due Date</p>
                <p className="text-sm text-[#5A5A5A]">{selectedInvoice.due_date ? new Date(selectedInvoice.due_date).toLocaleDateString('en-NG') : 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Total Amount</p>
                <p className="font-medium text-[#1A1A1A]">{formatCurrency(selectedInvoice.total_amount)}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Amount Paid</p>
                <p className="font-medium text-[#2D7D46]">{formatCurrency(selectedInvoice.amount_paid)}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Balance Due</p>
                <p className="font-medium text-[#C87D3D]">{formatCurrency(selectedInvoice.balance_due)}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</p>
                <StatusBadge status={selectedInvoice.status} type="invoice" />
              </div>
            </div>
            <div className="border-t border-[#E8E3DC] pt-4">
              <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-3">Charge Breakdown</p>
              {selectedInvoice.items?.length ? (
                <div className="divide-y divide-[#F0EDE8] border border-[#E8E3DC]">
                  {selectedInvoice.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 px-3 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#1A1F2E]">{item.description}</p>
                        <p className="text-xs text-[#5A5A5A]">
                          {item.item_type === 'drug' ? 'Dispensed drug' : item.item_type === 'service' ? 'Vital/medical service' : item.item_type}
                          {' · '}Qty {item.quantity} · Unit {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#1A1F2E]">{formatCurrency(item.line_total)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#5A5A5A]">No charge line items recorded.</p>
              )}
            </div>
            <div className="border-t border-[#E8E3DC] pt-4">
              <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-3">Payment History</p>
              {selectedInvoice.payments?.length ? (
                <div className="space-y-2">
                  {selectedInvoice.payments.map((payment) => (
                    <div key={payment.id} className="flex items-start justify-between gap-4 text-sm">
                      <div>
                        <p className="text-[#1A1F2E]">{formatCurrency(payment.amount)} · {payment.payment_method}</p>
                        <p className="text-xs text-[#5A5A5A]">
                          {payment.payment_date ? new Date(payment.payment_date).toLocaleString('en-NG') : 'Date unavailable'} · Confirmed by: {payment.received_by || 'Not recorded'}
                        </p>
                      </div>
                      <StatusBadge status={payment.status} type="payment" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#5A5A5A]">No payments recorded.</p>
              )}
            </div>
            {selectedInvoice.notes && (
              <div className="border-t border-[#E8E3DC] pt-4">
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-[#5A5A5A]">{selectedInvoice.notes}</p>
              </div>
            )}
          </div>
        )}
      </GenericModal>

      {/* ==================== CANCEL INVOICE CONFIRMATION ==================== */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Invoice"
        message={`Are you sure you want to cancel invoice ${selectedInvoice?.invoice_number}? This action cannot be undone.`}
        confirmText="Yes, Cancel"
        cancelText="No"
        type="archive"
      />

      {/* ==================== DELETE INVOICE CONFIRMATION ==================== */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${selectedInvoice?.invoice_number}? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="No"
        type="delete"
      />

      {/* ==================== APPROVE CLAIM MODAL ==================== */}
      <GenericModal
        isOpen={showApproveClaimModal}
        onClose={() => setShowApproveClaimModal(false)}
        title="Approve Insurance Claim"
        size="md"
      >
        <form onSubmit={handleApproveClaim} className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Approved Amount *</label>
            <input
              type="number"
              value={approvedAmount}
              onChange={(e) => setApprovedAmount(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              step="0.01"
              required
            />
            <p className="mt-1 text-xs text-[#B0A89E]">Original claimed: {formatCurrency(selectedClaim?.claimed_amount)}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              type="submit"
              tooltip="Approve claim"
              variant="success"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Approving...' : 'Approve Claim'}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              type="button"
              onClick={() => setShowApproveClaimModal(false)}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </form>
      </GenericModal>

      {/* ==================== REJECT CLAIM MODAL ==================== */}
      <GenericModal
        isOpen={showRejectClaimModal}
        onClose={() => setShowRejectClaimModal(false)}
        title="Reject Insurance Claim"
        size="md"
      >
        <form onSubmit={handleRejectClaim} className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Rejection Reason *</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              rows={3}
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              type="submit"
              tooltip="Reject claim"
              variant="danger"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Rejecting...' : 'Reject Claim'}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              type="button"
              onClick={() => setShowRejectClaimModal(false)}
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

export default Billing;