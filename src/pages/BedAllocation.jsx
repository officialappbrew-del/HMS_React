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
  ChevronUp,
  Search,
  Grid,
  List,
  Printer,
  Download,
  Edit,
  Eye,
  Calendar,
  User,
  Building2,
  Activity,
  Clipboard,
  Settings,
  HelpCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  Home,
  FileText,
  BarChart3,
  PieChart,
  DollarSign,
  Hospital,
  Stethoscope,
  HeartPulse,
  Pill,
  Ambulance,
  Microscope,
  Syringe,
  Thermometer,
  Weight,
  Ruler,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Camera,
  Video,
  Music,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { selectWard, occupyBed, releaseBed, reserveBed, markBedAvailable } from '../features/wardSlice';

// Tooltip Component
const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow(!show)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 ${positionClasses[position]} whitespace-nowrap`}>
          <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg">
            {text}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
              position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
              'left-[-4px] top-1/2 -translate-y-1/2'
            }`} />
          </div>
        </div>
      )}
    </div>
  );
};

// Icon Button with Tooltip
const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false }) => {
  const variantClasses = {
    default: 'text-gray-400 hover:text-gray-600',
    primary: 'text-blue-600 hover:text-blue-700',
    success: 'text-green-600 hover:text-green-700',
    danger: 'text-red-600 hover:text-red-700',
    warning: 'text-yellow-600 hover:text-yellow-700',
    info: 'text-blue-600 hover:text-blue-700',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-1.5 rounded-lg transition-all duration-200 ${variantClasses[variant]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 active:scale-95'
        }`}
      >
        <Icon className="w-4 h-4" />
      </button>
    </Tooltip>
  );
};

// Button with Tooltip
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '' }) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

const BedAllocation = () => {
  const dispatch = useDispatch();
  const { wards, selectedWard, stats, bedStatus } = useSelector(state => state.ward);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedBed, setSelectedBed] = useState(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [reservationData, setReservationData] = useState({
    bedId: '',
    patientId: ''
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedWardInfo, setExpandedWardInfo] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const getBedStatusColor = (status) => {
    switch (status) {
      case bedStatus.OCCUPIED:
        return 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100';
      case bedStatus.AVAILABLE:
        return 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100';
      case bedStatus.RESERVED:
        return 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100';
      case bedStatus.UNDER_CLEANING:
        return 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100';
      case bedStatus.MAINTENANCE:
        return 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-gray-50 border-gray-300 hover:bg-gray-100';
    }
  };

  const getBedStatusIcon = (status) => {
    switch (status) {
      case bedStatus.OCCUPIED:
        return <Users className="w-4 h-4 sm:w-5 sm:h-5" />;
      case bedStatus.AVAILABLE:
        return <Check className="w-4 h-4 sm:w-5 sm:h-5" />;
      case bedStatus.RESERVED:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5" />;
      case bedStatus.UNDER_CLEANING:
        return <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />;
      case bedStatus.MAINTENANCE:
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return null;
    }
  };

  const getBedStatusBadge = (status) => {
    const badges = {
      'Occupied': 'bg-red-100 text-red-800',
      'Available': 'bg-green-100 text-green-800',
      'Reserved': 'bg-yellow-100 text-yellow-800',
      'Under Cleaning': 'bg-blue-100 text-blue-800',
      'Maintenance': 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredBeds = selectedWard
    ? filterStatus === 'All'
      ? selectedWard.beds
      : selectedWard.beds.filter(bed => bed.status === filterStatus)
    : [];

  // Search beds
  const searchedBeds = filteredBeds.filter(bed => 
    bed.bedNumber.toString().includes(searchQuery) ||
    bed.bedType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (bed.patientId && bed.patientId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  // Stats cards with tooltips
  const statCards = [
    { 
      label: 'Total Beds', 
      value: stats.totalBeds, 
      icon: Bed, 
      color: 'blue',
      tooltip: 'Total number of beds in the selected ward'
    },
    { 
      label: 'Occupied', 
      value: stats.occupiedBeds, 
      icon: Users, 
      color: 'red',
      tooltip: 'Beds currently occupied by patients',
      subtext: `${Math.round((stats.occupiedBeds / stats.totalBeds) * 100)}% occupied`
    },
    { 
      label: 'Available', 
      value: stats.availableBeds, 
      icon: Check, 
      color: 'green',
      tooltip: 'Beds ready for patient admission'
    },
    { 
      label: 'Reserved', 
      value: stats.reservedBeds, 
      icon: Clock, 
      color: 'yellow',
      tooltip: 'Beds reserved for scheduled admissions'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bed className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Bed Allocation
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Real-time bed availability and patient flow management
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonWithTooltip
              onClick={() => window.print()}
              tooltip="Print bed allocation report"
              variant="secondary"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Print</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => alert('Exporting report...')}
              tooltip="Export bed report to file"
              variant="secondary"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Export</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => dispatch(selectWard(wards[0]?.wardId))}
              tooltip="Refresh bed data"
              variant="primary"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Refresh</span>
            </ButtonWithTooltip>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 border-blue-200',
              red: 'bg-red-50 text-red-600 border-red-200',
              green: 'bg-green-50 text-green-600 border-green-200',
              yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200'
            };
            
            return (
              <Tooltip key={index} text={stat.tooltip}>
                <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow cursor-help">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">{stat.label}</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-0.5 sm:mt-1">{stat.value}</p>
                      {stat.subtext && (
                        <p className="text-[10px] text-gray-500 mt-0.5">{stat.subtext}</p>
                      )}
                    </div>
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClasses[stat.color]} rounded-lg flex items-center justify-center border`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>
              </Tooltip>
            );
          })}
        </div>

        {/* Ward Selection and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Select Ward</label>
              <select
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                onChange={(e) => {
                  const ward = wards.find(w => w.wardId === e.target.value);
                  if (ward) dispatch(selectWard(ward.wardId));
                }}
                value={selectedWard?.wardId || ''}
              >
                <option value="">Select a ward...</option>
                {wards.map(ward => (
                  <option key={ward.wardId} value={ward.wardId}>
                    {ward.wardName} ({ward.totalBeds} beds)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Occupied">Occupied</option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Under Cleaning">Under Cleaning</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-xs font-medium text-gray-700 mb-1">Search Beds</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by number, type, patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 sm:pl-9 pr-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Ward Info - Collapsible on Mobile */}
          {selectedWard && (
            <div className="mt-4">
              <button
                onClick={() => setExpandedWardInfo(!expandedWardInfo)}
                className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg lg:hidden"
              >
                <span className="font-medium text-blue-700">Ward Information</span>
                {expandedWardInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <div className={`${expandedWardInfo ? 'block' : 'hidden lg:block'} p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg mt-2 lg:mt-4`}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <Tooltip text="Type of ward">
                    <div className="cursor-help">
                      <p className="text-xs text-gray-600">Ward Type</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedWard.wardType}</p>
                    </div>
                  </Tooltip>
                  <Tooltip text="Floor location">
                    <div className="cursor-help">
                      <p className="text-xs text-gray-600">Floor</p>
                      <p className="text-sm font-semibold text-gray-900">Floor {selectedWard.floor}</p>
                    </div>
                  </Tooltip>
                  <Tooltip text="Ward supervisor">
                    <div className="cursor-help">
                      <p className="text-xs text-gray-600">Supervisor</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedWard.supervisor}</p>
                    </div>
                  </Tooltip>
                  <Tooltip text="Number of staff assigned">
                    <div className="cursor-help">
                      <p className="text-xs text-gray-600">Staff Count</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedWard.staffCount}</p>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bed Grid */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6">
          {/* Toolbar */}
          {selectedWard && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Bed Layout - {selectedWard.wardName}
                <span className="text-xs font-normal text-gray-500 ml-2">
                  ({searchedBeds.length} beds)
                </span>
              </h2>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <IconButton
                  icon={Filter}
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  tooltip={showMobileFilters ? "Hide filters" : "Show filters"}
                  variant="default"
                  className="lg:hidden"
                />
                <IconButton
                  icon={viewMode === 'grid' ? List : Grid}
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  tooltip={viewMode === 'grid' ? "Switch to list view" : "Switch to grid view"}
                  variant="default"
                />
                <IconButton
                  icon={RefreshCw}
                  onClick={() => dispatch(selectWard(selectedWard.wardId))}
                  tooltip="Refresh bed data"
                  variant="default"
                />
              </div>
            </div>
          )}

          {!selectedWard ? (
            <div className="text-center py-12 text-gray-500">
              <Bed className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="text-base sm:text-lg font-medium text-gray-900">Select a Ward</p>
              <p className="text-sm text-gray-500 mt-1">Choose a ward from the dropdown above to view bed allocation</p>
            </div>
          ) : searchedBeds.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
              <p className="text-base sm:text-lg font-medium text-gray-900">No beds found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery ? 'Try adjusting your search' : 'No beds match the current filter'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
              {searchedBeds.map(bed => (
                <Tooltip key={bed.bedId} text={`Bed ${bed.bedNumber} - ${bed.status}`}>
                  <div
                    onClick={() => setSelectedBed(bed)}
                    className={`p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md active:scale-95 ${getBedStatusColor(bed.status)}`}
                  >
                    <div className="flex items-center justify-center mb-1 sm:mb-2">
                      {getBedStatusIcon(bed.status)}
                    </div>
                    <p className="font-semibold text-xs sm:text-sm text-center truncate">B{bed.bedNumber}</p>
                    <p className="text-[10px] sm:text-xs text-center text-gray-600 truncate">{bed.bedType}</p>
                    {bed.status === bedStatus.OCCUPIED && bed.patientId && (
                      <p className="text-[10px] text-center mt-0.5 font-medium text-red-600 truncate">
                        Patient: {bed.patientId.slice(0, 6)}...
                      </p>
                    )}
                    {bed.status === bedStatus.RESERVED && (
                      <p className="text-[10px] text-center mt-0.5 font-medium text-yellow-600">
                        Reserved
                      </p>
                    )}
                  </div>
                </Tooltip>
              ))}
            </div>
          ) : (
            // List View
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed</th>
                    <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="pb-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {searchedBeds.map(bed => (
                    <tr key={bed.bedId} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <div className="font-medium text-sm">Bed {bed.bedNumber}</div>
                        <div className="text-xs text-gray-500">{bed.bedType}</div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getBedStatusBadge(bed.status)}`}>
                          {bed.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {bed.patientId ? (
                          <span className="text-sm">{bed.patientId}</span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <IconButton
                            icon={Eye}
                            onClick={() => setSelectedBed(bed)}
                            tooltip="View bed details"
                            variant="primary"
                          />
                          {bed.status === bedStatus.AVAILABLE && (
                            <IconButton
                              icon={Clock}
                              onClick={() => handleReserve(bed.bedId)}
                              tooltip="Reserve this bed"
                              variant="warning"
                            />
                          )}
                          {bed.status === bedStatus.OCCUPIED && (
                            <IconButton
                              icon={Trash2}
                              onClick={() => handleReleaseBed(bed.bedId)}
                              tooltip="Release bed"
                              variant="danger"
                            />
                          )}
                          {bed.status === bedStatus.UNDER_CLEANING && (
                            <IconButton
                              icon={Check}
                              onClick={() => handleMarkAvailable(bed.bedId)}
                              tooltip="Mark as available"
                              variant="success"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">Status Legend:</p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {Object.entries(bedStatus).map(([key, value]) => (
                <Tooltip key={key} text={`${value} beds`}>
                  <div className="flex items-center gap-1.5 cursor-help">
                    <div className={`w-3 h-3 rounded-full ${getBedStatusColor(value).split(' ')[0]}`}></div>
                    <span className="text-xs text-gray-600">{value}</span>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bed Details Modal/Slide-over */}
      {selectedBed && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setSelectedBed(null)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Bed {selectedBed.bedNumber} Details
                </h2>
                <IconButton
                  icon={X}
                  onClick={() => setSelectedBed(null)}
                  tooltip="Close details"
                  variant="default"
                />
              </div>
              
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Bed Number</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedBed.bedNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className={`text-sm font-semibold mt-1 ${getBedStatusColor(selectedBed.status)}`}>
                      {selectedBed.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bed Type</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedBed.bedType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Patient ID</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedBed.patientId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cleaning Status</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedBed.cleaningStatus}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Private Bed</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedBed.isPrivate ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Cleaned</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {new Date(selectedBed.lastCleaned).toLocaleTimeString('en-NG', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Turnover</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {new Date(selectedBed.lastTurnover).toLocaleDateString('en-NG', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  {selectedBed.status === bedStatus.AVAILABLE && (
                    <ButtonWithTooltip
                      onClick={() => handleReserve(selectedBed.bedId)}
                      tooltip="Reserve this bed for a patient"
                      variant="warning"
                      className="flex-1 min-w-[120px]"
                    >
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Reserve Bed
                    </ButtonWithTooltip>
                  )}

                  {selectedBed.status === bedStatus.OCCUPIED && (
                    <ButtonWithTooltip
                      onClick={() => handleReleaseBed(selectedBed.bedId)}
                      tooltip="Release bed and mark for cleaning"
                      variant="danger"
                      className="flex-1 min-w-[120px]"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Release Bed
                    </ButtonWithTooltip>
                  )}

                  {selectedBed.status === bedStatus.UNDER_CLEANING && (
                    <ButtonWithTooltip
                      onClick={() => handleMarkAvailable(selectedBed.bedId)}
                      tooltip="Mark bed as available for admission"
                      variant="success"
                      className="flex-1 min-w-[120px]"
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Mark Available
                    </ButtonWithTooltip>
                  )}

                  {selectedBed.status === bedStatus.RESERVED && (
                    <ButtonWithTooltip
                      onClick={() => handleReleaseBed(selectedBed.bedId)}
                      tooltip="Cancel reservation"
                      variant="danger"
                      className="flex-1 min-w-[120px]"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Cancel Reservation
                    </ButtonWithTooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {showReservationForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-3 sm:px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setShowReservationForm(false)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Reserve Bed</h3>
                  <IconButton
                    icon={X}
                    onClick={() => setShowReservationForm(false)}
                    tooltip="Close"
                    variant="default"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Bed ID</label>
                    <input
                      type="text"
                      disabled
                      value={reservationData.bedId}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Patient ID *</label>
                    <input
                      type="text"
                      placeholder="Enter patient ID"
                      value={reservationData.patientId}
                      onChange={(e) => setReservationData({ ...reservationData, patientId: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <ButtonWithTooltip
                      onClick={submitReservation}
                      tooltip="Reserve the bed for this patient"
                      variant="primary"
                      className="flex-1"
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Reserve
                    </ButtonWithTooltip>
                    <ButtonWithTooltip
                      onClick={() => setShowReservationForm(false)}
                      tooltip="Cancel reservation"
                      variant="secondary"
                      className="flex-1"
                    >
                      Cancel
                    </ButtonWithTooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedAllocation;