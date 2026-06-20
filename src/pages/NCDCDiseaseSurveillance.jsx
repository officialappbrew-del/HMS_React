import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Activity,
  MapPin,
  Users,
  TrendingUp,
  FileText,
  Send,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Globe,
  Shield,
  Zap,
  TestTube,
  UserCheck,
  Bell
} from 'lucide-react';
import {
  reportDisease,
  activateEpidemicMode,
  deactivateEpidemicMode,
  submitToNCDC,
  createContactTrace,
  updateContactTrace,
  generateEpidemicReport,
  searchSurveillance,
  filterSurveillance,
  sortSurveillance
} from '../features/ncdcSlice';
import Pagination from '../components/Pagination';

const NCDCDiseaseSurveillance = () => {
  const dispatch = useDispatch();
  const {
    diseaseReports,
    epidemicMode,
    contactTraces,
    epidemicReports,
    stats,
    searchTerm,
    filterBy,
    sortBy,
    loading
  } = useSelector(state => state.ncdc);

  const [activeTab, setActiveTab] = useState('reports');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEpidemicModal, setShowEpidemicModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [reportForm, setReportForm] = useState({
    disease: '',
    patientId: '',
    patientName: '',
    age: '',
    gender: '',
    location: '',
    symptoms: [],
    diagnosisDate: '',
    reportingDate: new Date().toISOString().split('T')[0],
    severity: 'suspected',
    labConfirmed: false,
    outcome: 'active',
    reporter: '',
    contactInfo: ''
  });

  const [epidemicForm, setEpidemicForm] = useState({
    disease: '',
    affectedArea: '',
    caseCount: '',
    severity: 'moderate',
    responseLevel: 'local',
    resources: [],
    containmentMeasures: []
  });

  // Nigerian notifiable diseases
  const notifiableDiseases = [
    'Cholera', 'Lassa Fever', 'Meningitis', 'Yellow Fever', 'Monkey Pox',
    'COVID-19', 'Ebola', 'Measles', 'Polio', 'Diphtheria', 'Pertussis',
    'Tetanus', 'Rabies', 'Plague', 'Typhoid Fever', 'Hepatitis A',
    'Malaria (Severe)', 'Tuberculosis (MDR)', 'HIV/AIDS (Advanced)'
  ];

  // Filter and search logic
  const filteredReports = diseaseReports
    .filter(report => {
      const matchesSearch = !searchTerm ||
        report.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.disease?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patientId?.includes(searchTerm);
      const matchesFilter = filterBy === 'all' || report.severity === filterBy || report.outcome === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.reportingDate) - new Date(a.reportingDate);
      if (sortBy === 'disease') return a.disease.localeCompare(b.disease);
      if (sortBy === 'severity') return a.severity.localeCompare(b.severity);
      return 0;
    });

  const filteredContacts = contactTraces
    .filter(contact => {
      const matchesSearch = !searchTerm ||
        contact.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.contactName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || contact.status === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginatedItems = activeTab === 'reports' ? filteredReports : filteredContacts;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateReport = (e) => {
    e.preventDefault();
    dispatch(reportDisease(reportForm));
    setReportForm({
      disease: '',
      patientId: '',
      patientName: '',
      age: '',
      gender: '',
      location: '',
      symptoms: [],
      diagnosisDate: '',
      reportingDate: new Date().toISOString().split('T')[0],
      severity: 'suspected',
      labConfirmed: false,
      outcome: 'active',
      reporter: '',
      contactInfo: ''
    });
    setShowReportModal(false);
  };

  const handleActivateEpidemic = (e) => {
    e.preventDefault();
    dispatch(activateEpidemicMode(epidemicForm));
    setEpidemicForm({
      disease: '',
      affectedArea: '',
      caseCount: '',
      severity: 'moderate',
      responseLevel: 'local',
      resources: [],
      containmentMeasures: []
    });
    setShowEpidemicModal(false);
  };

  const handleSubmitToNCDC = (reportId) => {
    dispatch(submitToNCDC({ reportId }));
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'suspected': return 'bg-yellow-100 text-yellow-800';
      case 'probable': return 'bg-orange-100 text-orange-800';
      case 'confirmed': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'recovered': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'fatal': return 'bg-gray-100 text-gray-800';
      case 'transferred': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'acknowledged': return 'bg-purple-100 text-purple-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeEpidemic = epidemicMode.isActive;
  const pendingReports = diseaseReports.filter(r => r.status === 'reported').length;
  const confirmedCases = diseaseReports.filter(r => r.severity === 'confirmed').length;

  return (
    <div className="ncdc-surveillance p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-red-500" />
              NCDC Disease Surveillance
            </h1>
            <p className="text-gray-600 mt-2">Nigeria Centre for Disease Control - Epidemic Management System</p>
          </div>

          {/* Epidemic Mode Indicator */}
          {activeEpidemic && (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4 flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3 animate-pulse" />
              <div>
                <h3 className="font-semibold text-red-800">EPIDEMIC MODE ACTIVE</h3>
                <p className="text-sm text-red-600">
                  {epidemicMode.disease} outbreak in {epidemicMode.affectedArea}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Reports</p>
              <p className="text-3xl font-bold mt-2">{stats.totalReports}</p>
            </div>
            <FileText className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Confirmed Cases</p>
              <p className="text-3xl font-bold mt-2">{confirmedCases}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Reports</p>
              <p className="text-3xl font-bold mt-2">{pendingReports}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Contacts</p>
              <p className="text-3xl font-bold mt-2">{stats.activeContacts}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'reports', label: 'Disease Reports', icon: FileText },
            { id: 'contacts', label: 'Contact Tracing', icon: Users },
            { id: 'epidemic', label: 'Epidemic Management', icon: AlertTriangle },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'laboratory', label: 'Laboratory', icon: TestTube }
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
        {activeTab === 'reports' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchSurveillance(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Severity</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterSurveillance(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Reports</option>
                  <option value="suspected">Suspected</option>
                  <option value="probable">Probable</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="recovered">Recovered</option>
                  <option value="fatal">Fatal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(sortSurveillance(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="date">Date</option>
                  <option value="disease">Disease</option>
                  <option value="severity">Severity</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Report Case
                </button>
              </div>
            </div>

            {/* Urgent Cases Alert */}
            {confirmedCases > 0 && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-red-800">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Confirmed Cases ({confirmedCases})
                </h3>
                <div className="space-y-2">
                  {diseaseReports.filter(r => r.severity === 'confirmed').slice(0, 3).map(report => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium">{report.disease} - {report.patientName}</p>
                        <p className="text-sm text-gray-600">
                          Reported: {new Date(report.reportingDate).toLocaleDateString('en-NG')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Location: {report.location}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSubmitToNCDC(report.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                        >
                          Submit to NCDC
                        </button>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(report => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div>
                          <p className="font-medium">{report.patientName}</p>
                          <p className="text-gray-500">ID: {report.patientId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.disease}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(report.severity)}`}>
                          {report.severity}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getOutcomeColor(report.outcome)}`}>
                          {report.outcome}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.location}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.reportingDate).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Contact Tracing</h3>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </button>
            </div>

            <div className="space-y-4">
              {contactTraces.map(contact => (
                <div key={contact.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{contact.contactName}</h4>
                      <p className="text-sm text-gray-600">
                        Related to: {contact.patientName} ({contact.disease})
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm">{contact.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm">{contact.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Contact</p>
                      <p className="text-sm">{new Date(contact.lastContactDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Follow-up Date</p>
                      <p className="text-sm">{new Date(contact.followUpDate).toLocaleDateString('en-NG')}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                      Update Status
                    </button>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {contactTraces.length === 0 && (
                <p className="text-gray-500 text-center py-8">No contact traces recorded yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'epidemic' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Epidemic Management</h3>
              {!activeEpidemic && (
                <button
                  onClick={() => setShowEpidemicModal(true)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Activate Epidemic Mode
                </button>
              )}
            </div>

            {activeEpidemic ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-red-800">EPIDEMIC MODE ACTIVE</h4>
                  <button
                    onClick={() => dispatch(deactivateEpidemicMode())}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Deactivate
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded border">
                    <h5 className="font-medium mb-2">Disease</h5>
                    <p className="text-lg">{epidemicMode.disease}</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h5 className="font-medium mb-2">Affected Area</h5>
                    <p className="text-lg">{epidemicMode.affectedArea}</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h5 className="font-medium mb-2">Response Level</h5>
                    <p className="text-lg capitalize">{epidemicMode.responseLevel}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h5 className="font-medium mb-3">Containment Measures</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {epidemicMode.containmentMeasures.map((measure, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <p className="text-sm">{measure}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">No Active Epidemic</h4>
                <p className="text-gray-500">Epidemic mode is currently inactive</p>
              </div>
            )}

            {/* Epidemic History */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Epidemic History</h4>
              <div className="space-y-4">
                {epidemicReports.map(report => (
                  <div key={report.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">{report.disease} Outbreak</h5>
                      <span className="text-sm text-gray-500">
                        {new Date(report.startDate).toLocaleDateString('en-NG')} - {new Date(report.endDate).toLocaleDateString('en-NG')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Total Cases</p>
                        <p className="text-sm font-medium">{report.totalCases}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fatalities</p>
                        <p className="text-sm font-medium">{report.fatalities}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Recovered</p>
                        <p className="text-sm font-medium">{report.recovered}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <span className="text-sm font-medium text-green-600">Contained</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Disease Surveillance Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Disease Distribution */}
              <div>
                <h4 className="font-medium mb-3">Disease Distribution</h4>
                <div className="space-y-3">
                  {notifiableDiseases.slice(0, 8).map(disease => {
                    const count = diseaseReports.filter(r => r.disease === disease).length;
                    const percentage = diseaseReports.length > 0 ? Math.round((count / diseaseReports.length) * 100) : 0;

                    return (
                      <div key={disease} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{disease}</span>
                          <span className="text-sm text-gray-600">{count} cases ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Geographic Distribution */}
              <div>
                <h4 className="font-medium mb-3">Geographic Distribution</h4>
                <div className="space-y-3">
                  {['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan'].map(location => {
                    const count = diseaseReports.filter(r => r.location === location).length;
                    return (
                      <div key={location} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{location}</span>
                          <span className="text-sm text-gray-600">{count} cases</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'laboratory' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Laboratory Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sample Collection */}
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-medium mb-4 flex items-center">
                  <TestTube className="w-5 h-5 mr-2" />
                  Sample Collection
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Blood Sample</p>
                    <p className="text-xs text-gray-600">For serological testing</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Throat Swab</p>
                    <p className="text-xs text-gray-600">For PCR testing</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Stool Sample</p>
                    <p className="text-xs text-gray-600">For cholera confirmation</p>
                  </div>
                </div>
              </div>

              {/* Reference Labs */}
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-medium mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  NCDC Reference Labs
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Lagos University Teaching Hospital</p>
                    <p className="text-xs text-gray-600">Virology & Molecular Biology</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Nigerian Institute of Medical Research</p>
                    <p className="text-xs text-gray-600">Epidemiology & Public Health</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium">Asokoro District Hospital</p>
                    <p className="text-xs text-gray-600">Emergency Response Lab</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'reports' || activeTab === 'contacts') && paginatedItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(paginatedItems.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Disease Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Report Notifiable Disease
              </h3>
              <form onSubmit={handleCreateReport} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Disease *</label>
                    <select
                      value={reportForm.disease}
                      onChange={(e) => setReportForm({...reportForm, disease: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Select disease...</option>
                      {notifiableDiseases.map(disease => (
                        <option key={disease} value={disease}>{disease}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Severity *</label>
                    <select
                      value={reportForm.severity}
                      onChange={(e) => setReportForm({...reportForm, severity: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="suspected">Suspected</option>
                      <option value="probable">Probable</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                    <input
                      type="text"
                      value={reportForm.patientName}
                      onChange={(e) => setReportForm({...reportForm, patientName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                    <input
                      type="text"
                      value={reportForm.patientId}
                      onChange={(e) => setReportForm({...reportForm, patientId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={reportForm.age}
                      onChange={(e) => setReportForm({...reportForm, age: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={reportForm.gender}
                      onChange={(e) => setReportForm({...reportForm, gender: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select gender...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      value={reportForm.location}
                      onChange={(e) => setReportForm({...reportForm, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="City, State"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis Date</label>
                    <input
                      type="date"
                      value={reportForm.diagnosisDate}
                      onChange={(e) => setReportForm({...reportForm, diagnosisDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Date *</label>
                    <input
                      type="date"
                      value={reportForm.reportingDate}
                      onChange={(e) => setReportForm({...reportForm, reportingDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
                    <select
                      value={reportForm.outcome}
                      onChange={(e) => setReportForm({...reportForm, outcome: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="active">Active</option>
                      <option value="recovered">Recovered</option>
                      <option value="fatal">Fatal</option>
                      <option value="transferred">Transferred</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="labConfirmed"
                      checked={reportForm.labConfirmed}
                      onChange={(e) => setReportForm({...reportForm, labConfirmed: e.target.checked})}
                      className="mr-2"
                    />
                    <label htmlFor="labConfirmed" className="text-sm font-medium text-gray-700">
                      Laboratory Confirmed
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reporter Name</label>
                  <input
                    type="text"
                    value={reportForm.reporter}
                    onChange={(e) => setReportForm({...reportForm, reporter: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
                  >
                    Submit Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
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

      {/* Epidemic Mode Modal */}
      {showEpidemicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Activate Epidemic Mode
              </h3>
              <form onSubmit={handleActivateEpidemic} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disease *</label>
                  <select
                    value={epidemicForm.disease}
                    onChange={(e) => setEpidemicForm({...epidemicForm, disease: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select disease...</option>
                    {notifiableDiseases.map(disease => (
                      <option key={disease} value={disease}>{disease}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Affected Area *</label>
                  <input
                    type="text"
                    value={epidemicForm.affectedArea}
                    onChange={(e) => setEpidemicForm({...epidemicForm, affectedArea: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="City, State or Region"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Case Count</label>
                  <input
                    type="number"
                    value={epidemicForm.caseCount}
                    onChange={(e) => setEpidemicForm({...epidemicForm, caseCount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                  <select
                    value={epidemicForm.severity}
                    onChange={(e) => setEpidemicForm({...epidemicForm, severity: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="low">Low</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response Level</label>
                  <select
                    value={epidemicForm.responseLevel}
                    onChange={(e) => setEpidemicForm({...epidemicForm, responseLevel: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="local">Local</option>
                    <option value="state">State</option>
                    <option value="national">National</option>
                    <option value="international">International</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
                  >
                    Activate Epidemic Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEpidemicModal(false)}
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

export default NCDCDiseaseSurveillance;