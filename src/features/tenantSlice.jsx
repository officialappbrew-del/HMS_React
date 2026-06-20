import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTenant: null,
  subdomain: window.location.hostname.split('.')[0],
  branding: {
    logo: '/logo.png',
    colors: {
      primary: '#008751', // Nigerian green
      secondary: '#FFC107', // Nigerian gold
    },
  },
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant: (state, action) => {
      state.currentTenant = action.payload;
      // Update branding based on tenant
      if (action.payload) {
        state.branding = {
          ...state.branding,
          ...action.payload.branding,
        };
      }
    },
  },
});

export const { setTenant } = tenantSlice.actions;
export default tenantSlice.reducer;