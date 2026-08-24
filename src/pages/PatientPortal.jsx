import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import {
  User,
  Calendar,
  FileText,
  Pill,
  CreditCard,
  BookOpen,
  Video,
  Bell,
  Settings,
  Search,
  Filter,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  EyeOff,
  MessageSquare,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  Building2,
  Users,
  Activity,
  Award,
  Globe,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Menu,
  MoreVertical,
  UserCheck,
  UserX,
  Droplets,
  Brain,
  Map,
  Hospital,
  Stethoscope,
  HeartPulse,
  Ambulance,
  Syringe,
  Microscope,
  Clipboard,
  X,
  Printer,
  Archive,
  RotateCcw,
  Trash2,
  Edit,
  Bed,
  UserPlus,
  FolderOpen,
  CalendarDays,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Sparkles,
  Heart,
  Shield,
  AlertTriangle as AlertTriangleIcon,
  CheckCircle2,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Receipt,
  Layers,
  Grid,
  List,
  Filter as FilterIcon,
  Download as DownloadIcon,
  Upload,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import {
  registerPatient,
  updatePatientProfile,
  bookAppointment,
  cancelAppointment,
  requestPrescriptionRefill,
  viewTestResults,
  makePayment,
  bookTelemedicineSession,
  markNotificationRead,
  submitFeedback,
  hydratePortalData,
  searchPortal,
  sortPortal,
  filterPortal
} from '../features/patientPortalSlice';
import { apiRequest } from '../utils/api';
import Pagination from '../components/Pagination';
import { Link, useNavigate } from 'react-router-dom';

// ==================== COMPONENTS ====================

// ECG Waveform Component
const EcgLine = ({ className = '' }) => (
  <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
    <svg
      className="absolute left-0 top-0 h-full w-[200%] motion-safe:animate-ecg-scroll"
      viewBox="0 0 800 60"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M0,30 L58,30 L74,30 L84,10 L94,50 L104,30 L120,30 L200,30
           L258,30 L274,30 L284,10 L294,50 L304,30 L320,30 L400,30
           L458,30 L474,30 L484,10 L494,50 L504,30 L520,30 L600,30
           L658,30 L674,30 L684,10 L694,50 L704,30 L720,30 L800,30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

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

// Compact Status Badge
const StatusBadge = ({ status }) => {
  const statusMap = {
    'confirmed': 'bg-green-100 text-green-800 border-green-200',
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'cancelled': 'bg-red-100 text-red-800 border-red-200',
    'completed': 'bg-blue-100 text-blue-800 border-blue-200',
    'active': 'bg-green-100 text-green-800 border-green-200',
    'inactive': 'bg-gray-100 text-gray-800 border-gray-200',
    'archived': 'bg-gray-100 text-gray-800 border-gray-200',
    'paid': 'bg-green-100 text-green-800 border-green-200',
    'overdue': 'bg-red-100 text-red-800 border-red-200',
    'routine': 'bg-blue-100 text-blue-800 border-blue-200',
    'urgent': 'bg-orange-100 text-orange-800 border-orange-200',
    'emergency': 'bg-red-100 text-red-800 border-red-200',
  };

  const defaultClass = 'bg-gray-100 text-gray-800 border-gray-200';
  const statusClass = statusMap[status?.toLowerCase()] || defaultClass;

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${statusClass}`}>
      {status}
    </span>
  );
};

// ==================== MODALS ====================

// Compact Appointment Modal
const AppointmentModal = ({ isOpen, onClose, onSubmit, patient, departments, availableSlots, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    dateTime: '',
    reason: '',
    urgency: 'routine'
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        department: '',
        doctor: '',
        dateTime: '',
        reason: '',
        urgency: 'routine'
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Book Appointment</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Select department...</option>
                {departments?.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Preferred Doctor (Optional)</label>
              <input
                type="text"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                placeholder="Dr. Smith"
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Preferred Date & Time *</label>
              <select
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Select available slot...</option>
                {formData.department && availableSlots?.[formData.department]?.map(slot => (
                  <option key={slot} value={slot}>
                    {new Date(slot).toLocaleString('en-NG')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Reason for Visit *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="2"
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Urgency Level</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="w-3.5 h-3.5" />
                    Book Appointment
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Compact Payment Modal
const PaymentModal = ({ isOpen, onClose, onSubmit, bills, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    billId: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        billId: '',
        paymentMethod: 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectedBill = bills?.find(b => b.id === formData.billId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                <CreditCard className="w-3.5 h-3.5 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Make Payment</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Select Bill *</label>
              <select
                name="billId"
                value={formData.billId}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Select bill...</option>
                {bills?.filter(b => b.status !== 'paid').map(bill => (
                  <option key={bill.id} value={bill.id}>
                    {bill.description} - ₦{bill.amount?.toLocaleString() || 0}
                  </option>
                ))}
              </select>
              {selectedBill && (
                <div className="mt-1 text-xs text-gray-500">
                  Amount: ₦{selectedBill.amount?.toLocaleString() || 0}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={isSubmitting}
              >
                <option value="card">Credit/Debit Card</option>
                <option value="bank">Bank Transfer</option>
                <option value="mobile">Mobile Money</option>
              </select>
            </div>

            {formData.paymentMethod === 'card' && (
              <>
                <div>
                  <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Card Number *</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Expiry Date *</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">CVV *</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 text-white py-1.5 px-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    Complete Payment
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Compact Telemedicine Modal
const TelemedicineModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    specialty: '',
    dateTime: '',
    reason: '',
    symptoms: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        specialty: '',
        dateTime: '',
        reason: '',
        symptoms: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const specialties = ['General Medicine', 'Pediatrics', 'Dermatology', 'Mental Health', 'Nutrition'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-3">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
                <Video className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Book Telemedicine</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Specialty *</label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
                disabled={isSubmitting}
              >
                <option value="">Select specialty...</option>
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Preferred Date & Time *</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Reason for Consultation *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="2"
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Current Symptoms</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows="2"
                className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Describe your symptoms..."
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-purple-600 text-white py-1.5 px-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Video className="w-3.5 h-3.5" />
                    Book Session
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-1.5 px-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================

const PatientPortal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const {
    patients,
    appointments,
    medicalRecords,
    prescriptions,
    testResults,
    bills,
    payments,
    healthEducation,
    telemedicineSessions,
    notifications,
    healthTopics,
    availableSlots,
    searchTerm,
    sortBy,
    filterBy
  } = useSelector(state => state.patientPortal);

  // State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [portalError, setPortalError] = useState('');
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTelemedicineModal, setShowTelemedicineModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ identifier: false, password: false });
  const [now, setNow] = useState(() => new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localFilterBy, setLocalFilterBy] = useState('all');
  const [localSortBy, setLocalSortBy] = useState('date');

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load portal data
  useEffect(() => {
    const storedPatientToken = typeof window !== 'undefined' ? localStorage.getItem('patientAccessToken') : '';

    if (!storedPatientToken) {
      setCurrentPatient(null);
      setPortalError('');
      return;
    }

    const loadPortalData = async () => {
      setIsLoadingPortal(true);
      setPortalError('');
      try {
        const data = await apiRequest('/api/v1/patients/patients/portal/');
        dispatch(hydratePortalData(data));
        setCurrentPatient(data?.patient || null);
      } catch (error) {
        setPortalError(error.message || 'Unable to load your patient portal data.');
      } finally {
        setIsLoadingPortal(false);
      }
    };

    loadPortalData();
  }, [dispatch]);

  // Filter and search logic
  const filteredAppointments = appointments
    .filter(apt => {
      const matchesSearch = !localSearchTerm ||
        apt.doctor?.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        apt.department?.toLowerCase().includes(localSearchTerm.toLowerCase());
      const matchesFilter = localFilterBy === 'all' || apt.status === localFilterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (localSortBy === 'date') return new Date(b.dateTime) - new Date(a.dateTime);
      if (localSortBy === 'department') return a.department?.localeCompare(b.department);
      return 0;
    });

  const filteredBills = bills
    .filter(bill => {
      const matchesSearch = !localSearchTerm ||
        bill.description?.toLowerCase().includes(localSearchTerm.toLowerCase());
      const matchesFilter = localFilterBy === 'all' || bill.status === localFilterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedItems = activeTab === 'appointments' ? filteredAppointments : filteredBills;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const unreadNotifications = notifications.filter(n => !n.read);
  const hasPatientSession = typeof window !== 'undefined' && Boolean(localStorage.getItem('patientAccessToken'));

  // Stats
  const stats = {
    totalAppointments: appointments.length,
    upcomingAppointments: appointments.filter(a => new Date(a.dateTime) > new Date() && a.status !== 'cancelled').length,
    pendingBills: bills.filter(b => b.status === 'pending' || b.status === 'overdue').length,
    unreadNotifications: unreadNotifications.length,
    activePrescriptions: prescriptions.filter(p => p.status === 'active').length,
    totalTestResults: testResults.length
  };

  // Handlers
  const handlePatientLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setPortalError('');

    try {
      const response = await apiRequest('/api/v1/patients/login/', {
        method: 'POST',
        body: JSON.stringify({
          identifier: loginForm.identifier,
          password: loginForm.password,
        }),
      });

      const accessToken = response?.access_token || response?.accessToken || response?.token;
      const refreshToken = response?.refresh_token || response?.refreshToken;

      if (!accessToken) {
        throw new Error('No patient access token was returned by the server.');
      }

      localStorage.setItem('patientAccessToken', accessToken);
      localStorage.setItem('patientRefreshToken', refreshToken || '');
      localStorage.setItem('isPatientAuthenticated', 'true');
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('authToken', accessToken);

      const portalData = await apiRequest('/api/v1/patients/patients/portal/');
      dispatch(hydratePortalData(portalData));
      setCurrentPatient(portalData?.patient || null);
    } catch (error) {
      setPortalError(error.message || 'Unable to sign in to the patient portal.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleBookAppointment = async (formData) => {
    if (!currentPatient) return;
    setIsSubmitting(true);
    try {
      await dispatch(bookAppointment({
        ...formData,
        patientId: currentPatient.id,
        patientName: currentPatient.name
      }));
      setShowAppointmentModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMakePayment = async (formData) => {
    if (!currentPatient) return;
    setIsSubmitting(true);
    try {
      await dispatch(makePayment({
        ...formData,
        patientId: currentPatient.id,
        patientName: currentPatient.name
      }));
      setShowPaymentModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookTelemedicine = async (formData) => {
    if (!currentPatient) return;
    setIsSubmitting(true);
    try {
      await dispatch(bookTelemedicineSession({
        ...formData,
        patientId: currentPatient.id,
        patientName: currentPatient.name
      }));
      setShowTelemedicineModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (reason) {
      dispatch(cancelAppointment({ appointmentId, reason }));
    }
  };

  const handleMarkNotificationRead = (notificationId) => {
    dispatch(markNotificationRead(notificationId));
  };

  const handleLogout = () => {
    localStorage.removeItem('patientAccessToken');
    localStorage.removeItem('patientRefreshToken');
    localStorage.removeItem('isPatientAuthenticated');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');
    setCurrentPatient(null);
    navigate('/');
  };

  // Login screen stats
  const loginStats = [
    { label: 'Hospitals', value: '500+', icon: Building2 },
    { label: 'Patients', value: '2M+', icon: Users },
    { label: 'Daily encounters', value: '12K+', icon: Activity },
    { label: 'Uptime', value: '99.99%', icon: Clock }
  ];

  const clockLabel = now.toLocaleTimeString('en-GB', { hour12: false });

  // ==================== LOGIN SCREEN ====================
  if (!currentPatient && !hasPatientSession) {
    return (
      <div className="min-h-screen w-full bg-[#F6F2E7] font-['Inter',system-ui,sans-serif] antialiased lg:flex">
        {/* Brand / instrument panel */}
        <aside className="relative flex w-full flex-col justify-between overflow-hidden bg-[#0D1917] px-6 py-8 text-[#EFEBDD] sm:px-10 sm:py-10 lg:min-h-screen lg:w-[44%] lg:px-12 lg:py-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #EFEBDD 1px, transparent 1px), linear-gradient(to bottom, #EFEBDD 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
            aria-hidden="true"
          />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="inline-flex rounded-lg border border-[#C79A3D]/40 bg-[#C79A3D]/10 p-2.5">
                <ShieldCheck className="h-5 w-5 text-[#C79A3D]" />
              </span>
              <span className="font-['Lora'] text-lg font-semibold tracking-tight text-[#F6F2E7]">
                SmartCare<span className="text-[#C79A3D]">HMS</span>
              </span>
            </Link>

            <EcgLine className="mt-6 h-10 text-[#C79A3D]/70 sm:mt-8 sm:h-12" />

            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#C79A3D] sm:mt-8">
              Patient portal
            </p>
            <h1 className="mt-3 max-w-sm font-['Lora'] text-[28px] font-semibold leading-[1.15] text-[#F6F2E7] sm:text-[34px] lg:text-[36px]">
              Your health, connected.
            </h1>
            <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-[#A9C0B6] sm:text-sm">
              View appointments, access medical records, manage prescriptions,
              and stay connected with your care team.
            </p>

            <dl className="mt-10 hidden grid-cols-2 gap-x-6 gap-y-6 sm:grid lg:mt-12">
              {loginStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="border-l border-[#EFEBDD]/15 pl-3">
                    <Icon className="h-4 w-4 text-[#A9C0B6]" />
                    <dd className="mt-2 font-mono text-xl font-medium text-[#F6F2E7]">{stat.value}</dd>
                    <dt className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wider text-[#A9C0B6]">
                      {stat.label}
                    </dt>
                  </div>
                );
              })}
            </dl>
          </div>

          <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-[#EFEBDD]/10 pt-5 lg:mt-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10.5px] uppercase tracking-wider text-[#A9C0B6]">
              <span className="inline-flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" /> HIPAA-aligned
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" /> NDPR certified
              </span>
              <span className="hidden items-center gap-1.5 sm:inline-flex">
                <ShieldCheck className="h-3.5 w-3.5" /> ISO 27001
              </span>
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wider text-[#A9C0B6]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="motion-safe:animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#C79A3D]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C79A3D]" />
              </span>
              {clockLabel}
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[368px] motion-safe:animate-card-in">
            <div className="rounded-2xl border border-[#1C2B27]/8 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-14px_rgba(13,25,23,0.18)] sm:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C79A3D]">
                Patient access
              </p>
              <h2 className="mt-1.5 font-['Lora'] text-xl font-semibold leading-snug text-[#1C2B27] sm:text-[22px]">
                Welcome back
              </h2>
              <p className="mt-1.5 text-[13px] leading-snug text-[#5C6D67]">
                Sign in to access your appointments, records, and care updates.
              </p>

              {portalError && (
                <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-[#A6372E]/30 bg-[#A6372E]/10 px-3.5 py-2.5 text-[13px]">
                  <AlertCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0 text-[#8A2E26]" />
                  <span className="text-[#8A2E26]">{portalError}</span>
                </div>
              )}

              <form className="mt-5 space-y-3.5" onSubmit={handlePatientLogin}>
                <div>
                  <label htmlFor="identifier" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                    Patient identifier
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                        isFocused.identifier ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
                      }`}
                    />
                    <input
                      id="identifier"
                      name="identifier"
                      type="text"
                      required
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      onFocus={() => setIsFocused({ ...isFocused, identifier: true })}
                      onBlur={() => setIsFocused({ ...isFocused, identifier: false })}
                      placeholder="Hospital number, login ID, or patient ID"
                      className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-[#9AA6A0]">
                    If no password was set, use your hospital number as the password.
                  </p>
                </div>

                <div>
                  <label htmlFor="password" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                        isFocused.password ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
                      }`}
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      onFocus={() => setIsFocused({ ...isFocused, password: true })}
                      onBlur={() => setIsFocused({ ...isFocused, password: false })}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6A0] transition-colors hover:text-[#1C2B27]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#16302A] px-4 py-2.5 text-[13.5px] font-semibold text-[#F6F2E7] transition-colors hover:bg-[#1C3B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[#F6F2E7]" />
                      Signing in
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] leading-snug text-[#9AA6A0]">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>

            <p className="mt-5 text-center text-[11px] leading-snug text-[#9AA6A0]">
              Need help? Contact the hospital front desk
              <span className="mx-2 hidden sm:inline">&middot;</span>
              <span className="block sm:inline">&copy; {new Date().getFullYear()} SmartCare HMS</span>
            </p>
          </div>
        </main>

        <style>{`
          @keyframes ecg-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-ecg-scroll {
            animation: ecg-scroll 6s linear infinite;
          }

          @keyframes pulse-dot {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(2.2); opacity: 0; }
          }
          .animate-pulse-dot {
            animation: pulse-dot 1.8s ease-out infinite;
          }

          @keyframes card-in {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-card-in {
            animation: card-in 0.45s ease-out both;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-ecg-scroll,
            .animate-pulse-dot,
            .animate-card-in {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    );
  }

  if (!currentPatient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading Patient Portal...</p>
          {portalError && <p className="text-sm text-red-600 mt-2">{portalError}</p>}
        </div>
      </div>
    );
  }

  // ==================== PORTAL DASHBOARD ====================
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Patient Portal
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back, {currentPatient.name}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => setShowAppointmentModal(true)}
              tooltip="Book a new appointment"
              variant="primary"
              size="sm"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Book Appointment</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleLogout}
              tooltip="Sign out"
              variant="secondary"
              size="sm"
            >
              <UserX className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase">Appointments</p>
                <p className="text-lg font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase">Upcoming</p>
                <p className="text-lg font-bold text-green-600">{stats.upcomingAppointments}</p>
              </div>
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase">Pending Bills</p>
                <p className="text-lg font-bold text-yellow-600">{stats.pendingBills}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Receipt className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase">Notifications</p>
                <p className="text-lg font-bold text-purple-600">{stats.unreadNotifications}</p>
              </div>
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase">Prescriptions</p>
                <p className="text-lg font-bold text-orange-600">{stats.activePrescriptions}</p>
              </div>
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <Pill className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase">Test Results</p>
                <p className="text-lg font-bold text-red-600">{stats.totalTestResults}</p>
              </div>
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <Microscope className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: User },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'records', label: 'Medical Records', icon: FileText },
              { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
              { id: 'billing', label: 'Billing', icon: CreditCard },
              { id: 'telemedicine', label: 'Telemedicine', icon: Video },
              { id: 'education', label: 'Education', icon: BookOpen }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setShowAppointmentModal(true)}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex flex-col items-center gap-1"
                    >
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <span className="text-xs font-medium text-gray-700">Book Appointment</span>
                    </button>
                    <button
                      onClick={() => setShowTelemedicineModal(true)}
                      className="p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors flex flex-col items-center gap-1"
                    >
                      <Video className="w-6 h-6 text-purple-600" />
                      <span className="text-xs font-medium text-gray-700">Telemedicine</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('records')}
                      className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors flex flex-col items-center gap-1"
                    >
                      <FileText className="w-6 h-6 text-green-600" />
                      <span className="text-xs font-medium text-gray-700">View Records</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('billing')}
                      className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors flex flex-col items-center gap-1"
                    >
                      <CreditCard className="w-6 h-6 text-yellow-600" />
                      <span className="text-xs font-medium text-gray-700">Pay Bills</span>
                    </button>
                  </div>
                </div>

                {/* Recent Notifications */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
                    <span>Recent Notifications</span>
                    <span className="text-xs text-gray-500">{unreadNotifications.length} unread</span>
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.slice(0, 5).map(notification => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString('en-NG', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkNotificationRead(notification.id)}
                              className="flex-shrink-0 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {notifications.length === 0 && (
                      <div className="text-center py-6">
                        <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div>
                {/* Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search appointments..."
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={localFilterBy}
                    onChange={(e) => setLocalFilterBy(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={localSortBy}
                    onChange={(e) => setLocalSortBy(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="department">Sort by Department</option>
                  </select>
                  <ButtonWithTooltip
                    onClick={() => setShowAppointmentModal(true)}
                    tooltip="Book a new appointment"
                    variant="primary"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                    Book Appointment
                  </ButtonWithTooltip>
                </div>

                {/* Appointments List */}
                <div className="space-y-3">
                  {paginatedData.map(appointment => (
                    <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900">{appointment.doctor || 'Doctor'}</h4>
                            <StatusBadge status={appointment.status} />
                          </div>
                          <p className="text-sm text-gray-600">{appointment.department}</p>
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="ml-1 text-gray-700">
                                {new Date(appointment.dateTime).toLocaleString('en-NG', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Urgency:</span>
                              <span className={`ml-1 font-medium ${
                                appointment.urgency === 'emergency' ? 'text-red-600' :
                                appointment.urgency === 'urgent' ? 'text-orange-600' :
                                'text-blue-600'
                              }`}>
                                {appointment.urgency}
                              </span>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-gray-500">Reason:</span>
                              <span className="ml-1 text-gray-700">{appointment.reason}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {appointment.status === 'confirmed' && (
                            <ButtonWithTooltip
                              onClick={() => handleCancelAppointment(appointment.id)}
                              tooltip="Cancel appointment"
                              variant="danger"
                              size="sm"
                            >
                              <XCircle className="w-4 h-4" />
                              Cancel
                            </ButtonWithTooltip>
                          )}
                          {appointment.status === 'confirmed' && (
                            <ButtonWithTooltip
                              onClick={() => {}}
                              tooltip="View details"
                              variant="primary"
                              size="sm"
                            >
                              <Eye className="w-4 h-4" />
                            </ButtonWithTooltip>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {paginatedData.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">No appointments found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {localSearchTerm ? 'Try adjusting your search' : 'Book your first appointment'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {paginatedItems.length > itemsPerPage && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Showing {Math.min((currentPage - 1) * itemsPerPage + 1, paginatedItems.length)} to {Math.min(currentPage * itemsPerPage, paginatedItems.length)} of {paginatedItems.length}
                    </div>
                    <div className="flex items-center gap-1">
                      <IconButton
                        icon={ChevronLeft}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        tooltip="Previous page"
                        variant="default"
                        size="sm"
                        disabled={currentPage === 1}
                      />
                      <span className="text-xs text-gray-600 px-2">
                        Page {currentPage} of {Math.ceil(paginatedItems.length / itemsPerPage)}
                      </span>
                      <IconButton
                        icon={ChevronRight}
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(paginatedItems.length / itemsPerPage), p + 1))}
                        tooltip="Next page"
                        variant="default"
                        size="sm"
                        disabled={currentPage === Math.ceil(paginatedItems.length / itemsPerPage)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'records' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">Medical Records</h3>
                  <span className="text-xs text-gray-500">{testResults.length + medicalRecords.length} items</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Test Results */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <Microscope className="w-4 h-4 text-blue-500" />
                      Laboratory Results
                    </h4>
                    <div className="space-y-2">
                      {testResults.slice(0, 6).map(result => (
                        <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm text-gray-900">{result.title || result.testName || 'Lab Test'}</p>
                              <p className="text-sm text-gray-600">{result.result || result.status || 'Pending review'}</p>
                            </div>
                            <StatusBadge status={result.status || 'ordered'} />
                          </div>
                          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                            <span>{result.date ? new Date(result.date).toLocaleDateString() : 'Pending'}</span>
                            {result.orderNumber && <span>Order #{result.orderNumber}</span>}
                          </div>
                        </div>
                      ))}
                      {testResults.length === 0 && (
                        <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <p className="text-sm text-gray-500">No laboratory results available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-500" />
                      Documents & Reports
                    </h4>
                    <div className="space-y-2">
                      {medicalRecords.slice(0, 6).map(doc => (
                        <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm text-gray-900">{doc.title || doc.fileName || 'Document'}</p>
                              <p className="text-sm text-gray-600">{doc.type || 'Document'}</p>
                            </div>
                            <IconButton
                              icon={Eye}
                              onClick={() => {}}
                              tooltip="View document"
                              variant="primary"
                              size="sm"
                            />
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            {doc.date ? new Date(doc.date).toLocaleDateString() : 'Recently added'}
                          </div>
                        </div>
                      ))}
                      {medicalRecords.length === 0 && (
                        <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <p className="text-sm text-gray-500">No documents available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">Prescriptions</h3>
                  <span className="text-xs text-gray-500">{prescriptions.length} prescriptions</span>
                </div>
                <div className="space-y-3">
                  {[...prescriptions].sort((a, b) => new Date(b.prescribedAt || b.prescribed_date || 0) - new Date(a.prescribedAt || a.prescribed_date || 0)).map(prescription => (
                    <div key={prescription.id} className="bg-white border border-[#e5e7eb] p-4 hover:bg-[#f9fafb] transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-medium text-[#1a1f2e]">{prescription.medication}</h4>
                            <StatusBadge status={prescription.status} />
                          </div>
                          <p className="text-xs text-[#6b7280]">{prescription.dosage} · {prescription.frequency || 'Frequency not recorded'} · Qty: {prescription.quantity || 1}</p>
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div>
                              <span className="text-gray-500">Prescribed:</span>
                              <span className="ml-1 text-gray-700">
                                {new Date(prescription.prescribedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <span className="ml-1 text-gray-700">{prescription.duration}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Refills Left:</span>
                              <span className="ml-1 font-medium text-gray-700">{prescription.refillsLeft || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Prescribed By :</span>
                              <span className="ml-1 text-gray-700">{prescription.prescribedBy || prescription.prescribed_by_name || 'Doctor not recorded'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Batch:</span>
                              <span className="ml-1 text-gray-700">{prescription.visitNumber || prescription.visit_number || 'Visit batch'}</span>
                            </div>
                          </div>
                        </div>
                        <ButtonWithTooltip
                          onClick={() => {}}
                          tooltip="Request refill"
                          variant="primary"
                          size="sm"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Request Refill
                        </ButtonWithTooltip>
                      </div>
                    </div>
                  ))}
                  {prescriptions.length === 0 && (
                    <div className="text-center py-8">
                      <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">No prescriptions found</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bills..."
                      value={localSearchTerm}
                      onChange={(e) => setLocalSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={localFilterBy}
                    onChange={(e) => setLocalFilterBy(e.target.value)}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="all">All Bills</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                  <ButtonWithTooltip
                    onClick={() => setShowPaymentModal(true)}
                    tooltip="Make a payment"
                    variant="success"
                    size="sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    Make Payment
                  </ButtonWithTooltip>
                </div>

                <div className="space-y-3">
                  {paginatedData.map(bill => (
                    <div key={bill.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900">{bill.description}</h4>
                            <StatusBadge status={bill.status} />
                          </div>
                          <p className="text-sm text-gray-600">Bill #{bill.id}</p>
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="ml-1 text-gray-700">
                                {new Date(bill.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Due Date:</span>
                              <span className="ml-1 text-gray-700">
                                {new Date(bill.dueDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Service:</span>
                              <span className="ml-1 text-gray-700">{bill.service}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-gray-900">₦{bill.amount?.toLocaleString() || 0}</p>
                          {bill.status !== 'paid' && (
                            <ButtonWithTooltip
                              onClick={() => {}}
                              tooltip="Pay bill"
                              variant="success"
                              size="sm"
                            >
                              Pay Now
                            </ButtonWithTooltip>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {paginatedData.length === 0 && (
                    <div className="text-center py-8">
                      <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">No bills found</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {paginatedItems.length > itemsPerPage && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Showing {Math.min((currentPage - 1) * itemsPerPage + 1, paginatedItems.length)} to {Math.min(currentPage * itemsPerPage, paginatedItems.length)} of {paginatedItems.length}
                    </div>
                    <div className="flex items-center gap-1">
                      <IconButton
                        icon={ChevronLeft}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        tooltip="Previous page"
                        variant="default"
                        size="sm"
                        disabled={currentPage === 1}
                      />
                      <span className="text-xs text-gray-600 px-2">
                        Page {currentPage} of {Math.ceil(paginatedItems.length / itemsPerPage)}
                      </span>
                      <IconButton
                        icon={ChevronRight}
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(paginatedItems.length / itemsPerPage), p + 1))}
                        tooltip="Next page"
                        variant="default"
                        size="sm"
                        disabled={currentPage === Math.ceil(paginatedItems.length / itemsPerPage)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'telemedicine' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">Telemedicine Sessions</h3>
                  <ButtonWithTooltip
                    onClick={() => setShowTelemedicineModal(true)}
                    tooltip="Book a telemedicine session"
                    variant="primary"
                    size="sm"
                  >
                    <Video className="w-4 h-4" />
                    Book Session
                  </ButtonWithTooltip>
                </div>
                <div className="space-y-3">
                  {telemedicineSessions.map(session => (
                    <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900">{session.specialty} Consultation</h4>
                            <StatusBadge status={session.status} />
                          </div>
                          <p className="text-sm text-gray-600">{session.reason}</p>
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div>
                              <span className="text-gray-500">Date:</span>
                              <span className="ml-1 text-gray-700">
                                {new Date(session.dateTime).toLocaleString('en-NG', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            {session.meetingLink && (
                              <div>
                                <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                  Join Meeting
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                          {session.instructions && (
                            <p className="mt-2 text-sm text-gray-500">{session.instructions}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {telemedicineSessions.length === 0 && (
                    <div className="text-center py-8">
                      <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">No telemedicine sessions booked</p>
                      <p className="text-sm text-gray-500 mt-1">Book your first virtual consultation</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'education' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Health Education Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(healthTopics).map(([key, topic]) => (
                    <div key={key} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <h4 className="font-semibold text-gray-900">{topic.title}</h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{topic.content}</p>
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500">Key Symptoms:</p>
                        <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                          {topic.symptoms?.slice(0, 3).map((symptom, idx) => (
                            <li key={idx}>{symptom}</li>
                          ))}
                          {topic.symptoms?.length > 3 && (
                            <li className="text-gray-400">+{topic.symptoms.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                      <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        Read Full Article
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onSubmit={handleBookAppointment}
        patient={currentPatient}
        departments={['General Medicine', 'Pediatrics', 'Obstetrics', 'Cardiology', 'Dermatology']}
        availableSlots={availableSlots}
        isSubmitting={isSubmitting}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handleMakePayment}
        bills={bills}
        isSubmitting={isSubmitting}
      />

      <TelemedicineModal
        isOpen={showTelemedicineModal}
        onClose={() => setShowTelemedicineModal(false)}
        onSubmit={handleBookTelemedicine}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default PatientPortal;