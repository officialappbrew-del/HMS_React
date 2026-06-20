import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Phone,
  MessageSquare,
  Users,
  Activity,
  Search,
  Filter,
  RefreshCw,
  Send,
  PhoneCall,
  Smartphone
} from 'lucide-react';
import {
  startSession,
  processUSSDInput,
  endSession,
  searchUSSD,
  sortUSSD,
  filterUSSD
} from '../features/ussdSlice';
import Pagination from '../components/Pagination';

const USSDSystem = () => {
  const dispatch = useDispatch();
  const { sessions, responses, searchTerm, sortBy, filterBy } = useSelector(state => state.ussd);

  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorPhone, setSimulatorPhone] = useState('');
  const [simulatorInput, setSimulatorInput] = useState('');
  const [currentSession, setCurrentSession] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and search logic
  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = !searchTerm ||
        session.phoneNumber.includes(searchTerm) ||
        session.responses.some(r => r.response.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterBy === 'all' || session.active === (filterBy === 'active');
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === 'phone') return a.phoneNumber.localeCompare(b.phoneNumber);
      return 0;
    });

  const filteredResponses = responses
    .filter(response => {
      const matchesSearch = !searchTerm ||
        response.message.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStartSession = () => {
    if (simulatorPhone) {
      dispatch(startSession({ phoneNumber: simulatorPhone }));
      const newSession = sessions.find(s => s.phoneNumber === simulatorPhone && s.active);
      if (newSession) {
        setCurrentSession(newSession.id);
      }
    }
  };

  const handleSendInput = () => {
    if (currentSession && simulatorInput) {
      dispatch(processUSSDInput({ sessionId: currentSession, input: simulatorInput }));
      setSimulatorInput('');
    }
  };

  const handleEndSession = (sessionId) => {
    dispatch(endSession(sessionId));
    if (currentSession === sessionId) {
      setCurrentSession(null);
      setSimulatorPhone('');
    }
  };

  const getCurrentResponse = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && session.responses.length > 0) {
      return session.responses[session.responses.length - 1].response;
    }
    return 'Welcome to SmartCare HMS!\n\n1. Patient Services\n2. Emergency Services\n3. Information\n4. Feedback';
  };

  return (
    <div className="ussd-system p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-500" />
          USSD Interactive System
        </h1>
        <p className="text-gray-600 mt-2">*XXX# - Nigerian healthcare access via mobile</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Sessions</p>
              <p className="text-3xl font-bold mt-2">{sessions.filter(s => s.active).length}</p>
            </div>
            <PhoneCall className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Responses</p>
              <p className="text-3xl font-bold mt-2">{responses.length}</p>
            </div>
            <MessageSquare className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Sessions</p>
              <p className="text-3xl font-bold mt-2">{sessions.length}</p>
            </div>
            <Users className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* USSD Simulator */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Phone className="w-5 h-5 mr-2 text-green-500" />
            USSD Simulator
          </h2>
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
          >
            {showSimulator ? 'Hide Simulator' : 'Show Simulator'}
          </button>
        </div>

        {showSimulator && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={simulatorPhone}
                  onChange={(e) => setSimulatorPhone(e.target.value)}
                  placeholder="+234XXXXXXXXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleStartSession}
                  disabled={!simulatorPhone}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:bg-gray-300"
                >
                  Start Session
                </button>
              </div>
            </div>

            {currentSession && (
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Current Session Response:</h3>
                  <div className="bg-gray-50 p-3 rounded border font-mono text-sm whitespace-pre-line">
                    {getCurrentResponse(currentSession)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={simulatorInput}
                    onChange={(e) => setSimulatorInput(e.target.value)}
                    placeholder="Enter USSD input..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendInput()}
                  />
                  <button
                    onClick={handleSendInput}
                    disabled={!simulatorInput}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:bg-gray-300 flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </button>
                  <button
                    onClick={() => handleEndSession(currentSession)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                  >
                    End Session
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions/responses..."
                value={searchTerm}
                onChange={(e) => dispatch(searchUSSD(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterBy}
              onChange={(e) => dispatch(filterUSSD(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Sessions</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => dispatch(sortUSSD(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="date">Date (Newest First)</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responses</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSessions.map(session => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{session.phoneNumber}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      session.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.active ? 'Active' : 'Ended'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.language}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {session.responses.length}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(session.timestamp).toLocaleString('en-NG')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {session.active && (
                      <button
                        onClick={() => handleEndSession(session.id)}
                        className="text-red-600 hover:text-red-900 mr-3"
                      >
                        End Session
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginatedSessions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No USSD sessions found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredSessions.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredSessions.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Recent Responses */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-500" />
          Recent USSD Responses
        </h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredResponses.slice(0, 20).map(response => (
            <div key={response.timestamp} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  Session: {sessions.find(s => s.id === response.sessionId)?.phoneNumber || response.sessionId}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(response.timestamp).toLocaleString('en-NG')}
                </span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-2 rounded">
                {response.message}
              </div>
            </div>
          ))}
        </div>
        {filteredResponses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No USSD responses yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default USSDSystem;