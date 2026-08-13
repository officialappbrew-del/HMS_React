import React, { useState, useEffect } from 'react';
import { RefreshCw, Loader2, Search, Filter } from 'lucide-react';
import { superAdminApi } from '../../utils/superAdminApi';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [meta, setMeta] = useState({ next: false, previous: false, count: 0 });
  const [page, setPage] = useState(1);

  const loadLogs = async (pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: pageNum, page_size: 20 };
      if (search) params.search = search;
      if (actionFilter) params.action = actionFilter;
      const result = await superAdminApi.getAuditLogs(params);
      setLogs(parseListResponse(result));
      setMeta({
        next: !!result.next,
        previous: !!result.previous,
        count: result.count || 0,
      });
    } catch (err) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(1);
    setPage(1);
  }, [search, actionFilter]);

  const parseListResponse = (data) => {
    if (Array.isArray(data)) return data;
    return data?.results || data?.logs || data || [];
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: 'bg-[#E8F5EF] text-[#008751]',
      warning: 'bg-[#F5F0EA] text-[#C87D3D]',
      error: 'bg-[#F5EDEA] text-[#C8553D]',
      high: 'bg-[#F5EDEA] text-[#C8553D]',
      medium: 'bg-[#F5F0EA] text-[#C87D3D]',
      low: 'bg-[#F0EDE8] text-[#5A5A5A]',
    };
    return colors[severity?.toLowerCase()] || colors.info;
  };

return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-semibold text-[#1A1A1A]">Audit Logs</h2>
          <p className="text-sm text-[#5A5A5A]">Platform-wide activity and change tracking</p>
        </div>
        <button
          onClick={() => loadLogs(page)}
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
            placeholder="Search audit logs..."
            className="w-full rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-3.5 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full sm:w-48 rounded-lg border border-[#D8D4CD] bg-white py-2.5 pl-10 pr-8 text-sm text-[#1A1A1A] outline-none focus:border-[#008751] transition-colors appearance-none"
          >
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-4 text-sm text-[#C8553D]">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E3DC] bg-[#F7F5F2]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Resource</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DC]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-[#5A5A5A]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#C79A3D]" />
                      Loading audit logs...
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-[#5A5A5A]">No audit logs found</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium border rounded ${getSeverityColor(log.severity)}`}>
                        {log.action || 'unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#1A1A1A]">{log.user_name || log.actor || 'System'}</td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">{log.tenant_name || '-'}</td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">{log.resource_type || '-'} {log.resource_id ? `#${log.resource_id}` : ''}</td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {meta.count > 0 && (
          <div className="flex items-center justify-between border-t border-[#E8E3DC] px-4 py-3">
            <p className="text-xs text-[#5A5A5A]">Total: {meta.count} records</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setPage(p => p - 1); loadLogs(page - 1); }}
                disabled={!meta.previous}
                className="px-3 py-1.5 text-xs font-medium border border-[#D8D4CD] rounded hover:bg-[#F7F5F2] transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-[#5A5A5A]">Page {page}</span>
              <button
                onClick={() => { setPage(p => p + 1); loadLogs(page + 1); }}
                disabled={!meta.next}
                className="px-3 py-1.5 text-xs font-medium border border-[#D8D4CD] rounded hover:bg-[#F7F5F2] transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
