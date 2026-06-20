import { createSlice } from '@reduxjs/toolkit';

const performanceSlice = createSlice({
  name: 'performance',
  initialState: {
    // Annual appraisals
    appraisals: [
      {
        appraisalId: 'APR001',
        staffId: 'DR001',
        staffName: 'Dr. Adekunle Ifeanyi',
        appraisalYear: 2025,
        period: 'January - December 2025',
        rater: 'Dr. Okafor Ifeanyi',
        rating: 4.5,
        clinicalExcellence: 4.5,
        patientCare: 4.8,
        teamwork: 4.2,
        leadership: 4.3,
        continuousLearning: 4.5,
        overallComments: 'Excellent clinical performance with strong patient outcomes',
        status: 'Completed',
        date: '2026-01-15'
      },
      {
        appraisalId: 'APR002',
        staffId: 'NUR001',
        staffName: 'Nurse Chioma Okafor',
        appraisalYear: 2025,
        period: 'January - December 2025',
        rater: 'Nurse Supervisor',
        rating: 4.3,
        clinicalExcellence: 4.5,
        patientCare: 4.7,
        teamwork: 4.2,
        leadership: 3.8,
        continuousLearning: 4.2,
        overallComments: 'Strong nursing practice with excellent patient rapport',
        status: 'Completed',
        date: '2026-01-18'
      }
    ],

    // Clinical audits
    auditRecords: [
      {
        auditId: 'AUDIT001',
        staffId: 'DR001',
        staffName: 'Dr. Adekunle Ifeanyi',
        auditType: 'Case Review - Hypertension Management',
        auditDate: '2025-12-10',
        casesReviewed: 15,
        casesCompliant: 14,
        complianceRate: '93.3%',
        findings: 'Good adherence to guidelines',
        recommendations: 'Continue current practice'
      },
      {
        auditId: 'AUDIT002',
        staffId: 'PHARM001',
        staffName: 'Mr. Tunde Oluwaseun',
        auditType: 'Prescription Audit',
        auditDate: '2025-12-05',
        casesReviewed: 50,
        casesCompliant: 48,
        complianceRate: '96%',
        findings: 'Excellent prescription documentation',
        recommendations: 'Minor improvements in drug interaction checking'
      }
    ],

    // Research output
    research: [
      {
        researchId: 'RES001',
        staffId: 'DR001',
        staffName: 'Dr. Adekunle Ifeanyi',
        title: 'Cardiovascular Risk Factors in Nigerian Population',
        publicationType: 'Journal Article',
        journalName: 'Nigerian Journal of Internal Medicine',
        publicationDate: '2025-11-15',
        authors: ['Dr. Adekunle Ifeanyi', 'Prof. Emeka Ejiofor'],
        status: 'Published',
        citationCount: 2
      }
    ],

    // Teaching hours
    teachingHours: [
      {
        teachingId: 'TEACH001',
        staffId: 'DR001',
        staffName: 'Dr. Adekunle Ifeanyi',
        month: 'January 2026',
        hoursDelivered: 8,
        topicsTaught: ['Hypertension Management', 'Diabetes Care'],
        studentsCount: 25,
        feedbackScore: 4.5
      }
    ],

    // Patient satisfaction scores
    satisfactionScores: [
      {
        staffId: 'DR001',
        staffName: 'Dr. Adekunle Ifeanyi',
        period: 'December 2025',
        totalFeedback: 15,
        averageScore: 4.6,
        communication: 4.7,
        professionalism: 4.8,
        cleanliness: 4.5,
        overallSatisfaction: 4.6,
        comments: ['Very professional', 'Thorough examination', 'Friendly doctor']
      }
    ],

    // Incident tracking
    incidents: [
      {
        incidentId: 'INC001',
        staffId: 'NUR001',
        staffName: 'Nurse Chioma Okafor',
        incidentType: 'Medication Error',
        incidentDate: '2025-12-20',
        description: 'Incorrect medication dose administered (corrected immediately)',
        severity: 'Minor',
        status: 'Investigated',
        rootCause: 'Fatigue during night shift',
        actionTaken: 'Additional training provided',
        investigationDate: '2025-12-21'
      }
    ],

    // Performance ratings scale
    ratingScale: {
      EXCELLENT: 5,
      VERY_GOOD: 4,
      GOOD: 3,
      FAIR: 2,
      POOR: 1
    }
  },

  reducers: {
    addAppraisal: (state, action) => {
      state.appraisals.push(action.payload);
    },

    updateAppraisal: (state, action) => {
      const index = state.appraisals.findIndex(a => a.appraisalId === action.payload.appraisalId);
      if (index !== -1) {
        state.appraisals[index] = { ...state.appraisals[index], ...action.payload };
      }
    },

    addAuditRecord: (state, action) => {
      state.auditRecords.push(action.payload);
    },

    addResearchOutput: (state, action) => {
      state.research.push(action.payload);
    },

    addTeachingHours: (state, action) => {
      state.teachingHours.push(action.payload);
    },

    addSatisfactionScore: (state, action) => {
      state.satisfactionScores.push(action.payload);
    },

    addIncidentRecord: (state, action) => {
      state.incidents.push(action.payload);
    },

    updateIncident: (state, action) => {
      const index = state.incidents.findIndex(i => i.incidentId === action.payload.incidentId);
      if (index !== -1) {
        state.incidents[index] = { ...state.incidents[index], ...action.payload };
      }
    }
  }
});

export const {
  addAppraisal,
  updateAppraisal,
  addAuditRecord,
  addResearchOutput,
  addTeachingHours,
  addSatisfactionScore,
  addIncidentRecord,
  updateIncident
} = performanceSlice.actions;

export default performanceSlice.reducer;
