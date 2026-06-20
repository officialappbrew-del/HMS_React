import { createSlice } from '@reduxjs/toolkit';

const initialStaff = [
  {
    id: 1,
    name: 'Dr. Adebayo Johnson',
    email: 'adebayo.johnson@hms.ng',
    phone: '+2348012345678',
    role: 'Chief Medical Officer',
    department: 'Administration',
    status: 'active',
    hireDate: '2020-01-15',
    salary: 500000,
  },
  {
    id: 2,
    name: 'Nurse Fatima Ibrahim',
    email: 'fatima.ibrahim@hms.ng',
    phone: '+2348012345679',
    role: 'Registered Nurse',
    department: 'General Medicine',
    status: 'active',
    hireDate: '2021-03-10',
    salary: 150000,
  },
  {
    id: 3,
    name: 'Dr. Chukwuemeka Nwosu',
    email: 'chukwuemeka.nwosu@hms.ng',
    phone: '+2348012345680',
    role: 'Surgeon',
    department: 'Surgery',
    status: 'active',
    hireDate: '2019-07-22',
    salary: 400000,
  },
];

const initialState = {
  staff: initialStaff,
  filteredStaff: initialStaff,
  searchTerm: '',
  sortBy: 'name',
  filterBy: 'all',
  error: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    addStaff: (state, action) => {
      state.staff.push(action.payload);
      state.filteredStaff = state.staff;
    },
    updateStaff: (state, action) => {
      const index = state.staff.findIndex(staff => staff.id === action.payload.id);
      if (index !== -1) {
        state.staff[index] = action.payload;
        state.filteredStaff = state.staff;
      }
    },
    deleteStaff: (state, action) => {
      state.staff = state.staff.filter(staff => staff.id !== action.payload);
      state.filteredStaff = state.staff;
    },
    archiveStaff: (state, action) => {
      const staff = state.staff.find(s => s.id === action.payload);
      if (staff) {
        staff.status = 'inactive';
        state.filteredStaff = state.staff;
      }
    },
    searchStaff: (state, action) => {
      state.searchTerm = action.payload;
      state.filteredStaff = state.staff.filter(staff =>
        staff.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        staff.email.toLowerCase().includes(action.payload.toLowerCase()) ||
        staff.role.toLowerCase().includes(action.payload.toLowerCase()) ||
        staff.department.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    sortStaff: (state, action) => {
      state.sortBy = action.payload;
      state.filteredStaff = [...state.staff].sort((a, b) => {
        if (action.payload === 'name') {
          return a.name.localeCompare(b.name);
        } else if (action.payload === 'role') {
          return a.role.localeCompare(b.role);
        } else if (action.payload === 'department') {
          return a.department.localeCompare(b.department);
        } else if (action.payload === 'hireDate') {
          return new Date(b.hireDate) - new Date(a.hireDate);
        }
        return 0;
      });
    },
    filterStaff: (state, action) => {
      state.filterBy = action.payload;
      if (action.payload === 'all') {
        state.filteredStaff = state.staff;
      } else {
        state.filteredStaff = state.staff.filter(staff => staff.status === action.payload);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
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