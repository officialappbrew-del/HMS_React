import { createSlice } from '@reduxjs/toolkit';

const pharmacyInventorySlice = createSlice({
  name: 'pharmacyInventory',
  initialState: {
    drugs: [],
    stockTransactions: [],
    narcoticsRegister: [],
    drugRecalls: [],
    purchaseOrders: [],
    suppliers: [],
    stockValuation: {
      fifo: { totalValue: 0, lastUpdated: null },
      lifo: { totalValue: 0, lastUpdated: null },
      weightedAverage: { totalValue: 0, lastUpdated: null }
    },
    lowStockAlerts: [],
    categories: [],
    dosageForms: [],
  },

  reducers: {
    setDrugs: (state, action) => {
      state.drugs = action.payload;
    },

    addDrug: (state, action) => {
      state.drugs.push(action.payload);
    },

    updateDrug: (state, action) => {
      const index = state.drugs.findIndex(drug => drug.drugId === action.payload.drugId);
      if (index !== -1) {
        state.drugs[index] = { ...state.drugs[index], ...action.payload };
      }
    },

    deleteDrug: (state, action) => {
      state.drugs = state.drugs.filter(drug => drug.drugId !== action.payload);
    },

    addStockTransaction: (state, action) => {
      state.stockTransactions.push(action.payload);

      const drug = state.drugs.find(d => d.drugId === action.payload.drugId);
      if (drug) {
        if (action.payload.type === 'Stock In') {
          drug.currentStock += action.payload.quantity;
          drug.lastRestocked = action.payload.date;
        } else if (action.payload.type === 'Stock Out') {
          drug.currentStock -= action.payload.quantity;
        }

        if (drug.currentStock <= drug.reorderPoint) {
          const existingAlert = state.lowStockAlerts.find(a => a.drugId === drug.drugId);
          if (!existingAlert) {
            state.lowStockAlerts.push({
              alertId: `ALERT${Date.now()}`,
              drugId: drug.drugId,
              drugName: drug.name,
              currentStock: drug.currentStock,
              reorderPoint: drug.reorderPoint,
              status: 'Active',
              createdDate: new Date().toISOString().split('T')[0],
              acknowledgedBy: null,
              actionTaken: null
            });
          }
        }
      }
    },

    addPurchaseOrder: (state, action) => {
      state.purchaseOrders.push(action.payload);
    },

    updatePurchaseOrder: (state, action) => {
      const index = state.purchaseOrders.findIndex(po => po.poId === action.payload.poId);
      if (index !== -1) {
        state.purchaseOrders[index] = { ...state.purchaseOrders[index], ...action.payload };
      }
    },

    setSuppliers: (state, action) => {
      state.suppliers = action.payload;
    },

    addSupplier: (state, action) => {
      state.suppliers.push(action.payload);
    },

    updateSupplier: (state, action) => {
      const index = state.suppliers.findIndex(sup => sup.supplierId === action.payload.supplierId);
      if (index !== -1) {
        state.suppliers[index] = { ...state.suppliers[index], ...action.payload };
      }
    },

    addDrugRecall: (state, action) => {
      state.drugRecalls.push(action.payload);
    },

    acknowledgeLowStockAlert: (state, action) => {
      const alert = state.lowStockAlerts.find(a => a.alertId === action.payload.alertId);
      if (alert) {
        alert.status = 'Acknowledged';
        alert.acknowledgedBy = action.payload.acknowledgedBy;
      }
    },

    updateNarcoticsRegister: (state, action) => {
      const index = state.narcoticsRegister.findIndex(reg => reg.registerId === action.payload.registerId);
      if (index !== -1) {
        state.narcoticsRegister[index] = { ...state.narcoticsRegister[index], ...action.payload };
      }
    }
  }
});

export const {
  setDrugs,
  addDrug,
  updateDrug,
  deleteDrug,
  addStockTransaction,
  addPurchaseOrder,
  updatePurchaseOrder,
  setSuppliers,
  addSupplier,
  updateSupplier,
  addDrugRecall,
  acknowledgeLowStockAlert,
  updateNarcoticsRegister
} = pharmacyInventorySlice.actions;

export default pharmacyInventorySlice.reducer;
