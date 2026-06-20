import { createSlice } from '@reduxjs/toolkit';

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    globalLoading: false,
    pageLoading: false,
    apiRequests: {}, // Track individual API requests
    loadingMessages: {} // Custom messages for different loading states
  },
  reducers: {
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    setPageLoading: (state, action) => {
      state.pageLoading = action.payload;
    },
    startApiRequest: (state, action) => {
      const { requestId, message } = action.payload;
      state.apiRequests[requestId] = true;
      if (message) {
        state.loadingMessages[requestId] = message;
      }
    },
    endApiRequest: (state, action) => {
      const { requestId } = action.payload;
      delete state.apiRequests[requestId];
      delete state.loadingMessages[requestId];
    },
    clearAllLoading: (state) => {
      state.globalLoading = false;
      state.pageLoading = false;
      state.apiRequests = {};
      state.loadingMessages = {};
    }
  }
});

export const {
  setGlobalLoading,
  setPageLoading,
  startApiRequest,
  endApiRequest,
  clearAllLoading
} = loadingSlice.actions;

// Selectors
export const selectGlobalLoading = (state) => state.loading.globalLoading;
export const selectPageLoading = (state) => state.loading.pageLoading;
export const selectApiRequests = (state) => state.loading.apiRequests;
export const selectLoadingMessages = (state) => state.loading.loadingMessages;
export const selectIsAnyLoading = (state) =>
  state.loading.globalLoading ||
  state.loading.pageLoading ||
  Object.keys(state.loading.apiRequests).length > 0;

export default loadingSlice.reducer;