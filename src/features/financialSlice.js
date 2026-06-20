import { createSlice } from '@reduxjs/toolkit';

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
  }
};

const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    generateRevenueReport: (state) => {
      // Generate sample revenue data
      const sampleRevenue = [
        {
          id: 'rev-1',
          date: '2024-01-15',
          category: 'nhis',
          description: 'NHIS Capitation Payment - January',
          amount: 8500000,
          growth: 12.5,
          source: 'NHIS'
        },
        {
          id: 'rev-2',
          date: '2024-01-14',
          category: 'private',
          description: 'Private Patient Consultation Fees',
          amount: 3200000,
          growth: 8.3,
          source: 'Private Insurance'
        },
        {
          id: 'rev-3',
          date: '2024-01-13',
          category: 'corporate',
          description: 'Corporate Health Plan Premiums',
          amount: 2800000,
          growth: 15.2,
          source: 'Corporate Clients'
        },
        {
          id: 'rev-4',
          date: '2024-01-12',
          category: 'out_of_pocket',
          description: 'Direct Patient Payments',
          amount: 2100000,
          growth: -5.1,
          source: 'Cash Payments'
        },
        {
          id: 'rev-5',
          date: '2024-01-11',
          category: 'nhis',
          description: 'NHIS Drug Reimbursements',
          amount: 1800000,
          growth: 9.8,
          source: 'NHIS'
        }
      ];

      state.revenueData = sampleRevenue;
      state.stats.totalRevenue = sampleRevenue.reduce((sum, item) => sum + item.amount, 0);
    },

    generateCostAnalysis: (state) => {
      // Generate sample cost data
      const sampleCosts = [
        {
          id: 'cost-1',
          date: '2024-01-15',
          category: 'staff',
          description: 'Monthly Staff Salaries',
          amount: 35000000,
          budget: 36000000,
          variance: -2.8
        },
        {
          id: 'cost-2',
          date: '2024-01-14',
          category: 'drugs',
          description: 'Pharmaceutical Supplies',
          amount: 18000000,
          budget: 17500000,
          variance: 2.9
        },
        {
          id: 'cost-3',
          date: '2024-01-13',
          category: 'equipment',
          description: 'Medical Equipment Maintenance',
          amount: 12000000,
          budget: 11500000,
          variance: 4.3
        },
        {
          id: 'cost-4',
          date: '2024-01-12',
          category: 'overhead',
          description: 'Utility Bills and Overhead',
          amount: 10000000,
          budget: 10500000,
          variance: -4.8
        },
        {
          id: 'cost-5',
          date: '2024-01-11',
          category: 'maintenance',
          description: 'Facility Maintenance',
          amount: 3500000,
          budget: 4000000,
          variance: -12.5
        }
      ];

      state.costData = sampleCosts;
      state.stats.totalCosts = sampleCosts.reduce((sum, item) => sum + item.amount, 0);
      state.stats.netProfit = state.stats.totalRevenue - state.stats.totalCosts;
      state.stats.profitMargin = state.stats.totalRevenue > 0
        ? ((state.stats.netProfit / state.stats.totalRevenue) * 100)
        : 0;
    },

    updateCashFlowProjection: (state, action) => {
      const { projections } = action.payload;
      state.cashFlowData = projections;
    },

    createBudget: (state, action) => {
      const budget = {
        id: `budget-${Date.now()}`,
        ...action.payload,
        utilized: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.budgets.push(budget);
    },

    updateBudget: (state, action) => {
      const { budgetId, updates } = action.payload;
      const budgetIndex = state.budgets.findIndex(b => b.id === budgetId);
      if (budgetIndex !== -1) {
        state.budgets[budgetIndex] = {
          ...state.budgets[budgetIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    generateFinancialKPIs: (state) => {
      state.kpis = {
        clinical: {
          bedOccupancyRate: 87,
          averageLengthOfStay: 4.2,
          patientSatisfaction: 94,
          readmissionRate: 3.1,
          infectionRate: 0.8
        },
        financial: {
          revenuePerBed: 850000,
          costPerPatient: 18500,
          operatingMargin: 18.5,
          roi: 24.3,
          debtToEquityRatio: 0.3
        },
        operational: {
          averageWaitTime: 23,
          staffProductivity: 92,
          equipmentUtilization: 78,
          errorRate: 0.8,
          patientThroughput: 145
        }
      };
    },

    exportFinancialReport: (state, action) => {
      const { reportType, dateRange } = action.payload;
      // In a real app, this would trigger a download
      console.log(`Exporting ${reportType} report for ${dateRange}`);
    },

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

    // Initialize with sample data
    initializeSampleData: (state) => {
      // Initialize budgets
      const sampleBudgets = [
        {
          id: 'budget-1',
          department: 'Emergency Department',
          category: 'staff',
          amount: 15000000,
          period: 'monthly',
          year: 2024,
          description: 'Emergency department staffing costs including doctors, nurses, and support staff',
          utilized: 78
        },
        {
          id: 'budget-2',
          department: 'Pharmacy',
          category: 'drugs',
          amount: 25000000,
          period: 'monthly',
          year: 2024,
          description: 'Monthly drug procurement and inventory costs',
          utilized: 85
        },
        {
          id: 'budget-3',
          department: 'Laboratory',
          category: 'equipment',
          amount: 8000000,
          period: 'quarterly',
          year: 2024,
          description: 'Laboratory equipment maintenance and calibration',
          utilized: 45
        },
        {
          id: 'budget-4',
          department: 'Administration',
          category: 'overhead',
          amount: 12000000,
          period: 'monthly',
          year: 2024,
          description: 'Administrative overhead including utilities, internet, and office supplies',
          utilized: 92
        }
      ];

      state.budgets = sampleBudgets;

      // Initialize cash flow data
      const sampleCashFlow = [
        { month: 'Jan', inflow: 52000000, outflow: 48000000, balance: 4000000 },
        { month: 'Feb', inflow: 55000000, outflow: 49000000, balance: 4600000 },
        { month: 'Mar', inflow: 58000000, outflow: 51000000, balance: 5300000 },
        { month: 'Apr', inflow: 60000000, outflow: 52000000, balance: 6100000 },
        { month: 'May', inflow: 62000000, outflow: 53000000, balance: 7000000 },
        { month: 'Jun', inflow: 65000000, outflow: 54000000, balance: 8100000 }
      ];

      state.cashFlowData = sampleCashFlow;
      state.stats.cashPosition = 45200000;

      // Generate initial reports
      financialSlice.caseReducers.generateRevenueReport(state);
      financialSlice.caseReducers.generateCostAnalysis(state);
      financialSlice.caseReducers.generateFinancialKPIs(state);
    }
  }
});

export const {
  generateRevenueReport,
  generateCostAnalysis,
  updateCashFlowProjection,
  createBudget,
  updateBudget,
  generateFinancialKPIs,
  exportFinancialReport,
  setDateRange,
  searchFinancialData,
  filterFinancialData,
  setLoading,
  setError,
  clearError,
  initializeSampleData
} = financialSlice.actions;

export default financialSlice.reducer;