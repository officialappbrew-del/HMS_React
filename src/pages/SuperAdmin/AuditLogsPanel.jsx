import React, { useState, useEffect } from 'react';
import {
  X, Loader2, Search, Filter, ChevronRight, AlertCircle,
  Clock, User, Building2, Activity, Globe, Server
} from 'lucide-react';
import { superAdminApi } from '../../utils/superAdminApi';

const AuditLogsPanel = ({ isOpen, onClose, onSelectLog, selectedLog }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadLogs = async (pageNum = 1, reset = true) => {
    setLoading(true);
    setError('');
    try {
      const params = { page: pageNum, page_size: 15 };
      if (search) params.search = search;
      if (actionFilter) params.action = actionFilter;
      const result = await superAdminApi.getAuditLogs(params);
      const items = Array.isArray(result) ? result : (result.results || result.logs || []);
      if (reset) {
        setLogs(items);
      } else {
        setLogs(prev => [...prev, ...items]);
      }
      setHasMore(!!(result.next || (result.results && items.length === 15)));
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLogs(1, true);
    }
  }, [isOpen, search, actionFilter]);

  const getSeverityColor = (severity) => {
    const colors = {
      info: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      warning: 'bg-amber-50 text-amber-700 border-amber-200',
      error: 'bg-rose-50 text-rose-700 border-rose-200',
      high: 'bg-rose-50 text-rose-700 border-rose-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      low: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return colors[severity?.toLowerCase()] || colors.info;
  };

  const getActionIcon = (action) => {
    const actionLower = (action || '').toLowerCase();
    if (actionLower.includes('create')) return <Activity className="w-3.5 h-3.5 text-emerald-600" />;
    if (actionLower.includes('delete')) return <X className="w-3.5 h-3.5 text-rose-600" />;
    if (actionLower.includes('update') || actionLower.includes('edit')) return <Filter className="w-3.5 h-3.5 text-amber-600" />;
    if (actionLower.includes('login')) return <User className="w-3.5 h-3.5 text-blue-600" />;
    return <Activity className="w-3.5 h-3.5 text-slate-500" />;
  };

  const formatJson = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full">
      {selectedLog ? (
        <>
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Log Details</h3>
              <p className="text-xs text-slate-500">Audit entry information</p>
            </div>
            <button onClick={() => onSelectLog(null)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="flex items-center gap-3">
              <span className={`inline-flex px-2.5 py-1 text-xs font-semibold border rounded-lg ${getSeverityColor(selectedLog.severity)}`}>
                {selectedLog.severity || 'info'}
              </span>
              <span className="inline-flex px-2.5 py-1 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-700">
                {selectedLog.action || 'unknown'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 mt-0.5">
                  <Activity className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Title</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedLog.title || selectedLog.action || 'Activity recorded'}</p>
                </div>
              </div>

              {selectedLog.user_name && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 mt-0.5">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">User</p>
                    <p className="text-sm font-medium text-slate-900">{selectedLog.user_name}</p>
                  </div>
                </div>
              )}

              {selectedLog.tenant_name && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 mt-0.5">
                    <Building2 className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Tenant</p>
                    <p className="text-sm font-medium text-slate-900">{selectedLog.tenant_name}</p>
                  </div>
                </div>
              )}

              {selectedLog.resource_type && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 mt-0.5">
                    <Server className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Resource</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedLog.resource_type}
                      {selectedLog.resource_id ? ` #${selectedLog.resource_id}` : ''}
                    </p>
                  </div>
                </div>
              )}

              {selectedLog.ip_address && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 mt-0.5">
                    <Globe className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">IP Address</p>
                    <p className="text-sm font-medium text-slate-900 font-mono">{selectedLog.ip_address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 mt-0.5">
                  <Clock className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Timestamp</p>
                  <p className="text-sm font-medium text-slate-900">
                    {selectedLog.timestamp ? new Date(selectedLog.timestamp).toLocaleString() : '-'}
                  </p>
                </div>
              </div>

              {selectedLog.actor && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 mt-0.5">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Actor</p>
                    <p className="text-sm font-medium text-slate-900">{selectedLog.actor}</p>
                  </div>
                </div>
              )}
            </div>

            {selectedLog.new_values && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">New Values</p>
                <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap">
                  {formatJson(selectedLog.new_values)}
                </pre>
              </div>
            )}

            {selectedLog.old_values && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Previous Values</p>
                <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap">
                  {formatJson(selectedLog.old_values)}
                </pre>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Activity Log</h3>
              <p className="text-xs text-slate-500">Platform-wide actions and changes</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-3 border-b border-slate-200 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search logs..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-8 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none"
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="suspend">Suspend</option>
                <option value="activate">Activate</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mx-4 mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {loading && logs.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Activity className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium">No audit logs found</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {logs.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => onSelectLog(log)}
                    className="w-full text-left rounded-xl border border-slate-100 bg-white p-4 hover:border-emerald-200 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border ${getSeverityColor(log.severity)}`}>
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold border rounded-md ${getSeverityColor(log.severity)}`}>
                            {log.action || 'unknown'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {log.title || log.action || 'Activity recorded'}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                          {log.user_name && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {log.user_name}
                            </span>
                          )}
                          {log.tenant_name && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {log.tenant_name}
                            </span>
                          )}
                          {log.resource_type && (
                            <span className="flex items-center gap-1">
                              <Server className="w-3 h-3" />
                              {log.resource_type}
                              {log.resource_id ? ` #${log.resource_id}` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0 mt-1" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {hasMore && !selectedLog && (
            <div className="p-4 border-t border-slate-200 bg-slate-50/50">
              <button
                onClick={() => loadLogs(page + 1, false)}
                disabled={loading}
                className="w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuditLogsPanel;
