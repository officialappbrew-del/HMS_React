import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest, vitalsApi } from '../utils/api';

const initialState = {
  vitalSigns: [],
  alerts: [],
  earlyWarningScores: [],
  loading: false,
  error: null,
};

export const fetchVitalSigns = createAsyncThunk(
  'vitalSigns/fetchVitalSigns',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await vitalsApi.getVitalSigns(params);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load vital signs.');
    }
  }
);

export const createVitalSign = createAsyncThunk(
  'vitalSigns/createVitalSign',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await vitalsApi.createVitalSign(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to record vital signs.');
    }
  }
);

export const fetchActiveAlerts = createAsyncThunk(
  'vitalSigns/fetchActiveAlerts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await vitalsApi.getActiveAlerts();
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load alerts.');
    }
  }
);

export const acknowledgeAlertApi = createAsyncThunk(
  'vitalSigns/acknowledgeAlert',
  async (alertId, { rejectWithValue }) => {
    try {
      await vitalsApi.acknowledgeAlert(alertId);
      return alertId;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to acknowledge alert.');
    }
  }
);

export const calculateEWS = createAsyncThunk(
  'vitalSigns/calculateEWS',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await vitalsApi.calculateEWS(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to calculate early warning score.');
    }
  }
);

const vitalSignsSlice = createSlice({
  name: 'vitalSigns',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVitalSigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVitalSigns.fulfilled, (state, action) => {
        state.loading = false;
        state.vitalSigns = action.payload;
      })
      .addCase(fetchVitalSigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVitalSign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVitalSign.fulfilled, (state, action) => {
        state.loading = false;
        state.vitalSigns.unshift(action.payload);
      })
      .addCase(createVitalSign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActiveAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      })
      .addCase(acknowledgeAlertApi.fulfilled, (state, action) => {
        const alert = state.alerts.find(a => a.id === action.payload);
        if (alert) {
          alert.acknowledged = true;
        }
      })
      .addCase(calculateEWS.fulfilled, (state, action) => {
        state.earlyWarningScores.unshift(action.payload);
      });
  },
});

export const {
  clearError,
  setSearchTerm,
  setSortBy,
  setFilterBy,
} = vitalSignsSlice.actions;

export default vitalSignsSlice.reducer;
