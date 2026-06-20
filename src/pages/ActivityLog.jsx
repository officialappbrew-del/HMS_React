import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Users,
  AlertCircle,
  DollarSign,
  Pill,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Search,
  Filter,
  Calendar
} from 'lucide-react';

const ActivityLog = () => {
  const { patients } = useSelector(state => state.patient || { patients: [] });
  const { drugs, salesHistory } = useSelector(state => state.pharmacy || { drugs: [], salesHistory: [] });
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Generate comprehensive activity log from all modules
    const allActivities = [
      // Patient registration activities
      ...patients.map(p => ({
        id: p.id,
        type: 'patient_registration',
        title: 'Patient Registered',
        description: `${p.name} registered as a new patient`,
        details: `NIN: ${p.nin}, Phone: ${p.phone}, State: ${p.state}`,
        timestamp: p.createdAt,
        icon: Users,
        color: 'bg-blue-100 text-blue-600',
        severity: 'info'
      })),

      // Drug low stock alerts
      ...drugs
        .filter(d => d.quantityInStock <= d.reorderLevel)
        .map(d => ({
          id: `drug-${d.id}`,
          type: 'low_stock',
          title: 'Low Stock Alert',
          description: `${d.name} is running low on stock`,
          details: `Current stock: ${d.quantityInStock} units, Reorder level: ${d.reorderLevel}`,
          timestamp: new Date().toISOString(),
          icon: AlertCircle,
          color: 'bg-red-100 text-red-600',
          severity: 'urgent'
        })),

      // Expiring drugs
      ...drugs
        .filter(d => {
          const expiryDate = new Date(d.expiryDate);
          const today = new Date();
          const daysToExpiry = (expiryDate - today) / (1000 * 60 * 60 * 24);
          return daysToExpiry > 0 && daysToExpiry <= 30;
        })
        .map(d => ({
          id: `expiry-${d.id}`,
          type: 'expiring_drug',
          title: 'Drug Expiring Soon',
          description: `${d.name} will expire soon`,
          details: `Expiry Date: ${new Date(d.expiryDate).toLocaleDateString('en-NG')}`,
          timestamp: new Date().toISOString(),
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-600',
          severity: 'warning'
        })),

      // Drug sales/dispensing
      ...salesHistory.map(sale => ({
        id: sale.id,
        type: 'drug_dispensed',
        title: 'Drug Dispensed',
        description: `${sale.drugName} dispensed to patient`,
        details: `Quantity: ${sale.quantity} units, Amount: ₦${(sale.totalPrice || 0).toLocaleString('en-NG')}`,
        timestamp: sale.timestamp,
        icon: Pill,
        color: 'bg-green-100 text-green-600',
        severity: 'info'
      })),

      // Patient data updates
      ...patients
        .filter(p => p.updatedAt && p.updatedAt !== p.createdAt)
        .map(p => ({
          id: `update-${p.id}`,
          type: 'patient_updated',
          title: 'Patient Record Updated',
          description: `${p.name}'s record was updated`,
          details: `Last updated: ${new Date(p.updatedAt).toLocaleDateString('en-NG')}`,
          timestamp: p.updatedAt,
          icon: FileText,
          color: 'bg-purple-100 text-purple-600',
          severity: 'info'
        }))
    ];

    // Sort by timestamp (newest first)
    const sorted = allActivities.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    setActivities(sorted);
    applyFilters(sorted, searchTerm, filterType);
  }, [patients, drugs, salesHistory]);

  const applyFilters = (actList, search, type) => {
    let filtered = actList;

    if (type !== 'all') {
      filtered = filtered.filter(a => a.type === type);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(searchLower) ||
        a.description.toLowerCase().includes(searchLower) ||
        a.details.toLowerCase().includes(searchLower)
      );
    }

    setFilteredActivities(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(activities, value, filterType);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterType(value);
    applyFilters(activities, searchTerm, value);
  };

  const getActivityIcon = (iconComponent) => {
    return iconComponent;
  };

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'patient_registration', label: 'Patient Registration' },
    { value: 'patient_updated', label: 'Patient Updated' },
    { value: 'drug_dispensed', label: 'Drug Dispensed' },
    { value: 'low_stock', label: 'Low Stock Alert' },
    { value: 'expiring_drug', label: 'Expiring Drugs' },
  ];

  const getSeverityBadge = (severity) => {
    const badges = {
      urgent: 'bg-red-100 text-red-800 border border-red-300',
      warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      info: 'bg-blue-100 text-blue-800 border border-blue-300'
    };
    return badges[severity] || badges.info;
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Activity Log</h1>
        <p className="text-gray-600">Track all system activities and events</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Search Activities
            </label>
            <input
              type="text"
              placeholder="Search by name, patient, drug..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Filter by Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Activity Type
            </label>
            <select
              value={filterType}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-xs sm:text-sm text-gray-600">Total Activities</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{activities.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-xs sm:text-sm text-gray-600">Registered Patients</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{patients.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-xs sm:text-sm text-gray-600">Drugs Dispensed</p>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600">{salesHistory.length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
          <p className="text-xs sm:text-sm text-gray-600">Alerts</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-600">
            {activities.filter(a => a.severity !== 'info').length}
          </p>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No activities found</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors border-l-4"
                style={{
                  borderLeftColor:
                    activity.severity === 'urgent'
                      ? '#dc2626'
                      : activity.severity === 'warning'
                      ? '#f59e0b'
                      : '#3b82f6'
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`${activity.color} p-2 rounded-lg flex-shrink-0`}>
                        <activity.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full w-fit ${getSeverityBadge(activity.severity)}`}>
                            {activity.severity.charAt(0).toUpperCase() + activity.severity.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-700 mb-1">{activity.description}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{activity.details}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Time */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                    {new Date(activity.timestamp).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-center text-sm text-gray-600">
        Showing {filteredActivities.length} of {activities.length} activities
      </div>
    </div>
  );
};

export default ActivityLog;
