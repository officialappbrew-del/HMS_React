import React, { useState, useEffect } from 'react';
import {
  Plus, Search, X, Loader2, AlertCircle, CheckCircle, Shield, Trash2
} from 'lucide-react';
import { superAdminApi } from '../../utils/superAdminApi';
import ConfirmModal from '../../components/ConfirmModal';
import AdminPagination from '../../components/AdminPagination';
import { useAdminPermissions, isSuperUser } from '../../hooks/useAdminPermissions';

const ROLE_HIERARCHY = {
  super_admin: 3,
  system_admin: 2,
  support: 1,
  auditor: 1,
};

const GlobalAdmins = () => {
  const permissions = useAdminPermissions();
  const currentRole = (localStorage.getItem('userRole') || '').toLowerCase();
  const currentUserLevel = ROLE_HIERARCHY[currentRole] || 0;
  const canCreateAdmins = permissions.canCreateTenants || isSuperUser();
  const canManagePermissions = permissions.canManageAdminPermissions || isSuperUser();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState('');
  const [editAdmin, setEditAdmin] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAdmin, setDeleteAdmin] = useState(null);

  const currentUserId = localStorage.getItem('userId');

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
  });

  const loadProfile = async () => {
    if (!currentUserId) return;
    setProfileLoading(true);
    setProfileError('');
    try {
      const data = await superAdminApi.getGlobalAdmin(currentUserId);
      setProfileData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        password: '',
      });
    } catch (err) {
      setProfileError(err.message || 'Failed to load profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const data = { ...profileData };
      if (!data.password) delete data.password;
      await superAdminApi.updateGlobalAdmin(currentUserId, data);
      setProfileSuccess('Profile updated successfully');
      setTimeout(() => {
        setShowProfileModal(false);
        setProfileSuccess('');
      }, 1500);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const openProfile = () => {
    loadProfile();
    setShowProfileModal(true);
  };

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'system_admin',
    employee_id: '',
    phone: '',
    password: '',
    is_active: true,
    can_create_tenants: false,
    can_suspend_tenants: false,
    can_delete_tenants: false,
    can_view_all_tenants: false,
    can_manage_admin_permissions: false,
    notes: '',
  });

  const loadAdmins = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const result = await superAdminApi.getGlobalAdmins();
      const items = Array.isArray(result) ? result : (result.results || result.admins || []);
      setAdmins(items);
      setTotalCount(result.count || items.length);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins(1);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');
    try {
      const result = await superAdminApi.createGlobalAdmin(formData);
      setAdmins(prev => [result, ...prev]);
      setShowCreateModal(false);
      setFormData({
        username: '', email: '', first_name: '', last_name: '',
        role: 'system_admin', employee_id: '', phone: '', password: '',
        is_active: true, can_create_tenants: false, can_suspend_tenants: false,
        can_delete_tenants: false, can_view_all_tenants: false,
        can_manage_admin_permissions: false, notes: '',
      });
      setCreateSuccess('Admin created successfully');
      setTimeout(() => setCreateSuccess(''), 3000);
    } catch (err) {
      setCreateError(err.message || 'Failed to create admin');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (admin) => {
    setEditAdmin(admin);
    setFormData({
      username: admin.username || '',
      email: admin.email || '',
      first_name: admin.first_name || '',
      last_name: admin.last_name || '',
      role: admin.role || 'system_admin',
      employee_id: admin.employee_id || '',
      phone: admin.phone || '',
      password: '',
      is_active: admin.is_active !== false,
      can_create_tenants: admin.can_create_tenants || false,
      can_suspend_tenants: admin.can_suspend_tenants || false,
      can_delete_tenants: admin.can_delete_tenants || false,
      can_view_all_tenants: admin.can_view_all_tenants || false,
      can_manage_admin_permissions: admin.can_manage_admin_permissions || false,
      notes: admin.notes || '',
    });
    setShowEditModal(true);
    setEditError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditing(true);
    setEditError('');
    try {
      const data = { ...formData };
      if (!data.password) delete data.password;
      const result = await superAdminApi.updateGlobalAdmin(editAdmin.id, data);
      setAdmins(prev => prev.map(a => a.id === result.id ? result : a));
      setShowEditModal(false);
      setEditAdmin(null);
    } catch (err) {
      setEditError(err.message || 'Failed to update admin');
    } finally {
      setEditing(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteAdmin) return;
    try {
      await superAdminApi.deleteGlobalAdmin(deleteAdmin.id);
      setAdmins(prev => prev.filter(a => a.id !== deleteAdmin.id));
      setShowDeleteModal(false);
      setDeleteAdmin(null);
    } catch (err) {
      setError(err.message || 'Failed to delete admin');
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const inputClass = "w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded";

  return (
    <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-display font-semibold text-[#1A1A1A]">Global Administrators</h2>
            <p className="text-sm text-[#5A5A5A]">Manage platform-wide admin accounts and permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openProfile}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D8D4CD] bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F7F5F2] transition-colors"
            >
              <Shield className="w-4 h-4" />
              My Profile
            </button>
            {canCreateAdmins && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#008751] px-4 py-2 text-sm font-medium text-white hover:bg-[#006B40] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Admin
            </button>
            )}
          </div>
        </div>

      {error && (
        <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-4 text-sm text-[#C8553D] flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {createSuccess && (
        <div className="rounded-lg border border-[#D0E3D8] bg-[#EAF3EE] p-4 text-sm text-[#2D7D46] flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {createSuccess}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search admins by name, email, username..."
            className="w-full rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E3DC] bg-[#F7F5F2]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Admin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">Permissions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DC]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-[#5A5A5A]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#C79A3D]" />
                      Loading admins...
                    </div>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-[#5A5A5A]">No admins found</td>
                </tr>
              ) : (
                admins.filter(admin => {
                  if (!search) return true;
                  const term = search.toLowerCase();
                  return (
                    (admin.first_name || '').toLowerCase().includes(term) ||
                    (admin.last_name || '').toLowerCase().includes(term) ||
                    (admin.email || '').toLowerCase().includes(term) ||
                    (admin.username || '').toLowerCase().includes(term)
                  );
                }).filter(admin => {
                  const adminLevel = ROLE_HIERARCHY[admin.role] || 0;
                  return adminLevel <= currentUserLevel;
                }).map((admin) => (
                  <tr key={admin.id} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F7F5F2] border border-[#E8E3DC] flex items-center justify-center text-[#5A5A5A]">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1A1A1A]">{admin.first_name} {admin.last_name}</p>
                          <p className="text-xs text-[#5A5A5A]">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A] hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 border border-slate-200 font-medium">
                        {admin.role_label || admin.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A] hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {admin.can_create_tenants && <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Create</span>}
                        {admin.can_suspend_tenants && <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">Suspend</span>}
                        {admin.can_delete_tenants && <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">Delete</span>}
                        {admin.can_view_all_tenants && <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">View All</span>}
                        {admin.can_manage_admin_permissions && <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">Manage Perms</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${admin.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {admin.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {(() => {
                          const adminLevel = ROLE_HIERARCHY[admin.role] || 0;
                          const canManage = currentUserLevel >= adminLevel;
                          const isSuperadminTarget = admin.is_superuser || admin.role === 'super_admin';
                          const canEditDelete = canManage && (!isSuperadminTarget || isSuperUser());
                          if (!canManage) return null;
                          return (
                            <>
                              {canEditDelete && (
                                <button
                                  onClick={() => handleEdit(admin)}
                                  className="p-1.5 rounded text-[#5A5A5A] hover:text-[#008751] hover:bg-[#E8F5EF] transition-colors"
                                  title="Edit admin"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                              )}
                              {canEditDelete && (
                                <button
                                  onClick={() => { setDeleteAdmin(admin); confirmDelete(); }}
                                  className="p-1.5 rounded text-[#5A5A5A] hover:text-[#C8553D] hover:bg-[#F5EDEA] transition-colors"
                                  title="Delete admin"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          );
                        })()}
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
          onPageChange={(p) => loadAdmins(p)}
        />
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity" onClick={() => setShowCreateModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="sticky top-0 bg-[#F7F5F2] border-b border-[#E8E3DC] px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-display font-semibold text-[#1A1A1A]">Create Global Admin</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded hover:bg-[#E8E3DC] transition-colors">
                  <X className="w-5 h-5 text-[#5A5A5A]" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                {createError && (
                  <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-3 text-sm text-[#C8553D]">{createError}</div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">First Name *</label>
                    <input type="text" required value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Last Name *</label>
                    <input type="text" required value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Username *</label>
                  <input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Role *</label>
                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className={inputClass}>
                      <option value="system_admin">System Admin</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="support">Support</option>
                      <option value="auditor">Auditor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Password *</label>
                    <input type="text" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={inputClass} placeholder="Set initial password" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Employee ID</label>
                    <input type="text" value={formData.employee_id} onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'can_create_tenants', label: 'Create Tenants' },
                      { key: 'can_suspend_tenants', label: 'Suspend Tenants' },
                      { key: 'can_delete_tenants', label: 'Delete Tenants' },
                      { key: 'can_view_all_tenants', label: 'View All Tenants' },
                    ].map(perm => (
                      <label key={perm.key} className="flex items-center gap-2 text-xs text-[#5A5A5A]">
                        <input
                          type="checkbox"
                          checked={formData[perm.key]}
                          onChange={(e) => setFormData({ ...formData, [perm.key]: e.target.checked })}
                          className="rounded border-[#D8D4CD] text-[#008751] focus:border-[#008751]"
                        />
                        {perm.label}
                      </label>
                    ))}
                    {canManagePermissions && (
                      <label className="flex items-center gap-2 text-xs text-[#5A5A5A] col-span-2">
                        <input
                          type="checkbox"
                          checked={formData.can_manage_admin_permissions}
                          onChange={(e) => setFormData({ ...formData, can_manage_admin_permissions: e.target.checked })}
                          className="rounded border-[#D8D4CD] text-[#008751] focus:border-[#008751]"
                        />
                        Manage Admin Permissions
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E3DC]">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm font-medium text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors">Cancel</button>
                  <button type="submit" disabled={creating} className="px-4 py-2 text-sm font-medium bg-[#008751] text-white rounded hover:bg-[#006B40] transition-colors disabled:opacity-50">
                    {creating ? 'Creating...' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && editAdmin && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity" onClick={() => setShowEditModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="sticky top-0 bg-[#F7F5F2] border-b border-[#E8E3DC] px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-display font-semibold text-[#1A1A1A]">Edit Global Admin</h3>
                <button onClick={() => setShowEditModal(false)} className="p-1.5 rounded hover:bg-[#E8E3DC] transition-colors">
                  <X className="w-5 h-5 text-[#5A5A5A]" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                {editError && (
                  <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-3 text-sm text-[#C8553D]">{editError}</div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">First Name *</label>
                    <input type="text" required value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Last Name *</label>
                    <input type="text" required value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Username *</label>
                  <input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Role *</label>
                    <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className={inputClass}>
                      <option value="system_admin">System Admin</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="support">Support</option>
                      <option value="auditor">Auditor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">New Password (optional)</label>
                    <input type="text" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={inputClass} placeholder="Leave blank to keep current" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Employee ID</label>
                    <input type="text" value={formData.employee_id} onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'can_create_tenants', label: 'Create Tenants' },
                      { key: 'can_suspend_tenants', label: 'Suspend Tenants' },
                      { key: 'can_delete_tenants', label: 'Delete Tenants' },
                      { key: 'can_view_all_tenants', label: 'View All Tenants' },
                    ].map(perm => (
                      <label key={perm.key} className="flex items-center gap-2 text-xs text-[#5A5A5A]">
                        <input
                          type="checkbox"
                          checked={formData[perm.key]}
                          onChange={(e) => setFormData({ ...formData, [perm.key]: e.target.checked })}
                          className="rounded border-[#D8D4CD] text-[#008751] focus:border-[#008751]"
                        />
                        {perm.label}
                      </label>
                    ))}
                    {canManagePermissions && (
                      <label className="flex items-center gap-2 text-xs text-[#5A5A5A] col-span-2">
                        <input
                          type="checkbox"
                          checked={formData.can_manage_admin_permissions}
                          onChange={(e) => setFormData({ ...formData, can_manage_admin_permissions: e.target.checked })}
                          className="rounded border-[#D8D4CD] text-[#008751] focus:border-[#008751]"
                        />
                        Manage Admin Permissions
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E3DC]">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors">Cancel</button>
                  <button type="submit" disabled={editing} className="px-4 py-2 text-sm font-medium bg-[#008751] text-white rounded hover:bg-[#006B40] transition-colors disabled:opacity-50">
                    {editing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeleteAdmin(null); }}
        onConfirm={handleDelete}
        title="Delete Admin"
        message={`Are you sure you want to delete ${deleteAdmin?.first_name} ${deleteAdmin?.last_name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />

      {/* My Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity" onClick={() => setShowProfileModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="sticky top-0 bg-[#F7F5F2] border-b border-[#E8E3DC] px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-display font-semibold text-[#1A1A1A]">My Profile</h3>
                <button onClick={() => setShowProfileModal(false)} className="p-1.5 rounded hover:bg-[#E8E3DC] transition-colors">
                  <X className="w-5 h-5 text-[#5A5A5A]" />
                </button>
              </div>
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                {profileError && (
                  <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-3 text-sm text-[#C8553D]">{profileError}</div>
                )}
                {profileSuccess && (
                  <div className="rounded-lg border border-[#D0E3D8] bg-[#EAF3EE] p-3 text-sm text-[#2D7D46]">{profileSuccess}</div>
                )}
                {profileLoading && (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#5A5A5A]">
                    <Loader2 className="w-5 h-5 animate-spin text-[#C79A3D]" />
                    Loading profile...
                  </div>
                )}
                {!profileLoading && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#5A5A5A] mb-1">First Name *</label>
                        <input type="text" required value={profileData.first_name} onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Last Name *</label>
                        <input type="text" required value={profileData.last_name} onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Email *</label>
                      <input type="email" required value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Phone</label>
                      <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">New Password (optional)</label>
                      <input type="text" value={profileData.password} onChange={(e) => setProfileData({ ...profileData, password: e.target.value })} className={inputClass} placeholder="Leave blank to keep current" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E3DC]">
                      <button type="button" onClick={() => setShowProfileModal(false)} className="px-4 py-2 text-sm font-medium text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors">Cancel</button>
                      <button type="submit" disabled={profileLoading} className="px-4 py-2 text-sm font-medium bg-[#008751] text-white rounded hover:bg-[#006B40] transition-colors disabled:opacity-50">
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalAdmins;
