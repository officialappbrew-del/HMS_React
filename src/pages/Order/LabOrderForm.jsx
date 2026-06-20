import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addClinicalNote } from '../../features/emrSlice';
import { Flask, Calendar, User, FileText } from 'lucide-react';

const LabOrderForm = ({ patientId }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    orderDate: '',
    orderingPhysician: '',
    clinicalIndication: '',
    priority: '',
    hematologyTests: [],
    biochemistryTests: [],
    microbiologyTests: [],
    immunologyTests: [],
    otherTests: '',
    specialInstructions: '',
    sampleType: '',
    collectionTime: '',
    fastingRequired: false,
    notes: ''
  });

  const hematologyTests = [
    'Complete Blood Count (CBC)',
    'Hemoglobin',
    'Hematocrit',
    'White Blood Cell Count',
    'Platelet Count',
    'Erythrocyte Sedimentation Rate (ESR)',
    'Blood Film',
    'Coagulation Profile',
    'Sickle Cell Screen'
  ];

  const biochemistryTests = [
    'Fasting Blood Sugar',
    'Random Blood Sugar',
    'HbA1c',
    'Liver Function Tests',
    'Kidney Function Tests',
    'Lipid Profile',
    'Electrolyte Panel',
    'Thyroid Function Tests',
    'Cardiac Enzymes'
  ];

  const microbiologyTests = [
    'Blood Culture',
    'Urine Culture',
    'Stool Culture',
    'Sputum Culture',
    'Wound Swab Culture',
    'Throat Swab',
    'GeneXpert for TB',
    'Malaria Parasite',
    'Widal Test'
  ];

  const immunologyTests = [
    'HIV Test',
    'VDRL/TPHA',
    'HBsAg',
    'Anti-HCV',
    'Rheumatoid Factor',
    'ANA',
    'CRP',
    'ASO Titre'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTestSelection = (category, test) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(test)
        ? prev[category].filter(t => t !== test)
        : [...prev[category], test]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const labOrder = {
      patientId,
      type: 'Laboratory Order',
      date: new Date().toISOString(),
      ...formData
    };
    dispatch(addClinicalNote(labOrder));
    // Reset form
    setFormData({
      orderDate: '',
      orderingPhysician: '',
      clinicalIndication: '',
      priority: '',
      hematologyTests: [],
      biochemistryTests: [],
      microbiologyTests: [],
      immunologyTests: [],
      otherTests: '',
      specialInstructions: '',
      sampleType: '',
      collectionTime: '',
      fastingRequired: false,
      notes: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Flask className="w-8 h-8 text-green-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Laboratory Order Form</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Date
            </label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordering Physician
            </label>
            <input
              type="text"
              name="orderingPhysician"
              value={formData.orderingPhysician}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Dr. Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select priority</option>
              <option value="routine">Routine</option>
              <option value="urgent">Urgent</option>
              <option value="stat">STAT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sample Type
            </label>
            <select
              name="sampleType"
              value={formData.sampleType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select sample type</option>
              <option value="blood">Blood</option>
              <option value="urine">Urine</option>
              <option value="stool">Stool</option>
              <option value="sputum">Sputum</option>
              <option value="swab">Swab</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinical Indication
          </label>
          <textarea
            name="clinicalIndication"
            value={formData.clinicalIndication}
            onChange={handleInputChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Reason for laboratory investigation..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection Time
            </label>
            <input
              type="time"
              name="collectionTime"
              value={formData.collectionTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="fastingRequired"
              checked={formData.fastingRequired}
              onChange={handleInputChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm font-medium text-gray-700">
              Fasting Required
            </label>
          </div>
        </div>

        {/* Test Selection Sections */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Hematology Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {hematologyTests.map(test => (
                <label key={test} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hematologyTests.includes(test)}
                    onChange={() => handleTestSelection('hematologyTests', test)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{test}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Biochemistry Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {biochemistryTests.map(test => (
                <label key={test} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.biochemistryTests.includes(test)}
                    onChange={() => handleTestSelection('biochemistryTests', test)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{test}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Microbiology Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {microbiologyTests.map(test => (
                <label key={test} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.microbiologyTests.includes(test)}
                    onChange={() => handleTestSelection('microbiologyTests', test)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{test}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Immunology Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {immunologyTests.map(test => (
                <label key={test} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.immunologyTests.includes(test)}
                    onChange={() => handleTestSelection('immunologyTests', test)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{test}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Tests
          </label>
          <textarea
            name="otherTests"
            value={formData.otherTests}
            onChange={handleInputChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Specify any other tests not listed above..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions
          </label>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Any special handling or instructions for the laboratory..."
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
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Additional laboratory order notes..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Submit Lab Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabOrderForm;