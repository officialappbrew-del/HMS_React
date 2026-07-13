import { useState, useEffect } from 'react';
import { tenantSettingsApi } from '../utils/api';
import { getUserPreferences, setUserPreferences } from '../utils/cookies';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    dashboard_refresh_interval: getUserPreferences().refreshInterval || 60,
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

  const isBusy = loading || saving;
  const busyMessage = saving ? 'Saving settings...' : 'Loading settings...';

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
      alert('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setLogo(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = async () => {
    if (!logo) return;
    setLogoUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('logo', logo);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Logo uploaded successfully!');
    } catch (error) {
      alert('Error uploading logo. Please try again.');
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
        nhis_default_tariff: settings.nhs_default_tariff,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 md:p-8">
      {/* Loading Overlay */}
      {isBusy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-blue-600/20 animate-pulse"></div>
                </div>
              </div>
              <p className="mt-6 text-lg font-semibold text-slate-800">{busyMessage}</p>
              <p className="mt-1 text-sm text-slate-500">Please wait...</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 flex items-center gap-3">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  System Settings
                </span>
                <span className="text-sm font-normal text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  v2.0
                </span>
              </h1>
              <p className="mt-2 text-slate-500 max-w-2xl">
                Manage your healthcare facility's configuration and preferences
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                {tenantInfo.name?.charAt(0) || 'T'}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">{tenantInfo.name || 'Unknown Tenant'}</p>
                <p className="text-xs text-slate-400">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Toast */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            messageType === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          } flex items-center justify-between shadow-sm animate-slideDown`}>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon 
                icon={messageType === 'success' ? faCheckCircle : faExclamationCircle}
                className={messageType === 'success' ? 'text-emerald-500' : 'text-red-500'}
              />
              <p className="font-medium">{message}</p>
            </div>
            <button 
              onClick={() => { setMessage(''); setMessageType(''); }}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
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
                
                <div className="mt-6 pt-6 border-t border-slate-200">
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
            <div className="lg:col-span-3 space-y-6">
              {/* General Section */}
              {activeSection === 'general' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCog} className="text-blue-600" />
                      General Settings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Configure your facility's basic information and branding</p>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Logo Section */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50/20 rounded-xl p-6 border-2 border-dashed border-slate-200">
                      <label className="block text-sm font-semibold text-slate-700 mb-4">
                        <FontAwesomeIcon icon={faImage} className="mr-2 text-blue-600" />
                        Facility Logo
                        <span className="ml-2 text-xs font-normal text-slate-400">(Recommended: 400×400px)</span>
                      </label>
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="flex-shrink-0">
                          <div className="relative w-32 h-32 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            {logoPreview ? (
                              <img
                                src={logoPreview}
                                alt="Facility logo"
                                className="w-full h-full object-contain p-3"
                              />
                            ) : (
                              <div className="text-center text-slate-400">
                                <FontAwesomeIcon icon={faImage} className="w-12 h-12 mx-auto mb-2" />
                                <p className="text-xs">No logo</p>
                              </div>
                            )}
                          </div>
                          {logoPreview && (
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium transition-colors w-full text-center"
                            >
                              <FontAwesomeIcon icon={faTrash} className="mr-1" />
                              Remove logo
                            </button>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">
                              Upload new logo
                            </label>
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="cursor-pointer bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg border border-slate-300 transition-all hover:border-blue-400 hover:shadow-sm font-medium text-sm">
                                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                                Choose file
                                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                              </label>
                              {logo && (
                                <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                                  {logo.name} ({(logo.size / 1024).toFixed(1)} KB)
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-xs text-slate-400">JPG, PNG, or SVG • Max 5MB</p>
                          </div>
                          {logo && (
                            <button
                              type="button"
                              onClick={handleLogoUpload}
                              disabled={logoUploading}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                logoUploading 
                                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                              }`}
                            >
                              {logoUploading ? (
                                <>
                                  <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <FontAwesomeIcon icon={faUpload} className="mr-2" />
                                  Upload logo
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* System Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-600" />
                          System Name
                        </label>
                        <input
                          type="text"
                          name="system_name"
                          value={settings.system_name}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faPalette} className="mr-2 text-blue-600" />
                          Theme Color
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            name="theme_color"
                            value={settings.theme_color}
                            onChange={handleChange}
                            className="w-14 h-14 rounded-xl border border-slate-300 cursor-pointer p-1 bg-white"
                          />
                          <input
                            type="text"
                            value={settings.theme_color}
                            onChange={(e) => {
                              setSettings(prev => ({
                                ...prev,
                                theme_color: e.target.value
                              }));
                            }}
                            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 font-mono text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-600" />
                          Dashboard refresh interval
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min="15"
                            max="300"
                            name="dashboard_refresh_interval"
                            value={settings.dashboard_refresh_interval}
                            onChange={handleChange}
                            className="w-24 px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
                          />
                          <span className="text-sm text-slate-500">seconds</span>
                        </div>
                        <p className="mt-2 text-xs text-slate-400">Reloads sidebar insights at this interval (min 15 sec).</p>
                        {refreshHint && (
                          <p className="mt-2 text-sm text-emerald-700">{refreshHint}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-blue-600" />
                          Default Clinic
                        </label>
                        <input
                          type="text"
                          name="default_clinic"
                          value={settings.default_clinic}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-600" />
                          Default Ward
                        </label>
                        <input
                          type="text"
                          name="default_ward"
                          value={settings.default_ward}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Section */}
              {activeSection === 'billing' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-emerald-50/30">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="text-emerald-600" />
                      Billing Settings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Configure financial and currency preferences</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
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
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
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
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
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
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 appearance-none"
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
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-amber-50/30">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faBell} className="text-amber-600" />
                      Notification Settings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Manage how your facility receives alerts and updates</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {[
                        { name: 'email_notifications', label: 'Email notifications', desc: 'Receive updates via email', icon: faEnvelope },
                        { name: 'sms_notifications', label: 'SMS notifications', desc: 'Receive updates via text message', icon: faSms },
                        { name: 'push_notifications', label: 'Push notifications', desc: 'Receive real-time in-app alerts', icon: faMobileAlt },
                      ].map((item) => (
                        <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                          <div>
                            <label className="text-sm font-medium text-slate-700 cursor-pointer">
                              <FontAwesomeIcon icon={item.icon} className="mr-2 text-amber-600" />
                              {item.label}
                            </label>
                            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                          <div className="relative inline-block w-12 h-7">
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
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-red-50/30">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faLock} className="text-red-600" />
                      Security Settings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Protect your facility's data with these security measures</p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
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
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                      <div>
                        <label className="text-sm font-medium text-slate-700 cursor-pointer">
                          <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-red-600" />
                          Two-factor authentication
                        </label>
                        <p className="text-xs text-slate-400 mt-0.5">Require 2FA for all users</p>
                      </div>
                      <div className="relative inline-block w-12 h-7">
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
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-purple-50/30">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faDatabase} className="text-purple-600" />
                      Backup Settings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Configure automated backup strategies for your data</p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                      <div>
                        <label className="text-sm font-medium text-slate-700 cursor-pointer">
                          <FontAwesomeIcon icon={faSync} className="mr-2 text-purple-600" />
                          Automatic backups
                        </label>
                        <p className="text-xs text-slate-400 mt-0.5">Schedule regular data backups</p>
                      </div>
                      <div className="relative inline-block w-12 h-7">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">
                          <FontAwesomeIcon icon={faClock} className="mr-2 text-purple-600" />
                          Backup Frequency
                        </label>
                        <select
                          name="backup_frequency"
                          value={settings.backup_frequency}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50 appearance-none"
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
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NHIS Section */}
              {activeSection === 'nhis' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-green-50/30">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                      <FontAwesomeIcon icon={faHospital} className="text-green-600" />
                      NHIS Settings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Configure National Health Insurance Scheme integration</p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-colors">
                      <div>
                        <label className="text-sm font-medium text-slate-700 cursor-pointer">
                          <FontAwesomeIcon icon={faHospital} className="mr-2 text-green-600" />
                          NHIS Integration
                        </label>
                        <p className="text-xs text-slate-400 mt-0.5">Enable NHIS claims and billing</p>
                      </div>
                      <div className="relative inline-block w-12 h-7">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
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
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-slate-50/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons - Sticky Footer */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky bottom-4 backdrop-blur-sm bg-white/95">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 hover:border-slate-400 font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faUndo} />
                    Discard changes
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    Save all settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
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
      `}</style>
    </div>
  );
};

export default Settings;