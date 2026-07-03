import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Eye, EyeOff, Mail, Lock, User, ArrowRight, 
  CheckCircle, AlertCircle, Sparkles, Building2, Users, 
  Activity, Clock, ChevronLeft, Key, Send, Fingerprint,
  Globe, Award, Zap
} from 'lucide-react';
import { apiRequest, API_BASE_URL } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('rememberMe') === 'true');
  const [tokenSent, setTokenSent] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  // Mouse parallax for background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Session restore
  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe') === 'true';
    const refreshToken = localStorage.getItem('refreshToken');

    if (!remembered || !refreshToken) return;

    const restoreSession = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        });

        const contentType = response.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json');
        const data = isJson ? await response.json().catch(() => ({})) : {};

        if (!response.ok) {
          throw new Error(data?.detail || data?.message || 'Session expired');
        }

        const accessToken = data.access || data.access_token;
        if (!accessToken) {
          throw new Error('No access token returned');
        }

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('authToken', accessToken);
        if (data.refresh || data.refresh_token) {
          localStorage.setItem('refreshToken', data.refresh || data.refresh_token);
        }
        window.dispatchEvent(new Event('authChanged'));
        navigate('/dashboard');
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userFirstName');
        localStorage.removeItem('userLastName');
        localStorage.removeItem('userFullName');
        localStorage.removeItem('licenseNumber');
        localStorage.removeItem('tenantId');
        localStorage.removeItem('tenantDomain');
        localStorage.removeItem('tenantName');
        setRememberMe(false);
        localStorage.removeItem('rememberMe');
        setLoading(false);
      }
    };

    restoreSession();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const loginIdentifier = formData.email.trim();
      const payload = {
        password: formData.password,
      };

      if (loginIdentifier) {
        payload.user_id = loginIdentifier;
        payload.username = loginIdentifier;
        payload.identifier = loginIdentifier;
      }

      const response = await apiRequest('/api/v1/auth/login/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const authData = response?.tokens || response?.data || response || {};
      const token = authData.access_token || response?.access_token || response?.token || authData.token || response?.accessToken || authData.accessToken;
      const refreshToken = authData.refresh_token || response?.refresh_token || response?.refreshToken || authData.refreshToken;
      const user = response?.user || authData.user || {};
      const tenant = response?.tenant || authData.tenant || {};
      const tenantPublicId = tenant.public_id || tenant.publicId || tenant.id || response?.tenant_public_id || response?.tenantId || authData.tenant_public_id || authData.tenantId;

      if (!token) {
        throw new Error('Authentication token was not returned by the server.');
      }

      if (response?.requires_2fa || authData.requires_2fa) {
        throw new Error('Two-factor verification is required before you can continue.');
      }

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken || '');
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role || '');
      localStorage.setItem('userIsRootAdmin', user.is_root_admin ? 'true' : 'false');
      localStorage.setItem('userEmail', user.email || formData.email);
      localStorage.setItem('userName', user.username || user.user_id || formData.email);
      localStorage.setItem('userFirstName', user.first_name || '');
      localStorage.setItem('userLastName', user.last_name || '');
      const fullName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.full_name || user.username || user.user_id || formData.email;
      localStorage.setItem('userFullName', fullName);
      localStorage.setItem('licenseNumber', user.license_number || user.mdcn_number || '');
      localStorage.setItem('userId', user.id || user.user_id || loginIdentifier);
      if (tenantPublicId) {
        localStorage.setItem('tenantId', tenantPublicId);
      }
      if (tenant.domain) {
        localStorage.setItem('tenantDomain', tenant.domain);
      }
      if (tenant.name) {
        localStorage.setItem('tenantName', tenant.name);
      }
      localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');

      window.dispatchEvent(new Event('authChanged'));
      setMessage('Login successful!');
      setMessageType('success');
      setTimeout(() => navigate('/dashboard'), 400);
    } catch (error) {
      setMessage(error.message || 'Login failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await apiRequest('/api/v1/auth/password-reset/', {
        method: 'POST',
        body: JSON.stringify({
          identifier: forgotIdentifier.trim(),
        }),
      });

      setMessage(response?.detail || 'If an account exists for this identifier, a password reset email has been sent.');
      setMessageType('success');
      setTokenSent(true);
    } catch (error) {
      setMessage(error.message || 'Failed to initiate password reset. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await apiRequest('/api/v1/auth/password-reset/confirm/', {
        method: 'POST',
        body: JSON.stringify({
          token: resetToken,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      setMessage(response?.detail || 'Password reset successfully. You can now log in with your new password.');
      setMessageType('success');
      setTokenSent(false);
      setForgotIdentifier('');
      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');
      setShowForgotPassword(false);
    } catch (error) {
      setMessage(error.message || 'Failed to reset password. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Quick stats for the sidebar
  const stats = [
    { label: 'Hospitals', value: '500+', icon: Building2 },
    { label: 'Patients', value: '2M+', icon: Users },
    { label: 'Daily Encounters', value: '12K+', icon: Activity },
    { label: 'Uptime', value: '99.99%', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter',system-ui,sans-serif] antialiased overflow-hidden">
      <div className="flex min-h-screen">
        {/* Left Side - Brand & Info */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute top-20 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float"
              style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
            />
            <div 
              className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-float delay-700"
              style={{ transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)` }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            
            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: Math.random() * 6 + 2 + 'px',
                  height: Math.random() * 6 + 2 + 'px',
                  background: `hsla(210, 100%, 80%, ${0.1 + Math.random() * 0.2})`,
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 10 + 's',
                  animationDuration: Math.random() * 20 + 15 + 's',
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 cursor-pointer">
            <div className="inline-flex rounded-2xl bg-white/10 backdrop-blur-sm p-3 shadow-lg shadow-blue-500/20">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SmartCare<span className="text-blue-200">HMS</span></h1>
              <p className="text-xs text-blue-200 font-medium tracking-wider uppercase">Enterprise Healthcare Platform</p>
            </div>
          </Link>

            <div className="mt-16 max-w-md">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
                <Zap className="h-4 w-4 text-blue-200 animate-pulse" />
                <span className="text-xs font-medium text-blue-100">Nigeria's Leading HMS</span>
              </div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                Welcome to the<br />
                <span className="bg-gradient-to-r from-blue-200 to-teal-200 bg-clip-text text-transparent">
                  Future of Healthcare
                </span>
              </h2>
              <p className="mt-4 text-blue-100 leading-relaxed">
                Unified platform for patient care, clinical operations, administration, 
                billing, diagnostics, and workforce management.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <Icon className="h-5 w-5 text-blue-200 group-hover:scale-110 transition-transform" />
                    <div className="mt-2 text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-blue-200">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-xs text-blue-200">
              <span className="flex items-center gap-1">
                <Award className="h-4 w-4" />
                HIPAA Compliant
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                NDPR Certified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                ISO 27001
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-8 lg:px-12 bg-slate-50/50">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <Link to="/" className="lg:hidden text-center mb-8 inline-block">
              <div className="inline-flex rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-3 shadow-lg shadow-blue-600/20">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h1 className="mt-3 text-2xl font-bold text-slate-900">SmartCare<span className="text-blue-600">HMS</span></h1>
            </Link>

            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 mb-4">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {showForgotPassword ? 'Password Recovery' : 'Secure Login'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {showForgotPassword ? (tokenSent ? 'Reset Your Password' : 'Forgot Password?') : 'Welcome Back'}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {showForgotPassword 
                  ? tokenSent 
                    ? 'Enter the reset token sent to your email' 
                    : 'Enter your email or user ID to receive a reset token'
                  : 'Sign in to access your healthcare workspace'
                }
              </p>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`mt-6 rounded-xl p-4 flex items-start gap-3 ${
                messageType === 'success' 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                  : 'bg-rose-50 border border-rose-200 text-rose-700'
              }`}>
                {messageType === 'success' 
                  ? <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  : <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                }
                <span className="text-sm">{message}</span>
              </div>
            )}

            {/* Login Form */}
            {!showForgotPassword ? (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    User ID, Email, or Username
                  </label>
                  <div className={`relative transition-all duration-300 ${
                    isFocused.email ? 'ring-2 ring-blue-500/20' : ''
                  }`}>
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                      isFocused.email ? 'text-blue-600' : 'text-slate-400'
                    }`} />
                    <input
                      id="email"
                      name="email"
                      type="text"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setIsFocused({ ...isFocused, email: true })}
                      onBlur={() => setIsFocused({ ...isFocused, email: false })}
                      placeholder="Enter your user ID or email"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className={`relative transition-all duration-300 ${
                    isFocused.password ? 'ring-2 ring-blue-500/20' : ''
                  }`}>
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                      isFocused.password ? 'text-blue-600' : 'text-slate-400'
                    }`} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setIsFocused({ ...isFocused, password: true })}
                      onBlur={() => setIsFocused({ ...isFocused, password: false })}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 py-3.5 text-sm outline-none transition-all duration-300 focus:border-blue-500 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowForgotPassword(true)} 
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="group w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                <div className="text-center">
                  <p className="text-xs text-slate-400">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </form>
            ) : tokenSent ? (
              // Reset Password Form
              <form className="mt-8 space-y-5" onSubmit={handleResetPassword}>
                <div>
                  <label htmlFor="resetToken" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Reset Token
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="resetToken"
                      name="resetToken"
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="Enter the reset token"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500">Check your email for the reset token</p>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 py-3.5 text-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 py-3.5 text-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Resetting...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setTokenSent(false);
                    setForgotIdentifier('');
                    setResetToken('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to login
                </button>
              </form>
            ) : (
              // Forgot Password Form
              <form className="mt-8 space-y-5" onSubmit={handleForgotPassword}>
                <div>
                  <label htmlFor="forgotIdentifier" className="block text-sm font-medium text-slate-700 mb-1.5">
                    User ID or Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      id="forgotIdentifier"
                      name="forgotIdentifier"
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="Enter your user ID or email"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-3.5 text-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Token
                        <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to login
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                <span className="block sm:inline">Need help? Contact your system administrator</span>
                <span className="hidden sm:inline mx-2">•</span>
                <span className="block sm:inline">© {new Date().getFullYear()} SmartCare HMS</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;