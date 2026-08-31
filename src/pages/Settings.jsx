import { useState, useEffect } from 'react';
import { tenantSettingsApi } from '../utils/api';
import { getUserPreferences, setUserPreferences } from '../utils/cookies';
import { encryptInvitationData } from '../utils/invitationCrypto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmModal from '../components/ConfirmModal';
import {  faCog,  faMoneyBillWave,  faBell,  faLock,
  faDatabase,  faHospital,  faUpload,  faTimes,  faSave,  faUndo,
  faSpinner,  faCheckCircle,  faExclamationCircle,  faUser,  faImage,
  faClipboardList,  faClock,  faEnvelope,
  faSms,  faMobileAlt,  faCommentDots,  faShieldAlt,
  faSync,  faTrash,  faFileInvoice,  faCalendarDay,
  faPercentage,  faCreditCard,  faUserShield,  faMapMarkerAlt,
  faGlobe,  faUserPlus,  faCopy,  faCheck,
  faBars,  faChevronDown,  faChevronLeft,  faChevronRight,
  faEllipsisH,  faArchive,  faCircle,} from '@fortawesome/free-solid-svg-icons';

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

// ==================== PAGINATION COMPONENT ====================
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems,
  onItemsPerPageChange,
  siblingCount = 1 
}) => {
  const generatePaginationItems = () => {
    const pages = [];
    const totalPageNumbers = siblingCount * 2 + 3;
    
    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ type: 'page', value: i });
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      if (shouldShowLeftEllipsis) {
        pages.push({ type: 'page', value: 1 });
        pages.push({ type: 'ellipsis', value: '...' });
      }

      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push({ type: 'page', value: i });
      }

      if (shouldShowRightEllipsis) {
        pages.push({ type: 'ellipsis', value: '...' });
        pages.push({ type: 'page', value: totalPages });
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#E8E3DC]">
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-[#5A5A5A] w-full xs:w-auto">
          <span className="hidden xs:inline">Showing</span>
          <select
            value={itemsPerPage}
            onChange={onItemsPerPageChange}
            className="px-2 py-1 border border-[#D8D4CD] rounded focus:ring-2 focus:ring-[#008751] focus:border-[#008751] outline-none text-xs bg-white min-w-[60px]"
          >
            {[5, 10, 20, 50].map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <span>per page</span>
          <span className="hidden sm:inline text-[#B0A89E] ml-1">
            (Total: {totalItems})
          </span>
        </div>
        <div className="text-xs text-[#B0A89E] sm:hidden">
          Total: {totalItems} items
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 sm:px-3 py-1.5 rounded text-xs transition-all ${
            currentPage === 1
              ? 'text-[#D8D4CD] cursor-not-allowed'
              : 'text-[#5A5A5A] hover:bg-[#F0EDE8] hover:text-[#1A1A1A]'
          }`}
          aria-label="Previous page"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
          <span className="hidden xs:inline ml-1">Prev</span>
        </button>

        <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
          {generatePaginationItems().map((item, index) => {
            if (item.type === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="px-1.5 sm:px-3 py-1.5 text-[#B0A89E] text-xs">
                  <FontAwesomeIcon icon={faEllipsisH} className="text-xs" />
                </span>
              );
            }

            const page = item.value;
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded text-xs transition-all min-w-[32px] sm:min-w-[40px] text-center ${
                  isActive
                    ? 'bg-[#008751] text-white font-semibold'
                    : 'text-[#5A5A5A] hover:bg-[#F0EDE8] hover:text-[#1A1A1A]'
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 sm:px-3 py-1.5 rounded text-xs transition-all ${
            currentPage === totalPages
              ? 'text-[#D8D4CD] cursor-not-allowed'
              : 'text-[#5A5A5A] hover:bg-[#F0EDE8] hover:text-[#1A1A1A]'
          }`}
          aria-label="Next page"
        >
          <span className="hidden xs:inline mr-1">Next</span>
          <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
        </button>
      </div>

      <div className="text-center text-xs text-[#B0A89E] xs:hidden">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

// ==================== MAIN SETTINGS COMPONENT ====================
const Settings = () => {
  // State declarations - all hooks must be at the top level
  const [settings, setSettings] = useState({
    system_name: 'SmartCare HMS',
    system_logo: null,
    theme_color: '#007bff',
    default_clinic: 'Main Clinic',
    default_ward: 'General Ward',
    currency: 'NGN',
    currency_symbol: '₦',
    tax_rate: 7.5,
    dashboard_refresh_interval: getUserPreferences().refreshInterval || 300,
    billing_cycle: 'monthly',
    email_notifications: true,
    sms_notifications: true,
    push_notifications: true,
    password_policy: {},
    session_timeout: 30,
    max_login_attempts: 5,
    require_2fa: false,
    auto_backup: true,
    backup_frequency: 'daily',
    backup_retention_days: 30,
    nhis_enabled: false,
    nhis_default_tariff: '',
    nhis_claim_submission_days: 7,
    custom_settings: {},
  });
  
  const [tenantInfo, setTenantInfo] = useState({
    name: typeof window !== 'undefined' ? localStorage.getItem('tenantName') || '' : '',
    domain: typeof window !== 'undefined' ? localStorage.getItem('tenantDomain') || '' : '',
    publicId: typeof window !== 'undefined' ? localStorage.getItem('tenantId') || '' : '',
  });
  
  const [communication, setCommunication] = useState({
    id: null,
    email_enabled: true,
    sms_enabled: true,
    email_from: '',
    from_name: '',
    email_provider: 'default',
    email_host: '',
    email_port: '',
    email_username: '',
    email_password: '',
    email_use_tls: true,
    sms_provider: 'default',
    sms_sender_id: '',
    sms_phone_number: '',
    sms_api_key: '',
    sms_country_code: 'NG',
    consent_tracking_enabled: true,
    opt_out_message: 'Reply STOP to unsubscribe',
    dnd_enabled: false,
    message_templates: {
      email: {},
      sms: {},
    },
    daily_email_limit: 1000,
    daily_sms_limit: 500,
  });

  const [externalServices, setExternalServices] = useState({
    mirth_endpoint: '', mirth_channel_id: '', mirth_api_key: '', mirth_api_key_configured: false,
    lis_endpoint: '', lis_api_key: '', lis_api_key_configured: false,
    pacs_endpoint: '', pacs_api_key: '', pacs_api_key_configured: false,
    fhir_endpoint: '', fhir_api_key: '', fhir_api_key_configured: false,
  });
  
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [refreshHint, setRefreshHint] = useState('');
  const [activeSection, setActiveSection] = useState('general');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('doctor');
  const [inviteExpiryHours, setInviteExpiryHours] = useState(72);
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [inviteFeedback, setInviteFeedback] = useState('');
  const [inviteFeedbackType, setInviteFeedbackType] = useState('');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingUsersLoading, setPendingUsersLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [communicationTab, setCommunicationTab] = useState('email');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetName, setDeleteTargetName] = useState('');

  const [tablePagination, setTablePagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    totalPages: 0,
  });

  const isBusy = loading || saving;
  const busyMessage = saving ? 'Saving settings...' : 'Loading settings...';

  // Sections - defined outside of component logic
  const sections = [
    { id: 'general', label: 'General', icon: faCog },
    { id: 'billing', label: 'Billing', icon: faMoneyBillWave },
    { id: 'notifications', label: 'Notifications', icon: faBell },
    { id: 'communication', label: 'Communication', icon: faCommentDots },
    { id: 'external-services', label: 'External Services', icon: faGlobe },
    { id: 'security', label: 'Security', icon: faLock },
    { id: 'backup', label: 'Backup', icon: faDatabase },
    { id: 'nhis', label: 'NHIS', icon: faHospital },
  ];

  // Functions
  const getCombinedTableData = () => {
    const pendingItems = pendingUsers.map(user => ({
      id: user.id,
      type: 'pending',
      email: user.email,
      name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      role: user.role || user.role_name || 'User',
      status: 'pending',
      expiresAt: null,
      user: user,
    }));

    const invitationItems = invitations.map(inv => ({
      id: inv.id,
      type: 'invitation', 
      email: inv.email,
      name: inv.name || inv.email,
      role: inv.role || 'User',
      status: inv.status || 'pending',
      expiresAt: inv.expires_at,
      invitation: inv,
      archived: inv.archived || false,
    }));

    const allItems = [...pendingItems, ...invitationItems];
    return allItems.sort((a, b) => {
      if (a.type === 'pending' && b.type !== 'pending') return -1;
      if (a.type !== 'pending' && b.type === 'pending') return 1;
      if (a.type === 'invitation' && b.type === 'invitation') {
        if (a.archived && !b.archived) return 1;
        if (!a.archived && b.archived) return -1;
      }
      if (a.expiresAt && b.expiresAt) {
        return new Date(a.expiresAt) - new Date(b.expiresAt);
      }
      if (a.expiresAt) return -1;
      if (b.expiresAt) return 1;
      return 0;
    });
  };

  const getPaginatedTableData = () => {
    const allData = getCombinedTableData();
    const { currentPage, itemsPerPage } = tablePagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allData.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setTablePagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setTablePagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
  };

  const loadPendingUsers = async () => {
    setPendingUsersLoading(true);
    try {
      const response = await tenantSettingsApi.getPendingUsers();
      const users = Array.isArray(response) ? response : response?.results || [];
      setPendingUsers(users.filter((user) => user.is_active === false));
    } catch (error) {
      console.error('Unable to load pending users:', error);
    } finally {
      setPendingUsersLoading(false);
    }
  };

  const loadInvitations = async () => {
    setInvitationsLoading(true);
    try {
      const response = await tenantSettingsApi.listInvitations();
      const items = Array.isArray(response) ? response : response?.results || [];
      setInvitations(items);
    } catch (error) {
      console.error('Unable to load invitations:', error);
    } finally {
      setInvitationsLoading(false);
    }
  };

  // Main load effect
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const response = await tenantSettingsApi.getCurrent();
        setSettings((prev) => ({
          ...prev,
          system_name: response.system_name || prev.system_name,
          system_logo: response.system_logo || prev.system_logo,
          theme_color: response.theme_color || prev.theme_color,
          default_clinic: response.default_clinic || prev.default_clinic,
          default_ward: response.default_ward || prev.default_ward,
          currency: response.currency || prev.currency,
          currency_symbol: response.currency_symbol || prev.currency_symbol,
          tax_rate: response.tax_rate ?? prev.tax_rate,
          billing_cycle: response.billing_cycle || prev.billing_cycle,
          email_notifications: response.email_notifications ?? prev.email_notifications,
          sms_notifications: response.sms_notifications ?? prev.sms_notifications,
          push_notifications: response.push_notifications ?? prev.push_notifications,
          password_policy: response.password_policy || prev.password_policy,
          session_timeout: response.session_timeout ?? prev.session_timeout,
          max_login_attempts: response.max_login_attempts ?? prev.max_login_attempts,
          require_2fa: response.require_2fa ?? prev.require_2fa,
          auto_backup: response.auto_backup ?? prev.auto_backup,
          backup_frequency: response.backup_frequency || prev.backup_frequency,
          backup_retention_days: response.backup_retention_days ?? prev.backup_retention_days,
          nhis_enabled: response.nhis_enabled ?? prev.nhis_enabled,
          nhis_default_tariff: response.nhis_default_tariff || prev.nhis_default_tariff,
          nhis_claim_submission_days: response.nhis_claim_submission_days ?? prev.nhis_claim_submission_days,
          custom_settings: response.custom_settings || prev.custom_settings,
        }));
        if (response.system_logo) {
          setLogoPreview(response.system_logo);
        }
        if (response.tenant_name) {
          setTenantInfo((current) => ({ ...current, name: response.tenant_name }));
        }
      } catch (error) {
        console.error('Unable to load settings:', error);
        setMessage('Unable to load tenant settings.');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
    loadPendingUsers();
    loadInvitations();

    const loadCommunicationProfile = async () => {
      try {
        const profile = await tenantSettingsApi.getCommunicationProfile();
        setCommunication((prev) => ({
          ...prev,
          id: profile.id || prev.id,
          email_enabled: profile.email_enabled ?? prev.email_enabled,
          sms_enabled: profile.sms_enabled ?? prev.sms_enabled,
          email_from: profile.email_from || prev.email_from,
          from_name: profile.from_name || prev.from_name,
          email_provider: profile.email_provider || prev.email_provider,
          email_host: profile.email_host || prev.email_host,
          email_port: profile.email_port ?? prev.email_port,
          email_username: profile.email_username || prev.email_username,
          email_password: profile.email_password || prev.email_password,
          email_use_tls: profile.email_use_tls ?? prev.email_use_tls,
          sms_provider: profile.sms_provider || prev.sms_provider,
          sms_sender_id: profile.sms_sender_id || prev.sms_sender_id,
          sms_phone_number: profile.sms_phone_number || prev.sms_phone_number,
          sms_api_key: profile.sms_api_key || prev.sms_api_key,
          sms_country_code: profile.sms_country_code || prev.sms_country_code,
          consent_tracking_enabled: profile.consent_tracking_enabled ?? prev.consent_tracking_enabled,
          opt_out_message: profile.opt_out_message || prev.opt_out_message,
          dnd_enabled: profile.dnd_enabled ?? prev.dnd_enabled,
          message_templates: profile.message_templates || prev.message_templates,
          daily_email_limit: profile.daily_email_limit ?? prev.daily_email_limit,
          daily_sms_limit: profile.daily_sms_limit ?? prev.daily_sms_limit,
        }));
      } catch (error) {
        console.error('Unable to load communication profile:', error);
      }
    };

    loadCommunicationProfile();

    const loadExternalServices = async () => {
      try {
        const profile = await tenantSettingsApi.getExternalServiceProfile();
        setExternalServices((previous) => ({ ...previous, ...profile }));
      } catch (error) {
        console.error('Unable to load external service profile:', error);
      }
    };

    loadExternalServices();
  }, []);

  // Update pagination when data changes
  useEffect(() => {
    const allData = getCombinedTableData();
    setTablePagination(prev => {
      const totalItems = allData.length;
      const totalPages = Math.ceil(totalItems / prev.itemsPerPage) || 1;
      const currentPage = Math.min(prev.currentPage, totalPages);
      return { ...prev, totalItems, totalPages, currentPage };
    });
  }, [pendingUsers, invitations]);

  // Handlers
  const handleCommunicationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCommunication((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'dashboard_refresh_interval') {
      const intervalSeconds = Math.max(15, Number(value) || 60);
      setUserPreferences({ refreshInterval: intervalSeconds });
      window.dispatchEvent(new Event('preferencesChanged'));
      setRefreshHint(`Dashboard refresh interval set to ${intervalSeconds} seconds.`);
      setTimeout(() => setRefreshHint(''), 4000);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setMessage('Please select an image file (JPG, PNG, etc.)');
      setMessageType('error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size should be less than 5MB');
      setMessageType('error');
      return;
    }

    setLogo(file);
    setMessage('');
    setMessageType('');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = async () => {
    if (!logo) return;
    setLogoUploading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await tenantSettingsApi.updateCurrent({ system_logo: logo });
      if (response?.system_logo) {
        setSettings((prev) => ({ ...prev, system_logo: response.system_logo }));
        setLogoPreview(response.system_logo);
      }
      setMessage('Logo uploaded successfully!');
      setMessageType('success');
    } catch (error) {
      setMessage('Error uploading logo. Please try again.');
      setMessageType('error');
      console.error('Logo upload error:', error);
    } finally {
      setLogoUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoPreview(null);
    setSettings(prev => ({ ...prev, system_logo: null }));
  };

  const handleCreateInvitation = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      setInviteFeedback('Please enter an email address.');
      setInviteFeedbackType('error');
      return;
    }

    setInviteLoading(true);
    setInviteFeedback('');
    setInviteFeedbackType('');
    setInviteCopied(false);

    try {
      const expiresAt = new Date(Date.now() + Number(inviteExpiryHours) * 60 * 60 * 1000).toISOString();
      const response = await tenantSettingsApi.createInvitation({
        email: inviteEmail.trim().toLowerCase(),
        role: inviteRole,
        expires_at: expiresAt,
        message: inviteMessage.trim(),
      });

      const token = response?.token;
      const tenantName = tenantInfo.name || localStorage.getItem('tenantName') || '';
      if (!tenantName) {
        setInviteFeedback('Tenant information not available. Please refresh the page and try again.');
        setInviteFeedbackType('error');
        return;
      }

      const encryptedData = await encryptInvitationData({
        tenant_name: tenantName,
        role: inviteRole,
        email: inviteEmail.trim().toLowerCase(),
      });

      const link = `${window.location.origin}/invitation-signup?token=${token}&data=${encryptedData}`;
      setInviteLink(link);
      setInviteEmail('');
      setInviteRole('doctor');
      setInviteExpiryHours(72);
      setInviteMessage('');
      setInviteFeedback('Invitation created successfully. The link was copied to your clipboard.');
      setInviteFeedbackType('success');
      if (token) {
        await navigator.clipboard.writeText(link);
        setInviteCopied(true);
      }
      await loadPendingUsers();
      await loadInvitations();
    } catch (error) {
      console.error('Create invitation error:', error);
      setInviteFeedback(error.message || 'Unable to create invitation link.');
      setInviteFeedbackType('error');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await tenantSettingsApi.approveUser(userId);
      await loadPendingUsers();
      await loadInvitations();
      setInviteFeedback('User approved successfully.');
      setInviteFeedbackType('success');
    } catch (error) {
      console.error('Approve user error:', error);
      setInviteFeedback(error.message || 'Unable to approve user.');
      setInviteFeedbackType('error');
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      await tenantSettingsApi.rejectUser(userId);
      await loadPendingUsers();
      setInviteFeedback('User request rejected.');
      setInviteFeedbackType('error');
    } catch (error) {
      console.error('Reject user error:', error);
      setInviteFeedback(error.message || 'Unable to reject user.');
      setInviteFeedbackType('error');
    }
  };

  const handleArchiveInvitation = async (invitationId) => {
    try {
      await tenantSettingsApi.archiveInvitation(invitationId);
      await loadInvitations();
      setInviteFeedback('Invitation archived.');
      setInviteFeedbackType('success');
    } catch (error) {
      console.error('Archive invitation error:', error);
      setInviteFeedback(error.message || 'Unable to archive invitation.');
      setInviteFeedbackType('error');
    }
  };

  const handleUnarchiveInvitation = async (invitationId) => {
    try {
      await tenantSettingsApi.unarchiveInvitation(invitationId);
      await loadInvitations();
      setInviteFeedback('Invitation unarchived.');
      setInviteFeedbackType('success');
    } catch (error) {
      console.error('Unarchive invitation error:', error);
      setInviteFeedback(error.message || 'Unable to unarchive invitation.');
      setInviteFeedbackType('error');
    }
  };

  const handleDeleteInvitation = async (invitationId) => {
    setDeleteTargetId(invitationId);
    setDeleteTargetName(invitations.find(inv => inv.id === invitationId)?.email || 'this invitation');
    setDeleteModalOpen(true);
  };

  const confirmDeleteInvitation = async () => {
    if (!deleteTargetId) return;
    setDeleteModalOpen(false);
    try {
      await tenantSettingsApi.deleteInvitation(deleteTargetId);
      await loadInvitations();
      setInviteFeedback('Invitation deleted permanently.');
      setInviteFeedbackType('success');
    } catch (error) {
      console.error('Delete invitation error:', error);
      setInviteFeedback(error.message || 'Unable to delete invitation.');
      setInviteFeedbackType('error');
    } finally {
      setDeleteTargetId(null);
      setDeleteTargetName('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setMessageType('');

    try {
      const payload = {
        system_name: settings.system_name,
        theme_color: settings.theme_color,
        default_clinic: settings.default_clinic,
        default_ward: settings.default_ward,
        currency: settings.currency,
        currency_symbol: settings.currency_symbol,
        tax_rate: settings.tax_rate,
        billing_cycle: settings.billing_cycle,
        email_notifications: settings.email_notifications,
        sms_notifications: settings.sms_notifications,
        push_notifications: settings.push_notifications,
        password_policy: settings.password_policy,
        session_timeout: settings.session_timeout,
        max_login_attempts: settings.max_login_attempts,
        require_2fa: settings.require_2fa,
        auto_backup: settings.auto_backup,
        backup_frequency: settings.backup_frequency,
        backup_retention_days: settings.backup_retention_days,
        nhis_enabled: settings.nhis_enabled,
        nhis_default_tariff: settings.nhis_default_tariff,
        nhis_claim_submission_days: settings.nhis_claim_submission_days,
        custom_settings: settings.custom_settings,
      };

      if (logo) {
        payload.system_logo = logo;
      } else if (settings.system_logo === null) {
        payload.system_logo = null;
      }

      await tenantSettingsApi.updateCurrent(payload);

      const communicationPayload = {
        email_enabled: communication.email_enabled,
        sms_enabled: communication.sms_enabled,
        email_from: communication.email_from,
        from_name: communication.from_name,
        email_provider: communication.email_provider,
        email_host: communication.email_host,
        email_port: communication.email_port,
        email_username: communication.email_username,
        email_password: communication.email_password,
        email_use_tls: communication.email_use_tls,
        sms_provider: communication.sms_provider,
        sms_sender_id: communication.sms_sender_id,
        sms_phone_number: communication.sms_phone_number,
        sms_api_key: communication.sms_api_key,
        sms_country_code: communication.sms_country_code,
        consent_tracking_enabled: communication.consent_tracking_enabled,
        opt_out_message: communication.opt_out_message,
        dnd_enabled: communication.dnd_enabled,
        message_templates: communication.message_templates,
        daily_email_limit: communication.daily_email_limit,
        daily_sms_limit: communication.daily_sms_limit,
      };

      if (communication.id) {
        await tenantSettingsApi.updateCommunicationProfile(communication.id, communicationPayload);
      } else {
        await tenantSettingsApi.createCommunicationProfile(communicationPayload);
      }

      const externalPayload = Object.fromEntries(Object.entries(externalServices).filter(([key, value]) => {
        if (key.endsWith('_configured')) return false;
        return !key.endsWith('_api_key') || value || !externalServices[`${key.replace('_api_key', '')}_api_key_configured`];
      }));
      await tenantSettingsApi.updateExternalServiceProfile(externalPayload);

      setMessage('Settings saved successfully.');
      setMessageType('success');
      
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      console.error('Save settings error:', error);
      setMessage('Unable to save settings.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  // Render functions
  const renderSectionContent = () => {
    switch(activeSection) {
      case 'general':
        return renderGeneralSection();
      case 'billing':
        return renderBillingSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'communication':
        return renderCommunicationSection();
      case 'external-services':
        return renderExternalServicesSection();
      case 'security':
        return renderSecuritySection();
      case 'backup':
        return renderBackupSection();
      case 'nhis':
        return renderNHISSection();
      default:
        return renderGeneralSection();
    }
  };

  const renderGeneralSection = () => (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
      <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3 sm:p-4">
        <label className="block text-xs sm:text-sm font-semibold text-[#1A1A1A] mb-2 sm:mb-3">
          <FontAwesomeIcon icon={faImage} className="mr-1.5 text-[#008751] text-xs" />
          Facility Logo
          <span className="ml-1.5 text-[11px] font-normal text-[#5A5A5A]">(Recommended: 400×400px)</span>
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-[#D8D4CD] flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Facility logo"
                  className="w-full h-full object-contain p-1.5 sm:p-2"
                />
              ) : (
                <div className="text-center text-[#B0A89E]">
                  <FontAwesomeIcon icon={faImage} className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-0.5" />
                  <p className="text-[10px] sm:text-xs">No logo</p>
                </div>
              )}
            </div>
            {logoPreview && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="mt-1.5 text-[11px] sm:text-xs text-[#C8553D] hover:text-[#A8442E] font-medium transition-colors"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1 text-[10px]" />
                Remove
              </button>
            )}
          </div>
          
          <div className="flex-1 space-y-2 min-w-0">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
                Upload new logo
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer bg-white hover:bg-[#F7F5F2] text-[#1A1A1A] px-2.5 sm:px-3 py-1.5 border border-[#D8D4CD] transition-all hover:border-[#008751] font-medium text-xs sm:text-sm">
                  <FontAwesomeIcon icon={faUpload} className="mr-1.5 text-[10px]" />
                  Choose file
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
                {logo && (
                  <span className="text-[11px] sm:text-xs text-[#5A5A5A] bg-[#F0EDE8] px-2 py-0.5 truncate max-w-[120px] sm:max-w-[180px]">
                    {logo.name} ({(logo.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-[#B0A89E]">JPG, PNG, or SVG • Max 5MB</p>
            </div>
            {logo && (
              <ButtonWithTooltip
                onClick={handleLogoUpload}
                tooltip="Upload new logo"
                variant="primary"
                size="sm"
                disabled={logoUploading}
              >
                {logoUploading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="mr-1.5 animate-spin text-[10px]" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} className="mr-1.5 text-[10px]" />
                    Upload logo
                  </>
                )}
              </ButtonWithTooltip>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faClock} className="mr-1.5 text-[#008751] text-[11px]" />
            Dashboard refresh interval
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="15"
              max="300"
              name="dashboard_refresh_interval"
              value={settings.dashboard_refresh_interval}
              onChange={handleChange}
              className="w-16 sm:w-20 px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
            />
            <span className="text-[11px] sm:text-xs text-[#5A5A5A]">seconds</span>
          </div>
          <p className="mt-1 text-[11px] text-[#B0A89E]">Reloads sidebar insights at this interval (min 15 sec).</p>
          {refreshHint && (
            <p className="mt-1 text-[11px] sm:text-xs text-[#2D7D46]">{refreshHint}</p>
          )}
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1.5 text-[#008751] text-[11px]" />
            Default Ward
          </label>
          <input
            type="text"
            name="default_ward"
            value={settings.default_ward}
            onChange={handleChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
          />
        </div>
      </div>
    </div>
  );

  const renderBillingSection = () => (
    <div className="p-3 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faGlobe} className="mr-1.5 text-[#008751] text-[11px]" />
            Currency
          </label>
          <input
            type="text"
            name="currency"
            value={settings.currency}
            onChange={handleChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faCreditCard} className="mr-1.5 text-[#008751] text-[11px]" />
            Currency Symbol
          </label>
          <input
            type="text"
            name="currency_symbol"
            value={settings.currency_symbol}
            onChange={handleChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faPercentage} className="mr-1.5 text-[#008751] text-[11px]" />
            Tax Rate (%)
          </label>
          <input
            type="number"
            name="tax_rate"
            min="0"
            max="100"
            step="0.01"
            value={settings.tax_rate}
            onChange={handleChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faClock} className="mr-1.5 text-[#008751] text-[11px]" />
            Billing Cycle
          </label>
          <select
            name="billing_cycle"
            value={settings.billing_cycle}
            onChange={handleChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="p-3 sm:p-4">
      <div className="space-y-3 sm:space-y-4">
        {[
          { name: 'email_notifications', label: 'Email notifications', desc: 'Receive updates via email', icon: faEnvelope },
          { name: 'sms_notifications', label: 'SMS notifications', desc: 'Receive updates via text message', icon: faSms },
          { name: 'push_notifications', label: 'Push notifications', desc: 'Receive real-time in-app alerts', icon: faMobileAlt },
        ].map((item) => (
          <div key={item.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[#F7F5F2] border border-[#E8E3DC] transition-colors gap-2 sm:gap-4">
            <div>
              <label className="text-sm font-medium text-[#1A1A1A] cursor-pointer">
                <FontAwesomeIcon icon={item.icon} className="mr-2 text-[#008751]" />
                {item.label}
              </label>
              <p className="text-xs text-[#5A5A5A] mt-0.5">{item.desc}</p>
            </div>
            <div className="relative inline-block w-12 h-7 flex-shrink-0">
              <input
                type="checkbox"
                name={item.name}
                checked={settings[item.name]}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-12 h-7 bg-[#D8D4CD] rounded-full peer peer-checked:bg-[#008751] transition-colors duration-200"></div>
              <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 shadow-sm"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExternalServicesSection = () => {
    const serviceFields = [
      { key: 'mirth', label: 'Mirth Connect', description: 'HL7 v2 transformation middleware' },
      { key: 'lis', label: 'Laboratory Information System', description: 'External LIS endpoint' },
      { key: 'pacs', label: 'PACS / Radiology', description: 'Imaging and radiology endpoint' },
      { key: 'fhir', label: 'FHIR Server', description: 'External FHIR R4 endpoint' },
    ];

    return (
      <div className="space-y-4 p-3 sm:p-4">
        <div className="border border-[#D8D4CD] bg-[#F7F5F2] p-4">
          <h3 className="text-sm font-semibold text-[#1A1A1A]">Tenant external services</h3>
          <p className="mt-1 text-xs leading-5 text-[#5A5A5A]">These connections belong to this hospital tenant. Credentials are encrypted at rest and never returned after saving.</p>
        </div>
        {serviceFields.map(({ key, label, description }) => (
          <div key={key} className="border border-[#E8E3DC] bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">{label}</h3>
                <p className="text-xs text-[#5A5A5A]">{description}</p>
              </div>
              <span className={`text-[10px] font-semibold uppercase ${externalServices[`${key}_api_key_configured`] ? 'text-[#2D7D46]' : 'text-[#C87D3D]'}`}>
                {externalServices[`${key}_api_key_configured`] ? 'Credential configured' : 'Credential not configured'}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-[#5A5A5A]">Endpoint URL</label>
                <input
                  type="url"
                  value={externalServices[`${key}_endpoint`] || ''}
                  onChange={(event) => setExternalServices((previous) => ({ ...previous, [`${key}_endpoint`]: event.target.value }))}
                  placeholder={`https://${key}.example.com/api`}
                  className="w-full border border-[#D8D4CD] px-3 py-2 text-sm outline-none focus:border-[#008751]"
                />
              </div>
              {key === 'mirth' && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-[#5A5A5A]">Channel ID</label>
                  <input
                    type="text"
                    value={externalServices.mirth_channel_id || ''}
                    onChange={(event) => setExternalServices((previous) => ({ ...previous, mirth_channel_id: event.target.value }))}
                    placeholder="Mirth channel ID"
                    className="w-full border border-[#D8D4CD] px-3 py-2 text-sm outline-none focus:border-[#008751]"
                  />
                </div>
              )}
              <div className={key === 'mirth' ? '' : 'sm:col-span-2'}>
                <label className="mb-1 block text-xs font-medium text-[#5A5A5A]">API key / token</label>
                <input
                  type="password"
                  value={externalServices[`${key}_api_key`] || ''}
                  onChange={(event) => setExternalServices((previous) => ({ ...previous, [`${key}_api_key`]: event.target.value }))}
                  placeholder={externalServices[`${key}_api_key_configured`] ? 'Leave blank to keep current credential' : 'Enter credential'}
                  autoComplete="new-password"
                  className="w-full border border-[#D8D4CD] px-3 py-2 text-sm outline-none focus:border-[#008751]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCommunicationSection = () => (
    <div className="p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex gap-1.5 sm:gap-2 p-1 bg-[#F0EDE8] rounded w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setCommunicationTab('email')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-1 sm:flex-none justify-center ${
              communicationTab === 'email'
                ? 'bg-white text-[#008751] border border-[#C8E0D5]'
                : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
            }`}
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-[#008751] text-xs sm:text-sm" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => setCommunicationTab('sms')}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-1 sm:flex-none justify-center ${
              communicationTab === 'sms'
                ? 'bg-white text-[#008751] border border-[#C8E0D5]'
                : 'text-[#5A5A5A] hover:text-[#1A1A1A]'
            }`}
          >
            <FontAwesomeIcon icon={faSms} className="text-[#008751] text-xs sm:text-sm" />
            <span>SMS</span>
          </button>
        </div>
        <ButtonWithTooltip
          type="submit"
          form="settings-form"
          tooltip="Save communication settings"
          variant="primary"
        >
          <FontAwesomeIcon icon={faSave} className="text-xs sm:text-sm" />
          Save settings
        </ButtonWithTooltip>
      </div>

      {communicationTab === 'email' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="border border-[#E8E3DC] p-3 sm:p-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2 mb-3 sm:mb-4">
              <FontAwesomeIcon icon={faEnvelope} className="text-[#008751]" />
              <span>Email Identity</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">From Email</label>
                <input
                  type="email"
                  name="email_from"
                  value={communication.email_from}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                  placeholder="no-reply@hospital.org"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">From Name</label>
                <input
                  type="text"
                  name="from_name"
                  value={communication.from_name}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                  placeholder="St. Mary's Hospital"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">Email Provider</label>
                <select
                  name="email_provider"
                  value={communication.email_provider}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                >
                  <option value="default">Default</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="ses">Amazon SES</option>
                  <option value="smtp">Custom SMTP</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">Email Host</label>
                <input
                  type="text"
                  name="email_host"
                  value={communication.email_host}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                  placeholder="smtp.hospital.org"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">Email Port</label>
                <input
                  type="number"
                  name="email_port"
                  value={communication.email_port}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                  placeholder="587"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">Email Username</label>
                <input
                  type="text"
                  name="email_username"
                  value={communication.email_username}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">Email Password</label>
                <input
                  type="password"
                  name="email_password"
                  value={communication.email_password}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1A1A1A] cursor-pointer">
                  <input
                    type="checkbox"
                    name="email_use_tls"
                    checked={communication.email_use_tls}
                    onChange={handleCommunicationChange}
                    className="w-4 h-4 text-[#008751] rounded focus:ring-[#008751]"
                  />
                  <span>Use TLS</span>
                </label>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1A1A1A] cursor-pointer">
                  <input
                    type="checkbox"
                    name="email_enabled"
                    checked={communication.email_enabled}
                    onChange={handleCommunicationChange}
                    className="w-4 h-4 text-[#008751] rounded focus:ring-[#008751]"
                  />
                  <span>Email enabled</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {communicationTab === 'sms' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="border border-[#E8E3DC] p-3 sm:p-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] flex items-center gap-2 mb-3 sm:mb-4">
              <FontAwesomeIcon icon={faSms} className="text-[#008751]" />
              <span>SMS Identity</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">SMS Provider</label>
                <select
                  name="sms_provider"
                  value={communication.sms_provider}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                >
                  <option value="default">Default</option>
                  <option value="twilio">Twilio</option>
                  <option value="messagebird">MessageBird</option>
                  <option value="vonage">Vonage</option>
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">Sender ID</label>
                <input
                  type="text"
                  name="sms_sender_id"
                  value={communication.sms_sender_id}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                  placeholder="HOSPITAL"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">SMS Phone Number</label>
                <input
                  type="text"
                  name="sms_phone_number"
                  value={communication.sms_phone_number}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">SMS API Key</label>
                <input
                  type="password"
                  name="sms_api_key"
                  value={communication.sms_api_key}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">Country Code</label>
                <input
                  type="text"
                  name="sms_country_code"
                  value={communication.sms_country_code}
                  onChange={handleCommunicationChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
                  placeholder="NG"
                />
              </div>
              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#1A1A1A] cursor-pointer">
                  <input
                    type="checkbox"
                    name="sms_enabled"
                    checked={communication.sms_enabled}
                    onChange={handleCommunicationChange}
                    className="w-4 h-4 text-[#008751] rounded focus:ring-[#008751]"
                  />
                  <span>SMS enabled</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSecuritySection = () => (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faClock} className="mr-1.5 text-[#C8553D] text-[11px]" />
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            name="session_timeout"
            min="5"
            value={settings.session_timeout}
            onChange={handleChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faUserShield} className="mr-1.5 text-[#C8553D] text-[11px]" />
            Max Login Attempts
          </label>
          <input
            type="number"
            name="max_login_attempts"
            min="1"
            value={settings.max_login_attempts}
            onChange={handleChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[#F7F5F2] border border-[#E8E3DC] gap-2 sm:gap-4">
        <div>
          <label className="text-sm font-medium text-[#1A1A1A] cursor-pointer">
            <FontAwesomeIcon icon={faShieldAlt} className="mr-1.5 text-[#C8553D]" />
            Two-factor authentication
          </label>
          <p className="text-xs text-[#5A5A5A] mt-0.5">Require 2FA for all users</p>
        </div>
        <div className="relative inline-block w-12 h-7 flex-shrink-0">
          <input
            type="checkbox"
            name="require_2fa"
            checked={settings.require_2fa}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-12 h-7 bg-[#D8D4CD] rounded-full peer peer-checked:bg-[#008751] transition-colors duration-200"></div>
          <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 shadow-sm"></div>
        </div>
      </div>
    </div>
  );

  const renderBackupSection = () => (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[#F7F5F2] border border-[#E8E3DC] gap-2 sm:gap-4">
        <div>
          <label className="text-sm font-medium text-[#1A1A1A] cursor-pointer">
            <FontAwesomeIcon icon={faSync} className="mr-1.5 text-[#4A5A5A]" />
            Automatic backups
          </label>
          <p className="text-xs text-[#5A5A5A] mt-0.5">Schedule regular data backups</p>
        </div>
        <div className="relative inline-block w-12 h-7 flex-shrink-0">
          <input
            type="checkbox"
            name="auto_backup"
            checked={settings.auto_backup}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-12 h-7 bg-[#D8D4CD] rounded-full peer peer-checked:bg-[#008751] transition-colors duration-200"></div>
          <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 shadow-sm"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faClock} className="mr-1.5 text-[#4A5A5A] text-[11px]" />
            Backup Frequency
          </label>
          <select
            name="backup_frequency"
            value={settings.backup_frequency}
            onChange={handleChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faCalendarDay} className="mr-1.5 text-[#4A5A5A] text-[11px]" />
            Retention (days)
          </label>
          <input
            type="number"
            name="backup_retention_days"
            min="1"
            value={settings.backup_retention_days}
            onChange={handleChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
          />
        </div>
      </div>
    </div>
  );

  const renderNHISSection = () => (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-[#F7F5F2] border border-[#E8E3DC] gap-2 sm:gap-4">
        <div>
          <label className="text-sm font-medium text-[#1A1A1A] cursor-pointer">
            <FontAwesomeIcon icon={faHospital} className="mr-1.5 text-[#008751]" />
            NHIS Integration
          </label>
          <p className="text-xs text-[#5A5A5A] mt-0.5">Enable NHIS claims and billing</p>
        </div>
        <div className="relative inline-block w-12 h-7 flex-shrink-0">
          <input
            type="checkbox"
            name="nhis_enabled"
            checked={settings.nhis_enabled}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-12 h-7 bg-[#D8D4CD] rounded-full peer peer-checked:bg-[#008751] transition-colors duration-200"></div>
          <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 shadow-sm"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faFileInvoice} className="mr-1.5 text-[#008751] text-[11px]" />
            Default Tariff
          </label>
          <input
            type="text"
            name="nhis_default_tariff"
            value={settings.nhis_default_tariff}
            onChange={handleChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-[#5A5A5A] mb-1">
            <FontAwesomeIcon icon={faCalendarDay} className="mr-1.5 text-[#008751] text-[11px]" />
            Claim Submission Days
          </label>
          <input
            type="number"
            name="nhis_claim_submission_days"
            min="1"
            value={settings.nhis_claim_submission_days}
            onChange={handleChange}
            className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors bg-white text-xs sm:text-sm"
          />
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="dashboard min-h-screen bg-[#F7F5F2] p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Loading Overlay */}
      {isBusy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A1A] bg-opacity-30 backdrop-blur-sm p-4">
          <div className="bg-white p-6 sm:p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-12 w-12 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-[#E8E3DC] border-t-[#008751]"></div>
              </div>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg font-semibold text-[#1A1A1A] text-center">{busyMessage}</p>
              <p className="mt-1 text-xs sm:text-sm text-[#5A5A5A] text-center">Please wait...</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-[#1A1A1A] flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-[#008751]">
                System Settings 
              </span>
            </h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-[#5A5A5A]">
              Manage your healthcare facility's configuration and preferences
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 bg-white border border-[#E8E3DC] px-3 sm:px-4 py-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#008751] flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
              {tenantInfo.name?.charAt(0) || 'T'}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-[#1A1A1A] truncate">{tenantInfo.name || 'Unknown Tenant'}</p>
              <p className="text-[10px] sm:text-xs text-[#5A5A5A]">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {message && (
        <div className={`mb-4 sm:mb-6 p-3 sm:p-4 border ${
          messageType === 'success' 
            ? 'bg-[#EAF3EE] border-[#D0E3D8] text-[#2D7D46]' 
            : 'bg-[#F5EDEA] border-[#E8D6D0] text-[#C8553D]'
        } flex items-center justify-between shadow-sm gap-2`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <FontAwesomeIcon 
              icon={messageType === 'success' ? faCheckCircle : faExclamationCircle}
              className={`${messageType === 'success' ? 'text-[#2D7D46]' : 'text-[#C8553D]'} flex-shrink-0`}
            />
            <p className="font-medium text-sm sm:text-base break-words">{message}</p>
          </div>
          <button 
            onClick={() => { setMessage(''); setMessageType(''); }}
            className="text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors flex-shrink-0 p-1"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      <form id="settings-form" onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between bg-white border border-[#E8E3DC] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faBars} className="text-[#5A5A5A]" />
                <span className="font-medium text-[#1A1A1A]">{sections.find(s => s.id === activeSection)?.label || 'General'}</span>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className={`text-[#5A5A5A] transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {mobileMenuOpen && (
              <div className="mt-2 bg-white border border-[#E8E3DC] p-2 animate-slideDown">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(section.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-200 text-left ${
                      activeSection === section.id
                        ? 'bg-[#E8F5EF] text-[#008751] border-l-2 border-[#008751]'
                        : 'text-[#5A5A5A] hover:bg-[#F7F5F2] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <FontAwesomeIcon icon={section.icon} className="text-base" />
                    <span className="font-medium text-sm">{section.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Navigation - Desktop */}
          <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
            <div className="bg-white border border-[#E8E3DC] p-4 sticky top-8">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 text-left ${
                      activeSection === section.id
                        ? 'bg-[#E8F5EF] text-[#008751] border-l-2 border-[#008751]'
                        : 'text-[#5A5A5A] hover:bg-[#F7F5F2] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <FontAwesomeIcon icon={section.icon} className="text-lg" />
                    <span className="font-medium text-sm">{section.label}</span>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-[#E8E3DC] hidden xl:block">
                <div className="bg-[#F7F5F2] p-4">
                  <p className="text-[10px] text-[#5A5A5A] font-medium uppercase tracking-wider">Quick Tips</p>
                  <p className="mt-2 text-sm text-[#5A5A5A]">
                    Settings are automatically saved to your tenant profile
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
            <div className="bg-white border border-[#E8E3DC] overflow-hidden">
              <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-[#E8E3DC] bg-[#F7F5F2]">
                <h2 className="text-base sm:text-lg font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <FontAwesomeIcon icon={sections.find(s => s.id === activeSection)?.icon || faCog} className="text-[#008751] text-sm" />
                  {sections.find(s => s.id === activeSection)?.label || 'General'} Settings
                </h2>
                <p className="text-xs text-[#5A5A5A] mt-0.5">
                  {activeSection === 'general' && 'Configure your facility\'s basic information and branding'}
                  {activeSection === 'billing' && 'Configure financial and currency preferences'}
                  {activeSection === 'notifications' && 'Manage how your facility receives alerts and updates'}
                  {activeSection === 'communication' && 'Configure your hospital\'s unique email and SMS sender identity'}
                  {activeSection === 'security' && 'Protect your facility\'s data with these security measures'}
                  {activeSection === 'backup' && 'Configure automated backup strategies for your data'}
                  {activeSection === 'nhis' && 'Configure National Health Insurance Scheme integration'}
                </p>
              </div>
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </form>

      {/* Invitation Section */}
      <div className="mt-4 sm:mt-6 border border-[#E8E3DC] bg-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-display font-semibold text-[#1A1A1A] flex items-center gap-2">
              <FontAwesomeIcon icon={faUserPlus} className="text-[#008751]" />
              Invite staff to this tenant
            </h3>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-[#5A5A5A]">
              Create a tenant-scoped registration link that expires after a chosen time and requires admin approval.
            </p>
          </div>
          <div className="bg-[#F7F5F2] px-3 py-1 text-xs sm:text-sm font-medium text-[#008751] flex-shrink-0 border border-[#E8E3DC]">
            {tablePagination.totalItems} total
          </div>
        </div>

        {inviteFeedback && (
          <div className={`mt-4 border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm ${
            inviteFeedbackType === 'success' 
              ? 'border-[#D0E3D8] bg-[#EAF3EE] text-[#2D7D46]' 
              : 'border-[#E8D6D0] bg-[#F5EDEA] text-[#C8553D]'
          }`}>
            {inviteFeedback}
          </div>
        )}

        <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="mb-1 block text-xs sm:text-sm font-medium text-[#5A5A5A]">Email address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full border border-[#D8D4CD] px-3 sm:px-4 py-2 sm:py-2.5 focus:border-[#008751] focus:outline-none transition-colors text-sm bg-white"
                placeholder="staff@facility.com"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs sm:text-sm font-medium text-[#5A5A5A]">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full border border-[#D8D4CD] px-3 sm:px-4 py-2 sm:py-2.5 focus:border-[#008751] focus:outline-none transition-colors text-sm bg-white"
              >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Administrator</option>
                <option value="hr_manager">HR Manager</option>
                <option value="accountant">Accountant</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="mb-1 block text-xs sm:text-sm font-medium text-[#5A5A5A]">Expiry (hours)</label>
              <input
                type="number"
                min="1"
                max="720"
                value={inviteExpiryHours}
                onChange={(e) => setInviteExpiryHours(e.target.value)}
                className="w-full border border-[#D8D4CD] px-3 sm:px-4 py-2 sm:py-2.5 focus:border-[#008751] focus:outline-none transition-colors text-sm bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs sm:text-sm font-medium text-[#5A5A5A]">Message (optional)</label>
              <input
                type="text"
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                className="w-full border border-[#D8D4CD] px-3 sm:px-4 py-2 sm:py-2.5 focus:border-[#008751] focus:outline-none transition-colors text-sm bg-white"
                placeholder="Welcome to the team"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <ButtonWithTooltip
              onClick={handleCreateInvitation}
              tooltip="Create invitation link"
              variant="primary"
              disabled={inviteLoading}
            >
              {inviteLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="mr-1.5 animate-spin text-[10px]" />
                  Creating link...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUserPlus} className="mr-1.5" />
                  Create invitation link
                </>
              )}
            </ButtonWithTooltip>
            {inviteLink && (
              <ButtonWithTooltip
                onClick={() => navigator.clipboard.writeText(inviteLink).then(() => setInviteCopied(true))}
                tooltip="Copy invitation link"
                variant="secondary"
              >
                <FontAwesomeIcon icon={faCopy} className="mr-1.5" />
                {inviteCopied ? 'Copied' : 'Copy link'}
              </ButtonWithTooltip>
            )}
          </div>

          {inviteLink && (
            <div className="border border-[#E8E3DC] bg-[#F7F5F2] p-3 text-xs sm:text-sm text-[#1A1A1A] break-all">
              <p className="mb-2 font-medium text-[#1A1A1A]">Invitation link</p>
              <p className="break-all">{inviteLink}</p>
            </div>
          )}
        </div>

        {/* Combined Table */}
        <div className="mt-5 sm:mt-6 border border-[#E8E3DC] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F5F2] border-b border-[#E8E3DC]">
                <tr>
                  <th className="px-3 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faUser} className="text-[#5A5A5A]" />
                      <span className="hidden xs:inline">Email/Name</span>
                      <span className="xs:hidden">User</span>
                    </span>
                  </th>
                  <th className="px-3 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden sm:table-cell">
                    <FontAwesomeIcon icon={faUserShield} className="mr-1 text-[#5A5A5A]" />
                    Role
                  </th>
                  <th className="px-3 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden md:table-cell">
                    <FontAwesomeIcon icon={faClipboardList} className="mr-1 text-[#5A5A5A]" />
                    Type
                  </th>
                  <th className="px-3 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">
                    <FontAwesomeIcon icon={faClock} className="mr-1 text-[#5A5A5A]" />
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider hidden lg:table-cell">
                    Expires
                  </th>
                  <th className="px-3 py-3 text-center text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {pendingUsersLoading || invitationsLoading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-[#5A5A5A]">
                      <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                      Loading...
                    </td>
                  </tr>
                ) : getPaginatedTableData().length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-[#5A5A5A]">
                      No pending approvals or invitations.
                    </td>
                  </tr>
                ) : (
                  getPaginatedTableData().map((item) => (
                    <tr key={item.id} className={`hover:bg-[#F7F5F2] transition-colors ${item.archived ? 'bg-[#F7F5F2]' : ''}`}>
                      <td className="px-3 py-3">
                        <div>
                          <p className="font-medium text-[#1A1A1A] text-xs sm:text-sm truncate max-w-[120px] xs:max-w-[180px] sm:max-w-[200px]">
                            {item.name || item.email}
                          </p>
                          <p className="text-[10px] sm:text-xs text-[#5A5A5A] truncate max-w-[120px] xs:max-w-[180px] sm:max-w-[200px]">
                            {item.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <span className="text-xs font-medium text-[#5A5A5A] capitalize">
                          {item.role}
                        </span>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <span className={`text-xs font-medium px-2 py-0.5 ${
                          item.type === 'pending'
                            ? 'bg-[#F5F0EA] text-[#C87D3D] border border-[#F0E8DC]'
                            : item.archived
                            ? 'bg-[#F0EDE8] text-[#5A5A5A] border border-[#E8E3DC]'
                            : 'bg-[#E8F5EF] text-[#008751] border border-[#C8E0D5]'
                        }`}>
                          {item.type === 'pending' ? 'Approval' : item.archived ? 'Archived' : 'Invitation'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-xs font-medium px-2 py-1 ${
                          item.status === 'pending'
                            ? 'bg-[#F5F0EA] text-[#C87D3D] border border-[#F0E8DC]'
                            : item.status === 'accepted'
                            ? 'bg-[#EAF3EE] text-[#2D7D46] border border-[#D0E3D8]'
                            : 'bg-[#F0EDE8] text-[#5A5A5A] border border-[#E8E3DC]'
                        }`} title={item.status}>
                          {item.status === 'pending' ? (
                            <FontAwesomeIcon icon={faClock} />
                          ) : item.status === 'accepted' ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : (
                            <FontAwesomeIcon icon={faCircle} />
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-3 hidden lg:table-cell">
                        <span className="text-xs text-[#5A5A5A]">
                          {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          {item.type === 'pending' ? (
                            <>
                              <IconButton
                                icon={faCheck}
                                onClick={() => handleApproveUser(item.user.id)}
                                tooltip="Approve user"
                                variant="success"
                                size="sm"
                              />
                              <IconButton
                                icon={faTimes}
                                onClick={() => handleRejectUser(item.user.id)}
                                tooltip="Reject user"
                                variant="danger"
                                size="sm"
                              />
                            </>
                          ) : (
                            <div className="flex items-center gap-1">
                              {item.archived ? (
                                <IconButton
                                  icon={faUndo}
                                  onClick={() => handleUnarchiveInvitation(item.id)}
                                  tooltip="Unarchive"
                                  variant="primary"
                                  size="sm"
                                />
                              ) : (
                                <IconButton
                                  icon={faArchive}
                                  onClick={() => handleArchiveInvitation(item.id)}
                                  tooltip="Archive"
                                  variant="warning"
                                  size="sm"
                                />
                              )}
                              <IconButton
                                icon={faTrash}
                                onClick={() => handleDeleteInvitation(item.id)}
                                tooltip="Delete permanently"
                                variant="danger"
                                size="sm"
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={tablePagination.currentPage}
            totalPages={tablePagination.totalPages}
            totalItems={tablePagination.totalItems}
            itemsPerPage={tablePagination.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 sm:mt-6 bg-white border border-[#E8E3DC] p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
          <ButtonWithTooltip
            type="button"
            onClick={() => window.location.reload()}
            tooltip="Discard all changes"
            variant="secondary"
          >
            <FontAwesomeIcon icon={faUndo} />
            Discard changes
          </ButtonWithTooltip>
          <ButtonWithTooltip
            type="submit"
            form="settings-form"
            tooltip="Save all settings"
            variant="primary"
          >
            <FontAwesomeIcon icon={faSave} />
            Save all settings
          </ButtonWithTooltip>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }

        @media (min-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:hidden {
            display: none;
          }
          .xs\\:flex-row {
            flex-direction: row;
          }
          .xs\\:w-auto {
            width: auto;
          }
          .xs\\:block {
            display: block;
          }
        }
      `}</style>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteInvitation}
        title="Delete invitation"
        message={`Are you sure you want to permanently delete the invitation for ${deleteTargetName}? This action cannot be undone.`}
        confirmText="Delete permanently"
        cancelText="Cancel"
        type="delete"
      />
    </div>
  );
};

export default Settings;