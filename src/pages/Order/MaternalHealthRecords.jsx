import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addClinicalNote } from '../../features/emrSlice';
import { Baby, Calendar, Heart, Activity, User } from 'lucide-react';

const MaternalHealthRecords = ({ patientId }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    gestationalAge: '',
    expectedDeliveryDate: '',
    antenatalVisits: '',
    bloodPressure: '',
    weight: '',
    fetalHeartRate: '',
    fundalHeight: '',
    urineProtein: '',
    bloodSugar: '',
    hemoglobin: '',
    hivStatus: '',
    syphilisStatus: '',
    tetanusImmunization: '',
    ironSupplements: '',
    complications: '',
    nextVisit: '',
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
    const maternalRecord = {
      patientId,
      type: 'Maternal Health Record',
      date: new Date().toISOString(),
      ...formData
    };
    dispatch(addClinicalNote(maternalRecord));
    // Reset form
    setFormData({
      gestationalAge: '',
      expectedDeliveryDate: '',
      antenatalVisits: '',
      bloodPressure: '',
      weight: '',
      fetalHeartRate: '',
      fundalHeight: '',
      urineProtein: '',
      bloodSugar: '',
      hemoglobin: '',
      hivStatus: '',
      syphilisStatus: '',
      tetanusImmunization: '',
      ironSupplements: '',
      complications: '',
      nextVisit: '',
      notes: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Baby className="w-8 h-8 text-pink-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Maternal Health Records</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gestational Age (weeks)
            </label>
            <input
              type="number"
              name="gestationalAge"
              value={formData.gestationalAge}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., 24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Delivery Date
            </label>
            <input
              type="date"
              name="expectedDeliveryDate"
              value={formData.expectedDeliveryDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Antenatal Visits
            </label>
            <input
              type="number"
              name="antenatalVisits"
              value={formData.antenatalVisits}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Number of visits"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Pressure
            </label>
            <input
              type="text"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="120/80"
            />
          </div>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., 65.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fetal Heart Rate (bpm)
            </label>
            <input
              type="number"
              name="fetalHeartRate"
              value={formData.fetalHeartRate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., 140"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fundal Height (cm)
            </label>
            <input
              type="number"
              name="fundalHeight"
              value={formData.fundalHeight}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., 24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urine Protein
            </label>
            <select
              name="urineProtein"
              value={formData.urineProtein}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select</option>
              <option value="Negative">Negative</option>
              <option value="Trace">Trace</option>
              <option value="+">+</option>
              <option value="++">++</option>
              <option value="+++">+++</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Sugar (mg/dL)
            </label>
            <input
              type="number"
              name="bloodSugar"
              value={formData.bloodSugar}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., 95"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hemoglobin (g/dL)
            </label>
            <input
              type="number"
              step="0.1"
              name="hemoglobin"
              value={formData.hemoglobin}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., 11.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HIV Status
            </label>
            <select
              name="hivStatus"
              value={formData.hivStatus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select</option>
              <option value="Negative">Negative</option>
              <option value="Positive">Positive</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Syphilis Status
            </label>
            <select
              name="syphilisStatus"
              value={formData.syphilisStatus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select</option>
              <option value="Negative">Negative</option>
              <option value="Positive">Positive</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tetanus Immunization
            </label>
            <input
              type="text"
              name="tetanusImmunization"
              value={formData.tetanusImmunization}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g., TT1, TT2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Iron Supplements
            </label>
            <input
              type="text"
              name="ironSupplements"
              value={formData.ironSupplements}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Dosage and compliance"
            />
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Any pregnancy complications..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Next Visit Date
          </label>
          <input
            type="date"
            name="nextVisit"
            value={formData.nextVisit}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Additional maternal health notes..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Save Maternal Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaternalHealthRecords;