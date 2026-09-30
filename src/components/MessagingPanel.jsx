import { useEffect, useState } from 'react';
import { ChevronRight, CircleHelp, LoaderCircle, MessageSquare, Plus, Send, UserRound, Users, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { messagingApi } from '../utils/api';

const formatTime = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const listData = (response) => Array.isArray(response) ? response : response?.results || [];

const MessagingPanel = ({ patient = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const requestedConversationId = Number(query.get('conversationId')) || null;
  const [conversations, setConversations] = useState([]);
  const [staff, setStaff] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(requestedConversationId);
  const [kind, setKind] = useState(() => patient ? 'patient' : query.get('kind') === 'staff' ? 'staff' : 'patient');
  const [statusFilter, setStatusFilter] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [draft, setDraft] = useState('');
  const [participants, setParticipants] = useState([]);
  const [internalNote, setInternalNote] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadConversations = async () => {
    const response = await messagingApi.getConversations({ kind, status: statusFilter });
    const rows = listData(response);
    setConversations(rows);
    if (selectedId && !rows.some((row) => row.id === selectedId)) setSelectedId(null);
    if (!selectedId && rows.length) setSelectedId(rows[0].id);
  };

  const loadMessages = async (id = selectedId) => {
    if (!id) {
      setMessages([]);
      return;
    }
    setMessages(listData(await messagingApi.getMessages(id)));
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [conversationResponse, staffResponse] = await Promise.all([
          messagingApi.getConversations({ kind, status: statusFilter }),
          patient ? Promise.resolve([]) : messagingApi.getStaff(),
        ]);
        if (!active) return;
        const rows = listData(conversationResponse);
        setConversations(rows);
        setStaff(listData(staffResponse));
        setSelectedId((current) => {
          if (requestedConversationId) {
            return rows.some((row) => row.id === requestedConversationId) ? requestedConversationId : null;
          }
          return rows.some((row) => row.id === current) ? current : rows[0]?.id || null;
        });
        if (requestedConversationId && !rows.some((row) => row.id === requestedConversationId)) {
          setError('This conversation is not available to your account.');
        }
      } catch (requestError) {
        if (active) setError(requestError.message || 'Unable to load conversations.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    const timer = window.setInterval(load, 20000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [kind, statusFilter, patient, location.search]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!selectedId) {
        setMessages([]);
        return;
      }
      try {
        const response = await messagingApi.getMessages(selectedId);
        if (active) setMessages(listData(response));
      } catch (requestError) {
        if (active) setError(requestError.message || 'Unable to load messages.');
      }
    };
    load();
    const timer = window.setInterval(load, 12000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [selectedId]);

  const selected = conversations.find((conversation) => conversation.id === selectedId);

  const createConversation = async (event) => {
    event.preventDefault();
    if (!patient && kind === 'staff' && participants.length === 0) {
      setError('Select at least one colleague to start a staff chat.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const conversation = await messagingApi.createConversation({
        subject,
        body: draft,
        ...(patient ? {} : { participant_ids: participants }),
      });
      setSubject('');
      setDraft('');
      setParticipants([]);
      setComposeOpen(false);
      setSelectedId(conversation.id);
      await loadConversations();
    } catch (requestError) {
      setError(requestError.message || 'Unable to start the conversation.');
    } finally {
      setBusy(false);
    }
  };

  const send = async (event) => {
    event.preventDefault();
    if (!draft.trim() || !selectedId) return;
    setBusy(true);
    setError('');
    try {
      await messagingApi.sendMessage(selectedId, { body: draft, is_internal_note: !patient && internalNote });
      setDraft('');
      setInternalNote(false);
      await Promise.all([loadMessages(selectedId), loadConversations()]);
    } catch (requestError) {
      setError(requestError.message || 'Unable to send this message.');
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (nextStatus) => {
    if (!selected) return;
    setBusy(true);
    setError('');
    try {
      await messagingApi.setConversationStatus(selected.id, nextStatus);
      await loadConversations();
    } catch (requestError) {
      setError(requestError.message || 'Unable to update conversation status.');
    } finally {
      setBusy(false);
    }
  };

  const assign = async (event) => {
    const value = event.target.value;
    if (!selected) return;
    setBusy(true);
    setError('');
    try {
      await messagingApi.assignConversation(selected.id, value || null);
      await loadConversations();
    } catch (requestError) {
      setError(requestError.message || 'Unable to assign this conversation.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-teal-50 text-teal-700"><MessageSquare size={18} /></span>
          <div>
            <h2 className="text-base font-semibold">{patient ? 'Messages with your hospital' : 'Message center'}</h2>
            <p className="text-xs text-slate-500">{patient ? 'Replies from your care team appear here.' : 'Patient conversations and secure staff chats.'}</p>
          </div>
        </div>
        <button type="button" onClick={() => setComposeOpen(true)} className="inline-flex h-9 items-center gap-2 rounded-md bg-teal-700 px-3 text-sm font-medium text-white hover:bg-teal-800">
          <Plus size={16} /> {patient ? 'New message' : 'New conversation'}
        </button>
      </div>

      {error && <div role="alert" className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800">{error}</div>}

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-4 py-2.5">
        {!patient && (
          <div className="inline-flex rounded-md border border-slate-200 p-0.5">
            <button type="button" onClick={() => { setKind('patient'); setSelectedId(null); navigate(`${location.pathname}?kind=patient`, { replace: true }); }} className={`rounded px-3 py-1.5 text-sm ${kind === 'patient' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Patient support</button>
            <button type="button" onClick={() => { setKind('staff'); setSelectedId(null); navigate(`${location.pathname}?kind=staff`, { replace: true }); }} className={`rounded px-3 py-1.5 text-sm ${kind === 'staff' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Staff chat</button>
          </div>
        )}
        {!patient && kind === 'patient' && (
          <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setSelectedId(null); }} aria-label="Filter conversations by status" className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700">
            <option value="">All statuses</option><option value="open">Open</option><option value="pending">Pending</option><option value="closed">Closed</option>
          </select>
        )}
      </div>

      <div className="grid min-h-[560px] grid-cols-1 md:grid-cols-[minmax(220px,0.78fr)_minmax(0,1.5fr)]">
        <aside className={`${selectedId ? 'hidden md:block' : 'block'} border-b border-slate-200 md:border-b-0 md:border-r`}>
          {loading ? <div className="flex items-center justify-center gap-2 p-8 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={16} /> Loading inbox</div> : conversations.length === 0 ? (
            <div className="px-5 py-12 text-center"><CircleHelp className="mx-auto text-slate-300" size={24} /><p className="mt-3 text-sm font-medium text-slate-700">No conversations yet</p><p className="mt-1 text-xs text-slate-500">Start a conversation when you’re ready.</p></div>
          ) : conversations.map((conversation) => (
            <button key={conversation.id} type="button" onClick={() => setSelectedId(conversation.id)} className={`block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 ${selectedId === conversation.id ? 'bg-teal-50/70' : ''}`}>
              <span className="flex items-start justify-between gap-2">
                <span className="line-clamp-1 text-sm font-semibold text-slate-800">{conversation.subject}</span>
                {conversation.unread_count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-teal-700 px-1 text-[10px] font-semibold text-white">{conversation.unread_count}</span>}
              </span>
              {!patient && conversation.patient_name && <span className="mt-1 block text-xs text-slate-500">{conversation.patient_name}</span>}
              <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-600">{conversation.latest_message || 'No messages'}</span>
              <span className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-slate-400"><span className="capitalize">{conversation.status}</span><span>{formatTime(conversation.last_message_at)}</span></span>
            </button>
          ))}
        </aside>

        <div className={`${selectedId ? 'flex' : 'hidden md:flex'} min-h-[560px] min-w-0 flex-col`}>
          {selected ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <button type="button" onClick={() => setSelectedId(null)} aria-label="Back to conversations" className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100 md:hidden"><ChevronRight className="rotate-180" size={18} /></button>
                  <div className="min-w-0"><h3 className="truncate text-sm font-semibold">{selected.subject}</h3><p className="text-xs capitalize text-slate-500">{selected.kind === 'staff' ? 'Private staff chat' : `${selected.status}${selected.assigned_to_name ? ` · ${selected.assigned_to_name}` : ' · unassigned'}`}</p></div>
                </div>
                {!patient && selected.kind === 'patient' && (
                  <div className="flex items-center gap-2">
                    <select value={selected.assigned_to || ''} onChange={assign} disabled={busy} aria-label="Assign conversation" className="h-9 max-w-44 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700">
                      <option value="">Unassigned</option>{staff.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.role}</option>)}
                    </select>
                    <button type="button" onClick={() => updateStatus(selected.status === 'closed' ? 'open' : 'closed')} disabled={busy} className="h-9 rounded-md border border-slate-200 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50">{selected.status === 'closed' ? 'Reopen' : 'Resolve'}</button>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-4">
                {messages.map((message) => {
                  const mine = message.is_mine;
                  return (
                    <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <article className={`max-w-[min(88%,42rem)] rounded-lg border px-3.5 py-2.5 ${message.is_internal_note ? 'border-amber-200 bg-amber-50' : mine ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-200 bg-white text-slate-800'}`}>
                        <div className="mb-1 flex flex-wrap items-center gap-x-2 text-[11px] opacity-75"><span className="font-semibold">{mine ? 'You' : message.sender_name}</span>{message.is_internal_note && <span>Staff-only note</span>}<time>{formatTime(message.created_at)}</time></div>
                        <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.body}</p>
                      </article>
                    </div>
                  );
                })}
              </div>
              {selected.status !== 'closed' && (
                <form onSubmit={send} className="border-t border-slate-200 p-3">
                  {!patient && selected.kind === 'patient' && <label className="mb-2 flex w-fit items-center gap-2 text-xs text-slate-600"><input type="checkbox" checked={internalNote} onChange={(event) => setInternalNote(event.target.checked)} /> Staff-only note</label>}
                  <div className="flex items-end gap-2">
                    <textarea value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={5000} rows={2} placeholder={internalNote ? 'Add a private staff note...' : 'Write a reply...'} className="min-h-11 flex-1 resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
                    <button type="submit" disabled={busy || !draft.trim()} aria-label="Send message" title="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-50"><Send size={17} /></button>
                  </div>
                </form>
              )}
            </>
          ) : <div className="m-auto max-w-sm px-6 text-center text-sm text-slate-500"><MessageSquare className="mx-auto text-slate-300" size={28} /><p className="mt-3 font-medium text-slate-700">Select a conversation</p><p className="mt-1">Your messages and replies will appear here.</p></div>}
        </div>
      </div>

      {composeOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setComposeOpen(false); }}>
          <form onSubmit={createConversation} className="w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><h3 className="text-base font-semibold">{patient ? 'Message the hospital' : kind === 'staff' ? 'Start a staff chat' : 'Start a patient conversation'}</h3><button type="button" onClick={() => setComposeOpen(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-md text-slate-500 hover:bg-slate-100"><X size={17} /></button></div>
            <div className="space-y-4 p-5">
              <label className="block text-sm font-medium text-slate-700">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={180} className="mt-1.5 h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-600" placeholder="What is this about?" /></label>
              {!patient && kind === 'staff' && <label className="block text-sm font-medium text-slate-700">Participants<select multiple value={participants.map(String)} onChange={(event) => setParticipants(Array.from(event.target.selectedOptions, (option) => Number(option.value)))} className="mt-1.5 min-h-28 w-full rounded-md border border-slate-300 p-2 text-sm">{staff.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.role}{member.department ? ` · ${member.department}` : ''}</option>)}</select><span className="mt-1 block text-xs font-normal text-slate-500">Select one or more colleagues. You will be included automatically.</span></label>}
              <label className="block text-sm font-medium text-slate-700">Message<textarea required value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={5000} rows={5} className="mt-1.5 w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600" placeholder={patient ? 'How can the hospital help?' : 'Write your first message...'} /></label>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3"><button type="button" onClick={() => setComposeOpen(false)} className="h-9 rounded-md border border-slate-300 px-3 text-sm text-slate-700 hover:bg-slate-50">Cancel</button><button type="submit" disabled={busy || !draft.trim()} className="inline-flex h-9 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50">{busy ? <LoaderCircle className="animate-spin" size={15} /> : kind === 'staff' && !patient ? <Users size={15} /> : <UserRound size={15} />} Send</button></div>
          </form>
        </div>
      )}
    </section>
  );
};

export default MessagingPanel;