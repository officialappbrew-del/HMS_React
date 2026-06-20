import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  audits: [],
  qualityIndicators: [],
  peerReviews: [],
  mortalityReviews: [],
  complianceScores: {
    overall: 89.5,
    protocols: {},
    departments: {}
  },
  auditReports: [],
  searchTerm: '',
  filterBy: 'all',
  loading: false,
  error: null
};

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    createAudit: (state, action) => {
      const audit = {
        id: `audit-${Date.now()}`,
        ...action.payload,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        findings: [],
        recommendations: [],
        completionDate: null
      };
      state.audits.push(audit);
    },

    updateAudit: (state, action) => {
      const { auditId, updates } = action.payload;
      const auditIndex = state.audits.findIndex(a => a.id === auditId);
      if (auditIndex !== -1) {
        state.audits[auditIndex] = {
          ...state.audits[auditIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    completeAudit: (state, action) => {
      const { auditId } = action.payload;
      const auditIndex = state.audits.findIndex(a => a.id === auditId);
      if (auditIndex !== -1) {
        state.audits[auditIndex].status = 'completed';
        state.audits[auditIndex].completionDate = new Date().toISOString();
        state.audits[auditIndex].updatedAt = new Date().toISOString();

        // Generate sample findings and recommendations
        state.audits[auditIndex].findings = [
          'Good compliance with hand hygiene protocols',
          'Some delays in medication administration',
          'Excellent patient documentation standards'
        ];
        state.audits[auditIndex].recommendations = [
          'Implement electronic medication administration system',
          'Additional training on time management',
          'Continue excellent documentation practices'
        ];
      }
    },

    scheduleAudit: (state, action) => {
      const { auditId, scheduledDate } = action.payload;
      const auditIndex = state.audits.findIndex(a => a.id === auditId);
      if (auditIndex !== -1) {
        state.audits[auditIndex].scheduledDate = scheduledDate;
        state.audits[auditIndex].updatedAt = new Date().toISOString();
      }
    },

    createQualityIndicator: (state, action) => {
      const indicator = {
        id: `indicator-${Date.now()}`,
        ...action.payload,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: []
      };
      state.qualityIndicators.push(indicator);
    },

    updateQualityIndicator: (state, action) => {
      const { indicatorId, updates } = action.payload;
      const indicatorIndex = state.qualityIndicators.findIndex(i => i.id === indicatorId);
      if (indicatorIndex !== -1) {
        const currentValue = state.qualityIndicators[indicatorIndex].current;
        state.qualityIndicators[indicatorIndex] = {
          ...state.qualityIndicators[indicatorIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        // Add to history if value changed
        if (updates.current && updates.current !== currentValue) {
          state.qualityIndicators[indicatorIndex].history.push({
            date: new Date().toISOString(),
            value: updates.current,
            previousValue: currentValue
          });
        }
      }
    },

    generateAuditReport: (state, action) => {
      const { auditId, reportData } = action.payload;
      const report = {
        id: `report-${Date.now()}`,
        auditId,
        ...reportData,
        generatedAt: new Date().toISOString(),
        generatedBy: 'System'
      };
      state.auditReports.push(report);
    },

    schedulePeerReview: (state, action) => {
      const { auditId } = action.payload;
      const audit = state.audits.find(a => a.id === auditId);
      if (audit) {
        const peerReview = {
          id: `peer-review-${Date.now()}`,
          auditId,
          title: `Peer Review: ${audit.title}`,
          auditTitle: audit.title,
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
          status: 'scheduled',
          reviewers: ['Dr. Johnson', 'Dr. Williams', 'Dr. Brown'],
          casesCount: 5,
          recommendationsCount: 0,
          createdAt: new Date().toISOString()
        };
        state.peerReviews.push(peerReview);
      }
    },

    createMortalityReview: (state, action) => {
      const mortalityReview = {
        id: `mm-review-${Date.now()}`,
        ...action.payload,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attendees: [],
        lessonsLearned: [],
        recommendations: []
      };
      state.mortalityReviews.push(mortalityReview);
    },

    updateComplianceScore: (state, action) => {
      const { protocol, score, department } = action.payload;
      if (department) {
        if (!state.complianceScores.departments[department]) {
          state.complianceScores.departments[department] = {};
        }
        state.complianceScores.departments[department][protocol] = score;
      } else {
        state.complianceScores.protocols[protocol] = score;

        // Recalculate overall compliance
        const protocolScores = Object.values(state.complianceScores.protocols);
        state.complianceScores.overall = protocolScores.length > 0
          ? protocolScores.reduce((sum, score) => sum + score, 0) / protocolScores.length
          : 0;
      }
    },

    searchAudits: (state, action) => {
      state.searchTerm = action.payload;
    },

    filterAudits: (state, action) => {
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
      // Sample audits
      const sampleAudits = [
        {
          id: 'audit-1',
          title: 'Emergency Department Clinical Audit',
          type: 'clinical',
          department: 'Emergency',
          auditor: 'Dr. Sarah Johnson',
          scheduledDate: '2024-01-20T10:00:00Z',
          status: 'completed',
          description: 'Comprehensive audit of emergency department clinical practices and patient care standards',
          createdAt: '2024-01-15T09:00:00Z',
          completionDate: '2024-01-20T15:30:00Z',
          findings: [
            'Excellent triage system implementation',
            'Good documentation standards maintained',
            'Some delays in laboratory result turnaround times'
          ],
          recommendations: [
            'Implement electronic tracking for lab results',
            'Additional training on time management',
            'Continue excellent triage practices'
          ]
        },
        {
          id: 'audit-2',
          title: 'Surgical Safety Checklist Compliance',
          type: 'quality',
          department: 'Surgery',
          auditor: 'Dr. Michael Brown',
          scheduledDate: '2024-01-25T14:00:00Z',
          status: 'scheduled',
          description: 'Audit of WHO surgical safety checklist compliance across all surgical procedures',
          createdAt: '2024-01-18T11:00:00Z',
          findings: [],
          recommendations: []
        },
        {
          id: 'audit-3',
          title: 'Pharmacy Medication Management',
          type: 'administrative',
          department: 'Pharmacy',
          auditor: 'Dr. Emily Davis',
          scheduledDate: '2024-01-22T09:00:00Z',
          status: 'in_progress',
          description: 'Review of medication management processes, storage, and dispensing procedures',
          createdAt: '2024-01-19T08:00:00Z',
          findings: [],
          recommendations: []
        }
      ];

      // Sample quality indicators
      const sampleIndicators = [
        {
          id: 'indicator-1',
          name: 'Hand Hygiene Compliance',
          category: 'safety',
          target: '95%',
          current: '92%',
          unit: '%',
          department: 'Hospital-wide',
          frequency: 'monthly',
          description: 'Percentage of healthcare workers complying with hand hygiene protocols',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          history: [
            { date: '2024-01-01T00:00:00Z', value: '88%', previousValue: '85%' },
            { date: '2024-01-15T00:00:00Z', value: '92%', previousValue: '88%' }
          ]
        },
        {
          id: 'indicator-2',
          name: 'Patient Wait Time',
          category: 'efficiency',
          target: '<30',
          current: '23',
          unit: 'minutes',
          department: 'Emergency',
          frequency: 'daily',
          description: 'Average time from patient arrival to physician assessment',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          history: []
        }
      ];

      // Sample peer reviews
      const samplePeerReviews = [
        {
          id: 'peer-review-1',
          auditId: 'audit-1',
          title: 'Peer Review: Emergency Department Clinical Audit',
          auditTitle: 'Emergency Department Clinical Audit',
          scheduledDate: '2024-01-27T10:00:00Z',
          status: 'scheduled',
          reviewers: ['Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Davis'],
          casesCount: 8,
          recommendationsCount: 0,
          createdAt: '2024-01-20T16:00:00Z'
        }
      ];

      // Sample mortality reviews
      const sampleMortalityReviews = [
        {
          id: 'mm-review-1',
          patientName: 'John Adebayo',
          caseType: 'Post-operative mortality',
          incidentDate: '2024-01-18T14:30:00Z',
          department: 'Surgery',
          reviewDate: '2024-01-25T11:00:00Z',
          status: 'completed',
          summary: 'Patient developed complications following emergency laparotomy. Review identified delays in antibiotic administration as contributing factor.',
          attendees: ['Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Nurse Manager'],
          lessonsLearned: [
            'Importance of timely antibiotic administration in emergency cases',
            'Need for better communication between surgical and pharmacy teams',
            'Review of emergency protocol adherence'
          ],
          recommendations: [
            'Implement electronic antibiotic administration tracking',
            'Cross-training for pharmacy staff on emergency protocols',
            'Monthly review of emergency medication availability'
          ],
          createdAt: '2024-01-19T09:00:00Z'
        }
      ];

      // Sample compliance scores
      const sampleComplianceScores = {
        overall: 89.5,
        protocols: {
          'Antibiotic Stewardship': 94,
          'Surgical Safety Checklist': 98,
          'Blood Transfusion Protocol': 96,
          'Infection Control Measures': 92,
          'Medication Reconciliation': 89,
          'Pain Management Protocol': 91
        },
        departments: {
          'Emergency': {
            'Triage Protocol': 95,
            'Pain Management': 88
          },
          'Surgery': {
            'Safety Checklist': 98,
            'Antibiotic Prophylaxis': 96
          }
        }
      };

      state.audits = sampleAudits;
      state.qualityIndicators = sampleIndicators;
      state.peerReviews = samplePeerReviews;
      state.mortalityReviews = sampleMortalityReviews;
      state.complianceScores = sampleComplianceScores;
    }
  }
});

export const {
  createAudit,
  updateAudit,
  completeAudit,
  scheduleAudit,
  createQualityIndicator,
  updateQualityIndicator,
  generateAuditReport,
  schedulePeerReview,
  createMortalityReview,
  updateComplianceScore,
  searchAudits,
  filterAudits,
  setLoading,
  setError,
  clearError,
  initializeSampleData
} = auditSlice.actions;

export default auditSlice.reducer;