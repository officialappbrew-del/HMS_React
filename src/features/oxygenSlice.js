import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  oxygenConcentrators: [],
  oxygenCylinders: [],
  gasPipelines: [],
  usageAnalytics: [],
  filteredOxygen: [],
  currentOxygen: null,
  loading: false,
  error: null,
  searchTerm: '',
  filterBy: 'all',
  sortBy: 'name',
  totalCylinders: 0,
  activeConcentrators: 0,
  lowPressureAlerts: [],
  alerts: [],
  usageByWard: {},
  totalConsumption: 0,
};

const oxygenSlice = createSlice({
  name: 'oxygen',
  initialState,
  reducers: {
    setOxygenConcentrators: (state, action) => {
      state.oxygenConcentrators = action.payload;
      updateFilteredOxygen(state);
    },

    addOxygenConcentrator: (state, action) => {
      const existingIndex = state.oxygenConcentrators.findIndex(c => c.id === action.payload.id);
      if (existingIndex === -1) {
        state.oxygenConcentrators.unshift(action.payload);
        updateFilteredOxygen(state);
      }
    },

    updateOxygenConcentrator: (state, action) => {
      const index = state.oxygenConcentrators.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.oxygenConcentrators[index] = {
          ...state.oxygenConcentrators[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        updateFilteredOxygen(state);
      }
    },

    deleteOxygenConcentrator: (state, action) => {
      state.oxygenConcentrators = state.oxygenConcentrators.filter(c => c.id !== action.payload);
      updateFilteredOxygen(state);
    },

    setOxygenCylinders: (state, action) => {
      state.oxygenCylinders = action.payload;
      updateFilteredOxygen(state);
    },

    addOxygenCylinder: (state, action) => {
      const existingIndex = state.oxygenCylinders.findIndex(c => c.id === action.payload.id);
      if (existingIndex === -1) {
        state.oxygenCylinders.unshift(action.payload);
        updateFilteredOxygen(state);
      }
    },

    updateOxygenCylinder: (state, action) => {
      const index = state.oxygenCylinders.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.oxygenCylinders[index] = {
          ...state.oxygenCylinders[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        updateFilteredOxygen(state);
      }
    },

    deleteOxygenCylinder: (state, action) => {
      state.oxygenCylinders = state.oxygenCylinders.filter(c => c.id !== action.payload);
      updateFilteredOxygen(state);
    },

    refillCylinder: (state, action) => {
      const { cylinderId, pressure, supplier, cost, notes } = action.payload;
      const index = state.oxygenCylinders.findIndex(c => c.id === cylinderId);
      if (index !== -1) {
        state.oxygenCylinders[index].currentPressure = parseFloat(pressure);
        state.oxygenCylinders[index].lastRefill = new Date().toISOString();
        state.oxygenCylinders[index].status = 'full';
        state.oxygenCylinders[index].refillHistory = [
          ...(state.oxygenCylinders[index].refillHistory || []),
          {
            pressure: parseFloat(pressure),
            supplier,
            cost: parseFloat(cost),
            notes,
            date: new Date().toISOString(),
          }
        ];
        updateFilteredOxygen(state);
      }
    },

    useCylinder: (state, action) => {
      const { cylinderId, ward, patientId, usage, notes } = action.payload;
      const index = state.oxygenCylinders.findIndex(c => c.id === cylinderId);
      if (index !== -1 && state.oxygenCylinders[index].currentPressure >= usage) {
        state.oxygenCylinders[index].currentPressure -= usage;
        state.oxygenCylinders[index].usageHistory = [
          ...(state.oxygenCylinders[index].usageHistory || []),
          {
            ward,
            patientId,
            usage,
            notes,
            date: new Date().toISOString(),
          }
        ];

        // Update usage analytics
        const usageRecord = {
          id: Date.now(),
          type: 'cylinder',
          cylinderId,
          ward,
          patientId,
          usage,
          timestamp: new Date().toISOString(),
        };
        state.usageAnalytics.unshift(usageRecord);

        updateFilteredOxygen(state);
      }
    },

    setGasPipelines: (state, action) => {
      state.gasPipelines = action.payload;
      updateFilteredOxygen(state);
    },

    addGasPipeline: (state, action) => {
      const existingIndex = state.gasPipelines.findIndex(p => p.id === action.payload.id);
      if (existingIndex === -1) {
        state.gasPipelines.unshift(action.payload);
        updateFilteredOxygen(state);
      }
    },

    updateGasPipeline: (state, action) => {
      const index = state.gasPipelines.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.gasPipelines[index] = {
          ...state.gasPipelines[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        updateFilteredOxygen(state);
      }
    },

    monitorPipelinePressure: (state, action) => {
      const { pipelineId, pressure, temperature, flowRate, notes } = action.payload;
      const index = state.gasPipelines.findIndex(p => p.id === pipelineId);
      if (index !== -1) {
        state.gasPipelines[index].currentPressure = parseFloat(pressure);
        state.gasPipelines[index].currentTemperature = parseFloat(temperature);
        state.gasPipelines[index].currentFlowRate = parseFloat(flowRate);
        state.gasPipelines[index].lastMonitored = new Date().toISOString();
        state.gasPipelines[index].monitoringHistory = [
          ...(state.gasPipelines[index].monitoringHistory || []),
          {
            pressure: parseFloat(pressure),
            temperature: parseFloat(temperature),
            flowRate: parseFloat(flowRate),
            notes,
            timestamp: new Date().toISOString(),
          }
        ];
        updateFilteredOxygen(state);
      }
    },

    useConcentrator: (state, action) => {
      const { concentratorId, ward, patientId, hoursUsed, notes } = action.payload;
      const index = state.oxygenConcentrators.findIndex(c => c.id === concentratorId);
      if (index !== -1) {
        state.oxygenConcentrators[index].totalRunHours = (state.oxygenConcentrators[index].totalRunHours || 0) + parseFloat(hoursUsed);
        state.oxygenConcentrators[index].usageHistory = [
          ...(state.oxygenConcentrators[index].usageHistory || []),
          {
            ward,
            patientId,
            hoursUsed: parseFloat(hoursUsed),
            notes,
            date: new Date().toISOString(),
          }
        ];

        // Update usage analytics
        const usageRecord = {
          id: Date.now(),
          type: 'concentrator',
          concentratorId,
          ward,
          patientId,
          usage: parseFloat(hoursUsed),
          timestamp: new Date().toISOString(),
        };
        state.usageAnalytics.unshift(usageRecord);

        updateFilteredOxygen(state);
      }
    },

    searchOxygen: (state, action) => {
      state.searchTerm = action.payload;
      updateFilteredOxygen(state);
    },

    filterOxygen: (state, action) => {
      state.filterBy = action.payload;
      updateFilteredOxygen(state);
    },

    sortOxygen: (state, action) => {
      state.sortBy = action.payload;
      updateFilteredOxygen(state);
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

    setCurrentOxygen: (state, action) => {
      state.currentOxygen = action.payload;
    },

    addAlert: (state, action) => {
      const alert = {
        id: Date.now(),
        ...action.payload,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      state.alerts.push(alert);
      updateFilteredOxygen(state);
    },

    acknowledgeAlert: (state, action) => {
      const alert = state.alerts.find(a => a.id === action.payload.alertId);
      if (alert) {
        alert.status = 'acknowledged';
        alert.acknowledgedAt = new Date().toISOString();
      }
      updateFilteredOxygen(state);
    },

    updateCylinderStatus: (state, action) => {
      const { cylinderId, assignedTo, status } = action.payload;
      const cylinder = state.oxygenCylinders.find(c => c.id === cylinderId);
      if (cylinder) {
        cylinder.assignedTo = assignedTo;
        cylinder.status = status;
        cylinder.updatedAt = new Date().toISOString();
      }
      updateFilteredOxygen(state);
    },

    updatePipelineStatus: (state, action) => {
      const { pipelineId, status } = action.payload;
      const pipeline = state.gasPipelines.find(p => p.id === pipelineId);
      if (pipeline) {
        pipeline.status = status;
        pipeline.updatedAt = new Date().toISOString();
      }
      updateFilteredOxygen(state);
    },

    logUsage: (state, action) => {
      const { ward, concentratorId, cylinderId, hoursUsed, patientId } = action.payload;
      const usageRecord = {
        id: Date.now(),
        type: concentratorId ? 'concentrator' : 'cylinder',
        concentratorId,
        cylinderId,
        ward,
        patientId,
        usage: parseFloat(hoursUsed),
        timestamp: new Date().toISOString(),
      };
      state.usageAnalytics.unshift(usageRecord);

      // Update cylinder if used
      if (cylinderId) {
        const cylinder = state.oxygenCylinders.find(c => c.id === cylinderId);
        if (cylinder) {
          cylinder.currentPressure -= parseFloat(hoursUsed) * 10; // Assume some consumption rate
          cylinder.lastUsed = new Date().toISOString();
        }
      }

      updateFilteredOxygen(state);
    },

    generateOxygenReport: (state) => {
      const report = {
        totalConcentrators: state.oxygenConcentrators.length,
        activeConcentrators: state.activeConcentrators,
        totalCylinders: state.totalCylinders,
        fullCylinders: state.oxygenCylinders.filter(c => c.status === 'full').length,
        lowPressureCylinders: state.oxygenCylinders.filter(c => c.currentPressure <= c.minPressure).length,
        totalPipelines: state.gasPipelines.length,
        activePipelines: state.gasPipelines.filter(p => p.status === 'active').length,
        totalConsumption: state.totalConsumption,
        usageByWard: state.usageByWard,
        lowPressureAlerts: state.lowPressureAlerts.length,
        oxygenConcentrators: state.oxygenConcentrators,
        oxygenCylinders: state.oxygenCylinders,
        gasPipelines: state.gasPipelines,
        usageAnalytics: state.usageAnalytics,
        generatedAt: new Date().toISOString(),
      };
      console.log('Oxygen report:', report);
      return report;
    },
  },
});

// Helper function to update filtered oxygen
const updateFilteredOxygen = (state) => {
  // Combine all oxygen-related items for filtering
  const allItems = [
    ...state.oxygenConcentrators.map(c => ({ ...c, type: 'concentrator' })),
    ...state.oxygenCylinders.map(c => ({ ...c, type: 'cylinder' })),
    ...state.gasPipelines.map(p => ({ ...p, type: 'pipeline' })),
  ];

  let filtered = allItems;

  // Filter by search term
  if (state.searchTerm) {
    const searchTerm = state.searchTerm.toLowerCase();
    filtered = filtered.filter(item =>
      item.name?.toLowerCase().includes(searchTerm) ||
      item.serialNumber?.toLowerCase().includes(searchTerm) ||
      item.location?.toLowerCase().includes(searchTerm) ||
      item.ward?.toLowerCase().includes(searchTerm) ||
      item.model?.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by type/status
  if (state.filterBy !== 'all') {
    if (state.filterBy === 'concentrator' || state.filterBy === 'cylinder' || state.filterBy === 'pipeline') {
      filtered = filtered.filter(item => item.type === state.filterBy);
    } else if (state.filterBy === 'active' || state.filterBy === 'inactive' || state.filterBy === 'maintenance') {
      filtered = filtered.filter(item => item.status === state.filterBy);
    }
  }

  // Apply sorting
  switch (state.sortBy) {
    case 'name':
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'location':
      filtered.sort((a, b) => (a.location || '').localeCompare(b.location || ''));
      break;
    case 'status':
      filtered.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
      break;
    case 'pressure':
      filtered.sort((a, b) => (b.currentPressure || 0) - (a.currentPressure || 0));
      break;
    default:
      break;
  }

  state.filteredOxygen = filtered;

  // Update totals and analytics
  state.totalCylinders = state.oxygenCylinders.length;
  state.activeConcentrators = state.oxygenConcentrators.filter(c => c.status === 'active').length;

  // Update low pressure alerts
  state.lowPressureAlerts = [
    ...state.oxygenCylinders.filter(c => c.currentPressure <= c.minPressure),
    ...state.gasPipelines.filter(p => p.currentPressure <= p.minPressure),
  ];

  // Calculate usage by ward
  state.usageByWard = state.usageAnalytics.reduce((acc, record) => {
    const ward = record.ward;
    if (!acc[ward]) {
      acc[ward] = { cylinders: 0, concentrators: 0, total: 0 };
    }
    if (record.type === 'cylinder') {
      acc[ward].cylinders += record.usage;
    } else {
      acc[ward].concentrators += record.usage;
    }
    acc[ward].total += record.usage;
    return acc;
  }, {});

  // Calculate total consumption
  state.totalConsumption = state.usageAnalytics.reduce((sum, record) => sum + record.usage, 0);
};

export const {
  setOxygenConcentrators,
  addOxygenConcentrator,
  updateOxygenConcentrator,
  deleteOxygenConcentrator,
  setOxygenCylinders,
  addOxygenCylinder,
  updateOxygenCylinder,
  deleteOxygenCylinder,
  refillCylinder,
  useCylinder,
  setGasPipelines,
  addGasPipeline,
  updateGasPipeline,
  monitorPipelinePressure,
  useConcentrator,
  updateCylinderStatus,
  updatePipelineStatus,
  logUsage,
  addAlert,
  acknowledgeAlert,
  searchOxygen,
  filterOxygen,
  sortOxygen,
  setLoading,
  setError,
  clearError,
  setCurrentOxygen,
  generateOxygenReport,
} = oxygenSlice.actions;

export default oxygenSlice.reducer;