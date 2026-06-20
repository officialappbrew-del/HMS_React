// Custom hook for drug interaction checking
// This would typically integrate with a drug interaction database API

import { useState, useEffect } from 'react';

const useDrugInteractionCheck = (medications) => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (medications && medications.length > 1) {
      checkInteractions(medications);
    } else {
      setInteractions([]);
    }
  }, [medications]);

  const checkInteractions = async (meds) => {
    setLoading(true);
    setError(null);

    try {
      // Mock drug interaction database
      // In a real application, this would call an API like Drugs.com or RxNorm
      const mockInteractions = [
        {
          drugs: ['Warfarin', 'Aspirin'],
          severity: 'Major',
          description: 'Increased risk of bleeding',
          recommendation: 'Monitor INR closely, consider dose adjustment'
        },
        {
          drugs: ['Simvastatin', 'Amiodarone'],
          severity: 'Major',
          description: 'Increased risk of myopathy and rhabdomyolysis',
          recommendation: 'Reduce statin dose, monitor CK levels'
        },
        {
          drugs: ['ACE Inhibitors', 'Potassium Supplements'],
          severity: 'Moderate',
          description: 'Risk of hyperkalemia',
          recommendation: 'Monitor potassium levels regularly'
        },
        {
          drugs: ['Metformin', 'Furosemide'],
          severity: 'Moderate',
          description: 'Increased risk of lactic acidosis',
          recommendation: 'Monitor renal function and lactate levels'
        }
      ];

      // Check for interactions in current medication list
      const foundInteractions = mockInteractions.filter(interaction =>
        interaction.drugs.every(drug =>
          meds.some(med =>
            med.name.toLowerCase().includes(drug.toLowerCase()) ||
            drug.toLowerCase().includes(med.name.toLowerCase())
          )
        )
      );

      setInteractions(foundInteractions);
    } catch (err) {
      setError('Failed to check drug interactions');
      console.error('Drug interaction check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInteractionSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'major':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'minor':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const hasMajorInteractions = interactions.some(int => int.severity === 'Major');
  const hasModerateInteractions = interactions.some(int => int.severity === 'Moderate');

  return {
    interactions,
    loading,
    error,
    hasMajorInteractions,
    hasModerateInteractions,
    getInteractionSeverityColor,
    checkInteractions
  };
};

export default useDrugInteractionCheck;