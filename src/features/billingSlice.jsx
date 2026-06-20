import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bills: [],
  currentBill: null,
  currency: 'NGN', // Nigerian Naira
  exchangeRates: {
    NGN: 1,
    USD: 0.0022, // Approximate
    GBP: 0.0018,
  },
  loading: false,
  error: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setBills: (state, action) => {
      state.bills = action.payload;
    },
    setCurrentBill: (state, action) => {
      state.currentBill = action.payload;
    },
    addBill: (state, action) => {
      state.bills.push(action.payload);
    },
    updateBill: (state, action) => {
      const index = state.bills.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setExchangeRates: (state, action) => {
      state.exchangeRates = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setBills, setCurrentBill, addBill, updateBill, setCurrency, setExchangeRates, setLoading, setError } = billingSlice.actions;
export default billingSlice.reducer;