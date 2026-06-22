import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';

const StaffManagement = () => {
  const dispatch = useDispatch();
  const { filteredStaff, searchTerm, sortBy, filterBy } = useSelector(
    state => state.staff
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const itemsPerPage = 10;
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
  });

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'delete',
    staffData: null,
    action: null,
  });

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
  });

  const loadStaff = async () => {
    try {
      setIsLoading(true);
      dispatch(setLoading(true));
      const data = await apiRequest('/api/v1/tenants/users/');
      const users = Array.isArray(data) ? data : (data.results || []);
      const normalizedUsers = dedupeStaffById(users.map(normalizeStaff));
      dispatch(setStaffList(normalizedUsers));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      alert('Name, Email, and Role are required fields');
      return;
    }

    const parts = formData.name.trim().split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : firstName;

    const payload = {
      first_name: firstName,
      last_name: lastName || firstName,
      email: formData.email,
      phone: formData.phone || '',
      role: normalizeRole(formData.role),
      department: formData.departmentId ? Number(formData.departmentId) : undefined,
      designation: formData.designation || '',
      employment_date: formData.hireDate || undefined,
      password: 'TempPass123!',
      is_staff: true,
      employment_status: 'active',
    };

    try {
      setIsSubmitting(true);
      setIsLoading(true);
      if (editingId) {
        const updated = await apiRequest(`/api/v1/tenants/users/${editingId}/`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        dispatch(updateStaff(normalizeStaff(updated)));
        setEditingId(null);
      } else {
        const created = await apiRequest('/api/v1/tenants/users/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        dispatch(addStaff(normalizeStaff(created)));
      }

      resetForm();
      setShowForm(false);
      await loadStaff();
    } catch (error) {
      console.error('Failed to save staff user:', error);
      alert(error.message || 'Unable to save staff user');
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
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  // Get status color
  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
      : 'bg-rose-50 text-rose-700 border-rose-200';
  };

  // Show loading spinner overlay when any API request is processing
  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-slate-50/80">
          {/* Page Header */}
          <div className="bg-white border-b border-slate-200/80 px-6 py-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Staff Management</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage your healthcare workforce efficiently</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200">
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Staff
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Stats Cards - Greyed out during loading */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6 opacity-50">
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{filteredStaff.length}</p>
                    <p className="text-xs text-slate-500">Total Staff</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {filteredStaff.filter(s => s.status === 'active').length}
                    </p>
                    <p className="text-xs text-slate-500">Active</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 rounded-lg">
                    <XCircle className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {filteredStaff.filter(s => s.status === 'inactive').length}
                    </p>
                    <p className="text-xs text-slate-500">Inactive</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {new Set(filteredStaff.map(s => s.role)).size}
                    </p>
                    <p className="text-xs text-slate-500">Roles</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {new Set(filteredStaff.map(s => s.department)).size}
                    </p>
                    <p className="text-xs text-slate-500">Departments</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Add/Edit Form - Disabled during loading */}
              {showForm && (
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden sticky top-6 opacity-50 pointer-events-none">
                    <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-600 rounded-lg">
                          {editingId ? <Edit2 className="h-4 w-4 text-white" /> : <UserPlus className="h-4 w-4 text-white" />}
                        </div>
                        <h3 className="font-semibold text-slate-800">
                          {editingId ? 'Edit Staff' : 'New Staff Member'}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setShowForm(false);
                          resetForm();
                        }}
                        className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 text-slate-500" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                          placeholder=""
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address *</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            placeholder="staff@hospital.com"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            placeholder="+234 800 000 0000"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Role *</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none"
                          required
                          disabled={isLoading}
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
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none"
                          disabled={isLoading}
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
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">Hire Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="date"
                            name="hireDate"
                            value={formData.hireDate}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-200"
                          disabled={isLoading}
                        >
                          <Save className="h-4 w-4" />
                          {editingId ? 'Update' : 'Add'} Staff
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(false);
                            resetForm();
                          }}
                          className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Staff List - Greyed out during loading */}
              <div className={`${showForm ? 'lg:col-span-3' : 'lg:col-span-4'} order-1 lg:order-2`}>
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                  {/* Toolbar */}
                  <div className="px-5 py-4 border-b border-slate-200/80 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1 sm:w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search staff..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                            disabled={isLoading}
                          />
                        </div>
                        <select
                          value={sortBy}
                          onChange={handleSort}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none"
                          disabled={isLoading}
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
                          disabled={isLoading}
                        >
                          <option value="all">All Staff</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {filteredStaff.length} records
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto opacity-50 pointer-events-none">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200/80 bg-slate-50/50">
                          <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Staff</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">Department</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Hire Date</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                          <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60">
                        {displayedStaff.map((staff) => (
                          <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-sm flex-shrink-0">
                                  {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-800">{staff.name}</p>
                                  <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {staff.email}
                                  </p>
                                  {staff.employeeId && (
                                    <p className="text-[11px] text-slate-500">ID: {staff.employeeId}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div>
                                <span className="text-sm text-slate-700">{staff.role}</span>
                                {staff.designation && (
                                  <p className="text-[11px] text-slate-500">{staff.designation}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-5 py-4 hidden md:table-cell">
                              <span className="text-sm text-slate-600">{staff.department || '—'}</span>
                            </td>
                            <td className="px-5 py-4 hidden lg:table-cell">
                              <span className="text-sm text-slate-500">{staff.hireDate || '—'}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(staff.status)}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                {staff.status}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleEditClick(staff)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                  title="Edit"
                                  disabled={isLoading}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleArchiveClick(staff)}
                                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                  title="Archive"
                                  disabled={isLoading}
                                >
                                  <Archive className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(staff)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                                  title="Delete"
                                  disabled={isLoading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {displayedStaff.length === 0 && (
                      <div className="text-center py-12">
                        <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                          <Users className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-medium">No staff members found</p>
                        <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
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
        </div>
        <LoadingSpinner overlay text="Processing request..." />
      </>
    );
  }

  // Main render when not loading
  return (
    <div className="min-h-screen bg-slate-50/80">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Staff Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage your healthcare workforce efficiently</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200">
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200"
            >
              <UserPlus className="h-4 w-4" />
              Add Staff
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{filteredStaff.length}</p>
                <p className="text-xs text-slate-500">Total Staff</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {filteredStaff.filter(s => s.status === 'active').length}
                </p>
                <p className="text-xs text-slate-500">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg">
                <XCircle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {filteredStaff.filter(s => s.status === 'inactive').length}
                </p>
                <p className="text-xs text-slate-500">Inactive</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {new Set(filteredStaff.map(s => s.role)).size}
                </p>
                <p className="text-xs text-slate-500">Roles</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Building2 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {new Set(filteredStaff.map(s => s.department)).size}
                </p>
                <p className="text-xs text-slate-500">Departments</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Add/Edit Form */}
          {showForm && (
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden sticky top-6">
                <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-600 rounded-lg">
                      {editingId ? <Edit2 className="h-4 w-4 text-white" /> : <UserPlus className="h-4 w-4 text-white" />}
                    </div>
                    <h3 className="font-semibold text-slate-800">
                      {editingId ? 'Edit Staff' : 'New Staff Member'}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      placeholder="Dr. Adebayo Ogunlesi"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        placeholder="staff@hospital.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Hire Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="date"
                        name="hireDate"
                        value={formData.hireDate}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
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
              <div className="px-5 py-4 border-b border-slate-200/80 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
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
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {filteredStaff.length} records
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-50/50">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Staff</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Role</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">Department</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Hire Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60">
                    {displayedStaff.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-sm flex-shrink-0">
                              {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{staff.name}</p>
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {staff.email}
                              </p>
                              {staff.employeeId && (
                                <p className="text-[11px] text-slate-500">ID: {staff.employeeId}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <span className="text-sm text-slate-700">{staff.role}</span>
                            {staff.designation && (
                              <p className="text-[11px] text-slate-500">{staff.designation}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="text-sm text-slate-600">{staff.department || '—'}</span>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <span className="text-sm text-slate-500">{staff.hireDate || '—'}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(staff.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {staff.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditClick(staff)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleArchiveClick(staff)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                              title="Archive"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(staff)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {displayedStaff.length === 0 && (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                      <Users className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No staff members found</p>
                    <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
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
    </div>
  );
};

export default StaffManagement;