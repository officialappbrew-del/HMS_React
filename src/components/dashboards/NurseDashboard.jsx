import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Activity,
  Pill,
  Bed,
  Heart,
  Stethoscope,
  AlertCircle,
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { admissions } = useSelector(state => state.admission || { admissions: [] });

  const [stats, setStats] = useState({
    assignedPatients: 0,
    vitalsDue: 0,
    medicationsDue: 0,
    bedChecks: 0,
  });

  const [alerts] = useState([
    { id: 1, type: 'warning', message: 'Medication due - Room 203, 2pm', time: '10 min ago' },
    { id: 2, type: 'info', message: 'Vital signs check completed - Room 105', time: '30 min ago' },
    { id: 3, type: 'critical', message: 'Patient alert - Room 301', time: '5 min ago' }
  ]);

  const [assignedPatients] = useState([
    { id: 1, name: 'John Doe', room: '203', status: 'Stable', nextCheck: '14:00' },
    { id: 2, name: 'Jane Smith', room: '105', status: 'Critical', nextCheck: '13:30' },
    { id: 3, name: 'Bob Johnson', room: '301', status: 'Improving', nextCheck: '15:00' }
  ]);

  useEffect(() => {
    setStats({
      assignedPatients: assignedPatients.length,
      vitalsDue: 3, // Mock
      medicationsDue: 5, // Mock
      bedChecks: 2, // Mock
    });
  }, [assignedPatients]);

  const quickActions = [
    { icon: Users, label: 'My Patients', action: '/patients', color: 'bg-blue-500' },
    { icon: Activity, label: 'Vital Signs', action: '/vital-signs', color: 'bg-green-500' },
    { icon: Pill, label: 'Medications', action: '/pharmacy', color: 'bg-purple-500' },
    { icon: Bed, label: 'Bed Status', action: '/bed-allocation', color: 'bg-orange-500' },
    { icon: Heart, label: 'Admissions', action: '/admissions', color: 'bg-red-500' },
    { icon: Stethoscope, label: 'Ward Rounds', action: '/ward-rounds', color: 'bg-pink-500' },
  ];

  return (
    <div className="dashboard p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Nurse Dashboard</h1>
        <p className="text-gray-600 mt-2">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Alerts */}
      {alerts.filter(a => a.type === 'critical').length > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Patient Alert</h3>
              <p className="text-sm text-red-700">{alerts.filter(a => a.type === 'critical')[0].message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Assigned Patients</p>
              <p className="text-3xl font-bold mt-2">{stats.assignedPatients}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Vitals Due</p>
              <p className="text-3xl font-bold mt-2">{stats.vitalsDue}</p>
            </div>
            <Activity className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Medications Due</p>
              <p className="text-3xl font-bold mt-2">{stats.medicationsDue}</p>
            </div>
            <Pill className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Bed Checks</p>
              <p className="text-3xl font-bold mt-2">{stats.bedChecks}</p>
            </div>
            <Bed className="w-12 h-12 text-orange-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Patient List & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Assigned Patients</h3>
          <div className="space-y-3">
            {assignedPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{patient.name}</p>
                  <p className="text-xs text-gray-500">Room {patient.room} • Next check: {patient.nextCheck}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  patient.status === 'Critical' ? 'bg-red-100 text-red-800' :
                  patient.status === 'Stable' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {patient.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Tasks</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <Pill className="w-5 h-5 text-yellow-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Administer medication</p>
                <p className="text-xs text-gray-500">Room 203 - Due in 15 min</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <Activity className="w-5 h-5 text-blue-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Vital signs check</p>
                <p className="text-xs text-gray-500">Room 105 - Due now</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <Bed className="w-5 h-5 text-green-500 mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium">Bed check</p>
                <p className="text-xs text-gray-500">Ward A - Completed</p>
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

      {/* Alerts */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Alerts</h2>
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

export default NurseDashboard;