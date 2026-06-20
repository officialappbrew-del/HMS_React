import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  addPreOpAssessment,
  updatePreOpAssessment
} from '../features/theaterSlice';

import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

const PreOperativeAssessment = () => {
  const dispatch = useDispatch();
  const {
    preOpAssessments,
    surgicalSchedules,
    procedures
  } = useSelector(state => state.theater);

  const { patients } = useSelector(state => state.patient);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    patientId: '',
    procedure: '',
    assessmentDate: '',
    assessedBy: '',
    // Vital signs
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    // Lab results
    hemoglobin: '',
    whiteCellCount: '',
    plateletCount: '',
    clottingTime: '',
    // Checklist items
    patientIdentity: false,
    procedureSite: false,
    consent: false,
    bloodGrouping: false,
    crossMatching: false,
    npoStatus: false,
    allergies: false,
    medications: false,
    anesthesiaAssessment: false,
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientId || !formData.procedure) {
      alert('Patient and procedure are required');
      return;
    }

    const assessmentData = {
      ...formData,
      vitalSigns: {
        bloodPressure: formData.bloodPressure,
        heartRate: parseInt(formData.heartRate) || 0,
        temperature: parseFloat(formData.temperature) || 0,
        respiratoryRate: parseInt(formData.respiratoryRate) || 0,
        oxygenSaturation: parseInt(formData.oxygenSaturation) || 0
      },
      labResults: {
        hemoglobin: parseFloat(formData.hemoglobin) || 0,
        whiteCellCount: parseFloat(formData.whiteCellCount) || 0,
        plateletCount: parseInt(formData.plateletCount) || 0,
        clottingTime: formData.clottingTime
      },
      checklistItems: {
        patientIdentity: formData.patientIdentity,
        procedureSite: formData.procedureSite,
        consent: formData.consent,
        bloodGrouping: formData.bloodGrouping,
        crossMatching: formData.crossMatching,
        npoStatus: formData.npoStatus,
        allergies: formData.allergies,
        medications: formData.medications,
        anesthesiaAssessment: formData.anesthesiaAssessment
      },
      status: 'Completed'
    };

    const patient = patients.find(p => p.patientId === formData.patientId);

    if (editingId) {
      dispatch(updatePreOpAssessment({
        assessmentId: editingId,
        ...assessmentData,
        patientName: patient?.name || 'Unknown Patient'
      }));
      setEditingId(null);
    } else {
      const newAssessment = {
        assessmentId: `PREOP${Date.now()}`,
        patientId: formData.patientId,
        patientName: patient?.name || 'Unknown Patient',
        procedure: formData.procedure,
        ...assessmentData
      };

      dispatch(addPreOpAssessment(newAssessment));
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      procedure: '',
      assessmentDate: '',
      assessedBy: '',
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      hemoglobin: '',
      whiteCellCount: '',
      plateletCount: '',
      clottingTime: '',
      patientIdentity: false,
      procedureSite: false,
      consent: false,
      bloodGrouping: false,
      crossMatching: false,
      npoStatus: false,
      allergies: false,
      medications: false,
      anesthesiaAssessment: false,
      notes: ''
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const getChecklistStatus = (assessment) => {
    const items = assessment.checklistItems;
    const completedItems = Object.values(items).filter(item => item === true).length;
    const totalItems = Object.keys(items).length;
    return { completed: completedItems, total: totalItems };
  };

  const renderAssessmentForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Pre-Operative Assessment</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient *</label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.patientId} value={patient.patientId}>
                  {patient.name} (ID: {patient.patientId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Procedure *</label>
            <select
              name="procedure"
              value={formData.procedure}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Procedure</option>
              {procedures.map(proc => (
                <option key={proc.procedureId} value={proc.name}>
                  {proc.name} ({proc.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Assessment Date</label>
            <input
              type="date"
              name="assessmentDate"
              value={formData.assessmentDate}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assessed By</label>
            <input
              type="text"
              name="assessedBy"
              value={formData.assessedBy}
              onChange={handleChange}
              placeholder="Doctor's name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Vital Signs */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
              <input
                type="text"
                name="bloodPressure"
                value={formData.bloodPressure}
                onChange={handleChange}
                placeholder="120/80"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Heart Rate</label>
              <input
                type="number"
                name="heartRate"
                value={formData.heartRate}
                onChange={handleChange}
                placeholder="72"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                step="0.1"
                placeholder="36.8"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Respiratory Rate</label>
              <input
                type="number"
                name="respiratoryRate"
                value={formData.respiratoryRate}
                onChange={handleChange}
                placeholder="16"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SpO2 (%)</label>
              <input
                type="number"
                name="oxygenSaturation"
                value={formData.oxygenSaturation}
                onChange={handleChange}
                placeholder="98"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Laboratory Results */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Laboratory Results</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Hemoglobin (g/dL)</label>
              <input
                type="number"
                name="hemoglobin"
                value={formData.hemoglobin}
                onChange={handleChange}
                step="0.1"
                placeholder="14.2"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">WBC (×10³/μL)</label>
              <input
                type="number"
                name="whiteCellCount"
                value={formData.whiteCellCount}
                onChange={handleChange}
                step="0.1"
                placeholder="8.5"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Platelets (×10³/μL)</label>
              <input
                type="number"
                name="plateletCount"
                value={formData.plateletCount}
                onChange={handleChange}
                placeholder="250"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Clotting Time</label>
              <input
                type="text"
                name="clottingTime"
                value={formData.clottingTime}
                onChange={handleChange}
                placeholder="Normal"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* WHO Surgical Safety Checklist */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-medium text-gray-900 mb-4">WHO Surgical Safety Checklist</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-800 mb-3">Sign In</h5>
              <div className="space-y-2">
                {[
                  { key: 'patientIdentity', label: 'Patient identity confirmed' },
                  { key: 'procedureSite', label: 'Procedure site marked' },
                  { key: 'consent', label: 'Consent confirmed' }
                ].map(item => (
                  <label key={item.key} className="flex items-center">
                    <input
                      type="checkbox"
                      name={item.key}
                      checked={formData[item.key]}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-800 mb-3">Pre-Operative Checks</h5>
              <div className="space-y-2">
                {[
                  { key: 'bloodGrouping', label: 'Blood grouping done' },
                  { key: 'crossMatching', label: 'Cross-matching done' },
                  { key: 'npoStatus', label: 'NPO status confirmed' },
                  { key: 'allergies', label: 'Allergies reviewed' },
                  { key: 'medications', label: 'Medications reviewed' },
                  { key: 'anesthesiaAssessment', label: 'Anesthesia assessment done' }
                ].map(item => (
                  <label key={item.key} className="flex items-center">
                    <input
                      type="checkbox"
                      name={item.key}
                      checked={formData[item.key]}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
        >
          {editingId ? 'Update Assessment' : 'Complete Assessment'}
        </button>
      </form>
    </div>
  );

  const renderAssessmentsList = () => {
    const displayedItems = preOpAssessments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Pre-Operative Assessments</h3>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + New Assessment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Procedure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessment Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Checklist</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((assessment) => {
                const checklistStatus = getChecklistStatus(assessment);
                return (
                  <tr key={assessment.assessmentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{assessment.patientName}</div>
                      <div className="text-sm text-gray-500">ID: {assessment.patientId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.procedure}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assessment.assessmentDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {checklistStatus.completed}/{checklistStatus.total}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(checklistStatus.completed / checklistStatus.total) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        assessment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assessment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-2">
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {preOpAssessments.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(preOpAssessments.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    );
  };

  return (
    <div className="pre-operative-assessment p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Pre-Operative Assessment</h2>
        <p className="text-gray-600">WHO surgical safety checklist and pre-op evaluations</p>
      </div>

      <div className="space-y-6">
        {showForm && renderAssessmentForm()}

        {!showForm && renderAssessmentsList()}
      </div>
    </div>
  );
};

export default PreOperativeAssessment;