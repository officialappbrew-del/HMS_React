import React, { useState, useEffect } from 'react';
import {
  Search, Filter, RefreshCw, CheckCircle, XCircle, Loader2
} from 'lucide-react';
import { superAdminApi } from '../../utils/superAdminApi';
import AdminPagination from '../../components/AdminPagination';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const loadUsers = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: pageNum, page_size: pageSize };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const result = await superAdminApi.getUsers(params);
      const items = parseListResponse(result);
      setUsers(items);
      setTotalCount(result.count || items.length);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, [search, roleFilter]);

  const [actionError, setActionError] = useState('');

  const handleToggle = async (tenantId, userId) => {
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    setActionError('');
    try {
      await superAdminApi.toggleUser(tenantId, userId);
      loadUsers(page);
    } catch (err) {
      setActionError(err.message || 'Action failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const parseListResponse = (data) => {
    if (Array.isArray(data)) return data;
    return data?.results || data?.users || data || [];
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]',
      doctor: 'bg-[#F5F0EA] text-[#C87D3D] border-[#E8D6D0]',
      nurse: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]',
      receptionist: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]',
      pharmacist: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]',
      lab_tech: 'bg-[#E8E3DC] text-[#5A5A5A] border-[#D8D4CD]',
      super_admin: 'bg-[#C79A3D]/10 text-[#B8860B] border-[#C79A3D]/30',
      system_admin: 'bg-[#C79A3D]/10 text-[#B8860B] border-[#C79A3D]/30',
    };
    return colors[role] || 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-semibold text-[#1A1A1A]">User Management</h2>
          <p className="text-sm text-[#5A5A5A]">Manage users across all tenants</p>
        </div>
        <button
          onClick={() => loadUsers(page)}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D8D4CD] px-4 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F7F5F2] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, username..."
            className="w-full rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-48 rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-8 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors appearance-none"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="receptionist">Receptionist</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="lab_tech">Lab Technician</option>
            <option value="super_admin">Super Admin</option>
            <option value="system_admin">System Admin</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-4 text-sm text-[#C8553D]">
          {error}
        </div>
      )}

      {actionError && (
        <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-4 text-sm text-[#C8553D]">
          {actionError}
        </div>
      )}

      <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E3DC] bg-[#F7F5F2]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DC]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#5A5A5A]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#C79A3D]" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#5A5A5A]">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={`${user.tenant_id}-${user.id}`} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{user.full_name || user.username}</p>
                        <p className="text-xs text-[#5A5A5A]">{user.employee_id || '-'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${getRoleBadge(user.role)}`}>
                        {user.role || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">{user.tenant_name || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${user.is_active ? 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' : 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleToggle(user.tenant_id, user.id)}
                        disabled={actionLoading[user.id]}
                        className="p-1.5 rounded text-[#5A5A5A] hover:text-[#008751] hover:bg-[#E8F5EF] transition-colors disabled:opacity-50"
                        title={user.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {actionLoading[user.id] ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : user.is_active ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
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
          onPageChange={(p) => loadUsers(p)}
        />
      </div>
    </div>
  );
};

export default UserManagement;
