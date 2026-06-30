import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wardRoundApi } from '../utils/api';

const ROUND_TYPE = {
  DAILY: 'Daily Ward Round',
  TEACHING: 'Teaching Round',
  GRAND: 'Grand Round',
  DISCHARGE: 'Discharge Round'
};

const ROUND_STATUS = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

const initialState = {
  wardRounds: [],
  handoverNotes: [],
  grandRounds: [],
  roundTypes: ROUND_TYPE,
  roundStatuses: ROUND_STATUS,
  loading: false,
  error: null,
};

export const fetchWardRounds = createAsyncThunk(
  'wardRound/fetchWardRounds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.getRounds();
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load ward rounds.');
    }
  }
);

export const scheduleWardRound = createAsyncThunk(
  'wardRound/scheduleWardRound',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.createRound(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to schedule ward round.');
    }
  }
);

export const startWardRound = createAsyncThunk(
  'wardRound/startWardRound',
  async (roundId, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.startRound(roundId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to start ward round.');
    }
  }
);

export const completeWardRound = createAsyncThunk(
  'wardRound/completeWardRound',
  async ({ roundId, notes, actualDuration }, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.completeRound(roundId, { notes, actualDuration });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to complete ward round.');
    }
  }
);

export const cancelWardRound = createAsyncThunk(
  'wardRound/cancelWardRound',
  async ({ roundId, reason }, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.cancelRound(roundId, { reason });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to cancel ward round.');
    }
  }
);

export const addPatientToRound = createAsyncThunk(
  'wardRound/addPatientToRound',
  async ({ roundId, patientId }, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.addPatientToRound(roundId, patientId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add patient to round.');
    }
  }
);

export const removePatientFromRound = createAsyncThunk(
  'wardRound/removePatientFromRound',
  async ({ roundId, patientId }, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.removePatientFromRound(roundId, patientId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to remove patient from round.');
    }
  }
);

export const addTeamMemberToRound = createAsyncThunk(
  'wardRound/addTeamMemberToRound',
  async ({ roundId, member }, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.addTeamMemberToRound(roundId, member);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add team member.');
    }
  }
);

export const recordRoundDocumentation = createAsyncThunk(
  'wardRound/recordRoundDocumentation',
  async ({ roundId, patientId, documentation }, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.recordRoundDocumentation(roundId, patientId, documentation);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to record documentation.');
    }
  }
);

export const fetchHandoverNotes = createAsyncThunk(
  'wardRound/fetchHandoverNotes',
  async (_, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.getHandovers();
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load handover notes.');
    }
  }
);

export const createHandoverNote = createAsyncThunk(
  'wardRound/createHandoverNote',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.createHandover(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create handover note.');
    }
  }
);

export const updateHandoverNote = createAsyncThunk(
  'wardRound/updateHandoverNote',
  async ({ handoverId, updates }, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.updateHandover(handoverId, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update handover note.');
    }
  }
);

export const fetchGrandRounds = createAsyncThunk(
  'wardRound/fetchGrandRounds',
  async (_, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.getGrandRounds();
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load grand rounds.');
    }
  }
);

export const scheduleGrandRound = createAsyncThunk(
  'wardRound/scheduleGrandRound',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.createGrandRound(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to schedule grand round.');
    }
  }
);

export const addCaseStudyToGrandRound = createAsyncThunk(
  'wardRound/addCaseStudyToGrandRound',
  async ({ grandRoundId, caseStudy }, { rejectWithValue }) => {
    try {
      const data = await wardRoundApi.addCaseStudyToGrandRound(grandRoundId, caseStudy);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add case study.');
    }
  }
);

const wardRoundSlice = createSlice({
  name: 'wardRound',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWardRounds.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWardRounds.fulfilled, (state, action) => { state.loading = false; state.wardRounds = action.payload; })
      .addCase(fetchWardRounds.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(scheduleWardRound.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(scheduleWardRound.fulfilled, (state, action) => { state.loading = false; state.wardRounds.unshift(action.payload); })
      .addCase(scheduleWardRound.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(startWardRound.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(startWardRound.fulfilled, (state, action) => {
        state.loading = false;
        const round = state.wardRounds.find(r => r.roundId === (action.payload.roundId || action.payload.id));
        if (round) {
          round.status = ROUND_STATUS.IN_PROGRESS;
          round.startTime = action.payload.startTime || new Date().toISOString();
        }
      })
      .addCase(startWardRound.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(completeWardRound.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(completeWardRound.fulfilled, (state, action) => {
        state.loading = false;
        const round = state.wardRounds.find(r => r.roundId === (action.payload.roundId || action.payload.id));
        if (round) {
          round.status = ROUND_STATUS.COMPLETED;
          round.completedTime = action.payload.completedTime || new Date().toISOString();
          if (action.payload.notes) round.notes = action.payload.notes;
          if (action.payload.actualDuration) round.actualDuration = action.payload.actualDuration;
        }
      })
      .addCase(completeWardRound.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(cancelWardRound.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(cancelWardRound.fulfilled, (state, action) => {
        state.loading = false;
        const round = state.wardRounds.find(r => r.roundId === (action.payload.roundId || action.payload.id));
        if (round) {
          round.status = ROUND_STATUS.CANCELLED;
          round.cancellationReason = action.payload.reason || action.payload.cancellationReason;
        }
      })
      .addCase(cancelWardRound.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addPatientToRound.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addPatientToRound.fulfilled, (state, action) => {
        state.loading = false;
        const round = state.wardRounds.find(r => r.roundId === (action.payload.roundId || action.payload.id));
        if (round && !round.patientsList.includes(action.payload.patientId)) {
          round.patientsList.push(action.payload.patientId);
        }
      })
      .addCase(addPatientToRound.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(removePatientFromRound.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(removePatientFromRound.fulfilled, (state, action) => {
        state.loading = false;
        const round = state.wardRounds.find(r => r.roundId === (action.payload.roundId || action.payload.id));
        if (round) {
          round.patientsList = round.patientsList.filter(id => id !== action.payload.patientId);
        }
      })
      .addCase(removePatientFromRound.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addTeamMemberToRound.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addTeamMemberToRound.fulfilled, (state, action) => {
        state.loading = false;
        const round = state.wardRounds.find(r => r.roundId === (action.payload.roundId || action.payload.id));
        if (round && !round.teamMembers.some(m => m.name === action.payload.member?.name)) {
          round.teamMembers.push(action.payload.member);
        }
      })
      .addCase(addTeamMemberToRound.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(recordRoundDocumentation.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(recordRoundDocumentation.fulfilled, (state, action) => {
        state.loading = false;
        const round = state.wardRounds.find(r => r.roundId === (action.payload.roundId || action.payload.id));
        if (round) {
          if (!round.roundDocumentation) round.roundDocumentation = {};
          round.roundDocumentation[action.payload.patientId || action.payload.patient_id] = action.payload.documentation;
        }
      })
      .addCase(recordRoundDocumentation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchHandoverNotes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchHandoverNotes.fulfilled, (state, action) => { state.loading = false; state.handoverNotes = action.payload; })
      .addCase(fetchHandoverNotes.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createHandoverNote.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createHandoverNote.fulfilled, (state, action) => { state.loading = false; state.handoverNotes.unshift(action.payload); })
      .addCase(createHandoverNote.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateHandoverNote.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateHandoverNote.fulfilled, (state, action) => {
        state.loading = false;
        const note = state.handoverNotes.find(n => n.handoverId === (action.payload.handoverId || action.payload.id));
        if (note) {
          Object.assign(note, action.payload);
        }
      })
      .addCase(updateHandoverNote.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchGrandRounds.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchGrandRounds.fulfilled, (state, action) => { state.loading = false; state.grandRounds = action.payload; })
      .addCase(fetchGrandRounds.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(scheduleGrandRound.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(scheduleGrandRound.fulfilled, (state, action) => { state.loading = false; state.grandRounds.unshift(action.payload); })
      .addCase(scheduleGrandRound.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addCaseStudyToGrandRound.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addCaseStudyToGrandRound.fulfilled, (state, action) => {
        state.loading = false;
        const round = state.grandRounds.find(g => g.grandRoundId === (action.payload.grandRoundId || action.payload.id));
        if (round && action.payload.caseStudy) {
          if (!round.caseStudies) round.caseStudies = [];
          round.caseStudies.push(action.payload.caseStudy);
        }
      })
      .addCase(addCaseStudyToGrandRound.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearError } = wardRoundSlice.actions;

export default wardRoundSlice.reducer;
