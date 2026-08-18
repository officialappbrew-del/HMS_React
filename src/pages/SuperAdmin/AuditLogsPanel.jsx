import React, { useState, useEffect } from 'react';
import {
  X, Loader2, Search, Filter, ChevronRight, AlertCircle,
  Clock, User, Building2, Activity, Globe, Server,
  Eye, FileText, Calendar, Mail, Phone, MapPin, 
  Hash, Shield, Zap, ArrowRight
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
      info: 'bg-blue-50 text-blue-700 border-blue-200',
      warning: 'bg-amber-50 text-amber-700 border-amber-200',
      error: 'bg-red-50 text-red-700 border-red-200',
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      low: 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return colors[severity?.toLowerCase()] || colors.info;
  };

  const getSeverityBadge = (severity) => {
    const configs = {
      info: { color: 'bg-blue-500', label: 'Info' },
      warning: { color: 'bg-amber-500', label: 'Warning' },
      error: { color: 'bg-red-500', label: 'Error' },
      high: { color: 'bg-red-500', label: 'High' },
      medium: { color: 'bg-amber-500', label: 'Medium' },
      low: { color: 'bg-gray-500', label: 'Low' },
    };
    return configs[severity?.toLowerCase()] || configs.info;
  };

  const getActionIcon = (action) => {
    const actionLower = (action || '').toLowerCase();
    if (actionLower.includes('create')) return <FileText className="w-3.5 h-3.5 text-emerald-600" />;
    if (actionLower.includes('delete')) return <X className="w-3.5 h-3.5 text-red-600" />;
    if (actionLower.includes('update') || actionLower.includes('edit')) return <Zap className="w-3.5 h-3.5 text-amber-600" />;
    if (actionLower.includes('login')) return <User className="w-3.5 h-3.5 text-blue-600" />;
    if (actionLower.includes('logout')) return <User className="w-3.5 h-3.5 text-gray-600" />;
    if (actionLower.includes('suspend')) return <Shield className="w-3.5 h-3.5 text-red-600" />;
    if (actionLower.includes('activate')) return <Shield className="w-3.5 h-3.5 text-emerald-600" />;
    return <Activity className="w-3.5 h-3.5 text-gray-500" />;
  };

  const formatJson = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const getActionColor = (action) => {
    const actionLower = (action || '').toLowerCase();
    if (actionLower.includes('create')) return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    if (actionLower.includes('delete')) return 'border-red-200 bg-red-50 text-red-700';
    if (actionLower.includes('update') || actionLower.includes('edit')) return 'border-amber-200 bg-amber-50 text-amber-700';
    if (actionLower.includes('login')) return 'border-blue-200 bg-blue-50 text-blue-700';
    return 'border-gray-200 bg-gray-50 text-gray-700';
  };

  const DetailItem = ({ icon: Icon, label, value, children }) => (
    <div className="flex items-center gap-2.5 p-2 rounded-md bg-gray-50/50 border border-gray-100">
      <div className="p-1.5 rounded-md bg-white border border-gray-200">
        <Icon className="w-3.5 h-3.5 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        {children || <p className="text-sm font-medium text-gray-900 leading-tight">{value || '-'}</p>}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {selectedLog ? (
        // Detailed View - Compact
        <>
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-gray-50/30">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onSelectLog(null)} 
                className="p-1.5 rounded-md hover:bg-white border border-gray-200 transition-colors text-gray-500 hover:text-gray-700"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Log Details</h3>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-md hover:bg-white border border-gray-200 transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Header Badges - Compact */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-md ${getSeverityColor(selectedLog.severity)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getSeverityBadge(selectedLog.severity).color}`} />
                {getSeverityBadge(selectedLog.severity).label}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold border rounded-md ${getActionColor(selectedLog.action)}`}>
                {getActionIcon(selectedLog.action)}
                {selectedLog.action || 'Unknown'}
              </span>
              {selectedLog.timestamp && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-gray-200 rounded-md bg-white text-gray-700">
                  <Clock className="w-3 h-3" />
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </span>
              )}
            </div>

            {/* Main Details Grid - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedLog.title && (
                <div className="md:col-span-2">
                  <DetailItem icon={FileText} label="Activity" value={selectedLog.title} />
                </div>
              )}
              
              {selectedLog.user_name && (
                <DetailItem icon={User} label="User">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900">{selectedLog.user_name}</span>
                    {selectedLog.user_id && (
                      <span className="text-[10px] text-gray-400 font-mono">#{selectedLog.user_id}</span>
                    )}
                  </div>
                </DetailItem>
              )}

              {selectedLog.tenant_name && (
                <DetailItem icon={Building2} label="Tenant">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900">{selectedLog.tenant_name}</span>
                    {selectedLog.tenant_id && (
                      <span className="text-[10px] text-gray-400 font-mono">#{selectedLog.tenant_id}</span>
                    )}
                  </div>
                </DetailItem>
              )}

              {selectedLog.resource_type && (
                <DetailItem icon={Server} label="Resource">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-900 capitalize">{selectedLog.resource_type}</span>
                    {selectedLog.resource_id && (
                      <span className="text-[10px] text-gray-400 font-mono">#{selectedLog.resource_id}</span>
                    )}
                  </div>
                </DetailItem>
              )}

              {selectedLog.ip_address && (
                <DetailItem icon={Globe} label="IP Address">
                  <span className="text-sm font-mono text-gray-900">{selectedLog.ip_address}</span>
                </DetailItem>
              )}

              {selectedLog.actor && (
                <DetailItem icon={User} label="Actor" value={selectedLog.actor} />
              )}
            </div>

            {/* Changes Section - Compact */}
            {(selectedLog.new_values || selectedLog.old_values) && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Changes
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {selectedLog.old_values && (
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-red-50 px-3 py-1.5 border-b border-red-100">
                        <p className="text-[10px] font-semibold text-red-700 uppercase tracking-wider">Previous</p>
                      </div>
                      <pre className="bg-white p-2.5 text-[10px] font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap max-h-36">
                        {formatJson(selectedLog.old_values)}
                      </pre>
                    </div>
                  )}
                  {selectedLog.new_values && (
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-emerald-50 px-3 py-1.5 border-b border-emerald-100">
                        <p className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">New</p>
                      </div>
                      <pre className="bg-white p-2.5 text-[10px] font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap max-h-36">
                        {formatJson(selectedLog.new_values)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        // List View - Compact
        <>
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-gray-50/30">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Activity Log</h3>
              <p className="text-[10px] text-gray-500">Monitor platform-wide actions</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-md hover:bg-white border border-gray-200 transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filters - Compact */}
          <div className="px-4 py-2.5 space-y-2 border-b border-gray-200 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-2.5 text-xs text-gray-900 outline-none focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-6 text-xs text-gray-900 outline-none focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all appearance-none"
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
          </div>

          {error && (
            <div className="mx-4 mt-3 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </div>
          )}

          {/* Logs List - Compact */}
          <div className="flex-1 overflow-y-auto bg-gray-50/30">
            {loading && logs.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Activity className="w-8 h-8 mb-1.5 opacity-30" />
                <p className="text-xs font-medium text-gray-500">No logs found</p>
              </div>
            ) : (
              <div className="p-2 space-y-1.5">
                {logs.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => onSelectLog(log)}
                    className="w-full text-left rounded-lg border border-gray-200 bg-white p-2.5 hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Icon - Smaller */}
                      <div className={`p-1.5 rounded-md border ${getSeverityColor(log.severity)} shrink-0`}>
                        {getActionIcon(log.action)}
                      </div>
                      
                      {/* Content - Compact */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold border rounded-full ${getSeverityColor(log.severity)}`}>
                            <span className={`w-1 h-1 rounded-full ${getSeverityBadge(log.severity).color}`} />
                            {getSeverityBadge(log.severity).label}
                          </span>
                          <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium border rounded-full ${getActionColor(log.action)}`}>
                            {log.action || 'Unknown'}
                          </span>
                          {log.timestamp && (
                            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {log.title || log.action || 'Activity recorded'}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[10px] text-gray-500">
                          {log.user_name && (
                            <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                              <User className="w-2.5 h-2.5" />
                              {log.user_name}
                            </span>
                          )}
                          {log.tenant_name && (
                            <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                              <Building2 className="w-2.5 h-2.5" />
                              {log.tenant_name}
                            </span>
                          )}
                          {log.resource_type && (
                            <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                              <Server className="w-2.5 h-2.5" />
                              {log.resource_type}
                            </span>
                          )}
                          {log.ip_address && (
                            <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 font-mono">
                              <Globe className="w-2.5 h-2.5" />
                              {log.ip_address}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors shrink-0 mt-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Load More - Compact */}
          {hasMore && !selectedLog && (
            <div className="px-4 py-2.5 border-t border-gray-200 bg-white">
              <button
                onClick={() => loadLogs(page + 1, false)}
                disabled={loading}
                className="w-full py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AuditLogsPanel;