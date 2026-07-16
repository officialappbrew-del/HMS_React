import { useMemo, useState, useEffect } from 'react';
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
import { tenantSettingsApi } from '../utils/api';
import { decryptInvitationData } from '../utils/invitationCrypto';

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

  useEffect(() => {
    const loadInviteData = async () => {
      if (!encryptedData) {
        setDecryptError('Invalid invitation link.');
        setDecrypting(false);
        return;
      }

      const data = await decryptInvitationData(encryptedData);
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

    loadInviteData();
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
      setTimeout(() => navigate('/login'), 1200);
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
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <ShieldCheck className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
          <p className="text-lg font-semibold text-slate-700">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (decryptError) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-[2rem] border border-slate-200/70 bg-white/95 p-8 shadow-[0_20px_70px_-25px_rgba(15,23,42,0.45)] text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <ShieldCheck className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Invalid invitation</h2>
          <p className="text-sm text-slate-500 mb-6">{decryptError}</p>
          <Link to="/login" className="inline-block rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)]">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 px-10 py-12 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex rounded-2xl bg-white/10 p-3 backdrop-blur">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-4xl font-semibold text-white">You're invited to join</h1>
            <p className="mt-3 max-w-md text-base leading-7 text-blue-100">
              Complete your account setup for <span className="font-semibold text-white">{inviteData?.tenant_name}</span>. Your role has been pre-selected by the administrator.
            </p>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-cyan-200" />
              <div>
                <p className="text-sm font-semibold text-white">Your assigned role</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className={`rounded-xl bg-gradient-to-br ${roleAccent} p-2.5 text-white`}>
                    <RoleIcon className="h-5 w-5" />
                  </span>
                  <span className="text-lg font-semibold text-white">{roleLabel}</span>
                </div>
                <p className="mt-2 text-sm text-blue-100">
                  This role determines your access level and permissions within the platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-8 lg:px-10">
          <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200/70 bg-white/95 p-7 shadow-[0_20px_70px_-25px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-700">Invitation registration</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Create your account</h2>
              <p className="mt-2 text-sm text-slate-500">Finish setup with the details below and your account will be reviewed by the {inviteData?.tenant_name} admin.</p>
            </div>

            {message && (
              <div className={`mt-6 rounded-2xl border p-4 text-sm ${messageType === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {message}
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="mb-2 block text-sm font-semibold text-slate-700">First name</label>
                  <input id="first_name" name="first_name" type="text" required value={formData.first_name} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                </div>
                <div>
                  <label htmlFor="last_name" className="mb-2 block text-sm font-semibold text-slate-700">Last name</label>
                  <input id="last_name" name="last_name" type="text" required value={formData.last_name} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Work email</label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-700">Phone number</label>
                  <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                </div>
              </div>

              {isDoctorRole && (
                <div className="grid grid-cols-1 gap-4 rounded-3xl border border-blue-100 bg-blue-50/70 p-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="license_number" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <BadgeCheck className="h-4 w-4 text-blue-600" />
                      License number
                    </label>
                    <input id="license_number" name="license_number" type="text" value={formData.license_number} onChange={handleChange} className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="specialization" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      Specialization
                    </label>
                    <input id="specialization" name="specialization" type="text" value={formData.specialization} onChange={handleChange} className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                  <div className="relative">
                    <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm_password" className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label>
                  <div className="relative">
                    <input id="confirm_password" name="confirm_password" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirm_password} onChange={handleChange} className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationSignup;
