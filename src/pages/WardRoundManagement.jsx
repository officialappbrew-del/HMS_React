import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  Plus,
  Clock,
  CheckCircle,
  Users,
  Stethoscope,
  FileText,
  Edit,
  Trash2,
  Play,
  X,
  Calendar,
  MapPin
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import {
  scheduleWardRound,
  startWardRound,
  completeWardRound,
  cancelWardRound,
  createHandoverNote,
  scheduleGrandRound,
  addPatientToRound,
  recordRoundDocumentation
} from '../features/wardRoundSlice';

const WardRoundManagement = () => {
  const dispatch = useDispatch();
  const { wardRounds, handoverNotes, grandRounds, roundStatuses, roundTypes } = useSelector(
    state => state.wardRound
  );
  const { wards } = useSelector(state => state.ward);

  const [activeTab, setActiveTab] = useState('daily');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showHandoverForm, setShowHandoverForm] = useState(false);
  const [showGrandRoundForm, setShowGrandRoundForm] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  const [notificationModal, setNotificationModal] = useState({ show: false, message: '', type: 'success' });
  const [completionNotesModal, setCompletionNotesModal] = useState({ show: false, roundId: null });
  const [completionNotes, setCompletionNotes] = useState('');
  const [cancellationModal, setCancellationModal] = useState({ show: false, roundId: null });
  const [cancellationReason, setCancellationReason] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsData, setDetailsData] = useState(null);

  const [roundFormData, setRoundFormData] = useState({
    wardId: '',
    date: '',
    time: '',
    type: roundTypes.DAILY,
    consultant: '',
    consultantSpecialty: '',
    notes: '',
    expectedDuration: 120
  });

  const [handoverFormData, setHandoverFormData] = useState({
    wardId: '',
    shiftFrom: 'Morning',
    shiftTo: 'Afternoon',
    handoverOfficer: '',
    receivingOfficer: '',
    criticallySevere: '',
    recentAdmissions: '',
    notes: ''
  });

  const [grandRoundFormData, setGrandRoundFormData] = useState({
    date: '',
    time: '',
    topic: '',
    presenter: '',
    location: '',
    targetAudience: ''
  });

  const scheduledRounds = wardRounds.filter(r => r.status === roundStatuses.SCHEDULED);
  const inProgressRounds = wardRounds.filter(r => r.status === roundStatuses.IN_PROGRESS);
  const completedRounds = wardRounds.filter(r => r.status === roundStatuses.COMPLETED);
  const dailyRounds = wardRounds.filter(r => r.type === roundTypes.DAILY);
  const teachingRounds = wardRounds.filter(r => r.type === roundTypes.TEACHING);

  const handleScheduleRound = () => {
    if (roundFormData.wardId && roundFormData.date && roundFormData.consultant) {
      dispatch(
        scheduleWardRound({
          wardId: roundFormData.wardId,
          wardName: wards.find(w => w.wardId === roundFormData.wardId)?.wardName || '',
          date: roundFormData.date,
          time: roundFormData.time,
          type: roundFormData.type,
          consultant: roundFormData.consultant,
          consultantSpecialty: roundFormData.consultantSpecialty,
          teamMembers: [],
          patientsList: [],
          notes: roundFormData.notes,
          expectedDuration: roundFormData.expectedDuration,
          status: roundStatuses.SCHEDULED
        })
      );
      setRoundFormData({
        wardId: '',
        date: '',
        time: '',
        type: roundTypes.DAILY,
        consultant: '',
        consultantSpecialty: '',
        notes: '',
        expectedDuration: 120
      });
      setShowScheduleForm(false);
      setNotificationModal({ show: true, message: 'Ward round scheduled successfully!', type: 'success' });
    }
  };

  const handleStartRound = (roundId) => {
    dispatch(startWardRound(roundId));
    setNotificationModal({ show: true, message: 'Ward round started!', type: 'success' });
  };

  const handleCompleteRound = (roundId) => {
    setCompletionNotesModal({ show: true, roundId });
  };

  const submitCompletionNotes = () => {
    if (completionNotesModal.roundId) {
      dispatch(completeWardRound({ roundId: completionNotesModal.roundId, notes: completionNotes, actualDuration: 120 }));
      setCompletionNotesModal({ show: false, roundId: null });
      setCompletionNotes('');
      setNotificationModal({ show: true, message: 'Ward round completed!', type: 'success' });
    }
  };

  const handleCancelRound = (roundId) => {
    setCancellationModal({ show: true, roundId });
  };

  const submitCancellationReason = () => {
    if (cancellationReason.trim()) {
      dispatch(cancelWardRound({ roundId: cancellationModal.roundId, reason: cancellationReason }));
      setCancellationModal({ show: false, roundId: null });
      setCancellationReason('');
      setNotificationModal({ show: true, message: 'Ward round cancelled!', type: 'success' });
    }
  };

  const handleCreateHandover = () => {
    if (handoverFormData.wardId && handoverFormData.handoverOfficer && handoverFormData.receivingOfficer) {
      dispatch(
        createHandoverNote({
          wardId: handoverFormData.wardId,
          wardName: wards.find(w => w.wardId === handoverFormData.wardId)?.wardName || '',
          shiftFrom: handoverFormData.shiftFrom,
          shiftTo: handoverFormData.shiftTo,
          handoverOfficer: handoverFormData.handoverOfficer,
          receivingOfficer: handoverFormData.receivingOfficer,
          criticallySevere: handoverFormData.criticallySevere.split(',').filter(s => s.trim()),
          recentAdmissions: handoverFormData.recentAdmissions.split(',').filter(a => a.trim()),
          notes: handoverFormData.notes
        })
      );
      setHandoverFormData({
        wardId: '',
        shiftFrom: 'Morning',
        shiftTo: 'Afternoon',
        handoverOfficer: '',
        receivingOfficer: '',
        criticallySevere: '',
        recentAdmissions: '',
        notes: ''
      });
      setShowHandoverForm(false);
      setNotificationModal({ show: true, message: 'Handover note created successfully!', type: 'success' });
    }
  };

  const handleScheduleGrandRound = () => {
    if (grandRoundFormData.date && grandRoundFormData.topic && grandRoundFormData.presenter) {
      dispatch(
        scheduleGrandRound({
          date: grandRoundFormData.date,
          time: grandRoundFormData.time,
          topic: grandRoundFormData.topic,
          presenter: grandRoundFormData.presenter,
          location: grandRoundFormData.location,
          targetAudience: grandRoundFormData.targetAudience,
          caseStudies: [],
          expectedAttendees: 0
        })
      );
      setGrandRoundFormData({
        date: '',
        time: '',
        topic: '',
        presenter: '',
        location: '',
        targetAudience: ''
      });
      setShowGrandRoundForm(false);
      setNotificationModal({ show: true, message: 'Grand round scheduled successfully!', type: 'success' });
    }
  };

  const showViewDetails = (data, type) => {
    setDetailsData({ ...data, type });
    setShowDetailsModal(true);
  };

  const getRoundStatusColor = (status) => {
    switch (status) {
      case roundStatuses.SCHEDULED:
        return 'bg-yellow-100 text-yellow-800';
      case roundStatuses.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case roundStatuses.COMPLETED:
        return 'bg-green-100 text-green-800';
      case roundStatuses.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoundTypeColor = (type) => {
    switch (type) {
      case roundTypes.DAILY:
        return 'bg-blue-50 border-blue-500';
      case roundTypes.TEACHING:
        return 'bg-purple-50 border-purple-500';
      case roundTypes.GRAND:
        return 'bg-orange-50 border-orange-500';
      default:
        return 'bg-gray-50 border-gray-500';
    }
  };

  return (
    <div className="ward-round-management px-3 sm:px-4 lg:px-6 py-4 sm:py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3 flex-wrap">
            <Stethoscope className="w-6 sm:w-8 h-6 sm:h-8 text-nigerian-green flex-shrink-0" />
            <span>Ward Round Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Manage daily rounds, teaching rounds, and handovers</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowScheduleForm(true)}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            <span className="hidden sm:inline">Schedule Round</span>
            <span className="sm:hidden">Schedule</span>
          </button>
          <button
            onClick={() => setShowHandoverForm(true)}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center gap-2 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            <span className="hidden sm:inline">Create Handover</span>
            <span className="sm:hidden">Handover</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Scheduled Rounds</p>
              <p className="text-3xl font-bold mt-2">{scheduledRounds.length}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold mt-2">{inProgressRounds.length}</p>
            </div>
            <Play className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed Today</p>
              <p className="text-3xl font-bold mt-2">
                {completedRounds.filter(
                  r => new Date(r.completedTime).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Handover Notes</p>
              <p className="text-3xl font-bold mt-2">{handoverNotes.length}</p>
            </div>
            <FileText className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-6 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === 'daily'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="sm:hidden">Daily ({dailyRounds.length})</span>
          <span className="hidden sm:inline">Daily Rounds ({dailyRounds.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('teaching')}
          className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === 'teaching'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="sm:hidden">Teaching ({teachingRounds.length})</span>
          <span className="hidden sm:inline">Teaching Rounds ({teachingRounds.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('handover')}
          className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === 'handover'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="sm:hidden">Handover ({handoverNotes.length})</span>
          <span className="hidden sm:inline">Handover Notes ({handoverNotes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('grand')}
          className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === 'grand'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="sm:hidden">Grand ({grandRounds.length})</span>
          <span className="hidden sm:inline">Grand Rounds ({grandRounds.length})</span>
        </button>
      </div>

      {/* Daily Rounds */}
      {activeTab === 'daily' && (
        <div className="space-y-4 mb-8">
          {dailyRounds.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No daily rounds scheduled</p>
            </div>
          ) : (
            dailyRounds.map(round => (
              <div
                key={round.roundId}
                className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${getRoundTypeColor(round.type)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-nigerian-green" />
                      {round.wardName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{round.roundId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoundStatusColor(round.status)}`}>
                    {round.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-semibold">
                      {new Date(round.date).toLocaleDateString('en-NG')} @ {round.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultant</p>
                    <p className="font-semibold">{round.consultant}</p>
                    <p className="text-xs text-gray-600">{round.consultantSpecialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Team Members</p>
                    <p className="font-semibold">{round.teamMembers.length} members</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Patients</p>
                    <p className="font-semibold">{round.patientsList.length} patients</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Notes:</strong> {round.notes}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {round.status === roundStatuses.SCHEDULED && (
                    <>
                      <button
                        onClick={() => handleStartRound(round.roundId)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Round
                      </button>
                      <button
                        onClick={() => handleCancelRound(round.roundId)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </>
                  )}

                  {round.status === roundStatuses.IN_PROGRESS && (
                    <button
                      onClick={() => handleCompleteRound(round.roundId)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Round
                    </button>
                  )}

                  <button
                    onClick={() => showViewDetails(round, 'dailyRound')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Teaching Rounds */}
      {activeTab === 'teaching' && (
        <div className="space-y-4 mb-8">
          {teachingRounds.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No teaching rounds scheduled</p>
            </div>
          ) : (
            teachingRounds.map(round => (
              <div
                key={round.roundId}
                className={`bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                      {round.wardName} - Teaching Round
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{round.roundId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoundStatusColor(round.status)}`}>
                    {round.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-semibold">
                      {new Date(round.date).toLocaleDateString('en-NG')} @ {round.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lead Consultant</p>
                    <p className="font-semibold">{round.consultant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teaching Team</p>
                    <p className="font-semibold">{round.teamMembers.length} members</p>
                    {round.teamMembers.slice(0, 2).map((member, idx) => (
                      <p key={idx} className="text-xs text-gray-600">
                        • {member.name}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Focus:</strong> {round.notes}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {round.status === roundStatuses.SCHEDULED && (
                    <button
                      onClick={() => handleStartRound(round.roundId)}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium flex items-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Round
                    </button>
                  )}

                  {round.status === roundStatuses.IN_PROGRESS && (
                    <button
                      onClick={() => handleCompleteRound(round.roundId)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Round
                    </button>
                  )}

                  <button
                    onClick={() => showViewDetails(round, 'teachingRound')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    View Documentation
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Handover Notes */}
      {activeTab === 'handover' && (
        <div className="space-y-4 mb-8">
          {handoverNotes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No handover notes created</p>
            </div>
          ) : (
            handoverNotes.map(note => (
              <div key={note.handoverId} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{note.wardName}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {note.handoverId} - {new Date(note.date).toLocaleDateString('en-NG')}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
                    {note.shiftFrom} → {note.shiftTo}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">From Officer</p>
                    <p className="font-semibold">{note.handoverOfficer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">To Officer</p>
                    <p className="font-semibold">{note.receivingOfficer}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Critically Severe Patients</p>
                    <div className="mt-2">
                      {note.criticallySevere.length > 0 ? (
                        note.criticallySevere.map((patient, idx) => (
                          <p key={idx} className="text-sm text-red-600">
                            • {patient}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">None</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Recent Admissions</p>
                    <div className="mt-2">
                      {note.recentAdmissions.length > 0 ? (
                        note.recentAdmissions.map((admission, idx) => (
                          <p key={idx} className="text-sm text-blue-600">
                            • {admission}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">None</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Pending Procedures</p>
                    <p className="text-sm text-yellow-600 mt-2">• Monitor vitals</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Notes:</strong> {note.notes}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => showViewDetails(note, 'handover')}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Full Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Grand Rounds */}
      {activeTab === 'grand' && (
        <div className="space-y-4 mb-8">
          <div className="mb-4">
            <button
              onClick={() => setShowGrandRoundForm(true)}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Schedule Grand Round
            </button>
          </div>

          {grandRounds.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No grand rounds scheduled</p>
            </div>
          ) : (
            grandRounds.map(round => (
              <div
                key={round.grandRoundId}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{round.topic}</h3>
                    <p className="text-sm text-gray-600 mt-1">{round.grandRoundId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoundStatusColor(round.status)}`}>
                    {round.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-semibold">
                      {new Date(round.date).toLocaleDateString('en-NG')} @ {round.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Presenter</p>
                    <p className="font-semibold">{round.presenter}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{round.location}</p>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-700">
                    <strong>Target Audience:</strong> {round.targetAudience}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Expected Attendees:</strong> {round.expectedAttendees || 'TBD'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    View Attendees
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Notification Modal */}
      <GenericModal
        isOpen={notificationModal.show}
        onClose={() => setNotificationModal({ ...notificationModal, show: false })}
        title={notificationModal.type === 'success' ? '✓ Success' : 'Information'}
        size="md"
      >
        <p className="text-gray-700 text-center py-4">{notificationModal.message}</p>
        <button
          onClick={() => setNotificationModal({ ...notificationModal, show: false })}
          className="w-full bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
        >
          OK
        </button>
      </GenericModal>

      {/* Completion Notes Modal */}
      <GenericModal
        isOpen={completionNotesModal.show}
        onClose={() => {
          setCompletionNotesModal({ show: false, roundId: null });
          setCompletionNotes('');
        }}
        title="Complete Ward Round"
        size="md"
      >
        <div className="space-y-4">
          <textarea
            placeholder="Enter completion notes..."
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            rows="4"
          />
          <div className="flex gap-2">
            <button
              onClick={submitCompletionNotes}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
            >
              Complete
            </button>
            <button
              onClick={() => {
                setCompletionNotesModal({ show: false, roundId: null });
                setCompletionNotes('');
              }}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      {/* Cancellation Modal */}
      <GenericModal
        isOpen={cancellationModal.show}
        onClose={() => {
          setCancellationModal({ show: false, roundId: null });
          setCancellationReason('');
        }}
        title="Cancel Ward Round"
        size="md"
      >
        <div className="space-y-4">
          <textarea
            placeholder="Enter cancellation reason..."
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            rows="4"
          />
          <div className="flex gap-2">
            <button
              onClick={submitCancellationReason}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
            >
              Cancel Round
            </button>
            <button
              onClick={() => {
                setCancellationModal({ show: false, roundId: null });
                setCancellationReason('');
              }}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Keep Round
            </button>
          </div>
        </div>
      </GenericModal>

      {/* Details Modal */}
      <GenericModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setDetailsData(null);
        }}
        title="Details"
        size="lg"
      >
        {detailsData && (detailsData.type === 'dailyRound' || detailsData.type === 'teachingRound') && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Ward</p>
                <p className="font-bold">{detailsData.wardName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-bold">{new Date(detailsData.date).toLocaleDateString('en-NG')} @ {detailsData.time}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Round Type</p>
                <p className="font-bold">{detailsData.type}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-bold">{detailsData.status}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Consultant</p>
                <p className="font-bold">{detailsData.consultant}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Specialty</p>
                <p className="font-bold">{detailsData.consultantSpecialty}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="font-bold">{detailsData.teamMembers.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Patients</p>
                <p className="font-bold">{detailsData.patientsList.length}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Notes</p>
              <p className="text-sm mt-2">{detailsData.notes}</p>
            </div>
          </div>
        )}
        {detailsData && detailsData.type === 'handover' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Ward</p>
                <p className="font-bold">{detailsData.wardName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Shift</p>
                <p className="font-bold">{detailsData.shiftFrom} → {detailsData.shiftTo}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">From Officer</p>
                <p className="font-bold">{detailsData.handoverOfficer}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">To Officer</p>
                <p className="font-bold">{detailsData.receivingOfficer}</p>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-semibold">Critically Severe Patients</p>
              <div className="mt-2">
                {detailsData.criticallySevere.length > 0 ? (
                  detailsData.criticallySevere.map((patient, idx) => (
                    <p key={idx} className="text-sm text-red-600">• {patient}</p>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">None</p>
                )}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-semibold">Recent Admissions</p>
              <div className="mt-2">
                {detailsData.recentAdmissions.length > 0 ? (
                  detailsData.recentAdmissions.map((admission, idx) => (
                    <p key={idx} className="text-sm text-blue-600">• {admission}</p>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">None</p>
                )}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">General Notes</p>
              <p className="text-sm mt-2">{detailsData.notes}</p>
            </div>
          </div>
        )}
      </GenericModal>

      {/* Schedule Ward Round Modal */}
      <GenericModal
        isOpen={showScheduleForm}
        onClose={() => setShowScheduleForm(false)}
        title="Schedule Ward Round"
        size="lg"
      >
        <div className="space-y-4">
          <select
            value={roundFormData.wardId}
            onChange={(e) => setRoundFormData({ ...roundFormData, wardId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          >
            <option value="">Select Ward</option>
            {wards.map(ward => (
              <option key={ward.wardId} value={ward.wardId}>
                {ward.wardName}
              </option>
            ))}
          </select>
          <select
            value={roundFormData.type}
            onChange={(e) => setRoundFormData({ ...roundFormData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          >
            <option value={roundTypes.DAILY}>Daily Ward Round</option>
            <option value={roundTypes.TEACHING}>Teaching Round</option>
          </select>
          <input
            type="date"
            value={roundFormData.date}
            onChange={(e) => setRoundFormData({ ...roundFormData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <input
            type="time"
            value={roundFormData.time}
            onChange={(e) => setRoundFormData({ ...roundFormData, time: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <input
            type="text"
            placeholder="Consultant Name"
            value={roundFormData.consultant}
            onChange={(e) => setRoundFormData({ ...roundFormData, consultant: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <input
            type="text"
            placeholder="Specialty"
            value={roundFormData.consultantSpecialty}
            onChange={(e) => setRoundFormData({ ...roundFormData, consultantSpecialty: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <textarea
            placeholder="Notes"
            value={roundFormData.notes}
            onChange={(e) => setRoundFormData({ ...roundFormData, notes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            rows="3"
          />
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleScheduleRound}
              className="flex-1 bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Schedule
            </button>
            <button
              onClick={() => setShowScheduleForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      {/* Handover Form Modal */}
      <GenericModal
        isOpen={showHandoverForm}
        onClose={() => setShowHandoverForm(false)}
        title="Create Handover Note"
        size="lg"
      >
        <div className="space-y-4">
          <select
            value={handoverFormData.wardId}
            onChange={(e) => setHandoverFormData({ ...handoverFormData, wardId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          >
            <option value="">Select Ward</option>
            {wards.map(ward => (
              <option key={ward.wardId} value={ward.wardId}>
                {ward.wardName}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Handover Officer Name"
            value={handoverFormData.handoverOfficer}
            onChange={(e) => setHandoverFormData({ ...handoverFormData, handoverOfficer: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <input
            type="text"
            placeholder="Receiving Officer Name"
            value={handoverFormData.receivingOfficer}
            onChange={(e) => setHandoverFormData({ ...handoverFormData, receivingOfficer: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <textarea
            placeholder="Critically Severe Patients (comma-separated)"
            value={handoverFormData.criticallySevere}
            onChange={(e) => setHandoverFormData({ ...handoverFormData, criticallySevere: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            rows="2"
          />
          <textarea
            placeholder="Recent Admissions (comma-separated)"
            value={handoverFormData.recentAdmissions}
            onChange={(e) => setHandoverFormData({ ...handoverFormData, recentAdmissions: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            rows="2"
          />
          <textarea
            placeholder="General Notes"
            value={handoverFormData.notes}
            onChange={(e) => setHandoverFormData({ ...handoverFormData, notes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            rows="3"
          />
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleCreateHandover}
              className="flex-1 bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Create Handover
            </button>
            <button
              onClick={() => setShowHandoverForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      {/* Grand Round Form Modal */}
      <GenericModal
        isOpen={showGrandRoundForm}
        onClose={() => setShowGrandRoundForm(false)}
        title="Schedule Grand Round"
        size="lg"
      >
        <div className="space-y-4">
          <input
            type="date"
            value={grandRoundFormData.date}
            onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <input
            type="time"
            value={grandRoundFormData.time}
            onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, time: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <input
            type="text"
            placeholder="Topic"
            value={grandRoundFormData.topic}
            onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, topic: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <input
            type="text"
            placeholder="Presenter Name"
            value={grandRoundFormData.presenter}
            onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, presenter: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <input
            type="text"
            placeholder="Location"
            value={grandRoundFormData.location}
            onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <input
            type="text"
            placeholder="Target Audience"
            value={grandRoundFormData.targetAudience}
            onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, targetAudience: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleScheduleGrandRound}
              className="flex-1 bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Schedule
            </button>
            <button
              onClick={() => setShowGrandRoundForm(false)}
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

export default WardRoundManagement;
