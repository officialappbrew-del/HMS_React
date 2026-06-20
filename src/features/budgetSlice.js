import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const createBudget = createAsyncThunk(
  'budget/createBudget',
  async (budgetData, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.post('/budgets', budgetData);
      // return response.data;

      // Mock implementation
      const newBudget = {
        id: Date.now(),
        ...budgetData,
        status: 'draft',
        createdAt: new Date().toISOString(),
        utilized: 0,
        variance: 0
      };
      return newBudget;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budget/updateBudget',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      // Mock implementation
      return { id, ...updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createForecast = createAsyncThunk(
  'budget/createForecast',
  async (forecastData, { rejectWithValue }) => {
    try {
      // Mock implementation
      const newForecast = {
        id: Date.now(),
        ...forecastData,
        createdAt: new Date().toISOString(),
        accuracy: 0,
        lastUpdated: new Date().toISOString()
      };
      return newForecast;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateForecast = createAsyncThunk(
  'budget/updateForecast',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      // Mock implementation
      return { id, ...updates, lastUpdated: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createGrant = createAsyncThunk(
  'budget/createGrant',
  async (grantData, { rejectWithValue }) => {
    try {
      // Mock implementation
      const newGrant = {
        id: Date.now(),
        ...grantData,
        status: 'active',
        utilized: 0,
        createdAt: new Date().toISOString(),
        lastReportDate: null
      };
      return newGrant;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateGrant = createAsyncThunk(
  'budget/updateGrant',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      // Mock implementation
      return { id, ...updates, lastUpdated: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateBudgetReport = createAsyncThunk(
  'budget/generateBudgetReport',
  async (reportParams, { rejectWithValue }) => {
    try {
      // Mock implementation - would generate and download a report
      console.log('Generating budget report with params:', reportParams);
      return { success: true, message: 'Report generated successfully' };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const monitorBudgetVariance = createAsyncThunk(
  'budget/monitorBudgetVariance',
  async (_, { rejectWithValue }) => {
    try {
      // Mock implementation - would calculate variance data
      const varianceData = {
        overall: 2.3,
        departments: {
          emergency: -2.1,
          surgery: 1.8,
          medicine: -3.2,
          pediatrics: 4.1,
          pharmacy: 2.7,
          laboratory: -1.5
        },
        categories: {
          staff: -2.8,
          drugs: 1.2,
          equipment: -3.1,
          maintenance: 2.4,
          training: 5.2,
          utilities: -1.8
        },
        alerts: [
          { id: 1, type: 'over_budget', department: 'Surgery', variance: 4.1, priority: 'high' },
          { id: 2, type: 'under_budget', department: 'Training', variance: -5.2, priority: 'medium' },
          { id: 3, type: 'on_track', department: 'Equipment', variance: -1.8, priority: 'low' }
        ]
      };
      return varianceData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  budgets: [
    {
      id: 1,
      department: 'Emergency',
      category: 'staff',
      year: 2024,
      period: 'annual',
      amount: 45000000,
      utilized: 38000000,
      description: 'Emergency department staff salaries and benefits',
      status: 'approved',
      approvalRequired: true,
      approvedBy: 'Dr. Adebayo',
      createdAt: '2024-01-15T10:00:00Z',
      variance: -2.1
    },
    {
      id: 2,
      department: 'Surgery',
      category: 'equipment',
      year: 2024,
      period: 'annual',
      amount: 65000000,
      utilized: 52000000,
      description: 'Surgical equipment and maintenance',
      status: 'approved',
      approvalRequired: true,
      approvedBy: 'Dr. Okon',
      createdAt: '2024-01-20T14:30:00Z',
      variance: 1.8
    },
    {
      id: 3,
      department: 'Pharmacy',
      category: 'drugs',
      year: 2024,
      period: 'annual',
      amount: 25000000,
      utilized: 21000000,
      description: 'Essential drugs and medications',
      status: 'approved',
      approvalRequired: true,
      approvedBy: 'Dr. Ibrahim',
      createdAt: '2024-01-25T09:15:00Z',
      variance: 2.7
    }
  ],
  forecasts: [
    {
      id: 1,
      category: 'revenue',
      period: 'quarterly',
      year: 2024,
      predictedAmount: 200000000,
      confidenceLevel: 85,
      assumptions: 'Based on historical data and patient volume growth',
      methodology: 'Regression analysis with seasonal adjustments',
      createdAt: '2024-02-01T11:00:00Z',
      accuracy: 82,
      lastUpdated: '2024-02-15T16:45:00Z'
    },
    {
      id: 2,
      category: 'expenses',
      period: 'quarterly',
      year: 2024,
      predictedAmount: 180000000,
      confidenceLevel: 78,
      assumptions: 'Inflation rate of 15%, staff cost increase of 10%',
      methodology: 'Historical trend analysis',
      createdAt: '2024-02-01T11:30:00Z',
      accuracy: 75,
      lastUpdated: '2024-02-15T17:00:00Z'
    }
  ],
  grants: [
    {
      id: 1,
      name: 'COVID-19 Emergency Response Grant',
      donor: 'World Health Organization',
      amount: 15000000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      purpose: 'Emergency medical supplies and equipment for COVID-19 response',
      conditions: 'Monthly reporting required, funds must be used within 12 months',
      contactPerson: 'Dr. Sarah Johnson',
      reportingFrequency: 'monthly',
      status: 'active',
      utilized: 65,
      createdAt: '2024-01-10T08:00:00Z',
      lastReportDate: '2024-02-01'
    },
    {
      id: 2,
      name: 'Maternal Health Initiative',
      donor: 'Bill & Melinda Gates Foundation',
      amount: 25000000,
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      purpose: 'Improve maternal and child healthcare services',
      conditions: 'Quarterly progress reports, focus on rural communities',
      contactPerson: 'Ms. Grace Adeyemi',
      reportingFrequency: 'quarterly',
      status: 'active',
      utilized: 25,
      createdAt: '2024-02-15T10:30:00Z',
      lastReportDate: null
    }
  ],
  budgetVariance: {
    overall: 2.3,
    departments: {
      emergency: -2.1,
      surgery: 1.8,
      medicine: -3.2,
      pediatrics: 4.1,
      pharmacy: 2.7,
      laboratory: -1.5
    },
    categories: {
      staff: -2.8,
      drugs: 1.2,
      equipment: -3.1,
      maintenance: 2.4,
      training: 5.2,
      utilities: -1.8
    },
    alerts: [
      { id: 1, type: 'over_budget', department: 'Surgery', variance: 4.1, priority: 'high' },
      { id: 2, type: 'under_budget', department: 'Training', variance: -5.2, priority: 'medium' },
      { id: 3, type: 'on_track', department: 'Equipment', variance: -1.8, priority: 'low' }
    ]
  },
  searchTerm: '',
  filterBy: 'all',
  loading: false,
  error: null
};

// Budget slice
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
    },
    updateBudgetUtilization: (state, action) => {
      const { id, utilized } = action.payload;
      const budget = state.budgets.find(b => b.id === id);
      if (budget) {
        budget.utilized = utilized;
        budget.variance = ((utilized - budget.amount) / budget.amount) * 100;
      }
    },
    updateGrantUtilization: (state, action) => {
      const { id, utilized } = action.payload;
      const grant = state.grants.find(g => g.id === id);
      if (grant) {
        grant.utilized = utilized;
      }
    },
    updateForecastAccuracy: (state, action) => {
      const { id, accuracy } = action.payload;
      const forecast = state.forecasts.find(f => f.id === id);
      if (forecast) {
        forecast.accuracy = accuracy;
        forecast.lastUpdated = new Date().toISOString();
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Budget
      .addCase(createBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets.push(action.payload);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Budget
      .addCase(updateBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.budgets.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.budgets[index] = { ...state.budgets[index], ...action.payload };
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Forecast
      .addCase(createForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.forecasts.push(action.payload);
      })
      .addCase(createForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Forecast
      .addCase(updateForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateForecast.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.forecasts.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.forecasts[index] = { ...state.forecasts[index], ...action.payload };
        }
      })
      .addCase(updateForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Grant
      .addCase(createGrant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGrant.fulfilled, (state, action) => {
        state.loading = false;
        state.grants.push(action.payload);
      })
      .addCase(createGrant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Grant
      .addCase(updateGrant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGrant.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.grants.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.grants[index] = { ...state.grants[index], ...action.payload };
        }
      })
      .addCase(updateGrant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Generate Budget Report
      .addCase(generateBudgetReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateBudgetReport.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(generateBudgetReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Monitor Budget Variance
      .addCase(monitorBudgetVariance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(monitorBudgetVariance.fulfilled, (state, action) => {
        state.loading = false;
        state.budgetVariance = action.payload;
      })
      .addCase(monitorBudgetVariance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  searchBudgets,
  filterBudgets,
  clearError,
  updateBudgetUtilization,
  updateGrantUtilization,
  updateForecastAccuracy
} = budgetSlice.actions;

export default budgetSlice.reducer;