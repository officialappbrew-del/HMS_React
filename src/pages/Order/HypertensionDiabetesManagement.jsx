import React, { useState } from 'react';
import { Heart, Activity, Calendar, TrendingUp } from 'lucide-react';

const HypertensionDiabetesManagement = ({ patientId, onSave }) => {
  const [formData, setFormData] = useState({
    visitDate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    fastingBloodSugar: '',
    postPrandialBloodSugar: '',
    hba1c: '',
    weight: '',
    bmi: '',
    waistCircumference: '',
    totalCholesterol: '',
    ldl: '',
    hdl: '',
    triglycerides: '',
    creatinine: '',
    medications: '',
    lifestyleModifications: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ncdRecord = {
      patientId,
      type: 'Hypertension & Diabetes Management',
      date: new Date().toISOString(),
      ...formData
    };
    await onSave({ templateType: 'Hypertension & Diabetes Management', data: ncdRecord });
    // Reset form
    setFormData({
      visitDate: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      fastingBloodSugar: '',
      postPrandialBloodSugar: '',
      hba1c: '',
      weight: '',
      bmi: '',
      waistCircumference: '',
      totalCholesterol: '',
      ldl: '',
      hdl: '',
      triglycerides: '',
      creatinine: '',
      medications: '',
      lifestyleModifications: '',
      complications: '',
      nextAppointment: '',
      notes: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Heart className="w-8 h-8 text-red-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Hypertension & Diabetes Management</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visit Date
            </label>
            <input
              type="date"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Systolic BP (mmHg)
            </label>
            <input
              type="number"
              name="bloodPressureSystolic"
              value={formData.bloodPressureSystolic}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 140"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diastolic BP (mmHg)
            </label>
            <input
              type="number"
              name="bloodPressureDiastolic"
              value={formData.bloodPressureDiastolic}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 90"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fasting Blood Sugar (mg/dL)
            </label>
            <input
              type="number"
              name="fastingBloodSugar"
              value={formData.fastingBloodSugar}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 126"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Prandial BS (mg/dL)
            </label>
            <input
              type="number"
              name="postPrandialBloodSugar"
              value={formData.postPrandialBloodSugar}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 180"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HbA1c (%)
            </label>
            <input
              type="number"
              step="0.1"
              name="hba1c"
              value={formData.hba1c}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 7.2"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 75.5"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 28.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Waist Circumference (cm)
            </label>
            <input
              type="number"
              name="waistCircumference"
              value={formData.waistCircumference}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 95"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Cholesterol (mg/dL)
            </label>
            <input
              type="number"
              name="totalCholesterol"
              value={formData.totalCholesterol}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 220"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LDL (mg/dL)
            </label>
            <input
              type="number"
              name="ldl"
              value={formData.ldl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 140"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HDL (mg/dL)
            </label>
            <input
              type="number"
              name="hdl"
              value={formData.hdl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 45"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Triglycerides (mg/dL)
            </label>
            <input
              type="number"
              name="triglycerides"
              value={formData.triglycerides}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 180"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Creatinine (mg/dL)
            </label>
            <input
              type="number"
              step="0.1"
              name="creatinine"
              value={formData.creatinine}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 1.2"
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
            placeholder="List current medications with dosages..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lifestyle Modifications
          </label>
          <textarea
            name="lifestyleModifications"
            value={formData.lifestyleModifications}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Diet, exercise, smoking cessation, etc..."
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
            placeholder="Any complications or comorbidities..."
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
            placeholder="Additional NCD management notes..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Save NCD Management Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default HypertensionDiabetesManagement;




