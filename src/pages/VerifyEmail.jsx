import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { apiRequest } from '../utils/api';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState('loading'); // 'loading' | 'verified' | 'error'
  const [message, setMessage] = useState('Verifying your email…');
  const [token, setToken] = useState('');

  const params = new URLSearchParams(location.search);
  const tokenFromUrl = params.get('token') || '';

  useEffect(() => {
    const performVerify = async (tkn) => {
      if (!tkn) {
        setState('error');
        setMessage('No verification token was provided. Please check your email link.');
        return;
      }
      setState('loading');
      setMessage('Verifying your email…');
      try {
        const data = await apiRequest('/api/v1/tenants/verify-email/', {
          method: 'POST',
          body: JSON.stringify({ token: tkn }),
        });
        setState('verified');
        setMessage(data.message || 'Your account has been verified.');
      } catch (err) {
        const msg =
          err.status === 410
            ? 'This verification link has expired. Please sign up again.'
            : err.status === 400
            ? 'This verification link is invalid or has already been used.'
            : err.message || 'Could not verify your email. Please try again.';
        setState('error');
        setMessage(msg);
      }
    };
    const t = tokenFromUrl;
    setToken(t);
    performVerify(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenFromUrl]);

  const handleResend = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-900 via-sky-800 to-cyan-700 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex rounded-2xl bg-white/10 p-3 backdrop-blur">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-4xl font-semibold text-white">Verify your email</h1>
            <p className="mt-3 max-w-md text-blue-100">Activate your SmartCare HMS workspace and start your free trial.</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-xl">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-700">Verification</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Confirm your account</h2>
            </div>

            <div className="mt-8 rounded-2xl bg-white p-8 shadow ring-1 ring-slate-200">
              <div className="flex flex-col items-center gap-4 text-center">
                {state === 'loading' && (
                  <>
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                    <p className="text-slate-600">{message}</p>
                  </>
                )}
                {state === 'verified' && (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <p className="text-slate-600">{message}</p>
                    <Link
                      to="/login"
                      className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Sign in to your workspace
                    </Link>
                  </>
                )}
                {state === 'error' && (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <p className="text-slate-600">{message}</p>
                    <button
                      onClick={handleResend}
                      className="w-full rounded-xl border border-blue-600 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      Return to sign up
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-600">
              <Link to="/login" className="font-medium text-blue-600">Back to sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
