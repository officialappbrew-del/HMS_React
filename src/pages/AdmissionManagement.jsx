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
  Bed
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

  const activeAdmissions = admissions.filter(a => a.status === admissionStatuses.ADMITTED);
  const dischargedPatients = admissions.filter(a => a.status === admissionStatuses.DISCHARGED);
  const pendingRequests = admissionRequests.filter(r => r.status === admissionStatuses.REQUESTED);
  const approvedRequests = admissionRequests.filter(r => r.status === admissionStatuses.APPROVED);

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

  return (
    <div className="admission-management px-3 sm:px-4 lg:px-6 py-4 sm:py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3 flex-wrap">
            <FileText className="w-6 sm:w-8 h-6 sm:h-8 text-nigerian-green flex-shrink-0" />
            <span>Admission Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Manage patient admissions, transfers, and discharges</p>
        </div>
        <button
          onClick={() => setShowAdmissionForm(true)}
          className="px-3 sm:px-6 py-2 sm:py-3 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
        >
          <Plus className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
          <span className="hidden sm:inline">New Admission Request</span>
          <span className="sm:hidden">New Request</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Admissions</p>
              <p className="text-3xl font-bold mt-2">{activeAdmissions.length}</p>
            </div>
            <User className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Requests</p>
              <p className="text-3xl font-bold mt-2">{pendingRequests.length}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Approved Requests</p>
              <p className="text-3xl font-bold mt-2">{approvedRequests.length}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Discharged (30 Days)</p>
              <p className="text-3xl font-bold mt-2">
                {dischargedPatients.filter(
                  p => new Date(p.dischargeDate) > new Date(Date.now() - 2592000000)
                ).length}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-6 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === 'active'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="sm:hidden">Active ({activeAdmissions.length})</span>
          <span className="hidden sm:inline">Active Admissions ({activeAdmissions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === 'pending'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="sm:hidden">Pending ({pendingRequests.length})</span>
          <span className="hidden sm:inline">Pending Requests ({pendingRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === 'approved'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="sm:hidden">Approved ({approvedRequests.length})</span>
          <span className="hidden sm:inline">Approved Requests ({approvedRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('discharged')}
          className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === 'discharged'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Discharged ({dischargedPatients.length})
        </button>
      </div>

      {/* Active Admissions */}
      {activeTab === 'active' && (
        <div className="space-y-4 mb-8">
          {activeAdmissions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No active admissions</p>
            </div>
          ) : (
            activeAdmissions.map(admission => (
              <div key={admission.admissionId} className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-bold text-lg">{admission.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diagnosis</p>
                    <p className="font-semibold">{admission.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultant</p>
                    <p className="font-semibold">{admission.consultantName}</p>
                    <p className="text-xs text-gray-600">{admission.consultantSpecialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bed Assignment</p>
                    <p className="font-semibold">{admission.bedId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Admission Date</p>
                    <p className="text-xs">
                      {new Date(admission.dateOfAdmission).toLocaleDateString('en-NG')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Days in Hospital</p>
                    <p className="font-semibold">
                      {Math.floor(
                        (new Date() - new Date(admission.dateOfAdmission)) / 86400000
                      )}{' '}
                      days
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected Stay</p>
                    <p className="font-semibold">{admission.expectedStay} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Discharge Date</p>
                    <p className="text-xs">
                      {new Date(admission.plannedDischargeDate).toLocaleDateString('en-NG')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleTransferPatient(admission.admissionId)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Transfer Ward
                  </button>
                  <button
                    onClick={() => handleDischarge(admission.admissionId)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Discharge Patient
                  </button>
                  <button
                    onClick={() => showViewDetails(admission, 'admission')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pending Requests */}
      {activeTab === 'pending' && (
        <div className="space-y-4 mb-8">
          {pendingRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No pending requests</p>
            </div>
          ) : (
            pendingRequests.map(request => (
              <div key={request.requestId} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-bold text-lg">{request.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diagnosis</p>
                    <p className="font-semibold">{request.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priority</p>
                    <p className={`font-bold ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Source</p>
                    <p className="font-semibold">{request.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preferred Ward Type</p>
                    <p className="font-semibold">{request.preferredWardType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Request Date</p>
                    <p className="text-xs">
                      {new Date(request.requestDate).toLocaleDateString('en-NG')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={() => handleApproveRequest(request.requestId)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.requestId)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Approved Requests */}
      {activeTab === 'approved' && (
        <div className="space-y-4 mb-8">
          {approvedRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No approved requests</p>
            </div>
          ) : (
            approvedRequests.map(request => (
              <div key={request.requestId} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-bold text-lg">{request.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diagnosis</p>
                    <p className="font-semibold">{request.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Medical Officer</p>
                    <p className="font-semibold">{request.medicalOfficerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preferred Ward</p>
                    <p className="font-semibold text-sm">{request.preferredWardType}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                    <Plus className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Assign Bed & Admit</span>
                    <span className="sm:hidden">Assign Bed</span>
                  </button>
                  <button
                    onClick={() => showViewDetails(request, 'request')}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">View Details</span>
                    <span className="sm:hidden">Details</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Discharged Patients */}
      {activeTab === 'discharged' && (
        <div className="space-y-4 mb-8">
          {dischargedPatients.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No discharged patients</p>
            </div>
          ) : (
            dischargedPatients.map(patient => (
              <div key={patient.admissionId} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-bold text-lg">{patient.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Discharge Date</p>
                    <p className="font-semibold">
                      {patient.dischargeDate
                        ? new Date(patient.dischargeDate).toLocaleDateString('en-NG')
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Length of Stay</p>
                    <p className="font-semibold">{patient.actualStay || 'N/A'} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Diagnosis</p>
                    <p className="font-semibold text-sm">{patient.diagnosis}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                    <Download className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Download Summary</span>
                    <span className="sm:hidden">Download</span>
                  </button>
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">View Records</span>
                    <span className="sm:hidden">Records</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Admission Request Form Modal */}
      {showAdmissionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-2xl w-full max-h-screen sm:max-h-96 overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">New Admission Request</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Patient Name"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Admission Source</option>
                {Object.entries(admissionSources).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Preferred Ward Type"
                value={formData.preferredWardType}
                onChange={(e) => setFormData({ ...formData, preferredWardType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <div className="flex gap-2 mt-4 sm:mt-6">
                <button
                  onClick={handleSubmitAdmissionRequest}
                  className="flex-1 bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-sm"
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowAdmissionForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discharge Form Modal */}
      {showDischargeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-2xl w-full max-h-screen sm:max-h-96 overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Discharge Patient</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Medications (comma-separated)"
                value={dischargeData.medications}
                onChange={(e) => setDischargeData({ ...dischargeData, medications: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Follow-up Instructions"
                value={dischargeData.followUpInstructions}
                onChange={(e) => setDischargeData({ ...dischargeData, followUpInstructions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows="3"
              />
              <textarea
                placeholder="Activity Restrictions"
                value={dischargeData.restrictions}
                onChange={(e) => setDischargeData({ ...dischargeData, restrictions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows="3"
              />
              <input
                type="text"
                placeholder="Follow-up Appointments (comma-separated)"
                value={dischargeData.appointments}
                onChange={(e) => setDischargeData({ ...dischargeData, appointments: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex gap-2 mt-4 sm:mt-6">
                <button
                  onClick={submitDischarge}
                  className="flex-1 bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-sm"
                >
                  Discharge
                </button>
                <button
                  onClick={() => setShowDischargeForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Form Modal */}
      {showTransferForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 max-w-2xl w-full max-h-screen sm:max-h-96 overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Transfer Patient to Another Ward</h3>
            <div className="space-y-4">
              <select
                value={transferData.toWardId}
                onChange={(e) => setTransferData({ ...transferData, toWardId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Destination Ward</option>
                {wards.map(ward => (
                  <option key={ward.wardId} value={ward.wardId}>
                    {ward.wardName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Destination Bed ID (e.g., W002-B001)"
                value={transferData.toBedId}
                onChange={(e) => setTransferData({ ...transferData, toBedId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Reason for Transfer"
                value={transferData.reason}
                onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows="3"
              />
              <div className="flex gap-2 mt-4 sm:mt-6">
                <button
                  onClick={submitTransfer}
                  className="flex-1 bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-sm"
                >
                  Transfer
                </button>
                <button
                  onClick={() => setShowTransferForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium text-sm"
                >
                  Cancel
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
