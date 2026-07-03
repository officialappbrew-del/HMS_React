import { useState, useEffect } from 'react';
import { tenantSettingsApi } from '../utils/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    hospitalName: 'SmartCare Hospital',
    address: '123 Medical Street, Lagos, Nigeria',
    phone: '+234 801 234 5678',
    email: 'admin@smartcare.ng',
    timezone: 'Africa/Lagos',
    currency: 'NGN',
    language: 'en',
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    maxPatientsPerDay: 100,
    workingHours: {
      start: '08:00',
      end: '18:00'
    },
    system_logo: null,
    system_name: 'SmartCare HMS',
    default_clinic: 'Main Clinic',
    default_ward: 'General Ward',
    theme_color: '#007bff',
    currency_symbol: '₦',
    tax_rate: 7.5,
    billing_cycle: 'monthly',
    push_notifications: true,
    password_policy: {},
    session_timeout: 30,
    max_login_attempts: 5,
    require_2fa: false,
    backup_frequency: 'daily',
    backup_retention_days: 30,
    custom_settings: {},
  });
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const response = await tenantSettingsApi.getCurrent();
        setSettings((prev) => ({
          ...prev,
          hospitalName: response.system_name || prev.hospitalName,
          address: response.address || prev.address,
          phone: response.phone || prev.phone,
          email: response.email || prev.email,
          timezone: response.timezone || prev.timezone,
          currency: response.currency || prev.currency,
          language: response.language || prev.language,
          autoBackup: response.auto_backup ?? prev.autoBackup,
          emailNotifications: response.email_notifications ?? prev.emailNotifications,
          smsNotifications: response.sms_notifications ?? prev.smsNotifications,
          maintenanceMode: response.maintenance_mode ?? prev.maintenanceMode,
          maxPatientsPerDay: response.max_patients_per_day ?? prev.maxPatientsPerDay,
          workingHours: response.working_hours || prev.workingHours,
          system_logo: response.system_logo || null,
          system_name: response.system_name || prev.system_name,
          default_clinic: response.default_clinic || prev.default_clinic,
          default_ward: response.default_ward || prev.default_ward,
          theme_color: response.theme_color || prev.theme_color,
          currency_symbol: response.currency_symbol || prev.currency_symbol,
          tax_rate: response.tax_rate ?? prev.tax_rate,
          billing_cycle: response.billing_cycle || prev.billing_cycle,
          push_notifications: response.push_notifications ?? prev.push_notifications,
          password_policy: response.password_policy || prev.password_policy,
          session_timeout: response.session_timeout ?? prev.session_timeout,
          max_login_attempts: response.max_login_attempts ?? prev.max_login_attempts,
          require_2fa: response.require_2fa ?? prev.require_2fa,
          backup_frequency: response.backup_frequency || prev.backup_frequency,
          backup_retention_days: response.backup_retention_days ?? prev.backup_retention_days,
          custom_settings: response.custom_settings || prev.custom_settings,
        }));
        if (response.system_logo) {
          setLogoPreview(response.system_logo);
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
  };

  const handleWorkingHoursChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value
      }
    }));
  };

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPG, PNG, etc.)');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    setLogo(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle logo upload
  const handleLogoUpload = async () => {
    if (!logo) return;

    setLogoUploading(true);
    
    try {
      // In a real app, you would upload to your server/cloud storage
      // Example with FormData:
      const formData = new FormData();
      formData.append('logo', logo);
      formData.append('hospitalId', 'your-hospital-id'); // Add hospital identifier
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay
      
      // For demo purposes, we'll just show success
      alert('Logo uploaded successfully!');
      
      // In real app:
      // const response = await fetch('/api/upload-logo', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();
      // Update logo URL in settings
      
    } catch (error) {
      alert('Error uploading logo. Please try again.');
      console.error('Logo upload error:', error);
    } finally {
      setLogoUploading(false);
    }
  };

  // Remove logo
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
        timezone: settings.timezone,
        currency: settings.currency,
        currency_symbol: settings.currency_symbol,
        tax_rate: settings.tax_rate,
        billing_cycle: settings.billing_cycle,
        email_notifications: settings.emailNotifications,
        sms_notifications: settings.smsNotifications,
        push_notifications: settings.push_notifications,
        auto_backup: settings.autoBackup,
        maintenance_mode: settings.maintenanceMode,
        session_timeout: settings.session_timeout,
        max_login_attempts: settings.max_login_attempts,
        require_2fa: settings.require_2fa,
        backup_frequency: settings.backup_frequency,
        backup_retention_days: settings.backup_retention_days,
        custom_settings: settings.custom_settings,
        default_clinic: settings.default_clinic,
        default_ward: settings.default_ward,
        theme_color: settings.theme_color,
        system_logo: logo || settings.system_logo,
      };

      const response = await tenantSettingsApi.updateCurrent(payload);
      setSettings(prev => ({
        ...prev,
        system_logo: response.system_logo || prev.system_logo,
      }));
      setMessage('Settings saved successfully.');
      setMessageType('success');
    } catch (error) {
      console.error('Save settings error:', error);
      setMessage('Unable to save settings.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">System Settings</h2>
        <p className="text-gray-600">Configure system-wide settings for your HMS tenant</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hospital Information with Logo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Hospital Information</h3>
          
          {/* Logo Section */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-3">Hospital Logo</label>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Logo Preview */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">No logo uploaded</p>
                      <p className="text-xs">Recommended: 400×400px</p>
                    </div>
                  )}
                </div>
                {logoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="mt-3 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Logo
                  </button>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-md border border-blue-300 transition-colors">
                      <span>Choose File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                    {logo && (
                      <span className="text-sm text-gray-600">
                        {logo.name} ({(logo.size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Supports JPG, PNG, SVG. Max file size: 5MB
                  </p>
                </div>

                {logo && (
                  <div>
                    <button
                      type="button"
                      onClick={handleLogoUpload}
                      disabled={logoUploading}
                      className={`px-4 py-2 rounded-md font-medium ${
                        logoUploading 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {logoUploading ? 'Uploading...' : 'Upload Logo'}
                    </button>
                    <p className="mt-2 text-sm text-gray-600">
                      Click "Upload Logo" to save your logo before saving all settings.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hospital Info Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
              <input
                type="text"
                name="hospitalName"
                value={settings.hospitalName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* System Configuration */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">System Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Africa/Lagos">West Africa Time (WAT)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Patients Per Day</label>
              <input
                type="number"
                name="maxPatientsPerDay"
                value={settings.maxPatientsPerDay}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Working Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={settings.workingHours.start}
                onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={settings.workingHours.end}
                onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Features */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Notifications & Features</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="autoBackup"
                checked={settings.autoBackup}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable automatic data backup
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable email notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={settings.smsNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable SMS notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Enable maintenance mode
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;