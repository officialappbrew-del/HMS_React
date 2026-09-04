import { createSlice } from '@reduxjs/toolkit';

const referralSlice = createSlice({
  name: 'referral',
  initialState: {
    referrals: [],
    medicalEvacuations: [],
    transferCompliance: [],
    loading: false,
    error: null,
  },
  reducers: {
    setReferrals: (state, action) => {
      state.referrals = action.payload;
      state.medicalEvacuations = action.payload.filter((item) => item.isMedicalEvacuation);
    },
    updateReferralRecord: (state, action) => {
      const index = state.referrals.findIndex((item) => item.referralId === action.payload.referralId);
      if (index !== -1) state.referrals[index] = { ...state.referrals[index], ...action.payload };
    },
    createReferral: (state, action) => {
      const item = action.payload;
      const index = state.referrals.findIndex((referral) => referral.referralId === item.referralId);
      if (index === -1) state.referrals.unshift(item);
      else state.referrals[index] = { ...state.referrals[index], ...item };
      state.medicalEvacuations = state.referrals.filter((referral) => referral.isMedicalEvacuation);
    },
    updateReferral: (state, action) => {
      const index = state.referrals.findIndex((referral) => referral.referralId === action.payload.referralId);
      if (index !== -1) state.referrals[index] = { ...state.referrals[index], ...action.payload };
      state.medicalEvacuations = state.referrals.filter((referral) => referral.isMedicalEvacuation);
    },
    completeTransport: (state, action) => {
      const index = state.referrals.findIndex((referral) => referral.referralId === action.payload.referralId);
      if (index !== -1) state.referrals[index] = { ...state.referrals[index], ...action.payload, status: 'Completed' };
    },
  },
});

export const { setReferrals, updateReferralRecord, createReferral, updateReferral, completeTransport } = referralSlice.actions;
export default referralSlice.reducer;
