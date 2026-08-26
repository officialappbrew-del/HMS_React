import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { financialApi } from '../utils/api';

const asList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

export const fetchFinancialAnalytics = createAsyncThunk(
  'financial/fetchAnalytics',
  async (dateRange = '30d', { rejectWithValue }) => {
    try {
      const response = await financialApi.getAnalytics({ date_range: dateRange });
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch financial analytics');
    }
  }
);

export const fetchBudgets = createAsyncThunk(
  'financial/fetchBudgets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await financialApi.getBudgets();
      return asList(response);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch budgets');
    }
  }
);

export const fetchInvoices = createAsyncThunk(
  'financial/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await financialApi.getInvoices();
      return asList(response);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch invoices');
    }
  }
);

export const createBudget = createAsyncThunk(
  'financial/createBudget',
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await financialApi.createBudget(budgetData);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create budget');
    }
  }
);

const initialState = {
  revenueData: [],
  costData: [],
  cashFlowData: [],
  budgets: [],
  kpis: {
    clinical: {},
    financial: {},
    operational: {}
  },
  dateRange: '30d',
  searchTerm: '',
  filterBy: 'all',
  loading: false,
  error: null,
  stats: {
    totalRevenue: 0,
    totalCosts: 0,
    netProfit: 0,
    profitMargin: 0,
    cashPosition: 0
  },
  analytics: null,
};

const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    searchFinancialData: (state, action) => {
      state.searchTerm = action.payload;
    },
    filterFinancialData: (state, action) => {
      state.filterBy = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.revenueData = [];
      state.costData = [];
      state.cashFlowData = [];
      state.budgets = [];
      state.kpis = { clinical: {}, financial: {}, operational: {} };
      state.stats = {
        totalRevenue: 0,
        totalCosts: 0,
        netProfit: 0,
        profitMargin: 0,
        cashPosition: 0
      };
      state.analytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinancialAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancialAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        state.analytics = data;
        state.stats = data.stats || state.stats;
        state.kpis = data.kpis || state.kpis;
        state.cashFlowData = asList(data.cashFlow);
      })
      .addCase(fetchFinancialAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.budgets = action.payload || [];
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        const invoices = asList(action.payload);
        state.revenueData = invoices.map(invoice => ({
          id: invoice.id,
          date: invoice.invoice_date || invoice.created_at,
          category: invoice.insurance_covered ? 'nhis' : 'private',
          description: `Invoice ${invoice.invoice_number} - ${invoice.patient?.name || 'Unknown'}`,
          amount: parseFloat(invoice.total_amount) || 0,
          growth: 0,
        }));
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload);
      });
  },
});

export const {
  setDateRange,
  searchFinancialData,
  filterFinancialData,
  setLoading,
  setError,
  clearError,
  clearData,
} = financialSlice.actions;

export default financialSlice.reducer;
