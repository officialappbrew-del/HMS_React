import { createSlice } from '@reduxjs/toolkit';

const ROUND_TYPE = {
  DAILY: 'Daily Ward Round',
  TEACHING: 'Teaching Round',
  GRAND: 'Grand Round',
  DISCHARGE: 'Discharge Round'
};

const ROUND_STATUS = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

const initialState = {
  wardRounds: [
    {
      roundId: 'WR001',
      wardId: 'W001',
      wardName: 'Male General Ward',
      date: new Date(Date.now() + 86400000).toISOString(),
      time: '09:00',
      type: ROUND_TYPE.DAILY,
      status: ROUND_STATUS.SCHEDULED,
      consultant: 'Dr. Okafor Ifeanyi',
      consultantSpecialty: 'Internal Medicine',
      teamMembers: [
        { name: 'Dr. Nneka Uzozie', role: 'Senior Registrar', specialty: 'Internal Medicine' },
        { name: 'Nurse Chioma Okafor', role: 'Ward Supervisor', specialty: 'Nursing' },
        { name: 'Mr. Tunde Adeleke', role: 'Medical Student', specialty: 'Medicine' }
      ],
      patientsList: ['PAT00001', 'PAT00002', 'PAT00005'],
      notes: 'Focus on diabetic patients, review medications',
      expectedDuration: 120
    },
    {
      roundId: 'WR002',
      wardId: 'W002',
      wardName: 'Female General Ward',
      date: new Date(Date.now() + 86400000).toISOString(),
      time: '10:30',
      type: ROUND_TYPE.DAILY,
      status: ROUND_STATUS.SCHEDULED,
      consultant: 'Dr. Arinola Bamisaye',
      consultantSpecialty: 'Cardiology',
      teamMembers: [
        { name: 'Dr. Emeka Ejiofor', role: 'Registrar', specialty: 'Cardiology' },
        { name: 'Nurse Amara Nwankwo', role: 'Ward Supervisor', specialty: 'Nursing' }
      ],
      patientsList: ['PAT00102', 'PAT00103'],
      notes: 'Monitor blood pressure trends, assess diuretic efficacy',
      expectedDuration: 90
    },
    {
      roundId: 'WR003',
      wardId: 'W005',
      wardName: 'Maternity Ward',
      date: new Date(Date.now() - 3600000).toISOString(),
      time: '14:00',
      type: ROUND_TYPE.DAILY,
      status: ROUND_STATUS.COMPLETED,
      consultant: 'Midwife Bukola Adeoye',
      consultantSpecialty: 'Obstetrics & Gynecology',
      teamMembers: [
        { name: 'Nurse Folake Akintola', role: 'Senior Midwife', specialty: 'Midwifery' },
        { name: 'Dr. Samuel Okonkwo', role: 'Obstetrician', specialty: 'Obstetrics' }
      ],
      patientsList: ['PAT00401', 'PAT00402'],
      notes: 'Post-natal follow-up completed, all patients stable',
      expectedDuration: 60,
      actualDuration: 65,
      completedTime: new Date(Date.now() - 600000).toISOString()
    },
    {
      roundId: 'WR004',
      wardId: 'W001',
      wardName: 'Male General Ward',
      date: new Date(Date.now() + 172800000).toISOString(),
      time: '09:00',
      type: ROUND_TYPE.TEACHING,
      status: ROUND_STATUS.SCHEDULED,
      consultant: 'Prof. Obi Okafor',
      consultantSpecialty: 'Internal Medicine',
      teamMembers: [
        { name: 'Dr. Nneka Uzozie', role: 'Senior Registrar', specialty: 'Internal Medicine' },
        { name: 'Dr. Chioma Ikechi', role: 'Registrar', specialty: 'Internal Medicine' },
        { name: 'Mr. Tunde Adeleke', role: 'Medical Student', specialty: 'Medicine' },
        { name: 'Miss Zainab Hassan', role: 'Medical Student', specialty: 'Medicine' }
      ],
      patientsList: ['PAT00001', 'PAT00003', 'PAT00005', 'PAT00008'],
      notes: 'Teaching round - focus on clinical examination and diagnosis',
      expectedDuration: 180
    },
    {
      roundId: 'WR005',
      wardId: 'W004',
      wardName: 'ICU/HDU',
      date: new Date().toISOString(),
      time: '07:00',
      type: ROUND_TYPE.DAILY,
      status: ROUND_STATUS.IN_PROGRESS,
      consultant: 'Dr. Folake Adelekan',
      consultantSpecialty: 'Intensive Care Medicine',
      teamMembers: [
        { name: 'Dr. Bolanle Ajeyemi', role: 'ICU Registrar', specialty: 'Critical Care' },
        { name: 'Nurse Abimbola Osidele', role: 'ICU Nurse', specialty: 'Critical Care Nursing' },
        { name: 'ICU Tech Obinna Nwankwo', role: 'Technician', specialty: 'ICU Technology' }
      ],
      patientsList: ['PAT00301', 'PAT00302', 'PAT00303'],
      notes: 'Ongoing management of critical patients, review ventilation settings',
      expectedDuration: 120,
      startTime: new Date().toISOString()
    }
  ],
  handoverNotes: [
    {
      handoverId: 'HO001',
      wardId: 'W001',
      wardName: 'Male General Ward',
      date: new Date(Date.now() - 86400000).toISOString(),
      shiftFrom: 'Morning',
      shiftTo: 'Afternoon',
      handoverOfficer: 'Nurse Chioma Okafor',
      receivingOfficer: 'Nurse Ojo Adebayo',
      criticallySevere: ['PAT00001'],
      recentAdmissions: ['PAT00005'],
      pendingProcedures: ['PAT00002 - Blood transfusion'],
      pendingDischarges: [],
      notes: 'All critical patients stable. Watch PAT00001 for signs of deterioration.'
    },
    {
      handoverId: 'HO002',
      wardId: 'W002',
      wardName: 'Female General Ward',
      date: new Date(Date.now() - 86400000).toISOString(),
      shiftFrom: 'Afternoon',
      shiftTo: 'Night',
      handoverOfficer: 'Nurse Amara Nwankwo',
      receivingOfficer: 'Nurse Ngozi Obi',
      criticallySevere: [],
      recentAdmissions: ['PAT00103'],
      pendingProcedures: [],
      pendingDischarges: ['PAT00102 - Expected discharge tomorrow morning'],
      notes: 'New admission PAT00103 still settling. Observed hypertension - closely monitor.'
    }
  ],
  grandRounds: [
    {
      grandRoundId: 'GR001',
      date: new Date(Date.now() + 604800000).toISOString(),
      time: '15:00',
      status: ROUND_STATUS.SCHEDULED,
      topic: 'Management of Severe Sepsis in Teaching Hospital Setting',
      presenter: 'Prof. Obi Okafor',
      location: 'Main Conference Hall',
      targetAudience: 'All Consultants, Registrars, Senior Doctors',
      caseStudies: [
        { patientId: 'PAT00010', diagnosis: 'Septic Shock', outcome: 'Recovery' },
        { patientId: 'PAT00011', diagnosis: 'Severe Sepsis', outcome: 'Discharge' }
      ],
      expectedAttendees: 45,
      notes: 'Interactive case discussion, guidelines review'
    }
  ],
  roundTypes: ROUND_TYPE,
  roundStatuses: ROUND_STATUS
};

const wardRoundSlice = createSlice({
  name: 'wardRound',
  initialState,
  reducers: {
    scheduleWardRound: (state, action) => {
      const newRound = {
        roundId: `WR${String(state.wardRounds.length + 1).padStart(3, '0')}`,
        status: ROUND_STATUS.SCHEDULED,
        ...action.payload
      };
      state.wardRounds.push(newRound);
    },
    startWardRound: (state, action) => {
      const round = state.wardRounds.find(r => r.roundId === action.payload);
      if (round) {
        round.status = ROUND_STATUS.IN_PROGRESS;
        round.startTime = new Date().toISOString();
      }
    },
    completeWardRound: (state, action) => {
      const { roundId, notes, actualDuration } = action.payload;
      const round = state.wardRounds.find(r => r.roundId === roundId);
      if (round) {
        round.status = ROUND_STATUS.COMPLETED;
        round.completedTime = new Date().toISOString();
        if (notes) round.notes = notes;
        if (actualDuration) round.actualDuration = actualDuration;
      }
    },
    cancelWardRound: (state, action) => {
      const { roundId, reason } = action.payload;
      const round = state.wardRounds.find(r => r.roundId === roundId);
      if (round) {
        round.status = ROUND_STATUS.CANCELLED;
        round.cancellationReason = reason;
      }
    },
    addPatientToRound: (state, action) => {
      const { roundId, patientId } = action.payload;
      const round = state.wardRounds.find(r => r.roundId === roundId);
      if (round && !round.patientsList.includes(patientId)) {
        round.patientsList.push(patientId);
      }
    },
    removePatientFromRound: (state, action) => {
      const { roundId, patientId } = action.payload;
      const round = state.wardRounds.find(r => r.roundId === roundId);
      if (round) {
        round.patientsList = round.patientsList.filter(id => id !== patientId);
      }
    },
    addTeamMemberToRound: (state, action) => {
      const { roundId, member } = action.payload;
      const round = state.wardRounds.find(r => r.roundId === roundId);
      if (round) {
        if (!round.teamMembers.some(m => m.name === member.name)) {
          round.teamMembers.push(member);
        }
      }
    },
    createHandoverNote: (state, action) => {
      const newNote = {
        handoverId: `HO${String(state.handoverNotes.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString(),
        ...action.payload
      };
      state.handoverNotes.push(newNote);
    },
    updateHandoverNote: (state, action) => {
      const note = state.handoverNotes.find(n => n.handoverId === action.payload.handoverId);
      if (note) {
        Object.assign(note, action.payload);
      }
    },
    scheduleGrandRound: (state, action) => {
      const newGrandRound = {
        grandRoundId: `GR${String(state.grandRounds.length + 1).padStart(3, '0')}`,
        status: ROUND_STATUS.SCHEDULED,
        ...action.payload
      };
      state.grandRounds.push(newGrandRound);
    },
    addCaseStudyToGrandRound: (state, action) => {
      const { grandRoundId, caseStudy } = action.payload;
      const grandRound = state.grandRounds.find(g => g.grandRoundId === grandRoundId);
      if (grandRound) {
        grandRound.caseStudies.push(caseStudy);
      }
    },
    recordRoundDocumentation: (state, action) => {
      const { roundId, patientId, documentation } = action.payload;
      const round = state.wardRounds.find(r => r.roundId === roundId);
      if (round) {
        if (!round.roundDocumentation) {
          round.roundDocumentation = {};
        }
        round.roundDocumentation[patientId] = documentation;
      }
    }
  }
});

export const {
  scheduleWardRound,
  startWardRound,
  completeWardRound,
  cancelWardRound,
  addPatientToRound,
  removePatientFromRound,
  addTeamMemberToRound,
  createHandoverNote,
  updateHandoverNote,
  scheduleGrandRound,
  addCaseStudyToGrandRound,
  recordRoundDocumentation
} = wardRoundSlice.actions;

export default wardRoundSlice.reducer;
