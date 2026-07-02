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
      state.overtime.push(action.payload);
    },

    approveOvertime: (state, action) => {
      const overtimeId = action.payload?.overtimeId || action.payload;
      const ot = state.overtime.find(o => o.overtimeId === overtimeId || o.id === overtimeId);
      if (ot) {
        ot.status = 'Approved';
        ot.approvedBy = action.payload?.approvedBy || 'System';
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
