import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vitalSigns: [],
  alerts: [],
  earlyWarningScores: [],
  searchTerm: '',
  sortBy: 'date',
  filterBy: 'all',
  loading: false,
  error: null,
};

const vitalSignsSlice = createSlice({
  name: 'vitalSigns',
  initialState,
  reducers: {
    addVitalSigns: (state, action) => {
      state.vitalSigns.push({
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    updateVitalSigns: (state, action) => {
      const index = state.vitalSigns.findIndex(vs => vs.id === action.payload.id);
      if (index !== -1) {
        state.vitalSigns[index] = { ...state.vitalSigns[index], ...action.payload };
      }
    },
    deleteVitalSigns: (state, action) => {
      state.vitalSigns = state.vitalSigns.filter(vs => vs.id !== action.payload);
    },
    calculateEarlyWarningScore: (state, action) => {
      const { patientId, vitals } = action.payload;
      // NEWS2 calculation logic
      let score = 0;
      const { respirationRate, oxygenSaturation, temperature, systolicBP, heartRate, consciousness } = vitals;

      // Respiration Rate
      if (respirationRate <= 8 || respirationRate >= 25) score += 3;
      else if (respirationRate >= 21 && respirationRate <= 24) score += 2;
      else if (respirationRate >= 9 && respirationRate <= 11) score += 1;

      // Oxygen Saturation
      if (oxygenSaturation <= 91) score += 3;
      else if (oxygenSaturation >= 92 && oxygenSaturation <= 93) score += 2;
      else if (oxygenSaturation >= 94 && oxygenSaturation <= 95) score += 1;

      // Temperature
      if (temperature <= 35.0) score += 3;
      else if (temperature >= 39.1) score += 2;
      else if (temperature >= 38.1 && temperature <= 39.0) score += 1;

      // Systolic BP
      if (systolicBP <= 90 || systolicBP >= 220) score += 3;
      else if (systolicBP >= 101 && systolicBP <= 110) score += 2;
      else if (systolicBP >= 111 && systolicBP <= 219) score += 1;

      // Heart Rate
      if (heartRate <= 40 || heartRate >= 131) score += 3;
      else if (heartRate >= 111 && heartRate <= 130) score += 2;
      else if (heartRate >= 41 && heartRate <= 50 || heartRate >= 91 && heartRate <= 110) score += 1;

      // Consciousness
      if (consciousness !== 'Alert') score += 3;

      const severity = score >= 7 ? 'High' : score >= 5 ? 'Medium' : 'Low';

      state.earlyWarningScores.push({
        id: Date.now().toString(),
        patientId,
        score,
        severity,
        timestamp: new Date().toISOString(),
      });

      // Generate alerts if needed
      if (score >= 5) {
        state.alerts.push({
          id: Date.now().toString(),
          patientId,
          type: 'Early Warning Score',
          message: `Patient ${patientId} has NEWS2 score of ${score} (${severity} risk)`,
          severity,
          timestamp: new Date().toISOString(),
          acknowledged: false,
        });
      }
    },
    acknowledgeAlert: (state, action) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) {
        alert.acknowledged = true;
      }
    },
    searchVitalSigns: (state, action) => {
      state.searchTerm = action.payload;
    },
    sortVitalSigns: (state, action) => {
      state.sortBy = action.payload;
    },
    filterVitalSigns: (state, action) => {
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
  addVitalSigns,
  updateVitalSigns,
  deleteVitalSigns,
  calculateEarlyWarningScore,
  acknowledgeAlert,
  searchVitalSigns,
  sortVitalSigns,
  filterVitalSigns,
  setLoading,
  setError,
} = vitalSignsSlice.actions;

export default vitalSignsSlice.reducer;