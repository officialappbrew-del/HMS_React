import React, { useState } from 'react';
import { Calendar, User, Activity, Pill, AlertTriangle } from 'lucide-react';

const HivAidsCarePlans = ({ patientId, onSave }) => {
  const [formData, setFormData] = useState({
    cd4Count: '',
    viralLoad: '',
    artRegimen: '',
    opportunisticInfections: '',
    adherence: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const carePlan = {
      patientId,
      type: 'HIV/AIDS Care Plan',
      date: new Date().toISOString(),
      ...formData
    };
    await onSave({ templateType: 'HIV/AIDS Care Plan', data: carePlan });
    // Reset form
    setFormData({
      cd4Count: '',
      viralLoad: '',
      artRegimen: '',
      opportunisticInfections: '',
      adherence: '',
      nextAppointment: '',
      notes: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Activity className="w-8 h-8 text-red-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">HIV/AIDS Care Plan</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CD4 Count (cells/μL)
            </label>
            <input
              type="number"
              name="cd4Count"
              value={formData.cd4Count}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 350"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Viral Load (copies/mL)
            </label>
            <input
              type="number"
              name="viralLoad"
              value={formData.viralLoad}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 40000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ART Regimen
            </label>
            <select
              name="artRegimen"
              value={formData.artRegimen}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select regimen</option>
              <option value="TDF/FTC/EFV">TDF/FTC/EFV</option>
              <option value="TDF/FTC/DTG">TDF/FTC/DTG</option>
              <option value="AZT/3TC/DTG">AZT/3TC/DTG</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adherence (%)
            </label>
            <input
              type="number"
              name="adherence"
              value={formData.adherence}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 95"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opportunistic Infections
          </label>
          <textarea
            name="opportunisticInfections"
            value={formData.opportunisticInfections}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="List any opportunistic infections..."
          />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Additional care plan notes..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Save Care Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default HivAidsCarePlans;