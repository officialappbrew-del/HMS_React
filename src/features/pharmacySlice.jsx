import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pharmacyApi } from '../utils/api';

export const fetchDrugs = createAsyncThunk(
  'pharmacy/fetchDrugs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await pharmacyApi.getDrugs(params);
      const normalized = Array.isArray(data) ? data.map(normalizeDrugInternal) : (data.results || []).map(normalizeDrugInternal);
      return normalized;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch drugs');
    }
  }
);

export const normalizeDrug = (drug) => ({
  ...drug,
  quantityInStock: drug.stock_quantity,
  reorderLevel: drug.reorder_level,
  unitPrice: drug.unit_price,
  sellingPrice: drug.selling_price,
  expiryDate: drug.expiry_date,
  batchNumber: drug.batch_number,
  controlledSubstance: drug.is_controlled,
  genericName: drug.generic_name,
  brandName: drug.brand_name,
  drugCode: drug.drug_code,
  nafdacNumber: drug.nafdac_number,
  pcnApprovalNumber: drug.pcn_approval_number,
  dosageForm: drug.form,
  unitOfMeasure: drug.unit_of_measure,
  therapeuticClass: drug.therapeutic_class,
  manufacturer: drug.manufacturer,
  supplier: drug.supplier,
  countryOfOrigin: drug.country_of_origin,
  narcotic: drug.narcotic,
  schedule: drug.schedule,
  nhisCovered: drug.nhis_covered,
  nhisCode: drug.nhis_code,
  nhisPrice: drug.nhis_price,
  nemlCategory: drug.neml_category,
  sideEffects: drug.side_effects,
  contraindications: drug.contraindications,
  interactions: drug.interactions,
  dosageInstructions: drug.dosage_instructions,
  barcode: drug.barcode,
  lastRestocked: drug.last_restocked,
  reorderQuantity: drug.reorder_quantity,
  storageConditions: drug.storage_conditions,
  prescriptionRequired: drug.prescription_required,
});

const normalizeDrugInternal = normalizeDrug;

export const fetchSuppliers = createAsyncThunk(
  'pharmacy/fetchSuppliers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await pharmacyApi.getSuppliers(params);
      const normalized = Array.isArray(data) ? data : (data.results || []);
      return normalized;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch suppliers');
    }
  }
);

export const fetchSales = createAsyncThunk(
  'pharmacy/fetchSales',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await pharmacyApi.getSales(params);
      const normalized = Array.isArray(data) ? data : (data.results || []);
      return normalized;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch sales');
    }
  }
);

export const fetchPrescriptions = createAsyncThunk(
  'pharmacy/fetchPrescriptions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await pharmacyApi.getPrescriptions(params);
      const normalized = Array.isArray(data) ? data : (data.results || []);
      return normalized;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch prescriptions');
    }
  }
);

const initialState = {
  drugs: [],
  filteredDrugs: [],
  currentDrug: null,
  cart: [],
  salesHistory: [],
  prescriptions: [],
  suppliers: [],
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

    setSuppliers: (state, action) => {
      state.suppliers = action.payload;
    },

    setSales: (state, action) => {
      state.salesHistory = action.payload;
    },

    setPrescriptions: (state, action) => {
      state.prescriptions = action.payload;
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
      const { drugIds } = action.payload;
      const interactions = [];
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

    addPurchaseOrder: (state, action) => {
      state.purchaseOrders.push(action.payload);
    },

    updatePurchaseOrder: (state, action) => {
      const index = state.purchaseOrders.findIndex(po => po.poId === action.payload.poId);
      if (index !== -1) {
        state.purchaseOrders[index] = { ...state.purchaseOrders[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrugs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrugs.fulfilled, (state, action) => {
        state.loading = false;
        state.drugs = action.payload;
        updateFilteredDrugs(state);
      })
      .addCase(fetchDrugs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.suppliers = action.payload;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.salesHistory = action.payload;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.prescriptions = action.payload;
      });
  },
});

// Helper function to update filtered drugs
const updateFilteredDrugs = (state) => {
  let filtered = [...state.drugs];

  if (state.searchTerm) {
    const searchTerm = state.searchTerm.toLowerCase();
    filtered = filtered.filter(drug =>
      (drug.name || '').toLowerCase().includes(searchTerm) ||
      (drug.genericName && drug.genericName.toLowerCase().includes(searchTerm)) ||
      (drug.brandName && drug.brandName.toLowerCase().includes(searchTerm)) ||
      (drug.drugCode && drug.drugCode.toLowerCase().includes(searchTerm)) ||
      (drug.nafdacNumber && drug.nafdacNumber.toLowerCase().includes(searchTerm))
    );
  }

  if (state.filterBy !== 'all') {
    filtered = filtered.filter(drug => drug.category === state.filterBy);
  }

  switch (state.sortBy) {
    case 'name':
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'quantity':
      filtered.sort((a, b) => (b.quantityInStock || 0) - (a.quantityInStock || 0));
      break;
    case 'expiry':
      filtered.sort((a, b) => new Date(a.expiryDate || '9999-12-31') - new Date(b.expiryDate || '9999-12-31'));
      break;
    case 'price':
      filtered.sort((a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0));
      break;
    default:
      break;
  }

  state.filteredDrugs = filtered;

  state.lowStockItems = state.drugs.filter(drug =>
    (drug.quantityInStock || 0) <= (drug.reorderLevel || 0) && drug.status === 'active'
  );

  state.expiredDrugs = state.drugs.filter(drug => {
    if (!drug.expiryDate) return false;
    return new Date(drug.expiryDate) < new Date() && drug.status === 'active';
  });

  state.inventoryValue = state.drugs.reduce((sum, drug) =>
    sum + ((drug.quantityInStock || 0) * (parseFloat(drug.unitPrice) || 0)), 0
  );

  const currentLowStock = state.drugs.filter(drug =>
    (drug.quantityInStock || 0) <= (drug.reorderLevel || 0) && drug.status === 'active'
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
  setSuppliers,
  setSales,
  setPrescriptions,
  exportPharmacyReport,
  checkDrugInteraction,
  generatePrescription,
  acknowledgeLowStockAlert,
  addPurchaseOrder,
  updatePurchaseOrder,
} = pharmacySlice.actions;

export default pharmacySlice.reducer;
