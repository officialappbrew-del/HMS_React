import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, Eye, EyeOff, Lock, User, ArrowRight,
  CheckCircle, AlertCircle, ChevronLeft, Key
} from 'lucide-react';
import { apiRequest } from '../../utils/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('adminAuthenticated') === 'true') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const payload = {
        password: formData.password,
      };
      if (formData.identifier.trim()) {
        payload.username = formData.identifier.trim();
        payload.identifier = formData.identifier.trim();
      }

      const response = await apiRequest('/api/v1/auth/login/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const authData = response?.tokens || response?.data || response || {};
      const token = authData.access_token || response?.access_token || response?.token || authData.token;
      const user = response?.user || authData.user || {};

      if (!token) {
        throw new Error('Authentication token was not returned by the server.');
      }

      const refreshToken = authData.refresh_token || response?.refresh_token || response?.refreshToken || authData.refreshToken;

      if (response?.requires_2fa || authData.requires_2fa) {
        setUserId(user.id || response?.user_id);
        setRequires2FA(true);
        setLoading(false);
        return;
      }

      const isSuperAdmin = user.is_superadmin === true || user.role === 'super_admin' || user.role === 'system_admin' || user.is_superuser === true;
      if (!isSuperAdmin) {
        throw new Error('Access denied. Super admin credentials required.');
      }

      completeLogin(user, token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    } catch (error) {
      setMessage(error.message || 'Login failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await apiRequest('/api/v1/auth/verify-2fa/', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          code: twoFACode,
          method: 'totp',
        }),
      });

      const authData = response?.tokens || response?.data || response || {};
      const token = authData.access_token || response?.access_token || response?.token || authData.token;
      const user = response?.user || authData.user || {};

      if (!token) {
        throw new Error('2FA verification failed.');
      }

      const isSuperAdmin = user.is_superadmin === true || user.role === 'super_admin' || user.role === 'system_admin' || user.is_superuser === true;
      if (!isSuperAdmin) {
        throw new Error('Access denied. Super admin credentials required.');
      }

      completeLogin(user, token);
    } catch (error) {
      setMessage(error.message || '2FA verification failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (user, token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    localStorage.setItem('userRole', user.role || 'system_admin');
    localStorage.setItem('userIsRootAdmin', user.is_root_admin ? 'true' : 'false');
    localStorage.setItem('userIsSuperuser', user.is_superuser ? 'true' : 'false');
    localStorage.setItem('userEmail', user.email || formData.identifier);
    localStorage.setItem('userName', user.username || user.user_id || formData.identifier);
    localStorage.setItem('userFirstName', user.first_name || '');
    localStorage.setItem('userLastName', user.last_name || '');
    const fullName = user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.full_name || user.username || formData.identifier;
    localStorage.setItem('userFullName', fullName);
    localStorage.setItem('userId', user.id || user.user_id || formData.identifier);
    localStorage.setItem('canCreateTenants', user.can_create_tenants ? 'true' : 'false');
    localStorage.setItem('canSuspendTenants', user.can_suspend_tenants ? 'true' : 'false');
    localStorage.setItem('canDeleteTenants', user.can_delete_tenants ? 'true' : 'false');
    localStorage.setItem('canViewAllTenants', user.can_view_all_tenants ? 'true' : 'false');
    localStorage.setItem('canManageAdminPermissions', user.can_manage_admin_permissions ? 'true' : 'false');
    sessionStorage.setItem('adminAuthenticated', 'true');

    window.dispatchEvent(new Event('authChanged'));
    setMessage('Login successful! Redirecting...');
    setMessageType('success');
    setTimeout(() => navigate('/dashboard', { replace: true }), 400);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#0D1917] px-4 py-8 font-['Inter',system-ui,sans-serif] antialiased">
      <div className="w-full max-w-[400px]">
        <div className="rounded-2xl border border-[#C79A3D]/20 bg-[#1C2B27] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-14px_rgba(13,25,23,0.18)] sm:p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex rounded-lg border border-[#C79A3D]/40 bg-[#C79A3D]/10 p-2">
              <ShieldCheck className="h-5 w-5 text-[#C79A3D]" />
            </span>
            <div>
              <h1 className="font-['Lora'] text-lg font-semibold text-[#F6F2E7]">Super Admin</h1>
              <p className="text-xs text-[#A9C0B6]">Platform administration</p>
            </div>
          </div>

          {message && (
            <div
              className={`mt-4 flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[13px] ${
                messageType === 'success'
                  ? 'border-[#3E6E58]/30 bg-[#3E6E58]/10 text-[#2C5245]'
                  : 'border-[#A6372E]/30 bg-[#A6372E]/10 text-[#8A2E26]'
              }`}
            >
              {messageType === 'success' ? (
                <CheckCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}

          {!requires2FA ? (
            <form className="mt-5 space-y-3.5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="identifier" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                  User ID, email, or username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder="Enter admin credentials"
                    className="w-full rounded-lg border border-[#1C2B27]/12 bg-[#0D1917] py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#F6F2E7] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-[#1C2B27]/12 bg-[#0D1917] py-2.5 pl-10 pr-10 text-[13.5px] text-[#F6F2E7] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6A0] transition-colors hover:text-[#F6F2E7]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#C79A3D] px-4 py-2.5 text-[13.5px] font-semibold text-[#0D1917] transition-colors hover:bg-[#B8860B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C2B27] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-[#0D1917]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in
                  </>
                ) : (
                  <>
                    Sign in to Admin
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form className="mt-5 space-y-3.5" onSubmit={handle2FASubmit}>
              <div>
                <label htmlFor="twoFACode" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                  Two-Factor Authentication Code
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
                  <input
                    id="twoFACode"
                    name="twoFACode"
                    type="text"
                    required
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full rounded-lg border border-[#1C2B27]/12 bg-[#0D1917] py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#F6F2E7] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#9AA6A0]">Enter the 6-digit code from your authenticator app.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#C79A3D] px-4 py-2.5 text-[13.5px] font-semibold text-[#0D1917] transition-colors hover:bg-[#B8860B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C2B27] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin text-[#0D1917]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying
                  </>
                ) : (
                  <>
                    Verify Code
                    <CheckCircle className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequires2FA(false);
                  setTwoFACode('');
                  setUserId(null);
                }}
                className="flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-[#A9C0B6] transition-colors hover:text-[#C79A3D]"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back to login
              </button>
            </form>
          )}

          <div className="mt-4 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-medium text-[#A9C0B6] transition-colors hover:text-[#C79A3D]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back to main app
            </Link>
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#5C6D67]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C79A3D]" />
              Restricted access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
