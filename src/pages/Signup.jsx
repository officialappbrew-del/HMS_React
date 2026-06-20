import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Building2, Users, Stethoscope, Pill, Activity } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    hospitalName: '',
    password: '',
    confirmPassword: ''
  });
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const roleCards = [
    { value: 'admin', label: 'Administrator', icon: ShieldCheck },
    { value: 'doctor', label: 'Doctor', icon: Stethoscope },
    { value: 'nurse', label: 'Nurse', icon: Activity },
    { value: 'pharmacist', label: 'Pharmacist', icon: Pill },
    { value: 'receptionist', label: 'Receptionist', icon: Users },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');

    setTimeout(() => {
      setLoading(false);
      setMessage('Account created successfully. Redirecting to sign in...');
      setTimeout(() => navigate('/login'), 800);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-900 via-sky-800 to-cyan-700 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex rounded-2xl bg-white/10 p-3 backdrop-blur">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-4xl font-semibold text-white">Create your SmartCare workspace</h1>
            <p className="mt-3 max-w-md text-blue-100">Set up your team, configure your workflows, and launch your hospital operations faster.</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-5 text-white backdrop-blur">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5" />
              <p className="text-sm text-blue-100">Trusted by modern healthcare teams</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-xl">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-700">Start free</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Create an account</h2>
            </div>

            {message && (
              <div className={`mt-6 rounded-2xl p-4 ${message.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {message}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
                <input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Work email</label>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
              </div>

              <div>
                <label htmlFor="hospitalName" className="mb-1 block text-sm font-medium text-slate-700">Hospital or facility name</label>
                <input id="hospitalName" name="hospitalName" type="text" required value={formData.hospitalName} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Primary role</label>
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

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-slate-700">Confirm password</label>
                <div className="relative">
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-blue-500" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
