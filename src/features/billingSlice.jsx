import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest, parseListResponse } from '../utils/api';

const API_BASE = '/api/v1/billing';

const initialState = {
  invoices: [],
  payments: [],
  claims: [],
  auditLogs: [],
  summary: {
    total_invoices: 0,
    total_revenue: 0,
    total_paid: 0,
    total_pending: 0,
    collection_rate: 0,
  },
  loading: false,
  error: null,
};

export const fetchInvoices = createAsyncThunk(
  'billing/fetchInvoices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
      const data = await apiRequest(`${API_BASE}/invoices/${qs.toString() ? '?' + qs.toString() : ''}`);
      const list = parseListResponse(data);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load invoices.');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'billing/createInvoice',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/invoices/`, { method: 'POST', body: JSON.stringify(payload) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create invoice.');
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'billing/updateInvoice',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/invoices/${id}/`, { method: 'PATCH', body: JSON.stringify(updates) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update invoice.');
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'billing/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await apiRequest(`${API_BASE}/invoices/${id}/`, { method: 'DELETE' });
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete invoice.');
    }
  }
);

export const issueInvoice = createAsyncThunk(
  'billing/issueInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/invoices/${id}/issue/`, { method: 'POST' });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to issue invoice.');
    }
  }
);

export const cancelInvoice = createAsyncThunk(
  'billing/cancelInvoice',
  async (id, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/invoices/${id}/cancel/`, { method: 'POST' });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to cancel invoice.');
    }
  }
);

export const fetchPayments = createAsyncThunk(
  'billing/fetchPayments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
      const data = await apiRequest(`${API_BASE}/payments/${qs.toString() ? '?' + qs.toString() : ''}`);
      const list = parseListResponse(data);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load payments.');
    }
  }
);

export const createPayment = createAsyncThunk(
  'billing/createPayment',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/payments/`, { method: 'POST', body: JSON.stringify(payload) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create payment.');
    }
  }
);

export const fetchInsuranceClaims = createAsyncThunk(
  'billing/fetchInsuranceClaims',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
      const data = await apiRequest(`${API_BASE}/insurance-claims/${qs.toString() ? '?' + qs.toString() : ''}`);
      const list = parseListResponse(data);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load insurance claims.');
    }
  }
);

export const createInsuranceClaim = createAsyncThunk(
  'billing/createInsuranceClaim',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/insurance-claims/`, { method: 'POST', body: JSON.stringify(payload) });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create insurance claim.');
    }
  }
);

export const submitInsuranceClaim = createAsyncThunk(
  'billing/submitInsuranceClaim',
  async (id, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/insurance-claims/${id}/submit/`, { method: 'POST' });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to submit insurance claim.');
    }
  }
);

export const approveClaim = createAsyncThunk(
  'billing/approveClaim',
  async ({ id, approved_amount }, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/insurance-claims/${id}/approve/`, {
        method: 'POST',
        body: JSON.stringify({ approved_amount })
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to approve claim.');
    }
  }
);

export const rejectClaim = createAsyncThunk(
  'billing/rejectClaim',
  async ({ id, rejection_reason }, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/insurance-claims/${id}/reject/`, {
        method: 'POST',
        body: JSON.stringify({ rejection_reason })
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to reject claim.');
    }
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'billing/fetchAuditLogs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v) qs.append(k, v); });
      const data = await apiRequest(`${API_BASE}/audit-logs/${qs.toString() ? '?' + qs.toString() : ''}`);
      const list = parseListResponse(data);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load audit logs.');
    }
  }
);

export const fetchInvoiceSummary = createAsyncThunk(
  'billing/fetchInvoiceSummary',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest(`${API_BASE}/invoices/summary/`);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load invoice summary.');
    }
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload);
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const idx = state.invoices.findIndex(i => i.id === action.payload.id);
        if (idx !== -1) state.invoices[idx] = action.payload;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(i => i.id !== action.payload);
      })
      .addCase(issueInvoice.fulfilled, (state, action) => {
        const idx = state.invoices.findIndex(i => i.id === action.payload.id);
        if (idx !== -1) state.invoices[idx] = action.payload;
      })
      .addCase(cancelInvoice.fulfilled, (state, action) => {
        const idx = state.invoices.findIndex(i => i.id === action.payload.id);
        if (idx !== -1) state.invoices[idx] = action.payload;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.unshift(action.payload);
      })
      .addCase(fetchInsuranceClaims.fulfilled, (state, action) => {
        state.claims = action.payload;
        state.error = null;
      })
      .addCase(createInsuranceClaim.fulfilled, (state, action) => {
        state.claims.unshift(action.payload);
      })
      .addCase(submitInsuranceClaim.fulfilled, (state, action) => {
        const idx = state.claims.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.claims[idx] = action.payload;
      })
      .addCase(approveClaim.fulfilled, (state, action) => {
        const idx = state.claims.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.claims[idx] = action.payload;
      })
      .addCase(rejectClaim.fulfilled, (state, action) => {
        const idx = state.claims.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.claims[idx] = action.payload;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogs = action.payload;
        state.error = null;
      })
      .addCase(fetchInvoiceSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      });
  },
});

export const { setError, clearError } = billingSlice.actions;
export default billingSlice.reducer;
