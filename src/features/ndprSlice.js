import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../utils/api';

const API_BASE = '/api/v1/ndpr';

const initialState = {
  consentRecords: [],
  dataRequests: [],
  dataBreaches: [],
  auditLogs: [],
  complianceMetrics: {
    consentCompliance: 0,
    dataRequestProcessing: 0,
    breachResponseTime: 0,
    auditCompliance: 0,
    trainingCompletion: 0,
    totalConsents: 0,
    activeConsents: 0,
    expiredConsents: 0,
    withdrawnConsents: 0,
    totalRequests: 0,
    pendingRequests: 0,
    openBreaches: 0,
    totalBreaches: 0,
  },
  searchTerm: '',
  filterBy: 'all',
  loading: false,
  error: null,
};

export const fetchConsentRecords = createAsyncThunk(
  'ndpr/fetchConsentRecords',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
      const data = await apiRequest(`${API_BASE}/consent-records/${qs.toString() ? '?' + qs.toString() : ''}`);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load consent records.');
    }
  }
);

export const createConsentRecord = createAsyncThunk(
  'ndpr/createConsentRecord',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/consent-records/`, { method: 'POST', body: JSON.stringify(payload) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create consent record.');
    }
  }
);

export const updateConsentRecord = createAsyncThunk(
  'ndpr/updateConsentRecord',
  async ({ consentId, updates }, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/consent-records/${consentId}/`, { method: 'PATCH', body: JSON.stringify(updates) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update consent record.');
    }
  }
);

export const withdrawConsent = createAsyncThunk(
  'ndpr/withdrawConsent',
  async ({ consentId, reason }, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/consent-records/${consentId}/withdraw/`, { method: 'POST', body: JSON.stringify({ reason }) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to withdraw consent.');
    }
  }
);

export const fetchDataRequests = createAsyncThunk(
  'ndpr/fetchDataRequests',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
      const data = await apiRequest(`${API_BASE}/data-requests/${qs.toString() ? '?' + qs.toString() : ''}`);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load data requests.');
    }
  }
);

export const submitDataRequest = createAsyncThunk(
  'ndpr/submitDataRequest',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/data-requests/`, { method: 'POST', body: JSON.stringify(payload) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to submit data request.');
    }
  }
);

export const processDataRequest = createAsyncThunk(
  'ndpr/processDataRequest',
  async ({ requestId, action: requestAction }, { rejectWithValue }) => {
    try {
      const endpoint = requestAction === 'approve' ? 'approve' : 'reject';
      const data = await apiRequest(`${API_BASE}/data-requests/${requestId}/${endpoint}/`, { method: 'POST' });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to process data request.');
    }
  }
);

export const fetchDataBreaches = createAsyncThunk(
  'ndpr/fetchDataBreaches',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
      const data = await apiRequest(`${API_BASE}/data-breaches/${qs.toString() ? '?' + qs.toString() : ''}`);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load data breaches.');
    }
  }
);

export const reportDataBreach = createAsyncThunk(
  'ndpr/reportDataBreach',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/data-breaches/`, { method: 'POST', body: JSON.stringify(payload) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to report data breach.');
    }
  }
);

export const updateBreachStatus = createAsyncThunk(
  'ndpr/updateBreachStatus',
  async ({ breachId, status, updates = {} }, { rejectWithValue }) => {
    try {
      const endpoint = status === 'notify' ? 'notify' : 'update-status';
      const body = endpoint === 'notify' ? {} : { status, ...updates };
      const data = await apiRequest(`${API_BASE}/data-breaches/${breachId}/${endpoint}/`, { method: 'POST', body: JSON.stringify(body) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update breach status.');
    }
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'ndpr/fetchAuditLogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
      const data = await apiRequest(`${API_BASE}/audit-logs/${qs.toString() ? '?' + qs.toString() : ''}`);
      const list = Array.isArray(data) ? data : (data.results || []);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load audit logs.');
    }
  }
);

export const auditDataAccess = createAsyncThunk(
  'ndpr/auditDataAccess',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/audit-logs/`, { method: 'POST', body: JSON.stringify(payload) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to record audit log.');
    }
  }
);

export const fetchComplianceMetrics = createAsyncThunk(
  'ndpr/fetchComplianceMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/compliance-reports/metrics/`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load compliance metrics.');
    }
  }
);

export const generateComplianceReport = createAsyncThunk(
  'ndpr/generateComplianceReport',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/compliance-reports/`, { method: 'POST', body: JSON.stringify(payload) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to generate compliance report.');
    }
  }
);

export const fetchComplianceReports = createAsyncThunk(
  'ndpr/fetchComplianceReports',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => { if (value) qs.append(key, value); });
      const data = await apiRequest(`${API_BASE}/compliance-reports/${qs.toString() ? `?${qs}` : ''}`);
      return Array.isArray(data) ? data : (data.results || []);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load compliance reports.');
    }
  }
);

export const searchComplianceData = (term) => (dispatch) => {
  dispatch(setSearchTerm(term));
};

export const filterComplianceData = (filter) => (dispatch) => {
  dispatch(setFilterBy(filter));
};

const ndprSlice = createSlice({
  name: 'ndpr',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterBy: (state, action) => {
      state.filterBy = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConsentRecords.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchConsentRecords.fulfilled, (state, action) => { state.loading = false; state.consentRecords = action.payload; })
      .addCase(fetchConsentRecords.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createConsentRecord.fulfilled, (state, action) => { state.consentRecords.unshift(action.payload); })
      .addCase(updateConsentRecord.fulfilled, (state, action) => {
        const idx = state.consentRecords.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.consentRecords[idx] = action.payload;
      })
      .addCase(withdrawConsent.fulfilled, (state, action) => {
        const idx = state.consentRecords.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.consentRecords[idx] = action.payload;
      })

      .addCase(fetchDataRequests.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDataRequests.fulfilled, (state, action) => { state.loading = false; state.dataRequests = action.payload; })
      .addCase(fetchDataRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(submitDataRequest.fulfilled, (state, action) => { state.dataRequests.unshift(action.payload); })
      .addCase(processDataRequest.fulfilled, (state, action) => {
        const idx = state.dataRequests.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) state.dataRequests[idx] = action.payload;
      })

      .addCase(fetchDataBreaches.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDataBreaches.fulfilled, (state, action) => { state.loading = false; state.dataBreaches = action.payload; })
      .addCase(fetchDataBreaches.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(reportDataBreach.fulfilled, (state, action) => { state.dataBreaches.unshift(action.payload); })
      .addCase(updateBreachStatus.fulfilled, (state, action) => {
        const idx = state.dataBreaches.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.dataBreaches[idx] = action.payload;
      })

      .addCase(fetchAuditLogs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => { state.loading = false; state.auditLogs = action.payload; })
      .addCase(fetchAuditLogs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(auditDataAccess.fulfilled, (state, action) => { state.auditLogs.unshift(action.payload); })

      .addCase(fetchComplianceMetrics.fulfilled, (state, action) => {
        state.complianceMetrics = { ...state.complianceMetrics, ...action.payload };
      })
      .addCase(fetchComplianceReports.fulfilled, (state, action) => {
        state.complianceReports = action.payload;
      });
  },
});

export const {
  setSearchTerm,
  setFilterBy,
  setError,
  clearError,
} = ndprSlice.actions;

export default ndprSlice.reducer;
