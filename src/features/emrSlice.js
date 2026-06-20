import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  encounters: [],
  clinicalNotes: [],
  searchTerm: '',
  sortBy: 'date',
  filterBy: 'all',
  loading: false,
  error: null,
};

const emrSlice = createSlice({
  name: 'emr',
  initialState,
  reducers: {
    addEncounter: (state, action) => {
      state.encounters.push({
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    updateEncounter: (state, action) => {
      const index = state.encounters.findIndex(enc => enc.id === action.payload.id);
      if (index !== -1) {
        state.encounters[index] = { ...state.encounters[index], ...action.payload };
      }
    },
    addClinicalNote: (state, action) => {
      state.clinicalNotes.push({
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    searchEMR: (state, action) => {
      state.searchTerm = action.payload;
    },
    sortEMR: (state, action) => {
      state.sortBy = action.payload;
    },
    filterEMR: (state, action) => {
      state.filterBy = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addEncounter,
  updateEncounter,
  addClinicalNote,
  searchEMR,
  sortEMR,
  filterEMR,
  setLoading,
  setError,
} = emrSlice.actions;

export default emrSlice.reducer;