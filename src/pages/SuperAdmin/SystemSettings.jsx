import React, { useState, useEffect } from 'react';
import {
  Save, Loader2, AlertCircle, CheckCircle,
  Zap, Server, Globe
} from 'lucide-react';
import { superAdminApi } from '../../utils/superAdminApi';

const SystemSettings = () => {
  const [settings, setSettings] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentConfiguration, setPaymentConfiguration] = useState({});

  const loadSettings = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await superAdminApi.getSettings();
      setSettings(result.settings || {});
      setPlans(result.subscription_plans || []);
      setPaymentConfiguration(result.payment_configuration || {});
    } catch (err) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await superAdminApi.updateSettings({ ...settings, ...paymentConfiguration });
      setSuccess('Settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updatePaymentConfiguration = (key, value) => {
    setPaymentConfiguration(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#C79A3D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const selectedPlan = plans.find(p => String(p.id) === String(settings?.default_subscription_plan_id));

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-semibold text-[#1A1A1A]">System Settings </h2>
          <p className="text-sm text-[#5A5A5A]">Platform-wide configuration and subscription defaults</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#008751] px-4 py-2 text-sm font-medium text-white hover:bg-[#006B40] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-[#E8D6D0] bg-[#F5EDEA] p-4 text-sm text-[#C8553D] flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-[#D0E3D8] bg-[#EAF3EE] p-4 text-sm text-[#2D7D46] flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-[#E8E3DC] rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#C79A3D]" />
              General Settings
            </h3>
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Platform Name</label>
              <input
                type="text"
                value={settings?.platform_name || ''}
                onChange={(e) => updateSetting('platform_name', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Support Email</label>
              <input
                type="email"
                value={settings?.support_email || ''}
                onChange={(e) => updateSetting('support_email', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
              />
            </div>
            {/* <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A]">Maintenance Mode</label>
                <p className="text-xs text-[#5A5A5A]">Temporarily disable platform access</p>
              </div>
              <button
                type="button"
                onClick={() => updateSetting('maintenance_mode', !settings?.maintenance_mode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings?.maintenance_mode ? 'bg-[#C8553D]' : 'bg-[#D8D4CD]'}`}
                aria-label="Toggle maintenance mode"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings?.maintenance_mode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div> */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-medium text-[#1A1A1A]">Allow New Signups</label>
                <p className="text-xs text-[#5A5A5A]">Enable or disable new tenant registration</p>
              </div>
              <button
                type="button"
                onClick={() => updateSetting('allow_new_signups', !settings?.allow_new_signups)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings?.allow_new_signups ? 'bg-[#2D7D46]' : 'bg-[#D8D4CD]'}`}
                aria-label="Toggle new signups"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings?.allow_new_signups ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E8E3DC] rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#C79A3D]" />
              Platform Service Costs
            </h3>
            <p className="text-xs text-[#5A5A5A]">Default third-party service providers and costs applied across new tenants unless overridden by their plan.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Email Provider</label>
                <input
                  type="text"
                  value={settings?.platform_email_provider || ''}
                  onChange={(e) => updateSetting('platform_email_provider', e.target.value)}
                  placeholder="e.g. sendgrid"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Email Cost/Month (₦)</label>
                <input
                  type="number"
                  value={settings?.platform_email_cost_monthly || 0}
                  onChange={(e) => updateSetting('platform_email_cost_monthly', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">SMS Provider</label>
                <input
                  type="text"
                  value={settings?.platform_sms_provider || ''}
                  onChange={(e) => updateSetting('platform_sms_provider', e.target.value)}
                  placeholder="e.g. twilio"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5A5A5A] mb-1">SMS Cost/Month (₦)</label>
                <input
                  type="number"
                  value={settings?.platform_sms_cost_monthly || 0}
                  onChange={(e) => updateSetting('platform_sms_cost_monthly', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#C79A3D]" />
            Subscription Defaults
          </h3>
          <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Default Subscription Plan</label>
            <select
              value={settings?.default_subscription_plan_id || ''}
              onChange={(e) => updateSetting('default_subscription_plan_id', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
            >
              <option value="">Select plan</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>{plan.name} ({plan.code})</option>
              ))}
            </select>
          </div>

          {selectedPlan && (
            <div className="rounded-lg border border-[#D8D4CD] bg-[#F7F5F2] p-3 space-y-2">
              <p className="text-xs font-semibold text-[#1A1A1A]">Default Plan Limits</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-[#5A5A5A]">Max Users:</span> <span className="font-medium text-[#1A1A1A]">{selectedPlan.max_users}</span></div>
                <div><span className="text-[#5A5A5A]">Max Patients:</span> <span className="font-medium text-[#1A1A1A]">{selectedPlan.max_patients}</span></div>
                <div><span className="text-[#5A5A5A]">Storage:</span> <span className="font-medium text-[#1A1A1A]">{selectedPlan.max_storage_gb} GB</span></div>
                <div><span className="text-[#5A5A5A]">Email Limit:</span> <span className="font-medium text-[#1A1A1A]">{selectedPlan.email_limit_monthly}/mo</span></div>
                <div><span className="text-[#5A5A5A]">SMS Limit:</span> <span className="font-medium text-[#1A1A1A]">{selectedPlan.sms_limit_monthly}/mo</span></div>
                <div><span className="text-[#5A5A5A]">Monthly:</span> <span className="font-medium text-[#1A1A1A]">₦{selectedPlan.price_monthly}</span></div>
              </div>
              {(selectedPlan.email_service_cost_monthly > 0 || selectedPlan.sms_service_cost_monthly > 0) && (
                <div className="pt-2 border-t border-[#E8E3DC] text-xs">
                  {selectedPlan.email_service_cost_monthly > 0 && <p>Email service: ₦{selectedPlan.email_service_cost_monthly}/mo via {selectedPlan.service_providers?.email || 'N/A'}</p>}
                  {selectedPlan.sms_service_cost_monthly > 0 && <p>SMS service: ₦{selectedPlan.sms_service_cost_monthly}/mo via {selectedPlan.service_providers?.sms || 'N/A'}</p>}
                </div>
              )}
            </div>
          )}

          {/* <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Max Users Per Tenant (global cap)</label>
            <input
              type="number"
              value={settings?.max_users_per_tenant || 100}
              onChange={(e) => updateSetting('max_users_per_tenant', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
            />
          </div> */}
          <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Self-service payment method</label>
            <select
              value={settings?.subscription_payment_method || 'paystack'}
              onChange={(e) => updateSetting('subscription_payment_method', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
            >
              <option value="paystack">Paystack</option>
              <option value="paypal">PayPal</option>
            </select>
            <p className="mt-1 text-xs text-[#5A5A5A]">The provider used by new root admins to pay for their selected plan.</p>
          </div>
          <div className="border-t border-[#E8E3DC] pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#5A5A5A]">Payment gateway credentials</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input type="password" placeholder={paymentConfiguration.paystack_secret_key_configured ? 'Paystack secret key configured' : 'Paystack secret key'} onChange={(e) => updatePaymentConfiguration('paystack_secret_key', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] rounded" />
              <input type="text" placeholder="Paystack public key" value={paymentConfiguration.paystack_public_key || ''} onChange={(e) => updatePaymentConfiguration('paystack_public_key', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] rounded" />
              <input type="text" placeholder="PayPal client ID" value={paymentConfiguration.paypal_client_id || ''} onChange={(e) => updatePaymentConfiguration('paypal_client_id', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] rounded" />
              <input type="password" placeholder={paymentConfiguration.paypal_client_secret_configured ? 'PayPal client secret configured' : 'PayPal client secret'} onChange={(e) => updatePaymentConfiguration('paypal_client_secret', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] rounded" />
              <input type="password" placeholder={paymentConfiguration.paypal_webhook_id_configured ? 'PayPal webhook ID configured' : 'PayPal webhook ID'} onChange={(e) => updatePaymentConfiguration('paypal_webhook_id', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] rounded" />
              <select value={paymentConfiguration.paypal_base_url || 'https://api-m.sandbox.paypal.com'} onChange={(e) => updatePaymentConfiguration('paypal_base_url', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] rounded">
                <option value="https://api-m.sandbox.paypal.com">PayPal Sandbox</option>
                <option value="https://api-m.paypal.com">PayPal Live</option>
              </select>
            </div>
            <p className="mt-2 text-xs text-[#5A5A5A]">Secrets are encrypted in the database and are never returned to the dashboard.</p>
          </div>
          {/* <div>
            <label className="block text-xs font-medium text-[#5A5A5A] mb-1">Max Storage Per Tenant (GB)</label>
            <input
              type="number"
              value={settings?.max_storage_per_tenant_gb || 10}
              onChange={(e) => updateSetting('max_storage_per_tenant_gb', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors rounded"
            />
          </div> */}
        </div>

      </div>
    </div>
  );
};

export default SystemSettings;

