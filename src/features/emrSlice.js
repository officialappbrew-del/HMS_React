import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { emrApi } from '../utils/api';
import { apiRequest } from '../utils/api';

const initialState = {
  medicalRecords: [],
  progressNotes: [],
  documents: [],
  problems: [],
  allergies: [],
  currentRecord: null,
  loading: false,
  error: null,
};

export const fetchMedicalRecords = createAsyncThunk(
  'emr/fetchMedicalRecords',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await emrApi.getMedicalRecords(params);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load medical records.');
    }
  }
);

export const fetchMedicalRecord = createAsyncThunk(
  'emr/fetchMedicalRecord',
  async (id, { rejectWithValue }) => {
    try {
      const data = await emrApi.getMedicalRecord(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load medical record.');
    }
  }
);

export const createMedicalRecord = createAsyncThunk(
  'emr/createMedicalRecord',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await emrApi.createMedicalRecord(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create medical record.');
    }
  }
);

export const createProgressNote = createAsyncThunk(
  'emr/createProgressNote',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await emrApi.createProgressNote(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to save progress note.');
    }
  }
);

export const fetchProgressNotes = createAsyncThunk(
  'emr/fetchProgressNotes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await emrApi.getProgressNotes(params);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load progress notes.');
    }
  }
);

export const createProblem = createAsyncThunk(
  'emr/createProblem',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await emrApi.createProblem(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add problem to list.');
    }
  }
);

export const createAllergy = createAsyncThunk(
  'emr/createAllergy',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await emrApi.createAllergy(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add allergy.');
    }
  }
);

export const createDocument = createAsyncThunk(
  'emr/createDocument',
  async ({ data, file }, { rejectWithValue }) => {
    try {
      const result = await emrApi.createDocument(data, file);
      return result;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to upload document.');
    }
  }
);

const emrSlice = createSlice({
  name: 'emr',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    setCurrentRecord: (state, action) => {
      state.currentRecord = action.payload;
    },
    addProgressNote: (state, action) => {
      state.progressNotes.unshift(action.payload);
    },
    addProblem: (state, action) => {
      state.problems.unshift(action.payload);
    },
    addAllergy: (state, action) => {
      state.allergies.unshift(action.payload);
    },
    removeProblem: (state, action) => {
      state.problems = state.problems.filter(p => p.id !== action.payload);
    },
    removeAllergy: (state, action) => {
      state.allergies = state.allergies.filter(a => a.id !== action.payload);
    },
    addClinicalNote: (state, action) => {
      state.progressNotes.unshift({
        id: Date.now().toString(),
        ...action.payload,
        created_at: new Date().toISOString(),
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicalRecords.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMedicalRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalRecords = action.payload;
      })
      .addCase(fetchMedicalRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMedicalRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecord = action.payload;
      })
      .addCase(fetchProgressNotes.fulfilled, (state, action) => {
        state.progressNotes = action.payload;
      })
      .addCase(createProgressNote.fulfilled, (state, action) => {
        state.progressNotes.unshift(action.payload);
      })
      .addCase(createProblem.fulfilled, (state, action) => {
        state.problems.unshift(action.payload);
      })
      .addCase(createAllergy.fulfilled, (state, action) => {
        state.allergies.unshift(action.payload);
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.documents.unshift(action.payload);
      });
  },
});

export const {
  clearError,
  setCurrentRecord,
  addProgressNote,
  addProblem,
  addAllergy,
  removeProblem,
  removeAllergy,
  addClinicalNote,
} = emrSlice.actions;

export default emrSlice.reducer;
