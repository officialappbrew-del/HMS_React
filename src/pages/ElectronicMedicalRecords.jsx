import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clipboard,
  Stethoscope,
  Activity,
  Edit,
  Eye,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Shield,
  Upload,
  Trash2,
} from 'lucide-react';
import {
  fetchMedicalRecords,
  createMedicalRecord,
  createProgressNote,
  fetchProgressNotes,
  createProblem,
  createAllergy,
  createDocument,
  clearError,
  setCurrentRecord,
} from '../features/emrSlice';
import { setPatients } from '../features/patientSlice';
import { apiRequest, emrApi } from '../utils/api';
import Pagination from '../components/Pagination';

// Disease-specific template components
import MalariaCaseDocumentation from './../pages/Order/MalariaCaseDocumentation';
import TyphoidFeverManagement from './../pages/Order/TyphoidFeverManagement';
import SickleCellDiseaseTracking from './../pages/Order/SickleCellDiseaseTracking';
import TuberculosisTreatmentCards from './../pages/Order/TuberculosisTreatmentCards';
import HivAidsCarePlans from './../pages/Order/HivAidsCarePlans';
import HypertensionDiabetesManagement from './../pages/Order/HypertensionDiabetesManagement';
import MaternalHealthRecords from './../pages/Order/MaternalHealthRecords';

const ElectronicMedicalRecords = () => {
  const dispatch = useDispatch();
  const { medicalRecords, progressNotes, currentRecord, loading, error } = useSelector(state => state.emr);
  const { patients } = useSelector(state => state.patient || { patients: [] });

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await apiRequest('/api/v1/patients/patients/?page_size=100');
        const list = Array.isArray(data) ? data : (data.results || []);
        dispatch(setPatients(list));
      } catch (err) {
        console.error('Failed to load patients for EMR:', err);
      }
    };
    loadPatients();
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState('encounters');
  const [showEncounterForm, setShowEncounterForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [formError, setFormError] = useState('');
  const itemsPerPage = 10;

  const allCache = useMemo(() => {
    const list = Array.isArray(patients) ? patients : [];
    if (filterBy !== 'all') {
      return list.filter(p => String(p.id) === String(filterBy));
    }
    if (!searchTerm.trim()) return list;
    const term = searchTerm.trim().toLowerCase();
    return list.filter(p => {
      const name = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase();
      return (
        name.includes(term) ||
        String(p.id).includes(term) ||
        (p.hospital_number && p.hospital_number.toLowerCase().includes(term)) ||
        (p.phone && p.phone.toLowerCase().includes(term))
      );
    });
  }, [patients, filterBy, searchTerm]);

  const [encounterForm, setEncounterForm] = useState({
    patientId: '',
    recordType: 'outpatient',
    chiefComplaint: '',
    history_of_present_illness: '',
    past_medical_history: '',
    family_history: '',
    social_history: '',
  });

  const [noteForm, setNoteForm] = useState({
    patientId: '',
    medical_record: '',
    note_type: 'progress',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });

  const [problemForm, setProblemForm] = useState({
    patientId: '',
    problem: '',
    icd10_code: '',
    onset_date: '',
    status: 'active',
    notes: '',
  });

  const [allergyForm, setAllergyForm] = useState({
    patientId: '',
    allergen: '',
    allergy_type: 'drug',
    reaction: '',
    severity: 'moderate',
  });

  useEffect(() => {
    dispatch(fetchMedicalRecords());
    dispatch(fetchProgressNotes());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilter = (value) => {
    setFilterBy(value);
    setCurrentPage(1);
  };

  const filteredEncounters = medicalRecords
    .filter(record => {
      const patient = allCache.find(p => String(p.id) === String(record.patient));
      const matchesSearch = !searchTerm.trim() ||
        (patient && `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        String(record.patient).includes(searchTerm);
      const matchesFilter = filterBy === 'all' || String(record.patient) === String(filterBy);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      return 0;
    });

  const filteredNotes = progressNotes
    .filter(note => {
      const patient = allCache.find(p => String(p.id) === String(note.patient));
      const matchesSearch = !searchTerm.trim() ||
        (patient && `${patient.first_name || ''} ${patient.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
        String(note.patient).includes(searchTerm);
      const matchesFilter = filterBy === 'all' || String(note.patient) === String(filterBy);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      return 0;
    });

  const paginatedEncounters = filteredEncounters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const paginatedNotes = filteredNotes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const currentData = activeTab === 'encounters' ? paginatedEncounters : activeTab === 'notes' ? paginatedNotes : [];
  const totalPages = Math.ceil((activeTab === 'encounters' ? filteredEncounters.length : filteredNotes.length) / itemsPerPage);

  const getPatientName = (patientId) => {
    const patient = patients.find(p => String(p.id) === String(patientId));
    if (!patient) return `Patient ${patientId}`;
    return patient.full_name || patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || `Patient ${patientId}`;
  };

  const resetEncounterForm = () => {
    setEncounterForm({
      patientId: '',
      recordType: 'outpatient',
      chiefComplaint: '',
      history_of_present_illness: '',
      past_medical_history: '',
      family_history: '',
      social_history: '',
    });
    setFormError('');
  };

  const resetNoteForm = () => {
    setNoteForm({
      patientId: '',
      medical_record: '',
      note_type: 'progress',
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
    });
    setFormError('');
  };

  const handleEncounterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!encounterForm.patientId) {
      setFormError('Please select a patient.');
      return;
    }
    const payload = {
      patient: encounterForm.patientId,
      record_type: encounterForm.recordType,
      chief_complaint: encounterForm.chiefComplaint,
      history_of_present_illness: encounterForm.history_of_present_illness,
      past_medical_history: encounterForm.past_medical_history,
      family_history: encounterForm.family_history,
      social_history: encounterForm.social_history,
    };
    const result = await dispatch(createMedicalRecord(payload));
    if (createMedicalRecord.fulfilled.match(result)) {
      setShowEncounterForm(false);
      resetEncounterForm();
    } else {
      setFormError(result.payload || 'Failed to create encounter note.');
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!noteForm.patientId) {
      setFormError('Please select a patient.');
      return;
    }
    const payload = {
      patient: noteForm.patientId,
      medical_record: noteForm.medical_record || undefined,
      note_type: noteForm.note_type,
      subjective: noteForm.subjective,
      objective: noteForm.objective,
      assessment: noteForm.assessment,
      plan: noteForm.plan,
    };
    const result = await dispatch(createProgressNote(payload));
    if (createProgressNote.fulfilled.match(result)) {
      setShowNoteForm(false);
      resetNoteForm();
    } else {
      setFormError(result.payload || 'Failed to save clinical note.');
    }
  };

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!problemForm.patientId || !problemForm.problem) {
      setFormError('Patient and problem description are required.');
      return;
    }
    const payload = {
      patient: problemForm.patientId,
      medical_record: currentRecord?.id || undefined,
      problem: problemForm.problem,
      icd10_code: problemForm.icd10_code,
      onset_date: problemForm.onset_date || undefined,
      status: problemForm.status,
      notes: problemForm.notes,
    };
    const result = await dispatch(createProblem(payload));
    if (createProblem.fulfilled.match(result)) {
      setShowProblemForm(false);
      setProblemForm({ patientId: '', problem: '', icd10_code: '', onset_date: '', status: 'active', notes: '' });
    } else {
      setFormError(result.payload || 'Failed to add problem.');
    }
  };

  const handleAllergySubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!allergyForm.patientId || !allergyForm.allergen || !allergyForm.reaction) {
      setFormError('Patient, allergen, and reaction are required.');
      return;
    }
    const payload = {
      patient: allergyForm.patientId,
      medical_record: currentRecord?.id || undefined,
      allergen: allergyForm.allergen,
      allergy_type: allergyForm.allergy_type,
      reaction: allergyForm.reaction,
      severity: allergyForm.severity,
    };
    const result = await dispatch(createAllergy(payload));
    if (createAllergy.fulfilled.match(result)) {
      setShowAllergyForm(false);
      setAllergyForm({ patientId: '', allergen: '', allergy_type: 'drug', reaction: '', severity: 'moderate' });
    } else {
      setFormError(result.payload || 'Failed to add allergy.');
    }
  };

  return (
    <div className="electronic-medical-records p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-500" />
          Electronic Medical Records (EMR)
        </h1>
        <p className="text-gray-600 mt-2">Comprehensive patient clinical documentation</p>
      </div>

      {formError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {formError}
          <button onClick={() => setFormError('')} className="float-right text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
          {error}
          <button onClick={() => dispatch(clearError())} className="float-right text-orange-500 hover:text-orange-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'encounters', label: 'Encounter Notes', icon: Clipboard },
            { id: 'notes', label: 'Clinical Notes', icon: FileText },
            { id: 'templates', label: 'Disease Templates', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        {activeTab !== 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Patient</label>
              <select
                value={filterBy}
                onChange={(e) => handleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Patients</option>
                {allCache.map(patient => (
                  <option key={patient.id} value={patient.id}>{getPatientName(patient.id)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date (Newest First)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => activeTab === 'encounters' ? setShowEncounterForm(true) : setShowNoteForm(true)}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {activeTab === 'encounters' ? 'Encounter' : 'Note'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Records Table */}
      {activeTab !== 'templates' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {activeTab === 'encounters' ? 'Type' : 'Note Type'}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && currentData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                      Loading records...
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No {activeTab === 'encounters' ? 'encounters' : 'clinical notes'} found.
                    </td>
                  </tr>
                ) : (
                  currentData.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{getPatientName(item.patient)}</div>
                          <div className="text-sm text-gray-500">{item.patient}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {activeTab === 'encounters' ? item.record_type : item.note_type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {activeTab === 'encounters'
                            ? item.chief_complaint || item.history_of_present_illness || 'No details'
                            : item.subjective || item.objective || item.assessment || 'No content'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => { dispatch(setCurrentRecord(item)); setShowViewModal(true); }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setEditingItem(item); setShowEditModal(true); }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disease Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {!selectedTemplate ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'malaria', title: 'Malaria Case', desc: 'Documentation for Malaria cases' },
                { id: 'typhoid', title: 'Typhoid Fever', desc: 'Management of Typhoid Fever' },
                { id: 'sickle_cell', title: 'Sickle Cell', desc: 'Tracking for Sickle Cell Disease' },
                { id: 'tb', title: 'Tuberculosis', desc: 'TB Treatment Cards (DOTS)' },
                { id: 'hiv', title: 'HIV/AIDS Care', desc: 'ART and Care Plans' },
                { id: 'ncd', title: 'Hypertension & Diabetes', desc: 'Chronic Disease Management' },
                { id: 'maternal', title: 'Maternal Health', desc: 'Antenatal Care Records' },
              ].map(template => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className="border rounded-lg p-6 hover:shadow-lg cursor-pointer transition-all hover:border-blue-500 group"
                >
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-600">{template.desc}</p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                &larr; Back to Templates
              </button>
              {selectedTemplate === 'malaria' && <MalariaCaseDocumentation />}
              {selectedTemplate === 'typhoid' && <TyphoidFeverManagement />}
              {selectedTemplate === 'sickle_cell' && <SickleCellDiseaseTracking />}
              {selectedTemplate === 'tb' && <TuberculosisTreatmentCards />}
              {selectedTemplate === 'hiv' && <HivAidsCarePlans />}
              {selectedTemplate === 'ncd' && <HypertensionDiabetesManagement />}
              {selectedTemplate === 'maternal' && <MaternalHealthRecords />}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {activeTab !== 'templates' && totalPages > 1 && (
        <div className="mb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Encounter Form Modal */}
      {showEncounterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Clipboard className="w-5 h-5 mr-2" />
                New Encounter Note
              </h3>
              <form onSubmit={handleEncounterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                    <select
                      value={encounterForm.patientId}
                      onChange={(e) => setEncounterForm({...encounterForm, patientId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select patient...</option>
                       {allCache.map(patient => (
                         <option key={patient.id} value={patient.id}>{getPatientName(patient.id)}</option>
                       ))}
                     </select>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Encounter Type</label>
                    <select
                      value={encounterForm.recordType}
                      onChange={(e) => setEncounterForm({...encounterForm, recordType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="outpatient">Outpatient</option>
                      <option value="emergency">Emergency</option>
                      <option value="inpatient">Inpatient Admission</option>
                      <option value="day_care">Day Care</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint</label>
                  <textarea
                    value={encounterForm.chiefComplaint}
                    onChange={(e) => setEncounterForm({...encounterForm, chiefComplaint: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">History of Present Illness</label>
                    <textarea
                      value={encounterForm.history_of_present_illness}
                      onChange={(e) => setEncounterForm({...encounterForm, history_of_present_illness: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Past Medical History</label>
                    <textarea
                      value={encounterForm.past_medical_history}
                      onChange={(e) => setEncounterForm({...encounterForm, past_medical_history: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Family History</label>
                    <textarea
                      value={encounterForm.family_history}
                      onChange={(e) => setEncounterForm({...encounterForm, family_history: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social History</label>
                    <textarea
                      value={encounterForm.social_history}
                      onChange={(e) => setEncounterForm({...encounterForm, social_history: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Save Encounter Note
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowEncounterForm(false); resetEncounterForm(); }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Note Form Modal */}
      {showNoteForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                New Clinical Note
              </h3>
              <form onSubmit={handleNoteSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                    <select
                      value={noteForm.patientId}
                      onChange={(e) => setNoteForm({...noteForm, patientId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select patient...</option>
                       {allCache.map(patient => (
                         <option key={patient.id} value={patient.id}>{getPatientName(patient.id)}</option>
                       ))}
                     </select>
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Note Type</label>
                    <select
                      value={noteForm.note_type}
                      onChange={(e) => setNoteForm({...noteForm, note_type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="progress">Progress Note</option>
                      <option value="consultation">Consultation Note</option>
                      <option value="procedure">Procedure Note</option>
                      <option value="discharge">Discharge Summary</option>
                      <option value="admission">Admission Note</option>
                      <option value="nursing">Nursing Note</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjective</label>
                  <textarea
                    value={noteForm.subjective}
                    onChange={(e) => setNoteForm({...noteForm, subjective: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Chief complaint, HPI, ROS..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objective</label>
                  <textarea
                    value={noteForm.objective}
                    onChange={(e) => setNoteForm({...noteForm, objective: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Physical exam, vital signs, observations..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assessment</label>
                    <textarea
                      value={noteForm.assessment}
                      onChange={(e) => setNoteForm({...noteForm, assessment: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Diagnosis, impression..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                    <textarea
                      value={noteForm.plan}
                      onChange={(e) => setNoteForm({...noteForm, plan: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Treatment plan, meds, follow-up..."
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Save Clinical Note
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNoteForm(false); resetNoteForm(); }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Problem List Form Modal */}
      {showProblemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Stethoscope className="w-5 h-5 mr-2" />
                Add Problem to List
              </h3>
              <form onSubmit={handleProblemSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                  <select
                    value={problemForm.patientId}
                    onChange={(e) => setProblemForm({...problemForm, patientId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select patient...</option>
                    {allCache.map(patient => (
                      <option key={patient.id} value={patient.id}>{getPatientName(patient.id)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Problem</label>
                  <input
                    type="text"
                    value={problemForm.problem}
                    onChange={(e) => setProblemForm({...problemForm, problem: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Type 2 Diabetes Mellitus"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ICD-10 Code</label>
                    <input
                      type="text"
                      value={problemForm.icd10_code}
                      onChange={(e) => setProblemForm({...problemForm, icd10_code: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., E11.9"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Onset Date</label>
                    <input
                      type="date"
                      value={problemForm.onset_date}
                      onChange={(e) => setProblemForm({...problemForm, onset_date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={problemForm.notes}
                    onChange={(e) => setProblemForm({...problemForm, notes: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Add Problem
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProblemForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Allergy Form Modal */}
      {showAllergyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Add Allergy Record
              </h3>
              <form onSubmit={handleAllergySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                  <select
                    value={allergyForm.patientId}
                    onChange={(e) => setAllergyForm({...allergyForm, patientId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select patient...</option>
                    {allCache.map(patient => (
                      <option key={patient.id} value={patient.id}>{getPatientName(patient.id)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergen</label>
                  <input
                    type="text"
                    value={allergyForm.allergen}
                    onChange={(e) => setAllergyForm({...allergyForm, allergen: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Penicillin, Peanuts"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={allergyForm.allergy_type}
                      onChange={(e) => setAllergyForm({...allergyForm, allergy_type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="drug">Drug</option>
                      <option value="food">Food</option>
                      <option value="environmental">Environmental</option>
                      <option value="latex">Latex</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                    <select
                      value={allergyForm.severity}
                      onChange={(e) => setAllergyForm({...allergyForm, severity: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="mild">Mild</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reaction</label>
                  <textarea
                    value={allergyForm.reaction}
                    onChange={(e) => setAllergyForm({...allergyForm, reaction: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Rash, Anaphylaxis"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Add Allergy
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAllergyForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Record Modal */}
      {showViewModal && currentRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                View {currentRecord.note_type ? 'Clinical Note' : 'Encounter Note'}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Patient</span>
                    <p className="text-sm text-gray-900">{getPatientName(currentRecord.patient)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Date</span>
                    <p className="text-sm text-gray-900">{new Date(currentRecord.created_at).toLocaleString('en-NG')}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Type</span>
                    <p className="text-sm text-gray-900">{currentRecord.record_type || currentRecord.note_type || 'N/A'}</p>
                  </div>
                </div>
                {currentRecord.chief_complaint && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Chief Complaint</span>
                    <p className="text-sm text-gray-900 mt-1">{currentRecord.chief_complaint}</p>
                  </div>
                )}
                {currentRecord.history_of_present_illness && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">History of Present Illness</span>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{currentRecord.history_of_present_illness}</p>
                  </div>
                )}
                {currentRecord.past_medical_history && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Past Medical History</span>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{currentRecord.past_medical_history}</p>
                  </div>
                )}
                {currentRecord.family_history && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Family History</span>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{currentRecord.family_history}</p>
                  </div>
                )}
                {currentRecord.social_history && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Social History</span>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{currentRecord.social_history}</p>
                  </div>
                )}
                {currentRecord.subjective && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Subjective</span>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{currentRecord.subjective}</p>
                  </div>
                )}
                {currentRecord.objective && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Objective</span>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{currentRecord.objective}</p>
                  </div>
                )}
                {currentRecord.assessment && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Assessment</span>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{currentRecord.assessment}</p>
                  </div>
                )}
                {currentRecord.plan && (
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Plan</span>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{currentRecord.plan}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Edit className="w-5 h-5 mr-2" />
                Edit {editingItem.note_type ? 'Clinical Note' : 'Encounter Note'}
              </h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const isNote = !!editingItem.note_type;
                const payload = isNote
                  ? { note_type: editingItem.note_type, subjective: editingItem.subjective || '', objective: editingItem.objective || '', assessment: editingItem.assessment || '', plan: editingItem.plan || '' }
                  : { recordType: editingItem.record_type || 'outpatient', chiefComplaint: editingItem.chief_complaint || '', history_of_present_illness: editingItem.history_of_present_illness || '', past_medical_history: editingItem.past_medical_history || '', family_history: editingItem.family_history || '', social_history: editingItem.social_history || '' };
                const endpoint = isNote ? `/api/v1/emr/progress-notes/${editingItem.id}/` : `/api/v1/emr/medical-records/${editingItem.id}/`;
                const result = await apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(payload) });
                if (result) {
                  setShowEditModal(false);
                  setEditingItem(null);
                  dispatch(fetchMedicalRecords());
                  dispatch(fetchProgressNotes());
                }
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                    <input
                      type="text"
                      value={getPatientName(editingItem.patient)}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={editingItem.record_type || editingItem.note_type || 'outpatient'}
                      onChange={(e) => setEditingItem({...editingItem, record_type: e.target.value, note_type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="outpatient">Outpatient</option>
                      <option value="emergency">Emergency</option>
                      <option value="inpatient">Inpatient</option>
                      <option value="day_care">Day Care</option>
                    </select>
                  </div>
                </div>

                {editingItem.chief_complaint !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint</label>
                    <textarea
                      value={editingItem.chief_complaint || ''}
                      onChange={(e) => setEditingItem({...editingItem, chief_complaint: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {editingItem.history_of_present_illness !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">History of Present Illness</label>
                    <textarea
                      value={editingItem.history_of_present_illness || ''}
                      onChange={(e) => setEditingItem({...editingItem, history_of_present_illness: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {editingItem.past_medical_history !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Past Medical History</label>
                    <textarea
                      value={editingItem.past_medical_history || ''}
                      onChange={(e) => setEditingItem({...editingItem, past_medical_history: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {editingItem.family_history !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Family History</label>
                    <textarea
                      value={editingItem.family_history || ''}
                      onChange={(e) => setEditingItem({...editingItem, family_history: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {editingItem.social_history !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social History</label>
                    <textarea
                      value={editingItem.social_history || ''}
                      onChange={(e) => setEditingItem({...editingItem, social_history: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {editingItem.subjective !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subjective</label>
                    <textarea
                      value={editingItem.subjective || ''}
                      onChange={(e) => setEditingItem({...editingItem, subjective: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {editingItem.objective !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objective</label>
                    <textarea
                      value={editingItem.objective || ''}
                      onChange={(e) => setEditingItem({...editingItem, objective: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {editingItem.assessment !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assessment</label>
                    <textarea
                      value={editingItem.assessment || ''}
                      onChange={(e) => setEditingItem({...editingItem, assessment: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {editingItem.plan !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                    <textarea
                      value={editingItem.plan || ''}
                      onChange={(e) => setEditingItem({...editingItem, plan: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowEditModal(false); setEditingItem(null); }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectronicMedicalRecords;
