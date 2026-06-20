import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  scheduleSurgery,
  updateSurgicalSchedule,
  cancelSurgery
} from '../features/theaterSlice';

import ConfirmModal from "../components/ConfirmModal";
import Pagination from "../components/Pagination";

const TheaterScheduling = () => {
  const dispatch = useDispatch();
  const {
    operatingRooms,
    surgicalSchedules,
    procedures,
    staffAvailability
  } = useSelector(state => state.theater);

  const { patients } = useSelector(state => state.patient);

  const [activeTab, setActiveTab] = useState('schedule');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    patientId: '',
    procedure: '',
    surgeon: '',
    assistantSurgeon: '',
    anesthetist: '',
    roomId: '',
    date: '',
    startTime: '',
    estimatedDuration: 60,
    priority: 'Elective',
    notes: ''
  });

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'cancel',
    scheduleData: null,
    action: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientId || !formData.procedure || !formData.roomId) {
      alert('Patient, procedure, and operating room are required');
      return;
    }

    // Calculate end time
    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + formData.estimatedDuration * 60000);
    const endTime = endDateTime.toTimeString().slice(0, 5);

    const patient = patients.find(p => p.patientId === formData.patientId);

    if (editingId) {
      dispatch(updateSurgicalSchedule({
        scheduleId: editingId,
        ...formData,
        endTime,
        patientName: patient?.name || 'Unknown Patient'
      }));
      setEditingId(null);
    } else {
      const newSchedule = {
        scheduleId: `SCH${Date.now()}`,
        patientId: formData.patientId,
        patientName: patient?.name || 'Unknown Patient',
        procedure: formData.procedure,
        surgeon: formData.surgeon,
        assistantSurgeon: formData.assistantSurgeon,
        anesthetist: formData.anesthetist,
        roomId: formData.roomId,
        date: formData.date,
        startTime: formData.startTime,
        endTime,
        estimatedDuration: formData.estimatedDuration,
        actualDuration: null,
        priority: formData.priority,
        status: 'Scheduled',
        notes: formData.notes
      };

      dispatch(scheduleSurgery(newSchedule));
    }

    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      procedure: '',
      surgeon: '',
      assistantSurgeon: '',
      anesthetist: '',
      roomId: '',
      date: '',
      startTime: '',
      estimatedDuration: 60,
      priority: 'Elective',
      notes: ''
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancelSurgery = (schedule) => {
    setModalConfig({
      isOpen: true,
      type: 'cancel',
      scheduleData: schedule,
      action: () => {
        const reason = prompt('Please provide a reason for cancellation:');
        if (reason) {
          dispatch(cancelSurgery({ scheduleId: schedule.scheduleId, reason }));
        }
      },
    });
  };

  const handleModalConfirm = () => {
    if (modalConfig.action) {
      modalConfig.action();
    }
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleModalClose = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Emergency': return 'bg-red-100 text-red-800';
      case 'Urgent': return 'bg-orange-100 text-orange-800';
      case 'Elective': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderScheduleForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Schedule Surgery</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient *</label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.patientId} value={patient.patientId}>
                  {patient.name} (ID: {patient.patientId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Procedure *</label>
            <select
              name="procedure"
              value={formData.procedure}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Procedure</option>
              {procedures.map(proc => (
                <option key={proc.procedureId} value={proc.name}>
                  {proc.name} ({proc.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Surgeon</label>
            <select
              name="surgeon"
              value={formData.surgeon}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Surgeon</option>
              {staffAvailability.surgeons.map(surgeon => (
                <option key={surgeon.id} value={surgeon.name}>
                  {surgeon.name} ({surgeon.specialty})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assistant Surgeon</label>
            <select
              name="assistantSurgeon"
              value={formData.assistantSurgeon}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Assistant</option>
              {staffAvailability.surgeons.map(surgeon => (
                <option key={surgeon.id} value={surgeon.name}>
                  {surgeon.name} ({surgeon.specialty})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Anesthetist</label>
            <select
              name="anesthetist"
              value={formData.anesthetist}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Anesthetist</option>
              {staffAvailability.anesthetists.map(anest => (
                <option key={anest.id} value={anest.name}>
                  {anest.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Operating Room *</label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Operating Room</option>
              {operatingRooms.map(room => (
                <option key={room.roomId} value={room.roomId}>
                  {room.name} ({room.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Elective">Elective</option>
              <option value="Urgent">Urgent</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              min="30"
              max="480"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
        >
          {editingId ? 'Update Schedule' : 'Schedule Surgery'}
        </button>
      </form>
    </div>
  );

  const renderScheduleList = () => {
    const displayedItems = surgicalSchedules.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Surgical Schedule</h3>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            + Schedule Surgery
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Procedure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Surgeon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedItems.map((schedule) => (
                <tr key={schedule.scheduleId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{schedule.patientName}</div>
                    <div className="text-sm text-gray-500">ID: {schedule.patientId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.procedure}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {operatingRooms.find(r => r.roomId === schedule.roomId)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{schedule.date}</div>
                    <div className="text-gray-500">{schedule.startTime} - {schedule.endTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {schedule.surgeon}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(schedule.priority)}`}>
                      {schedule.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(schedule.status)}`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {schedule.status === 'Scheduled' && (
                      <>
                        <button
                          onClick={() => handleCancelSurgery(schedule)}
                          className="text-red-600 hover:text-red-900 mr-2"
                        >
                          Cancel
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {surgicalSchedules.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(surgicalSchedules.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    );
  };

  const renderRoomStatus = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {operatingRooms.map((room) => (
        <div key={room.roomId} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-medium text-gray-900">{room.name}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${
              room.status === 'Available' ? 'bg-green-100 text-green-800' :
              room.status === 'In Use' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {room.status}
            </span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Type:</strong> {room.type}</p>
            <p><strong>Capacity:</strong> {room.capacity} persons</p>
            <p><strong>Next Service:</strong> {room.nextMaintenance}</p>
          </div>
          <div className="mt-3">
            <div className="text-xs text-gray-500">Equipment:</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {room.equipment.slice(0, 3).map((item, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {item}
                </span>
              ))}
              {room.equipment.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                  +{room.equipment.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="theater-scheduling p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Operating Theater Scheduling</h2>
        <p className="text-gray-600">OR booking, surgeon availability, and surgical coordination</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'schedule', label: 'Surgical Schedule', count: surgicalSchedules.length },
              { id: 'rooms', label: 'Operating Rooms', count: operatingRooms.length }
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
        {showForm && renderScheduleForm()}

        {activeTab === 'schedule' && !showForm && renderScheduleList()}
        {activeTab === 'rooms' && renderRoomStatus()}
      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        config={{
          title: 'Cancel Surgery',
          message: 'Are you sure you want to cancel this surgery? This action cannot be undone.',
          confirmText: 'Cancel Surgery',
          showSoftDeleteOption: false,
        }}
      />
    </div>
  );
};

export default TheaterScheduling;