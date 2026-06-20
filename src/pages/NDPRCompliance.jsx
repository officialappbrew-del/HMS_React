import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Lock,
  Unlock,
  Globe,
  Clock,
  UserCheck,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  Database,
  BarChart3
} from 'lucide-react';
import {
  createConsentRecord,
  updateConsentRecord,
  withdrawConsent,
  submitDataRequest,
  processDataRequest,
  reportDataBreach,
  updateBreachStatus,
  generateComplianceReport,
  auditDataAccess,
  searchComplianceData,
  filterComplianceData
} from '../features/ndprSlice';
import Pagination from '../components/Pagination';

const NDPRCompliance = () => {
  const dispatch = useDispatch();
  const {
    consentRecords,
    dataRequests,
    dataBreaches,
    auditLogs,
    complianceMetrics,
    searchTerm,
    filterBy,
    loading
  } = useSelector(state => state.ndpr);

  const [activeTab, setActiveTab] = useState('overview');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showBreachModal, setShowBreachModal] = useState(false);
  const [showDataRequestModal, setShowDataRequestModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [consentForm, setConsentForm] = useState({
    patientId: '',
    patientName: '',
    consentType: '',
    purpose: '',
    dataCategories: [],
    retentionPeriod: '',
    thirdParties: [],
    consentMethod: 'digital',
    witnessName: ''
  });

  const [breachForm, setBreachForm] = useState({
    breachType: '',
    affectedData: [],
    affectedIndividuals: '',
    breachDate: '',
    discoveryDate: '',
    description: '',
    containmentActions: '',
    impactAssessment: '',
    reportedToNITDA: false,
    notificationSent: false
  });

  const [dataRequestForm, setDataRequestForm] = useState({
    requesterType: 'data_subject',
    requesterName: '',
    requesterContact: '',
    requestType: '',
    dataCategories: [],
    reason: '',
    urgency: 'normal',
    identityVerification: ''
  });

  // NDPR compliance metrics
  const ndprMetrics = {
    overview: {
      consentCompliance: 94.2,
      dataRequestsProcessed: 98.5,
      breachResponseTime: 2.3, // hours
      auditCompliance: 96.8,
      trainingCompletion: 89.3
    },
    consents: {
      totalConsents: 15420,
      activeConsents: 14250,
      expiredConsents: 850,
      withdrawnConsents: 320,
      digitalConsents: 12800,
      paperConsents: 1620
    },
    dataRequests: {
      totalRequests: 245,
      completedRequests: 238,
      pendingRequests: 7,
      averageProcessingTime: 3.2, // days
      accessRequests: 180,
      rectificationRequests: 45,
      erasureRequests: 20
    },
    breaches: {
      totalBreaches: 2,
      containedBreaches: 2,
      averageResponseTime: 1.8, // hours
      reportedToNITDA: 2,
      affectedIndividuals: 45
    }
  };

  // Filter and search logic
  const filteredConsents = consentRecords
    .filter(consent => {
      const matchesSearch = !searchTerm ||
        consent.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consent.patientId?.includes(searchTerm);
      const matchesFilter = filterBy === 'all' || consent.status === filterBy || consent.consentType === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredRequests = dataRequests
    .filter(request => {
      const matchesSearch = !searchTerm ||
        request.requesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || request.status === filterBy || request.requestType === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginatedItems = activeTab === 'consents' ? filteredConsents : filteredRequests;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateConsent = (e) => {
    e.preventDefault();
    dispatch(createConsentRecord(consentForm));
    setConsentForm({
      patientId: '',
      patientName: '',
      consentType: '',
      purpose: '',
      dataCategories: [],
      retentionPeriod: '',
      thirdParties: [],
      consentMethod: 'digital',
      witnessName: ''
    });
    setShowConsentModal(false);
  };

  const handleReportBreach = (e) => {
    e.preventDefault();
    dispatch(reportDataBreach(breachForm));
    setBreachForm({
      breachType: '',
      affectedData: [],
      affectedIndividuals: '',
      breachDate: '',
      discoveryDate: '',
      description: '',
      containmentActions: '',
      impactAssessment: '',
      reportedToNITDA: false,
      notificationSent: false
    });
    setShowBreachModal(false);
  };

  const handleSubmitDataRequest = (e) => {
    e.preventDefault();
    dispatch(submitDataRequest(dataRequestForm));
    setDataRequestForm({
      requesterType: 'data_subject',
      requesterName: '',
      requesterContact: '',
      requestType: '',
      dataCategories: [],
      reason: '',
      urgency: 'normal',
      identityVerification: ''
    });
    setShowDataRequestModal(false);
  };

  const handleProcessRequest = (requestId, action) => {
    dispatch(processDataRequest({ requestId, action }));
  };

  const getConsentStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      case 'withdrawn': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBreachSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeConsents = consentRecords.filter(c => c.status === 'active').length;
  const pendingRequests = dataRequests.filter(r => r.status === 'pending').length;
  const openBreaches = dataBreaches.filter(b => b.status !== 'resolved').length;
  const complianceScore = ndprMetrics.overview.consentCompliance;

  return (
    <div className="ndpr-compliance p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-500" />
          NDPR Compliance Automation
        </h1>
        <p className="text-gray-600 mt-2">Nigeria Data Protection Regulation compliance management</p>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Compliance Score</p>
              <p className="text-3xl font-bold mt-2">{complianceScore}%</p>
              <div className="flex items-center mt-1">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">Above target</span>
              </div>
            </div>
            <Shield className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Consents</p>
              <p className="text-3xl font-bold mt-2">{activeConsents}</p>
              <div className="flex items-center mt-1">
                <UserCheck className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-sm text-blue-600">Digital: 83%</span>
              </div>
            </div>
            <FileText className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Requests</p>
              <p className="text-3xl font-bold mt-2">{pendingRequests}</p>
              <div className="flex items-center mt-1">
                <Clock className="w-4 h-4 text-yellow-600 mr-1" />
                <span className="text-sm text-yellow-600">Avg: 3.2 days</span>
              </div>
            </div>
            <AlertTriangle className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Open Breaches</p>
              <p className="text-3xl font-bold mt-2">{openBreaches}</p>
              <div className="flex items-center mt-1">
                <AlertCircle className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">All contained</span>
              </div>
            </div>
            <XCircle className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'consents', label: 'Consent Management', icon: FileText },
            { id: 'data_requests', label: 'Data Subject Rights', icon: Users },
            { id: 'breaches', label: 'Data Breaches', icon: AlertTriangle },
            { id: 'audit', label: 'Audit Logs', icon: Eye },
            { id: 'reports', label: 'Compliance Reports', icon: Download }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
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
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Compliance Metrics */}
              <div>
                <h3 className="text-lg font-semibold mb-4">NDPR Compliance Metrics</h3>
                <div className="space-y-4">
                  {[
                    { metric: 'Consent Compliance', value: ndprMetrics.overview.consentCompliance, target: 95 },
                    { metric: 'Data Request Processing', value: ndprMetrics.overview.dataRequestsProcessed, target: 95 },
                    { metric: 'Breach Response Time', value: ndprMetrics.overview.breachResponseTime, target: 72, unit: 'hrs' },
                    { metric: 'Audit Compliance', value: ndprMetrics.overview.auditCompliance, target: 95 },
                    { metric: 'Staff Training', value: ndprMetrics.overview.trainingCompletion, target: 90 }
                  ].map(metric => (
                    <div key={metric.metric} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{metric.metric}</h4>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          metric.value >= metric.target ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {metric.value >= metric.target ? 'On Target' : 'Below Target'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold">{metric.value}{metric.unit || '%'}</p>
                          <p className="text-sm text-gray-600">Target: {metric.target}{metric.unit || '%'}</p>
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Subject Rights Overview */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Data Subject Rights Processing</h3>
                <div className="space-y-4">
                  {[
                    { right: 'Right to Access', requests: ndprMetrics.dataRequests.accessRequests, avgTime: 2.1 },
                    { right: 'Right to Rectification', requests: ndprMetrics.dataRequests.rectificationRequests, avgTime: 1.8 },
                    { right: 'Right to Erasure', requests: ndprMetrics.dataRequests.erasureRequests, avgTime: 5.2 },
                    { right: 'Right to Object', requests: 8, avgTime: 3.5 },
                    { right: 'Data Portability', requests: 12, avgTime: 4.1 }
                  ].map(right => (
                    <div key={right.right} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{right.right}</h4>
                        <span className="text-sm text-gray-600">{right.requests} requests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Avg. processing: {right.avgTime} days</span>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-sm text-green-600">Compliant</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Recent Compliance Activity</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {[
                    { action: 'Consent granted', subject: 'John Adebayo', time: '2 hours ago', type: 'consent' },
                    { action: 'Data access request processed', subject: 'Mary Johnson', time: '4 hours ago', type: 'request' },
                    { action: 'Monthly compliance audit completed', subject: 'System', time: '1 day ago', type: 'audit' },
                    { action: 'Data breach notification sent', subject: 'NITDA', time: '2 days ago', type: 'breach' },
                    { action: 'Consent withdrawn', subject: 'David Okon', time: '3 days ago', type: 'consent' }
                  ].map((activity, index) => (
                    <div key={index} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        {activity.type === 'consent' && <FileText className="w-5 h-5 text-blue-500 mr-3" />}
                        {activity.type === 'request' && <Users className="w-5 h-5 text-green-500 mr-3" />}
                        {activity.type === 'audit' && <Eye className="w-5 h-5 text-purple-500 mr-3" />}
                        {activity.type === 'breach' && <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />}
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.subject}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'consents' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search consents..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchComplianceData(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterComplianceData(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Consents</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="withdrawn">Withdrawn</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowConsentModal(true)}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Consent
                </button>
              </div>
            </div>

            {/* Consents Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consent Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(consent => (
                    <tr key={consent.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div>
                          <p className="font-medium">{consent.patientName}</p>
                          <p className="text-gray-500">ID: {consent.patientId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {consent.consentType.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {consent.purpose}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getConsentStatusColor(consent.status)}`}>
                          {consent.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {consent.expiryDate ? new Date(consent.expiryDate).toLocaleDateString('en-NG') : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-900" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                          {consent.status === 'active' && (
                            <button className="text-red-600 hover:text-red-900" title="Withdraw Consent">
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'data_requests' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchComplianceData(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterComplianceData(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowDataRequestModal(true)}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </button>
              </div>
            </div>

            {/* Data Requests Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processing Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(request => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div>
                          <p className="font-medium">{request.requesterName}</p>
                          <p className="text-gray-500 capitalize">{request.requesterType.replace('_', ' ')}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {request.requestType.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRequestStatusColor(request.status)}`}>
                          {request.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.processingTime || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleProcessRequest(request.id, 'approve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleProcessRequest(request.id, 'reject')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button className="text-blue-600 hover:text-blue-900" title="View Details">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'breaches' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Data Breach Management</h3>
              <button
                onClick={() => setShowBreachModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Breach
              </button>
            </div>

            <div className="space-y-4">
              {dataBreaches.map(breach => (
                <div key={breach.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{breach.breachType} Breach</h4>
                      <p className="text-sm text-gray-600">Reported: {new Date(breach.discoveryDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getBreachSeverityColor(breach.severity)}`}>
                        {breach.severity}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        breach.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {breach.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Affected Individuals</p>
                      <p className="text-sm font-medium">{breach.affectedIndividuals}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Response Time</p>
                      <p className="text-sm">{breach.responseTime} hours</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">NITDA Notified</p>
                      <p className="text-sm">{breach.reportedToNITDA ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Notifications Sent</p>
                      <p className="text-sm">{breach.notificationsSent || 0}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Containment Actions</p>
                    <p className="text-sm">{breach.containmentActions}</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      View Full Report
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                      Update Status
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                      Download Evidence
                    </button>
                  </div>
                </div>
              ))}

              {dataBreaches.length === 0 && (
                <p className="text-gray-500 text-center py-8">No data breaches reported</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Data Access Audit Logs</h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-gray-600">
                          User: {log.user} | Patient: {log.patientId} | Data: {log.dataAccessed}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString('en-NG')}</p>
                      <p className="text-xs text-gray-400">{log.ipAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Compliance Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report Types */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4">Generate Reports</h4>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-800">Consent Audit Report</p>
                        <p className="text-sm text-blue-600">Monthly consent compliance</p>
                      </div>
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                  </button>

                  <button className="w-full p-3 bg-green-50 border border-green-200 rounded hover:bg-green-100 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800">Data Subject Rights Report</p>
                        <p className="text-sm text-green-600">Request processing metrics</p>
                      </div>
                      <Download className="w-5 h-5 text-green-600" />
                    </div>
                  </button>

                  <button className="w-full p-3 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-purple-800">Data Breach Report</p>
                        <p className="text-sm text-purple-600">Incident response analysis</p>
                      </div>
                      <Download className="w-5 h-5 text-purple-600" />
                    </div>
                  </button>

                  <button className="w-full p-3 bg-orange-50 border border-orange-200 rounded hover:bg-orange-100 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-orange-800">Annual NDPR Compliance</p>
                        <p className="text-sm text-orange-600">Comprehensive compliance review</p>
                      </div>
                      <Download className="w-5 h-5 text-orange-600" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Compliance Checklist */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4">NDPR Compliance Checklist</h4>
                <div className="space-y-3">
                  {[
                    { item: 'Data Protection Officer appointed', status: true },
                    { item: 'Privacy policy published', status: true },
                    { item: 'Consent management system', status: true },
                    { item: 'Data breach response plan', status: true },
                    { item: 'Staff training program', status: true },
                    { item: 'Data mapping completed', status: true },
                    { item: 'Third-party assessments', status: false },
                    { item: 'Cross-border transfer agreements', status: true }
                  ].map(check => (
                    <div key={check.item} className="flex items-center justify-between">
                      <span className="text-sm">{check.item}</span>
                      {check.status ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'consents' || activeTab === 'data_requests') && paginatedItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(paginatedItems.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Record Patient Consent
              </h3>
              <form onSubmit={handleCreateConsent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
                    <input
                      type="text"
                      value={consentForm.patientId}
                      onChange={(e) => setConsentForm({...consentForm, patientId: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                    <input
                      type="text"
                      value={consentForm.patientName}
                      onChange={(e) => setConsentForm({...consentForm, patientName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consent Type *</label>
                    <select
                      value={consentForm.consentType}
                      onChange={(e) => setConsentForm({...consentForm, consentType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select type...</option>
                      <option value="treatment">Treatment & Care</option>
                      <option value="data_processing">Data Processing</option>
                      <option value="research">Research Participation</option>
                      <option value="marketing">Marketing Communications</option>
                      <option value="third_party">Third Party Sharing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consent Method *</label>
                    <select
                      value={consentForm.consentMethod}
                      onChange={(e) => setConsentForm({...consentForm, consentMethod: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="digital">Digital Signature</option>
                      <option value="paper">Paper Form</option>
                      <option value="verbal">Verbal Consent</option>
                      <option value="implied">Implied Consent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose & Scope *</label>
                  <textarea
                    value={consentForm.purpose}
                    onChange={(e) => setConsentForm({...consentForm, purpose: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the purpose and scope of data processing..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period</label>
                    <select
                      value={consentForm.retentionPeriod}
                      onChange={(e) => setConsentForm({...consentForm, retentionPeriod: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select period...</option>
                      <option value="treatment_period">During Treatment</option>
                      <option value="5_years">5 Years</option>
                      <option value="10_years">10 Years</option>
                      <option value="indefinite">Indefinite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Witness Name</label>
                    <input
                      type="text"
                      value={consentForm.witnessName}
                      onChange={(e) => setConsentForm({...consentForm, witnessName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="For paper consents"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Record Consent
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConsentModal(false)}
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

      {/* Data Breach Modal */}
      {showBreachModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Report Data Breach
              </h3>
              <form onSubmit={handleReportBreach} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Breach Type *</label>
                    <select
                      value={breachForm.breachType}
                      onChange={(e) => setBreachForm({...breachForm, breachType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Select type...</option>
                      <option value="unauthorized_access">Unauthorized Access</option>
                      <option value="data_loss">Data Loss/Theft</option>
                      <option value="hacking">Hacking/Cyber Attack</option>
                      <option value="physical_theft">Physical Theft</option>
                      <option value="accidental_disclosure">Accidental Disclosure</option>
                      <option value="system_failure">System Failure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Affected Individuals *</label>
                    <input
                      type="number"
                      value={breachForm.affectedIndividuals}
                      onChange={(e) => setBreachForm({...breachForm, affectedIndividuals: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Number of people affected"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Breach Date *</label>
                    <input
                      type="datetime-local"
                      value={breachForm.breachDate}
                      onChange={(e) => setBreachForm({...breachForm, breachDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discovery Date *</label>
                    <input
                      type="datetime-local"
                      value={breachForm.discoveryDate}
                      onChange={(e) => setBreachForm({...breachForm, discoveryDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Affected Data Categories *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Personal Information', 'Medical Records', 'Financial Data', 'Contact Details', 'Identification', 'Biometric Data'].map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={breachForm.affectedData?.includes(category)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...(breachForm.affectedData || []), category]
                              : (breachForm.affectedData || []).filter(c => c !== category);
                            setBreachForm({...breachForm, affectedData: updated});
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description of Breach *</label>
                  <textarea
                    value={breachForm.description}
                    onChange={(e) => setBreachForm({...breachForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Detailed description of what happened..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Containment Actions Taken *</label>
                  <textarea
                    value={breachForm.containmentActions}
                    onChange={(e) => setBreachForm({...breachForm, containmentActions: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Steps taken to contain the breach..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Impact Assessment</label>
                  <textarea
                    value={breachForm.impactAssessment}
                    onChange={(e) => setBreachForm({...breachForm, impactAssessment: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Assessment of potential harm to individuals..."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={breachForm.reportedToNITDA}
                      onChange={(e) => setBreachForm({...breachForm, reportedToNITDA: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Reported to NITDA within 72 hours</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={breachForm.notificationSent}
                      onChange={(e) => setBreachForm({...breachForm, notificationSent: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Affected individuals notified</span>
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
                  >
                    Report Breach
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBreachModal(false)}
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

      {/* Data Request Modal */}
      {showDataRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Submit Data Subject Request
              </h3>
              <form onSubmit={handleSubmitDataRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requester Type *</label>
                  <select
                    value={dataRequestForm.requesterType}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, requesterType: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="data_subject">Data Subject</option>
                    <option value="legal_representative">Legal Representative</option>
                    <option value="authorized_person">Authorized Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requester Name *</label>
                  <input
                    type="text"
                    value={dataRequestForm.requesterName}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, requesterName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Information *</label>
                  <input
                    type="text"
                    value={dataRequestForm.requesterContact}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, requesterContact: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Email or phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Type *</label>
                  <select
                    value={dataRequestForm.requestType}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, requestType: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select request type...</option>
                    <option value="access">Right to Access</option>
                    <option value="rectification">Right to Rectification</option>
                    <option value="erasure">Right to Erasure</option>
                    <option value="restriction">Right to Restriction</option>
                    <option value="portability">Right to Data Portability</option>
                    <option value="objection">Right to Object</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Request *</label>
                  <textarea
                    value={dataRequestForm.reason}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, reason: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Please explain why you are making this request..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                  <select
                    value={dataRequestForm.urgency}
                    onChange={(e) => setDataRequestForm({...dataRequestForm, urgency: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="normal">Normal (30 days)</option>
                    <option value="urgent">Urgent (15 days)</option>
                    <option value="critical">Critical (3 days)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDataRequestModal(false)}
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

export default NDPRCompliance;