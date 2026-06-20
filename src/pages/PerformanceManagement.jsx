import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  Plus,
  BarChart3,
  Award,
  FileText,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import GenericModal from '../components/GenericModal';

const PerformanceManagement = () => {
  const performanceState = useSelector(state => state.performance) || {};
  const appraisals = performanceState.appraisals || [];
  const auditRecords = performanceState.auditRecords || [];
  const researchOutput = performanceState.researchOutput || [];
  const teachingHours = performanceState.teachingHours || [];
  const satisfactionScores = performanceState.satisfactionScores || [];
  const incidentRecords = performanceState.incidentRecords || [];
  const { staff } = useSelector(state => state.staff);

  const [activeTab, setActiveTab] = useState('appraisals');
  const [showAppraisalForm, setShowAppraisalForm] = useState(false);

  const [appraisalData, setAppraisalData] = useState({
    staffId: '',
    appraisalPeriod: '',
    clinicalExcellence: '4',
    patientCare: '4',
    teamwork: '4',
    leadership: '4',
    continuousLearning: '4',
    comments: ''
  });

  const performanceDimensions = [
    { name: 'Clinical Excellence', key: 'clinicalExcellence' },
    { name: 'Patient Care', key: 'patientCare' },
    { name: 'Teamwork', key: 'teamwork' },
    { name: 'Leadership', key: 'leadership' },
    { name: 'Continuous Learning', key: 'continuousLearning' }
  ];

  const handleAddAppraisal = () => {
    if (appraisalData.staffId && appraisalData.appraisalPeriod) {
      // In real app, dispatch to Redux
      setShowAppraisalForm(false);
      setAppraisalData({
        staffId: '',
        appraisalPeriod: '',
        clinicalExcellence: '4',
        patientCare: '4',
        teamwork: '4',
        leadership: '4',
        continuousLearning: '4',
        comments: ''
      });
    }
  };

  const getRatingColor = (rating) => {
    const num = parseFloat(rating);
    if (num >= 4.5) return 'text-green-600';
    if (num >= 4) return 'text-blue-600';
    if (num >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingLabel = (rating) => {
    const num = parseFloat(rating);
    if (num >= 4.5) return 'Excellent';
    if (num >= 4) return 'Very Good';
    if (num >= 3) return 'Good';
    if (num >= 2) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="performance-management p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-nigerian-green" />
            Performance Management
          </h1>
          <p className="text-gray-600 mt-2">Track staff appraisals, audits, research, and satisfaction</p>
        </div>
        <button
          onClick={() => setShowAppraisalForm(true)}
          className="px-6 py-3 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center justify-center w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Appraisal
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Completed Appraisals</p>
              <p className="text-blue-500 font-bold text-2xl">{appraisals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Clinical Audits</p>
              <p className="text-green-500 font-bold text-2xl">{auditRecords.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Research Publications</p>
              <p className="text-purple-500 font-bold text-2xl">{researchOutput.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-500 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Open Incidents</p>
              <p className="text-orange-500 font-bold text-2xl">{incidentRecords.filter(i => i.investigationStatus !== 'Closed').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('appraisals')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'appraisals'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Appraisals ({appraisals.length})
        </button>
        <button
          onClick={() => setActiveTab('audits')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'audits'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Clinical Audits ({auditRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('research')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'research'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Research ({researchOutput.length})
        </button>
        <button
          onClick={() => setActiveTab('teaching')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'teaching'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Teaching ({teachingHours.length})
        </button>
        <button
          onClick={() => setActiveTab('satisfaction')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'satisfaction'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Satisfaction ({satisfactionScores.length})
        </button>
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'incidents'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Incidents ({incidentRecords.length})
        </button>
      </div>

      {/* Appraisals Tab */}
      {activeTab === 'appraisals' && (
        <div className="space-y-6">
          {appraisals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No appraisals completed yet</p>
            </div>
          ) : (
            appraisals.map(appraisal => (
              <div key={appraisal.appraisalId} className="bg-white rounded-xl shadow-md p-6">
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{staff.find(s => s.staffId === appraisal.staffId)?.name}</h3>
                      <p className="text-gray-600 text-sm">Period: {appraisal.appraisalPeriod}</p>
                    </div>
                    <span className={`text-2xl font-bold ${getRatingColor(appraisal.overallRating)}`}>
                      {appraisal.overallRating}/5
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  {performanceDimensions.map(dimension => (
                    <div key={dimension.key} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">{dimension.name}</p>
                      <p className={`text-2xl font-bold mt-2 ${getRatingColor(appraisal[dimension.key])}`}>
                        {appraisal[dimension.key]}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{getRatingLabel(appraisal[dimension.key])}</p>
                    </div>
                  ))}
                </div>
                {appraisal.comments && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700">Comments:</p>
                    <p className="text-gray-700 mt-1">{appraisal.comments}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Clinical Audits Tab */}
      {activeTab === 'audits' && (
        <div className="space-y-4">
          {auditRecords.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No audit records found</p>
            </div>
          ) : (
            auditRecords.map(audit => (
              <div key={audit.auditId} className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-bold">{audit.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Audit Type</p>
                    <p className="font-bold">{audit.auditType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-bold">{new Date(audit.auditDate).toLocaleDateString('en-NG')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cases Reviewed</p>
                    <p className="font-bold">{audit.casesReviewed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Compliance Rate</p>
                    <p className="font-bold text-green-600">{audit.complianceRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Auditor</p>
                    <p className="font-bold text-sm">{audit.auditor}</p>
                  </div>
                </div>
                {audit.findings && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-800">Key Findings:</p>
                    <p className="text-yellow-800 mt-1">{audit.findings}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Research Tab */}
      {activeTab === 'research' && (
        <div className="space-y-4">
          {researchOutput.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No research publications found</p>
            </div>
          ) : (
            researchOutput.map(research => (
              <div key={research.researchId} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800">{research.publicationTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Authors</p>
                    <p className="font-bold text-sm">{research.authors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Journal</p>
                    <p className="font-bold">{research.journal}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Publication Date</p>
                    <p className="font-bold">{new Date(research.publicationDate).toLocaleDateString('en-NG')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Citations</p>
                    <p className="font-bold text-purple-600">{research.citationCount}</p>
                  </div>
                </div>
                {research.abstract && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700">Abstract:</p>
                    <p className="text-gray-700 mt-1 text-sm">{research.abstract}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Teaching Tab */}
      {activeTab === 'teaching' && (
        <div className="space-y-4">
          {teachingHours.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No teaching records found</p>
            </div>
          ) : (
            teachingHours.map(teaching => (
              <div key={teaching.teachingId} className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Staff Member</p>
                    <p className="font-bold">{staff.find(s => s.staffId === teaching.staffId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Topic</p>
                    <p className="font-bold">{teaching.topic}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hours Delivered</p>
                    <p className="font-bold text-blue-600">{teaching.hoursDelivered}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Students</p>
                    <p className="font-bold">{teaching.studentsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Feedback Score</p>
                    <p className="font-bold text-green-600">{teaching.feedbackScore}/5</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Satisfaction Tab */}
      {activeTab === 'satisfaction' && (
        <div className="space-y-4">
          {satisfactionScores.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No satisfaction data found</p>
            </div>
          ) : (
            satisfactionScores.map(satisfaction => (
              <div key={satisfaction.satisfactionId} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Survey Period: {new Date(satisfaction.surveyDate).toLocaleDateString('en-NG')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700 font-semibold">Clinical Care</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{satisfaction.clinicalCareScore}</p>
                    <p className="text-xs text-blue-600 mt-1">out of 5</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700 font-semibold">Communication</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{satisfaction.communicationScore}</p>
                    <p className="text-xs text-green-600 mt-1">out of 5</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-700 font-semibold">Responsiveness</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{satisfaction.responsivenessScore}</p>
                    <p className="text-xs text-purple-600 mt-1">out of 5</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-700 font-semibold">Professionalism</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{satisfaction.professionalismScore}</p>
                    <p className="text-xs text-orange-600 mt-1">out of 5</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-700 font-semibold">Overall</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{satisfaction.overallScore}</p>
                    <p className="text-xs text-red-600 mt-1">out of 5</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Incidents Tab */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          {incidentRecords.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No incidents reported</p>
            </div>
          ) : (
            incidentRecords.map(incident => (
              <div key={incident.incidentId} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                  <div>
                    <p className="text-sm text-gray-600">Incident Type</p>
                    <p className="font-bold">{incident.incidentType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reported Date</p>
                    <p className="font-bold">{new Date(incident.reportedDate).toLocaleDateString('en-NG')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Staff Involved</p>
                    <p className="font-bold text-sm">{staff.find(s => s.staffId === incident.staffId)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Severity</p>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      incident.severity === 'High' ? 'bg-red-100 text-red-800' :
                      incident.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {incident.severity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Investigation</p>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      incident.investigationStatus === 'Closed' ? 'bg-green-100 text-green-800' :
                      incident.investigationStatus === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {incident.investigationStatus}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-semibold text-orange-800">Description:</p>
                  <p className="text-orange-800 mt-1">{incident.description}</p>
                </div>
                {incident.rootCauseAnalysis && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700">Root Cause Analysis:</p>
                    <p className="text-gray-700 mt-1">{incident.rootCauseAnalysis}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Appraisal Modal */}
      <GenericModal
        isOpen={showAppraisalForm}
        onClose={() => setShowAppraisalForm(false)}
        title="Add Performance Appraisal"
        size="lg"
      >
        <div className="space-y-4">
          <select
            value={appraisalData.staffId}
            onChange={(e) => setAppraisalData({ ...appraisalData, staffId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          >
            <option value="">Select Staff Member</option>
            {staff.map(s => (
              <option key={s.staffId} value={s.staffId}>{s.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Appraisal Period (e.g., Jan 2025 - Dec 2025)"
            value={appraisalData.appraisalPeriod}
            onChange={(e) => setAppraisalData({ ...appraisalData, appraisalPeriod: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <div className="grid grid-cols-2 gap-4">
            {performanceDimensions.map(dimension => (
              <div key={dimension.key}>
                <label className="text-sm font-semibold text-gray-700">{dimension.name}</label>
                <select
                  value={appraisalData[dimension.key]}
                  onChange={(e) => setAppraisalData({ ...appraisalData, [dimension.key]: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green mt-1"
                >
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
            ))}
          </div>
          <textarea
            placeholder="Comments and observations"
            value={appraisalData.comments}
            onChange={(e) => setAppraisalData({ ...appraisalData, comments: e.target.value })}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          ></textarea>
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleAddAppraisal}
              className="flex-1 bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Save Appraisal
            </button>
            <button
              onClick={() => setShowAppraisalForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default PerformanceManagement;
