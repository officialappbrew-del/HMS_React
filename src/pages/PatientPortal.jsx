import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  User, Calendar, FileText, Pill, CreditCard, BookOpen,
  Video, Bell, Search, Plus, CheckCircle, Clock,
  XCircle, Eye, EyeOff, ShieldCheck, Lock, ArrowRight, AlertCircle,
  Building2, Users, Activity, Award, Globe, ChevronLeft, ChevronRight,
  Loader2, UserX, Hospital, Microscope, X, Phone, Mail, Send,
  MapPin, ExternalLink, Receipt, RefreshCw, Home, TrendingUp,
  CalendarDays, Stethoscope, Syringe, HeartPulse, Sparkles,
  MessagesSquare, FileCheck, DollarSign, Shield, Menu, LayoutDashboard,
  ClipboardList, Wallet, VideoIcon, GraduationCap, Settings,
  LogOut, ChevronDown, CircleDot, Activity as ActivityIcon,
  Heart, Brain, Bone, Eye as EyeIcon, Droplets, Thermometer,
} from 'lucide-react';
import {
  cancelAppointment, bookTelemedicineSession,
  markNotificationRead, hydratePortalData,
} from '../features/patientPortalSlice';
import { apiRequest } from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';

// ==================== THEME CONSTANTS ====================
// Light theme – matching PatientManagement
const COLORS = {
  primary: '#2563EB',      // blue-600
  primaryLight: '#3B82F6', // blue-500
  primaryDark: '#1D4ED8',  // blue-700
  secondary: '#64748B',    // slate-500
  success: '#22C55E',     // green-500
  warning: '#EAB308',     // yellow-500
  danger: '#EF4444',      // red-500
  dark: '#0F172A',        // slate-900
  lightBg: '#F8FAFC',     // gray-50
  cardBg: '#FFFFFF',
  border: '#E2E8F0',      // gray-200
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
};

// ==================== REUSABLE COMPONENTS ====================

// Light Card – replaces GlassCard
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

// Stat Card – light theme version
const StatCard = ({ icon: Icon, label, value, trend, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    teal: 'bg-teal-50 text-teal-600 border-teal-200',
    pink: 'bg-pink-50 text-pink-600 border-pink-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };
  return (
    <Card className={`p-4 border-l-4 ${colorMap[color]} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className="mt-0.5 text-xs font-medium text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {trend}</p>}
        </div>
        <div className="p-2 rounded-lg bg-white border border-gray-200">
          <Icon className="w-5 h-5 text-current" />
        </div>
      </div>
    </Card>
  );
};

// Primary Button – matches PatientManagement
const PrimaryButton = ({ children, onClick, loading, disabled, className = '', icon: Icon, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    secondary: 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm hover:shadow focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

// Secondary Button – light theme
const SecondaryButton = ({ children, onClick, disabled, className = '', icon: Icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
);

// Status Badge – light theme
const StatusBadge = ({ status }) => {
  const variants = {
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    completed: 'bg-purple-100 text-purple-800 border-purple-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',
    routine: 'bg-blue-100 text-blue-800 border-blue-200',
    urgent: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    emergency: 'bg-red-100 text-red-800 border-red-200',
  };
  const classes = variants[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {status}
    </span>
  );
};

// IconButton – matches PatientManagement
const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', size = 'sm', className = '', disabled = false }) => {
  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
    primary: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50',
    danger: 'text-red-600 hover:text-red-700 hover:bg-red-50',
    success: 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50',
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
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
      title={tooltip}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
};

// Empty State – light theme
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-12">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
      <Icon className="w-8 h-8" />
    </div>
    <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
    <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// ==================== MODALS ====================
// All modals updated to light theme (similar to PatientManagement modals)

const AppointmentModal = ({ isOpen, onClose, onSubmit, departments, isSubmitting = false }) => {
  const [formData, setFormData] = useState({ department: '', doctor: '', dateTime: '', reason: '', urgency: 'routine' });

  useEffect(() => {
    if (!isOpen) setFormData({ department: '', doctor: '', dateTime: '', reason: '', urgency: 'routine' });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Book Appointment</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Department *</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" required disabled={isSubmitting}>
                <option value="">Select department</option>
                {departments?.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Doctor (Optional)</label>
              <input type="text" name="doctor" value={formData.doctor} onChange={handleChange} placeholder="Dr. Smith" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date & Time *</label>
              <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" required disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Reason *</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} rows="2" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" required disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Urgency</label>
              <select name="urgency" value={formData.urgency} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" disabled={isSubmitting}>
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <PrimaryButton type="submit" loading={isSubmitting} className="flex-1" icon={Calendar}>
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </PrimaryButton>
              <SecondaryButton onClick={onClose} className="flex-1" disabled={isSubmitting}>Cancel</SecondaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose, onSubmit, bills, isSubmitting = false }) => {
  const [formData, setFormData] = useState({ billId: '', paymentMethod: 'card', cardNumber: '', expiryDate: '', cvv: '' });

  useEffect(() => {
    if (!isOpen) setFormData({ billId: '', paymentMethod: 'card', cardNumber: '', expiryDate: '', cvv: '' });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const selectedBill = bills?.find(b => b.id === formData.billId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Make Payment</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Select Bill *</label>
              <select name="billId" value={formData.billId} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white" required disabled={isSubmitting}>
                <option value="">Select bill</option>
                {bills?.filter(b => b.status !== 'paid').map(bill => (
                  <option key={bill.id} value={bill.id}>{bill.description} - ₦{bill.amount?.toLocaleString()}</option>
                ))}
              </select>
              {selectedBill && <p className="mt-1 text-xs text-gray-500">Amount: ₦{selectedBill.amount?.toLocaleString()}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Payment Method</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white" disabled={isSubmitting}>
                <option value="card">Credit / Debit Card</option>
                <option value="bank">Bank Transfer</option>
                <option value="mobile">Mobile Money</option>
              </select>
            </div>
            {formData.paymentMethod === 'card' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Card Number *</label>
                  <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white" required disabled={isSubmitting} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Expiry *</label>
                    <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="MM/YY" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white" required disabled={isSubmitting} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">CVV *</label>
                    <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="123" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white" required disabled={isSubmitting} />
                  </div>
                </div>
              </>
            )}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <PrimaryButton type="submit" loading={isSubmitting} className="flex-1 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500" icon={CreditCard}>
                {isSubmitting ? 'Processing...' : 'Complete Payment'}
              </PrimaryButton>
              <SecondaryButton onClick={onClose} className="flex-1" disabled={isSubmitting}>Cancel</SecondaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const TelemedicineModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({ specialty: '', dateTime: '', reason: '', symptoms: '' });
  const specialties = ['General Medicine', 'Pediatrics', 'Dermatology', 'Mental Health', 'Nutrition', 'Cardiology', 'Neurology'];

  useEffect(() => {
    if (!isOpen) setFormData({ specialty: '', dateTime: '', reason: '', symptoms: '' });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-pink-100 flex items-center justify-center">
                <Video className="w-4 h-4 text-pink-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Book Telemedicine</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Specialty *</label>
              <select name="specialty" value={formData.specialty} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white" required disabled={isSubmitting}>
                <option value="">Select specialty</option>
                {specialties.map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date & Time *</label>
              <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white" required disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Reason *</label>
              <textarea name="reason" value={formData.reason} onChange={handleChange} rows="2" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white" required disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Symptoms</label>
              <textarea name="symptoms" value={formData.symptoms} onChange={handleChange} rows="2" placeholder="Describe your symptoms..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white" disabled={isSubmitting} />
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <PrimaryButton type="submit" loading={isSubmitting} className="flex-1 bg-pink-600 hover:bg-pink-700 focus:ring-pink-500" icon={Video}>
                {isSubmitting ? 'Booking...' : 'Book Session'}
              </PrimaryButton>
              <SecondaryButton onClick={onClose} className="flex-1" disabled={isSubmitting}>Cancel</SecondaryButton>
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
    appointments, medicalRecords, prescriptions, testResults,
    bills, telemedicineSessions, notifications, healthTopics,
  } = useSelector(state => state.patientPortal);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPatient, setCurrentPatient] = useState(null);
  const [tenantDetails, setTenantDetails] = useState(null);
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [portalError, setPortalError] = useState('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTelemedicineModal, setShowTelemedicineModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ identifier: false, password: false });
  const [now, setNow] = useState(() => new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localFilterBy, setLocalFilterBy] = useState('all');
  const [localSortBy, setLocalSortBy] = useState('date');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [tokenSent, setTokenSent] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [changePasswordMessage, setChangePasswordMessage] = useState('');
  const [changePasswordMessageType, setChangePasswordMessageType] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPatientDisplayName = () => currentPatient?.full_name || currentPatient?.name ||
    [currentPatient?.first_name, currentPatient?.last_name].filter(Boolean).join(' ').trim() || 'Patient';

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const storedPatientToken = localStorage.getItem('patientAccessToken');
    if (!storedPatientToken) {
      setCurrentPatient(null);
      setPortalError('');
      return;
    }
    const loadPortalData = async () => {
      setPortalError('');
      try {
        const data = await apiRequest('/api/v1/patients/patients/portal/');
        dispatch(hydratePortalData(data));
        setCurrentPatient(data?.patient || null);
        setTenantDetails(data?.tenant || null);
      } catch (error) {
        if (/token expired|session expired|invalid token|unauthorized/i.test(error.message || '')) {
          localStorage.removeItem('patientAccessToken');
          localStorage.removeItem('patientRefreshToken');
          localStorage.removeItem('isPatientAuthenticated');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('authToken');
          setCurrentPatient(null);
        }
        setPortalError(error.message || 'Unable to load patient portal data.');
      }
    };
    loadPortalData();
  }, [dispatch]);

  const filteredAppointments = appointments
    .filter(apt => {
      const matchesSearch = !localSearchTerm || apt.doctor?.toLowerCase().includes(localSearchTerm.toLowerCase()) || apt.department?.toLowerCase().includes(localSearchTerm.toLowerCase());
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
      const matchesSearch = !localSearchTerm || bill.description?.toLowerCase().includes(localSearchTerm.toLowerCase());
      const matchesFilter = localFilterBy === 'all' || bill.status === localFilterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedItems = activeTab === 'appointments' ? filteredAppointments : filteredBills;
  const paginatedData = paginatedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const unreadNotifications = notifications.filter(n => !n.read);
  const hasPatientSession = Boolean(localStorage.getItem('patientAccessToken'));

  const stats = {
    totalAppointments: appointments.length,
    upcomingAppointments: appointments.filter(a => new Date(a.dateTime) > new Date() && a.status !== 'cancelled').length,
    pendingBills: bills.filter(b => b.status === 'pending' || b.status === 'overdue').length,
    unreadNotifications: unreadNotifications.length,
    activePrescriptions: prescriptions.filter(p => p.status === 'active').length,
    totalTestResults: testResults.length,
  };

  // Group appointments by status for the sidebar
  const appointmentsByStatus = {
    confirmed: appointments.filter(a => a.status === 'confirmed'),
    scheduled: appointments.filter(a => a.status === 'scheduled'),
    pending: appointments.filter(a => a.status === 'pending'),
    completed: appointments.filter(a => a.status === 'completed'),
    cancelled: appointments.filter(a => a.status === 'cancelled'),
  };

  const handlePatientLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setPortalError('');
    try {
      const response = await apiRequest('/api/v1/patients/login/', {
        method: 'POST',
        body: JSON.stringify({ identifier: loginForm.identifier, password: loginForm.password }),
      });
      const accessToken = response?.access_token || response?.accessToken || response?.token;
      if (!accessToken) throw new Error('No access token returned.');
      localStorage.setItem('patientAccessToken', accessToken);
      localStorage.setItem('patientRefreshToken', response?.refresh_token || '');
      localStorage.setItem('isPatientAuthenticated', 'true');
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('authToken', accessToken);
      const portalData = await apiRequest('/api/v1/patients/patients/portal/');
      dispatch(hydratePortalData(portalData));
      setCurrentPatient(portalData?.patient || null);
      setTenantDetails(portalData?.tenant || null);
    } catch (error) {
      setPortalError(error.message || 'Unable to sign in.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setMessage('');
    setMessageType('');
    try {
      const response = await apiRequest('/api/v1/patients/password-reset/', {
        method: 'POST',
        body: JSON.stringify({ identifier: forgotIdentifier.trim() }),
      });
      setMessage(response?.detail || 'If an account exists, a reset email has been sent.');
      setMessageType('success');
      setTokenSent(true);
    } catch (error) {
      setMessage(error.message || 'Failed to initiate password reset.');
      setMessageType('error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setMessage('');
    setMessageType('');
    try {
      const response = await apiRequest('/api/v1/patients/password-reset/verify/', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken.trim() }),
      });
      setMessage(response?.detail || 'Token verified. Set a new password.');
      setMessageType('success');
      setTokenVerified(true);
    } catch (error) {
      setMessage(error.message || 'Invalid or expired token.');
      setMessageType('error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setMessage('');
    setMessageType('');
    try {
      const response = await apiRequest('/api/v1/patients/password-reset/confirm/', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken, new_password: newPassword, confirm_password: confirmPassword }),
      });
      setMessage(response?.detail || 'Password reset successfully.');
      setMessageType('success');
      setTokenSent(false);
      setForgotIdentifier('');
      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');
      setShowForgotPassword(false);
    } catch (error) {
      setMessage(error.message || 'Failed to reset password.');
      setMessageType('error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePasswordLoading(true);
    setChangePasswordMessage('');
    setChangePasswordMessageType('');
    if (newPassword !== confirmPassword) {
      setChangePasswordMessage('Passwords do not match.');
      setChangePasswordMessageType('error');
      setChangePasswordLoading(false);
      return;
    }
    if (newPassword.length < 8) {
      setChangePasswordMessage('Password must be at least 8 characters.');
      setChangePasswordMessageType('error');
      setChangePasswordLoading(false);
      return;
    }
    try {
      const response = await apiRequest('/api/v1/patients/password-change/', {
        method: 'POST',
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword }),
      });
      setChangePasswordMessage('Password changed successfully.');
      setChangePasswordMessageType('success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setChangePasswordMessage(error.message || 'Failed to change password.');
      setChangePasswordMessageType('error');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  const handleBookAppointment = async (formData) => {
    if (!currentPatient) return;
    setIsSubmitting(true);
    try {
      const [scheduledDate, selectedTime] = (formData.dateTime || '').split('T');
      await apiRequest('/api/v1/patients/appointments/', {
        method: 'POST',
        body: JSON.stringify({
          patient: currentPatient.id,
          department: formData.department,
          doctor: formData.doctor,
          appointment_type: 'consultation',
          scheduled_date: scheduledDate,
          scheduled_time: selectedTime ? (selectedTime.length === 5 ? `${selectedTime}:00` : selectedTime) : '',
          reason: formData.reason,
          status: 'scheduled',
          send_reminder: true,
          reminder_channels: ['email'],
        }),
      });
      const portalData = await apiRequest('/api/v1/patients/patients/portal/');
      dispatch(hydratePortalData(portalData));
      setCurrentPatient(portalData?.patient || currentPatient);
      setTenantDetails(portalData?.tenant || tenantDetails);
      setShowAppointmentModal(false);
    } catch (error) {
      setPortalError(error.message || 'Unable to book appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMakePayment = async (formData) => {
    if (!currentPatient) return;
    const selectedBill = bills.find(bill => String(bill.id) === String(formData.billId));
    if (!selectedBill || selectedBill.amount <= 0) return;
    setIsSubmitting(true);
    try {
      await apiRequest('/api/v1/billing/patient-payments/', {
        method: 'POST',
        body: JSON.stringify({
          invoice: selectedBill.id,
          amount: selectedBill.amount,
          payment_method: formData.paymentMethod === 'bank' ? 'transfer' : formData.paymentMethod,
          transaction_reference: formData.transactionReference || '',
        }),
      });
      const portalData = await apiRequest('/api/v1/patients/patients/portal/');
      dispatch(hydratePortalData(portalData));
      setCurrentPatient(portalData?.patient || currentPatient);
      setTenantDetails(portalData?.tenant || tenantDetails);
      setShowPaymentModal(false);
    } catch (error) {
      setPortalError(error.message || 'Unable to process payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookTelemedicine = async (formData) => {
    if (!currentPatient) return;
    setIsSubmitting(true);
    try {
      await dispatch(bookTelemedicineSession({ ...formData, patientId: currentPatient.id, patientName: getPatientDisplayName() }));
      setShowTelemedicineModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    const reason = window.prompt('Please provide a reason for cancellation:');
    if (reason && reason.trim()) dispatch(cancelAppointment({ appointmentId, reason: reason.trim() }));
  };

  const handleMarkNotificationRead = (notificationId) => dispatch(markNotificationRead(notificationId));

  const handleLogout = () => {
    localStorage.removeItem('patientAccessToken');
    localStorage.removeItem('patientRefreshToken');
    localStorage.removeItem('isPatientAuthenticated');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authToken');
    setCurrentPatient(null);
    setTenantDetails(null);
    navigate('/');
  };

  const loginStats = [
    { label: 'Hospitals', value: '500+', icon: Building2 },
    { label: 'Patients', value: '2M+', icon: Users },
    { label: 'Daily encounters', value: '12K+', icon: Activity },
    { label: 'Uptime', value: '99.99%', icon: Clock },
  ];
  const clockLabel = now.toLocaleTimeString('en-GB', { hour12: false });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'records', label: 'Records', icon: ClipboardList },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'billing', label: 'Billing', icon: Wallet },
    { id: 'telemedicine', label: 'Telemedicine', icon: VideoIcon },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // ==================== LOGIN SCREEN ====================
  if (!currentPatient && !hasPatientSession) {
    return (
      <div className="min-h-screen w-full bg-gray-50 font-sans antialiased lg:flex">
        {/* Left decorative panel */}
        <div className="relative flex w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600/10 to-gray-50 px-6 py-8 sm:px-10 sm:py-10 lg:min-h-screen lg:w-[45%] lg:px-12 lg:py-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyNTYzRUIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="inline-flex rounded-lg bg-blue-100 p-2.5">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
              </span>
              <span className="font-serif text-lg font-semibold text-gray-900">
                SmartCare<span className="text-blue-600">HMS</span>
              </span>
            </Link>
            <div className="mt-8 h-12 text-blue-400/50">
              <svg viewBox="0 0 800 48" preserveAspectRatio="none" fill="none" className="w-full h-full">
                <path d="M0,24 L58,24 L74,24 L84,6 L94,42 L104,24 L120,24 L200,24 L258,24 L274,24 L284,6 L294,42 L304,24 L320,24 L400,24 L458,24 L474,24 L484,6 L494,42 L504,24 L520,24 L600,24 L658,24 L674,24 L684,6 L694,42 L704,24 L720,24 L800,24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-blue-600">Patient Portal</p>
            <h1 className="mt-3 max-w-sm font-serif text-[32px] font-semibold leading-[1.15] text-gray-900 sm:text-[38px] lg:text-[42px]">Your health, connected.</h1>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-gray-600">View appointments, access records, manage prescriptions, and stay connected with your care team.</p>
            <dl className="mt-10 hidden grid-cols-2 gap-x-6 gap-y-6 sm:grid lg:mt-12">
              {loginStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="border-l border-gray-200 pl-3">
                    <Icon className="h-4 w-4 text-blue-600" />
                    <dd className="mt-2 font-mono text-xl font-medium text-gray-900">{stat.value}</dd>
                    <dt className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wider text-gray-500">{stat.label}</dt>
                  </div>
                );
              })}
            </dl>
          </div>
          <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-gray-200 pt-5 lg:mt-0">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10.5px] uppercase tracking-wider text-gray-500">
              <span className="inline-flex items-center gap-1.5"><Award className="h-3.5 w-3.5" /> HIPAA-aligned</span>
              <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> NDPR certified</span>
              <span className="hidden items-center gap-1.5 sm:inline-flex"><ShieldCheck className="h-3.5 w-3.5" /> ISO 27001</span>
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wider text-gray-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="motion-safe:animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-600" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" />
              </span>
              {clockLabel}
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12 bg-gray-50">
          <div className="w-full max-w-[400px] motion-safe:animate-fade-in-up">
            <Card className="p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-600">{showForgotPassword ? 'Password recovery' : 'Patient access'}</p>
              <h2 className="mt-1.5 font-serif text-xl font-semibold leading-snug text-gray-900 sm:text-[22px]">
                {showForgotPassword ? tokenVerified ? 'Set new password' : tokenSent ? 'Verify token' : 'Forgot password?' : 'Welcome back'}
              </h2>
              <p className="mt-1.5 text-[13px] leading-snug text-gray-500">
                {showForgotPassword ? tokenVerified ? 'Choose and confirm your new password.' : tokenSent ? 'Enter the reset token sent to your email.' : 'Enter your identifier and we\'ll send a reset token.' : 'Sign in to access your care dashboard.'}
              </p>

              {(portalError || message) && (
                <div className={`mt-4 flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[13px] ${messageType === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                  {messageType === 'success' ? <CheckCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" /> : <AlertCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />}
                  <span>{message || portalError}</span>
                </div>
              )}

              {!showForgotPassword ? (
                <form className="mt-5 space-y-4" onSubmit={handlePatientLogin}>
                  <div>
                    <label htmlFor="identifier" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-500">Patient identifier</label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${isFocused.identifier ? 'text-blue-600' : 'text-gray-400'}`} />
                      <input id="identifier" type="text" required value={loginForm.identifier} onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })} onFocus={() => setIsFocused({ ...isFocused, identifier: true })} onBlur={() => setIsFocused({ ...isFocused, identifier: false })} placeholder="Hospital number or patient ID" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="password" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-500">Password</label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${isFocused.password ? 'text-blue-600' : 'text-gray-400'}`} />
                      <input id="password" type={showPassword ? 'text' : 'password'} required value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} onFocus={() => setIsFocused({ ...isFocused, password: true })} onBlur={() => setIsFocused({ ...isFocused, password: false })} placeholder="Enter your password" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-y-1.5 pt-0.5">
                    <label className="flex cursor-pointer items-center gap-1.5"><input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20" disabled /><span className="text-[13px] text-gray-600">Remember me</span></label>
                    <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</button>
                  </div>
                  <PrimaryButton type="submit" loading={loginLoading} className="w-full" icon={ArrowRight}>
                    {loginLoading ? 'Signing in' : 'Sign in'}
                  </PrimaryButton>
                  <p className="text-center text-[11px] leading-snug text-gray-400">By signing in, you agree to our Terms of Service and Privacy Policy.</p>
                </form>
              ) : showForgotPassword ? (
                tokenVerified ? (
                  <form className="mt-5 space-y-4" onSubmit={handleResetPassword}>
                    {message && (
                      <div className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[13px] ${messageType === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {messageType === 'success' ? <CheckCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" /> : <AlertCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />}
                        <span>{message}</span>
                      </div>
                    )}
                    <div>
                      <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-500">New password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type={showNewPassword ? 'text' : 'password'} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showNewPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-500">Confirm password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                      </div>
                    </div>
                    <PrimaryButton type="submit" loading={loginLoading} className="w-full" icon={Send}>
                      {loginLoading ? 'Resetting...' : 'Reset password'}
                    </PrimaryButton>
                    <button type="button" onClick={() => { setShowForgotPassword(false); setTokenSent(false); setTokenVerified(false); setMessage(''); setMessageType(''); }} className="flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-blue-600 hover:text-blue-700"><ChevronLeft className="h-3.5 w-3.5" /> Back to login</button>
                  </form>
                ) : tokenSent ? (
                  <form className="mt-5 space-y-4" onSubmit={handleVerifyToken}>
                    {message && (
                      <div className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[13px] ${messageType === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {messageType === 'success' ? <CheckCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" /> : <AlertCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />}
                        <span>{message}</span>
                      </div>
                    )}
                    <div>
                      <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-500">Reset token</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type="text" required value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="Enter the reset token" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                      <p className="mt-1 text-[11px] text-gray-400">Check your email for the reset token.</p>
                    </div>
                    <PrimaryButton type="submit" loading={loginLoading} className="w-full" icon={CheckCircle}>
                      {loginLoading ? 'Verifying...' : 'Verify token'}
                    </PrimaryButton>
                    <button type="button" onClick={() => { setTokenSent(false); setMessage(''); setMessageType(''); }} className="flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-blue-600 hover:text-blue-700"><ChevronLeft className="h-3.5 w-3.5" /> Back</button>
                  </form>
                ) : (
                  <form className="mt-5 space-y-4" onSubmit={handleForgotPassword}>
                    {message && (
                      <div className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[13px] ${messageType === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {messageType === 'success' ? <CheckCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" /> : <AlertCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />}
                        <span>{message}</span>
                      </div>
                    )}
                    <div>
                      <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-gray-500">Patient identifier</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type="text" required value={forgotIdentifier} onChange={(e) => setForgotIdentifier(e.target.value)} placeholder="Enter hospital number or email" className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                    </div>
                    <PrimaryButton type="submit" loading={loginLoading} className="w-full" icon={Send}>
                      {loginLoading ? 'Sending...' : 'Send reset token'}
                    </PrimaryButton>
                    <button type="button" onClick={() => setShowForgotPassword(false)} className="flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-blue-600 hover:text-blue-700"><ChevronLeft className="h-3.5 w-3.5" /> Back to login</button>
                  </form>
                )
              ) : null}
            </Card>
            <p className="mt-5 text-center text-[11px] leading-snug text-gray-400">Need help? Contact the front desk <span className="mx-2 hidden sm:inline">&middot;</span> <span className="block sm:inline">&copy; {new Date().getFullYear()} SmartCare HMS</span></p>
          </div>
        </main>
        <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.5s ease-out both; }
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(2.2); opacity: 0; } }
          .animate-pulse { animation: pulse 1.8s ease-out infinite; }
          @media (prefers-reduced-motion: reduce) { .animate-fade-in-up, .animate-pulse { animation: none !important; } }
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
          {portalError && <p className="text-sm text-red-500 mt-2">{portalError}</p>}
        </div>
      </div>
    );
  }

  // ==================== PORTAL DASHBOARD ====================
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 text-gray-900">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex rounded-lg bg-blue-100 p-1.5">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
          </span>
          <span className="font-serif text-lg font-semibold text-gray-900">SmartCare<span className="text-blue-600">HMS</span></span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          <Menu className="w-5 h-5 text-gray-500" />
        </button>
      </header>

      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-[82vw] max-w-[280px] bg-white border-r border-gray-200 transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} h-screen lg:h-auto`}>
          <div className="flex h-full flex-col">
            <div className="p-5 border-b border-gray-200 flex items-center gap-3">
              <span className="inline-flex rounded-lg bg-blue-100 p-2">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </span>
              <span className="font-serif text-lg font-semibold text-gray-900">SmartCare<span className="text-blue-600">HMS</span></span>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {getPatientDisplayName().charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{getPatientDisplayName()}</p>
                  <p className="text-xs text-gray-500 truncate">Patient ID: {currentPatient?.id || 'N/A'}</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setCurrentPage(1); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.id === 'dashboard' && unreadNotifications.length > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-red-100 text-red-600 text-[10px] flex items-center justify-center">{unreadNotifications.length}</span>
                  )}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200">
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content - Two Column Layout */}
        <main className="flex-1 min-w-0 w-full p-4 md:p-6 lg:p-8">
          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            <StatCard icon={Calendar} label="Appointments" value={stats.totalAppointments} color="blue" />
            <StatCard icon={CalendarDays} label="Upcoming" value={stats.upcomingAppointments} color="teal" />
            <StatCard icon={Wallet} label="Pending Bills" value={stats.pendingBills} color="amber" />
            <StatCard icon={Bell} label="Notifications" value={stats.unreadNotifications} color="pink" />
            <StatCard icon={Pill} label="Prescriptions" value={stats.activePrescriptions} color="emerald" />
            <StatCard icon={Microscope} label="Test Results" value={stats.totalTestResults} color="purple" />
          </div>

          {/* Quick Actions */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Plus, label: 'Book Appointment', action: () => setShowAppointmentModal(true), color: 'blue' },
              { icon: Video, label: 'Telemedicine', action: () => setShowTelemedicineModal(true), color: 'pink' },
              { icon: FileText, label: 'View Records', action: () => setActiveTab('records'), color: 'teal' },
              { icon: CreditCard, label: 'Pay Bills', action: () => setShowPaymentModal(true), color: 'emerald' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 bg-white hover:border-${item.color}-500/50 hover:bg-${item.color}-50 transition-all duration-300 group`}
              >
                <div className={`w-11 h-11 rounded-lg bg-${item.color}-100 text-${item.color}-600 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Two Column Content: Main + Sidebar */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.9fr)]">
            {/* Main Content Column - 2/3 width */}
            <div className="min-w-0 xl:col-span-1">
              <Card className="overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex flex-wrap border-b border-gray-200 px-4 overflow-x-auto">
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setCurrentPage(1); }}
                      className={`px-4 py-3 text-sm font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${activeTab === item.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="p-5">
                  {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                        <span className="text-xs text-gray-500">{unreadNotifications.length} unread</span>
                      </div>
                      <div className="space-y-3">
                        {notifications.slice(0, 5).map(notification => (
                          <div key={notification.id} className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${notification.read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.read ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            {!notification.read && (
                              <button onClick={() => handleMarkNotificationRead(notification.id)} className="flex-shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg transition-colors">Mark Read</button>
                            )}
                          </div>
                        ))}
                        {notifications.length === 0 && <EmptyState icon={Bell} title="No notifications" description="You're all caught up. Check back later for updates." />}
                      </div>
                    </div>
                  )}

                  {activeTab === 'appointments' && (
                    <div>
                      <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" placeholder="Search appointments..." value={localSearchTerm} onChange={(e) => setLocalSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                        </div>
                        <select value={localFilterBy} onChange={(e) => setLocalFilterBy(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <option value="all">All Status</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <PrimaryButton onClick={() => setShowAppointmentModal(true)} icon={Plus} className="!py-2 !px-4">New</PrimaryButton>
                      </div>
                      <div className="space-y-3">
                        {paginatedData.map(appointment => (
                          <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-semibold text-gray-900">{appointment.doctor || 'Doctor'}</h4>
                                <StatusBadge status={appointment.status} />
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${appointment.urgency === 'emergency' ? 'bg-red-100 text-red-700' : appointment.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{appointment.urgency}</span>
                              </div>
                              <p className="text-sm text-gray-600">{appointment.department}</p>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                                <span>{new Date(appointment.dateTime).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="hidden sm:inline w-1 h-1 rounded-full bg-gray-300" />
                                <span className="truncate max-w-xs">{appointment.reason}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 mt-3 sm:mt-0">
                              {appointment.status === 'confirmed' && (
                                <IconButton icon={XCircle} onClick={() => handleCancelAppointment(appointment.id)} tooltip="Cancel" variant="danger" size="sm" />
                              )}
                              <IconButton icon={Eye} onClick={() => {}} tooltip="View" variant="primary" size="sm" />
                            </div>
                          </div>
                        ))}
                        {paginatedData.length === 0 && <EmptyState icon={Calendar} title="No appointments found" description={localSearchTerm ? 'Try adjusting your search' : 'Book your first appointment'} action={<PrimaryButton onClick={() => setShowAppointmentModal(true)} icon={Calendar} className="!py-2 !px-4">Book Appointment</PrimaryButton>} />}
                      </div>
                      {paginatedItems.length > itemsPerPage && (
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500">Showing {Math.min((currentPage - 1) * itemsPerPage + 1, paginatedItems.length)} to {Math.min(currentPage * itemsPerPage, paginatedItems.length)} of {paginatedItems.length}</div>
                          <div className="flex items-center gap-1">
                            <IconButton icon={ChevronLeft} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} tooltip="Previous" disabled={currentPage === 1} />
                            <span className="text-xs text-gray-600 px-2">Page {currentPage} of {Math.ceil(paginatedItems.length / itemsPerPage)}</span>
                            <IconButton icon={ChevronRight} onClick={() => setCurrentPage(p => Math.min(Math.ceil(paginatedItems.length / itemsPerPage), p + 1))} tooltip="Next" disabled={currentPage === Math.ceil(paginatedItems.length / itemsPerPage)} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'records' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Records</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2"><Microscope className="w-4 h-4 text-blue-600" /> Laboratory Results</h4>
                          <div className="space-y-2">
                            {testResults.slice(0, 6).map(result => (
                              <div key={result.id} className="p-3 rounded-lg border border-gray-200 bg-white">
                                <div className="flex items-start justify-between gap-2">
                                  <div><p className="font-medium text-sm text-gray-900">{result.title || result.testName || 'Lab Test'}</p><p className="text-sm text-gray-600">{result.result || result.status || 'Pending review'}</p></div>
                                  <StatusBadge status={result.status || 'ordered'} />
                                </div>
                                <div className="mt-1.5 text-xs text-gray-400">{result.date ? new Date(result.date).toLocaleDateString() : 'Pending'}</div>
                              </div>
                            ))}
                            {testResults.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No laboratory results available</p>}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-teal-600" /> Documents & Reports</h4>
                          <div className="space-y-2">
                            {medicalRecords.slice(0, 6).map(doc => (
                              <div key={doc.id} className="p-3 rounded-lg border border-gray-200 bg-white flex items-center justify-between">
                                <div><p className="font-medium text-sm text-gray-900">{doc.title || doc.fileName || 'Document'}</p><p className="text-sm text-gray-600">{doc.type || 'Document'}</p></div>
                                <IconButton icon={Eye} onClick={() => {}} tooltip="View" variant="primary" size="sm" />
                              </div>
                            ))}
                            {medicalRecords.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No documents available</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'prescriptions' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescriptions</h3>
                      <div className="space-y-3">
                        {[...prescriptions].sort((a, b) => new Date(b.prescribedAt || 0) - new Date(a.prescribedAt || 0)).map(p => (
                          <div key={p.id} className="p-4 rounded-lg border border-gray-200 bg-white">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap"><h4 className="font-semibold text-gray-900">{p.medication}</h4><StatusBadge status={p.status} /></div>
                                <p className="text-sm text-gray-600">{p.dosage} · {p.frequency || 'Frequency not recorded'} · Qty: {p.quantity || 1}</p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600"><span>Prescribed: {new Date(p.prescribedAt).toLocaleDateString()}</span><span>Duration: {p.duration}</span><span>Refills: {p.refillsLeft || 0}</span></div>
                              </div>
                              {p.refillsAvailable && <SecondaryButton icon={RefreshCw} className="!py-1.5 !px-3 !text-xs">Request Refill</SecondaryButton>}
                            </div>
                          </div>
                        ))}
                        {prescriptions.length === 0 && <EmptyState icon={Pill} title="No prescriptions" description="No active prescriptions at this time." />}
                      </div>
                    </div>
                  )}

                  {activeTab === 'billing' && (
                    <div>
                      <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="text" placeholder="Search bills..." value={localSearchTerm} onChange={(e) => setLocalSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all" />
                        </div>
                        <select value={localFilterBy} onChange={(e) => setLocalFilterBy(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all">
                          <option value="all">All Bills</option>
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                        </select>
                        <PrimaryButton onClick={() => setShowPaymentModal(true)} icon={CreditCard} className="!py-2 !px-4 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500">Pay</PrimaryButton>
                      </div>
                      <div className="space-y-3">
                        {paginatedData.map(bill => (
                          <div key={bill.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-gray-200 bg-white">
                            <div><div className="flex items-center gap-2"><h4 className="font-semibold text-gray-900">{bill.description}</h4><StatusBadge status={bill.status} /></div><p className="text-sm text-gray-600">Bill #{bill.id}</p><div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600"><span>Date: {new Date(bill.date).toLocaleDateString()}</span><span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span><span>{bill.service}</span></div></div>
                            <div className="flex items-center gap-3 mt-3 sm:mt-0"><p className="text-lg font-bold text-gray-900">₦{bill.amount?.toLocaleString()}</p>{bill.status !== 'paid' && <SecondaryButton onClick={() => setShowPaymentModal(true)} icon={CreditCard} className="!py-1.5 !px-3 !text-xs">Pay</SecondaryButton>}</div>
                          </div>
                        ))}
                        {paginatedData.length === 0 && <EmptyState icon={Receipt} title="No bills found" description={localSearchTerm ? 'Try adjusting your search' : 'No outstanding bills at this time.'} />}
                      </div>
                      {paginatedItems.length > itemsPerPage && (
                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500">Showing {Math.min((currentPage - 1) * itemsPerPage + 1, paginatedItems.length)} to {Math.min(currentPage * itemsPerPage, paginatedItems.length)} of {paginatedItems.length}</div>
                          <div className="flex items-center gap-1">
                            <IconButton icon={ChevronLeft} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} tooltip="Previous" disabled={currentPage === 1} />
                            <span className="text-xs text-gray-600 px-2">Page {currentPage} of {Math.ceil(paginatedItems.length / itemsPerPage)}</span>
                            <IconButton icon={ChevronRight} onClick={() => setCurrentPage(p => Math.min(Math.ceil(paginatedItems.length / itemsPerPage), p + 1))} tooltip="Next" disabled={currentPage === Math.ceil(paginatedItems.length / itemsPerPage)} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'telemedicine' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Telemedicine Sessions</h3>
                        <PrimaryButton onClick={() => setShowTelemedicineModal(true)} icon={Video} className="!py-2 !px-4 bg-pink-600 hover:bg-pink-700 focus:ring-pink-500">Book Session</PrimaryButton>
                      </div>
                      <div className="space-y-3">
                        {telemedicineSessions.map(session => (
                          <div key={session.id} className="p-4 rounded-lg border border-gray-200 bg-white">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div><div className="flex items-center gap-2"><h4 className="font-semibold text-gray-900">{session.specialty} Consultation</h4><StatusBadge status={session.status} /></div><p className="text-sm text-gray-600">{session.reason}</p><div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600"><span>{new Date(session.dateTime).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div></div>
                              {session.meetingLink && <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-pink-600 hover:text-pink-700"><Video className="w-4 h-4" /> Join <ExternalLink className="w-3 h-3" /></a>}
                            </div>
                          </div>
                        ))}
                        {telemedicineSessions.length === 0 && <EmptyState icon={Video} title="No sessions booked" description="Book your first virtual consultation" action={<PrimaryButton onClick={() => setShowTelemedicineModal(true)} icon={Video} className="!py-2 !px-4 bg-pink-600 hover:bg-pink-700 focus:ring-pink-500">Book Session</PrimaryButton>} />}
                      </div>
                    </div>
                  )}

                  {activeTab === 'education' && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Education</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(healthTopics).map(([key, topic]) => (
                          <div key={key} className="p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-300 transition-all">
                            <h4 className="font-semibold text-gray-900">{topic.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{topic.content}</p>
                            <div className="mt-3"><p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Key symptoms</p><ul className="mt-1 text-sm text-gray-600 list-disc list-inside">{topic.symptoms?.slice(0, 3).map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                            <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">Read more <ArrowRight className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="max-w-2xl">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                      <Card className="p-6">
                        <h4 className="text-sm font-medium text-gray-600 mb-4">Change Password</h4>
                        {changePasswordMessage && (
                          <div className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[13px] mb-4 ${changePasswordMessageType === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                            {changePasswordMessageType === 'success' ? <CheckCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" /> : <AlertCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />}
                            <span>{changePasswordMessage}</span>
                          </div>
                        )}
                        <form onSubmit={handleChangePassword} className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Current Password</label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input type={showOldPassword ? 'text' : 'password'} required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter current password" className="w-full px-3 py-2 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" />
                              <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showOldPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">New Password</label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input type={showNewPassword ? 'text' : 'password'} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full px-3 py-2 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" />
                              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showNewPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Confirm Password</label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <input type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full px-3 py-2 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" />
                              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                            </div>
                          </div>
                          <PrimaryButton type="submit" loading={changePasswordLoading} className="w-full" icon={CheckCircle}>
                            {changePasswordLoading ? 'Updating...' : 'Update Password'}
                          </PrimaryButton>
                        </form>
                      </Card>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Sidebar - Appointments by Status - 1/3 width */}
            <div className="min-w-0 space-y-6">
              {/* Appointments Summary Card */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Appointments
                  </h3>
                  <span className="text-xs text-gray-500">{appointments.length} total</span>
                </div>
                
                {/* Status Breakdown */}
                <div className="space-y-3">
                  {Object.entries(appointmentsByStatus).map(([status, items]) => {
                    const statusColors = {
                      confirmed: 'border-green-200 bg-green-50 text-green-700',
                      scheduled: 'border-blue-200 bg-blue-50 text-blue-700',
                      pending: 'border-yellow-200 bg-yellow-50 text-yellow-700',
                      completed: 'border-purple-200 bg-purple-50 text-purple-700',
                      cancelled: 'border-red-200 bg-red-50 text-red-700',
                    };
                    const dotColors = {
                      confirmed: 'bg-green-500',
                      scheduled: 'bg-blue-500',
                      pending: 'bg-yellow-500',
                      completed: 'bg-purple-500',
                      cancelled: 'bg-red-500',
                    };
                    return (
                      <div key={status} className={`p-3 rounded-lg border ${statusColors[status] || 'border-gray-200 bg-gray-50 text-gray-700'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${dotColors[status] || 'bg-gray-400'}`} />
                            <span className="text-sm font-medium capitalize">{status}</span>
                          </div>
                          <span className="text-sm font-bold">{items.length}</span>
                        </div>
                        {items.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {items.slice(0, 3).map(appt => (
                              <div key={appt.id} className="text-xs text-gray-600 flex items-center justify-between">
                                <span className="truncate max-w-[120px]">{appt.doctor || 'Doctor'}</span>
                                <span>{new Date(appt.dateTime).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            ))}
                            {items.length > 3 && (
                              <div className="text-xs text-gray-400 text-center pt-1 border-t border-gray-200">
                                +{items.length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Quick Action */}
                <button 
                  onClick={() => setActiveTab('appointments')}
                  className="w-full mt-4 text-center text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                  View All Appointments <ArrowRight className="w-3 h-3" />
                </button>
              </Card>

              {/* Upcoming Appointments Quick View */}
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Upcoming
                </h3>
                <div className="space-y-2">
                  {appointments
                    .filter(a => new Date(a.dateTime) > new Date() && a.status !== 'cancelled')
                    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
                    .slice(0, 5)
                    .map(appt => (
                      <div key={appt.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                        <div>
                          <p className="font-medium text-gray-900 text-xs">{appt.doctor || 'Doctor'}</p>
                          <p className="text-[10px] text-gray-500">{new Date(appt.dateTime).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <StatusBadge status={appt.status} />
                      </div>
                    ))}
                  {appointments.filter(a => new Date(a.dateTime) > new Date() && a.status !== 'cancelled').length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">No upcoming appointments</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AppointmentModal isOpen={showAppointmentModal} onClose={() => setShowAppointmentModal(false)} onSubmit={handleBookAppointment} departments={['General Medicine', 'Pediatrics', 'Obstetrics', 'Cardiology', 'Dermatology', 'Orthopedics', 'Neurology']} isSubmitting={isSubmitting} />
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSubmit={handleMakePayment} bills={bills} isSubmitting={isSubmitting} />
      <TelemedicineModal isOpen={showTelemedicineModal} onClose={() => setShowTelemedicineModal(false)} onSubmit={handleBookTelemedicine} isSubmitting={isSubmitting} />
    </div>
  );
};

export default PatientPortal;