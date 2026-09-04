import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { emergencyApi } from '../utils/api';

const initialState = {
  patients: [],
  triageQueue: [],
  treatmentBays: [],
  waitingRoom: [],
  dischargeLounge: [],
  stats: {
    totalPatients: 0,
    waitingPatients: 0,
    inTreatment: 0,
    averageWaitTime: 0,
    averageTreatmentTime: 0
  },
  searchTerm: '',
  sortBy: 'arrival_time',
  filterBy: 'all',
  loading: false,
  error: null,
};

const normalizeCase = (item) => ({
  ...item,
  presentingComplaint: item.presentingComplaint || '',
  arrivalTime: item.arrivalTime,
  triageTime: item.triageTime,
  treatmentStartTime: item.treatmentStartTime,
  assignedBay: item.assignedBay || null,
});

const updateCaseCollections = (state, cases) => {
  state.patients = cases;
  state.waitingRoom = cases.filter((item) => item.status === 'waiting_triage');
  state.triageQueue = cases.filter((item) => item.status === 'triaged');
  state.dischargeLounge = cases.filter((item) => ['discharged', 'admitted'].includes(item.status));
  state.stats = {
    ...state.stats,
    totalPatients: cases.length,
    waitingPatients: state.waitingRoom.length,
    inTreatment: cases.filter((item) => item.status === 'in_treatment').length,
  };
};

export const fetchEmergencyData = createAsyncThunk('ed/fetchEmergencyData', async (_, { rejectWithValue }) => {
  try {
    const [casesResponse, baysResponse] = await Promise.all([emergencyApi.getCases(), emergencyApi.getBays()]);
    return {
      cases: (Array.isArray(casesResponse) ? casesResponse : casesResponse.results || []).map(normalizeCase),
      bays: Array.isArray(baysResponse) ? baysResponse : baysResponse.results || [],
    };
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to load emergency department data.');
  }
});

export const registerEmergencyCase = createAsyncThunk('ed/registerEmergencyCase', async (payload, { rejectWithValue }) => {
  try { return normalizeCase(await emergencyApi.createCase(payload)); }
  catch (error) { return rejectWithValue(error.message || 'Unable to register emergency patient.'); }
});

export const triageEmergencyCase = createAsyncThunk('ed/triageEmergencyCase', async ({ patientId, triageData }, { rejectWithValue }) => {
  try { return normalizeCase(await emergencyApi.triageCase(patientId, { triageData })); }
  catch (error) { return rejectWithValue(error.message || 'Unable to complete triage.'); }
});

export const assignEmergencyBay = createAsyncThunk('ed/assignEmergencyBay', async ({ patientId, bayId }, { rejectWithValue }) => {
  try { return normalizeCase(await emergencyApi.assignBay(patientId, bayId)); }
  catch (error) { return rejectWithValue(error.message || 'Unable to assign treatment bay.'); }
});

export const updateEmergencyCaseStatus = createAsyncThunk('ed/updateEmergencyCaseStatus', async ({ patientId, status }, { rejectWithValue }) => {
  try { return normalizeCase(await emergencyApi.updateStatus(patientId, status)); }
  catch (error) { return rejectWithValue(error.message || 'Unable to update emergency case status.'); }
});
const edSlice = createSlice({
  name: 'ed',
  initialState,
  reducers: {
    searchED: (state, action) => {
      state.searchTerm = action.payload;
    },

    sortED: (state, action) => {
      state.sortBy = action.payload;
    },

    filterED: (state, action) => {
      state.filterBy = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmergencyData.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEmergencyData.fulfilled, (state, action) => {
        state.loading = false;
        updateCaseCollections(state, action.payload.cases);
        state.treatmentBays = action.payload.bays;
      })
      .addCase(fetchEmergencyData.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(registerEmergencyCase.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerEmergencyCase.fulfilled, (state, action) => {
        state.loading = false;
        updateCaseCollections(state, [...state.patients, action.payload]);
      })
      .addCase(registerEmergencyCase.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(triageEmergencyCase.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(triageEmergencyCase.fulfilled, (state, action) => {
        state.loading = false;
        updateCaseCollections(state, state.patients.map((item) => item.id === action.payload.id ? action.payload : item));
      })
      .addCase(triageEmergencyCase.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(assignEmergencyBay.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(assignEmergencyBay.fulfilled, (state, action) => {
        state.loading = false;
        updateCaseCollections(state, state.patients.map((item) => item.id === action.payload.id ? action.payload : item));
      })
      .addCase(assignEmergencyBay.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateEmergencyCaseStatus.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateEmergencyCaseStatus.fulfilled, (state, action) => {
        state.loading = false;
        updateCaseCollections(state, state.patients.map((item) => item.id === action.payload.id ? action.payload : item));
      })
      .addCase(updateEmergencyCaseStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const {
  searchED,
  sortED,
  filterED,
  setLoading,
  setError,
} = edSlice.actions;

export default edSlice.reducer;