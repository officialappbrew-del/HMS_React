import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  Plus,
  DollarSign,
  FileText,
  Users,
  TrendingDown,
  Calendar
} from 'lucide-react';
import GenericModal from '../components/GenericModal';

const PayrollManagement = () => {
  const payrollState = useSelector(state => state.payroll) || {};
  const attendanceRecords = payrollState.attendance || [];
  const salaryComponents = payrollState.salaryComponents || [];
  const deductionRecords = payrollState.deductions || [];
  const payslips = payrollState.payslips || [];
  const loanRecords = payrollState.loans || [];
  const { staff } = useSelector(state => state.staff);

  const [activeTab, setActiveTab] = useState('payslips');
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [selectedPayslipId, setSelectedPayslipId] = useState(null);

  const [attendanceData, setAttendanceData] = useState({
    staffId: '',
    month: new Date().toISOString().slice(0, 7),
    presentDays: '',
    absentDays: '',
    sickDays: '',
    leaveDays: ''
  });

  // Calculate total gross salary for a staff member
  const getGrossSalary = (staffId) => {
    const salaryComp = salaryComponents.find(s => s.staffId === staffId);
    if (!salaryComp) return 0;
    const allowances = [
      salaryComp.callDutyAllowance,
      salaryComp.hazardAllowance,
      salaryComp.housingAllowance,
      salaryComp.transportAllowance,
      salaryComp.medicalAllowance
    ].reduce((sum, a) => sum + (parseFloat(a) || 0), 0);
    return (parseFloat(salaryComp.baseSalary) || 0) + allowances;
  };

  // Calculate total deductions for a staff member
  const getTotalDeductions = (staffId) => {
    const deductions = deductionRecords.filter(d => d.staffId === staffId);
    return deductions.reduce((sum, d) => sum + (parseFloat(d.totalAmount) || 0), 0);
  };

  const handleAddAttendance = () => {
    if (attendanceData.staffId && attendanceData.month) {
      // In real app, dispatch to Redux
      setShowAttendanceForm(false);
      setAttendanceData({
        staffId: '',
        month: new Date().toISOString().slice(0, 7),
        presentDays: '',
        absentDays: '',
        sickDays: '',
        leaveDays: ''
      });
    }
  };

  const getPayslipSummary = (payslip) => {
    const gross = getGrossSalary(payslip.staffId);
    const deductions = getTotalDeductions(payslip.staffId);
    const net = gross - deductions;
    return { gross, deductions, net };
  };

  return (
    <div className="payroll-management p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <DollarSign className="w-8 h-8 mr-3 text-nigerian-green" />
            Payroll Management
          </h1>
          <p className="text-gray-600 mt-2">Manage attendance, salary, deductions, payslips, and loans</p>
        </div>
        <button
          onClick={() => setShowAttendanceForm(true)}
          className="px-6 py-3 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Record Attendance
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Staff on Payroll</p>
              <p className="text-blue-500 font-bold text-2xl">{staff.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Generated Payslips</p>
              <p className="text-green-500 font-bold text-2xl">{payslips.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Active Loans</p>
              <p className="text-purple-500 font-bold text-2xl">{loanRecords.filter(l => l.status === 'Active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Attendance Records</p>
              <p className="text-orange-500 font-bold text-2xl">{attendanceRecords.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('payslips')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'payslips'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Payslips ({payslips.length})
        </button>
        <button
          onClick={() => setActiveTab('salary')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'salary'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Salary Components
        </button>
        <button
          onClick={() => setActiveTab('deductions')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'deductions'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Deductions ({deductionRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Attendance ({attendanceRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'loans'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Loans ({loanRecords.length})
        </button>
      </div>

      {/* Payslips Tab */}
      {activeTab === 'payslips' && (
        <div className="space-y-6">
          {payslips.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No payslips generated yet</p>
            </div>
          ) : (
            payslips.map(payslip => {
              const summary = getPayslipSummary(payslip);
              const staffMember = staff.find(s => s.staffId === payslip.staffId);
              return (
                <div key={payslip.payslipId} className="bg-white rounded-xl shadow-md p-6">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Staff Member</p>
                      <p className="font-bold">{staffMember?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Period</p>
                      <p className="font-bold">{payslip.paymentMonth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gross Salary</p>
                      <p className="font-bold text-blue-600">₦{summary.gross.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Deductions</p>
                      <p className="font-bold text-red-600">₦{summary.deductions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Net Salary</p>
                      <p className="font-bold text-green-600">₦{summary.net.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        {payslip.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Payment Method</p>
                      <p className="text-gray-800">{payslip.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Bank Account</p>
                      <p className="text-gray-800 text-sm">{payslip.bankAccount}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPayslipId(payslip.payslipId)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Salary Components Tab */}
      {activeTab === 'salary' && (
        <div className="space-y-4">
          {salaryComponents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No salary components found</p>
            </div>
          ) : (
            salaryComponents.map(salary => (
              <div key={salary.salaryId} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{staff.find(s => s.staffId === salary.staffId)?.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-semibold">Base Salary</p>
                    <p className="text-xl font-bold text-blue-600 mt-2">₦{parseFloat(salary.baseSalary).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 font-semibold">Call Duty</p>
                    <p className="text-xl font-bold text-green-600 mt-2">₦{parseFloat(salary.callDutyAllowance).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700 font-semibold">Hazard</p>
                    <p className="text-xl font-bold text-purple-600 mt-2">₦{parseFloat(salary.hazardAllowance).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-700 font-semibold">Housing</p>
                    <p className="text-xl font-bold text-orange-600 mt-2">₦{parseFloat(salary.housingAllowance).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700 font-semibold">Transport</p>
                    <p className="text-xl font-bold text-red-600 mt-2">₦{parseFloat(salary.transportAllowance).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700 font-semibold">Medical</p>
                    <p className="text-xl font-bold text-yellow-600 mt-2">₦{parseFloat(salary.medicalAllowance).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-lg font-bold text-gray-800">Gross Monthly: ₦{getGrossSalary(salary.staffId).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Deductions Tab */}
      {activeTab === 'deductions' && (
        <div className="space-y-4">
          {deductionRecords.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No deduction records found</p>
            </div>
          ) : (
            deductionRecords.map(deduction => (
              <div key={deduction.deductionId} className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-600">Staff Member</p>
                    <p className="font-bold">{staff.find(s => s.staffId === deduction.staffId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Month</p>
                    <p className="font-bold">{deduction.paymentMonth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">PAYE</p>
                    <p className="font-bold">₦{parseFloat(deduction.paye).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pension</p>
                    <p className="font-bold">₦{parseFloat(deduction.pensionFund).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Health Ins.</p>
                    <p className="font-bold">₦{parseFloat(deduction.healthInsurance).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Union Dues</p>
                    <p className="font-bold">₦{parseFloat(deduction.unionDues).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-bold text-red-600">₦{parseFloat(deduction.totalAmount).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {attendanceRecords.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No attendance records found</p>
            </div>
          ) : (
            attendanceRecords.map(record => (
              <div key={record.attendanceId} className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-600">Staff Member</p>
                    <p className="font-bold">{staff.find(s => s.staffId === record.staffId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Month</p>
                    <p className="font-bold">{record.month}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Present Days</p>
                    <p className="font-bold text-green-600">{record.presentDays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Absent Days</p>
                    <p className="font-bold text-red-600">{record.absentDays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sick Days</p>
                    <p className="font-bold text-orange-600">{record.sickDays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Leave Days</p>
                    <p className="font-bold text-blue-600">{record.leaveDays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Attendance %</p>
                    <p className="font-bold text-gray-800">{record.attendancePercentage}%</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Loans Tab */}
      {activeTab === 'loans' && (
        <div className="space-y-4">
          {loanRecords.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <TrendingDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No loans found</p>
            </div>
          ) : (
            loanRecords.map(loan => (
              <div key={loan.loanId} className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                  <div>
                    <p className="text-sm text-gray-600">Staff Member</p>
                    <p className="font-bold">{staff.find(s => s.staffId === loan.staffId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loan Type</p>
                    <p className="font-bold">{loan.loanType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-bold text-blue-600">₦{parseFloat(loan.loanAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Repayment</p>
                    <p className="font-bold">₦{parseFloat(loan.monthlyRepayment).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Repayment Duration</p>
                    <p className="font-bold">{loan.repaymentDuration} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      loan.status === 'Active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {loan.status}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date Approved</p>
                      <p className="font-bold">{new Date(loan.approvedDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-bold">{new Date(loan.startDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Expected Completion</p>
                      <p className="font-bold">{new Date(loan.expectedCompletionDate).toLocaleDateString('en-NG')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Attendance Modal */}
      <GenericModal
        isOpen={showAttendanceForm}
        onClose={() => setShowAttendanceForm(false)}
        title="Record Monthly Attendance"
        size="lg"
      >
        <div className="space-y-4">
          <select
            value={attendanceData.staffId}
            onChange={(e) => setAttendanceData({ ...attendanceData, staffId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          >
            <option value="">Select Staff Member</option>
            {staff.map(s => (
              <option key={s.staffId} value={s.staffId}>{s.name}</option>
            ))}
          </select>
          <input
            type="month"
            value={attendanceData.month}
            onChange={(e) => setAttendanceData({ ...attendanceData, month: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Present Days"
              value={attendanceData.presentDays}
              onChange={(e) => setAttendanceData({ ...attendanceData, presentDays: e.target.value })}
              min="0"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
            <input
              type="number"
              placeholder="Absent Days"
              value={attendanceData.absentDays}
              onChange={(e) => setAttendanceData({ ...attendanceData, absentDays: e.target.value })}
              min="0"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
            <input
              type="number"
              placeholder="Sick Days"
              value={attendanceData.sickDays}
              onChange={(e) => setAttendanceData({ ...attendanceData, sickDays: e.target.value })}
              min="0"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
            <input
              type="number"
              placeholder="Leave Days"
              value={attendanceData.leaveDays}
              onChange={(e) => setAttendanceData({ ...attendanceData, leaveDays: e.target.value })}
              min="0"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
          </div>
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleAddAttendance}
              className="flex-1 bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Save Attendance
            </button>
            <button
              onClick={() => setShowAttendanceForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default PayrollManagement;
