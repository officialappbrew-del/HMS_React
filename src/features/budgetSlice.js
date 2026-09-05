import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { financialApi } from '../utils/api';

const asList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const normalizeBudget = (item) => {
  if (!item || typeof item !== 'object') return item;
  const { id, department, category, year, period, amount, utilized, variance, description, status, approval_required, approved_by, start_date, end_date, created_at, updated_at } = item;
  return {
    ...item,
    id: id ?? item.id,
    department: department ?? '',
    category: category ?? '',
    year: Number(year) || new Date().getFullYear(),
    period: period || 'annual',
    amount: Number(amount) || 0,
    utilized: Number(utilized) || 0,
    variance: Number(variance) || 0,
    description: description || '',
    status: status || 'draft',
    approvalRequired: approval_required ?? false,
    approvedBy: approved_by || '',
    startDate: start_date || '',
    endDate: end_date || '',
    createdAt: created_at || '',
    updatedAt: updated_at || '',
  };
};

const normalizeForecast = (item) => {
  if (!item || typeof item !== 'object') return item;
  const { id, category, period, year, predicted_amount, confidence_level, assumptions, methodology, accuracy, actual_amount, created_at, updated_at } = item;
  return {
    ...item,
    id: id ?? item.id,
    category: category ?? '',
    period: period || 'quarterly',
    year: Number(year) || new Date().getFullYear(),
    predictedAmount: Number(predicted_amount) || 0,
    confidenceLevel: Number(confidence_level) || 0,
    assumptions: assumptions || '',
    methodology: methodology || '',
    accuracy: Number(accuracy) || 0,
    actualAmount: Number(actual_amount) || 0,
    createdAt: created_at || '',
    updatedAt: updated_at || '',
  };
};

const normalizeGrant = (item) => {
  if (!item || typeof item !== 'object') return item;
  const { id, name, donor, amount, start_date, end_date, purpose, conditions, contact_person, reporting_frequency, status, utilized, last_report_date, created_at, updated_at } = item;
  return {
    ...item,
    id: id ?? item.id,
    name: name || '',
    donor: donor || '',
    amount: Number(amount) || 0,
    startDate: start_date || '',
    endDate: end_date || '',
    purpose: purpose || '',
    conditions: conditions || '',
    contactPerson: contact_person || '',
    reportingFrequency: reporting_frequency || 'quarterly',
    status: status || 'active',
    utilized: Number(utilized) || 0,
    lastReportDate: last_report_date || '',
    createdAt: created_at || '',
    updatedAt: updated_at || '',
  };
};

const normalizeVariance = (item) => {
  if (!item || typeof item !== 'object') return item;
  const { id, budget, budget_name, period, year, planned_amount, actual_amount, variance_amount, variance_percentage, notes, alert_triggered, created_at, updated_at } = item;
  return {
    ...item,
    id: id ?? item.id,
    budgetId: typeof budget === 'object' ? (budget?.id ?? budget) : budget,
    budgetName: budget_name || '',
    period: period || '',
    year: Number(year) || new Date().getFullYear(),
    plannedAmount: Number(planned_amount) || 0,
    actualAmount: Number(actual_amount) || 0,
    varianceAmount: Number(variance_amount) || 0,
    variancePercentage: Number(variance_percentage) || 0,
    notes: notes || '',
    alertTriggered: Boolean(alert_triggered),
    createdAt: created_at || '',
    updatedAt: updated_at || '',
  };
};

const normalizeReport = (item) => {
  if (!item || typeof item !== 'object') return item;
  const { id, report_type, title, period_start, period_end, generated_by, file_path, summary, created_at, updated_at } = item;
  return {
    ...item,
    id: id ?? item.id,
    reportType: report_type || '',
    title: title || '',
    periodStart: period_start || '',
    periodEnd: period_end || '',
    generatedBy: generated_by || '',
    filePath: file_path || '',
    summary: summary || '',
    createdAt: created_at || '',
    updatedAt: updated_at || '',
  };
};

export const fetchBudgets = createAsyncThunk(
  'budget/fetchBudgets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await financialApi.getBudgets();
      const list = asList(response);
      return list.map(normalizeBudget);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch budgets');
    }
  }
);

export const fetchBudget = createAsyncThunk(
  'budget/fetchBudget',
  async (id, { rejectWithValue }) => {
    try {
      const response = await financialApi.getBudget(id);
      return normalizeBudget(response);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch budget');
    }
  }
);

export const createBudget = createAsyncThunk(
  'budget/createBudget',
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await financialApi.createBudget(budgetData);
      return normalizeBudget(response);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create budget');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budget/updateBudget',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await financialApi.updateBudget(id, updates);
      return normalizeBudget(response);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update budget');
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budget/deleteBudget',
  async (id, { rejectWithValue }) => {
    try {
      await financialApi.deleteBudget(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete budget');
    }
  }
);

export const fetchBudgetSummary = createAsyncThunk(
  'budget/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await financialApi.getBudgetSummary();
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch budget summary');
    }
  }
);

export const fetchForecasts = createAsyncThunk(
  'budget/fetchForecasts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await financialApi.getForecasts();
      const list = asList(response);
      return list.map(normalizeForecast);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch forecasts');
    }
  }
);

export const createForecast = createAsyncThunk(
  'budget/createForecast',
  async (forecastData, { rejectWithValue }) => {
    try {
      const response = await financialApi.createForecast(forecastData);
      return normalizeForecast(response);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create forecast');
    }
  }
);

export const updateForecast = createAsyncThunk(
  'budget/updateForecast',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await financialApi.updateForecast(id, updates);
      return normalizeForecast(response);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update forecast');
    }
  }
);

export const deleteForecast = createAsyncThunk(
  'budget/deleteForecast',
  async (id, { rejectWithValue }) => {
    try {
      await financialApi.deleteForecast(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete forecast');
    }
  }
);

export const fetchGrants = createAsyncThunk(
  'budget/fetchGrants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await financialApi.getGrants();
      const list = asList(response);
      return list.map(normalizeGrant);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch grants');
    }
  }
);

export const createGrant = createAsyncThunk(
  'budget/createGrant',
  async (grantData, { rejectWithValue }) => {
    try {
      const response = await financialApi.createGrant(grantData);
      return normalizeGrant(response);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create grant');
    }
  }
);

export const updateGrant = createAsyncThunk(
  'budget/updateGrant',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await financialApi.updateGrant(id, updates);
      return normalizeGrant(response);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update grant');
    }
  }
);

export const deleteGrant = createAsyncThunk(
  'budget/deleteGrant',
  async (id, { rejectWithValue }) => {
    try {
      await financialApi.deleteGrant(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete grant');
    }
  }
);

export const fetchVariances = createAsyncThunk(
  'budget/fetchVariances',
  async (_, { rejectWithValue }) => {
    try {
      const response = await financialApi.getVariances();
      const list = asList(response);
      return list.map(normalizeVariance);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch budget variances');
    }
  }
);

export const fetchReports = createAsyncThunk(
  'budget/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await financialApi.getReports();
      const list = asList(response);
      return list.map(normalizeReport);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch budget reports');
    }
  }
);

export const createReport = createAsyncThunk(
  'budget/createReport',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await financialApi.createReport(reportData);
      return normalizeReport(response);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create report');
    }
  }
);

const initialState = {
  budgets: [],
  forecasts: [],
  grants: [],
  variances: [],
  reports: [],
  budgetSummary: null,
  searchTerm: '',
  filterBy: 'all',
  loading: false,
  error: null
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    searchBudgets: (state, action) => {
      state.searchTerm = action.payload;
    },
    filterBudgets: (state, action) => {
      state.filterBy = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload || [];
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.budgets.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets.push(action.payload);
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.budgets.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = state.budgets.filter(b => b.id !== action.payload);
      })
      .addCase(fetchBudgetSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.budgetSummary = action.payload;
      })
      .addCase(fetchForecasts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecasts.fulfilled, (state, action) => {
        state.loading = false;
        state.forecasts = action.payload || [];
      })
      .addCase(fetchForecasts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.forecasts.push(action.payload);
      })
      .addCase(updateForecast.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.forecasts.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.forecasts[index] = action.payload;
        }
      })
      .addCase(deleteForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.forecasts = state.forecasts.filter(f => f.id !== action.payload);
      })
      .addCase(fetchGrants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGrants.fulfilled, (state, action) => {
        state.loading = false;
        state.grants = action.payload || [];
      })
      .addCase(fetchGrants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGrant.fulfilled, (state, action) => {
        state.loading = false;
        state.grants.push(action.payload);
      })
      .addCase(updateGrant.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.grants.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.grants[index] = action.payload;
        }
      })
      .addCase(deleteGrant.fulfilled, (state, action) => {
        state.loading = false;
        state.grants = state.grants.filter(g => g.id !== action.payload);
      })
      .addCase(fetchVariances.fulfilled, (state, action) => {
        state.loading = false;
        state.variances = action.payload || [];
      })
      .addCase(fetchVariances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload || [];
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
      });
  }
});

export const {
  searchBudgets,
  filterBudgets,
  clearError
} = budgetSlice.actions;

export default budgetSlice.reducer;
