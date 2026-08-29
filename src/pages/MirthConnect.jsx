import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Copy, KeyRound, Plus, RefreshCw, Server, ShieldCheck, XCircle } from 'lucide-react';
import { apiRequest } from '../utils/api';

const emptyForm = { name: '', source_system: '', client_id: '', protocol: 'hl7', mirth_base_url: '', channel_id: '' };

const MirthConnect = () => {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [clientName, setClientName] = useState('');
  const [newKey, setNewKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [channelData, messageData] = await Promise.all([
        apiRequest('/api/v1/integration/mirth/channels/'),
        apiRequest('/api/v1/integration/messages/?protocol=fhir&message_type=lab-result'),
      ]);
      setChannels(Array.isArray(channelData) ? channelData : []);
      setMessages(Array.isArray(messageData) ? messageData : messageData.results || []);
      const clientData = await apiRequest('/api/v1/integration/clients/');
      setClients(Array.isArray(clientData) ? clientData : []);
    } catch (error) { setMessage({ type: 'error', text: error.message || 'Unable to load Mirth Connect settings.' }); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const createClient = async (event) => {
    event.preventDefault();
    if (!clientName.trim()) return;
    setWorking(true); setMessage(null);
    try {
      const client = await apiRequest('/api/v1/integration/clients/', { method: 'POST', body: JSON.stringify({ name: clientName, description: 'Mirth Connect middleware client' }) });
      setClients((current) => [...current, client]); setForm((current) => ({ ...current, client_id: String(client.id) })); setNewKey(client.api_key || ''); setClientName('');
      setMessage({ type: 'success', text: 'Client created. Copy the API key now; it is shown only once.' });
    } catch (error) { setMessage({ type: 'error', text: error.message || 'Could not create integration client.' }); }
    finally { setWorking(false); }
  };

  const createChannel = async (event) => {
    event.preventDefault();
    setWorking(true); setMessage(null);
    try { await apiRequest('/api/v1/integration/mirth/channels/', { method: 'POST', body: JSON.stringify({ ...form, client_id: Number(form.client_id) }) }); setForm(emptyForm); setMessage({ type: 'success', text: 'Mirth channel registered.' }); await load(); }
    catch (error) { setMessage({ type: 'error', text: error.message || 'Could not register channel.' }); }
    finally { setWorking(false); }
  };

  const testChannel = async (channel) => {
    setWorking(true); setMessage(null);
    try { await apiRequest(`/api/v1/integration/mirth/channels/${channel.id}/health/`, { method: 'POST', body: JSON.stringify({}) }); setMessage({ type: 'success', text: `${channel.name} can reach the HMS inbound endpoint.` }); await load(); }
    catch (error) { setMessage({ type: 'error', text: error.message || 'Health check failed.' }); }
    finally { setWorking(false); }
  };

  const copy = async (value) => { await navigator.clipboard?.writeText(value); setMessage({ type: 'success', text: 'Copied to clipboard.' }); };

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8860B]">Interoperability operations</p><h1 className="mt-1 text-2xl font-semibold text-[#1C2B27]">Mirth Connect</h1><p className="mt-1 max-w-2xl text-sm text-slate-500">Use Mirth for device-specific HL7 v2 transformation. HMS receives normalized FHIR observations and never parses instrument dialects.</p></div><div className="flex items-center gap-2 border border-[#D8D4CD] bg-white px-3 py-2 text-xs text-slate-600"><ShieldCheck className="h-4 w-4 text-emerald-700" /> Protected channel</div></header>
        {message && <div className={`mb-4 flex items-center gap-2 border px-3 py-2 text-sm ${message.type === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{message.type === 'error' ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}{message.text}</div>}
        {newKey && <div className="mb-6 border border-amber-200 bg-amber-50 p-4"><p className="flex items-center gap-2 text-xs font-semibold uppercase text-amber-900"><KeyRound className="h-4 w-4" /> One-time API key</p><div className="mt-2 flex gap-2"><code className="min-w-0 flex-1 break-all bg-white p-2 text-xs text-slate-700">{newKey}</code><button type="button" onClick={() => copy(newKey)} className="flex items-center gap-1 border border-amber-300 px-3 text-xs font-medium text-amber-900"><Copy className="h-3.5 w-3.5" /> Copy</button></div></div>}
        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={createClient} className="border border-slate-200 bg-white p-5"><div className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-[#B8860B]" /><h2 className="text-sm font-semibold text-slate-900">1. Create Mirth credential</h2></div><p className="mt-1 text-xs text-slate-500">Paste this key into the Mirth destination connector Authorization header.</p><input required value={clientName} onChange={(event) => setClientName(event.target.value)} placeholder="e.g. Central LIS Mirth" className="mt-4 w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#B8860B]" /><button disabled={working} className="mt-3 flex items-center gap-2 bg-[#1C2B27] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"><Plus className="h-4 w-4" /> Create credential</button></form>
          <form onSubmit={createChannel} className="border border-slate-200 bg-white p-5"><div className="flex items-center gap-2"><Server className="h-4 w-4 text-[#B8860B]" /><h2 className="text-sm font-semibold text-slate-900">2. Register channel</h2></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Channel name" className="border border-slate-300 px-3 py-2 text-sm" /><input required value={form.source_system} onChange={(event) => setForm({ ...form, source_system: event.target.value })} placeholder="Source system, e.g. Roche LIS" className="border border-slate-300 px-3 py-2 text-sm" /><select value={form.protocol} onChange={(event) => setForm({ ...form, protocol: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm"><option value="hl7">HL7 v2 via Mirth</option><option value="fhir">FHIR via Mirth</option></select><select required value={form.client_id} onChange={(event) => setForm({ ...form, client_id: event.target.value })} className="border border-slate-300 px-3 py-2 text-sm"><option value="">Select credential</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}{channels.map((channel) => <option key={`existing-${channel.client_id}`} value={channel.client_id}>{channel.client_name}</option>)}</select><input value={form.mirth_base_url} onChange={(event) => setForm({ ...form, mirth_base_url: event.target.value })} placeholder="Mirth URL (optional)" className="border border-slate-300 px-3 py-2 text-sm sm:col-span-2" /><input value={form.channel_id} onChange={(event) => setForm({ ...form, channel_id: event.target.value })} placeholder="Mirth channel ID (optional)" className="border border-slate-300 px-3 py-2 text-sm sm:col-span-2" /></div><button disabled={working} className="mt-3 flex items-center gap-2 bg-[#B8860B] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"><Plus className="h-4 w-4" /> Register channel</button></form>
        </div>
        <section className="mt-6 border border-slate-200 bg-white p-5"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Activity className="h-4 w-4 text-[#B8860B]" /><h2 className="text-sm font-semibold text-slate-900">Registered channels</h2></div><button type="button" onClick={load} disabled={loading} className="flex items-center gap-1.5 border border-slate-200 px-3 py-2 text-xs"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh</button></div><div className="mt-4 grid gap-3 md:grid-cols-2">{channels.length ? channels.map((channel) => <div key={channel.id} className="border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{channel.name}</p><p className="mt-1 text-xs text-slate-500">{channel.source_system} · {channel.protocol.toUpperCase()}</p></div><span className="bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase text-emerald-800">{channel.status}</span></div><p className="mt-3 break-all font-mono text-[11px] text-slate-500">Inbound: {channel.inbound_url}</p><button type="button" onClick={() => testChannel(channel)} disabled={working} className="mt-3 flex items-center gap-1.5 border border-slate-200 px-3 py-2 text-xs font-medium"><Activity className="h-3.5 w-3.5" /> Test HMS endpoint</button></div>) : <p className="py-6 text-center text-sm text-slate-500">No Mirth channels registered.</p>}</div></section>
        <section className="mt-6 border border-slate-200 bg-white p-5"><h2 className="text-sm font-semibold text-slate-900">Recent normalized messages</h2><div className="mt-3 divide-y divide-slate-100">{messages.length ? messages.slice(0, 20).map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"><span className="font-mono text-slate-500">{item.correlation_id}</span><span>{item.source_system}</span><span className={item.status === 'accepted' ? 'text-emerald-700' : 'text-red-700'}>{item.status}</span><span className="text-slate-400">{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</span></div>) : <p className="py-6 text-sm text-slate-500">No normalized messages have arrived.</p>}</div></section>
      </div>
    </main>
  );
};

export default MirthConnect;
