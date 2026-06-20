import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  Plus,
  Award,
  AlertCircle,
  Clock,
  CheckCircle,
  FileText,
  Calendar
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { addCertification, addTraining } from '../features/staffSlice';

const LicenseTracking = () => {
  const { staff, certifications, trainingRecords } = useSelector(state => state.staff);
  const [activeTab, setActiveTab] = useState('licenses');
  const [showAddCertForm, setShowAddCertForm] = useState(false);
  const [showAddTrainingForm, setShowAddTrainingForm] = useState(false);

  const [certFormData, setCertFormData] = useState({
    staffId: '',
    certificationName: '',
    issuingBody: '',
    dateObtained: '',
    expiryDate: '',
    certificateNumber: ''
  });

  const [trainingFormData, setTrainingFormData] = useState({
    staffId: '',
    trainingTitle: '',
    trainingDate: '',
    duration: '',
    trainer: '',
    certificateNumber: ''
  });

  // Get licenses that are expiring within 90 days
  const expiringLicenses = staff.filter(s => {
    const expiryDate = new Date(s.licenseExpiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
  });

  // Get expired licenses
  const expiredLicenses = staff.filter(s => {
    const expiryDate = new Date(s.licenseExpiryDate);
    return expiryDate < new Date();
  });

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const daysUntilExpiry = Math.floor((new Date(expiryDate) - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'Expired', color: 'bg-red-100 text-red-800' };
    if (daysUntilExpiry <= 30) return { status: 'Urgent', color: 'bg-orange-100 text-orange-800' };
    if (daysUntilExpiry <= 90) return { status: 'Due Soon', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Valid', color: 'bg-green-100 text-green-800' };
  };

  const handleAddCertification = () => {
    if (certFormData.staffId && certFormData.certificationName) {
      const newCert = {
        certId: `CERT${String(certifications.length + 1).padStart(3, '0')}`,
        ...certFormData,
        status: 'Active'
      };
      // In real app, dispatch to Redux
      setShowAddCertForm(false);
      setCertFormData({
        staffId: '',
        certificationName: '',
        issuingBody: '',
        dateObtained: '',
        expiryDate: '',
        certificateNumber: ''
      });
    }
  };

  const handleAddTraining = () => {
    if (trainingFormData.staffId && trainingFormData.trainingTitle) {
      const newTraining = {
        trainingId: `TRAIN${String(trainingRecords.length + 1).padStart(3, '0')}`,
        ...trainingFormData,
        status: 'Completed'
      };
      // In real app, dispatch to Redux
      setShowAddTrainingForm(false);
      setTrainingFormData({
        staffId: '',
        trainingTitle: '',
        trainingDate: '',
        duration: '',
        trainer: '',
        certificateNumber: ''
      });
    }
  };

  return (
    <div className="license-tracking px-3 sm:px-4 lg:px-6 py-4 sm:py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3 flex-wrap">
            <Award className="w-6 sm:w-8 h-6 sm:h-8 text-nigerian-green flex-shrink-0" />
            <span>License & Certification Tracking</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Monitor professional registrations and training compliance</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowAddCertForm(true)}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-nigerian-green text-white rounded-lg hover:bg-green-700 font-medium inline-flex items-center gap-2 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            <span className="hidden sm:inline">Add Certification</span>
            <span className="sm:hidden">Cert</span>
          </button>
          <button
            onClick={() => setShowAddTrainingForm(true)}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium inline-flex items-center gap-2 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            <Plus className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
            <span className="hidden sm:inline">Add Training</span>
            <span className="sm:hidden">Train</span>
          </button>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-red-600 font-semibold text-lg">{expiredLicenses.length}</p>
              <p className="text-red-700 text-sm">Expired Licenses</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-orange-600 font-semibold text-lg">{expiringLicenses.length}</p>
              <p className="text-orange-700 text-sm">Expiring Soon (90 Days)</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-green-600 font-semibold text-lg">{staff.filter(s => {
                const expiryDate = new Date(s.licenseExpiryDate);
                return expiryDate > new Date() && Math.floor((expiryDate - new Date()) / (1000 * 60 * 60 * 24)) > 90;
              }).length}</p>
              <p className="text-green-700 text-sm">Valid Licenses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-6 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('licenses')}
          className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === 'licenses'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="sm:hidden">Licenses</span>
          <span className="hidden sm:inline">Professional Licenses</span>
        </button>
        <button
          onClick={() => setActiveTab('certifications')}
          className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === 'certifications'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="sm:hidden">Certs ({certifications.length})</span>
          <span className="hidden sm:inline">Certifications ({certifications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`px-2 sm:px-4 py-2 sm:py-3 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === 'training'
              ? 'text-nigerian-green border-b-2 border-nigerian-green'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <span className="sm:hidden">Training ({trainingRecords.length})</span>
          <span className="hidden sm:inline">Training Records ({trainingRecords.length})</span>
        </button>
      </div>

      {/* Licenses Tab */}
      {activeTab === 'licenses' && (
        <div className="space-y-4">
          {staff.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No staff members found</p>
            </div>
          ) : (
            staff.map(staffMember => {
              const expiryStatus = getExpiryStatus(staffMember.licenseExpiryDate);
              return (
                <div key={staffMember.staffId} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Name</p>
                      <p className="font-bold text-sm sm:text-base truncate">{staffMember.name}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Reg. Number</p>
                      <p className="font-bold text-xs sm:text-sm truncate">{staffMember.registrationNumber}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Expiry Date</p>
                      <p className="font-bold text-xs sm:text-sm">{new Date(staffMember.licenseExpiryDate).toLocaleDateString('en-NG')}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Status</p>
                      <p className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${expiryStatus.color}`}>
                        {expiryStatus.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                        Renew
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="space-y-4">
          {certifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No certifications found</p>
            </div>
          ) : (
            certifications.map(cert => (
              <div key={cert.certId} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Certification</p>
                    <p className="font-bold text-sm sm:text-base truncate">{cert.certificationName}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Staff Member</p>
                    <p className="font-bold text-xs sm:text-sm truncate">{staff.find(s => s.staffId === cert.staffId)?.name}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Issuing Body</p>
                    <p className="font-bold text-xs sm:text-sm truncate">{cert.issuingBody}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Expiry Date</p>
                    <p className="font-bold text-xs sm:text-sm">{new Date(cert.expiryDate).toLocaleDateString('en-NG')}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Cert #</p>
                    <p className="font-bold text-xs truncate">{cert.certificateNumber}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Training Tab */}
      {activeTab === 'training' && (
        <div className="space-y-4">
          {trainingRecords.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No training records found</p>
            </div>
          ) : (
            trainingRecords.map(training => (
              <div key={training.trainingId} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Training Title</p>
                    <p className="font-bold text-sm sm:text-base truncate">{training.trainingTitle}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Staff Member</p>
                    <p className="font-bold text-xs sm:text-sm truncate">{staff.find(s => s.staffId === training.staffId)?.name}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Date</p>
                    <p className="font-bold text-xs sm:text-sm">{new Date(training.trainingDate).toLocaleDateString('en-NG')}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Duration</p>
                    <p className="font-bold text-xs sm:text-sm truncate">{training.duration}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600">Trainer</p>
                    <p className="font-bold text-xs sm:text-sm truncate">{training.trainer}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Certification Modal */}
      <GenericModal
        isOpen={showAddCertForm}
        onClose={() => setShowAddCertForm(false)}
        title="Add Certification"
        size="lg"
      >
        <div className="space-y-4">
          <select
            value={certFormData.staffId}
            onChange={(e) => setCertFormData({ ...certFormData, staffId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          >
            <option value="">Select Staff Member</option>
            {staff.map(s => (
              <option key={s.staffId} value={s.staffId}>{s.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Certification Name"
            value={certFormData.certificationName}
            onChange={(e) => setCertFormData({ ...certFormData, certificationName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <input
            type="text"
            placeholder="Issuing Body"
            value={certFormData.issuingBody}
            onChange={(e) => setCertFormData({ ...certFormData, issuingBody: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={certFormData.dateObtained}
              onChange={(e) => setCertFormData({ ...certFormData, dateObtained: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
            <input
              type="date"
              value={certFormData.expiryDate}
              onChange={(e) => setCertFormData({ ...certFormData, expiryDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
          </div>
          <input
            type="text"
            placeholder="Certificate Number"
            value={certFormData.certificateNumber}
            onChange={(e) => setCertFormData({ ...certFormData, certificateNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleAddCertification}
              className="flex-1 bg-nigerian-green text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              Add Certification
            </button>
            <button
              onClick={() => setShowAddCertForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>

      {/* Add Training Modal */}
      <GenericModal
        isOpen={showAddTrainingForm}
        onClose={() => setShowAddTrainingForm(false)}
        title="Add Training Record"
        size="lg"
      >
        <div className="space-y-4">
          <select
            value={trainingFormData.staffId}
            onChange={(e) => setTrainingFormData({ ...trainingFormData, staffId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          >
            <option value="">Select Staff Member</option>
            {staff.map(s => (
              <option key={s.staffId} value={s.staffId}>{s.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Training Title"
            value={trainingFormData.trainingTitle}
            onChange={(e) => setTrainingFormData({ ...trainingFormData, trainingTitle: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={trainingFormData.trainingDate}
              onChange={(e) => setTrainingFormData({ ...trainingFormData, trainingDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
            <input
              type="text"
              placeholder="Duration (e.g., 8 hours)"
              value={trainingFormData.duration}
              onChange={(e) => setTrainingFormData({ ...trainingFormData, duration: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
            />
          </div>
          <input
            type="text"
            placeholder="Trainer Name"
            value={trainingFormData.trainer}
            onChange={(e) => setTrainingFormData({ ...trainingFormData, trainer: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <input
            type="text"
            placeholder="Certificate Number"
            value={trainingFormData.certificateNumber}
            onChange={(e) => setTrainingFormData({ ...trainingFormData, certificateNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nigerian-green"
          />
          <div className="flex gap-2 mt-6">
            <button
              onClick={handleAddTraining}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
            >
              Add Training
            </button>
            <button
              onClick={() => setShowAddTrainingForm(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default LicenseTracking;
