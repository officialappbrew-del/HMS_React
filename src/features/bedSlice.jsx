import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wardRoundApi } from '../utils/api';

export const fetchWards = createAsyncThunk(
  'bed/fetchWards',
  async (_, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.getWards();
      return Array.isArray(data) ? data : data.results || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load wards.');
    }
  }
);

export const fetchBeds = createAsyncThunk(
  'bed/fetchBeds',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.getBeds(params);
      return Array.isArray(data) ? data : data.results || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load beds.');
    }
  }
);

export const seedDemoBeds = createAsyncThunk(
  'bed/seedDemoBeds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.seedDemoWards();
      return Array.isArray(data) ? data : data.results || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to seed demo beds.');
    }
  }
);

export const reserveBed = createAsyncThunk(
  'bed/reserveBed',
  async ({ bedId, patientId }, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.reserveBed(bedId, patientId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to reserve bed.');
    }
  }
);

export const occupyBed = createAsyncThunk(
  'bed/occupyBed',
  async ({ bedId, patientId }, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.occupyBed(bedId, patientId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to occupy bed.');
    }
  }
);

export const releaseBed = createAsyncThunk(
  'bed/releaseBed',
  async (bedId, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.releaseBed(bedId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to release bed.');
    }
  }
);

export const markBedAvailable = createAsyncThunk(
  'bed/markBedAvailable',
  async (bedId, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.markBedAvailable(bedId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to mark bed available.');
    }
  }
);

const initialState = {
  wards: [],
  beds: [],
  selectedWard: null,
  bedStatus: {
    AVAILABLE: 'Available',
    OCCUPIED: 'Occupied',
    RESERVED: 'Reserved',
    UNDER_CLEANING: 'Under Cleaning',
    MAINTENANCE: 'Maintenance'
  },
  stats: {
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    reservedBeds: 0
  },
  loading: false,
  error: null
};

const bedSlice = createSlice({
  name: 'bed',
  initialState,
  reducers: {
    selectWard: (state, action) => {
      state.selectedWard = state.wards.find(w => w.wardId === action.payload) || null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWards.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWards.fulfilled, (state, action) => {
        state.loading = false;
        state.wards = action.payload;
        state.selectedWard = state.selectedWard || action.payload[0] || null;
      })
      .addCase(fetchWards.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchBeds.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBeds.fulfilled, (state, action) => {
        state.loading = false;
        state.beds = action.payload;
        state.stats = {
          totalBeds: action.payload.length,
          occupiedBeds: action.payload.filter(b => b.status === state.bedStatus.OCCUPIED).length,
          availableBeds: action.payload.filter(b => b.status === state.bedStatus.AVAILABLE).length,
          reservedBeds: action.payload.filter(b => b.status === state.bedStatus.RESERVED).length
        };
      })
      .addCase(fetchBeds.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(seedDemoBeds.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(seedDemoBeds.fulfilled, (state, action) => {
        state.loading = false;
        state.wards = action.payload;
        state.selectedWard = state.selectedWard || action.payload[0] || null;
      })
      .addCase(seedDemoBeds.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(reserveBed.fulfilled, (state, action) => {
        const updatedBed = action.payload;
        const index = state.beds.findIndex(b => b.id === updatedBed.id);
        if (index >= 0) {
          state.beds[index] = updatedBed;
        }
      })
      .addCase(occupyBed.fulfilled, (state, action) => {
        const updatedBed = action.payload;
        const index = state.beds.findIndex(b => b.id === updatedBed.id);
        if (index >= 0) {
          state.beds[index] = updatedBed;
        }
      })
      .addCase(releaseBed.fulfilled, (state, action) => {
        const updatedBed = action.payload;
        const index = state.beds.findIndex(b => b.id === updatedBed.id);
        if (index >= 0) {
          state.beds[index] = updatedBed;
        }
      })
      .addCase(markBedAvailable.fulfilled, (state, action) => {
        const updatedBed = action.payload;
        const index = state.beds.findIndex(b => b.id === updatedBed.id);
        if (index >= 0) {
          state.beds[index] = updatedBed;
        }
      });
  }
});

export const { selectWard } = bedSlice.actions;
export default bedSlice.reducer;
