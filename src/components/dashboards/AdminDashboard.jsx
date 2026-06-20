import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../hooks/useLoading';
import LoadingSpinner from '../LoadingSpinner';
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  AlertCircle,
  Calendar,
  FileText,
  Pill,
  Bed,
  Heart,
  Stethoscope,
  Building2,
  Clipboard,
  Shield,
  Ambulance,
  Smartphone,
  Phone,
  Eye,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { withLoading } = useLoading();
  const { subdomain, name: hospitalName } = useSelector(state => state.tenant || {});
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { drugs } = useSelector(state => state.pharmacy || { drugs: [] });
  const { staff } = useSelector(state => state.staff || { staff: [] });
  const { wards, stats: wardStats } = useSelector(state => state.ward || { wards: [], stats: {} });
  const { admissions } = useSelector(state => state.admission || { admissions: [] });

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    criticalAlerts: 0,
    staffCount: 0,
    lowStockItems: 0,
  });

  const [alerts] = useState([
    { id: 1, type: 'critical', message: 'Oxygen concentrator #3 needs maintenance', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'Low stock: Paracetamol (50 tablets remaining)', time: '15 min ago' },
    { id: 3, type: 'info', message: 'Monthly revenue target achieved', time: '1 hour ago' }
  ]);

  useEffect(() => {
    const lowStockItems = drugs.filter(drug => drug.quantityInStock <= drug.reorderLevel).length;
    const totalRevenue = patients.length * 500000; // Placeholder calculation
    const occupancyRate = wardStats.occupiedBeds ? Math.round((wardStats.occupiedBeds / wardStats.totalBeds) * 100) : 0;

    setStats({
      totalPatients: patients.length,
      totalRevenue,
      occupancyRate,
      criticalAlerts: alerts.filter(a => a.type === 'critical').length,
      staffCount: staff.length,
      lowStockItems,
    });
  }, [patients, drugs, staff, wardStats, alerts]);

  // Quick Actions - Limited to most critical
  const quickActions = [
    { icon: Users, label: 'Register Patient', action: '/patients', color: 'bg-blue-500' },
    { icon: Calendar, label: 'Schedule Appointment', action: '/appointments', color: 'bg-green-500' },
    { icon: FileText, label: 'Create Bill', action: '/billing', color: 'bg-purple-500' },
    { icon: Pill, label: 'Check Inventory', action: '/inventory', color: 'bg-orange-500' },
    { icon: Bed, label: 'Bed Status', action: '/bed-allocation', color: 'bg-red-500' },
    { icon: Heart, label: 'Admissions', action: '/admissions', color: 'bg-pink-500' },
    { icon: Building2, label: 'Staff Directory', action: '/staff', color: 'bg-indigo-500' },
    { icon: Settings, label: 'System Settings', action: '/settings', color: 'bg-gray-500' },
  ];

  return (
    <div className="dashboard p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to FAMBA Hospital Management System
              {/* Welcome to {hospitalName || subdomain || 'Hospital'} Management System */}
            </h1>
            <p className="text-gray-600 mt-2">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          {/* <button className="px-4 py-2 bg-nigerian-green text-white rounded-lg hover:bg-green-600 font-medium">
            <Settings className="w-4 h-4 inline mr-2" />
            Customize Dashboard
          </button> */}
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {alerts.filter(a => a.type === 'critical').length > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Critical Alerts</h3>
              <p className="text-sm text-red-700">{alerts.filter(a => a.type === 'critical')[0].message}</p>
            </div>
            <button className="text-red-600 hover:text-red-800 font-medium text-sm">
              View All ({stats.criticalAlerts})
            </button>
          </div>
        </div>
      )}

      {/* Top KPIs - Only 4 critical metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-nigerian-green cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold mt-2">{stats.totalPatients}</p>
              <div className="flex items-center mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>↑ 12% from last month</span>
              </div>
            </div>
            <Users className="w-12 h-12 text-nigerian-green opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-nigerian-gold cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Revenue</p>
              <p className="text-3xl font-bold mt-2 naira">{stats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>↑ 8% from last month</span>
              </div>
            </div>
            <DollarSign className="w-12 h-12 text-nigerian-gold opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Bed Occupancy</p>
              <p className="text-3xl font-bold mt-2">{stats.occupancyRate}%</p>
              <div className="flex items-center mt-2 text-gray-600 text-sm">
                <Bed className="w-4 h-4 mr-1" />
                <span>{wardStats.occupiedBeds || 0}/{wardStats.totalBeds || 120} beds</span>
              </div>
            </div>
            <Bed className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Critical Alerts</p>
              <p className="text-3xl font-bold mt-2">{stats.criticalAlerts}</p>
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Requires attention</span>
              </div>
            </div>
            <AlertCircle className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Charts Section - Placeholder for now */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart placeholder - Revenue over time
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Performance Indicators</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            KPI chart placeholder
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
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

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
          <button className="text-nigerian-green hover:text-green-600 font-medium">
            <Eye className="w-4 h-4 inline mr-1" />
            View All
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-blue-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">New patient registered</p>
              <p className="text-xs text-gray-500">John Doe - 2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-green-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">Bill generated</p>
              <p className="text-xs text-gray-500">₦45,000 - 15 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Bed className="w-5 h-5 text-purple-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">Bed allocated</p>
              <p className="text-xs text-gray-500">Ward A, Room 203 - 1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;