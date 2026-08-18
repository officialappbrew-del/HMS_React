import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, CreditCard, DollarSign,
  ArrowUpRight, ArrowDownRight, RefreshCw, Activity
} from 'lucide-react';
import { superAdminApi } from '../../utils/superAdminApi';

const PlatformAnalytics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await superAdminApi.getAnalytics();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const StatCard = ({ title, value, subValue, icon: Icon, color, trend, trendValue, onClick }) => (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`bg-white border border-[#E8E3DC] p-5 transition-all ${onClick ? 'cursor-pointer hover:border-[#008751] hover:shadow-md' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
          <p className="mt-1 text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">{value}</p>
          {subValue && <p className="text-xs text-[#5A5A5A] mt-0.5">{subValue}</p>}
          {trend && (
            <div className={`flex items-center mt-1 text-xs font-medium ${trend === 'up' ? 'text-[#2D7D46]' : 'text-[#C8553D]'}`}>
              {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 ${color} rounded flex items-center justify-center flex-shrink-0 ml-3`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-semibold text-[#1A1A1A]">Platform Analytics</h2>
          <p className="text-sm text-[#5A5A5A]">Real-time overview of your SmartCare HMS platform</p>
        </div>
        <button
          onClick={loadAnalytics}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D8D4CD] px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F7F5F2] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tenants"
          value={data?.total_tenants || 0}
          subValue={`${data?.active_tenants || 0} active`}
          icon={Building2}
          color="bg-[#008751]"
          trend="up"
          trendValue={`${data?.trial_tenants || 0} trial`}
          onClick={() => navigate('/tenants')}
        />
        <StatCard
          title="Total Users"
          value={data?.total_users || 0}
          subValue="Across all tenants"
          icon={Users}
          color="bg-[#C79A3D]"
          onClick={() => navigate('/users')}
        />
        <StatCard
          title="Total Patients"
          value={data?.total_patients || 0}
          subValue="Across all tenants"
          icon={Users}
          color="bg-[#6C9CB2]"
          onClick={() => navigate('/patients')}
        />
        <StatCard
          title="Active Subscriptions"
          value={data?.active_subscriptions || 0}
          subValue={`${data?.suspended_tenants || 0} suspended`}
          icon={CreditCard}
          color="bg-[#2D7D46]"
          onClick={() => navigate('/tenants')}
        />
        <StatCard
          title="Monthly Revenue"
          value={`₦${Number(data?.monthly_revenue || 0).toLocaleString()}`}
          subValue="Projected recurring"
          icon={DollarSign}
          color="bg-[#C87D3D]"
          trend="up"
          onClick={() => navigate('/tenants')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/tenants')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/tenants'); } }}
          className="bg-white border border-[#E8E3DC] rounded-lg p-5 cursor-pointer hover:border-[#008751] hover:shadow-md transition-all"
        >
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Tenants by Facility Type</h3>
          <div className="space-y-3">
            {(data?.tenants_by_facility_type || []).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-[#5A5A5A] capitalize">{item.facility_type__name || 'Unknown'}</span>
                <span className="text-sm font-medium text-[#1A1A1A]">{item.count}</span>
              </div>
            ))}
            {(!data?.tenants_by_facility_type || data.tenants_by_facility_type.length === 0) && (
              <p className="text-sm text-[#5A5A5A]">No data available</p>
            )}
          </div>
        </div>

        <div
          onClick={() => navigate('/tenants')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/tenants'); } }}
          className="bg-white border border-[#E8E3DC] rounded-lg p-5 cursor-pointer hover:border-[#008751] hover:shadow-md transition-all"
        >
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Tenants by State</h3>
          <div className="space-y-3">
            {(data?.tenants_by_state || []).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-[#5A5A5A]">{item.state__name || 'Unknown'}</span>
                <span className="text-sm font-medium text-[#1A1A1A]">{item.count}</span>
              </div>
            ))}
            {(!data?.tenants_by_state || data.tenants_by_state.length === 0) && (
              <p className="text-sm text-[#5A5A5A]">No data available</p>
            )}
          </div>
        </div>
      </div>

      <div
        onClick={() => navigate('/audit-logs')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/audit-logs'); } }}
        className="bg-white border border-[#E8E3DC] rounded-lg p-5 cursor-pointer hover:border-[#008751] hover:shadow-md transition-all"
      >
        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {(data?.recent_activity || [])
            .slice(0, 5) // Limit to 5 items
            .map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-[#E8E3DC] last:border-b-0">
                <div className="w-8 h-8 rounded-full bg-[#F6F2E7] flex items-center justify-center flex-shrink-0">
                  <Activity className="w-4 h-4 text-[#C79A3D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1A1A1A]">{activity.title || activity.action}</p>
                  <p className="text-xs text-[#5A5A5A]">
                    {activity.user_name || 'System'} &middot; {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          {(!data?.recent_activity || data.recent_activity.length === 0) && (
            <p className="text-sm text-[#5A5A5A]">No recent activity</p>
          )}
          {data?.recent_activity && data.recent_activity.length > 5 && (
            <div className="pt-2 text-center">
              <span className="text-xs text-[#5A5A5A]">
                Showing 5 of {data.recent_activity.length} activities
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;