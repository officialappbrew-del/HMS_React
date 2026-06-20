import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  addGenerator,
  updateGenerator,
  logRunHours,
  logFuelConsumption,
  addMaintenanceAlert,
  acknowledgeAlert,
  resolveAlert,
  logPowerOutage
} from '../features/generatorSlice';

import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

const GeneratorManagement = () => {
  const dispatch = useDispatch();
  const {
    generators,
    runHourLogs,
    fuelLogs,
    maintenanceAlerts,
    powerOutages,
    fuelInventory,
    fuelAnalytics
  } = useSelector(state => state.generator);

  const [activeTab, setActiveTab] = useState('generators');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('generator'); // 'generator', 'runhours', 'fuel', 'outage'
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    // For generators
    name: '',
    make: '',
    model: '',
    capacity: '',
    serialNumber: '',
    installationDate: '',
    location: '',
    fuelType: 'Diesel',
    technician: '',

    // For run hours
    generatorId: '',
    startTime: '',
    endTime: '',
    fuelConsumed: '',
    reason: '',
    operator: '',

    // For fuel logs
    fuelAdded: '',
    fuelLevelBefore: '',
    fuelLevelAfter: '',
    supplier: '',
    costPerLiter: '',
    receiptNumber: '',

    // For power outages
    outageStartTime: '',
    outageEndTime: '',
    cause: '',
    affectedAreas: '',
    backupTime: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formType === 'generator') {
      if (!formData.name || !formData.serialNumber) {
        alert('Generator name and serial number are required');
        return;
      }

      const newGenerator = {
        generatorId: `GEN${Date.now()}`,
        name: formData.name,
        make: formData.make,
        model: formData.model,
        capacity: formData.capacity,
        serialNumber: formData.serialNumber,
        installationDate: formData.installationDate,
        location: formData.location,
        fuelType: formData.fuelType,
        runHours: 0,
        lastMaintenance: formData.installationDate,
        nextMaintenance: calculateNextMaintenance(formData.installationDate),
        status: 'Operational',
        technician: formData.technician
      };

      dispatch(addGenerator(newGenerator));

    } else if (formType === 'runhours') {
      if (!formData.generatorId || !formData.startTime || !formData.endTime) {
        alert('Generator, start time, and end time are required');
        return;
      }

      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const runHours = (end - start) / (1000 * 60 * 60);

      const newLog = {
        logId: `LOG${Date.now()}`,
        generatorId: formData.generatorId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        runHours: runHours,
        fuelConsumed: parseFloat(formData.fuelConsumed) || 0,
        reason: formData.reason,
        operator: formData.operator,
        notes: formData.notes
      };

      dispatch(logRunHours(newLog));

    } else if (formType === 'fuel') {
      if (!formData.generatorId || !formData.fuelAdded) {
        alert('Generator and fuel amount are required');
        return;
      }

      const fuelAdded = parseFloat(formData.fuelAdded);
      const costPerLiter = parseFloat(formData.costPerLiter) || 650;
      const totalCost = fuelAdded * costPerLiter;

      const newFuelLog = {
        fuelId: `FUEL${Date.now()}`,
        generatorId: formData.generatorId,
        date: new Date().toISOString().split('T')[0],
        fuelAdded: fuelAdded,
        fuelLevelBefore: parseFloat(formData.fuelLevelBefore) || 0,
        fuelLevelAfter: parseFloat(formData.fuelLevelAfter) || fuelAdded,
        supplier: formData.supplier,
        costPerLiter: costPerLiter,
        totalCost: totalCost,
        receiptNumber: formData.receiptNumber,
        receivedBy: formData.operator
      };

      dispatch(logFuelConsumption(newFuelLog));

    } else if (formType === 'outage') {
      if (!formData.outageStartTime || !formData.outageEndTime) {
        alert('Start and end times are required');
        return;
      }

      const start = new Date(formData.outageStartTime);
      const end = new Date(formData.outageEndTime);
      const duration = `${Math.floor((end - start) / (1000 * 60 * 60))} hours ${Math.floor(((end - start) % (1000 * 60 * 60)) / (1000 * 60))} minutes`;

      const newOutage = {
        outageId: `OUT${Date.now()}`,
        startTime: formData.outageStartTime,
        endTime: formData.outageEndTime,
        duration: duration,
        cause: formData.cause,
        affectedAreas: formData.affectedAreas.split(',').map(a => a.trim()),
        generatorUsed: formData.generatorId,
        backupTime: formData.backupTime,
        reportedBy: formData.operator,
        notes: formData.notes
      };

      dispatch(logPowerOutage(newOutage));
    }

    resetForm();
    setShowForm(false);
  };

  const calculateNextMaintenance = (installDate) => {
    const date = new Date(installDate);
    date.setMonth(date.getMonth() + 6); // 6 months from installation
    return date.toISOString().split('T')[0];
  };

  const resetForm = () => {
    setFormData({
      name: '',
      make: '',
      model: '',
      capacity: '',
      serialNumber: '',
      installationDate: '',
      location: '',
      fuelType: 'Diesel',
      technician: '',
      generatorId: '',
      startTime: '',
      endTime: '',
      fuelConsumed: '',
      reason: '',
      operator: '',
      fuelAdded: '',
      fuelLevelBefore: '',
      fuelLevelAfter: '',
      supplier: '',
      costPerLiter: '',
      receiptNumber: '',
      outageStartTime: '',
      outageEndTime: '',
      cause: '',
      affectedAreas: '',
      backupTime: '',
      notes: ''
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const acknowledgeMaintenanceAlert = (alertId) => {
    dispatch(acknowledgeAlert({ alertId, acknowledgedBy: 'System Admin' }));
  };

  const resolveMaintenanceAlert = (alertId) => {
    dispatch(resolveAlert({ alertId, resolvedDate: new Date().toISOString().split('T')[0] }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational': return 'bg-green-100 text-green-800';
      case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderGenerators = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Generator Fleet</h3>
          <button
            onClick={() => {
              setFormType('generator');
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + Add Generator
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generators.map((gen) => (
            <div key={gen.generatorId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium text-gray-900">{gen.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(gen.status)}`}>
                  {gen.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Make/Model:</strong> {gen.make} {gen.model}</p>
                <p><strong>Capacity:</strong> {gen.capacity}</p>
                <p><strong>Run Hours:</strong> {gen.runHours}</p>
                <p><strong>Location:</strong> {gen.location}</p>
                <p><strong>Next Service:</strong> {gen.nextMaintenance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRunHours = () => {
    const displayedItems = runHourLogs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Run Hours Log</h3>
          <button
            onClick={() => {
              setFormType('runhours');
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Log Run Hours
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Run Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((log) => (
                <tr key={log.logId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {generators.find(g => g.generatorId === log.generatorId)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.startTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.runHours.toFixed(1)} hrs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.fuelConsumed} L
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {log.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFuelManagement = () => {
    const displayedItems = fuelLogs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="space-y-6">
        {/* Fuel Inventory Status */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Fuel Inventory Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{fuelInventory.currentStock} L</div>
              <div className="text-sm text-gray-600">Current Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{fuelInventory.tankCapacity} L</div>
              <div className="text-sm text-gray-600">Tank Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{fuelInventory.reorderPoint} L</div>
              <div className="text-sm text-gray-600">Reorder Point</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(fuelInventory.currentStock / fuelInventory.tankCapacity) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {((fuelInventory.currentStock / fuelInventory.tankCapacity) * 100).toFixed(1)}% full
            </div>
          </div>
        </div>

        {/* Fuel Logs */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Fuel Transaction Log</h3>
            <button
              onClick={() => {
                setFormType('fuel');
                setShowForm(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              + Add Fuel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel Added</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedItems.map((log) => (
                  <tr key={log.fuelId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {generators.find(g => g.generatorId === log.generatorId)?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.fuelAdded} L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{log.totalCost?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.supplier}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderMaintenanceAlerts = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Maintenance Alerts</h3>

        <div className="space-y-4">
          {maintenanceAlerts.map((alert) => (
            <div key={alert.alertId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{alert.alertType}</h4>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getAlertPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    alert.status === 'Active' ? 'bg-red-100 text-red-800' :
                    alert.status === 'Acknowledged' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Generator: {generators.find(g => g.generatorId === alert.generatorId)?.name}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-400">
                  Created: {alert.createdDate}
                  {alert.acknowledgedBy && ` | Acknowledged by: ${alert.acknowledgedBy}`}
                  {alert.resolvedDate && ` | Resolved: ${alert.resolvedDate}`}
                </div>
                <div className="space-x-2">
                  {alert.status === 'Active' && (
                    <button
                      onClick={() => acknowledgeMaintenanceAlert(alert.alertId)}
                      className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.status === 'Acknowledged' && (
                    <button
                      onClick={() => resolveMaintenanceAlert(alert.alertId)}
                      className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPowerOutages = () => {
    const displayedItems = powerOutages.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Power Outage Log</h3>
          <button
            onClick={() => {
              setFormType('outage');
              setShowForm(true);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            + Log Outage
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cause</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generator Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Backup Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((outage) => (
                <tr key={outage.outageId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(outage.startTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {outage.duration}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {outage.cause}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {generators.find(g => g.generatorId === outage.generatorUsed)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {outage.backupTime}
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
    <div className="generator-management p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Generator & Power Management</h2>
        <p className="text-gray-600">Generator fleet management, fuel tracking, and power outage logging</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'generators', label: 'Generators', count: generators.length },
              { id: 'runhours', label: 'Run Hours', count: runHourLogs.length },
              { id: 'fuel', label: 'Fuel Management', count: fuelLogs.length },
              { id: 'alerts', label: 'Maintenance Alerts', count: maintenanceAlerts.filter(a => a.status !== 'Resolved').length },
              { id: 'outages', label: 'Power Outages', count: powerOutages.length }
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
                  {formType === 'generator' && 'Add Generator'}
                  {formType === 'runhours' && 'Log Run Hours'}
                  {formType === 'fuel' && 'Add Fuel'}
                  {formType === 'outage' && 'Log Power Outage'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-500"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {formType === 'generator' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Generator Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Make</label>
                        <input
                          type="text"
                          name="make"
                          value={formData.make}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Model</label>
                        <input
                          type="text"
                          name="model"
                          value={formData.model}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                        <input
                          type="text"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          placeholder="e.g., 1000 kVA"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
                        <select
                          name="fuelType"
                          value={formData.fuelType}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Diesel">Diesel</option>
                          <option value="Gasoline">Gasoline</option>
                          <option value="Natural Gas">Natural Gas</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Serial Number *</label>
                      <input
                        type="text"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Installation Date</label>
                        <input
                          type="date"
                          name="installationDate"
                          value={formData.installationDate}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
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
                  </>
                )}

                {(formType === 'runhours' || formType === 'fuel' || formType === 'outage') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Generator *</label>
                    <select
                      name="generatorId"
                      value={formData.generatorId}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Generator</option>
                      {generators.map(gen => (
                        <option key={gen.generatorId} value={gen.generatorId}>
                          {gen.name} ({gen.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formType === 'runhours' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time *</label>
                        <input
                          type="datetime-local"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">End Time *</label>
                        <input
                          type="datetime-local"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fuel Consumed (L)</label>
                        <input
                          type="number"
                          name="fuelConsumed"
                          value={formData.fuelConsumed}
                          onChange={handleChange}
                          step="0.1"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Operator</label>
                        <input
                          type="text"
                          name="operator"
                          value={formData.operator}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Reason</label>
                      <input
                        type="text"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {formType === 'fuel' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fuel Added (L) *</label>
                        <input
                          type="number"
                          name="fuelAdded"
                          value={formData.fuelAdded}
                          onChange={handleChange}
                          step="0.1"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cost per Liter (₦)</label>
                        <input
                          type="number"
                          name="costPerLiter"
                          value={formData.costPerLiter}
                          onChange={handleChange}
                          step="0.01"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Fuel Level Before</label>
                        <input
                          type="number"
                          name="fuelLevelBefore"
                          value={formData.fuelLevelBefore}
                          onChange={handleChange}
                          step="0.1"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Supplier</label>
                        <input
                          type="text"
                          name="supplier"
                          value={formData.supplier}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Receipt Number</label>
                      <input
                        type="text"
                        name="receiptNumber"
                        value={formData.receiptNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {formType === 'outage' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time *</label>
                        <input
                          type="datetime-local"
                          name="outageStartTime"
                          value={formData.outageStartTime}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">End Time *</label>
                        <input
                          type="datetime-local"
                          name="outageEndTime"
                          value={formData.outageEndTime}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cause</label>
                      <input
                        type="text"
                        name="cause"
                        value={formData.cause}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Affected Areas (comma-separated)</label>
                      <input
                        type="text"
                        name="affectedAreas"
                        value={formData.affectedAreas}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Backup Time</label>
                        <input
                          type="text"
                          name="backupTime"
                          value={formData.backupTime}
                          onChange={handleChange}
                          placeholder="e.g., 5 minutes"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reported By</label>
                        <input
                          type="text"
                          name="operator"
                          value={formData.operator}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
                >
                  {formType === 'generator' && 'Add Generator'}
                  {formType === 'runhours' && 'Log Run Hours'}
                  {formType === 'fuel' && 'Add Fuel'}
                  {formType === 'outage' && 'Log Outage'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Content Panel */}
        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
          {activeTab === 'generators' && renderGenerators()}
          {activeTab === 'runhours' && renderRunHours()}
          {activeTab === 'fuel' && renderFuelManagement()}
          {activeTab === 'alerts' && renderMaintenanceAlerts()}
          {activeTab === 'outages' && renderPowerOutages()}
        </div>
      </div>
    </div>
  );
};

export default GeneratorManagement;