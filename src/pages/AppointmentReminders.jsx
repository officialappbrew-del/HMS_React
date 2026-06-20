import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  Send,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  BarChart3,
  PieChart
} from 'lucide-react';
import {
  scheduleReminder,
  sendMessage,
  createCampaign,
  executeCampaign,
  createTemplate,
  generateAppointmentReminders,
  searchCommunications,
  sortCommunications,
  filterCommunications
} from '../features/communicationSlice';
import Pagination from '../components/Pagination';

const AppointmentReminders = () => {
  const dispatch = useDispatch();
  const {
    reminders,
    templates,
    campaigns,
    sentMessages,
    stats,
    searchTerm,
    sortBy,
    filterBy
  } = useSelector(state => state.communication);

  const [activeTab, setActiveTab] = useState('reminders');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [templateForm, setTemplateForm] = useState({
    name: '',
    type: 'sms',
    channels: ['sms'],
    content: '',
    variables: []
  });

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    templateId: '',
    recipients: [],
    scheduledTime: '',
    channels: ['sms']
  });

  // Filter and search logic
  const filteredReminders = reminders
    .filter(reminder => {
      const matchesSearch = !searchTerm ||
        reminder.appointmentId?.includes(searchTerm) ||
        reminder.patientId?.includes(searchTerm);
      const matchesFilter = filterBy === 'all' || reminder.status === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.scheduledTime) - new Date(a.scheduledTime);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  const filteredMessages = sentMessages
    .filter(message => {
      const matchesSearch = !searchTerm ||
        message.recipient?.phone?.includes(searchTerm) ||
        message.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterBy === 'all' || message.status === filterBy || message.channel === filterBy;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

  const paginatedItems = activeTab === 'reminders' ? filteredReminders : filteredMessages;
  const paginatedData = paginatedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateTemplate = (e) => {
    e.preventDefault();
    dispatch(createTemplate(templateForm));
    setTemplateForm({
      name: '',
      type: 'sms',
      channels: ['sms'],
      content: '',
      variables: []
    });
    setShowTemplateModal(false);
  };

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    dispatch(createCampaign(campaignForm));
    setCampaignForm({
      name: '',
      templateId: '',
      recipients: [],
      scheduledTime: '',
      channels: ['sms']
    });
    setShowCampaignModal(false);
  };

  const handleExecuteCampaign = (campaignId) => {
    dispatch(executeCampaign({ campaignId }));
  };

  const handleSendTestMessage = (templateId) => {
    const template = templates[templateId];
    if (template) {
      dispatch(sendMessage({
        recipient: { phone: '+2348012345678', name: 'Test User' },
        content: template.content,
        channel: template.channels[0],
        templateId,
        priority: 'high'
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'sms': return <Phone className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <Send className="w-4 h-4" />;
    }
  };

  const pendingReminders = reminders.filter(r => r.status === 'scheduled');
  const activeCampaigns = campaigns.filter(c => c.status === 'executing' || c.status === 'scheduled');

  return (
    <div className="appointment-reminders p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
          <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-blue-500" />
          Appointment Reminders & Communication
        </h1>
        <p className="text-gray-600 mt-2">Automated patient communication and reminder system</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Sent</p>
              <p className="text-3xl font-bold mt-2">{stats.totalSent}</p>
            </div>
            <Send className="w-12 h-12 text-blue-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Delivered</p>
              <p className="text-3xl font-bold mt-2">{stats.delivered}</p>
              <p className="text-sm text-gray-600 mt-1">
                {stats.totalSent > 0 ? Math.round((stats.delivered / stats.totalSent) * 100) : 0}% success rate
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold mt-2">{stats.pending}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Failed</p>
              <p className="text-3xl font-bold mt-2">{stats.failed}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'reminders', label: 'Reminders', icon: Calendar },
            { id: 'templates', label: 'Templates', icon: MessageSquare },
            { id: 'campaigns', label: 'Campaigns', icon: Users },
            { id: 'messages', label: 'Messages', icon: Send },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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
        {activeTab === 'reminders' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reminders..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchCommunications(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterCommunications(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Reminders</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(sortCommunications(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Date</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => dispatch(generateAppointmentReminders())}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Generate Reminders
                </button>
              </div>
            </div>

            {/* Pending Reminders Alert */}
            {pendingReminders.length > 0 && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center text-yellow-800">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Pending Reminders ({pendingReminders.length})
                </h3>
                <div className="space-y-2">
                  {pendingReminders.slice(0, 3).map(reminder => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium">Appointment {reminder.appointmentId}</p>
                        <p className="text-sm text-gray-600">
                          Scheduled: {new Date(reminder.scheduledTime).toLocaleString('en-NG')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Channels: {reminder.channels.join(', ')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(reminder.status)}`}>
                        {reminder.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reminders Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channels</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(reminder => (
                    <tr key={reminder.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {reminder.appointmentId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reminder.patientId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {templates[reminder.templateId]?.name || reminder.templateId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {reminder.channels.map(channel => (
                            <span key={channel} className="text-gray-400">
                              {getChannelIcon(channel)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reminder.scheduledTime).toLocaleString('en-NG')}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(reminder.status)}`}>
                          {reminder.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Message Templates</h3>
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(templates).map(template => (
                <div key={template.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{template.name}</h4>
                    <div className="flex gap-1">
                      {template.channels.map(channel => (
                        <span key={channel} className="text-gray-400">
                          {getChannelIcon(channel)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{template.content}</p>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      template.type === 'bulk' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {template.type}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSendTestMessage(template.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Test
                      </button>
                      <button className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Communication Campaigns</h3>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </button>
            </div>

            {/* Active Campaigns Alert */}
            {activeCampaigns.length > 0 && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">Active Campaigns</h4>
                <div className="space-y-2">
                  {activeCampaigns.map(campaign => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-gray-600">
                          {campaign.sentCount} sent • {campaign.deliveredCount} delivered
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">
                        Template: {templates[campaign.templateId]?.name || 'Unknown'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Recipients</p>
                      <p className="text-sm">{campaign.recipients.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Sent</p>
                      <p className="text-sm">{campaign.sentCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Delivered</p>
                      <p className="text-sm">{campaign.deliveredCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Scheduled</p>
                      <p className="text-sm">{new Date(campaign.scheduledTime).toLocaleDateString('en-NG')}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {campaign.status === 'scheduled' && (
                      <button
                        onClick={() => handleExecuteCampaign(campaign.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Execute Now
                      </button>
                    )}
                    <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {campaigns.length === 0 && (
                <p className="text-gray-500 text-center py-8">No campaigns created yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchCommunications(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterCommunications(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Messages</option>
                  <option value="delivered">Delivered</option>
                  <option value="sent">Sent</option>
                  <option value="failed">Failed</option>
                  <option value="sms">SMS Only</option>
                  <option value="whatsapp">WhatsApp Only</option>
                  <option value="email">Email Only</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium flex items-center justify-center">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Messages Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map(message => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {message.recipient?.phone || message.recipient?.email || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getChannelIcon(message.channel)}
                          <span className="ml-2 text-sm text-gray-500 capitalize">{message.channel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {message.content}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(message.sentAt).toLocaleString('en-NG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Communication Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Channel Performance */}
              <div>
                <h4 className="font-medium mb-3">Channel Performance</h4>
                <div className="space-y-3">
                  {['sms', 'whatsapp', 'email'].map(channel => {
                    const channelMessages = sentMessages.filter(m => m.channel === channel);
                    const delivered = channelMessages.filter(m => m.status === 'delivered').length;
                    const total = channelMessages.length;
                    const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

                    return (
                      <div key={channel} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            {getChannelIcon(channel)}
                            <span className="ml-2 font-medium capitalize">{channel}</span>
                          </div>
                          <span className="text-sm text-gray-600">{successRate}% success</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${successRate}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {delivered} of {total} messages delivered
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Template Usage */}
              <div>
                <h4 className="font-medium mb-3">Popular Templates</h4>
                <div className="space-y-3">
                  {Object.values(templates).slice(0, 5).map(template => {
                    const usage = sentMessages.filter(m => m.templateId === template.id).length;
                    return (
                      <div key={template.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{template.name}</span>
                          <span className="text-sm text-gray-600">{usage} sent</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(activeTab === 'reminders' || activeTab === 'messages') && paginatedItems.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(paginatedItems.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Template Creation Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create Message Template
              </h3>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                  <input
                    type="text"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={templateForm.type}
                    onChange={(e) => setTemplateForm({...templateForm, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                    <option value="bulk">Bulk Campaign</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
                  <div className="flex gap-2">
                    {['sms', 'whatsapp', 'email'].map(channel => (
                      <label key={channel} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={templateForm.channels.includes(channel)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTemplateForm({
                                ...templateForm,
                                channels: [...templateForm.channels, channel]
                              });
                            } else {
                              setTemplateForm({
                                ...templateForm,
                                channels: templateForm.channels.filter(c => c !== channel)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm capitalize">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                  <textarea
                    value={templateForm.content}
                    onChange={(e) => setTemplateForm({...templateForm, content: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Use {variable_name} for dynamic content"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
                  >
                    Create Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTemplateModal(false)}
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

      {/* Campaign Creation Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create Communication Campaign
              </h3>
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                  <select
                    value={campaignForm.templateId}
                    onChange={(e) => setCampaignForm({...campaignForm, templateId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select template...</option>
                    {Object.values(templates).map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Time</label>
                  <input
                    type="datetime-local"
                    value={campaignForm.scheduledTime}
                    onChange={(e) => setCampaignForm({...campaignForm, scheduledTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Channels</label>
                  <div className="flex gap-2">
                    {['sms', 'whatsapp', 'email'].map(channel => (
                      <label key={channel} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={campaignForm.channels.includes(channel)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCampaignForm({
                                ...campaignForm,
                                channels: [...campaignForm.channels, channel]
                              });
                            } else {
                              setCampaignForm({
                                ...campaignForm,
                                channels: campaignForm.channels.filter(c => c !== channel)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm capitalize">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium"
                  >
                    Create Campaign
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCampaignModal(false)}
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

export default AppointmentReminders;