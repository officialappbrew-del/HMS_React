import { useEffect, useState } from 'react';
import { CreditCard, ExternalLink } from 'lucide-react';
import { apiRequest, parseListResponse } from '../utils/api';

const TenantSubscription = () => {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [planId, setPlanId] = useState('');
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiRequest('/api/v1/tenants/subscription-plans/?is_active=true'),
      apiRequest('/api/v1/billing/subscription/'),
    ])
      .then(([plansData, subscriptionData]) => {
        setSubscription(subscriptionData);
        const data = plansData;
        const availablePlans = parseListResponse(data).filter((plan) => plan.is_active);
        setPlans(availablePlans);
        setPlanId(String(availablePlans[0]?.id || ''));
      })
      .catch((err) => setError(err.message || 'Unable to load subscription plans'))
      .finally(() => setLoading(false));
  }, []);

  const selectedPlan = plans.find((plan) => String(plan.id) === planId);
  const amount = selectedPlan?.[`price_${period}`];

  const startCheckout = async () => {
    if (!planId) return;
    setSubmitting(true);
    setError('');
    try {
      const checkout = await apiRequest('/api/v1/billing/checkout/', {
        method: 'POST',
        body: JSON.stringify({ subscription_plan: planId, billing_period: period }),
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
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A5A5A]">Start date</p>
                  <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">{subscription?.subscription_start_date || '—'}</p>
                </div>
                <div className="border border-[#E8E3DC] p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A5A5A]">End date</p>
                  <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">{subscription?.subscription_end_date || '—'}</p>
                </div>
                <div className="border border-[#E8E3DC] p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5A5A5A]">Days remaining</p>
                  <p className="mt-1 text-sm font-semibold text-[#1A1A1A]">{subscription?.days_remaining ?? '—'}</p>
                </div>
              </div>
              <label className="block text-sm font-medium text-[#1A1A1A]">Plan</label>
              <select value={planId} onChange={(event) => setPlanId(event.target.value)} className="mt-2 w-full border border-[#D8D4CD] px-3 py-3 text-sm">
                {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} - {plan.currency} {plan.price_monthly}/month</option>)}
              </select>
              <label className="mt-5 block text-sm font-medium text-[#1A1A1A]">Billing period</label>
              <select value={period} onChange={(event) => setPeriod(event.target.value)} className="mt-2 w-full border border-[#D8D4CD] px-3 py-3 text-sm">
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              {error && <p className="mt-4 text-sm text-[#C8553D]">{error}</p>}
              <button type="button" onClick={startCheckout} disabled={!selectedPlan || submitting} className="mt-6 inline-flex items-center gap-2 bg-[#008751] px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
                <CreditCard className="h-4 w-4" />
                {submitting ? 'Opening Paystack...' : `Pay ${selectedPlan?.currency || 'NGN'} ${amount || ''}`}
                <ExternalLink className="h-4 w-4" />
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default TenantSubscription;
