import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Bed,
  Filter,
  Plus,
  RefreshCw,
  AlertCircle,
  Check,
  Clock,
  Trash2,
  MapPin,
  Users,
  TrendingUp,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Grid,
  List,
  Printer,
  Download,
  Edit,
  Eye,
  Calendar,
  User,
  Building2,
  Activity,
  Clipboard,
  Settings,
  HelpCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  Home,
  FileText,
  BarChart3,
  PieChart,
  DollarSign,
  Hospital,
  Stethoscope,
  HeartPulse,
  Pill,
  Ambulance,
  Microscope,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Camera,
  Video,
  Music,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { fetchWards, fetchBeds, fetchBedStats, selectWard, occupyBed, releaseBed, reserveBed, markBedAvailable, createWard, updateWard, deleteWard, createBed, updateBed, deleteBed } from '../features/bedSlice.jsx';
import { setPatients, searchPatients } from '../features/patientSlice';
import { apiRequest, wardRoundApi } from '../utils/api';

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

const BedAllocation = () => {
  const dispatch = useDispatch();
  const { wards, selectedWard, stats, bedStatus, beds, loading, error } = useSelector(state => state.bed);
  const { patients, filteredPatients, loading: patientsLoading, error: patientError } = useSelector(state => state.patient || { patients: [], filteredPatients: [], loading: false, error: null });
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedBed, setSelectedBed] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [actionMode, setActionMode] = useState('reserve');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [reservationData, setReservationData] = useState({
    bedId: '',
    bedLabel: '',
    patientId: ''
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedWardInfo, setExpandedWardInfo] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createMode, setCreateMode] = useState('ward');
  const [wardForm, setWardForm] = useState({
    wardId: '',
    wardName: '',
    wardType: 'General Ward',
    floor: '1',
    supervisor: '',
    staffCount: '4',
    totalBeds: '4'
  });
  const [bedForm, setBedForm] = useState({
    bedId: '',
    bedNumber: '1',
    bedType: 'Standard',
    status: 'Available'
  });
  const [feedbackModal, setFeedbackModal] = useState({ open: false, title: '', message: '', type: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);
const [patientQuery, setPatientQuery] = useState('');
  const [selectedPatientOption, setSelectedPatientOption] = useState(null);
  // Edit/Delete state for wards and beds
  const [editingWard, setEditingWard] = useState(null);
  const [showEditWardForm, setShowEditWardForm] = useState(false);
  const [editWardForm, setEditWardForm] = useState({
    id: null,
    wardId: '',
    wardName: '',
    wardType: 'General Ward',
    floor: '1',
    supervisor: '',
    staffCount: '4',
    totalBeds: '4'
  });
  const [editingBed, setEditingBed] = useState(null);
  const [showEditBedForm, setShowEditBedForm] = useState(false);
  const [editBedForm, setEditBedForm] = useState({
    id: null,
    bedId: '',
    bedNumber: '1',
    bedType: 'Standard',
    status: 'Available'
  });

  const getBedStatusColor = (status) => {
    switch (status) {
      case bedStatus.OCCUPIED:
        return 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100';
      case bedStatus.AVAILABLE:
        return 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100';
      case bedStatus.RESERVED:
        return 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100';
      case bedStatus.UNDER_CLEANING:
        return 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100';
      case bedStatus.MAINTENANCE:
        return 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-gray-50 border-gray-300 hover:bg-gray-100';
    }
  };

  const getBedStatusIcon = (status) => {
    switch (status) {
      case bedStatus.OCCUPIED:
        return <Users className="w-4 h-4 sm:w-5 sm:h-5" />;
      case bedStatus.AVAILABLE:
        return <Check className="w-4 h-4 sm:w-5 sm:h-5" />;
      case bedStatus.RESERVED:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5" />;
      case bedStatus.UNDER_CLEANING:
        return <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />;
      case bedStatus.MAINTENANCE:
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return null;
    }
  };

  const getBedStatusBadge = (status) => {
    const badges = {
      'Occupied': 'bg-red-100 text-red-800',
      'Available': 'bg-green-100 text-green-800',
      'Reserved': 'bg-yellow-100 text-yellow-800',
      'Under Cleaning': 'bg-blue-100 text-blue-800',
      'Maintenance': 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const normalizePatient = (patient) => {
    const fullName = patient.full_name || patient.name || [patient.first_name, patient.last_name].filter(Boolean).join(' ').trim() || 'Unknown Patient';
    const hospitalNumber = patient.hospital_number || patient.hospitalNumber || patient.patient_id || patient.id;

    return {
      ...patient,
      id: patient.id,
      name: fullName,
      full_name: fullName,
      hospital_number: hospitalNumber,
      hospitalNumber,
      nin: patient.nin || patient.nhis_number || '',
      phone: patient.phone || patient.phone_number || '',
      status: patient.patient_status || patient.status || 'active',
      patient_status: patient.patient_status || patient.status || 'active',
    };
  };

  const loadPatients = async () => {
    try {
      const data = await apiRequest('/api/v1/patients/patients/');
      const list = Array.isArray(data) ? data : data.results || [];
      dispatch(setPatients(list.map(normalizePatient)));
    } catch (err) {
      console.error('Failed to load patients for bed assignment:', err);
    }
  };

useEffect(() => {
    dispatch(fetchWards());
    dispatch(fetchBedStats());
    loadPatients();
  }, [dispatch]);

  useEffect(() => {
    if (selectedWard?.wardId) {
      dispatch(fetchBeds({ ward_id: selectedWard.wardId }));
    }
  }, [dispatch, selectedWard?.wardId]);

  useEffect(() => {
    if (!selectedWard && wards.length) {
      dispatch(selectWard(wards[0].wardId));
    }
  }, [dispatch, selectedWard, wards]);

  const filteredBeds = filterStatus === 'All'
    ? beds
    : beds.filter(bed => bed.status === filterStatus);

  // Search beds
  const searchedBeds = filteredBeds.filter(bed => 
    bed.bedNumber.toString().includes(searchQuery) ||
    bed.bedType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bed.patientId && bed.patientId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openReservationModal = (bed, mode = 'reserve') => {
    const bedId = bed?.id ?? bed?.bedId ?? '';
    const bedLabel = bed?.bedId || `Bed ${bed?.bedNumber || ''}`;

    setReservationData({ bedId, bedLabel, patientId: '' });
    setPatientQuery('');
    setSelectedPatientOption(null);
    setActionMode(mode);
    setShowReservationForm(true);
    if (!patients.length) {
      loadPatients();
    }
  };

  const handleReserve = (bed) => {
    openReservationModal(bed, 'reserve');
  };

  const handleAdmit = (bed) => {
    openReservationModal(bed, 'occupy');
  };

  const showFeedback = (title, message, type = 'info', onConfirm = null) => {
    setFeedbackModal({ open: true, title, message, type, onConfirm });
  };

  const submitReservation = async () => {
    if (!reservationData.bedId || !reservationData.patientId) return;

    setIsSubmitting(true);
    try {
      if (actionMode === 'occupy') {
        await dispatch(occupyBed({
          bedId: reservationData.bedId,
          patientId: reservationData.patientId
        })).unwrap();
        showFeedback('Admission successful', 'Patient admitted and bed occupied successfully.');
      } else {
        await dispatch(reserveBed({
          bedId: reservationData.bedId,
          patientId: reservationData.patientId
        })).unwrap();
        showFeedback('Reservation successful', 'Bed reserved successfully.');
      }
      setShowReservationForm(false);
      setReservationData({ bedId: '', bedLabel: '', patientId: '' });
    } catch (err) {
      showFeedback('Request failed', err?.message || 'Unable to complete the bed request.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReleaseBed = (bed) => {
    showFeedback('Confirm release', `Release ${bed.bedId || `Bed ${bed.bedNumber}`} and mark it for cleaning?`, 'info', async () => {
      setIsSubmitting(true);
      try {
        await dispatch(releaseBed(bed.id)).unwrap();
        showFeedback('Bed released', 'Bed released and marked for cleaning.');
      } catch (err) {
        showFeedback('Release failed', err?.message || 'Unable to release this bed.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleMarkAvailable = (bed) => {
    setIsSubmitting(true);
    dispatch(markBedAvailable(bed.id))
      .unwrap()
      .then(() => {
        showFeedback('Bed updated', 'Bed marked as available.');
      })
      .catch((err) => {
        showFeedback('Update failed', err?.message || 'Unable to mark this bed available.', 'error');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleCreateWard = async () => {
    if (!wardForm.wardId || !wardForm.wardName) {
      showFeedback('Validation required', 'Ward ID and ward name are required.');
      return;
    }

    const payload = {
      wardId: wardForm.wardId,
      wardName: wardForm.wardName,
      wardType: wardForm.wardType,
      floor: wardForm.floor,
      supervisor: wardForm.supervisor,
      staffCount: Number(wardForm.staffCount) || 0,
      totalBeds: Number(wardForm.totalBeds) || 0
    };

    setIsSubmitting(true);
    try {
      await wardRoundApi.createWard(payload);
      showFeedback('Ward created', 'Ward created successfully.');
      setShowCreateForm(false);
      setWardForm({ wardId: '', wardName: '', wardType: 'General Ward', floor: '1', supervisor: '', staffCount: '4', totalBeds: '4' });
      dispatch(fetchWards());
    } catch (err) {
      showFeedback('Unable to create ward', err.message || 'Failed to create ward', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateBed = async () => {
    if (!selectedWard?.wardId) {
      showFeedback('Select ward', 'Please select a ward first.', 'error');
      return;
    }

    if (!bedForm.bedId || !bedForm.bedNumber) {
      showFeedback('Validation required', 'Bed ID and bed number are required.', 'error');
      return;
    }

    const payload = {
      bedId: bedForm.bedId,
      bedNumber: Number(bedForm.bedNumber),
      bedType: bedForm.bedType,
      status: bedForm.status,
      isPrivate: false,
      cleaningStatus: 'Clean',
      wardId: selectedWard.wardId
    };

    setIsSubmitting(true);
    try {
      await wardRoundApi.createBed(payload);
      showFeedback('Bed created', 'Bed created successfully.');
      setShowCreateForm(false);
      setBedForm({ bedId: '', bedNumber: '1', bedType: 'Standard', status: 'Available' });
      dispatch(fetchBeds({ ward_id: selectedWard.wardId }));
    } catch (err) {
      showFeedback('Unable to create bed', err.message || 'Failed to create bed', 'error');
} finally {
      setIsSubmitting(false);
    }
  };

  // Edit/Delete Ward handlers
  const handleEditWard = (ward) => {
    setEditingWard(ward);
    setEditWardForm({
      id: ward.id ?? null,
      wardId: ward.wardId || '',
      wardName: ward.wardName || '',
      wardType: ward.wardType || 'General Ward',
      floor: ward.floor || '1',
      supervisor: ward.supervisor || '',
      staffCount: String(ward.staffCount || '4'),
      totalBeds: String(ward.totalBeds || '4')
    });
    setShowEditWardForm(true);
  };

  const handleUpdateWard = async () => {
    if (!editWardForm.id && !editWardForm.wardId) {
      showFeedback('Validation required', 'Ward ID and ward name are required.', 'error');
      return;
    }
    if (!editWardForm.wardName) {
      showFeedback('Validation required', 'Ward name is required.', 'error');
      return;
    }

    const payload = {
      wardId: editWardForm.wardId,
      wardName: editWardForm.wardName,
      wardType: editWardForm.wardType,
      floor: editWardForm.floor,
      supervisor: editWardForm.supervisor,
      staffCount: Number(editWardForm.staffCount) || 0,
      totalBeds: Number(editWardForm.totalBeds) || 0
    };

    setIsSubmitting(true);
    try {
      if (editWardForm.id) {
        await dispatch(updateWard({ id: editWardForm.id, data: payload })).unwrap();
      } else {
        await wardRoundApi.updateWard(editWardForm.wardId, payload);
      }
      showFeedback('Ward updated', 'Ward updated successfully.');
      setShowEditWardForm(false);
      setEditingWard(null);
      setEditWardForm({ id: null, wardId: '', wardName: '', wardType: 'General Ward', floor: '1', supervisor: '', staffCount: '4', totalBeds: '4' });
      dispatch(fetchWards());
    } catch (err) {
      showFeedback('Unable to update ward', err?.message || 'Failed to update ward', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWard = (ward) => {
    const wardId = ward?.id ?? ward?.wardId;
    showFeedback('Confirm delete', `Delete ward "${ward?.wardName}"? This cannot be undone.`, 'error', async () => {
      setIsSubmitting(true);
      try {
        if (ward?.id) {
          await dispatch(deleteWard(ward.id)).unwrap();
        } else {
          await wardRoundApi.deleteWard(wardId);
        }
        showFeedback('Ward deleted', 'Ward deleted successfully.');
        dispatch(fetchWards());
        if (selectedWard && (selectedWard.id === ward.id || selectedWard.wardId === ward.wardId)) {
          dispatch(fetchBeds({ ward_id: '' }));
        }
      } catch (err) {
        showFeedback('Unable to delete ward', err?.message || 'Failed to delete ward', 'error');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  // Edit/Delete Bed handlers
  const handleEditBed = (bed) => {
    setEditingBed(bed);
    setEditBedForm({
      id: bed.id ?? null,
      bedId: bed.bedId || '',
      bedNumber: String(bed.bedNumber || '1'),
      bedType: bed.bedType || 'Standard',
      status: bed.status || 'Available'
    });
    setShowEditBedForm(true);
  };

  const handleUpdateBed = async () => {
    if (!editBedForm.id && !editBedForm.bedId) {
      showFeedback('Validation required', 'Bed ID is required.', 'error');
      return;
    }

    const payload = {
      bedId: editBedForm.bedId,
      bedNumber: Number(editBedForm.bedNumber) || 1,
      bedType: editBedForm.bedType,
      status: editBedForm.status
    };

    setIsSubmitting(true);
    try {
      if (editBedForm.id) {
        await dispatch(updateBed({ id: editBedForm.id, data: payload })).unwrap();
      } else {
        await wardRoundApi.updateBed(editBedForm.bedId, payload);
      }
      showFeedback('Bed updated', 'Bed updated successfully.');
      setShowEditBedForm(false);
      setEditingBed(null);
      setEditBedForm({ id: null, bedId: '', bedNumber: '1', bedType: 'Standard', status: 'Available' });
      if (selectedWard?.wardId) {
        dispatch(fetchBeds({ ward_id: selectedWard.wardId }));
      }
    } catch (err) {
      showFeedback('Unable to update bed', err?.message || 'Failed to update bed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBed = (bed) => {
    const bedId = bed?.id ?? bed?.bedId;
    showFeedback('Confirm delete', `Delete bed "${bed?.bedId || `Bed ${bed?.bedNumber}`}"? This cannot be undone.`, 'error', async () => {
      setIsSubmitting(true);
      try {
        if (bed?.id) {
          await dispatch(deleteBed(bed.id)).unwrap();
        } else {
          await wardRoundApi.deleteBed(bedId);
        }
        showFeedback('Bed deleted', 'Bed deleted successfully.');
        if (selectedWard?.wardId) {
          dispatch(fetchBeds({ ward_id: selectedWard.wardId }));
        }
      } catch (err) {
        showFeedback('Unable to delete bed', err?.message || 'Failed to delete bed', 'error');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  // Stats cards WITHOUT tooltips
  const statCards = [
    { 
      label: 'Total Beds', 
      value: stats.totalBeds, 
      icon: Bed, 
      color: 'blue'
    },
    { 
      label: 'Occupied', 
      value: stats.occupiedBeds, 
      icon: Users, 
      color: 'red',
      subtext: `${Math.round((stats.occupiedBeds / stats.totalBeds) * 100)}% occupied`
    },
    { 
      label: 'Available', 
      value: stats.availableBeds, 
      icon: Check, 
      color: 'green'
    },
    { 
      label: 'Reserved', 
      value: stats.reservedBeds, 
      icon: Clock, 
      color: 'yellow'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {isSubmitting && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/35 backdrop-blur-sm">
            <div className="flex flex-col items-center rounded-2xl border border-white/20 bg-white/95 px-6 py-5 shadow-2xl">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              <p className="mt-3 text-sm font-medium text-gray-700">Processing request...</p>
            </div>
          </div>
        )}

        {feedbackModal.open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{feedbackModal.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{feedbackModal.message}</p>
                </div>
                <button
                  onClick={() => setFeedbackModal({ ...feedbackModal, open: false })}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 flex justify-end">
                {feedbackModal.onConfirm ? (
                  <>
                    <button
                      onClick={() => {
                        setFeedbackModal({ ...feedbackModal, open: false });
                        feedbackModal.onConfirm();
                      }}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setFeedbackModal({ ...feedbackModal, open: false })}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setFeedbackModal({ ...feedbackModal, open: false })}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${feedbackModal.type === 'error' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bed className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Bed Allocation
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Real-time bed availability and patient flow management
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonWithTooltip
              onClick={() => window.print()}
              tooltip="Print bed allocation report"
              variant="secondary"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Print</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => showFeedback('Export report', 'Exporting report is coming soon.', 'info')}
              tooltip="Export bed report to file"
              variant="secondary"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Export</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                dispatch(fetchWards());
                if (selectedWard?.wardId) {
                  dispatch(fetchBeds({ ward_id: selectedWard.wardId }));
                }
              }}
              tooltip="Refresh bed data"
              variant="primary"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Refresh</span>
            </ButtonWithTooltip>
<ButtonWithTooltip
              onClick={() => setShowCreateForm(!showCreateForm)}
              tooltip="Create a ward or bed"
              variant="success"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Create</span>
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Stats Grid - WITHOUT tooltips */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 border-blue-200',
              red: 'bg-red-50 text-red-600 border-red-200',
              green: 'bg-green-50 text-green-600 border-green-200',
              yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200'
            };
            
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stat.value}</p>
                    {stat.subtext && (
                      <p className="text-[10px] text-gray-500 mt-0.5">{stat.subtext}</p>
                    )}
                  </div>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClasses[stat.color]} rounded-lg flex items-center justify-center border`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">Create Ward or Bed</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCreateMode('ward')}
                  className={`px-3 py-1.5 text-sm rounded-lg ${createMode === 'ward' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Create Ward
                </button>
                <button
                  onClick={() => setCreateMode('bed')}
                  className={`px-3 py-1.5 text-sm rounded-lg ${createMode === 'bed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Create Bed
                </button>
              </div>
            </div>

            {createMode === 'ward' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ward ID</label>
                  <input value={wardForm.wardId} onChange={(e) => setWardForm({ ...wardForm, wardId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="W-004" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ward Name</label>
                  <input value={wardForm.wardName} onChange={(e) => setWardForm({ ...wardForm, wardName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="ICU Ward" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ward Type</label>
                  <input value={wardForm.wardType} onChange={(e) => setWardForm({ ...wardForm, wardType: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Floor</label>
                  <input value={wardForm.floor} onChange={(e) => setWardForm({ ...wardForm, floor: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Supervisor</label>
                  <input value={wardForm.supervisor} onChange={(e) => setWardForm({ ...wardForm, supervisor: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Staff Count</label>
                  <input type="number" value={wardForm.staffCount} onChange={(e) => setWardForm({ ...wardForm, staffCount: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Total Beds</label>
                  <input type="number" value={wardForm.totalBeds} onChange={(e) => setWardForm({ ...wardForm, totalBeds: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="flex items-end">
                  <button onClick={handleCreateWard} className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg">Create Ward</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bed ID</label>
                  <input value={bedForm.bedId} onChange={(e) => setBedForm({ ...bedForm, bedId: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="W-004-B01" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bed Number</label>
                  <input type="number" value={bedForm.bedNumber} onChange={(e) => setBedForm({ ...bedForm, bedNumber: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Bed Type</label>
                  <input value={bedForm.bedType} onChange={(e) => setBedForm({ ...bedForm, bedType: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Standard" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select value={bedForm.status} onChange={(e) => setBedForm({ ...bedForm, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Under Cleaning">Under Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button onClick={handleCreateBed} className="w-full md:w-auto px-3 py-2 bg-green-600 text-white rounded-lg">Create Bed</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ward Selection and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Select Ward</label>
              <select
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                onChange={(e) => {
                  const ward = wards.find(w => w.wardId === e.target.value);
                  if (ward) dispatch(selectWard(ward.wardId));
                }}
                value={selectedWard?.wardId || ''}
              >
                <option value="">Select a ward...</option>
                {wards.map(ward => (
                  <option key={ward.wardId} value={ward.wardId}>
                    {ward.wardName} ({ward.totalBeds} beds)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Occupied">Occupied</option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Under Cleaning">Under Cleaning</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Search Beds</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by number, type, patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 sm:pl-9 pr-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Ward Info - Collapsible on Mobile */}
          {selectedWard && (
            <div className="mt-4">
              <button
                onClick={() => setExpandedWardInfo(!expandedWardInfo)}
                className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg lg:hidden"
              >
                <span className="font-medium text-blue-700">Ward Information</span>
                {expandedWardInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <div className={`${expandedWardInfo ? 'block' : 'hidden lg:block'} p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg mt-2 lg:mt-4`}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <Tooltip text="Type of ward">
                    <div className="cursor-help">
                      <p className="text-xs text-gray-600">Ward Type</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedWard.wardType}</p>
                    </div>
                  </Tooltip>
                  <Tooltip text="Floor location">
                    <div className="cursor-help">
                      <p className="text-xs text-gray-600">Floor</p>
                      <p className="text-sm font-semibold text-gray-900">Floor {selectedWard.floor}</p>
                    </div>
                  </Tooltip>
                  <Tooltip text="Ward supervisor">
                    <div className="cursor-help">
                      <p className="text-xs text-gray-600">Supervisor</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedWard.supervisor}</p>
                    </div>
                  </Tooltip>
<Tooltip text="Number of staff assigned">
                    <div className="cursor-help">
                      <p className="text-xs text-gray-600">Staff Count</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedWard.staffCount}</p>
                    </div>
                  </Tooltip>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-100 flex justify-end gap-1">
                  <IconButton
                    icon={Edit}
                    onClick={() => handleEditWard(selectedWard)}
                    tooltip="Edit ward"
                    variant="warning"
                  />
                  <IconButton
                    icon={Trash2}
                    onClick={() => handleDeleteWard(selectedWard)}
                    tooltip="Delete ward"
                    variant="danger"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bed Grid */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
          {/* Toolbar */}
          {selectedWard && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Bed Layout - {selectedWard.wardName}
                <span className="text-xs font-normal text-gray-500 ml-2">
                  ({searchedBeds.length} beds)
                </span>
              </h2>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <IconButton
                  icon={Filter}
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  tooltip={showMobileFilters ? "Hide filters" : "Show filters"}
                  variant="default"
                  className="lg:hidden"
                />
                <IconButton
                  icon={viewMode === 'grid' ? List : Grid}
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  tooltip={viewMode === 'grid' ? "Switch to list view" : "Switch to grid view"}
                  variant="default"
                />
                <IconButton
                  icon={RefreshCw}
                  onClick={() => {
                    dispatch(fetchWards());
                    dispatch(fetchBeds({ ward_id: selectedWard.wardId }));
                  }}
                  tooltip="Refresh bed data"
                  variant="default"
                />
              </div>
            </div>
          )}

          {!selectedWard ? (
            <div className="text-center py-12 text-gray-500">
              <Bed className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="text-base sm:text-lg font-medium text-gray-900">Select a Ward</p>
              <p className="text-sm text-gray-500 mt-1">Choose a ward from the dropdown above to view bed allocation</p>
            </div>
          ) : loading ? (
            <div className="text-center py-12 text-gray-500">Loading beds...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : searchedBeds.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="text-base sm:text-lg font-medium text-gray-900">No beds found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery ? 'Try adjusting your search' : 'No beds match the current filter'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
              {searchedBeds.map(bed => (
                <Tooltip key={bed.bedId} text={`Bed ${bed.bedNumber} - ${bed.status}`}>
                  <div
                    onClick={() => setSelectedBed(bed)}
                    className={`p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md active:scale-95 ${getBedStatusColor(bed.status)}`}
                  >
                    <div className="flex items-center justify-center mb-1 sm:mb-2">
                      {getBedStatusIcon(bed.status)}
                    </div>
                    <p className="font-semibold text-xs sm:text-sm text-center truncate">B{bed.bedNumber}</p>
                    <p className="text-[10px] sm:text-xs text-center text-gray-600 truncate">{bed.bedType}</p>
                    {bed.status === bedStatus.OCCUPIED && bed.patientId && (
                      <p className="text-[10px] text-center mt-0.5 font-medium text-red-600 truncate">
                        Patient: {bed.patientId.slice(0, 6)}...
                      </p>
                    )}
                    {bed.status === bedStatus.RESERVED && (
                      <p className="text-[10px] text-center mt-0.5 font-medium text-yellow-600">
                        Reserved
                      </p>
                    )}
                  </div>
                </Tooltip>
              ))}
            </div>
          ) : (
            // List View
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed</th>
                    <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {searchedBeds.map(bed => (
                    <tr key={bed.bedId} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <div className="font-medium text-sm">Bed {bed.bedNumber}</div>
                        <div className="text-xs text-gray-500">{bed.bedType}</div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getBedStatusBadge(bed.status)}`}>
                          {bed.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {bed.patientId ? (
                          <span className="text-sm">{bed.patientId}</span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
<td className="py-3">
                        <div className="flex items-center gap-1">
                          <IconButton
                            icon={Eye}
                            onClick={() => setSelectedBed(bed)}
                            tooltip="View bed details"
                            variant="primary"
                          />
                          <IconButton
                            icon={Edit}
                            onClick={() => handleEditBed(bed)}
                            tooltip="Edit bed"
                            variant="warning"
                          />
                          <IconButton
                            icon={Trash2}
                            onClick={() => handleDeleteBed(bed)}
                            tooltip="Delete bed"
                            variant="danger"
                          />
                          {(bed.status === bedStatus.AVAILABLE || bed.status === bedStatus.RESERVED) && (
                            <>
                              <IconButton
                                icon={Clock}
                                onClick={() => handleReserve(bed)}
                                tooltip="Reserve this bed"
                                variant="warning"
                              />
                              <IconButton
                                icon={Check}
                                onClick={() => handleAdmit(bed)}
                                tooltip="Admit a patient to this bed"
                                variant="success"
                              />
                            </>
                          )}
                          {bed.status === bedStatus.OCCUPIED && (
                            <IconButton
                              icon={Trash2}
                              onClick={() => handleReleaseBed(bed)}
                              tooltip="Release bed"
                              variant="danger"
                            />
                          )}
                          {bed.status === bedStatus.UNDER_CLEANING && (
                            <IconButton
                              icon={Check}
                              onClick={() => handleMarkAvailable(bed)}
                              tooltip="Mark as available"
                              variant="success"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">Status Legend:</p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {Object.entries(bedStatus).map(([key, value]) => (
                <Tooltip key={key} text={`${value} beds`}>
                  <div className="flex items-center gap-1.5 cursor-help">
                    <div className={`w-3 h-3 rounded-full ${getBedStatusColor(value).split(' ')[0]}`}></div>
                    <span className="text-xs text-gray-600">{value}</span>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bed Details Modal/Slide-over */}
      {selectedBed && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setSelectedBed(null)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Bed {selectedBed.bedNumber} Details
                </h2>
                <IconButton
                  icon={X}
                  onClick={() => setSelectedBed(null)}
                  tooltip="Close details"
                  variant="default"
                />
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Bed Number</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedBed.bedNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className={`text-sm font-semibold mt-1 ${getBedStatusColor(selectedBed.status)}`}>
                      {selectedBed.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bed Type</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedBed.bedType}</p>
                  </div>
<div className="col-span-2 sm:col-span-3">
                    <p className="text-xs text-gray-500">Patient</p>
                    {selectedBed.patientId ? (
                      <div className="mt-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                        <p className="text-sm font-semibold text-gray-900">{selectedBed.patientName || 'Unknown Patient'}</p>
                        <p className="text-xs text-blue-700 mt-0.5">
                          {selectedBed.patientId}
                          {selectedBed.mrn && selectedBed.mrn !== selectedBed.patientId ? ` • MRN: ${selectedBed.mrn}` : ''}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-xs text-gray-600">
                          {selectedBed.gender && (
                            <span className="capitalize">Gender: {selectedBed.gender}</span>
                          )}
                          {selectedBed.age != null && (
                            <span>Age: {selectedBed.age}</span>
                          )}
                          {selectedBed.bloodGroup && (
                            <span>Blood: {selectedBed.bloodGroup}</span>
                          )}
                          {selectedBed.genotype && (
                            <span>Genotype: {selectedBed.genotype}</span>
                          )}
                          {selectedBed.phone && (
                            <span>Tel: {selectedBed.phone}</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-900 mt-1">N/A</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cleaning Status</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedBed.cleaningStatus}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Private Bed</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedBed.isPrivate ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Cleaned</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {new Date(selectedBed.lastCleaned).toLocaleTimeString('en-NG', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Turnover</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {new Date(selectedBed.lastTurnover).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  {(selectedBed.status === bedStatus.AVAILABLE || selectedBed.status === bedStatus.RESERVED) && (
                    <>
                      <ButtonWithTooltip
                        onClick={() => handleReserve(selectedBed)}
                        tooltip="Reserve this bed for a patient"
                        variant="warning"
                        className="flex-1 min-w-[120px]"
                      >
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Reserve Bed
                      </ButtonWithTooltip>
                      <ButtonWithTooltip
                        onClick={() => handleAdmit(selectedBed)}
                        tooltip="Admit a patient to this bed"
                        variant="success"
                        className="flex-1 min-w-[120px]"
                      >
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Admit Patient
                      </ButtonWithTooltip>
                    </>
                  )}

                  {selectedBed.status === bedStatus.OCCUPIED && (
                    <ButtonWithTooltip
                      onClick={() => handleReleaseBed(selectedBed)}
                      tooltip="Release bed and mark for cleaning"
                      variant="danger"
                      className="flex-1 min-w-[120px]"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Release Bed
                    </ButtonWithTooltip>
                  )}

                  {selectedBed.status === bedStatus.UNDER_CLEANING && (
                    <ButtonWithTooltip
                      onClick={() => handleMarkAvailable(selectedBed)}
                      tooltip="Mark bed as available for admission"
                      variant="success"
                      className="flex-1 min-w-[120px]"
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Mark Available
                    </ButtonWithTooltip>
                  )}

                  {selectedBed.status === bedStatus.RESERVED && (
                    <ButtonWithTooltip
                      onClick={() => handleReleaseBed(selectedBed)}
                      tooltip="Cancel reservation"
                      variant="danger"
                      className="flex-1 min-w-[120px]"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Cancel Reservation
                    </ButtonWithTooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Edit Ward Modal */}
      {showEditWardForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => {
              setShowEditWardForm(false);
              setEditingWard(null);
            }} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Edit Ward</h3>
                  <IconButton
                    icon={X}
                    onClick={() => {
                      setShowEditWardForm(false);
                      setEditingWard(null);
                    }}
                    tooltip="Close"
                    variant="default"
                  />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ward ID</label>
                      <input
                        type="text"
                        value={editWardForm.wardId}
                        onChange={(e) => setEditWardForm({ ...editWardForm, wardId: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ward Name</label>
                      <input
                        type="text"
                        value={editWardForm.wardName}
                        onChange={(e) => setEditWardForm({ ...editWardForm, wardName: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ward Type</label>
                      <input
                        type="text"
                        value={editWardForm.wardType}
                        onChange={(e) => setEditWardForm({ ...editWardForm, wardType: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Floor</label>
                      <input
                        type="text"
                        value={editWardForm.floor}
                        onChange={(e) => setEditWardForm({ ...editWardForm, floor: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Supervisor</label>
                      <input
                        type="text"
                        value={editWardForm.supervisor}
                        onChange={(e) => setEditWardForm({ ...editWardForm, supervisor: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Staff Count</label>
                      <input
                        type="number"
                        value={editWardForm.staffCount}
                        onChange={(e) => setEditWardForm({ ...editWardForm, staffCount: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Total Beds</label>
                      <input
                        type="number"
                        value={editWardForm.totalBeds}
                        onChange={(e) => setEditWardForm({ ...editWardForm, totalBeds: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <ButtonWithTooltip
                      onClick={handleUpdateWard}
                      tooltip="Save ward changes"
                      variant="primary"
                      className="flex-1"
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Update Ward
                    </ButtonWithTooltip>
                    <ButtonWithTooltip
                      onClick={() => {
                        setShowEditWardForm(false);
                        setEditingWard(null);
                      }}
                      tooltip="Cancel"
                      variant="secondary"
                      className="flex-1"
                    >
                      Cancel
                    </ButtonWithTooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bed Modal */}
      {showEditBedForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => {
              setShowEditBedForm(false);
              setEditingBed(null);
            }} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Edit Bed</h3>
                  <IconButton
                    icon={X}
                    onClick={() => {
                      setShowEditBedForm(false);
                      setEditingBed(null);
                    }}
                    tooltip="Close"
                    variant="default"
                  />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bed ID</label>
                      <input
                        type="text"
                        value={editBedForm.bedId}
                        onChange={(e) => setEditBedForm({ ...editBedForm, bedId: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bed Number</label>
                      <input
                        type="number"
                        value={editBedForm.bedNumber}
                        onChange={(e) => setEditBedForm({ ...editBedForm, bedNumber: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Bed Type</label>
                      <input
                        type="text"
                        value={editBedForm.bedType}
                        onChange={(e) => setEditBedForm({ ...editBedForm, bedType: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editBedForm.status}
                        onChange={(e) => setEditBedForm({ ...editBedForm, status: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Under Cleaning">Under Cleaning</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <ButtonWithTooltip
                      onClick={handleUpdateBed}
                      tooltip="Save bed changes"
                      variant="primary"
                      className="flex-1"
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Update Bed
                    </ButtonWithTooltip>
                    <ButtonWithTooltip
                      onClick={() => {
                        setShowEditBedForm(false);
                        setEditingBed(null);
                      }}
                      tooltip="Cancel"
                      variant="secondary"
                      className="flex-1"
                    >
                      Cancel
                    </ButtonWithTooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {showReservationForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowReservationForm(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Reserve Bed</h3>
                  <IconButton
                    icon={X}
                    onClick={() => setShowReservationForm(false)}
                    tooltip="Close"
                    variant="default"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Bed ID</label>
                    <input
                      type="text"
                      disabled
                      value={reservationData.bedLabel || reservationData.bedId}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Action</label>
                    <select
                      value={actionMode}
                      onChange={(e) => setActionMode(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="reserve">Reserve</option>
                      <option value="occupy">Admit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Patient *</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by patient name or hospital ID"
                        value={patientQuery}
                        onChange={(e) => {
                          const value = e.target.value;
                          setPatientQuery(value);
                          dispatch(searchPatients(value));
                          if (!value) {
                            setSelectedPatientOption(null);
                            setReservationData({ ...reservationData, patientId: '' });
                          }
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      {!selectedPatientOption && patientQuery && (
                        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                          {patientsLoading ? (
                            <div className="px-3 py-2 text-sm text-gray-500">Loading patients...</div>
                          ) : filteredPatients.length > 0 ? (
                            filteredPatients.slice(0, 8).map((patient) => {
                              const patientLabel = patient.name || patient.full_name || 'Unknown patient';
                              const patientId = patient.hospital_number || patient.hospitalNumber || patient.id;
                              return (
                                <button
                                  key={patient.id}
                                  type="button"
                                  onClick={() => {
                                    setReservationData({ ...reservationData, patientId: patientId });
                                    setSelectedPatientOption(patient);
                                    setPatientQuery(`${patientLabel} (${patientId})`);
                                    dispatch(searchPatients(''));
                                  }}
                                  className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-gray-50"
                                >
                                  <span className="font-medium text-gray-900">{patientLabel}</span>
                                  <span className="text-xs text-gray-500">{patientId}</span>
                                </button>
                              );
                            })
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">No patients found</div>
                          )}
                        </div>
                      )}
                    </div>
                    {patientError && (
                      <p className="mt-1 text-xs text-red-500">{patientError}</p>
                    )}
                    {selectedPatientOption && (
                      <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
                        <div className="font-medium">{selectedPatientOption.name || selectedPatientOption.full_name}</div>
                        <div className="text-xs text-blue-700">
                          {(selectedPatientOption.hospital_number || selectedPatientOption.hospitalNumber || selectedPatientOption.id)}
                          {selectedPatientOption.phone ? ` • ${selectedPatientOption.phone}` : ''}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <ButtonWithTooltip
                      onClick={submitReservation}
                      tooltip="Reserve the bed for this patient"
                      variant="primary"
                      className="flex-1"
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {actionMode === 'occupy' ? 'Admit' : 'Reserve'}
                    </ButtonWithTooltip>
                    <ButtonWithTooltip
                      onClick={() => setShowReservationForm(false)}
                      tooltip="Cancel reservation"
                      variant="secondary"
                      className="flex-1"
                    >
                      Cancel
                    </ButtonWithTooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedAllocation;