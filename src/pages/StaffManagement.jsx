import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import {
  addStaff,
  updateStaff,
  deleteStaff,
  archiveStaff,
  searchStaff,
  sortStaff,
  filterStaff,
  setStaffList,
  setLoading,
} from '../features/staffSlice.jsx';
import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";
import { apiRequest } from '../utils/api';
import {
  UserPlus,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Edit2,
  Archive,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Users,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Building2,
  Download,
  Printer,
  ChevronDown,
  Plus,
  X,
  Save,
  AlertCircle,
  Clipboard,
  Loader2,
  Eye,
  EyeOff,
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  Menu,
  RotateCcw
} from 'lucide-react';

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

// Staff Modal - Styled to match Patient Modal
const StaffModal = ({ 
  isOpen, 
  onClose, 
  staff, 
  mode = 'view',
  onSave,
  isSubmitting = false,
  formError,
  roles,
  departmentOptions,
  generatePasswordSuggestion,
}) => {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    if (staff && mode === 'edit') {
      setFormData({
        name: staff.name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.roleValue || '',
        departmentId: staff.departmentId || '',
        department: staff.department || '',
        hireDate: staff.hireDate || '',
        designation: staff.designation || '',
        salary: staff.salary || '',
        password: '',
      });
    } else if (mode === 'add') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        departmentId: '',
        department: '',
        hireDate: '',
        designation: '',
        salary: '',
        password: '',
      });
    }
  }, [staff, mode]);

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
    if (onSave) onSave(formData);
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      doctor: 'bg-blue-100 text-blue-800 border-blue-200',
      nurse: 'bg-green-100 text-green-800 border-green-200',
      pharmacist: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      lab_tech: 'bg-amber-100 text-amber-800 border-amber-200',
      receptionist: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      hr_manager: 'bg-pink-100 text-pink-800 border-pink-200',
      accountant: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderPersonalInfo = () => {
    if (mode === 'view') {
      return (
        <>
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getRoleBadge(staff?.roleValue)}`}>
              {staff?.role}
            </span>
            {staff?.department && (
              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                <Building2 className="w-3 h-3 mr-0.5" />
                {staff.department}
              </span>
            )}
            {staff?.status === 'active' ? (
              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                <CheckCircle className="w-3 h-3 mr-0.5" />
                Active
              </span>
            ) : (
              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                <XCircle className="w-3 h-3 mr-0.5" />
                Inactive
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 rounded p-2 col-span-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Employee ID</p>
              <p className="font-medium text-gray-900">{staff?.employeeId || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2 col-span-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Full Name</p>
              <p className="font-medium text-gray-900">{staff?.name || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2 col-span-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Email</p>
              <p className="font-medium text-gray-900">{staff?.email || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2 col-span-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Phone</p>
              <p className="font-medium text-gray-900">{staff?.phone || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2 col-span-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Designation</p>
              <p className="font-medium text-gray-900">{staff?.designation || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Hire Date</p>
              <p className="font-medium text-gray-900">{staff?.hireDate || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="text-[10px] text-gray-500 uppercase font-medium">Last Login</p>
              <p className="font-medium text-gray-900">{staff?.lastLogin || 'Never'}</p>
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
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Email *</label>
          <div className="relative">
            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-8 pr-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="staff@hospital.com"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Phone</label>
          <div className="relative">
            <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-8 pr-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+234 800 000 0000"
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            required
            disabled={isSubmitting}
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Department</label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            disabled={isSubmitting}
          >
            <option value="">Select Department</option>
            {departmentOptions.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Senior Consultant"
            className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Password {mode === 'add' && '*'}</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-2.5 py-1.5 pr-8 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={mode === 'add'}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                const suggestion = generatePasswordSuggestion();
                setFormData(prev => ({ ...prev, password: suggestion }));
              }}
              className="px-2.5 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Suggest
            </button>
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Hire Date</label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="date"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              className="w-full pl-8 pr-2.5 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>
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
                {mode === 'view' ? 'Staff Details' : mode === 'edit' ? 'Edit Staff' : 'Add Staff'}
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
              {['personal', 'employment'].map((tab) => (
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
                {activeTab === 'employment' && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Role</p>
                      <p className="font-medium text-gray-900">{staff?.role || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Department</p>
                      <p className="font-medium text-gray-900">{staff?.department || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Designation</p>
                      <p className="font-medium text-gray-900">{staff?.designation || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Hire Date</p>
                      <p className="font-medium text-gray-900">{staff?.hireDate || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Status</p>
                      <p className="font-medium text-gray-900 capitalize">{staff?.status || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 col-span-2">
                      <p className="text-[10px] text-gray-500 uppercase font-medium">Last Login</p>
                      <p className="font-medium text-gray-900">{staff?.lastLogin || 'Never'}</p>
                    </div>
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

                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {mode === 'edit' ? 'Update' : 'Add'} Staff
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

// Delete Confirmation Modal
const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  staff,
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
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Delete Staff?</h3>
                <p className="text-xs text-gray-500">This action is irreversible and will permanently delete the staff record.</p>
              </div>
            </div>

            {staff && (
              <div className="bg-gray-50 rounded-lg p-2.5 mb-3 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{staff.name}</p>
                    <p className="text-xs text-gray-500 truncate">{staff.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-700">
                  This will permanently delete the staff member and all associated data.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 py-1.5 px-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
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

// Archive Confirmation Modal
const ArchiveConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  staff,
  isArchiving = false,
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
                <h3 className="text-sm font-bold text-gray-900">Archive Staff?</h3>
                <p className="text-xs text-gray-500">This will mark the staff member as inactive.</p>
              </div>
            </div>

            {staff && (
              <div className="bg-gray-50 rounded-lg p-2.5 mb-3 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{staff.name}</p>
                    <p className="text-xs text-gray-500 truncate">{staff.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                <p className="text-xs text-yellow-700">
                  The staff record will be marked as inactive and hidden from active lists.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                disabled={isArchiving}
                className="flex-1 py-1.5 px-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs"
              >
                {isArchiving ? (
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
                disabled={isArchiving}
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

// Restore Confirmation Modal
const RestoreConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  staff,
  isRestoring = false,
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
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Restore Staff?</h3>
                <p className="text-xs text-gray-500">This will reactivate the staff member.</p>
              </div>
            </div>

            {staff && (
              <div className="bg-gray-50 rounded-lg p-2.5 mb-3 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{staff.name}</p>
                    <p className="text-xs text-gray-500 truncate">{staff.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <p className="text-xs text-green-700">
                  The staff record will be marked as active and restored to the active staff list.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                disabled={isRestoring}
                className="flex-1 py-1.5 px-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 text-xs"
              >
                {isRestoring ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isRestoring}
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

// Main StaffManagement Component
const StaffManagement = () => {
  const dispatch = useDispatch();
  const { filteredStaff, searchTerm, sortBy, filterBy } = useSelector(
    state => state.staff
  );

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [staffToArchive, setStaffToArchive] = useState(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [staffToRestore, setStaffToRestore] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [formError, setFormError] = useState(null);
  const itemsPerPage = 10;
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const currentUserIsRootAdmin = typeof window !== 'undefined' ? localStorage.getItem('userIsRootAdmin') === 'true' : false;
  
  // Bulk upload state
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(null);
  const [bulkUploadResult, setBulkUploadResult] = useState(null);
  const [bulkUploadError, setBulkUploadError] = useState(null);
  
  // Credentials modal state
  const [credentialsModal, setCredentialsModal] = useState({
    isOpen: false,
    employeeId: '',
    email: '',
    password: '',
    welcomeEmailStatus: 'not_queued',
    showPassword: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    departmentId: '',
    department: '',
    hireDate: '',
    designation: '',
    salary: '',
    password: '',
  });

  const generatePasswordSuggestion = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'pharmacist', label: 'Pharmacist' },
    { value: 'lab_tech', label: 'Lab Technician' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'hr_manager', label: 'HR Manager' },
    { value: 'accountant', label: 'Accountant' },
  ];

  const dedupeStaffById = (staffList = []) => {
    const seen = new Set();
    return staffList.filter((member) => {
      const key = member?.id ?? member?.email ?? member?.employeeId;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const normalizeRole = (role = '') => {
    const normalized = String(role).toLowerCase();
    if (normalized.includes('admin') || normalized === 'administrator') return 'admin';
    if (normalized.includes('doctor') || normalized.includes('surgeon') || normalized.includes('chief medical')) return 'doctor';
    if (normalized.includes('nurse') || normalized.includes('registered nurse')) return 'nurse';
    if (normalized.includes('pharmacist')) return 'pharmacist';
    if (normalized.includes('lab')) return 'lab_tech';
    if (normalized.includes('reception')) return 'receptionist';
    if (normalized.includes('hr')) return 'hr_manager';
    if (normalized.includes('account')) return 'accountant';
    return normalized || 'admin';
  };

  const formatRoleLabel = (role = '') => {
    const match = roles.find(item => item.value === normalizeRole(role));
    return match ? match.label : String(role || 'Staff');
  };

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString().split('T')[0];
  };

  const normalizeStaff = (member) => ({
    id: member.id,
    employeeId: member.employee_id || '',
    name: member.full_name || `${member.first_name || ''} ${member.last_name || ''}`.trim(),
    email: member.email || '',
    phone: member.phone || '',
    role: formatRoleLabel(member.role),
    roleValue: normalizeRole(member.role),
    department: member.department_name || member.department || '',
    departmentId: member.department || '',
    hireDate: formatDate(member.employment_date || member.created_at || ''),
    designation: member.designation || '',
    status: member.employment_status || (member.is_active === false ? 'inactive' : 'active'),
    lastLogin: member.last_login || '',
    isRootAdmin: Boolean(member.is_root_admin),
  });

  const loadStaff = async () => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));

      const allUsers = [];
      let nextUrl = '/api/v1/tenants/users/?page_size=200';
      let page = 1;

      while (nextUrl) {
        const data = await apiRequest(nextUrl);
        if (Array.isArray(data)) {
          allUsers.push(...data);
          nextUrl = null;
        } else {
          allUsers.push(...(data.results || []));
          if (data.next) {
            page += 1;
            try {
              const url = new URL(data.next);
              nextUrl = url.pathname + url.search;
            } catch {
              nextUrl = data.next.startsWith('/') ? data.next : `${'/api/v1/tenants/users/'}?page=${page}&page_size=200`;
            }
          } else {
            nextUrl = null;
          }
        }
        if (page > 100) nextUrl = null;
      }

      const filteredResults = allUsers.filter((user) => {
        if (!user.is_root_admin) return true;
        return currentUserIsRootAdmin && String(user.id) === String(currentUserId);
      });
      const count = filteredResults.length;
      const normalizedUsers = dedupeStaffById(filteredResults.map(normalizeStaff));
      dispatch(setStaffList(normalizedUsers));
      setTotalCount(count);
    } catch (error) {
      console.error('Failed to load staff users:', error);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await apiRequest('/api/v1/tenants/departments/');
        const departments = Array.isArray(data) ? data : (data.results || []);
        setDepartmentOptions(departments);
      } catch (error) {
        console.error('Failed to load departments:', error);
      }
    };

    loadDepartments();
    loadStaff();
  }, [dispatch]);

  const handleSearch = (e) => dispatch(searchStaff(e.target.value));
  const handleSort = (e) => dispatch(sortStaff(e.target.value));
  const handleFilter = (e) => dispatch(filterStaff(e.target.value));

  const handleDeleteClick = (staff) => {
    setStaffToDelete(staff);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!staffToDelete) return;
    setIsLoading(true);
    try {
      await apiRequest(`/api/v1/tenants/users/${staffToDelete.id}/`, {
        method: 'DELETE',
      });
      await loadStaff();
      setShowDeleteModal(false);
      setStaffToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
      alert(error.message || 'Unable to delete staff');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveClick = (staff) => {
    setStaffToArchive(staff);
    setShowArchiveModal(true);
  };

  const confirmArchive = async () => {
    if (!staffToArchive) return;
    setIsLoading(true);
    try {
      await apiRequest(`/api/v1/tenants/users/${staffToArchive.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          employment_status: 'inactive',
          is_active: false,
        }),
      });
      await loadStaff();
      setShowArchiveModal(false);
      setStaffToArchive(null);
    } catch (error) {
      console.error('Archive failed:', error);
      alert(error.message || 'Unable to archive staff');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreClick = (staff) => {
    setStaffToRestore(staff);
    setShowRestoreModal(true);
  };

  const confirmRestore = async () => {
    if (!staffToRestore) return;
    setIsLoading(true);
    try {
      await apiRequest(`/api/v1/tenants/users/${staffToRestore.id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          employment_status: 'active',
          is_active: true,
        }),
      });
      await loadStaff();
      setShowRestoreModal(false);
      setStaffToRestore(null);
    } catch (error) {
      console.error('Restore failed:', error);
      alert(error.message || 'Unable to restore staff');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (staff) => {
    if (staff.isRootAdmin && !currentUserIsRootAdmin) {
      alert('Only the root admin can view or edit this user.');
      return;
    }
    setSelectedStaff(staff);
    setFormError(null);
    setModalMode('edit');
    setShowStaffModal(true);
  };

  const handleViewClick = (staff) => {
    if (staff.isRootAdmin && !currentUserIsRootAdmin) {
      alert('Only the root admin can view this user.');
      return;
    }
    setSelectedStaff(staff);
    setModalMode('view');
    setShowStaffModal(true);
  };

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setFormError(null);
    setModalMode('add');
    setShowStaffModal(true);
  };

  const buildCreatePayload = (formData) => {
    const parts = formData.name.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : firstName;

    return {
      first_name: firstName,
      last_name: lastName || firstName,
      email: formData.email,
      phone: formData.phone || '',
      role: normalizeRole(formData.role),
      department: formData.departmentId ? Number(formData.departmentId) : undefined,
      designation: formData.designation || '',
      employment_date: formData.hireDate || undefined,
      password: formData.password || 'TempPass123!',
      is_staff: true,
      employment_status: 'active',
    };
  };

  const buildUpdatePayload = (formData, originalStaff) => {
    if (!originalStaff) return {};

    const parts = formData.name.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : firstName;

    const patch = {};

    if (firstName !== (originalStaff.name?.split(/\s+/)[0] || '')) {
      patch.first_name = firstName;
    }
    if (lastName !== (originalStaff.name?.split(/\s+/).slice(1).join(' ') || '')) {
      patch.last_name = lastName || firstName;
    }
    if (formData.email !== (originalStaff.email || '')) {
      patch.email = formData.email;
    }
    if (formData.phone !== (originalStaff.phone || '')) {
      patch.phone = formData.phone;
    }
    if (normalizeRole(formData.role) !== (originalStaff.roleValue || '')) {
      patch.role = normalizeRole(formData.role);
    }
    if (formData.departmentId && Number(formData.departmentId) !== originalStaff.departmentId) {
      patch.department = Number(formData.departmentId);
    }
    if (formData.designation !== (originalStaff.designation || '')) {
      patch.designation = formData.designation;
    }
    if (formData.hireDate !== (originalStaff.hireDate || '')) {
      patch.employment_date = formData.hireDate;
    }
    if (formData.password) {
      patch.password = formData.password;
    }

    return patch;
  };

  const cleanPayload = (payload) => {
    const cleaned = {};
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  const handleSaveStaff = async (formData) => {
    setFormError(null);
    setIsSubmitting(true);

    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      setFormError('Name, Email, and Role are required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      if (modalMode === 'edit' && selectedStaff) {
        const patchPayload = cleanPayload(buildUpdatePayload(formData, selectedStaff));
        if (Object.keys(patchPayload).length === 0) {
          setFormError('No changes detected');
          setIsSubmitting(false);
          return;
        }
        const updated = await apiRequest(`/api/v1/tenants/users/${selectedStaff.id}/`, {
          method: 'PATCH',
          body: JSON.stringify(patchPayload),
        });
        dispatch(updateStaff(normalizeStaff(updated)));
      } else {
        const createPayload = cleanPayload(buildCreatePayload(formData));
        const created = await apiRequest('/api/v1/tenants/users/', {
          method: 'POST',
          body: JSON.stringify(createPayload),
        });
        dispatch(addStaff(normalizeStaff(created)));
        setCredentialsModal({
          isOpen: true,
          employeeId: created.employee_id || `STAFF-${created.id}`,
          email: created.email,
          password: createPayload.password,
          welcomeEmailStatus: created.welcome_email_status || 'not_queued',
          showPassword: false,
        });
      }

      setShowStaffModal(false);
      await loadStaff();
    } catch (error) {
      console.error('Failed to save staff:', error);
      const errorDetails = error.details || error;
      const hasPasswordError = errorDetails?.password;
      
      if (hasPasswordError) {
        const suggestion = generatePasswordSuggestion();
        setFormData(prev => ({ ...prev, password: suggestion }));
        setFormError(`Password Error: ${Array.isArray(errorDetails.password) ? errorDetails.password.join(', ') : errorDetails.password || error.message}`);
      } else {
        setFormError(error.message || 'Unable to save staff user');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkUpload = async (file) => {
    setBulkUploadResult(null);
    setBulkUploadError(null);
    setBulkUploading(true);
    setBulkUploadProgress({
      status: 'processing',
      message: 'Uploading CSV and starting processing...',
    });

    try {
      const tenantId = localStorage.getItem('tenantId');
      const formData = new FormData();
      formData.append('file', file);

      const result = await apiRequest('/api/v1/tenants/bulk-uploads/upload/', {
        method: 'POST',
        headers: {
          ...(tenantId && { 'X-Tenant-ID': tenantId }),
        },
        body: formData,
      });
      setBulkUploadResult(result);

      const uploadId = result?.id || result?.pk;

      if (uploadId) {
        const pollUploadStatus = async (id, maxAttempts = 60, intervalMs = 1500) => {
          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
              const detail = await apiRequest(`/api/v1/tenants/bulk-uploads/${id}/`);
              setBulkUploadResult(detail);

              if (detail?.status === 'completed' || detail?.status === 'failed') {
                return detail;
              }

              const processed = detail?.processed_records || 0;
              const total = detail?.total_records || '?';
              setBulkUploadProgress({
                status: 'processing',
                message: `Processing... ${processed}/${total} records processed`,
              });
            } catch (pollErr) {
              console.error('Bulk upload poll error:', pollErr);
            }

            await new Promise((r) => setTimeout(r, intervalMs));
          }

          throw new Error('Bulk upload timed out. Please check the upload history.');
        };

        const finalResult = await pollUploadStatus(uploadId);

        if (finalResult.status === 'completed') {
          const msg = finalResult.result_message ||
            `Processed ${finalResult.total_records} records. ${finalResult.success_count} succeeded, ${finalResult.failure_count} failed.`;
          setBulkUploadProgress({ status: 'completed', message: msg });
          await loadStaff();
        } else {
          setBulkUploadProgress({
            status: 'failed',
            message: finalResult.result_message || 'Bulk upload processing failed.',
          });
          setBulkUploadError(finalResult.result_message || 'Bulk upload processing failed.');
        }
      } else {
        setBulkUploadProgress({
          status: 'completed',
          message: result?.message || 'Bulk upload completed successfully.',
        });
        await loadStaff();
      }

      setBulkUploading(false);
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
    setBulkUploadProgress(null);
    setBulkUploadResult(null);
    setBulkUploadError(null);
  };

  const uniqueFilteredStaff = dedupeStaffById(filteredStaff);
  const totalItems = uniqueFilteredStaff.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedStaff = uniqueFilteredStaff.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusDotColor = (status) => {
    return status === 'active' ? 'bg-green-500' : 'bg-gray-500';
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      doctor: 'bg-blue-100 text-blue-800 border-blue-200',
      nurse: 'bg-green-100 text-green-800 border-green-200',
      pharmacist: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      lab_tech: 'bg-amber-100 text-amber-800 border-amber-200',
      receptionist: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      hr_manager: 'bg-pink-100 text-pink-800 border-pink-200',
      accountant: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Stats
  const activeCount = uniqueFilteredStaff.filter(s => s.status === 'active').length;
  const inactiveCount = uniqueFilteredStaff.filter(s => s.status === 'inactive').length;

  const stats = {
    total: totalCount,
    active: activeCount,
    inactive: inactiveCount,
    departments: departmentOptions.length,
    roles: roles.length,
  };

  // Stats Card Component
  const StatsCard = ({ icon: Icon, iconBg, iconColor, label, value, onClick, active = false }) => (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg border p-3 hover:shadow-md transition-all cursor-pointer ${
        active ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase truncate">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
    </div>
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <LoadingSpinner overlay text="Loading staff..." />
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Staff Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your healthcare workforce efficiently
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => setShowBulkUploadModal(true)}
              tooltip="Bulk upload staff via CSV"
              variant="secondary"
              size="sm"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk Upload</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={handleAddStaff}
              tooltip="Add new staff member"
              variant="primary"
              size="sm"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Staff</span>
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatsCard
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            label="Total Staff"
            value={stats.total}
            onClick={() => {
              dispatch(filterStaff('all'));
              setCurrentPage(1);
            }}
            active={filterBy === 'all'}
          />
          <StatsCard
            icon={CheckCircle}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            label="Active"
            value={stats.active}
            onClick={() => {
              dispatch(filterStaff('active'));
              setCurrentPage(1);
            }}
            active={filterBy === 'active'}
          />
          <StatsCard
            icon={XCircle}
            iconBg="bg-gray-50"
            iconColor="text-gray-600"
            label="Inactive"
            value={stats.inactive}
            onClick={() => {
              dispatch(filterStaff('inactive'));
              setCurrentPage(1);
            }}
            active={filterBy === 'inactive'}
          />
          <StatsCard
            icon={Building2}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            label="Departments"
            value={stats.departments}
          />
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-9 pr-9 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={sortBy}
                  onChange={handleSort}
                  className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="role">Sort by Role</option>
                  <option value="department">Sort by Dept</option>
                  <option value="hireDate">Sort by Date</option>
                </select>
                <select
                  value={filterBy}
                  onChange={handleFilter}
                  className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Staff</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {uniqueFilteredStaff.length} records
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="p-3">
            {displayedStaff.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No staff members found</p>
                <p className="text-sm text-gray-500 mt-1">
                  {searchTerm ? 'Try adjusting your search' : 'Start by adding your first staff member'}
                </p>
                {!searchTerm && (
                  <ButtonWithTooltip
                    onClick={handleAddStaff}
                    tooltip="Add new staff member"
                    variant="primary"
                    className="mt-3"
                    size="sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Staff
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
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Department</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {displayedStaff.filter((staff) => !staff.isRootAdmin || currentUserIsRootAdmin).map((staff, index) => {
                        const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                        const isActive = staff.status === 'active';
                        
                        return (
                          <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-2 text-center text-sm text-gray-500 font-medium">
                              {serialNumber}
                            </td>
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0 ${
                                  isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {staff.name?.charAt(0) || '?'}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">{staff.name}</div>
                                  <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate max-w-[120px]">{staff.email}</span>
                                  </div>
                                  {staff.employeeId && (
                                    <div className="text-[10px] text-gray-400">ID: {staff.employeeId}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-2 hidden sm:table-cell">
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getRoleBadge(staff.roleValue)}`}>
                                {staff.role}
                              </span>
                              {staff.designation && (
                                <div className="text-[10px] text-gray-500 mt-0.5">{staff.designation}</div>
                              )}
                            </td>
                            <td className="py-2 hidden md:table-cell">
                              <span className="text-sm text-gray-600">{staff.department || '—'}</span>
                            </td>
                            <td className="py-2">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(staff.status)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(staff.status)}`} />
                                {staff.status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-2">
                              <div className="flex items-center gap-0.5">
                                <IconButton
                                  icon={Eye}
                                  onClick={() => handleViewClick(staff)}
                                  tooltip="View details"
                                  variant="primary"
                                  size="sm"
                                />
                                <IconButton
                                  icon={Edit2}
                                  onClick={() => handleEditClick(staff)}
                                  tooltip="Edit staff"
                                  variant="primary"
                                  size="sm"
                                  disabled={staff.isRootAdmin && !currentUserIsRootAdmin}
                                />
                                {isActive ? (
                                  <IconButton
                                    icon={Archive}
                                    onClick={() => handleArchiveClick(staff)}
                                    tooltip="Archive staff"
                                    variant="warning"
                                    size="sm"
                                    disabled={!currentUserIsRootAdmin || staff.isRootAdmin}
                                  />
                                ) : (
                                  <IconButton
                                    icon={RotateCcw}
                                    onClick={() => handleRestoreClick(staff)}
                                    tooltip="Restore staff"
                                    variant="success"
                                    size="sm"
                                    disabled={!currentUserIsRootAdmin || staff.isRootAdmin}
                                  />
                                )}
                                <IconButton
                                  icon={Trash2}
                                  onClick={() => handleDeleteClick(staff)}
                                  tooltip="Delete staff"
                                  variant="danger"
                                  size="sm"
                                  disabled={!currentUserIsRootAdmin || staff.isRootAdmin}
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
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Staff Modal */}
      <StaffModal
        isOpen={showStaffModal}
        onClose={() => {
          setShowStaffModal(false);
          setSelectedStaff(null);
          setFormError(null);
        }}
        staff={selectedStaff}
        mode={modalMode}
        onSave={handleSaveStaff}
        isSubmitting={isSubmitting}
        formError={formError}
        roles={roles}
        departmentOptions={departmentOptions}
        generatePasswordSuggestion={generatePasswordSuggestion}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setStaffToDelete(null);
        }}
        onConfirm={confirmDelete}
        staff={staffToDelete}
        isDeleting={isLoading}
      />

      {/* Archive Confirmation Modal */}
      <ArchiveConfirmModal
        isOpen={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
          setStaffToArchive(null);
        }}
        onConfirm={confirmArchive}
        staff={staffToArchive}
        isArchiving={isLoading}
      />

      {/* Restore Confirmation Modal */}
      <RestoreConfirmModal
        isOpen={showRestoreModal}
        onClose={() => {
          setShowRestoreModal(false);
          setStaffToRestore(null);
        }}
        onConfirm={confirmRestore}
        staff={staffToRestore}
        isRestoring={isLoading}
      />

      {/* Credentials Modal */}
      {credentialsModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={() => setCredentialsModal({ ...credentialsModal, isOpen: false })} />
          <div className="flex min-h-full items-center justify-center p-3">
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Login Credentials Created</h3>
                    <p className="text-xs text-gray-500">Staff member has been created successfully.</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 space-y-3 mb-3 border border-gray-200">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Employee ID</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white px-2.5 py-1.5 rounded border border-gray-200 text-xs font-mono truncate">
                        {credentialsModal.employeeId}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(credentialsModal.employeeId);
                          setCopyStatus('Employee ID copied!');
                          setTimeout(() => setCopyStatus(''), 2000);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Clipboard className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 mb-0.5">Password</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white px-2.5 py-1.5 rounded border border-gray-200 text-xs font-mono truncate">
                        {credentialsModal.showPassword ? credentialsModal.password : '••••••••••••'}
                      </code>
                      <button
                        onClick={() => setCredentialsModal(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        {credentialsModal.showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(credentialsModal.password);
                          setCopyStatus('Password copied!');
                          setTimeout(() => setCopyStatus(''), 2000);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Clipboard className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {copyStatus && (
                    <p className="text-xs text-green-600 font-medium">{copyStatus}</p>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mb-3">
                  The user can login with their Employee ID and the password above.
                </p>
                <div className={`mb-3 rounded-lg border px-2.5 py-2 text-xs ${
                  credentialsModal.welcomeEmailStatus === 'queued'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-yellow-200 bg-yellow-50 text-yellow-700'
                }`}>
                  {credentialsModal.welcomeEmailStatus === 'queued'
                    ? `Welcome email queued for ${credentialsModal.email}.`
                    : 'Welcome email was not queued. Share the credentials securely with the staff member.'}
                </div>
                
                <button
                  onClick={() => setCredentialsModal({ ...credentialsModal, isOpen: false })}
                  className="w-full bg-blue-600 text-white py-1.5 px-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={() => setShowBulkUploadModal(false)} />
          <div className="flex min-h-full items-center justify-center p-3">
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl transform transition-all duration-200 max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Bulk Upload Staff</h3>
                  </div>
                  <button
                    onClick={() => setShowBulkUploadModal(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  Upload a CSV file containing staff records. The system will process them in the background.
                </p>

                {/* Template download */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-1">CSV Template Columns</p>
                  <code className="text-[10px] text-gray-500 block mb-2 break-all">
                    first_name,last_name,email,phone,role,department,designation,employee_id,employment_date,password
                  </code>
                  <button
                    onClick={() => {
                      const csv = [
                        'first_name,last_name,email,phone,role,department,designation,employee_id,employment_date,password',
                        'John,Doe,john.doe@hospital.com,+2348012345678,doctor,Outpatient Department,Senior Consultant,EMP001,2024-01-15,TempPass123!',
                        'Jane,Smith,jane.smith@hospital.com,+2348098765432,nurse,Inpatient Department,Registered Nurse,EMP002,2024-02-01,TempPass123!',
                      ].join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'staff_bulk_upload_template.csv';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Template
                  </button>
                </div>

                {/* File upload input */}
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleBulkUpload(file);
                    }
                  }}
                  disabled={bulkUploading}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 border border-gray-200 rounded-lg p-1.5"
                />

                {/* Progress / Result */}
                {(bulkUploadProgress || bulkUploadResult || bulkUploadError) && (
                  <div className={`mt-3 rounded-lg p-3 border ${
                    bulkUploadError || bulkUploadProgress?.status === 'failed'
                      ? 'bg-red-50 border-red-200'
                      : bulkUploadProgress?.status === 'completed' || bulkUploadResult
                        ? 'bg-green-50 border-green-200'
                        : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {bulkUploading ? (
                        <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin flex-shrink-0" />
                      ) : bulkUploadError || bulkUploadProgress?.status === 'failed' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      )}
                      <span className={`text-xs font-medium ${
                        bulkUploadError || bulkUploadProgress?.status === 'failed'
                          ? 'text-red-700'
                          : bulkUploadProgress?.status === 'completed' || bulkUploadResult
                            ? 'text-green-700'
                            : 'text-blue-700'
                      }`}>
                        {bulkUploadProgress?.message || (bulkUploadResult ? 'Completed' : 'Processing...')}
                      </span>
                    </div>
                    {bulkUploadResult && !bulkUploadError && (
                      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white rounded-lg p-1.5">
                          <p className="text-base font-bold text-gray-800">{bulkUploadResult.total_records ?? 0}</p>
                          <p className="text-[10px] text-gray-500">Total</p>
                        </div>
                        <div className="bg-white rounded-lg p-1.5">
                          <p className="text-base font-bold text-green-600">{bulkUploadResult.success_count ?? 0}</p>
                          <p className="text-[10px] text-gray-500">Succeeded</p>
                        </div>
                        <div className="bg-white rounded-lg p-1.5">
                          <p className="text-base font-bold text-red-600">{bulkUploadResult.failure_count ?? 0}</p>
                          <p className="text-[10px] text-gray-500">Failed</p>
                        </div>
                      </div>
                    )}
                    {bulkUploadError && (
                      <p className="text-xs text-red-600 mt-1">{bulkUploadError}</p>
                    )}
                    {bulkUploadResult?.errors && bulkUploadResult.errors.length > 0 && !bulkUploadError && (
                      <div className="mt-2 max-h-32 overflow-y-auto">
                        <p className="text-xs font-medium text-gray-600 mb-1">Row Errors</p>
                        <div className="space-y-0.5">
                          {bulkUploadResult.errors.slice(0, 10).map((err, idx) => (
                            <div key={idx} className="bg-red-50 border border-red-100 rounded p-1.5">
                              <span className="text-[10px] text-red-600">Row {err.row}:</span>
                              <span className="text-[10px] text-gray-600 ml-1">{err.error}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => {
                      setShowBulkUploadModal(false);
                      resetBulkUpload();
                    }}
                    disabled={bulkUploading}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;