import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  FileText,
  Phone,
  Ambulance,
  Clipboard,
  AlertCircle,
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { appointments } = useSelector(state => state.appointment || { appointments: [] });

  const [stats, setStats] = useState({
    todaysAppointments: 0,
    waitingPatients: 0,
    checkIns: 0,
    referrals: 0,
  });

  const [queue] = useState([
    { id: 1, name: 'John Doe', type: 'Consultation', waitTime: '15 min', status: 'Waiting' },
    { id: 2, name: 'Jane Smith', type: 'Follow-up', waitTime: '8 min', status: 'In Room' },
    { id: 3, name: 'Bob Johnson', type: 'Emergency', waitTime: '2 min', status: 'Waiting' }
  ]);

  const [upcomingAppointments] = useState([
    { time: '14:00', patient: 'Alice Brown', type: 'Consultation', doctor: 'Dr. Smith' },
    { time: '14:30', patient: 'Charlie Wilson', type: 'Follow-up', doctor: 'Dr. Johnson' },
    { time: '15:00', patient: 'Diana Davis', type: 'New Patient', doctor: 'Dr. Smith' }
  ]);

  useEffect(() => {
    setStats({
      todaysAppointments: upcomingAppointments.length,
      waitingPatients: queue.filter(q => q.status === 'Waiting').length,
      checkIns: 12, // Mock
      referrals: 3, // Mock
    });
  }, [upcomingAppointments, queue]);

  const quickActions = [
    { icon: Users, label: 'Register Patient', action: '/patients', color: 'bg-blue-500' },
    { icon: Calendar, label: 'Schedule Appointment', action: '/appointments', color: 'bg-green-500' },
    { icon: FileText, label: 'Billing', action: '/billing', color: 'bg-purple-500' },
    { icon: Phone, label: 'Communications', action: '/communications', color: 'bg-orange-500' },
    { icon: Ambulance, label: 'Referrals', action: '/referrals', color: 'bg-red-500' },
    { icon: Clipboard, label: 'Queue Management', action: '/queue', color: 'bg-pink-500' },
  ];

  return (
    <div className="dashboard p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Receptionist Dashboard</h1>
        <p className="text-gray-600 mt-2">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Today's Appointments</p>
              <p className="text-3xl font-bold mt-2">{stats.todaysAppointments}</p>
            </div>
            <Calendar className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Waiting Patients</p>
              <p className="text-3xl font-bold mt-2">{stats.waitingPatients}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Check-ins Today</p>
              <p className="text-3xl font-bold mt-2">{stats.checkIns}</p>
            </div>
            <Users className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Referrals</p>
              <p className="text-3xl font-bold mt-2">{stats.referrals}</p>
            </div>
            <Ambulance className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Queue & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Queue</h3>
          <div className="space-y-3">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.type} • Wait: {item.waitTime}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'In Room' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
          <div className="space-y-3">
            {upcomingAppointments.map((apt, index) => (
              <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-500 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{apt.time} - {apt.patient}</p>
                  <p className="text-xs text-gray-500">{apt.type} • {apt.doctor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.action)}
                className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center justify-center h-20`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-xs font-medium text-center">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Communications */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Communications</h2>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            <Eye className="w-4 h-4 inline mr-1" />
            View All
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-green-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">Incoming call from Dr. Smith</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">Referral request received</p>
              <p className="text-xs text-gray-500">General Hospital - 15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">Appointment reminder sent</p>
              <p className="text-xs text-gray-500">5 patients notified - 30 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;