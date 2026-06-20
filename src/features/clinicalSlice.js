import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  templates: {
    malaria: null,
    typhoid: null,
    // ... other templates
  },
  orders: {
    medications: [],
    labs: [],
    radiology: [],
  },
  cds: {
    warnings: [],
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const clinicalSlice = createSlice({
  name: 'clinical',
  initialState,
  reducers: {
    saveMalariaTemplate: (state, action) => {
      state.templates.malaria = action.payload;
    },
    addMedicationOrder: (state, action) => {
      state.orders.medications.push(action.payload);
    },
    addLabOrder: (state, action) => {
      state.orders.labs.push(action.payload);
    },
    setInteractionWarnings: (state, action) => {
      state.cds.warnings = action.payload;
    },
    // ... other reducers for other templates, orders, etc.
  },
});

export const {
  saveMalariaTemplate,
  addMedicationOrder,
  addLabOrder,
  setInteractionWarnings,
} = clinicalSlice.actions;

// Selectors
export const selectAllMedicationOrders = (state) => state.clinical.orders.medications;
export const selectMalariaTemplate = (state) => state.clinical.templates.malaria;
export const selectCdsWarnings = (state) => state.clinical.cds.warnings;

export default clinicalSlice.reducer;