import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  diseaseReports: [],
  contactTraces: [],
  epidemicMode: {
    isActive: false,
    disease: '',
    affectedArea: '',
    severity: 'moderate',
    responseLevel: 'local',
    caseCount: 0,
    containmentMeasures: [],
    resources: [],
    activatedAt: null,
    activatedBy: ''
  },
  epidemicReports: [],
  laboratorySamples: [],
  stats: {
    totalReports: 0,
    confirmedCases: 0,
    activeContacts: 0,
    pendingSubmissions: 0,
    epidemicAlerts: 0
  },
  searchTerm: '',
  sortBy: 'date',
  filterBy: 'all',
  loading: false,
  error: null
};

const ncdcSlice = createSlice({
  name: 'ncdc',
  initialState,
  reducers: {
    reportDisease: (state, action) => {
      const report = {
        id: `report-${Date.now()}`,
        ...action.payload,
        status: 'reported',
        submittedToNCDC: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.diseaseReports.push(report);
      state.stats.totalReports += 1;

      // Auto-create contact trace for confirmed cases
      if (report.severity === 'confirmed') {
        const contactTrace = {
          id: `contact-${Date.now()}`,
          patientId: report.patientId,
          patientName: report.patientName,
          disease: report.disease,
          contactName: 'Primary Contact',
          phone: '',
          location: report.location,
          relationship: 'close_contact',
          lastContactDate: report.diagnosisDate,
          followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days later
          status: 'monitoring',
          symptoms: [],
          createdAt: new Date().toISOString()
        };
        state.contactTraces.push(contactTrace);
        state.stats.activeContacts += 1;
      }
    },

    submitToNCDC: (state, action) => {
      const { reportId } = action.payload;
      const reportIndex = state.diseaseReports.findIndex(r => r.id === reportId);
      if (reportIndex !== -1) {
        state.diseaseReports[reportIndex].status = 'submitted';
        state.diseaseReports[reportIndex].submittedToNCDC = true;
        state.diseaseReports[reportIndex].submittedAt = new Date().toISOString();
        state.stats.pendingSubmissions -= 1;
      }
    },

    activateEpidemicMode: (state, action) => {
      state.epidemicMode = {
        ...action.payload,
        isActive: true,
        activatedAt: new Date().toISOString(),
        activatedBy: 'System Admin',
        containmentMeasures: [
          'Isolation of confirmed cases',
          'Contact tracing and quarantine',
          'Public health education campaigns',
          'Enhanced surveillance in affected areas',
          'Resource mobilization and distribution'
        ],
        resources: [
          'Personal Protective Equipment (PPE)',
          'Testing kits and laboratory support',
          'Isolation facilities',
          'Medical personnel deployment',
          'Public communication materials'
        ]
      };
      state.stats.epidemicAlerts += 1;
    },

    deactivateEpidemicMode: (state) => {
      state.epidemicMode = {
        ...initialState.epidemicMode,
        isActive: false
      };
    },

    createContactTrace: (state, action) => {
      const contactTrace = {
        id: `contact-${Date.now()}`,
        ...action.payload,
        status: 'monitoring',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.contactTraces.push(contactTrace);
      state.stats.activeContacts += 1;
    },

    updateContactTrace: (state, action) => {
      const { contactId, updates } = action.payload;
      const contactIndex = state.contactTraces.findIndex(c => c.id === contactId);
      if (contactIndex !== -1) {
        state.contactTraces[contactIndex] = {
          ...state.contactTraces[contactIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    generateEpidemicReport: (state, action) => {
      const { disease, startDate, endDate } = action.payload;
      const relevantReports = state.diseaseReports.filter(report =>
        report.disease === disease &&
        new Date(report.reportingDate) >= new Date(startDate) &&
        new Date(report.reportingDate) <= new Date(endDate)
      );

      const report = {
        id: `epidemic-report-${Date.now()}`,
        disease,
        startDate,
        endDate,
        totalCases: relevantReports.length,
        confirmedCases: relevantReports.filter(r => r.severity === 'confirmed').length,
        fatalities: relevantReports.filter(r => r.outcome === 'fatal').length,
        recovered: relevantReports.filter(r => r.outcome === 'recovered').length,
        activeCases: relevantReports.filter(r => r.outcome === 'active').length,
        affectedAreas: [...new Set(relevantReports.map(r => r.location))],
        generatedAt: new Date().toISOString(),
        generatedBy: 'System'
      };

      state.epidemicReports.push(report);
    },

    submitLaboratorySample: (state, action) => {
      const sample = {
        id: `sample-${Date.now()}`,
        ...action.payload,
        status: 'collected',
        collectedAt: new Date().toISOString(),
        sentToLabAt: null,
        resultsReceivedAt: null,
        result: null
      };
      state.laboratorySamples.push(sample);
    },

    updateLaboratoryResult: (state, action) => {
      const { sampleId, result } = action.payload;
      const sampleIndex = state.laboratorySamples.findIndex(s => s.id === sampleId);
      if (sampleIndex !== -1) {
        state.laboratorySamples[sampleIndex].result = result;
        state.laboratorySamples[sampleIndex].resultsReceivedAt = new Date().toISOString();
        state.laboratorySamples[sampleIndex].status = 'completed';
      }
    },

    searchSurveillance: (state, action) => {
      state.searchTerm = action.payload;
    },

    sortSurveillance: (state, action) => {
      state.sortBy = action.payload;
    },

    filterSurveillance: (state, action) => {
      state.filterBy = action.payload;
    },

    updateReportStatus: (state, action) => {
      const { reportId, status } = action.payload;
      const reportIndex = state.diseaseReports.findIndex(r => r.id === reportId);
      if (reportIndex !== -1) {
        state.diseaseReports[reportIndex].status = status;
        state.diseaseReports[reportIndex].updatedAt = new Date().toISOString();
      }
    },

    deleteReport: (state, action) => {
      const reportId = action.payload;
      state.diseaseReports = state.diseaseReports.filter(r => r.id !== reportId);
      state.stats.totalReports -= 1;
    },

    deleteContactTrace: (state, action) => {
      const contactId = action.payload;
      state.contactTraces = state.contactTraces.filter(c => c.id !== contactId);
      state.stats.activeContacts -= 1;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Initialize with sample data
    initializeSampleData: (state) => {
      // Sample disease reports
      const sampleReports = [
        {
          id: 'report-1',
          disease: 'Cholera',
          patientId: 'PAT-001',
          patientName: 'John Adebayo',
          age: 35,
          gender: 'male',
          location: 'Lagos',
          symptoms: ['Diarrhea', 'Vomiting', 'Dehydration'],
          diagnosisDate: '2024-01-15',
          reportingDate: '2024-01-15',
          severity: 'confirmed',
          labConfirmed: true,
          outcome: 'recovered',
          reporter: 'Dr. Smith',
          contactInfo: '+2348012345678',
          status: 'submitted',
          submittedToNCDC: true,
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'report-2',
          disease: 'Lassa Fever',
          patientId: 'PAT-002',
          patientName: 'Mary Johnson',
          age: 28,
          gender: 'female',
          location: 'Abuja',
          symptoms: ['Fever', 'Headache', 'Sore throat'],
          diagnosisDate: '2024-01-20',
          reportingDate: '2024-01-20',
          severity: 'probable',
          labConfirmed: false,
          outcome: 'active',
          reporter: 'Dr. Brown',
          contactInfo: '+2348012345679',
          status: 'reported',
          submittedToNCDC: false,
          createdAt: '2024-01-20T14:30:00Z'
        },
        {
          id: 'report-3',
          disease: 'COVID-19',
          patientId: 'PAT-003',
          patientName: 'David Okon',
          age: 45,
          gender: 'male',
          location: 'Port Harcourt',
          symptoms: ['Fever', 'Cough', 'Loss of taste'],
          diagnosisDate: '2024-01-22',
          reportingDate: '2024-01-22',
          severity: 'confirmed',
          labConfirmed: true,
          outcome: 'recovered',
          reporter: 'Dr. Wilson',
          contactInfo: '+2348012345680',
          status: 'submitted',
          submittedToNCDC: true,
          createdAt: '2024-01-22T09:15:00Z'
        }
      ];

      // Sample contact traces
      const sampleContacts = [
        {
          id: 'contact-1',
          patientId: 'PAT-001',
          patientName: 'John Adebayo',
          disease: 'Cholera',
          contactName: 'Sarah Adebayo',
          phone: '+2348012345681',
          location: 'Lagos',
          relationship: 'family_member',
          lastContactDate: '2024-01-14',
          followUpDate: '2024-01-29',
          status: 'monitoring',
          symptoms: [],
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'contact-2',
          patientId: 'PAT-002',
          patientName: 'Mary Johnson',
          disease: 'Lassa Fever',
          contactName: 'Peter Johnson',
          phone: '+2348012345682',
          location: 'Abuja',
          relationship: 'close_contact',
          lastContactDate: '2024-01-19',
          followUpDate: '2024-01-30',
          status: 'monitoring',
          symptoms: ['mild_fever'],
          createdAt: '2024-01-20T14:30:00Z'
        }
      ];

      state.diseaseReports = sampleReports;
      state.contactTraces = sampleContacts;
      state.stats.totalReports = sampleReports.length;
      state.stats.activeContacts = sampleContacts.length;
      state.stats.confirmedCases = sampleReports.filter(r => r.severity === 'confirmed').length;
      state.stats.pendingSubmissions = sampleReports.filter(r => !r.submittedToNCDC).length;
    }
  }
});

export const {
  reportDisease,
  submitToNCDC,
  activateEpidemicMode,
  deactivateEpidemicMode,
  createContactTrace,
  updateContactTrace,
  generateEpidemicReport,
  submitLaboratorySample,
  updateLaboratoryResult,
  searchSurveillance,
  sortSurveillance,
  filterSurveillance,
  updateReportStatus,
  deleteReport,
  deleteContactTrace,
  setLoading,
  setError,
  clearError,
  initializeSampleData
} = ncdcSlice.actions;

export default ncdcSlice.reducer;