import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  Clock,
  Loader2,
  X
} from 'lucide-react';
import {
  fetchVitalSigns,
  createVitalSign,
  fetchActiveAlerts,
  acknowledgeAlertApi,
  calculateEWS,
  clearError,
} from '../features/vitalSignsSlice';
import { apiRequest, vitalsApi } from '../utils/api';
import Pagination from '../components/Pagination';

const VitalSignsMonitoring = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vitalSigns, alerts, loading, error } = useSelector(state => state.vitalSigns);
  const { patients } = useSelector(state => state.patient || { patients: [] });

  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedPatient, setSelectedPatient] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
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
    notes: '',
    visitId: '',
  });
  const [ewsResult, setEwsResult] = useState(null);
  const [alertError, setAlertError] = useState('');
  const [alertSuccess, setAlertSuccess] = useState('');

  const [patientOptions, setPatientOptions] = useState(patients || []);
  const [patientSearchLoading, setPatientSearchLoading] = useState(false);
  const [allPatientsCache, setAllPatientsCache] = useState([]);
  const [globalPatientSearch, setGlobalPatientSearch] = useState('');

  const loadAllPatients = async () => {
    try {
      const data = await apiRequest('/api/v1/patients/patients/?page_size=100');
      const list = Array.isArray(data) ? data : (data.results || []);
      setAllPatientsCache(list);
      setPatientOptions(list);
    } catch {
      setAllPatientsCache(patients || []);
      setPatientOptions(patients || []);
    }
  };

  useEffect(() => {
    dispatch(fetchVitalSigns());
    dispatch(fetchActiveAlerts());
    loadAllPatients();
  }, [dispatch]);

  useEffect(() => {
    setPatientOptions(patients);
  }, [patients]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchActiveAlerts());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // --- FIX: Safely get vital sign for a patient ---
  const getVitalSignForPatient = (patientId) => {
    if (!vitalSigns || !Array.isArray(vitalSigns)) return null;
    return vitalSigns.find(v => String(v.patient) === String(patientId)) || null;
  };

  // --- FIX: Safely get value from vital sign with fallback ---
  const getVitalValue = (vs, key, fallback = '-') => {
    if (!vs) return fallback;
    const value = vs[key];
    return value !== undefined && value !== null ? value : fallback;
  };

  // --- FIX: Safely get display value with unit ---
  const getVitalDisplay = (vs, key, unit = '', fallback = '-') => {
    const value = getVitalValue(vs, key, fallback);
    if (value === fallback) return fallback;
    return `${value}${unit}`;
  };

  const displayRows = useMemo(() => {
    try {
      const searchLower = typeof globalPatientSearch === 'string' ? globalPatientSearch.toLowerCase().trim() : '';
      const filterByVal = typeof filterBy === 'string' ? filterBy : 'all';

      let baseList = Array.isArray(allPatientsCache) ? allPatientsCache : [];
      if (filterByVal !== 'all') {
        baseList = baseList.filter(p => String(p?.id) === String(filterByVal));
      }
      if (searchLower) {
        baseList = baseList.filter(p => {
          const name = (p?.name || `${p?.first_name || ''} ${p?.last_name || ''}`).toLowerCase();
          return (
            name.includes(searchLower) ||
            String(p?.id).includes(searchLower) ||
            (p?.hospital_number && p.hospital_number.toLowerCase().includes(searchLower)) ||
            (p?.phone && p.phone.toLowerCase().includes(searchLower))
          );
        });
      }

      return baseList.map(patient => {
        const vs = getVitalSignForPatient(patient?.id);
        return {
          patient,
          vitalSign: vs,
          patientId: patient?.id,
          patientName: patient?.name || `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim() || `Patient ${patient?.id || '?'}`,
          recorded_at: vs?.recorded_at || patient?.created_at,
        };
      }).sort((a, b) => {
        if (sortBy === 'date') return new Date(b.recorded_at || 0) - new Date(a.recorded_at || 0);
        if (sortBy === 'patient') return String(a.patientId || '').localeCompare(String(b.patientId || ''));
        return 0;
      });
    } catch (err) {
      console.error('Error computing displayRows:', err);
      return [];
    }
  }, [globalPatientSearch, filterBy, sortBy, allPatientsCache, vitalSigns]);

  const paginatedVitalSigns = displayRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeAlerts = Array.isArray(alerts) ? alerts.filter(alert => !alert.acknowledged) : [];

  const handleSearchPatients = async (term) => {
    setGlobalPatientSearch(term);
    if (!term.trim()) {
      setPatientOptions(allPatientsCache.length > 0 ? allPatientsCache : (patients || []));
      return;
    }
    setPatientSearchLoading(true);
    try {
      const data = await apiRequest(`/api/v1/patients/patients/?search=${encodeURIComponent(term)}&page_size=50`);
      const list = Array.isArray(data) ? data : (data.results || []);
      setPatientOptions(list);
    } catch {
      setPatientOptions(allPatientsCache.length > 0 ? allPatientsCache : (patients || []));
    } finally {
      setPatientSearchLoading(false);
    }
  };

  const handleSelectPatient = (patient) => {
    const name = patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
    setSelectedPatient(name);
    setGlobalPatientSearch(name);
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      visitId: patient.current_visit_id || '',
    }));
    setShowForm(true);
    setPatientOptions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertError('');
    setAlertSuccess('');
    setEwsResult(null);

    const payload = {
      patient: formData.patientId,
      visit: formData.visitId || undefined,
      blood_pressure_systolic: formData.bloodPressureSystolic ? parseInt(formData.bloodPressureSystolic) : null,
      blood_pressure_diastolic: formData.bloodPressureDiastolic ? parseInt(formData.bloodPressureDiastolic) : null,
      pulse: formData.heartRate ? parseInt(formData.heartRate) : null,
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      respiratory_rate: formData.respirationRate ? parseInt(formData.respirationRate) : null,
      oxygen_saturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : null,
      blood_glucose: formData.bloodGlucose ? parseFloat(formData.bloodGlucose) : null,
      pain_score: formData.painScore ? parseInt(formData.painScore) : null,
      consciousness: formData.consciousness,
      notes: formData.notes,
    };

    let vs;
    try {
      const result = await dispatch(createVitalSign(payload));
      if (createVitalSign.rejected.match(result)) {
        setAlertError(result.payload || 'Failed to save vital signs.');
        return;
      }
      vs = result.payload;
    } catch (err) {
      setAlertError(err.message || 'Failed to save vital signs.');
      return;
    }

    let ewsText = '';
    if (vs && vs.temperature && vs.oxygen_saturation && vs.blood_pressure_systolic &&
      vs.pulse && vs.respiratory_rate) {
      const ewsPayload = {
        vital_sign: vs.id,
        patient: vs.patient,
        visit: vs.visit || undefined,
        respiration_rate: vs.respiratory_rate,
        oxygen_saturation: parseFloat(vs.oxygen_saturation),
        temperature: parseFloat(vs.temperature),
        systolic_bp: vs.blood_pressure_systolic,
        heart_rate: vs.pulse,
        consciousness: vs.consciousness || 'Alert',
      };
      const ewsResultAction = await dispatch(calculateEWS(ewsPayload));
      if (calculateEWS.fulfilled.match(ewsResultAction)) {
        setEwsResult(ewsResultAction.payload);
        const ews = ewsResultAction.payload || {};
        const score = ews.score ?? ews.risk_score ?? null;
        const level = ews.risk_level ?? ews.level ?? null;
        if (score != null || level) {
          ewsText = ` Early warning score: ${score != null ? score : '—'}, risk: ${level || '—'}.`;
        }
      }
    }

    setAlertSuccess(`Vital signs recorded successfully for ${selectedPatient || 'patient'}.${ewsText}`);
    dispatch(fetchVitalSigns());

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
      notes: '',
      visitId: '',
    });
    setSelectedPatient('');

    setTimeout(() => {
      setShowForm(false);
      setAlertSuccess('');
      setAlertError('');
      setEwsResult(null);
    }, 1800);
  };

  const handleAcknowledge = async (alertId) => {
    const result = await dispatch(acknowledgeAlertApi(alertId));
    if (!acknowledgeAlertApi.fulfilled.match(result)) {
      setAlertError(result.payload || 'Failed to acknowledge alert.');
    }
  };

  const handleRefresh = () => {
    dispatch(fetchVitalSigns());
    dispatch(fetchActiveAlerts());
  };

  const closeForm = () => {
    setShowForm(false);
    setAlertError('');
    setAlertSuccess('');
    setEwsResult(null);
    setSelectedPatient('');
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
      notes: '',
      visitId: '',
    });
  };

  // --- FIX: Safely check if vital sign is abnormal ---
  const isAbnormal = (vs, key, normalRange) => {
    if (!vs) return false;
    const value = vs[key];
    if (value === undefined || value === null) return false;
    const [min, max] = normalRange;
    return value < min || value > max;
  };

  // --- FIX: Safely get status class ---
  const getStatusClass = (vs, key, normalRange) => {
    return isAbnormal(vs, key, normalRange) ? 'text-red-600 font-medium' : 'text-gray-900';
  };

  const getEwsRiskColor = (level) => {
    if (!level) return 'text-gray-600 bg-gray-50 border-gray-200';
    if (level === 'high') return 'text-red-600 bg-red-50 border-red-200';
    if (level === 'medium') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  // --- FIX: Safely get EWS from vital sign ---
  const getEws = (vs) => {
    if (!vs) return null;
    if (vs.early_warning_scores && Array.isArray(vs.early_warning_scores) && vs.early_warning_scores.length > 0) {
      return vs.early_warning_scores[0];
    }
    return null;
  };

  // --- FIX: Safely format pain score ---
  const getPainDisplay = (vs) => {
    if (!vs) return '-';
    const pain = vs.pain_score;
    if (pain === undefined || pain === null) return '-';
    return `${pain}/10`;
  };

  // Mobile card view for vital signs
  const VitalSignCard = ({ row }) => {
    const vs = row.vitalSign;
    const ews = getEws(vs);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-medium text-gray-900">{row.patientName}</div>
            <div className="text-sm text-gray-500">ID: {row.patientId}</div>
          </div>
          {ews ? (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getEwsRiskColor(ews.risk_level)}`}>
              EWS: {ews.total_score ?? '?'}
            </span>
          ) : vs ? (
            <span className="text-xs text-gray-400">No EWS</span>
          ) : null}
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <span className="text-gray-500">BP</span>
            <div className={`font-medium ${getStatusClass(vs, 'blood_pressure_systolic', [90, 140])}`}>
              {vs ? `${vs.blood_pressure_systolic || '-'}/${vs.blood_pressure_diastolic || '-'}` : '-'}
            </div>
          </div>
          <div>
            <span className="text-gray-500">HR</span>
            <div className={`font-medium ${getStatusClass(vs, 'pulse', [60, 100])}`}>
              {getVitalDisplay(vs, 'pulse', ' bpm')}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Temp</span>
            <div className={`font-medium ${getStatusClass(vs, 'temperature', [36.1, 37.5])}`}>
              {getVitalDisplay(vs, 'temperature', '°C')}
            </div>
          </div>
          <div>
            <span className="text-gray-500">SpO2</span>
            <div className={`font-medium ${getStatusClass(vs, 'oxygen_saturation', [95, 100])}`}>
              {getVitalDisplay(vs, 'oxygen_saturation', '%')}
            </div>
          </div>
          <div>
            <span className="text-gray-500">RR</span>
            <div className={`font-medium ${getStatusClass(vs, 'respiratory_rate', [12, 20])}`}>
              {getVitalDisplay(vs, 'respiratory_rate', '/min')}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Pain</span>
            <div className={`font-medium ${isAbnormal(vs, 'pain_score', [0, 3]) ? 'text-red-600' : 'text-gray-900'}`}>
              {getPainDisplay(vs)}
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          {vs ? new Date(vs.recorded_at).toLocaleString('en-NG') : (row.recorded_at ? new Date(row.recorded_at).toLocaleString('en-NG') : '-')}
        </div>
      </div>
    );
  };

  return (
    <div className="vital-signs-monitoring px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-gray-50 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mr-2 sm:mr-3 text-red-500 flex-shrink-0" />
          <span>Vital Signs Monitoring & Alerts</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Real-time monitoring with early warning systems</p>
      </div>

      {alertError && (
        <div className="mb-4 sm:mb-6 rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4 text-sm text-red-700">
          <div className="flex items-start justify-between">
            <span className="flex-1">{alertError}</span>
            <button onClick={() => setAlertError('')} className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 sm:mb-6 rounded-xl border border-orange-200 bg-orange-50 p-3 sm:p-4 text-sm text-orange-700">
          <div className="flex items-start justify-between">
            <span className="flex-1">{error}</span>
            <button onClick={() => dispatch(clearError())} className="text-orange-500 hover:text-orange-700 flex-shrink-0 ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {ewsResult && (
        <div className={`mb-4 sm:mb-6 rounded-xl border p-3 sm:p-4 ${getEwsRiskColor(ewsResult.risk_level)}`}>
          <div className="flex items-center gap-2 flex-wrap">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-semibold text-sm sm:text-base">Early Warning Score: {ewsResult.total} ({ewsResult.risk_level?.toUpperCase() || 'UNKNOWN'} Risk)</span>
          </div>
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 text-xs">
            <div>Respiration: {ewsResult.respiration_score ?? '-'}</div>
            <div>SpO₂: {ewsResult.oxygen_score ?? '-'}</div>
            <div>Temp: {ewsResult.temperature_score ?? '-'}</div>
            <div>BP: {ewsResult.systolic_bp_score ?? '-'}</div>
            <div>HR: {ewsResult.heart_rate_score ?? '-'}</div>
            <div>Consciousness: {ewsResult.consciousness_score ?? '-'}</div>
          </div>
        </div>
      )}

      {activeAlerts.length > 0 && (
        <div className="mb-6 sm:mb-8 bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 md:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center text-red-800">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            <span>Active Alerts ({activeAlerts.length})</span>
          </h2>
          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 sm:p-4 rounded-lg border border-red-200 gap-3">
                <div className="flex items-start sm:items-center">
                  <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0 ${alert.severity === 'critical' ? 'text-red-500' : alert.severity === 'high' ? 'text-orange-500' : 'text-yellow-500'}`} />
                  <div>
                    <p className="font-medium text-gray-800 text-sm sm:text-base">{alert.title}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-500">{new Date(alert.created_at).toLocaleString('en-NG')}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAcknowledge(alert.id)}
                  disabled={loading}
                  className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium disabled:opacity-50 text-sm"
                >
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Search Patient</label>
            <div className="relative">
              <Search className="w-3 h-3 sm:w-4 sm:h-4 absolute left-2 sm:left-3 top-2.5 sm:top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={globalPatientSearch}
                onChange={(e) => handleSearchPatients(e.target.value)}
                className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter by Patient</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Patients</option>
              {allPatientsCache.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || patient.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="date">Date (Newest First)</option>
              <option value="patient">Patient ID</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex-1 bg-gray-100 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-200 font-medium flex items-center justify-center text-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span className="ml-1 sm:ml-2 hidden xs:inline">Refresh</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex-1 bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-600 font-medium flex items-center justify-center text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span>Add Vitals</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View - Hidden on small screens */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HR</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SpO2</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RR</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pain</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EWS</th>
                <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recorded</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && paginatedVitalSigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-2 text-red-500" />
                    Loading vital signs...
                  </td>
                </tr>
              ) : paginatedVitalSigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No patients found.
                  </td>
                </tr>
              ) : (
                paginatedVitalSigns.map((row) => {
                  const vs = row.vitalSign;
                  const patient = row.patient;
                  const ews = getEws(vs);
                  
                  return (
                    <tr key={row.patientId} className="hover:bg-gray-50">
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{row.patientName}</div>
                          <div className="text-xs text-gray-500">{row.patientId}</div>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        <span className={`text-xs sm:text-sm ${getStatusClass(vs, 'blood_pressure_systolic', [90, 140])}`}>
                          {vs ? `${vs.blood_pressure_systolic || '-'}/${vs.blood_pressure_diastolic || '-'}` : '-'}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        <span className={`text-xs sm:text-sm ${getStatusClass(vs, 'pulse', [60, 100])}`}>
                          {getVitalDisplay(vs, 'pulse', ' bpm')}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        <span className={`text-xs sm:text-sm ${getStatusClass(vs, 'temperature', [36.1, 37.5])}`}>
                          {getVitalDisplay(vs, 'temperature', '°C')}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        <span className={`text-xs sm:text-sm ${getStatusClass(vs, 'oxygen_saturation', [95, 100])}`}>
                          {getVitalDisplay(vs, 'oxygen_saturation', '%')}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        <span className={`text-xs sm:text-sm ${getStatusClass(vs, 'respiratory_rate', [12, 20])}`}>
                          {getVitalDisplay(vs, 'respiratory_rate', '/min')}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        <span className={`text-xs sm:text-sm ${isAbnormal(vs, 'pain_score', [0, 3]) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {getPainDisplay(vs)}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                        {ews ? (
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getEwsRiskColor(ews.risk_level)}`}>
                            {ews.total_score ?? '?'} ({ews.risk_level || 'UNKNOWN'})
                          </span>
                        ) : vs ? (
                          <span className="text-xs text-gray-400">No EWS</span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 whitespace-nowrap text-xs text-gray-500">
                        {vs ? new Date(vs.recorded_at).toLocaleString('en-NG') : (row.recorded_at ? new Date(row.recorded_at).toLocaleString('en-NG') : '-')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View - Visible on small screens */}
      <div className="md:hidden mb-6 sm:mb-8">
        {loading && paginatedVitalSigns.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-red-500" />
            Loading vital signs...
          </div>
        ) : paginatedVitalSigns.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No patients found.
          </div>
        ) : (
          paginatedVitalSigns.map((row) => (
            <VitalSignCard key={row.patientId} row={row} />
          ))
        )}
      </div>

      {displayRows.length > itemsPerPage && (
        <div className="mb-6 sm:mb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(displayRows.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md sm:max-w-xl md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] md:max-h-[85vh] overflow-y-auto">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-bold flex items-center">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                  Record Vital Signs
                </h3>
                <button
                  type="button"
                  onClick={closeForm}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {alertError && (
                <div className="mb-3 sm:mb-4 flex items-start gap-2 p-2 sm:p-3 text-xs sm:text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span>{alertError}</span>
                </div>
              )}
              {alertSuccess && (
                <div className="mb-3 sm:mb-4 flex items-start gap-2 p-2 sm:p-3 text-xs sm:text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span>{alertSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Select Patient</label>
                  <div className="relative">
                    <Search className="w-3 h-3 sm:w-4 sm:h-4 absolute left-2 sm:left-3 top-2.5 sm:top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder={patientSearchLoading ? 'Searching...' : 'Search by name or ID...'}
                      value={globalPatientSearch}
                      onChange={(e) => handleSearchPatients(e.target.value)}
                      className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  {patientOptions.length > 0 && (
                    <div className="mt-2 max-h-40 sm:max-h-48 md:max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
                      {patientOptions.map(patient => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => handleSelectPatient(patient)}
                          className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-0 ${formData.patientId === patient.id ? 'bg-red-50' : ''}`}
                        >
                          <div>
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              {patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()}
                            </span>
                            <div className="text-xs text-gray-500">{patient.hospital_number || patient.phone || patient.id}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {formData.patientId && (
                    <div className="mt-2 text-xs sm:text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                      Selected: {selectedPatient}
                    </div>
                  )}
                </div>

                {/* Fixed form grid - each field now has proper width */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Blood Pressure - Takes full width on mobile, 2 columns on desktop */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Blood Pressure (mmHg)</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Systolic" 
                        value={formData.bloodPressureSystolic} 
                        onChange={(e) => setFormData({...formData, bloodPressureSystolic: e.target.value})} 
                        className="flex-1 min-w-0 px-2 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                        required 
                      />
                      <span className="flex items-center text-sm text-gray-500 flex-shrink-0">/</span>
                      <input 
                        type="number" 
                        placeholder="Diastolic" 
                        value={formData.bloodPressureDiastolic} 
                        onChange={(e) => setFormData({...formData, bloodPressureDiastolic: e.target.value})} 
                        className="flex-1 min-w-0 px-2 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Other fields in 2 columns on tablet+ */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Heart Rate (bpm)</label>
                    <input 
                      type="number" 
                      value={formData.heartRate} 
                      onChange={(e) => setFormData({...formData, heartRate: e.target.value})} 
                      className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Temperature (°C)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={formData.temperature} 
                      onChange={(e) => setFormData({...formData, temperature: e.target.value})} 
                      className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Respiration Rate (/min)</label>
                    <input 
                      type="number" 
                      value={formData.respirationRate} 
                      onChange={(e) => setFormData({...formData, respirationRate: e.target.value})} 
                      className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Oxygen Saturation (%)</label>
                    <input 
                      type="number" 
                      value={formData.oxygenSaturation} 
                      onChange={(e) => setFormData({...formData, oxygenSaturation: e.target.value})} 
                      className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Pain Score (0-10)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="10" 
                      value={formData.painScore} 
                      onChange={(e) => setFormData({...formData, painScore: e.target.value})} 
                      className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Blood Glucose (mg/dL)</label>
                    <input 
                      type="number" 
                      value={formData.bloodGlucose} 
                      onChange={(e) => setFormData({...formData, bloodGlucose: e.target.value})} 
                      className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Level of Consciousness</label>
                    <select 
                      value={formData.consciousness} 
                      onChange={(e) => setFormData({...formData, consciousness: e.target.value})} 
                      className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="Alert">Alert</option>
                      <option value="Voice">Responds to Voice</option>
                      <option value="Pain">Responds to Pain</option>
                      <option value="Unresponsive">Unresponsive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Notes</label>
                  <textarea 
                    value={formData.notes} 
                    onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                    rows="2" 
                    className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" 
                    placeholder="Additional observations..." 
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:pt-4">
                  <button 
                    type="submit" 
                    disabled={loading || !formData.patientId} 
                    className="w-full sm:flex-1 bg-red-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-red-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                  >
                    {loading ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mr-2" /> : null}
                    Record Vital Signs
                  </button>
                  <button 
                    type="button" 
                    onClick={closeForm} 
                    className="w-full sm:flex-1 bg-gray-300 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-gray-400 font-medium text-sm"
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