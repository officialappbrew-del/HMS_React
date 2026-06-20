import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addClinicalNote } from '../../features/emrSlice';
import { Pill, AlertTriangle, Clock, User } from 'lucide-react';
import useDrugInteractionCheck from './useDrugInteractionCheck';

const MedicationOrderForm = ({ patientId }) => {
  const dispatch = useDispatch();
  const [medications, setMedications] = useState([]);
  const [currentMed, setCurrentMed] = useState({
    name: '',
    dose: '',
    frequency: '',
    duration: '',
    route: '',
    indication: '',
    instructions: ''
  });

  const { interactions, hasMajorInteractions, hasModerateInteractions, getInteractionSeverityColor } = useDrugInteractionCheck(medications);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMed(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMedication = () => {
    if (currentMed.name && currentMed.dose && currentMed.frequency) {
      setMedications(prev => [...prev, { ...currentMed, id: Date.now() }]);
      setCurrentMed({
        name: '',
        dose: '',
        frequency: '',
        duration: '',
        route: '',
        indication: '',
        instructions: ''
      });
    }
  };

  const removeMedication = (id) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const medicationOrder = {
      patientId,
      type: 'Medication Order',
      date: new Date().toISOString(),
      medications: medications,
      interactions: interactions,
      notes: 'Medication order with interaction checking'
    };
    dispatch(addClinicalNote(medicationOrder));
    // Reset form
    setMedications([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Pill className="w-8 h-8 text-green-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Medication Order Form</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Add Medication Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Medication</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medication Name
              </label>
              <input
                type="text"
                name="name"
                value={currentMed.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Amoxicillin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dose
              </label>
              <input
                type="text"
                name="dose"
                value={currentMed.dose}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 500mg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                name="frequency"
                value={currentMed.frequency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select frequency</option>
                <option value="once daily">Once daily</option>
                <option value="twice daily">Twice daily</option>
                <option value="three times daily">Three times daily</option>
                <option value="four times daily">Four times daily</option>
                <option value="every 6 hours">Every 6 hours</option>
                <option value="every 8 hours">Every 8 hours</option>
                <option value="every 12 hours">Every 12 hours</option>
                <option value="as needed">As needed</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={currentMed.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 7 days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Route
              </label>
              <select
                name="route"
                value={currentMed.route}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select route</option>
                <option value="oral">Oral</option>
                <option value="intravenous">Intravenous</option>
                <option value="intramuscular">Intramuscular</option>
                <option value="subcutaneous">Subcutaneous</option>
                <option value="topical">Topical</option>
                <option value="inhaled">Inhaled</option>
                <option value="rectal">Rectal</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Indication
              </label>
              <input
                type="text"
                name="indication"
                value={currentMed.indication}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Bacterial infection"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              name="instructions"
              value={currentMed.instructions}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Take with food, avoid alcohol..."
            />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={addMedication}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Medication
            </button>
          </div>
        </div>

        {/* Current Medications List */}
        {medications.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Medications</h3>
            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{med.name}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm text-gray-600">
                        <span><strong>Dose:</strong> {med.dose}</span>
                        <span><strong>Frequency:</strong> {med.frequency}</span>
                        <span><strong>Duration:</strong> {med.duration}</span>
                        <span><strong>Route:</strong> {med.route}</span>
                      </div>
                      {med.indication && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Indication:</strong> {med.indication}
                        </p>
                      )}
                      {med.instructions && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Instructions:</strong> {med.instructions}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMedication(med.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drug Interactions Alert */}
        {interactions.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <h4 className="text-lg font-semibold text-yellow-800">Drug Interactions Detected</h4>
            </div>
            <div className="space-y-3">
              {interactions.map((interaction, index) => (
                <div key={index} className={`p-3 rounded-md border ${getInteractionSeverityColor(interaction.severity)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{interaction.drugs.join(' + ')}</p>
                      <p className="text-sm mt-1">{interaction.description}</p>
                      <p className="text-sm mt-1 font-medium">Recommendation: {interaction.recommendation}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      interaction.severity === 'Major' ? 'bg-red-100 text-red-800' :
                      interaction.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {interaction.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {medications.length > 0 && (
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 ${
                hasMajorInteractions
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : hasModerateInteractions
                  ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              }`}
            >
              {hasMajorInteractions ? 'Submit with Major Interactions' :
               hasModerateInteractions ? 'Submit with Moderate Interactions' :
               'Submit Medication Order'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MedicationOrderForm;