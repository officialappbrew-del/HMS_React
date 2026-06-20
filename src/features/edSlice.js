import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  patients: [],
  triageQueue: [],
  treatmentBays: [],
  waitingRoom: [],
  dischargeLounge: [],
  stats: {
    totalPatients: 0,
    waitingPatients: 0,
    inTreatment: 0,
    averageWaitTime: 0,
    averageTreatmentTime: 0
  },
  triageScales: {
    red: { name: 'Emergency', description: 'Immediate life-threatening', time: '< 2 minutes' },
    orange: { name: 'Very Urgent', description: 'Potentially life-threatening', time: '< 10 minutes' },
    yellow: { name: 'Urgent', description: 'Serious but stable', time: '< 60 minutes' },
    green: { name: 'Standard', description: 'Minor conditions', time: '< 120 minutes' },
    blue: { name: 'Non-urgent', description: 'Stable chronic conditions', time: '< 240 minutes' }
  },
  traumaProtocols: {
    atls: {
      name: 'Advanced Trauma Life Support',
      steps: ['Airway', 'Breathing', 'Circulation', 'Disability', 'Exposure'],
      checklist: []
    },
    cardiac_arrest: {
      name: 'Cardiac Arrest Protocol',
      steps: ['CPR', 'Defibrillation', 'Airway Management', 'IV Access', 'Medications'],
      drugs: ['Adrenaline', 'Amiodarone', 'Atropine']
    },
    stroke: {
      name: 'Stroke Protocol',
      steps: ['NIHSS Assessment', 'CT Brain', 'Thrombolysis Check', 'Blood Pressure Control'],
      timeWindows: { thrombolysis: 4.5, thrombectomy: 6 }
    }
  },
  searchTerm: '',
  sortBy: 'arrival_time',
  filterBy: 'all',
  loading: false,
  error: null,
};

const edSlice = createSlice({
  name: 'ed',
  initialState,
  reducers: {
    registerPatient: (state, action) => {
      const patient = {
        id: Date.now().toString(),
        ...action.payload,
        arrivalTime: new Date().toISOString(),
        status: 'waiting_triage',
        triageScore: null,
        triageColor: null,
        assignedBay: null,
        physician: null,
        nurse: null,
        investigations: [],
        treatments: [],
        disposition: null
      };
      state.patients.push(patient);
      state.waitingRoom.push(patient);
      state.stats.totalPatients++;
      state.stats.waitingPatients++;
    },

    performTriage: (state, action) => {
      const { patientId, triageData } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);

      if (patient) {
        patient.triageScore = triageData.score;
        patient.triageColor = triageData.color;
        patient.triageTime = new Date().toISOString();
        patient.status = 'triaged';

        // Move from waiting room to triage queue
        state.waitingRoom = state.waitingRoom.filter(p => p.id !== patientId);
        state.triageQueue.push(patient);

        // Sort triage queue by priority
        state.triageQueue.sort((a, b) => {
          const colorPriority = { red: 5, orange: 4, yellow: 3, green: 2, blue: 1 };
          return colorPriority[b.triageColor] - colorPriority[a.triageColor];
        });
      }
    },

    assignToBay: (state, action) => {
      const { patientId, bayId, physicianId, nurseId } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);
      const bay = state.treatmentBays.find(b => b.id === bayId);

      if (patient && bay && !bay.occupied) {
        patient.status = 'in_treatment';
        patient.assignedBay = bayId;
        patient.physician = physicianId;
        patient.nurse = nurseId;
        patient.treatmentStartTime = new Date().toISOString();

        bay.occupied = true;
        bay.patientId = patientId;

        // Remove from triage queue
        state.triageQueue = state.triageQueue.filter(p => p.id !== patientId);

        state.stats.waitingPatients--;
        state.stats.inTreatment++;
      }
    },

    updatePatientStatus: (state, action) => {
      const { patientId, status, notes } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);

      if (patient) {
        patient.status = status;
        patient.lastUpdated = new Date().toISOString();

        if (notes) patient.notes = notes;

        // Handle status-specific logic
        if (status === 'discharged') {
          patient.dischargeTime = new Date().toISOString();
          patient.disposition = 'discharged';

          // Free up bay
          const bay = state.treatmentBays.find(b => b.patientId === patientId);
          if (bay) {
            bay.occupied = false;
            bay.patientId = null;
          }

          state.dischargeLounge.push(patient);
          state.stats.inTreatment--;
        } else if (status === 'admitted') {
          patient.admissionTime = new Date().toISOString();
          patient.disposition = 'admitted';

          // Free up bay
          const bay = state.treatmentBays.find(b => b.patientId === patientId);
          if (bay) {
            bay.occupied = false;
            bay.patientId = null;
          }

          state.stats.inTreatment--;
        }
      }
    },

    addInvestigation: (state, action) => {
      const { patientId, investigation } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);

      if (patient) {
        patient.investigations.push({
          id: Date.now().toString(),
          ...investigation,
          orderedAt: new Date().toISOString(),
          status: 'ordered'
        });
      }
    },

    addTreatment: (state, action) => {
      const { patientId, treatment } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);

      if (patient) {
        patient.treatments.push({
          id: Date.now().toString(),
          ...treatment,
          administeredAt: new Date().toISOString()
        });
      }
    },

    activateTraumaProtocol: (state, action) => {
      const { patientId, protocolType } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);
      const protocol = state.traumaProtocols[protocolType];

      if (patient && protocol) {
        patient.activeProtocol = {
          type: protocolType,
          activatedAt: new Date().toISOString(),
          steps: protocol.steps.map(step => ({ name: step, completed: false, timestamp: null })),
          checklist: protocol.checklist || []
        };
      }
    },

    updateProtocolStep: (state, action) => {
      const { patientId, stepIndex, completed } = action.payload;
      const patient = state.patients.find(p => p.id === patientId);

      if (patient && patient.activeProtocol && patient.activeProtocol.steps[stepIndex]) {
        patient.activeProtocol.steps[stepIndex].completed = completed;
        patient.activeProtocol.steps[stepIndex].timestamp = completed ? new Date().toISOString() : null;
      }
    },

    calculateWaitTimes: (state) => {
      const now = new Date();

      // Calculate average wait time
      const triagedPatients = state.patients.filter(p => p.triageTime);
      if (triagedPatients.length > 0) {
        const totalWaitTime = triagedPatients.reduce((sum, patient) => {
          const triageTime = new Date(patient.triageTime);
          const treatmentStart = patient.treatmentStartTime ? new Date(patient.treatmentStartTime) : now;
          return sum + (treatmentStart - triageTime);
        }, 0);
        state.stats.averageWaitTime = totalWaitTime / triagedPatients.length / (1000 * 60); // minutes
      }

      // Calculate average treatment time
      const completedPatients = state.patients.filter(p => p.treatmentStartTime && p.dischargeTime);
      if (completedPatients.length > 0) {
        const totalTreatmentTime = completedPatients.reduce((sum, patient) => {
          const start = new Date(patient.treatmentStartTime);
          const end = new Date(patient.dischargeTime);
          return sum + (end - start);
        }, 0);
        state.stats.averageTreatmentTime = totalTreatmentTime / completedPatients.length / (1000 * 60); // minutes
      }
    },

    searchED: (state, action) => {
      state.searchTerm = action.payload;
    },

    sortED: (state, action) => {
      state.sortBy = action.payload;
    },

    filterED: (state, action) => {
      state.filterBy = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  registerPatient,
  performTriage,
  assignToBay,
  updatePatientStatus,
  addInvestigation,
  addTreatment,
  activateTraumaProtocol,
  updateProtocolStep,
  calculateWaitTimes,
  searchED,
  sortED,
  filterED,
  setLoading,
  setError,
} = edSlice.actions;

export default edSlice.reducer;