import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  addMaintenanceSchedule,
  updateMaintenanceSchedule,
  addBreakdown,
  updateBreakdown,
  resolveBreakdown,
  completeMaintenance
} from '../features/maintenanceSlice';

import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

const MaintenanceManagement = () => {
  const dispatch = useDispatch();
  const {
    preventiveSchedules,
    breakdownReports,
    repairHistory,
    spareParts,
    serviceContracts,
    maintenanceTypes,
    priorities,
    statuses
  } = useSelector(state => state.maintenance);

  const { equipment } = useSelector(state => state.equipment);

  const [activeTab, setActiveTab] = useState('preventive');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('schedule'); // 'schedule', 'breakdown', 'repair'
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    // For preventive schedules
    equipmentId: '',
    maintenanceType: '',
    frequency: '',
    technician: '',
    priority: 'Medium',
    estimatedCost: '',
    notes: '',

    // For breakdown reports
    reportedBy: '',
    breakdownDate: '',
    description: '',
    severity: 'Medium',
    assignedTechnician: '',
    estimatedRepairTime: '',

    // For repair history
    repairDate: '',
    issue: '',
    solution: '',
    partsReplaced: '',
    laborCost: '',
    partsCost: '',
    warrantyCovered: false
  });

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'delete',
    data: null,
    action: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formType === 'schedule') {
      if (!formData.equipmentId || !formData.maintenanceType) {
        alert('Equipment and maintenance type are required');
        return;
      }

      const equipment = equipment.find(eq => eq.equipmentId === formData.equipmentId);
      if (!equipment) return;

      const newSchedule = {
        scheduleId: `SCH${Date.now()}`,
        equipmentId: formData.equipmentId,
        equipmentName: equipment.name,
        maintenanceType: formData.maintenanceType,
        frequency: formData.frequency,
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: calculateNextMaintenance(formData.frequency),
        technician: formData.technician,
        status: 'Scheduled',
        priority: formData.priority,
        estimatedCost: parseFloat(formData.estimatedCost) || 0,
        notes: formData.notes
      };

      dispatch(addPreventiveSchedule(newSchedule));

    } else if (formType === 'breakdown') {
      if (!formData.equipmentId || !formData.description) {
        alert('Equipment and description are required');
        return;
      }

      const equipment = equipment.find(eq => eq.equipmentId === formData.equipmentId);
      if (!equipment) return;

      const newReport = {
        reportId: `BR${Date.now()}`,
        equipmentId: formData.equipmentId,
        equipmentName: equipment.name,
        reportedBy: formData.reportedBy,
        reportedDate: new Date().toISOString().split('T')[0],
        breakdownDate: formData.breakdownDate,
        description: formData.description,
        severity: formData.severity,
        status: 'Reported',
        assignedTechnician: formData.assignedTechnician,
        estimatedRepairTime: formData.estimatedRepairTime,
        actualRepairTime: null,
        repairCost: null,
        partsUsed: [],
        resolution: null,
        downtime: '0 hours'
      };

      dispatch(addBreakdownReport(newReport));

    } else if (formType === 'repair') {
      if (!formData.equipmentId || !formData.issue) {
        alert('Equipment and issue description are required');
        return;
      }

      const equipment = equipment.find(eq => eq.equipmentId === formData.equipmentId);
      if (!equipment) return;

      const newRepair = {
        repairId: `REP${Date.now()}`,
        equipmentId: formData.equipmentId,
        equipmentName: equipment.name,
        repairDate: formData.repairDate,
        technician: formData.technician,
        issue: formData.issue,
        solution: formData.solution,
        partsReplaced: formData.partsReplaced.split(',').map(p => p.trim()).filter(p => p),
        laborCost: parseFloat(formData.laborCost) || 0,
        partsCost: parseFloat(formData.partsCost) || 0,
        totalCost: (parseFloat(formData.laborCost) || 0) + (parseFloat(formData.partsCost) || 0),
        warrantyCovered: formData.warrantyCovered,
        notes: formData.notes
      };

      dispatch(addRepairHistory(newRepair));
    }

    resetForm();
    setShowForm(false);
  };

  const calculateNextMaintenance = (frequency) => {
    const now = new Date();
    let months = 0;

    if (frequency.includes('3 months')) months = 3;
    else if (frequency.includes('6 months')) months = 6;
    else if (frequency.includes('12 months') || frequency.includes('year')) months = 12;

    now.setMonth(now.getMonth() + months);
    return now.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setFormData({
      equipmentId: '',
      maintenanceType: '',
      frequency: '',
      technician: '',
      priority: 'Medium',
      estimatedCost: '',
      notes: '',
      reportedBy: '',
      breakdownDate: '',
      description: '',
      severity: 'Medium',
      assignedTechnician: '',
      estimatedRepairTime: '',
      repairDate: '',
      issue: '',
      solution: '',
      partsReplaced: '',
      laborCost: '',
      partsCost: '',
      warrantyCovered: false
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resolveBreakdownReport = (reportId) => {
    // In a real app, this would open a form to enter resolution details
    const resolution = prompt('Enter resolution details:');
    if (resolution) {
      dispatch(resolveBreakdown({
        reportId,
        resolution,
        actualRepairTime: '4 hours',
        repairCost: 15000,
        partsUsed: ['Replacement part']
      }));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPreventiveSchedules = () => {
    const displayedItems = preventiveSchedules.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Preventive Maintenance Schedules</h3>
          <button
            onClick={() => {
              setFormType('schedule');
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + Schedule Maintenance
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((schedule) => (
                <tr key={schedule.scheduleId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{schedule.equipmentName}</div>
                    <div className="text-sm text-gray-500">{schedule.frequency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.maintenanceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.nextMaintenance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(schedule.priority)}`}>
                      {schedule.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(schedule.status)}`}>
                      {schedule.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBreakdownReports = () => {
    const displayedItems = breakdownReports.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Breakdown Reports</h3>
          <button
            onClick={() => {
              setFormType('breakdown');
              setShowForm(true);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            + Report Breakdown
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reported</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((report) => (
                <tr key={report.reportId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.equipmentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.reportedDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {report.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {report.status !== 'Resolved' && (
                      <button
                        onClick={() => resolveBreakdownReport(report.reportId)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRepairHistory = () => {
    const displayedItems = repairHistory.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Repair History</h3>
          <button
            onClick={() => {
              setFormType('repair');
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Add Repair Record
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warranty</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((repair) => (
                <tr key={repair.repairId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {repair.equipmentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {repair.repairDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {repair.issue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{repair.totalCost?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      repair.warrantyCovered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {repair.warrantyCovered ? 'Covered' : 'Not Covered'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="maintenance-management p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Maintenance Management</h2>
        <p className="text-gray-600">Preventive maintenance, breakdown reporting, and repair tracking</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'preventive', label: 'Preventive Schedules', count: preventiveSchedules.length },
              { id: 'breakdown', label: 'Breakdown Reports', count: breakdownReports.length },
              { id: 'repair', label: 'Repair History', count: repairHistory.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Panel */}
        {showForm && (
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {formType === 'schedule' && 'Schedule Maintenance'}
                  {formType === 'breakdown' && 'Report Breakdown'}
                  {formType === 'repair' && 'Add Repair Record'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Equipment *</label>
                  <select
                    name="equipmentId"
                    value={formData.equipmentId}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Equipment</option>
                    {equipment.map(eq => (
                      <option key={eq.equipmentId} value={eq.equipmentId}>
                        {eq.name} ({eq.serialNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {formType === 'schedule' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Maintenance Type *</label>
                      <select
                        name="maintenanceType"
                        value={formData.maintenanceType}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Type</option>
                        {Object.values(maintenanceTypes).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Frequency</label>
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Frequency</option>
                        <option value="3 months">Every 3 months</option>
                        <option value="6 months">Every 6 months</option>
                        <option value="12 months">Annually</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Priority</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {Object.values(priorities).map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Estimated Cost (₦)</label>
                      <input
                        type="number"
                        name="estimatedCost"
                        value={formData.estimatedCost}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {formType === 'breakdown' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reported By</label>
                      <input
                        type="text"
                        name="reportedBy"
                        value={formData.reportedBy}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Breakdown Date</label>
                      <input
                        type="date"
                        name="breakdownDate"
                        value={formData.breakdownDate}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Severity</label>
                      <select
                        name="severity"
                        value={formData.severity}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </>
                )}

                {formType === 'repair' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Repair Date</label>
                      <input
                        type="date"
                        name="repairDate"
                        value={formData.repairDate}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Technician</label>
                      <input
                        type="text"
                        name="technician"
                        value={formData.technician}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Issue Description *</label>
                      <textarea
                        name="issue"
                        value={formData.issue}
                        onChange={handleChange}
                        rows="2"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Solution</label>
                      <textarea
                        name="solution"
                        value={formData.solution}
                        onChange={handleChange}
                        rows="2"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Parts Replaced (comma-separated)</label>
                      <input
                        type="text"
                        name="partsReplaced"
                        value={formData.partsReplaced}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Labor Cost (₦)</label>
                        <input
                          type="number"
                          name="laborCost"
                          value={formData.laborCost}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Parts Cost (₦)</label>
                        <input
                          type="number"
                          name="partsCost"
                          value={formData.partsCost}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="warrantyCovered"
                        checked={formData.warrantyCovered}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Warranty covered
                      </label>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="2"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
                >
                  {formType === 'schedule' && 'Schedule Maintenance'}
                  {formType === 'breakdown' && 'Report Breakdown'}
                  {formType === 'repair' && 'Add Repair Record'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Content Panel */}
        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
          {activeTab === 'preventive' && renderPreventiveSchedules()}
          {activeTab === 'breakdown' && renderBreakdownReports()}
          {activeTab === 'repair' && renderRepairHistory()}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagement;