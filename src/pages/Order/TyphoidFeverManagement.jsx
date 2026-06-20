import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addClinicalNote } from '../../features/emrSlice';
import { Thermometer, Calendar, Activity, AlertTriangle } from 'lucide-react';

const TyphoidFeverManagement = ({ patientId }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    diagnosisDate: '',
    widalTest: '',
    bloodCulture: '',
    stoolCulture: '',
    antibioticSensitivity: '',
    treatmentRegimen: '',
    temperature: '',
    dehydrationStatus: '',
    complications: '',
    antibioticStarted: '',
    antibioticDuration: '',
    responseToTreatment: '',
    followUpCultures: '',
    vaccinationStatus: '',
    nextAppointment: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const typhoidRecord = {
      patientId,
      type: 'Typhoid Fever Management',
      date: new Date().toISOString(),
      ...formData
    };
    dispatch(addClinicalNote(typhoidRecord));
    // Reset form
    setFormData({
      diagnosisDate: '',
      widalTest: '',
      bloodCulture: '',
      stoolCulture: '',
      antibioticSensitivity: '',
      treatmentRegimen: '',
      temperature: '',
      dehydrationStatus: '',
      complications: '',
      antibioticStarted: '',
      antibioticDuration: '',
      responseToTreatment: '',
      followUpCultures: '',
      vaccinationStatus: '',
      nextAppointment: '',
      notes: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Thermometer className="w-8 h-8 text-orange-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Typhoid Fever Management</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Widal Test Result
            </label>
            <input
              type="text"
              name="widalTest"
              value={formData.widalTest}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., TO 1:160, TH 1:80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Culture
            </label>
            <select
              name="bloodCulture"
              value={formData.bloodCulture}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select result</option>
              <option value="positive">Positive (S. typhi)</option>
              <option value="negative">Negative</option>
              <option value="contaminated">Contaminated</option>
              <option value="not_done">Not Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stool Culture
            </label>
            <select
              name="stoolCulture"
              value={formData.stoolCulture}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select result</option>
              <option value="positive">Positive (S. typhi)</option>
              <option value="negative">Negative</option>
              <option value="contaminated">Contaminated</option>
              <option value="not_done">Not Done</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antibiotic Sensitivity
            </label>
            <input
              type="text"
              name="antibioticSensitivity"
              value={formData.antibioticSensitivity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Sensitive to Ciprofloxacin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treatment Regimen
            </label>
            <select
              name="treatmentRegimen"
              value={formData.treatmentRegimen}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select regimen</option>
              <option value="ciprofloxacin">Ciprofloxacin</option>
              <option value="ceftriaxone">Ceftriaxone</option>
              <option value="azithromycin">Azithromycin</option>
              <option value="chloramphenicol">Chloramphenicol</option>
              <option value="cotrimoxazole">Co-trimoxazole</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 39.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dehydration Status
            </label>
            <select
              name="dehydrationStatus"
              value={formData.dehydrationStatus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select status</option>
              <option value="none">No Dehydration</option>
              <option value="mild">Mild Dehydration</option>
              <option value="moderate">Moderate Dehydration</option>
              <option value="severe">Severe Dehydration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antibiotic Start Date
            </label>
            <input
              type="date"
              name="antibioticStarted"
              value={formData.antibioticStarted}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antibiotic Duration (days)
            </label>
            <input
              type="number"
              name="antibioticDuration"
              value={formData.antibioticDuration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., 14"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response to Treatment
            </label>
            <select
              name="responseToTreatment"
              value={formData.responseToTreatment}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select response</option>
              <option value="improving">Improving</option>
              <option value="stable">Stable</option>
              <option value="worsening">Worsening</option>
              <option value="cured">Cured</option>
              <option value="relapsed">Relapsed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complications
          </label>
          <textarea
            name="complications"
            value={formData.complications}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="List any complications (e.g., perforation, hemorrhage, encephalopathy)..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Cultures
            </label>
            <input
              type="text"
              name="followUpCultures"
              value={formData.followUpCultures}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Results of follow-up cultures"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Typhoid Vaccination Status
            </label>
            <select
              name="vaccinationStatus"
              value={formData.vaccinationStatus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select status</option>
              <option value="vaccinated">Vaccinated</option>
              <option value="not_vaccinated">Not Vaccinated</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Next Appointment
          </label>
          <input
            type="date"
            name="nextAppointment"
            value={formData.nextAppointment}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Additional typhoid fever management notes..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Save Typhoid Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default TyphoidFeverManagement;