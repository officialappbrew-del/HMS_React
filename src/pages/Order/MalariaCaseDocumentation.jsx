import React, { useState } from 'react';
import { Thermometer, Droplets, Activity, AlertTriangle, Clock, Pill } from 'lucide-react';

const MalariaCaseDocumentation = ({ patientId, onSave }) => {
  const [formData, setFormData] = useState({
    visitDate: '',
    symptoms: {
      fever: false,
      chills: false,
      headache: false,
      vomiting: false,
      diarrhea: false,
      musclePain: false,
      fatigue: false,
      jaundice: false,
      confusion: false,
      seizures: false,
    },
    symptomDuration: '',
    temperature: '',
    rdtResult: '',
    microscopyResult: '',
    parasiteSpecies: '',
    parasiteDensity: '',
    severity: '',
    complications: '',
    treatmentGiven: '',
    medication: {
      artemisininBased: false,
      chloroquine: false,
      primaquine: false,
      quinine: false,
      other: ''
    },
    medicationDosage: '',
    medicationDuration: '',
    followUpTestDate: '',
    followUpDate: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name.includes('symptoms.')) {
        const symptomName = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          symptoms: {
            ...prev.symptoms,
            [symptomName]: checked
          }
        }));
      } else if (name.includes('medication.')) {
        const medName = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          medication: {
            ...prev.medication,
            [medName]: checked
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const malariaRecord = {
      patientId,
      type: 'Malaria Case Documentation',
      date: new Date().toISOString(),
      ...formData,
      severityLevel: calculateSeverityLevel(formData)
    };
    
    await onSave({ templateType: 'Malaria Case Documentation', data: malariaRecord });
    
    // Reset form
    setFormData({
      visitDate: '',
      symptoms: {
        fever: false,
        chills: false,
        headache: false,
        vomiting: false,
        diarrhea: false,
        musclePain: false,
        fatigue: false,
        jaundice: false,
        confusion: false,
        seizures: false,
      },
      symptomDuration: '',
      temperature: '',
      rdtResult: '',
      microscopyResult: '',
      parasiteSpecies: '',
      parasiteDensity: '',
      severity: '',
      complications: '',
      treatmentGiven: '',
      medication: {
        artemisininBased: false,
        chloroquine: false,
        primaquine: false,
        quinine: false,
        other: ''
      },
      medicationDosage: '',
      medicationDuration: '',
      followUpTestDate: '',
      followUpDate: '',
      notes: ''
    });
  };

  const calculateSeverityLevel = (data) => {
    if (data.complications || data.severity === 'severe') return 'Severe Malaria';
    if (data.severity === 'moderate') return 'Uncomplicated Malaria (Moderate)';
    return 'Uncomplicated Malaria (Mild)';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Droplets className="w-8 h-8 text-red-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Malaria Case Documentation</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Date and Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Visit Date
            </label>
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Thermometer className="w-4 h-4 inline mr-1" />
              Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 38.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Symptom Duration (Days)
            </label>
            <input
              type="number"
              name="symptomDuration"
              value={formData.symptomDuration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 3"
            />
          </div>
        </div>

        {/* Symptoms Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Symptoms
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(formData.symptoms).map(([symptom, checked]) => (
              <label key={symptom} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={`symptoms.${symptom}`}
                  checked={checked}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 rounded"
                />
                <span className="text-sm text-gray-700 capitalize">{symptom.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Diagnostic Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Diagnostic Tests</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rapid Diagnostic Test (RDT)
                </label>
                <select
                  name="rdtResult"
                  value={formData.rdtResult}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select result</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="invalid">Invalid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Microscopy Result
                </label>
                <select
                  name="microscopyResult"
                  value={formData.microscopyResult}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select result</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parasite Species
                </label>
                <select
                  name="parasiteSpecies"
                  value={formData.parasiteSpecies}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select species</option>
                  <option value="plasmodium falciparum">Plasmodium falciparum</option>
                  <option value="plasmodium vivax">Plasmodium vivax</option>
                  <option value="plasmodium ovale">Plasmodium ovale</option>
                  <option value="plasmodium malariae">Plasmodium malariae</option>
                  <option value="plasmodium knowlesi">Plasmodium knowlesi</option>
                  <option value="mixed">Mixed infection</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parasite Density (parasites/μL)
                </label>
                <input
                  type="number"
                  name="parasiteDensity"
                  value={formData.parasiteDensity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 5000"
                />
              </div>
            </div>
          </div>

          {/* Treatment Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Treatment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select severity</option>
                  <option value="mild">Mild (Uncomplicated)</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe Malaria</option>
                </select>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <Pill className="w-4 h-4 mr-2" />
                  Antimalarial Medications
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(formData.medication).map(([med, checked]) => (
                    med !== 'other' && (
                      <label key={med} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name={`medication.${med}`}
                          checked={checked}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-red-600 rounded"
                        />
                        <span className="text-sm text-gray-700 capitalize">{med.replace(/([A-Z])/g, ' $1')}</span>
                      </label>
                    )
                  ))}
                </div>
                
                {formData.medication.other && (
                  <div className="mt-3">
                    <input
                      type="text"
                      name="medication.other"
                      value={formData.medication.other}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="Specify other medication"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medication Dosage
                </label>
                <textarea
                  name="medicationDosage"
                  value={formData.medicationDosage}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., Artemether-Lumefantrine 80/480mg: 4 tablets initially, then 4 tablets at 8, 24, 36, 48, and 60 hours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Treatment Duration (Days)
                </label>
                <input
                  type="number"
                  name="medicationDuration"
                  value={formData.medicationDuration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., 3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Complications and Follow-up */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Complications
            </label>
            <textarea
              name="complications"
              value={formData.complications}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., Cerebral malaria, severe anemia, renal failure, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treatment Given
            </label>
            <textarea
              name="treatmentGiven"
              value={formData.treatmentGiven}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Describe treatment administered"
            />
          </div>
        </div>

        {/* Follow-up Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Test Date
            </label>
            <input
              type="date"
              name="followUpTestDate"
              value={formData.followUpTestDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Clinic Date
            </label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity Assessment
            </label>
            <div className="p-3 bg-gray-100 rounded-md">
              <span className={`font-medium ${
                calculateSeverityLevel(formData) === 'Severe Malaria' ? 'text-red-600' :
                calculateSeverityLevel(formData).includes('Moderate') ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {calculateSeverityLevel(formData)}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Additional clinical notes, patient instructions, etc."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
          >
            Save Malaria Case Documentation
          </button>
        </div>
      </form>
    </div>
  );
};

export default MalariaCaseDocumentation;