import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Stethoscope, Activity, Users, Pill, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '../utils/api';
import { API_BASE_URL } from '../utils/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [selectedRole, setSelectedRole] = useState('doctor');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showAccountRecovery, setShowAccountRecovery] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('rememberMe') === 'true');

  const navigate = useNavigate();

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
      const token =
        authData.access_token ||
        response?.access_token ||
        response?.token ||
        authData.token ||
        response?.accessToken ||
        authData.accessToken;
      const refreshToken =
        authData.refresh_token ||
        response?.refresh_token ||
        authData.refreshToken ||
        response?.refreshToken;
      const user = response?.user || authData.user || {};
      const tenant = response?.tenant || authData.tenant || {};
      const tenantPublicId =
        tenant.public_id ||
        tenant.publicId ||
        tenant.id ||
        response?.tenant_public_id ||
        response?.tenantId ||
        authData.tenant_public_id ||
        authData.tenantId;

      if (!token) {
        throw new Error('Authentication token was not returned by the server.');
      }

      if (response?.requires_2fa || authData.requires_2fa) {
        throw new Error('Two-factor verification is required before you can continue.');
      }

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken || '');
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role || selectedRole);
      localStorage.setItem('userEmail', user.email || formData.email);
      localStorage.setItem('userName', user.username || user.user_id || formData.email);
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
      setMessage(response?.message || 'Login successful!');
      setTimeout(() => navigate('/dashboard'), 400);
    } catch (error) {
      setMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    setTimeout(() => {
      setLoading(false);
      setMessage('Password reset link sent to your email!');
    }, 2000);
  };

  const handleAccountRecovery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    setTimeout(() => {
      setLoading(false);
      setMessage('Account recovery link sent to your email!');
    }, 2000);
  };

  const roleCards = [
    { value: 'doctor', label: 'Doctor', icon: Stethoscope },
    { value: 'nurse', label: 'Nurse', icon: Activity },
    { value: 'pharmacist', label: 'Pharmacist', icon: Pill },
    { value: 'admin', label: 'Admin', icon: ShieldCheck },
    { value: 'receptionist', label: 'Receptionist', icon: Users },
  ];

return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-900 via-sky-800 to-cyan-700 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex rounded-2xl bg-white/10 p-3 backdrop-blur">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-4xl font-semibold text-white">SmartCare HMS</h1>
            <p className="mt-3 max-w-md text-blue-100">Unified care coordination for clinicians, nurses, pharmacists, and administrators.</p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur">
              <p className="text-sm text-blue-100">Today's overview</p>
              <p className="mt-2 text-3xl font-semibold">128</p>
              <p className="mt-1 text-sm text-blue-100">Patients under active care</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-700">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                {showForgotPassword ? (showAccountRecovery ? 'Account recovery' : 'Reset password') : 'Sign in to your workspace'}
              </h2>
            </div>

            {message && (
              <div className={`mt-6 rounded-2xl p-4 ${message.includes('successful') || message.includes('sent') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {message}
              </div>
            )}

            {!showForgotPassword ? (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">User ID, email, or username</label>
                  <input id="email" name="email" type="text" required value={formData.email} onChange={handleChange} placeholder="user ID or name@hospital.com" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input 
                      id="password" 
                      name="password" 
                      type={showPassword ? 'text' : 'password'} 
                      required 
                      value={formData.password} 
                      onChange={handleChange} 
                      placeholder="••••••••" 
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Role</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {roleCards.map((role) => {
                      const Icon = role.icon;
                      const selected = selectedRole === role.value;
                      return (
                        <button
                          type="button"
                          key={role.value}
                          onClick={() => setSelectedRole(role.value)}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${selected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >
                          <Icon className="h-4 w-4" />
                          {role.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Remember me</span>
                  </label>
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm font-medium text-blue-600">Forgot password?</button>
                </div>
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            ) : !showAccountRecovery ? (
              <form className="mt-8 space-y-5" onSubmit={handleForgotPassword}>
                <div>
                  <label htmlFor="forgotEmail" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input id="forgotEmail" name="forgotEmail" type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="name@hospital.com" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
                </div>
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={() => setShowAccountRecovery(true)} className="text-sm font-medium text-blue-600">Need account recovery?</button>
                  <button type="button" onClick={() => setShowForgotPassword(false)} className="text-sm font-medium text-blue-600">Back to login</button>
                </div>
              </form>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleAccountRecovery}>
                <div>
                  <label htmlFor="recoveryEmail" className="mb-1 block text-sm font-medium text-slate-700">Email for recovery</label>
                  <input id="recoveryEmail" name="recoveryEmail" type="email" required value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} placeholder="name@hospital.com" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
                </div>
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send recovery link'}
                </button>
                <button type="button" onClick={() => { setShowAccountRecovery(false); setShowForgotPassword(false); }} className="w-full text-sm font-medium text-blue-600">Back to login</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;