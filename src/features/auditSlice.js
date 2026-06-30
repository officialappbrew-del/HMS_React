import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auditApi } from '../utils/api';

const initialState = {
  audits: [],
  qualityIndicators: [],
  peerReviews: [],
  mortalityReviews: [],
  complianceScores: {
    overall: 0,
    protocols: {},
    departments: {},
  },
  auditReports: [],
  searchTerm: '',
  filterBy: 'all',
  loading: false,
  error: null,
};

export const fetchAudits = createAsyncThunk(
  'audit/fetchAudits',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await auditApi.getAudits(params);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load audits.');
    }
  }
);

export const createAudit = createAsyncThunk(
  'audit/createAudit',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await auditApi.createAudit(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create audit.');
    }
  }
);

export const updateAudit = createAsyncThunk(
  'audit/updateAudit',
  async ({ auditId, updates }, { rejectWithValue }) => {
    try {
      const data = await auditApi.updateAudit(auditId, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update audit.');
    }
  }
);

export const completeAudit = createAsyncThunk(
  'audit/completeAudit',
  async (auditId, { rejectWithValue }) => {
    try {
      const data = await auditApi.completeAudit(auditId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to complete audit.');
    }
  }
);

export const schedulePeerReview = createAsyncThunk(
  'audit/schedulePeerReview',
  async (auditId, { rejectWithValue }) => {
    try {
      const data = await auditApi.schedulePeerReview(auditId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to schedule peer review.');
    }
  }
);

export const fetchQualityIndicators = createAsyncThunk(
  'audit/fetchQualityIndicators',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await auditApi.getQualityIndicators(params);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load quality indicators.');
    }
  }
);

export const createQualityIndicator = createAsyncThunk(
  'audit/createQualityIndicator',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await auditApi.createQualityIndicator(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create quality indicator.');
    }
  }
);

export const updateQualityIndicator = createAsyncThunk(
  'audit/updateQualityIndicator',
  async ({ indicatorId, updates }, { rejectWithValue }) => {
    try {
      const data = await auditApi.updateQualityIndicator(indicatorId, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update quality indicator.');
    }
  }
);

export const fetchPeerReviews = createAsyncThunk(
  'audit/fetchPeerReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await auditApi.getPeerReviews(params);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load peer reviews.');
    }
  }
);

export const fetchMortalityReviews = createAsyncThunk(
  'audit/fetchMortalityReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await auditApi.getMortalityReviews(params);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load mortality reviews.');
    }
  }
);

export const createMortalityReview = createAsyncThunk(
  'audit/createMortalityReview',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await auditApi.createMortalityReview(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create mortality review.');
    }
  }
);

export const fetchComplianceScores = createAsyncThunk(
  'audit/fetchComplianceScores',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await auditApi.getComplianceScores(params);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load compliance scores.');
    }
  }
);

export const updateComplianceScore = createAsyncThunk(
  'audit/updateComplianceScore',
  async ({ scoreId, updates }, { rejectWithValue }) => {
    try {
      const data = await auditApi.updateComplianceScore(scoreId, updates);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update compliance score.');
    }
  }
);

export const scheduleAudit = createAsyncThunk(
  'audit/scheduleAudit',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await auditApi.scheduleAudit(payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to schedule audit.');
    }
  }
);

export const generateAuditReport = createAsyncThunk(
  'audit/generateAuditReport',
  async (auditId, { rejectWithValue }) => {
    try {
      const data = await auditApi.generateAuditReport(auditId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to generate audit report.');
    }
  }
);

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    searchAudits: (state, action) => {
      state.searchTerm = action.payload;
    },
    filterAudits: (state, action) => {
      state.filterBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAudits.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAudits.fulfilled, (state, action) => { state.loading = false; state.audits = action.payload; })
      .addCase(fetchAudits.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createAudit.fulfilled, (state, action) => { state.audits.unshift(action.payload); })
      .addCase(updateAudit.fulfilled, (state, action) => {
        const idx = state.audits.findIndex(a => a.id === action.payload.id);
        if (idx !== -1) state.audits[idx] = action.payload;
      })
      .addCase(completeAudit.fulfilled, (state, action) => {
        const idx = state.audits.findIndex(a => a.id === action.payload.id);
        if (idx !== -1) state.audits[idx] = action.payload;
      })

      .addCase(fetchQualityIndicators.fulfilled, (state, action) => { state.qualityIndicators = action.payload; })
      .addCase(createQualityIndicator.fulfilled, (state, action) => { state.qualityIndicators.unshift(action.payload); })
      .addCase(updateQualityIndicator.fulfilled, (state, action) => {
        const idx = state.qualityIndicators.findIndex(i => i.id === action.payload.id);
        if (idx !== -1) state.qualityIndicators[idx] = action.payload;
      })

      .addCase(fetchPeerReviews.fulfilled, (state, action) => { state.peerReviews = action.payload; })
      .addCase(schedulePeerReview.fulfilled, (state, action) => { state.peerReviews.unshift(action.payload); })

      .addCase(fetchMortalityReviews.fulfilled, (state, action) => { state.mortalityReviews = action.payload; })
      .addCase(createMortalityReview.fulfilled, (state, action) => { state.mortalityReviews.unshift(action.payload); })

      .addCase(fetchComplianceScores.fulfilled, (state, action) => {
        state.complianceScores.overall = action.payload.overall || 0;
        state.complianceScores.protocols = action.payload.protocols || {};
        state.complianceScores.departments = action.payload.departments || {};
      })
      .addCase(updateComplianceScore.fulfilled, (state, action) => {
        const score = action.payload;
        if (score.department) {
          if (!state.complianceScores.departments[score.department]) {
            state.complianceScores.departments[score.department] = {};
          }
          state.complianceScores.departments[score.department][score.protocol] = score.score;
        } else {
          state.complianceScores.protocols[score.protocol] = score.score;
        }
      })
      .addCase(scheduleAudit.fulfilled, (state, action) => { state.audits.unshift(action.payload); })
      .addCase(generateAuditReport.fulfilled, (state, action) => {
        const report = action.payload;
        if (!state.auditReports.some(r => r.id === report.id)) {
          state.auditReports.unshift(report);
        }
      });
  },
});

export const {
  searchAudits,
  filterAudits,
  clearError,
} = auditSlice.actions;

export default auditSlice.reducer;
