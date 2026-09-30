import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  BadgeCheck,
  GraduationCap,
  HeartPulse,
} from 'lucide-react';
import { apiRequest, logout, tenantSettingsApi } from '../utils/api';
import { decryptInvitationData } from '../utils/invitationCrypto';
import { getSubdomain } from '../utils/subdomain';

const roleMeta = {
  doctor: { label: 'Doctor', icon: HeartPulse, accent: 'from-sky-500 to-blue-600' },
  nurse: { label: 'Nurse', icon: HeartPulse, accent: 'from-emerald-500 to-teal-600' },
  pharmacist: { label: 'Pharmacist', icon: HeartPulse, accent: 'from-violet-500 to-purple-600' },
  receptionist: { label: 'Receptionist', icon: HeartPulse, accent: 'from-amber-500 to-orange-600' },
  admin: { label: 'Administrator', icon: ShieldCheck, accent: 'from-slate-600 to-slate-700' },
  hr_manager: { label: 'HR Manager', icon: ShieldCheck, accent: 'from-pink-500 to-rose-600' },
  accountant: { label: 'Accountant', icon: ShieldCheck, accent: 'from-indigo-500 to-blue-600' },
};

const InvitationSignup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const encryptedData = searchParams.get('data') || '';

  const [inviteData, setInviteData] = useState(null);
  const [tenantBranding, setTenantBranding] = useState(null);
  const [decrypting, setDecrypting] = useState(true);
  const [decryptError, setDecryptError] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    license_number: '',
    specialization: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const selectedRole = inviteData?.role || '';
  const isDoctorRole = selectedRole === 'doctor';
  const RoleIcon = roleMeta[selectedRole]?.icon || ShieldCheck;
  const roleAccent = roleMeta[selectedRole]?.accent || 'from-slate-500 to-slate-600';
  const roleLabel = roleMeta[selectedRole]?.label || 'Staff';
  const tenantName = tenantBranding?.name || inviteData?.tenant_name || 'SmartCare HMS';

  useEffect(() => {
    let cancelled = false;
    const loadInviteData = async () => {
      if (!encryptedData) {
        setDecryptError('Invalid invitation link.');
        setDecrypting(false);
        return;
      }

      const data = await decryptInvitationData(encryptedData);
      if (cancelled) return;
      if (!data || !data.tenant_name || !data.role) {
        setDecryptError('Invalid or corrupted invitation link.');
        setDecrypting(false);
        return;
      }

      setInviteData(data);
      setFormData(prev => ({
        ...prev,
        email: data.email || prev.email,
      }));
      setDecrypting(false);
    };

    const tenantSubdomain = getSubdomain();
    if (tenantSubdomain && tenantSubdomain.toLowerCase() !== 'admin') {
      apiRequest(`/api/v1/tenants/public-config/?tenant_subdomain=${encodeURIComponent(tenantSubdomain)}`)
        .then((config) => {
          if (!cancelled && config?.tenant) setTenantBranding(config.tenant);
        })
        .catch(() => {});
    }

    loadInviteData();
    return () => { cancelled = true; };
  }, [encryptedData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('Missing invitation token.');
      setMessageType('error');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const payload = {
        token,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        role: selectedRole,
      };

      if (formData.phone) payload.phone = formData.phone;
      if (isDoctorRole) {
        if (formData.license_number) payload.license_number = formData.license_number;
        if (formData.specialization) payload.specialization = formData.specialization;
      }

      await tenantSettingsApi.acceptInvitation(payload);
      setMessage('Account created successfully. Your request is pending admin approval.');
      setMessageType('success');
      await logout();
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (error) {
      const backendMessage = error?.data?.token || error?.data?.detail || error?.message || 'Unable to complete registration';
      setMessage(backendMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (decrypting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5F0]">
        <div className="text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#16302A]">
            <ShieldCheck className="h-7 w-7 animate-pulse text-[#C79A3D]" />
          </div>
          <p className="font-['Lora'] text-lg font-semibold text-[#1C2B27]">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (decryptError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5F0] p-5">
        <div className="w-full max-w-md border border-[#1C2B27]/10 bg-white p-7 text-center shadow-[0_12px_32px_-18px_rgba(13,25,23,0.24)] sm:p-8">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-red-50">
            <ShieldCheck className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mb-2 font-['Lora'] text-2xl font-semibold text-[#1C2B27]">Invalid invitation</h2>
          <p className="mb-6 text-sm text-[#5C6D67]">{decryptError}</p>
          <Link to="/login" className="inline-block rounded-lg bg-[#16302A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1C3B33]">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-sans text-[#1C2B27]">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative flex min-h-[250px] flex-col justify-between overflow-hidden bg-[#16302A] px-6 py-7 text-[#F6F2E7] sm:px-10 sm:py-9 lg:min-h-screen lg:px-12 lg:py-12">
          <div>
            <div className="flex items-center gap-3">
              {tenantBranding?.logo_url ? (
                <img src={tenantBranding.logo_url} alt={`${tenantName} logo`} className="h-11 w-11 rounded-lg bg-white object-contain p-1.5" />
              ) : (
                <span className="inline-flex rounded-lg border border-[#C79A3D]/40 bg-[#C79A3D]/10 p-2.5">
                  <Building2 className="h-5 w-5 text-[#C79A3D]" />
                </span>
              )}
              <span className="min-w-0 whitespace-normal break-words font-['Lora'] text-lg font-semibold leading-tight text-[#F6F2E7]">{tenantName}</span>
            </div>
            <h1 className="mt-8 font-['Lora'] text-3xl font-semibold text-white sm:text-4xl">You're invited to join</h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#A9C0B6] sm:text-base sm:leading-7">
              Complete your account setup for <span className="font-semibold text-white">{tenantName}</span>. Your role has been pre-selected by the administrator.
            </p>
          </div>

          <div className="mt-8 border border-[#EFEBDD]/15 bg-white/[0.06] p-5 text-white sm:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-[#C79A3D]" />
              <div>
                <p className="text-sm font-semibold text-white">Your assigned role</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className={`rounded-lg bg-gradient-to-br ${roleAccent} p-2.5 text-white`}>
                    <RoleIcon className="h-5 w-5" />
                  </span>
                  <span className="text-lg font-semibold text-white">{roleLabel}</span>
                </div>
                <p className="mt-2 text-sm text-[#A9C0B6]">
                  This role determines your access level and permissions within the platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div className="w-full max-w-[520px] border border-[#1C2B27]/10 bg-white p-5 shadow-[0_12px_32px_-18px_rgba(13,25,23,0.24)] sm:p-7">
            <div className="text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C79A3D]">Invitation registration</p>
              <h2 className="mt-2 font-['Lora'] text-2xl font-semibold text-[#1C2B27] sm:text-3xl">Create your account</h2>
              <p className="mt-2 text-sm leading-6 text-[#5C6D67]">Finish setup for <span className="font-semibold text-[#1C2B27]">{tenantName}</span>. Your account will be reviewed by the hospital administrator.</p>
            </div>

            {message && (
              <div className={`mt-6 rounded-lg border p-4 text-sm ${messageType === 'success' ? 'border-[#3E6E58]/30 bg-[#3E6E58]/10 text-[#2C5245]' : 'border-[#A6372E]/30 bg-[#A6372E]/10 text-[#8A2E26]'}`}>
                {message}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">First name</label>
                  <input id="first_name" name="first_name" type="text" required value={formData.first_name} onChange={handleChange} className="w-full rounded-lg border border-[#1C2B27]/12 bg-white px-3.5 py-2.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25" />
                </div>
                <div>
                  <label htmlFor="last_name" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">Last name</label>
                  <input id="last_name" name="last_name" type="text" required value={formData.last_name} onChange={handleChange} className="w-full rounded-lg border border-[#1C2B27]/12 bg-white px-3.5 py-2.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">Work email</label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-[#1C2B27]/12 bg-white px-3.5 py-2.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25" />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">Phone number</label>
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border border-[#1C2B27]/12 bg-white px-3.5 py-2.5 text-[13.5px] text-[#1C2B27] outline-none transition-colors focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25" />
                </div>
              </div>

              {isDoctorRole && (
                <div className="grid grid-cols-1 gap-4 rounded-3xl border border-blue-100 bg-blue-50/70 p-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="license_number" className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                      <BadgeCheck className="h-4 w-4 text-[#C79A3D]" />
                      License number
                    </label>
                    <input id="license_number" name="license_number" type="text" value={formData.license_number} onChange={handleChange} className="w-full rounded-lg border border-[#1C2B27]/12 bg-white px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25" />
                  </div>
                  <div>
                    <label htmlFor="specialization" className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">
                      <GraduationCap className="h-4 w-4 text-[#C79A3D]" />
                      Specialization
                    </label>
                    <input id="specialization" name="specialization" type="text" value={formData.specialization} onChange={handleChange} className="w-full rounded-lg border border-[#1C2B27]/12 bg-white px-3.5 py-2.5 text-[13.5px] outline-none transition-colors focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="password" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">Password</label>
                  <div className="relative">
                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className="w-full rounded-lg border border-[#1C2B27]/12 bg-white px-3.5 py-2.5 pr-11 text-[13.5px] outline-none transition-colors focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6A0] hover:text-[#1C2B27]">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm_password" className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5C6D67]">Confirm password</label>
                  <div className="relative">
                    <input id="confirm_password" name="confirm_password" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirm_password} onChange={handleChange} className="w-full rounded-lg border border-[#1C2B27]/12 bg-white px-3.5 py-2.5 pr-11 text-[13.5px] outline-none transition-colors focus:border-[#C79A3D] focus:ring-2 focus:ring-[#C79A3D]/25" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA6A0] hover:text-[#1C2B27]">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#16302A] px-4 py-2.5 text-[13.5px] font-semibold text-[#F6F2E7] transition-colors hover:bg-[#1C3B33] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[#5C6D67]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#3E6E58] hover:text-[#2C5245]">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationSignup;
