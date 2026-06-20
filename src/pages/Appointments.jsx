import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Appointments = () => {
  const dispatch = useDispatch();
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Chioma Okonkwo',
      patientId: 1,
      date: '2026-01-27',
      time: '10:00 AM',
      reason: 'General Checkup',
      doctor: 'Dr. Emeka',
      status: 'scheduled',
      notes: 'Regular health checkup'
    },
    {
      id: 2,
      patientName: 'John Adebayo',
      patientId: 2,
      date: '2026-01-28',
      time: '2:30 PM',
      reason: 'Follow-up Consultation',
      doctor: 'Dr. Ngozi',
      status: 'scheduled',
      notes: 'Follow-up on previous treatment'
    },
    {
      id: 3,
      patientName: 'Amara Ikechukwu',
      patientId: 3,
      date: '2026-01-26',
      time: '11:00 AM',
      reason: 'Vaccination',
      doctor: 'Dr. Emeka',
      status: 'completed',
      notes: 'Routine vaccination'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    date: '',
    time: '',
    reason: '',
    doctor: '',
    status: 'scheduled',
    notes: ''
  });

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (formData.patientName && formData.date && formData.time) {
      const newAppointment = {
        id: appointments.length + 1,
        ...formData
      };
      setAppointments([...appointments, newAppointment]);
      setFormData({
        patientName: '',
        patientId: '',
        date: '',
        time: '',
        reason: '',
        doctor: '',
        status: 'scheduled',
        notes: ''
      });
      setShowForm(false);
    }
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 flex items-center gap-1"><Clock className="w-3 h-3" />Scheduled</span>;
      case 'completed':
        return <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1"><XCircle className="w-3 h-3" />Cancelled</span>;
      default:
        return status;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Appointments Management</h1>
        <p className="text-gray-600 mt-2">Schedule and manage patient appointments</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Appointments</p>
              <p className="text-3xl font-bold mt-2">{appointments.length}</p>
            </div>
            <Calendar className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Scheduled</p>
              <p className="text-3xl font-bold mt-2">{appointments.filter(a => a.status === 'scheduled').length}</p>
            </div>
            <Clock className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-2">{appointments.filter(a => a.status === 'completed').length}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-nigerian-green text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Add Appointment Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Schedule New Appointment</h3>
          <form onSubmit={handleAddAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                placeholder="Enter patient name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
              <input
                type="text"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                placeholder="Doctor name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="e.g., General Checkup, Follow-up, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
                rows="3"
              />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-nigerian-green text-white py-2 rounded-lg hover:bg-opacity-90 transition-all font-medium"
              >
                Schedule Appointment
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Doctor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reason</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appointment, index) => (
                  <tr key={appointment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{appointment.patientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(appointment.date).toLocaleDateString('en-NG')} at {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.doctor}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.reason}</td>
                    <td className="px-6 py-4 text-sm">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-nigerian-green"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
