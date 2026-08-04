import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../utils/api';
import {
  fetchMedicalRecords,
  fetchMedicalRecord,
  createMedicalRecord,
  createProgressNote,
  fetchProgressNotes,
  createProblem,
  createAllergy,
  createDocument,
  clearError,
  setCurrentRecord,
} from '../features/emrSlice';
import {
  FileText, Search, Plus, X, ChevronRight, ChevronLeft,
  Loader2, User, ClipboardList, AlertTriangle, FolderOpen,
  Stethoscope, Activity, Pill, Shield, CheckCircle,
  AlertCircle, Clock, Edit, Trash2, Eye, Download,
  Save, Send
} from 'lucide-react';

const EMR = () => {
  const dispatch = useDispatch();
  const { medicalRecords, progressNotes, problems, allergies, documents, currentRecord, loading, error } = useSelector(state => state.emr);
  const { patients } = useSelector(state => state.patient || { patients: [] });

  const [searchTerm, setSearchTerm] = useState('');
  const [patientOptions, setPatientOptions] = useState(patients || []);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('records');
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [interactionAlerts, setInteractionAlerts] = useState([]);
  const [medicationLoading, setMedicationLoading] = useState(false);

  const [recordForm, setRecordForm] = useState({
    record_type: 'outpatient',
    chief_complaint: '',
    history_of_present_illness: '',
    past_medical_history: '',
    family_history: '',
    social_history: '',
  });

  const [noteForm, setNoteForm] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    note_type: 'progress',
  });

  const [problemForm, setProblemForm] = useState({
    problem: '',
    icd10_code: '',
    onset_date: '',
    notes: '',
  });

  const [allergyForm, setAllergyForm] = useState({
    allergen: '',
    allergy_type: 'drug',
    reaction: '',
    severity: 'moderate',
    first_identified: '',
  });

  const [uploadForm, setUploadForm] = useState({
    document_type: 'lab_result',
    title: '',
    description: '',
  });
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    dispatch(fetchMedicalRecords());
  }, [dispatch]);

  useEffect(() => {
    setPatientOptions(patients);
  }, [patients]);

  const handleSearchPatients = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setPatientOptions(patients);
      return;
    }
    try {
      const data = await apiRequest(`/api/v1/patients/patients/?search=${encodeURIComponent(term)}&page_size=20`);
      const list = Array.isArray(data) ? data : (data.results || []);
      setPatientOptions(list);
    } catch {
      setPatientOptions(patients || []);
    }
  };

  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim());
    setPatientOptions([]);
    setTimelineLoading(true);
    setMedicationLoading(true);
    try {
      const timelineData = await apiRequest(`/api/v1/emr/medical-records/timeline/?patient_id=${patient.id}`);
      setTimeline(timelineData.timeline || []);
      const alertData = await apiRequest(`/api/v1/emr/medical-records/alerts/?patient_id=${patient.id}`);
      const alertList = [];
      if (alertData.dnr_order) {
        alertList.push({
          id: 'dnr',
          severity: 'critical',
          title: 'DNR Order',
          message: alertData.dnr_order_reason || 'Patient has a documented DNR order.',
        });
      }
      if (alertData.allergies?.length) {
        alertList.push({
          id: 'allergy',
          severity: 'high',
          title: 'Allergy Alert',
          message: alertData.allergies.map(item => `${item.allergen} (${item.severity})`).join(', '),
        });
      }
      setAlerts(alertList);

      const historyData = await apiRequest(`/api/v1/clinical/prescriptions/history/?patient=${patient.id}`);
      const historyItems = historyData.medications || [];
      setMedicationHistory(historyItems);
      if (historyItems.length) {
        const interactionData = await apiRequest('/api/v1/clinical/prescriptions/interaction-check/', {
          method: 'POST',
          body: JSON.stringify({ prescription_ids: historyItems.map(item => item.id) }),
        });
        setInteractionAlerts(interactionData.interactions || []);
      } else {
        setInteractionAlerts([]);
      }
    } catch (error) {
      setTimeline([]);
      setAlerts([]);
      setMedicationHistory([]);
      setInteractionAlerts([]);
    } finally {
      setTimelineLoading(false);
      setMedicationLoading(false);
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    const result = await dispatch(createMedicalRecord({
      patient: selectedPatient?.id,
      visit: selectedPatient?.current_visit_id || undefined,
      ...recordForm,
    }));
    if (createMedicalRecord.fulfilled.match(result)) {
      setShowRecordForm(false);
      setRecordForm({
        record_type: 'outpatient', chief_complaint: '', history_of_present_illness: '',
        past_medical_history: '', family_history: '', social_history: '',
      });
      dispatch(fetchMedicalRecords());
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!currentRecord) return;
    const result = await dispatch(createProgressNote({
      medical_record: currentRecord.id,
      ...noteForm,
    }));
    if (createProgressNote.fulfilled.match(result)) {
      setShowNoteForm(false);
      setNoteForm({ subjective: '', objective: '', assessment: '', plan: '', note_type: 'progress' });
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    if (!currentRecord) return;
    const result = await dispatch(createProblem({
      medical_record: currentRecord.id,
      patient: selectedPatient?.id,
      ...problemForm,
    }));
    if (createProblem.fulfilled.match(result)) {
      setShowProblemForm(false);
      setProblemForm({ problem: '', icd10_code: '', onset_date: '', notes: '' });
    }
  };

  const handleAddAllergy = async (e) => {
    e.preventDefault();
    if (!currentRecord) return;
    const result = await dispatch(createAllergy({
      medical_record: currentRecord.id,
      patient: selectedPatient?.id,
      ...allergyForm,
    }));
    if (createAllergy.fulfilled.match(result)) {
      setShowAllergyForm(false);
      setAllergyForm({ allergen: '', allergy_type: 'drug', reaction: '', severity: 'moderate', first_identified: '' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!currentRecord || !uploadFile) return;
    const result = await dispatch(createDocument({
      data: {
        medical_record: currentRecord.id,
        patient: selectedPatient?.id,
        ...uploadForm,
      },
      file: uploadFile,
    }));
    if (createDocument.fulfilled.match(result)) {
      setShowUploadModal(false);
      setUploadForm({ document_type: 'lab_result', title: '', description: '' });
      setUploadFile(null);
    }
  };

  const loadRecordDetails = async (record) => {
    dispatch(setCurrentRecord(record));
    dispatch(fetchProgressNotes({ medical_record: record.id }));
    await dispatch(fetchMedicalRecord(record.id));
    // Load related problems and allergies
    const problemsData = await apiRequest(`/api/v1/emr/problem-list/?medical_record=${record.id}`);
    const problemsList = Array.isArray(problemsData) ? problemsData : (problemsData.results || []);
    const allergiesData = await apiRequest(`/api/v1/emr/allergies/?medical_record=${record.id}`);
    const allergiesList = Array.isArray(allergiesData) ? allergiesData : (allergiesData.results || []);
    dispatch({ type: 'emr/setProblems', payload: problemsList });
    dispatch({ type: 'emr/setAllergies', payload: allergiesList });
  };

  const tabs = [
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'notes', label: 'Progress Notes', icon: ClipboardList },
    { id: 'problems', label: 'Problem List', icon: Activity },
    { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
  ];

  return (
    <div className="emr p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-500" />
          Electronic Medical Records
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive patient clinical documentation</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button onClick={() => dispatch(clearError())} className="float-right text-red-500 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Patient Search */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Patient</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, hospital number, phone..."
                value={searchTerm}
                onChange={(e) => handleSearchPatients(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {searchTerm && patientOptions.length > 0 && !selectedPatient && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
                {patientOptions.map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()}
                      </span>
                      <div className="text-xs text-gray-500">
                        {patient.hospital_number && `HN: ${patient.hospital_number} • `}
                        {patient.phone}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Actions</label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRecordForm(true)}
                className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 text-sm font-medium"
              >
                <Plus className="w-4 h-4 inline mr-1" />New Record
              </button>
              <button
                onClick={() => setShowRecordForm(true)}
                disabled={!selectedPatient}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm font-medium disabled:opacity-50"
              >
                <ClipboardList className="w-4 h-4 inline mr-1" />New Note
              </button>
            </div>
          </div>
        </div>

        {selectedPatient && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {(selectedPatient.name || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedPatient.name || `${selectedPatient.first_name || ''} ${selectedPatient.last_name || ''}`.trim()}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  <span>{selectedPatient.hospital_number || 'No HN'}</span>
                  <span>•</span>
                  <span>{selectedPatient.phone || 'No phone'}</span>
                  <span>•</span>
                  <span>{selectedPatient.gender || 'Unknown'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setSelectedPatient(null); setSearchTerm(''); }}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 sm:p-6">
          {!selectedPatient ? (
            <div className="text-center py-12 text-gray-400">
              <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Select a patient to view their EMR</p>
            </div>
          ) : (
            <EMRTabContent
              activeTab={activeTab}
              selectedPatient={selectedPatient}
              timeline={timeline}
              alerts={alerts}
              timelineLoading={timelineLoading}
              medicationHistory={medicationHistory}
              interactionAlerts={interactionAlerts}
              medicationLoading={medicationLoading}
              medicalRecords={medicalRecords}
              progressNotes={progressNotes}
              problems={problems}
              allergies={allergies}
              documents={documents}
              currentRecord={currentRecord}
              loading={loading}
              showRecordForm={showRecordForm}
              setShowRecordForm={setShowRecordForm}
              showNoteForm={showNoteForm}
              setShowNoteForm={setShowNoteForm}
              showProblemForm={showProblemForm}
              setShowProblemForm={setShowProblemForm}
              showAllergyForm={showAllergyForm}
              setShowAllergyForm={setShowAllergyForm}
              showUploadModal={showUploadModal}
              setShowUploadModal={setShowUploadModal}
              recordForm={recordForm}
              setRecordForm={setRecordForm}
              noteForm={noteForm}
              setNoteForm={setNoteForm}
              problemForm={problemForm}
              setProblemForm={setProblemForm}
              allergyForm={allergyForm}
              setAllergyForm={setAllergyForm}
              uploadForm={uploadForm}
              setUploadForm={setUploadForm}
              uploadFile={uploadFile}
              setUploadFile={setUploadFile}
              onCreateRecord={handleCreateRecord}
              onAddNote={handleAddNote}
              onAddProblem={handleAddProblem}
              onAddAllergy={handleAddAllergy}
              onUpload={handleUpload}
              onLoadRecord={loadRecordDetails}
              dispatch={dispatch}
              apiRequest={apiRequest}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const EMRTabContent = ({
  activeTab, selectedPatient, medicalRecords, progressNotes, problems,
  timeline, alerts, timelineLoading, medicationHistory, interactionAlerts, medicationLoading,
  allergies, documents, currentRecord, loading,
  showRecordForm, setShowRecordForm, showNoteForm, setShowNoteForm,
  showProblemForm, setShowProblemForm, showAllergyForm, setShowAllergyForm,
  showUploadModal, setShowUploadModal,
  recordForm, setRecordForm, noteForm, setNoteForm,
  problemForm, setProblemForm, allergyForm, setAllergyForm,
  uploadForm, setUploadForm, uploadFile, setUploadFile,
  onCreateRecord, onAddNote, onAddProblem, onAddAllergy, onUpload,
  onLoadRecord, dispatch, apiRequest
}) => {
  if (activeTab === 'records') {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800">Clinical Alerts</h4>
              <p className="text-sm text-red-700">Important allergy and DNR information is surfaced here for rapid review.</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {timelineLoading ? (
              <div className="text-sm text-red-700">Loading alerts...</div>
            ) : alerts.length === 0 ? (
              <div className="text-sm text-red-700">No active allergy or DNR alerts.</div>
            ) : alerts.map(alert => (
              <div key={alert.id} className="rounded-lg border border-red-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-red-600">{alert.severity}</span>
                </div>
                <p className="mt-1 text-sm text-gray-700">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Patient Timeline</h3>
            <span className="text-xs text-gray-500">Chronological EMR history</span>
          </div>
          {timelineLoading ? (
            <div className="text-center py-6 text-gray-400">Loading timeline...</div>
          ) : timeline.length === 0 ? (
            <div className="text-center py-6 text-gray-400">No clinical history available yet.</div>
          ) : (
            <ol className="space-y-3 border-l border-gray-200 ml-2 pl-4">
              {timeline.map(item => (
                <li key={`${item.type}-${item.id}`} className="relative">
                  <span className="absolute -left-[1.1rem] top-1 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-white" />
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <span className="text-[11px] uppercase tracking-wide text-gray-500">{item.type}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{item.summary}</p>
                    <p className="mt-2 text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Medication Safety</h3>
              <p className="text-sm text-violet-700">Recent prescriptions and possible drug interactions.</p>
            </div>
            <Shield className="w-5 h-5 text-violet-600" />
          </div>
          {medicationLoading ? (
            <div className="mt-3 text-sm text-violet-700">Loading medication history...</div>
          ) : medicationHistory.length === 0 ? (
            <div className="mt-3 text-sm text-violet-700">No active prescriptions found for this patient.</div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-violet-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">Prescription History</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  {medicationHistory.map(item => (
                    <li key={item.id} className="flex items-center justify-between gap-3 rounded border border-gray-200 px-2 py-2">
                      <span>{item.drug_name} • {item.dosage} • {item.frequency}</span>
                      <span className="text-xs text-gray-500">{item.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Interaction Warnings</p>
                {interactionAlerts.length === 0 ? (
                  <p className="mt-2 text-sm text-amber-700">No known interactions detected in the current prescription list.</p>
                ) : (
                  <ul className="mt-2 space-y-2 text-sm text-amber-800">
                    {interactionAlerts.map((item, index) => (
                      <li key={`${item.drugs.join('-')}-${index}`} className="rounded border border-amber-200 bg-white px-2 py-2">
                        {item.drugs.join(' + ')} — {item.message}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Medical Records</h3>
          <button
            onClick={() => setShowRecordForm(!showRecordForm)}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 inline mr-1" />New Record
          </button>
        </div>
        {showRecordForm && (
          <form onSubmit={onCreateRecord} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Record Type</label>
                <select value={recordForm.record_type} onChange={e => setRecordForm({...recordForm, record_type: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="outpatient">Outpatient</option>
                  <option value="inpatient">Inpatient</option>
                  <option value="emergency">Emergency</option>
                  <option value="day_care">Day Care</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Chief Complaint</label>
              <textarea value={recordForm.chief_complaint} onChange={e => setRecordForm({...recordForm, chief_complaint: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows="2" placeholder="Patient's main complaint..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">History of Present Illness</label>
              <textarea value={recordForm.history_of_present_illness} onChange={e => setRecordForm({...recordForm, history_of_present_illness: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows="3" placeholder="Detailed history..." />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">Create Record</button>
              <button type="button" onClick={() => setShowRecordForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        )}
        {loading && medicalRecords.length === 0 ? (
          <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />Loading records...</div>
        ) : medicalRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No medical records found</div>
        ) : (
          <div className="space-y-3">
            {medicalRecords.map(record => (
              <div key={record.id} className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer" onClick={() => onLoadRecord(record)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Record #{record.record_number || record.id}</p>
                    <p className="text-sm text-gray-500">{record.chief_complaint || 'No chief complaint'}</p>
                    <p className="text-xs text-gray-400 mt-1">{record.record_type} • {new Date(record.created_at).toLocaleDateString()}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Medical Records</h3>
          <button
            onClick={() => setShowRecordForm(!showRecordForm)}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 inline mr-1" />New Record
          </button>
        </div>
        {showRecordForm && (
          <form onSubmit={onCreateRecord} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Record Type</label>
                <select value={recordForm.record_type} onChange={e => setRecordForm({...recordForm, record_type: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="outpatient">Outpatient</option>
                  <option value="inpatient">Inpatient</option>
                  <option value="emergency">Emergency</option>
                  <option value="day_care">Day Care</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Chief Complaint</label>
              <textarea value={recordForm.chief_complaint} onChange={e => setRecordForm({...recordForm, chief_complaint: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows="2" placeholder="Patient's main complaint..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">History of Present Illness</label>
              <textarea value={recordForm.history_of_present_illness} onChange={e => setRecordForm({...recordForm, history_of_present_illness: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows="3" placeholder="Detailed history..." />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600">Create Record</button>
              <button type="button" onClick={() => setShowRecordForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        )}
        {loading && medicalRecords.length === 0 ? (
          <div className="text-center py-8"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />Loading records...</div>
        ) : medicalRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No medical records found</div>
        ) : (
          <div className="space-y-3">
            {medicalRecords.map(record => (
              <div key={record.id} className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer" onClick={() => onLoadRecord(record)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Record #{record.record_number || record.id}</p>
                    <p className="text-sm text-gray-500">{record.chief_complaint || 'No chief complaint'}</p>
                    <p className="text-xs text-gray-400 mt-1">{record.record_type} • {new Date(record.created_at).toLocaleDateString()}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'notes') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Progress Notes</h3>
          <button
            onClick={() => setShowNoteForm(!showNoteForm)}
            disabled={!currentRecord}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 inline mr-1" />New Note
          </button>
        </div>
        {!currentRecord && (
          <div className="text-center py-8 text-gray-400">Select a medical record first</div>
        )}
        {showNoteForm && currentRecord && (
          <form onSubmit={onAddNote} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Note Type</label>
              <select value={noteForm.note_type} onChange={e => setNoteForm({...noteForm, note_type: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="progress">Progress Note</option>
                <option value="consultation">Consultation Note</option>
                <option value="procedure">Procedure Note</option>
                <option value="discharge">Discharge Summary</option>
                <option value="nursing">Nursing Note</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Subjective (S)</label>
                <textarea value={noteForm.subjective} onChange={e => setNoteForm({...noteForm, subjective: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows="3" placeholder="What the patient reports..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Objective (O)</label>
                <textarea value={noteForm.objective} onChange={e => setNoteForm({...noteForm, objective: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows="3" placeholder="Physical exam findings..." />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Assessment (A)</label>
              <textarea value={noteForm.assessment} onChange={e => setNoteForm({...noteForm, assessment: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows="3" placeholder="Diagnosis and assessment..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Plan (P)</label>
              <textarea value={noteForm.plan} onChange={e => setNoteForm({...noteForm, plan: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows="3" placeholder="Treatment plan..." />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">Save Note</button>
              <button type="button" onClick={() => setShowNoteForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        )}
        <div className="space-y-3">
          {progressNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No progress notes yet</div>
          ) : (
            progressNotes.map(note => (
              <div key={note.id} className="p-4 border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{note.note_type}</span>
                  <span className="text-xs text-gray-400">{new Date(note.created_at).toLocaleString()}</span>
                </div>
                {note.subjective && <div className="mb-2"><p className="text-xs font-medium text-gray-500">Subjective</p><p className="text-sm text-gray-800">{note.subjective}</p></div>}
                {note.objective && <div className="mb-2"><p className="text-xs font-medium text-gray-500">Objective</p><p className="text-sm text-gray-800">{note.objective}</p></div>}
                {note.assessment && <div className="mb-2"><p className="text-xs font-medium text-gray-500">Assessment</p><p className="text-sm text-gray-800">{note.assessment}</p></div>}
                {note.plan && <div className="mb-2"><p className="text-xs font-medium text-gray-500">Plan</p><p className="text-sm text-gray-800">{note.plan}</p></div>}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'problems') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Problem List</h3>
          <button
            onClick={() => setShowProblemForm(!showProblemForm)}
            disabled={!currentRecord}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 inline mr-1" />Add Problem
          </button>
        </div>
        {showProblemForm && currentRecord && (
          <form onSubmit={onAddProblem} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Problem</label>
                <input value={problemForm.problem} onChange={e => setProblemForm({...problemForm, problem: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ICD-10 Code</label>
                <input value={problemForm.icd10_code} onChange={e => setProblemForm({...problemForm, icd10_code: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Onset Date</label>
              <input type="date" value={problemForm.onset_date} onChange={e => setProblemForm({...problemForm, onset_date: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={problemForm.notes} onChange={e => setProblemForm({...problemForm, notes: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" rows="2" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">Add Problem</button>
              <button type="button" onClick={() => setShowProblemForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        )}
        <div className="space-y-2">
          {problems.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No problems recorded</div>
          ) : (
            problems.map(problem => (
              <div key={problem.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{problem.problem}</p>
                  <p className="text-xs text-gray-500">
                    {problem.icd10_code && `ICD-10: ${problem.icd10_code} • `}
                    {problem.onset_date ? new Date(problem.onset_date).toLocaleDateString() : 'Unknown onset'}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  problem.status === 'active' ? 'bg-red-100 text-red-800' :
                  problem.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {problem.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'allergies') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Allergies</h3>
          <button
            onClick={() => setShowAllergyForm(!showAllergyForm)}
            disabled={!currentRecord}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 inline mr-1" />Add Allergy
          </button>
        </div>
        {showAllergyForm && currentRecord && (
          <form onSubmit={onAddAllergy} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Allergen</label>
                <input value={allergyForm.allergen} onChange={e => setAllergyForm({...allergyForm, allergen: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select value={allergyForm.allergy_type} onChange={e => setAllergyForm({...allergyForm, allergy_type: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="drug">Drug</option>
                  <option value="food">Food</option>
                  <option value="environmental">Environmental</option>
                  <option value="latex">Latex</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Reaction</label>
                <input value={allergyForm.reaction} onChange={e => setAllergyForm({...allergyForm, reaction: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Severity</label>
                <select value={allergyForm.severity} onChange={e => setAllergyForm({...allergyForm, severity: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">Add Allergy</button>
              <button type="button" onClick={() => setShowAllergyForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm">Cancel</button>
            </div>
          </form>
        )}
        <div className="space-y-2">
          {allergies.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No known allergies</div>
          ) : (
            allergies.map(allergy => (
              <div key={allergy.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{allergy.allergen}</p>
                  <p className="text-xs text-gray-500">{allergy.reaction} • {allergy.allergy_type}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  allergy.severity === 'severe' ? 'bg-red-100 text-red-800' :
                  allergy.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {allergy.severity}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'documents') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Clinical Documents</h3>
          <button
            onClick={() => setShowUploadModal(true)}
            disabled={!currentRecord}
            className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
          >
            <Upload className="w-4 h-4 inline mr-1" />Upload
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-400">No documents uploaded</div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="p-4 border rounded-xl hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <FolderOpen className="w-8 h-8 text-blue-400" />
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{doc.document_type}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">{doc.title}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(doc.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default EMR;
