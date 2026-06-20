import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  maintenanceSchedule: [],
  completedMaintenance: [],
  breakdowns: [],
  spareParts: [],
  serviceContracts: [],
  calibrationRecords: [],
  filteredMaintenance: [],
  currentMaintenance: null,
  loading: false,
  error: null,
  searchTerm: '',
  filterBy: 'all',
  sortBy: 'date',
  upcomingMaintenance: [],
  overdueMaintenance: [],
  lowStockParts: [],
  preventiveSchedules: [],
  breakdownReports: [],
  repairHistory: [],
  maintenanceTypes: [],
  priorities: [],
  statuses: [],
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    setMaintenanceSchedule: (state, action) => {
      state.maintenanceSchedule = action.payload;
      updateFilteredMaintenance(state);
    },

    addMaintenanceSchedule: (state, action) => {
      const existingIndex = state.maintenanceSchedule.findIndex(m => m.id === action.payload.id);
      if (existingIndex === -1) {
        state.maintenanceSchedule.unshift(action.payload);
        updateFilteredMaintenance(state);
      }
    },

    updateMaintenanceSchedule: (state, action) => {
      const index = state.maintenanceSchedule.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.maintenanceSchedule[index] = {
          ...state.maintenanceSchedule[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        updateFilteredMaintenance(state);
      }
    },

    completeMaintenance: (state, action) => {
      const { scheduleId, completionData } = action.payload;
      const index = state.maintenanceSchedule.findIndex(m => m.id === scheduleId);
      if (index !== -1) {
        const completedRecord = {
          ...state.maintenanceSchedule[index],
          ...completionData,
          status: 'completed',
          completedAt: new Date().toISOString(),
        };
        state.completedMaintenance.unshift(completedRecord);
        state.maintenanceSchedule.splice(index, 1);
        updateFilteredMaintenance(state);
      }
    },

    addBreakdown: (state, action) => {
      const existingIndex = state.breakdowns.findIndex(b => b.id === action.payload.id);
      if (existingIndex === -1) {
        state.breakdowns.unshift(action.payload);
        updateFilteredMaintenance(state);
      }
    },

    updateBreakdown: (state, action) => {
      const index = state.breakdowns.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.breakdowns[index] = {
          ...state.breakdowns[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        updateFilteredMaintenance(state);
      }
    },

    resolveBreakdown: (state, action) => {
      const { breakdownId, resolutionData } = action.payload;
      const index = state.breakdowns.findIndex(b => b.id === breakdownId);
      if (index !== -1) {
        state.breakdowns[index] = {
          ...state.breakdowns[index],
          ...resolutionData,
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
        };
        updateFilteredMaintenance(state);
      }
    },

    addSparePart: (state, action) => {
      const existingIndex = state.spareParts.findIndex(p => p.id === action.payload.id);
      if (existingIndex === -1) {
        state.spareParts.unshift(action.payload);
        updateFilteredMaintenance(state);
      }
    },

    updateSparePart: (state, action) => {
      const index = state.spareParts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.spareParts[index] = {
          ...state.spareParts[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        updateFilteredMaintenance(state);
      }
    },

    useSparePart: (state, action) => {
      const { partId, quantity, maintenanceId } = action.payload;
      const index = state.spareParts.findIndex(p => p.id === partId);
      if (index !== -1 && state.spareParts[index].quantity >= quantity) {
        state.spareParts[index].quantity -= quantity;
        state.spareParts[index].usageHistory = [
          ...(state.spareParts[index].usageHistory || []),
          {
            maintenanceId,
            quantity,
            usedAt: new Date().toISOString(),
          }
        ];
        updateFilteredMaintenance(state);
      }
    },

    addServiceContract: (state, action) => {
      const existingIndex = state.serviceContracts.findIndex(c => c.id === action.payload.id);
      if (existingIndex === -1) {
        state.serviceContracts.unshift(action.payload);
        updateFilteredMaintenance(state);
      }
    },

    updateServiceContract: (state, action) => {
      const index = state.serviceContracts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.serviceContracts[index] = {
          ...state.serviceContracts[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        updateFilteredMaintenance(state);
      }
    },

    addCalibrationRecord: (state, action) => {
      const existingIndex = state.calibrationRecords.findIndex(c => c.id === action.payload.id);
      if (existingIndex === -1) {
        state.calibrationRecords.unshift(action.payload);
        updateFilteredMaintenance(state);
      }
    },

    searchMaintenance: (state, action) => {
      state.searchTerm = action.payload;
      updateFilteredMaintenance(state);
    },

    filterMaintenance: (state, action) => {
      state.filterBy = action.payload;
      updateFilteredMaintenance(state);
    },

    sortMaintenance: (state, action) => {
      state.sortBy = action.payload;
      updateFilteredMaintenance(state);
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

    setCurrentMaintenance: (state, action) => {
      state.currentMaintenance = action.payload;
    },

    generateMaintenanceReport: (state) => {
      const report = {
        totalScheduled: state.maintenanceSchedule.length,
        totalCompleted: state.completedMaintenance.length,
        totalBreakdowns: state.breakdowns.length,
        resolvedBreakdowns: state.breakdowns.filter(b => b.status === 'resolved').length,
        upcomingMaintenance: state.upcomingMaintenance.length,
        overdueMaintenance: state.overdueMaintenance.length,
        lowStockParts: state.lowStockParts.length,
        activeContracts: state.serviceContracts.filter(c => new Date(c.endDate) > new Date()).length,
        maintenanceSchedule: state.maintenanceSchedule,
        completedMaintenance: state.completedMaintenance,
        breakdowns: state.breakdowns,
        spareParts: state.spareParts,
        serviceContracts: state.serviceContracts,
        calibrationRecords: state.calibrationRecords,
        generatedAt: new Date().toISOString(),
      };
      console.log('Maintenance report:', report);
      return report;
    },
  },
});

// Helper function to update filtered maintenance
const updateFilteredMaintenance = (state) => {
  // Update upcoming maintenance (next 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  state.upcomingMaintenance = state.maintenanceSchedule.filter(m =>
    new Date(m.scheduledDate) <= thirtyDaysFromNow && new Date(m.scheduledDate) >= new Date()
  );

  // Update overdue maintenance
  state.overdueMaintenance = state.maintenanceSchedule.filter(m =>
    new Date(m.scheduledDate) < new Date() && m.status === 'scheduled'
  );

  // Update low stock parts
  state.lowStockParts = state.spareParts.filter(part =>
    part.quantity <= part.reorderLevel && part.status === 'active'
  );

  // Filter maintenance schedule
  let filtered = [...state.maintenanceSchedule];

  // Filter by search term
  if (state.searchTerm) {
    const searchTerm = state.searchTerm.toLowerCase();
    filtered = filtered.filter(item =>
      item.equipmentName?.toLowerCase().includes(searchTerm) ||
      item.type?.toLowerCase().includes(searchTerm) ||
      item.assignedTo?.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by status/type
  if (state.filterBy !== 'all') {
    if (state.filterBy === 'scheduled' || state.filterBy === 'completed' || state.filterBy === 'overdue') {
      filtered = filtered.filter(item => item.status === state.filterBy);
    } else {
      filtered = filtered.filter(item => item.type === state.filterBy);
    }
  }

  // Apply sorting
  switch (state.sortBy) {
    case 'date':
      filtered.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
      break;
    case 'equipment':
      filtered.sort((a, b) => (a.equipmentName || '').localeCompare(b.equipmentName || ''));
      break;
    case 'priority':
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      filtered.sort((a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4));
      break;
    case 'type':
      filtered.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
      break;
    default:
      break;
  }

  state.filteredMaintenance = filtered;
};

export const {
  setMaintenanceSchedule,
  addMaintenanceSchedule,
  updateMaintenanceSchedule,
  completeMaintenance,
  addBreakdown,
  updateBreakdown,
  resolveBreakdown,
  addSparePart,
  updateSparePart,
  useSparePart,
  addServiceContract,
  updateServiceContract,
  addCalibrationRecord,
  searchMaintenance,
  filterMaintenance,
  sortMaintenance,
  setLoading,
  setError,
  clearError,
  setCurrentMaintenance,
  generateMaintenanceReport,
} = maintenanceSlice.actions;

export default maintenanceSlice.reducer;