import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  Bed,
  Filter,
  Plus,
  RefreshCw,
  AlertCircle,
  Check,
  Clock,
  Trash2,
  MapPin,
  Users,
  TrendingUp,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { selectWard, occupyBed, releaseBed, reserveBed, markBedAvailable } from '../features/wardSlice';

const BedAllocation = () => {
  const dispatch = useDispatch();
  const { wards, selectedWard, stats, bedStatus } = useSelector(state => state.ward);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedBed, setSelectedBed] = useState(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationData, setReservationData] = useState({
    bedId: '',
    patientId: ''
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedWardInfo, setExpandedWardInfo] = useState(false);

  const getBedStatusColor = (status) => {
    switch (status) {
      case bedStatus.OCCUPIED:
        return 'bg-red-50 border-red-300 text-red-700';
      case bedStatus.AVAILABLE:
        return 'bg-green-50 border-green-300 text-green-700';
      case bedStatus.RESERVED:
        return 'bg-yellow-50 border-yellow-300 text-yellow-700';
      case bedStatus.UNDER_CLEANING:
        return 'bg-blue-50 border-blue-300 text-blue-700';
      case bedStatus.MAINTENANCE:
        return 'bg-gray-50 border-gray-300 text-gray-700';
      default:
        return 'bg-gray-50 border-gray-300';
    }
  };

  const getBedStatusIcon = (status) => {
    switch (status) {
      case bedStatus.OCCUPIED:
        return <Users className="w-3 h-3 sm:w-4 sm:h-4" />;
      case bedStatus.AVAILABLE:
        return <Check className="w-3 h-3 sm:w-4 sm:h-4" />;
      case bedStatus.RESERVED:
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case bedStatus.UNDER_CLEANING:
        return <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />;
      case bedStatus.MAINTENANCE:
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return null;
    }
  };

  const filteredBeds = selectedWard
    ? filterStatus === 'All'
      ? selectedWard.beds
      : selectedWard.beds.filter(bed => bed.status === filterStatus)
    : [];

  const handleReserve = (bedId) => {
    setReservationData({ ...reservationData, bedId });
    setShowReservationForm(true);
  };

  const submitReservation = () => {
    if (reservationData.bedId && reservationData.patientId) {
      dispatch(reserveBed({
        bedId: reservationData.bedId,
        patientId: reservationData.patientId
      }));
      setShowReservationForm(false);
      setReservationData({ bedId: '', patientId: '' });
      alert('Bed reserved successfully!');
    }
  };

  const handleReleaseBed = (bedId) => {
    if (window.confirm('Are you sure you want to release this bed?')) {
      dispatch(releaseBed(bedId));
      alert('Bed released and marked for cleaning');
    }
  };

  const handleMarkAvailable = (bedId) => {
    dispatch(markBedAvailable(bedId));
    alert('Bed marked as available');
  };

  return (
    <div className="bed-allocation p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header - Mobile Optimized */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <Bed className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 mr-2 sm:mr-3 text-nigerian-green" />
            Bed Allocation
          </h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white shadow-sm"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-sm sm:text-base text-gray-600">Real-time bed availability and management</p>
      </div>

      {/* Stats Overview - Mobile Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-4 md:p-6 border-l-2 sm:border-l-4 border-nigerian-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Beds</p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">{stats.totalBeds}</p>
            </div>
            <Bed className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-nigerian-green opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-4 md:p-6 border-l-2 sm:border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Occupied</p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">{stats.occupiedBeds}</p>
              <p className="text-xs text-gray-600 mt-1">
                {Math.round((stats.occupiedBeds / stats.totalBeds) * 100)}% occupied
              </p>
            </div>
            <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-red-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-4 md:p-6 border-l-2 sm:border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Available</p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">{stats.availableBeds}</p>
            </div>
            <Check className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-green-500 opacity-70" />
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-3 sm:p-4 md:p-6 border-l-2 sm:border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">Reserved</p>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">{stats.reservedBeds}</p>
            </div>
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-yellow-500 opacity-70" />
          </div>
        </div>
      </div>

      {/* Ward Selection and Filters - Mobile Responsive */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 mb-6">
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Select Ward</label>
            <select
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green"
              onChange={(e) => {
                const ward = wards.find(w => w.wardId === e.target.value);
                if (ward) dispatch(selectWard(ward.wardId));
              }}
              value={selectedWard?.wardId || ''}
            >
              {wards.map(ward => (
                <option key={ward.wardId} value={ward.wardId}>
                  {ward.wardName} ({ward.totalBeds} beds)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Filter by Status</label>
            <select
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              <option value="Occupied">Occupied</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Under Cleaning">Under Cleaning</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-nigerian-green text-white px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-green-700 font-medium flex items-center justify-center">
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Ward Info - Collapsible on Mobile */}
        {selectedWard && (
          <div className="mt-4">
            <button
              onClick={() => setExpandedWardInfo(!expandedWardInfo)}
              className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg md:hidden"
            >
              <span className="font-medium text-blue-700">Ward Information</span>
              {expandedWardInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            <div className={`${expandedWardInfo ? 'block' : 'hidden md:block'} p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg mt-2 md:mt-4`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Ward Type</p>
                  <p className="text-sm sm:text-base font-semibold">{selectedWard.wardType}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Floor</p>
                  <p className="text-sm sm:text-base font-semibold">Floor {selectedWard.floor}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Supervisor</p>
                  <p className="text-sm sm:text-base font-semibold">{selectedWard.supervisor}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Staff Count</p>
                  <p className="text-sm sm:text-base font-semibold">{selectedWard.staffCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bed Grid - Mobile Responsive */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-nigerian-green" />
          Bed Layout - {selectedWard?.wardName || 'Select a Ward'}
        </h2>

        {!selectedWard ? (
          <div className="text-center py-12 text-gray-500">
            <Bed className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Please select a ward to view beds</p>
            <p className="text-sm mt-2">Choose a ward from the dropdown above</p>
          </div>
        ) : filteredBeds.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No beds found</p>
            <p className="text-sm mt-2">Try changing the filter or select a different ward</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
            {filteredBeds.map(bed => (
              <div
                key={bed.bedId}
                onClick={() => setSelectedBed(bed)}
                className={`p-2 sm:p-3 md:p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md active:scale-95 ${getBedStatusColor(
                  bed.status
                )}`}
              >
                <div className="flex items-center justify-center mb-1 sm:mb-2">
                  {getBedStatusIcon(bed.status)}
                </div>
                <p className="font-semibold text-xs sm:text-sm text-center truncate">B{bed.bedNumber}</p>
                <p className="text-[10px] sm:text-xs text-center mt-0.5 truncate">{bed.bedType}</p>
                {bed.status === bedStatus.OCCUPIED && (
                  <p className="text-[10px] sm:text-xs text-center mt-0.5 font-medium truncate">
                    {bed.patientId?.slice(0, 6)}...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Legend for mobile */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Status Legend:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(bedStatus).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-1 ${getBedStatusColor(value).split(' ')[0]}`}></div>
                <span className="text-xs text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Bed Details - Mobile Responsive */}
      {selectedBed && (
        <div className="fixed inset-0 sm:static sm:bg-white sm:rounded-xl sm:shadow-md sm:p-4 sm:p-6 mb-6 sm:border-l-4 border-nigerian-green bg-white z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white p-4 border-b border-gray-200 sm:relative sm:p-0 sm:border-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold flex items-center">
                <Bed className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Bed Details
              </h3>
              <button
                onClick={() => setSelectedBed(null)}
                className="text-gray-600 hover:text-gray-800 text-2xl sm:text-xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-0 sm:mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Bed Number</p>
                <p className="text-sm sm:text-base font-semibold">{selectedBed.bedNumber}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Status</p>
                <p className={`text-sm sm:text-base font-semibold ${getBedStatusColor(selectedBed.status)}`}>
                  {selectedBed.status}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Bed Type</p>
                <p className="text-sm sm:text-base font-semibold">{selectedBed.bedType}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Patient ID</p>
                <p className="text-sm sm:text-base font-semibold">{selectedBed.patientId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Cleaning Status</p>
                <p className="text-sm sm:text-base font-semibold">{selectedBed.cleaningStatus}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Private Bed</p>
                <p className="text-sm sm:text-base font-semibold">{selectedBed.isPrivate ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Last Cleaned</p>
                <p className="text-xs sm:text-sm font-semibold">
                  {new Date(selectedBed.lastCleaned).toLocaleTimeString('en-NG', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Last Turnover</p>
                <p className="text-xs sm:text-sm font-semibold">
                  {new Date(selectedBed.lastTurnover).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {selectedBed.status === bedStatus.AVAILABLE && (
                <button
                  onClick={() => handleReserve(selectedBed.bedId)}
                  className="px-3 sm:px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium flex items-center justify-center flex-1 min-w-[120px]"
                >
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Reserve Bed
                </button>
              )}

              {selectedBed.status === bedStatus.OCCUPIED && (
                <button
                  onClick={() => handleReleaseBed(selectedBed.bedId)}
                  className="px-3 sm:px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium flex items-center justify-center flex-1 min-w-[120px]"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Release Bed
                </button>
              )}

              {selectedBed.status === bedStatus.UNDER_CLEANING && (
                <button
                  onClick={() => handleMarkAvailable(selectedBed.bedId)}
                  className="px-3 sm:px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center justify-center flex-1 min-w-[120px]"
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Mark Available
                </button>
              )}

              {selectedBed.status === bedStatus.RESERVED && (
                <button
                  onClick={() => handleReleaseBed(selectedBed.bedId)}
                  className="px-3 sm:px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center flex-1 min-w-[120px]"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Cancel Reservation
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {showReservationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Reserve Bed</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bed ID</label>
                <input
                  type="text"
                  disabled
                  value={reservationData.bedId}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                <input
                  type="text"
                  placeholder="Enter patient ID"
                  value={reservationData.patientId}
                  onChange={(e) => setReservationData({ ...reservationData, patientId: e.target.value })}
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-nigerian-green"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={submitReservation}
                  className="flex-1 bg-nigerian-green text-white px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-green-700 font-medium"
                >
                  Reserve
                </button>
                <button
                  onClick={() => setShowReservationForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 text-sm sm:text-base rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedAllocation;