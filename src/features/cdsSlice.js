import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cdsApi } from '../utils/api';

const initialState = {
  drugInteractions: [],
  allergyAlerts: [],
  dosingRecommendations: null,
  clinicalGuidelines: [],
  riskCalculations: null,
  patientAlerts: [],
  searchResults: [],
  loading: false,
  error: null,
};

export const checkDrugInteractions = createAsyncThunk(
  'cds/checkDrugInteractions',
  async (payload, { rejectWithValue }) => {
    try {
      if (payload.drugs && payload.drugs.length > 0) {
        const data = await cdsApi.checkDrugInteractions(payload);
        return data;
      }
      return [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to check drug interactions.');
    }
  }
);

export const checkAllergies = createAsyncThunk(
  'cds/checkAllergies',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await cdsApi.getAllergyChecks(payload);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to check allergies.');
    }
  }
);

export const calculateDose = createAsyncThunk(
  'cds/calculateDose',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await cdsApi.getDosingGuidelines({ drug: payload.drug });
      const list = Array.isArray(data) ? data : (data.results || []);
      return { guideline: list[0] || null, payload };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to calculate dose.');
    }
  }
);

export const getClinicalGuidelines = createAsyncThunk(
  'cds/getClinicalGuidelines',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await cdsApi.getClinicalGuidelines(params);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load clinical guidelines.');
    }
  }
);

export const calculateRisk = createAsyncThunk(
  'cds/calculateRisk',
  async (payload, { rejectWithValue }) => {
    try {
      const mappedPayload = {
        score: Math.round((payload.riskPercentage || 0) * 10) / 10,
        risk_type: payload.calculator || 'general',
        risk_percentage: payload.riskPercentage || 0,
        risk_category: (payload.riskCategory || 'low').toLowerCase(),
        input_data: payload,
        tenant: payload.tenant,
        patient: payload.patient,
      };

      await cdsApi.createRiskAssessment(mappedPayload);
      return payload;
    } catch (err) {
      const apiError = err?.data || err?.response?.data || null;
      return rejectWithValue({
        message: err.message || 'Failed to calculate risk.',
        data: apiError,
      });
    }
  }
);

export const addPatientAlert = createAsyncThunk(
  'cds/addPatientAlert',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await cdsApi.createPatientAlert(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add patient alert.');
    }
  }
);

export const dismissAlert = createAsyncThunk(
  'cds/dismissAlert',
  async (alertId, { rejectWithValue }) => {
    try {
      await cdsApi.dismissAlert(alertId);
      return alertId;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to dismiss alert.');
    }
  }
);

export const searchGuidelines = createAsyncThunk(
  'cds/searchGuidelines',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const data = await cdsApi.getClinicalGuidelines({ search: searchTerm });
      const list = Array.isArray(data) ? data : (data.results || []);
      return { searchTerm, results: list };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to search guidelines.');
    }
  }
);

export const updatePatientProfile = createAsyncThunk(
  'cds/updatePatientProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await cdsApi.createAllergyCheck(profileData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update patient profile.');
    }
  }
);

const cdsSlice = createSlice({
  name: 'cds',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.drugInteractions = [];
      state.allergyAlerts = [];
      state.dosingRecommendations = null;
      state.riskCalculations = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updatePatientAlert: (state, action) => {
      const { id, updates } = action.payload;
      const alert = state.patientAlerts.find(a => a.id === id);
      if (alert) {
        Object.assign(alert, updates);
      }
    },
    addGuidelineToFavorites: (state, action) => {
      console.log('Added guideline to favorites:', action.payload);
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setRiskCalculations: (state, action) => {
      state.riskCalculations = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkDrugInteractions.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(checkDrugInteractions.fulfilled, (state, action) => { state.loading = false; state.drugInteractions = action.payload; })
      .addCase(checkDrugInteractions.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(checkAllergies.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(checkAllergies.fulfilled, (state, action) => { state.loading = false; state.allergyAlerts = action.payload; })
      .addCase(checkAllergies.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(calculateDose.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(calculateDose.fulfilled, (state, action) => { state.loading = false; state.dosingRecommendations = action.payload; })
      .addCase(calculateDose.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(getClinicalGuidelines.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getClinicalGuidelines.fulfilled, (state, action) => { state.loading = false; state.clinicalGuidelines = action.payload; })
      .addCase(getClinicalGuidelines.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(calculateRisk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(calculateRisk.fulfilled, (state, action) => { state.loading = false; state.riskCalculations = action.payload; })
      .addCase(calculateRisk.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addPatientAlert.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addPatientAlert.fulfilled, (state, action) => { state.loading = false; state.patientAlerts.unshift(action.payload); })
      .addCase(addPatientAlert.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(dismissAlert.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(dismissAlert.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.patientAlerts.findIndex(a => a.id === action.payload);
        if (index !== -1) state.patientAlerts.splice(index, 1);
      })
      .addCase(dismissAlert.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(searchGuidelines.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(searchGuidelines.fulfilled, (state, action) => { state.loading = false; state.searchResults = action.payload.results; })
      .addCase(searchGuidelines.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updatePatientProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updatePatientProfile.fulfilled, (state, action) => { state.loading = false; })
      .addCase(updatePatientProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const {
  clearResults,
  clearError,
  updatePatientAlert,
  addGuidelineToFavorites,
  setSearchTerm,
  setRiskCalculations,
} = cdsSlice.actions;

export default cdsSlice.reducer;
