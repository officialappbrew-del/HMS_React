import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addClinicalNote } from '../../features/emrSlice';
import { Droplet, AlertTriangle, Calendar, Activity } from 'lucide-react';

const SickleCellDiseaseTracking = ({ patientId }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    genotype: '',
    crisisType: '',
    crisisFrequency: '',
    painLevel: '',
    hemoglobinLevel: '',
    reticulocyteCount: '',
    bilirubinLevel: '',
    medications: '',
    hydroxyureaDose: '',
    bloodTransfusions: '',
    complications: '',
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
    const sickleCellRecord = {
      patientId,
      type: 'Sickle Cell Disease Tracking',
      date: new Date().toISOString(),
      ...formData
    };
    dispatch(addClinicalNote(sickleCellRecord));
    // Reset form
    setFormData({
      genotype: '',
      crisisType: '',
      crisisFrequency: '',
      painLevel: '',
      hemoglobinLevel: '',
      reticulocyteCount: '',
      bilirubinLevel: '',
      medications: '',
      hydroxyureaDose: '',
      bloodTransfusions: '',
      complications: '',
      nextAppointment: '',
      notes: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Droplet className="w-8 h-8 text-red-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Sickle Cell Disease Tracking</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genotype
            </label>
            <select
              name="genotype"
              value={formData.genotype}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select genotype</option>
              <option value="SS">SS (Sickle Cell Anemia)</option>
              <option value="SC">SC</option>
              <option value="Sβ+">Sβ+ Thalassemia</option>
              <option value="Sβ0">Sβ0 Thalassemia</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crisis Type
            </label>
            <select
              name="crisisType"
              value={formData.crisisType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select crisis type</option>
              <option value="vaso-occlusive">Vaso-occlusive Crisis</option>
              <option value="aplastic">Aplastic Crisis</option>
              <option value="hemolytic">Hemolytic Crisis</option>
              <option value="sequestration">Sequestration Crisis</option>
              <option value="acute_chest">Acute Chest Syndrome</option>
              <option value="stroke">Stroke</option>
              <option value="none">No Current Crisis</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crisis Frequency (per year)
            </label>
            <input
              type="number"
              name="crisisFrequency"
              value={formData.crisisFrequency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pain Level (0-10)
            </label>
            <input
              type="number"
              name="painLevel"
              value={formData.painLevel}
              onChange={handleInputChange}
              min="0"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="0-10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hemoglobin (g/dL)
            </label>
            <input
              type="number"
              step="0.1"
              name="hemoglobinLevel"
              value={formData.hemoglobinLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 8.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reticulocyte Count (%)
            </label>
            <input
              type="number"
              step="0.1"
              name="reticulocyteCount"
              value={formData.reticulocyteCount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 5.2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bilirubin Level (mg/dL)
            </label>
            <input
              type="number"
              step="0.1"
              name="bilirubinLevel"
              value={formData.bilirubinLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 2.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hydroxyurea Dose (mg/day)
            </label>
            <input
              type="number"
              name="hydroxyureaDose"
              value={formData.hydroxyureaDose}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Transfusions (last 6 months)
            </label>
            <input
              type="number"
              name="bloodTransfusions"
              value={formData.bloodTransfusions}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Number of transfusions"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Medications
          </label>
          <textarea
            name="medications"
            value={formData.medications}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="List current medications and dosages..."
          />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="List any complications or comorbidities..."
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
            placeholder="Additional sickle cell disease notes..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Save Sickle Cell Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default SickleCellDiseaseTracking;