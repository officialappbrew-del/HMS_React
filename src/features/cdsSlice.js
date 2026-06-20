import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const checkDrugInteractions = createAsyncThunk(
  'cds/checkDrugInteractions',
  async (interactions, { rejectWithValue }) => {
    try {
      // In a real app, this would call a drug interaction API
      // const response = await api.post('/drug-interactions', { drugs: drugList });
      // return response.data;

      // Mock implementation
      return interactions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAllergies = createAsyncThunk(
  'cds/checkAllergies',
  async (allergyData, { rejectWithValue }) => {
    try {
      // Mock implementation
      return allergyData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const calculateDose = createAsyncThunk(
  'cds/calculateDose',
  async (dosingData, { rejectWithValue }) => {
    try {
      // Mock implementation - in real app would use pharmacokinetic database
      return dosingData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getClinicalGuidelines = createAsyncThunk(
  'cds/getClinicalGuidelines',
  async (filters, { rejectWithValue }) => {
    try {
      // Mock implementation
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const calculateRisk = createAsyncThunk(
  'cds/calculateRisk',
  async (riskData, { rejectWithValue }) => {
    try {
      // Mock implementation
      return riskData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPatientAlert = createAsyncThunk(
  'cds/addPatientAlert',
  async (alertData, { rejectWithValue }) => {
    try {
      // Mock implementation
      const newAlert = {
        id: Date.now(),
        ...alertData,
        timestamp: new Date().toISOString(),
        status: 'active'
      };
      return newAlert;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const dismissAlert = createAsyncThunk(
  'cds/dismissAlert',
  async (alertId, { rejectWithValue }) => {
    try {
      // Mock implementation
      return alertId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchGuidelines = createAsyncThunk(
  'cds/searchGuidelines',
  async (searchTerm, { rejectWithValue }) => {
    try {
      // Mock implementation
      return { searchTerm, results: [] };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePatientProfile = createAsyncThunk(
  'cds/updatePatientProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // Mock implementation
      return profileData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  drugInteractions: [],
  allergyAlerts: [],
  dosingRecommendations: null,
  clinicalGuidelines: [],
  riskCalculations: null,
  patientAlerts: [
    {
      id: 1,
      title: 'Drug Interaction Alert',
      message: 'Patient prescribed both Artemether-Lumefantrine and Metoclopramide. Risk of reduced antimalarial efficacy.',
      patientName: 'John Doe',
      priority: 'high',
      timestamp: '2024-01-27T10:30:00Z',
      type: 'drug_interaction'
    },
    {
      id: 2,
      title: 'Allergy Warning',
      message: 'Patient has penicillin allergy. Current prescription contains amoxicillin.',
      patientName: 'Jane Smith',
      priority: 'high',
      timestamp: '2024-01-27T09:15:00Z',
      type: 'allergy'
    },
    {
      id: 3,
      title: 'Dose Adjustment Required',
      message: 'Patient has renal impairment. Consider dose reduction for metformin.',
      patientName: 'Mike Johnson',
      priority: 'medium',
      timestamp: '2024-01-27T08:45:00Z',
      type: 'dosing'
    },
    {
      id: 4,
      title: 'High Cardiovascular Risk',
      message: 'Patient has 25% 10-year CVD risk. Lifestyle counseling recommended.',
      patientName: 'Sarah Williams',
      priority: 'medium',
      timestamp: '2024-01-27T11:00:00Z',
      type: 'risk_assessment'
    }
  ],
  searchResults: [],
  patientProfiles: [
    {
      id: 1,
      name: 'John Doe',
      allergies: ['penicillin', 'sulfa'],
      comorbidities: ['hypertension'],
      medications: ['amlodipine', 'metformin'],
      renalFunction: 'normal',
      hepaticFunction: 'normal',
      weight: 75,
      age: 45
    },
    {
      id: 2,
      name: 'Jane Smith',
      allergies: ['penicillin'],
      comorbidities: ['asthma'],
      medications: ['salbutamol', 'fluticasone'],
      renalFunction: 'mild',
      hepaticFunction: 'normal',
      weight: 65,
      age: 32
    }
  ],
  loading: false,
  error: null
};

// CDS slice
const cdsSlice = createSlice({
  name: 'cds',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.drugInteractions = [];
      state.allergyAlerts = [];
      state.dosingRecommendations = null;
      state.riskCalculations = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updatePatientAlert: (state, action) => {
      const { id, updates } = action.payload;
      const alert = state.patientAlerts.find(a => a.id === id);
      if (alert) {
        Object.assign(alert, updates);
      }
    },
    addGuidelineToFavorites: (state, action) => {
      // Mock implementation for guideline favorites
      console.log('Added guideline to favorites:', action.payload);
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Drug Interactions
      .addCase(checkDrugInteractions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkDrugInteractions.fulfilled, (state, action) => {
        state.loading = false;
        state.drugInteractions = action.payload;
      })
      .addCase(checkDrugInteractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Allergies
      .addCase(checkAllergies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAllergies.fulfilled, (state, action) => {
        state.loading = false;
        state.allergyAlerts = action.payload;
      })
      .addCase(checkAllergies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Calculate Dose
      .addCase(calculateDose.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateDose.fulfilled, (state, action) => {
        state.loading = false;
        state.dosingRecommendations = action.payload;
      })
      .addCase(calculateDose.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Clinical Guidelines
      .addCase(getClinicalGuidelines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClinicalGuidelines.fulfilled, (state, action) => {
        state.loading = false;
        state.clinicalGuidelines = action.payload;
      })
      .addCase(getClinicalGuidelines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Calculate Risk
      .addCase(calculateRisk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateRisk.fulfilled, (state, action) => {
        state.loading = false;
        state.riskCalculations = action.payload;
      })
      .addCase(calculateRisk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Patient Alert
      .addCase(addPatientAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPatientAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.patientAlerts.push(action.payload);
      })
      .addCase(addPatientAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Dismiss Alert
      .addCase(dismissAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dismissAlert.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.patientAlerts.findIndex(a => a.id === action.payload);
        if (index !== -1) {
          state.patientAlerts.splice(index, 1);
        }
      })
      .addCase(dismissAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Guidelines
      .addCase(searchGuidelines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchGuidelines.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.results;
      })
      .addCase(searchGuidelines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Patient Profile
      .addCase(updatePatientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.patientProfiles.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.patientProfiles[index] = { ...state.patientProfiles[index], ...action.payload };
        }
      })
      .addCase(updatePatientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearResults,
  clearError,
  updatePatientAlert,
  addGuidelineToFavorites,
  setSearchTerm
} = cdsSlice.actions;

export default cdsSlice.reducer;