import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addClinicalNote } from '../../features/emrSlice';
import { Calendar, ClipboardCheck, Pill, Activity, AlertTriangle, Stethoscope, User } from 'lucide-react';

const TuberculosisTreatmentCards = ({ patientId }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('initial');
  const [treatmentPhase, setTreatmentPhase] = useState('intensive');
  const [formData, setFormData] = useState({
    // Initial Assessment
    registrationDate: '',
    tbRegistrationNumber: '',
    diagnosisDate: '',
    typeOfTb: 'pulmonary',
    classification: 'new',
    weight: '',
    height: '',
    bmi: '',
    
    // Diagnosis Details
    diagnosisMethod: '',
    bacteriologicalStatus: '',
    drugSensitivityTest: '',
    hivStatus: '',
    diabetesStatus: '',
    
    // Treatment Details
    treatmentRegimen: 'cat1',
    intensivePhase: {
      startDate: '',
      endDate: '',
      medications: [],
      dailyDose: '',
      supervisor: '',
      adherence: 100,
      sideEffects: ''
    },
    continuationPhase: {
      startDate: '',
      endDate: '',
      medications: [],
      doseFrequency: '',
      supervisor: '',
      adherence: 100,
      sideEffects: ''
    },
    
    // DOT Information
    dotProvider: '',
    dotLocation: '',
    dotSchedule: '',
    
    // Follow-up
    sputumExams: [],
    chestXrays: [],
    weightMonitoring: [],
    
    // Outcome
    treatmentOutcome: '',
    outcomeDate: '',
    outcomeNotes: ''
  });

  const tbRegimens = {
    cat1: {
      name: 'Category 1 (New Patients)',
      intensive: '2HRZE',
      continuation: '4HR',
      description: 'New smear-positive pulmonary TB, severe extrapulmonary TB, severe concomitant HIV disease'
    },
    cat2: {
      name: 'Category 2 (Retreatment)',
      intensive: '2HRZES/1HRZE',
      continuation: '5HRE',
      description: 'Relapse, treatment after failure, treatment after loss to follow-up'
    },
    cat3: {
      name: 'Category 3 (Smear-negative)',
      intensive: '2HRZ',
      continuation: '4HR',
      description: 'Smear-negative pulmonary TB, less severe extrapulmonary TB'
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'intensivePhase' || parent === 'continuationPhase') {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'checkbox' ? checked : value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addSputumExam = () => {
    const newExam = {
      date: '',
      result: '',
      method: '',
      comments: ''
    };
    setFormData(prev => ({
      ...prev,
      sputumExams: [...prev.sputumExams, newExam]
    }));
  };

  const handleSputumExamChange = (index, field, value) => {
    const updatedExams = [...formData.sputumExams];
    updatedExams[index][field] = value;
    setFormData(prev => ({
      ...prev,
      sputumExams: updatedExams
    }));
  };

  const calculateTreatmentDuration = () => {
    const intensiveStart = new Date(formData.intensivePhase.startDate);
    const continuationEnd = new Date(formData.continuationPhase.endDate);
    
    if (intensiveStart && continuationEnd && !isNaN(intensiveStart) && !isNaN(continuationEnd)) {
      const diffTime = Math.abs(continuationEnd - intensiveStart);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const tbRecord = {
      patientId,
      type: 'Tuberculosis Treatment Card (DOTS)',
      date: new Date().toISOString(),
      ...formData,
      treatmentDuration: calculateTreatmentDuration(),
      regimenDetails: tbRegimens[formData.treatmentRegimen]
    };
    
    dispatch(addClinicalNote(tbRecord));
    alert('TB Treatment Card saved successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Activity className="w-8 h-8 text-orange-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Tuberculosis Treatment Cards (DOTS)</h2>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6">
        {['initial', 'treatment', 'followup', 'outcome'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab === 'initial' && 'Initial Assessment'}
            {tab === 'treatment' && 'Treatment Phases'}
            {tab === 'followup' && 'Follow-up'}
            {tab === 'outcome' && 'Treatment Outcome'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Initial Assessment Tab */}
        {activeTab === 'initial' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Patient Registration & Initial Assessment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Registration Date
                </label>
                <input
                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TB Registration Number
                </label>
                <input
                  type="text"
                  name="tbRegistrationNumber"
                  value={formData.tbRegistrationNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., TB-2024-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis Date
                </label>
                <input
                  type="date"
                  name="diagnosisDate"
                  value={formData.diagnosisDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of TB
                </label>
                <select
                  name="typeOfTb"
                  value={formData.typeOfTb}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="pulmonary">Pulmonary TB</option>
                  <option value="extrapulmonary">Extrapulmonary TB</option>
                  <option value="both">Both Pulmonary & Extrapulmonary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Classification
                </label>
                <select
                  name="classification"
                  value={formData.classification}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="new">New</option>
                  <option value="relapse">Relapse</option>
                  <option value="treatment_failure">Treatment Failure</option>
                  <option value="ltfu_return">Return after Loss to Follow-up</option>
                  <option value="transfer_in">Transfer In</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 65.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 170"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BMI
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="bmi"
                  value={formData.bmi}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g., 22.7"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis Method
                </label>
                <select
                  name="diagnosisMethod"
                  value={formData.diagnosisMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select method</option>
                  <option value="smear_microscopy">Smear Microscopy</option>
                  <option value="xpert_mtb_rif">Xpert MTB/RIF</option>
                  <option value="culture">Culture</option>
                  <option value="chest_xray">Chest X-ray</option>
                  <option value="clinical">Clinical Diagnosis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bacteriological Status
                </label>
                <select
                  name="bacteriologicalStatus"
                  value={formData.bacteriologicalStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select status</option>
                  <option value="smear_positive">Smear Positive</option>
                  <option value="smear_negative">Smear Negative</option>
                  <option value="culture_positive">Culture Positive</option>
                  <option value="culture_negative">Culture Negative</option>
                  <option value="not_done">Not Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drug Sensitivity Test
                </label>
                <select
                  name="drugSensitivityTest"
                  value={formData.drugSensitivityTest}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select result</option>
                  <option value="sensitive">Sensitive</option>
                  <option value="mdr">MDR-TB</option>
                  <option value="xdr">XDR-TB</option>
                  <option value="pending">Pending</option>
                  <option value="not_done">Not Done</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HIV Status
                </label>
                <select
                  name="hivStatus"
                  value={formData.hivStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select status</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diabetes Status
                </label>
                <select
                  name="diabetesStatus"
                  value={formData.diabetesStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select status</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Treatment Phases Tab */}
        {activeTab === 'treatment' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Pill className="w-5 h-5 mr-2" />
              Treatment Phases & DOTS
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treatment Regimen Category
              </label>
              <select
                name="treatmentRegimen"
                value={formData.treatmentRegimen}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {Object.entries(tbRegimens).map(([key, regimen]) => (
                  <option key={key} value={key}>
                    {regimen.name} - {regimen.intensive}/{regimen.continuation}
                  </option>
                ))}
              </select>
              {formData.treatmentRegimen && (
                <p className="text-sm text-gray-600 mt-2">
                  {tbRegimens[formData.treatmentRegimen].description}
                </p>
              )}
            </div>

            {/* Phase Toggle */}
            <div className="flex space-x-2 mb-6">
              <button
                type="button"
                onClick={() => setTreatmentPhase('intensive')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  treatmentPhase === 'intensive'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Intensive Phase (2-3 Months)
              </button>
              <button
                type="button"
                onClick={() => setTreatmentPhase('continuation')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  treatmentPhase === 'continuation'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Continuation Phase (4-5 Months)
              </button>
            </div>

            {/* Intensive Phase Form */}
            {treatmentPhase === 'intensive' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="intensivePhase.startDate"
                    value={formData.intensivePhase.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="intensivePhase.endDate"
                    value={formData.intensivePhase.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Dose (mg/kg)
                  </label>
                  <input
                    type="text"
                    name="intensivePhase.dailyDose"
                    value={formData.intensivePhase.dailyDose}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., H: 5mg/kg, R: 10mg/kg, Z: 25mg/kg, E: 15mg/kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DOTS Supervisor
                  </label>
                  <input
                    type="text"
                    name="intensivePhase.supervisor"
                    value={formData.intensivePhase.supervisor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Name of DOTS supervisor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adherence (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="intensivePhase.adherence"
                    value={formData.intensivePhase.adherence}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Side Effects
                  </label>
                  <textarea
                    name="intensivePhase.sideEffects"
                    value={formData.intensivePhase.sideEffects}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Nausea, vomiting, hepatotoxicity, rash, etc."
                  />
                </div>
              </div>
            )}

            {/* Continuation Phase Form */}
            {treatmentPhase === 'continuation' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="continuationPhase.startDate"
                    value={formData.continuationPhase.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="continuationPhase.endDate"
                    value={formData.continuationPhase.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dose Frequency
                  </label>
                  <select
                    name="continuationPhase.doseFrequency"
                    value={formData.continuationPhase.doseFrequency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="thrice_weekly">Thrice Weekly</option>
                    <option value="twice_weekly">Twice Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DOTS Supervisor
                  </label>
                  <input
                    type="text"
                    name="continuationPhase.supervisor"
                    value={formData.continuationPhase.supervisor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Name of DOTS supervisor"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Side Effects
                  </label>
                  <textarea
                    name="continuationPhase.sideEffects"
                    value={formData.continuationPhase.sideEffects}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Side effects observed during continuation phase"
                  />
                </div>
              </div>
            )}

            {/* DOTS Information */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                <Stethoscope className="w-4 h-4 mr-2" />
                Directly Observed Treatment (DOT) Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DOT Provider
                  </label>
                  <input
                    type="text"
                    name="dotProvider"
                    value={formData.dotProvider}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md"
                    placeholder="e.g., Health worker, family member"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DOT Location
                  </label>
                  <input
                    type="text"
                    name="dotLocation"
                    value={formData.dotLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md"
                    placeholder="e.g., Health facility, patient's home"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DOT Schedule
                  </label>
                  <input
                    type="text"
                    name="dotSchedule"
                    value={formData.dotSchedule}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md"
                    placeholder="e.g., Monday-Friday, 8:00 AM"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up Tab */}
        {activeTab === 'followup' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ClipboardCheck className="w-5 h-5 mr-2" />
              Follow-up Monitoring
            </h3>

            {/* Sputum Exams Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-700">Sputum Examination Results</h4>
                <button
                  type="button"
                  onClick={addSputumExam}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 text-sm"
                >
                  + Add Exam
                </button>
              </div>

              {formData.sputumExams.length === 0 ? (
                <p className="text-gray-500 text-sm">No sputum exams recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {formData.sputumExams.map((exam, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={exam.date}
                            onChange={(e) => handleSputumExamChange(index, 'date', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Result
                          </label>
                          <select
                            value={exam.result}
                            onChange={(e) => handleSputumExamChange(index, 'result', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select</option>
                            <option value="positive">Positive</option>
                            <option value="negative">Negative</option>
                            <option value="scanty">Scanty</option>
                            <option value="pending">Pending</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Method
                          </label>
                          <select
                            value={exam.method}
                            onChange={(e) => handleSputumExamChange(index, 'method', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select</option>
                            <option value="smear">Smear</option>
                            <option value="culture">Culture</option>
                            <option value="xpert">Xpert MTB/RIF</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Comments
                          </label>
                          <input
                            type="text"
                            value={exam.comments}
                            onChange={(e) => handleSputumExamChange(index, 'comments', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Comments"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Treatment Duration Calculation */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Treatment Duration Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Intensive Phase</p>
                  <p className="font-semibold">
                    {formData.intensivePhase.startDate && formData.intensivePhase.endDate 
                      ? `${new Date(formData.intensivePhase.endDate).getMonth() - new Date(formData.intensivePhase.startDate).getMonth()} months`
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Continuation Phase</p>
                  <p className="font-semibold">
                    {formData.continuationPhase.startDate && formData.continuationPhase.endDate 
                      ? `${new Date(formData.continuationPhase.endDate).getMonth() - new Date(formData.continuationPhase.startDate).getMonth()} months`
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Duration</p>
                  <p className="font-semibold text-blue-600">
                    {calculateTreatmentDuration()} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Phase</p>
                  <p className="font-semibold">
                    {treatmentPhase === 'intensive' ? 'Intensive' : 'Continuation'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Outcome Tab */}
        {activeTab === 'outcome' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Treatment Outcome
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment Outcome
                </label>
                <select
                  name="treatmentOutcome"
                  value={formData.treatmentOutcome}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select outcome</option>
                  <option value="cured">Cured</option>
                  <option value="treatment_completed">Treatment Completed</option>
                  <option value="treatment_failed">Treatment Failed</option>
                  <option value="died">Died</option>
                  <option value="lost_to_followup">Lost to Follow-up</option>
                  <option value="not_evaluated">Not Evaluated</option>
                  <option value="transferred_out">Transferred Out</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outcome Date
                </label>
                <input
                  type="date"
                  name="outcomeDate"
                  value={formData.outcomeDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outcome Notes
                </label>
                <textarea
                  name="outcomeNotes"
                  value={formData.outcomeNotes}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Detailed notes about treatment outcome, reasons for failure, etc."
                />
              </div>
            </div>

            {/* Final Assessment */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium text-gray-800 mb-3">Final Assessment</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Treatment Duration:</span>
                  <span className="font-medium">{calculateTreatmentDuration()} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Regimen Used:</span>
                  <span className="font-medium">
                    {formData.treatmentRegimen && tbRegimens[formData.treatmentRegimen]?.intensive}
                    /{formData.treatmentRegimen && tbRegimens[formData.treatmentRegimen]?.continuation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">DOTS Supervision:</span>
                  <span className="font-medium">{formData.dotProvider || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation and Submit Buttons */}
        <div className="flex justify-between pt-6 border-t">
          {activeTab !== 'initial' && (
            <button
              type="button"
              onClick={() => {
                const tabs = ['initial', 'treatment', 'followup', 'outcome'];
                const currentIndex = tabs.indexOf(activeTab);
                setActiveTab(tabs[currentIndex - 1]);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              ← Previous
            </button>
          )}
          
          {activeTab !== 'outcome' ? (
            <button
              type="button"
              onClick={() => {
                const tabs = ['initial', 'treatment', 'followup', 'outcome'];
                const currentIndex = tabs.indexOf(activeTab);
                setActiveTab(tabs[currentIndex + 1]);
              }}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Save TB Treatment Card
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TuberculosisTreatmentCards;