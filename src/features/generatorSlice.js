import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  generators: [],
  runHours: [],
  fuelConsumption: [],
  powerOutages: [],
  fuelInventory: [],
  maintenanceAlerts: [],
  filteredGenerators: [],
  currentGenerator: null,
  loading: false,
  error: null,
  searchTerm: '',
  filterBy: 'all',
  sortBy: 'name',
  totalRunHours: 0,
  totalFuelConsumed: 0,
  activeOutages: [],
  lowFuelAlerts: [],
};

const generatorSlice = createSlice({
  name: 'generator',
  initialState,
  reducers: {
    setGenerators: (state, action) => {
      state.generators = action.payload;
      updateFilteredGenerators(state);
    },

    addGenerator: (state, action) => {
      const existingIndex = state.generators.findIndex(g => g.id === action.payload.id);
      if (existingIndex === -1) {
        state.generators.unshift(action.payload);
        updateFilteredGenerators(state);
      }
    },

    updateGenerator: (state, action) => {
      const index = state.generators.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.generators[index] = {
          ...state.generators[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        updateFilteredGenerators(state);
      }
    },

    deleteGenerator: (state, action) => {
      state.generators = state.generators.filter(g => g.id !== action.payload);
      updateFilteredGenerators(state);
    },

    logRunHours: (state, action) => {
      const { generatorId, hours, startTime, endTime, operator, notes } = action.payload;
      const runHourRecord = {
        id: Date.now(),
        generatorId,
        hours: parseFloat(hours),
        startTime,
        endTime,
        operator,
        notes,
        loggedAt: new Date().toISOString(),
      };
      state.runHours.unshift(runHourRecord);

      // Update generator's total run hours
      const generatorIndex = state.generators.findIndex(g => g.id === generatorId);
      if (generatorIndex !== -1) {
        state.generators[generatorIndex].totalRunHours = (state.generators[generatorIndex].totalRunHours || 0) + parseFloat(hours);
        state.generators[generatorIndex].lastRun = new Date().toISOString();
      }

      updateFilteredGenerators(state);
    },

    logFuelConsumption: (state, action) => {
      const { generatorId, fuelType, quantity, cost, supplier, notes } = action.payload;
      const fuelRecord = {
        id: Date.now(),
        generatorId,
        fuelType,
        quantity: parseFloat(quantity),
        cost: parseFloat(cost),
        supplier,
        notes,
        loggedAt: new Date().toISOString(),
      };
      state.fuelConsumption.unshift(fuelRecord);

      // Update fuel inventory
      const fuelIndex = state.fuelInventory.findIndex(f => f.type === fuelType);
      if (fuelIndex !== -1) {
        state.fuelInventory[fuelIndex].quantity -= parseFloat(quantity);
        state.fuelInventory[fuelIndex].lastConsumption = new Date().toISOString();
      }

      updateFilteredGenerators(state);
    },

    logPowerOutage: (state, action) => {
      const { startTime, endTime, cause, affectedAreas, generatorUsed, notes } = action.payload;
      const outageRecord = {
        id: Date.now(),
        startTime,
        endTime,
        duration: endTime ? (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60) : null, // hours
        cause,
        affectedAreas,
        generatorUsed,
        status: endTime ? 'resolved' : 'active',
        notes,
        loggedAt: new Date().toISOString(),
      };
      state.powerOutages.unshift(outageRecord);
      updateFilteredGenerators(state);
    },

    resolvePowerOutage: (state, action) => {
      const { outageId, endTime, resolutionNotes } = action.payload;
      const index = state.powerOutages.findIndex(o => o.id === outageId);
      if (index !== -1) {
        state.powerOutages[index] = {
          ...state.powerOutages[index],
          endTime,
          duration: (new Date(endTime) - new Date(state.powerOutages[index].startTime)) / (1000 * 60 * 60),
          status: 'resolved',
          resolutionNotes,
          resolvedAt: new Date().toISOString(),
        };
        updateFilteredGenerators(state);
      }
    },

    addFuelInventory: (state, action) => {
      const existingIndex = state.fuelInventory.findIndex(f => f.id === action.payload.id);
      if (existingIndex === -1) {
        state.fuelInventory.unshift(action.payload);
        updateFilteredGenerators(state);
      }
    },

    updateFuelInventory: (state, action) => {
      const index = state.fuelInventory.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.fuelInventory[index] = {
          ...state.fuelInventory[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        updateFilteredGenerators(state);
      }
    },

    addFuelStock: (state, action) => {
      const { fuelType, quantity, supplier, cost, notes } = action.payload;
      const fuelIndex = state.fuelInventory.findIndex(f => f.type === fuelType);
      if (fuelIndex !== -1) {
        state.fuelInventory[fuelIndex].quantity += parseFloat(quantity);
        state.fuelInventory[fuelIndex].lastRestocked = new Date().toISOString();
        state.fuelInventory[fuelIndex].stockHistory = [
          ...(state.fuelInventory[fuelIndex].stockHistory || []),
          {
            type: 'addition',
            quantity: parseFloat(quantity),
            supplier,
            cost: parseFloat(cost),
            notes,
            date: new Date().toISOString(),
          }
        ];
        updateFilteredGenerators(state);
      }
    },

    scheduleGeneratorMaintenance: (state, action) => {
      const { generatorId, maintenanceType, scheduledDate, notes } = action.payload;
      const generatorIndex = state.generators.findIndex(g => g.id === generatorId);
      if (generatorIndex !== -1) {
        const maintenanceRecord = {
          id: Date.now(),
          type: maintenanceType,
          scheduledDate,
          status: 'scheduled',
          notes,
          createdAt: new Date().toISOString(),
        };
        state.generators[generatorIndex].maintenanceSchedule = [
          ...(state.generators[generatorIndex].maintenanceSchedule || []),
          maintenanceRecord
        ];
        updateFilteredGenerators(state);
      }
    },

    searchGenerators: (state, action) => {
      state.searchTerm = action.payload;
      updateFilteredGenerators(state);
    },

    filterGenerators: (state, action) => {
      state.filterBy = action.payload;
      updateFilteredGenerators(state);
    },

    sortGenerators: (state, action) => {
      state.sortBy = action.payload;
      updateFilteredGenerators(state);
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

    setCurrentGenerator: (state, action) => {
      state.currentGenerator = action.payload;
    },

    addMaintenanceAlert: (state, action) => {
      const alert = {
        id: Date.now(),
        ...action.payload,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      state.maintenanceAlerts.push(alert);
      updateFilteredGenerators(state);
    },

    acknowledgeAlert: (state, action) => {
      const alert = state.maintenanceAlerts.find(a => a.id === action.payload.alertId);
      if (alert) {
        alert.status = 'acknowledged';
        alert.acknowledgedBy = action.payload.acknowledgedBy;
        alert.acknowledgedAt = new Date().toISOString();
      }
      updateFilteredGenerators(state);
    },

    resolveAlert: (state, action) => {
      const alert = state.maintenanceAlerts.find(a => a.id === action.payload.alertId);
      if (alert) {
        alert.status = 'resolved';
        alert.resolvedBy = action.payload.resolvedBy;
        alert.resolvedAt = new Date().toISOString();
      }
      updateFilteredGenerators(state);
    },

    generateGeneratorReport: (state) => {
      const report = {
        totalGenerators: state.generators.length,
        activeGenerators: state.generators.filter(g => g.status === 'active').length,
        totalRunHours: state.totalRunHours,
        totalFuelConsumed: state.totalFuelConsumed,
        totalOutages: state.powerOutages.length,
        activeOutages: state.activeOutages.length,
        lowFuelAlerts: state.lowFuelAlerts.length,
        maintenanceDue: state.maintenanceAlerts.length,
        generators: state.generators,
        runHours: state.runHours,
        fuelConsumption: state.fuelConsumption,
        powerOutages: state.powerOutages,
        fuelInventory: state.fuelInventory,
        generatedAt: new Date().toISOString(),
      };
      console.log('Generator report:', report);
      return report;
    },
  },
});

// Helper function to update filtered generators
const updateFilteredGenerators = (state) => {
  let filtered = [...state.generators];

  // Filter by search term
  if (state.searchTerm) {
    const searchTerm = state.searchTerm.toLowerCase();
    filtered = filtered.filter(generator =>
      generator.name.toLowerCase().includes(searchTerm) ||
      generator.model.toLowerCase().includes(searchTerm) ||
      generator.serialNumber.toLowerCase().includes(searchTerm) ||
      generator.location.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by status/type
  if (state.filterBy !== 'all') {
    if (state.filterBy === 'active' || state.filterBy === 'inactive' || state.filterBy === 'maintenance') {
      filtered = filtered.filter(generator => generator.status === state.filterBy);
    } else {
      filtered = filtered.filter(generator => generator.type === state.filterBy);
    }
  }

  // Apply sorting
  switch (state.sortBy) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'runHours':
      filtered.sort((a, b) => (b.totalRunHours || 0) - (a.totalRunHours || 0));
      break;
    case 'lastRun':
      filtered.sort((a, b) => new Date(b.lastRun || 0) - new Date(a.lastRun || 0));
      break;
    case 'capacity':
      filtered.sort((a, b) => b.capacity - a.capacity);
      break;
    default:
      break;
  }

  state.filteredGenerators = filtered;

  // Update totals
  state.totalRunHours = state.runHours.reduce((sum, record) => sum + record.hours, 0);
  state.totalFuelConsumed = state.fuelConsumption.reduce((sum, record) => sum + record.quantity, 0);

  // Update active outages
  state.activeOutages = state.powerOutages.filter(o => o.status === 'active');

  // Update low fuel alerts
  state.lowFuelAlerts = state.fuelInventory.filter(fuel =>
    fuel.quantity <= fuel.reorderLevel && fuel.status === 'active'
  );

  // Update maintenance alerts
  state.maintenanceAlerts = state.generators.filter(generator =>
    generator.maintenanceSchedule?.some(m =>
      new Date(m.scheduledDate) <= new Date() && m.status === 'scheduled'
    )
  );
};

export const {
  setGenerators,
  addGenerator,
  updateGenerator,
  deleteGenerator,
  logRunHours,
  logFuelConsumption,
  logPowerOutage,
  resolvePowerOutage,
  addFuelInventory,
  updateFuelInventory,
  addFuelStock,
  scheduleGeneratorMaintenance,
  addMaintenanceAlert,
  acknowledgeAlert,
  resolveAlert,
  searchGenerators,
  filterGenerators,
  sortGenerators,
  setLoading,
  setError,
  clearError,
  setCurrentGenerator,
  generateGeneratorReport,
} = generatorSlice.actions;

export default generatorSlice.reducer;