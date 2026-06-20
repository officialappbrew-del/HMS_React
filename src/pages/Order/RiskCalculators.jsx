import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addClinicalNote } from '../../features/emrSlice';
import { Calculator, Heart, Activity, Bone, AlertTriangle } from 'lucide-react';

const RiskCalculators = ({ patientId }) => {
  const dispatch = useDispatch();
  const [activeCalculator, setActiveCalculator] = useState('cardiovascular');
  const [results, setResults] = useState({});

  // Cardiovascular Risk Calculator (Framingham)
  const [cardioData, setCardioData] = useState({
    age: '',
    gender: '',
    totalCholesterol: '',
    hdlCholesterol: '',
    systolicBP: '',
    diastolicBP: '',
    smoker: false,
    diabetic: false,
    hypertensive: false
  });

  // Diabetes Risk Calculator (FINDRISC)
  const [diabetesData, setDiabetesData] = useState({
    age: '',
    bmi: '',
    waistCircumference: '',
    physicalActivity: '',
    dailyVegetables: false,
    bloodPressureMeds: false,
    highBloodGlucose: false,
    familyHistoryDiabetes: false
  });

  // Stroke Risk Calculator (CHA₂DS₂-VASc)
  const [strokeData, setStrokeData] = useState({
    age: '',
    gender: '',
    congestiveHeartFailure: false,
    hypertension: false,
    strokeHistory: false,
    vascularDisease: false,
    diabetes: false
  });

  // Fracture Risk Calculator (FRAX)
  const [fractureData, setFractureData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    previousFracture: false,
    parentFracture: false,
    smoking: false,
    glucocorticoids: false,
    rheumatoidArthritis: false,
    secondaryOsteoporosis: false,
    alcohol: ''
  });

  const calculateCardiovascularRisk = () => {
    const { age, gender, totalCholesterol, hdlCholesterol, systolicBP, diastolicBP, smoker, diabetic, hypertensive } = cardioData;

    if (!age || !gender || !totalCholesterol || !hdlCholesterol || !systolicBP || !diastolicBP) {
      alert('Please fill in all required fields');
      return;
    }

    // Simplified Framingham Risk Score calculation
    let score = 0;

    // Age points
    if (gender === 'male') {
      if (age >= 20 && age <= 34) score += -9;
      else if (age >= 35 && age <= 39) score += -4;
      else if (age >= 40 && age <= 44) score += 0;
      else if (age >= 45 && age <= 49) score += 3;
      else if (age >= 50 && age <= 54) score += 6;
      else if (age >= 55 && age <= 59) score += 8;
      else if (age >= 60 && age <= 64) score += 10;
      else if (age >= 65 && age <= 69) score += 11;
      else if (age >= 70 && age <= 74) score += 12;
      else if (age >= 75) score += 13;
    } else {
      if (age >= 20 && age <= 34) score += -7;
      else if (age >= 35 && age <= 39) score += -3;
      else if (age >= 40 && age <= 44) score += 0;
      else if (age >= 45 && age <= 49) score += 3;
      else if (age >= 50 && age <= 54) score += 6;
      else if (age >= 55 && age <= 59) score += 8;
      else if (age >= 60 && age <= 64) score += 10;
      else if (age >= 65 && age <= 69) score += 12;
      else if (age >= 70 && age <= 74) score += 14;
      else if (age >= 75) score += 16;
    }

    // Cholesterol points
    const cholesterolRatio = totalCholesterol / hdlCholesterol;
    if (gender === 'male') {
      if (cholesterolRatio < 4.1) score += 0;
      else if (cholesterolRatio >= 4.1 && cholesterolRatio <= 5.1) score += 1;
      else if (cholesterolRatio >= 5.2 && cholesterolRatio <= 6.2) score += 2;
      else if (cholesterolRatio >= 6.3 && cholesterolRatio <= 7.2) score += 3;
      else score += 4;
    } else {
      if (cholesterolRatio < 4.1) score += 0;
      else if (cholesterolRatio >= 4.1 && cholesterolRatio <= 5.1) score += 1;
      else if (cholesterolRatio >= 5.2 && cholesterolRatio <= 6.2) score += 3;
      else if (cholesterolRatio >= 6.3 && cholesterolRatio <= 7.2) score += 4;
      else score += 5;
    }

    // Smoking points
    if (smoker) score += gender === 'male' ? 8 : 9;

    // Diabetes points
    if (diabetic) score += gender === 'male' ? 10 : 6;

    // Blood pressure points
    if (hypertensive) score += gender === 'male' ? 6 : 8;

    // Calculate 10-year risk
    let risk = 0;
    if (gender === 'male') {
      if (score <= -3) risk = 1;
      else if (score === -2) risk = 1.1;
      else if (score === -1) risk = 1.4;
      else if (score === 0) risk = 1.6;
      else if (score === 1) risk = 1.9;
      else if (score === 2) risk = 2.3;
      else if (score === 3) risk = 2.8;
      else if (score === 4) risk = 3.3;
      else if (score === 5) risk = 3.9;
      else if (score === 6) risk = 4.7;
      else if (score === 7) risk = 5.6;
      else if (score === 8) risk = 6.7;
      else if (score === 9) risk = 7.9;
      else if (score === 10) risk = 9.4;
      else if (score === 11) risk = 11.2;
      else if (score === 12) risk = 13.2;
      else if (score === 13) risk = 15.6;
      else if (score === 14) risk = 18.4;
      else if (score === 15) risk = 21.6;
      else if (score === 16) risk = 25.3;
      else if (score >= 17) risk = 30;
    } else {
      if (score <= 9) risk = 1;
      else if (score === 10) risk = 1;
      else if (score === 11) risk = 1.1;
      else if (score === 12) risk = 1.3;
      else if (score === 13) risk = 1.5;
      else if (score === 14) risk = 1.7;
      else if (score === 15) risk = 2;
      else if (score === 16) risk = 2.4;
      else if (score === 17) risk = 2.8;
      else if (score === 18) risk = 3.3;
      else if (score === 19) risk = 3.9;
      else if (score === 20) risk = 4.6;
      else if (score === 21) risk = 5.4;
      else if (score === 22) risk = 6.3;
      else if (score === 23) risk = 7.3;
      else if (score === 24) risk = 8.6;
      else if (score >= 25) risk = 10;
    }

    const riskLevel = risk < 10 ? 'Low' : risk < 20 ? 'Intermediate' : 'High';

    setResults(prev => ({
      ...prev,
      cardiovascular: {
        score,
        riskPercentage: risk,
        riskLevel,
        recommendations: riskLevel === 'High' ? 'Aggressive risk factor modification recommended' :
                        riskLevel === 'Intermediate' ? 'Consider risk factor modification' :
                        'Maintain healthy lifestyle'
      }
    }));
  };

  const calculateDiabetesRisk = () => {
    const { age, bmi, waistCircumference, physicalActivity, dailyVegetables, bloodPressureMeds, highBloodGlucose, familyHistoryDiabetes } = diabetesData;

    if (!age || !bmi || !waistCircumference || !physicalActivity) {
      alert('Please fill in all required fields');
      return;
    }

    let score = 0;

    // Age points
    if (age < 45) score += 0;
    else if (age >= 45 && age <= 54) score += 2;
    else if (age >= 55 && age <= 64) score += 3;
    else score += 4;

    // BMI points
    if (bmi < 25) score += 0;
    else if (bmi >= 25 && bmi < 30) score += 1;
    else score += 3;

    // Waist circumference points
    if (waistCircumference < 80) score += 0; // Assuming female
    else if (waistCircumference >= 80 && waistCircumference < 88) score += 1;
    else if (waistCircumference >= 88 && waistCircumference < 102) score += 2;
    else score += 3;

    // Physical activity points
    if (physicalActivity === 'active') score += 0;
    else score += 2;

    // Daily vegetables points
    if (dailyVegetables) score += 0;
    else score += 1;

    // Blood pressure medication points
    if (bloodPressureMeds) score += 2;
    else score += 0;

    // High blood glucose points
    if (highBloodGlucose) score += 5;
    else score += 0;

    // Family history points
    if (familyHistoryDiabetes) score += 5;
    else score += 0;

    const riskLevel = score < 7 ? 'Low' : score < 12 ? 'Slightly elevated' :
                     score < 15 ? 'Moderate' : score < 20 ? 'High' : 'Very high';

    setResults(prev => ({
      ...prev,
      diabetes: {
        score,
        riskLevel,
        recommendations: score >= 15 ? 'High risk - Consider lifestyle intervention and screening' :
                        score >= 12 ? 'Moderate risk - Lifestyle intervention recommended' :
                        'Low risk - Maintain healthy lifestyle'
      }
    }));
  };

  const calculateStrokeRisk = () => {
    const { age, gender, congestiveHeartFailure, hypertension, strokeHistory, vascularDisease, diabetes } = strokeData;

    if (!age || !gender) {
      alert('Please fill in all required fields');
      return;
    }

    let score = 0;

    // Age points
    if (age < 65) score += 0;
    else if (age >= 65 && age < 75) score += 1;
    else score += 2;

    // Gender points
    if (gender === 'female') score += 1;

    // Congestive heart failure points
    if (congestiveHeartFailure) score += 1;

    // Hypertension points
    if (hypertension) score += 1;

    // Stroke/TIA history points
    if (strokeHistory) score += 2;

    // Vascular disease points
    if (vascularDisease) score += 1;

    // Diabetes points
    if (diabetes) score += 1;

    const riskLevel = score === 0 ? 'Low' : score === 1 ? 'Low-moderate' :
                     score <= 3 ? 'Moderate' : score <= 5 ? 'High' : 'Very high';

    setResults(prev => ({
      ...prev,
      stroke: {
        score,
        riskLevel,
        recommendations: score >= 2 ? 'Anticoagulation therapy recommended' :
                        'Consider anticoagulation based on individual factors'
      }
    }));
  };

  const calculateFractureRisk = () => {
    const { age, gender, weight, height, previousFracture, parentFracture, smoking, glucocorticoids, rheumatoidArthritis, secondaryOsteoporosis, alcohol } = fractureData;

    if (!age || !gender || !weight || !height) {
      alert('Please fill in all required fields');
      return;
    }

    // Calculate BMI
    const bmi = weight / ((height / 100) ** 2);

    let score = 0;

    // Age points
    if (age < 50) score += 0;
    else if (age >= 50 && age < 60) score += 1;
    else if (age >= 60 && age < 70) score += 2;
    else if (age >= 70 && age < 80) score += 3;
    else score += 4;

    // BMI points
    if (bmi < 18.5) score += 1;
    else if (bmi >= 18.5 && bmi < 25) score += 0;
    else if (bmi >= 25 && bmi < 30) score += 1;
    else score += 2;

    // Previous fracture points
    if (previousFracture) score += 1;

    // Parent fracture points
    if (parentFracture) score += 1;

    // Smoking points
    if (smoking) score += 1;

    // Glucocorticoids points
    if (glucocorticoids) score += 1;

    // Rheumatoid arthritis points
    if (rheumatoidArthritis) score += 1;

    // Secondary osteoporosis points
    if (secondaryOsteoporosis) score += 1;

    // Alcohol points
    if (alcohol === '3+') score += 1;

    const riskLevel = score < 3 ? 'Low' : score < 6 ? 'Moderate' : 'High';

    setResults(prev => ({
      ...prev,
      fracture: {
        score,
        riskLevel,
        recommendations: score >= 3 ? 'Consider bone mineral density testing and treatment' :
                        'Maintain bone health through diet and exercise'
      }
    }));
  };

  const saveResults = () => {
    const riskAssessment = {
      patientId,
      type: 'Risk Assessment',
      date: new Date().toISOString(),
      calculators: activeCalculator,
      results: results[activeCalculator],
      inputData: activeCalculator === 'cardiovascular' ? cardioData :
                 activeCalculator === 'diabetes' ? diabetesData :
                 activeCalculator === 'stroke' ? strokeData : fractureData,
      notes: `Risk assessment completed using ${activeCalculator} calculator`
    };

    dispatch(addClinicalNote(riskAssessment));
    alert('Risk assessment saved to patient record');
  };

  const calculators = [
    { id: 'cardiovascular', name: 'Cardiovascular Risk', icon: Heart, description: '10-year CVD risk assessment' },
    { id: 'diabetes', name: 'Diabetes Risk', icon: Activity, description: 'Type 2 diabetes risk assessment' },
    { id: 'stroke', name: 'Stroke Risk', icon: AlertTriangle, description: 'Atrial fibrillation stroke risk' },
    { id: 'fracture', name: 'Fracture Risk', icon: Bone, description: 'Osteoporotic fracture risk' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Calculator className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Medical Risk Calculators</h2>
      </div>

      {/* Calculator Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {calculators.map((calc) => (
          <button
            key={calc.id}
            onClick={() => setActiveCalculator(calc.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeCalculator === calc.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <calc.icon className={`w-8 h-8 mb-2 ${
              activeCalculator === calc.id ? 'text-blue-600' : 'text-gray-600'
            }`} />
            <h3 className="font-semibold text-gray-800">{calc.name}</h3>
            <p className="text-sm text-gray-600">{calc.description}</p>
          </button>
        ))}
      </div>

      {/* Calculator Forms */}
      <div className="bg-gray-50 rounded-lg p-6">
        {activeCalculator === 'cardiovascular' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Cardiovascular Risk Assessment (Framingham)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={cardioData.age}
                  onChange={(e) => setCardioData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={cardioData.gender}
                  onChange={(e) => setCardioData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  value={cardioData.totalCholesterol}
                  onChange={(e) => setCardioData(prev => ({ ...prev, totalCholesterol: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">HDL Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  value={cardioData.hdlCholesterol}
                  onChange={(e) => setCardioData(prev => ({ ...prev, hdlCholesterol: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={cardioData.systolicBP}
                  onChange={(e) => setCardioData(prev => ({ ...prev, systolicBP: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={cardioData.diastolicBP}
                  onChange={(e) => setCardioData(prev => ({ ...prev, diastolicBP: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 80"
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={cardioData.smoker}
                  onChange={(e) => setCardioData(prev => ({ ...prev, smoker: e.target.checked }))}
                  className="mr-2"
                />
                Current smoker
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={cardioData.diabetic}
                  onChange={(e) => setCardioData(prev => ({ ...prev, diabetic: e.target.checked }))}
                  className="mr-2"
                />
                Diabetic
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={cardioData.hypertensive}
                  onChange={(e) => setCardioData(prev => ({ ...prev, hypertensive: e.target.checked }))}
                  className="mr-2"
                />
                Hypertensive
              </label>
            </div>
            <div className="mt-6">
              <button
                onClick={calculateCardiovascularRisk}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Calculate Risk
              </button>
            </div>
          </div>
        )}

        {activeCalculator === 'diabetes' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Diabetes Risk Assessment (FINDRISC)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={diabetesData.age}
                  onChange={(e) => setDiabetesData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">BMI</label>
                <input
                  type="number"
                  step="0.1"
                  value={diabetesData.bmi}
                  onChange={(e) => setDiabetesData(prev => ({ ...prev, bmi: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 25.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Waist Circumference (cm)</label>
                <input
                  type="number"
                  value={diabetesData.waistCircumference}
                  onChange={(e) => setDiabetesData(prev => ({ ...prev, waistCircumference: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 85"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Physical Activity</label>
                <select
                  value={diabetesData.physicalActivity}
                  onChange={(e) => setDiabetesData(prev => ({ ...prev, physicalActivity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select activity level</option>
                  <option value="active">Active (30+ min/day)</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={diabetesData.dailyVegetables}
                  onChange={(e) => setDiabetesData(prev => ({ ...prev, dailyVegetables: e.target.checked }))}
                  className="mr-2"
                />
                Eat vegetables/fruits daily
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={diabetesData.bloodPressureMeds}
                  onChange={(e) => setDiabetesData(prev => ({ ...prev, bloodPressureMeds: e.target.checked }))}
                  className="mr-2"
                />
                Taking blood pressure medication
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={diabetesData.highBloodGlucose}
                  onChange={(e) => setDiabetesData(prev => ({ ...prev, highBloodGlucose: e.target.checked }))}
                  className="mr-2"
                />
                Previously high blood glucose
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={diabetesData.familyHistoryDiabetes}
                  onChange={(e) => setDiabetesData(prev => ({ ...prev, familyHistoryDiabetes: e.target.checked }))}
                  className="mr-2"
                />
                Family history of diabetes
              </label>
            </div>
            <div className="mt-6">
              <button
                onClick={calculateDiabetesRisk}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Calculate Risk
              </button>
            </div>
          </div>
        )}

        {activeCalculator === 'stroke' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Stroke Risk Assessment (CHA₂DS₂-VASc)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={strokeData.age}
                  onChange={(e) => setStrokeData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={strokeData.gender}
                  onChange={(e) => setStrokeData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={strokeData.congestiveHeartFailure}
                  onChange={(e) => setStrokeData(prev => ({ ...prev, congestiveHeartFailure: e.target.checked }))}
                  className="mr-2"
                />
                Congestive heart failure
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={strokeData.hypertension}
                  onChange={(e) => setStrokeData(prev => ({ ...prev, hypertension: e.target.checked }))}
                  className="mr-2"
                />
                Hypertension
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={strokeData.strokeHistory}
                  onChange={(e) => setStrokeData(prev => ({ ...prev, strokeHistory: e.target.checked }))}
                  className="mr-2"
                />
                Stroke/TIA history
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={strokeData.vascularDisease}
                  onChange={(e) => setStrokeData(prev => ({ ...prev, vascularDisease: e.target.checked }))}
                  className="mr-2"
                />
                Vascular disease
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={strokeData.diabetes}
                  onChange={(e) => setStrokeData(prev => ({ ...prev, diabetes: e.target.checked }))}
                  className="mr-2"
                />
                Diabetes
              </label>
            </div>
            <div className="mt-6">
              <button
                onClick={calculateStrokeRisk}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Calculate Risk
              </button>
            </div>
          </div>
        )}

        {activeCalculator === 'fracture' && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Fracture Risk Assessment (FRAX)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={fractureData.age}
                  onChange={(e) => setFractureData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={fractureData.gender}
                  onChange={(e) => setFractureData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fractureData.weight}
                  onChange={(e) => setFractureData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 70"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fractureData.height}
                  onChange={(e) => setFractureData(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 170"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol Consumption</label>
                <select
                  value={fractureData.alcohol}
                  onChange={(e) => setFractureData(prev => ({ ...prev, alcohol: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select consumption</option>
                  <option value="0">None</option>
                  <option value="1-2">1-2 units/day</option>
                  <option value="3+">3+ units/day</option>
                </select>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={fractureData.previousFracture}
                  onChange={(e) => setFractureData(prev => ({ ...prev, previousFracture: e.target.checked }))}
                  className="mr-2"
                />
                Previous fracture
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={fractureData.parentFracture}
                  onChange={(e) => setFractureData(prev => ({ ...prev, parentFracture: e.target.checked }))}
                  className="mr-2"
                />
                Parent fractured hip
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={fractureData.smoking}
                  onChange={(e) => setFractureData(prev => ({ ...prev, smoking: e.target.checked }))}
                  className="mr-2"
                />
                Current smoker
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={fractureData.glucocorticoids}
                  onChange={(e) => setFractureData(prev => ({ ...prev, glucocorticoids: e.target.checked }))}
                  className="mr-2"
                />
                Glucocorticoids use
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={fractureData.rheumatoidArthritis}
                  onChange={(e) => setFractureData(prev => ({ ...prev, rheumatoidArthritis: e.target.checked }))}
                  className="mr-2"
                />
                Rheumatoid arthritis
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={fractureData.secondaryOsteoporosis}
                  onChange={(e) => setFractureData(prev => ({ ...prev, secondaryOsteoporosis: e.target.checked }))}
                  className="mr-2"
                />
                Secondary osteoporosis
              </label>
            </div>
            <div className="mt-6">
              <button
                onClick={calculateFractureRisk}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Calculate Risk
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Display */}
      {results[activeCalculator] && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Risk Assessment Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800">Risk Score: {results[activeCalculator].score}</h4>
              <p className="text-gray-600">Risk Level: <span className={`font-semibold ${
                results[activeCalculator].riskLevel === 'Low' ? 'text-green-600' :
                results[activeCalculator].riskLevel === 'Moderate' || results[activeCalculator].riskLevel === 'Intermediate' ? 'text-yellow-600' :
                'text-red-600'
              }`}>{results[activeCalculator].riskLevel}</span></p>
              {results[activeCalculator].riskPercentage && (
                <p className="text-gray-600">10-year Risk: {results[activeCalculator].riskPercentage}%</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Recommendations</h4>
              <p className="text-gray-600">{results[activeCalculator].recommendations}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={saveResults}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Save to Patient Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskCalculators;