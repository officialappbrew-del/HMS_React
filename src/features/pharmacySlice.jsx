import { createSlice } from '@reduxjs/toolkit';
import { pharmacyDummyData } from '../data/pharmacyDummyData';

const initialState = {
  drugs: [],
  filteredDrugs: [],
  currentDrug: null,
  cart: [],
  salesHistory: [],
  prescriptions: [],
  loading: false,
  error: null,
  searchTerm: '',
  filterBy: 'all',
  sortBy: 'name',
  lowStockItems: [],
  lowStockAlerts: [],
  expiredDrugs: [],
  inventoryValue: 0,
  purchaseOrders: [],
};

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {
    setDrugs: (state, action) => {
      state.drugs = action.payload;
      updateFilteredDrugs(state);
    },
    
    addDrug: (state, action) => {
      const existingIndex = state.drugs.findIndex(d => d.id === action.payload.id);
      if (existingIndex === -1) {
        state.drugs.unshift(action.payload);
        updateFilteredDrugs(state);
      }
    },
    
    updateDrug: (state, action) => {
      const index = state.drugs.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.drugs[index] = {
          ...state.drugs[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        updateFilteredDrugs(state);
      }
    },
    
    deleteDrug: (state, action) => {
      state.drugs = state.drugs.filter(d => d.id !== action.payload);
      updateFilteredDrugs(state);
    },
    
    archiveDrug: (state, action) => {
      const index = state.drugs.findIndex(d => d.id === action.payload);
      if (index !== -1) {
        state.drugs[index] = {
          ...state.drugs[index],
          status: 'archived',
          archivedAt: new Date().toISOString(),
        };
        updateFilteredDrugs(state);
      }
    },
    
    restockDrug: (state, action) => {
      const { drugId, quantity, batchNumber, expiryDate } = action.payload;
      const index = state.drugs.findIndex(d => d.id === drugId);
      if (index !== -1) {
        state.drugs[index].quantityInStock += parseInt(quantity);
        state.drugs[index].lastRestocked = new Date().toISOString();
        if (batchNumber) state.drugs[index].batchNumber = batchNumber;
        if (expiryDate) state.drugs[index].expiryDate = expiryDate;
        updateFilteredDrugs(state);
      }
    },
    
    dispenseDrug: (state, action) => {
      const { drugId, quantity } = action.payload;
      const index = state.drugs.findIndex(d => d.id === drugId);
      if (index !== -1 && state.drugs[index].quantityInStock >= quantity) {
        state.drugs[index].quantityInStock -= quantity;
        updateFilteredDrugs(state);
        
        // Add to sales history
        const sale = {
          id: Date.now(),
          drugId,
          drugName: state.drugs[index].name,
          quantity,
          unitPrice: state.drugs[index].sellingPrice,
          totalPrice: quantity * state.drugs[index].sellingPrice,
          timestamp: new Date().toISOString(),
        };
        state.salesHistory.unshift(sale);
      }
    },
    
    searchDrugs: (state, action) => {
      state.searchTerm = action.payload;
      updateFilteredDrugs(state);
    },
    
    filterDrugs: (state, action) => {
      state.filterBy = action.payload;
      updateFilteredDrugs(state);
    },
    
    sortDrugs: (state, action) => {
      state.sortBy = action.payload;
      updateFilteredDrugs(state);
    },
    
    addToCart: (state, action) => {
      const existingIndex = state.cart.findIndex(item => item.id === action.payload.id);
      if (existingIndex !== -1) {
        state.cart[existingIndex].quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    
    clearCart: (state) => {
      state.cart = [];
    },
    
    processSale: (state, action) => {
      action.payload.forEach(item => {
        const index = state.drugs.findIndex(d => d.id === item.id);
        if (index !== -1 && state.drugs[index].quantityInStock >= item.quantity) {
          state.drugs[index].quantityInStock -= item.quantity;
          
          const sale = {
            id: Date.now(),
            drugId: item.id,
            drugName: item.name,
            quantity: item.quantity,
            unitPrice: item.sellingPrice,
            totalPrice: item.quantity * item.sellingPrice,
            timestamp: new Date().toISOString(),
          };
          state.salesHistory.unshift(sale);
        }
      });
      state.cart = [];
      updateFilteredDrugs(state);
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
    
    setCurrentDrug: (state, action) => {
      state.currentDrug = action.payload;
    },
    
    exportPharmacyReport: (state) => {
      const report = {
        totalDrugs: state.drugs.length,
        lowStockItems: state.lowStockItems.length,
        expiredDrugs: state.expiredDrugs.length,
        inventoryValue: state.inventoryValue,
        salesHistory: state.salesHistory,
        drugs: state.drugs,
        generatedAt: new Date().toISOString(),
      };
      console.log('Exporting pharmacy report:', report);
      return report;
    },
    
    checkDrugInteraction: (state, action) => {
      // Placeholder for drug interaction checking logic
      const { drugIds } = action.payload;
      const interactions = [];
      // In a real app, this would check against a drug interaction database
      return interactions;
    },
    
    generatePrescription: (state, action) => {
      const { patientName, patientId, drugs, notes } = action.payload;
      const prescription = {
        id: Date.now(),
        patientName,
        patientId,
        drugs,
        notes,
        generatedAt: new Date().toISOString(),
        prescriptionNumber: `RX-${Date.now()}`,
      };
      state.prescriptions.unshift(prescription);
      return prescription;
    },
    acknowledgeLowStockAlert: (state, action) => {
      const { alertId, acknowledgedBy } = action.payload;
      const alert = state.lowStockAlerts.find(a => a.alertId === alertId);
      if (alert) {
        alert.acknowledgedBy = acknowledgedBy;
      }
    },
  },
});

// Helper function to update filtered drugs
const updateFilteredDrugs = (state) => {
  let filtered = [...state.drugs];
  
  // Filter by search term
  if (state.searchTerm) {
    const searchTerm = state.searchTerm.toLowerCase();
    filtered = filtered.filter(drug => 
      drug.name.toLowerCase().includes(searchTerm) ||
      drug.genericName.toLowerCase().includes(searchTerm) ||
      drug.brandName.toLowerCase().includes(searchTerm) ||
      drug.drugCode.toLowerCase().includes(searchTerm) ||
      drug.nafdacNumber.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by category
  if (state.filterBy !== 'all') {
    filtered = filtered.filter(drug => drug.category === state.filterBy);
  }
  
  // Apply sorting
  switch (state.sortBy) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'quantity':
      filtered.sort((a, b) => b.quantityInStock - a.quantityInStock);
      break;
    case 'expiry':
      filtered.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
      break;
    case 'price':
      filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
      break;
    default:
      break;
  }
  
  state.filteredDrugs = filtered;
  
  // Update low stock items
  state.lowStockItems = state.drugs.filter(drug => 
    drug.quantityInStock <= drug.reorderLevel && drug.status === 'active'
  );
  
  // Update expired drugs
  state.expiredDrugs = state.drugs.filter(drug => 
    new Date(drug.expiryDate) < new Date() && drug.status === 'active'
  );
  
  // Update inventory value
  state.inventoryValue = state.drugs.reduce((sum, drug) =>
    sum + (drug.quantityInStock * drug.unitPrice), 0
  );
  
  // Update low stock alerts
  const currentLowStock = state.drugs.filter(drug =>
    drug.quantityInStock <= drug.reorderLevel && drug.status === 'active'
  );
  state.lowStockAlerts = currentLowStock.map(drug => {
    const existingAlert = state.lowStockAlerts.find(a => a.alertId === drug.id);
    if (existingAlert) {
      return {
        ...existingAlert,
        currentStock: drug.quantityInStock,
        reorderPoint: drug.reorderLevel
      };
    } else {
      return {
        alertId: drug.id,
        drugName: drug.name,
        currentStock: drug.quantityInStock,
        reorderPoint: drug.reorderLevel,
        createdDate: new Date().toISOString(),
        acknowledgedBy: null
      };
    }
  });
};

export const {
  setDrugs,
  addDrug,
  updateDrug,
  deleteDrug,
  archiveDrug,
  restockDrug,
  dispenseDrug,
  searchDrugs,
  filterDrugs,
  sortDrugs,
  addToCart,
  removeFromCart,
  clearCart,
  processSale,
  setLoading,
  setError,
  clearError,
  setCurrentDrug,
  exportPharmacyReport,
  checkDrugInteraction,
  generatePrescription,
  acknowledgeLowStockAlert,
} = pharmacySlice.actions;

export default pharmacySlice.reducer;