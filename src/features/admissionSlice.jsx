import { createSlice } from '@reduxjs/toolkit';

const ADMISSION_STATUS = {
  REQUESTED: 'Requested',
  APPROVED: 'Approved',
  ADMITTED: 'Admitted',
  DISCHARGED: 'Discharged',
  TRANSFERRED: 'Transferred',
  REJECTED: 'Rejected'
};

const ADMISSION_SOURCE = {
  EMERGENCY: 'Emergency Department',
  OPD: 'Out-Patient Department',
  REFERRAL: 'Referral',
  DIRECT: 'Direct Admission'
};

const initialState = {
  admissions: [
    {
      admissionId: 'ADM001',
      patientId: 'PAT00001',
      patientName: 'Kolade Adeyemi',
      dateOfAdmission: new Date(Date.now() - 172800000).toISOString(),
      admissionSource: ADMISSION_SOURCE.EMERGENCY,
      diagnosis: 'Severe Dehydration',
      status: ADMISSION_STATUS.ADMITTED,
      bedId: 'W001-B001',
      wardId: 'W001',
      consultantName: 'Dr. Okafor Ifeanyi',
      consultantSpecialty: 'Internal Medicine',
      notes: 'Patient admitted with severe dehydration, IV therapy initiated',
      expectedStay: 5,
      plannedDischargeDate: new Date(Date.now() + 432000000).toISOString(),
      documents: ['Admission Form', 'Medical History', 'Consent Form'],
      vitalSigns: {
        bp: '120/80',
        temperature: '37.2°C',
        pulse: '78 bpm',
        respiratoryRate: '18'
      }
    },
    {
      admissionId: 'ADM002',
      patientId: 'PAT00002',
      patientName: 'Adekunle Ogunniyi',
      dateOfAdmission: new Date(Date.now() - 86400000).toISOString(),
      admissionSource: ADMISSION_SOURCE.OPD,
      diagnosis: 'Hypertensive Crisis',
      status: ADMISSION_STATUS.ADMITTED,
      bedId: 'W001-B005',
      wardId: 'W001',
      consultantName: 'Dr. Arinola Bamisaye',
      consultantSpecialty: 'Cardiology',
      notes: 'Blood pressure management protocol initiated',
      expectedStay: 3,
      plannedDischargeDate: new Date(Date.now() + 259200000).toISOString(),
      documents: ['Admission Form', 'ECG', 'Blood Work'],
      vitalSigns: {
        bp: '160/100',
        temperature: '36.8°C',
        pulse: '82 bpm',
        respiratoryRate: '16'
      }
    },
    {
      admissionId: 'ADM003',
      patientId: 'PAT00003',
      patientName: 'Chioma Iwuanyanwu',
      dateOfAdmission: new Date(Date.now() - 3600000).toISOString(),
      admissionSource: ADMISSION_SOURCE.EMERGENCY,
      diagnosis: 'Acute Appendicitis',
      status: ADMISSION_STATUS.ADMITTED,
      bedId: 'W002-B001',
      wardId: 'W002',
      consultantName: 'Dr. Emeka Ejiofor',
      consultantSpecialty: 'General Surgery',
      notes: 'Pre-operative assessment completed, surgery scheduled for tomorrow',
      expectedStay: 4,
      plannedDischargeDate: new Date(Date.now() + 345600000).toISOString(),
      documents: ['Admission Form', 'Ultrasound Report', 'Surgical Consent'],
      vitalSigns: {
        bp: '118/76',
        temperature: '38.5°C',
        pulse: '92 bpm',
        respiratoryRate: '20'
      }
    },
    {
      admissionId: 'ADM004',
      patientId: 'PAT00101',
      patientName: 'Zainab Hassan',
      dateOfAdmission: new Date(Date.now() - 432000000).toISOString(),
      admissionSource: ADMISSION_SOURCE.OPD,
      diagnosis: 'Normal Delivery',
      status: ADMISSION_STATUS.DISCHARGED,
      bedId: 'W005-B001',
      wardId: 'W005',
      consultantName: 'Midwife Bukola Adeoye',
      consultantSpecialty: 'Obstetrics & Gynecology',
      notes: 'Uncomplicated vaginal delivery, mother and baby stable',
      expectedStay: 3,
      actualStay: 3,
      plannedDischargeDate: new Date(Date.now() - 86400000).toISOString(),
      dischargeDate: new Date(Date.now() - 86400000).toISOString(),
      documents: ['Admission Form', 'Delivery Notes', 'Discharge Summary'],
      vitalSigns: {
        bp: '110/70',
        temperature: '36.9°C',
        pulse: '76 bpm',
        respiratoryRate: '18'
      }
    }
  ],
  admissionRequests: [
    {
      requestId: 'REQ001',
      patientId: 'PAT00050',
      patientName: 'Oladele Okafor',
      requestDate: new Date(Date.now() - 1800000).toISOString(),
      source: ADMISSION_SOURCE.EMERGENCY,
      status: ADMISSION_STATUS.REQUESTED,
      diagnosis: 'Pneumonia',
      preferredWardType: 'General Ward - Male',
      requestingDepartment: 'Emergency Department',
      priority: 'High',
      medicalOfficerName: 'Dr. Nneka Uzozie'
    },
    {
      requestId: 'REQ002',
      patientId: 'PAT00051',
      patientName: 'Bola Adelaiye',
      requestDate: new Date(Date.now() - 3600000).toISOString(),
      source: ADMISSION_SOURCE.OPD,
      status: ADMISSION_STATUS.APPROVED,
      diagnosis: 'Diabetes Mellitus Type 2 - Uncontrolled',
      preferredWardType: 'Private/VIP Suite',
      requestingDepartment: 'Endocrinology',
      priority: 'Medium',
      medicalOfficerName: 'Dr. Tunde Owoade'
    }
  ],
  dischargeSummaries: [
    {
      summaryId: 'DS001',
      admissionId: 'ADM004',
      patientName: 'Zainab Hassan',
      dischargeDate: new Date(Date.now() - 86400000).toISOString(),
      lengthOfStay: 3,
      diagnosis: 'Normal Delivery',
      procedures: ['Vaginal Delivery'],
      medications: ['Antibiotics', 'Vitamins'],
      followUpInstructions: 'Return for postnatal checkup in 2 weeks',
      restrictions: 'No heavy lifting for 4 weeks',
      appointments: ['Pediatric - Day 7', 'Obstetrics - Day 14']
    }
  ],
  wardTransfers: [
    {
      transferId: 'TF001',
      patientId: 'PAT00001',
      patientName: 'Kolade Adeyemi',
      fromWard: 'W001',
      fromWardName: 'Male General Ward',
      toWard: 'W004',
      toWardName: 'ICU/HDU',
      fromBedId: 'W001-B001',
      toBedId: 'W004-B001',
      transferDate: new Date(Date.now() - 43200000).toISOString(),
      reason: 'Deteriorating condition requiring ICU monitoring',
      transferredBy: 'Dr. Okafor Ifeanyi',
      status: 'Completed'
    }
  ],
  admissionStatuses: ADMISSION_STATUS,
  admissionSources: ADMISSION_SOURCE
};

const admissionSlice = createSlice({
  name: 'admission',
  initialState,
  reducers: {
    createAdmissionRequest: (state, action) => {
      const newRequest = {
        requestId: `REQ${String(state.admissionRequests.length + 1).padStart(3, '0')}`,
        requestDate: new Date().toISOString(),
        status: ADMISSION_STATUS.REQUESTED,
        ...action.payload
      };
      state.admissionRequests.push(newRequest);
    },
    approveAdmissionRequest: (state, action) => {
      const request = state.admissionRequests.find(r => r.requestId === action.payload);
      if (request) {
        request.status = ADMISSION_STATUS.APPROVED;
      }
    },
    rejectAdmissionRequest: (state, action) => {
      const { requestId, reason } = action.payload;
      const request = state.admissionRequests.find(r => r.requestId === requestId);
      if (request) {
        request.status = ADMISSION_STATUS.REJECTED;
        request.rejectionReason = reason;
      }
    },
    admitPatient: (state, action) => {
      const { requestId, bedId, wardId, consultantName, consultantSpecialty } = action.payload;
      const request = state.admissionRequests.find(r => r.requestId === requestId);
      
      if (request) {
        const admission = {
          admissionId: `ADM${String(state.admissions.length + 1).padStart(3, '0')}`,
          patientId: request.patientId,
          patientName: request.patientName,
          dateOfAdmission: new Date().toISOString(),
          admissionSource: request.source,
          diagnosis: request.diagnosis,
          status: ADMISSION_STATUS.ADMITTED,
          bedId,
          wardId,
          consultantName,
          consultantSpecialty,
          notes: request.notes || '',
          expectedStay: 5,
          plannedDischargeDate: new Date(Date.now() + 432000000).toISOString(),
          documents: ['Admission Form'],
          vitalSigns: request.vitalSigns || {}
        };
        
        state.admissions.push(admission);
        request.status = ADMISSION_STATUS.ADMITTED;
      }
    },
    updateAdmission: (state, action) => {
      const admission = state.admissions.find(a => a.admissionId === action.payload.admissionId);
      if (admission) {
        Object.assign(admission, action.payload);
      }
    },
    transferPatientAdmission: (state, action) => {
      const { admissionId, toWardId, toBedId, reason } = action.payload;
      const admission = state.admissions.find(a => a.admissionId === admissionId);
      
      if (admission) {
        const transfer = {
          transferId: `TF${String(state.wardTransfers.length + 1).padStart(3, '0')}`,
          patientId: admission.patientId,
          patientName: admission.patientName,
          fromWard: admission.wardId,
          fromBedId: admission.bedId,
          toWard: toWardId,
          toBedId: toBedId,
          transferDate: new Date().toISOString(),
          reason,
          status: 'Completed'
        };
        
        state.wardTransfers.push(transfer);
        admission.wardId = toWardId;
        admission.bedId = toBedId;
      }
    },
    dischargePatient: (state, action) => {
      const { admissionId, summary } = action.payload;
      const admission = state.admissions.find(a => a.admissionId === admissionId);
      
      if (admission) {
        admission.status = ADMISSION_STATUS.DISCHARGED;
        admission.dischargeDate = new Date().toISOString();
        admission.actualStay = Math.ceil(
          (new Date(admission.dischargeDate) - new Date(admission.dateOfAdmission)) / 86400000
        );
        
        if (summary) {
          state.dischargeSummaries.push({
            summaryId: `DS${String(state.dischargeSummaries.length + 1).padStart(3, '0')}`,
            admissionId,
            patientName: admission.patientName,
            dischargeDate: admission.dischargeDate,
            ...summary
          });
        }
      }
    },
    addAdmissionDocument: (state, action) => {
      const { admissionId, documentName } = action.payload;
      const admission = state.admissions.find(a => a.admissionId === admissionId);
      if (admission && !admission.documents.includes(documentName)) {
        admission.documents.push(documentName);
      }
    }
  }
});

export const {
  createAdmissionRequest,
  approveAdmissionRequest,
  rejectAdmissionRequest,
  admitPatient,
  updateAdmission,
  transferPatientAdmission,
  dischargePatient,
  addAdmissionDocument
} = admissionSlice.actions;

export default admissionSlice.reducer;
