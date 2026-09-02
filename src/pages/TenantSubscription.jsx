import { useEffect, useState } from 'react';
import { CreditCard, ExternalLink } from 'lucide-react';
import { apiRequest, parseListResponse } from '../utils/api';

const TenantSubscription = () => {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [planId, setPlanId] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [includeEmailService, setIncludeEmailService] = useState(false);
  const [includeSmsService, setIncludeSmsService] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiRequest('/api/v1/tenants/subscription-plans/?is_active=true'),
      apiRequest('/api/v1/billing/subscription/'),
    ])
      .then(([plansData, subscriptionData]) => {
        const availablePlans = parseListResponse(plansData).filter((plan) => plan.is_active);
        setPlans(availablePlans);
        setSubscription(subscriptionData);

        const activePlanId = subscriptionData?.subscription_plan || availablePlans[0]?.id;
        if (activePlanId) {
          setPlanId(String(activePlanId));
        }

        setIncludeEmailService(Boolean(subscriptionData?.include_email_service));
        setIncludeSmsService(Boolean(subscriptionData?.include_sms_service));
      })
      .catch((err) => setError(err.message || 'Unable to load subscription plans'))
      .finally(() => setLoading(false));
  }, []);

  const selectedPlan = plans.find((plan) => String(plan.id) === planId) || plans[0] || null;
  const pricingMultiplier = period === 'monthly' ? 1 : period === 'quarterly' ? 3 : 12;
  const basePlanPrice = parseFloat(selectedPlan?.[`price_${period}`] || 0);

  // Calculate service costs based on the selected billing period.
  const emailServiceCost = includeEmailService
    ? parseFloat(selectedPlan?.email_service_cost_monthly || 0) * pricingMultiplier
    : 0;
  const smsServiceCost = includeSmsService
    ? parseFloat(selectedPlan?.sms_service_cost_monthly || 0) * pricingMultiplier
    : 0;

  const amount = basePlanPrice + emailServiceCost + smsServiceCost;
  const currentMonthlyTotal = parseFloat(subscription?.current_monthly_total || subscription?.monthly_fee || 0);

  const startCheckout = async () => {
    if (!planId) return;
    setSubmitting(true);
    setError('');
    try {
      const checkout = await apiRequest('/api/v1/billing/checkout/', {
        method: 'POST',
        body: JSON.stringify({ 
          subscription_plan: planId, 
          billing_period: period,
          email_service: includeEmailService,
          sms_service: includeSmsService,
        }),
      });
      window.location.assign(checkout.authorization_url);
    } catch (err) {
      setError(err.message || 'Unable to start payment');
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#008751]">Workspace billing</p>
          <h1 className="mt-2 text-3xl font-display font-semibold text-[#1A1A1A]">Manage subscription</h1>
          <p className="mt-2 text-sm text-[#5A5A5A]">Payment is confirmed by Paystack before your plan becomes active.</p>
        </div>
        <section className="border border-[#E8E3DC] bg-white p-6 shadow-sm">
          {loading ? <p className="text-sm text-[#5A5A5A]">Loading plans...</p> : (
            <>
              <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="border border-[#E8E3DC] p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A5A5A]">Status</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-[#1A1A1A]">{subscription?.subscription_status || '—'}</p>
                </div>
                <div className="border border-[#E8E3DC] p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A5A5A]">Current plan</p>
                  <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">{subscription?.subscription_plan_name || '—'}</p>
                </div>
                <div className="border border-[#E8E3DC] p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A5A5A]">Monthly total</p>
                  <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">{subscription?.current_monthly_total ? `${subscription?.tenant_name ? '' : ''}${selectedPlan?.currency || 'NGN'} ${Number(subscription.current_monthly_total).toFixed(2)}` : '—'}</p>
                </div>
                <div className="border border-[#E8E3DC] p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A5A5A]">Days remaining</p>
                  <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">{subscription?.days_remaining ?? '—'}</p>
                </div>
              </div>

              {subscription?.subscription_plan_name && (
                <div className="mb-4 rounded border border-[#D8D4CD] bg-[#F7F5F2] p-3 text-sm text-[#1A1A1A]">
                  <span className="font-medium">Current subscription:</span> {subscription.subscription_plan_name}
                  {subscription.include_email_service || subscription.include_sms_service ? (
                    <span className="ml-2 text-[#5A5A5A]">
                      ({[subscription.include_email_service ? 'Email' : null, subscription.include_sms_service ? 'SMS' : null].filter(Boolean).join(' + ')} included)
                    </span>
                  ) : null}
                </div>
              )}

              <label className="block text-sm font-medium text-[#1A1A1A]">Plan</label>
              <select value={planId} onChange={(event) => setPlanId(event.target.value)} className="mt-2 w-full border border-[#D8D4CD] px-3 py-3 text-sm">
                {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} - {plan.currency} {plan.price_monthly}/month</option>)}
              </select>
              <label className="mt-5 block text-sm font-medium text-[#1A1A1A]">Billing period <span className="font-normal text-[#5A5A5A]">(up to 12 months)</span></label>
              <select value={period} onChange={(event) => setPeriod(event.target.value)} className="mt-2 w-full border border-[#D8D4CD] px-3 py-3 text-sm">
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              
              {selectedPlan && (selectedPlan.email_service_cost_monthly > 0 || selectedPlan.sms_service_cost_monthly > 0) && (
                <div className="mt-5 border border-[#D8D4CD] p-4 bg-[#F7F5F2]">
                  <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">Add Services</p>
                  
                  {selectedPlan.email_service_cost_monthly > 0 && (
                    <label className="flex items-center gap-2 mb-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeEmailService} 
                        onChange={(e) => setIncludeEmailService(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[#1A1A1A]">Email Service</span>
                      <span className="text-xs text-[#5A5A5A] ml-auto">
                        +{selectedPlan.currency} {(parseFloat(selectedPlan.email_service_cost_monthly) * (period === 'monthly' ? 1 : period === 'quarterly' ? 3 : 12)).toFixed(2)}
                      </span>
                    </label>
                  )}
                  
                  {selectedPlan.sms_service_cost_monthly > 0 && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeSmsService} 
                        onChange={(e) => setIncludeSmsService(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[#1A1A1A]">SMS Service</span>
                      <span className="text-xs text-[#5A5A5A] ml-auto">
                        +{selectedPlan.currency} {(parseFloat(selectedPlan.sms_service_cost_monthly) * (period === 'monthly' ? 1 : period === 'quarterly' ? 3 : 12)).toFixed(2)}
                      </span>
                    </label>
                  )}
                </div>
              )}
              
              {error && <p className="mt-4 text-sm text-[#C8553D]">{error}</p>}
              <div className="mt-6 p-4 bg-[#EAF3EE] border border-[#D0E3D8] rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#5A5A5A]">Total Amount</p>
                    <p className="mt-1 text-2xl font-semibold text-[#008751]">{selectedPlan?.currency || 'NGN'} {amount.toFixed(2)}</p>
                  </div>
                  <button type="button" onClick={startCheckout} disabled={!selectedPlan || submitting} className="inline-flex items-center gap-2 bg-[#008751] px-5 py-3 text-sm font-medium text-white disabled:opacity-50 hover:bg-[#006B40]">
                    <CreditCard className="h-4 w-4" />
                    {submitting ? 'Opening Paystack...' : 'Pay Now'}
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default TenantSubscription;
