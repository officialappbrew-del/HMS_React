import { createSlice } from '@reduxjs/toolkit';

const initialStaff = [];

const dedupeStaff = (items = []) => {
  const seen = new Map();
  items.forEach((item) => {
    const key = item?.id ?? item?.email ?? item?.employeeId ?? `${item?.name || ''}-${item?.email || ''}`;
    if (!seen.has(key)) {
      seen.set(key, item);
    }
  });
  return Array.from(seen.values());
};

const initialState = {
  staff: initialStaff,
  filteredStaff: initialStaff,
  searchTerm: '',
  sortBy: 'name',
  filterBy: 'all',
  loading: false,
  error: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaffList: (state, action) => {
      const uniqueStaff = dedupeStaff(action.payload);
      state.staff = uniqueStaff;
      state.filteredStaff = uniqueStaff;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addStaff: (state, action) => {
      if (!state.staff.some(staff => staff.id === action.payload.id)) {
        state.staff.push(action.payload);
      }
      state.filteredStaff = dedupeStaff(state.staff);
    },
    updateStaff: (state, action) => {
      const index = state.staff.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index] = action.payload;
      }
      state.staff = dedupeStaff(state.staff);
      state.filteredStaff = dedupeStaff(state.staff);
    },
    deleteStaff: (state, action) => {
      state.staff = dedupeStaff(state.staff.filter(staff => staff.id !== action.payload));
      state.filteredStaff = state.staff;
    },
    archiveStaff: (state, action) => {
      const staff = state.staff.find(s => s.id === action.payload);
      if (staff) {
        staff.status = 'inactive';
        state.staff = dedupeStaff(state.staff);
        state.filteredStaff = dedupeStaff(state.staff);
      }
    },
    searchStaff: (state, action) => {
      state.searchTerm = action.payload;
      const query = action.payload.toLowerCase();
      state.filteredStaff = dedupeStaff(state.staff.filter(staff =>
        (staff.name || '').toLowerCase().includes(query) ||
        (staff.email || '').toLowerCase().includes(query) ||
        (staff.role || '').toLowerCase().includes(query) ||
        (staff.department || '').toLowerCase().includes(query)
      ));
    },
    sortStaff: (state, action) => {
      state.sortBy = action.payload;
      state.filteredStaff = dedupeStaff([...state.staff].sort((a, b) => {
        if (action.payload === 'name') {
          return (a.name || '').localeCompare(b.name || '');
        } else if (action.payload === 'role') {
          return (a.role || '').localeCompare(b.role || '');
        } else if (action.payload === 'department') {
          return (a.department || '').localeCompare(b.department || '');
        } else if (action.payload === 'hireDate') {
          return new Date(b.hireDate || 0) - new Date(a.hireDate || 0);
        }
        return 0;
      }));
    },
    filterStaff: (state, action) => {
      state.filterBy = action.payload;
      if (action.payload === 'all') {
        state.filteredStaff = dedupeStaff(state.staff);
      } else {
        state.filteredStaff = dedupeStaff(state.staff.filter(staff => staff.status === action.payload));
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setStaffList,
  setLoading,
  addStaff,
  updateStaff,
  deleteStaff,
  archiveStaff,
  searchStaff,
  sortStaff,
  filterStaff,
  setError,
} = staffSlice.actions;

export default staffSlice.reducer;