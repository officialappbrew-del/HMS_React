import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Compass, 
  MapPin, 
  AlertCircle,
  ArrowRight 
} from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-fadeIn">
        {/* Main Card */}
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200/50 dark:border-slate-800/50 p-8 md:p-12 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />
          
          {/* Subtle Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='%23000000' stroke-opacity='0.03' /%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`
            }}
          />

          <div className="relative z-10">
            {/* Icon Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-xl opacity-30" />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25 flex items-center justify-center">
                  <Compass className="w-14 h-14 text-white" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="text-center mb-10">
              <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent leading-none mb-2 animate-slideUp">
                404
              </h1>
              
              <div className="space-y-2 animate-slideUp animation-delay-100">
                <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-200">
                  Page Not Found
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                  The page you're looking for seems to have wandered off. Let's get you back on track.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-slideUp animation-delay-200">
              <button
                onClick={() => navigate('/')}
                className="group relative w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-2xl shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate(-1)}
                  className="flex-1 sm:flex-none px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200/50 dark:border-slate-700/50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={() => navigate('/patients')}
                  className="flex-1 sm:flex-none px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200/50 dark:border-slate-700/50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Patients</span>
                </button>
              </div>
            </div>

            {/* Helpful Tips */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 dark:text-slate-500 animate-slideUp animation-delay-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Check URL for typos</span>
              </div>
              <div className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Page may have been moved</span>
              </div>
              <div className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Try searching for content</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500 animate-fadeIn animation-delay-400">
          © {new Date().getFullYear()} Your App. All rights reserved.
        </p>
      </div>

      {/* Add these CSS animations to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-slideUp {
          opacity: 0;
          animation: slideUp 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
};

export default NotFound;