import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  addPatient,
  updatePatient,
  deletePatient,
  archivePatient,
  restorePatient,
  sortPatients,
  filterPatients,
  setPatients,
} from '../features/patientSlice';
import LoadingSpinner from "../components/LoadingSpinner";
import { apiRequest, API_BASE_URL } from '../utils/api';
import { 
  User, Search, Filter, Plus, Edit, Trash2, 
  UserPlus, Phone, Mail, MapPin, Calendar, Bed,
  Heart, Users, FileText, Eye, Download,
  ChevronLeft, ChevronRight, Grid, List, Printer,
  X, AlertTriangle, CheckCircle, Shield, Clock,
  UserCheck, UserX, Activity, Baby, Droplets,
  Map, Building2, Globe, BookOpen, Award,
  Menu, MoreVertical, UserCircle, IdCard, Loader2,
  Archive, Upload, ChevronDown, FileSpreadsheet,
  Users as UsersIcon, Filter as FilterIcon, Brain, RotateCcw
} from 'lucide-react';

// ==================== COMPONENTS ====================

// Compact Tooltip Component
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
          <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg">
            {text}
            <div className={`absolute w-1.5 h-1.5 bg-gray-900 transform rotate-45 ${
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

// Compact Icon Button
const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false, size = 'sm' }) => {
  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    primary: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    success: 'text-green-600 hover:text-green-700 hover:bg-green-50',
    danger: 'text-red-600 hover:text-red-700 hover:bg-red-50',
    warning: 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50',
    info: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
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
        className={`rounded-lg transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
        }`}
      >
        <Icon className={iconSizes[size]} />
      </button>
    </Tooltip>
  );
};

// Compact Button with Tooltip
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '', disabled = false, size = 'sm' }) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow',
    secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm hover:shadow',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`rounded-lg transition-all duration-200 flex items-center gap-1.5 font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

// ==================== MODALS ====================

// Compact Bulk Upload Modal
const BulkUploadModal = ({ 
  isOpen, 
  onClose, 
  onUpload,
  isUploading = false,
  progress = null,
  result = null,
  error = null,
}) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file && onUpload) {
      onUpload(file);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = `first_name,last_name,date_of_birth,gender,marital_status,phone,email,address,city,state,lga,country,blood_group,genotype,next_of_kin_name,next_of_kin_phone,next_of_kin_address
John,Smith,1985-03-12,male,single,08012345678,john@example.com,12 Main Street,Lagos,Lagos,Ikeja,Nigeria,O+,AA,Mary Smith,08087654321,45 Church Road
Jane,Doe,1990-07-25,female,married,09098765432,jane@example.com,34 Park Avenue,Abuja,FCT,Maitama,Nigeria,A-,AS,Richard Doe,08123456789,18 London Street
Chiwa,Okafor,1978-11-03,male,married,07034567890,chiwa@example.com,56 School Road,Enugu,Enugu,Enugu North,Nigeria,AB+,SS,Ngozi Okafor,09065432109,30 Market Square`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'patient_upload_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <Upload className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Bulk Upload Patients</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isUploading}
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="p-4">
            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mb-3">
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-800">Upload CSV File</p>
                  <p className="text-xs text-blue-600">Supported format: .csv with patient data</p>
                </div>
              </div>
            </div>

            {/* File Input */}
            <div className="mb-3">
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                  file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Click to select CSV file</p>
                    <p className="text-xs text-gray-400">or drag and drop</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress / Result */}
            {(isUploading || progress || result || error) && (
              <div className={`rounded-lg p-2.5 mb-3 border ${
                error || progress?.status === 'failed' || result?.status === 'failed'
                  ? 'bg-red-50 border-red-200'
                  : result?.status === 'completed' || progress?.status === 'completed' || (!isUploading && !error && (result || progress))
                    ? 'bg-green-50 border-green-200'
                    : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-2">
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  ) : error || progress?.status === 'failed' || result?.status === 'failed' ? (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  ) : result?.status === 'completed' || progress?.status === 'completed' || (!isUploading && !error && (result || progress)) ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  )}
                  <span className="text-xs font-medium text-gray-700 flex-1">
                    {error || progress?.message || result?.message || 'Processing...'}
                  </span>
                </div>

                {error && (
                  <p className="mt-1 text-xs text-red-700">{error}</p>
                )}

                {result && !error && (
                  <div className="mt-2 text-xs text-gray-700">
                    <p className="font-medium text-gray-700">
                      Total: {result.total_records} | Success: {result.success_count} | Failed: {result.failure_count}
                    </p>
                    {result.errors && result.errors.length > 0 && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-red-700 font-medium">
                          View errors ({result.errors.length})
                        </summary>
                        <div className="mt-1 max-h-32 overflow-y-auto bg-white rounded border border-red-100 p-2">
                          {result.errors.slice(0, 10).map((err, idx) => (
                            <div key={idx} className="text-xs text-red-800 py-0.5 border-b border-red-50 last:border-0">
                              Row {err.row}: {err.error}
                            </div>
                          ))}
                          {result.errors.length > 10 && (
                            <div className="text-xs text-gray-500 mt-1">...and {result.errors.length - 10} more</div>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Template link */}
            <button
              onClick={handleDownloadTemplate}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mb-3"
            >
              <Download className="w-3 h-3" />
              Download CSV Template
            </button>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="flex-1 bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isUploading}
                className="flex-1 bg-gray-100 text-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact Edit/View Patient Modal
const PatientModal = ({ 
  isOpen, 
  onClose, 
  patient, 
  mode = 'view',
  onSave,
  isSubmitting = false,
  formError,
}) => {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('personal');
  const [dupCheck, setDupCheck] = useState({ loading: false, duplicate: false, existing: null });
  const [forceDuplicate, setForceDuplicate] = useState(false);
  
  useEffect(() => {
    if (patient && mode === 'edit') {
      setFormData({
        name: patient.name || patient.full_name || '',
        nin: patient.nin || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        tribe: patient.tribe || patient.ethnicity || '',
        country: patient.country || 'Nigeria',
        lga: patient.lga || '',
        state: patient.state || '',
        city: patient.city || '',
        dateOfBirth: patient.dateOfBirth || '',
        bloodType: patient.bloodType || patient.blood_group || '',
        gender: (patient.gender || '').toLowerCase(),
        maritalStatus: (patient.maritalStatus || patient.marital_status || '').toLowerCase(),
        occupation: patient.occupation || '',
        emergencyContact: patient.emergencyContact || patient.next_of_kin_name || '',
        emergencyPhone: patient.emergencyPhone || patient.next_of_kin_phone || '',
        religion: patient.religion || '',
        patient_status: patient.patient_status || 'active',
        genotype: patient.genotype || '',
        has_insurance: patient.has_insurance || false,
        insurance_company: patient.insurance_company || '',
        insurance_policy_number: patient.insurance_policy_number || '',
        nhis_number: patient.nhis_number || '',
        known_allergies: patient.known_allergies || '',
        chronic_conditions: patient.chronic_conditions || '',
        current_medications: patient.current_medications || '',
        surgical_history: patient.surgical_history || '',
        family_history: patient.family_history || '',
        notes: patient.notes || '',
      });
    } else if (mode === 'add') {
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
        city: '',
        dateOfBirth: '',
        bloodType: '',
        gender: '',
        maritalStatus: '',
        occupation: '',
        emergencyContact: '',
        emergencyPhone: '',
        religion: '',
        patient_status: 'active',
        genotype: '',
        has_insurance: false,
        insurance_company: '',
        insurance_policy_number: '',
        nhis_number: '',
        known_allergies: '',
        chronic_conditions: '',
        current_medications: '',
        surgical_history: '',
        family_history: '',
        notes: '',
      });
    }
  }, [patient, mode]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Live duplicate check (add mode only) — warns before submit.
  useEffect(() => {
    setForceDuplicate(false);
    setDupCheck({ loading: false, duplicate: false, existing: null });

    if (mode !== 'add' || !isOpen) return;

    const name = (formData.name || '').trim();
    const dob = (formData.dateOfBirth || '').trim();
    if (!name || !dob) return;

    const parts = name.split(/\s+/);
    const firstName = parts.shift() || '';
    const lastName = parts.join(' ') || 'Unknown';

    const handler = setTimeout(async () => {
      setDupCheck((prev) => ({ ...prev, loading: true }));
      try {
        const data = await apiRequest('/api/v1/patients/patients/check_duplicate/', {
          method: 'POST',
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dob,
          }),
        });
        setDupCheck({
          loading: false,
          duplicate: !!data.duplicate,
          existing: data.existing_patient || null,
        });
      } catch {
        setDupCheck({ loading: false, duplicate: false, existing: null });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [mode, isOpen, formData.name, formData.dateOfBirth]);


  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(formData, forceDuplicate);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'inactive': 'bg-gray-100 text-gray-800 border-gray-200',
      'archived': 'bg-gray-100 text-gray-800 border-gray-200',
      'critical': 'bg-red-100 text-red-800 border-red-200',
      'stable': 'bg-green-100 text-green-800 border-green-200',
      'monitoring': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderPersonalInfo = () => {
    if (mode === 'view') {
      const patientStatus = patient?.patient_status || 'active';
      const isActive = patientStatus === 'active' || patientStatus === 'Active';
      
      return (
        <>
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(patientStatus)}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
            {patient?.bloodType && (
              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                <Droplets className="w-3 h-3 mr-0.5" />
                {patient.bloodType}
              </span>
            )}
            {patient?.has_insurance && (
              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                <Shield className="w-3 h-3 mr-0.5" />
                Insured
              </span>
            )}
            {patient?.genotype && (
              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                <Brain className="w-3 h-3 mr-0.5" />
                {patient.genotype}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Full Name</p>
              <p className="font-medium text-gray-900">{patient?.name || patient?.full_name || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Gender</p>
              <p className="font-medium text-gray-900 capitalize">{patient?.gender || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
                {patient?.age && ` (${patient.age}y)`}
              </p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">NIN</p>
              <p className="font-medium text-gray-900">{patient?.nin || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Marital Status</p>
              <p className="font-medium text-gray-900 capitalize">{patient?.maritalStatus || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Religion</p>
              <p className="font-medium text-gray-900">{patient?.religion || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2 col-span-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Ethnicity</p>
              <p className="font-medium text-gray-900">{patient?.tribe || patient?.ethnicity || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2 col-span-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Occupation</p>
              <p className="font-medium text-gray-900">{patient?.occupation || 'N/A'}</p>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">NIN</label>
          <input
            type="text"
            name="nin"
            value={formData.nin}
            onChange={handleChange}
            placeholder="National Identity Number"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">LGA</label>
          <input
            type="text"
            name="lga"
            value={formData.lga}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Blood Type</label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Select</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Genotype</label>
          <select
            name="genotype"
            value={formData.genotype}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Select</option>
            <option value="AA">AA</option>
            <option value="AS">AS</option>
            <option value="SS">SS</option>
            <option value="AC">AC</option>
            <option value="SC">SC</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Marital Status</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="separated">Separated</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Religion</label>
          <input
            type="text"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Occupation</label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Ethnicity / Tribe</label>
          <input
            type="text"
            name="tribe"
            value={formData.tribe}
            onChange={handleChange}
            placeholder="e.g. Hausa, Igbo, Yoruba"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Emergency Contact</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Name"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-1"
            disabled={isSubmitting}
          />
          <input
            type="tel"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Known Allergies</label>
          <input
            type="text"
            name="known_allergies"
            value={formData.known_allergies}
            onChange={handleChange}
            placeholder="e.g. Penicillin, Latex"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Chronic Conditions</label>
          <input
            type="text"
            name="chronic_conditions"
            value={formData.chronic_conditions}
            onChange={handleChange}
            placeholder="e.g. Diabetes, Hypertension"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Current Medications</label>
          <input
            type="text"
            name="current_medications"
            value={formData.current_medications}
            onChange={handleChange}
            placeholder="e.g. Metformin 500mg"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Surgical History</label>
          <input
            type="text"
            name="surgical_history"
            value={formData.surgical_history}
            onChange={handleChange}
            placeholder="e.g. Appendectomy 2020"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Family History</label>
          <input
            type="text"
            name="family_history"
            value={formData.family_history}
            onChange={handleChange}
            placeholder="e.g. Diabetes (Mother)"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="2"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                mode === 'view' ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {mode === 'view' ? (
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <UserPlus className="w-3.5 h-3.5 text-green-600" />
                )}
              </div>
              <h3 className="text-sm font-semibold text-gray-900">
                {mode === 'view' ? 'Patient Details' : mode === 'edit' ? 'Edit Patient' : 'Add Patient'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          {mode === 'view' && (
            <div className="flex border-b border-gray-100 px-4 flex-shrink-0">
              {['personal', 'contact', 'medical'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4">
            {mode === 'view' ? (
              <div>
                {activeTab === 'personal' && (
                  <div className="space-y-3">
                    {renderPersonalInfo()}
                  </div>
                )}
                {activeTab === 'contact' && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Phone</p>
                      <p className="font-medium text-gray-900">{patient?.phone || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Email</p>
                      <p className="font-medium text-gray-900">{patient?.email || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Address</p>
                      <p className="font-medium text-gray-900">{patient?.address || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">State</p>
                      <p className="font-medium text-gray-900">{patient?.state || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">LGA</p>
                      <p className="font-medium text-gray-900">{patient?.lga || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">City</p>
                      <p className="font-medium text-gray-900">{patient?.city || 'N/A'}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'medical' && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Blood Type</p>
                      <p className="font-medium text-gray-900">{patient?.bloodType || patient?.blood_group || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Genotype</p>
                      <p className="font-medium text-gray-900">{patient?.genotype || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Known Allergies</p>
                      <p className="font-medium text-gray-900">{patient?.known_allergies || 'None'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Chronic Conditions</p>
                      <p className="font-medium text-gray-900">{patient?.chronic_conditions || 'None'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Current Medications</p>
                      <p className="font-medium text-gray-900">{patient?.current_medications || 'None'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Surgical History</p>
                      <p className="font-medium text-gray-900">{patient?.surgical_history || 'None'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Family History</p>
                      <p className="font-medium text-gray-900">{patient?.family_history || 'None'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Notes</p>
                      <p className="font-medium text-gray-900 whitespace-pre-line">{patient?.notes || 'None'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Emergency Contact</p>
                      <p className="font-medium text-gray-900">
                        {patient?.emergencyContact || patient?.next_of_kin_name || 'N/A'}
                        {patient?.emergencyPhone && ` (${patient.emergencyPhone})`}
                      </p>
                    </div>
                    {patient?.has_insurance && (
                      <div className="bg-gray-50 rounded p-2 col-span-2">
                        <p className="text-[10px] text-gray-500 uppercase font-medium">Insurance</p>
                        <p className="font-medium text-gray-900">
                          {patient?.insurance_company || 'N/A'}
                          {patient?.insurance_policy_number && ` (${patient.insurance_policy_number})`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-800">{formError}</p>
                    </div>
                  </div>
                )}
                {renderPersonalInfo()}

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      id="has_insurance"
                      type="checkbox"
                      name="has_insurance"
                      checked={formData.has_insurance}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="has_insurance" className="text-xs font-medium text-gray-700">
                      Has Insurance
                    </label>
                  </div>
                  {formData.has_insurance && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Insurance Company</label>
                        <input
                          type="text"
                          name="insurance_company"
                          value={formData.insurance_company}
                          onChange={handleChange}
                          className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Policy Number</label>
                        <input
                          type="text"
                          name="insurance_policy_number"
                          value={formData.insurance_policy_number}
                          onChange={handleChange}
                          className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">NHIS Number</label>
                        <input
                          type="text"
                          name="nhis_number"
                          value={formData.nhis_number}
                          onChange={handleChange}
                          className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.patient_status === 'active'}
                      onChange={(e) => setFormData({ ...formData, patient_status: e.target.checked ? 'active' : 'inactive' })}
                      className="sr-only peer"
                      disabled={isSubmitting}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-xs text-gray-700">
                    {formData.patient_status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {dupCheck.duplicate && dupCheck.existing && (
                  <div className="mb-3 p-2.5 rounded-lg border border-yellow-300 bg-yellow-50">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-yellow-800">
                          Possible duplicate patient found
                        </p>
                        <p className="text-[11px] text-yellow-700 truncate">
                          {dupCheck.existing.full_name || dupCheck.existing.name} ·{' '}
                          {dupCheck.existing.hospital_number}
                        </p>
                      </div>
                    </div>
                    {!forceDuplicate && (
                      <button
                        type="button"
                        onClick={() => setForceDuplicate(true)}
                        className="mt-2 w-full text-xs font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-lg py-1.5 transition-colors"
                      >
                        This is a different patient — Create Anyway
                      </button>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting || (dupCheck.duplicate && !forceDuplicate)}
                    className="flex-1 bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {mode === 'edit' ? 'Update' : 'Add'} Patient
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-100 text-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {mode === 'view' && (
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100 flex-shrink-0">
              <ButtonWithTooltip
                onClick={onClose}
                tooltip="Close details"
                variant="secondary"
                size="sm"
              >
                Close
              </ButtonWithTooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact Delete Confirmation Modal
const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  patient,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm transform transition-all duration-200">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Archive className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Archive Patient?</h3>
                <p className="text-xs text-gray-500">This will mark the patient as inactive and hide them from active search results.</p>
              </div>
            </div>

            {patient && (
              <div className="bg-gray-50 rounded-lg p-2.5 mb-3 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {patient.name || patient.full_name}
                    </p>
                    <div className="flex gap-2 text-xs text-gray-500">
                      {patient.phone && <span>📱 {patient.phone}</span>}
                      {patient.email && <span className="truncate">✉️ {patient.email}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                  This will mark the patient record as inactive. The patient data will remain in the system but be hidden from active searches.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 py-1.5 px-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Archiving...
                  </>
                ) : (
                  <>
                    <Archive className="w-3.5 h-3.5" />
                    Archive
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 py-1.5 px-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact Duplicate Warning Modal
const DuplicateWarningModal = ({
  isOpen,
  onClose,
  onConfirm,
  existingPatient,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  const formatDob = (dob) => {
    if (!dob) return 'N/A';
    const d = new Date(dob);
    return isNaN(d.getTime()) ? dob : d.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm transform transition-all duration-200">
          <div className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Possible Duplicate Patient</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  A patient with the same name and date of birth already exists.
                </p>
              </div>
            </div>

            {existingPatient && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {existingPatient.full_name || existingPatient.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {existingPatient.hospital_number || 'No Hospital Number'}
                    </p>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    (existingPatient.patient_status || 'active') === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {(existingPatient.patient_status || 'active').charAt(0).toUpperCase() + (existingPatient.patient_status || 'active').slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                  <div>
                    <span className="text-gray-400">DOB: </span>
                    {formatDob(existingPatient.date_of_birth)}
                  </div>
                  <div>
                    <span className="text-gray-400">Gender: </span>
                    {existingPatient.gender || 'N/A'}
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400">Phone: </span>
                    {existingPatient.phone || 'N/A'}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                  Creating this record will add a duplicate patient. Please verify this
                  is not the same person before continuing.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="flex-1 py-1.5 px-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Create Anyway
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-1.5 px-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const PatientManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, filteredPatients, searchTerm, sortBy, filterBy, error } = useSelector(
    state => state.patient
  );

  // ===== STATE =====
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicatePatient, setDuplicatePatient] = useState(null);
  const [pendingFormData, setPendingFormData] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [localPatients, setLocalPatients] = useState([]);
  
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(null);
  const [bulkUploadResult, setBulkUploadResult] = useState(null);
  const [bulkUploadError, setBulkUploadError] = useState(null);
  const bulkUploadPollsRef = useRef({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [patientSummary, setPatientSummary] = useState({ total: 0, active: 0, inactive: 0 });
  const [patientsNextPage, setPatientsNextPage] = useState(null);
  const [patientsPreviousPage, setPatientsPreviousPage] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState('/api/v1/patients/patients/');
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  
  const [searchTermLocal, setSearchTermLocal] = useState('');
  const [sortByLocal, setSortByLocal] = useState('name');
  const [filterByLocal, setFilterByLocal] = useState('all');
  
  const [nigerianStates, setNigerianStates] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [showApiError, setShowApiError] = useState(false);
  const [formError, setFormError] = useState(null);

  const extractApiError = (err) => {
    const data = err?.data;
    if (data && typeof data === 'object') {
      const lines = [];
      for (const [field, messages] of Object.entries(data)) {
        if (Array.isArray(messages)) {
          messages.forEach(msg => lines.push(`${field}: ${msg}`));
        } else {
          lines.push(`${field}: ${messages}`);
        }
      }
      if (lines.length > 0) return lines.join('\n');
    }
    return err?.message || 'Unable to save patient';
  };

  // ===== API FUNCTIONS =====
  // Build the patients list URL with the active search + filters so that
  // searching/filtering happens on the server and works across ALL pages.
  const buildPatientsUrl = (overrides = {}) => {
    const search = overrides.search !== undefined ? overrides.search : searchTermLocal;
    const status = overrides.status !== undefined ? overrides.status : statusFilter;
    const stateFilter = overrides.state !== undefined ? overrides.state : filterByLocal;
    const pageSize = overrides.page_size;
    const page = overrides.page;

    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    if (status !== undefined) params.append('status', status);
    if (stateFilter && stateFilter !== 'all') params.append('state', stateFilter);
    if (pageSize) params.append('page_size', pageSize);
    if (page) params.append('page', page);

    const qs = params.toString();
    return `/api/v1/patients/patients/${qs ? `?${qs}` : ''}`;
  };

  const normalizePatient = (patient) => {
    const fullName = patient.full_name || patient.name || [patient.first_name, patient.last_name].filter(Boolean).join(' ').trim() || 'Unknown Patient';
    const hospitalNumber = patient.hospital_number || patient.hospitalNumber || patient.patient_id || patient.id || '';
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
      date_of_birth: patient.date_of_birth || patient.dateOfBirth || '',
      registration_date: patient.registration_date || patient.createdAt || '',
    };
  };

  const ensureNormalizePatient = () => {
    if (typeof normalizePatient !== 'function') {
      console.error('PatientManagement regression: normalizePatient helper is missing or not a function.');
      throw new Error('PatientManagement regression: normalizePatient helper missing');
    }
  };

  useEffect(() => {
    ensureNormalizePatient();
  }, []);

  useEffect(() => {
    loadPatients(buildPatientsUrl(), { silent: true });
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadPatients(buildPatientsUrl(), { silent: true });
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTermLocal]);

  const loadPatients = async (url = '/api/v1/patients/patients/', { silent = false, fetchAll = false } = {}) => {
    try {
      if (silent) setTableLoading(true);
      else setIsLoading(true);
      
      let combinedPatients = [];
      let nextUrl = url;
      let data;

      const fetchPage = async (pageUrl) => {
        if (pageUrl.startsWith('http')) {
          const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
          const response = await fetch(pageUrl, {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return await response.json();
        }
        return await apiRequest(pageUrl);
      };

      if (fetchAll) {
        while (nextUrl) {
          data = await fetchPage(nextUrl);
          const patientsList = Array.isArray(data) ? data : (data.results || []);
          const normalizedPatients = patientsList.map(normalizePatient);
          combinedPatients = combinedPatients.concat(normalizedPatients);
          nextUrl = data.next || null;
        }
      } else {
        data = await fetchPage(url);
        const patientsList = Array.isArray(data) ? data : (data.results || []);
        combinedPatients = patientsList.map(normalizePatient);
        nextUrl = data.next || null;
      }
      
      // Store in local state
      setLocalPatients(combinedPatients);
      
      // Dispatch to Redux
      dispatch(setPatients(combinedPatients));
      
      setTotalCount(fetchAll ? combinedPatients.length : (data.count !== undefined ? data.count : combinedPatients.length));
      
      setPatientsNextPage(fetchAll ? null : (data.next || null));
      setPatientsPreviousPage(fetchAll ? null : (data.previous || null));
      setCurrentPageUrl(url);
      
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      const pageParam = urlParams.get('page');
      setCurrentPageNumber(pageParam ? parseInt(pageParam, 10) : 1);
      
    } catch (err) {
      console.error('Failed to load patients:', err);
      setApiError(extractApiError(err));
      setShowApiError(true);
    } finally {
      setIsLoading(false);
      setTableLoading(false);
    }
  };

  // ===== EVENT HANDLERS =====
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setModalMode('view');
    setShowPatientModal(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setFormError(null);
    setModalMode('edit');
    setShowPatientModal(true);
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setFormError(null);
    setModalMode('add');
    setShowPatientModal(true);
  };

  const handleBulkUpload = async (file) => {
    setBulkUploadFile(file);
    setBulkUploadResult(null);
    setBulkUploadError(null);
    setBulkUploading(true);
    setBulkUploadProgress({
      status: 'processing',
      message: 'Uploading CSV and processing patients...',
    });

    try {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/v1/patients/bulk-uploads/`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');
        const data = isJson ? await response.json().catch(() => ({})) : await response.text();
        const message = (data && (data.detail || data.error || data.message || data.non_field_errors?.[0])) || `Upload failed with status ${response.status}`;
        throw new Error(message);
      }

      const result = await response.json();
      const isSuccess = response.ok;
      setBulkUploadResult(result);
      setBulkUploadProgress({
        status: isSuccess ? 'completed' : 'failed',
        message: result?.message || (isSuccess ? 'Bulk upload completed successfully.' : 'Bulk upload failed.'),
      });
      setBulkUploading(false);

      if (isSuccess) {
        await loadPatients(buildPatientsUrl(), { silent: true });
      }
    } catch (error) {
      console.error('Bulk upload failed:', error);
      setBulkUploadError(error.message);
      setBulkUploadProgress({
        status: 'failed',
        message: error.message || 'Bulk upload failed.',
      });
      setBulkUploading(false);
    }
  };

  const resetBulkUpload = () => {
    setBulkUploadFile(null);
    setBulkUploadProgress(null);
    setBulkUploadResult(null);
    setBulkUploadError(null);
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    setIsLoading(true);
    try {
      await apiRequest(`/api/v1/patients/patients/${patientToDelete.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          patient_status: 'inactive',
          is_active: false,
        }),
      });
      dispatch(archivePatient(patientToDelete.id));
      await loadPatients(buildPatientsUrl(), { silent: true });
      setShowDeleteModal(false);
      setPatientToDelete(null);
    } catch (error) {
      console.error('Archive failed:', error);
      setApiError(extractApiError(error));
      setShowApiError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestorePatient = async (patient) => {
    if (!patient) return;
    const confirmation = window.confirm(`Restore patient ${patient.name || 'this patient'}?`);
    if (!confirmation) return;

    setIsLoading(true);
    try {
      await apiRequest(`/api/v1/patients/patients/${patient.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          patient_status: 'active',
          is_active: true,
        }),
      });
      dispatch(restorePatient(patient.id));
      await loadPatients(buildPatientsUrl(), { silent: true });
    } catch (error) {
      console.error('Restore failed:', error);
      setApiError(extractApiError(error));
      setShowApiError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePatient = async (formData, forceDuplicate = false) => {
    setFormError(null);
    setIsSubmitting(true);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      setFormError('Invalid email format');
      setIsSubmitting(false);
      return;
    }
    
    if (formData.dateOfBirth && new Date(formData.dateOfBirth) > new Date()) {
      setFormError('Date of birth cannot be in the future');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const fullName = (formData.name || '').trim().split(/\s+/);
      const firstName = fullName.shift() || '';
      const lastName = fullName.join(' ') || 'Unknown';

      const payload = {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: formData.dateOfBirth || '',
        gender: formData.gender?.toLowerCase() || 'unknown',
        phone: formData.phone,
        email: formData.email || '',
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || 'Rivers',
        lga: formData.lga || '',
        country: formData.country || 'Nigeria',
        blood_group: formData.bloodType || 'unknown',
        marital_status: formData.maritalStatus?.toLowerCase() || 'single',
        religion: formData.religion || '',
        ethnicity: formData.tribe || '',
        occupation: formData.occupation || '',
        next_of_kin_name: formData.emergencyContact || '',
        next_of_kin_phone: formData.emergencyPhone || '',
        password: 'PatientPass123!',
        nin: formData.nin || '',
        patient_status: formData.patient_status || 'active',
        is_active: formData.patient_status === 'active',
        genotype: formData.genotype || '',
        has_insurance: formData.has_insurance || false,
        insurance_company: formData.insurance_company || '',
        insurance_policy_number: formData.insurance_policy_number || '',
        nhis_number: formData.nhis_number || '',
        known_allergies: formData.known_allergies || '',
        chronic_conditions: formData.chronic_conditions || '',
        current_medications: formData.current_medications || '',
        surgical_history: formData.surgical_history || '',
        family_history: formData.family_history || '',
        notes: formData.notes || '',
      };

      if (forceDuplicate) {
        payload.confirm_duplicate = true;
      }

      if (modalMode === 'edit' && selectedPatient) {
        const updated = await apiRequest(`/api/v1/patients/patients/${selectedPatient.id}/`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        dispatch(updatePatient(normalizePatient(updated)));
      } else {
        try {
          const created = await apiRequest('/api/v1/patients/patients/', {
            method: 'POST',
            body: JSON.stringify(payload),
          });
          dispatch(addPatient(normalizePatient(created)));
        } catch (err) {
          if (err?.data?.duplicate) {
            setPendingFormData(formData);
            setDuplicatePatient(err.data.existing_patient || null);
            setShowDuplicateModal(true);
            return;
          }
          throw err;
        }
      }

      setShowPatientModal(false);
      await loadPatients(buildPatientsUrl(), { silent: true });
    } catch (err) {
      console.error('Failed to save patient:', err);
      setApiError(extractApiError(err));
      setShowApiError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDuplicateCreate = () => {
    setShowDuplicateModal(false);
    if (pendingFormData) {
      handleSavePatient(pendingFormData, true);
    }
  };

  // ===== FILTER HANDLERS =====
  const setStatusFilterLocal = (filter) => {
    if (statusFilter === filter) return;
    setStatusFilter(filter);
    if (filter !== 'all') {
      setFilterByLocal('all');
    }
  };

  const setStateFilterLocal = (state) => {
    if (filterByLocal === state) return;
    setFilterByLocal(state);
    setStatusFilter('all');
  };

  const handleFilterByStatus = (filter) => {
    if (statusFilter === filter) return;

    setStatusFilter(filter);
    if (filter !== 'all') {
      setFilterByLocal('all');
    }
    // Reload from server so the status filter applies across all pages
    loadPatients(buildPatientsUrl({ status: filter }), { silent: true });
  };

  const handleFilterByState = (state) => {
    if (filterByLocal === state) return;

    setFilterByLocal(state);
    setStatusFilter('all');
    dispatch(filterPatients(state));
    // Reload from server so the state filter applies across all pages
    loadPatients(buildPatientsUrl({ state, status: 'all' }), { silent: true });
  };

  // ===== FILTER PATIENTS BY STATUS =====
  const getFilteredPatientsByStatus = () => {
    // Use localPatients first, fallback to filteredPatients or patients
    const baseList = localPatients.length > 0 ? localPatients : (filteredPatients || patients || []);
    
    // First apply state filter if not 'all'
    let stateFiltered = baseList;
    if (filterByLocal !== 'all') {
      stateFiltered = baseList.filter(patient => patient.state === filterByLocal);
    }
    
    // Then apply status filter
    if (statusFilter === 'all') {
      return stateFiltered;
    }
    
    return stateFiltered.filter(patient => {
      const patientStatus = (patient.patient_status || patient.status || 'active').toLowerCase();
      if (statusFilter === 'active') {
        return patientStatus === 'active';
      }
      if (statusFilter === 'inactive') {
        return patientStatus === 'inactive' || patientStatus === 'archived';
      }
      return true;
    });
  };

  // ===== STATS =====
  const allPatients = localPatients.length > 0 ? localPatients : (filteredPatients || patients || []);
  const filteredByStatus = getFilteredPatientsByStatus();
  
  const activeCount = allPatients.filter(p => {
    const status = (p.patient_status || p.status || 'active').toLowerCase();
    return status === 'active';
  }).length;

  const inactiveCount = allPatients.filter(p => {
    const status = (p.patient_status || p.status || 'active').toLowerCase();
    return status === 'inactive' || status === 'archived';
  }).length;

  const stats = {
    total: patientSummary.total || activeCount + inactiveCount,
    active: patientSummary.active || activeCount,
    inactive: patientSummary.inactive || inactiveCount,
    states: new Set(allPatients.map(p => p.state).filter(Boolean)).size,
  };

  // ===== RENDER =====
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <LoadingSpinner overlay text="Loading patients..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Patient Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage patient records, demographics, and medical history
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => setShowBulkUploadModal(true)}
              tooltip="Bulk upload patients via CSV"
              variant="secondary"
              size="sm"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk Upload</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleAddPatient}
              tooltip="Register a new patient"
              variant="primary"
              size="sm"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Patient</span>
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Stats - All cards are clickable */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Total Card - Click to show all patients */}
          <div 
            className={`bg-white rounded-lg border p-3 hover:shadow-md transition-all cursor-pointer ${
              statusFilter === 'all' && filterByLocal === 'all' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
            }`}
            onClick={() => {
              if (statusFilter !== 'all' || filterByLocal !== 'all') {
                setStatusFilterLocal('all');
                setStateFilterLocal('all');
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Total</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Card - Click to show only active patients */}
          <div 
            className={`bg-white rounded-lg border p-3 hover:shadow-md transition-all cursor-pointer ${
              statusFilter === 'active' ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'
            }`}
            onClick={() => setStatusFilterLocal('active')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Active</p>
                <p className="text-xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          {/* Inactive Card - Click to show only inactive patients */}
          <div 
            className={`bg-white rounded-lg border p-3 hover:shadow-md transition-all cursor-pointer ${
              statusFilter === 'inactive' ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'
            }`}
            onClick={() => setStatusFilterLocal('inactive')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Inactive</p>
                <p className="text-xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
                <UserX className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>

          {/* States Card - Click to show state distribution */}
          <div 
            className={`bg-white rounded-lg border p-3 hover:shadow-md transition-all cursor-pointer ${
              filterByLocal !== 'all' && statusFilter === 'all' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
            }`}
            onClick={() => {
              // Cycle through states or show all
              if (filterByLocal === 'all' && nigerianStates.length > 0) {
                setStateFilterLocal(nigerianStates[0]);
              } else {
                const currentIndex = nigerianStates.indexOf(filterByLocal);
                const nextIndex = (currentIndex + 1) % nigerianStates.length;
                setStateFilterLocal(nextIndex === 0 ? 'all' : nigerianStates[nextIndex]);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">States</p>
                <p className="text-xl font-bold text-purple-600">{stats.states}</p>
                {filterByLocal !== 'all' && (
                  <p className="text-xs text-purple-600 truncate max-w-[80px]">Filtered: {filterByLocal}</p>
                )}
              </div>
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                <Map className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter Indicator */}
        {(statusFilter !== 'all' || filterByLocal !== 'all') && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            {statusFilter !== 'all' && (
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                statusFilter === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <FilterIcon className="w-3 h-3" />
                Showing: {statusFilter === 'active' ? 'Active Patients' : 'Inactive Patients'}
                <button
                  onClick={() => {
                    handleFilterByStatus('all');
                  }}
                  className="ml-1 hover:bg-gray-200 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filterByLocal !== 'all' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-100 text-purple-800">
                <Map className="w-3 h-3" />
                State: {filterByLocal}
                <button
                  onClick={() => {
                    handleFilterByState('all');
                  }}
                  className="ml-1 hover:bg-purple-200 rounded p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <span className="text-xs text-gray-500">
              {filteredByStatus.length} patients found
            </span>
          </div>
        )}

        {/* Bulk Upload Status Banner */}
        {(bulkUploadProgress || bulkUploadResult) && (
          <div className={`mb-4 p-3 rounded-lg border ${
            bulkUploadResult?.status === 'failed' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {bulkUploading ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                ) : bulkUploadResult?.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : bulkUploadResult?.status === 'failed' ? (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                ) : (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                )}
                <span className="text-sm font-medium text-gray-900">
                  {bulkUploadProgress?.message || bulkUploadResult?.message}
                </span>
              </div>
              {!bulkUploading && (
                <button
                  onClick={resetBulkUpload}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            {bulkUploadResult && (
              <div className="mt-2 text-sm text-gray-700">
                <p>Total: {bulkUploadResult.total_records} | Success: {bulkUploadResult.success_count} | Failed: {bulkUploadResult.failure_count}</p>
                {bulkUploadResult.errors && bulkUploadResult.errors.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-700 font-medium text-sm">
                      View errors ({bulkUploadResult.errors.length})
                    </summary>
                    <div className="mt-1 max-h-32 overflow-y-auto bg-white rounded border border-red-100 p-2">
                      {bulkUploadResult.errors.slice(0, 10).map((err, idx) => (
                        <div key={idx} className="text-xs text-red-800 py-1 border-b border-red-50 last:border-0">
                          Row {err.row}: {err.error}
                        </div>
                      ))}
                      {bulkUploadResult.errors.length > 10 && (
                        <div className="text-xs text-gray-500 mt-1">...and {bulkUploadResult.errors.length - 10} more</div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        )}

        {/* Main Table */}
        <div className="bg-white rounded-lg border border-gray-200 relative">
          {tableLoading && (
            <div className="absolute inset-0 z-10 bg-white/60 rounded-lg flex items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                Loading...
              </div>
            </div>
          )}
          {/* Toolbar */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient ID or name..."
                  value={searchTermLocal}
                  onChange={(e) => setSearchTermLocal(e.target.value)}
                  className="w-full pl-9 pr-9 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
                  {tableLoading ? (
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  ) : searchTermLocal ? (
                    <button
                      onClick={() => setSearchTermLocal('')}
                      className="p-0.5 rounded hover:bg-gray-100 transition-colors"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterByStatus(e.target.value)}
                  className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Patients</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
                
                <select
                  value={sortByLocal}
                  onChange={(e) => {
                    setSortByLocal(e.target.value);
                    dispatch(sortPatients(e.target.value));
                  }}
                  className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="name">Name A-Z</option>
                  <option value="date">Newest</option>
                  <option value="state">State</option>
                </select>
                <select
                  value={filterByLocal}
                  onChange={(e) => handleFilterByState(e.target.value)}
                  className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All States</option>
                  {nigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-3">
            {filteredByStatus.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No patients found</p>
                <p className="text-sm text-gray-500 mt-1">
                  {searchTermLocal ? 'Try adjusting your search' : 'Start by registering your first patient'}
                </p>
                {!searchTermLocal && (
                  <ButtonWithTooltip
                    onClick={handleAddPatient}
                    tooltip="Register a new patient"
                    variant="primary"
                    className="mt-3"
                    size="sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Patient
                  </ButtonWithTooltip>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-3">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Contact</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredByStatus.map((patient, index) => {
                        const serialNumber = (currentPageNumber - 1) * 20 + index + 1;
                        const patientStatus = patient.patient_status || 'active';
                        const isActive = patientStatus === 'active' || patientStatus === 'Active';
                        
                        return (
                          <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-2 text-center text-sm text-gray-500 font-medium">
                              {serialNumber}
                            </td>
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0 ${
                                  isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {patient.name?.charAt(0) || '?'}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">{patient.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {patient.hospital_number || 'No ID'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 hidden sm:table-cell">
                              <div className="text-sm text-gray-600">{patient.phone}</div>
                              <div className="text-xs text-gray-400">{patient.email || 'No email'}</div>
                            </td>
                            <td className="py-2 hidden md:table-cell">
                              <div className="text-sm text-gray-600">{patient.state || '-'}</div>
                              <div className="text-xs text-gray-400">{patient.city || patient.lga || '-'}</div>
                            </td>
                            <td className="py-2">
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                                isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-2">
                              <div className="flex items-center gap-0.5">
                                <IconButton
                                  icon={Eye}
                                  onClick={() => handleViewPatient(patient)}
                                  tooltip="View details"
                                  variant="primary"
                                  size="sm"
                                />
                                <IconButton
                                  icon={Edit}
                                  onClick={() => handleEditPatient(patient)}
                                  tooltip="Edit patient"
                                  variant="primary"
                                  size="sm"
                                />
                                {isActive ? (
                                  <IconButton
                                    icon={Trash2}
                                    onClick={() => handleDeleteClick(patient)}
                                    tooltip="Archive patient"
                                    variant="danger"
                                    size="sm"
                                  />
                                ) : (
                                  <IconButton
                                    icon={RotateCcw}
                                    onClick={() => handleRestorePatient(patient)}
                                    tooltip="Restore patient"
                                    variant="success"
                                    size="sm"
                                  />
                                )}
                                <IconButton
                                  icon={Bed}
                                  onClick={() => navigate('/admissions', {
                                    state: {
                                      preselectedPatient: {
                                        patientId: patient.hospital_number || patient.id,
                                        patientName: patient.name,
                                        phone: patient.phone,
                                        email: patient.email,
                                        id: patient.id,
                                      }
                                    }
                                  })}
                                  tooltip="Create admission"
                                  variant="success"
                                  size="sm"
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-3 pt-3 border-t border-gray-200 gap-2">
                  <div className="text-xs text-gray-500">
                    Showing {Math.min((currentPageNumber - 1) * 20 + 1, totalCount)} to {Math.min(currentPageNumber * 20, totalCount)} of {totalCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <IconButton
                      icon={ChevronLeft}
                      onClick={() => patientsPreviousPage && loadPatients(patientsPreviousPage, { silent: true })}
                      tooltip="Previous page"
                      variant="default"
                      size="sm"
                      disabled={!patientsPreviousPage}
                    />
                    <span className="text-xs text-gray-600 px-2">
                      Page {currentPageNumber} of {Math.ceil(totalCount / 20) || 1}
                    </span>
                    <IconButton
                      icon={ChevronRight}
                      onClick={() => patientsNextPage && loadPatients(patientsNextPage, { silent: true })}
                      tooltip="Next page"
                      variant="default"
                      size="sm"
                      disabled={!patientsNextPage}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Patient Modal */}
      <PatientModal
        isOpen={showPatientModal}
        onClose={() => {
          setShowPatientModal(false);
          setSelectedPatient(null);
          setFormError(null);
        }}
        patient={selectedPatient}
        mode={modalMode}
        onSave={handleSavePatient}
        isSubmitting={isSubmitting}
        formError={formError}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkUploadModal}
        onClose={() => {
          setShowBulkUploadModal(false);
          resetBulkUpload();
        }}
        onUpload={handleBulkUpload}
        isUploading={bulkUploading}
        progress={bulkUploadProgress}
        result={bulkUploadResult}
        error={bulkUploadError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPatientToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        patient={patientToDelete}
        isDeleting={isLoading}
      />

      {/* Duplicate Warning Modal */}
      <DuplicateWarningModal
        isOpen={showDuplicateModal}
        onClose={() => {
          setShowDuplicateModal(false);
          setDuplicatePatient(null);
          setPendingFormData(null);
        }}
        onConfirm={confirmDuplicateCreate}
        existingPatient={duplicatePatient}
        isSubmitting={isSubmitting}
      />

      {/* API Error Modal */}
      {showApiError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900">Error</h3>
              </div>
              <div className="bg-red-50 rounded-lg border border-red-200 p-2.5 mb-3">
                <p className="text-sm text-red-800 whitespace-pre-line">{apiError}</p>
              </div>
              <button
                onClick={() => setShowApiError(false)}
                className="w-full py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;