import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Stethoscope,
  Clipboard,
  User,
  Calendar,
  Clock,
  Edit,
  Eye,
  Activity
} from 'lucide-react';
import {
  addEncounter,
  addClinicalNote,
  searchEMR,
  sortEMR,
  filterEMR
} from '../features/emrSlice';
import Pagination from '../components/Pagination';

// Import Disease Specific Templates
// Assuming these components are located at the project root based on your file structure

// C:\Users\Ekene-onwon\Desktop\Codes\HMS\src\pages\Order\MalariaCaseDocumentation.jsx

import MalariaCaseDocumentation from './../pages/Order/MalariaCaseDocumentation';
import TyphoidFeverManagement from './../pages/Order/TyphoidFeverManagement';
import SickleCellDiseaseTracking from './../pages/Order/SickleCellDiseaseTracking';
import TuberculosisTreatmentCards from './../pages/Order/TuberculosisTreatmentCards';
import HivAidsCarePlans from './../pages/Order/HivAidsCarePlans';
import HypertensionDiabetesManagement from './../pages/Order/HypertensionDiabetesManagement';
import MaternalHealthRecords from './../pages/Order/MaternalHealthRecords';

const ElectronicMedicalRecords = () => {
  const dispatch = useDispatch();
  const { encounters, clinicalNotes, searchTerm, sortBy, filterBy } = useSelector(state => state.emr);
  const { patients } = useSelector(state => state.patient);

  const [activeTab, setActiveTab] = useState('encounters');
  const [showEncounterForm, setShowEncounterForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [encounterForm, setEncounterForm] = useState({
    patientId: '',
    type: 'Outpatient',
    chiefComplaint: '',
    historyOfPresentIllness: '',
    pastMedicalHistory: '',
    drugHistory: '',
    familyHistory: '',
    socialHistory: '',
    reviewOfSystems: '',
    physicalExamination: '',
    assessment: '',
    plan: '',
    diagnosis: '',
    prescriptions: '',
    investigations: '',
    followUp: ''
  });

  const [noteForm, setNoteForm] = useState({
    patientId: '',
    type: 'Progress Note',
    content: '',
    author: ''
  });

  // Filter and search logic
  const filteredEncounters = encounters
    .filter(enc => {
      const matchesSearch = !searchTerm ||
        patients.find(p => p.id === enc.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enc.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enc.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || enc.patientId === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === 'patient') return a.patientId.localeCompare(b.patientId);
      return 0;
    });

  const filteredNotes = clinicalNotes
    .filter(note => {
      const matchesSearch = !searchTerm ||
        patients.find(p => p.id === note.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || note.patientId === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === 'patient') return a.patientId.localeCompare(b.patientId);
      return 0;
    });

  const currentData = activeTab === 'encounters' ? filteredEncounters : filteredNotes;
  const paginatedData = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEncounterSubmit = (e) => {
    e.preventDefault();
    dispatch(addEncounter(encounterForm));
    setEncounterForm({
      patientId: '',
      type: 'Outpatient',
      chiefComplaint: '',
      historyOfPresentIllness: '',
      pastMedicalHistory: '',
      drugHistory: '',
      familyHistory: '',
      socialHistory: '',
      reviewOfSystems: '',
      physicalExamination: '',
      assessment: '',
      plan: '',
      diagnosis: '',
      prescriptions: '',
      investigations: '',
      followUp: ''
    });
    setShowEncounterForm(false);
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    dispatch(addClinicalNote(noteForm));
    setNoteForm({
      patientId: '',
      type: 'Progress Note',
      content: '',
      author: ''
    });
    setShowNoteForm(false);
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

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('encounters')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center ${
              activeTab === 'encounters'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Clipboard className="w-4 h-4 mr-2" />
            Encounter Notes
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center ${
              activeTab === 'notes'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Clinical Notes
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center ${
              activeTab === 'templates'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            Disease Templates
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => dispatch(searchEMR(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Patient</label>
            <select
              value={filterBy}
              onChange={(e) => dispatch(filterEMR(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Patients</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => dispatch(sortEMR(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date (Newest First)</option>
              <option value="patient">Patient ID</option>
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
                {paginatedData.map(item => {
                  const patient = patients.find(p => p.id === item.patientId);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{patient?.name || item.patientId}</div>
                          <div className="text-sm text-gray-500">{item.patientId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {activeTab === 'encounters' ? item.type : item.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {activeTab === 'encounters' ? item.chiefComplaint : item.content}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {paginatedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No {activeTab} found.
            </div>
          )}
        </div>
      )}

      {/* Disease Templates Tab Content */}
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
      {activeTab !== 'templates' && currentData.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(currentData.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
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
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Encounter Type</label>
                    <select
                      value={encounterForm.type}
                      onChange={(e) => setEncounterForm({...encounterForm, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Outpatient</option>
                      <option>Emergency</option>
                      <option>Inpatient Admission</option>
                      <option>Follow-up</option>
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
                      value={encounterForm.historyOfPresentIllness}
                      onChange={(e) => setEncounterForm({...encounterForm, historyOfPresentIllness: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Past Medical History</label>
                    <textarea
                      value={encounterForm.pastMedicalHistory}
                      onChange={(e) => setEncounterForm({...encounterForm, pastMedicalHistory: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Drug History</label>
                    <textarea
                      value={encounterForm.drugHistory}
                      onChange={(e) => setEncounterForm({...encounterForm, drugHistory: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Family History</label>
                    <textarea
                      value={encounterForm.familyHistory}
                      onChange={(e) => setEncounterForm({...encounterForm, familyHistory: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Social History</label>
                    <textarea
                      value={encounterForm.socialHistory}
                      onChange={(e) => setEncounterForm({...encounterForm, socialHistory: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review of Systems</label>
                  <textarea
                    value={encounterForm.reviewOfSystems}
                    onChange={(e) => setEncounterForm({...encounterForm, reviewOfSystems: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Physical Examination</label>
                  <textarea
                    value={encounterForm.physicalExamination}
                    onChange={(e) => setEncounterForm({...encounterForm, physicalExamination: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assessment/Diagnosis</label>
                    <textarea
                      value={encounterForm.assessment}
                      onChange={(e) => setEncounterForm({...encounterForm, assessment: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                    <textarea
                      value={encounterForm.plan}
                      onChange={(e) => setEncounterForm({...encounterForm, plan: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prescriptions</label>
                    <textarea
                      value={encounterForm.prescriptions}
                      onChange={(e) => setEncounterForm({...encounterForm, prescriptions: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investigations</label>
                    <textarea
                      value={encounterForm.investigations}
                      onChange={(e) => setEncounterForm({...encounterForm, investigations: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up</label>
                    <textarea
                      value={encounterForm.followUp}
                      onChange={(e) => setEncounterForm({...encounterForm, followUp: e.target.value})}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Save Encounter Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEncounterForm(false)}
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
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note Type</label>
                    <select
                      value={noteForm.type}
                      onChange={(e) => setNoteForm({...noteForm, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option>Progress Note</option>
                      <option>Consultation Note</option>
                      <option>Procedure Note</option>
                      <option>Discharge Note</option>
                      <option>Teaching Note</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    value={noteForm.author}
                    onChange={(e) => setNoteForm({...noteForm, author: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Doctor/Nurse name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note Content</label>
                  <textarea
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Enter clinical note details..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Save Clinical Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNoteForm(false)}
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