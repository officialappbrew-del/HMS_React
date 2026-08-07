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
  Menu
} from 'lucide-react';

const StaffManagement = () => {
  const dispatch = useDispatch();
  const { filteredStaff, searchTerm, sortBy, filterBy } = useSelector(
    state => state.staff
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [originalStaff, setOriginalStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const itemsPerPage = 10;
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const currentUserIsRootAdmin = typeof window !== 'undefined' ? localStorage.getItem('userIsRootAdmin') === 'true' : false;
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

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'delete',
    staffData: null,
    action: null,
  });

  const [credentialsModal, setCredentialsModal] = useState({
    isOpen: false,
    employeeId: '',
    email: '',
    password: '',
    showPassword: false,
  });

  // Bulk upload state
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(null);
  const [bulkUploadResult, setBulkUploadResult] = useState(null);
  const [bulkUploadError, setBulkUploadError] = useState(null);

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
    setModalConfig({
      isOpen: true,
      type: 'delete',
      staffData: staff,
      action: async () => {
        setIsLoading(true);
        try {
          await apiRequest(`/api/v1/tenants/users/${staff.id}/`, {
            method: 'DELETE',
          });
          await loadStaff();
        } catch (error) {
          console.error('Delete failed:', error);
          throw error;
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleArchiveClick = (staff) => {
    setModalConfig({
      isOpen: true,
      type: 'archive',
      staffData: staff,
      action: async () => {
        setIsLoading(true);
        try {
          await apiRequest(`/api/v1/tenants/users/${staff.id}/`, {
            method: 'PATCH',
            body: JSON.stringify({
              employment_status: 'inactive',
              is_active: false,
            }),
          });
          await loadStaff();
        } catch (error) {
          console.error('Archive failed:', error);
          throw error;
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleEditClick = (staff) => {
    if (staff.isRootAdmin && !currentUserIsRootAdmin) {
      alert('Only the root admin can view or edit this user.');
      return;
    }
    setOriginalStaff({ ...staff });
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
    });
    setEditingId(staff.id);
    setShowForm(true);
    setActiveDropdown(null);
  };

  const handleModalConfirm = async () => {
    try {
      if (modalConfig.action) {
        await modalConfig.action();
      }
      setModalConfig(prev => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error('Action failed:', error);
      alert(error.message || 'Unable to complete this action');
    }
  };

  const handleModalClose = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const buildCreatePayload = () => {
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

  const buildUpdatePayload = () => {
    if (!originalStaff) return {};

    const parts = formData.name.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : firstName;

    const patch = {};

    if (firstName !== (originalStaff.first_name || '')) {
      patch.first_name = firstName;
    }
    if (lastName || firstName !== (originalStaff.last_name || '')) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      alert('Name, Email, and Role are required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      setIsLoading(true);

      if (editingId) {
        const patchPayload = cleanPayload(buildUpdatePayload());
        if (Object.keys(patchPayload).length === 0) {
          alert('No changes detected');
          return;
        }
        const updated = await apiRequest(`/api/v1/tenants/users/${editingId}/`, {
          method: 'PATCH',
          body: JSON.stringify(patchPayload),
        });
        dispatch(updateStaff(normalizeStaff(updated)));
        setEditingId(null);
      } else {
        const createPayload = cleanPayload(buildCreatePayload());
        const created = await apiRequest('/api/v1/tenants/users/', {
          method: 'POST',
          body: JSON.stringify(createPayload),
        });
        dispatch(addStaff(normalizeStaff(created)));
        setCredentialsModal({
          isOpen: true,
          employeeId: created.employee_id || `STAFF-${created.id}`,
          email: created.email,
          password: formData.password,
          showPassword: false,
        });
      }

      resetForm();
      setShowForm(false);
      await loadStaff();
    } catch (error) {
      console.error('Failed to save staff user:', error);
      const errorDetails = error.details || error;
      const hasPasswordError = errorDetails?.password;
      
      if (hasPasswordError) {
        const suggestion = generatePasswordSuggestion();
        setFormData(prev => ({ ...prev, password: suggestion }));
        setShowForm(true);
        alert(`Password Error: ${Array.isArray(errorDetails.password) ? errorDetails.password.join(', ') : errorDetails.password || error.message}\n\nSuggested password has been filled in the password field. Please update and try again.`);
      } else {
        alert(error.message || 'Unable to save staff user');
      }
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const resetForm = () => {
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
    setEditingId(null);
    setOriginalStaff(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const getModalConfig = () => {
    const configs = {
      delete: {
        title: 'Delete Staff Record',
        message: 'Are you sure you want to permanently delete this staff record? This action is irreversible and will remove all associated data.',
        confirmText: 'Delete Permanently',
        showSoftDeleteOption: false,
      },
      edit: {
        title: 'Edit Staff Details',
        message: 'You are about to modify staff information. Please ensure all changes are accurate and properly documented.',
        confirmText: 'Save Changes',
        showSoftDeleteOption: false,
      },
      archive: {
        title: 'Archive Staff Record',
        message: 'This will mark the staff member as inactive. The record will be preserved but hidden from active lists.',
        confirmText: 'Archive Staff',
        showSoftDeleteOption: false,
      },
    };
    return configs[modalConfig.type] || configs.delete;
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : 'bg-rose-50 text-rose-700 border-rose-200';
  };

  // Stats Card Component
  const StatsCard = ({ icon: Icon, iconBg, iconColor, label, value }) => (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`p-2 ${iconBg} rounded-lg flex-shrink-0`}>
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg sm:text-2xl font-bold text-slate-800 truncate">{value}</p>
          <p className="text-[10px] sm:text-xs text-slate-500 truncate">{label}</p>
        </div>
      </div>
    </div>
  );

  // Mobile Action Buttons Component
  const MobileActionButtons = () => (
    <div className="lg:hidden flex items-center gap-2">
      <button
        onClick={() => setShowBulkUploadModal(true)}
        className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-200"
        aria-label="Bulk Upload"
      >
        <Upload className="h-5 w-5" />
      </button>
      <button
        onClick={() => setShowForm(true)}
        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200"
        aria-label="Add Staff"
      >
        <UserPlus className="h-5 w-5" />
      </button>
    </div>
  );

  // Loading State
  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-slate-50/80">
          {/* Page Header - Skeleton */}
          <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-4 sm:py-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <div className="h-7 sm:h-8 w-40 sm:w-48 bg-slate-200 rounded-lg animate-pulse"></div>
                <div className="h-4 w-48 sm:w-56 bg-slate-200 rounded-lg animate-pulse mt-1"></div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden sm:block h-10 w-24 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="hidden sm:block h-10 w-24 bg-slate-200 rounded-xl animate-pulse"></div>
                <div className="h-10 w-10 sm:w-auto sm:px-5 bg-slate-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-slate-200 rounded-lg animate-pulse h-9 w-9 sm:h-10 sm:w-10"></div>
                    <div className="flex-1">
                      <div className="h-6 sm:h-7 w-12 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-3 w-16 bg-slate-200 rounded animate-pulse mt-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Skeleton */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200/80 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-full sm:w-64 bg-slate-200 rounded-xl animate-pulse"></div>
                    <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse hidden sm:block"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
                    <div className="h-5 w-16 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-50/50">
                      {['Staff', 'Role', 'Department', 'Hire Date', 'Status', 'Actions'].map((heading) => (
                        <th key={heading} className="px-3 sm:px-5 py-3 text-left">
                          <div className="h-3 w-16 bg-slate-200 rounded animate-pulse"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-slate-200/60">
                        <td className="px-3 sm:px-5 py-3 sm:py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-200 rounded-full animate-pulse"></div>
                            <div>
                              <div className="h-4 w-24 sm:w-32 bg-slate-200 rounded animate-pulse"></div>
                              <div className="h-3 w-32 sm:w-40 bg-slate-200 rounded animate-pulse mt-1"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-5 py-3 sm:py-4">
                          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                        </td>
                        <td className="px-3 sm:px-5 py-3 sm:py-4 hidden md:table-cell">
                          <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                        </td>
                        <td className="px-3 sm:px-5 py-3 sm:py-4 hidden lg:table-cell">
                          <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                        </td>
                        <td className="px-3 sm:px-5 py-3 sm:py-4">
                          <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                        </td>
                        <td className="px-3 sm:px-5 py-3 sm:py-4">
                          <div className="flex justify-end gap-1">
                            {[...Array(3)].map((_, j) => (
                              <div key={j} className="h-7 w-7 bg-slate-200 rounded-lg animate-pulse"></div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                  <div className="flex items-center gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-8 w-8 bg-slate-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LoadingSpinner overlay text="Processing request..." />
      </>
    );
  }

  // Main Render
  return (
    <div className="min-h-screen bg-slate-50/80">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-4 sm:py-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Staff Management</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage your healthcare workforce efficiently</p>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2 sm:gap-3">
            <button className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all duration-200"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Bulk Upload</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Staff</span>
            </button>
          </div>

          {/* Mobile Actions */}
          <MobileActionButtons />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Stats Cards - Improved Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatsCard
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            label="Total Staff"
            value={filteredStaff.length}
          />
          <StatsCard
            icon={CheckCircle}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            label="Active"
            value={filteredStaff.filter(s => s.status === 'active').length}
          />
          <StatsCard
            icon={XCircle}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
            label="Inactive"
            value={filteredStaff.filter(s => s.status === 'inactive').length}
          />
          <StatsCard
            icon={Briefcase}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            label="Roles"
            value={new Set(filteredStaff.map(s => s.role)).size}
          />
          <StatsCard
            icon={Building2}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            label="Departments"
            value={new Set(filteredStaff.map(s => s.department)).size}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Add/Edit Form */}
          {showForm && (
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden sticky top-6">
                <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-600 rounded-lg flex-shrink-0">
                      {editingId ? <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 text-white" /> : <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-white" />}
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                      {editingId ? 'Edit Staff' : 'New Staff Member'}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="Dr. Adebayo Ogunlesi"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        placeholder="staff@hospital.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        placeholder="+234 800 000 0000"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Role *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Select Role</option>
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Department</label>
                    <select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none"
                      disabled={isSubmitting}
                    >
                      <option value="">Select Department</option>
                      {departmentOptions.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      placeholder="Senior Consultant"
                      className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Login Password *</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter password for login"
                          className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 pr-9 sm:pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                          required={!editingId}
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const suggestion = generatePasswordSuggestion();
                          setFormData(prev => ({ ...prev, password: suggestion }));
                        }}
                        className="px-3 py-2 text-xs bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors whitespace-nowrap"
                        title="Generate secure password"
                      >
                        Suggest
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Hire Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        name="hireDate"
                        value={formData.hireDate}
                        onChange={handleChange}
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {editingId ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {editingId ? 'Update' : 'Add'} Staff
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Staff List */}
          <div className={`${showForm ? 'lg:col-span-3' : 'lg:col-span-4'} order-1 lg:order-2`}>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200/80 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search staff..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                    <select
                      value={sortBy}
                      onChange={handleSort}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="role">Sort by Role</option>
                      <option value="department">Sort by Dept</option>
                      <option value="hireDate">Sort by Date</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={filterBy}
                      onChange={handleFilter}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none"
                    >
                      <option value="all">All Staff</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">
                      {filteredStaff.length} records
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-full inline-block align-middle">
                  <table className="min-w-full divide-y divide-slate-200/60">
                    <thead>
                      <tr className="border-b border-slate-200/80 bg-slate-50/50">
                        <th className="px-3 sm:px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Staff</th>
                        <th className="px-3 sm:px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">Role</th>
                        <th className="px-3 sm:px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">Department</th>
                        <th className="px-3 sm:px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Hire Date</th>
                        <th className="px-3 sm:px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="px-3 sm:px-5 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60">
                      {displayedStaff.filter((staff) => !staff.isRootAdmin || currentUserIsRootAdmin).map((staff) => (
                        <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                          <td className="px-3 sm:px-5 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs sm:text-sm font-medium shadow-sm flex-shrink-0">
                                {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-slate-800 truncate">{staff.name}</p>
                                <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                                  <Mail className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{staff.email}</span>
                                </p>
                                {staff.employeeId && (
                                  <p className="text-[10px] sm:text-[11px] text-slate-500">ID: {staff.employeeId}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-5 py-3 sm:py-4 hidden sm:table-cell">
                            <div>
                              <span className="text-sm text-slate-700">{staff.role}</span>
                              {staff.designation && (
                                <p className="text-[10px] sm:text-[11px] text-slate-500">{staff.designation}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-5 py-3 sm:py-4 hidden md:table-cell">
                            <span className="text-sm text-slate-600">{staff.department || '—'}</span>
                          </td>
                          <td className="px-3 sm:px-5 py-3 sm:py-4 hidden lg:table-cell">
                            <span className="text-sm text-slate-500">{staff.hireDate || '—'}</span>
                          </td>
                          <td className="px-3 sm:px-5 py-3 sm:py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(staff.status)}`}>
                              <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span className="hidden xs:inline">{staff.status}</span>
                              <span className="xs:hidden">{staff.status === 'active' ? 'A' : 'I'}</span>
                            </span>
                          </td>
                          <td className="px-3 sm:px-5 py-3 sm:py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEditClick(staff)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="Edit"
                                disabled={staff.isRootAdmin && !currentUserIsRootAdmin}
                              >
                                <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                onClick={() => currentUserIsRootAdmin ? handleArchiveClick(staff) : null}
                                className={`p-1.5 text-slate-400 rounded-lg transition-all duration-200 ${currentUserIsRootAdmin ? 'hover:text-amber-600 hover:bg-amber-50' : 'opacity-50 cursor-not-allowed'}`}
                                title={currentUserIsRootAdmin ? 'Archive' : 'Not allowed'}
                                disabled={!currentUserIsRootAdmin}
                              >
                                <Archive className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </button>
                              <button
                                onClick={() => currentUserIsRootAdmin ? handleDeleteClick(staff) : null}
                                className={`p-1.5 text-slate-400 rounded-lg transition-all duration-200 ${currentUserIsRootAdmin ? 'hover:text-rose-600 hover:bg-rose-50' : 'opacity-50 cursor-not-allowed'}`}
                                title={currentUserIsRootAdmin ? 'Delete' : 'Not allowed'}
                                disabled={!currentUserIsRootAdmin}
                              >
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {displayedStaff.length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <div className="inline-flex p-3 sm:p-4 bg-slate-100 rounded-full mb-3 sm:mb-4">
                      <Users className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No staff members found</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        config={getModalConfig()}
        data={modalConfig.staffData}
      />

      {/* Credentials Modal */}
      {credentialsModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setCredentialsModal({ ...credentialsModal, isOpen: false })} />
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all duration-200">
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Login Credentials Created</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Staff member has been created successfully. Please save these login credentials:
                </p>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">User ID / Employee ID</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-200 text-xs sm:text-sm font-mono truncate">
                        {credentialsModal.employeeId}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(credentialsModal.employeeId);
                          setCopyStatus('Employee ID copied!');
                          setTimeout(() => setCopyStatus(''), 2000);
                        }}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                        title="Copy"
                      >
                        <Clipboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-200 text-xs sm:text-sm font-mono truncate">
                        {credentialsModal.showPassword ? credentialsModal.password : '••••••••••••'}
                      </code>
                      <button
                        onClick={() => setCredentialsModal(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                        title={credentialsModal.showPassword ? 'Hide password' : 'Show password'}
                      >
                        {credentialsModal.showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(credentialsModal.password);
                          setCopyStatus('Password copied!');
                          setTimeout(() => setCopyStatus(''), 2000);
                        }}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                        title="Copy"
                      >
                        <Clipboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                  {copyStatus && (
                    <p className="text-xs text-green-600 font-medium">{copyStatus}</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  The user can login with their User ID and the password above.
                </p>
                <button
                  onClick={() => setCredentialsModal({ ...credentialsModal, isOpen: false })}
                  className="w-full bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowBulkUploadModal(false)} />
          <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl transform transition-all duration-200 max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                      <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Bulk Upload Staff</h3>
                  </div>
                  <button
                    onClick={() => setShowBulkUploadModal(false)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-3 sm:mb-4">
                  Upload a CSV file containing staff records. The system will process them in the background and you'll see the progress here.
                </p>

                {/* Template download */}
                <div className="bg-slate-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <p className="text-xs font-medium text-slate-600 mb-2">CSV Template Columns</p>
                  <code className="text-[10px] sm:text-[11px] text-slate-500 block mb-2 break-all">
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
                    className="inline-flex items-center gap-2 px-3 py-1.5 sm:py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                  className="w-full text-xs sm:text-sm text-slate-600 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 border border-slate-200 rounded-lg p-1.5 sm:p-2"
                />

                {/* Progress / Result */}
                {bulkUploadProgress && (
                  <div className={`mt-3 sm:mt-4 rounded-lg p-3 sm:p-4 border ${
                    bulkUploadProgress.status === 'completed'
                      ? 'bg-emerald-50 border-emerald-200'
                      : bulkUploadProgress.status === 'failed'
                        ? 'bg-rose-50 border-rose-200'
                        : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {bulkUploadProgress.status === 'processing' ? (
                        <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 animate-spin flex-shrink-0" />
                      ) : bulkUploadProgress.status === 'completed' ? (
                        <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-600 flex-shrink-0" />
                      )}
                      <span className={`text-xs sm:text-sm font-medium ${
                        bulkUploadProgress.status === 'completed'
                          ? 'text-emerald-700'
                          : bulkUploadProgress.status === 'failed'
                            ? 'text-rose-700'
                            : 'text-blue-700'
                      }`}>
                        {bulkUploadProgress.status === 'processing' ? 'Processing...' : bulkUploadProgress.status === 'completed' ? 'Completed' : 'Failed'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{bulkUploadProgress.message}</p>
                    {bulkUploadResult && (
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-white rounded-lg p-1.5 sm:p-2">
                          <p className="text-base sm:text-lg font-bold text-slate-800">{bulkUploadResult.total_records ?? 0}</p>
                          <p className="text-[10px] sm:text-[11px] text-slate-500">Total</p>
                        </div>
                        <div className="bg-white rounded-lg p-1.5 sm:p-2">
                          <p className="text-base sm:text-lg font-bold text-emerald-600">{bulkUploadResult.success_count ?? 0}</p>
                          <p className="text-[10px] sm:text-[11px] text-slate-500">Succeeded</p>
                        </div>
                        <div className="bg-white rounded-lg p-1.5 sm:p-2">
                          <p className="text-base sm:text-lg font-bold text-rose-600">{bulkUploadResult.failure_count ?? 0}</p>
                          <p className="text-[10px] sm:text-[11px] text-slate-500">Failed</p>
                        </div>
                      </div>
                    )}
                    {bulkUploadError && (
                      <p className="text-xs text-rose-600 mt-2">{bulkUploadError}</p>
                    )}
                  </div>
                )}

                {/* Errors list */}
                {bulkUploadResult?.errors && bulkUploadResult.errors.length > 0 && (
                  <div className="mt-3 sm:mt-4 max-h-32 sm:max-h-40 overflow-y-auto">
                    <p className="text-xs font-medium text-slate-600 mb-2">Row Errors</p>
                    <div className="space-y-1">
                      {bulkUploadResult.errors.slice(0, 20).map((err, idx) => (
                        <div key={idx} className="bg-rose-50 border border-rose-100 rounded p-1.5 sm:p-2">
                          <span className="text-[10px] sm:text-[11px] text-rose-600">Row {err.row}:</span>
                          <span className="text-[10px] sm:text-[11px] text-slate-600 ml-1">{err.error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-3 sm:mt-4">
                  <button
                    onClick={() => {
                      setShowBulkUploadModal(false);
                      resetBulkUpload();
                    }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
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