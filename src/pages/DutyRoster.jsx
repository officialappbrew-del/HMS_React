import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit,
  Menu,
  X,
  Search,
  Filter
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { addLeaveRequest, approveLeave, rejectLeave, addOvertimeRecord, addDutyRoster, addDutyAssignment } from '../features/rosterSlice';

const DutyRoster = () => {
  const rosterState = useSelector(state => state.roster) || {};
  const dutyRosters = rosterState.dutyRosters || [];
  const leaves = rosterState.leaves || [];
  const overtime = rosterState.overtime || [];
  const staffState = useSelector(state => state.staff || {});
  const staff = staffState.staff || [];
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('roster');
  const [showAddLeaveModal, setShowAddLeaveModal] = useState(false);
  const [showAddOvertimeModal, setShowAddOvertimeModal] = useState(false);
  const [showCreateRosterModal, setShowCreateRosterModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [leaveFormData, setLeaveFormData] = useState({
    staffId: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [overtimeFormData, setOvertimeFormData] = useState({
    staffId: '',
    date: '',
    hours: '',
    reason: ''
  });

  const [rosterFormData, setRosterFormData] = useState({
    month: '',
    year: '',
    department: '',
    assignments: []
  });

  const [assignmentFormData, setAssignmentFormData] = useState({
    staffId: '',
    date: '',
    dutyType: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const leaveTypes = ['Annual', 'Sick', 'Maternity', 'Paternity', 'Study', 'Compassionate', 'Conference'];
  const dutyTypes = ['Call Duty', 'Night Duty', 'Weekend', 'Emergency', 'Clinic'];

  // Filter leaves based on search query
  const filteredLeaves = searchQuery 
    ? leaves.filter(leave => {
        const staffMember = staff.find(s => s.staffId === leave.staffId);
        return (
          (staffMember?.name && staffMember.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (leave.leaveType && leave.leaveType.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (leave.status && leave.status.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      })
    : leaves;

  // Approve leave request
  const handleApproveLeave = (leaveId) => {
    dispatch(approveLeave(leaveId));
  };

  // Reject leave request
  const handleRejectLeave = (leaveId) => {
    dispatch(rejectLeave(leaveId));
  };

  // Get leave balance for a staff member
  const getLeaveBalance = (staffId) => {
    const allocation = { 'DR001': 21, 'NUR001': 21, 'PHARM001': 21, 'LAB001': 21, 'ADMIN001': 18 };
    const usedDays = leaves
      .filter(l => l.staffId === staffId && l.status === 'Approved' && l.leaveType === 'Annual')
      .reduce((sum, l) => {
        if (!l.startDate || !l.endDate) return sum;
        const start = new Date(l.startDate);
        const end = new Date(l.endDate);
        return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      }, 0);
    return (allocation[staffId] || 0) - usedDays;
  };

  const handleAddLeave = () => {
    if (leaveFormData.staffId && leaveFormData.leaveType && leaveFormData.startDate && leaveFormData.endDate) {
      setShowAddLeaveModal(false);
      setLeaveFormData({ staffId: '', leaveType: '', startDate: '', endDate: '', reason: '' });
    }
  };

  const handleAddOvertime = () => {
    if (overtimeFormData.staffId && overtimeFormData.date && overtimeFormData.hours) {
      setShowAddOvertimeModal(false);
      setOvertimeFormData({ staffId: '', date: '', hours: '', reason: '' });
    }
  };

  const handleCreateRoster = () => {
    if (rosterFormData.month && rosterFormData.year && rosterFormData.department) {
      const newRoster = {
        rosterId: `ROSTER${Date.now()}`,
        month: rosterFormData.month,
        year: parseInt(rosterFormData.year),
        department: rosterFormData.department,
        status: 'Draft',
        createdDate: new Date().toISOString().split('T')[0],
        assignments: rosterFormData.assignments
      };
      dispatch(addDutyRoster(newRoster));
      setShowCreateRosterModal(false);
      setRosterFormData({ month: '', year: '', department: '', assignments: [] });
    }
  };

  const handleAddAssignment = () => {
    if (assignmentFormData.staffId && assignmentFormData.date && assignmentFormData.dutyType) {
      const staffMember = staff.find(s => s.staffId === assignmentFormData.staffId);
      const newAssignment = {
        assignmentId: `ASSIGN${Date.now()}`,
        staffId: assignmentFormData.staffId,
        staffName: staffMember?.name || 'Unknown Staff',
        date: assignmentFormData.date,
        dutyType: assignmentFormData.dutyType,
        startTime: assignmentFormData.startTime,
        endTime: assignmentFormData.endTime,
        notes: assignmentFormData.notes
      };
      setRosterFormData(prev => ({
        ...prev,
        assignments: [...prev.assignments, newAssignment]
      }));
      setAssignmentFormData({
        staffId: '',
        date: '',
        dutyType: '',
        startTime: '',
        endTime: '',
        notes: ''
      });
    }
  };

  return (
    <div className="duty-roster p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-lg bg-white shadow-md"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="text-lg font-bold text-gray-800">Duty Roster</div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <Calendar className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-nigerian-green" />
            Duty Roster Management
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Create and manage staff duty schedules, leave, and overtime</p>
        </div>
        
        {/* Search Bar - Mobile Top */}
        <div className="md:hidden w-full mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leave requests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Responsive Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          {activeTab === 'roster' && (
            <button
              onClick={() => setShowCreateRosterModal(true)}
              className="flex-1 md:flex-none px-4 py-2.5 md:px-6 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium inline-flex items-center justify-center text-sm md:text-base transition-colors duration-200"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">Create Roster</span>
                <span className="sm:hidden">Roster</span>
              </span>
            </button>
          )}
          {activeTab === 'leaves' && (
            <button
              onClick={() => setShowAddLeaveModal(true)}
              className="flex-1 md:flex-none px-4 py-2.5 md:px-6 md:py-3 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center text-sm md:text-base transition-colors duration-200"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">Request Leave</span>
                <span className="sm:hidden">Leave</span>
              </span>
            </button>
          )}
          {activeTab === 'overtime' && (
            <button
              onClick={() => setShowAddOvertimeModal(true)}
              className="flex-1 md:flex-none px-4 py-2.5 md:px-6 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium inline-flex items-center justify-center text-sm md:text-base transition-colors duration-200"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">Record Overtime</span>
                <span className="sm:hidden">Overtime</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar - Desktop */}
      {activeTab === 'leaves' && (
        <div className="hidden md:block mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search leave requests by staff name, type, or status..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-nigerian-green">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-nigerian-green mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Published Rosters</p>
              <p className="text-nigerian-green font-bold text-lg md:text-xl lg:text-2xl">{dutyRosters.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-500 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Pending Leaves</p>
              <p className="text-blue-500 font-bold text-lg md:text-xl lg:text-2xl">{leaves.filter(l => l.status === 'Pending').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <Clock className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-orange-500 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Overtime Hours</p>
              <p className="text-orange-500 font-bold text-lg md:text-xl lg:text-2xl">
                {overtime.reduce((sum, r) => sum + (parseFloat(r.hoursWorked || r.hours || 0)), 0).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-green-500 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Approved Leaves</p>
              <p className="text-green-500 font-bold text-lg md:text-xl lg:text-2xl">{leaves.filter(l => l.status === 'Approved').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { setActiveTab('roster'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'roster' ? 'bg-nigerian-green/10 text-nigerian-green' : 'text-gray-700'
                }`}
              >
                Rosters
              </button>
              <button
                onClick={() => { setActiveTab('leaves'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'leaves' ? 'bg-nigerian-green/10 text-nigerian-green' : 'text-gray-700'
                }`}
              >
                Leave Requests ({leaves.length})
              </button>
              <button
                onClick={() => { setActiveTab('overtime'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'overtime' ? 'bg-nigerian-green/10 text-nigerian-green' : 'text-gray-700'
                }`}
              >
                Overtime ({overtime.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="hidden md:flex gap-2 lg:gap-4 mb-4 lg:mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'roster'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Rosters
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'leaves'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Leave Requests ({leaves.length})
        </button>
        <button
          onClick={() => setActiveTab('overtime')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'overtime'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Overtime ({overtime.length})
        </button>
      </div>

      {/* Mobile Tab Indicator */}
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
          <span className="font-medium text-gray-700">
            {activeTab === 'roster' && 'Rosters'}
            {activeTab === 'leaves' && `Leave Requests (${filteredLeaves.length})`}
            {activeTab === 'overtime' && `Overtime (${overtime.length})`}
          </span>
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="p-1 rounded-md bg-gray-100"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Rosters Tab */}
      {activeTab === 'roster' && (
        <div className="space-y-4 md:space-y-6">
          {dutyRosters.map(roster => (
            <div key={roster.rosterId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
              <div className="mb-3 md:mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800">{roster.month || 'Unnamed Roster'} - {roster.department || 'No Department'}</h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Status: <span className="inline-block px-2 py-1 md:px-3 md:py-1 bg-green-100 text-green-800 rounded-full font-semibold text-xs md:text-sm">
                    {roster.status || 'Draft'}
                  </span>
                </p>
              </div>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-full">
                  <div className="hidden md:table w-full">
                    <div className="table-row border-b">
                      <div className="table-cell py-3 px-4 font-semibold text-gray-700">Staff Member</div>
                      <div className="table-cell py-3 px-4 font-semibold text-gray-700">Date</div>
                      <div className="table-cell py-3 px-4 font-semibold text-gray-700">Duty Type</div>
                      <div className="table-cell py-3 px-4 font-semibold text-gray-700">Time</div>
                      <div className="table-cell py-3 px-4 font-semibold text-gray-700">Notes</div>
                    </div>
                    {(roster.assignments || []).map(assignment => (
                      <div key={assignment.assignmentId} className="table-row border-b hover:bg-gray-50">
                        <div className="table-cell py-3 px-4 font-medium">{assignment.staffName || 'Unknown Staff'}</div>
                        <div className="table-cell py-3 px-4">
                          {assignment.date ? new Date(assignment.date).toLocaleDateString('en-NG') : 'No Date'}
                        </div>
                        <div className="table-cell py-3 px-4">
                          <span className="inline-block px-2 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-semibold">
                            {assignment.dutyType || 'Unspecified'}
                          </span>
                        </div>
                        <div className="table-cell py-3 px-4">{assignment.startTime || '--'} - {assignment.endTime || '--'}</div>
                        <div className="table-cell py-3 px-4 text-sm text-gray-600 truncate max-w-xs">{assignment.notes || 'No notes'}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mobile View */}
                  <div className="md:hidden space-y-3">
                    {(roster.assignments || []).map(assignment => (
                      <div key={assignment.assignmentId} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">{assignment.staffName || 'Unknown Staff'}</p>
                            <p className="text-xs text-gray-600">
                              {assignment.date ? new Date(assignment.date).toLocaleDateString('en-NG') : 'No Date'}
                            </p>
                          </div>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {assignment.dutyType || 'Unspecified'}
                          </span>
                        </div>
                        <div className="text-sm mb-1">
                          <span className="text-gray-600">Time: </span>
                          <span className="font-medium">{assignment.startTime || '--'} - {assignment.endTime || '--'}</span>
                        </div>
                        {assignment.notes && (
                          <div className="text-xs text-gray-600 truncate">
                            {assignment.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {dutyRosters.length === 0 && (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <Calendar className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No rosters published yet</p>
            </div>
          )}
        </div>
      )}

      {/* Leaves Tab */}
      {activeTab === 'leaves' && (
        <div className="space-y-3 md:space-y-4">
          {filteredLeaves.length === 0 ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No leave requests</p>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-2">No results for "{searchQuery}"</p>
              )}
            </div>
          ) : (
            filteredLeaves.map(leave => {
              const staffMember = staff.find(s => s.staffId === leave.staffId);
              return (
                <div key={leave.leaveId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 items-start">
                    <div className="sm:col-span-2 lg:col-span-1">
                      <p className="text-xs md:text-sm text-gray-600">Staff Member</p>
                      <p className="font-bold text-sm md:text-base truncate">{staffMember?.name || 'Unknown Staff'}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Leave Type</p>
                      <p className="font-bold text-xs md:text-sm">{leave.leaveType || 'Unknown'}</p>
                    </div>
                    <div className="lg:hidden">
                      <p className="text-xs md:text-sm text-gray-600">Dates</p>
                      <p className="font-bold text-xs">
                        {leave.startDate ? new Date(leave.startDate).toLocaleDateString('en-NG') : 'No start'} - 
                        {leave.endDate ? new Date(leave.endDate).toLocaleDateString('en-NG') : 'No end'}
                      </p>
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-xs md:text-sm text-gray-600">Dates</p>
                      <p className="font-bold text-sm">{leave.startDate ? new Date(leave.startDate).toLocaleDateString('en-NG') : 'No start'}</p>
                      <p className="font-bold text-sm">to {leave.endDate ? new Date(leave.endDate).toLocaleDateString('en-NG') : 'No end'}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Days</p>
                      <p className="font-bold text-xs md:text-sm">
                        {leave.startDate && leave.endDate 
                          ? Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Status</p>
                      <p className={`inline-block px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold ${
                        leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {leave.status || 'Pending'}
                      </p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      {leave.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveLeave(leave.leaveId)}
                            className="flex-1 px-2 py-1.5 md:px-3 md:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-xs md:text-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectLeave(leave.leaveId)}
                            className="flex-1 px-2 py-1.5 md:px-3 md:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-xs md:text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="h-full flex items-center">
                          <span className="text-xs md:text-sm text-gray-500 italic">Processed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {leave.reason && (
                    <div className="mt-2 md:mt-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs md:text-sm text-gray-700"><strong>Reason:</strong> {leave.reason}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Overtime Tab */}
      {activeTab === 'overtime' && (
        <div className="space-y-3 md:space-y-4">
          {overtime.length === 0 ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <Clock className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No overtime records</p>
            </div>
          ) : (
            overtime.map(overtimeRecord => {
              const staffMember = staff.find(s => s.staffId === overtimeRecord.staffId);
              return (
                <div key={overtimeRecord.overtimeId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 items-start">
                    <div className="sm:col-span-2 lg:col-span-1">
                      <p className="text-xs md:text-sm text-gray-600">Staff Member</p>
                      <p className="font-bold text-sm md:text-base truncate">{staffMember?.name || 'Unknown Staff'}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Date</p>
                      <p className="font-bold text-xs md:text-sm">
                        {overtimeRecord.date ? new Date(overtimeRecord.date).toLocaleDateString('en-NG') : 'No Date'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Hours</p>
                      <p className="font-bold text-xs md:text-sm">{overtimeRecord.hoursWorked || overtimeRecord.hours || 0} hours</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Status</p>
                      <p className={`inline-block px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-semibold ${
                        overtimeRecord.approvalStatus === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {overtimeRecord.approvalStatus || 'Pending'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Pay Rate</p>
                      <p className="font-bold text-xs md:text-sm">1.5x</p>
                    </div>
                  </div>
                  {overtimeRecord.reason && (
                    <div className="mt-2 md:mt-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs md:text-sm text-gray-700"><strong>Reason:</strong> {overtimeRecord.reason}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add Leave Modal */}
      <GenericModal
        isOpen={showAddLeaveModal}
        onClose={() => setShowAddLeaveModal(false)}
        title="Request Leave"
        size="lg"
      >
        <div className="space-y-3 md:space-y-4">
          <select
            value={leaveFormData.staffId}
            onChange={(e) => setLeaveFormData({ ...leaveFormData, staffId: e.target.value })}
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
          >
            <option value="">Select Staff Member</option>
            {staff.map(s => (
              <option key={s.staffId} value={s.staffId}>
                {s.name} (Balance: {getLeaveBalance(s.staffId)} days)
              </option>
            ))}
          </select>
          <select
            value={leaveFormData.leaveType}
            onChange={(e) => setLeaveFormData({ ...leaveFormData, leaveType: e.target.value })}
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={leaveFormData.startDate}
                onChange={(e) => setLeaveFormData({ ...leaveFormData, startDate: e.target.value })}
                className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={leaveFormData.endDate}
                onChange={(e) => setLeaveFormData({ ...leaveFormData, endDate: e.target.value })}
                className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs md:text-sm text-gray-600 mb-1">Reason for leave</label>
            <textarea
              placeholder="Enter reason for leave"
              value={leaveFormData.reason}
              onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
            ></textarea>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAddLeave}
              className="flex-1 bg-nigerian-green text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-green-700 font-medium text-sm md:text-base transition-colors"
            >
              Request Leave
            </button>
            <button
              onClick={() => setShowAddLeaveModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-400 font-medium text-sm md:text-base transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      {/* Add Overtime Modal */}
      <GenericModal
        isOpen={showAddOvertimeModal}
        onClose={() => setShowAddOvertimeModal(false)}
        title="Record Overtime"
        size="lg"
      >
        <div className="space-y-3 md:space-y-4">
          <select
            value={overtimeFormData.staffId}
            onChange={(e) => setOvertimeFormData({ ...overtimeFormData, staffId: e.target.value })}
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
          >
            <option value="">Select Staff Member</option>
            {staff.map(s => (
              <option key={s.staffId} value={s.staffId}>{s.name}</option>
            ))}
          </select>
          <div>
            <label className="block text-xs md:text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={overtimeFormData.date}
              onChange={(e) => setOvertimeFormData({ ...overtimeFormData, date: e.target.value })}
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm text-gray-600 mb-1">Hours worked</label>
            <input
              type="number"
              placeholder="Enter hours"
              value={overtimeFormData.hours}
              onChange={(e) => setOvertimeFormData({ ...overtimeFormData, hours: e.target.value })}
              min="0.5"
              step="0.5"
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm text-gray-600 mb-1">Reason for overtime</label>
            <textarea
              placeholder="Enter reason for overtime"
              value={overtimeFormData.reason}
              onChange={(e) => setOvertimeFormData({ ...overtimeFormData, reason: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green text-sm md:text-base"
            ></textarea>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAddOvertime}
              className="flex-1 bg-blue-500 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-600 font-medium text-sm md:text-base transition-colors"
            >
              Record Overtime
            </button>
            <button
              onClick={() => setShowAddOvertimeModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-400 font-medium text-sm md:text-base transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      {/* Create Roster Modal */}
      <GenericModal
        isOpen={showCreateRosterModal}
        onClose={() => setShowCreateRosterModal(false)}
        title="Create Duty Roster"
        size="large"
      >
        <div className="space-y-6">
          {/* Roster Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={rosterFormData.month}
                onChange={(e) => setRosterFormData(prev => ({ ...prev, month: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
              >
                <option value="">Select Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                value={rosterFormData.year}
                onChange={(e) => setRosterFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <input
                type="text"
                value={rosterFormData.department}
                onChange={(e) => setRosterFormData(prev => ({ ...prev, department: e.target.value }))}
                placeholder="e.g., Internal Medicine"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
              />
            </div>
          </div>

          {/* Add Assignment Form */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Duty Assignments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Member</label>
                <select
                  value={assignmentFormData.staffId}
                  onChange={(e) => setAssignmentFormData(prev => ({ ...prev, staffId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                >
                  <option value="">Select Staff</option>
                  {staff.map(member => (
                    <option key={member.staffId} value={member.staffId}>
                      {member.name} - {member.role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={assignmentFormData.date}
                  onChange={(e) => setAssignmentFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duty Type</label>
                <select
                  value={assignmentFormData.dutyType}
                  onChange={(e) => setAssignmentFormData(prev => ({ ...prev, dutyType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                >
                  <option value="">Select Duty Type</option>
                  {dutyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={assignmentFormData.startTime}
                  onChange={(e) => setAssignmentFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={assignmentFormData.endTime}
                  onChange={(e) => setAssignmentFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddAssignment}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Assignment
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={assignmentFormData.notes}
                onChange={(e) => setAssignmentFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes for this assignment"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green focus:border-transparent"
              />
            </div>
          </div>

          {/* Assignments List */}
          {rosterFormData.assignments.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Assignments ({rosterFormData.assignments.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {rosterFormData.assignments.map((assignment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{assignment.staffName}</p>
                      <p className="text-sm text-gray-600">
                        {assignment.date} - {assignment.dutyType} ({assignment.startTime} - {assignment.endTime})
                      </p>
                    </div>
                    <button
                      onClick={() => setRosterFormData(prev => ({
                        ...prev,
                        assignments: prev.assignments.filter((_, i) => i !== index)
                      }))}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              onClick={() => setShowCreateRosterModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateRoster}
              disabled={!rosterFormData.month || !rosterFormData.year || !rosterFormData.department}
              className="px-6 py-2 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Roster
            </button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default DutyRoster;