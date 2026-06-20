import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  startIntraOpRecord,
  updateIntraOpRecord,
  completeSurgery
} from '../features/theaterSlice';

import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

const IntraOperativeDocumentation = () => {
  const dispatch = useDispatch();
  const {
    intraOpRecords,
    surgicalSchedules,
    staffAvailability
  } = useSelector(state => state.theater);

  const { patients } = useSelector(state => state.patient);

  const [activeTab, setActiveTab] = useState('active');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    scheduleId: '',
    startTime: '',
    surgeon: '',
    anesthetist: '',
    circulatingNurse: '',
    scrubNurse: '',
    anesthesiaType: 'General Anesthesia',
    inductionTime: '',
    maintenance: '',
    reversalTime: '',
    specimens: '',
    implants: '',
    bloodProducts: '',
    complications: '',
    notes: ''
  });

  const handleStartSurgery = (schedule) => {
    const recordData = {
      recordId: `INTRA${Date.now()}`,
      scheduleId: schedule.scheduleId,
      patientId: schedule.patientId,
      patientName: schedule.patientName,
      procedure: schedule.procedure,
      startTime: new Date().toISOString(),
      endTime: null,
      surgeon: schedule.surgeon,
      anesthetist: schedule.anesthetist,
      circulatingNurse: '',
      scrubNurse: '',
      safetyChecklist: {
        signIn: {
          patientIdentity: false,
          procedure: false,
          site: false,
          consent: false,
          imaging: false,
          equipment: false
        },
        timeOut: {
          teamIntroduction: false,
          patientIdentity: false,
          procedure: false,
          site: false,
          concerns: false
        },
        signOut: {
          procedure: null,
          specimens: null,
          equipment: null,
          concerns: null
        }
      },
      anesthesiaRecord: {
        type: 'General Anesthesia',
        inductionTime: '',
        maintenance: '',
        reversalTime: null,
        complications: null
      },
      specimens: [],
      implants: [],
      bloodProducts: [],
      complications: null,
      status: 'In Progress'
    };

    dispatch(startIntraOpRecord(recordData));
  };

  const handleCompleteSurgery = (recordId) => {
    const endTime = new Date().toISOString();
    const complications = prompt('Any complications during surgery? (leave blank if none)');
    const specimens = prompt('Specimens collected? (comma-separated, leave blank if none)')?.split(',').map(s => s.trim()).filter(s => s) || [];
    const implants = prompt('Implants used? (comma-separated, leave blank if none)')?.split(',').map(i => i.trim()).filter(i => i) || [];
    const bloodProducts = prompt('Blood products used? (comma-separated, leave blank if none)')?.split(',').map(b => b.trim()).filter(b => b) || [];

    dispatch(completeSurgery({
      recordId,
      endTime,
      complications: complications || null,
      specimens,
      implants,
      bloodProducts
    }));
  };

  const updateSafetyChecklist = (recordId, phase, item, value) => {
    const record = intraOpRecords.find(r => r.recordId === recordId);
    if (record) {
      const updatedRecord = {
        recordId,
        safetyChecklist: {
          ...record.safetyChecklist,
          [phase]: {
            ...record.safetyChecklist[phase],
            [item]: value
          }
        }
      };
      dispatch(updateIntraOpRecord(updatedRecord));
    }
  };

  const renderActiveSurgeries = () => {
    const activeRecords = intraOpRecords.filter(record => record.status === 'In Progress');

    return (
      <div className="space-y-4">
        {activeRecords.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-gray-500 text-lg">No active surgeries</div>
            <div className="text-gray-400 text-sm mt-2">Surgeries in progress will appear here</div>
          </div>
        ) : (
          activeRecords.map((record) => (
            <div key={record.recordId} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {record.patientName} - {record.procedure}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    Started: {new Date(record.startTime).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                    In Progress
                  </span>
                  <button
                    onClick={() => handleCompleteSurgery(record.recordId)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Complete Surgery
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Surgeon</div>
                  <div className="font-medium">{record.surgeon}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Anesthetist</div>
                  <div className="font-medium">{record.anesthetist}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Circulating Nurse</div>
                  <div className="font-medium">{record.circulatingNurse || 'Not assigned'}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Scrub Nurse</div>
                  <div className="font-medium">{record.scrubNurse || 'Not assigned'}</div>
                </div>
              </div>

              {/* Safety Checklist */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">WHO Surgical Safety Checklist</h4>

                {/* Sign In */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Sign In (Before anesthesia)</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(record.safetyChecklist.signIn).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSafetyChecklist(record.recordId, 'signIn', key, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Out */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-800 mb-2">Time Out (Before incision)</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(record.safetyChecklist.timeOut).map(([key, value]) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSafetyChecklist(record.recordId, 'timeOut', key, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderCompletedSurgeries = () => {
    const completedRecords = intraOpRecords.filter(record => record.status === 'Completed');
    const displayedItems = completedRecords.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Completed Surgical Records</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Procedure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Surgeon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complications</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((record) => {
                const duration = record.endTime ?
                  Math.floor((new Date(record.endTime) - new Date(record.startTime)) / (1000 * 60)) : 0;

                return (
                  <tr key={record.recordId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.patientName}</div>
                      <div className="text-sm text-gray-500">ID: {record.patientId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.procedure}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {duration} minutes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.surgeon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.complications ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {record.complications ? 'Yes' : 'None'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-2">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {completedRecords.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(completedRecords.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    );
  };

  const renderPendingSurgeries = () => {
    const pendingSchedules = surgicalSchedules.filter(schedule =>
      schedule.status === 'Scheduled' && !intraOpRecords.find(r => r.scheduleId === schedule.scheduleId)
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Pending Surgeries</h3>

        {pendingSchedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No pending surgeries scheduled
          </div>
        ) : (
          <div className="space-y-4">
            {pendingSchedules.map((schedule) => (
              <div key={schedule.scheduleId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {schedule.patientName} - {schedule.procedure}
                    </h4>
                    <div className="text-sm text-gray-600 mt-1">
                      {schedule.date} at {schedule.startTime} - {schedule.endTime}
                    </div>
                    <div className="text-sm text-gray-600">
                      Room: {schedule.roomId} | Surgeon: {schedule.surgeon}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartSurgery(schedule)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Start Surgery
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="intra-operative-documentation p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Intra-Operative Documentation</h2>
        <p className="text-gray-600">Real-time surgical records and safety checklists</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'active', label: 'Active Surgeries', count: intraOpRecords.filter(r => r.status === 'In Progress').length },
              { id: 'pending', label: 'Pending Surgeries', count: surgicalSchedules.filter(s => s.status === 'Scheduled' && !intraOpRecords.find(r => r.scheduleId === s.scheduleId)).length },
              { id: 'completed', label: 'Completed Records', count: intraOpRecords.filter(r => r.status === 'Completed').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'active' && renderActiveSurgeries()}
        {activeTab === 'pending' && renderPendingSurgeries()}
        {activeTab === 'completed' && renderCompletedSurgeries()}
      </div>
    </div>
  );
};

export default IntraOperativeDocumentation;