import React, { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, X, Loader2, AlertCircle,
  MessageSquare, User, Building2,
  Clock, CheckCircle, XCircle, Eye
} from 'lucide-react';
import { superAdminApi } from '../../utils/superAdminApi';
import AdminPagination from '../../components/AdminPagination';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [tenantFilter, setTenantFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolutionInput, setShowResolutionInput] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  const [formData, setFormData] = useState({
    tenant: '',
    subject: '',
    description: '',
    priority: 'medium',
    created_by_name: '',
    created_by_email: '',
    created_by_role: 'tenant_admin',
    assigned_to: '',
  });

  const loadTenants = async () => {
    try {
      const result = await superAdminApi.getTenants({ page_size: 100 });
      const items = Array.isArray(result) ? result : (result.results || result.tenants || []);
      setTenants(items);
    } catch {
      // silently fail
    }
  };

  const loadTickets = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: pageNum, page_size: pageSize };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (tenantFilter) params.tenant_id = tenantFilter;
      const result = await superAdminApi.getSupportTickets(params);
      const items = Array.isArray(result) ? result : (result.results || result.tickets || []);
      setTickets(items);
      setTotalCount(result.count || items.length);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  useEffect(() => {
    loadTickets(1);
  }, [search, statusFilter, priorityFilter, tenantFilter]);

  const handleViewDetail = async (ticket) => {
    setShowDetailModal(true);
    setSelectedTicket(ticket);
    setDetailLoading(true);
    setDetailError('');
    try {
      const result = await superAdminApi.getSupportTicket(ticket.id);
      setSelectedTicket(result);
    } catch (err) {
      setDetailError(err.message || 'Failed to load ticket details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedTicket) return;
    setUpdating(true);
    setDetailError('');
    try {
      const data = { status: newStatus };
      if (newStatus === 'resolved') {
        data.resolution_notes = resolutionNotes || '';
      }
      const result = await superAdminApi.updateSupportTicket(selectedTicket.id, data);
      setSelectedTicket(result);
      setTickets(prev => prev.map(t => t.id === result.id ? result : t));
      setShowResolutionInput(false);
      setResolutionNotes('');
    } catch (err) {
      setDetailError(err.message || 'Failed to update ticket');
    } finally {
      setUpdating(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');
    try {
      const result = await superAdminApi.createSupportTicket(formData);
      setTickets(prev => [result, ...prev]);
      setShowCreateModal(false);
      setFormData({
        tenant: '', subject: '', description: '', priority: 'medium',
        created_by_name: '', created_by_email: '', created_by_role: 'tenant_admin', assigned_to: '',
      });
      setCreateSuccess('Ticket created successfully');
      setTimeout(() => setCreateSuccess(''), 3000);
    } catch (err) {
      setCreateError(err.message || 'Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-slate-100 text-slate-700 border-slate-200',
      medium: 'bg-blue-50 text-blue-700 border-blue-200',
      high: 'bg-amber-50 text-amber-700 border-amber-200',
      critical: 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return styles[priority] || styles.medium;
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
      resolved: 'bg-slate-100 text-slate-700 border-slate-200',
      closed: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return styles[status] || styles.open;
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-semibold text-[#1A1A1A]">Support Tickets</h2>
          <p className="text-sm text-[#5A5A5A]">Manage tenant technical issues and support requests</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#008751] px-4 py-2 text-sm font-medium text-white hover:bg-[#006B40] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
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
            placeholder="Search tickets by subject, tenant..."
            className="w-full rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-40 rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-8 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full sm:w-40 rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-8 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors appearance-none"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <select
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            className="w-full sm:w-48 rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-8 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors appearance-none"
          >
            <option value="">All Tenants</option>
            {tenants.map(t => (
              <option key={t.public_id} value={t.public_id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E3DC] bg-[#F7F5F2]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Ticket</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DC]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#5A5A5A]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#C79A3D]" />
                      Loading tickets...
                    </div>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#5A5A5A]">No tickets found</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${ticket.priority === 'critical' ? 'bg-rose-100 text-rose-600' : ticket.priority === 'high' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1A1A1A]">{ticket.subject}</p>
                          <p className="text-xs text-[#5A5A5A] line-clamp-1">{ticket.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A] hidden md:table-cell">{ticket.tenant_name || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A] hidden sm:table-cell">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleViewDetail(ticket)}
                        className="p-1.5 rounded text-[#5A5A5A] hover:text-[#008751] hover:bg-[#E8F5EF] transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
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
          onPageChange={(p) => loadTickets(p)}
        />
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity" onClick={() => setShowCreateModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="sticky top-0 bg-[#F7F5F2] border-b border-[#E8E3DC] px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-display font-semibold text-[#1A1A1A]">Create Support Ticket</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded hover:bg-[#E8E3DC] transition-colors">
                  <X className="w-5 h-5 text-[#5A5A5A]" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                {createError && (
                  <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-3 text-sm text-[#C8553D]">{createError}</div>
                )}
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Tenant *</label>
                  <select
                    required
                    value={formData.tenant}
                    onChange={(e) => setFormData({ ...formData, tenant: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                  >
                    <option value="">Select tenant</option>
                    {tenants.map(t => (
                      <option key={t.public_id} value={t.public_id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Subject *</label>
                  <input type="text" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Description *</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="4" className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Priority *</label>
                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Creator Role</label>
                    <select value={formData.created_by_role} onChange={(e) => setFormData({ ...formData, created_by_role: e.target.value })} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded">
                      <option value="tenant_admin">Tenant Admin</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="doctor">Doctor</option>
                      <option value="nurse">Nurse</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Creator Name *</label>
                    <input type="text" required value={formData.created_by_name} onChange={(e) => setFormData({ ...formData, created_by_name: e.target.value })} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Creator Email *</label>
                    <input type="email" required value={formData.created_by_email} onChange={(e) => setFormData({ ...formData, created_by_email: e.target.value })} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E3DC]">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm font-medium text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors">Cancel</button>
                  <button type="submit" disabled={creating} className="px-4 py-2 text-sm font-medium bg-[#008751] text-white rounded hover:bg-[#006B40] transition-colors disabled:opacity-50">
                    {creating ? 'Creating...' : 'Create Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {showDetailModal && selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity" onClick={() => setShowDetailModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="sticky top-0 bg-[#F7F5F2] border-b border-[#E8E3DC] px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-display font-semibold text-[#1A1A1A]">Ticket Details</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-1.5 rounded hover:bg-[#E8E3DC] transition-colors">
                  <X className="w-5 h-5 text-[#5A5A5A]" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {detailError && (
                  <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-3 text-sm text-[#C8553D]">{detailError}</div>
                )}
                {detailLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-[#C79A3D]" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <h4 className="text-base font-semibold text-[#1A1A1A]">{selectedTicket.subject}</h4>
                      <div className="flex gap-2">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${getPriorityBadge(selectedTicket.priority)}`}>{selectedTicket.priority}</span>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${getStatusBadge(selectedTicket.status)}`}>{selectedTicket.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-[#5A5A5A]">
                        <Building2 className="w-4 h-4" />
                        {selectedTicket.tenant_name || 'Unknown Tenant'}
                      </div>
                      <div className="flex items-center gap-2 text-[#5A5A5A]">
                        <User className="w-4 h-4" />
                        {selectedTicket.created_by_name} ({selectedTicket.created_by_email})
                      </div>
                      <div className="flex items-center gap-2 text-[#5A5A5A]">
                        <Clock className="w-4 h-4" />
                        {new Date(selectedTicket.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white border border-[#E8E3DC] rounded-lg p-4">
                      <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap">{selectedTicket.description}</p>
                    </div>
                    {selectedTicket.resolution_notes && !showResolutionInput && (
                      <div className="bg-[#EAF3EE] border border-[#D0E3D8] rounded-lg p-4">
                        <p className="text-xs font-semibold text-[#2D7D46] mb-1">Resolution Notes</p>
                        <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap">{selectedTicket.resolution_notes}</p>
                      </div>
                    )}
                    {(showResolutionInput || (selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed')) && (
                      <div>
                        <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Resolution Notes</label>
                        <textarea
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          rows="3"
                          placeholder="Enter resolution notes..."
                          className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-[#E8E3DC]">
                      {selectedTicket.status === 'open' && (
                        <button onClick={() => handleUpdateStatus('in_progress')} disabled={updating} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
                          <Clock className="w-3.5 h-3.5" /> Start Progress
                        </button>
                      )}
                      {(selectedTicket.status === 'open' || selectedTicket.status === 'in_progress') && (
                        <button onClick={() => handleUpdateStatus('resolved')} disabled={updating} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#008751] text-white rounded hover:bg-[#006B40] transition-colors disabled:opacity-50">
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                        </button>
                      )}
                      {(selectedTicket.status === 'resolved' || selectedTicket.status === 'in_progress') && (
                        <button onClick={() => handleUpdateStatus('closed')} disabled={updating} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors disabled:opacity-50">
                          <XCircle className="w-3.5 h-3.5" /> Close Ticket
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
