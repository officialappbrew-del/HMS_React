import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Pill,
  FileText,
  Users,
  AlertCircle,
  Clipboard,
  Building2,
  TrendingUp,
  Eye,
  Clock
} from 'lucide-react';

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const { drugs } = useSelector(state => state.pharmacy || { drugs: [] });

  const [stats, setStats] = useState({
    prescriptionsPending: 0,
    lowStockItems: 0,
    expiringSoon: 0,
    dispensedToday: 0,
  });

  const [lowStockAlerts] = useState([
    { drug: 'Paracetamol', current: 45, reorder: 50, supplier: 'MediCorp' },
    { drug: 'Amoxicillin', current: 12, reorder: 20, supplier: 'PharmaPlus' },
    { drug: 'Insulin', current: 8, reorder: 15, supplier: 'MediCorp' }
  ]);

  const [pendingPrescriptions] = useState([
    { id: 1, patient: 'John Doe', medication: 'Amoxicillin 500mg', priority: 'High', time: '2 hours ago' },
    { id: 2, patient: 'Jane Smith', medication: 'Paracetamol', priority: 'Normal', time: '4 hours ago' },
    { id: 3, patient: 'Bob Johnson', medication: 'Insulin', priority: 'High', time: '1 hour ago' }
  ]);

  useEffect(() => {
    const lowStockItems = drugs.filter(drug => drug.quantityInStock <= drug.reorderLevel).length;
    setStats({
      prescriptionsPending: pendingPrescriptions.length,
      lowStockItems,
      expiringSoon: 5, // Mock
      dispensedToday: 23, // Mock
    });
  }, [drugs, pendingPrescriptions]);

  const quickActions = [
    { icon: Pill, label: 'Inventory', action: '/inventory', color: 'bg-blue-500' },
    { icon: FileText, label: 'Prescriptions', action: '/prescriptions', color: 'bg-green-500' },
    { icon: Users, label: 'Patient Profiles', action: '/patients', color: 'bg-purple-500' },
    { icon: AlertCircle, label: 'Drug Interactions', action: '/drug-interactions', color: 'bg-orange-500' },
    { icon: Clipboard, label: 'Reports', action: '/reports', color: 'bg-red-500' },
    { icon: Building2, label: 'Suppliers', action: '/suppliers', color: 'bg-pink-500' },
  ];

  return (
    <div className="dashboard p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pharmacist Dashboard</h1>
        <p className="text-gray-600 mt-2">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Critical Alerts */}
      {stats.lowStockItems > 0 && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Low Stock Alert</h3>
              <p className="text-sm text-red-700">{stats.lowStockItems} items below reorder level</p>
            </div>
            <button className="text-red-600 hover:text-red-800 font-medium text-sm">
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Prescriptions</p>
              <p className="text-3xl font-bold mt-2">{stats.prescriptionsPending}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Low Stock Items</p>
              <p className="text-3xl font-bold mt-2">{stats.lowStockItems}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Expiring Soon</p>
              <p className="text-3xl font-bold mt-2">{stats.expiringSoon}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Dispensed Today</p>
              <p className="text-3xl font-bold mt-2">{stats.dispensedToday}</p>
            </div>
            <Pill className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Prescriptions & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Prescriptions</h3>
          <div className="space-y-3">
            {pendingPrescriptions.map((prescription) => (
              <div key={prescription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{prescription.patient}</p>
                  <p className="text-xs text-gray-500">{prescription.medication} • {prescription.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  prescription.priority === 'High' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {prescription.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alerts</h3>
          <div className="space-y-3">
            {lowStockAlerts.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{item.drug}</p>
                  <p className="text-xs text-gray-500">Current: {item.current} • Reorder: {item.reorder}</p>
                </div>
                <span className="text-xs text-red-600 font-medium">Reorder Now</span>
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

      {/* Drug Information */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Drug Information & Updates</h2>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            <Eye className="w-4 h-4 inline mr-1" />
            View All
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">New drug recall notice</p>
              <p className="text-xs text-gray-500">Lot #12345 of Medication X - 1 hour ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">Inventory replenished</p>
              <p className="text-xs text-gray-500">50 units of Paracetamol received - 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
            <Clipboard className="w-5 h-5 text-yellow-500 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium">Monthly inventory report ready</p>
              <p className="text-xs text-gray-500">Click to download - Generated 4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;