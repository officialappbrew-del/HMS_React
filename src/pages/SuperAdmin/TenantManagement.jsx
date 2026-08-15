import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, X, Loader2, XCircle, CheckCircle, ChevronRight, ChevronLeft,
  Users, Server, Shield, Zap, Mail, Building2, Pencil, Eye, Save, Info,
  MapPin, CreditCard, Calendar, ShieldCheck
} from 'lucide-react';
import { superAdminApi } from '../../utils/superAdminApi';
import AdminPagination from '../../components/AdminPagination';
import { useSuperAdminData } from '../../contexts/SuperAdminDataContext';
import { useAdminPermissions, isSuperUser } from '../../hooks/useAdminPermissions';

const TenantManagement = () => {
  const permissions = useAdminPermissions();
  const canCreateTenant = permissions.canCreateTenants || isSuperUser();
  const canSuspendTenant = permissions.canSuspendTenants || isSuperUser();
  const canViewTenants = permissions.canViewAllTenants || isSuperUser();

  const {
    countries, states, lgas, facilityTypes, plans,
    loadStates: loadContextStates, loadLgas: loadContextLgas,
  } = useSuperAdminData();

  const [tenants, setTenants] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '', domain: '', email: '', phone: '',
    address: '', city: '', state: '', lga: '', country: '',
    facility_type: '', subscription_plan: '', registration_number: ''
  });

  const [rootAdmin, setRootAdmin] = useState({
    first_name: '', last_name: '', email: '', phone: ''
  });

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    const length = 12;
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Detail / Edit modal state
  const [detailTenant, setDetailTenant] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const loadTenants = async (pageNum = 1) => {
    setPageLoading(true);
    setError('');
    try {
      const params = { page: pageNum, page_size: pageSize };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const result = await superAdminApi.getTenants(params);
      const items = result.results || result.tenants || result || [];
      setTenants(items);
      setTotalCount(result.count || items.length);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load tenants');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadTenants(1);
  }, [search, statusFilter]);

  const [actionError, setActionError] = useState('');

  const handleToggle = async (publicId, action) => {
    setActionLoading(prev => ({ ...prev, [publicId]: true }));
    setActionError('');
    try {
      await superAdminApi.toggleTenant(publicId, action);
      loadTenants(page);
    } catch (err) {
      setActionError(err.message || 'Action failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [publicId]: false }));
    }
  };

const openDetailModal = async (publicId) => {
    setDetailTenant(null);
    setEditMode(false);
    setDetailError('');
    setSaveError('');
    setSaveSuccess('');
    setDetailLoading(true);
    try {
      const data = await superAdminApi.getTenant(publicId);
      setDetailTenant(data);
      setEditForm({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        phone2: data.phone2 || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        lga: data.lga || '',
        country: data.country || '',
        facility_type: data.facility_type || '',
        registration_number: data.registration_number || '',
        tax_id: data.tax_id || '',
        website: data.website || '',
        subscription_plan: data.subscription_plan || '',
        subscription_status: data.subscription_status || '',
        subscription_start_date: data.subscription_start_date || '',
        subscription_end_date: data.subscription_end_date || '',
        monthly_fee: data.monthly_fee || '',
        payment_method: data.payment_method || '',
        billing_email: data.billing_email || '',
        nhis_accreditation: data.nhis_accreditation || '',
        nhis_provider_id: data.nhis_provider_id || '',
        nhis_accreditation_date: data.nhis_accreditation_date || '',
        nhis_expiry_date: data.nhis_expiry_date || '',
        bed_capacity: data.bed_capacity || '',
        established_date: data.established_date || '',
        emergency_services: data.emergency_services || false,
        notes: data.notes || '',
      });
      // Load dependent dropdowns for the tenant's country/state
      if (data.state) {
        const stateRef = countries.find(c => String(c.id) === String(data.country));
        if (stateRef || data.country) {
          loadContextStates(data.country);
        }
      }
    } catch (err) {
      setDetailError(err.message || 'Failed to load tenant details');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetailModal = () => {
    setDetailTenant(null);
    setEditMode(false);
    setDetailError('');
    setSaveError('');
    setSaveSuccess('');
  };

  const handleEditFieldChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveTenant = async () => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      const dateFields = ['subscription_start_date', 'subscription_end_date', 'established_date', 'nhis_accreditation_date', 'nhis_expiry_date'];
      const normalizedEdit = { ...editForm };
      dateFields.forEach(field => {
        if (normalizedEdit[field] === '' || normalizedEdit[field] === undefined || normalizedEdit[field] === null) {
          normalizedEdit[field] = null;
        }
      });
      const payload = {
        ...normalizedEdit,
        country: normalizedEdit.country ? Number(normalizedEdit.country) : null,
        state: normalizedEdit.state ? Number(normalizedEdit.state) : null,
        lga: normalizedEdit.lga ? Number(normalizedEdit.lga) : null,
        facility_type: normalizedEdit.facility_type ? Number(normalizedEdit.facility_type) : null,
        subscription_plan: normalizedEdit.subscription_plan ? Number(normalizedEdit.subscription_plan) : null,
        bed_capacity: normalizedEdit.bed_capacity ? Number(normalizedEdit.bed_capacity) : null,
        monthly_fee: normalizedEdit.monthly_fee ? Number(normalizedEdit.monthly_fee) : null,
      };
      const updated = await superAdminApi.updateTenant(detailTenant.public_id, payload);
      setDetailTenant(updated);
      setEditMode(false);
      setSaveSuccess('Tenant details updated successfully.');
      loadTenants(page);
    } catch (err) {
      setSaveError(err.message || 'Failed to update tenant');
    } finally {
      setSaving(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const formatApiError = (err) => {
    if (!err) return 'Failed to create tenant';
    const data = err.data || {};
    if (typeof data === 'object' && !Array.isArray(data)) {
      const messages = [];
      for (const [key, value] of Object.entries(data)) {
        if (key === 'non_field_errors') continue;
        const text = Array.isArray(value) ? value.join(', ') : String(value);
        if (text) messages.push(text);
      }
      if (messages.length) return messages.join(' | ');
      if (data.non_field_errors) {
        const text = Array.isArray(data.non_field_errors)
          ? data.non_field_errors.join(', ')
          : String(data.non_field_errors);
        if (text) return text;
      }
    }
    return err.message || 'Failed to create tenant';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    const missing = [];
    if (!formData.name?.trim()) missing.push('Hospital Name');
    if (!formData.domain?.trim()) missing.push('Domain');
    if (!formData.facility_type) missing.push('Facility Type');
    if (!formData.subscription_plan) missing.push('Subscription Plan');
    if (!formData.registration_number?.trim()) missing.push('Registration Number');
    if (!rootAdmin.first_name?.trim()) missing.push('First Name');
    if (!rootAdmin.last_name?.trim()) missing.push('Last Name');
    if (!rootAdmin.email?.trim()) missing.push('Email');
    if (missing.length) {
      setCreateError(`Please fill: ${missing.join(', ')}`);
      setCreating(false);
      return;
    }

    try {
      const dateFields = ['subscription_start_date', 'subscription_end_date', 'established_date', 'nhis_accreditation_date', 'nhis_expiry_date'];
      const normalizedForm = { ...formData };
      dateFields.forEach(field => {
        if (normalizedForm[field] === '' || normalizedForm[field] === undefined || normalizedForm[field] === null) {
          normalizedForm[field] = null;
        }
      });
      const payload = {
        ...normalizedForm,
        root_admin: {
          ...rootAdmin,
          password: generateTempPassword(),
        },
        country: normalizedForm.country ? Number(normalizedForm.country) : null,
        state: normalizedForm.state ? Number(normalizedForm.state) : null,
        lga: normalizedForm.lga ? Number(normalizedForm.lga) : null,
        facility_type: normalizedForm.facility_type ? Number(normalizedForm.facility_type) : null,
        subscription_plan: normalizedForm.subscription_plan ? Number(normalizedForm.subscription_plan) : null,
      };
      await superAdminApi.createTenant(payload);
      setShowCreateModal(false);
      setStep(1);
        setFormData({
          name: '', domain: '', email: '', phone: '',
          address: '', city: '', state: '', lga: '', country: '',
          facility_type: '', subscription_plan: '', registration_number: ''
        });
        setRootAdmin({
         first_name: '', last_name: '', email: '', phone: ''
       });
      loadTenants(page);
    } catch (err) {
      setCreateError(formatApiError(err));
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (tenant) => {
    const status = tenant.subscription_status || 'unknown';
    const isActive = tenant.is_active !== false;
    const styles = {
      active: isActive
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100'
        : 'bg-slate-100 text-slate-600 border-slate-200',
      trial: 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-100',
      suspended: 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-100',
      cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return styles[status] || styles.active;
  };

  const selectedPlan = plans.find(p => String(p.id) === String(formData.subscription_plan));

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const inputClass =
    'w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg ' +
    'text-slate-900 placeholder:text-slate-400 ' +
    'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all';

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Tenant Management</h2>
          <p className="text-sm text-slate-500 mt-0.5 sm:mt-1">Manage hospitals and clinics on the platform</p>
        </div>
        {canCreateTenant && (
        <button
          onClick={() => { setShowCreateModal(true); setStep(1); }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Tenant
        </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenants by name, code, domain..."
            className={`${inputClass} pl-10`}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${inputClass} pl-10 pr-10 appearance-none w-full sm:w-48`}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="suspended">Suspended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {actionError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {actionError}
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tenant</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Domain</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Users</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Plan</th>
                <th className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageLoading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                      <span className="text-sm font-medium">Loading tenants...</span>
                    </div>
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="w-8 h-8 text-slate-300" />
                      <span className="text-sm font-medium">No tenants found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.public_id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors flex-shrink-0">
                          <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{tenant.name}</p>
                          <p className="text-xs text-slate-500">{tenant.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-xs text-slate-600 font-mono hidden md:table-cell truncate max-w-[120px]">{tenant.domain}</td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold border rounded-lg whitespace-nowrap ${getStatusBadge(tenant)}`}>
                        {tenant.subscription_status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-sm text-slate-700 font-medium hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {tenant.user_count || 0}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-xs text-slate-600 hidden lg:table-cell">
                      {tenant.subscription_plan_name ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 border border-slate-200 font-medium">
                          <Server className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate max-w-[100px]">{tenant.subscription_plan_name}</span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
<td className="px-3 sm:px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openDetailModal(tenant.public_id)}
                          disabled={!canViewTenants}
                          className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          title="View details"
                        >
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        {tenant.is_active !== false ? (
                          <button
                            onClick={() => handleToggle(tenant.public_id, 'deactivate')}
                            disabled={actionLoading[tenant.public_id] || !canSuspendTenant}
                            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Deactivate"
                          >
                            {actionLoading[tenant.public_id] ? (
                              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggle(tenant.public_id, 'activate')}
                            disabled={actionLoading[tenant.public_id] || !canSuspendTenant}
                            className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Activate"
                          >
                            {actionLoading[tenant.public_id] ? (
                              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={pageSize}
          onPageChange={(p) => loadTenants(p)}
        />
      </div>

      {/* Create Modal - Fixed Size */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowCreateModal(false)} 
          />
          
          {/* Modal Container - Fixed max dimensions */}
          <div className="relative bg-slate-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200">
            {/* Modal Header - Sticky */}
            <div className="sticky top-0 bg-slate-50/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">Create New Tenant</h3>
                <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Set up a new hospital facility</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-500 flex-shrink-0"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-4 sm:p-6">
              {createError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 mb-4 sm:mb-5">
                  {createError}
                </div>
              )}

              {/* Step Indicator - Compact */}
              <div className="flex items-center justify-between mb-6">
                {[
                  { n: 1, label: 'Tenant', icon: Building2 },
                  { n: 2, label: 'Plan', icon: Zap },
                  { n: 3, label: 'Admin', icon: Shield },
                ].map((s, i) => (
                  <React.Fragment key={s.n}>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        step >= s.n
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        <s.icon className="w-3.5 h-3.5" />
                      </div>
                      <span className={`text-[10px] font-semibold leading-tight text-center ${step >= s.n ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className="flex-1 mx-1">
                        <div className="h-0.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                            style={{ width: step > s.n ? '100%' : '0%' }}
                          />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Tenant Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.name} 
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        className={inputClass} 
                        placeholder="e.g. General Hospital" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Domain *</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.domain} 
                        onChange={(e) => setFormData({ ...formData, domain: e.target.value })} 
                        placeholder="e.g. hospital.example.com" 
                        className={inputClass} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        className={inputClass} 
                        placeholder="info@hospital.com" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                      <input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                        className={inputClass} 
                        placeholder="+234..." 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Country *</label>
                      <select
                        required
                        value={formData.country}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => ({ ...prev, country: val, state: '', lga: '' }));
                          loadContextStates(val);
                        }}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="">Select country</option>
                        {countries.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                      <select
                        required
                        value={formData.state}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => ({ ...prev, state: val, lga: '' }));
                          loadContextLgas(val);
                        }}
                        disabled={!formData.country}
                        className={`${inputClass} cursor-pointer disabled:opacity-50 disabled:bg-slate-100`}
                      >
                        <option value="">Select state</option>
                        {states.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">City / LGA</label>
                      <select
                        value={formData.lga}
                        onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                        disabled={!formData.state}
                        className={`${inputClass} cursor-pointer disabled:opacity-50 disabled:bg-slate-100`}
                      >
                        <option value="">Select city / LGA</option>
                        {lgas.map(l => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                      <input 
                        type="text" 
                        value={formData.city} 
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })} 
                        className={inputClass} 
                        placeholder="e.g. Lagos" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Type *</label>
                      <select
                        required
                        value={formData.facility_type}
                        onChange={(e) => setFormData({ ...formData, facility_type: e.target.value })}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="">Select facility type</option>
                        {facilityTypes.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                       </select>
                     </div>
                     <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                      <input 
                        type="text" 
                        value={formData.address} 
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                        className={inputClass} 
                        placeholder="Street address" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Registration Number *</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.registration_number} 
                        onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })} 
                        className={inputClass} 
                        placeholder="e.g. REG-0001" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-3 border-t border-slate-200">
                    <button 
                      type="button" 
                      onClick={nextStep} 
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Subscription Plan */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subscription Plan *</label>
                    <select
                      required
                      value={formData.subscription_plan}
                      onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">Select a subscription plan</option>
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - ₦{plan.price_monthly}/mo
                        </option>
                      ))}
                     </select>
                   </div>

                  {selectedPlan && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">{selectedPlan.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Selected plan configuration</p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 self-start sm:self-auto">
                          <Zap className="w-3.5 h-3.5" />
                          Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { label: 'Monthly', value: `₦${selectedPlan.price_monthly}` },
                          { label: 'Yearly', value: `₦${selectedPlan.price_yearly}` },
                          { label: 'Users', value: selectedPlan.max_users },
                          { label: 'Storage', value: `${selectedPlan.max_storage_gb} GB` },
                        ].map((item) => (
                          <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm font-bold text-slate-900">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {plans.length === 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                      No subscription plans available. Please create a plan first.
                    </div>
                  )}

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-3 border-t border-slate-200">
                    <button 
                      type="button" 
                      onClick={prevStep} 
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button 
                      type="button" 
                      onClick={nextStep} 
                      disabled={!formData.subscription_plan} 
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:active:scale-100"
                    >
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Admin User */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Root Administrator Account</p>
                      <p className="text-xs text-slate-600 mt-0.5">Credentials will be sent to the email address below.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={rootAdmin.first_name} 
                        onChange={(e) => setRootAdmin({ ...rootAdmin, first_name: e.target.value })} 
                        className={inputClass} 
                        placeholder="John" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={rootAdmin.last_name} 
                        onChange={(e) => setRootAdmin({ ...rootAdmin, last_name: e.target.value })} 
                        className={inputClass} 
                        placeholder="Doe" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                      <input 
                        type="email" 
                        required 
                        value={rootAdmin.email} 
                        onChange={(e) => setRootAdmin({ ...rootAdmin, email: e.target.value })} 
                        className={inputClass} 
                        placeholder="admin@hospital.com" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                      <input 
                        type="tel" 
                        value={rootAdmin.phone} 
                        onChange={(e) => setRootAdmin({ ...rootAdmin, phone: e.target.value })} 
                        className={inputClass} 
                        placeholder="+234..." 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 pt-3 border-t border-slate-200">
                    <button 
                      type="button" 
                      onClick={prevStep} 
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button 
                      type="submit" 
                      disabled={creating} 
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:active:scale-100"
                    >
                      {creating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Server className="w-4 h-4" />
                          Deploy Tenant
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
</form>
          </div>
        </div>
      )}

      {/* View / Edit Tenant Detail Modal */}
      {detailTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeDetailModal}
          />
          <div className="relative bg-slate-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="sticky top-0 bg-slate-50/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">{detailTenant.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {detailTenant.code} · {detailTenant.country_name || '—'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {!editMode ? (
                  canSuspendTenant ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  ) : null
                ) : (
                  <button
                    onClick={handleSaveTenant}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                )}
                <button
                  onClick={closeDetailModal}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-200 transition-colors text-slate-500"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {detailLoading && (
                <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  <span className="text-sm font-medium">Loading details...</span>
                </div>
              )}

              {detailError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 mb-4">
                  {detailError}
                </div>
              )}

              {saveError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 mb-4">
                  {saveError}
                </div>
              )}

              {saveSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 mb-4">
                  {saveSuccess}
                </div>
              )}

              {!detailLoading && !detailError && (
                <div className="space-y-6">
                  {/* Status banner */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</p>
                      <span className={`inline-flex mt-1 px-2 py-0.5 text-xs font-semibold border rounded-lg ${getStatusBadge(detailTenant)}`}>
                        {detailTenant.subscription_status || 'unknown'}
                      </span>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Plan</p>
                      <p className="mt-1 text-sm font-bold text-slate-900 truncate">
                        {detailTenant.subscription_plan_details?.name || '—'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Facility</p>
                      <p className="mt-1 text-sm font-bold text-slate-900 truncate">
                        {detailTenant.facility_type_details?.name || '—'}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Trial Days Left</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {detailTenant.days_remaining_in_trial ?? '—'}
                      </p>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <Section title="Basic Information" icon={<Info className="w-4 h-4" />}>
                    {editMode ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Name">
                          <input className={inputClass} value={editForm.name || ''} onChange={(e) => handleEditFieldChange('name', e.target.value)} />
                        </Field>
                        <Field label="Code">
                          <input className={`${inputClass} bg-slate-100`} value={detailTenant.code || ''} disabled />
                        </Field>
                        <Field label="Domain">
                          <input className={`${inputClass} bg-slate-100`} value={detailTenant.domain || ''} disabled />
                        </Field>
                        <Field label="Schema Name">
                          <input className={`${inputClass} bg-slate-100`} value={detailTenant.schema_name || ''} disabled />
                        </Field>
                        <Field label="Registration Number">
                          <input className={inputClass} value={editForm.registration_number || ''} onChange={(e) => handleEditFieldChange('registration_number', e.target.value)} />
                        </Field>
                        <Field label="Tax ID">
                          <input className={inputClass} value={editForm.tax_id || ''} onChange={(e) => handleEditFieldChange('tax_id', e.target.value)} />
                        </Field>
                        <Field label="Website">
                          <input className={inputClass} value={editForm.website || ''} onChange={(e) => handleEditFieldChange('website', e.target.value)} />
                        </Field>
                        <Field label="Notes">
                          <input className={inputClass} value={editForm.notes || ''} onChange={(e) => handleEditFieldChange('notes', e.target.value)} />
                        </Field>
                      </div>
                    ) : (
                      <InfoGrid items={[
                        { label: 'Code', value: detailTenant.code },
                        { label: 'Domain', value: detailTenant.domain },
                        { label: 'Schema', value: detailTenant.schema_name },
                        { label: 'Registration No.', value: detailTenant.registration_number },
                        { label: 'Tax ID', value: detailTenant.tax_id || '—' },
                        { label: 'Website', value: detailTenant.website || '—' },
                        { label: 'Public ID', value: detailTenant.public_id },
                        { label: 'Notes', value: detailTenant.notes || '—' },
                      ]} />
                    )}
                  </Section>

                  {/* Location & Contact */}
                  <Section title="Location & Contact" icon={<MapPin className="w-4 h-4" />}>
                    {editMode ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Email">
                          <input type="email" className={inputClass} value={editForm.email || ''} onChange={(e) => handleEditFieldChange('email', e.target.value)} />
                        </Field>
                        <Field label="Phone">
                          <input className={inputClass} value={editForm.phone || ''} onChange={(e) => handleEditFieldChange('phone', e.target.value)} />
                        </Field>
                        <Field label="Phone 2">
                          <input className={inputClass} value={editForm.phone2 || ''} onChange={(e) => handleEditFieldChange('phone2', e.target.value)} />
                        </Field>
                        <Field label="Billing Email">
                          <input type="email" className={inputClass} value={editForm.billing_email || ''} onChange={(e) => handleEditFieldChange('billing_email', e.target.value)} />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Address">
                            <input className={inputClass} value={editForm.address || ''} onChange={(e) => handleEditFieldChange('address', e.target.value)} />
                          </Field>
                        </div>
                        <Field label="Country">
                          <select className={inputClass} value={editForm.country || ''} onChange={(e) => { handleEditFieldChange('country', e.target.value); handleEditFieldChange('state', ''); handleEditFieldChange('lga', ''); loadContextStates(e.target.value); }}>
                            <option value="">Select country</option>
                            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </Field>
                        <Field label="State">
                          <select className={inputClass} value={editForm.state || ''} onChange={(e) => { handleEditFieldChange('state', e.target.value); handleEditFieldChange('lga', ''); loadContextLgas(e.target.value); }}>
                            <option value="">Select state</option>
                            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </Field>
                        <Field label="City / LGA">
                          <select className={inputClass} value={editForm.lga || ''} onChange={(e) => handleEditFieldChange('lga', e.target.value)}>
                            <option value="">Select LGA</option>
                            {lgas.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                          </select>
                        </Field>
                        <Field label="City">
                          <input className={inputClass} value={editForm.city || ''} onChange={(e) => handleEditFieldChange('city', e.target.value)} />
                        </Field>
                      </div>
                    ) : (
                      <InfoGrid items={[
                        { label: 'Email', value: detailTenant.email || '—' },
                        { label: 'Phone', value: detailTenant.phone || '—' },
                        { label: 'Phone 2', value: detailTenant.phone2 || '—' },
                        { label: 'Billing Email', value: detailTenant.billing_email || '—' },
                        { label: 'Address', value: detailTenant.address || '—' },
                        { label: 'Country', value: detailTenant.country_name || '—' },
                        { label: 'State', value: detailTenant.state_details?.name || '—' },
                        { label: 'LGA', value: detailTenant.lga_details?.name || '—' },
                        { label: 'City', value: detailTenant.city || '—' },
                      ]} />
                    )}
                  </Section>

                  {/* Facility Details */}
                  <Section title="Facility Details" icon={<Building2 className="w-4 h-4" />}>
                    {editMode ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Facility Type">
                          <select className={inputClass} value={editForm.facility_type || ''} onChange={(e) => handleEditFieldChange('facility_type', e.target.value)}>
                            <option value="">Select facility type</option>
                            {facilityTypes.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                          </select>
                        </Field>
                        <Field label="Bed Capacity">
                          <input type="number" className={inputClass} value={editForm.bed_capacity ?? ''} onChange={(e) => handleEditFieldChange('bed_capacity', e.target.value)} />
                        </Field>
                        <div className="sm:col-span-2">
                          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              checked={!!editForm.emergency_services}
                              onChange={(e) => handleEditFieldChange('emergency_services', e.target.checked)}
                              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="font-medium">Emergency Services Available</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <InfoGrid items={[
                        { label: 'Facility Type', value: detailTenant.facility_type_details?.name || '—' },
                        { label: 'Bed Capacity', value: detailTenant.bed_capacity ?? '—' },
                        { label: 'Emergency Services', value: detailTenant.emergency_services ? 'Yes' : 'No' },
                        { label: 'Established Date', value: detailTenant.established_date || '—' },
                      ]} />
                    )}
                  </Section>

                  {/* Subscription & Billing */}
                  <Section title="Subscription & Billing" icon={<CreditCard className="w-4 h-4" />}>
                    {editMode ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Subscription Plan">
                          <select className={inputClass} value={editForm.subscription_plan || ''} onChange={(e) => handleEditFieldChange('subscription_plan', e.target.value)}>
                            <option value="">Select plan</option>
                            {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </Field>
                        <Field label="Subscription Status">
                          <select className={inputClass} value={editForm.subscription_status || ''} onChange={(e) => handleEditFieldChange('subscription_status', e.target.value)}>
                            <option value="active">Active</option>
                            <option value="trial">Trial</option>
                            <option value="suspended">Suspended</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="expired">Expired</option>
                          </select>
                        </Field>
                        <Field label="Start Date">
                          <input type="date" className={inputClass} value={editForm.subscription_start_date || ''} onChange={(e) => handleEditFieldChange('subscription_start_date', e.target.value)} />
                        </Field>
                        <Field label="End Date">
                          <input type="date" className={inputClass} value={editForm.subscription_end_date || ''} onChange={(e) => handleEditFieldChange('subscription_end_date', e.target.value)} />
                        </Field>
                        <Field label="Monthly Fee">
                          <input type="number" step="0.01" className={inputClass} value={editForm.monthly_fee ?? ''} onChange={(e) => handleEditFieldChange('monthly_fee', e.target.value)} />
                        </Field>
                        <Field label="Payment Method">
                          <input className={inputClass} value={editForm.payment_method || ''} onChange={(e) => handleEditFieldChange('payment_method', e.target.value)} />
                        </Field>
                      </div>
                    ) : (
                      <InfoGrid items={[
                        { label: 'Plan', value: detailTenant.subscription_plan_details?.name || '—' },
                        { label: 'Monthly Fee', value: detailTenant.monthly_fee ? `₦${detailTenant.monthly_fee}` : '—' },
                        { label: 'Start Date', value: detailTenant.subscription_start_date || '—' },
                        { label: 'End Date', value: detailTenant.subscription_end_date || '—' },
                        { label: 'Payment Method', value: detailTenant.payment_method || '—' },
                        { label: 'Billing Email', value: detailTenant.billing_email || '—' },
                      ]} />
                    )}
                  </Section>

                  {/* NHIS */}
                  <Section title="NHIS Accreditation" icon={<ShieldCheck className="w-4 h-4" />}>
                    {editMode ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Accreditation Status">
                          <select className={inputClass} value={editForm.nhis_accreditation || ''} onChange={(e) => handleEditFieldChange('nhis_accreditation', e.target.value)}>
                            <option value="not_applied">Not Applied</option>
                            <option value="pending">Pending</option>
                            <option value="accredited">Accredited</option>
                            <option value="rejected">Rejected</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </Field>
                        <Field label="Provider ID">
                          <input className={inputClass} value={editForm.nhis_provider_id || ''} onChange={(e) => handleEditFieldChange('nhis_provider_id', e.target.value)} />
                        </Field>
                        <Field label="Accreditation Date">
                          <input type="date" className={inputClass} value={editForm.nhis_accreditation_date || ''} onChange={(e) => handleEditFieldChange('nhis_accreditation_date', e.target.value)} />
                        </Field>
                        <Field label="Expiry Date">
                          <input type="date" className={inputClass} value={editForm.nhis_expiry_date || ''} onChange={(e) => handleEditFieldChange('nhis_expiry_date', e.target.value)} />
                        </Field>
                      </div>
                    ) : (
                      <InfoGrid items={[
                        { label: 'Status', value: (detailTenant.nhis_accreditation || 'not_applied').replace(/_/g, ' ') },
                        { label: 'Provider ID', value: detailTenant.nhis_provider_id || '—' },
                        { label: 'Accreditation Date', value: detailTenant.nhis_accreditation_date || '—' },
                        { label: 'Expiry Date', value: detailTenant.nhis_expiry_date || '—' },
                      ]} />
                    )}
                  </Section>

                  {/* Metadata */}
                  <Section title="Metadata" icon={<Calendar className="w-4 h-4" />}>
                    <InfoGrid items={[
                      { label: 'Created At', value: detailTenant.created_at ? new Date(detailTenant.created_at).toLocaleString() : '—' },
                      { label: 'Updated At', value: detailTenant.updated_at ? new Date(detailTenant.updated_at).toLocaleString() : '—' },
                      { label: 'Active', value: detailTenant.is_active ? 'Yes' : 'No' },
                    ]} />
                  </Section>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
</div>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
      <span className="text-emerald-600">{icon}</span>
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-slate-700">{label}</label>
    {children}
  </div>
);

const InfoGrid = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {items.map((item) => (
      <div key={item.label} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
        <p className="text-sm font-medium text-slate-900 mt-0.5 break-words">{String(item.value ?? '—')}</p>
      </div>
    ))}
  </div>
);

export default TenantManagement;
