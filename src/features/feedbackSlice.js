import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { feedbackApi } from '../utils/api';

const listResponse = (response) => (Array.isArray(response) ? response : response?.results || []);
const normalizeComplaint = (item) => ({
  ...item,
  patientName: item.patientName || item.patient_name || '',
  contactMethod: item.contactMethod || item.contact_method || '',
});
const normalizeSurvey = (item) => ({
  ...item,
  targetAudience: item.targetAudience || item.target_audience || '',
  distributionMethod: item.distributionMethod || item.distribution_method || '',
  createdAt: item.createdAt || item.created_at || null,
});

export const fetchFeedbackData = createAsyncThunk('feedback/fetchData', async (_, { rejectWithValue }) => {
  try {
    const [feedback, complaints, surveys, improvementPlans] = await Promise.all([
      feedbackApi.getFeedback(), feedbackApi.getComplaints(), feedbackApi.getSurveys(), feedbackApi.getPlans(),
    ]);
    return {
      feedback: listResponse(feedback),
      complaints: listResponse(complaints).map(normalizeComplaint),
      surveys: listResponse(surveys).map(normalizeSurvey),
      improvementPlans: listResponse(improvementPlans),
    };
  } catch (error) {
    return rejectWithValue(error.message || 'Unable to load feedback data.');
  }
});

export const createFeedbackSurvey = createAsyncThunk('feedback/createSurvey', async (data, { rejectWithValue }) => {
  try { return normalizeSurvey(await feedbackApi.createSurvey(data)); }
  catch (error) { return rejectWithValue(error.message || 'Unable to create survey.'); }
});

export const sendFeedbackSurvey = createAsyncThunk('feedback/sendSurvey', async (id, { rejectWithValue }) => {
  try { return normalizeSurvey(await feedbackApi.sendSurvey(id)); }
  catch (error) { return rejectWithValue(error.message || 'Unable to send survey.'); }
});

export const createPatientComplaint = createAsyncThunk('feedback/createComplaint', async (data, { rejectWithValue }) => {
  try { return normalizeComplaint(await feedbackApi.createComplaint(data)); }
  catch (error) { return rejectWithValue(error.message || 'Unable to create complaint.'); }
});

export const resolvePatientComplaint = createAsyncThunk('feedback/resolveComplaint', async ({ complaintId, resolution = '' }, { rejectWithValue }) => {
  try { return normalizeComplaint(await feedbackApi.resolveComplaint(complaintId, resolution)); }
  catch (error) { return rejectWithValue(error.message || 'Unable to resolve complaint.'); }
});

export const escalatePatientComplaint = createAsyncThunk('feedback/escalateComplaint', async (complaintId, { rejectWithValue }) => {
  try { return normalizeComplaint(await feedbackApi.escalateComplaint(complaintId)); }
  catch (error) { return rejectWithValue(error.message || 'Unable to escalate complaint.'); }
});

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState: {
    surveys: [], feedback: [], complaints: [], improvementPlans: [], metrics: null,
    searchTerm: '', filterBy: 'all', loading: false, error: null,
  },
  reducers: {
    searchFeedback: (state, action) => { state.searchTerm = action.payload; },
    filterFeedback: (state, action) => { state.filterBy = action.payload; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbackData.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFeedbackData.fulfilled, (state, action) => { state.loading = false; Object.assign(state, action.payload); })
      .addCase(fetchFeedbackData.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createFeedbackSurvey.fulfilled, (state, action) => { state.surveys.unshift(action.payload); })
      .addCase(sendFeedbackSurvey.fulfilled, (state, action) => { const item = state.surveys.find((survey) => survey.id === action.payload.id); if (item) Object.assign(item, action.payload); })
      .addCase(createPatientComplaint.fulfilled, (state, action) => { state.complaints.unshift(action.payload); })
      .addCase(resolvePatientComplaint.fulfilled, (state, action) => { const item = state.complaints.find((complaint) => complaint.id === action.payload.id); if (item) Object.assign(item, action.payload); })
      .addCase(escalatePatientComplaint.fulfilled, (state, action) => { const item = state.complaints.find((complaint) => complaint.id === action.payload.id); if (item) Object.assign(item, action.payload); });
  },
});

export const { searchFeedback, filterFeedback, clearError } = feedbackSlice.actions;
export default feedbackSlice.reducer;
