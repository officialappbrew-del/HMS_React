import { useEffect } from 'react';
import { Trash2, Edit, Archive, Pill, Package, AlertTriangle, LogOut, X } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'delete',
  patientData = null,
  showSoftDeleteOption = false,
  onSoftDelete = null,
  isLoading = false,
  loadingText = null,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isLogout = type === 'logout';

  const getButtonColor = () => {
    switch (type) {
      case 'delete':
        return 'bg-red-600 hover:bg-red-700';
      case 'edit':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'archive':
        return 'bg-orange-600 hover:bg-orange-700';
      case 'logout':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };


  // In ConfirmModal.jsx, add to getWarnings function:
const getWarnings = () => {
  const warnings = {
    delete: [
      'Record will be permanently deleted',
      'All associated data will be lost',
      'This may affect related records',
      'Cannot be undone - consider archiving instead',
    ],
    archive: [
      'Record will be marked as inactive',
      'Will be hidden from active lists',
      'Historical data will be preserved',
      'Can be restored if needed',
    ],
    edit: [
      'Changes will be applied immediately',
      'Ensure all information is accurate',
      'May affect related records',
      'Review changes before confirming',
    ],
    dispense: [
      'Verify patient information before dispensing',
      'Check for drug allergies and interactions',
      'Ensure proper dosage instructions are provided',
      'Controlled substances require additional documentation',
    ],
    restock: [
      'Verify batch number and expiry date',
      'Check storage conditions',
      'Update inventory count accurately',
      'Record supplier information',
    ],
  };
  return warnings[type] || [];
};

// Also add specific icons for pharmacy actions
const getIcon = () => {
  switch (type) {
    case 'delete':
      return <Trash2 className="w-12 h-12 text-red-600" />;
    case 'edit':
      return <Edit className="w-12 h-12 text-blue-600" />;
    case 'archive':
      return <Archive className="w-12 h-12 text-orange-600" />;
    case 'dispense':
      return <Pill className="w-12 h-12 text-purple-600" />;
    case 'restock':
      return <Package className="w-12 h-12 text-green-600" />;
    case 'logout':
      return <LogOut className="w-12 h-12 text-red-600" />;
    default:
      return <AlertTriangle className="w-12 h-12 text-yellow-600" />;
  }
};


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-[2px] transition-opacity" onClick={isLoading ? undefined : onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full overflow-hidden bg-white shadow-2xl shadow-slate-950/20 ${isLogout ? 'max-w-lg rounded-2xl' : 'max-w-md rounded-lg'}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <div className={isLogout ? 'p-7 sm:p-8' : 'p-6'}>
            <div className={`flex ${isLogout ? 'items-start' : 'items-center mb-4'}`}>
              <div className={isLogout ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700' : ''}>
                {isLogout ? <LogOut className="h-6 w-6" strokeWidth={1.8} /> : getIcon()}
              </div>
              <div className={isLogout ? 'ml-4 pr-8' : 'ml-4'}>
                <h3 id="confirm-modal-title" className={isLogout ? 'text-xl font-semibold tracking-tight text-slate-900' : 'text-xl font-semibold'}>{title}</h3>
                {isLogout && <p className="mt-1 text-sm text-slate-500">Your session will be securely ended.</p>}
              </div>
              {isLogout && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  aria-label="Close confirmation dialog"
                  className="absolute right-5 top-5 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {patientData && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Details:</span>
                <div className="text-sm text-gray-700 mt-2">
                  <p>
                    <span className="font-medium">Name:</span> {patientData.name}
                  </p>
                  {patientData.email && (
                    <p>
                      <span className="font-medium">Email:</span> {patientData.email}
                    </p>
                  )}
                  {patientData.nin && (
                    <p>
                      <span className="font-medium">NIN:</span> {patientData.nin}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Phone:</span> {patientData.phone}
                  </p>
                  {patientData.role && (
                    <p>
                      <span className="font-medium">Role:</span> {patientData.role}
                    </p>
                  )}
                  {patientData.bloodType && (
                    <p>
                      <span className="font-medium">Blood Type:</span> {patientData.bloodType}
                    </p>
                  )}
                </div>
              </div>
            )}

            <p className={isLogout ? 'mt-7 max-w-md text-[15px] leading-6 text-slate-600' : 'text-gray-700 mb-6'}>{message}</p>

            {/* Display warnings */}
            {getWarnings().length > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important Warnings:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {getWarnings().map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showSoftDeleteOption && onSoftDelete && type === 'delete' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="font-medium text-blue-700">Alternative: Soft Delete</span>
                <p className="text-sm text-blue-600 mb-3 mt-2">
                  Mark as inactive instead of permanent deletion.
                </p>
                <button
                  onClick={onSoftDelete}
                  className="w-full py-2 px-4 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 font-medium text-sm"
                >
                  Archive Instead (Soft Delete)
                </button>
              </div>
            )}
          </div>

          <div className={isLogout ? 'flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/80 p-5 sm:flex-row sm:justify-end sm:p-6' : 'rounded-b-lg bg-gray-50 p-6'}>
            <div className={isLogout ? 'contents' : 'flex flex-col gap-3 sm:flex-row'}>
              <button
                onClick={isLoading ? undefined : onConfirm}
                disabled={isLoading}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${isLogout ? 'rounded-lg bg-slate-800 hover:bg-slate-900 sm:order-2 sm:min-w-32' : `rounded-md ${getButtonColor()}`}`}
              >
                {isLoading && (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                    <path d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                )}
                {isLoading ? (loadingText || `${confirmText}...`) : confirmText}
              </button>
              <button
                onClick={isLoading ? undefined : onClose}
                disabled={isLoading}
                className={`px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${isLogout ? 'rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 sm:order-1 sm:min-w-24' : 'rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {cancelText}
              </button>
            </div>
            <p className={isLogout ? 'hidden' : 'mt-4 text-center text-xs text-gray-500'}>
              Press ESC to cancel or click outside the modal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;