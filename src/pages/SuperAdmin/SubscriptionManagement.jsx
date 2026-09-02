import React, { useState, useEffect } from 'react';
import {
  CreditCard, Plus, Edit2, Trash2, X,
  Users, UserPlus, HardDrive, Mail, MessageSquare,
  DollarSign, TrendingUp, Activity, CheckCircle,
  AlertTriangle, Eye
} from 'lucide-react';
import { superAdminApi } from '../../utils/superAdminApi';

const SubscriptionManagement = () => {
  const [analytics, setAnalytics] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [actionError, setActionError] = useState('');

  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');
  const [upgradeSuccess, setUpgradeSuccess] = useState('');

  const [tenants, setTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [subscriptionAddOns, setSubscriptionAddOns] = useState({
    email_service: false,
    sms_service: false,
  });

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    price_monthly: '',
    price_quarterly: '',
    price_yearly: '',
    currency: 'NGN',
    max_users: 5,
    max_patients: 1000,
    max_storage_gb: 10,
    max_api_calls_per_day: 10000,
    email_limit_monthly: 1000,
    sms_limit_monthly: 500,
    email_service_cost_monthly: 0,
    sms_service_cost_monthly: 0,
    service_providers: {},
    trial_period_days: 30,
    is_trial_available: true,
    is_default: false,
    is_active: true,
    display_order: 0,
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsRes, plansRes] = await Promise.all([
        superAdminApi.getSubscriptionAnalytics(),
        superAdminApi.getSubscriptionPlans(),
      ]);
      setAnalytics(analyticsRes);
      setPlans(parseListResponse(plansRes));
    } catch (err) {
      setError(err.message || 'Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const parseListResponse = (data) => {
    if (Array.isArray(data)) return data;
    return data?.results || data?.plans || data || [];
  };

  const handleCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      price_monthly: '',
      price_quarterly: '',
      price_yearly: '',
      currency: 'NGN',
      max_users: 5,
      max_patients: 1000,
      max_storage_gb: 10,
      max_api_calls_per_day: 10000,
      email_limit_monthly: 1000,
      sms_limit_monthly: 500,
      email_service_cost_monthly: 0,
      sms_service_cost_monthly: 0,
      service_providers: {},
      trial_period_days: 30,
      is_trial_available: true,
      is_default: false,
      is_active: true,
      display_order: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      code: plan.code || '',
      description: plan.description || '',
      price_monthly: plan.price_monthly || '',
      price_quarterly: plan.price_quarterly || '',
      price_yearly: plan.price_yearly || '',
      currency: plan.currency || 'NGN',
      max_users: plan.max_users || 5,
      max_patients: plan.max_patients || 1000,
      max_storage_gb: plan.max_storage_gb || 10,
      max_api_calls_per_day: plan.max_api_calls_per_day || 10000,
      email_limit_monthly: plan.email_limit_monthly || 1000,
      sms_limit_monthly: plan.sms_limit_monthly || 500,
      email_service_cost_monthly: plan.email_service_cost_monthly || 0,
      sms_service_cost_monthly: plan.sms_service_cost_monthly || 0,
      service_providers: plan.service_providers || {},
      trial_period_days: plan.trial_period_days || 30,
      is_trial_available: plan.is_trial_available ?? true,
      is_default: plan.is_default || false,
      is_active: plan.is_active ?? true,
      display_order: plan.display_order || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription plan?')) return;
    try {
      await superAdminApi.deleteSubscriptionPlan(id);
      loadData();
    } catch (err) {
      setActionError(err.message || 'Failed to delete plan');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await superAdminApi.setDefaultPlan(id);
      loadData();
    } catch (err) {
      setActionError(err.message || 'Failed to set default plan');
    }
  };

  const openSubscriptionDetails = async (tenant) => {
    setSelectedTenant(tenant);
    setShowSubscriptionModal(true);
    setUpgradeError('');
    setUpgradeSuccess('');
    try {
      const details = await superAdminApi.getTenantSubscription(tenant.public_id);
      setSubscriptionDetails(details);
      setSubscriptionAddOns({
        email_service: Boolean(details?.tenant?.include_email_service),
        sms_service: Boolean(details?.tenant?.include_sms_service),
      });
    } catch (err) {
      setUpgradeError(err.message || 'Failed to load subscription details');
    }
  };

  const handleUpgradeSubscription = async (e) => {
    e.preventDefault();
    if (!selectedTenant) return;
    setUpgrading(true);
    setUpgradeError('');
    setUpgradeSuccess('');
    try {
      const newPlanId = document.getElementById('upgrade-plan-select').value;
      const selectedPlan = subscriptionDetails?.available_plans?.find(plan => String(plan.id) === String(newPlanId));
      const checkout = await superAdminApi.checkoutSubscription({
        tenant_id: selectedTenant.public_id,
        subscription_plan: newPlanId,
        billing_period: 'monthly',
        email_service: Boolean(subscriptionAddOns.email_service && selectedPlan?.email_service_cost_monthly > 0),
        sms_service: Boolean(subscriptionAddOns.sms_service && selectedPlan?.sms_service_cost_monthly > 0),
      });
      window.location.assign(checkout.authorization_url);
    } catch (err) {
      setUpgradeError(err.message || 'Failed to update subscription');
    } finally {
      setUpgrading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      const payload = {
        ...formData,
        price_monthly: parseFloat(formData.price_monthly) || 0,
        price_quarterly: parseFloat(formData.price_quarterly) || 0,
        price_yearly: parseFloat(formData.price_yearly) || 0,
        max_users: parseInt(formData.max_users) || 0,
        max_patients: parseInt(formData.max_patients) || 0,
        max_storage_gb: parseInt(formData.max_storage_gb) || 0,
        max_api_calls_per_day: parseInt(formData.max_api_calls_per_day) || 0,
        email_limit_monthly: parseInt(formData.email_limit_monthly) || 0,
        sms_limit_monthly: parseInt(formData.sms_limit_monthly) || 0,
        email_service_cost_monthly: parseFloat(formData.email_service_cost_monthly) || 0,
        sms_service_cost_monthly: parseFloat(formData.sms_service_cost_monthly) || 0,
      };

      if (editingPlan) {
        await superAdminApi.updateSubscriptionPlan(editingPlan.id, payload);
      } else {
        await superAdminApi.createSubscriptionPlan(payload);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setSaveError(err.message || 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const loadTenants = async () => {
    try {
      const data = await superAdminApi.getTenants({ page_size: 100 });
      setTenants(parseListResponse(data));
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const handleViewTenantSubscription = () => {
    if (!selectedTenantId) return;
    const tenant = tenants.find(t => String(t.public_id) === String(selectedTenantId));
    if (tenant) {
      openSubscriptionDetails(tenant);
    }
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
    <div className="space-y-6">
      {actionError && (
        <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-4 text-sm text-[#C8553D]">
          {actionError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-semibold text-[#1A1A1A]">Subscription Management</h2>
          <p className="text-sm text-[#5A5A5A]">Manage plans, limits, and third-party service costs</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            className="px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
          >
            <option value="">Select tenant...</option>
            {tenants.map((tenant) => (
              <option key={tenant.public_id} value={tenant.public_id}>
                {tenant.name} ({tenant.subscription_status})
              </option>
            ))}
          </select>
          <button
            onClick={handleViewTenantSubscription}
            disabled={!selectedTenantId}
            className="inline-flex items-center gap-2 rounded-lg bg-[#C79A3D] px-4 py-2 text-sm font-medium text-white hover:bg-[#B8860B] transition-colors disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-[#008751] px-4 py-2 text-sm font-medium text-white hover:bg-[#006B40] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </button>
        </div>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E8E3DC] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Total Plans</p>
                <p className="mt-1 text-2xl font-display font-bold text-[#1A1A1A]">{analytics.total_plans}</p>
              </div>
              <div className="w-10 h-10 bg-[#C79A3D] rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#E8E3DC] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Monthly Revenue</p>
                <p className="mt-1 text-2xl font-display font-bold text-[#1A1A1A]">₦{analytics.total_monthly_revenue?.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-[#2D7D46] rounded flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#E8E3DC] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Active Tenants</p>
                <p className="mt-1 text-2xl font-display font-bold text-[#1A1A1A]">{analytics.total_tenants_on_plans}</p>
              </div>
              <div className="w-10 h-10 bg-[#008751] rounded flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#E8E3DC] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Yearly Revenue</p>
                <p className="mt-1 text-2xl font-display font-bold text-[#1A1A1A]">₦{analytics.total_yearly_revenue?.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-[#C87D3D] rounded flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#E8E3DC] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E3DC] bg-[#F7F5F2]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Pricing</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Limits</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Services</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Tenants</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[#5A5A5A] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DC]">
              {plans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-[#5A5A5A]">No subscription plans found</td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-[#F7F5F2] transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[#1A1A1A]">{plan.name}</p>
                        <p className="text-xs text-[#5A5A5A]">{plan.code}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {plan.is_default && (
                            <span className="inline-flex px-1.5 py-0.5 text-[10px] font-medium bg-[#C79A3D]/10 text-[#B8860B] border border-[#C79A3D]/30 rounded">Default</span>
                              )}
                          <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium border rounded ${plan.is_active ? 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' : 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]'}`}>
                            {plan.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">
                      <div>₦{plan.price_monthly}/mo</div>
                      <div>₦{plan.price_quarterly}/qtr</div>
                      <div>₦{plan.price_yearly}/yr</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">
                      <div className="flex items-center gap-1"><Users className="w-3 h-3" /> {plan.max_users} users</div>
                      <div className="flex items-center gap-1"><UserPlus className="w-3 h-3" /> {plan.max_patients} patients</div>
                      <div className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> {plan.max_storage_gb} GB</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {plan.email_limit_monthly}/mo
                        {plan.email_service_cost_monthly > 0 && <span className="text-[#C79A3D]">(₦{plan.email_service_cost_monthly})</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {plan.sms_limit_monthly}/mo
                        {plan.sms_service_cost_monthly > 0 && <span className="text-[#C79A3D]">(₦{plan.sms_service_cost_monthly})</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5A5A5A]">
                      <div>{plan.tenant_count} total</div>
                      <div>{plan.active_count} active</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="p-1.5 rounded text-[#5A5A5A] hover:text-[#008751] hover:bg-[#E8F5EF] transition-colors"
                          title="Edit plan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {!plan.is_default && (
                          <button
                            onClick={() => handleSetDefault(plan.id)}
                            className="p-1.5 rounded text-[#5A5A5A] hover:text-[#C79A3D] hover:bg-[#C79A3D]/10 transition-colors"
                            title="Set as default"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="p-1.5 rounded text-[#5A5A5A] hover:text-[#C8553D] hover:bg-[#F5EDEA] transition-colors"
                          title="Delete plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity" onClick={() => setShowModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="sticky top-0 bg-[#F7F5F2] border-b border-[#E8E3DC] px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-lg font-display font-semibold text-[#1A1A1A]">
                  {editingPlan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded hover:bg-[#E8E3DC] transition-colors">
                  <X className="w-5 h-5 text-[#5A5A5A]" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {saveError && (
                  <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-3 text-sm text-[#C8553D]">
                    {saveError}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Plan Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => updateForm('name', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Code *</label>
                    <input type="text" required value={formData.code} onChange={(e) => updateForm('code', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Description</label>
                    <textarea value={formData.description} onChange={(e) => updateForm('description', e.target.value)} rows="2" className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Pricing</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Monthly (₦) *</label>
                      <input type="number" step="0.01" required value={formData.price_monthly} onChange={(e) => updateForm('price_monthly', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Quarterly (₦)</label>
                      <input type="number" step="0.01" value={formData.price_quarterly} onChange={(e) => updateForm('price_quarterly', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Yearly (₦)</label>
                      <input type="number" step="0.01" value={formData.price_yearly} onChange={(e) => updateForm('price_yearly', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Currency</label>
                      <select value={formData.currency} onChange={(e) => updateForm('currency', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded">
                        <option value="NGN">NGN</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Limits</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Max Users</label>
                      <input type="number" value={formData.max_users} onChange={(e) => updateForm('max_users', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Max Patients</label>
                      <input type="number" value={formData.max_patients} onChange={(e) => updateForm('max_patients', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Max Storage (GB)</label>
                      <input type="number" value={formData.max_storage_gb} onChange={(e) => updateForm('max_storage_gb', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Email Service</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Monthly Email Limit</label>
                      <input type="number" value={formData.email_limit_monthly} onChange={(e) => updateForm('email_limit_monthly', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Email Service Cost/Month (₦)</label>
                      <input type="number" step="0.01" value={formData.email_service_cost_monthly} onChange={(e) => updateForm('email_service_cost_monthly', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Email Provider</label>
                      <input type="text" value={formData.service_providers?.email || ''} onChange={(e) => updateForm('service_providers', { ...formData.service_providers, email: e.target.value })} placeholder="e.g. sendgrid" className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">SMS Service</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Monthly SMS Limit</label>
                      <input type="number" value={formData.sms_limit_monthly} onChange={(e) => updateForm('sms_limit_monthly', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">SMS Service Cost/Month (₦)</label>
                      <input type="number" step="0.01" value={formData.sms_service_cost_monthly} onChange={(e) => updateForm('sms_service_cost_monthly', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A5A5A] mb-1">SMS Provider</label>
                      <input type="text" value={formData.service_providers?.sms || ''} onChange={(e) => updateForm('service_providers', { ...formData.service_providers, sms: e.target.value })} placeholder="e.g. twilio" className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Trial Period (Days)</label>
                    <input type="number" value={formData.trial_period_days} onChange={(e) => updateForm('trial_period_days', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Display Order</label>
                    <input type="number" value={formData.display_order} onChange={(e) => updateForm('display_order', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded" />
                  </div>
                  <div className="flex items-center gap-4 pt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.is_trial_available} onChange={(e) => updateForm('is_trial_available', e.target.checked)} className="rounded border-[#D8D4CD] text-[#008751] focus:ring-[#008751]" />
                      <span className="text-sm text-[#5A5A5A]">Trial Available</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.is_default} onChange={(e) => updateForm('is_default', e.target.checked)} className="rounded border-[#D8D4CD] text-[#008751] focus:ring-[#008751]" />
                      <span className="text-sm text-[#5A5A5A]">Default</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.is_active} onChange={(e) => updateForm('is_active', e.target.checked)} className="rounded border-[#D8D4CD] text-[#008751] focus:ring-[#008751]" />
                      <span className="text-sm text-[#5A5A5A]">Active</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-[#E8E3DC]">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors">Cancel</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium bg-[#008751] text-white rounded hover:bg-[#006B40] transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showSubscriptionModal && selectedTenant && subscriptionDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity" onClick={() => setShowSubscriptionModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="sticky top-0 bg-[#F7F5F2] border-b border-[#E8E3DC] px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-lg font-display font-semibold text-[#1A1A1A]">Subscription Details</h3>
                  <p className="text-sm text-[#5A5A5A]">{selectedTenant.name}</p>
                </div>
                <button onClick={() => setShowSubscriptionModal(false)} className="p-1.5 rounded hover:bg-[#E8E3DC] transition-colors">
                  <X className="w-5 h-5 text-[#5A5A5A]" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {upgradeError && (
                  <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-3 text-sm text-[#C8553D]">{upgradeError}</div>
                )}
                {upgradeSuccess && (
                  <div className="rounded-lg border border-[#D0E3D8] bg-[#EAF3EE] p-3 text-sm text-[#2D7D46]">{upgradeSuccess}</div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-[#E8E3DC] p-4 rounded">
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</p>
                    <span className={`inline-flex mt-1 px-2 py-0.5 text-xs font-semibold border rounded-lg ${subscriptionDetails.tenant.subscription_status === 'active' ? 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' : 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]'}`}>
                      {subscriptionDetails.tenant.subscription_status || 'unknown'}
                    </span>
                  </div>
                  <div className="bg-white border border-[#E8E3DC] p-4 rounded">
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Days Remaining</p>
                    <p className="mt-1 text-sm font-bold text-[#1A1A1A]">
                      {subscriptionDetails.tenant.days_remaining !== null ? `${subscriptionDetails.tenant.days_remaining} days` : '—'}
                    </p>
                  </div>
                  <div className="bg-white border border-[#E8E3DC] p-4 rounded">
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Start Date</p>
                    <p className="mt-1 text-sm font-bold text-[#1A1A1A]">
                      {subscriptionDetails.tenant.subscription_start_date || '—'}
                    </p>
                  </div>
                  <div className="bg-white border border-[#E8E3DC] p-4 rounded">
                    <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">End Date</p>
                    <p className="mt-1 text-sm font-bold text-[#1A1A1A]">
                      {subscriptionDetails.tenant.subscription_end_date || '—'}
                    </p>
                  </div>
                </div>

                {subscriptionDetails.tenant.is_subscription_expiring_soon && (
                  <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#C87D3D] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-[#C87D3D]">Subscription Expiring Soon</p>
                      <p className="text-xs text-[#5A5A5A] mt-1">This tenant's subscription expires in {subscriptionDetails.tenant.days_remaining} days. Please renew or upgrade to avoid service interruption.</p>
                    </div>
                  </div>
                )}

                <div className="bg-white border border-[#E8E3DC] rounded p-4">
                  <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Included Services</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg border border-[#E8E3DC] bg-[#F7F5F2] p-3">
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Email Service</p>
                      <p className="mt-1 font-medium text-[#1A1A1A]">
                        {subscriptionDetails.tenant.include_email_service ? `Enabled (₦${subscriptionDetails.tenant.email_service_cost || 0})` : 'Disabled'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#E8E3DC] bg-[#F7F5F2] p-3">
                      <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">SMS Service</p>
                      <p className="mt-1 font-medium text-[#1A1A1A]">
                        {subscriptionDetails.tenant.include_sms_service ? `Enabled (₦${subscriptionDetails.tenant.sms_service_cost || 0})` : 'Disabled'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#E8E3DC] rounded p-4">
                  <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Upgrade / Downgrade Plan</h4>
                  <form onSubmit={handleUpgradeSubscription} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select id="upgrade-plan-select" className="flex-1 px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded">
                        {subscriptionDetails.available_plans.map((plan) => (
                          <option key={plan.id} value={plan.id} selected={plan.id === subscriptionDetails.tenant.subscription_plan}>
                            {plan.name} - ₦{plan.price_monthly}/mo
                          </option>
                        ))}
                      </select>
                      <button type="submit" disabled={upgrading} className="px-4 py-2 text-sm font-medium bg-[#008751] text-white rounded hover:bg-[#006B40] transition-colors disabled:opacity-50">
                        {upgrading ? 'Updating...' : 'Update Plan'}
                      </button>
                    </div>

                    {(() => {
                      const planId = document.getElementById('upgrade-plan-select')?.value || subscriptionDetails.tenant.subscription_plan;
                      const selectedPlan = subscriptionDetails.available_plans.find((plan) => String(plan.id) === String(planId));

                      return (selectedPlan?.email_service_cost_monthly > 0 || selectedPlan?.sms_service_cost_monthly > 0) && (
                        <div className="space-y-2 rounded-lg border border-[#E8E3DC] bg-[#F7F5F2] p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Optional add-ons</p>
                          {selectedPlan?.email_service_cost_monthly > 0 && (
                            <label className="flex items-center justify-between gap-3 text-sm text-[#1A1A1A]">
                              <span>Email service</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#5A5A5A]">₦{selectedPlan.email_service_cost_monthly}/mo</span>
                                <input
                                  type="checkbox"
                                  checked={subscriptionAddOns.email_service}
                                  onChange={(e) => setSubscriptionAddOns(prev => ({ ...prev, email_service: e.target.checked }))}
                                  className="h-4 w-4 rounded border-[#D8D4CD] text-[#008751] focus:ring-[#008751]"
                                />
                              </div>
                            </label>
                          )}
                          {selectedPlan?.sms_service_cost_monthly > 0 && (
                            <label className="flex items-center justify-between gap-3 text-sm text-[#1A1A1A]">
                              <span>SMS service</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#5A5A5A]">₦{selectedPlan.sms_service_cost_monthly}/mo</span>
                                <input
                                  type="checkbox"
                                  checked={subscriptionAddOns.sms_service}
                                  onChange={(e) => setSubscriptionAddOns(prev => ({ ...prev, sms_service: e.target.checked }))}
                                  className="h-4 w-4 rounded border-[#D8D4CD] text-[#008751] focus:ring-[#008751]"
                                />
                              </div>
                            </label>
                          )}
                        </div>
                      );
                    })()}
                  </form>
                  <p className="text-[10px] text-[#5A5A5A] mt-2">Remaining days will be prorated and added to the new plan.</p>
                </div>

                <div className="bg-white border border-[#E8E3DC] rounded p-4">
                  <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Expiry Notifications</h4>
                  {subscriptionDetails.notifications.length === 0 ? (
                    <p className="text-xs text-[#5A5A5A]">No notifications sent yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {subscriptionDetails.notifications.map((notification) => (
                        <div key={notification.id} className="flex items-center justify-between p-2 bg-[#F7F5F2] rounded">
                          <div>
                            <p className="text-xs font-medium text-[#1A1A1A]">{notification.notification_type_display}</p>
                            <p className="text-[10px] text-[#5A5A5A]">{new Date(notification.sent_at).toLocaleString()}</p>
                          </div>
                          <span className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium border rounded ${notification.is_sent ? 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' : 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]'}`}>
                            {notification.is_sent ? 'Sent' : 'Failed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;
