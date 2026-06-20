import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  Award,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  createAudit,
  updateAudit,
  scheduleAudit,
  completeAudit,
  createQualityIndicator,
  updateQualityIndicator,
  generateAuditReport,
  schedulePeerReview,
  createMortalityReview,
  updateComplianceScore,
  searchAudits,
  filterAudits
} from '../features/auditSlice';
import Pagination from '../components/Pagination';

const ClinicalAudit = () => {
  const dispatch = useDispatch();
  const {
    audits,
    qualityIndicators,
    peerReviews,
    mortalityReviews,
    complianceScores,
    auditReports,
    searchTerm,
    filterBy,
    loading
  } = useSelector(state => state.audit);

  const [activeTab, setActiveTab] = useState('audits');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showIndicatorModal, setShowIndicatorModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [auditForm, setAuditForm] = useState({
    title: '',
    type: 'clinical',
    department: '',
    auditor: '',
    scheduledDate: '',
    checklist: [],
    description: ''
  });

  const [indicatorForm, setIndicatorForm] = useState({
    name: '',
    category: '',
    target: '',
    current: '',
    unit: '',
    department: '',
    frequency: 'monthly',
    description: ''
  });

  // Nigerian healthcare quality standards
  const qualityStandards = {
    clinical: {
      title: 'Clinical Quality Indicators',
      indicators: [
        { name: 'Hospital-acquired infection rate', target: '<2.5%', current: '1.8%', status: 'good' },
        { name: 'Medication error rate', target: '<1%', current: '0.6%', status: 'good' },
        { name: 'Readmission rate (28-day)', target: '<5%', current: '3.2%', status: 'good' },
        { name: 'Patient satisfaction score', target: '>85%', current: '92%', status: 'excellent' },
        { name: 'Average length of stay', target: '<4.5 days', current: '3.8 days', status: 'good' },
        { name: 'Mortality rate', target: '<2%', current: '1.4%', status: 'good' }
      ]
    },
    safety: {
      title: 'Patient Safety Indicators',
      indicators: [
        { name: 'Pressure ulcer incidence', target: '<2%', current: '1.1%', status: 'good' },
        { name: 'Patient fall incidents', target: '<1%', current: '0.8%', status: 'good' },
        { name: 'Surgical site infections', target: '<1.5%', current: '0.9%', status: 'good' },
        { name: 'Blood transfusion reactions', target: '<0.1%', current: '0.05%', status: 'excellent' },
        { name: 'Ventilator-associated pneumonia', target: '<5%', current: '2.3%', status: 'good' }
      ]
    },
    efficiency: {
      title: 'Operational Efficiency',
      indicators: [
        { name: 'Bed occupancy rate', target: '75-85%', current: '82%', status: 'good' },
        { name: 'Average wait time', target: '<30 min', current: '23 min', status: 'good' },
        { name: 'Staff productivity', target: '>90%', current: '94%', status: 'excellent' },
        { name: 'Equipment utilization', target: '>80%', current: '87%', status: 'good' },
        { name: 'Cost per patient day', target: '<₦25,000', current: '₦18,500', status: 'excellent' }
      ]
    }
  };

  // Filter and search logic
  const filteredAudits = audits
    .filter(audit => {
      const matchesSearch = !searchTerm ||
        audit.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.department?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || audit.status === filterBy || audit.type === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

  const filteredIndicators = qualityIndicators
    .filter(indicator => {
      const matchesSearch = !searchTerm ||
        indicator.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        indicator.category?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const paginatedItems = activeTab === 'audits' ? filteredAudits : filteredIndicators;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateAudit = (e) => {
    e.preventDefault();
    dispatch(createAudit(auditForm));
    setAuditForm({
      title: '',
      type: 'clinical',
      department: '',
      auditor: '',
      scheduledDate: '',
      checklist: [],
      description: ''
    });
    setShowAuditModal(false);
  };

  const handleCreateIndicator = (e) => {
    e.preventDefault();
    dispatch(createQualityIndicator(indicatorForm));
    setIndicatorForm({
      name: '',
      category: '',
      target: '',
      current: '',
      unit: '',
      department: '',
      frequency: 'monthly',
      description: ''
    });
    setShowIndicatorModal(false);
  };

  const handleCompleteAudit = (auditId) => {
    dispatch(completeAudit({ auditId }));
  };

  const handleSchedulePeerReview = (auditId) => {
    dispatch(schedulePeerReview({ auditId }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIndicatorStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (score) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-blue-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallCompliance = complianceScores.overall || 89.5;
  const pendingAudits = audits.filter(a => a.status === 'scheduled').length;
  const completedAudits = audits.filter(a => a.status === 'completed').length;
  const criticalIndicators = qualityIndicators.filter(i => i.status === 'critical').length;

  return (
    <div className="clinical-audit p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <ClipboardCheck className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-500" />
          Clinical Audit & Quality Assurance
        </h1>
        <p className="text-gray-600 mt-2">Healthcare quality improvement and clinical governance</p>
      </div>

      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overall Compliance</p>
              <p className="text-3xl font-bold mt-2">{overallCompliance}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+2.3% from last month</span>
              </div>
            </div>
            <Award className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed Audits</p>
              <p className="text-3xl font-bold mt-2">{completedAudits}</p>
              <div className="flex items-center mt-1">
                <CheckCircle className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-sm text-blue-600">This month</span>
              </div>
            </div>
            <FileText className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Audits</p>
              <p className="text-3xl font-bold mt-2">{pendingAudits}</p>
              <div className="flex items-center mt-1">
                <Calendar className="w-4 h-4 text-yellow-600 mr-1" />
                <span className="text-sm text-yellow-600">Scheduled</span>
              </div>
            </div>
            <AlertTriangle className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Critical Indicators</p>
              <p className="text-3xl font-bold mt-2">{criticalIndicators}</p>
              <div className="flex items-center mt-1">
                <AlertCircle className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">Require attention</span>
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
            { id: 'audits', label: 'Clinical Audits', icon: ClipboardCheck },
            { id: 'indicators', label: 'Quality Indicators', icon: BarChart3 },
            { id: 'peer_review', label: 'Peer Review', icon: Users },
            { id: 'mortality', label: 'M&M Review', icon: FileText },
            { id: 'compliance', label: 'Compliance', icon: Target }
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
        {activeTab === 'audits' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search audits..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchAudits(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterAudits(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Audits</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                  <option value="clinical">Clinical</option>
                  <option value="administrative">Administrative</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowAuditModal(true)}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Audit
                </button>
              </div>

              <div className="flex items-end">
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Audits Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audit Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auditor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(audit => (
                    <tr key={audit.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {audit.title}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {audit.type}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {audit.department}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {audit.auditor}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(audit.scheduledDate).toLocaleDateString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(audit.status)}`}>
                          {audit.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {audit.status === 'scheduled' && (
                            <button
                              onClick={() => handleCompleteAudit(audit.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleSchedulePeerReview(audit.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Peer Review
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

        {activeTab === 'indicators' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Quality Indicators Dashboard</h3>
              <button
                onClick={() => setShowIndicatorModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Indicator
              </button>
            </div>

            {/* Quality Standards Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {Object.entries(qualityStandards).map(([categoryKey, category]) => {
                const categoryIndicators = category.indicators;
                const excellentCount = categoryIndicators.filter(i => i.status === 'excellent').length;
                const goodCount = categoryIndicators.filter(i => i.status === 'good').length;
                const totalCount = categoryIndicators.length;

                return (
                  <div key={categoryKey} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-medium mb-4">{category.title}</h4>
                    <div className="space-y-3">
                      {categoryIndicators.map((indicator, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{indicator.name}</p>
                            <p className="text-xs text-gray-600">Target: {indicator.target}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{indicator.current}</p>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getIndicatorStatusColor(indicator.status)}`}>
                              {indicator.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Excellent: {excellentCount}</span>
                        <span>Good: {goodCount}</span>
                        <span>Total: {totalCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Indicators */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium mb-4">Custom Quality Indicators</h4>
              <div className="space-y-4">
                {filteredIndicators.map(indicator => (
                  <div key={indicator.id} className="flex items-center justify-between p-4 border border-gray-200 rounded">
                    <div>
                      <h5 className="font-medium">{indicator.name}</h5>
                      <p className="text-sm text-gray-600">{indicator.description}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span>Target: {indicator.target} {indicator.unit}</span>
                        <span>Current: {indicator.current} {indicator.unit}</span>
                        <span>Department: {indicator.department}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min((indicator.current / parseFloat(indicator.target.replace(/[^\d.]/g, ''))) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {((indicator.current / parseFloat(indicator.target.replace(/[^\d.]/g, ''))) * 100).toFixed(0)}% achieved
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'peer_review' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Peer Review Sessions</h3>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Review
              </button>
            </div>

            <div className="space-y-4">
              {peerReviews.map(review => (
                <div key={review.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{review.title}</h4>
                      <p className="text-sm text-gray-600">Audit: {review.auditTitle}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Scheduled</p>
                      <p className="text-sm">{new Date(review.scheduledDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Reviewers</p>
                      <p className="text-sm">{review.reviewers?.length || 0} assigned</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cases</p>
                      <p className="text-sm">{review.casesCount || 0} to review</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Recommendations</p>
                      <p className="text-sm">{review.recommendationsCount || 0} made</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                      Start Review
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                      Generate Report
                    </button>
                  </div>
                </div>
              ))}

              {peerReviews.length === 0 && (
                <p className="text-gray-500 text-center py-8">No peer review sessions scheduled</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'mortality' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Mortality & Morbidity Reviews</h3>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                New M&M Review
              </button>
            </div>

            <div className="space-y-4">
              {mortalityReviews.map(review => (
                <div key={review.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{review.patientName} - {review.caseType}</h4>
                      <p className="text-sm text-gray-600">Date of incident: {new Date(review.incidentDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="text-sm">{review.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Review Date</p>
                      <p className="text-sm">{new Date(review.reviewDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Attendees</p>
                      <p className="text-sm">{review.attendees?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Lessons Learned</p>
                      <p className="text-sm">{review.lessonsLearned?.length || 0}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Summary</p>
                    <p className="text-sm">{review.summary}</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      View Full Review
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                      Edit Review
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                      Download Report
                    </button>
                  </div>
                </div>
              ))}

              {mortalityReviews.length === 0 && (
                <p className="text-gray-500 text-center py-8">No M&M reviews recorded</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Clinical Protocols Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compliance Overview */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4">Protocol Compliance Scores</h4>
                <div className="space-y-4">
                  {[
                    { protocol: 'Antibiotic Stewardship', score: 94, target: 95 },
                    { protocol: 'Surgical Safety Checklist', score: 98, target: 100 },
                    { protocol: 'Blood Transfusion Protocol', score: 96, target: 95 },
                    { protocol: 'Infection Control Measures', score: 92, target: 95 },
                    { protocol: 'Medication Reconciliation', score: 89, target: 90 },
                    { protocol: 'Pain Management Protocol', score: 91, target: 90 }
                  ].map(protocol => (
                    <div key={protocol.protocol} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{protocol.protocol}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${protocol.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className={`text-sm font-medium ${getComplianceColor(protocol.score)}`}>
                          {protocol.score}%
                        </p>
                        <p className="text-xs text-gray-500">Target: {protocol.target}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance Trends */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium mb-4">Compliance Trends</h4>
                <div className="space-y-3">
                  {[
                    { month: 'Jan', score: 87 },
                    { month: 'Feb', score: 89 },
                    { month: 'Mar', score: 91 },
                    { month: 'Apr', score: 88 },
                    { month: 'May', score: 92 },
                    { month: 'Jun', score: 94 }
                  ].map(trend => (
                    <div key={trend.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-12">{trend.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${trend.score}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${getComplianceColor(trend.score)}`}>
                        {trend.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'audits' || activeTab === 'indicators') && paginatedItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(paginatedItems.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Audit Creation Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <ClipboardCheck className="w-5 h-5 mr-2" />
                Schedule Clinical Audit
              </h3>
              <form onSubmit={handleCreateAudit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audit Title *</label>
                    <input
                      type="text"
                      value={auditForm.title}
                      onChange={(e) => setAuditForm({...auditForm, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audit Type *</label>
                    <select
                      value={auditForm.type}
                      onChange={(e) => setAuditForm({...auditForm, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="clinical">Clinical Audit</option>
                      <option value="administrative">Administrative Audit</option>
                      <option value="quality">Quality Assurance</option>
                      <option value="compliance">Compliance Audit</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                    <select
                      value={auditForm.department}
                      onChange={(e) => setAuditForm({...auditForm, department: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select department...</option>
                      <option value="Emergency">Emergency Department</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Medicine">Internal Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Obstetrics">Obstetrics & Gynecology</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Laboratory">Laboratory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lead Auditor</label>
                    <input
                      type="text"
                      value={auditForm.auditor}
                      onChange={(e) => setAuditForm({...auditForm, auditor: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date *</label>
                  <input
                    type="datetime-local"
                    value={auditForm.scheduledDate}
                    onChange={(e) => setAuditForm({...auditForm, scheduledDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={auditForm.description}
                    onChange={(e) => setAuditForm({...auditForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Audit objectives and scope..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Schedule Audit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAuditModal(false)}
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

      {/* Quality Indicator Modal */}
      {showIndicatorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Add Quality Indicator
              </h3>
              <form onSubmit={handleCreateIndicator} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Indicator Name *</label>
                  <input
                    type="text"
                    value={indicatorForm.name}
                    onChange={(e) => setIndicatorForm({...indicatorForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={indicatorForm.category}
                    onChange={(e) => setIndicatorForm({...indicatorForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select category...</option>
                    <option value="clinical">Clinical Quality</option>
                    <option value="safety">Patient Safety</option>
                    <option value="efficiency">Operational Efficiency</option>
                    <option value="satisfaction">Patient Satisfaction</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Value *</label>
                    <input
                      type="text"
                      value={indicatorForm.target}
                      onChange={(e) => setIndicatorForm({...indicatorForm, target: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="< 2.5%"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                    <input
                      type="text"
                      value={indicatorForm.unit}
                      onChange={(e) => setIndicatorForm({...indicatorForm, unit: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="%"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={indicatorForm.department}
                    onChange={(e) => setIndicatorForm({...indicatorForm, department: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">All Departments</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Medicine">Internal Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Hospital-wide">Hospital-wide</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
                  >
                    Add Indicator
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowIndicatorModal(false)}
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

export default ClinicalAudit;