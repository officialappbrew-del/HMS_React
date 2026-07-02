import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  AlertCircle,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Plus,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Search,
  Filter
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { reportIncident, updateIncident, dispatchResponse } from '../features/emergencyResponseSlice';
import { emergencyApi } from '../utils/api';

const EmergencyResponse = () => {
  // Add safe defaults for all Redux state values
  const emergencyResponse = useSelector(state => state.emergencyResponse || {});
  const ambulanceState = useSelector(state => state.ambulance || {});
  
  const emergencyCalls = emergencyResponse.emergencyCalls || [];
  const dispatchOptimizations = emergencyResponse.dispatchOptimizations || [];
  const hospitalPreNotifications = emergencyResponse.hospitalPreNotifications || [];
  const communications = emergencyResponse.communications || [];
  const ambulances = ambulanceState.ambulances || [];
  
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('active');
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    callerName: '',
    callerPhone: '',
    severity: 'Medium',
    incidentDescription: '',
    patientName: '',
    ambulanceId: ''
  });
  const [statusForm, setStatusForm] = useState('Received');

  // Safely filter calls
  const activeCalls = emergencyCalls.filter(c => c && c.status && c.status !== 'Completed' && c.status !== 'Cancelled');
  const completedCalls = emergencyCalls.filter(c => c && c.status && (c.status === 'Completed' || c.status === 'Cancelled'));

  // Filter calls based on search query
  const getFilteredCalls = (calls) => {
    if (!searchQuery) return calls;
    
    return calls.filter(call => 
      (call.callId && call.callId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (call.callerName && call.callerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (call.patientDetails?.name && call.patientDetails.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (call.severity && call.severity.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredActiveCalls = getFilteredCalls(activeCalls);
  const filteredCompletedCalls = getFilteredCalls(completedCalls);
  const filteredCommunications = searchQuery 
    ? communications.filter(comm =>
        (comm.communicationType && comm.communicationType.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (comm.message && comm.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (comm.sender && comm.sender.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : communications;

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Received': return 'bg-blue-100 text-blue-800';
      case 'Dispatched': return 'bg-purple-100 text-purple-800';
      case 'En Route': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const loadCalls = async () => {
      try {
        const calls = await emergencyApi.getCalls();
        const normalized = Array.isArray(calls) ? calls : calls.results || [];
        normalized.forEach((call) => dispatch(reportIncident({
          callId: call.callId || call.id,
          callerName: call.callerName,
          callerPhone: call.callerPhone,
          severity: call.severity,
          status: call.status,
          incidentLocation: call.incidentLocation || {},
          patientDetails: call.patientDetails || { name: call.patientName },
          incidentType: call.incidentType,
          responseTime: call.responseTime || 0,
          dispatchedAmbulance: call.dispatchedAmbulance,
          callTime: call.created_at,
          notes: call.notes,
          communications: call.communications || []
        })));
      } catch (error) {
        console.error('Failed to load emergency calls', error);
      }
    };

    if (!emergencyCalls.length) {
      loadCalls();
    }
  }, [dispatch, emergencyCalls.length]);

  const handleCreateCall = async () => {
    try {
      const payload = {
        callerName: formData.callerName,
        callerPhone: formData.callerPhone,
        severity: formData.severity,
        incidentDescription: formData.incidentDescription,
        patientName: formData.patientName,
        incidentType: formData.incidentDescription || 'Medical Emergency',
        incidentLocation: { address: 'On-site incident', coordinates: { lat: 6.5244, lng: 3.3792 } },
        patientDetails: { name: formData.patientName || 'Unknown' },
        status: 'Received',
        dispatchedAmbulance: formData.ambulanceId || ''
      };
      const created = await emergencyApi.createCall(payload);
      dispatch(reportIncident({
        callId: created.callId || created.id,
        callerName: created.callerName,
        callerPhone: created.callerPhone,
        severity: created.severity,
        status: created.status,
        incidentLocation: created.incidentLocation || {},
        patientDetails: created.patientDetails || { name: created.patientName },
        incidentType: created.incidentType,
        responseTime: created.responseTime || 0,
        dispatchedAmbulance: created.dispatchedAmbulance,
        callTime: created.created_at,
        notes: created.notes,
        communications: created.communications || []
      }));
      setShowCallModal(false);
      setFormData({ callerName: '', callerPhone: '', severity: 'Medium', incidentDescription: '', patientName: '', ambulanceId: '' });
    } catch (error) {
      alert(error.message || 'Unable to create emergency call');
    }
  };

  const handleUpdateCall = async () => {
    if (!selectedCall) return;
    try {
      const updated = await emergencyApi.updateCallStatus(selectedCall.callId || selectedCall.id, { status: statusForm, responseTime: selectedCall.responseTime || 0 });
      dispatch(updateIncident({
        incidentId: selectedCall.callId || selectedCall.id,
        status: updated.status,
        responseTime: updated.responseTime || selectedCall.responseTime || 0,
        dispatchedAmbulance: updated.dispatchedAmbulance || selectedCall.dispatchedAmbulance
      }));
      setSelectedCall(null);
    } catch (error) {
      alert(error.message || 'Unable to update call');
    }
  };

  const callsToday = emergencyCalls.filter(c => {
    if (!c || !c.callTime) return false;
    const callDate = new Date(c.callTime).toLocaleDateString();
    return callDate === new Date().toLocaleDateString();
  }).length;

  const criticalCases = emergencyCalls.filter(c => c && c.severity === 'Critical').length;
  const averageResponseTime = activeCalls.length > 0
    ? Math.round(activeCalls.reduce((sum, c) => sum + (c.responseTime || 0), 0) / activeCalls.length)
    : 0;

  return (
    <div className="emergency-response p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-lg bg-white shadow-md"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="text-lg font-bold text-gray-800">Emergency Response</div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <AlertCircle className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-red-600" />
            Emergency Response Management
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Monitor emergency calls, dispatch ambulances, and coordinate response</p>
        </div>
        
        {/* Search Bar - Mobile Top */}
        <div className="md:hidden w-full mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Responsive Action Button */}
        <button
          onClick={() => setShowCallModal(true)}
          className="w-full md:w-auto px-4 py-2.5 md:px-6 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium inline-flex items-center justify-center text-sm md:text-base transition-colors duration-200"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
          <span className="truncate">
            <span className="hidden sm:inline">New Emergency Call</span>
            <span className="sm:hidden">New Call</span>
          </span>
        </button>
      </div>

      {/* Search Bar - Desktop */}
      <div className="hidden md:block mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search in ${activeTab}...`}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-red-600">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-red-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Active Calls</p>
              <p className="text-red-600 font-bold text-lg md:text-xl lg:text-2xl">{activeCalls.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Clock className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Avg Response</p>
              <p className="text-blue-600 font-bold text-lg md:text-xl lg:text-2xl">
                {averageResponseTime}m
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-green-600">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-green-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Calls Today</p>
              <p className="text-green-600 font-bold text-lg md:text-xl lg:text-2xl">{callsToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-purple-600">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-purple-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Critical Cases</p>
              <p className="text-purple-600 font-bold text-lg md:text-xl lg:text-2xl">{criticalCases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-orange-600 col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="flex items-center">
            <Phone className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-orange-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Hospitals Notified</p>
              <p className="text-orange-600 font-bold text-lg md:text-xl lg:text-2xl">{hospitalPreNotifications.length}</p>
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
                onClick={() => { setActiveTab('active'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'active' ? 'bg-red-100 text-red-600' : 'text-gray-700'
                }`}
              >
                Active Calls ({activeCalls.length})
              </button>
              <button
                onClick={() => { setActiveTab('history'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'history' ? 'bg-red-100 text-red-600' : 'text-gray-700'
                }`}
              >
                Call History ({completedCalls.length})
              </button>
              <button
                onClick={() => { setActiveTab('dispatch'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'dispatch' ? 'bg-red-100 text-red-600' : 'text-gray-700'
                }`}
              >
                Dispatch Optimization ({dispatchOptimizations.length})
              </button>
              <button
                onClick={() => { setActiveTab('communication'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'communication' ? 'bg-red-100 text-red-600' : 'text-gray-700'
                }`}
              >
                Communications ({communications.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="hidden md:flex gap-2 lg:gap-4 mb-4 lg:mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'active'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Active Calls ({activeCalls.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'history'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Call History ({completedCalls.length})
        </button>
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'dispatch'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Dispatch Optimization ({dispatchOptimizations.length})
        </button>
        <button
          onClick={() => setActiveTab('communication')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'communication'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Communications ({communications.length})
        </button>
      </div>

      {/* Mobile Tab Indicator */}
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
          <span className="font-medium text-gray-700">
            {activeTab === 'active' && `Active Calls (${filteredActiveCalls.length})`}
            {activeTab === 'history' && `Call History (${filteredCompletedCalls.length})`}
            {activeTab === 'dispatch' && `Dispatch Optimization (${dispatchOptimizations.length})`}
            {activeTab === 'communication' && `Communications (${filteredCommunications.length})`}
          </span>
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="p-1 rounded-md bg-gray-100"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Empty State Message */}
      {((activeTab === 'active' && filteredActiveCalls.length === 0 && searchQuery) ||
        (activeTab === 'history' && filteredCompletedCalls.length === 0 && searchQuery) ||
        (activeTab === 'communication' && filteredCommunications.length === 0 && searchQuery)) && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            No {activeTab} found matching "<span className="font-semibold">{searchQuery}</span>"
          </p>
        </div>
      )}

      {/* Active Calls Tab */}
      {activeTab === 'active' && (
        <div className="space-y-3 md:space-y-4">
          {filteredActiveCalls.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600">No active emergency calls</p>
            </div>
          ) : (
            filteredActiveCalls.map(call => (
              <div key={call.callId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-red-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs md:text-sm text-gray-600">Call ID</p>
                    <p className="font-bold text-sm md:text-base truncate">{call.callId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Severity</p>
                    <p className={`inline-block px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold ${getSeverityColor(call.severity)}`}>
                      {call.severity || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Status</p>
                    <p className={`inline-block px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold ${getStatusColor(call.status)}`}>
                      {call.status || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Response Time</p>
                    <p className="font-bold text-sm md:text-base text-blue-600">{call.responseTime || 0} mins</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Ambulance</p>
                    <p className="font-bold text-xs md:text-sm truncate">{call.dispatchedAmbulance || 'Pending'}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg mb-3 md:mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 flex items-center">
                        <Phone className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        Caller: {call.callerName || 'Unknown'}
                      </p>
                      <p className="text-xs md:text-sm font-mono truncate">{call.callerPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        Location
                      </p>
                      <p className="text-xs md:text-sm font-bold truncate">{call.incidentLocation?.address || 'Address not available'}</p>
                      <p className="text-xs text-gray-600">
                        {call.incidentLocation?.latitude || 'N/A'}, {call.incidentLocation?.longitude || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-gray-600">Patient: {call.patientDetails?.name || 'Unknown'}</p>
                      <p className="text-xs md:text-sm font-bold">
                        {call.patientDetails?.age || 'N/A'} y/o • {call.patientDetails?.condition || 'Condition not specified'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedCall(call)}
                  className="w-full px-3 py-2 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-xs md:text-sm transition-colors"
                >
                  View Details & Update
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Call History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3 md:space-y-4">
          {filteredCompletedCalls.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600">No completed emergency calls</p>
            </div>
          ) : (
            filteredCompletedCalls.map(call => (
              <div key={call.callId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 opacity-75 hover:opacity-100 transition-opacity">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <p className="text-xs md:text-sm text-gray-600">Call ID</p>
                    <p className="font-bold text-sm md:text-base truncate">{call.callId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Patient</p>
                    <p className="font-bold text-xs md:text-sm truncate">{call.patientDetails?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Incident Type</p>
                    <p className="font-bold text-xs md:text-sm truncate">{call.incidentType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Response Time</p>
                    <p className="font-bold text-sm md:text-base text-blue-600">{call.responseTime || 0} mins</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Date</p>
                    <p className="font-bold text-xs md:text-sm">
                      {call.callTime ? new Date(call.callTime).toLocaleDateString('en-NG') : 'Date not available'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Dispatch Optimization Tab */}
      {activeTab === 'dispatch' && (
        <div className="space-y-3 md:space-y-4">
          {dispatchOptimizations.length === 0 ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <ArrowRight className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600">No dispatch optimization data available</p>
            </div>
          ) : (
            dispatchOptimizations.map(optimization => (
              <div key={optimization.optimizationId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center">
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                  Call: {optimization.callId || 'N/A'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Selected Ambulance</p>
                    <p className="font-bold text-xs md:text-sm truncate">{optimization.selectedAmbulance || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Estimated Response</p>
                    <p className="font-bold text-sm md:text-base text-orange-600">{optimization.estimatedResponseTime || 0} mins</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Actual Response</p>
                    <p className="font-bold text-sm md:text-base text-green-600">{optimization.actualResponseTime || 0} mins</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Distance</p>
                    <p className="font-bold text-sm md:text-base">{optimization.distance || 0} km</p>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                  <p className="text-xs md:text-sm"><strong>Selection Reason:</strong> {optimization.selectionReason || 'No reason provided'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Communications Tab */}
      {activeTab === 'communication' && (
        <div className="space-y-3 md:space-y-4">
          {filteredCommunications.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600">No communications available</p>
            </div>
          ) : (
            filteredCommunications.map(comm => (
              <div key={comm.communicationId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-blue-500">
                <div className="flex items-start">
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mr-2 md:mr-3 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                      <div>
                        <p className="font-bold text-sm md:text-base">{comm.communicationType || 'Unknown Type'}</p>
                        <p className="text-xs md:text-sm text-gray-600 truncate">{comm.callId || 'No Call ID'}</p>
                      </div>
                      <p className="text-xs text-gray-600">
                        {comm.timestamp ? new Date(comm.timestamp).toLocaleTimeString('en-NG') : 'Time not available'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 md:p-3 rounded-lg mt-2">
                      <p className="text-xs md:text-sm text-gray-700">{comm.message || 'No message content'}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-2">
                      <span className="text-xs text-gray-600 truncate">From: {comm.sender || 'Unknown'}</span>
                      <span className="text-xs text-gray-600 truncate">To: {comm.recipient || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Emergency Call Modal */}
      <GenericModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        title="Create New Emergency Call"
        size="lg"
      >
        <div className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <input type="text" placeholder="Caller Name" value={formData.callerName} onChange={(e) => setFormData({ ...formData, callerName: e.target.value })} className="sm:col-span-2 px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
            <input type="tel" placeholder="Caller Phone" value={formData.callerPhone} onChange={(e) => setFormData({ ...formData, callerPhone: e.target.value })} className="px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
            <select value={formData.severity} onChange={(e) => setFormData({ ...formData, severity: e.target.value })} className="px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base">
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <textarea placeholder="Incident Description" rows="3" value={formData.incidentDescription} onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })} className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
          <input type="text" placeholder="Patient Name" value={formData.patientName} onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
          <select value={formData.ambulanceId} onChange={(e) => setFormData({ ...formData, ambulanceId: e.target.value })} className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base">
            <option value="">Assign Ambulance</option>
            {ambulances
              .filter(a => a && a.status === 'Available')
              .map(a => (
                <option key={a.ambulanceId} value={a.ambulanceId}>{a.vehicleNumber || a.registration || 'Unknown'}</option>
              ))
            }
          </select>
          <div className="flex gap-2 pt-2">
            <button onClick={handleCreateCall} className="flex-1 bg-red-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-red-700 font-medium text-sm md:text-base transition-colors">
              Create Call
            </button>
            <button onClick={() => setShowCallModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-400 font-medium text-sm md:text-base transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      {/* Details Modal */}
      {selectedCall && (
        <GenericModal
          isOpen={!!selectedCall}
          onClose={() => setSelectedCall(null)}
          title={`Call Details: ${selectedCall.callId || 'Unknown Call'}`}
          size="lg"
        >
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <p className="text-xs md:text-sm text-gray-600">Status</p>
                <p className="font-bold text-sm md:text-base">{selectedCall.status || 'Unknown'}</p>
              </div>
              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <p className="text-xs md:text-sm text-gray-600">Response Time</p>
                <p className="font-bold text-sm md:text-base text-blue-600">{selectedCall.responseTime || 0} mins</p>
              </div>
            </div>
            <select value={statusForm} onChange={(e) => setStatusForm(e.target.value)} className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base">
              <option value="Received">Received</option>
              <option value="Dispatched">Dispatched</option>
              <option value="En Route">En Route</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="flex gap-2 pt-2">
              <button onClick={handleUpdateCall} className="flex-1 bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 font-medium text-sm md:text-base transition-colors">
                Update Status
              </button>
              <button onClick={() => setSelectedCall(null)} className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-400 font-medium text-sm md:text-base transition-colors">
                Close
              </button>
            </div>
          </div>
        </GenericModal>
      )}
    </div>
  );
};

export default EmergencyResponse;