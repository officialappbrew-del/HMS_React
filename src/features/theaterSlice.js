import { createSlice } from '@reduxjs/toolkit';

const theaterSlice = createSlice({
  name: 'theater',
  initialState: {
    // Operating rooms
    operatingRooms: [
      {
        roomId: 'OR001',
        name: 'Operating Theater 1',
        type: 'Major Surgery',
        capacity: 4,
        status: 'Available',
        equipment: ['Surgical Table', 'Anesthesia Machine', 'Surgical Lights', 'Monitor'],
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-07-15',
        notes: 'Fully equipped for major procedures'
      },
      {
        roomId: 'OR002',
        name: 'Operating Theater 2',
        type: 'General Surgery',
        capacity: 3,
        status: 'In Use',
        equipment: ['Surgical Table', 'Anesthesia Machine', 'Surgical Lights'],
        lastMaintenance: '2024-01-10',
        nextMaintenance: '2024-07-10',
        notes: 'General surgery procedures'
      },
      {
        roomId: 'OR003',
        name: 'Operating Theater 3',
        type: 'Emergency',
        capacity: 2,
        status: 'Available',
        equipment: ['Surgical Table', 'Emergency Cart', 'Defibrillator'],
        lastMaintenance: '2024-01-20',
        nextMaintenance: '2024-07-20',
        notes: 'Emergency procedures only'
      }
    ],

    // Surgical bookings/schedules
    surgicalSchedules: [
      {
        scheduleId: 'SCH001',
        patientId: 'PAT001',
        patientName: 'John Doe',
        procedure: 'Appendectomy',
        surgeon: 'Dr. Adebayo Johnson',
        assistantSurgeon: 'Dr. Fatima Okon',
        anesthetist: 'Dr. Emeka Nwosu',
        roomId: 'OR001',
        date: '2024-01-25',
        startTime: '09:00',
        endTime: '11:00',
        estimatedDuration: 120,
        actualDuration: null,
        priority: 'Elective',
        status: 'Scheduled',
        notes: 'Routine appendectomy'
      },
      {
        scheduleId: 'SCH002',
        patientId: 'PAT002',
        patientName: 'Mary Smith',
        procedure: 'Cesarean Section',
        surgeon: 'Dr. Ngozi Okoye',
        assistantSurgeon: 'Dr. Chioma Okafor',
        anesthetist: 'Dr. Tunde Oluwaseun',
        roomId: 'OR002',
        date: '2024-01-25',
        startTime: '14:00',
        endTime: '16:00',
        estimatedDuration: 90,
        actualDuration: null,
        priority: 'Urgent',
        status: 'In Progress',
        notes: 'Emergency C-section'
      }
    ],

    // Pre-operative assessments
    preOpAssessments: [
      {
        assessmentId: 'PREOP001',
        patientId: 'PAT001',
        patientName: 'John Doe',
        procedure: 'Appendectomy',
        assessmentDate: '2024-01-24',
        assessedBy: 'Dr. Adebayo Johnson',
        vitalSigns: {
          bloodPressure: '120/80',
          heartRate: 72,
          temperature: 36.8,
          respiratoryRate: 16,
          oxygenSaturation: 98
        },
        labResults: {
          hemoglobin: 14.2,
          whiteCellCount: 8.5,
          plateletCount: 250000,
          clottingTime: 'Normal'
        },
        checklistItems: {
          patientIdentity: true,
          procedureSite: true,
          consent: true,
          bloodGrouping: true,
          crossMatching: true,
          npoStatus: true,
          allergies: false,
          medications: true,
          anesthesiaAssessment: true
        },
        status: 'Completed',
        notes: 'Patient fit for surgery'
      }
    ],

    // Intra-operative records
    intraOpRecords: [
      {
        recordId: 'INTRA001',
        scheduleId: 'SCH001',
        patientId: 'PAT001',
        patientName: 'John Doe',
        procedure: 'Appendectomy',
        startTime: '2024-01-25T09:00:00',
        endTime: null,
        surgeon: 'Dr. Adebayo Johnson',
        anesthetist: 'Dr. Emeka Nwosu',
        circulatingNurse: 'Nurse Chioma Okafor',
        scrubNurse: 'Nurse Zainab Hassan',
        safetyChecklist: {
          signIn: {
            patientIdentity: true,
            procedure: true,
            site: true,
            consent: true,
            imaging: false,
            equipment: true
          },
          timeOut: {
            teamIntroduction: true,
            patientIdentity: true,
            procedure: true,
            site: true,
            concerns: false
          },
          signOut: {
            procedure: null,
            specimens: null,
            equipment: null,
            concerns: null
          }
        },
        anesthesiaRecord: {
          type: 'General Anesthesia',
          inductionTime: '09:05',
          maintenance: 'Sevoflurane',
          reversalTime: null,
          complications: null
        },
        specimens: [],
        implants: [],
        bloodProducts: [],
        complications: null,
        status: 'In Progress'
      }
    ],

    // Post-operative care
    postOpCare: [
      {
        careId: 'POSTOP001',
        patientId: 'PAT001',
        patientName: 'John Doe',
        procedure: 'Appendectomy',
        admissionTime: '2024-01-25T11:00:00',
        recoveryRoom: 'RR1',
        vitalSigns: [
          {
            time: '11:00',
            bloodPressure: '110/70',
            heartRate: 80,
            temperature: 36.5,
            respiratoryRate: 18,
            oxygenSaturation: 96,
            painScore: 3
          }
        ],
        painManagement: [
          {
            time: '11:15',
            medication: 'Paracetamol 1g IV',
            dose: '1g',
            route: 'IV',
            response: 'Pain reduced to 2/10'
          }
        ],
        orders: [
          {
            time: '11:00',
            order: 'NPO for 6 hours',
            orderedBy: 'Dr. Adebayo Johnson'
          },
          {
            time: '11:00',
            order: 'IV fluids maintenance',
            orderedBy: 'Dr. Adebayo Johnson'
          }
        ],
        complications: [],
        dischargeCriteria: {
          stableVitals: false,
          adequatePainControl: false,
          mobilized: false,
          oralIntake: false,
          discharged: false
        },
        followUpDate: '2024-02-01',
        status: 'In Recovery'
      }
    ],

    // Theater utilization analytics
    utilizationAnalytics: {
      monthlyStats: [
        { month: '2023-10', totalCases: 145, utilizationRate: 78, avgTurnaround: 45 },
        { month: '2023-11', totalCases: 132, utilizationRate: 82, avgTurnaround: 42 },
        { month: '2023-12', totalCases: 158, utilizationRate: 85, avgTurnaround: 38 },
        { month: '2024-01', totalCases: 142, utilizationRate: 80, avgTurnaround: 40 }
      ],
      roomUtilization: [
        { roomId: 'OR001', utilizationRate: 85, totalCases: 48, downtime: 12 },
        { roomId: 'OR002', utilizationRate: 78, totalCases: 42, downtime: 18 },
        { roomId: 'OR003', utilizationRate: 65, totalCases: 28, downtime: 25 }
      ],
      cancellationReasons: [
        { reason: 'Patient not fit', count: 8 },
        { reason: 'Equipment failure', count: 3 },
        { reason: 'Staff unavailability', count: 5 },
        { reason: 'Emergency case', count: 12 },
        { reason: 'Patient cancelled', count: 6 }
      ],
      costAnalysis: {
        averageCostPerCase: 150000,
        equipmentDowntimeCost: 25000,
        staffingCostPerHour: 15000,
        totalMonthlyCost: 2250000
      }
    },

    // Surgical procedures catalog
    procedures: [
      {
        procedureId: 'PROC001',
        name: 'Appendectomy',
        category: 'General Surgery',
        averageDuration: 90,
        anesthesiaType: 'General',
        estimatedCost: 120000,
        requiredEquipment: ['Surgical Table', 'Laparoscopic Equipment'],
        complications: ['Wound infection', 'Bleeding', 'Ileus']
      },
      {
        procedureId: 'PROC002',
        name: 'Cesarean Section',
        category: 'Obstetrics',
        averageDuration: 60,
        anesthesiaType: 'Spinal',
        estimatedCost: 80000,
        requiredEquipment: ['Surgical Table', 'Fetal Monitor'],
        complications: ['Postpartum hemorrhage', 'Infection', 'Thrombosis']
      },
      {
        procedureId: 'PROC003',
        name: 'Cholecystectomy',
        category: 'General Surgery',
        averageDuration: 120,
        anesthesiaType: 'General',
        estimatedCost: 180000,
        requiredEquipment: ['Surgical Table', 'Laparoscopic Equipment', 'Bipolar Cautery'],
        complications: ['Bile duct injury', 'Bleeding', 'Infection']
      }
    ],

    // Staff availability
    staffAvailability: {
      surgeons: [
        { id: 'SUR001', name: 'Dr. Adebayo Johnson', specialty: 'General Surgery', available: true },
        { id: 'SUR002', name: 'Dr. Ngozi Okoye', specialty: 'Obstetrics', available: false },
        { id: 'SUR003', name: 'Dr. Emeka Nwosu', specialty: 'Orthopedics', available: true }
      ],
      anesthetists: [
        { id: 'ANES001', name: 'Dr. Tunde Oluwaseun', available: true },
        { id: 'ANES002', name: 'Dr. Fatima Okon', available: true }
      ],
      nurses: [
        { id: 'NUR001', name: 'Nurse Chioma Okafor', role: 'Scrub Nurse', available: true },
        { id: 'NUR002', name: 'Nurse Zainab Hassan', role: 'Circulating Nurse', available: true }
      ]
    }
  },

  reducers: {
    addOperatingRoom: (state, action) => {
      state.operatingRooms.push(action.payload);
    },

    updateOperatingRoom: (state, action) => {
      const index = state.operatingRooms.findIndex(room => room.roomId === action.payload.roomId);
      if (index !== -1) {
        state.operatingRooms[index] = { ...state.operatingRooms[index], ...action.payload };
      }
    },

    scheduleSurgery: (state, action) => {
      state.surgicalSchedules.push(action.payload);
    },

    updateSurgicalSchedule: (state, action) => {
      const index = state.surgicalSchedules.findIndex(sch => sch.scheduleId === action.payload.scheduleId);
      if (index !== -1) {
        state.surgicalSchedules[index] = { ...state.surgicalSchedules[index], ...action.payload };
      }
    },

    cancelSurgery: (state, action) => {
      const { scheduleId, reason } = action.payload;
      const schedule = state.surgicalSchedules.find(sch => sch.scheduleId === scheduleId);
      if (schedule) {
        schedule.status = 'Cancelled';
        schedule.cancellationReason = reason;
      }
    },

    addPreOpAssessment: (state, action) => {
      state.preOpAssessments.push(action.payload);
    },

    updatePreOpAssessment: (state, action) => {
      const index = state.preOpAssessments.findIndex(assessment => assessment.assessmentId === action.payload.assessmentId);
      if (index !== -1) {
        state.preOpAssessments[index] = { ...state.preOpAssessments[index], ...action.payload };
      }
    },

    startIntraOpRecord: (state, action) => {
      state.intraOpRecords.push(action.payload);
    },

    updateIntraOpRecord: (state, action) => {
      const index = state.intraOpRecords.findIndex(record => record.recordId === action.payload.recordId);
      if (index !== -1) {
        state.intraOpRecords[index] = { ...state.intraOpRecords[index], ...action.payload };
      }
    },

    completeSurgery: (state, action) => {
      const { recordId, endTime, complications, specimens, implants, bloodProducts } = action.payload;
      const record = state.intraOpRecords.find(r => r.recordId === recordId);
      if (record) {
        record.endTime = endTime;
        record.complications = complications;
        record.specimens = specimens;
        record.implants = implants;
        record.bloodProducts = bloodProducts;
        record.status = 'Completed';

        // Update safety checklist sign-out
        record.safetyChecklist.signOut = {
          procedure: record.procedure,
          specimens: specimens.length,
          equipment: 'All accounted for',
          concerns: complications || 'None'
        };
      }

      // Update schedule
      const schedule = state.surgicalSchedules.find(s => s.scheduleId === record.scheduleId);
      if (schedule) {
        schedule.status = 'Completed';
        schedule.actualDuration = Math.floor((new Date(endTime) - new Date(record.startTime)) / (1000 * 60));
      }
    },

    addPostOpCare: (state, action) => {
      state.postOpCare.push(action.payload);
    },

    updatePostOpCare: (state, action) => {
      const index = state.postOpCare.findIndex(care => care.careId === action.payload.careId);
      if (index !== -1) {
        state.postOpCare[index] = { ...state.postOpCare[index], ...action.payload };
      }
    },

    addVitalSigns: (state, action) => {
      const { careId, vitalSigns } = action.payload;
      const care = state.postOpCare.find(c => c.careId === careId);
      if (care) {
        care.vitalSigns.push(vitalSigns);
      }
    },

    addPainManagement: (state, action) => {
      const { careId, painManagement } = action.payload;
      const care = state.postOpCare.find(c => c.careId === careId);
      if (care) {
        care.painManagement.push(painManagement);
      }
    },

    dischargePatient: (state, action) => {
      const { careId, dischargeTime } = action.payload;
      const care = state.postOpCare.find(c => c.careId === careId);
      if (care) {
        care.status = 'Discharged';
        care.dischargeTime = dischargeTime;
        care.dischargeCriteria.discharged = true;
      }
    }
  }
});

export const {
  addOperatingRoom,
  updateOperatingRoom,
  scheduleSurgery,
  updateSurgicalSchedule,
  cancelSurgery,
  addPreOpAssessment,
  updatePreOpAssessment,
  startIntraOpRecord,
  updateIntraOpRecord,
  completeSurgery,
  addPostOpCare,
  updatePostOpCare,
  addVitalSigns,
  addPainManagement,
  dischargePatient
} = theaterSlice.actions;

export default theaterSlice.reducer;