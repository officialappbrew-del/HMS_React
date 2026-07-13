import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  ClipboardList,
  CreditCard,
  History,
  Layers,
  Pill,
  ScrollText,
  Sparkles,
  Stethoscope,
  Users,
} from 'lucide-react';

const roleThemes = {
  admin: {
    accent: 'from-indigo-600 to-blue-600',
    chip: 'bg-indigo-50 text-indigo-700',
    border: 'border-indigo-200',
    title: 'Operations focus',
  },
  doctor: {
    accent: 'from-emerald-600 to-teal-600',
    chip: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-200',
    title: 'Clinical focus',
  },
  nurse: {
    accent: 'from-violet-600 to-fuchsia-600',
    chip: 'bg-violet-50 text-violet-700',
    border: 'border-violet-200',
    title: 'Care focus',
  },
  pharmacist: {
    accent: 'from-amber-600 to-orange-600',
    chip: 'bg-amber-50 text-amber-700',
    border: 'border-amber-200',
    title: 'Medication focus',
  },
};

const timeAgo = (value) => {
  if (!value) return '';
  const then = new Date(value);
  const diffMs = Date.now() - then.getTime();
  if (Number.isNaN(diffMs)) return '';
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
};

const auditActionStyles = {
  create: 'bg-emerald-50 text-emerald-700',
  update: 'bg-blue-50 text-blue-700',
  delete: 'bg-red-50 text-red-700',
  delete_patient: 'bg-red-50 text-red-700',
  login: 'bg-slate-100 text-slate-600',
  logout: 'bg-slate-100 text-slate-600',
};

const auditActionLabel = (action = '') =>
  action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const actionIconMap = {
  consultation: Stethoscope,
  emr: ScrollText,
  'my patients': Users,
  'vital signs': Activity,
  'ward rounds': Layers,
  'assigned patients': Users,
  pharmacy: Pill,
  inventory: CreditCard,
  prescriptions: ClipboardList,
  patients: Users,
  billing: CreditCard,
  staff: Users,
};

const RoleInsightPanel = ({
  role = 'admin',
  loading = false,
  error = null,
  data = null,
  canViewAuditLogs = false,
  auditDetail = false,
  auditLogs = [],
  auditLogsLoading = false,
  auditLogsError = null,
  onOpenActivityLog,
}) => {
  const panelRole = data?.role || role;
  const theme = roleThemes[panelRole] || roleThemes.admin;
  const summary = data?.summary || {};
  const alerts = data?.alerts || [];
  const tasks = data?.tasks || [];
  const quickActions = data?.quick_actions || [];

  const summaryItems = [
    { label: 'Patients', value: summary.patients ?? 0, icon: Users },
    { label: 'Waiting', value: summary.waiting_visits ?? 0, icon: Activity },
    { label: 'Prescriptions', value: summary.pending_prescriptions ?? 0, icon: Pill },
    { label: 'Overdue', value: summary.overdue_invoices ?? 0, icon: CreditCard },
  ];

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl border ${theme.border} bg-white p-4 shadow-sm`}>
        <div className={`rounded-xl bg-gradient-to-r ${theme.accent} p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/80">Role workspace</p>
              <h3 className="mt-1 text-lg font-semibold capitalize">{panelRole} panel</h3>
            </div>
            <div className="rounded-full bg-white/20 p-2">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-sm text-white/80">{theme.title} • prioritized actions for today</p>
          {summary.today && (
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/80">{new Date(summary.today).toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl bg-slate-50 p-2 text-center">
                <Icon className="mx-auto h-4 w-4 text-slate-500" />
                <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-slate-500">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Priority alerts</p>
            <h4 className="text-sm font-semibold text-slate-900">What needs attention</h4>
          </div>
          <div className={`rounded-full px-2 py-1 text-xs font-medium ${theme.chip}`}>
            Live
          </div>
        </div>

        {loading ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
            Loading role insights…
          </div>
        ) : error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : alerts.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
            No urgent items right now.
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {alerts.map((alert) => (
              <Link
                key={alert.id}
                to={alert.href || '/dashboard'}
                className="group block rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-slate-300 hover:bg-slate-100"
              >
                <div className="flex items-start gap-2">
                  {alert.type === 'critical' ? (
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-red-500" />
                  ) : (
                    <Bell className="mt-0.5 h-4 w-4 text-amber-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-slate-900">{alert.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{alert.message}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Today’s tasks</p>
            <h4 className="text-sm font-semibold text-slate-900">Role-specific queue</h4>
          </div>
          <div className="rounded-full bg-slate-100 p-2">
            <ClipboardList className="h-4 w-4 text-slate-600" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
              No tasks assigned right now.
            </div>
          ) : (
            tasks.map((task) => (
              <Link
                key={task.id}
                to={task.href || '/dashboard'}
                className="group block rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-slate-900">{task.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{task.description}</p>
                  </div>
                  <div className={`rounded-full px-2 py-1 text-[10px] font-semibold ${task.priority === 'high' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                    {task.priority}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quick actions</p>
            <h4 className="text-sm font-semibold text-slate-900">Jump straight in</h4>
          </div>
          <div className="rounded-full bg-slate-100 p-2">
            <Layers className="h-4 w-4 text-slate-600" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {quickActions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
              No shortcuts available.
            </div>
          ) : (
            quickActions.map((action) => {
              const ActionIcon = actionIconMap[action.title.toLowerCase()] || ArrowRight;
              return (
                <Link
                  key={action.href + action.title}
                  to={action.href}
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="flex items-center gap-2">
                    <ActionIcon className="h-4 w-4 text-slate-500" />
                    {action.title}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              );
            })
          )}
        </div>
      </div>

      {canViewAuditLogs && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Audit trail</p>
              <h4 className="text-sm font-semibold text-slate-900">Recent activity</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700">
                Restricted
              </span>
              <div className="rounded-full bg-slate-100 p-2">
                <History className="h-4 w-4 text-slate-600" />
              </div>
            </div>
          </div>

          {auditLogsLoading ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
              Loading audit log…
            </div>
          ) : auditLogsError ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {auditLogsError}
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
              No audit activity recorded yet.
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
              {auditLogs.map((log, index) => {
                const action = String(log.action || '').toLowerCase();
                const actionClass =
                  Object.keys(auditActionStyles).find((key) => action.startsWith(key)) ||
                  'login';
                const Style = auditActionStyles[actionClass];
                const actor = log.actor || log.user_username || log.user_email || 'system';
                const rawTitle = (log.title || auditActionLabel(action)).replace(/\s+/g, ' ').trim();
                const resource = log.resource_type ? log.resource_type.replace(/_/g, ' ').trim() : '';
                const resourceId = log.resource_id ? ` #${log.resource_id}` : '';
                const displayAction = resource && !rawTitle.toLowerCase().includes(resource.toLowerCase())
                  ? `${rawTitle} ${resource}${resourceId}`
                  : `${rawTitle}${resourceId}`;

                return (
                  <div
                    key={log.id}
                    className={`px-3 py-3 ${index > 0 ? 'border-t border-slate-200' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {displayAction}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-slate-500">
                          {timeAgo(log.timestamp)} • {actor}
                        </p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${Style}`}>
                        {auditActionLabel(action)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenActivityLog) onOpenActivityLog();
            }}
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-50"
          >
            <span className="flex items-center gap-2">
              <ScrollText className="h-4 w-4" />
              View more activity logs
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleInsightPanel;
