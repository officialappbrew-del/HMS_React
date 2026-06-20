import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Activity,
  AlertCircle,
  Calendar,
  FileText,
  Heart,
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { wardRounds } = useSelector(state => state.wardRound || { wardRounds: [] });
  const { admissions } = useSelector(state => state.admission || { admissions: [] });

  const [stats, setStats] = useState({
    myPatients: 0,
    todaysRounds: 0,
    pendingReviews: 0,
    criticalPatients: 0,
  });

  const [alerts] = useState([
    { id: 1, type: 'critical', message: 'Patient John Doe - Critical vitals', time: '5 min ago' },
    { id: 2, type: 'warning', message: 'Ward round overdue - Room 203', time: '15 min ago' },
    { id: 3, type: 'info', message: 'New lab results available', time: '1 hour ago' }
  ]);

  const [todaysSchedule] = useState([
    { time: '09:00', patient: 'John Doe', type: 'Consultation', status: 'completed' },
    { time: '10:30', patient: 'Jane Smith', type: 'Follow-up', status: 'in-progress' },
    { time: '14:00', patient: 'Bob Johnson', type: 'Ward Round', status: 'scheduled' },
    { time: '15:30', patient: 'Alice Brown', type: 'Surgery Review', status: 'scheduled' }
  ]);

  useEffect(() => {
    // Mock data - in real app, filter by assigned doctor
    setStats({
      myPatients: patients.length,
      todaysRounds: wardRounds.filter(r => r.status === 'Scheduled').length,
      pendingReviews: 5, // Mock
      criticalPatients: alerts.filter(a => a.type === 'critical').length,
    });
  }, [patients, wardRounds, alerts]);

  const quickActions = [
    { icon: Users, label: 'My Patients', action: '/patients', color: 'bg-blue-500' },
    { icon: Stethoscope, label: 'Ward Rounds', action: '/ward-rounds', color: 'bg-green-500' },
    { icon: Activity, label: 'Vital Signs', action: '/vital-signs', color: 'bg-purple-500' },
    { icon: FileText, label: 'EMR', action: '/emr', color: 'bg-orange-500' },
    { icon: Calendar, label: 'Schedule', action: '/appointments', color: 'bg-red-500' },
    { icon: Heart, label: 'Admissions', action: '/admissions', color: 'bg-pink-500' },
  ];

  return (
    <div className="dashboard p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-2">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.filter(a => a.type === 'critical').length > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Patient Alerts</h3>
              <p className="text-sm text-red-700">{alerts.filter(a => a.type === 'critical')[0].message}</p>
            </div>
            <button className="text-red-600 hover:text-red-800 font-medium text-sm">
              View All
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">My Patients</p>
              <p className="text-3xl font-bold mt-2">{stats.myPatients}</p>
              <div className="flex items-center mt-2 text-blue-600 text-sm">
                <Users className="w-4 h-4 mr-1" />
                <span>Active cases</span>
              </div>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Today's Rounds</p>
              <p className="text-3xl font-bold mt-2">{stats.todaysRounds}</p>
              <div className="flex items-center mt-2 text-green-600 text-sm">
                <Stethoscope className="w-4 h-4 mr-1" />
                <span>Scheduled</span>
              </div>
            </div>
            <Stethoscope className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Reviews</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingReviews}</p>
              <div className="flex items-center mt-2 text-orange-600 text-sm">
                <FileText className="w-4 h-4 mr-1" />
                <span>Requires attention</span>
              </div>
            </div>
            <FileText className="w-12 h-12 text-orange-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Critical Patients</p>
              <p className="text-3xl font-bold mt-2">{stats.criticalPatients}</p>
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Monitor closely</span>
              </div>
            </div>
            <AlertCircle className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Today's Schedule & Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {todaysSchedule.map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-500 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.time} - {item.patient}</p>
                  <p className="text-xs text-gray-500">{item.type}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.status === 'completed' ? 'bg-green-100 text-green-800' :
                  item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Patient Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Heart className="w-5 h-5 text-red-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">John Doe admitted</p>
                <p className="text-xs text-gray-500">Emergency - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Activity className="w-5 h-5 text-blue-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Vitals updated - Jane Smith</p>
                <p className="text-xs text-gray-500">BP: 120/80 - 30 min ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-green-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Lab results ready</p>
                <p className="text-xs text-gray-500">Bob Johnson - 1 hour ago</p>
              </div>
            </div>
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

      {/* Clinical Alerts */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Clinical Alerts</h2>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            <Eye className="w-4 h-4 inline mr-1" />
            View All
          </button>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`flex items-center p-3 rounded-lg ${
              alert.type === 'critical' ? 'bg-red-50 border-l-4 border-red-500' :
              alert.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
              'bg-blue-50 border-l-4 border-blue-500'
            }`}>
              <AlertCircle className={`w-5 h-5 mr-3 ${
                alert.type === 'critical' ? 'text-red-500' :
                alert.type === 'warning' ? 'text-yellow-500' :
                'text-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-gray-500">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;