import { createSlice } from '@reduxjs/toolkit';

const initialPatients = [];

const dedupePatients = (items = []) => {
  const seen = new Map();
  items.forEach((item) => {
    const key = item?.id ?? item?.hospital_number ?? item?.email ?? item?.nin ?? `${item?.name || ''}-${item?.phone || ''}`;
    if (!seen.has(key)) {
      seen.set(key, item);
    }
  });
  return Array.from(seen.values());
};

const initialState = {
  patients: initialPatients,
  filteredPatients: initialPatients,
  currentPatient: null,
  loading: false,
  error: null,
  searchTerm: '',
  sortBy: 'name',
  filterBy: 'all',
  showArchived: false,
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    // Set all patients (useful for initial load)
    setPatients: (state, action) => {
      const uniquePatients = dedupePatients(action.payload);
      state.patients = uniquePatients;
      // Filter only active patients by default
      state.filteredPatients = uniquePatients.filter(patient =>
        state.showArchived ? true : patient.patient_status === 'active'
      );
    },

    // Set current patient for detailed view
    setCurrentPatient: (state, action) => {
      state.currentPatient = action.payload;
    },

    // Add new patient
    addPatient: (state, action) => {
      const newPatient = {
        ...action.payload,
        id: Date.now(), // Generate unique ID
        status: 'active',
        patient_status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (!state.patients.some(patient => patient.id === newPatient.id)) {
        state.patients.unshift(newPatient);
      }
      state.patients = dedupePatients(state.patients);
      
      // Update filtered patients based on current filters
      updateFilteredPatients(state);
    },

    // Update existing patient
    updatePatient: (state, action) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = {
          ...state.patients[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
        
        // Update current patient if it's the one being edited
        if (state.currentPatient && state.currentPatient.id === action.payload.id) {
          state.currentPatient = state.patients[index];
        }
        
        // Update filtered patients
        updateFilteredPatients(state);
      }
    },

    // Soft deletion: mark record inactive instead of removing it
    deletePatient: (state, action) => {
      const patientId = action.payload;
      const index = state.patients.findIndex(p => p.id === patientId);
      
      if (index !== -1) {
        state.patients[index] = {
          ...state.patients[index],
          status: 'inactive',
          patient_status: 'inactive',
          is_active: false,
          updatedAt: new Date().toISOString(),
        };
        
        if (state.currentPatient && state.currentPatient.id === patientId) {
          state.currentPatient = null;
        }
        
        updateFilteredPatients(state);
      }
    },

    // Archive patient (soft delete)
    archivePatient: (state, action) => {
      const patientId = action.payload;
      const index = state.patients.findIndex(p => p.id === patientId);
      
      if (index !== -1) {
        state.patients[index] = {
          ...state.patients[index],
          status: 'inactive',
          patient_status: 'inactive',
          is_active: false,
          archivedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        if (state.currentPatient && state.currentPatient.id === patientId) {
          state.currentPatient = null;
        }
        
        updateFilteredPatients(state);
      }
    },

    // Restore archived patient
    restorePatient: (state, action) => {
      const patientId = action.payload;
      const index = state.patients.findIndex(p => p.id === patientId);
      
      if (index !== -1) {
        state.patients[index] = {
          ...state.patients[index],
          status: 'active',
          patient_status: 'active',
          restoredAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Update filtered patients
        updateFilteredPatients(state);
      }
    },

    // Search patients
    searchPatients: (state, action) => {
      state.searchTerm = action.payload;
      updateFilteredPatients(state);
    },

    // Sort patients
    sortPatients: (state, action) => {
      state.sortBy = action.payload;
      updateFilteredPatients(state);
    },

    // Filter by state
    filterPatients: (state, action) => {
      state.filterBy = action.payload;
      updateFilteredPatients(state);
    },

    // Toggle showing archived patients
    toggleShowArchived: (state, action) => {
      state.showArchived = action.payload;
      updateFilteredPatients(state);
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset filters
    resetFilters: (state) => {
      state.searchTerm = '';
      state.sortBy = 'name';
      state.filterBy = 'all';
      updateFilteredPatients(state);
    },

    // Export patient data
    exportPatients: (state) => {
      // This would typically trigger a download in a real app
      const exportData = state.filteredPatients.map(patient => ({
        Name: patient.name,
        NIN: patient.nin,
        Phone: patient.phone,
        Email: patient.email,
        State: patient.state,
        LGA: patient.lga,
        Tribe: patient.tribe,
        'Blood Type': patient.bloodType,
        Status: patient.status,
        'Date of Birth': patient.dateOfBirth,
        'Date Added': patient.createdAt,
      }));
      
      console.log('Exporting patient data:', exportData);
      // In a real app, you would convert to CSV/Excel and trigger download
      return exportData;
    },
  },
});

// Helper function to update filtered patients based on all criteria
const updateFilteredPatients = (state) => {
  let filtered = dedupePatients([...state.patients]);
  
  // Filter by status (active/archived)
  if (!state.showArchived) {
    filtered = filtered.filter(patient => patient.patient_status === 'active');
  }
  
  // Filter by search term
  if (state.searchTerm) {
    const searchTerm = state.searchTerm.toLowerCase();
    filtered = filtered.filter(patient => {
      const name = (patient.name || patient.full_name || '').toString().toLowerCase();
      const hospitalNumber = (patient.hospital_number || patient.hospitalNumber || patient.patient_id || '').toString().toLowerCase();
      const firstName = (patient.first_name || '').toString().toLowerCase();
      const lastName = (patient.last_name || '').toString().toLowerCase();
      const nin = (patient.nin || patient.nhis_number || '').toString().toLowerCase();
      const phone = (patient.phone || patient.phone_number || '').toString().toLowerCase();
      const email = (patient.email || '').toString().toLowerCase();
      const address = (patient.address || '').toString().toLowerCase();
      const tribe = (patient.tribe || '').toString().toLowerCase();
      const lga = (patient.lga || '').toString().toLowerCase();
      const state = (patient.state || '').toString().toLowerCase();

      return (
        name.includes(searchTerm) ||
        hospitalNumber.includes(searchTerm) ||
        firstName.includes(searchTerm) ||
        lastName.includes(searchTerm) ||
        nin.includes(searchTerm) ||
        phone.includes(searchTerm) ||
        email.includes(searchTerm) ||
        address.includes(searchTerm) ||
        tribe.includes(searchTerm) ||
        lga.includes(searchTerm) ||
        state.includes(searchTerm)
      );
    });
  }
  
  // Filter by state
  if (state.filterBy !== 'all') {
    filtered = filtered.filter(patient => patient.state === state.filterBy);
  }
  
  // Apply sorting
  switch (state.sortBy) {
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'date':
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'state':
      filtered.sort((a, b) => (a.state || '').localeCompare(b.state || ''));
      break;
    case 'status':
      filtered.sort((a, b) => a.status.localeCompare(b.status));
      break;
    case 'recent':
      filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      break;
    default:
      break;
  }
  
  state.filteredPatients = filtered;
};

export const {
  setPatients,
  setCurrentPatient,
  addPatient,
  updatePatient,
  deletePatient,
  archivePatient,
  restorePatient,
  searchPatients,
  sortPatients,
  filterPatients,
  toggleShowArchived,
  setLoading,
  setError,
  clearError,
  resetFilters,
  exportPatients,
} = patientSlice.actions;

// Selectors for easy state access
export const selectAllPatients = (state) => state.patient.patients;
export const selectFilteredPatients = (state) => state.patient.filteredPatients;
export const selectCurrentPatient = (state) => state.patient.currentPatient;
export const selectPatientById = (id) => (state) => 
  state.patient.patients.find(p => p.id === id);
export const selectActivePatients = (state) => 
  state.patient.patients.filter(p => p.status === 'active');
export const selectArchivedPatients = (state) => 
  state.patient.patients.filter(p => p.status === 'archived');
export const selectPatientStats = (state) => {
  const patients = state.patient.patients;
  return {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    archived: patients.filter(p => p.status === 'archived').length,
    byState: patients.reduce((acc, patient) => {
      const state = patient.state || 'Unknown';
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {}),
    byBloodType: patients.reduce((acc, patient) => {
      const bloodType = patient.bloodType || 'Unknown';
      acc[bloodType] = (acc[bloodType] || 0) + 1;
      return acc;
    }, {}),
  };
};

export default patientSlice.reducer;