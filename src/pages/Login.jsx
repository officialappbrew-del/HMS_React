import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Stethoscope, Activity, Users, Pill } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [selectedRole, setSelectedRole] = useState('doctor');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

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

    setTimeout(() => {
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('userRole', selectedRole);
      localStorage.setItem('userEmail', formData.email);
      window.dispatchEvent(new Event('authChanged'));
      setLoading(false);
      setMessage('Login successful!');
      setTimeout(() => navigate('/'), 500);
    }, 800);
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
              <p className="text-sm text-blue-100">Today’s overview</p>
              <p className="mt-2 text-3xl font-semibold">128</p>
              <p className="mt-1 text-sm text-blue-100">Patients under active care</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-700">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">{showForgotPassword ? 'Reset password' : 'Sign in to your workspace'}</h2>
            </div>

            {message && (
              <div className={`mt-6 rounded-2xl p-4 ${message.includes('successful') || message.includes('sent') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                {message}
              </div>
            )}

            {!showForgotPassword ? (
              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="name@hospital.com" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0 focus:border-blue-500" />
                </div>
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                  <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
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
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm font-medium text-blue-600">Forgot password?</button>
                </div>
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleForgotPassword}>
                <div>
                  <label htmlFor="forgotEmail" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input id="forgotEmail" name="forgotEmail" type="email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="name@hospital.com" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" />
                </div>
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
                <button type="button" onClick={() => setShowForgotPassword(false)} className="w-full text-sm font-medium text-blue-600">Back to login</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;