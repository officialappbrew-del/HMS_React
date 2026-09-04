import { createSlice } from '@reduxjs/toolkit';

const emergencyResponseSlice = createSlice({
  name: 'emergencyResponse',
  initialState: {
    emergencyCalls: [],
    dispatchOptimizations: [],
    hospitalPreNotifications: [],
    communications: [],
    loading: false,
    error: null,
  },
  reducers: {
    setEmergencyCalls: (state, action) => {
      state.emergencyCalls = action.payload;
    },
    reportIncident: (state, action) => {
      const call = action.payload;
      const callId = call.callId || call.id;
      const existing = state.emergencyCalls.find((item) => item.callId === callId);
      if (existing) Object.assign(existing, call);
      else state.emergencyCalls.push({ ...call, callId });
    },
    updateIncident: (state, action) => {
      const index = state.emergencyCalls.findIndex((item) => item.callId === action.payload.incidentId);
      if (index !== -1) state.emergencyCalls[index] = { ...state.emergencyCalls[index], ...action.payload };
    },
    dispatchResponse: (state, action) => {
      const index = state.emergencyCalls.findIndex((item) => item.callId === action.payload.incidentId);
      if (index !== -1) state.emergencyCalls[index] = { ...state.emergencyCalls[index], ...action.payload, status: 'Dispatched' };
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  },
});

export const { setEmergencyCalls, reportIncident, updateIncident, dispatchResponse, setLoading, setError } = emergencyResponseSlice.actions;
export default emergencyResponseSlice.reducer;
