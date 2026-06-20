import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Clock,
  Users,
  Activity,
  Plus,
  Search,
  Filter,
  User,
  Stethoscope,
  Bed,
  CheckCircle,
  XCircle,
  Timer,
  Zap,
  Heart,
  Brain,
  Ambulance
} from 'lucide-react';
import {
  registerPatient,
  performTriage,
  assignToBay,
  updatePatientStatus,
  addInvestigation,
  addTreatment,
  activateTraumaProtocol,
  updateProtocolStep,
  calculateWaitTimes,
  searchED,
  sortED,
  filterED
} from '../features/edSlice';
import Pagination from '../components/Pagination';

const EmergencyDepartmentManagement = () => {
  const dispatch = useDispatch();
  const {
    patients,
    triageQueue,
    treatmentBays,
    waitingRoom,
    dischargeLounge,
    stats,
    triageScales,
    traumaProtocols,
    searchTerm,
    sortBy,
    filterBy
  } = useSelector(state => state.ed);

  const [activeTab, setActiveTab] = useState('overview');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: '',
    presentingComplaint: '',
    modeOfArrival: 'Walk-in',
    triageScore: 0
  });

  const [triageForm, setTriageForm] = useState({
    respiratoryRate: '',
    oxygenSaturation: '',
    temperature: '',
    heartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    consciousness: 'Alert',
    painScore: '',
    mobility: 'Normal'
  });

  // Initialize treatment bays if empty
  useEffect(() => {
    if (treatmentBays.length === 0) {
      // This would normally be loaded from a configuration
      // For demo purposes, we'll initialize some bays
      const initialBays = [
        { id: 'bay1', name: 'Bay 1', occupied: false, patientId: null },
        { id: 'bay2', name: 'Bay 2', occupied: false, patientId: null },
        { id: 'bay3', name: 'Bay 3', occupied: false, patientId: null },
        { id: 'bay4', name: 'Bay 4', occupied: false, patientId: null },
        { id: 'bay5', name: 'Bay 5', occupied: false, patientId: null },
        { id: 'resus', name: 'Resuscitation', occupied: false, patientId: null }
      ];
      // Note: In a real implementation, this would be handled by the slice
    }
  }, [treatmentBays]);

  // Calculate wait times periodically
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(calculateWaitTimes());
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [dispatch]);

  // Filter and search logic
  const filteredPatients = patients
    .filter(patient => {
      const matchesSearch = !searchTerm ||
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.presentingComplaint.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || patient.status === filterBy || patient.triageColor === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'arrival_time') return new Date(b.arrivalTime) - new Date(a.arrivalTime);
      if (sortBy === 'triage_priority') {
        const colorPriority = { red: 5, orange: 4, yellow: 3, green: 2, blue: 1 };
        return (colorPriority[b.triageColor] || 0) - (colorPriority[a.triageColor] || 0);
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleRegisterPatient = (e) => {
    e.preventDefault();
    dispatch(registerPatient(patientForm));
    setPatientForm({
      name: '',
      age: '',
      gender: '',
      presentingComplaint: '',
      modeOfArrival: 'Walk-in',
      triageScore: 0
    });
    setShowPatientModal(false);
  };

  const calculateTriageScore = (formData) => {
    let score = 0;
    let color = 'green';

    // Respiratory Rate
    const rr = parseInt(formData.respiratoryRate);
    if (rr <= 8 || rr >= 25) { score += 3; color = 'red'; }
    else if (rr >= 21 && rr <= 24) { score += 2; if (color === 'green') color = 'orange'; }
    else if (rr >= 9 && rr <= 11) { score += 1; if (color === 'green') color = 'yellow'; }

    // Oxygen Saturation
    const spo2 = parseInt(formData.oxygenSaturation);
    if (spo2 <= 91) { score += 3; color = 'red'; }
    else if (spo2 >= 92 && spo2 <= 93) { score += 2; if (color === 'green') color = 'orange'; }
    else if (spo2 >= 94 && spo2 <= 95) { score += 1; if (color === 'green') color = 'yellow'; }

    // Temperature
    const temp = parseFloat(formData.temperature);
    if (temp <= 35.0) { score += 3; color = 'red'; }
    else if (temp >= 39.1) { score += 2; if (color === 'green') color = 'orange'; }
    else if (temp >= 38.1 && temp <= 39.0) { score += 1; if (color === 'green') color = 'yellow'; }

    // Blood Pressure
    const systolic = parseInt(formData.bloodPressureSystolic);
    if (systolic <= 90 || systolic >= 220) { score += 3; color = 'red'; }
    else if (systolic >= 101 && systolic <= 110) { score += 2; if (color === 'green') color = 'orange'; }
    else if (systolic >= 111 && systolic <= 219) { score += 1; if (color === 'green') color = 'yellow'; }

    // Heart Rate
    const hr = parseInt(formData.heartRate);
    if (hr <= 40 || hr >= 131) { score += 3; color = 'red'; }
    else if (hr >= 111 && hr <= 130) { score += 2; if (color === 'green') color = 'orange'; }
    else if ((hr >= 41 && hr <= 50) || (hr >= 91 && hr <= 110)) { score += 1; if (color === 'green') color = 'yellow'; }

    // Consciousness
    if (formData.consciousness !== 'Alert') { score += 3; color = 'red'; }

    return { score, color };
  };

  const handleTriage = (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const triageResult = calculateTriageScore(triageForm);
    dispatch(performTriage({
      patientId: selectedPatient.id,
      triageData: triageResult
    }));

    setTriageForm({
      respiratoryRate: '',
      oxygenSaturation: '',
      temperature: '',
      heartRate: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      consciousness: 'Alert',
      painScore: '',
      mobility: 'Normal'
    });
    setShowTriageModal(false);
    setSelectedPatient(null);
  };

  const handleAssignToBay = (patientId, bayId) => {
    dispatch(assignToBay({
      patientId,
      bayId,
      physicianId: 'dr_smith',
      nurseId: 'nurse_jane'
    }));
  };

  const getTriageColorClass = (color) => {
    switch (color) {
      case 'red': return 'bg-red-100 border-red-500 text-red-800';
      case 'orange': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'yellow': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'green': return 'bg-green-100 border-green-500 text-green-800';
      case 'blue': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting_triage': return 'bg-yellow-100 text-yellow-800';
      case 'triaged': return 'bg-blue-100 text-blue-800';
      case 'in_treatment': return 'bg-purple-100 text-purple-800';
      case 'discharged': return 'bg-green-100 text-green-800';
      case 'admitted': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="emergency-department p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Ambulance className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-red-500" />
          Emergency Department Management
        </h1>
        <p className="text-gray-600 mt-2">Triage, treatment, and patient flow management</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold mt-2">{stats.totalPatients}</p>
            </div>
            <Users className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Waiting</p>
              <p className="text-3xl font-bold mt-2">{stats.waitingPatients}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">In Treatment</p>
              <p className="text-3xl font-bold mt-2">{stats.inTreatment}</p>
            </div>
            <Stethoscope className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg Wait Time</p>
              <p className="text-3xl font-bold mt-2">{Math.round(stats.averageWaitTime)}min</p>
            </div>
            <Timer className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'triage', label: 'Triage Queue', icon: AlertTriangle },
            { id: 'treatment', label: 'Treatment Bays', icon: Bed },
            { id: 'patients', label: 'All Patients', icon: Users }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                activeTab === tab.id
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Triage Queue */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Triage Queue</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {triageQueue.slice(0, 5).map(patient => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">{patient.presentingComplaint}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTriageColorClass(patient.triageColor)}`}>
                      {patient.triageColor?.toUpperCase()}
                    </span>
                  </div>
                ))}
                {triageQueue.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No patients in triage queue</p>
                )}
              </div>
            </div>

            {/* Treatment Bays */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Treatment Bays</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'bay1', name: 'Bay 1' },
                  { id: 'bay2', name: 'Bay 2' },
                  { id: 'bay3', name: 'Bay 3' },
                  { id: 'bay4', name: 'Bay 4' },
                  { id: 'bay5', name: 'Bay 5' },
                  { id: 'resus', name: 'Resus' }
                ].map(bay => {
                  const patient = patients.find(p => p.assignedBay === bay.id);
                  return (
                    <div key={bay.id} className={`p-3 rounded-lg border-2 ${
                      patient ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
                    }`}>
                      <p className="font-medium text-sm">{bay.name}</p>
                      {patient ? (
                        <p className="text-xs text-red-700">{patient.name}</p>
                      ) : (
                        <p className="text-xs text-green-700">Available</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'triage' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Triage Queue</h3>
              <button
                onClick={() => setShowPatientModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Register Patient
              </button>
            </div>

            <div className="space-y-3">
              {waitingRoom.map(patient => (
                <div key={patient.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.presentingComplaint}</p>
                    <p className="text-xs text-gray-500">
                      Arrived: {new Date(patient.arrivalTime).toLocaleTimeString('en-NG')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowTriageModal(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Triage
                    </button>
                  </div>
                </div>
              ))}

              {triageQueue.map(patient => (
                <div key={patient.id} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.presentingComplaint}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTriageColorClass(patient.triageColor)}`}>
                        {patient.triageColor?.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Score: {patient.triageScore}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      onChange={(e) => handleAssignToBay(patient.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Assign to Bay</option>
                      {[
                        { id: 'bay1', name: 'Bay 1' },
                        { id: 'bay2', name: 'Bay 2' },
                        { id: 'bay3', name: 'Bay 3' },
                        { id: 'bay4', name: 'Bay 4' },
                        { id: 'bay5', name: 'Bay 5' },
                        { id: 'resus', name: 'Resuscitation' }
                      ].map(bay => (
                        <option key={bay.id} value={bay.id}>{bay.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {waitingRoom.length === 0 && triageQueue.length === 0 && (
                <p className="text-gray-500 text-center py-8">No patients waiting for triage</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'treatment' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Treatment Bays</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'bay1', name: 'Bay 1' },
                { id: 'bay2', name: 'Bay 2' },
                { id: 'bay3', name: 'Bay 3' },
                { id: 'bay4', name: 'Bay 4' },
                { id: 'bay5', name: 'Bay 5' },
                { id: 'resus', name: 'Resuscitation Bay' }
              ].map(bay => {
                const patient = patients.find(p => p.assignedBay === bay.id);
                return (
                  <div key={bay.id} className={`p-4 rounded-lg border-2 ${
                    patient ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{bay.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        patient ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                      }`}>
                        {patient ? 'Occupied' : 'Available'}
                      </span>
                    </div>

                    {patient ? (
                      <div>
                        <p className="text-sm font-medium">{patient.name}</p>
                        <p className="text-xs text-gray-600 mb-2">{patient.presentingComplaint}</p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => dispatch(updatePatientStatus({ patientId: patient.id, status: 'discharged' }))}
                            className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          >
                            Discharge
                          </button>
                          <button
                            onClick={() => dispatch(updatePatientStatus({ patientId: patient.id, status: 'admitted' }))}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                          >
                            Admit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No patient assigned</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchED(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterED(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Patients</option>
                  <option value="waiting_triage">Waiting Triage</option>
                  <option value="triaged">Triaged</option>
                  <option value="in_treatment">In Treatment</option>
                  <option value="discharged">Discharged</option>
                  <option value="admitted">Admitted</option>
                  <option value="red">Red Priority</option>
                  <option value="orange">Orange Priority</option>
                  <option value="yellow">Yellow Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(sortED(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="arrival_time">Arrival Time</option>
                  <option value="triage_priority">Triage Priority</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowPatientModal(true)}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register Patient
                </button>
              </div>
            </div>

            {/* Patients Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Triage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wait Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPatients.map(patient => {
                    const waitTime = Math.round((new Date() - new Date(patient.arrivalTime)) / (1000 * 60));
                    return (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">{patient.presentingComplaint}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {patient.triageColor ? (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getTriageColorClass(patient.triageColor)}`}>
                              {patient.triageColor.toUpperCase()} ({patient.triageScore})
                            </span>
                          ) : (
                            <span className="text-gray-400">Not triaged</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(patient.status)}`}>
                            {patient.status?.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(patient.arrivalTime).toLocaleTimeString('en-NG')}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {waitTime} min
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          {patient.status === 'waiting_triage' && (
                            <button
                              onClick={() => {
                                setSelectedPatient(patient);
                                setShowTriageModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Triage
                            </button>
                          )}
                          {patient.status === 'triaged' && (
                            <button
                              onClick={() => dispatch(activateTraumaProtocol({ patientId: patient.id, protocolType: 'atls' }))}
                              className="text-red-600 hover:text-red-900"
                            >
                              Activate ATLS
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {paginatedPatients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No patients found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination for patients tab */}
      {activeTab === 'patients' && filteredPatients.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredPatients.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Register Patient Modal */}
      {showPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Register Emergency Patient
              </h3>
              <form onSubmit={handleRegisterPatient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                  <input
                    type="text"
                    value={patientForm.name}
                    onChange={(e) => setPatientForm({...patientForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={patientForm.age}
                      onChange={(e) => setPatientForm({...patientForm, age: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={patientForm.gender}
                      onChange={(e) => setPatientForm({...patientForm, gender: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Presenting Complaint</label>
                  <textarea
                    value={patientForm.presentingComplaint}
                    onChange={(e) => setPatientForm({...patientForm, presentingComplaint: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mode of Arrival</label>
                  <select
                    value={patientForm.modeOfArrival}
                    onChange={(e) => setPatientForm({...patientForm, modeOfArrival: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Walk-in">Walk-in</option>
                    <option value="Ambulance">Ambulance</option>
                    <option value="Police">Police</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
                  >
                    Register Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPatientModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Triage Modal */}
      {showTriageModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Triage Assessment - {selectedPatient.name}
              </h3>

              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium mb-2">South African Triage Scale (SATS)</h4>
                <p className="text-sm text-gray-600">
                  Red: Immediate (life-threatening) - Orange: Very urgent - Yellow: Urgent - Green: Standard - Blue: Non-urgent
                </p>
              </div>

              <form onSubmit={handleTriage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Respiratory Rate (/min)</label>
                    <input
                      type="number"
                      value={triageForm.respiratoryRate}
                      onChange={(e) => setTriageForm({...triageForm, respiratoryRate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Oxygen Saturation (%)</label>
                    <input
                      type="number"
                      value={triageForm.oxygenSaturation}
                      onChange={(e) => setTriageForm({...triageForm, oxygenSaturation: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={triageForm.temperature}
                      onChange={(e) => setTriageForm({...triageForm, temperature: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={triageForm.heartRate}
                      onChange={(e) => setTriageForm({...triageForm, heartRate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Systolic"
                        value={triageForm.bloodPressureSystolic}
                        onChange={(e) => setTriageForm({...triageForm, bloodPressureSystolic: e.target.value})}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        required
                      />
                      <span className="flex items-center">/</span>
                      <input
                        type="number"
                        placeholder="Diastolic"
                        value={triageForm.bloodPressureDiastolic}
                        onChange={(e) => setTriageForm({...triageForm, bloodPressureDiastolic: e.target.value})}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level of Consciousness</label>
                    <select
                      value={triageForm.consciousness}
                      onChange={(e) => setTriageForm({...triageForm, consciousness: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Alert">Alert</option>
                      <option value="Voice">Responds to Voice</option>
                      <option value="Pain">Responds to Pain</option>
                      <option value="Unresponsive">Unresponsive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pain Score (0-10)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={triageForm.painScore}
                      onChange={(e) => setTriageForm({...triageForm, painScore: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobility</label>
                    <select
                      value={triageForm.mobility}
                      onChange={(e) => setTriageForm({...triageForm, mobility: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Limping">Limping</option>
                      <option value="Unable to walk">Unable to walk</option>
                      <option value="Carried">Carried</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
                  >
                    Complete Triage
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTriageModal(false);
                      setSelectedPatient(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyDepartmentManagement;