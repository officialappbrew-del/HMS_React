import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-950 flex items-center justify-center w-screen h-screen">
      <div className="max-w-lg w-full text-center px-6">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg mb-4">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-7xl font-extrabold text-slate-900 dark:text-white">404</h1>
          <p className="mt-2 text-xl text-slate-600 dark:text-slate-300">
            Page Not Found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/patients')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
            Find Patients
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;