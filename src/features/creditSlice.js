import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  creditPolicies: [],
  guarantors: [],
  paymentPlans: [],
  outstandingDebts: [],
  paymentReminders: [],
  debtAging: {
    current: 0,
    thirtyDays: 0,
    sixtyDays: 0,
    ninetyDays: 0
  },
  searchTerm: '',
  filterBy: 'all',
  loading: false,
  error: null
};

const creditSlice = createSlice({
  name: 'credit',
  initialState,
  reducers: {
    createCreditPolicy: (state, action) => {
      const policy = {
        id: `policy-${Date.now()}`,
        ...action.payload,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.creditPolicies.push(policy);
    },

    updateCreditPolicy: (state, action) => {
      const { policyId, updates } = action.payload;
      const policyIndex = state.creditPolicies.findIndex(p => p.id === policyId);
      if (policyIndex !== -1) {
        state.creditPolicies[policyIndex] = {
          ...state.creditPolicies[policyIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    createGuarantor: (state, action) => {
      const guarantor = {
        id: `guarantor-${Date.now()}`,
        ...action.payload,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contactHistory: []
      };
      state.guarantors.push(guarantor);
    },

    updateGuarantor: (state, action) => {
      const { guarantorId, updates } = action.payload;
      const guarantorIndex = state.guarantors.findIndex(g => g.id === guarantorId);
      if (guarantorIndex !== -1) {
        state.guarantors[guarantorIndex] = {
          ...state.guarantors[guarantorIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    createPaymentPlan: (state, action) => {
      const plan = {
        id: `plan-${Date.now()}`,
        ...action.payload,
        status: 'active',
        completedInstallments: 0,
        nextPaymentDate: action.payload.startDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentSchedule: []
      };
      state.paymentPlans.push(plan);
    },

    updatePaymentPlan: (state, action) => {
      const { planId, updates } = action.payload;
      const planIndex = state.paymentPlans.findIndex(p => p.id === planId);
      if (planIndex !== -1) {
        state.paymentPlans[planIndex] = {
          ...state.paymentPlans[planIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
    },

    sendPaymentReminder: (state, action) => {
      const { debtId } = action.payload;
      const reminder = {
        id: `reminder-${Date.now()}`,
        debtId,
        type: 'payment_reminder',
        sentAt: new Date().toISOString(),
        status: 'sent',
        method: 'sms'
      };
      state.paymentReminders.push(reminder);

      // Update last contact on debt
      const debtIndex = state.outstandingDebts.findIndex(d => d.id === debtId);
      if (debtIndex !== -1) {
        state.outstandingDebts[debtIndex].lastContact = new Date().toISOString();
      }
    },

    escalateDebt: (state, action) => {
      const { debtId } = action.payload;
      const debtIndex = state.outstandingDebts.findIndex(d => d.id === debtId);
      if (debtIndex !== -1) {
        const debt = state.outstandingDebts[debtIndex];
        if (debt.daysOverdue >= 90) {
          debt.status = 'legal';
          debt.priority = 'critical';
        } else if (debt.daysOverdue >= 60) {
          debt.status = 'delinquent';
          debt.priority = 'high';
        } else {
          debt.status = 'overdue';
          debt.priority = 'medium';
        }
        debt.updatedAt = new Date().toISOString();
      }
    },

    writeOffDebt: (state, action) => {
      const { debtId, reason } = action.payload;
      const debtIndex = state.outstandingDebts.findIndex(d => d.id === debtId);
      if (debtIndex !== -1) {
        state.outstandingDebts[debtIndex].status = 'written_off';
        state.outstandingDebts[debtIndex].writeOffReason = reason;
        state.outstandingDebts[debtIndex].writtenOffAt = new Date().toISOString();
        state.outstandingDebts[debtIndex].updatedAt = new Date().toISOString();
      }
    },

    generateCreditReport: (state, action) => {
      const { period, category } = action.payload;
      // In a real app, this would generate and download a report
      console.log(`Generating credit report for ${period} in ${category}`);
    },

    searchCreditData: (state, action) => {
      state.searchTerm = action.payload;
    },

    filterCreditData: (state, action) => {
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
      // Sample credit policies
      const samplePolicies = [
        {
          id: 'policy-1',
          patientCategory: 'NHIS',
          creditLimit: 500000,
          paymentTerms: 30,
          interestRate: 0,
          gracePeriod: 15,
          description: 'Standard NHIS patient credit terms with capitation payment considerations',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'policy-2',
          patientCategory: 'Private',
          creditLimit: 1000000,
          paymentTerms: 30,
          interestRate: 2.5,
          gracePeriod: 7,
          description: 'Private patient credit terms with interest on overdue payments',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'policy-3',
          patientCategory: 'Corporate',
          creditLimit: 5000000,
          paymentTerms: 45,
          interestRate: 1.5,
          gracePeriod: 15,
          description: 'Corporate client credit terms with extended payment periods',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      // Sample guarantors
      const sampleGuarantors = [
        {
          id: 'guarantor-1',
          patientId: 'PAT-001',
          patientName: 'John Adebayo',
          name: 'Mary Adebayo',
          relationship: 'spouse',
          phone: '+2348012345678',
          email: 'mary.adebayo@email.com',
          address: '123 Lagos Street, Lagos',
          occupation: 'Teacher',
          monthlyIncome: 150000,
          creditHistory: 'good',
          idType: 'nin',
          idNumber: '12345678901',
          status: 'active',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'guarantor-2',
          patientId: 'PAT-002',
          patientName: 'Grace Okafor',
          name: 'Peter Okafor',
          relationship: 'parent',
          phone: '+2348012345679',
          email: 'peter.okafor@email.com',
          address: '456 Abuja Avenue, Abuja',
          occupation: 'Civil Servant',
          monthlyIncome: 200000,
          creditHistory: 'excellent',
          idType: 'drivers_license',
          idNumber: 'ABC123456',
          status: 'active',
          createdAt: '2024-01-20T14:30:00Z'
        }
      ];

      // Sample payment plans
      const samplePaymentPlans = [
        {
          id: 'plan-1',
          patientId: 'PAT-003',
          patientName: 'David Okon',
          totalAmount: 750000,
          numberOfInstallments: 12,
          installmentAmount: 62500,
          startDate: '2024-02-01',
          frequency: 'monthly',
          description: 'Installment plan for surgical procedure payment',
          status: 'active',
          completedInstallments: 3,
          nextPaymentDate: '2024-05-01',
          createdAt: '2024-02-01T00:00:00Z'
        },
        {
          id: 'plan-2',
          patientId: 'PAT-004',
          patientName: 'Sarah Williams',
          totalAmount: 450000,
          numberOfInstallments: 6,
          installmentAmount: 75000,
          startDate: '2024-03-01',
          frequency: 'monthly',
          description: 'Payment plan for maternity care services',
          status: 'active',
          completedInstallments: 2,
          nextPaymentDate: '2024-05-01',
          createdAt: '2024-03-01T00:00:00Z'
        }
      ];

      // Sample outstanding debts
      const sampleDebts = [
        {
          id: 'debt-1',
          patientId: 'PAT-005',
          patientName: 'Michael Brown',
          amount: 250000,
          daysOverdue: 15,
          status: 'current',
          priority: 'low',
          category: 'private',
          lastContact: '2024-01-20T10:00:00Z',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'debt-2',
          patientId: 'PAT-006',
          patientName: 'Jennifer Eze',
          amount: 180000,
          daysOverdue: 45,
          status: 'overdue',
          priority: 'medium',
          category: 'nhis',
          lastContact: '2024-01-15T14:30:00Z',
          createdAt: '2023-12-01T00:00:00Z'
        },
        {
          id: 'debt-3',
          patientId: 'PAT-007',
          patientName: 'Robert Johnson',
          amount: 420000,
          daysOverdue: 75,
          status: 'delinquent',
          priority: 'high',
          category: 'corporate',
          lastContact: '2024-01-10T09:15:00Z',
          createdAt: '2023-11-01T00:00:00Z'
        },
        {
          id: 'debt-4',
          patientId: 'PAT-008',
          patientName: 'Amaka Nwosu',
          amount: 650000,
          daysOverdue: 120,
          status: 'legal',
          priority: 'critical',
          category: 'private',
          lastContact: '2023-12-15T11:45:00Z',
          createdAt: '2023-09-01T00:00:00Z'
        }
      ];

      // Sample payment reminders
      const sampleReminders = [
        {
          id: 'reminder-1',
          debtId: 'debt-2',
          type: 'payment_reminder',
          sentAt: '2024-01-20T10:00:00Z',
          status: 'sent',
          method: 'sms'
        },
        {
          id: 'reminder-2',
          debtId: 'debt-3',
          type: 'final_notice',
          sentAt: '2024-01-18T14:30:00Z',
          status: 'sent',
          method: 'email'
        }
      ];

      state.creditPolicies = samplePolicies;
      state.guarantors = sampleGuarantors;
      state.paymentPlans = samplePaymentPlans;
      state.outstandingDebts = sampleDebts;
      state.paymentReminders = sampleReminders;

      // Update debt aging
      state.debtAging = {
        current: sampleDebts.filter(d => d.daysOverdue <= 30).reduce((sum, d) => sum + d.amount, 0),
        thirtyDays: sampleDebts.filter(d => d.daysOverdue > 30 && d.daysOverdue <= 60).reduce((sum, d) => sum + d.amount, 0),
        sixtyDays: sampleDebts.filter(d => d.daysOverdue > 60 && d.daysOverdue <= 90).reduce((sum, d) => sum + d.amount, 0),
        ninetyDays: sampleDebts.filter(d => d.daysOverdue > 90).reduce((sum, d) => sum + d.amount, 0)
      };
    }
  }
});

export const {
  createCreditPolicy,
  updateCreditPolicy,
  createGuarantor,
  updateGuarantor,
  createPaymentPlan,
  updatePaymentPlan,
  sendPaymentReminder,
  escalateDebt,
  writeOffDebt,
  generateCreditReport,
  searchCreditData,
  filterCreditData,
  setLoading,
  setError,
  clearError,
  initializeSampleData
} = creditSlice.actions;

export default creditSlice.reducer;