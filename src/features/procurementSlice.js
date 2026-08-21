import { createSlice } from '@reduxjs/toolkit';

const procurementSlice = createSlice({
  name: 'procurement',
  initialState: {
    vendors: [],
    rfqs: [],
    purchaseOrders: [],
    goodsReceivedNotes: [],
    invoiceMatching: [],
    paymentAuthorizations: [],
    vendorPerformance: [],
    categories: [],
    approvalWorkflows: {
      LOW_VALUE: { threshold: 100000, approvers: ['Department Head'] },
      MEDIUM_VALUE: { threshold: 500000, approvers: ['Department Head', 'Finance Manager'] },
      HIGH_VALUE: { threshold: 1000000, approvers: ['Department Head', 'Finance Manager', 'Chief Executive'] }
    },
    loading: false,
    error: null,
  },

  reducers: {
    setVendors: (state, action) => {
      state.vendors = action.payload;
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

    addVendor: (state, action) => {
      state.vendors.push(action.payload);
    },

    updateVendor: (state, action) => {
      const index = state.vendors.findIndex(vendor => vendor.vendorId === action.payload.vendorId);
      if (index !== -1) {
        state.vendors[index] = { ...state.vendors[index], ...action.payload };
      }
    },

    createRFQ: (state, action) => {
      state.rfqs.push(action.payload);
    },

    updateRFQ: (state, action) => {
      const index = state.rfqs.findIndex(rfq => rfq.rfqId === action.payload.rfqId);
      if (index !== -1) {
        state.rfqs[index] = { ...state.rfqs[index], ...action.payload };
      }
    },

    submitQuotation: (state, action) => {
      const { rfqId, quotation } = action.payload;
      const rfq = state.rfqs.find(r => r.rfqId === rfqId);
      if (rfq) {
        rfq.quotations.push(quotation);
      }
    },

    awardRFQ: (state, action) => {
      const { rfqId, vendorId, awardDate } = action.payload;
      const rfq = state.rfqs.find(r => r.rfqId === rfqId);
      if (rfq) {
        rfq.selectedVendor = vendorId;
        rfq.awardDate = awardDate;
        rfq.status = 'Awarded';
      }
    },

    createPurchaseOrder: (state, action) => {
      state.purchaseOrders.push(action.payload);
    },

    updatePurchaseOrder: (state, action) => {
      const index = state.purchaseOrders.findIndex(po => po.poId === action.payload.poId);
      if (index !== -1) {
        state.purchaseOrders[index] = { ...state.purchaseOrders[index], ...action.payload };
      }
    },

    createGRN: (state, action) => {
      state.goodsReceivedNotes.push(action.payload);
    },

    updateGRN: (state, action) => {
      const index = state.goodsReceivedNotes.findIndex(grn => grn.grnId === action.payload.grnId);
      if (index !== -1) {
        state.goodsReceivedNotes[index] = { ...state.goodsReceivedNotes[index], ...action.payload };
      }
    },

    createInvoiceMatch: (state, action) => {
      state.invoiceMatching.push(action.payload);
    },

    updateInvoiceMatch: (state, action) => {
      const index = state.invoiceMatching.findIndex(match => match.matchId === action.payload.matchId);
      if (index !== -1) {
        state.invoiceMatching[index] = { ...state.invoiceMatching[index], ...action.payload };
      }
    },

    createPaymentAuthorization: (state, action) => {
      state.paymentAuthorizations.push(action.payload);
    },

    updatePaymentAuthorization: (state, action) => {
      const index = state.paymentAuthorizations.findIndex(auth => auth.authId === action.payload.authId);
      if (index !== -1) {
        state.paymentAuthorizations[index] = { ...state.paymentAuthorizations[index], ...action.payload };
      }
    },

    approvePurchaseOrder: (state, action) => {
      const index = state.purchaseOrders.findIndex(po => po.poId === action.payload);
      if (index !== -1) {
        state.purchaseOrders[index].status = 'Approved';
      }
    },

    rejectPurchaseOrder: (state, action) => {
      const index = state.purchaseOrders.findIndex(po => po.poId === action.payload);
      if (index !== -1) {
        state.purchaseOrders[index].status = 'Rejected';
      }
    },

    updateVendorPerformance: (state, action) => {
      const index = state.vendorPerformance.findIndex(perf => perf.vendorId === action.payload.vendorId && perf.period === action.payload.period);
      if (index !== -1) {
        state.vendorPerformance[index] = { ...state.vendorPerformance[index], ...action.payload };
      } else {
        state.vendorPerformance.push(action.payload);
      }
    }
  }
});

export const {
  setVendors,
  setLoading,
  setError,
  clearError,
  addVendor,
  updateVendor,
  createRFQ,
  updateRFQ,
  submitQuotation,
  awardRFQ,
  createPurchaseOrder,
  updatePurchaseOrder,
  approvePurchaseOrder,
  rejectPurchaseOrder,
  createGRN,
  updateGRN,
  createInvoiceMatch,
  updateInvoiceMatch,
  createPaymentAuthorization,
  updatePaymentAuthorization,
  updateVendorPerformance
} = procurementSlice.actions;

export default procurementSlice.reducer;
