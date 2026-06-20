import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
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
import {
  createAdmissionRequest,
  approveAdmissionRequest,
  rejectAdmissionRequest,
  admitPatient,
  dischargePatient,
  transferPatientAdmission,
  addAdmissionDocument
} from '../features/admissionSlice';

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

const AdmissionManagement = () => {
  const dispatch = useDispatch();
  const { admissions, admissionRequests, dischargeSummaries, admissionStatuses, admissionSources } = useSelector(
    state => state.admission
  );
  const { wards } = useSelector(state => state.ward);

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
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const itemsPerPage = 5;

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
  const handleSubmitAdmissionRequest = () => {
    if (formData.patientName && formData.source && formData.diagnosis) {
      dispatch(
        createAdmissionRequest({
          patientId: formData.patientId || `PAT${Date.now()}`,
          patientName: formData.patientName,
          source: formData.source,
          diagnosis: formData.diagnosis,
          preferredWardType: formData.preferredWardType,
          priority: formData.priority
        })
      );
      setFormData({
        patientId: '',
        patientName: '',
        source: '',
        diagnosis: '',
        preferredWardType: '',
        priority: 'Medium'
      });
      setShowAdmissionForm(false);
      setNotificationModal({ show: true, message: 'Admission request created successfully!', type: 'success' });
    }
  };

  const handleApproveRequest = (requestId) => {
    dispatch(approveAdmissionRequest(requestId));
    setNotificationModal({ show: true, message: 'Admission request approved!', type: 'success' });
  };

  const handleRejectRequest = (requestId) => {
    setRejectReasonModal({ show: true, requestId });
  };

  const submitRejectReason = () => {
    if (rejectReason.trim()) {
      dispatch(rejectAdmissionRequest({ requestId: rejectReasonModal.requestId, reason: rejectReason }));
      setRejectReasonModal({ show: false, requestId: null });
      setRejectReason('');
      setNotificationModal({ show: true, message: 'Admission request rejected', type: 'success' });
    }
  };

  const handleDischarge = (admissionId) => {
    setSelectedAdmission(admissionId);
    setShowDischargeForm(true);
  };

  const submitDischarge = () => {
    dispatch(
      dischargePatient({
        admissionId: selectedAdmission,
        summary: {
          ...dischargeData,
          medications: dischargeData.medications.split(',').map(m => m.trim()),
          appointments: dischargeData.appointments.split(',').map(a => a.trim())
        }
      })
    );
    setShowDischargeForm(false);
    setDischargeData({
      lengthOfStay: 0,
      medications: [],
      followUpInstructions: '',
      restrictions: '',
      appointments: []
    });
    setNotificationModal({ show: true, message: 'Patient discharged successfully!', type: 'success' });
  };

  const handleTransferPatient = (admissionId) => {
    setSelectedAdmission(admissionId);
    setShowTransferForm(true);
  };

  const submitTransfer = () => {
    if (transferData.toWardId && transferData.toBedId) {
      dispatch(
        transferPatientAdmission({
          admissionId: selectedAdmission,
          toWardId: transferData.toWardId,
          toBedId: transferData.toBedId,
          reason: transferData.reason
        })
      );
      setShowTransferForm(false);
      setTransferData({ toWardId: '', toBedId: '', reason: '' });
      setNotificationModal({ show: true, message: 'Patient transferred successfully!', type: 'success' });
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

  // Render functions for each tab
  const renderActiveAdmissions = () => {
    const filtered = activeAdmissions.filter(a => 
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return (
      <div className="space-y-4">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <ButtonWithTooltip
            tooltip="Export admission list"
            variant="secondary"
          >
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
          paginated.map(admission => (
            <div key={admission.admissionId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Patient</p>
                  <p className="font-semibold text-gray-900">{admission.patientName}</p>
                  <p className="text-sm text-gray-500">{admission.patientId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Diagnosis</p>
                  <p className="font-medium text-gray-800">{admission.diagnosis}</p>
                  <p className="text-xs text-gray-500">Consultant: {admission.consultantName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Bed & Ward</p>
                  <p className="font-medium text-gray-800">{admission.bedId}</p>
                  <p className="text-xs text-gray-500">{admission.wardName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(admission.status)}`}>
                    {admission.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Admitted: {new Date(admission.dateOfAdmission).toLocaleDateString('en-NG')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <ButtonWithTooltip
                  onClick={() => handleTransferPatient(admission.admissionId)}
                  tooltip="Transfer patient to another ward"
                  variant="secondary"
                >
                  <ArrowRight className="w-4 h-4" />
                  Transfer Ward
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={() => handleDischarge(admission.admissionId)}
                  tooltip="Discharge patient from hospital"
                  variant="success"
                >
                  <CheckCircle className="w-4 h-4" />
                  Discharge
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={() => showViewDetails(admission, 'admission')}
                  tooltip="View full admission details"
                  variant="secondary"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View Details</span>
                </ButtonWithTooltip>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        {filtered.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                icon={ChevronLeft}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                tooltip="Previous page"
                disabled={currentPage === 1}
              />
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <IconButton
                icon={ChevronRight}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                tooltip="Next page"
                disabled={currentPage === totalPages}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPendingRequests = () => {
    const filtered = pendingRequests.filter(r => 
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No pending requests</p>
            <p className="text-sm text-gray-500 mt-1">All requests have been processed</p>
          </div>
        ) : (
          filtered.map(request => (
            <div key={request.requestId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Patient</p>
                  <p className="font-semibold text-gray-900">{request.patientName}</p>
                  <p className="text-sm text-gray-500">{request.patientId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Diagnosis</p>
                  <p className="font-medium text-gray-800">{request.diagnosis}</p>
                  <p className="text-xs text-gray-500">Source: {request.source}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Priority</p>
                  <p className={`font-bold ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </p>
                  <p className="text-xs text-gray-500">Ward: {request.preferredWardType}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Requested</p>
                  <p className="text-sm">{new Date(request.requestDate).toLocaleDateString('en-NG')}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <ButtonWithTooltip
                  onClick={() => handleApproveRequest(request.requestId)}
                  tooltip="Approve this admission request"
                  variant="success"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={() => handleRejectRequest(request.requestId)}
                  tooltip="Reject this admission request"
                  variant="danger"
                >
                  <X className="w-4 h-4" />
                  Reject
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={() => showViewDetails(request, 'request')}
                  tooltip="View request details"
                  variant="secondary"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </ButtonWithTooltip>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderApprovedRequests = () => {
    const filtered = approvedRequests.filter(r => 
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No approved requests</p>
            <p className="text-sm text-gray-500 mt-1">Pending requests will appear here once approved</p>
          </div>
        ) : (
          filtered.map(request => (
            <div key={request.requestId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Patient</p>
                  <p className="font-semibold text-gray-900">{request.patientName}</p>
                  <p className="text-sm text-gray-500">{request.patientId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Diagnosis</p>
                  <p className="font-medium text-gray-800">{request.diagnosis}</p>
                  <p className="text-xs text-gray-500">Medical Officer: {request.medicalOfficerName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Ward</p>
                  <p className="font-medium text-gray-800">{request.preferredWardType}</p>
                  <p className="text-xs text-gray-500">Priority: {request.priority}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Approved</p>
                  <p className="text-sm">{new Date(request.approvalDate).toLocaleDateString('en-NG')}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <ButtonWithTooltip
                  tooltip="Assign bed and admit patient"
                  variant="primary"
                >
                  <UserPlus className="w-4 h-4" />
                  Admit Patient
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={() => showViewDetails(request, 'request')}
                  tooltip="View request details"
                  variant="secondary"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </ButtonWithTooltip>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderDischargedPatients = () => {
    const filtered = dischargedPatients.filter(p => 
      p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No discharged patients</p>
            <p className="text-sm text-gray-500 mt-1">Discharged patients will appear here</p>
          </div>
        ) : (
          filtered.map(patient => (
            <div key={patient.admissionId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Patient</p>
                  <p className="font-semibold text-gray-900">{patient.patientName}</p>
                  <p className="text-sm text-gray-500">{patient.patientId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Diagnosis</p>
                  <p className="font-medium text-gray-800">{patient.diagnosis}</p>
                  <p className="text-xs text-gray-500">Length of Stay: {patient.actualStay || 'N/A'} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Discharged</p>
                  <p className="text-sm">{patient.dischargeDate ? new Date(patient.dischargeDate).toLocaleDateString('en-NG') : 'N/A'}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Outcome</p>
                  <p className="text-sm text-green-600 font-medium">Discharged</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <ButtonWithTooltip
                  tooltip="Download discharge summary"
                  variant="secondary"
                >
                  <Download className="w-4 h-4" />
                  Download Summary
                </ButtonWithTooltip>
                <ButtonWithTooltip
                  onClick={() => showViewDetails(patient, 'discharge')}
                  tooltip="View discharge records"
                  variant="secondary"
                >
                  <FileText className="w-4 h-4" />
                  View Records
                </ButtonWithTooltip>
              </div>
            </div>
          ))
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Tooltip key={index} text={`${stat.label}: ${stat.value}`}>
                <div className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help`}>
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
              </Tooltip>
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

      {/* Details Modal */}
      {showDetailsModal && detailsData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-4 sm:py-8">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowDetailsModal(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Details</h2>
                <IconButton
                  icon={X}
                  onClick={() => setShowDetailsModal(false)}
                  tooltip="Close"
                  variant="default"
                />
              </div>
              <div className="p-4 sm:p-6">
                <pre className="text-xs sm:text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {JSON.stringify(detailsData, null, 2)}
                </pre>
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