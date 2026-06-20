import { createSlice } from '@reduxjs/toolkit';

const rosterSlice = createSlice({
  name: 'roster',
  initialState: {
    // Duty rosters
    dutyRosters: [
      {
        rosterId: 'ROSTER001',
        month: 'January 2026',
        year: 2026,
        department: 'Internal Medicine',
        status: 'Published',
        createdDate: '2025-12-01',
        assignments: [
          {
            assignmentId: 'ASSIGN001',
            staffId: 'DR001',
            staffName: 'Dr. Adekunle Ifeanyi',
            date: '2026-01-05',
            dutyType: 'Call Duty',
            startTime: '20:00',
            endTime: '08:00',
            notes: 'Emergency Department Cover'
          },
          {
            assignmentId: 'ASSIGN002',
            staffId: 'NUR001',
            staffName: 'Nurse Chioma Okafor',
            date: '2026-01-08',
            dutyType: 'Night Duty',
            startTime: '21:00',
            endTime: '07:00',
            notes: 'General Ward'
          }
        ]
      }
    ],

    // Leave management
    leaves: [
      {
        leaveId: 'LEAVE001',
        staffId: 'DR001',
        staffName: 'Dr. Adekunle Ifeanyi',
        leaveType: 'Annual Leave',
        startDate: '2026-02-15',
        endDate: '2026-02-22',
        numberOfDays: 8,
        reason: 'Personal',
        status: 'Approved',
        appliedDate: '2026-01-10',
        approvedBy: 'Dr. Okafor Ifeanyi',
        approvalDate: '2026-01-12'
      },
      {
        leaveId: 'LEAVE002',
        staffId: 'NUR001',
        staffName: 'Nurse Chioma Okafor',
        leaveType: 'Sick Leave',
        startDate: '2026-01-25',
        endDate: '2026-01-26',
        numberOfDays: 2,
        reason: 'Medical grounds',
        status: 'Pending',
        appliedDate: '2026-01-24',
        approvedBy: null,
        approvalDate: null
      }
    ],

    // Overtime records
    overtime: [
      {
        overtimeId: 'OT001',
        staffId: 'DR001',
        staffName: 'Dr. Adekunle Ifeanyi',
        date: '2026-01-15',
        hoursWorked: 4,
        reason: 'Emergency Cases',
        status: 'Approved',
        approvedBy: 'Chief Medical Director',
        rate: '1.5x'
      },
      {
        overtimeId: 'OT002',
        staffId: 'NUR001',
        staffName: 'Nurse Chioma Okafor',
        date: '2026-01-18',
        hoursWorked: 6,
        reason: 'Intensive Care Unit Coverage',
        status: 'Approved',
        approvedBy: 'Nursing Officer',
        rate: '1.5x'
      }
    ],

    // Leave types
    leaveTypes: {
      ANNUAL: 'Annual Leave',
      SICK: 'Sick Leave',
      MATERNITY: 'Maternity Leave',
      PATERNITY: 'Paternity Leave',
      STUDY: 'Study Leave',
      COMPASSIONATE: 'Compassionate Leave',
      CONFERENCE: 'Conference Leave'
    },

    // Duty types
    dutyTypes: {
      CALL_DUTY: 'Call Duty',
      NIGHT_DUTY: 'Night Duty',
      WEEKEND: 'Weekend Duty',
      EMERGENCY: 'Emergency Cover',
      CLINIC: 'Clinic Duty'
    },

    // Leave balances
    leaveBalances: [
      {
        staffId: 'DR001',
        staffName: 'Dr. Adekunle Ifeanyi',
        leaveType: 'Annual Leave',
        totalDays: 21,
        usedDays: 8,
        remainingDays: 13,
        year: 2026
      },
      {
        staffId: 'NUR001',
        staffName: 'Nurse Chioma Okafor',
        leaveType: 'Annual Leave',
        totalDays: 21,
        usedDays: 0,
        remainingDays: 21,
        year: 2026
      }
    ]
  },

  reducers: {
    addDutyRoster: (state, action) => {
      state.dutyRosters.push(action.payload);
    },

    updateDutyRoster: (state, action) => {
      const index = state.dutyRosters.findIndex(r => r.rosterId === action.payload.rosterId);
      if (index !== -1) {
        state.dutyRosters[index] = { ...state.dutyRosters[index], ...action.payload };
      }
    },

    addDutyAssignment: (state, action) => {
      const roster = state.dutyRosters.find(r => r.rosterId === action.payload.rosterId);
      if (roster) {
        roster.assignments.push(action.payload.assignment);
      }
    },

    addLeaveRequest: (state, action) => {
      state.leaves.push(action.payload);
    },

    approveLeave: (state, action) => {
      const leave = state.leaves.find(l => l.leaveId === action.payload.leaveId);
      if (leave) {
        leave.status = 'Approved';
        leave.approvedBy = action.payload.approvedBy;
        leave.approvalDate = new Date().toISOString().split('T')[0];
      }
    },

    rejectLeave: (state, action) => {
      const leave = state.leaves.find(l => l.leaveId === action.payload.leaveId);
      if (leave) {
        leave.status = 'Rejected';
        leave.approvedBy = action.payload.approvedBy;
        leave.approvalDate = new Date().toISOString().split('T')[0];
      }
    },

    addOvertimeRecord: (state, action) => {
      state.overtime.push(action.payload);
    },

    approveOvertime: (state, action) => {
      const ot = state.overtime.find(o => o.overtimeId === action.payload.overtimeId);
      if (ot) {
        ot.status = 'Approved';
        ot.approvedBy = action.payload.approvedBy;
      }
    }
  }
});

export const {
  addDutyRoster,
  updateDutyRoster,
  addDutyAssignment,
  addLeaveRequest,
  approveLeave,
  rejectLeave,
  addOvertimeRecord,
  approveOvertime
} = rosterSlice.actions;

export default rosterSlice.reducer;
