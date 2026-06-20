import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Heart,
  Thermometer,
  Wind,
  Activity,
  AlertTriangle,
  TrendingUp,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Bell,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import {
  addVitalSigns,
  calculateEarlyWarningScore,
  acknowledgeAlert,
  searchVitalSigns,
  sortVitalSigns,
  filterVitalSigns
} from '../features/vitalSignsSlice';
import Pagination from '../components/Pagination';

const VitalSignsMonitoring = () => {
  const dispatch = useDispatch();
  const { vitalSigns, alerts, searchTerm, sortBy, filterBy } = useSelector(state => state.vitalSigns);
  const { patients } = useSelector(state => state.patient);

  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedPatient, setSelectedPatient] = useState('');
  const [formData, setFormData] = useState({
    patientId: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    temperature: '',
    respirationRate: '',
    oxygenSaturation: '',
    bloodGlucose: '',
    painScore: '',
    consciousness: 'Alert',
    notes: ''
  });

  // Filter and search logic
  const filteredVitalSigns = vitalSigns
    .filter(vs => {
      const matchesSearch = !searchTerm ||
        patients.find(p => p.id === vs.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vs.patientId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || vs.patientId === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === 'patient') return a.patientId.localeCompare(b.patientId);
      return 0;
    });

  const paginatedVitalSigns = filteredVitalSigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeAlerts = alerts.filter(alert => !alert.acknowledged);

  const handleSubmit = (e) => {
    e.preventDefault();
    const vitalsData = {
      patientId: selectedPatient,
      bloodPressure: `${formData.bloodPressureSystolic}/${formData.bloodPressureDiastolic}`,
      heartRate: parseInt(formData.heartRate),
      temperature: parseFloat(formData.temperature),
      respirationRate: parseInt(formData.respirationRate),
      oxygenSaturation: parseInt(formData.oxygenSaturation),
      bloodGlucose: formData.bloodGlucose ? parseInt(formData.bloodGlucose) : null,
      painScore: parseInt(formData.painScore),
      consciousness: formData.consciousness,
      notes: formData.notes
    };

    dispatch(addVitalSigns(vitalsData));

    // Calculate early warning score
    dispatch(calculateEarlyWarningScore({
      patientId: selectedPatient,
      vitals: {
        respirationRate: vitalsData.respirationRate,
        oxygenSaturation: vitalsData.oxygenSaturation,
        temperature: vitalsData.temperature,
        systolicBP: parseInt(formData.bloodPressureSystolic),
        heartRate: vitalsData.heartRate,
        consciousness: vitalsData.consciousness
      }
    }));

    // Reset form
    setFormData({
      patientId: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      temperature: '',
      respirationRate: '',
      oxygenSaturation: '',
      bloodGlucose: '',
      painScore: '',
      consciousness: 'Alert',
      notes: ''
    });
    setSelectedPatient('');
    setShowForm(false);
  };

  const getVitalSignStatus = (value, normalRange) => {
    if (!value) return 'normal';
    const [min, max] = normalRange;
    if (value < min || value > max) return 'abnormal';
    return 'normal';
  };

  const acknowledgeAlertHandler = (alertId) => {
    dispatch(acknowledgeAlert(alertId));
  };

  return (
    <div className="vital-signs-monitoring p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Heart className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-red-500" />
          Vital Signs Monitoring & Alerts
        </h1>
        <p className="text-gray-600 mt-2">Real-time monitoring with early warning systems</p>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-red-800">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Active Alerts ({activeAlerts.length})
          </h2>
          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertTriangle className={`w-5 h-5 mr-3 ${alert.severity === 'High' ? 'text-red-500' : alert.severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'}`} />
                  <div>
                    <p className="font-medium text-gray-800">{alert.message}</p>
                    <p className="text-sm text-gray-600">{new Date(alert.timestamp).toLocaleString('en-NG')}</p>
                  </div>
                </div>
                <button
                  onClick={() => acknowledgeAlertHandler(alert.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Patient</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => dispatch(searchVitalSigns(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Patient</label>
            <select
              value={filterBy}
              onChange={(e) => dispatch(filterVitalSigns(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Patients</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => dispatch(sortVitalSigns(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="date">Date (Newest First)</option>
              <option value="patient">Patient ID</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vital Signs
            </button>
          </div>
        </div>
      </div>

      {/* Vital Signs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Pressure</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heart Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SpO2</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RR</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pain Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVitalSigns.map(vs => {
                const patient = patients.find(p => p.id === vs.patientId);
                return (
                  <tr key={vs.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{patient?.name || vs.patientId}</div>
                        <div className="text-sm text-gray-500">{vs.patientId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm ${getVitalSignStatus(parseInt(vs.bloodPressure.split('/')[0]), [90, 140]) === 'abnormal' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {vs.bloodPressure}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm ${getVitalSignStatus(vs.heartRate, [60, 100]) === 'abnormal' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {vs.heartRate} bpm
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm ${getVitalSignStatus(vs.temperature, [36.1, 37.5]) === 'abnormal' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {vs.temperature}°C
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm ${getVitalSignStatus(vs.oxygenSaturation, [95, 100]) === 'abnormal' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {vs.oxygenSaturation}%
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm ${getVitalSignStatus(vs.respirationRate, [12, 20]) === 'abnormal' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {vs.respirationRate}/min
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`text-sm ${getVitalSignStatus(vs.painScore, [0, 3]) === 'abnormal' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {vs.painScore}/10
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vs.timestamp).toLocaleString('en-NG')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {paginatedVitalSigns.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No vital signs recorded yet.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredVitalSigns.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredVitalSigns.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Add Vital Signs Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Record Vital Signs
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient</label>
                  <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure (mmHg)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Systolic"
                        value={formData.bloodPressureSystolic}
                        onChange={(e) => setFormData({...formData, bloodPressureSystolic: e.target.value})}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        required
                      />
                      <span className="flex items-center">/</span>
                      <input
                        type="number"
                        placeholder="Diastolic"
                        value={formData.bloodPressureDiastolic}
                        onChange={(e) => setFormData({...formData, bloodPressureDiastolic: e.target.value})}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={formData.heartRate}
                      onChange={(e) => setFormData({...formData, heartRate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.temperature}
                      onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Respiration Rate (/min)</label>
                    <input
                      type="number"
                      value={formData.respirationRate}
                      onChange={(e) => setFormData({...formData, respirationRate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Oxygen Saturation (%)</label>
                    <input
                      type="number"
                      value={formData.oxygenSaturation}
                      onChange={(e) => setFormData({...formData, oxygenSaturation: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pain Score (0-10)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.painScore}
                      onChange={(e) => setFormData({...formData, painScore: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Glucose (mg/dL)</label>
                    <input
                      type="number"
                      value={formData.bloodGlucose}
                      onChange={(e) => setFormData({...formData, bloodGlucose: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level of Consciousness</label>
                    <select
                      value={formData.consciousness}
                      onChange={(e) => setFormData({...formData, consciousness: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Alert">Alert</option>
                      <option value="Voice">Responds to Voice</option>
                      <option value="Pain">Responds to Pain</option>
                      <option value="Unresponsive">Unresponsive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Additional observations..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
                  >
                    Record Vital Signs
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
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

export default VitalSignsMonitoring;