import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Compass, AlertCircle, ArrowRight } from 'lucide-react';
import PublicPageShell from '../components/PublicPageShell';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PublicPageShell
      title="Page Not Found"
      subtitle="The page you were looking for seems to have moved or no longer exists. Let’s get you back on track."
      badge="SmartCare HMS"
      actionLabel="Back home"
      actionTo="/"
      actionIcon={Home}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center justify-center rounded-full bg-[#0B6E4F]/10 p-5 text-[#0B6E4F]">
          <Compass className="h-12 w-12" strokeWidth={1.5} />
        </div>
        <div className="text-7xl font-semibold tracking-tight text-slate-900 sm:text-8xl">404</div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B6E4F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#084A36]"
          >
            <Home className="h-4 w-4" />
            Go to dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0B6E4F] hover:text-[#0B6E4F]"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Check the address for typos
          </span>
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            The page may have been moved
          </span>
        </div>
      </div>
    </PublicPageShell>
  );
};

export default NotFound;