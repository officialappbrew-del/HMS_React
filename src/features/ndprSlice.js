import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  consentRecords: [],
  dataRequests: [],
  dataBreaches: [],
  auditLogs: [],
  complianceMetrics: {
    consentCompliance: 94.2,
    dataRequestProcessing: 98.5,
    breachResponseTime: 2.3,
    auditCompliance: 96.8,
    trainingCompletion: 89.3
  },
  searchTerm: '',
  filterBy: 'all',
  loading: false,
  error: null
};

const ndprSlice = createSlice({
  name: 'ndpr',
  initialState,
  reducers: {
    createConsentRecord: (state, action) => {
      const consent = {
        id: `consent-${Date.now()}`,
        ...action.payload,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiryDate: action.payload.retentionPeriod
          ? new Date(Date.now() + (parseInt(action.payload.retentionPeriod) * 365 * 24 * 60 * 60 * 1000)).toISOString()
          : null
      };
      state.consentRecords.push(consent);
    },

    updateConsentRecord: (state, action) => {
      const { consentId, updates } = action.payload;
      const consentIndex = state.consentRecords.findIndex(c => c.id === consentId);
      if (consentIndex !== -1) {
        state.consentRecords[consentIndex] = {
          ...state.consentRecords[consentIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    withdrawConsent: (state, action) => {
      const { consentId, reason } = action.payload;
      const consentIndex = state.consentRecords.findIndex(c => c.id === consentId);
      if (consentIndex !== -1) {
        state.consentRecords[consentIndex].status = 'withdrawn';
        state.consentRecords[consentIndex].withdrawalReason = reason;
        state.consentRecords[consentIndex].withdrawnAt = new Date().toISOString();
        state.consentRecords[consentIndex].updatedAt = new Date().toISOString();
      }
    },

    submitDataRequest: (state, action) => {
      const request = {
        id: `request-${Date.now()}`,
        ...action.payload,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        processingTime: null,
        response: null,
        completedAt: null
      };
      state.dataRequests.push(request);
    },

    processDataRequest: (state, action) => {
      const { requestId, action: requestAction } = action.payload;
      const requestIndex = state.dataRequests.findIndex(r => r.id === requestId);
      if (requestIndex !== -1) {
        const request = state.dataRequests[requestIndex];
        request.status = requestAction === 'approve' ? 'approved' : 'rejected';
        request.processedAt = new Date().toISOString();
        request.processingTime = `${Math.floor((new Date() - new Date(request.submittedAt)) / (1000 * 60 * 60 * 24))} days`;
        request.updatedAt = new Date().toISOString();

        if (requestAction === 'approve') {
          // Set completion date based on urgency
          const completionDays = request.urgency === 'critical' ? 3 : request.urgency === 'urgent' ? 15 : 30;
          request.completedAt = new Date(Date.now() + completionDays * 24 * 60 * 60 * 1000).toISOString();
        }
      }
    },

    reportDataBreach: (state, action) => {
      const breach = {
        id: `breach-${Date.now()}`,
        ...action.payload,
        status: 'investigating',
        reportedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        responseTime: Math.floor((new Date() - new Date(action.payload.discoveryDate)) / (1000 * 60 * 60)),
        notificationsSent: 0,
        investigationFindings: null,
        preventiveActions: null
      };
      state.dataBreaches.push(breach);
    },

    updateBreachStatus: (state, action) => {
      const { breachId, status, updates } = action.payload;
      const breachIndex = state.dataBreaches.findIndex(b => b.id === breachId);
      if (breachIndex !== -1) {
        state.dataBreaches[breachIndex] = {
          ...state.dataBreaches[breachIndex],
          ...updates,
          status,
          updatedAt: new Date().toISOString()
        };
      }
    },

    generateComplianceReport: (state, action) => {
      const { period, reportType } = action.payload;
      // In a real app, this would generate and download a report
      console.log(`Generating ${reportType} compliance report for ${period}`);
    },

    auditDataAccess: (state, action) => {
      const auditLog = {
        id: `audit-${Date.now()}`,
        ...action.payload,
        timestamp: new Date().toISOString()
      };
      state.auditLogs.push(auditLog);

      // Keep only last 1000 audit logs
      if (state.auditLogs.length > 1000) {
        state.auditLogs = state.auditLogs.slice(-1000);
      }
    },

    searchComplianceData: (state, action) => {
      state.searchTerm = action.payload;
    },

    filterComplianceData: (state, action) => {
      state.filterBy = action.payload;
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
      // Sample consent records
      const sampleConsents = [
        {
          id: 'consent-1',
          patientId: 'PAT-001',
          patientName: 'John Adebayo',
          consentType: 'treatment',
          purpose: 'Medical treatment and care services',
          dataCategories: ['Medical Records', 'Personal Information', 'Contact Details'],
          retentionPeriod: '10',
          thirdParties: ['NHIS', 'Laboratory Partners'],
          consentMethod: 'digital',
          witnessName: '',
          status: 'active',
          createdAt: '2024-01-15T10:00:00Z',
          expiryDate: '2034-01-15T10:00:00Z'
        },
        {
          id: 'consent-2',
          patientId: 'PAT-002',
          patientName: 'Mary Johnson',
          consentType: 'data_processing',
          purpose: 'Processing of personal and medical data for healthcare services',
          dataCategories: ['Medical Records', 'Personal Information', 'Financial Data'],
          retentionPeriod: '5',
          thirdParties: ['Insurance Providers', 'Government Agencies'],
          consentMethod: 'paper',
          witnessName: 'Dr. Smith',
          status: 'active',
          createdAt: '2024-01-20T14:30:00Z',
          expiryDate: '2029-01-20T14:30:00Z'
        },
        {
          id: 'consent-3',
          patientId: 'PAT-003',
          patientName: 'David Okon',
          consentType: 'research',
          purpose: 'Participation in medical research studies',
          dataCategories: ['Medical Records', 'Research Data'],
          retentionPeriod: 'indefinite',
          thirdParties: ['Research Institutions', 'University Hospitals'],
          consentMethod: 'digital',
          witnessName: '',
          status: 'withdrawn',
          createdAt: '2024-01-10T09:15:00Z',
          withdrawnAt: '2024-01-25T11:20:00Z',
          withdrawalReason: 'Patient changed mind about research participation'
        }
      ];

      // Sample data requests
      const sampleRequests = [
        {
          id: 'request-1',
          requesterType: 'data_subject',
          requesterName: 'Sarah Williams',
          requesterContact: 'sarah.williams@email.com',
          requestType: 'access',
          dataCategories: ['Medical Records', 'Personal Information'],
          reason: 'Patient wants to review their complete medical history',
          urgency: 'normal',
          identityVerification: 'National ID verified',
          status: 'completed',
          submittedAt: '2024-01-15T10:30:00Z',
          processedAt: '2024-01-18T14:20:00Z',
          processingTime: '3 days',
          completedAt: '2024-01-20T16:45:00Z'
        },
        {
          id: 'request-2',
          requesterType: 'legal_representative',
          requesterName: 'Michael Brown',
          requesterContact: '+2348012345678',
          requestType: 'erasure',
          dataCategories: ['All Data'],
          reason: 'Legal representative requesting complete data deletion as per court order',
          urgency: 'urgent',
          identityVerification: 'Court order verified',
          status: 'approved',
          submittedAt: '2024-01-22T09:15:00Z',
          processedAt: '2024-01-23T11:30:00Z',
          processingTime: '1 day'
        },
        {
          id: 'request-3',
          requesterType: 'data_subject',
          requesterName: 'Grace Okafor',
          requesterContact: 'grace.okafor@email.com',
          requestType: 'rectification',
          dataCategories: ['Personal Information'],
          reason: 'Patient found incorrect contact information in records',
          urgency: 'normal',
          identityVerification: 'Email verification completed',
          status: 'pending',
          submittedAt: '2024-01-25T13:45:00Z'
        }
      ];

      // Sample data breaches
      const sampleBreaches = [
        {
          id: 'breach-1',
          breachType: 'unauthorized_access',
          affectedData: ['Medical Records', 'Personal Information'],
          affectedIndividuals: 45,
          breachDate: '2024-01-18T14:30:00Z',
          discoveryDate: '2024-01-18T16:45:00Z',
          description: 'Unauthorized access to patient database by former employee using stolen credentials',
          containmentActions: 'Immediate password reset, account suspension, system access review',
          impactAssessment: 'Potential identity theft risk, no financial data compromised',
          reportedToNITDA: true,
          notificationSent: true,
          status: 'resolved',
          reportedAt: '2024-01-18T17:00:00Z',
          responseTime: 2.25,
          notificationsSent: 45,
          investigationFindings: 'Insider threat from terminated employee',
          preventiveActions: 'Enhanced access controls, mandatory password changes, security training'
        },
        {
          id: 'breach-2',
          breachType: 'system_failure',
          affectedData: ['Medical Records'],
          affectedIndividuals: 12,
          breachDate: '2024-01-20T08:15:00Z',
          discoveryDate: '2024-01-20T08:30:00Z',
          description: 'System backup failure resulted in temporary unavailability of patient records',
          containmentActions: 'Switched to redundant systems, restored from secondary backup',
          impactAssessment: 'Temporary service disruption, no data loss or unauthorized access',
          reportedToNITDA: false,
          notificationSent: false,
          status: 'resolved',
          reportedAt: '2024-01-20T09:00:00Z',
          responseTime: 0.25,
          notificationsSent: 0
        }
      ];

      // Sample audit logs
      const sampleAuditLogs = [
        {
          id: 'audit-1',
          user: 'Dr. Johnson',
          action: 'Patient data accessed',
          patientId: 'PAT-001',
          dataAccessed: 'Medical Records',
          timestamp: '2024-01-25T10:30:00Z',
          ipAddress: '192.168.1.100',
          purpose: 'Patient consultation'
        },
        {
          id: 'audit-2',
          user: 'Nurse Williams',
          action: 'Data export requested',
          patientId: 'PAT-002',
          dataAccessed: 'Complete Medical History',
          timestamp: '2024-01-25T11:15:00Z',
          ipAddress: '192.168.1.101',
          purpose: 'Data subject access request'
        },
        {
          id: 'audit-3',
          user: 'Admin User',
          action: 'Bulk data query',
          patientId: 'Multiple',
          dataAccessed: 'Compliance Report Data',
          timestamp: '2024-01-25T14:20:00Z',
          ipAddress: '192.168.1.1',
          purpose: 'Monthly compliance audit'
        }
      ];

      state.consentRecords = sampleConsents;
      state.dataRequests = sampleRequests;
      state.dataBreaches = sampleBreaches;
      state.auditLogs = sampleAuditLogs;
    }
  }
});

export const {
  createConsentRecord,
  updateConsentRecord,
  withdrawConsent,
  submitDataRequest,
  processDataRequest,
  reportDataBreach,
  updateBreachStatus,
  generateComplianceReport,
  auditDataAccess,
  searchComplianceData,
  filterComplianceData,
  setLoading,
  setError,
  clearError,
  initializeSampleData
} = ndprSlice.actions;

export default ndprSlice.reducer;