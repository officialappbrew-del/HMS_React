import { createSlice } from '@reduxjs/toolkit';

const rosterSlice = createSlice({
  name: 'roster',
  initialState: {
    dutyRosters: [],
    leaves: [],
    overtime: [],
    leaveTypes: {
      ANNUAL: 'Annual Leave',
      SICK: 'Sick Leave',
      MATERNITY: 'Maternity Leave',
      PATERNITY: 'Paternity Leave',
      STUDY: 'Study Leave',
      COMPASSIONATE: 'Compassionate Leave',
      CONFERENCE: 'Conference Leave'
    },
    dutyTypes: {
      CALL_DUTY: 'Call Duty',
      NIGHT_DUTY: 'Night Duty',
      WEEKEND: 'Weekend Duty',
      EMERGENCY: 'Emergency Cover',
      CLINIC: 'Clinic Duty'
    },
    leaveBalances: []
  },

  reducers: {
    addDutyRoster: (state, action) => {
      const payload = action.payload;
      const key = payload.rosterId || payload.id;
      if (!state.dutyRosters.some(r => (r.rosterId || r.id) === key)) {
        state.dutyRosters.push(payload);
      }
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
      const payload = action.payload;
      const key = payload.leaveId || payload.id;
      if (!state.leaves.some(l => (l.leaveId || l.id) === key)) {
        state.leaves.push(payload);
      }
    },

    approveLeave: (state, action) => {
      const leaveId = action.payload?.leaveId || action.payload;
      const leave = state.leaves.find(l => l.leaveId === leaveId || l.id === leaveId);
      if (leave) {
        leave.status = 'Approved';
        leave.approvedBy = action.payload?.approvedBy || 'System';
        leave.approvalDate = new Date().toISOString().split('T')[0];
      }
    },

    rejectLeave: (state, action) => {
      const leaveId = action.payload?.leaveId || action.payload;
      const leave = state.leaves.find(l => l.leaveId === leaveId || l.id === leaveId);
      if (leave) {
        leave.status = 'Rejected';
        leave.approvedBy = action.payload?.approvedBy || 'System';
        leave.approvalDate = new Date().toISOString().split('T')[0];
      }
    },

    addOvertimeRecord: (state, action) => {
      const payload = action.payload;
      const key = payload.overtimeId || payload.id;
      if (!state.overtime.some(o => (o.overtimeId || o.id) === key)) {
        state.overtime.push(payload);
      }
    },

    approveOvertime: (state, action) => {
      const overtimeId = action.payload?.overtimeId || action.payload;
      const ot = state.overtime.find(o => o.overtimeId === overtimeId || o.id === overtimeId);
      if (ot) {
        ot.status = 'Approved';
        ot.approvedBy = action.payload?.approvedBy || 'System';
        ot.approvalDate = new Date().toISOString().split('T')[0];
      }
    },

    rejectOvertime: (state, action) => {
      const overtimeId = action.payload?.overtimeId || action.payload;
      const ot = state.overtime.find(o => o.overtimeId === overtimeId || o.id === overtimeId);
      if (ot) {
        ot.status = 'Rejected';
        ot.approvedBy = action.payload?.approvedBy || 'System';
        ot.approvalDate = new Date().toISOString().split('T')[0];
      }
    },

    removeDutyRoster: (state, action) => {
      const rosterId = action.payload?.rosterId || action.payload;
      state.dutyRosters = state.dutyRosters.filter(r => (r.rosterId || r.id) !== rosterId);
    },

    removeLeaveRequest: (state, action) => {
      const leaveId = action.payload?.leaveId || action.payload;
      state.leaves = state.leaves.filter(l => (l.leaveId || l.id) !== leaveId);
    },

    removeOvertimeRecord: (state, action) => {
      const overtimeId = action.payload?.overtimeId || action.payload;
      state.overtime = state.overtime.filter(o => (o.overtimeId || o.id) !== overtimeId);
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
  approveOvertime,
  rejectOvertime,
  removeDutyRoster,
  removeLeaveRequest,
  removeOvertimeRecord
} = rosterSlice.actions;

export default rosterSlice.reducer;
