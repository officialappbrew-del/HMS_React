import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 blur-lg"></div>
            <AlertTriangle className="w-24 h-24 text-red-600 relative" />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-7xl font-bold text-gray-900 mb-2">404</h1>
        
        {/* Error Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        
        {/* Error Description */}
        <p className="text-gray-600 text-lg mb-8">
          Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Navigation Info */}
        {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Navigation</h3>
          <div className="space-y-3">
            <a 
              href="/" 
              className="flex items-center text-nigerian-green hover:text-green-700 font-medium transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Dashboard
            </a>
            <a 
              href="/patients" 
              className="flex items-center text-nigerian-green hover:text-green-700 font-medium transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Patient Management
            </a>
            <a 
              href="/pharmacy" 
              className="flex items-center text-nigerian-green hover:text-green-700 font-medium transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Pharmacy
            </a>
            <a 
              href="/billing" 
              className="flex items-center text-nigerian-green hover:text-green-700 font-medium transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Billing
            </a>
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-6 py-3 bg-nigerian-green text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact support at support@smartcarehms.com</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
