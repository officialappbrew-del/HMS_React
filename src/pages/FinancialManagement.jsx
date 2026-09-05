import { useEffect, useState } from 'react';
import { apiRequest } from '../utils/api';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Download, RefreshCw, AlertTriangle, Target, Activity, CreditCard, Banknote, Calculator, LineChart, Eye, Settings, Plus, X, ChevronLeft, ChevronRight, Search, Edit, Check, ArrowUp, ArrowDown, Package, Pill, AlertCircle } from 'lucide-react';

const money = value => `NGN ${Number(value || 0).toLocaleString()}`;
const pct = value => `${Number(value || 0).toFixed(1)}%`;

const StatCard = ({ title, value, subValue, icon: Icon, color, trend }) => (
  <div className="border border-[#E8E3DC] bg-white p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">{title}</p>
        <p className="mt-1 text-xl font-bold text-[#1A1A1A]">{value}</p>
        {subValue && <p className="mt-1 text-xs text-[#5A5A5A]">{subValue}</p>}
      </div>
      <div className={`rounded-full p-2.5 ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
    {trend && (
      <div className="mt-3 flex items-center gap-1 text-xs font-medium">
        {trend === 'up' && <TrendingUp className="h-3.5 w-3.5 text-[#2D7D46]" />}
        {trend === 'down' && <TrendingDown className="h-3.5 w-3.5 text-[#C8553D]" />}
        <span className={trend === 'up' ? 'text-[#2D7D46]' : 'text-[#C8553D]'}>{trend === 'up' ? 'Positive' : 'Negative'}</span>
      </div>
    )}
  </div>
);

const FinancialManagement = () => {
  const [analytics, setAnalytics] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30d');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsData, summaryData] = await Promise.all([
        apiRequest(`/api/v1/billing/analytics/?date_range=${dateRange}`),
        apiRequest('/api/v1/accounts/summary/'),
      ]);
      setAnalytics(analyticsData);
      setSummary(summaryData);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load financial data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [dateRange]);

  const stats = analytics?.stats || {};
  const invoices = analytics?.invoices || {};
  const cashFlow = analytics?.cashFlow || {};
  const kpis = analytics?.kpis?.financial || {};
  const pharmacy = analytics?.pharmacy || {};

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C87D3D]">Financial management</p>
            <h1 className="mt-1 text-2xl font-bold text-[#1A1A1A] sm:text-3xl">Financial Overview</h1>
            <p className="mt-1 text-sm text-[#5A5A5A]">Revenue, costs, cash flow, and operational health at a glance.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-[#D8D4CD] bg-white px-3 py-2 text-sm focus:border-[#008751] focus:outline-none"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button type="button" onClick={loadData} className="inline-flex items-center gap-2 border border-[#D8D4CD] bg-white px-3 py-2 text-sm font-medium hover:bg-[#F0EDE8]">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </header>

        {error && <div className="mb-4 border border-[#C8553D] bg-[#F5EDEA] p-3 text-sm text-[#A8442E]">{error}</div>}

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Revenue" value={money(stats.totalRevenue)} subValue={`${invoices.paid || 0} paid invoices`} icon={DollarSign} color="bg-[#2D7D46]" />
          <StatCard title="Total Costs" value={money(stats.totalCosts)} subValue={`Drugs: ${money(analytics?.costs?.drugs)}`} icon={Calculator} color="bg-[#C8553D]" />
          <StatCard title="Net Profit" value={money(stats.netProfit)} subValue={`Margin: ${pct(stats.profitMargin)}`} icon={TrendingUp} color={stats.netProfit >= 0 ? 'bg-[#2D7D46]' : 'bg-[#C8553D]'} />
          <StatCard title="Cash Position" value={money(stats.cashPosition)} subValue={`Operating: ${money(cashFlow.operating)}`} icon={Banknote} color="bg-[#008751]" />
        </section>

        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="border border-[#E8E3DC] bg-white p-5 lg:col-span-2">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Cash Flow</h2>
            <p className="text-sm text-[#5A5A5A]">Operating, investing, and financing cash flow.</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Operating</p>
                <p className="mt-1 text-lg font-bold text-[#1A1A1A]">{money(cashFlow.operating)}</p>
              </div>
              <div className="rounded-lg border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Investing</p>
                <p className="mt-1 text-lg font-bold text-[#C8553D]">{money(cashFlow.investing)}</p>
              </div>
              <div className="rounded-lg border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Net</p>
                <p className={`mt-1 text-lg font-bold ${Number(cashFlow.net || 0) >= 0 ? 'text-[#2D7D46]' : 'text-[#C8553D]'}`}>{money(cashFlow.net)}</p>
              </div>
            </div>
          </div>
          <div className="border border-[#E8E3DC] bg-white p-5">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Financial KPIs</h2>
            <p className="text-sm text-[#5A5A5A]">Key performance indicators.</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A5A5A]">Operating Margin</span>
                <span className="text-sm font-bold text-[#1A1A1A]">{pct(kpis.operatingMargin)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A5A5A]">Cost per Invoice</span>
                <span className="text-sm font-bold text-[#1A1A1A]">{money(kpis.costPerPatient)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A5A5A]">Collection Rate</span>
                <span className="text-sm font-bold text-[#1A1A1A]">{pct(invoices.invoiced_total ? (invoices.collected_total / invoices.invoiced_total) * 100 : 0)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="border border-[#E8E3DC] bg-white p-5">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Invoice Health</h2>
            <p className="text-sm text-[#5A5A5A]">Billing performance this period.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Total Invoices</p>
                <p className="mt-1 text-lg font-bold text-[#1A1A1A]">{invoices.total || 0}</p>
              </div>
              <div className="rounded-lg border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Paid</p>
                <p className="mt-1 text-lg font-bold text-[#2D7D46]">{invoices.paid || 0}</p>
              </div>
              <div className="rounded-lg border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Pending</p>
                <p className="mt-1 text-lg font-bold text-[#C87D3D]">{invoices.pending || 0}</p>
              </div>
              <div className="rounded-lg border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Receivables</p>
                <p className="mt-1 text-lg font-bold text-[#C8553D]">{money(invoices.receivables)}</p>
              </div>
            </div>
          </div>
          <div className="border border-[#E8E3DC] bg-white p-5">
            <h2 className="text-lg font-bold text-[#1A1A1A]">Pharmacy Performance</h2>
            <p className="text-sm text-[#5A5A5A]">Inventory and sales indicators.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Sales Revenue</p>
                <p className="mt-1 text-lg font-bold text-[#1A1A1A]">{money(pharmacy.salesRevenue)}</p>
              </div>
              <div className="rounded-lg border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Units Sold</p>
                <p className="mt-1 text-lg font-bold text-[#1A1A1A]">{pharmacy.unitsSold || 0}</p>
              </div>
              <div className="rounded-lg border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Stock Value</p>
                <p className="mt-1 text-lg font-bold text-[#1A1A1A]">{money(pharmacy.stockValue)}</p>
              </div>
              <div className="rounded-lg border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Low Stock Items</p>
                <p className="mt-1 text-lg font-bold text-[#C87D3D]">{pharmacy.lowStockCount || 0}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FinancialManagement;
