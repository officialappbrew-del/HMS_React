import { AlertCircle, X, CheckCircle } from 'lucide-react';

export const ErrorModal = ({ isOpen, onClose, title, message, details }) => {
  if (!isOpen) return null;

  const isValidationError = details && typeof details === 'object';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
          <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <h2 className="text-xl font-bold">{title || 'Error'}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {message && (
              <div className="mb-4">
                <p className="text-gray-700 text-sm">{message}</p>
              </div>
            )}

            {isValidationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-xs text-red-600 font-medium mb-2 uppercase tracking-wide">
                  Server Validation Errors
                </p>
                <ul className="space-y-2">
                  {Object.entries(details).map(([field, errors]) => (
                    <li key={field} className="text-sm">
                      <span className="font-medium text-gray-800 capitalize">{field}:</span>
                      <ul className="ml-4 mt-1 space-y-1">
                        {Array.isArray(errors) ? (
                          errors.map((err, i) => (
                            <li key={i} className="text-red-700 text-xs">• {err}</li>
                          ))
                        ) : (
                          <li className="text-red-700 text-xs">• {errors}</li>
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!isValidationError && details && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 font-medium mb-1">Details:</p>
                <p className="text-sm text-gray-700 break-words">{details}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Got it
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
