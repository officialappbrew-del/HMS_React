import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, User, MapPin, Activity, Pill, Receipt, Calendar, Eye, X } from 'lucide-react';
import { apiRequest } from '../utils/api';

const money = (value) => `₦${Number(value || 0).toLocaleString()}`;
const date = (value) => value ? new Date(value).toLocaleString('en-NG') : 'Not recorded';

const PatientJourney = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest(`/api/v1/patients/patients/${patientId}/journey/`)
      .then((data) => { if (active) setJourney(data); })
      .catch((err) => { if (active) setError(err.message || 'Unable to load patient journey.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [patientId]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>;
  if (error) return <div className="min-h-screen bg-gray-50 p-6"><button onClick={() => navigate(-1)} className="text-emerald-700 mb-6">Back</button><p className="text-rose-700">{error}</p></div>;

  const patient = journey?.patient || {};
  const invoices = journey?.invoices || [];
  const totalDue = invoices.reduce((sum, invoice) => sum + Number(invoice.balance_due || 0), 0);

  const handleRecordPayment = async (event) => {
    event.preventDefault();
    setPaymentSaving(true);
    setPaymentError('');
    try {
      const updatedInvoice = await apiRequest('/api/v1/billing/patient-payments/', {
        method: 'POST',
        body: JSON.stringify({
          invoice: selectedInvoice.id,
          amount: Number(paymentAmount),
          payment_method: paymentMethod,
        }),
      });
      setJourney((current) => ({
        ...current,
        invoices: (current.invoices || []).map((invoice) => invoice.id === updatedInvoice.id ? updatedInvoice : invoice),
      }));
      setSelectedInvoice(updatedInvoice);
      setPaymentAmount('');
    } catch (err) {
      setPaymentError(err.message || 'Unable to record payment.');
    } finally {
      setPaymentSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-700 mb-5"><ArrowLeft className="w-4 h-4" /> Back</button>
        <header className="bg-white border border-gray-200 p-5 mb-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center"><User className="w-5 h-5 text-emerald-700" /></div><div><h1 className="text-xl font-semibold text-gray-900">{patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()}</h1><p className="text-sm text-gray-500">MRN: {patient.mrn || 'N/A'} · Hospital No: {patient.hospital_number || 'N/A'}</p></div></div>
            <div className="text-right"><p className="text-xs uppercase tracking-wider text-gray-500">Outstanding balance</p><p className="text-xl font-bold text-rose-700">{money(totalDue)}</p></div>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[['Visits', journey?.visits?.length, MapPin], ['Prescriptions', journey?.prescriptions?.length, Pill], ['Vital records', journey?.vitals?.length, Activity], ['Invoices', invoices.length, Receipt]].map(([label, value, Icon]) => <div key={label} className="bg-white border border-gray-200 p-4"><Icon className="w-4 h-4 text-emerald-700 mb-2" /><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold text-gray-900">{value || 0}</p></div>)}
        </div>

        <section className="bg-white border border-gray-200 p-5 mb-5"><h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-700" /> Visit journey</h2><div className="space-y-3">{(journey?.visits || []).map((visit) => <div key={visit.id} className="border-l-2 border-emerald-600 pl-3"><p className="font-medium text-gray-900">Visit {visit.visit_number || `#${visit.id}`}</p><p className="text-sm text-gray-600">{visit.visit_type || visit.reason || 'Clinical visit'} · {visit.visit_status || 'Status unavailable'}</p><p className="text-xs text-gray-500">{date(visit.checkin_time || visit.created_at)}</p></div>)}{!journey?.visits?.length && <p className="text-sm text-gray-500">No visits recorded.</p>}</div></section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <section className="bg-white border border-gray-200 p-5"><h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-700" /> Clinical records</h2><div className="space-y-3">{(journey?.vitals || []).map((vital) => <div key={vital.id} className="border-b border-gray-100 pb-3"><p className="text-sm font-medium text-gray-900">BP {vital.blood_pressure_systolic || '-'} / {vital.blood_pressure_diastolic || '-'} · Pulse {vital.pulse || '-'} · Temp {vital.temperature || '-'}°C</p><p className="text-xs text-gray-500">Recorded by: {vital.recorded_by_name || 'Not recorded'} · {date(vital.recorded_at)}</p></div>)}{!journey?.vitals?.length && <p className="text-sm text-gray-500">No vital records.</p>}</div></section>
          <section className="bg-white border border-gray-200 p-5"><h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Pill className="w-4 h-4 text-emerald-700" /> Prescriptions</h2><div className="space-y-3">{(journey?.prescriptions || []).map((rx) => <div key={rx.id} className="border-b border-gray-100 pb-3"><p className="text-sm font-medium text-gray-900">{rx.drug_name} · {rx.dosage} · {rx.frequency}</p><p className="text-xs text-gray-500">Prescribed by: {rx.prescribed_by_name || 'Not recorded'} · Status: {rx.status} · {date(rx.prescribed_date)}</p></div>)}{!journey?.prescriptions?.length && <p className="text-sm text-gray-500">No prescriptions.</p>}</div></section>
        </div>

        <section className="bg-white border border-gray-200 p-5 mt-5"><h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Receipt className="w-4 h-4 text-emerald-700" /> Patient bills</h2><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-sm"><thead><tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500"><th className="py-2">Invoice</th><th className="py-2">Date</th><th className="py-2">Items</th><th className="py-2">Total</th><th className="py-2">Paid</th><th className="py-2">Balance</th><th className="py-2">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{invoices.map((invoice) => <tr key={invoice.id}><td className="py-3 font-medium">{invoice.invoice_number}</td><td className="py-3">{date(invoice.invoice_date)}</td><td className="py-3">{(invoice.items || []).map((item) => `${item.description} (${item.quantity})`).join(', ') || 'No line items'}</td><td className="py-3">{money(invoice.total_amount)}</td><td className="py-3">{money(invoice.amount_paid)}</td><td className="py-3 font-semibold text-rose-700">{money(invoice.balance_due)}</td><td className="py-3"><button onClick={() => setSelectedInvoice(invoice)} className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900" title="View bill details"><Eye className="w-4 h-4" /> View</button></td></tr>)}</tbody></table>{!invoices.length && <p className="text-sm text-gray-500 mt-3">No invoices recorded.</p>}</div></section>

        {selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedInvoice(null)}>
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <div><h2 className="font-semibold text-gray-900">{selectedInvoice.invoice_number}</h2><p className="text-xs text-gray-500">{date(selectedInvoice.invoice_date)}</p></div>
                <button onClick={() => setSelectedInvoice(null)} className="p-1 text-gray-500 hover:bg-gray-100" title="Close bill details"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm"><div><p className="text-xs text-gray-500">Status</p><p className="font-medium capitalize">{selectedInvoice.status || 'Unknown'}</p></div><div><p className="text-xs text-gray-500">Subtotal</p><p className="font-medium">{money(selectedInvoice.subtotal)}</p></div><div><p className="text-xs text-gray-500">Paid</p><p className="font-medium text-emerald-700">{money(selectedInvoice.amount_paid)}</p></div><div><p className="text-xs text-gray-500">Balance</p><p className="font-medium text-rose-700">{money(selectedInvoice.balance_due)}</p></div></div>
                <div><h3 className="font-medium text-gray-900 mb-2">Line items</h3><div className="divide-y divide-gray-100 border border-gray-200">{(selectedInvoice.items || []).map((item) => <div key={item.id} className="flex items-center justify-between gap-4 px-3 py-3 text-sm"><div><p className="font-medium text-gray-900">{item.description}</p><p className="text-xs text-gray-500">{item.item_type} · Qty {item.quantity} · Unit {money(item.unit_price)}</p></div><p className="font-semibold">{money(item.line_total)}</p></div>)}{!selectedInvoice.items?.length && <p className="p-3 text-sm text-gray-500">No line items recorded.</p>}</div></div>
                <div><h3 className="font-medium text-gray-900 mb-2">Payments</h3>{(selectedInvoice.payments || []).length ? <div className="space-y-2">{selectedInvoice.payments.map((payment) => <div key={payment.id} className="flex items-center justify-between gap-4 text-sm"><span>{date(payment.payment_date)} · {payment.payment_method}<span className="block text-xs text-gray-500">Confirmed by: {payment.received_by || 'Not recorded'}</span></span><span className="font-medium">{money(payment.amount)}</span></div>)}</div> : <p className="text-sm text-gray-500">No payments recorded.</p>}</div>
                {Number(selectedInvoice.balance_due || 0) > 0 && <form onSubmit={handleRecordPayment} className="border-t border-gray-200 pt-4 space-y-3"><h3 className="font-medium text-gray-900">Record patient payment</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><input type="number" min="0.01" max={selectedInvoice.balance_due} step="0.01" required value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} placeholder={`Amount (up to ${money(selectedInvoice.balance_due)})`} className="border border-gray-300 px-3 py-2 text-sm" /><select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="border border-gray-300 px-3 py-2 text-sm"><option value="cash">Cash</option><option value="card">Card</option><option value="transfer">Transfer</option><option value="pos">POS</option><option value="insurance">Insurance</option><option value="other">Other</option></select></div>{paymentError && <p className="text-sm text-rose-700">{paymentError}</p>}<button type="submit" disabled={paymentSaving} className="inline-flex items-center gap-2 bg-emerald-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{paymentSaving && <Loader2 className="w-4 h-4 animate-spin" />}{paymentSaving ? 'Recording...' : 'Confirm Payment'}</button></form>}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default PatientJourney;
