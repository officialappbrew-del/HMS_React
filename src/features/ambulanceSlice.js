import { createSlice } from '@reduxjs/toolkit';

const ambulanceSlice = createSlice({
  name: 'ambulance',
  initialState: {
    ambulances: [],
    activeMissions: [],
    missionHistory: [],
    gpsTracking: [],
    utilizationAnalytics: { monthlyStats: [], responseTime: 0, utilizationRate: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    setFleetData: (state, action) => Object.assign(state, action.payload),
    updateAmbulance: (state, action) => {
      const index = state.ambulances.findIndex((item) => item.ambulanceId === action.payload.ambulanceId);
      if (index !== -1) state.ambulances[index] = { ...state.ambulances[index], ...action.payload };
    },
    updateAmbulanceLocation: (state, action) => {
      const item = state.ambulances.find((ambulance) => ambulance.ambulanceId === action.payload.ambulanceId);
      if (item) Object.assign(item, { location: action.payload.location });
    },
    dispatchAmbulance: (state, action) => {
      const item = state.ambulances.find((ambulance) => ambulance.ambulanceId === action.payload.ambulanceId);
      if (item) item.status = action.payload.missionData?.status || 'En Route';
      if (action.payload.missionData) state.activeMissions.unshift(action.payload.missionData);
    },
    updateMissionStatus: (state, action) => {
      const item = state.activeMissions.find((mission) => mission.missionId === action.payload.missionId);
      if (item) Object.assign(item, action.payload);
    },
    completeMission: (state, action) => {
      const index = state.activeMissions.findIndex((mission) => mission.missionId === action.payload.missionId);
      if (index !== -1) {
        state.missionHistory.unshift({ ...state.activeMissions[index], ...action.payload, status: 'Completed' });
        state.activeMissions.splice(index, 1);
      }
    },
    updateMission: (state, action) => {
      const index = state.activeMissions.findIndex((item) => item.missionId === action.payload.missionId);
      if (index !== -1) state.activeMissions[index] = { ...state.activeMissions[index], ...action.payload };
    },
    moveMissionToHistory: (state, action) => {
      const index = state.activeMissions.findIndex((item) => item.missionId === action.payload.missionId);
      if (index !== -1) state.missionHistory.unshift({ ...state.activeMissions[index], ...action.payload });
      if (index !== -1) state.activeMissions.splice(index, 1);
    },
  },
});

export const { setFleetData, updateAmbulance, updateAmbulanceLocation, dispatchAmbulance, updateMissionStatus, completeMission, updateMission, moveMissionToHistory } = ambulanceSlice.actions;
export default ambulanceSlice.reducer;
