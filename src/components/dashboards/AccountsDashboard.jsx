import { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { accountsApi, financialApi } from '../../utils/api';
import { Banknote, ReceiptText, WalletCards, BookOpen, Truck, RefreshCw, Plus, Search } from 'lucide-react';

const money = value => `NGN ${Number(value || 0).toLocaleString()}`;

const AccountsWorkspace = () => {
  const [activeTab, setActiveTab] = useState('collections');
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [journals, setJournals] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorPayments, setVendorPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryData, paymentsData, invoicesData, journalsData, ordersData, vendorsData, vendorPaymentsData] = await Promise.all([
        accountsApi.getAccountsSummary(),
        financialApi.getPayments(),
        financialApi.getInvoices(),
        accountsApi.getJournalEntries(),
        accountsApi.getPurchaseOrders(),
        accountsApi.getVendors(),
        accountsApi.getVendorPayments(),
      ]);
      setSummary(summaryData);
      setPayments(Array.isArray(paymentsData) ? paymentsData : paymentsData.results || []);
      setInvoices(Array.isArray(invoicesData) ? invoicesData : invoicesData.results || []);
      setJournals(Array.isArray(journalsData) ? journalsData : journalsData.results || []);
      setPurchaseOrders(Array.isArray(ordersData) ? ordersData : ordersData.results || []);
      setVendors(Array.isArray(vendorsData) ? vendorsData : vendorsData.results || []);
      setVendorPayments(Array.isArray(vendorPaymentsData) ? vendorPaymentsData : vendorPaymentsData.results || []);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load Accounts workspace data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const tabs = [
    { id: 'collections', label: 'Collections', icon: Banknote, description: 'Recent payments received from patients.' },
    { id: 'receivables', label: 'Receivables', icon: ReceiptText, description: 'Outstanding invoice balances.' },
    { id: 'journals', label: 'Journal Entries', icon: BookOpen, description: 'General ledger and journal entries.' },
    { id: 'purchasing', label: 'Purchasing', icon: Truck, description: 'Purchase orders, vendors, and vendor payments.' },
  ];

  const filteredPayments = payments.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (p.patient_name || '').toLowerCase().includes(q) || (p.payment_number || '').toLowerCase().includes(q) || (p.invoice_number || '').toLowerCase().includes(q);
  });

  const filteredInvoices = invoices.filter(inv => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (inv.patient_name || '').toLowerCase().includes(q) || (inv.invoice_number || '').toLowerCase().includes(q);
  });

  const filteredJournals = journals.filter(j => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (j.description || '').toLowerCase().includes(q) || (j.reference || '').toLowerCase().includes(q);
  });

  const filteredOrders = purchaseOrders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (o.vendor_name || '').toLowerCase().includes(q) || (o.order_number || '').toLowerCase().includes(q);
  });

  const filteredVendors = vendors.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (v.name || '').toLowerCase().includes(q) || (v.email || '').toLowerCase().includes(q);
  });

  const filteredVendorPayments = vendorPayments.filter(vp => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (v.vendor_name || '').toLowerCase().includes(q) || (vp.payment_number || '').toLowerCase().includes(q);
  });

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C87D3D]">Accounts workspace</p>
            <h1 className="mt-1 text-2xl font-bold text-[#1A1A1A] sm:text-3xl">Financial Operations</h1>
            <p className="mt-1 text-sm text-[#5A5A5A]">Collections, receivables, journals, and purchasing at a glance.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#5A5A5A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="border border-[#D8D4CD] bg-white pl-8 pr-3 py-2 text-sm focus:border-[#008751] focus:outline-none"
              />
            </div>
            <button type="button" onClick={loadData} className="inline-flex items-center gap-2 border border-[#D8D4CD] bg-white px-3 py-2 text-sm font-medium hover:bg-[#F0EDE8]">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </header>

        {error && <div className="mb-4 border border-[#C8553D] bg-[#F5EDEA] p-3 text-sm text-[#A8442E]">{error}</div>}

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border border-[#E8E3DC] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Collected</p>
            <p className="mt-1 text-xl font-bold text-[#2D7D46]">{loading ? '...' : money(summary?.collected_amount)}</p>
          </div>
          <div className="border border-[#E8E3DC] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Receivables</p>
            <p className="mt-1 text-xl font-bold text-[#C8553D]">{loading ? '...' : money(summary?.outstanding_receivables)}</p>
          </div>
          <div className="border border-[#E8E3DC] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Pending Journals</p>
            <p className="mt-1 text-xl font-bold text-[#C87D3D]">{loading ? '...' : (summary?.pending_journals ?? 0)}</p>
          </div>
          <div className="border border-[#E8E3DC] bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">Purchase Orders</p>
            <p className="mt-1 text-xl font-bold text-[#1A1A1A]">{loading ? '...' : (summary?.purchase_order_count ?? 0)}</p>
          </div>
        </section>

        <section className="mb-4 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-[#008751] bg-[#008751] text-white'
                  : 'border-[#D8D4CD] bg-white text-[#1A1A1A] hover:bg-[#F0EDE8]'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </section>

        <section className="border border-[#E8E3DC] bg-white p-4 sm:p-5">
          {activeTab === 'collections' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A]">Collections</h2>
                  <p className="text-sm text-[#5A5A5A]">Recent payments received from patients.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-[10px] uppercase tracking-wider text-[#5A5A5A]">
                    <tr>
                      <th className="pb-3">Payment #</th>
                      <th className="pb-3">Patient</th>
                      <th className="pb-3">Invoice</th>
                      <th className="pb-3">Method</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.slice(0, 20).map(payment => (
                      <tr key={payment.id} className="border-t border-[#E8E3DC]">
                        <td className="py-3 font-mono text-xs">{payment.payment_number}</td>
                        <td className="py-3 font-medium">{payment.patient_name || '-'}</td>
                        <td className="py-3 font-mono text-xs">{payment.invoice_number || '-'}</td>
                        <td className="py-3 capitalize">{String(payment.payment_method || '').replaceAll('_', ' ')}</td>
                        <td className="py-3 font-semibold text-[#2D7D46]">{money(payment.amount)}</td>
                        <td className="py-3">{String(payment.payment_date || '').slice(0, 10)}</td>
                        <td className="py-3 capitalize">{String(payment.status || '').replaceAll('_', ' ')}</td>
                      </tr>
                    ))}
                    {!filteredPayments.length && <tr><td colSpan="7" className="py-8 text-center text-[#5A5A5A]">No payments found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'receivables' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A]">Receivables</h2>
                  <p className="text-sm text-[#5A5A5A]">Outstanding invoice balances.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-[10px] uppercase tracking-wider text-[#5A5A5A]">
                    <tr>
                      <th className="pb-3">Invoice</th>
                      <th className="pb-3">Patient</th>
                      <th className="pb-3">Issued</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Paid</th>
                      <th className="pb-3">Balance</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.slice(0, 20).map(invoice => (
                      <tr key={invoice.id} className="border-t border-[#E8E3DC]">
                        <td className="py-3 font-mono text-xs">{invoice.invoice_number}</td>
                        <td className="py-3 font-medium">{invoice.patient_name || '-'}</td>
                        <td className="py-3">{String(invoice.invoice_date || '').slice(0, 10)}</td>
                        <td className="py-3">{money(invoice.total_amount)}</td>
                        <td className="py-3">{money(invoice.amount_paid)}</td>
                        <td className="py-3 font-semibold text-[#C8553D]">{money(invoice.balance_due)}</td>
                        <td className="py-3 capitalize">{String(invoice.status || '').replaceAll('_', ' ')}</td>
                      </tr>
                    ))}
                    {!filteredInvoices.length && <tr><td colSpan="7" className="py-8 text-center text-[#5A5A5A]">No invoices found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'journals' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A]">Journal Entries</h2>
                  <p className="text-sm text-[#5A5A5A]">General ledger and journal entries.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-[10px] uppercase tracking-wider text-[#5A5A5A]">
                    <tr>
                      <th className="pb-3">Entry #</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Description</th>
                      <th className="pb-3">Reference</th>
                      <th className="pb-3">Debit</th>
                      <th className="pb-3">Credit</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJournals.slice(0, 20).map(journal => (
                      <tr key={journal.id} className="border-t border-[#E8E3DC]">
                        <td className="py-3 font-mono text-xs">{journal.entry_number || `#${journal.id}`}</td>
                        <td className="py-3">{String(journal.date || journal.created_at || '').slice(0, 10)}</td>
                        <td className="py-3">{journal.description || '-'}</td>
                        <td className="py-3 font-mono text-xs">{journal.reference || '-'}</td>
                        <td className="py-3">{money(journal.debit_amount)}</td>
                        <td className="py-3">{money(journal.credit_amount)}</td>
                        <td className="py-3 capitalize">{String(journal.status || '').replaceAll('_', ' ')}</td>
                      </tr>
                    ))}
                    {!filteredJournals.length && <tr><td colSpan="7" className="py-8 text-center text-[#5A5A5A]">No journal entries found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'purchasing' && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A]">Purchasing</h2>
                  <p className="text-sm text-[#5A5A5A]">Purchase orders, vendors, and vendor payments.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="text-[10px] uppercase tracking-wider text-[#5A5A5A]">
                    <tr>
                      <th className="pb-3">Order #</th>
                      <th className="pb-3">Vendor</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Vendor Payments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.slice(0, 20).map(order => (
                      <tr key={order.id} className="border-t border-[#E8E3DC]">
                        <td className="py-3 font-mono text-xs">{order.order_number || `#${order.id}`}</td>
                        <td className="py-3 font-medium">{order.vendor_name || vendors.find(v => v.id === order.vendor)?.name || '-'}</td>
                        <td className="py-3">{String(order.order_date || order.created_at || '').slice(0, 10)}</td>
                        <td className="py-3">{money(order.total_amount)}</td>
                        <td className="py-3 capitalize">{String(order.status || '').replaceAll('_', ' ')}</td>
                        <td className="py-3">
                          {vendorPayments
                            .filter(vp => vp.purchase_order === order.id || vp.vendor === order.vendor)
                            .map(vp => (
                              <div key={vp.id} className="text-xs">
                                <span className="font-mono">{vp.payment_number || `#${vp.id}`}</span>
                                <span className="text-[#2D7D46] ml-2">{money(vp.amount)}</span>
                              </div>
                            ))}
                        </td>
                      </tr>
                    ))}
                    {!filteredOrders.length && <tr><td colSpan="6" className="py-8 text-center text-[#5A5A5A]">No purchase orders found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AccountsWorkspace;
