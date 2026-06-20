import { createSlice } from '@reduxjs/toolkit';

// Sample patient data
const samplePatients = [
  {
    id: 1,
    name: 'John Doe',
    nin: '12345678901',
    phone: '08012345678',
    email: 'john.doe@example.com',
    address: '123 Main Street, Lagos',
    tribe: 'Yoruba',
    lga: 'Ikeja',
    state: 'Lagos',
    dateOfBirth: '1990-05-15',
    bloodType: 'O+',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    nin: '23456789012',
    phone: '08023456789',
    email: 'jane.smith@example.com',
    address: '456 Broad Street, Abuja',
    tribe: 'Hausa',
    lga: 'Municipal Area Council',
    state: 'FCT (Abuja)',
    dateOfBirth: '1985-08-22',
    bloodType: 'A+',
    status: 'active',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: 3,
    name: 'Chika Nwosu',
    nin: '34567890123',
    phone: '08034567890',
    email: 'chika.nwosu@example.com',
    address: '789 Independence Road, Enugu',
    tribe: 'Igbo',
    lga: 'Enugu North',
    state: 'Enugu',
    dateOfBirth: '1992-11-30',
    bloodType: 'B+',
    status: 'active',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  }
];

// Initial state with sample data for testing
const initialState = {
  patients: samplePatients,
  filteredPatients: samplePatients,
  currentPatient: null,
  loading: false,
  error: null,
  searchTerm: '',
  sortBy: 'name',
  filterBy: 'all',
  showArchived: false, // New state for toggling archived patients
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    // Set all patients (useful for initial load)
    setPatients: (state, action) => {
      state.patients = action.payload;
      // Filter only active patients by default
      state.filteredPatients = action.payload.filter(patient => 
        state.showArchived ? true : patient.status === 'active'
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.patients.unshift(newPatient); // Add to beginning
      
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

    // Permanent deletion (hard delete)
    deletePatient: (state, action) => {
      const patientId = action.payload;
      
      // Remove from patients array
      state.patients = state.patients.filter(p => p.id !== patientId);
      
      // Clear current patient if it's the one being deleted
      if (state.currentPatient && state.currentPatient.id === patientId) {
        state.currentPatient = null;
      }
      
      // Update filtered patients
      updateFilteredPatients(state);
    },

    // Archive patient (soft delete)
    archivePatient: (state, action) => {
      const patientId = action.payload;
      const index = state.patients.findIndex(p => p.id === patientId);
      
      if (index !== -1) {
        state.patients[index] = {
          ...state.patients[index],
          status: 'archived',
          archivedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Clear current patient if it's the one being archived
        if (state.currentPatient && state.currentPatient.id === patientId) {
          state.currentPatient = null;
        }
        
        // Update filtered patients
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
  let filtered = [...state.patients];
  
  // Filter by status (active/archived)
  if (!state.showArchived) {
    filtered = filtered.filter(patient => patient.status === 'active');
  }
  
  // Filter by search term
  if (state.searchTerm) {
    const searchTerm = state.searchTerm.toLowerCase();
    filtered = filtered.filter(patient => {
      return (
        patient.name.toLowerCase().includes(searchTerm) ||
        (patient.nin && patient.nin.toLowerCase().includes(searchTerm)) ||
        (patient.phone && patient.phone.includes(searchTerm)) ||
        (patient.email && patient.email.toLowerCase().includes(searchTerm)) ||
        (patient.address && patient.address.toLowerCase().includes(searchTerm)) ||
        (patient.tribe && patient.tribe.toLowerCase().includes(searchTerm)) ||
        (patient.lga && patient.lga.toLowerCase().includes(searchTerm)) ||
        (patient.state && patient.state.toLowerCase().includes(searchTerm))
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