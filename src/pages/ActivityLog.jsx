import { useSelector } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  AlertCircle,
  Pill,
  FileText,
  Clock,
  Search,
  Filter,
  Calendar,
  UserPlus,
  Trash2,
  LogIn,
  LogOut,
  Activity,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { apiRequest } from '../utils/api';

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Visual mapping for audit-log actions coming from the backend.
const auditActionMeta = {
  create_patient: { icon: UserPlus, color: 'bg-green-100 text-green-600', severity: 'info', title: 'Patient Created' },
  create:         { icon: UserPlus, color: 'bg-green-100 text-green-600', severity: 'info', title: 'Record Created' },
  update_patient: { icon: FileText, color: 'bg-purple-100 text-purple-600', severity: 'info', title: 'Patient Updated' },
  update:         { icon: FileText, color: 'bg-purple-100 text-purple-600', severity: 'info', title: 'Record Updated' },
  delete_patient: { icon: Trash2, color: 'bg-red-100 text-red-600', severity: 'urgent', title: 'Patient Deleted' },
  delete:         { icon: Trash2, color: 'bg-red-100 text-red-600', severity: 'urgent', title: 'Record Deleted' },
  login:          { icon: LogIn, color: 'bg-blue-100 text-blue-600', severity: 'info', title: 'User Login' },
  logout:         { icon: LogOut, color: 'bg-slate-100 text-slate-600', severity: 'info', title: 'User Logout' },
};

const resolveAuditMeta = (action) => {
  if (auditActionMeta[action]) return auditActionMeta[action];
  const prefix = Object.keys(auditActionMeta).find(
    (k) => k !== 'create' && k !== 'update' && k !== 'delete' && action.startsWith(k)
  ) || Object.keys(auditActionMeta).find((k) => action.startsWith(k));
  return auditActionMeta[prefix] || {
    icon: Activity,
    color: 'bg-blue-100 text-blue-600',
    severity: 'info',
    title: capitalize(action.replace(/_/g, ' ')),
  };
};

// Turn a raw User-Agent string into a readable "Browser on OS (device)" label.
const parseUserAgent = (ua = '') => {
  if (!ua) return '';
  let browser = 'Browser';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = 'Chrome';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Safari\//.test(ua) && /Version\//.test(ua)) browser = 'Safari';
  else if (/MSIE |Trident\//.test(ua)) browser = 'Internet Explorer';

  let os = '';
  if (/Windows NT 10/.test(ua)) os = 'Windows 10/11';
  else if (/Windows NT/.test(ua)) os = 'Windows';
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad/.test(ua)) os = 'iOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  const mobile = /Mobile|Android|iPhone|iPad/.test(ua);
  return [browser, os, mobile ? '(mobile)' : ''].filter(Boolean).join(' ');
};

// Pull a display name out of an audit value snapshot (new_values / old_values).
const pickName = (vals) => {
  if (!vals || typeof vals !== 'object') return '';
  if (vals.full_name) return String(vals.full_name);
  const f = vals.first_name || '';
  const l = vals.last_name || '';
  return [f, l].filter(Boolean).join(' ').trim();
};

// Field names that differ between old and new snapshots (or all keys on create/delete).
// Computed/read-only keys are dropped so only meaningful edits are shown.
const COMPUTED_KEYS = ['full_name', 'age_display', 'waiting_time', 'is_past_due', 'file_size_display', 'created_at', 'updated_at', 'id', 'pk', 'tenant'];
const computeChanges = (oldV, newV) => {
  let keys;
  if (newV && !oldV) keys = Object.keys(newV);
  else if (oldV && !newV) keys = Object.keys(oldV);
  else if (oldV && newV) {
    keys = Object.keys(newV).filter((k) => JSON.stringify(newV[k]) !== JSON.stringify(oldV[k]));
  } else {
    keys = [];
  }
  return keys.filter((k) => !COMPUTED_KEYS.includes(k) && k !== 'password');
};

// Convert a backend AuditLog entry into the activity shape used by this page.
// Prefers the server-provided title/severity/actor (single source of truth)
// and enriches it with patient name, hospital number, device and change summary.
const normalizeAuditLog = (log) => {
  const action = String(log.action || '').toLowerCase();
  const meta = resolveAuditMeta(action);
  const userFullName = typeof log.user_full_name === 'string' ? log.user_full_name.trim() : '';
  const rawActor = typeof log.actor === 'string' ? log.actor.trim() : '';
  const actor =
    userFullName ||
    rawActor ||
    log.user_username ||
    log.user_email ||
    'Unknown user';
  const title = log.title || meta.title;
  const severity = log.severity || meta.severity;
  const resourceLabel = log.resource_type ? log.resource_type.replace(/_/g, ' ') : 'record';
  const resourceId = log.resource_id ? ` #${log.resource_id}` : '';

  const oldV = log.old_values;
  const newV = log.new_values;
  let patientName = pickName(newV) || pickName(oldV);
  if (!patientName && log.resource_type === 'patient' && log.resource_id) {
    patientName = `Patient ${resourceId}`;
  }
  const hospitalNumber =
    (newV && newV.hospital_number) || (oldV && oldV.hospital_number) || '';
  const device = parseUserAgent(log.user_agent);
  const changes = computeChanges(oldV, newV);

  const detailsBits = [
    actor ? `By ${actor}` : null,
    log.ip_address ? `IP ${log.ip_address}` : null,
    device || null,
  ].filter(Boolean);

  const description = patientName
    ? `${title}: ${patientName}${resourceId}`
    : `${capitalize(action)} ${resourceLabel}${resourceId}`;

  return {
    id: `audit-${log.id}`,
    type: action,
    title,
    description,
    patientName,
    hospitalNumber,
    device,
    ipAddress: log.ip_address || '—',
    changes,
    actorName: actor,
    details: detailsBits.join(' • '),
    timestamp: log.timestamp,
    icon: meta.icon,
    color: meta.color,
    severity,
    isAudit: true,
    isVerified: log.is_verified !== undefined ? Boolean(log.is_verified) : true,
  };
};

const typeLabels = {
  all: 'All Activities',
  patient_registration: 'Patient Registration',
  patient_updated: 'Patient Updated',
  drug_dispensed: 'Drug Dispensed',
  low_stock: 'Low Stock Alert',
  expiring_drug: 'Expiring Drugs',
  create_patient: 'Patient Created',
  create: 'Record Created',
  update_patient: 'Patient Updated',
  update: 'Record Updated',
  delete_patient: 'Patient Deleted',
  delete: 'Record Deleted',
  login: 'User Login',
  logout: 'User Logout',
};

// Activity types that belong to the "Patients" quick-filter card.
const PATIENT_TYPES = [
  'patient_registration',
  'patient_updated',
  'create_patient',
  'update_patient',
  'update',
  'delete_patient',
  'delete',
];

const Spinner = () => (
  <div className="flex items-center justify-center p-12">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
  </div>
);

const SEVERITY_COLOR = { urgent: '#dc2626', warning: '#f59e0b', info: '#3b82f6' };

// Compact labelled data cell used to spread an activity's key facts across the card.
const DataCell = ({ label, value }) => (
  <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5">
    <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
    <p className="truncate text-xs font-semibold text-gray-700" title={value}>
      {value || '—'}
    </p>
  </div>
);

const ActivityLog = ({ onBack }) => {
  const { patients } = useSelector((state) => state.patient || { patients: [] });
  const { drugs, salesHistory } = useSelector((state) => state.pharmacy || { drugs: [], salesHistory: [] });

  const AUDIT_PAGE_SIZE = 7;

  const [localActivities, setLocalActivities] = useState([]);

  // Server-paginated audit trail (mirrors PatientManagement's patient table).
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditNext, setAuditNext] = useState(null);
  const [auditPrevious, setAuditPrevious] = useState(null);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [paging, setPaging] = useState(false);
  const [auditError, setAuditError] = useState(null);

  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [tablePage, setTablePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleCopyActorName = async (name) => {
    if (!name || typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(name);
    } catch (error) {
      // Clipboard may be unavailable in some browsers, ignore silently.
    }
  };

  // Build the local, module-derived activity feed (patients / pharmacy).
  useEffect(() => {
    const allActivities = [
      ...patients.map((p) => ({
        id: p.id,
        type: 'patient_registration',
        title: 'Patient Registered',
        description: `${p.name} registered as a new patient`,
        details: `NIN: ${p.nin}, Phone: ${p.phone}, State: ${p.state}`,
        timestamp: p.createdAt,
        icon: Users,
        color: 'bg-blue-100 text-blue-600',
        severity: 'info',
      })),

      ...drugs
        .filter((d) => d.quantityInStock <= d.reorderLevel)
        .map((d) => ({
          id: `drug-${d.id}`,
          type: 'low_stock',
          title: 'Low Stock Alert',
          description: `${d.name} is running low on stock`,
          details: `Current stock: ${d.quantityInStock} units, Reorder level: ${d.reorderLevel}`,
          timestamp: new Date().toISOString(),
          icon: AlertCircle,
          color: 'bg-red-100 text-red-600',
          severity: 'urgent',
        })),

      ...drugs
        .filter((d) => {
          const expiryDate = new Date(d.expiryDate);
          const today = new Date();
          const daysToExpiry = (expiryDate - today) / (1000 * 60 * 60 * 24);
          return daysToExpiry > 0 && daysToExpiry <= 30;
        })
        .map((d) => ({
          id: `expiry-${d.id}`,
          type: 'expiring_drug',
          title: 'Drug Expiring Soon',
          description: `${d.name} will expire soon`,
          details: `Expiry Date: ${new Date(d.expiryDate).toLocaleDateString('en-NG')}`,
          timestamp: new Date().toISOString(),
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-600',
          severity: 'warning',
        })),

      ...salesHistory.map((sale) => ({
        id: sale.id,
        type: 'drug_dispensed',
        title: 'Drug Dispensed',
        description: `${sale.drugName} dispensed to patient`,
        details: `Quantity: ${sale.quantity} units, Amount: ₦${(sale.totalPrice || 0).toLocaleString('en-NG')}`,
        timestamp: sale.timestamp,
        icon: Pill,
        color: 'bg-green-100 text-green-600',
        severity: 'info',
      })),

      ...patients
        .filter((p) => p.updatedAt && p.updatedAt !== p.createdAt)
        .map((p) => ({
          id: `update-${p.id}`,
          type: 'patient_updated',
          title: 'Patient Record Updated',
          description: `${p.name}'s record was updated`,
          details: `Last updated: ${new Date(p.updatedAt).toLocaleDateString('en-NG')}`,
          timestamp: p.updatedAt,
          icon: FileText,
          color: 'bg-purple-100 text-purple-600',
          severity: 'info',
        })),
    ];

    allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setLocalActivities(allActivities);
  }, [patients, drugs, salesHistory]);

  const buildAuditUrl = (page = 1) => {
    const params = new URLSearchParams();
    params.append('page_size', String(AUDIT_PAGE_SIZE));
    params.append('page', String(page));
    return `/api/v1/core/audit-logs/?${params.toString()}`;
  };

  // Paginated, server-driven fetch of the audit trail (same UX as PatientManagement).
  const loadAuditLogs = async (page = 1, { silent = false } = {}) => {
    try {
      if (silent) setPaging(true);
      else setInitialLoading(true);
      setAuditError(null);

      const data = await apiRequest(buildAuditUrl(page));
      const results = data?.results || [];

      setAuditLogs(results);
      setAuditNext(data?.next || null);
      setAuditPrevious(data?.previous || null);
      setAuditTotal(data?.count ?? results.length);
      setAuditPage(page);
    } catch (err) {
      // Audit access is restricted to admin-level roles; degrade gracefully.
      setAuditError(err.message || 'Unable to load audit trail');
      setAuditLogs([]);
    } finally {
      setInitialLoading(false);
      setPaging(false);
    }
  };

  useEffect(() => {
    loadAuditLogs(1);
  }, []);

  const applyFilters = (actList, search, type) => {
    let filtered = actList;

    if (type && type !== 'all') {
      if (type === 'audit') {
        filtered = filtered.filter((a) => a.isAudit);
      } else if (type === 'alerts') {
        filtered = filtered.filter((a) => a.severity !== 'info');
      } else if (type === 'patients') {
        filtered = filtered.filter((a) => PATIENT_TYPES.includes(a.type));
      } else if (type === 'drugs') {
        filtered = filtered.filter((a) => a.type === 'drug_dispensed');
      } else {
        filtered = filtered.filter((a) => a.type === type);
      }
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(searchLower) ||
          a.description.toLowerCase().includes(searchLower) ||
          (a.details || '').toLowerCase().includes(searchLower)
      );
    }

    setTablePage(1);
    setFilteredActivities(filtered);
  };

  // Merge local + (current page of) audit activities, then apply active filters.
  useEffect(() => {
    const normalized = auditLogs.map(normalizeAuditLog);
    const merged = [...localActivities, ...normalized].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    setActivities(merged);
    applyFilters(merged, searchTerm, filterType);
  }, [localActivities, auditLogs, searchTerm, filterType]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(activities, value, filterType);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterType(value);
    applyFilters(activities, searchTerm, value);
  };

  const handlePageChange = (page) => {
    if (page < 1) return;
    loadAuditLogs(page, { silent: true });
  };

  const activityTypes = useMemo(() => {
    const present = Array.from(new Set(activities.map((a) => a.type)));
    const preferred = [
      'patient_registration',
      'patient_updated',
      'create_patient',
      'update_patient',
      'update',
      'delete_patient',
      'delete',
      'drug_dispensed',
      'low_stock',
      'expiring_drug',
      'login',
      'logout',
    ].filter((t) => present.includes(t));
    const extra = present.filter((t) => !preferred.includes(t));

    return [
      { value: 'all', label: 'All Activities' },
      { value: 'audit', label: 'Audit Events' },
      { value: 'patients', label: 'Patients' },
      { value: 'drugs', label: 'Drugs Dispensed' },
      { value: 'alerts', label: 'Alerts' },
      ...preferred.map((t) => ({ value: t, label: typeLabels[t] || capitalize(t.replace(/_/g, ' ')) })),
      ...extra.map((t) => ({ value: t, label: capitalize(t.replace(/_/g, ' ')) })),
    ];
  }, [activities]);

  const getSeverityBadge = (severity) => {
    const badges = {
      urgent: 'bg-red-100 text-red-800 border border-red-300',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      info: 'bg-blue-100 text-blue-800 border border-blue-300',
    };
    return badges[severity] || badges.info;
  };

  const totalActivities = auditTotal + localActivities.length;
  const alertCount = activities.filter((a) => a.severity !== 'info').length;
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / AUDIT_PAGE_SIZE));
  const pageStartIndex = (tablePage - 1) * AUDIT_PAGE_SIZE;
  const pageEndIndex = pageStartIndex + AUDIT_PAGE_SIZE;
  const pageActivities = filteredActivities.slice(pageStartIndex, pageEndIndex);

  // Counts activities that a given quick-filter token would show, so each
  // card's number always matches the rows revealed when it is clicked.
  const countForToken = (token) => {
    if (!token || token === 'all') return activities.length;
    if (token === 'audit') return activities.filter((a) => a.isAudit).length;
    if (token === 'alerts') return activities.filter((a) => a.severity !== 'info').length;
    if (token === 'patients') return activities.filter((a) => PATIENT_TYPES.includes(a.type)).length;
    if (token === 'drugs') return activities.filter((a) => a.type === 'drug_dispensed').length;
    return activities.filter((a) => a.type === token).length;
  };

  // Clickable quick-filter cards. Selecting one sets the same `filterType`
  // token the dropdown uses, so they stay in sync; clicking again clears it.
  const statCards = [
    { key: 'all', token: 'all', label: 'Total Activities', value: countForToken('all'), base: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600', ring: 'ring-2 ring-blue-400' },
    { key: 'audit', token: 'audit', label: 'Audit Events', value: countForToken('audit'), base: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-600', ring: 'ring-2 ring-emerald-400' },
    { key: 'patients', token: 'patients', label: 'Registered Patients', value: countForToken('patients'), base: 'from-green-50 to-green-100 border-green-200 text-green-600', ring: 'ring-2 ring-green-400' },
    { key: 'drugs', token: 'drugs', label: 'Drugs Dispensed', value: countForToken('drugs'), base: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600', ring: 'ring-2 ring-purple-400' },
    { key: 'alerts', token: 'alerts', label: 'Alerts', value: countForToken('alerts'), base: 'from-red-50 to-red-100 border-red-200 text-red-600', ring: 'ring-2 ring-red-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </button>
            ) : null}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-slate-700" />
                Activity Log
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Track all system activities and events</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm border border-slate-200">
            Use the filters above to narrow results, then page through activity records below.
          </div>
        </div>

        {auditError && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
            Audit trail unavailable ({auditError}). Showing local activity only.
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Search Activities
              </label>
              <input
                type="text"
                placeholder="Search by name, patient, drug, user..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Activity Type
              </label>
              <select
                value={filterType}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {activityTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {statCards.map((card) => {
            const active = filterType === card.token;
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => setFilterType(active ? 'all' : card.token)}
                aria-pressed={active}
                className={`text-left bg-gradient-to-br ${card.base} rounded-xl p-4 border transition hover:shadow-md focus:outline-none focus:ring-2 ${
                  active ? `${card.ring} shadow-md` : ''
                }`}
              >
                <p className="text-xs sm:text-sm opacity-80">{card.label}</p>
                <p className="text-2xl sm:text-3xl font-bold">{card.value}</p>
                {active && (
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide opacity-70">
                    Filtered ✕
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-x-auto">
          {initialLoading && activities.length === 0 ? (
            <div className="p-12">
              <Spinner />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No activities found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Activity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Performed by</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">IP Address</th>
                  <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {pageActivities.map((activity) => {
                  const Icon = activity.icon || Activity;
                  const time = new Date(activity.timestamp).toLocaleDateString('en-NG', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const typeLabel = typeLabels[activity.type] || capitalize(activity.type.replace(/_/g, ' '));

                  return (
                    <tr key={activity.id} className="hover:bg-slate-50 transition-colors">
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{time}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`${activity.color} rounded-xl p-2`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{activity.title}</p>
                            <p className="text-xs text-slate-500 truncate">{activity.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{typeLabel}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{activity.patientName || '—'}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                        <button
                          type="button"
                          onClick={() => handleCopyActorName(activity.actorName)}
                          title="Click to copy actor"
                          className="font-medium text-slate-900 hover:text-slate-700 focus:outline-none"
                        >
                          {activity.actorName || 'Unknown user'}
                        </button>
                      </td>
                      <td
                        className="hidden lg:table-cell whitespace-nowrap px-4 py-4 text-sm text-slate-600"
                        title={activity.ipAddress || 'No IP available'}
                      >
                        {activity.ipAddress || '—'}
                      </td>
                      <td className="hidden xl:table-cell whitespace-nowrap px-4 py-4 text-sm text-slate-600">{activity.device || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            {filteredActivities.length > 0
              ? `Showing ${pageActivities.length} of ${filteredActivities.length} activities — page ${tablePage} of ${totalPages}`
              : ''}
            {auditTotal > 0 && !auditError ? (
              <span className="ml-2 text-gray-400">
                • Audit page {auditPage} of {Math.max(1, Math.ceil(auditTotal / AUDIT_PAGE_SIZE))}
              </span>
            ) : null}
          </p>

          <div className="flex items-center gap-2">
            {paging && <SpinnerInline />}
            <button
              type="button"
              disabled={tablePage <= 1}
              onClick={() => setTablePage((prev) => Math.max(prev - 1, 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              disabled={tablePage >= totalPages}
              onClick={() => setTablePage((prev) => Math.min(prev + 1, totalPages))}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small inline spinner used next to the pagination controls while paging.
const SpinnerInline = () => (
  <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
);

export default ActivityLog;
