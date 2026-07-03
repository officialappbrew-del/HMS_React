import { createSlice } from '@reduxjs/toolkit';

const medicalSuppliesSlice = createSlice({
  name: 'medicalSupplies',
  initialState: {
    consumables: [],
    ppe: [],
    labReagents: [],
    radiologySupplies: [],
    surgicalInstruments: [],
    linen: [],
    supplyTransactions: [],
    requisitions: [],
    supplyAlerts: [],
    categories: {
      CONSUMABLES: 'Consumables',
      PPE: 'Personal Protective Equipment',
      LAB_REAGENTS: 'Laboratory Reagents',
      RADIOLOGY: 'Radiology Supplies',
      SURGICAL: 'Surgical Instruments',
      LINEN: 'Linen & Laundry'
    },
    locations: []
  },

  reducers: {
    addConsumable: (state, action) => {
      state.consumables.push(action.payload);
    },

    updateConsumable: (state, action) => {
      const index = state.consumables.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.consumables[index] = { ...state.consumables[index], ...action.payload };
      }
    },

    addPPE: (state, action) => {
      state.ppe.push(action.payload);
    },

    updatePPE: (state, action) => {
      const index = state.ppe.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.ppe[index] = { ...state.ppe[index], ...action.payload };
      }
    },

    addLabReagent: (state, action) => {
      state.labReagents.push(action.payload);
    },

    updateLabReagent: (state, action) => {
      const index = state.labReagents.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.labReagents[index] = { ...state.labReagents[index], ...action.payload };
      }
    },

    addRadiologySupply: (state, action) => {
      state.radiologySupplies.push(action.payload);
    },

    updateRadiologySupply: (state, action) => {
      const index = state.radiologySupplies.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.radiologySupplies[index] = { ...state.radiologySupplies[index], ...action.payload };
      }
    },

    addSurgicalInstrument: (state, action) => {
      state.surgicalInstruments.push(action.payload);
    },

    updateSurgicalInstrument: (state, action) => {
      const index = state.surgicalInstruments.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.surgicalInstruments[index] = { ...state.surgicalInstruments[index], ...action.payload };
      }
    },

    addLinen: (state, action) => {
      state.linen.push(action.payload);
    },

    updateLinen: (state, action) => {
      const index = state.linen.findIndex(item => item.itemId === action.payload.itemId);
      if (index !== -1) {
        state.linen[index] = { ...state.linen[index], ...action.payload };
      }
    },

    addSupplyTransaction: (state, action) => {
      state.supplyTransactions.push(action.payload);

      // Update stock levels based on transaction
      const { itemId, itemType, type, quantity } = action.payload;
      let itemArray;

      switch (itemType) {
        case 'consumables':
          itemArray = state.consumables;
          break;
        case 'ppe':
          itemArray = state.ppe;
          break;
        case 'labReagents':
          itemArray = state.labReagents;
          break;
        case 'radiologySupplies':
          itemArray = state.radiologySupplies;
          break;
        case 'surgicalInstruments':
          itemArray = state.surgicalInstruments;
          break;
        case 'linen':
          itemArray = state.linen;
          break;
        default:
          return;
      }

      const item = itemArray.find(i => i.itemId === itemId);
      if (item) {
        if (type === 'Stock In') {
          item.currentStock += quantity;
          item.lastRestocked = action.payload.date;
        } else if (type === 'Stock Out') {
          item.currentStock -= quantity;
        }

        // Check for low stock alerts
        if (item.currentStock <= item.reorderPoint) {
          const existingAlert = state.supplyAlerts.find(a => a.itemId === item.itemId);
          if (!existingAlert) {
            state.supplyAlerts.push({
              alertId: `SALERT${Date.now()}`,
              itemId: item.itemId,
              itemName: item.name,
              itemType: itemType,
              currentStock: item.currentStock,
              reorderPoint: item.reorderPoint,
              status: 'Active',
              createdDate: new Date().toISOString().split('T')[0],
              acknowledgedBy: null,
              actionTaken: null
            });
          }
        }
      }
    },

    addRequisition: (state, action) => {
      state.requisitions.push(action.payload);
    },

    updateRequisition: (state, action) => {
      const index = state.requisitions.findIndex(req => req.reqId === action.payload.reqId);
      if (index !== -1) {
        state.requisitions[index] = { ...state.requisitions[index], ...action.payload };
      }
    },

    acknowledgeSupplyAlert: (state, action) => {
      const alert = state.supplyAlerts.find(a => a.alertId === action.payload.alertId);
      if (alert) {
        alert.status = 'Acknowledged';
        alert.acknowledgedBy = action.payload.acknowledgedBy;
      }
    }
  }
});

export const {
  addConsumable,
  updateConsumable,
  addPPE,
  updatePPE,
  addLabReagent,
  updateLabReagent,
  addRadiologySupply,
  updateRadiologySupply,
  addSurgicalInstrument,
  updateSurgicalInstrument,
  addLinen,
  updateLinen,
  addSupplyTransaction,
  addRequisition,
  updateRequisition,
  acknowledgeSupplyAlert
} = medicalSuppliesSlice.actions;

export default medicalSuppliesSlice.reducer;
