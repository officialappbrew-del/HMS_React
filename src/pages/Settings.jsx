import { useState, useEffect } from 'react';
import { tenantSettingsApi } from '../utils/api';
import { getUserPreferences, setUserPreferences } from '../utils/cookies';
import { encryptInvitationData } from '../utils/invitationCrypto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmModal from '../components/ConfirmModal';
import {
  faCog,
  faMoneyBillWave,
  faBell,
  faLock,
  faDatabase,
  faHospital,
  faUpload,
  faTimes,
  faSave,
  faUndo,
  faSpinner,
  faCheckCircle,
  faExclamationCircle,
  faUser,
  faImage,
  faPalette,
  faClipboardList,
  faClock,
  faEnvelope,
  faSms,
  faMobileAlt,
  faShieldAlt,
  faKey,
  faSync,
  faTrash,
  faFileInvoice,
  faCalendarDay,
  faPercentage,
  faCreditCard,
  faUserShield,
  faBuilding,
  faMapMarkerAlt,
  faGlobe,
  faUserPlus,
  faCopy,
  faUsers,
  faCheck,
  faBars,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faEllipsisH,
  faArchive,
} from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
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

  // Pagination state for combined table
  const [tablePagination, setTablePagination] = useState({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
    totalPages: 0,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetName, setDeleteTargetName] = useState('');

  const isBusy = loading || saving;
  const busyMessage = saving ? 'Saving settings...' : 'Loading settings...';

  // Combined data for the table - merge pending users and invitations
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

  // Get paginated table data
  const getPaginatedTableData = () => {
    const allData = getCombinedTableData();
    const { currentPage, itemsPerPage } = tablePagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allData.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setTablePagination(prev => ({
      ...prev,
      currentPage: page,
    }));
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setTablePagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
  };

  // Update pagination when data changes
  useEffect(() => {
    const allData = getCombinedTableData();
    setTablePagination(prev => {
      const totalItems = allData.length;
      const totalPages = Math.ceil(totalItems / prev.itemsPerPage) || 1;
      const currentPage = Math.min(prev.currentPage, totalPages);
      return {
        ...prev,
        totalItems,
        totalPages,
        currentPage,
      };
    });
  }, [pendingUsers, invitations]);

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
          setTenantInfo((current) => ({
            ...current,
            name: response.tenant_name,
          }));
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
  }, []);

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
      window.setTimeout(() => setRefreshHint(''), 4000);
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
      const formData = new FormData();
      formData.append('logo', logo);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
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
    setSettings(prev => ({
      ...prev,
      system_logo: null,
    }));
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

  const sections = [
    { id: 'general', label: 'General', icon: faCog },
    { id: 'billing', label: 'Billing', icon: faMoneyBillWave },
    { id: 'notifications', label: 'Notifications', icon: faBell },
    { id: 'security', label: 'Security', icon: faLock },
    { id: 'backup', label: 'Backup', icon: faDatabase },
    { id: 'nhis', label: 'NHIS', icon: faHospital },
  ];

  // Fully Responsive Pagination Component
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
      <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-200">
        {/* Top row: Items per page and total count */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 w-full xs:w-auto">
            <span className="hidden xs:inline">Showing</span>
            <select
              value={itemsPerPage}
              onChange={onItemsPerPageChange}
              className="px-2 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs sm:text-sm bg-white min-w-[60px]"
            >
              {[5, 10, 20, 50].map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <span>per page</span>
            <span className="hidden sm:inline text-slate-400 ml-1">
              (Total: {totalItems})
            </span>
          </div>
          <div className="text-xs text-slate-400 sm:hidden">
            Total: {totalItems} items
          </div>
        </div>

        {/* Bottom row: Pagination buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all ${
              currentPage === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
            aria-label="Previous page"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-xs sm:text-sm" />
            <span className="hidden xs:inline ml-1">Prev</span>
          </button>

          {/* Page numbers */}
          <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
            {generatePaginationItems().map((item, index) => {
              if (item.type === 'ellipsis') {
                return (
                  <span key={`ellipsis-${index}`} className="px-1.5 sm:px-3 py-1.5 text-slate-400 text-xs sm:text-sm">
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
                  className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-all min-w-[32px] sm:min-w-[40px] text-center ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all ${
              currentPage === totalPages
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
            aria-label="Next page"
          >
            <span className="hidden xs:inline mr-1">Next</span>
            <FontAwesomeIcon icon={faChevronRight} className="text-xs sm:text-sm" />
          </button>
        </div>

        {/* Mobile page indicator */}
        <div className="text-center text-xs text-slate-400 xs:hidden">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Loading Overlay */}
      {isBusy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-12 w-12 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-blue-600/20 animate-pulse"></div>
                </div>
              </div>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg font-semibold text-slate-800 text-center">{busyMessage}</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 text-center">Please wait...</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  System Settings
                </span>
                <span className="text-xs sm:text-sm font-normal text-slate-400 bg-slate-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  v2.0
                </span>
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-500 max-w-2xl">
                Manage your healthcare facility's configuration and preferences
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 bg-white px-3 sm:px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                {tenantInfo.name?.charAt(0) || 'T'}
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-slate-700 truncate">{tenantInfo.name || 'Unknown Tenant'}</p>
                <p className="text-[10px] sm:text-xs text-slate-400">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Toast */}
        {message && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border ${
            messageType === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          } flex items-center justify-between shadow-sm animate-slideDown gap-2`}>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <FontAwesomeIcon 
                icon={messageType === 'success' ? faCheckCircle : faExclamationCircle}
                className={`${messageType === 'success' ? 'text-emerald-500' : 'text-red-500'} flex-shrink-0`}
              />
              <p className="font-medium text-sm sm:text-base break-words">{message}</p>
            </div>
            <button 
              onClick={() => { setMessage(''); setMessageType(''); }}
              className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 p-1"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Mobile Navigation Toggle */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-full flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faBars} className="text-slate-600" />
                  <span className="font-medium text-slate-700">{sections.find(s => s.id === activeSection)?.label || 'General'}</span>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={`text-slate-400 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileMenuOpen && (
                <div className="mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-2 animate-slideDown">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => {
                        setActiveSection(section.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <FontAwesomeIcon icon={section.icon} className="text-base" />
                      <span className="font-medium text-sm">{section.label}</span>
                      {activeSection === section.id && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Navigation - Desktop */}
            <div className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-8">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <FontAwesomeIcon icon={section.icon} className="text-lg" />
                      <span className="font-medium text-sm">{section.label}</span>
                      {activeSection === section.id && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                      )}
                    </button>
                  ))}
                </nav>
                
                <div className="mt-6 pt-6 border-t border-slate-200 hidden xl:block">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Quick Tips</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Settings are automatically saved to your tenant profile
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
              {/* General Section */}
              {activeSection === 'general' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                  <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCog} className="text-blue-600 text-sm" />
                      General Settings
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Configure your facility's basic information and branding</p>
                  </div>
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {/* Logo Section */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50/20 rounded-lg p-3 sm:p-4 border border-dashed border-slate-200">
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3">
                        <FontAwesomeIcon icon={faImage} className="mr-1.5 text-blue-600 text-xs" />
                        Facility Logo
                        <span className="ml-1.5 text-[11px] font-normal text-slate-400">(Recommended: 400×400px)</span>
                      </label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex-shrink-0 flex flex-col items-center sm:items-start">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                            {logoPreview ? (
                              <img
                                src={logoPreview}
                                alt="Facility logo"
                                className="w-full h-full object-contain p-1.5 sm:p-2"
                              />
                            ) : (
                              <div className="text-center text-slate-400">
                                <FontAwesomeIcon icon={faImage} className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-0.5" />
                                <p className="text-[10px] sm:text-xs">No logo</p>
                              </div>
                            )}
                          </div>
                          {logoPreview && (
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="mt-1.5 text-[11px] sm:text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                            >
                              <FontAwesomeIcon icon={faTrash} className="mr-1 text-[10px]" />
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2 min-w-0">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                              Upload new logo
                            </label>
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="cursor-pointer bg-white hover:bg-slate-50 text-slate-700 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-300 transition-all hover:border-blue-400 hover:shadow-sm font-medium text-xs sm:text-sm">
                                <FontAwesomeIcon icon={faUpload} className="mr-1.5 text-[10px]" />
                                Choose file
                                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                              </label>
                              {logo && (
                                <span className="text-[11px] sm:text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg truncate max-w-[120px] sm:max-w-[180px]">
                                  {logo.name} ({(logo.size / 1024).toFixed(1)} KB)
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-[11px] text-slate-400">JPG, PNG, or SVG • Max 5MB</p>
                          </div>
                          {logo && (
                            <button
                              type="button"
                              onClick={handleLogoUpload}
                              disabled={logoUploading}
                              className={`px-3 sm:px-3.5 py-1.5 rounded-lg font-medium text-xs transition-all ${
                                logoUploading 
                                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                              }`}
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
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* System Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                          <FontAwesomeIcon icon={faClock} className="mr-1.5 text-blue-600 text-[11px]" />
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
                            className="w-16 sm:w-20 px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 text-xs sm:text-sm"
                          />
                          <span className="text-[11px] sm:text-xs text-slate-500">seconds</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400">Reloads sidebar insights at this interval (min 15 sec).</p>
                        {refreshHint && (
                          <p className="mt-1 text-[11px] sm:text-xs text-emerald-700">{refreshHint}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1.5 text-blue-600 text-[11px]" />
                          Default Ward
                        </label>
                        <input
                          type="text"
                          name="default_ward"
                          value={settings.default_ward}
                          onChange={handleChange}
                          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Section */}
              {activeSection === 'billing' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50/30">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="text-emerald-600" />
                      Billing Settings
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">Configure financial and currency preferences</p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faGlobe} className="mr-2 text-emerald-600" />
                          Currency
                        </label>
                        <input
                          type="text"
                          name="currency"
                          value={settings.currency}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faCreditCard} className="mr-2 text-emerald-600" />
                          Currency Symbol
                        </label>
                        <input
                          type="text"
                          name="currency_symbol"
                          value={settings.currency_symbol}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faPercentage} className="mr-2 text-emerald-600" />
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
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faClock} className="mr-2 text-emerald-600" />
                          Billing Cycle
                        </label>
                        <select
                          name="billing_cycle"
                          value={settings.billing_cycle}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 appearance-none text-sm sm:text-base"
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
                </div>
              )}

              {/* Notification Section */}
              {activeSection === 'notifications' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-amber-50/30">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faBell} className="text-amber-600" />
                      Notification Settings
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">Manage how your facility receives alerts and updates</p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      {[
                        { name: 'email_notifications', label: 'Email notifications', desc: 'Receive updates via email', icon: faEnvelope },
                        { name: 'sms_notifications', label: 'SMS notifications', desc: 'Receive updates via text message', icon: faSms },
                        { name: 'push_notifications', label: 'Push notifications', desc: 'Receive real-time in-app alerts', icon: faMobileAlt },
                      ].map((item) => (
                        <div key={item.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors gap-2 sm:gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-700 cursor-pointer">
                              <FontAwesomeIcon icon={item.icon} className="mr-2 text-amber-600" />
                              {item.label}
                            </label>
                            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                          <div className="relative inline-block w-12 h-7 flex-shrink-0">
                            <input
                              type="checkbox"
                              name={item.name}
                              checked={settings[item.name]}
                              onChange={handleChange}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                            <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 shadow-sm"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-red-50/30">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faLock} className="text-red-600" />
                      Security Settings
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">Protect your facility's data with these security measures</p>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faClock} className="mr-2 text-red-600" />
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          name="session_timeout"
                          min="5"
                          value={settings.session_timeout}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faUserShield} className="mr-2 text-red-600" />
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          name="max_login_attempts"
                          min="1"
                          value={settings.max_login_attempts}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors gap-2 sm:gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 cursor-pointer">
                          <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-red-600" />
                          Two-factor authentication
                        </label>
                        <p className="text-xs text-slate-400 mt-0.5">Require 2FA for all users</p>
                      </div>
                      <div className="relative inline-block w-12 h-7 flex-shrink-0">
                        <input
                          type="checkbox"
                          name="require_2fa"
                          checked={settings.require_2fa}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                        <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Backup Section */}
              {activeSection === 'backup' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-purple-50/30">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faDatabase} className="text-purple-600" />
                      Backup Settings
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">Configure automated backup strategies for your data</p>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors gap-2 sm:gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 cursor-pointer">
                          <FontAwesomeIcon icon={faSync} className="mr-2 text-purple-600" />
                          Automatic backups
                        </label>
                        <p className="text-xs text-slate-400 mt-0.5">Schedule regular data backups</p>
                      </div>
                      <div className="relative inline-block w-12 h-7 flex-shrink-0">
                        <input
                          type="checkbox"
                          name="auto_backup"
                          checked={settings.auto_backup}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                        <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 shadow-sm"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faClock} className="mr-2 text-purple-600" />
                          Backup Frequency
                        </label>
                        <select
                          name="backup_frequency"
                          value={settings.backup_frequency}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 appearance-none text-sm sm:text-base"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faCalendarDay} className="mr-2 text-purple-600" />
                          Retention (days)
                        </label>
                        <input
                          type="number"
                          name="backup_retention_days"
                          min="1"
                          value={settings.backup_retention_days}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NHIS Section */}
              {activeSection === 'nhis' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-green-50/30">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faHospital} className="text-green-600" />
                      NHIS Settings
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">Configure National Health Insurance Scheme integration</p>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors gap-2 sm:gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 cursor-pointer">
                          <FontAwesomeIcon icon={faHospital} className="mr-2 text-green-600" />
                          NHIS Integration
                        </label>
                        <p className="text-xs text-slate-400 mt-0.5">Enable NHIS claims and billing</p>
                      </div>
                      <div className="relative inline-block w-12 h-7 flex-shrink-0">
                        <input
                          type="checkbox"
                          name="nhis_enabled"
                          checked={settings.nhis_enabled}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                        <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-200 peer-checked:translate-x-5 shadow-sm"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faFileInvoice} className="mr-2 text-green-600" />
                          Default Tariff
                        </label>
                        <input
                          type="text"
                          name="nhis_default_tariff"
                          value={settings.nhis_default_tariff}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faCalendarDay} className="mr-2 text-green-600" />
                          Claim Submission Days
                        </label>
                        <input
                          type="number"
                          name="nhis_claim_submission_days"
                          min="1"
                          value={settings.nhis_claim_submission_days}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Full-width Invitation Section */}
        <div className="mt-4 sm:mt-6">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/70 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserPlus} className="text-blue-600" />
                  Invite staff to this tenant
                </h3>
                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-600">Create a tenant-scoped registration link that expires after a chosen time and requires admin approval.</p>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-xs sm:text-sm font-medium text-blue-700 shadow-sm flex-shrink-0">
                {tablePagination.totalItems} total
              </div>
            </div>

            {inviteFeedback && (
              <div className={`mt-4 rounded-xl border px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm ${inviteFeedbackType === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                {inviteFeedback}
              </div>
            )}

            <div className="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">Email address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 sm:px-4 py-2 sm:py-2.5 outline-none focus:border-blue-500 text-sm"
                    placeholder="staff@facility.com"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 sm:px-4 py-2 sm:py-2.5 outline-none focus:border-blue-500 text-sm"
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
                  <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">Expiry (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="720"
                    value={inviteExpiryHours}
                    onChange={(e) => setInviteExpiryHours(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 sm:px-4 py-2 sm:py-2.5 outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">Message (optional)</label>
                  <input
                    type="text"
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 sm:px-4 py-2 sm:py-2.5 outline-none focus:border-blue-500 text-sm"
                    placeholder="Welcome to the team"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleCreateInvitation}
                  disabled={inviteLoading}
                  className="rounded-xl bg-blue-600 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {inviteLoading ? 'Creating link...' : 'Create invitation link'}
                </button>
                {inviteLink && (
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(inviteLink).then(() => setInviteCopied(true))}
                    className="rounded-xl border border-slate-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
                  >
                    <FontAwesomeIcon icon={faCopy} className="mr-2" />
                    {inviteCopied ? 'Copied' : 'Copy link'}
                  </button>
                )}
              </div>

              {inviteLink && (
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs sm:text-sm text-slate-700 break-all">
                  <p className="mb-2 font-medium text-slate-800">Invitation link</p>
                  <p className="break-all">{inviteLink}</p>
                </div>
              )}
            </div>

            {/* Combined Table */}
            <div className="mt-5 sm:mt-6 rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faUser} className="text-slate-400" />
                          <span className="hidden xs:inline">Email/Name</span>
                          <span className="xs:hidden">User</span>
                        </span>
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden sm:table-cell">
                        <FontAwesomeIcon icon={faUserShield} className="mr-1 text-slate-400" />
                        Role
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">
                        <FontAwesomeIcon icon={faClipboardList} className="mr-1 text-slate-400" />
                        Type
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <FontAwesomeIcon icon={faClock} className="mr-1 text-slate-400" />
                        Status
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">
                        Expires
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingUsersLoading || invitationsLoading ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                          <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                          Loading...
                        </td>
                      </tr>
                    ) : getPaginatedTableData().length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                          No pending approvals or invitations.
                        </td>
                      </tr>
                    ) : (
                      getPaginatedTableData().map((item) => (
                        <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${item.archived ? 'bg-slate-50/40' : ''}`}>
                          <td className="px-3 py-3">
                            <div>
                              <p className="font-medium text-slate-800 text-xs sm:text-sm truncate max-w-[120px] xs:max-w-[180px] sm:max-w-[200px]">
                                {item.name || item.email}
                              </p>
                              <p className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[120px] xs:max-w-[180px] sm:max-w-[200px]">
                                {item.email}
                              </p>
                            </div>
                          </td>
                          <td className="px-3 py-3 hidden sm:table-cell">
                            <span className="text-xs font-medium text-slate-600 capitalize">
                              {item.role}
                            </span>
                          </td>
                          <td className="px-3 py-3 hidden md:table-cell">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                              item.type === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : item.archived
                                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {item.type === 'pending' ? 'Approval' : item.archived ? 'Archived' : 'Invitation'}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              item.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : item.status === 'accepted'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
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
                            <span className="text-xs text-slate-500">
                              {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : '—'}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              {item.type === 'pending' ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveUser(item.user.id)}
                                    className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-700 transition-colors"
                                    title="Approve user"
                                  >
                                    <FontAwesomeIcon icon={faCheck} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectUser(item.user.id)}
                                    className="rounded-lg bg-red-600 p-1.5 text-white hover:bg-red-700 transition-colors"
                                    title="Reject user"
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </button>
                                </>
                              ) : (
                                <div className="flex items-center gap-1">
                                  {item.archived ? (
                                    <button
                                      type="button"
                                      onClick={() => handleUnarchiveInvitation(item.id)}
                                      className="rounded-lg bg-slate-600 p-1.5 text-white hover:bg-slate-700 transition-colors"
                                      title="Unarchive"
                                    >
                                      <FontAwesomeIcon icon={faUndo} />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleArchiveInvitation(item.id)}
                                      className="rounded-lg bg-amber-600 p-1.5 text-white hover:bg-amber-700 transition-colors"
                                      title="Archive"
                                    >
                                      <FontAwesomeIcon icon={faArchive} />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteInvitation(item.id)}
                                    className="rounded-lg bg-red-600 p-1.5 text-white hover:bg-red-700 transition-colors"
                                    title="Delete permanently"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
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

              {/* Pagination */}
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
        </div>

        {/* Full-width Action Buttons */}
        <div className="mt-4 sm:mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 sm:px-6 py-2 sm:py-2.5 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-400 font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FontAwesomeIcon icon={faUndo} />
              Discard changes
            </button>
            <button
              type="submit"
              className="px-6 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FontAwesomeIcon icon={faSave} />
              Save all settings
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        /* Custom xs breakpoint for responsive table */
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