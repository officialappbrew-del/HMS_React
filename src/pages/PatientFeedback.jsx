import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
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
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Smile,
  Meh,
  Frown
} from 'lucide-react';
import {
  createSurvey,
  sendSurvey,
  submitFeedback,
  createComplaint,
  updateComplaint,
  resolveComplaint,
  escalateComplaint,
  createImprovementPlan,
  updateQualityMetrics,
  generateFeedbackReport,
  searchFeedback,
  filterFeedback
} from '../features/feedbackSlice';
import Pagination from '../components/Pagination';

const PatientFeedback = () => {
  const dispatch = useDispatch();
  const {
    surveys,
    feedback,
    complaints,
    improvementPlans,
    metrics,
    searchTerm,
    filterBy,
    loading
  } = useSelector(state => state.feedback);

  const [activeTab, setActiveTab] = useState('overview');
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [surveyForm, setSurveyForm] = useState({
    title: '',
    type: 'post_visit',
    questions: [],
    targetAudience: 'all_patients',
    distributionMethod: 'sms',
    scheduledDate: '',
    description: ''
  });

  const [complaintForm, setComplaintForm] = useState({
    patientId: '',
    patientName: '',
    category: '',
    priority: 'medium',
    description: '',
    department: '',
    contactMethod: 'phone'
  });

  // Nigerian healthcare satisfaction metrics
  const satisfactionMetrics = {
    overall: {
      nps: 45, // Net Promoter Score
      pss: 4.2, // Patient Satisfaction Score (1-5 scale)
      responseRate: 68,
      trend: 'improving'
    },
    categories: {
      waitingTime: { score: 3.8, target: 4.0, responses: 1250 },
      staffCourtesy: { score: 4.5, target: 4.2, responses: 1180 },
      facilityCleanliness: { score: 4.1, target: 4.0, responses: 1150 },
      medicalCare: { score: 4.3, target: 4.5, responses: 1220 },
      billingTransparency: { score: 3.6, target: 4.0, responses: 980 },
      overallExperience: { score: 4.2, target: 4.3, responses: 1300 }
    },
    demographics: {
      ageGroups: {
        '18-30': { count: 450, satisfaction: 4.1 },
        '31-50': { count: 680, satisfaction: 4.3 },
        '51-70': { count: 520, satisfaction: 4.0 },
        '70+': { count: 280, satisfaction: 3.9 }
      },
      departments: {
        'Emergency': { count: 380, satisfaction: 3.8 },
        'Outpatient': { count: 650, satisfaction: 4.2 },
        'Inpatient': { count: 420, satisfaction: 4.1 },
        'Laboratory': { count: 290, satisfaction: 4.4 },
        'Pharmacy': { count: 190, satisfaction: 4.0 }
      }
    }
  };

  // Filter and search logic
  const filteredFeedback = feedback
    .filter(item => {
      const matchesSearch = !searchTerm ||
        item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.comments?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || item.satisfactionLevel === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const filteredComplaints = complaints
    .filter(item => {
      const matchesSearch = !searchTerm ||
        item.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || item.status === filterBy || item.priority === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by priority first, then by date
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const paginatedItems = activeTab === 'feedback' ? filteredFeedback : filteredComplaints;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateSurvey = (e) => {
    e.preventDefault();
    dispatch(createSurvey(surveyForm));
    setSurveyForm({
      title: '',
      type: 'post_visit',
      questions: [],
      targetAudience: 'all_patients',
      distributionMethod: 'sms',
      scheduledDate: '',
      description: ''
    });
    setShowSurveyModal(false);
  };

  const handleCreateComplaint = (e) => {
    e.preventDefault();
    dispatch(createComplaint(complaintForm));
    setComplaintForm({
      patientId: '',
      patientName: '',
      category: '',
      priority: 'medium',
      description: '',
      department: '',
      contactMethod: 'phone'
    });
    setShowComplaintModal(false);
  };

  const handleResolveComplaint = (complaintId) => {
    dispatch(resolveComplaint({ complaintId }));
  };

  const handleEscalateComplaint = (complaintId) => {
    dispatch(escalateComplaint({ complaintId }));
  };

  const getSatisfactionColor = (score, scale = 5) => {
    const percentage = (score / scale) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case 'neutral': return <Meh className="w-4 h-4 text-yellow-600" />;
      case 'negative': return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalFeedback = feedback.length;
  const positiveFeedback = feedback.filter(f => f.sentiment === 'positive').length;
  const negativeFeedback = feedback.filter(f => f.sentiment === 'negative').length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending' || c.status === 'in_progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

  return (
    <div className="patient-feedback p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-purple-500" />
          Patient Feedback & Quality Improvement
        </h1>
        <p className="text-gray-600 mt-2">Patient experience monitoring and quality enhancement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Net Promoter Score</p>
              <p className="text-3xl font-bold mt-2">{satisfactionMetrics.overall.nps}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+5.2 pts</span>
              </div>
            </div>
            <Award className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Patient Satisfaction</p>
              <p className="text-3xl font-bold mt-2">{satisfactionMetrics.overall.pss}/5</p>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm text-blue-600">Above target</span>
              </div>
            </div>
            <ThumbsUp className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Complaints</p>
              <p className="text-3xl font-bold mt-2">{pendingComplaints}</p>
              <div className="flex items-center mt-1">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mr-1" />
                <span className="text-sm text-yellow-600">Require attention</span>
              </div>
            </div>
            <MessageCircle className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Response Rate</p>
              <p className="text-3xl font-bold mt-2">{satisfactionMetrics.overall.responseRate}%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+8.3%</span>
              </div>
            </div>
            <BarChart3 className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'surveys', label: 'Surveys', icon: FileText },
            { id: 'feedback', label: 'Patient Feedback', icon: MessageSquare },
            { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
            { id: 'improvement', label: 'Quality Plans', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white'
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
              {/* Satisfaction Scores by Category */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Satisfaction by Category</h3>
                <div className="space-y-4">
                  {Object.entries(satisfactionMetrics.categories).map(([category, data]) => (
                    <div key={category} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1')}</h4>
                        <div className={`flex items-center ${getSatisfactionColor(data.score)}`}>
                          <Star className="w-4 h-4 mr-1" />
                          <span className="font-medium">{data.score}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Target: {data.target}/5</span>
                        <span>{data.responses} responses</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(data.score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demographic Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Demographic Analysis</h3>
                <div className="space-y-6">
                  {/* Age Groups */}
                  <div>
                    <h4 className="font-medium mb-3">By Age Group</h4>
                    <div className="space-y-2">
                      {Object.entries(satisfactionMetrics.demographics.ageGroups).map(([ageGroup, data]) => (
                        <div key={ageGroup} className="flex items-center justify-between">
                          <span className="text-sm">{ageGroup} years</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">({data.count})</span>
                            <div className={`flex items-center ${getSatisfactionColor(data.satisfaction)}`}>
                              <Star className="w-3 h-3 mr-1" />
                              <span className="text-sm font-medium">{data.satisfaction}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Departments */}
                  <div>
                    <h4 className="font-medium mb-3">By Department</h4>
                    <div className="space-y-2">
                      {Object.entries(satisfactionMetrics.demographics.departments).map(([department, data]) => (
                        <div key={department} className="flex items-center justify-between">
                          <span className="text-sm">{department}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">({data.count})</span>
                            <div className={`flex items-center ${getSatisfactionColor(data.satisfaction)}`}>
                              <Star className="w-3 h-3 mr-1" />
                              <span className="text-sm font-medium">{data.satisfaction}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Sentiment Overview */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Feedback Sentiment Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <ThumbsUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h4 className="font-medium text-green-800 mb-2">Positive Feedback</h4>
                  <p className="text-3xl font-bold text-green-600">{positiveFeedback}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {totalFeedback > 0 ? Math.round((positiveFeedback / totalFeedback) * 100) : 0}% of total
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <Meh className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                  <h4 className="font-medium text-yellow-800 mb-2">Neutral Feedback</h4>
                  <p className="text-3xl font-bold text-yellow-600">
                    {totalFeedback - positiveFeedback - negativeFeedback}
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">
                    {totalFeedback > 0 ? Math.round(((totalFeedback - positiveFeedback - negativeFeedback) / totalFeedback) * 100) : 0}% of total
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <ThumbsDown className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h4 className="font-medium text-red-800 mb-2">Negative Feedback</h4>
                  <p className="text-3xl font-bold text-red-600">{negativeFeedback}</p>
                  <p className="text-sm text-red-600 mt-1">
                    {totalFeedback > 0 ? Math.round((negativeFeedback / totalFeedback) * 100) : 0}% of total
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'surveys' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Survey Management</h3>
              <button
                onClick={() => setShowSurveyModal(true)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Survey
              </button>
            </div>

            <div className="space-y-4">
              {surveys.map(survey => (
                <div key={survey.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{survey.title}</h4>
                      <p className="text-sm text-gray-600 capitalize">{survey.type.replace('_', ' ')} Survey</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(survey.status)}`}>
                        {survey.status}
                      </span>
                      <span className="text-sm text-gray-600">
                        {survey.responses || 0} responses
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Target Audience</p>
                      <p className="text-sm capitalize">{survey.targetAudience.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Distribution</p>
                      <p className="text-sm capitalize">{survey.distributionMethod}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Questions</p>
                      <p className="text-sm">{survey.questions?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm">{new Date(survey.createdAt).toLocaleDateString('en-NG')}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      View Results
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                      Send Survey
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                      Edit Survey
                    </button>
                  </div>
                </div>
              ))}

              {surveys.length === 0 && (
                <p className="text-gray-500 text-center py-8">No surveys created yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchFeedback(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Sentiment</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterFeedback(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Feedback</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Feedback Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.patientName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < item.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">({item.rating}/5)</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getSentimentIcon(item.sentiment)}
                          <span className="ml-2 text-sm capitalize">{item.sentiment}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {item.comments}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.department}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.submittedAt).toLocaleDateString('en-NG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchFeedback(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterFeedback(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Complaints</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Priority</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterFeedback(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowComplaintModal(true)}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Complaint
                </button>
              </div>
            </div>

            {/* Complaints Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(complaint => (
                    <tr key={complaint.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {complaint.patientName}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {complaint.category.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {complaint.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {complaint.description}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {complaint.department}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          {complaint.status !== 'resolved' && (
                            <>
                              <button
                                onClick={() => handleResolveComplaint(complaint.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={() => handleEscalateComplaint(complaint.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Escalate
                              </button>
                            </>
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

        {activeTab === 'improvement' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Quality Improvement Plans</h3>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Create Plan
              </button>
            </div>

            <div className="space-y-4">
              {improvementPlans.map(plan => (
                <div key={plan.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{plan.title}</h4>
                      <p className="text-sm text-gray-600">Based on: {plan.source}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(plan.status)}`}>
                      {plan.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Target Completion</p>
                      <p className="text-sm">{new Date(plan.targetDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Responsible</p>
                      <p className="text-sm">{plan.responsiblePerson}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Actions</p>
                      <p className="text-sm">{plan.actions?.length || 0} defined</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Progress</p>
                      <p className="text-sm">{plan.progress || 0}% complete</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Objectives</p>
                    <p className="text-sm">{plan.objectives}</p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${plan.progress || 0}%` }}
                    ></div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      Update Progress
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                      View Details
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                      Generate Report
                    </button>
                  </div>
                </div>
              ))}

              {improvementPlans.length === 0 && (
                <p className="text-gray-500 text-center py-8">No quality improvement plans created yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'feedback' || activeTab === 'complaints') && paginatedItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(paginatedItems.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Survey Creation Modal */}
      {showSurveyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Create Patient Survey
              </h3>
              <form onSubmit={handleCreateSurvey} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Title *</label>
                    <input
                      type="text"
                      value={surveyForm.title}
                      onChange={(e) => setSurveyForm({...surveyForm, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Type *</label>
                    <select
                      value={surveyForm.type}
                      onChange={(e) => setSurveyForm({...surveyForm, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="post_visit">Post-Visit Survey</option>
                      <option value="admission">Admission Experience</option>
                      <option value="discharge">Discharge Survey</option>
                      <option value="follow_up">Follow-up Survey</option>
                      <option value="general">General Satisfaction</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience *</label>
                    <select
                      value={surveyForm.targetAudience}
                      onChange={(e) => setSurveyForm({...surveyForm, targetAudience: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="all_patients">All Patients</option>
                      <option value="recent_visits">Recent Visits (7 days)</option>
                      <option value="inpatients">Current Inpatients</option>
                      <option value="outpatients">Outpatients</option>
                      <option value="specific_department">Specific Department</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distribution Method *</label>
                    <select
                      value={surveyForm.distributionMethod}
                      onChange={(e) => setSurveyForm({...surveyForm, distributionMethod: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="portal">Patient Portal</option>
                      <option value="kiosk">In-hospital Kiosk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                  <input
                    type="datetime-local"
                    value={surveyForm.scheduledDate}
                    onChange={(e) => setSurveyForm({...surveyForm, scheduledDate: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={surveyForm.description}
                    onChange={(e) => setSurveyForm({...surveyForm, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Survey objectives and instructions..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 font-medium"
                  >
                    Create Survey
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSurveyModal(false)}
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

      {/* Complaint Creation Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Submit Patient Complaint
              </h3>
              <form onSubmit={handleCreateComplaint} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                  <input
                    type="text"
                    value={complaintForm.patientName}
                    onChange={(e) => setComplaintForm({...complaintForm, patientName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                  <input
                    type="text"
                    value={complaintForm.patientId}
                    onChange={(e) => setComplaintForm({...complaintForm, patientId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({...complaintForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select category...</option>
                    <option value="waiting_time">Waiting Time</option>
                    <option value="staff_behavior">Staff Behavior</option>
                    <option value="facility_cleanliness">Facility Cleanliness</option>
                    <option value="medical_care">Medical Care Quality</option>
                    <option value="billing">Billing Issues</option>
                    <option value="communication">Communication</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority *</label>
                    <select
                      value={complaintForm.priority}
                      onChange={(e) => setComplaintForm({...complaintForm, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={complaintForm.department}
                      onChange={(e) => setComplaintForm({...complaintForm, department: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select department...</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Outpatient">Outpatient</option>
                      <option value="Inpatient">Inpatient</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Please describe the issue in detail..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                  <select
                    value={complaintForm.contactMethod}
                    onChange={(e) => setComplaintForm({...complaintForm, contactMethod: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="in_person">In Person</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
                  >
                    Submit Complaint
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowComplaintModal(false)}
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

export default PatientFeedback;