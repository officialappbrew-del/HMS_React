import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  surveys: [],
  feedback: [],
  complaints: [],
  improvementPlans: [],
  metrics: {
    nps: 45,
    satisfactionScore: 4.2,
    responseRate: 68,
    complaintResolutionRate: 85
  },
  searchTerm: '',
  filterBy: 'all',
  loading: false,
  error: null
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    createSurvey: (state, action) => {
      const survey = {
        id: `survey-${Date.now()}`,
        ...action.payload,
        status: 'draft',
        responses: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.surveys.push(survey);
    },

    sendSurvey: (state, action) => {
      const { surveyId, recipients } = action.payload;
      const surveyIndex = state.surveys.findIndex(s => s.id === surveyId);
      if (surveyIndex !== -1) {
        state.surveys[surveyIndex].status = 'sent';
        state.surveys[surveyIndex].sentAt = new Date().toISOString();
        state.surveys[surveyIndex].recipients = recipients;
        state.surveys[surveyIndex].updatedAt = new Date().toISOString();
      }
    },

    submitFeedback: (state, action) => {
      const feedback = {
        id: `feedback-${Date.now()}`,
        ...action.payload,
        submittedAt: new Date().toISOString()
      };

      // Determine sentiment based on rating
      if (feedback.rating >= 4) {
        feedback.sentiment = 'positive';
      } else if (feedback.rating >= 3) {
        feedback.sentiment = 'neutral';
      } else {
        feedback.sentiment = 'negative';
      }

      state.feedback.push(feedback);

      // Update survey response count
      if (feedback.surveyId) {
        const surveyIndex = state.surveys.findIndex(s => s.id === feedback.surveyId);
        if (surveyIndex !== -1) {
          state.surveys[surveyIndex].responses += 1;
        }
      }
    },

    createComplaint: (state, action) => {
      const complaint = {
        id: `complaint-${Date.now()}`,
        ...action.payload,
        status: 'pending',
        priority: action.payload.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: null,
        resolution: null,
        resolvedAt: null
      };
      state.complaints.push(complaint);
    },

    updateComplaint: (state, action) => {
      const { complaintId, updates } = action.payload;
      const complaintIndex = state.complaints.findIndex(c => c.id === complaintId);
      if (complaintIndex !== -1) {
        state.complaints[complaintIndex] = {
          ...state.complaints[complaintIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    resolveComplaint: (state, action) => {
      const { complaintId } = action.payload;
      const complaintIndex = state.complaints.findIndex(c => c.id === complaintId);
      if (complaintIndex !== -1) {
        state.complaints[complaintIndex].status = 'resolved';
        state.complaints[complaintIndex].resolvedAt = new Date().toISOString();
        state.complaints[complaintIndex].updatedAt = new Date().toISOString();
      }
    },

    escalateComplaint: (state, action) => {
      const { complaintId } = action.payload;
      const complaintIndex = state.complaints.findIndex(c => c.id === complaintId);
      if (complaintIndex !== -1) {
        state.complaints[complaintIndex].status = 'escalated';
        state.complaints[complaintIndex].priority = 'critical';
        state.complaints[complaintIndex].updatedAt = new Date().toISOString();
      }
    },

    createImprovementPlan: (state, action) => {
      const plan = {
        id: `plan-${Date.now()}`,
        ...action.payload,
        status: 'active',
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        actions: [],
        milestones: []
      };
      state.improvementPlans.push(plan);
    },

    updateQualityMetrics: (state, action) => {
      const { metrics } = action.payload;
      state.metrics = { ...state.metrics, ...metrics };
    },

    generateFeedbackReport: (state, action) => {
      const { period, department } = action.payload;
      // In a real app, this would generate and download a report
      console.log(`Generating feedback report for ${period} in ${department}`);
    },

    searchFeedback: (state, action) => {
      state.searchTerm = action.payload;
    },

    filterFeedback: (state, action) => {
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
      // Sample surveys
      const sampleSurveys = [
        {
          id: 'survey-1',
          title: 'Post-Visit Patient Satisfaction Survey',
          type: 'post_visit',
          targetAudience: 'recent_visits',
          distributionMethod: 'sms',
          scheduledDate: '2024-01-20T10:00:00Z',
          status: 'sent',
          responses: 145,
          createdAt: '2024-01-15T09:00:00Z',
          sentAt: '2024-01-20T10:00:00Z',
          questions: [
            'How would you rate your overall experience?',
            'How satisfied were you with the waiting time?',
            'How would you rate the staff courtesy?',
            'Would you recommend our hospital to others?'
          ]
        },
        {
          id: 'survey-2',
          title: 'Inpatient Experience Survey',
          type: 'admission',
          targetAudience: 'inpatients',
          distributionMethod: 'portal',
          scheduledDate: '2024-01-25T14:00:00Z',
          status: 'draft',
          responses: 0,
          createdAt: '2024-01-22T11:00:00Z',
          questions: [
            'How clean was your room?',
            'How would you rate the food quality?',
            'Were your pain management needs met?',
            'How clear was the discharge information?'
          ]
        }
      ];

      // Sample feedback
      const sampleFeedback = [
        {
          id: 'feedback-1',
          patientId: 'PAT-001',
          patientName: 'John Adebayo',
          surveyId: 'survey-1',
          rating: 5,
          sentiment: 'positive',
          comments: 'Excellent care and very friendly staff. Dr. Johnson was particularly helpful.',
          department: 'Emergency',
          submittedAt: '2024-01-20T14:30:00Z'
        },
        {
          id: 'feedback-2',
          patientId: 'PAT-002',
          patientName: 'Mary Johnson',
          surveyId: 'survey-1',
          rating: 3,
          sentiment: 'neutral',
          comments: 'Good medical care but waiting time was too long. Could be better.',
          department: 'Outpatient',
          submittedAt: '2024-01-21T11:15:00Z'
        },
        {
          id: 'feedback-3',
          patientId: 'PAT-003',
          patientName: 'David Okon',
          surveyId: 'survey-1',
          rating: 4,
          sentiment: 'positive',
          comments: 'Very satisfied with the treatment. Staff was professional and caring.',
          department: 'Laboratory',
          submittedAt: '2024-01-22T09:45:00Z'
        },
        {
          id: 'feedback-4',
          patientId: 'PAT-004',
          patientName: 'Sarah Williams',
          surveyId: 'survey-1',
          rating: 2,
          sentiment: 'negative',
          comments: 'Long waiting times and billing issues. Need improvement in administration.',
          department: 'Billing',
          submittedAt: '2024-01-23T16:20:00Z'
        },
        {
          id: 'feedback-5',
          patientId: 'PAT-005',
          patientName: 'Michael Brown',
          surveyId: 'survey-1',
          rating: 5,
          sentiment: 'positive',
          comments: 'Outstanding service from start to finish. Highly recommend!',
          department: 'Pharmacy',
          submittedAt: '2024-01-24T13:10:00Z'
        }
      ];

      // Sample complaints
      const sampleComplaints = [
        {
          id: 'complaint-1',
          patientId: 'PAT-006',
          patientName: 'Grace Okafor',
          category: 'waiting_time',
          priority: 'high',
          description: 'Waited over 3 hours in emergency despite being in severe pain. This is unacceptable.',
          department: 'Emergency',
          contactMethod: 'phone',
          status: 'in_progress',
          createdAt: '2024-01-20T15:30:00Z',
          assignedTo: 'Dr. Johnson'
        },
        {
          id: 'complaint-2',
          patientId: 'PAT-007',
          patientName: 'Peter Adeolu',
          category: 'billing',
          priority: 'medium',
          description: 'Charged twice for the same laboratory test. Billing department needs better coordination.',
          department: 'Billing',
          contactMethod: 'email',
          status: 'resolved',
          createdAt: '2024-01-18T10:45:00Z',
          resolvedAt: '2024-01-22T14:20:00Z',
          resolution: 'Refund processed and billing system updated to prevent duplicates'
        },
        {
          id: 'complaint-3',
          patientId: 'PAT-008',
          patientName: 'Fatima Ibrahim',
          category: 'staff_behavior',
          priority: 'critical',
          description: 'Nurse was rude and unprofessional during my consultation. Felt disrespected.',
          department: 'Outpatient',
          contactMethod: 'phone',
          status: 'escalated',
          createdAt: '2024-01-25T12:15:00Z',
          assignedTo: 'Hospital Director'
        },
        {
          id: 'complaint-4',
          patientId: 'PAT-009',
          patientName: 'Samuel Eze',
          category: 'facility_cleanliness',
          priority: 'low',
          description: 'Waiting area was not clean and there was a strong odor.',
          department: 'Outpatient',
          contactMethod: 'sms',
          status: 'pending',
          createdAt: '2024-01-24T08:30:00Z'
        }
      ];

      // Sample improvement plans
      const samplePlans = [
        {
          id: 'plan-1',
          title: 'Reduce Emergency Department Waiting Times',
          source: 'Patient Feedback Analysis',
          objectives: 'Reduce average waiting time from 180 minutes to 90 minutes within 6 months',
          responsiblePerson: 'Dr. Johnson (Emergency Director)',
          targetDate: '2024-07-01T00:00:00Z',
          status: 'active',
          progress: 35,
          createdAt: '2024-01-15T00:00:00Z',
          actions: [
            'Implement triage nurse assessment',
            'Streamline registration process',
            'Add additional emergency physicians',
            'Create fast-track system for minor cases'
          ],
          milestones: [
            { description: 'Complete staff training', completed: true, date: '2024-01-30' },
            { description: 'Implement new triage system', completed: false, date: '2024-02-15' },
            { description: 'Achieve 90-minute target', completed: false, date: '2024-07-01' }
          ]
        },
        {
          id: 'plan-2',
          title: 'Improve Billing Transparency',
          source: 'Complaint Analysis',
          objectives: 'Eliminate billing errors and improve patient understanding of charges',
          responsiblePerson: 'Mrs. Adebayo (Billing Manager)',
          targetDate: '2024-06-01T00:00:00Z',
          status: 'active',
          progress: 60,
          createdAt: '2024-01-20T00:00:00Z',
          actions: [
            'Implement itemized billing system',
            'Create patient billing education materials',
            'Train billing staff on patient communication',
            'Establish billing complaint resolution protocol'
          ]
        }
      ];

      state.surveys = sampleSurveys;
      state.feedback = sampleFeedback;
      state.complaints = sampleComplaints;
      state.improvementPlans = samplePlans;

      // Update metrics based on sample data
      const positiveFeedback = sampleFeedback.filter(f => f.sentiment === 'positive').length;
      const totalFeedback = sampleFeedback.length;
      const resolvedComplaints = sampleComplaints.filter(c => c.status === 'resolved').length;
      const totalComplaints = sampleComplaints.length;

      state.metrics = {
        nps: 45,
        satisfactionScore: 4.2,
        responseRate: 68,
        complaintResolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0
      };
    }
  }
});

export const {
  createSurvey,
  sendSurvey,
  submitFeedback,
  createComplaint,
  updateComplaint,
  resolveComplaint,
  escalateComplaint,
  createImprovementPlan,
  updateQualityMetrics,
  generateFeedbackReport,
  searchFeedback,
  filterFeedback,
  setLoading,
  setError,
  clearError,
  initializeSampleData
} = feedbackSlice.actions;

export default feedbackSlice.reducer;