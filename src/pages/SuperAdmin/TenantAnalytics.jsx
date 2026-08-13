import React, { useState, useEffect, useMemo } from 'react';
import {
  Server, Users, Database, HardDrive, RefreshCw,
  ArrowUpRight, ArrowDownRight, BarChart3, Activity, FileText, Archive
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { superAdminApi } from '../../utils/superAdminApi';

const formatGB = (gb = 0) => `${gb.toFixed(2)} GB`;

const TenantAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);
  const [sortBy, setSortBy] = useState('growth_rate');

  const loadAnalytics = async (d = days) => {
    setLoading(true);
    setError('');
    try {
      const result = await superAdminApi.getTenantAnalytics({ days: d });
      setData(result);
      setDays(d);
    } catch (err) {
      setError(err.message || 'Failed to load tenant analytics');
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    loadAnalytics(30);
  }, []);

  const sortedTenants = useMemo(() => {
    if (!data?.tenants) return [];
    const list = [...data.tenants];
    switch (sortBy) {
      case 'growth_rate':
        list.sort((a, b) => (b.growth?.growth_rate || 0) - (a.growth?.growth_rate || 0));
        break;
      case 'storage':
        list.sort((a, b) => (b.usage?.storage_used_gb || 0) - (a.usage?.storage_used_gb || 0));
        break;
      case 'patients':
        list.sort((a, b) => (b.growth?.total_patients || 0) - (a.growth?.total_patients || 0));
        break;
      case 'users':
        list.sort((a, b) => (b.growth?.total_users || 0) - (a.growth?.total_users || 0));
        break;
      case 'storage_util':
        list.sort((a, b) => (b.utilization?.storage || 0) - (a.utilization?.storage || 0));
        break;
      default:
        break;
    }
    return list;
  }, [data, sortBy]);

  // Top growth bar chart data
  const growthChartData = useMemo(() => {
    if (!data?.tenants) return [];
    return [...data.tenants]
      .filter(t => t.growth?.growth_rate || t.growth?.patients_this_month)
      .sort((a, b) => (b.growth?.patients_this_month || 0) - (a.growth?.patients_this_month || 0))
      .slice(0, 8)
      .map(t => ({
        name: t.tenant_name.length > 12 ? `${t.tenant_name.slice(0, 12)}...` : t.tenant_name,
        fullName: t.tenant_name,
        newPatients: t.growth?.patients_this_month || 0,
      }));
  }, [data]);

  // Storage utilization chart data
  const storageChartData = useMemo(() => {
    if (!data?.tenants) return [];
    return [...data.tenants]
      .sort((a, b) => (b.usage?.storage_used_gb || 0) - (a.usage?.storage_used_gb || 0))
      .slice(0, 8)
      .map(t => ({
        name: t.tenant_name.length > 12 ? `${t.tenant_name.slice(0, 12)}...` : t.tenant_name,
        fullName: t.tenant_name,
        storageGb: t.usage?.storage_used_gb || 0,
        maxGb: t.limits?.max_storage_gb || 0,
      }));
  }, [data]);

  // Daily trend chart - aggregate all tenants
  const trendChartData = useMemo(() => {
    if (!data?.tenants?.length) return [];
    const daysCount = data.days || 30;
    const result = [];
    for (let i = 0; i < daysCount; i++) {
      const dateKey = data.tenants[0]?.trend?.[i]?.date;
      const total = data.tenants.reduce((sum, t) => sum + (t.trend?.[i]?.count || 0), 0);
      result.push({
        date: dateKey ? new Date(dateKey).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Day ${i + 1}`,
        patients: total,
      });
    }
    return result;
  }, [data]);

  const summary = data?.summary || {};
  const platformLimits = data?.platform_limits || {};

  const renderStatCard = ({ title, value, sub, icon: Icon, color }) => (
    <div className="bg-white border border-[#E8E3DC] rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
          <p className="mt-1 text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">{value}</p>
          {sub && <p className="text-xs text-[#5A5A5A] mt-0.5">{sub}</p>}
        </div>
        <div className={`w-10 h-10 ${color} rounded flex items-center justify-center flex-shrink-0 ml-3`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  const growthBadge = (rate) => {
    if (rate > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <ArrowUpRight className="w-3 h-3" /> {rate.toFixed(1)}%
        </span>
      );
    }
    if (rate < 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-semibold">
          <ArrowDownRight className="w-3 h-3" /> {Math.abs(rate).toFixed(1)}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
        0.0%
      </span>
    );
  };

  const utilBar = (pct, maxPct = 100) => {
    const normalized = Math.min(100, pct);
    const color = normalized > 90 ? 'bg-rose-500' : normalized > 70 ? 'bg-amber-500' : 'bg-emerald-500';
    return (
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(100, (pct / (maxPct || 1)) * 100)}%` }} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#C79A3D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-4 text-sm text-[#C8553D]">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-display font-semibold text-[#1A1A1A]">Tenant Growth &amp; Resource Usage</h2>
          <p className="text-sm text-[#5A5A5A]">Which tenants are growing fastest and using the most data, resources and space</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => loadAnalytics(Number(e.target.value))}
            className="rounded-lg border border-[#D8D4CD] px-3 py-2 text-sm bg-white text-[#1A1A1A] focus:outline-none focus:border-[#C79A3D]"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={() => loadAnalytics(days)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D8D4CD] px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F7F5F2] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderStatCard({
          title: 'Total Tenants',
          value: summary.total_tenants || 0,
          sub: 'Active facilities',
          icon: Server,
          color: 'bg-[#008751]',
        })}
        {renderStatCard({
          title: 'Total Patients',
          value: Number(summary.total_patients || 0).toLocaleString(),
          sub: `of ${Number(platformLimits.max_patients || 0).toLocaleString()} plan capacity`,
          icon: Users,
          color: 'bg-[#6C9CB2]',
        })}
        {renderStatCard({
          title: 'Total Users',
          value: Number(summary.total_users || 0).toLocaleString(),
          sub: `of ${Number(platformLimits.max_users || 0).toLocaleString()} plan capacity`,
          icon: Database,
          color: 'bg-[#C79A3D]',
        })}
        {renderStatCard({
          title: 'Storage Used',
          value: formatGB(summary.total_storage_gb || 0),
          sub: `of ${platformLimits.max_storage_gb || 0} GB allocated`,
          icon: HardDrive,
          color: 'bg-[#C87D3D]',
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E8E3DC] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#1A1A1A]">New Patients per Tenant (Last {days} days)</h3>
              <p className="text-xs text-[#5A5A5A]">Registrations in the selected period</p>
            </div>
            <BarChart3 className="w-4 h-4 text-[#C79A3D]" />
          </div>
          {growthChartData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={growthChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DC" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={55} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [`${value} patients`, 'New this period']}
                  labelFormatter={(label) => label}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E3DC' }}
                />
                <Bar dataKey="newPatients" fill="#008751" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-[#5A5A5A] py-10 text-center">No patient data available</p>
          )}
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#1A1A1A]">Storage Used per Tenant</h3>
              <p className="text-xs text-[#5A5A5A]">Documents &amp; media in GB</p>
            </div>
            <HardDrive className="w-4 h-4 text-[#C87D3D]" />
          </div>
          {storageChartData.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={storageChartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DC" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-25} textAnchor="end" height={55} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value, name) => [name === 'maxGb' ? `${value} GB` : `${value} GB`, name === 'maxGb' ? 'Plan allowance' : 'Used']}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E3DC' }}
                />
                <Legend fontSize={11} />
                <Bar dataKey="storageGb" name="Used" fill="#C79A3D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-[#5A5A5A] py-10 text-center">No storage data available</p>
          )}
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white border border-[#E8E3DC] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Daily New Patient Registrations (Platform-wide)</h3>
            <p className="text-xs text-[#5A5A5A]">Aggregated across all tenants over the last {days} days</p>
          </div>
          <Activity className="w-4 h-4 text-[#008751]" />
        </div>
        {trendChartData.length ? (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E3DC" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                formatter={(value) => [`${value} patients`, 'Registrations']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E8E3DC' }}
              />
              <Line type="monotone" dataKey="patients" stroke="#008751" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-[#5A5A5A] py-10 text-center">No trend data available</p>
        )}
      </div>

      {/* Growth Ranking Table */}
      <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-[#E8E3DC]">
          <div>
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Tenant Growth &amp; Resource Ranking</h3>
            <p className="text-xs text-[#5A5A5A]">Sortable — click a column to reorder</p>
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#5A5A5A]">
              <FileText className="w-3.5 h-3.5" /> {summary.total_documents || 0} docs
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#5A5A5A]">
              <Archive className="w-3.5 h-3.5" /> {summary.total_backups || 0} backups
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E3DC] bg-[#F6F2E7]/60">
                <th className="px-5 py-3 text-left text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">Tenant</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">
                  <button onClick={() => setSortBy('patients')} className="hover:text-[#1A1A1A]">Patients</button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">
                  <button onClick={() => setSortBy('users')} className="hover:text-[#1A1A1A]">Users</button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">
                  <button onClick={() => setSortBy('growth_rate')} className="hover:text-[#1A1A1A]">Growth %</button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">
                  <button onClick={() => setSortBy('storage')} className="hover:text-[#1A1A1A]">Storage</button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">
                  <button onClick={() => setSortBy('storage_util')} className="hover:text-[#1A1A1A]">Storage Util</button>
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DC]">
              {sortedTenants.map((t) => (
                <tr key={t.tenant_id} className="hover:bg-[#F6F2E7]/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#F6F2E7] flex items-center justify-center flex-shrink-0">
                        <Server className="w-4 h-4 text-[#C79A3D]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#1A1A1A] truncate">{t.tenant_name}</p>
                        <p className="text-xs text-[#5A5A5A]">{t.plan_name || 'No plan'} · {t.subscription_status}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-medium text-[#1A1A1A]">{t.growth?.total_patients || 0}</td>
                  <td className="px-3 py-3 text-[#5A5A5A]">{t.growth?.total_users || 0}</td>
                  <td className="px-3 py-3">{growthBadge(t.growth?.growth_rate || 0)}</td>
                  <td className="px-3 py-3 text-[#5A5A5A]">{formatGB(t.usage?.storage_used_gb || 0)}</td>
                  <td className="px-3 py-3">
                    <span className="text-xs font-medium text-[#1A1A1A]">{t.utilization?.storage?.toFixed(1) || '0.0'}%</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="text-[10px] text-[#5A5A5A] mb-0.5">Users {t.utilization?.users?.toFixed(0) || 0}%</div>
                        {utilBar(t.utilization?.users || 0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] text-[#5A5A5A] mb-0.5">Storage {t.utilization?.storage?.toFixed(0) || 0}%</div>
                        {utilBar(t.utilization?.storage || 0)}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {!sortedTenants.length && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-[#5A5A5A]">No tenant data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TenantAnalytics;
