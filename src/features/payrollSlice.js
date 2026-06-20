import { createSlice } from '@reduxjs/toolkit';

const payrollSlice = createSlice({
  name: 'payroll',
  initialState: {
    // Attendance records
    attendance: [
      {
        attendanceId: 'ATT001',
        staffId: 'DR001',
        staffName: 'Dr. Adekunle Ifeanyi',
        month: 'January 2026',
        totalWorkingDays: 22,
        presentDays: 21,
        absentDays: 1,
        leaveDays: 0,
        holidayDays: 2,
        attendancePercentage: 95.5,
        remarks: 'Excellent attendance'
      },
      {
        attendanceId: 'ATT002',
        staffId: 'NUR001',
        staffName: 'Nurse Chioma Okafor',
        month: 'January 2026',
        totalWorkingDays: 22,
        presentDays: 20,
        absentDays: 0,
        leaveDays: 2,
        holidayDays: 2,
        attendancePercentage: 90.9,
        remarks: 'Good attendance with 2 days leave'
      }
    ],

    // Salary components
    salaryComponents: [
      {
        componentId: 'COMP001',
        staffId: 'DR001',
        baseSalary: 500000,
        allowances: {
          callDuty: 50000,
          hazard: 25000,
          housing: 75000,
          transport: 30000,
          medical: 40000
        },
        totalAllowances: 220000,
        grossSalary: 720000
      },
      {
        componentId: 'COMP002',
        staffId: 'NUR001',
        baseSalary: 250000,
        allowances: {
          callDuty: 25000,
          hazard: 15000,
          housing: 40000,
          transport: 20000,
          medical: 20000
        },
        totalAllowances: 120000,
        grossSalary: 370000
      }
    ],

    // Deductions
    deductions: [
      {
        deductionId: 'DED001',
        staffId: 'DR001',
        month: 'January 2026',
        paye: 108000,
        pension: 72000, // 10% of gross
        healthInsurance: 10800,
        unionDues: 5000,
        loanRepayment: 0,
        totalDeductions: 195800,
        netSalary: 524200
      },
      {
        deductionId: 'DED002',
        staffId: 'NUR001',
        month: 'January 2026',
        paye: 48000,
        pension: 37000, // 10% of gross
        healthInsurance: 5400,
        unionDues: 2500,
        loanRepayment: 0,
        totalDeductions: 92900,
        netSalary: 277100
      }
    ],

    // Payslips
    payslips: [
      {
        payslipId: 'PAY001',
        staffId: 'DR001',
        staffName: 'Dr. Adekunle Ifeanyi',
        month: 'January 2026',
        paymentDate: '2026-01-30',
        baseSalary: 500000,
        allowances: 220000,
        grossSalary: 720000,
        deductions: 195800,
        netSalary: 524200,
        status: 'Generated',
        paymentMethod: 'Bank Transfer',
        bankName: 'First Bank Nigeria'
      },
      {
        payslipId: 'PAY002',
        staffId: 'NUR001',
        staffName: 'Nurse Chioma Okafor',
        month: 'January 2026',
        paymentDate: '2026-01-30',
        baseSalary: 250000,
        allowances: 120000,
        grossSalary: 370000,
        deductions: 92900,
        netSalary: 277100,
        status: 'Generated',
        paymentMethod: 'Bank Transfer',
        bankName: 'Zenith Bank Nigeria'
      }
    ],

    // Loans
    loans: [
      {
        loanId: 'LOAN001',
        staffId: 'DR001',
        loanType: 'Salary Advance',
        loanAmount: 200000,
        dateIssued: '2025-12-01',
        repaymentPeriod: 12, // months
        monthlyInstallment: 16667,
        monthsRemaining: 8,
        status: 'Active'
      }
    ],

    // Payroll settings
    taxRates: {
      paye: 0.15, // 15% PAYE
      pension: 0.10, // 10% Pension (PFA)
      healthInsurance: 0.015, // 1.5%
      unionDues: 50 // Fixed amount per month
    }
  },

  reducers: {
    addAttendanceRecord: (state, action) => {
      state.attendance.push(action.payload);
    },

    updateAttendance: (state, action) => {
      const index = state.attendance.findIndex(a => a.attendanceId === action.payload.attendanceId);
      if (index !== -1) {
        state.attendance[index] = { ...state.attendance[index], ...action.payload };
      }
    },

    updateSalaryComponent: (state, action) => {
      const index = state.salaryComponents.findIndex(s => s.componentId === action.payload.componentId);
      if (index !== -1) {
        state.salaryComponents[index] = { ...state.salaryComponents[index], ...action.payload };
      }
    },

    generatePayslip: (state, action) => {
      state.payslips.push(action.payload);
    },

    addLoanRecord: (state, action) => {
      state.loans.push(action.payload);
    },

    updateLoan: (state, action) => {
      const index = state.loans.findIndex(l => l.loanId === action.payload.loanId);
      if (index !== -1) {
        state.loans[index] = { ...state.loans[index], ...action.payload };
      }
    },

    recordPaymentTransaction: (state, action) => {
      const payslip = state.payslips.find(p => p.payslipId === action.payload.payslipId);
      if (payslip) {
        payslip.status = 'Paid';
        payslip.paymentDate = action.payload.paymentDate;
      }
    }
  }
});

export const {
  addAttendanceRecord,
  updateAttendance,
  updateSalaryComponent,
  generatePayslip,
  addLoanRecord,
  updateLoan,
  recordPaymentTransaction
} = payrollSlice.actions;

export default payrollSlice.reducer;
