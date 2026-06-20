import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  addPatient,
  updatePatient,
  deletePatient,
  archivePatient,
  searchPatients,
  sortPatients,
  filterPatients,
} from '../features/patientSlice';
import ConfirmModal from "../components/ConfirmModal";
import { 
  User, Search, Filter, Plus, Edit, Trash2, 
  UserPlus, Phone, Mail, MapPin, Calendar, 
  Heart, Users, FileText, Eye, Download,
  ChevronLeft, ChevronRight, Grid, List, Printer,
  X, AlertTriangle, CheckCircle, Shield, Clock,
  UserCheck, UserX, Activity, Baby, Droplets,
  Map, Building2, Globe, BookOpen, Award,
  Menu, MoreVertical, UserCircle, IdCard
} from 'lucide-react';

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

const PatientManagement = () => {
  const dispatch = useDispatch();
  const { filteredPatients, searchTerm, sortBy, filterBy, error } = useSelector(
    state => state.patient
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState({
    name: '',
    nin: '',
    phone: '',
    email: '',
    address: '',
    tribe: '',
    country: 'Nigeria',
    lga: '',
    state: '',
    dateOfBirth: '',
    bloodType: '',
    gender: '',
    maritalStatus: '',
    occupation: '',
    emergencyContact: '',
    emergencyPhone: '',
    nextOfKin: '',
    nextOfKinPhone: '',
    religion: '',
  });

  const [availableLGAs, setAvailableLGAs] = useState([]);
  const [nigerianStates, setNigerianStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [countryStates, setCountryStates] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [nigerianData, setNigerianData] = useState({});

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'delete',
    patientData: null,
    action: null,
  });

  // Load countries, states, and Nigerian LGAs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statesResponse = await fetch('https://countriesnow.space/api/v0.1/countries/states');
        const statesData = await statesResponse.json();

        const countriesList = statesData.data.map(country => country.name);
        const statesMap = {};
        statesData.data.forEach(country => {
          statesMap[country.name] = country.states.map(state => state.name);
        });

        setCountries(countriesList);
        setCountryStates(statesMap);

        // Load Nigerian LGAs from local JSON
        const nigerianStatesList = Object.keys(nigerianData);
        setNigerianStates(nigerianStatesList);
      } catch (error) {
        console.error('Error fetching global data:', error);
        setCountries(['Nigeria']);
        setCountryStates({ 'Nigeria': Object.keys(nigerianData) });
        setNigerianStates(Object.keys(nigerianData));
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const tribes = ['Yoruba', 'Hausa', 'Igbo', 'Fulani', 'Ijaw', 'Kanuri', 'Ibibio', 'Tiv', 'Other'];
  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const genders = ['Male', 'Female', 'Other'];
  const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
  const religions = ['Christianity', 'Islam', 'Traditional', 'Other'];

  // Stats calculation
  const stats = {
    total: filteredPatients.length,
    active: filteredPatients.filter(p => p.status === 'active').length,
    inactive: filteredPatients.filter(p => p.status === 'inactive' || p.status === 'archived').length,
    byState: filteredPatients.reduce((acc, p) => {
      acc[p.state] = (acc[p.state] || 0) + 1;
      return acc;
    }, {}),
  };

  // Open modal for delete
  const handleDeleteClick = (patient) => {
    setModalConfig({
      isOpen: true,
      type: 'delete',
      patientData: patient,
      action: () => dispatch(deletePatient(patient.id)),
    });
  };

  // Open modal for edit
  const handleEditClick = (patient) => {
    setFormData(patient);
    setAvailableLGAs(nigerianData[patient.state] || []);
    setEditingId(patient.id);
    setShowForm(true);
  };

  // Handle soft delete (archive)
  const handleSoftDelete = (patient) => {
    dispatch(archivePatient(patient.id));
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // Handle modal confirm
  const handleModalConfirm = () => {
    if (modalConfig.action) {
      modalConfig.action();
    }
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Name and Phone are required fields');
      return;
    }

    if (editingId) {
      dispatch(updatePatient({ ...formData, id: editingId }));
      setEditingId(null);
    } else {
      const newPatient = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      dispatch(addPatient(newPatient));
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nin: '',
      phone: '',
      email: '',
      address: '',
      tribe: '',
      country: 'Nigeria',
      lga: '',
      state: '',
      dateOfBirth: '',
      bloodType: '',
      gender: '',
      maritalStatus: '',
      occupation: '',
      emergencyContact: '',
      emergencyPhone: '',
      nextOfKin: '',
      nextOfKinPhone: '',
      religion: '',
    });
    setAvailableLGAs([]);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'country') {
      setFormData(prev => ({ ...prev, state: '', lga: '' }));
      setAvailableLGAs([]);
      setNigerianStates(countryStates[value] || []);
    } else if (name === 'state') {
      setFormData(prev => ({ ...prev, lga: '' }));
      if (formData.country === 'Nigeria') {
        setAvailableLGAs(nigerianData[value] || []);
      }
    }
  };

  const handleSearch = (e) => {
    dispatch(searchPatients(e.target.value));
  };

  const handleSort = (e) => {
    dispatch(sortPatients(e.target.value));
  };

  const handleFilter = (e) => {
    dispatch(filterPatients(e.target.value));
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalItems = filteredPatients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPatients = filteredPatients.slice(startIndex, endIndex);

  // Get modal configuration
  const getModalConfig = () => {
    const configs = {
      delete: {
        title: 'Delete Patient Record',
        message: 'Are you sure you want to permanently delete this patient record? This action is irreversible.',
        confirmText: 'Delete Permanently',
        showSoftDeleteOption: true,
      },
      edit: {
        title: 'Edit Patient Details',
        message: 'You are about to modify patient information. Please ensure all changes are accurate.',
        confirmText: 'Save Changes',
        showSoftDeleteOption: false,
      },
      archive: {
        title: 'Archive Patient Record',
        message: 'This will mark the patient as inactive. The record will be preserved but hidden from active lists.',
        confirmText: 'Archive Patient',
        showSoftDeleteOption: false,
      },
    };
    return configs[modalConfig.type] || configs.delete;
  };

  // Render patient form
  const renderPatientForm = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          {editingId ? 'Edit Patient' : 'Add New Patient'}
        </h3>
        {showForm && (
          <IconButton
            icon={X}
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
            tooltip="Close form"
            variant="default"
          />
        )}
      </div>

      {!showForm ? (
        <ButtonWithTooltip
          onClick={() => setShowForm(true)}
          tooltip="Register a new patient"
          variant="success"
          className="w-full justify-center"
        >
          <UserPlus className="w-4 h-4" />
          New Patient
        </ButtonWithTooltip>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
          {/* Personal Information */}
          <div className="border-b border-gray-200 pb-3">
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Personal Information
            </h4>
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">NIN</label>
                <input
                  type="text"
                  name="nin"
                  value={formData.nin}
                  onChange={handleChange}
                  placeholder="National Identity Number"
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-b border-gray-200 pb-3">
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              Contact Information
            </h4>
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="border-b border-gray-200 pb-3">
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Location
            </h4>
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Country</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!formData.country || loadingData}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                >
                  <option value="">Select State</option>
                  {nigerianStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {formData.country === 'Nigeria' && (
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">LGA</label>
                  <select
                    name="lga"
                    value={formData.lga}
                    onChange={handleChange}
                    disabled={!formData.state}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  >
                    <option value="">Select LGA</option>
                    {availableLGAs.map(lga => <option key={lga} value={lga}>{lga}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Medical & Demographic */}
          <div className="border-b border-gray-200 pb-3">
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              Medical & Demographic
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {bloodTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Tribe</label>
                <select
                  name="tribe"
                  value={formData.tribe}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {tribes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Religion</label>
                <select
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {religions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {maritalStatuses.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="border-b border-gray-200 pb-3">
            <h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Emergency Contact
            </h4>
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Emergency Phone</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              {editingId ? 'Update' : 'Add'} Patient
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );

  // Render patient table
  const renderPatientTable = () => (
    <>
      {filteredPatients.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-600 font-medium text-sm sm:text-base">No patients found</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {searchTerm ? 'Try adjusting your search or filters' : 'Start by registering your first patient'}
          </p>
          {!searchTerm && (
            <ButtonWithTooltip
              onClick={() => setShowForm(true)}
              tooltip="Register a new patient"
              variant="primary"
              className="mt-3 sm:mt-4"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Add Patient
            </ButtonWithTooltip>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[640px] sm:min-w-0">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Tooltip text="Select all patients">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPatients(displayedPatients.map(p => p.id));
                          } else {
                            setSelectedPatients([]);
                          }
                        }}
                      />
                    </Tooltip>
                  </th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Blood</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="pb-2 sm:pb-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2 sm:py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer"
                        checked={selectedPatients.includes(patient.id)}
                        onChange={() => {
                          setSelectedPatients(prev =>
                            prev.includes(patient.id)
                              ? prev.filter(id => id !== patient.id)
                              : [...prev, patient.id]
                          );
                        }}
                      />
                    </td>
                    <td className="py-2 sm:py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm flex-shrink-0">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-xs sm:text-sm">{patient.name}</div>
                          <div className="text-[10px] text-gray-500">
                            {patient.nin ? `NIN: ${patient.nin}` : 'No NIN'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 hidden sm:table-cell">
                      <div className="text-xs sm:text-sm text-gray-600">{patient.phone}</div>
                      <div className="text-[10px] text-gray-400">{patient.email || 'No email'}</div>
                    </td>
                    <td className="py-2 sm:py-3 hidden md:table-cell">
                      <div className="text-xs sm:text-sm text-gray-600">{patient.state || '-'}</div>
                      <div className="text-[10px] text-gray-400">{patient.lga || '-'}</div>
                    </td>
                    <td className="py-2 sm:py-3 hidden lg:table-cell">
                      <span className="text-xs font-medium">{patient.bloodType || '-'}</span>
                    </td>
                    <td className="py-2 sm:py-3">
                      <span className={`inline-flex px-1.5 sm:px-2 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-medium rounded-full ${
                        patient.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.status || 'active'}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <IconButton
                          icon={Eye}
                          onClick={() => {}}
                          tooltip="View patient details"
                          variant="primary"
                        />
                        <IconButton
                          icon={Edit}
                          onClick={() => handleEditClick(patient)}
                          tooltip="Edit patient"
                          variant="primary"
                        />
                        <IconButton
                          icon={Trash2}
                          onClick={() => handleDeleteClick(patient)}
                          tooltip="Delete patient"
                          variant="danger"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 gap-2 sm:gap-0">
            <div className="text-[10px] sm:text-xs text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <IconButton
                icon={ChevronLeft}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                tooltip="Previous page"
                variant="default"
                disabled={currentPage === 1}
              />
              <span className="text-[10px] sm:text-xs text-gray-600">
                Page {currentPage} of {totalPages || 1}
              </span>
              <IconButton
                icon={ChevronRight}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                tooltip="Next page"
                variant="default"
                disabled={currentPage === totalPages}
              />
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Patient Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Manage patient records, demographics, and medical history
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonWithTooltip
              tooltip="Export patient data"
              variant="secondary"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Export</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowForm(true)}
              tooltip="Register a new patient"
              variant="primary"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Add Patient</span>
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          <Tooltip text="Total registered patients">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stats.total}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Active patients currently receiving care">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Active</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">{stats.active}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Inactive or archived patients">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">Inactive</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-600 mt-0.5 sm:mt-1">{stats.inactive}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <UserX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
              </div>
            </div>
          </Tooltip>
          
          <Tooltip text="Unique states represented in patient data">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">States</p>
                  <p className="text-lg sm:text-2xl font-bold text-purple-600 mt-0.5 sm:mt-1">{Object.keys(stats.byState).length}</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Map className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </Tooltip>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            {renderPatientForm()}
          </div>

          {/* Right Column - Patient List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Toolbar */}
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="relative flex-1 max-w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full pl-8 sm:pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <IconButton
                      icon={Filter}
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
                      tooltip={showMobileFilters ? "Hide filters" : "Show filters"}
                      variant="default"
                      className="lg:hidden"
                    />
                    <div className="hidden sm:flex items-center gap-1.5">
                      <Tooltip text="Sort patients">
                        <select
                          value={sortBy}
                          onChange={handleSort}
                          className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="name">Name A-Z</option>
                          <option value="date">Newest</option>
                          <option value="state">State</option>
                        </select>
                      </Tooltip>
                      <Tooltip text="Filter by state">
                        <select
                          value={filterBy}
                          onChange={handleFilter}
                          className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">All States</option>
                          {nigerianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </Tooltip>
                    </div>
                    <IconButton
                      icon={viewMode === 'table' ? Grid : List}
                      onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                      tooltip={viewMode === 'table' ? "Switch to grid view" : "Switch to table view"}
                      variant="default"
                    />
                    <IconButton
                      icon={Printer}
                      onClick={() => window.print()}
                      tooltip="Print patient list"
                      variant="default"
                    />
                  </div>
                </div>
              </div>

              {/* Patient List Content */}
              <div className="p-3 sm:p-4">
                {renderPatientTable()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        onSoftDelete={() => handleSoftDelete(modalConfig.patientData)}
        type={modalConfig.type}
        patientData={modalConfig.patientData}
        title={getModalConfig().title}
        message={getModalConfig().message}
        confirmText={getModalConfig().confirmText}
        showSoftDeleteOption={getModalConfig().showSoftDeleteOption}
      />
    </div>
  );
};

export default PatientManagement;