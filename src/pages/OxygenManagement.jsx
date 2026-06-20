import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  addOxygenConcentrator,
  updateOxygenConcentrator,
  addOxygenCylinder,
  updateOxygenCylinder,
  updateCylinderStatus,
  updatePipelineStatus,
  logUsage,
  addAlert,
  acknowledgeAlert
} from '../features/oxygenSlice';

import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

const OxygenManagement = () => {
  const dispatch = useDispatch();
  const {
    oxygenConcentrators,
    oxygenCylinders,
    gasPipelines,
    usageAnalytics,
    suppliers
  } = useSelector(state => state.oxygen);

  const [activeTab, setActiveTab] = useState('concentrators');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('concentrator'); // 'concentrator', 'cylinder', 'usage'
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    // For concentrators
    name: '',
    make: '',
    model: '',
    serialNumber: '',
    capacity: '',
    location: '',
    assignedTo: '',

    // For cylinders
    cylinderSerialNumber: '',
    size: '10L',
    cylinderLocation: '',
    pressure: '',
    supplier: '',
    expiryDate: '',

    // For usage logging
    ward: '',
    consumption: '',
    cost: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formType === 'concentrator') {
      if (!formData.name || !formData.serialNumber) {
        alert('Concentrator name and serial number are required');
        return;
      }

      const newConcentrator = {
        concentratorId: `OXY${Date.now()}`,
        name: formData.name,
        make: formData.make,
        model: formData.model,
        serialNumber: formData.serialNumber,
        capacity: formData.capacity,
        location: formData.location,
        assignedTo: formData.assignedTo,
        installationDate: new Date().toISOString().split('T')[0],
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months
        status: 'Operational',
        runHours: 0,
        filterChangeDate: new Date().toISOString().split('T')[0],
        notes: formData.notes
      };

      dispatch(addOxygenConcentrator(newConcentrator));

    } else if (formType === 'cylinder') {
      if (!formData.cylinderSerialNumber) {
        alert('Cylinder serial number is required');
        return;
      }

      const newCylinder = {
        cylinderId: `CYL${Date.now()}`,
        serialNumber: formData.cylinderSerialNumber,
        size: formData.size,
        location: formData.cylinderLocation,
        status: 'Full',
        pressure: parseFloat(formData.pressure) || 2000,
        lastFilled: new Date().toISOString().split('T')[0],
        expiryDate: formData.expiryDate,
        supplier: formData.supplier,
        assignedTo: null,
        lastUsed: null,
        notes: formData.notes
      };

      dispatch(addOxygenCylinder(newCylinder));

    } else if (formType === 'usage') {
      if (!formData.ward || !formData.consumption) {
        alert('Ward and consumption are required');
        return;
      }

      dispatch(logUsage({
        ward: formData.ward,
        consumption: parseFloat(formData.consumption),
        cost: parseFloat(formData.cost) || 0
      }));
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      make: '',
      model: '',
      serialNumber: '',
      capacity: '',
      location: '',
      assignedTo: '',
      cylinderSerialNumber: '',
      size: '10L',
      cylinderLocation: '',
      pressure: '',
      supplier: '',
      expiryDate: '',
      ward: '',
      consumption: '',
      cost: '',
      notes: ''
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateCylinderAssignment = (cylinderId, assignedTo, status) => {
    dispatch(updateCylinderStatus({
      cylinderId,
      status,
      assignedTo,
      lastUsed: new Date().toISOString().split('T')[0]
    }));
  };

  const acknowledgeUsageAlert = (alertId) => {
    dispatch(acknowledgeAlert({ alertId }));
  };

  const getCylinderStatusColor = (status) => {
    switch (status) {
      case 'Full': return 'bg-green-100 text-green-800';
      case 'In Use': return 'bg-blue-100 text-blue-800';
      case 'Empty': return 'bg-red-100 text-red-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPipelineStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Warning': return 'bg-yellow-100 text-yellow-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderConcentrators = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Oxygen Concentrators</h3>
          <button
            onClick={() => {
              setFormType('concentrator');
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Add Concentrator
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {oxygenConcentrators.map((conc) => (
            <div key={conc.concentratorId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium text-gray-900">{conc.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  conc.status === 'Operational' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {conc.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Make/Model:</strong> {conc.make} {conc.model}</p>
                <p><strong>Capacity:</strong> {conc.capacity}</p>
                <p><strong>Location:</strong> {conc.location}</p>
                <p><strong>Run Hours:</strong> {conc.runHours}</p>
                <p><strong>Next Service:</strong> {conc.nextMaintenance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCylinders = () => {
    const displayedItems = oxygenCylinders.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Oxygen Cylinders</h3>
          <button
            onClick={() => {
              setFormType('cylinder');
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + Add Cylinder
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pressure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((cylinder) => (
                <tr key={cylinder.cylinderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cylinder.serialNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cylinder.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cylinder.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={cylinder.status}
                      onChange={(e) => updateCylinderAssignment(cylinder.cylinderId, cylinder.assignedTo, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full ${getCylinderStatusColor(cylinder.status)}`}
                    >
                      <option value="Full">Full</option>
                      <option value="In Use">In Use</option>
                      <option value="Empty">Empty</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cylinder.pressure} psi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cylinder.expiryDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => updateCylinderAssignment(cylinder.cylinderId, 'ED Bed 5', 'In Use')}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => updateCylinderAssignment(cylinder.cylinderId, null, 'Empty')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Mark Empty
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPipelines = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Medical Gas Pipeline Monitoring</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gasPipelines.map((pipeline) => (
            <div key={pipeline.pipelineId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{pipeline.gasType} - {pipeline.zone}</h4>
                  <p className="text-sm text-gray-600">{pipeline.location}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getPipelineStatusColor(pipeline.status)}`}>
                  {pipeline.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <div className="text-sm text-gray-500">Pressure</div>
                  <div className="text-lg font-semibold text-gray-900">{pipeline.pressure} psi</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Flow Rate</div>
                  <div className="text-lg font-semibold text-gray-900">{pipeline.flowRate} L/min</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Last Inspection: {pipeline.lastInspection} | Next: {pipeline.nextInspection}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUsageAnalytics = () => {
    return (
      <div className="space-y-6">
        {/* Ward Usage Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Ward Usage Analytics</h3>
            <button
              onClick={() => {
                setFormType('usage');
                setShowForm(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              + Log Usage
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {usageAnalytics.wardUsage.map((ward) => (
              <div key={ward.ward} className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">{ward.ward}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Avg:</span>
                    <span className="font-medium">{ward.dailyAverage} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly:</span>
                    <span className="font-medium">{ward.monthlyConsumption} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium">₦{ward.costPerMonth?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patients:</span>
                    <span className="font-medium">{ward.patientsOnOxygen}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">System Alerts</h3>

          <div className="space-y-4">
            {usageAnalytics.alerts.filter(alert => !alert.acknowledged).map((alert) => (
              <div key={alert.alertId} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-orange-900">{alert.type}</h4>
                    <p className="text-orange-800 mt-1">{alert.message}</p>
                    <div className="text-sm text-orange-600 mt-2">
                      {alert.ward} • {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => acknowledgeUsageAlert(alert.alertId)}
                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>

          {usageAnalytics.alerts.filter(alert => !alert.acknowledged).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No active alerts
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="oxygen-management p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Oxygen & Gas Monitoring</h2>
        <p className="text-gray-600">Oxygen concentrators, cylinder inventory, and medical gas pipeline monitoring</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'concentrators', label: 'Concentrators', count: oxygenConcentrators.length },
              { id: 'cylinders', label: 'Cylinders', count: oxygenCylinders.length },
              { id: 'pipelines', label: 'Gas Pipelines', count: gasPipelines.length },
              { id: 'analytics', label: 'Usage Analytics', count: usageAnalytics.alerts.filter(a => !a.acknowledged).length }
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
                  {formType === 'concentrator' && 'Add Oxygen Concentrator'}
                  {formType === 'cylinder' && 'Add Oxygen Cylinder'}
                  {formType === 'usage' && 'Log Oxygen Usage'}
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
                {formType === 'concentrator' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Concentrator Name *</label>
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
                          placeholder="e.g., 10 L/min"
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                      <input
                        type="text"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {formType === 'cylinder' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Serial Number *</label>
                      <input
                        type="text"
                        name="cylinderSerialNumber"
                        value={formData.cylinderSerialNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Size</label>
                        <select
                          name="size"
                          value={formData.size}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="5L">5L</option>
                          <option value="10L">10L</option>
                          <option value="40L">40L</option>
                          <option value="50L">50L</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Pressure (psi)</label>
                        <input
                          type="number"
                          name="pressure"
                          value={formData.pressure}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                          type="text"
                          name="cylinderLocation"
                          value={formData.cylinderLocation}
                          onChange={handleChange}
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
                      <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {formType === 'usage' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ward *</label>
                      <select
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Ward</option>
                        {usageAnalytics.wardUsage.map(ward => (
                          <option key={ward.ward} value={ward.ward}>{ward.ward}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Consumption (L) *</label>
                        <input
                          type="number"
                          name="consumption"
                          value={formData.consumption}
                          onChange={handleChange}
                          step="0.1"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cost (₦)</label>
                        <input
                          type="number"
                          name="cost"
                          value={formData.cost}
                          onChange={handleChange}
                          step="0.01"
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
                  {formType === 'concentrator' && 'Add Concentrator'}
                  {formType === 'cylinder' && 'Add Cylinder'}
                  {formType === 'usage' && 'Log Usage'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Content Panel */}
        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
          {activeTab === 'concentrators' && renderConcentrators()}
          {activeTab === 'cylinders' && renderCylinders()}
          {activeTab === 'pipelines' && renderPipelines()}
          {activeTab === 'analytics' && renderUsageAnalytics()}
        </div>
      </div>
    </div>
  );
};

export default OxygenManagement;