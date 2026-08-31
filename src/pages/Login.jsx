import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import  { apiRequest} from "../utils/api";

// ============================================================
// OPTIMIZED ICON COMPONENT - Dynamically imports only needed icons
// ============================================================
const Icon = ({ name, className = '', ...props }) => {
  const [IconComp, setIconComp] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const mod = await import('lucide-react');
        const Comp = mod[name];
        if (Comp && mounted.current) {
          setIconComp(() => Comp);
        }
      } catch (e) {
        // Silent fail - placeholder will show
      }
    };
    loadIcon();

    return () => {
      mounted.current = false;
    };
  }, [name]);

  if (!IconComp) {
    return <span className={`inline-block w-5 h-5 bg-[#E2DFD6] rounded-sm ${className}`} />;
  }

  return <IconComp className={className} {...props} />;
};

// ============================================================
// MEMOIZED ECG LINE - Prevents unnecessary re-renders
// ============================================================
const EcgLine = React.memo(({ className = '' }) => (
  <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
    <svg
      className="absolute left-0 top-0 h-full w-[200%] motion-safe:animate-ecg-scroll"
      viewBox="0 0 800 60"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M0,30 L58,30 L74,30 L84,10 L94,50 L104,30 L120,30 L200,30
           L258,30 L274,30 L284,10 L294,50 L304,30 L320,30 L400,30
           L458,30 L474,30 L484,10 L494,50 L504,30 L520,30 L600,30
           L658,30 L674,30 L684,10 L694,50 L704,30 L720,30 L800,30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
));

EcgLine.displayName = 'EcgLine';

// ============================================================
// JWT PARSER - Memoized utility
// ============================================================
const parseJwt = (token) => {
  try {
    if (!token || typeof token !== 'string') return null;
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

// ============================================================
// MAIN LOGIN COMPONENT
// ============================================================
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  
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
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return localStorage.getItem('rememberMe') === 'true';
    } catch {
      return false;
    }
  });
  const [tokenSent, setTokenSent] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [now, setNow] = useState(() => new Date());

  // Set mounted state after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      setResetToken(token);
      setShowForgotPassword(true);
      setTokenSent(true);
      setTokenVerified(false);
      setMessage('Your reset token is ready. Click Verify token to continue.');
      setMessageType('success');
    }
  }, [location.search]);

  // Live clock — reinforces the "monitoring system" feel with a real value.
  const clockIntervalRef = useRef(null);
  useEffect(() => {
    clockIntervalRef.current = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current);
      }
    };
  }, []);

  // Session restore via refresh endpoint - optimized with abort controller
  useEffect(() => {
    let abortController = new AbortController();
    
    const restoreSession = async () => {
      try {
        const refreshToken =
          localStorage.getItem('refreshToken') ||
          localStorage.getItem('patientRefreshToken') ||
          '';
        
        if (!refreshToken) {
          return;
        }

        const response = await apiRequest('/api/v1/auth/token/refresh/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
          signal: abortController.signal,
        });

        const accessToken = response.access || response.access_token;
        if (!accessToken) {
          throw new Error('No access token returned');
        }

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('authToken', accessToken);
        sessionStorage.setItem('isAuthenticated', 'true');
        
        const decoded = parseJwt(accessToken);
        if (decoded) {
          if (decoded.tenant_public_id) localStorage.setItem('tenantId', decoded.tenant_public_id);
          if (decoded.tenant_id) localStorage.setItem('tenantId', decoded.tenant_id);
          if (decoded.tenant_domain) localStorage.setItem('tenantDomain', decoded.tenant_domain);
          if (decoded.full_name) localStorage.setItem('userFullName', decoded.full_name);
          if (decoded.first_name) localStorage.setItem('userFirstName', decoded.first_name);
          if (decoded.last_name) localStorage.setItem('userLastName', decoded.last_name);
          if (decoded.username) localStorage.setItem('userName', decoded.username);
          if (decoded.email) localStorage.setItem('userEmail', decoded.email);
          if (decoded.role) localStorage.setItem('userRole', decoded.role);
        }

        window.dispatchEvent(new Event('authChanged'));
        navigate('/dashboard');
      } catch {
        sessionStorage.removeItem('isAuthenticated');
        setRememberMe(false);
        localStorage.removeItem('rememberMe');
      }
    };

    const remembered = localStorage.getItem('rememberMe') === 'true';
    if (remembered && mounted) {
      restoreSession();
    }

    return () => {
      abortController.abort();
    };
  }, [navigate, mounted, parseJwt]);

  // ============================================================
  // MEMOIZED HANDLERS
  // ============================================================
  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleFocus = useCallback((field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  }, []);

  const handleBlur = useCallback((field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
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
      const isPatient = Boolean(response?.is_patient || authData.is_patient);
      const patient = response?.patient || authData.patient || {};
      const user = response?.user || authData.user || {};
      const tenant = response?.tenant || authData.tenant || {};
      const tenantPublicId = tenant.public_id || tenant.publicId || tenant.id || response?.tenant_public_id || response?.tenantId || authData.tenant_public_id || authData.tenantId;

      if (!token) {
        throw new Error('Authentication token was not returned by the server.');
      }

      localStorage.setItem('accessToken', token);
      localStorage.setItem('authToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      if (response?.requires_2fa || authData.requires_2fa) {
        throw new Error('Two-factor verification is required before you can continue.');
      }

      if (isPatient) {
        localStorage.setItem('patientAccessToken', token);
        if (refreshToken) {
          localStorage.setItem('patientRefreshToken', refreshToken);
        }
        localStorage.setItem('isPatientAuthenticated', 'true');
        localStorage.setItem('userRole', 'patient');
        localStorage.setItem('userName', patient.full_name || patient.login_id || loginIdentifier);
        localStorage.setItem('userFullName', patient.full_name || patient.login_id || loginIdentifier);
        localStorage.setItem('userId', patient.id || loginIdentifier);
        if (patient.mrn) localStorage.setItem('patientMrn', patient.mrn);
        if (patient.hospital_number) localStorage.setItem('patientHospitalNumber', patient.hospital_number);
        if (patient.tenant) localStorage.setItem('tenantName', patient.tenant);
        localStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
        sessionStorage.setItem('isAuthenticated', 'true');

        window.dispatchEvent(new Event('authChanged'));
        setMessage('Login successful!');
        setMessageType('success');
        setTimeout(() => navigate('/patient-portal'), 400);
        return;
      }

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
      sessionStorage.setItem('isAuthenticated', 'true');

      window.dispatchEvent(new Event('authChanged'));
      setMessage('Login successful!');
      setMessageType('success');
      const landingPath = ['lab_tech', 'lab_manager'].includes((user.role || '').toLowerCase())
        ? '/laboratory'
        : '/dashboard';
      setTimeout(() => navigate(landingPath), 400);
    } catch (error) {
      setMessage(error.message || 'Login failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, [formData, rememberMe, navigate]);

  const handleForgotPassword = useCallback(async (e) => {
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
  }, [forgotIdentifier]);

  const handleResetPassword = useCallback(async (e) => {
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
  }, [resetToken, newPassword, confirmPassword]);

  const handleVerifyToken = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await apiRequest('/api/v1/auth/password-reset/verify/', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken.trim() }),
      });
      setMessage(response?.detail || 'Reset token verified. You can now choose a new password.');
      setMessageType('success');
      setTokenVerified(true);
    } catch (error) {
      setMessage(error.message || 'Invalid or expired reset token.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, [resetToken]);

  const handleBackToLogin = useCallback(() => {
    setShowForgotPassword(false);
    setTokenSent(false);
    setTokenVerified(false);
    setForgotIdentifier('');
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage('');
    setMessageType('');
  }, []);

  const handleShowForgotPassword = useCallback(() => {
    setShowForgotPassword(true);
    setMessage('');
    setMessageType('');
  }, []);

  const handleRememberMeChange = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  // ============================================================
  // MEMOIZED DATA
  // ============================================================
  const stats = useMemo(() => [
    { label: 'Hospitals', value: '500+', icon: 'Building2' },
    { label: 'Patients', value: '2M+', icon: 'Users' },
    { label: 'Daily encounters', value: '12K+', icon: 'Activity' },
    { label: 'Uptime', value: '99.99%', icon: 'Clock' }
  ], []);

  const clockLabel = useMemo(() => {
    return now.toLocaleTimeString('en-GB', { hour12: false });
  }, [now]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen w-full bg-[#F6F2E7] font-['Inter',system-ui,sans-serif] antialiased lg:flex">
      <style>{`
        @keyframes ecg-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-ecg-scroll {
          animation: ecg-scroll 6s linear infinite;
          will-change: transform;
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(2.2); opacity: 0; }
        }
        .animate-pulse-dot {
          animation: pulse-dot 1.8s ease-out infinite;
          will-change: transform, opacity;
        }

        @keyframes card-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card-in {
          animation: card-in 0.45s ease-out both;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-ecg-scroll,
          .animate-pulse-dot,
          .animate-card-in {
            animation: none !important;
          }
        }
      `}</style>

      {/* Brand / instrument panel — reflows on top for mobile, side column on desktop */}
      <aside className="relative flex w-full flex-col justify-between overflow-hidden bg-[#0D1917] px-6 py-8 text-[#EFEBDD] sm:px-10 sm:py-10 lg:min-h-screen lg:w-[44%] lg:px-12 lg:py-12">
        {/* faint grid texture, restrained */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #EFEBDD 1px, transparent 1px), linear-gradient(to bottom, #EFEBDD 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="inline-flex rounded-lg border border-[#C79A3D]/40 bg-[#C79A3D]/10 p-2.5">
              <Icon name="ShieldCheck" className="h-5 w-5 text-[#C79A3D]" />
            </span>
            <span className="font-['Lora'] text-lg font-semibold tracking-tight text-[#F6F2E7]">
              SmartCare<span className="text-[#C79A3D]">HMS</span>
            </span>
          </Link>

          <EcgLine className="mt-6 h-10 text-[#C79A3D]/70 sm:mt-8 sm:h-12" />

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#C79A3D] sm:mt-8">
            Clinical operating system
          </p>
          <h1 className="mt-3 max-w-sm font-['Lora'] text-[28px] font-semibold leading-[1.15] text-[#F6F2E7] sm:text-[34px] lg:text-[36px]">
            Precision care, coordinated.
          </h1>
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-[#A9C0B6] sm:text-sm">
            One workspace for records, billing, diagnostics and staffing —
            built for hospitals and clinics across Nigeria.
          </p>

          {/* Stat readout — hidden on the smallest screens to keep the login
              form above the fold; reflows to a full grid from sm: up. */}
          <dl className="mt-10 hidden grid-cols-2 gap-x-6 gap-y-6 sm:grid lg:mt-12">
            {stats.map((stat) => (
              <div key={stat.label} className="border-l border-[#EFEBDD]/15 pl-3">
                <Icon name={stat.icon} className="h-4 w-4 text-[#A9C0B6]" />
                <dd className="mt-2 font-mono text-xl font-medium text-[#F6F2E7]">{stat.value}</dd>
                <dt className="mt-0.5 font-mono text-[10.5px] uppercase tracking-wider text-[#A9C0B6]">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-[#EFEBDD]/10 pt-5 lg:mt-0">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10.5px] uppercase tracking-wider text-[#A9C0B6]">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Award" className="h-3.5 w-3.5" /> HIPAA-aligned
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Globe" className="h-3.5 w-3.5" /> NDPR certified
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Icon name="ShieldCheck" className="h-3.5 w-3.5" /> ISO 27001
            </span>
          </div>
          <div className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wider text-[#A9C0B6]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="motion-safe:animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#C79A3D]" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C79A3D]" />
            </span>
            {clockLabel}
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-[368px] motion-safe:animate-card-in">
          <div className="rounded-2xl border border-[#1C2B27]/8 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-14px_rgba(13,25,23,0.18)] sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C79A3D]">
              {showForgotPassword ? 'Password recovery' : 'Secure sign-in'}
            </p>
            <h2 className="mt-1.5 font-['Lora'] text-xl font-semibold leading-snug text-[#1C2B27] sm:text-[22px]">
              {showForgotPassword
                ? tokenVerified ? 'Set a new password' : tokenSent ? 'Verify your reset token' : 'Forgot your password?'
                : 'Welcome back'}
            </h2>
            <p className="mt-1.5 text-[13px] leading-snug text-[#5C6D67]">
              {showForgotPassword
                ? tokenVerified
                  ? 'Your token is verified. Choose and confirm your new password.'
                  : tokenSent
                    ? 'Enter the reset token sent to your email to continue.'
                  : 'Enter your email or user ID and we\u2019ll send you a reset token.'
                : 'Sign in to access your healthcare workspace.'}
            </p>

            {/* Message Display */}
            {message && (
              <div
                className={`mt-4 flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-[13px] ${
                  messageType === 'success'
                    ? 'border-[#3E6E58]/30 bg-[#3E6E58]/10 text-[#2C5245]'
                    : 'border-[#A6372E]/30 bg-[#A6372E]/10 text-[#8A2E26]'
                }`}
              >
                {messageType === 'success' ? (
                  <Icon name="CheckCircle" className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />
                ) : (
                  <Icon name="AlertCircle" className="mt-0.5 h-4.5 w-4.5 flex-shrink-0" />
                )}
                <span>{message}</span>
              </div>
            )}

            {/* Login Form */}
            {!showForgotPassword ? (
              <form className="mt-5 space-y-3.5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                    User ID, email, or username
                  </label>
                  <div className="relative">
                    <Icon
                      name="User"
                      className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                        isFocused.email ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
                      }`}
                    />
                    <input
                      id="email"
                      name="email"
                      type="text"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      placeholder="Enter your user ID or email"
                      className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                    Password
                  </label>
                  <div className="relative">
                    <Icon
                      name="Lock"
                      className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                        isFocused.password ? 'text-[#C79A3D]' : 'text-[#9AA6A0]'
                      }`}
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={() => handleBlur('password')}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6A0] transition-colors hover:text-[#1C2B27]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <Icon name={showPassword ? 'EyeOff' : 'Eye'} className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-y-1.5 pt-0.5">
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      className="h-3.5 w-3.5 rounded border-[#1C2B27]/25 text-[#C79A3D] focus:ring-[#C79A3D]/40"
                    />
                    <span className="text-[13px] text-[#5C6D67]">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleShowForgotPassword}
                    className="text-[13px] font-medium text-[#3E6E58] transition-colors hover:text-[#2C5245] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#16302A] px-4 py-2.5 text-[13.5px] font-semibold text-[#F6F2E7] transition-colors hover:bg-[#1C3B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-[#F6F2E7]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in
                    </>
                  ) : (
                    <>
                      Sign in
                      <Icon name="ArrowRight" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] leading-snug text-[#9AA6A0]">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            ) : tokenVerified ? (
              // Reset Password Form
              <form className="mt-5 space-y-3.5" onSubmit={handleResetPassword}>
                <div>
                  <label htmlFor="resetToken" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                    Reset token
                  </label>
                  <div className="relative">
                    <Icon name="Key" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
                    <input
                      id="resetToken"
                      name="resetToken"
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="Enter the reset token"
                      className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-[#9AA6A0]">Check your email for the reset token.</p>
                </div>

                <div>
                  <label htmlFor="newPassword" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                    New password
                  </label>
                  <div className="relative">
                    <Icon name="Lock" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6A0] transition-colors hover:text-[#1C2B27]"
                      aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      <Icon name={showNewPassword ? 'EyeOff' : 'Eye'} className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                    Confirm new password
                  </label>
                  <div className="relative">
                    <Icon name="Lock" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-10 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6A0] transition-colors hover:text-[#1C2B27]"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#16302A] px-4 py-2.5 text-[13.5px] font-semibold text-[#F6F2E7] transition-colors hover:bg-[#1C3B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-[#F6F2E7]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Resetting
                    </>
                  ) : (
                    <>
                      Reset password
                      <Icon name="Send" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-[#3E6E58] transition-colors hover:text-[#2C5245]"
                >
                  <Icon name="ChevronLeft" className="h-3.5 w-3.5" />
                  Back to login
                </button>
              </form>
            ) : tokenSent ? (
              <form className="mt-5 space-y-3.5" onSubmit={handleVerifyToken}>
                <div>
                  <label htmlFor="resetToken" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                    Reset token
                  </label>
                  <div className="relative">
                    <Icon name="Key" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
                    <input
                      id="resetToken"
                      name="resetToken"
                      type="text"
                      required
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      placeholder="Enter the reset token"
                      className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-[#9AA6A0]">Check your email for the reset token.</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#16302A] px-4 py-2.5 text-[13.5px] font-semibold text-[#F6F2E7] transition-colors hover:bg-[#1C3B33] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Verifying' : 'Verify token'}
                  {!loading && <Icon name="CheckCircle" className="h-3.5 w-3.5" />}
                </button>
                <button type="button" onClick={handleBackToLogin} className="flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-[#3E6E58]">
                  <Icon name="ChevronLeft" className="h-3.5 w-3.5" />
                  Back to login
                </button>
              </form>
            ) : (
              // Forgot Password Form
              <form className="mt-5 space-y-3.5" onSubmit={handleForgotPassword}>
                <div>
                  <label htmlFor="forgotIdentifier" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                    User ID or email
                  </label>
                  <div className="relative">
                    <Icon name="Mail" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9AA6A0]" />
                    <input
                      id="forgotIdentifier"
                      name="forgotIdentifier"
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="Enter your user ID or email"
                      className="w-full rounded-lg border border-[#1C2B27]/12 bg-white py-2.5 pl-10 pr-3.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors placeholder:text-[#9AA6A0] focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#16302A] px-4 py-2.5 text-[13.5px] font-semibold text-[#F6F2E7] transition-colors hover:bg-[#1C3B33] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C79A3D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-[#F6F2E7]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending
                    </>
                  ) : (
                    <>
                      Send reset token
                      <Icon name="Send" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-[#3E6E58] transition-colors hover:text-[#2C5245]"
                >
                  <Icon name="ChevronLeft" className="h-3.5 w-3.5" />
                  Back to login
                </button>
              </form>
            )}
          </div>

          <p className="mt-5 text-center text-[11px] leading-snug text-[#9AA6A0]">
            Need help? Contact your system administrator
            <span className="mx-2 hidden sm:inline">&middot;</span>
            <span className="block sm:inline">&copy; {new Date().getFullYear()} SmartCare HMS</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;