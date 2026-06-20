import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { Building2, Plus, AlertCircle, TrendingDown, CheckCircle, Menu, X, Search, Filter } from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { addDepartmentRequisition, updateDepartmentRequisition } from '../features/centralStoreSlice';

const CentralStore = () => {
  // Add safe defaults for Redux state
  const centralStore = useSelector(state => state.centralStore || {});
  const dispatch = useDispatch();

  const locations = centralStore.locations || [];
  const departmentRequisitions = centralStore.departmentRequisitions || [];
  const issueTracking = centralStore.issueTracking || [];
  const stockTransfers = centralStore.stockTransfers || [];

  const [activeTab, setActiveTab] = useState('locations');
  const [showModal, setShowModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Safe filtering with null checks
  const pendingRequisitions = departmentRequisitions.filter(r => r && r.status === 'Pending Approval');
  
  const totalCapacity = locations.reduce((sum, loc) => {
    if (!loc || !loc.capacity) return sum;
    return sum + loc.capacity;
  }, 0);
  
  const totalUtilization = locations.reduce((sum, loc) => {
    if (!loc || !loc.currentUtilization) return sum;
    return sum + loc.currentUtilization;
  }, 0);

  const getStockStatus = (items) => {
    if (!items || !Array.isArray(items)) return { high: 0, low: 0 };
    const high = items.filter(i => i && i.quantity > 100).length;
    const low = items.filter(i => i && i.quantity <= 50).length;
    return { high, low };
  };

  // Filter items based on search query for active tab
  const getFilteredItems = () => {
    if (!searchQuery) {
      switch(activeTab) {
        case 'locations': return locations;
        case 'requisitions': return departmentRequisitions;
        case 'issues': return issueTracking;
        case 'transfers': return stockTransfers;
        default: return [];
      }
    }

    const query = searchQuery.toLowerCase();
    switch(activeTab) {
      case 'locations':
        return locations.filter(loc => 
          loc.name?.toLowerCase().includes(query) ||
          loc.address?.toLowerCase().includes(query) ||
          loc.type?.toLowerCase().includes(query)
        );
      case 'requisitions':
        return departmentRequisitions.filter(req =>
          req.requisitionId?.toLowerCase().includes(query) ||
          req.requestingDepartment?.toLowerCase().includes(query) ||
          req.status?.toLowerCase().includes(query)
        );
      case 'issues':
        return issueTracking.filter(issue =>
          issue.issueId?.toLowerCase().includes(query) ||
          issue.issuedTo?.toLowerCase().includes(query) ||
          issue.status?.toLowerCase().includes(query)
        );
      case 'transfers':
        return stockTransfers.filter(transfer =>
          transfer.transferId?.toLowerCase().includes(query) ||
          transfer.fromLocation?.toLowerCase().includes(query) ||
          transfer.toLocation?.toLowerCase().includes(query)
        );
      default: return [];
    }
  };

  const filteredItems = getFilteredItems();
  const utilizationPercentage = totalCapacity > 0 ? Math.round((totalUtilization / totalCapacity) * 100) : 0;

  const handleCreateRequisition = () => {
    console.log('Creating new requisition');
    setShowModal(false);
  };

  return (
    <div className="central-store p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Mobile Menu Button */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 rounded-lg bg-white shadow-md"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="text-lg font-bold text-gray-800">Central Store</div>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <Building2 className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 text-blue-600" />
            Central Store Management
          </h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Multi-location warehouse, requisitions, transfers & waste management</p>
        </div>
        
        {/* Search Bar - Mobile Top */}
        <div className="md:hidden w-full mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Responsive Action Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto px-4 py-2.5 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center justify-center text-sm md:text-base transition-colors duration-200"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2 flex-shrink-0" />
          <span className="truncate">
            <span className="hidden sm:inline">New Requisition</span>
            <span className="sm:hidden">Requisition</span>
          </span>
        </button>
      </div>

      {/* Search Bar - Desktop */}
      <div className="hidden md:block mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search in ${activeTab}...`}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-blue-600">
          <div className="flex items-center">
            <Building2 className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-blue-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Storage Locations</p>
              <p className="text-blue-600 font-bold text-lg md:text-xl lg:text-2xl">{locations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-green-600">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-green-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Total Requisitions</p>
              <p className="text-green-600 font-bold text-lg md:text-xl lg:text-2xl">{departmentRequisitions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-orange-600">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-orange-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Pending Approval</p>
              <p className="text-orange-600 font-bold text-lg md:text-xl lg:text-2xl">{pendingRequisitions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-purple-600">
          <div className="flex items-center">
            <TrendingDown className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-purple-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Stock Transfers</p>
              <p className="text-purple-600 font-bold text-lg md:text-xl lg:text-2xl">{stockTransfers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-4 lg:p-6 border-l-4 border-red-600 col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="flex items-center">
            <TrendingDown className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-red-600 mr-2 md:mr-3" />
            <div>
              <p className="text-gray-600 text-xs md:text-sm">Utilization</p>
              <p className="text-red-600 font-bold text-lg md:text-xl lg:text-2xl">{utilizationPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { setActiveTab('locations'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'locations' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                }`}
              >
                Locations ({locations.length})
              </button>
              <button
                onClick={() => { setActiveTab('requisitions'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'requisitions' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                }`}
              >
                Requisitions ({departmentRequisitions.length})
              </button>
              <button
                onClick={() => { setActiveTab('issues'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'issues' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                }`}
              >
                Issues ({issueTracking.length})
              </button>
              <button
                onClick={() => { setActiveTab('transfers'); setShowMobileMenu(false); }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium ${
                  activeTab === 'transfers' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
                }`}
              >
                Transfers ({stockTransfers.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="hidden md:flex gap-2 lg:gap-4 mb-4 lg:mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('locations')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'locations'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Locations ({locations.length})
        </button>
        <button
          onClick={() => setActiveTab('requisitions')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'requisitions'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Requisitions ({departmentRequisitions.length})
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'issues'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Issues ({issueTracking.length})
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={`px-3 py-2 lg:px-4 lg:py-3 font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${
            activeTab === 'transfers'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Transfers ({stockTransfers.length})
        </button>
      </div>

      {/* Mobile Tab Indicator */}
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
          <span className="font-medium text-gray-700">
            {activeTab === 'locations' && `Locations (${filteredItems.length})`}
            {activeTab === 'requisitions' && `Requisitions (${filteredItems.length})`}
            {activeTab === 'issues' && `Issues (${filteredItems.length})`}
            {activeTab === 'transfers' && `Transfers (${filteredItems.length})`}
          </span>
          <button 
            onClick={() => setShowMobileMenu(true)}
            className="p-1 rounded-md bg-gray-100"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Empty State Message */}
      {filteredItems.length === 0 && searchQuery && (
        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            No {activeTab} found matching "<span className="font-semibold">{searchQuery}</span>"
          </p>
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="col-span-1 lg:col-span-2 bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <Building2 className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No storage locations found</p>
            </div>
          ) : (
            filteredItems.map(location => {
              const utilPercentage = location.capacity > 0 
                ? ((location.currentUtilization || 0) / location.capacity) * 100 
                : 0;
              const status = getStockStatus(location.items || []);
              return (
                <div key={location.locationId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-blue-600">
                  <h3 className="font-bold text-base md:text-lg mb-2 md:mb-4 truncate">{location.name || 'Unnamed Location'}</h3>
                  <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3 truncate">{location.address || 'No address'}</p>
                  
                  <div className="space-y-3 mb-3 md:mb-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs md:text-sm text-gray-600">Capacity Utilization</p>
                        <p className="text-xs md:text-sm font-medium">
                          {location.currentUtilization || 0} / {location.capacity || 0} units
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${utilPercentage > 80 ? 'bg-red-600' : utilPercentage > 60 ? 'bg-yellow-600' : 'bg-green-600'}`} 
                          style={{ width: `${Math.min(utilPercentage, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">({utilPercentage.toFixed(0)}%)</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="text-gray-600 text-xs">Manager</p>
                        <p className="font-bold text-xs truncate">
                          {location.manager?.split(' ')[0] || location.manager || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <p className="text-gray-600 text-xs">Type</p>
                        <p className="font-bold text-xs truncate">{location.type || 'General'}</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <p className="text-gray-600 text-xs">Status</p>
                        <p className="font-bold text-xs text-green-600 truncate">{location.status || 'Active'}</p>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <p className="truncate">
                        <span className="font-medium">Security:</span> {location.securityLevel || 'Standard'}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {location.phone || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedLocation(location.locationId)}
                    className="w-full bg-blue-100 text-blue-700 px-3 py-2 rounded text-xs md:text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Requisitions Tab */}
      {activeTab === 'requisitions' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center">
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No requisitions found</p>
            </div>
          ) : (
            filteredItems.map(req => (
              <div key={req.requisitionId} className={`rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 ${
                req.status === 'Pending Approval' ? 'bg-orange-50 border-l-4 border-orange-600' :
                req.status === 'Approved' ? 'bg-green-50 border-l-4 border-green-600' :
                'bg-blue-50 border-l-4 border-blue-600'
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Requisition ID</p>
                    <p className="font-bold text-sm md:text-base truncate">{req.requisitionId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Department</p>
                    <p className="font-bold text-xs md:text-sm truncate">{req.requestingDepartment || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Request Date</p>
                    <p className="font-bold text-xs md:text-sm">
                      {req.requestDate ? new Date(req.requestDate).toLocaleDateString('en-NG') : 'No Date'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Status</p>
                    <p className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      req.status === 'Pending Approval' ? 'bg-orange-200 text-orange-800' :
                      req.status === 'Approved' ? 'bg-green-200 text-green-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {req.status || 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="mb-3 md:mb-4">
                  <p className="text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">Items Requested:</p>
                  <div className="space-y-1 md:space-y-2">
                    {(req.items || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs md:text-sm p-2 bg-white bg-opacity-50 rounded">
                        <span className="truncate flex-1 mr-2">{item.description || 'Item'}</span>
                        <span className="font-bold whitespace-nowrap">
                          {item.quantity || 0} x ₦{(item.unitCost || 0).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs md:text-sm font-bold mt-2 text-right">
                    Total: ₦{(req.totalValue || 0).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {req.status === 'Pending Approval' ? (
                    <>
                      <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-xs md:text-sm font-medium hover:bg-green-700 transition-colors">
                        Approve
                      </button>
                      <button className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-xs md:text-sm font-medium hover:bg-red-700 transition-colors">
                        Reject
                      </button>
                    </>
                  ) : req.status === 'Approved' ? (
                    <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors">
                      Issue from Store
                    </button>
                  ) : (
                    <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-xs md:text-sm font-medium hover:bg-gray-700 transition-colors">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Issues Tab */}
      {activeTab === 'issues' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center border-l-4 border-green-600">
              <AlertCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No issue records found</p>
            </div>
          ) : (
            filteredItems.map(issue => (
              <div key={issue.issueId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-green-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Issue ID</p>
                    <p className="font-bold text-sm md:text-base truncate">{issue.issueId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Department</p>
                    <p className="font-bold text-xs md:text-sm truncate">{issue.issuedTo || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Issued Date</p>
                    <p className="font-bold text-xs md:text-sm">
                      {issue.issueDate ? new Date(issue.issueDate).toLocaleDateString('en-NG') : 'No Date'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Status</p>
                    <p className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-200 text-green-800">
                      {issue.status || 'Issued'}
                    </p>
                  </div>
                </div>

                <div className="text-xs md:text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Issued By:</span> <span className="font-bold">{issue.issuedBy || 'Unknown'}</span>
                  </p>
                  <p>
                    <span className="font-medium">Received By:</span> <span className="font-bold">{issue.receivedBy || 'Not received'}</span>
                  </p>
                  <p>
                    <span className="font-medium">Received Date:</span> <span className="font-bold">
                      {issue.receivedDate ? new Date(issue.receivedDate).toLocaleDateString('en-NG') : 'Not received'}
                    </span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Transfers Tab */}
      {activeTab === 'transfers' && (
        <div className="space-y-3 md:space-y-4">
          {filteredItems.length === 0 && !searchQuery ? (
            <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-6 md:p-8 text-center border-l-4 border-purple-600">
              <TrendingDown className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-600 font-medium text-sm md:text-base">No stock transfers found</p>
            </div>
          ) : (
            filteredItems.map(transfer => (
              <div key={transfer.transferId} className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-4 md:p-6 border-l-4 border-purple-600">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Transfer ID</p>
                    <p className="font-bold text-sm md:text-base truncate">{transfer.transferId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">From</p>
                    <p className="font-bold text-xs md:text-sm truncate">{transfer.fromLocation || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">To</p>
                    <p className="font-bold text-xs md:text-sm truncate">{transfer.toLocation || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Status</p>
                    <p className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-200 text-green-800">
                      {transfer.status || 'Pending'}
                    </p>
                  </div>
                </div>

                <div className="mb-2 md:mb-3 p-2 md:p-3 bg-gray-50 rounded">
                  <p className="text-xs md:text-sm font-semibold text-gray-700">
                    Reason: <span className="text-gray-600">{transfer.reason || 'No reason provided'}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">Transfer Date:</span> <span className="font-bold">
                        {transfer.transferDate ? new Date(transfer.transferDate).toLocaleDateString('en-NG') : 'No Date'}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Authorized By:</span> <span className="font-bold">{transfer.authorizedBy || 'Unknown'}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium">Received Date:</span> <span className="font-bold">
                        {transfer.receivedDate ? new Date(transfer.receivedDate).toLocaleDateString('en-NG') : 'Not received'}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Received By:</span> <span className="font-bold">{transfer.receivedBy || 'Not received'}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      <GenericModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Requisition"
        size="lg"
      >
        <div className="space-y-3 md:space-y-4">
          <select className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base">
            <option value="">Select Department</option>
            <option value="emergency">Emergency Ward</option>
            <option value="maternity">Maternity Ward</option>
            <option value="icu">ICU</option>
            <option value="laboratory">Laboratory</option>
            <option value="radiology">Radiology</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="admin">Administration</option>
          </select>
          <input type="text" placeholder="Item Description" className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
          <input type="number" placeholder="Quantity Required" className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base" />
          <select className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg text-sm md:text-base">
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
          <div className="flex gap-2 pt-2">
            <button onClick={handleCreateRequisition} className="flex-1 bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 font-medium text-sm md:text-base transition-colors">
              Create Requisition
            </button>
            <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-2 rounded-lg hover:bg-gray-400 font-medium text-sm md:text-base transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default CentralStore;