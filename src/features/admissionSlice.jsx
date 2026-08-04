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
  admissions: [],
  admissionRequests: [],
  dischargeSummaries: [],
  wardTransfers: [],
  admissionStatuses: ADMISSION_STATUS,
  admissionSources: ADMISSION_SOURCE
};

const admissionSlice = createSlice({
  name: 'admission',
  initialState,
  reducers: {
    syncAdmissions: (state, action) => {
      const { admissions = [], admissionRequests = [], dischargeSummaries = [], wardTransfers = [] } = action.payload || {};
      state.admissions = admissions;
      state.admissionRequests = admissionRequests;
      state.dischargeSummaries = dischargeSummaries;
      state.wardTransfers = wardTransfers;
    },
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
  syncAdmissions,
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
