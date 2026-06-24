import { createSlice } from '@reduxjs/toolkit';

const defaultPatient = {
  patientId: '132920',
  mrn: 'MRN-2026-0112',
  name: 'RASHEEDAT SANNI-IDRIS',
  gender: 'Female',
  age: '48 yrs',
  dateOfBirth: '08/02/1978',
  phone: '+234 803 456 7890',
  email: 'rasheedat.s@email.com',
  address: '12, Adeola Street, Lagos',
  bloodGroup: 'O+',
  genotype: 'AA',
  allergies: ['Penicillin'],
  currentMedications: ['Neurovite Forte', 'Prednisolone'],
  insurancePlan: 'NHIS Platinum',
  primaryConsultant: 'Dr. Famba Famba',
  primaryCareProvider: 'Dr. Famba Famba',
  emergencyContact: 'Mr. Sanni Idris • +234 808 123 4567',
  riskFlags: ['Hypertension', 'Previous stroke screening'],
  chronicConditions: ['Hypertension'],
  recentAdmissions: ['Jan 2026 - Short stay observation'],
  outstandingBills: '₦24,500',
  latestVitals: '136/100 mmHg, 36.7°C, 69 BPM, SpO₂ 99%',
  bloodType: 'O+',
  genotypeText: 'AA'
};

const initialState = {
  patient: defaultPatient,
  encounter: {
    encounterNumber: 'ENC-2026-0342',
    date: '19/06/2026',
    time: '11:24 AM',
    doctorName: 'Dr. Famba Famba',
    clinic: 'Family Medicine',
    department: 'General Medicine',
    type: 'Follow-Up',
    status: 'In Progress',
    encounterType: 'Follow-Up',
    location: 'Outpatient Clinic',
    provider: 'Primary Care',
    consultationStatus: 'In Progress'
  },
  hpi: {
    chiefComplaint: 'Mild deviation of the mouth to the right',
    duration: '6 months',
    onset: 'Gradual',
    location: 'Right facial muscles',
    severity: 'Moderate',
    character: 'Intermittent twitching',
    radiation: 'None',
    associatedSymptoms: 'Mild headache, facial numbness',
    aggravatingFactors: 'Stress, fatigue',
    relievingFactors: 'Rest, hydration',
    previousTreatment: 'Physiotherapy, antihypertensives',
    progression: 'Stable with mild fluctuation',
    freeNotes: 'Patient is concerned about recurrence and wants further evaluation.'
  },
  ros: {
    general: { status: 'present', comments: 'Mild fatigue' },
    cardiovascular: { status: 'absent', comments: '' },
    respiratory: { status: 'absent', comments: '' },
    gastrointestinal: { status: 'absent', comments: '' },
    genitourinary: { status: 'unknown', comments: '' },
    neurological: { status: 'present', comments: 'Facial motor weakness' },
    musculoskeletal: { status: 'absent', comments: '' },
    endocrine: { status: 'absent', comments: '' },
    psychiatric: { status: 'absent', comments: '' },
    skin: { status: 'absent', comments: '' },
    ent: { status: 'absent', comments: '' },
    eyes: { status: 'absent', comments: '' }
  },
  pastMedicalHistory: {
    pastIllnesses: ['Hypertension'],
    chronicDiseases: ['Hypertension'],
    pastSurgeries: ['Appendectomy 2015'],
    hospitalAdmissions: ['Jan 2026 - observation', 'Nov 2024 - hypertensive crisis'],
    previousDiagnoses: ['Essential hypertension', 'Tension headache'],
    vaccinations: ['COVID-19', 'Influenza 2025'],
    familyHistory: 'Mother with diabetes, father with hypertension.',
    socialHistory: 'Lives with husband, no tobacco, occasional alcohol.',
    smoking: 'Never',
    alcohol: 'Occasional',
    drugUse: 'None',
    occupation: 'Teacher',
    lifestyle: 'Moderately active, balanced diet',
    travelHistory: 'No recent travel'
  },
  medications: [
    {
      id: 1,
      name: 'Neurovite Forte',
      current: true,
      previous: false,
      stopped: false,
      dosage: '1 tablet morning, 1 afternoon, 1 night',
      frequency: 'TDS',
      startDate: '01/06/2026',
      endDate: '',
      reason: 'Vitamin support',
      route: 'Oral',
      maxDose: '3 tablets/day'
    },
    {
      id: 2,
      name: 'Prednisolone 5 mg',
      current: true,
      previous: false,
      stopped: false,
      dosage: '10 mg morning',
      frequency: 'Once daily',
      startDate: '10/06/2026',
      endDate: '17/06/2026',
      reason: 'Inflammation control',
      route: 'Oral',
      maxDose: '60 mg/day'
    }
  ],
  allergies: [
    {
      id: 1,
      type: 'Drug',
      substance: 'Penicillin',
      severity: 'Severe',
      reactionType: 'Anaphylaxis',
      notes: 'Avoid all penicillin and cephalosporins if possible.'
    }
  ],
  physicalExam: {
    generalAppearance: 'Alert and oriented',
    vitalSigns: 'BP 136/100, HR 69, Temp 36.7°C, RR 16, SpO₂ 99%',
    cardiovascular: 'Normal S1/S2, no murmurs',
    respiratory: 'Clear breath sounds bilaterally',
    abdominal: 'Soft, non-tender',
    neurological: 'Right facial weakness, sensation intact',
    musculoskeletal: 'Full range of motion',
    ent: 'Normal',
    eye: 'Pupils equal and reactive',
    skin: 'No rashes',
    mentalState: 'Cooperative, oriented'
  },
  assessment: {
    problemList: ['Hypertension', 'Right facial weakness'],
    clinicalImpression: 'Likely Bell palsy with hypertensive background',
    differentialDiagnosis: 'Stroke, Ramsay Hunt syndrome, Lyme disease',
    primaryDiagnosis: 'Bell palsy',
    secondaryDiagnosis: 'Essential hypertension',
    workingDiagnosis: 'Bell palsy under evaluation',
    finalDiagnosis: '',
    clinicalReasoning: 'Facial asymmetry without other focal deficits suggests peripheral facial nerve involvement.'
  },
  icd10: {
    searchTerm: '',
    selectedCodes: [
      { code: 'G51.0', description: 'Bell palsy' }
    ],
    favorites: [
      { code: 'I10', description: 'Essential (primary) hypertension' },
      { code: 'R51', description: 'Headache' }
    ],
    recentDiagnoses: [
      { code: 'I10', description: 'Essential hypertension' }
    ]
  },
  orders: {
    laboratory: [
      { id: 1, test: 'Complete Blood Count', status: 'pending', priority: 'normal' },
      { id: 2, test: 'Lipid Profile', status: 'pending', priority: 'urgent' }
    ],
    radiology: [],
    procedures: [],
    medicationOrders: [],
    referralOrders: [],
    nursingOrders: []
  },
  labResults: [],
  radiologyResults: [],
  prescriptions: [
    {
      id: 1,
      medication: 'Neurovite Forte',
      dose: '1 tablet',
      frequency: 'TDS',
      duration: '14 days',
      quantity: '28',
      refills: 2,
      route: 'Oral',
      instructions: 'With food',
      status: 'active'
    }
  ],
  procedures: [],
  referrals: [],
  treatmentPlan: {
    managementPlan: 'Continue antihypertensive therapy, monitor blood pressure daily.',
    medications: 'Neurovite Forte, Prednisolone',
    lifestyleAdvice: 'Low salt diet, regular exercise, stress reduction.',
    dietaryAdvice: 'Balanced diet with fruits, vegetables, and lean protein.',
    patientEducation: 'Educate on medication adherence and warning signs of stroke.',
    procedurePlan: 'Review if symptoms worsen or new neurological signs appear.',
    monitoringPlan: 'Follow-up in 2 weeks; repeat BP and facial nerve exam.',
    safetyNetAdvice: 'Return if sudden weakness, slurred speech, or chest pain.'
  },
  disposition: {
    type: 'Outpatient',
    reason: 'Stable for outpatient management',
    admission: 'No',
    observation: 'No',
    transfer: '',
    referral: '',
    followUpNeeded: true
  },
  followUp: {
    date: '03/07/2026',
    time: '09:30 AM',
    clinic: 'Family Medicine',
    doctor: 'Dr. Famba Famba',
    reason: 'Review facial nerve recovery',
    appointmentGenerated: true,
    reminderCreated: true
  },
  certificates: {
    sickLeave: '',
    fitToWork: '',
    medicalReport: '',
    referralLetter: '',
    dischargeSummary: ''
  },
  signature: {
    doctorName: 'Dr. Famba Famba',
    licenseNumber: 'LIC-20458',
    signed: false,
    signedAt: '',
    ipAddress: '',
    digitalSignature: ''
  },
  auditTrail: [],
  billing: {
    charges: [
      { id: 1, item: 'Consultation', amount: 5000 },
      { id: 2, item: 'Lab tests', amount: 12000 }
    ],
    total: 17000,
    generated: true
  },
  clinicalAlerts: []
};

const consultationSlice = createSlice({
  name: 'consultation',
  initialState,
  reducers: {
    loadConsultation(state, action) {
      return { ...state, ...action.payload };
    },
    resetConsultation(state) {
      return initialState;
    },
    updatePatientField(state, action) {
      state.patient[action.payload.field] = action.payload.value;
    },
    updateEncounterField(state, action) {
      state.encounter[action.payload.field] = action.payload.value;
    },
    updateVitals(state, action) {
      state.encounter = { ...state.encounter, ...action.payload };
    },
    updateHPIField(state, action) {
      state.hpi[action.payload.field] = action.payload.value;
    },
    updateROSField(state, action) {
      const { section, field, value } = action.payload;
      state.ros[section][field] = value;
    },
    updatePastMedicalField(state, action) {
      state.pastMedicalHistory[action.payload.field] = action.payload.value;
    },
    addMedication(state, action) {
      state.medications.push({ id: Date.now(), ...action.payload });
    },
    updateMedication(state, action) {
      const index = state.medications.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.medications[index] = {
          ...state.medications[index],
          ...action.payload.updates
        };
      }
    },
    removeMedication(state, action) {
      state.medications = state.medications.filter(m => m.id !== action.payload);
    },
    addAllergy(state, action) {
      state.allergies.push({ id: Date.now(), ...action.payload });
    },
    updateAllergy(state, action) {
      const index = state.allergies.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.allergies[index] = { ...state.allergies[index], ...action.payload.updates };
      }
    },
    removeAllergy(state, action) {
      state.allergies = state.allergies.filter(a => a.id !== action.payload);
    },
    updatePhysicalExamField(state, action) {
      state.physicalExam[action.payload.field] = action.payload.value;
    },
    updateAssessmentField(state, action) {
      state.assessment[action.payload.field] = action.payload.value;
    },
    addICD10Code(state, action) {
      if (!state.icd10.selectedCodes.some(code => code.code === action.payload.code)) {
        state.icd10.selectedCodes.push(action.payload);
      }
    },
    removeICD10Code(state, action) {
      state.icd10.selectedCodes = state.icd10.selectedCodes.filter(code => code.code !== action.payload);
    },
    updateICD10SearchTerm(state, action) {
      state.icd10.searchTerm = action.payload;
    },
    addLabOrder(state, action) {
      state.orders.laboratory.push({ id: Date.now(), ...action.payload });
    },
    addRadiologyOrder(state, action) {
      state.orders.radiology.push({ id: Date.now(), ...action.payload });
    },
    addProcedure(state, action) {
      state.orders.procedures.push({ id: Date.now(), ...action.payload });
    },
    addReferral(state, action) {
      state.orders.referralOrders.push({ id: Date.now(), ...action.payload });
    },
    updateTreatmentPlan(state, action) {
      state.treatmentPlan[action.payload.field] = action.payload.value;
    },
    updateDisposition(state, action) {
      state.disposition[action.payload.field] = action.payload.value;
    },
    updateFollowUp(state, action) {
      state.followUp[action.payload.field] = action.payload.value;
    },
    signConsultation(state, action) {
      state.signature.signed = true;
      state.signature.doctorName = action.payload.doctorName || state.signature.doctorName;
      state.signature.licenseNumber = action.payload.licenseNumber || state.signature.licenseNumber;
      state.signature.signedAt = new Date().toISOString();
      state.signature.ipAddress = action.payload.ipAddress || state.signature.ipAddress;
      state.signature.digitalSignature = action.payload.digitalSignature || state.signature.digitalSignature;
      state.encounter.consultationStatus = 'Signed Off';
      state.auditTrail.push({
        id: Date.now(),
        action: 'Signed consultation',
        user: state.signature.doctorName,
        timestamp: new Date().toISOString(),
        ipAddress: state.signature.ipAddress
      });
    },
    addAuditLog(state, action) {
      state.auditTrail.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload
      });
    },
    addClinicalAlert(state, action) {
      state.clinicalAlerts.push({ id: Date.now(), ...action.payload });
    },
    clearClinicalAlerts(state) {
      state.clinicalAlerts = [];
    },
    generateBillingCharge(state, action) {
      state.billing.charges.push({ id: Date.now(), ...action.payload });
      state.billing.total = state.billing.charges.reduce((sum, charge) => sum + Number(charge.amount || 0), 0);
      state.billing.generated = true;
    }
  }
});

export const {
  loadConsultation,
  resetConsultation,
  updatePatientField,
  updateEncounterField,
  updateVitals,
  updateHPIField,
  updateROSField,
  updatePastMedicalField,
  addMedication,
  updateMedication,
  removeMedication,
  addAllergy,
  updateAllergy,
  removeAllergy,
  updatePhysicalExamField,
  updateAssessmentField,
  addICD10Code,
  removeICD10Code,
  updateICD10SearchTerm,
  addLabOrder,
  addRadiologyOrder,
  addProcedure,
  addReferral,
  updateTreatmentPlan,
  updateDisposition,
  updateFollowUp,
  signConsultation,
  addAuditLog,
  addClinicalAlert,
  clearClinicalAlerts,
  generateBillingCharge
} = consultationSlice.actions;

export const selectConsultation = (state) => state.consultation;

export default consultationSlice.reducer;
