import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  enrollees: [],
  claims: [],
  capitationRecords: [],
  preAuthorizations: [],
  serviceCodes: {
    // NHIS service codes and tariffs
    consultation: { code: '0101', tariff: 1500, description: 'General Consultation' },
    emergency: { code: '0102', tariff: 3000, description: 'Emergency Consultation' },
    antenatal: { code: '0201', tariff: 2500, description: 'Antenatal Care' },
    delivery: { code: '0202', tariff: 35000, description: 'Normal Delivery' },
    cesarean: { code: '0203', tariff: 75000, description: 'Cesarean Section' },
    laboratory: { code: '0301', tariff: 500, description: 'Basic Laboratory Test' },
    radiology: { code: '0302', tariff: 2500, description: 'X-Ray' },
    pharmacy: { code: '0401', tariff: 0, description: 'Essential Medicines' },
    admission: { code: '0501', tariff: 5000, description: 'General Ward Admission' },
    surgery: { code: '0601', tariff: 25000, description: 'Major Surgery' }
  },
  diagnosisCodes: {
    // ICD-10 codes commonly used in NHIS claims
    malaria: { code: 'B54', description: 'Malaria' },
    hypertension: { code: 'I10', description: 'Essential Hypertension' },
    diabetes: { code: 'E11', description: 'Type 2 Diabetes' },
    pneumonia: { code: 'J18', description: 'Pneumonia' },
    gastroenteritis: { code: 'A09', description: 'Gastroenteritis' },
    anemia: { code: 'D64', description: 'Anemia' },
    pregnancy: { code: 'Z34', description: 'Pregnancy' },
    delivery: { code: 'Z37', description: 'Live Birth' }
  },
  stats: {
    totalEnrollees: 0,
    activeEnrollees: 0,
    totalClaims: 0,
    approvedClaims: 0,
    rejectedClaims: 0,
    totalCapitation: 0,
    pendingPreAuths: 0
  },
  searchTerm: '',
  sortBy: 'date',
  filterBy: 'all',
  loading: false,
  error: null,
};

const nhisSlice = createSlice({
  name: 'nhis',
  initialState,
  reducers: {
    registerEnrollee: (state, action) => {
      const enrollee = {
        id: Date.now().toString(),
        ...action.payload,
        registrationDate: new Date().toISOString(),
        status: 'active',
        dependents: action.payload.dependents || [],
        capitationHistory: []
      };
      state.enrollees.push(enrollee);
      state.stats.totalEnrollees++;
      state.stats.activeEnrollees++;
    },

    updateEnrollee: (state, action) => {
      const { id, updates } = action.payload;
      const enrollee = state.enrollees.find(e => e.id === id);
      if (enrollee) {
        Object.assign(enrollee, updates);
      }
    },

    validateNHISNumber: (state, action) => {
      const { nhisNumber } = action.payload;
      // Basic NHIS number validation (format: NHIS/XXXX/XXXXXXX)
      const nhisPattern = /^NHIS\/\d{4}\/\d{7}$/;
      return nhisPattern.test(nhisNumber);
    },

    createPreAuthorization: (state, action) => {
      const preAuth = {
        id: Date.now().toString(),
        ...action.payload,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        approvedAmount: 0,
        approvedServices: []
      };
      state.preAuthorizations.push(preAuth);
      state.stats.pendingPreAuths++;
    },

    approvePreAuthorization: (state, action) => {
      const { id, approvedAmount, approvedServices, notes } = action.payload;
      const preAuth = state.preAuthorizations.find(p => p.id === id);
      if (preAuth) {
        preAuth.status = 'approved';
        preAuth.approvedAmount = approvedAmount;
        preAuth.approvedServices = approvedServices;
        preAuth.approvedAt = new Date().toISOString();
        preAuth.notes = notes;
        state.stats.pendingPreAuths--;
      }
    },

    rejectPreAuthorization: (state, action) => {
      const { id, reason } = action.payload;
      const preAuth = state.preAuthorizations.find(p => p.id === id);
      if (preAuth) {
        preAuth.status = 'rejected';
        preAuth.rejectionReason = reason;
        preAuth.rejectedAt = new Date().toISOString();
        state.stats.pendingPreAuths--;
      }
    },

    createClaim: (state, action) => {
      const { enrolleeId, services, diagnosis, totalAmount } = action.payload;

      // Check for potential fraud patterns
      const fraudAlerts = [];
      const enrollee = state.enrollees.find(e => e.id === enrolleeId);

      // Check for duplicate claims
      const recentClaims = state.claims.filter(c =>
        c.enrolleeId === enrolleeId &&
        c.diagnosis === diagnosis &&
        new Date(c.claimDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      );

      if (recentClaims.length > 0) {
        fraudAlerts.push('Potential duplicate claim detected');
      }

      // Check for unusual service patterns
      const monthlyClaims = state.claims.filter(c =>
        c.enrolleeId === enrolleeId &&
        new Date(c.claimDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );

      if (monthlyClaims.length > 10) {
        fraudAlerts.push('High frequency of claims detected');
      }

      const claim = {
        id: Date.now().toString(),
        enrolleeId,
        enrollee: enrollee,
        services,
        diagnosis,
        totalAmount,
        claimDate: new Date().toISOString(),
        status: 'submitted',
        fraudAlerts,
        processingNotes: []
      };

      state.claims.push(claim);
      state.stats.totalClaims++;
    },

    processClaim: (state, action) => {
      const { claimId, status, approvedAmount, rejectionReason, processingNotes } = action.payload;
      const claim = state.claims.find(c => c.id === claimId);

      if (claim) {
        claim.status = status;
        claim.processedAt = new Date().toISOString();

        if (status === 'approved') {
          claim.approvedAmount = approvedAmount || claim.totalAmount;
          state.stats.approvedClaims++;
        } else if (status === 'rejected') {
          claim.rejectionReason = rejectionReason;
          state.stats.rejectedClaims++;
        }

        if (processingNotes) {
          claim.processingNotes.push({
            note: processingNotes,
            timestamp: new Date().toISOString()
          });
        }
      }
    },

    recordCapitation: (state, action) => {
      const { enrolleeId, amount, month, year, servicesProvided } = action.payload;

      const capitationRecord = {
        id: Date.now().toString(),
        enrolleeId,
        amount,
        month,
        year,
        servicesProvided,
        recordedAt: new Date().toISOString()
      };

      state.capitationRecords.push(capitationRecord);

      // Update enrollee capitation history
      const enrollee = state.enrollees.find(e => e.id === enrolleeId);
      if (enrollee) {
        enrollee.capitationHistory.push(capitationRecord);
      }

      state.stats.totalCapitation += amount;
    },

    detectFraud: (state) => {
      // Automated fraud detection algorithms
      state.claims.forEach(claim => {
        const alerts = [];

        // Frequency analysis
        const enrolleeClaims = state.claims.filter(c => c.enrolleeId === claim.enrolleeId);
        const monthlyCount = enrolleeClaims.filter(c =>
          new Date(c.claimDate).getMonth() === new Date(claim.claimDate).getMonth()
        ).length;

        if (monthlyCount > 15) {
          alerts.push('Excessive claims frequency');
        }

        // Amount analysis
        if (claim.totalAmount > 50000) { // Above N50,000
          alerts.push('High-value claim');
        }

        // Service pattern analysis
        const serviceCodes = claim.services.map(s => s.code);
        if (serviceCodes.includes('0202') && serviceCodes.includes('0203')) {
          alerts.push('Conflicting delivery codes');
        }

        // Geographic analysis (if location data available)
        // This would check for claims from impossible locations

        claim.fraudAlerts = alerts;
      });
    },

    generateMonthlyReport: (state, action) => {
      const { month, year } = action.payload;

      const monthlyClaims = state.claims.filter(claim =>
        new Date(claim.claimDate).getMonth() === month - 1 &&
        new Date(claim.claimDate).getFullYear() === year
      );

      const monthlyCapitation = state.capitationRecords.filter(record =>
        record.month === month && record.year === year
      );

      return {
        month,
        year,
        totalClaims: monthlyClaims.length,
        approvedClaims: monthlyClaims.filter(c => c.status === 'approved').length,
        rejectedClaims: monthlyClaims.filter(c => c.status === 'rejected').length,
        totalClaimAmount: monthlyClaims.reduce((sum, c) => sum + (c.approvedAmount || 0), 0),
        totalCapitation: monthlyCapitation.reduce((sum, r) => sum + r.amount, 0),
        enrolleeCount: state.enrollees.filter(e => e.status === 'active').length
      };
    },

    searchNHIS: (state, action) => {
      state.searchTerm = action.payload;
    },

    sortNHIS: (state, action) => {
      state.sortBy = action.payload;
    },

    filterNHIS: (state, action) => {
      state.filterBy = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  registerEnrollee,
  updateEnrollee,
  validateNHISNumber,
  createPreAuthorization,
  approvePreAuthorization,
  rejectPreAuthorization,
  createClaim,
  processClaim,
  recordCapitation,
  detectFraud,
  generateMonthlyReport,
  searchNHIS,
  sortNHIS,
  filterNHIS,
  setLoading,
  setError,
} = nhisSlice.actions;

export default nhisSlice.reducer;