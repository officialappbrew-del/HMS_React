import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  updateAmbulanceLocation,
  dispatchAmbulance,
  updateMissionStatus,
  completeMission
} from '../features/ambulanceSlice';
import { createAdmissionRequest } from '../features/admissionSlice';
import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";
import { MapPin, Clock, Users, TrendingUp, AlertCircle, Navigation, Car, Plus, Menu, X, Filter, Search } from 'lucide-react';

const AmbulanceTracking = () => {
  const dispatch = useDispatch();
  
  // Add safe defaults for all Redux state values
  const ambulanceState = useSelector(state => state.ambulance || {});
  const patientState = useSelector(state => state.patient || {});
  
  const ambulances = ambulanceState.ambulances || [];
  const activeMissions = ambulanceState.activeMissions || [];
  const missionHistory = ambulanceState.missionHistory || [];
  const gpsTracking = ambulanceState.gpsTracking || {};
  const utilizationAnalytics = ambulanceState.utilizationAnalytics || {
    monthlyStats: [],
    responseTime: 0,
    utilizationRate: 0
  };
  
  const patients = patientState.patients || [];

  const [activeTab, setActiveTab] = useState('tracking');
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const [dispatchData, setDispatchData] = useState({
    ambulanceId: '',
    patientId: '',
    incidentType: '',
    priority: 'Medium',
    location: '',
    notes: ''
  });

  // Filter missions based on search query
  const filteredActiveMissions = activeMissions.filter(mission => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      mission.missionId?.toLowerCase().includes(query) ||
      mission.patientInfo?.name?.toLowerCase().includes(query) ||
      mission.incidentType?.toLowerCase().includes(query) ||
      mission.priority?.toLowerCase().includes(query)
    );
  });

  const filteredMissionHistory = missionHistory.filter(mission => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      mission.missionId?.toLowerCase().includes(query) ||
      mission.patientInfo?.name?.toLowerCase().includes(query) ||
      mission.outcome?.toLowerCase().includes(query)
    );
  });

  // Simulate GPS updates
  useEffect(() => {
    const interval = setInterval(() => {
      ambulances.forEach(ambulance => {
        if (ambulance?.status === 'En Route' || ambulance?.status === 'Returning') {
          // Simulate movement
          const location = ambulance.location || { lat: 6.5244, lng: 3.3792 };
          const newLat = location.lat + (Math.random() - 0.5) * 0.001;
          const newLng = location.lng + (Math.random() - 0.5) * 0.001;
          const speed = Math.floor(Math.random() * 60) + 20; // 20-80 km/h

          dispatch(updateAmbulanceLocation({
            ambulanceId: ambulance.ambulanceId,
            location: { lat: newLat, lng: newLng },
            speed
          }));
        }
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [ambulances, dispatch]);

  const handleDispatch = (e) => {
    e.preventDefault();

    if (!dispatchData.ambulanceId || !dispatchData.patientId) {
      alert('Ambulance and patient are required');
      return;
    }

    const patient = patients.find(p => p.patientId === dispatchData.patientId);
    const ambulance = ambulances.find(a => a.ambulanceId === dispatchData.ambulanceId);

    const missionData = {
      missionId: `MISS${Date.now()}`,
      incidentType: dispatchData.incidentType || 'Medical Emergency',
      priority: dispatchData.priority || 'Medium',
      patientInfo: {
        name: patient?.name || 'Unknown',
        age: patient?.age || 0,
        condition: 'Emergency transport required'
      },
      pickupLocation: {
        address: dispatchData.location || 'Unknown location',
        coordinates: ambulance?.location || { lat: 6.5244, lng: 3.3792 }
      },
      destination: {
        name: 'General Hospital',
        address: 'Hospital Road, Lagos',
        coordinates: { lat: 6.5244, lng: 3.3792 }
      },
      crew: [
        { name: 'Paramedic', role: 'Medical Officer' },
        { name: 'Driver', role: 'Driver' }
      ],
      notes: dispatchData.notes || '',
      dispatchedAt: new Date().toISOString(),
      status: 'Dispatched'
    };

    dispatch(dispatchAmbulance({
      ambulanceId: dispatchData.ambulanceId,
      missionData
    }));

    if (patient?.patientId || dispatchData.patientId) {
      dispatch(createAdmissionRequest({
        patientId: patient?.patientId || dispatchData.patientId,
        patientName: patient?.name || 'Unknown',
        source: 'Emergency Department',
        diagnosis: dispatchData.incidentType || 'Emergency transport',
        preferredWardType: 'General Ward',
        priority: dispatchData.priority || 'Medium',
        notes: `Auto-created from ambulance mission ${missionData.missionId}`
      }));
    }

    setShowDispatchForm(false);
    resetDispatchForm();
  };

  const resetDispatchForm = () => {
    setDispatchData({
      ambulanceId: '',
      patientId: '',
      incidentType: '',
      priority: 'Medium',
      location: '',
      notes: ''
    });
  };

  const handleStatusUpdate = (missionId, status) => {
    dispatch(updateMissionStatus({
      missionId,
      status,
      timestamp: new Date().toISOString(),
      notes: `Status updated to ${status}`
    }));
  };

  const handleCompleteMission = (missionId) => {
    dispatch(completeMission({
      missionId,
      outcome: 'Patient transported successfully',
      completedAt: new Date().toISOString()
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'En Route': return 'bg-blue-100 text-blue-800';
      case 'On Scene': return 'bg-yellow-100 text-yellow-800';
      case 'Transporting': return 'bg-purple-100 text-purple-800';
      case 'Out of Service': return 'bg-red-100 text-red-800';
      case 'Dispatched': return 'bg-indigo-100 text-indigo-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTrackingMap = () => (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
        <h3 className="text-lg md:text-xl font-semibold flex items-center">
          <Navigation className="w-5 h-5 md:w-6 md:h-6 mr-2 text-blue-600" />
          Real-time Ambulance Tracking
        </h3>
        <div className="flex flex-wrap gap-2 md:gap-4">
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs md:text-sm">Available</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs md:text-sm">En Route</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-xs md:text-sm">On Scene</span>
          </div>
        </div>
      </div>

      {/* Simplified map representation */}
      <div className="bg-gray-100 rounded-lg h-64 md:h-80 lg:h-96 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl md:text-6xl mb-2 md:mb-4">🗺️</div>
            <p className="text-gray-600 text-sm md:text-base">Interactive Map View</p>
            <p className="text-xs md:text-sm text-gray-500">GPS coordinates and real-time tracking</p>
          </div>
        </div>

        {/* Ambulance markers */}
        {ambulances.map((ambulance) => {
          const location = ambulance.location || { lat: 6.5244, lng: 3.3792 };
          return (
            <div
              key={ambulance.ambulanceId}
              className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                ambulance.status === 'Available' ? 'bg-green-500' :
                ambulance.status === 'En Route' ? 'bg-blue-500' :
                ambulance.status === 'On Scene' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{
                left: `${((location.lng - 3.3) / 0.2) * 100}%`,
                top: `${((6.6 - location.lat) / 0.2) * 100}%`
              }}
              onClick={() => setSelectedAmbulance(ambulance)}
              title={`${ambulance.vehicleNumber || 'Unknown'} - ${ambulance.status || 'Unknown'}`}
            />
          );
        })}
      </div>

      {/* Ambulance details */}
      {selectedAmbulance && (
        <div className="mt-4 p-3 md:p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900 text-sm md:text-base">
              {selectedAmbulance.vehicleNumber || 'Unknown Ambulance'}
            </h4>
            <button
              onClick={() => setSelectedAmbulance(null)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Status</p>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedAmbulance.status)}`}>
                {selectedAmbulance.status || 'Unknown'}
              </span>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Location</p>
              <p className="text-xs md:text-sm font-medium truncate">
                {selectedAmbulance.location 
                  ? `${selectedAmbulance.location.lat?.toFixed(4) || '0.0000'}, ${selectedAmbulance.location.lng?.toFixed(4) || '0.0000'}`
                  : 'Unknown'
                }
              </p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Fuel</p>
              <p className="text-xs md:text-sm font-medium">{selectedAmbulance.fuelLevel || 0}%</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Mileage</p>
              <p className="text-xs md:text-sm font-medium">{(selectedAmbulance.mileage || 0).toLocaleString()} km</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderActiveMissions = () => (
    <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
        <div>
          <h3 className="text-lg md:text-xl font-semibold flex items-center">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 mr-2 text-red-600" />
            Active Missions
          </h3>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            {filteredActiveMissions.length} active mission{filteredActiveMissions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowDispatchForm(true)}
          className="bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-md hover:bg-red-700 font-medium text-sm md:text-base inline-flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-1 md:mr-2" />
          <span>Dispatch</span>
        </button>
      </div>

      {/* Search Bar for Missions - Mobile */}
      <div className="md:hidden mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search missions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredActiveMissions.length === 0 ? (
        <div className="text-center py-6 md:py-8 text-gray-500">
          <Car className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-sm md:text-base">
            {searchQuery ? 'No missions match your search' : 'No active missions'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 text-sm hover:text-blue-800"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {filteredActiveMissions.map((mission) => (
            <div key={mission.missionId} className="border border-gray-200 rounded-lg p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 gap-2">
                <div>
                  <h4 className="text-base md:text-lg font-medium text-gray-900">
                    Mission {mission.missionId || 'Unknown'}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    {mission.patientInfo?.name || 'Unknown Patient'} • {mission.incidentType || 'Medical Emergency'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(mission.priority)}`}>
                    {mission.priority || 'Medium'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(mission.status)}`}>
                    {mission.status || 'Dispatched'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Ambulance</p>
                  <p className="font-medium text-sm md:text-base">
                    {ambulances.find(a => a.ambulanceId === mission.ambulance)?.vehicleNumber || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Dispatched</p>
                  <p className="font-medium text-sm md:text-base">
                    {mission.dispatchedAt ? new Date(mission.dispatchedAt).toLocaleString() : 'Unknown'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div className="text-xs md:text-sm text-gray-600">
                  <div className="flex items-start">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">From:</div>
                      <div className="truncate max-w-[200px] md:max-w-none">{mission.pickupLocation?.address || 'Unknown'}</div>
                      <div className="font-medium mt-1">To:</div>
                      <div className="truncate max-w-[200px] md:max-w-none">{mission.destination?.name || 'General Hospital'}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 md:gap-2">
                  {mission.status === 'En Route' && (
                    <button
                      onClick={() => handleStatusUpdate(mission.missionId, 'On Scene')}
                      className="px-2 py-1 md:px-3 md:py-1 bg-yellow-600 text-white text-xs md:text-sm rounded hover:bg-yellow-700"
                    >
                      Arrived
                    </button>
                  )}
                  {mission.status === 'On Scene' && (
                    <button
                      onClick={() => handleStatusUpdate(mission.missionId, 'Transporting')}
                      className="px-2 py-1 md:px-3 md:py-1 bg-purple-600 text-white text-xs md:text-sm rounded hover:bg-purple-700"
                    >
                      Transport
                    </button>
                  )}
                  <button
                    onClick={() => handleCompleteMission(mission.missionId)}
                    className="px-2 py-1 md:px-3 md:py-1 bg-green-600 text-white text-xs md:text-sm rounded hover:bg-green-700"
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMissionHistory = () => {
    const displayedItems = filteredMissionHistory.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
          <div>
            <h3 className="text-lg md:text-xl font-semibold flex items-center">
              <Clock className="w-5 h-5 md:w-6 md:h-6 mr-2 text-gray-600" />
              Mission History
            </h3>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              {filteredMissionHistory.length} total missions
            </p>
          </div>
          
          {/* Search Bar for History - Mobile */}
          <div className="md:hidden w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search history..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Search Bar for History - Desktop */}
        <div className="hidden md:block mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search mission history..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {displayedItems.length === 0 ? (
          <div className="text-center py-6 md:py-8 text-gray-500">
            <Clock className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-sm md:text-base">
              {searchQuery ? 'No missions match your search' : 'No mission history'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-blue-600 text-sm hover:text-blue-800"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="min-w-full">
                {/* Desktop Table */}
                <div className="hidden md:table w-full">
                  <div className="table-row border-b">
                    <div className="table-cell py-3 px-4 font-semibold text-gray-700 text-sm">Mission ID</div>
                    <div className="table-cell py-3 px-4 font-semibold text-gray-700 text-sm">Patient</div>
                    <div className="table-cell py-3 px-4 font-semibold text-gray-700 text-sm">Ambulance</div>
                    <div className="table-cell py-3 px-4 font-semibold text-gray-700 text-sm">Response Time</div>
                    <div className="table-cell py-3 px-4 font-semibold text-gray-700 text-sm">Status</div>
                    <div className="table-cell py-3 px-4 font-semibold text-gray-700 text-sm">Outcome</div>
                  </div>
                  {displayedItems.map((mission) => (
                    <div key={mission.missionId} className="table-row border-b hover:bg-gray-50">
                      <div className="table-cell py-3 px-4 font-medium text-sm">{mission.missionId || 'Unknown'}</div>
                      <div className="table-cell py-3 px-4 text-sm">{mission.patientInfo?.name || 'Unknown'}</div>
                      <div className="table-cell py-3 px-4 text-sm">
                        {ambulances.find(a => a.ambulanceId === mission.ambulance)?.vehicleNumber || 'Unknown'}
                      </div>
                      <div className="table-cell py-3 px-4 text-sm">{mission.responseTime || 'N/A'} min</div>
                      <div className="table-cell py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor('Completed')}`}>
                          Completed
                        </span>
                      </div>
                      <div className="table-cell py-3 px-4 text-sm truncate max-w-xs">{mission.outcome || 'Unknown'}</div>
                    </div>
                  ))}
                </div>
                
                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {displayedItems.map((mission) => (
                    <div key={mission.missionId} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">{mission.missionId || 'Unknown Mission'}</p>
                          <p className="text-xs text-gray-600">{mission.patientInfo?.name || 'Unknown Patient'}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor('Completed')}`}>
                          Completed
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-600">Ambulance</p>
                          <p className="font-medium">
                            {ambulances.find(a => a.ambulanceId === mission.ambulance)?.vehicleNumber || 'Unknown'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Response Time</p>
                          <p className="font-medium">{mission.responseTime || 'N/A'} min</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-gray-600">Outcome</p>
                          <p className="font-medium truncate">{mission.outcome || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {filteredMissionHistory.length > itemsPerPage && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(filteredMissionHistory.length / itemsPerPage)}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
      <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs md:text-sm font-medium">Total Missions</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {utilizationAnalytics.monthlyStats?.[3]?.totalMissions || 0}
            </p>
            <p className="text-xs md:text-sm text-gray-600">This month</p>
          </div>
          <div className="p-2 md:p-3 bg-blue-100 rounded-full">
            <Car className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs md:text-sm font-medium">Avg Response Time</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              {utilizationAnalytics.responseTime || 0}min
            </p>
            <p className="text-xs md:text-sm text-gray-600">Target: 10min</p>
          </div>
          <div className="p-2 md:p-3 bg-green-100 rounded-full">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs md:text-sm font-medium">Utilization Rate</p>
            <p className="text-2xl md:text-3xl font-bold text-orange-600">
              {utilizationAnalytics.utilizationRate || 0}%
            </p>
            <p className="text-xs md:text-sm text-gray-600">Fleet utilization</p>
          </div>
          <div className="p-2 md:p-3 bg-orange-100 rounded-full">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-sm md:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs md:text-sm font-medium">Available</p>
            <p className="text-2xl md:text-3xl font-bold text-red-600">
              {ambulances.filter(a => a.status === 'Available').length}
            </p>
            <p className="text-xs md:text-sm text-gray-600">Out of {ambulances.length}</p>
          </div>
          <div className="p-2 md:p-3 bg-red-100 rounded-full">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="ambulance-tracking p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-lg bg-white shadow-md"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="text-lg font-bold text-gray-800">Ambulance Tracking</div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Ambulance Tracking & Monitoring</h2>
        <p className="text-gray-600 text-sm md:text-base">Real-time GPS tracking, status monitoring, and response coordination</p>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Sections</h2>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { id: 'tracking', label: 'Live Tracking', count: ambulances.filter(a => a.status !== 'Out of Service').length },
                { id: 'missions', label: 'Active Missions', count: activeMissions.length },
                { id: 'history', label: 'Mission History', count: missionHistory.length },
                { id: 'analytics', label: 'Analytics', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setShowMobileMenu(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {tab.label} {tab.count !== null && `(${tab.count})`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="hidden md:block mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-2 lg:space-x-8">
            {[
              { id: 'tracking', label: 'Live Tracking', count: ambulances.filter(a => a.status !== 'Out of Service').length },
              { id: 'missions', label: 'Active Missions', count: activeMissions.length },
              { id: 'history', label: 'Mission History', count: missionHistory.length },
              { id: 'analytics', label: 'Analytics', count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 md:px-1 lg:px-1 border-b-2 font-medium text-sm md:text-base ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} {tab.count !== null && `(${tab.count})`}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Tab Indicator */}
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
          <span className="font-medium text-gray-700">
            {activeTab === 'tracking' && 'Live Tracking'}
            {activeTab === 'missions' && `Active Missions (${activeMissions.length})`}
            {activeTab === 'history' && `Mission History (${missionHistory.length})`}
            {activeTab === 'analytics' && 'Analytics'}
          </span>
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="p-1 rounded-md bg-gray-100"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {activeTab === 'tracking' && renderTrackingMap()}
        {activeTab === 'missions' && renderActiveMissions()}
        {activeTab === 'history' && renderMissionHistory()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>

      {/* Dispatch Form Modal */}
      {showDispatchForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-xl max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-semibold">Dispatch Ambulance</h3>
              <button
                onClick={() => setShowDispatchForm(false)}
                className="text-gray-500 hover:text-gray-700 text-lg md:text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDispatch} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Available Ambulance *</label>
                <select
                  value={dispatchData.ambulanceId}
                  onChange={(e) => setDispatchData({...dispatchData, ambulanceId: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  required
                >
                  <option value="">Select Ambulance</option>
                  {ambulances.filter(a => a.status === 'Available').map(ambulance => (
                    <option key={ambulance.ambulanceId} value={ambulance.ambulanceId}>
                      {ambulance.vehicleNumber || 'Unknown'} ({ambulance.type || 'Type'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Patient *</label>
                <select
                  value={dispatchData.patientId}
                  onChange={(e) => setDispatchData({...dispatchData, patientId: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.patientId} value={patient.patientId}>
                      {patient.name || 'Unknown'} (ID: {patient.patientId || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Incident Type</label>
                  <select
                    value={dispatchData.incidentType}
                    onChange={(e) => setDispatchData({...dispatchData, incidentType: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  >
                    <option value="">Select Type</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Trauma">Trauma</option>
                    <option value="Cardiac">Cardiac</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={dispatchData.priority}
                    onChange={(e) => setDispatchData({...dispatchData, priority: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                <input
                  type="text"
                  value={dispatchData.location}
                  onChange={(e) => setDispatchData({...dispatchData, location: e.target.value})}
                  placeholder="Address or landmark"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={dispatchData.notes}
                  onChange={(e) => setDispatchData({...dispatchData, notes: e.target.value})}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 font-medium text-sm md:text-base"
              >
                Dispatch Ambulance
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbulanceTracking;