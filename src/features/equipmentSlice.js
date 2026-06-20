import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  equipment: [],
  filteredEquipment: [],
  currentEquipment: null,
  loading: false,
  error: null,
  searchTerm: '',
  filterBy: 'all',
  sortBy: 'name',
  depreciationData: [],
  maintenanceAlerts: [],
  totalValue: 0,
  categories: [],
  departments: [],
  locations: [],
};

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {
    setEquipment: (state, action) => {
      state.equipment = action.payload;
      updateFilteredEquipment(state);
    },

    addEquipment: (state, action) => {
      const existingIndex = state.equipment.findIndex(e => e.id === action.payload.id);
      if (existingIndex === -1) {
        state.equipment.unshift(action.payload);
        updateFilteredEquipment(state);
      }
    },

    updateEquipment: (state, action) => {
      const index = state.equipment.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.equipment[index] = {
          ...state.equipment[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        updateFilteredEquipment(state);
      }
    },

    deleteEquipment: (state, action) => {
      state.equipment = state.equipment.filter(e => e.id !== action.payload);
      updateFilteredEquipment(state);
    },

    transferEquipment: (state, action) => {
      const { equipmentId, newLocation, newDepartment } = action.payload;
      const index = state.equipment.findIndex(e => e.id === equipmentId);
      if (index !== -1) {
        state.equipment[index] = {
          ...state.equipment[index],
          location: newLocation,
          department: newDepartment,
          transferHistory: [
            ...(state.equipment[index].transferHistory || []),
            {
              date: new Date().toISOString(),
              fromLocation: state.equipment[index].location,
              toLocation: newLocation,
              fromDepartment: state.equipment[index].department,
              toDepartment: newDepartment,
            }
          ],
          updatedAt: new Date().toISOString(),
        };
        updateFilteredEquipment(state);
      }
    },

    scheduleMaintenance: (state, action) => {
      const { equipmentId, maintenanceType, scheduledDate, notes } = action.payload;
      const index = state.equipment.findIndex(e => e.id === equipmentId);
      if (index !== -1) {
        const maintenanceRecord = {
          id: Date.now(),
          type: maintenanceType,
          scheduledDate,
          status: 'scheduled',
          notes,
          createdAt: new Date().toISOString(),
        };
        state.equipment[index].maintenanceSchedule = [
          ...(state.equipment[index].maintenanceSchedule || []),
          maintenanceRecord
        ];
        updateFilteredEquipment(state);
      }
    },

    recordMaintenance: (state, action) => {
      const { equipmentId, maintenanceId, actualDate, performedBy, cost, notes, partsUsed } = action.payload;
      const equipmentIndex = state.equipment.findIndex(e => e.id === equipmentId);
      if (equipmentIndex !== -1) {
        const maintenanceIndex = state.equipment[equipmentIndex].maintenanceSchedule.findIndex(m => m.id === maintenanceId);
        if (maintenanceIndex !== -1) {
          state.equipment[equipmentIndex].maintenanceSchedule[maintenanceIndex] = {
            ...state.equipment[equipmentIndex].maintenanceSchedule[maintenanceIndex],
            actualDate,
            performedBy,
            cost,
            notes,
            partsUsed,
            status: 'completed',
            completedAt: new Date().toISOString(),
          };
          updateFilteredEquipment(state);
        }
      }
    },

    reportBreakdown: (state, action) => {
      const { equipmentId, description, reportedBy, priority } = action.payload;
      const index = state.equipment.findIndex(e => e.id === equipmentId);
      if (index !== -1) {
        const breakdownRecord = {
          id: Date.now(),
          description,
          reportedBy,
          reportedAt: new Date().toISOString(),
          priority,
          status: 'reported',
        };
        state.equipment[index].breakdowns = [
          ...(state.equipment[index].breakdowns || []),
          breakdownRecord
        ];
        updateFilteredEquipment(state);
      }
    },

    searchEquipment: (state, action) => {
      state.searchTerm = action.payload;
      updateFilteredEquipment(state);
    },

    filterEquipment: (state, action) => {
      state.filterBy = action.payload;
      updateFilteredEquipment(state);
    },

    sortEquipment: (state, action) => {
      state.sortBy = action.payload;
      updateFilteredEquipment(state);
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

    setCurrentEquipment: (state, action) => {
      state.currentEquipment = action.payload;
    },

    calculateDepreciation: (state) => {
      state.depreciationData = state.equipment.map(equipment => {
        const purchaseDate = new Date(equipment.purchaseDate);
        const currentDate = new Date();
        const yearsElapsed = (currentDate - purchaseDate) / (1000 * 60 * 60 * 24 * 365);

        let depreciationRate = 0.1; // 10% annual depreciation default
        if (equipment.category === 'Medical Equipment') depreciationRate = 0.15;
        if (equipment.category === 'IT Equipment') depreciationRate = 0.20;
        if (equipment.category === 'Furniture') depreciationRate = 0.05;

        const depreciatedValue = equipment.purchasePrice * Math.pow(1 - depreciationRate, yearsElapsed);
        const currentValue = Math.max(depreciatedValue, equipment.purchasePrice * 0.1); // Minimum 10% of original value

        return {
          equipmentId: equipment.id,
          originalValue: equipment.purchasePrice,
          currentValue: Math.round(currentValue),
          depreciation: Math.round(equipment.purchasePrice - currentValue),
          depreciationRate: depreciationRate * 100,
          yearsElapsed: yearsElapsed.toFixed(1),
        };
      });
    },

    generateEquipmentReport: (state) => {
      const report = {
        totalEquipment: state.equipment.length,
        totalValue: state.equipment.reduce((sum, eq) => sum + eq.purchasePrice, 0),
        depreciationData: state.depreciationData,
        maintenanceDue: state.equipment.filter(eq =>
          eq.maintenanceSchedule?.some(m => new Date(m.scheduledDate) <= new Date() && m.status === 'scheduled')
        ).length,
        breakdowns: state.equipment.filter(eq => eq.breakdowns?.some(b => b.status !== 'resolved')).length,
        equipment: state.equipment,
        generatedAt: new Date().toISOString(),
      };
      console.log('Equipment report:', report);
      return report;
    },
  },
});

// Helper function to update filtered equipment
const updateFilteredEquipment = (state) => {
  let filtered = [...state.equipment];

  // Filter by search term
  if (state.searchTerm) {
    const searchTerm = state.searchTerm.toLowerCase();
    filtered = filtered.filter(equipment =>
      equipment.name.toLowerCase().includes(searchTerm) ||
      equipment.serialNumber.toLowerCase().includes(searchTerm) ||
      equipment.model.toLowerCase().includes(searchTerm) ||
      equipment.manufacturer.toLowerCase().includes(searchTerm) ||
      equipment.location.toLowerCase().includes(searchTerm) ||
      equipment.department.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by category/status
  if (state.filterBy !== 'all') {
    if (state.filterBy === 'active' || state.filterBy === 'inactive' || state.filterBy === 'maintenance') {
      filtered = filtered.filter(equipment => equipment.status === state.filterBy);
    } else {
      filtered = filtered.filter(equipment => equipment.category === state.filterBy);
    }
  }

  // Apply sorting
  switch (state.sortBy) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'value':
      filtered.sort((a, b) => b.purchasePrice - a.purchasePrice);
      break;
    case 'purchaseDate':
      filtered.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
      break;
    case 'location':
      filtered.sort((a, b) => a.location.localeCompare(b.location));
      break;
    default:
      break;
  }

  state.filteredEquipment = filtered;

  // Update maintenance alerts
  state.maintenanceAlerts = state.equipment.filter(equipment =>
    equipment.maintenanceSchedule?.some(m =>
      new Date(m.scheduledDate) <= new Date() && m.status === 'scheduled'
    )
  );

  // Update total value
  state.totalValue = state.equipment.reduce((sum, equipment) => sum + equipment.purchasePrice, 0);
};

export const {
  setEquipment,
  addEquipment,
  updateEquipment,
  deleteEquipment,
  transferEquipment,
  scheduleMaintenance,
  recordMaintenance,
  reportBreakdown,
  searchEquipment,
  filterEquipment,
  sortEquipment,
  setLoading,
  setError,
  clearError,
  setCurrentEquipment,
  calculateDepreciation,
  generateEquipmentReport,
} = equipmentSlice.actions;

export default equipmentSlice.reducer;