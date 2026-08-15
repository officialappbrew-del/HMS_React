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
  WifiOff,
  X,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Printer,
  Download,
  User,
  Loader2,
  Check,
  FileText,
  Pill,
  Bed,
  Heart,
  Building2,
  Clipboard,
  Ambulance,
  Smartphone,
  Phone,
  Home,
  Briefcase,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  HeartPulse,
  Brain,
  Bone,
  EyeOff,
  Star,
  Award,
  Info,
  Clock,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Hospital,
  Upload,
  UserCircle,
  IdCard,
  Droplets,
  Baby,
  MapPin,
  Globe as GlobeIcon,
  BookOpen,
  Mail,
  UserPlus,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
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

// ==================== TOOLTIP COMPONENT ====================
const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow(!show)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 ${positionClasses[position]} whitespace-nowrap`}>
          <div className="bg-[#1A1A1A] text-white text-[10px] px-2 py-1 shadow-lg">
            {text}
            <div className={`absolute w-1.5 h-1.5 bg-[#1A1A1A] transform rotate-45 ${
              position === 'top' ? 'bottom-[-3px] left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-[-3px] left-1/2 -translate-x-1/2' :
              position === 'left' ? 'right-[-3px] top-1/2 -translate-y-1/2' :
              'left-[-3px] top-1/2 -translate-y-1/2'
            }`} />
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== ICON BUTTON ====================
const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false, size = 'sm' }) => {
  const variantClasses = {
    default: 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]',
    primary: 'text-[#008751] hover:text-[#006B40] hover:bg-[#E8F5EF]',
    success: 'text-[#2D7D46] hover:text-[#1E5F33] hover:bg-[#EAF3EE]',
    danger: 'text-[#C8553D] hover:text-[#A8442E] hover:bg-[#F5EDEA]',
    warning: 'text-[#C87D3D] hover:text-[#A8662E] hover:bg-[#F5F0EA]',
    info: 'text-[#008751] hover:text-[#006B40] hover:bg-[#E8F5EF]',
  };

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`rounded transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Icon className={iconSizes[size]} />
      </button>
    </Tooltip>
  );
};

// ==================== BUTTON WITH TOOLTIP ====================
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '', disabled = false, size = 'sm', type = 'button' }) => {
  const variantClasses = {
    primary: 'bg-[#008751] hover:bg-[#006B40] text-white',
    secondary: 'bg-white border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
    success: 'bg-[#2D7D46] hover:bg-[#1E5F33] text-white',
    danger: 'bg-[#C8553D] hover:bg-[#A8442E] text-white',
    warning: 'bg-[#C87D3D] hover:bg-[#A8662E] text-white',
    outline: 'border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`rounded transition-all duration-200 flex items-center gap-1.5 font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

// ==================== STATS CARD ====================
const StatsCard = ({ title, value, subValue, icon: Icon, color, trend, trendValue, tooltip, onClick, className = '' }) => {
  const trendColors = {
    up: 'text-[#2D7D46]',
    down: 'text-[#C8553D]',
    neutral: 'text-[#5A5A5A]'
  };

  const colorMap = {
    green: 'bg-[#008751]',
    gold: 'bg-[#FFC107]',
    terracotta: 'bg-[#C8553D]',
    warm: 'bg-[#C87D3D]',
    slate: 'bg-[#4A5A5A]',
    blue: 'bg-[#008751]',
    purple: 'bg-[#4A5A5A]',
    red: 'bg-[#C8553D]',
  };

  return (
    <Tooltip text={tooltip}>
      <div 
        onClick={onClick}
        className={`bg-white border border-[#E8E3DC] p-5 ${onClick ? 'cursor-pointer hover:border-[#008751] transition-colors' : ''} ${className}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
            <p className="mt-1 text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">{value}</p>
            {subValue && (
              <p className="text-xs text-[#5A5A5A] mt-0.5">{subValue}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-1 text-xs ${trendColors[trend]} font-medium`}>
                {trend === 'up' && <ArrowUp className="w-3 h-3 mr-0.5" />}
                {trend === 'down' && <ArrowDown className="w-3 h-3 mr-0.5" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-10 h-10 ${colorMap[color]} rounded flex items-center justify-center flex-shrink-0 ml-3`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

// ==================== STATUS BADGE ====================
const StatusBadge = ({ status }) => {
  const statusMap = {
    'active': { label: 'Active', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'inactive': { label: 'Inactive', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
    'error': { label: 'Error', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'testing': { label: 'Testing', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'success': { label: 'Success', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'warning': { label: 'Warning', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
  };

  const config = statusMap[status] || statusMap['inactive'];
  
  const statusIcons = {
    'active': <CheckCircle className="w-3 h-3" />,
    'inactive': <XCircle className="w-3 h-3" />,
    'error': <AlertTriangle className="w-3 h-3" />,
    'pending': <Clock className="w-3 h-3" />,
    'testing': <RefreshCw className="w-3 h-3 animate-spin" />,
    'success': <CheckCircle className="w-3 h-3" />,
    'warning': <AlertTriangle className="w-3 h-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {statusIcons[status]}
      {config.label}
    </span>
  );
};

// ==================== CATEGORY CARD ====================
const CategoryCard = ({ category, icon: Icon, systems, integrations, onManage }) => {
  const activeCount = systems.filter(s => {
    const integration = Object.values(integrations).find(i => i.system === s.id);
    return integration?.status === 'active';
  }).length;

  return (
    <div className="bg-white border border-[#E8E3DC] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#E8F5EF] flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#008751]" />
          </div>
          <div>
            <h4 className="text-sm font-display font-semibold text-[#1A1A1A]">{category.title}</h4>
            <p className="text-[10px] text-[#5A5A5A]">
              {activeCount}/{systems.length} active
            </p>
          </div>
        </div>
        <ButtonWithTooltip
          onClick={onManage}
          tooltip={`Manage ${category.title}`}
          variant="secondary"
          size="sm"
        >
          <Settings className="w-3.5 h-3.5" />
          Manage
        </ButtonWithTooltip>
      </div>

      <div className="space-y-2">
        {systems.slice(0, 4).map(system => {
          const integration = Object.values(integrations).find(i => i.system === system.id);
          return (
            <div key={system.id} className="flex items-center justify-between p-2 bg-[#F7F5F2] border border-[#F0EDE8]">
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">{system.name}</p>
                <p className="text-[10px] text-[#5A5A5A]">{system.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {integration ? (
                  <StatusBadge status={integration.status} />
                ) : (
                  <span className="text-[10px] text-[#B0A89E]">Not configured</span>
                )}
              </div>
            </div>
          );
        })}
        {systems.length > 4 && (
          <p className="text-[10px] text-[#B0A89E] text-center pt-1">
            +{systems.length - 4} more systems
          </p>
        )}
      </div>
    </div>
  );
};

// ==================== INTEGRATION CARD ====================
const IntegrationCard = ({ integration, onTest, onToggle, onSync }) => {
  const categoryIcons = {
    government: Shield,
    financial: CreditCard,
    healthcare: Stethoscope,
    communication: MessageSquare,
  };
  
  const Icon = categoryIcons[integration.category] || Settings;

  return (
    <div className="bg-white border border-[#E8E3DC] p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#F7F5F2] border border-[#E8E3DC] flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#5A5A5A]" />
          </div>
          <div>
            <h4 className="text-sm font-display font-semibold text-[#1A1A1A]">{integration.name}</h4>
            <p className="text-[10px] text-[#5A5A5A] capitalize">{integration.category}</p>
          </div>
        </div>
        <StatusBadge status={integration.status} />
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-[#5A5A5A]">Last Sync:</span>
          <span className="text-[#1A1A1A]">
            {integration.lastSync ? new Date(integration.lastSync).toLocaleDateString('en-NG') : 'Never'}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#5A5A5A]">API Calls Today:</span>
          <span className="text-[#1A1A1A]">{integration.apiCallsToday || 0}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#5A5A5A]">System ID:</span>
          <span className="text-[#B0A89E] font-mono text-[10px]">{integration.system}</span>
        </div>
      </div>

      <div className="flex gap-1.5">
        <ButtonWithTooltip
          onClick={() => onTest(integration.id)}
          tooltip="Test connection"
          variant="secondary"
          size="sm"
          className="flex-1 justify-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Test
        </ButtonWithTooltip>
        <ButtonWithTooltip
          onClick={() => onToggle(integration.id, integration.status === 'active')}
          tooltip={integration.status === 'active' ? 'Disable integration' : 'Enable integration'}
          variant={integration.status === 'active' ? 'danger' : 'success'}
          size="sm"
          className="flex-1 justify-center"
        >
          {integration.status === 'active' ? 'Disable' : 'Enable'}
        </ButtonWithTooltip>
        <IconButton
          icon={RefreshCw}
          onClick={() => onSync(integration.id)}
          tooltip="Sync data"
          variant="primary"
          size="sm"
        />
      </div>
    </div>
  );
};

// ==================== WEBHOOK CARD ====================
const WebhookCard = ({ webhook, integrations, onEdit, onDelete, onTest }) => {
  const integration = Object.values(integrations).find(i => i.id === webhook.integrationId);

  return (
    <div className="bg-white border border-[#E8E3DC] p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-display font-semibold text-[#1A1A1A]">{webhook.name}</h4>
          <p className="text-xs text-[#5A5A5A] truncate max-w-xs">{webhook.url}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={webhook.active ? 'active' : 'inactive'} />
          <IconButton
            icon={Edit}
            onClick={() => onEdit(webhook)}
            tooltip="Edit webhook"
            variant="warning"
            size="sm"
          />
          <IconButton
            icon={Trash2}
            onClick={() => onDelete(webhook.id)}
            tooltip="Delete webhook"
            variant="danger"
            size="sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Integration</p>
          <p className="text-sm text-[#1A1A1A]">{integration?.name || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Events</p>
          <p className="text-sm text-[#1A1A1A]">{webhook.events?.length || 0} configured</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Last Triggered</p>
          <p className="text-sm text-[#1A1A1A]">
            {webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleString('en-NG') : 'Never'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Success Rate</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{webhook.successRate || 0}%</p>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-[#F0EDE8]">
        <ButtonWithTooltip
          onClick={() => onTest(webhook.id)}
          tooltip="Test webhook"
          variant="secondary"
          size="sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Test Webhook
        </ButtonWithTooltip>
        <ButtonWithTooltip
          onClick={() => {}}
          tooltip="View logs"
          variant="secondary"
          size="sm"
        >
          <Eye className="w-3.5 h-3.5" />
          View Logs
        </ButtonWithTooltip>
      </div>
    </div>
  );
};

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
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!configForm.category || !configForm.system || !configForm.apiEndpoint) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

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
    setSuccessMessage('Integration configured successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleCreateWebhook = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!webhookForm.name || !webhookForm.integrationId || !webhookForm.url) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

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
    setSuccessMessage('Webhook created successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleTestIntegration = (integrationId) => {
    dispatch(testIntegration({ integrationId }));
    setSuccessMessage('Testing integration...');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleToggleIntegration = (integrationId, currentlyEnabled) => {
    if (currentlyEnabled) {
      dispatch(disableIntegration({ integrationId }));
      setSuccessMessage('Integration disabled.');
    } else {
      dispatch(enableIntegration({ integrationId }));
      setSuccessMessage('Integration enabled.');
    }
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSyncData = (integrationId) => {
    dispatch(syncData({ integrationId }));
    setSuccessMessage('Data sync initiated.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]';
      case 'inactive': return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
      case 'error': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      case 'pending': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      case 'testing': return 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]';
      default: return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    }
  };

  const activeIntegrations = Object.values(integrations).filter(i => i.status === 'active').length;
  const totalIntegrations = Object.keys(integrations).length;
  const errorIntegrations = Object.values(integrations).filter(i => i.status === 'error').length;

  const formatDate = (date) => {
    if (!date) return 'Never';
    try {
      return new Date(date).toLocaleString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Never';
    }
  };

  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'integrations', label: 'Integrations', icon: Settings },
    { id: 'webhooks', label: 'Webhooks', icon: Zap },
    { id: 'logs', label: 'Activity Logs', icon: Activity }
  ];

  return (
    <div className="external-integrations min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <Link className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                External System Integrations
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Manage connections with external systems and APIs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => {
                // Refresh logic
                setSuccessMessage('Integrations refreshed.');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
              tooltip="Refresh integrations"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowConfigModal(true)}
              tooltip="Configure new integration"
              variant="primary"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Integration</span>
              <span className="sm:hidden">Add</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Error & Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            {errorMessage}
          </span>
          <button onClick={() => setErrorMessage('')} className="text-[#C8553D] hover:text-[#A8442E]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-[#EAF3EE] border border-[#D0E3D8] text-sm text-[#2D7D46] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            {successMessage}
          </span>
          <button onClick={() => setSuccessMessage('')} className="text-[#2D7D46] hover:text-[#1E5F33]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Active Integrations"
          value={activeIntegrations}
          subValue={`${totalIntegrations} total systems`}
          icon={CheckCircle}
          color="green"
          trend="up"
          trendValue="All systems operational"
          tooltip="Currently active integrations"
        />
        <StatsCard
          title="Total Systems"
          value={totalIntegrations}
          icon={Database}
          color="blue"
          tooltip="Total configured integrations"
        />
        <StatsCard
          title="Error States"
          value={errorIntegrations}
          icon={XCircle}
          color="red"
          trend={errorIntegrations > 0 ? 'down' : 'up'}
          trendValue={errorIntegrations > 0 ? `${errorIntegrations} need attention` : 'No errors'}
          tooltip="Integrations with errors"
        />
        <StatsCard
          title="Data Syncs Today"
          value={stats?.todaySyncs || 0}
          icon={RefreshCw}
          color="purple"
          subValue="Last sync: today"
          tooltip="Number of successful data syncs today"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-1 border-b border-[#E8E3DC] mb-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tooltip key={tab.id} text={`View ${tab.label}`}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-1 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#008751] text-[#008751]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Integration Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(integrationCategories).map(([categoryKey, category]) => (
                <CategoryCard
                  key={categoryKey}
                  category={category}
                  icon={category.icon}
                  systems={category.systems}
                  integrations={integrations}
                  onManage={() => setActiveTab('integrations')}
                />
              ))}
            </div>
          </div>
        )}

        {/* ==================== INTEGRATIONS TAB ==================== */}
        {activeTab === 'integrations' && (
          <div>
            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Search</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                  <input
                    type="text"
                    placeholder="Search integrations..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchIntegrations(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Category</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterIntegrations(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
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
                <ButtonWithTooltip
                  onClick={() => setShowConfigModal(true)}
                  tooltip="Configure new integration"
                  variant="primary"
                  className="w-full justify-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Integration
                </ButtonWithTooltip>
              </div>

              <div className="flex items-end">
                <ButtonWithTooltip
                  onClick={() => {
                    // Sync all logic
                    setSuccessMessage('Sync all initiated.');
                    setTimeout(() => setSuccessMessage(''), 3000);
                  }}
                  tooltip="Sync all integrations"
                  variant="success"
                  className="w-full justify-center"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sync All
                </ButtonWithTooltip>
              </div>
            </div>

            {/* Integrations Grid */}
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-[#008751] animate-spin mx-auto mb-3" />
                <p className="text-[#5A5A5A] text-sm">Loading integrations...</p>
              </div>
            ) : paginatedData.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Database className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No integrations found</p>
                <p className="text-sm text-[#B0A89E] mt-1">
                  {searchTerm ? 'Try adjusting your search or filters' : 'Click "Add Integration" to configure one'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedData.map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onTest={handleTestIntegration}
                    onToggle={handleToggleIntegration}
                    onSync={handleSyncData}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== WEBHOOKS TAB ==================== */}
        {activeTab === 'webhooks' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">Webhook Management</h3>
              <ButtonWithTooltip
                onClick={() => setShowWebhookModal(true)}
                tooltip="Create new webhook"
                variant="primary"
                size="sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Webhook
              </ButtonWithTooltip>
            </div>

            <div className="space-y-4">
              {webhooks.length === 0 ? (
                <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                  <Zap className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                  <p className="text-[#5A5A5A] font-medium">No webhooks configured</p>
                  <p className="text-sm text-[#B0A89E] mt-1">Click "Add Webhook" to create one</p>
                </div>
              ) : (
                webhooks.map(webhook => (
                  <WebhookCard
                    key={webhook.id}
                    webhook={webhook}
                    integrations={integrations}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onTest={() => {}}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== LOGS TAB ==================== */}
        {activeTab === 'logs' && (
          <div>
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A] mb-4">Integration Activity Logs</h3>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Search</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => dispatch(searchIntegrations(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Status</label>
                <select
                  value={filterBy}
                  onChange={(e) => dispatch(filterIntegrations(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                >
                  <option value="all">All Logs</option>
                  <option value="success">Success</option>
                  <option value="error">Errors</option>
                  <option value="warning">Warnings</option>
                </select>
              </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white border border-[#E8E3DC] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E8E3DC]">
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Timestamp</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Integration</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">Action</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EDE8]">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-[#5A5A5A]">
                          <Activity className="w-10 h-10 text-[#D8D4CD] mx-auto mb-2" />
                          <p className="text-sm">No logs found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.slice(0, itemsPerPage).map(log => (
                        <tr key={log.id} className="hover:bg-[#F7F5F2] transition-colors">
                          <td className="px-4 py-3 text-sm text-[#5A5A5A] whitespace-nowrap">
                            {formatDate(log.timestamp)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-[#1A1A1A]">
                            {Object.values(integrations).find(i => i.id === log.integrationId)?.name || log.integrationId}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#5A5A5A] hidden sm:table-cell">
                            {log.action}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={log.status} />
                          </td>
                          <td className="px-4 py-3 text-sm text-[#5A5A5A] max-w-xs truncate hidden md:table-cell">
                            {log.message}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {filteredLogs.length > itemsPerPage && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-[10px] text-[#5A5A5A]">
                  Showing 1 to {Math.min(itemsPerPage, filteredLogs.length)} of {filteredLogs.length}
                </div>
                <div className="flex items-center gap-1">
                  <IconButton
                    icon={ChevronLeft}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    tooltip="Previous page"
                    variant="default"
                    disabled={currentPage === 1}
                    size="sm"
                  />
                  <span className="text-xs text-[#5A5A5A]">
                    Page {currentPage} of {Math.ceil(filteredLogs.length / itemsPerPage)}
                  </span>
                  <IconButton
                    icon={ChevronRight}
                    onClick={() => setCurrentPage(Math.min(Math.ceil(filteredLogs.length / itemsPerPage), currentPage + 1))}
                    tooltip="Next page"
                    variant="default"
                    disabled={currentPage === Math.ceil(filteredLogs.length / itemsPerPage)}
                    size="sm"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== INTEGRATION CONFIGURATION MODAL ==================== */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => setShowConfigModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">Configure Integration</h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Connect to an external system</p>
                  </div>
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="p-1 hover:bg-[#F0EDE8] rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleConfigureIntegration} className="p-5 overflow-y-auto max-h-[calc(90vh-180px)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      Category <span className="text-[#C8553D]">*</span>
                    </label>
                    <select
                      value={configForm.category}
                      onChange={(e) => setConfigForm({...configForm, category: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
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
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                      System <span className="text-[#C8553D]">*</span>
                    </label>
                    <select
                      value={configForm.system}
                      onChange={(e) => setConfigForm({...configForm, system: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
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
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    API Endpoint <span className="text-[#C8553D]">*</span>
                  </label>
                  <input
                    type="url"
                    value={configForm.apiEndpoint}
                    onChange={(e) => setConfigForm({...configForm, apiEndpoint: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="https://api.example.com/v1"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">API Key</label>
                    <input
                      type="password"
                      value={configForm.apiKey}
                      onChange={(e) => setConfigForm({...configForm, apiKey: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Enter API key"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Secret Key</label>
                    <input
                      type="password"
                      value={configForm.secretKey}
                      onChange={(e) => setConfigForm({...configForm, secretKey: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Enter secret key"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Username</label>
                    <input
                      type="text"
                      value={configForm.username}
                      onChange={(e) => setConfigForm({...configForm, username: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Username (if required)"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Password</label>
                    <input
                      type="password"
                      value={configForm.password}
                      onChange={(e) => setConfigForm({...configForm, password: e.target.value})}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                      placeholder="Password (if required)"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-sm text-[#C8553D]">{errorMessage}</div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Configure integration"
                    variant="primary"
                    className="flex-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Configure Integration
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    tooltip="Cancel"
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </ButtonWithTooltip>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== WEBHOOK CREATION MODAL ==================== */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#1A1A1A] bg-opacity-60 transition-opacity"
            onClick={() => setShowWebhookModal(false)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#F7F5F2] w-full max-w-md transform transition-all duration-200">
              <div className="border-b border-[#E8E3DC] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-display font-semibold text-[#1A1A1A]">Create Webhook</h2>
                    <p className="text-xs text-[#5A5A5A] mt-0.5">Configure a new webhook endpoint</p>
                  </div>
                  <button
                    onClick={() => setShowWebhookModal(false)}
                    className="p-1 hover:bg-[#F0EDE8] rounded transition-colors"
                  >
                    <X className="w-5 h-5 text-[#5A5A5A]" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateWebhook} className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Webhook Name <span className="text-[#C8553D]">*</span>
                  </label>
                  <input
                    type="text"
                    value={webhookForm.name}
                    onChange={(e) => setWebhookForm({...webhookForm, name: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="My Webhook"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Integration <span className="text-[#C8553D]">*</span>
                  </label>
                  <select
                    value={webhookForm.integrationId}
                    onChange={(e) => setWebhookForm({...webhookForm, integrationId: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    required
                  >
                    <option value="">Select integration...</option>
                    {Object.values(integrations).map(integration => (
                      <option key={integration.id} value={integration.id}>{integration.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                    Webhook URL <span className="text-[#C8553D]">*</span>
                  </label>
                  <input
                    type="url"
                    value={webhookForm.url}
                    onChange={(e) => setWebhookForm({...webhookForm, url: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="https://your-app.com/webhook"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">Secret Key</label>
                  <input
                    type="password"
                    value={webhookForm.secret}
                    onChange={(e) => setWebhookForm({...webhookForm, secret: e.target.value})}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                    placeholder="Webhook secret for verification"
                  />
                </div>

                {errorMessage && (
                  <div className="text-sm text-[#C8553D]">{errorMessage}</div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
                  <ButtonWithTooltip
                    type="submit"
                    tooltip="Create webhook"
                    variant="primary"
                    className="flex-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Create Webhook
                  </ButtonWithTooltip>
                  <ButtonWithTooltip
                    type="button"
                    onClick={() => setShowWebhookModal(false)}
                    tooltip="Cancel"
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </ButtonWithTooltip>
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