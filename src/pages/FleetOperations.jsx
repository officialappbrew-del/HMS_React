import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  Wrench,
  Gauge,
  Users,
  AlertCircle,
  CheckCircle,
  Plus,
  Calendar,
  DollarSign,
  Car,
  Fuel,
  User,
  FileText
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { completeMaintenance, recordFuel } from '../features/fleetSlice';

const FleetOperations = () => {
  const fleetState = useSelector(state => state.fleet) || {};
  const vehicles = fleetState.vehicles || [];
  const maintenance = fleetState.maintenanceRecords || [];
  const drivers = fleetState.drivers || [];
  const incidents = fleetState.incidents || [];
  const fuelLogs = fleetState.fuelRecords || [];
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('vehicles');
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);

  const pendingMaintenance = maintenance.filter(m => m.status === 'Pending');
  const completedMaintenance = maintenance.filter(m => m.status === 'Completed');

  const getVehicleStatus = (vehicle) => {
    if (!vehicle) return { status: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    
    const lastMaint = vehicle.lastMaintenance ? new Date(vehicle.lastMaintenance) : null;
    const nextMaint = vehicle.nextMaintenance ? new Date(vehicle.nextMaintenance) : null;
    const today = new Date();
    
    if (!nextMaint) return { status: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    
    if (nextMaint < today) return { status: 'Maintenance Due', color: 'bg-red-100 text-red-800' };
    if ((nextMaint - today) / (1000 * 60 * 60 * 24) < 7) return { status: 'Due Soon', color: 'bg-orange-100 text-orange-800' };
    return { status: 'Operational', color: 'bg-green-100 text-green-800' };
  };

  const handleScheduleMaintenance = () => {
    // Implement maintenance scheduling logic
    console.log('Scheduling maintenance');
    setShowMaintenanceModal(false);
  };

  const handleLogFuel = () => {
    // Implement fuel logging logic
    console.log('Logging fuel');
    setShowFuelModal(false);
  };

  return (
    <div className="fleet-operations p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header - Responsive */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
              <Wrench className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-nigerian-green" />
              Fleet Operations & Maintenance
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage vehicles, maintenance schedules, fuel, and incidents
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowMaintenanceModal(true)}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Schedule</span> Maintenance
            </button>
            <button
              onClick={() => setShowFuelModal(true)}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium inline-flex items-center justify-center text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Log</span> Fuel
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Gauge className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Active Vehicles</p>
              <p className="text-blue-600 font-bold text-xl sm:text-2xl">
                {vehicles.filter(v => v?.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-orange-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Pending Maintenance</p>
              <p className="text-orange-600 font-bold text-xl sm:text-2xl">{pendingMaintenance.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Total Drivers</p>
              <p className="text-green-600 font-bold text-xl sm:text-2xl">{drivers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Open Incidents</p>
              <p className="text-red-600 font-bold text-xl sm:text-2xl">
                {incidents.filter(i => i?.status !== 'Closed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Responsive with scroll on mobile */}
      <div className="mb-4 md:mb-6 overflow-x-auto">
        <div className="flex space-x-1 md:space-x-4 min-w-max border-b border-gray-200">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-3 py-2 md:px-4 md:py-3 font-medium transition-colors whitespace-nowrap text-sm md:text-base flex items-center ${
              activeTab === 'vehicles'
                ? 'text-nigerian-green border-b-2 border-nigerian-green'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Car className="w-4 h-4 mr-1 md:mr-2" />
            Vehicles <span className="hidden sm:inline ml-1">({vehicles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-3 py-2 md:px-4 md:py-3 font-medium transition-colors whitespace-nowrap text-sm md:text-base flex items-center ${
              activeTab === 'maintenance'
                ? 'text-nigerian-green border-b-2 border-nigerian-green'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Wrench className="w-4 h-4 mr-1 md:mr-2" />
            Maintenance <span className="hidden sm:inline ml-1">({maintenance.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-3 py-2 md:px-4 md:py-3 font-medium transition-colors whitespace-nowrap text-sm md:text-base flex items-center ${
              activeTab === 'drivers'
                ? 'text-nigerian-green border-b-2 border-nigerian-green'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4 mr-1 md:mr-2" />
            Drivers <span className="hidden sm:inline ml-1">({drivers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('fuel')}
            className={`px-3 py-2 md:px-4 md:py-3 font-medium transition-colors whitespace-nowrap text-sm md:text-base flex items-center ${
              activeTab === 'fuel'
                ? 'text-nigerian-green border-b-2 border-nigerian-green'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Fuel className="w-4 h-4 mr-1 md:mr-2" />
            Fuel <span className="hidden sm:inline ml-1">({fuelLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`px-3 py-2 md:px-4 md:py-3 font-medium transition-colors whitespace-nowrap text-sm md:text-base flex items-center ${
              activeTab === 'incidents'
                ? 'text-nigerian-green border-b-2 border-nigerian-green'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <AlertCircle className="w-4 h-4 mr-1 md:mr-2" />
            Incidents <span className="hidden sm:inline ml-1">({incidents.length})</span>
          </button>
        </div>
      </div>

      {/* Vehicles Tab - Responsive Grid */}
      {activeTab === 'vehicles' && (
        <div className="space-y-3 md:space-y-4">
          {vehicles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
              <Car className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No vehicles found</p>
            </div>
          ) : (
            vehicles.map(vehicle => {
              const vehicleStatus = getVehicleStatus(vehicle);
              return (
                <div key={vehicle.vehicleId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    <div>
                      <p className="text-gray-600 text-xs md:text-sm">Registration</p>
                      <p className="font-bold text-sm md:text-base">{vehicle.registrationNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs md:text-sm">Type</p>
                      <p className="font-bold text-xs md:text-sm">{vehicle.type || 'Unknown'}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-gray-600 text-xs md:text-sm">Condition</p>
                      <p className={`inline-block px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold ${vehicleStatus.color}`}>
                        {vehicleStatus.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs md:text-sm">Mileage</p>
                      <p className="font-bold text-sm md:text-base">
                        {(vehicle.mileage || 0).toLocaleString()} km
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs md:text-sm">Insurance</p>
                      <p className="font-bold text-xs md:text-sm">
                        {vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toLocaleDateString('en-NG') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs md:text-sm">Next Service</p>
                      <p className="font-bold text-xs md:text-sm">
                        {vehicle.nextMaintenance ? new Date(vehicle.nextMaintenance).toLocaleDateString('en-NG') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Maintenance Tab - Responsive Grid */}
      {activeTab === 'maintenance' && (
        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-orange-600" />
                Pending ({pendingMaintenance.length})
              </h3>
              <div className="space-y-2 md:space-y-3">
                {pendingMaintenance.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No pending maintenance</p>
                ) : (
                  pendingMaintenance.map(m => (
                    <div key={m.maintenanceId} className="bg-orange-50 border border-orange-200 rounded-lg p-3 md:p-4">
                      <p className="font-bold text-xs md:text-sm">{m.maintenanceType || 'Maintenance'}</p>
                      <p className="text-gray-600 text-xs md:text-sm mt-1">{m.description || 'No description'}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs md:text-sm">₦{(m.cost || 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-600">
                          {m.scheduledDate ? new Date(m.scheduledDate).toLocaleDateString('en-NG') : 'No date'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                Completed ({completedMaintenance.length})
              </h3>
              <div className="space-y-2 md:space-y-3">
                {completedMaintenance.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No completed maintenance</p>
                ) : (
                  completedMaintenance.map(m => (
                    <div key={m.maintenanceId} className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4">
                      <p className="font-bold text-xs md:text-sm">{m.maintenanceType || 'Maintenance'}</p>
                      <p className="text-gray-600 text-xs md:text-sm mt-1">{m.description || 'No description'}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs md:text-sm">₦{(m.cost || 0).toLocaleString()}</p>
                        <p className="text-xs text-gray-600">
                          {m.completedDate ? new Date(m.completedDate).toLocaleDateString('en-NG') : 'No date'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drivers Tab - Responsive Grid */}
      {activeTab === 'drivers' && (
        <div className="space-y-3 md:space-y-4">
          {drivers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
              <User className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No drivers found</p>
            </div>
          ) : (
            drivers.map(driver => (
              <div key={driver.driverId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Name</p>
                    <p className="font-bold text-sm md:text-base">{driver.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">License Expiry</p>
                    <p className="font-bold text-xs md:text-sm">
                      {driver.licenseExpiryDate ? new Date(driver.licenseExpiryDate).toLocaleDateString('en-NG') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Training</p>
                    <p className="font-bold text-xs md:text-sm">
                      {driver.trainingExpiryDate ? new Date(driver.trainingExpiryDate).toLocaleDateString('en-NG') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Experience</p>
                    <p className="font-bold text-sm md:text-base">{driver.yearsOfExperience || 0} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Calls Responded</p>
                    <p className="font-bold text-blue-600 text-sm md:text-base">
                      {driver.totalCallsResponded || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Phone</p>
                    <p className="font-bold text-xs md:text-sm">{driver.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Fuel Logs Tab - Responsive Grid */}
      {activeTab === 'fuel' && (
        <div className="space-y-3 md:space-y-4">
          {fuelLogs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
              <Fuel className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No fuel logs found</p>
            </div>
          ) : (
            fuelLogs.map(log => (
              <div key={log.fuelLogId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Ambulance</p>
                    <p className="font-bold text-sm md:text-base">{log.ambulanceId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Date</p>
                    <p className="font-bold text-xs md:text-sm">
                      {log.fuelDate ? new Date(log.fuelDate).toLocaleDateString('en-NG') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Liters Added</p>
                    <p className="font-bold text-blue-600 text-sm md:text-base">{log.litersAdded || 0} L</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Cost</p>
                    <p className="font-bold text-sm md:text-base">₦{(log.totalCost || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Type</p>
                    <p className="font-bold text-xs md:text-sm">{log.fuelType || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Vendor</p>
                    <p className="font-bold text-xs md:text-sm">{log.vendor || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Incidents Tab - Responsive Grid */}
      {activeTab === 'incidents' && (
        <div className="space-y-3 md:space-y-4">
          {incidents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
              <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No incidents found</p>
            </div>
          ) : (
            incidents.map(incident => (
              <div key={incident.incidentId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-red-500">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-3 md:mb-4">
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Type</p>
                    <p className="font-bold text-sm md:text-base">{incident.incidentType || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Date</p>
                    <p className="font-bold text-xs md:text-sm">
                      {incident.incidentDate ? new Date(incident.incidentDate).toLocaleDateString('en-NG') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Severity</p>
                    <p className={`inline-block px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold ${
                      incident.severity === 'High' ? 'bg-red-100 text-red-800' :
                      incident.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {incident.severity || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Status</p>
                    <p className="font-bold text-xs md:text-sm">{incident.status || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs md:text-sm">Repair Cost</p>
                    <p className="font-bold text-sm md:text-base">₦{(incident.estimatedRepairCost || 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs md:text-sm"><strong>Location:</strong> {incident.location || 'Not specified'}</p>
                  <p className="text-xs md:text-sm mt-1"><strong>Description:</strong> {incident.description || 'No description'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <GenericModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        title="Schedule Maintenance"
        size="lg"
      >
        <div className="space-y-4">
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">Select Vehicle</option>
            {vehicles.map(v => (
              <option key={v.vehicleId} value={v.vehicleId}>
                {v.registrationNumber || v.vehicleId}
              </option>
            ))}
          </select>
          <input type="text" placeholder="Maintenance Type" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <textarea placeholder="Description (optional)" rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="number" placeholder="Estimated Cost (₦)" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <div className="flex gap-2">
            <button onClick={handleScheduleMaintenance} className="flex-1 bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Save
            </button>
            <button onClick={() => setShowMaintenanceModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      <GenericModal
        isOpen={showFuelModal}
        onClose={() => setShowFuelModal(false)}
        title="Log Fuel Consumption"
        size="lg"
      >
        <div className="space-y-4">
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">Select Vehicle</option>
            {vehicles.map(v => (
              <option key={v.vehicleId} value={v.vehicleId}>
                {v.registrationNumber || v.vehicleId}
              </option>
            ))}
          </select>
          <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="number" placeholder="Liters Added" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="number" placeholder="Cost (₦)" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="text" placeholder="Vendor (optional)" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">Select Fuel Type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleLogFuel} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Save
            </button>
            <button onClick={() => setShowFuelModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default FleetOperations;