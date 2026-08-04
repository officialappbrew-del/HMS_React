import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Link,
  Shield,
  CreditCard,
  Stethoscope,
  MessageSquare,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Key,
  Globe,
  Database,
  Zap,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  BarChart3,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import {
  configureIntegration,
  testIntegration,
  enableIntegration,
  disableIntegration,
  updateIntegrationCredentials,
  syncData,
  getIntegrationLogs,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  searchIntegrations,
  filterIntegrations
} from '../features/integrationsSlice';
import Pagination from '../components/Pagination';

const ExternalIntegrations = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'admin';
  const SYSTEM_ROLES = ['admin', 'super_admin', 'system_admin'];

  if (!SYSTEM_ROLES.includes(userRole)) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const dispatch = useDispatch();
  const {
    integrations,
    webhooks,
    logs,
    stats,
    searchTerm,
    filterBy,
    loading
  } = useSelector(state => state.integrations);

  const [activeTab, setActiveTab] = useState('overview');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [configForm, setConfigForm] = useState({
    system: '',
    category: '',
    apiEndpoint: '',
    apiKey: '',
    secretKey: '',
    username: '',
    password: '',
    additionalConfig: {}
  });

  const [webhookForm, setWebhookForm] = useState({
    name: '',
    integrationId: '',
    url: '',
    events: [],
    secret: '',
    active: true
  });

  // Integration categories
  const integrationCategories = {
    government: {
      title: 'Government Systems',
      icon: Shield,
      systems: [
        { id: 'nhis', name: 'NHIS Portal', description: 'National Health Insurance Scheme' },
        { id: 'nin', name: 'NIN System', description: 'National Identity Management Commission' },
        { id: 'nafdac', name: 'NAFDAC Database', description: 'National Agency for Food and Drug Administration' },
        { id: 'ncdc', name: 'NCDC Portal', description: 'Nigeria Centre for Disease Control' },
        { id: 'nimr', name: 'NIMR', description: 'Nigerian Institute of Medical Research' },
        { id: 'nphcda', name: 'NPHCDA', description: 'National Primary Health Care Development Agency' }
      ]
    },
    financial: {
      title: 'Financial Services',
      icon: CreditCard,
      systems: [
        { id: 'gtbank', name: 'GTBank API', description: 'Guaranty Trust Bank' },
        { id: 'uba', name: 'UBA API', description: 'United Bank for Africa' },
        { id: 'access', name: 'Access Bank API', description: 'Access Bank PLC' },
        { id: 'zenith', name: 'Zenith Bank API', description: 'Zenith Bank PLC' },
        { id: 'paystack', name: 'Paystack', description: 'Payment Gateway' },
        { id: 'flutterwave', name: 'Flutterwave', description: 'Payment Gateway' },
        { id: 'remita', name: 'Remita', description: 'Payment Gateway' },
        { id: 'quickbooks', name: 'QuickBooks', description: 'Accounting Software' }
      ]
    },
    healthcare: {
      title: 'Healthcare Services',
      icon: Stethoscope,
      systems: [
        { id: 'labcorp', name: 'LabCorp', description: 'Reference Laboratory' },
        { id: 'radnet', name: 'RadNet', description: 'Radiology Network' },
        { id: 'bloodbank', name: 'National Blood Bank', description: 'Blood Bank Network' },
        { id: 'pharmacy', name: 'Pharmacy Network', description: 'Prescription Delivery' },
        { id: 'telemedicine', name: 'Telemedicine Platform', description: 'Virtual Consultations' },
        { id: 'home_care', name: 'Home Care Services', description: 'Home Health Services' }
      ]
    },
    communication: {
      title: 'Communication Services',
      icon: MessageSquare,
      systems: [
        { id: 'bulk_sms', name: 'Bulk SMS Gateway', description: 'SMS Aggregator' },
        { id: 'whatsapp', name: 'WhatsApp Business API', description: 'WhatsApp Integration' },
        { id: 'sendgrid', name: 'SendGrid', description: 'Email Service' },
        { id: 'twilio', name: 'Twilio', description: 'Voice & SMS' },
        { id: 'ussd', name: 'USSD Aggregator', description: 'USSD Services' },
        { id: 'firebase', name: 'Firebase Cloud Messaging', description: 'Push Notifications' }
      ]
    }
  };

  // Filter and search logic
  const filteredIntegrations = Object.values(integrations)
    .filter(integration => {
      const matchesSearch = !searchTerm ||
        integration.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.system?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || integration.category === filterBy || integration.status === filterBy;
      return matchesSearch && matchesFilter;
    });

  const filteredLogs = logs
    .filter(log => {
      const matchesSearch = !searchTerm ||
        log.integrationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.message?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const paginatedItems = activeTab === 'logs' ? filteredLogs : filteredIntegrations;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleConfigureIntegration = (e) => {
    e.preventDefault();
    dispatch(configureIntegration(configForm));
    setConfigForm({
      system: '',
      category: '',
      apiEndpoint: '',
      apiKey: '',
      secretKey: '',
      username: '',
      password: '',
      additionalConfig: {}
    });
    setShowConfigModal(false);
  };

  const handleCreateWebhook = (e) => {
    e.preventDefault();
    dispatch(createWebhook(webhookForm));
    setWebhookForm({
      name: '',
      integrationId: '',
      url: '',
      events: [],
      secret: '',
      active: true
    });
    setShowWebhookModal(false);
  };

  const handleTestIntegration = (integrationId) => {
    dispatch(testIntegration({ integrationId }));
  };

  const handleToggleIntegration = (integrationId, currentlyEnabled) => {
    if (currentlyEnabled) {
      dispatch(disableIntegration({ integrationId }));
    } else {
      dispatch(enableIntegration({ integrationId }));
    }
  };

  const handleSyncData = (integrationId) => {
    dispatch(syncData({ integrationId }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'testing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default: return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const activeIntegrations = Object.values(integrations).filter(i => i.status === 'active').length;
  const totalIntegrations = Object.keys(integrations).length;
  const errorIntegrations = Object.values(integrations).filter(i => i.status === 'error').length;

  return (
    <div className="external-integrations p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <Link className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-500" />
          External System Integrations
        </h1>
        <p className="text-gray-600 mt-2">Manage connections with external systems and APIs</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Integrations</p>
              <p className="text-3xl font-bold mt-2">{activeIntegrations}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Systems</p>
              <p className="text-3xl font-bold mt-2">{totalIntegrations}</p>
            </div>
            <Database className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Error States</p>
              <p className="text-3xl font-bold mt-2">{errorIntegrations}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Data Syncs Today</p>
              <p className="text-3xl font-bold mt-2">{stats.todaySyncs}</p>
            </div>
            <RefreshCw className="w-12 h-12 text-purple-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'integrations', label: 'Integrations', icon: Settings },
            { id: 'webhooks', label: 'Webhooks', icon: Zap },
            { id: 'logs', label: 'Activity Logs', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Integration Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(integrationCategories).map(([categoryKey, category]) => {
                const categoryIntegrations = Object.values(integrations).filter(i => i.category === categoryKey);
                const activeCount = categoryIntegrations.filter(i => i.status === 'active').length;

                return (
                  <div key={categoryKey} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <category.icon className="w-6 h-6 text-blue-500 mr-3" />
                        <h4 className="text-lg font-medium">{category.title}</h4>
                      </div>
                      <span className="text-sm text-gray-500">
                        {activeCount}/{category.systems.length} active
                      </span>
                    </div>

                    <div className="space-y-3">
                      {category.systems.slice(0, 4).map(system => {
                        const integration = Object.values(integrations).find(i => i.system === system.id);
                        const isActive = integration?.status === 'active';

                        return (
                          <div key={system.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium text-sm">{system.name}</p>
                              <p className="text-xs text-gray-600">{system.description}</p>
                            </div>
                            <div className="flex items-center">
                              {integration ? (
                                <>
                                  {getStatusIcon(integration.status)}
                                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(integration.status)}`}>
                                    {integration.status}
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs text-gray-500">Not configured</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm font-medium">
                      Manage {category.title}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search integrations..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchIntegrations(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterIntegrations(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="government">Government</option>
                  <option value="financial">Financial</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="communication">Communication</option>
                  <option value="active">Active Only</option>
                  <option value="error">Errors Only</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Integration
                </button>
              </div>

              <div className="flex items-end">
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync All
                </button>
              </div>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.map(integration => (
                <div key={integration.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {integration.category === 'government' && <Shield className="w-5 h-5 text-green-500 mr-3" />}
                      {integration.category === 'financial' && <CreditCard className="w-5 h-5 text-blue-500 mr-3" />}
                      {integration.category === 'healthcare' && <Stethoscope className="w-5 h-5 text-red-500 mr-3" />}
                      {integration.category === 'communication' && <MessageSquare className="w-5 h-5 text-purple-500 mr-3" />}
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{integration.category}</p>
                      </div>
                    </div>
                    {getStatusIcon(integration.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(integration.status)}`}>
                        {integration.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Sync:</span>
                      <span>{integration.lastSync ? new Date(integration.lastSync).toLocaleDateString('en-NG') : 'Never'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">API Calls:</span>
                      <span>{integration.apiCallsToday || 0}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestIntegration(integration.id)}
                      className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => handleToggleIntegration(integration.id, integration.status === 'active')}
                      className={`flex-1 px-3 py-2 rounded text-sm ${
                        integration.status === 'active'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {integration.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleSyncData(integration.id)}
                      className="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Webhook Management</h3>
              <button
                onClick={() => setShowWebhookModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Webhook
              </button>
            </div>

            <div className="space-y-4">
              {webhooks.map(webhook => (
                <div key={webhook.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{webhook.name}</h4>
                      <p className="text-sm text-gray-600">{webhook.url}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        webhook.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {webhook.active ? 'Active' : 'Inactive'}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Integration</p>
                      <p className="text-sm">{integrations[webhook.integrationId]?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Events</p>
                      <p className="text-sm">{webhook.events.length} configured</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Triggered</p>
                      <p className="text-sm">{webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleString('en-NG') : 'Never'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Success Rate</p>
                      <p className="text-sm">{webhook.successRate || 0}%</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      Test Webhook
                    </button>
                    <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                      View Logs
                    </button>
                  </div>
                </div>
              ))}

              {webhooks.length === 0 && (
                <p className="text-gray-500 text-center py-8">No webhooks configured yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Integration Activity Logs</h3>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchIntegrations(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterIntegrations(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Logs</option>
                  <option value="success">Success</option>
                  <option value="error">Errors</option>
                  <option value="warning">Warnings</option>
                </select>
              </div>
            </div>

            {/* Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Integration</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {integrations[log.integrationId]?.name || log.integrationId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.action}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {log.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'integrations' || activeTab === 'logs') && paginatedItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(paginatedItems.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Integration Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configure Integration
              </h3>
              <form onSubmit={handleConfigureIntegration} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={configForm.category}
                      onChange={(e) => setConfigForm({...configForm, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select category...</option>
                      <option value="government">Government Systems</option>
                      <option value="financial">Financial Services</option>
                      <option value="healthcare">Healthcare Services</option>
                      <option value="communication">Communication Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">System *</label>
                    <select
                      value={configForm.system}
                      onChange={(e) => setConfigForm({...configForm, system: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select system...</option>
                      {configForm.category && integrationCategories[configForm.category]?.systems.map(system => (
                        <option key={system.id} value={system.id}>{system.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint *</label>
                  <input
                    type="url"
                    value={configForm.apiEndpoint}
                    onChange={(e) => setConfigForm({...configForm, apiEndpoint: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://api.example.com/v1"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <input
                      type="password"
                      value={configForm.apiKey}
                      onChange={(e) => setConfigForm({...configForm, apiKey: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter API key"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                    <input
                      type="password"
                      value={configForm.secretKey}
                      onChange={(e) => setConfigForm({...configForm, secretKey: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter secret key"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={configForm.username}
                      onChange={(e) => setConfigForm({...configForm, username: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Username (if required)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={configForm.password}
                      onChange={(e) => setConfigForm({...configForm, password: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Password (if required)"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Configure Integration
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Creation Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Create Webhook
              </h3>
              <form onSubmit={handleCreateWebhook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Webhook Name *</label>
                  <input
                    type="text"
                    value={webhookForm.name}
                    onChange={(e) => setWebhookForm({...webhookForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Integration *</label>
                  <select
                    value={webhookForm.integrationId}
                    onChange={(e) => setWebhookForm({...webhookForm, integrationId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select integration...</option>
                    {Object.values(integrations).map(integration => (
                      <option key={integration.id} value={integration.id}>{integration.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL *</label>
                  <input
                    type="url"
                    value={webhookForm.url}
                    onChange={(e) => setWebhookForm({...webhookForm, url: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="https://your-app.com/webhook"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                  <input
                    type="password"
                    value={webhookForm.secret}
                    onChange={(e) => setWebhookForm({...webhookForm, secret: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="Webhook secret for verification"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
                  >
                    Create Webhook
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWebhookModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalIntegrations;