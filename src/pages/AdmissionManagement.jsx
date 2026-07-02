import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Plus,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Edit,
  Download,
  ArrowRight,
  User,
  Stethoscope,
  Bed,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  Building2,
  Users,
  Activity,
  Heart,
  Clipboard,
  Printer,
  MoreVertical,
  Eye,
  Send,
  UserPlus,
  Home,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Pill,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  HeartPulse
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { syncAdmissions } from '../features/admissionSlice';
import { admissionApi } from '../utils/api';

// Tooltip Component
const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
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
          <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg">
            {text}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
              position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
              'left-[-4px] top-1/2 -translate-y-1/2'
            }`} />
          </div>
        </div>
      )}
    </div>
  );
};

// Icon Button with Tooltip
const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false }) => {
  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-600',
    primary: 'text-blue-600 hover:text-blue-700',
    success: 'text-green-600 hover:text-green-700',
    danger: 'text-red-600 hover:text-red-700',
    warning: 'text-yellow-600 hover:text-yellow-700',
    info: 'text-blue-600 hover:text-blue-700',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded-lg transition-all duration-200 ${variantClasses[variant]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:scale-95'
        }`}
      >
        <Icon className="w-4 h-4" />
      </button>
    </Tooltip>
  );
};

// Button with Tooltip
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '' }) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

// Details View Component - Redesigned
const DetailsView = ({ data }) => {
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Admitted':
        return 'bg-blue-100 text-blue-800';
      case 'Discharged':
        return 'bg-green-100 text-green-800';
      case 'Requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-purple-100 text-purple-800';
      case 'Transferred':
        return 'bg-orange-100 text-orange-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-900 break-words">{value || 'N/A'}</p>
      </div>
    </div>
  );

  const Section = ({ title, children, icon: Icon }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        {Icon && <Icon className="w-4 h-4 text-blue-600" />}
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  // Parse discharge summary if available
  const dischargeSummary = data.dischargeSummary || {};
  const transferHistory = data.transferHistory || [];

  return (
    <div className="space-y-5">
      {/* Header - Patient Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{data.patientName}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
                ID: {data.patientId}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadgeColor(data.status)}`}>
                {data.status}
              </span>
              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
                {data.type === 'request' ? 'Request' : data.type === 'admission' ? 'Admission' : 'Discharge'}
              </span>
            </div>
          </div>
          {data.priority && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              data.priority === 'High' ? 'bg-red-100 text-red-700' :
              data.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {data.priority} Priority
            </span>
          )}
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Section title="Admission Details" icon={FileText}>
          <InfoRow label="Admission ID" value={data.admissionId || data.requestId} icon={FileText} />
          <InfoRow label="Source" value={data.source} icon={Building2} />
          <InfoRow label="Diagnosis" value={data.diagnosis} icon={Stethoscope} />
          <InfoRow label="Ward" value={data.wardName || data.preferredWardType || 'Not assigned'} icon={Bed} />
          {data.bedId && <InfoRow label="Bed" value={data.bedId} icon={Bed} />}
        </Section>

        <Section title="Medical Team" icon={User}>
          {data.consultantName && (
            <InfoRow label="Consultant" value={`${data.consultantName}${data.consultantSpecialty ? ` (${data.consultantSpecialty})` : ''}`} icon={User} />
          )}
          <InfoRow label="Priority Level" value={data.priority || 'Not set'} icon={Activity} />
          {data.expectedStay > 0 && (
            <InfoRow label="Expected Stay" value={`${data.expectedStay} days`} icon={Calendar} />
          )}
          {data.actualStay && (
            <InfoRow label="Actual Stay" value={`${data.actualStay} days`} icon={Calendar} />
          )}
        </Section>
      </div>

      {/* Dates Timeline */}
      <Section title="Timeline" icon={Clock}>
        <div className="space-y-2">
          {data.requestDate && (
            <div className="flex items-center gap-3 text-sm">
              <span className="w-24 text-gray-500">Requested:</span>
              <span className="font-medium text-gray-800">{formatDate(data.requestDate)}</span>
            </div>
          )}
          {data.dateOfAdmission && (
            <div className="flex items-center gap-3 text-sm">
              <span className="w-24 text-gray-500">Admitted:</span>
              <span className="font-medium text-gray-800">{formatDate(data.dateOfAdmission)}</span>
            </div>
          )}
          {data.dischargeDate && (
            <div className="flex items-center gap-3 text-sm">
              <span className="w-24 text-gray-500">Discharged:</span>
              <span className="font-medium text-gray-800">{formatDate(data.dischargeDate)}</span>
            </div>
          )}
          {data.plannedDischargeDate && (
            <div className="flex items-center gap-3 text-sm">
              <span className="w-24 text-gray-500">Planned:</span>
              <span className="font-medium text-gray-800">{formatDate(data.plannedDischargeDate)}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <span className="w-24 text-gray-500">Last Update:</span>
            <span className="font-medium text-gray-800">{formatDate(data.updated_at)}</span>
          </div>
        </div>
      </Section>

      {/* Discharge Summary */}
      {Object.keys(dischargeSummary).length > 0 && (
        <Section title="Discharge Summary" icon={Home}>
          {dischargeSummary.followUpInstructions && (
            <InfoRow label="Follow-up Instructions" value={dischargeSummary.followUpInstructions} icon={Clipboard} />
          )}
          {dischargeSummary.restrictions && (
            <InfoRow label="Activity Restrictions" value={dischargeSummary.restrictions} icon={Activity} />
          )}
          {dischargeSummary.medications && dischargeSummary.medications.length > 0 && (
            <InfoRow label="Medications" value={dischargeSummary.medications.join(', ')} icon={Pill} />
          )}
          {dischargeSummary.appointments && dischargeSummary.appointments.length > 0 && (
            <InfoRow label="Appointments" value={dischargeSummary.appointments.map(d => formatDateShort(d)).join(', ')} icon={Calendar} />
          )}
          {dischargeSummary.lengthOfStay && (
            <InfoRow label="Length of Stay" value={`${dischargeSummary.lengthOfStay} days`} icon={Clock} />
          )}
        </Section>
      )}

      {/* Transfer History */}
      {transferHistory.length > 0 && (
        <Section title="Transfer History" icon={ArrowRight}>
          {transferHistory.map((transfer, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">From:</span>
                <span className="font-medium text-gray-800">{transfer.fromWard || 'N/A'}</span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
                <span className="text-gray-500">To:</span>
                <span className="font-medium text-gray-800">{transfer.toWard || 'N/A'}</span>
              </div>
              {transfer.reason && (
                <p className="text-xs text-gray-500 mt-1">Reason: {transfer.reason}</p>
              )}
              {transfer.transferredAt && (
                <p className="text-xs text-gray-400 mt-1">Transferred: {formatDate(transfer.transferredAt)}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Notes */}
      {data.notes && (
        <Section title="Notes" icon={Clipboard}>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.notes}</p>
          </div>
        </Section>
      )}

      {/* Rejection Reason */}
      {data.rejectionReason && (
        <Section title="Rejection Reason" icon={AlertCircle}>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">{data.rejectionReason}</p>
          </div>
        </Section>
      )}

      {/* Metadata */}
      <div className="text-xs text-gray-400 border-t border-gray-200 pt-3 mt-2">
        <p>Created: {formatDate(data.created_at)}</p>
        <p>ID: {data.id}</p>
      </div>
    </div>
  );
};

const AdmissionManagement = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { admissions, admissionRequests, dischargeSummaries, admissionStatuses, admissionSources } = useSelector(
    state => state.admission
  );
  const { wards } = useSelector(state => state.ward);
  const { patients = [] } = useSelector(state => state.patient || { patients: [] });

  const [activeTab, setActiveTab] = useState('active');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [showDischargeForm, setShowDischargeForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsData, setDetailsData] = useState(null);
  const [notificationModal, setNotificationModal] = useState({ show: false, message: '', type: 'success' });
  const [rejectReasonModal, setRejectReasonModal] = useState({ show: false, requestId: null });
  const [rejectReason, setRejectReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    source: '',
    diagnosis: '',
    preferredWardType: '',
    priority: 'Medium'
  });

  const [dischargeData, setDischargeData] = useState({
    lengthOfStay: 0,
    medications: [],
    followUpInstructions: '',
    restrictions: '',
    appointments: []
  });

  const [transferData, setTransferData] = useState({
    toWardId: '',
    toBedId: '',
    reason: ''
  });

  const getPatientDisplayName = (patient) => {
    if (!patient) return '';
    return patient.name || patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unnamed Patient';
  };

  const getPatientIdentifier = (patient) => {
    if (!patient) return '';
    return patient.hospital_number || patient.hospitalNumber || patient.patient_id || patient.patientId || patient.user_id || patient.userId || patient.id || '';
  };

  const loadAdmissionData = async () => {
    try {
      setIsLoadingSummary(true);
      const [records, summary] = await Promise.all([
        admissionApi.getAdmissions(),
        admissionApi.getSummary(),
      ]);

      const normalizedAdmissions = Array.isArray(records) ? records : records?.results || [];
      const requestItems = normalizedAdmissions.filter((item) =>
        [admissionStatuses.REQUESTED, admissionStatuses.APPROVED, admissionStatuses.REJECTED].includes(item.status)
      );
      const dischargeItems = normalizedAdmissions
        .filter((item) => item.dischargeSummary && Object.keys(item.dischargeSummary).length)
        .map((item) => ({
          summaryId: `DS${item.id}`,
          admissionId: item.admissionId || item.id,
          patientName: item.patientName,
          dischargeDate: item.dischargeDate || item.updatedAt || new Date().toISOString(),
          ...item.dischargeSummary,
        }));
      const transferItems = normalizedAdmissions.flatMap((item) => {
        const transferHistory = Array.isArray(item.transferHistory) ? item.transferHistory : [];
        return transferHistory.map((entry, index) => ({
          transferId: `TF${item.id}-${index + 1}`,
          patientId: item.patientId,
          patientName: item.patientName,
          fromWard: item.wardId,
          fromBedId: item.bedId,
          toWard: entry.toWardId,
          toBedId: entry.toBedId,
          transferDate: entry.transferredAt || new Date().toISOString(),
          reason: entry.reason || '',
          status: 'Completed',
        }));
      });

      dispatch(syncAdmissions({
        admissions: normalizedAdmissions,
        admissionRequests: requestItems,
        dischargeSummaries: dischargeItems,
        wardTransfers: transferItems,
        summary,
      }));
    } catch (error) {
      console.warn('Admission data unavailable, falling back to local state.', error);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  useEffect(() => {
    loadAdmissionData();
  }, [dispatch]);

  useEffect(() => {
    const preselectedPatient = location.state?.preselectedPatient;
    if (preselectedPatient) {
      setFormData((current) => ({
        ...current,
        patientId: preselectedPatient.patientId || preselectedPatient.id || '',
        patientName: preselectedPatient.patientName || preselectedPatient.name || '',
        source: current.source || 'Direct Admission',
      }));
      setPatientSearchQuery(preselectedPatient.patientName || preselectedPatient.name || '');
      setShowAdmissionForm(true);
    }
  }, [location.state]);

  // Derived data
  const activeAdmissions = admissions.filter(a => a.status === admissionStatuses.ADMITTED);
  const dischargedPatients = admissions.filter(a => a.status === admissionStatuses.DISCHARGED);
  const pendingRequests = admissionRequests.filter(r => r.status === admissionStatuses.REQUESTED);
  const approvedRequests = admissionRequests.filter(r => r.status === admissionStatuses.APPROVED);

  // Stats
  const stats = [
    { label: 'Active Admissions', value: activeAdmissions.length, icon: User, color: 'blue' },
    { label: 'Pending Requests', value: pendingRequests.length, icon: Clock, color: 'yellow' },
    { label: 'Approved Requests', value: approvedRequests.length, icon: CheckCircle, color: 'purple' },
    { 
      label: 'Discharged (30 Days)', 
      value: dischargedPatients.filter(p => new Date(p.dischargeDate) > new Date(Date.now() - 2592000000)).length,
      icon: CheckCircle, 
      color: 'green' 
    },
  ];

  const summaryBadge = isLoadingSummary ? 'Syncing…' : 'Live';

  const colorMap = {
    blue: 'border-blue-500 text-blue-500 bg-blue-50',
    yellow: 'border-yellow-500 text-yellow-500 bg-yellow-50',
    purple: 'border-purple-500 text-purple-500 bg-purple-50',
    green: 'border-green-500 text-green-500 bg-green-50',
  };

  // Tabs
  const tabs = [
    { id: 'active', label: 'Active Admissions', count: activeAdmissions.length, icon: User },
    { id: 'pending', label: 'Pending Requests', count: pendingRequests.length, icon: Clock },
    { id: 'approved', label: 'Approved Requests', count: approvedRequests.length, icon: CheckCircle },
    { id: 'discharged', label: 'Discharged', count: dischargedPatients.length, icon: Home },
  ];

  // Handlers
  const handleSubmitAdmissionRequest = async () => {
    if (formData.patientName && formData.source && formData.diagnosis) {
      try {
        await admissionApi.createRequest({
          patientId: formData.patientId || `PAT${Date.now()}`,
          patientName: formData.patientName,
          source: formData.source,
          diagnosis: formData.diagnosis,
          preferredWardType: formData.preferredWardType,
          priority: formData.priority,
        });
        setFormData({
          patientId: '',
          patientName: '',
          source: '',
          diagnosis: '',
          preferredWardType: '',
          priority: 'Medium'
        });
        setShowAdmissionForm(false);
        await loadAdmissionData();
        setNotificationModal({ show: true, message: 'Admission request created successfully!', type: 'success' });
      } catch (error) {
        console.error('Failed to create admission request', error);
        setNotificationModal({ show: true, message: error.message || 'Failed to create admission request', type: 'error' });
      }
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await admissionApi.approve(requestId);
      await loadAdmissionData();
      setNotificationModal({ show: true, message: 'Admission request approved!', type: 'success' });
    } catch (error) {
      console.error('Failed to approve admission request', error);
      setNotificationModal({ show: true, message: error.message || 'Failed to approve admission request', type: 'error' });
    }
  };

  const handleRejectRequest = (requestId) => {
    setRejectReasonModal({ show: true, requestId });
  };

  const submitRejectReason = async () => {
    if (rejectReason.trim()) {
      try {
        await admissionApi.reject(rejectReasonModal.requestId, { reason: rejectReason });
        setRejectReasonModal({ show: false, requestId: null });
        setRejectReason('');
        await loadAdmissionData();
        setNotificationModal({ show: true, message: 'Admission request rejected', type: 'success' });
      } catch (error) {
        console.error('Failed to reject admission request', error);
        setNotificationModal({ show: true, message: error.message || 'Failed to reject admission request', type: 'error' });
      }
    }
  };

  const handleDischarge = (admissionId) => {
    setSelectedAdmission(admissionId);
    setShowDischargeForm(true);
  };

  const submitDischarge = async () => {
    try {
      await admissionApi.discharge(selectedAdmission, {
        summary: {
          ...dischargeData,
          medications: dischargeData.medications.split(',').map((m) => m.trim()).filter(Boolean),
          appointments: dischargeData.appointments.split(',').map((a) => a.trim()).filter(Boolean),
        }
      });
      setShowDischargeForm(false);
      setDischargeData({
        lengthOfStay: 0,
        medications: [],
        followUpInstructions: '',
        restrictions: '',
        appointments: []
      });
      await loadAdmissionData();
      setNotificationModal({ show: true, message: 'Patient discharged successfully!', type: 'success' });
    } catch (error) {
      console.error('Failed to discharge patient', error);
      setNotificationModal({ show: true, message: error.message || 'Failed to discharge patient', type: 'error' });
    }
  };

  const handleTransferPatient = (admissionId) => {
    setSelectedAdmission(admissionId);
    setShowTransferForm(true);
  };

  const submitTransfer = async () => {
    if (transferData.toWardId && transferData.toBedId) {
      try {
        await admissionApi.transfer(selectedAdmission, {
          toWardId: transferData.toWardId,
          toBedId: transferData.toBedId,
          reason: transferData.reason,
        });
        setShowTransferForm(false);
        setTransferData({ toWardId: '', toBedId: '', reason: '' });
        await loadAdmissionData();
        setNotificationModal({ show: true, message: 'Patient transferred successfully!', type: 'success' });
      } catch (error) {
        console.error('Failed to transfer patient', error);
        setNotificationModal({ show: true, message: error.message || 'Failed to transfer patient', type: 'error' });
      }
    }
  };

  const showViewDetails = (data, type) => {
    setDetailsData({ ...data, type });
    setShowDetailsModal(true);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case admissionStatuses.ADMITTED:
        return 'bg-blue-100 text-blue-800';
      case admissionStatuses.DISCHARGED:
        return 'bg-green-100 text-green-800';
      case admissionStatuses.REQUESTED:
        return 'bg-yellow-100 text-yellow-800';
      case admissionStatuses.APPROVED:
        return 'bg-purple-100 text-purple-800';
      case admissionStatuses.TRANSFERRED:
        return 'bg-orange-100 text-orange-800';
      case admissionStatuses.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 font-bold';
      case 'Medium':
        return 'text-yellow-600 font-semibold';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDisplayDate = (value, fallback = 'N/A') => {
    if (!value) return fallback;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDisplayDateTime = (value, fallback = 'N/A') => {
    if (!value) return fallback;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toLocaleString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render functions for each tab
  const renderActiveAdmissions = () => {
    const query = searchQuery.toLowerCase();
    const filtered = activeAdmissions.filter((a) => {
      const patientName = (a.patientName || '').toLowerCase();
      const diagnosis = (a.diagnosis || '').toLowerCase();
      return patientName.includes(query) || diagnosis.includes(query);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search active admissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <ButtonWithTooltip tooltip="Export admission list" variant="secondary">
            <Download className="w-4 h-4" />
            Export
          </ButtonWithTooltip>
        </div>

        {paginated.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No active admissions</p>
            <p className="text-sm text-gray-500 mt-1">All beds are available</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Patient</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Diagnosis</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Ward / Bed</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Admitted</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((admission) => (
                  <tr key={admission.admissionId || admission.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="font-semibold text-gray-900">{admission.patientName}</div>
                      <div className="text-xs text-gray-500">{admission.patientId}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-800">{admission.diagnosis || 'No diagnosis'}</div>
                      <div className="text-xs text-gray-500">Consultant: {admission.consultantName || 'N/A'}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-800">{admission.bedId || 'Unassigned'}</div>
                      <div className="text-xs text-gray-500">{admission.wardName || admission.preferredWardType || 'No ward assigned'}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(admission.status)}`}>
                        {admission.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-700">{formatDisplayDate(admission.dateOfAdmission)}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => handleTransferPatient(admission.admissionId)} className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                          Transfer
                        </button>
                        <button type="button" onClick={() => handleDischarge(admission.admissionId)} className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700">
                          Discharge
                        </button>
                        <button type="button" onClick={() => showViewDetails(admission, 'admission')} className="rounded-md border border-blue-200 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((safeCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(safeCurrentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                icon={ChevronLeft}
                onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                tooltip="Previous page"
                disabled={safeCurrentPage === 1}
              />
              <span className="text-sm text-gray-600">Page {safeCurrentPage} of {totalPages}</span>
              <IconButton
                icon={ChevronRight}
                onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                tooltip="Next page"
                disabled={safeCurrentPage === totalPages}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPendingRequests = () => {
    const query = searchQuery.toLowerCase();
    const filtered = pendingRequests.filter((r) => {
      const patientName = (r.patientName || '').toLowerCase();
      const diagnosis = (r.diagnosis || '').toLowerCase();
      return patientName.includes(query) || diagnosis.includes(query);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

    return (
      <div className="space-y-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {paginated.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No pending requests</p>
            <p className="text-sm text-gray-500 mt-1">All requests have been processed</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Patient</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Diagnosis</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Priority</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Requested</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((request) => (
                  <tr key={request.requestId || request.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="font-semibold text-gray-900">{request.patientName}</div>
                      <div className="text-xs text-gray-500">{request.patientId}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-800">{request.diagnosis || 'No diagnosis'}</div>
                      <div className="text-xs text-gray-500">Source: {request.source || 'N/A'}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className={`font-bold ${getPriorityColor(request.priority)}`}>{request.priority || 'Medium'}</div>
                      <div className="text-xs text-gray-500">Ward: {request.preferredWardType || 'N/A'}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-gray-700">{formatDisplayDate(request.requestDate)}</div>
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => handleApproveRequest(request.requestId)} className="rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700">
                          Approve
                        </button>
                        <button type="button" onClick={() => handleRejectRequest(request.requestId)} className="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700">
                          Reject
                        </button>
                        <button type="button" onClick={() => showViewDetails(request, 'request')} className="rounded-md border border-blue-200 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((safeCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(safeCurrentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                icon={ChevronLeft}
                onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                tooltip="Previous page"
                disabled={safeCurrentPage === 1}
              />
              <span className="text-sm text-gray-600">Page {safeCurrentPage} of {totalPages}</span>
              <IconButton
                icon={ChevronRight}
                onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                tooltip="Next page"
                disabled={safeCurrentPage === totalPages}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderApprovedRequests = () => {
    const query = searchQuery.toLowerCase();
    const filtered = approvedRequests.filter((r) => {
      const patientName = (r.patientName || '').toLowerCase();
      const diagnosis = (r.diagnosis || '').toLowerCase();
      return patientName.includes(query) || diagnosis.includes(query);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search approved requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No approved requests</p>
            <p className="text-sm text-gray-500 mt-1">Pending requests will appear here once approved</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Patient</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Diagnosis</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Ward</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Approved</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((request) => (
                  <tr key={request.requestId || request.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="font-semibold text-gray-900">{request.patientName}</div>
                      <div className="text-xs text-gray-500">{request.patientId}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-800">{request.diagnosis || 'No diagnosis'}</div>
                      <div className="text-xs text-gray-500">Medical Officer: {request.medicalOfficerName || 'N/A'}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-800">{request.preferredWardType || 'N/A'}</div>
                      <div className="text-xs text-gray-500">Priority: {request.priority || 'Medium'}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-gray-700">{formatDisplayDate(request.approvalDate)}</div>
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700">
                          <span className="flex items-center gap-1"><UserPlus className="w-3.5 h-3.5" />Admit</span>
                        </button>
                        <button type="button" onClick={() => showViewDetails(request, 'request')} className="rounded-md border border-blue-200 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((safeCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(safeCurrentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                icon={ChevronLeft}
                onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                tooltip="Previous page"
                disabled={safeCurrentPage === 1}
              />
              <span className="text-sm text-gray-600">Page {safeCurrentPage} of {totalPages}</span>
              <IconButton
                icon={ChevronRight}
                onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                tooltip="Next page"
                disabled={safeCurrentPage === totalPages}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDischargedPatients = () => {
    const query = searchQuery.toLowerCase();
    const filtered = dischargedPatients.filter((p) => {
      const patientName = (p.patientName || '').toLowerCase();
      const diagnosis = (p.diagnosis || '').toLowerCase();
      return patientName.includes(query) || diagnosis.includes(query);
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safeCurrentPage - 1) * itemsPerPage, safeCurrentPage * itemsPerPage);

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search discharged patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No discharged patients</p>
            <p className="text-sm text-gray-500 mt-1">Discharged patients will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Patient</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Diagnosis</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Discharged</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Outcome</th>
                  <th className="px-3 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.map((patient) => (
                  <tr key={patient.admissionId || patient.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="font-semibold text-gray-900">{patient.patientName}</div>
                      <div className="text-xs text-gray-500">{patient.patientId}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-800">{patient.diagnosis || 'No diagnosis'}</div>
                      <div className="text-xs text-gray-500">Length of Stay: {patient.actualStay || 'N/A'} days</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-gray-700">{formatDisplayDate(patient.dischargeDate)}</div>
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm text-green-600 font-medium">Discharged</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                          Summary
                        </button>
                        <button type="button" onClick={() => showViewDetails(patient, 'discharge')} className="rounded-md border border-blue-200 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((safeCurrentPage - 1) * itemsPerPage) + 1} to {Math.min(safeCurrentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                icon={ChevronLeft}
                onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                tooltip="Previous page"
                disabled={safeCurrentPage === 1}
              />
              <span className="text-sm text-gray-600">Page {safeCurrentPage} of {totalPages}</span>
              <IconButton
                icon={ChevronRight}
                onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                tooltip="Next page"
                disabled={safeCurrentPage === totalPages}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'active':
        return renderActiveAdmissions();
      case 'pending':
        return renderPendingRequests();
      case 'approved':
        return renderApprovedRequests();
      case 'discharged':
        return renderDischargedPatients();
      default:
        return renderActiveAdmissions();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Admission Management 
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Manage patient admissions, transfers, and discharges
            </p>
            <span className="inline-flex mt-2 items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
              {summaryBadge} admission sync
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonWithTooltip
              onClick={() => setShowAdmissionForm(true)}
              tooltip="Create a new admission request"
              variant="primary"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">New Request</span>
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Stats Grid - Tooltips REMOVED from these stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
          <nav className="flex gap-4 sm:gap-6 min-w-max" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Tooltip key={tab.id} text={`View ${tab.label.toLowerCase()}`}>
                  <button
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentPage(1);
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-1.5 sm:gap-2 px-1 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">{tab.label}</span>
                    <span className="xs:hidden">{tab.id}</span>
                    <span className="ml-1 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  </button>
                </Tooltip>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
          {renderTabContent()}
        </div>
      </div>

      {/* Admission Request Form Modal */}
      {showAdmissionForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-8">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowAdmissionForm(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">New Admission Request</h2>
                <IconButton
                  icon={X}
                  onClick={() => setShowAdmissionForm(false)}
                  tooltip="Close form"
                  variant="default"
                />
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Existing Patient</label>
                    <input
                      type="text"
                      value={patientSearchQuery || formData.patientName}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPatientSearchQuery(value);
                        setFormData({
                          ...formData,
                          patientName: value,
                          patientId: '',
                        });
                      }}
                      placeholder="Search by patient name or user ID"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {patientSearchQuery && (
                      <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                        {patients.filter((patient) => {
                          const name = getPatientDisplayName(patient).toLowerCase();
                          const identifier = String(getPatientIdentifier(patient) || '').toLowerCase();
                          const userId = String(patient?.user_id || patient?.userId || '').toLowerCase();
                          const searchValue = patientSearchQuery.toLowerCase();
                          return name.includes(searchValue) || identifier.includes(searchValue) || userId.includes(searchValue);
                        }).slice(0, 8).map((patient) => {
                          const patientName = getPatientDisplayName(patient);
                          const patientIdentifier = getPatientIdentifier(patient);
                          return (
                            <button
                              key={patient.id}
                              type="button"
                              onClick={() => {
                                setFormData((current) => ({
                                  ...current,
                                  patientId: patientIdentifier,
                                  patientName,
                                }));
                                setPatientSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0"
                            >
                              <span className="font-medium text-gray-900">{patientName}</span>
                              {patientIdentifier && (
                                <span className="text-xs text-gray-500 ml-2">ID: {patientIdentifier}</span>
                              )}
                            </button>
                          );
                        })}
                        {patients.filter((patient) => {
                          const name = getPatientDisplayName(patient).toLowerCase();
                          const identifier = String(getPatientIdentifier(patient) || '').toLowerCase();
                          const userId = String(patient?.user_id || patient?.userId || '').toLowerCase();
                          const searchValue = patientSearchQuery.toLowerCase();
                          return name.includes(searchValue) || identifier.includes(searchValue) || userId.includes(searchValue);
                        }).length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500">No matching patient found</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Patient Name *</label>
                    <input
                      type="text"
                      placeholder="Enter patient name"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Admission Source *</label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Admission Source</option>
                      {Object.entries(admissionSources).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Diagnosis *</label>
                    <input
                      type="text"
                      placeholder="Enter diagnosis"
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Ward Type</label>
                    <input
                      type="text"
                      placeholder="e.g., General Ward, Private Ward, ICU"
                      value={formData.preferredWardType}
                      onChange={(e) => setFormData({ ...formData, preferredWardType: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={handleSubmitAdmissionRequest}
                    className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdmissionForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 sm:py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discharge Form Modal */}
      {showDischargeForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-8">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowDischargeForm(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Discharge Patient</h2>
                <IconButton
                  icon={X}
                  onClick={() => setShowDischargeForm(false)}
                  tooltip="Close form"
                  variant="default"
                />
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Medications (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., Paracetamol 500mg, Amoxicillin 250mg"
                      value={dischargeData.medications}
                      onChange={(e) => setDischargeData({ ...dischargeData, medications: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Follow-up Instructions</label>
                    <textarea
                      placeholder="Enter follow-up instructions"
                      value={dischargeData.followUpInstructions}
                      onChange={(e) => setDischargeData({ ...dischargeData, followUpInstructions: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Activity Restrictions</label>
                    <textarea
                      placeholder="Enter any activity restrictions"
                      value={dischargeData.restrictions}
                      onChange={(e) => setDischargeData({ ...dischargeData, restrictions: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Follow-up Appointments (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="e.g., 2024-02-15, 2024-03-15"
                      value={dischargeData.appointments}
                      onChange={(e) => setDischargeData({ ...dischargeData, appointments: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={submitDischarge}
                    className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Discharge Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDischargeForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 sm:py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Form Modal */}
      {showTransferForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-8">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowTransferForm(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Transfer Patient to Another Ward</h2>
                <IconButton
                  icon={X}
                  onClick={() => setShowTransferForm(false)}
                  tooltip="Close form"
                  variant="default"
                />
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Destination Ward *</label>
                    <select
                      value={transferData.toWardId}
                      onChange={(e) => setTransferData({ ...transferData, toWardId: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Destination Ward</option>
                      {wards.map(ward => (
                        <option key={ward.wardId} value={ward.wardId}>
                          {ward.wardName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Destination Bed ID *</label>
                    <input
                      type="text"
                      placeholder="e.g., W002-B001"
                      value={transferData.toBedId}
                      onChange={(e) => setTransferData({ ...transferData, toBedId: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Reason for Transfer</label>
                    <textarea
                      placeholder="Enter reason for transfer"
                      value={transferData.reason}
                      onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <button
                    onClick={submitTransfer}
                    className="flex-1 bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Transfer Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTransferForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 sm:py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectReasonModal.show && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-8">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setRejectReasonModal({ show: false, requestId: null })} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Admission Request</h3>
                <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejecting this admission request.</p>
                <textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={submitRejectReason}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                    disabled={!rejectReason.trim()}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setRejectReasonModal({ show: false, requestId: null })}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal - Redesigned with DetailsView component */}
      {showDetailsModal && detailsData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-8">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowDetailsModal(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Patient Details</h2>
                <IconButton
                  icon={X}
                  onClick={() => setShowDetailsModal(false)}
                  tooltip="Close"
                  variant="default"
                />
              </div>
              <div className="p-4 sm:p-6">
                <DetailsView data={detailsData} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notificationModal.show && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setNotificationModal({ show: false, message: '', type: 'success' })} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  notificationModal.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {notificationModal.type === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {notificationModal.type === 'success' ? 'Success!' : 'Error!'}
                </h3>
                <p className="text-sm text-gray-600">{notificationModal.message}</p>
                <button
                  onClick={() => setNotificationModal({ show: false, message: '', type: 'success' })}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionManagement;