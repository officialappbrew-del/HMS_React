import { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { Banknote, ReceiptText, WalletCards, BookOpen, Truck, RefreshCw } from 'lucide-react';

const AccountsDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryData, invoiceData] = await Promise.all([
        apiRequest('/api/v1/accounts/summary/'),
        apiRequest('/api/v1/billing/invoices/'),
      ]);
      setSummary(summaryData);
      setInvoices(Array.isArray(invoiceData) ? invoiceData : invoiceData.results || []);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load Accounts data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const metrics = [
    ['Collected', summary?.collected_amount, Banknote, 'text-[#2D7D46]'],
    ['Receivables', summary?.outstanding_receivables, WalletCards, 'text-[#C8553D]'],
    ['Invoices', summary?.invoice_count, ReceiptText, 'text-[#008751]'],
    ['Draft journals', summary?.pending_journals, BookOpen, 'text-[#C87D3D]'],
    ['Vendor payments', summary?.vendor_payment_count, Truck, 'text-[#4A5A5A]'],
    ['Active assets', summary?.asset_count, Banknote, 'text-[#008751]'],
  ];

  const money = value => `NGN ${Number(value || 0).toLocaleString()}`;

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C87D3D]">Financial management</p><h1 className="mt-1 text-2xl font-bold text-[#1A1A1A] sm:text-3xl">Accounts workspace</h1><p className="mt-1 text-sm text-[#5A5A5A]">Collections, receivables, journals, and purchasing at a glance.</p></div>
          <button type="button" onClick={loadData} className="inline-flex items-center gap-2 self-start border border-[#D8D4CD] bg-white px-3 py-2 text-sm font-medium hover:bg-[#F0EDE8] sm:self-auto"><RefreshCw className="h-4 w-4" /> Refresh</button>
        </header>
        {error && <div className="mb-4 border border-[#C8553D] bg-[#F5EDEA] p-3 text-sm text-[#A8442E]">{error}</div>}
        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {metrics.map(([label, value, Icon, color]) => <div key={label} className="border border-[#E8E3DC] bg-white p-4"><div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">{label}</p><p className="mt-1 text-xl font-bold text-[#1A1A1A]">{loading ? '...' : label === 'Invoices' || label === 'Draft journals' ? (value ?? 0) : money(value)}</p></div><Icon className={`h-6 w-6 ${color}`} /></div></div>)}
        </section>
        <section className="border border-[#E8E3DC] bg-white p-4">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold text-[#1A1A1A]">Recent invoices</h2><p className="text-sm text-[#5A5A5A]">Outstanding balances from patient billing.</p></div><Truck className="h-5 w-5 text-[#5A5A5A]" /></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="text-[10px] uppercase tracking-wider text-[#5A5A5A]"><tr><th className="pb-3">Invoice</th><th className="pb-3">Patient</th><th className="pb-3">Issued</th><th className="pb-3">Total</th><th className="pb-3">Outstanding</th><th className="pb-3">Status</th></tr></thead><tbody>{invoices.slice(0, 12).map(invoice => <tr key={invoice.id} className="border-t border-[#E8E3DC]"><td className="py-3 font-mono text-xs">{invoice.invoice_number}</td><td className="py-3 font-medium">{invoice.patient_name || '-'}</td><td className="py-3">{String(invoice.invoice_date || '').slice(0, 10)}</td><td className="py-3">{money(invoice.total_amount)}</td><td className="py-3 font-semibold">{money(invoice.balance_due)}</td><td className="py-3 capitalize">{String(invoice.status || '').replaceAll('_', ' ')}</td></tr>)}{!invoices.length && <tr><td colSpan="6" className="py-8 text-center text-[#5A5A5A]">No invoices found.</td></tr>}</tbody></table></div>
        </section>
      </div>
    </main>
  );
};

export default AccountsDashboard;