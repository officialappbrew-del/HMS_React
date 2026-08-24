import { useEffect } from 'react';
import { Trash2, Edit, Archive, Pill, Package, AlertTriangle, LogOut } from 'lucide-react';

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
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center mb-4">
              {getIcon()}
              <h3 className="text-xl font-semibold ml-4">{title}</h3>
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

            <p className="text-gray-700 mb-6">{message}</p>

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

          <div className="p-6 bg-gray-50 rounded-b-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={isLoading ? undefined : onConfirm}
                disabled={isLoading}
                className={`flex items-center justify-center gap-2 px-4 py-2 text-white font-medium rounded-md ${getButtonColor()} disabled:opacity-70 disabled:cursor-not-allowed`}
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
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              Press ESC to cancel or click outside the modal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;