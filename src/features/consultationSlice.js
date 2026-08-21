import { createSlice } from '@reduxjs/toolkit';

const defaultPatient = {
  patientId: '',
  mrn: '',
  name: '',
  gender: '',
  age: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  address: '',
  bloodGroup: '',
  genotype: '',
  allergies: [],
  currentMedications: [],
  insurancePlan: '',
  primaryConsultant: '',
  primaryCareProvider: '',
  emergencyContact: '',
  riskFlags: [],
  chronicConditions: [],
  recentAdmissions: [],
  outstandingBills: '',
  latestVitals: '',
  bloodType: '',
  genotypeText: ''
};

const initialState = {
  patient: defaultPatient,
  encounter: {
    encounterNumber: '',
    date: '',
    time: '',
    doctorName: '',
    clinic: '',
    department: '',
    type: '',
    status: '',
    encounterType: '',
    location: '',
    provider: '',
    consultationStatus: ''
  },
  hpi: {
    chiefComplaint: '',
    duration: '',
    timing: '',
    onset: '',
    location: '',
    severity: '',
    character: '',
    radiation: '',
    associatedSymptoms: '',
    aggravatingFactors: '',
    relievingFactors: '',
    previousTreatment: '',
    progression: '',
    freeNotes: ''
  },
  ice: {
    ideas: '',
    concerns: '',
    expectations: ''
  },
  ros: {
    general: { status: '', comments: '' },
    cardiovascular: { status: '', comments: '' },
    respiratory: { status: '', comments: '' },
    gastrointestinal: { status: '', comments: '' },
    genitourinary: { status: '', comments: '' },
    neurological: { status: '', comments: '' },
    musculoskeletal: { status: '', comments: '' },
    endocrine: { status: '', comments: '' },
    psychiatric: { status: '', comments: '' },
    skin: { status: '', comments: '' },
    ent: { status: '', comments: '' },
    eyes: { status: '', comments: '' }
  },
  pastMedicalHistory: {
    conditions: '',
    surgeries: '',
    hospitalizations: '',
    otherHistory: '',
    pastIllnesses: [],
    chronicDiseases: [],
    pastSurgeries: [],
    hospitalAdmissions: [],
    previousDiagnoses: [],
    vaccinations: []
  },
  familyHistory: {
    mother: { alive: false, age: '', conditions: '', causeOfDeath: '' },
    father: { alive: false, age: '', conditions: '', causeOfDeath: '' },
    siblings: [],
    relevantConditions: []
  },
  medications: [],
  allergies: [],
  socialHistory: {
    occupation: '',
    livingSituation: '',
    maritalStatus: '',
    children: '',
    independence: '',
    smoking: {
      status: '',
      startDate: '',
      packYears: '',
      quitDate: ''
    },
    alcohol: {
      status: '',
      unitsPerWeek: '',
      duration: ''
    },
    recreationalDrugs: {
      status: '',
      substances: '',
      frequency: ''
    }
  },
  redFlags: {
    detected: [],
    actionRequired: false,
    recommendedActions: []
  },
  physicalExam: {
    generalAppearance: '',
    vitalSigns: '',
    cardiovascular: '',
    respiratory: '',
    abdominal: '',
    neurological: '',
    musculoskeletal: '',
    ent: '',
    eye: '',
    skin: '',
    mentalState: ''
  },
  assessment: {
    problemList: [],
    clinicalImpression: '',
    differentialDiagnosis: '',
    primaryDiagnosis: '',
    secondaryDiagnosis: '',
    workingDiagnosis: '',
    finalDiagnosis: '',
    clinicalReasoning: ''
  },
  icd10: {
    searchTerm: '',
    selectedCodes: [],
    favorites: [],
    recentDiagnoses: []
  },
  orders: {
    laboratory: [],
    radiology: [],
    procedures: [],
    medicationOrders: [],
    referralOrders: [],
    nursingOrders: []
  },
  labResults: [],
  radiologyResults: [],
  prescriptions: [],
  procedures: [],
  referrals: [],
  treatmentPlan: {
    managementPlan: '',
    medications: '',
    lifestyleAdvice: '',
    dietaryAdvice: '',
    patientEducation: '',
    procedurePlan: '',
    monitoringPlan: '',
    safetyNetAdvice: ''
  },
  disposition: {
    type: '',
    reason: '',
    admission: '',
    observation: '',
    transfer: '',
    referral: '',
    followUpNeeded: false
  },
  followUp: {
    date: '',
    time: '',
    clinic: '',
    doctor: '',
    reason: '',
    appointmentGenerated: false,
    reminderCreated: false
  },
  certificates: {
    sickLeave: '',
    fitToWork: '',
    medicalReport: '',
    referralLetter: '',
    dischargeSummary: ''
  },
  signature: {
    doctorName: '',
    licenseNumber: '',
    signed: false,
    signedAt: '',
    ipAddress: '',
    digitalSignature: ''
  },
  auditTrail: [],
  billing: {
    charges: [],
    total: 0,
    generated: false,
    insuranceCovered: false,
    insuranceAmount: 0
  },
  clinicalAlerts: [],
  completionStatus: {
    hpi: false,
    ice: false,
    ros: false,
    pmh: false,
    familyHistory: false,
    drugHistory: false,
    socialHistory: false,
    assessment: false,
    plan: false
  }
};

// Helper function to detect red flags
const detectRedFlags = (state) => {
  const detected = [];
  const recommendedActions = [];
  let actionRequired = false;

  // Check HPI
  const hpiText = Object.values(state.hpi || {}).join(' ').toLowerCase();
  const rosText = Object.values(state.ros || {}).map(s => s.comments || '').join(' ').toLowerCase();

  const redFlagPatterns = [
    { pattern: /night sweat|night sweats|drenched in sweat/, flag: 'Night Sweats', action: 'Consider malignancy or infection workup' },
    { pattern: /weight loss|lost weight|unexplained weight loss/, flag: 'Unexplained Weight Loss', action: 'Consider malignancy, chronic disease, or metabolic disorder' },
    { pattern: /fever|high temperature|pyrexia/, flag: 'Fever', action: 'Consider infection or inflammatory process' },
    { pattern: /blood in stool|blood in urine|haemoptysis|vomiting blood/, flag: 'Bleeding', action: 'Urgent investigation for source of bleeding' },
    { pattern: /chest pain|tightness|pressure in chest/, flag: 'Chest Pain', action: 'Consider cardiac or pulmonary embolism' },
    { pattern: /headache.*vomit|vomiting.*headache/, flag: 'Headache + Vomiting', action: 'Consider raised ICP or intracranial bleed' },
    { pattern: /shortness of breath|breathlessness|difficulty breathing/, flag: 'Respiratory Distress', action: 'Consider pulmonary embolism, pneumonia, or heart failure' },
    { pattern: /swollen glands|lymph node/, flag: 'Swollen Glands', action: 'Consider infection or malignancy' },
    { pattern: /rash|skin lesion/, flag: 'Rash', action: 'Consider allergic reaction, infection, or autoimmune condition' },
    { pattern: /confusion|disorientation|altered mental state/, flag: 'Altered Mental State', action: 'Consider neurological or metabolic emergency' }
  ];

  redFlagPatterns.forEach(({ pattern, flag, action }) => {
    if (pattern.test(hpiText) || pattern.test(rosText)) {
      detected.push(flag);
      recommendedActions.push(action);
      actionRequired = true;
    }
  });

  return { detected, actionRequired, recommendedActions };
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
    
    // ===== HPI =====
    updateHPIField(state, action) {
      state.hpi[action.payload.field] = action.payload.value;
      // Auto-detect red flags
      state.redFlags = detectRedFlags(state);
    },
    
    // ===== ICE (NEW) =====
    updateICEField(state, action) {
      state.ice[action.payload.field] = action.payload.value;
      if (state.ice.ideas || state.ice.concerns || state.ice.expectations) {
        state.completionStatus.ice = true;
      }
    },
    
    // ===== ROS =====
    updateROSField(state, action) {
      const { section, field, value } = action.payload;
      state.ros[section][field] = value;
      state.redFlags = detectRedFlags(state);
    },
    
    // ===== Past Medical History =====
    updatePastMedicalField(state, action) {
      state.pastMedicalHistory[action.payload.field] = action.payload.value;
    },
    // NEW: For PISP-FDS compatibility
    updatePastMedicalHistory(state, action) {
      const { field, value } = action.payload;
      state.pastMedicalHistory[field] = value;
      if (state.pastMedicalHistory.conditions || state.pastMedicalHistory.surgeries) {
        state.completionStatus.pmh = true;
      }
    },
    
    // ===== Family History (NEW) =====
    updateFamilyHistory(state, action) {
      const { section, field, value } = action.payload;
      if (state.familyHistory[section]) {
        state.familyHistory[section][field] = value;
      }
      if (state.familyHistory.mother.conditions || state.familyHistory.father.conditions) {
        state.completionStatus.familyHistory = true;
      }
    },
    addFamilySibling(state, action) {
      state.familyHistory.siblings.push({
        id: Date.now().toString(),
        name: action.payload.name || '',
        conditions: action.payload.conditions || ''
      });
    },
    updateFamilySibling(state, action) {
      const { id, field, value } = action.payload;
      const sibling = state.familyHistory.siblings.find(s => s.id === id);
      if (sibling) sibling[field] = value;
    },
    removeFamilySibling(state, action) {
      state.familyHistory.siblings = state.familyHistory.siblings.filter(s => s.id !== action.payload);
    },
    addRelevantCondition(state, action) {
      state.familyHistory.relevantConditions.push(action.payload);
    },
    removeRelevantCondition(state, action) {
      state.familyHistory.relevantConditions = state.familyHistory.relevantConditions.filter(c => c !== action.payload);
    },
    
    // ===== Social History (NEW) =====
    updateSocialHistory(state, action) {
      const { field, value } = action.payload;
      state.socialHistory[field] = value;
      if (state.socialHistory.occupation || state.socialHistory.livingSituation) {
        state.completionStatus.socialHistory = true;
      }
    },
    updateSocialHistorySubsection(state, action) {
      const { section, field, value } = action.payload;
      if (state.socialHistory[section]) {
        state.socialHistory[section][field] = value;
      }
    },
    
    // ===== Medications =====
    addMedication(state, action) {
      state.medications.push({ id: Date.now(), ...action.payload });
      state.completionStatus.drugHistory = true;
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
      if (state.medications.length === 0 && state.allergies.length === 0) {
        state.completionStatus.drugHistory = false;
      }
    },
    
    // ===== Allergies =====
    addAllergy(state, action) {
      state.allergies.push({ id: Date.now(), ...action.payload });
      state.completionStatus.drugHistory = true;
    },
    updateAllergy(state, action) {
      const index = state.allergies.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.allergies[index] = { ...state.allergies[index], ...action.payload.updates };
      }
    },
    removeAllergy(state, action) {
      state.allergies = state.allergies.filter(a => a.id !== action.payload);
      if (state.medications.length === 0 && state.allergies.length === 0) {
        state.completionStatus.drugHistory = false;
      }
    },
    
    // ===== Physical Exam =====
    updatePhysicalExamField(state, action) {
      state.physicalExam[action.payload.field] = action.payload.value;
    },
    updatePhysicalExam(state, action) {
      const { field, value } = action.payload;
      state.physicalExam[field] = value;
    },
    
    // ===== Assessment =====
    updateAssessmentField(state, action) {
      state.assessment[action.payload.field] = action.payload.value;
    },
    updateAssessment(state, action) {
      const { field, value } = action.payload;
      state.assessment[field] = value;
      if (state.assessment.clinicalImpression || state.assessment.primaryDiagnosis) {
        state.completionStatus.assessment = true;
      }
    },
    
    // ===== ICD-10 =====
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
    
    // ===== Orders =====
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
    removeOrder(state, action) {
      const { type, id } = action.payload;
      if (state.orders[type]) {
        state.orders[type] = state.orders[type].filter(o => o.id !== id);
      }
    },
    
    // ===== Treatment Plan =====
    updateTreatmentPlan(state, action) {
      state.treatmentPlan[action.payload.field] = action.payload.value;
      if (state.treatmentPlan.managementPlan) {
        state.completionStatus.plan = true;
      }
    },
    
    // ===== Disposition =====
    updateDisposition(state, action) {
      state.disposition[action.payload.field] = action.payload.value;
    },
    
    // ===== Follow-up =====
    updateFollowUp(state, action) {
      state.followUp[action.payload.field] = action.payload.value;
    },
    
    // ===== Signature =====
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
    
    // ===== Audit =====
    addAuditLog(state, action) {
      state.auditTrail.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload
      });
    },
    
    // ===== Clinical Alerts =====
    addClinicalAlert(state, action) {
      state.clinicalAlerts.push({ id: Date.now(), ...action.payload });
    },
    clearClinicalAlerts(state) {
      state.clinicalAlerts = [];
    },
    
    // ===== Billing =====
    generateBillingCharge(state, action) {
      state.billing.charges.push({ id: Date.now(), ...action.payload });
      state.billing.total = state.billing.charges.reduce((sum, charge) => sum + Number(charge.amount || 0), 0);
      state.billing.generated = true;
    },
    removeBillingCharge(state, action) {
      state.billing.charges = state.billing.charges.filter(c => c.id !== action.payload);
      state.billing.total = state.billing.charges.reduce((sum, charge) => sum + Number(charge.amount || 0), 0);
    },
    
    // ===== Completion Status (NEW) =====
    updateCompletionStatus(state, action) {
      state.completionStatus = {
        ...state.completionStatus,
        ...action.payload
      };
    },
    
    // ===== Red Flags (NEW) =====
    updateRedFlags(state, action) {
      state.redFlags = { ...state.redFlags, ...action.payload };
    },
    detectRedFlagsManually(state) {
      state.redFlags = detectRedFlags(state);
    }
  }
});

// ===== SELECTORS =====
export const selectConsultation = (state) => state.consultation;
export const selectHPI = (state) => state.consultation.hpi;
export const selectICE = (state) => state.consultation.ice;
export const selectROS = (state) => state.consultation.ros;
export const selectMedications = (state) => state.consultation.medications;
export const selectAllergies = (state) => state.consultation.allergies;
export const selectICD10 = (state) => state.consultation.icd10;
export const selectRedFlags = (state) => state.consultation.redFlags;
export const selectCompletionStatus = (state) => state.consultation.completionStatus;
export const selectSocialHistory = (state) => state.consultation.socialHistory;
export const selectFamilyHistory = (state) => state.consultation.familyHistory;

// ===== EXPORTS =====
export const {
  loadConsultation,
  resetConsultation,
  updatePatientField,
  updateEncounterField,
  updateVitals,
  updateHPIField,
  updateICEField,
  updateROSField,
  updatePastMedicalField,
  updatePastMedicalHistory,
  updateFamilyHistory,
  addFamilySibling,
  updateFamilySibling,
  removeFamilySibling,
  addRelevantCondition,
  removeRelevantCondition,
  updateSocialHistory,
  updateSocialHistorySubsection,
  addMedication,
  updateMedication,
  removeMedication,
  addAllergy,
  updateAllergy,
  removeAllergy,
  updatePhysicalExamField,
  updatePhysicalExam,
  updateAssessmentField,
  updateAssessment,
  addICD10Code,
  removeICD10Code,
  updateICD10SearchTerm,
  addLabOrder,
  addRadiologyOrder,
  addProcedure,
  addReferral,
  removeOrder,
  updateTreatmentPlan,
  updateDisposition,
  updateFollowUp,
  signConsultation,
  addAuditLog,
  addClinicalAlert,
  clearClinicalAlerts,
  generateBillingCharge,
  removeBillingCharge,
  updateCompletionStatus,
  updateRedFlags,
  detectRedFlagsManually
} = consultationSlice.actions;

export default consultationSlice.reducer;