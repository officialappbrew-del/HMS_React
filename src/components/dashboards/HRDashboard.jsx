import { useEffect, useState } from 'react';
import { apiRequest } from '../../utils/api';
import { Users, CalendarCheck, Clock3, ClipboardCheck, Check, X, RefreshCw } from 'lucide-react';

const cardStyle = 'border border-[#E8E3DC] bg-white p-4';

const HRDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payrollRuns, setPayrollRuns] = useState([]);
  const [activeTab, setActiveTab] = useState('leave');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryData, employeeData, leaveData, attendanceData, payrollData] = await Promise.all([
        apiRequest('/api/v1/hr/summary/'),
        apiRequest('/api/v1/hr/employees/'),
        apiRequest('/api/v1/hr/leave-applications/'),
        apiRequest('/api/v1/hr/attendance/'),
        apiRequest('/api/v1/hr/payroll-runs/'),
      ]);
      setSummary(summaryData);
      setEmployees(Array.isArray(employeeData) ? employeeData : employeeData.results || []);
      setLeaves(Array.isArray(leaveData) ? leaveData : leaveData.results || []);
      setAttendance(Array.isArray(attendanceData) ? attendanceData : attendanceData.results || []);
      setPayrollRuns(Array.isArray(payrollData) ? payrollData : payrollData.results || []);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load HR data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const reviewLeave = async (leaveId, action) => {
    try {
      await apiRequest(`/api/v1/hr/leave-applications/${leaveId}/${action}/`, {
        method: 'POST',
        body: action === 'reject' ? JSON.stringify({ reason: 'Leave request does not meet current staffing requirements.' }) : undefined,
      });
      await loadData();
    } catch (requestError) {
      setError(requestError.message || 'Unable to update leave request.');
    }
  };

  const generatePayroll = async () => {
    const today = new Date();
    const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    try {
      await apiRequest('/api/v1/hr/payroll-runs/', {
        method: 'POST',
        body: JSON.stringify({ month, status: 'draft' }),
      });
      await loadData();
    } catch (requestError) {
      setError(requestError.message || 'Unable to generate payroll.');
    }
  };

  const stats = [
    { label: 'Active staff', value: summary?.staff_count ?? '-', icon: Users, color: 'bg-[#008751]' },
    { label: 'Late arrivals', value: summary?.late_count ?? '-', icon: Clock3, color: 'bg-[#C87D3D]' },
    { label: 'Pending leave', value: summary?.pending_leave_count ?? '-', icon: ClipboardCheck, color: 'bg-[#C8553D]' },
    { label: 'Attendance entries', value: attendance.length, icon: CalendarCheck, color: 'bg-[#4A5A5A]' },
  ];

  return (
    <main className="min-h-screen bg-[#F7F5F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#008751]">People operations</p>
            <h1 className="mt-1 text-2xl font-bold text-[#1A1A1A] sm:text-3xl">HR workspace</h1>
            <p className="mt-1 text-sm text-[#5A5A5A]">Staff, attendance, and leave approvals in one view.</p>
          </div>
          <button type="button" onClick={loadData} className="inline-flex items-center gap-2 self-start border border-[#D8D4CD] bg-white px-3 py-2 text-sm font-medium text-[#1A1A1A] hover:bg-[#F0EDE8] sm:self-auto">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </header>

        {error && <div className="mb-4 border border-[#C8553D] bg-[#F5EDEA] p-3 text-sm text-[#A8442E]">{error}</div>}

        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={cardStyle}>
              <div className="flex items-center justify-between">
                <div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#5A5A5A]">{label}</p><p className="mt-1 text-2xl font-bold text-[#1A1A1A]">{loading ? '...' : value}</p></div>
                <span className={`flex h-10 w-10 items-center justify-center ${color} text-white`}><Icon className="h-5 w-5" /></span>
              </div>
            </div>
          ))}
        </section>

        <section className={cardStyle}>
          <div className="mb-4 flex gap-5 border-b border-[#E8E3DC]">
            {['leave', 'staff', 'payroll'].map(tab => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`pb-3 text-sm font-semibold capitalize ${activeTab === tab ? 'border-b-2 border-[#008751] text-[#008751]' : 'text-[#5A5A5A]'}`}>{tab === 'leave' ? 'Leave queue' : tab === 'staff' ? `Staff directory (${employees.length})` : 'Payroll runs'}</button>)}
          </div>
          {activeTab === 'leave' ? (
            <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="text-[10px] uppercase tracking-wider text-[#5A5A5A]"><tr><th className="pb-3">Employee</th><th className="pb-3">Type</th><th className="pb-3">Dates</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th></tr></thead><tbody>{leaves.map(leave => <tr key={leave.id} className="border-t border-[#E8E3DC]"><td className="py-3 font-medium text-[#1A1A1A]">{leave.employee_name || leave.employee}</td><td className="py-3 capitalize">{leave.leave_type}</td><td className="py-3">{leave.start_date} to {leave.end_date} ({leave.total_days}d)</td><td className="py-3 capitalize">{leave.status}</td><td className="py-3 text-right">{leave.status === 'pending' && <span className="inline-flex gap-1"><button title="Approve leave" type="button" onClick={() => reviewLeave(leave.id, 'approve')} className="p-1.5 text-[#2D7D46] hover:bg-[#EAF3EE]"><Check className="h-4 w-4" /></button><button title="Reject leave" type="button" onClick={() => reviewLeave(leave.id, 'reject')} className="p-1.5 text-[#C8553D] hover:bg-[#F5EDEA]"><X className="h-4 w-4" /></button></span>}</td></tr>)}{!leaves.length && <tr><td colSpan="5" className="py-8 text-center text-[#5A5A5A]">No leave applications found.</td></tr>}</tbody></table></div>
          ) : activeTab === 'staff' ? (
            <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="text-[10px] uppercase tracking-wider text-[#5A5A5A]"><tr><th className="pb-3">Employee ID</th><th className="pb-3">Name</th><th className="pb-3">Role</th><th className="pb-3">Department</th><th className="pb-3">Status</th></tr></thead><tbody>{employees.map(employee => <tr key={employee.id} className="border-t border-[#E8E3DC]"><td className="py-3 font-mono text-xs">{employee.employee_id || '-'}</td><td className="py-3 font-medium">{employee.name}</td><td className="py-3 capitalize">{employee.role.replaceAll('_', ' ')}</td><td className="py-3">{employee.department || '-'}</td><td className="py-3 capitalize">{employee.employment_status.replaceAll('_', ' ')}</td></tr>)}</tbody></table></div>
          ) : (
            <div><div className="mb-4 flex justify-end"><button type="button" onClick={generatePayroll} className="bg-[#008751] px-3 py-2 text-sm font-semibold text-white hover:bg-[#006B40]">Generate current month</button></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="text-[10px] uppercase tracking-wider text-[#5A5A5A]"><tr><th className="pb-3">Month</th><th className="pb-3">Gross</th><th className="pb-3">Deductions</th><th className="pb-3">Net pay</th><th className="pb-3">Status</th></tr></thead><tbody>{payrollRuns.map(run => <tr key={run.id} className="border-t border-[#E8E3DC]"><td className="py-3">{run.month}</td><td className="py-3">NGN {Number(run.total_gross || 0).toLocaleString()}</td><td className="py-3">NGN {Number(run.total_deductions || 0).toLocaleString()}</td><td className="py-3 font-semibold">NGN {Number(run.total_net || 0).toLocaleString()}</td><td className="py-3 capitalize">{String(run.status || '').replaceAll('_', ' ')}</td></tr>)}{!payrollRuns.length && <tr><td colSpan="5" className="py-8 text-center text-[#5A5A5A]">No payroll runs found.</td></tr>}</tbody></table></div></div>
          )}
        </section>
      </div>
    </main>
  );
};

export default HRDashboard;