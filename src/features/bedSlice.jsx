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

export const fetchBedStats = createAsyncThunk(
  'bed/fetchBedStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.getBeds();
      const beds = Array.isArray(data) ? data : data.results || [];
      return beds;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load bed stats.');
    }
  }
);

export const createWard = createAsyncThunk(
  'bed/createWard',
  async (wardData, { rejectWithValue }) => {
    try {
      return await wardRoundApi.createWard(wardData);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create ward.');
    }
  }
);

export const updateWard = createAsyncThunk(
  'bed/updateWard',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await wardRoundApi.updateWard(id, data);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update ward.');
    }
  }
);

export const deleteWard = createAsyncThunk(
  'bed/deleteWard',
  async (id, { rejectWithValue }) => {
    try {
      await wardRoundApi.deleteWard(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete ward.');
    }
  }
);

export const createBed = createAsyncThunk(
  'bed/createBed',
  async (bedData, { rejectWithValue }) => {
    try {
      return await wardRoundApi.createBed(bedData);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create bed.');
    }
  }
);

export const updateBed = createAsyncThunk(
  'bed/updateBed',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await wardRoundApi.updateBed(id, data);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update bed.');
    }
  }
);

export const deleteBed = createAsyncThunk(
  'bed/deleteBed',
  async (id, { rejectWithValue }) => {
    try {
      await wardRoundApi.deleteBed(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete bed.');
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

const computeStatsFromBeds = (beds) => {
  const bedStatus = {
    AVAILABLE: 'Available',
    OCCUPIED: 'Occupied',
    RESERVED: 'Reserved',
    UNDER_CLEANING: 'Under Cleaning',
    MAINTENANCE: 'Maintenance'
  };
  return {
    totalBeds: beds.length,
    occupiedBeds: beds.filter(b => b.status === bedStatus.OCCUPIED).length,
    availableBeds: beds.filter(b => b.status === bedStatus.AVAILABLE).length,
    reservedBeds: beds.filter(b => b.status === bedStatus.RESERVED).length
  };
};

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
  saving: false,
  error: null
};

const bedSlice = createSlice({
  name: 'bed',
  initialState,
  reducers: {
    selectWard: (state, action) => {
      state.selectedWard = state.wards.find(w => String(w.wardId) === String(action.payload)) || null;
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
      })
      .addCase(fetchBeds.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchBedStats.pending, (state) => { state.error = null; })
      .addCase(fetchBedStats.fulfilled, (state, action) => {
        state.stats = computeStatsFromBeds(action.payload);
      })
      .addCase(fetchBedStats.rejected, (state, action) => { state.error = action.payload; })

      .addCase(createWard.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          state.wards.push(action.payload);
        }
      })
      .addCase(updateWard.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.wards.findIndex(w => w.id === updated.id);
        if (index >= 0) {
          state.wards[index] = { ...state.wards[index], ...updated };
        }
        if (state.selectedWard && state.selectedWard.id === updated.id) {
          state.selectedWard = { ...state.selectedWard, ...updated };
        }
      })
      .addCase(deleteWard.fulfilled, (state, action) => {
        state.wards = state.wards.filter(w => w.id !== action.payload);
        if (state.selectedWard && state.selectedWard.id === action.payload) {
          state.selectedWard = state.wards[0] || null;
        }
      })

      .addCase(createBed.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          state.beds.push(action.payload);
        }
      })
      .addCase(updateBed.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.beds.findIndex(b => b.id === updated.id);
        if (index >= 0) {
          state.beds[index] = { ...state.beds[index], ...updated };
        }
      })
      .addCase(deleteBed.fulfilled, (state, action) => {
        state.beds = state.beds.filter(b => b.id !== action.payload);
      })

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
