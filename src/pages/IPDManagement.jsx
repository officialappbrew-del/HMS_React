import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, BedDouble, ClipboardList, Droplets, FileText, HeartPulse, LogOut, Plus, RefreshCw, Search, Send, Syringe } from 'lucide-react';
import { apiRequest } from '../utils/api';

const tabs = [
  ['census', 'Census', BedDouble], ['admit', 'Admission', Plus], ['vitals', 'Vitals', HeartPulse],
  ['notes', 'Progress notes', FileText], ['mar', 'MAR', Syringe], ['care', 'Care plans', ClipboardList],
  ['io', 'Intake / output', Droplets], ['records', 'Clinical records', FileText], ['charges', 'Charges', FileText],
  ['transfer', 'Transfer', BedDouble], ['discharge', 'Discharge', LogOut],
];
const emptyAdmission = { patient: '', diagnosis: '', admission_reason: '', arrival_mode: 'walk_in', ward: '', bed: '', emergency: false };

const IPDManagement = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('census');
  const [stays, setStays] = useState([]);
  const [beds, setBeds] = useState([]);
  const [selectedStay, setSelectedStay] = useState(null);
  const [wards, setWards] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [form, setForm] = useState(emptyAdmission);
  const [entry, setEntry] = useState({});
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientSearchResults, setPatientSearchResults] = useState([]);
  const [patientSearchLoading, setPatientSearchLoading] = useState(false);
  const [patientSearchError, setPatientSearchError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [stayData, bedData, wardData] = await Promise.all([
        apiRequest('/api/v1/ipd/stays/?status=admitted&page_size=100'),
        apiRequest('/api/v1/ipd/stays/bed_availability/'),
        apiRequest('/api/v1/ward-rounds/wards/?page_size=100'),
      ]);
      setStays(stayData.results || stayData); setBeds(bedData.beds || []);
      setWards(wardData.results || wardData);
      setAvailableBeds((bedData.beds || []).filter((bed) => bed.status === 'Available'));
    } catch (err) { setError(err.message || 'Unable to load IPD data.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const getPatientDisplayName = (patient) => {
    if (!patient) return '';
    return patient.name || patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unnamed Patient';
  };

  const getPatientIdentifier = (patient) => {
    if (!patient) return '';
    return patient.hospital_number || patient.hospitalNumber || patient.mrn || patient.patient_id || patient.user_id || patient.userId || patient.id || '';
  };

  const searchPatients = async (term) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) {
      setPatientSearchResults([]);
      setPatientSearchError('');
      return;
    }

    setPatientSearchLoading(true);
    setPatientSearchError('');

    try {
      const normalizedSearch = trimmedTerm.replace(/^(mrn[:\s-]+|patient\s+(id|number)[:\s-]+|search[:\s-]+)/i, '').trim() || trimmedTerm;
      const response = await Promise.race([
        apiRequest(`/api/v1/patients/patients/?search=${encodeURIComponent(normalizedSearch)}&page_size=20`),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Patient search timed out after 15 seconds')), 15000)),
      ]);

      const resultList = Array.isArray(response) ? response : response?.results || [];
      setPatientSearchResults(resultList);

      if (!resultList.length) {
        setPatientSearchError('No patients found matching your search.');
      }
    } catch (err) {
      setPatientSearchError(err.message || 'Unable to search patients.');
      setPatientSearchResults([]);
    } finally {
      setPatientSearchLoading(false);
    }
  };

  useEffect(() => {
    if (!patientSearchTerm.trim()) {
      setPatientSearchResults([]);
      setPatientSearchError('');
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      void searchPatients(patientSearchTerm);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [patientSearchTerm]);

  const selectPatientForAdmission = (patient) => {
    setForm({ ...form, patient: String(patient.id) });
    setPatientSearchTerm(getPatientDisplayName(patient));
    setPatientSearchResults([]);
    setPatientSearchError('');
  };

  const submitAdmission = async (event) => {
    event.preventDefault(); setWorking(true); setError('');
    try { await apiRequest('/api/v1/ipd/stays/', { method: 'POST', body: JSON.stringify({ ...form, patient: Number(form.patient), ward: form.ward ? Number(form.ward) : null, bed: form.bed ? Number(form.bed) : null }) }); setForm(emptyAdmission); setNotice('IPD admission created.'); setTab('census'); await load(); }
    catch (err) { setError(err.message || 'Admission could not be created.'); }
    finally { setWorking(false); }
  };

  const submitEntry = async (event) => {
    event.preventDefault(); if (!selectedStay) return;
    setWorking(true); setError('');
    const endpoint = tab === 'notes' ? 'progress-notes' : tab === 'mar' ? 'mar' : tab === 'care' ? 'care-plans' : tab === 'io' ? 'intake-output' : tab === 'records' ? 'clinical-records' : 'charges';
    const payload = tab === 'records' ? { stay: selectedStay.id, record_type: entry.record_type, status: 'open', payload: { details: entry.details || '' } } : { ...entry, stay: selectedStay.id };
    try { await apiRequest(`/api/v1/ipd/${endpoint}/`, { method: 'POST', body: JSON.stringify(payload) }); setEntry({}); setNotice('IPD record saved.'); }
    catch (err) { setError(err.message || 'Record could not be saved.'); }
    finally { setWorking(false); }
  };

  const submitTransfer = async (event) => {
    event.preventDefault(); if (!selectedStay) return;
    setWorking(true); setError('');
    try { await apiRequest(`/api/v1/ipd/stays/${selectedStay.id}/transfer/`, { method: 'POST', body: JSON.stringify({ to_bed: Number(entry.to_bed), reason: entry.reason, escort_details: entry.escort_details || '' }) }); setEntry({}); setNotice('Patient transferred successfully.'); await load(); setTab('census'); }
    catch (err) { setError(err.message || 'Transfer could not be completed.'); }
    finally { setWorking(false); }
  };

  const submitDischarge = async (event) => {
    event.preventDefault(); if (!selectedStay) return;
    setWorking(true); setError('');
    try { await apiRequest(`/api/v1/ipd/stays/${selectedStay.id}/discharge/`, { method: 'POST', body: JSON.stringify({ stay: selectedStay.id, diagnosis: entry.diagnosis, treatment_given: entry.treatment_given || '', procedures: entry.procedures || '', discharge_medications: [], follow_up_advice: entry.follow_up_advice || '', billing_cleared: true, summary_signed: true, belongings_returned: true }) }); setEntry({}); setSelectedStay(null); setNotice('Patient discharged and bed sent for cleaning.'); await load(); setTab('census'); }
    catch (err) { setError(err.message || 'Discharge could not be completed.'); }
    finally { setWorking(false); }
  };

  return <main className="min-h-screen bg-[#F7F5F2] p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-7xl">
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8860B]">Inpatient department</p><h1 className="mt-1 text-2xl font-semibold text-[#1C2B27]">IPD Command Centre</h1><p className="mt-1 text-sm text-slate-500">Admissions, live bed state, daily clinical records, and safe discharge workflow.</p></div><button type="button" onClick={load} className="flex items-center gap-2 border border-slate-300 bg-white px-3 py-2 text-xs"><RefreshCw className={loading ? 'animate-spin' : ''} size={14} /> Refresh</button></header>
    {(error || notice) && <div className={`mb-4 border px-3 py-2 text-sm ${error ? 'border-red-200 bg-red-50 text-red-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{error || notice}</div>}
    <nav className="mb-5 flex gap-1 overflow-x-auto border-b border-slate-200 pb-0.5">
      {tabs.map(([id, name, Icon]) => <button key={id} type="button" onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-2 border-b-2 px-2 py-3 text-xs font-medium sm:px-3 ${tab === id ? 'border-[#B8860B] text-[#8A6508]' : 'border-transparent text-slate-500'}`}><Icon size={15} /> <span className="hidden xs:inline">{name}</span></button>)}
    </nav>
    {tab === 'census' && <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <section className="border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Admitted patients ({stays.length})</h2>
          <button type="button" onClick={() => setTab('admit')} className="flex items-center gap-1 bg-[#1C2B27] px-3 py-2 text-xs text-white"><Plus size={14} /> Admit</button>
        </div>
        <div className="space-y-2">
          {stays.map((stay) => <button type="button" key={stay.id} onClick={() => setSelectedStay(stay)} className={`w-full border p-3 text-left ${selectedStay?.id === stay.id ? 'border-[#B8860B] bg-[#F6F2E7]' : 'border-slate-200 hover:border-[#B8860B]'}`}>
            <div className="flex flex-wrap justify-between gap-2">
              <span className="text-sm font-semibold break-words">{stay.patient_name}</span>
              <span className="font-mono text-[10px] text-slate-500 shrink-0">{stay.admission_number}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 break-words">{stay.ward_name || 'Awaiting ward'} · Bed {stay.bed_number || 'Unallocated'} · {stay.diagnosis}</p>
          </button>)}
          {!stays.length && <p className="py-8 text-center text-sm text-slate-500">No admitted patients.</p>}
        </div>
      </section>
      
      <section className="border border-slate-200 bg-white p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <BedDouble size={16} /> Live bed availability
        </h2>
        
        {/* FIXED: Responsive bed stats grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {['Available', 'Occupied', 'Under Cleaning', 'Maintenance'].map((status) => (
            <div key={status} className="min-w-0 rounded border border-slate-200 p-2 sm:p-3">
              <p className="break-words text-[9px] uppercase tracking-wide text-slate-500 sm:text-[10px]">{status}</p>
              <p className="mt-1 text-xl font-semibold leading-none sm:text-2xl">{beds.filter((bed) => bed.status === status).length}</p>
            </div>
          ))}
        </div>
        
        {/* FIXED: Responsive bed list with better overflow handling */}
        <div className="mt-4 max-h-[400px] overflow-y-auto pr-1">
          <div className="space-y-1">
            {beds.slice(0, 12).map((bed) => (
              <div key={bed.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-2 text-[11px] sm:text-xs">
                <span className="min-w-0 flex-1 break-words pr-2">{bed.ward_name} · Bed {bed.bed_number}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  bed.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 
                  bed.status === 'Occupied' ? 'bg-red-50 text-red-600' : 
                  bed.status === 'Under Cleaning' ? 'bg-sky-50 text-sky-600' : 
                  'bg-violet-50 text-violet-600'
                }`}>{bed.status}</span>
              </div>
            ))}
          </div>
          {beds.length > 12 && (
            <p className="mt-2 text-center text-[10px] text-slate-400">Showing 12 of {beds.length} beds</p>
          )}
        </div>
      </section>
    </div>}
    
    {tab === 'admit' && <form onSubmit={submitAdmission} className="max-w-3xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold">Create inpatient admission</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="relative sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-slate-700">Patient</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input type="text" value={patientSearchTerm} onChange={(e) => setPatientSearchTerm(e.target.value)} placeholder="Search patient by name or MRN" className="w-full border border-slate-300 bg-white py-2 pl-9 pr-10 text-sm" required={!form.patient} />
            <button type="button" onClick={() => { setPatientSearchTerm(''); setPatientSearchResults([]); setPatientSearchError(''); setForm({ ...form, patient: '' }); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-wide text-slate-500">Clear</button>
          </div>
          {patientSearchLoading && <p className="mt-2 text-xs text-slate-500">Searching patients...</p>}
          {patientSearchError && <p className="mt-2 text-xs text-red-600">{patientSearchError}</p>}
          {patientSearchResults.length > 0 && <div className="absolute z-20 mt-1 w-full rounded border border-slate-200 bg-white shadow-lg">
            <div className="max-h-56 overflow-y-auto">
              {patientSearchResults.map((patient) => <button key={patient.id} type="button" onClick={() => selectPatientForAdmission(patient)} className="flex w-full flex-wrap items-center justify-between border-b border-slate-100 px-3 py-2 text-left hover:bg-slate-50">
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-sm font-medium text-slate-800 break-words">{getPatientDisplayName(patient)}</p>
                  <p className="text-[11px] text-slate-500 break-words">{getPatientIdentifier(patient) || 'No MRN'} · {patient.phone || 'No phone'}</p>
                </div>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-slate-400">Select</span>
              </button>)}
            </div>
          </div>}
          {form.patient && <div className="mt-2 rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs text-emerald-700 break-words">Selected patient ID: {form.patient}</div>}
        </div>
        <select value={form.arrival_mode} onChange={(e) => setForm({ ...form, arrival_mode: e.target.value })} className="border border-slate-300 px-3 py-2 text-sm">
          <option value="walk_in">Walk-in</option>
          <option value="ambulance">Ambulance</option>
          <option value="referral">Referral</option>
          <option value="opd">OPD transfer</option>
        </select>
        <select value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value, bed: '' })} className="border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select ward</option>
          {wards.map((ward) => <option key={ward.id} value={ward.id}>{ward.wardName || ward.ward_name}</option>)}
        </select>
        <select value={form.bed} onChange={(e) => setForm({ ...form, bed: e.target.value })} className="border border-slate-300 px-3 py-2 text-sm sm:col-span-2">
          <option value="">Allocate available bed</option>
          {availableBeds.filter((bed) => !form.ward || String(bed.ward_id) === String(form.ward)).map((bed) => <option key={bed.id} value={bed.id}>{bed.ward_name} · Bed {bed.bed_number}</option>)}
        </select>
        <input required value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} placeholder="Primary diagnosis" className="border border-slate-300 px-3 py-2 text-sm sm:col-span-2" />
        <textarea value={form.admission_reason} onChange={(e) => setForm({ ...form, admission_reason: e.target.value })} placeholder="Reason for admission" className="min-h-24 border border-slate-300 px-3 py-2 text-sm sm:col-span-2" />
        <label className="flex items-center gap-2 text-xs sm:col-span-2"><input type="checkbox" checked={form.emergency} onChange={(e) => setForm({ ...form, emergency: e.target.checked })} /> Emergency fast-track</label>
      </div>
      <button disabled={working} className="mt-4 flex items-center gap-2 bg-[#1C2B27] px-4 py-2 text-xs font-semibold text-white"><Plus size={15} /> Create admission</button>
    </form>}
    
    {['notes', 'mar', 'care', 'io', 'records', 'charges'].includes(tab) && <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold">Select an admitted patient</h2>
        <div className="mt-4 space-y-2">
          {stays.map((stay) => <button type="button" key={stay.id} onClick={() => setSelectedStay(stay)} className={`w-full border p-3 text-left ${selectedStay?.id === stay.id ? 'border-[#B8860B] bg-[#F6F2E7]' : 'border-slate-200'}`}>
            <p className="text-sm font-medium break-words">{stay.patient_name}</p>
            <p className="text-xs text-slate-500 break-words">{stay.ward_name} · Bed {stay.bed_number}</p>
          </button>)}
        </div>
      </div>
      <form onSubmit={submitEntry} className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold">{tab === 'notes' ? 'SOAP progress note' : tab === 'mar' ? 'Medication administration' : tab === 'care' ? 'Nursing care plan' : tab === 'io' ? 'Intake / output' : tab === 'records' ? 'Clinical record' : 'Manual charge'}</h2>
        {tab === 'notes' ? <div className="mt-4 space-y-3">{['subjective', 'objective', 'assessment', 'plan'].map((field) => <textarea key={field} required={field === 'assessment' || field === 'plan'} value={entry[field] || ''} onChange={(e) => setEntry({ ...entry, [field]: e.target.value })} placeholder={field[0].toUpperCase() + field.slice(1)} className="min-h-20 w-full border border-slate-300 p-2 text-sm" />)}</div> : tab === 'mar' ? <div className="mt-4 space-y-3"><input required value={entry.medication_name || ''} onChange={(e) => setEntry({ ...entry, medication_name: e.target.value })} placeholder="Medication" className="w-full border border-slate-300 p-2 text-sm" /><input required value={entry.dose || ''} onChange={(e) => setEntry({ ...entry, dose: e.target.value })} placeholder="Dose" className="w-full border border-slate-300 p-2 text-sm" /><input required value={entry.route || ''} onChange={(e) => setEntry({ ...entry, route: e.target.value })} placeholder="Route" className="w-full border border-slate-300 p-2 text-sm" /><input required type="datetime-local" value={entry.scheduled_at || ''} onChange={(e) => setEntry({ ...entry, scheduled_at: e.target.value })} className="w-full border border-slate-300 p-2 text-sm" /></div> : tab === 'care' ? <div className="mt-4 space-y-3"><input required value={entry.goal || ''} onChange={(e) => setEntry({ ...entry, goal: e.target.value })} placeholder="Daily goal" className="w-full border border-slate-300 p-2 text-sm" /><textarea required value={entry.intervention || ''} onChange={(e) => setEntry({ ...entry, intervention: e.target.value })} placeholder="Intervention" className="min-h-24 w-full border border-slate-300 p-2 text-sm" /></div> : tab === 'io' ? <div className="mt-4 space-y-3"><select required value={entry.category || ''} onChange={(e) => setEntry({ ...entry, category: e.target.value })} className="w-full border border-slate-300 p-2 text-sm"><option value="">Intake or output</option><option value="intake">Intake</option><option value="output">Output</option></select><input required value={entry.item || ''} onChange={(e) => setEntry({ ...entry, item: e.target.value })} placeholder="Item (IV fluid, urine, drain)" className="w-full border border-slate-300 p-2 text-sm" /><input required type="number" min="0" value={entry.amount_ml || ''} onChange={(e) => setEntry({ ...entry, amount_ml: e.target.value })} placeholder="Amount in ml" className="w-full border border-slate-300 p-2 text-sm" /></div> : tab === 'records' ? <div className="mt-4 space-y-3"><select required value={entry.record_type || ''} onChange={(e) => setEntry({ ...entry, record_type: e.target.value })} className="w-full border border-slate-300 p-2 text-sm"><option value="">Record type</option><option value="shift_handover">Shift handover</option><option value="wound_care">Wound care</option><option value="patient_observation">Patient observation</option><option value="procedure_order">Procedure order</option><option value="specialist_referral">Specialist referral</option><option value="consent">Consent</option><option value="advance_directive">Advance directive</option><option value="medico_legal">Medico-legal case</option></select><textarea required value={entry.details || ''} onChange={(e) => setEntry({ ...entry, details: e.target.value })} placeholder="Record details" className="min-h-28 w-full border border-slate-300 p-2 text-sm" /></div> : <div className="mt-4 space-y-3"><input required value={entry.description || ''} onChange={(e) => setEntry({ ...entry, description: e.target.value })} placeholder="Charge description" className="w-full border border-slate-300 p-2 text-sm" /><input required value={entry.category || ''} onChange={(e) => setEntry({ ...entry, category: e.target.value })} placeholder="Category" className="w-full border border-slate-300 p-2 text-sm" /><input required type="number" min="0" value={entry.unit_price || ''} onChange={(e) => setEntry({ ...entry, unit_price: e.target.value })} placeholder="Unit price" className="w-full border border-slate-300 p-2 text-sm" /></div>}
        <button disabled={working || !selectedStay} className="mt-4 flex items-center gap-2 bg-[#B8860B] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"><Send size={14} /> Save record</button>
      </form>
    </section>}
    
    {['transfer', 'discharge'].includes(tab) && <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold">Select admitted patient</h2>
        <div className="mt-4 space-y-2">
          {stays.map((stay) => <button type="button" key={stay.id} onClick={() => setSelectedStay(stay)} className={`w-full border p-3 text-left ${selectedStay?.id === stay.id ? 'border-[#B8860B] bg-[#F6F2E7]' : 'border-slate-200'}`}>
            <p className="text-sm font-medium break-words">{stay.patient_name}</p>
            <p className="text-xs text-slate-500 break-words">{stay.ward_name} · Bed {stay.bed_number}</p>
          </button>)}
        </div>
      </div>
      <form onSubmit={tab === 'transfer' ? submitTransfer : submitDischarge} className="border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold">{tab === 'transfer' ? 'Transfer patient' : 'Controlled discharge'}</h2>
        {tab === 'transfer' ? <div className="mt-4 space-y-3"><select required value={entry.to_bed || ''} onChange={(e) => setEntry({ ...entry, to_bed: e.target.value })} className="w-full border border-slate-300 p-2 text-sm"><option value="">Destination available bed</option>{availableBeds.filter((bed) => bed.patient_id !== selectedStay?.patient_id).map((bed) => <option key={bed.id} value={bed.id}>{bed.ward_name} · Bed {bed.bed_number}</option>)}</select><textarea required value={entry.reason || ''} onChange={(e) => setEntry({ ...entry, reason: e.target.value })} placeholder="Transfer reason" className="min-h-20 w-full border border-slate-300 p-2 text-sm" /><input value={entry.escort_details || ''} onChange={(e) => setEntry({ ...entry, escort_details: e.target.value })} placeholder="Escort details" className="w-full border border-slate-300 p-2 text-sm" /></div> : <div className="mt-4 space-y-3"><textarea required value={entry.diagnosis || ''} onChange={(e) => setEntry({ ...entry, diagnosis: e.target.value })} placeholder="Final diagnosis" className="min-h-20 w-full border border-slate-300 p-2 text-sm" /><textarea value={entry.treatment_given || ''} onChange={(e) => setEntry({ ...entry, treatment_given: e.target.value })} placeholder="Treatment given" className="min-h-20 w-full border border-slate-300 p-2 text-sm" /><textarea value={entry.procedures || ''} onChange={(e) => setEntry({ ...entry, procedures: e.target.value })} placeholder="Procedures" className="min-h-20 w-full border border-slate-300 p-2 text-sm" /><textarea value={entry.follow_up_advice || ''} onChange={(e) => setEntry({ ...entry, follow_up_advice: e.target.value })} placeholder="Follow-up advice" className="min-h-20 w-full border border-slate-300 p-2 text-sm" /><p className="text-xs text-slate-500">This action confirms billing clearance, signed summary, and belongings returned.</p></div>}
        <button disabled={working || !selectedStay} className="mt-4 flex items-center gap-2 bg-[#1C2B27] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"><Send size={14} /> {tab === 'transfer' ? 'Transfer patient' : 'Complete discharge'}</button>
      </form>
    </section>}
    
    {tab === 'vitals' && <div className="border border-slate-200 bg-white p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold"><Activity size={16} /> Existing vitals workflow</h2>
      <p className="mt-2 text-sm text-slate-500">Use the selected inpatient context to record BP, pulse, temperature, SpO2, respiratory rate, and pain score through the Vital Signs module.</p>
      <button type="button" onClick={() => navigate('/vital-signs', { state: { from: 'ipd' } })} className="mt-4 inline-flex items-center gap-2 bg-[#1C2B27] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#263b36] focus:outline-none focus:ring-2 focus:ring-[#1C2B27] focus:ring-offset-2"><HeartPulse size={14} /> Open vitals charting</button>
    </div>}
  </div></main>;
};
export default IPDManagement;